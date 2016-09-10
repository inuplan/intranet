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
    using DTOs;
    using DTOs.Forum;
    using Models;
    using Models.Forum;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public static class Converters
    {
        public static ImageCommentDTO ToImageCommentDTO(ImageComment comment)
        {
            var replies = comment.Replies ?? new List<ImageComment>();
            var replyDtos = replies.Select(ToImageCommentDTO).ToList();
            var author = (comment.Deleted) ? null : ToUserDTO(comment.Author);

            return new ImageCommentDTO
            {
                ID = comment.ID,
                ImageID = comment.ImageID,
                Author = author,
                Deleted = comment.Deleted,
                PostedOn = comment.PostedOn,
                Replies = replyDtos,
                Text = comment.Text,
                Edited = comment.Edited
            };
        }

        public static WhatsNewImageCommentDTO ToWhatsNewComment(ImageComment comment, User uploadedBy)
        {
            var author = (comment.Deleted) ? null : ToUserDTO(comment.Author);
            var uploader = ToUserDTO(uploadedBy);
            return new WhatsNewImageCommentDTO
            {
                Author = author,
                Deleted = comment.Deleted,
                ID = comment.ID,
                ImageID = comment.ImageID,
                ImageUploadedBy = uploader,
                Text = comment.Text
            };
        }

        public static UserImageDTO ToUserImageDTO(Image image, int commentCount, string originalUrl, string previewUrl, string thumbnailUrl)
        {
            var author = ToUserDTO(image.Owner);
            return new UserImageDTO
            {
                Extension = image.Extension,
                Filename = image.Filename,
                ImageID = image.ID,
                OriginalUrl = originalUrl,
                PreviewUrl = previewUrl,
                ThumbnailUrl = thumbnailUrl,
                Author = author,
                CommentCount = commentCount,
                Uploaded = image.Uploaded,
            };
        }

        public static UserDTO ToUserDTO(User user)
        {
            var roles = user.Roles ?? new List<Role>();
            var result = new UserDTO
            {
                ID = user.ID,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DisplayName = user.DisplayName,
                Email = user.Email,
                IsAdmin = roles.Exists(r => r.Name.Equals("Admin", StringComparison.OrdinalIgnoreCase)),
                Roles = user.Roles,
                ProfileImage = "NA"
            };

            return result;
        }

        public static ThreadPostTitleDTO ToThreadPostTitleDTO(ThreadPostTitle threadTitle, int commentCount)
        {
            var author = ToUserDTO(threadTitle.Author);
            var viewedBy = threadTitle.ViewedBy.Select(ToUserDTO).ToList();
            return new ThreadPostTitleDTO
            {
                Author = author,
                CommentCount = commentCount,
                Deleted = threadTitle.Deleted,
                ID = threadTitle.ID,
                IsModified = threadTitle.IsModified,
                IsPublished = threadTitle.IsPublished,
                LastModified = threadTitle.LastModified,
                CreatedOn = threadTitle.CreatedOn,
                Title = threadTitle.Title,
                ViewedBy = viewedBy
            };
        }

        public static ThreadPostContentDTO ToThreadPostContentDTO(ThreadPostContent threadContent, int commentCount)
        {
            var title = ToThreadPostTitleDTO(threadContent.Title, commentCount);
            return new ThreadPostContentDTO
            {
                Text = threadContent.Text,
                ThreadID = threadContent.ThreadID,
                Title = title
            };
        }

        public static ThreadPostCommentDTO ToThreadPostCommentDTO(ThreadPostComment threadComment)
        {
            var author = ToUserDTO(threadComment.Author);
            var replies = threadComment.Replies.Select(ToThreadPostCommentDTO).ToList();
            return new ThreadPostCommentDTO
            {
                Author = author,
                Deleted = threadComment.Deleted,
                Edited = threadComment.Edited,
                ID = threadComment.ID,
                ParentID = threadComment.ParentID,
                PostedOn = threadComment.PostedOn,
                Replies = replies,
                Text = threadComment.Text,
                ThreadID = threadComment.ThreadID
            };
        }
    }
}
