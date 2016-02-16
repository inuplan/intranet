//-----------------------------------------------------------------------
// <copyright file="MiddlewareConfig.cs" company="Inuplan">
//    Original work Copyright (c) Inuplan
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy
//    of this software and associated documentation files (the "Software"), to deal
//    in the Software without restriction, including without limitation the rights
//    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//    copies of the Software, and to permit persons to whom the Software is
//    furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in
//    all copies or substantial portions of the Software.
// </copyright>
//-----------------------------------------------------------------------

namespace Inuplan.WebAPI.Middlewares.JWT
{
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Net;
    using System.Threading.Tasks;
    using Common.DTOs;
    using Common.Models;
    using Common.Tools;
    using Microsoft.Owin;
    using Optional;
    using AppFunc = System.Func<System.Collections.Generic.IDictionary<string, object>, System.Threading.Tasks.Task>;

    /// <summary>
    /// An <code>OWIN</code> middleware that ensures claims are wellformed and properly fills out the claims for the <code>JWT token</code>.<br />
    /// If a <code>JWT</code> token has missing claims, a HTTP 400 BadRequest is returned.
    /// This middleware retrieves information about a user from the active directory services.
    /// </summary>
    public class JWTClaimsRetriever
    {
        /// <summary>
        /// The next middleware
        /// </summary>
        private readonly AppFunc next;

        /// <summary>
        /// The configuration options for this middleware
        /// </summary>
        private readonly JWTClaimsRetrieverOptions options;
        
        /// <summary>
        /// Instantiates a new instance of the <see cref="JWTClaimsRetriever"/> class.
        /// </summary>
        /// <param name="next">The next <code>OWIN</code> middleware</param>
        /// <param name="options">The options configuration for this middleware</param>
        public JWTClaimsRetriever(AppFunc next, JWTClaimsRetrieverOptions options)
        {
            this.next = next;
            this.options = options;
        }

        /// <summary>
        /// Gets and fills the role for the JWT claims
        /// or simply does nothing if user already has been verified
        /// </summary>
        /// <param name="environment">The environment</param>
        /// <returns>Returns an awaitable task</returns>
        public async Task Invoke(IDictionary<string, object> environment)
        {
            var context = (IOwinContext)(new OwinContext(environment));
            var oClaims = context.Get<ClaimsDTO>(Constants.JWT_CLAIMS).SomeNotNull();

            await oClaims.Match(
                async claims =>
                {
                    var user = await GetOrCreateUser(claims);
                    user.Match(async u =>
                    {
                        if (!claims.Verified)
                        {
                            // Update the JWT claims with the correct info
                            claims.FirstName = u.FirstName;
                            claims.LastName = u.LastName;
                            claims.Email = u.Email;
                            claims.Role = u.Role;

                            // Set the verify flag to true
                            claims.Verified = true;

                            // Sign token
                            Jose.JWT.JsonMapper = options.Mapper;
                            var token = Jose.JWT.Encode(claims, options.Secret, Jose.JwsAlgorithm.HS256);
                            var bearer = new string[] { string.Format("Bearer {0}", token) };

                            // Add to response header
                            context.Response.Headers.Add(Constants.HTTP_AUTHORIZATION, bearer);
                        }

                        // Proceed to the next middleware
                        await next.Invoke(environment);
                    },
                    () =>
                    {
                        // Internal error
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        context.Response.ReasonPhrase = "Could not get or create user in the database";
                    });

                    return await Task.FromResult(0);
                },
                () =>
                {
                    // Could log error. Should never happen according to unit tests...
                    Debug.Assert(false, "This invariant should never happen IF this middleware is called AFTER JWTValidator");
                    return Task.FromResult(-1);
                });
        }

        /// <summary>
        /// Gets or creates a new user in the database
        /// A new user is given the role <see cref="RoleType.User"/> by default
        /// </summary>
        /// <param name="c">The claims of the <code>JWT</code> token</param>
        /// <returns>Returns an awaitable task which contains a <see cref="User"/></returns>
        private async Task<Option<User>> GetOrCreateUser(ClaimsDTO c)
        {
            // Try to get user from database
            var oUser = await options.UserDatabaseRepository.Get(c.Username);

            var user = oUser.Match(
               // Return user, if it is a valid user
               some: dbUser => dbUser.SomeWhen(ValidDBUser),

               // This should only be run once for every user
               none: () =>
               {
                   // If user does not exist in the database, then we must first retrieve it from active directory
                   var adUser = options.UserActiveDirectoryRepository.Get(c.Username).Result.Filter(ValidADUser);

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
                       some: u => options.UserDatabaseRepository.Create(u).Result,

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
        public bool ValidDBUser(User user)
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
