import * as React from 'react'
import { CommentDeleted } from './CommentDeleted'
import { Comment } from './Comment'
import { Media } from 'react-bootstrap'
import { Components } from '../../interfaces/Components'
import { Data } from '../../interfaces/Data'

export class CommentList extends React.Component<Components.commentList, null> {
    constructor(props: any) {
        super(props);
        this.constructComment = this.constructComment.bind(this);
    }

    rootComments(comments: Data.Comment[]) {
        if (!comments) return null;

        return comments.map((comment) => {
            const node = this.constructComment(comment);
            return  <Media.ListItem key={"rootComment_" + comment.CommentID}>
                        {node}
                    </Media.ListItem>
        });
    }

    constructComment(comment: Data.Comment): JSX.Element {
        const key = "commentId" + comment.CommentID;

        if (comment.Deleted)
            return  <CommentDeleted
                        key={key}
                        construct={this.constructComment}
                        replies={comment.Replies} />

        const { contextId, getName, canEdit } = this.props;
        const { skip, take, editComment, deleteComment, replyComment } = this.props;
        const controls = { skip, take, editComment, deleteComment, replyComment };
        const name = getName(comment.AuthorID);
        return  <Comment
                    key={key}
                    contextId={contextId}
                    name={name}
                    postedOn={comment.PostedOn}
                    authorId={comment.AuthorID}
                    text={comment.Text}
                    construct={this.constructComment}
                    replies={comment.Replies}
                    edited={comment.Edited}
                    canEdit={canEdit}
                    commentId={comment.CommentID}
                    {...controls}
                />
    }

    render() {
        const { comments } = this.props;
        const nodes = this.rootComments(comments);

        return  <Media.List>
                    {nodes}
                </Media.List>
    }
}