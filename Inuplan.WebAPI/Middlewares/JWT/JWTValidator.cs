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

namespace Inuplan.WebAPI.Middlewares.JWT
{
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Net;
    using System.Threading.Tasks;
    using Common.DTOs;
    using Common.Models;
    using Inuplan.Common.Tools;
    using Microsoft.Owin;
    using NLog;
    using Optional;
    using AppFunc = System.Func<System.Collections.Generic.IDictionary<string, object>, System.Threading.Tasks.Task>;

    /// <summary>
    /// An <code>Owin</code> middleware, which checks whether a given token in the <code>HTTP</code> request header
    /// is valid. Only during an invalid will this middleware make an early return of 401 NotAuthorized.
    /// </summary>
    public class JWTValidator
    {
        /// <summary>
        /// The logger
        /// </summary>
        private static ILogger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The next middleware
        /// </summary>
        private readonly AppFunc next;

        /// <summary>
        /// The option configuration
        /// </summary>
        private readonly JWTValidatorOptions options;

        /// <summary>
        /// Initializes an instance of the <see cref="JWTValidator"/> class.
        /// </summary>
        /// <param name="next">The next middleware</param>
        /// <param name="options">The options configurations</param>
        public JWTValidator(AppFunc next, JWTValidatorOptions options)
        {
            this.next = next;
            this.options = options;
        }

        /// <summary>
        /// This gets invoked during the step through of the <code>Owin</code> pipeline.
        /// This middleware extracts the token from the HTTP request header and checks
        /// it if it is a valid token. <br />
        /// If invalid: 401 NotAuthorized will be returned.<br />
        /// If valid: The token will be inserted into the <code>OwinContext</code> and call next.<br />
        /// If none: The token will be <see cref="Optional.Option.None{T}"/> and return with 401 NotAuthorized.
        /// </summary>
        /// <param name="environment">The environment</param>
        /// <returns>An awaitable task</returns>
        public async Task Invoke(IDictionary<string, object> environment)
        {
            // Extract the JWT token
            logger.Trace("Invoking validator");
            var context = (IOwinContext)(new OwinContext(environment));
            var bearer = context.Request.Headers.Get("Authorization")
                            .SomeWhen(header => (header != null) && header.Contains("Bearer"));
            var token = bearer.Map(header => header.Split(' ')[1]);
            logger.Trace(token);

            // Process the JWT token
            await token.Match(
                t =>
                {
                    // The key requirement (assumption)
                    Debug.Assert(options.Secret.Length == 32, "Key should be (8 * 32) = 256 bits long because we use HS256 encryption");

                    // token exists: then decode it 
                    Jose.JWT.JsonMapper = options.Mapper;
                    var data = decode(t, options.Secret);
                    logger.Trace("Token: {0}\tDecoded: {1}", t, data);

                    // and verify
                    data.Match(async claims =>
                    {
                        // Store claims in Owin
                        context.Set(Constants.JWT_CLAIMS, claims);
                        logger.Trace("Stored claims in owin context: {0}", claims);

                        // Proceed to next middleware
                        logger.Trace("Calling next middleware");
                        await next.Invoke(context.Environment);

                        // Assert that the claims has been verified after passing through the middleware
                        Debug.Assert(claims.Verified, "Claims should be verified after processing");
                    },
                    () =>
                    {
                        // Invalid token, reason(s): missing username, wrong key etc.
                        logger.Error("Invalid token error");
                        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        context.Response.ReasonPhrase = "Invalid JWT token";
                    });

                    return Task.FromResult(0);
                },
                () =>
                {
                    // Missing token
                    logger.Error("Missing token");
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    context.Response.ReasonPhrase = "Missing JWT Token";
                    return Task.FromResult(0);
                });
        }

        /// <summary>
        /// Decodes the token and returns some if succesfull otherwise it returns none.
        /// </summary>
        /// <param name="token">The JWT token</param>
        /// <param name="key">The key</param>
        /// <returns>An optional value depending on whether the decoding process has been succesfull</returns>
        private Option<ClaimsDTO> decode(string token, byte[] key)
        {
            var result = Option.None<ClaimsDTO>();
            try
            {
                var data = Jose.JWT.Decode<ClaimsDTO>(token, key);

                // returns None if user has been verified and been given None role
                result = data.SomeWhen(c =>
                {
                    // If the claim - claims to be verified, we validate it
                    if (c.Verified) return ValidVerifiedClaim(c);

                    // Otherwise if the username does not exists, it is invalid
                    return !string.IsNullOrEmpty(c.Username);
                });
            }
            catch (Jose.IntegrityException ex)
            {
                /* Log failure */
                logger.Error("Could not decode, exception: {0}", ex);
            }

            // If claims does NOT contain a username, then it is invalid
            return result;
        }

        /// <summary>
        /// A valid verified claim must contain every property and
        /// <see cref="RoleType"/> must not be <see cref="RoleType.None"/> as well as
        /// <see cref="ClaimsDTO.ID"/> must be greater than zero.
        /// </summary>
        /// <param name="c">The claim to check</param>
        /// <returns>If valid claim, then true otherwise false</returns>
        private bool ValidVerifiedClaim(ClaimsDTO c)
        {
            return
                c.ID > 0 &&
                c.Role != RoleType.None &&
                !string.IsNullOrEmpty(c.FirstName) &&
                !string.IsNullOrEmpty(c.LastName) &&
                !string.IsNullOrEmpty(c.Username) &&
                !string.IsNullOrEmpty(c.Email);
        }

    }
}
