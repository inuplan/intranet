import React from 'react'
import marked from 'marked'
import { CommentControls } from './CommentControls'
import { CommentProfile } from './CommentProfile'

export class Comment extends React.Component {
    rawMarkup(text) {
        if (!text) return;
        var rawMarkup = marked(text, { sanitize: true });
        return { __html: rawMarkup };
    }

    render() {
        const { commentId, postedOn, authorId, text, replies, handlers, constructComments } = this.props;
        const { replyHandle, editHandle, deleteHandle, canEdit, getUser } = handlers;
        const author = getUser(authorId);
        const fullname = author.FirstName + " " + author.LastName;
        const canEditVal = canEdit(authorId);
        const replyNodes = constructComments(replies, handlers);

        return (
            <div className="media pull-left text-left">
                    <CommentProfile />
                    <div className="media-body">
                        <h5 className="media-heading"><strong>{fullname}</strong> <PostedOn postedOn={postedOn} /></h5>
                        <span dangerouslySetInnerHTML={this.rawMarkup(text)}></span>
                        <CommentControls
                                  canEdit={canEditVal}
                                  commentId={commentId}
                                  deleteHandle={deleteHandle}
                                  editHandle={editHandle}
                                  replyHandle={replyHandle}
                                  text={text}
                        />
                        {replyNodes}
                    </div>
            </div>);
    }
}

class PostedOn extends React.Component {
    ago() {
        const { postedOn } = this.props;
        const ago = moment(postedOn).fromNow();
        const diff = moment().diff(postedOn, 'hours', true);
        if (diff >= 12.5) {
            var date = moment(postedOn);
            return "d. " + date.format("D MMM YYYY ") + "kl. " + date.format("H:mm");
        }

        return "for " + ago;
    }

    render() {
        return (<small>sagde {this.ago()}</small>);
    }
}