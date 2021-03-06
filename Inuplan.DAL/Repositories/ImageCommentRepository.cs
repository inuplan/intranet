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

namespace Inuplan.DAL.Repositories
{
    using Common.Factories;
    using Common.Logger;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using Dapper;
    using Optional;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    /// <summary>
    /// A repository which handles the Comments for a related Image.
    /// </summary>
    public class ImageCommentRepository : IVectorRepository<int, Comment>
    {
        private readonly ILogger<ImageCommentRepository> logger;

        /// <summary>
        /// The disposed pattern
        /// </summary>
        private bool disposedValue = false;
        private readonly IConnectionFactory connectionFactory;

        /// <summary>
        /// Initializes a new instance of the <see cref="ImageCommentRepository"/> class.
        /// </summary>
        /// <param name="connection">The database connection</param>
        public ImageCommentRepository(
            IConnectionFactory connectionFactory,
            ILogger<ImageCommentRepository> logger
        )
        {
            this.connectionFactory = connectionFactory;
            this.logger = logger;
        }

        /// <summary>
        /// Creates a new comment. Required: an int identifier, which determines the image the comment relates to!
        /// Optional: int identifier, which determines the comment which is replied to.
        /// </summary>
        /// <param name="entity">The comment to create</param>
        /// <param name="identifiers">An array where the first item is the id of the image, the second item is the id of the parent comment id</param>
        /// <returns>An optional comment, with the updated id if it has been created</returns>
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
                        var sqlImageComment = @"INSERT INTO ImageComments (ImageID, CommentID) VALUES (@ImageID, @CommentID)";
                        success = (await connection.ExecuteAsync(sqlImageComment, new
                        {
                            ImageID = entity.ContextID,
                            CommentID = entity.ID,
                        }, transaction)).Equals(1);
                    }

                    if (success)
                    {
                        await onCreate(entity);
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not create comment");
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

        /// <summary>
        /// Retrieves a list of comments for a given image.
        /// </summary>
        /// <param name="key">The image id</param>
        /// <returns>An awaitable list of comments</returns>
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
                            FROM Comments INNER JOIN ImageComments
                            ON Comments.ID = ImageComments.CommentID
                              WHERE ImageComments.ImageID = @key

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

        /// <summary>
        /// Retrieves a single comment by its comment id.
        /// </summary>
        /// <param name="id">The id of the comment</param>
        /// <returns>An optional comment. Some if comment exists, otherwise None</returns>
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

                    var imageIdSql = @"WITH parent AS
                            (
                                SELECT ID, Reply  from Comments WHERE ID = @id
                                UNION ALL 
                                SELECT t.ID, t.Reply FROM parent
                                INNER JOIN Comments t ON t.id =  parent.Reply
                            )

                            SELECT TOP 1 i.ImageID FROM  parent
                            INNER JOIN ImageComments i
                            ON parent.ID = i.CommentID";

                    var imageId = await connection.ExecuteScalarAsync<int>(imageIdSql, new { id = comment.ID });
                    comment.ContextID = imageId;

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

        /// <summary>
        /// A paginated result of comments, for a given image.
        /// </summary>
        /// <param name="skip">The number of top comments to skip.</param>
        /// <param name="take">The number of top comments to take.</param>
        /// <param name="identifiers">The image id to which the comments belong.</param>
        /// <returns>A paginated result of comments</returns>
        public async Task<Pagination<Comment>> GetPage(int imageId, int skip, int take)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    // Note: we use left join because we want the left side (comments) to be included
                    // even if the right side (users) are null.
                    var sql = @"WITH CommentTree AS(
                                SELECT Reply AS ParentID, ID AS TopID, PostedOn, Author AS AuthorID, Text, Deleted, Edited, ROW_NUMBER() OVER(ORDER BY PostedOn DESC) AS RowNumber
                                FROM Comments INNER JOIN ImageComments
                                ON Comments.ID = ImageComments.CommentID
                                  WHERE ImageComments.ImageID = @ImageID

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
                        comment.ContextID = imageId;
                        return comment;
                    }, new
                    {
                        ImageID = imageId,
                        From = skip + 1,
                        To = skip + take,
                    });

                    var totalSql = @"SELECT COUNT(*) FROM ImageComments WHERE ImageID = @ImageID;";
                    var total = await connection.ExecuteScalarAsync<int>(totalSql, new
                    {
                        ImageID = imageId
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

        /// <summary>
        /// Updates an existing comment, with the given id.
        /// Note: the PostedOn and Text are update-able.
        /// </summary>
        /// <param name="key">The id of the comment</param>
        /// <param name="entity">The updated comment</param>
        /// <returns>True if updated otherwise false.</returns>
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
                        logger.Trace("Updated single comment with id: {0}", key);
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not update single comment with id: {0}", key);
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
        /// Deletes a comment, with the given id.
        /// Note: Only identifying markers are cleaned, such as User and Text.
        /// Anything else is left as-is.
        /// </summary>
        /// <param name="key">The id of the comment</param>
        /// <returns>True if deleted, false otherwise</returns>
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
                    }, transaction)).Equals(1);

                    if (deleted)
                    {
                        await onDelete(key);
                        logger.Trace("Deleted single comment id {0} (fake)", key);
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not (fake) delete single comment id {0}", key);
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

        public async Task<bool> Delete(int imageId, Func<int, Task> onDelete)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sqlIds = @"WITH CommentTree AS(
                                SELECT Reply AS ReplyID, ID, ImageID
                                FROM Comments INNER JOIN ImageComments
                                ON Comments.ID = ImageComments.CommentID
                                WHERE ImageComments.ImageID = @ImageID

                                UNION ALL

                                SELECT Reply.Reply, Reply.ID, ImageID
                                FROM Comments AS Reply JOIN CommentTree ON Reply.Reply = CommentTree.ID
                                WHERE Reply.Reply IS NOT NULL)
                            SELECT ID FROM CommentTree";
                    var commentIds = (await connection.QueryAsync<int>(sqlIds, new
                    {
                        ImageID = imageId
                    }, transaction)).ToList();

                    // Delete all comments for the image:
                    var deleteCommentsSql = @"WITH CommentTree AS(
                                SELECT Reply AS ReplyID, ID, ImageID
                                FROM Comments INNER JOIN ImageComments
                                ON Comments.ID = ImageComments.CommentID
                                  WHERE ImageComments.ImageID = @ImageID

                                UNION ALL

                                SELECT Reply.Reply, Reply.ID, ImageID
                                FROM Comments AS Reply JOIN CommentTree ON Reply.Reply = CommentTree.ID
                                WHERE Reply.Reply IS NOT NULL)
                                DELETE c
                                FROM Comments c
                                INNER JOIN CommentTree t
                                ON c.ID = t.ID";

                    // Returns the number of affected rows (comments deleted)
                    var deletedComments = await connection.ExecuteAsync(deleteCommentsSql, new
                    {
                        ImageID = imageId
                    }, transaction);

                    var success = commentIds.Count == deletedComments;
                    if (success)
                    {
                        foreach (var commentId in commentIds)
                        {
                            await onDelete(commentId);
                        }

                        logger.Trace("Deleted all comments belonging to image id {0}", imageId);
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not delete comments belonging to image id {0}", imageId);
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
        /// Returns the count of comments for a particular image with the given key.
        /// Only counts NOT deleted comments.
        /// </summary>
        /// <param name="key">The Image ID</param>
        /// <returns>The number of items for <see cref="K"/></returns>
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
                        FROM Comments INNER JOIN ImageComments
                        ON Comments.ID = ImageComments.CommentID
                            WHERE ImageComments.ImageID = @key

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
                    // TODO: dispose managed state (managed objects).
                }

                disposedValue = true;
            }
        }
    }
}
