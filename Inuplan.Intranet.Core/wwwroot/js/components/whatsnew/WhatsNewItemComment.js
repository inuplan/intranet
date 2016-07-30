import React from 'react'
import { CommentProfile } from '../comments/CommentProfile'
import { formatText, getWords } from '../../utilities/utils'

export class WhatsNewItemComment extends React.Component {
    render() {
        const { author, item } = this.props;
        const text = formatText("\"" + getWords(item.Text, 5) + "..." + "\"");
        const fullname = author.FirstName + ' ' + author.LastName;
        return  <div>
                    <CommentProfile />
                    <div className="media-body">
                        <h5 className="media-heading">{fullname} <small>sagde</small></h5>
                        <p>
                            <em><span dangerouslySetInnerHTML={text}></span></em>
                        </p>
                    </div>
                    <br />
                </div>
    }
}
