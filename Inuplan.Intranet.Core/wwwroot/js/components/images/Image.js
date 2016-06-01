"use strict";

var Image = React.createClass({
    displayName: "Image",

    toggleModal: function toggleModal() {
        this.props.modalHandle(this.props.data);
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { href: "#", onClick: this.toggleModal },
                React.createElement("img", { src: this.props.data.PreviewUrl, className: "img-thumbnail", alt: this.props.data.Filename })
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUIsaUJBQWEsdUJBQVk7QUFDckIsYUFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixLQUFLLEtBQUwsQ0FBVyxJQUFsQztBQUNILEtBSHlCO0FBSTFCLFlBQVEsa0JBQVk7QUFDaEIsZUFDQTtBQUFBO1lBQUE7WUFDSTtBQUFBO2dCQUFBLEVBQUcsTUFBSyxHQUFSLEVBQVksU0FBUyxLQUFLLFdBQTFCO2dCQUNJLDZCQUFLLEtBQUssS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixVQUExQixFQUFzQyxXQUFVLGVBQWhELEVBQWdFLEtBQUssS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixRQUFyRjtBQURKO0FBREosU0FEQTtBQU9IO0FBWnlCLENBQWxCLENBQVoiLCJmaWxlIjoiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW1hZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICB0b2dnbGVNb2RhbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMubW9kYWxIYW5kbGUodGhpcy5wcm9wcy5kYXRhKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy50b2dnbGVNb2RhbH0+XHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17dGhpcy5wcm9wcy5kYXRhLlByZXZpZXdVcmx9IGNsYXNzTmFtZT1cImltZy10aHVtYm5haWxcIiBhbHQ9e3RoaXMucHJvcHMuZGF0YS5GaWxlbmFtZX0gLz5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
