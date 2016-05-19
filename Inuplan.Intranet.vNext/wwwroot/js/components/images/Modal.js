"use strict";

var Modal = React.createClass({
    displayName: "Modal",

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL01vZGFsLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUIsdUJBQW1CLDZCQUFZO0FBQzNCLFVBQUUsU0FBUyxXQUFULENBQXFCLElBQXJCLENBQUYsRUFBOEIsS0FBOUIsQ0FBb0MsTUFBcEM7QUFDSCxLQUh5QjtBQUkxQixZQUFRLGtCQUFZO0FBQ2hCLGVBQ0k7QUFBQTtZQUFBLEVBQUssV0FBVSxZQUFmLEVBQTRCLElBQUcsYUFBL0I7WUFDSTtBQUFBO2dCQUFBLEVBQUssV0FBVSx1QkFBZjtnQkFDRTtBQUFBO29CQUFBLEVBQUssV0FBVSxlQUFmO29CQUNFO0FBQUE7d0JBQUEsRUFBSyxXQUFVLGNBQWY7d0JBQ0U7QUFBQTs0QkFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixXQUFVLE9BQWhDLEVBQXdDLGdCQUFhLE9BQXJELEVBQTZELGNBQVcsT0FBeEU7NEJBQWdGO0FBQUE7Z0NBQUEsRUFBTSxlQUFZLE1BQWxCO2dDQUFBO0FBQUE7QUFBaEYseUJBREY7d0JBRUU7QUFBQTs0QkFBQSxFQUFJLFdBQVUsYUFBZDs0QkFBNkIsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQjtBQUE5QztBQUZGLHFCQURGO29CQUtFO0FBQUE7d0JBQUEsRUFBSyxXQUFVLFlBQWY7d0JBQ0k7QUFBQTs0QkFBQSxFQUFHLE1BQU0sS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixXQUExQixFQUF1QyxRQUFPLFFBQTlDOzRCQUNJLDZCQUFLLFdBQVUsZ0JBQWYsRUFBZ0MsS0FBSyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQXREO0FBREo7QUFESixxQkFMRjtvQkFVRTtBQUFBO3dCQUFBLEVBQUssV0FBVSxjQUFmO3dCQUNFO0FBQUE7NEJBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVSxpQkFBaEMsRUFBa0QsZ0JBQWEsT0FBL0Q7NEJBQUE7QUFBQTtBQURGO0FBVkY7QUFERjtBQURKLFNBREo7QUFvQkg7QUF6QnlCLENBQWxCLENBQVoiLCJmaWxlIjoiY29tcG9uZW50cy9pbWFnZXMvTW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTW9kYWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCIgaWQ9XCJtb2RhbFdpbmRvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2cgbW9kYWwtbGdcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlXCI+e3RoaXMucHJvcHMuaW1hZ2UuRmlsZW5hbWV9PC9oND5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17dGhpcy5wcm9wcy5pbWFnZS5PcmlnaW5hbFVybH0gdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImltZy1yZXNwb25zaXZlXCIgc3JjPXt0aGlzLnByb3BzLmltYWdlLlByZXZpZXdVcmx9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTsiXX0=
