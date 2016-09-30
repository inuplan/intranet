import React from 'react'
import { WhatsNewTooltip } from './WhatsNewTooltip'
import { CommentProfile } from '../comments/CommentProfile'
import { formatText, getWords, timeText } from '../../utilities/utils'
import { Link } from 'react-router'
import { Media, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap'

export class WhatsNewForumPost extends React.Component {
    fullname() {
        const { author } = this.props;
        return author.FirstName + ' ' + author.LastName;
    }

    when() {
        const { on } = this.props;
        return "indlæg " + timeText(on);
    }

    summary() {
        const { text } = this.props;
        return getWords(text, 5);
    }

    overlay() {
        const { commentCount } = this.props;
        return <Tooltip id="tooltip_post">Forum indl&aelig;g, antal kommentarer: {commentCount}</Tooltip>
    }

    render() {
        const { title, postId } = this.props;
        const name = this.fullname();
        const link = `forum/post/${postId}/comments`;
         return <WhatsNewTooltip tooltip="Forum indlæg">
                    <Media.ListItem className="whatsnewItem">
                        <CommentProfile />
                        <Media.Body>
                            <blockquote>
                                <Link to={link}><p>{this.summary()}...</p></Link>
                                <footer>{name} {this.when()}<br /><Glyphicon glyph="list-alt" /> {title}</footer>
                            </blockquote>
                        </Media.Body>
                    </Media.ListItem>
                </WhatsNewTooltip>
    }
}
