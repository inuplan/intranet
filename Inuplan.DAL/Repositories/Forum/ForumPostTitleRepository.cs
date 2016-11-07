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

namespace Inuplan.DAL.Repositories.Forum
{
    using Common.Models.Forum;
    using Common.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.Models;
    using Optional;
    using Dapper;
    using System.Diagnostics;
    using Common.Tools;
    using Common.Logger;
    using Common.Factories;

    public class ForumPostTitleRepository : IScalarRepository<int, ThreadPostTitle>
    {
        private bool disposedValue = false;
        private readonly ILogger<ForumPostTitleRepository> logger;
        private readonly IConnectionFactory connectionFactory;

        public ForumPostTitleRepository(
            IConnectionFactory connectionFactory,
            ILogger<ForumPostTitleRepository> logger
        )
        {
            this.connectionFactory = connectionFactory;
            this.logger = logger;
        }

        public async Task<Option<ThreadPostTitle>> Create(ThreadPostTitle entity, Func<ThreadPostTitle, Task<bool>> onCreate, params object[] identifiers)
        {
            try
            {
                Debug.Assert(entity.Author != null && entity.Author.ID > 0, "Must have a valid user assigned");
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sql = @"INSERT INTO ThreadTitles
                            (CreatedOn, Published, Author, Deleted, Title, Sticky, LatestComment)
                            VALUES (@CreatedOn, @IsPublished, @AuthorID, @Deleted, @Title, @Sticky, @LatestComment);
                            SELECT ID FROM ThreadTitles WHERE ID = @@IDENTITY;";

                    var id = await connection.ExecuteScalarAsync<int>(sql, new
                    {
                        CreatedOn = entity.CreatedOn,
                        IsPublished = entity.IsPublished,
                        AuthorID = entity.Author.ID,
                        Deleted = entity.Deleted,
                        Title = entity.Title,
                        Sticky = entity.Sticky,
                        LatestComment = entity.LatestComment
                    }, transaction);

                    entity.ThreadID = id;
                    var success = id > 0;
                    var continuation = await onCreate(entity);

                    if (success && continuation)
                    {
                        logger.Trace("Created forum post title");
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not create forum post title");
                        transaction.Rollback();
                    }

                    logger.End();
                    return entity.SomeWhen(e => success);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<bool> Delete(int key, Func<int, Task> onDelete)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    // Check that there are no comments for this thread! (only checking top-level comments)
                    var sqlCheck = @"select COUNT(*) from ThreadComments where ThreadID = @key";
                    var commentCount = await connection.ExecuteScalarAsync<int>(sqlCheck, new { key }, transaction);

                    // Delete the thread
                    var sql = @"DELETE FROM ThreadTitles WHERE ID = @key";
                    var rows = await connection.ExecuteAsync(sql, new { key }, transaction);

                    var deleted = (rows == 1) && commentCount == 0;

                    if (deleted)
                    {
                        await onDelete(key);
                        logger.Trace("Deleted forum post title");
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not delete forum post title");
                        transaction.Rollback();
                    }

                    logger.End();
                    return deleted;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<Option<ThreadPostTitle>> Get(int key)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sql = @"SELECT
                                t.ID AS ThreadID, t.CreatedOn, t.Published AS IsPublished,                 /* ThreadPostTitle */
                                t.Author AS AuthorID, t.Deleted, t.Modified AS IsModified,
                                t.Title, t.LastModified, t.Sticky, t.LatestComment,
                                u.ID, u.FirstName, u.LastName, u.Username, u.Email,         /* Author */
                                u.DisplayName
                            FROM ThreadTitles t
                            LEFT JOIN Users u
                            ON t.Author = u.ID
                            WHERE t.ID = @key";

                    var query = await connection.QueryAsync<ThreadPostTitle, User, ThreadPostTitle>(sql, (e, u) =>
                    {
                        e.Author = u;
                        return e;
                    }, new { key }, transaction);

                    var result = query.Single(e => e.ThreadID == key).SomeWhen(e => e.ThreadID > 0);

                    // Remember to add the viewed result
                    var usersSql = @"SELECT
                                u.ID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName   /* Author */
                                FROM Users u
                                INNER JOIN ThreadUserViews v
                                ON u.ID = v.UserID
                                WHERE v.ThreadID = @key";
                    var viewQuery = await connection.QueryAsync<User>(usersSql, new { key }, transaction);
                    result.Map(e =>
                    {
                        e.ViewedBy = viewQuery.ToList();
                        return e;
                    });

                    if (result.HasValue)
                    {
                        transaction.Commit();
                    }
                    else
                    {
                        transaction.Rollback();
                    }

                    logger.End();
                    return result;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<List<ThreadPostTitle>> GetAll(params object[] identifiers)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    var sqlTitles = @"SELECT
                                        t.ID, t.CreatedOn, t.Published AS IsPublished, t.Author AS AuthorID, t.Deleted, t.Modified AS IsModified, t.Title, t.LastModified, t.Sticky, t.LatestComment, /* ThreadPostTitle */
                                        u.ID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName                                                   /* Author */
                                    FROM ThreadTitles t
                                    LEFT JOIN Users u
                                    ON t.Author = u.ID";
                    var titles = await connection.QueryAsync<ThreadPostTitle, User, ThreadPostTitle>(sqlTitles, (t, u) =>
                    {
                        t.Author = u;
                        return t;
                    });

                    var sqlUserViews = @"SELECT
                                        u.ID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName,   /* Author */
                                        v.ThreadID
                                    FROM Users u
                                    INNER JOIN ThreadUserViews v
                                    ON u.ID = v.UserID";
                    var viewCollection = await connection.QueryAsync<User, int, Tuple<User, int>>(sqlUserViews, (u, id) =>
                    {
                        return new Tuple<User, int>(u, id);
                    });

                    var groups = viewCollection.GroupBy(g => g.Item2);
                    foreach (var group in groups)
                    {
                        var title = titles.Single(t => t.ThreadID == group.Key);
                        title.ViewedBy = group.Select(g => g.Item1).ToList();
                    }

                    logger.End();
                    return titles.ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<Option<ThreadPostTitle>> GetByID(int id)
        {
            return await Get(id);
        }

        public async Task<Pagination<ThreadPostTitle>> GetPage(int skip, int take, Func<string> sortBy = null, Func<string> orderBy = null, params object[] identifiers)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    sortBy = sortBy ?? new Func<string>(() => "CreatedOn");
                    orderBy = orderBy ?? new Func<string>(() => "ASC");

                    var sql = @"SELECT
                                    ID AS ThreadID, CreatedOn, Published AS IsPublished, Deleted,IsModified, Title, LastModified, Sticky, LatestComment,
                                    UserID AS ID, FirstName,  LastName,  Username,  Email,  DisplayName
                                FROM
                                (
                                    SELECT
                                        t.ID, CreatedOn, Published, Author AS AuthorID, Deleted, Modified AS IsModified, Title, LastModified, Sticky, LatestComment,
                                        u.ID AS UserID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName,
                                        ROW_NUMBER() OVER (ORDER BY Sticky DESC, @Sort @Order, LatestComment DESC) AS 'RowNumber'
                                    FROM ThreadTitles t
                                    
                                    LEFT JOIN Users u
                                    ON t.Author = u.ID

                                    WHERE t.Published = 1 AND t.Deleted <> 1
                                    ) AS seq
                                WHERE seq.RowNumber BETWEEN @From AND @To";

                    var query = sql.Replace("@Sort", sortBy())
                                   .Replace("@Order", orderBy());

                    var titleQuery = await connection.QueryAsync<ThreadPostTitle, User, ThreadPostTitle>(query, (t, u) =>
                    {
                        t.Author = u;
                        return t;
                    }, new
                    {
                        From = skip + 1,
                        To = skip + take
                    });

                    var sqlUserViews = @"SELECT
                                    u.ID, FirstName,  LastName,  Username,  Email,  DisplayName,
                                    t.ThreadID
                                 FROM ThreadUserViews t
                                 INNER JOIN Users u
                                 ON t.UserID = u.ID
                                 WHERE t.ThreadID = @ThreadID";

                    foreach (var ThreadID in titleQuery.Select(t => t.ThreadID))
                    {
                        var usersView = await connection.QueryAsync<User>(sqlUserViews, new
                        {
                            ThreadID
                        });

                        var title = titleQuery.Single(t => t.ThreadID == ThreadID);
                        title.ViewedBy = usersView.ToList();
                    }

                    var countSql = @"SELECT COUNT(*) FROM ThreadTitles WHERE ThreadTitles.Published = 1";
                    var total = await connection.ExecuteScalarAsync<int>(countSql);

                    logger.End();
                    return Helpers.Paginate(skip, take, total, titleQuery.ToList());
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<bool> Update(int key, ThreadPostTitle entity)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sql = @"UPDATE ThreadTitles SET
                                CreatedOn = @CreatedOn,
                                Published = @IsPublished,
                                Deleted = @Deleted,
                                Modified = @IsModified,
                                Title = @Title,
                                LastModified = @LastModified,
                                LatestComment = @LatestComment,
                                Sticky = @Sticky
                           WHERE ID = @ID";

                    var update = await connection.ExecuteAsync(sql, new
                    {
                        CreatedOn = entity.CreatedOn,
                        IsPublished = entity.IsPublished,
                        Deleted = entity.Deleted,
                        IsModified = true,
                        Title = entity.Title,
                        LastModified = DateTime.Now,
                        LatestComment = entity.LatestComment,
                        Sticky = entity.Sticky,
                        ID = key,
                    }, transaction);

                    var success = update == 1;
                    if (success)
                    {
                        logger.Trace("Updated thread post title");
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not update thread post title");
                        transaction.Rollback();
                    }

                    logger.End();
                    return success;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed resources
                }

                disposedValue = true;
            }
        }
    }
}
