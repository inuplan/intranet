using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Inuplan.WebAPI.Middlewares.JWT;

namespace Inuplan.Tests.WebAPI.Middlewares
{
    using AppFunc = Func<IDictionary<string, object>, Task>;

    public class JWTValidatorTests
    {
        [Fact]
        public void Test()
        {
            Console.WriteLine("Test passed!");
        }
    }
}
