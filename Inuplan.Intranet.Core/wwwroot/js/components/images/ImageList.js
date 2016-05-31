"use strict";

var ImageList = React.createClass({
    displayName: "ImageList",

    render: function render() {
        var commentsUrl = this.props.commentsUrl;
        var imageNodes = this.props.images.map(function (image, index) {
            return React.createElement(
                "div",
                { className: "col-lg-3", style: { minHeight: "200px" }, key: image.ImageID },
                React.createElement(Image, { data: image, key: image.ImageID, modalHandle: this.props.modalHandle })
            );
        }.bind(this));

        return React.createElement(
            "div",
            { className: "row" },
            imageNodes
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzlCLFlBQVEsa0JBQVk7QUFDaEIsWUFBSSxjQUFjLEtBQUssS0FBTCxDQUFXLFdBQTdCO0FBQ0EsWUFBSSxhQUFhLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsR0FBbEIsQ0FBc0IsVUFBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCO0FBQzNELG1CQUNJO0FBQUE7Z0JBQUEsRUFBSyxXQUFVLFVBQWYsRUFBMEIsT0FBTyxFQUFFLFdBQVcsT0FBYixFQUFqQyxFQUF5RCxLQUFLLE1BQU0sT0FBcEU7Z0JBQ0ksb0JBQUMsS0FBRCxJQUFPLE1BQU0sS0FBYixFQUFvQixLQUFLLE1BQU0sT0FBL0IsRUFBd0MsYUFBYSxLQUFLLEtBQUwsQ0FBVyxXQUFoRTtBQURKLGFBREo7QUFLSCxTQU5zQyxDQU1yQyxJQU5xQyxDQU1oQyxJQU5nQyxDQUF0QixDQUFqQjs7QUFRQSxlQUNBO0FBQUE7WUFBQSxFQUFLLFdBQVUsS0FBZjtZQUNLO0FBREwsU0FEQTtBQUlIO0FBZjZCLENBQWxCLENBQWhCIiwiZmlsZSI6ImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBJbWFnZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgY29tbWVudHNVcmwgPSB0aGlzLnByb3BzLmNvbW1lbnRzVXJsO1xyXG4gICAgICAgIHZhciBpbWFnZU5vZGVzID0gdGhpcy5wcm9wcy5pbWFnZXMubWFwKGZ1bmN0aW9uIChpbWFnZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTNcIiBzdHlsZT17eyBtaW5IZWlnaHQ6IFwiMjAwcHhcIiB9fSBrZXk9e2ltYWdlLkltYWdlSUQgfT5cclxuICAgICAgICAgICAgICAgICAgICA8SW1hZ2UgZGF0YT17aW1hZ2V9IGtleT17aW1hZ2UuSW1hZ2VJRH0gbW9kYWxIYW5kbGU9e3RoaXMucHJvcHMubW9kYWxIYW5kbGV9Lz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICB7aW1hZ2VOb2Rlc31cclxuICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
