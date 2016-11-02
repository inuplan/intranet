import React from 'react'
import { connect } from 'react-redux'
import WhatsNew from './WhatsNew'
import { ImageUpload } from '../images/ImageUpload'
import { uploadImage } from '../../actions/images'
import { fetchLatestNews } from '../../actions/whatsnew'
import { Jumbotron, Grid, Row, Col, Panel } from 'react-bootstrap'
import { values } from 'underscore'
import Chart from 'chart-js'

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
        const ctx = document.getElementById("myChart");
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
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
                            <Col lg={4}>
                                <canvas id="myChart" width="400" height="400" />
                            </Col>
                        </Row>
                    </Grid>
                </Row>
    }
}

const Home = connect(mapStateToProps, mapDispatchToProps)(HomeView)
export default Home
