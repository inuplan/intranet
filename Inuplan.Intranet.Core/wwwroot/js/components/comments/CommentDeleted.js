import React from 'react'

export class CommentDeleted extends React.Component {
    render() {
        const { replies, handlers, constructComments } = this.props;
        const replyNodes = constructComments(replies, handlers);
        return (
            <div className="media pull-left text-left">
                <div className="media-left" style={{minWidth: "74px"}}></div>
                <div className="media-body">
                    <small>slettet</small>
                    {replyNodes}
                </div>
            </div>
        );
    }
}