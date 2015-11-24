//-----------------------------------------------------------------------
// <copyright file="DependencyConfig.cs" company="Inuplan">
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
    using System.Reflection;
    using System.Web.Http;
    using Autofac;
    using Autofac.Integration.WebApi;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Inuplan.DAL.Repositories;
    using Owin;

    /// <summary>
    /// Setup the configuration for the Inversion of Control container
    /// </summary>
    public static class DependencyConfig
    {
        private static IContainer container;

        /// <summary>
        /// Registers types and instances used in the <code>OWIN</code> application
        /// </summary>
        /// <param name="config">The <see cref="HttpConfiguration"/></param>
        /// <param name="app">The <code>OWIN</code> application builder</param>
        public static void RegisterContainer(HttpConfiguration config, IAppBuilder app)
        {
            var builder = new ContainerBuilder();

            // Register your Web API controllers.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // Register the Autofac filter provider.
            builder.RegisterWebApiFilterProvider(config);

            // Register types here...
            builder.RegisterType<PostRepository>().As<IRepository<int, Post>>();

            // Build container
            container = builder.Build();

            // Register Autofac Middleware
            app.UseAutofacMiddleware(container);

            // Set the dependency resolver
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        public static IContainer Container()
        {
            return container;
        }

    }
}
