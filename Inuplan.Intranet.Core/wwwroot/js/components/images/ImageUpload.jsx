class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append('file', $('#files')[0].files[0]);
        var url = this.props.imageUploadUrl + "?username=" + this.props.username;
        $.ajax({
            url: url,
            xhrFields: {
                withCredentials: true
            },
            type: 'POST',
            data: formData,
            mimeType: 'multipart/form-data',
            cache: false,
            contentType: false,
            processData: false,
            success: function (result, status, jqXhr) {
                this.props.reload(this.props.username);
            }.bind(this)
        });
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
                        </form>
                    </div>
                </div>
        );
    }
}