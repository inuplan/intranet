'use strict';

var CommentForm = React.createClass({
    displayName: 'CommentForm',

    getInitialState: function getInitialState() {
        return {
            Text: ''
        };
    },
    postComment: function postComment(e) {
        e.preventDefault();
        this.props.postCommentHandle(this.state.Text);
        this.setState({ Text: '' });
    },
    handleTextChange: function handleTextChange(e) {
        this.setState({ Text: e.target.value });
    },
    render: function render() {
        return React.createElement(
            'form',
            { onSubmit: this.postComment },
            React.createElement(
                'label',
                { htmlFor: 'remark' },
                'Kommentar'
            ),
            React.createElement('textarea', { className: 'form-control', onChange: this.handleTextChange, value: this.state.Text, placeholder: 'Skriv kommentar her...', id: 'remark', rows: '4' }),
            React.createElement('br', null),
            React.createElement(
                'button',
                { type: 'submit', className: 'btn btn-primary' },
                'Send'
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudEZvcm0uanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUNoQyxxQkFBaUIsMkJBQVc7QUFDeEIsZUFBTztBQUNILGtCQUFNO0FBREgsU0FBUDtBQUdILEtBTCtCO0FBTWhDLGlCQUFhLHFCQUFVLENBQVYsRUFBYTtBQUN0QixVQUFFLGNBQUY7QUFDQSxhQUFLLEtBQUwsQ0FBVyxpQkFBWCxDQUE2QixLQUFLLEtBQUwsQ0FBVyxJQUF4QztBQUNBLGFBQUssUUFBTCxDQUFjLEVBQUUsTUFBTSxFQUFSLEVBQWQ7QUFDSCxLQVYrQjtBQVdoQyxzQkFBa0IsMEJBQVUsQ0FBVixFQUFhO0FBQzNCLGFBQUssUUFBTCxDQUFjLEVBQUUsTUFBTSxFQUFFLE1BQUYsQ0FBUyxLQUFqQixFQUFkO0FBQ0gsS0FiK0I7QUFjaEMsWUFBUSxrQkFBWTtBQUNoQixlQUNJO0FBQUE7WUFBQSxFQUFNLFVBQVUsS0FBSyxXQUFyQjtZQUNJO0FBQUE7Z0JBQUEsRUFBTyxTQUFRLFFBQWY7Z0JBQUE7QUFBQSxhQURKO1lBRUksa0NBQVUsV0FBVSxjQUFwQixFQUFtQyxVQUFVLEtBQUssZ0JBQWxELEVBQW9FLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBdEYsRUFBNEYsYUFBWSx3QkFBeEcsRUFBaUksSUFBRyxRQUFwSSxFQUE2SSxNQUFLLEdBQWxKLEdBRko7WUFHSSwrQkFISjtZQUlJO0FBQUE7Z0JBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVSxpQkFBaEM7Z0JBQUE7QUFBQTtBQUpKLFNBREo7QUFRSDtBQXZCK0IsQ0FBbEIsQ0FBbEIiLCJmaWxlIjoiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50Rm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBDb21tZW50Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgVGV4dDogJydcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIHBvc3RDb21tZW50OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLnByb3BzLnBvc3RDb21tZW50SGFuZGxlKHRoaXMuc3RhdGUuVGV4dCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6ICcnIH0pO1xyXG4gICAgfSxcclxuICAgIGhhbmRsZVRleHRDaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMucG9zdENvbW1lbnR9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJyZW1hcmtcIj5Lb21tZW50YXI8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRleHRDaGFuZ2V9IHZhbHVlPXt0aGlzLnN0YXRlLlRleHR9IHBsYWNlaG9sZGVyPVwiU2tyaXYga29tbWVudGFyIGhlci4uLlwiIGlkPVwicmVtYXJrXCIgcm93cz1cIjRcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIj5TZW5kPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
