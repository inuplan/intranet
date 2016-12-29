import * as React from "react";
import { CommentProfile } from "../comments/CommentProfile";
import { WhatsNewTooltip } from "./WhatsNewTooltip";
import { Media } from "react-bootstrap";
import { timeText } from "../../utilities/utils";
import { Link } from "react-router";
import { Image, Glyphicon, Tooltip } from "react-bootstrap";
import { Data } from "../../interfaces/Data";

interface StateProps {
    on: Date;
    imageId: number;
    author: Data.User;
    filename: string;
    extension: string;
    thumbnail: string;
    description: string;
}

export class WhatsNewItemImage extends React.Component<StateProps, any> {
    when() {
        const { on } = this.props;
        return "uploadede " + timeText(on);
    }

    overlay() {
        return <Tooltip id="tooltip_img">Bruger billede</Tooltip>;
    }

    render() {
        const { imageId, author, filename, extension, thumbnail, description } = this.props;
        const username = author.Username;
        const file = `${filename}.${extension}`;
        const link = `${username}/gallery/image/${imageId}`;
        const name = `${author.FirstName} ${author.LastName}`;

        return  <WhatsNewTooltip tooltip="Uploadet billede">
                    <Media.ListItem className="whatsnewItem hover-shadow">
                            <CommentProfile />
                            <Media.Body>
                                <blockquote>
                                    <span className="image-whatsnew-descriptiontext">{description}</span><br />
                                    <Link to={link}>
                                        <Image src={thumbnail} thumbnail />
                                    </Link>
                                    <footer>{name} {this.when()}<br /><Glyphicon glyph="picture" /> {file}</footer>
                                </blockquote>
                            </Media.Body>
                    </Media.ListItem>
                </WhatsNewTooltip>;
    }
}