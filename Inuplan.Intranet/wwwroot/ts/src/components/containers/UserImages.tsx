import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { uploadImage, addSelectedImageId,  deleteImages, removeSelectedImageId, clearSelectedImageIds, fetchUserImages } from "../../actions/images";
import { ImageUpload } from "../images/ImageUpload";
import ImageList from "../images/ImageList";
import { find } from "underscore";
import { withRouter, RouterOnContext, PlainRoute } from "react-router";
import { Row, Col, Button } from "react-bootstrap";
import { Breadcrumb } from "../breadcrumbs/Breadcrumb";
import { values } from "underscore";
import UsedSpace from "./UsedSpace";
import { Root } from "../../interfaces/State";
import { Data } from "../../interfaces/Data";

 interface StateToProps {
     images: Data.Image[];
     canEdit: boolean;
     selectedImageIds: number[];
     fullName: string;
 }

 interface DispatchToProps {
     uploadImage: (username: string, desription: string, formData: FormData) => void;
     addSelectedImageId: (id: number) => void;
     removeSelectedImageId: (id: number) => void;
     deleteImages: (username: string, ids: number[]) => void;
     clearSelectedImageIds: () => void;
 }

interface RouteParams {
    username: string;
}

interface Router {
    router: RouterOnContext;
    route: PlainRoute;
}

const mapStateToProps = (state: Root) => {
    const { ownerId } = state.imagesInfo;
    const currentId = state.usersInfo.currentUserId;
    const canEdit = (ownerId > 0 && currentId > 0 && ownerId === currentId);
    const user = state.usersInfo.users[ownerId];
    const fullName = user ? `${user.FirstName} ${user.LastName}` : "";
    const images: Data.Image[] = values(state.imagesInfo.images).reverse();

    return {
        images: images,
        canEdit: canEdit,
        selectedImageIds: state.imagesInfo.selectedImageIds,
        fullName: fullName,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Root>) => {
    return {
        uploadImage: (username: string, description: string, formData: FormData) => {
            dispatch(uploadImage(username, description, formData, () => { dispatch(fetchUserImages(username)); }, () => { }));
        },
        addSelectedImageId: (id: number) => {
            // Images to be deleted by selection:
            dispatch(addSelectedImageId(id));
        },
        removeSelectedImageId: (id: number) => {
            // Images to be deleted by selection:
            dispatch(removeSelectedImageId(id));
        },
        deleteImages: (username: string, ids: number[]) => {
            dispatch(deleteImages(username, ids));
        },
        clearSelectedImageIds: () => {
            dispatch(clearSelectedImageIds());
        }
    };
};

interface Props extends Router, StateToProps, DispatchToProps {
    params: RouteParams;
}

class UserImagesContainer extends React.Component<Props, null> {
    constructor(props: any) {
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

    imageIsSelected(checkId: number) {
        const { selectedImageIds } = this.props;
        const res = find(selectedImageIds, (id) => {
            return id === checkId;
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

        if (!canEdit) return null;

        return  <Row>
                    <Col lg={7}>
                        <ImageUpload
                            uploadImage={uploadImage}
                            username={username}>
                                {"\u00A0"}
                                <Button bsStyle="danger" disabled={!hasImages} onClick={this.deleteSelectedImages}>Slet markeret billeder</Button>
                        </ImageUpload>
                    </Col>
                </Row>;
    }

    uploadLimitView() {
        const { canEdit } = this.props;
        if (!canEdit) return null;
        return  <Row>
                    <Col lgOffset={2} lg={2}>
                        <br />
                        <UsedSpace />
                    </Col>
                </Row>;
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
                    <Row>
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
                    </Row>
                    {this.uploadLimitView()}
                    {this.props.children}
                </Row>;
    }
}

const UserImagesRedux = connect(mapStateToProps, mapDispatchToProps)(UserImagesContainer);
const UserImages = withRouter(UserImagesRedux);
export default UserImages;