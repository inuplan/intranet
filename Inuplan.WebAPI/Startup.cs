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
    using Autofac.Integration.WebApi;
    using App_Start;
    using Owin;
    using System.Net;
    using System.Web.Http;

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

            // Enable win-auth except when using OPTIONS method
            EnableWindowsAuthenticationWithCorsOptions(app, config);

            // Register components
            RouteConfig.RegisterRoutes(config);
            DependencyConfig.RegisterContainer(config);
            var autofac = (AutofacWebApiDependencyResolver)config.DependencyResolver;

            // Owin middleware pipeline
            app.UseAutofacMiddleware(autofac.Container);

            // Controllers
            app.UseWebApi(config);
        }

        /// <summary>
        /// Enables windows authentication for all requests except if method is <code>OPTIONS</code>.
        /// </summary>
        /// <param name="app">The application builder</param>
        private static void EnableWindowsAuthenticationWithCorsOptions(IAppBuilder app, HttpConfiguration config)
        {
            // Enable Cross-Origin Resource Sharing (CORS)
            config.EnableCors();

            // Enable windows authentication and allow http method OPTIONS through
            // Reason: CORS preflight request sends an OPTIONS request for non-idempotent request
            // (PUT, POST, DELETE, etc.) and browsers cannot respond to a 401 challenge.
            // Therefore anonymous pass-through must be allowed for preflight requests!
            var listener = app.Properties["System.Net.HttpListener"] as HttpListener;
            listener.AuthenticationSchemeSelectorDelegate = (request) =>
            {
                if (request.HttpMethod.Equals("OPTIONS", System.StringComparison.OrdinalIgnoreCase))
                {
                    return AuthenticationSchemes.Anonymous;
                }
                else
                {
                    return AuthenticationSchemes.IntegratedWindowsAuthentication;
                }
            };
        }
    }
}
