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
    using System;
    using Optional;
    using CommandLine;

    /// <summary>
    /// Command-line interface parser
    /// </summary>
    public class Parser
    {
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
                var address = !(string.IsNullOrEmpty(opt.BaseAddress.Trim())) ? opt.BaseAddress : string.Empty;
                var port = (opt.ListenOnPort > 0) ? opt.ListenOnPort : 9000;
                return address + ":" + port;
            });

            return result.Filter(path => !string.IsNullOrEmpty(path) && path.Length > 1);
        }

        /// <summary>
        /// Starts the console
        /// </summary>
        /// <param name="address">The address of the <code>Web API</code></param>
        public void StartConsole(string address)
        {
            Console.WriteLine("Inuplan A/S Web API listening on: {0}\n", address);

            var loop = true;

            while (loop)
            {
                Console.Write(@"API:\> ");
                var input = Console.ReadLine().ToLower();
                
                switch (input)
                {
                    case "info":
                        Console.WriteLine("API address: {0}", address);
                        break;
                    case "cls":
                    case "clear":
                        Console.Clear();
                        break;
                    case "?":
                    case "help":
                        Console.WriteLine("Type 'exit' or 'quit' to end the program.");
                        Console.WriteLine("Accepted commands: 'info', 'cls' or 'clear', '?' or 'help'.");
                        break;
                    case "quit":
                    case "exit":
                        Console.WriteLine("Exiting...");
                        loop = false;
                        break;
                }
            }            
        }
    }
}
