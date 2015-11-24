//-----------------------------------------------------------------------
// <copyright file="TestController.cs" company="Inuplan">
//    Original work Copyright (c) Inuplan
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy
//    of this software and associated documentation files (the "Software"), to deal
//    in the Software without restriction, including without limitation the rights
//    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//    copies of the Software, and to permit persons to whom the Software is
//    furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in
//    all copies or substantial portions of the Software.
// </copyright>
//-----------------------------------------------------------------------

namespace Inuplan.WebAPI.Controllers
{
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Optional;

    /// <summary>
    /// A <see cref="Post"/> controller
    /// </summary>
    [RoutePrefix("api/posts")]
    public class PostController : ApiController
    {
        /// <summary>
        /// A repository of Posts entities
        /// </summary>
        private readonly IRepository<int, Post> posts;

        /// <summary>
        /// Determines whether the resource has been disposed
        /// </summary>
        private bool disposed;

        /// <summary>
        /// Initializes an instance of the <see cref="PostController"/> class.
        /// </summary>
        /// <param name="posts">A repository of posts</param>
        public PostController(IRepository<int, Post> posts)
        {
            this.posts = posts;
        }

        /// <summary>
        /// Creates a post in the database from the management
        /// Path: domain.com/api/posts/executive_management
        /// </summary>
        /// <param name="post">The post to create</param>
        /// <returns>An http response indicating whether the creation was successful</returns>
        [Route("executive_management")]
        [HttpPost]
        public async Task<HttpResponseMessage> CreatePostFromManagement(Post post)
        {
            // If request reaches the controller, we assume user has been authorized
            var entity = await posts.Create(post);
            return entity.Match(
                p => Request.CreateResponse(HttpStatusCode.Created, "Created with ID:" + p.ID),
                () => Request.CreateResponse(HttpStatusCode.InternalServerError, "Could not create post"));
        }

        /// <summary>
        /// Uses the dispose pattern to dispose resources.
        /// </summary>
        /// <param name="disposing">A boolean indicating whether to dispose resources</param>
        [NonAction]
        protected override void Dispose(bool disposing)
        {
            if (disposed)
            {
                return;
            }

            if (disposing)
            {
                // Close the repository
                posts.Dispose();
            }

            disposed = true;
            base.Dispose(disposing);
        }
    }
}
