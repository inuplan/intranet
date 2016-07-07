"use strict";

var CommentProfile = React.createClass({
    displayName: "CommentProfile",

    render: function render() {
        return React.createElement(
            "div",
            { className: "media-left" },
            React.createElement("img", { className: "media-object img-rounded",
                src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTRkZThkNTU3NiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1NGRlOGQ1NTc2Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxNC41IiB5PSIzNi41Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==",
                "data-holder-rendered": "true",
                style: { width: "64px", height: "64px" } }),
            this.props.children
        );
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxpQkFBaUIsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ25DLFlBQVEsa0JBQVk7QUFDaEIsZUFDSTtBQUFBO1lBQUEsRUFBSyxXQUFVLFlBQWY7WUFDSSw2QkFBSyxXQUFVLDBCQUFmO0FBQ0kscUJBQUksdzJCQURSO0FBRUksd0NBQXFCLE1BRnpCO0FBR0ksdUJBQU8sRUFBRSxPQUFPLE1BQVQsRUFBaUIsUUFBUSxNQUF6QixFQUhYLEdBREo7WUFNSyxLQUFLLEtBQUwsQ0FBVztBQU5oQixTQURKO0FBU0g7QUFYa0MsQ0FBbEIsQ0FBckIiLCJmaWxlIjoiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50UHJvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBDb21tZW50UHJvZmlsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJtZWRpYS1vYmplY3QgaW1nLXJvdW5kZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaVZWUkdMVGdpSUhOMFlXNWtZV3h2Ym1VOUlubGxjeUkvUGp4emRtY2dlRzFzYm5NOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6SXdNREF2YzNabklpQjNhV1IwYUQwaU5qUWlJR2hsYVdkb2REMGlOalFpSUhacFpYZENiM2c5SWpBZ01DQTJOQ0EyTkNJZ2NISmxjMlZ5ZG1WQmMzQmxZM1JTWVhScGJ6MGlibTl1WlNJK1BDRXRMUXBUYjNWeVkyVWdWVkpNT2lCb2IyeGtaWEl1YW5Ndk5qUjROalFLUTNKbFlYUmxaQ0IzYVhSb0lFaHZiR1JsY2k1cWN5QXlMall1TUM0S1RHVmhjbTRnYlc5eVpTQmhkQ0JvZEhSd09pOHZhRzlzWkdWeWFuTXVZMjl0Q2loaktTQXlNREV5TFRJd01UVWdTWFpoYmlCTllXeHZjR2x1YzJ0NUlDMGdhSFIwY0RvdkwybHRjMnQ1TG1OdkNpMHRQanhrWldaelBqeHpkSGxzWlNCMGVYQmxQU0owWlhoMEwyTnpjeUkrUENGYlEwUkJWRUZiSTJodmJHUmxjbDh4TlRSa1pUaGtOVFUzTmlCMFpYaDBJSHNnWm1sc2JEb2pRVUZCUVVGQk8yWnZiblF0ZDJWcFoyaDBPbUp2YkdRN1ptOXVkQzFtWVcxcGJIazZRWEpwWVd3c0lFaGxiSFpsZEdsallTd2dUM0JsYmlCVFlXNXpMQ0J6WVc1ekxYTmxjbWxtTENCdGIyNXZjM0JoWTJVN1ptOXVkQzF6YVhwbE9qRXdjSFFnZlNCZFhUNDhMM04wZVd4bFBqd3ZaR1ZtY3o0OFp5QnBaRDBpYUc5c1pHVnlYekUxTkdSbE9HUTFOVGMySWo0OGNtVmpkQ0IzYVdSMGFEMGlOalFpSUdobGFXZG9kRDBpTmpRaUlHWnBiR3c5SWlORlJVVkZSVVVpTHo0OFp6NDhkR1Y0ZENCNFBTSXhOQzQxSWlCNVBTSXpOaTQxSWo0Mk5IZzJORHd2ZEdWNGRENDhMMmMrUEM5blBqd3ZjM1puUGc9PVwiXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1ob2xkZXItcmVuZGVyZWQ9XCJ0cnVlXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogXCI2NHB4XCIsIGhlaWdodDogXCI2NHB4XCIgfVxyXG4gICAgICAgICAgICAgICAgfSAvPlxyXG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
