import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { find } from 'underscore'
import { getFullName } from '../../utilities/utils'

const mapStateToProps = (state) => {
    const selected = state.forumInfo.titlesInfo.selectedThread;
    return {
        selected: selected,
        title: find(state.forumInfo.titlesInfo.titles, (title) => title.ID == selected),
        text: state.forumInfo.postContent,
        getUser: (id) => state.usersInfo.users[id],
    }
}

class ForumPostContainer extends React.Component {
    render() {
        const { selected, title, text, getUser } = this.props;
        if(selected < 0) return null;

        const user = getUser(title.AuthorID);
        const author = getFullName(user);
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
                    <Row>
                        <Col lg={12}>
                            {this.props.children}
                        </Col>
                    </Row>
                </Row>
    }
}

export const ForumPost = connect(mapStateToProps, null)(ForumPostContainer);