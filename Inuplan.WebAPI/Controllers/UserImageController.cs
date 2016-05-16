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
    using Common.Controllers;
    using Common.DTOs;
    using Common.Enums;
    using Common.Factories;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using Extensions;
    using NLog;
    using Optional;
    using Optional.Unsafe;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Security.Principal;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;
    using Key = System.Tuple<string, string, string>;

    /// <summary>
    /// Image file controller
    /// </summary>
    [EnableCors(origins: Constants.Origin, headers: "accept, *", methods: "*", SupportsCredentials = true)]
    [RoutePrefix("{username}/image")]
    public class UserImageController : DefaultController
    {
        /// <summary>
        /// Image handle factory
        /// </summary>
        private readonly ImageHandleFactory imageHandleFactory;

        /// <summary>
        /// The image repository, which stores the images.
        /// </summary>
        private readonly IScalarRepository<int, Image> userImageRepository;

        /// <summary>
        /// The repository comments for an image.
        /// </summary>
        private readonly IVectorRepository<int, Comment> imageCommentsRepo;

        /// <summary>
        /// Instantiates a new <see cref="UserImageController"/> instance.
        /// </summary>
        /// <param name="userImageRepository">The image repository, which stores the images</param>
        public UserImageController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            IScalarRepository<int, Image> userImageRepository,
            IVectorRepository<int, Comment> imageCommentsRepo,
            ImageHandleFactory imageHandleFactory)
            : base(userDatabaseRepository)
        {
            this.userImageRepository = userImageRepository;
            this.imageCommentsRepo = imageCommentsRepo;
            this.imageHandleFactory = imageHandleFactory;
        }

        /// <summary>
        /// Uploads an image to a user folder.
        /// </summary>
        /// <param name="username">The 3-letter username to upload to</param>
        /// <returns>Returns a response message to the caller</returns>
        // POST user/image
        [Route("")]
        [HttpPost]
        public async Task<HttpResponseMessage> Post(string username)
        {
            if (!AuthorizeToUsername(username))
            {
                Logger.Error("Cannot upload to another users folder");
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Cannot upload to another users folder");
            }

            if (!Request.Content.IsMimeMultipartContent())
            {
                Logger.Error("Must be a multipart content type");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Must be a multipart content type!");
            }

            // Proceed - everything OK
            var provider = await Request.Content.ReadAsMultipartAsync(new MultipartMemoryStreamProvider());
            var bag = new ConcurrentBag<Image>();

            var tasks = provider.Contents.Select(async file =>
            {
                // Process individual image
                Logger.Trace("Processing image...");
                var handler = imageHandleFactory.GetImageHandler();
                var user = Request.GetUser().ValueOrFailure();
                var image = await handler.ProcessUserImage(user, file, "");

                // Add images to the collection
                bag.Add(image);
            });

            // Wait for all images to be processed
            await Task.WhenAll(tasks);
            var error = true;

            // Save images to the repository
            var save = bag.Select(async image =>
            {
                var created = await userImageRepository.Create(image);
                created.Match(
                    img =>
                    {
                        Logger.Debug("Saved image: {0}.{1}\tWith ID: {2}", img.Filename, img.Extension, img.ID);
                        error = false;
                    },
                    () =>
                    {
                        Logger.Error("Could not save: {0}.{1}", image.Filename, image.Extension);
                    });
            });

            await Task.WhenAll(save);

            var response = string.Format("Finished uploading {0} file(s)", bag.Count);
            return (!error) ?
                Request.CreateResponse(HttpStatusCode.Created, response) :
                Request.CreateResponse(HttpStatusCode.InternalServerError,
                   "Could not save file. Possible reasons: File already exists or database error. See log files for more information.");
        }

        [HttpPut]
        [Route("{id:int}/{file}")]
        public async Task<HttpResponseMessage> Put(string username, int id, string file, [FromBody] string description)
        {
            // Only update the description for the image
            var image = new Image
            {
                Description = description
            };

            var updated = await userImageRepository.Update(id, image);
            return updated ?
                Request.CreateResponse(HttpStatusCode.OK) :
                Request.CreateResponse(HttpStatusCode.InternalServerError, "Possible error: could not locate the specified file.");
        }

        /// <summary>
        /// Retrieves the original image from the database
        /// </summary>
        /// <param name="username">The username of the current user</param>
        /// <param name="file">The full name of the image requested</param>
        /// <returns>The requested image</returns>
        // GET user/image/1/test.jpeg
        [Route("{id:int}/{file}")]
        public async Task<HttpResponseMessage> Get(string username, int id, string file)
        {
            var tmp = Helpers.GetFilename(file);
            var filename = tmp.Item1;
            var extension = tmp.Item2;

            var image = await userImageRepository.Get(id);

            return image.Match(img =>
            {
                var imageBlob = img.Original.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(img.MimeType);
                return response;
            },
            () =>
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            });
        }

        /// <summary>
        /// Retrieves the half-sized image from the database.
        /// </summary>
        /// <param name="username">The username of the current user</param>
        /// <param name="file">The full name of the image requested</param>
        /// <returns>The requested image</returns>
        // GET user/image/1/preview/test.jpeg
        [Route("{id:int}/preview/{file}")]
        public async Task<HttpResponseMessage> GetPreview(string username, int id, string file)
        {
            var tmp = Helpers.GetFilename(file);
            var filename = tmp.Item1;
            var extension = tmp.Item2;

            var image = await userImageRepository.Get(id);

            return image.Match(img =>
            {
                var imageBlob = img.Preview.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(img.MimeType);
                return response;
            },
            () =>
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            });
        }

        /// <summary>
        /// Retrieves the thumbnail image from the database.
        /// </summary>
        /// <param name="username">The username of the current user</param>
        /// <param name="file">The full name of the image requested</param>
        /// <returns>The requested image</returns>
        // GET user/image/1/thumbnail/test.jpeg
        [Route("{id:int}/thumbnail/{file}")]
        public async Task<HttpResponseMessage> GetThumbnail(string username, int id, string file)
        {
            var tmp = Helpers.GetFilename(file);
            var filename = tmp.Item1;
            var extension = tmp.Item2;

            var image = await userImageRepository.Get(id);

            return image.Match(img =>
            {
                var imageBlob = img.Thumbnail.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(img.MimeType);
                return response;
            },
            () =>
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            });
        }

        /// <summary>
        /// Retrieves an image by the ID
        /// </summary>
        /// <param name="username">The username of the</param>
        /// <param name="id"></param>
        /// <returns></returns>
        // GET image/2
        [Route("~/image/id/{id:int}")]
        public async Task<HttpResponseMessage> GetByID(int id)
        {
            var image = await userImageRepository.GetByID(id);
            return image.Match(img =>
            {
                var imageBlob = img.Original.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(img.MimeType);
                return response;
            },
            () =>
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            });
        }

        /// <summary>
        /// Retrieves all images for a single user
        /// </summary>
        /// <param name="username">The username</param>
        /// <returns>An awaitable list of <see cref="UserImageDTO"/></returns>
        // GET user/image
        [HttpGet]
        [Route("")]
        public async Task<List<UserImageDTO>> GetAll(string username)
        {
            // Get user
            var user = await userDatabaseRepository.Get(username);

            // Get all images for the user
            var images = user.Map(u =>
            {
                // Transform image to DTOs
                var imgs = userImageRepository.GetAll(u.ID).Result;
                var dtos = imgs.Select(img => Convert(img));
                return dtos.ToList();
            });

            return images.Match(
                img => img,
                () =>
                {
                    Logger.Error("User: {0} not found", username);
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                });
        }

        /// <summary>
        /// Deletes an image from the server and filesystem
        /// </summary>
        /// <param name="username"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        // DELETE user/image/1
        [Route("{id:int}")]
        [HttpDelete]
        public async Task<HttpResponseMessage> Delete(string username, int id)
        {
            if (!AuthorizeToUsername(username))
            {
                Logger.Error("Cannot delete another user's image");
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Cannot delete another user's image");
            }

            var deleted = await userImageRepository.Delete(id);

            return deleted ?
                Request.CreateResponse(HttpStatusCode.OK, "Image deleted") :
                Request.CreateResponse(HttpStatusCode.InternalServerError, "Failed to delete image");
        }

        [NonAction]
        private UserImageDTO Convert(Image image)
        {
            // Construct image DTO
            var baseUri = new Uri(Request.RequestUri, RequestContext.VirtualPathRoot).ToString();
            return new UserImageDTO
            {
                Extension = image.Extension,
                Filename = image.Filename,
                ImageID = image.ID,
                PathOriginalUrl = string.Format("{0}{1}/image/{2}/{3}.{4}", baseUri, image.Owner.Username, image.ID, image.Filename, image.Extension),
                PathPreviewUrl = string.Format("{0}{1}/image/{2}/preview/{3}.{4}", baseUri, image.Owner.Username, image.ID, image.Filename, image.Extension),
                PathThumbnailUrl = string.Format("{0}{1}/image/{2}/thumbnail/{3}.{4}", baseUri, image.Owner.Username, image.ID, image.Filename, image.Extension),
                Username = image.Owner.Username,
            };
        }
    }
}