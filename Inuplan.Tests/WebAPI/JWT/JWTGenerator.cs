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

namespace Inuplan.Tests.WebAPI.JWT
{
    using Common.DTOs;
    using Common.Models;
    using Common.Tools;
    using Jose;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using System.Threading.Tasks;
    using Xunit;

    public class JWTGenerator
    {
        [Fact]
        public void Test_JWTS()
        {
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes("b6Y34qVqNTHYX32EQhPUqABzqygZ6VhetKepspRpA3yrARXzjF4tr2CEuMgu"));
            var claims = new ClaimsDTO
            {
                Verified = false,
                Username = "jdoe",
                Role = RoleType.User
            };
            var token = JWT.Encode(claims, key, JwsAlgorithm.HS256);
            Debug.WriteLine(string.Format("Bearer {0}", token));
        }
    }
}
