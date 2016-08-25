import React from 'react'
import { connect } from 'react-redux'
import { fetchUsers } from '../../actions/users'
import { UserList } from '../users/UserList'
import { Row, Col, PageHeader } from 'react-bootstrap'

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