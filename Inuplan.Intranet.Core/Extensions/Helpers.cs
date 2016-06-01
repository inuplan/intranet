using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Security.Principal;

namespace Inuplan.Intranet.Core.Extensions
{
    public static class Helpers
    {
        public static string UsernameWithoutDomain(this IIdentity identity)
        {
            var username = identity.Name;
            return username.Substring(username.LastIndexOf('\\') + 1);
        }
    }
}
