import React from 'react'
import { Link } from 'react-router'
import { Row, Col } from 'react-bootstrap'

export class User extends React.Component {
    render() {
        const { username, firstName, lastName, email } = this.props;
        const emailLink = "mailto:" + email;
        const gallery = "/" + username + "/gallery";

        return  <Col lg={3}>
                    <UserItem title="Brugernavn">{username}</UserItem>
                    <UserItem title="Fornavn">{firstName}</UserItem>
                    <UserItem title="Efternavn">{lastName}</UserItem>
                    <UserItem title="Email"><a href={emailLink}>{email}</a></UserItem>
                    <UserItem title="Billeder"><Link to={gallery}>Billeder</Link></UserItem>
                </Col>
    }
}

class UserHeading extends React.Component {
    render() {
        return  <Col lg={6}>
                    <strong>{this.props.children}</strong>
                </Col>
    }
}

class UserBody extends React.Component {
    render() {
        return  <Col lg={6}>
                    {this.props.children}
                </Col>
    }
}

class UserItem extends React.Component {
    render() {
        const { title } = this.props;
        return  <Row>
                    <UserHeading>{title}</UserHeading>
                    <UserBody>{this.props.children}</UserBody>
                </Row>
    }
}