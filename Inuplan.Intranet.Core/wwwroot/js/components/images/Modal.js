import React from 'react'
import ReactDOM from 'react-dom'
import { Comments } from '../containers/Comments'

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.deleteImage = this.deleteImage.bind(this); 
    }

    componentDidMount() {
        const { deselectImage } = this.props;
        $(ReactDOM.findDOMNode(this)).modal('show');
        $(ReactDOM.findDOMNode(this)).on('hide.bs.modal', (e) => {
            deselectImage();
        });
    }

    deleteImage() {
        const { deleteImage, image, username } = this.props;
        const id = image.ImageID;

        deleteImage(id, username);
        $(ReactDOM.findDOMNode(this)).modal('hide');
    }

    deleteImageView() {
        const { canEdit } = this.props;
        return (
            canEdit ?
            <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.deleteImage}>
                    Slet billede
            </button> : null);
    }

    render() {
        const { image } = this.props;
        const { ImageID, Filename, PreviewUrl, Extension, OriginalUrl } = image;
        const name = Filename + "." + Extension;

        return (
            <div className="modal fade">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 className="modal-title text-center">{name}</h4>
                        </div>
                        <div className="modal-body">
                            <a href={OriginalUrl} target="_blank">
                                <img className="img-responsive center-block" src={PreviewUrl} />
                            </a>
                        </div>
                        <div className="modal-footer">
                            <Comments />
                            <hr />
                            {this.deleteImageView()}
                            <button type="button" className="btn btn-default" data-dismiss="modal">Luk</button>
                            <div className="row">
                                {'\u00A0'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}