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
    using Common.Commands;
    using Common.DTOs.Forum;
    using Common.Enums;
    using Common.Models;
    using Common.Models.Forum;
    using Common.Repositories;
    using Common.Tools;
    using Extensions;
    using Extensions.Workflows;
    using Optional;
    using Optional.Unsafe;
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;
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
            var content = await postRepository.Get(id);
            var header = await titleRepository.Get(id);
            var post = content.Combine(header, (c, h) =>
            {
                c.Header = h;
                return c;
            });

            var commentCount = await forumCommentRepository.Count(id);
            var latestComment = await post.UnwrapAsync(async p =>
            {
                if (p.Header.LatestComment.HasValue)
                    return await forumCommentRepository.GetSingleByID(p.Header.LatestComment.Value);
                return Option.None<Comment>();
            });

            var result = post.Map(p =>
            {
                var comment = latestComment.ValueOr(alternative: null);
                return Converters.ToThreadPostContentDTO(p, comment, commentCount);
            });

            return result.ReturnOrFailWith(HttpStatusCode.NotFound);
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

            var result = titleCreated.FlatMap(t =>
            {
                return postRepository.Create(post, onCreate).Result;
            });

            return result
                .ReturnMessage(Request.CreateResponse, HttpStatusCode.Created, HttpStatusCode.InternalServerError);
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put([FromUri] int postId, [FromUri] bool read)
        {
            var user = Request.GetUser();
            var result = await user.UnwrapAsync(async u =>
            {
                if (read) return await markPost.ReadPost(u, postId);
                return await markPost.UnreadPost(u, postId);
            });

            return result
                .Some()
                .ReturnMessage(Request.CreateResponse, HttpStatusCode.OK, HttpStatusCode.InternalServerError);
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
