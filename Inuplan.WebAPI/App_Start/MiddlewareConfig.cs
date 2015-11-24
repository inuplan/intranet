//-----------------------------------------------------------------------
// <copyright file="MiddlewareConfig.cs" company="Inuplan">
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

namespace Inuplan.WebAPI.App_Start
{
    using System.Web.Http;
    using Owin;

    /// <summary>
    /// Configures the <code>OWIN</code> middleware pipeline
    /// </summary>
    public static class MiddlewareConfig
    {
        /// <summary>
        /// Registers <code>OWIN</code> middleware
        /// </summary>
        /// <param name="config">The <see cref="HttpConfiguration"/></param>
        /// <param name="app">The <code>OWIN</code> component</param>
        public static void RegisterMiddlewares(HttpConfiguration config, IAppBuilder app)
        {
            // Use DI in the OWIN middleware (on OwinMiddleWare classes)
            app.UseAutofacMiddleware(DependencyConfig.Container());

            // Extends the lifetimes from the middleware to go into the Web API
            app.UseAutofacWebApi(config);
            
            // Middleware pipeline
            app.UseWebApi(config);
        }
    }
}
