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
            using(var userRepository = new UserDatabaseRepository(connection))
            using (var roleRepository = new RoleRepository(connection))
            {
                // To create a USER you MUST first have already created a ROLE!
                var role = new Role { Name = "User" };
                var createdRole = roleRepository.Create(role).Result;

                createdRole.Match(r =>
                {
                    var user = new User
                    {
                        Email = "jdoe@corp.com",
                        FirstName = "John",
                        LastName = "Doe",
                        Roles = new List<Role> { r },
                        Username = "jdoe"
                    };

                    var created = userRepository.Create(user).Result;
                    Assert.True(created.HasValue);
                },
                () =>
                {
                    Assert.True(false, "Role has not been created!");
                });

            }
        }
    }
}
