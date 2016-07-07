import React from 'react'
import { Link, IndexLink } from 'react-router'
import { NavLink, IndexNavLink } from './wrappers/Links'
import { Error } from './containers/Error'
import { clearError } from '../actions/error'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        hasError: state.statusInfo.hasError,
        error: state.statusInfo.errorInfo
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearError: () => dispatch(clearError())
    }
}

class Shell extends React.Component {
    errorView() {
        const { hasError, clearError, error } = this.props;
        const { title, message } = error;
        return (hasError ?
            <Error
                title={title}
                message={message}
                clearError={clearError}
            />
            : null);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <Link to="/" className="navbar-brand">Inuplan Intranet</Link>
                        </div>
                        <div className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <IndexNavLink to="/">Forside</IndexNavLink>
                                <NavLink to="/users">Brugere</NavLink>
                                <NavLink to="/about">Om</NavLink>
                            </ul>
                            <p className="nav navbar-text navbar-right">Hej, {globals.currentUsername}!</p>
                        </div>
                    </div>
                </div>
                {this.errorView()}
                {this.props.children}
            </div>
        );
    }
}

const Main = connect(mapStateToProps, mapDispatchToProps)(Shell);
export default Main;