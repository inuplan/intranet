using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Inuplan.Tests.IntegrationTests
{
    public class WebAPITests
    {
        [Fact]
        public void ProgramRunningTest()
        {
            try
            {
                var api = new WebAPI.Program();

                Task.Run(() =>
                {
                    api.Start(new string[] { });
                });

                Thread.Sleep(TimeSpan.FromMinutes(5));
                api.Stop();
                Thread.Sleep(TimeSpan.FromSeconds(10));
                Console.WriteLine("Stopped...");
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
