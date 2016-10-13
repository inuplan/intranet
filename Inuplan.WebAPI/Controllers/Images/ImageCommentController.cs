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

namespace Inuplan.WebAPI.Controllers.Images
{
    using Autofac.Extras.Attributed;
    using Common.Commands;
    using Common.DTOs;
    using Common.Enums;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;
    using WebSocketServices;

    [EnableCors(origins: Constants.Origin, headers: "*", methods: "*", SupportsCredentials = true)]
    public class ImageCommentController : DefaultController
    {
        private readonly IVectorRepository<int, Comment> imageCommentRepository;
        private readonly IAddItem whatsNew;
        private readonly IDeleteItem removeNews;
        private readonly LatestActionItemBroadcastService webSocketService;

        public ImageCommentController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            IVectorRepository<int, Comment> imageCommentRepository,
            IAddItem whatsNew,
            IDeleteItem removeNews,
            LatestActionItemBroadcastService webSocketService
            )
            : base(userDatabaseRepository)
        {
            this.imageCommentRepository = imageCommentRepository;
            this.whatsNew = whatsNew;
            this.removeNews = removeNews;
            this.webSocketService = webSocketService;
        }

        public async Task<List<ImageCommentDTO>> Get(int imageId)
        {
            var comments = await imageCommentRepository.Get(imageId);
            return comments.Select(Converters.ToImageCommentDTO).ToList();
        }

        public async Task<ImageCommentDTO> GetSingle(int id)
        {
            var comment = await imageCommentRepository.GetSingleByID(id);
            var dto = comment.Map(Converters.ToImageCommentDTO);
            return dto.Match(
                c => c,
                () => { throw new HttpResponseException(HttpStatusCode.NotFound); });
        }

        public async Task<Pagination<ImageCommentDTO>> Get(int skip, int take, int imageId)
        {
            var page = await imageCommentRepository.GetPage(imageId, skip, take);
            var dtos = page.CurrentItems.Select(Converters.ToImageCommentDTO).ToList();
            return new Pagination<ImageCommentDTO>
            {
                CurrentItems = dtos,
                CurrentPage = page.CurrentPage,
                TotalPages = page.TotalPages
            };
        }

        public async Task<HttpResponseMessage> Post(Comment comment)
        {
            Debug.Assert(comment.ContextID > 0, "Must be associated with a valid image");
            Func<Comment, Task> onCreate = (c) =>
            {
                var dto = Converters.ToImageCommentDTO(c);
                webSocketService.NewImageComment(dto);
                return whatsNew.AddItem(c.ID, NewsType.ImageComment);
            };

            // Set time and owner to current user and time!
            comment.PostedOn = DateTime.Now;
            comment.Author = Request.GetOwinContext().Get<User>(Constants.CURRENT_USER);
            var created = await imageCommentRepository.CreateSingle(comment, onCreate);

            return created.Match(
                c => Request.CreateResponse(HttpStatusCode.Created, c),
                () => Request.CreateResponse(HttpStatusCode.InternalServerError));
        }

        public async Task<HttpResponseMessage> Delete(int commentId)
        {
            // NOTE: Comments are NOT deleted only set to "null" to keep comment hierarchy
            // Question: Should "deleted" comments be removed from the latest news?
            // Be careful on the client side, take into consideration that Author field could be null!
            var deleted = await imageCommentRepository.DeleteSingle(commentId, id => removeNews.Remove(id, NewsType.ImageComment));
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
