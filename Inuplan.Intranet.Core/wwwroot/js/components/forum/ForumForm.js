import React from 'react'
import { FormGroup, ControlLabel, FormControl, Button, Row, Col, Modal, ButtonGroup, Checkbox, Glyphicon } from 'react-bootstrap'

export class ForumForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Title: '',
            Text: '',
            Sticky: false,
            IsPublished: true,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { edit } = nextProps;
        if(edit) {
            // Normalized thread title
            // with Text property
            this.setState({
                Title: edit.Title,
                Text: edit.Text,
                Sticky: edit.Sticky,
                IsPublished: edit.IsPublished
            });
        }
    }

    handleTitleChange(e) {
        this.setState({ Title: e.target.value });
    }

    handleTextChange(e) {
        this.setState({ Text: e.target.value });
    }

    getValidation() {
        const length = this.state.Title.length;
        if (length > 0 && length < 200) return 'success';
        if (length >= 200 && length <= 250) return 'warning';
        if (length > 250) return 'error';
    }

    transformToDTO(state) {
        // A ThreadPostContent class
        return {
            Header: {
                IsPublished: state.IsPublished,
                Sticky: state.Sticky,
                Title: state.Title
            },
            Text: state.Text
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { close, onSubmit } = this.props;

        // Do whatever work here...
        const post = this.transformToDTO(this.state);
        onSubmit(post);

        // Before closing remember to clear state:
        this.clearState();
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
        this.clearState();
        close();
    }

    clearState() {
    }

    render() {
        const { show, edit } = this.props;
        const readMode = Boolean(!edit);
        const title =  readMode ? 'Skriv nyt indlæg' : 'Ændre indlæg';
        const btnSubmit = readMode ? 'Skriv indlæg' : 'Gem ændringer';
        return  <Modal show={show} onHide={this.closeHandle.bind(this)} bsSize="lg">
                    <form>
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col lg={12}>
                                    
                                        <FormGroup controlId="formPostTitle" validationState={this.getValidation()}>
                                            <ControlLabel>Titel</ControlLabel>
                                            <FormControl type="text" placeholder="Titel på indlæg..." onChange={this.handleTitleChange.bind(this)} value={this.state.Title}/>
                                        </FormGroup>

                                        <FormGroup controlId="formPostContent">
                                            <ControlLabel>Indl&aelig;g</ControlLabel>
                                            <FormControl componentClass="textarea" placeholder="Skriv besked her..." onChange={this.handleTextChange.bind(this)} value={this.state.Text} rows="8" />
                                        </FormGroup>

                                        <FormGroup controlId="formPostSticky">
                                            <ButtonGroup>
                                                <Button bsStyle="success" bsSize="small" active={this.state.IsPublished} onClick={this.handlePublished.bind(this)}><Glyphicon glyph="file" />Udgiv indl&aelig;g</Button>
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
                </Modal>
    }
}
