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
    using Common.Commands;
    using Common.Enums;
    using Common.Factories;
    using Common.Models;
    using Common.Queries;
    using Common.Repositories;
    using Controllers;
    using DAL.Repositories;
    using DAL.WhatsNew.Commands;
    using DAL.WhatsNew.Queries;
    using Image.Factories;
    using Middlewares;
    using Properties;
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
            var root = Settings.Default.root;
            var connectionString = GetConnectionString();
            var domain = Settings.Default.domain;

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
            builder.RegisterType<UserRolesController>().WithAttributeFilter();
            builder.RegisterType<DiagnosticController>().WithAttributeFilter();
            builder.RegisterType<ImageCommentController>().WithAttributeFilter();
            builder.RegisterType<WhatsNewController>().WithAttributeFilter();

            // Register classes and keys
            builder.RegisterType<AddImageUpload>().As<IAddImageUpload>();
            builder.RegisterType<AddImageComment>().As<IAddImageComment>();
            builder.RegisterType<DeleteItem>().As<IDeleteItem>();
            builder.RegisterType<GetPage>().As<IGetPage>();
            builder.RegisterInstance(root).Keyed<string>(ServiceKeys.RootPath);
            builder.RegisterType<HandleFactory>().WithAttributeFilter().As<ImageHandleFactory>();
            builder.Register(ctx => new PrincipalContext(ContextType.Domain, domain));

            // Register repositories
            builder.RegisterType<RoleRepository>().As<IScalarRepository<int, Role>>();
            builder.RegisterType<UserImageRepository>().WithAttributeFilter().As<IScalarRepository<int, Image>>();
            builder.RegisterType<ImageCommentRepository>().As<IVectorRepository<int, ImageComment>>();
            builder.RegisterType<UserDatabaseRepository>().Keyed<IScalarRepository<string, User>>(ServiceKeys.UserDatabase);
            builder.RegisterType<UserRoleRepository>().Keyed<IScalarRepository<int, User>>(ServiceKeys.UserRoleRepository);

            #region "Register Active Directory"
#if DEBUG
            builder.RegisterType<Mocks.NoADRepo>().Keyed<IScalarRepository<string, User>>(ServiceKeys.UserActiveDirectory);
#else
            builder.RegisterType<UserADRepository>().Keyed<IScalarRepository<string, User>>(ServiceKeys.UserActiveDirectory);
#endif
            #endregion

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
            var connectionString = Settings.Default.connectionStringDebug;
#else
            var connectionString = Settings.Default.connectionStringRelease;
#endif
            return connectionString;
        }
    }
}
