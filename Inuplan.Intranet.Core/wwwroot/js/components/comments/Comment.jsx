var Comment = React.createClass({
    rawMarkup: function () {
        if (!Boolean(this.props.text)) return;
        var rawMarkup = marked(this.props.text, { sanitize: true });
        return { __html: rawMarkup };
    },
    render: function () {
        var fullname = this.props.author.FirstName + " " + this.props.author.LastName;
        return (
            <div className="media pull-left text-left">
                    <CommentProfile />
                    <div className="media-body">
                        <h5 className="media-heading"><strong>{fullname}</strong> <Comment.PostedOn postedOn={this.props.postedOn} /></h5>
                        <span dangerouslySetInnerHTML={this.rawMarkup()}></span>
                        <CommentControls
                                  canEdit={this.props.canEdit}
                                  commentId={this.props.commentId}
                                  deleteHandle={this.props.deleteHandle}
                                  editHandle={this.props.editHandle}
                                  replyHandle={this.props.replyHandle}
                                  text={this.props.text}
                        />
                        {this.props.constructComments(this.props.replies)}
                    </div>
            </div>);
    }
});

Comment.PostedOn = React.createClass({
    ago: function () {
        var ago = moment(this.props.postedOn).fromNow();
        var diff = moment().diff(this.props.postedOn, 'hours', true);
        if (diff >= 12.5) {
            var date = moment(this.props.postedOn);
            return "d. " + date.format("D MMM YYYY ") + "kl. " + date.format("H:mm");
        }

        return "for " + ago;
    },
    render: function () {
        return (<small>sagde {this.ago()}</small>);
    }
});