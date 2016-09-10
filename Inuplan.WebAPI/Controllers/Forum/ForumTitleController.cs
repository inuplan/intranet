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
    using Autofac.Extras.Attributed;
    using Common.DTOs.Forum;
    using Common.Enums;
    using Common.Models;
    using Common.Models.Forum;
    using Common.Repositories;
    using Common.Tools;
    using Extensions;
    using Optional.Unsafe;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    public class ForumTitleController : DefaultController
    {
        private readonly IScalarRepository<int, ThreadPostTitle> threadTitleRepository;
        private readonly IVectorRepository<int, Comment> forumCommentRepository;

        public ForumTitleController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            [WithKey(ServiceKeys.ThreadPostTitleRepository)] IScalarRepository<int, ThreadPostTitle> threadTitleRepository,
            [WithKey(ServiceKeys.ForumCommentsRepository)] IVectorRepository<int, Comment> forumCommentRepository)
            : base(userDatabaseRepository)
        {
            this.threadTitleRepository = threadTitleRepository;
            this.forumCommentRepository = forumCommentRepository;
        }

        [HttpGet]
        public async Task<Pagination<ThreadPostTitleDTO>> Get(int skip, int take, ForumSortBy sortBy = ForumSortBy.CreatedOn, ForumOrderBy orderBy = ForumOrderBy.Asc)
        {
            var titles = await threadTitleRepository.GetPage(skip, take, () => sortBy.ToString(), () => orderBy.ToString());
            var titleDtos = titles.CurrentItems.Select(t => {
                var commentCount = forumCommentRepository.Count(t.ThreadID);
                return Converters.ToThreadPostTitleDTO(t, commentCount.Result);
            });

            return Helpers.Paginate(skip, take, titles.TotalPages, titleDtos.ToList());
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post([FromBody] ThreadPostTitle title)
        {
            var user = Request.GetUser().ValueOrFailure("No user found. Must be logged in to post forum thread.");

            title.Author = user;

            var created = await threadTitleRepository.Create(title, (t) => Task.FromResult(0));
            return created.Match(c =>
            {
                return Request.CreateResponse(HttpStatusCode.Created);
            },
            () =>
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            });
        }

        [HttpDelete]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            // Check if same author
            var thread = await threadTitleRepository.Get(id);
            var isAuthorized = thread.Map(t => AuthorizeToUsername(t.Author.Username)).ValueOr(false);
            if (!isAuthorized) return Request.CreateResponse(HttpStatusCode.Unauthorized);

            // First delete all comments belonging to the thread
            var deleteAllComments = await forumCommentRepository.Delete(id, (threadId) => Task.FromResult(0));
            if (!deleteAllComments) return Request.CreateResponse(HttpStatusCode.InternalServerError);

            // Delete the actual thread. Note if error occurs here we cannot rollback!
            var delete = await threadTitleRepository.Delete(id, (threadId) => Task.FromResult(0));
            if (!delete) return Request.CreateResponse(HttpStatusCode.InternalServerError);

            // Deleted
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}
