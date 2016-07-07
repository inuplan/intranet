var CommentDeleted = React.createClass({
    render: function () {
        var replies = this.props.constructComments(this.props.replies);
        return (
            <div className="media pull-left text-left">
                <div className="media-left" style={{minWidth: "74px"}}></div>
                <div className="media-body">
                    <small>slettet</small>
                    {replies}
                </div>
            </div>
        );
    }
});
