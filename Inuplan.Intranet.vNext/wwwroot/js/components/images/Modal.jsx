var Modal = React.createClass({
    componentDidMount: function () {
        $(ReactDOM.findDOMNode(this)).modal('hide');
    },
    render: function () {
        return (
            <div className="modal fade" id="modalWindow">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 className="modal-title">{this.props.image.Filename}</h4>
                    </div>
                    <div className="modal-body">
                        <a href={this.props.image.OriginalUrl} target="_blank">
                            <img className="img-responsive" src={this.props.image.PreviewUrl} />
                        </a>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default" data-dismiss="modal">Luk</button>
                    </div>
                  </div>
                </div>
              </div>
        );
    }
});