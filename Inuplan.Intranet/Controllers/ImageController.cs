using Inuplan.Common.DTOs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Inuplan.Intranet.Controllers
{
    public class ImageController : Controller
    {
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
    }
}