import React from 'react'
import { CommentProfile } from '../comments/CommentProfile'
import { WhatsNewTooltip } from './WhatsNewTooltip'
import { Media } from 'react-bootstrap'
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

        return  <WhatsNewTooltip tooltip="Uploadet billede">
                    <Media.ListItem className="whatsnewItem">
                        <CommentProfile />
                        <Media.Body>
                            <blockquote>
                                <Link to={link}>
                                    <Image src={thumbnail} thumbnail />
                                </Link>
                                <footer>{name} {this.when()}<br /><Glyphicon glyph="picture" /> {file}</footer>
                            </blockquote>
                        </Media.Body>
                    </Media.ListItem>
                </WhatsNewTooltip>
    }
}
