import React from 'react'
import { Row, Col } from 'react-bootstrap'

export default class About extends React.Component {
    componentDidMount() {
        document.title = "Om";
    }

    render() {
        return  <Row>
                    <Col lgOffset={2} lg={8}>
                        <p>
                            Dette er en single page application!
                            <br />
                            Teknologier brugt:
                        </p>
                        <ul>
                            <li>React</li>
                            <li>Redux</li>
                            <li>React-Bootstrap</li>
                            <li>ReactRouter</li>
                            <li>Asp.net Core RC 2</li>
                            <li>Asp.net Web API 2</li>
                        </ul>
                    </Col>
                </Row>
    }
}