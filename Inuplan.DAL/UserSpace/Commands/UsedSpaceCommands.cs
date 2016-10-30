namespace Inuplan.DAL.UserSpace.Commands
{
    using Common.Commands;
    using Common.Logger;
    using System.Data;
    using System.Threading.Tasks;
    using Dapper;
    using System.Transactions;
    using System.Linq;
    using System;

    public class UsedSpaceCommands : IUsedSpaceCommands
    {
        private readonly IDbConnection connection;
        private readonly ILogger<UsedSpaceCommands> logger;

        public UsedSpaceCommands(
            IDbConnection connection,
            ILogger<UsedSpaceCommands> logger
        )
        {
            this.connection = connection;
            this.logger = logger;
        }

        public Task<bool> DecrementUsedSpace(int userId, int decrementedSpaceKB)
        {
            logger.Debug("Method: DecrementUsedSpace. BEGIN");
            var result = IncrementUsedSpace(userId, -decrementedSpaceKB);
            logger.Debug("Method: DecrementUsedSpace. END");
            return result;
        }

        public async Task<bool> IncrementUsedSpace(int userId, int usedSpaceKb)
        {
            try
            {
                logger.Debug("Method: IncrementUsedSpace. BEGIN");
                using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sqlGetFreeSpace = @"SELECT UsedSpaceKB AS Item1, SpaceQuotaKB AS Item2 FROM UserSpaceQuota WHERE UserID = @UserID";
                    var table = await connection.QueryAsync(sqlGetFreeSpace, new
                    {
                        UserID = userId
                    });

                    var sql = @"UPDATE UserSpaceQuota SET UsedSpaceKB = UsedSpaceKB + @UsedSpaceKB WHERE UserID = @UserID";

                    var result = await connection.ExecuteAsync(sql, new
                    {
                        UsedSpaceKB = usedSpaceKb,
                        UserID = userId
                    });

                    var row = table.Single();
                    int totalSpace = row.Item1;
                    int quota = row.Item2;

                    bool allowed = (totalSpace + usedSpaceKb) <= quota;
                    logger.Info("Is allowed: {0}", allowed);

                    var success = result == 1 && allowed;
                    if(success)
                    {
                        transactionScope.Complete();
                        logger.Trace("Incremented used space by {0} for user {1}", usedSpaceKb, userId);
                    }

                    logger.Debug("Method: IncrementUsedSpace. END");
                    return success;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
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
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }
    }
}
