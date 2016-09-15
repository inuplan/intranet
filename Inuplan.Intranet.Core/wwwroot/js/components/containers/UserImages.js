import React from 'react'
import { connect } from 'react-redux'
import { uploadImage, addSelectedImageId,  deleteImages, removeSelectedImageId, clearSelectedImageIds, fetchUserImages } from '../../actions/images'
import { Error } from './Error'
import { ImageUpload } from '../images/ImageUpload'
import ImageList from '../images/ImageList'
import { find } from 'underscore'
import { withRouter } from 'react-router'
import { Row, Col, Button } from 'react-bootstrap'
import { Breadcrumb } from '../breadcrumbs/Breadcrumb'
import { values, sortBy } from 'underscore'

const mapStateToProps = (state) => {
    const { ownerId } = state.imagesInfo;
    const currentId = state.usersInfo.currentUserId;
    const canEdit = (ownerId > 0 && currentId > 0 && ownerId == currentId);
    const user = state.usersInfo.users[ownerId];
    const fullName = user ? `${user.FirstName} ${user.LastName}` : '';
    const images = sortBy(values(state.imagesInfo.images), (img) => -img.ImageID);

    return {
        images: images,
        canEdit: canEdit,
        selectedImageIds: state.imagesInfo.selectedImageIds,
        fullName: fullName,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        uploadImage: (username, formData) => {
            dispatch(uploadImage(username, formData, () => { dispatch(fetchUserImages(username)); }, () => { }));
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
        this.clearSelected();
    }

    uploadView() {
        const { canEdit, uploadImage, selectedImageIds } = this.props;
        const { username } = this.props.params;
        const hasImages = selectedImageIds.length > 0;

        if(!canEdit) return null;

        return  <Row>
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
        const { images, fullName, canEdit, addSelectedImageId, removeSelectedImageId } = this.props;
        
        return  <Row>
                    <Row>
                        <Col lgOffset={2} lg={8}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">
                                    Forside
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active>
                                    {username}'s billeder
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                    <Col lgOffset={2} lg={8}>
                        <h1><span className="text-capitalize">{fullName}</span>'s <small>billede galleri</small></h1>
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