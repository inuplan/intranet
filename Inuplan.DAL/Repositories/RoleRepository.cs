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
    using System.Diagnostics;
    using Dapper;
    using Common.Tools;
    using System;
    using Common.Logger;
    using Common.Factories;

    public class RoleRepository : IScalarRepository<int, Role>
    {

        private bool disposedValue = false;
        private readonly ILogger<RoleRepository> logger;
        private readonly IConnectionFactory connectionFactory;

        public RoleRepository(
            IConnectionFactory connectionFactory,
            ILogger<RoleRepository> logger
        )
        {
            this.connectionFactory = connectionFactory;
            this.logger = logger;
        }

        public async Task<Option<Role>> Create(Role entity, Func<Role, Task<bool>> onCreate, params object[] identifiers)
        {
            Debug.Assert(entity != null, "Must have valid object to create");
            logger.Begin();
            try
            {
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sql = @"INSERT INTO Roles (Name) Values (@Name);SELECT ID FROM Roles WHERE ID = @@IDENTITY;";
                    entity.ID = await connection.ExecuteScalarAsync<int>(sql, new
                    {
                        Name = entity.Name
                    }, transaction);

                    var result = entity.SomeWhen(e => e.ID > 0);
                    var continuation = await onCreate(entity);
                    if (result.HasValue && continuation)
                    {
                        logger.Trace("Created role: {0} {1}", entity.ID, entity.Name);
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not create role {0}", entity.Name);
                        transaction.Rollback();
                    }

                    logger.End();
                    return result;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<bool> Delete(int key, Func<int, Task> onDelete)
        {
            Debug.Assert(key > 0, "Must be a valid key");
            logger.Begin();
            try
            {
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sql = @"DELETE FROM Roles WHERE ID = @key;";
                    var rows = await connection.ExecuteAsync(sql, new
                    {
                        key = key
                    }, transaction);

                    var result = rows == 1;
                    if (result)
                    {
                        await onDelete(key);
                        logger.Trace("Deleted role {0}", key);
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not delete role: {0}", key);
                        transaction.Rollback();
                    }

                    logger.End();
                    return result;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<Option<Role>> Get(int key)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    var sql = @"SELECT ID, Name FROM Roles WHERE ID = @key";
                    var result = await connection.QuerySingleOrDefaultAsync<Role>(sql, new { key });

                    logger.End();
                    return result.SomeWhen(r => r != null && r.ID > 0);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<List<Role>> GetAll(params object[] identifiers)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    var sql = @"SELECT * FROM Roles;";
                    var result = await connection.QueryAsync<Role>(sql);

                    logger.End();
                    return result.ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public Task<Option<Role>> GetByID(int id)
        {
            return Get(id);
        }

        public async Task<Pagination<Role>> GetPage(int skip, int take, Func<string> sortBy = null, Func<string> orderBy = null, params object[] identifiers)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    sortBy = sortBy ?? new Func<string>(() => "ID");
                    orderBy = orderBy ?? new Func<string>(() => "ASC");

                    var sql = @"SELECT ID, Name FROM
                                    (SELECT ID, Name, Row_Number() OVER (ORDER BY @Sort @Order) AS rownumber
                                    FROM Roles) AS seq
                                WHERE seq.rownumber BETWEEN @From AND @To;";
                    var query = sql.Replace(@"@Sort", sortBy())
                                   .Replace(@"@Order", orderBy());

                    var roles = await connection.QueryAsync<Role>(query, new
                    {
                        From = skip + 1,
                        To = skip + take,
                    });

                    var total = await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Roles;");

                    logger.End();
                    return Helpers.Paginate(skip, take, total, roles.ToList());
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        public async Task<bool> Update(int key, Role entity)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sql = @"UPDATE Roles SET Name = @Name WHERE ID=@ID";
                    var rows = await connection.ExecuteAsync(sql, new { Name = entity.Name, ID = key }, transaction);
                    var success = rows == 1;

                    if(success)
                    {
                        logger.Trace("Succesfully updated role: {0}", key);
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not update role {0}", key);
                        transaction.Rollback();
                    }

                    logger.End();
                    return success;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
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
