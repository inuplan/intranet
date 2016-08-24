import React from 'react'
import { fetchComments, postComment, editComment, deleteComment } from '../../actions/comments'
import { CommentList } from '../comments/CommentList'
import { find } from 'underscore'
import { connect } from 'react-redux'
import { PaginationComments } from '../comments/PaginationComments'
import { CommentForm } from '../comments/CommentForm'
import { Row, Col } from 'react-bootstrap'
import { withRouter } from 'react-router'

const mapStateToProps = (state) => {
    const getUser = (userId) => {
        return find(state.usersInfo.users, (user) => user.ID == userId);
    }

    return {
        imageId: state.imagesInfo.selectedImageId,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        page: state.commentsInfo.page,
        totalPages: state.commentsInfo.totalPages,
        comments: state.commentsInfo.comments,
        getName: (userId) => {
            const user = getUser(userId);
            const { FirstName, LastName } = user;
            return `${FirstName} ${LastName}`;
        },
        owner: getUser(state.imagesInfo.ownerId)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postComment: (imageId, text) => {
            dispatch(postComment(imageId, text, null));
        },
        fetchComments: (imageId, skip, take) => {
            dispatch(fetchComments(imageId, skip, take));
        }
    }
}

class CommentsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.pageHandle = this.pageHandle.bind(this);
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

    render() {
        const { comments, getName, imageId, page, owner, totalPages, postComment } = this.props;

        return  <div className="text-left">
                    <Row>
                        <Col lgOffset={1} lg={11}>
                            <CommentList comments={comments} getName={getName} />
                        </Col>
                    </Row>
                    <Row>
                        <Col lgOffset={1} lg={10}>
                            <PaginationComments
                                username={owner.Username}
                                totalPages={totalPages}
                                page={page}
                                imageId={imageId}
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
