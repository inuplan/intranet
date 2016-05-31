var CommentControls = React.createClass({
    getInitialState: function() {
        return {
            text: this.props.text,
            reply: ''
        }
    },
    edit: function() {
        var comment = {
            ID: this.props.commentId,
            Text: this.state.text
        };
        this.props.editHandle(comment);
        $("#" + this.btns().editCollapse).collapse('hide');
        this.setState({ text: '' });
    },
    reply: function() {
        this.props.replyHandle(this.props.commentId, this.state.reply);
        $("#" + this.btns().replyCollapse).collapse('hide');
        this.setState({ reply: '' });
    },
    delete: function (commentId) {
        this.props.deleteHandle(commentId);
    },
    showTooltip: function (item) {
        var btn = "#" + this.props.commentId + "_" + item;
        $(btn).tooltip('show');
    },
    btns: function() {
        return {
            reply: this.props.commentId + '_reply',
            edit: this.props.commentId + '_edit',
            delete: this.props.commentId + '_delete',
            editCollapse: this.props.commentId + '_editCollapse',
            replyCollapse: this.props.commentId + '_replyCollapse',
        }
    },
    handleTextChange: function (e) {
        this.setState({ text: e.target.value })
    },
    handleReplyChange: function (e) {
        this.setState({ reply: e.target.value })
    },
    render: function () {
        var editTarget = "#" + this.btns().editCollapse;
        var replyTarget = "#" + this.btns().replyCollapse;
        return (
            this.props.canEdit ?
            <div className="row">
                <div className="row" style={{paddingBottom: '5px', paddingLeft: "15px"}}>
                    <div className="col-lg-4">
                        <a onClick={this.delete.bind(this, this.props.commentId)}>
                            <span
                                  onMouseEnter={this.showTooltip.bind(this, 'delete')}
                                  id={this.btns().delete}
                                  data-toggle="tooltip"
                                  title="Slet"
                                  className="label label-danger">
                                <span className="glyphicon glyphicon-trash">
                                </span>
                            </span>
                        </a>&nbsp; 
                        <a data-toggle="collapse" data-target={editTarget}>
                            <span
                                  onMouseEnter={this.showTooltip.bind(this, 'edit')}
                                  id={this.btns().edit}
                                  data-toggle="tooltip"
                                  title="Ændre"
                                  className="label label-success">
                                <span className="glyphicon glyphicon-pencil" ></span>
                            </span>
                        </a>&nbsp;
                        <a data-toggle="collapse" data-target={replyTarget}>
                            <span
                                  onMouseEnter={this.showTooltip.bind(this, 'reply')}
                                  id={this.btns().reply}
                                  data-toggle="tooltip"
                                  title="Svar"
                                  className="label label-primary">
                                <span className="glyphicon glyphicon-envelope"></span>
                            </span>
                        </a>
                    </div>
                </div>
                <div className="row" style={{paddingBottom: '5px'}}>
                    <div className="col-lg-offset-1 col-lg-10 collapse" id={this.btns().editCollapse}>
                        <textarea className="form-control" value={this.state.text} onChange={this.handleTextChange} rows="4" />
                        <br />
                        <button type="button" data-toggle="collapse" data-target={editTarget} className="btn btn-default">Luk</button>
                        <button type="button" className="btn btn-info" onClick={this.edit}>Gem ændringer</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-offset-1 col-lg-10 collapse" id={this.btns().replyCollapse}>
                        <textarea className="form-control" value={this.state.reply} onChange={this.handleReplyChange} rows="4" />
                        <br />
                        <button type="button" data-toggle="collapse" data-target={replyTarget} className="btn btn-default">Luk</button>
                        <button type="button" className="btn btn-info" onClick={this.reply}>Svar</button>
                    </div>
                </div>
            </div> : 
            <div className="row">
                <div className="row" style={{paddingBottom: '5px', paddingLeft: '15px'}}>
                    <div className="col-lg-4">
                        <a data-toggle="collapse" data-target={replyTarget}>
                            <span
                                  onMouseEnter={this.showTooltip.bind(this, 'reply')}
                                  id={this.btns().reply}
                                  data-toggle="tooltip"
                                  title="Svar"
                                  className="label label-primary">
                                <span className="glyphicon glyphicon-envelope"></span>
                            </span>
                        </a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-offset-1 col-lg-10 collapse" id={this.btns().replyCollapse}>
                        <textarea className="form-control" value={this.state.reply} onChange={this.handleReplyChange} rows="4" />
                        <br />
                        <button type="button" data-toggle="collapse" data-target={replyTarget} className="btn btn-default">Luk</button>
                        <button type="button" className="btn btn-info" onClick={this.reply}>Svar</button>
                    </div>
                </div>
            </div>
        );
    }
});
