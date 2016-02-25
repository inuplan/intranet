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
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.Models;
    using Common.Repositories;
    using Dapper;
    using Optional;
    using System.Transactions;
    /// <summary>
    /// Repository for <see cref="User"/>s in the database.
    /// Can do CRUD operations.
    /// </summary>
    public class UserDatabaseRepository : IRepository<string, User>
    {
        /// <summary>
        /// The database connection
        /// </summary>
        private readonly IDbConnection connection;

        /// <summary>
        /// Lock mechanism for multithreaded access
        /// </summary>
        private readonly object locking;

        /// <summary>
        /// Dispose pattern implementation.
        /// Indicates whether dispose has been called multiple times.
        /// </summary>
        private bool disposed;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserDatabaseRepository"/> class.
        /// </summary>
        /// <param name="connection">The database connection</param>
        public UserDatabaseRepository(IDbConnection connection)
        {
            this.connection = connection;
            this.connection.Open();
            locking = new object();
        }

        /// <summary>
        /// Creates a <see cref="User"/> entity with the given information.
        /// </summary>
        /// <param name="entity">The user entity</param>
        /// <returns>Returns an awaitable optional user</returns>
        public async Task<Option<User>> Create(User entity)
        {
            entity.ID = 0;
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                // MS-SQL (T-SQL)
                var sql = @"INSERT INTO Users (Username, FirstName, LastName, Email, RoleID)
                        VALUES (@Username, @FirstName, @LastName, @Email, @RoleID);
                        SELECT ID FROM Users WHERE ID = @@IDENTITY";

                entity.ID = await connection.ExecuteScalarAsync<int>(sql, new
                {
                    Username = entity.Username,
                    FirstName = entity.FirstName,
                    LastName = entity.LastName,
                    Email = entity.Email,
                    RoleID = entity.Role
                });

                var result = entity.SomeWhen(u => u.ID > 0);

                // On success commit
                if (result.HasValue)
                {
                    transactionScope.Complete();
                }

                return result;
            }
        }

        /// <summary>
        /// Deletes a <see cref="User"/> from the database, with the given ID.
        /// Entity must contain a valid ID.
        /// </summary>
        /// <param name="entity">The user entity</param>
        /// <returns>An awaitable optional boolean value indicating whether the operation was succesfull</returns>
        public async Task<bool> Delete(User entity)
        {
            var sql = @"DELETE FROM Users WHERE ID = @key";
            var rows = await connection.ExecuteAsync(sql, new { key = entity.ID });
            return rows > 0;
        }

        /// <summary>
        /// Deletes a <see cref="User"/> from the database with the given key.
        /// </summary>
        /// <param name="key">The ID of the user</param>
        /// <returns>An awaitable optional boolean value, indicating whether the operation was succesfull</returns>
        public async Task<bool> Delete(string key)
        {
            var sql = @"DELETE FROM Users WHERE Username = @key";
            var rows = await connection.ExecuteAsync(sql, new { key });
            return rows == 1;
        }

        /// <summary>
        /// Retrieves a <see cref="User"/> from the database with the given <see cref="User.Username"/>.
        /// </summary>
        /// <param name="key">The username</param>
        /// <returns>An awaitable optional user</returns>
        public async Task<Option<User>> Get(string key)
        {
            var sql = @"SELECT ID, FirstName, LastName, Email, Username, RoleID AS Role
                        FROM Users
                        WHERE Username = @key";

            var entity = await connection.QueryAsync<User>(sql, new { key });

            return entity
                    .SingleOrDefault()
                    .SomeWhen(u => u != null && u.ID > 0);
        }

        /// <summary>
        /// Retrieves a collection of <see cref="User"/>s ordered by <see cref="User.Username"/> in ascending order.
        /// </summary>
        /// <param name="skip">The number of users to skip</param>
        /// <param name="take">The number of users to take</param>
        /// <returns>An awaitable list of users</returns>
        public async Task<List<User>> Get(int skip, int take)
        {
            var sql = @"SELECT ID, FirstName, LastName, Email, Username, RoleID AS Role
                        FROM
                        (
                            SELECT tmp.*, ROW_NUMBER() OVER (ORDER BY Username ASC) AS 'RowNumber'
                            FROM Users as tmp
                        ) AS seq
                        WHERE seq.RowNumber BETWEEN @From AND @To";

            var result = await connection.QueryAsync<User>(sql, new
            {
                From = skip + 1,
                Take = (skip + take)
            });

            return result.ToList();
        }

        /// <summary>
        /// Retrieves every <see cref="User"/> in the database.
        /// </summary>
        /// <returns>An awaitable list of users.</returns>
        public async Task<List<User>> GetAll()
        {
            var sql = @"SELECT ID, FirstName, LastName, Email, Username, RoleID as Role
                        FROM Users";

            var result = await connection.QueryAsync<User>(sql);
            return result.ToList();
        }

        /// <summary>
        /// Retrieves a user by its <see cref="User.ID"/>.
        /// </summary>
        /// <param name="id">The user ID</param>
        /// <returns>An awaitable optional user</returns>
        public async Task<Option<User>> GetByID(int id)
        {
            var sql = @"SELECT ID, FirstName, LastName, Email, Username, RoleID AS Role
                        FROM Users
                        WHERE ID = @id";
            var result = (await connection.QueryAsync<User>(sql, new { id })).SingleOrDefault();
            return result.SomeWhen(u => u != null && u.ID > 0);
        }

        /// <summary>
        /// Updates a <see cref="User"/> with the given <see cref="User.Username"/>.
        /// Cannot update the ID of the user.
        /// </summary>
        /// <param name="key">The username of the user</param>
        /// <param name="entity">The updated user information</param>
        /// <returns>An awaitable optional boolean value</returns>
        public async Task<bool> Update(string key, User entity)
        {
            var sql = @"UPDATE Users SET
                            FirstName = @FirstName,
                            LastName = @LastName,
                            Email = @Email,
                            Username = @Username,
                            RoleID = @Role
                        WHERE Username = @key";

            var result = await connection.ExecuteAsync(sql, new
            {
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                Username = entity.Username,
                RoleID = entity.Role,
                key
            });

            return result == 1;
        }

        /// <summary>
        /// A protected dispose method for the dispose pattern.
        /// </summary>
        /// <param name="disposing">Indicates whether to dispose this resource</param>
        protected virtual void Dispose(bool disposing)
        {
            lock(locking)
            {
                if(disposed)
                {
                    return;
                }

                if(disposing)
                {
                    if(connection != null)
                    {
                        connection.Dispose();
                        disposed = true;
                    }
                }
            }
        }

        /// <summary>
        /// Implementation of the dispose pattern.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
        }
    }
}
