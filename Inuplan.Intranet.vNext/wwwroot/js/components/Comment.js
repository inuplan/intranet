"use strict";

var Comment = React.createClass({
  displayName: "Comment",

  rawMarkup: function rawMarkup() {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
    return { __html: rawMarkup };
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "comment" },
      React.createElement(
        "h2",
        { className: "commentAuthor" },
        this.props.author
      ),
      React.createElement("span", { dangerouslySetInnerHTML: this.rawMarkup() })
    );
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29tbWVudC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzVCLGFBQVcscUJBQVc7QUFDbEIsUUFBSSxZQUFZLE9BQU8sS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixRQUFwQixFQUFQLEVBQXVDLEVBQUUsVUFBVSxJQUFaLEVBQXZDLENBQWhCO0FBQ0EsV0FBTyxFQUFFLFFBQVEsU0FBVixFQUFQO0FBQ0gsR0FKMkI7QUFLNUIsVUFBUSxrQkFBWTtBQUNoQixXQUNGO0FBQUE7TUFBQSxFQUFLLFdBQVUsU0FBZjtNQUNFO0FBQUE7UUFBQSxFQUFJLFdBQVUsZUFBZDtRQUNHLEtBQUssS0FBTCxDQUFXO0FBRGQsT0FERjtNQUlFLDhCQUFNLHlCQUF5QixLQUFLLFNBQUwsRUFBL0I7QUFKRixLQURFO0FBUUw7QUFkNkIsQ0FBbEIsQ0FBZCIsImZpbGUiOiJjb21wb25lbnRzL0NvbW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQ29tbWVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIHJhd01hcmt1cDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJhd01hcmt1cCA9IG1hcmtlZCh0aGlzLnByb3BzLmNoaWxkcmVuLnRvU3RyaW5nKCksIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICAgICAgcmV0dXJuIHsgX19odG1sOiByYXdNYXJrdXAgfTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbW1lbnRcIj5cclxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY29tbWVudEF1dGhvclwiPlxyXG4gICAgICAgICAge3RoaXMucHJvcHMuYXV0aG9yfVxyXG4gICAgICAgIDwvaDI+XHJcbiAgICAgICAgPHNwYW4gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3RoaXMucmF3TWFya3VwKCl9IC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn0pOyJdfQ==
