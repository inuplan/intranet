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
    using Common.DTOs;
    using Common.Mappers;
    using Common.Models;
    using Common.Repositories;    
    using Common.Tools;
    using Inuplan.WebAPI.Middlewares.JWT;
    using Jose;
    using Microsoft.Owin;
    using Moq;
    using Optional;
    using Optional.Unsafe;
    using System.Collections.Generic;
    using System.Security.Cryptography;
    using System.Threading.Tasks;
    using Xunit;

    /// <summary>
    /// Tests the <see cref="JWTClaimsRetriever"/> middleware.
    /// </summary>
    public class JWTClaimsRetrieverTests
    {
        /// <summary>
        /// Tests if Claims has been filled out correctly, given that the claims have not been verified.
        /// A claim can be verified or not.
        /// A claim can contain a given role or not.
        /// 
        /// Assumptions:
        /// 1. A claim must contain a username to be well-formed
        /// 2. The user exists in active directory
        /// 3. The user does not exist in the sql database
        /// 4. This is the first run from the user
        /// 
        /// Side-effects:
        /// 1. A claim with no roles given, will be given the <see cref="RoleType.User"/> upon creation.
        /// 
        /// </summary>
        /// <param name="userRole">The starting role, which should be in the claims</param>
        /// <param name="expected">The expected result, which Role the claims should be filled out with</param>
        [Theory]
        [InlineData(RoleType.None, RoleType.User)]
        [InlineData(RoleType.Administrator, RoleType.Administrator)]
        [InlineData(RoleType.Editor, RoleType.Editor)]
        [InlineData(RoleType.Management, RoleType.Management)]
        [InlineData(RoleType.User, RoleType.User)]
        public async void Test_If_Unverified_Claims_Produce_A_Proper_Role(RoleType userRole, RoleType expected)
        {
            // Arrange - JWT
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes("secret"));
            var claims = new ClaimsDTO { Verified = false, Username = "jdoe", Role = userRole };
            var token = JWT.Encode(claims, key, JwsAlgorithm.HS256);
            var environment = createOwinEnvironment(token, claims);

            // Arrange - mock behavior for Active Directory "Get" method
            var activeDirectoryRepository = new Mock<IRepository<string, User>>();
            var jdoe = new User();
            activeDirectoryRepository
                .Setup(ad => ad.Get(It.IsAny<string>()))
                .Callback<string>(u =>
                {
                    jdoe.Email = "jdoe@corp.org";
                    jdoe.FirstName = "John";
                    jdoe.LastName = "Doe";
                    jdoe.Username = u;
                })

                // Return the user
                .Returns(Task.FromResult(jdoe.Some()));

            // Arrange - mock behavior for SQL database "Create" method
            var usersDB = new List<User>();
            var sqlRepository = new Mock<IRepository<string, User>>();
            sqlRepository
                .Setup(db => db.Create(It.IsAny<User>()))
                .Callback<User>(u =>
                {
                    // Set user ID
                    u.ID = 1;

                    // Save user in the list
                    usersDB.Add(u);
                })
                .Returns((User u) => Task.FromResult(u.Some()));

            // Arrange - options class
            var opt = new JWTClaimsRetrieverOptions
            {
                Mapper = new NewtonsoftMapper(),
                Secret = key,
                UserActiveDirectoryRepository = activeDirectoryRepository.Object, 
                UserDatabaseRepository = sqlRepository.Object 
            };

            // Test subject
            var nextClaim = Option.None<ClaimsDTO>();
            var claimsMiddleware = new JWTClaimsRetriever(async n =>
            {
                var c = (IOwinContext)(new OwinContext(n));
                nextClaim = c.Get<ClaimsDTO>(Constants.JWT_CLAIMS).SomeNotNull();
                await Task.FromResult(true);
            }, opt);

            // Act
            await claimsMiddleware.Invoke(environment);

            // Assert
            var actual = nextClaim.ValueOrFailure().Role;
            Assert.Equal(expected, actual);
        }

        /// <summary>
        /// When a claim is unverified, it should be resigned after processing.
        /// 
        /// Assumptions:
        /// 1. The user does not exist in the sql database
        /// 2. This is the first run from the user
        /// </summary>
        [Fact]
        public async void Unverified_Claims_Should_Be_Resigned_If_User_Exists_In_AD()
        {
            // Arrange - JWT
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes("secret"));
            var claims = new ClaimsDTO { Verified = false, Username = "jdoe" };
            var token = JWT.Encode(claims, key, JwsAlgorithm.HS256);
            var environment = createOwinEnvironment(token, claims);

            // Arrange - mock behavior for Active Directory "Get" method
            var activeDirectoryRepository = new Mock<IRepository<string, User>>();
            var jdoe = new User();
            activeDirectoryRepository
                .Setup(ad => ad.Get(It.IsAny<string>()))
                .Callback<string>(u =>
                {
                    jdoe.Email = "jdoe@corp.org";
                    jdoe.FirstName = "John";
                    jdoe.LastName = "Doe";
                    jdoe.Username = u;
                })

                // Return the user
                .Returns(Task.FromResult(jdoe.Some()));

            // Arrange - mock behavior for SQL database "Create" method
            var sqlRepository = new Mock<IRepository<string, User>>();
            sqlRepository
                .Setup(db => db.Create(It.IsAny<User>()))
                .Callback<User>(u => u.ID = 1)
                .Returns((User u) => Task.FromResult(u.Some()));

            // Arrange - options class
            var opt = new JWTClaimsRetrieverOptions
            {
                Mapper = new NewtonsoftMapper(),
                Secret = key,
                UserActiveDirectoryRepository = activeDirectoryRepository.Object, 
                UserDatabaseRepository = sqlRepository.Object 
            };

            // Test subject
            string responseBearer = "";
            var claimsMiddleware = new JWTClaimsRetriever(async n =>
            {
                var c = (IOwinContext)(new OwinContext(n));
                responseBearer = c.Response.Headers.Get(Constants.HTTP_AUTHORIZATION);
                await Task.FromResult(true);
            }, opt);

            // Act
            await claimsMiddleware.Invoke(environment);

            // Assert that the token has been resigned
            var result = !string.IsNullOrEmpty(responseBearer) && !responseBearer.Equals(string.Format("Bearer {0}", token));
            Assert.True(result);
        }

        /// <summary>
        /// When a claim is unverified, it should be verified if the user exists in active directory.
        /// </summary>
        [Fact]
        public async void Unverified_Claims_Should_Be_Verified_If_User_Exists_In_AD()
        {
            // Arrange - JWT
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes("secret"));
            var claims = new ClaimsDTO { Verified = false, Username = "jdoe" };
            var token = JWT.Encode(claims, key, JwsAlgorithm.HS256);
            var environment = createOwinEnvironment(token, claims);

            // Arrange - mock behavior for Active Directory "Get" method
            var activeDirectoryRepository = new Mock<IRepository<string, User>>();
            var jdoe = new User();
            activeDirectoryRepository
                .Setup(ad => ad.Get(It.IsAny<string>()))
                .Callback<string>(u =>
                {
                    jdoe.Email = "jdoe@corp.org";
                    jdoe.FirstName = "John";
                    jdoe.LastName = "Doe";
                    jdoe.Username = u;
                })

                // Return the user
                .Returns(Task.FromResult(jdoe.Some()));

            // Arrange - mock behavior for SQL database "Create" method
            var sqlRepository = new Mock<IRepository<string, User>>();
            sqlRepository
                .Setup(db => db.Create(It.IsAny<User>()))
                .Callback<User>(u => u.ID = 1)
                .Returns((User u) => Task.FromResult(u.Some()));

            // Arrange - options class
            var opt = new JWTClaimsRetrieverOptions
            {
                Mapper = new NewtonsoftMapper(),
                Secret = key,
                UserActiveDirectoryRepository = activeDirectoryRepository.Object, 
                UserDatabaseRepository = sqlRepository.Object 
            };

            // Test subject
            var result = false;
            var claimsMiddleware = new JWTClaimsRetriever(async n =>
            {
                var c = (IOwinContext)(new OwinContext(n));
                var processedClaim = c.Get<ClaimsDTO>(Constants.JWT_CLAIMS);
                result = processedClaim.Verified;
                await Task.FromResult(true);
            }, opt);

            // Act
            await claimsMiddleware.Invoke(environment);

            // Assert that the claim has been verified
            Assert.True(result);
        }

        /// <summary>
        /// Helper method, which constructs an owin environment and inserts
        /// the given token into the owin dictionary.
        /// </summary>
        /// <param name="token">The JWT token</param>
        /// <returns>A dictionary containing the token</returns>
        private IDictionary<string, object> createOwinEnvironment(string token, ClaimsDTO claims)
        {
            var ctx = new OwinContext();

            // Assumption: JWTValidator middleware has been called beforehand (order matters)
            // Therefore we store claims in Owin to simulate the ordering
            ctx.Set(Constants.JWT_CLAIMS, claims);
            ctx.Request.Headers.Add("Authorization", new string[] { string.Format("Bearer {0}", token) });
            return ctx.Environment;
        }
    }
}
