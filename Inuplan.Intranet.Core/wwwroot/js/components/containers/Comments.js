import React from 'react'
import { fetchComments, postComment, editComment, deleteComment } from '../../actions/comments'
import { CommentList } from '../comments/CommentList'
import { find } from 'underscore'
import { connect } from 'react-redux'
import { Pagination } from '../comments/Pagination'
import { CommentForm } from '../comments/CommentForm'
import { Row, Col } from 'react-bootstrap'

const mapStateToProps = (state) => {
    return {
        imageId: state.imagesInfo.selectedImageId,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        page: state.commentsInfo.page,
        totalPages: state.commentsInfo.totalPages,
        comments: state.commentsInfo.comments,
        getName: (userId) => {
            const user = find(state.usersInfo.users, (user) => user.ID == userId);
            const { FirstName, LastName } = user;
            return `${FirstName} ${LastName}`;
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadComments: (imageId, skip, take) => {
            dispatch(fetchComments(imageId, skip, take));
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

    render() {
        const { comments, getName, imageId, page, totalPages } = this.props;

        return  <div className="text-left">
                    <Row>
                        <Col lgOffset={1} lg={11}>
                            <CommentList comments={comments} getName={getName} />
                        </Col>
                    </Row>
                    <Row>
                        <Pagination
                                imageId={imageId}
                                currentPage={page}
                                totalPages={totalPages}
                                next={this.nextPage}
                                prev={this.previousPage}
                                getPage={this.getPage}
                        />
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

export const Comments = connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);