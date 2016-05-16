var ImageBox = React.createClass({
    imagesUrl: function () {
        // GET /api/{Username}/Image
        return this.props.baseUrl + "";
    },
    commentsUrl: function (imageId) {
        // GET /api/ImageComments?imageId={id}
    },
    loadImagesFromServer: function () {
        $.ajax({
            url: this.props.imagesUrl(),
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.imagesUrl, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {
        this.loadImagesFromServer();
    },
    render: function () {
        return (
            // Pass the data to ImageList component
            <div className="" />
            );
    }
});