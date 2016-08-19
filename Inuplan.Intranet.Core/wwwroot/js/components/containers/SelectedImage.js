import React from 'react'
import ReactDOM from 'react-dom'
import { setSelectedImg } from '../../actions/images'
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

    return {
        canEdit: canEdit,
        getImage: getImage
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
        }
    }
}

class ModalImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            image: null,
            hasError: false
        }

        this.deleteImage = this.deleteImage.bind(this); 
    }

    componentWillMount() {
        const { setSelectedImageId, getImage, setError } = this.props;
        const { id } = this.props.params;

        const image = getImage(id);

        if(image) {
            setSelectedImageId(id);
            this.setState({ image: image });
        }
        else {
            const error = {
                title: 'Image not found',
                message: 'Cannot find the selected image! It might have been deleted or the url is invalid.'
            };

            setError(error);
            this.setState({ hasError: true });
        }
    }

    componentDidMount() {
        if(this.state.hasError) return;
        const { deselectImage } = this.props;
        const { push } = this.props.router;
        const { username } = this.props.params;

        $(ReactDOM.findDOMNode(this)).modal('show');
        $(ReactDOM.findDOMNode(this)).on('hide.bs.modal', (e) => {
            deselectImage();
            const galleryUrl = '/' + username + '/gallery';
            push(galleryUrl);
        });
    }

    deleteImage() {
        const { deleteImage } = this.props;
        const { username } = this.props.params;
        const { image } = this.state;

        deleteImage(image.ImageID, username);
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
        if(this.state.hasError) return null;

        const { image } = this.state;
        const { Filename, PreviewUrl, Extension, OriginalUrl, Uploaded } = image;
        const name = Filename + "." + Extension;
        const uploadDate = moment(Uploaded);
        const dateString = "Uploaded d. " + uploadDate.format("D MMM YYYY ") + "kl. " + uploadDate.format("H:mm");

        return (
            <div className="modal fade">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 className="modal-title text-center">{name}<span><small> - {dateString}</small></span></h4>
                          
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

const SelectedImageRedux = connect(mapStateToProps, mapDispatchToProps)(ModalImage);
const SelectedImage = withRouter(SelectedImageRedux);
export default SelectedImage;