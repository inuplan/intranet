"use strict";

var CommentBox = React.createClass({
    displayName: "CommentBox",

    loadCommentsFromServer: function loadCommentsFromServer() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            data: this.props.range,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudEJveC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQy9CLDRCQUF3QixrQ0FBVztBQUMvQixVQUFFLElBQUYsQ0FBTztBQUNILGlCQUFLLEtBQUssS0FBTCxDQUFXLEdBRGI7QUFFSCxzQkFBVSxNQUZQO0FBR0gsa0JBQU0sS0FBSyxLQUFMLENBQVcsS0FIZDtBQUlILG1CQUFPLEtBSko7QUFLSCxxQkFBUyxVQUFVLElBQVYsRUFBZ0I7QUFDckIscUJBQUssUUFBTCxDQUFjLEVBQUUsTUFBTSxJQUFSLEVBQWQ7QUFDSCxhQUZRLENBRVAsSUFGTyxDQUVGLElBRkUsQ0FMTjtBQVFILG1CQUFPLFVBQVUsR0FBVixFQUFlLE1BQWYsRUFBdUIsR0FBdkIsRUFBNEI7QUFDL0Isd0JBQVEsS0FBUixDQUFjLEtBQUssS0FBTCxDQUFXLEdBQXpCLEVBQThCLE1BQTlCLEVBQXNDLElBQUksUUFBSixFQUF0QztBQUNILGFBRk0sQ0FFTCxJQUZLLENBRUEsSUFGQTtBQVJKLFNBQVA7QUFZSCxLQWQ4QjtBQWUvQixxQkFBaUIsMkJBQVk7QUFDekIsZUFBTyxFQUFFLE1BQU0sRUFBUixFQUFQO0FBQ0gsS0FqQjhCO0FBa0IvQix1QkFBbUIsNkJBQVk7QUFDM0IsYUFBSyxzQkFBTDtBQUNBLG9CQUFZLEtBQUssc0JBQUwsRUFBWixFQUEyQyxLQUFLLEtBQUwsQ0FBVyxXQUF0RDtBQUNILEtBckI4QjtBQXNCL0IsWUFBUSxrQkFBWTtBQUNoQixlQUNGO0FBQUE7WUFBQSxFQUFLLFdBQVUsWUFBZjtZQUNFO0FBQUE7Z0JBQUE7Z0JBQUE7QUFBQSxhQURGO1lBRUksb0JBQUMsV0FBRCxJQUFhLE1BQU8sS0FBSyxLQUFMLENBQVcsSUFBL0IsR0FGSjtZQUdJLG9CQUFDLFdBQUQ7QUFISixTQURFO0FBT0g7QUE5QjhCLENBQWxCLENBQWpCIiwiZmlsZSI6ImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudEJveC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBDb21tZW50Qm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgbG9hZENvbW1lbnRzRnJvbVNlcnZlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLnVybCxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5wcm9wcy5yYW5nZSxcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRhdGE6IGRhdGEgfSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIsIHN0YXR1cywgZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMucHJvcHMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgZGF0YTogW10gfTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlcigpO1xyXG4gICAgICAgIHNldEludGVydmFsKHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlcigpLCB0aGlzLnByb3BzLnBvbEludGVydmFsKVxyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29tbWVudEJveFwiPlxyXG4gICAgICAgIDxoMT5Db21tZW50czwvaDE+XHJcbiAgICAgICAgICA8Q29tbWVudExpc3QgZGF0YT17IHRoaXMuc3RhdGUuZGF0YSB9IC8+XHJcbiAgICAgICAgICA8Q29tbWVudEZvcm0gLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gICAgfVxyXG59KTsiXX0=
