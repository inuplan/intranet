﻿// Copyright © 2015 Inuplan
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
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;

    [EnableCors(origins: Constants.Origin, headers: "*", methods: "*", SupportsCredentials = true)]
    public class UserController : DefaultController
    {
        public UserController([WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userRepository)
            :base(userRepository)
        {
        }

        [AllowAnonymous]
        public async Task<UserDTO> Get([FromUri] string username)
        {
            var user = await userDatabaseRepository.Get(username);
            var dto = user.Map(ConvertToDTO);
            return dto.Match(
                u => u,
                () => { throw new HttpResponseException(HttpStatusCode.NotFound); });
        }

        public async Task<Pagination<UserDTO>> Get(int skip, int take)
        {
            var page = await userDatabaseRepository.GetPage(skip, take);
            var dto = Helpers.Paginate(skip, take, page.TotalPages, page.CurrentItems.Select(ConvertToDTO).ToList());
            return dto;
        }

        [NonAction]
        private UserDTO ConvertToDTO(User user)
        {
            var displayName = (string.IsNullOrEmpty(user.DisplayName)) ? user.FirstName + " " + user.LastName : user.DisplayName;
            return new UserDTO
            {
                ID = user.ID,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DisplayName = displayName,
                Email = user.Email,
                IsAdmin = user.Roles.Exists(r => r.Name.Equals("Admin")),
                Roles = user.Roles,
                ProfileImage = "NA"
            };
        }
    }
}
