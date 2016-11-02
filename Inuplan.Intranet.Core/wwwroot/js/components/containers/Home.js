﻿import React from 'react'
import { connect } from 'react-redux'
import WhatsNew from './WhatsNew'
import { ImageUpload } from '../images/ImageUpload'
import { uploadImage } from '../../actions/images'
import { fetchLatestNews } from '../../actions/whatsnew'
import { Jumbotron, Grid, Row, Col, Panel } from 'react-bootstrap'
import { values } from 'underscore'
import Chart from 'chart-js'
import { UsedSpaceView } from './UsedSpace'

const mapStateToProps = (state) => {
    const user = values(state.usersInfo.users).filter(u => u.Username.toUpperCase() == globals.currentUsername.toUpperCase())[0];
    const name = user ? user.FirstName : 'User';
    return {
        name: name,
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        uploadImage: (skip, take, username, formData) => {
            const onSuccess = () => {
                dispatch(fetchLatestNews(skip, take));
            };

            dispatch(uploadImage(username, formData, onSuccess, () => { }));
        }
    }
}

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.upload = this.upload.bind(this);
    }

    componentDidMount() {
        document.title = "Forside";
    }

    upload(username, formData) {
        const { uploadImage, skip, take } = this.props;
        uploadImage(skip, take, username, formData);
    }

    render() {
        const username = globals.currentUsername;
        const { name } = this.props;
        return  <Row>
                    <Jumbotron>
                        <h1><span>Velkommen <small>{name}!</small></span></h1>
                        <p className="lead">
                            Til Inuplans intranet side
                        </p>

                        <Row>
                            <Col lg={4}>
                                <Panel header={'Du kan uploade billeder til dit eget galleri her'} bsStyle="primary">
                                    <ImageUpload username={username} uploadImage={this.upload} />
                                </Panel>
                            </Col>
                        </Row>
                    </Jumbotron>
                    <Grid fluid>
                        <Row>
                            <Col lg={2}>
                            </Col>
                            <Col lg={4}>
                                <WhatsNew />
                            </Col>
                            <Col lgOffset={1} lg={3}>
                                <UsedSpaceView />
                            </Col>
                        </Row>
                    </Grid>
                </Row>
    }
}

const Home = connect(mapStateToProps, mapDispatchToProps)(HomeView)
export default Home
