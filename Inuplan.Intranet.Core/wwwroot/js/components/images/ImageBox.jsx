var ImageBox = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            selected: null,
            user: {
                DisplayName: this.props.me
            },
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
    loadUser: function (username) {
        $.ajax({
            url: this.props.userUrl,
            data: { username: username },
            method: 'GET',
            success: function (data) {
                this.setState({ user: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.userUrl, status, err.toString());
            }.bind(this),
            xhrFields: {
                withCredentials: true
            },
        })
    },
    modalHandle: function (image) {
        this.setState({
            selected: image,
        });
        $("#modalWindow").modal("show");
    },
    hideModal: function () {
        this.setState({
            selected: null,
        });
        this.loadImagesFromServer(this.props.username);
    },
    componentWillMount: function () {
        this.loadUser(this.props.username);
        this.loadImagesFromServer(this.props.username);
    },
    componentDidMount: function () {
        $(ReactDOM.findDOMNode(this)).on('hide.bs.modal', this.hideModal);
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
                       userId={this.state.user.ID}
                       canEdit={this.props.canEdit}
                /> : null);
},
    render: function () {
        return (
        <div className="row">
            <div className="col-lg-12">
                <h1>{this.state.user.DisplayName} <small>billede galleri</small></h1>
                <hr />
                <ImageList 
                          images={this.state.data}
                          modalHandle={this.modalHandle}
                />
                {this.modalView()}
                {this.imageUploadFormView()}
            </div>
        </div>
        );
    }
});