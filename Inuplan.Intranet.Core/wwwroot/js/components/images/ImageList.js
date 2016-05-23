"use strict";

var ImageList = React.createClass({
    displayName: "ImageList",

    render: function render() {
        var commentsUrl = this.props.commentsUrl;
        var imageNodes = this.props.images.map(function (image) {
            return React.createElement(
                "div",
                { className: "col-lg-3", key: image.ImageID },
                React.createElement(Image, { data: image, key: image.ImageID, modalHandle: this.props.modalHandle })
            );
        }.bind(this));

        return React.createElement(
            "div",
            { className: "row" },
            imageNodes
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzlCLFlBQVEsa0JBQVk7QUFDaEIsWUFBSSxjQUFjLEtBQUssS0FBTCxDQUFXLFdBQTdCO0FBQ0EsWUFBSSxhQUFhLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsR0FBbEIsQ0FBc0IsVUFBVSxLQUFWLEVBQWlCO0FBQ3BELG1CQUNJO0FBQUE7Z0JBQUEsRUFBSyxXQUFVLFVBQWYsRUFBMEIsS0FBSyxNQUFNLE9BQXJDO2dCQUNJLG9CQUFDLEtBQUQsSUFBTyxNQUFNLEtBQWIsRUFBb0IsS0FBSyxNQUFNLE9BQS9CLEVBQXdDLGFBQWEsS0FBSyxLQUFMLENBQVcsV0FBaEU7QUFESixhQURKO0FBS0gsU0FOc0MsQ0FNckMsSUFOcUMsQ0FNaEMsSUFOZ0MsQ0FBdEIsQ0FBakI7O0FBUUEsZUFDQTtBQUFBO1lBQUEsRUFBSyxXQUFVLEtBQWY7WUFDSztBQURMLFNBREE7QUFJSDtBQWY2QixDQUFsQixDQUFoQiIsImZpbGUiOiJjb21wb25lbnRzL2ltYWdlcy9JbWFnZUxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW1hZ2VMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbW1lbnRzVXJsID0gdGhpcy5wcm9wcy5jb21tZW50c1VybDtcclxuICAgICAgICB2YXIgaW1hZ2VOb2RlcyA9IHRoaXMucHJvcHMuaW1hZ2VzLm1hcChmdW5jdGlvbiAoaW1hZ2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTNcIiBrZXk9e2ltYWdlLkltYWdlSUR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbWFnZSBkYXRhPXtpbWFnZX0ga2V5PXtpbWFnZS5JbWFnZUlEfSBtb2RhbEhhbmRsZT17dGhpcy5wcm9wcy5tb2RhbEhhbmRsZSB9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAge2ltYWdlTm9kZXN9XHJcbiAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
