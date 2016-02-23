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
    using System.Collections.Concurrent;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Common.DTOs;
    using Common.Factories;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using NLog;
    using System;

    /// <summary>
    /// Image file controller
    /// </summary>
    [RoutePrefix("{username:alpha:length(2,6)}/image")]
    public class ImageController : ApiController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Image handle factory
        /// </summary>
        private readonly ImageHandleFactory imageHandleFactory;

        /// <summary>
        /// The image repository, which stores the images.
        /// </summary>
        private readonly IRepository<Tuple<string, string>, Image> imageRepository;

        /// <summary>
        /// Instantiates a new <see cref="ImageController"/> instance.
        /// </summary>
        /// <param name="imageRepository">The image repository, which stores the images</param>
        public ImageController(IRepository<Tuple<string, string>, Image> imageRepository, ImageHandleFactory imageHandleFactory)
        {
            this.imageRepository = imageRepository;
            this.imageHandleFactory = imageHandleFactory;
        }

        /// <summary>
        /// Uploads an image to a user folder.
        /// </summary>
        /// <param name="username">The 3-letter username to upload to</param>
        /// <returns>Returns a response message to the caller</returns>
        // POST JMS/image/upload
        [Route("upload")]
        [HttpPost]
        public async Task<HttpResponseMessage> Post(string username)
        {
            if(!Request.Content.IsMimeMultipartContent())
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Must be a multipart content type!");
            }

            // TODO: Could convert JWT middleware to AuthorizationAttribute
            var claims = Request.GetOwinContext().Get<ClaimsDTO>(Constants.JWT_CLAIMS);
            if(!username.Equals(claims.Username, StringComparison.OrdinalIgnoreCase))
            {
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Cannot upload to another users folder");
            }

            // TODO: Could set user in the middleware (custom principal, perhaps?)
            var owner = new User
            {
                Email = claims.Email,
                FirstName = claims.FirstName,
                LastName = claims.LastName,
                ID = claims.ID,
                Role = claims.Role,
                Username = claims.Username
            };

            var provider = await Request.Content.ReadAsMultipartAsync(new MultipartMemoryStreamProvider());
            var bag = new ConcurrentBag<Image>();

            var tasks = provider.Contents.Select(async file =>
            {
                // Process individual image
                var handler = imageHandleFactory.GetImageHandler();
                var image = await handler.ProcessImage(owner, file);

                // Add images to the collection
                bag.Add(image);
            });

            // Wait for all images to be processed
            await Task.WhenAll(tasks);
            var error = false;

            // Save images to the repository
            var save = bag.Select(async image =>
            {
                var created = await imageRepository.Create(image);
                created.Match(
                    success =>
                    {
                        logger.Debug("Saved image: {0}.{1}\tWith ID: {2}", success.MetaData.Filename, success.MetaData.Extension, success.MetaData.ID);
                    },
                    () =>
                    {
                        logger.Error("Could not save: {0}.{1}", image.MetaData.Filename, image.MetaData.Extension);
                        error = true;
                    });
            });

            await Task.WhenAll(save);

            var response = string.Format("Finished uploading {0} file(s)", bag.Count);
            return (!error) ?
                Request.CreateResponse(HttpStatusCode.OK, response) :
                Request.CreateResponse(HttpStatusCode.InternalServerError);
        }
    }
}
