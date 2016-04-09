//-----------------------------------------------------------------------
// <copyright file="Parser.cs" company="Inuplan">
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

namespace Inuplan.WebAPI.CLI
{
    using Optional;
    using CommandLine;
    using NLog;

    /// <summary>
    /// Command-line interface parser
    /// </summary>
    public class Parser
    {
        /// <summary>
        /// The logger
        /// </summary>
        private static ILogger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Default address if none has been given
        /// </summary>
        private readonly string defaultAddress;

        /// <summary>
        /// Default port if none has been given
        /// </summary>
        private readonly int defaultPort;

        /// <summary>
        /// Initializes a new instance of the <see cref="Parser"/> class.
        /// </summary>
        /// <param name="defaultAddress">The default address</param>
        /// <param name="defaultPort">The default port number</param>
        public Parser(string defaultAddress, int defaultPort)
        {
            this.defaultAddress = defaultAddress;
            this.defaultPort = defaultPort;
        }

        /// <summary>
        /// Parses user input to valid program input.
        /// </summary>
        /// <param name="input">The user input argument string</param>
        /// <returns>A valid program input string</returns>
        public Option<string> Parse(string[] input)
        {
            var parsed = CommandLine.Parser.Default.ParseArguments<ProgramOptions>(input);
            var options = parsed.MapResult(opt => opt.Some(), errors => Option.None<ProgramOptions>());

            var result = options.Map(opt =>
            {
                var address = !(string.IsNullOrEmpty(opt.BaseAddress)) ? opt.BaseAddress : defaultAddress;
                var port = (opt.ListenOnPort > 0) ? opt.ListenOnPort : defaultPort;

                return address + ":" + port;
            });

            return result;
        }
    }
}
