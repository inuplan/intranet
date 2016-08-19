import React from 'react'
import { CommentProfile } from '../comments/CommentProfile'
import { formatText, getWords, timeText } from '../../utilities/utils'

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
        const author = this.fullname();
        const summary = this.createSummary();
        return  <div>
                    <CommentProfile />
                    <div className="media-body">
                        <h5 className="media-heading">{author} <small>{this.when()}</small></h5>
                            <em><span dangerouslySetInnerHTML={summary}></span></em>
                            <a href="#">Se kommentar</a>
                    </div>
                    <br />
                </div>
    }
}
