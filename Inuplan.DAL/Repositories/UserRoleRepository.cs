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
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Optional;
    using System.Data;
    using System.Linq;
    using Dapper;
    using System.Diagnostics;

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
            var args = identifiers.Cast<int>().Select(roleID => new
            {
                UserID = entity.ID,
                RoleID = roleID,
            }).ToArray();
            Debug.Assert(args.All(arg => arg.RoleID > 0), "Must have valid roles!");

            // Create users roles
            var sql = @"INSERT INTO UserRoles (UserID, RoleID) VALUES(@UserID, @RoleID);";
            var rows = await connection.ExecuteAsync(sql, args);

            // Construct object with the roles

            // Return constructed object
            throw new NotImplementedException();
        }

        public Task<bool> Delete(int key)
        {
            throw new NotImplementedException();
        }

        public Task<Option<User>> Get(int key)
        {
            throw new NotImplementedException();
        }

        public Task<List<User>> GetAll(params object[] identifiers)
        {
            throw new NotImplementedException();
        }

        public Task<Option<User>> GetByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Pagination<User>> GetPage(int skip, int take, params object[] identifiers)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(int key, User entity)
        {
            throw new NotImplementedException();
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
