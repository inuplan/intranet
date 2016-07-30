import React from 'react'
import { connect } from 'react-redux'
import WhatsNew from './WhatsNew'

const mapStateToProps = (state) => {
    return {
        user: state.usersInfo.users.filter(u => u.Username.toUpperCase() == globals.currentUsername.toUpperCase())[0],
    }
}

class HomeView extends React.Component {
    componentDidMount() {
        document.title = "Forside";
    }

    render() {
        const { user, latestItems } = this.props;
        const name = user ? user.FirstName : 'User';
        return (
            <div className="row">
                <div className="col-lg-offset-2 col-lg-8">
                    <div className="jumbotron">
                        <h1>Velkommen <small>{name}!</small></h1>
                        <p className="lead">
                            Til Inuplans intranet side
                        </p>
                    </div>
                    <WhatsNew />
                </div>
            </div>
        );
    }
}

const Home = connect(mapStateToProps, null)(HomeView)
export default Home