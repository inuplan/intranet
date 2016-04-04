using Inuplan.Common.Models;
using Inuplan.DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Xunit;

namespace Inuplan.Tests.IntegrationTests
{
    public class RoleRepositoryTests
    {
        [Theory]
        [InlineData("User")]
        [InlineData("Admin")]
        public void CreateRole(string name)
        {
            var connectionString = ConfigurationManager.AppSettings["localConnection"];
            using (IDbConnection connection = new SqlConnection(connectionString))
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            using (var repository = new RoleRepository(connection))
            {
                var role = new Role
                {
                    Name = name
                };

                var created = repository.Create(role).Result;

                Assert.True(created.HasValue, "Role has not been created!");
                // The command is never committed to database
                // transactionScope.Complete();
            }
        }
    }
}
