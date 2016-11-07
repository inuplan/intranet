namespace Inuplan.Common.WebSockets
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.WebSockets;
    using System.Text;
    using System.Threading.Tasks;

    public class WebSocketClientConnectedArgs : EventArgs
    {
        public Guid ID { get; private set; }
        public WebSocket Client { get; private set; }
        public WebSocketClientConnectedArgs(Guid id, WebSocket client)
        {
            ID = id;
            Client = client;
        }
    }
}
