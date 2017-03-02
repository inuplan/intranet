import * as React from "react";
import { Row, Col, ButtonToolbar, ButtonGroup, OverlayTrigger, Button, Glyphicon, Tooltip, Collapse, FormGroup } from "react-bootstrap";
import { Components } from "../../interfaces/Components";
import { TextEditor } from "../texteditor/TextEditor";

interface CommentControlsState {
    reply: boolean;
    edit: boolean;
    editId: string;
    replyId: string;
}

export class ButtonTooltip extends React.Component<Components.ButtonTooltipProps, null> {
    render() {
        const { tooltip, onClick, icon, bsStyle, active, mount } = this.props;
        let overlayTip = <Tooltip id="tooltip">{tooltip}</Tooltip>;

        if (!mount) return null;

        return  <OverlayTrigger placement="top" overlay={overlayTip}>
                    <Button bsStyle={bsStyle} bsSize="xsmall" onClick={onClick} active={active}>
                        <Glyphicon glyph={icon} />
                    </Button>
                </OverlayTrigger>;
    }
}

export class CommentControls extends React.Component<Components.CommentControlsProps, Partial<CommentControlsState>> {
    constructor(props: Components.CommentControlsProps) {
        super(props);

        const editId = "editTextControl_" + props.commentId + "_" + props.contextId;
        const replyId = "replyTextControl_" + props.commentId + "_" + props.contextId;

        this.state = {
            reply: false,
            edit: false,
            editId,
            replyId
        };


        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleReply = this.toggleReply.bind(this);

        this.editHandle = this.editHandle.bind(this);
        this.replyHandle = this.replyHandle.bind(this);
        this.deleteHandle = this.deleteHandle.bind(this);
    }

    toggleEdit() {
        const { text } = this.props;
        const { edit, editId } = this.state;
        this.setState({ edit: !edit });

        // The edit is toggled but since it's constant it doesn't change
        // hence we dont negate it
        if (edit) {
            const editor = this.refs[editId] as CollapseTextArea;
            editor.setText(text);
        }
    }

    toggleReply() {
        const { reply, replyId } = this.state;
        this.setState({ reply: !reply });

        if (!reply) {
            const editor = this.refs[replyId] as CollapseTextArea;
            editor.setText("");
        }
    }

    deleteHandle() {
        const { deleteComment, commentId, contextId } = this.props;
        deleteComment(commentId, contextId);
    }

    editHandle(text: string) {
        const { editComment, contextId, commentId } = this.props;

        this.setState({ edit: false });
        editComment(commentId, contextId, text);
    }

    replyHandle(text: string) {
        const { commentId, contextId, replyComment } = this.props;

        this.setState({ reply: false });
        replyComment(contextId, text, commentId);
    }

    render() {
        const { authorId, canEdit, text } = this.props;
        const { edit, reply, editId, replyId } = this.state;
        const mount = canEdit(authorId);

        return  <Row>
                    <Row style={{paddingBottom: "5px", paddingLeft: "15px"}}>
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
                    <Row style={{paddingBottom: "5px"}}>
                        <Col lgOffset={1} lg={10}>
                            <CollapseTextArea
                                show={edit}
                                id={editId}
                                value={text}
                                toggle={this.toggleEdit}
                                onSubmit={this.editHandle}
                                submitText="Gem ændringer"
                                mount={mount}
                                ref={editId}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lgOffset={1} lg={10}>
                            <CollapseTextArea
                                show={reply}
                                id={replyId}
                                value=""
                                toggle={this.toggleReply}
                                onSubmit={this.replyHandle}
                                submitText="Svar"
                                mount={true}
                                ref={replyId}
                            />
                        </Col>
                    </Row>
                </Row>;
    }
}

class CollapseTextArea extends React.Component<Components.CollapseTextAreaProps, null> {
    constructor(props: any) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.setText = this.setText.bind(this);
    }

    onClick() {
        const { onSubmit, id } = this.props;

        const editor = this.refs[id] as TextEditor;
        const text = editor.getText();
        onSubmit(text);
    }

    setText(text: string) {
        const{ id } = this.props;
        const editor = this.refs[id] as TextEditor;
        editor.setText(text);
    }

    render() {
        const { value, show, id, toggle, submitText, mount } = this.props;
        if (!mount) return null;
        return  <Collapse in={show}>
                    <FormGroup controlId={id}>
                        <br />
                        <ButtonToolbar>
                            <TextEditor
                                placeholder="Skriv kommentar her..."
                                markdown={value}
                                ref={id}
                            />
                            <Button onClick={toggle}>Luk</Button>
                            <Button bsStyle="info" onClick={this.onClick}>{submitText}</Button>
                        </ButtonToolbar>
                    </FormGroup>
                </Collapse>;
    }
}