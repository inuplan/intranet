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

namespace Inuplan.Tests.WebAPI.Middlewares
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Inuplan.WebAPI.Middlewares.JWT;
    using Xunit;
    using System.Security.Cryptography;
    using Common.Tools;
    using Common.DTOs;
    using Jose;
    using Microsoft.Owin;
    using Common.Mappers;
    using Moq;
    using Common.Models;
    using Optional;
    using Common.Repositories;    /// <summary>
                                  /// Tests the <see cref="JWTClaimsRetriever"/> middleware.
                                  /// </summary>
    public class JWTClaimsRetrieverTests
    {
        /// <summary>
        /// Tests if a <code>JWT</code> token has been processed correctly.
        /// Given that the token has proper credentials.
        /// </summary>
        [Fact]
        public async void Test_If_JWT_Is_Processed()
        {
            // Arrange - JWT with correct key
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes("secret"));

            // Implicit assumption: valid claim MUST contain a username!
            var claims = new ClaimsDTO { Verified = true, Username = "jdoe" };
            var token = JWT.Encode(claims, key, JwsAlgorithm.HS256);

            var environment = createOwinEnvironment(token);
            var usersAD = new List<User>();

            // Arrange - mock behavior for Active Directory
            var activeDirectoryRepository = new Mock<IRepository<string, User>>();
            activeDirectoryRepository
                // When calling "Get" method
                .Setup(ad => ad.Get(It.IsAny<string>()))
                .Callback<string>(u =>
                {
                    var jdoe = new User
                    {
                        Email = "jdoe@corp.org",
                        FirstName = "John",
                        LastName = "Doe",
                        Username = u
                    };

                    usersAD.Add(jdoe);
                })

                // Return the user
                .Returns((string n) => Task.FromResult(usersAD.Single(u => (u.Username == n)).Some()));

            // Arrange - mock behavior for SQL database
            var usersDB = new List<User>();
            var idCounterDB = 0;
            var sqlRepository = new Mock<IRepository<string, User>>();
            sqlRepository
                .Setup(db => db.Create(It.IsAny<User>()))
                .Callback<User>(u =>
                {
                    // Increment ID counter
                    idCounterDB++;

                    // Set user id to the
                })

            var opt = new JWTClaimsRetrieverOptions
            {
                Mapper = new NewtonsoftMapper(),
                Secret = key,
                UserActiveDirectoryRepository = null, // mock?
                UserDatabaseRepository = null // mock!
            };
            // Note: Proper design, the options should not have a variable "Domain", instead it should
            // have a reference to either a PrincipalContext or UserPrincipal
            // Better yet: make an interface for UserPrincipal and use that instead + mock that
            // var opt = new JWTClaimsRetrieverOptions { Secret = key, Domain = "local", Mapper = new NewtonsoftMapper(), UserDatabaseRepository = null };
        }

        /// <summary>
        /// Helper method, which constructs an owin environment and inserts
        /// the given token into the owin dictionary.
        /// </summary>
        /// <param name="token">The JWT token</param>
        /// <returns>A dictionary containing the token</returns>
        private IDictionary<string, object> createOwinEnvironment(string token)
        {
            var ctx = new OwinContext();
            ctx.Request.Headers.Add("Authorization", new string[] { string.Format("Bearer {0}", token) });
            return ctx.Environment;
        }
    }
}
