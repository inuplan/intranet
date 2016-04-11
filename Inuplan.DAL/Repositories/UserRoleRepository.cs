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

    public class UserRoleRepository : IScalarRepository<int, User>
    {
        private readonly IDbConnection connection;

        private bool disposedValue = false;

        public UserRoleRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public async Task<Option<User>> Create(User entity, params object[] identifiers)
        {
            // Identifiers are a list of IDs for the role
            var args = identifiers.Cast<int>().Select(roleID => new
            {
                UserID = entity.ID,
                RoleID = roleID,
            }).ToArray();
            Debug.Assert(args.All(arg => arg.RoleID > 0), "Must have valid roles!");

            // Create users roles
            var sql = @"INSERT INTO UserRoles (UserID, RoleID) VALUES(@UserID, @RoleID);";
            var rows = await connection.ExecuteAsync(sql, args);
            var createdRoles = rows == args.Length;

            // Construct object with the roles
            var roleSql = @"SELECT ID, Name FROM Roles WHERE ID=@RoleID";
            var roles = await connection.QueryAsync<Role>(roleSql);
            entity.Roles = roles.ToList();

            // Return constructed object
            return entity.SomeWhen(u => createdRoles);
        }

        public async Task<bool> Delete(int key)
        {
            using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var sql = @"DELETE FROM UserRoles WHERE UserID = @key;";
                var rows = await connection.ExecuteAsync(sql, new { key });
                var done = rows == 1;
                if(done)
                {
                    transactionScope.Complete();
                }

                return done;
            }
        }

        public async Task<Option<User>> Get(int key)
        {
            var sql = @"SELECT ID, Name
                        FROM Roles r INNER JOIN UserRoles u
                        ON u.RoleID=r.ID
                        WHERE u.UserID=@key;";

            var userSql = @"SELECT ID, Name, FirstName, LastName, Email
                            FROM Users
                            WHERE ID=@key;";

            var roles = await connection.QueryAsync<Role>(sql, new { key });
            var user = await connection.ExecuteScalarAsync<User>(userSql, new { key });

            var result = user
                            .SomeNotNull()
                            .Map(u =>
                            {
                                u.Roles = roles.ToList();
                                return u;
                            });
            return result;
        }

        public Task<List<User>> GetAll(params object[] identifiers)
        {
            throw new NotSupportedException("Use UserRepository perhaps OR RoleRepository!");
        }

        public Task<Option<User>> GetByID(int id)
        {
            throw new NotSupportedException("Use UserRepository OR RoleRepository!");
        }

        public Task<Pagination<User>> GetPage(int skip, int take, params object[] identifiers)
        {
            throw new NotSupportedException("User UserRepository OR RoleRepository!");
        }

        public async Task<bool> Update(int key, User entity)
        {
            Debug.Assert(entity.Roles.All(r => r.ID > 0), "Must have valid roles to update!");
            using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var roleIds = entity.Roles.Select(r => r.ID).ToArray();

                // An update is essentially a delete with create!
                var delete = await Delete(key);
                var create = await Create(entity, roleIds);
                var success = delete && create.HasValue;

                if(success)
                {
                    transactionScope.Complete();
                }

                return success;
            }
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

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }
    }
}
