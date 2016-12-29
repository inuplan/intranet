import * as React from "react";
import { Button } from "react-bootstrap";
import { Components as C } from "../../interfaces/Components";

interface UploadImageProp {
    uploadImage: (username: string, formData: FormData) => void;
}

export class ImageUpload extends React.Component<C.UsernameProp & UploadImageProp, any> {
    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
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

        uploadImage(username, formData);
        this.clearInput(fileInput);
    }

    render() {
        return  <form onSubmit={this.handleSubmit} id="form-upload" encType="multipart/form-data">
                        <div className="form-group">
                            <label htmlFor="files">Upload filer:</label>
                            <input type="file" className="form-control" id="files" name="files" multiple />
                        </div>
                    <Button bsStyle="primary" type="submit">Upload</Button>
                    {this.props.children}
                </form>;
    }
}
