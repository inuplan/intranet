﻿//-----------------------------------------------------------------------
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
    using System.Web.Http;
    using Autofac;
    using Autofac.Integration.WebApi;
    using Common.Enums;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Inuplan.WebAPI.Controllers;

    /// <summary>
    /// Setup the configuration for the Inversion of Control container
    /// </summary>
    public static class DependencyConfig
    {
        /// <summary>
        /// The autofac IoC container
        /// </summary>
        private static IContainer container;

        /// <summary>
        /// Registers types and instances used in the <code>OWIN</code> application
        /// </summary>
        /// <param name="config">The <see cref="HttpConfiguration"/></param>
        public static void RegisterContainer(HttpConfiguration config)
        {
            var builder = new ContainerBuilder();

            // Register Web API controllers
            builder.Register(ctx => new ManagementPostController(ctx.ResolveKeyed<IRepository<int, Post>>(ServiceKeys.ManagementPosts)));

            // Autofac filter provider
            builder.RegisterWebApiFilterProvider(config);

            // Build container
            container = builder.Build();

            // Set the dependency resolver
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        /// <summary>
        /// Exposes the dependency injection container
        /// </summary>
        /// <returns>An autofac IoC container</returns>
        public static IContainer Container()
        {
            return container;
        }
    }
}
