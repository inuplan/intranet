import React from 'react'
import ReactDOM from 'react-dom'

export class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    clearInput(fileInput) {
        if(fileInput.value){
            try{
                fileInput.value = ''; //for IE11, latest Chrome/Firefox/Opera...
            }catch(err){ }
            if(fileInput.value){ //for IE5 ~ IE10
                var form = document.createElement('form'),
                    parentNode = fileInput.parentNode, ref = fileInput.nextSibling;
                form.appendChild(fileInput);
                form.reset();
                parentNode.insertBefore(fileInput,ref);
            }
        }
    }

    getFiles() {
        const files = document.getElementById("files");
        return (files ? files.files : []);
    }

    handleSubmit(e) {
        const { uploadImage, username } = this.props;
        e.preventDefault();
        const files = this.getFiles();
        if (files.length == 0) return;
        let formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            const file = files[i];
            formData.append('file', file);
        }

        uploadImage(username, formData);
        const fileInput = document.getElementById("files");
        this.clearInput(fileInput);
    }

    deleteBtn() {
        const { hasImages, deleteSelectedImages } = this.props;
        return (hasImages ?
                <button type="button" className="btn btn-danger" onClick={deleteSelectedImages}>Slet markeret billeder</button>
                : <button type="button" className="btn btn-danger" onClick={deleteSelectedImages} disabled="disabled">Slet markeret billeder</button>);
    }

    render() {
        return (
            <div className="row">
                <br />
                <div className="col-lg-4">
                    <form
                          onSubmit={this.handleSubmit}
                          id="form-upload"
                          enctype="multipart/form-data">
                            <div className="form-group">
                                <label htmlFor="files">Upload filer:</label>
                                <input type="file" className="form-control" id="files" name="files" multiple />
                            </div>
                            <button type="submit" className="btn btn-primary" id="upload">Upload</button>
                            {'\u00A0'}
                            {this.deleteBtn()}
                    </form>
                </div>
            </div>
        );
    }
}