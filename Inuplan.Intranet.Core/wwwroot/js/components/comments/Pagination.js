"use strict";

var Pagination = React.createClass({
    displayName: "Pagination",

    getPage: function getPage(p) {
        this.props.getPage(p);
    },
    prevView: function prevView() {
        var hasPrev = !(this.props.currentPage === 1);
        if (hasPrev) return React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { href: "#", "aria-label": "Previous", onClick: this.props.prev },
                React.createElement(
                    "span",
                    { "aria-hidden": "true" },
                    "«"
                )
            )
        );else return React.createElement(
            "li",
            { className: "disabled" },
            React.createElement(
                "a",
                { href: "#", "aria-label": "Previous" },
                React.createElement(
                    "span",
                    { "aria-hidden": "true" },
                    "«"
                )
            )
        );
    },
    nextView: function nextView() {
        var hasNext = !(this.props.totalPages === this.props.currentPage) && !(this.props.totalPages === 0);
        if (hasNext) return React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { href: "#", "aria-label": "Next", onClick: this.props.next },
                React.createElement(
                    "span",
                    { "aria-hidden": "true" },
                    "»"
                )
            )
        );else return React.createElement(
            "li",
            { className: "disabled" },
            React.createElement(
                "a",
                { href: "#", "aria-label": "Next" },
                React.createElement(
                    "span",
                    { "aria-hidden": "true" },
                    "»"
                )
            )
        );
    },
    render: function render() {
        var pages = [];
        for (var i = 1; i <= this.props.totalPages; i++) {
            var key = this.props.imageId + i;
            if (i === this.props.currentPage) {
                pages.push(React.createElement(
                    "li",
                    { className: "active", key: key },
                    React.createElement(
                        "a",
                        { href: "#", key: key },
                        i
                    )
                ));
            } else {
                pages.push(React.createElement(
                    "li",
                    { key: key, onClick: this.getPage.bind(this, i) },
                    React.createElement(
                        "a",
                        { href: "#", key: key },
                        i
                    )
                ));
            }
        }

        var show = pages.length > 0;
        return show ? React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "col-lg-offset-1 col-lg-9" },
                React.createElement(
                    "nav",
                    null,
                    React.createElement(
                        "ul",
                        { className: "pagination" },
                        this.prevView(),
                        pages,
                        this.nextView()
                    )
                )
            )
        ) : null;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvUGFnaW5hdGlvbi5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQy9CLGFBQVMsaUJBQVUsQ0FBVixFQUFhO0FBQ2xCLGFBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsQ0FBbkI7QUFDSCxLQUg4QjtBQUkvQixjQUFVLG9CQUFXO0FBQ2pCLFlBQUksVUFBVSxFQUFFLEtBQUssS0FBTCxDQUFXLFdBQVgsS0FBMkIsQ0FBN0IsQ0FBZDtBQUNBLFlBQUksT0FBSixFQUNJLE9BQ0k7QUFBQTtZQUFBO1lBQ0U7QUFBQTtnQkFBQSxFQUFHLE1BQUssR0FBUixFQUFZLGNBQVcsVUFBdkIsRUFBa0MsU0FBUyxLQUFLLEtBQUwsQ0FBVyxJQUF0RDtnQkFDRTtBQUFBO29CQUFBLEVBQU0sZUFBWSxNQUFsQjtvQkFBQTtBQUFBO0FBREY7QUFERixTQURKLENBREosS0FRSSxPQUNJO0FBQUE7WUFBQSxFQUFJLFdBQVUsVUFBZDtZQUNFO0FBQUE7Z0JBQUEsRUFBRyxNQUFLLEdBQVIsRUFBWSxjQUFXLFVBQXZCO2dCQUNFO0FBQUE7b0JBQUEsRUFBTSxlQUFZLE1BQWxCO29CQUFBO0FBQUE7QUFERjtBQURGLFNBREo7QUFNUCxLQXBCOEI7QUFxQi9CLGNBQVUsb0JBQVc7QUFDakIsWUFBSSxVQUFVLEVBQUUsS0FBSyxLQUFMLENBQVcsVUFBWCxLQUEwQixLQUFLLEtBQUwsQ0FBVyxXQUF2QyxLQUF1RCxFQUFFLEtBQUssS0FBTCxDQUFXLFVBQVgsS0FBMEIsQ0FBNUIsQ0FBckU7QUFDQSxZQUFHLE9BQUgsRUFDSSxPQUNJO0FBQUE7WUFBQTtZQUNFO0FBQUE7Z0JBQUEsRUFBRyxNQUFLLEdBQVIsRUFBWSxjQUFXLE1BQXZCLEVBQThCLFNBQVMsS0FBSyxLQUFMLENBQVcsSUFBbEQ7Z0JBQ0U7QUFBQTtvQkFBQSxFQUFNLGVBQVksTUFBbEI7b0JBQUE7QUFBQTtBQURGO0FBREYsU0FESixDQURKLEtBUUksT0FDSTtBQUFBO1lBQUEsRUFBSSxXQUFVLFVBQWQ7WUFDRTtBQUFBO2dCQUFBLEVBQUcsTUFBSyxHQUFSLEVBQVksY0FBVyxNQUF2QjtnQkFDRTtBQUFBO29CQUFBLEVBQU0sZUFBWSxNQUFsQjtvQkFBQTtBQUFBO0FBREY7QUFERixTQURKO0FBTVAsS0FyQzhCO0FBc0MvQixZQUFRLGtCQUFZO0FBQ2hCLFlBQUksUUFBUSxFQUFaO0FBQ0EsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixLQUFLLEtBQUssS0FBTCxDQUFXLFVBQWhDLEVBQTRDLEdBQTVDLEVBQWlEO0FBQzdDLGdCQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixDQUEvQjtBQUNBLGdCQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsV0FBckIsRUFBa0M7QUFDOUIsc0JBQU0sSUFBTixDQUFXO0FBQUE7b0JBQUEsRUFBSSxXQUFVLFFBQWQsRUFBdUIsS0FBSyxHQUE1QjtvQkFBaUM7QUFBQTt3QkFBQSxFQUFHLE1BQUssR0FBUixFQUFZLEtBQUssR0FBakI7d0JBQXdCO0FBQXhCO0FBQWpDLGlCQUFYO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsc0JBQU0sSUFBTixDQUFXO0FBQUE7b0JBQUEsRUFBSSxLQUFLLEdBQVQsRUFBZSxTQUFTLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0IsQ0FBeEIsQ0FBeEI7b0JBQW9EO0FBQUE7d0JBQUEsRUFBRyxNQUFLLEdBQVIsRUFBWSxLQUFLLEdBQWpCO3dCQUF3QjtBQUF4QjtBQUFwRCxpQkFBWDtBQUNIO0FBQ0o7O0FBRUQsWUFBSSxPQUFRLE1BQU0sTUFBTixHQUFlLENBQTNCO0FBQ0EsZUFDSSxPQUNBO0FBQUE7WUFBQTtZQUNJO0FBQUE7Z0JBQUEsRUFBSyxXQUFVLDBCQUFmO2dCQUNJO0FBQUE7b0JBQUE7b0JBQ0U7QUFBQTt3QkFBQSxFQUFJLFdBQVUsWUFBZDt3QkFDSyxLQUFLLFFBQUwsRUFETDt3QkFFSyxLQUZMO3dCQUdLLEtBQUssUUFBTDtBQUhMO0FBREY7QUFESjtBQURKLFNBREEsR0FZRSxJQWJOO0FBZUg7QUFqRThCLENBQWxCLENBQWpCIiwiZmlsZSI6ImNvbXBvbmVudHMvY29tbWVudHMvUGFnaW5hdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBQYWdpbmF0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgZ2V0UGFnZTogZnVuY3Rpb24gKHApIHtcclxuICAgICAgICB0aGlzLnByb3BzLmdldFBhZ2UocCk7XHJcbiAgICB9LFxyXG4gICAgcHJldlZpZXc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBoYXNQcmV2ID0gISh0aGlzLnByb3BzLmN1cnJlbnRQYWdlID09PSAxKTtcclxuICAgICAgICBpZiAoaGFzUHJldilcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiBvbkNsaWNrPXt0aGlzLnByb3BzLnByZXZ9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZsYXF1bzs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZGlzYWJsZWRcIj5cclxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mbGFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICB9LFxyXG4gICAgbmV4dFZpZXc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBoYXNOZXh0ID0gISh0aGlzLnByb3BzLnRvdGFsUGFnZXMgPT09IHRoaXMucHJvcHMuY3VycmVudFBhZ2UpICYmICEodGhpcy5wcm9wcy50b3RhbFBhZ2VzID09PSAwKTtcclxuICAgICAgICBpZihoYXNOZXh0KVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGFyaWEtbGFiZWw9XCJOZXh0XCIgb25DbGljaz17dGhpcy5wcm9wcy5uZXh0fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mcmFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImRpc2FibGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgYXJpYS1sYWJlbD1cIk5leHRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mcmFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBhZ2VzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gdGhpcy5wcm9wcy50b3RhbFBhZ2VzOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGtleSA9IHRoaXMucHJvcHMuaW1hZ2VJZCArIGk7XHJcbiAgICAgICAgICAgIGlmIChpID09PSB0aGlzLnByb3BzLmN1cnJlbnRQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKDxsaSBjbGFzc05hbWU9XCJhY3RpdmVcIiBrZXk9e2tleX0+PGEgaHJlZj1cIiNcIiBrZXk9e2tleSB9PntpfTwvYT48L2xpPik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKDxsaSBrZXk9e2tleSB9IG9uQ2xpY2s9e3RoaXMuZ2V0UGFnZS5iaW5kKHRoaXMsIGkpfT48YSBocmVmPVwiI1wiIGtleT17a2V5IH0+e2l9PC9hPjwvbGk+KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNob3cgPSAocGFnZXMubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgc2hvdyA/XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctOVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxuYXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwicGFnaW5hdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByZXZWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3BhZ2VzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLm5leHRWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbmF2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA6IG51bGxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
