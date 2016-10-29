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

namespace Inuplan.DAL.UserSpace.Queries
{
    using Common.Queries.UserSpaceInfoQueries;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.Models;
    using Optional;
    using Dapper;
    using System.Data.SqlClient;
    using System.Data;
    using Common.Logger;
    using System.Transactions;

    public class GetUserSpaceInfoQuery : IGetUserSpaceInfo
    {
        private readonly IDbConnection connection;
        private readonly ILogger<GetUserSpaceInfoQuery> logger;

        public GetUserSpaceInfoQuery(
            IDbConnection connection,
            ILogger<GetUserSpaceInfoQuery> logger)
        {
            this.connection = connection;
            this.logger = logger;
        }

        public async Task<Option<UserSpaceInfo>> GetUserSpaceInfo(int userId)
        {
            try
            {
                using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sql = @"SELECT UserID AS ID, FirstName, LastName, Username, Email, DisplayName,
                                UsedSpaceKB, SpaceQuotaKB
                                FROM Users u INNER JOIN UserSpaceQuota q
                                ON u.ID = q.UserID
                                WHERE q.UserID = @UserID";

                    var query = await connection.QueryAsync<User, UserSpaceInfo, UserSpaceInfo>(sql, (u, q) =>
                    {
                        q.User = u;
                        return q;
                    }, new
                    {
                        UserID = userId
                    });

                    var result = query
                        .SomeWhen(r => r.Count() == 1)
                        .Map(r => r.Single());

                    if(result.HasValue)
                    {
                        transactionScope.Complete();
                    }

                    return result;
                }
            }
            catch (SqlException ex)
            {
                logger.Error(ex);
                throw;
            }
        }
    }
}
