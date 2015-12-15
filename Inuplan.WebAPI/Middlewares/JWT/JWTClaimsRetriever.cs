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
    using System.Diagnostics;
    using System.DirectoryServices.AccountManagement;
    using System.Threading.Tasks;
    using Inuplan.Common.DTOs;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Inuplan.Common.Tools;
    using Microsoft.Owin;
    using Optional;

    /// <summary>
    /// An <code>OWIN</code> middleware that ensures claims are wellformed and properly fills out the claims for the <code>JWT token</code>.<br />
    /// If a <code>JWT</code> token has missing claims, a HTTP 400 BadRequest is returned.
    /// This middleware retrieves information about a user from the active directory services.
    /// </summary>
    public class JWTClaimsRetriever : OwinMiddleware
    {
        /// <summary>
        /// The domain name for this domain.<br />
        /// e.g.: corporation.local
        /// </summary>
        private readonly string domain;

        /// <summary>
        /// User repository
        /// </summary>
        private readonly IRepository<string, User> userRepository;

        /// <summary>
        /// Instantiates a new instance of the <see cref="JWTClaimsRetriever"/> class.
        /// </summary>
        /// <param name="next">The next <code>OWIN</code> middleware</param>
        /// <param name="options">Options configuration</param>
        public JWTClaimsRetriever(OwinMiddleware next, JWTClaimsRetrieverOptions options)
            : base(next)
        {
            userRepository = options.UserRepository;
            domain = options.Domain;
        }

        /// <summary>
        /// Gets and fills the role for the JWT claims
        /// or simply does nothing if user already has been verified
        /// </summary>
        /// <param name="environment">The environment</param>
        /// <returns>Returns an awaitable task</returns>
        public override async Task Invoke(IOwinContext context)
        {
            var oClaims = context.Get<Option<ClaimsDTO>>(Constants.JWT_CLAIMS);

            await Task.Run(() =>
            {
                var claims = oClaims.Map(
                    c =>
                    {
                        // Get if token has been verified (a repeat user)
                        // if not, then we must retrieve the roles from the database
                        if (!c.Verified)
                        {
                            var user = GetOrCreateUser(c).Result;

                            // Fill the jwt claims with the correct user info
                            c.FirstName = user.FirstName;
                            c.LastName = user.LastName;
                            c.Role = user.Role;

                            // Set verify flag to true
                            c.Verified = true;
                        }
                        else
                        {
                            // We assume that every verified user
                            // has been given a valid role
                            Debug.Assert(c.Role != RoleType.None);
                            if (c.Role == RoleType.None)
                            {
                                c.Verified = false;
                            }
                        }

                        return c;
                    });

                claims.Match(async c =>
                {
                    // Updates claims
                    context.Set(Constants.JWT_CLAIMS, c.Some());

                    // Proceed with the OWIN pipeline
                    await Next.Invoke(context);
                },
                () =>
                {
                    // No claims in the OWIN context
                    context.Response.StatusCode = (int)System.Net.HttpStatusCode.BadRequest;
                    context.Response.ReasonPhrase = "Missing claims in token";
                });
            });
        }

        /// <summary>
        /// Gets or creates a new user in the database
        /// A new user is given the role <see cref="RoleType.User"/> by default
        /// </summary>
        /// <param name="c">The claims of the <code>JWT</code> token</param>
        /// <returns>Returns an awaitable task which contains a <see cref="User"/></returns>
        private async Task<User> GetOrCreateUser(ClaimsDTO c)
        {
            // Try to get user from database
            var oUser = await userRepository.Get(c.Username);

            var user = oUser.ValueOr(() =>
            {
                // User does not exist
                // This should only run once when a user first tries to use the service
                // Get user details from AD 
                var principalContext = new PrincipalContext(ContextType.Domain, domain);
                var adUser = UserPrincipal.FindByIdentity(principalContext, c.Username);

                // Construct user
                var u = new User
                {
                    FirstName = adUser.GivenName,
                    LastName = adUser.Surname,
                    Role = RoleType.User
                };

                // Save the user in the database...
                var dbUser = userRepository.Create(u).Result;

                // NOTE: We assume that database creation never fails...
                Debug.Assert(dbUser.HasValue);
                return u;
            });

            return user;
        }
    }
}
