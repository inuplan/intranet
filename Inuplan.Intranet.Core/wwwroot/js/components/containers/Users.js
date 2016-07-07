import React from 'react'
import { connect } from 'react-redux'
import { fetchUsers } from '../../actions/users'
import { UserList } from '../users/UserList'

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
        this.props.getUsers();
    }

    render() {
        const { users } = this.props;
        return (
            <div className="row">
                <div className="col-lg-offset-2 col-lg-8">
                    <div className="page-header">
                        <h1>Inuplan's <small>brugere</small></h1>
                    </div>
                    <div className="row">
                        <UserList users={users} />
                    </div>
                </div>
            </div>);
    }
}

const Users = connect(mapUsersToProps, mapDispatchToProps)(UsersContainer)
export default Users
