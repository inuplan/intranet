import React from 'react'
import { fetchComments, postComment, postReply, editComment, deleteComment } from '../../actions/comments'
import { CommentList } from '../comments/CommentList'
import { find } from 'underscore'
import { connect } from 'react-redux'
import { Pagination } from '../comments/Pagination'
import { CommentForm } from '../comments/CommentForm'

const mapStateToProps = (state) => {
    return {
        imageId: state.imagesInfo.selectedImageId,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        page: state.commentsInfo.page,
        totalPages: state.commentsInfo.totalPages,
        comments: state.commentsInfo.comments,
        getUser: (id) => find(state.usersInfo.users, (u) => u.ID == id),
        canEdit: (userId) => state.usersInfo.currentUserId == userId,
        userId: state.usersInfo.currentUserId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadComments: (imageId, skip, take) => {
            dispatch(fetchComments(imageId, skip, take));
        },
        postReply: (imageId, replyId, text) => {
            dispatch(postReply(imageId, replyId, text));
        },
        postComment: (imageId, text) => {
            dispatch(postComment(imageId, text));
        },
        editComment: (imageId, commentId, text) => {
            dispatch(editComment(commentId, imageId, text));
        },
        deleteComment: (imageId, commentId) => {
            dispatch(deleteComment(commentId, imageId));
        }
    }
}

class CommentsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.nextPage = this.nextPage.bind(this);
        this.getPage = this.getPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
    }

    nextPage() {
        const { loadComments, imageId, skip, take } = this.props;
        const skipNext = skip + take;
        loadComments(imageId, skipNext, take);
    }

    getPage(page) {
        const { loadComments, imageId, take } = this.props;
        const skipPages = page - 1;
        const skipItems = (skipPages * take);
        loadComments(imageId, skipItems, take);
    }

    previousPage() {
        const { loadComments, imageId, skip, take} = this.props;
        const backSkip = skip - take;
        loadComments(imageId, backSkip, take);
    }

    componentDidMount() {
        const { loadComments, imageId, skip, take } = this.props;
        loadComments(imageId, skip, take);
    }

    render() {
        const { comments, postReply, editComment, postComment,
                deleteComment, canEdit, getUser,
                userId, imageId, page, totalPages } = this.props;

        return (
            <div>
                <div className="row">
                    <div className="col-lg-offset-1 col-lg-11">
                        <CommentList
                            comments={comments}
                            replyHandle={postReply.bind(null, imageId)}
                            editHandle={editComment.bind(null, imageId)}
                            deleteHandle={deleteComment.bind(null, imageId)}
                            canEdit={canEdit}
                            getUser={getUser}
                        />
                    </div>
                </div>
                <div className="row text-left">
                    <Pagination
                            imageId={imageId}
                            currentPage={page}
                            totalPages={totalPages}
                            next={this.nextPage}
                            prev={this.previousPage}
                            getPage={this.getPage}
                    />
                </div>
                <hr />
                <div className="row text-left">
                    <div className="col-lg-offset-1 col-lg-10">
                        <CommentForm
                            postHandle={postComment.bind(null, imageId)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export const Comments = connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);