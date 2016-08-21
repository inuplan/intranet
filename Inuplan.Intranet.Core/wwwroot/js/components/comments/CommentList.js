import React from 'react'
import { CommentDeleted } from './CommentDeleted'
import { Comment } from './Comment'
import { Media } from 'react-bootstrap'

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
                return  <Media.ListItem key={key}>
                            <CommentDeleted
                                 key={key} 
                                 replies={comment.Replies}
                                 handlers={handlers}
                                 constructComments={constructComments}
                             />
                        </Media.ListItem>
            }

            return  <Media.ListItem key={key}>
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
                    </Media.ListItem>
        });
    }

    render() {
        const { comments, replyHandle, editHandle, deleteHandle, canEdit, getUser } = this.props;
        const handlers = compactHandlers(replyHandle, editHandle, deleteHandle, canEdit, getUser);
        const nodes = this.constructComments(comments, handlers);

        return  <Media.List>
                    {nodes}
                </Media.List>
    }
}