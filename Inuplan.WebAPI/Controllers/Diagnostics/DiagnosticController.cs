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

namespace Inuplan.WebAPI.Controllers.Diagnostics
{
    using Autofac.Extras.Attributed;
    using Common.DTOs;
    using Common.Enums;
    using Common.Logger;
    using Common.Models;
    using Common.Queries.UserSpaceInfoQueries;
    using Common.Repositories;
    using Extensions;
    using Extensions.Workflows;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    public class DiagnosticController : DefaultController
    {
        private readonly ILogger<DiagnosticController> logger;
        private readonly string rootUploadFolder;
        private readonly IGetUserSpaceInfo userSpaceQueryHandle;

        public DiagnosticController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            [WithKey(ServiceKeys.RootPath)] string rootUploadFolder,
            IGetUserSpaceInfo userSpaceQueryHandle,
            ILogger<DiagnosticController> logger
        )
            : base(userDatabaseRepository)
        {
            this.rootUploadFolder = rootUploadFolder;
            this.userSpaceQueryHandle = userSpaceQueryHandle;
            this.logger = logger;
        }

        // GET api/diagnostic
        public HttpResponseMessage Get()
        {
            var username = Request.GetUser().Map(u => u.Username).ValueOr("Anonymous");
            Logger.Trace("Received request from: {0}", username);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        public async Task<UserSpaceInfoDTO> GetSpaceInfo()
        {
            logger.Begin();
            var userId = Request
                            .GetUser()
                            .Map(u => u.ID)
                            .LogSome(id => logger.Trace("User has id: {0}", id))
                            .LogNone(() => logger.Error("Anonymous request are not permitted"))
                            .Match(
                                u => u,
                                () => { throw new HttpResponseException(HttpStatusCode.Forbidden); }
                            );

            var spaceInfo = await userSpaceQueryHandle.GetUserSpaceInfo(userId);

            logger.End();
            return spaceInfo
                .LogNone(() => logger.Error("Retrieving info is none. User ID: {0} may have NOT been found!", userId))
                .Match(
                    info => info,
                    () => { throw new HttpResponseException(HttpStatusCode.InternalServerError); });
        }
    }
}
