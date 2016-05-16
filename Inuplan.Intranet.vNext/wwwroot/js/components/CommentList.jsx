﻿/// <reference path="Comment.js" />
var CommentList = React.createClass({
    render: function () {

        // Transform the data into react components of comment
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.Author} key={comment.ID }>
                    {comment.Text}
                </Comment>
            );
        });

        // return the components with an ordinary html wrapper
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});