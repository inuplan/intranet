// Copyright © 2015 Inuplan
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

namespace Inuplan.WebAPI.Middlewares
{
    using Common.Commands;
    using Common.Logger;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using Extensions;
    using Microsoft.Owin;
    using Optional.Unsafe;
    using Options;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Net;
    using System.Security.Claims;
    using System.Threading.Tasks;

    /// <summary>
    /// If it is a user's first time, then the user is created and saved to the database.
    /// If the user exists, then nothing is done.
    /// </summary>
    public class ManageUserMiddleware : OwinMiddleware
    {
        /// <summary>
        /// The user database repository
        /// </summary>
        private readonly IScalarRepository<string, User> userDatabaseRepository;

        /// <summary>
        /// The user active directory repository
        /// </summary>
        private readonly IScalarRepository<string ,User> userActiveDirectoryRepository;

        /// <summary>
        /// The repository for roles
        /// </summary>
        private readonly IScalarRepository<int, Role> roleRepository;
        private readonly int quotaKB;
        private readonly ILogger<ManageUserMiddleware> logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="ManageUserMiddleware"/> class.
        /// </summary>
        /// <param name="next">The next owin middleware</param>
        public ManageUserMiddleware(
            OwinMiddleware next,
            ManageUserOption options
        )
            : base(next)
        {
            quotaKB = options.QuotaKB;
            roleRepository = options.RoleRepository;
            userDatabaseRepository = options.UserDatabaseRepository;
            userActiveDirectoryRepository = options.UserActiveDirectoryRepository;
            logger = options.Logger;
        }

        /// <summary>
        /// Begins handling the current user, whether to create the user in the database.
        /// </summary>
        /// <param name="context">The owin context</param>
        /// <returns>An awaitable task</returns>
        public async override Task Invoke(IOwinContext context)
        {
            try
            {
                if (context.IsOptionsRequest())
                {
                    await Next.Invoke(context);
                    return;
                }

                logger.Debug("Method: Invoke, BEGIN");
                logger.Trace("Request is preflight request?: {0}", context.IsOptionsRequest());
                var identity = context.Authentication.User.Identity;
                var username = identity.Name.Substring(identity.Name.LastIndexOf(@"\", StringComparison.OrdinalIgnoreCase) + 1);

                logger.Trace("Trying to retrieve user {0} from the database", username);
                var user = await userDatabaseRepository.Get(username);
                var error = false;
                var roles = new List<Role>();

                if (!user.HasValue)
                {
                    logger.Trace("User {0} does not exist in database", username);
                    logger.Trace("Retrieve \"User\" role from database");
                    var role = (await roleRepository.GetAll())
                        .FirstOrDefault(r => r.Name.Equals("User", StringComparison.OrdinalIgnoreCase));

                    roles.Add(role);
                    Debug.Assert(role != null, "Must have a predefined role: \"User\"");

                    logger.Trace("Retrieve user information from Active Directory");
                    var adUser = await userActiveDirectoryRepository.Get(username);
                    error = await adUser.Match(async u =>
                    {
                        logger.Trace("User info retrieved from Active Directory!");
                        u.Roles = roles;

                        logger.Trace("Creating user {0} in the database", username);
                        var onCreated = new Func<User, Task<bool>>(createdUser =>
                        {
                            return Task.FromResult(true);
                        });

                        var created = await userDatabaseRepository.Create(u, onCreated);
                        if (!created.HasValue)
                        {
                            // Error, couldn't create user in DB
                            logger.Error("Could not create user {0} in the database!", username);
                            return true;
                        }

                        logger.Trace("Created user {0} in the database!", username);
                        user = created;
                        return false;
                    },
                    () =>
                    {
                    // Error user, does not exist in AD
                    logger.Error("No user information for {0} in Active Directory!", username);
                        return Task.FromResult(true);
                    });

                }

                if (error)
                {
                    logger.Trace("Returning with error 500. Reason given earlier");
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    return;
                }

                // Set principal roles
                var actualUser = user.ValueOrFailure();
                logger.Trace("Extracting user {1} with ID {0}...", actualUser.ID, username);

                //// Note: .NET Framework 1.1 and onwards IsInRole is case-insensitive!
                //// source: https://msdn.microsoft.com/en-us/library/fs485fwh(v=vs.110).aspx
                logger.Trace("Setting authenticated user to principal");
                var claimsPrincipal = new ClaimsPrincipal();
                var claimsIdentity = new ClaimsIdentity(AuthenticationTypes.Windows);

                logger.Trace("Filtering out the claims...");
                var claims = context.Authentication.User.Claims.Where(c => !c.Type.Equals(ClaimTypes.Name, StringComparison.OrdinalIgnoreCase));

                logger.Trace("Adding filtered claims...");
                claimsIdentity.AddClaims(claims);

                logger.Trace("Setting claim to username: {0}", actualUser.Username);
                claimsIdentity.AddClaim(new Claim(ClaimTypes.Name, actualUser.Username));

                foreach (var role in actualUser.Roles)
                {
                    logger.Trace("Adding role \"{0}\" to claims", role.Name);
                    claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, role.Name));
                }

                logger.Trace("Adding identity to principal...");
                claimsPrincipal.AddIdentity(claimsIdentity);

                logger.Trace("Setting context to principal...");
                context.Authentication.User = claimsPrincipal;

                logger.Trace("Saving user in owin context: ({0}, {1})...", Constants.CURRENT_USER, actualUser.Username);
                context.Set(Constants.CURRENT_USER, actualUser);

                logger.Trace("Proceeding with the owin middleware pipeline");
                await Next.Invoke(context);
                logger.Debug("Method: Invoke, END");
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }
    }
}
