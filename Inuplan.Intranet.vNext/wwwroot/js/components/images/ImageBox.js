'use strict';

var ImageBox = React.createClass({
    displayName: 'ImageBox',

    imagesUrl: function imagesUrl() {
        // GET /api/{Username}/Image
        return this.props.baseUrl + "";
    },
    commentsUrl: function commentsUrl(imageId) {
        // GET /api/ImageComments?imageId={id}
    },
    loadImagesFromServer: function loadImagesFromServer() {
        $.ajax({
            url: this.props.imagesUrl(),
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.imagesUrl, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function getInitialState() {
        return { data: [] };
    },
    componentDidMount: function componentDidMount() {
        this.loadImagesFromServer();
    },
    render: function render() {
        return(
            // Pass the data to ImageList component
            React.createElement('div', { className: '' })
        );
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlQm94LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDN0IsZUFBVyxxQkFBWTs7QUFFbkIsZUFBTyxLQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLEVBQTVCO0FBQ0gsS0FKNEI7QUFLN0IsaUJBQWEscUJBQVUsT0FBVixFQUFtQjs7QUFFL0IsS0FQNEI7QUFRN0IsMEJBQXNCLGdDQUFZO0FBQzlCLFVBQUUsSUFBRixDQUFPO0FBQ0gsaUJBQUssS0FBSyxLQUFMLENBQVcsU0FBWCxFQURGO0FBRUgsb0JBQVEsS0FGTDtBQUdILHNCQUFVLE1BSFA7QUFJSCxtQkFBTyxLQUpKO0FBS0gscUJBQVMsVUFBVSxJQUFWLEVBQWdCO0FBQ3JCLHFCQUFLLFFBQUwsQ0FBYyxFQUFFLE1BQU0sSUFBUixFQUFkO0FBQ0gsYUFGUSxDQUVQLElBRk8sQ0FFRixJQUZFLENBTE47QUFRSCxtQkFBTyxVQUFVLEdBQVYsRUFBZSxNQUFmLEVBQXVCLEdBQXZCLEVBQTRCO0FBQy9CLHdCQUFRLEtBQVIsQ0FBYyxLQUFLLEtBQUwsQ0FBVyxTQUF6QixFQUFvQyxNQUFwQyxFQUE0QyxJQUFJLFFBQUosRUFBNUM7QUFDSCxhQUZNLENBRUwsSUFGSyxDQUVBLElBRkE7QUFSSixTQUFQO0FBWUgsS0FyQjRCO0FBc0I3QixxQkFBaUIsMkJBQVk7QUFDekIsZUFBTyxFQUFFLE1BQU0sRUFBUixFQUFQO0FBQ0gsS0F4QjRCO0FBeUI3Qix1QkFBbUIsNkJBQVk7QUFDM0IsYUFBSyxvQkFBTDtBQUNILEtBM0I0QjtBQTRCN0IsWUFBUSxrQkFBWTtBQUNoQixjOztBQUVJLHlDQUFLLFdBQVUsRUFBZjtBQUZKO0FBSUg7QUFqQzRCLENBQWxCLENBQWYiLCJmaWxlIjoiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VCb3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW1hZ2VCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBpbWFnZXNVcmw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBHRVQgL2FwaS97VXNlcm5hbWV9L0ltYWdlXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuYmFzZVVybCArIFwiXCI7XHJcbiAgICB9LFxyXG4gICAgY29tbWVudHNVcmw6IGZ1bmN0aW9uIChpbWFnZUlkKSB7XHJcbiAgICAgICAgLy8gR0VUIC9hcGkvSW1hZ2VDb21tZW50cz9pbWFnZUlkPXtpZH1cclxuICAgIH0sXHJcbiAgICBsb2FkSW1hZ2VzRnJvbVNlcnZlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5wcm9wcy5pbWFnZXNVcmwoKSxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRhdGE6IGRhdGEgfSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIsIHN0YXR1cywgZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMucHJvcHMuaW1hZ2VzVXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgZGF0YTogW10gfTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9hZEltYWdlc0Zyb21TZXJ2ZXIoKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAvLyBQYXNzIHRoZSBkYXRhIHRvIEltYWdlTGlzdCBjb21wb25lbnRcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJcIiAvPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG59KTsiXX0=
