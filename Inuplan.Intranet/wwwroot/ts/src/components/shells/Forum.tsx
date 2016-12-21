import * as React from 'react'
import { Row, Col } from 'react-bootstrap'

export default class Forum extends React.PureComponent<null, null> {
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
