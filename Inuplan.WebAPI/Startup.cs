//-----------------------------------------------------------------------
// <copyright file="Startup.cs" company="Inuplan">
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

namespace Inuplan.WebAPI
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Inuplan.WebAPI.App_Start;
    using Owin;

    /// <summary>
    /// Startup class for the <code>OWIN</code> server.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Configuration setup for <code>OWIN</code>
        /// </summary>
        /// <param name="app">The application builder</param>
        public void Configuration(IAppBuilder app)
        {
            // Configure Web API for self-host.
            var config = new HttpConfiguration();

            // Register components
            RouteConfig.RegisterRoutes(config);
            DependencyConfig.RegisterContainer(config, app);
            MiddlewareConfig.RegisterMiddlewares(config, app);
        }
    }
}
