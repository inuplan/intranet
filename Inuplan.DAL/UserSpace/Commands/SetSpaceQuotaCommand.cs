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

namespace Inuplan.DAL.UserSpace.Commands
{
    using Common.Commands;
    using Common.Logger;
    using Dapper;
    using System.Data;
    using System.Data.SqlClient;
    using System.Threading.Tasks;
    using System.Transactions;

    public class SetSpaceQuotaCommand : ISetSpaceQuota
    {
        private readonly IDbConnection connection;
        private readonly ILogger<SetSpaceQuotaCommand> logger;

        public SetSpaceQuotaCommand(
            IDbConnection connection,
            ILogger<SetSpaceQuotaCommand> logger
        )
        {
            this.connection = connection;
            this.logger = logger;
        }

        public async Task<bool> SetSpaceQuota(int userId, int quotaKb)
        {
            try
            {
                logger.Debug("Method: SetSpaceQuota. BEGIN");
                using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sql = @"INSERT INTO UserSpaceQuota (SpaceQuotaKB) VALUES (@SpaceQuotaKB) WHERE UserID = @UserID";
                    var result = await connection.ExecuteAsync(sql, new
                    {
                        SpaecQuotaKB = quotaKb,
                        UserID = userId
                    });

                    var success = result == 1;
                    if(success)
                    {
                        transactionScope.Complete();
                    }

                    logger.Debug("Method: SetSpaceQuota. END");
                    return success;
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
