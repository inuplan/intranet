import * as React from 'react'
import { CommentList } from '../comments/CommentList'
import { CommentForm } from '../comments/CommentForm'
import { Pagination } from '../pagination/Pagination'
import { fetchComments, postComment, editComment, deleteComment } from '../../actions/comments'
import { getForumCommentsDeleteUrl, getForumCommentsPageUrl } from '../../utilities/utils'
import { globals } from '../../interfaces/General'
import { Root } from '../../interfaces/State'
import { Data } from '../../interfaces/Data'
import { Row, Col } from 'react-bootstrap'
import { connect, Dispatch } from 'react-redux'
import { withRouter, InjectedRouter } from 'react-router'

type cb = () => void

interface stateToProps {
    comments: Data.Comment[]
    getName: (id: number) => string
    canEdit: (id: number) => boolean
    postId: number
    page: number
    skip: number
    take: number
    totalPages: number
}

interface dispatchToProps {
    editHandle: (commentId: number, postId: number, text: string, cb: cb) => void
    deleteHandle: (commentId: number, cb: cb) => void
    replyHandle: (postId: number, text: string, parentId: number, cb: cb) => void
    loadComments: (postId: number, skip: number, take: number) => void
    postHandle: (postId: number, text: string, cb: cb) => void
}

const mapStateToProps = (state: Root) => {
    return {
        comments: state.commentsInfo.comments,
        getName: (id: number) => {
            const user = state.usersInfo.users[id];
            if(!user) return '';
            return `${user.FirstName} ${user.LastName}`;
        },
        canEdit: (id: number) => state.usersInfo.currentUserId == id,
        postId: state.forumInfo.titlesInfo.selectedThread,
        page: state.commentsInfo.page,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        totalPages: state.commentsInfo.totalPages,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Root>) => {
    return {
        editHandle: (commentId: number, _: number, text: string, cb: cb) => {
            const url = globals.urls.forumcomments;
            dispatch(editComment(url, commentId, text, cb));
        },
        deleteHandle: (commentId: number, cb: cb) => {
            const url = getForumCommentsDeleteUrl(commentId);
            dispatch(deleteComment(url, cb));
        },
        replyHandle: (postId: number, text: string, parentId: number, cb: cb) => {
            const url = globals.urls.forumcomments;
            dispatch(postComment(url, postId, text, parentId, cb));
        },
        loadComments: (postId: number, skip: number, take: number) => {
            const url = getForumCommentsPageUrl(postId, skip, take);
            dispatch(fetchComments(url, skip, take));
        },
        postHandle: (postId: number, text: string, cb: cb) => {
            const url = globals.urls.forumcomments;
            dispatch(postComment(url, postId, text, null, cb));
        }
    }
}

class ForumCommentsContainer extends React.Component<stateToProps & dispatchToProps & { router: InjectedRouter, params: { id: string } }, any> {
    constructor(props: any) {
        super(props);
        this.deleteComment = this.deleteComment.bind(this);
        this.editComment = this.editComment.bind(this);
        this.replyComment = this.replyComment.bind(this);
        this.postComment = this.postComment.bind(this);
        this.pageHandle = this.pageHandle.bind(this);
    }

    componentWillReceiveProps(nextProps: any) {
        const { loadComments, postId, take } = this.props;
        const { page } = nextProps.location.query;
        if(!Number(page)) return;
        const skipPages = page - 1;
        const skipItems = (skipPages * take);
        loadComments(postId, skipItems, take);
    }

    pageHandle(to: number) {
        const { postId, page } = this.props;
        const { push } = this.props.router;
        if(page == to) return;
        const url = `/forum/post/${postId}/comments?page=${to}`;
        push(url);
    }

    deleteComment(commentId: number, postId: number) {
        const { deleteHandle, loadComments, skip, take } = this.props;
        const cb = () => {
            loadComments(postId, skip, take);
        }

        deleteHandle(commentId, cb);
    }

    editComment(commentId: number, postId: number, text: string) {
        const { editHandle, loadComments, skip, take } = this.props;
        const cb = () => {
            loadComments(postId, skip, take);
        }

        editHandle(commentId, postId, text, cb);
    }

    replyComment(postId: number, text: string, parentId: number) {
        const { replyHandle, loadComments, skip, take } = this.props;
        const cb = () => {
            loadComments(postId, skip, take);
        }

        replyHandle(postId, text, parentId, cb);
    }

    postComment(text: string) {
        const { loadComments, postId, skip, take, postHandle } = this.props;
        const cb = () => {
            loadComments(postId, skip, take);
        }

        postHandle(postId, text, cb);
    }

    render() {
        const { comments, getName, canEdit, totalPages, page, skip, take } = this.props;
        const { id } = this.props.params;
        const controls = {
            skip,
            take,
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        };
        return  <Row className="forum-comments-list">
                    <h4 className="forum-comments-heading">Kommentarer</h4>
                    <CommentList
                        comments={comments}
                        contextId={Number(id)}
                        getName={getName}
                        canEdit={canEdit}
                        {...controls}
                    />
                    <Pagination
                        totalPages={totalPages}
                        page={page}
                        pageHandle={this.pageHandle}
                    />
                    <Row>
                        <Col lg={12}>
                            <hr />
                            <CommentForm postHandle={this.postComment} />
                            <br />
                        </Col>
                    </Row>
                </Row>
    }
}

const ForumCommentsContainerRedux = connect(mapStateToProps, mapDispatchToProps)(ForumCommentsContainer);
const ForumComments = withRouter(ForumCommentsContainerRedux);
export default ForumComments;