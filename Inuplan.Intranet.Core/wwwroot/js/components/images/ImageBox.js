"use strict";

var ImageBox = React.createClass({
    displayName: "ImageBox",

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
    getInitialState: function getInitialState() {
        return {
            data: [],
            selected: {
                Filename: '',
                OriginalUrl: '',
                PreviewUrl: '',
                ImageID: -1
            }
        };
    },
    componentDidMount: function componentDidMount() {
        var username = this.props.username;
        this.loadImagesFromServer(username);
    },
    imageUploadForm: function imageUploadForm() {
        return React.createElement(ImageUpload, { imageUploadUrl: this.props.imageUploadUrl, username: this.props.username });
    },
    render: function render() {
        return(
            // Pass the data to ImageList component
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(ImageList, { images: this.state.data, modalHandle: this.modalHandle }),
                    React.createElement(Modal, { image: this.state.selected, commentsUrl: this.props.commentsUrl, canEdit: this.props.canEdit, deleteHandle: this.deleteImageFromServer })
                ),
                this.props.canEdit ? this.imageUploadForm() : ''
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlQm94LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDN0IsMkJBQXVCLCtCQUFVLE9BQVYsRUFBbUI7QUFDdEMsVUFBRSxJQUFGLENBQU87QUFDSCxpQkFBSyxLQUFLLEtBQUwsQ0FBVyxjQUFYLEdBQTRCLFlBQTVCLEdBQTJDLEtBQUssS0FBTCxDQUFXLFFBQXRELEdBQWlFLE1BQWpFLEdBQTBFLE9BRDVFO0FBRUgsb0JBQVEsUUFGTDtBQUdILHVCQUFXO0FBQ1AsaUNBQWlCO0FBRFYsYUFIUjtBQU1ILHFCQUFTLFVBQVUsSUFBVixFQUFnQjtBQUNyQixxQkFBSyxvQkFBTCxDQUEwQixLQUFLLEtBQUwsQ0FBVyxRQUFyQztBQUNILGFBRlEsQ0FFUCxJQUZPLENBRUYsSUFGRTtBQU5OLFNBQVA7QUFVSCxLQVo0QjtBQWE3QiwwQkFBc0IsOEJBQVUsUUFBVixFQUFvQjtBQUN0QyxVQUFFLElBQUYsQ0FBTztBQUNILGlCQUFLLEtBQUssS0FBTCxDQUFXLFNBRGI7QUFFSCxvQkFBUSxLQUZMO0FBR0gsc0JBQVUsTUFIUDtBQUlILGtCQUFNLGNBQWMsUUFKakI7QUFLSCxtQkFBTyxLQUxKO0FBTUgscUJBQVMsVUFBVSxJQUFWLEVBQWdCO0FBQ3JCLHFCQUFLLFFBQUwsQ0FBYyxFQUFFLE1BQU0sSUFBUixFQUFkO0FBQ0gsYUFGUSxDQUVQLElBRk8sQ0FFRixJQUZFLENBTk47QUFTSCxtQkFBTyxVQUFVLEdBQVYsRUFBZSxNQUFmLEVBQXVCLEdBQXZCLEVBQTRCO0FBQy9CLHdCQUFRLEtBQVIsQ0FBYyxLQUFLLEtBQUwsQ0FBVyxTQUF6QixFQUFvQyxNQUFwQyxFQUE0QyxJQUFJLFFBQUosRUFBNUM7QUFDSCxhQUZNLENBRUwsSUFGSyxDQUVBLElBRkEsQ0FUSjtBQVlILHVCQUFXO0FBQ1AsaUNBQWlCO0FBRFYsYUFaUjtBQWVILHlCQUFhO0FBZlYsU0FBUDtBQWlCSCxLQS9CNEI7QUFnQzdCLGlCQUFhLHFCQUFTLEtBQVQsRUFBZ0I7QUFDekIsYUFBSyxRQUFMLENBQWM7QUFDVixzQkFBVTtBQURBLFNBQWQ7QUFHQSxVQUFFLGNBQUYsRUFBa0IsS0FBbEIsQ0FBd0IsTUFBeEI7QUFDSCxLQXJDNEI7QUFzQzdCLHFCQUFpQiwyQkFBWTtBQUN6QixlQUFPO0FBQ0gsa0JBQU0sRUFESDtBQUVILHNCQUFVO0FBQ04sMEJBQVUsRUFESjtBQUVOLDZCQUFhLEVBRlA7QUFHTiw0QkFBWSxFQUhOO0FBSU4seUJBQVMsQ0FBQztBQUpKO0FBRlAsU0FBUDtBQVNILEtBaEQ0QjtBQWlEN0IsdUJBQW1CLDZCQUFZO0FBQzNCLFlBQUksV0FBVyxLQUFLLEtBQUwsQ0FBVyxRQUExQjtBQUNBLGFBQUssb0JBQUwsQ0FBMEIsUUFBMUI7QUFDSCxLQXBENEI7QUFxRDdCLHFCQUFpQiwyQkFBVztBQUN4QixlQUNJLG9CQUFDLFdBQUQsSUFBYSxnQkFBZ0IsS0FBSyxLQUFMLENBQVcsY0FBeEMsRUFBd0QsVUFBVSxLQUFLLEtBQUwsQ0FBVyxRQUE3RSxHQURKO0FBR0gsS0F6RDRCO0FBMEQ3QixZQUFRLGtCQUFZO0FBQ2hCLGM7O0FBRUk7QUFBQTtnQkFBQSxFQUFLLFdBQVUsS0FBZjtnQkFDSTtBQUFBO29CQUFBLEVBQUssV0FBVSxLQUFmO29CQUNJLG9CQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUssS0FBTCxDQUFXLElBQTlCLEVBQW9DLGFBQWEsS0FBSyxXQUF0RCxHQURKO29CQUVJLG9CQUFDLEtBQUQsSUFBTyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQXpCLEVBQW1DLGFBQWEsS0FBSyxLQUFMLENBQVcsV0FBM0QsRUFBd0UsU0FBUyxLQUFLLEtBQUwsQ0FBVyxPQUE1RixFQUFxRyxjQUFjLEtBQUsscUJBQXhIO0FBRkosaUJBREo7Z0JBS0ssS0FBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixLQUFLLGVBQUwsRUFBckIsR0FBOEM7QUFMbkQ7QUFGSjtBQVVIO0FBckU0QixDQUFsQixDQUFmIiwiZmlsZSI6ImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlQm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEltYWdlQm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgZGVsZXRlSW1hZ2VGcm9tU2VydmVyOiBmdW5jdGlvbiAoaW1hZ2VJZCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5wcm9wcy5kZWxldGVJbWFnZVVybCArIFwiP3VzZXJuYW1lPVwiICsgdGhpcy5wcm9wcy51c2VybmFtZSArIFwiJmlkPVwiICsgaW1hZ2VJZCxcclxuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEltYWdlc0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy51c2VybmFtZSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgbG9hZEltYWdlc0Zyb21TZXJ2ZXI6IGZ1bmN0aW9uICh1c2VybmFtZSkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5wcm9wcy5pbWFnZXNVcmwsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IFwidXNlcm5hbWU9XCIgKyB1c2VybmFtZSxcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRhdGE6IGRhdGEgfSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIsIHN0YXR1cywgZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMucHJvcHMuaW1hZ2VzVXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBtb2RhbEhhbmRsZTogZnVuY3Rpb24oaW1hZ2UpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IGltYWdlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIiNtb2RhbFdpbmRvd1wiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICB9LFxyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgIHNlbGVjdGVkOiB7XHJcbiAgICAgICAgICAgICAgICBGaWxlbmFtZTogJycsXHJcbiAgICAgICAgICAgICAgICBPcmlnaW5hbFVybDogJycsXHJcbiAgICAgICAgICAgICAgICBQcmV2aWV3VXJsOiAnJyxcclxuICAgICAgICAgICAgICAgIEltYWdlSUQ6IC0xLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB1c2VybmFtZSA9IHRoaXMucHJvcHMudXNlcm5hbWU7XHJcbiAgICAgICAgdGhpcy5sb2FkSW1hZ2VzRnJvbVNlcnZlcih1c2VybmFtZSk7XHJcbiAgICB9LFxyXG4gICAgaW1hZ2VVcGxvYWRGb3JtOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8SW1hZ2VVcGxvYWQgaW1hZ2VVcGxvYWRVcmw9e3RoaXMucHJvcHMuaW1hZ2VVcGxvYWRVcmx9IHVzZXJuYW1lPXt0aGlzLnByb3BzLnVzZXJuYW1lIH0gLz5cclxuICAgICAgICApO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIC8vIFBhc3MgdGhlIGRhdGEgdG8gSW1hZ2VMaXN0IGNvbXBvbmVudFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8SW1hZ2VMaXN0IGltYWdlcz17dGhpcy5zdGF0ZS5kYXRhfSBtb2RhbEhhbmRsZT17dGhpcy5tb2RhbEhhbmRsZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8TW9kYWwgaW1hZ2U9e3RoaXMuc3RhdGUuc2VsZWN0ZWR9IGNvbW1lbnRzVXJsPXt0aGlzLnByb3BzLmNvbW1lbnRzVXJsfSBjYW5FZGl0PXt0aGlzLnByb3BzLmNhbkVkaXR9IGRlbGV0ZUhhbmRsZT17dGhpcy5kZWxldGVJbWFnZUZyb21TZXJ2ZXJ9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNhbkVkaXQgPyB0aGlzLmltYWdlVXBsb2FkRm9ybSgpIDogJyd9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
