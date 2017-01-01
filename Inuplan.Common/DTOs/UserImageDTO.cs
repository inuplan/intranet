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

namespace Inuplan.Common.DTOs
{
    using System;

    /// <summary>
    /// A data transfer object for an image on the server.
    /// </summary>
    public class UserImageDTO
    {
        /// <summary>
        /// Gets or sets the image author
        /// </summary>
        public UserDTO Author { get; set; }

        /// <summary>
        /// Gets or sets the ID of the image
        /// </summary>
        public int ImageID { get; set; }

        /// <summary>
        /// Gets or sets the uploaded date
        /// </summary>
        public DateTime Uploaded { get; set; }

        /// <summary>
        /// Gets or sets the filename of the image
        /// </summary>
        public string Filename { get; set; }

        /// <summary>
        /// Gets or sets the extension for the image
        /// </summary>
        public string Extension { get; set; }

        /// <summary>
        /// Gets or sets the url path to the original image
        /// </summary>
        public string OriginalUrl { get; set; }

        /// <summary>
        /// Gets or sets the url path to the preview image
        /// </summary>
        public string PreviewUrl { get; set; }

        /// <summary>
        /// Gets or sets the url path to the thumbnail image
        /// </summary>
        public string ThumbnailUrl { get; set; }

        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the number of comments for this image
        /// </summary>
        public int CommentCount { get; set; }
    }
}
