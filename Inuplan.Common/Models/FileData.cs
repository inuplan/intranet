//-----------------------------------------------------------------------
// <copyright file="File.cs" company="Inuplan">
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

namespace Inuplan.Common.Models
{
    using System;

    /// <summary>
    /// A file on the server.
    /// </summary>
    public class FileData
    {
        /// <summary>
        /// Gets or sets the file ID
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// Gets or sets the file data
        /// </summary>
        public Lazy<byte[]> Data { get; set; }

        /// <summary>
        /// Gets or sets the path to the file
        /// </summary>
        public string Path { get; set; }
    }
}
