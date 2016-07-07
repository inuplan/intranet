import React from 'react'
import { CommentDeleted } from './CommentDeleted'
import { Comment } from './Comment'

const compactHandlers = (replyHandle, editHandle, deleteHandle, canEdit, getUser) => {
    return {
        replyHandle,
        editHandle,
        deleteHandle,
        canEdit,
        getUser
    }
}

export class CommentList extends React.Component {
    constructComments(comments, handlers) {
        if (!comments || comments.length == 0) return;

        return comments.map((comment) => {
            const key = "commentId" + comment.CommentID;

            if (comment.Deleted) {
                return (
                    <div className="media" key={key}>
                        <CommentDeleted
                             key={key} 
                             replies={comment.Replies}
                             handlers={handlers}
                             constructComments={constructComments}
                         />
                    </div>);
            }

            return (
                <div className="media" key={key}>
                    <Comment
                             key={key} 
                             postedOn={comment.PostedOn}
                             authorId={comment.AuthorID}                             
                             text={comment.Text}
                             replies={comment.Replies}
                             commentId={comment.CommentID}
                             handlers={handlers}
                             constructComments={constructComments}
                     />
                </div>
            );
        });
    }

    render() {
        const { comments, replyHandle, editHandle, deleteHandle, canEdit, getUser, userId } = this.props;
        const handlers = compactHandlers(replyHandle, editHandle, deleteHandle, canEdit, getUser);
        const nodes = this.constructComments(comments, handlers);
        return (
            <div>
                {nodes}
            </div>
        );
    }
}