import React from 'react'
import { Row, Col, ButtonToolbar, ButtonGroup, OverlayTrigger, Button, Glyphicon, Tooltip, Collapse, FormGroup, FormControl } from 'react-bootstrap'

export class CommentControls extends React.Component {
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
        const { deleteComment, commentId, contextId } = this.props;
        deleteComment(commentId, contextId);
    }

    editHandle() {
        const { editComment, contextId, commentId } = this.props;
        const { text } = this.state;

        this.setState({ edit: false });
        editComment(commentId, contextId, text);
    }

    replyHandle() {
        const { commentId, contextId, replyComment } = this.props;
        const { replyText } = this.state;

        this.setState({ reply: false, replyText: '' });
        replyComment(contextId, replyText, commentId);
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

export class ButtonTooltip extends React.Component {
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
