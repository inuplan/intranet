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

namespace Inuplan.WebAPI.App_Start
{
    using Properties;
    using System.Net;
    using WebSocketServices;
    using WebSocketSharp.Server;

    public static class WebSocketConfig
    {
        public static WebSocketServer Socket { get; private set; }

        public static void Start()
        {
            // url:      ws://10.18.0.217:9001
            Socket = new WebSocketServer(GetServerIP(), Settings.Default.webSocketPort);
            AddServices();
            Socket.Start();
        }

        private static void AddServices()
        {
            // Must be relative urls!
            Socket.AddWebSocketService<LatestActionItemBroadcastService>(Settings.Default.webSocketServiceLatest);
            Socket.AddWebSocketService<Echo>("/echo");
        }

        public static void Stop()
        {
            Socket.Stop();
        }

        private static IPAddress GetServerIP()
        {
#if DEBUG
            return IPAddress.Loopback;
#else
            return IPAddress.Parse(Settings.Default.serverIP);
#endif
        }
    }
}
