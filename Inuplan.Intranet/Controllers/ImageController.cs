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
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Mvc;
    using Common.Tools;
    using Inuplan.Common.DTOs;
    using Inuplan.Intranet.Authorization;
    using Newtonsoft.Json;

    /// <summary>
    /// Image controller, which also functions as a proxy for the web api.
    /// </summary>
    public class ImageController : Controller
    {
        private readonly AuthorizationClient authClient;
        private const string baseAddress = "http://localhost:9000";

        public ImageController(AuthorizationClient authClient)
        {
            this.authClient = authClient;
        }

        [Route("user/{username:alpha:length(2,6)}/images", Name = "UserImages")]
        [HttpGet]
        public async Task<ActionResult> UserImages(string username)
        {
            var token = await authClient.GetTokenIfNotExists(Request, User);
            authClient.SetTokenIfExists(Response, token);

            // Display upload form?
            ViewBag.CanEdit = (username.Equals(Environment.UserName));
            ViewBag.Username = username;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseAddress);
                var path = string.Format("/{0}/image", username);
                var result = await client.GetAsync(path);
                
                if(result.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    // TODO: Handle 404 better!
                    /* NotFound! */
                    ViewBag.Username = "Not Found";
                    return View(new List<UserImageDTO>());
                }

                var content = await result.Content.ReadAsStringAsync();
                var images = JsonConvert.DeserializeObject<List<UserImageDTO>>(content);

                return View(images);
            }
        }
    }
}