// MIT License (insert here...)

namespace Inuplan.Common.Mappers
{
    using Jose;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    public class NewtonsoftMapper : IJsonMapper
    {
        private readonly JsonSerializerSettings settings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            NullValueHandling = NullValueHandling.Ignore
        };

        public T Parse<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json, settings);
        }

        public string Serialize(object obj)
        {
            return JsonConvert.SerializeObject(obj, Formatting.Indented, settings);
        }
    }
}
