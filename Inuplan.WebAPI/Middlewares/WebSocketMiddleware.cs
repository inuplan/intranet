using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Inuplan.WebAPI.Middlewares
{
    using Common.Logger;
    using Common.Tools;
    using Common.WebSockets;
    using Extensions.Workflows;
    using Microsoft.Owin;
    using Optional;
    using System.IO;
    using System.Net.WebSockets;
    using WebSocketAccept = Action<IDictionary<string, object>, Func<IDictionary<string, object>, Task>>;
    using WebSocketCloseAsync = Func<int, string, CancellationToken, Task>;
    using WebSocketReceiveAsync = Func<ArraySegment<byte>, CancellationToken, Task<Tuple<int, bool, int>>>;
    using WebSocketReceiveResult = Tuple<int, bool, int>;
    using AppFunc = Func<IDictionary<string, object>, Task>;

    public class WebSocketMiddleware
    {
        public static event EventHandler<WebSocketMessageEventArgs> RaiseReceivedMessage;
        public static event EventHandler<WebSocketClientConnectedArgs> RaiseConnected;
        public static event EventHandler<WebSocketClientDisconnectedArgs> RaiseDisconnected;

        private readonly int bufferSize;
        private readonly string path;
        private readonly AppFunc next;

        public WebSocketMiddleware(
            AppFunc next,
            string path = "",
            int bufferSize = 1024
        )
        {
            this.next = next;
            this.bufferSize = bufferSize;
            this.path = "/" + path;
        }

        public async Task Invoke(IDictionary<string, object> env)
        {
            IOwinContext context = new OwinContext(env);
            WebSocketAccept accept = context.Get<WebSocketAccept>(Constants.OWIN_WEBSOCKET_ACCEPT);
            if (accept != null)
            {
                var requestPath = context.Request.Path.ToString();
                var isPath = requestPath.Equals(path, StringComparison.OrdinalIgnoreCase);
                if (isPath)
                {
                    accept(null, Callback);
                    return;
                }
            }

            await next.Invoke(context.Environment);
            return;
        }

        private async Task Callback(IDictionary<string, object> websocketContext)
        {
            var id = Guid.NewGuid();
            var context = (HttpListenerWebSocketContext)websocketContext["System.Net.WebSockets.WebSocketContext"];
            var receiveAsync = (WebSocketReceiveAsync)websocketContext[Constants.OWIN_WEBSOCKET_RECEIVE];
            var closeAsync = (WebSocketCloseAsync)websocketContext[Constants.OWIN_WEBSOCKET_CLOSE];
            var callCancelled = (CancellationToken)websocketContext[Constants.OWIN_WEBSOCKET_CANCEL];

            OnConnected(new WebSocketClientConnectedArgs(id, context.WebSocket));

            // Keep connection alive until client closes it
            object status;
            while (!websocketContext.TryGetValue("websocket.ClientCloseStatus", out status) || (int)status == 0)
            {
                WebSocketReceiveResult received;
                using (var ms = new MemoryStream())
                {
                    do
                    {
                        var buffer = new ArraySegment<byte>(new byte[bufferSize]);
                        received = await receiveAsync(buffer, callCancelled);
                        ms.Write(buffer.Array, buffer.Offset, received.Item3);
                    }
                    while (!received.Item2);
                    var data = ms.ToArray();

                   OnReceivedMessage(new WebSocketMessageEventArgs(id, (Common.Enums.WebSocketMessageType)received.Item1, data));
                }
            }

            OnDisconnected(new WebSocketClientDisconnectedArgs(id));
            await closeAsync((int)websocketContext[Constants.OWIN_WEBSOCKET_CLOSE_STATUS], (string)websocketContext[Constants.OWIN_WEBSOCKET_CLOSE_DESCRIPTION], callCancelled);
        }

        protected virtual void OnConnected(WebSocketClientConnectedArgs args)
        {
            RaiseConnected?.Invoke(this, args);
        }

        protected virtual void OnReceivedMessage(WebSocketMessageEventArgs args)
        {
            RaiseReceivedMessage?.Invoke(this, args);
        }

        protected virtual void OnDisconnected(WebSocketClientDisconnectedArgs args)
        {
            RaiseDisconnected?.Invoke(this, args);
        }
    }

}
