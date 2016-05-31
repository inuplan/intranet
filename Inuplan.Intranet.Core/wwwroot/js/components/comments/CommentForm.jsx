var CommentForm = React.createClass({
    getInitialState: function() {
        return {
            Text: ''
        };
    },
    postComment: function (e) {
        e.preventDefault();
        this.props.postCommentHandle(this.state.Text);
        this.setState({ Text: '' });
    },
    handleTextChange: function (e) {
        this.setState({ Text: e.target.value })
    },
    render: function () {
        return (
            <form onSubmit={this.postComment}>
                <label htmlFor="remark">Kommentar</label>
                <textarea className="form-control" onChange={this.handleTextChange} value={this.state.Text} placeholder="Skriv kommentar her..." id="remark" rows="4"></textarea>
                <br />
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
        );
    }
});