using Inuplan.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using Jose;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Optional;
using Inuplan.Common.Enums;
using Inuplan.Common.Tools;

namespace Inuplan.Intranet.Authorization
{
    public class Client
    {
        private readonly byte[] key;
        private readonly string remote;
        private readonly string domain;
        private readonly TimeSpan cookieExpiration;

        public Client(
            byte[] key,
            string remote,
            string domain,
            TimeSpan cookieExpiration)
        {
            this.key = key;
            this.remote = remote;
            this.domain = domain;
            this.cookieExpiration = cookieExpiration;
        }

        public void SetTokenIfExists(HttpResponseBase response, Option<string> token)
        {
            token.Match(t =>
            {
                var cookie = new HttpCookie(Constants.TOKEN_COOKIE, t);
                cookie.Domain = domain;
                cookie.Expires = DateTime.Now.Add(cookieExpiration);
                response.SetCookie(cookie);
            },
            () => { /* No need to set token */});
        }

        public async Task<Option<string>> GetTokenIfNotExists(HttpRequestBase request, IPrincipal user)
        {
            // If cookie value exists, we don't need to get it
            // otherwise we get it from the api
            return (CookieHasToken(request)) ? Option.None<string>() : await GetTokenFromAPI(user);
        }

        private bool CookieHasToken(HttpRequestBase request)
        {
            return request
                    .Cookies
                    .AllKeys
                    .Any(k => 
                        k.Equals(Constants.TOKEN_COOKIE) &&
                        !string.IsNullOrEmpty(k));
        }

        private async Task<Option<string>> GetTokenFromAPI(IPrincipal user)
        {
            var username = GetUsername(user);

            var claims = new ClaimsDTO
            {
                Username = username,
                Verified = false
            };

            var requestToken = JWT.Encode(claims, key, JwsAlgorithm.HS256);

            string result = null;

            // Send request token to remote api: GET /api/v1/token
            using(var client = new HttpClient())
            {
                client.BaseAddress = new Uri(remote);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", requestToken);
                var response = await client.GetAsync(@"api/v1/token");

                var content = await response.Content.ReadAsStringAsync();
                var jsonObject = JObject.Parse(content);
                var jsonToken = jsonObject.GetValue("Token");
                result = jsonToken.Value<string>();
            }

            return result.SomeNotNull();
        }

        private string GetUsername(IPrincipal user)
        {
            var fulluser = user.Identity.Name;
            var username = fulluser.Split('\\')[1];
            return username.ToUpper();
        }
    }
}