"use strict";

var ImageList = React.createClass({
    displayName: "ImageList",

    render: function render() {
        var commentsUrl = this.props.commentsUrl;
        var imageNodes = this.props.images.map(function (image) {
            return React.createElement(
                "div",
                { className: "col-lg-3" },
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzlCLFlBQVEsa0JBQVk7QUFDaEIsWUFBSSxjQUFjLEtBQUssS0FBTCxDQUFXLFdBQTdCO0FBQ0EsWUFBSSxhQUFhLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsR0FBbEIsQ0FBc0IsVUFBVSxLQUFWLEVBQWlCO0FBQ3BELG1CQUNJO0FBQUE7Z0JBQUEsRUFBSyxXQUFVLFVBQWY7Z0JBQ0ksb0JBQUMsS0FBRCxJQUFPLE1BQU0sS0FBYixFQUFvQixLQUFLLE1BQU0sT0FBL0IsRUFBd0MsYUFBYSxLQUFLLEtBQUwsQ0FBVyxXQUFoRTtBQURKLGFBREo7QUFLSCxTQU5zQyxDQU1yQyxJQU5xQyxDQU1oQyxJQU5nQyxDQUF0QixDQUFqQjs7QUFRQSxlQUNBO0FBQUE7WUFBQSxFQUFLLFdBQVUsS0FBZjtZQUNLO0FBREwsU0FEQTtBQUlIO0FBZjZCLENBQWxCLENBQWhCIiwiZmlsZSI6ImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBJbWFnZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgY29tbWVudHNVcmwgPSB0aGlzLnByb3BzLmNvbW1lbnRzVXJsO1xyXG4gICAgICAgIHZhciBpbWFnZU5vZGVzID0gdGhpcy5wcm9wcy5pbWFnZXMubWFwKGZ1bmN0aW9uIChpbWFnZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbWFnZSBkYXRhPXtpbWFnZX0ga2V5PXtpbWFnZS5JbWFnZUlEfSBtb2RhbEhhbmRsZT17dGhpcy5wcm9wcy5tb2RhbEhhbmRsZSB9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgIHtpbWFnZU5vZGVzfVxyXG4gICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn0pOyJdfQ==
