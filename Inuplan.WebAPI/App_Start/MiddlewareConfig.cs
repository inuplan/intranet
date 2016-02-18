//-----------------------------------------------------------------------
// <copyright file="MiddlewareConfig.cs" company="Inuplan">
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
    using Common.Mappers;
    using Common.Tools;
    using DAL.Repositories;
    using Inuplan.WebAPI.Middlewares.JWT;
    using Owin;

    /// <summary>
    /// Configures the <code>OWIN</code> middleware pipeline
    /// </summary>
    public static class MiddlewareConfig
    {
        /// <summary>
        /// Registers <code>OWIN</code> middleware
        /// </summary>
        /// <param name="config">The <see cref="HttpConfiguration"/></param>
        /// <param name="app">The <code>OWIN</code> component</param>
        public static void RegisterMiddlewares(HttpConfiguration config, IAppBuilder app)
        {
            JWTValidatorOptions validatorOptions;
            JWTClaimsRetrieverOptions claimsOptions;
            SetupOptions(out validatorOptions, out claimsOptions);

            // Owin pipeline
            app.Use<JWTValidator>(validatorOptions);
            app.Use<JWTClaimsRetriever>(claimsOptions);
        }

        /// <summary>
        /// Sets up options for the 2 middlewares
        /// </summary>
        /// <param name="validatorOptions">The validator middleware options</param>
        /// <param name="claimsOptions">The claims middleware options</param>
        private static void SetupOptions(out JWTValidatorOptions validatorOptions, out JWTClaimsRetrieverOptions claimsOptions)
        {
            // Setup signing
            var secretKey = ConfigurationManager.AppSettings["secret"];
            var sha256 = SHA256.Create();
            var key = sha256.ComputeHash(Helpers.GetBytes(secretKey));

            // Setup connections
            IDbConnection connection = new SqlConnection(GetConnectionString());
            var domain = ConfigurationManager.AppSettings["domain"];
            var principalContext = new PrincipalContext(ContextType.Domain, domain);

            // Setup middleware options
            var jsonMapper = new NewtonsoftMapper();
            validatorOptions = new JWTValidatorOptions { Mapper = jsonMapper, Secret = key };
            claimsOptions = new JWTClaimsRetrieverOptions
            {
                UserDatabaseRepository = new UserDatabaseRepository(connection),
                UserActiveDirectoryRepository = new UserADRepository(principalContext),
                Mapper = jsonMapper,
                Secret = key
            };
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
