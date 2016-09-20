import React from 'react'
import { Row, Col, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { timeText } from '../../utilities/utils'
import { Link } from 'react-router'

export class ForumTitle extends React.Component {
    dateView(date) {
        const dayMonthYear = moment(date).format("D/MM/YY");
        return `${dayMonthYear}`;
    }

    modifiedView(modifiedOn) {
        if(!modifiedOn) return null;
        const modifiedDate = moment(modifiedOn).format("D/MM/YY-H:mm");
        return `${modifiedDate}`;
    }

    tooltipView() {
        return  <Tooltip id="tooltip">Vigtig</Tooltip>
    }

    stickyIcon(show) {
        if(!show) return null;
        return  <p className="sticky">
                    <OverlayTrigger placement="top" overlay={this.tooltipView()}>
                        <Glyphicon glyph="pushpin" />
                    </OverlayTrigger>
                </p>
    }

    dateModifiedView(title) {
        const created = this.dateView(title.CreatedOn);
        const updated = this.modifiedView(title.LastModified);
        if(!updated) return <span>{created}</span>

        const updateText = `${updated}`;
        return  <span>
                    {created}<br />
                    ({updated})
                </span>
    }

    render() {
        const { title, getAuthor, onClick } = this.props;
        const name = getAuthor(title.AuthorID);
        const commentDate = title.LatestComment ? TimeText(title.LatestComment) : 'Ingen kommentarer';
        const css = title.Sticky ? "thread thread-pinned" : "thread";
        const path = `/forum/post/${title.ID}`;

        return  <Link to={path}>
                    <Row className={css}>
                        <Col lg={1} className="text-center">{this.stickyIcon(title.Sticky)}</Col>
                        <Col lg={5}>
                            <h4><span className="text-capitalize">{title.Title}</span></h4>
                            <small>Af: {name}</small>
                        </Col>
                        <Col lg={2} className="text-left">
                            <p>{this.dateModifiedView(title)}</p>
                        </Col>
                        <Col lg={2} className="text-center">
                            <p>{title.ViewedBy.length}</p>
                        </Col>
                        <Col lg={2} className="text-center">
                            <p>{commentDate}</p>
                        </Col>
                    </Row>
                </Link>
    }
}