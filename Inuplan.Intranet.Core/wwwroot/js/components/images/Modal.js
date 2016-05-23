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
        var fullname = this.props.image.Filename + "." + this.props.image.Extension;
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
                            fullname
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL01vZGFsLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUIsWUFBUSxpQkFBUyxPQUFULEVBQWtCO0FBQ3RCLGFBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsT0FBeEI7QUFDSCxLQUh5QjtBQUkxQixlQUFXLHFCQUFZO0FBQ25CLGVBQVE7QUFBQTtZQUFBLEVBQVEsTUFBSyxRQUFiLEVBQXNCLGdCQUFhLE9BQW5DLEVBQTJDLFdBQVUsZ0JBQXJELEVBQXNFLFNBQVMsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQixFQUF1QixLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLE9BQXhDLENBQS9FO1lBQUE7QUFBQSxTQUFSO0FBQ0gsS0FOeUI7QUFPMUIsdUJBQW1CLDZCQUFZO0FBQzNCLFVBQUUsU0FBUyxXQUFULENBQXFCLElBQXJCLENBQUYsRUFBOEIsS0FBOUIsQ0FBb0MsTUFBcEM7QUFDSCxLQVR5QjtBQVUxQixZQUFRLGtCQUFZO0FBQ2hCLFlBQUksV0FBVyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFFBQWpCLEdBQTRCLEdBQTVCLEdBQWtDLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsU0FBbEU7QUFDQSxlQUNJO0FBQUE7WUFBQSxFQUFLLFdBQVUsWUFBZixFQUE0QixJQUFHLGFBQS9CO1lBQ0k7QUFBQTtnQkFBQSxFQUFLLFdBQVUsdUJBQWY7Z0JBQ0U7QUFBQTtvQkFBQSxFQUFLLFdBQVUsZUFBZjtvQkFDRTtBQUFBO3dCQUFBLEVBQUssV0FBVSxjQUFmO3dCQUNFO0FBQUE7NEJBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVSxPQUFoQyxFQUF3QyxnQkFBYSxPQUFyRCxFQUE2RCxjQUFXLE9BQXhFOzRCQUFnRjtBQUFBO2dDQUFBLEVBQU0sZUFBWSxNQUFsQjtnQ0FBQTtBQUFBO0FBQWhGLHlCQURGO3dCQUVFO0FBQUE7NEJBQUEsRUFBSSxXQUFVLGFBQWQ7NEJBQTZCO0FBQTdCO0FBRkYscUJBREY7b0JBS0U7QUFBQTt3QkFBQSxFQUFLLFdBQVUsWUFBZjt3QkFDSTtBQUFBOzRCQUFBLEVBQUcsTUFBTSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFdBQTFCLEVBQXVDLFFBQU8sUUFBOUM7NEJBQ0ksNkJBQUssV0FBVSxnQkFBZixFQUFnQyxLQUFLLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsVUFBdEQ7QUFESjtBQURKLHFCQUxGO29CQVVFO0FBQUE7d0JBQUEsRUFBSyxXQUFVLGNBQWY7d0JBQ0csS0FBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixLQUFLLFNBQUwsRUFBckIsR0FBd0MsRUFEM0M7d0JBRUU7QUFBQTs0QkFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixXQUFVLGlCQUFoQyxFQUFrRCxnQkFBYSxPQUEvRDs0QkFBQTtBQUFBO0FBRkY7QUFWRjtBQURGO0FBREosU0FESjtBQXFCSDtBQWpDeUIsQ0FBbEIsQ0FBWiIsImZpbGUiOiJjb21wb25lbnRzL2ltYWdlcy9Nb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNb2RhbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGRlbGV0ZTogZnVuY3Rpb24oaW1hZ2VJZCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMuZGVsZXRlSGFuZGxlKGltYWdlSWQpO1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZUJ0bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAoPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlclwiIG9uQ2xpY2s9e3RoaXMuZGVsZXRlLmJpbmQodGhpcywgdGhpcy5wcm9wcy5pbWFnZS5JbWFnZUlEKX0+U2xldDwvYnV0dG9uPik7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBmdWxsbmFtZSA9IHRoaXMucHJvcHMuaW1hZ2UuRmlsZW5hbWUgKyBcIi5cIiArIHRoaXMucHJvcHMuaW1hZ2UuRXh0ZW5zaW9uO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwgZmFkZVwiIGlkPVwibW9kYWxXaW5kb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nIG1vZGFsLWxnXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPntmdWxsbmFtZX08L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXt0aGlzLnByb3BzLmltYWdlLk9yaWdpbmFsVXJsfSB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaW1nLXJlc3BvbnNpdmVcIiBzcmM9e3RoaXMucHJvcHMuaW1hZ2UuUHJldmlld1VybH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jYW5FZGl0ID8gdGhpcy5kZWxldGVCdG4oKSA6ICcnIH1cclxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
