'use strict';

// Images: GET /api/userimage/getall&username={username}
// Comment: GET /api/imagecomment?imageId={id}
var ImageBox = React.createClass({
    displayName: 'ImageBox',

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
    render: function render() {
        return(
            // Pass the data to ImageList component
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(ImageList, { images: this.state.data, modalHandle: this.modalHandle }),
                React.createElement(Modal, { image: this.state.selected, commentsUrl: this.props.commentsUrl })
            )
        );
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlQm94LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsSUFBSSxXQUFXLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUM3QiwwQkFBc0IsOEJBQVUsUUFBVixFQUFvQjtBQUN0QyxVQUFFLElBQUYsQ0FBTztBQUNILGlCQUFLLEtBQUssS0FBTCxDQUFXLFNBRGI7QUFFSCxvQkFBUSxLQUZMO0FBR0gsc0JBQVUsTUFIUDtBQUlILGtCQUFNLGNBQWMsUUFKakI7QUFLSCxtQkFBTyxLQUxKO0FBTUgscUJBQVMsVUFBVSxJQUFWLEVBQWdCO0FBQ3JCLHFCQUFLLFFBQUwsQ0FBYyxFQUFFLE1BQU0sSUFBUixFQUFkO0FBQ0gsYUFGUSxDQUVQLElBRk8sQ0FFRixJQUZFLENBTk47QUFTSCxtQkFBTyxVQUFVLEdBQVYsRUFBZSxNQUFmLEVBQXVCLEdBQXZCLEVBQTRCO0FBQy9CLHdCQUFRLEtBQVIsQ0FBYyxLQUFLLEtBQUwsQ0FBVyxTQUF6QixFQUFvQyxNQUFwQyxFQUE0QyxJQUFJLFFBQUosRUFBNUM7QUFDSCxhQUZNLENBRUwsSUFGSyxDQUVBLElBRkEsQ0FUSjtBQVlILHVCQUFXO0FBQ1AsaUNBQWlCO0FBRFYsYUFaUjtBQWVILHlCQUFhO0FBZlYsU0FBUDtBQWlCSCxLQW5CNEI7QUFvQjdCLGlCQUFhLHFCQUFTLEtBQVQsRUFBZ0I7QUFDekIsYUFBSyxRQUFMLENBQWM7QUFDVixzQkFBVTtBQURBLFNBQWQ7QUFHQSxVQUFFLGNBQUYsRUFBa0IsS0FBbEIsQ0FBd0IsTUFBeEI7QUFDSCxLQXpCNEI7QUEwQjdCLHFCQUFpQiwyQkFBWTtBQUN6QixlQUFPO0FBQ0gsa0JBQU0sRUFESDtBQUVILHNCQUFVO0FBQ04sMEJBQVUsRUFESjtBQUVOLDZCQUFhLEVBRlA7QUFHTiw0QkFBWSxFQUhOO0FBSU4seUJBQVMsQ0FBQztBQUpKO0FBRlAsU0FBUDtBQVNILEtBcEM0QjtBQXFDN0IsdUJBQW1CLDZCQUFZO0FBQzNCLFlBQUksV0FBVyxLQUFLLEtBQUwsQ0FBVyxRQUExQjtBQUNBLGFBQUssb0JBQUwsQ0FBMEIsUUFBMUI7QUFDSCxLQXhDNEI7QUF5QzdCLFlBQVEsa0JBQVk7QUFDaEIsYzs7QUFFSTtBQUFBO2dCQUFBLEVBQUssV0FBVSxLQUFmO2dCQUNJLG9CQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUssS0FBTCxDQUFXLElBQTlCLEVBQW9DLGFBQWEsS0FBSyxXQUF0RCxHQURKO2dCQUVJLG9CQUFDLEtBQUQsSUFBTyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQXpCLEVBQW1DLGFBQWEsS0FBSyxLQUFMLENBQVcsV0FBM0Q7QUFGSjtBQUZKO0FBT0g7QUFqRDRCLENBQWxCLENBQWYiLCJmaWxlIjoiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VCb3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbWFnZXM6IEdFVCAvYXBpL3VzZXJpbWFnZS9nZXRhbGwmdXNlcm5hbWU9e3VzZXJuYW1lfVxyXG4vLyBDb21tZW50OiBHRVQgL2FwaS9pbWFnZWNvbW1lbnQ/aW1hZ2VJZD17aWR9XHJcbnZhciBJbWFnZUJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGxvYWRJbWFnZXNGcm9tU2VydmVyOiBmdW5jdGlvbiAodXNlcm5hbWUpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHRoaXMucHJvcHMuaW1hZ2VzVXJsLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiBcInVzZXJuYW1lPVwiICsgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkYXRhOiBkYXRhIH0pO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLmltYWdlc1VybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgbW9kYWxIYW5kbGU6IGZ1bmN0aW9uKGltYWdlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkOiBpbWFnZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjbW9kYWxXaW5kb3dcIikubW9kYWwoXCJzaG93XCIpO1xyXG4gICAgfSxcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICBzZWxlY3RlZDoge1xyXG4gICAgICAgICAgICAgICAgRmlsZW5hbWU6ICcnLFxyXG4gICAgICAgICAgICAgICAgT3JpZ2luYWxVcmw6ICcnLFxyXG4gICAgICAgICAgICAgICAgUHJldmlld1VybDogJycsXHJcbiAgICAgICAgICAgICAgICBJbWFnZUlEOiAtMSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdXNlcm5hbWUgPSB0aGlzLnByb3BzLnVzZXJuYW1lO1xyXG4gICAgICAgIHRoaXMubG9hZEltYWdlc0Zyb21TZXJ2ZXIodXNlcm5hbWUpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIC8vIFBhc3MgdGhlIGRhdGEgdG8gSW1hZ2VMaXN0IGNvbXBvbmVudFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPEltYWdlTGlzdCBpbWFnZXM9e3RoaXMuc3RhdGUuZGF0YX0gbW9kYWxIYW5kbGU9e3RoaXMubW9kYWxIYW5kbGV9IC8+XHJcbiAgICAgICAgICAgICAgICA8TW9kYWwgaW1hZ2U9e3RoaXMuc3RhdGUuc2VsZWN0ZWR9IGNvbW1lbnRzVXJsPXt0aGlzLnByb3BzLmNvbW1lbnRzVXJsfSAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxufSk7Il19
