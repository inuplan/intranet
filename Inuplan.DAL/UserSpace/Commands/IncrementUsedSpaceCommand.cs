namespace Inuplan.DAL.UserSpace.Commands
{
    using Common.Commands;
    using Common.Logger;
    using System.Data;
    using System.Data.SqlClient;
    using System.Threading.Tasks;
    using Dapper;
    using System.Transactions;

    public class IncrementUsedSpaceCommand : IIncrementUsedSpace
    {
        private readonly IDbConnection connection;
        private readonly ILogger<IncrementUsedSpaceCommand> logger;

        public IncrementUsedSpaceCommand(
            IDbConnection connection,
            ILogger<IncrementUsedSpaceCommand> logger
        )
        {
            this.connection = connection;
            this.logger = logger;
        }

        public async Task<bool> IncrementUsedSpace(int userId, int usedSpaceKb)
        {
            try
            {
                logger.Debug("Method: IncrementUsedSpace. BEGIN");
                using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sql = @"UPDATE UserSpaceQuota SET UsedSpaceKB = UsedSpaceKB + @UsedSpaceKB WHERE UserID = @UserID";

                    var result = await connection.ExecuteAsync(sql, new
                    {
                        UsedSpaceKB = usedSpaceKb,
                        UserID = userId
                    });

                    var success = result == 1;
                    if(success)
                    {
                        transactionScope.Complete();
                        logger.Trace("Incremented used space by {0} for user {1}", usedSpaceKb, userId);
                    }

                    logger.Debug("Method: IncrementUsedSpace. END");
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
