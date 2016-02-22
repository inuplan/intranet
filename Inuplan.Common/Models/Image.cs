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

    /// <summary>
    /// An image that contains 3 different sizes.
    /// A thumbnail by 150px by 150px, half-size and the original image.
    /// </summary>
    public class Image
    {
        /// <summary>
        /// Gets or sets the metadata for the file.
        /// </summary>
        public FileInfo MetaData { get; set; }

        /// <summary>
        /// Gets or sets the file for the thumbnail.
        /// </summary>
        public FileData Thumbnail { get; set; }

        /// <summary>
        /// Gets or sets the file for the medium sized image.
        /// </summary>
        public FileData Medium { get; set; }

        /// <summary>
        /// Gets or sets the file for the original image
        /// </summary>
        public FileData Original { get; set; }
    }
}
