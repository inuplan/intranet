"use strict";

var Modal = React.createClass({
    displayName: "Modal",

    delete: function _delete(imageId) {
        this.props.deleteHandle(imageId);
    },
    deleteBtn: function deleteBtn() {
        return React.createElement(
            "button",
            { type: "button", "data-dismiss": "modal", className: "btn btn-danger", onClick: this.delete.bind(this, this.props.image.ImageID) },
            "Slet"
        );
    },
    componentDidMount: function componentDidMount() {
        $(ReactDOM.findDOMNode(this)).modal('hide');
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
                            { className: "modal-title" },
                            this.props.image.Filename
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "modal-body" },
                        React.createElement(
                            "a",
                            { href: this.props.image.OriginalUrl, target: "_blank" },
                            React.createElement("img", { className: "img-responsive", src: this.props.image.PreviewUrl })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "modal-footer" },
                        this.props.canEdit ? this.deleteBtn() : '',
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-default", "data-dismiss": "modal" },
                            "Luk"
                        )
                    )
                )
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL01vZGFsLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUIsWUFBUSxpQkFBUyxPQUFULEVBQWtCO0FBQ3RCLGFBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsT0FBeEI7QUFDSCxLQUh5QjtBQUkxQixlQUFXLHFCQUFZO0FBQ25CLGVBQVE7QUFBQTtZQUFBLEVBQVEsTUFBSyxRQUFiLEVBQXNCLGdCQUFhLE9BQW5DLEVBQTJDLFdBQVUsZ0JBQXJELEVBQXNFLFNBQVMsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQixFQUF1QixLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLE9BQXhDLENBQS9FO1lBQUE7QUFBQSxTQUFSO0FBQ0gsS0FOeUI7QUFPMUIsdUJBQW1CLDZCQUFZO0FBQzNCLFVBQUUsU0FBUyxXQUFULENBQXFCLElBQXJCLENBQUYsRUFBOEIsS0FBOUIsQ0FBb0MsTUFBcEM7QUFDSCxLQVR5QjtBQVUxQixZQUFRLGtCQUFZO0FBQ2hCLGVBQ0k7QUFBQTtZQUFBLEVBQUssV0FBVSxZQUFmLEVBQTRCLElBQUcsYUFBL0I7WUFDSTtBQUFBO2dCQUFBLEVBQUssV0FBVSx1QkFBZjtnQkFDRTtBQUFBO29CQUFBLEVBQUssV0FBVSxlQUFmO29CQUNFO0FBQUE7d0JBQUEsRUFBSyxXQUFVLGNBQWY7d0JBQ0U7QUFBQTs0QkFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixXQUFVLE9BQWhDLEVBQXdDLGdCQUFhLE9BQXJELEVBQTZELGNBQVcsT0FBeEU7NEJBQWdGO0FBQUE7Z0NBQUEsRUFBTSxlQUFZLE1BQWxCO2dDQUFBO0FBQUE7QUFBaEYseUJBREY7d0JBRUU7QUFBQTs0QkFBQSxFQUFJLFdBQVUsYUFBZDs0QkFBNkIsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQjtBQUE5QztBQUZGLHFCQURGO29CQUtFO0FBQUE7d0JBQUEsRUFBSyxXQUFVLFlBQWY7d0JBQ0k7QUFBQTs0QkFBQSxFQUFHLE1BQU0sS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixXQUExQixFQUF1QyxRQUFPLFFBQTlDOzRCQUNJLDZCQUFLLFdBQVUsZ0JBQWYsRUFBZ0MsS0FBSyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQXREO0FBREo7QUFESixxQkFMRjtvQkFVRTtBQUFBO3dCQUFBLEVBQUssV0FBVSxjQUFmO3dCQUNHLEtBQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsS0FBSyxTQUFMLEVBQXJCLEdBQXdDLEVBRDNDO3dCQUVFO0FBQUE7NEJBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVSxpQkFBaEMsRUFBa0QsZ0JBQWEsT0FBL0Q7NEJBQUE7QUFBQTtBQUZGO0FBVkY7QUFERjtBQURKLFNBREo7QUFxQkg7QUFoQ3lCLENBQWxCLENBQVoiLCJmaWxlIjoiY29tcG9uZW50cy9pbWFnZXMvTW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTW9kYWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkZWxldGU6IGZ1bmN0aW9uKGltYWdlSWQpIHtcclxuICAgICAgICB0aGlzLnByb3BzLmRlbGV0ZUhhbmRsZShpbWFnZUlkKTtcclxuICAgIH0sXHJcbiAgICBkZWxldGVCdG46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXJcIiBvbkNsaWNrPXt0aGlzLmRlbGV0ZS5iaW5kKHRoaXMsIHRoaXMucHJvcHMuaW1hZ2UuSW1hZ2VJRCl9PlNsZXQ8L2J1dHRvbj4pO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkubW9kYWwoJ2hpZGUnKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsIGZhZGVcIiBpZD1cIm1vZGFsV2luZG93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZyBtb2RhbC1sZ1wiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGVcIj57dGhpcy5wcm9wcy5pbWFnZS5GaWxlbmFtZX08L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXt0aGlzLnByb3BzLmltYWdlLk9yaWdpbmFsVXJsfSB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaW1nLXJlc3BvbnNpdmVcIiBzcmM9e3RoaXMucHJvcHMuaW1hZ2UuUHJldmlld1VybH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jYW5FZGl0ID8gdGhpcy5kZWxldGVCdG4oKSA6ICcnIH1cclxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
