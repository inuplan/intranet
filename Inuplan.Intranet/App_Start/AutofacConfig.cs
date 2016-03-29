﻿// Copyright © 2015 Inuplan
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
    using Common.Tools;
    using Factories;
    using System;
    using System.Configuration;
    using System.Security.Cryptography;
    using System.Threading;
    using System.Web.Mvc;

    public static class AutofacConfig
    {
        private static int first = 1;
        private static IContainer container;

        public static void RegisterContainer()
        {
            if(1 != Interlocked.Exchange(ref first, 0))
            {
                // Is not the first time
                return;
            }

            // Variables
            var secretKey = ConfigurationManager.AppSettings["secret"];
            var key = SHA256.Create().ComputeHash(Helpers.GetBytes(secretKey));
            var domain = ConfigurationManager.AppSettings["domain"];

            var builder = new ContainerBuilder();

            // Register controllers
            builder.RegisterControllers(typeof(MvcApplication).Assembly).WithAttributeFilter();

            // Register dependencies in filter attributes
            builder.RegisterFilterProvider();

            // Register dependencies in custom views
            builder.RegisterSource(new ViewRegistrationSource());

            // Register 
            builder.Register(ctx => new HttpClientFactory(new WeakReference<System.Net.Http.HttpClient>(new System.Net.Http.HttpClient()))).As<IHttpClientFactory>();
            builder.RegisterInstance(new Uri(GetRemote())).Keyed<Uri>(ServiceKeys.RemoteBaseAddress);

            // Build container
            container = builder.Build();
            Container = container;
 
            // Set MVC DI resolver to use our Autofac container
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }

        public static IContainer Container { get
            {
                RegisterContainer();
                return container;
            }
            private set
            {
                container = value;
            }
        }

        private static string GetRemote()
        {
#if DEBUG
            return ConfigurationManager.AppSettings["remoteAPIDebug"];
#else
            return ConfigurationManager.AppSettings["remoteAPI"];
#endif
        }
    }
}