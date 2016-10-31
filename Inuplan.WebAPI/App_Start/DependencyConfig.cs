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

namespace Inuplan.WebAPI.App_Start
{
    using Autofac;
    using Autofac.Extras.Attributed;
    using Autofac.Integration.WebApi;
    using Common.Commands;
    using Common.Enums;
    using Common.Factories;
    using Common.Logger;
    using Common.Models;
    using Common.Models.Forum;
    using Common.Queries;
    using Common.Queries.UserSpaceInfoQueries;
    using Common.Repositories;
    using Common.WebSockets;
    using Controllers;
    using Controllers.Diagnostics;
    using Controllers.Forum;
    using Controllers.Images;
    using Controllers.Users;
    using DAL.ForumPost.Commands;
    using DAL.Repositories;
    using DAL.Repositories.Forum;
    using DAL.WhatsNew.Commands;
    using DAL.WhatsNew.Queries;
    using Image.Factories;
    using Logger;
    using Middlewares;
    using Middlewares.Options;
    using Properties;
    using System.Data;
    using System.Data.SqlClient;
    using System.DirectoryServices.AccountManagement;
    using System.Web.Http;
    using WebSocketServices;

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
            builder.RegisterType<ForumTitleController>().WithAttributeFilter();
            builder.RegisterType<ForumPostController>().WithAttributeFilter();
            builder.RegisterType<ForumCommentController>().WithAttributeFilter();

            // Register classes and keys
            builder.RegisterType<AddWhatsNewItem>().As<IAddItem>();
            builder.RegisterType<DeleteItem>().As<IDeleteItem>();
            builder.RegisterType<MarkPost>().As<IMarkPost>();
            builder.RegisterType<GetPage>().As<IGetPage>();
            builder.RegisterInstance(root).Keyed<string>(ServiceKeys.RootPath);
            builder.RegisterType<HandleFactory>().WithAttributeFilter().As<ImageHandleFactory>();
            builder.Register(ctx => new PrincipalContext(ContextType.Domain, domain));
            builder.RegisterGeneric(typeof(NLogServiceWrapper<>)).As(typeof(ILogger<>));

            // Register repositories
            builder.RegisterType<RoleRepository>().As<IScalarRepository<int, Role>>();
            builder.RegisterType<UserImageRepository>().WithAttributeFilter().As<IScalarRepository<int, Image>>();
            builder.RegisterType<ImageCommentRepository>().As<IVectorRepository<int, Comment>>();
            builder.RegisterType<UserDatabaseRepository>().Keyed<IScalarRepository<string, User>>(ServiceKeys.UserDatabase);
            builder.RegisterType<UserRoleRepository>().Keyed<IScalarRepository<int, User>>(ServiceKeys.UserRoleRepository);
            builder.RegisterType<ForumPostTitleRepository>().Keyed<IScalarRepository<int, ThreadPostTitle>>(ServiceKeys.ThreadPostTitleRepository);
            builder.RegisterType<ForumPostContentRepository>().Keyed<IScalarRepository<int, ThreadPostContent>>(ServiceKeys.ThreadPostContentRepository);
            builder.RegisterType<ForumCommentsRepository>().Keyed<IVectorRepository<int, Comment>>(ServiceKeys.ForumCommentsRepository);

            #region "Register Active Directory"
#if DEBUG
            builder.RegisterType<Mocks.NoADRepo>().Keyed<IScalarRepository<string, User>>(ServiceKeys.UserActiveDirectory);
#else
            builder.RegisterType<UserADRepository>().Keyed<IScalarRepository<string, User>>(ServiceKeys.UserActiveDirectory);
#endif
            #endregion

            // Register web socket services
            builder.RegisterType<LatestBroadcastService>().WithAttributeFilter();
            builder
                .Register(ctx => new HubSession("latest", ctx.Resolve<ILogger<HubSession>>()))
                .Keyed<IWebSocketHubSession>(ServiceKeys.LatestHub)
                .SingleInstance();

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
            // Owin middleware options
            builder
                .RegisterType<ManageUserOption>()
                .WithAttributeFilter()
                .WithParameter(new TypedParameter(typeof(int), Settings.Default.quotaKB));

            // Owin middleware pipeline
            builder.RegisterType<ManageUserMiddleware>();
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
