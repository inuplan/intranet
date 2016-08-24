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
        const { imageId, uploadedBy } = this.props;
        const author = this.fullname();
        const summary = this.createSummary();
        const linkToImage = uploadedBy.Username + "/gallery/image/" + imageId;
        return  <Media.ListItem>
                    <CommentProfile />
                    <Media.Body>
                        <h5 className="media-heading">{author} <small>{this.when()}</small></h5>
                            <em><span dangerouslySetInnerHTML={summary}></span></em>
                            <Link to={linkToImage}>Se kommentar</Link>
                    </Media.Body>
                </Media.ListItem>
    }
}
