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

namespace Inuplan.Common.DTOs
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    /// <summary>
    /// The json claim that is sent between client and server
    /// </summary>
    public class ClaimsDTO
    {
        /// <summary>
        /// Gets or sets the user ID
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// Gets or sets the username for this claim
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Gets or sets the first name for this claim
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name for this claim
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets whether the claim has been verified.
        /// Also means that every property has been filled out
        /// and is legitimate.
        /// </summary>
        public bool Verified { get; set; }

        /// <summary>
        /// Gets or sets the email address for this claim
        /// </summary>
        public string Email { get; set; }
    }
}
