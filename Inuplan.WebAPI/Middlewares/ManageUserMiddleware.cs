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
    using Microsoft.Owin;
    using NLog;
    using Optional;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Net;
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
        private static Logger logger = LogManager.GetCurrentClassLogger();

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
            var identity = context.Request.User.Identity;
            var username = identity.Name.Substring(identity.Name.LastIndexOf(@"\") + 1);
            var user = await userDatabaseRepository.Get(username);
            var error = false;

            if (!user.HasValue)
            {
                // Get existing "normal role"
                var role = (await roleRepository.GetAll())
                    .FirstOrDefault(r => r.Name.Equals("User", System.StringComparison.OrdinalIgnoreCase));

                // Assume that a "User" role exists!
                Debug.Assert(role != null, "Must have a predefined role: \"User\"");

                // We need to create the user in the database
                var adUser = await userActiveDirectoryRepository.Get(username);
                error = await adUser.Match(async u =>
                {
                    // Set role to "User"
                    u.Roles = new List<Role> { role };
                    var created = await userDatabaseRepository.Create(u);
                    if(!created.HasValue)
                    {
                        // Error, couldn't create user in DB
                        logger.Error("Could not create user {0} in the database!", username);
                        return true;
                    }

                    logger.Info("Created user {0} in the database!", username);
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

            logger.Trace("Proceeding with the owin middleware pipeline");
            await Next.Invoke(context);
        }
    }
}
