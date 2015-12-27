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
    using Common.Tools;
    using Inuplan.WebAPI.Middlewares.JWT;
    using Jose;
    using Microsoft.Owin;
    using System.Collections.Generic;
    using System.Security.Cryptography;
    using System.Threading.Tasks;
    using Xunit;

    /// <summary>
    /// Tests the <see cref="JWTValidator"/> middleware.
    /// </summary>
    public class JWTValidatorTests
    {
        /// <summary>
        /// Tests if the next middleware is called
        /// when the token is valid.
        /// Expected: Should call next.
        /// </summary>
        [Fact]
        public async void When_Valid_Token_Call_Next_Middleware()
        {
            // Arrange - JWT with correct key
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes("secret"));
            var claims = new ClaimsDTO { Verified = true };
            var token = JWT.Encode(claims, key, JwsAlgorithm.HS256);

            // Arrange - Middleware configuration
            var env = createOwinEnvironment(token);
            var opt = new JWTValidatorOptions { Secret = key, Mapper = new NewtonsoftMapper() };

            // Arrange - Test subject
            var next = false;
            var validator = new JWTValidator(async n => next = await Task.FromResult(true), opt);

            // Act
            await validator.Invoke(env);

            // Assert
            Assert.True(next, "The next middleware should be invoked because the JWT has the correct signature.");
        }

        /// <summary>
        /// Tests if the next middleware is called
        /// when the token is invalid.
        /// Expected: Should NOT call next.
        /// </summary>
        [Fact]
        public async void When_Invalid_Token_Dont_Call_Next_Middleware()
        {
            // Arrange - JWT with incorrect key
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes("secret"));
            var claims = new ClaimsDTO { Verified = true };
            var token = JWT.Encode(claims, new byte[32], JwsAlgorithm.HS256);

            // Arrange - Middleware configuration
            var env = createOwinEnvironment(token);
            var options = new JWTValidatorOptions { Secret = key, Mapper = new NewtonsoftMapper() };

            // Arrange - Test subject
            var next = false;
            var validator = new JWTValidator(async n => next = await Task.FromResult(true), options);

            // Act
            await validator.Invoke(env);

            // Assert
            Assert.False(next, "The next middleware should not be invoked because the JWT token has the wrong signature.");
        }

        /// <summary>
        /// Tests if the next middleware is called with the right context.
        /// Expected: Context should contain an entry with a key <see cref="Common.Tools.Constants.JWT_CLAIMS"/>
        /// </summary>
        [Fact]
        public async void When_Valid_Token_Next_Context_Should_Contain_Claims()
        {
            // Arrange - JWT with correct key
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes("secret"));
            var claims = new ClaimsDTO { Verified = true };
            var token = JWT.Encode(claims, key, JwsAlgorithm.HS256);

            // Arrange - Middleware configuration
            var env = createOwinEnvironment(token);
            var opt = new JWTValidatorOptions { Secret = key, Mapper = new NewtonsoftMapper() };

            // Arrange - Test subject
            var containsClaims = false;
            var validator = new JWTValidator(async n => containsClaims = await Task.FromResult(n.ContainsKey(Constants.JWT_CLAIMS)), opt);

            // Act
            await validator.Invoke(env);

            // Assert
            Assert.True(containsClaims, "The next middleware should contain the JWT claims");
        }

        /// <summary>
        /// Tests if the next middleware is called with the right context.
        /// Expected: Context should not contain an entry with a key <see cref="Common.Tools.Constants.JWT_CLAIMS"/>
        /// </summary>
        [Fact]
        public async void When_Invalid_Token_Next_Context_Should_Not_Contain_Claims()
        {
            // Arrange - JWT with incorrect key
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes("secret"));
            var claims = new ClaimsDTO { Verified = true };
            var token = JWT.Encode(claims, new byte[32], JwsAlgorithm.HS256);

            // Arrange - Middleware configuration
            var env = createOwinEnvironment(token);
            var opt = new JWTValidatorOptions { Secret = key, Mapper = new NewtonsoftMapper() };

            // Arrange - Test subject
            var containsClaims = false;
            var validator = new JWTValidator(async n => containsClaims = await Task.FromResult(!n.ContainsKey(Constants.JWT_CLAIMS)), opt);

            // Act
            await validator.Invoke(env);

            // Assert
            Assert.False(containsClaims, "The next middleware should not contain the JWT claims");
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
