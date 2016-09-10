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
    using Dapper;
    using System.Data;
    using System.Transactions;

    public class ForumCommentsRepository : IVectorRepository<int, Comment>
    {
        private readonly IDbConnection connection;

        /// <summary>
        /// The disposed pattern
        /// </summary>
        private bool disposedValue = false;

        public ForumCommentsRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public Task<int> Count(int key)
        {
            throw new NotImplementedException();
        }

        public Task<Option<Comment>> CreateSingle(Comment entity, Func<Comment, Task> onCreate)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Delete(int key, Func<int, Task> onDelete)
        {
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                // Get All comment ids
                var sqlCommentIds = @"WITH CommentTree AS(
                                        SELECT Reply AS ReplyID, ID as CommentID
                                        FROM Comments INNER JOIN ThreadComments
                                        ON Comments.ID = ThreadComments.CommentID
                                        WHERE ThreadComments.ThreadID = @ThreadID

                                        UNION ALL

                                        SELECT Reply.Reply, Reply.ID
                                        FROM Comments AS Reply JOIN CommentTree ON Reply.Reply = CommentTree.CommentID
                                        WHERE Reply.Reply IS NOT NULL)
                                    SELECT CommentID FROM CommentTree";
                var commentIds = (await connection.QueryAsync<int>(sqlCommentIds, new
                {
                    ThreadID = key
                })).ToList();

                // Delete all comments for the thread:
                var deleteCommentsSql = @"WITH CommentTree AS(
                                            SELECT Reply AS ReplyID, ID, ThreadID
                                            FROM Comments INNER JOIN ThreadComments
                                            ON Comments.ID = ThreadComments.CommentID
                                                WHERE ThreadComments.ThreadID = @ThreadID

                                            UNION ALL

                                            SELECT Reply.Reply, Reply.ID, ThreadID
                                            FROM Comments AS Reply JOIN CommentTree ON Reply.Reply = CommentTree.ID
                                            WHERE Reply.Reply IS NOT NULL)
                                        DELETE c
                                        FROM Comments c
                                        INNER JOIN CommentTree t
                                        ON c.ID = t.ID";

                // Returns the number of affected rows (comments deleted)
                var deletedComments = await connection.ExecuteAsync(deleteCommentsSql, new
                {
                    ThreadID = key
                });

                var deleted = commentIds.Count == deletedComments;

                if(deleted)
                {
                    foreach (var commentId in commentIds)
                    {
                        await onDelete(commentId);
                    }

                    transactionScope.Complete();
                }

                return deleted;
            }
        }

        public Task<bool> DeleteSingle(int key, Func<int, Task> onDelete)
        {
            // The key is a CommentID
            throw new NotImplementedException();
        }

        public Task<List<Comment>> Get(int key)
        {
            throw new NotImplementedException();
        }

        public Task<Pagination<Comment>> GetPage(int id, int skip, int take)
        {
            throw new NotImplementedException();
        }

        public Task<Option<Comment>> GetSingleByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateSingle(int key, Comment entity, params object[] identifiers)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// The dispose pattern
        /// </summary>
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }

        /// <summary>
        /// Disposing
        /// </summary>
        /// <param name="disposing">Determines whether this resource is being disposed</param>
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    connection.Dispose();
                    connection.Close();
                }

                disposedValue = true;
            }
        }
    }
}
