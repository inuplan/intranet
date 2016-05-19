"use strict";

var Image = React.createClass({
    displayName: "Image",

    toggleModal: function toggleModal() {
        this.props.modalHandle(this.props.data);
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { onClick: this.toggleModal },
                React.createElement("img", { src: this.props.data.PreviewUrl, className: "img-thumbnail" })
            )
        );
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUIsaUJBQWEsdUJBQVk7QUFDckIsYUFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixLQUFLLEtBQUwsQ0FBVyxJQUFsQztBQUNILEtBSHlCO0FBSTFCLFlBQVEsa0JBQVk7QUFDaEIsZUFDQTtBQUFBO1lBQUE7WUFDSTtBQUFBO2dCQUFBLEVBQUcsU0FBUyxLQUFLLFdBQWpCO2dCQUNJLDZCQUFLLEtBQUssS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixVQUExQixFQUFzQyxXQUFVLGVBQWhEO0FBREo7QUFESixTQURBO0FBT0g7QUFaeUIsQ0FBbEIsQ0FBWiIsImZpbGUiOiJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBJbWFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIHRvZ2dsZU1vZGFsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5tb2RhbEhhbmRsZSh0aGlzLnByb3BzLmRhdGEpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy50b2dnbGVNb2RhbH0+XHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17dGhpcy5wcm9wcy5kYXRhLlByZXZpZXdVcmx9IGNsYXNzTmFtZT1cImltZy10aHVtYm5haWxcIiAvPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7Il19
