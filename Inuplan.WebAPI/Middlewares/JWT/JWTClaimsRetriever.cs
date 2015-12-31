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
    using System.DirectoryServices.AccountManagement;
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

        // TODO: Create an options class... for this middleware
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
                            context.Response.Headers.Add("Authorization", bearer);
                        }

                        // Proceed to the next middleware
                        await next.Invoke(environment);
                    },
                    () =>
                    {
                        // Internal error
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        context.Response.ReasonPhrase = "Could not create user in the database";
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
            var oUser = await options.UserRepository.Get(c.Username);
            var created = false;

            var user = oUser.ValueOr(() =>
            {
                // User does not exist
                // This should only run once when a user first tries to use the service
                // Get user details from AD 
                var principalContext = new PrincipalContext(ContextType.Domain, options.Domain);
                var adUser = UserPrincipal.FindByIdentity(principalContext, c.Username);

                // Construct user
                var u = new User
                {
                    FirstName = adUser.GivenName,
                    LastName = adUser.Surname,
                    Email = adUser.EmailAddress,
                    Role = RoleType.User
                };

                // Save the user in the database...
                var dbUser = options.UserRepository.Create(u).Result;

                // Check if user has been created
                created = dbUser.HasValue;

                return u;
            });

            // Returns a user if it has succesfully been created in the database
            return user.SomeWhen(u => created);
        }
    }
}
