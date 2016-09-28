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
    using Common.Enums;
    using Common.Models;
    using Common.Queries;
    using Common.Repositories;
    using Common.Tools;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;

    [EnableCors(origins: Constants.Origin, headers: "*", methods: "*", SupportsCredentials = true)]
    public class WhatsNewController : DefaultController
    {
        private readonly IGetPage whatsNew;

        public WhatsNewController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            IGetPage whatsNew)
            : base(userDatabaseRepository)
        {
            this.whatsNew = whatsNew;
        }

        [HttpGet]
        public async Task<Pagination<NewsItem>> Get(int skip, int take, NewsType filter = NewsType.ImageComment | NewsType.ImageUpload | NewsType.ThreadPost)
        {
            var page = await whatsNew.Page(filter, skip, take, ImageUrl);
            return page;
        }
    }
}