import * as React from "react";
import { Navbar } from "react-bootstrap";

export class DashboardAdmin extends React.Component<null, null> {
    render() {
        return  <div>
                    <Navbar fixedTop>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="#" className="navbar-brand">Inuplan Intranet Admin</a>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>

                        <Navbar.Collapse>

                            <Navbar.Text pullRight>
                                Hej, {"{name}"}!
                            </Navbar.Text>
                        </Navbar.Collapse>

                    </Navbar>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-1 menu">
                                Menu
                            </div>
                            <div className="col-md-11 main">
                                Main
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>;
    }
}