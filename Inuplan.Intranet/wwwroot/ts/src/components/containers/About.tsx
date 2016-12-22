import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { Breadcrumb } from '../breadcrumbs/Breadcrumb'

export default class About extends React.Component<null, null> {
    componentDidMount() {
        document.title = "Om";
    }

    render() {
        return  <Row>
                    <Row>
                        <Col lgOffset={2} lg={8}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">
                                    Forside
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active>
                                    Om
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
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