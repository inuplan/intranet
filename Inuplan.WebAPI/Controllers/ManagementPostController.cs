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
    using System;
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
    [RoutePrefix("api/posts/executive")]
    public class ManagementPostController : ApiController
    {
        /// <summary>
        /// A repository of Posts entities
        /// </summary>
        private readonly IRepository<int, Post> postRepository;

        /// <summary>
        /// Determines whether the resource has been disposed
        /// </summary>
        private bool disposed;

        /// <summary>
        /// Initializes an instance of the <see cref="ManagementPostController"/> class.
        /// </summary>
        /// <param name="postRepository">A repository of posts</param>
        public ManagementPostController(IRepository<int, Post> postRepository)
        {
            this.postRepository = postRepository;
        }

        /// <summary>
        /// Creates a <see cref="Post"/> in the database<br />
        /// The body of the request should contain a <see cref="Post"/> entity
        /// </summary>
        /// <param name="post">The post to create</param>
        /// <returns>An http response indicating whether the creation was successful</returns>
        [HttpPut]
        public async Task<HttpResponseMessage> Create(Post post)
        {
            // Set time to server time
            post.PostedOn = DateTime.Now;

            // Create post in the database
            var entity = await postRepository.Create(post);

            // Return result
            return entity.Match(
                p => Request.CreateResponse(HttpStatusCode.Created, "Created with ID:" + p.ID),
                () => Request.CreateResponse(HttpStatusCode.InternalServerError, "Could not create post"));
        }

        [Route("{id:int}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetSingle(int id)
        {
            var result = await postRepository.Get(id);
            return result.Match(
                    p => Request.CreateResponse(HttpStatusCode.OK, p),
                    () => Request.CreateResponse(HttpStatusCode.NotFound));
        }

        /// <summary>
        /// Returns a list of management posts from the database<br />
        /// Default values for skip and take are: 0 and 10.
        /// </summary>
        /// <param name="skip">The number of posts to skip</param>
        /// <param name="take">The number of posts to take</param>
        /// <returns>Returns a list of posts</returns>
        [Route("skip/{skip:int}/take/{take:int}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetRange(int skip = 0, int take = 10)
        {
            var posts = await postRepository.Get(skip, take);
            return Request.CreateResponse(HttpStatusCode.OK, posts);
        }

        /// <summary>
        /// Returns every management post.
        /// </summary>
        /// <returns>Returns every management post</returns>
        [Route("all")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetAll()
        {
            var posts = await postRepository.GetAll();
            return Request.CreateResponse(HttpStatusCode.OK, posts);
        }

        /// <summary>
        /// Updates an existing management post
        /// The post must have the correct ID.
        /// Every field will be updated to the provided post.
        /// </summary>
        /// <param name="post">The management post</param>
        /// <returns>An http response</returns>
        [HttpPost]
        public async Task<HttpResponseMessage> Update(Post post)
        {
            int key = post.ID;
            var result = await postRepository.Update(key, post);
            return result.Match(
                    _ => Request.CreateResponse(HttpStatusCode.NoContent),
                    () => Request.CreateResponse(HttpStatusCode.InternalServerError));
        }

        /// <summary>
        /// Deletes a management post with the given id.
        /// </summary>
        /// <param name="id">The id of the management post</param>
        /// <returns>An http response</returns>
        [Route("{id:int}")]
        [HttpDelete]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            var result = await postRepository.Delete(id);
            return result.Match(
                    _ => Request.CreateResponse(HttpStatusCode.NoContent),
                    () => Request.CreateResponse(HttpStatusCode.InternalServerError));
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
                postRepository.Dispose();
            }

            disposed = true;
            base.Dispose(disposing);
        }
    }
}
