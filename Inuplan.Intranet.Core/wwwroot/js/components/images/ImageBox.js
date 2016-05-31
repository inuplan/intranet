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
            this.loadImagesFromServer(this.props.username);
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
                React.createElement(ImageList, {
                    images: this.state.data,
                    modalHandle: this.modalHandle
                }),
                this.modalView()
            ),
            this.imageUploadFormView()
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlQm94LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDN0IscUJBQWlCLDJCQUFZO0FBQ3pCLGVBQU87QUFDSCxrQkFBTSxFQURIO0FBRUgsc0JBQVU7QUFGUCxTQUFQO0FBSUgsS0FONEI7QUFPN0IsMkJBQXVCLCtCQUFVLE9BQVYsRUFBbUI7QUFDdEMsVUFBRSxJQUFGLENBQU87QUFDSCxpQkFBSyxLQUFLLEtBQUwsQ0FBVyxjQUFYLEdBQTRCLFlBQTVCLEdBQTJDLEtBQUssS0FBTCxDQUFXLFFBQXRELEdBQWlFLE1BQWpFLEdBQTBFLE9BRDVFO0FBRUgsb0JBQVEsUUFGTDtBQUdILHVCQUFXO0FBQ1AsaUNBQWlCO0FBRFYsYUFIUjtBQU1ILHFCQUFTLFVBQVUsSUFBVixFQUFnQjtBQUNyQixxQkFBSyxvQkFBTCxDQUEwQixLQUFLLEtBQUwsQ0FBVyxRQUFyQztBQUNILGFBRlEsQ0FFUCxJQUZPLENBRUYsSUFGRTtBQU5OLFNBQVA7QUFVSCxLQWxCNEI7QUFtQjdCLDBCQUFzQiw4QkFBVSxRQUFWLEVBQW9CO0FBQ3RDLFVBQUUsSUFBRixDQUFPO0FBQ0gsaUJBQUssS0FBSyxLQUFMLENBQVcsU0FEYjtBQUVILG9CQUFRLEtBRkw7QUFHSCxzQkFBVSxNQUhQO0FBSUgsa0JBQU0sY0FBYyxRQUpqQjtBQUtILG1CQUFPLEtBTEo7QUFNSCxxQkFBUyxVQUFVLElBQVYsRUFBZ0I7QUFDckIscUJBQUssUUFBTCxDQUFjLEVBQUUsTUFBTSxJQUFSLEVBQWQ7QUFDSCxhQUZRLENBRVAsSUFGTyxDQUVGLElBRkUsQ0FOTjtBQVNILG1CQUFPLFVBQVUsR0FBVixFQUFlLE1BQWYsRUFBdUIsR0FBdkIsRUFBNEI7QUFDL0Isd0JBQVEsS0FBUixDQUFjLEtBQUssS0FBTCxDQUFXLFNBQXpCLEVBQW9DLE1BQXBDLEVBQTRDLElBQUksUUFBSixFQUE1QztBQUNILGFBRk0sQ0FFTCxJQUZLLENBRUEsSUFGQSxDQVRKO0FBWUgsdUJBQVc7QUFDUCxpQ0FBaUI7QUFEVixhQVpSO0FBZUgseUJBQWE7QUFmVixTQUFQO0FBaUJILEtBckM0QjtBQXNDN0IsaUJBQWEscUJBQVUsS0FBVixFQUFpQjtBQUMxQixhQUFLLFFBQUwsQ0FBYztBQUNWLHNCQUFVO0FBREEsU0FBZDtBQUdBLFVBQUUsY0FBRixFQUFrQixLQUFsQixDQUF3QixNQUF4QjtBQUNILEtBM0M0QjtBQTRDN0IsdUJBQW1CLDZCQUFZO0FBQzNCLGFBQUssb0JBQUwsQ0FBMEIsS0FBSyxLQUFMLENBQVcsUUFBckM7QUFDQSxVQUFFLFNBQVMsV0FBVCxDQUFxQixJQUFyQixDQUFGLEVBQThCLEVBQTlCLENBQWlDLGVBQWpDLEVBQWtELFVBQVUsQ0FBVixFQUFhO0FBQzNELGlCQUFLLFFBQUwsQ0FBYztBQUNWLDBCQUFVO0FBREEsYUFBZDtBQUdBLGlCQUFLLG9CQUFMLENBQTBCLEtBQUssS0FBTCxDQUFXLFFBQXJDO0FBQ0gsU0FMaUQsQ0FLaEQsSUFMZ0QsQ0FLM0MsSUFMMkMsQ0FBbEQ7QUFNSCxLQXBENEI7QUFxRDdCLHlCQUFxQiwrQkFBWTtBQUM3QixlQUNJLEtBQUssS0FBTCxDQUFXLE9BQVgsR0FDQSxvQkFBQyxXQUFELElBQWEsZ0JBQWdCLEtBQUssS0FBTCxDQUFXLGNBQXhDLEVBQXdELFVBQVUsS0FBSyxLQUFMLENBQVcsUUFBN0UsRUFBd0YsUUFBUSxLQUFLLG9CQUFyRyxHQURBLEdBRUEsSUFISjtBQUtILEtBM0Q0QjtBQTREN0IsZUFBVyxxQkFBWTtBQUNuQixlQUFRLEtBQUssS0FBTCxDQUFXLFFBQVgsR0FDQSxvQkFBQyxLQUFEO0FBQ08scUJBQVMsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixPQURwQztBQUVPLHNCQUFVLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsUUFBcEIsR0FBK0IsR0FBL0IsR0FBcUMsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixTQUYxRTtBQUdPLHlCQUFhLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsV0FIeEM7QUFJTyx3QkFBWSxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFVBSnZDO0FBS08sK0JBQW1CLEtBQUsscUJBTC9CO0FBTU8seUJBQWEsS0FBSyxLQUFMLENBQVcsV0FOL0I7QUFPTyxxQkFBUyxLQUFLLEtBQUwsQ0FBVyxPQVAzQjtBQVFPLHNCQUFVLEtBQUssS0FBTCxDQUFXLEVBUjVCO0FBU08scUJBQVMsS0FBSyxLQUFMLENBQVc7QUFUM0IsVUFEQSxHQVdLLElBWGI7QUFZUCxLQXpFZ0M7QUEwRTdCLFlBQVEsa0JBQVk7QUFDaEIsZUFDQTtBQUFBO1lBQUEsRUFBSyxXQUFVLEtBQWY7WUFDSTtBQUFBO2dCQUFBLEVBQUssV0FBVSxLQUFmO2dCQUNJLG9CQUFDLFNBQUQ7QUFDVSw0QkFBUSxLQUFLLEtBQUwsQ0FBVyxJQUQ3QjtBQUVVLGlDQUFhLEtBQUs7QUFGNUIsa0JBREo7Z0JBS0ssS0FBSyxTQUFMO0FBTEwsYUFESjtZQVFLLEtBQUssbUJBQUw7QUFSTCxTQURBO0FBWUg7QUF2RjRCLENBQWxCLENBQWYiLCJmaWxlIjoiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VCb3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW1hZ2VCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG51bGwsXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBkZWxldGVJbWFnZUZyb21TZXJ2ZXI6IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmRlbGV0ZUltYWdlVXJsICsgXCI/dXNlcm5hbWU9XCIgKyB0aGlzLnByb3BzLnVzZXJuYW1lICsgXCImaWQ9XCIgKyBpbWFnZUlkLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSW1hZ2VzRnJvbVNlcnZlcih0aGlzLnByb3BzLnVzZXJuYW1lKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBsb2FkSW1hZ2VzRnJvbVNlcnZlcjogZnVuY3Rpb24gKHVzZXJuYW1lKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmltYWdlc1VybCxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YTogXCJ1c2VybmFtZT1cIiArIHVzZXJuYW1lLFxyXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGF0YTogZGF0YSB9KTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5wcm9wcy5pbWFnZXNVcmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG1vZGFsSGFuZGxlOiBmdW5jdGlvbiAoaW1hZ2UpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IGltYWdlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjbW9kYWxXaW5kb3dcIikubW9kYWwoXCJzaG93XCIpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkSW1hZ2VzRnJvbVNlcnZlcih0aGlzLnByb3BzLnVzZXJuYW1lKTtcclxuICAgICAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5vbignaGlkZS5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IG51bGwsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRJbWFnZXNGcm9tU2VydmVyKHRoaXMucHJvcHMudXNlcm5hbWUpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG4gICAgaW1hZ2VVcGxvYWRGb3JtVmlldzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2FuRWRpdCA/IFxyXG4gICAgICAgICAgICA8SW1hZ2VVcGxvYWQgaW1hZ2VVcGxvYWRVcmw9e3RoaXMucHJvcHMuaW1hZ2VVcGxvYWRVcmx9IHVzZXJuYW1lPXt0aGlzLnByb3BzLnVzZXJuYW1lIH0gcmVsb2FkPXt0aGlzLmxvYWRJbWFnZXNGcm9tU2VydmVyfSAvPiA6XHJcbiAgICAgICAgICAgIG51bGxcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuICAgIG1vZGFsVmlldzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5zdGF0ZS5zZWxlY3RlZCA/XHJcbiAgICAgICAgICAgICAgICA8TW9kYWxcclxuICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXt0aGlzLnN0YXRlLnNlbGVjdGVkLkltYWdlSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU9e3RoaXMuc3RhdGUuc2VsZWN0ZWQuRmlsZW5hbWUgKyBcIi5cIiArIHRoaXMuc3RhdGUuc2VsZWN0ZWQuRXh0ZW5zaW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVXJsPXt0aGlzLnN0YXRlLnNlbGVjdGVkLk9yaWdpbmFsVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgIHByZXZpZXdVcmw9e3RoaXMuc3RhdGUuc2VsZWN0ZWQuUHJldmlld1VybH1cclxuICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVJbWFnZUhhbmRsZT17dGhpcy5kZWxldGVJbWFnZUZyb21TZXJ2ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudHNVcmw9e3RoaXMucHJvcHMuY29tbWVudHNVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdXNlclVybD17dGhpcy5wcm9wcy51c2VyVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt0aGlzLnByb3BzLm1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e3RoaXMucHJvcHMuY2FuRWRpdH1cclxuICAgICAgICAgICAgICAgIC8+IDogbnVsbCk7XHJcbn0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8SW1hZ2VMaXN0IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlcz17dGhpcy5zdGF0ZS5kYXRhfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsSGFuZGxlPXt0aGlzLm1vZGFsSGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIHt0aGlzLm1vZGFsVmlldygpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAge3RoaXMuaW1hZ2VVcGxvYWRGb3JtVmlldygpfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
