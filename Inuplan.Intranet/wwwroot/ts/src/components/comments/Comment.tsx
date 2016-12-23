import * as React from 'react'
import { CommentControls } from './CommentControls'
import { CommentProfile } from './CommentProfile'
import { formatText, timeText } from '../../utilities/utils'
import { Media } from 'react-bootstrap'
import { Components } from '../../interfaces/Components'

export class Comment extends React.Component<Components.commentProps, any> {
    ago() {
        const { postedOn } = this.props;
        return timeText(postedOn);
    }

    editedView(edited: boolean) {
        if(!edited) return null;
        return  <span>*</span>
    }

    render() {
        const { canEdit, contextId, name, text, commentId, replies, construct, authorId, edited } = this.props;
        const { skip, take, editComment, deleteComment, replyComment } = this.props;
        const props = { skip, take, editComment, deleteComment, replyComment };
        const txt = formatText(text);
        const replyNodes = replies.map(reply => construct(reply));

        return  <Media>
                    <CommentProfile />
                    <Media.Body>
                        <h5 className="media-heading">
                            <strong>{name}</strong> <small>sagde {this.ago()}{this.editedView(edited)}</small> 
                        </h5>
                        <span dangerouslySetInnerHTML={txt}></span>
                        <CommentControls
                            contextId={contextId}
                            canEdit={canEdit}
                            authorId={authorId}
                            commentId={commentId}
                            text={text}
                            {...props}
                        />
                        {replyNodes}
                    </Media.Body>
                </Media>
    }
}