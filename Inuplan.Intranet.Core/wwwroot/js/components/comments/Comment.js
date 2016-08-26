import React from 'react'
import { CommentControls } from './CommentControls'
import { CommentProfile } from './CommentProfile'
import { formatText, timeText } from '../../utilities/utils'
import { Media } from 'react-bootstrap'

export class Comment extends React.Component {
    ago() {
        const { postedOn } = this.props;
        return timeText(postedOn);
    }

    render() {
        const { name, text, commentId, replies, construct, authorId } = this.props;
        const txt = formatText(text);
        const replyNodes = replies.map(reply => construct(reply));

        return  <Media>
                    <CommentProfile />
                    <Media.Body>
                        <h5 className="media-heading">
                            <strong>{name}</strong> <small>sagde {this.ago()}</small>
                        </h5>
                        <span dangerouslySetInnerHTML={txt}></span>
                        <CommentControls authorId={authorId} commentId={commentId} text={text} />

                        {replyNodes}

                    </Media.Body>
                </Media>
    }
}