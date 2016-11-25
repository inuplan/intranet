﻿import React from 'react'
import { fetchComments, postComment, editComment, deleteComment } from '../../actions/comments'
import { incrementCommentCount, decrementCommentCount } from '../../actions/images'
import { CommentList } from '../comments/CommentList'
import { connect } from 'react-redux'
import { Pagination } from '../pagination/Pagination'
import { CommentForm } from '../comments/CommentForm'
import { getImageCommentsPageUrl, getImageCommentsDeleteUrl } from '../../utilities/utils'
import { Row, Col } from 'react-bootstrap'
import { withRouter } from 'react-router'

const mapStateToProps = (state) => {
    return {
        canEdit: (id) => state.usersInfo.currentUserId == id,
        imageId: state.imagesInfo.selectedImageId,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        page: state.commentsInfo.page,
        totalPages: state.commentsInfo.totalPages,
        comments: state.commentsInfo.comments,
        getName: (userId) => {
            const user = state.usersInfo.users[userId];
            const { FirstName, LastName } = user;
            return `${FirstName} ${LastName}`;
        },
        owner: state.usersInfo.users[state.imagesInfo.ownerId]
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postHandle: (imageId, text, cb) => {
            const url = globals.urls.imagecomments;
            dispatch(postComment(url, imageId, text, null, cb));
        },
        fetchComments: (imageId, skip, take) => {
            const url = getImageCommentsPageUrl(imageId, skip, take);
            dispatch(fetchComments(url, skip, take));
        },
        editHandle: (commentId, imageId, text, cb) => {
            const url = globals.urls.imagecomments;
            dispatch(editComment(url, commentId, text, cb));
        },
        deleteHandle: (commentId, cb) => {
            const url = getImageCommentsDeleteUrl(commentId);
            dispatch(deleteComment(url, cb));
        },
        replyHandle: (imageId, text, parentId, cb) => {
            const url = globals.urls.imagecomments;
            dispatch(postComment(url, imageId, text, parentId, cb));
        },
        incrementCount: (imageId) => dispatch(incrementCommentCount(imageId)),
        decrementCount: (imageId) => dispatch(decrementCommentCount(imageId)),
        loadComments: (imageId, skip, take) => {
            const url = getImageCommentsPageUrl(imageId, skip, take);
            dispatch(fetchComments(url, skip, take));
        }
    }
}

class CommentsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.pageHandle = this.pageHandle.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.editComment = this.editComment.bind(this);
        this.replyComment = this.replyComment.bind(this);
        this.postComment = this.postComment.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { fetchComments, imageId, skip, take } = this.props;
        const { page } = nextProps.location.query;
        if(!Number(page)) return;
        const skipPages = page - 1;
        const skipItems = (skipPages * take);
        fetchComments(imageId, skipItems, take);
    }

    pageHandle(to) {
        const { owner, imageId, page } = this.props;
        const { push } = this.props.router;
        const username = owner.Username;
        if(page == to) return;
        const url = `/${username}/gallery/image/${imageId}/comments?page=${to}`;
        push(url);
    }

    deleteComment(commentId, imageId) {
        const { deleteHandle, loadComments, decrementCount, skip, take } = this.props;
        const cb = () => {
            decrementCount(imageId);
            loadComments(imageId, skip, take);
        }

        deleteHandle(commentId, cb);
    }

    editComment(commentId, imageId, text) {
        const { loadComments, skip, take, editHandle } = this.props;
        const cb = () => loadComments(imageId, skip, take);
        editHandle(commentId, imageId, text, cb);
    }

    replyComment(imageId, text, parentId) {
        const { loadComments, incrementCount, skip, take, replyHandle } = this.props;
        const cb = () => {
            incrementCount(imageId);
            loadComments(imageId, skip, take);
        }

        replyHandle(imageId, text, parentId, cb);
    }

    postComment(text) {
        const { imageId, loadComments, incrementCount, skip, take, postHandle } = this.props;
        const cb = () => {
            incrementCount(imageId);
            loadComments(imageId, skip, take);
        }

        postHandle(imageId, text, cb);
    }

    render() {
        const { canEdit, comments, getName, imageId, page, totalPages } = this.props;
        const { skip, take } = this.props;
        let props = { skip, take };
        props = Object.assign({}, props, {
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        });


        return  <div className="text-left">
                    <Row>
                        <Col lgOffset={1} lg={11}>
                            <CommentList
                                contextId={imageId}
                                comments={comments}
                                getName={getName}
                                canEdit={canEdit}
                                props
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lgOffset={1} lg={10}>
                            <Pagination
                                totalPages={totalPages}
                                page={page}
                                pageHandle={this.pageHandle}
                            />
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col lgOffset={1} lg={10}>
                            <CommentForm postHandle={this.postComment}/>
                        </Col>
                    </Row>
                </div>
    }
}

const CommentsRedux = connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);
const ImageComments = withRouter(CommentsRedux);
export default ImageComments;