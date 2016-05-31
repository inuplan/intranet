var ImageList = React.createClass({
    render: function () {
        var commentsUrl = this.props.commentsUrl;
        var imageNodes = this.props.images.map(function (image, index) {
            return (
                <div className="col-lg-3" style={{ minHeight: "200px" }} key={image.ImageID }>
                    <Image data={image} key={image.ImageID} modalHandle={this.props.modalHandle}/>
                    <ImageList.CommentCount count={image.CommentCount} />
                </div>
            );
        }.bind(this))

        return (
        <div className="row">
            {imageNodes}
        </div>);
    }
});

ImageList.CommentCount = React.createClass({
    render: function () {
        var showCount = this.props.count > 0;
        return (
            <div className="row">
                <div className="col-lg-12">
                    {showCount ?
                    <span className="label label-primary">Antal kommentarer: <span>{this.props.count}</span></span>
                    :
                    <div className="label label-primary">Ingen kommentarer</div>
                    }
                </div>
            </div>);
    }
});