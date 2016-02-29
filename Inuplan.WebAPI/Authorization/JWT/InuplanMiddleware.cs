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

namespace Inuplan.WebAPI.Authorization.JWT
{
    using Common.Tools;
    using Microsoft.Owin;
    using Optional;
    using System.Threading.Tasks;

    /// <summary>
    /// Retrieves <code>JWT</code> token from the <code>OwinContext</code>
    /// and adds it to the response headers.
    /// </summary>
    public class InuplanMiddleware : OwinMiddleware
    {
        /// <summary>
        /// The next middleware to be called
        /// </summary>
        private readonly OwinMiddleware next;

        /// <summary>
        /// Instantiates a new instance of the <see cref="InuplanMiddleware"/> class.
        /// </summary>
        /// <param name="next">The next owin middleware</param>
        public InuplanMiddleware(OwinMiddleware next) : base(next)
        {
            this.next = next;
        }

        /// <summary>
        /// Subscribes to and rewrites the http response headers if a JWT token is
        /// present.
        /// </summary>
        /// <param name="context">The owin context</param>
        /// <returns>An awaitable task</returns>
        public async override Task Invoke(IOwinContext context)
        {
            context.Response.OnSendingHeaders(obj =>
            {
                var bearer = context.Get<string>(Constants.JWT_TOKEN).SomeNotNull();
                bearer.Match(b =>
                {
                        // Add token to response, if present
                        context.Response.Headers.Add("Authorization", new string[] { b });
                },
                () => { });
            }, new object());
            await next.Invoke(context);
        }
    }
}
