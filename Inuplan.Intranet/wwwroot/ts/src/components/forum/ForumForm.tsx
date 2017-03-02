import * as React from "react";
import { FormGroup, ControlLabel, FormControl, Button, Row, Col, Modal, ButtonGroup, Glyphicon } from "react-bootstrap";
import { Data } from "../../interfaces/Data";
import { TextEditor } from "../texteditor/TextEditor";

interface ForumFormProps {
    show: boolean;
    close: () => void;
    onSubmit: (post: Data.Raw.Models.ThreadPostContent) => void;
    edit?: {
        ThreadID: number,
        Title: string
        Text: string
        Sticky: boolean
        IsPublished: boolean
    };
}

interface ForumFormState {
    ThreadID: number;
    Title: string;
    Sticky: boolean;
    IsPublished: boolean;
}

export class ForumForm extends React.Component<ForumFormProps, ForumFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ThreadID: -1,
            Title: "",
            Sticky: false,
            IsPublished: true,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps: any) {
        const { edit } = nextProps;
        if (edit) {
            this.setState({
                ThreadID: edit.ThreadID,
                Title: edit.Title,
                Sticky: edit.Sticky,
                IsPublished: edit.IsPublished
            });
        }
    }

    handleTitleChange(e: any) {
        this.setState({ Title: e.target.value });
    }

    getValidation() {
        const length = this.state.Title.length;
        if (length >= 0 && length < 200) return "success";
        if (length >= 200 && length <= 250) return "warning";

        // Greater than 250 characters
        return "error";
    }

    transformToDTO(state: ForumFormState): Data.Raw.Models.ThreadPostContent {
        // A ThreadPostContent class
        const editor = this.refs.editor as TextEditor;
        const header = {
                IsPublished: state.IsPublished,
                Sticky: state.Sticky,
                Title: state.Title
            };
        const text = editor.getText();
        return {
            Header: header,
            Text: text,
            ThreadID: state.ThreadID
        };
    }

    handleSubmit(e: React.MouseEvent<any>) {
        e.preventDefault();
        const { close, onSubmit } = this.props;

        // Do whatever work here...
        const post = this.transformToDTO(this.state);
        onSubmit(post);
        close();
    }

    handleSticky() {
        const { Sticky } = this.state;
        this.setState({ Sticky: !Sticky });
    }

    handlePublished() {
        const { IsPublished } = this.state;
        this.setState({ IsPublished: !IsPublished });
    }

    closeHandle() {
        const { close } = this.props;
        close();
    }

    render() {
        const { show, edit } = this.props;
        const text = Boolean(edit) ? edit.Text : "";
        const readMode = Boolean(!edit);
        const title =  readMode ? "Skriv nyt indlæg" : "Ændre indlæg";
        const btnSubmit = readMode ? "Skriv indlæg" : "Gem ændringer";
        return  <Modal show={show} onHide={this.closeHandle.bind(this)} bsSize="lg">
                    <form>
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col lg={12}>

                                        <FormGroup controlId="formPostTitle" validationState={this.getValidation()}>
                                            <ControlLabel>Overskrift</ControlLabel>
                                            <FormControl type="text" placeholder="Overskrift på indlæg..." onChange={this.handleTitleChange.bind(this)} value={this.state.Title}/>
                                        </FormGroup>

                                        <FormGroup controlId="formPostContent">
                                            <ControlLabel>Indl&aelig;g</ControlLabel>
                                            <TextEditor
                                                markdown={text}
                                                placeholder="Skriv besked her..."
                                                ref="editor"
                                            />
                                        </FormGroup>

                                        <FormGroup controlId="formPostSticky">
                                            <ButtonGroup>
                                                <Button bsStyle="success" bsSize="small" active={this.state.Sticky} onClick={this.handleSticky.bind(this)}><Glyphicon glyph="pushpin" /> Vigtig</Button>
                                            </ButtonGroup>
                                        </FormGroup>

                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsStyle="default" onClick={this.closeHandle.bind(this)}>Luk</Button>
                            <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>{btnSubmit}</Button>
                        </Modal.Footer>
                    </form>
                </Modal>;
    }
}