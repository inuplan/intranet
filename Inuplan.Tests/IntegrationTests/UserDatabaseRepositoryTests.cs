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
    
    public class UserDatabaseRepositoryTests
    {
        [Fact]
        public void CreateUser()
        {
            var connectionString = ConfigurationManager.AppSettings["localConnection"];
            using (IDbConnection connection = new SqlConnection(connectionString))
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            using(var repository = new UserDatabaseRepository(connection))
            {
                // To create a USER you MUST first have already created a ROLE!
                var user = new User
                {
                    Email = "jdoe@corp.com",
                    FirstName = "John",
                    LastName = "Doe",
                    Roles = new List<Role> { new Role { Name = "User" } },
                    Username = "jdoe"
                };

                var created = repository.Create(user).Result;
                Assert.True(created.HasValue);
            }
        }
    }
}
