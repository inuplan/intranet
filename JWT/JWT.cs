using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using Optional;
using Optional.Unsafe;

namespace JWT
{
    public enum JwtHashAlgorithm
    {
        HS256,
        HS384,
        HS512
    }

    /// <summary>
    /// Provides methods for encoding and decoding JSON Web Tokens.
    /// </summary>
    public static class JsonWebToken
    {
        private static readonly IDictionary<JwtHashAlgorithm, Func<byte[], byte[], byte[]>> HashAlgorithms;

        /// <summary>
        /// Pluggable JSON Serializer
        /// </summary>
        public static IJsonSerializer JsonSerializer = new DefaultJsonSerializer();

        private static readonly DateTime UnixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);

        static JsonWebToken()
        {
            HashAlgorithms = new Dictionary<JwtHashAlgorithm, Func<byte[], byte[], byte[]>>
            {
                { JwtHashAlgorithm.HS256, (key, value) => { using (var sha = new HMACSHA256(key)) { return sha.ComputeHash(value); } } },
                { JwtHashAlgorithm.HS384, (key, value) => { using (var sha = new HMACSHA384(key)) { return sha.ComputeHash(value); } } },
                { JwtHashAlgorithm.HS512, (key, value) => { using (var sha = new HMACSHA512(key)) { return sha.ComputeHash(value); } } }
            };
        }

        /// <summary>
        /// Creates a JWT given a header, a payload, the signing key, and the algorithm to use.
        /// </summary>
        /// <param name="extraHeaders">An arbitrary set of extra headers. Will be augmented with the standard "typ" and "alg" headers.</param>
        /// <param name="payload">An arbitrary payload (must be serializable to JSON via <see cref="System.Web.Script.Serialization.JavaScriptSerializer"/>).</param>
        /// <param name="key">The key bytes used to sign the token.</param>
        /// <param name="algorithm">The hash algorithm to use.</param>
        /// <returns>The generated JWT.</returns>
        public static string Encode(IDictionary<string, object> extraHeaders, object payload, byte[] key, JwtHashAlgorithm algorithm)
        {
            var segments = new List<string>();
            var header = new Dictionary<string, object>(extraHeaders)
            {
                { "typ", "JWT" },
                { "alg", algorithm.ToString() }
            };

            byte[] headerBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(header));
            byte[] payloadBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(payload));

            segments.Add(Base64UrlEncode(headerBytes));
            segments.Add(Base64UrlEncode(payloadBytes));

            var stringToSign = string.Join(".", segments.ToArray());

            var bytesToSign = Encoding.UTF8.GetBytes(stringToSign);

            byte[] signature = HashAlgorithms[algorithm](key, bytesToSign);
            segments.Add(Base64UrlEncode(signature));

            return string.Join(".", segments.ToArray());
        }

        /// <summary>
        /// Creates a JWT given a payload, the signing key, and the algorithm to use.
        /// </summary>
        /// <param name="payload">An arbitrary payload (must be serializable to JSON via <see cref="System.Web.Script.Serialization.JavaScriptSerializer"/>).</param>
        /// <param name="key">The key used to sign the token.</param>
        /// <param name="algorithm">The hash algorithm to use.</param>
        /// <returns>The generated JWT.</returns>
        public static string Encode(object payload, byte[] key, JwtHashAlgorithm algorithm)
        {
            return Encode(new Dictionary<string, object>(), payload, key, algorithm);
        }

        /// <summary>
        /// Creates a JWT given a set of arbitrary extra headers, a payload, the signing key, and the algorithm to use.
        /// </summary>
        /// <param name="extraHeaders">An arbitrary set of extra headers. Will be augmented with the standard "typ" and "alg" headers.</param>
        /// <param name="payload">An arbitrary payload (must be serializable to JSON via <see cref="System.Web.Script.Serialization.JavaScriptSerializer"/>).</param>
        /// <param name="key">The key bytes used to sign the token.</param>
        /// <param name="algorithm">The hash algorithm to use.</param>
        /// <returns>The generated JWT.</returns>
        public static string Encode(IDictionary<string, object> extraHeaders, object payload, string key, JwtHashAlgorithm algorithm)
        {
            return Encode(extraHeaders, payload, Encoding.UTF8.GetBytes(key), algorithm);
        }

        /// <summary>
        /// Creates a JWT given a payload, the signing key, and the algorithm to use.
        /// </summary>
        /// <param name="payload">An arbitrary payload (must be serializable to JSON via <see cref="System.Web.Script.Serialization.JavaScriptSerializer"/>).</param>
        /// <param name="key">The key used to sign the token.</param>
        /// <param name="algorithm">The hash algorithm to use.</param>
        /// <returns>The generated JWT.</returns>
        public static string Encode(object payload, string key, JwtHashAlgorithm algorithm)
        {
            return Encode(new Dictionary<string, object>(), payload, Encoding.UTF8.GetBytes(key), algorithm);
        }

        /// <summary>
        /// Given a JWT, decode it and return the JSON payload.
        /// </summary>
        /// <param name="token">The JWT.</param>
        /// <param name="key">The key bytes that were used to sign the JWT.</param>
        /// <param name="verify">Whether to verify the signature (default is true).</param>
        /// <param name="onInvalidSignature">An action delegate which takes the expected signature and the actual signature as parameters</param>
        /// <returns>A string containing the JSON payload.</returns>
        public static Option<string> Decode(string token, byte[] key, Action<string, string> onInvalidSignature, Action<double> onExpired, Action<string, object> onError, bool verify = true)
        {
            var result = Option.None<string>();
            var parts = token.Split('.');
            if (parts.Length != 3)
            {
                onError("Token must consist from 3 delimited by dot parts", parts);
                return result;
            }

            var header = parts[0];
            var payload = parts[1];
            var crypto = Base64UrlDecode(parts[2]);

            var headerJson = Encoding.UTF8.GetString(Base64UrlDecode(header));
            var payloadJson = Encoding.UTF8.GetString(Base64UrlDecode(payload));

            var headerData = JsonSerializer.Deserialize<Dictionary<string, object>>(headerJson);

            if (verify)
            {
                var bytesToSign = Encoding.UTF8.GetBytes(string.Concat(header, ".", payload));
                var algorithm = (string)headerData["alg"];
                
                var provided_alg = GetHashAlgorithm(algorithm, onError).ValueOrFailure();
                var signature = HashAlgorithms[provided_alg](key, bytesToSign);
                var decodedCrypto = Convert.ToBase64String(crypto);
                var decodedSignature = Convert.ToBase64String(signature);

                result = Verify(decodedCrypto, decodedSignature, payloadJson, onInvalidSignature, onExpired, onError);
            }

            return result;
        }

        private static Option<string> Verify(string decodedCrypto, string decodedSignature, string payloadJson, Action<string, string> onInvalidSignature, Action<double> onExpired, Action<string, object> onError)
        {
            var none = Option.None<string>();
            if (decodedCrypto != decodedSignature)
            {
                // invalid signature: expected vs actual
                onInvalidSignature(decodedCrypto, decodedSignature);
                return none;
            }

            // verify exp claim https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32#section-4.1.4
            var payloadData = JsonSerializer.Deserialize<Dictionary<string, object>>(payloadJson);
            if (payloadData.ContainsKey("exp") && payloadData["exp"] != null)
            {
                // safely unpack a boxed int 
                int exp;
                try
                {
                    exp = Convert.ToInt32(payloadData["exp"]);
                }
                catch (Exception e)
                {
                    // cast error on exp variable
                    onError(e.Message, payloadData["exp"]);
                    return none;
                }

                var secondsSinceEpoch = Math.Round((DateTime.UtcNow - UnixEpoch).TotalSeconds);
                if (secondsSinceEpoch >= exp)
                {
                    // expired token
                    var difference = Math.Abs(secondsSinceEpoch - exp);
                    onExpired(difference);
                    return none;
                }
            }

            return payloadJson.Some();
        }

        /// <summary>
        /// Given a JWT, decode it and return the JSON payload.
        /// </summary>
        /// <param name="token">The JWT.</param>
        /// <param name="key">The key that was used to sign the JWT.</param>
        /// <param name="verify">Whether to verify the signature (default is true).</param>
        /// <returns>A string containing the JSON payload.</returns>
        public static Option<string> Decode(string token, string key, Action<string, string> onInvalidSignature, Action<double> onExpired, Action<string, object> onError, bool verify = true)
        {
            return Decode(token, Encoding.UTF8.GetBytes(key), onInvalidSignature, onExpired, onError, verify);
        }

        /// <summary>
        /// Given a JWT, decode it and return the payload as an object (by deserializing it with <see cref="System.Web.Script.Serialization.JavaScriptSerializer"/>).
        /// </summary>
        /// <param name="token">The JWT.</param>
        /// <param name="key">The key that was used to sign the JWT.</param>
        /// <param name="verify">Whether to verify the signature (default is true).</param>
        /// <returns>An object representing the payload.</returns>
        public static Option<object> DecodeToObject(string token, byte[] key,Action<string, string> onInvalidSignature, Action<double> onExpired, Action<string, object> onError, bool verify = true)
        {
            var payloadData = Decode(token, key, onInvalidSignature, onExpired, onError, verify);
            var result = payloadData.Map<object>(data => data as object);
            return result;
        }

        /// <summary>
        /// Given a JWT, decode it and return the payload as an object (by deserializing it with <see cref="System.Web.Script.Serialization.JavaScriptSerializer"/>).
        /// </summary>
        /// <param name="token">The JWT.</param>
        /// <param name="key">The key that was used to sign the JWT.</param>
        /// <param name="verify">Whether to verify the signature (default is true).</param>
        /// <returns>An object representing the payload.</returns>
        public static object DecodeToObject(string token, string key, Action<string, string> onInvalidSignature, Action<double> onExpired, Action<string, object> onError, bool verify = true)
        {
            return DecodeToObject(token, Encoding.UTF8.GetBytes(key), onInvalidSignature, onExpired, onError, verify);
        }

        private static Option<JwtHashAlgorithm> GetHashAlgorithm(string algorithm, Action<string, object> onError)
        {
            switch (algorithm)
            {
                case "HS256": return JwtHashAlgorithm.HS256.Some();
                case "HS384": return JwtHashAlgorithm.HS384.Some();
                case "HS512": return JwtHashAlgorithm.HS512.Some();
                default: onError("Algorithm not supported.", algorithm); 
                         return Option.None<JwtHashAlgorithm>();
            }
        }

        // from JWT spec
        public static string Base64UrlEncode(byte[] input)
        {
            var output = Convert.ToBase64String(input);
            output = output.Split('=')[0]; // Remove any trailing '='s
            output = output.Replace('+', '-'); // 62nd char of encoding
            output = output.Replace('/', '_'); // 63rd char of encoding
            return output;
        }

        // from JWT spec
        public static byte[] Base64UrlDecode(string input)
        {
            var output = input;
            output = output.Replace('-', '+'); // 62nd char of encoding
            output = output.Replace('_', '/'); // 63rd char of encoding
            switch (output.Length % 4) // Pad with trailing '='s
            {
                case 0: break; // No pad chars in this case
                case 2: output += "=="; break; // Two pad chars
                default: throw new Exception("Illegal base64url string!");
            }
            var converted = Convert.FromBase64String(output); // Standard base64 decoder
            return converted;
        }
    }
}
