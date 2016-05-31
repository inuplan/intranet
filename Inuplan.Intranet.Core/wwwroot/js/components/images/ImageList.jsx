﻿var ImageList = React.createClass({
    render: function () {
        var commentsUrl = this.props.commentsUrl;
        var imageNodes = this.props.images.map(function (image, index) {
            return (
                <div className="col-lg-3" style={{ minHeight: "200px" }} key={image.ImageID }>
                    <Image data={image} key={image.ImageID} modalHandle={this.props.modalHandle}/>
                </div>
            );
        }.bind(this))

        return (
        <div className="row">
            {imageNodes}
        </div>);
    }
});