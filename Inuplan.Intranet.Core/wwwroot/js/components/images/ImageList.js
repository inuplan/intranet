"use strict";

var ImageList = React.createClass({
    displayName: "ImageList",

    render: function render() {
        var commentsUrl = this.props.commentsUrl;
        var imageNodes = this.props.images.map(function (image, index) {
            return React.createElement(
                "div",
                { className: "col-lg-3", style: { minHeight: "200px" }, key: image.ImageID },
                React.createElement(Image, { data: image, key: image.ImageID, modalHandle: this.props.modalHandle }),
                React.createElement(ImageList.CommentCount, { count: image.CommentCount })
            );
        }.bind(this));

        return React.createElement(
            "div",
            { className: "row" },
            imageNodes
        );
    }
});

ImageList.CommentCount = React.createClass({
    displayName: "CommentCount",

    render: function render() {
        var showCount = this.props.count > 0;
        return React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-lg-12" },
                showCount ? React.createElement(
                    "span",
                    { className: "label label-primary" },
                    "Antal kommentarer: ",
                    React.createElement(
                        "span",
                        null,
                        this.props.count
                    )
                ) : React.createElement(
                    "div",
                    { className: "label label-primary" },
                    "Ingen kommentarer"
                )
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzlCLFlBQVEsa0JBQVk7QUFDaEIsWUFBSSxjQUFjLEtBQUssS0FBTCxDQUFXLFdBQTdCO0FBQ0EsWUFBSSxhQUFhLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsR0FBbEIsQ0FBc0IsVUFBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCO0FBQzNELG1CQUNJO0FBQUE7Z0JBQUEsRUFBSyxXQUFVLFVBQWYsRUFBMEIsT0FBTyxFQUFFLFdBQVcsT0FBYixFQUFqQyxFQUF5RCxLQUFLLE1BQU0sT0FBcEU7Z0JBQ0ksb0JBQUMsS0FBRCxJQUFPLE1BQU0sS0FBYixFQUFvQixLQUFLLE1BQU0sT0FBL0IsRUFBd0MsYUFBYSxLQUFLLEtBQUwsQ0FBVyxXQUFoRSxHQURKO2dCQUVJLG9CQUFDLFNBQUQsQ0FBVyxZQUFYLElBQXdCLE9BQU8sTUFBTSxZQUFyQztBQUZKLGFBREo7QUFNSCxTQVBzQyxDQU9yQyxJQVBxQyxDQU9oQyxJQVBnQyxDQUF0QixDQUFqQjs7QUFTQSxlQUNBO0FBQUE7WUFBQSxFQUFLLFdBQVUsS0FBZjtZQUNLO0FBREwsU0FEQTtBQUlIO0FBaEI2QixDQUFsQixDQUFoQjs7QUFtQkEsVUFBVSxZQUFWLEdBQXlCLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUN2QyxZQUFRLGtCQUFZO0FBQ2hCLFlBQUksWUFBWSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQW1CLENBQW5DO0FBQ0EsZUFDSTtBQUFBO1lBQUEsRUFBSyxXQUFVLEtBQWY7WUFDSTtBQUFBO2dCQUFBLEVBQUssV0FBVSxXQUFmO2dCQUNLLFlBQ0Q7QUFBQTtvQkFBQSxFQUFNLFdBQVUscUJBQWhCO29CQUFBO29CQUF5RDtBQUFBO3dCQUFBO3dCQUFPLEtBQUssS0FBTCxDQUFXO0FBQWxCO0FBQXpELGlCQURDLEdBR0Q7QUFBQTtvQkFBQSxFQUFLLFdBQVUscUJBQWY7b0JBQUE7QUFBQTtBQUpKO0FBREosU0FESjtBQVVIO0FBYnNDLENBQWxCLENBQXpCIiwiZmlsZSI6ImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBJbWFnZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgY29tbWVudHNVcmwgPSB0aGlzLnByb3BzLmNvbW1lbnRzVXJsO1xyXG4gICAgICAgIHZhciBpbWFnZU5vZGVzID0gdGhpcy5wcm9wcy5pbWFnZXMubWFwKGZ1bmN0aW9uIChpbWFnZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTNcIiBzdHlsZT17eyBtaW5IZWlnaHQ6IFwiMjAwcHhcIiB9fSBrZXk9e2ltYWdlLkltYWdlSUQgfT5cclxuICAgICAgICAgICAgICAgICAgICA8SW1hZ2UgZGF0YT17aW1hZ2V9IGtleT17aW1hZ2UuSW1hZ2VJRH0gbW9kYWxIYW5kbGU9e3RoaXMucHJvcHMubW9kYWxIYW5kbGV9Lz5cclxuICAgICAgICAgICAgICAgICAgICA8SW1hZ2VMaXN0LkNvbW1lbnRDb3VudCBjb3VudD17aW1hZ2UuQ29tbWVudENvdW50fSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgIHtpbWFnZU5vZGVzfVxyXG4gICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuSW1hZ2VMaXN0LkNvbW1lbnRDb3VudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzaG93Q291bnQgPSB0aGlzLnByb3BzLmNvdW50ID4gMDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICB7c2hvd0NvdW50ID9cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJsYWJlbCBsYWJlbC1wcmltYXJ5XCI+QW50YWwga29tbWVudGFyZXI6IDxzcGFuPnt0aGlzLnByb3BzLmNvdW50fTwvc3Bhbj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgOlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtcHJpbWFyeVwiPkluZ2VuIGtvbW1lbnRhcmVyPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
