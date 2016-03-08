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
    using Authorization.Principal;
    using Autofac.Extras.Attributed;
    using Common.DTOs;
    using Common.Enums;
    using Common.Factories;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using NLog;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    /// <summary>
    /// Image file controller
    /// </summary>
    [RoutePrefix("{username:alpha:length(2,6)}/image")]
    public class ImageController : ApiController
    {
        /// <summary>
        /// The logging framework
        /// </summary>
        private static Logger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Image handle factory
        /// </summary>
        private readonly ImageHandleFactory imageHandleFactory;

        /// <summary>
        /// The image repository, which stores the images.
        /// </summary>
        private readonly IScalarRepository<Tuple<string, string, string>, Image> imageRepository;

        /// <summary>
        /// The user database repository, which contains the registered users.
        /// </summary>
        private readonly IScalarRepository<string, User> userDatabaseRepository;

        /// <summary>
        /// Instantiates a new <see cref="ImageController"/> instance.
        /// </summary>
        /// <param name="imageRepository">The image repository, which stores the images</param>
        public ImageController(
            [WithKey(ServiceKeys.ImageRepository)] IScalarRepository<Tuple<string, string, string>, Image> imageRepository,
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            ImageHandleFactory imageHandleFactory)
        {
            this.imageRepository = imageRepository;
            this.userDatabaseRepository = userDatabaseRepository;
            this.imageHandleFactory = imageHandleFactory;
        }

        /// <summary>
        /// Uploads an image to a user folder.
        /// </summary>
        /// <param name="username">The 3-letter username to upload to</param>
        /// <returns>Returns a response message to the caller</returns>
        // POST user/image/upload
        [Route("upload")]
        [HttpPost]
        public async Task<HttpResponseMessage> Post(string username)
        {
            if(!Request.Content.IsMimeMultipartContent())
            {
                logger.Error("Must be a multipart content type");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Must be a multipart content type!");
            }

            if (!AuthorizeToUsername(username))
            {
                logger.Error("Cannot upload to another users folder");
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Cannot upload to another users folder");
            }

            // Proceed - everything OK
            var provider = await Request.Content.ReadAsMultipartAsync(new MultipartMemoryStreamProvider());
            var bag = new ConcurrentBag<Image>();

            var tasks = provider.Contents.Select(async file =>
            {
                // Process individual image
                logger.Trace("Processing image...");
                var handler = imageHandleFactory.GetImageHandler();
                var image = await handler.ProcessImage(((InuplanPrincipal)RequestContext.Principal).User, file);

                // Add images to the collection
                bag.Add(image);
            });

            // Wait for all images to be processed
            await Task.WhenAll(tasks);
            var error = true;

            // Save images to the repository
            var save = bag.Select(async image =>
            {
                var created = await imageRepository.Create(image);
                created.Match(
                    success =>
                    {
                        logger.Debug("Saved image: {0}.{1}\tWith ID: {2}", success.MetaData.Filename, success.MetaData.Extension, success.MetaData.ID);
                        error = false;
                    },
                    () =>
                    {
                        logger.Error("Could not save: {0}.{1}", image.MetaData.Filename, image.MetaData.Extension);
                    });
            });

            await Task.WhenAll(save);

            var response = string.Format("Finished uploading {0} file(s)", bag.Count);
            return (!error) ?
                Request.CreateResponse(HttpStatusCode.Created, response) :
                Request.CreateResponse(HttpStatusCode.InternalServerError,
                   "Could not save file. Possible reasons: File already exists or database error. See log files for more information.");
        }

        /// <summary>
        /// Retrieves the original image from the database
        /// </summary>
        /// <param name="username">The username of the current user</param>
        /// <param name="fullname">The full name of the image requested</param>
        /// <returns>The requested image</returns>
        // GET user/image/test.jpeg
        [Route("{fullname}")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> Get(string username, string fullname)
        {
            var tmp = Helpers.GetFilename(fullname);
            var filename = tmp.Item1;
            var extension = tmp.Item2;

            var image = await imageRepository.Get(new Tuple<string, string, string>(username, filename, extension));

            return image.Match(i =>
            {
                var imageBlob = i.Original.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(i.MetaData.MimeType);
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
        /// <param name="fullname">The full name of the image requested</param>
        /// <returns>The requested image</returns>
        // GET user/image/preview/test.jpeg
        [Route("preview/{fullname}")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> GetPreview(string username, string fullname)
        {
            var tmp = Helpers.GetFilename(fullname);
            var filename = tmp.Item1;
            var extension = tmp.Item2;

            var image = await imageRepository.Get(new Tuple<string, string, string>(username, filename, extension));

            return image.Match(i =>
            {
                var imageBlob = i.Medium.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(i.MetaData.MimeType);
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
        /// <param name="fullname">The full name of the image requested</param>
        /// <returns>The requested image</returns>
        // GET user/image/thumbnail/test.jpeg
        [Route("thumbnail/{fullname}")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> GetThumbnail(string username, string fullname)
        {
            var tmp = Helpers.GetFilename(fullname);
            var filename = tmp.Item1;
            var extension = tmp.Item2;

            var image = await imageRepository.Get(new Tuple<string, string, string>(username, filename, extension));

            return image.Match(i =>
            {
                var imageBlob = i.Thumbnail.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(i.MetaData.MimeType);
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
        [AllowAnonymous]
        public async Task<HttpResponseMessage> GetByID(int id)
        {
            var image = await imageRepository.GetByID(id);
            return image.Match(i =>
            {
                var imageBlob = i.Original.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(i.MetaData.MimeType);
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
        /// <returns>An awaitable list of <see cref="ImageDTO"/></returns>
        // GET user/image
        [HttpGet]
        [AllowAnonymous]
        [Route("")]
        public async Task<List<ImageDTO>> GetAll(string username)
        {
            // Helper method, Image -> string URL
            var getOriginalUrl = new Func<Image, string>(
                i => string.Format("{0}/{1}.{2}",
                    Request.RequestUri.AbsoluteUri,
                    i.MetaData.Filename,
                    i.MetaData.Extension));

            var getPreviewUrl = new Func<Image, string>(
                i => string.Format("{0}/preview/{1}.{2}",
                    Request.RequestUri.AbsoluteUri,
                    i.MetaData.Filename,
                    i.MetaData.Extension));

            var getThumbnailUrl = new Func<Image, string>(
                i => string.Format("{0}/thumbnail/{1}.{2}",
                    Request.RequestUri.AbsoluteUri,
                    i.MetaData.Filename,
                    i.MetaData.Extension));

            // Get all images from DB
            var user = await userDatabaseRepository.Get(username);
            if(!user.HasValue)
            {
                // User does not exists!
                logger.Error("User: {0}, does not exists!", username);
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            // Filters by username, and creates an ImageDTO list
            var images = await imageRepository.GetAll();
            var result = images
                                .Where(i => 
                                    i.MetaData.Owner
                                    .Username.Equals(username, StringComparison.OrdinalIgnoreCase))
                                .Select(i => new ImageDTO
                                {
                                    Extension = i.MetaData.Extension,
                                    Filename = i.MetaData.Filename,
                                    ImageID = i.MetaData.ID,
                                    Username = i.MetaData.Owner.Username,
                                    PathOriginalUrl = getOriginalUrl(i),
                                    PathPreviewUrl = getPreviewUrl(i),
                                    PathThumbnailUrl = getThumbnailUrl(i)
                                }).ToList();
            return result;
        }

        /// <summary>
        /// Deletes an image from the server and filesystem
        /// </summary>
        /// <param name="username"></param>
        /// <param name="fullname"></param>
        /// <returns></returns>
        // DELETE user/image/test.jpeg
        [Route("{fullname}")]
        [HttpDelete]
        public async Task<HttpResponseMessage> Delete(string username, string fullname)
        {
            if(!AuthorizeToUsername(username))
            {
                logger.Error("Cannot delete another user's image");
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Cannot delete another user's image");
            }

            var filename = Helpers.GetFilename(fullname);
            var deleted = await imageRepository.Delete(new Tuple<string, string, string>(username, filename.Item1, filename.Item2));

            return deleted ?
                Request.CreateResponse(HttpStatusCode.OK, "Image deleted") :
                Request.CreateResponse(HttpStatusCode.InternalServerError, "Failed to delete image");
        }

        /// <summary>
        /// Checks if the username matches the principal name
        /// </summary>
        /// <param name="username">The username to check</param>
        /// <returns>True if the same, otherwise false</returns>
        [NonAction]
        private bool AuthorizeToUsername(string username)
        {
            var principal = (InuplanPrincipal)RequestContext.Principal;
            return username.Equals(principal.Identity.Name, StringComparison.OrdinalIgnoreCase);
        }
    }
}
