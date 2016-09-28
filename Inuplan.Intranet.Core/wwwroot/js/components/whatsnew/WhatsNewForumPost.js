import React from 'react'
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

    stickyView() {
        const { sticky } = this.props;
        if(!sticky) return null;
        return  <span><Glyphicon glyph="pushpin" /></span>
    }

    overlay() {
        const { commentCount } = this.props;
        return <Tooltip id="tooltip_post">Forum indl&aelig;g, antal kommentarer: {commentCount}</Tooltip>
    }

    render() {
        const { author, title, text, sticky, postId } = this.props;
        const name = this.fullname();
        const link = `forum/post/${postId}/comments`;
        return  <Media.ListItem className="whatsnewItem">
                    <Media.Left>
                        <span style={{ width: "64px", height: "64px" }}><Glyphicon glyph="triangle-right" />&nbsp;</span>
                        <OverlayTrigger placement="left" overlay={this.overlay()}>
                            <p><Glyphicon glyph="list-alt" />&nbsp;</p>
                        </OverlayTrigger>
                    </Media.Left>
                    <Media.Body>
                        <Link to={link}>
                            <strong >{this.stickyView()} Indl&aelig;g overskrift: <span className="text-capitalize">{title}</span></strong><br />
                        </Link>
                        <blockquote>
                            <p>{this.summary()}...</p>
                            <footer>{name} {this.when()}</footer>
                        </blockquote>
                    </Media.Body>
                </Media.ListItem>
    }
}
