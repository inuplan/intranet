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
    using Common.Enums;
    using Common.Models;
    using Common.Repositories;
    using Extensions;
    using NLog;
    using System;
    using System.Web.Http;

    public abstract class DefaultController : ApiController
    {
        /// <summary>
        /// The logging framework
        /// </summary>
        protected static Logger Logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The user database repository
        /// </summary>
        protected readonly IScalarRepository<string, User> userDatabaseRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="DefaultController"/> class.
        /// </summary>
        /// <param name="userDatabaseRepository">The user database repository</param>
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
            var user = Request.GetUser();
            var isAuthorized = user.Map(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
            return isAuthorized.ValueOr(false);
        }

        protected string ImageUrl(Image image, string action)
        {
            var baseUri = new Uri(Request.RequestUri, RequestContext.VirtualPathRoot);
            var route = Url.Route(
                "RouteWithActions",
                new
                {
                    controller = "UserImage",
                    action = action,
                    username = image.Owner.Username,
                    imageId = image.ID
                });

            return new Uri(baseUri, route).ToString();
        }
    }
}