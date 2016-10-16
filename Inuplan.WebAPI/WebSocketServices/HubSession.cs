// Copyright © 2015 Inuplan
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

namespace Inuplan.WebAPI.WebSocketServices
{
    using Common.WebSockets;
    using Newtonsoft.Json;
    using Optional;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Net.WebSockets;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;

    public class HubSession : IWebSocketHubSession
    {
        private readonly string hub;
        private ConcurrentDictionary<Guid, WebSocket> clients;

        public string Hub
        {
            get
            {
                return hub;
            }
        }

        public HubSession(string hub)
            : this(hub, new ConcurrentDictionary<Guid, WebSocket>())
        {
            this.hub = hub;
        }

        public HubSession(string hub, ConcurrentDictionary<Guid, WebSocket> clients)
        {
            this.clients = clients;
        }

        public Task<Option<Guid>> AddClient(WebSocket client)
        {
            var id = Guid.NewGuid();
            var added = clients.TryAdd(id, client);
            if (added)
                return Task.FromResult(id.Some());

            return Task.FromResult(Option.None<Guid>());
        }

        public Task<bool> RemoveClient(Guid id)
        {
            WebSocket client;
            var result = clients.TryRemove(id, out client);
            return Task.FromResult(result);
        }

        public Task<bool> Broadcast<T>(T message)
        {
            var loop = Parallel.ForEach(clients, async (kv, state) =>
            {
                await Send(kv.Key, message);
            });

            return Task.FromResult(loop.IsCompleted);
        }

        public async Task<bool> Send<T>(Guid to, T message)
        {
            WebSocket client;
            var has = clients.TryGetValue(to, out client);
            if (client.State == WebSocketState.Open)
            {
                var token = new CancellationToken();
                var json = JsonConvert.SerializeObject(message);
                var encoded = Encoding.UTF8.GetBytes(json);
                var buffer = new ArraySegment<byte>(encoded, 0, encoded.Length);
                await client.SendAsync(buffer, WebSocketMessageType.Text, true, token);
            }
            else
            {
                // Stale sockets
                await RemoveClient(to);
            }

            return has;
        }

        public Task<IReadOnlyCollection<Guid>> GetClientIds()
        {
            var collection = clients.Keys;
            var res = new ReadOnlyCollection<Guid>(collection.ToList());
            return Task.FromResult<IReadOnlyCollection<Guid>>(res);
        }

    }
}
