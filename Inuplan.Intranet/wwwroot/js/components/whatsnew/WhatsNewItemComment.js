import React from 'react'
import { CommentProfile } from '../comments/CommentProfile'
import { WhatsNewTooltip } from './WhatsNewTooltip'
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
        return  <WhatsNewTooltip tooltip="Kommentar">
                    <Media.ListItem className="whatsnewItem hover-shadow">
                        <CommentProfile />
                        <Media.Body>
                            <blockquote>
                                <Link to={link}><em><p dangerouslySetInnerHTML={summary}></p></em></Link>
                                <footer>{name} {this.when()}<br /><Glyphicon glyph="comment" /> {filename}</footer>
                            </blockquote>
                        </Media.Body>
                    </Media.ListItem>
                </WhatsNewTooltip>
    }
}
