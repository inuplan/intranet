﻿// Copyright © 2015 Inuplan
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

namespace Inuplan.Common.Principals
{
    using Models;
    using System.Security.Principal;

    /// <summary>
    /// A custom principal object which is attached to a specific <see cref="Inuplan.Common.Models.User"/>
    /// </summary>
    public class InuplanPrincipal : GenericPrincipal
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="InuplanPrincipal"/> class.
        /// </summary>
        /// <param name="identity">The identity of the user</param>
        /// <param name="roles">The roles for the user</param>
        /// <param name="user">The <see cref="Inuplan.Common.Models.User"/></param>
        public InuplanPrincipal(IIdentity identity, string[] roles, User user) : base(identity, roles)
        {
            User = user;
        }

        /// <summary>
        /// Gets the user for this principal
        /// </summary>
        public User User { get; private set; }
    }
}
