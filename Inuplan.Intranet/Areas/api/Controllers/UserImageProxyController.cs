using Inuplan.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inuplan.Common.DTOs;
using System.Threading.Tasks;
using Inuplan.Intranet.Factories;
using System.Net.Http.Headers;
using Inuplan.Common.Tools;
using Inuplan.Intranet.Authorization;
using Optional;
using NLog;
using Newtonsoft.Json;

namespace Inuplan.Intranet.Areas.api.Controllers
{
    [RoutePrefix("api/{username}/image")]
    public class UserImageProxyController : ApiController, IUserImageController
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        private readonly Uri remoteBaseAddress;
        private readonly IHttpClientFactory httpClientFactory;
        private readonly AuthorizationClient authClient;

        public UserImageProxyController(Uri remoteBaseAddress, IHttpClientFactory httpClientFactory, AuthorizationClient authClient)
        {
            this.httpClientFactory = httpClientFactory;
            this.remoteBaseAddress = remoteBaseAddress;
            this.authClient = authClient;
        }

        // DELETE api/{username}/image/{file}
        [Route("{file}")]
        [HttpDelete]
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
