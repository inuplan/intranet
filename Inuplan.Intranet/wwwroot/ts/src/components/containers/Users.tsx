import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { fetchUsers } from "../../actions/users";
import { UserList } from "../users/UserList";
import { Row, Col, PageHeader } from "react-bootstrap";
import { Breadcrumb } from "../breadcrumbs/Breadcrumb";
import { values } from "underscore";
import { Root } from "../../interfaces/State";
import { Data } from "../../interfaces/Data";

interface StateToProps {
    users: Data.User[];
}

interface DispatchToProps {
    getUsers: () => void;
}

const mapUsersToProps = (state: Root): StateToProps => {
    return {
        users: values(state.usersInfo.users) as Data.User[]
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Root>) => {
    return {
        getUsers: () => {
            dispatch<any>(fetchUsers());
        }
    };
};

class UsersContainer extends React.Component<StateToProps & DispatchToProps, null> {
    componentDidMount() {
        document.title = "Brugere";
    }

    render() {
        const { users } = this.props;
        return  <Row>
                    <Row>
                        <Col lgOffset={2} lg={8}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">
                                    Forside
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active>
                                    Brugere
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                    <Col lgOffset={2} lg={8}>
                        <PageHeader>
                            Inuplan's <small>brugere</small>
                        </PageHeader>
                        <Row>
                            <UserList users={users} />
                        </Row>
                    </Col>
                </Row>;
    }
}

const Users = connect(mapUsersToProps, mapDispatchToProps)(UsersContainer);
export default Users;