var CommentList = React.createClass({
    constructComments: function(comments) {
        if (!comments) return;
        var commentNodes = comments.map(function (comment) {
            if (comment.Deleted) {
                return (
                    <div className="media" key={comment.ID }>
                        <CommentDeleted
                             key={comment.ID} 
                             replies={comment.Replies}
                             userID={this.props.userID}
                             constructComments={this.constructComments}
                         />
                    </div>);
            }

            var canEdit = this.props.userID == comment.Author.ID;

            return (
                <div className="media" key={comment.ID }>
                    <Comment
                             key={comment.ID} 
                             postedOn={comment.PostedOn}
                             author={comment.Author}                             
                             text={comment.Text}
                             replies={comment.Replies}
                             canEdit={canEdit}
                             userID={this.props.userID}
                             commentId={comment.ID}
                             deleteHandle={this.props.commentDeleteHandle}
                             editHandle={this.props.commentEditHandle}
                             replyHandle={this.props.commentReplyHandle}
                             commentItem={comment}
                             constructComments={this.constructComments}
                     />
                </div>
            );
        }.bind(this));

        return commentNodes;
    },
    render: function () {
        var commentNodes = this.constructComments(this.props.comments);
        return (
            <div>
                {commentNodes}
            </div>
        );
    }
});