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
    using Common.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.Models;
    using Optional;
    using Dapper;
    using System.Data;
    using System.Transactions;
    using System.Data.SqlClient;
    using Common.Tools;
    using Common.Logger;
    using Common.Factories;

    public class ForumCommentsRepository : IVectorRepository<int, Comment>
    {
        private readonly ILogger<ForumCommentsRepository> logger;
        private bool disposedValue = false;
        private readonly IConnectionFactory connectionFactory;

        public ForumCommentsRepository(
            IConnectionFactory connectionFactory,
            ILogger<ForumCommentsRepository> logger
        )
        {
            this.connectionFactory = connectionFactory;
            this.logger = logger;
        }

        public async Task<int> Count(int key)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    var sqlComments =
                        @"WITH CommentTree AS(
                        SELECT Reply AS ReplyID, ID, Deleted
                        FROM Comments INNER JOIN ThreadComments
                        ON Comments.ID = ThreadComments.CommentID
                            WHERE ThreadComments.ThreadID = @key

                        UNION ALL

                        SELECT Reply.Reply, Reply.ID, Reply.Deleted
                        FROM Comments AS Reply JOIN CommentTree ON Reply.Reply = CommentTree.ID
                        WHERE Reply.Reply IS NOT NULL)
                    SELECT Count(*) FROM CommentTree
                    WHERE Deleted <> 1";

                    var count = await connection.ExecuteScalarAsync<int>(sqlComments, new
                    {
                        key
                    });

                    logger.End();
                    return count;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<Option<Comment>> CreateSingle(Comment entity, Func<Comment, Task> onCreate)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sqlComment = @"INSERT INTO Comments (PostedOn, Author, Text, Reply)
                                VALUES (@PostedOn, @Author, @Text, @Reply);
                                SELECT ID FROM Comments WHERE ID = @@IDENTITY;";

                    entity.ID = await connection.ExecuteScalarAsync<int>(sqlComment, new
                    {
                        Author = entity.Author.ID,
                        Reply = entity.ParentID,
                        PostedOn = entity.PostedOn,
                        Text = entity.Text,
                    }, transaction);

                    var success = entity.ID > 0;

                    if (!entity.ParentID.HasValue)
                    {
                        // It is a top comment
                        var sqlThreadComment = @"INSERT INTO ThreadComments (ThreadID, CommentID) VALUES (@ThreadID, @CommentID)";
                        success = (await connection.ExecuteAsync(sqlThreadComment, new
                        {
                            ThreadID = entity.ContextID,
                            CommentID = entity.ID,
                        }, transaction)).Equals(1);
                    }

                    // Then set the latest comment for the thread to this comment
                    var updateSql = @"UPDATE ThreadTitles SET LatestComment=@ID WHERE ID=@ThreadID";
                    var update = await connection.ExecuteAsync(updateSql, new
                    {
                        ID = entity.ID,
                        ThreadID = entity.ContextID
                    }, transaction);

                    success = success && (update == 1);

                    if (success)
                    {
                        await onCreate(entity);
                        logger.Trace("Created single comment for forum post");
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not create single comment for forum post");
                        transaction.Rollback();
                    }

                    logger.End();
                    return entity.SomeWhen(c => success);
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
                    }, transaction)).ToList();

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
                    }, transaction);

                    var deleted = commentIds.Count == deletedComments;

                    if (deleted)
                    {
                        foreach (var commentId in commentIds)
                        {
                            await onDelete(commentId);
                        }

                        logger.Trace("Deleted all comments belonging to forum post {0}", key);
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not delete all comments belonging to forum post {0}", key);
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

        public async Task<bool> DeleteSingle(int key, Func<int, Task> onDelete)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    // Note: only removes identifying marks so that any child-branches aren't left hanging 
                    var sqlDelete = @"UPDATE Comments SET Author=NULL, Text=NULL, Deleted=@Deleted WHERE ID=@ID";
                    var deleted = (await connection.ExecuteAsync(sqlDelete, new
                    {
                        Deleted = true,
                        ID = key,
                    })).Equals(1);

                    if (deleted)
                    {
                        await onDelete(key);
                        transaction.Commit();
                    }
                    else
                    {
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

        public async Task<List<Comment>> Get(int key)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    // SQL - CTE where first projection (select) is the anchor
                    // the 2nd projection is the recursion
                    // Note: using LEFT JOIN on final projection, since we want to include all the deleted comments where user is null
                    var sqlComments =
                        @"WITH CommentTree AS(
                            SELECT Reply AS ParentID, ID AS TopID, PostedOn, Author AS AuthorID, Text, Edited, Deleted, ROW_NUMBER() OVER(ORDER BY PostedOn DESC) AS RowNumber
                            FROM Comments INNER JOIN ThreadComments
                            ON Comments.ID = ThreadComments.CommentID
                              WHERE ThreadComments.ThreadID = @key

                            UNION ALL

                            SELECT Reply.Reply, Reply.ID, Reply.PostedOn, Reply.Author, Reply.Text, Reply.Edited, Reply.Deleted, CommentTree.RowNumber
                            FROM Comments AS Reply JOIN CommentTree ON Reply.Reply = CommentTree.TopID
                            WHERE Reply.Reply IS NOT NULL)
                        SELECT
                            ParentID, TopID AS ID, Deleted, PostedOn, Text, Edited  /* comment */
                            ID, FirstName, LastName, Username, Email                /* author */
                        FROM CommentTree
                        LEFT JOIN Users ON CommentTree.AuthorID = Users.ID";

                    var allComments = await connection.QueryAsync<Comment, User, Comment>(sqlComments, (comment, author) =>
                    {
                        comment.Author = author;
                        comment.ContextID = key;
                        return comment;
                    }, new { key });

                    logger.End();
                    var result = Helpers.ConstructReplies(allComments);
                    return result;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<Pagination<Comment>> GetPage(int id, int skip, int take)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    // Note: we use left join because we want the left side (comments) to be included
                    // even if the right side (users) are null.
                    var sql = @"WITH CommentTree AS(
                                SELECT Reply AS ParentID, ID AS TopID, PostedOn, Author AS AuthorID, Text, Deleted, Edited, ROW_NUMBER() OVER(ORDER BY PostedOn ASC) AS RowNumber
                                FROM Comments INNER JOIN ThreadComments
                                ON Comments.ID = ThreadComments.CommentID
                                  WHERE ThreadComments.ThreadID = @ThreadID

                                UNION ALL

                                SELECT Reply.Reply, Reply.ID, Reply.PostedOn, Reply.Author, Reply.Text, Reply.Deleted, Reply.Edited, CommentTree.RowNumber
                                FROM Comments AS Reply JOIN CommentTree ON Reply.Reply = CommentTree.TopID
                                WHERE Reply.Reply IS NOT NULL)
                            SELECT
                                ParentID, TopID AS ID, Deleted, PostedOn, Text, Edited,     /* comment */
                                ID, FirstName, LastName, Username, Email                    /* author */
                            FROM CommentTree
                            LEFT JOIN Users ON CommentTree.AuthorID = Users.ID
                            WHERE RowNumber BETWEEN @From AND @To";

                    var repliesTo = new List<Tuple<int?, Comment>>();
                    var comments = await connection.QueryAsync<Comment, User, Comment>(sql, (comment, author) =>
                    {
                        comment.Author = author;
                        comment.ContextID = id;
                        return comment;
                    }, new
                    {
                        ThreadID = id,
                        From = skip + 1,
                        To = skip + take,
                    });

                    var totalSql = @"SELECT COUNT(*) FROM ThreadComments WHERE ThreadID = @ThreadID;";
                    var total = await connection.ExecuteScalarAsync<int>(totalSql, new
                    {
                        ThreadID = id
                    });

                    logger.End();
                    var items = Helpers.ConstructReplies(comments);
                    return Helpers.Paginate(skip, take, total, items);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<Option<Comment>> GetSingleByID(int id)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    var sql = @"SELECT 
                            c.ID, PostedOn, Text, c.Deleted, c.Edited,
                            u.ID, FirstName, LastName, Username, Email
                            FROM Comments c LEFT JOIN Users u ON c.Author = u.ID WHERE c.ID = @id";

                    var comment = (await connection.QueryAsync<Comment, User, Comment>(sql, (c, u) =>
                    {
                        if (!c.Deleted) c.Author = u;
                        return c;
                    }, new { id })).Single();

                    var threadIdSql = @"WITH parent AS
                            (
                                SELECT ID, Reply  from Comments WHERE ID = @id
                                UNION ALL 
                                SELECT t.ID, t.Reply FROM parent
                                INNER JOIN Comments t ON t.id =  parent.Reply
                            )

                            SELECT TOP 1 i.ThreadID FROM  parent
                            INNER JOIN ThreadComments i
                            ON parent.ID = i.CommentID";

                    var threadId = await connection.ExecuteScalarAsync<int>(threadIdSql, new { id = comment.ID });
                    comment.ContextID = threadId;

                    var result = comment.SomeWhen(c => c != null && c.ID > 0 && c.ContextID > 0);

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

        public async Task<bool> UpdateSingle(int key, Comment entity, params object[] identifiers)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    entity.Edited = true;
                    var sql = @"UPDATE Comments SET PostedOn=@PostedOn, Text=@Text, Edited=@Edited WHERE ID=@key";
                    var success = (await connection.ExecuteAsync(sql, new
                    {
                        key,
                        entity.PostedOn,
                        entity.Edited,
                        entity.Text
                    }, transaction)).Equals(1);

                    if (success)
                    {
                        logger.Trace("Updated single forum post comment");
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not update single forum post comment");
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
                    // TODO: dispose managed resources
                }

                disposedValue = true;
            }
        }
    }
}
