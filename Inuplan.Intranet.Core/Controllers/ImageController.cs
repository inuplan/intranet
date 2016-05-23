using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Inuplan.Intranet.Core.Controllers
{
    public class ImageController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        [Route("[controller]/[action]/{username}")]
        public IActionResult UserGallery(string username)
        {
            var userDomain = User.Identity.Name;
            var currentUsername = userDomain.Substring(userDomain.LastIndexOf('\\') + 1);
            var canEdit = currentUsername.Equals(username, StringComparison.OrdinalIgnoreCase).ToString().ToLower();
            ViewBag.Username = username;
            ViewBag.CanEdit = canEdit;
            return View();
        }
    }
}
