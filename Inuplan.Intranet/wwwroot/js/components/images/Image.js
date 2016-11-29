import React from 'react'
import { Link } from 'react-router'
import { Row, Col, Image as ImageBs } from 'react-bootstrap'

export class Image extends React.Component {
    constructor(props) {
        super(props);
        this.checkboxHandler = this.checkboxHandler.bind(this);
    }

    checkboxHandler(e) {
        const { image } = this.props;
        const add = e.currentTarget.checked;
        if(add) {
            const { addSelectedImageId } = this.props;
            addSelectedImageId(image.ImageID);
        }
        else {
            const { removeSelectedImageId } = this.props;
            removeSelectedImageId(image.ImageID);
        }
    }

    commentIcon(count) {
        const style = count == 0 ? "col-lg-6 text-muted" : "col-lg-6 text-primary";
        const props = {
            className: style
        };

        return  <div {... props}>
                    <span className="glyphicon glyphicon-comment" aria-hidden="true"></span> {count}
                </div>
    }

    checkboxView() {
        const { canEdit, imageIsSelected, image } = this.props;
        const checked = imageIsSelected(image.ImageID);
        return (canEdit ?
            <Col lg={6} className="pull-right text-right">
                <label>
                    Slet <input type="checkbox" onClick={this.checkboxHandler} checked={checked} />
                </label>
            </Col>
            : null);
    }

render() {
    const { image, username } = this.props;
    let count = image.CommentCount;
    const url = `/${username}/gallery/image/${image.ImageID}/comments`;
    return  <div>
                <Link to={url}>
                    <ImageBs src={image.PreviewUrl} thumbnail />
                </Link>
                <Row>
                    <Link to={url}>
                        {this.commentIcon(count)}
                    </Link>
                    {this.checkboxView()}
                </Row>
            </div>
    }
}
