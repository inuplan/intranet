//-----------------------------------------------------------------------
// <copyright file="ProgramOptions.cs" company="Inuplan">
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
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using CommandLine;

    /// <summary>
    /// Command-line interface options
    /// </summary>
    public class ProgramOptions
    {
        /// <summary>
        /// Gets or sets the base address of the <code>Web API</code>
        /// </summary>
        [Option('a', "address", Required = true, HelpText = "Sets the base address of the web api. Example: http://www.example.com")]
        public string BaseAddress { get; set; }

        /// <summary>
        /// Gets or sets the port which the <code>Web API</code> listens on
        /// </summary>
        [Option('p', "port", Required = true, HelpText = "Sets the port number of the web api. Example: 8080")]
        public int ListenOnPort { get; set; }
    }
}
