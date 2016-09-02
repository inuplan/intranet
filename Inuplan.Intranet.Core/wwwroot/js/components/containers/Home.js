import React from 'react'
import { connect } from 'react-redux'
import WhatsNew from './WhatsNew'
import { ImageUpload } from '../images/ImageUpload'
import { uploadImage } from '../../actions/images'
import { fetchLatestNews } from '../../actions/whatsnew'
import { Jumbotron, Grid, Row, Col, Panel } from 'react-bootstrap'

const mapStateToProps = (state) => {
    const user = state.usersInfo.users.filter(u => u.Username.toUpperCase() == globals.currentUsername.toUpperCase())[0];
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
            dispatch(uploadImage(username, formData));
            dispatch(fetchLatestNews(skip, take));
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
                    <Col lgOffset={2} lg={8}>
                        <Jumbotron>
                            <h1>Velkommen <small>{name}!</small></h1>
                            <p className="lead">
                                Til Inuplans intranet side
                            </p> 

                        </Jumbotron>

                        <Row>
                            <Col lg={12}>
                                <Panel header={'Du kan uploade billeder til dit eget galleri her'} bsStyle="primary">
                                    <ImageUpload username={username} uploadImage={this.upload} />
                                </Panel>
                            </Col>
                        </Row>

                        <WhatsNew />
                    </Col>
                </Row>
    }
}

const Home = connect(mapStateToProps, mapDispatchToProps)(HomeView)
export default Home