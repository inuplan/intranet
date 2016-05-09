"use strict";

/// <reference path="CommentList.js" />
/// <reference path="CommentForm.js" />
var CommentBox = React.createClass({
    displayName: "CommentBox",

    render: function render() {
        return React.createElement(
            "div",
            { className: "commentBox" },
            React.createElement(
                "h1",
                null,
                "Comments"
            ),
            React.createElement(CommentList, { data: this.props.data }),
            React.createElement(CommentForm, null)
        );
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29tbWVudEJveC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQUksYUFBYSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDL0IsWUFBUSxrQkFBWTtBQUNoQixlQUNGO0FBQUE7WUFBQSxFQUFLLFdBQVUsWUFBZjtZQUNFO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxhQURGO1lBRUksb0JBQUMsV0FBRCxJQUFhLE1BQU8sS0FBSyxLQUFMLENBQVcsSUFBL0IsR0FGSjtZQUdJLG9CQUFDLFdBQUQ7QUFISixTQURFO0FBT0g7QUFUOEIsQ0FBbEIsQ0FBakIiLCJmaWxlIjoiY29tcG9uZW50cy9Db21tZW50Qm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1lbnRMaXN0LmpzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1lbnRGb3JtLmpzXCIgLz5cclxudmFyIENvbW1lbnRCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbW1lbnRCb3hcIj5cclxuICAgICAgICA8aDE+Q29tbWVudHM8L2gxPlxyXG4gICAgICAgICAgPENvbW1lbnRMaXN0IGRhdGE9eyB0aGlzLnByb3BzLmRhdGF9IC8+XHJcbiAgICAgICAgICA8Q29tbWVudEZvcm0gLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gICAgfVxyXG59KTsiXX0=
