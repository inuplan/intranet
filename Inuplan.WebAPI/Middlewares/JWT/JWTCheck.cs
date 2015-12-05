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

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Inuplan.Common.Tools;
using Microsoft.Owin;
using Optional;
using jwt = JWT;

namespace Inuplan.WebAPI.Middlewares.JWT
{
    using AppFunc = Func<IDictionary<string, object>, Task>;

    /// <summary>
    /// An <code>Owin</code> middleware, which checks whether a given token in the <code>HTTP</code> request header
    /// is valid. Only during an invalid will this middleware make an early return of 401 NotAuthorized.
    /// </summary>
    public class JWTCheck 
    {
        /// <summary>
        /// The next middleware
        /// </summary>
        private readonly AppFunc next;

        /// <summary>
        /// The option configuration
        /// </summary>
        private readonly JWTOptions options;

        /// <summary>
        /// Initializes an instance of the <see cref="JWTCheck"/> class.
        /// </summary>
        /// <param name="next">The next middleware</param>
        /// <param name="options">The options configurations</param>
        public JWTCheck(AppFunc next, JWTOptions options)
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
        /// If none: The token will be <see cref="Optional.Option"/> None, and call next.
        /// </summary>
        /// <param name="environment">The environment</param>
        /// <returns>An awaitable task</returns>
        public async Task Invoke(IDictionary<string, object> environment)
        {
            // Extract the JWT token
            IOwinContext context = new OwinContext(environment);
            var bearer = context.Request.Headers.Get("Authorization")
                            .SomeWhen(header => (header != null) && header.Contains("Bearer"));
            var token = bearer.Map(header => header.Split(' ')[1]);

            // Process the JWT token
            var proceed = await token.Match(
                async t =>
                {
                    // token exists: then decode it and verify
                    var res = jwt.JsonWebToken.Decode(t, options.Secret, options.LogInvalidSignature, options.LogExpired, options.LogError);
                    var valid = await res.Match(
                        // If valid token, proceed with the OWIN pipeline
                        async _ =>
                        {
                            context.Set(Constants.JWT_TOKEN, t.Some());
                            await next.Invoke(environment);
                            return true;
                        },

                        // If invalid token
                        async () =>
                        {
                            return await Task.Run(() =>
                            {
                                context.Response.StatusCode = 401;
                                context.Response.ReasonPhrase = "Invalid JWT token";
                                return false;
                            });
                        });

                    return valid;
                },
                async () => 
                {
                    context.Set(Constants.JWT_TOKEN, string.Empty.None());
                    await next.Invoke(environment);
                    return true;
                });

            if(!proceed)
            {
                await context.Response.WriteAsync(string.Format("Error {0}-\"{1}\"", 
                    context.Response.StatusCode, 
                    context.Response.ReasonPhrase));
            }
        }
    }
}
