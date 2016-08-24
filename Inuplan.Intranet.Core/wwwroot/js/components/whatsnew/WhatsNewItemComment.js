import React from 'react'
import { CommentProfile } from '../comments/CommentProfile'
import { formatText, getWords, timeText } from '../../utilities/utils'
import { Link } from 'react-router'
import { Media } from 'react-bootstrap'

export class WhatsNewItemComment extends React.Component {
    createSummary() {
        const { text } = this.props;
        return formatText("\"" + getWords(text, 5) + "..." + "\"");
    }

    fullname() {
        const { author } = this.props;
        return author.FirstName + ' ' + author.LastName;
    }

    when() {
        const { on } = this.props;
        return "sagde " + timeText(on);
    }

    render() {
        const { imageId, uploadedBy, commentId, author } = this.props;
        const username = uploadedBy.Username;
        const name = this.fullname();
        const summary = this.createSummary();
        const link = `${username}/gallery/image/${imageId}/comment?id=${commentId}`
        return  <Media.ListItem>
                    <CommentProfile />
                    <Media.Body>
                        <h5 className="media-heading">{name} <small>{this.when()}</small></h5>
                            <em><span dangerouslySetInnerHTML={summary}></span></em>
                            <Link to={link}>Se kommentar</Link>
                    </Media.Body>
                </Media.ListItem>
    }
}
