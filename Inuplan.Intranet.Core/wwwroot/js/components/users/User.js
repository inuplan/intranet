"use strict";

var User = React.createClass({
    displayName: "User",

    render: function render() {
        var imageLink = "/image/usergallery/" + this.props.username;
        return React.createElement(
            "div",
            { className: "col-lg-3 panel panel-default", style: { paddingTop: "8px", paddingBottom: "8px" } },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    React.createElement(
                        "strong",
                        null,
                        "Brugernavn"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    this.props.username
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    React.createElement(
                        "strong",
                        null,
                        "Fornavn"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    this.props.firstName
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    React.createElement(
                        "strong",
                        null,
                        "Efternavn"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    this.props.lastName
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    React.createElement(
                        "strong",
                        null,
                        "Email"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    this.props.email
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    React.createElement(
                        "strong",
                        null,
                        "Billeder"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-lg-6" },
                    React.createElement(
                        "a",
                        { href: imageLink },
                        "Galleri"
                    )
                )
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXNlcnMvVXNlci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE9BQU8sTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ3pCLFlBQVEsa0JBQVk7QUFDaEIsWUFBSSxZQUFZLHdCQUF3QixLQUFLLEtBQUwsQ0FBVyxRQUFuRDtBQUNBLGVBQ0k7QUFBQTtZQUFBLEVBQUssV0FBVSw4QkFBZixFQUE4QyxPQUFPLEVBQUUsWUFBWSxLQUFkLEVBQXFCLGVBQWUsS0FBcEMsRUFBckQ7WUFDSTtBQUFBO2dCQUFBLEVBQUssV0FBVSxLQUFmO2dCQUNJO0FBQUE7b0JBQUEsRUFBSyxXQUFVLFVBQWY7b0JBQ0k7QUFBQTt3QkFBQTt3QkFBQTtBQUFBO0FBREosaUJBREo7Z0JBSUk7QUFBQTtvQkFBQSxFQUFLLFdBQVUsVUFBZjtvQkFDSyxLQUFLLEtBQUwsQ0FBVztBQURoQjtBQUpKLGFBREo7WUFTSTtBQUFBO2dCQUFBLEVBQUssV0FBVSxLQUFmO2dCQUNJO0FBQUE7b0JBQUEsRUFBSyxXQUFVLFVBQWY7b0JBQ0k7QUFBQTt3QkFBQTt3QkFBQTtBQUFBO0FBREosaUJBREo7Z0JBSUk7QUFBQTtvQkFBQSxFQUFLLFdBQVUsVUFBZjtvQkFDSyxLQUFLLEtBQUwsQ0FBVztBQURoQjtBQUpKLGFBVEo7WUFpQkk7QUFBQTtnQkFBQSxFQUFLLFdBQVUsS0FBZjtnQkFDSTtBQUFBO29CQUFBLEVBQUssV0FBVSxVQUFmO29CQUNJO0FBQUE7d0JBQUE7d0JBQUE7QUFBQTtBQURKLGlCQURKO2dCQUlJO0FBQUE7b0JBQUEsRUFBSyxXQUFVLFVBQWY7b0JBQ0ssS0FBSyxLQUFMLENBQVc7QUFEaEI7QUFKSixhQWpCSjtZQXlCSTtBQUFBO2dCQUFBLEVBQUssV0FBVSxLQUFmO2dCQUNJO0FBQUE7b0JBQUEsRUFBSyxXQUFVLFVBQWY7b0JBQ0k7QUFBQTt3QkFBQTt3QkFBQTtBQUFBO0FBREosaUJBREo7Z0JBSUk7QUFBQTtvQkFBQSxFQUFLLFdBQVUsVUFBZjtvQkFDSyxLQUFLLEtBQUwsQ0FBVztBQURoQjtBQUpKLGFBekJKO1lBaUNJO0FBQUE7Z0JBQUEsRUFBSyxXQUFVLEtBQWY7Z0JBQ0k7QUFBQTtvQkFBQSxFQUFLLFdBQVUsVUFBZjtvQkFDSTtBQUFBO3dCQUFBO3dCQUFBO0FBQUE7QUFESixpQkFESjtnQkFJSTtBQUFBO29CQUFBLEVBQUssV0FBVSxVQUFmO29CQUNJO0FBQUE7d0JBQUEsRUFBRyxNQUFNLFNBQVQ7d0JBQUE7QUFBQTtBQURKO0FBSko7QUFqQ0osU0FESjtBQTRDSDtBQS9Dd0IsQ0FBbEIsQ0FBWCIsImZpbGUiOiJjb21wb25lbnRzL3VzZXJzL1VzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgVXNlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbWFnZUxpbmsgPSBcIi9pbWFnZS91c2VyZ2FsbGVyeS9cIiArIHRoaXMucHJvcHMudXNlcm5hbWU7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctMyBwYW5lbCBwYW5lbC1kZWZhdWx0XCIgc3R5bGU9e3sgcGFkZGluZ1RvcDogXCI4cHhcIiwgcGFkZGluZ0JvdHRvbTogXCI4cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkJydWdlcm5hdm48L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5Gb3JuYXZuPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5maXJzdE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkVmdGVybmF2bjwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMubGFzdE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkVtYWlsPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5lbWFpbH1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+QmlsbGVkZXI8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2ltYWdlTGlua30+R2FsbGVyaTwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
