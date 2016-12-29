import * as React from "react";
import { setSelectedImg, fetchSingleImage, deleteImage } from "../../actions/images";
import { setSkipComments, setTakeComments, setFocusedComment, receivedComments } from "../../actions/comments";
import { setError } from "../../actions/error";
import { connect, Dispatch } from "react-redux";
import { withRouter, InjectedRouter } from "react-router";
import { Modal, Image, Button, ButtonToolbar, Glyphicon } from "react-bootstrap";
import { Root } from "../../interfaces/State";
import { ErrorState } from "../../interfaces/State";
import * as moment from "moment";

interface StateToProps {
    canEdit: boolean;
    hasImage: () => boolean;
    filename: string;
    previewUrl: string;
    extension: string;
    originalUrl: string;
    uploaded: Date;
}

interface DispatchToProps {
    setSelectedImageId: (id: number) => void;
    deselectImage: () => void;
    setError: (error: ErrorState) => void;
    fetchImage: (id: number) => void;
    deleteImage: (id: number, username: string) => void;
    resetComments: () => void;
}

const mapStateToProps = (state: Root) => {
    const ownerId  = state.imagesInfo.ownerId;
    const currentId = state.usersInfo.currentUserId;
    const canEdit = (ownerId > 0 && currentId > 0 && ownerId === currentId);

    const getImage = (id: number) => state.imagesInfo.images[id];
    const image = () => getImage(state.imagesInfo.selectedImageId);
    const filename = () => { if (image()) return image().Filename; return ""; };
    const previewUrl = () => { if (image()) return image().PreviewUrl; return ""; };
    const extension = () => { if (image()) return image().Extension; return ""; };
    const originalUrl = () => { if (image()) return image().OriginalUrl; return ""; };
    const uploaded = () => { if (image()) return image().Uploaded; return new Date(); };

    return {
        canEdit: canEdit,
        hasImage: () => Boolean(getImage(state.imagesInfo.selectedImageId)),
        filename: filename(),
        previewUrl: previewUrl(),
        extension: extension(),
        originalUrl: originalUrl(),
        uploaded: uploaded()
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Root>) => {
    return {
        setSelectedImageId: (id: number) => {
            dispatch(setSelectedImg(id));
        },
        deselectImage: () => {
            dispatch(setSelectedImg(undefined));
        },
        setError: (error: ErrorState) => {
            dispatch(setError(error));
        },
        fetchImage: (id: number) => {
            dispatch(fetchSingleImage(id));
        },
        deleteImage: (id: number, username: string) => {
            dispatch(deleteImage(id, username));
        },
        resetComments: () => {
            dispatch(setSkipComments(0));
            dispatch(setTakeComments(10));
            dispatch(setFocusedComment(-1));
            dispatch(receivedComments([]));
        }
    };
};

class ModalImage extends React.Component<StateToProps & DispatchToProps & { router: InjectedRouter, params: { id: string, username: string } }, null> {
    constructor(props: any) {
        super(props);
        this.deleteImageHandler = this.deleteImageHandler.bind(this);
        this.close = this.close.bind(this);
        this.seeAllCommentsView = this.seeAllCommentsView.bind(this);
        this.reload = this.reload.bind(this);
    }

    close() {
        const { deselectImage, resetComments } = this.props;
        const { username } = this.props.params;
        const { push } = this.props.router;

        deselectImage();
        const galleryUrl = `/${username}/gallery`;
        resetComments();
        push(galleryUrl);
    }

    deleteImageHandler() {
        const { deleteImage, setSelectedImageId } = this.props;
        const { id, username } = this.props.params;

        deleteImage(Number(id), username);
        setSelectedImageId(-1);
    }

    deleteImageView() {
        const { canEdit } = this.props;
        if (!canEdit) return null;
        return <Button bsStyle="danger" onClick={this.deleteImageHandler}>Slet billede</Button>;
    }

    reload() {
        const { id, username } = this.props.params;
        const { push } = this.props.router;

        const path = `/${username}/gallery/image/${id}/comments`;
        push(path);
    }

    seeAllCommentsView() {
        const show = !Boolean(this.props.children);
        if (!show) return null;

        return  <p className="text-center">
                    <Button onClick={this.reload}>
                        <Glyphicon glyph="refresh"/> Se alle kommentarer?
                    </Button>
                </p>;
    }

    render() {
        const { filename, previewUrl, extension, originalUrl, uploaded, hasImage } = this.props;
        const show = hasImage();
        const name = filename + "." + extension;
        const uploadDate = moment(uploaded);
        const dateString = "Uploaded d. " + uploadDate.format("D MMM YYYY ") + "kl. " + uploadDate.format("H:mm");

        return  <Modal show={show} onHide={this.close} bsSize="large" animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>{name}<span><small> - {dateString}</small></span></Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <a href={originalUrl} target="_blank" rel="noopener">
                            <Image src={previewUrl} responsive className="center-block"/>
                        </a>
                    </Modal.Body>

                    <Modal.Footer>
                        {this.seeAllCommentsView()}
                        {this.props.children}
                        <hr />
                        <ButtonToolbar style={{float: "right"}}>
                            {this.deleteImageView()}
                            <Button onClick={this.close}>Luk</Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>;
    }
}

const SelectedImageRedux = connect(mapStateToProps, mapDispatchToProps)(ModalImage);
const SelectedImage = withRouter(SelectedImageRedux);
export default SelectedImage;