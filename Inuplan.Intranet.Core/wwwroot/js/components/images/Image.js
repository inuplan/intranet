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
                { onClick: this.toggleModal },
                React.createElement("img", { src: this.props.data.PreviewUrl, className: "img-thumbnail", alt: this.props.data.Filename })
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUIsaUJBQWEsdUJBQVk7QUFDckIsYUFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixLQUFLLEtBQUwsQ0FBVyxJQUFsQztBQUNILEtBSHlCO0FBSTFCLFlBQVEsa0JBQVk7QUFDaEIsZUFDQTtBQUFBO1lBQUE7WUFDSTtBQUFBO2dCQUFBLEVBQUcsU0FBUyxLQUFLLFdBQWpCO2dCQUNJLDZCQUFLLEtBQUssS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixVQUExQixFQUFzQyxXQUFVLGVBQWhELEVBQWdFLEtBQUssS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixRQUFyRjtBQURKO0FBREosU0FEQTtBQU9IO0FBWnlCLENBQWxCLENBQVoiLCJmaWxlIjoiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW1hZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICB0b2dnbGVNb2RhbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMubW9kYWxIYW5kbGUodGhpcy5wcm9wcy5kYXRhKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMudG9nZ2xlTW9kYWx9PlxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9e3RoaXMucHJvcHMuZGF0YS5QcmV2aWV3VXJsfSBjbGFzc05hbWU9XCJpbWctdGh1bWJuYWlsXCIgYWx0PXt0aGlzLnByb3BzLmRhdGEuRmlsZW5hbWV9IC8+XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
