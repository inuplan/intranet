using Inuplan.Common.DTOs;
using Inuplan.Intranet.Authorization;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Inuplan.Intranet.Controllers
{
    public class ImageController : Controller
    {
        private readonly Client authClient;

        public ImageController(Client authClient)
        {
            this.authClient = authClient;
        }

        // GET: http://site/image 
        public async Task<ActionResult> Index()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://localhost:9000");
                var result = await client.GetAsync("/JMS/image");
                var content = await result.Content.ReadAsStringAsync();
                var images = JsonConvert.DeserializeObject<List<ImageDTO>>(content);
                return View(images);
            }
        }

        [Route("user/{username:alpha:length(2,6)}/images")]
        [HttpGet]
        public async Task<ActionResult> UserImages(string username)
        {
            var token = await authClient.GetTokenIfNotExists(Request, User);
            authClient.SetTokenIfExists(Response, token);

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://localhost:9000");
                var path = string.Format("/{0}/image", username);
                var result = await client.GetAsync(path);
                var content = await result.Content.ReadAsStringAsync();
                var images = JsonConvert.DeserializeObject<List<ImageDTO>>(content);

                return View(images);
            }
        }
    }
}