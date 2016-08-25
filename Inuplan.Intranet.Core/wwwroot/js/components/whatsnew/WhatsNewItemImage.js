import React from 'react'
import { Media } from 'react-bootstrap'
import { CommentProfile } from '../comments/CommentProfile'
import { timeText } from '../../utilities/utils'
import { Link } from 'react-router'
import { Image } from 'react-bootstrap'

export class WhatsNewItemImage extends React.Component {
    when() {
        const { on } = this.props;
        return "uploadede " + timeText(on);
    }



    render() {
        const { imageId, commentId, author, filename, extension, thumbnail } = this.props;
        const username = author.Username;
        const file = `${filename}.${extension}`;
        const link = `${username}/gallery/image/${imageId}`
        const name = `${author.FirstName} ${author.LastName}`;

        return  <Media.ListItem>
                    <CommentProfile />
                    <Media.Body>
                        <h5 className="media-heading">{name} <small>{this.when()}</small></h5>

                        <Link to={link}>
                            <Image src={thumbnail} thumbnail />
                        </Link>
                    </Media.Body>
                </Media.ListItem>
    }
}