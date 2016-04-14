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
    using System;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using ViewModels;

    public class HomeController : Controller
    {
        private readonly Uri remoteBaseAddress;

        public HomeController([WithKey(ServiceKeys.RemoteBaseAddress)] Uri remoteBaseAddress)
        {
            this.remoteBaseAddress = remoteBaseAddress;
        }

        // GET: Home
        public async Task<ActionResult> Index()
        {
            ViewBag.Remote = remoteBaseAddress.ToString();
            ViewBag.Skip = 0;
            ViewBag.Take = 10;
            // Get token (if its does not exist)
            //var token = await authClient.GetTokenIfNotExists(Request, User);

            // Set token (if we got it)
            // authClient.SetTokenIfExists(Response, token);

            return await Task.FromResult(View());
        }

        [ChildActionOnly]
        public ActionResult Menu()
        {
            return PartialView("_Menu", new BaseViewModel<User>
            {
                CurrentUsername = System.Environment.UserName,
            });
        }
    }
}