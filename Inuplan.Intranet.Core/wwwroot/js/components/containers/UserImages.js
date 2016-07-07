import React from 'react'
import { connect } from 'react-redux'
import { fetchUserImages, setSelectedImg, removeModal, requestDeleteImage, uploadImage, addSelectedImageId,  deleteImages, removeSelectedImageId, clearSelectedImageIds } from '../../actions/images'
import { Error } from './Error'
import { ImageUpload } from '../images/ImageUpload'
import ImageList from '../images/ImageList'
import Modal from '../images/Modal'
import { find } from 'underscore'
import { withRouter } from 'react-router'

const mapStateToProps = (state) => {
    return {
        images: state.imagesInfo.images,
        canEdit: (username) => globals.currentUsername == username,
        getUser: (username) => state.usersInfo.users.filter(u => u.Username.toUpperCase() == username.toUpperCase())[0],
        selectedImageId: state.imagesInfo.selectedImageId,
        selectedImageIds: state.imagesInfo.selectedImageIds
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadImages: (username) => {
            dispatch(fetchUserImages(username));
        },
        deleteImage: (id, username) => {
            dispatch(requestDeleteImage(id, username));
        },
        uploadImage: (username, formData) => {
            dispatch(uploadImage(username, formData));
        },
        setSelectedImage: (id) => {
            dispatch(setSelectedImg(id));
        },
        deselectImage: () => {
            dispatch(removeModal());
        },
        addSelectedImageId: (id) => {
            dispatch(addSelectedImageId(id));
        },
        removeSelectedImageId: (id) => {
            dispatch(removeSelectedImageId(id));
        },
        deleteImages: (username, ids) => {
            dispatch(deleteImages(username, ids));
        },
        clearSelectedImageIds: () => {
            dispatch(clearSelectedImageIds());
        }
    }
}

class UserImagesContainer extends React.Component {
    constructor(props) {
        super(props);
        this.imageIsSelected = this.imageIsSelected.bind(this);
        this.deleteSelectedImages = this.deleteSelectedImages.bind(this);
        this.clearSelected = this.clearSelected.bind(this);
    }

    componentDidMount() {
        const { username } = this.props.params;
        const { loadImages, router, route } = this.props;

        router.setRouteLeaveHook(route, this.clearSelected);
        loadImages(username);
        document.title = username + "'s billeder";
    }

    clearSelected() {
        const { clearSelectedImageIds } = this.props;
        clearSelectedImageIds();
        return true;
    }

    getImage(id) {
        const { images } = this.props;
        const image = images.filter(img => img.ImageID == id)[0];
        return image;
    }

    imageIsSelected(checkId) {
        const { selectedImageIds } = this.props;
        const res = find(selectedImageIds, (id) => {
            return id == checkId;
        });
        return res ? true : false;
    }

    deleteSelectedImages() {
        const { selectedImageIds, deleteImages } = this.props;
        const { username } = this.props.params;
        deleteImages(username, selectedImageIds);
    }

    uploadView() {
        const { canEdit, uploadImage, selectedImageIds } = this.props;
        const { username } = this.props.params;
        const showUpload = canEdit(username);
        const hasImages = selectedImageIds.length > 0;

        return (
            showUpload ? 
            <ImageUpload
                uploadImage={uploadImage}
                username={username}
                deleteSelectedImages={this.deleteSelectedImages}
                hasImages={hasImages}
            />
            : null);
    }

    modalView() {
        const { selectedImageId, canEdit, deselectImage, deleteImage } = this.props;
        const { username } = this.props.params;
        const selected = selectedImageId > 0;
        const image = () => this.getImage(selectedImageId);
        return (selected ? 
            <Modal
                image={image()}
                canEdit={canEdit(username)}
                deselectImage={deselectImage}
                deleteImage={deleteImage}
                username={username}
            />
            : null);
    }

    render() {
        const { username } = this.props.params;
        const { images, getUser, setSelectedImage, canEdit, addSelectedImageId, removeSelectedImageId } = this.props;
        const user = getUser(username);
        let fullName = user ? user.FirstName + " " + user.LastName : 'User';
        
        return (
            <div className="row">
                <div className="col-lg-offset-2 col-lg-8">
                    <h1><span className="text-capitalize">{fullName.toLowerCase()}'s</span> <small>billede galleri</small></h1>
                    <hr />
                    <ImageList
                        images={images}
                        selectImage={setSelectedImage}
                        canEdit={canEdit(username)}
                        addSelectedImageId={addSelectedImageId}
                        removeSelectedImageId={removeSelectedImageId}
                        imageIsSelected={this.imageIsSelected}
                    />
                    {this.modalView()}
                    {this.uploadView()}
                </div>
            </div>
        );
    }
}

const UserImagesRedux = connect(mapStateToProps, mapDispatchToProps)(UserImagesContainer);
const UserImages = withRouter(UserImagesRedux);
export default UserImages;