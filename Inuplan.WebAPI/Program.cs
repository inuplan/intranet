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
    using Inuplan.WebAPI.CLI;
    using Microsoft.Owin.Hosting;
    using NLog;
    using System;
    using System.Threading;
    using System.Threading.Tasks;

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
        /// Default value if somehow no address is provided
        /// </summary>
        private const string defaultAddress = "http://localhost";

        /// <summary>
        /// Default value if no port has been given
        /// </summary>
        private const int defaultPort = 9000;

        /// <summary>
        /// The cancellation token source, which can stop the current web api.
        /// </summary>
        private CancellationTokenSource src;

        /// <summary>
        /// The main function
        /// </summary>
        /// <param name="args">Arguments provided through the command-line interface</param>
        public static void Main(string[] args)
        {
            var program = new Program();
            program.Start(args);
        }

        /// <summary>
        /// Starts the owin web api with the given arguments.
        /// <code>
        /// Usage:
        /// -a http://localhost  'defines the host on which to accept incoming requests'
        /// -p 9000              'defines the port on which to listen for incoming requests'
        /// </code>
        /// </summary>
        /// <param name="args">The arguments</param>
        public void Start(string[] args)
        {
            var parser = new Parser(defaultAddress, defaultPort);
            var input = parser.Parse(args);
            var baseAddress = input.ValueOr(defaultAddress);

            // Start OWIN host 
            using (WebApp.Start<Startup>(url: baseAddress))
            {
                Logger.Trace("Starting program with: {0}", baseAddress);
                Headless();
            }
        }

        /// <summary>
        /// Stops the program
        /// </summary>
        public void Stop()
        {
            src.Cancel();
        }

        /// <summary>
        /// The headless console
        /// </summary>
        private void Headless()
        {
            src = new CancellationTokenSource();
            var token = src.Token;

            Task.WaitAny(Task.Run(() =>
            {
                while (!token.IsCancellationRequested)
                {
                    Thread.Sleep(TimeSpan.FromSeconds(5));
                }
            }));
        }
    }
}
