import React from 'react'
import { CommentProfile } from '../comments/CommentProfile'
import { formatText, getWords, timeText } from '../../utilities/utils'
import { Link } from 'react-router'

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
        return  <div>
                    <CommentProfile />
                    <div className="media-body">
                        <h5 className="media-heading">{author} <small>{this.when()}</small></h5>
                            <em><span dangerouslySetInnerHTML={summary}></span></em>
                            <Link to={linkToImage}>Se billede, (hvor kommentaren er)</Link>
                    </div>
                    <br />
                </div>
    }
}
