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

namespace Inuplan.WebAPI.Image.Factories
{
    using Autofac.Extras.Attributed;
    using Common.Enums;
    using Common.Factories;
    using Common.Interfaces;

    /// <summary>
    /// Concrete handle factory implementation
    /// </summary>
    public class HandleFactory : ImageHandleFactory
    {
        /// <summary>
        /// Determines the filename length
        /// </summary>
        private readonly int filenameLength;

        /// <summary>
        /// Determines the scaling factor for the medium image
        /// </summary>
        private readonly double mediumScaleFactor;

        /// <summary>
        /// Determines the size of the profile image
        /// </summary>
        private readonly int profileSize;

        /// <summary>
        /// Determines the root path for the images
        /// </summary>
        private readonly string root;

        /// <summary>
        /// Determines the thumbnail width
        /// </summary>
        private readonly int thumbnailWidth;

        /// <summary>
        /// Initializes a new instance of the <see cref="HandleFactory"/> class.
        /// </summary>
        /// <param name="mediumScaleFactor">The medium scaling factor</param>
        /// <param name="thumbnailWidth">The thumbnail width</param>
        /// <param name="root">The root path directory</param>
        /// <param name="filenameLength">The filename length</param>
        /// <param name="profileSize">The size of the profile image in pixels</param>
        public HandleFactory([WithKey(ServiceKeys.RootPath)]string root,
            double mediumScaleFactor = 0.5d,
            int thumbnailWidth = 160,
            int filenameLength = 5,
            int profileSize = 64)
        {
            this.mediumScaleFactor = mediumScaleFactor;
            this.thumbnailWidth = thumbnailWidth;
            this.root = root;
            this.filenameLength = filenameLength;
            this.profileSize = profileSize;
        }

        /// <summary>
        /// Creates a new image handler
        /// </summary>
        /// <returns>A new image handler</returns>
        public override IImageHandler GetImageHandler()
        {
            return new Handle(mediumScaleFactor, thumbnailWidth, root, filenameLength, profileSize);
        }
    }
}
