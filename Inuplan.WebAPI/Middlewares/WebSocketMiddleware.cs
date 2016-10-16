using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Inuplan.WebAPI.Middlewares
{
    using Autofac.Extras.Attributed;
    using Common.Enums;
    using Common.Logger;
    using Common.WebSockets;
    using Extensions.Workflows;
    using Microsoft.Owin;
    using System.Net.WebSockets;
    using WebSocketAccept = Action<IDictionary<string, object>, Func<IDictionary<string, object>, Task>>;
    using WebSocketCloseAsync = Func<int, string, CancellationToken, Task>;
    using WebSocketReceiveAsync = Func<ArraySegment<byte>, CancellationToken, Task<Tuple<int, bool, int>>>;
    using WebSocketReceiveResult = Tuple<int, bool, int>;

    public class WebSocketMiddleware : OwinMiddleware
    {
        private readonly IWebSocketHubSession session;
        private readonly ILogger<WebSocketMiddleware> logger;

        public WebSocketMiddleware(
            OwinMiddleware next,
            [WithKey(ServiceKeys.LatestHub)] IWebSocketHubSession session,
            ILogger<WebSocketMiddleware> logger
        ) : base(next)
        {
            this.session = session;
            this.logger = logger;
        }

        public override async Task Invoke(IOwinContext context)
        {
            WebSocketAccept accept = context.Get<WebSocketAccept>("websocket.Accept");
            if (accept != null)
            {
                var path = context.Request.Path.ToString();
                var isLatest = path.Equals("/latest", StringComparison.OrdinalIgnoreCase);
                if (isLatest)
                {
                    accept(null, Callback);
                    return;
                }
            }

            await Next.Invoke(context);
            return;
        }

        private async Task Callback(IDictionary<string, object> websocketContext)
        {
            var context = (HttpListenerWebSocketContext)websocketContext["System.Net.WebSockets.WebSocketContext"];
            var receiveAsync = (WebSocketReceiveAsync)websocketContext["websocket.ReceiveAsync"];
            var closeAsync = (WebSocketCloseAsync)websocketContext["websocket.CloseAsync"];
            var callCancelled = (CancellationToken)websocketContext["websocket.CallCancelled"];

            var added = await session
                .AddClient(context.WebSocket)
                .LogSomeAsync(g => logger.Trace("Added websocket client: {0}", g.ToString()))
                .LogNoneAsync(() => logger.Error("Could not add websocket client"));

            var buffer = new byte[1024];
            WebSocketReceiveResult placeholder = await receiveAsync(new ArraySegment<byte>(buffer), callCancelled);

            // Keep connection alive until client closes it
            object status;
            while (!websocketContext.TryGetValue("websocket.ClientCloseStatus", out status) || (int)status == 0)
            {
                placeholder = await receiveAsync(new ArraySegment<byte>(buffer), callCancelled);
            }

            var removed = await added
                .MapAsync(async g => await session.RemoveClient(g))
                .LogSomeAsync(b => logger.Trace("Client removed from session"))
                .LogNoneAsync(() => logger.Error("Could not remove client from session"));

            await closeAsync((int)websocketContext["websocket.ClientCloseStatus"], (string)websocketContext["websocket.ClientCloseDescription"], callCancelled);
        }
    }
}
