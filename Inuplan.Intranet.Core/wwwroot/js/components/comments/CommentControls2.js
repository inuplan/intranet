'use strict';

var CommentControls = React.createClass({
    displayName: 'CommentControls',

    getInitialState: function getInitialState() {
        return {
            text: this.props.text,
            reply: ''
        };
    },
    edit: function edit() {
        var comment = {
            ID: this.props.commentId,
            Text: this.state.text
        };
        this.props.editHandle(comment);
        $("#" + this.btns().editCollapse).collapse('hide');
        this.setState({ text: '' });
    },
    reply: function reply() {
        this.props.replyHandle(this.props.commentId, this.state.reply);
        $("#" + this.btns().replyCollapse).collapse('hide');
        this.setState({ reply: '' });
    },
    delete: function _delete(commentId) {
        this.props.deleteHandle(commentId);
    },
    showTooltip: function showTooltip(item) {
        var btn = "#" + this.props.commentId + "_" + item;
        $(btn).tooltip('show');
    },
    btns: function btns() {
        return {
            reply: this.props.commentId + '_reply',
            edit: this.props.commentId + '_edit',
            delete: this.props.commentId + '_delete',
            editCollapse: this.props.commentId + '_editCollapse',
            replyCollapse: this.props.commentId + '_replyCollapse'
        };
    },
    handleTextChange: function handleTextChange(e) {
        this.setState({ text: e.target.value });
    },
    handleReplyChange: function handleReplyChange(e) {
        this.setState({ reply: e.target.value });
    },
    render: function render() {
        var editTarget = "#" + this.btns().editCollapse;
        var replyTarget = "#" + this.btns().replyCollapse;
        return this.props.canEdit ? React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'row', style: { paddingBottom: '5px', paddingLeft: "15px" } },
                React.createElement(
                    'div',
                    { className: 'col-lg-4' },
                    React.createElement(
                        'a',
                        { onClick: this.delete.bind(this, this.props.commentId) },
                        React.createElement(
                            'span',
                            {
                                onMouseEnter: this.showTooltip.bind(this, 'delete'),
                                id: this.btns().delete,
                                'data-toggle': 'tooltip',
                                title: 'Slet',
                                className: 'label label-danger' },
                            React.createElement('span', { className: 'glyphicon glyphicon-trash' })
                        )
                    ),
                    ' ',
                    React.createElement(
                        'a',
                        { 'data-toggle': 'collapse', 'data-target': editTarget },
                        React.createElement(
                            'span',
                            {
                                onMouseEnter: this.showTooltip.bind(this, 'edit'),
                                id: this.btns().edit,
                                'data-toggle': 'tooltip',
                                title: 'Ændre',
                                className: 'label label-success' },
                            React.createElement('span', { className: 'glyphicon glyphicon-pencil' })
                        )
                    ),
                    ' ',
                    React.createElement(
                        'a',
                        { 'data-toggle': 'collapse', 'data-target': replyTarget },
                        React.createElement(
                            'span',
                            {
                                onMouseEnter: this.showTooltip.bind(this, 'reply'),
                                id: this.btns().reply,
                                'data-toggle': 'tooltip',
                                title: 'Svar',
                                className: 'label label-primary' },
                            React.createElement('span', { className: 'glyphicon glyphicon-envelope' })
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row', style: { paddingBottom: '5px' } },
                React.createElement(
                    'div',
                    { className: 'col-lg-offset-1 col-lg-10 collapse', id: this.btns().editCollapse },
                    React.createElement('textarea', { className: 'form-control', value: this.state.text, onChange: this.handleTextChange, rows: '4' }),
                    React.createElement('br', null),
                    React.createElement(
                        'button',
                        { type: 'button', 'data-toggle': 'collapse', 'data-target': editTarget, className: 'btn btn-default' },
                        'Luk'
                    ),
                    React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-info', onClick: this.edit },
                        'Gem ændringer'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-lg-offset-1 col-lg-10 collapse', id: this.btns().replyCollapse },
                    React.createElement('textarea', { className: 'form-control', value: this.state.reply, onChange: this.handleReplyChange, rows: '4' }),
                    React.createElement('br', null),
                    React.createElement(
                        'button',
                        { type: 'button', 'data-toggle': 'collapse', 'data-target': replyTarget, className: 'btn btn-default' },
                        'Luk'
                    ),
                    React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-info', onClick: this.reply },
                        'Svar'
                    )
                )
            )
        ) : React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'row', style: { paddingBottom: '5px', paddingLeft: '15px' } },
                React.createElement(
                    'div',
                    { className: 'col-lg-4' },
                    React.createElement(
                        'a',
                        { 'data-toggle': 'collapse', 'data-target': replyTarget },
                        React.createElement(
                            'span',
                            {
                                onMouseEnter: this.showTooltip.bind(this, 'reply'),
                                id: this.btns().reply,
                                'data-toggle': 'tooltip',
                                title: 'Svar',
                                className: 'label label-primary' },
                            React.createElement('span', { className: 'glyphicon glyphicon-envelope' })
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-lg-offset-1 col-lg-10 collapse', id: this.btns().replyCollapse },
                    React.createElement('textarea', { className: 'form-control', value: this.state.reply, onChange: this.handleReplyChange, rows: '4' }),
                    React.createElement('br', null),
                    React.createElement(
                        'button',
                        { type: 'button', 'data-toggle': 'collapse', 'data-target': replyTarget, className: 'btn btn-default' },
                        'Luk'
                    ),
                    React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-info', onClick: this.reply },
                        'Svar'
                    )
                )
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudENvbnRyb2xzLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksa0JBQWtCLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUNwQyxxQkFBaUIsMkJBQVc7QUFDeEIsZUFBTztBQUNILGtCQUFNLEtBQUssS0FBTCxDQUFXLElBRGQ7QUFFSCxtQkFBTztBQUZKLFNBQVA7QUFJSCxLQU5tQztBQU9wQyxVQUFNLGdCQUFXO0FBQ2IsWUFBSSxVQUFVO0FBQ1YsZ0JBQUksS0FBSyxLQUFMLENBQVcsU0FETDtBQUVWLGtCQUFNLEtBQUssS0FBTCxDQUFXO0FBRlAsU0FBZDtBQUlBLGFBQUssS0FBTCxDQUFXLFVBQVgsQ0FBc0IsT0FBdEI7QUFDQSxVQUFFLE1BQU0sS0FBSyxJQUFMLEdBQVksWUFBcEIsRUFBa0MsUUFBbEMsQ0FBMkMsTUFBM0M7QUFDQSxhQUFLLFFBQUwsQ0FBYyxFQUFFLE1BQU0sRUFBUixFQUFkO0FBQ0gsS0FmbUM7QUFnQnBDLFdBQU8saUJBQVc7QUFDZCxhQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLEtBQUssS0FBTCxDQUFXLFNBQWxDLEVBQTZDLEtBQUssS0FBTCxDQUFXLEtBQXhEO0FBQ0EsVUFBRSxNQUFNLEtBQUssSUFBTCxHQUFZLGFBQXBCLEVBQW1DLFFBQW5DLENBQTRDLE1BQTVDO0FBQ0EsYUFBSyxRQUFMLENBQWMsRUFBRSxPQUFPLEVBQVQsRUFBZDtBQUNILEtBcEJtQztBQXFCcEMsWUFBUSxpQkFBVSxTQUFWLEVBQXFCO0FBQ3pCLGFBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsU0FBeEI7QUFDSCxLQXZCbUM7QUF3QnBDLGlCQUFhLHFCQUFVLElBQVYsRUFBZ0I7QUFDekIsWUFBSSxNQUFNLE1BQU0sS0FBSyxLQUFMLENBQVcsU0FBakIsR0FBNkIsR0FBN0IsR0FBbUMsSUFBN0M7QUFDQSxVQUFFLEdBQUYsRUFBTyxPQUFQLENBQWUsTUFBZjtBQUNILEtBM0Jt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QUwsR0FBWSxLQUZ0QjtBQUdNLCtDQUFZLFNBSGxCO0FBSU0sdUNBQU0sTUFKWjtBQUtNLDJDQUFVLHFCQUxoQjs0QkFNSSw4QkFBTSxXQUFVLDhCQUFoQjtBQU5KO0FBREo7QUFESjtBQURKLGFBREo7WUFlSTtBQUFBO2dCQUFBLEVBQUssV0FBVSxLQUFmO2dCQUNJO0FBQUE7b0JBQUEsRUFBSyxXQUFVLG9DQUFmLEVBQW9ELElBQUksS0FBSyxJQUFMLEdBQVksYUFBcEU7b0JBQ0ksa0NBQVUsV0FBVSxjQUFwQixFQUFtQyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXJELEVBQTRELFVBQVUsS0FBSyxpQkFBM0UsRUFBOEYsTUFBSyxHQUFuRyxHQURKO29CQUVJLCtCQUZKO29CQUdJO0FBQUE7d0JBQUEsRUFBUSxNQUFLLFFBQWIsRUFBc0IsZUFBWSxVQUFsQyxFQUE2QyxlQUFhLFdBQTFELEVBQXVFLFdBQVUsaUJBQWpGO3dCQUFBO0FBQUEscUJBSEo7b0JBSUk7QUFBQTt3QkFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixXQUFVLGNBQWhDLEVBQStDLFNBQVMsS0FBSyxLQUE3RDt3QkFBQTtBQUFBO0FBSko7QUFESjtBQWZKLFNBdkRKO0FBZ0ZIO0FBOUhtQyxDQUFsQixDQUF0QiIsImZpbGUiOiJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRDb250cm9scy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBDb21tZW50Q29udHJvbHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMucHJvcHMudGV4dCxcclxuICAgICAgICAgICAgcmVwbHk6ICcnXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGVkaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjb21tZW50ID0ge1xyXG4gICAgICAgICAgICBJRDogdGhpcy5wcm9wcy5jb21tZW50SWQsXHJcbiAgICAgICAgICAgIFRleHQ6IHRoaXMuc3RhdGUudGV4dFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wcm9wcy5lZGl0SGFuZGxlKGNvbW1lbnQpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLmJ0bnMoKS5lZGl0Q29sbGFwc2UpLmNvbGxhcHNlKCdoaWRlJyk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6ICcnIH0pO1xyXG4gICAgfSxcclxuICAgIHJlcGx5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnByb3BzLnJlcGx5SGFuZGxlKHRoaXMucHJvcHMuY29tbWVudElkLCB0aGlzLnN0YXRlLnJlcGx5KTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5idG5zKCkucmVwbHlDb2xsYXBzZSkuY29sbGFwc2UoJ2hpZGUnKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6ICcnIH0pO1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZTogZnVuY3Rpb24gKGNvbW1lbnRJZCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMuZGVsZXRlSGFuZGxlKGNvbW1lbnRJZCk7XHJcbiAgICB9LFxyXG4gICAgc2hvd1Rvb2x0aXA6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdmFyIGJ0biA9IFwiI1wiICsgdGhpcy5wcm9wcy5jb21tZW50SWQgKyBcIl9cIiArIGl0ZW07XHJcbiAgICAgICAgJChidG4pLnRvb2x0aXAoJ3Nob3cnKTtcclxuICAgIH0sXHJcbiAgICBidG5zOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXBseTogdGhpcy5wcm9wcy5jb21tZW50SWQgKyAnX3JlcGx5JyxcclxuICAgICAgICAgICAgZWRpdDogdGhpcy5wcm9wcy5jb21tZW50SWQgKyAnX2VkaXQnLFxyXG4gICAgICAgICAgICBkZWxldGU6IHRoaXMucHJvcHMuY29tbWVudElkICsgJ19kZWxldGUnLFxyXG4gICAgICAgICAgICBlZGl0Q29sbGFwc2U6IHRoaXMucHJvcHMuY29tbWVudElkICsgJ19lZGl0Q29sbGFwc2UnLFxyXG4gICAgICAgICAgICByZXBseUNvbGxhcHNlOiB0aGlzLnByb3BzLmNvbW1lbnRJZCArICdfcmVwbHlDb2xsYXBzZScsXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhhbmRsZVRleHRDaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICB9LFxyXG4gICAgaGFuZGxlUmVwbHlDaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5OiBlLnRhcmdldC52YWx1ZSB9KVxyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBlZGl0VGFyZ2V0ID0gXCIjXCIgKyB0aGlzLmJ0bnMoKS5lZGl0Q29sbGFwc2U7XHJcbiAgICAgICAgdmFyIHJlcGx5VGFyZ2V0ID0gXCIjXCIgKyB0aGlzLmJ0bnMoKS5yZXBseUNvbGxhcHNlO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FuRWRpdCA/XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7cGFkZGluZ0JvdHRvbTogJzVweCcsIHBhZGRpbmdMZWZ0OiBcIjE1cHhcIn19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5kZWxldGUuYmluZCh0aGlzLCB0aGlzLnByb3BzLmNvbW1lbnRJZCl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdkZWxldGUnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXt0aGlzLmJ0bnMoKS5kZWxldGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTbGV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLWRhbmdlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2hcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT4mbmJzcDsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17ZWRpdFRhcmdldH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ2VkaXQnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXt0aGlzLmJ0bnMoKS5lZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiw4ZuZHJlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBlbmNpbFwiID48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT4mbmJzcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtyZXBseVRhcmdldH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ3JlcGx5Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17dGhpcy5idG5zKCkucmVwbHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTdmFyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXByaW1hcnlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4J319PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMCBjb2xsYXBzZVwiIGlkPXt0aGlzLmJ0bnMoKS5lZGl0Q29sbGFwc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUudGV4dH0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlVGV4dENoYW5nZX0gcm93cz1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtlZGl0VGFyZ2V0fSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1pbmZvXCIgb25DbGljaz17dGhpcy5lZGl0fT5HZW0gw6ZuZHJpbmdlcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMCBjb2xsYXBzZVwiIGlkPXt0aGlzLmJ0bnMoKS5yZXBseUNvbGxhcHNlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHZhbHVlPXt0aGlzLnN0YXRlLnJlcGx5fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVSZXBseUNoYW5nZX0gcm93cz1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtyZXBseVRhcmdldH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4taW5mb1wiIG9uQ2xpY2s9e3RoaXMucmVwbHl9PlN2YXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj4gOiBcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4JywgcGFkZGluZ0xlZnQ6ICcxNXB4J319PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtyZXBseVRhcmdldH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ3JlcGx5Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17dGhpcy5idG5zKCkucmVwbHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTdmFyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXByaW1hcnlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwIGNvbGxhcHNlXCIgaWQ9e3RoaXMuYnRucygpLnJlcGx5Q29sbGFwc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUucmVwbHl9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1pbmZvXCIgb25DbGljaz17dGhpcy5yZXBseX0+U3ZhcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
