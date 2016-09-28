namespace Inuplan.DAL.ForumPost.Commands
{
    using Common.Commands;
    using System.Threading.Tasks;
    using Common.Models;
    using System.Data;
    using Dapper;
    using System.Transactions;

    public class MarkPost : IMarkPost
    {
        private readonly IDbConnection connection;

        public MarkPost(IDbConnection connection)
        {
            this.connection = connection;
        }

        public async Task<bool> ReadPost(User user, int postId)
        {
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var sql = @"INSERT INTO ThreadUserViews
                            (ThreadID, UserID)
                            VALUES (@ThreadID, @UserID)";
                var result = await connection.ExecuteAsync(sql, new
                {
                    ThreadID = postId,
                    UserID = user.ID
                });

                var success = result == 1;
                if(success)
                {
                    transactionScope.Complete();
                }

                return success;
            }
        }

        public async Task<bool> UnreadPost(User user, int postId)
        {
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var sql = @"DELETE FROM ThreadUserViews WHERE ThreadID = @ThreadID AND UserID = @UserID";
                var result = await connection.ExecuteAsync(sql, new
                {
                    ThreadID = postId,
                    UserID = user.ID
                });

                var success = result == 1;
                if (success) transactionScope.Complete();

                return success;
            }
        }
    }
}
