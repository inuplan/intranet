import React from 'react'
import { Media } from 'react-bootstrap'
import { CommentProfile } from '../comments/CommentProfile'
import { timeText } from '../../utilities/utils'
import { Link } from 'react-router'
import { Image, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap'

export class WhatsNewItemImage extends React.Component {
    when() {
        const { on } = this.props;
        return "uploadede " + timeText(on);
    }

    overlay() {
        return <Tooltip id="tooltip_img">Bruger billede</Tooltip>
    }

    render() {
        const { imageId, commentId, author, filename, extension, thumbnail } = this.props;
        const username = author.Username;
        const file = `${filename}.${extension}`;
        const link = `${username}/gallery/image/${imageId}`
        const name = `${author.FirstName} ${author.LastName}`;

        return  <Media.ListItem className="whatsnewItem">
                    <Media.Left>
                        <span style={{ width: "64px", height: "64px" }}><Glyphicon glyph="triangle-right" />&nbsp;</span>
                        <OverlayTrigger placement="left" overlay={this.overlay()}>
                            <p><Glyphicon glyph="picture" />&nbsp;</p>
                        </OverlayTrigger>
                    </Media.Left>
                    <Media.Body>
                        <Link to={link}>
                            <strong>Se billede: {file}</strong>
                        </Link>
                        <blockquote>
                            <Link to={link}>
                                <Image src={thumbnail} thumbnail />
                            </Link>
                            <footer>{name} {this.when()}</footer>
                        </blockquote>
                    </Media.Body>
                </Media.ListItem>
    }
}
