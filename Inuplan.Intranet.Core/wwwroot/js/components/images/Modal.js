"use strict";

var Modal = React.createClass({
    displayName: "Modal",

    deleteImage: function deleteImage(e) {
        console.log("pressed delete!");
    },
    componentDidMount: function componentDidMount() {
        $(ReactDOM.findDOMNode(this)).modal('show');
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "modal fade", id: "modalWindow" },
            React.createElement(
                "div",
                { className: "modal-dialog modal-lg" },
                React.createElement(
                    "div",
                    { className: "modal-content" },
                    React.createElement(
                        "div",
                        { className: "modal-header" },
                        React.createElement(
                            "button",
                            { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                            React.createElement(
                                "span",
                                { "aria-hidden": "true" },
                                "×"
                            )
                        ),
                        React.createElement(
                            "h4",
                            { className: "modal-title text-center" },
                            this.props.filename
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "modal-body" },
                        React.createElement(
                            "a",
                            { href: this.props.originalUrl, target: "_blank" },
                            React.createElement("img", { className: "img-responsive center-block", src: this.props.previewUrl })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "modal-footer" },
                        React.createElement(CommentBox, {
                            commentsUrl: this.props.commentsUrl,
                            username: this.props.username,
                            imageId: this.props.imageId,
                            userUrl: this.props.userUrl
                        }),
                        React.createElement("hr", null),
                        React.createElement(
                            Modal.Delete,
                            {
                                canEdit: this.props.canEdit,
                                imageId: this.props.imageId,
                                deleteImageHandle: this.props.deleteImageHandle },
                            "Slet billede"
                        ),
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-default", "data-dismiss": "modal" },
                            "Luk"
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            " "
                        )
                    )
                )
            )
        );
    }
});

Modal.Delete = React.createClass({
    displayName: "Delete",

    deleteImage: function deleteImage() {
        this.props.deleteImageHandle(this.props.imageId);
        $('#modalWindow').modal('hide');
    },
    render: function render() {
        return this.props.canEdit ? React.createElement(
            "button",
            {
                type: "button",
                className: "btn btn-danger",
                onClick: this.deleteImage },
            this.props.children
        ) : null;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL01vZGFsLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUIsaUJBQWEscUJBQVMsQ0FBVCxFQUFZO0FBQ3JCLGdCQUFRLEdBQVIsQ0FBWSxpQkFBWjtBQUNILEtBSHlCO0FBSTFCLHVCQUFtQiw2QkFBWTtBQUMzQixVQUFFLFNBQVMsV0FBVCxDQUFxQixJQUFyQixDQUFGLEVBQThCLEtBQTlCLENBQW9DLE1BQXBDO0FBQ0gsS0FOeUI7QUFPMUIsWUFBUSxrQkFBWTtBQUNoQixlQUNJO0FBQUE7WUFBQSxFQUFLLFdBQVUsWUFBZixFQUE0QixJQUFHLGFBQS9CO1lBQ0k7QUFBQTtnQkFBQSxFQUFLLFdBQVUsdUJBQWY7Z0JBQ0U7QUFBQTtvQkFBQSxFQUFLLFdBQVUsZUFBZjtvQkFDRTtBQUFBO3dCQUFBLEVBQUssV0FBVSxjQUFmO3dCQUNFO0FBQUE7NEJBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVSxPQUFoQyxFQUF3QyxnQkFBYSxPQUFyRCxFQUE2RCxjQUFXLE9BQXhFOzRCQUFnRjtBQUFBO2dDQUFBLEVBQU0sZUFBWSxNQUFsQjtnQ0FBQTtBQUFBO0FBQWhGLHlCQURGO3dCQUVFO0FBQUE7NEJBQUEsRUFBSSxXQUFVLHlCQUFkOzRCQUF5QyxLQUFLLEtBQUwsQ0FBVztBQUFwRDtBQUZGLHFCQURGO29CQUtFO0FBQUE7d0JBQUEsRUFBSyxXQUFVLFlBQWY7d0JBQ1k7QUFBQTs0QkFBQSxFQUFHLE1BQU0sS0FBSyxLQUFMLENBQVcsV0FBcEIsRUFBaUMsUUFBTyxRQUF4Qzs0QkFDSSw2QkFBSyxXQUFVLDZCQUFmLEVBQTZDLEtBQUssS0FBSyxLQUFMLENBQVcsVUFBN0Q7QUFESjtBQURaLHFCQUxGO29CQVVFO0FBQUE7d0JBQUEsRUFBSyxXQUFVLGNBQWY7d0JBQ0ksb0JBQUMsVUFBRDtBQUNRLHlDQUFhLEtBQUssS0FBTCxDQUFXLFdBRGhDO0FBRVEsc0NBQVUsS0FBSyxLQUFMLENBQVcsUUFGN0I7QUFHUSxxQ0FBUyxLQUFLLEtBQUwsQ0FBVyxPQUg1QjtBQUlRLHFDQUFTLEtBQUssS0FBTCxDQUFXO0FBSjVCLDBCQURKO3dCQU9JLCtCQVBKO3dCQVFJO0FBQUMsaUNBQUQsQ0FBTyxNQUFQOzRCQUFBO0FBQ1UseUNBQVMsS0FBSyxLQUFMLENBQVcsT0FEOUI7QUFFVSx5Q0FBUyxLQUFLLEtBQUwsQ0FBVyxPQUY5QjtBQUdVLG1EQUFtQixLQUFLLEtBQUwsQ0FBVyxpQkFIeEM7NEJBQUE7QUFBQSx5QkFSSjt3QkFjSTtBQUFBOzRCQUFBLEVBQVEsTUFBSyxRQUFiLEVBQXNCLFdBQVUsaUJBQWhDLEVBQWtELGdCQUFhLE9BQS9EOzRCQUFBO0FBQUEseUJBZEo7d0JBZUk7QUFBQTs0QkFBQSxFQUFLLFdBQVUsS0FBZjs0QkFBQTtBQUFBO0FBZko7QUFWRjtBQURGO0FBREosU0FESjtBQXFDSDtBQTdDeUIsQ0FBbEIsQ0FBWjs7QUFnREEsTUFBTSxNQUFOLEdBQWUsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzdCLGlCQUFhLHVCQUFXO0FBQ3BCLGFBQUssS0FBTCxDQUFXLGlCQUFYLENBQTZCLEtBQUssS0FBTCxDQUFXLE9BQXhDO0FBQ0EsVUFBRSxjQUFGLEVBQWtCLEtBQWxCLENBQXdCLE1BQXhCO0FBQ0gsS0FKNEI7QUFLN0IsWUFBUSxrQkFBWTtBQUNoQixlQUNJLEtBQUssS0FBTCxDQUFXLE9BQVgsR0FDQTtBQUFBO1lBQUE7QUFDUSxzQkFBSyxRQURiO0FBRVEsMkJBQVUsZ0JBRmxCO0FBR1EseUJBQVMsS0FBSyxXQUh0QjtZQUlLLEtBQUssS0FBTCxDQUFXO0FBSmhCLFNBREEsR0FNWSxJQVBoQjtBQVFIO0FBZDRCLENBQWxCLENBQWYiLCJmaWxlIjoiY29tcG9uZW50cy9pbWFnZXMvTW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTW9kYWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkZWxldGVJbWFnZTogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJlc3NlZCBkZWxldGUhXCIpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkubW9kYWwoJ3Nob3cnKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsIGZhZGVcIiBpZD1cIm1vZGFsV2luZG93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZyBtb2RhbC1sZ1wiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGUgdGV4dC1jZW50ZXJcIj57dGhpcy5wcm9wcy5maWxlbmFtZX08L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e3RoaXMucHJvcHMub3JpZ2luYWxVcmx9IHRhcmdldD1cIl9ibGFua1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImltZy1yZXNwb25zaXZlIGNlbnRlci1ibG9ja1wiIHNyYz17dGhpcy5wcm9wcy5wcmV2aWV3VXJsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudEJveFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzVXJsPXt0aGlzLnByb3BzLmNvbW1lbnRzVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt0aGlzLnByb3BzLnVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e3RoaXMucHJvcHMuaW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyVXJsPXt0aGlzLnByb3BzLnVzZXJVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWwuRGVsZXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXt0aGlzLnByb3BzLmNhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXt0aGlzLnByb3BzLmltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVJbWFnZUhhbmRsZT17dGhpcy5wcm9wcy5kZWxldGVJbWFnZUhhbmRsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTbGV0IGJpbGxlZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5EZWxldGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogRW1wdHkgc3BhY2UgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmbmJzcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5Nb2RhbC5EZWxldGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkZWxldGVJbWFnZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5kZWxldGVJbWFnZUhhbmRsZSh0aGlzLnByb3BzLmltYWdlSWQpO1xyXG4gICAgICAgICQoJyNtb2RhbFdpbmRvdycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYW5FZGl0ID9cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCJcclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmRlbGV0ZUltYWdlfT5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICA8L2J1dHRvbj4gOiBudWxsKTtcclxuICAgIH1cclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
