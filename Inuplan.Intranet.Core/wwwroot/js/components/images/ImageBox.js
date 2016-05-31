"use strict";

var ImageBox = React.createClass({
    displayName: "ImageBox",

    getInitialState: function getInitialState() {
        return {
            data: [],
            selected: null
        };
    },
    deleteImageFromServer: function deleteImageFromServer(imageId) {
        $.ajax({
            url: this.props.deleteImageUrl + "?username=" + this.props.username + "&id=" + imageId,
            method: 'DELETE',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.loadImagesFromServer(this.props.username);
            }.bind(this)
        });
    },
    loadImagesFromServer: function loadImagesFromServer(username) {
        $.ajax({
            url: this.props.imagesUrl,
            method: 'GET',
            dataType: 'json',
            data: "username=" + username,
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.imagesUrl, status, err.toString());
            }.bind(this),
            xhrFields: {
                withCredentials: true
            },
            processData: false
        });
    },
    modalHandle: function modalHandle(image) {
        this.setState({
            selected: image
        });
        $("#modalWindow").modal("show");
    },
    componentDidMount: function componentDidMount() {
        this.loadImagesFromServer(this.props.username);
        $(ReactDOM.findDOMNode(this)).on('hide.bs.modal', function (e) {
            this.setState({
                selected: null
            });
        }.bind(this));
    },
    imageUploadFormView: function imageUploadFormView() {
        return this.props.canEdit ? React.createElement(ImageUpload, { imageUploadUrl: this.props.imageUploadUrl, username: this.props.username, reload: this.loadImagesFromServer }) : null;
    },
    modalView: function modalView() {
        return this.state.selected ? React.createElement(Modal, {
            imageId: this.state.selected.ImageID,
            filename: this.state.selected.Filename + "." + this.state.selected.Extension,
            originalUrl: this.state.selected.OriginalUrl,
            previewUrl: this.state.selected.PreviewUrl,
            deleteImageHandle: this.deleteImageFromServer,
            commentsUrl: this.props.commentsUrl,
            userUrl: this.props.userUrl,
            username: this.props.me,
            canEdit: this.props.canEdit
        }) : null;
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(ImageList, { images: this.state.data, modalHandle: this.modalHandle }),
                this.modalView()
            ),
            this.imageUploadFormView()
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlQm94LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDN0IscUJBQWlCLDJCQUFZO0FBQ3pCLGVBQU87QUFDSCxrQkFBTSxFQURIO0FBRUgsc0JBQVU7QUFGUCxTQUFQO0FBSUgsS0FONEI7QUFPN0IsMkJBQXVCLCtCQUFVLE9BQVYsRUFBbUI7QUFDdEMsVUFBRSxJQUFGLENBQU87QUFDSCxpQkFBSyxLQUFLLEtBQUwsQ0FBVyxjQUFYLEdBQTRCLFlBQTVCLEdBQTJDLEtBQUssS0FBTCxDQUFXLFFBQXRELEdBQWlFLE1BQWpFLEdBQTBFLE9BRDVFO0FBRUgsb0JBQVEsUUFGTDtBQUdILHVCQUFXO0FBQ1AsaUNBQWlCO0FBRFYsYUFIUjtBQU1ILHFCQUFTLFVBQVUsSUFBVixFQUFnQjtBQUNyQixxQkFBSyxvQkFBTCxDQUEwQixLQUFLLEtBQUwsQ0FBVyxRQUFyQztBQUNILGFBRlEsQ0FFUCxJQUZPLENBRUYsSUFGRTtBQU5OLFNBQVA7QUFVSCxLQWxCNEI7QUFtQjdCLDBCQUFzQiw4QkFBVSxRQUFWLEVBQW9CO0FBQ3RDLFVBQUUsSUFBRixDQUFPO0FBQ0gsaUJBQUssS0FBSyxLQUFMLENBQVcsU0FEYjtBQUVILG9CQUFRLEtBRkw7QUFHSCxzQkFBVSxNQUhQO0FBSUgsa0JBQU0sY0FBYyxRQUpqQjtBQUtILG1CQUFPLEtBTEo7QUFNSCxxQkFBUyxVQUFVLElBQVYsRUFBZ0I7QUFDckIscUJBQUssUUFBTCxDQUFjLEVBQUUsTUFBTSxJQUFSLEVBQWQ7QUFDSCxhQUZRLENBRVAsSUFGTyxDQUVGLElBRkUsQ0FOTjtBQVNILG1CQUFPLFVBQVUsR0FBVixFQUFlLE1BQWYsRUFBdUIsR0FBdkIsRUFBNEI7QUFDL0Isd0JBQVEsS0FBUixDQUFjLEtBQUssS0FBTCxDQUFXLFNBQXpCLEVBQW9DLE1BQXBDLEVBQTRDLElBQUksUUFBSixFQUE1QztBQUNILGFBRk0sQ0FFTCxJQUZLLENBRUEsSUFGQSxDQVRKO0FBWUgsdUJBQVc7QUFDUCxpQ0FBaUI7QUFEVixhQVpSO0FBZUgseUJBQWE7QUFmVixTQUFQO0FBaUJILEtBckM0QjtBQXNDN0IsaUJBQWEscUJBQVUsS0FBVixFQUFpQjtBQUMxQixhQUFLLFFBQUwsQ0FBYztBQUNWLHNCQUFVO0FBREEsU0FBZDtBQUdBLFVBQUUsY0FBRixFQUFrQixLQUFsQixDQUF3QixNQUF4QjtBQUNILEtBM0M0QjtBQTRDN0IsdUJBQW1CLDZCQUFZO0FBQzNCLGFBQUssb0JBQUwsQ0FBMEIsS0FBSyxLQUFMLENBQVcsUUFBckM7QUFDQSxVQUFFLFNBQVMsV0FBVCxDQUFxQixJQUFyQixDQUFGLEVBQThCLEVBQTlCLENBQWlDLGVBQWpDLEVBQWtELFVBQVUsQ0FBVixFQUFhO0FBQzNELGlCQUFLLFFBQUwsQ0FBYztBQUNWLDBCQUFVO0FBREEsYUFBZDtBQUdILFNBSmlELENBSWhELElBSmdELENBSTNDLElBSjJDLENBQWxEO0FBS0gsS0FuRDRCO0FBb0Q3Qix5QkFBcUIsK0JBQVk7QUFDN0IsZUFDSSxLQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQ0Esb0JBQUMsV0FBRCxJQUFhLGdCQUFnQixLQUFLLEtBQUwsQ0FBVyxjQUF4QyxFQUF3RCxVQUFVLEtBQUssS0FBTCxDQUFXLFFBQTdFLEVBQXdGLFFBQVEsS0FBSyxvQkFBckcsR0FEQSxHQUVBLElBSEo7QUFLSCxLQTFENEI7QUEyRDdCLGVBQVcscUJBQVk7QUFDbkIsZUFBUSxLQUFLLEtBQUwsQ0FBVyxRQUFYLEdBQ0Esb0JBQUMsS0FBRDtBQUNPLHFCQUFTLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsT0FEcEM7QUFFTyxzQkFBVSxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFFBQXBCLEdBQStCLEdBQS9CLEdBQXFDLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsU0FGMUU7QUFHTyx5QkFBYSxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFdBSHhDO0FBSU8sd0JBQVksS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixVQUp2QztBQUtPLCtCQUFtQixLQUFLLHFCQUwvQjtBQU1PLHlCQUFhLEtBQUssS0FBTCxDQUFXLFdBTi9CO0FBT08scUJBQVMsS0FBSyxLQUFMLENBQVcsT0FQM0I7QUFRTyxzQkFBVSxLQUFLLEtBQUwsQ0FBVyxFQVI1QjtBQVNPLHFCQUFTLEtBQUssS0FBTCxDQUFXO0FBVDNCLFVBREEsR0FXSyxJQVhiO0FBWVAsS0F4RWdDO0FBeUU3QixZQUFRLGtCQUFZO0FBQ2hCLGVBQ0E7QUFBQTtZQUFBLEVBQUssV0FBVSxLQUFmO1lBQ0k7QUFBQTtnQkFBQSxFQUFLLFdBQVUsS0FBZjtnQkFDSSxvQkFBQyxTQUFELElBQVcsUUFBUSxLQUFLLEtBQUwsQ0FBVyxJQUE5QixFQUFvQyxhQUFhLEtBQUssV0FBdEQsR0FESjtnQkFFSyxLQUFLLFNBQUw7QUFGTCxhQURKO1lBS0ssS0FBSyxtQkFBTDtBQUxMLFNBREE7QUFTSDtBQW5GNEIsQ0FBbEIsQ0FBZiIsImZpbGUiOiJjb21wb25lbnRzL2ltYWdlcy9JbWFnZUJveC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBJbWFnZUJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICBzZWxlY3RlZDogbnVsbCxcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZUltYWdlRnJvbVNlcnZlcjogZnVuY3Rpb24gKGltYWdlSWQpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHRoaXMucHJvcHMuZGVsZXRlSW1hZ2VVcmwgKyBcIj91c2VybmFtZT1cIiArIHRoaXMucHJvcHMudXNlcm5hbWUgKyBcIiZpZD1cIiArIGltYWdlSWQsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbWFnZXNGcm9tU2VydmVyKHRoaXMucHJvcHMudXNlcm5hbWUpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIGxvYWRJbWFnZXNGcm9tU2VydmVyOiBmdW5jdGlvbiAodXNlcm5hbWUpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHRoaXMucHJvcHMuaW1hZ2VzVXJsLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiBcInVzZXJuYW1lPVwiICsgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkYXRhOiBkYXRhIH0pO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLmltYWdlc1VybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgbW9kYWxIYW5kbGU6IGZ1bmN0aW9uIChpbWFnZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBzZWxlY3RlZDogaW1hZ2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIiNtb2RhbFdpbmRvd1wiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvYWRJbWFnZXNGcm9tU2VydmVyKHRoaXMucHJvcHMudXNlcm5hbWUpO1xyXG4gICAgICAgICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLm9uKCdoaWRlLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDogbnVsbCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcbiAgICBpbWFnZVVwbG9hZEZvcm1WaWV3OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYW5FZGl0ID8gXHJcbiAgICAgICAgICAgIDxJbWFnZVVwbG9hZCBpbWFnZVVwbG9hZFVybD17dGhpcy5wcm9wcy5pbWFnZVVwbG9hZFVybH0gdXNlcm5hbWU9e3RoaXMucHJvcHMudXNlcm5hbWUgfSByZWxvYWQ9e3RoaXMubG9hZEltYWdlc0Zyb21TZXJ2ZXJ9IC8+IDpcclxuICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG4gICAgbW9kYWxWaWV3OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnN0YXRlLnNlbGVjdGVkID9cclxuICAgICAgICAgICAgICAgIDxNb2RhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e3RoaXMuc3RhdGUuc2VsZWN0ZWQuSW1hZ2VJRH1cclxuICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZT17dGhpcy5zdGF0ZS5zZWxlY3RlZC5GaWxlbmFtZSArIFwiLlwiICsgdGhpcy5zdGF0ZS5zZWxlY3RlZC5FeHRlbnNpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxVcmw9e3RoaXMuc3RhdGUuc2VsZWN0ZWQuT3JpZ2luYWxVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcHJldmlld1VybD17dGhpcy5zdGF0ZS5zZWxlY3RlZC5QcmV2aWV3VXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUltYWdlSGFuZGxlPXt0aGlzLmRlbGV0ZUltYWdlRnJvbVNlcnZlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50c1VybD17dGhpcy5wcm9wcy5jb21tZW50c1VybH1cclxuICAgICAgICAgICAgICAgICAgICAgICB1c2VyVXJsPXt0aGlzLnByb3BzLnVzZXJVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3RoaXMucHJvcHMubWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17dGhpcy5wcm9wcy5jYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgLz4gOiBudWxsKTtcclxufSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxJbWFnZUxpc3QgaW1hZ2VzPXt0aGlzLnN0YXRlLmRhdGF9IG1vZGFsSGFuZGxlPXt0aGlzLm1vZGFsSGFuZGxlfSAvPlxyXG4gICAgICAgICAgICAgICAge3RoaXMubW9kYWxWaWV3KCl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICB7dGhpcy5pbWFnZVVwbG9hZEZvcm1WaWV3KCl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
