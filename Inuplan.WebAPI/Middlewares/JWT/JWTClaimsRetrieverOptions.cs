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
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Jose;

    /// <summary>
    /// The configuration options for <see cref="JWTClaimsRetriever"/> middleware.
    /// </summary>
    public class JWTClaimsRetrieverOptions
    {
        /// <summary>
        /// Gets or sets the user repository, which retrieves from the SQL database
        /// </summary>
        public IRepository<string, User> UserDatabaseRepository { get; set; }

        /// <summary>
        /// Gets or sets the user repository, which retrieves from the active directory database
        /// </summary>
        public IRepository<string, User> UserActiveDirectoryRepository { get; set; }

        /// <summary>
        /// Gets or sets the domain name for the <code>Active Directory</code>
        /// Example: corp.local
        /// </summary>
        //public string Domain { get; set; }

        /// <summary>
        /// Gets or sets the private encryption key used to 
        /// encode/decode <code>JWT</code> tokens.
        /// </summary>
        public byte[] Secret { get; set; }

        /// <summary>
        /// Gets or sets the JSON mapper
        /// </summary>
        public IJsonMapper Mapper { get; set; }
    }
}
