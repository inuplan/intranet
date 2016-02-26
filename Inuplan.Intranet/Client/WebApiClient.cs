using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace Inuplan.Intranet.Client
{
    public class WebApiClient : IDisposable
    {
        private readonly HttpClient client;

        private bool disposedValue = false;

        public WebApiClient(HttpClient client)
        {
            this.client = client;
        }

        public async Task<HttpResponseMessage> Send(HttpRequestMessage message)
        {
            // Check current http header for JWT token

            // 1. Token exists?
            // 1.a YES) Match token to current user (validate)
            // 1.b NO ) Create and sign token (set validate to false)

            // 2. Add token to Request Header

            // 3. Send request
            return await client.SendAsync(message);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                    client.Dispose();
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }
    }
}