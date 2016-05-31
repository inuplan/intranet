var Modal = React.createClass({
    deleteImage: function(e) {
        console.log("pressed delete!");
    },
    componentDidMount: function () {
        $(ReactDOM.findDOMNode(this)).modal('show');
    },
    render: function () {
        return (
            <div className="modal fade" id="modalWindow">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 className="modal-title text-center">{this.props.filename}</h4>
                    </div>
                    <div className="modal-body">
                                <a href={this.props.originalUrl} target="_blank">
                                    <img className="img-responsive center-block" src={this.props.previewUrl} />
                                </a>
                    </div>
                    <div className="modal-footer">
                        <CommentBox
                                commentsUrl={this.props.commentsUrl}
                                username={this.props.username}
                                imageId={this.props.imageId}
                                userUrl={this.props.userUrl}
                        />
                        <hr />
                        <Modal.Delete
                                  canEdit={this.props.canEdit}
                                  imageId={this.props.imageId}
                                  deleteImageHandle={this.props.deleteImageHandle}>
                            Slet billede
                        </Modal.Delete>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Luk</button>
                        <div className="row">
                            {/* Empty space */}
                            &nbsp;
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              );
    }
});

Modal.Delete = React.createClass({
    deleteImage: function() {
        this.props.deleteImageHandle(this.props.imageId);
        $('#modalWindow').modal('hide');
    },
    render: function () {
        return (
            this.props.canEdit ?
            <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.deleteImage}>
                {this.props.children}
            </button> : null);
    }
});