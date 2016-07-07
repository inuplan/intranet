var CommentBox = React.createClass({
    getInitialState: function () {
        return {
            comments: [],
            skip: 0,
            take: 10,
            page: 1,
            totalPages: 1,
        }
    },
    postComment: function (text) {
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
            }.bind(this),
        })
    },
    loadCommentsFromServer: function (imageId, skip, take) {
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
        })
    },
    commentDeleteHandle: function (commentId) {
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
        })
    },
    commentEditHandle: function (comment) {
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
    commentReplyHandle: function(replyTo, text) {
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
            }.bind(this),
        })
    },
    nextPage: function () {
        var skipNext = this.state.skip + this.state.take;
        this.setState({ skip: skipNext });
        this.loadCommentsFromServer(this.props.imageId, skipNext, this.state.take);
    },
    getPage: function (p) {
        var skipPages = p - 1;
        var skipItems = (skipPages * this.state.take);
        this.setState({ skip: skipItems });
        this.loadCommentsFromServer(this.props.imageId, skipItems, this.state.take);
    },
    previousPage: function () {
        var backSkip = this.state.skip - this.state.take;
        this.setState({ skip: backSkip });
        this.loadCommentsFromServer(this.props.imageId, backSkip, this.state.take);
    },
    componentDidMount: function () {
        this.loadCommentsFromServer(this.props.imageId, this.state.skip, this.state.take);
    },
    render: function () {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-offset-1 col-lg-11">
                        <CommentList
                             url={this.props.commentsUrl}
                             imageId={this.props.imageId}
                             commentDeleteHandle={this.commentDeleteHandle}
                             commentEditHandle={this.commentEditHandle}
                             commentReplyHandle={this.commentReplyHandle}
                             comments={this.state.comments}
                             userId={this.props.userId}
                         />
                    </div>
                </div>
                <div className="row text-left">
                    <Pagination
                          imageId={this.props.imageId}
                          currentPage={this.state.page}
                          totalPages={this.state.totalPages}
                          next={this.nextPage}
                          prev={this.previousPage}
                          getPage={this.getPage}
                    />
                </div>
                <hr />
                <div className="row text-left">
                    <div className="col-lg-offset-1 col-lg-10">
                        <CommentForm
                            url={this.props.commentsUrl}
                            postCommentHandle={this.postComment}
                        />
                    </div>
                </div>
            </div>);
    }
});