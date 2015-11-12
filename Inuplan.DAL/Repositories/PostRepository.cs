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
    using System.Diagnostics;
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

        /// <summary>
        /// Initializes a new instance of the <see cref="PostRepository"/> class.
        /// </summary>
        /// <param name="connection">The connection to the database</param>
        public PostRepository(IDbConnection connection)
        {
            this.connection = connection;
            locking = new object();
        }

        /// <summary>
        /// Create a <see cref="Post"/> entity, where the <see cref="User"/> and <see cref="PostType"/>
        /// must pre-exist.
        /// </summary>
        /// <param name="entity">The <see cref="Post"/> entity</param>
        /// <returns>A promise of an optional <see cref="Post"/></returns>{
        public Task<Option<Post>> Create(Post entity)
        {
            entity.ID = 0;
            return Task.Run(() =>
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

        /// <summary>
        /// Retrieve a single Post with the given key
        /// </summary>
        /// <param name="key">The key of the <see cref="Post"/></param>
        /// <returns>A promise of an optional <see cref="Post"/></returns>
        public Task<Option<Post>> Get(int key)
        {
            return Task.Run(() =>
                {
                    var sql = @"SELECT p.ID as ID, PostedOn, Comment,                   /* Post */
                        t.ID as ID, t.PostType as MessageType,                          /* PostType */
                        s.ID as ID, s.FirstName as FirstName, s.LastName as LastName    /* User */
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
                        }, new { key }).SingleOrDefault();

                    return entity.SomeNotNull();
                });
        }

        /// <summary>
        /// Retrieves a subset of the Post entities in the database.
        /// Sorts by date: newest to oldest. (descending).
        /// </summary>
        /// <param name="skip">The number of items to skip</param>
        /// <param name="take">The number of items to take</param>
        /// <returns>Returns a promise of a list of <see cref="Post"/>s</returns>{
        public Task<List<Post>> Get(int skip, int take)
        {
            return Task.Run(() =>
                {
                    // Join 3 tables in specific order: Posts + PostTypes + Users
                    var sql = @"";

                    // Dapper, multimapping
                    return connection.Query<Post, PostType, User, Post>(sql, (post, t, author) =>
                        {
                            post.MessageType = t;
                            post.Author = author;
                            return post;

                            // T-SQL does *inclusive* ranges, hence: skip + 1
                        }, new { from = skip + 1, to = (skip + take) }).ToList();
                });
        }

        /// <summary>
        /// Returns every Post entity in the database
        /// </summary>
        /// <returns>A promise of a list of <see cref="Post"/>s</returns>{
        public Task<List<Post>> GetAll()
        {
            return Task.Run(() =>
                {
                    // Join 3 tables, select everything...
                    var sql = @"";
                    
                    // Dapper, multimapping
                    return connection.Query<Post, PostType, User, Post>(sql, (post, t, author) =>
                        {
                            post.MessageType = t;
                            post.Author = author;
                            return post;
                        }).ToList();
                });
        }

        /// <summary>
        /// Updates a specific <see cref="Post"/> entity in the database
        /// </summary>
        /// <param name="key">The key of the <see cref="Post"/></param>
        /// <param name="entity">The updated <see cref="Post"/></param>
        /// <returns>Returns a task of bool, which indicates whether the update was succesfull</returns>
        public Task<bool> Update(int key, Post entity)
        {
            return Task.Run(() =>
                {
                    var sql = @"";
                    return connection.ExecuteScalar<bool>(sql, new { 
                        key,
                        entity.Comment,
                        entity.Author,
                        PostType = entity.MessageType
                        });
                });
        }

        /// <summary>
        /// Deletes a <see cref="Post"/> entity from the database
        /// </summary>
        /// <param name="key">The <see cref="Post"/> with the given key to delete</param>
        /// <returns>Returns a promise, which indicates whether the action was succesfull</returns>
        public Task<bool> Delete(int key)
        {
            return Task.Run(() =>
                {
                    var sql = @"";
                    return connection.ExecuteScalar<bool>(sql, new { key });
                });
        }

        /// <summary>
        /// Deletes a <see cref="Post"/> entity from the database.
        /// The entity must have a valid ID.
        /// </summary>
        /// <param name="entity">The <see cref="Post"/> entity to delete</param>
        /// <returns>Returns a boolean, indicating whether the action was succesfull or not</returns>
        public Task<bool> Delete(Post entity)
        {
            Debug.Assert(entity.ID > 0, "Must have valid ID!");
            return Delete(entity.ID);
        }

        /// <summary>
        /// Disposes of the connection to the database
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        
        /// <summary>
        /// Dispose Pattern, this ensures that this class behaves correctly during
        /// inheritance as well as during threading.
        /// </summary>
        /// <param name="disposing">True if disposing, else false</param>
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
