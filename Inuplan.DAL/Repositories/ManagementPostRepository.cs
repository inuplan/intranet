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
    /// A repository of management posts.
    /// Used to connect to the database, and retrieve management posts.
    /// </summary>
    public class ManagementPostRepository : IRepository<int, Post>
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
        /// Initializes a new instance of the <see cref="GeneralPostRepository"/> class.
        /// </summary>
        /// <param name="connection">The connection to the database</param>
        public ManagementPostRepository(IDbConnection connection)
        {
            this.connection = connection;
            locking = new object();
        }

        /// <summary>
        /// Create a <see cref="Post"/> entity, where the <see cref="User"/>
        /// The <see cref="PostType"/> is set to <see cref="PostType.Management"/>.
        /// </summary>
        /// <param name="entity">The <see cref="Post"/> entity</param>
        /// <returns>A promise of an optional <see cref="Post"/></returns>
        public Task<Option<Post>> Create(Post entity)
        {
            entity.ID = 0;
            return Task.Run(() =>
                {
                    // Assumes an MS-SQL server (t-sql used below)
                    var sql = @"INSERT INTO Posts
                    (PostedOn, Comment, PostTypeID, UserID)
                    VALUES (@PostedOn, @Comment, @PostTypeID, @UserID);
                    SELECT ID FROM Posts WHERE ID = @@IDENTITY";

                    entity.ID = connection.ExecuteScalar<int>(sql,
                        new { entity.PostedOn,
                              entity.Comment,
                              PostTypeID = PostType.Management,
                              UserID = entity.Author.ID });
                    
                    return entity.SomeWhen(e => e.ID != 0);
                });
        }

        /// <summary>
        /// Retrieve a single Post with the given key and post must of type <see cref="PostType.Management"/>
        /// </summary>
        /// <param name="key">The key of the <see cref="Post"/></param>
        /// <returns>A promise of an optional <see cref="Post"/></returns>
        public Task<Option<Post>> Get(int key)
        {
            return Task.Run(() =>
                {
                    // SQL join Posts with Users
                    var sql = @"SELECT p.ID as ID, PostedOn, Comment, p.PostTypeID as MessageType,      /* Posts */
                        s.ID as ID, FirstName, LastName, RoleID AS Role                                 /* User */
                    FROM Posts p 
                    INNER JOIN Users s on p.UserID = s.ID
                    WHERE p.ID = @key AND MessageType = @MessageType"; 

                    var entity = connection.Query<Post, User, Post>(sql, 
                                     (post, author) =>
                        {
                            post.Author = author;
                            return post;
                        }, new {
                            key,
                            MessageType = PostType.Management
                        }).SingleOrDefault();

                    return entity.SomeNotNull();
                });
        }

        /// <summary>
        /// Retrieves a subset of the Post entities in the database.
        /// Sorts by date: newest to oldest. (descending).
        /// </summary>
        /// <param name="skip">The number of items to skip</param>
        /// <param name="take">The number of items to take</param>
        /// <returns>Returns a promise of a list of <see cref="Post"/>s</returns>
        public Task<List<Post>> Get(int skip, int take)
        {
            return Task.Run(() =>
                {
                    // Join 2 tables in specific order: Posts + Users
                    var sql = @"WITH PostResults AS (
                    SELECT p.ID as PostID, PostedOn, Comment,                           /* Post */
                           PostTypeID AS MessageType,                                   /* PostType */
                           u.ID, FirstName, LastName, RoleID AS Role,                   /* User */
                           ROW_NUMBER() OVER (ORDER BY PostedOn DESC) AS 'RowNumber'
                        FROM Posts p
                        INNER JOIN Users u
                            on p.UserID = u.ID
                    )
                    SELECT PostID as ID, PostedOn, Comment, MessageType, ID, FirstName, LastName
                    FROM PostResults
                    WHERE RowNumber BETWEEN @From AND @To                               /* To is inclusive */
                    AND MessageType = @MessageType";

                    // Dapper, multimapping
                    return connection.Query<Post, User, Post>(sql, (post, author) =>
                        {
                            post.Author = author;
                            return post;

                            // T-SQL does *inclusive* ranges, hence: skip + 1
                        }, new {
                            From = skip + 1,
                            To = (skip + take),
                            MessageType = PostType.Management
                        }).ToList();
                });
        }

        /// <summary>
        /// Retrieves an entity by the id
        /// </summary>
        /// <param name="id">The id of the entity</param>
        /// <returns>An awaitable task</returns>
        public async Task<Option<Post>> GetByID(int id)
        {
            return await Get(id);
        }

        /// <summary>
        /// Returns every Management Post entity in the database
        /// </summary>
        /// <returns>A promise of a list of <see cref="Post"/>s</returns>
        public Task<List<Post>> GetAll()
        {
            return Task.Run(() =>
                {
                    // Join 2 tables, select everything...
                    var sql = @"SELECT p.ID AS ID, PostedOn, Comment, PostTypeID AS MessageType,        /* Post */
                        u.ID AS ID, FirstName, LastName                                                 /* User */
                        FROM Posts p
                        INNER JOIN Users u
                        ON p.UserID = u.ID
                        WHERE MessageType = @MessageType";
                    
                    // Dapper, multimapping
                    return connection.Query<Post, User, Post>(sql, (post, author) =>
                        {
                            post.Author = author;
                            return post;
                        }, new { MessageType = PostType.Management }).ToList();
                });
        }

        /// <summary>
        /// Updates a specific <see cref="Post"/> entity in the database
        /// </summary>
        /// <param name="key">The key of the <see cref="Post"/></param>
        /// <param name="entity">The updated <see cref="Post"/></param>
        /// <returns>Returns a task of bool, which indicates whether the update was succesfull</returns>
        public Task<Option<bool>> Update(int key, Post entity)
        {
            return Task.Run(() =>
                {
                    var sql = @"UPDATE Posts SET PostedOn = @PostedOn, Comment = @Comment, PostTypeID = @MessageType, UserID = @UserID
                    WHERE ID = @key";
                    var rows = connection.Execute(sql, new { 
                        key,
                        entity.Comment,
                        UserID = entity.Author.ID,
                        entity.MessageType
                        });

                    // returns true if some rows are affected
                    return (rows > 0).SomeWhen(b => b);
                });
        }

        /// <summary>
        /// Deletes a <see cref="Post"/> entity from the database
        /// </summary>
        /// <param name="key">The <see cref="Post"/> with the given key to delete</param>
        /// <returns>Returns a promise, which indicates whether the action was succesfull</returns>
        public Task<Option<bool>> Delete(int key)
        {
            return Task.Run(() =>
                {
                    var sql = @"DELETE FROM Posts WHERE ID = @key AND PostTypeID = @PostType";
                    var rows = connection.Execute(sql, new {
                        key,
                        PostType = (int)PostType.Management
                    });

                    // returns true if some rows are affected
                    return (rows > 0).SomeWhen(b => b);
                });
        }

        /// <summary>
        /// Deletes a <see cref="Post"/> entity from the database.
        /// The entity must have a valid ID.
        /// </summary>
        /// <param name="entity">The <see cref="Post"/> entity to delete</param>
        /// <returns>Returns a boolean, indicating whether the action was succesfull or not</returns>
        public Task<Option<bool>> Delete(Post entity)
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
