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
    using Common.Repositories;
    using Inuplan.Common.Models;
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;

    [EnableCors(origins: @"http://beta.intranet", headers: "", methods: "*", SupportsCredentials = true)]
    public class ImageCommentController : DefaultController
    {
        private readonly IVectorRepository<int, Comment> imageCommentRepository;

        public ImageCommentController(IVectorRepository<int, Comment> imageCommentRepository)
        {
            this.imageCommentRepository = imageCommentRepository;
        }

        [Route(Name = "GetComment")]
        public async Task<List<Comment>> Get(int imageId)
        {
            var comments = await imageCommentRepository.Get(imageId);
            return comments;
        }

        public async Task<Pagination<Comment>> Get(int skip, int take, int imageId)
        {
            var page = await imageCommentRepository.GetPage(skip, take, imageId);
            return page;
        }

        public async Task<HttpResponseMessage> Post(Comment comment, [FromUri] int imageId, [FromUri] int? replyId = null)
        {
            var created = await imageCommentRepository.CreateSingle(comment, imageId, replyId);
            var response = created.Match(
                c =>
                {
                    var r = Request.CreateResponse(HttpStatusCode.Created, c);
                    var route = Url.Route("GetComment", new { id = c.ID });
                    r.Headers.Location = new Uri(route, UriKind.Relative);
                    return r;
                },
                () => Request.CreateResponse(HttpStatusCode.InternalServerError));

            return response;
        }

        public async Task<HttpResponseMessage> Delete(int commentId)
        {
            var deleted = await imageCommentRepository.DeleteSingle(commentId);
            var response = deleted ?
                            Request.CreateResponse(HttpStatusCode.NoContent) :
                            Request.CreateResponse(HttpStatusCode.InternalServerError);
            return response;
        }

        public async Task<HttpResponseMessage> Put([FromUri] int imageId, Comment comment)
        {
            var updated = await imageCommentRepository.UpdateSingle(imageId, comment);
            var response = updated ?
                            Request.CreateResponse(HttpStatusCode.NoContent) :
                            Request.CreateResponse(HttpStatusCode.InternalServerError);
            return response;
        }
    }
}
