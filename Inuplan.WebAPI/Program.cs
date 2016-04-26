//-----------------------------------------------------------------------
// <copyright file="Program.cs" company="Inuplan">
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

namespace Inuplan.WebAPI
{
    using Microsoft.Owin.Hosting;
    using NLog;
    using Properties;
    using System;
    using Topshelf;

    /// <summary>
    /// The web API server class
    /// </summary>
    public class Program
    {
        /// <summary>
        /// The logger
        /// </summary>
        private static ILogger Logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The application web api.
        /// </summary>
        private IDisposable application;

        /// <summary>
        /// The main function
        /// </summary>
        /// <param name="args">Arguments provided through the command-line interface</param>
        public static void Main(string[] args)
        {
            HostFactory.Run(config =>
            {
                config.UseNLog();
                config.Service<Program>(service =>
                {
                    var address = GetAddress();
                    service.ConstructUsing(name => new Program());
                    service.WhenStarted(program => program.Start(address));
                    service.WhenStopped(program => program.Stop());
                });

                config.RunAsLocalSystem();
                config.SetDescription(Settings.Default.description);
                config.SetDisplayName("Inuplan Web API");
                config.SetServiceName("Inuplan.WebAPI");
                config.StartAutomatically();
            });
        }

        /// <summary>
        /// Retrieves the address from the settings file
        /// </summary>
        /// <returns></returns>
        private static string GetAddress()
        {
#if DEBUG
            return Settings.Default.addressDebug;
#else
            return Settings.Default.addressRelease;
#endif
        }

        /// <summary>
        /// Starts the owin web api with the given arguments.
        /// </summary>
        /// <param name="address"></param>
        public void Start(string address)
        {
            // Start OWIN host
            Logger.Trace("Starting OWIN katana on: {0}", address);
            application = WebApp.Start<Startup>(url: address);
        }

        /// <summary>
        /// Stops the program
        /// </summary>
        public void Stop()
        {
            Logger.Trace("Stopping service!");
            application.Dispose();
        }
    }
}
