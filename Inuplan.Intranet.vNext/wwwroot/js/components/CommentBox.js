"use strict";

/// <reference path="CommentList.js" />
/// <reference path="CommentForm.js" />
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29tbWVudEJveC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQUksYUFBYSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDL0IsNEJBQXdCLGtDQUFXO0FBQy9CLFVBQUUsSUFBRixDQUFPO0FBQ0gsaUJBQUssS0FBSyxLQUFMLENBQVcsR0FEYjtBQUVILHNCQUFVLE1BRlA7QUFHSCxrQkFBTSxLQUFLLEtBQUwsQ0FBVyxLQUhkO0FBSUgsbUJBQU8sS0FKSjtBQUtILHFCQUFTLFVBQVUsSUFBVixFQUFnQjtBQUNyQixxQkFBSyxRQUFMLENBQWMsRUFBRSxNQUFNLElBQVIsRUFBZDtBQUNILGFBRlEsQ0FFUCxJQUZPLENBRUYsSUFGRSxDQUxOO0FBUUgsbUJBQU8sVUFBVSxHQUFWLEVBQWUsTUFBZixFQUF1QixHQUF2QixFQUE0QjtBQUMvQix3QkFBUSxLQUFSLENBQWMsS0FBSyxLQUFMLENBQVcsR0FBekIsRUFBOEIsTUFBOUIsRUFBc0MsSUFBSSxRQUFKLEVBQXRDO0FBQ0gsYUFGTSxDQUVMLElBRkssQ0FFQSxJQUZBO0FBUkosU0FBUDtBQVlILEtBZDhCO0FBZS9CLHFCQUFpQiwyQkFBWTtBQUN6QixlQUFPLEVBQUUsTUFBTSxFQUFSLEVBQVA7QUFDSCxLQWpCOEI7QUFrQi9CLHVCQUFtQiw2QkFBWTtBQUMzQixhQUFLLHNCQUFMO0FBQ0Esb0JBQVksS0FBSyxzQkFBTCxFQUFaLEVBQTJDLEtBQUssS0FBTCxDQUFXLFdBQXREO0FBQ0gsS0FyQjhCO0FBc0IvQixZQUFRLGtCQUFZO0FBQ2hCLGVBQ0Y7QUFBQTtZQUFBLEVBQUssV0FBVSxZQUFmO1lBQ0U7QUFBQTtnQkFBQTtnQkFBQTtBQUFBLGFBREY7WUFFSSxvQkFBQyxXQUFELElBQWEsTUFBTyxLQUFLLEtBQUwsQ0FBVyxJQUEvQixHQUZKO1lBR0ksb0JBQUMsV0FBRDtBQUhKLFNBREU7QUFPSDtBQTlCOEIsQ0FBbEIsQ0FBakIiLCJmaWxlIjoiY29tcG9uZW50cy9Db21tZW50Qm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1lbnRMaXN0LmpzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1lbnRGb3JtLmpzXCIgLz5cclxudmFyIENvbW1lbnRCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBsb2FkQ29tbWVudHNGcm9tU2VydmVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHRoaXMucHJvcHMudXJsLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLnByb3BzLnJhbmdlLFxyXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGF0YTogZGF0YSB9KTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5wcm9wcy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4geyBkYXRhOiBbXSB9O1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkQ29tbWVudHNGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwodGhpcy5sb2FkQ29tbWVudHNGcm9tU2VydmVyKCksIHRoaXMucHJvcHMucG9sSW50ZXJ2YWwpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb21tZW50Qm94XCI+XHJcbiAgICAgICAgPGgxPkNvbW1lbnRzPC9oMT5cclxuICAgICAgICAgIDxDb21tZW50TGlzdCBkYXRhPXsgdGhpcy5zdGF0ZS5kYXRhIH0gLz5cclxuICAgICAgICAgIDxDb21tZW50Rm9ybSAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgICB9XHJcbn0pOyJdfQ==
