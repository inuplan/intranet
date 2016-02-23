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

namespace Inuplan.WebAPI.Image
{
    using System;
    using System.Drawing.Imaging;
    using System.Net.Http;
    using System.Security.Cryptography;
    using System.Text;
    using System.Threading.Tasks;
    using d = System.Drawing;
    using Common.Interfaces;
    using Common.Models;
    using Common.Tools;

    public class Handle : IImageHandler
    {
        /// <summary>
        /// Sets the length of the filename.
        /// </summary>
        private readonly int filenameLength;

        /// <summary>
        /// Sets the root path for where to store the images
        /// </summary>
        private readonly string root;

        /// <summary>
        /// Sets the scaling factor for the medium sized image (in percent).
        /// </summary>
        private readonly double mediumScaleFactor;

        /// <summary>
        /// Sets the width for the  thumbnail (in pixels).
        /// </summary>
        private readonly int thumbnailWidth;

        /// <summary>
        /// Determines whether this class has been disposed
        /// </summary>
        private bool disposedValue = false;

        /// <summary>
        /// Initializes a new instance of the <see cref="Handle"/> class.
        /// </summary>
        /// <param name="mediumScaleFactor">The medium scaling factor (percent)</param>
        /// <param name="thumbnailWidth">The thumbnail width (pixels)</param>
        /// <param name="root">The root directory, where the images are stored</param>
        /// <param name="filenameLength">The length of the filename</param>
        public Handle(double mediumScaleFactor, int thumbnailWidth, string root, int filenameLength)
        {
            this.mediumScaleFactor = mediumScaleFactor;
            this.thumbnailWidth = thumbnailWidth;
            this.root = root;
            this.filenameLength = filenameLength;
        }

        /// <summary>
        /// Processes the image given in the <see cref="HttpContent"/> into a <see cref="Image"/> object.
        /// Resizes the image according to the settings given upon instantiation.
        /// </summary>
        /// <param name="user">The user who initiated the procedure</param>
        /// <returns>A processed image file</returns>
        public async Task<Image> ProcessImage(User user, HttpContent fileContent)
        {
            using(fileContent)
            {
                // Get filename
                var fullname = Filename(fileContent.Headers.ContentDisposition.FileName);
                var filename = fullname.Item1;
                var extension = fullname.Item2;

                // Result container
                FileData original = new FileData();
                FileData medium = new FileData();
                FileData thumbnail = new FileData();

                // File info
                var fileInfo = new FileInfo
                {
                    Filename = filename,
                    Extension = extension,
                    MimeType = Helpers.GetMIMEType(extension),
                    Owner = user
                };

                using (var fileStream = await fileContent.ReadAsStreamAsync())
                {
                    // Retrieve image
                    var image = d.Image.FromStream(fileStream);
                    var format = image.RawFormat;

                    // Convert image to byte array and set file path
                    var oData = ConvertToByte(image, format);
                    original.Data = new Lazy<byte[]>(() => oData);
                    original.Path = GetPath(user.Username, oData, extension);

                    // Calculate medium size
                    var mediumWidth = (int)(image.Width * mediumScaleFactor);
                    var mediumHeight = (int)(image.Height * mediumScaleFactor);

                    // Resize image and set file path
                    var mediumImage = ResizeImage(image, mediumWidth, mediumHeight);
                    var mData = ConvertToByte(mediumImage, format);
                    medium.Data = new Lazy<byte[]>(() => mData);
                    medium.Path = GetPath(user.Username, mData, extension);

                    // Calculate height factor & thumbnail height
                    var thumbnailHeightFactor = ((double)(image.Height) / (double)(image.Width));
                    var thumbnailHeight = (int)(thumbnailWidth * thumbnailHeightFactor);

                    // Resize thumbnail and set file path
                    var thumbnailImage = ResizeImage(image, thumbnailWidth, thumbnailHeight);
                    var tData = ConvertToByte(thumbnailImage, format);
                    thumbnail.Data = new Lazy<byte[]>(() => tData);
                    thumbnail.Path = GetPath(user.Username, tData, extension);
                }

                // Return the processed image file. Note it has not been saved to the database yet!
                return new Image
                {
                    MetaData = fileInfo,
                    Original = original,
                    Medium = medium,
                    Thumbnail = thumbnail
                };
            }
        }

        /// <summary>
        /// Extracts the filename and extension from a full filename.
        /// </summary>
        /// <param name="fullname">The full filename</param>
        /// <returns>A tuple, where the first item is the filename and the second item is the extension</returns>
        private Tuple<string, string> Filename(string fullname)
        {
            var split = fullname.Split('.');
            var file = string.Empty;

            // loop untill 2nd last item
            for (int i = 0; i < split.Length - 1; i++)
            {
                // append all to string
                file += split[i];
            }

            // last item must be the extension
            var extension = split[split.Length - 1];

            return new Tuple<string, string>(file, extension);
        }

        /// <summary>
        /// Resize the image to the specified width and height. <br />
        /// Source: http://stackoverflow.com/a/24199315
        /// </summary>
        /// <param name="image">The image to resize.</param>
        /// <param name="width">The width to resize to.</param>
        /// <param name="height">The height to resize to.</param>
        /// <returns>The resized image.</returns>
        private d.Bitmap ResizeImage(d.Image image, int width, int height)
        {
            var destRect = new d.Rectangle(0, 0, width, height);
            var destImage = new d.Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = d.Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = d.Drawing2D.CompositingMode.SourceCopy;
                graphics.CompositingQuality = d.Drawing2D.CompositingQuality.HighQuality;
                graphics.InterpolationMode = d.Drawing2D.InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = d.Drawing2D.SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = d.Drawing2D.PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(d.Drawing2D.WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, d.GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }

        /// <summary>
        /// Converts a <see cref="d.Image"/> to a byte array.
        /// </summary>
        /// <param name="image">The image to convert</param>
        /// <param name="format">The format in which to save the image</param>
        /// <returns>A byte array representing the image</returns>
        private byte[] ConvertToByte(d.Image image, ImageFormat format)
        {
            byte[] result;
            using (var stream = new System.IO.MemoryStream())
            {
                image.Save(stream, format);
                result = stream.ToArray();
            }

            return result;
        }

        /// <summary>
        /// Returns a well-formed path
        /// </summary>
        /// <param name="username">The username of the user</param>
        /// <param name="data">The image</param>
        /// <returns>A path to where the image should be stored</returns>
        private string GetPath(string username, byte[] data, string extension)
        {
            // Return %root%/username/date{yyyymmdd}/{sha1:length(5)}.extension
            var sb = new StringBuilder();
            sb.AppendFormat("{0}/{1}/{2:yyyyMMdd}/", root, username, DateTime.Now);

            var sha1 = SHA1.Create();
            var hash = sha1.ComputeHash(data).ToString().Substring(0, filenameLength);

            sb.AppendFormat("{0}.{1}", hash, extension);
            return sb.ToString();
        }
    }
}