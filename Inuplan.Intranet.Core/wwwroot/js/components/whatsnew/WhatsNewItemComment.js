import React from 'react'
import { CommentProfile } from '../comments/CommentProfile'
import { formatText, getWords, timeText } from '../../utilities/utils'
import { Link } from 'react-router'
import { Media, Glyphicon } from 'react-bootstrap'

export class WhatsNewItemComment extends React.Component {
    createSummary() {
        const { text } = this.props;
        return formatText(getWords(text, 5) + "...");
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
        const { imageId, uploadedBy, commentId, author, filename } = this.props;
        const username = uploadedBy.Username;
        const name = this.fullname();
        const summary = this.createSummary();
        const link = `${username}/gallery/image/${imageId}/comment?id=${commentId}`
        return  <Media.ListItem className="whatsnewItem">
                    <Media.Left>
                        <span style={{ width: "64px", height: "64px" }}><Glyphicon glyph="triangle-right" />&nbsp;</span>
                    </Media.Left>
                    <Media.Body>
                        <Link to={link}><strong>L&aelig;s kommentar til {filename}</strong></Link>
                        <blockquote>
                            <p dangerouslySetInnerHTML={summary}></p>
                            <footer>{name} {this.when()}</footer>
                        </blockquote>
                    </Media.Body>
                </Media.ListItem>
    }
}
