var Comment = React.createClass({
    rawMarkup: function () {
        var rawMarkup = marked(this.props.text, { sanitize: true });
        return { __html: rawMarkup };
    },
    render: function () {
        var replies = this.props.children.map(function (reply) {
            return (
                <Comment
                    author={reply.Author}
                    key={reply.ID}
                    text={reply.Text}
                    replies={reply.Replies}>
                </Comment>);
        });
        return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup() } />
          {replies}
      </div>
    );
  }
});