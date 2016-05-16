"use strict";

var Comment = React.createClass({
    displayName: "Comment",

    rawMarkup: function rawMarkup() {
        var rawMarkup = marked(this.props.text, { sanitize: true });
        return { __html: rawMarkup };
    },
    render: function render() {
        var replies = this.props.children.map(function (reply) {
            return React.createElement(Comment, {
                author: reply.Author,
                key: reply.ID,
                text: reply.Text,
                replies: reply.Replies });
        });
        return React.createElement(
            "div",
            { className: "comment" },
            React.createElement(
                "h2",
                { className: "commentAuthor" },
                this.props.author
            ),
            React.createElement("span", { dangerouslySetInnerHTML: this.rawMarkup() }),
            replies
        );
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzVCLGVBQVcscUJBQVk7QUFDbkIsWUFBSSxZQUFZLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBbEIsRUFBd0IsRUFBRSxVQUFVLElBQVosRUFBeEIsQ0FBaEI7QUFDQSxlQUFPLEVBQUUsUUFBUSxTQUFWLEVBQVA7QUFDSCxLQUoyQjtBQUs1QixZQUFRLGtCQUFZO0FBQ2hCLFlBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEdBQXBCLENBQXdCLFVBQVUsS0FBVixFQUFpQjtBQUNuRCxtQkFDSSxvQkFBQyxPQUFEO0FBQ0ksd0JBQVEsTUFBTSxNQURsQjtBQUVJLHFCQUFLLE1BQU0sRUFGZjtBQUdJLHNCQUFNLE1BQU0sSUFIaEI7QUFJSSx5QkFBUyxNQUFNLE9BSm5CLEdBREo7QUFPSCxTQVJhLENBQWQ7QUFTQSxlQUNGO0FBQUE7WUFBQSxFQUFLLFdBQVUsU0FBZjtZQUNFO0FBQUE7Z0JBQUEsRUFBSSxXQUFVLGVBQWQ7Z0JBQ0csS0FBSyxLQUFMLENBQVc7QUFEZCxhQURGO1lBSUUsOEJBQU0seUJBQXlCLEtBQUssU0FBTCxFQUEvQixHQUpGO1lBS0s7QUFMTCxTQURFO0FBU0w7QUF4QjZCLENBQWxCLENBQWQiLCJmaWxlIjoiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIENvbW1lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICByYXdNYXJrdXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmF3TWFya3VwID0gbWFya2VkKHRoaXMucHJvcHMudGV4dCwgeyBzYW5pdGl6ZTogdHJ1ZSB9KTtcclxuICAgICAgICByZXR1cm4geyBfX2h0bWw6IHJhd01hcmt1cCB9O1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByZXBsaWVzID0gdGhpcy5wcm9wcy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKHJlcGx5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8Q29tbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcj17cmVwbHkuQXV0aG9yfVxyXG4gICAgICAgICAgICAgICAgICAgIGtleT17cmVwbHkuSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dD17cmVwbHkuVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICByZXBsaWVzPXtyZXBseS5SZXBsaWVzfT5cclxuICAgICAgICAgICAgICAgIDwvQ29tbWVudD4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29tbWVudFwiPlxyXG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJjb21tZW50QXV0aG9yXCI+XHJcbiAgICAgICAgICB7dGhpcy5wcm9wcy5hdXRob3J9XHJcbiAgICAgICAgPC9oMj5cclxuICAgICAgICA8c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17dGhpcy5yYXdNYXJrdXAoKSB9IC8+XHJcbiAgICAgICAgICB7cmVwbGllc31cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufSk7Il19
