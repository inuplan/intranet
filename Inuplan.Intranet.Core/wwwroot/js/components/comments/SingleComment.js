import React from 'react'
import { Comment } from './Comment'
import { connect } from 'react-redux'
import { Well, Button, Glyphicon } from 'react-bootstrap'
import { find } from 'underscore'
import { withRouter } from 'react-router'

const tryGetComment = (comments = [], id) => { return find(comments, (c) => c.CommentID == id); }
const tryGetUser = (users = [], userId) => { return find(users, (user) => user.ID == userId); }

const mapStateToProps = (state) => {
    const { comments, focusedComment } = state.commentsInfo;
    const { users } = state.usersInfo;

    return {
        getName: (id) => {
            const user = tryGetUser(users, id);
            if(!user) return '';
            return `${user.FirstName} ${user.LastName}`;
        },
        getComment: () => tryGetComment(comments, focusedComment),
        imageId: state.imagesInfo.selectedImageId,
        imageOwner: tryGetUser(users, state.imagesInfo.ownerId)
    }
}

class SingleCommentRedux extends React.Component {
    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
    }

    reload() {
        const { imageId, imageOwner } = this.props;
        const { push } = this.props.router;

        const path = `/${imageOwner.Username}/gallery/image/${imageId}/comments`;
        push(path);
    }

    render() {
        const { getName, getComment } = this.props;
        const comment = getComment();
        if(!comment) return null;

        const { Text, AuthorID, CommentID, PostedOn } = comment;
        const name = getName(comment.AuthorID);

        return  <div className="text-left">
                    <Well>
                        <Comment
                            name={name}
                            text={Text}
                            commentId={CommentID}
                            replies={[]}
                            authorId={AuthorID}
                            postedOn={PostedOn}
                        />
                    </Well>
                    <div>
                        <p className="text-center">
                            <Button onClick={this.reload}>
                                <Glyphicon glyph="refresh"/> Se alle kommentarer?
                            </Button>
                        </p>
                    </div>
                </div>
    }
}

const SingleCommentConnect = connect(mapStateToProps, null)(SingleCommentRedux);
export const SingleComment = withRouter(SingleCommentConnect);
