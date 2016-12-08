import React from 'react'
import { Link, IndexLink } from 'react-router'
import { NavLink, IndexNavLink } from '../wrappers/Links'
import { Error } from '../containers/Error'
import { clearError } from '../../actions/error'
import { connect } from 'react-redux'
import { Grid, Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import { values } from 'underscore'

const mapStateToProps = (state) => {
    const user = values(state.usersInfo.users).filter(u => u.Username.toUpperCase() == globals.currentUsername.toUpperCase())[0];
    const name = user ? user.FirstName : 'User';
    return {
        hasError: state.statusInfo.hasError,
        error: state.statusInfo.errorInfo,
        name: name
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
        const { name } = this.props;
        const employeeUrl = globals.urls.employeeHandbook;
        const c5SearchUrl = globals.urls.c5Search;
        return  <Grid fluid={true}>
                    <Navbar fixedTop>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="http://intranetside" className="navbar-brand">Inuplan Intranet</a>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>

                        <Navbar.Collapse>
                            <Nav>
                                <IndexNavLink to="/">Forside</IndexNavLink>
                                <NavLink to="/forum">Forum</NavLink>
                                <NavLink to="/users">Brugere</NavLink>
                                <NavLink to="/about">Om</NavLink>                                
                            </Nav>

                            <Navbar.Text pullRight>
                                Hej, {name}!
                            </Navbar.Text>

                            <Nav pullRight>
                                <NavDropdown eventKey={5} title="Links" id="extern_links">
                                    <MenuItem href={employeeUrl} eventKey={5.1}>Medarbejder h&aring;ndbog</MenuItem>
                                    <MenuItem href={c5SearchUrl} eventKey={5.2}>C5 S&oslash;gning</MenuItem>
                                </NavDropdown>
                            </Nav>

                        </Navbar.Collapse>

                    </Navbar>
                        {this.errorView()}
                        {this.props.children}
                </Grid>
    }
}

const Main = connect(mapStateToProps, mapDispatchToProps)(Shell);
export default Main;
