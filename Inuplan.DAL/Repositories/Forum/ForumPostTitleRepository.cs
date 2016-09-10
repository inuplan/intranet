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
    using System.Text;
    using System.Threading.Tasks;
    using Common.Models;
    using Optional;
    using System.Data;
    using Dapper;
    using System.Transactions;
    using System.Diagnostics;
    using Common.Tools;

    public class ForumPostTitleRepository : IScalarRepository<int, ThreadPostTitle>
    {
        private readonly IDbConnection connection;

        private bool disposedValue = false;

        public ForumPostTitleRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public async Task<Option<ThreadPostTitle>> Create(ThreadPostTitle entity, Func<ThreadPostTitle, Task> onCreate, params object[] identifiers)
        {
            Debug.Assert(entity.Author != null && entity.Author.ID > 0, "Must have a valid user assigned");
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var sql = @"INSERT INTO ThreadTitles
                            (CreatedOn, Published, Author, Deleted, Title)
                            VALUES (@CreatedOn, @IsPublished, @AuthorID, @Deleted, @Title);
                            SELECT ID FROM ThreadTitles WHERE ID = @@IDENTITY;";

                var createdOn = DateTime.Now;
                var id = await connection.ExecuteScalarAsync<int>(sql, new
                {
                    CreatedOn = createdOn,
                    entity.IsPublished,
                    AuthorID = entity.Author.ID,
                    entity.Deleted,
                    entity.Title
                });

                entity.ThreadID = id;

                if(id > 0)
                {
                    transactionScope.Complete();
                    await onCreate(entity);
                }

                return entity.SomeWhen(e => e.ThreadID > 0);
            }
        }

        public async Task<bool> Delete(int key, Func<int, Task> onDelete)
        {
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                // Check that there are no comments for this thread! (only checking top-level comments)
                var sqlCheck = @"select COUNT(*) from ThreadComments where ThreadID = @key";
                var commentCount = await connection.ExecuteScalarAsync<int>(sqlCheck, new { key });

                // Delete the thread
                var sql = @"DELETE FROM ThreadTitles WHERE ID = @key";
                var rows = await connection.ExecuteAsync(sql, new { key });

                var deleted = (rows == 1) && commentCount == 0;

                if(deleted)
                {
                    await onDelete(key);
                    transactionScope.Complete();
                }

                return deleted;
            }
        }

        public async Task<Option<ThreadPostTitle>> Get(int key)
        {
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var sql = @"SELECT
                                t.ID, t.CreatedOn, t.Published, t.Author AS AuthorID, t.Deleted, t.Modified AS IsModified, t.Title, t.LastModified, /* ThreadPostTitle */
                                u.ID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName                                                   /* Author */
                            FROM ThreadTitles t
                            LEFT JOIN Users u
                            ON t.Author = u.ID
                            WHERE t.ID = @key";

                var query = await connection.QueryAsync<ThreadPostTitle, User, ThreadPostTitle>(sql, (e, u) =>
                {
                    e.Author = u;
                    return e;
                }, new { key });

                var result = query.Single(e => e.ThreadID == key).SomeWhen(e => e.ThreadID > 0);

                // Remember to add the viewed result
                var usersSql = @"SELECT
                                u.ID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName   /* Author */
                                FROM Users u
                                INNER JOIN ThreadUserViews v
                                ON u.ID = v.UserID
                                WHERE v.ThreadID = @key";
                var viewQuery = await connection.QueryAsync<User>(usersSql, new { key });
                result.Map(e =>
                {
                    e.ViewedBy = viewQuery.ToList();
                    return e;
                });

                if(result.HasValue)
                {
                    transactionScope.Complete();
                }

                return result;
            }
        }

        public async Task<List<ThreadPostTitle>> GetAll(params object[] identifiers)
        {
            var sqlTitles = @"SELECT
                                t.ID, t.CreatedOn, t.Published, t.Author AS AuthorID, t.Deleted, t.Modified AS IsModified, t.Title, t.LastModified, /* ThreadPostTitle */
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

            return titles.ToList();
        }

        public async Task<Option<ThreadPostTitle>> GetByID(int id)
        {
            return await Get(id);
        }

        public async Task<Pagination<ThreadPostTitle>> GetPage(int skip, int take, Func<string> sortBy = null, Func<string> orderBy = null, params object[] identifiers)
        {
            sortBy = sortBy ?? new Func<string>(() => "CreatedOn");
            orderBy = orderBy ?? new Func<string>(() => "ASC");

            var sql = @"SELECT
                            ID, CreatedOn, Published, Deleted,IsModified, Title, LastModified,
                            UserID AS ID, FirstName,  LastName,  Username,  Email,  DisplayName
                        FROM
                        (
                            SELECT
                                t.ID, CreatedOn, Published, Author AS AuthorID, Deleted, Modified AS IsModified, Title, LastModified,
                                u.ID AS UserID, u.FirstName, u.LastName, u.Username, u.Email, u.DisplayName,
                                ROW_NUMBER() OVER (ORDER BY @Sort @Order) AS 'RowNumber'
                            FROM ThreadTitles t
                            
                            LEFT JOIN Users u
                            ON t.Author = u.ID
                            ) AS seq
                        WHERE seq.RowNumber BETWEEN @From AND @To";

            var query = sql
                        .Replace("@Sort", sortBy())
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

            var countSql = @"SELECT COUNT(*) FROM ThreadTitles";
            var total = await connection.ExecuteScalarAsync<int>(countSql);

            return Helpers.Paginate(skip, take, total, titleQuery.ToList());
        }

        public async Task<bool> Update(int key, ThreadPostTitle entity)
        {
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var sql = @"UPDATE ThreadTitles SET
                                CreatedOn = @CreatedOn AND
                                Published = @IsPublished AND
                                Deleted = @Deleted AND
                                Modified = @IsModified AND
                                Title = @Title AND
                                LastModified = @LastModified
                           WHERE ID = @ID";

                var update = await connection.ExecuteAsync(sql, new
                {
                    entity.CreatedOn,
                    entity.IsPublished,
                    entity.Deleted,
                    entity.IsModified,
                    entity.Title,
                    entity.LastModified
                });

                if(update == 1)
                {
                    transactionScope.Complete();
                }

                return update == 1;
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
                    connection.Close();
                    connection.Dispose();
                }

                disposedValue = true;
            }
        }
    }
}
