﻿// Copyright © 2015 Inuplan
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

namespace Inuplan.Service
{
    using NLog;
    using System;
    using System.Configuration.Install;
    using System.Reflection;
    using System.ServiceProcess;

    static class Program
    {
        private static Logger Logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            if(Environment.UserInteractive)
            {
                try
                {
                    Logger.Debug("User interactive mode");
                    string parameter = string.Concat(args);
                    string executablePath = Assembly.GetExecutingAssembly().Location;
                    Logger.Trace("Executable path:\t {0}", executablePath);
                    switch (parameter)
                    {
                        case "--install":
                            Logger.Info("Installing service...");
                            ManagedInstallerClass.InstallHelper(new[] { executablePath });
                            Logger.Info("Finished installation");
                            break;
                        case "--uninstall":
                            Logger.Info("Uninstalling service...");
                            ManagedInstallerClass.InstallHelper(new[] { "/u", executablePath });
                            Logger.Info("Finished uninstall");
                            break;
                    }
                }
                catch (InvalidOperationException ex)
                {
                    Logger.Error(ex);
                    throw;
                }
            }
            else
            {
                Logger.Debug("Non-interactive mode");
                Logger.Trace("Constructing service...");
                ServiceBase[] ServicesToRun;
                ServicesToRun = new ServiceBase[]
                {
                    new WebAPIService()
                };

                ServiceBase.Run(ServicesToRun);
            }
        }
    }
}
