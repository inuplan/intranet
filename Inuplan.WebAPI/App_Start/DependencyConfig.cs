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
    using Autofac;
    using Autofac.Extras.Attributed;
    using Autofac.Integration.WebApi;
    using Common.Enums;
    using Common.Factories;
    using Common.Mappers;
    using Controllers;
    using DAL.Repositories;
    using Image.Factories;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Jose;
    using Middlewares;
    using Mocks;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Data;
    using System.Data.SqlClient;
    using System.DirectoryServices.AccountManagement;
    using System.Web.Http;

    /// <summary>
    /// Setup the configuration for the Inversion of Control container
    /// </summary>
    public static class DependencyConfig
    {
        /// <summary>
        /// Registers types and instances used in the <code>OWIN</code> application
        /// </summary>
        /// <param name="config">The <see cref="HttpConfiguration"/></param>
        public static void RegisterContainer(HttpConfiguration config)
        {
            // Setup variables
            var root = ConfigurationManager.AppSettings["root"];
            var connectionString = GetConnectionString();
            var domain = ConfigurationManager.AppSettings["domain"];

            // Create builder
            var builder = new ContainerBuilder();

            // Register connection
            builder.Register(ctx =>
            {
                var connection = new SqlConnection(connectionString);
                connection.Open();
                return connection;
            }).As<IDbConnection>().InstancePerDependency();

            // Register Web API controllers
            builder.RegisterType<RoleController>().WithAttributeFilter();
            builder.RegisterType<UserImageController>().WithAttributeFilter();
            builder.RegisterType<UserController>().WithAttributeFilter();

            // Register classes and keys
            builder.RegisterInstance(root).Keyed<string>(ServiceKeys.RootPath);
            builder.RegisterType<NewtonsoftMapper>().As<IJsonMapper>();
            builder.RegisterType<HandleFactory>().WithAttributeFilter().As<ImageHandleFactory>();
            builder.Register(ctx => new PrincipalContext(ContextType.Domain, domain));

            // Register repositories
            builder.RegisterType<RoleRepository>().As<IScalarRepository<int, Role>>();
            builder.RegisterType<UserImageRepository>().WithAttributeFilter().As<IScalarRepository<int, Image>>();
            builder.RegisterType<ImageCommentRepository>().As<IVectorRepository<int, Comment>>();
            builder.RegisterType<UserDatabaseRepository>().Keyed<IScalarRepository<string, User>>(ServiceKeys.UserDatabase);
            //builder.RegisterType<UserADRepository>().Keyed<IScalarRepository<string, User>>(ServiceKeys.UserActiveDirectory);
            builder.RegisterType<NoADRepo>().Keyed<IScalarRepository<string, User>>(ServiceKeys.UserActiveDirectory);

            // Use autofac owin pipeline
            OwinPipeline(builder);

            // Build container
            var container = builder.Build();

            // Set the dependency resolver
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        /// <summary>
        /// Constructs the owin pipeline, from the <see cref="Microsoft.Owin.OwinMiddleware"/> objects.
        /// </summary>
        /// <param name="builder">The autofac container builder</param>
        private static void OwinPipeline(ContainerBuilder builder)
        {
            // Owin middleware pipeline - order matters
            builder.RegisterType<ManageUserMiddleware>().WithAttributeFilter();
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
