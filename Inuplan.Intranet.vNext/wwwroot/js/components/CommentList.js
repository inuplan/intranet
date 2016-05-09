"use strict";

/// <reference path="Comment.js" />
var CommentList = React.createClass({
    displayName: "CommentList",

    render: function render() {

        // Transform the data into react components of comment
        var commentNodes = this.props.data.map(function (comment) {
            return React.createElement(
                Comment,
                { author: comment.author, key: comment.id },
                comment.text
            );
        });

        // return the components with an ordinary html wrapper
        return React.createElement(
            "div",
            { className: "commentList" },
            commentNodes
        );
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29tbWVudExpc3QuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksY0FBYyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDaEMsWUFBUSxrQkFBWTs7O0FBR2hCLFlBQUksZUFBZSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEdBQWhCLENBQW9CLFVBQVUsT0FBVixFQUFtQjtBQUN0RCxtQkFDSTtBQUFDLHVCQUFEO2dCQUFBLEVBQVMsUUFBUSxRQUFRLE1BQXpCLEVBQWlDLEtBQUssUUFBUSxFQUE5QztnQkFDSyxRQUFRO0FBRGIsYUFESjtBQUtILFNBTmtCLENBQW5COzs7QUFTQSxlQUNJO0FBQUE7WUFBQSxFQUFLLFdBQVUsYUFBZjtZQUNLO0FBREwsU0FESjtBQUtIO0FBbEIrQixDQUFsQixDQUFsQiIsImZpbGUiOiJjb21wb25lbnRzL0NvbW1lbnRMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1lbnQuanNcIiAvPlxyXG52YXIgQ29tbWVudExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gVHJhbnNmb3JtIHRoZSBkYXRhIGludG8gcmVhY3QgY29tcG9uZW50cyBvZiBjb21tZW50XHJcbiAgICAgICAgdmFyIGNvbW1lbnROb2RlcyA9IHRoaXMucHJvcHMuZGF0YS5tYXAoZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxDb21tZW50IGF1dGhvcj17Y29tbWVudC5hdXRob3J9IGtleT17Y29tbWVudC5pZCB9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtjb21tZW50LnRleHR9XHJcbiAgICAgICAgICAgICAgICA8L0NvbW1lbnQ+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHJldHVybiB0aGUgY29tcG9uZW50cyB3aXRoIGFuIG9yZGluYXJ5IGh0bWwgd3JhcHBlclxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29tbWVudExpc3RcIj5cclxuICAgICAgICAgICAgICAgIHtjb21tZW50Tm9kZXN9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pOyJdfQ==
