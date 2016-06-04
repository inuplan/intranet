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
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;

    /// <summary>
    /// Manages the roles for the system
    /// </summary>
    [Authorize(Roles = "Admin")]
    [EnableCors(origins: Constants.Origin, headers: "", methods: "*", SupportsCredentials = true)]
    public class RoleController : DefaultController
    {
        /// <summary>
        /// The roles repository
        /// </summary>
        private readonly IScalarRepository<int, Role> roleRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref=""/>
        /// </summary>
        /// <param name="userDatabaseRepository">The user database repository</param>
        /// <param name="roleRepository">The roles repository</param>
        public RoleController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            IScalarRepository<int, Role> roleRepository)
            : base(userDatabaseRepository)
        {
            this.roleRepository = roleRepository;
        }

        /// <summary>
        /// Retrieves the role with the given id
        /// </summary>
        /// <param name="id">The id of the role</param>
        /// <returns>A <see cref="Role"/> info</returns>
        [HttpGet]
        public async Task<Role> Get(int id)
        {
            var role = await roleRepository.Get(id);
            return role.Match(
                r => r,
                () => { throw new HttpResponseException(HttpStatusCode.NotFound); });
        }

        /// <summary>
        /// Retrieves all roles from the database
        /// </summary>
        /// <returns>A collection of roles</returns>
        [HttpGet]
        public async Task<List<Role>> Get()
        {
            var roles = await roleRepository.GetAll();
            return roles;
        }

        /// <summary>
        /// Creates a new <see cref="Role"/> with the given name
        /// </summary>
        /// <param name="name">The name of the role</param>
        /// <returns>An http response</returns>
        public async Task<HttpResponseMessage> Post(string name)
        {
            var role = new Role { Name = name };
            var created = await roleRepository.Create(role);
            return created.Match(r => Request.CreateResponse(HttpStatusCode.Created),
                () => Request.CreateResponse(HttpStatusCode.InternalServerError));
        }

        /// <summary>
        /// Deletes a role from the database
        /// </summary>
        /// <param name="id">The id of the role to delete</param>
        /// <returns>An http response message</returns>
        public async Task<HttpResponseMessage> Delete(int id)
        {
            var deleted = await roleRepository.Delete(id);
            return deleted ? Request.CreateResponse(HttpStatusCode.NoContent) : Request.CreateResponse(HttpStatusCode.InternalServerError);
        }

        /// <summary>
        /// Disposes the repositories
        /// </summary>
        /// <param name="disposing">true if disposing otherwise false</param>
        protected override void Dispose(bool disposing)
        {
            roleRepository.Dispose();
            base.Dispose(disposing);
        }
    }
}
