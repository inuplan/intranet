import React from 'react'
import { Row, Col, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { timeText } from '../../utilities/utils'
import { Link } from 'react-router'

export class ForumTitle extends React.Component {
    dateView(date) {
        const dayMonthYear = moment(date).format("D MMMM YYYY");
        const time = moment(date).format("H:mm");
        return `${dayMonthYear}`;
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
                        <Col lg={2} className="text-center text-capitalize">
                            <p>{this.dateView(title.CreatedOn)}</p>
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