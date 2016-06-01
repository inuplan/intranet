"use strict";

var CommentList = React.createClass({
    displayName: "CommentList",

    constructComments: function constructComments(comments) {
        if (!comments) return;
        var commentNodes = comments.map(function (comment) {
            if (comment.Deleted) {
                return React.createElement(
                    "div",
                    { className: "media", key: comment.ID },
                    React.createElement(CommentDeleted, {
                        key: comment.ID,
                        replies: comment.Replies,
                        userId: this.props.userId,
                        constructComments: this.constructComments
                    })
                );
            }

            var canEdit = this.props.userId == comment.Author.ID;

            return React.createElement(
                "div",
                { className: "media", key: comment.ID },
                React.createElement(Comment, {
                    key: comment.ID,
                    postedOn: comment.PostedOn,
                    author: comment.Author,
                    text: comment.Text,
                    replies: comment.Replies,
                    canEdit: canEdit,
                    userId: this.props.userId,
                    commentId: comment.ID,
                    deleteHandle: this.props.commentDeleteHandle,
                    editHandle: this.props.commentEditHandle,
                    replyHandle: this.props.commentReplyHandle,
                    commentItem: comment,
                    constructComments: this.constructComments
                })
            );
        }.bind(this));

        return commentNodes;
    },
    render: function render() {
        var commentNodes = this.constructComments(this.props.comments);
        return React.createElement(
            "div",
            null,
            commentNodes
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudExpc3QuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUNoQyx1QkFBbUIsMkJBQVMsUUFBVCxFQUFtQjtBQUNsQyxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2YsWUFBSSxlQUFlLFNBQVMsR0FBVCxDQUFhLFVBQVUsT0FBVixFQUFtQjtBQUMvQyxnQkFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsdUJBQ0k7QUFBQTtvQkFBQSxFQUFLLFdBQVUsT0FBZixFQUF1QixLQUFLLFFBQVEsRUFBcEM7b0JBQ0ksb0JBQUMsY0FBRDtBQUNLLDZCQUFLLFFBQVEsRUFEbEI7QUFFSyxpQ0FBUyxRQUFRLE9BRnRCO0FBR0ssZ0NBQVEsS0FBSyxLQUFMLENBQVcsTUFIeEI7QUFJSywyQ0FBbUIsS0FBSztBQUo3QjtBQURKLGlCQURKO0FBU0g7O0FBRUQsZ0JBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLFFBQVEsTUFBUixDQUFlLEVBQWxEOztBQUVBLG1CQUNJO0FBQUE7Z0JBQUEsRUFBSyxXQUFVLE9BQWYsRUFBdUIsS0FBSyxRQUFRLEVBQXBDO2dCQUNJLG9CQUFDLE9BQUQ7QUFDUyx5QkFBSyxRQUFRLEVBRHRCO0FBRVMsOEJBQVUsUUFBUSxRQUYzQjtBQUdTLDRCQUFRLFFBQVEsTUFIekI7QUFJUywwQkFBTSxRQUFRLElBSnZCO0FBS1MsNkJBQVMsUUFBUSxPQUwxQjtBQU1TLDZCQUFTLE9BTmxCO0FBT1MsNEJBQVEsS0FBSyxLQUFMLENBQVcsTUFQNUI7QUFRUywrQkFBVyxRQUFRLEVBUjVCO0FBU1Msa0NBQWMsS0FBSyxLQUFMLENBQVcsbUJBVGxDO0FBVVMsZ0NBQVksS0FBSyxLQUFMLENBQVcsaUJBVmhDO0FBV1MsaUNBQWEsS0FBSyxLQUFMLENBQVcsa0JBWGpDO0FBWVMsaUNBQWEsT0FadEI7QUFhUyx1Q0FBbUIsS0FBSztBQWJqQztBQURKLGFBREo7QUFtQkgsU0FsQytCLENBa0M5QixJQWxDOEIsQ0FrQ3pCLElBbEN5QixDQUFiLENBQW5COztBQW9DQSxlQUFPLFlBQVA7QUFDSCxLQXhDK0I7QUF5Q2hDLFlBQVEsa0JBQVk7QUFDaEIsWUFBSSxlQUFlLEtBQUssaUJBQUwsQ0FBdUIsS0FBSyxLQUFMLENBQVcsUUFBbEMsQ0FBbkI7QUFDQSxlQUNJO0FBQUE7WUFBQTtZQUNLO0FBREwsU0FESjtBQUtIO0FBaEQrQixDQUFsQixDQUFsQiIsImZpbGUiOiJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIENvbW1lbnRMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgY29uc3RydWN0Q29tbWVudHM6IGZ1bmN0aW9uKGNvbW1lbnRzKSB7XHJcbiAgICAgICAgaWYgKCFjb21tZW50cykgcmV0dXJuO1xyXG4gICAgICAgIHZhciBjb21tZW50Tm9kZXMgPSBjb21tZW50cy5tYXAoZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKGNvbW1lbnQuRGVsZXRlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhXCIga2V5PXtjb21tZW50LklEIH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50RGVsZXRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17Y29tbWVudC5JRH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGllcz17Y29tbWVudC5SZXBsaWVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZD17dGhpcy5wcm9wcy51c2VySWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0Q29tbWVudHM9e3RoaXMuY29uc3RydWN0Q29tbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBjYW5FZGl0ID0gdGhpcy5wcm9wcy51c2VySWQgPT0gY29tbWVudC5BdXRob3IuSUQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYVwiIGtleT17Y29tbWVudC5JRCB9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtjb21tZW50LklEfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0ZWRPbj17Y29tbWVudC5Qb3N0ZWRPbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I9e2NvbW1lbnQuQXV0aG9yfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17Y29tbWVudC5UZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxpZXM9e2NvbW1lbnQuUmVwbGllc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZD17dGhpcy5wcm9wcy51c2VySWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudElkPXtjb21tZW50LklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUhhbmRsZT17dGhpcy5wcm9wcy5jb21tZW50RGVsZXRlSGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRIYW5kbGU9e3RoaXMucHJvcHMuY29tbWVudEVkaXRIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbHlIYW5kbGU9e3RoaXMucHJvcHMuY29tbWVudFJlcGx5SGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRJdGVtPXtjb21tZW50fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdENvbW1lbnRzPXt0aGlzLmNvbnN0cnVjdENvbW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbW1lbnROb2RlcztcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgY29tbWVudE5vZGVzID0gdGhpcy5jb25zdHJ1Y3RDb21tZW50cyh0aGlzLnByb3BzLmNvbW1lbnRzKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAge2NvbW1lbnROb2Rlc31cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
