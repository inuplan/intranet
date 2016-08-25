import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'

export class Error extends React.Component {
    render() {
        const { clearError, title, message  } = this.props;
        return  <Row>
                    <Col lgOffset={2} lg={8}>
                        <Alert bsStyle="danger" onDismiss={clearError}>
                            <strong>{title}</strong>
                            <p>{message}</p>
                        </Alert>
                    </Col>
                </Row>
    }
}