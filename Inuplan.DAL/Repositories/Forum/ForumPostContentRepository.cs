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
    using Common.Factories;
    using Common.Logger;
    using Common.Models;
    using Common.Models.Forum;
    using Common.Repositories;
    using Common.Tools;
    using Dapper;
    using Optional;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;

    public class ForumPostContentRepository : IScalarRepository<int, ThreadPostContent>
    {
        private readonly ILogger<ForumPostContentRepository> logger;

        private bool disposedValue;
        private readonly IConnectionFactory connectionFactory;

        public ForumPostContentRepository(
            IConnectionFactory connectionFactory,
            ILogger<ForumPostContentRepository> logger
        )
        {
            this.connectionFactory = connectionFactory;
            this.logger = logger;
        }

        public async Task<Option<ThreadPostContent>> Create(ThreadPostContent entity, Func<ThreadPostContent, Task<bool>> onCreate, params object[] identifiers)
        {
            try
            {
                Debug.Assert(entity.Header.ThreadID > 0, "Must have a valid thread ID given");
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sql = @"INSERT INTO ThreadContents (ID, Text) VALUES (@ID, @Text)";
                    var rows = await connection.ExecuteAsync(sql, new
                    {
                        ID = entity.Header.ThreadID,
                        Text = entity.Text
                    }, transaction);

                    var created = rows == 1;
                    var continuation = await onCreate(entity);
                    if (created && continuation)
                    {
                        entity.ThreadID = entity.Header.ThreadID;
                        logger.Trace("Thread post created");
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not create thread post");
                        transaction.Rollback();
                    }

                    logger.End();
                    return entity.SomeWhen(e => e.ThreadID > 0);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public Task<bool> Delete(int key, Func<int, Task> onDelete)
        {
            // DB: Cascade delete from Titles -> Content
            logger.Error("Method not supported");
            throw new NotSupportedException("Delete the Title first and the changes will cascade to the Content");
        }

        public async Task<Option<ThreadPostContent>> Get(int key)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    var sql = @"SELECT
                                t.ID AS ThreadID, t.CreatedOn, t.Published AS IsPublished, t.Author AS AuthorID, Sticky,
                                t.Deleted, t.Modified AS IsModified, t.Title, t.LastModified,       /* ThreadPostTitle */
                                c.ID AS ThreadID, c.Text,                                           /* ThreadPostContent */
                                u.ID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName   /* Author */
                            FROM ThreadTitles t
                            INNER JOIN ThreadContents c
                            ON c.ID = t.ID
                            LEFT JOIN Users u
                            ON t.Author = u.ID
                            WHERE t.ID = @key";

                    var query = await connection.QueryAsync<ThreadPostTitle, ThreadPostContent, User, ThreadPostContent>(sql, (e, c, u) =>
                    {
                        e.Author = u;
                        c.Header = e;
                        return c;
                    }, new { key }, splitOn: "ThreadID,ID");

                    var result = query.Single(e => e.ThreadID == key)
                                      .SomeWhen(e => e.ThreadID > 0);

                    // Remember to add the viewed result
                    var usersSql = @"SELECT
                                u.ID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName   /* Author */
                                FROM Users u
                                INNER JOIN ThreadUserViews v
                                ON u.ID = v.UserID
                                WHERE v.ThreadID = @key";

                    var viewQuery = await connection.QueryAsync<User>(usersSql, new { key });
                    result.Map(c =>
                    {
                        c.Header.ViewedBy = viewQuery.ToList();
                        return c;
                    });

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

        public async Task<List<ThreadPostContent>> GetAll(params object[] identifiers)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    var sql = @"SELECT
                                t.ID AS ThreadID, t.CreatedOn, t.Published, t.Author AS AuthorID, t.Deleted, t.Modified AS IsModified, t.Title, t.LastModified, /* ThreadPostTitle */
                                c.ID AS ThreadID, c.Text,                                                                                                       /* ThreadPostContent */
                                u.ID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName                                                   /* Author */
                            FROM ThreadTitles t
                            INNER JOIN ThreadContents c
                            ON c.ID = t.ID
                            LEFT JOIN Users u
                            ON t.Author = u.ID";

                    var query = await connection.QueryAsync<ThreadPostTitle, ThreadPostContent, User, ThreadPostContent>(sql, (t, c, u) =>
                    {
                        c.Header = t;
                        t.Author = u;
                        return c;
                    }, splitOn: "ThreadID,ID");

                    var result = query.ToList();

                    // Remember to add the viewed result
                    var usersSql = @"SELECT
                                u.ID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName   /* Author */
                                FROM Users u
                                INNER JOIN ThreadUserViews v
                                ON u.ID = v.UserID
                                WHERE v.ThreadID = @key";

                    foreach (var content in result)
                    {
                        var users = await connection.QueryAsync<User>(usersSql, new { key = content.ThreadID });
                        content.Header.ViewedBy = users.ToList();
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

        public async Task<Option<ThreadPostContent>> GetByID(int id)
        {
            logger.Begin();
            var result = await Get(id);

            logger.End();
            return result;
        }

        public async Task<Pagination<ThreadPostContent>> GetPage(int skip, int take, Func<string> sortBy, Func<string> orderBy, params object[] identifiers)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    sortBy = sortBy ?? new Func<string>(() => "CreatedOn");
                    orderBy = orderBy ?? new Func<string>(() => "ASC");

                    var sql = @"SELECT
                            ID AS ThreadID, CreatedOn, Published, Deleted,IsModified, Title, LastModified,
                            ContentID AS ThreadID, Text,
                            UserID AS ID, FirstName,  LastName,  Username,  Email,  DisplayName
                        FROM
                        (
                            SELECT
                                t.ID, CreatedOn, Published, Author AS AuthorID, Deleted, Modified AS IsModified, Title, LastModified,
                                c.ID AS ContentID, c.Text,
                                u.ID AS UserID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName,
                                ROW_NUMBER() OVER (ORDER BY @Sort @Order) AS 'RowNumber'
                            FROM ThreadTitles t
                            INNER JOIN ThreadContents c
                            ON t.ID = c.ID
                            
                            LEFT JOIN Users u
                            ON t.Author = u.ID
                            ) AS seq
                        WHERE seq.RowNumber BETWEEN @From AND @To";

                    var query = sql
                                .Replace("@Sort", sortBy())
                                .Replace("@Order", orderBy());

                    var titleQuery = await connection.QueryAsync<ThreadPostTitle, ThreadPostContent, User, ThreadPostContent>(query, (t, c, u) =>
                    {
                        t.Author = u;
                        c.Header = t;
                        return c;
                    }, new
                    {
                        From = skip + 1,
                        To = skip + take
                    }, splitOn: "ThreadID,ID");

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

                        var content = titleQuery.Single(t => t.ThreadID == ThreadID);
                        content.Header.ViewedBy = usersView.ToList();
                    }

                    var countSql = @"SELECT COUNT(*) FROM ThreadTitles";
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

        public async Task<bool> Update(int key, ThreadPostContent entity)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sql = @"UPDATE ThreadContents SET
                            Text = @Text
                           WHERE ID = @ID";

                    var update = await connection.ExecuteAsync(sql, new
                    {
                        entity.Text,
                        ID = entity.ThreadID
                    }, transaction);

                    var modifySql = @"UPDATE ThreadTitles SET
                                    Modified = @Modified,
                                    LastModified = @LastModified
                                  WHERE ID = @ID";
                    var modify = await connection.ExecuteAsync(modifySql, new
                    {
                        Modified = true,
                        LastModified = DateTime.Now,
                        ID = key
                    }, transaction);

                    var updated = update == 1 && modify == 1;

                    if (updated)
                    {
                        logger.Trace("Thread post content updated");
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not update thread post content");
                        transaction.Rollback();
                    }

                    logger.End();
                    return updated;
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
