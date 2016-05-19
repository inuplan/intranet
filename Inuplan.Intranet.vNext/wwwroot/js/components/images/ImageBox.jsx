// Images: GET /api/userimage/getall&username={username}
// Comment: GET /api/imagecomment?imageId={id}
var ImageBox = React.createClass({
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
    modalHandle: function(image) {
        this.setState({
            selected: image
        });
        $("#modalWindow").modal("show");
    },
    getInitialState: function () {
        return {
            data: [],
            selected: {
                Filename: '',
                OriginalUrl: '',
                PreviewUrl: '',
                ImageID: -1,
            }
        };
    },
    componentDidMount: function () {
        var username = this.props.username;
        this.loadImagesFromServer(username);
    },
    render: function () {
        return (
            // Pass the data to ImageList component
            <div className="row">
                <ImageList images={this.state.data} modalHandle={this.modalHandle} />
                <Modal image={this.state.selected} commentsUrl={this.props.commentsUrl} />
            </div>
            );
    }
});