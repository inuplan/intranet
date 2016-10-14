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
    using App_Start;
    using Autofac;
    using Autofac.Integration.WebApi;
    using NLog;
    using Owin;
    using Properties;
    using System;
    using System.Net;
    using System.Web.Http;

    /// <summary>
    /// Startup class for the <code>OWIN</code> server.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// The logging framework
        /// </summary>
        private static ILogger Logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The http listener
        /// </summary>
        private static HttpListener listener;

        /// <summary>
        /// Configuration setup for <code>OWIN</code>
        /// </summary>
        /// <param name="app">The application builder</param>
        public void Configuration(IAppBuilder app)
        {
            Logger.Info("Configuring Web API for self-hosting.");
            var config = new HttpConfiguration();

            EnableCors(config);
            EnableWindowsAuthentication(app, config);

            Logger.Trace("Register components");
            RouteConfig.RegisterRoutes(config);
            DependencyConfig.RegisterContainer(config);

            EnableMiddleware(app, config);

            Logger.Trace("Register controllers with IoC");
            app.UseWebApi(config);
        }

        /// <summary>
        /// Enables CORS if it is set in the settings
        /// </summary>
        /// <param name="config">The config file</param>
        private static void EnableCors(HttpConfiguration config)
        {
            if(Settings.Default.enableCORS)
            {
                Logger.Trace("Enable Cross-Origin Resource Sharing (CORS)");
                config.EnableCors();
            }
        }

        /// <summary>
        /// Enables windows authentication for all requests except if method is <code>OPTIONS</code>.
        /// </summary>
        /// <param name="app">The application builder</param>
        private static void EnableWindowsAuthentication(IAppBuilder app, HttpConfiguration config)
        {
            Logger.Trace("Reading settings, whether to use win-auth: {0}", Settings.Default.enableWin);
            if (!Settings.Default.enableWin) return;

            Logger.Trace("Enable win-auth except when using OPTIONS method");
            listener = app.Properties["System.Net.HttpListener"] as HttpListener;
            listener.AuthenticationSchemeSelectorDelegate = SchemeSelector;
        }

        /// <summary>
        /// Enables middleware if it has been set in the settings file
        /// </summary>
        /// <param name="app">The application</param>
        /// <param name="config">The config file</param>
        private static void EnableMiddleware(IAppBuilder app, HttpConfiguration config)
        {
            if(Settings.Default.enableMiddleware)
            {
                Logger.Trace("Setting OWIN middleware pipeline");
                var autofac = (AutofacWebApiDependencyResolver)config.DependencyResolver;
                app.UseAutofacMiddleware(autofac.Container);
            }
        }

        /// <summary>
        /// Enable windows authentication and allow http method OPTIONS through
        /// Reason: CORS preflight request sends an OPTIONS request for non-idempotent request
        /// (PUT, POST, DELETE, etc.) and browsers cannot respond to a 401 challenge.
        /// Therefore anonymous pass-through must be allowed for preflight requests!
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private static AuthenticationSchemes SchemeSelector(HttpListenerRequest request)
        {
            try
            {
                if (request.HttpMethod.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
                {
                    // Using Anonymous for OPTIONS because browsers require that
                    // a CORS preflight request of type OPTIONS should be answered with a non 401-challenge.
                    Logger.Trace("Using authentication scheme: Anonymous, incoming request from: {0}", request.RemoteEndPoint.Address);
                    return AuthenticationSchemes.Anonymous;
                }
                else if(request.IsWebSocketRequest)
                {
                    Logger.Trace("Using authentication scheme: Anonymous for WebSocketRequest");
                    return AuthenticationSchemes.Anonymous;
                }
                else
                {
                    // Using NTLM because Integrated = Negotiate + NTLM
                    // If Negotiate can access the Kerberos tickets, it will use that instead of NTLM
                    // The difference is between  vpn users and internal users
                    // where vpn users will use NTLM authentication
                    // whereas internal users will use Kerberos protocol.
                    // Chrome currently doesn't seem to support the Kerberos protocol out-of-the-box.
                    // ------
                    // In short: Use NTLM
                    Logger.Trace("Using authentication scheme: NTLM, incoming request from: {0}", request.RemoteEndPoint.Address);
                    return AuthenticationSchemes.Ntlm;
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                throw;
            }
        }
    }
}
