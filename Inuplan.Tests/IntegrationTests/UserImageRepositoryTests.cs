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

namespace Inuplan.Tests.IntegrationTests
{
    using Common.Models;
    using DAL.Repositories;
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
    using Optional.Unsafe;

    public class UserImageRepositoryTests
    {
        [Fact]
        public void CreateImage()
        {
            var connectionString = ConfigurationManager.AppSettings["localConnection"];
            using (IDbConnection connection = new SqlConnection(connectionString))
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            using (var imageRepository = new UserImageRepository(connection))
            using (var userRepository = new UserDatabaseRepository(connection))
            using (var roleRepository = new RoleRepository(connection))
            {
                var image = new Image
                {
                    Description = "My description",
                    Filename = "test",
                    Extension = "jpg",
                    MimeType = "application/jpg",
                    Original = new FileInfo { Data = new Lazy<byte[]>(() => new byte[5]), Path = @"c:\tmp\original.jpg" },
                    Preview = new FileInfo { Data = new Lazy<byte[]>(() => new byte[5]), Path = @"c:\tmp\preview.jpg" },
                    Thumbnail = new FileInfo { Data = new Lazy<byte[]>(() => new byte[5]), Path = @"c:\tmp\thumbnail.jpg" },
                };

                // User ID = 2
                var roleCreate = roleRepository.Create(new Role { Name = "User" }, _ => Task.FromResult(0)).Result;
                var userCreate = userRepository.Create(new User
                {
                    Username = "jdoe",
                    Email = "jdoe@corp.com",
                    FirstName = "John",
                    LastName = "Doe",
                    Roles = new List<Role> { roleCreate.ValueOrFailure() },
                }, _ => Task.FromResult(0)).Result;
                var created = imageRepository.Create(image, _ => Task.FromResult(0), userCreate.ValueOrFailure().ID).Result;
                Assert.True(created.HasValue, "Image is not created");
            }
        }
    }
}
