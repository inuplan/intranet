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
    using System;
    using System.Text;
    using System.Security.Cryptography;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Common.DTOs;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using sysDraw = System.Drawing;
    using System.Drawing.Imaging;
    using System.Collections.Concurrent;
    using System.Drawing.Drawing2D;
    /// <summary>
    /// Image file controller
    /// </summary>
    [RoutePrefix("image")]
    public class ImageController : ApiController
    {
        /// <summary>
        /// Sets the length of the filename.
        /// </summary>
        private const int FILENAME_LENGTH = 5;

        private const double MEDIUM_SCALE_FACTOR = 0.5d;

        /// <summary>
        /// The image repository, which stores the images.
        /// </summary>
        private readonly IRepository<string, Image> imageRepository;

        /// <summary>
        /// The root of the root folder
        /// </summary>
        private readonly string root;

        /// <summary>
        /// Instantiates a new <see cref="ImageController"/> instance.
        /// </summary>
        /// <param name="imageRepository">The image repository, which stores the images</param>
        public ImageController(string root, IRepository<string, Image> imageRepository)
        {
            this.imageRepository = imageRepository;
            this.root = root;
        }

        /// <summary>
        /// Uploads an image to a user folder.
        /// </summary>
        /// <param name="username">The 3-letter username to upload to</param>
        /// <returns>Returns a response message to the caller</returns>
        // POST image/JMS/upload
        [Route("{username:alpha:length(2,6)}/upload")]
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

            var bag = new ConcurrentBag<int>();
            var tasks = provider.Contents.Select(async file =>
            {
                // TODO: encode filename
                var fullname = file.Headers.ContentDisposition.FileName.Split('.');
                var filename = fullname[0];
                var extension = fullname[1];
                var data = await file.ReadAsByteArrayAsync();

                var fileInfo = new FileInfo
                {
                    Filename = filename,
                    Extension = extension,
                    MimeType = Helpers.GetMIMEType(extension),
                    Owner = owner
                };

                var original = new FileData
                {
                    Data = new Lazy<byte[]>(() => data),
                    Path = GetPath(owner.Username, data, extension)
                };

                using (var stream = await file.ReadAsStreamAsync())
                {
                    var mediumImage = sysDraw.Image.FromStream(stream);

                    var newWidth = (int)(mediumImage.Width * MEDIUM_SCALE_FACTOR);
                    var newHeight = (int)(mediumImage.Height * MEDIUM_SCALE_FACTOR);
                    using (var newImage = new sysDraw.Bitmap(newWidth, newHeight))
                    using (var graphics = sysDraw.Graphics.FromImage(newImage))
                    {
                        graphics.SmoothingMode = SmoothingMode.AntiAlias;
                        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        graphics.DrawImage(mediumImage, new sysDraw.Rectangle(0, 0, newWidth, newHeight));

                        // TODO: Save image to byte array

                    }

                    // TODO: Manipulate image to certain sizes:
                    var medium = new FileData
                    {
                    };

                    // Remember to reset pointer?!
                    stream.Position = 0;
                }
                var thumbnail = new FileData
                {
                };

                var image = new Image
                {
                    MetaData = fileInfo,
                    Original = original,
                    Medium = medium,
                    Thumbnail = thumbnail
                };

                await imageRepository.Create(image);
                bag.Add(1);
            });

            await Task.WhenAll(tasks);

            var response = string.Format("Finished uploading {0} file(s)", bag.Count);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        /// <summary>
        /// Returns a well-formed path
        /// </summary>
        /// <param name="username">The username of the user</param>
        /// <param name="data">The image</param>
        /// <returns>A path to where the image should be stored</returns>
        [NonAction]
        private string GetPath(string username, byte[] data, string extension)
        {
            // Return %root%/username/date{yyyymmdd}/{sha1:length(5)}.extension
            var sb = new StringBuilder();
            sb.AppendFormat("{0}/{1}/{2:yyyyMMdd}/", root, username, DateTime.Now);

            var sha1 = SHA1.Create();
            var hash = sha1.ComputeHash(data).ToString().Substring(0, FILENAME_LENGTH);

            sb.AppendFormat("{0}.{1}", hash, extension);
            return sb.ToString();
        }
    }
}
