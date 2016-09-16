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

        const { contextId, getName, canEdit } = this.props;
        const { skip, take, editComment, deleteComment, replyComment } = this.props;
        const props = { skip, take, editComment, deleteComment, replyComment };
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
                    {...props}
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

CommentList.propTypes = {
    comments: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    getName: React.PropTypes.func.isRequired,
    canEdit: React.PropTypes.func.isRequired,
}