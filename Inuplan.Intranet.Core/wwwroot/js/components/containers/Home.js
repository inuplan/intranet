import React from 'react'
import { connect } from 'react-redux'
import WhatsNew from './WhatsNew'
import { Jumbotron, Grid, Row, Col } from 'react-bootstrap'

const mapStateToProps = (state) => {
    const user = state.usersInfo.users.filter(u => u.Username.toUpperCase() == globals.currentUsername.toUpperCase())[0];
    const name = user ? user.FirstName : 'User';
    return {
        name: name
    }
}

class HomeView extends React.Component {
    componentDidMount() {
        document.title = "Forside";
    }

    render() {
        const { name } = this.props;
        return  <Row>
                    <Col lgOffset={2} lg={8}>
                        <Jumbotron>
                            <h1>Velkommen <small>{name}!</small></h1>
                            <p className="lead">
                                Til Inuplans intranet side
                            </p> 
                        </Jumbotron>
                        <WhatsNew />
                    </Col>
                </Row>
    }
}

const Home = connect(mapStateToProps, null)(HomeView)
export default Home