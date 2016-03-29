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

namespace Inuplan.Intranet.Areas.api.Controllers
{
    using Autofac.Extras.Attributed;
    using Common.Controllers;
    using Common.DTOs;
    using Common.Enums;
    using Common.Tools;
    using Authorization;
    using Factories;
    using Newtonsoft.Json;
    using NLog;
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    using System.Web.Http;

    [RoutePrefix("api/{username}/image")]
    public class UserImageProxyController : ApiController, IUserImageController
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        private readonly Uri remoteBaseAddress;
        private readonly IHttpClientFactory httpClientFactory;
        private readonly AuthorizationClient authClient;

        public UserImageProxyController(
            [WithKey(ServiceKeys.RemoteBaseAddress)] Uri remoteBaseAddress,
            IHttpClientFactory httpClientFactory,
            AuthorizationClient authClient)
        {
            this.httpClientFactory = httpClientFactory;
            this.remoteBaseAddress = remoteBaseAddress;
            this.authClient = authClient;
        }

        // DELETE api/{username}/image/{file}
        [Route("{file}")]
        [HttpDelete]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> Delete(string username, string file)
        {
            var token = await authClient.GetToken(Request);
            var response = token.Match(async t =>
            {
                using (var client = httpClientFactory.GetHttpClient())
                {
                    client.BaseAddress = remoteBaseAddress;
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(Constants.JWT_SCHEME, t);
                    var path = string.Format("{0}/image/{1}", username, file);
                    return await client.DeleteAsync(path);
                }
            },
            () =>
            {
                logger.Error("Token is missing");
                return Task.FromResult(Request.CreateResponse(HttpStatusCode.Unauthorized));
            });

            return await response;
        }

        [Route("{file}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<HttpResponseMessage> Get(string username, string file)
        {
            using (var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = remoteBaseAddress;
                var path = string.Format("{0}/image/{1}", username, file);
                return await client.GetAsync(path);
            }
        }

        [Route("", Name ="GetUserImages")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<List<UserImageDTO>> GetAll(string username, [FromUri] bool comments = false)
        {
            using (var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = remoteBaseAddress;
                var path = string.Format("{0}/image?comments={1}",username, comments);
                var json = await client.GetStringAsync(path);
                var result = JsonConvert.DeserializeObject<List<UserImageDTO>>(json);
                return result;
            }
        }

        [Route("~/image/id/{id:int}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<HttpResponseMessage> GetByID(int id)
        {
            using (var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = remoteBaseAddress;
                var path = string.Format("image/id/{0}", id);
                return await client.GetAsync(path);
            }
        }

        [Route("preview/{file}")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> GetPreview(string username, string file)
        {
            using (var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = remoteBaseAddress;
                var path = string.Format("{0}/image/preview/{1}", username, file);
                return await client.GetAsync(path);
            }
        }

        [Route("profile")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> GetProfilePicture(string username)
        {
            using (var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = remoteBaseAddress;
                var path = string.Format("{0}/image/profile", username);
                return await client.GetAsync(path);
            }
        }

        [Route("thumbnail/{file}")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> GetThumbnail(string username, string file)
        {
            using (var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = remoteBaseAddress;
                var path = string.Format("{0}/image/thumbnail/{1}", username, file);
                return await client.GetAsync(path);
            }
        }

        [Route("", Name = "UploadImage")]
        [HttpPost]
        public async Task<HttpResponseMessage> Post(string username)
        {
            using (var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = remoteBaseAddress;
                var path = string.Format("{0}/image", username);
                return await client.PostAsync(path, Request.Content);
            }
        }

        [Route("profile")]
        [HttpPost]
        public async Task<HttpResponseMessage> UploadProfileImage(string username)
        {
            using (var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = remoteBaseAddress;
                var path = string.Format("{0}/image/profile", username);
                return await client.PostAsync(path, Request.Content);
            }
        }
    }
}
