﻿import React from 'react'
import { fetchComments, postComment, editComment, deleteComment } from '../../actions/comments'
import { CommentList } from '../comments/CommentList'
import { find, values, sortBy } from 'underscore'
import { connect } from 'react-redux'
import { Pagination } from '../pagination/Pagination'
import { CommentForm } from '../comments/CommentForm'
import { Row, Col } from 'react-bootstrap'
import { withRouter } from 'react-router'

const mapStateToProps = (state) => {
    const getUser = (userId) => {
        return find(state.usersInfo.users, (user) => user.ID == userId);
    }

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
        postComment: (imageId, text) => {
            dispatch(postComment(imageId, text, null));
        },
        fetchComments: (imageId, skip, take) => {
            dispatch(fetchComments(imageId, skip, take));
        },
        editHandle: (commentId, contextId, text, cb) => dispatch(editComment(commentId, contextId, text, cb)),
        deleteHandle: (commentId, contextId, cb) => dispatch(deleteComment(commentId, contextId, cb)),
        replyComment: (contextId, text, parentId) => dispatch(postComment(contextId, text, parentId)),
        loadComments: (contextId, skip, take) => {
            dispatch(fetchComments(contextId, skip, take));
        }
    }
}

class CommentsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.pageHandle = this.pageHandle.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.editComment = this.editComment.bind(this);
    }

    pageHandle(to) {
        const { owner, imageId, page, skip, take, fetchComments } = this.props;
        const { push } = this.props.router;

        const username = owner.Username;

        if(page == to) return;

        const url = `/${username}/gallery/image/${imageId}/comments?page=${to}`;
        push(url);

        const skipPages = to - 1;
        const skipItems = (skipPages * take);
        fetchComments(imageId, skipItems, take);
    }

    deleteComment(commentId, contextId) {
        const { deleteHandle, loadComments, skip, take } = this.props;
        const cb = () => loadComments(contextId, skip, take);
        deleteHandle(commentId, contextId, cb);
    }

    editComment(commentId, contextId, text) {
        const { loadComments, skip, take, editHandle } = this.props;
        const cb = () => loadComments(contextId, skip, take);
        editHandle(commentId, contextId, text, cb);
    }

    render() {
        const { canEdit, comments, getName, imageId, page, totalPages, postComment } = this.props;
        const { skip, take, editComment, replyComment } = this.props;
        let props = { skip, take, replyComment };
        props = Object.assign({}, props, {
            deleteComment: this.deleteComment,
            editComment: this.editComment
        });


        return  <div className="text-left">
                    <Row>
                        <Col lgOffset={1} lg={11}>
                            <CommentList
                                contextId={imageId}
                                comments={comments}
                                getName={getName}
                                canEdit={canEdit}
                                {...props}
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
                            <CommentForm postHandle={postComment.bind(null, imageId)}/>
                        </Col>
                    </Row>
                </div>
    }
}

const CommentsRedux = connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);
export const Comments = withRouter(CommentsRedux);
