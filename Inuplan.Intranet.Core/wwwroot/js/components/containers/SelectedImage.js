import React from 'react'
import ReactDOM from 'react-dom'
import { setSelectedImg, fetchSingleImage, deleteImage } from '../../actions/images'
import { setError } from '../../actions/error'
import { Comments } from '../containers/Comments'
import { find } from 'underscore'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

const mapStateToProps = (state) => {
    const ownerId  = state.imagesInfo.ownerId;
    const currentId = state.usersInfo.currentUserId;
    const canEdit = (ownerId > 0 && currentId > 0 && ownerId == currentId);

    const getImage = (id) => {
        return find(state.imagesInfo.images, image => {
            return image.ImageID == id;
        });
    };

    const image = () => getImage(state.imagesInfo.selectedImageId);
    const filename = () => { if(image()) return image().Filename; return ''; };
    const previewUrl = () => { if(image()) return image().PreviewUrl; return ''; };
    const extension = () => { if(image()) return image().Extension; return ''; };
    const originalUrl = () => { if(image()) return image().OriginalUrl; return ''; };
    const uploaded = () => { if(image()) return image().Uploaded; return new Date(); };

    return {
        canEdit: canEdit,
        filename: filename(),
        previewUrl: previewUrl(),
        extension: extension(),
        originalUrl: originalUrl(),
        uploaded: uploaded()
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedImageId: (id) => {
            dispatch(setSelectedImg(id));
        },
        deselectImage: () => {
            dispatch(setSelectedImg(undefined));
        },
        setError: (error) => {
            dispatch(setError(error));
        },
        fetchImage: (id) => {
            dispatch(fetchSingleImage(id));
        },
        deleteImage: (id, username) => {
            dispatch(deleteImage(id, username));
        }
    }
}

class ModalImage extends React.Component {
    constructor(props) {
        super(props);
        this.deleteImage = this.deleteImage.bind(this); 
    }

    componentDidMount() {
        const { deselectImage, setError } = this.props;
        const { username } = this.props.params;
        const { push } = this.props.router;

        const isLoaded = typeof $ !== "undefined";
        if(isLoaded) {
            const node = ReactDOM.findDOMNode(this);
            $(node).modal('show');
            $(node).on('hide.bs.modal', (e) => {
                deselectImage();
                const galleryUrl = '/' + username + '/gallery';
                push(galleryUrl);
            });
        }
        else {
            setError({
                title: 'Something bad happened',
                message: 'Could not find the image, maybe the URL is invalid or it has been deleted!'
            });
        }
    }

    deleteImage() {
        const { deleteImage } = this.props;
        const { id, username } = this.props.params;

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
        const { filename, previewUrl, extension, originalUrl, uploaded } = this.props;
        const name = filename + "." + extension;
        const uploadDate = moment(uploaded);
        const dateString = "Uploaded d. " + uploadDate.format("D MMM YYYY ") + "kl. " + uploadDate.format("H:mm");

        return  <div className="modal fade">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                              <h4 className="modal-title text-center">{name}<span><small> - {dateString}</small></span></h4>
                          
                            </div>
                            <div className="modal-body">
                                <a href={originalUrl} target="_blank">
                                    <img className="img-responsive center-block" src={previewUrl} />
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
    }
}

const SelectedImageRedux = connect(mapStateToProps, mapDispatchToProps)(ModalImage);
const SelectedImage = withRouter(SelectedImageRedux);
export default SelectedImage;