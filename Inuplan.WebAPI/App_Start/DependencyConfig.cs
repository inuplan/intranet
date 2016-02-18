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
    using System.Configuration;
    using System.Data;
    using System.Data.SqlClient;
    using System.DirectoryServices.AccountManagement;
    using System.Security.Cryptography;
    using System.Web.Http;
    using Autofac;
    using Autofac.Integration.WebApi;
    using Common.Enums;
    using Common.Mappers;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Inuplan.Common.Tools;
    using Inuplan.DAL.Repositories;
    using Inuplan.WebAPI.Controllers;
    using Inuplan.WebAPI.Middlewares.JWT;
    using Jose;
    using NLog;
    using Owin;

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
        /// <param name="app">The <code>OWIN</code> application builder</param>
        public static void RegisterContainer(HttpConfiguration config, IAppBuilder app)
        {
            var builder = new ContainerBuilder();

            // Register Web API controllers
            builder.Register(ctx => new ManagementPostController(ctx.ResolveKeyed<IRepository<int, Post>>(ServiceKeys.ManagementPosts)));

            // Autofac filter provider
            builder.RegisterWebApiFilterProvider(config);

            // AD repository
            builder.Register(ctx => ConfigurationManager.AppSettings["domainName"]).Keyed<string>(ServiceKeys.DomainName);
            builder.Register(ctx => new PrincipalContext(ContextType.Domain, ctx.ResolveKeyed<string>(ServiceKeys.DomainName)));
            builder.RegisterType<UserADRepository>().Keyed<IRepository<string, User>>(ServiceKeys.UserActiveDirectory);

            // SQL repositories
#if DEBUG
            builder.Register(ctx => new SqlConnection(ConfigurationManager.AppSettings["localConnection"])).As<IDbConnection>().InstancePerRequest();
#else
            builder.Register(ctx => new SqlConnection(ConfigurationManager.AppSettings["connectionString"])).As<IDbConnection>().InstancePerRequest();
#endif
            builder.RegisterType<UserDatabaseRepository>().Keyed<IRepository<string, User>>(ServiceKeys.UserDatabase);
            builder.RegisterType<ManagementPostRepository>().Keyed<IRepository<int, Post>>(ServiceKeys.ManagementPosts);
            builder.RegisterType<GeneralPostRepository>().Keyed<IRepository<int, Post>>(ServiceKeys.GeneralPosts);

            // Middleware JWT key
            var sha256 = SHA256.Create();
            var secret = sha256.ComputeHash(Helpers.GetBytes(ConfigurationManager.AppSettings["secret"]));

            // Middleware JWT options
            builder.Register(ctx => new NewtonsoftMapper()).As<IJsonMapper>();
            builder.Register(ctx => new JWTValidatorOptions
            {
                Mapper = ctx.Resolve<IJsonMapper>(),
                Secret = secret,

            }).InstancePerRequest();
            builder.Register(ctx => new JWTClaimsRetrieverOptions
            {
                UserDatabaseRepository = ctx.ResolveKeyed<IRepository<string, User>>(ServiceKeys.UserDatabase),
                UserActiveDirectoryRepository = ctx.ResolveKeyed<IRepository<string, User>>(ServiceKeys.UserActiveDirectory),
                Mapper = ctx.Resolve<IJsonMapper>(),
                Secret = secret
            }).InstancePerRequest();

            // Build container
            container = builder.Build();

            // Autofac Middleware
            app.UseAutofacMiddleware(container);

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
