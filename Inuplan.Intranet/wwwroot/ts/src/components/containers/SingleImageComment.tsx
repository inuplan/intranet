import * as React from "react";
import { Comment } from "../comments/Comment";
import { connect, Dispatch } from "react-redux";
import { Well, Button, Glyphicon } from "react-bootstrap";
import { fetchAndFocusSingleComment, postComment, editComment, deleteComment } from "../../actions/comments";
import { withRouter, InjectedRouter } from "react-router";
import { getImageCommentsDeleteUrl } from "../../utilities/utils";
import { Root } from "../../interfaces/State";
import { Data } from "../../interfaces/Data";

interface StateToProps {
    getName: (id: number) => string;
    focusedId: number;
    focused: Data.Comment;
    imageId: number;
    imageOwner: string;
    canEdit: (id: number) => boolean;
    skip: number;
    take: number;
}

type cb = () => void;

interface DispatchToProps {
    editHandle: (commentId: number, imageId: number, text: string, cb: cb) => void;
    deleteHandle: (commentId: number, cb: cb) => void;
    replyHandle: (imageId: number, text: string, parentId: number, cb: cb) => void;
    focusComment: (id: number) => void;

}

const mapStateToProps = (state: Root): StateToProps => {
    const { comments, focusedComment } = state.commentsInfo;
    const { users } = state.usersInfo;
    const { ownerId, selectedImageId } = state.imagesInfo;

    return {
        getName: (id) => {
            const author = users[id];
            return `${author.FirstName} ${author.LastName}`;
        },
        focusedId: focusedComment,
        focused: comments[0],
        imageId: selectedImageId,
        imageOwner: users[ownerId].Username,
        canEdit: (id) => state.usersInfo.currentUserId === id,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Root>): DispatchToProps => {
    return {
        editHandle: (commentId: number, _: number, text: string, cb: cb) => {
            const url = globals.urls.imagecomments;
            dispatch<any>(editComment(url, commentId, text, cb));
        },
        deleteHandle: (commentId, cb) => {
            const url = getImageCommentsDeleteUrl(commentId);
            dispatch<any>(deleteComment(url, cb));
        },
        replyHandle: (imageId, text, parentId, cb) => {
            const url = globals.urls.imagecomments;
            dispatch<any>(postComment(url, imageId, text, parentId, cb));
        },
        focusComment: (id) => dispatch<any>(fetchAndFocusSingleComment(id))
    };
};

class SingleCommentRedux extends React.Component<StateToProps & DispatchToProps & { router: InjectedRouter }, null> {
    constructor(props: any) {
        super(props);
        this.allComments = this.allComments.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.editComment = this.editComment.bind(this);
        this.replyComment = this.replyComment.bind(this);
    }

    allComments() {
        const { imageId, imageOwner } = this.props;
        const { push } = this.props.router;

        const path = `/${imageOwner}/gallery/image/${imageId}/comments`;
        push(path);
    }

    deleteComment(commentId: number, _: number) {
        const { deleteHandle } = this.props;

        deleteHandle(commentId, this.allComments);
    }

    editComment(commentId: number, contextId: number, text: string) {
        const { editHandle, focusComment } = this.props;
        const cb = () => focusComment(commentId);
        editHandle(commentId, contextId, text, cb);
    }

    replyComment(contextId: number, text: string, parentId: number) {
        const { replyHandle } = this.props;
        replyHandle(contextId, text, parentId, this.allComments);
    }

    render() {
        const { focusedId } = this.props;
        if (focusedId < 0) return null;

        const { Text, AuthorID, CommentID, PostedOn, Edited } = this.props.focused;
        const { canEdit, imageId } = this.props;
        const { skip, take } = this.props;
        const props = {
            skip,
            take,
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        };

        const name = this.props.getName(AuthorID);

        return  <div className="text-left">
                    <Well>
                        <Comment
                            contextId={imageId}
                            name={name}
                            text={Text}
                            commentId={CommentID}
                            replies={[]}
                            canEdit={canEdit}
                            authorId={AuthorID}
                            postedOn={PostedOn}
                            edited={Edited}
                            {...props}
                        />
                    </Well>
                    <div>
                        <p className="text-center">
                            <Button onClick={this.allComments}>
                                <Glyphicon glyph="refresh"/> Se alle kommentarer?
                            </Button>
                        </p>
                    </div>
                </div>;
    }
}

const SingleCommentConnect = connect(mapStateToProps, mapDispatchToProps)(SingleCommentRedux);
const SingleImageComment = withRouter(SingleCommentConnect);
export default SingleImageComment;