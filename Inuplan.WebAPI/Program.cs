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
    using System;
    using Inuplan.WebAPI.CLI;
    using Microsoft.Owin.Hosting;
    using NLog;

    /// <summary>
    /// The web API server class
    /// </summary>
    public class Program
    {
        /// <summary>
        /// The logger
        /// </summary>
        private static ILogger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Default value if somehow no address is provided
        /// </summary>
        private const string defaultAddress = "http://localhost";

        /// <summary>
        /// Default value if no port has been given
        /// </summary>
        private const int defaultPort = 9000;

        /// <summary>
        /// The main function
        /// </summary>
        /// <param name="args">Arguments provided through the command-line interface</param>
        public static void Main(string[] args)
        {
            logger.Trace("Starting program with args: {0}", args);
            var parser = new Parser(defaultAddress, defaultPort);
            var input = parser.Parse(args);
            var baseAddress = input.ValueOr(defaultAddress);

            // Start OWIN host 
            using (WebApp.Start<Startup>(url: baseAddress))
            {
                parser.StartConsole(baseAddress);
            }
        }

    }
}
