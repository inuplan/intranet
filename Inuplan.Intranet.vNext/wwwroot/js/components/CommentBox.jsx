/// <reference path="CommentList.js" />
/// <reference path="CommentForm.js" />
var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
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
    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer(), this.props.polInterval)
    },
    render: function () {
        return (
      <div className="commentBox">
        <h1>Comments</h1>
          <CommentList data={ this.state.data } />
          <CommentForm />
      </div>
    );
    }
});