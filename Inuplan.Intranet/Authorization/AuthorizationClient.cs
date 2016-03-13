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

namespace Inuplan.Intranet.Authorization
{
    using Common.DTOs;
    using System;
    using System.Linq;
    using System.Security.Principal;
    using System.Web;
    using Jose;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    using Newtonsoft.Json.Linq;
    using Optional;
    using Common.Tools;
    using Factories;

    public class AuthorizationClient
    {
        private readonly byte[] key;
        private readonly string remote;
        private readonly string domain;
        private readonly TimeSpan cookieExpiration;
        private readonly JwsAlgorithm algorithm;
        private readonly IHttpClientFactory httpClientFactory;

        public AuthorizationClient(
            byte[] key,
            string remote,
            string domain,
            TimeSpan cookieExpiration,
            JwsAlgorithm algorithm,
            IHttpClientFactory httpClientFactory)
        {
            this.key = key;
            this.remote = remote;
            this.domain = domain;
            this.cookieExpiration = cookieExpiration;
            this.algorithm = algorithm;
            this.httpClientFactory = httpClientFactory;
        }

        public void SetTokenIfExists(HttpResponseBase response, Option<string> token)
        {
            token.Match(t =>
            {
                var cookie = new HttpCookie(Constants.TOKEN_COOKIE, t);
                cookie.HttpOnly = true;
                cookie.Domain = domain;
                cookie.Expires = DateTime.Now.Add(cookieExpiration);
                response.SetCookie(cookie);
            },
            () => { /* No need to set token */});
        }

        public async Task<Option<string>> GetToken(HttpRequestBase request)
        {
            var cookieToken = request.Cookies.Get(Constants.TOKEN_COOKIE)
                                .SomeNotNull()
                                .Map(c => c.Value.SomeNotNull())
                                .Map(c => Task.FromResult(c));
            var token = cookieToken.ValueOr(async () => await GetTokenFromAPI());
            return await token;
        }

        public async Task<Option<string>> GetToken(HttpRequestMessage request)
        {
            var cookieToken = request.Headers
                                .GetCookies(Constants.TOKEN_COOKIE)
                                .FirstOrDefault()
                                .SomeNotNull()
                                .Map(c => c[Constants.TOKEN_COOKIE])
                                .Map(c => c.Value)
                                .SomeNotNull()
                                .Map(c => Task.FromResult(c));

            var token = cookieToken.ValueOr(async () => await GetTokenFromAPI());
            return await token;
        }

        private async Task<Option<string>> GetTokenFromAPI()
        {
            var username = Environment.UserName;
            var claims = new ClaimsDTO
            {
                Username = username,
                Verified = false
            };

            var requestToken = JWT.Encode(claims, key, algorithm);

            string result = null;

            // Send request token to remote api: GET /api/v1/token
            using(var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = new Uri(remote);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(Constants.JWT_SCHEME, requestToken);
                var response = await client.GetAsync(@"api/v1/token");

                var content = await response.Content.ReadAsStringAsync();
                var jsonObject = JObject.Parse(content);
                var jsonToken = jsonObject.GetValue("Token");
                result = jsonToken.Value<string>();
            }

            return result.SomeNotNull();
        }
    }
}