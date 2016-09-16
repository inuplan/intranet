import React from 'react'
import { Comment } from './Comment'
import { connect } from 'react-redux'
import { Well, Button, Glyphicon } from 'react-bootstrap'
import { find } from 'underscore'
import { fetchAndFocusSingleComment, postComment, editComment, deleteComment } from '../../actions/comments'
import { withRouter } from 'react-router'
import { objMap } from '../../utilities/utils'

const mapStateToProps = (state) => {
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
        canEdit: (id) => state.usersInfo.currentUserId == id,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        editComment: (commentId, contextId, text) => dispatch(editComment(commentId, contextId, text)),
        deleteHandle: (commentId, contextId, cb) => dispatch(deleteComment(commentId, contextId, cb)),
        replyComment: (contextId, text, parentId) => dispatch(postComment(contextId, text, parentId)),
        focusComment: (id) => dispatch(fetchAndFocusSingleComment(id))
    }
}

class SingleCommentRedux extends React.Component {
    constructor(props) {
        super(props);
        this.allComments = this.allComments.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    allComments() {
        const { imageId, imageOwner } = this.props;
        const { push } = this.props.router;

        const path = `/${imageOwner}/gallery/image/${imageId}/comments`;
        push(path);
    }

    deleteComment(commentId, contextId) {
        const { deleteHandle } = this.props;

        deleteHandle(commentId, contextId, this.allComments);
    }

    render() {
        const { focusedId } = this.props;
        if(focusedId < 0) return null;

        const { Text, AuthorID, CommentID, PostedOn, Edited } = this.props.focused;
        const { canEdit, imageId } = this.props;
        const { skip, take, editComment, deleteComment, replyComment } = this.props;
        let props = { skip, take, editComment, replyComment };
        props = Object.assign({}, props, {
            deleteComment: this.deleteComment
        });

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
                </div>
    }
}

const SingleCommentConnect = connect(mapStateToProps, mapDispatchToProps)(SingleCommentRedux);
export const SingleComment = withRouter(SingleCommentConnect);
