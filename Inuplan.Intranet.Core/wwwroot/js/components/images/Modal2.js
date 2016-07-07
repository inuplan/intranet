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
                            userId: this.props.userId,
                            imageId: this.props.imageId
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL01vZGFsLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUIsaUJBQWEscUJBQVMsQ0FBVCxFQUFZO0FBQ3JCLGdCQUFRLEdBQVIsQ0FBWSxpQkFBWjtBQUNILEtBSHlCO0FBSTFCLHVCQUFtQiw2QkFBWTtBQUMzQixVQUFFLFNBQVMsV0FBVCxDQUFxQixJQUFyQixDQUFGLEVBQThCLEtBQTlCLENBQW9DLE1BQXBDO0FBQ0gsS0FOeUI7QUFPMUIsWUFBUSxrQkFBWTtBQUNoQixlQUNJO0FBQUE7WUFBQSxFQUFLLFdBQVUsWUFBZixFQUE0QixJQUFHLGFBQS9CO1lBQ0k7QUFBQTtnQkFBQSxFQUFLLFdBQVUsdUJBQWY7Z0JBQ0U7QUFBQTtvQkFBQSxFQUFLLFdBQVUsZUFBZjtvQkFDRTtBQUFBO3dCQUFBLEVBQUssV0FBVSxjQUFmO3dCQUNFO0FBQUE7NEJBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVSxPQUFoQyxFQUF3QyxnQkFBYSxPQUFyRCxFQUE2RCxjQUFXLE9BQXhFOzRCQUFnRjtBQUFBO2dDQUFBLEVBQU0sZUFBWSxNQUFsQjtnQ0FBQTtBQUFBO0FBQWhGLHlCQURGO3dCQUVFO0FBQUE7NEJBQUEsRUFBSSxXQUFVLHlCQUFkOzRCQUF5QyxLQUFLLEtBQUwsQ0FBVztBQUFwRDtBQUZGLHFCQURGO29CQUtFO0FBQUE7d0JBQUEsRUFBSyxXQUFVLFlBQWY7d0JBQ1k7QUFBQTs0QkFBQSxFQUFHLE1BQU0sS0FBSyxLQUFMLENBQVcsV0FBcEIsRUFBaUMsUUFBTyxRQUF4Qzs0QkFDSSw2QkFBSyxXQUFVLDZCQUFmLEVBQTZDLEtBQUssS0FBSyxLQUFMLENBQVcsVUFBN0Q7QUFESjtBQURaLHFCQUxGO29CQVVFO0FBQUE7d0JBQUEsRUFBSyxXQUFVLGNBQWY7d0JBQ0ksb0JBQUMsVUFBRDtBQUNRLHlDQUFhLEtBQUssS0FBTCxDQUFXLFdBRGhDO0FBRVEsb0NBQVEsS0FBSyxLQUFMLENBQVcsTUFGM0I7QUFHUSxxQ0FBUyxLQUFLLEtBQUwsQ0FBVztBQUg1QiwwQkFESjt3QkFNSSwrQkFOSjt3QkFPSTtBQUFDLGlDQUFELENBQU8sTUFBUDs0QkFBQTtBQUNVLHlDQUFTLEtBQUssS0FBTCxDQUFXLE9BRDlCO0FBRVUseUNBQVMsS0FBSyxLQUFMLENBQVcsT0FGOUI7QUFHVSxtREFBbUIsS0FBSyxLQUFMLENBQVcsaUJBSHhDOzRCQUFBO0FBQUEseUJBUEo7d0JBYUk7QUFBQTs0QkFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixXQUFVLGlCQUFoQyxFQUFrRCxnQkFBYSxPQUEvRDs0QkFBQTtBQUFBLHlCQWJKO3dCQWNJO0FBQUE7NEJBQUEsRUFBSyxXQUFVLEtBQWY7NEJBQUE7QUFBQTtBQWRKO0FBVkY7QUFERjtBQURKLFNBREo7QUFvQ0g7QUE1Q3lCLENBQWxCLENBQVo7O0FBK0NBLE1BQU0sTUFBTixHQUFlLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUM3QixpQkFBYSx1QkFBVztBQUNwQixhQUFLLEtBQUwsQ0FBVyxpQkFBWCxDQUE2QixLQUFLLEtBQUwsQ0FBVyxPQUF4QztBQUNBLFVBQUUsY0FBRixFQUFrQixLQUFsQixDQUF3QixNQUF4QjtBQUNILEtBSjRCO0FBSzdCLFlBQVEsa0JBQVk7QUFDaEIsZUFDSSxLQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQ0E7QUFBQTtZQUFBO0FBQ1Esc0JBQUssUUFEYjtBQUVRLDJCQUFVLGdCQUZsQjtBQUdRLHlCQUFTLEtBQUssV0FIdEI7WUFJSyxLQUFLLEtBQUwsQ0FBVztBQUpoQixTQURBLEdBTVksSUFQaEI7QUFRSDtBQWQ0QixDQUFsQixDQUFmIiwiZmlsZSI6ImNvbXBvbmVudHMvaW1hZ2VzL01vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1vZGFsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgZGVsZXRlSW1hZ2U6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInByZXNzZWQgZGVsZXRlIVwiKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCIgaWQ9XCJtb2RhbFdpbmRvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2cgbW9kYWwtbGdcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlIHRleHQtY2VudGVyXCI+e3RoaXMucHJvcHMuZmlsZW5hbWV9PC9oND5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXt0aGlzLnByb3BzLm9yaWdpbmFsVXJsfSB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJpbWctcmVzcG9uc2l2ZSBjZW50ZXItYmxvY2tcIiBzcmM9e3RoaXMucHJvcHMucHJldmlld1VybH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1mb290ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRCb3hcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50c1VybD17dGhpcy5wcm9wcy5jb21tZW50c1VybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ9e3RoaXMucHJvcHMudXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e3RoaXMucHJvcHMuaW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbC5EZWxldGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e3RoaXMucHJvcHMuY2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e3RoaXMucHJvcHMuaW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUltYWdlSGFuZGxlPXt0aGlzLnByb3BzLmRlbGV0ZUltYWdlSGFuZGxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNsZXQgYmlsbGVkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L01vZGFsLkRlbGV0ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBFbXB0eSBzcGFjZSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbk1vZGFsLkRlbGV0ZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGRlbGV0ZUltYWdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnByb3BzLmRlbGV0ZUltYWdlSGFuZGxlKHRoaXMucHJvcHMuaW1hZ2VJZCk7XHJcbiAgICAgICAgJCgnI21vZGFsV2luZG93JykubW9kYWwoJ2hpZGUnKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbkVkaXQgP1xyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuZGVsZXRlSW1hZ2V9PlxyXG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPiA6IG51bGwpO1xyXG4gICAgfVxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
