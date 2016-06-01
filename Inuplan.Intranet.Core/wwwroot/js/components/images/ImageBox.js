"use strict";

var ImageBox = React.createClass({
    displayName: "ImageBox",

    getInitialState: function getInitialState() {
        return {
            data: [],
            selected: null,
            user: {
                DisplayName: this.props.me
            }
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
    loadUser: function loadUser(username) {
        $.ajax({
            url: this.props.userUrl,
            data: { username: username },
            method: 'GET',
            success: function (data) {
                this.setState({ user: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.userUrl, status, err.toString());
            }.bind(this),
            xhrFields: {
                withCredentials: true
            }
        });
    },
    modalHandle: function modalHandle(image) {
        this.setState({
            selected: image
        });
        $("#modalWindow").modal("show");
    },
    hideModal: function hideModal() {
        this.setState({
            selected: null
        });
        this.loadImagesFromServer(this.props.username);
    },
    componentWillMount: function componentWillMount() {
        this.loadUser(this.props.username);
        this.loadImagesFromServer(this.props.username);
    },
    componentDidMount: function componentDidMount() {
        $(ReactDOM.findDOMNode(this)).on('hide.bs.modal', this.hideModal);
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
            userId: this.state.user.ID,
            canEdit: this.props.canEdit
        }) : null;
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-lg-12" },
                React.createElement(
                    "h1",
                    null,
                    this.state.user.DisplayName,
                    " ",
                    React.createElement(
                        "small",
                        null,
                        "billede galleri"
                    )
                ),
                React.createElement("hr", null),
                React.createElement(ImageList, {
                    images: this.state.data,
                    modalHandle: this.modalHandle
                }),
                this.modalView(),
                this.imageUploadFormView()
            )
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlQm94LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDN0IscUJBQWlCLDJCQUFZO0FBQ3pCLGVBQU87QUFDSCxrQkFBTSxFQURIO0FBRUgsc0JBQVUsSUFGUDtBQUdILGtCQUFNO0FBQ0YsNkJBQWEsS0FBSyxLQUFMLENBQVc7QUFEdEI7QUFISCxTQUFQO0FBT0gsS0FUNEI7QUFVN0IsMkJBQXVCLCtCQUFVLE9BQVYsRUFBbUI7QUFDdEMsVUFBRSxJQUFGLENBQU87QUFDSCxpQkFBSyxLQUFLLEtBQUwsQ0FBVyxjQUFYLEdBQTRCLFlBQTVCLEdBQTJDLEtBQUssS0FBTCxDQUFXLFFBQXRELEdBQWlFLE1BQWpFLEdBQTBFLE9BRDVFO0FBRUgsb0JBQVEsUUFGTDtBQUdILHVCQUFXO0FBQ1AsaUNBQWlCO0FBRFYsYUFIUjtBQU1ILHFCQUFTLFVBQVUsSUFBVixFQUFnQjtBQUNyQixxQkFBSyxvQkFBTCxDQUEwQixLQUFLLEtBQUwsQ0FBVyxRQUFyQztBQUNILGFBRlEsQ0FFUCxJQUZPLENBRUYsSUFGRTtBQU5OLFNBQVA7QUFVSCxLQXJCNEI7QUFzQjdCLDBCQUFzQiw4QkFBVSxRQUFWLEVBQW9CO0FBQ3RDLFVBQUUsSUFBRixDQUFPO0FBQ0gsaUJBQUssS0FBSyxLQUFMLENBQVcsU0FEYjtBQUVILG9CQUFRLEtBRkw7QUFHSCxzQkFBVSxNQUhQO0FBSUgsa0JBQU0sY0FBYyxRQUpqQjtBQUtILG1CQUFPLEtBTEo7QUFNSCxxQkFBUyxVQUFVLElBQVYsRUFBZ0I7QUFDckIscUJBQUssUUFBTCxDQUFjLEVBQUUsTUFBTSxJQUFSLEVBQWQ7QUFDSCxhQUZRLENBRVAsSUFGTyxDQUVGLElBRkUsQ0FOTjtBQVNILG1CQUFPLFVBQVUsR0FBVixFQUFlLE1BQWYsRUFBdUIsR0FBdkIsRUFBNEI7QUFDL0Isd0JBQVEsS0FBUixDQUFjLEtBQUssS0FB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QUwsQ0FBVyxJQUFYLENBQWdCLFdBQXJCO29CQUFBO29CQUFrQztBQUFBO3dCQUFBO3dCQUFBO0FBQUE7QUFBbEMsaUJBREo7Z0JBRUksK0JBRko7Z0JBR0ksb0JBQUMsU0FBRDtBQUNVLDRCQUFRLEtBQUssS0FBTCxDQUFXLElBRDdCO0FBRVUsaUNBQWEsS0FBSztBQUY1QixrQkFISjtnQkFPSyxLQUFLLFNBQUwsRUFQTDtnQkFRSyxLQUFLLG1CQUFMO0FBUkw7QUFESixTQURBO0FBY0g7QUEvRzRCLENBQWxCLENBQWYiLCJmaWxlIjoiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VCb3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW1hZ2VCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG51bGwsXHJcbiAgICAgICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgICAgIERpc3BsYXlOYW1lOiB0aGlzLnByb3BzLm1lXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBkZWxldGVJbWFnZUZyb21TZXJ2ZXI6IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmRlbGV0ZUltYWdlVXJsICsgXCI/dXNlcm5hbWU9XCIgKyB0aGlzLnByb3BzLnVzZXJuYW1lICsgXCImaWQ9XCIgKyBpbWFnZUlkLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSW1hZ2VzRnJvbVNlcnZlcih0aGlzLnByb3BzLnVzZXJuYW1lKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBsb2FkSW1hZ2VzRnJvbVNlcnZlcjogZnVuY3Rpb24gKHVzZXJuYW1lKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLnByb3BzLmltYWdlc1VybCxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YTogXCJ1c2VybmFtZT1cIiArIHVzZXJuYW1lLFxyXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGF0YTogZGF0YSB9KTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5wcm9wcy5pbWFnZXNVcmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGxvYWRVc2VyOiBmdW5jdGlvbiAodXNlcm5hbWUpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHRoaXMucHJvcHMudXNlclVybCxcclxuICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdXNlcm5hbWUgfSxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB1c2VyOiBkYXRhIH0pO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLnVzZXJVcmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBtb2RhbEhhbmRsZTogZnVuY3Rpb24gKGltYWdlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkOiBpbWFnZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKFwiI21vZGFsV2luZG93XCIpLm1vZGFsKFwic2hvd1wiKTtcclxuICAgIH0sXHJcbiAgICBoaWRlTW9kYWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG51bGwsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5sb2FkSW1hZ2VzRnJvbVNlcnZlcih0aGlzLnByb3BzLnVzZXJuYW1lKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvYWRVc2VyKHRoaXMucHJvcHMudXNlcm5hbWUpO1xyXG4gICAgICAgIHRoaXMubG9hZEltYWdlc0Zyb21TZXJ2ZXIodGhpcy5wcm9wcy51c2VybmFtZSk7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5vbignaGlkZS5icy5tb2RhbCcsIHRoaXMuaGlkZU1vZGFsKTtcclxuICAgIH0sXHJcbiAgICBpbWFnZVVwbG9hZEZvcm1WaWV3OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jYW5FZGl0ID8gXHJcbiAgICAgICAgICAgIDxJbWFnZVVwbG9hZCBpbWFnZVVwbG9hZFVybD17dGhpcy5wcm9wcy5pbWFnZVVwbG9hZFVybH0gdXNlcm5hbWU9e3RoaXMucHJvcHMudXNlcm5hbWUgfSByZWxvYWQ9e3RoaXMubG9hZEltYWdlc0Zyb21TZXJ2ZXJ9IC8+IDpcclxuICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG4gICAgbW9kYWxWaWV3OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnN0YXRlLnNlbGVjdGVkID9cclxuICAgICAgICAgICAgICAgIDxNb2RhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e3RoaXMuc3RhdGUuc2VsZWN0ZWQuSW1hZ2VJRH1cclxuICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZT17dGhpcy5zdGF0ZS5zZWxlY3RlZC5GaWxlbmFtZSArIFwiLlwiICsgdGhpcy5zdGF0ZS5zZWxlY3RlZC5FeHRlbnNpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxVcmw9e3RoaXMuc3RhdGUuc2VsZWN0ZWQuT3JpZ2luYWxVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcHJldmlld1VybD17dGhpcy5zdGF0ZS5zZWxlY3RlZC5QcmV2aWV3VXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUltYWdlSGFuZGxlPXt0aGlzLmRlbGV0ZUltYWdlRnJvbVNlcnZlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50c1VybD17dGhpcy5wcm9wcy5jb21tZW50c1VybH1cclxuICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ9e3RoaXMuc3RhdGUudXNlci5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXt0aGlzLnByb3BzLmNhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAvPiA6IG51bGwpO1xyXG59LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPGgxPnt0aGlzLnN0YXRlLnVzZXIuRGlzcGxheU5hbWV9IDxzbWFsbD5iaWxsZWRlIGdhbGxlcmk8L3NtYWxsPjwvaDE+XHJcbiAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgIDxJbWFnZUxpc3QgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VzPXt0aGlzLnN0YXRlLmRhdGF9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxIYW5kbGU9e3RoaXMubW9kYWxIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAge3RoaXMubW9kYWxWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5pbWFnZVVwbG9hZEZvcm1WaWV3KCl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
