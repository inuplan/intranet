import * as React from 'react'
import { Components as C } from '../../interfaces/Components'
import { Jumbotron, Grid, Row, Col, Panel, Alert } from 'react-bootstrap'
import { globals } from '../../interfaces/General'
import { Root } from '../../interfaces/State'
import { connect, Dispatch } from 'react-redux'
import { fetchLatestNews } from '../../actions/whatsnew'
import { ImageUpload } from '../images/ImageUpload'
import { uploadImage } from '../../actions/images'

interface stateToProps extends C.UsernameProp {
    skip: number
    take: number
}

interface dispatchToProps {
    uploadImage: (skip: number, take: number, username: string, formData: FormData) => void
}

interface componentState {
    recommended: boolean
}

const mapStateToProps = (state:Root): stateToProps => {
    const user = state.usersInfo.users[state.usersInfo.currentUserId];
    const hasUser = state.usersInfo.currentUserId > 0 && Boolean(user.Username);
    const name = hasUser ? user.Username : "User";
    return {
        username: name,
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Root>): dispatchToProps => {
    return {
        uploadImage: (skip, take, username, formData) => {
            const onSuccess = () => {
                dispatch(fetchLatestNews(skip, take));
            }

            dispatch<any>(uploadImage(username, formData, onSuccess, (r) => { console.log(r); }));
        }
    }
}

class HomeView extends React.Component<stateToProps & dispatchToProps, componentState> {
    constructor(props: any) {
        super(props);
        this.state = {
            recommended: true
        }

        this.upload = this.upload.bind(this);
        this.recommendedView = this.recommendedView.bind(this);
    }

    componentDidMount() {
        document.title = "Forside";
    }

    upload(username: string, formData: FormData) {
        const { uploadImage, skip, take } = this.props;
        uploadImage(skip, take, username, formData);
    }

    recommendedView() {
        if(!this.state.recommended) return null;

        return  <Row>
                    <Col>
                        <Alert bsStyle="success" onDismiss={() => this.setState({ recommended: false })}>
                            <h4>Anbefalinger</h4>
                            <ul>
                                <li>Testet med Google Chrome browser. Derfor er det anbefalet at bruge denne til at f&aring; den fulde oplevelse.<br /></li>
                            </ul>
                        </Alert>
                    </Col>
                </Row>
    }

    render() {
        const username = globals.currentUsername;
        return  <Row>
                    <Jumbotron>
                        <h1><span>Velkommen <small>{username}!</small></span></h1>
                        <p className="lead">
                            Til Inuplans forum og billed-arkiv side
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
                                {/*<WhatsNew />*/}
                            </Col>
                            <Col lgOffset={1} lg={3}>
                                {this.recommendedView()}
                                <h3>Personlig upload forbrug</h3>
                                <hr />
                                <p>
                                    Herunder kan du se hvor meget plads du har brugt og hvor meget fri plads
                                    der er tilbage. Gælder kun billede filer.
                                </p>
                                {/*<UsedSpace />*/}
                            </Col>
                        </Row>
                    </Grid>
                </Row>
    }
}

const Home = connect(mapStateToProps, mapDispatchToProps)(HomeView)
export default Home;