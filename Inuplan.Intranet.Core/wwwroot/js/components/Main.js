﻿import React from 'react'
import { Link, IndexLink } from 'react-router'
import { NavLink, IndexNavLink } from './wrappers/Links'
import { Error } from './containers/Error'
import { clearError } from '../actions/error'
import { connect } from 'react-redux'
import { Grid, Row, Col, Navbar, Nav, NavItem } from 'react-bootstrap'

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
        return  <Grid fluid={true}>
                    <Navbar>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <Link to="/" className="navbar-brand">Inuplan Intranet</Link>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>

                        <Navbar.Collapse>
                            <Nav>
                                <IndexNavLink to="/">Forside</IndexNavLink>
                                <NavLink to="/users">Brugere</NavLink>
                                <NavLink to="/about">Om</NavLink>                                
                            </Nav>
                            <Navbar.Text pullRight>
                                Hej, {globals.currentUsername}!
                            </Navbar.Text>
                        </Navbar.Collapse>

                    </Navbar>
                        {this.errorView()}
                        {this.props.children}
                </Grid>
    }
}

const Main = connect(mapStateToProps, mapDispatchToProps)(Shell);
export default Main;