import React from 'react'

const ids = (commentId) => {
    return {
        replyId: commentId + '_reply',
        editId: commentId + '_edit',
        deleteId: commentId + '_delete',
        editCollapse: commentId + '_editCollapse',
        replyCollapse: commentId + '_replyCollapse'
    };
}

export class CommentControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            reply: ''
        };

        this.edit = this.edit.bind(this);
        this.reply = this.reply.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleReplyChange = this.handleReplyChange.bind(this);
    }

    edit() {
        const { editHandle, commentId } = this.props;
        const { text } = this.state;
        const { editCollapse } = ids(commentId);

        editHandle(commentId, text);
        $("#" + editCollapse).collapse('hide');
    }

    reply() {
        const { replyHandle, commentId } = this.props;
        const { reply } = this.state;
        const { replyCollapse } = ids(commentId);

        replyHandle(commentId, reply);
        $("#" + replyCollapse).collapse('hide');
        this.setState({ reply: '' });
    }

    showTooltip(item) {
        const { commentId } = this.props;
        const btn = "#" + commentId + "_" + item;
        $(btn).tooltip('show');
    }

    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }

    handleReplyChange(e) {
        this.setState({ reply: e.target.value })
    }

    render() {
        const { text, commentId, canEdit, deleteHandle } = this.props;
        const { editCollapse, replyCollapse, replyId, editId, deleteId } = ids(commentId);
        const editTarget = "#" + editCollapse;
        const replyTarget = "#" + replyCollapse;

        return (
            canEdit ?
            <div className="row">
                <div className="row" style={{paddingBottom: '5px', paddingLeft: "15px"}}>
                    <div className="col-lg-4">
                        <a onClick={deleteHandle.bind(null, commentId)} style={{ textDecoration: "none", cursor: "pointer" }}>
                            <span
                                  onMouseEnter={this.showTooltip.bind(this, 'delete')}
                                  id={deleteId}
                                  data-toggle="tooltip"
                                  title="Slet"
                                  className="label label-danger">
                                <span className="glyphicon glyphicon-trash"></span>
                            </span>{'\u00A0'}
                        </a> 
                        <a data-toggle="collapse" data-target={editTarget} style={{ textDecoration: "none", cursor: "pointer" }}>
                            <span
                                  onMouseEnter={this.showTooltip.bind(this, 'edit')}
                                  id={editId}
                                  data-toggle="tooltip"
                                  title="Ændre"
                                  className="label label-success">
                                <span className="glyphicon glyphicon-pencil"></span>
                            </span>{'\u00A0'}
                        </a> 
                        <a data-toggle="collapse" data-target={replyTarget} style={{ textDecoration: "none", cursor: "pointer" }}>
                            <span
                                  onMouseEnter={this.showTooltip.bind(this, 'reply')}
                                  id={replyId}
                                  data-toggle="tooltip"
                                  title="Svar"
                                  className="label label-primary">
                                <span className="glyphicon glyphicon-envelope"></span>
                            </span>
                        </a>
                    </div>
                </div>
                <div className="row" style={{paddingBottom: '5px'}}>
                    <div className="col-lg-offset-1 col-lg-10 collapse" id={editCollapse}>
                        <textarea className="form-control" value={this.state.text} onChange={this.handleTextChange} rows="4" />
                        <br />
                        <button type="button" data-toggle="collapse" onClick={() => this.setState({text: text})} data-target={editTarget} className="btn btn-default">Luk</button>
                        <button type="button" className="btn btn-info" onClick={this.edit}>Gem ændringer</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-offset-1 col-lg-10 collapse" id={replyCollapse}>
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
                                  id={replyId}
                                  data-toggle="tooltip"
                                  title="Svar"
                                  className="label label-primary">
                                <span className="glyphicon glyphicon-envelope"></span>
                            </span>
                        </a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-offset-1 col-lg-10 collapse" id={replyCollapse}>
                        <textarea className="form-control" value={this.state.reply} onChange={this.handleReplyChange} rows="4" />
                        <br />
                        <button type="button" data-toggle="collapse" data-target={replyTarget} className="btn btn-default">Luk</button>
                        <button type="button" className="btn btn-info" onClick={this.reply}>Svar</button>
                    </div>
                </div>
            </div>
        );
    }
}
