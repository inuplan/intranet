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

class CommentsContainer extends React.Component {
    render() {
        const { comments, getName, imageId, page, owner, totalPages } = this.props;
        const { push } = this.props.router;

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
                                navigateTo={push}
                                imageId={imageId}
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

const CommentsRedux = connect(mapStateToProps, null)(CommentsContainer);
export const Comments = withRouter(CommentsRedux);
