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
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;

    [EnableCors(origins: Constants.Origin, headers: "", methods: "*", SupportsCredentials = true)]
    public class UserController : DefaultController
    {
        public UserController([WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userRepository)
            :base(userRepository)
        {
        }

        [AllowAnonymous]
        public async Task<BaseDTO<User>> Get([FromUri] string username)
        {
            var user = await userDatabaseRepository.Get(username);
            return user.Match(
                u => new DefaultDTO<User>
                {
                    User = ConstructUserDTO(),
                    Item = u,
                },
                () => { throw new HttpResponseException(HttpStatusCode.NotFound); });
        }

        [Authorize(Roles = "Admin")]
        public async Task<HttpResponseMessage> Post(User user)
        {
            var created = await userDatabaseRepository.Create(user);
            return created.Match(u => Request.CreateResponse(HttpStatusCode.Created),
                () => Request.CreateResponse(HttpStatusCode.InternalServerError));
        }

        public async Task<BaseDTO<Pagination<User>>> Get(int skip, int take)
        {
            var page = await userDatabaseRepository.GetPage(skip, take);
            return new DefaultDTO<Pagination<User>>
            {
                User = ConstructUserDTO(),
                Item = page,
            };
        }
    }
}
