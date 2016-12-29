import * as React from "react";
import { Media, Glyphicon  } from "react-bootstrap";
import { Components } from "../../interfaces/Components";

export class CommentDeleted extends React.Component<Components.CommentDeleted, null> {
    render() {
        const { replies, construct } = this.props;
        const replyNodes = replies.map(reply => construct(reply));

        return  <Media>
                    <Media.Left className="comment-deleted-left" />
                    <Media.Body>
                        <p className="text-muted comment-deleted">
                            <span>
                                <Glyphicon glyph="remove-sign" /> Kommentar slettet
                            </span>
                        </p>
                        {replyNodes}
                    </Media.Body>
                </Media>;
    }
}