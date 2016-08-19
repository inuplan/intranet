﻿import React from 'react'
import { CommentControls } from './CommentControls'
import { CommentProfile } from './CommentProfile'
import { formatText, timeText } from '../../utilities/utils'

export class Comment extends React.Component {
    render() {
        const { commentId, postedOn, authorId, text, replies, handlers, constructComments } = this.props;
        const { replyHandle, editHandle, deleteHandle, canEdit, getUser } = handlers;
        const author = getUser(authorId);
        const fullname = author.FirstName + " " + author.LastName;
        const canEditVal = canEdit(authorId);
        const replyNodes = constructComments(replies, handlers);
        const txt = formatText(text);

        return (
            <div className="media pull-left text-left">
                    <CommentProfile />
                    <div className="media-body">
                        <h5 className="media-heading"><strong>{fullname}</strong> <PostedOn postedOn={postedOn} /></h5>
                        <span dangerouslySetInnerHTML={txt}></span>
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
        return timeText(postedOn);
    }

    render() {
        return (<small>sagde {this.ago()}</small>);
    }
}
