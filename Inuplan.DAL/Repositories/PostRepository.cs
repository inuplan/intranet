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
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using Dapper;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Optional;

    /// <summary>
    /// A repository of posts.
    /// Used to connect to the database, and retrieve posts.
    /// </summary>
    public class PostRepository : IRepository<int, Post>
    {
        
        /// <summary>
        /// The database connection
        /// </summary>
        private readonly IDbConnection connection;

        /// <summary>
        /// Lock for threading, to ensure an atomic call to dispose method
        /// </summary>
        private readonly object locking;

        /// <summary>
        /// Determines if the connection has been disposed
        /// </summary>
        private bool disposed;

        public PostRepository(IDbConnection connection)
        {
            this.connection = connection;
            locking = new object();
        }

        public Task<Option<Post>> Create(Post entity)
        {
            entity.ID = 0;
            return Task<Option<Post>>.Run(() =>
                {
                    // Assumes an MS-SQL server (t-sql used below)
                    var sql = @"INSERT INTO Posts
                    (PostedOn, Comment, PostType, User)
                    VALUES (@PostedOn, @Comment, @PostType, @User);
                    SELECT ID FROM Posts WHERE ID = @@IDENTITY";

                    entity.ID = connection.ExecuteScalar<int>(sql,
                        new { entity.PostedOn,
                              entity.Comment,
                              PostType = entity.MessageType,
                              User = entity.Author.ID });
                    
                    return entity.SomeWhen(e => e.ID != 0);
                });
        }

        public Task<Option<Post>> Get(int key)
        {
            return Task.Run(() =>
                {
                    var sql = @"SELECT p.ID as ID, PostedOn, Comment, /* Post */
                        t.ID as ID, t.PostType as MessageType, /* PostType */
                        s.ID as ID, s.FirstName as FirstName, s.LastName as LastName /* User */
                    FROM Posts p 
                    INNER JOIN PostTypes t
                        on p.PostType = t.ID
                    INNER JOIN Users s p.User = s.ID
                    WHERE p.ID = @key"; 

                    var entity = connection.Query<Post, PostType, User, Post>(
                                     sql, 
                                     (p, t, u) =>
                        {
                            p.MessageType = t;
                            p.Author = u;
                            return p;
                        }).FirstOrDefault();

                    return entity.SomeNotNull<Post>();
                });
        }

        public Task<List<Post>> Get(int skip, int take)
        {
            throw new NotImplementedException();
        }

        public Task<List<Post>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(int key, Post entity)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Delete(int key)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Delete(Post entity)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        
        protected virtual void Dispose(bool disposing)
        {
            lock (locking)
            {
                if (disposed)
                {
                    return;
                }

                if (disposing)
                {
                    if (connection != null)
                    {
                        connection.Dispose();
                        disposed = true;
                    }
                }
            }
        }
    }
}
