/// <reference path="../../interfaces/globals.d.ts" />
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Grid, Navbar, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { Root } from "../../interfaces/State";
import { Error } from "../containers/Error";
import { clearError } from "../../actions/error";
import { NavLink, IndexNavLink } from "../wrappers/Links";
import { Components as C } from "../../interfaces/Components";

interface StateToProps extends C.HasErrorProp, C.UsernameProp {
    error: C.ErrorState;
}

interface DispatchToProps {
    clearError: Function;
}

const mapStateToProps = (state: Root) : StateToProps => {
    const user = state.usersInfo.users[state.usersInfo.currentUserId];
    const name = user ? user.FirstName : "User";
    return {
        username: name,
        hasError: state.statusInfo.hasError,
        error: state.statusInfo.errorInfo
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Root>) : DispatchToProps => {
    return {
        clearError: () => dispatch(clearError())
    };
};

class Shell extends React.Component<StateToProps & DispatchToProps, any> {
    errorView() {
        const { hasError, clearError, error } = this.props;
        const { title, message } = error;
        if (!hasError) return null;

        return  <Error
                    title={title}
                    message={message}
                    clearError={clearError} />;
    }

    render() {
        const { username } = this.props;
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
                                Hej, {username}!
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
                </Grid>;
    }
}

const Main = connect(mapStateToProps, mapDispatchToProps)(Shell);
export default Main;