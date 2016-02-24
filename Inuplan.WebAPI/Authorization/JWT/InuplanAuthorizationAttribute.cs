﻿// Copyright © 2015 Inuplan
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

namespace Inuplan.WebAPI.Authorization.JWT
{
    using Autofac.Integration.WebApi;
    using Common.DTOs;
    using Common.Models;
    using Common.Repositories;
    using Jose;
    using NLog;
    using Optional;
    using Optional.Unsafe;
    using Principal;
    using System.Diagnostics;
    using System.Threading;
    using System.Web.Http.Controllers;

    /// <summary>
    /// Custom authorization filter, that uses <code>JWT</code> tokens
    /// and database as well as active directory to either create or authorize users.
    /// </summary>
    public class InuplanAuthorizationAttribute : IAutofacAuthorizationFilter
    {
        /// <summary>
        /// The logging framework
        /// </summary>
        private static Logger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Secret key used to sign tokens
        /// </summary>
        private readonly byte[] key;

        /// <summary>
        /// The mapper to and from json
        /// </summary>
        private readonly IJsonMapper mapper;

        /// <summary>
        /// The user database repository
        /// </summary>
        private readonly IRepository<string, User> userDatabaseRepository;

        /// <summary>
        /// The user active directory repository
        /// </summary>
        private readonly IRepository<string, User> userActiveDirectoryRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="InuplanAuthorizationAttribute"/> class.
        /// </summary>
        /// <param name="key">The key used for signing tokens</param>
        /// <param name="mapper">The json mapper</param>
        /// <param name="userDatabaseRepository">The user database repository</param>
        /// <param name="userActiveDirectoryRepository">The user active directory repository</param>
        public InuplanAuthorizationAttribute(byte[] key, IJsonMapper mapper,
            IRepository<string, User> userDatabaseRepository,
            IRepository<string, User> userActiveDirectoryRepository)
        {
            Debug.Assert(key.Length == 32, "Key should be (8 * 32) = 256 bits long because we use HS256 encryption");
            this.key = key;
            this.mapper = mapper;
            this.userDatabaseRepository = userDatabaseRepository;
            this.userActiveDirectoryRepository = userActiveDirectoryRepository;
        }

        /// <summary>
        /// Authorizes a request
        /// </summary>
        /// <param name="actionContext"></param>
        public void OnAuthorization(HttpActionContext actionContext)
        {
            var bearer = actionContext.Request.Headers.Authorization.Parameter
                                    .SomeWhen(h => h != null && h.Contains("Bearer"));
            var token = bearer.Map(header => header.Split(' ')[1]);

            // Process the JWT token into a claim
            var claims = token.FlatMap(t => decode(t, key));

            // Get or create the user
            var user = claims.FlatMap(c => GetOrCreateUser(c));

            if(claims.HasValue && user.HasValue)
            {
                var c = claims.ValueOrFailure();
                var u = user.ValueOrFailure();

                if (!c.Verified)
                {
                    // Update the JWT claims with the correct info
                    c.ID = u.ID;
                    c.FirstName = u.FirstName;
                    c.LastName = u.LastName;
                    c.Email = u.Email;
                    c.Role = u.Role;

                    // Set the verify flag to true
                    c.Verified = true;

                    // Sign token
                    var t = JWT.Encode(c, key, JwsAlgorithm.HS256);
                    var b = new string[] { string.Format("Bearer {0}", t) };

                    // Add to response header
                    actionContext.Response.Headers.Add("Authorization", b);
                }

                // Set the principal to custom user
                var genericPrincipal = actionContext.RequestContext.Principal;
                var principal = new InuplanPrincipal(genericPrincipal.Identity, new string[] { u.Role.ToString() }, u);
                Thread.CurrentPrincipal = principal;
                if(System.Web.HttpContext.Current.User != null)
                {
                    System.Web.HttpContext.Current.User = principal;
                }
            }
            else
            {
                actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
            }
        }

        /// <summary>
        /// Decodes the token and returns some if succesfull otherwise it returns none.
        /// </summary>
        /// <param name="token">The JWT token</param>
        /// <param name="key">The key</param>
        /// <returns>An optional value depending on whether the decoding process has been succesfull</returns>
        private Option<ClaimsDTO> decode(string token, byte[] key)
        {
            var result = Option.None<ClaimsDTO>();
            try
            {
                var data = JWT.Decode<ClaimsDTO>(token, key);

                // returns None if user has been verified and been given None role
                result = data.SomeWhen(c =>
                {
                    // If the claim - claims to be verified, we validate it
                    if (c.Verified) return ValidVerifiedClaim(c);

                    // Otherwise if the username does not exists, it is invalid
                    return !string.IsNullOrEmpty(c.Username);
                });
            }
            catch (IntegrityException ex)
            {
                /* Log failure */
                logger.Error(ex);
            }

            // If claims does NOT contain a username, then it is invalid
            return result;
        }

        /// <summary>
        /// A valid verified claim must contain every property and
        /// <see cref="RoleType"/> must not be <see cref="RoleType.None"/> as well as
        /// <see cref="ClaimsDTO.ID"/> must be greater than zero.
        /// </summary>
        /// <param name="c">The claim to check</param>
        /// <returns>If valid claim, then true otherwise false</returns>
        private bool ValidVerifiedClaim(ClaimsDTO c)
        {
            return
                c.ID > 0 &&
                c.Role != RoleType.None &&
                !string.IsNullOrEmpty(c.FirstName) &&
                !string.IsNullOrEmpty(c.LastName) &&
                !string.IsNullOrEmpty(c.Username) &&
                !string.IsNullOrEmpty(c.Email);
        }

        /// <summary>
        /// Gets or creates a new user in the database
        /// A new user is given the role <see cref="RoleType.User"/> by default
        /// </summary>
        /// <param name="c">The claims of the <code>JWT</code> token</param>
        /// <returns>Returns an awaitable task which contains a <see cref="User"/></returns>
        private Option<User> GetOrCreateUser(ClaimsDTO c)
        {
            if(c.Verified)
            {
                return (new User
                {
                    ID = c.ID,
                    Username = c.Username,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Role = c.Role,
                }).Some();
            }

            // Try to get user from database
            var oUser = userDatabaseRepository.Get(c.Username).Result;

            var user = oUser.Match(
               // Return user, if it is a valid user
               some: dbUser => dbUser.SomeWhen(ValidDBUser),

               // This should only be run once for every user
               none: () =>
               {
                   // If user does not exist in the database, then we must first retrieve it from active directory
                   var adUser = userActiveDirectoryRepository.Get(c.Username).Result.Filter(ValidADUser);

                   // Transform role to the provided role in the claims
                   // If no role is present, then default to User role
                   var adUserWithRole = adUser.Map(u =>
                   {
                       if (c.Role != RoleType.None)
                           u.Role = c.Role;
                       else
                           u.Role = RoleType.User;
                       return u;
                   });

                   return adUser.Match(
                       // Create user in the database and return it
                       some: u => userDatabaseRepository.Create(u).Result,

                       // Could not retrieve a valid user from AD
                       none: () => Option.None<User>());
               });

            return user;
        }

        /// <summary>
        /// Checks if a user is a valid active directory user
        /// </summary>
        /// <param name="user">The user to check</param>
        /// <returns>Returns true if valid otherwise it returns false</returns>
        private bool ValidADUser(User user)
        {
            return ValidUser(user, withID: false, roleCanBeNone: true);
        }

        /// <summary>
        /// Checks if a user is a valid database user
        /// </summary>
        /// <param name="user">The user to check</param>
        /// <returns>Returns true if valid otherwise it returns false</returns>
        private bool ValidDBUser(User user)
        {
            return ValidUser(user, withID: true);
        }

        /// <summary>
        /// A user is valid when the user has a <see cref="User.FirstName"/>, and a <see cref="User.LastName"/>
        /// as well as an <see cref="User.Email"/> address. Furthermore the <see cref="User.Role"/> must NOT be <see cref="RoleType.None"/>.
        /// </summary>
        /// <param name="user">The user to check</param>
        /// <param name="withID">Should check the ID? if set to true then it checks that ID is greater than zero</param>
        /// <param name="roleCanBeNone">Should check the role if it is none</param>
        /// <returns>A boolean value, indicating whether the user is valid</returns>
        private bool ValidUser(User user, bool withID = false, bool roleCanBeNone = false)
        {
            return (withID ? user.ID > 0 : true) &&
                !string.IsNullOrEmpty(user.FirstName) &&
                !string.IsNullOrEmpty(user.LastName) &&
                !string.IsNullOrEmpty(user.Email) &&
                (roleCanBeNone ? true : user.Role != RoleType.None);
        }
    }
}
