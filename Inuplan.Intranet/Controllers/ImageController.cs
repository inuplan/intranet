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

namespace Inuplan.Intranet.Controllers
{
    using Autofac.Extras.Attributed;
    using Common.Enums;
    using Common.Models;
    using Factories;
    using Newtonsoft.Json;
    using Optional;
    using System;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Mvc;
    using ViewModels;

    /// <summary>
    /// Image controller, which also functions as a proxy for the web api.
    /// </summary>
    public class ImageController : Controller
    {
        private const string baseAddress = "http://localhost:9000";
        private readonly IHttpClientFactory httpClientFactory;
        private readonly Uri remoteBaseAddress;

        public ImageController(
            [WithKey(ServiceKeys.RemoteBaseAddress)] Uri remoteBaseAddress,
            IHttpClientFactory httpClientFactory)
        {
            this.remoteBaseAddress = remoteBaseAddress;
            this.httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        [Route("user/{username:alpha:length(2,6)}/images", Name = "UserImages")]
        public async Task<ActionResult> UserImages(string username)
        {
            using (var client = httpClientFactory.GetHttpClient())
            {
                client.BaseAddress = remoteBaseAddress;
                var path = string.Format("user/{0}", username);
                var response = await client.GetAsync(path);
                var json = (await response.Content.ReadAsStringAsync()).SomeNotNull();
                var owner = json.Map(j => JsonConvert.DeserializeObject<User>(j));

                return owner.Match(u =>
                {
                    ViewBag.API = remoteBaseAddress.ToString();
                    var vm = new BaseViewModel<User>
                    {
                        CurrentUsername = Environment.UserName,
                        Entity = u,
                        IsEditable = u.Username.Equals(Environment.UserName, StringComparison.OrdinalIgnoreCase),
                    };

                    return View(vm);
                },
                () =>
                {
                    throw new HttpException((int)response.StatusCode, response.ReasonPhrase);
                });
            }
        }
    }
}