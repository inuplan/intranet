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

namespace Inuplan.Common.Enums
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    /// <summary>
    /// Opcode definitions RFC 6455.
    /// Reserved opcode:
    /// 0x3 -> 7 (non-control frames)
    /// 0xB -> F (control frames)
    /// Spec: https://tools.ietf.org/html/rfc6455#section-5.2
    /// </summary>
    public enum WebSocketMessageType : byte
    {
        /// <summary>
        /// Denotes a continuation frame %x0
        /// </summary>
        ContinuationFrame = 0x0,

        /// <summary>
        /// Denotes a text frame %x1
        /// </summary>
        Text = 0x1,

        /// <summary>
        /// Denotes a connection close %x8
        /// </summary>
        Close = 0x8,

        /// <summary>
        /// Denotes a ping %x9
        /// </summary>
        Ping = 0x9,

        /// <summary>
        ///  Denotes a pong %xA
        /// </summary>
        Pong = 0xA,
    }
}
