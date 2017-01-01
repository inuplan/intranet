import * as React from "react";
import { Row, Col, Glyphicon, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getWords } from "../../utilities/utils";
import { Link } from "react-router";
import { Data } from "../../interfaces/Data";

interface ComponentProps {
    title: Data.ForumTitle;
    getAuthor: (id: number) => string;
}

export class ForumTitle extends React.Component<ComponentProps, any> {
    dateView(date: Date) {
        const dayMonthYear = moment(date).format("D/MM/YY");
        return `${dayMonthYear}`;
    }

    modifiedView(modifiedOn: Date) {
        if (!modifiedOn) return null;
        const modifiedDate = moment(modifiedOn).format("D/MM/YY-H:mm");
        return `${modifiedDate}`;
    }

    tooltipView() {
        return  <Tooltip id="tooltip">Vigtig</Tooltip>;
    }

    stickyIcon(show: boolean) {
        if (!show) return null;
        return  <p className="sticky">
                    <OverlayTrigger placement="top" overlay={this.tooltipView()}>
                        <Glyphicon glyph="pushpin" />
                    </OverlayTrigger>
                </p>;
    }

    dateModifiedView(title: Data.ForumTitle) {
        const created = this.dateView(title.CreatedOn);
        const updated = this.modifiedView(title.LastModified);
        if (!updated) return <span>{created}</span>;

        return  <span>
                    {created}<br />
                    ({updated})
                </span>;
    }

    createSummary() {
        const { title } = this.props;
        if (!title.LatestComment) return "Ingen kommentarer";

        if (title.LatestComment.Deleted) return "Kommentar slettet";
        const text = title.LatestComment.Text;
        return getWords(text, 5);
    }

    render() {
        const { title, getAuthor } = this.props;
        const name = getAuthor(title.AuthorID);
        const latestComment  = this.createSummary();
        const css = title.Sticky ? "thread thread-pinned" : "thread";
        const path = `/forum/post/${title.ID}/comments`;

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
                            <p>{latestComment}</p>
                        </Col>
                    </Row>
                </Link>;
    }
}