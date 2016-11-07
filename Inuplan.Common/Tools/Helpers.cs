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

namespace Inuplan.Common.Tools
{
    using Models;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;

    public static class Helpers
    {
        public static byte[] GetBytes(string str)
        {
            var bytes = new byte[str.Length * sizeof(char)];
            Buffer.BlockCopy(str.ToCharArray(), 0, bytes, 0, bytes.Length);
            return bytes;
        }

        /// <summary>
        /// Convert an array of bytes to a string of hex digits.
        /// Source: https://gist.github.com/kristopherjohnson/3021045
        /// </summary>
        /// <param name="bytes">array of bytes</param>
        /// <returns>String of hex digits</returns>
        public static string HexStringFromBytes(byte[] bytes)
        {
            var sb = new StringBuilder();
            foreach (byte b in bytes)
            {
                var hex = b.ToString("x2");
                sb.Append(hex);
            }
            return sb.ToString();
        }

        /// <summary>
        /// Extracts the filename and extension from a full filename.
        /// </summary>
        /// <param name="fullname">The full filename</param>
        /// <returns>A tuple, where the first item is the filename and the second item is the extension</returns>
        public static Tuple<string, string> GetFilename(string fullname)
        {
            int lastIndex = fullname.LastIndexOf('.');
            var filename = fullname.Substring(0, lastIndex);
            var extension = fullname.Substring(lastIndex + 1);
            return new Tuple<string, string>(filename, extension);
        }

        public static Pagination<T> Paginate<T>(int skip, int take, int total, List<T> currentItems)
        {
            var totalPages = (int)Math.Ceiling(total / (double)take);
            var currentPage = (skip / take) + 1;

            return new Pagination<T>
            {
                CurrentItems = currentItems,
                CurrentPage = currentPage,
                TotalPages = totalPages
            };
        }

        /// <summary>
        /// Helper function that constructs the comment chain.
        /// </summary>
        /// <param name="allComments">The comments</param>
        /// <returns>A list of top-level comments with their child replies</returns>
        public static List<Comment> ConstructReplies(IEnumerable<Comment> allComments)
        {
            // Create the child hierarchy
            var groups = allComments.GroupBy(c => c.ParentID);
            foreach (var replies in groups)
            {
                if (replies.Key == null) continue;
                var parent = allComments.Single(c => c.ID == replies.Key);
                parent.Replies = replies.ToList();
            }

            // Select only top-level comments (since the children are included in the replies)
            return allComments.Where(c => c.ParentID == null).ToList();
        }

        public static string GetUserImageFolder(string root, string username)
        {
            var sb = GetUserImageFolderBuilder(root, username);
            return sb.ToString();
        }

        public static StringBuilder GetUserImageFolderBuilder(string root, string username)
        {
            var sb = new StringBuilder();
            sb.AppendFormat("{0}\\{1}\\images\\", root, username);
            return sb;
        }

        public static long GetDirectorySizeKb(string folderPath)
        {
            DirectoryInfo di = new DirectoryInfo(folderPath);
            return di.EnumerateFiles("*", SearchOption.AllDirectories).Sum(fi => fi.Length) / 1024;
        }
    }
}
