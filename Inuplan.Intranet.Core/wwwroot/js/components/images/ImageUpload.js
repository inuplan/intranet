'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageUpload = function (_React$Component) {
    _inherits(ImageUpload, _React$Component);

    function ImageUpload(props) {
        _classCallCheck(this, ImageUpload);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ImageUpload).call(this, props));

        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }

    _createClass(ImageUpload, [{
        key: 'handleSubmit',
        value: function handleSubmit(e) {
            e.preventDefault();
            var formData = new FormData();
            formData.append('file', $('#files')[0].files[0]);
            var url = this.props.imageUploadUrl + "?username=" + this.props.username;
            $.ajax({
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                type: 'POST',
                data: formData,
                mimeType: 'multipart/form-data',
                cache: false,
                contentType: false,
                processData: false,
                success: function success(result, status, jqXhr) {
                    // Refresh page
                    window.location.reload();
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'row' },
                React.createElement('br', null),
                React.createElement(
                    'div',
                    { className: 'col-lg-4' },
                    React.createElement(
                        'form',
                        {
                            onSubmit: this.handleSubmit,
                            id: 'form-upload',
                            enctype: 'multipart/form-data' },
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                { htmlFor: 'files' },
                                'Upload filer:'
                            ),
                            React.createElement('input', { type: 'file', className: 'form-control', id: 'files', name: 'files', multiple: true })
                        ),
                        React.createElement(
                            'button',
                            { type: 'submit', className: 'btn btn-primary', id: 'upload' },
                            'Upload'
                        )
                    )
                )
            );
        }
    }]);

    return ImageUpload;
}(React.Component);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlVXBsb2FkLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sVzs7O0FBQ0YseUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLG1HQUNULEtBRFM7O0FBRWYsY0FBSyxZQUFMLEdBQW9CLE1BQUssWUFBTCxDQUFrQixJQUFsQixPQUFwQjtBQUZlO0FBR2xCOzs7O3FDQUVhLEMsRUFBRztBQUNiLGNBQUUsY0FBRjtBQUNBLGdCQUFJLFdBQVcsSUFBSSxRQUFKLEVBQWY7QUFDQSxxQkFBUyxNQUFULENBQWdCLE1BQWhCLEVBQXdCLEVBQUUsUUFBRixFQUFZLENBQVosRUFBZSxLQUFmLENBQXFCLENBQXJCLENBQXhCO0FBQ0EsZ0JBQUksTUFBTSxLQUFLLEtBQUwsQ0FBVyxjQUFYLEdBQTRCLFlBQTVCLEdBQTJDLEtBQUssS0FBTCxDQUFXLFFBQWhFO0FBQ0EsY0FBRSxJQUFGLENBQU87QUFDSCxxQkFBSyxHQURGO0FBRUgsMkJBQVc7QUFDUCxxQ0FBaUI7QUFEVixpQkFGUjtBQUtILHNCQUFNLE1BTEg7QUFNSCxzQkFBTSxRQU5IO0FBT0gsMEJBQVUscUJBUFA7QUFRSCx1QkFBTyxLQVJKO0FBU0gsNkJBQWEsS0FUVjtBQVVILDZCQUFhLEtBVlY7QUFXSCx5QkFBUyxpQkFBVSxNQUFWLEVBQWtCLE1BQWxCLEVBQTBCLEtBQTFCLEVBQWlDOztBQUV0QywyQkFBTyxRQUFQLENBQWdCLE1BQWhCO0FBQ0g7QUFkRSxhQUFQO0FBZ0JIOzs7aUNBRVE7QUFDTCxtQkFDUTtBQUFBO2dCQUFBLEVBQUssV0FBVSxLQUFmO2dCQUNJLCtCQURKO2dCQUVJO0FBQUE7b0JBQUEsRUFBSyxXQUFVLFVBQWY7b0JBQ0k7QUFBQTt3QkFBQTtBQUNNLHNDQUFVLEtBQUssWUFEckI7QUFFTSxnQ0FBRyxhQUZUO0FBR00scUNBQVEscUJBSGQ7d0JBSVE7QUFBQTs0QkFBQSxFQUFLLFdBQVUsWUFBZjs0QkFDSTtBQUFBO2dDQUFBLEVBQU8sU0FBUSxPQUFmO2dDQUFBO0FBQUEsNkJBREo7NEJBRUksK0JBQU8sTUFBSyxNQUFaLEVBQW1CLFdBQVUsY0FBN0IsRUFBNEMsSUFBRyxPQUEvQyxFQUF1RCxNQUFLLE9BQTVELEVBQW9FLGNBQXBFO0FBRkoseUJBSlI7d0JBUVE7QUFBQTs0QkFBQSxFQUFRLE1BQUssUUFBYixFQUFzQixXQUFVLGlCQUFoQyxFQUFrRCxJQUFHLFFBQXJEOzRCQUFBO0FBQUE7QUFSUjtBQURKO0FBRkosYUFEUjtBQWlCSDs7OztFQS9DcUIsTUFBTSxTIiwiZmlsZSI6ImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlVXBsb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSW1hZ2VVcGxvYWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVN1Ym1pdCAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCAkKCcjZmlsZXMnKVswXS5maWxlc1swXSk7XHJcbiAgICAgICAgdmFyIHVybCA9IHRoaXMucHJvcHMuaW1hZ2VVcGxvYWRVcmwgKyBcIj91c2VybmFtZT1cIiArIHRoaXMucHJvcHMudXNlcm5hbWU7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YTogZm9ybURhdGEsXHJcbiAgICAgICAgICAgIG1pbWVUeXBlOiAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScsXHJcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXN1bHQsIHN0YXR1cywganFYaHIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlZnJlc2ggcGFnZVxyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cImZvcm0tdXBsb2FkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jdHlwZT1cIm11bHRpcGFydC9mb3JtLWRhdGFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmaWxlc1wiPlVwbG9hZCBmaWxlcjo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImZpbGVzXCIgbmFtZT1cImZpbGVzXCIgbXVsdGlwbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBpZD1cInVwbG9hZFwiPlVwbG9hZDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
