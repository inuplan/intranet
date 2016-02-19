using Inuplan.Common.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Text;

namespace Inuplan.Common.DTOs
{
    public class ClaimsDTO
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Verified { get; set; }
        public string Email { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public RoleType Role { get; set; }

        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.AppendFormat("Username: {0}", Username);
            sb.AppendFormat("First name: {0}\nLast name: {1}", FirstName, LastName);
            sb.AppendFormat("Is verified: {0}", Verified);
            sb.AppendFormat("Email address: {0}", Email);
            sb.AppendFormat("Role: {0}", Role);
            return sb.ToString();
        }
    }
}
