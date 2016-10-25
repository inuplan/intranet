namespace Inuplan.WebAPI.Extensions
{
    using Microsoft.Owin;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public static class OwinContextHelpers
    {
        public static bool IsPreflightRequest(this IOwinContext ctx)
        {
            return ctx.Request.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase);
        }
    }
}
