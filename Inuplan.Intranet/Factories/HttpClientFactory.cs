using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace Inuplan.Intranet.Factories
{
    public class HttpClientFactory : IHttpClientFactory
    {
        private WeakReference<HttpClient> client;

        public HttpClientFactory(WeakReference<HttpClient> client)
        {
            this.client = client;
        }

        public HttpClient GetHttpClient()
        {
            HttpClient result;
            if(client.TryGetTarget(out result))
            {
                return result;
            }

            result = new HttpClient();
            client.SetTarget(result);
            return result;
        }
    }
}