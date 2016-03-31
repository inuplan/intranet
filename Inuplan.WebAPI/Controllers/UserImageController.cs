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
    using NLog;
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
    [EnableCors(origins: @"http://localhost:59382", headers: "", methods: "*", SupportsCredentials = true)]
    [RoutePrefix("{username:alpha:length(2,6)}/image")]
    public class UserImageController : ApiController, IUserImageController
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
        private readonly IScalarRepository<Key, UserImage> userImageRepository;

        /// <summary>
        /// The user database repository, which contains the registered users.
        /// </summary>
        private readonly IScalarRepository<string, User> userDatabaseRepository;

        /// <summary>
        /// The repository comments for an image.
        /// </summary>
        private readonly IVectorRepository<int, List<Post>, Post> imageCommentsRepo;
        private readonly IScalarRepository<string, ProfileImage> profileImageRepository;

        /// <summary>
        /// Instantiates a new <see cref="UserImageController"/> instance.
        /// </summary>
        /// <param name="userImageRepository">The image repository, which stores the images</param>
        public UserImageController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            IScalarRepository<Key, UserImage> userImageRepository,
            IVectorRepository<int, List<Post>, Post> imageCommentsRepo,
            IScalarRepository<string, ProfileImage> profileImageRepository,
            ImageHandleFactory imageHandleFactory)
        {
            this.userDatabaseRepository = userDatabaseRepository;
            this.userImageRepository = userImageRepository;
            this.imageCommentsRepo = imageCommentsRepo;
            this.profileImageRepository = profileImageRepository;
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
                logger.Error("Cannot upload to another users folder");
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Cannot upload to another users folder");
            }

            if(!Request.Content.IsMimeMultipartContent())
            {
                logger.Error("Must be a multipart content type");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Must be a multipart content type!");
            }

            // Proceed - everything OK
            var provider = await Request.Content.ReadAsMultipartAsync(new MultipartMemoryStreamProvider());
            var bag = new ConcurrentBag<UserImage>();

            var tasks = provider.Contents.Select(async file =>
            {
                // Process individual image
                logger.Trace("Processing image...");
                var handler = imageHandleFactory.GetImageHandler();
                var user = GetPrincipalIdentityUser(RequestContext.Principal);
                var image = await handler.ProcessUserImage(user, file);

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
                    success =>
                    {
                        logger.Debug("Saved image: {0}.{1}\tWith ID: {2}", success.Metadata.Filename, success.Metadata.Extension, success.Metadata.ID);
                        error = false;
                    },
                    () =>
                    {
                        logger.Error("Could not save: {0}.{1}", image.Metadata.Filename, image.Metadata.Extension);
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
        /// <param name="file">The full name of the image requested</param>
        /// <returns>The requested image</returns>
        // GET user/image/test.jpeg
        [Route("{file}")]
        public async Task<HttpResponseMessage> Get(string username, string file)
        {
            var tmp = Helpers.GetFilename(file);
            var filename = tmp.Item1;
            var extension = tmp.Item2;

            var image = await userImageRepository.Get(new Key(username, filename, extension));

            return image.Match(img =>
            {
                var imageBlob = img.Original.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(img.Metadata.MimeType);
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
        // GET user/image/preview/test.jpeg
        [Route("preview/{file}")]
        public async Task<HttpResponseMessage> GetPreview(string username, string file)
        {
            var tmp = Helpers.GetFilename(file);
            var filename = tmp.Item1;
            var extension = tmp.Item2;

            var image = await userImageRepository.Get(new Key(username, filename, extension));

            return image.Match(i =>
            {
                var imageBlob = i.Medium.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(i.Metadata.MimeType);
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
        // GET user/image/thumbnail/test.jpeg
        [Route("thumbnail/{file}")]
        public async Task<HttpResponseMessage> GetThumbnail(string username, string file)
        {
            var tmp = Helpers.GetFilename(file);
            var filename = tmp.Item1;
            var extension = tmp.Item2;

            var image = await userImageRepository.Get(new Key(username, filename, extension));

            return image.Match(i =>
            {
                var imageBlob = i.Thumbnail.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(imageBlob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(i.Metadata.MimeType);
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
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(img.Metadata.MimeType);
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
        // GET user/image?comments=true
        [HttpGet]
        [Route("")]
        public async Task<List<UserImageDTO>> GetAll(string username, [FromUri] bool comments = false)
        {
            // Helper method, Image -> string URL
            var baseAddress = "http://" + Request.RequestUri.Authority + Request.RequestUri.LocalPath;
            var getOriginalUrl = new Func<UserImage, string>(
                img => string.Format("{0}/{1}.{2}",
                    baseAddress,
                    img.Metadata.Filename,
                    img.Metadata.Extension));

            var getPreviewUrl = new Func<UserImage, string>(
                i => string.Format("{0}/preview/{1}.{2}",
                    baseAddress,
                    i.Metadata.Filename,
                    i.Metadata.Extension));

            var getThumbnailUrl = new Func<UserImage, string>(
                i => string.Format("{0}/thumbnail/{1}.{2}",
                    baseAddress,
                    i.Metadata.Filename,
                    i.Metadata.Extension));

            var getProfilePictureUrl = new Func<Post, string>(
                p => string.Format("{0}/{1}/image/profile/picture.jpg",
                    baseAddress,
                    p.Author.Username));

            // Helper method: Gets the comments for an image given the id
            var getCommentImage = new Func<int, IEnumerable<IGrouping<int, List<Post>>>, List<CommentDTO>>((int id, IEnumerable<IGrouping<int, List<Post>>> collection) =>
               collection.Where(g => g.Key == id).SelectMany(g => g.SelectMany(t => t.Select(p => new CommentDTO
               {
                   Author = new UserDTO
                   {
                       ID = p.Author.ID,
                       FirstName = p.Author.FirstName,
                       LastName = p.Author.LastName,
                       Username = p.Author.Username,
                       Email = p.Author.Email,
                       ProfileImageUrl = getProfilePictureUrl(p),
                   },
                   Comment = p.Comment,
                   ID = p.ID,
                   PostedOn = p.PostedOn
               }))).ToList());

            // Get all images from DB
            var user = await userDatabaseRepository.Get(username);
            if(!user.HasValue)
            {
                // User does not exists!
                logger.Error("User: {0}, does not exists!", username);
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            // Filters by username, and creates an ImageDTO list
            var images = await userImageRepository.GetAll();
            var allComments = await imageCommentsRepo.GetAll();
            var result = images
                                .Where(i => 
                                    i.Metadata.Owner
                                    .Username.Equals(username, StringComparison.OrdinalIgnoreCase))
                                .Select(img => new UserImageDTO
                                {
                                    Extension = img.Metadata.Extension,
                                    Filename = img.Metadata.Filename,
                                    ImageID = img.Metadata.ID,
                                    Username = img.Metadata.Owner.Username,
                                    PathOriginalUrl = getOriginalUrl(img),
                                    PathPreviewUrl = getPreviewUrl(img),
                                    PathThumbnailUrl = getThumbnailUrl(img),
                                })
                                .Select(img => {
                                    if (comments)
                                    {
                                        img.Comments = getCommentImage(img.ImageID, allComments);
                                    }

                                    return img;
                                })
                                .ToList();
            return result;
        }

        // GET user/image/profile
        [Route("profile")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetProfilePicture(string username)
        {
            var profileImage = await profileImageRepository.Get(username);
            return profileImage.Match(img =>
            {
                var blob = img.Data.Data.Value;
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new ByteArrayContent(blob);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(img.Metadata.MimeType);
                return response;
            },
            () => Request.CreateResponse(HttpStatusCode.NotFound));
        }

        // POST user/image/profile
        [Route("profile")]
        [HttpPost]
        public async Task<HttpResponseMessage> UploadProfileImage(string username)
        {
            if (!AuthorizeToUsername(username))
            {
                logger.Error("Cannot upload to another users folder");
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Cannot upload to another users folder");
            }

            if(!Request.Content.IsMimeMultipartContent())
            {
                logger.Error("Must be a multipart content type");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Must be a multipart content type!");
            }

            // Extract the stream and read the file
            var provider = await Request.Content.ReadAsMultipartAsync(new MultipartMemoryStreamProvider());

            if(provider.Contents.Count != 1)
            {
                logger.Error("Can only upload one profile picture");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Can only upload one profile picture");
            }

            var file = provider.Contents.First();
            var handler = imageHandleFactory.GetImageHandler();

            // Construct profile image
            var user = GetPrincipalIdentityUser(RequestContext.Principal);
            var image = await handler.ProcessProfileImage(user, file);

            // Save the profile image to the database and filesystem
            var created = await profileImageRepository.Create(image);

            // Respond with success or fail
            return created.Match(
                p =>
                {
                    var response = Request.CreateResponse(HttpStatusCode.Created);
                    var location = string.Format("{0}/image/profile/picture.jpg", username);
                    response.Headers.Location = new Uri(location, UriKind.Relative);
                    return response;
                },
                () => Request.CreateResponse(HttpStatusCode.InternalServerError));
        }

        /// <summary>
        /// Deletes an image from the server and filesystem
        /// </summary>
        /// <param name="username"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        // DELETE user/image/test.jpeg
        [Route("{file}")]
        [HttpDelete]
        public async Task<HttpResponseMessage> Delete(string username, string file)
        {
            if(!AuthorizeToUsername(username))
            {
                logger.Error("Cannot delete another user's image");
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Cannot delete another user's image");
            }

            var filename = Helpers.GetFilename(file);
            var deleted = await userImageRepository.Delete(new Key(username, filename.Item1, filename.Item2));

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
            var principal = RequestContext.Principal;
            return username.Equals(principal.Identity.Name, StringComparison.OrdinalIgnoreCase);
        }
        
        /// <summary>
        /// Gets the <see cref="User"/> which is stored in the <see cref="IPrincipal"/> object.
        /// </summary>
        /// <param name="principal">The principal object</param>
        /// <returns>A user</returns>
        /// <exception cref="InvalidOperationException">thrown when no user exist</exception>
        [NonAction]
        private User GetPrincipalIdentityUser(IPrincipal principal)
        {
            var user = principal.TryGetUser();
            return user.Match(
                // Return the user
                u => u,
                () =>
                {
                    logger.Error("User has not been set by the InuplanAuthorizationAttribute object");
                    throw new InvalidOperationException();
                });
        }
    }
}