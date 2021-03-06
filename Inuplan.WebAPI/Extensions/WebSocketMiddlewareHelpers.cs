﻿// Copyright © 2015 Inuplan
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

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Inuplan.WebAPI.Extensions
{
    using Common.Tools;
    using Middlewares;
    using Middlewares.Options;
    using Owin;
    using WebSocketAccept = Action<IDictionary<string, object>, Func<IDictionary<string, object>, Task>>;

    public static class WebSocketMiddlewareHelpers
    {
        public static IAppBuilder UseWebSocketMiddleware(this IAppBuilder source, WebSocketOption option)
        {
            var sessionManager = option.SessionManager;

            return source.MapWhen(
                ctx => ctx.Get<WebSocketAccept>(Constants.OWIN_WEBSOCKET_ACCEPT) != null,
                app =>
                {
                    app.Use(typeof(WebSocketMiddleware), option);
                    WebSocketMiddleware.RaiseConnected += sessionManager.HandleClientConnected;
                    WebSocketMiddleware.RaiseDisconnected += sessionManager.HandleClientDisconnected;
                    WebSocketMiddleware.RaiseReceivedMessage += sessionManager.HandleMessage;
                });
        }
    }
}