import * as React from "react";
import { Button, Glyphicon, FormControl } from "react-bootstrap";
import { Components as C } from "../../interfaces/Components";

interface UploadImageProp {
    uploadImage: (username: string, description: string, formData: FormData) => void;
}

interface Files {
    hasFile?: boolean;
    description?: string;
}

export class ImageUpload extends React.Component<C.UsernameProp & UploadImageProp, Files> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasFile: false,
            description: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.setHasFile = this.setHasFile.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.removeSelectedFiles = this.removeSelectedFiles.bind(this);
        this.uploadButtonView = this.uploadButtonView.bind(this);
        this.clearInput = this.clearInput.bind(this);
    }

    clearInput(fileInput: HTMLInputElement) {
        if (fileInput.value) {
            try {
                fileInput.value = ""; // for IE11, latest Chrome/Firefox/Opera...
            }catch (err) { }
            if (fileInput.value) { // for IE5 ~ IE10
                let form = document.createElement("form"),
                    parentNode = fileInput.parentNode, ref = fileInput.nextSibling;
                form.appendChild(fileInput);
                form.reset();
                parentNode.insertBefore(fileInput, ref);
            }
        }

        this.setState({
            hasFile: false,
            description: ""
        });
    }

    getFiles(): any {
        const files = document.getElementById("files") as HTMLInputElement;
        return (files ? files.files : []);
    }

    handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        const { uploadImage, username } = this.props;
        e.preventDefault();

        const fileInput = document.getElementById("files") as HTMLInputElement;
        const files = fileInput.files;

        if (files.length === 0) return;
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            formData.append("file", file);
        }

        uploadImage(username, this.state.description, formData);
        this.clearInput(fileInput);
    }

    setHasFile(_: React.ChangeEvent<any>) {
        const fileInput = document.getElementById("files") as HTMLInputElement;
        const files = fileInput.files;

        const result = files.length > 0;
        this.setState({
            hasFile: result,
        });
    }

    handleDescriptionChange(e: any) {
        this.setState({
            description: e.target.value
        });
    }

    removeSelectedFiles() {
        const fileInput = document.getElementById("files") as HTMLInputElement;
        this.clearInput(fileInput);
        this.setState({
            hasFile: false,
            description: ""
        });
    }

    showDescription() {
        if (!this.state.hasFile) {
            return null;
        }

        return  <span>
                    <FormControl id="description" type="text" value={this.state.description} placeholder="Beskriv billedet..." rows={50} onChange={this.handleDescriptionChange} />&nbsp;
                    <Button bsStyle="warning" onClick={this.removeSelectedFiles}> Fortryd</Button>
                </span>;
    }

    uploadButtonView() {
        if (!this.state.hasFile)
            return <Button bsStyle="primary" disabled type="submit"> Upload</Button>;

        return  <Button bsStyle="primary" type="submit">Upload</Button>;
    }

    render() {
        return  <form onSubmit={this.handleSubmit} id="form-upload" className="form-inline" encType="multipart/form-data">
                        <div className="form-group">
                            <label htmlFor="files" className="hide-input" onClick={this.setHasFile}>
                                <Glyphicon glyph="camera" /> V&aelig;lg filer
                                <input type="file" id="files" name="files" onChange={this.setHasFile} multiple />
                            </label>
                            &nbsp; {this.showDescription()} &nbsp;
                            {this.uploadButtonView()}
                        </div>
                    {this.props.children}
                </form>;
    }
}