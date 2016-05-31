"use strict";

var Comment = React.createClass({
    displayName: "Comment",

    rawMarkup: function rawMarkup() {
        if (!Boolean(this.props.text)) return;
        var rawMarkup = marked(this.props.text, { sanitize: true });
        return { __html: rawMarkup };
    },
    render: function render() {
        var fullname = this.props.author.FirstName + " " + this.props.author.LastName;
        return React.createElement(
            "div",
            { className: "media pull-left text-left" },
            React.createElement(CommentProfile, null),
            React.createElement(
                "div",
                { className: "media-body" },
                React.createElement(
                    "h5",
                    { className: "media-heading" },
                    React.createElement(
                        "strong",
                        null,
                        fullname
                    ),
                    " ",
                    React.createElement(Comment.PostedOn, { postedOn: this.props.postedOn })
                ),
                React.createElement("span", { dangerouslySetInnerHTML: this.rawMarkup() }),
                React.createElement(CommentControls, {
                    canEdit: this.props.canEdit,
                    commentId: this.props.commentId,
                    deleteHandle: this.props.deleteHandle,
                    editHandle: this.props.editHandle,
                    replyHandle: this.props.replyHandle,
                    text: this.props.text
                }),
                this.props.constructComments(this.props.replies)
            )
        );
    }
});

Comment.PostedOn = React.createClass({
    displayName: "PostedOn",

    ago: function ago() {
        var ago = moment(this.props.postedOn).fromNow();
        var diff = moment().diff(this.props.postedOn, 'hours', true);
        if (diff >= 12.5) {
            var date = moment(this.props.postedOn);
            return "d. " + date.format("D MMM YYYY ") + "kl. " + date.format("H:mm");
        }

        return "for " + ago;
    },
    render: function render() {
        return React.createElement(
            "small",
            null,
            "sagde ",
            this.ago()
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzVCLGVBQVcscUJBQVk7QUFDbkIsWUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFMLENBQVcsSUFBbkIsQ0FBTCxFQUErQjtBQUMvQixZQUFJLFlBQVksT0FBTyxLQUFLLEtBQUwsQ0FBVyxJQUFsQixFQUF3QixFQUFFLFVBQVUsSUFBWixFQUF4QixDQUFoQjtBQUNBLGVBQU8sRUFBRSxRQUFRLFNBQVYsRUFBUDtBQUNILEtBTDJCO0FBTTVCLFlBQVEsa0JBQVk7QUFDaEIsWUFBSSxXQUFXLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsU0FBbEIsR0FBOEIsR0FBOUIsR0FBb0MsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixRQUFyRTtBQUNBLGVBQ0k7QUFBQTtZQUFBLEVBQUssV0FBVSwyQkFBZjtZQUNRLG9CQUFDLGNBQUQsT0FEUjtZQUVRO0FBQUE7Z0JBQUEsRUFBSyxXQUFVLFlBQWY7Z0JBQ0k7QUFBQTtvQkFBQSxFQUFJLFdBQVUsZUFBZDtvQkFBOEI7QUFBQTt3QkFBQTt3QkFBUztBQUFULHFCQUE5QjtvQkFBQTtvQkFBMEQsb0JBQUMsT0FBRCxDQUFTLFFBQVQsSUFBa0IsVUFBVSxLQUFLLEtBQUwsQ0FBVyxRQUF2QztBQUExRCxpQkFESjtnQkFFSSw4QkFBTSx5QkFBeUIsS0FBSyxTQUFMLEVBQS9CLEdBRko7Z0JBR0ksb0JBQUMsZUFBRDtBQUNVLDZCQUFTLEtBQUssS0FBTCxDQUFXLE9BRDlCO0FBRVUsK0JBQVcsS0FBSyxLQUFMLENBQVcsU0FGaEM7QUFHVSxrQ0FBYyxLQUFLLEtBQUwsQ0FBVyxZQUhuQztBQUlVLGdDQUFZLEtBQUssS0FBTCxDQUFXLFVBSmpDO0FBS1UsaUNBQWEsS0FBSyxLQUFMLENBQVcsV0FMbEM7QUFNVSwwQkFBTSxLQUFLLEtBQUwsQ0FBVztBQU4zQixrQkFISjtnQkFXSyxLQUFLLEtBQUwsQ0FBVyxpQkFBWCxDQUE2QixLQUFLLEtBQUwsQ0FBVyxPQUF4QztBQVhMO0FBRlIsU0FESjtBQWlCSDtBQXpCMkIsQ0FBbEIsQ0FBZDs7QUE0QkEsUUFBUSxRQUFSLEdBQW1CLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUNqQyxTQUFLLGVBQVk7QUFDYixZQUFJLE1BQU0sT0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixFQUE0QixPQUE1QixFQUFWO0FBQ0EsWUFBSSxPQUFPLFNBQVMsSUFBVCxDQUFjLEtBQUssS0FBTCxDQUFXLFFBQXpCLEVBQW1DLE9BQW5DLEVBQTRDLElBQTVDLENBQVg7QUFDQSxZQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNkLGdCQUFJLE9BQU8sT0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixDQUFYO0FBQ0EsbUJBQU8sUUFBUSxLQUFLLE1BQUwsQ0FBWSxhQUFaLENBQVIsR0FBcUMsTUFBckMsR0FBOEMsS0FBSyxNQUFMLENBQVksTUFBWixDQUFyRDtBQUNIOztBQUVELGVBQU8sU0FBUyxHQUFoQjtBQUNILEtBVmdDO0FBV2pDLFlBQVEsa0JBQVk7QUFDaEIsZUFBUTtBQUFBO1lBQUE7WUFBQTtZQUFjLEtBQUssR0FBTDtBQUFkLFNBQVI7QUFDSDtBQWJnQyxDQUFsQixDQUFuQiIsImZpbGUiOiJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQ29tbWVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIHJhd01hcmt1cDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghQm9vbGVhbih0aGlzLnByb3BzLnRleHQpKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHJhd01hcmt1cCA9IG1hcmtlZCh0aGlzLnByb3BzLnRleHQsIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICAgICAgcmV0dXJuIHsgX19odG1sOiByYXdNYXJrdXAgfTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZnVsbG5hbWUgPSB0aGlzLnByb3BzLmF1dGhvci5GaXJzdE5hbWUgKyBcIiBcIiArIHRoaXMucHJvcHMuYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEgcHVsbC1sZWZ0IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50UHJvZmlsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwibWVkaWEtaGVhZGluZ1wiPjxzdHJvbmc+e2Z1bGxuYW1lfTwvc3Ryb25nPiA8Q29tbWVudC5Qb3N0ZWRPbiBwb3N0ZWRPbj17dGhpcy5wcm9wcy5wb3N0ZWRPbn0gLz48L2g1PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17dGhpcy5yYXdNYXJrdXAoKX0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudENvbnRyb2xzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXt0aGlzLnByb3BzLmNhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50SWQ9e3RoaXMucHJvcHMuY29tbWVudElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlSGFuZGxlPXt0aGlzLnByb3BzLmRlbGV0ZUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRIYW5kbGU9e3RoaXMucHJvcHMuZWRpdEhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGx5SGFuZGxlPXt0aGlzLnByb3BzLnJlcGx5SGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17dGhpcy5wcm9wcy50ZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jb25zdHJ1Y3RDb21tZW50cyh0aGlzLnByb3BzLnJlcGxpZXMpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbkNvbW1lbnQuUG9zdGVkT24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBhZ286IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYWdvID0gbW9tZW50KHRoaXMucHJvcHMucG9zdGVkT24pLmZyb21Ob3coKTtcclxuICAgICAgICB2YXIgZGlmZiA9IG1vbWVudCgpLmRpZmYodGhpcy5wcm9wcy5wb3N0ZWRPbiwgJ2hvdXJzJywgdHJ1ZSk7XHJcbiAgICAgICAgaWYgKGRpZmYgPj0gMTIuNSkge1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG1vbWVudCh0aGlzLnByb3BzLnBvc3RlZE9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZC4gXCIgKyBkYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyBkYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gXCJmb3IgXCIgKyBhZ287XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICg8c21hbGw+c2FnZGUge3RoaXMuYWdvKCl9PC9zbWFsbD4pO1xyXG4gICAgfVxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
