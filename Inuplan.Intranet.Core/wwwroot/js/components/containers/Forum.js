import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { Breadcrumb } from '../breadcrumbs/Breadcrumb'

export default class Forum extends React.Component {
    render() {
        return  <Row>
                    <Col lgOffset={2} lg={8}>
                        <h1>Forum <small>indl&aelig;g</small></h1>
                        <hr />
                        {this.props.children}
                    </Col>
                </Row>
    }
}
