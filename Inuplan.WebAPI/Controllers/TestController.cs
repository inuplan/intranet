//-----------------------------------------------------------------------
// <copyright file="TestController.cs" company="Inuplan">
//    Original work Copyright (c) Inuplan
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy
//    of this software and associated documentation files (the "Software"), to deal
//    in the Software without restriction, including without limitation the rights
//    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//    copies of the Software, and to permit persons to whom the Software is
//    furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in
//    all copies or substantial portions of the Software.
// </copyright>
//-----------------------------------------------------------------------

namespace Inuplan.WebAPI.Controllers
{
    using Authorization.JWT;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    /// <summary>
    /// Image file controller
    /// </summary>
    [RoutePrefix("api")]
    public class TestController : ApiController
    {
        /// <summary>
        /// An upload action handler
        /// </summary>
        /// <returns>Returns an http response message</returns>
        [Route("test/hello")]
        [InuplanAuthorization]
        public async Task<HttpResponseMessage> Get()
        {
            // The full path is: localhost:9000/api/test/hello
            // Get owin context and add the bearer(token) to the response header
            // Or create a custom middleware that only checks upon returning a response
            // and then modifies the response by adding the bearer token into the header.
            return await Task.FromResult(Request.CreateResponse(HttpStatusCode.OK, "Hello World"));
        }
    }
}
