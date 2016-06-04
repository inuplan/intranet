"use strict";

var UserBox = React.createClass({
    displayName: "UserBox",

    getInitialState: function getInitialState() {
        return {
            users: []
        };
    },
    loadUsers: function loadUsers() {
        $.ajax({
            url: this.props.usersUrl,
            method: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.setState({ users: data });
            }.bind(this)
        });
    },
    componentDidMount: function componentDidMount() {
        this.loadUsers();
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "page-header" },
                React.createElement(
                    "h1",
                    null,
                    "Inuplan's ",
                    React.createElement(
                        "small",
                        null,
                        "brugere"
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(UserList, { users: this.state.users })
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXNlcnMvVXNlckJveC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzVCLHFCQUFpQiwyQkFBWTtBQUN6QixlQUFPO0FBQ0gsbUJBQU87QUFESixTQUFQO0FBR0gsS0FMMkI7QUFNNUIsZUFBVyxxQkFBWTtBQUNuQixVQUFFLElBQUYsQ0FBTztBQUNILGlCQUFLLEtBQUssS0FBTCxDQUFXLFFBRGI7QUFFSCxvQkFBUSxLQUZMO0FBR0gsdUJBQVc7QUFDUCxpQ0FBaUI7QUFEVixhQUhSO0FBTUgscUJBQVMsVUFBVSxJQUFWLEVBQWdCO0FBQ3JCLHFCQUFLLFFBQUwsQ0FBYyxFQUFFLE9BQU8sSUFBVCxFQUFkO0FBQ0gsYUFGUSxDQUVQLElBRk8sQ0FFRixJQUZFO0FBTk4sU0FBUDtBQVVILEtBakIyQjtBQWtCNUIsdUJBQW1CLDZCQUFXO0FBQzFCLGFBQUssU0FBTDtBQUNILEtBcEIyQjtBQXFCNUIsWUFBUSxrQkFBWTtBQUNoQixlQUNJO0FBQUE7WUFBQTtZQUNJO0FBQUE7Z0JBQUEsRUFBSyxXQUFVLGFBQWY7Z0JBQ0k7QUFBQTtvQkFBQTtvQkFBQTtvQkFBYztBQUFBO3dCQUFBO3dCQUFBO0FBQUE7QUFBZDtBQURKLGFBREo7WUFJSTtBQUFBO2dCQUFBLEVBQUssV0FBVSxLQUFmO2dCQUNJLG9CQUFDLFFBQUQsSUFBVSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQTVCO0FBREo7QUFKSixTQURKO0FBU0g7QUEvQjJCLENBQWxCLENBQWQiLCJmaWxlIjoiY29tcG9uZW50cy91c2Vycy9Vc2VyQm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFVzZXJCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB1c2VyczogW11cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbG9hZFVzZXJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLnVzZXJzVXJsLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHVzZXJzOiBkYXRhIH0pO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMubG9hZFVzZXJzKCk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZS1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDE+SW51cGxhbidzIDxzbWFsbD5icnVnZXJlPC9zbWFsbD48L2gxPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxVc2VyTGlzdCB1c2Vycz17dGhpcy5zdGF0ZS51c2Vyc30gLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
