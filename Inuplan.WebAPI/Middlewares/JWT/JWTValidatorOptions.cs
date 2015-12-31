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

using Jose;
using System;

namespace Inuplan.WebAPI.Middlewares.JWT
{
    public class JWTValidatorOptions
    {
        /// <summary>
        /// Gets or sets the action in which should be invoked upon
        /// an invalid <code>JWT</code> signature.
        /// The first parameter is the expected signature.<br />
        /// The second parameter is the actual signature.
        /// </summary>
        public Action<string, string> LogInvalidSignature { get; set; }

        /// <summary>
        /// Gets or sets the action which should be invoked upon
        /// an expired <code>JWT</code> token.
        /// The <code>IOwinContext</code> parameter is
        /// The <code>double</code> parameter is the elapsed time
        /// since the expiration time (in seconds).
        /// </summary>
        public Action<double> LogExpired { get; set; }

        /// <summary>
        /// Gets or sets the action which should be invoked upon
        /// getting an error during the deserialization of the token.<br />
        /// The first parameter is the error message.<br />
        /// The second parameter is the instance which caused the error.
        /// </summary>
        public Action<string, object> LogError { get; set; }

        /// <summary>
        /// Gets or sets the custom json mapper
        /// </summary>
        public IJsonMapper Mapper { get; set; }

        /// <summary>
        /// Gets or sets the secret signing key used to decrypt JWT token.
        /// </summary>
        public byte[] Secret { get; set; }
    }
}
