"use strict";

var CommentDeleted = React.createClass({
    displayName: "CommentDeleted",

    render: function render() {
        var replies = this.props.constructComments(this.props.replies);
        return React.createElement(
            "div",
            { className: "media pull-left text-left" },
            React.createElement("div", { className: "media-left", style: { minWidth: "74px" } }),
            React.createElement(
                "div",
                { className: "media-body" },
                React.createElement(
                    "small",
                    null,
                    "slettet"
                ),
                replies
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudERlbGV0ZWQuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxpQkFBaUIsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ25DLFlBQVEsa0JBQVk7QUFDaEIsWUFBSSxVQUFVLEtBQUssS0FBTCxDQUFXLGlCQUFYLENBQTZCLEtBQUssS0FBTCxDQUFXLE9BQXhDLENBQWQ7QUFDQSxlQUNJO0FBQUE7WUFBQSxFQUFLLFdBQVUsMkJBQWY7WUFDSSw2QkFBSyxXQUFVLFlBQWYsRUFBNEIsT0FBTyxFQUFDLFVBQVUsTUFBWCxFQUFuQyxHQURKO1lBRUk7QUFBQTtnQkFBQSxFQUFLLFdBQVUsWUFBZjtnQkFDSTtBQUFBO29CQUFBO29CQUFBO0FBQUEsaUJBREo7Z0JBRUs7QUFGTDtBQUZKLFNBREo7QUFTSDtBQVprQyxDQUFsQixDQUFyQiIsImZpbGUiOiJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnREZWxldGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIENvbW1lbnREZWxldGVkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJlcGxpZXMgPSB0aGlzLnByb3BzLmNvbnN0cnVjdENvbW1lbnRzKHRoaXMucHJvcHMucmVwbGllcyk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYSBwdWxsLWxlZnQgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWxlZnRcIiBzdHlsZT17e21pbldpZHRoOiBcIjc0cHhcIn19PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnNsZXR0ZXQ8L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgIHtyZXBsaWVzfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
