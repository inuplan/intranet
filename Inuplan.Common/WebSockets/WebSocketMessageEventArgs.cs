namespace Inuplan.Common.WebSockets
{
    using System;
    using Enums;

    public class WebSocketMessageEventArgs : EventArgs
    {
        public Guid ID { get; private set; }
        public WebSocketMessageType MessageType { get; private set; }
        public byte[] Data { get; private set; }

        public WebSocketMessageEventArgs(Guid id, WebSocketMessageType messageType, byte[] data)
        {
            ID = id;
            MessageType = messageType;
            Data = data;
        }
    }
}
