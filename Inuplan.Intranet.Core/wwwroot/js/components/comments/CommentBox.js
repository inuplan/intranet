'use strict';

var CommentBox = React.createClass({
    displayName: 'CommentBox',

    getInitialState: function getInitialState() {
        return {
            comments: [],
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
                        imageId: this.props.imageId,
                        commentDeleteHandle: this.commentDeleteHandle,
                        commentEditHandle: this.commentEditHandle,
                        commentReplyHandle: this.commentReplyHandle,
                        comments: this.state.comments,
                        userId: this.props.userId
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudEJveC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQy9CLHFCQUFpQiwyQkFBWTtBQUN6QixlQUFPO0FBQ0gsc0JBQVUsRUFEUDtBQUVILGtCQUFNLENBRkg7QUFHSCxrQkFBTSxFQUhIO0FBSUgsa0JBQU0sQ0FKSDtBQUtILHdCQUFZO0FBTFQsU0FBUDtBQU9ILEtBVDhCO0FBVS9CLGlCQUFhLHFCQUFVLElBQVYsRUFBZ0I7QUFDekIsVUFBRSxJQUFGLENBQU87QUFDSCxpQkFBSyxLQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLFdBQXpCLEdBQXVDLEtBQUssS0FBTCxDQUFXLE9BRHBEO0FBRUgsb0JBQVEsTUFGTDtBQUdILHNCQUFVLE1BSFA7QUFJSCxrQkFBTSxFQUFFLE1BQU0sSUFBUixFQUpIO0FBS0gsdUJBQVc7QUFDUCxpQ0FBaUI7QUFEVixhQUxSO0FBUUgscUJBQVMsVUFBVSxJQUFWLEVBQWdCO0FBQ3JCLHFCQUFLLHNCQUFMLENBQTRCLEtBQUssS0FBTCxDQUFXLE9BQXZDLEVBQWdELEtBQUssS0FBTCxDQUFXLElBQTNELEVBQWlFLEtBQUssS0FBTCxDQUFXLElBQTVFO0FBQ0gsYUFGUSxDQUVQLElBRk8sQ0FFRixJQUZFO0FBUk4sU0FBUDtBQVlILEtBdkI4QjtBQXdCL0IsNEJBQXdCLGdDQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0I7QUFDbkQsWUFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLFdBQVgsR0FBeUIsV0FBekIsR0FBdUMsT0FBdkMsR0FBaUQsUUFBakQsR0FBNEQsSUFBNUQsR0FBbUUsUUFBbkUsR0FBOEUsSUFBeEY7QUFDQSxVQUFFLElBQUYsQ0FBTztBQUNILGlCQUFLLEdBREY7QUFFSCxvQkFBUSxLQUZMO0FBR0gsdUJBQVc7QUFDUCxpQ0FBaUI7QUFEVixhQUhSO0FBTUgsc0JB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QkFIL0I7QUFJSywyQ0FBbUIsS0FBSyxpQkFKN0I7QUFLSyw0Q0FBb0IsS0FBSyxrQkFMOUI7QUFNSyxrQ0FBVSxLQUFLLEtBQUwsQ0FBVyxRQU4xQjtBQU9LLGdDQUFRLEtBQUssS0FBTCxDQUFXO0FBUHhCO0FBREo7QUFESixhQURKO1lBY0k7QUFBQTtnQkFBQSxFQUFLLFdBQVUsZUFBZjtnQkFDSSxvQkFBQyxVQUFEO0FBQ00sNkJBQVMsS0FBSyxLQUFMLENBQVcsT0FEMUI7QUFFTSxpQ0FBYSxLQUFLLEtBQUwsQ0FBVyxJQUY5QjtBQUdNLGdDQUFZLEtBQUssS0FBTCxDQUFXLFVBSDdCO0FBSU0sMEJBQU0sS0FBSyxRQUpqQjtBQUtNLDBCQUFNLEtBQUssWUFMakI7QUFNTSw2QkFBUyxLQUFLO0FBTnBCO0FBREosYUFkSjtZQXdCSSwrQkF4Qko7WUF5Qkk7QUFBQTtnQkFBQSxFQUFLLFdBQVUsZUFBZjtnQkFDSTtBQUFBO29CQUFBLEVBQUssV0FBVSwyQkFBZjtvQkFDSSxvQkFBQyxXQUFEO0FBQ0ksNkJBQUssS0FBSyxLQUFMLENBQVcsV0FEcEI7QUFFSSxpQ0FBUyxLQUFLLEtBQUwsQ0FBVyxPQUZ4QjtBQUdJLDJDQUFtQixLQUFLO0FBSDVCO0FBREo7QUFESjtBQXpCSixTQURKO0FBb0NIO0FBcEo4QixDQUFsQixDQUFqQiIsImZpbGUiOiJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRCb3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQ29tbWVudEJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRzOiBbXSxcclxuICAgICAgICAgICAgc2tpcDogMCxcclxuICAgICAgICAgICAgdGFrZTogMTAsXHJcbiAgICAgICAgICAgIHBhZ2U6IDEsXHJcbiAgICAgICAgICAgIHRvdGFsUGFnZXM6IDEsXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBvc3RDb21tZW50OiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5wcm9wcy5jb21tZW50c1VybCArIFwiP2ltYWdlSWQ9XCIgKyB0aGlzLnByb3BzLmltYWdlSWQsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiB7IFRleHQ6IHRleHQgfSxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlcih0aGlzLnByb3BzLmltYWdlSWQsIHRoaXMuc3RhdGUuc2tpcCwgdGhpcy5zdGF0ZS50YWtlKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgbG9hZENvbW1lbnRzRnJvbVNlcnZlcjogZnVuY3Rpb24gKGltYWdlSWQsIHNraXAsIHRha2UpIHtcclxuICAgICAgICB2YXIgdXJsID0gdGhpcy5wcm9wcy5jb21tZW50c1VybCArIFwiP2ltYWdlSWQ9XCIgKyBpbWFnZUlkICsgXCImc2tpcD1cIiArIHNraXAgKyBcIiZ0YWtlPVwiICsgdGFrZTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudHM6IGRhdGEuQ3VycmVudEl0ZW1zLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGRhdGEuQ3VycmVudFBhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlczogZGF0YS5Ub3RhbFBhZ2VzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBjb21tZW50RGVsZXRlSGFuZGxlOiBmdW5jdGlvbiAoY29tbWVudElkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmNvbW1lbnRzVXJsICsgXCI/Y29tbWVudElkPVwiICsgY29tbWVudElkLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29tbWVudHNGcm9tU2VydmVyKHRoaXMucHJvcHMuaW1hZ2VJZCwgdGhpcy5zdGF0ZS5za2lwLCB0aGlzLnN0YXRlLnRha2UpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgY29tbWVudEVkaXRIYW5kbGU6IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmNvbW1lbnRzVXJsICsgXCI/aW1hZ2VJZD1cIiArIHRoaXMucHJvcHMuaW1hZ2VJZCxcclxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoY29tbWVudCksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29tbWVudHNGcm9tU2VydmVyKHRoaXMucHJvcHMuaW1hZ2VJZCwgdGhpcy5zdGF0ZS5za2lwLCB0aGlzLnN0YXRlLnRha2UpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLmNvbW1lbnRzVXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgY29tbWVudFJlcGx5SGFuZGxlOiBmdW5jdGlvbihyZXBseVRvLCB0ZXh0KSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmNvbW1lbnRzVXJsICsgXCI/aW1hZ2VJZD1cIiArIHRoaXMucHJvcHMuaW1hZ2VJZCArIFwiJnJlcGx5SWQ9XCIgKyByZXBseVRvLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YTogeyBUZXh0OiB0ZXh0IH0sXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy5pbWFnZUlkLCB0aGlzLnN0YXRlLnNraXAsIHRoaXMuc3RhdGUudGFrZSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIG5leHRQYWdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNraXBOZXh0ID0gdGhpcy5zdGF0ZS5za2lwICsgdGhpcy5zdGF0ZS50YWtlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBza2lwOiBza2lwTmV4dCB9KTtcclxuICAgICAgICB0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy5pbWFnZUlkLCBza2lwTmV4dCwgdGhpcy5zdGF0ZS50YWtlKTtcclxuICAgIH0sXHJcbiAgICBnZXRQYWdlOiBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgIHZhciBza2lwUGFnZXMgPSBwIC0gMTtcclxuICAgICAgICB2YXIgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRoaXMuc3RhdGUudGFrZSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNraXA6IHNraXBJdGVtcyB9KTtcclxuICAgICAgICB0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy5pbWFnZUlkLCBza2lwSXRlbXMsIHRoaXMuc3RhdGUudGFrZSk7XHJcbiAgICB9LFxyXG4gICAgcHJldmlvdXNQYWdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGJhY2tTa2lwID0gdGhpcy5zdGF0ZS5za2lwIC0gdGhpcy5zdGF0ZS50YWtlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBza2lwOiBiYWNrU2tpcCB9KTtcclxuICAgICAgICB0aGlzLmxvYWRDb21tZW50c0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy5pbWFnZUlkLCBiYWNrU2tpcCwgdGhpcy5zdGF0ZS50YWtlKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlcih0aGlzLnByb3BzLmltYWdlSWQsIHRoaXMuc3RhdGUuc2tpcCwgdGhpcy5zdGF0ZS50YWtlKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctMTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsPXt0aGlzLnByb3BzLmNvbW1lbnRzVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e3RoaXMucHJvcHMuaW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50RGVsZXRlSGFuZGxlPXt0aGlzLmNvbW1lbnREZWxldGVIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudEVkaXRIYW5kbGU9e3RoaXMuY29tbWVudEVkaXRIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudFJlcGx5SGFuZGxlPXt0aGlzLmNvbW1lbnRSZXBseUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50cz17dGhpcy5zdGF0ZS5jb21tZW50c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ9e3RoaXMucHJvcHMudXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPFBhZ2luYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXt0aGlzLnByb3BzLmltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhZ2U9e3RoaXMuc3RhdGUucGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2VzPXt0aGlzLnN0YXRlLnRvdGFsUGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dD17dGhpcy5uZXh0UGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2PXt0aGlzLnByZXZpb3VzUGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQYWdlPXt0aGlzLmdldFBhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctMTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRGb3JtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw9e3RoaXMucHJvcHMuY29tbWVudHNVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXt0aGlzLnByb3BzLmltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0Q29tbWVudEhhbmRsZT17dGhpcy5wb3N0Q29tbWVudH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
