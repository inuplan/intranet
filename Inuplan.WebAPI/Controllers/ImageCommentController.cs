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
    using Common.Repositories;
    using Common.Tools;
    using Common.Models;
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;
    using System.Linq;

    [EnableCors(origins: Constants.Origin, headers: "*", methods: "*", SupportsCredentials = true)]
    public class ImageCommentController : DefaultController
    {
        private readonly IVectorRepository<int, Comment> imageCommentRepository;

        public ImageCommentController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            IVectorRepository<int, Comment> imageCommentRepository)
            : base(userDatabaseRepository)
        {
            this.imageCommentRepository = imageCommentRepository;
        }

        public async Task<List<CommentDTO>> Get(int imageId)
        {
            var comments = await imageCommentRepository.Get(imageId);
            return comments.Select(Converters.ToCommentDTO).ToList();
        }

        [Route(Name = "GetComment")]
        public async Task<CommentDTO> GetSingle(int commentId)
        {
            var comment = await imageCommentRepository.GetSingleByID(commentId);
            var dto = comment.Map(Converters.ToCommentDTO);
            return dto.Match(
                c => c,
                () => { throw new HttpResponseException(HttpStatusCode.NotFound); });
        }

        public async Task<Pagination<CommentDTO>> Get(int skip, int take, int imageId)
        {
            var page = await imageCommentRepository.GetPage(skip, take, imageId);
            var dtos = page.CurrentItems.Select(Converters.ToCommentDTO).ToList();
            return new Pagination<CommentDTO>
            {
                CurrentItems = dtos,
                CurrentPage = page.CurrentPage,
                TotalPages = page.TotalPages
            };
        }

        public async Task<HttpResponseMessage> Post(Comment comment, [FromUri] int imageId, [FromUri] int? replyId = null)
        {
            // Set time and owner to current user and time!
            comment.PostedOn = DateTime.Now;
            comment.Author = Request.GetOwinContext().Get<User>(Constants.CURRENT_USER);
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

        public async Task<HttpResponseMessage> Put([FromBody]Comment comment)
        {
            comment.PostedOn = DateTime.Now;
            var updated = await imageCommentRepository.UpdateSingle(comment.ID, comment);
            var response = updated ?
                            Request.CreateResponse(HttpStatusCode.NoContent) :
                            Request.CreateResponse(HttpStatusCode.InternalServerError);
            return response;
        }

    }
}
