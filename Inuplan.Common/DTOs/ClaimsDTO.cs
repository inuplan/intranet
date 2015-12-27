using Inuplan.Common.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inuplan.Common.DTOs
{
    public class ClaimsDTO
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public RoleType Role { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Verified { get; set; }
        public string Email { get; set; }
    }
}
