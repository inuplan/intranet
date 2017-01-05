'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var ReactDOM = require('react-dom');
var reactRedux = require('react-redux');
var reactBootstrap = require('react-bootstrap');
var reactRouter = require('react-router');
var marked = require('marked');
var removeMd = _interopDefault(require('remove-markdown'));
var fetch = require('isomorphic-fetch');
var underscore = require('underscore');
var redux = require('redux');
var thunk = _interopDefault(require('redux-thunk'));
var es6Promise = require('es6-promise');
var es6ObjectAssign = require('es6-object-assign');

var Error = (function (superclass) {
    function Error () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) Error.__proto__ = superclass;
    Error.prototype = Object.create( superclass && superclass.prototype );
    Error.prototype.constructor = Error;

    Error.prototype.render = function render () {
        var ref = this.props;
        var clearError = ref.clearError;
        var title = ref.title;
        var message = ref.message;
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Col, { lgOffset: 2, lg: 8 },
                React.createElement(reactBootstrap.Alert, { bsStyle: "danger", onDismiss: clearError },
                    React.createElement("strong", null, title),
                    React.createElement("p", null, message))));
    };

    return Error;
}(React.Component));

var setHasError = function (hasError) {
    return {
        type: 0,
        payload: hasError
    };
};
var setErrorTitle = function (title) {
    return {
        type: 1,
        payload: title
    };
};
var clearErrorTitle = function () {
    return {
        type: 2
    };
};
var clearErrorMessage = function () {
    return {
        type: 4
    };
};
var setErrorMessage = function (message) {
    return {
        type: 3,
        payload: message
    };
};
var setError = function (error) {
    return function (dispatch) {
        dispatch(setHasError(true));
        dispatch(setErrorTitle(error.title));
        dispatch(setErrorMessage(error.message));
        return Promise.resolve();
    };
};
var clearError = function () {
    return function (dispatch) {
        dispatch(clearErrorTitle());
        dispatch(clearErrorMessage());
        dispatch(setHasError(false));
        return Promise.resolve();
    };
};

var NavLink = (function (superclass) {
    function NavLink () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) NavLink.__proto__ = superclass;
    NavLink.prototype = Object.create( superclass && superclass.prototype );
    NavLink.prototype.constructor = NavLink;

    NavLink.prototype.render = function render () {
        var isActive = this.context.router.isActive(this.props.to, true), className = isActive ? "active" : "";
        return (React.createElement("li", { className: className },
            React.createElement(reactRouter.Link, { to: this.props.to }, this.props.children)));
    };

    return NavLink;
}(React.Component));
NavLink.contextTypes = {
    router: React.PropTypes.object
};
var IndexNavLink = (function (superclass) {
    function IndexNavLink () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) IndexNavLink.__proto__ = superclass;
    IndexNavLink.prototype = Object.create( superclass && superclass.prototype );
    IndexNavLink.prototype.constructor = IndexNavLink;

    IndexNavLink.prototype.render = function render () {
        var isActive = this.context.router.isActive(this.props.to, true), className = isActive ? "active" : "";
        return (React.createElement("li", { className: className },
            React.createElement(reactRouter.IndexLink, { to: this.props.to }, this.props.children)));
    };

    return IndexNavLink;
}(React.Component));
IndexNavLink.contextTypes = {
    router: React.PropTypes.object
};

var mapStateToProps = function (state) {
    var user = state.usersInfo.users[state.usersInfo.currentUserId];
    var name = user ? user.FirstName : "User";
    return {
        username: name,
        hasError: state.statusInfo.hasError,
        error: state.statusInfo.errorInfo
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        clearError: function () { return dispatch(clearError()); }
    };
};
var Shell = (function (superclass) {
    function Shell () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) Shell.__proto__ = superclass;
    Shell.prototype = Object.create( superclass && superclass.prototype );
    Shell.prototype.constructor = Shell;

    Shell.prototype.errorView = function errorView () {
        var ref = this.props;
        var hasError = ref.hasError;
        var clearError = ref.clearError;
        var error = ref.error;
        var title = error.title;
        var message = error.message;
        if (!hasError)
            { return null; }
        return React.createElement(Error, { title: title, message: message, clearError: clearError });
    };
    Shell.prototype.render = function render () {
        var ref = this.props;
        var username = ref.username;
        var employeeUrl = globals.urls.employeeHandbook;
        var c5SearchUrl = globals.urls.c5Search;
        return React.createElement(reactBootstrap.Grid, { fluid: true },
            React.createElement(reactBootstrap.Navbar, { fixedTop: true },
                React.createElement(reactBootstrap.Navbar.Header, null,
                    React.createElement(reactBootstrap.Navbar.Brand, null,
                        React.createElement("a", { href: "http://intranetside", className: "navbar-brand" }, "Inuplan Intranet")),
                    React.createElement(reactBootstrap.Navbar.Toggle, null)),
                React.createElement(reactBootstrap.Navbar.Collapse, null,
                    React.createElement(reactBootstrap.Nav, null,
                        React.createElement(IndexNavLink, { to: "/" }, "Forside"),
                        React.createElement(NavLink, { to: "/forum" }, "Forum"),
                        React.createElement(NavLink, { to: "/users" }, "Brugere"),
                        React.createElement(NavLink, { to: "/about" }, "Om")),
                    React.createElement(reactBootstrap.Navbar.Text, { pullRight: true },
                        "Hej, ",
                        username,
                        "!"),
                    React.createElement(reactBootstrap.Nav, { pullRight: true },
                        React.createElement(reactBootstrap.NavDropdown, { eventKey: 5, title: "Links", id: "extern_links" },
                            React.createElement(reactBootstrap.MenuItem, { href: employeeUrl, eventKey: 5.1 }, "Medarbejder h\u00E5ndbog"),
                            React.createElement(reactBootstrap.MenuItem, { href: c5SearchUrl, eventKey: 5.2 }, "C5 S\u00F8gning"))))),
            this.errorView(),
            this.props.children);
    };

    return Shell;
}(React.Component));
var Main = reactRedux.connect(mapStateToProps, mapDispatchToProps)(Shell);

var objMap = function (arr, key, val) {
    var obj = arr.reduce(function (res, item) {
        var k = key(item);
        var v = val(item);
        res[k] = v;
        return res;
    }, {});
    return obj;
};
var put = function (obj, key, value) {
    var kv = Object.assign({}, obj);
    kv[key] = value;
    return kv;
};
var options = {
    mode: "cors",
    credentials: "include"
};
var responseHandler = function (dispatch) { return function (onSuccess) { return function (response) {
    if (response.ok)
        { return onSuccess(response); }
    else {
        switch (response.status) {
            case 400:
                dispatch(setError({ title: "400 Bad Request", message: "The request was not well-formed" }));
                break;
            case 404:
                dispatch(setError({ title: "404 Not Found", message: "Could not find resource" }));
                break;
            case 408:
                dispatch(setError({ title: "408 Request Timeout", message: "The server did not respond in time" }));
                break;
            case 500:
                dispatch(setError({ title: "500 Server Error", message: "Something went wrong with the API-server" }));
                break;
            default:
                dispatch(setError({ title: "Oops", message: "Something went wrong!" }));
                break;
        }
    }
    return null;
}; }; };
var union = function (arr1, arr2, equalityFunc) {
    var result = arr1.concat(arr2);
    for (var i = 0; i < result.length; i++) {
        for (var j = i + 1; j < result.length; j++) {
            if (equalityFunc(result[i], result[j])) {
                result.splice(j, 1);
                j--;
            }
        }
    }
    return result;
};
var timeText = function (postedOn, expire) {
    if ( expire === void 0 ) expire = 12.5;

    var ago = moment(postedOn).fromNow();
    var diff = moment().diff(postedOn, "hours", true);
    if (diff >= expire) {
        var date = moment(postedOn);
        return ("d. " + (date.format("D MMM YYYY ")) + " kl. " + (date.format("H:mm")));
    }
    return "for " + ago;
};
var formatText = function (text) {
    if (!text)
        { return null; }
    var rawMarkup = marked(text, { sanitize: true });
    return { __html: rawMarkup };
};
var getWords = function (text, numberOfWords) {
    if (!text)
        { return ""; }
    var plainText = removeMd(text);
    return plainText.split(/\s+/).slice(0, numberOfWords).join(" ");
};
var getFullName = function (user, none) {
    if ( none === void 0 ) none = "";

    if (!user)
        { return none; }
    return ((user.FirstName) + " " + (user.LastName));
};
var normalizeComment = function (comment) {
    var r = comment.Replies ? comment.Replies : [];
    var replies = r.map(normalizeComment);
    var authorId = (comment.Deleted) ? -1 : comment.Author.ID;
    return {
        CommentID: comment.ID,
        AuthorID: authorId,
        Deleted: comment.Deleted,
        PostedOn: comment.PostedOn,
        Text: comment.Text,
        Replies: replies,
        Edited: comment.Edited
    };
};
var getForumCommentsDeleteUrl = function (commentId) {
    return ((globals.urls.forumcomments) + "?commentId=" + commentId);
};
var getForumCommentsPageUrl = function (postId, skip, take) {
    return ((globals.urls.forumcomments) + "?postId=" + postId + "&skip=" + skip + "&take=" + take);
};
var getImageCommentsPageUrl = function (imageId, skip, take) {
    return ((globals.urls.imagecomments) + "?imageId=" + imageId + "&skip=" + skip + "&take=" + take);
};
var getImageCommentsDeleteUrl = function (commentId) {
    return ((globals.urls.imagecomments) + "?commentId=" + commentId);
};

var normalizeLatest = function (latest) {
    var item = null;
    var authorId = -1;
    if (latest.Type === 1) {
        var image = latest.Item;
        item = {
            Extension: image.Extension,
            Filename: image.Filename,
            ImageID: image.ImageID,
            OriginalUrl: image.OriginalUrl,
            PreviewUrl: image.PreviewUrl,
            ThumbnailUrl: image.ThumbnailUrl,
            Uploaded: image.Uploaded,
            Description: image.Description
        };
        authorId = image.Author.ID;
    }
    else if (latest.Type === 2) {
        var comment = latest.Item;
        item = {
            ID: comment.ID,
            Text: comment.Text,
            ImageID: comment.ImageID,
            ImageUploadedBy: comment.ImageUploadedBy,
            Filename: comment.Filename
        };
        authorId = comment.Author.ID;
    }
    else if (latest.Type === 4) {
        var post = latest.Item;
        item = {
            ID: post.ThreadID,
            Title: post.Header.Title,
            Text: post.Text,
            Sticky: post.Header.Sticky,
            CommentCount: post.Header.CommentCount
        };
        authorId = post.Header.Author.ID;
    }
    return {
        ID: latest.ID,
        Type: latest.Type,
        Item: item,
        On: latest.On,
        AuthorID: authorId,
    };
};
var normalize = function (img) {
    return {
        ImageID: img.ImageID,
        Filename: img.Filename,
        Extension: img.Extension,
        OriginalUrl: img.OriginalUrl,
        PreviewUrl: img.PreviewUrl,
        ThumbnailUrl: img.ThumbnailUrl,
        CommentCount: img.CommentCount,
        Uploaded: new Date(img.Uploaded),
        Description: img.Description
    };
};
var normalizeThreadTitle = function (title) {
    var viewedBy = title.ViewedBy.map(function (user) { return user.ID; });
    var latestComment = title.LatestComment ? normalizeComment$1(title.LatestComment) : null;
    return {
        ID: title.ID,
        IsPublished: title.IsPublished,
        Sticky: title.Sticky,
        CreatedOn: title.CreatedOn,
        AuthorID: title.Author.ID,
        Deleted: title.Deleted,
        IsModified: title.IsModified,
        Title: title.Title,
        LastModified: title.LastModified,
        LatestComment: latestComment,
        CommentCount: title.CommentCount,
        ViewedBy: viewedBy,
    };
};
var normalizeComment$1 = function (comment) {
    var r = comment.Replies ? comment.Replies : [];
    var replies = r.map(normalizeComment$1);
    var authorId = (comment.Deleted) ? -1 : comment.Author.ID;
    return {
        CommentID: comment.ID,
        AuthorID: authorId,
        Deleted: comment.Deleted,
        PostedOn: comment.PostedOn,
        Text: comment.Text,
        Replies: replies,
        Edited: comment.Edited
    };
};

var addUser = function (user) {
    return {
        type: 21,
        payload: user
    };
};
var setCurrentUserId = function (id) {
    return {
        type: 20,
        payload: id
    };
};
var recievedUsers = function (users) {
    return {
        type: 22,
        payload: users
    };
};
var fetchCurrentUser = function (username) {
    return function (dispatch) {
        var url = (globals.urls.users) + "?username=" + username;
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(url, options)
            .then(handler)
            .then(function (user) {
            dispatch(setCurrentUserId(user.ID));
            dispatch(addUser(user));
        });
    };
};
var fetchUsers = function () {
    return function (dispatch) {
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(globals.urls.users, options)
            .then(handler)
            .then(function (users) {
            var getKey = function (user) { return user.ID; };
            var getValue = function (user) { return user; };
            var obj = objMap(users, getKey, getValue);
            dispatch(recievedUsers(obj));
        });
    };
};

var setLatest = function (latest) {
    return {
        type: 5,
        payload: latest
    };
};
var setSkip = function (skip) {
    return {
        type: 6,
        payload: skip
    };
};
var setTake = function (take) {
    return {
        type: 7,
        payload: take
    };
};
var setPage = function (page) {
    return {
        type: 8,
        payload: page
    };
};
var setTotalPages = function (totalPages) {
    return {
        type: 9,
        payload: totalPages
    };
};
var fetchLatestNews = function (skip, take) {
    return function (dispatch) {
        var url = (globals.urls.whatsnew) + "?skip=" + skip + "&take=" + take;
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(url, options)
            .then(handler)
            .then(function (page) {
            var items = page.CurrentItems;
            items.forEach(function (item) {
                var author = getAuthor(item.Type, item.Item);
                if (author) {
                    dispatch(addUser(author));
                }
            });
            dispatch(setSkip(skip));
            dispatch(setTake(take));
            dispatch(setPage(page.CurrentPage));
            dispatch(setTotalPages(page.TotalPages));
            var normalized = items.map(normalizeLatest);
            dispatch(setLatest(normalized));
        });
    };
};
var getAuthor = function (type, item) {
    var author = null;
    if (type === 4) {
        author = item.Header.Author;
    }
    else {
        author = item.Author;
    }
    return author;
};

var ImageUpload = (function (superclass) {
    function ImageUpload(props) {
        superclass.call(this, props);
        this.state = {
            hasFile: false,
            description: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setHasFile = this.setHasFile.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.removeSelectedFiles = this.removeSelectedFiles.bind(this);
        this.uploadButtonView = this.uploadButtonView.bind(this);
        this.clearInput = this.clearInput.bind(this);
    }

    if ( superclass ) ImageUpload.__proto__ = superclass;
    ImageUpload.prototype = Object.create( superclass && superclass.prototype );
    ImageUpload.prototype.constructor = ImageUpload;
    ImageUpload.prototype.clearInput = function clearInput (fileInput) {
        if (fileInput.value) {
            try {
                fileInput.value = "";
            }
            catch (err) { }
            if (fileInput.value) {
                var form = document.createElement("form"), parentNode = fileInput.parentNode, ref = fileInput.nextSibling;
                form.appendChild(fileInput);
                form.reset();
                parentNode.insertBefore(fileInput, ref);
            }
        }
        this.setState({
            hasFile: false,
            description: ""
        });
    };
    ImageUpload.prototype.getFiles = function getFiles () {
        var files = document.getElementById("files");
        return (files ? files.files : []);
    };
    ImageUpload.prototype.handleSubmit = function handleSubmit (e) {
        var ref = this.props;
        var uploadImage = ref.uploadImage;
        var username = ref.username;
        e.preventDefault();
        var fileInput = document.getElementById("files");
        var files = fileInput.files;
        if (files.length === 0)
            { return; }
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append("file", file);
        }
        uploadImage(username, this.state.description, formData);
        this.clearInput(fileInput);
    };
    ImageUpload.prototype.setHasFile = function setHasFile () {
        var fileInput = document.getElementById("files");
        var files = fileInput.files;
        var result = files.length > 0;
        this.setState({
            hasFile: result,
        });
    };
    ImageUpload.prototype.handleDescriptionChange = function handleDescriptionChange (e) {
        this.setState({
            description: e.target.value
        });
    };
    ImageUpload.prototype.removeSelectedFiles = function removeSelectedFiles () {
        var fileInput = document.getElementById("files");
        this.clearInput(fileInput);
        this.setState({
            hasFile: false,
            description: ""
        });
    };
    ImageUpload.prototype.showDescription = function showDescription () {
        if (!this.state.hasFile) {
            return null;
        }
        return React.createElement("span", null,
            React.createElement(reactBootstrap.FormControl, { id: "description", type: "text", value: this.state.description, placeholder: "Beskriv billedet...", rows: 50, onChange: this.handleDescriptionChange }),
            "\u00A0",
            React.createElement(reactBootstrap.Button, { bsStyle: "warning", onClick: this.removeSelectedFiles }, " Fortryd"));
    };
    ImageUpload.prototype.uploadButtonView = function uploadButtonView () {
        if (!this.state.hasFile)
            { return React.createElement(reactBootstrap.Button, { bsStyle: "primary", disabled: true, type: "submit" }, " Upload"); }
        return React.createElement(reactBootstrap.Button, { bsStyle: "primary", type: "submit" }, "Upload");
    };
    ImageUpload.prototype.render = function render () {
        return React.createElement("form", { onSubmit: this.handleSubmit, id: "form-upload", className: "form-inline", encType: "multipart/form-data" },
            React.createElement("div", { className: "form-group" },
                React.createElement("label", { htmlFor: "files", className: "hide-input" },
                    React.createElement(reactBootstrap.Glyphicon, { glyph: "camera" }),
                    " V\u00E6lg filer",
                    React.createElement("input", { type: "file", id: "files", name: "files", onChange: this.setHasFile, multiple: true })),
                "\u00A0 ",
                this.showDescription(),
                " \u00A0",
                this.uploadButtonView()),
            this.props.children);
    };

    return ImageUpload;
}(React.Component));

var setImagesOwner = function (id) {
    return {
        type: 10,
        payload: id
    };
};
var recievedUserImages = function (images) {
    return {
        type: 11,
        payload: images
    };
};
var setSelectedImg = function (id) {
    return {
        type: 12,
        payload: id
    };
};
var addImage = function (img) {
    return {
        type: 13,
        payload: img
    };
};
var removeImage = function (id) {
    return {
        type: 14,
        payload: { ImageID: id }
    };
};
var addSelectedImageId = function (id) {
    return {
        type: 15,
        payload: id
    };
};
var removeSelectedImageId = function (id) {
    return {
        type: 16,
        payload: id
    };
};
var clearSelectedImageIds = function () {
    return {
        type: 17,
    };
};
var incrementCommentCount = function (imageId) {
    return {
        type: 18,
        payload: { ImageID: imageId }
    };
};
var decrementCommentCount = function (imageId) {
    return {
        type: 19,
        payload: { ImageID: imageId }
    };
};
var deleteImage = function (id, username) {
    return function (dispatch) {
        var url = (globals.urls.images) + "?username=" + username + "&id=" + id;
        var opt = Object.assign({}, options, {
            method: "DELETE"
        });
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        var result = fetch(url, opt)
            .then(handler)
            .then(function () { dispatch(removeImage(id)); })
            .catch(function (reason) { return console.log(reason); });
        return result;
    };
};
var uploadImage = function (username, description, formData, onSuccess, onError) {
    return function (dispatch) {
        var url = (globals.urls.images) + "?username=" + username + "&description=" + description;
        var opt = Object.assign({}, options, {
            method: "POST",
            body: formData
        });
        var handler = responseHandler(dispatch)(function (_) { return null; });
        return fetch(url, opt)
            .then(handler)
            .then(onSuccess, onError);
    };
};
var fetchUserImages = function (username) {
    return function (dispatch) {
        var url = (globals.urls.images) + "?username=" + username;
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(url, options)
            .then(handler)
            .then(function (data) {
            var normalized = data.map(normalize);
            var obj = objMap(normalized, function (img) { return img.ImageID; }, function (img) { return img; });
            dispatch(recievedUserImages(obj));
        });
    };
};
var deleteImages = function (username, imageIds) {
    if ( imageIds === void 0 ) imageIds = [];

    return function (dispatch) {
        var ids = imageIds.join(",");
        var url = (globals.urls.images) + "?username=" + username + "&ids=" + ids;
        var opt = Object.assign({}, options, {
            method: "DELETE"
        });
        var handler = responseHandler(dispatch)(function (_) { return null; });
        return fetch(url, opt)
            .then(handler)
            .then(function () { dispatch(clearSelectedImageIds()); })
            .then(function () { dispatch(fetchUserImages(username)); });
    };
};
var setImageOwner = function (username) {
    return function (dispatch, getState) {
        var findOwner = function () {
            var users = getState().usersInfo.users;
            var user = null;
            for (var key in users) {
                user = users[key];
                if (user.Username === username) {
                    break;
                }
            }
            return user;
        };
        var owner = findOwner();
        if (owner) {
            var ownerId = owner.ID;
            dispatch(setImagesOwner(ownerId));
            return Promise.resolve();
        }
        else {
            var url = (globals.urls.users) + "?username=" + username;
            var handler = responseHandler(dispatch)(function (r) { return r.json(); });
            return fetch(url, options)
                .then(handler)
                .then(function (user) { dispatch(addUser(user)); })
                .then(function () {
                owner = findOwner();
                dispatch(setImagesOwner(owner.ID));
            });
        }
    };
};
var fetchSingleImage = function (id) {
    return function (dispatch) {
        var url = (globals.urls.images) + "/getbyid?id=" + id;
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(url, options)
            .then(handler)
            .then(function (img) {
            if (!img)
                { return; }
            var normalizedImage = normalize(img);
            dispatch(addImage(normalizedImage));
        });
    };
};

var setUsedSpacekB = function (usedSpace) {
    return {
        type: 32,
        payload: usedSpace
    };
};
var setTotalSpacekB = function (totalSpace) {
    return {
        type: 33,
        payload: totalSpace
    };
};
var fetchSpaceInfo = function (url) {
    return function (dispatch) {
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(url, options)
            .then(handler)
            .then(function (data) {
            var usedSpace = data.UsedSpaceKB;
            var totalSpace = data.SpaceQuotaKB;
            dispatch(setUsedSpacekB(usedSpace));
            dispatch(setTotalSpacekB(totalSpace));
        });
    };
};

var mapStateToProps$2 = function (state) {
    return {
        usedMB: (state.statusInfo.spaceInfo.usedSpacekB / 1000),
        totalMB: (state.statusInfo.spaceInfo.totalSpacekB / 1000),
        loaded: (state.statusInfo.spaceInfo.totalSpacekB !== -1)
    };
};
var mapDispatchToProps$2 = function (dispatch) {
    return {
        getSpaceInfo: function (url) {
            dispatch(fetchSpaceInfo(url));
        }
    };
};
var UsedSpaceView = (function (superclass) {
    function UsedSpaceView () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) UsedSpaceView.__proto__ = superclass;
    UsedSpaceView.prototype = Object.create( superclass && superclass.prototype );
    UsedSpaceView.prototype.constructor = UsedSpaceView;

    UsedSpaceView.prototype.componentDidMount = function componentDidMount () {
        var ref = this.props;
        var getSpaceInfo = ref.getSpaceInfo;
        var url = (globals.urls.diagnostics) + "/getspaceinfo";
        getSpaceInfo(url);
    };
    UsedSpaceView.prototype.render = function render () {
        var ref = this.props;
        var usedMB = ref.usedMB;
        var totalMB = ref.totalMB;
        var total = Math.round(totalMB);
        var used = Math.round(usedMB * 100) / 100;
        var free = Math.round((total - used) * 100) / 100;
        var usedPercent = ((used / total) * 100);
        var percentRound = Math.round(usedPercent * 100) / 100;
        var show = Boolean(usedPercent) && Boolean(used) && Boolean(free) && Boolean(total);
        if (!show)
            { return null; }
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Col, null,
                React.createElement(reactBootstrap.ProgressBar, { striped: true, bsStyle: "success", now: usedPercent, key: 1 }),
                React.createElement("p", null,
                    "Brugt: ",
                    used.toString(),
                    " MB (",
                    percentRound.toString(),
                    " %)",
                    React.createElement("br", null),
                    "Fri plads: ",
                    free.toString(),
                    " MB",
                    React.createElement("br", null),
                    "Total: ",
                    total.toString(),
                    " MB")));
    };

    return UsedSpaceView;
}(React.Component));
var UsedSpace = reactRedux.connect(mapStateToProps$2, mapDispatchToProps$2)(UsedSpaceView);

var CommentProfile = (function (superclass) {
    function CommentProfile () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) CommentProfile.__proto__ = superclass;
    CommentProfile.prototype = Object.create( superclass && superclass.prototype );
    CommentProfile.prototype.constructor = CommentProfile;

    CommentProfile.prototype.render = function render () {
        return React.createElement(reactBootstrap.Media.Left, { className: "comment-profile" },
            React.createElement(reactBootstrap.Image, { src: "/images/person_icon.svg", style: { width: "64px", height: "64px" }, className: "media-object" }),
            this.props.children);
    };

    return CommentProfile;
}(React.Component));

var WhatsNewTooltip = (function (superclass) {
    function WhatsNewTooltip () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) WhatsNewTooltip.__proto__ = superclass;
    WhatsNewTooltip.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewTooltip.prototype.constructor = WhatsNewTooltip;

    WhatsNewTooltip.prototype.tooltipView = function tooltipView (tip) {
        return React.createElement(reactBootstrap.Tooltip, { id: "tooltip" }, tip);
    };
    WhatsNewTooltip.prototype.render = function render () {
        var ref = this.props;
        var tooltip = ref.tooltip;
        var children = ref.children;
        return React.createElement(reactBootstrap.OverlayTrigger, { placement: "left", overlay: this.tooltipView(tooltip) }, children);
    };

    return WhatsNewTooltip;
}(React.Component));

var WhatsNewItemImage = (function (superclass) {
    function WhatsNewItemImage () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) WhatsNewItemImage.__proto__ = superclass;
    WhatsNewItemImage.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewItemImage.prototype.constructor = WhatsNewItemImage;

    WhatsNewItemImage.prototype.when = function when () {
        var ref = this.props;
        var on = ref.on;
        return "uploadede " + timeText(on);
    };
    WhatsNewItemImage.prototype.overlay = function overlay () {
        return React.createElement(reactBootstrap.Tooltip, { id: "tooltip_img" }, "Bruger billede");
    };
    WhatsNewItemImage.prototype.render = function render () {
        var ref = this.props;
        var imageId = ref.imageId;
        var author = ref.author;
        var filename = ref.filename;
        var extension = ref.extension;
        var thumbnail = ref.thumbnail;
        var description = ref.description;
        var username = author.Username;
        var file = filename + "." + extension;
        var link = username + "/gallery/image/" + imageId;
        var name = (author.FirstName) + " " + (author.LastName);
        return React.createElement(WhatsNewTooltip, { tooltip: "Uploadet billede" },
            React.createElement(reactBootstrap.Media.ListItem, { className: "whatsnewItem hover-shadow" },
                React.createElement(CommentProfile, null),
                React.createElement(reactBootstrap.Media.Body, null,
                    React.createElement("blockquote", null,
                        React.createElement("span", { className: "image-whatsnew-descriptiontext" }, description),
                        React.createElement("br", null),
                        React.createElement(reactRouter.Link, { to: link },
                            React.createElement(reactBootstrap.Image, { src: thumbnail, thumbnail: true })),
                        React.createElement("footer", null,
                            name,
                            " ",
                            this.when(),
                            React.createElement("br", null),
                            React.createElement(reactBootstrap.Glyphicon, { glyph: "picture" }),
                            " ",
                            file)))));
    };

    return WhatsNewItemImage;
}(React.Component));

var WhatsNewItemComment = (function (superclass) {
    function WhatsNewItemComment () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) WhatsNewItemComment.__proto__ = superclass;
    WhatsNewItemComment.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewItemComment.prototype.constructor = WhatsNewItemComment;

    WhatsNewItemComment.prototype.createSummary = function createSummary () {
        var ref = this.props;
        var text = ref.text;
        return formatText(getWords(text, 5) + "...");
    };
    WhatsNewItemComment.prototype.fullname = function fullname () {
        var ref = this.props;
        var author = ref.author;
        return author ? author.FirstName + " " + author.LastName : "User";
    };
    WhatsNewItemComment.prototype.when = function when () {
        var ref = this.props;
        var on = ref.on;
        return "sagde " + timeText(on);
    };
    WhatsNewItemComment.prototype.render = function render () {
        var ref = this.props;
        var imageId = ref.imageId;
        var uploadedBy = ref.uploadedBy;
        var commentId = ref.commentId;
        var filename = ref.filename;
        var username = uploadedBy.Username;
        var name = this.fullname();
        var summary = this.createSummary();
        var link = username + "/gallery/image/" + imageId + "/comment?id=" + commentId;
        return React.createElement(WhatsNewTooltip, { tooltip: "Kommentar" },
            React.createElement(reactBootstrap.Media.ListItem, { className: "whatsnewItem hover-shadow" },
                React.createElement(CommentProfile, null),
                React.createElement(reactBootstrap.Media.Body, null,
                    React.createElement("blockquote", null,
                        React.createElement(reactRouter.Link, { to: link },
                            React.createElement("em", null,
                                React.createElement("p", { dangerouslySetInnerHTML: summary }))),
                        React.createElement("footer", null,
                            name,
                            " ",
                            this.when(),
                            React.createElement("br", null),
                            React.createElement(reactBootstrap.Glyphicon, { glyph: "comment" }),
                            " ",
                            filename)))));
    };

    return WhatsNewItemComment;
}(React.Component));

var WhatsNewForumPost = (function (superclass) {
    function WhatsNewForumPost(props) {
        superclass.call(this, props);
        this.showModal = this.showModal.bind(this);
    }

    if ( superclass ) WhatsNewForumPost.__proto__ = superclass;
    WhatsNewForumPost.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewForumPost.prototype.constructor = WhatsNewForumPost;
    WhatsNewForumPost.prototype.fullname = function fullname () {
        var ref = this.props;
        var author = ref.author;
        return author.FirstName + " " + author.LastName;
    };
    WhatsNewForumPost.prototype.when = function when () {
        var ref = this.props;
        var on = ref.on;
        return "indlæg " + timeText(on);
    };
    WhatsNewForumPost.prototype.summary = function summary () {
        var ref = this.props;
        var text = ref.text;
        return getWords(text, 5);
    };
    WhatsNewForumPost.prototype.overlay = function overlay () {
        var ref = this.props;
        var commentCount = ref.commentCount;
        return React.createElement(reactBootstrap.Tooltip, { id: "tooltip_post" },
            "Forum indl\u00E6g, antal kommentarer: ",
            commentCount);
    };
    WhatsNewForumPost.prototype.showModal = function showModal (event) {
        event.preventDefault();
        var ref = this.props;
        var preview = ref.preview;
        var index = ref.index;
        preview(index);
    };
    WhatsNewForumPost.prototype.render = function render () {
        var ref = this.props;
        var title = ref.title;
        var name = this.fullname();
        return React.createElement(WhatsNewTooltip, { tooltip: "Forum indlæg" },
            React.createElement(reactBootstrap.Media.ListItem, { className: "whatsnewItem hover-shadow" },
                React.createElement(CommentProfile, null),
                React.createElement(reactBootstrap.Media.Body, null,
                    React.createElement("blockquote", null,
                        React.createElement("a", { href: "#", onClick: this.showModal },
                            this.summary(),
                            "..."),
                        React.createElement("footer", null,
                            name,
                            " ",
                            this.when(),
                            React.createElement("br", null),
                            React.createElement(reactBootstrap.Glyphicon, { glyph: "list-alt" }),
                            " ",
                            title)))));
    };

    return WhatsNewForumPost;
}(React.Component));

var WhatsNewList = (function (superclass) {
    function WhatsNewList(props) {
        superclass.call(this, props);
        this.previewPostHandle = this.previewPostHandle.bind(this);
    }

    if ( superclass ) WhatsNewList.__proto__ = superclass;
    WhatsNewList.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewList.prototype.constructor = WhatsNewList;
    WhatsNewList.prototype.previewPostHandle = function previewPostHandle (index) {
        var ref = this.props;
        var items = ref.items;
        var preview = ref.preview;
        var item = items[index];
        preview(item);
    };
    WhatsNewList.prototype.constructItems = function constructItems () {
        var this$1 = this;

        var ref = this.props;
        var items = ref.items;
        var getUser = ref.getUser;
        var generateKey = function (id) { return "whatsnew_" + id; };
        return items.map(function (item, index) {
            var itemKey = generateKey(item.ID);
            var author = getUser(item.AuthorID);
            switch (item.Type) {
                case 1:
                    {
                        var image = item.Item;
                        return React.createElement(WhatsNewItemImage, { on: item.On, imageId: image.ImageID, filename: image.Filename, extension: image.Extension, thumbnail: image.ThumbnailUrl, author: author, description: image.Description, key: itemKey });
                    }
                case 2:
                    {
                        var comment = item.Item;
                        return React.createElement(WhatsNewItemComment, { commentId: comment.ID, text: comment.Text, uploadedBy: comment.ImageUploadedBy, imageId: comment.ImageID, filename: comment.Filename, on: item.On, author: author, key: itemKey });
                    }
                case 4:
                    {
                        var post = item.Item;
                        return React.createElement(WhatsNewForumPost, { on: item.On, author: author, title: post.Title, text: post.Text, sticky: post.Sticky, commentCount: post.CommentCount, preview: this$1.previewPostHandle, index: index, key: itemKey });
                    }
                default:
                    {
                        return null;
                    }
            }
        });
    };
    WhatsNewList.prototype.render = function render () {
        var itemNodes = this.constructItems();
        return React.createElement(reactBootstrap.Media.List, null, itemNodes);
    };

    return WhatsNewList;
}(React.Component));

var ForumForm = (function (superclass) {
    function ForumForm(props) {
        superclass.call(this, props);
        this.state = {
            Title: "",
            Text: "",
            Sticky: false,
            IsPublished: true,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    if ( superclass ) ForumForm.__proto__ = superclass;
    ForumForm.prototype = Object.create( superclass && superclass.prototype );
    ForumForm.prototype.constructor = ForumForm;
    ForumForm.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
        var edit = nextProps.edit;
        if (edit) {
            this.setState({
                Title: edit.Title,
                Text: edit.Text,
                Sticky: edit.Sticky,
                IsPublished: edit.IsPublished
            });
        }
    };
    ForumForm.prototype.handleTitleChange = function handleTitleChange (e) {
        this.setState({ Title: e.target.value });
    };
    ForumForm.prototype.handleTextChange = function handleTextChange (e) {
        this.setState({ Text: e.target.value });
    };
    ForumForm.prototype.getValidation = function getValidation () {
        var length = this.state.Title.length;
        if (length >= 0 && length < 200)
            { return "success"; }
        if (length >= 200 && length <= 250)
            { return "warning"; }
        return "error";
    };
    ForumForm.prototype.transformToDTO = function transformToDTO (state) {
        var header = {
            IsPublished: state.IsPublished,
            Sticky: state.Sticky,
            Title: state.Title
        };
        return {
            Header: header,
            Text: state.Text
        };
    };
    ForumForm.prototype.handleSubmit = function handleSubmit (e) {
        e.preventDefault();
        var ref = this.props;
        var close = ref.close;
        var onSubmit = ref.onSubmit;
        var post = this.transformToDTO(this.state);
        onSubmit(post);
        close();
    };
    ForumForm.prototype.handleSticky = function handleSticky () {
        var ref = this.state;
        var Sticky = ref.Sticky;
        this.setState({ Sticky: !Sticky });
    };
    ForumForm.prototype.handlePublished = function handlePublished () {
        var ref = this.state;
        var IsPublished = ref.IsPublished;
        this.setState({ IsPublished: !IsPublished });
    };
    ForumForm.prototype.closeHandle = function closeHandle () {
        var ref = this.props;
        var close = ref.close;
        close();
    };
    ForumForm.prototype.render = function render () {
        var ref = this.props;
        var show = ref.show;
        var edit = ref.edit;
        var readMode = Boolean(!edit);
        var title = readMode ? "Skriv nyt indlæg" : "Ændre indlæg";
        var btnSubmit = readMode ? "Skriv indlæg" : "Gem ændringer";
        return React.createElement(reactBootstrap.Modal, { show: show, onHide: this.closeHandle.bind(this), bsSize: "lg" },
            React.createElement("form", null,
                React.createElement(reactBootstrap.Modal.Header, { closeButton: true },
                    React.createElement(reactBootstrap.Modal.Title, null, title)),
                React.createElement(reactBootstrap.Modal.Body, null,
                    React.createElement(reactBootstrap.Row, null,
                        React.createElement(reactBootstrap.Col, { lg: 12 },
                            React.createElement(reactBootstrap.FormGroup, { controlId: "formPostTitle", validationState: this.getValidation() },
                                React.createElement(reactBootstrap.ControlLabel, null, "Overskrift"),
                                React.createElement(reactBootstrap.FormControl, { type: "text", placeholder: "Overskrift på indlæg...", onChange: this.handleTitleChange.bind(this), value: this.state.Title })),
                            React.createElement(reactBootstrap.FormGroup, { controlId: "formPostContent" },
                                React.createElement(reactBootstrap.ControlLabel, null, "Indl\u00E6g"),
                                React.createElement(reactBootstrap.FormControl, { componentClass: "textarea", placeholder: "Skriv besked her...", onChange: this.handleTextChange.bind(this), value: this.state.Text, rows: 8 })),
                            React.createElement(reactBootstrap.FormGroup, { controlId: "formPostSticky" },
                                React.createElement(reactBootstrap.ButtonGroup, null,
                                    React.createElement(reactBootstrap.Button, { bsStyle: "success", bsSize: "small", active: this.state.Sticky, onClick: this.handleSticky.bind(this) },
                                        React.createElement(reactBootstrap.Glyphicon, { glyph: "pushpin" }),
                                        " Vigtig")))))),
                React.createElement(reactBootstrap.Modal.Footer, null,
                    React.createElement(reactBootstrap.Button, { bsStyle: "default", onClick: this.closeHandle.bind(this) }, "Luk"),
                    React.createElement(reactBootstrap.Button, { bsStyle: "primary", type: "submit", onClick: this.handleSubmit }, btnSubmit))));
    };

    return ForumForm;
}(React.Component));

var ButtonTooltip = (function (superclass) {
    function ButtonTooltip () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) ButtonTooltip.__proto__ = superclass;
    ButtonTooltip.prototype = Object.create( superclass && superclass.prototype );
    ButtonTooltip.prototype.constructor = ButtonTooltip;

    ButtonTooltip.prototype.render = function render () {
        var ref = this.props;
        var tooltip = ref.tooltip;
        var onClick = ref.onClick;
        var icon = ref.icon;
        var bsStyle = ref.bsStyle;
        var active = ref.active;
        var mount = ref.mount;
        var overlayTip = React.createElement(reactBootstrap.Tooltip, { id: "tooltip" }, tooltip);
        if (!mount)
            { return null; }
        return React.createElement(reactBootstrap.OverlayTrigger, { placement: "top", overlay: overlayTip },
            React.createElement(reactBootstrap.Button, { bsStyle: bsStyle, bsSize: "xsmall", onClick: onClick, active: active },
                React.createElement(reactBootstrap.Glyphicon, { glyph: icon })));
    };

    return ButtonTooltip;
}(React.Component));
var CommentControls = (function (superclass) {
    function CommentControls(props) {
        superclass.call(this, props);
        this.state = {
            text: props.text,
            replyText: "",
            reply: false,
            edit: false
        };
        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleReply = this.toggleReply.bind(this);
        this.editHandle = this.editHandle.bind(this);
        this.replyHandle = this.replyHandle.bind(this);
        this.deleteHandle = this.deleteHandle.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleReplyChange = this.handleReplyChange.bind(this);
    }

    if ( superclass ) CommentControls.__proto__ = superclass;
    CommentControls.prototype = Object.create( superclass && superclass.prototype );
    CommentControls.prototype.constructor = CommentControls;
    CommentControls.prototype.handleTextChange = function handleTextChange (e) {
        this.setState({ text: e.target.value });
    };
    CommentControls.prototype.handleReplyChange = function handleReplyChange (e) {
        this.setState({ replyText: e.target.value });
    };
    CommentControls.prototype.toggleEdit = function toggleEdit () {
        var ref = this.state;
        var edit = ref.edit;
        this.setState({ edit: !edit });
        if (!edit) {
            var ref$1 = this.props;
            var text = ref$1.text;
            this.setState({ text: text });
        }
    };
    CommentControls.prototype.toggleReply = function toggleReply () {
        var ref = this.state;
        var reply = ref.reply;
        this.setState({ reply: !reply });
    };
    CommentControls.prototype.deleteHandle = function deleteHandle () {
        var ref = this.props;
        var deleteComment = ref.deleteComment;
        var commentId = ref.commentId;
        var contextId = ref.contextId;
        deleteComment(commentId, contextId);
    };
    CommentControls.prototype.editHandle = function editHandle () {
        var ref = this.props;
        var editComment = ref.editComment;
        var contextId = ref.contextId;
        var commentId = ref.commentId;
        var ref$1 = this.state;
        var text = ref$1.text;
        this.setState({ edit: false });
        editComment(commentId, contextId, text);
    };
    CommentControls.prototype.replyHandle = function replyHandle () {
        var ref = this.props;
        var commentId = ref.commentId;
        var contextId = ref.contextId;
        var replyComment = ref.replyComment;
        var ref$1 = this.state;
        var replyText = ref$1.replyText;
        this.setState({ reply: false, replyText: "" });
        replyComment(contextId, replyText, commentId);
    };
    CommentControls.prototype.render = function render () {
        var ref = this.props;
        var authorId = ref.authorId;
        var canEdit = ref.canEdit;
        var ref$1 = this.state;
        var edit = ref$1.edit;
        var text = ref$1.text;
        var reply = ref$1.reply;
        var replyText = ref$1.replyText;
        var mount = canEdit(authorId);
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Row, { style: { paddingBottom: "5px", paddingLeft: "15px" } },
                React.createElement(reactBootstrap.Col, { lg: 4 },
                    React.createElement(reactBootstrap.ButtonToolbar, null,
                        React.createElement(reactBootstrap.ButtonGroup, null,
                            React.createElement(ButtonTooltip, { bsStyle: "primary", onClick: this.deleteHandle, icon: "trash", tooltip: "slet", mount: mount }),
                            React.createElement(ButtonTooltip, { bsStyle: "primary", onClick: this.toggleEdit, icon: "pencil", tooltip: "ændre", active: edit, mount: mount }),
                            React.createElement(ButtonTooltip, { bsStyle: "primary", onClick: this.toggleReply, icon: "envelope", tooltip: "svar", active: reply, mount: true }))))),
            React.createElement(reactBootstrap.Row, { style: { paddingBottom: "5px" } },
                React.createElement(reactBootstrap.Col, { lgOffset: 1, lg: 10 },
                    React.createElement(CollapseTextArea, { show: edit, id: "editTextControl", value: text, onChange: this.handleTextChange, toggle: this.toggleEdit, save: this.editHandle, saveText: "Gem ændringer", mount: mount }))),
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactBootstrap.Col, { lgOffset: 1, lg: 10 },
                    React.createElement(CollapseTextArea, { show: reply, id: "replyTextControl", value: replyText, onChange: this.handleReplyChange, toggle: this.toggleReply, save: this.replyHandle, saveText: "Svar", mount: true }))));
    };

    return CommentControls;
}(React.Component));
var CollapseTextArea = (function (superclass) {
    function CollapseTextArea () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) CollapseTextArea.__proto__ = superclass;
    CollapseTextArea.prototype = Object.create( superclass && superclass.prototype );
    CollapseTextArea.prototype.constructor = CollapseTextArea;

    CollapseTextArea.prototype.render = function render () {
        var ref = this.props;
        var show = ref.show;
        var id = ref.id;
        var value = ref.value;
        var onChange = ref.onChange;
        var toggle = ref.toggle;
        var save = ref.save;
        var saveText = ref.saveText;
        var mount = ref.mount;
        if (!mount)
            { return null; }
        return React.createElement(reactBootstrap.Collapse, { in: show },
            React.createElement(reactBootstrap.FormGroup, { controlId: id },
                React.createElement(reactBootstrap.FormControl, { componentClass: "textarea", value: value, onChange: onChange, rows: 4 }),
                React.createElement("br", null),
                React.createElement(reactBootstrap.ButtonToolbar, null,
                    React.createElement(reactBootstrap.Button, { onClick: toggle }, "Luk"),
                    React.createElement(reactBootstrap.Button, { type: "submit", bsStyle: "info", onClick: save }, saveText))));
    };

    return CollapseTextArea;
}(React.Component));

var addThreadTitle = function (title) {
    return {
        type: 24,
        payload: [title]
    };
};
var setThreadTitles = function (titles) {
    return {
        type: 25,
        payload: titles
    };
};
var setTotalPages$1 = function (totalPages) {
    return {
        type: 26,
        payload: totalPages
    };
};
var setPage$1 = function (page) {
    return {
        type: 27,
        payload: page
    };
};
var setSkip$1 = function (skip) {
    return {
        type: 28,
        payload: skip
    };
};
var setTake$1 = function (take) {
    return {
        type: 29,
        payload: take
    };
};
var setSelectedThread = function (id) {
    return {
        type: 30,
        payload: id
    };
};
var setPostContent = function (content) {
    return {
        type: 31,
        payload: content
    };
};
var markPost = function (postId, read, cb) {
    return function (dispatch) {
        var url = (globals.urls.forumpost) + "?postId=" + postId + "&read=" + read;
        var opt = Object.assign({}, options, {
            method: "PUT"
        });
        var handler = responseHandler(dispatch)(function (_) { return null; });
        return fetch(url, opt)
            .then(handler)
            .then(cb);
    };
};
var fetchThreads = function (skip, take) {
    if ( skip === void 0 ) skip = 0;
    if ( take === void 0 ) take = 10;

    return function (dispatch) {
        var forum = globals.urls.forumtitle;
        var url = forum + "?skip=" + skip + "&take=" + take;
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(url, options)
            .then(handler)
            .then(function (data) {
            var pageForumTitles = data.CurrentItems;
            var forumTitles = pageForumTitles.map(normalizeThreadTitle);
            dispatch(setSkip$1(skip));
            dispatch(setTake$1(take));
            dispatch(setTotalPages$1(data.TotalPages));
            dispatch(setPage$1(data.CurrentPage));
            dispatch(setThreadTitles(forumTitles));
        });
    };
};
var fetchPost = function (id, cb) {
    return function (dispatch) {
        var forum = globals.urls.forumpost;
        var url = forum + "?id=" + id;
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(url, options)
            .then(handler)
            .then(function (data) {
            var content = data.Text;
            var title = normalizeThreadTitle(data.Header);
            dispatch(addThreadTitle(title));
            dispatch(setPostContent(content));
            dispatch(setSelectedThread(data.ThreadID));
        })
            .then(cb);
    };
};
var updatePost = function (id, post, cb) {
    return function (dispatch) {
        var url = (globals.urls.forumpost) + "?id=" + id;
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        var handler = responseHandler(dispatch)(function (_) { return null; });
        var opt = Object.assign({}, options, {
            method: "PUT",
            body: JSON.stringify(post),
            headers: headers
        });
        return fetch(url, opt)
            .then(handler)
            .then(cb);
    };
};
var deletePost = function (id, cb) {
    return function (dispatch) {
        var url = (globals.urls.forumpost) + "?id=" + id;
        var opt = Object.assign({}, options, {
            method: "DELETE"
        });
        var handler = responseHandler(dispatch)(function (_) { return null; });
        return fetch(url, opt)
            .then(handler)
            .then(cb);
    };
};
var postThread = function (post, cb) {
    return function (dispatch) {
        var url = globals.urls.forumpost;
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        var opt = Object.assign({}, options, {
            method: "POST",
            body: JSON.stringify(post),
            headers: headers
        });
        var handler = responseHandler(dispatch)(function (_) { return null; });
        return fetch(url, opt)
            .then(handler)
            .then(cb);
    };
};

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    var arguments$1 = arguments;

    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments$1[i];
        for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p))
            { t[p] = s[p]; } }
    }
    return t;
};
var mapStateToProps$4 = function (state) {
    var selected = state.forumInfo.titlesInfo.selectedThread;
    var title = underscore.find(state.forumInfo.titlesInfo.titles, function (title) { return title.ID === selected; });
    return {
        selected: selected,
        title: title,
        text: state.forumInfo.postContent,
        getUser: function (id) { return state.usersInfo.users[id]; },
        canEdit: function (id) { return state.usersInfo.currentUserId === id; },
        hasRead: title ? underscore.contains(title.ViewedBy, state.usersInfo.currentUserId) : false,
    };
};
var mapDispatchToProps$4 = function (dispatch) {
    return {
        update: function (id, post, cb) {
            dispatch(updatePost(id, post, cb));
        },
        getPost: function (id) {
            dispatch(fetchPost(id))
                .then(function () { return dispatch(setSelectedThread(id)); });
        },
        deletePost: function (id, cb) {
            dispatch(deletePost(id, cb));
        },
        readPost: function (postId, read, cb) {
            dispatch(markPost(postId, read, cb));
        }
    };
};
var ForumPostContainer = (function (superclass) {
    function ForumPostContainer(props) {
        superclass.call(this, props);
        this.state = {
            edit: false
        };
        this.toggleEdit = this.toggleEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.deleteHandle = this.deleteHandle.bind(this);
        this.togglePostRead = this.togglePostRead.bind(this);
    }

    if ( superclass ) ForumPostContainer.__proto__ = superclass;
    ForumPostContainer.prototype = Object.create( superclass && superclass.prototype );
    ForumPostContainer.prototype.constructor = ForumPostContainer;
    ForumPostContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
        var hasTitle = Boolean(nextProps.title);
        if (!hasTitle)
            { return; }
        this.setState({
            model: {
                Title: nextProps.title.Title,
                Text: nextProps.text,
                Sticky: nextProps.title.Sticky,
                IsPublished: nextProps.title.IsPublished
            },
        });
        document.title = nextProps.title.Title;
    };
    ForumPostContainer.prototype.deleteHandle = function deleteHandle () {
        var ref = this.props;
        var router = ref.router;
        var deletePost = ref.deletePost;
        var title = ref.title;
        var cb = function () {
            var forumlists = "/forum";
            router.push(forumlists);
        };
        deletePost(title.ID, cb);
    };
    ForumPostContainer.prototype.toggleEdit = function toggleEdit () {
        var edit = this.state.edit;
        this.setState({ edit: !edit });
    };
    ForumPostContainer.prototype.onSubmit = function onSubmit (post) {
        var ref = this.props;
        var update = ref.update;
        var getPost = ref.getPost;
        var title = ref.title;
        var cb = function () {
            getPost(title.ID);
        };
        update(title.ID, post, cb);
    };
    ForumPostContainer.prototype.togglePostRead = function togglePostRead (toggle) {
        var ref = this.props;
        var getPost = ref.getPost;
        var readPost = ref.readPost;
        var title = ref.title;
        var cb = function () {
            getPost(title.ID);
        };
        readPost(title.ID, toggle, cb);
    };
    ForumPostContainer.prototype.close = function close () {
        this.setState({ edit: false });
    };
    ForumPostContainer.prototype.render = function render () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var selected = ref.selected;
        var title = ref.title;
        var text = ref.text;
        var getUser = ref.getUser;
        var hasRead = ref.hasRead;
        if (selected < 0 || !title)
            { return null; }
        var edit = canEdit(title.AuthorID);
        var user = getUser(title.AuthorID);
        var author = getFullName(user);
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(ForumHeader, { lg: 12, name: author, title: title.Title, createdOn: title.CreatedOn, modifiedOn: title.LastModified },
                React.createElement(ForumButtonGroup, { show: true, editable: edit, initialRead: hasRead, onDelete: this.deleteHandle, onEdit: this.toggleEdit, onRead: this.togglePostRead.bind(this, true), onUnread: this.togglePostRead.bind(this, false) })),
            React.createElement(ForumBody, { text: text, lg: 10 },
                React.createElement("hr", null),
                this.props.children),
            React.createElement(ForumForm, { show: this.state.edit, close: this.close.bind(this), onSubmit: this.onSubmit.bind(this), edit: this.state.model }));
    };

    return ForumPostContainer;
}(React.Component));
var ForumBody = (function (superclass) {
    function ForumBody () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) ForumBody.__proto__ = superclass;
    ForumBody.prototype = Object.create( superclass && superclass.prototype );
    ForumBody.prototype.constructor = ForumBody;

    ForumBody.prototype.render = function render () {
        var ref = this.props;
        var text = ref.text;
        var lg = ref.lg;
        var lgOffset = ref.lgOffset;
        var formattedText = formatText(text);
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Col, { lg: lg, lgOffset: lgOffset },
                React.createElement("p", { className: "forum-content", dangerouslySetInnerHTML: formattedText }),
                React.createElement(reactBootstrap.Row, null,
                    React.createElement(reactBootstrap.Col, { lg: 12 }, this.props.children))));
    };

    return ForumBody;
}(React.Component));
var ForumHeader = (function (superclass) {
    function ForumHeader () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) ForumHeader.__proto__ = superclass;
    ForumHeader.prototype = Object.create( superclass && superclass.prototype );
    ForumHeader.prototype.constructor = ForumHeader;

    ForumHeader.prototype.getCreatedOnText = function getCreatedOnText (createdOn, modifiedOn) {
        var date = moment(createdOn);
        var dateText = date.format("D-MM-YY");
        var timeText = date.format(" H:mm");
        if (!modifiedOn)
            { return ("Udgivet " + dateText + " kl. " + timeText); }
        var modified = moment(modifiedOn);
        var modifiedDate = modified.format("D-MM-YY");
        var modifiedTime = modified.format("H:mm");
        return ("Udgivet " + dateText + " kl. " + timeText + " ( rettet " + modifiedDate + " kl. " + modifiedTime + " )");
    };
    ForumHeader.prototype.render = function render () {
        var ref = this.props;
        var title = ref.title;
        var name = ref.name;
        var createdOn = ref.createdOn;
        var modifiedOn = ref.modifiedOn;
        var lg = ref.lg;
        var lgOffset = ref.lgOffset;
        var created = this.getCreatedOnText(createdOn, modifiedOn);
        var props = { lg: lg, lgOffset: lgOffset };
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Col, __assign({}, props),
                React.createElement("h3", null,
                    React.createElement("span", { className: "text-capitalize" }, title),
                    React.createElement("br", null),
                    React.createElement("small", null,
                        "Skrevet af ",
                        name)),
                React.createElement("small", { className: "text-primary" },
                    React.createElement(reactBootstrap.Glyphicon, { glyph: "time" }),
                    " ",
                    created),
                React.createElement(reactBootstrap.Row, null, this.props.children)));
    };

    return ForumHeader;
}(React.Component));
var ForumButtonGroup = (function (superclass) {
    function ForumButtonGroup(props) {
        superclass.call(this, props);
        this.state = {
            read: props.initialRead
        };
        this.readHandle = this.readHandle.bind(this);
        this.unreadHandle = this.unreadHandle.bind(this);
    }

    if ( superclass ) ForumButtonGroup.__proto__ = superclass;
    ForumButtonGroup.prototype = Object.create( superclass && superclass.prototype );
    ForumButtonGroup.prototype.constructor = ForumButtonGroup;
    ForumButtonGroup.prototype.readHandle = function readHandle () {
        var ref = this.props;
        var onRead = ref.onRead;
        if (this.state.read)
            { return; }
        this.setState({ read: true });
        onRead();
    };
    ForumButtonGroup.prototype.unreadHandle = function unreadHandle () {
        var ref = this.props;
        var onUnread = ref.onUnread;
        if (!this.state.read)
            { return; }
        this.setState({ read: false });
        onUnread();
    };
    ForumButtonGroup.prototype.render = function render () {
        var ref = this.props;
        var editable = ref.editable;
        var show = ref.show;
        var onDelete = ref.onDelete;
        var onEdit = ref.onEdit;
        if (!show)
            { return null; }
        var ref$1 = this.state;
        var read = ref$1.read;
        return React.createElement(reactBootstrap.Col, { lg: 12, className: "forum-editbar" },
            React.createElement(reactBootstrap.ButtonToolbar, null,
                React.createElement(reactBootstrap.ButtonGroup, null,
                    React.createElement(ButtonTooltip, { bsStyle: "danger", onClick: onDelete, icon: "trash", tooltip: "slet indlæg", mount: editable }),
                    React.createElement(ButtonTooltip, { bsStyle: "primary", onClick: onEdit, icon: "pencil", tooltip: "ændre indlæg", active: false, mount: editable }),
                    React.createElement(ButtonTooltip, { bsStyle: "primary", onClick: this.readHandle, icon: "eye-open", tooltip: "marker som læst", active: read, mount: true }),
                    React.createElement(ButtonTooltip, { bsStyle: "primary", onClick: this.unreadHandle, icon: "eye-close", tooltip: "marker som ulæst", active: !read, mount: true }))));
    };

    return ForumButtonGroup;
}(React.Component));
var ForumPostRedux = reactRedux.connect(mapStateToProps$4, mapDispatchToProps$4)(ForumPostContainer);
var ForumPost = reactRouter.withRouter(ForumPostRedux);

var Pagination$1 = (function (superclass) {
    function Pagination () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) Pagination.__proto__ = superclass;
    Pagination.prototype = Object.create( superclass && superclass.prototype );
    Pagination.prototype.constructor = Pagination;

    Pagination.prototype.render = function render () {
        var ref = this.props;
        var totalPages = ref.totalPages;
        var page = ref.page;
        var pageHandle = ref.pageHandle;
        var show = ref.show;
        var more = totalPages > 1;
        var xor = (show || more) && !(show && more);
        if (!(xor || (show && more)))
            { return null; }
        return React.createElement(reactBootstrap.Pagination, { prev: true, next: true, ellipsis: true, boundaryLinks: true, items: totalPages, maxButtons: 5, activePage: page, onSelect: pageHandle });
    };

    return Pagination;
}(React.Component));

var mapStateToProps$3 = function (state) {
    return {
        items: state.whatsNewInfo.items,
        getUser: function (id) { return state.usersInfo.users[id]; },
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take,
        totalPages: state.whatsNewInfo.totalPages,
        page: state.whatsNewInfo.page,
    };
};
var mapDispatchToProps$3 = function (dispatch) {
    return {
        getLatest: function (skip, take) { return dispatch(fetchLatestNews(skip, take)); },
    };
};
var WhatsNewContainer = (function (superclass) {
    function WhatsNewContainer(props) {
        superclass.call(this, props);
        this.state = {
            modal: false,
            postPreview: null,
            author: null,
            on: null
        };
        this.pageHandle = this.pageHandle.bind(this);
        this.previewPost = this.previewPost.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.modalView = this.modalView.bind(this);
        this.navigateTo = this.navigateTo.bind(this);
    }

    if ( superclass ) WhatsNewContainer.__proto__ = superclass;
    WhatsNewContainer.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewContainer.prototype.constructor = WhatsNewContainer;
    WhatsNewContainer.prototype.pageHandle = function pageHandle (to) {
        var ref = this.props;
        var getLatest = ref.getLatest;
        var page = ref.page;
        var take = ref.take;
        if (page === to)
            { return; }
        var skipPages = to - 1;
        var skipItems = (skipPages * take);
        getLatest(skipItems, take);
    };
    WhatsNewContainer.prototype.previewPost = function previewPost (item) {
        var ref = this.props;
        var getUser = ref.getUser;
        var author = getUser(item.AuthorID);
        this.setState({
            modal: true,
            postPreview: item.Item,
            author: author,
            on: item.On
        });
    };
    WhatsNewContainer.prototype.navigateTo = function navigateTo (url) {
        var ref = this.props.router;
        var push = ref.push;
        push(url);
    };
    WhatsNewContainer.prototype.closeModal = function closeModal () {
        this.setState({
            modal: false,
            postPreview: null,
            author: null,
            on: null
        });
    };
    WhatsNewContainer.prototype.modalView = function modalView () {
        var this$1 = this;

        if (!Boolean(this.state.postPreview))
            { return null; }
        var ref = this.state.postPreview;
        var Text = ref.Text;
        var Title = ref.Title;
        var ID = ref.ID;
        var author = this.state.author;
        var name = (author.FirstName) + " " + (author.LastName);
        var link = "forum/post/" + ID + "/comments";
        return React.createElement(reactBootstrap.Modal, { show: this.state.modal, onHide: this.closeModal, bsSize: "large" },
            React.createElement(reactBootstrap.Modal.Header, { closeButton: true },
                React.createElement(reactBootstrap.Modal.Title, null,
                    React.createElement(ForumHeader, { lg: 11, lgOffset: 1, createdOn: this.state.on, title: Title, name: name }))),
            React.createElement(reactBootstrap.Modal.Body, null,
                React.createElement(ForumBody, { text: Text, lg: 11, lgOffset: 1 })),
            React.createElement(reactBootstrap.Modal.Footer, null,
                React.createElement(reactBootstrap.ButtonToolbar, { style: { float: "right" } },
                    React.createElement(reactBootstrap.Button, { bsStyle: "primary", onClick: function () { return this$1.navigateTo(link); } }, "Se kommentarer (forum)"),
                    React.createElement(reactBootstrap.Button, { onClick: this.closeModal }, "Luk"))));
    };
    WhatsNewContainer.prototype.render = function render () {
        var ref = this.props;
        var items = ref.items;
        var getUser = ref.getUser;
        var totalPages = ref.totalPages;
        var page = ref.page;
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Col, null,
                React.createElement("h3", null, "Sidste h\u00E6ndelser"),
                React.createElement("hr", null),
                React.createElement(WhatsNewList, { items: items, getUser: getUser, preview: this.previewPost }),
                React.createElement(Pagination$1, { totalPages: totalPages, page: page, pageHandle: this.pageHandle }),
                this.modalView()));
    };

    return WhatsNewContainer;
}(React.Component));
var WhatsNew = reactRouter.withRouter(reactRedux.connect(mapStateToProps$3, mapDispatchToProps$3)(WhatsNewContainer));

var mapStateToProps$1 = function (state) {
    var user = state.usersInfo.users[state.usersInfo.currentUserId];
    var name = user ? user.FirstName : "User";
    return {
        name: name,
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take
    };
};
var mapDispatchToProps$1 = function (dispatch) {
    return {
        uploadImage: function (skip, take, username, description, formData) {
            var onSuccess = function () {
                dispatch(fetchLatestNews(skip, take));
            };
            dispatch(uploadImage(username, description, formData, onSuccess, function (r) { console.log(r); }));
        }
    };
};
var HomeContainer = (function (superclass) {
    function HomeContainer(props) {
        superclass.call(this, props);
        this.state = {
            recommended: true
        };
        this.upload = this.upload.bind(this);
        this.recommendedView = this.recommendedView.bind(this);
    }

    if ( superclass ) HomeContainer.__proto__ = superclass;
    HomeContainer.prototype = Object.create( superclass && superclass.prototype );
    HomeContainer.prototype.constructor = HomeContainer;
    HomeContainer.prototype.componentDidMount = function componentDidMount () {
        document.title = "Forside";
    };
    HomeContainer.prototype.upload = function upload (username, description, formData) {
        var ref = this.props;
        var uploadImage = ref.uploadImage;
        var skip = ref.skip;
        var take = ref.take;
        uploadImage(skip, take, username, description, formData);
    };
    HomeContainer.prototype.recommendedView = function recommendedView () {
        var this$1 = this;

        if (!this.state.recommended)
            { return null; }
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Col, null,
                React.createElement(reactBootstrap.Alert, { bsStyle: "success", onDismiss: function () { return this$1.setState({ recommended: false }); } },
                    React.createElement("h4", null, "Anbefalinger"),
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            "Testet med Google Chrome browser. Derfor er det anbefalet at bruge denne til at f\u00E5 den fulde oplevelse.",
                            React.createElement("br", null))))));
    };
    HomeContainer.prototype.render = function render () {
        var ref = this.props;
        var name = ref.name;
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Jumbotron, null,
                React.createElement("h1", null,
                    React.createElement("span", null,
                        "Velkommen ",
                        React.createElement("small", null,
                            name,
                            "!"))),
                React.createElement("p", { className: "lead" }, "Til Inuplans forum og billed-arkiv side"),
                React.createElement(reactBootstrap.Row, null,
                    React.createElement(reactBootstrap.Col, { lg: 4 },
                        React.createElement(reactBootstrap.Panel, { header: "Du kan uploade billeder til dit eget galleri her", bsStyle: "primary" },
                            React.createElement(ImageUpload, { username: globals.currentUsername, uploadImage: this.upload }))))),
            React.createElement(reactBootstrap.Grid, { fluid: true },
                React.createElement(reactBootstrap.Row, null,
                    React.createElement(reactBootstrap.Col, { lg: 2 }),
                    React.createElement(reactBootstrap.Col, { lg: 4 },
                        React.createElement(WhatsNew, null)),
                    React.createElement(reactBootstrap.Col, { lgOffset: 1, lg: 3 },
                        this.recommendedView(),
                        React.createElement("h3", null, "Personlig upload forbrug"),
                        React.createElement("hr", null),
                        React.createElement("p", null, "Herunder kan du se hvor meget plads du har brugt og hvor meget fri plads" + " " + "der er tilbage. G\u00E6lder kun billede filer."),
                        React.createElement(UsedSpace, null)))));
    };

    return HomeContainer;
}(React.Component));
var Home = reactRedux.connect(mapStateToProps$1, mapDispatchToProps$1)(HomeContainer);

var Forum = (function (superclass) {
    function Forum () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) Forum.__proto__ = superclass;
    Forum.prototype = Object.create( superclass && superclass.prototype );
    Forum.prototype.constructor = Forum;

    Forum.prototype.render = function render () {
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Col, { lgOffset: 2, lg: 8 },
                React.createElement("h1", null,
                    "Forum ",
                    React.createElement("small", null, "indl\u00E6g")),
                React.createElement("hr", null),
                this.props.children));
    };

    return Forum;
}(React.PureComponent));

var ForumTitle = (function (superclass) {
    function ForumTitle () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) ForumTitle.__proto__ = superclass;
    ForumTitle.prototype = Object.create( superclass && superclass.prototype );
    ForumTitle.prototype.constructor = ForumTitle;

    ForumTitle.prototype.dateView = function dateView (date) {
        var dayMonthYear = moment(date).format("D/MM/YY");
        return ("" + dayMonthYear);
    };
    ForumTitle.prototype.modifiedView = function modifiedView (modifiedOn) {
        if (!modifiedOn)
            { return null; }
        var modifiedDate = moment(modifiedOn).format("D/MM/YY-H:mm");
        return ("" + modifiedDate);
    };
    ForumTitle.prototype.tooltipView = function tooltipView () {
        return React.createElement(reactBootstrap.Tooltip, { id: "tooltip" }, "Vigtig");
    };
    ForumTitle.prototype.stickyIcon = function stickyIcon (show) {
        if (!show)
            { return null; }
        return React.createElement("p", { className: "sticky" },
            React.createElement(reactBootstrap.OverlayTrigger, { placement: "top", overlay: this.tooltipView() },
                React.createElement(reactBootstrap.Glyphicon, { glyph: "pushpin" })));
    };
    ForumTitle.prototype.dateModifiedView = function dateModifiedView (title) {
        var created = this.dateView(title.CreatedOn);
        var updated = this.modifiedView(title.LastModified);
        if (!updated)
            { return React.createElement("span", null, created); }
        return React.createElement("span", null,
            created,
            React.createElement("br", null),
            "(",
            updated,
            ")");
    };
    ForumTitle.prototype.createSummary = function createSummary () {
        var ref = this.props;
        var title = ref.title;
        if (!title.LatestComment)
            { return "Ingen kommentarer"; }
        if (title.LatestComment.Deleted)
            { return "Kommentar slettet"; }
        var text = title.LatestComment.Text;
        return getWords(text, 5);
    };
    ForumTitle.prototype.render = function render () {
        var ref = this.props;
        var title = ref.title;
        var getAuthor = ref.getAuthor;
        var name = getAuthor(title.AuthorID);
        var latestComment = this.createSummary();
        var css = title.Sticky ? "thread thread-pinned" : "thread";
        var path = "/forum/post/" + (title.ID) + "/comments";
        return React.createElement(reactRouter.Link, { to: path },
            React.createElement(reactBootstrap.Row, { className: css },
                React.createElement(reactBootstrap.Col, { lg: 1, className: "text-center" }, this.stickyIcon(title.Sticky)),
                React.createElement(reactBootstrap.Col, { lg: 5 },
                    React.createElement("h4", null,
                        React.createElement("span", { className: "text-capitalize" }, title.Title)),
                    React.createElement("small", null,
                        "Af: ",
                        name)),
                React.createElement(reactBootstrap.Col, { lg: 2, className: "text-left" },
                    React.createElement("p", null, this.dateModifiedView(title))),
                React.createElement(reactBootstrap.Col, { lg: 2, className: "text-center" },
                    React.createElement("p", null, title.ViewedBy.length)),
                React.createElement(reactBootstrap.Col, { lg: 2, className: "text-center" },
                    React.createElement("p", null, latestComment))));
    };

    return ForumTitle;
}(React.Component));

var mapStateToProps$5 = function (state) {
    return {
        threads: state.forumInfo.titlesInfo.titles,
        skip: state.forumInfo.titlesInfo.skip,
        take: state.forumInfo.titlesInfo.take,
        page: state.forumInfo.titlesInfo.page,
        totalPages: state.forumInfo.titlesInfo.totalPages,
        getAuthor: function (id) {
            var user = state.usersInfo.users[id];
            return ((user.FirstName) + " " + (user.LastName));
        },
    };
};
var mapDispatchToProps$5 = function (dispatch) {
    return {
        fetchThreads: function (skip, take) {
            dispatch(fetchThreads(skip, take));
        },
        postThread: function (cb, post) {
            dispatch(postThread(post, cb));
        }
    };
};
var ForumListContainer = (function (superclass) {
    function ForumListContainer(props) {
        superclass.call(this, props);
        this.state = {
            newPost: false
        };
        this.pageHandle = this.pageHandle.bind(this);
        this.close = this.close.bind(this);
    }

    if ( superclass ) ForumListContainer.__proto__ = superclass;
    ForumListContainer.prototype = Object.create( superclass && superclass.prototype );
    ForumListContainer.prototype.constructor = ForumListContainer;
    ForumListContainer.prototype.componentDidMount = function componentDidMount () {
        document.title = "Inuplan Forum";
    };
    ForumListContainer.prototype.pageHandle = function pageHandle (to) {
        var ref = this.props;
        var fetchThreads = ref.fetchThreads;
        var page = ref.page;
        var take = ref.take;
        if (page === to)
            { return; }
        var skipItems = (to - 1) * take;
        fetchThreads(skipItems, take);
    };
    ForumListContainer.prototype.threadViews = function threadViews () {
        var ref = this.props;
        var threads = ref.threads;
        var getAuthor = ref.getAuthor;
        return threads.map(function (thread) {
            var id = "thread_" + (thread.ID);
            return React.createElement(ForumTitle, { title: thread, key: id, getAuthor: getAuthor });
        });
    };
    ForumListContainer.prototype.submit = function submit (post) {
        var ref = this.props;
        var postThread = ref.postThread;
        var fetchThreads = ref.fetchThreads;
        var skip = ref.skip;
        var take = ref.take;
        postThread(function () { return fetchThreads(skip, take); }, post);
    };
    ForumListContainer.prototype.close = function close () {
        this.setState({ newPost: false });
    };
    ForumListContainer.prototype.show = function show () {
        this.setState({ newPost: true });
    };
    ForumListContainer.prototype.render = function render () {
        var ref = this.props;
        var totalPages = ref.totalPages;
        var page = ref.page;
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.ButtonGroup, null,
                React.createElement(reactBootstrap.Button, { bsStyle: "primary", onClick: this.show.bind(this) }, "Tilf\u00F8j nyt indl\u00E6g")),
            React.createElement(reactBootstrap.Col, { lg: 12 },
                React.createElement(reactBootstrap.Row, { className: "thread-head" },
                    React.createElement(reactBootstrap.Col, { lg: 1 },
                        React.createElement("strong", null, "Info")),
                    React.createElement(reactBootstrap.Col, { lg: 5 },
                        React.createElement("strong", null, "Overskrift")),
                    React.createElement(reactBootstrap.Col, { lg: 2, className: "text-center" },
                        React.createElement("strong", null, "Dato")),
                    React.createElement(reactBootstrap.Col, { lg: 2, className: "text-center" },
                        React.createElement("strong", null, "L\u00E6st af")),
                    React.createElement(reactBootstrap.Col, { lg: 2, className: "text-center" },
                        React.createElement("strong", null, "Seneste kommentar"))),
                this.threadViews(),
                React.createElement(Pagination$1, { totalPages: totalPages, page: page, pageHandle: this.pageHandle, show: true })),
            React.createElement(ForumForm, { show: this.state.newPost, close: this.close.bind(this), onSubmit: this.submit.bind(this) }));
    };

    return ForumListContainer;
}(React.Component));
var ForumList = reactRedux.connect(mapStateToProps$5, mapDispatchToProps$5)(ForumListContainer);

var CommentDeleted = (function (superclass) {
    function CommentDeleted () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) CommentDeleted.__proto__ = superclass;
    CommentDeleted.prototype = Object.create( superclass && superclass.prototype );
    CommentDeleted.prototype.constructor = CommentDeleted;

    CommentDeleted.prototype.render = function render () {
        var ref = this.props;
        var replies = ref.replies;
        var construct = ref.construct;
        var replyNodes = replies.map(function (reply) { return construct(reply); });
        return React.createElement(reactBootstrap.Media, null,
            React.createElement(reactBootstrap.Media.Left, { className: "comment-deleted-left" }),
            React.createElement(reactBootstrap.Media.Body, null,
                React.createElement("p", { className: "text-muted comment-deleted" },
                    React.createElement("span", null,
                        React.createElement(reactBootstrap.Glyphicon, { glyph: "remove-sign" }),
                        " Kommentar slettet")),
                replyNodes));
    };

    return CommentDeleted;
}(React.Component));

var __assign$3 = (undefined && undefined.__assign) || Object.assign || function(t) {
    var arguments$1 = arguments;

    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments$1[i];
        for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p))
            { t[p] = s[p]; } }
    }
    return t;
};
var Comment = (function (superclass) {
    function Comment () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) Comment.__proto__ = superclass;
    Comment.prototype = Object.create( superclass && superclass.prototype );
    Comment.prototype.constructor = Comment;

    Comment.prototype.ago = function ago () {
        var ref = this.props;
        var postedOn = ref.postedOn;
        return timeText(postedOn);
    };
    Comment.prototype.editedView = function editedView (edited) {
        if (!edited)
            { return null; }
        return React.createElement("span", null, "*");
    };
    Comment.prototype.render = function render () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var contextId = ref.contextId;
        var name = ref.name;
        var text = ref.text;
        var commentId = ref.commentId;
        var replies = ref.replies;
        var construct = ref.construct;
        var authorId = ref.authorId;
        var edited = ref.edited;
        var ref$1 = this.props;
        var skip = ref$1.skip;
        var take = ref$1.take;
        var editComment = ref$1.editComment;
        var deleteComment = ref$1.deleteComment;
        var replyComment = ref$1.replyComment;
        var props = { skip: skip, take: take, editComment: editComment, deleteComment: deleteComment, replyComment: replyComment };
        var txt = formatText(text);
        var replyNodes = replies.map(function (reply) { return construct(reply); });
        return React.createElement(reactBootstrap.Media, null,
            React.createElement(CommentProfile, null),
            React.createElement(reactBootstrap.Media.Body, null,
                React.createElement("h5", { className: "media-heading" },
                    React.createElement("strong", null, name),
                    " ",
                    React.createElement("small", null,
                        "sagde ",
                        this.ago(),
                        this.editedView(edited))),
                React.createElement("span", { dangerouslySetInnerHTML: txt }),
                React.createElement(CommentControls, __assign$3({ contextId: contextId, canEdit: canEdit, authorId: authorId, commentId: commentId, text: text }, props)),
                replyNodes));
    };

    return Comment;
}(React.Component));

var __assign$2 = (undefined && undefined.__assign) || Object.assign || function(t) {
    var arguments$1 = arguments;

    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments$1[i];
        for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p))
            { t[p] = s[p]; } }
    }
    return t;
};
var CommentList = (function (superclass) {
    function CommentList(props) {
        superclass.call(this, props);
        this.constructComment = this.constructComment.bind(this);
    }

    if ( superclass ) CommentList.__proto__ = superclass;
    CommentList.prototype = Object.create( superclass && superclass.prototype );
    CommentList.prototype.constructor = CommentList;
    CommentList.prototype.rootComments = function rootComments (comments) {
        var this$1 = this;

        if (!comments)
            { return null; }
        return comments.map(function (comment) {
            var node = this$1.constructComment(comment);
            return React.createElement(reactBootstrap.Media.ListItem, { key: "rootComment_" + comment.CommentID }, node);
        });
    };
    CommentList.prototype.constructComment = function constructComment (comment) {
        var key = "commentId" + comment.CommentID;
        if (comment.Deleted)
            { return React.createElement(CommentDeleted, { key: key, construct: this.constructComment, replies: comment.Replies }); }
        var ref = this.props;
        var contextId = ref.contextId;
        var getName = ref.getName;
        var canEdit = ref.canEdit;
        var ref$1 = this.props;
        var skip = ref$1.skip;
        var take = ref$1.take;
        var editComment = ref$1.editComment;
        var deleteComment = ref$1.deleteComment;
        var replyComment = ref$1.replyComment;
        var controls = { skip: skip, take: take, editComment: editComment, deleteComment: deleteComment, replyComment: replyComment };
        var name = getName(comment.AuthorID);
        return React.createElement(Comment, __assign$2({ key: key, contextId: contextId, name: name, postedOn: comment.PostedOn, authorId: comment.AuthorID, text: comment.Text, construct: this.constructComment, replies: comment.Replies, edited: comment.Edited, canEdit: canEdit, commentId: comment.CommentID }, controls));
    };
    CommentList.prototype.render = function render () {
        var ref = this.props;
        var comments = ref.comments;
        var nodes = this.rootComments(comments);
        return React.createElement(reactBootstrap.Media.List, null, nodes);
    };

    return CommentList;
}(React.Component));

var CommentForm = (function (superclass) {
    function CommentForm(props) {
        superclass.call(this, props);
        this.state = {
            Text: ""
        };
        this.postComment = this.postComment.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    if ( superclass ) CommentForm.__proto__ = superclass;
    CommentForm.prototype = Object.create( superclass && superclass.prototype );
    CommentForm.prototype.constructor = CommentForm;
    CommentForm.prototype.postComment = function postComment (e) {
        e.preventDefault();
        var ref = this.props;
        var postHandle = ref.postHandle;
        postHandle(this.state.Text);
        this.setState({ Text: "" });
    };
    CommentForm.prototype.handleTextChange = function handleTextChange (e) {
        this.setState({ Text: e.target.value });
    };
    CommentForm.prototype.render = function render () {
        return React.createElement("form", { onSubmit: this.postComment },
            React.createElement("label", { htmlFor: "remark" }, "Kommentar"),
            React.createElement("textarea", { className: "form-control", onChange: this.handleTextChange, value: this.state.Text, placeholder: "Skriv kommentar her...", id: "remark", rows: 4 }),
            React.createElement("br", null),
            React.createElement("button", { type: "submit", className: "btn btn-primary" }, "Send"));
    };

    return CommentForm;
}(React.Component));

var setSkipComments = function (skip) {
    return {
        type: 34,
        payload: skip
    };
};
var setTakeComments = function (take) {
    return {
        type: 37,
        payload: take
    };
};
var setCurrentPage = function (page) {
    return {
        type: 38,
        payload: page
    };
};
var setTotalPages$2 = function (totalPages) {
    return {
        type: 39,
        payload: totalPages
    };
};
var receivedComments = function (comments) {
    return {
        type: 41,
        payload: comments
    };
};
var setFocusedComment = function (commentId) {
    return {
        type: 43,
        payload: commentId
    };
};
var fetchComments = function (url, skip, take) {
    return function (dispatch) {
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(url, options)
            .then(handler)
            .then(function (data) {
            var pageComments = data.CurrentItems;
            dispatch(setSkipComments(skip));
            dispatch(setTakeComments(take));
            dispatch(setCurrentPage(data.CurrentPage));
            dispatch(setTotalPages$2(data.TotalPages));
            var comments = pageComments.map(normalizeComment);
            dispatch(receivedComments(comments));
        });
    };
};
var postComment = function (url, contextId, text, parentCommentId, cb) {
    return function (_) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        var body = JSON.stringify({
            Text: text,
            ContextID: contextId,
            ParentID: parentCommentId
        });
        var opt = Object.assign({}, options, {
            method: "POST",
            body: body,
            headers: headers
        });
        return fetch(url, opt)
            .then(cb);
    };
};
var editComment = function (url, commentId, text, cb) {
    return function (_) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        var opt = Object.assign({}, options, {
            method: "PUT",
            body: JSON.stringify({ ID: commentId, Text: text }),
            headers: headers
        });
        return fetch(url, opt)
            .then(cb);
    };
};
var deleteComment = function (url, cb) {
    return function (_) {
        var opt = Object.assign({}, options, {
            method: "DELETE"
        });
        return fetch(url, opt)
            .then(cb);
    };
};
var fetchAndFocusSingleComment = function (id) {
    return function (dispatch) {
        var url = (globals.urls.imagecomments) + "/GetSingle?id=" + id;
        var handler = responseHandler(dispatch)(function (r) { return r.json(); });
        return fetch(url, options)
            .then(handler)
            .then(function (c) {
            var comment = normalizeComment(c);
            dispatch(receivedComments([comment]));
            dispatch(setFocusedComment(comment.CommentID));
        });
    };
};

var __assign$1 = (undefined && undefined.__assign) || Object.assign || function(t) {
    var arguments$1 = arguments;

    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments$1[i];
        for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p))
            { t[p] = s[p]; } }
    }
    return t;
};
var mapStateToProps$6 = function (state) {
    return {
        comments: state.commentsInfo.comments,
        getName: function (id) {
            var user = state.usersInfo.users[id];
            if (!user)
                { return ""; }
            return ((user.FirstName) + " " + (user.LastName));
        },
        canEdit: function (id) { return state.usersInfo.currentUserId === id; },
        postId: state.forumInfo.titlesInfo.selectedThread,
        page: state.commentsInfo.page,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        totalPages: state.commentsInfo.totalPages,
    };
};
var mapDispatchToProps$6 = function (dispatch) {
    return {
        editHandle: function (commentId, _, text, cb) {
            var url = globals.urls.forumcomments;
            dispatch(editComment(url, commentId, text, cb));
        },
        deleteHandle: function (commentId, cb) {
            var url = getForumCommentsDeleteUrl(commentId);
            dispatch(deleteComment(url, cb));
        },
        replyHandle: function (postId, text, parentId, cb) {
            var url = globals.urls.forumcomments;
            dispatch(postComment(url, postId, text, parentId, cb));
        },
        loadComments: function (postId, skip, take) {
            var url = getForumCommentsPageUrl(postId, skip, take);
            dispatch(fetchComments(url, skip, take));
        },
        postHandle: function (postId, text, cb) {
            var url = globals.urls.forumcomments;
            dispatch(postComment(url, postId, text, null, cb));
        }
    };
};
var ForumCommentsContainer = (function (superclass) {
    function ForumCommentsContainer(props) {
        superclass.call(this, props);
        this.deleteComment = this.deleteComment.bind(this);
        this.editComment = this.editComment.bind(this);
        this.replyComment = this.replyComment.bind(this);
        this.postComment = this.postComment.bind(this);
        this.pageHandle = this.pageHandle.bind(this);
    }

    if ( superclass ) ForumCommentsContainer.__proto__ = superclass;
    ForumCommentsContainer.prototype = Object.create( superclass && superclass.prototype );
    ForumCommentsContainer.prototype.constructor = ForumCommentsContainer;
    ForumCommentsContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
        var ref = this.props;
        var loadComments = ref.loadComments;
        var postId = ref.postId;
        var take = ref.take;
        var ref$1 = nextProps.location.query;
        var page = ref$1.page;
        if (!Number(page))
            { return; }
        var skipPages = page - 1;
        var skipItems = (skipPages * take);
        loadComments(postId, skipItems, take);
    };
    ForumCommentsContainer.prototype.pageHandle = function pageHandle (to) {
        var ref = this.props;
        var postId = ref.postId;
        var page = ref.page;
        var ref$1 = this.props.router;
        var push = ref$1.push;
        if (page === to)
            { return; }
        var url = "/forum/post/" + postId + "/comments?page=" + to;
        push(url);
    };
    ForumCommentsContainer.prototype.deleteComment = function deleteComment$1 (commentId, postId) {
        var ref = this.props;
        var deleteHandle = ref.deleteHandle;
        var loadComments = ref.loadComments;
        var skip = ref.skip;
        var take = ref.take;
        var cb = function () {
            loadComments(postId, skip, take);
        };
        deleteHandle(commentId, cb);
    };
    ForumCommentsContainer.prototype.editComment = function editComment$1 (commentId, postId, text) {
        var ref = this.props;
        var editHandle = ref.editHandle;
        var loadComments = ref.loadComments;
        var skip = ref.skip;
        var take = ref.take;
        var cb = function () {
            loadComments(postId, skip, take);
        };
        editHandle(commentId, postId, text, cb);
    };
    ForumCommentsContainer.prototype.replyComment = function replyComment (postId, text, parentId) {
        var ref = this.props;
        var replyHandle = ref.replyHandle;
        var loadComments = ref.loadComments;
        var skip = ref.skip;
        var take = ref.take;
        var cb = function () {
            loadComments(postId, skip, take);
        };
        replyHandle(postId, text, parentId, cb);
    };
    ForumCommentsContainer.prototype.postComment = function postComment$1 (text) {
        var ref = this.props;
        var loadComments = ref.loadComments;
        var postId = ref.postId;
        var skip = ref.skip;
        var take = ref.take;
        var postHandle = ref.postHandle;
        var cb = function () {
            loadComments(postId, skip, take);
        };
        postHandle(postId, text, cb);
    };
    ForumCommentsContainer.prototype.render = function render () {
        var ref = this.props;
        var comments = ref.comments;
        var getName = ref.getName;
        var canEdit = ref.canEdit;
        var totalPages = ref.totalPages;
        var page = ref.page;
        var skip = ref.skip;
        var take = ref.take;
        var ref$1 = this.props.params;
        var id = ref$1.id;
        var controls = {
            skip: skip,
            take: take,
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        };
        return React.createElement(reactBootstrap.Row, { className: "forum-comments-list" },
            React.createElement("h4", { className: "forum-comments-heading" }, "Kommentarer"),
            React.createElement(CommentList, __assign$1({ comments: comments, contextId: Number(id), getName: getName, canEdit: canEdit }, controls)),
            React.createElement(Pagination$1, { totalPages: totalPages, page: page, pageHandle: this.pageHandle }),
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactBootstrap.Col, { lg: 12 },
                    React.createElement("hr", null),
                    React.createElement(CommentForm, { postHandle: this.postComment }),
                    React.createElement("br", null))));
    };

    return ForumCommentsContainer;
}(React.Component));
var ForumCommentsContainerRedux = reactRedux.connect(mapStateToProps$6, mapDispatchToProps$6)(ForumCommentsContainer);
var ForumComments = reactRouter.withRouter(ForumCommentsContainerRedux);

var User = (function (superclass) {
    function User () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) User.__proto__ = superclass;
    User.prototype = Object.create( superclass && superclass.prototype );
    User.prototype.constructor = User;

    User.prototype.render = function render () {
        var ref = this.props;
        var username = ref.username;
        var firstName = ref.firstName;
        var lastName = ref.lastName;
        var email = ref.email;
        var emailLink = "mailto:" + email;
        var gallery = "/" + username + "/gallery";
        return React.createElement(reactBootstrap.Col, { lg: 3 },
            React.createElement(reactBootstrap.Panel, { header: (firstName + " " + lastName) },
                React.createElement(UserItem, { title: "Brugernavn" }, username),
                React.createElement(UserItem, { title: "Email" },
                    React.createElement("a", { href: emailLink }, email)),
                React.createElement(UserItem, { title: "Billeder" },
                    React.createElement(reactRouter.Link, { to: gallery }, "Billeder"))));
    };

    return User;
}(React.Component));
var UserHeading = (function (superclass) {
    function UserHeading () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) UserHeading.__proto__ = superclass;
    UserHeading.prototype = Object.create( superclass && superclass.prototype );
    UserHeading.prototype.constructor = UserHeading;

    UserHeading.prototype.render = function render () {
        return React.createElement(reactBootstrap.Col, { lg: 6 },
            React.createElement("strong", null, this.props.children));
    };

    return UserHeading;
}(React.Component));
var UserBody = (function (superclass) {
    function UserBody () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) UserBody.__proto__ = superclass;
    UserBody.prototype = Object.create( superclass && superclass.prototype );
    UserBody.prototype.constructor = UserBody;

    UserBody.prototype.render = function render () {
        return React.createElement(reactBootstrap.Col, { lg: 6 }, this.props.children);
    };

    return UserBody;
}(React.Component));
var UserItem = (function (superclass) {
    function UserItem () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) UserItem.__proto__ = superclass;
    UserItem.prototype = Object.create( superclass && superclass.prototype );
    UserItem.prototype.constructor = UserItem;

    UserItem.prototype.render = function render () {
        var ref = this.props;
        var title = ref.title;
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(UserHeading, null, title),
            React.createElement(UserBody, null, this.props.children));
    };

    return UserItem;
}(React.Component));

var UserList = (function (superclass) {
    function UserList () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) UserList.__proto__ = superclass;
    UserList.prototype = Object.create( superclass && superclass.prototype );
    UserList.prototype.constructor = UserList;

    UserList.prototype.userNodes = function userNodes () {
        var ref = this.props;
        var users = ref.users;
        return users.map(function (user) {
            var userId = "userId_" + (user.ID);
            return React.createElement(User, { username: user.Username, userId: user.ID, firstName: user.FirstName, lastName: user.LastName, email: user.Email, profileUrl: user.ProfileImage, roles: user.Role, key: userId });
        });
    };
    UserList.prototype.render = function render () {
        return React.createElement(reactBootstrap.Row, null, this.userNodes());
    };

    return UserList;
}(React.Component));

var Breadcrumb = (function (superclass) {
    function Breadcrumb () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) Breadcrumb.__proto__ = superclass;
    Breadcrumb.prototype = Object.create( superclass && superclass.prototype );
    Breadcrumb.prototype.constructor = Breadcrumb;

    Breadcrumb.prototype.render = function render () {
        return React.createElement("ol", { className: "breadcrumb" }, this.props.children);
    };

    return Breadcrumb;
}(React.Component));
(function (Breadcrumb) {
    var Item = (function (superclass) {
        function Item () {
            superclass.apply(this, arguments);
        }

        if ( superclass ) Item.__proto__ = superclass;
        Item.prototype = Object.create( superclass && superclass.prototype );
        Item.prototype.constructor = Item;

        Item.prototype.render = function render () {
            var ref = this.props;
            var href = ref.href;
            var active = ref.active;
            if (active)
                { return React.createElement("li", { className: "active" }, this.props.children); }
            return React.createElement("li", null,
                React.createElement(reactRouter.Link, { to: href }, this.props.children));
        };

        return Item;
    }(React.Component));
    Breadcrumb.Item = Item;
})(Breadcrumb || (Breadcrumb = {}));

var mapUsersToProps = function (state) {
    return {
        users: underscore.values(state.usersInfo.users)
    };
};
var mapDispatchToProps$7 = function (dispatch) {
    return {
        getUsers: function () {
            dispatch(fetchUsers());
        }
    };
};
var UsersContainer = (function (superclass) {
    function UsersContainer () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) UsersContainer.__proto__ = superclass;
    UsersContainer.prototype = Object.create( superclass && superclass.prototype );
    UsersContainer.prototype.constructor = UsersContainer;

    UsersContainer.prototype.componentDidMount = function componentDidMount () {
        document.title = "Brugere";
    };
    UsersContainer.prototype.render = function render () {
        var ref = this.props;
        var users = ref.users;
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactBootstrap.Col, { lgOffset: 2, lg: 8 },
                    React.createElement(Breadcrumb, null,
                        React.createElement(Breadcrumb.Item, { href: "/" }, "Forside"),
                        React.createElement(Breadcrumb.Item, { active: true }, "Brugere")))),
            React.createElement(reactBootstrap.Col, { lgOffset: 2, lg: 8 },
                React.createElement(reactBootstrap.PageHeader, null,
                    "Inuplan's ",
                    React.createElement("small", null, "brugere")),
                React.createElement(reactBootstrap.Row, null,
                    React.createElement(UserList, { users: users }))));
    };

    return UsersContainer;
}(React.Component));
var Users = reactRedux.connect(mapUsersToProps, mapDispatchToProps$7)(UsersContainer);

var __assign$4 = (undefined && undefined.__assign) || Object.assign || function(t) {
    var arguments$1 = arguments;

    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments$1[i];
        for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p))
            { t[p] = s[p]; } }
    }
    return t;
};
var Image$1 = (function (superclass) {
    function Image(props) {
        superclass.call(this, props);
        this.checkboxHandler = this.checkboxHandler.bind(this);
    }

    if ( superclass ) Image.__proto__ = superclass;
    Image.prototype = Object.create( superclass && superclass.prototype );
    Image.prototype.constructor = Image;
    Image.prototype.checkboxHandler = function checkboxHandler (e) {
        var ref = this.props;
        var image = ref.image;
        var add = e.currentTarget.checked;
        if (add) {
            var ref$1 = this.props;
            var addSelectedImageId = ref$1.addSelectedImageId;
            addSelectedImageId(image.ImageID);
        }
        else {
            var ref$2 = this.props;
            var removeSelectedImageId = ref$2.removeSelectedImageId;
            removeSelectedImageId(image.ImageID);
        }
    };
    Image.prototype.commentIcon = function commentIcon (count) {
        var style = count === 0 ? "col-lg-6 text-muted" : "col-lg-6 text-primary";
        var props = {
            className: style
        };
        return React.createElement("div", __assign$4({}, props),
            React.createElement("span", { className: "glyphicon glyphicon-comment", "aria-hidden": "true" }),
            " ",
            count);
    };
    Image.prototype.checkboxView = function checkboxView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var imageIsSelected = ref.imageIsSelected;
        var image = ref.image;
        var checked = imageIsSelected(image.ImageID);
        return (canEdit ?
            React.createElement(reactBootstrap.Col, { lg: 6, className: "pull-right text-right" },
                React.createElement("label", null,
                    "Slet ",
                    React.createElement("input", { type: "checkbox", onClick: this.checkboxHandler, checked: checked })))
            : null);
    };
    Image.prototype.render = function render () {
        var ref = this.props;
        var image = ref.image;
        var username = ref.username;
        var count = image.CommentCount;
        var url = "/" + username + "/gallery/image/" + (image.ImageID) + "/comments";
        return React.createElement("div", null,
            React.createElement(reactRouter.Link, { to: url },
                React.createElement(reactBootstrap.Image, { src: image.PreviewUrl, thumbnail: true })),
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactRouter.Link, { to: url }, this.commentIcon(count)),
                this.checkboxView()));
    };

    return Image;
}(React.Component));

var elementsPerRow = 4;
var ImageList = (function (superclass) {
    function ImageList () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) ImageList.__proto__ = superclass;
    ImageList.prototype = Object.create( superclass && superclass.prototype );
    ImageList.prototype.constructor = ImageList;

    ImageList.prototype.arrangeArray = function arrangeArray (images) {
        var length = images.length;
        var times = Math.ceil(length / elementsPerRow);
        var result = [];
        var start = 0;
        for (var i = 0; i < times; i++) {
            start = i * elementsPerRow;
            var end = start + elementsPerRow;
            var last = end > length;
            if (last) {
                var row = images.slice(start);
                result.push(row);
            }
            else {
                var row$1 = images.slice(start, end);
                result.push(row$1);
            }
        }
        return result;
    };
    ImageList.prototype.imagesView = function imagesView (images) {
        if (images.length === 0)
            { return null; }
        var ref = this.props;
        var addSelectedImageId = ref.addSelectedImageId;
        var removeSelectedImageId = ref.removeSelectedImageId;
        var canEdit = ref.canEdit;
        var imageIsSelected = ref.imageIsSelected;
        var username = ref.username;
        var result = this.arrangeArray(images);
        var view = result.map(function (row, i) {
            var imgs = row.map(function (img) {
                return React.createElement(reactBootstrap.Col, { lg: 3, key: img.ImageID },
                    React.createElement(Image$1, { image: img, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: imageIsSelected, username: username }));
            });
            var rowId = "rowId" + i;
            return React.createElement(reactBootstrap.Row, { key: rowId }, imgs);
        });
        return view;
    };
    ImageList.prototype.render = function render () {
        var ref = this.props;
        var images = ref.images;
        return React.createElement(reactBootstrap.Row, null, this.imagesView(images));
    };

    return ImageList;
}(React.Component));

var mapStateToProps$7 = function (state) {
    var ref = state.imagesInfo;
    var ownerId = ref.ownerId;
    var currentId = state.usersInfo.currentUserId;
    var canEdit = (ownerId > 0 && currentId > 0 && ownerId === currentId);
    var user = state.usersInfo.users[ownerId];
    var fullName = user ? ((user.FirstName) + " " + (user.LastName)) : "";
    var images = underscore.values(state.imagesInfo.images).reverse();
    return {
        images: images,
        canEdit: canEdit,
        selectedImageIds: state.imagesInfo.selectedImageIds,
        fullName: fullName,
    };
};
var mapDispatchToProps$8 = function (dispatch) {
    return {
        uploadImage: function (username, description, formData) {
            dispatch(uploadImage(username, description, formData, function () { dispatch(fetchUserImages(username)); }, function () { }));
        },
        addSelectedImageId: function (id) {
            dispatch(addSelectedImageId(id));
        },
        removeSelectedImageId: function (id) {
            dispatch(removeSelectedImageId(id));
        },
        deleteImages: function (username, ids) {
            dispatch(deleteImages(username, ids));
        },
        clearSelectedImageIds: function () {
            dispatch(clearSelectedImageIds());
        }
    };
};
var UserImagesContainer = (function (superclass) {
    function UserImagesContainer(props) {
        superclass.call(this, props);
        this.imageIsSelected = this.imageIsSelected.bind(this);
        this.deleteSelectedImages = this.deleteSelectedImages.bind(this);
        this.clearSelected = this.clearSelected.bind(this);
    }

    if ( superclass ) UserImagesContainer.__proto__ = superclass;
    UserImagesContainer.prototype = Object.create( superclass && superclass.prototype );
    UserImagesContainer.prototype.constructor = UserImagesContainer;
    UserImagesContainer.prototype.componentDidMount = function componentDidMount () {
        var ref = this.props.params;
        var username = ref.username;
        var ref$1 = this.props;
        var router = ref$1.router;
        var route = ref$1.route;
        document.title = username + "'s billeder";
        router.setRouteLeaveHook(route, this.clearSelected);
    };
    UserImagesContainer.prototype.clearSelected = function clearSelected () {
        var ref = this.props;
        var clearSelectedImageIds = ref.clearSelectedImageIds;
        clearSelectedImageIds();
        return true;
    };
    UserImagesContainer.prototype.imageIsSelected = function imageIsSelected (checkId) {
        var ref = this.props;
        var selectedImageIds = ref.selectedImageIds;
        var res = underscore.find(selectedImageIds, function (id) {
            return id === checkId;
        });
        return res ? true : false;
    };
    UserImagesContainer.prototype.deleteSelectedImages = function deleteSelectedImages () {
        var ref = this.props;
        var selectedImageIds = ref.selectedImageIds;
        var deleteImages = ref.deleteImages;
        var ref$1 = this.props.params;
        var username = ref$1.username;
        deleteImages(username, selectedImageIds);
        this.clearSelected();
    };
    UserImagesContainer.prototype.uploadView = function uploadView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var uploadImage = ref.uploadImage;
        var selectedImageIds = ref.selectedImageIds;
        var ref$1 = this.props.params;
        var username = ref$1.username;
        var hasImages = selectedImageIds.length > 0;
        if (!canEdit)
            { return null; }
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Col, { lg: 7 },
                React.createElement(ImageUpload, { uploadImage: uploadImage, username: username },
                    "\u00A0",
                    React.createElement(reactBootstrap.Button, { bsStyle: "danger", disabled: !hasImages, onClick: this.deleteSelectedImages }, "Slet markeret billeder"))));
    };
    UserImagesContainer.prototype.uploadLimitView = function uploadLimitView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        if (!canEdit)
            { return null; }
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Col, { lgOffset: 2, lg: 2 },
                React.createElement("br", null),
                React.createElement(UsedSpace, null)));
    };
    UserImagesContainer.prototype.render = function render () {
        var ref = this.props.params;
        var username = ref.username;
        var ref$1 = this.props;
        var images = ref$1.images;
        var fullName = ref$1.fullName;
        var canEdit = ref$1.canEdit;
        var addSelectedImageId = ref$1.addSelectedImageId;
        var removeSelectedImageId = ref$1.removeSelectedImageId;
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactBootstrap.Col, { lgOffset: 2, lg: 8 },
                    React.createElement(Breadcrumb, null,
                        React.createElement(Breadcrumb.Item, { href: "/" }, "Forside"),
                        React.createElement(Breadcrumb.Item, { active: true },
                            username,
                            "'s billeder")))),
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactBootstrap.Col, { lgOffset: 2, lg: 8 },
                    React.createElement("h1", null,
                        React.createElement("span", { className: "text-capitalize" }, fullName),
                        "'s ",
                        React.createElement("small", null, "billede galleri")),
                    React.createElement("hr", null),
                    React.createElement(ImageList, { images: images, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: this.imageIsSelected, username: username }),
                    this.uploadView())),
            this.uploadLimitView(),
            this.props.children);
    };

    return UserImagesContainer;
}(React.Component));
var UserImagesRedux = reactRedux.connect(mapStateToProps$7, mapDispatchToProps$8)(UserImagesContainer);
var UserImages = reactRouter.withRouter(UserImagesRedux);

var mapStateToProps$8 = function (state) {
    var ownerId = state.imagesInfo.ownerId;
    var currentId = state.usersInfo.currentUserId;
    var canEdit = (ownerId > 0 && currentId > 0 && ownerId === currentId);
    var getImage = function (id) { return state.imagesInfo.images[id]; };
    var image = function () { return getImage(state.imagesInfo.selectedImageId); };
    var filename = function () { if (image())
        { return image().Filename; } return ""; };
    var previewUrl = function () { if (image())
        { return image().PreviewUrl; } return ""; };
    var extension = function () { if (image())
        { return image().Extension; } return ""; };
    var originalUrl = function () { if (image())
        { return image().OriginalUrl; } return ""; };
    var uploaded = function () { if (image())
        { return image().Uploaded; } return new Date(); };
    var description = function () { if (image())
        { return image().Description; } return ""; };
    return {
        canEdit: canEdit,
        hasImage: function () { return Boolean(getImage(state.imagesInfo.selectedImageId)); },
        filename: filename(),
        previewUrl: previewUrl(),
        extension: extension(),
        originalUrl: originalUrl(),
        uploaded: uploaded(),
        description: description()
    };
};
var mapDispatchToProps$9 = function (dispatch) {
    return {
        setSelectedImageId: function (id) {
            dispatch(setSelectedImg(id));
        },
        deselectImage: function () {
            dispatch(setSelectedImg(undefined));
        },
        setError: function (error) {
            dispatch(setError(error));
        },
        fetchImage: function (id) {
            dispatch(fetchSingleImage(id));
        },
        deleteImage: function (id, username) {
            dispatch(deleteImage(id, username));
        },
        resetComments: function () {
            dispatch(setSkipComments(0));
            dispatch(setTakeComments(10));
            dispatch(setFocusedComment(-1));
            dispatch(receivedComments([]));
        }
    };
};
var ModalImage = (function (superclass) {
    function ModalImage(props) {
        superclass.call(this, props);
        this.deleteImageHandler = this.deleteImageHandler.bind(this);
        this.close = this.close.bind(this);
        this.seeAllCommentsView = this.seeAllCommentsView.bind(this);
        this.reload = this.reload.bind(this);
    }

    if ( superclass ) ModalImage.__proto__ = superclass;
    ModalImage.prototype = Object.create( superclass && superclass.prototype );
    ModalImage.prototype.constructor = ModalImage;
    ModalImage.prototype.close = function close () {
        var ref = this.props;
        var deselectImage = ref.deselectImage;
        var resetComments = ref.resetComments;
        var ref$1 = this.props.params;
        var username = ref$1.username;
        var ref$2 = this.props.router;
        var push = ref$2.push;
        deselectImage();
        var galleryUrl = "/" + username + "/gallery";
        resetComments();
        push(galleryUrl);
    };
    ModalImage.prototype.deleteImageHandler = function deleteImageHandler () {
        var ref = this.props;
        var deleteImage = ref.deleteImage;
        var setSelectedImageId = ref.setSelectedImageId;
        var ref$1 = this.props.params;
        var id = ref$1.id;
        var username = ref$1.username;
        deleteImage(Number(id), username);
        setSelectedImageId(-1);
    };
    ModalImage.prototype.deleteImageView = function deleteImageView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        if (!canEdit)
            { return null; }
        return React.createElement(reactBootstrap.Button, { bsStyle: "danger", onClick: this.deleteImageHandler }, "Slet billede");
    };
    ModalImage.prototype.reload = function reload () {
        var ref = this.props.params;
        var id = ref.id;
        var username = ref.username;
        var ref$1 = this.props.router;
        var push = ref$1.push;
        var path = "/" + username + "/gallery/image/" + id + "/comments";
        push(path);
    };
    ModalImage.prototype.seeAllCommentsView = function seeAllCommentsView () {
        var show = !Boolean(this.props.children);
        if (!show)
            { return null; }
        return React.createElement("p", { className: "text-center" },
            React.createElement(reactBootstrap.Button, { onClick: this.reload },
                React.createElement(reactBootstrap.Glyphicon, { glyph: "refresh" }),
                " Se alle kommentarer?"));
    };
    ModalImage.prototype.render = function render () {
        var ref = this.props;
        var filename = ref.filename;
        var previewUrl = ref.previewUrl;
        var extension = ref.extension;
        var originalUrl = ref.originalUrl;
        var uploaded = ref.uploaded;
        var hasImage = ref.hasImage;
        var description = ref.description;
        var show = hasImage();
        var name = filename + "." + extension;
        var uploadDate = moment(uploaded);
        var dateString = "Uploaded d. " + uploadDate.format("D MMM YYYY ") + "kl. " + uploadDate.format("H:mm");
        return React.createElement(reactBootstrap.Modal, { show: show, onHide: this.close, bsSize: "large", animation: true },
            React.createElement(reactBootstrap.Modal.Header, { closeButton: true },
                React.createElement(reactBootstrap.Modal.Title, null,
                    name,
                    React.createElement("span", null,
                        React.createElement("small", null,
                            " - ",
                            dateString)))),
            React.createElement(reactBootstrap.Modal.Body, null,
                React.createElement("a", { href: originalUrl, target: "_blank", rel: "noopener" },
                    React.createElement(reactBootstrap.Image, { src: previewUrl, responsive: true, className: "center-block" })),
                React.createElement("div", { className: "image-selected-descriptiontext" }, description)),
            React.createElement(reactBootstrap.Modal.Footer, null,
                this.seeAllCommentsView(),
                this.props.children,
                React.createElement("hr", null),
                React.createElement(reactBootstrap.ButtonToolbar, { style: { float: "right" } },
                    this.deleteImageView(),
                    React.createElement(reactBootstrap.Button, { onClick: this.close }, "Luk"))));
    };

    return ModalImage;
}(React.Component));
var SelectedImageRedux = reactRedux.connect(mapStateToProps$8, mapDispatchToProps$9)(ModalImage);
var SelectedImage = reactRouter.withRouter(SelectedImageRedux);

var __assign$5 = (undefined && undefined.__assign) || Object.assign || function(t) {
    var arguments$1 = arguments;

    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments$1[i];
        for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p))
            { t[p] = s[p]; } }
    }
    return t;
};
var mapStateToProps$9 = function (state) {
    return {
        canEdit: function (id) { return state.usersInfo.currentUserId === id; },
        imageId: state.imagesInfo.selectedImageId,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        page: state.commentsInfo.page,
        totalPages: state.commentsInfo.totalPages,
        comments: state.commentsInfo.comments,
        getName: function (userId) {
            var user = state.usersInfo.users[userId];
            var FirstName = user.FirstName;
            var LastName = user.LastName;
            return (FirstName + " " + LastName);
        },
        owner: state.usersInfo.users[state.imagesInfo.ownerId]
    };
};
var mapDispatchToProps$10 = function (dispatch) {
    return {
        postHandle: function (imageId, text, cb) {
            var url = globals.urls.imagecomments;
            dispatch(postComment(url, imageId, text, null, cb));
        },
        fetchComments: function (imageId, skip, take) {
            var url = getImageCommentsPageUrl(imageId, skip, take);
            dispatch(fetchComments(url, skip, take));
        },
        editHandle: function (commentId, _, text, cb) {
            var url = globals.urls.imagecomments;
            dispatch(editComment(url, commentId, text, cb));
        },
        deleteHandle: function (commentId, cb) {
            var url = getImageCommentsDeleteUrl(commentId);
            dispatch(deleteComment(url, cb));
        },
        replyHandle: function (imageId, text, parentId, cb) {
            var url = globals.urls.imagecomments;
            dispatch(postComment(url, imageId, text, parentId, cb));
        },
        incrementCount: function (imageId) { return dispatch(incrementCommentCount(imageId)); },
        decrementCount: function (imageId) { return dispatch(decrementCommentCount(imageId)); },
        loadComments: function (imageId, skip, take) {
            var url = getImageCommentsPageUrl(imageId, skip, take);
            dispatch(fetchComments(url, skip, take));
        }
    };
};
var CommentsContainer = (function (superclass) {
    function CommentsContainer(props) {
        superclass.call(this, props);
        this.pageHandle = this.pageHandle.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.editComment = this.editComment.bind(this);
        this.replyComment = this.replyComment.bind(this);
        this.postComment = this.postComment.bind(this);
    }

    if ( superclass ) CommentsContainer.__proto__ = superclass;
    CommentsContainer.prototype = Object.create( superclass && superclass.prototype );
    CommentsContainer.prototype.constructor = CommentsContainer;
    CommentsContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
        var ref = this.props;
        var fetchComments = ref.fetchComments;
        var imageId = ref.imageId;
        var take = ref.take;
        var ref$1 = nextProps.location.query;
        var page = ref$1.page;
        if (!Number(page))
            { return; }
        var skipPages = page - 1;
        var skipItems = (skipPages * take);
        fetchComments(imageId, skipItems, take);
    };
    CommentsContainer.prototype.pageHandle = function pageHandle (to) {
        var ref = this.props;
        var owner = ref.owner;
        var imageId = ref.imageId;
        var page = ref.page;
        var ref$1 = this.props.router;
        var push = ref$1.push;
        var username = owner.Username;
        if (page === to)
            { return; }
        var url = "/" + username + "/gallery/image/" + imageId + "/comments?page=" + to;
        push(url);
    };
    CommentsContainer.prototype.deleteComment = function deleteComment$1 (commentId, imageId) {
        var ref = this.props;
        var deleteHandle = ref.deleteHandle;
        var loadComments = ref.loadComments;
        var decrementCount = ref.decrementCount;
        var skip = ref.skip;
        var take = ref.take;
        var cb = function () {
            decrementCount(imageId);
            loadComments(imageId, skip, take);
        };
        deleteHandle(commentId, cb);
    };
    CommentsContainer.prototype.editComment = function editComment$1 (commentId, imageId, text) {
        var ref = this.props;
        var loadComments = ref.loadComments;
        var skip = ref.skip;
        var take = ref.take;
        var editHandle = ref.editHandle;
        var cb = function () { return loadComments(imageId, skip, take); };
        editHandle(commentId, imageId, text, cb);
    };
    CommentsContainer.prototype.replyComment = function replyComment (imageId, text, parentId) {
        var ref = this.props;
        var loadComments = ref.loadComments;
        var incrementCount = ref.incrementCount;
        var skip = ref.skip;
        var take = ref.take;
        var replyHandle = ref.replyHandle;
        var cb = function () {
            incrementCount(imageId);
            loadComments(imageId, skip, take);
        };
        replyHandle(imageId, text, parentId, cb);
    };
    CommentsContainer.prototype.postComment = function postComment$1 (text) {
        var ref = this.props;
        var imageId = ref.imageId;
        var loadComments = ref.loadComments;
        var incrementCount = ref.incrementCount;
        var skip = ref.skip;
        var take = ref.take;
        var postHandle = ref.postHandle;
        var cb = function () {
            incrementCount(imageId);
            loadComments(imageId, skip, take);
        };
        postHandle(imageId, text, cb);
    };
    CommentsContainer.prototype.render = function render () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var comments = ref.comments;
        var getName = ref.getName;
        var imageId = ref.imageId;
        var page = ref.page;
        var totalPages = ref.totalPages;
        var ref$1 = this.props;
        var skip = ref$1.skip;
        var take = ref$1.take;
        var controls = {
            skip: skip,
            take: take,
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        };
        return React.createElement("div", { className: "text-left" },
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactBootstrap.Col, { lgOffset: 1, lg: 11 },
                    React.createElement(CommentList, __assign$5({ contextId: imageId, comments: comments, getName: getName, canEdit: canEdit }, controls)))),
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactBootstrap.Col, { lgOffset: 1, lg: 10 },
                    React.createElement(Pagination$1, { totalPages: totalPages, page: page, pageHandle: this.pageHandle }))),
            React.createElement("hr", null),
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactBootstrap.Col, { lgOffset: 1, lg: 10 },
                    React.createElement(CommentForm, { postHandle: this.postComment }))));
    };

    return CommentsContainer;
}(React.Component));
var CommentsRedux = reactRedux.connect(mapStateToProps$9, mapDispatchToProps$10)(CommentsContainer);
var ImageComments = reactRouter.withRouter(CommentsRedux);

var __assign$6 = (undefined && undefined.__assign) || Object.assign || function(t) {
    var arguments$1 = arguments;

    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments$1[i];
        for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p))
            { t[p] = s[p]; } }
    }
    return t;
};
var mapStateToProps$10 = function (state) {
    var ref = state.commentsInfo;
    var comments = ref.comments;
    var focusedComment = ref.focusedComment;
    var ref$1 = state.usersInfo;
    var users = ref$1.users;
    var ref$2 = state.imagesInfo;
    var ownerId = ref$2.ownerId;
    var selectedImageId = ref$2.selectedImageId;
    return {
        getName: function (id) {
            var author = users[id];
            return ((author.FirstName) + " " + (author.LastName));
        },
        focusedId: focusedComment,
        focused: comments[0],
        imageId: selectedImageId,
        imageOwner: users[ownerId].Username,
        canEdit: function (id) { return state.usersInfo.currentUserId === id; },
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
    };
};
var mapDispatchToProps$11 = function (dispatch) {
    return {
        editHandle: function (commentId, _, text, cb) {
            var url = globals.urls.imagecomments;
            dispatch(editComment(url, commentId, text, cb));
        },
        deleteHandle: function (commentId, cb) {
            var url = getImageCommentsDeleteUrl(commentId);
            dispatch(deleteComment(url, cb));
        },
        replyHandle: function (imageId, text, parentId, cb) {
            var url = globals.urls.imagecomments;
            dispatch(postComment(url, imageId, text, parentId, cb));
        },
        focusComment: function (id) { return dispatch(fetchAndFocusSingleComment(id)); }
    };
};
var SingleCommentRedux = (function (superclass) {
    function SingleCommentRedux(props) {
        superclass.call(this, props);
        this.allComments = this.allComments.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.editComment = this.editComment.bind(this);
        this.replyComment = this.replyComment.bind(this);
    }

    if ( superclass ) SingleCommentRedux.__proto__ = superclass;
    SingleCommentRedux.prototype = Object.create( superclass && superclass.prototype );
    SingleCommentRedux.prototype.constructor = SingleCommentRedux;
    SingleCommentRedux.prototype.allComments = function allComments () {
        var ref = this.props;
        var imageId = ref.imageId;
        var imageOwner = ref.imageOwner;
        var ref$1 = this.props.router;
        var push = ref$1.push;
        var path = "/" + imageOwner + "/gallery/image/" + imageId + "/comments";
        push(path);
    };
    SingleCommentRedux.prototype.deleteComment = function deleteComment$1 (commentId, _) {
        var ref = this.props;
        var deleteHandle = ref.deleteHandle;
        deleteHandle(commentId, this.allComments);
    };
    SingleCommentRedux.prototype.editComment = function editComment$1 (commentId, contextId, text) {
        var ref = this.props;
        var editHandle = ref.editHandle;
        var focusComment = ref.focusComment;
        var cb = function () { return focusComment(commentId); };
        editHandle(commentId, contextId, text, cb);
    };
    SingleCommentRedux.prototype.replyComment = function replyComment (contextId, text, parentId) {
        var ref = this.props;
        var replyHandle = ref.replyHandle;
        replyHandle(contextId, text, parentId, this.allComments);
    };
    SingleCommentRedux.prototype.render = function render () {
        var ref = this.props;
        var focusedId = ref.focusedId;
        if (focusedId < 0)
            { return null; }
        var ref$1 = this.props.focused;
        var Text = ref$1.Text;
        var AuthorID = ref$1.AuthorID;
        var CommentID = ref$1.CommentID;
        var PostedOn = ref$1.PostedOn;
        var Edited = ref$1.Edited;
        var ref$2 = this.props;
        var canEdit = ref$2.canEdit;
        var imageId = ref$2.imageId;
        var ref$3 = this.props;
        var skip = ref$3.skip;
        var take = ref$3.take;
        var props = {
            skip: skip,
            take: take,
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        };
        var name = this.props.getName(AuthorID);
        return React.createElement("div", { className: "text-left" },
            React.createElement(reactBootstrap.Well, null,
                React.createElement(Comment, __assign$6({ contextId: imageId, name: name, text: Text, commentId: CommentID, replies: [], canEdit: canEdit, authorId: AuthorID, postedOn: PostedOn, edited: Edited }, props))),
            React.createElement("div", null,
                React.createElement("p", { className: "text-center" },
                    React.createElement(reactBootstrap.Button, { onClick: this.allComments },
                        React.createElement(reactBootstrap.Glyphicon, { glyph: "refresh" }),
                        " Se alle kommentarer?"))));
    };

    return SingleCommentRedux;
}(React.Component));
var SingleCommentConnect = reactRedux.connect(mapStateToProps$10, mapDispatchToProps$11)(SingleCommentRedux);
var SingleImageComment = reactRouter.withRouter(SingleCommentConnect);

var About = (function (superclass) {
    function About () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) About.__proto__ = superclass;
    About.prototype = Object.create( superclass && superclass.prototype );
    About.prototype.constructor = About;

    About.prototype.componentDidMount = function componentDidMount () {
        document.title = "Om";
    };
    About.prototype.render = function render () {
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Row, null,
                React.createElement(reactBootstrap.Col, { lgOffset: 2, lg: 8 },
                    React.createElement(Breadcrumb, null,
                        React.createElement(Breadcrumb.Item, { href: "/" }, "Forside"),
                        React.createElement(Breadcrumb.Item, { active: true }, "Om")))),
            React.createElement(reactBootstrap.Col, { lgOffset: 2, lg: 8 },
                React.createElement("p", null,
                    "Dette er en single page application!",
                    React.createElement("br", null),
                    "Teknologier brugt:"),
                React.createElement("ul", null,
                    React.createElement("li", null, "React"),
                    React.createElement("li", null, "Redux"),
                    React.createElement("li", null, "React-Bootstrap"),
                    React.createElement("li", null, "ReactRouter"),
                    React.createElement("li", null, "Asp.net Core RC 2"),
                    React.createElement("li", null, "Asp.net Web API 2"))));
    };

    return About;
}(React.Component));

var users = function (state, action) {
    if ( state === void 0 ) state = {};

    switch (action.type) {
        case 22:
            {
                return action.payload;
            }
        default:
            return state;
    }
};
var currentUserId = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case 20:
            return action.payload;
        default:
            return state;
    }
};
var usersInfo = redux.combineReducers({
    currentUserId: currentUserId,
    users: users
});

var ownerId = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case 10:
            {
                return action.payload || -1;
            }
        default:
            {
                return state;
            }
    }
};
var images = function (state, action) {
    if ( state === void 0 ) state = {};

    switch (action.type) {
        case 13:
            {
                var image = action.payload;
                return put(state, image.ImageID, image);
            }
        case 11:
            {
                return action.payload;
            }
        case 14:
            {
                var id = action.payload.ImageID;
                var removed = underscore.omit(state, id.toString());
                return removed;
            }
        case 18:
            {
                var id$1 = action.payload.ImageID;
                var image$1 = state[id$1];
                image$1.CommentCount++;
                var result = put(state, id$1, image$1);
                return result;
            }
        case 19:
            {
                var id$2 = action.payload.ImageID;
                var image$2 = state[id$2];
                image$2.CommentCount--;
                var result$1 = put(state, id$2, image$2);
                return result$1;
            }
        default:
            {
                return state;
            }
    }
};
var selectedImageId = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case 12:
            {
                return action.payload || -1;
            }
        default:
            {
                return state;
            }
    }
};
var selectedImageIds = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case 15:
            {
                var id = action.payload;
                return union(state, [id], function (id1, id2) { return id1 === id2; });
            }
        case 16:
            {
                return underscore.filter(state, function (id) { return id !== action.payload; });
            }
        case 17:
            {
                return [];
            }
        default:
            {
                return state;
            }
    }
};
var imagesInfo = redux.combineReducers({
    ownerId: ownerId,
    images: images,
    selectedImageId: selectedImageId,
    selectedImageIds: selectedImageIds
});

var comments = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case 41:
            return action.payload || [];
        case 42:
            return state.concat( [action.payload[0]]);
        default:
            return state;
    }
};
var skip = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case 34:
            return action.payload || 0;
        default:
            return state;
    }
};
var take = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case 37:
            return action.payload || 10;
        default:
            return state;
    }
};
var page = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case 38:
            return action.payload || 1;
        default:
            return state;
    }
};
var totalPages = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case 39:
            return action.payload || 0;
        default:
            return state;
    }
};
var focusedComment = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case 43:
            return action.payload || -1;
        default:
            return state;
    }
};
var commentsInfo = redux.combineReducers({
    comments: comments,
    skip: skip,
    take: take,
    page: page,
    totalPages: totalPages,
    focusedComment: focusedComment
});

var skipThreads = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case 28:
            return action.payload;
        default:
            return state;
    }
};
var takeThreads = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case 29:
            return action.payload;
        default:
            return state;
    }
};
var pageThreads = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case 27:
            return action.payload;
        default:
            return state;
    }
};
var totalPagesThread = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case 26:
            return action.payload;
        default:
            return state;
    }
};
var selectedThread = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case 30:
            return action.payload;
        default:
            return state;
    }
};
var titles = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case 24:
            return union(action.payload, state, function (t1, t2) { return t1.ID === t2.ID; });
        case 25:
            return action.payload;
        default:
            return state;
    }
};
var postContent = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        case 31:
            return action.payload;
        default:
            return state;
    }
};
var titlesInfo = redux.combineReducers({
    titles: titles,
    skip: skipThreads,
    take: takeThreads,
    page: pageThreads,
    totalPages: totalPagesThread,
    selectedThread: selectedThread
});
var forumInfo = redux.combineReducers({
    titlesInfo: titlesInfo,
    postContent: postContent
});

var title = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        case 1:
            return action.payload || "";
        default:
            return state;
    }
};
var message$1 = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        case 3:
            return action.payload || "";
        default:
            return state;
    }
};
var errorInfo = redux.combineReducers({
    title: title,
    message: message$1
});

var hasError = function (state, action) {
    if ( state === void 0 ) state = false;

    switch (action.type) {
        case 0:
            return action.payload;
        default:
            return state;
    }
};
var message = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        default:
            return state;
    }
};
var done = function (state, action) {
    if ( state === void 0 ) state = true;

    switch (action.type) {
        default:
            return state;
    }
};
var usedSpacekB = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case 32:
            return action.payload;
        default:
            return state;
    }
};
var totalSpacekB = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case 33:
            return action.payload;
        default:
            return state;
    }
};
var spaceInfo = redux.combineReducers({
    usedSpacekB: usedSpacekB,
    totalSpacekB: totalSpacekB
});
var statusInfo = redux.combineReducers({
    hasError: hasError,
    errorInfo: errorInfo,
    spaceInfo: spaceInfo,
    message: message,
    done: done
});

var skip$1 = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case 6:
            return action.payload || 0;
        default:
            return state;
    }
};
var take$1 = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case 7:
            return action.payload || 10;
        default:
            return state;
    }
};
var page$1 = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case 8:
            return action.payload || 1;
        default:
            return state;
    }
};
var totalPages$1 = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case 9:
            return action.payload || 0;
        default:
            return state;
    }
};
var items = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case 5:
            return action.payload || [];
        default:
            return state;
    }
};
var whatsNewInfo = redux.combineReducers({
    skip: skip$1,
    take: take$1,
    page: page$1,
    totalPages: totalPages$1,
    items: items
});

var rootReducer = redux.combineReducers({
    usersInfo: usersInfo,
    imagesInfo: imagesInfo,
    commentsInfo: commentsInfo,
    forumInfo: forumInfo,
    statusInfo: statusInfo,
    whatsNewInfo: whatsNewInfo
});

var store = redux.createStore(rootReducer, redux.applyMiddleware(thunk));

var init = function () {
    es6ObjectAssign.polyfill();
    es6Promise.polyfill();
    store.dispatch(fetchCurrentUser(globals.currentUsername));
    store.dispatch(fetchUsers());
    moment.locale("da");
};
var fetchWhatsNew = function () {
    var getLatest = function (skip, take) { return store.dispatch(fetchLatestNews(skip, take)); };
    var ref = store.getState().whatsNewInfo;
    var skip = ref.skip;
    var take = ref.take;
    getLatest(skip, take);
};
var fetchForum = function (_) {
    var ref = store.getState().forumInfo.titlesInfo;
    var skip = ref.skip;
    var take = ref.take;
    store.dispatch(fetchThreads(skip, take));
};
var fetchSinglePost = function (nextState) {
    var ref = nextState.params;
    var id = ref.id;
    store.dispatch(fetchPost(Number(id)));
};
var selectImage = function (nextState) {
    var imageId = Number(nextState.params.id);
    store.dispatch(setSelectedImg(imageId));
};
var fetchImages = function (nextState) {
    var username = nextState.params.username;
    store.dispatch(setImageOwner(username));
    store.dispatch(fetchUserImages(username));
    store.dispatch(setSkipComments(undefined));
    store.dispatch(setTakeComments(undefined));
};
var loadComments = function (nextState) {
    var ref = nextState.params;
    var id = ref.id;
    var page = Number(nextState.location.query.page);
    var ref$1 = store.getState().commentsInfo;
    var skip = ref$1.skip;
    var take = ref$1.take;
    var url = getImageCommentsPageUrl(Number(id), skip, take);
    if (!page) {
        store.dispatch(fetchComments(url, skip, take));
    }
    else {
        var skipPages = page - 1;
        var skipItems = (skipPages * take);
        store.dispatch(fetchComments(url, skipItems, take));
    }
};
var fetchComment = function (nextState) {
    var id = Number(nextState.location.query.id);
    store.dispatch(fetchAndFocusSingleComment(id));
};
var fetchPostComments = function (nextState) {
    var ref = nextState.params;
    var id = ref.id;
    var ref$1 = store.getState().commentsInfo;
    var skip = ref$1.skip;
    var take = ref$1.take;
    var url = getForumCommentsPageUrl(Number(id), skip, take);
    store.dispatch(fetchComments(url, skip, take));
};

init();
ReactDOM.render(React.createElement(reactRedux.Provider, { store: store },
    React.createElement(reactRouter.Router, { history: reactRouter.browserHistory },
        React.createElement(reactRouter.Route, { path: "/", component: Main },
            React.createElement(reactRouter.IndexRoute, { component: Home, onEnter: fetchWhatsNew }),
            React.createElement(reactRouter.Route, { path: "forum", component: Forum },
                React.createElement(reactRouter.IndexRoute, { component: ForumList, onEnter: fetchForum }),
                React.createElement(reactRouter.Route, { path: "post/:id", component: ForumPost, onEnter: fetchSinglePost },
                    React.createElement(reactRouter.Route, { path: "comments", component: ForumComments, onEnter: fetchPostComments }))),
            React.createElement(reactRouter.Route, { path: "users", component: Users }),
            React.createElement(reactRouter.Route, { path: ":username/gallery", component: UserImages, onEnter: fetchImages },
                React.createElement(reactRouter.Route, { path: "image/:id", component: SelectedImage, onEnter: selectImage },
                    React.createElement(reactRouter.Route, { path: "comments", component: ImageComments, onEnter: loadComments }),
                    React.createElement(reactRouter.Route, { path: "comment", component: SingleImageComment, onEnter: fetchComment }))),
            React.createElement(reactRouter.Route, { path: "about", component: About })))), document.getElementById("content"));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9jb250YWluZXJzL0Vycm9yLmpzIiwiLi4vdHMvZGlzdC9hY3Rpb25zL2Vycm9yLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3dyYXBwZXJzL0xpbmtzLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3NoZWxscy9NYWluLmpzIiwiLi4vdHMvZGlzdC91dGlsaXRpZXMvdXRpbHMuanMiLCIuLi90cy9kaXN0L3V0aWxpdGllcy9ub3JtYWxpemUuanMiLCIuLi90cy9kaXN0L2FjdGlvbnMvdXNlcnMuanMiLCIuLi90cy9kaXN0L2FjdGlvbnMvd2hhdHNuZXcuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvaW1hZ2VzL0ltYWdlVXBsb2FkLmpzIiwiLi4vdHMvZGlzdC9hY3Rpb25zL2ltYWdlcy5qcyIsIi4uL3RzL2Rpc3QvYWN0aW9ucy9zdGF0dXMuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9Vc2VkU3BhY2UuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdUb29sdGlwLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3SXRlbUltYWdlLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdGb3J1bVBvc3QuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdMaXN0LmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2ZvcnVtL0ZvcnVtRm9ybS5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50Q29udHJvbHMuanMiLCIuLi90cy9kaXN0L2FjdGlvbnMvZm9ydW0uanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bVBvc3QuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvcGFnaW5hdGlvbi9QYWdpbmF0aW9uLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvV2hhdHNOZXcuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9Ib21lLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3NoZWxscy9Gb3J1bS5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9mb3J1bS9Gb3J1bVRpdGxlLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1MaXN0LmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnREZWxldGVkLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnQuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudExpc3QuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudEZvcm0uanMiLCIuLi90cy9kaXN0L2FjdGlvbnMvY29tbWVudHMuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bUNvbW1lbnRzLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3VzZXJzL1VzZXIuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvdXNlcnMvVXNlckxpc3QuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvYnJlYWRjcnVtYnMvQnJlYWRjcnVtYi5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJzLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VMaXN0LmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlckltYWdlcy5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9JbWFnZUNvbW1lbnRzLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvU2luZ2xlSW1hZ2VDb21tZW50LmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCIuLi90cy9kaXN0L3JlZHVjZXJzL3VzZXJzSW5mby5qcyIsIi4uL3RzL2Rpc3QvcmVkdWNlcnMvaW1hZ2VzSW5mby5qcyIsIi4uL3RzL2Rpc3QvcmVkdWNlcnMvY29tbWVudHNJbmZvLmpzIiwiLi4vdHMvZGlzdC9yZWR1Y2Vycy9mb3J1bUluZm8uanMiLCIuLi90cy9kaXN0L3JlZHVjZXJzL2Vycm9ySW5mby5qcyIsIi4uL3RzL2Rpc3QvcmVkdWNlcnMvc3RhdHVzSW5mby5qcyIsIi4uL3RzL2Rpc3QvcmVkdWNlcnMvd2hhdHNOZXdJbmZvLmpzIiwiLi4vdHMvZGlzdC9yZWR1Y2Vycy9yb290LmpzIiwiLi4vdHMvZGlzdC9zdG9yZS9zdG9yZS5qcyIsIi4uL3RzL2Rpc3QvdXRpbGl0aWVzL29uc3RhcnR1cC5qcyIsIi4uL3RzL2Rpc3QvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQWxlcnQgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBFcnJvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjbGVhckVycm9yLCB0aXRsZSwgbWVzc2FnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBbGVydCwgeyBic1N0eWxlOiBcImRhbmdlclwiLCBvbkRpc21pc3M6IGNsZWFyRXJyb3IgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIHRpdGxlKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBtZXNzYWdlKSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY29uc3Qgc2V0SGFzRXJyb3IgPSAoaGFzRXJyb3IpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMCxcclxuICAgICAgICBwYXlsb2FkOiBoYXNFcnJvclxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEVycm9yVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMSxcclxuICAgICAgICBwYXlsb2FkOiB0aXRsZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3JUaXRsZSA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMlxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3JNZXNzYWdlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA0XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RXJyb3JNZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMyxcclxuICAgICAgICBwYXlsb2FkOiBtZXNzYWdlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChzZXRIYXNFcnJvcih0cnVlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JUaXRsZShlcnJvci50aXRsZSkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEVycm9yTWVzc2FnZShlcnJvci5tZXNzYWdlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3IgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvclRpdGxlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKGNsZWFyRXJyb3JNZXNzYWdlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKGZhbHNlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuZXhwb3J0IGNsYXNzIE5hdkxpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IHRoaXMuY29udGV4dC5yb3V0ZXIuaXNBY3RpdmUodGhpcy5wcm9wcy50bywgdHJ1ZSksIGNsYXNzTmFtZSA9IGlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IHRoaXMucHJvcHMudG8gfSwgdGhpcy5wcm9wcy5jaGlsZHJlbikpKTtcclxuICAgIH1cclxufVxyXG5OYXZMaW5rLmNvbnRleHRUeXBlcyA9IHtcclxuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxyXG59O1xyXG5leHBvcnQgY2xhc3MgSW5kZXhOYXZMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQgaXNBY3RpdmUgPSB0aGlzLmNvbnRleHQucm91dGVyLmlzQWN0aXZlKHRoaXMucHJvcHMudG8sIHRydWUpLCBjbGFzc05hbWUgPSBpc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcIlwiO1xyXG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbmRleExpbmssIHsgdG86IHRoaXMucHJvcHMudG8gfSwgdGhpcy5wcm9wcy5jaGlsZHJlbikpKTtcclxuICAgIH1cclxufVxyXG5JbmRleE5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IEdyaWQsIE5hdmJhciwgTmF2LCBOYXZEcm9wZG93biwgTWVudUl0ZW0gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IEVycm9yIH0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvRXJyb3JcIjtcclxuaW1wb3J0IHsgY2xlYXJFcnJvciB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2Vycm9yXCI7XHJcbmltcG9ydCB7IE5hdkxpbmssIEluZGV4TmF2TGluayB9IGZyb20gXCIuLi93cmFwcGVycy9MaW5rc1wiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnNbc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWRdO1xyXG4gICAgY29uc3QgbmFtZSA9IHVzZXIgPyB1c2VyLkZpcnN0TmFtZSA6IFwiVXNlclwiO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2VybmFtZTogbmFtZSxcclxuICAgICAgICBoYXNFcnJvcjogc3RhdGUuc3RhdHVzSW5mby5oYXNFcnJvcixcclxuICAgICAgICBlcnJvcjogc3RhdGUuc3RhdHVzSW5mby5lcnJvckluZm9cclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjbGVhckVycm9yOiAoKSA9PiBkaXNwYXRjaChjbGVhckVycm9yKCkpXHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBTaGVsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBlcnJvclZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgY2xlYXJFcnJvciwgZXJyb3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgbWVzc2FnZSB9ID0gZXJyb3I7XHJcbiAgICAgICAgaWYgKCFoYXNFcnJvcilcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRXJyb3IsIHsgdGl0bGU6IHRpdGxlLCBtZXNzYWdlOiBtZXNzYWdlLCBjbGVhckVycm9yOiBjbGVhckVycm9yIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgZW1wbG95ZWVVcmwgPSBnbG9iYWxzLnVybHMuZW1wbG95ZWVIYW5kYm9vaztcclxuICAgICAgICBjb25zdCBjNVNlYXJjaFVybCA9IGdsb2JhbHMudXJscy5jNVNlYXJjaDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChHcmlkLCB7IGZsdWlkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLCB7IGZpeGVkVG9wOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhci5IZWFkZXIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZiYXIuQnJhbmQsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogXCJodHRwOi8vaW50cmFuZXRzaWRlXCIsIGNsYXNzTmFtZTogXCJuYXZiYXItYnJhbmRcIiB9LCBcIkludXBsYW4gSW50cmFuZXRcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLlRvZ2dsZSwgbnVsbCkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZiYXIuQ29sbGFwc2UsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5kZXhOYXZMaW5rLCB7IHRvOiBcIi9cIiB9LCBcIkZvcnNpZGVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2TGluaywgeyB0bzogXCIvZm9ydW1cIiB9LCBcIkZvcnVtXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkxpbmssIHsgdG86IFwiL3VzZXJzXCIgfSwgXCJCcnVnZXJlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkxpbmssIHsgdG86IFwiL2Fib3V0XCIgfSwgXCJPbVwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZiYXIuVGV4dCwgeyBwdWxsUmlnaHQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJIZWosIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIhXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2LCB7IHB1bGxSaWdodDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkRyb3Bkb3duLCB7IGV2ZW50S2V5OiA1LCB0aXRsZTogXCJMaW5rc1wiLCBpZDogXCJleHRlcm5fbGlua3NcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZW51SXRlbSwgeyBocmVmOiBlbXBsb3llZVVybCwgZXZlbnRLZXk6IDUuMSB9LCBcIk1lZGFyYmVqZGVyIGhcXHUwMEU1bmRib2dcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lbnVJdGVtLCB7IGhyZWY6IGM1U2VhcmNoVXJsLCBldmVudEtleTogNS4yIH0sIFwiQzUgU1xcdTAwRjhnbmluZ1wiKSkpKSksXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JWaWV3KCksXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IE1haW4gPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShTaGVsbCk7XHJcbmV4cG9ydCBkZWZhdWx0IE1haW47XHJcbiIsImltcG9ydCB7IHNldEVycm9yIH0gZnJvbSBcIi4uL2FjdGlvbnMvZXJyb3JcIjtcclxuaW1wb3J0ICogYXMgbWFya2VkIGZyb20gXCJtYXJrZWRcIjtcclxuaW1wb3J0IHJlbW92ZU1kIGZyb20gXCJyZW1vdmUtbWFya2Rvd25cIjtcclxuZXhwb3J0IGNvbnN0IG9iak1hcCA9IChhcnIsIGtleSwgdmFsKSA9PiB7XHJcbiAgICBjb25zdCBvYmogPSBhcnIucmVkdWNlKChyZXMsIGl0ZW0pID0+IHtcclxuICAgICAgICBjb25zdCBrID0ga2V5KGl0ZW0pO1xyXG4gICAgICAgIGNvbnN0IHYgPSB2YWwoaXRlbSk7XHJcbiAgICAgICAgcmVzW2tdID0gdjtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSwge30pO1xyXG4gICAgcmV0dXJuIG9iajtcclxufTtcclxuZXhwb3J0IGNvbnN0IHB1dCA9IChvYmosIGtleSwgdmFsdWUpID0+IHtcclxuICAgIGxldCBrdiA9IE9iamVjdC5hc3NpZ24oe30sIG9iaik7XHJcbiAgICBrdltrZXldID0gdmFsdWU7XHJcbiAgICByZXR1cm4ga3Y7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgbW9kZTogXCJjb3JzXCIsXHJcbiAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCJcclxufTtcclxuZXhwb3J0IGNvbnN0IHJlc3BvbnNlSGFuZGxlciA9IChkaXNwYXRjaCkgPT4gKG9uU3VjY2VzcykgPT4gKHJlc3BvbnNlKSA9PiB7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spXHJcbiAgICAgICAgcmV0dXJuIG9uU3VjY2VzcyhyZXNwb25zZSk7XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzd2l0Y2ggKHJlc3BvbnNlLnN0YXR1cykge1xyXG4gICAgICAgICAgICBjYXNlIDQwMDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKHsgdGl0bGU6IFwiNDAwIEJhZCBSZXF1ZXN0XCIsIG1lc3NhZ2U6IFwiVGhlIHJlcXVlc3Qgd2FzIG5vdCB3ZWxsLWZvcm1lZFwiIH0pKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKHsgdGl0bGU6IFwiNDA0IE5vdCBGb3VuZFwiLCBtZXNzYWdlOiBcIkNvdWxkIG5vdCBmaW5kIHJlc291cmNlXCIgfSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDA4OlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IoeyB0aXRsZTogXCI0MDggUmVxdWVzdCBUaW1lb3V0XCIsIG1lc3NhZ2U6IFwiVGhlIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgaW4gdGltZVwiIH0pKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKHsgdGl0bGU6IFwiNTAwIFNlcnZlciBFcnJvclwiLCBtZXNzYWdlOiBcIlNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggdGhlIEFQSS1zZXJ2ZXJcIiB9KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKHsgdGl0bGU6IFwiT29wc1wiLCBtZXNzYWdlOiBcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiIH0pKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5leHBvcnQgY29uc3QgdW5pb24gPSAoYXJyMSwgYXJyMiwgZXF1YWxpdHlGdW5jKSA9PiB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXJyMS5jb25jYXQoYXJyMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IHJlc3VsdC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoZXF1YWxpdHlGdW5jKHJlc3VsdFtpXSwgcmVzdWx0W2pdKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnNwbGljZShqLCAxKTtcclxuICAgICAgICAgICAgICAgIGotLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcbmV4cG9ydCBjb25zdCB0aW1lVGV4dCA9IChwb3N0ZWRPbiwgZXhwaXJlID0gMTIuNSkgPT4ge1xyXG4gICAgY29uc3QgYWdvID0gbW9tZW50KHBvc3RlZE9uKS5mcm9tTm93KCk7XHJcbiAgICBjb25zdCBkaWZmID0gbW9tZW50KCkuZGlmZihwb3N0ZWRPbiwgXCJob3Vyc1wiLCB0cnVlKTtcclxuICAgIGlmIChkaWZmID49IGV4cGlyZSkge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBtb21lbnQocG9zdGVkT24pO1xyXG4gICAgICAgIHJldHVybiBgZC4gJHtkYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpfSBrbC4gJHtkYXRlLmZvcm1hdChcIkg6bW1cIil9YDtcclxuICAgIH1cclxuICAgIHJldHVybiBcImZvciBcIiArIGFnbztcclxufTtcclxuZXhwb3J0IGNvbnN0IGZvcm1hdFRleHQgPSAodGV4dCkgPT4ge1xyXG4gICAgaWYgKCF0ZXh0KVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgY29uc3QgcmF3TWFya3VwID0gbWFya2VkKHRleHQsIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICByZXR1cm4geyBfX2h0bWw6IHJhd01hcmt1cCB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0V29yZHMgPSAodGV4dCwgbnVtYmVyT2ZXb3JkcykgPT4ge1xyXG4gICAgaWYgKCF0ZXh0KVxyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgcGxhaW5UZXh0ID0gcmVtb3ZlTWQodGV4dCk7XHJcbiAgICByZXR1cm4gcGxhaW5UZXh0LnNwbGl0KC9cXHMrLykuc2xpY2UoMCwgbnVtYmVyT2ZXb3Jkcykuam9pbihcIiBcIik7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBnZXRGdWxsTmFtZSA9ICh1c2VyLCBub25lID0gXCJcIikgPT4ge1xyXG4gICAgaWYgKCF1c2VyKVxyXG4gICAgICAgIHJldHVybiBub25lO1xyXG4gICAgcmV0dXJuIGAke3VzZXIuRmlyc3ROYW1lfSAke3VzZXIuTGFzdE5hbWV9YDtcclxufTtcclxuZXhwb3J0IGNvbnN0IHZpc2l0Q29tbWVudHMgPSAoY29tbWVudHMsIGZ1bmMpID0+IHtcclxuICAgIGNvbnN0IGdldFJlcGxpZXMgPSAoYykgPT4gYy5SZXBsaWVzID8gYy5SZXBsaWVzIDogW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjb21tZW50c1tpXSwgZ2V0UmVwbGllcywgZnVuYyk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBkZXB0aEZpcnN0U2VhcmNoID0gKGN1cnJlbnQsIGdldENoaWxkcmVuLCBmdW5jKSA9PiB7XHJcbiAgICBmdW5jKGN1cnJlbnQpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBnZXRDaGlsZHJlbihjdXJyZW50KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKGNoaWxkcmVuW2ldLCBnZXRDaGlsZHJlbiwgZnVuYyk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVDb21tZW50ID0gKGNvbW1lbnQpID0+IHtcclxuICAgIGxldCByID0gY29tbWVudC5SZXBsaWVzID8gY29tbWVudC5SZXBsaWVzIDogW107XHJcbiAgICBjb25zdCByZXBsaWVzID0gci5tYXAobm9ybWFsaXplQ29tbWVudCk7XHJcbiAgICBjb25zdCBhdXRob3JJZCA9IChjb21tZW50LkRlbGV0ZWQpID8gLTEgOiBjb21tZW50LkF1dGhvci5JRDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgQ29tbWVudElEOiBjb21tZW50LklELFxyXG4gICAgICAgIEF1dGhvcklEOiBhdXRob3JJZCxcclxuICAgICAgICBEZWxldGVkOiBjb21tZW50LkRlbGV0ZWQsXHJcbiAgICAgICAgUG9zdGVkT246IGNvbW1lbnQuUG9zdGVkT24sXHJcbiAgICAgICAgVGV4dDogY29tbWVudC5UZXh0LFxyXG4gICAgICAgIFJlcGxpZXM6IHJlcGxpZXMsXHJcbiAgICAgICAgRWRpdGVkOiBjb21tZW50LkVkaXRlZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldEZvcnVtQ29tbWVudHNEZWxldGVVcmwgPSAoY29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4gYCR7Z2xvYmFscy51cmxzLmZvcnVtY29tbWVudHN9P2NvbW1lbnRJZD0ke2NvbW1lbnRJZH1gO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwgPSAocG9zdElkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4gYCR7Z2xvYmFscy51cmxzLmZvcnVtY29tbWVudHN9P3Bvc3RJZD0ke3Bvc3RJZH0mc2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybCA9IChpbWFnZUlkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4gYCR7Z2xvYmFscy51cmxzLmltYWdlY29tbWVudHN9P2ltYWdlSWQ9JHtpbWFnZUlkfSZza2lwPSR7c2tpcH0mdGFrZT0ke3Rha2V9YDtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldEltYWdlQ29tbWVudHNEZWxldGVVcmwgPSAoY29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4gYCR7Z2xvYmFscy51cmxzLmltYWdlY29tbWVudHN9P2NvbW1lbnRJZD0ke2NvbW1lbnRJZH1gO1xyXG59O1xyXG4iLCJleHBvcnQgY29uc3Qgbm9ybWFsaXplTGF0ZXN0ID0gKGxhdGVzdCkgPT4ge1xyXG4gICAgbGV0IGl0ZW0gPSBudWxsO1xyXG4gICAgbGV0IGF1dGhvcklkID0gLTE7XHJcbiAgICBpZiAobGF0ZXN0LlR5cGUgPT09IDEpIHtcclxuICAgICAgICBjb25zdCBpbWFnZSA9IGxhdGVzdC5JdGVtO1xyXG4gICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIEV4dGVuc2lvbjogaW1hZ2UuRXh0ZW5zaW9uLFxyXG4gICAgICAgICAgICBGaWxlbmFtZTogaW1hZ2UuRmlsZW5hbWUsXHJcbiAgICAgICAgICAgIEltYWdlSUQ6IGltYWdlLkltYWdlSUQsXHJcbiAgICAgICAgICAgIE9yaWdpbmFsVXJsOiBpbWFnZS5PcmlnaW5hbFVybCxcclxuICAgICAgICAgICAgUHJldmlld1VybDogaW1hZ2UuUHJldmlld1VybCxcclxuICAgICAgICAgICAgVGh1bWJuYWlsVXJsOiBpbWFnZS5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgICAgIFVwbG9hZGVkOiBpbWFnZS5VcGxvYWRlZCxcclxuICAgICAgICAgICAgRGVzY3JpcHRpb246IGltYWdlLkRlc2NyaXB0aW9uXHJcbiAgICAgICAgfTtcclxuICAgICAgICBhdXRob3JJZCA9IGltYWdlLkF1dGhvci5JRDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxhdGVzdC5UeXBlID09PSAyKSB7XHJcbiAgICAgICAgY29uc3QgY29tbWVudCA9IGxhdGVzdC5JdGVtO1xyXG4gICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIElEOiBjb21tZW50LklELFxyXG4gICAgICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgICAgIEltYWdlSUQ6IGNvbW1lbnQuSW1hZ2VJRCxcclxuICAgICAgICAgICAgSW1hZ2VVcGxvYWRlZEJ5OiBjb21tZW50LkltYWdlVXBsb2FkZWRCeSxcclxuICAgICAgICAgICAgRmlsZW5hbWU6IGNvbW1lbnQuRmlsZW5hbWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIGF1dGhvcklkID0gY29tbWVudC5BdXRob3IuSUQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChsYXRlc3QuVHlwZSA9PT0gNCkge1xyXG4gICAgICAgIGNvbnN0IHBvc3QgPSBsYXRlc3QuSXRlbTtcclxuICAgICAgICBpdGVtID0ge1xyXG4gICAgICAgICAgICBJRDogcG9zdC5UaHJlYWRJRCxcclxuICAgICAgICAgICAgVGl0bGU6IHBvc3QuSGVhZGVyLlRpdGxlLFxyXG4gICAgICAgICAgICBUZXh0OiBwb3N0LlRleHQsXHJcbiAgICAgICAgICAgIFN0aWNreTogcG9zdC5IZWFkZXIuU3RpY2t5LFxyXG4gICAgICAgICAgICBDb21tZW50Q291bnQ6IHBvc3QuSGVhZGVyLkNvbW1lbnRDb3VudFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYXV0aG9ySWQgPSBwb3N0LkhlYWRlci5BdXRob3IuSUQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiBsYXRlc3QuSUQsXHJcbiAgICAgICAgVHlwZTogbGF0ZXN0LlR5cGUsXHJcbiAgICAgICAgSXRlbTogaXRlbSxcclxuICAgICAgICBPbjogbGF0ZXN0Lk9uLFxyXG4gICAgICAgIEF1dGhvcklEOiBhdXRob3JJZCxcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVJbWFnZSA9IChpbWcpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSW1hZ2VJRDogaW1nLkltYWdlSUQsXHJcbiAgICAgICAgRmlsZW5hbWU6IGltZy5GaWxlbmFtZSxcclxuICAgICAgICBFeHRlbnNpb246IGltZy5FeHRlbnNpb24sXHJcbiAgICAgICAgT3JpZ2luYWxVcmw6IGltZy5PcmlnaW5hbFVybCxcclxuICAgICAgICBQcmV2aWV3VXJsOiBpbWcuUHJldmlld1VybCxcclxuICAgICAgICBUaHVtYm5haWxVcmw6IGltZy5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgQ29tbWVudENvdW50OiBpbWcuQ29tbWVudENvdW50LFxyXG4gICAgICAgIFVwbG9hZGVkOiBuZXcgRGF0ZShpbWcuVXBsb2FkZWQpLFxyXG4gICAgICAgIERlc2NyaXB0aW9uOiBpbWcuRGVzY3JpcHRpb25cclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVUaHJlYWRUaXRsZSA9ICh0aXRsZSkgPT4ge1xyXG4gICAgY29uc3Qgdmlld2VkQnkgPSB0aXRsZS5WaWV3ZWRCeS5tYXAodXNlciA9PiB1c2VyLklEKTtcclxuICAgIGNvbnN0IGxhdGVzdENvbW1lbnQgPSB0aXRsZS5MYXRlc3RDb21tZW50ID8gbm9ybWFsaXplQ29tbWVudCh0aXRsZS5MYXRlc3RDb21tZW50KSA6IG51bGw7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiB0aXRsZS5JRCxcclxuICAgICAgICBJc1B1Ymxpc2hlZDogdGl0bGUuSXNQdWJsaXNoZWQsXHJcbiAgICAgICAgU3RpY2t5OiB0aXRsZS5TdGlja3ksXHJcbiAgICAgICAgQ3JlYXRlZE9uOiB0aXRsZS5DcmVhdGVkT24sXHJcbiAgICAgICAgQXV0aG9ySUQ6IHRpdGxlLkF1dGhvci5JRCxcclxuICAgICAgICBEZWxldGVkOiB0aXRsZS5EZWxldGVkLFxyXG4gICAgICAgIElzTW9kaWZpZWQ6IHRpdGxlLklzTW9kaWZpZWQsXHJcbiAgICAgICAgVGl0bGU6IHRpdGxlLlRpdGxlLFxyXG4gICAgICAgIExhc3RNb2RpZmllZDogdGl0bGUuTGFzdE1vZGlmaWVkLFxyXG4gICAgICAgIExhdGVzdENvbW1lbnQ6IGxhdGVzdENvbW1lbnQsXHJcbiAgICAgICAgQ29tbWVudENvdW50OiB0aXRsZS5Db21tZW50Q291bnQsXHJcbiAgICAgICAgVmlld2VkQnk6IHZpZXdlZEJ5LFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNvbW1lbnQgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgbGV0IHIgPSBjb21tZW50LlJlcGxpZXMgPyBjb21tZW50LlJlcGxpZXMgOiBbXTtcclxuICAgIGNvbnN0IHJlcGxpZXMgPSByLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgIGNvbnN0IGF1dGhvcklkID0gKGNvbW1lbnQuRGVsZXRlZCkgPyAtMSA6IGNvbW1lbnQuQXV0aG9yLklEO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBDb21tZW50SUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgICAgIERlbGV0ZWQ6IGNvbW1lbnQuRGVsZXRlZCxcclxuICAgICAgICBQb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbixcclxuICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgUmVwbGllczogcmVwbGllcyxcclxuICAgICAgICBFZGl0ZWQ6IGNvbW1lbnQuRWRpdGVkXHJcbiAgICB9O1xyXG59O1xyXG4iLCJpbXBvcnQgKiBhcyBmZXRjaCBmcm9tIFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5pbXBvcnQgeyBvcHRpb25zLCBvYmpNYXAsIHJlc3BvbnNlSGFuZGxlciB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuZXhwb3J0IGNvbnN0IGFkZFVzZXIgPSAodXNlcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyMSxcclxuICAgICAgICBwYXlsb2FkOiB1c2VyXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0Q3VycmVudFVzZXJJZCA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyMCxcclxuICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHJlY2lldmVkVXNlcnMgPSAodXNlcnMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjIsXHJcbiAgICAgICAgcGF5bG9hZDogdXNlcnNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaEN1cnJlbnRVc2VyID0gKHVzZXJuYW1lKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke2dsb2JhbHMudXJscy51c2Vyc30/dXNlcm5hbWU9JHt1c2VybmFtZX1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRDdXJyZW50VXNlcklkKHVzZXIuSUQpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goYWRkVXNlcih1c2VyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hVc2VyID0gKHVzZXJuYW1lKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke2dsb2JhbHMudXJscy51c2Vyc30/dXNlcm5hbWU9JHt1c2VybmFtZX1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXIgPT4geyBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKTsgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hVc2VycyA9ICgpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2goZ2xvYmFscy51cmxzLnVzZXJzLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbih1c2VycyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdldEtleSA9ICh1c2VyKSA9PiB1c2VyLklEO1xyXG4gICAgICAgICAgICBjb25zdCBnZXRWYWx1ZSA9ICh1c2VyKSA9PiB1c2VyO1xyXG4gICAgICAgICAgICBjb25zdCBvYmogPSBvYmpNYXAodXNlcnMsIGdldEtleSwgZ2V0VmFsdWUpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNpZXZlZFVzZXJzKG9iaikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0IHsgcmVzcG9uc2VIYW5kbGVyLCBvcHRpb25zIH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBub3JtYWxpemVMYXRlc3QgYXMgbm9ybWFsaXplIH0gZnJvbSBcIi4uL3V0aWxpdGllcy9ub3JtYWxpemVcIjtcclxuaW1wb3J0ICogYXMgZmV0Y2ggZnJvbSBcImlzb21vcnBoaWMtZmV0Y2hcIjtcclxuaW1wb3J0IHsgYWRkVXNlciB9IGZyb20gXCIuLi9hY3Rpb25zL3VzZXJzXCI7XHJcbmV4cG9ydCBjb25zdCBzZXRMYXRlc3QgPSAobGF0ZXN0KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDUsXHJcbiAgICAgICAgcGF5bG9hZDogbGF0ZXN0XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0U2tpcCA9IChza2lwKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDYsXHJcbiAgICAgICAgcGF5bG9hZDogc2tpcFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRha2UgPSAodGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA3LFxyXG4gICAgICAgIHBheWxvYWQ6IHRha2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRQYWdlID0gKHBhZ2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogOCxcclxuICAgICAgICBwYXlsb2FkOiBwYWdlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VG90YWxQYWdlcyA9ICh0b3RhbFBhZ2VzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDksXHJcbiAgICAgICAgcGF5bG9hZDogdG90YWxQYWdlc1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoTGF0ZXN0TmV3cyA9IChza2lwLCB0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLndoYXRzbmV3fT9za2lwPSR7c2tpcH0mdGFrZT0ke3Rha2V9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihwYWdlID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBwYWdlLkN1cnJlbnRJdGVtcztcclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGdldEF1dGhvcihpdGVtLlR5cGUsIGl0ZW0uSXRlbSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXV0aG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkVXNlcihhdXRob3IpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNraXAoc2tpcCkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUYWtlKHRha2UpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0UGFnZShwYWdlLkN1cnJlbnRQYWdlKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMocGFnZS5Ub3RhbFBhZ2VzKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBpdGVtcy5tYXAobm9ybWFsaXplKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0TGF0ZXN0KG5vcm1hbGl6ZWQpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IGdldEF1dGhvciA9ICh0eXBlLCBpdGVtKSA9PiB7XHJcbiAgICBsZXQgYXV0aG9yID0gbnVsbDtcclxuICAgIGlmICh0eXBlID09PSA0KSB7XHJcbiAgICAgICAgYXV0aG9yID0gaXRlbS5IZWFkZXIuQXV0aG9yO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgYXV0aG9yID0gaXRlbS5BdXRob3I7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXV0aG9yO1xyXG59O1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgQnV0dG9uLCBHbHlwaGljb24sIEZvcm1Db250cm9sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaGFzRmlsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5zZXRIYXNGaWxlID0gdGhpcy5zZXRIYXNGaWxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEZXNjcmlwdGlvbkNoYW5nZSA9IHRoaXMuaGFuZGxlRGVzY3JpcHRpb25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkRmlsZXMgPSB0aGlzLnJlbW92ZVNlbGVjdGVkRmlsZXMuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnVwbG9hZEJ1dHRvblZpZXcgPSB0aGlzLnVwbG9hZEJ1dHRvblZpZXcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsZWFySW5wdXQgPSB0aGlzLmNsZWFySW5wdXQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNsZWFySW5wdXQoZmlsZUlucHV0KSB7XHJcbiAgICAgICAgaWYgKGZpbGVJbnB1dC52YWx1ZSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZmlsZUlucHV0LnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7IH1cclxuICAgICAgICAgICAgaWYgKGZpbGVJbnB1dC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKSwgcGFyZW50Tm9kZSA9IGZpbGVJbnB1dC5wYXJlbnROb2RlLCByZWYgPSBmaWxlSW5wdXQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGZpbGVJbnB1dCk7XHJcbiAgICAgICAgICAgICAgICBmb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShmaWxlSW5wdXQsIHJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIGhhc0ZpbGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0RmlsZXMoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIHJldHVybiAoZmlsZXMgPyBmaWxlcy5maWxlcyA6IFtdKTtcclxuICAgIH1cclxuICAgIGhhbmRsZVN1Ym1pdChlKSB7XHJcbiAgICAgICAgY29uc3QgeyB1cGxvYWRJbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSBmaWxlSW5wdXQuZmlsZXM7XHJcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xyXG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJmaWxlXCIsIGZpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1cGxvYWRJbWFnZSh1c2VybmFtZSwgdGhpcy5zdGF0ZS5kZXNjcmlwdGlvbiwgZm9ybURhdGEpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJJbnB1dChmaWxlSW5wdXQpO1xyXG4gICAgfVxyXG4gICAgc2V0SGFzRmlsZSgpIHtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZmlsZUlucHV0LmZpbGVzO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZpbGVzLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIGhhc0ZpbGU6IHJlc3VsdCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGhhbmRsZURlc2NyaXB0aW9uQ2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVTZWxlY3RlZEZpbGVzKCkge1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgdGhpcy5jbGVhcklucHV0KGZpbGVJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIGhhc0ZpbGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc2hvd0Rlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5oYXNGaWxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyBpZDogXCJkZXNjcmlwdGlvblwiLCB0eXBlOiBcInRleHRcIiwgdmFsdWU6IHRoaXMuc3RhdGUuZGVzY3JpcHRpb24sIHBsYWNlaG9sZGVyOiBcIkJlc2tyaXYgYmlsbGVkZXQuLi5cIiwgcm93czogNTAsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZURlc2NyaXB0aW9uQ2hhbmdlIH0pLFxyXG4gICAgICAgICAgICBcIlxcdTAwQTBcIixcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogXCJ3YXJuaW5nXCIsIG9uQ2xpY2s6IHRoaXMucmVtb3ZlU2VsZWN0ZWRGaWxlcyB9LCBcIiBGb3J0cnlkXCIpKTtcclxuICAgIH1cclxuICAgIHVwbG9hZEJ1dHRvblZpZXcoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmhhc0ZpbGUpXHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgZGlzYWJsZWQ6IHRydWUsIHR5cGU6IFwic3VibWl0XCIgfSwgXCIgVXBsb2FkXCIpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgdHlwZTogXCJzdWJtaXRcIiB9LCBcIlVwbG9hZFwiKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwgeyBvblN1Ym1pdDogdGhpcy5oYW5kbGVTdWJtaXQsIGlkOiBcImZvcm0tdXBsb2FkXCIsIGNsYXNzTmFtZTogXCJmb3JtLWlubGluZVwiLCBlbmNUeXBlOiBcIm11bHRpcGFydC9mb3JtLWRhdGFcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImZvcm0tZ3JvdXBcIiB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHsgaHRtbEZvcjogXCJmaWxlc1wiLCBjbGFzc05hbWU6IFwiaGlkZS1pbnB1dFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwiY2FtZXJhXCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgVlxcdTAwRTZsZyBmaWxlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7IHR5cGU6IFwiZmlsZVwiLCBpZDogXCJmaWxlc1wiLCBuYW1lOiBcImZpbGVzXCIsIG9uQ2hhbmdlOiB0aGlzLnNldEhhc0ZpbGUsIG11bHRpcGxlOiB0cnVlIH0pKSxcclxuICAgICAgICAgICAgICAgIFwiXFx1MDBBMCBcIixcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Rlc2NyaXB0aW9uKCksXHJcbiAgICAgICAgICAgICAgICBcIiBcXHUwMEEwXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZEJ1dHRvblZpZXcoKSksXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tIFwiLi91c2Vyc1wiO1xyXG5pbXBvcnQgeyBvYmpNYXAsIHJlc3BvbnNlSGFuZGxlciwgb3B0aW9ucyB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgbm9ybWFsaXplSW1hZ2UgYXMgbm9ybWFsaXplIH0gZnJvbSBcIi4uL3V0aWxpdGllcy9ub3JtYWxpemVcIjtcclxuZXhwb3J0IGNvbnN0IHNldEltYWdlc093bmVyID0gKGlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDEwLFxyXG4gICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgcmVjaWV2ZWRVc2VySW1hZ2VzID0gKGltYWdlcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxMSxcclxuICAgICAgICBwYXlsb2FkOiBpbWFnZXNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZEltZyA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxMixcclxuICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGFkZEltYWdlID0gKGltZykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxMyxcclxuICAgICAgICBwYXlsb2FkOiBpbWdcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCByZW1vdmVJbWFnZSA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxNCxcclxuICAgICAgICBwYXlsb2FkOiB7IEltYWdlSUQ6IGlkIH1cclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBhZGRTZWxlY3RlZEltYWdlSWQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTUsXHJcbiAgICAgICAgcGF5bG9hZDogaWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCByZW1vdmVTZWxlY3RlZEltYWdlSWQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTYsXHJcbiAgICAgICAgcGF5bG9hZDogaWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBjbGVhclNlbGVjdGVkSW1hZ2VJZHMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDE3LFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGluY3JlbWVudENvbW1lbnRDb3VudCA9IChpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDE4LFxyXG4gICAgICAgIHBheWxvYWQ6IHsgSW1hZ2VJRDogaW1hZ2VJZCB9XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVjcmVtZW50Q29tbWVudENvdW50ID0gKGltYWdlSWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTksXHJcbiAgICAgICAgcGF5bG9hZDogeyBJbWFnZUlEOiBpbWFnZUlkIH1cclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBuZXdJbWFnZUZyb21TZXJ2ZXIgPSAoaW1hZ2UpID0+IHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemUoaW1hZ2UpO1xyXG4gICAgcmV0dXJuIGFkZEltYWdlKG5vcm1hbGl6ZWQpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVsZXRlSW1hZ2UgPSAoaWQsIHVzZXJuYW1lKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlc30/dXNlcm5hbWU9JHt1c2VybmFtZX0maWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkoKHIpID0+IHIuanNvbigpKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4geyBkaXNwYXRjaChyZW1vdmVJbWFnZShpZCkpOyB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKHJlYXNvbikgPT4gY29uc29sZS5sb2cocmVhc29uKSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCB1cGxvYWRJbWFnZSA9ICh1c2VybmFtZSwgZGVzY3JpcHRpb24sIGZvcm1EYXRhLCBvblN1Y2Nlc3MsIG9uRXJyb3IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuaW1hZ2VzfT91c2VybmFtZT0ke3VzZXJuYW1lfSZkZXNjcmlwdGlvbj0ke2Rlc2NyaXB0aW9ufWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKF8gPT4gbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihvblN1Y2Nlc3MsIG9uRXJyb3IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoVXNlckltYWdlcyA9ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5pbWFnZXN9P3VzZXJuYW1lPSR7dXNlcm5hbWV9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gZGF0YS5tYXAobm9ybWFsaXplKTtcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gb2JqTWFwKG5vcm1hbGl6ZWQsIChpbWcpID0+IGltZy5JbWFnZUlELCAoaW1nKSA9PiBpbWcpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNpZXZlZFVzZXJJbWFnZXMob2JqKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVsZXRlSW1hZ2VzID0gKHVzZXJuYW1lLCBpbWFnZUlkcyA9IFtdKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaWRzID0gaW1hZ2VJZHMuam9pbihcIixcIik7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlc30/dXNlcm5hbWU9JHt1c2VybmFtZX0maWRzPSR7aWRzfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4geyBkaXNwYXRjaChjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSk7IH0pXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHsgZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSk7IH0pO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEltYWdlT3duZXIgPSAodXNlcm5hbWUpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmluZE93bmVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VycyA9IGdldFN0YXRlKCkudXNlcnNJbmZvLnVzZXJzO1xyXG4gICAgICAgICAgICBsZXQgdXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiB1c2Vycykge1xyXG4gICAgICAgICAgICAgICAgdXNlciA9IHVzZXJzW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodXNlci5Vc2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdXNlcjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBvd25lciA9IGZpbmRPd25lcigpO1xyXG4gICAgICAgIGlmIChvd25lcikge1xyXG4gICAgICAgICAgICBjb25zdCBvd25lcklkID0gb3duZXIuSUQ7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEltYWdlc093bmVyKG93bmVySWQpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLnVzZXJzfT91c2VybmFtZT0ke3VzZXJuYW1lfWA7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKHVzZXIgPT4geyBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKTsgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG93bmVyID0gZmluZE93bmVyKCk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lci5JRCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hTaW5nbGVJbWFnZSA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5pbWFnZXN9L2dldGJ5aWQ/aWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XHJcbiAgICAgICAgICAgIGlmICghaW1nKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkSW1hZ2UgPSBub3JtYWxpemUoaW1nKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goYWRkSW1hZ2Uobm9ybWFsaXplZEltYWdlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJpbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9wdGlvbnMgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmV4cG9ydCBjb25zdCBzZXRVc2VkU3BhY2VrQiA9ICh1c2VkU3BhY2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzIsXHJcbiAgICAgICAgcGF5bG9hZDogdXNlZFNwYWNlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VG90YWxTcGFjZWtCID0gKHRvdGFsU3BhY2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzMsXHJcbiAgICAgICAgcGF5bG9hZDogdG90YWxTcGFjZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoU3BhY2VJbmZvID0gKHVybCkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VkU3BhY2UgPSBkYXRhLlVzZWRTcGFjZUtCO1xyXG4gICAgICAgICAgICBjb25zdCB0b3RhbFNwYWNlID0gZGF0YS5TcGFjZVF1b3RhS0I7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFVzZWRTcGFjZWtCKHVzZWRTcGFjZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFNwYWNla0IodG90YWxTcGFjZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIFByb2dyZXNzQmFyIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBmZXRjaFNwYWNlSW5mbyB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL3N0YXR1c1wiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlZE1COiAoc3RhdGUuc3RhdHVzSW5mby5zcGFjZUluZm8udXNlZFNwYWNla0IgLyAxMDAwKSxcclxuICAgICAgICB0b3RhbE1COiAoc3RhdGUuc3RhdHVzSW5mby5zcGFjZUluZm8udG90YWxTcGFjZWtCIC8gMTAwMCksXHJcbiAgICAgICAgbG9hZGVkOiAoc3RhdGUuc3RhdHVzSW5mby5zcGFjZUluZm8udG90YWxTcGFjZWtCICE9PSAtMSlcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRTcGFjZUluZm86ICh1cmwpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hTcGFjZUluZm8odXJsKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgVXNlZFNwYWNlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGdldFNwYWNlSW5mbyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZGlhZ25vc3RpY3N9L2dldHNwYWNlaW5mb2A7XHJcbiAgICAgICAgZ2V0U3BhY2VJbmZvKHVybCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VkTUIsIHRvdGFsTUIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSBNYXRoLnJvdW5kKHRvdGFsTUIpO1xyXG4gICAgICAgIGNvbnN0IHVzZWQgPSBNYXRoLnJvdW5kKHVzZWRNQiAqIDEwMCkgLyAxMDA7XHJcbiAgICAgICAgY29uc3QgZnJlZSA9IE1hdGgucm91bmQoKHRvdGFsIC0gdXNlZCkgKiAxMDApIC8gMTAwO1xyXG4gICAgICAgIGNvbnN0IHVzZWRQZXJjZW50ID0gKCh1c2VkIC8gdG90YWwpICogMTAwKTtcclxuICAgICAgICBjb25zdCBwZXJjZW50Um91bmQgPSBNYXRoLnJvdW5kKHVzZWRQZXJjZW50ICogMTAwKSAvIDEwMDtcclxuICAgICAgICBjb25zdCBzaG93ID0gQm9vbGVhbih1c2VkUGVyY2VudCkgJiYgQm9vbGVhbih1c2VkKSAmJiBCb29sZWFuKGZyZWUpICYmIEJvb2xlYW4odG90YWwpO1xyXG4gICAgICAgIGlmICghc2hvdylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvZ3Jlc3NCYXIsIHsgc3RyaXBlZDogdHJ1ZSwgYnNTdHlsZTogXCJzdWNjZXNzXCIsIG5vdzogdXNlZFBlcmNlbnQsIGtleTogMSB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJCcnVndDogXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlZC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIE1CIChcIixcclxuICAgICAgICAgICAgICAgICAgICBwZXJjZW50Um91bmQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBcIiAlKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICBcIkZyaSBwbGFkczogXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJlZS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIE1CXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVG90YWw6IFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgTUJcIikpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBVc2VkU3BhY2UgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2VkU3BhY2VWaWV3KTtcclxuZXhwb3J0IGRlZmF1bHQgVXNlZFNwYWNlO1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgSW1hZ2UsIE1lZGlhIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgQ29tbWVudFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxlZnQsIHsgY2xhc3NOYW1lOiBcImNvbW1lbnQtcHJvZmlsZVwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2UsIHsgc3JjOiBcIi9pbWFnZXMvcGVyc29uX2ljb24uc3ZnXCIsIHN0eWxlOiB7IHdpZHRoOiBcIjY0cHhcIiwgaGVpZ2h0OiBcIjY0cHhcIiB9LCBjbGFzc05hbWU6IFwibWVkaWEtb2JqZWN0XCIgfSksXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBPdmVybGF5VHJpZ2dlciwgVG9vbHRpcCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3VG9vbHRpcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICB0b29sdGlwVmlldyh0aXApIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IGlkOiBcInRvb2x0aXBcIiB9LCB0aXApO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG9vbHRpcCwgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3ZlcmxheVRyaWdnZXIsIHsgcGxhY2VtZW50OiBcImxlZnRcIiwgb3ZlcmxheTogdGhpcy50b29sdGlwVmlldyh0b29sdGlwKSB9LCBjaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlXCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3VG9vbHRpcCB9IGZyb20gXCIuL1doYXRzTmV3VG9vbHRpcFwiO1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgdGltZVRleHQgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IEltYWdlLCBHbHlwaGljb24sIFRvb2x0aXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1JbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICB3aGVuKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFwidXBsb2FkZWRlIFwiICsgdGltZVRleHQob24pO1xyXG4gICAgfVxyXG4gICAgb3ZlcmxheSgpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IGlkOiBcInRvb2x0aXBfaW1nXCIgfSwgXCJCcnVnZXIgYmlsbGVkZVwiKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIGF1dGhvciwgZmlsZW5hbWUsIGV4dGVuc2lvbiwgdGh1bWJuYWlsLCBkZXNjcmlwdGlvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGF1dGhvci5Vc2VybmFtZTtcclxuICAgICAgICBjb25zdCBmaWxlID0gYCR7ZmlsZW5hbWV9LiR7ZXh0ZW5zaW9ufWA7XHJcbiAgICAgICAgY29uc3QgbGluayA9IGAke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2VJZH1gO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHthdXRob3IuRmlyc3ROYW1lfSAke2F1dGhvci5MYXN0TmFtZX1gO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFdoYXRzTmV3VG9vbHRpcCwgeyB0b29sdGlwOiBcIlVwbG9hZGV0IGJpbGxlZGVcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3RJdGVtLCB7IGNsYXNzTmFtZTogXCJ3aGF0c25ld0l0ZW0gaG92ZXItc2hhZG93XCIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudFByb2ZpbGUsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5Cb2R5LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJibG9ja3F1b3RlXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcImltYWdlLXdoYXRzbmV3LWRlc2NyaXB0aW9udGV4dFwiIH0sIGRlc2NyaXB0aW9uKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IGxpbmsgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2UsIHsgc3JjOiB0aHVtYm5haWwsIHRodW1ibmFpbDogdHJ1ZSB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2hlbigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicGljdHVyZVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlKSkpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlXCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3VG9vbHRpcCB9IGZyb20gXCIuL1doYXRzTmV3VG9vbHRpcFwiO1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCBnZXRXb3JkcywgdGltZVRleHQgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IE1lZGlhLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1Db21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNyZWF0ZVN1bW1hcnkoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBmb3JtYXRUZXh0KGdldFdvcmRzKHRleHQsIDUpICsgXCIuLi5cIik7XHJcbiAgICB9XHJcbiAgICBmdWxsbmFtZSgpIHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gYXV0aG9yID8gYXV0aG9yLkZpcnN0TmFtZSArIFwiIFwiICsgYXV0aG9yLkxhc3ROYW1lIDogXCJVc2VyXCI7XHJcbiAgICB9XHJcbiAgICB3aGVuKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFwic2FnZGUgXCIgKyB0aW1lVGV4dChvbik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCB1cGxvYWRlZEJ5LCBjb21tZW50SWQsIGZpbGVuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gdXBsb2FkZWRCeS5Vc2VybmFtZTtcclxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5mdWxsbmFtZSgpO1xyXG4gICAgICAgIGNvbnN0IHN1bW1hcnkgPSB0aGlzLmNyZWF0ZVN1bW1hcnkoKTtcclxuICAgICAgICBjb25zdCBsaW5rID0gYCR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZUlkfS9jb21tZW50P2lkPSR7Y29tbWVudElkfWA7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdUb29sdGlwLCB7IHRvb2x0aXA6IFwiS29tbWVudGFyXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MaXN0SXRlbSwgeyBjbGFzc05hbWU6IFwid2hhdHNuZXdJdGVtIGhvdmVyLXNoYWRvd1wiIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRQcm9maWxlLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYmxvY2txdW90ZVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IGxpbmsgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJlbVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHN1bW1hcnkgfSkpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvb3RlclwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aGVuKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJjb21tZW50XCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lKSkpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3VG9vbHRpcCB9IGZyb20gXCIuL1doYXRzTmV3VG9vbHRpcFwiO1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50UHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBnZXRXb3JkcywgdGltZVRleHQgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IE1lZGlhLCBHbHlwaGljb24sIFRvb2x0aXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0ZvcnVtUG9zdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnNob3dNb2RhbCA9IHRoaXMuc2hvd01vZGFsLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBmdWxsbmFtZSgpIHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gYXV0aG9yLkZpcnN0TmFtZSArIFwiIFwiICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgfVxyXG4gICAgd2hlbigpIHtcclxuICAgICAgICBjb25zdCB7IG9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBcImluZGzDpmcgXCIgKyB0aW1lVGV4dChvbik7XHJcbiAgICB9XHJcbiAgICBzdW1tYXJ5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gZ2V0V29yZHModGV4dCwgNSk7XHJcbiAgICB9XHJcbiAgICBvdmVybGF5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudENvdW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFRvb2x0aXAsIHsgaWQ6IFwidG9vbHRpcF9wb3N0XCIgfSxcclxuICAgICAgICAgICAgXCJGb3J1bSBpbmRsXFx1MDBFNmcsIGFudGFsIGtvbW1lbnRhcmVyOiBcIixcclxuICAgICAgICAgICAgY29tbWVudENvdW50KTtcclxuICAgIH1cclxuICAgIHNob3dNb2RhbChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgeyBwcmV2aWV3LCBpbmRleCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwcmV2aWV3KGluZGV4KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmZ1bGxuYW1lKCk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdUb29sdGlwLCB7IHRvb2x0aXA6IFwiRm9ydW0gaW5kbMOmZ1wiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuTGlzdEl0ZW0sIHsgY2xhc3NOYW1lOiBcIndoYXRzbmV3SXRlbSBob3Zlci1zaGFkb3dcIiB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50UHJvZmlsZSwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJsb2NrcXVvdGVcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwgeyBocmVmOiBcIiNcIiwgb25DbGljazogdGhpcy5zaG93TW9kYWwgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3VtbWFyeSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIuLi5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2hlbigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwibGlzdC1hbHRcIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUpKSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgV2hhdHNOZXdJdGVtSW1hZ2UgfSBmcm9tIFwiLi9XaGF0c05ld0l0ZW1JbWFnZVwiO1xyXG5pbXBvcnQgeyBXaGF0c05ld0l0ZW1Db21tZW50IH0gZnJvbSBcIi4vV2hhdHNOZXdJdGVtQ29tbWVudFwiO1xyXG5pbXBvcnQgeyBXaGF0c05ld0ZvcnVtUG9zdCB9IGZyb20gXCIuL1doYXRzTmV3Rm9ydW1Qb3N0XCI7XHJcbmltcG9ydCB7IE1lZGlhIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucHJldmlld1Bvc3RIYW5kbGUgPSB0aGlzLnByZXZpZXdQb3N0SGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcmV2aWV3UG9zdEhhbmRsZShpbmRleCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIHByZXZpZXcgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2luZGV4XTtcclxuICAgICAgICBwcmV2aWV3KGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0SXRlbXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBnZW5lcmF0ZUtleSA9IChpZCkgPT4gXCJ3aGF0c25ld19cIiArIGlkO1xyXG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1LZXkgPSBnZW5lcmF0ZUtleShpdGVtLklEKTtcclxuICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gZ2V0VXNlcihpdGVtLkF1dGhvcklEKTtcclxuICAgICAgICAgICAgc3dpdGNoIChpdGVtLlR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlID0gaXRlbS5JdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChXaGF0c05ld0l0ZW1JbWFnZSwgeyBvbjogaXRlbS5PbiwgaW1hZ2VJZDogaW1hZ2UuSW1hZ2VJRCwgZmlsZW5hbWU6IGltYWdlLkZpbGVuYW1lLCBleHRlbnNpb246IGltYWdlLkV4dGVuc2lvbiwgdGh1bWJuYWlsOiBpbWFnZS5UaHVtYm5haWxVcmwsIGF1dGhvcjogYXV0aG9yLCBkZXNjcmlwdGlvbjogaW1hZ2UuRGVzY3JpcHRpb24sIGtleTogaXRlbUtleSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21tZW50ID0gaXRlbS5JdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChXaGF0c05ld0l0ZW1Db21tZW50LCB7IGNvbW1lbnRJZDogY29tbWVudC5JRCwgdGV4dDogY29tbWVudC5UZXh0LCB1cGxvYWRlZEJ5OiBjb21tZW50LkltYWdlVXBsb2FkZWRCeSwgaW1hZ2VJZDogY29tbWVudC5JbWFnZUlELCBmaWxlbmFtZTogY29tbWVudC5GaWxlbmFtZSwgb246IGl0ZW0uT24sIGF1dGhvcjogYXV0aG9yLCBrZXk6IGl0ZW1LZXkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zdCA9IGl0ZW0uSXRlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdGb3J1bVBvc3QsIHsgb246IGl0ZW0uT24sIGF1dGhvcjogYXV0aG9yLCB0aXRsZTogcG9zdC5UaXRsZSwgdGV4dDogcG9zdC5UZXh0LCBzdGlja3k6IHBvc3QuU3RpY2t5LCBjb21tZW50Q291bnQ6IHBvc3QuQ29tbWVudENvdW50LCBwcmV2aWV3OiB0aGlzLnByZXZpZXdQb3N0SGFuZGxlLCBpbmRleDogaW5kZXgsIGtleTogaXRlbUtleSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbU5vZGVzID0gdGhpcy5jb25zdHJ1Y3RJdGVtcygpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3QsIG51bGwsIGl0ZW1Ob2Rlcyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEZvcm1Hcm91cCwgQ29udHJvbExhYmVsLCBGb3JtQ29udHJvbCwgQnV0dG9uLCBSb3csIENvbCwgTW9kYWwsIEJ1dHRvbkdyb3VwLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBGb3J1bUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgVGl0bGU6IFwiXCIsXHJcbiAgICAgICAgICAgIFRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgIFN0aWNreTogZmFsc2UsXHJcbiAgICAgICAgICAgIElzUHVibGlzaGVkOiB0cnVlLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXQgfSA9IG5leHRQcm9wcztcclxuICAgICAgICBpZiAoZWRpdCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBlZGl0LlRpdGxlLFxyXG4gICAgICAgICAgICAgICAgVGV4dDogZWRpdC5UZXh0LFxyXG4gICAgICAgICAgICAgICAgU3RpY2t5OiBlZGl0LlN0aWNreSxcclxuICAgICAgICAgICAgICAgIElzUHVibGlzaGVkOiBlZGl0LklzUHVibGlzaGVkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGhhbmRsZVRpdGxlQ2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGl0bGU6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0VmFsaWRhdGlvbigpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnN0YXRlLlRpdGxlLmxlbmd0aDtcclxuICAgICAgICBpZiAobGVuZ3RoID49IDAgJiYgbGVuZ3RoIDwgMjAwKVxyXG4gICAgICAgICAgICByZXR1cm4gXCJzdWNjZXNzXCI7XHJcbiAgICAgICAgaWYgKGxlbmd0aCA+PSAyMDAgJiYgbGVuZ3RoIDw9IDI1MClcclxuICAgICAgICAgICAgcmV0dXJuIFwid2FybmluZ1wiO1xyXG4gICAgICAgIHJldHVybiBcImVycm9yXCI7XHJcbiAgICB9XHJcbiAgICB0cmFuc2Zvcm1Ub0RUTyhzdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IHtcclxuICAgICAgICAgICAgSXNQdWJsaXNoZWQ6IHN0YXRlLklzUHVibGlzaGVkLFxyXG4gICAgICAgICAgICBTdGlja3k6IHN0YXRlLlN0aWNreSxcclxuICAgICAgICAgICAgVGl0bGU6IHN0YXRlLlRpdGxlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBIZWFkZXI6IGhlYWRlcixcclxuICAgICAgICAgICAgVGV4dDogc3RhdGUuVGV4dFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBoYW5kbGVTdWJtaXQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCB7IGNsb3NlLCBvblN1Ym1pdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBwb3N0ID0gdGhpcy50cmFuc2Zvcm1Ub0RUTyh0aGlzLnN0YXRlKTtcclxuICAgICAgICBvblN1Ym1pdChwb3N0KTtcclxuICAgICAgICBjbG9zZSgpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlU3RpY2t5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgU3RpY2t5IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBTdGlja3k6ICFTdGlja3kgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVQdWJsaXNoZWQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBJc1B1Ymxpc2hlZCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgSXNQdWJsaXNoZWQ6ICFJc1B1Ymxpc2hlZCB9KTtcclxuICAgIH1cclxuICAgIGNsb3NlSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xvc2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY2xvc2UoKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHNob3csIGVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVhZE1vZGUgPSBCb29sZWFuKCFlZGl0KTtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IHJlYWRNb2RlID8gXCJTa3JpdiBueXQgaW5kbMOmZ1wiIDogXCLDhm5kcmUgaW5kbMOmZ1wiO1xyXG4gICAgICAgIGNvbnN0IGJ0blN1Ym1pdCA9IHJlYWRNb2RlID8gXCJTa3JpdiBpbmRsw6ZnXCIgOiBcIkdlbSDDpm5kcmluZ2VyXCI7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwsIHsgc2hvdzogc2hvdywgb25IaWRlOiB0aGlzLmNsb3NlSGFuZGxlLmJpbmQodGhpcyksIGJzU2l6ZTogXCJsZ1wiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkhlYWRlciwgeyBjbG9zZUJ1dHRvbjogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuVGl0bGUsIG51bGwsIHRpdGxlKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxMiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgY29udHJvbElkOiBcImZvcm1Qb3N0VGl0bGVcIiwgdmFsaWRhdGlvblN0YXRlOiB0aGlzLmdldFZhbGlkYXRpb24oKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29udHJvbExhYmVsLCBudWxsLCBcIk92ZXJza3JpZnRcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiT3ZlcnNrcmlmdCBww6UgaW5kbMOmZy4uLlwiLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVUaXRsZUNoYW5nZS5iaW5kKHRoaXMpLCB2YWx1ZTogdGhpcy5zdGF0ZS5UaXRsZSB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBjb250cm9sSWQ6IFwiZm9ybVBvc3RDb250ZW50XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbnRyb2xMYWJlbCwgbnVsbCwgXCJJbmRsXFx1MDBFNmdcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyBjb21wb25lbnRDbGFzczogXCJ0ZXh0YXJlYVwiLCBwbGFjZWhvbGRlcjogXCJTa3JpdiBiZXNrZWQgaGVyLi4uXCIsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKSwgdmFsdWU6IHRoaXMuc3RhdGUuVGV4dCwgcm93czogOCB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBjb250cm9sSWQ6IFwiZm9ybVBvc3RTdGlja3lcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uR3JvdXAsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwic3VjY2Vzc1wiLCBic1NpemU6IFwic21hbGxcIiwgYWN0aXZlOiB0aGlzLnN0YXRlLlN0aWNreSwgb25DbGljazogdGhpcy5oYW5kbGVTdGlja3kuYmluZCh0aGlzKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicHVzaHBpblwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgVmlndGlnXCIpKSkpKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkZvb3RlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcImRlZmF1bHRcIiwgb25DbGljazogdGhpcy5jbG9zZUhhbmRsZS5iaW5kKHRoaXMpIH0sIFwiTHVrXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZVN1Ym1pdCB9LCBidG5TdWJtaXQpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQnV0dG9uVG9vbGJhciwgQnV0dG9uR3JvdXAsIE92ZXJsYXlUcmlnZ2VyLCBCdXR0b24sIEdseXBoaWNvbiwgVG9vbHRpcCwgQ29sbGFwc2UsIEZvcm1Hcm91cCwgRm9ybUNvbnRyb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBCdXR0b25Ub29sdGlwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRvb2x0aXAsIG9uQ2xpY2ssIGljb24sIGJzU3R5bGUsIGFjdGl2ZSwgbW91bnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbGV0IG92ZXJsYXlUaXAgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFRvb2x0aXAsIHsgaWQ6IFwidG9vbHRpcFwiIH0sIHRvb2x0aXApO1xyXG4gICAgICAgIGlmICghbW91bnQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE92ZXJsYXlUcmlnZ2VyLCB7IHBsYWNlbWVudDogXCJ0b3BcIiwgb3ZlcmxheTogb3ZlcmxheVRpcCB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBic1N0eWxlLCBic1NpemU6IFwieHNtYWxsXCIsIG9uQ2xpY2s6IG9uQ2xpY2ssIGFjdGl2ZTogYWN0aXZlIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogaWNvbiB9KSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Q29udHJvbHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGV4dDogcHJvcHMudGV4dCxcclxuICAgICAgICAgICAgcmVwbHlUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICByZXBseTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVkaXQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRvZ2dsZUVkaXQgPSB0aGlzLnRvZ2dsZUVkaXQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRvZ2dsZVJlcGx5ID0gdGhpcy50b2dnbGVSZXBseS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZWRpdEhhbmRsZSA9IHRoaXMuZWRpdEhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlIYW5kbGUgPSB0aGlzLnJlcGx5SGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVIYW5kbGUgPSB0aGlzLmRlbGV0ZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVwbHlDaGFuZ2UgPSB0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVSZXBseUNoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5VGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVFZGl0KCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogIWVkaXQgfSk7XHJcbiAgICAgICAgaWYgKCFlZGl0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdG9nZ2xlUmVwbHkoKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseSB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6ICFyZXBseSB9KTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUNvbW1lbnQsIGNvbW1lbnRJZCwgY29udGV4dElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBjb250ZXh0SWQpO1xyXG4gICAgfVxyXG4gICAgZWRpdEhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRDb21tZW50LCBjb250ZXh0SWQsIGNvbW1lbnRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IGZhbHNlIH0pO1xyXG4gICAgICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgY29udGV4dElkLCB0ZXh0KTtcclxuICAgIH1cclxuICAgIHJlcGx5SGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudElkLCBjb250ZXh0SWQsIHJlcGx5Q29tbWVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHJlcGx5VGV4dCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6IGZhbHNlLCByZXBseVRleHQ6IFwiXCIgfSk7XHJcbiAgICAgICAgcmVwbHlDb21tZW50KGNvbnRleHRJZCwgcmVwbHlUZXh0LCBjb21tZW50SWQpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9ySWQsIGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0LCB0ZXh0LCByZXBseSwgcmVwbHlUZXh0IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IG1vdW50ID0gY2FuRWRpdChhdXRob3JJZCk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBzdHlsZTogeyBwYWRkaW5nQm90dG9tOiBcIjVweFwiLCBwYWRkaW5nTGVmdDogXCIxNXB4XCIgfSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDQgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uR3JvdXAsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMuZGVsZXRlSGFuZGxlLCBpY29uOiBcInRyYXNoXCIsIHRvb2x0aXA6IFwic2xldFwiLCBtb3VudDogbW91bnQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMudG9nZ2xlRWRpdCwgaWNvbjogXCJwZW5jaWxcIiwgdG9vbHRpcDogXCLDpm5kcmVcIiwgYWN0aXZlOiBlZGl0LCBtb3VudDogbW91bnQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMudG9nZ2xlUmVwbHksIGljb246IFwiZW52ZWxvcGVcIiwgdG9vbHRpcDogXCJzdmFyXCIsIGFjdGl2ZTogcmVwbHksIG1vdW50OiB0cnVlIH0pKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsgc3R5bGU6IHsgcGFkZGluZ0JvdHRvbTogXCI1cHhcIiB9IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMSwgbGc6IDEwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2xsYXBzZVRleHRBcmVhLCB7IHNob3c6IGVkaXQsIGlkOiBcImVkaXRUZXh0Q29udHJvbFwiLCB2YWx1ZTogdGV4dCwgb25DaGFuZ2U6IHRoaXMuaGFuZGxlVGV4dENoYW5nZSwgdG9nZ2xlOiB0aGlzLnRvZ2dsZUVkaXQsIHNhdmU6IHRoaXMuZWRpdEhhbmRsZSwgc2F2ZVRleHQ6IFwiR2VtIMOmbmRyaW5nZXJcIiwgbW91bnQ6IG1vdW50IH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDEsIGxnOiAxMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sbGFwc2VUZXh0QXJlYSwgeyBzaG93OiByZXBseSwgaWQ6IFwicmVwbHlUZXh0Q29udHJvbFwiLCB2YWx1ZTogcmVwbHlUZXh0LCBvbkNoYW5nZTogdGhpcy5oYW5kbGVSZXBseUNoYW5nZSwgdG9nZ2xlOiB0aGlzLnRvZ2dsZVJlcGx5LCBzYXZlOiB0aGlzLnJlcGx5SGFuZGxlLCBzYXZlVGV4dDogXCJTdmFyXCIsIG1vdW50OiB0cnVlIH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIENvbGxhcHNlVGV4dEFyZWEgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2hvdywgaWQsIHZhbHVlLCBvbkNoYW5nZSwgdG9nZ2xlLCBzYXZlLCBzYXZlVGV4dCwgbW91bnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCFtb3VudClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sbGFwc2UsIHsgaW46IHNob3cgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgY29udHJvbElkOiBpZCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyBjb21wb25lbnRDbGFzczogXCJ0ZXh0YXJlYVwiLCB2YWx1ZTogdmFsdWUsIG9uQ2hhbmdlOiBvbkNoYW5nZSwgcm93czogNCB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbGJhciwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0b2dnbGUgfSwgXCJMdWtcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgdHlwZTogXCJzdWJtaXRcIiwgYnNTdHlsZTogXCJpbmZvXCIsIG9uQ2xpY2s6IHNhdmUgfSwgc2F2ZVRleHQpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmltcG9ydCB7IG9wdGlvbnMsIHJlc3BvbnNlSGFuZGxlciB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgbm9ybWFsaXplVGhyZWFkVGl0bGUgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL25vcm1hbGl6ZVwiO1xyXG5leHBvcnQgY29uc3QgYWRkVGhyZWFkVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjQsXHJcbiAgICAgICAgcGF5bG9hZDogW3RpdGxlXVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRocmVhZFRpdGxlcyA9ICh0aXRsZXMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjUsXHJcbiAgICAgICAgcGF5bG9hZDogdGl0bGVzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VG90YWxQYWdlcyA9ICh0b3RhbFBhZ2VzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDI2LFxyXG4gICAgICAgIHBheWxvYWQ6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRQYWdlID0gKHBhZ2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjcsXHJcbiAgICAgICAgcGF5bG9hZDogcGFnZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFNraXAgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyOCxcclxuICAgICAgICBwYXlsb2FkOiBza2lwXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VGFrZSA9ICh0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDI5LFxyXG4gICAgICAgIHBheWxvYWQ6IHRha2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZFRocmVhZCA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzMCxcclxuICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFBvc3RDb250ZW50ID0gKGNvbnRlbnQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzEsXHJcbiAgICAgICAgcGF5bG9hZDogY29udGVudFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG1hcmtQb3N0ID0gKHBvc3RJZCwgcmVhZCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9wb3N0SWQ9JHtwb3N0SWR9JnJlYWQ9JHtyZWFkfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoVGhyZWFkcyA9IChza2lwID0gMCwgdGFrZSA9IDEwKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZm9ydW0gPSBnbG9iYWxzLnVybHMuZm9ydW10aXRsZTtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtmb3J1bX0/c2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VGb3J1bVRpdGxlcyA9IGRhdGEuQ3VycmVudEl0ZW1zO1xyXG4gICAgICAgICAgICBjb25zdCBmb3J1bVRpdGxlcyA9IHBhZ2VGb3J1bVRpdGxlcy5tYXAobm9ybWFsaXplVGhyZWFkVGl0bGUpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwKHNraXApKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZSh0YWtlKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMoZGF0YS5Ub3RhbFBhZ2VzKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFBhZ2UoZGF0YS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUaHJlYWRUaXRsZXMoZm9ydW1UaXRsZXMpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFBvc3QgPSAoaWQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZm9ydW0gPSBnbG9iYWxzLnVybHMuZm9ydW1wb3N0O1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2ZvcnVtfT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkYXRhLlRleHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gbm9ybWFsaXplVGhyZWFkVGl0bGUoZGF0YS5IZWFkZXIpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChhZGRUaHJlYWRUaXRsZSh0aXRsZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRQb3N0Q29udGVudChjb250ZW50KSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkVGhyZWFkKGRhdGEuVGhyZWFkSUQpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgdXBkYXRlUG9zdCA9IChpZCwgcG9zdCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKF8gPT4gbnVsbCk7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3QpLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVsZXRlUG9zdCA9IChpZCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHBvc3RUaHJlYWQgPSAocG9zdCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuZm9ydW1wb3N0O1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3QpLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkoXyA9PiBudWxsKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGNiKTtcclxuICAgIH07XHJcbn07XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBGb3J1bUZvcm0gfSBmcm9tIFwiLi4vZm9ydW0vRm9ydW1Gb3JtXCI7XHJcbmltcG9ydCB7IEJ1dHRvblRvb2x0aXAgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudENvbnRyb2xzXCI7XHJcbmltcG9ydCB7IG1hcmtQb3N0LCB1cGRhdGVQb3N0LCBmZXRjaFBvc3QsIGRlbGV0ZVBvc3QsIHNldFNlbGVjdGVkVGhyZWFkIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvZm9ydW1cIjtcclxuaW1wb3J0IHsgZmluZCwgY29udGFpbnMgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgeyBnZXRGdWxsTmFtZSwgZm9ybWF0VGV4dCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIEdseXBoaWNvbiwgQnV0dG9uVG9vbGJhciwgQnV0dG9uR3JvdXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnNlbGVjdGVkVGhyZWFkO1xyXG4gICAgY29uc3QgdGl0bGUgPSBmaW5kKHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRpdGxlcywgKHRpdGxlKSA9PiB0aXRsZS5JRCA9PT0gc2VsZWN0ZWQpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWQsXHJcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgIHRleHQ6IHN0YXRlLmZvcnVtSW5mby5wb3N0Q29udGVudCxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF0sXHJcbiAgICAgICAgY2FuRWRpdDogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZCA9PT0gaWQsXHJcbiAgICAgICAgaGFzUmVhZDogdGl0bGUgPyBjb250YWlucyh0aXRsZS5WaWV3ZWRCeSwgc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQpIDogZmFsc2UsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlOiAoaWQsIHBvc3QsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwZGF0ZVBvc3QoaWQsIHBvc3QsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRQb3N0OiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hQb3N0KGlkKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKHNldFNlbGVjdGVkVGhyZWFkKGlkKSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlUG9zdDogKGlkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVQb3N0KGlkLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVhZFBvc3Q6IChwb3N0SWQsIHJlYWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKG1hcmtQb3N0KHBvc3RJZCwgcmVhZCwgY2IpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBGb3J1bVBvc3RDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgZWRpdDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudG9nZ2xlRWRpdCA9IHRoaXMudG9nZ2xlRWRpdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25TdWJtaXQgPSB0aGlzLm9uU3VibWl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVIYW5kbGUgPSB0aGlzLmRlbGV0ZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlUG9zdFJlYWQgPSB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IGhhc1RpdGxlID0gQm9vbGVhbihuZXh0UHJvcHMudGl0bGUpO1xyXG4gICAgICAgIGlmICghaGFzVGl0bGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBuZXh0UHJvcHMudGl0bGUuVGl0bGUsXHJcbiAgICAgICAgICAgICAgICBUZXh0OiBuZXh0UHJvcHMudGV4dCxcclxuICAgICAgICAgICAgICAgIFN0aWNreTogbmV4dFByb3BzLnRpdGxlLlN0aWNreSxcclxuICAgICAgICAgICAgICAgIElzUHVibGlzaGVkOiBuZXh0UHJvcHMudGl0bGUuSXNQdWJsaXNoZWRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IG5leHRQcm9wcy50aXRsZS5UaXRsZTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IHJvdXRlciwgZGVsZXRlUG9zdCwgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcnVtbGlzdHMgPSBgL2ZvcnVtYDtcclxuICAgICAgICAgICAgcm91dGVyLnB1c2goZm9ydW1saXN0cyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkZWxldGVQb3N0KHRpdGxlLklELCBjYik7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVFZGl0KCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXQgPSB0aGlzLnN0YXRlLmVkaXQ7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6ICFlZGl0IH0pO1xyXG4gICAgfVxyXG4gICAgb25TdWJtaXQocG9zdCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBkYXRlLCBnZXRQb3N0LCB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgZ2V0UG9zdCh0aXRsZS5JRCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB1cGRhdGUodGl0bGUuSUQsIHBvc3QsIGNiKTtcclxuICAgIH1cclxuICAgIHRvZ2dsZVBvc3RSZWFkKHRvZ2dsZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZ2V0UG9zdCwgcmVhZFBvc3QsIHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBnZXRQb3N0KHRpdGxlLklEKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlYWRQb3N0KHRpdGxlLklELCB0b2dnbGUsIGNiKTtcclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBmYWxzZSB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIHNlbGVjdGVkLCB0aXRsZSwgdGV4dCwgZ2V0VXNlciwgaGFzUmVhZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAoc2VsZWN0ZWQgPCAwIHx8ICF0aXRsZSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgZWRpdCA9IGNhbkVkaXQodGl0bGUuQXV0aG9ySUQpO1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyKHRpdGxlLkF1dGhvcklEKTtcclxuICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRGdWxsTmFtZSh1c2VyKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1IZWFkZXIsIHsgbGc6IDEyLCBuYW1lOiBhdXRob3IsIHRpdGxlOiB0aXRsZS5UaXRsZSwgY3JlYXRlZE9uOiB0aXRsZS5DcmVhdGVkT24sIG1vZGlmaWVkT246IHRpdGxlLkxhc3RNb2RpZmllZCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUJ1dHRvbkdyb3VwLCB7IHNob3c6IHRydWUsIGVkaXRhYmxlOiBlZGl0LCBpbml0aWFsUmVhZDogaGFzUmVhZCwgb25EZWxldGU6IHRoaXMuZGVsZXRlSGFuZGxlLCBvbkVkaXQ6IHRoaXMudG9nZ2xlRWRpdCwgb25SZWFkOiB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcywgdHJ1ZSksIG9uVW5yZWFkOiB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcywgZmFsc2UpIH0pKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUJvZHksIHsgdGV4dDogdGV4dCwgbGc6IDEwIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUZvcm0sIHsgc2hvdzogdGhpcy5zdGF0ZS5lZGl0LCBjbG9zZTogdGhpcy5jbG9zZS5iaW5kKHRoaXMpLCBvblN1Ym1pdDogdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpLCBlZGl0OiB0aGlzLnN0YXRlLm1vZGVsIH0pKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRm9ydW1Cb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQsIGxnLCBsZ09mZnNldCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBmb3JtYXR0ZWRUZXh0ID0gZm9ybWF0VGV4dCh0ZXh0KTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiBsZywgbGdPZmZzZXQ6IGxnT2Zmc2V0IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJmb3J1bS1jb250ZW50XCIsIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiBmb3JtYXR0ZWRUZXh0IH0pLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEyIH0sIHRoaXMucHJvcHMuY2hpbGRyZW4pKSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBGb3J1bUhlYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBnZXRDcmVhdGVkT25UZXh0KGNyZWF0ZWRPbiwgbW9kaWZpZWRPbikge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBtb21lbnQoY3JlYXRlZE9uKTtcclxuICAgICAgICBjb25zdCBkYXRlVGV4dCA9IGRhdGUuZm9ybWF0KFwiRC1NTS1ZWVwiKTtcclxuICAgICAgICBjb25zdCB0aW1lVGV4dCA9IGRhdGUuZm9ybWF0KFwiIEg6bW1cIik7XHJcbiAgICAgICAgaWYgKCFtb2RpZmllZE9uKVxyXG4gICAgICAgICAgICByZXR1cm4gYFVkZ2l2ZXQgJHtkYXRlVGV4dH0ga2wuICR7dGltZVRleHR9YDtcclxuICAgICAgICBjb25zdCBtb2RpZmllZCA9IG1vbWVudChtb2RpZmllZE9uKTtcclxuICAgICAgICBjb25zdCBtb2RpZmllZERhdGUgPSBtb2RpZmllZC5mb3JtYXQoXCJELU1NLVlZXCIpO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkVGltZSA9IG1vZGlmaWVkLmZvcm1hdChcIkg6bW1cIik7XHJcbiAgICAgICAgcmV0dXJuIGBVZGdpdmV0ICR7ZGF0ZVRleHR9IGtsLiAke3RpbWVUZXh0fSAoIHJldHRldCAke21vZGlmaWVkRGF0ZX0ga2wuICR7bW9kaWZpZWRUaW1lfSApYDtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlLCBuYW1lLCBjcmVhdGVkT24sIG1vZGlmaWVkT24sIGxnLCBsZ09mZnNldCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5nZXRDcmVhdGVkT25UZXh0KGNyZWF0ZWRPbiwgbW9kaWZpZWRPbik7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7IGxnOiBsZywgbGdPZmZzZXQ6IGxnT2Zmc2V0IH07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgX19hc3NpZ24oe30sIHByb3BzKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtY2FwaXRhbGl6ZVwiIH0sIHRpdGxlKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU2tyZXZldCBhZiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtcHJpbWFyeVwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwidGltZVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWQpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsIHRoaXMucHJvcHMuY2hpbGRyZW4pKSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEZvcnVtQnV0dG9uR3JvdXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgcmVhZDogcHJvcHMuaW5pdGlhbFJlYWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVhZEhhbmRsZSA9IHRoaXMucmVhZEhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudW5yZWFkSGFuZGxlID0gdGhpcy51bnJlYWRIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHJlYWRIYW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBvblJlYWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucmVhZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWFkOiB0cnVlIH0pO1xyXG4gICAgICAgIG9uUmVhZCgpO1xyXG4gICAgfVxyXG4gICAgdW5yZWFkSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb25VbnJlYWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnJlYWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVhZDogZmFsc2UgfSk7XHJcbiAgICAgICAgb25VbnJlYWQoKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRhYmxlLCBzaG93LCBvbkRlbGV0ZSwgb25FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghc2hvdylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyByZWFkIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMTIsIGNsYXNzTmFtZTogXCJmb3J1bS1lZGl0YmFyXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sYmFyLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Hcm91cCwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJkYW5nZXJcIiwgb25DbGljazogb25EZWxldGUsIGljb246IFwidHJhc2hcIiwgdG9vbHRpcDogXCJzbGV0IGluZGzDpmdcIiwgbW91bnQ6IGVkaXRhYmxlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbHRpcCwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgb25DbGljazogb25FZGl0LCBpY29uOiBcInBlbmNpbFwiLCB0b29sdGlwOiBcIsOmbmRyZSBpbmRsw6ZnXCIsIGFjdGl2ZTogZmFsc2UsIG1vdW50OiBlZGl0YWJsZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMucmVhZEhhbmRsZSwgaWNvbjogXCJleWUtb3BlblwiLCB0b29sdGlwOiBcIm1hcmtlciBzb20gbMOmc3RcIiwgYWN0aXZlOiByZWFkLCBtb3VudDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMudW5yZWFkSGFuZGxlLCBpY29uOiBcImV5ZS1jbG9zZVwiLCB0b29sdGlwOiBcIm1hcmtlciBzb20gdWzDpnN0XCIsIGFjdGl2ZTogIXJlYWQsIG1vdW50OiB0cnVlIH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IEZvcnVtUG9zdFJlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRm9ydW1Qb3N0Q29udGFpbmVyKTtcclxuY29uc3QgRm9ydW1Qb3N0ID0gd2l0aFJvdXRlcihGb3J1bVBvc3RSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IEZvcnVtUG9zdDtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFBhZ2luYXRpb24gYXMgUGFnaW5hdGlvbkJzIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBwYWdlLCBwYWdlSGFuZGxlLCBzaG93IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG1vcmUgPSB0b3RhbFBhZ2VzID4gMTtcclxuICAgICAgICBjb25zdCB4b3IgPSAoc2hvdyB8fCBtb3JlKSAmJiAhKHNob3cgJiYgbW9yZSk7XHJcbiAgICAgICAgaWYgKCEoeG9yIHx8IChzaG93ICYmIG1vcmUpKSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbkJzLCB7IHByZXY6IHRydWUsIG5leHQ6IHRydWUsIGVsbGlwc2lzOiB0cnVlLCBib3VuZGFyeUxpbmtzOiB0cnVlLCBpdGVtczogdG90YWxQYWdlcywgbWF4QnV0dG9uczogNSwgYWN0aXZlUGFnZTogcGFnZSwgb25TZWxlY3Q6IHBhZ2VIYW5kbGUgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgZmV0Y2hMYXRlc3ROZXdzIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvd2hhdHNuZXdcIjtcclxuaW1wb3J0IHsgV2hhdHNOZXdMaXN0IH0gZnJvbSBcIi4uL3doYXRzbmV3L1doYXRzTmV3TGlzdFwiO1xyXG5pbXBvcnQgeyBGb3J1bUhlYWRlciwgRm9ydW1Cb2R5IH0gZnJvbSBcIi4vRm9ydW1Qb3N0XCI7XHJcbmltcG9ydCB7IEJ1dHRvbiwgQnV0dG9uVG9vbGJhciwgTW9kYWwsIFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSBcIi4uL3BhZ2luYXRpb24vUGFnaW5hdGlvblwiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXRlbXM6IHN0YXRlLndoYXRzTmV3SW5mby5pdGVtcyxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF0sXHJcbiAgICAgICAgc2tpcDogc3RhdGUud2hhdHNOZXdJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUud2hhdHNOZXdJbmZvLnRha2UsXHJcbiAgICAgICAgdG90YWxQYWdlczogc3RhdGUud2hhdHNOZXdJbmZvLnRvdGFsUGFnZXMsXHJcbiAgICAgICAgcGFnZTogc3RhdGUud2hhdHNOZXdJbmZvLnBhZ2UsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TGF0ZXN0OiAoc2tpcCwgdGFrZSkgPT4gZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKSxcclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFdoYXRzTmV3Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgcG9zdFByZXZpZXc6IG51bGwsXHJcbiAgICAgICAgICAgIGF1dGhvcjogbnVsbCxcclxuICAgICAgICAgICAgb246IG51bGxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucGFnZUhhbmRsZSA9IHRoaXMucGFnZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJldmlld1Bvc3QgPSB0aGlzLnByZXZpZXdQb3N0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZU1vZGFsID0gdGhpcy5jbG9zZU1vZGFsLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFZpZXcgPSB0aGlzLm1vZGFsVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubmF2aWdhdGVUbyA9IHRoaXMubmF2aWdhdGVUby5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgZ2V0TGF0ZXN0LCBwYWdlLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmIChwYWdlID09PSB0bylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHRvIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgZ2V0TGF0ZXN0KHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcbiAgICBwcmV2aWV3UG9zdChpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgeyBnZXRVc2VyIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IGdldFVzZXIoaXRlbS5BdXRob3JJRCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxyXG4gICAgICAgICAgICBwb3N0UHJldmlldzogaXRlbS5JdGVtLFxyXG4gICAgICAgICAgICBhdXRob3I6IGF1dGhvcixcclxuICAgICAgICAgICAgb246IGl0ZW0uT25cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG8odXJsKSB7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBwdXNoKHVybCk7XHJcbiAgICB9XHJcbiAgICBjbG9zZU1vZGFsKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBtb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBvc3RQcmV2aWV3OiBudWxsLFxyXG4gICAgICAgICAgICBhdXRob3I6IG51bGwsXHJcbiAgICAgICAgICAgIG9uOiBudWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBtb2RhbFZpZXcoKSB7XHJcbiAgICAgICAgaWYgKCFCb29sZWFuKHRoaXMuc3RhdGUucG9zdFByZXZpZXcpKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCB7IFRleHQsIFRpdGxlLCBJRCB9ID0gdGhpcy5zdGF0ZS5wb3N0UHJldmlldztcclxuICAgICAgICBjb25zdCBhdXRob3IgPSB0aGlzLnN0YXRlLmF1dGhvcjtcclxuICAgICAgICBjb25zdCBuYW1lID0gYCR7YXV0aG9yLkZpcnN0TmFtZX0gJHthdXRob3IuTGFzdE5hbWV9YDtcclxuICAgICAgICBjb25zdCBsaW5rID0gYGZvcnVtL3Bvc3QvJHtJRH0vY29tbWVudHNgO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLCB7IHNob3c6IHRoaXMuc3RhdGUubW9kYWwsIG9uSGlkZTogdGhpcy5jbG9zZU1vZGFsLCBic1NpemU6IFwibGFyZ2VcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkhlYWRlciwgeyBjbG9zZUJ1dHRvbjogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5UaXRsZSwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcnVtSGVhZGVyLCB7IGxnOiAxMSwgbGdPZmZzZXQ6IDEsIGNyZWF0ZWRPbjogdGhpcy5zdGF0ZS5vbiwgdGl0bGU6IFRpdGxlLCBuYW1lOiBuYW1lIH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1Cb2R5LCB7IHRleHQ6IFRleHQsIGxnOiAxMSwgbGdPZmZzZXQ6IDEgfSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkZvb3RlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbGJhciwgeyBzdHlsZTogeyBmbG9hdDogXCJyaWdodFwiIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgb25DbGljazogKCkgPT4gdGhpcy5uYXZpZ2F0ZVRvKGxpbmspIH0sIFwiU2Uga29tbWVudGFyZXIgKGZvcnVtKVwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0aGlzLmNsb3NlTW9kYWwgfSwgXCJMdWtcIikpKSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciwgdG90YWxQYWdlcywgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIG51bGwsIFwiU2lkc3RlIGhcXHUwMEU2bmRlbHNlclwiKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdMaXN0LCB7IGl0ZW1zOiBpdGVtcywgZ2V0VXNlcjogZ2V0VXNlciwgcHJldmlldzogdGhpcy5wcmV2aWV3UG9zdCB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbiwgeyB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzLCBwYWdlOiBwYWdlLCBwYWdlSGFuZGxlOiB0aGlzLnBhZ2VIYW5kbGUgfSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsVmlldygpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgV2hhdHNOZXcgPSB3aXRoUm91dGVyKGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFdoYXRzTmV3Q29udGFpbmVyKSk7XHJcbmV4cG9ydCBkZWZhdWx0IFdoYXRzTmV3O1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgSnVtYm90cm9uLCBHcmlkLCBSb3csIENvbCwgUGFuZWwsIEFsZXJ0IH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IGZldGNoTGF0ZXN0TmV3cyB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL3doYXRzbmV3XCI7XHJcbmltcG9ydCB7IEltYWdlVXBsb2FkIH0gZnJvbSBcIi4uL2ltYWdlcy9JbWFnZVVwbG9hZFwiO1xyXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2ltYWdlc1wiO1xyXG5pbXBvcnQgVXNlZFNwYWNlIGZyb20gXCIuL1VzZWRTcGFjZVwiO1xyXG5pbXBvcnQgV2hhdHNOZXcgZnJvbSBcIi4vV2hhdHNOZXdcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW3N0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkXTtcclxuICAgIGNvbnN0IG5hbWUgPSB1c2VyID8gdXNlci5GaXJzdE5hbWUgOiBcIlVzZXJcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICBza2lwOiBzdGF0ZS53aGF0c05ld0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS53aGF0c05ld0luZm8udGFrZVxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwbG9hZEltYWdlOiAoc2tpcCwgdGFrZSwgdXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvblN1Y2Nlc3MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChmZXRjaExhdGVzdE5ld3Moc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkaXNwYXRjaCh1cGxvYWRJbWFnZSh1c2VybmFtZSwgZGVzY3JpcHRpb24sIGZvcm1EYXRhLCBvblN1Y2Nlc3MsIChyKSA9PiB7IGNvbnNvbGUubG9nKHIpOyB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgSG9tZUNvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICByZWNvbW1lbmRlZDogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy51cGxvYWQgPSB0aGlzLnVwbG9hZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVjb21tZW5kZWRWaWV3ID0gdGhpcy5yZWNvbW1lbmRlZFZpZXcuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJGb3JzaWRlXCI7XHJcbiAgICB9XHJcbiAgICB1cGxvYWQodXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBsb2FkSW1hZ2UsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgdXBsb2FkSW1hZ2Uoc2tpcCwgdGFrZSwgdXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSk7XHJcbiAgICB9XHJcbiAgICByZWNvbW1lbmRlZFZpZXcoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnJlY29tbWVuZGVkKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBbGVydCwgeyBic1N0eWxlOiBcInN1Y2Nlc3NcIiwgb25EaXNtaXNzOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgcmVjb21tZW5kZWQ6IGZhbHNlIH0pIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIG51bGwsIFwiQW5iZWZhbGluZ2VyXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGVzdGV0IG1lZCBHb29nbGUgQ2hyb21lIGJyb3dzZXIuIERlcmZvciBlciBkZXQgYW5iZWZhbGV0IGF0IGJydWdlIGRlbm5lIHRpbCBhdCBmXFx1MDBFNSBkZW4gZnVsZGUgb3BsZXZlbHNlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpKSkpKSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChKdW1ib3Ryb24sIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlZlbGtvbW1lbiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIhXCIpKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJsZWFkXCIgfSwgXCJUaWwgSW51cGxhbnMgZm9ydW0gb2cgYmlsbGVkLWFya2l2IHNpZGVcIiksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhbmVsLCB7IGhlYWRlcjogXCJEdSBrYW4gdXBsb2FkZSBiaWxsZWRlciB0aWwgZGl0IGVnZXQgZ2FsbGVyaSBoZXJcIiwgYnNTdHlsZTogXCJwcmltYXJ5XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2VVcGxvYWQsIHsgdXNlcm5hbWU6IGdsb2JhbHMuY3VycmVudFVzZXJuYW1lLCB1cGxvYWRJbWFnZTogdGhpcy51cGxvYWQgfSkpKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdyaWQsIHsgZmx1aWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA0IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXcsIG51bGwpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMSwgbGc6IDMgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNvbW1lbmRlZFZpZXcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIG51bGwsIFwiUGVyc29ubGlnIHVwbG9hZCBmb3JicnVnXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIFwiSGVydW5kZXIga2FuIGR1IHNlIGh2b3IgbWVnZXQgcGxhZHMgZHUgaGFyIGJydWd0IG9nIGh2b3IgbWVnZXQgZnJpIHBsYWRzXCIgKyBcIiBcIiArIFwiZGVyIGVyIHRpbGJhZ2UuIEdcXHUwMEU2bGRlciBrdW4gYmlsbGVkZSBmaWxlci5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlZFNwYWNlLCBudWxsKSkpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgSG9tZSA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEhvbWVDb250YWluZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBIb21lO1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcnVtIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRm9ydW0gXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsIFwiaW5kbFxcdTAwRTZnXCIpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4pKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIEdseXBoaWNvbiwgT3ZlcmxheVRyaWdnZXIsIFRvb2x0aXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IGdldFdvcmRzIH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5leHBvcnQgY2xhc3MgRm9ydW1UaXRsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBkYXRlVmlldyhkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZGF5TW9udGhZZWFyID0gbW9tZW50KGRhdGUpLmZvcm1hdChcIkQvTU0vWVlcIik7XHJcbiAgICAgICAgcmV0dXJuIGAke2RheU1vbnRoWWVhcn1gO1xyXG4gICAgfVxyXG4gICAgbW9kaWZpZWRWaWV3KG1vZGlmaWVkT24pIHtcclxuICAgICAgICBpZiAoIW1vZGlmaWVkT24pXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkRGF0ZSA9IG1vbWVudChtb2RpZmllZE9uKS5mb3JtYXQoXCJEL01NL1lZLUg6bW1cIik7XHJcbiAgICAgICAgcmV0dXJuIGAke21vZGlmaWVkRGF0ZX1gO1xyXG4gICAgfVxyXG4gICAgdG9vbHRpcFZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9vbHRpcCwgeyBpZDogXCJ0b29sdGlwXCIgfSwgXCJWaWd0aWdcIik7XHJcbiAgICB9XHJcbiAgICBzdGlja3lJY29uKHNob3cpIHtcclxuICAgICAgICBpZiAoIXNob3cpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJzdGlja3lcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE92ZXJsYXlUcmlnZ2VyLCB7IHBsYWNlbWVudDogXCJ0b3BcIiwgb3ZlcmxheTogdGhpcy50b29sdGlwVmlldygpIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJwdXNocGluXCIgfSkpKTtcclxuICAgIH1cclxuICAgIGRhdGVNb2RpZmllZFZpZXcodGl0bGUpIHtcclxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5kYXRlVmlldyh0aXRsZS5DcmVhdGVkT24pO1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWQgPSB0aGlzLm1vZGlmaWVkVmlldyh0aXRsZS5MYXN0TW9kaWZpZWQpO1xyXG4gICAgICAgIGlmICghdXBkYXRlZClcclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIGNyZWF0ZWQpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLFxyXG4gICAgICAgICAgICBjcmVhdGVkLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgIFwiKFwiLFxyXG4gICAgICAgICAgICB1cGRhdGVkLFxyXG4gICAgICAgICAgICBcIilcIik7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVTdW1tYXJ5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCF0aXRsZS5MYXRlc3RDb21tZW50KVxyXG4gICAgICAgICAgICByZXR1cm4gXCJJbmdlbiBrb21tZW50YXJlclwiO1xyXG4gICAgICAgIGlmICh0aXRsZS5MYXRlc3RDb21tZW50LkRlbGV0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBcIktvbW1lbnRhciBzbGV0dGV0XCI7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRpdGxlLkxhdGVzdENvbW1lbnQuVGV4dDtcclxuICAgICAgICByZXR1cm4gZ2V0V29yZHModGV4dCwgNSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgZ2V0QXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBnZXRBdXRob3IodGl0bGUuQXV0aG9ySUQpO1xyXG4gICAgICAgIGNvbnN0IGxhdGVzdENvbW1lbnQgPSB0aGlzLmNyZWF0ZVN1bW1hcnkoKTtcclxuICAgICAgICBjb25zdCBjc3MgPSB0aXRsZS5TdGlja3kgPyBcInRocmVhZCB0aHJlYWQtcGlubmVkXCIgOiBcInRocmVhZFwiO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBgL2ZvcnVtL3Bvc3QvJHt0aXRsZS5JRH0vY29tbWVudHNgO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IHBhdGggfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsgY2xhc3NOYW1lOiBjc3MgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxLCBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LCB0aGlzLnN0aWNreUljb24odGl0bGUuU3RpY2t5KSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LWNhcGl0YWxpemVcIiB9LCB0aXRsZS5UaXRsZSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFmOiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIsIGNsYXNzTmFtZTogXCJ0ZXh0LWxlZnRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIHRoaXMuZGF0ZU1vZGlmaWVkVmlldyh0aXRsZSkpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyLCBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIHRpdGxlLlZpZXdlZEJ5Lmxlbmd0aCkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIsIGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCwgbGF0ZXN0Q29tbWVudCkpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBCdXR0b25Hcm91cCwgQnV0dG9uIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBGb3J1bVRpdGxlIH0gZnJvbSBcIi4uL2ZvcnVtL0ZvcnVtVGl0bGVcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBmZXRjaFRocmVhZHMsIHBvc3RUaHJlYWQgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9mb3J1bVwiO1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSBcIi4uL3BhZ2luYXRpb24vUGFnaW5hdGlvblwiO1xyXG5pbXBvcnQgeyBGb3J1bUZvcm0gfSBmcm9tIFwiLi4vZm9ydW0vRm9ydW1Gb3JtXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0aHJlYWRzOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby50aXRsZXMsXHJcbiAgICAgICAgc2tpcDogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby50YWtlLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnBhZ2UsXHJcbiAgICAgICAgdG90YWxQYWdlczogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8udG90YWxQYWdlcyxcclxuICAgICAgICBnZXRBdXRob3I6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW2lkXTtcclxuICAgICAgICAgICAgcmV0dXJuIGAke3VzZXIuRmlyc3ROYW1lfSAke3VzZXIuTGFzdE5hbWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZldGNoVGhyZWFkczogKHNraXAsIHRha2UpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hUaHJlYWRzKHNraXAsIHRha2UpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RUaHJlYWQ6IChjYiwgcG9zdCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0VGhyZWFkKHBvc3QsIGNiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgRm9ydW1MaXN0Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5ld1Bvc3Q6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBcIkludXBsYW4gRm9ydW1cIjtcclxuICAgIH1cclxuICAgIHBhZ2VIYW5kbGUodG8pIHtcclxuICAgICAgICBjb25zdCB7IGZldGNoVGhyZWFkcywgcGFnZSwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAocGFnZSA9PT0gdG8pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAodG8gLSAxKSAqIHRha2U7XHJcbiAgICAgICAgZmV0Y2hUaHJlYWRzKHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcbiAgICB0aHJlYWRWaWV3cygpIHtcclxuICAgICAgICBjb25zdCB7IHRocmVhZHMsIGdldEF1dGhvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gdGhyZWFkcy5tYXAodGhyZWFkID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSBgdGhyZWFkXyR7dGhyZWFkLklEfWA7XHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcnVtVGl0bGUsIHsgdGl0bGU6IHRocmVhZCwga2V5OiBpZCwgZ2V0QXV0aG9yOiBnZXRBdXRob3IgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdWJtaXQocG9zdCkge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdFRocmVhZCwgZmV0Y2hUaHJlYWRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHBvc3RUaHJlYWQoKCkgPT4gZmV0Y2hUaHJlYWRzKHNraXAsIHRha2UpLCBwb3N0KTtcclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBuZXdQb3N0OiBmYWxzZSB9KTtcclxuICAgIH1cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5ld1Bvc3Q6IHRydWUgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBwYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Hcm91cCwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCBvbkNsaWNrOiB0aGlzLnNob3cuYmluZCh0aGlzKSB9LCBcIlRpbGZcXHUwMEY4aiBueXQgaW5kbFxcdTAwRTZnXCIpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEyIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBjbGFzc05hbWU6IFwidGhyZWFkLWhlYWRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJJbmZvXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiT3ZlcnNrcmlmdFwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIsIGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJEYXRvXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMiwgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBcIkxcXHUwMEU2c3QgYWZcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyLCBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiU2VuZXN0ZSBrb21tZW50YXJcIikpKSxcclxuICAgICAgICAgICAgICAgIHRoaXMudGhyZWFkVmlld3MoKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbiwgeyB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzLCBwYWdlOiBwYWdlLCBwYWdlSGFuZGxlOiB0aGlzLnBhZ2VIYW5kbGUsIHNob3c6IHRydWUgfSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcnVtRm9ybSwgeyBzaG93OiB0aGlzLnN0YXRlLm5ld1Bvc3QsIGNsb3NlOiB0aGlzLmNsb3NlLmJpbmQodGhpcyksIG9uU3VibWl0OiB0aGlzLnN1Ym1pdC5iaW5kKHRoaXMpIH0pKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBGb3J1bUxpc3QgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShGb3J1bUxpc3RDb250YWluZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBGb3J1bUxpc3Q7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBNZWRpYSwgR2x5cGhpY29uIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgQ29tbWVudERlbGV0ZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbGllcywgY29uc3RydWN0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSByZXBsaWVzLm1hcChyZXBseSA9PiBjb25zdHJ1Y3QocmVwbHkpKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYSwgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MZWZ0LCB7IGNsYXNzTmFtZTogXCJjb21tZW50LWRlbGV0ZWQtbGVmdFwiIH0pLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LW11dGVkIGNvbW1lbnQtZGVsZXRlZFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicmVtb3ZlLXNpZ25cIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIgS29tbWVudGFyIHNsZXR0ZXRcIikpLFxyXG4gICAgICAgICAgICAgICAgcmVwbHlOb2RlcykpO1xyXG4gICAgfVxyXG59XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBDb21tZW50Q29udHJvbHMgfSBmcm9tIFwiLi9Db21tZW50Q29udHJvbHNcIjtcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tIFwiLi9Db21tZW50UHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCB0aW1lVGV4dCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFnbygpIHtcclxuICAgICAgICBjb25zdCB7IHBvc3RlZE9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB0aW1lVGV4dChwb3N0ZWRPbik7XHJcbiAgICB9XHJcbiAgICBlZGl0ZWRWaWV3KGVkaXRlZCkge1xyXG4gICAgICAgIGlmICghZWRpdGVkKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgXCIqXCIpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgY29udGV4dElkLCBuYW1lLCB0ZXh0LCBjb21tZW50SWQsIHJlcGxpZXMsIGNvbnN0cnVjdCwgYXV0aG9ySWQsIGVkaXRlZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfTtcclxuICAgICAgICBjb25zdCB0eHQgPSBmb3JtYXRUZXh0KHRleHQpO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSByZXBsaWVzLm1hcChyZXBseSA9PiBjb25zdHJ1Y3QocmVwbHkpKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYSwgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50UHJvZmlsZSwgbnVsbCksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNVwiLCB7IGNsYXNzTmFtZTogXCJtZWRpYS1oZWFkaW5nXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIG5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNhZ2RlIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFnbygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRlZFZpZXcoZWRpdGVkKSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBkYW5nZXJvdXNseVNldElubmVySFRNTDogdHh0IH0pLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50Q29udHJvbHMsIF9fYXNzaWduKHsgY29udGV4dElkOiBjb250ZXh0SWQsIGNhbkVkaXQ6IGNhbkVkaXQsIGF1dGhvcklkOiBhdXRob3JJZCwgY29tbWVudElkOiBjb21tZW50SWQsIHRleHQ6IHRleHQgfSwgcHJvcHMpKSxcclxuICAgICAgICAgICAgICAgIHJlcGx5Tm9kZXMpKTtcclxuICAgIH1cclxufVxyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudERlbGV0ZWQgfSBmcm9tIFwiLi9Db21tZW50RGVsZXRlZFwiO1xyXG5pbXBvcnQgeyBDb21tZW50IH0gZnJvbSBcIi4vQ29tbWVudFwiO1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIENvbW1lbnRMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuY29uc3RydWN0Q29tbWVudCA9IHRoaXMuY29uc3RydWN0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcm9vdENvbW1lbnRzKGNvbW1lbnRzKSB7XHJcbiAgICAgICAgaWYgKCFjb21tZW50cylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGNvbW1lbnRzLm1hcCgoY29tbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5jb25zdHJ1Y3RDb21tZW50KGNvbW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MaXN0SXRlbSwgeyBrZXk6IFwicm9vdENvbW1lbnRfXCIgKyBjb21tZW50LkNvbW1lbnRJRCB9LCBub2RlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdENvbW1lbnQoY29tbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IFwiY29tbWVudElkXCIgKyBjb21tZW50LkNvbW1lbnRJRDtcclxuICAgICAgICBpZiAoY29tbWVudC5EZWxldGVkKVxyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50RGVsZXRlZCwgeyBrZXk6IGtleSwgY29uc3RydWN0OiB0aGlzLmNvbnN0cnVjdENvbW1lbnQsIHJlcGxpZXM6IGNvbW1lbnQuUmVwbGllcyB9KTtcclxuICAgICAgICBjb25zdCB7IGNvbnRleHRJZCwgZ2V0TmFtZSwgY2FuRWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY29udHJvbHMgPSB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfTtcclxuICAgICAgICBjb25zdCBuYW1lID0gZ2V0TmFtZShjb21tZW50LkF1dGhvcklEKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50LCBfX2Fzc2lnbih7IGtleToga2V5LCBjb250ZXh0SWQ6IGNvbnRleHRJZCwgbmFtZTogbmFtZSwgcG9zdGVkT246IGNvbW1lbnQuUG9zdGVkT24sIGF1dGhvcklkOiBjb21tZW50LkF1dGhvcklELCB0ZXh0OiBjb21tZW50LlRleHQsIGNvbnN0cnVjdDogdGhpcy5jb25zdHJ1Y3RDb21tZW50LCByZXBsaWVzOiBjb21tZW50LlJlcGxpZXMsIGVkaXRlZDogY29tbWVudC5FZGl0ZWQsIGNhbkVkaXQ6IGNhbkVkaXQsIGNvbW1lbnRJZDogY29tbWVudC5Db21tZW50SUQgfSwgY29udHJvbHMpKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5yb290Q29tbWVudHMoY29tbWVudHMpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3QsIG51bGwsIG5vZGVzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuZXhwb3J0IGNsYXNzIENvbW1lbnRGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIFRleHQ6IFwiXCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucG9zdENvbW1lbnQgPSB0aGlzLnBvc3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwb3N0Q29tbWVudChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwb3N0SGFuZGxlKHRoaXMuc3RhdGUuVGV4dCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IFwiXCIgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIHsgb25TdWJtaXQ6IHRoaXMucG9zdENvbW1lbnQgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHsgaHRtbEZvcjogXCJyZW1hcmtcIiB9LCBcIktvbW1lbnRhclwiKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIsIHsgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLCB2YWx1ZTogdGhpcy5zdGF0ZS5UZXh0LCBwbGFjZWhvbGRlcjogXCJTa3JpdiBrb21tZW50YXIgaGVyLi4uXCIsIGlkOiBcInJlbWFya1wiLCByb3dzOiA0IH0pLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyB0eXBlOiBcInN1Ym1pdFwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCIgfSwgXCJTZW5kXCIpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBmZXRjaCBmcm9tIFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5pbXBvcnQgeyBvcHRpb25zLCBub3JtYWxpemVDb21tZW50LCByZXNwb25zZUhhbmRsZXIgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmV4cG9ydCBjb25zdCBzZXRTa2lwQ29tbWVudHMgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzNCxcclxuICAgICAgICBwYXlsb2FkOiBza2lwXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RGVmYXVsdFNraXAgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDM1XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RGVmYXVsdFRha2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDM2XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VGFrZUNvbW1lbnRzID0gKHRha2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzcsXHJcbiAgICAgICAgcGF5bG9hZDogdGFrZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEN1cnJlbnRQYWdlID0gKHBhZ2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzgsXHJcbiAgICAgICAgcGF5bG9hZDogcGFnZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRvdGFsUGFnZXMgPSAodG90YWxQYWdlcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzOSxcclxuICAgICAgICBwYXlsb2FkOiB0b3RhbFBhZ2VzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RGVmYXVsdENvbW1lbnRzID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA0MFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVkQ29tbWVudHMgPSAoY29tbWVudHMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNDEsXHJcbiAgICAgICAgcGF5bG9hZDogY29tbWVudHNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBhZGRDb21tZW50ID0gKGNvbW1lbnQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNDIsXHJcbiAgICAgICAgcGF5bG9hZDogW2NvbW1lbnRdXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0Rm9jdXNlZENvbW1lbnQgPSAoY29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDQzLFxyXG4gICAgICAgIHBheWxvYWQ6IGNvbW1lbnRJZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG5ld0NvbW1lbnRGcm9tU2VydmVyID0gKGNvbW1lbnQpID0+IHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZSA9IG5vcm1hbGl6ZUNvbW1lbnQoY29tbWVudCk7XHJcbiAgICByZXR1cm4gYWRkQ29tbWVudChub3JtYWxpemUpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hDb21tZW50cyA9ICh1cmwsIHNraXAsIHRha2UpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFnZUNvbW1lbnRzID0gZGF0YS5DdXJyZW50SXRlbXM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNraXBDb21tZW50cyhza2lwKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2VDb21tZW50cyh0YWtlKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEN1cnJlbnRQYWdlKGRhdGEuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxQYWdlcyhkYXRhLlRvdGFsUGFnZXMpKTtcclxuICAgICAgICAgICAgY29uc3QgY29tbWVudHMgPSBwYWdlQ29tbWVudHMubWFwKG5vcm1hbGl6ZUNvbW1lbnQpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlZENvbW1lbnRzKGNvbW1lbnRzKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgcG9zdENvbW1lbnQgPSAodXJsLCBjb250ZXh0SWQsIHRleHQsIHBhcmVudENvbW1lbnRJZCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoXykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBUZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICBDb250ZXh0SUQ6IGNvbnRleHRJZCxcclxuICAgICAgICAgICAgUGFyZW50SUQ6IHBhcmVudENvbW1lbnRJZFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgYm9keTogYm9keSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGVkaXRDb21tZW50ID0gKHVybCwgY29tbWVudElkLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgcmV0dXJuIChfKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IElEOiBjb21tZW50SWQsIFRleHQ6IHRleHQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGNiKTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBkZWxldGVDb21tZW50ID0gKHVybCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoXykgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50c30vR2V0U2luZ2xlP2lkPSR7aWR9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihjID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IG5vcm1hbGl6ZUNvbW1lbnQoYyk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVkQ29tbWVudHMoW2NvbW1lbnRdKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEZvY3VzZWRDb21tZW50KGNvbW1lbnQuQ29tbWVudElEKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudExpc3QgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudExpc3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudEZvcm0gfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudEZvcm1cIjtcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gXCIuLi9wYWdpbmF0aW9uL1BhZ2luYXRpb25cIjtcclxuaW1wb3J0IHsgZmV0Y2hDb21tZW50cywgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvY29tbWVudHNcIjtcclxuaW1wb3J0IHsgZ2V0Rm9ydW1Db21tZW50c0RlbGV0ZVVybCwgZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb21tZW50czogc3RhdGUuY29tbWVudHNJbmZvLmNvbW1lbnRzLFxyXG4gICAgICAgIGdldE5hbWU6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW2lkXTtcclxuICAgICAgICAgICAgaWYgKCF1c2VyKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09PSBpZCxcclxuICAgICAgICBwb3N0SWQ6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnNlbGVjdGVkVGhyZWFkLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLmNvbW1lbnRzSW5mby5wYWdlLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmNvbW1lbnRzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmNvbW1lbnRzSW5mby50YWtlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLmNvbW1lbnRzSW5mby50b3RhbFBhZ2VzLFxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGVkaXRIYW5kbGU6IChjb21tZW50SWQsIF8sIHRleHQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChlZGl0Q29tbWVudCh1cmwsIGNvbW1lbnRJZCwgdGV4dCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZTogKGNvbW1lbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0Rm9ydW1Db21tZW50c0RlbGV0ZVVybChjb21tZW50SWQpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVDb21tZW50KHVybCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcGx5SGFuZGxlOiAocG9zdElkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgcG9zdElkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvYWRDb21tZW50czogKHBvc3RJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybChwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdEhhbmRsZTogKHBvc3RJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgcG9zdElkLCB0ZXh0LCBudWxsLCBjYikpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIEZvcnVtQ29tbWVudHNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDb21tZW50ID0gdGhpcy5kZWxldGVDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5lZGl0Q29tbWVudCA9IHRoaXMuZWRpdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlcGx5Q29tbWVudCA9IHRoaXMucmVwbHlDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5wb3N0Q29tbWVudCA9IHRoaXMucG9zdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIHBvc3RJZCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHBhZ2UgfSA9IG5leHRQcm9wcy5sb2NhdGlvbi5xdWVyeTtcclxuICAgICAgICBpZiAoIU51bWJlcihwYWdlKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHBhZ2UgLSAxO1xyXG4gICAgICAgIGNvbnN0IHNraXBJdGVtcyA9IChza2lwUGFnZXMgKiB0YWtlKTtcclxuICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdElkLCBwYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgaWYgKHBhZ2UgPT09IHRvKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdXJsID0gYC9mb3J1bS9wb3N0LyR7cG9zdElkfS9jb21tZW50cz9wYWdlPSR7dG99YDtcclxuICAgICAgICBwdXNoKHVybCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGVDb21tZW50KGNvbW1lbnRJZCwgcG9zdElkKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVIYW5kbGUsIGxvYWRDb21tZW50cywgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKHBvc3RJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkZWxldGVIYW5kbGUoY29tbWVudElkLCBjYik7XHJcbiAgICB9XHJcbiAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIHBvc3RJZCwgdGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdEhhbmRsZSwgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGVkaXRIYW5kbGUoY29tbWVudElkLCBwb3N0SWQsIHRleHQsIGNiKTtcclxuICAgIH1cclxuICAgIHJlcGx5Q29tbWVudChwb3N0SWQsIHRleHQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSwgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcGx5SGFuZGxlKHBvc3RJZCwgdGV4dCwgcGFyZW50SWQsIGNiKTtcclxuICAgIH1cclxuICAgIHBvc3RDb21tZW50KHRleHQpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgcG9zdElkLCBza2lwLCB0YWtlLCBwb3N0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHBvc3RIYW5kbGUocG9zdElkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50cywgZ2V0TmFtZSwgY2FuRWRpdCwgdG90YWxQYWdlcywgcGFnZSwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGlkIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCBjb250cm9scyA9IHtcclxuICAgICAgICAgICAgc2tpcCxcclxuICAgICAgICAgICAgdGFrZSxcclxuICAgICAgICAgICAgZGVsZXRlQ29tbWVudDogdGhpcy5kZWxldGVDb21tZW50LFxyXG4gICAgICAgICAgICBlZGl0Q29tbWVudDogdGhpcy5lZGl0Q29tbWVudCxcclxuICAgICAgICAgICAgcmVwbHlDb21tZW50OiB0aGlzLnJlcGx5Q29tbWVudFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCB7IGNsYXNzTmFtZTogXCJmb3J1bS1jb21tZW50cy1saXN0XCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIHsgY2xhc3NOYW1lOiBcImZvcnVtLWNvbW1lbnRzLWhlYWRpbmdcIiB9LCBcIktvbW1lbnRhcmVyXCIpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRMaXN0LCBfX2Fzc2lnbih7IGNvbW1lbnRzOiBjb21tZW50cywgY29udGV4dElkOiBOdW1iZXIoaWQpLCBnZXROYW1lOiBnZXROYW1lLCBjYW5FZGl0OiBjYW5FZGl0IH0sIGNvbnRyb2xzKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbiwgeyB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzLCBwYWdlOiBwYWdlLCBwYWdlSGFuZGxlOiB0aGlzLnBhZ2VIYW5kbGUgfSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEyIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudEZvcm0sIHsgcG9zdEhhbmRsZTogdGhpcy5wb3N0Q29tbWVudCB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCkpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgRm9ydW1Db21tZW50c0NvbnRhaW5lclJlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRm9ydW1Db21tZW50c0NvbnRhaW5lcik7XHJcbmNvbnN0IEZvcnVtQ29tbWVudHMgPSB3aXRoUm91dGVyKEZvcnVtQ29tbWVudHNDb250YWluZXJSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IEZvcnVtQ29tbWVudHM7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgUGFuZWwgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBVc2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lLCBmaXJzdE5hbWUsIGxhc3ROYW1lLCBlbWFpbCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBlbWFpbExpbmsgPSBcIm1haWx0bzpcIiArIGVtYWlsO1xyXG4gICAgICAgIGNvbnN0IGdhbGxlcnkgPSBcIi9cIiArIHVzZXJuYW1lICsgXCIvZ2FsbGVyeVwiO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMyB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhbmVsLCB7IGhlYWRlcjogYCR7Zmlyc3ROYW1lfSAke2xhc3ROYW1lfWAgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckl0ZW0sIHsgdGl0bGU6IFwiQnJ1Z2VybmF2blwiIH0sIHVzZXJuYW1lKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckl0ZW0sIHsgdGl0bGU6IFwiRW1haWxcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogZW1haWxMaW5rIH0sIGVtYWlsKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXJJdGVtLCB7IHRpdGxlOiBcIkJpbGxlZGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IGdhbGxlcnkgfSwgXCJCaWxsZWRlclwiKSkpKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBVc2VySGVhZGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA2IH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgdGhpcy5wcm9wcy5jaGlsZHJlbikpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIFVzZXJCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDYgfSwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgVXNlckl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXJIZWFkaW5nLCBudWxsLCB0aXRsZSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckJvZHksIG51bGwsIHRoaXMucHJvcHMuY2hpbGRyZW4pKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuL1VzZXJcIjtcclxuaW1wb3J0IHsgUm93IH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgVXNlckxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgdXNlck5vZGVzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VySWQgPSBgdXNlcklkXyR7dXNlci5JRH1gO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChVc2VyLCB7IHVzZXJuYW1lOiB1c2VyLlVzZXJuYW1lLCB1c2VySWQ6IHVzZXIuSUQsIGZpcnN0TmFtZTogdXNlci5GaXJzdE5hbWUsIGxhc3ROYW1lOiB1c2VyLkxhc3ROYW1lLCBlbWFpbDogdXNlci5FbWFpbCwgcHJvZmlsZVVybDogdXNlci5Qcm9maWxlSW1hZ2UsIHJvbGVzOiB1c2VyLlJvbGUsIGtleTogdXNlcklkIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCwgdGhpcy51c2VyTm9kZXMoKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmV4cG9ydCBjbGFzcyBCcmVhZGNydW1iIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcIm9sXCIsIHsgY2xhc3NOYW1lOiBcImJyZWFkY3J1bWJcIiB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgIH1cclxufVxyXG4oZnVuY3Rpb24gKEJyZWFkY3J1bWIpIHtcclxuICAgIGNsYXNzIEl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgICAgIHJlbmRlcigpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBocmVmLCBhY3RpdmUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIGlmIChhY3RpdmUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHsgY2xhc3NOYW1lOiBcImFjdGl2ZVwiIH0sIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IGhyZWYgfSwgdGhpcy5wcm9wcy5jaGlsZHJlbikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEJyZWFkY3J1bWIuSXRlbSA9IEl0ZW07XHJcbn0pKEJyZWFkY3J1bWIgfHwgKEJyZWFkY3J1bWIgPSB7fSkpO1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBmZXRjaFVzZXJzIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvdXNlcnNcIjtcclxuaW1wb3J0IHsgVXNlckxpc3QgfSBmcm9tIFwiLi4vdXNlcnMvVXNlckxpc3RcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIFBhZ2VIZWFkZXIgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IEJyZWFkY3J1bWIgfSBmcm9tIFwiLi4vYnJlYWRjcnVtYnMvQnJlYWRjcnVtYlwiO1xyXG5pbXBvcnQgeyB2YWx1ZXMgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5jb25zdCBtYXBVc2Vyc1RvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlcnM6IHZhbHVlcyhzdGF0ZS51c2Vyc0luZm8udXNlcnMpXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0VXNlcnM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hVc2VycygpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBVc2Vyc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiQnJ1Z2VyZVwiO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLkl0ZW0sIHsgaHJlZjogXCIvXCIgfSwgXCJGb3JzaWRlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIuSXRlbSwgeyBhY3RpdmU6IHRydWUgfSwgXCJCcnVnZXJlXCIpKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnZUhlYWRlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcIkludXBsYW4ncyBcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic21hbGxcIiwgbnVsbCwgXCJicnVnZXJlXCIpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckxpc3QsIHsgdXNlcnM6IHVzZXJzIH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IFVzZXJzID0gY29ubmVjdChtYXBVc2Vyc1RvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlcnNDb250YWluZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBVc2VycztcclxuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufTtcclxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBJbWFnZSBhcyBJbWFnZUJzIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEhhbmRsZXIgPSB0aGlzLmNoZWNrYm94SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY2hlY2tib3hIYW5kbGVyKGUpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGFkZCA9IGUuY3VycmVudFRhcmdldC5jaGVja2VkO1xyXG4gICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29tbWVudEljb24oY291bnQpIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IGNvdW50ID09PSAwID8gXCJjb2wtbGctNiB0ZXh0LW11dGVkXCIgOiBcImNvbC1sZy02IHRleHQtcHJpbWFyeVwiO1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0ge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IHN0eWxlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBfX2Fzc2lnbih7fSwgcHJvcHMpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJnbHlwaGljb24gZ2x5cGhpY29uLWNvbW1lbnRcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIiB9KSxcclxuICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgIGNvdW50KTtcclxuICAgIH1cclxuICAgIGNoZWNrYm94VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIGltYWdlSXNTZWxlY3RlZCwgaW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IGltYWdlSXNTZWxlY3RlZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICByZXR1cm4gKGNhbkVkaXQgP1xyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNiwgY2xhc3NOYW1lOiBcInB1bGwtcmlnaHQgdGV4dC1yaWdodFwiIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcIlNsZXQgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiLCBvbkNsaWNrOiB0aGlzLmNoZWNrYm94SGFuZGxlciwgY2hlY2tlZDogY2hlY2tlZCB9KSkpXHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY291bnQgPSBpbWFnZS5Db21tZW50Q291bnQ7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYC8ke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2UuSW1hZ2VJRH0vY29tbWVudHNgO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogdXJsIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlQnMsIHsgc3JjOiBpbWFnZS5QcmV2aWV3VXJsLCB0aHVtYm5haWw6IHRydWUgfSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogdXJsIH0sIHRoaXMuY29tbWVudEljb24oY291bnQpKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tib3hWaWV3KCkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwiLi9JbWFnZVwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuY29uc3QgZWxlbWVudHNQZXJSb3cgPSA0O1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZUxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgYXJyYW5nZUFycmF5KGltYWdlcykge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGltYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgdGltZXMgPSBNYXRoLmNlaWwobGVuZ3RoIC8gZWxlbWVudHNQZXJSb3cpO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICBsZXQgc3RhcnQgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGltZXM7IGkrKykge1xyXG4gICAgICAgICAgICBzdGFydCA9IGkgKiBlbGVtZW50c1BlclJvdztcclxuICAgICAgICAgICAgY29uc3QgZW5kID0gc3RhcnQgKyBlbGVtZW50c1BlclJvdztcclxuICAgICAgICAgICAgY29uc3QgbGFzdCA9IGVuZCA+IGxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGxhc3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGltYWdlcy5zbGljZShzdGFydCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gaW1hZ2VzLnNsaWNlKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgaW1hZ2VzVmlldyhpbWFnZXMpIHtcclxuICAgICAgICBpZiAoaW1hZ2VzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCwgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFycmFuZ2VBcnJheShpbWFnZXMpO1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSByZXN1bHQubWFwKChyb3csIGkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW1ncyA9IHJvdy5tYXAoKGltZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAzLCBrZXk6IGltZy5JbWFnZUlEIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbWFnZSwgeyBpbWFnZTogaW1nLCBjYW5FZGl0OiBjYW5FZGl0LCBhZGRTZWxlY3RlZEltYWdlSWQ6IGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkOiByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGltYWdlSXNTZWxlY3RlZDogaW1hZ2VJc1NlbGVjdGVkLCB1c2VybmFtZTogdXNlcm5hbWUgfSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3Qgcm93SWQgPSBcInJvd0lkXCIgKyBpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsga2V5OiByb3dJZCB9LCBpbWdzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsIHRoaXMuaW1hZ2VzVmlldyhpbWFnZXMpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSwgYWRkU2VsZWN0ZWRJbWFnZUlkLCBkZWxldGVJbWFnZXMsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCwgY2xlYXJTZWxlY3RlZEltYWdlSWRzLCBmZXRjaFVzZXJJbWFnZXMgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9pbWFnZXNcIjtcclxuaW1wb3J0IHsgSW1hZ2VVcGxvYWQgfSBmcm9tIFwiLi4vaW1hZ2VzL0ltYWdlVXBsb2FkXCI7XHJcbmltcG9ydCBJbWFnZUxpc3QgZnJvbSBcIi4uL2ltYWdlcy9JbWFnZUxpc3RcIjtcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gXCJ1bmRlcnNjb3JlXCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBCdXR0b24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IEJyZWFkY3J1bWIgfSBmcm9tIFwiLi4vYnJlYWRjcnVtYnMvQnJlYWRjcnVtYlwiO1xyXG5pbXBvcnQgeyB2YWx1ZXMgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgVXNlZFNwYWNlIGZyb20gXCIuL1VzZWRTcGFjZVwiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgb3duZXJJZCB9ID0gc3RhdGUuaW1hZ2VzSW5mbztcclxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkO1xyXG4gICAgY29uc3QgY2FuRWRpdCA9IChvd25lcklkID4gMCAmJiBjdXJyZW50SWQgPiAwICYmIG93bmVySWQgPT09IGN1cnJlbnRJZCk7XHJcbiAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW293bmVySWRdO1xyXG4gICAgY29uc3QgZnVsbE5hbWUgPSB1c2VyID8gYCR7dXNlci5GaXJzdE5hbWV9ICR7dXNlci5MYXN0TmFtZX1gIDogXCJcIjtcclxuICAgIGNvbnN0IGltYWdlcyA9IHZhbHVlcyhzdGF0ZS5pbWFnZXNJbmZvLmltYWdlcykucmV2ZXJzZSgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbWFnZXM6IGltYWdlcyxcclxuICAgICAgICBjYW5FZGl0OiBjYW5FZGl0LFxyXG4gICAgICAgIHNlbGVjdGVkSW1hZ2VJZHM6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkcyxcclxuICAgICAgICBmdWxsTmFtZTogZnVsbE5hbWUsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBsb2FkSW1hZ2U6ICh1c2VybmFtZSwgZGVzY3JpcHRpb24sIGZvcm1EYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwbG9hZEltYWdlKHVzZXJuYW1lLCBkZXNjcmlwdGlvbiwgZm9ybURhdGEsICgpID0+IHsgZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSk7IH0sICgpID0+IHsgfSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goYWRkU2VsZWN0ZWRJbWFnZUlkKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZW1vdmVTZWxlY3RlZEltYWdlSWQoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUltYWdlczogKHVzZXJuYW1lLCBpZHMpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBpZHMpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsZWFyU2VsZWN0ZWRJbWFnZUlkczogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgVXNlckltYWdlc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmltYWdlSXNTZWxlY3RlZCA9IHRoaXMuaW1hZ2VJc1NlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVTZWxlY3RlZEltYWdlcyA9IHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0ZWQgPSB0aGlzLmNsZWFyU2VsZWN0ZWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgcm91dGVyLCByb3V0ZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IHVzZXJuYW1lICsgXCIncyBiaWxsZWRlclwiO1xyXG4gICAgICAgIHJvdXRlci5zZXRSb3V0ZUxlYXZlSG9vayhyb3V0ZSwgdGhpcy5jbGVhclNlbGVjdGVkKTtcclxuICAgIH1cclxuICAgIGNsZWFyU2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjbGVhclNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY2xlYXJTZWxlY3RlZEltYWdlSWRzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBpbWFnZUlzU2VsZWN0ZWQoY2hlY2tJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXMgPSBmaW5kKHNlbGVjdGVkSW1hZ2VJZHMsIChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaWQgPT09IGNoZWNrSWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlcyA/IHRydWUgOiBmYWxzZTtcclxuICAgIH1cclxuICAgIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0ZWRJbWFnZUlkcywgZGVsZXRlSW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgc2VsZWN0ZWRJbWFnZUlkcyk7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGVkKCk7XHJcbiAgICB9XHJcbiAgICB1cGxvYWRWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgdXBsb2FkSW1hZ2UsIHNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgaGFzSW1hZ2VzID0gc2VsZWN0ZWRJbWFnZUlkcy5sZW5ndGggPiAwO1xyXG4gICAgICAgIGlmICghY2FuRWRpdClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNyB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbWFnZVVwbG9hZCwgeyB1cGxvYWRJbWFnZTogdXBsb2FkSW1hZ2UsIHVzZXJuYW1lOiB1c2VybmFtZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiXFx1MDBBMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwiZGFuZ2VyXCIsIGRpc2FibGVkOiAhaGFzSW1hZ2VzLCBvbkNsaWNrOiB0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzIH0sIFwiU2xldCBtYXJrZXJldCBiaWxsZWRlclwiKSkpKTtcclxuICAgIH1cclxuICAgIHVwbG9hZExpbWl0VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCFjYW5FZGl0KVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogMiB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVc2VkU3BhY2UsIG51bGwpKSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZXMsIGZ1bGxOYW1lLCBjYW5FZGl0LCBhZGRTZWxlY3RlZEltYWdlSWQsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIuSXRlbSwgeyBocmVmOiBcIi9cIiB9LCBcIkZvcnNpZGVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYi5JdGVtLCB7IGFjdGl2ZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIidzIGJpbGxlZGVyXCIpKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LWNhcGl0YWxpemVcIiB9LCBmdWxsTmFtZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiJ3MgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLCBcImJpbGxlZGUgZ2FsbGVyaVwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2VMaXN0LCB7IGltYWdlczogaW1hZ2VzLCBjYW5FZGl0OiBjYW5FZGl0LCBhZGRTZWxlY3RlZEltYWdlSWQ6IGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkOiByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGltYWdlSXNTZWxlY3RlZDogdGhpcy5pbWFnZUlzU2VsZWN0ZWQsIHVzZXJuYW1lOiB1c2VybmFtZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZFZpZXcoKSkpLFxyXG4gICAgICAgICAgICB0aGlzLnVwbG9hZExpbWl0VmlldygpLFxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBVc2VySW1hZ2VzUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2VySW1hZ2VzQ29udGFpbmVyKTtcclxuY29uc3QgVXNlckltYWdlcyA9IHdpdGhSb3V0ZXIoVXNlckltYWdlc1JlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgVXNlckltYWdlcztcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IHNldFNlbGVjdGVkSW1nLCBmZXRjaFNpbmdsZUltYWdlLCBkZWxldGVJbWFnZSB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2ltYWdlc1wiO1xyXG5pbXBvcnQgeyBzZXRTa2lwQ29tbWVudHMsIHNldFRha2VDb21tZW50cywgc2V0Rm9jdXNlZENvbW1lbnQsIHJlY2VpdmVkQ29tbWVudHMgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9jb21tZW50c1wiO1xyXG5pbXBvcnQgeyBzZXRFcnJvciB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2Vycm9yXCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuaW1wb3J0IHsgTW9kYWwsIEltYWdlLCBCdXR0b24sIEJ1dHRvblRvb2xiYXIsIEdseXBoaWNvbiB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBvd25lcklkID0gc3RhdGUuaW1hZ2VzSW5mby5vd25lcklkO1xyXG4gICAgY29uc3QgY3VycmVudElkID0gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQ7XHJcbiAgICBjb25zdCBjYW5FZGl0ID0gKG93bmVySWQgPiAwICYmIGN1cnJlbnRJZCA+IDAgJiYgb3duZXJJZCA9PT0gY3VycmVudElkKTtcclxuICAgIGNvbnN0IGdldEltYWdlID0gKGlkKSA9PiBzdGF0ZS5pbWFnZXNJbmZvLmltYWdlc1tpZF07XHJcbiAgICBjb25zdCBpbWFnZSA9ICgpID0+IGdldEltYWdlKHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkKTtcclxuICAgIGNvbnN0IGZpbGVuYW1lID0gKCkgPT4geyBpZiAoaW1hZ2UoKSlcclxuICAgICAgICByZXR1cm4gaW1hZ2UoKS5GaWxlbmFtZTsgcmV0dXJuIFwiXCI7IH07XHJcbiAgICBjb25zdCBwcmV2aWV3VXJsID0gKCkgPT4geyBpZiAoaW1hZ2UoKSlcclxuICAgICAgICByZXR1cm4gaW1hZ2UoKS5QcmV2aWV3VXJsOyByZXR1cm4gXCJcIjsgfTtcclxuICAgIGNvbnN0IGV4dGVuc2lvbiA9ICgpID0+IHsgaWYgKGltYWdlKCkpXHJcbiAgICAgICAgcmV0dXJuIGltYWdlKCkuRXh0ZW5zaW9uOyByZXR1cm4gXCJcIjsgfTtcclxuICAgIGNvbnN0IG9yaWdpbmFsVXJsID0gKCkgPT4geyBpZiAoaW1hZ2UoKSlcclxuICAgICAgICByZXR1cm4gaW1hZ2UoKS5PcmlnaW5hbFVybDsgcmV0dXJuIFwiXCI7IH07XHJcbiAgICBjb25zdCB1cGxvYWRlZCA9ICgpID0+IHsgaWYgKGltYWdlKCkpXHJcbiAgICAgICAgcmV0dXJuIGltYWdlKCkuVXBsb2FkZWQ7IHJldHVybiBuZXcgRGF0ZSgpOyB9O1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSAoKSA9PiB7IGlmIChpbWFnZSgpKVxyXG4gICAgICAgIHJldHVybiBpbWFnZSgpLkRlc2NyaXB0aW9uOyByZXR1cm4gXCJcIjsgfTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2FuRWRpdDogY2FuRWRpdCxcclxuICAgICAgICBoYXNJbWFnZTogKCkgPT4gQm9vbGVhbihnZXRJbWFnZShzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCkpLFxyXG4gICAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZSgpLFxyXG4gICAgICAgIHByZXZpZXdVcmw6IHByZXZpZXdVcmwoKSxcclxuICAgICAgICBleHRlbnNpb246IGV4dGVuc2lvbigpLFxyXG4gICAgICAgIG9yaWdpbmFsVXJsOiBvcmlnaW5hbFVybCgpLFxyXG4gICAgICAgIHVwbG9hZGVkOiB1cGxvYWRlZCgpLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbigpXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc2VsZWN0SW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcodW5kZWZpbmVkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRFcnJvcjogKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaEltYWdlOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hTaW5nbGVJbWFnZShpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2U6IChpZCwgdXNlcm5hbWUpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNldENvbW1lbnRzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNraXBDb21tZW50cygwKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2VDb21tZW50cygxMCkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRGb2N1c2VkQ29tbWVudCgtMSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlZENvbW1lbnRzKFtdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgTW9kYWxJbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUltYWdlSGFuZGxlciA9IHRoaXMuZGVsZXRlSW1hZ2VIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnNlZUFsbENvbW1lbnRzVmlldyA9IHRoaXMuc2VlQWxsQ29tbWVudHNWaWV3LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZWxvYWQgPSB0aGlzLnJlbG9hZC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZXNlbGVjdEltYWdlLCByZXNldENvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgZGVzZWxlY3RJbWFnZSgpO1xyXG4gICAgICAgIGNvbnN0IGdhbGxlcnlVcmwgPSBgLyR7dXNlcm5hbWV9L2dhbGxlcnlgO1xyXG4gICAgICAgIHJlc2V0Q29tbWVudHMoKTtcclxuICAgICAgICBwdXNoKGdhbGxlcnlVcmwpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlSW1hZ2VIYW5kbGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVsZXRlSW1hZ2UsIHNldFNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGlkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgZGVsZXRlSW1hZ2UoTnVtYmVyKGlkKSwgdXNlcm5hbWUpO1xyXG4gICAgICAgIHNldFNlbGVjdGVkSW1hZ2VJZCgtMSk7XHJcbiAgICB9XHJcbiAgICBkZWxldGVJbWFnZVZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghY2FuRWRpdClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwiZGFuZ2VyXCIsIG9uQ2xpY2s6IHRoaXMuZGVsZXRlSW1hZ2VIYW5kbGVyIH0sIFwiU2xldCBiaWxsZWRlXCIpO1xyXG4gICAgfVxyXG4gICAgcmVsb2FkKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpZH0vY29tbWVudHNgO1xyXG4gICAgICAgIHB1c2gocGF0aCk7XHJcbiAgICB9XHJcbiAgICBzZWVBbGxDb21tZW50c1ZpZXcoKSB7XHJcbiAgICAgICAgY29uc3Qgc2hvdyA9ICFCb29sZWFuKHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgICAgIGlmICghc2hvdylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgb25DbGljazogdGhpcy5yZWxvYWQgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcInJlZnJlc2hcIiB9KSxcclxuICAgICAgICAgICAgICAgIFwiIFNlIGFsbGUga29tbWVudGFyZXI/XCIpKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGZpbGVuYW1lLCBwcmV2aWV3VXJsLCBleHRlbnNpb24sIG9yaWdpbmFsVXJsLCB1cGxvYWRlZCwgaGFzSW1hZ2UsIGRlc2NyaXB0aW9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHNob3cgPSBoYXNJbWFnZSgpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBmaWxlbmFtZSArIFwiLlwiICsgZXh0ZW5zaW9uO1xyXG4gICAgICAgIGNvbnN0IHVwbG9hZERhdGUgPSBtb21lbnQodXBsb2FkZWQpO1xyXG4gICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBcIlVwbG9hZGVkIGQuIFwiICsgdXBsb2FkRGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKSArIFwia2wuIFwiICsgdXBsb2FkRGF0ZS5mb3JtYXQoXCJIOm1tXCIpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLCB7IHNob3c6IHNob3csIG9uSGlkZTogdGhpcy5jbG9zZSwgYnNTaXplOiBcImxhcmdlXCIsIGFuaW1hdGlvbjogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkhlYWRlciwgeyBjbG9zZUJ1dHRvbjogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5UaXRsZSwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgLSBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVTdHJpbmcpKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IG9yaWdpbmFsVXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIHJlbDogXCJub29wZW5lclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbWFnZSwgeyBzcmM6IHByZXZpZXdVcmwsIHJlc3BvbnNpdmU6IHRydWUsIGNsYXNzTmFtZTogXCJjZW50ZXItYmxvY2tcIiB9KSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImltYWdlLXNlbGVjdGVkLWRlc2NyaXB0aW9udGV4dFwiIH0sIGRlc2NyaXB0aW9uKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuRm9vdGVyLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWVBbGxDb21tZW50c1ZpZXcoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIHsgc3R5bGU6IHsgZmxvYXQ6IFwicmlnaHRcIiB9IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVJbWFnZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0aGlzLmNsb3NlIH0sIFwiTHVrXCIpKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IFNlbGVjdGVkSW1hZ2VSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKE1vZGFsSW1hZ2UpO1xyXG5jb25zdCBTZWxlY3RlZEltYWdlID0gd2l0aFJvdXRlcihTZWxlY3RlZEltYWdlUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RlZEltYWdlO1xyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgZmV0Y2hDb21tZW50cywgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvY29tbWVudHNcIjtcclxuaW1wb3J0IHsgaW5jcmVtZW50Q29tbWVudENvdW50LCBkZWNyZW1lbnRDb21tZW50Q291bnQgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9pbWFnZXNcIjtcclxuaW1wb3J0IHsgQ29tbWVudExpc3QgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudExpc3RcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSBcIi4uL3BhZ2luYXRpb24vUGFnaW5hdGlvblwiO1xyXG5pbXBvcnQgeyBDb21tZW50Rm9ybSB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50Rm9ybVwiO1xyXG5pbXBvcnQgeyBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybCwgZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09PSBpZCxcclxuICAgICAgICBpbWFnZUlkOiBzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCxcclxuICAgICAgICBza2lwOiBzdGF0ZS5jb21tZW50c0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5jb21tZW50c0luZm8udGFrZSxcclxuICAgICAgICBwYWdlOiBzdGF0ZS5jb21tZW50c0luZm8ucGFnZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS5jb21tZW50c0luZm8udG90YWxQYWdlcyxcclxuICAgICAgICBjb21tZW50czogc3RhdGUuY29tbWVudHNJbmZvLmNvbW1lbnRzLFxyXG4gICAgICAgIGdldE5hbWU6ICh1c2VySWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1t1c2VySWRdO1xyXG4gICAgICAgICAgICBjb25zdCB7IEZpcnN0TmFtZSwgTGFzdE5hbWUgfSA9IHVzZXI7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtGaXJzdE5hbWV9ICR7TGFzdE5hbWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG93bmVyOiBzdGF0ZS51c2Vyc0luZm8udXNlcnNbc3RhdGUuaW1hZ2VzSW5mby5vd25lcklkXVxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBvc3RIYW5kbGU6IChpbWFnZUlkLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBpbWFnZUlkLCB0ZXh0LCBudWxsLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmV0Y2hDb21tZW50czogKGltYWdlSWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VDb21tZW50c1BhZ2VVcmwoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlZGl0SGFuZGxlOiAoY29tbWVudElkLCBfLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2goZWRpdENvbW1lbnQodXJsLCBjb21tZW50SWQsIHRleHQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVIYW5kbGU6IChjb21tZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNEZWxldGVVcmwoY29tbWVudElkKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlQ29tbWVudCh1cmwsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXBseUhhbmRsZTogKGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluY3JlbWVudENvdW50OiAoaW1hZ2VJZCkgPT4gZGlzcGF0Y2goaW5jcmVtZW50Q29tbWVudENvdW50KGltYWdlSWQpKSxcclxuICAgICAgICBkZWNyZW1lbnRDb3VudDogKGltYWdlSWQpID0+IGRpc3BhdGNoKGRlY3JlbWVudENvbW1lbnRDb3VudChpbWFnZUlkKSksXHJcbiAgICAgICAgbG9hZENvbW1lbnRzOiAoaW1hZ2VJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybChpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBDb21tZW50c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQgPSB0aGlzLmRlbGV0ZUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmVkaXRDb21tZW50ID0gdGhpcy5lZGl0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlDb21tZW50ID0gdGhpcy5yZXBseUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnBvc3RDb21tZW50ID0gdGhpcy5wb3N0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7IGZldGNoQ29tbWVudHMsIGltYWdlSWQsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBwYWdlIH0gPSBuZXh0UHJvcHMubG9jYXRpb24ucXVlcnk7XHJcbiAgICAgICAgaWYgKCFOdW1iZXIocGFnZSkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSBwYWdlIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgb3duZXIsIGltYWdlSWQsIHBhZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBjb25zdCB1c2VybmFtZSA9IG93bmVyLlVzZXJuYW1lO1xyXG4gICAgICAgIGlmIChwYWdlID09PSB0bylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAvJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlSWR9L2NvbW1lbnRzP3BhZ2U9JHt0b31gO1xyXG4gICAgICAgIHB1c2godXJsKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVIYW5kbGUsIGxvYWRDb21tZW50cywgZGVjcmVtZW50Q291bnQsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRlY3JlbWVudENvdW50KGltYWdlSWQpO1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkZWxldGVIYW5kbGUoY29tbWVudElkLCBjYik7XHJcbiAgICB9XHJcbiAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIGltYWdlSWQsIHRleHQpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgc2tpcCwgdGFrZSwgZWRpdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICBlZGl0SGFuZGxlKGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG4gICAgcmVwbHlDb21tZW50KGltYWdlSWQsIHRleHQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGluY3JlbWVudENvdW50LCBza2lwLCB0YWtlLCByZXBseUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgaW5jcmVtZW50Q291bnQoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcGx5SGFuZGxlKGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYik7XHJcbiAgICB9XHJcbiAgICBwb3N0Q29tbWVudCh0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCBsb2FkQ29tbWVudHMsIGluY3JlbWVudENvdW50LCBza2lwLCB0YWtlLCBwb3N0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpbmNyZW1lbnRDb3VudChpbWFnZUlkKTtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcG9zdEhhbmRsZShpbWFnZUlkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCBjb21tZW50cywgZ2V0TmFtZSwgaW1hZ2VJZCwgcGFnZSwgdG90YWxQYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY29udHJvbHMgPSB7XHJcbiAgICAgICAgICAgIHNraXAsXHJcbiAgICAgICAgICAgIHRha2UsXHJcbiAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQ6IHRoaXMuZGVsZXRlQ29tbWVudCxcclxuICAgICAgICAgICAgZWRpdENvbW1lbnQ6IHRoaXMuZWRpdENvbW1lbnQsXHJcbiAgICAgICAgICAgIHJlcGx5Q29tbWVudDogdGhpcy5yZXBseUNvbW1lbnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRleHQtbGVmdFwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDEsIGxnOiAxMSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudExpc3QsIF9fYXNzaWduKHsgY29udGV4dElkOiBpbWFnZUlkLCBjb21tZW50czogY29tbWVudHMsIGdldE5hbWU6IGdldE5hbWUsIGNhbkVkaXQ6IGNhbkVkaXQgfSwgY29udHJvbHMpKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAxLCBsZzogMTAgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhZ2luYXRpb24sIHsgdG90YWxQYWdlczogdG90YWxQYWdlcywgcGFnZTogcGFnZSwgcGFnZUhhbmRsZTogdGhpcy5wYWdlSGFuZGxlIH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMSwgbGc6IDEwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50Rm9ybSwgeyBwb3N0SGFuZGxlOiB0aGlzLnBvc3RDb21tZW50IH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IENvbW1lbnRzUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShDb21tZW50c0NvbnRhaW5lcik7XHJcbmNvbnN0IEltYWdlQ29tbWVudHMgPSB3aXRoUm91dGVyKENvbW1lbnRzUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBJbWFnZUNvbW1lbnRzO1xyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudCB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgV2VsbCwgQnV0dG9uLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IGZldGNoQW5kRm9jdXNTaW5nbGVDb21tZW50LCBwb3N0Q29tbWVudCwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9jb21tZW50c1wiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsIH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgY29tbWVudHMsIGZvY3VzZWRDb21tZW50IH0gPSBzdGF0ZS5jb21tZW50c0luZm87XHJcbiAgICBjb25zdCB7IHVzZXJzIH0gPSBzdGF0ZS51c2Vyc0luZm87XHJcbiAgICBjb25zdCB7IG93bmVySWQsIHNlbGVjdGVkSW1hZ2VJZCB9ID0gc3RhdGUuaW1hZ2VzSW5mbztcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TmFtZTogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IHVzZXJzW2lkXTtcclxuICAgICAgICAgICAgcmV0dXJuIGAke2F1dGhvci5GaXJzdE5hbWV9ICR7YXV0aG9yLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb2N1c2VkSWQ6IGZvY3VzZWRDb21tZW50LFxyXG4gICAgICAgIGZvY3VzZWQ6IGNvbW1lbnRzWzBdLFxyXG4gICAgICAgIGltYWdlSWQ6IHNlbGVjdGVkSW1hZ2VJZCxcclxuICAgICAgICBpbWFnZU93bmVyOiB1c2Vyc1tvd25lcklkXS5Vc2VybmFtZSxcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09PSBpZCxcclxuICAgICAgICBza2lwOiBzdGF0ZS5jb21tZW50c0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5jb21tZW50c0luZm8udGFrZSxcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBlZGl0SGFuZGxlOiAoY29tbWVudElkLCBfLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2goZWRpdENvbW1lbnQodXJsLCBjb21tZW50SWQsIHRleHQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVIYW5kbGU6IChjb21tZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNEZWxldGVVcmwoY29tbWVudElkKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlQ29tbWVudCh1cmwsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXBseUhhbmRsZTogKGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvY3VzQ29tbWVudDogKGlkKSA9PiBkaXNwYXRjaChmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudChpZCkpXHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBTaW5nbGVDb21tZW50UmVkdXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5hbGxDb21tZW50cyA9IHRoaXMuYWxsQ29tbWVudHMuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQgPSB0aGlzLmRlbGV0ZUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmVkaXRDb21tZW50ID0gdGhpcy5lZGl0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlDb21tZW50ID0gdGhpcy5yZXBseUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGFsbENvbW1lbnRzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VJZCwgaW1hZ2VPd25lciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBgLyR7aW1hZ2VPd25lcn0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlSWR9L2NvbW1lbnRzYDtcclxuICAgICAgICBwdXNoKHBhdGgpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlQ29tbWVudChjb21tZW50SWQsIF8pIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBkZWxldGVIYW5kbGUoY29tbWVudElkLCB0aGlzLmFsbENvbW1lbnRzKTtcclxuICAgIH1cclxuICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgY29udGV4dElkLCB0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0SGFuZGxlLCBmb2N1c0NvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiBmb2N1c0NvbW1lbnQoY29tbWVudElkKTtcclxuICAgICAgICBlZGl0SGFuZGxlKGNvbW1lbnRJZCwgY29udGV4dElkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcbiAgICByZXBseUNvbW1lbnQoY29udGV4dElkLCB0ZXh0LCBwYXJlbnRJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmVwbHlIYW5kbGUoY29udGV4dElkLCB0ZXh0LCBwYXJlbnRJZCwgdGhpcy5hbGxDb21tZW50cyk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBmb2N1c2VkSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKGZvY3VzZWRJZCA8IDApXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHsgVGV4dCwgQXV0aG9ySUQsIENvbW1lbnRJRCwgUG9zdGVkT24sIEVkaXRlZCB9ID0gdGhpcy5wcm9wcy5mb2N1c2VkO1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgaW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7XHJcbiAgICAgICAgICAgIHNraXAsXHJcbiAgICAgICAgICAgIHRha2UsXHJcbiAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQ6IHRoaXMuZGVsZXRlQ29tbWVudCxcclxuICAgICAgICAgICAgZWRpdENvbW1lbnQ6IHRoaXMuZWRpdENvbW1lbnQsXHJcbiAgICAgICAgICAgIHJlcGx5Q29tbWVudDogdGhpcy5yZXBseUNvbW1lbnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnByb3BzLmdldE5hbWUoQXV0aG9ySUQpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRleHQtbGVmdFwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2VsbCwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudCwgX19hc3NpZ24oeyBjb250ZXh0SWQ6IGltYWdlSWQsIG5hbWU6IG5hbWUsIHRleHQ6IFRleHQsIGNvbW1lbnRJZDogQ29tbWVudElELCByZXBsaWVzOiBbXSwgY2FuRWRpdDogY2FuRWRpdCwgYXV0aG9ySWQ6IEF1dGhvcklELCBwb3N0ZWRPbjogUG9zdGVkT24sIGVkaXRlZDogRWRpdGVkIH0sIHByb3BzKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgb25DbGljazogdGhpcy5hbGxDb21tZW50cyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJyZWZyZXNoXCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiIFNlIGFsbGUga29tbWVudGFyZXI/XCIpKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IFNpbmdsZUNvbW1lbnRDb25uZWN0ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoU2luZ2xlQ29tbWVudFJlZHV4KTtcclxuY29uc3QgU2luZ2xlSW1hZ2VDb21tZW50ID0gd2l0aFJvdXRlcihTaW5nbGVDb21tZW50Q29ubmVjdCk7XHJcbmV4cG9ydCBkZWZhdWx0IFNpbmdsZUltYWdlQ29tbWVudDtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBCcmVhZGNydW1iIH0gZnJvbSBcIi4uL2JyZWFkY3J1bWJzL0JyZWFkY3J1bWJcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJvdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBcIk9tXCI7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLkl0ZW0sIHsgaHJlZjogXCIvXCIgfSwgXCJGb3JzaWRlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIuSXRlbSwgeyBhY3RpdmU6IHRydWUgfSwgXCJPbVwiKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGV0dGUgZXIgZW4gc2luZ2xlIHBhZ2UgYXBwbGljYXRpb24hXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVGVrbm9sb2dpZXIgYnJ1Z3Q6XCIpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiUmVhY3RcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiUmVkdXhcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiUmVhY3QtQm9vdHN0cmFwXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIlJlYWN0Um91dGVyXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIkFzcC5uZXQgQ29yZSBSQyAyXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIkFzcC5uZXQgV2ViIEFQSSAyXCIpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5jb25zdCB1c2VycyA9IChzdGF0ZSA9IHt9LCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDIyOlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGN1cnJlbnRVc2VySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyMDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdXNlcnNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGN1cnJlbnRVc2VySWQsXHJcbiAgICB1c2Vyc1xyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgdXNlcnNJbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuaW1wb3J0IHsgcHV0LCB1bmlvbiB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgZmlsdGVyLCBvbWl0IH0gZnJvbSBcInVuZGVyc2NvcmVcIjtcclxuY29uc3Qgb3duZXJJZCA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDEwOlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxufTtcclxuY29uc3QgaW1hZ2VzID0gKHN0YXRlID0ge30sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMTM6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHV0KHN0YXRlLCBpbWFnZS5JbWFnZUlELCBpbWFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIDExOlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIDE0OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGFjdGlvbi5wYXlsb2FkLkltYWdlSUQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZW1vdmVkID0gb21pdChzdGF0ZSwgaWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgMTg6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYWN0aW9uLnBheWxvYWQuSW1hZ2VJRDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlID0gc3RhdGVbaWRdO1xyXG4gICAgICAgICAgICAgICAgaW1hZ2UuQ29tbWVudENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwdXQoc3RhdGUsIGlkLCBpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAxOTpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBhY3Rpb24ucGF5bG9hZC5JbWFnZUlEO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBzdGF0ZVtpZF07XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5Db21tZW50Q291bnQtLTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHB1dChzdGF0ZSwgaWQsIGltYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxufTtcclxuY29uc3Qgc2VsZWN0ZWRJbWFnZUlkID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMTI6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5jb25zdCBzZWxlY3RlZEltYWdlSWRzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMTU6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5pb24oc3RhdGUsIFtpZF0sIChpZDEsIGlkMikgPT4gaWQxID09PSBpZDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAxNjpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlcihzdGF0ZSwgKGlkKSA9PiBpZCAhPT0gYWN0aW9uLnBheWxvYWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAxNzpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGltYWdlc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgb3duZXJJZCxcclxuICAgIGltYWdlcyxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZCxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZHNcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IGltYWdlc0luZm87XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5jb25zdCBjb21tZW50cyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDQxOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgW107XHJcbiAgICAgICAgY2FzZSA0MjpcclxuICAgICAgICAgICAgcmV0dXJuIFsuLi5zdGF0ZSwgYWN0aW9uLnBheWxvYWRbMF1dO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdGFrZSA9IChzdGF0ZSA9IDEwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDM3OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMTA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBwYWdlID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzODpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IDE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0b3RhbFBhZ2VzID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzOTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBmb2N1c2VkQ29tbWVudCA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDQzOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBjb21tZW50c0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgY29tbWVudHMsXHJcbiAgICBza2lwLFxyXG4gICAgdGFrZSxcclxuICAgIHBhZ2UsXHJcbiAgICB0b3RhbFBhZ2VzLFxyXG4gICAgZm9jdXNlZENvbW1lbnRcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IGNvbW1lbnRzSW5mbztcclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmltcG9ydCB7IHVuaW9uIH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5jb25zdCBza2lwVGhyZWFkcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMjg6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRha2VUaHJlYWRzID0gKHN0YXRlID0gMTAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMjk6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHBhZ2VUaHJlYWRzID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyNzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdG90YWxQYWdlc1RocmVhZCA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMjY6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHNlbGVjdGVkVGhyZWFkID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzA6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRpdGxlcyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDI0OlxyXG4gICAgICAgICAgICByZXR1cm4gdW5pb24oYWN0aW9uLnBheWxvYWQsIHN0YXRlLCAodDEsIHQyKSA9PiB0MS5JRCA9PT0gdDIuSUQpO1xyXG4gICAgICAgIGNhc2UgMjU6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHBvc3RDb250ZW50ID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzMTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdGl0bGVzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB0aXRsZXMsXHJcbiAgICBza2lwOiBza2lwVGhyZWFkcyxcclxuICAgIHRha2U6IHRha2VUaHJlYWRzLFxyXG4gICAgcGFnZTogcGFnZVRocmVhZHMsXHJcbiAgICB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzVGhyZWFkLFxyXG4gICAgc2VsZWN0ZWRUaHJlYWRcclxufSk7XHJcbmNvbnN0IGZvcnVtSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB0aXRsZXNJbmZvLFxyXG4gICAgcG9zdENvbnRlbnRcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IGZvcnVtSW5mbztcclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmV4cG9ydCBjb25zdCB0aXRsZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgbWVzc2FnZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBlcnJvckluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdGl0bGUsXHJcbiAgICBtZXNzYWdlXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBlcnJvckluZm87XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5pbXBvcnQgZXJyb3JJbmZvIGZyb20gXCIuL2Vycm9ySW5mb1wiO1xyXG5leHBvcnQgY29uc3QgaGFzRXJyb3IgPSAoc3RhdGUgPSBmYWxzZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgbWVzc2FnZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IGRvbmUgPSAoc3RhdGUgPSB0cnVlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCB1c2VkU3BhY2VrQiA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzI6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCB0b3RhbFNwYWNla0IgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzMzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IHNwYWNlSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB1c2VkU3BhY2VrQixcclxuICAgIHRvdGFsU3BhY2VrQlxyXG59KTtcclxuY29uc3Qgc3RhdHVzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBoYXNFcnJvcixcclxuICAgIGVycm9ySW5mbyxcclxuICAgIHNwYWNlSW5mbyxcclxuICAgIG1lc3NhZ2UsXHJcbiAgICBkb25lXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBzdGF0dXNJbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0YWtlID0gKHN0YXRlID0gMTAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IDE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0b3RhbFBhZ2VzID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGl0ZW1zID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IFtdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3Qgd2hhdHNOZXdJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXMsXHJcbiAgICBpdGVtc1xyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgd2hhdHNOZXdJbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuaW1wb3J0IHVzZXJzSW5mbyBmcm9tIFwiLi91c2Vyc0luZm9cIjtcclxuaW1wb3J0IGltYWdlc0luZm8gZnJvbSBcIi4vaW1hZ2VzSW5mb1wiO1xyXG5pbXBvcnQgY29tbWVudHNJbmZvIGZyb20gXCIuL2NvbW1lbnRzSW5mb1wiO1xyXG5pbXBvcnQgZm9ydW1JbmZvIGZyb20gXCIuL2ZvcnVtSW5mb1wiO1xyXG5pbXBvcnQgc3RhdHVzSW5mbyBmcm9tIFwiLi9zdGF0dXNJbmZvXCI7XHJcbmltcG9ydCB3aGF0c05ld0luZm8gZnJvbSBcIi4vd2hhdHNOZXdJbmZvXCI7XHJcbmNvbnN0IHJvb3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHVzZXJzSW5mbyxcclxuICAgIGltYWdlc0luZm8sXHJcbiAgICBjb21tZW50c0luZm8sXHJcbiAgICBmb3J1bUluZm8sXHJcbiAgICBzdGF0dXNJbmZvLFxyXG4gICAgd2hhdHNOZXdJbmZvXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCByb290UmVkdWNlcjtcclxuIiwiaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gXCJyZWR1eFwiO1xyXG5pbXBvcnQgdGh1bmsgZnJvbSBcInJlZHV4LXRodW5rXCI7XHJcbmltcG9ydCByb290UmVkdWNlciBmcm9tIFwiLi4vcmVkdWNlcnMvcm9vdFwiO1xyXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJvb3RSZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUodGh1bmspKTtcclxuZXhwb3J0IGRlZmF1bHQgc3RvcmU7XHJcbiIsImltcG9ydCBzdG9yZSBmcm9tIFwiLi4vc3RvcmUvc3RvcmVcIjtcclxuaW1wb3J0IHsgZmV0Y2hMYXRlc3ROZXdzIH0gZnJvbSBcIi4uL2FjdGlvbnMvd2hhdHNuZXdcIjtcclxuaW1wb3J0IHsgZmV0Y2hUaHJlYWRzLCBmZXRjaFBvc3QgfSBmcm9tIFwiLi4vYWN0aW9ucy9mb3J1bVwiO1xyXG5pbXBvcnQgeyBmZXRjaEN1cnJlbnRVc2VyLCBmZXRjaFVzZXJzIH0gZnJvbSBcIi4uL2FjdGlvbnMvdXNlcnNcIjtcclxuaW1wb3J0IHsgZmV0Y2hVc2VySW1hZ2VzLCBzZXRTZWxlY3RlZEltZywgc2V0SW1hZ2VPd25lciB9IGZyb20gXCIuLi9hY3Rpb25zL2ltYWdlc1wiO1xyXG5pbXBvcnQgeyBmZXRjaENvbW1lbnRzLCBzZXRTa2lwQ29tbWVudHMsIHNldFRha2VDb21tZW50cywgZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQgfSBmcm9tIFwiLi4vYWN0aW9ucy9jb21tZW50c1wiO1xyXG5pbXBvcnQgeyBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybCwgZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IHBvbHlmaWxsIH0gZnJvbSBcImVzNi1wcm9taXNlXCI7XHJcbmltcG9ydCB7IHBvbHlmaWxsIGFzIG9iamVjdFBvbHlmaWxsIH0gZnJvbSBcImVzNi1vYmplY3QtYXNzaWduXCI7XHJcbmV4cG9ydCBjb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgb2JqZWN0UG9seWZpbGwoKTtcclxuICAgIHBvbHlmaWxsKCk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaEN1cnJlbnRVc2VyKGdsb2JhbHMuY3VycmVudFVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFVzZXJzKCkpO1xyXG4gICAgbW9tZW50LmxvY2FsZShcImRhXCIpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hXaGF0c05ldyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGdldExhdGVzdCA9IChza2lwLCB0YWtlKSA9PiBzdG9yZS5kaXNwYXRjaChmZXRjaExhdGVzdE5ld3Moc2tpcCwgdGFrZSkpO1xyXG4gICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLndoYXRzTmV3SW5mbztcclxuICAgIGdldExhdGVzdChza2lwLCB0YWtlKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoRm9ydW0gPSAoXykgPT4ge1xyXG4gICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmZvcnVtSW5mby50aXRsZXNJbmZvO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hUaHJlYWRzKHNraXAsIHRha2UpKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoU2luZ2xlUG9zdCA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgaWQgfSA9IG5leHRTdGF0ZS5wYXJhbXM7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFBvc3QoTnVtYmVyKGlkKSkpO1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2VsZWN0SW1hZ2UgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBpbWFnZUlkID0gTnVtYmVyKG5leHRTdGF0ZS5wYXJhbXMuaWQpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaW1hZ2VJZCkpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hJbWFnZXMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IG5leHRTdGF0ZS5wYXJhbXMudXNlcm5hbWU7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRJbWFnZU93bmVyKHVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldFNraXBDb21tZW50cyh1bmRlZmluZWQpKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldFRha2VDb21tZW50cyh1bmRlZmluZWQpKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGxvYWRDb21tZW50cyA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgaWQgfSA9IG5leHRTdGF0ZS5wYXJhbXM7XHJcbiAgICBjb25zdCBwYWdlID0gTnVtYmVyKG5leHRTdGF0ZS5sb2NhdGlvbi5xdWVyeS5wYWdlKTtcclxuICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcbiAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybChOdW1iZXIoaWQpLCBza2lwLCB0YWtlKTtcclxuICAgIGlmICghcGFnZSkge1xyXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSBwYWdlIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXBJdGVtcywgdGFrZSkpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hDb21tZW50ID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgaWQgPSBOdW1iZXIobmV4dFN0YXRlLmxvY2F0aW9uLnF1ZXJ5LmlkKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQW5kRm9jdXNTaW5nbGVDb21tZW50KGlkKSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFBvc3RDb21tZW50cyA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgaWQgfSA9IG5leHRTdGF0ZS5wYXJhbXM7XHJcbiAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgY29uc3QgdXJsID0gZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwoTnVtYmVyKGlkKSwgc2tpcCwgdGFrZSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkpO1xyXG59O1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0ICogYXMgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xyXG5pbXBvcnQgTWFpbiBmcm9tIFwiLi9jb21wb25lbnRzL3NoZWxscy9NYWluXCI7XHJcbmltcG9ydCBIb21lIGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9Ib21lXCI7XHJcbmltcG9ydCBGb3J1bSBmcm9tIFwiLi9jb21wb25lbnRzL3NoZWxscy9Gb3J1bVwiO1xyXG5pbXBvcnQgRm9ydW1MaXN0IGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bUxpc3RcIjtcclxuaW1wb3J0IEZvcnVtUG9zdCBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Qb3N0XCI7XHJcbmltcG9ydCBGb3J1bUNvbW1lbnRzIGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bUNvbW1lbnRzXCI7XHJcbmltcG9ydCBVc2VycyBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlcnNcIjtcclxuaW1wb3J0IFVzZXJJbWFnZXMgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJJbWFnZXNcIjtcclxuaW1wb3J0IFNlbGVjdGVkSW1hZ2UgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2VcIjtcclxuaW1wb3J0IEltYWdlQ29tbWVudHMgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL0ltYWdlQ29tbWVudHNcIjtcclxuaW1wb3J0IFNpbmdsZUltYWdlQ29tbWVudCBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvU2luZ2xlSW1hZ2VDb21tZW50XCI7XHJcbmltcG9ydCBBYm91dCBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXRcIjtcclxuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlL3N0b3JlXCI7XHJcbmltcG9ydCB7IFJvdXRlciwgUm91dGUsIEluZGV4Um91dGUsIGJyb3dzZXJIaXN0b3J5IH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBpbml0LCBmZXRjaEZvcnVtLCBzZWxlY3RJbWFnZSwgZmV0Y2hJbWFnZXMsIGxvYWRDb21tZW50cywgZmV0Y2hDb21tZW50LCBmZXRjaFdoYXRzTmV3LCBmZXRjaFNpbmdsZVBvc3QsIGZldGNoUG9zdENvbW1lbnRzIH0gZnJvbSBcIi4vdXRpbGl0aWVzL29uc3RhcnR1cFwiO1xyXG5pbml0KCk7XHJcblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFByb3ZpZGVyLCB7IHN0b3JlOiBzdG9yZSB9LFxyXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZXIsIHsgaGlzdG9yeTogYnJvd3Nlckhpc3RvcnkgfSxcclxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiL1wiLCBjb21wb25lbnQ6IE1haW4gfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbmRleFJvdXRlLCB7IGNvbXBvbmVudDogSG9tZSwgb25FbnRlcjogZmV0Y2hXaGF0c05ldyB9KSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcImZvcnVtXCIsIGNvbXBvbmVudDogRm9ydW0gfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5kZXhSb3V0ZSwgeyBjb21wb25lbnQ6IEZvcnVtTGlzdCwgb25FbnRlcjogZmV0Y2hGb3J1bSB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJwb3N0LzppZFwiLCBjb21wb25lbnQ6IEZvcnVtUG9zdCwgb25FbnRlcjogZmV0Y2hTaW5nbGVQb3N0IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcImNvbW1lbnRzXCIsIGNvbXBvbmVudDogRm9ydW1Db21tZW50cywgb25FbnRlcjogZmV0Y2hQb3N0Q29tbWVudHMgfSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcInVzZXJzXCIsIGNvbXBvbmVudDogVXNlcnMgfSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCI6dXNlcm5hbWUvZ2FsbGVyeVwiLCBjb21wb25lbnQ6IFVzZXJJbWFnZXMsIG9uRW50ZXI6IGZldGNoSW1hZ2VzIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiaW1hZ2UvOmlkXCIsIGNvbXBvbmVudDogU2VsZWN0ZWRJbWFnZSwgb25FbnRlcjogc2VsZWN0SW1hZ2UgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiY29tbWVudHNcIiwgY29tcG9uZW50OiBJbWFnZUNvbW1lbnRzLCBvbkVudGVyOiBsb2FkQ29tbWVudHMgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcImNvbW1lbnRcIiwgY29tcG9uZW50OiBTaW5nbGVJbWFnZUNvbW1lbnQsIG9uRW50ZXI6IGZldGNoQ29tbWVudCB9KSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiYWJvdXRcIiwgY29tcG9uZW50OiBBYm91dCB9KSkpKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpKTtcclxuIl0sIm5hbWVzIjpbIlJvdyIsIkNvbCIsIkFsZXJ0IiwiY29uc3QiLCJsZXQiLCJMaW5rIiwiSW5kZXhMaW5rIiwiR3JpZCIsIk5hdmJhciIsIk5hdiIsIk5hdkRyb3Bkb3duIiwiTWVudUl0ZW0iLCJjb25uZWN0Iiwibm9ybWFsaXplSW1hZ2UiLCJub3JtYWxpemVDb21tZW50Iiwibm9ybWFsaXplIiwic3VwZXIiLCJGb3JtQ29udHJvbCIsIkJ1dHRvbiIsIkdseXBoaWNvbiIsIm1hcFN0YXRlVG9Qcm9wcyIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsIlByb2dyZXNzQmFyIiwiTWVkaWEiLCJJbWFnZSIsIlRvb2x0aXAiLCJPdmVybGF5VHJpZ2dlciIsInRoaXMiLCJNb2RhbCIsIkZvcm1Hcm91cCIsIkNvbnRyb2xMYWJlbCIsIkJ1dHRvbkdyb3VwIiwiQnV0dG9uVG9vbGJhciIsIkNvbGxhcHNlIiwic2V0VG90YWxQYWdlcyIsInNldFBhZ2UiLCJzZXRTa2lwIiwic2V0VGFrZSIsImFyZ3VtZW50cyIsImZpbmQiLCJjb250YWlucyIsIndpdGhSb3V0ZXIiLCJQYWdpbmF0aW9uIiwiUGFnaW5hdGlvbkJzIiwiSnVtYm90cm9uIiwiUGFuZWwiLCJfX2Fzc2lnbiIsInZhbHVlcyIsIlBhZ2VIZWFkZXIiLCJJbWFnZUJzIiwicm93IiwiV2VsbCIsImNvbWJpbmVSZWR1Y2VycyIsIm9taXQiLCJpZCIsImltYWdlIiwicmVzdWx0IiwiZmlsdGVyIiwibWVzc2FnZSIsInNraXAiLCJ0YWtlIiwicGFnZSIsInRvdGFsUGFnZXMiLCJjcmVhdGVTdG9yZSIsImFwcGx5TWlkZGxld2FyZSIsIm9iamVjdFBvbHlmaWxsIiwicG9seWZpbGwiLCJQcm92aWRlciIsIlJvdXRlciIsImJyb3dzZXJIaXN0b3J5IiwiUm91dGUiLCJJbmRleFJvdXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFTyxJQUFNLEtBQUssR0FBd0I7SUFBQzs7Ozs7Ozs7SUFBQSxnQkFDdkMsTUFBTSxzQkFBRztRQUNMLE9BQW9DLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBekMsSUFBQSxVQUFVO1FBQUUsSUFBQSxLQUFLO1FBQUUsSUFBQSxPQUFPLGVBQTVCO1FBQ04sT0FBTyxLQUFLLENBQUMsYUFBYSxDQUFDQSxrQkFBRyxFQUFFLElBQUk7WUFDaEMsS0FBSyxDQUFDLGFBQWEsQ0FBQ0Msa0JBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDM0MsS0FBSyxDQUFDLGFBQWEsQ0FBQ0Msb0JBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRTtvQkFDbkUsS0FBSyxD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R0FBRyxDQUFDLElBQUksT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBQ3hFQSxJQUFNLFFBQVEsR0FBRyxVQUFDLEVBQUUsRUFBRSxTQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFBLENBQUM7SUFDckRBLElBQU0sS0FBSyxHQUFHLFlBQUcsU0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBQSxDQUFDO0lBQy9EQSxJQUFNLFFBQVEsR0FBRyxZQUFHLEVBQUssSUFBSSxLQUFLLEVBQUU7UUFDaEMsRUFBQSxPQUFPLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFBLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQzFDQSxJQUFNLFVBQVUsR0FBRyxZQUFHLEVBQUssSUFBSSxLQUFLLEVBQUU7UUFDbEMsRUFBQSxPQUFPLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFBLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQzVDQSxJQUFNLFNBQVMsR0FBRyxZQUFHLEVBQUssSUFBSSxLQUFLLEVBQUU7UUFDakMsRUFBQSxPQUFPLEtBQUssRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFBLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQzNDQSxJQUFNLFdBQVcsR0FBRyxZQUFHLEVBQUssSUFBSSxLQUFLLEVBQUU7UUFDbkMsRUFBQSxPQUFPLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFBLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQzdDQSxJQUFNLFFBQVEsR0FBRyxZQUFHLEVBQUssSUFBSSxLQUFLLEVBQUU7UUFDaEMsRUFBQSxPQUFPLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFBLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNsREEsSUFBTSxXQUFXLEdBQUcsWUFBRyxFQUFLLElBQUksS0FBSyxFQUFFO1FBQ25DLEVBQUEsT0FB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