import React from 'react'
import { Media } from "react-bootstrap"

export class CommentDeleted extends React.Component {
    render() {
        const { replies, construct } = this.props;
        const replyNodes = replies.map(reply => construct(reply));

        return  <Media>
                    <Media.Left style={{ minWidth: "74px" }} />
                    <Media.Body>
                        <small>slettet</small>
                        {replyNodes}
                    </Media.Body>
                </Media>
    }
}