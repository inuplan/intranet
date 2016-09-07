import React from 'react'
import { Media, Glyphicon  } from "react-bootstrap"

export class CommentDeleted extends React.Component {
    render() {
        const { replies, construct } = this.props;
        const replyNodes = replies.map(reply => construct(reply));

        return  <Media>
                    <Media.Left style={{ minWidth: "74px" }} />
                    <Media.Body>
                        <p className="text-muted comment-deleted">
                            <span>
                                <Glyphicon glyph="remove-sign" /> Kommentar slettet
                            </span>
                        </p>
                        {replyNodes}
                    </Media.Body>
                </Media>
    }
}