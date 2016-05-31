using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace Inuplan.Intranet.Core.Extensions
{
    public static class Helpers
    {
        public static string UsernameWithoutDomain(this ClaimsPrincipal principal)
        {
            var username = principal.Identity.Name;
            return username.Substring(username.LastIndexOf('\\') + 1);
        }
    }
}
