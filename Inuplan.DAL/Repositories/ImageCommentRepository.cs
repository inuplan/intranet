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
    using Dapper;
    using Optional;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Transactions;
    using Ident = System.Tuple<int, int?>;

    /// <summary>
    /// The <seealso cref="Entity"/> first item is the <seealso cref="Image.ID"/>
    /// the second item is the <see cref="Comment"/> and
    /// the third item is the <seealso cref="Comment.ID"/> to which the reply is made (if null the comment
    /// is not a reply.
    /// </summary>
    public class ImageCommentRepository : IRepository<int, Ident, Comment, Task<List<Comment>>>
    {
        private readonly IDbConnection connection;

        private bool disposedValue = false;

        public ImageCommentRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public async Task<Option<Comment>> Create(Comment entity, Ident identifiers)
        {
            using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var imageID = identifiers.Item1;
                var replyID = identifiers.Item2;

                var sqlComment = @"INSERT INTO Comments (PostedOn, Owner, Remark, Reply)
                                VALUES (@PostedOn, @Owner, @Remark, @Reply);
                                SELECT ID FROM Comments WHERE ID = @@IDENTITY;";

                entity.ID = await connection.ExecuteScalarAsync<int>(sqlComment, new
                {
                    Owner = entity.Owner.ID,
                    Reply = replyID,
                    entity.PostedOn,
                    entity.Remark,
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

                if(success)
                {
                    transactionScope.Complete();
                }

                return entity.SomeWhen(c => success);
            }
        }

        public async Task<bool> Delete(int key)
        {
            using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                // Note: only removes identifying marks so that any child-branches aren't left hanging 
                var sqlDelete = @"UPDATE Comments SET Owner=NULL, Remark=@Comment, Deleted=@Deleted WHERE ID=@ID";
                var deleted = (await connection.ExecuteAsync(sqlDelete, new
                {
                    Comment = "",
                    Deleted = true,
                    ID = key,
                })).Equals(1);

                if(deleted)
                {
                    transactionScope.Complete();
                }

                return deleted;
            }
        }

        public async Task<List<Comment>> Get(int key)
        {
            var repliesTo = new List<Tuple<int?, Comment>>();

            var sqlTopId = @"SELECT CommentID FROM ImageComments WHERE ImageID = @key";
            var topIds = await connection.QueryAsync<int>(sqlTopId, new { key });

            // SQL - CTE where first projection (select) is the anchor
            // the 2nd projection is the recursion
            var sqlComments = @"WITH CommentChain AS (
                                SELECT Reply, ID, PostedOn, Owner, Remark, Deleted
                                FROM Comments
                                WHERE ID = @ID

                                UNION ALL

                                SELECT Reply.Reply, Reply.ID, Reply.PostedOn, Reply.Owner, Reply.Remark, Reply.Deleted
                                FROM Comments AS Reply JOIN CommentChain ON Reply.Reply = CommentChain.ID
                                WHERE Reply.Reply IS NOT NULL)
                                SELECT * FROM CommentChain
                                INNER JOIN Users ON CommentChain.Owner = Users.ID;";

            var ids = topIds.Select(i => new { ID = i }).ToArray();
            var allComments = await connection.QueryAsync<int?, Comment, User, Comment>(sqlComments, (parent, comment, user) =>
            {
                comment.Owner = user;
                if(parent.HasValue)
                {
                    // Is a reply to a comment
                    var reply = new Tuple<int?, Comment>(parent, comment);
                    repliesTo.Add(reply);
                }

                return comment;
            }, ids);

            var group = repliesTo.GroupBy(g => g.Item1);
            var result = new List<Comment>();

            foreach(var item in group)
            {
                var replies = item.Select(r => r.Item2);
                var parent = allComments.Single(p => p.ID == item.Key);
                parent.Replies = replies.ToList();
                result.Add(parent);
            }

            return result;
        }

        public Task<List<Comment>> Get(int skip, int take, Ident identifiers)
        {
            // TODO: Row_Number function for the top comments
            // then using CTE to get child comments for all selected top comments
            throw new NotImplementedException();
        }

        public Task<List<Comment>> GetAll(Ident identifiers)
        {
            throw new NotImplementedException();
        }

        public Task<Option<Comment>> GetByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(int key, Comment entity)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }

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
    }
}
