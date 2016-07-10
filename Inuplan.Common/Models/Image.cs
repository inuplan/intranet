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

namespace Inuplan.Common.Models
{
    using System;
    using System.Collections.Generic;

    public class Image
    {
        /// <summary>
        /// Gets or sets the id
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// Gets or sets the upload date
        /// </summary>
        public DateTime Uploaded { get; set; }

        /// <summary>
        /// Gets or sets the filename
        /// </summary>
        public string Filename { get; set; }

        /// <summary>
        /// Gets or sets the extension
        /// </summary>
        public string Extension { get; set; }

        /// <summary>
        /// Gets or sets the mime type
        /// </summary>
        public string MimeType { get; set; }

        /// <summary>
        /// Gets or sets the preview file information
        /// </summary>
        public FileInfo Preview { get; set; }

        /// <summary>
        /// Gets or sets the original file information
        /// </summary>
        public FileInfo Original { get; set; }

        /// <summary>
        /// Gets or sets the thumbnail file information
        /// </summary>
        public FileInfo Thumbnail { get; set; }

        /// <summary>
        /// Gets or sets the description
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the owner
        /// </summary>
        public User Owner { get; set; }
    }
}
