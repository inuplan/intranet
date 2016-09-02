import React from 'react'
import { connect } from 'react-redux'
import { uploadImage, addSelectedImageId,  deleteImages, removeSelectedImageId, clearSelectedImageIds } from '../../actions/images'
import { Error } from './Error'
import { ImageUpload } from '../images/ImageUpload'
import ImageList from '../images/ImageList'
import { find } from 'underscore'
import { withRouter } from 'react-router'
import { Row, Col, Button } from 'react-bootstrap'

const mapStateToProps = (state) => {
    const ownerId  = state.imagesInfo.ownerId;
    const currentId = state.usersInfo.currentUserId;
    const canEdit = (ownerId > 0 && currentId > 0 && ownerId == currentId);

    return {
        images: state.imagesInfo.images,
        canEdit: canEdit,
        selectedImageIds: state.imagesInfo.selectedImageIds,
        getFullname: (username) => {
            const user = state.usersInfo.users.filter(u => u.Username.toUpperCase() == username.toUpperCase())[0];
            const fullname = (user) ? user.FirstName + " " + user.LastName : 'User';
            return fullname.toLocaleLowerCase();
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        uploadImage: (username, formData) => {
            dispatch(uploadImage(username, formData));
        },
        addSelectedImageId: (id) => {
            // Images to be deleted by selection:
            dispatch(addSelectedImageId(id));
        },
        removeSelectedImageId: (id) => {
            // Images to be deleted by selection:
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
        const { router, route } = this.props;

        document.title = username + "'s billeder";
        router.setRouteLeaveHook(route, this.clearSelected);
    }

    clearSelected() {
        const { clearSelectedImageIds } = this.props;
        clearSelectedImageIds();
        return true;
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
        const hasImages = selectedImageIds.length > 0;

        if(!canEdit) return null;

        return  <Row>
                    <br />
                    <Col lg={4}>
                        <ImageUpload
                            uploadImage={uploadImage}
                            username={username}>
                                {'\u00A0'}
                                <Button bsStyle="danger" disabled={!hasImages} onClick={this.deleteSelectedImages}>Slet markeret billeder</Button>
                        </ImageUpload>
                    </Col>
                </Row>
    }

    render() {
        const { username } = this.props.params;
        const { images, getFullname, canEdit, addSelectedImageId, removeSelectedImageId } = this.props;
        const fullName = getFullname(username);
        
        return  <Row>
                    <Col lgOffset={2} lg={8}>
                        <h1><span className="text-capitalize">{fullName}'s</span> <small>billede galleri</small></h1>
                        <hr />
                        <ImageList
                            images={images}
                            canEdit={canEdit}
                            addSelectedImageId={addSelectedImageId}
                            removeSelectedImageId={removeSelectedImageId}
                            imageIsSelected={this.imageIsSelected}
                            username={username}
                        />
                        {this.uploadView()}
                    </Col>
                    {this.props.children}
                </Row>
    }
}

const UserImagesRedux = connect(mapStateToProps, mapDispatchToProps)(UserImagesContainer);
const UserImages = withRouter(UserImagesRedux);
export default UserImages;