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

namespace Inuplan.Common.Enums
{
    using System;

    /// <summary>
    /// An enumerable of news types
    /// </summary>
    [Flags]
    public enum NewsType : byte
    {
        /// <summary>
        /// The none (null) value
        /// </summary>
        Nothing = 0,

        /// <summary>
        /// Represents an upload has happened
        /// </summary>
        ImageUpload = 1,

        /// <summary>
        /// Represents a comment has happened
        /// </summary>
        ImageComment = 1 << 1,

        /// <summary>
        /// Represents that a forum thread post has happened
        /// </summary>
        ThreadPost = 1 << 2,
    }
}