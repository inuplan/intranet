import React from 'react'
import { connect } from 'react-redux'
import { User } from './User'
import { Row } from 'react-bootstrap'

export class UserList extends React.Component {
    userNodes() {
        const { users } = this.props;
        return users.map((user) => {
            const userId = `userId_${user.ID}`;
            return  <User
                          username={user.Username}
                          userId={user.ID}
                          firstName={user.FirstName}
                          lastName={user.LastName}
                          email={user.Email}
                          profileUrl={user.ProfileImage}
                          roles={user.Roles}
                          key={userId}
                      />
        });
    }

    render() {
        return  <Row>
                    {this.userNodes()}
                </Row>
    }
}