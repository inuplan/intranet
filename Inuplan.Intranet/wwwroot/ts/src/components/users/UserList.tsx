import * as React from 'react'
import { User } from './User'
import { Row } from 'react-bootstrap'
import { Components } from '../../interfaces/Components'

export class UserList extends React.Component<Components.userList, null> {
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
                          roles={user.Role}
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