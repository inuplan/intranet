using Autofac.Integration.WebApi;
using Inuplan.Intranet.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Inuplan.Intranet
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Setup autofac for web api proxy
            config.DependencyResolver = new AutofacWebApiDependencyResolver(AutofacConfig.Container);

            // Setup attribute routing
            config.MapHttpAttributeRoutes();

            // Setup standard routes
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
