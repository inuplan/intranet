"use strict";

/// <reference path="Comment.js" />
var CommentList = React.createClass({
    displayName: "CommentList",

    render: function render() {

        // Transform the data into react components of comment
        var commentNodes = this.props.data.map(function (comment) {
            return React.createElement(Comment, { author: comment.Author, key: comment.ID, replies: comment.Replies, text: comment.Text });
        });

        // return the components with an ordinary html wrapper
        return React.createElement(
            "div",
            { className: "commentList" },
            commentNodes
        );
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudExpc3QuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksY0FBYyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDaEMsWUFBUSxrQkFBWTs7O0FBR2hCLFlBQUksZUFBZSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEdBQWhCLENBQW9CLFVBQVUsT0FBVixFQUFtQjtBQUN0RCxtQkFDSSxvQkFBQyxPQUFELElBQVMsUUFBUSxRQUFRLE1BQXpCLEVBQWlDLEtBQUssUUFBUSxFQUE5QyxFQUFrRCxTQUFTLFFBQVEsT0FBbkUsRUFBNEUsTUFBTSxRQUFRLElBQTFGLEdBREo7QUFHSCxTQUprQixDQUFuQjs7O0FBT0EsZUFDSTtBQUFBO1lBQUEsRUFBSyxXQUFVLGFBQWY7WUFDSztBQURMLFNBREo7QUFLSDtBQWhCK0IsQ0FBbEIsQ0FBbEIiLCJmaWxlIjoiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50TGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tZW50LmpzXCIgLz5cclxudmFyIENvbW1lbnRMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIFRyYW5zZm9ybSB0aGUgZGF0YSBpbnRvIHJlYWN0IGNvbXBvbmVudHMgb2YgY29tbWVudFxyXG4gICAgICAgIHZhciBjb21tZW50Tm9kZXMgPSB0aGlzLnByb3BzLmRhdGEubWFwKGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8Q29tbWVudCBhdXRob3I9e2NvbW1lbnQuQXV0aG9yfSBrZXk9e2NvbW1lbnQuSUR9IHJlcGxpZXM9e2NvbW1lbnQuUmVwbGllc30gdGV4dD17Y29tbWVudC5UZXh0fSAvPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyByZXR1cm4gdGhlIGNvbXBvbmVudHMgd2l0aCBhbiBvcmRpbmFyeSBodG1sIHdyYXBwZXJcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbW1lbnRMaXN0XCI+XHJcbiAgICAgICAgICAgICAgICB7Y29tbWVudE5vZGVzfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTsiXX0=
