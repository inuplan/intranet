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
    using System.Threading.Tasks;
    using Autofac.Extras.Attributed;
    using Common.Enums;
    using Common.Models;
    using Common.Repositories;
    using Common.Models.Forum;
    using Common.DTOs.Forum;
    using Common.Tools;
    using Optional.Unsafe;
    using System.Net.Http;
    using System.Net;
    using System.Web.Http;
    using Extensions;
    using System.Web.Http.Cors;
    using Common.Commands;
    using WebSocketServices;

    [EnableCors(origins: Constants.Origin, headers: "*", methods: "*", SupportsCredentials = true)]
    public class ForumPostController : DefaultController
    {
        private readonly IVectorRepository<int, Comment> forumCommentRepository;
        private readonly IScalarRepository<int, ThreadPostContent> postRepository;
        private readonly IScalarRepository<int, ThreadPostTitle> titleRepository;
        private readonly IMarkPost markPost;
        private readonly IAddItem whatsNew;
        private readonly IDeleteItem remove;
        private readonly LatestActionItemBroadcastService webSocketService;

        public ForumPostController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            [WithKey(ServiceKeys.ThreadPostContentRepository)] IScalarRepository<int, ThreadPostContent> postRepository,
            [WithKey(ServiceKeys.ThreadPostTitleRepository)] IScalarRepository<int, ThreadPostTitle> titleRepository,
            [WithKey(ServiceKeys.ForumCommentsRepository)] IVectorRepository<int, Comment> forumCommentRepository,
            IAddItem whatsNew,
            IDeleteItem remove,
            IMarkPost markPost,
            LatestActionItemBroadcastService webSocketService
        ) : base(userDatabaseRepository)
        {
            this.postRepository = postRepository;
            this.forumCommentRepository = forumCommentRepository;
            this.titleRepository = titleRepository;
            this.whatsNew = whatsNew;
            this.remove = remove;
            this.markPost = markPost;
            this.webSocketService = webSocketService;
        }

        [HttpGet]
        // localhost:9000/api/forumpost?id=10
        public async Task<ThreadPostContentDTO> Get(int id)
        {
            var post = await postRepository.Get(id);

            // TODO: Add User to ViewedBy...
            var result = post.Map(p =>
            {
                var commentCount = forumCommentRepository.Count(id).Result;
                var title = titleRepository.Get(id);
                p.Header = title.Result.ValueOrFailure();

                Comment latest = null;
                if(p.Header.LatestComment.HasValue)
                {
                    var someComment = forumCommentRepository.GetSingleByID(p.Header.LatestComment.Value).Result;
                    latest = someComment.Filter(c => !c.Deleted).ValueOr(alternative: null);
                }

                return Converters.ToThreadPostContentDTO(p, latest, commentCount);
            });

            return result.Match(p => p, () => { throw new HttpResponseException(HttpStatusCode.NotFound); });
        }

        [HttpPost]
        // localhost:9000/api/forumpost   { Header: { Title: "" }, Text: "" }
        public async Task<HttpResponseMessage> Post(ThreadPostContent post)
        {
            // Set user
            var user = Request.GetUser().ValueOrFailure("No user found");
            post.Header.Author = user;

            // Set created date
            post.Header.CreatedOn = DateTime.Now;
            var titleCreated = await titleRepository.Create(post.Header, (t) => Task.FromResult(0));

            // Add Whatsnew Item on post created!
            var onCreate = new Func<ThreadPostContent, Task>(p =>
           {
               var dto = Converters.ToThreadPostContentDTO(p, null, 0);
               webSocketService.NewForumThread(dto);
               return whatsNew.AddItem(p.ThreadID, NewsType.ThreadPost);
           });

            var result = titleCreated.FlatMap(t => postRepository.Create(post, onCreate).Result);

            return result.Match(
                c => Request.CreateResponse(HttpStatusCode.Created),
                () => { throw new HttpResponseException(HttpStatusCode.InternalServerError); });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put([FromUri] int postId, [FromUri] bool read)
        {
            var user = Request.GetUser();
            var result = await user.Map(u =>
            {
                if (read)
                {
                    return markPost.ReadPost(u, postId);
                }
                else
                {
                    return markPost.UnreadPost(u, postId);
                }
            }).ValueOr(Task.FromResult(false));

            var response = result ? Request.CreateResponse(HttpStatusCode.OK)
                : Request.CreateResponse(HttpStatusCode.InternalServerError);
            return response;
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put([FromUri] int id, ThreadPostContent post)
        {
            var title = (await titleRepository.GetByID(id)).ValueOrFailure();
            post.Header.CreatedOn = title.CreatedOn;
            post.Header.ThreadID = id;
            post.ThreadID = id;
            var titleUpdate = await titleRepository.Update(id, post.Header);
            if (!titleUpdate) return Request.CreateResponse(HttpStatusCode.InternalServerError);

            var contentUpdate = await postRepository.Update(id, post);
            if (!contentUpdate) return Request.CreateResponse(HttpStatusCode.InternalServerError);

            // 204 Updated
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        [HttpDelete]
        // localhost:9000/api/forumpost?postId=8
        public async Task<HttpResponseMessage> Delete(int id)
        {
            // Check if same author
            var thread = await titleRepository.Get(id);
            var isAuthorized = thread.Map(t => AuthorizeToUsername(t.Author.Username)).ValueOr(false);
            if (!isAuthorized) return Request.CreateResponse(HttpStatusCode.Unauthorized);

            // First delete all comments belonging to the thread
            var deleteAllComments = await forumCommentRepository.Delete(id, (threadId) => Task.FromResult(0));
            if (!deleteAllComments) return Request.CreateResponse(HttpStatusCode.InternalServerError);

            // Delete the actual thread. Note if error occurs here we cannot rollback!
            var delete = await titleRepository.Delete(id, (threadId) => remove.Remove(threadId, NewsType.ThreadPost));
            if (!delete) return Request.CreateResponse(HttpStatusCode.InternalServerError);

            // Deleted
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}
