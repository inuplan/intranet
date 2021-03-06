﻿// Copyright © 2015 Inuplan
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

    /// <summary>
    /// Enumeration of keys, which identifies where to retrieve user information from.
    /// </summary>
    public enum ServiceKeys
    {
        /// <summary>
        /// Key for retrieving users from the active directory database
        /// </summary>
        UserActiveDirectory,

        /// <summary>
        /// Key for retrieving users from the SQL database
        /// </summary>
        UserDatabase,

        /// <summary>
        /// Key for retrieving a users roles
        /// </summary>
        UserRoleRepository,

        /// <summary>
        /// Key for retrieving posts from management in the SQL database
        /// </summary>
        ManagementPosts,

        /// <summary>
        /// Key for retrieving general posts from users in the SQL database
        /// </summary>
        GeneralPosts,

        /// <summary>
        /// Key for the user image repository
        /// </summary>
        UserImageRepository,

        /// <summary>
        /// Key for the web api root folder
        /// </summary>
        RootPath,

        /// <summary>
        /// Key for the remote base address URI
        /// </summary>
        RemoteBaseAddress,

        /// <summary>
        /// Key for the ImageCommentsRepository
        /// </summary>
        ImageCommentsRepository,

        /// <summary>
        /// Key for the ThreadPostTitleRepository
        /// </summary>
        ThreadPostTitleRepository,

        /// <summary>
        /// Key for the ThreadPostContentRepository
        /// </summary>
        ThreadPostContentRepository,

        /// <summary>
        /// Key for the ForumCommentsRepository
        /// </summary>
        ForumCommentsRepository,

        /// <summary>
        /// Key for the latest websocket hub handler
        /// </summary>
        LatestHub,
    }
}
