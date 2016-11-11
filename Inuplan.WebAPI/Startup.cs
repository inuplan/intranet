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

namespace Inuplan.WebAPI
{
    using App_Start;
    using Autofac;
    using Autofac.Integration.WebApi;
    using Common.Commands;
    using Common.Enums;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using Common.WebSockets;
    using Extensions;
    using Middlewares;
    using Middlewares.Options;
    using NLog;
    using Owin;
    using Properties;
    using System;
    using System.Net;
    using System.Web.Http;
    using System.Web.Http.Cors;

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
            var autofac = (AutofacWebApiDependencyResolver)config.DependencyResolver;

            EnableWebSocketServer(app, autofac);
            EnableMiddleware(app, autofac.Container);

            Logger.Trace("Register controllers with IoC");
            app.UseWebApi(config);
        }

        /// <summary>
        /// Enables CORS if it is set in the settings
        /// </summary>
        /// <param name="config">The config file</param>
        private static void EnableCors(HttpConfiguration config)
        {
            if (Settings.Default.enableCORS)
            {
                Logger.Trace("Enable Cross-Origin Resource Sharing (CORS)");
                var cors = new EnableCorsAttribute(Constants.Origin, "*", "*");
                config.EnableCors(cors);
            }
        }

        /// <summary>
        /// Enables windows authentication for all requests except if method is <code>OPTIONS</code>.
        /// </summary>
        /// <param name="app">The application builder</param>
        /// <param name="config">The http configuration</param>
        private static void EnableWindowsAuthentication(IAppBuilder app, HttpConfiguration config)
        {
            Logger.Trace("Reading settings, whether to use win-auth: {0}", Settings.Default.enableWin);
            if (!Settings.Default.enableWin) return;

            Logger.Trace("Enable win-auth except when using OPTIONS method");
            listener = app.Properties["System.Net.HttpListener"] as HttpListener;
            listener.AuthenticationSchemeSelectorDelegate = SchemeSelector;
        }

        /// <summary>
        /// Enables server to handle websocket upgrade requests.
        /// </summary>
        /// <param name="app">The application builder</param>
        /// <param name="autofac">The dependency resolver</param>
        private static void EnableWebSocketServer(IAppBuilder app, AutofacWebApiDependencyResolver autofac)
        {
            Logger.Trace("Configuring websocket server...");
            var resolver = autofac.GetRootLifetimeScope();
            var option = resolver.Resolve<WebSocketOption>();

            Logger.Trace("Setting middleware handler for websocket requests...");
            app.UseWebSocketMiddleware(option);
        }

        /// <summary>
        /// Enables middleware if it has been set in the settings file
        /// </summary>
        /// <param name="app">The application</param>
        /// <param name="config">The config file</param>
        private static void EnableMiddleware(IAppBuilder app, ILifetimeScope container)
        {
            if (Settings.Default.enableMiddleware)
            {
                // If request is NOT options then use manageusermiddleware
                Logger.Trace("Setting OWIN middleware pipeline");
                app.UseAutofacLifetimeScopeInjector(container);
                app.UseMiddlewareFromContainer<ManageUserMiddleware>();
            }
        }

        /// <summary>
        /// Enable windows authentication and allow http method OPTIONS to use anonymous authentication.
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

                if (request.IsWebSocketRequest)
                {
                    Logger.Trace("Using authentication scheme: Anonymous for WebSocketRequest");
                    return AuthenticationSchemes.Anonymous;
                }

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
            catch (Exception ex)
            {
                Logger.Error(ex);
                throw;
            }
        }
    }
}
