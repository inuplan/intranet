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
    using Common.DTOs;
    using Common.DTOs.Forum;
    using WebSocketSharp.Server;

    public class LatestActionItemBroadcastService : WebSocketBehavior
    {
        public new WebSocketSessionManager Sessions { get; set; }

        public void NewImageComment(ImageCommentDTO comment)
        {
            var action = new
            {
                type = "NEW_IMAGE_COMMENT",
                item = comment
            };

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(action);
            Sessions.Broadcast(json);
        }

        public void NewImage(UserImageDTO image)
        {
            var action = new
            {
                type = "NEW_IMAGE",
                item = image
            };

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(action);
            Sessions.Broadcast(json);
        }

        public void NewForumThread(ThreadPostContentDTO forumThread)
        {
            var action = new
            {
                type = "NEW_FORUM_THREAD",
                item = forumThread
            };

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(action);
            Sessions.Broadcast(json);
        }
    }
}
