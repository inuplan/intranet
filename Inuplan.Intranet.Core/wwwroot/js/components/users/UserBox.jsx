var UserBox = React.createClass({
    getInitialState: function () {
        return {
            users: []
        }
    },
    loadUsers: function () {
        $.ajax({
            url: this.props.usersUrl,
            method: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.setState({ users: data });
            }.bind(this),
        });
    },
    componentDidMount: function() {
        this.loadUsers();
    },
    render: function () {
        return (
            <div>
                <div className="page-header">
                    <h1>Inuplan's <small>brugere</small></h1>
                </div>
                <div className="row">
                    <UserList users={this.state.users} />
                </div>
            </div>);
    }
});