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

namespace Inuplan.WebAPI.Logger
{
    using System;
    using System.Runtime.CompilerServices;
    using NLog;

    public class NLogServiceWrapper<T> : Common.Logger.ILogger<T>
    {
        private readonly ILogger logger;

        public NLogServiceWrapper()
        {
            logger = LogManager.GetLogger(typeof(T).FullName);
        }

        public void Debug(string message)
        {
            logger.Debug(message);
        }

        public void Debug(string message, params object[] args)
        {
            logger.Debug(message, args);
        }

        public void End([CallerMemberName] string method = "")
        {
            logger.Debug("Method: {0}. END", method);
        }

        public void Error(string message)
        {
            logger.Error(message);
        }

        public void Error(Exception ex)
        {
            logger.Error(ex);
        }

        public void Error(string message, params object[] args)
        {
            logger.Error(message, args);
        }

        public void Info(string message)
        {
            logger.Info(message);
        }

        public void Info(string message, params object[] args)
        {
            logger.Info(message, args);
        }

        public void Begin([CallerMemberName] string method = "")
        {
            logger.Debug("Method: {0}. BEGIN", method);
        }

        public void Trace(string message)
        {
            logger.Trace(message);
        }

        public void Trace(string message, params object[] args)
        {
            logger.Trace(message, args);
        }
    }
}