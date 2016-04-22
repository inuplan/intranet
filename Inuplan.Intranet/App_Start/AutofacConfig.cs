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

namespace Inuplan.Intranet.App_Start
{
    using Autofac;
    using Autofac.Extras.Attributed;
    using Autofac.Integration.Mvc;
    using Common.Enums;
    using Factories;
    using Properties;
    using System;
    using System.Web.Mvc;

    public static class AutofacConfig
    {
        /// <summary>
        /// Registers all dependencies with <code>Autofac</code> IoC container.
        /// </summary>
        public static void RegisterContainer()
        {
            // Variables
            var builder = new ContainerBuilder();

            // Register controllers
            builder.RegisterControllers(typeof(MvcApplication).Assembly).WithAttributeFilter();

            // Register dependencies in filter attributes
            builder.RegisterFilterProvider();

            // Register dependencies in custom views
            builder.RegisterSource(new ViewRegistrationSource());

            // Register 
            builder.RegisterType<HttpClientFactory>().As<IHttpClientFactory>();
            builder.RegisterInstance(GetRemote()).Keyed<Uri>(ServiceKeys.RemoteBaseAddress).SingleInstance();

            // Build container
            var container = builder.Build();
 
            // Set MVC DI resolver to use our Autofac container
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }

        /// <summary>
        /// Retrieves the remote api endpoint url
        /// </summary>
        /// <returns></returns>
        private static Uri GetRemote()
        {
#if DEBUG
            return new Uri(Settings.Default.RemoteApiDebug);
#else
            return new Uri(Settings.Default.RemoteApiRelease);
#endif
        }
    }
}