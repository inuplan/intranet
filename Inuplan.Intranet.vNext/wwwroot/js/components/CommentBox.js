"use strict";

/// <reference path="CommentList.js" />
/// <reference path="CommentForm.js" />
var CommentBox = React.createClass({
    displayName: "CommentBox",

    loadCommentsFromServer: function loadCommentsFromServer() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function getInitialState() {
        return { data: [] };
    },
    componentDidMount: function componentDidMount() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer(), this.props.polInterval);
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "commentBox" },
            React.createElement(
                "h1",
                null,
                "Comments"
            ),
            React.createElement(CommentList, { data: this.state.data }),
            React.createElement(CommentForm, null)
        );
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29tbWVudEJveC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQUksYUFBYSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDL0IsNEJBQXdCLGtDQUFXO0FBQy9CLFVBQUUsSUFBRixDQUFPO0FBQ0gsaUJBQUssS0FBSyxLQUFMLENBQVcsR0FEYjtBQUVILHNCQUFVLE1BRlA7QUFHSCxtQkFBTyxLQUhKO0FBSUgscUJBQVMsVUFBVSxJQUFWLEVBQWdCO0FBQ3JCLHFCQUFLLFFBQUwsQ0FBYyxFQUFFLE1BQU0sSUFBUixFQUFkO0FBQ0gsYUFGUSxDQUVQLElBRk8sQ0FFRixJQUZFLENBSk47QUFPSCxtQkFBTyxVQUFVLEdBQVYsRUFBZSxNQUFmLEVBQXVCLEdBQXZCLEVBQTRCO0FBQy9CLHdCQUFRLEtBQVIsQ0FBYyxLQUFLLEtBQUwsQ0FBVyxHQUF6QixFQUE4QixNQUE5QixFQUFzQyxJQUFJLFFBQUosRUFBdEM7QUFDSCxhQUZNLENBRUwsSUFGSyxDQUVBLElBRkE7QUFQSixTQUFQO0FBV0gsS0FiOEI7QUFjL0IscUJBQWlCLDJCQUFZO0FBQ3pCLGVBQU8sRUFBRSxNQUFNLEVBQVIsRUFBUDtBQUNILEtBaEI4QjtBQWlCL0IsdUJBQW1CLDZCQUFZO0FBQzNCLGFBQUssc0JBQUw7QUFDQSxvQkFBWSxLQUFLLHNCQUFMLEVBQVosRUFBMkMsS0FBSyxLQUFMLENBQVcsV0FBdEQ7QUFDSCxLQXBCOEI7QUFxQi9CLFlBQVEsa0JBQVk7QUFDaEIsZUFDRjtBQUFBO1lBQUEsRUFBSyxXQUFVLFlBQWY7WUFDRTtBQUFBO2dCQUFBO2dCQUFBO0FBQUEsYUFERjtZQUVJLG9CQUFDLFdBQUQsSUFBYSxNQUFPLEtBQUssS0FBTCxDQUFXLElBQS9CLEdBRko7WUFHSSxvQkFBQyxXQUFEO0FBSEosU0FERTtBQU9IO0FBN0I4QixDQUFsQixDQUFqQiIsImZpbGUiOiJjb21wb25lbnRzL0NvbW1lbnRCb3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWVudExpc3QuanNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWVudEZvcm0uanNcIiAvPlxyXG52YXIgQ29tbWVudEJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGxvYWRDb21tZW50c0Zyb21TZXJ2ZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5wcm9wcy51cmwsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkYXRhOiBkYXRhIH0pO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLnVybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7IGRhdGE6IFtdIH07XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIoKTtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIoKSwgdGhpcy5wcm9wcy5wb2xJbnRlcnZhbClcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbW1lbnRCb3hcIj5cclxuICAgICAgICA8aDE+Q29tbWVudHM8L2gxPlxyXG4gICAgICAgICAgPENvbW1lbnRMaXN0IGRhdGE9eyB0aGlzLnN0YXRlLmRhdGEgfSAvPlxyXG4gICAgICAgICAgPENvbW1lbnRGb3JtIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICAgIH1cclxufSk7Il19
