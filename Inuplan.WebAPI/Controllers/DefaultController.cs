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

namespace Inuplan.WebAPI.Controllers
{
    using Autofac.Extras.Attributed;
    using Common.DTOs;
    using Common.Enums;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using NLog;
    using System;
    using System.Security.Principal;
    using System.Web.Http;

    public abstract class DefaultController : ApiController
    {
        /// <summary>
        /// The logging framework
        /// </summary>
        protected static Logger logger = LogManager.GetCurrentClassLogger();

        protected readonly IScalarRepository<string, User> userDatabaseRepository;

        public DefaultController([WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository)
        {
            this.userDatabaseRepository = userDatabaseRepository;
        }

        /// <summary>
        /// Checks if the username matches the principal name
        /// </summary>
        /// <param name="username">The username to check</param>
        /// <returns>True if the same, otherwise false</returns>
        [NonAction]
        protected bool AuthorizeToUsername(string username)
        {
            var principal = RequestContext.Principal;
            return username.Equals(principal.Identity.Name, StringComparison.OrdinalIgnoreCase);
        }
        
        /// <summary>
        /// Gets the <see cref="User"/> which is stored in the <see cref="IPrincipal"/> object.
        /// </summary>
        /// <param name="principal">The principal object</param>
        /// <returns>A user</returns>
        /// <exception cref="InvalidOperationException">thrown when no user exist</exception>
        [NonAction]
        protected User GetPrincipalIdentityUser()
        {
            var principal = RequestContext.Principal;
            var user = principal.TryGetUser();
            return user.Match(
                // Return the user
                u => u,
                () =>
                {
                    logger.Error("User has not been set by the InuplanAuthorizationAttribute object");
                    throw new InvalidOperationException();
                });
        }

        /// <summary>
        /// Constructs a <see cref="UserDTO"/> instance for the current user
        /// </summary>
        /// <returns></returns>
        [NonAction]
        protected UserDTO ConstructUserDTO()
        {
            var user = GetPrincipalIdentityUser();
            return new UserDTO
            {
                ID = user.ID,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsAdmin = RequestContext.Principal.IsInRole("Admin"),
                Username = user.Username,
                ProfileImageUrl = string.Empty,
            };
        }
    }
}
