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
    using Autofac.Extras.Attributed;
    using Common.Enums;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using Microsoft.Owin;
    using NLog;
    using Optional.Unsafe;
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
        /// The logging framework
        /// </summary>
        private static Logger Logger = LogManager.GetCurrentClassLogger();

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

        /// <summary>
        /// Initializes a new instance of the <see cref="ManageUserMiddleware"/> class.
        /// </summary>
        /// <param name="next">The next owin middleware</param>
        public ManageUserMiddleware(
            OwinMiddleware next,
            IScalarRepository<int, Role> roleRepository,
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            [WithKey(ServiceKeys.UserActiveDirectory)] IScalarRepository<string, User> userActiveDirectoryRepository)
            : base(next)
        {
            this.roleRepository = roleRepository;
            this.userDatabaseRepository = userDatabaseRepository;
            this.userActiveDirectoryRepository = userActiveDirectoryRepository;
        }

        /// <summary>
        /// Begins handling the current user, whether to create the user in the database.
        /// </summary>
        /// <param name="context">The owin context</param>
        /// <returns>An awaitable task</returns>
        public async override Task Invoke(IOwinContext context)
        {
            Logger.Info("Incoming request from: {0}", context.Request.RemoteIpAddress);
            if (context.Request.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
            {
                Logger.Trace("Http method: OPTIONS - Request is probably a preflight request, must allow anonymous pass-through");
                await Next.Invoke(context);
                return;
            }

            try
            {
                var identity = context.Authentication.User.Identity;
                var username = identity.Name.Substring(identity.Name.LastIndexOf(@"\") + 1);

                Logger.Trace("Trying to retrieve user {0} from the database", username);
                var user = await userDatabaseRepository.Get(username);
                var error = false;
                var roles = new List<Role>();

                if (!user.HasValue)
                {
                    Logger.Debug("User {0} does not exist in database", username);
                    Logger.Trace("Retrieve \"User\" role from database");
                    var role = (await roleRepository.GetAll())
                        .FirstOrDefault(r => r.Name.Equals("User", StringComparison.OrdinalIgnoreCase));

                    roles.Add(role);
                    Debug.Assert(role != null, "Must have a predefined role: \"User\"");

                    Logger.Trace("Retrieve user information from Active Directory");
                    var adUser = await userActiveDirectoryRepository.Get(username);
                    error = await adUser.Match(async u =>
                    {
                        Logger.Info("User info retrieved from Active Directory!");
                        u.Roles = roles;

                        Logger.Trace("Creating user {0} in the database", username);
                        var created = await userDatabaseRepository.Create(u);
                        if (!created.HasValue)
                        {
                        // Error, couldn't create user in DB
                        Logger.Error("Could not create user {0} in the database!", username);
                            return true;
                        }

                        Logger.Info("Created user {0} in the database!", username);
                        user = created;
                        return false;
                    },
                    () =>
                    {
                    // Error user, does not exist in AD
                    Logger.Error("No user information for {0} in Active Directory!", username);
                        return Task.FromResult(true);
                    });

                }

                if (error)
                {
                    Logger.Trace("Returning with error 500. Reason given earlier");
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    return;
                }

                // Set principal roles
                var actualUser = user.ValueOrFailure();
                Logger.Trace("Extracting user {1} with ID {0}...", actualUser.ID, username);

                //// Note: .NET Framework 1.1 and onwards IsInRole is case-insensitive!
                //// source: https://msdn.microsoft.com/en-us/library/fs485fwh(v=vs.110).aspx
                Logger.Trace("Setting authenticated user to principal");
                var claimsPrincipal = new ClaimsPrincipal();
                var claimsIdentity = new ClaimsIdentity();

                Logger.Trace("Filtering out the claims...");
                var claims = context.Authentication.User.Claims.Where(c => !c.Type.Equals(ClaimTypes.Name, StringComparison.OrdinalIgnoreCase));

                Logger.Trace("Adding filtered claims...");
                claimsIdentity.AddClaims(claims);

                Logger.Trace("Setting claim to username: {0}", actualUser.Username);
                claimsIdentity.AddClaim(new Claim(ClaimTypes.Name, actualUser.Username));

                foreach (var role in actualUser.Roles)
                {
                    Logger.Trace("Adding role \"{0}\" to claims", role.Name);
                    claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, role.Name));
                }

                Logger.Trace("Adding identity to principal...");
                claimsPrincipal.AddIdentity(claimsIdentity);

                Logger.Trace("Setting context to principal...");
                context.Authentication.User = claimsPrincipal;

                Logger.Trace("Saving user in owin context: ({0}, {1})...", Constants.CURRENT_USER, actualUser.Username);
                context.Set(Constants.CURRENT_USER, actualUser);

                Logger.Trace("Proceeding with the owin middleware pipeline");
                await Next.Invoke(context);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                throw;
            }
        }
    }
}
