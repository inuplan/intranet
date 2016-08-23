﻿import React from 'react'
import ReactDOM from 'react-dom'
import { setSelectedImg, fetchSingleImage, deleteImage } from '../../actions/images'
import { setError } from '../../actions/error'
import { find } from 'underscore'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Modal, Image, Button, ButtonToolbar } from 'react-bootstrap'

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
        hasImage: () => Boolean(getImage(state.imagesInfo.selectedImageId)),
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
        this.deleteImageHandler = this.deleteImageHandler.bind(this); 
        this.close = this.close.bind(this); 
    }

    close() {
        const { deselectImage } = this.props;
        const { username } = this.props.params;
        const { push } = this.props.router;

        deselectImage();
        const galleryUrl = '/' + username + '/gallery';
        push(galleryUrl);
    }

    deleteImageHandler() {
        const { deleteImage, setSelectedImageId } = this.props;
        const { id, username } = this.props.params;

        deleteImage(id, username);
        setSelectedImageId(-1);
    }

    deleteImageView() {
        const { canEdit } = this.props;
        return (
            canEdit ?
            <Button bsStyle="danger" onClick={this.deleteImageHandler}>Slet billede</Button>
            : null);
    }

            render() {
                const { filename, previewUrl, extension, originalUrl, uploaded, hasImage } = this.props;
                const show = hasImage();
                const name = filename + "." + extension;
                const uploadDate = moment(uploaded);
                const dateString = "Uploaded d. " + uploadDate.format("D MMM YYYY ") + "kl. " + uploadDate.format("H:mm");

                return  <Modal show={show} onHide={this.close} bsSize="large" animation={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>{name}<span><small> - {dateString}</small></span></Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <a href={originalUrl} target="_blank" rel="noopener">
                                    <Image src={previewUrl} responsive/>
                                </a>
                            </Modal.Body>

                            <Modal.Footer>
                                {this.props.children}
                                <hr />
                                <ButtonToolbar style={{float: "right"}}>
                                    {this.deleteImageView()}
                                    <Button onClick={this.close}>Luk</Button>
                                </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
    }
}

const SelectedImageRedux = connect(mapStateToProps, mapDispatchToProps)(ModalImage);
const SelectedImage = withRouter(SelectedImageRedux);
export default SelectedImage;