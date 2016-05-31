var ImageBox = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            selected: null,
        };
    },
    deleteImageFromServer: function (imageId) {
        $.ajax({
            url: this.props.deleteImageUrl + "?username=" + this.props.username + "&id=" + imageId,
            method: 'DELETE',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.loadImagesFromServer(this.props.username);
            }.bind(this)
        })
    },
    loadImagesFromServer: function (username) {
        $.ajax({
            url: this.props.imagesUrl,
            method: 'GET',
            dataType: 'json',
            data: "username=" + username,
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.imagesUrl, status, err.toString());
            }.bind(this),
            xhrFields: {
                withCredentials: true
            },
            processData: false
        });
    },
    modalHandle: function (image) {
        this.setState({
            selected: image,
        });
        $("#modalWindow").modal("show");
    },
    componentDidMount: function () {
        this.loadImagesFromServer(this.props.username);
        $(ReactDOM.findDOMNode(this)).on('hide.bs.modal', function (e) {
            this.setState({
                selected: null,
            });
        }.bind(this));
    },
    imageUploadFormView: function () {
        return (
            this.props.canEdit ? 
            <ImageUpload imageUploadUrl={this.props.imageUploadUrl} username={this.props.username } reload={this.loadImagesFromServer} /> :
            null
        );
    },
    modalView: function () {
        return (this.state.selected ?
                <Modal
                       imageId={this.state.selected.ImageID}
                       filename={this.state.selected.Filename + "." + this.state.selected.Extension}
                       originalUrl={this.state.selected.OriginalUrl}
                       previewUrl={this.state.selected.PreviewUrl}
                       deleteImageHandle={this.deleteImageFromServer}
                       commentsUrl={this.props.commentsUrl}
                       userUrl={this.props.userUrl}
                       username={this.props.me}
                       canEdit={this.props.canEdit}
                /> : null);
},
    render: function () {
        return (
        <div className="row">
            <div className="row">
                <ImageList images={this.state.data} modalHandle={this.modalHandle} />
                {this.modalView()}
            </div>
            {this.imageUploadFormView()}
        </div>
        );
    }
});