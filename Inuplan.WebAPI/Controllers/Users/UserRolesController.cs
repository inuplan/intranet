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
    using Common.Tools;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;

    [Authorize(Roles = "Admin")]
    [EnableCors(origins: Constants.Origin, headers: "", methods: "*", SupportsCredentials = true)]
    public class UserRolesController : DefaultController
    {
        private readonly IScalarRepository<int, User> userRolesRepository;

        public UserRolesController(
            [WithKey(ServiceKeys.UserRoleRepository)] IScalarRepository<int, User> userRolesRepository,
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userRepository)
            :base(userRepository)
        {
            this.userRolesRepository = userRolesRepository;
        }

        /// <summary>
        /// Creates a new association for the user to the given roles
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="roleIds">The role ids</param>
        /// <returns>A response message indicating the resulting operation.</returns>
        public async Task<HttpResponseMessage> Post([FromUri] string username, List<int> roleIds)
        {
            var user = await userDatabaseRepository.Get(username);

            var done = user.Map(async u =>
            {
                var associateRoles = await userRolesRepository.Create(u, _ => Task.FromResult(true), roleIds);
                return associateRoles.HasValue;
            });


            return await done.Match(async t =>
            {
                var finish = await t;
                var response = finish ? Request.CreateResponse(HttpStatusCode.OK) : Request.CreateResponse(HttpStatusCode.InternalServerError);
                return response;
            },
            () =>
            {
                return Task.FromResult(Request.CreateResponse(HttpStatusCode.NotFound, "Username not found!"));
            });
        }

        /// <summary>
        /// Delete all associated roles for the user!
        /// </summary>
        /// <param name="username">The username</param>
        /// <returns>A http response indicating the resulting operation</returns>
        public async Task<HttpResponseMessage> Delete(string username)
        {
            var user = await userDatabaseRepository.Get(username);
            var userId = user.Map(u => u.ID).ValueOr(-1);
            var deleted = await userRolesRepository.Delete(userId, _ => Task.FromResult(0));
            return deleted ?
                Request.CreateResponse(HttpStatusCode.OK) :
                Request.CreateResponse(HttpStatusCode.InternalServerError);
        }

        /// <summary>
        /// An update is essentially just a Delete with a Post combined.
        /// Updates the user with the new given roles
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="roleIds">The role IDs</param>
        /// <returns>A response message indicating the resulting operation</returns>
        public async Task<HttpResponseMessage> Put([FromUri] string username, List<int> roleIds)
        {
            var user = await userDatabaseRepository.Get(username);
            var updated = user.Map(async u =>
            {
                u.Roles = roleIds.Select(r => new Role { ID = r, }).ToList();
                var upd = await userRolesRepository.Update(u.ID, u);
                return upd;
            });

            var result = await updated.Match(
                async t => await t,
                () => Task.FromResult(false));

            return result ?
                Request.CreateResponse(HttpStatusCode.OK) :
                Request.CreateResponse(HttpStatusCode.InternalServerError);
        }
    }
}
