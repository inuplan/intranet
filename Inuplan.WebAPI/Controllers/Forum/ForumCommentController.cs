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

namespace Inuplan.WebAPI.Controllers.Forum
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Autofac.Extras.Attributed;
    using Common.Enums;
    using Common.Models;
    using Common.Repositories;
    using Common.DTOs.Forum;
    using Common.Tools;
    using System.Web.Http;
    using System.Net;
    using System.Net.Http;
    using System.Diagnostics;
    using Extensions;
    using Optional.Unsafe;
    using System.Web.Http.Cors;

    [EnableCors(origins: Constants.Origin, headers: "*", methods: "*", SupportsCredentials = true)]
    public class ForumCommentController : DefaultController
    {
        private readonly IVectorRepository<int, Comment> forumCommentRepository;

        public ForumCommentController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            [WithKey(ServiceKeys.ForumCommentsRepository)] IVectorRepository<int, Comment> forumCommentRepository
        ) : base(userDatabaseRepository)
        {
            this.forumCommentRepository = forumCommentRepository;
        }

        [HttpGet]
        public async Task<List<ThreadPostCommentDTO>> Get(int postId)
        {
            var comments = await forumCommentRepository.Get(postId);
            return comments.Select(Converters.ToThreadPostCommentDTO).ToList();
        }

        [HttpGet]
        public async Task<ThreadPostCommentDTO> GetSingle(int id)
        {
            var comment = await forumCommentRepository.GetSingleByID(id);
            return comment.Match(c => Converters.ToThreadPostCommentDTO(c),
                () => { throw new HttpResponseException(HttpStatusCode.NotFound); });
        }

        [HttpGet]
        public async Task<Pagination<ThreadPostCommentDTO>> Get(int skip, int take, int postId)
        {
            var page = await forumCommentRepository.GetPage(postId, skip, take);
            var items = page.CurrentItems.Select(Converters.ToThreadPostCommentDTO).ToList();
            return new Pagination<ThreadPostCommentDTO>
            {
                CurrentItems = items,
                CurrentPage = page.CurrentPage,
                TotalPages = page.TotalPages
            };
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(Comment comment)
        {
            Debug.Assert(comment.ContextID > 0, "Must be associated with a forum post");
            comment.PostedOn = DateTime.Now;
            comment.Author = Request.GetUser().ValueOrFailure();
            var created = await forumCommentRepository.CreateSingle(comment, (c) => Task.FromResult(0));

            return created.Match(
                c => Request.CreateResponse(HttpStatusCode.Created, c),
                () => Request.CreateResponse(HttpStatusCode.InternalServerError));
        }

        [HttpDelete]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            var deleted = await forumCommentRepository.DeleteSingle(id, (cid) => Task.FromResult(0));
            return deleted ?
                Request.CreateResponse(HttpStatusCode.NoContent)
                : Request.CreateResponse(HttpStatusCode.InternalServerError);
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(Comment comment)
        {
            comment.PostedOn = DateTime.Now;
            var updated = await forumCommentRepository.UpdateSingle(comment.ID, comment);
            return updated ?
                Request.CreateResponse(HttpStatusCode.NoContent)
                : Request.CreateResponse(HttpStatusCode.InternalServerError);
        }
    }
}
