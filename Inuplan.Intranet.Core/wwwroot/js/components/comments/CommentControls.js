import React from 'react'
import { editComment, deleteComment, postComment, fetchComments } from '../../actions/comments'
import { Row, Col, ButtonToolbar, ButtonGroup, OverlayTrigger, Button, Glyphicon, Tooltip, Collapse, FormGroup, FormControl } from 'react-bootstrap'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        canEdit: (id) => state.usersInfo.currentUserId == id,
        imageId: state.imagesInfo.selectedImageId,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        editComment: (commentId, imageId, text) => dispatch(editComment(commentId, imageId, text)),
        deleteComment: (commentId, imageId) => dispatch(deleteComment(commentId, imageId)),
        replyComment: (imageId, text, parentId) => dispatch(postComment(imageId, text, parentId)),
        loadComments: (imageId, skip, take) => {
            dispatch(fetchComments(imageId, skip, take));
        }
    }
}

class CommentControlsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            replyText: '',
            reply: false,
            edit: false
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleReply = this.toggleReply.bind(this);

        this.editHandle = this.editHandle.bind(this);
        this.replyHandle = this.replyHandle.bind(this);
        this.deleteHandle = this.deleteHandle.bind(this);

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleReplyChange = this.handleReplyChange.bind(this);
    }

    reload() {
        const { loadComments, imageId, skip, take } = this.props;
        loadComments(imageId, skip, take)
    }

    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }

    handleReplyChange(e) {
        this.setState({ replyText: e.target.value })
    }

    toggleEdit() {
        const { edit } = this.state;
        this.setState({ edit: !edit });
        if(!edit) {
            const { text } = this.props;
            this.setState({ text: text });
        }
    }

    toggleReply() {
        const { reply } = this.state;
        this.setState({ reply: !reply });
    }

    deleteHandle() {
        const { deleteComment, commentId, imageId } = this.props;
        deleteComment(commentId, imageId);
        this.reload();
    }

    editHandle() {
        const { editComment, imageId, commentId } = this.props;
        const { text } = this.state;

        this.setState({ edit: false });
        editComment(commentId, imageId, text);
        this.reload();
    }

    replyHandle() {
        const { commentId, imageId, replyComment } = this.props;
        const { replyText } = this.state;

        this.setState({ reply: false, replyText: '' });
        replyComment(imageId, replyText, commentId);
        this.reload();
    }

    render() {
        const { commentId, authorId, canEdit } = this.props;
        const { edit, text, reply, replyText } = this.state;
        const mount = canEdit(authorId);

        return  <Row>
                    <Row style={{paddingBottom: '5px', paddingLeft: "15px"}}>
                        <Col lg={4}>
                            <ButtonToolbar>
                                <ButtonGroup>

                                    <ButtonTooltip bsStyle="primary" onClick={this.deleteHandle} icon="trash" tooltip="slet" mount={mount} />
                                    <ButtonTooltip bsStyle="primary" onClick={this.toggleEdit} icon="pencil" tooltip="ændre" active={edit} mount={mount} />
                                    <ButtonTooltip bsStyle="primary" onClick={this.toggleReply} icon="envelope" tooltip="svar" active={reply} mount={true} />

                                </ButtonGroup>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                    <Row style={{paddingBottom: '5px'}}>
                        <Col lgOffset={1} lg={10}>
                            <CollapseTextArea
                                show={edit}
                                id="editTextControl"
                                value={text}
                                onChange={this.handleTextChange}
                                toggle={this.toggleEdit}
                                save={this.editHandle}
                                saveText="Gem ændringer"
                                mount={mount}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lgOffset={1} lg={10}>
                            <CollapseTextArea
                                show={reply}
                                id="replyTextControl"
                                value={replyText}
                                onChange={this.handleReplyChange}
                                toggle={this.toggleReply}
                                save={this.replyHandle}
                                saveText="Svar"
                                mount={true}
                            />
                        </Col>
                    </Row>
                </Row>
    }
}

export const CommentControls = connect(mapStateToProps, mapDispatchToProps)(CommentControlsContainer);

class CollapseTextArea extends React.Component {
    render() {
        const { show, id, value, onChange, toggle, save, saveText, mount } = this.props;
        if(!mount) return null;
        return  <Collapse in={show}>
                    <FormGroup controlId={id}>
                        <FormControl componentClass="textarea" value={value} onChange={onChange} rows="4" />
                        <br />
                        <Button onClick={toggle}>Luk</Button>
                        <Button type="submit" bsStyle="info" onClick={save}>{saveText}</Button>
                    </FormGroup>
                </Collapse>
    }
}

class ButtonTooltip extends React.Component {
    render() {
        const { tooltip, onClick, icon, bsStyle, active, mount } = this.props;
        let overlayTip = <Tooltip id="tooltip">{tooltip}</Tooltip>;

        if(!mount) return null;

        return  <OverlayTrigger placement="top" overlay={overlayTip}>
                    <Button bsStyle={bsStyle} bsSize="xsmall" onClick={onClick} active={active}>
                        <Glyphicon glyph={icon} />
                    </Button>
                </OverlayTrigger>
    }
}
