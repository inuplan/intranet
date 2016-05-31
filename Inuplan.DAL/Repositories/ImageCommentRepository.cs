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
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using Dapper;
    using NLog;
    using Optional;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Transactions;

    /// <summary>
    /// A repository which handles the Comments for a related Image.
    /// </summary>
    public class ImageCommentRepository : IVectorRepository<int, Comment>
    {
        /// <summary>
        /// Get current logging framework
        /// </summary>
        private static Logger Logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The database connection
        /// </summary>
        private readonly IDbConnection connection;

        /// <summary>
        /// The disposed pattern
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
        /// Creates a new comment. Required: an int identifier, which determines the image the comment relates to!
        /// Optional: int identifier, which determines the comment which is replied to.
        /// </summary>
        /// <param name="entity">The comment to create</param>
        /// <param name="identifiers">An array where the first item is the id of the image, the second item is the id of the parent comment id</param>
        /// <returns>An optional comment, with the updated id if it has been created</returns>
        public async Task<Option<Comment>> CreateSingle(Comment entity, params object[] identifiers)
        {
            try
            {
                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var imageID = (int)identifiers[0];
                    var replyID = identifiers.Length > 1 ? (int?)identifiers[1] : null;

                    var sqlComment = @"INSERT INTO Comments (PostedOn, Author, Text, Reply)
                                VALUES (@PostedOn, @Author, @Text, @Reply);
                                SELECT ID FROM Comments WHERE ID = @@IDENTITY;";

                    entity.ID = await connection.ExecuteScalarAsync<int>(sqlComment, new
                    {
                        Author = entity.Author.ID,
                        Reply = replyID,
                        entity.PostedOn,
                        entity.Text,
                    });

                    var success = entity.ID > 0;

                    if (!replyID.HasValue)
                    {
                        // It is a top comment
                        var sqlImageComment = @"INSERT INTO ImageComments (ImageID, CommentID) VALUES (@ImageID, @CommentID)";
                        success = (await connection.ExecuteAsync(sqlImageComment, new
                        {
                            ImageID = imageID,
                            CommentID = entity.ID,
                        })).Equals(1);
                    }

                    if (success)
                    {
                        transactionScope.Complete();
                    }

                    return entity.SomeWhen(c => success);
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
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
                var repliesTo = new List<Tuple<int?, Comment>>();

                // SQL - CTE where first projection (select) is the anchor
                // the 2nd projection is the recursion
                var sqlComments = @"WITH CommentTree AS (
                                    SELECT Reply, ID, PostedOn, Author AS AuthorID, Text
                                    FROM Comments INNER JOIN ImageComments
                                    ON Comments.ID = ImageComments.CommentID
                                    WHERE ImageComments.ImageID = @key

                                    UNION ALL

                                    SELECT Reply.Reply, Reply.ID, Reply.PostedOn, Reply.Author, Reply.Text
                                    FROM Comments AS Reply JOIN CommentTree ON Reply.Reply = CommentTree.ID
                                    WHERE Reply.Reply IS NOT NULL)
                                SELECT * FROM CommentTree
                                LEFT JOIN Users ON CommentTree.AuthorID = Users.ID;";

                var collection = new ConcurrentDictionary<int, Comment>();
                var allComments = await connection.QueryAsync<int?, Comment, User, Comment>(sqlComments, (parent, comment, author) =>
                {
                    comment.Author = author;
                    if (parent.HasValue)
                    {
                        // Is a reply to a comment
                        // Assumption: parent comments are processed before the child comments
                        Comment parentComment;
                        collection.TryGetValue(parent.Value, out parentComment);

                        if (parentComment.Replies == null)
                        {
                            parentComment.Replies = new List<Comment>();
                        }

                        parentComment.Replies.Add(comment);
                    }

                    return comment;
                }, new { key });

                return ConstructComments(repliesTo);
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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
                var sql = @"SELECT c.ID, PostedOn, Text,
                            u.ID, FirstName, LastName, Username, Email
                            FROM Comments c INNER JOIN Users u ON c.Author = u.ID WHERE c.ID = @id";

                var comment = (await connection.QueryAsync<Comment, User, Comment>(sql, (c, o) =>
                {
                    c.Author = o;
                    return c;
                }, new { id })).Single();
                var result = comment.SomeWhen(c => c != null && c.ID > 0);

                return result;
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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
        public async Task<Pagination<Comment>> GetPage(int skip, int take, params object[] identifiers)
        {
            try
            {
                var imageID = (int)identifiers[0];
                Debug.Assert(imageID > 0, "Must have a valid image identifier!");

                // Note: we use left join because we want the left side (comments) to be included
                // even if the right side (users) are null.
                var sql = @"WITH CommentTree AS(
                                SELECT Reply AS ReplyID, ID AS TopID, PostedOn, Author AS AuthorID, Text, Deleted, ROW_NUMBER() OVER(ORDER BY PostedOn DESC) AS RowNumber
                                FROM Comments INNER JOIN ImageComments
                                ON Comments.ID = ImageComments.CommentID
                                  WHERE ImageComments.ImageID = @ImageID

                                UNION ALL

                                SELECT Reply.Reply, Reply.ID, Reply.PostedOn, Reply.Author, Reply.Text, Reply.Deleted, CommentTree.RowNumber
                                FROM Comments AS Reply JOIN CommentTree ON Reply.Reply = CommentTree.TopID
                                WHERE Reply.Reply IS NOT NULL)
                            SELECT
                                ReplyID,                                    /* parent */
                                TopID AS ID, Deleted, PostedOn, Text,       /* comment */
                                ID, FirstName, LastName, Username, Email	/* author */
                            FROM CommentTree
                            LEFT JOIN Users ON CommentTree.AuthorID = Users.ID
                            WHERE RowNumber BETWEEN @From AND @To";

                var repliesTo = new List<Tuple<int?, Comment>>();
                var allComments = await connection.QueryAsync<int?, Comment, User, Comment>(sql, (parent, comment, author) =>
                {
                    comment.Author = author;
                    var item = new Tuple<int?, Comment>(parent, comment);
                    repliesTo.Add(item);
                    return comment;
                }, new
                {
                    ImageID = imageID,
                    From = skip + 1,
                    To = skip + take,
                });

                Debug.Assert(allComments.Count() == repliesTo.Count, "Every comment must be in the repliesTo variable");

                var comments = ConstructComments(repliesTo);
                var totalSql = @"SELECT COUNT(*) FROM ImageComments WHERE ImageID = @ImageID;";
                var total = await connection.ExecuteScalarAsync<int>(totalSql, new
                {
                    ImageID = imageID
                });

                var pageComments = Helpers.Paginate(skip, take, total, comments);
                return pageComments;
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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
                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sql = @"UPDATE Comments SET PostedOn=@PostedOn, Text=@Text WHERE ID=@key";
                    var success = (await connection.ExecuteAsync(sql, new
                    {
                        key,
                        PostedOn = entity.PostedOn,
                        entity.Text
                    })).Equals(1);

                    if (success)
                    {
                        transactionScope.Complete();
                        return true;
                    }

                    return false;
                }
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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
        public async Task<bool> DeleteSingle(int key)
        {
            try
            {
                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    // Note: only removes identifying marks so that any child-branches aren't left hanging 
                    var sqlDelete = @"UPDATE Comments SET Author=NULL, Text=@Comment, Deleted=@Deleted WHERE ID=@ID";
                    var deleted = (await connection.ExecuteAsync(sqlDelete, new
                    {
                        Comment = "",
                        Deleted = true,
                        ID = key,
                    })).Equals(1);

                    if (deleted)
                    {
                        transactionScope.Complete();
                    }

                    return deleted;
                }
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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
                    connection.Dispose();
                }

                disposedValue = true;
            }
        }

        private List<Comment> ConstructComments(List<Tuple<int?, Comment>> repliesTo)
        {
            var group = repliesTo.GroupBy(g => g.Item1);

            var getParent = new Func<int, Comment>(id =>
            {
                var p = repliesTo.Single(i => i.Item2.ID == id).Item2;
                return p;
            });

            // Construct reply hierarchy
            var result = new List<Comment>();
            foreach (var item in group)
            {
                // all parents:
                if (item.Key == null)
                {
                    // only add the top-level comments
                    result.AddRange(item.Select(c => c.Item2));
                    continue;
                }

                // Construct the replies for the top-level comments
                // Retrieve parent with id @key
                var parent = repliesTo.Single(c => c.Item2.ID == item.Key.Value).Item2;

                // A group of replies to parent
                parent.Replies = item.Select(c => c.Item2).ToList();
            }

            return result;
        }
    }
}
