import React from 'react'
import { connect } from 'react-redux'
import { fetchUsers } from '../../actions/users'
import { UserList } from '../users/UserList'
import { Row, Col, PageHeader } from 'react-bootstrap'
import { Breadcrumb } from '../breadcrumbs/Breadcrumb'

const mapUsersToProps = (state) => {
    return {
        users: state.usersInfo.users
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUsers: () => {
            dispatch(fetchUsers());
        }
    };
}

class UsersContainer extends React.Component {
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
                </Row>
    }
}

const Users = connect(mapUsersToProps, mapDispatchToProps)(UsersContainer)
export default Users