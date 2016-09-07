import React from 'react'
import { CommentDeleted } from './CommentDeleted'
import { Comment } from './Comment'
import { Media } from 'react-bootstrap'


export class CommentList extends React.Component {
    constructor(props) {
        super(props);
        this.constructComment = this.constructComment.bind(this);
    }

    rootComments(comments) {
        if (!comments) return;

        return comments.map((comment) => {
            const node = this.constructComment(comment);
            return  <Media.ListItem key={"rootComment_" + comment.CommentID}>
                        {node}
                    </Media.ListItem>
        });
    }

    constructComment(comment) {
        const key = "commentId" + comment.CommentID;

        if (comment.Deleted)
            return  <CommentDeleted
                        key={key} 
                        construct={this.constructComment}
                        replies={comment.Replies} />

        const { getName } = this.props;
        const name = getName(comment.AuthorID);
        return  <Comment
                    key={key} 
                    name={name}
                    postedOn={comment.PostedOn}
                    authorId={comment.AuthorID}                             
                    text={comment.Text}
                    construct={this.constructComment}
                    replies={comment.Replies}
                    edited={comment.Edited}
                    commentId={comment.CommentID} />
    }

    render() {
        const { comments } = this.props;
        const nodes = this.rootComments(comments);

        return  <Media.List>
                    {nodes}
                </Media.List>
    }
}