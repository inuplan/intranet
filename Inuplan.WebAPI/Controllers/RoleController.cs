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
    using Common.Models;
    using Common.Repositories;
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
    [EnableCors(origins: @"http://beta.intranet", headers: "", methods: "*", SupportsCredentials = true)]
    public class RoleController : ApiController
    {
        private readonly IScalarRepository<int, Role> roleRepository;

        public RoleController(IScalarRepository<int, Role> roleRepository)
        {
            this.roleRepository = roleRepository;
        }

        public async Task<Role> Get(int id)
        {
            var role = await roleRepository.Get(id);
            return role.Match(r => r,
                () => { throw new HttpResponseException(HttpStatusCode.NotFound); });
        }
        
        public async Task<List<Role>> Get()
        {
            var roles = await roleRepository.GetAll();
            return roles;
        }

        public async Task<HttpResponseMessage> Post(string name)
        {
            var role = new Role { Name = name };
            var created = await roleRepository.Create(role);
            return created.Match(r => Request.CreateResponse(HttpStatusCode.Created),
                () => Request.CreateResponse(HttpStatusCode.InternalServerError));
        }

        public async Task<HttpResponseMessage> Delete(int id)
        {
            var deleted = await roleRepository.Delete(id);
            return deleted ? Request.CreateResponse(HttpStatusCode.NoContent) : Request.CreateResponse(HttpStatusCode.InternalServerError);
        }

        protected override void Dispose(bool disposing)
        {
            roleRepository.Dispose();
            base.Dispose(disposing);
        }
    }
}
