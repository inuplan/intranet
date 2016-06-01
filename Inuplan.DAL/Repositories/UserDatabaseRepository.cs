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
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Transactions;

    /// <summary>
    /// Repository for <see cref="User"/>s in the database.
    /// Can do CRUD operations.
    /// </summary>
    public class UserDatabaseRepository : IScalarRepository<string, User>
    {
        /// <summary>
        /// The logging framework
        /// </summary>
        private static Logger Logger = LogManager.GetCurrentClassLogger();

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
            locking = new object();
        }

        /// <summary>
        /// Creates a <see cref="User"/> entity with the given information.
        /// </summary>
        /// <param name="entity">The user entity</param>
        /// <returns>Returns an awaitable optional user</returns>
        public async Task<Option<User>> Create(User entity, params object[] identifiers)
        {
            try
            {
                Debug.Assert(entity.Roles != null && entity.Roles.Any(), "Must define an existing role for this user!");
                Debug.Assert(entity.Roles.All(r => r.ID > 0), "A role must already be created in the database before creating the user");
                entity.ID = 0;

                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    // Create user
                    var sqlUser = @"INSERT INTO Users (Username, FirstName, LastName, Email, DisplayName)
                        VALUES (@Username, @FirstName, @LastName, @Email, @DisplayName);
                        SELECT ID FROM Users WHERE ID = @@IDENTITY";

                    entity.ID = await connection.ExecuteScalarAsync<int>(sqlUser, new
                    {
                        Username = entity.Username,
                        FirstName = entity.FirstName,
                        LastName = entity.LastName,
                        Email = entity.Email,
                        DisplayName = entity.DisplayName,
                    });

                    // Set role for user
                    var sqlRole = @"INSERT INTO UserRoles (UserID, RoleID)
                                VALUES(@UserID, @RoleID);";
                    var roles = entity.Roles.Select(r => new { UserID = entity.ID, RoleID = r.ID }).ToArray();
                    var created = await connection.ExecuteAsync(sqlRole, roles);

                    var result = entity.SomeWhen(u => u.ID > 0 && created > 0);

                    // On success commit
                    if (result.HasValue)
                    {
                        transactionScope.Complete();
                    }

                    return result;
                }
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes a <see cref="User"/> from the database with the given key.
        /// </summary>
        /// <param name="key">The ID of the user</param>
        /// <returns>An awaitable optional boolean value, indicating whether the operation was succesfull</returns>
        public async Task<bool> Delete(string key)
        {
            try
            {
                Debug.Assert(!string.IsNullOrEmpty(key), "Must have a valid username");
                var sql = @"DELETE FROM Users WHERE Username = @key";
                var rows = await connection.ExecuteAsync(sql, new { key });
                return rows == 1;
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Retrieves a <see cref="User"/> from the database with the given <see cref="User.Username"/>.
        /// </summary>
        /// <param name="key">The username</param>
        /// <returns>An awaitable optional user</returns>
        public async Task<Option<User>> Get(string key)
        {
            try
            {
                var sqlUser = @"SELECT ID, FirstName, LastName, Email, Username, DisplayName
                        FROM Users
                        WHERE Username = @key";

                var entity = (await connection.QueryAsync<User>(sqlUser, new { key }))
                            .SingleOrDefault();

                var result = Option.None<User>();

                if (entity != null)
                {
                    var sqlRoles = @"SELECT role.ID, role.Name
                            FROM Roles role INNER JOIN UserRoles u
                            ON role.ID = u.RoleID
                            WHERE UserID = @ID";

                    var roles = await connection.QueryAsync<Role>(sqlRoles, new
                    {
                        ID = entity.ID
                    });

                    entity.Roles = roles.ToList();
                    result = entity.Some();
                }

                return result;
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Retrieves a collection of <see cref="User"/>s ordered by <see cref="User.Username"/> in ascending order.
        /// Does not retrieve the roles.
        /// </summary>
        /// <param name="skip">The number of users to skip</param>
        /// <param name="take">The number of users to take</param>
        /// <returns>An awaitable list of users</returns>
        public async Task<Pagination<User>> GetPage(int skip, int take, params object[] identifiers)
        {
            try
            {
                var sql = @"SELECT ID, FirstName, LastName, Email, Username, DisplayName
                        FROM
                        (
                            SELECT tmp.*, ROW_NUMBER() OVER (ORDER BY Username ASC) AS 'RowNumber'
                            FROM Users AS tmp
                        ) AS seq
                        WHERE seq.RowNumber BETWEEN @From AND @To";

                var result = (await connection.QueryAsync<User>(sql, new
                {
                    From = skip + 1,
                    To = (skip + take)
                }));

                var roleSql = @"SELECT u.ID, r.ID, Name FROM Roles r
                            INNER JOIN UserRoles ur
                            ON r.ID = ur.RoleID
                            INNER JOIN Users u
                            ON u.ID = ur.UserID";


                var roles = await connection.QueryAsync<int, Role, Tuple<int, Role>>(
                    roleSql,
                    (id, role) => new Tuple<int, Role>(id, role));

                var group = roles.GroupBy(t => t.Item1);
                foreach (var g in group)
                {
                    var userRoles = g.Select(r => r.Item2);
                    var user = result.Single(u => u.ID == g.Key);
                    user.Roles = userRoles.ToList();
                }


                var totalSql = @"SELECT COUNT(*) FROM Users";
                var total = await connection.ExecuteScalarAsync<int>(totalSql);

                var page = Helpers.Paginate(skip, take, total, result.ToList());
                return page;
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Retrieves every <see cref="User"/> in the database.
        /// Does not retrieve the roles.
        /// </summary>
        /// <returns>An awaitable list of users.</returns>
        public async Task<List<User>> GetAll(params object[] identifiers)
        {
            try
            {
                var sql = @"SELECT ID, FirstName, LastName, Email, Username, DisplayName
                        FROM Users";

                var result = await connection.QueryAsync<User>(sql);
                return result.ToList();
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Retrieves a user by its <see cref="User.ID"/>.
        /// </summary>
        /// <param name="id">The user ID</param>
        /// <returns>An awaitable optional user</returns>
        public async Task<Option<User>> GetByID(int id)
        {
            try
            {
                var sql = @"SELECT ID, FirstName, LastName, Email, Username, DisplayName
                        FROM Users
                        WHERE ID = @id";

                var result = (await connection.QueryAsync<User>(sql, new { id })).SingleOrDefault();
                if (result != null)
                {
                    var sqlRoles = @"SELECT role.ID, role.Name
                            FROM Roles role INNER JOIN UserRoles u
                            ON role.ID = u.RoleID
                            WHERE UserID = @ID";

                    var roles = await connection.QueryAsync<Role>(sqlRoles, new
                    {
                        ID = result.ID
                    });

                    result.Roles = roles.ToList();
                }

                return result.SomeWhen(u => u != null && u.ID > 0);
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
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
            try
            {
                var sql = @"UPDATE Users SET
                            FirstName = @FirstName,
                            LastName = @LastName,
                            Email = @Email,
                            Username = @Username,
                            DisplayName = @DisplayName
                        WHERE Username = @key";

                var result = await connection.ExecuteAsync(sql, new
                {
                    FirstName = entity.FirstName,
                    LastName = entity.LastName,
                    Email = entity.Email,
                    Username = entity.Username,
                    DisplayName = entity.DisplayName,
                    key,
                });

                return result == 1;
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
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
