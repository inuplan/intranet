import React from 'react'
import { Comment } from './Comment'
import { connect } from 'react-redux'
import { Well } from 'react-bootstrap'
import { find } from 'underscore'

const mapStateToProps = (state) => {
    const getUser = (userId) => {
        const u = find(state.usersInfo.users, (user) => user.ID == userId);
        return u;
    }

    const defaultComment = {
        AuthorID: -1,
        Text: '',
        CommentID: -1
    };

    const comments = state.commentsInfo.comments;
    const comment = comments[0] || defaultComment;

    return {
        getName: (id) => {
            const user = getUser(id);
            return `${user.FirstName} ${user.LastName}`;
        },
        text: comment.Text,
        commentId: comment.CommentID,
        authorId: comment.AuthorID
    }
}

class SingleCommentRedux extends React.Component {
    render() {
        const { getName, text, commentId, authorId } = this.props;
        if(commentId < 0) return null;

        const name = getName(authorId);
        return  <div className="text-left">
                    <Well>
                        <Comment
                            name={name}
                            text={text}
                            commentId={commentId}
                            replies={[]}
                            authorId={authorId}
                        />
                    </Well>
                    <div>
                        Se alle kommentarer?
                    </div>
                </div>
    }
}

export const SingleComment = connect(mapStateToProps, null)(SingleCommentRedux);