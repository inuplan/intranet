import * as React from 'react';
import { Jumbotron, Grid, Row, Col, Panel, Alert } from 'react-bootstrap';
import { globals } from '../../interfaces/General';
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    const user = state.usersInfo.users[state.usersInfo.currentUserId];
    const hasUser = state.usersInfo.currentUserId > 0 && Boolean(user.Username);
    const name = hasUser ? user.Username : "User";
    return {
        username: name,
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        uploadImage: (skip, take, username, formData) => {
            console.log(dispatch, skip, take, username, formData);
            // const onSuccess = () => {
            //     dispatch(fetchLatestNews(skip, take));
            // }
            // dispatch/uploadImage(username, formData, onSuccess, () => { });
        }
    };
};
class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recommended: true
        };
        this.upload = this.upload.bind(this);
        this.recommendedView = this.recommendedView.bind(this);
    }
    componentDidMount() {
        document.title = "Forside";
    }
    upload(username, formData) {
        const { uploadImage, skip, take } = this.props;
        uploadImage(skip, take, username, formData);
    }
    recommendedView() {
        if (!this.state.recommended)
            return null;
        return <Row>
                    <Col>
                        <Alert bsStyle="success" onDismiss={() => this.setState({ recommended: false })}>
                            <h4>Anbefalinger</h4>
                            <ul>
                                <li>Testet med Google Chrome browser. Derfor er det anbefalet at bruge denne til at f&aring; den fulde oplevelse.<br /></li>
                            </ul>
                        </Alert>
                    </Col>
                </Row>;
    }
    render() {
        const username = globals.currentUsername;
        return <Row>
                    <Jumbotron>
                        <h1><span>Velkommen <small>{username}!</small></span></h1>
                        <p className="lead">
                            Til Inuplans forum og billed-arkiv side
                        </p>

                        <Row>
                            <Col lg={4}>
                                <Panel header={'Du kan uploade billeder til dit eget galleri her'} bsStyle="primary">
                                    
                                </Panel>
                            </Col>
                        </Row>
                    </Jumbotron>
                    <Grid fluid>
                        <Row>
                            <Col lg={2}>
                            </Col>
                            <Col lg={4}>
                                
                            </Col>
                            <Col lgOffset={1} lg={3}>
                                {this.recommendedView()}
                                <h3>Personlig upload forbrug</h3>
                                <hr />
                                <p>
                                    Herunder kan du se hvor meget plads du har brugt og hvor meget fri plads
                                    der er tilbage. Gælder kun billede filer.
                                </p>
                                
                            </Col>
                        </Row>
                    </Grid>
                </Row>;
    }
}
const Home = connect(mapStateToProps, mapDispatchToProps)(HomeView);
export default Home;
