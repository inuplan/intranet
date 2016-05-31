'use strict';

var CommentBox = React.createClass({
    displayName: 'CommentBox',

    getInitialState: function getInitialState() {
        return {
            comments: [],
            user: { ID: -1 },
            skip: 0,
            take: 10,
            page: 1,
            totalPages: 1
        };
    },
    postComment: function postComment(text) {
        $.ajax({
            url: this.props.commentsUrl + "?imageId=" + this.props.imageId,
            method: 'POST',
            dataType: 'json',
            data: { Text: text },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.loadCommentsFromServer(this.props.imageId, this.state.skip, this.state.take);
            }.bind(this)
        });
    },
    loadCommentsFromServer: function loadCommentsFromServer(imageId, skip, take) {
        var url = this.props.commentsUrl + "?imageId=" + imageId + "&skip=" + skip + "&take=" + take;
        $.ajax({
            url: url,
            method: 'GET',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            processData: false,
            success: function (data) {
                this.setState({
                    comments: data.CurrentItems,
                    page: data.CurrentPage,
                    totalPages: data.TotalPages
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    loadUser: function loadUser(username) {
        $.ajax({
            url: this.props.userUrl,
            data: { username: username },
            method: 'GET',
            success: function (data) {
                this.setState({ user: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.userUrl, status, err.toString());
            }.bind(this),
            xhrFields: {
                withCredentials: true
            }
        });
    },
    commentDeleteHandle: function commentDeleteHandle(commentId) {
        $.ajax({
            url: this.props.commentsUrl + "?commentId=" + commentId,
            method: 'DELETE',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.loadCommentsFromServer(this.props.imageId, this.state.skip, this.state.take);
            }.bind(this),
            processData: false
        });
    },
    commentEditHandle: function commentEditHandle(comment) {
        $.ajax({
            url: this.props.commentsUrl + "?imageId=" + this.props.imageId,
            method: 'PUT',
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify(comment),
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            success: function () {
                this.loadCommentsFromServer(this.props.imageId, this.state.skip, this.state.take);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.commentsUrl, status, err.toString());
            }.bind(this)
        });
    },
    commentReplyHandle: function commentReplyHandle(replyTo, text) {
        $.ajax({
            url: this.props.commentsUrl + "?imageId=" + this.props.imageId + "&replyId=" + replyTo,
            method: 'POST',
            dataType: 'json',
            data: { Text: text },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.loadCommentsFromServer(this.props.imageId, this.state.skip, this.state.take);
            }.bind(this)
        });
    },
    nextPage: function nextPage() {
        var skipNext = this.state.skip + this.state.take;
        this.setState({ skip: skipNext });
        this.loadCommentsFromServer(this.props.imageId, skipNext, this.state.take);
    },
    getPage: function getPage(p) {
        var skipPages = p - 1;
        var skipItems = skipPages * this.state.take;
        this.setState({ skip: skipItems });
        this.loadCommentsFromServer(this.props.imageId, skipItems, this.state.take);
    },
    previousPage: function previousPage() {
        var backSkip = this.state.skip - this.state.take;
        this.setState({ skip: backSkip });
        this.loadCommentsFromServer(this.props.imageId, backSkip, this.state.take);
    },
    componentDidMount: function componentDidMount() {
        this.loadCommentsFromServer(this.props.imageId, this.state.skip, this.state.take);
        this.loadUser(this.props.username);
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-lg-offset-1 col-lg-11' },
                    React.createElement(CommentList, {
                        url: this.props.commentsUrl,
                        username: this.props.username,
                        imageId: this.props.imageId,
                        userUrl: this.props.userUrl,
                        commentDeleteHandle: this.commentDeleteHandle,
                        commentEditHandle: this.commentEditHandle,
                        commentReplyHandle: this.commentReplyHandle,
                        comments: this.state.comments,
                        userID: this.state.user.ID
                    })
                )
            ),
            React.createElement(
                'div',
                { className: 'row text-left' },
                React.createElement(Pagination, {
                    imageId: this.props.imageId,
                    currentPage: this.state.page,
                    totalPages: this.state.totalPages,
                    next: this.nextPage,
                    prev: this.previousPage,
                    getPage: this.getPage
                })
            ),
            React.createElement('hr', null),
            React.createElement(
                'div',
                { className: 'row text-left' },
                React.createElement(
                    'div',
                    { className: 'col-lg-offset-1 col-lg-10' },
                    React.createElement(CommentForm, {
                        url: this.props.commentsUrl,
                        imageId: this.props.imageId,
                        postCommentHandle: this.postComment
                    })
                )
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudEJveC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQy9CLHFCQUFpQiwyQkFBWTtBQUN6QixlQUFPO0FBQ0gsc0JBQVUsRUFEUDtBQUVILGtCQUFNLEVBQUUsSUFBSSxDQUFDLENBQVAsRUFGSDtBQUdILGtCQUFNLENBSEg7QUFJSCxrQkFBTSxFQUpIO0FBS0gsa0JBQU0sQ0FMSDtBQU1ILHdCQUFZO0FBTlQsU0FBUDtBQVFILEtBVjhCO0FBVy9CLGlCQUFhLHFCQUFVLElBQVYsRUFBZ0I7QUFDekIsVUFBRSxJQUFGLENBQU87QUFDSCxpQkFBSyxLQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLFdBQXpCLEdBQXVDLEtBQUssS0FBTCxDQUFXLE9BRHBEO0FBRUgsb0JBQVEsTUFGTDtBQUdILHNCQUFVLE1BSFA7QUFJSCxrQkFBTSxFQUFFLE1BQU0sSUFBUixFQUpIO0FBS0gsdUJBQVc7QUFDUCxpQ0FBaUI7QUFEVixhQUxSO0FBUUgscUJBQVMsVUFBVSxJQUFWLEVBQWdCO0FBQ3JCLHFCQUFLLHNCQUFMLENBQTRCLEtBQUssS0FBTCxDQUFXLE9BQXZDLEVBQWdELEtBQUssS0FBTCxDQUFXLElBQTNELEVBQWlFLEtBQUssS0FBTCxDQUFXLElBQTVFO0FBQ0gsYUFGUSxDQUVQLElBRk8sQ0FFRixJQUZFO0FBUk4sU0FBUDtBQVlILEtBeEI4QjtBQXlCL0IsNEJBQXdCLGdDQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0I7QUFDbkQsWUFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLFdBQVgsR0FBeUIsV0FBekIsR0FBdUMsT0FBdkMsR0FBaUQsUUFBakQsR0FBNEQsSUFBNUQsR0FBbUUsUUFBbkUsR0FBOEUsSUFBeEY7QUFDQSxVQUFFLElBQUYsQ0FBTztBQUNILGlCQUFLLEdBREY7QUFFSCxvQkFBUSxLQUZMO0FBR0gs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MEJBQU0sS0FBSyxZQUxqQjtBQU1NLDZCQUFTLEtBQUs7QUFOcEI7QUFESixhQWhCSjtZQTBCSSwrQkExQko7WUEyQkk7QUFBQTtnQkFBQSxFQUFLLFdBQVUsZUFBZjtnQkFDSTtBQUFBO29CQUFBLEVBQUssV0FBVSwyQkFBZjtvQkFDSSxvQkFBQyxXQUFEO0FBQ0ksNkJBQUssS0FBSyxLQUFMLENBQVcsV0FEcEI7QUFFSSxpQ0FBUyxLQUFLLEtBQUwsQ0FBVyxPQUZ4QjtBQUdJLDJDQUFtQixLQUFLO0FBSDVCO0FBREo7QUFESjtBQTNCSixTQURKO0FBc0NIO0FBeEs4QixDQUFsQixDQUFqQiIsImZpbGUiOiJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRCb3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQ29tbWVudEJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRzOiBbXSxcclxuICAgICAgICAgICAgdXNlcjogeyBJRDogLTEgfSxcclxuICAgICAgICAgICAgc2tpcDogMCxcclxuICAgICAgICAgICAgdGFrZTogMTAsXHJcbiAgICAgICAgICAgIHBhZ2U6IDEsXHJcbiAgICAgICAgICAgIHRvdGFsUGFnZXM6IDEsXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBvc3RDb21tZW50OiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5wcm9wcy5jb21tZW50c1VybCArIFwiP2ltYWdlSWQ9XCIgKyB0aGlzLnByb3BzLmltYWdlSWQsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiB7IFRleHQ6IHRleHQgfSxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlcih0aGlzLnByb3BzLmltYWdlSWQsIHRoaXMuc3RhdGUuc2tpcCwgdGhpcy5zdGF0ZS50YWtlKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgbG9hZENvbW1lbnRzRnJvbVNlcnZlcjogZnVuY3Rpb24gKGltYWdlSWQsIHNraXAsIHRha2UpIHtcclxuICAgICAgICB2YXIgdXJsID0gdGhpcy5wcm9wcy5jb21tZW50c1VybCArIFwiP2ltYWdlSWQ9XCIgKyBpbWFnZUlkICsgXCImc2tpcD1cIiArIHNraXAgKyBcIiZ0YWtlPVwiICsgdGFrZTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudHM6IGRhdGEuQ3VycmVudEl0ZW1zLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGRhdGEuQ3VycmVudFBhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlczogZGF0YS5Ub3RhbFBhZ2VzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBsb2FkVXNlcjogZnVuY3Rpb24odXNlcm5hbWUpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHRoaXMucHJvcHMudXNlclVybCxcclxuICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdXNlcm5hbWUgfSxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB1c2VyOiBkYXRhIH0pO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLnVzZXJVcmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBjb21tZW50RGVsZXRlSGFuZGxlOiBmdW5jdGlvbiAoY29tbWVudElkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmNvbW1lbnRzVXJsICsgXCI/Y29tbWVudElkPVwiICsgY29tbWVudElkLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29tbWVudHNGcm9tU2VydmVyKHRoaXMucHJvcHMuaW1hZ2VJZCwgdGhpcy5zdGF0ZS5za2lwLCB0aGlzLnN0YXRlLnRha2UpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgY29tbWVudEVkaXRIYW5kbGU6IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmNvbW1lbnRzVXJsICsgXCI/aW1hZ2VJZD1cIiArIHRoaXMucHJvcHMuaW1hZ2VJZCxcclxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoY29tbWVudCksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29tbWVudHNGcm9tU2VydmVyKHRoaXMucHJvcHMuaW1hZ2VJZCwgdGhpcy5zdGF0ZS5za2lwLCB0aGlzLnN0YXRlLnRha2UpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLmNvbW1lbnRzVXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgY29tbWVudFJlcGx5SGFuZGxlOiBmdW5jdGlvbihyZXBseVRvLCB0ZXh0KSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmNvbW1lbnRzVXJsICsgXCI/aW1hZ2VJZD1cIiArIHRoaXMucHJvcHMuaW1hZ2VJZCArIFwiJnJlcGx5SWQ9XCIgKyByZXBseVRvLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YTogeyBUZXh0OiB0ZXh0IH0sXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy5pbWFnZUlkLCB0aGlzLnN0YXRlLnNraXAsIHRoaXMuc3RhdGUudGFrZSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIG5leHRQYWdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNraXBOZXh0ID0gdGhpcy5zdGF0ZS5za2lwICsgdGhpcy5zdGF0ZS50YWtlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBza2lwOiBza2lwTmV4dCB9KTtcclxuICAgICAgICB0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy5pbWFnZUlkLCBza2lwTmV4dCwgdGhpcy5zdGF0ZS50YWtlKTtcclxuICAgIH0sXHJcbiAgICBnZXRQYWdlOiBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgIHZhciBza2lwUGFnZXMgPSBwIC0gMTtcclxuICAgICAgICB2YXIgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRoaXMuc3RhdGUudGFrZSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNraXA6IHNraXBJdGVtcyB9KTtcclxuICAgICAgICB0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy5pbWFnZUlkLCBza2lwSXRlbXMsIHRoaXMuc3RhdGUudGFrZSk7XHJcbiAgICB9LFxyXG4gICAgcHJldmlvdXNQYWdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGJhY2tTa2lwID0gdGhpcy5zdGF0ZS5za2lwIC0gdGhpcy5zdGF0ZS50YWtlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBza2lwOiBiYWNrU2tpcCB9KTtcclxuICAgICAgICB0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy5pbWFnZUlkLCBiYWNrU2tpcCwgdGhpcy5zdGF0ZS50YWtlKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlcih0aGlzLnByb3BzLmltYWdlSWQsIHRoaXMuc3RhdGUuc2tpcCwgdGhpcy5zdGF0ZS50YWtlKTtcclxuICAgICAgICB0aGlzLmxvYWRVc2VyKHRoaXMucHJvcHMudXNlcm5hbWUpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudExpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw9e3RoaXMucHJvcHMuY29tbWVudHNVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3RoaXMucHJvcHMudXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VJZD17dGhpcy5wcm9wcy5pbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJVcmw9e3RoaXMucHJvcHMudXNlclVybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50RGVsZXRlSGFuZGxlPXt0aGlzLmNvbW1lbnREZWxldGVIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudEVkaXRIYW5kbGU9e3RoaXMuY29tbWVudEVkaXRIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudFJlcGx5SGFuZGxlPXt0aGlzLmNvbW1lbnRSZXBseUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50cz17dGhpcy5zdGF0ZS5jb21tZW50c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySUQ9e3RoaXMuc3RhdGUudXNlci5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxQYWdpbmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VJZD17dGhpcy5wcm9wcy5pbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlPXt0aGlzLnN0YXRlLnBhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlcz17dGhpcy5zdGF0ZS50b3RhbFBhZ2VzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQ9e3RoaXMubmV4dFBhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldj17dGhpcy5wcmV2aW91c1BhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UGFnZT17dGhpcy5nZXRQYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50Rm9ybVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsPXt0aGlzLnByb3BzLmNvbW1lbnRzVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VJZD17dGhpcy5wcm9wcy5pbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdENvbW1lbnRIYW5kbGU9e3RoaXMucG9zdENvbW1lbnR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
