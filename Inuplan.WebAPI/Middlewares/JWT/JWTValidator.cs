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

using jwt = JWT;

namespace Inuplan.WebAPI.Middlewares.JWT
{
    using System.Threading.Tasks;
    using Inuplan.Common.DTOs;
    using Inuplan.Common.Tools;
    using Microsoft.Owin;
    using Newtonsoft.Json;
    using Optional;

    /// <summary>
    /// An <code>Owin</code> middleware, which checks whether a given token in the <code>HTTP</code> request header
    /// is valid. Only during an invalid will this middleware make an early return of 401 NotAuthorized.
    /// </summary>
    public class JWTValidator : OwinMiddleware
    {
        /// <summary>
        /// The option configuration
        /// </summary>
        private readonly JWTValidatorOptions options;

        /// <summary>
        /// Initializes an instance of the <see cref="JWTValidator"/> class.
        /// </summary>
        /// <param name="next">The next middleware</param>
        /// <param name="options">The options configurations</param>
        public JWTValidator(OwinMiddleware next, JWTValidatorOptions options)
            : base(next)
        {
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
        public override async Task Invoke(IOwinContext context)
        {
            // Extract the JWT token
            var bearer = context.Request.Headers.Get("Authorization")
                            .SomeWhen(header => (header != null) && header.Contains("Bearer"));
            var token = bearer.Map(header => header.Split(' ')[1]);

            // Process the JWT token
            await Task.Run(() =>
            {
                token.Match(
                    t =>
                    {
                        // token exists: then decode it and verify
                        var res = jwt.JsonWebToken.Decode(t, options.Secret, options.LogInvalidSignature, options.LogExpired, options.LogError);
                        res.Match(
                            // Has jwt payload
                            async payload =>
                            {
                                var claims = JsonConvert.DeserializeObject<ClaimsDTO>(payload);
                                context.Set(Constants.JWT_CLAIMS, claims.SomeNotNull());

                                // If valid token, proceed with the OWIN pipeline
                                await Next.Invoke(context);

                                // When coming back then, sign the new JWT token.
                                var newClaims = context.Get<Option<ClaimsDTO>>(Constants.JWT_CLAIMS);
                                newClaims.Map(c =>
                                {
                                    // If it is verified
                                    if (c.Verified)
                                    {
                                        var newToken = jwt.JsonWebToken.Encode(c, options.Secret, jwt.JwtHashAlgorithm.HS512);
                                        var newBearer = string.Format("Bearer {0}", newToken);
                                        context.Response.Headers.Set(Constants.HTTP_AUTHORIZATION, newBearer);
                                    }

                                    return c;
                                });
                            },

                            // If invalid token
                            () =>
                            {
                                context.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
                                context.Response.ReasonPhrase = "Invalid JWT token";
                            });
                    },
                    () =>
                    {
                        // Missing token
                        context.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
                        context.Response.ReasonPhrase = "Missing JWT Token";
                    });
            });
        }
    }
}
