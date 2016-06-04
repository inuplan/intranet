var UserList = React.createClass({
    render: function () {
        var users = this.props.users.map(function (user) {
            return (<User
                          username={user.Username}
                          userId={user.ID}
                          screenName={user.DisplayName}
                          firstName={user.FirstName}
                          lastName={user.LastName}
                          email={user.Email}
                          profileUrl={user.ProfileImage}
                          roles={user.Roles}
                          key={user.ID}
                      />);
        });
        return (
            <div className="row">
                {users}
            </div>)
    },
});