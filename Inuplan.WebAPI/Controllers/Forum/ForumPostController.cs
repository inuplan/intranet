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
    using Common.Logger;
    using Common.Models;
    using Common.Models.Forum;
    using Common.Repositories;
    using Common.Tools;
    using Extensions;
    using Extensions.Workflows;
    using Optional;
    using Optional.Unsafe;
    using System;
    using System.Diagnostics;
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
        private readonly LatestBroadcastService webSocketService;
        private readonly ILogger<ForumPostController> logger;

        public ForumPostController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            [WithKey(ServiceKeys.ThreadPostContentRepository)] IScalarRepository<int, ThreadPostContent> postRepository,
            [WithKey(ServiceKeys.ThreadPostTitleRepository)] IScalarRepository<int, ThreadPostTitle> titleRepository,
            [WithKey(ServiceKeys.ForumCommentsRepository)] IVectorRepository<int, Comment> forumCommentRepository,
            IAddItem whatsNew,
            IDeleteItem remove,
            IMarkPost markPost,
            LatestBroadcastService webSocketService,
            ILogger<ForumPostController> logger
        ) : base(userDatabaseRepository)
        {
            this.postRepository = postRepository;
            this.forumCommentRepository = forumCommentRepository;
            this.titleRepository = titleRepository;
            this.whatsNew = whatsNew;
            this.remove = remove;
            this.markPost = markPost;
            this.webSocketService = webSocketService;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<ThreadPostContentDTO> Get(int id)
        {
            logger.Begin();
            var content = await postRepository.Get(id);
            var header = await titleRepository.Get(id);
            var post = content
                .Combine(header, (c, h) =>
                {
                    c.Header = h;
                    return c;
                })
                .LogSome(c => logger.Trace("Combined content with header"));

            var commentCount = await forumCommentRepository.Count(id);
            var latestComment = await post
                .LogSome(p => logger.Trace("Post has comment: {0}", p.Header.LatestComment.HasValue))
                .FlatMapAsync(async p =>
                {
                    if (p.Header.LatestComment.HasValue)
                        return await forumCommentRepository.GetSingleByID(p.Header.LatestComment.Value);
                    return Option.None<Comment>();
                });

            var result = post
                .LogSome(p => logger.Trace("Converting post to dto"))
                .Map(p =>
                {
                    var comment = latestComment.ValueOr(alternative: null);
                    return Converters.ToThreadPostContentDTO(p, comment, commentCount);
                });

            logger.End();
            return result
                .LogSome(dto => logger.Trace("Returning post dto with id {0}", dto.ThreadID))
                .ReturnOrFailWith(HttpStatusCode.NotFound);
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(ThreadPostContent post)
        {
            logger.Begin();
            var user = Request
                .GetUser()
                .LogSome(u => logger.Trace("Retrieved user {0}", u.Username))
                .ValueOrFailure("No user found");

            logger.Trace("Setting author to user");
            post.Header.Author = user;

            logger.Trace("Setting created date to now for post");
            post.Header.CreatedOn = DateTime.Now;

            var titleCreated = await titleRepository
                .Create(post.Header, (t) => Task.FromResult(true))
                .LogSomeAsync(t => logger.Trace("Created post header with id: {0}", t.ThreadID));

            var onCreate = new Func<ThreadPostContent, Task<bool>>(async p =>
           {
               logger.Trace("Converting post model to dto");
               var dto = Converters.ToThreadPostContentDTO(p, null, 0);

               logger.Trace("Broadcasting on websocket, new forum thread created");
               webSocketService.NewForumThread(dto);

               logger.Trace("Adding forum thread to latest news");
               return await whatsNew.AddItem(p.ThreadID, NewsType.ThreadPost) > 0;
           });

            var result = await titleCreated
                .FlatMapAsync(async t => await postRepository.Create(post, onCreate))
                .LogSomeAsync(r => logger.Trace("Created post content"));

            logger.End();
            return result
                .ReturnMessage(Request.CreateResponse, HttpStatusCode.Created, HttpStatusCode.InternalServerError);
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put([FromUri] int postId, [FromUri] bool read)
        {
            logger.Begin();
            var user = Request
                .GetUser()
                .LogSome(u => logger.Trace("Retrieved user: {0}", u.Username));

            var result = await user
                .MapAsync(async u =>
                {
                    if (read) return await markPost.ReadPost(u, postId);
                    return await markPost.UnreadPost(u, postId);
                })
                .LogSomeAsync(u => logger.Trace("Marked post {0} as read {1}", postId, read));

            logger.End();
            return result
                .ReturnMessage(Request.CreateResponse, HttpStatusCode.OK, HttpStatusCode.InternalServerError);
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(ThreadPostContent content)
        {
            logger.Debug("Class: ForumPostController, Method: Put, BEGIN");
            var title = await titleRepository.GetByID(content.ThreadID);

            Option<ThreadPostTitle> updateHeader = await title
                .Map(t =>
                {
                    content.Header.CreatedOn = t.CreatedOn;
                    content.Header.ThreadID = t.ThreadID;
                    content.ThreadID = t.ThreadID;
                    return content.Header;
                })
                .Filter(t => t.ThreadID > 0)
                .LogSome(t => logger.Trace("Updating header id {0}", t.ThreadID))
                .LogNone(() => logger.Error("No post header found with id: {0}", content.ThreadID))
                .FlatMapAsync(async t =>
                {
                    var success = await titleRepository.Update(t.ThreadID, t);
                    if(success)
                    {
                        return t.Some();
                    }

                    return Option.None<ThreadPostTitle>();
                });

            var post = content
                .Some()
                .Combine(updateHeader, (c, h) =>
                {
                    c.Header = h;
                    return c;
                })
                .LogNone(() => logger.Error("Could not combine header and content"))
                .LogSome(c => logger.Trace("Combined header and content"));

            var updateContent = await post
                .FlatMapAsync(async c =>
                {
                    var success = await postRepository.Update(c.ThreadID, c);
                    if (success)
                        return c.Some();

                    return Option.None<ThreadPostContent>();
                })
                .LogNoneAsync(() => logger.Error("Could not update post content. Internal server error."))
                .LogSomeAsync(c => logger.Trace("Updated post content: {0}", c.ThreadID));

            logger.Debug("Class: ForumPostController, Method: Put, END");
            return updateContent
                .ReturnMessage(Request.CreateResponse, HttpStatusCode.NoContent, HttpStatusCode.InternalServerError);
        }

        [HttpDelete]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            logger.Begin();

            var thread = await titleRepository.Get(id);
            var isAuthorized = thread
                .Map(t => AuthorizeToUsername(t.Author.Username))
                .LogNone(() => logger.Error("User not authorized to delete {0}", id))
                .LogSome(t => logger.Trace("User authorized to delete {0}", id))
                .ValueOr(false);

            if (!isAuthorized)
            {
                logger.End();
                return Request.CreateResponse(HttpStatusCode.Unauthorized);
            }

            logger.Trace("Delete all comments belonging to the thread {0}", id);
            var deleteAllComments = await forumCommentRepository.Delete(id, (threadId) => Task.FromResult(0));
            if (!deleteAllComments)
            {
                logger.Error("Could not delete all comments, belonging to the thread {0}", id);
                logger.End();
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            logger.Trace("Delete the actual thread {0}", id);
            var delete = await titleRepository.Delete(id, (threadId) => remove.Remove(threadId, NewsType.ThreadPost));
            if (!delete)
            {
                logger.Error("Could not delete thread {0}", id);
                logger.End();
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            logger.Trace("Thread {0} deleted", id);
            logger.End();
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}