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

namespace Inuplan.DAL.WhatsNew.Queries
{
    using Common.Enums;
    using Common.Models;
    using Common.Queries;
    using Common.Repositories;
    using Common.Tools;
    using Dapper;
    using Optional;
    using Optional.Unsafe;
    using System;
    using System.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using Autofac.Features.Indexed;
    using Common.Models.Forum;
    using System.Collections.Generic;

    /// <summary>
    /// Implements a query for the latest news
    /// </summary>
    public class GetPage : IGetPage
    {
        private readonly IDbConnection connection;
        private readonly IVectorRepository<int, Comment> commentRepo;
        private readonly IVectorRepository<int, Comment> forumCommentRepo;
        private readonly IScalarRepository<int, Image> imageRepo;
        private readonly IScalarRepository<int, ThreadPostContent> threadRepo;

        public GetPage(
            IDbConnection connection,
            IVectorRepository<int, Comment> commentRepo,
            IScalarRepository<int, Image> imageRepo,
            IIndex<ServiceKeys, IScalarRepository<int, ThreadPostContent>> threadRepoIndex,
            IIndex<ServiceKeys, IVectorRepository<int, Comment>> forumCommentRepoIndex
        )
        {
            this.connection = connection;
            this.commentRepo = commentRepo;
            this.imageRepo = imageRepo;
            threadRepo = threadRepoIndex[ServiceKeys.ThreadPostContentRepository];
            forumCommentRepo = forumCommentRepoIndex[ServiceKeys.ForumCommentsRepository];
        }

        public async Task<Pagination<NewsItem>> Page(NewsType filter, int skip, int take, Func<Image, string, string> getUrl)
        {
            var sql = @"SELECT * FROM
                            (SELECT *
                            FROM WhatsNew
                            WHERE %) seq
                        ORDER BY TimeOn DESC
                        OFFSET @skip ROWS
                        FETCH NEXT @take ROWS ONLY";

            var where = new List<string>();
            if(filter.HasFlag(NewsType.ImageUpload))
            {
                where.Add("EVENT = 1");
            }
            if(filter.HasFlag(NewsType.ImageComment))
            {
                where.Add("EVENT = 2");
            }
            if(filter.HasFlag(NewsType.ThreadPost))
            {
                where.Add("EVENT = 4");
            }

            if(filter == NewsType.Nothing)
            {
                return null;
            }

            var condition = where.Aggregate((res, next) => res + " OR " + next);
            sql = sql.Replace("%", condition);

            var result = await connection.QueryAsync(sql, new
            {
                skip,
                take
            });

            var items = result
                .Select(row =>
            {
                int id = row.ID;
                int targetId = row.TargetID;
                DateTime on = row.TimeOn;
                NewsType type = (NewsType)row.Event;

                switch (type)
                {
                    case NewsType.ImageUpload:
                        return FetchImage(id, on, targetId, getUrl);
                    case NewsType.ImageComment:
                        return FetchComment(id, on, targetId);
                    case NewsType.ThreadPost:
                        return FetchThreadPost(id, on, targetId);
                }

                throw new IndexOutOfRangeException("Type enum out of bounds");
            })
            .Where(n => n.HasValue)
            .Select(n => n.ValueOrFailure());

            var count = await connection.ExecuteScalarAsync<int>(@"SELECT COUNT(*) FROM WhatsNew");

            var page = Helpers.Paginate(skip, take, count, items.ToList());
            return page;
        }

        private Option<NewsItem> FetchImage(int id, DateTime on, int imageId, Func<Image, string, string> getUrl)
        {
            var image = imageRepo.Get(imageId).Result;
            return image.Map(img =>
            {
                var originalUrl = getUrl(img, "Get");
                var previewUrl = getUrl(img, "GetPreview");
                var thumbnailurl = getUrl(img, "GetThumbnail");
                var count = commentRepo.Count(imageId).Result;
                var dto = Converters.ToUserImageDTO(img, count, originalUrl, previewUrl, thumbnailurl);

                return new NewsItem
                {
                    ID = id,
                    Type = NewsType.ImageUpload,
                    On = on,
                    Item = dto
                };
            });
        }

        private Option<NewsItem> FetchComment(int id, DateTime on, int commentId)
        {
            var comment = commentRepo.GetSingleByID(commentId).Result;
            return comment.Map(c =>
            {
                var image = imageRepo.Get(c.ContextID).Result.ValueOrFailure();
                var uploader = image.Owner;
                var filename = image.Filename + "." + image.Extension;
                var dto = Converters.ToWhatsNewComment(c, uploader, filename);

                return new NewsItem
                {
                    ID = id,
                    Type = NewsType.ImageComment,
                    On = on,
                    Item = dto
                };
            });
        }

        private Option<NewsItem> FetchThreadPost(int id, DateTime on, int threadId)
        {
            var post = threadRepo.Get(threadId).Result;
            return post.Map(p =>
            {
                Comment latest = null;
                if(p.Header.LatestComment.HasValue)
                {
                    latest = forumCommentRepo.GetSingleByID(p.Header.LatestComment.Value).Result.ValueOr(alternative: null);
                }

                var count = forumCommentRepo.Count(p.ThreadID).Result;
                var dto = Converters.ToThreadPostContentDTO(p, latest, count);

                return new NewsItem
                {
                    ID = id,
                    Item = dto,
                    On = on,
                    Type = NewsType.ThreadPost
                };
            });
        }
    }

}