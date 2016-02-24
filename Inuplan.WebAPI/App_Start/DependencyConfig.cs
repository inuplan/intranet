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
    using System;
    using System.Configuration;
    using System.Data;
    using System.Data.SqlClient;
    using System.Web.Http;
    using Autofac;
    using Autofac.Integration.WebApi;
    using Common.Enums;
    using Common.Factories;
    using Controllers;
    using DAL.Repositories;
    using Image.Factories;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Authorization.JWT;
    using System.Security.Cryptography;
    using Common.Tools;
    using Jose;
    using Common.Mappers;
    using System.DirectoryServices.AccountManagement;

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
            // Setup signing
            var secretKey = ConfigurationManager.AppSettings["secret"];
            var sha256 = SHA256.Create();
            var key = sha256.ComputeHash(Helpers.GetBytes(secretKey));

            var builder = new ContainerBuilder();

            // Register connection string
            builder.Register(ctx => new SqlConnection(GetConnectionString())).As<IDbConnection>();

            // Register Web API controllers
            builder.Register(ctx => new ManagementPostController(ctx.ResolveKeyed<IRepository<int, Post>>(ServiceKeys.ManagementPosts)));
            builder.Register(ctx =>
            {
                var imgRepo = ctx.ResolveKeyed<IRepository<Tuple<string, string, string>, Image>>(ServiceKeys.ImageRepository);
                var factory = ctx.Resolve<ImageHandleFactory>();
                return new ImageController(imgRepo, factory);
            });

            // Autofac filter provider for ImageController
            builder.RegisterWebApiFilterProvider(config);
            builder.Register(ctx =>
            {
                var mapper = ctx.Resolve<IJsonMapper>();
                var userDB = ctx.ResolveKeyed<IRepository<string, User>>(ServiceKeys.UserDatabase);
                var userAD = ctx.ResolveKeyed<IRepository<string, User>>(ServiceKeys.UserActiveDirectory);
                return new InuplanAuthorizationAttribute(key, mapper, userDB, userAD);
            })
            .AsWebApiAuthorizationFilterFor<ImageController>()
            .InstancePerRequest();
            

            // Register classes
            builder.Register(ctx =>
            {
                var root = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase);
                return new HandleFactory(mediumScaleFactor: 0.5, thumbnailWidth: 160, root: root, filenameLength: 5);
            }).As<ImageHandleFactory>();
            builder.Register(ctx => new NewtonsoftMapper()).As<IJsonMapper>();
            builder.Register(ctx => new PrincipalContext(ContextType.Domain, ConfigurationManager.AppSettings["domain"]));

            // Register repositories
            builder.Register(ctx => new ImageRepository(ctx.Resolve<IDbConnection>()))
                .Keyed<IRepository<Tuple<string, string, string>, Image>>(ServiceKeys.ImageRepository);
            builder.Register(ctx => new UserDatabaseRepository(ctx.Resolve<IDbConnection>())).Keyed<IRepository<string, User>>(ServiceKeys.UserDatabase);
            builder.Register(ctx => new UserADRepository(ctx.Resolve<PrincipalContext>())).Keyed<IRepository<string, User>>(ServiceKeys.UserActiveDirectory);

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
        
        /// <summary>
        /// Retrieves the connection string to the database.
        /// </summary>
        /// <returns>A connection string</returns>
        private static string GetConnectionString()
        {
#if DEBUG
            var connectionString = ConfigurationManager.AppSettings["localConnection"];
#else
            var connectionString = ConfigurationManager.AppSettings["connectionString"];
#endif
            return connectionString;
        }
    }
}
