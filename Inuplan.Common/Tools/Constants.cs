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

namespace Inuplan.Common.Tools
{
    /// <summary>
    /// Constant values used in various parts
    /// </summary>
    public static class Constants
    {
        public const string CURRENT_USER = "Inuplan.User.Current";

        public const string OWIN_WEBSOCKET_ACCEPT = "websocket.Accept";
        
        public const string OWIN_WEBSOCKET_RECEIVE = "websocket.ReceiveAsync";

        public const string OWIN_WEBSOCKET_CLOSE = "websocket.CloseAsync";

        public const string OWIN_WEBSOCKET_CANCEL = "websocket.CallCancelled";

        public const string OWIN_WEBSOCKET_CLOSE_STATUS = "websocket.ClientCloseStatus";

        public const string OWIN_WEBSOCKET_CLOSE_DESCRIPTION = "websocket.ClientCloseDescription";

        #region "Origin"
#if DEBUG
        public const string Origin = @"http://localhost:59382,http://localhost:52256,http://localhost:60464,http://localhost:5000";
#else
        public const string Origin = @"http://beta-intranet,http://intranet";
#endif
        #endregion
    }
}
