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

namespace Inuplan.DAL.Repositories
{
    using Dapper;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Optional;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Transactions;

    /// <summary>
    /// A repository for a collection of comments for a single image.
    /// The key references <seealso cref="FileInfo.ID"/>.
    /// The value is a collection of comments.
    /// The singular entity is a <see cref="Post"/>.
    /// </summary>
    public class ImageCommentRepository : IVectorRepository<int, List<Post>, Post>
    {
        /// <summary>
        /// The database connection
        /// </summary>
        private readonly IDbConnection connection;

        /// <summary>
        /// Determines whether this resource has been disposed
        /// </summary>
        private bool disposedValue = false;

        /// <summary>
        /// Initializes a new instance of the <see cref="ImageCommentRepository"/> class.
        /// </summary>
        /// <param name="connection">The database connection</param>
        public ImageCommentRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        /// <summary>
        /// Creates a single entity and wires it up to the collective key.
        /// </summary>
        /// <param name="key">The collective key</param>
        /// <param name="entity">The entity</param>
        /// <returns>The created entity with the local key set</returns>
        public async Task<Option<Post>> CreateSingle(int key, Post entity)
        {
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                // Insert the comment
                var commentSql = @"INSERT INTO Posts(PostedOn, Comment, PostTypeID, UserID)
                                   VALUES(@PostedOn, @Comment, @MessageType, @UserID);
                                   SELECT ID FROM Posts WHERE ID = @@IDENTITY;";

                entity.ID = await connection.ExecuteScalarAsync<int>(commentSql, new
                {
                    entity.PostedOn,
                    entity.Comment,
                    entity.MessageType,
                    UserID = entity.Author.ID
                });

                // Connect the comment to the image
                var imagePostSql = @"INSERT INTO ImagePosts(FileInfoID, PostID)
                                    VALUES(@key, @PostID)";

                var rows = await connection.ExecuteAsync(imagePostSql, new
                {
                    key,
                    PostID = entity.ID
                });

                // Test for success
                var success = (rows == 1 && entity.ID > 0);

                if(success)
                {
                    // Commit and return result
                    transactionScope.Complete();
                    return entity.Some();
                }
            }

            // Return none (failed)
            return Option.None<Post>();
        }

        /// <summary>
        /// Deletes a collection of entities from the database, which has the given key.
        /// </summary>
        /// <param name="key">The key</param>
        /// <returns>True if deleted otherwise false</returns>
        public async Task<bool> Delete(int key)
        {
            using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var deleteSql = @"DELETE P
                    FROM Posts P INNER JOIN ImagePosts I
                    ON P.ID = I.PostID
                    WHERE I.FileInfoID = @key";
                var rows = await connection.ExecuteAsync(deleteSql, new { key });

                var success = (rows > 0);
                if(success)
                {
                    transactionScope.Complete();
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// Deletes a single entity, is the same as the scalar delete.
        /// </summary>
        /// <param name="entity">Deletes a single entity</param>
        /// <returns>True if deleted otherwise false</returns>
        public async Task<bool> DeleteSingle(Post entity)
        {
            using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var deleteSql = @"DELETE P
                    FROM Posts P
                    WHERE P.ID = @id";
                var rows = await connection.ExecuteAsync(deleteSql, new { id = entity.ID });

                var success = rows == 1;
                if(success)
                {
                    transactionScope.Complete();
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// Retrieves a list of entities with the given key.
        /// </summary>
        /// <param name="key">The key</param>
        /// <returns>A list of posts</returns>
        public async Task<List<Post>> Get(int key)
        {
            // Join Posts and Users, then select the posts which belongs to the image (key)
            var sql = @"SELECT T.PID AS ID, * FROM
                            (SELECT P.ID AS PID, PostedOn, Comment, PostTypeID AS MessageType,     /* Posts */
                            U.ID, FirstName, LastName, Email, Username, RoleID AS Role             /* Users */
                            FROM Posts P INNER JOIN Users U
                            ON U.ID = P.UserID) T
                        INNER JOIN ImagePosts I
                        ON T.PID = I.PostID
                        WHERE I.FileInfoID = @key;";
            var posts = await connection.QueryAsync<Post, User, Post>(sql, (p, u) =>
            {
                p.Author = u;
                return p;
            }, new { key });

            return posts.ToList();
        }

        /// <summary>
        /// Retrieves all entities grouped by their key <see cref="FileInfo.ID"/>
        /// </summary>
        /// <returns>A group of entities</returns>
        public async Task<IEnumerable<IGrouping<int, List<Post>>>> GetAll()
        {
            // Reason for right join: because we first collect all comments, then match them
            // with a particular image.
            var sql = @"SELECT FileInfoID, T.PID AS ID, * FROM                                              /* id */
                            (SELECT P.ID AS PID, PostedOn, Comment, PostTypeID AS MessageType,              /* Posts */
                            U.ID, FirstName, LastName, Email, Username, RoleID AS Role                      /* Users */
                            FROM Posts P INNER JOIN Users U
                            ON P.UserID = U.ID) T
                        RIGHT JOIN ImagePosts I
                        ON T.PID = I.PostID";
            var posts = await connection.QueryAsync<int, Post, User, Tuple<int, Post>>(sql, (id, p, u) =>
            {
                p.Author = u;
                return new Tuple<int, Post>(id, p);
            });

            var result = posts
                            .GroupBy(t => t.Item1)                      /* Generate groups by id */
                            .GroupBy(
                                g => g.Key,                             /* Keep key */
                                t => t.Select(p => p.Item2).ToList());  /* Convert tuple to list */
            return result;
        }

        /// <summary>
        /// Updates a single entity, is identical to the scalar opposition.
        /// </summary>
        /// <param name="entity">The entity</param>
        /// <returns>True if updated otherwise false</returns>
        public async Task<bool> UpdateSingle(Post entity)
        {
            var sql = @"UPDATE Posts SET
                        PostedOn = @PostedOn,
                        Comment = @Comment,
                        PostTypeID = @MessageType,
                        UserID = @UserID
                        WHERE ID = @ID";
            var row = await connection.ExecuteAsync(sql, new
            {
                entity.PostedOn,
                entity.Comment,
                entity.MessageType,
                UserID = entity.Author.ID,
                entity.ID
            });

            // Success: if 1 updated!
            return row == 1;
        }

        /// <summary>
        /// Disposes of the managed resources
        /// </summary>
        /// <param name="disposing">Whether to dispose or not</param>
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    connection.Dispose();
                }

                disposedValue = true;
            }
        }

        /// <summary>
        /// Dispose pattern implementation
        /// </summary>
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }

    }
}
