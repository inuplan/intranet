//-----------------------------------------------------------------------
// <copyright file="ImageController.cs" company="Inuplan">
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
    using System;
    using System.Collections.Concurrent;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Inuplan.Common.Models;
    
    /// <summary>
    /// Image file controller
    /// </summary>
    public class ImageController : ApiController
    {
        /// <summary>
        /// An upload action handler
        /// </summary>
        /// <returns>Returns an http response message</returns>
        public async Task<HttpResponseMessage> Upload()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var user = RequestContext.Principal;
            var provider = await Request.Content.ReadAsMultipartAsync(new MultipartMemoryStreamProvider());
            var filesTmp = new ConcurrentBag<File>();

//             Parallel.ForEach(
//                 provider.Contents,
//                 async content =>
//                 {
//                     var stream = await content.ReadAsStreamAsync();
//                     var data = Tools.ReadFully(stream);
// 
//                     var filename = content.Headers.ContentDisposition.FileName;
//                     var mime = content.Headers.ContentType.MediaType;
//                     var created = DateTime.Now;
// 
//                     var file = new File
//                     {
//                         Data = data.SomeNotNull(),
//                         FileName = filename,
//                         MimeType = mime,
//                         Owner = null
//                     };
// 
//                     filesTmp.Add(file);
//                 });

            throw new NotImplementedException();
        }
    }
}
