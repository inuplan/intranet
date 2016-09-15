import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { find } from 'underscore'

const mapStateToProps = (state) => {
    const selected = state.forumInfo.titlesInfo.selectedThread;
    return {
        selected: selected,
        title: find(state.forumInfo.titlesInfo.titles, (title) => title.ID == selected),
        text: state.forumInfo.postContent,
        getAuthor: (id) => {
            const user = find(state.usersInfo.users, (user) => user.ID == id);
            return `${user.FirstName} ${user.LastName}`;
        },
    }
}

class ForumPostContainer extends React.Component {
    render() {
        const { selected, title, text, getAuthor } = this.props;
        if(selected < 0) return null;

        const author = getAuthor(title.AuthorID);
        return  <Row>
                    <Row>
                        <Col lg={12}>
                            <h3 className="text-capitalize">
                                {title.Title}<br />
                                <small>Skrevet af {author}</small>
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <p>
                                {text}
                            </p>
                        </Col>
                    </Row>
                </Row>
    }
}

export const ForumPost = connect(mapStateToProps, null)(ForumPostContainer);