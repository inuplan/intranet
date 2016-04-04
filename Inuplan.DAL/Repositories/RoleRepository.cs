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
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Optional;
    using System.Data;
    using System.Diagnostics;
    using Dapper;
    using Common.Tools;

    public class RoleRepository : IScalarRepository<int, Role>
    {
        private readonly IDbConnection connection;

        private bool disposedValue = false;

        public RoleRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public async Task<Option<Role>> Create(Role entity, params object[] identifiers)
        {
            Debug.Assert(entity != null, "Must have valid object to create");
            var sql = @"INSERT INTO Roles (Name) Values (@Name);SELECT ID FROM Roles WHERE ID = @@IDENTITY;";
            entity.ID = await connection.ExecuteScalarAsync<int>(sql, entity);

            return entity.SomeWhen(e => e.ID > 0);
        }

        public async Task<bool> Delete(int key)
        {
            Debug.Assert(key > 0, "Must be a valid key");
            var sql = @"DELETE FROM Roles WHERE ID = @key;";
            var rows = await connection.ExecuteAsync(sql, key);

            return rows == 1;
        }

        public async Task<Option<Role>> Get(int key)
        {
            var sql = @"SELECT ID, Name FROM Roles WHERE ID = @key";
            var result = await connection.ExecuteScalarAsync<Role>(sql, new { key });
            return result.SomeWhen(r => r != null && r.ID > 0);
        }

        public async Task<List<Role>> GetAll(params object[] identifiers)
        {
            var sql = @"SELECT * FROM Roles;";
            var result = await connection.QueryAsync<Role>(sql);
            return result.ToList();
        }

        public Task<Option<Role>> GetByID(int id)
        {
            return Get(id);
        }

        public async Task<Pagination<Role>> GetPage(int skip, int take, params object[] identifiers)
        {
            var sql = @"SELECT ID, Name FROM
                            (SELECT ID, Name, Row_Number() OVER (ORDER BY ID) AS rownumber
                            FROM Roles) AS seq
                        WHERE seq.rownumber BETWEEN @From AND @To;";

            var roles = await connection.QueryAsync<Role>(sql, new
            {
                From = skip + 1,
                To = skip + take,
            });

            var total = await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Roles;");

            return Helpers.Pageify(skip, take, total, roles.ToList());
        }

        public async Task<bool> Update(int key, Role entity)
        {
            var sql = @"UPDATE Roles SET Name = @Name WHERE ID=@ID";
            var rows = await connection.ExecuteAsync(sql, new { Name = entity.Name, ID = key });
            return rows == 1;
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
