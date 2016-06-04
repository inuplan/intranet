"use strict";

var UserList = React.createClass({
    displayName: "UserList",

    render: function render() {
        var users = this.props.users.map(function (user) {
            return React.createElement(User, {
                username: user.Username,
                userId: user.ID,
                screenName: user.DisplayName,
                firstName: user.FirstName,
                lastName: user.LastName,
                email: user.Email,
                profileUrl: user.ProfileImage,
                roles: user.Roles,
                key: user.ID
            });
        });
        return React.createElement(
            "div",
            { className: "row" },
            users
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXNlcnMvVXNlckxpc3QuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUM3QixZQUFRLGtCQUFZO0FBQ2hCLFlBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEdBQWpCLENBQXFCLFVBQVUsSUFBVixFQUFnQjtBQUM3QyxtQkFBUSxvQkFBQyxJQUFEO0FBQ00sMEJBQVUsS0FBSyxRQURyQjtBQUVNLHdCQUFRLEtBQUssRUFGbkI7QUFHTSw0QkFBWSxLQUFLLFdBSHZCO0FBSU0sMkJBQVcsS0FBSyxTQUp0QjtBQUtNLDBCQUFVLEtBQUssUUFMckI7QUFNTSx1QkFBTyxLQUFLLEtBTmxCO0FBT00sNEJBQVksS0FBSyxZQVB2QjtBQVFNLHVCQUFPLEtBQUssS0FSbEI7QUFTTSxxQkFBSyxLQUFLO0FBVGhCLGNBQVI7QUFXSCxTQVpXLENBQVo7QUFhQSxlQUNJO0FBQUE7WUFBQSxFQUFLLFdBQVUsS0FBZjtZQUNLO0FBREwsU0FESjtBQUlIO0FBbkI0QixDQUFsQixDQUFmIiwiZmlsZSI6ImNvbXBvbmVudHMvdXNlcnMvVXNlckxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgVXNlckxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdXNlcnMgPSB0aGlzLnByb3BzLnVzZXJzLm1hcChmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxVc2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXIuVXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkPXt1c2VyLklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmVlbk5hbWU9e3VzZXIuRGlzcGxheU5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lPXt1c2VyLkZpcnN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TmFtZT17dXNlci5MYXN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbD17dXNlci5FbWFpbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlVXJsPXt1c2VyLlByb2ZpbGVJbWFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlcz17dXNlci5Sb2xlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3VzZXIuSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAvPik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIHt1c2Vyc31cclxuICAgICAgICAgICAgPC9kaXY+KVxyXG4gICAgfSxcclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
