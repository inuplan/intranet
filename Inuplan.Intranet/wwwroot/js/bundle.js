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
    var name = user ? user.Username : "User";
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
            Uploaded: image.Uploaded
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
        uploadImage(username, formData);
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
var uploadImage = function (username, formData, onSuccess, onError) {
    return function (dispatch) {
        var url = (globals.urls.images) + "?username=" + username;
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
            var normalized = data.map(normalize).reverse();
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
                if (user.Username = username) {
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
        var username = author.Username;
        var file = filename + "." + extension;
        var link = username + "/gallery/image/" + imageId;
        var name = (author.FirstName) + " " + (author.LastName);
        return React.createElement(WhatsNewTooltip, { tooltip: "Uploadet billede" },
            React.createElement(reactBootstrap.Media.ListItem, { className: "whatsnewItem hover-shadow" },
                React.createElement(CommentProfile, null),
                React.createElement(reactBootstrap.Media.Body, null,
                    React.createElement("blockquote", null,
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
                        return React.createElement(WhatsNewItemImage, { on: item.On, imageId: image.ImageID, filename: image.Filename, extension: image.Extension, thumbnail: image.ThumbnailUrl, author: author, key: itemKey });
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
    var name = user ? user.Username : "User";
    return {
        username: name,
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take
    };
};
var mapDispatchToProps$1 = function (dispatch) {
    return {
        uploadImage: function (skip, take, username, formData) {
            var onSuccess = function () {
                dispatch(fetchLatestNews(skip, take));
            };
            dispatch(uploadImage(username, formData, onSuccess, function (r) { console.log(r); }));
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
    HomeContainer.prototype.upload = function upload (username, formData) {
        var ref = this.props;
        var uploadImage = ref.uploadImage;
        var skip = ref.skip;
        var take = ref.take;
        uploadImage(skip, take, username, formData);
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
        var username = globals.currentUsername;
        return React.createElement(reactBootstrap.Row, null,
            React.createElement(reactBootstrap.Jumbotron, null,
                React.createElement("h1", null,
                    React.createElement("span", null,
                        "Velkommen ",
                        React.createElement("small", null,
                            username,
                            "!"))),
                React.createElement("p", { className: "lead" }, "Til Inuplans forum og billed-arkiv side"),
                React.createElement(reactBootstrap.Row, null,
                    React.createElement(reactBootstrap.Col, { lg: 4 },
                        React.createElement(reactBootstrap.Panel, { header: "Du kan uploade billeder til dit eget galleri her", bsStyle: "primary" },
                            React.createElement(ImageUpload, { username: username, uploadImage: this.upload }))))),
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
    var images = underscore.values(state.imagesInfo.images);
    return {
        images: images,
        canEdit: canEdit,
        selectedImageIds: state.imagesInfo.selectedImageIds,
        fullName: fullName,
    };
};
var mapDispatchToProps$8 = function (dispatch) {
    return {
        uploadImage: function (username, formData) {
            dispatch(uploadImage(username, formData, function () { dispatch(fetchUserImages(username)); }, function () { }));
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
            React.createElement(reactBootstrap.Col, { lg: 4 },
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
    return {
        canEdit: canEdit,
        hasImage: function () { return Boolean(getImage(state.imagesInfo.selectedImageId)); },
        filename: filename(),
        previewUrl: previewUrl(),
        extension: extension(),
        originalUrl: originalUrl(),
        uploaded: uploaded()
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
                    React.createElement(reactBootstrap.Image, { src: previewUrl, responsive: true, className: "center-block" }))),
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
                var merge = state.concat(action.payload);
                var result = [].concat( new Set(merge) );
                return result;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29udGFpbmVycy9FcnJvci5qcyIsImFjdGlvbnMvZXJyb3IuanMiLCJjb21wb25lbnRzL3dyYXBwZXJzL0xpbmtzLmpzIiwiY29tcG9uZW50cy9zaGVsbHMvTWFpbi5qcyIsInV0aWxpdGllcy91dGlscy5qcyIsInV0aWxpdGllcy9ub3JtYWxpemUuanMiLCJhY3Rpb25zL3VzZXJzLmpzIiwiYWN0aW9ucy93aGF0c25ldy5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlVXBsb2FkLmpzIiwiYWN0aW9ucy9pbWFnZXMuanMiLCJhY3Rpb25zL3N0YXR1cy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VkU3BhY2UuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlLmpzIiwiY29tcG9uZW50cy93aGF0c25ldy9XaGF0c05ld1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3SXRlbUltYWdlLmpzIiwiY29tcG9uZW50cy93aGF0c25ldy9XaGF0c05ld0l0ZW1Db21tZW50LmpzIiwiY29tcG9uZW50cy93aGF0c25ldy9XaGF0c05ld0ZvcnVtUG9zdC5qcyIsImNvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdMaXN0LmpzIiwiY29tcG9uZW50cy9mb3J1bS9Gb3J1bUZvcm0uanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRDb250cm9scy5qcyIsImFjdGlvbnMvZm9ydW0uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Qb3N0LmpzIiwiY29tcG9uZW50cy9wYWdpbmF0aW9uL1BhZ2luYXRpb24uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvV2hhdHNOZXcuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvSG9tZS5qcyIsImNvbXBvbmVudHMvc2hlbGxzL0ZvcnVtLmpzIiwiY29tcG9uZW50cy9mb3J1bS9Gb3J1bVRpdGxlLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL0ZvcnVtTGlzdC5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudERlbGV0ZWQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRMaXN0LmpzIiwiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50Rm9ybS5qcyIsImFjdGlvbnMvY29tbWVudHMuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Db21tZW50cy5qcyIsImNvbXBvbmVudHMvdXNlcnMvVXNlci5qcyIsImNvbXBvbmVudHMvdXNlcnMvVXNlckxpc3QuanMiLCJjb21wb25lbnRzL2JyZWFkY3J1bWJzL0JyZWFkY3J1bWIuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlcnMuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvSW1hZ2VDb21tZW50cy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9TaW5nbGVJbWFnZUNvbW1lbnQuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJyZWR1Y2Vycy91c2Vyc0luZm8uanMiLCJyZWR1Y2Vycy9pbWFnZXNJbmZvLmpzIiwicmVkdWNlcnMvY29tbWVudHNJbmZvLmpzIiwicmVkdWNlcnMvZm9ydW1JbmZvLmpzIiwicmVkdWNlcnMvZXJyb3JJbmZvLmpzIiwicmVkdWNlcnMvc3RhdHVzSW5mby5qcyIsInJlZHVjZXJzL3doYXRzTmV3SW5mby5qcyIsInJlZHVjZXJzL3Jvb3QuanMiLCJzdG9yZS9zdG9yZS5qcyIsInV0aWxpdGllcy9vbnN0YXJ0dXAuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBBbGVydCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIEVycm9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNsZWFyRXJyb3IsIHRpdGxlLCBtZXNzYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEFsZXJ0LCB7IGJzU3R5bGU6IFwiZGFuZ2VyXCIsIG9uRGlzbWlzczogY2xlYXJFcnJvciB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgdGl0bGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIG1lc3NhZ2UpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjb25zdCBzZXRIYXNFcnJvciA9IChoYXNFcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAwLFxyXG4gICAgICAgIHBheWxvYWQ6IGhhc0Vycm9yXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RXJyb3JUaXRsZSA9ICh0aXRsZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxLFxyXG4gICAgICAgIHBheWxvYWQ6IHRpdGxlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvclRpdGxlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvck1lc3NhZ2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvck1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzLFxyXG4gICAgICAgIHBheWxvYWQ6IG1lc3NhZ2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKHRydWUpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXRFcnJvclRpdGxlKGVycm9yLnRpdGxlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JNZXNzYWdlKGVycm9yLm1lc3NhZ2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9ICgpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChjbGVhckVycm9yVGl0bGUoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvck1lc3NhZ2UoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0SGFzRXJyb3IoZmFsc2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJpbXBvcnQgeyBMaW5rLCBJbmRleExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5leHBvcnQgY2xhc3MgTmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSwgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogdGhpcy5wcm9wcy50byB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKSkpO1xyXG4gICAgfVxyXG59XHJcbk5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn07XHJcbmV4cG9ydCBjbGFzcyBJbmRleE5hdkxpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IHRoaXMuY29udGV4dC5yb3V0ZXIuaXNBY3RpdmUodGhpcy5wcm9wcy50bywgdHJ1ZSksIGNsYXNzTmFtZSA9IGlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEluZGV4TGluaywgeyB0bzogdGhpcy5wcm9wcy50byB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKSkpO1xyXG4gICAgfVxyXG59XHJcbkluZGV4TmF2TGluay5jb250ZXh0VHlwZXMgPSB7XHJcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5vYmplY3RcclxufTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgR3JpZCwgTmF2YmFyLCBOYXYsIE5hdkRyb3Bkb3duLCBNZW51SXRlbSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgRXJyb3IgfSBmcm9tIFwiLi4vY29udGFpbmVycy9FcnJvclwiO1xyXG5pbXBvcnQgeyBjbGVhckVycm9yIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvZXJyb3JcIjtcclxuaW1wb3J0IHsgTmF2TGluaywgSW5kZXhOYXZMaW5rIH0gZnJvbSBcIi4uL3dyYXBwZXJzL0xpbmtzXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZF07XHJcbiAgICBjb25zdCBuYW1lID0gdXNlciA/IHVzZXIuVXNlcm5hbWUgOiBcIlVzZXJcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlcm5hbWU6IG5hbWUsXHJcbiAgICAgICAgaGFzRXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uaGFzRXJyb3IsXHJcbiAgICAgICAgZXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uZXJyb3JJbmZvXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xlYXJFcnJvcjogKCkgPT4gZGlzcGF0Y2goY2xlYXJFcnJvcigpKVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgU2hlbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgZXJyb3JWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgaGFzRXJyb3IsIGNsZWFyRXJyb3IsIGVycm9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUsIG1lc3NhZ2UgfSA9IGVycm9yO1xyXG4gICAgICAgIGlmICghaGFzRXJyb3IpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEVycm9yLCB7IHRpdGxlOiB0aXRsZSwgbWVzc2FnZTogbWVzc2FnZSwgY2xlYXJFcnJvcjogY2xlYXJFcnJvciB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGVtcGxveWVlVXJsID0gZ2xvYmFscy51cmxzLmVtcGxveWVlSGFuZGJvb2s7XHJcbiAgICAgICAgY29uc3QgYzVTZWFyY2hVcmwgPSBnbG9iYWxzLnVybHMuYzVTZWFyY2g7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR3JpZCwgeyBmbHVpZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhciwgeyBmaXhlZFRvcDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZiYXIuSGVhZGVyLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLkJyYW5kLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IFwiaHR0cDovL2ludHJhbmV0c2lkZVwiLCBjbGFzc05hbWU6IFwibmF2YmFyLWJyYW5kXCIgfSwgXCJJbnVwbGFuIEludHJhbmV0XCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhci5Ub2dnbGUsIG51bGwpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLkNvbGxhcHNlLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEluZGV4TmF2TGluaywgeyB0bzogXCIvXCIgfSwgXCJGb3JzaWRlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkxpbmssIHsgdG86IFwiL2ZvcnVtXCIgfSwgXCJGb3J1bVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZMaW5rLCB7IHRvOiBcIi91c2Vyc1wiIH0sIFwiQnJ1Z2VyZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZMaW5rLCB7IHRvOiBcIi9hYm91dFwiIH0sIFwiT21cIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLlRleHQsIHsgcHVsbFJpZ2h0OiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiSGVqLCBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiIVwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdiwgeyBwdWxsUmlnaHQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZEcm9wZG93biwgeyBldmVudEtleTogNSwgdGl0bGU6IFwiTGlua3NcIiwgaWQ6IFwiZXh0ZXJuX2xpbmtzXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHsgaHJlZjogZW1wbG95ZWVVcmwsIGV2ZW50S2V5OiA1LjEgfSwgXCJNZWRhcmJlamRlciBoXFx1MDBFNW5kYm9nXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZW51SXRlbSwgeyBocmVmOiBjNVNlYXJjaFVybCwgZXZlbnRLZXk6IDUuMiB9LCBcIkM1IFNcXHUwMEY4Z25pbmdcIikpKSkpLFxyXG4gICAgICAgICAgICB0aGlzLmVycm9yVmlldygpLFxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBNYWluID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoU2hlbGwpO1xyXG5leHBvcnQgZGVmYXVsdCBNYWluO1xyXG4iLCJpbXBvcnQgeyBzZXRFcnJvciB9IGZyb20gXCIuLi9hY3Rpb25zL2Vycm9yXCI7XHJcbmltcG9ydCAqIGFzIG1hcmtlZCBmcm9tIFwibWFya2VkXCI7XHJcbmltcG9ydCByZW1vdmVNZCBmcm9tIFwicmVtb3ZlLW1hcmtkb3duXCI7XHJcbmV4cG9ydCBjb25zdCBvYmpNYXAgPSAoYXJyLCBrZXksIHZhbCkgPT4ge1xyXG4gICAgY29uc3Qgb2JqID0gYXJyLnJlZHVjZSgocmVzLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc3QgayA9IGtleShpdGVtKTtcclxuICAgICAgICBjb25zdCB2ID0gdmFsKGl0ZW0pO1xyXG4gICAgICAgIHJlc1trXSA9IHY7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH0sIHt9KTtcclxuICAgIHJldHVybiBvYmo7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBwdXQgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBsZXQga3YgPSBPYmplY3QuYXNzaWduKHt9LCBvYmopO1xyXG4gICAga3Zba2V5XSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIGt2O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgIG1vZGU6IFwiY29yc1wiLFxyXG4gICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiXHJcbn07XHJcbmV4cG9ydCBjb25zdCByZXNwb25zZUhhbmRsZXIgPSAoZGlzcGF0Y2gpID0+IChvblN1Y2Nlc3MpID0+IChyZXNwb25zZSkgPT4ge1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKVxyXG4gICAgICAgIHJldHVybiBvblN1Y2Nlc3MocmVzcG9uc2UpO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoIChyZXNwb25zZS5zdGF0dXMpIHtcclxuICAgICAgICAgICAgY2FzZSA0MDA6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcih7IHRpdGxlOiBcIjQwMCBCYWQgUmVxdWVzdFwiLCBtZXNzYWdlOiBcIlRoZSByZXF1ZXN0IHdhcyBub3Qgd2VsbC1mb3JtZWRcIiB9KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0MDQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcih7IHRpdGxlOiBcIjQwNCBOb3QgRm91bmRcIiwgbWVzc2FnZTogXCJDb3VsZCBub3QgZmluZCByZXNvdXJjZVwiIH0pKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwODpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKHsgdGl0bGU6IFwiNDA4IFJlcXVlc3QgVGltZW91dFwiLCBtZXNzYWdlOiBcIlRoZSBzZXJ2ZXIgZGlkIG5vdCByZXNwb25kIGluIHRpbWVcIiB9KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA1MDA6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcih7IHRpdGxlOiBcIjUwMCBTZXJ2ZXIgRXJyb3JcIiwgbWVzc2FnZTogXCJTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHRoZSBBUEktc2VydmVyXCIgfSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcih7IHRpdGxlOiBcIk9vcHNcIiwgbWVzc2FnZTogXCJTb21ldGhpbmcgd2VudCB3cm9uZyFcIiB9KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuZXhwb3J0IGNvbnN0IHVuaW9uID0gKGFycjEsIGFycjIsIGVxdWFsaXR5RnVuYykgPT4ge1xyXG4gICAgbGV0IHJlc3VsdCA9IGFycjEuY29uY2F0KGFycjIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCByZXN1bHQubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGVxdWFsaXR5RnVuYyhyZXN1bHRbaV0sIHJlc3VsdFtqXSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICBqLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5leHBvcnQgY29uc3QgdGltZVRleHQgPSAocG9zdGVkT24sIGV4cGlyZSA9IDEyLjUpID0+IHtcclxuICAgIGNvbnN0IGFnbyA9IG1vbWVudChwb3N0ZWRPbikuZnJvbU5vdygpO1xyXG4gICAgY29uc3QgZGlmZiA9IG1vbWVudCgpLmRpZmYocG9zdGVkT24sIFwiaG91cnNcIiwgdHJ1ZSk7XHJcbiAgICBpZiAoZGlmZiA+PSBleHBpcmUpIHtcclxuICAgICAgICBjb25zdCBkYXRlID0gbW9tZW50KHBvc3RlZE9uKTtcclxuICAgICAgICByZXR1cm4gYGQuICR7ZGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKX0ga2wuICR7ZGF0ZS5mb3JtYXQoXCJIOm1tXCIpfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gXCJmb3IgXCIgKyBhZ287XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmb3JtYXRUZXh0ID0gKHRleHQpID0+IHtcclxuICAgIGlmICghdGV4dClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHJhd01hcmt1cCA9IG1hcmtlZCh0ZXh0LCB7IHNhbml0aXplOiB0cnVlIH0pO1xyXG4gICAgcmV0dXJuIHsgX19odG1sOiByYXdNYXJrdXAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldFdvcmRzID0gKHRleHQsIG51bWJlck9mV29yZHMpID0+IHtcclxuICAgIGlmICghdGV4dClcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIGNvbnN0IHBsYWluVGV4dCA9IHJlbW92ZU1kKHRleHQpO1xyXG4gICAgcmV0dXJuIHBsYWluVGV4dC5zcGxpdCgvXFxzKy8pLnNsaWNlKDAsIG51bWJlck9mV29yZHMpLmpvaW4oXCIgXCIpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0RnVsbE5hbWUgPSAodXNlciwgbm9uZSA9IFwiXCIpID0+IHtcclxuICAgIGlmICghdXNlcilcclxuICAgICAgICByZXR1cm4gbm9uZTtcclxuICAgIHJldHVybiBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWA7XHJcbn07XHJcbmV4cG9ydCBjb25zdCB2aXNpdENvbW1lbnRzID0gKGNvbW1lbnRzLCBmdW5jKSA9PiB7XHJcbiAgICBjb25zdCBnZXRSZXBsaWVzID0gKGMpID0+IGMuUmVwbGllcyA/IGMuUmVwbGllcyA6IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21tZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRlcHRoRmlyc3RTZWFyY2goY29tbWVudHNbaV0sIGdldFJlcGxpZXMsIGZ1bmMpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgZGVwdGhGaXJzdFNlYXJjaCA9IChjdXJyZW50LCBnZXRDaGlsZHJlbiwgZnVuYykgPT4ge1xyXG4gICAgZnVuYyhjdXJyZW50KTtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gZ2V0Q2hpbGRyZW4oY3VycmVudCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjaGlsZHJlbltpXSwgZ2V0Q2hpbGRyZW4sIGZ1bmMpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplQ29tbWVudCA9IChjb21tZW50KSA9PiB7XHJcbiAgICBsZXQgciA9IGNvbW1lbnQuUmVwbGllcyA/IGNvbW1lbnQuUmVwbGllcyA6IFtdO1xyXG4gICAgY29uc3QgcmVwbGllcyA9IHIubWFwKG5vcm1hbGl6ZUNvbW1lbnQpO1xyXG4gICAgY29uc3QgYXV0aG9ySWQgPSAoY29tbWVudC5EZWxldGVkKSA/IC0xIDogY29tbWVudC5BdXRob3IuSUQ7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIENvbW1lbnRJRDogY29tbWVudC5JRCxcclxuICAgICAgICBBdXRob3JJRDogYXV0aG9ySWQsXHJcbiAgICAgICAgRGVsZXRlZDogY29tbWVudC5EZWxldGVkLFxyXG4gICAgICAgIFBvc3RlZE9uOiBjb21tZW50LlBvc3RlZE9uLFxyXG4gICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICBSZXBsaWVzOiByZXBsaWVzLFxyXG4gICAgICAgIEVkaXRlZDogY29tbWVudC5FZGl0ZWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBnZXRGb3J1bUNvbW1lbnRzRGVsZXRlVXJsID0gKGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIGAke2dsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzfT9jb21tZW50SWQ9JHtjb21tZW50SWR9YDtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldEZvcnVtQ29tbWVudHNQYWdlVXJsID0gKHBvc3RJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIGAke2dsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzfT9wb3N0SWQ9JHtwb3N0SWR9JnNraXA9JHtza2lwfSZ0YWtlPSR7dGFrZX1gO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0SW1hZ2VDb21tZW50c1BhZ2VVcmwgPSAoaW1hZ2VJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIGAke2dsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzfT9pbWFnZUlkPSR7aW1hZ2VJZH0mc2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsID0gKGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIGAke2dsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzfT9jb21tZW50SWQ9JHtjb21tZW50SWR9YDtcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUxhdGVzdCA9IChsYXRlc3QpID0+IHtcclxuICAgIGxldCBpdGVtID0gbnVsbDtcclxuICAgIGxldCBhdXRob3JJZCA9IC0xO1xyXG4gICAgaWYgKGxhdGVzdC5UeXBlID09PSAxKSB7XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBsYXRlc3QuSXRlbTtcclxuICAgICAgICBpdGVtID0ge1xyXG4gICAgICAgICAgICBFeHRlbnNpb246IGltYWdlLkV4dGVuc2lvbixcclxuICAgICAgICAgICAgRmlsZW5hbWU6IGltYWdlLkZpbGVuYW1lLFxyXG4gICAgICAgICAgICBJbWFnZUlEOiBpbWFnZS5JbWFnZUlELFxyXG4gICAgICAgICAgICBPcmlnaW5hbFVybDogaW1hZ2UuT3JpZ2luYWxVcmwsXHJcbiAgICAgICAgICAgIFByZXZpZXdVcmw6IGltYWdlLlByZXZpZXdVcmwsXHJcbiAgICAgICAgICAgIFRodW1ibmFpbFVybDogaW1hZ2UuVGh1bWJuYWlsVXJsLFxyXG4gICAgICAgICAgICBVcGxvYWRlZDogaW1hZ2UuVXBsb2FkZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGF1dGhvcklkID0gaW1hZ2UuQXV0aG9yLklEO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobGF0ZXN0LlR5cGUgPT09IDIpIHtcclxuICAgICAgICBjb25zdCBjb21tZW50ID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgSUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogY29tbWVudC5JbWFnZUlELFxyXG4gICAgICAgICAgICBJbWFnZVVwbG9hZGVkQnk6IGNvbW1lbnQuSW1hZ2VVcGxvYWRlZEJ5LFxyXG4gICAgICAgICAgICBGaWxlbmFtZTogY29tbWVudC5GaWxlbmFtZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYXV0aG9ySWQgPSBjb21tZW50LkF1dGhvci5JRDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxhdGVzdC5UeXBlID09PSA0KSB7XHJcbiAgICAgICAgY29uc3QgcG9zdCA9IGxhdGVzdC5JdGVtO1xyXG4gICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIElEOiBwb3N0LlRocmVhZElELFxyXG4gICAgICAgICAgICBUaXRsZTogcG9zdC5IZWFkZXIuVGl0bGUsXHJcbiAgICAgICAgICAgIFRleHQ6IHBvc3QuVGV4dCxcclxuICAgICAgICAgICAgU3RpY2t5OiBwb3N0LkhlYWRlci5TdGlja3ksXHJcbiAgICAgICAgICAgIENvbW1lbnRDb3VudDogcG9zdC5IZWFkZXIuQ29tbWVudENvdW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICBhdXRob3JJZCA9IHBvc3QuSGVhZGVyLkF1dGhvci5JRDtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSUQ6IGxhdGVzdC5JRCxcclxuICAgICAgICBUeXBlOiBsYXRlc3QuVHlwZSxcclxuICAgICAgICBJdGVtOiBpdGVtLFxyXG4gICAgICAgIE9uOiBsYXRlc3QuT24sXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUltYWdlID0gKGltZykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBJbWFnZUlEOiBpbWcuSW1hZ2VJRCxcclxuICAgICAgICBGaWxlbmFtZTogaW1nLkZpbGVuYW1lLFxyXG4gICAgICAgIEV4dGVuc2lvbjogaW1nLkV4dGVuc2lvbixcclxuICAgICAgICBPcmlnaW5hbFVybDogaW1nLk9yaWdpbmFsVXJsLFxyXG4gICAgICAgIFByZXZpZXdVcmw6IGltZy5QcmV2aWV3VXJsLFxyXG4gICAgICAgIFRodW1ibmFpbFVybDogaW1nLlRodW1ibmFpbFVybCxcclxuICAgICAgICBDb21tZW50Q291bnQ6IGltZy5Db21tZW50Q291bnQsXHJcbiAgICAgICAgVXBsb2FkZWQ6IG5ldyBEYXRlKGltZy5VcGxvYWRlZCksXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplVGhyZWFkVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIGNvbnN0IHZpZXdlZEJ5ID0gdGl0bGUuVmlld2VkQnkubWFwKHVzZXIgPT4gdXNlci5JRCk7XHJcbiAgICBjb25zdCBsYXRlc3RDb21tZW50ID0gdGl0bGUuTGF0ZXN0Q29tbWVudCA/IG5vcm1hbGl6ZUNvbW1lbnQodGl0bGUuTGF0ZXN0Q29tbWVudCkgOiBudWxsO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBJRDogdGl0bGUuSUQsXHJcbiAgICAgICAgSXNQdWJsaXNoZWQ6IHRpdGxlLklzUHVibGlzaGVkLFxyXG4gICAgICAgIFN0aWNreTogdGl0bGUuU3RpY2t5LFxyXG4gICAgICAgIENyZWF0ZWRPbjogdGl0bGUuQ3JlYXRlZE9uLFxyXG4gICAgICAgIEF1dGhvcklEOiB0aXRsZS5BdXRob3IuSUQsXHJcbiAgICAgICAgRGVsZXRlZDogdGl0bGUuRGVsZXRlZCxcclxuICAgICAgICBJc01vZGlmaWVkOiB0aXRsZS5Jc01vZGlmaWVkLFxyXG4gICAgICAgIFRpdGxlOiB0aXRsZS5UaXRsZSxcclxuICAgICAgICBMYXN0TW9kaWZpZWQ6IHRpdGxlLkxhc3RNb2RpZmllZCxcclxuICAgICAgICBMYXRlc3RDb21tZW50OiBsYXRlc3RDb21tZW50LFxyXG4gICAgICAgIENvbW1lbnRDb3VudDogdGl0bGUuQ29tbWVudENvdW50LFxyXG4gICAgICAgIFZpZXdlZEJ5OiB2aWV3ZWRCeSxcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVDb21tZW50ID0gKGNvbW1lbnQpID0+IHtcclxuICAgIGxldCByID0gY29tbWVudC5SZXBsaWVzID8gY29tbWVudC5SZXBsaWVzIDogW107XHJcbiAgICBjb25zdCByZXBsaWVzID0gci5tYXAobm9ybWFsaXplQ29tbWVudCk7XHJcbiAgICBjb25zdCBhdXRob3JJZCA9IChjb21tZW50LkRlbGV0ZWQpID8gLTEgOiBjb21tZW50LkF1dGhvci5JRDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgQ29tbWVudElEOiBjb21tZW50LklELFxyXG4gICAgICAgIEF1dGhvcklEOiBhdXRob3JJZCxcclxuICAgICAgICBEZWxldGVkOiBjb21tZW50LkRlbGV0ZWQsXHJcbiAgICAgICAgUG9zdGVkT246IGNvbW1lbnQuUG9zdGVkT24sXHJcbiAgICAgICAgVGV4dDogY29tbWVudC5UZXh0LFxyXG4gICAgICAgIFJlcGxpZXM6IHJlcGxpZXMsXHJcbiAgICAgICAgRWRpdGVkOiBjb21tZW50LkVkaXRlZFxyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0ICogYXMgZmV0Y2ggZnJvbSBcImlzb21vcnBoaWMtZmV0Y2hcIjtcclxuaW1wb3J0IHsgb3B0aW9ucywgb2JqTWFwLCByZXNwb25zZUhhbmRsZXIgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmV4cG9ydCBjb25zdCBhZGRVc2VyID0gKHVzZXIpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjEsXHJcbiAgICAgICAgcGF5bG9hZDogdXNlclxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEN1cnJlbnRVc2VySWQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjAsXHJcbiAgICAgICAgcGF5bG9hZDogaWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCByZWNpZXZlZFVzZXJzID0gKHVzZXJzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDIyLFxyXG4gICAgICAgIHBheWxvYWQ6IHVzZXJzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hDdXJyZW50VXNlciA9ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHtnbG9iYWxzLnVybHMudXNlcnN9P3VzZXJuYW1lPSR7dXNlcm5hbWV9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbih1c2VyID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0Q3VycmVudFVzZXJJZCh1c2VyLklEKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIodXNlcikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoVXNlciA9ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHtnbG9iYWxzLnVybHMudXNlcnN9P3VzZXJuYW1lPSR7dXNlcm5hbWV9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbih1c2VyID0+IHsgZGlzcGF0Y2goYWRkVXNlcih1c2VyKSk7IH0pO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoVXNlcnMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGdsb2JhbHMudXJscy51c2Vycywgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlcnMgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBnZXRLZXkgPSAodXNlcikgPT4gdXNlci5JRDtcclxuICAgICAgICAgICAgY29uc3QgZ2V0VmFsdWUgPSAodXNlcikgPT4gdXNlcjtcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gb2JqTWFwKHVzZXJzLCBnZXRLZXksIGdldFZhbHVlKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVjaWV2ZWRVc2VycyhvYmopKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbiIsImltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb3B0aW9ucyB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgbm9ybWFsaXplTGF0ZXN0IGFzIG5vcm1hbGl6ZSB9IGZyb20gXCIuLi91dGlsaXRpZXMvbm9ybWFsaXplXCI7XHJcbmltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tIFwiLi4vYWN0aW9ucy91c2Vyc1wiO1xyXG5leHBvcnQgY29uc3Qgc2V0TGF0ZXN0ID0gKGxhdGVzdCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA1LFxyXG4gICAgICAgIHBheWxvYWQ6IGxhdGVzdFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFNraXAgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA2LFxyXG4gICAgICAgIHBheWxvYWQ6IHNraXBcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRUYWtlID0gKHRha2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNyxcclxuICAgICAgICBwYXlsb2FkOiB0YWtlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0UGFnZSA9IChwYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDgsXHJcbiAgICAgICAgcGF5bG9hZDogcGFnZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRvdGFsUGFnZXMgPSAodG90YWxQYWdlcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA5LFxyXG4gICAgICAgIHBheWxvYWQ6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaExhdGVzdE5ld3MgPSAoc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy53aGF0c25ld30/c2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4ocGFnZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gcGFnZS5DdXJyZW50SXRlbXM7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRBdXRob3IoaXRlbS5UeXBlLCBpdGVtLkl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGF1dGhvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIoYXV0aG9yKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwKHNraXApKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZSh0YWtlKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFBhZ2UocGFnZS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFBhZ2VzKHBhZ2UuVG90YWxQYWdlcykpO1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gaXRlbXMubWFwKG5vcm1hbGl6ZSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldExhdGVzdChub3JtYWxpemVkKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBnZXRBdXRob3IgPSAodHlwZSwgaXRlbSkgPT4ge1xyXG4gICAgbGV0IGF1dGhvciA9IG51bGw7XHJcbiAgICBpZiAodHlwZSA9PT0gNCkge1xyXG4gICAgICAgIGF1dGhvciA9IGl0ZW0uSGVhZGVyLkF1dGhvcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGF1dGhvciA9IGl0ZW0uQXV0aG9yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF1dGhvcjtcclxufTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEJ1dHRvbiwgR2x5cGhpY29uLCBGb3JtQ29udHJvbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGhhc0ZpbGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc2V0SGFzRmlsZSA9IHRoaXMuc2V0SGFzRmlsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRGVzY3JpcHRpb25DaGFuZ2UgPSB0aGlzLmhhbmRsZURlc2NyaXB0aW9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZEZpbGVzID0gdGhpcy5yZW1vdmVTZWxlY3RlZEZpbGVzLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy51cGxvYWRCdXR0b25WaWV3ID0gdGhpcy51cGxvYWRCdXR0b25WaWV3LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjbGVhcklucHV0KGZpbGVJbnB1dCkge1xyXG4gICAgICAgIGlmIChmaWxlSW5wdXQudmFsdWUpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikgeyB9XHJcbiAgICAgICAgICAgIGlmIChmaWxlSW5wdXQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksIHBhcmVudE5vZGUgPSBmaWxlSW5wdXQucGFyZW50Tm9kZSwgcmVmID0gZmlsZUlucHV0Lm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChmaWxlSW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZmlsZUlucHV0LCByZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0RmlsZXMoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIHJldHVybiAoZmlsZXMgPyBmaWxlcy5maWxlcyA6IFtdKTtcclxuICAgIH1cclxuICAgIGhhbmRsZVN1Ym1pdChlKSB7XHJcbiAgICAgICAgY29uc3QgeyB1cGxvYWRJbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSBmaWxlSW5wdXQuZmlsZXM7XHJcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xyXG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJmaWxlXCIsIGZpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1cGxvYWRJbWFnZSh1c2VybmFtZSwgZm9ybURhdGEpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJJbnB1dChmaWxlSW5wdXQpO1xyXG4gICAgfVxyXG4gICAgc2V0SGFzRmlsZSgpIHtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZmlsZUlucHV0LmZpbGVzO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZpbGVzLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIGhhc0ZpbGU6IHJlc3VsdCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGhhbmRsZURlc2NyaXB0aW9uQ2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVTZWxlY3RlZEZpbGVzKCkge1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgdGhpcy5jbGVhcklucHV0KGZpbGVJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIGhhc0ZpbGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc2hvd0Rlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5oYXNGaWxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyBpZDogXCJkZXNjcmlwdGlvblwiLCB0eXBlOiBcInRleHRcIiwgdmFsdWU6IHRoaXMuc3RhdGUuZGVzY3JpcHRpb24sIHBsYWNlaG9sZGVyOiBcIkJlc2tyaXYgYmlsbGVkZXQuLi5cIiwgcm93czogNTAsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZURlc2NyaXB0aW9uQ2hhbmdlIH0pLFxyXG4gICAgICAgICAgICBcIlxcdTAwQTBcIixcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogXCJ3YXJuaW5nXCIsIG9uQ2xpY2s6IHRoaXMucmVtb3ZlU2VsZWN0ZWRGaWxlcyB9LCBcIiBGb3J0cnlkXCIpKTtcclxuICAgIH1cclxuICAgIHVwbG9hZEJ1dHRvblZpZXcoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmhhc0ZpbGUpXHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgZGlzYWJsZWQ6IHRydWUsIHR5cGU6IFwic3VibWl0XCIgfSwgXCIgVXBsb2FkXCIpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgdHlwZTogXCJzdWJtaXRcIiB9LCBcIlVwbG9hZFwiKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwgeyBvblN1Ym1pdDogdGhpcy5oYW5kbGVTdWJtaXQsIGlkOiBcImZvcm0tdXBsb2FkXCIsIGNsYXNzTmFtZTogXCJmb3JtLWlubGluZVwiLCBlbmNUeXBlOiBcIm11bHRpcGFydC9mb3JtLWRhdGFcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImZvcm0tZ3JvdXBcIiB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHsgaHRtbEZvcjogXCJmaWxlc1wiLCBjbGFzc05hbWU6IFwiaGlkZS1pbnB1dFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwiY2FtZXJhXCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgVlxcdTAwRTZsZyBmaWxlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7IHR5cGU6IFwiZmlsZVwiLCBpZDogXCJmaWxlc1wiLCBuYW1lOiBcImZpbGVzXCIsIG9uQ2hhbmdlOiB0aGlzLnNldEhhc0ZpbGUsIG11bHRpcGxlOiB0cnVlIH0pKSxcclxuICAgICAgICAgICAgICAgIFwiXFx1MDBBMCBcIixcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Rlc2NyaXB0aW9uKCksXHJcbiAgICAgICAgICAgICAgICBcIiBcXHUwMEEwXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZEJ1dHRvblZpZXcoKSksXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tIFwiLi91c2Vyc1wiO1xyXG5pbXBvcnQgeyBvYmpNYXAsIHJlc3BvbnNlSGFuZGxlciwgb3B0aW9ucyB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgbm9ybWFsaXplSW1hZ2UgYXMgbm9ybWFsaXplIH0gZnJvbSBcIi4uL3V0aWxpdGllcy9ub3JtYWxpemVcIjtcclxuZXhwb3J0IGNvbnN0IHNldEltYWdlc093bmVyID0gKGlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDEwLFxyXG4gICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgcmVjaWV2ZWRVc2VySW1hZ2VzID0gKGltYWdlcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxMSxcclxuICAgICAgICBwYXlsb2FkOiBpbWFnZXNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZEltZyA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxMixcclxuICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGFkZEltYWdlID0gKGltZykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxMyxcclxuICAgICAgICBwYXlsb2FkOiBpbWdcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCByZW1vdmVJbWFnZSA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxNCxcclxuICAgICAgICBwYXlsb2FkOiB7IEltYWdlSUQ6IGlkIH1cclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBhZGRTZWxlY3RlZEltYWdlSWQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTUsXHJcbiAgICAgICAgcGF5bG9hZDogaWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCByZW1vdmVTZWxlY3RlZEltYWdlSWQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTYsXHJcbiAgICAgICAgcGF5bG9hZDogaWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBjbGVhclNlbGVjdGVkSW1hZ2VJZHMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDE3LFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGluY3JlbWVudENvbW1lbnRDb3VudCA9IChpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDE4LFxyXG4gICAgICAgIHBheWxvYWQ6IHsgSW1hZ2VJRDogaW1hZ2VJZCB9XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVjcmVtZW50Q29tbWVudENvdW50ID0gKGltYWdlSWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTksXHJcbiAgICAgICAgcGF5bG9hZDogeyBJbWFnZUlEOiBpbWFnZUlkIH1cclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBuZXdJbWFnZUZyb21TZXJ2ZXIgPSAoaW1hZ2UpID0+IHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemUoaW1hZ2UpO1xyXG4gICAgcmV0dXJuIGFkZEltYWdlKG5vcm1hbGl6ZWQpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVsZXRlSW1hZ2UgPSAoaWQsIHVzZXJuYW1lKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlc30/dXNlcm5hbWU9JHt1c2VybmFtZX0maWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkoKHIpID0+IHIuanNvbigpKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4geyBkaXNwYXRjaChyZW1vdmVJbWFnZShpZCkpOyB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKHJlYXNvbikgPT4gY29uc29sZS5sb2cocmVhc29uKSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCB1cGxvYWRJbWFnZSA9ICh1c2VybmFtZSwgZm9ybURhdGEsIG9uU3VjY2Vzcywgb25FcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5pbWFnZXN9P3VzZXJuYW1lPSR7dXNlcm5hbWV9YDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkoXyA9PiBudWxsKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzcywgb25FcnJvcik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hVc2VySW1hZ2VzID0gKHVzZXJuYW1lKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlc30/dXNlcm5hbWU9JHt1c2VybmFtZX1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBkYXRhLm1hcChub3JtYWxpemUpLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gb2JqTWFwKG5vcm1hbGl6ZWQsIChpbWcpID0+IGltZy5JbWFnZUlELCAoaW1nKSA9PiBpbWcpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNpZXZlZFVzZXJJbWFnZXMob2JqKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVsZXRlSW1hZ2VzID0gKHVzZXJuYW1lLCBpbWFnZUlkcyA9IFtdKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaWRzID0gaW1hZ2VJZHMuam9pbihcIixcIik7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlc30/dXNlcm5hbWU9JHt1c2VybmFtZX0maWRzPSR7aWRzfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4geyBkaXNwYXRjaChjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSk7IH0pXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHsgZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSk7IH0pO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEltYWdlT3duZXIgPSAodXNlcm5hbWUpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmluZE93bmVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VycyA9IGdldFN0YXRlKCkudXNlcnNJbmZvLnVzZXJzO1xyXG4gICAgICAgICAgICBsZXQgdXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiB1c2Vycykge1xyXG4gICAgICAgICAgICAgICAgdXNlciA9IHVzZXJzW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodXNlci5Vc2VybmFtZSA9IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHVzZXI7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgb3duZXIgPSBmaW5kT3duZXIoKTtcclxuICAgICAgICBpZiAob3duZXIpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3duZXJJZCA9IG93bmVyLklEO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lcklkKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy51c2Vyc30/dXNlcm5hbWU9JHt1c2VybmFtZX1gO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbih1c2VyID0+IHsgZGlzcGF0Y2goYWRkVXNlcih1c2VyKSk7IH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvd25lciA9IGZpbmRPd25lcigpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0SW1hZ2VzT3duZXIob3duZXIuSUQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoU2luZ2xlSW1hZ2UgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuaW1hZ2VzfS9nZXRieWlkP2lkPSR7aWR9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihpbWcgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWltZylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZEltYWdlID0gbm9ybWFsaXplKGltZyk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFkZEltYWdlKG5vcm1hbGl6ZWRJbWFnZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0IHsgcmVzcG9uc2VIYW5kbGVyLCBvcHRpb25zIH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgKiBhcyBmZXRjaCBmcm9tIFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5leHBvcnQgY29uc3Qgc2V0VXNlZFNwYWNla0IgPSAodXNlZFNwYWNlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDMyLFxyXG4gICAgICAgIHBheWxvYWQ6IHVzZWRTcGFjZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRvdGFsU3BhY2VrQiA9ICh0b3RhbFNwYWNlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDMzLFxyXG4gICAgICAgIHBheWxvYWQ6IHRvdGFsU3BhY2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFNwYWNlSW5mbyA9ICh1cmwpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlZFNwYWNlID0gZGF0YS5Vc2VkU3BhY2VLQjtcclxuICAgICAgICAgICAgY29uc3QgdG90YWxTcGFjZSA9IGRhdGEuU3BhY2VRdW90YUtCO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRVc2VkU3BhY2VrQih1c2VkU3BhY2UpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxTcGFjZWtCKHRvdGFsU3BhY2UpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBQcm9ncmVzc0JhciB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgZmV0Y2hTcGFjZUluZm8gfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9zdGF0dXNcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVzZWRNQjogKHN0YXRlLnN0YXR1c0luZm8uc3BhY2VJbmZvLnVzZWRTcGFjZWtCIC8gMTAwMCksXHJcbiAgICAgICAgdG90YWxNQjogKHN0YXRlLnN0YXR1c0luZm8uc3BhY2VJbmZvLnRvdGFsU3BhY2VrQiAvIDEwMDApLFxyXG4gICAgICAgIGxvYWRlZDogKHN0YXRlLnN0YXR1c0luZm8uc3BhY2VJbmZvLnRvdGFsU3BhY2VrQiAhPT0gLTEpXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0U3BhY2VJbmZvOiAodXJsKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoU3BhY2VJbmZvKHVybCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFVzZWRTcGFjZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBnZXRTcGFjZUluZm8gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmRpYWdub3N0aWNzfS9nZXRzcGFjZWluZm9gO1xyXG4gICAgICAgIGdldFNwYWNlSW5mbyh1cmwpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlZE1CLCB0b3RhbE1CIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsID0gTWF0aC5yb3VuZCh0b3RhbE1CKTtcclxuICAgICAgICBjb25zdCB1c2VkID0gTWF0aC5yb3VuZCh1c2VkTUIgKiAxMDApIC8gMTAwO1xyXG4gICAgICAgIGNvbnN0IGZyZWUgPSBNYXRoLnJvdW5kKCh0b3RhbCAtIHVzZWQpICogMTAwKSAvIDEwMDtcclxuICAgICAgICBjb25zdCB1c2VkUGVyY2VudCA9ICgodXNlZCAvIHRvdGFsKSAqIDEwMCk7XHJcbiAgICAgICAgY29uc3QgcGVyY2VudFJvdW5kID0gTWF0aC5yb3VuZCh1c2VkUGVyY2VudCAqIDEwMCkgLyAxMDA7XHJcbiAgICAgICAgY29uc3Qgc2hvdyA9IEJvb2xlYW4odXNlZFBlcmNlbnQpICYmIEJvb2xlYW4odXNlZCkgJiYgQm9vbGVhbihmcmVlKSAmJiBCb29sZWFuKHRvdGFsKTtcclxuICAgICAgICBpZiAoIXNob3cpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb2dyZXNzQmFyLCB7IHN0cmlwZWQ6IHRydWUsIGJzU3R5bGU6IFwic3VjY2Vzc1wiLCBub3c6IHVzZWRQZXJjZW50LCBrZXk6IDEgfSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQnJ1Z3Q6IFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZWQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBcIiBNQiAoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudFJvdW5kLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgJSlcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJGcmkgcGxhZHM6IFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyZWUudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBcIiBNQlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICBcIlRvdGFsOiBcIixcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIE1CXCIpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgVXNlZFNwYWNlID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlZFNwYWNlVmlldyk7XHJcbmV4cG9ydCBkZWZhdWx0IFVzZWRTcGFjZTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEltYWdlLCBNZWRpYSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIENvbW1lbnRQcm9maWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MZWZ0LCB7IGNsYXNzTmFtZTogXCJjb21tZW50LXByb2ZpbGVcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlLCB7IHNyYzogXCIvaW1hZ2VzL3BlcnNvbl9pY29uLnN2Z1wiLCBzdHlsZTogeyB3aWR0aDogXCI2NHB4XCIsIGhlaWdodDogXCI2NHB4XCIgfSwgY2xhc3NOYW1lOiBcIm1lZGlhLW9iamVjdFwiIH0pLFxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgT3ZlcmxheVRyaWdnZXIsIFRvb2x0aXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld1Rvb2x0aXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgdG9vbHRpcFZpZXcodGlwKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9vbHRpcCwgeyBpZDogXCJ0b29sdGlwXCIgfSwgdGlwKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRvb2x0aXAsIGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE92ZXJsYXlUcmlnZ2VyLCB7IHBsYWNlbWVudDogXCJsZWZ0XCIsIG92ZXJsYXk6IHRoaXMudG9vbHRpcFZpZXcodG9vbHRpcCkgfSwgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50UHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBXaGF0c05ld1Rvb2x0aXAgfSBmcm9tIFwiLi9XaGF0c05ld1Rvb2x0aXBcIjtcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IHRpbWVUZXh0IH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBJbWFnZSwgR2x5cGhpY29uLCBUb29sdGlwIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdJdGVtSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgd2hlbigpIHtcclxuICAgICAgICBjb25zdCB7IG9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBcInVwbG9hZGVkZSBcIiArIHRpbWVUZXh0KG9uKTtcclxuICAgIH1cclxuICAgIG92ZXJsYXkoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9vbHRpcCwgeyBpZDogXCJ0b29sdGlwX2ltZ1wiIH0sIFwiQnJ1Z2VyIGJpbGxlZGVcIik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCBhdXRob3IsIGZpbGVuYW1lLCBleHRlbnNpb24sIHRodW1ibmFpbCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGF1dGhvci5Vc2VybmFtZTtcclxuICAgICAgICBjb25zdCBmaWxlID0gYCR7ZmlsZW5hbWV9LiR7ZXh0ZW5zaW9ufWA7XHJcbiAgICAgICAgY29uc3QgbGluayA9IGAke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2VJZH1gO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHthdXRob3IuRmlyc3ROYW1lfSAke2F1dGhvci5MYXN0TmFtZX1gO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFdoYXRzTmV3VG9vbHRpcCwgeyB0b29sdGlwOiBcIlVwbG9hZGV0IGJpbGxlZGVcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3RJdGVtLCB7IGNsYXNzTmFtZTogXCJ3aGF0c25ld0l0ZW0gaG92ZXItc2hhZG93XCIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudFByb2ZpbGUsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5Cb2R5LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJibG9ja3F1b3RlXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogbGluayB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbWFnZSwgeyBzcmM6IHRodW1ibmFpbCwgdGh1bWJuYWlsOiB0cnVlIH0pKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvb3RlclwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aGVuKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJwaWN0dXJlXCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUpKSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudFByb2ZpbGVcIjtcclxuaW1wb3J0IHsgV2hhdHNOZXdUb29sdGlwIH0gZnJvbSBcIi4vV2hhdHNOZXdUb29sdGlwXCI7XHJcbmltcG9ydCB7IGZvcm1hdFRleHQsIGdldFdvcmRzLCB0aW1lVGV4dCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgTGluayB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuaW1wb3J0IHsgTWVkaWEsIEdseXBoaWNvbiB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3SXRlbUNvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY3JlYXRlU3VtbWFyeSgpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRleHQoZ2V0V29yZHModGV4dCwgNSkgKyBcIi4uLlwiKTtcclxuICAgIH1cclxuICAgIGZ1bGxuYW1lKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBhdXRob3IgPyBhdXRob3IuRmlyc3ROYW1lICsgXCIgXCIgKyBhdXRob3IuTGFzdE5hbWUgOiBcIlVzZXJcIjtcclxuICAgIH1cclxuICAgIHdoZW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJzYWdkZSBcIiArIHRpbWVUZXh0KG9uKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIHVwbG9hZGVkQnksIGNvbW1lbnRJZCwgZmlsZW5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWUgPSB1cGxvYWRlZEJ5LlVzZXJuYW1lO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmZ1bGxuYW1lKCk7XHJcbiAgICAgICAgY29uc3Qgc3VtbWFyeSA9IHRoaXMuY3JlYXRlU3VtbWFyeSgpO1xyXG4gICAgICAgIGNvbnN0IGxpbmsgPSBgJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlSWR9L2NvbW1lbnQ/aWQ9JHtjb21tZW50SWR9YDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChXaGF0c05ld1Rvb2x0aXAsIHsgdG9vbHRpcDogXCJLb21tZW50YXJcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3RJdGVtLCB7IGNsYXNzTmFtZTogXCJ3aGF0c25ld0l0ZW0gaG92ZXItc2hhZG93XCIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudFByb2ZpbGUsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5Cb2R5LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJibG9ja3F1b3RlXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogbGluayB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImVtXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgeyBkYW5nZXJvdXNseVNldElubmVySFRNTDogc3VtbWFyeSB9KSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndoZW4oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcImNvbW1lbnRcIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWUpKSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgV2hhdHNOZXdUb29sdGlwIH0gZnJvbSBcIi4vV2hhdHNOZXdUb29sdGlwXCI7XHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlXCI7XHJcbmltcG9ydCB7IGdldFdvcmRzLCB0aW1lVGV4dCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgTWVkaWEsIEdseXBoaWNvbiwgVG9vbHRpcCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3Rm9ydW1Qb3N0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gdGhpcy5zaG93TW9kYWwuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGZ1bGxuYW1lKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBhdXRob3IuRmlyc3ROYW1lICsgXCIgXCIgKyBhdXRob3IuTGFzdE5hbWU7XHJcbiAgICB9XHJcbiAgICB3aGVuKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFwiaW5kbMOmZyBcIiArIHRpbWVUZXh0KG9uKTtcclxuICAgIH1cclxuICAgIHN1bW1hcnkoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBnZXRXb3Jkcyh0ZXh0LCA1KTtcclxuICAgIH1cclxuICAgIG92ZXJsYXkoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50Q291bnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9vbHRpcCwgeyBpZDogXCJ0b29sdGlwX3Bvc3RcIiB9LFxyXG4gICAgICAgICAgICBcIkZvcnVtIGluZGxcXHUwMEU2ZywgYW50YWwga29tbWVudGFyZXI6IFwiLFxyXG4gICAgICAgICAgICBjb21tZW50Q291bnQpO1xyXG4gICAgfVxyXG4gICAgc2hvd01vZGFsKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCB7IHByZXZpZXcsIGluZGV4IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHByZXZpZXcoaW5kZXgpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMuZnVsbG5hbWUoKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChXaGF0c05ld1Rvb2x0aXAsIHsgdG9vbHRpcDogXCJGb3J1bSBpbmRsw6ZnXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MaXN0SXRlbSwgeyBjbGFzc05hbWU6IFwid2hhdHNuZXdJdGVtIGhvdmVyLXNoYWRvd1wiIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRQcm9maWxlLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYmxvY2txdW90ZVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IFwiI1wiLCBvbkNsaWNrOiB0aGlzLnNob3dNb2RhbCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdW1tYXJ5KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi4uLlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvb3RlclwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aGVuKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJsaXN0LWFsdFwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSkpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBXaGF0c05ld0l0ZW1JbWFnZSB9IGZyb20gXCIuL1doYXRzTmV3SXRlbUltYWdlXCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3SXRlbUNvbW1lbnQgfSBmcm9tIFwiLi9XaGF0c05ld0l0ZW1Db21tZW50XCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3Rm9ydW1Qb3N0IH0gZnJvbSBcIi4vV2hhdHNOZXdGb3J1bVBvc3RcIjtcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0xpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3UG9zdEhhbmRsZSA9IHRoaXMucHJldmlld1Bvc3RIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHByZXZpZXdQb3N0SGFuZGxlKGluZGV4KSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgcHJldmlldyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaW5kZXhdO1xyXG4gICAgICAgIHByZXZpZXcoaXRlbSk7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RJdGVtcygpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1zLCBnZXRVc2VyIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGdlbmVyYXRlS2V5ID0gKGlkKSA9PiBcIndoYXRzbmV3X1wiICsgaWQ7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaXRlbUtleSA9IGdlbmVyYXRlS2V5KGl0ZW0uSUQpO1xyXG4gICAgICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRVc2VyKGl0ZW0uQXV0aG9ySUQpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBpdGVtLkl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFdoYXRzTmV3SXRlbUltYWdlLCB7IG9uOiBpdGVtLk9uLCBpbWFnZUlkOiBpbWFnZS5JbWFnZUlELCBmaWxlbmFtZTogaW1hZ2UuRmlsZW5hbWUsIGV4dGVuc2lvbjogaW1hZ2UuRXh0ZW5zaW9uLCB0aHVtYm5haWw6IGltYWdlLlRodW1ibmFpbFVybCwgYXV0aG9yOiBhdXRob3IsIGtleTogaXRlbUtleSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21tZW50ID0gaXRlbS5JdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChXaGF0c05ld0l0ZW1Db21tZW50LCB7IGNvbW1lbnRJZDogY29tbWVudC5JRCwgdGV4dDogY29tbWVudC5UZXh0LCB1cGxvYWRlZEJ5OiBjb21tZW50LkltYWdlVXBsb2FkZWRCeSwgaW1hZ2VJZDogY29tbWVudC5JbWFnZUlELCBmaWxlbmFtZTogY29tbWVudC5GaWxlbmFtZSwgb246IGl0ZW0uT24sIGF1dGhvcjogYXV0aG9yLCBrZXk6IGl0ZW1LZXkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zdCA9IGl0ZW0uSXRlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdGb3J1bVBvc3QsIHsgb246IGl0ZW0uT24sIGF1dGhvcjogYXV0aG9yLCB0aXRsZTogcG9zdC5UaXRsZSwgdGV4dDogcG9zdC5UZXh0LCBzdGlja3k6IHBvc3QuU3RpY2t5LCBjb21tZW50Q291bnQ6IHBvc3QuQ29tbWVudENvdW50LCBwcmV2aWV3OiB0aGlzLnByZXZpZXdQb3N0SGFuZGxlLCBpbmRleDogaW5kZXgsIGtleTogaXRlbUtleSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbU5vZGVzID0gdGhpcy5jb25zdHJ1Y3RJdGVtcygpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3QsIG51bGwsIGl0ZW1Ob2Rlcyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEZvcm1Hcm91cCwgQ29udHJvbExhYmVsLCBGb3JtQ29udHJvbCwgQnV0dG9uLCBSb3csIENvbCwgTW9kYWwsIEJ1dHRvbkdyb3VwLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBGb3J1bUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgVGl0bGU6IFwiXCIsXHJcbiAgICAgICAgICAgIFRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgIFN0aWNreTogZmFsc2UsXHJcbiAgICAgICAgICAgIElzUHVibGlzaGVkOiB0cnVlLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXQgfSA9IG5leHRQcm9wcztcclxuICAgICAgICBpZiAoZWRpdCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBlZGl0LlRpdGxlLFxyXG4gICAgICAgICAgICAgICAgVGV4dDogZWRpdC5UZXh0LFxyXG4gICAgICAgICAgICAgICAgU3RpY2t5OiBlZGl0LlN0aWNreSxcclxuICAgICAgICAgICAgICAgIElzUHVibGlzaGVkOiBlZGl0LklzUHVibGlzaGVkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGhhbmRsZVRpdGxlQ2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGl0bGU6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0VmFsaWRhdGlvbigpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnN0YXRlLlRpdGxlLmxlbmd0aDtcclxuICAgICAgICBpZiAobGVuZ3RoID49IDAgJiYgbGVuZ3RoIDwgMjAwKVxyXG4gICAgICAgICAgICByZXR1cm4gXCJzdWNjZXNzXCI7XHJcbiAgICAgICAgaWYgKGxlbmd0aCA+PSAyMDAgJiYgbGVuZ3RoIDw9IDI1MClcclxuICAgICAgICAgICAgcmV0dXJuIFwid2FybmluZ1wiO1xyXG4gICAgICAgIHJldHVybiBcImVycm9yXCI7XHJcbiAgICB9XHJcbiAgICB0cmFuc2Zvcm1Ub0RUTyhzdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IHtcclxuICAgICAgICAgICAgSXNQdWJsaXNoZWQ6IHN0YXRlLklzUHVibGlzaGVkLFxyXG4gICAgICAgICAgICBTdGlja3k6IHN0YXRlLlN0aWNreSxcclxuICAgICAgICAgICAgVGl0bGU6IHN0YXRlLlRpdGxlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBIZWFkZXI6IGhlYWRlcixcclxuICAgICAgICAgICAgVGV4dDogc3RhdGUuVGV4dFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBoYW5kbGVTdWJtaXQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCB7IGNsb3NlLCBvblN1Ym1pdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBwb3N0ID0gdGhpcy50cmFuc2Zvcm1Ub0RUTyh0aGlzLnN0YXRlKTtcclxuICAgICAgICBvblN1Ym1pdChwb3N0KTtcclxuICAgICAgICBjbG9zZSgpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlU3RpY2t5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgU3RpY2t5IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBTdGlja3k6ICFTdGlja3kgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVQdWJsaXNoZWQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBJc1B1Ymxpc2hlZCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgSXNQdWJsaXNoZWQ6ICFJc1B1Ymxpc2hlZCB9KTtcclxuICAgIH1cclxuICAgIGNsb3NlSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xvc2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY2xvc2UoKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHNob3csIGVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVhZE1vZGUgPSBCb29sZWFuKCFlZGl0KTtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IHJlYWRNb2RlID8gXCJTa3JpdiBueXQgaW5kbMOmZ1wiIDogXCLDhm5kcmUgaW5kbMOmZ1wiO1xyXG4gICAgICAgIGNvbnN0IGJ0blN1Ym1pdCA9IHJlYWRNb2RlID8gXCJTa3JpdiBpbmRsw6ZnXCIgOiBcIkdlbSDDpm5kcmluZ2VyXCI7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwsIHsgc2hvdzogc2hvdywgb25IaWRlOiB0aGlzLmNsb3NlSGFuZGxlLmJpbmQodGhpcyksIGJzU2l6ZTogXCJsZ1wiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkhlYWRlciwgeyBjbG9zZUJ1dHRvbjogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuVGl0bGUsIG51bGwsIHRpdGxlKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxMiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgY29udHJvbElkOiBcImZvcm1Qb3N0VGl0bGVcIiwgdmFsaWRhdGlvblN0YXRlOiB0aGlzLmdldFZhbGlkYXRpb24oKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29udHJvbExhYmVsLCBudWxsLCBcIk92ZXJza3JpZnRcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiT3ZlcnNrcmlmdCBww6UgaW5kbMOmZy4uLlwiLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVUaXRsZUNoYW5nZS5iaW5kKHRoaXMpLCB2YWx1ZTogdGhpcy5zdGF0ZS5UaXRsZSB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBjb250cm9sSWQ6IFwiZm9ybVBvc3RDb250ZW50XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbnRyb2xMYWJlbCwgbnVsbCwgXCJJbmRsXFx1MDBFNmdcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyBjb21wb25lbnRDbGFzczogXCJ0ZXh0YXJlYVwiLCBwbGFjZWhvbGRlcjogXCJTa3JpdiBiZXNrZWQgaGVyLi4uXCIsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKSwgdmFsdWU6IHRoaXMuc3RhdGUuVGV4dCwgcm93czogOCB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBjb250cm9sSWQ6IFwiZm9ybVBvc3RTdGlja3lcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uR3JvdXAsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwic3VjY2Vzc1wiLCBic1NpemU6IFwic21hbGxcIiwgYWN0aXZlOiB0aGlzLnN0YXRlLlN0aWNreSwgb25DbGljazogdGhpcy5oYW5kbGVTdGlja3kuYmluZCh0aGlzKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicHVzaHBpblwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgVmlndGlnXCIpKSkpKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkZvb3RlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcImRlZmF1bHRcIiwgb25DbGljazogdGhpcy5jbG9zZUhhbmRsZS5iaW5kKHRoaXMpIH0sIFwiTHVrXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZVN1Ym1pdCB9LCBidG5TdWJtaXQpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQnV0dG9uVG9vbGJhciwgQnV0dG9uR3JvdXAsIE92ZXJsYXlUcmlnZ2VyLCBCdXR0b24sIEdseXBoaWNvbiwgVG9vbHRpcCwgQ29sbGFwc2UsIEZvcm1Hcm91cCwgRm9ybUNvbnRyb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBCdXR0b25Ub29sdGlwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRvb2x0aXAsIG9uQ2xpY2ssIGljb24sIGJzU3R5bGUsIGFjdGl2ZSwgbW91bnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbGV0IG92ZXJsYXlUaXAgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFRvb2x0aXAsIHsgaWQ6IFwidG9vbHRpcFwiIH0sIHRvb2x0aXApO1xyXG4gICAgICAgIGlmICghbW91bnQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE92ZXJsYXlUcmlnZ2VyLCB7IHBsYWNlbWVudDogXCJ0b3BcIiwgb3ZlcmxheTogb3ZlcmxheVRpcCB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBic1N0eWxlLCBic1NpemU6IFwieHNtYWxsXCIsIG9uQ2xpY2s6IG9uQ2xpY2ssIGFjdGl2ZTogYWN0aXZlIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogaWNvbiB9KSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Q29udHJvbHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGV4dDogcHJvcHMudGV4dCxcclxuICAgICAgICAgICAgcmVwbHlUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICByZXBseTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVkaXQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRvZ2dsZUVkaXQgPSB0aGlzLnRvZ2dsZUVkaXQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRvZ2dsZVJlcGx5ID0gdGhpcy50b2dnbGVSZXBseS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZWRpdEhhbmRsZSA9IHRoaXMuZWRpdEhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlIYW5kbGUgPSB0aGlzLnJlcGx5SGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVIYW5kbGUgPSB0aGlzLmRlbGV0ZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVwbHlDaGFuZ2UgPSB0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVSZXBseUNoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5VGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVFZGl0KCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogIWVkaXQgfSk7XHJcbiAgICAgICAgaWYgKCFlZGl0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdG9nZ2xlUmVwbHkoKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseSB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6ICFyZXBseSB9KTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUNvbW1lbnQsIGNvbW1lbnRJZCwgY29udGV4dElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBjb250ZXh0SWQpO1xyXG4gICAgfVxyXG4gICAgZWRpdEhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRDb21tZW50LCBjb250ZXh0SWQsIGNvbW1lbnRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IGZhbHNlIH0pO1xyXG4gICAgICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgY29udGV4dElkLCB0ZXh0KTtcclxuICAgIH1cclxuICAgIHJlcGx5SGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudElkLCBjb250ZXh0SWQsIHJlcGx5Q29tbWVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHJlcGx5VGV4dCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6IGZhbHNlLCByZXBseVRleHQ6IFwiXCIgfSk7XHJcbiAgICAgICAgcmVwbHlDb21tZW50KGNvbnRleHRJZCwgcmVwbHlUZXh0LCBjb21tZW50SWQpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9ySWQsIGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0LCB0ZXh0LCByZXBseSwgcmVwbHlUZXh0IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IG1vdW50ID0gY2FuRWRpdChhdXRob3JJZCk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBzdHlsZTogeyBwYWRkaW5nQm90dG9tOiBcIjVweFwiLCBwYWRkaW5nTGVmdDogXCIxNXB4XCIgfSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDQgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uR3JvdXAsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMuZGVsZXRlSGFuZGxlLCBpY29uOiBcInRyYXNoXCIsIHRvb2x0aXA6IFwic2xldFwiLCBtb3VudDogbW91bnQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMudG9nZ2xlRWRpdCwgaWNvbjogXCJwZW5jaWxcIiwgdG9vbHRpcDogXCLDpm5kcmVcIiwgYWN0aXZlOiBlZGl0LCBtb3VudDogbW91bnQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMudG9nZ2xlUmVwbHksIGljb246IFwiZW52ZWxvcGVcIiwgdG9vbHRpcDogXCJzdmFyXCIsIGFjdGl2ZTogcmVwbHksIG1vdW50OiB0cnVlIH0pKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsgc3R5bGU6IHsgcGFkZGluZ0JvdHRvbTogXCI1cHhcIiB9IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMSwgbGc6IDEwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2xsYXBzZVRleHRBcmVhLCB7IHNob3c6IGVkaXQsIGlkOiBcImVkaXRUZXh0Q29udHJvbFwiLCB2YWx1ZTogdGV4dCwgb25DaGFuZ2U6IHRoaXMuaGFuZGxlVGV4dENoYW5nZSwgdG9nZ2xlOiB0aGlzLnRvZ2dsZUVkaXQsIHNhdmU6IHRoaXMuZWRpdEhhbmRsZSwgc2F2ZVRleHQ6IFwiR2VtIMOmbmRyaW5nZXJcIiwgbW91bnQ6IG1vdW50IH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDEsIGxnOiAxMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sbGFwc2VUZXh0QXJlYSwgeyBzaG93OiByZXBseSwgaWQ6IFwicmVwbHlUZXh0Q29udHJvbFwiLCB2YWx1ZTogcmVwbHlUZXh0LCBvbkNoYW5nZTogdGhpcy5oYW5kbGVSZXBseUNoYW5nZSwgdG9nZ2xlOiB0aGlzLnRvZ2dsZVJlcGx5LCBzYXZlOiB0aGlzLnJlcGx5SGFuZGxlLCBzYXZlVGV4dDogXCJTdmFyXCIsIG1vdW50OiB0cnVlIH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIENvbGxhcHNlVGV4dEFyZWEgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2hvdywgaWQsIHZhbHVlLCBvbkNoYW5nZSwgdG9nZ2xlLCBzYXZlLCBzYXZlVGV4dCwgbW91bnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCFtb3VudClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sbGFwc2UsIHsgaW46IHNob3cgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgY29udHJvbElkOiBpZCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyBjb21wb25lbnRDbGFzczogXCJ0ZXh0YXJlYVwiLCB2YWx1ZTogdmFsdWUsIG9uQ2hhbmdlOiBvbkNoYW5nZSwgcm93czogNCB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbGJhciwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0b2dnbGUgfSwgXCJMdWtcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgdHlwZTogXCJzdWJtaXRcIiwgYnNTdHlsZTogXCJpbmZvXCIsIG9uQ2xpY2s6IHNhdmUgfSwgc2F2ZVRleHQpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmltcG9ydCB7IG9wdGlvbnMsIHJlc3BvbnNlSGFuZGxlciB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgbm9ybWFsaXplVGhyZWFkVGl0bGUgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL25vcm1hbGl6ZVwiO1xyXG5leHBvcnQgY29uc3QgYWRkVGhyZWFkVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjQsXHJcbiAgICAgICAgcGF5bG9hZDogW3RpdGxlXVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRocmVhZFRpdGxlcyA9ICh0aXRsZXMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjUsXHJcbiAgICAgICAgcGF5bG9hZDogdGl0bGVzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VG90YWxQYWdlcyA9ICh0b3RhbFBhZ2VzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDI2LFxyXG4gICAgICAgIHBheWxvYWQ6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRQYWdlID0gKHBhZ2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjcsXHJcbiAgICAgICAgcGF5bG9hZDogcGFnZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFNraXAgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyOCxcclxuICAgICAgICBwYXlsb2FkOiBza2lwXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VGFrZSA9ICh0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDI5LFxyXG4gICAgICAgIHBheWxvYWQ6IHRha2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZFRocmVhZCA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzMCxcclxuICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFBvc3RDb250ZW50ID0gKGNvbnRlbnQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzEsXHJcbiAgICAgICAgcGF5bG9hZDogY29udGVudFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG1hcmtQb3N0ID0gKHBvc3RJZCwgcmVhZCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9wb3N0SWQ9JHtwb3N0SWR9JnJlYWQ9JHtyZWFkfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoVGhyZWFkcyA9IChza2lwID0gMCwgdGFrZSA9IDEwKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZm9ydW0gPSBnbG9iYWxzLnVybHMuZm9ydW10aXRsZTtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtmb3J1bX0/c2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VGb3J1bVRpdGxlcyA9IGRhdGEuQ3VycmVudEl0ZW1zO1xyXG4gICAgICAgICAgICBjb25zdCBmb3J1bVRpdGxlcyA9IHBhZ2VGb3J1bVRpdGxlcy5tYXAobm9ybWFsaXplVGhyZWFkVGl0bGUpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwKHNraXApKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZSh0YWtlKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMoZGF0YS5Ub3RhbFBhZ2VzKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFBhZ2UoZGF0YS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUaHJlYWRUaXRsZXMoZm9ydW1UaXRsZXMpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFBvc3QgPSAoaWQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZm9ydW0gPSBnbG9iYWxzLnVybHMuZm9ydW1wb3N0O1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2ZvcnVtfT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkYXRhLlRleHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gbm9ybWFsaXplVGhyZWFkVGl0bGUoZGF0YS5IZWFkZXIpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChhZGRUaHJlYWRUaXRsZSh0aXRsZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRQb3N0Q29udGVudChjb250ZW50KSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkVGhyZWFkKGRhdGEuVGhyZWFkSUQpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgdXBkYXRlUG9zdCA9IChpZCwgcG9zdCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKF8gPT4gbnVsbCk7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3QpLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVsZXRlUG9zdCA9IChpZCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHBvc3RUaHJlYWQgPSAocG9zdCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuZm9ydW1wb3N0O1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3QpLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkoXyA9PiBudWxsKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGNiKTtcclxuICAgIH07XHJcbn07XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBGb3J1bUZvcm0gfSBmcm9tIFwiLi4vZm9ydW0vRm9ydW1Gb3JtXCI7XHJcbmltcG9ydCB7IEJ1dHRvblRvb2x0aXAgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudENvbnRyb2xzXCI7XHJcbmltcG9ydCB7IG1hcmtQb3N0LCB1cGRhdGVQb3N0LCBmZXRjaFBvc3QsIGRlbGV0ZVBvc3QsIHNldFNlbGVjdGVkVGhyZWFkIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvZm9ydW1cIjtcclxuaW1wb3J0IHsgZmluZCwgY29udGFpbnMgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgeyBnZXRGdWxsTmFtZSwgZm9ybWF0VGV4dCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIEdseXBoaWNvbiwgQnV0dG9uVG9vbGJhciwgQnV0dG9uR3JvdXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnNlbGVjdGVkVGhyZWFkO1xyXG4gICAgY29uc3QgdGl0bGUgPSBmaW5kKHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRpdGxlcywgKHRpdGxlKSA9PiB0aXRsZS5JRCA9PT0gc2VsZWN0ZWQpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWQsXHJcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgIHRleHQ6IHN0YXRlLmZvcnVtSW5mby5wb3N0Q29udGVudCxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF0sXHJcbiAgICAgICAgY2FuRWRpdDogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZCA9PT0gaWQsXHJcbiAgICAgICAgaGFzUmVhZDogdGl0bGUgPyBjb250YWlucyh0aXRsZS5WaWV3ZWRCeSwgc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQpIDogZmFsc2UsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlOiAoaWQsIHBvc3QsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwZGF0ZVBvc3QoaWQsIHBvc3QsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRQb3N0OiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hQb3N0KGlkKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKHNldFNlbGVjdGVkVGhyZWFkKGlkKSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlUG9zdDogKGlkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVQb3N0KGlkLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVhZFBvc3Q6IChwb3N0SWQsIHJlYWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKG1hcmtQb3N0KHBvc3RJZCwgcmVhZCwgY2IpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBGb3J1bVBvc3RDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgZWRpdDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudG9nZ2xlRWRpdCA9IHRoaXMudG9nZ2xlRWRpdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25TdWJtaXQgPSB0aGlzLm9uU3VibWl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVIYW5kbGUgPSB0aGlzLmRlbGV0ZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlUG9zdFJlYWQgPSB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IGhhc1RpdGxlID0gQm9vbGVhbihuZXh0UHJvcHMudGl0bGUpO1xyXG4gICAgICAgIGlmICghaGFzVGl0bGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBuZXh0UHJvcHMudGl0bGUuVGl0bGUsXHJcbiAgICAgICAgICAgICAgICBUZXh0OiBuZXh0UHJvcHMudGV4dCxcclxuICAgICAgICAgICAgICAgIFN0aWNreTogbmV4dFByb3BzLnRpdGxlLlN0aWNreSxcclxuICAgICAgICAgICAgICAgIElzUHVibGlzaGVkOiBuZXh0UHJvcHMudGl0bGUuSXNQdWJsaXNoZWRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IG5leHRQcm9wcy50aXRsZS5UaXRsZTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IHJvdXRlciwgZGVsZXRlUG9zdCwgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcnVtbGlzdHMgPSBgL2ZvcnVtYDtcclxuICAgICAgICAgICAgcm91dGVyLnB1c2goZm9ydW1saXN0cyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkZWxldGVQb3N0KHRpdGxlLklELCBjYik7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVFZGl0KCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXQgPSB0aGlzLnN0YXRlLmVkaXQ7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6ICFlZGl0IH0pO1xyXG4gICAgfVxyXG4gICAgb25TdWJtaXQocG9zdCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBkYXRlLCBnZXRQb3N0LCB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgZ2V0UG9zdCh0aXRsZS5JRCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB1cGRhdGUodGl0bGUuSUQsIHBvc3QsIGNiKTtcclxuICAgIH1cclxuICAgIHRvZ2dsZVBvc3RSZWFkKHRvZ2dsZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZ2V0UG9zdCwgcmVhZFBvc3QsIHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBnZXRQb3N0KHRpdGxlLklEKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlYWRQb3N0KHRpdGxlLklELCB0b2dnbGUsIGNiKTtcclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBmYWxzZSB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIHNlbGVjdGVkLCB0aXRsZSwgdGV4dCwgZ2V0VXNlciwgaGFzUmVhZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAoc2VsZWN0ZWQgPCAwIHx8ICF0aXRsZSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgZWRpdCA9IGNhbkVkaXQodGl0bGUuQXV0aG9ySUQpO1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyKHRpdGxlLkF1dGhvcklEKTtcclxuICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRGdWxsTmFtZSh1c2VyKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1IZWFkZXIsIHsgbGc6IDEyLCBuYW1lOiBhdXRob3IsIHRpdGxlOiB0aXRsZS5UaXRsZSwgY3JlYXRlZE9uOiB0aXRsZS5DcmVhdGVkT24sIG1vZGlmaWVkT246IHRpdGxlLkxhc3RNb2RpZmllZCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUJ1dHRvbkdyb3VwLCB7IHNob3c6IHRydWUsIGVkaXRhYmxlOiBlZGl0LCBpbml0aWFsUmVhZDogaGFzUmVhZCwgb25EZWxldGU6IHRoaXMuZGVsZXRlSGFuZGxlLCBvbkVkaXQ6IHRoaXMudG9nZ2xlRWRpdCwgb25SZWFkOiB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcywgdHJ1ZSksIG9uVW5yZWFkOiB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcywgZmFsc2UpIH0pKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUJvZHksIHsgdGV4dDogdGV4dCwgbGc6IDEwIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUZvcm0sIHsgc2hvdzogdGhpcy5zdGF0ZS5lZGl0LCBjbG9zZTogdGhpcy5jbG9zZS5iaW5kKHRoaXMpLCBvblN1Ym1pdDogdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpLCBlZGl0OiB0aGlzLnN0YXRlLm1vZGVsIH0pKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRm9ydW1Cb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQsIGxnLCBsZ09mZnNldCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBmb3JtYXR0ZWRUZXh0ID0gZm9ybWF0VGV4dCh0ZXh0KTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiBsZywgbGdPZmZzZXQ6IGxnT2Zmc2V0IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJmb3J1bS1jb250ZW50XCIsIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiBmb3JtYXR0ZWRUZXh0IH0pLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEyIH0sIHRoaXMucHJvcHMuY2hpbGRyZW4pKSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBGb3J1bUhlYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBnZXRDcmVhdGVkT25UZXh0KGNyZWF0ZWRPbiwgbW9kaWZpZWRPbikge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBtb21lbnQoY3JlYXRlZE9uKTtcclxuICAgICAgICBjb25zdCBkYXRlVGV4dCA9IGRhdGUuZm9ybWF0KFwiRC1NTS1ZWVwiKTtcclxuICAgICAgICBjb25zdCB0aW1lVGV4dCA9IGRhdGUuZm9ybWF0KFwiIEg6bW1cIik7XHJcbiAgICAgICAgaWYgKCFtb2RpZmllZE9uKVxyXG4gICAgICAgICAgICByZXR1cm4gYFVkZ2l2ZXQgJHtkYXRlVGV4dH0ga2wuICR7dGltZVRleHR9YDtcclxuICAgICAgICBjb25zdCBtb2RpZmllZCA9IG1vbWVudChtb2RpZmllZE9uKTtcclxuICAgICAgICBjb25zdCBtb2RpZmllZERhdGUgPSBtb2RpZmllZC5mb3JtYXQoXCJELU1NLVlZXCIpO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkVGltZSA9IG1vZGlmaWVkLmZvcm1hdChcIkg6bW1cIik7XHJcbiAgICAgICAgcmV0dXJuIGBVZGdpdmV0ICR7ZGF0ZVRleHR9IGtsLiAke3RpbWVUZXh0fSAoIHJldHRldCAke21vZGlmaWVkRGF0ZX0ga2wuICR7bW9kaWZpZWRUaW1lfSApYDtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlLCBuYW1lLCBjcmVhdGVkT24sIG1vZGlmaWVkT24sIGxnLCBsZ09mZnNldCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5nZXRDcmVhdGVkT25UZXh0KGNyZWF0ZWRPbiwgbW9kaWZpZWRPbik7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7IGxnOiBsZywgbGdPZmZzZXQ6IGxnT2Zmc2V0IH07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgX19hc3NpZ24oe30sIHByb3BzKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtY2FwaXRhbGl6ZVwiIH0sIHRpdGxlKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU2tyZXZldCBhZiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtcHJpbWFyeVwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwidGltZVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWQpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsIHRoaXMucHJvcHMuY2hpbGRyZW4pKSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEZvcnVtQnV0dG9uR3JvdXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgcmVhZDogcHJvcHMuaW5pdGlhbFJlYWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVhZEhhbmRsZSA9IHRoaXMucmVhZEhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudW5yZWFkSGFuZGxlID0gdGhpcy51bnJlYWRIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHJlYWRIYW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBvblJlYWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucmVhZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWFkOiB0cnVlIH0pO1xyXG4gICAgICAgIG9uUmVhZCgpO1xyXG4gICAgfVxyXG4gICAgdW5yZWFkSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb25VbnJlYWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnJlYWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVhZDogZmFsc2UgfSk7XHJcbiAgICAgICAgb25VbnJlYWQoKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRhYmxlLCBzaG93LCBvbkRlbGV0ZSwgb25FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghc2hvdylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyByZWFkIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMTIsIGNsYXNzTmFtZTogXCJmb3J1bS1lZGl0YmFyXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sYmFyLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Hcm91cCwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJkYW5nZXJcIiwgb25DbGljazogb25EZWxldGUsIGljb246IFwidHJhc2hcIiwgdG9vbHRpcDogXCJzbGV0IGluZGzDpmdcIiwgbW91bnQ6IGVkaXRhYmxlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbHRpcCwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgb25DbGljazogb25FZGl0LCBpY29uOiBcInBlbmNpbFwiLCB0b29sdGlwOiBcIsOmbmRyZSBpbmRsw6ZnXCIsIGFjdGl2ZTogZmFsc2UsIG1vdW50OiBlZGl0YWJsZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMucmVhZEhhbmRsZSwgaWNvbjogXCJleWUtb3BlblwiLCB0b29sdGlwOiBcIm1hcmtlciBzb20gbMOmc3RcIiwgYWN0aXZlOiByZWFkLCBtb3VudDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMudW5yZWFkSGFuZGxlLCBpY29uOiBcImV5ZS1jbG9zZVwiLCB0b29sdGlwOiBcIm1hcmtlciBzb20gdWzDpnN0XCIsIGFjdGl2ZTogIXJlYWQsIG1vdW50OiB0cnVlIH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IEZvcnVtUG9zdFJlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRm9ydW1Qb3N0Q29udGFpbmVyKTtcclxuY29uc3QgRm9ydW1Qb3N0ID0gd2l0aFJvdXRlcihGb3J1bVBvc3RSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IEZvcnVtUG9zdDtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFBhZ2luYXRpb24gYXMgUGFnaW5hdGlvbkJzIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBwYWdlLCBwYWdlSGFuZGxlLCBzaG93IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG1vcmUgPSB0b3RhbFBhZ2VzID4gMTtcclxuICAgICAgICBjb25zdCB4b3IgPSAoc2hvdyB8fCBtb3JlKSAmJiAhKHNob3cgJiYgbW9yZSk7XHJcbiAgICAgICAgaWYgKCEoeG9yIHx8IChzaG93ICYmIG1vcmUpKSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbkJzLCB7IHByZXY6IHRydWUsIG5leHQ6IHRydWUsIGVsbGlwc2lzOiB0cnVlLCBib3VuZGFyeUxpbmtzOiB0cnVlLCBpdGVtczogdG90YWxQYWdlcywgbWF4QnV0dG9uczogNSwgYWN0aXZlUGFnZTogcGFnZSwgb25TZWxlY3Q6IHBhZ2VIYW5kbGUgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgZmV0Y2hMYXRlc3ROZXdzIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvd2hhdHNuZXdcIjtcclxuaW1wb3J0IHsgV2hhdHNOZXdMaXN0IH0gZnJvbSBcIi4uL3doYXRzbmV3L1doYXRzTmV3TGlzdFwiO1xyXG5pbXBvcnQgeyBGb3J1bUhlYWRlciwgRm9ydW1Cb2R5IH0gZnJvbSBcIi4vRm9ydW1Qb3N0XCI7XHJcbmltcG9ydCB7IEJ1dHRvbiwgQnV0dG9uVG9vbGJhciwgTW9kYWwsIFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSBcIi4uL3BhZ2luYXRpb24vUGFnaW5hdGlvblwiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXRlbXM6IHN0YXRlLndoYXRzTmV3SW5mby5pdGVtcyxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF0sXHJcbiAgICAgICAgc2tpcDogc3RhdGUud2hhdHNOZXdJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUud2hhdHNOZXdJbmZvLnRha2UsXHJcbiAgICAgICAgdG90YWxQYWdlczogc3RhdGUud2hhdHNOZXdJbmZvLnRvdGFsUGFnZXMsXHJcbiAgICAgICAgcGFnZTogc3RhdGUud2hhdHNOZXdJbmZvLnBhZ2UsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TGF0ZXN0OiAoc2tpcCwgdGFrZSkgPT4gZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKSxcclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFdoYXRzTmV3Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgcG9zdFByZXZpZXc6IG51bGwsXHJcbiAgICAgICAgICAgIGF1dGhvcjogbnVsbCxcclxuICAgICAgICAgICAgb246IG51bGxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucGFnZUhhbmRsZSA9IHRoaXMucGFnZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJldmlld1Bvc3QgPSB0aGlzLnByZXZpZXdQb3N0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZU1vZGFsID0gdGhpcy5jbG9zZU1vZGFsLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFZpZXcgPSB0aGlzLm1vZGFsVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubmF2aWdhdGVUbyA9IHRoaXMubmF2aWdhdGVUby5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgZ2V0TGF0ZXN0LCBwYWdlLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmIChwYWdlID09PSB0bylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHRvIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgZ2V0TGF0ZXN0KHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcbiAgICBwcmV2aWV3UG9zdChpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgeyBnZXRVc2VyIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IGdldFVzZXIoaXRlbS5BdXRob3JJRCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxyXG4gICAgICAgICAgICBwb3N0UHJldmlldzogaXRlbS5JdGVtLFxyXG4gICAgICAgICAgICBhdXRob3I6IGF1dGhvcixcclxuICAgICAgICAgICAgb246IGl0ZW0uT25cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG8odXJsKSB7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBwdXNoKHVybCk7XHJcbiAgICB9XHJcbiAgICBjbG9zZU1vZGFsKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBtb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBvc3RQcmV2aWV3OiBudWxsLFxyXG4gICAgICAgICAgICBhdXRob3I6IG51bGwsXHJcbiAgICAgICAgICAgIG9uOiBudWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBtb2RhbFZpZXcoKSB7XHJcbiAgICAgICAgaWYgKCFCb29sZWFuKHRoaXMuc3RhdGUucG9zdFByZXZpZXcpKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCB7IFRleHQsIFRpdGxlLCBJRCB9ID0gdGhpcy5zdGF0ZS5wb3N0UHJldmlldztcclxuICAgICAgICBjb25zdCBhdXRob3IgPSB0aGlzLnN0YXRlLmF1dGhvcjtcclxuICAgICAgICBjb25zdCBuYW1lID0gYCR7YXV0aG9yLkZpcnN0TmFtZX0gJHthdXRob3IuTGFzdE5hbWV9YDtcclxuICAgICAgICBjb25zdCBsaW5rID0gYGZvcnVtL3Bvc3QvJHtJRH0vY29tbWVudHNgO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLCB7IHNob3c6IHRoaXMuc3RhdGUubW9kYWwsIG9uSGlkZTogdGhpcy5jbG9zZU1vZGFsLCBic1NpemU6IFwibGFyZ2VcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkhlYWRlciwgeyBjbG9zZUJ1dHRvbjogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5UaXRsZSwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcnVtSGVhZGVyLCB7IGxnOiAxMSwgbGdPZmZzZXQ6IDEsIGNyZWF0ZWRPbjogdGhpcy5zdGF0ZS5vbiwgdGl0bGU6IFRpdGxlLCBuYW1lOiBuYW1lIH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1Cb2R5LCB7IHRleHQ6IFRleHQsIGxnOiAxMSwgbGdPZmZzZXQ6IDEgfSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkZvb3RlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbGJhciwgeyBzdHlsZTogeyBmbG9hdDogXCJyaWdodFwiIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgb25DbGljazogKCkgPT4gdGhpcy5uYXZpZ2F0ZVRvKGxpbmspIH0sIFwiU2Uga29tbWVudGFyZXIgKGZvcnVtKVwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0aGlzLmNsb3NlTW9kYWwgfSwgXCJMdWtcIikpKSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciwgdG90YWxQYWdlcywgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIG51bGwsIFwiU2lkc3RlIGhcXHUwMEU2bmRlbHNlclwiKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdMaXN0LCB7IGl0ZW1zOiBpdGVtcywgZ2V0VXNlcjogZ2V0VXNlciwgcHJldmlldzogdGhpcy5wcmV2aWV3UG9zdCB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbiwgeyB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzLCBwYWdlOiBwYWdlLCBwYWdlSGFuZGxlOiB0aGlzLnBhZ2VIYW5kbGUgfSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsVmlldygpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgV2hhdHNOZXcgPSB3aXRoUm91dGVyKGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFdoYXRzTmV3Q29udGFpbmVyKSk7XHJcbmV4cG9ydCBkZWZhdWx0IFdoYXRzTmV3O1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgSnVtYm90cm9uLCBHcmlkLCBSb3csIENvbCwgUGFuZWwsIEFsZXJ0IH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IGZldGNoTGF0ZXN0TmV3cyB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL3doYXRzbmV3XCI7XHJcbmltcG9ydCB7IEltYWdlVXBsb2FkIH0gZnJvbSBcIi4uL2ltYWdlcy9JbWFnZVVwbG9hZFwiO1xyXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2ltYWdlc1wiO1xyXG5pbXBvcnQgVXNlZFNwYWNlIGZyb20gXCIuL1VzZWRTcGFjZVwiO1xyXG5pbXBvcnQgV2hhdHNOZXcgZnJvbSBcIi4vV2hhdHNOZXdcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW3N0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkXTtcclxuICAgIGNvbnN0IG5hbWUgPSB1c2VyID8gdXNlci5Vc2VybmFtZSA6IFwiVXNlclwiO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2VybmFtZTogbmFtZSxcclxuICAgICAgICBza2lwOiBzdGF0ZS53aGF0c05ld0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS53aGF0c05ld0luZm8udGFrZVxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwbG9hZEltYWdlOiAoc2tpcCwgdGFrZSwgdXNlcm5hbWUsIGZvcm1EYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9uU3VjY2VzcyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSwgb25TdWNjZXNzLCAocikgPT4geyBjb25zb2xlLmxvZyhyKTsgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIEhvbWVDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgcmVjb21tZW5kZWQ6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBsb2FkID0gdGhpcy51cGxvYWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlY29tbWVuZGVkVmlldyA9IHRoaXMucmVjb21tZW5kZWRWaWV3LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiRm9yc2lkZVwiO1xyXG4gICAgfVxyXG4gICAgdXBsb2FkKHVzZXJuYW1lLCBmb3JtRGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBsb2FkSW1hZ2UsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgdXBsb2FkSW1hZ2Uoc2tpcCwgdGFrZSwgdXNlcm5hbWUsIGZvcm1EYXRhKTtcclxuICAgIH1cclxuICAgIHJlY29tbWVuZGVkVmlldygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUucmVjb21tZW5kZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEFsZXJ0LCB7IGJzU3R5bGU6IFwic3VjY2Vzc1wiLCBvbkRpc21pc3M6ICgpID0+IHRoaXMuc2V0U3RhdGUoeyByZWNvbW1lbmRlZDogZmFsc2UgfSkgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDRcIiwgbnVsbCwgXCJBbmJlZmFsaW5nZXJcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUZXN0ZXQgbWVkIEdvb2dsZSBDaHJvbWUgYnJvd3Nlci4gRGVyZm9yIGVyIGRldCBhbmJlZmFsZXQgYXQgYnJ1Z2UgZGVubmUgdGlsIGF0IGZcXHUwMEU1IGRlbiBmdWxkZSBvcGxldmVsc2UuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCkpKSkpKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGdsb2JhbHMuY3VycmVudFVzZXJuYW1lO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChKdW1ib3Ryb24sIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlZlbGtvbW1lbiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIVwiKSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwibGVhZFwiIH0sIFwiVGlsIEludXBsYW5zIGZvcnVtIG9nIGJpbGxlZC1hcmtpdiBzaWRlXCIpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDQgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQYW5lbCwgeyBoZWFkZXI6IFwiRHUga2FuIHVwbG9hZGUgYmlsbGVkZXIgdGlsIGRpdCBlZ2V0IGdhbGxlcmkgaGVyXCIsIGJzU3R5bGU6IFwicHJpbWFyeVwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlVXBsb2FkLCB7IHVzZXJuYW1lOiB1c2VybmFtZSwgdXBsb2FkSW1hZ2U6IHRoaXMudXBsb2FkIH0pKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHcmlkLCB7IGZsdWlkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMiB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFdoYXRzTmV3LCBudWxsKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDEsIGxnOiAzIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVjb21tZW5kZWRWaWV3KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLCBcIlBlcnNvbmxpZyB1cGxvYWQgZm9yYnJ1Z1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBcIkhlcnVuZGVyIGthbiBkdSBzZSBodm9yIG1lZ2V0IHBsYWRzIGR1IGhhciBicnVndCBvZyBodm9yIG1lZ2V0IGZyaSBwbGFkc1wiICsgXCIgXCIgKyBcImRlciBlciB0aWxiYWdlLiBHXFx1MDBFNmxkZXIga3VuIGJpbGxlZGUgZmlsZXIuXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZWRTcGFjZSwgbnVsbCkpKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IEhvbWUgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShIb21lQ29udGFpbmVyKTtcclxuZXhwb3J0IGRlZmF1bHQgSG9tZTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3J1bSBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcIkZvcnVtIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLCBcImluZGxcXHUwMEU2Z1wiKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBHbHlwaGljb24sIE92ZXJsYXlUcmlnZ2VyLCBUb29sdGlwIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBnZXRXb3JkcyB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgTGluayB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuZXhwb3J0IGNsYXNzIEZvcnVtVGl0bGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgZGF0ZVZpZXcoZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGRheU1vbnRoWWVhciA9IG1vbWVudChkYXRlKS5mb3JtYXQoXCJEL01NL1lZXCIpO1xyXG4gICAgICAgIHJldHVybiBgJHtkYXlNb250aFllYXJ9YDtcclxuICAgIH1cclxuICAgIG1vZGlmaWVkVmlldyhtb2RpZmllZE9uKSB7XHJcbiAgICAgICAgaWYgKCFtb2RpZmllZE9uKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCBtb2RpZmllZERhdGUgPSBtb21lbnQobW9kaWZpZWRPbikuZm9ybWF0KFwiRC9NTS9ZWS1IOm1tXCIpO1xyXG4gICAgICAgIHJldHVybiBgJHttb2RpZmllZERhdGV9YDtcclxuICAgIH1cclxuICAgIHRvb2x0aXBWaWV3KCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFRvb2x0aXAsIHsgaWQ6IFwidG9vbHRpcFwiIH0sIFwiVmlndGlnXCIpO1xyXG4gICAgfVxyXG4gICAgc3RpY2t5SWNvbihzaG93KSB7XHJcbiAgICAgICAgaWYgKCFzaG93KVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwic3RpY2t5XCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChPdmVybGF5VHJpZ2dlciwgeyBwbGFjZW1lbnQ6IFwidG9wXCIsIG92ZXJsYXk6IHRoaXMudG9vbHRpcFZpZXcoKSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicHVzaHBpblwiIH0pKSk7XHJcbiAgICB9XHJcbiAgICBkYXRlTW9kaWZpZWRWaWV3KHRpdGxlKSB7XHJcbiAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuZGF0ZVZpZXcodGl0bGUuQ3JlYXRlZE9uKTtcclxuICAgICAgICBjb25zdCB1cGRhdGVkID0gdGhpcy5tb2RpZmllZFZpZXcodGl0bGUuTGFzdE1vZGlmaWVkKTtcclxuICAgICAgICBpZiAoIXVwZGF0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBjcmVhdGVkKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCxcclxuICAgICAgICAgICAgY3JlYXRlZCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICBcIihcIixcclxuICAgICAgICAgICAgdXBkYXRlZCxcclxuICAgICAgICAgICAgXCIpXCIpO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlU3VtbWFyeSgpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghdGl0bGUuTGF0ZXN0Q29tbWVudClcclxuICAgICAgICAgICAgcmV0dXJuIFwiSW5nZW4ga29tbWVudGFyZXJcIjtcclxuICAgICAgICBpZiAodGl0bGUuTGF0ZXN0Q29tbWVudC5EZWxldGVkKVxyXG4gICAgICAgICAgICByZXR1cm4gXCJLb21tZW50YXIgc2xldHRldFwiO1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aXRsZS5MYXRlc3RDb21tZW50LlRleHQ7XHJcbiAgICAgICAgcmV0dXJuIGdldFdvcmRzKHRleHQsIDUpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUsIGdldEF1dGhvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBuYW1lID0gZ2V0QXV0aG9yKHRpdGxlLkF1dGhvcklEKTtcclxuICAgICAgICBjb25zdCBsYXRlc3RDb21tZW50ID0gdGhpcy5jcmVhdGVTdW1tYXJ5KCk7XHJcbiAgICAgICAgY29uc3QgY3NzID0gdGl0bGUuU3RpY2t5ID8gXCJ0aHJlYWQgdGhyZWFkLXBpbm5lZFwiIDogXCJ0aHJlYWRcIjtcclxuICAgICAgICBjb25zdCBwYXRoID0gYC9mb3J1bS9wb3N0LyR7dGl0bGUuSUR9L2NvbW1lbnRzYDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7IHRvOiBwYXRoIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCB7IGNsYXNzTmFtZTogY3NzIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMSwgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSwgdGhpcy5zdGlja3lJY29uKHRpdGxlLlN0aWNreSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDRcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwidGV4dC1jYXBpdGFsaXplXCIgfSwgdGl0bGUuVGl0bGUpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic21hbGxcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJBZjogXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyLCBjbGFzc05hbWU6IFwidGV4dC1sZWZ0XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCB0aGlzLmRhdGVNb2RpZmllZFZpZXcodGl0bGUpKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMiwgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCB0aXRsZS5WaWV3ZWRCeS5sZW5ndGgpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyLCBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIGxhdGVzdENvbW1lbnQpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQnV0dG9uR3JvdXAsIEJ1dHRvbiB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgRm9ydW1UaXRsZSB9IGZyb20gXCIuLi9mb3J1bS9Gb3J1bVRpdGxlXCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgZmV0Y2hUaHJlYWRzLCBwb3N0VGhyZWFkIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvZm9ydW1cIjtcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gXCIuLi9wYWdpbmF0aW9uL1BhZ2luYXRpb25cIjtcclxuaW1wb3J0IHsgRm9ydW1Gb3JtIH0gZnJvbSBcIi4uL2ZvcnVtL0ZvcnVtRm9ybVwiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGhyZWFkczogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8udGl0bGVzLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8udGFrZSxcclxuICAgICAgICBwYWdlOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby5wYWdlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRvdGFsUGFnZXMsXHJcbiAgICAgICAgZ2V0QXV0aG9yOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF07XHJcbiAgICAgICAgICAgIHJldHVybiBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBmZXRjaFRocmVhZHM6IChza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoVGhyZWFkcyhza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0VGhyZWFkOiAoY2IsIHBvc3QpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdFRocmVhZChwb3N0LCBjYikpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIEZvcnVtTGlzdENvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBuZXdQb3N0OiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wYWdlSGFuZGxlID0gdGhpcy5wYWdlSGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJJbnVwbGFuIEZvcnVtXCI7XHJcbiAgICB9XHJcbiAgICBwYWdlSGFuZGxlKHRvKSB7XHJcbiAgICAgICAgY29uc3QgeyBmZXRjaFRocmVhZHMsIHBhZ2UsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKHBhZ2UgPT09IHRvKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHRvIC0gMSkgKiB0YWtlO1xyXG4gICAgICAgIGZldGNoVGhyZWFkcyhza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG4gICAgdGhyZWFkVmlld3MoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aHJlYWRzLCBnZXRBdXRob3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHRocmVhZHMubWFwKHRocmVhZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gYHRocmVhZF8ke3RocmVhZC5JRH1gO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bVRpdGxlLCB7IHRpdGxlOiB0aHJlYWQsIGtleTogaWQsIGdldEF1dGhvcjogZ2V0QXV0aG9yIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3VibWl0KHBvc3QpIHtcclxuICAgICAgICBjb25zdCB7IHBvc3RUaHJlYWQsIGZldGNoVGhyZWFkcywgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwb3N0VGhyZWFkKCgpID0+IGZldGNoVGhyZWFkcyhza2lwLCB0YWtlKSwgcG9zdCk7XHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmV3UG9zdDogZmFsc2UgfSk7XHJcbiAgICB9XHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBuZXdQb3N0OiB0cnVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG90YWxQYWdlcywgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uR3JvdXAsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgb25DbGljazogdGhpcy5zaG93LmJpbmQodGhpcykgfSwgXCJUaWxmXFx1MDBGOGogbnl0IGluZGxcXHUwMEU2Z1wiKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxMiB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsgY2xhc3NOYW1lOiBcInRocmVhZC1oZWFkXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiSW5mb1wiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBcIk92ZXJza3JpZnRcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyLCBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiRGF0b1wiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIsIGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJMXFx1MDBFNnN0IGFmXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMiwgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBcIlNlbmVzdGUga29tbWVudGFyXCIpKSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRocmVhZFZpZXdzKCksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhZ2luYXRpb24sIHsgdG90YWxQYWdlczogdG90YWxQYWdlcywgcGFnZTogcGFnZSwgcGFnZUhhbmRsZTogdGhpcy5wYWdlSGFuZGxlLCBzaG93OiB0cnVlIH0pKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUZvcm0sIHsgc2hvdzogdGhpcy5zdGF0ZS5uZXdQb3N0LCBjbG9zZTogdGhpcy5jbG9zZS5iaW5kKHRoaXMpLCBvblN1Ym1pdDogdGhpcy5zdWJtaXQuYmluZCh0aGlzKSB9KSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgRm9ydW1MaXN0ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRm9ydW1MaXN0Q29udGFpbmVyKTtcclxuZXhwb3J0IGRlZmF1bHQgRm9ydW1MaXN0O1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgTWVkaWEsIEdseXBoaWNvbiB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIENvbW1lbnREZWxldGVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHJlcGxpZXMsIGNvbnN0cnVjdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXBseU5vZGVzID0gcmVwbGllcy5tYXAocmVwbHkgPT4gY29uc3RydWN0KHJlcGx5KSk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEsIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuTGVmdCwgeyBjbGFzc05hbWU6IFwiY29tbWVudC1kZWxldGVkLWxlZnRcIiB9KSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5Cb2R5LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwidGV4dC1tdXRlZCBjb21tZW50LWRlbGV0ZWRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcInJlbW92ZS1zaWduXCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiIEtvbW1lbnRhciBzbGV0dGV0XCIpKSxcclxuICAgICAgICAgICAgICAgIHJlcGx5Tm9kZXMpKTtcclxuICAgIH1cclxufVxyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudENvbnRyb2xzIH0gZnJvbSBcIi4vQ29tbWVudENvbnRyb2xzXCI7XHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSBcIi4vQ29tbWVudFByb2ZpbGVcIjtcclxuaW1wb3J0IHsgZm9ybWF0VGV4dCwgdGltZVRleHQgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IE1lZGlhIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBhZ28oKSB7XHJcbiAgICAgICAgY29uc3QgeyBwb3N0ZWRPbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gdGltZVRleHQocG9zdGVkT24pO1xyXG4gICAgfVxyXG4gICAgZWRpdGVkVmlldyhlZGl0ZWQpIHtcclxuICAgICAgICBpZiAoIWVkaXRlZClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIFwiKlwiKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIGNvbnRleHRJZCwgbmFtZSwgdGV4dCwgY29tbWVudElkLCByZXBsaWVzLCBjb25zdHJ1Y3QsIGF1dGhvcklkLCBlZGl0ZWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlLCBlZGl0Q29tbWVudCwgZGVsZXRlQ29tbWVudCwgcmVwbHlDb21tZW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0geyBza2lwLCB0YWtlLCBlZGl0Q29tbWVudCwgZGVsZXRlQ29tbWVudCwgcmVwbHlDb21tZW50IH07XHJcbiAgICAgICAgY29uc3QgdHh0ID0gZm9ybWF0VGV4dCh0ZXh0KTtcclxuICAgICAgICBjb25zdCByZXBseU5vZGVzID0gcmVwbGllcy5tYXAocmVwbHkgPT4gY29uc3RydWN0KHJlcGx5KSk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEsIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudFByb2ZpbGUsIG51bGwpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDVcIiwgeyBjbGFzc05hbWU6IFwibWVkaWEtaGVhZGluZ1wiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBuYW1lKSxcclxuICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic21hbGxcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzYWdkZSBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZ28oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0ZWRWaWV3KGVkaXRlZCkpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHR4dCB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudENvbnRyb2xzLCBfX2Fzc2lnbih7IGNvbnRleHRJZDogY29udGV4dElkLCBjYW5FZGl0OiBjYW5FZGl0LCBhdXRob3JJZDogYXV0aG9ySWQsIGNvbW1lbnRJZDogY29tbWVudElkLCB0ZXh0OiB0ZXh0IH0sIHByb3BzKSksXHJcbiAgICAgICAgICAgICAgICByZXBseU5vZGVzKSk7XHJcbiAgICB9XHJcbn1cclxuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufTtcclxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IENvbW1lbnREZWxldGVkIH0gZnJvbSBcIi4vQ29tbWVudERlbGV0ZWRcIjtcclxuaW1wb3J0IHsgQ29tbWVudCB9IGZyb20gXCIuL0NvbW1lbnRcIjtcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBDb21tZW50TGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdENvbW1lbnQgPSB0aGlzLmNvbnN0cnVjdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHJvb3RDb21tZW50cyhjb21tZW50cykge1xyXG4gICAgICAgIGlmICghY29tbWVudHMpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBjb21tZW50cy5tYXAoKGNvbW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29uc3RydWN0Q29tbWVudChjb21tZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuTGlzdEl0ZW0sIHsga2V5OiBcInJvb3RDb21tZW50X1wiICsgY29tbWVudC5Db21tZW50SUQgfSwgbm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RDb21tZW50KGNvbW1lbnQpIHtcclxuICAgICAgICBjb25zdCBrZXkgPSBcImNvbW1lbnRJZFwiICsgY29tbWVudC5Db21tZW50SUQ7XHJcbiAgICAgICAgaWYgKGNvbW1lbnQuRGVsZXRlZClcclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudERlbGV0ZWQsIHsga2V5OiBrZXksIGNvbnN0cnVjdDogdGhpcy5jb25zdHJ1Y3RDb21tZW50LCByZXBsaWVzOiBjb21tZW50LlJlcGxpZXMgfSk7XHJcbiAgICAgICAgY29uc3QgeyBjb250ZXh0SWQsIGdldE5hbWUsIGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlLCBlZGl0Q29tbWVudCwgZGVsZXRlQ29tbWVudCwgcmVwbHlDb21tZW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xzID0geyBza2lwLCB0YWtlLCBlZGl0Q29tbWVudCwgZGVsZXRlQ29tbWVudCwgcmVwbHlDb21tZW50IH07XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGdldE5hbWUoY29tbWVudC5BdXRob3JJRCk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudCwgX19hc3NpZ24oeyBrZXk6IGtleSwgY29udGV4dElkOiBjb250ZXh0SWQsIG5hbWU6IG5hbWUsIHBvc3RlZE9uOiBjb21tZW50LlBvc3RlZE9uLCBhdXRob3JJZDogY29tbWVudC5BdXRob3JJRCwgdGV4dDogY29tbWVudC5UZXh0LCBjb25zdHJ1Y3Q6IHRoaXMuY29uc3RydWN0Q29tbWVudCwgcmVwbGllczogY29tbWVudC5SZXBsaWVzLCBlZGl0ZWQ6IGNvbW1lbnQuRWRpdGVkLCBjYW5FZGl0OiBjYW5FZGl0LCBjb21tZW50SWQ6IGNvbW1lbnQuQ29tbWVudElEIH0sIGNvbnRyb2xzKSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50cyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMucm9vdENvbW1lbnRzKGNvbW1lbnRzKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MaXN0LCBudWxsLCBub2Rlcyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Rm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBUZXh0OiBcIlwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnBvc3RDb21tZW50ID0gdGhpcy5wb3N0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcG9zdENvbW1lbnQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCB7IHBvc3RIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcG9zdEhhbmRsZSh0aGlzLnN0YXRlLlRleHQpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUZXh0OiBcIlwiIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiLCB7IG9uU3VibWl0OiB0aGlzLnBvc3RDb21tZW50IH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7IGh0bWxGb3I6IFwicmVtYXJrXCIgfSwgXCJLb21tZW50YXJcIiksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiLCB7IGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgb25DaGFuZ2U6IHRoaXMuaGFuZGxlVGV4dENoYW5nZSwgdmFsdWU6IHRoaXMuc3RhdGUuVGV4dCwgcGxhY2Vob2xkZXI6IFwiU2tyaXYga29tbWVudGFyIGhlci4uLlwiLCBpZDogXCJyZW1hcmtcIiwgcm93czogNCB9KSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgdHlwZTogXCJzdWJtaXRcIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwiIH0sIFwiU2VuZFwiKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgZmV0Y2ggZnJvbSBcImlzb21vcnBoaWMtZmV0Y2hcIjtcclxuaW1wb3J0IHsgb3B0aW9ucywgbm9ybWFsaXplQ29tbWVudCwgcmVzcG9uc2VIYW5kbGVyIH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5leHBvcnQgY29uc3Qgc2V0U2tpcENvbW1lbnRzID0gKHNraXApID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzQsXHJcbiAgICAgICAgcGF5bG9hZDogc2tpcFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRTa2lwID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzNVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRUYWtlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzNlxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRha2VDb21tZW50cyA9ICh0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDM3LFxyXG4gICAgICAgIHBheWxvYWQ6IHRha2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRDdXJyZW50UGFnZSA9IChwYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDM4LFxyXG4gICAgICAgIHBheWxvYWQ6IHBhZ2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRUb3RhbFBhZ2VzID0gKHRvdGFsUGFnZXMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzksXHJcbiAgICAgICAgcGF5bG9hZDogdG90YWxQYWdlc1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRDb21tZW50cyA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNDBcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCByZWNlaXZlZENvbW1lbnRzID0gKGNvbW1lbnRzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDQxLFxyXG4gICAgICAgIHBheWxvYWQ6IGNvbW1lbnRzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgYWRkQ29tbWVudCA9IChjb21tZW50KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDQyLFxyXG4gICAgICAgIHBheWxvYWQ6IFtjb21tZW50XVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEZvY3VzZWRDb21tZW50ID0gKGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA0MyxcclxuICAgICAgICBwYXlsb2FkOiBjb21tZW50SWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBuZXdDb21tZW50RnJvbVNlcnZlciA9IChjb21tZW50KSA9PiB7XHJcbiAgICBjb25zdCBub3JtYWxpemUgPSBub3JtYWxpemVDb21tZW50KGNvbW1lbnQpO1xyXG4gICAgcmV0dXJuIGFkZENvbW1lbnQobm9ybWFsaXplKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoQ29tbWVudHMgPSAodXJsLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VDb21tZW50cyA9IGRhdGEuQ3VycmVudEl0ZW1zO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwQ29tbWVudHMoc2tpcCkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUYWtlQ29tbWVudHModGFrZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRDdXJyZW50UGFnZShkYXRhLkN1cnJlbnRQYWdlKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMoZGF0YS5Ub3RhbFBhZ2VzKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnRzID0gcGFnZUNvbW1lbnRzLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVjZWl2ZWRDb21tZW50cyhjb21tZW50cykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHBvc3RDb21tZW50ID0gKHVybCwgY29udGV4dElkLCB0ZXh0LCBwYXJlbnRDb21tZW50SWQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKF8pID0+IHtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgVGV4dDogdGV4dCxcclxuICAgICAgICAgICAgQ29udGV4dElEOiBjb250ZXh0SWQsXHJcbiAgICAgICAgICAgIFBhcmVudElEOiBwYXJlbnRDb21tZW50SWRcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGNiKTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBlZGl0Q29tbWVudCA9ICh1cmwsIGNvbW1lbnRJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoXykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBJRDogY29tbWVudElkLCBUZXh0OiB0ZXh0IH0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVsZXRlQ29tbWVudCA9ICh1cmwsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKF8pID0+IHtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoQW5kRm9jdXNTaW5nbGVDb21tZW50ID0gKGlkKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlY29tbWVudHN9L0dldFNpbmdsZT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oYyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBub3JtYWxpemVDb21tZW50KGMpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlZENvbW1lbnRzKFtjb21tZW50XSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRGb2N1c2VkQ29tbWVudChjb21tZW50LkNvbW1lbnRJRCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufTtcclxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IENvbW1lbnRMaXN0IH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRMaXN0XCI7XHJcbmltcG9ydCB7IENvbW1lbnRGb3JtIH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRGb3JtXCI7XHJcbmltcG9ydCB7IFBhZ2luYXRpb24gfSBmcm9tIFwiLi4vcGFnaW5hdGlvbi9QYWdpbmF0aW9uXCI7XHJcbmltcG9ydCB7IGZldGNoQ29tbWVudHMsIHBvc3RDb21tZW50LCBlZGl0Q29tbWVudCwgZGVsZXRlQ29tbWVudCB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2NvbW1lbnRzXCI7XHJcbmltcG9ydCB7IGdldEZvcnVtQ29tbWVudHNEZWxldGVVcmwsIGdldEZvcnVtQ29tbWVudHNQYWdlVXJsIH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tbWVudHM6IHN0YXRlLmNvbW1lbnRzSW5mby5jb21tZW50cyxcclxuICAgICAgICBnZXROYW1lOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF07XHJcbiAgICAgICAgICAgIGlmICghdXNlcilcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7dXNlci5GaXJzdE5hbWV9ICR7dXNlci5MYXN0TmFtZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2FuRWRpdDogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZCA9PT0gaWQsXHJcbiAgICAgICAgcG9zdElkOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby5zZWxlY3RlZFRocmVhZCxcclxuICAgICAgICBwYWdlOiBzdGF0ZS5jb21tZW50c0luZm8ucGFnZSxcclxuICAgICAgICBza2lwOiBzdGF0ZS5jb21tZW50c0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5jb21tZW50c0luZm8udGFrZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS5jb21tZW50c0luZm8udG90YWxQYWdlcyxcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBlZGl0SGFuZGxlOiAoY29tbWVudElkLCBfLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuZm9ydW1jb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2goZWRpdENvbW1lbnQodXJsLCBjb21tZW50SWQsIHRleHQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVIYW5kbGU6IChjb21tZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEZvcnVtQ29tbWVudHNEZWxldGVVcmwoY29tbWVudElkKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlQ29tbWVudCh1cmwsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXBseUhhbmRsZTogKHBvc3RJZCwgdGV4dCwgcGFyZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudCh1cmwsIHBvc3RJZCwgdGV4dCwgcGFyZW50SWQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2FkQ29tbWVudHM6IChwb3N0SWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RIYW5kbGU6IChwb3N0SWQsIHRleHQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudCh1cmwsIHBvc3RJZCwgdGV4dCwgbnVsbCwgY2IpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBGb3J1bUNvbW1lbnRzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29tbWVudCA9IHRoaXMuZGVsZXRlQ29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZWRpdENvbW1lbnQgPSB0aGlzLmVkaXRDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZXBseUNvbW1lbnQgPSB0aGlzLnJlcGx5Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucG9zdENvbW1lbnQgPSB0aGlzLnBvc3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5wYWdlSGFuZGxlID0gdGhpcy5wYWdlSGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBwb3N0SWQsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBwYWdlIH0gPSBuZXh0UHJvcHMubG9jYXRpb24ucXVlcnk7XHJcbiAgICAgICAgaWYgKCFOdW1iZXIocGFnZSkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSBwYWdlIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKHBvc3RJZCwgc2tpcEl0ZW1zLCB0YWtlKTtcclxuICAgIH1cclxuICAgIHBhZ2VIYW5kbGUodG8pIHtcclxuICAgICAgICBjb25zdCB7IHBvc3RJZCwgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG4gICAgICAgIGlmIChwYWdlID09PSB0bylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAvZm9ydW0vcG9zdC8ke3Bvc3RJZH0vY29tbWVudHM/cGFnZT0ke3RvfWA7XHJcbiAgICAgICAgcHVzaCh1cmwpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlQ29tbWVudChjb21tZW50SWQsIHBvc3RJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVsZXRlSGFuZGxlLCBsb2FkQ29tbWVudHMsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGVsZXRlSGFuZGxlKGNvbW1lbnRJZCwgY2IpO1xyXG4gICAgfVxyXG4gICAgZWRpdENvbW1lbnQoY29tbWVudElkLCBwb3N0SWQsIHRleHQpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRIYW5kbGUsIGxvYWRDb21tZW50cywgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKHBvc3RJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBlZGl0SGFuZGxlKGNvbW1lbnRJZCwgcG9zdElkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcbiAgICByZXBseUNvbW1lbnQocG9zdElkLCB0ZXh0LCBwYXJlbnRJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlIYW5kbGUsIGxvYWRDb21tZW50cywgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKHBvc3RJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXBseUhhbmRsZShwb3N0SWQsIHRleHQsIHBhcmVudElkLCBjYik7XHJcbiAgICB9XHJcbiAgICBwb3N0Q29tbWVudCh0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIHBvc3RJZCwgc2tpcCwgdGFrZSwgcG9zdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKHBvc3RJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwb3N0SGFuZGxlKHBvc3RJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudHMsIGdldE5hbWUsIGNhbkVkaXQsIHRvdGFsUGFnZXMsIHBhZ2UsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgY29udHJvbHMgPSB7XHJcbiAgICAgICAgICAgIHNraXAsXHJcbiAgICAgICAgICAgIHRha2UsXHJcbiAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQ6IHRoaXMuZGVsZXRlQ29tbWVudCxcclxuICAgICAgICAgICAgZWRpdENvbW1lbnQ6IHRoaXMuZWRpdENvbW1lbnQsXHJcbiAgICAgICAgICAgIHJlcGx5Q29tbWVudDogdGhpcy5yZXBseUNvbW1lbnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBjbGFzc05hbWU6IFwiZm9ydW0tY29tbWVudHMtbGlzdFwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNFwiLCB7IGNsYXNzTmFtZTogXCJmb3J1bS1jb21tZW50cy1oZWFkaW5nXCIgfSwgXCJLb21tZW50YXJlclwiKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50TGlzdCwgX19hc3NpZ24oeyBjb21tZW50czogY29tbWVudHMsIGNvbnRleHRJZDogTnVtYmVyKGlkKSwgZ2V0TmFtZTogZ2V0TmFtZSwgY2FuRWRpdDogY2FuRWRpdCB9LCBjb250cm9scykpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhZ2luYXRpb24sIHsgdG90YWxQYWdlczogdG90YWxQYWdlcywgcGFnZTogcGFnZSwgcGFnZUhhbmRsZTogdGhpcy5wYWdlSGFuZGxlIH0pLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxMiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRGb3JtLCB7IHBvc3RIYW5kbGU6IHRoaXMucG9zdENvbW1lbnQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IEZvcnVtQ29tbWVudHNDb250YWluZXJSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEZvcnVtQ29tbWVudHNDb250YWluZXIpO1xyXG5jb25zdCBGb3J1bUNvbW1lbnRzID0gd2l0aFJvdXRlcihGb3J1bUNvbW1lbnRzQ29udGFpbmVyUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBGb3J1bUNvbW1lbnRzO1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgTGluayB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIFBhbmVsIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgVXNlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSwgZmlyc3ROYW1lLCBsYXN0TmFtZSwgZW1haWwgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgZW1haWxMaW5rID0gXCJtYWlsdG86XCIgKyBlbWFpbDtcclxuICAgICAgICBjb25zdCBnYWxsZXJ5ID0gXCIvXCIgKyB1c2VybmFtZSArIFwiL2dhbGxlcnlcIjtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDMgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQYW5lbCwgeyBoZWFkZXI6IGAke2ZpcnN0TmFtZX0gJHtsYXN0TmFtZX1gIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXJJdGVtLCB7IHRpdGxlOiBcIkJydWdlcm5hdm5cIiB9LCB1c2VybmFtZSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXJJdGVtLCB7IHRpdGxlOiBcIkVtYWlsXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IGVtYWlsTGluayB9LCBlbWFpbCkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVc2VySXRlbSwgeyB0aXRsZTogXCJCaWxsZWRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7IHRvOiBnYWxsZXJ5IH0sIFwiQmlsbGVkZXJcIikpKSk7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgVXNlckhlYWRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIHRoaXMucHJvcHMuY2hpbGRyZW4pKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBVc2VyQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA2IH0sIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIFVzZXJJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVc2VySGVhZGluZywgbnVsbCwgdGl0bGUpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXJCb2R5LCBudWxsLCB0aGlzLnByb3BzLmNoaWxkcmVuKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi9Vc2VyXCI7XHJcbmltcG9ydCB7IFJvdyB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIFVzZXJMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHVzZXJOb2RlcygpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB1c2Vycy5tYXAoKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlcklkID0gYHVzZXJJZF8ke3VzZXIuSUR9YDtcclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlciwgeyB1c2VybmFtZTogdXNlci5Vc2VybmFtZSwgdXNlcklkOiB1c2VyLklELCBmaXJzdE5hbWU6IHVzZXIuRmlyc3ROYW1lLCBsYXN0TmFtZTogdXNlci5MYXN0TmFtZSwgZW1haWw6IHVzZXIuRW1haWwsIHByb2ZpbGVVcmw6IHVzZXIuUHJvZmlsZUltYWdlLCByb2xlczogdXNlci5Sb2xlLCBrZXk6IHVzZXJJZCB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsIHRoaXMudXNlck5vZGVzKCkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5leHBvcnQgY2xhc3MgQnJlYWRjcnVtYiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJvbFwiLCB7IGNsYXNzTmFtZTogXCJicmVhZGNydW1iXCIgfSwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cclxuKGZ1bmN0aW9uIChCcmVhZGNydW1iKSB7XHJcbiAgICBjbGFzcyBJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgICAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgaHJlZiwgYWN0aXZlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogXCJhY3RpdmVcIiB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7IHRvOiBocmVmIH0sIHRoaXMucHJvcHMuY2hpbGRyZW4pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBCcmVhZGNydW1iLkl0ZW0gPSBJdGVtO1xyXG59KShCcmVhZGNydW1iIHx8IChCcmVhZGNydW1iID0ge30pKTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgZmV0Y2hVc2VycyB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL3VzZXJzXCI7XHJcbmltcG9ydCB7IFVzZXJMaXN0IH0gZnJvbSBcIi4uL3VzZXJzL1VzZXJMaXN0XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBQYWdlSGVhZGVyIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBCcmVhZGNydW1iIH0gZnJvbSBcIi4uL2JyZWFkY3J1bWJzL0JyZWFkY3J1bWJcIjtcclxuaW1wb3J0IHsgdmFsdWVzIH0gZnJvbSBcInVuZGVyc2NvcmVcIjtcclxuY29uc3QgbWFwVXNlcnNUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVzZXJzOiB2YWx1ZXMoc3RhdGUudXNlcnNJbmZvLnVzZXJzKVxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFVzZXJzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoVXNlcnMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgVXNlcnNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBcIkJydWdlcmVcIjtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYi5JdGVtLCB7IGhyZWY6IFwiL1wiIH0sIFwiRm9yc2lkZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLkl0ZW0sIHsgYWN0aXZlOiB0cnVlIH0sIFwiQnJ1Z2VyZVwiKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhZ2VIZWFkZXIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJJbnVwbGFuJ3MgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsIFwiYnJ1Z2VyZVwiKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXJMaXN0LCB7IHVzZXJzOiB1c2VycyB9KSkpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBVc2VycyA9IGNvbm5lY3QobWFwVXNlcnNUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFVzZXJzQ29udGFpbmVyKTtcclxuZXhwb3J0IGRlZmF1bHQgVXNlcnM7XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgSW1hZ2UgYXMgSW1hZ2VCcyB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3hIYW5kbGVyID0gdGhpcy5jaGVja2JveEhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNoZWNrYm94SGFuZGxlcihlKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBhZGQgPSBlLmN1cnJlbnRUYXJnZXQuY2hlY2tlZDtcclxuICAgICAgICBpZiAoYWRkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYWRkU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB7IHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbW1lbnRJY29uKGNvdW50KSB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBjb3VudCA9PT0gMCA/IFwiY29sLWxnLTYgdGV4dC1tdXRlZFwiIDogXCJjb2wtbGctNiB0ZXh0LXByaW1hcnlcIjtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBzdHlsZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgX19hc3NpZ24oe30sIHByb3BzKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwiZ2x5cGhpY29uIGdseXBoaWNvbi1jb21tZW50XCIsIFwiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCIgfSksXHJcbiAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICBjb3VudCk7XHJcbiAgICB9XHJcbiAgICBjaGVja2JveFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCBpbWFnZUlzU2VsZWN0ZWQsIGltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNoZWNrZWQgPSBpbWFnZUlzU2VsZWN0ZWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgcmV0dXJuIChjYW5FZGl0ID9cclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDYsIGNsYXNzTmFtZTogXCJwdWxsLXJpZ2h0IHRleHQtcmlnaHRcIiB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJTbGV0IFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7IHR5cGU6IFwiY2hlY2tib3hcIiwgb25DbGljazogdGhpcy5jaGVja2JveEhhbmRsZXIsIGNoZWNrZWQ6IGNoZWNrZWQgfSkpKVxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2UsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNvdW50ID0gaW1hZ2UuQ29tbWVudENvdW50O1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAvJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlLkltYWdlSUR9L2NvbW1lbnRzYDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IHVybCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbWFnZUJzLCB7IHNyYzogaW1hZ2UuUHJldmlld1VybCwgdGh1bWJuYWlsOiB0cnVlIH0pKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IHVybCB9LCB0aGlzLmNvbW1lbnRJY29uKGNvdW50KSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrYm94VmlldygpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEltYWdlIH0gZnJvbSBcIi4vSW1hZ2VcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmNvbnN0IGVsZW1lbnRzUGVyUm93ID0gNDtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2VMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFycmFuZ2VBcnJheShpbWFnZXMpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSBpbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHRpbWVzID0gTWF0aC5jZWlsKGxlbmd0aCAvIGVsZW1lbnRzUGVyUm93KTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVzOyBpKyspIHtcclxuICAgICAgICAgICAgc3RhcnQgPSBpICogZWxlbWVudHNQZXJSb3c7XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgZWxlbWVudHNQZXJSb3c7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBlbmQgPiBsZW5ndGg7XHJcbiAgICAgICAgICAgIGlmIChsYXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBpbWFnZXMuc2xpY2Uoc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGltYWdlcy5zbGljZShzdGFydCwgZW5kKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGltYWdlc1ZpZXcoaW1hZ2VzKSB7XHJcbiAgICAgICAgaWYgKGltYWdlcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHsgYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGNhbkVkaXQsIGltYWdlSXNTZWxlY3RlZCwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hcnJhbmdlQXJyYXkoaW1hZ2VzKTtcclxuICAgICAgICBjb25zdCB2aWV3ID0gcmVzdWx0Lm1hcCgocm93LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGltZ3MgPSByb3cubWFwKChpbWcpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMywga2V5OiBpbWcuSW1hZ2VJRCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2UsIHsgaW1hZ2U6IGltZywgY2FuRWRpdDogY2FuRWRpdCwgYWRkU2VsZWN0ZWRJbWFnZUlkOiBhZGRTZWxlY3RlZEltYWdlSWQsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZDogcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBpbWFnZUlzU2VsZWN0ZWQ6IGltYWdlSXNTZWxlY3RlZCwgdXNlcm5hbWU6IHVzZXJuYW1lIH0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0lkID0gXCJyb3dJZFwiICsgaTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCB7IGtleTogcm93SWQgfSwgaW1ncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLCB0aGlzLmltYWdlc1ZpZXcoaW1hZ2VzKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgdXBsb2FkSW1hZ2UsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgZGVsZXRlSW1hZ2VzLCByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcywgZmV0Y2hVc2VySW1hZ2VzIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvaW1hZ2VzXCI7XHJcbmltcG9ydCB7IEltYWdlVXBsb2FkIH0gZnJvbSBcIi4uL2ltYWdlcy9JbWFnZVVwbG9hZFwiO1xyXG5pbXBvcnQgSW1hZ2VMaXN0IGZyb20gXCIuLi9pbWFnZXMvSW1hZ2VMaXN0XCI7XHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQnV0dG9uIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBCcmVhZGNydW1iIH0gZnJvbSBcIi4uL2JyZWFkY3J1bWJzL0JyZWFkY3J1bWJcIjtcclxuaW1wb3J0IHsgdmFsdWVzIH0gZnJvbSBcInVuZGVyc2NvcmVcIjtcclxuaW1wb3J0IFVzZWRTcGFjZSBmcm9tIFwiLi9Vc2VkU3BhY2VcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IG93bmVySWQgfSA9IHN0YXRlLmltYWdlc0luZm87XHJcbiAgICBjb25zdCBjdXJyZW50SWQgPSBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZDtcclxuICAgIGNvbnN0IGNhbkVkaXQgPSAob3duZXJJZCA+IDAgJiYgY3VycmVudElkID4gMCAmJiBvd25lcklkID09PSBjdXJyZW50SWQpO1xyXG4gICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tvd25lcklkXTtcclxuICAgIGNvbnN0IGZ1bGxOYW1lID0gdXNlciA/IGAke3VzZXIuRmlyc3ROYW1lfSAke3VzZXIuTGFzdE5hbWV9YCA6IFwiXCI7XHJcbiAgICBjb25zdCBpbWFnZXMgPSB2YWx1ZXMoc3RhdGUuaW1hZ2VzSW5mby5pbWFnZXMpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbWFnZXM6IGltYWdlcyxcclxuICAgICAgICBjYW5FZGl0OiBjYW5FZGl0LFxyXG4gICAgICAgIHNlbGVjdGVkSW1hZ2VJZHM6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkcyxcclxuICAgICAgICBmdWxsTmFtZTogZnVsbE5hbWUsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBsb2FkSW1hZ2U6ICh1c2VybmFtZSwgZm9ybURhdGEpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2godXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhLCAoKSA9PiB7IGRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpOyB9LCAoKSA9PiB7IH0pKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFkZFNlbGVjdGVkSW1hZ2VJZChpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJbWFnZXM6ICh1c2VybmFtZSwgaWRzKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgaWRzKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGVhclNlbGVjdGVkSW1hZ2VJZHM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFVzZXJJbWFnZXNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZUlzU2VsZWN0ZWQgPSB0aGlzLmltYWdlSXNTZWxlY3RlZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMgPSB0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGVkID0gdGhpcy5jbGVhclNlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHJvdXRlciwgcm91dGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB1c2VybmFtZSArIFwiJ3MgYmlsbGVkZXJcIjtcclxuICAgICAgICByb3V0ZXIuc2V0Um91dGVMZWF2ZUhvb2socm91dGUsIHRoaXMuY2xlYXJTZWxlY3RlZCk7XHJcbiAgICB9XHJcbiAgICBjbGVhclNlbGVjdGVkKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xlYXJTZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgaW1hZ2VJc1NlbGVjdGVkKGNoZWNrSWQpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVzID0gZmluZChzZWxlY3RlZEltYWdlSWRzLCAoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkID09PSBjaGVja0lkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcbiAgICBkZWxldGVTZWxlY3RlZEltYWdlcygpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMsIGRlbGV0ZUltYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBkZWxldGVJbWFnZXModXNlcm5hbWUsIHNlbGVjdGVkSW1hZ2VJZHMpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZCgpO1xyXG4gICAgfVxyXG4gICAgdXBsb2FkVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIHVwbG9hZEltYWdlLCBzZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IGhhc0ltYWdlcyA9IHNlbGVjdGVkSW1hZ2VJZHMubGVuZ3RoID4gMDtcclxuICAgICAgICBpZiAoIWNhbkVkaXQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDQgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2VVcGxvYWQsIHsgdXBsb2FkSW1hZ2U6IHVwbG9hZEltYWdlLCB1c2VybmFtZTogdXNlcm5hbWUgfSxcclxuICAgICAgICAgICAgICAgICAgICBcIlxcdTAwQTBcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcImRhbmdlclwiLCBkaXNhYmxlZDogIWhhc0ltYWdlcywgb25DbGljazogdGhpcy5kZWxldGVTZWxlY3RlZEltYWdlcyB9LCBcIlNsZXQgbWFya2VyZXQgYmlsbGVkZXJcIikpKSk7XHJcbiAgICB9XHJcbiAgICB1cGxvYWRMaW1pdFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghY2FuRWRpdClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlZFNwYWNlLCBudWxsKSkpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VzLCBmdWxsTmFtZSwgY2FuRWRpdCwgYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLkl0ZW0sIHsgaHJlZjogXCIvXCIgfSwgXCJGb3JzaWRlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIuSXRlbSwgeyBhY3RpdmU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIncyBiaWxsZWRlclwiKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwidGV4dC1jYXBpdGFsaXplXCIgfSwgZnVsbE5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIidzIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic21hbGxcIiwgbnVsbCwgXCJiaWxsZWRlIGdhbGxlcmlcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlTGlzdCwgeyBpbWFnZXM6IGltYWdlcywgY2FuRWRpdDogY2FuRWRpdCwgYWRkU2VsZWN0ZWRJbWFnZUlkOiBhZGRTZWxlY3RlZEltYWdlSWQsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZDogcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBpbWFnZUlzU2VsZWN0ZWQ6IHRoaXMuaW1hZ2VJc1NlbGVjdGVkLCB1c2VybmFtZTogdXNlcm5hbWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRWaWV3KCkpKSxcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRMaW1pdFZpZXcoKSxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgVXNlckltYWdlc1JlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlckltYWdlc0NvbnRhaW5lcik7XHJcbmNvbnN0IFVzZXJJbWFnZXMgPSB3aXRoUm91dGVyKFVzZXJJbWFnZXNSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJJbWFnZXM7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBzZXRTZWxlY3RlZEltZywgZmV0Y2hTaW5nbGVJbWFnZSwgZGVsZXRlSW1hZ2UgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9pbWFnZXNcIjtcclxuaW1wb3J0IHsgc2V0U2tpcENvbW1lbnRzLCBzZXRUYWtlQ29tbWVudHMsIHNldEZvY3VzZWRDb21tZW50LCByZWNlaXZlZENvbW1lbnRzIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvY29tbWVudHNcIjtcclxuaW1wb3J0IHsgc2V0RXJyb3IgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9lcnJvclwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IE1vZGFsLCBJbWFnZSwgQnV0dG9uLCBCdXR0b25Ub29sYmFyLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3Qgb3duZXJJZCA9IHN0YXRlLmltYWdlc0luZm8ub3duZXJJZDtcclxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkO1xyXG4gICAgY29uc3QgY2FuRWRpdCA9IChvd25lcklkID4gMCAmJiBjdXJyZW50SWQgPiAwICYmIG93bmVySWQgPT09IGN1cnJlbnRJZCk7XHJcbiAgICBjb25zdCBnZXRJbWFnZSA9IChpZCkgPT4gc3RhdGUuaW1hZ2VzSW5mby5pbWFnZXNbaWRdO1xyXG4gICAgY29uc3QgaW1hZ2UgPSAoKSA9PiBnZXRJbWFnZShzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCk7XHJcbiAgICBjb25zdCBmaWxlbmFtZSA9ICgpID0+IHsgaWYgKGltYWdlKCkpXHJcbiAgICAgICAgcmV0dXJuIGltYWdlKCkuRmlsZW5hbWU7IHJldHVybiBcIlwiOyB9O1xyXG4gICAgY29uc3QgcHJldmlld1VybCA9ICgpID0+IHsgaWYgKGltYWdlKCkpXHJcbiAgICAgICAgcmV0dXJuIGltYWdlKCkuUHJldmlld1VybDsgcmV0dXJuIFwiXCI7IH07XHJcbiAgICBjb25zdCBleHRlbnNpb24gPSAoKSA9PiB7IGlmIChpbWFnZSgpKVxyXG4gICAgICAgIHJldHVybiBpbWFnZSgpLkV4dGVuc2lvbjsgcmV0dXJuIFwiXCI7IH07XHJcbiAgICBjb25zdCBvcmlnaW5hbFVybCA9ICgpID0+IHsgaWYgKGltYWdlKCkpXHJcbiAgICAgICAgcmV0dXJuIGltYWdlKCkuT3JpZ2luYWxVcmw7IHJldHVybiBcIlwiOyB9O1xyXG4gICAgY29uc3QgdXBsb2FkZWQgPSAoKSA9PiB7IGlmIChpbWFnZSgpKVxyXG4gICAgICAgIHJldHVybiBpbWFnZSgpLlVwbG9hZGVkOyByZXR1cm4gbmV3IERhdGUoKTsgfTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2FuRWRpdDogY2FuRWRpdCxcclxuICAgICAgICBoYXNJbWFnZTogKCkgPT4gQm9vbGVhbihnZXRJbWFnZShzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCkpLFxyXG4gICAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZSgpLFxyXG4gICAgICAgIHByZXZpZXdVcmw6IHByZXZpZXdVcmwoKSxcclxuICAgICAgICBleHRlbnNpb246IGV4dGVuc2lvbigpLFxyXG4gICAgICAgIG9yaWdpbmFsVXJsOiBvcmlnaW5hbFVybCgpLFxyXG4gICAgICAgIHVwbG9hZGVkOiB1cGxvYWRlZCgpXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc2VsZWN0SW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcodW5kZWZpbmVkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRFcnJvcjogKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaEltYWdlOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hTaW5nbGVJbWFnZShpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2U6IChpZCwgdXNlcm5hbWUpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNldENvbW1lbnRzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNraXBDb21tZW50cygwKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2VDb21tZW50cygxMCkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRGb2N1c2VkQ29tbWVudCgtMSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlZENvbW1lbnRzKFtdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgTW9kYWxJbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUltYWdlSGFuZGxlciA9IHRoaXMuZGVsZXRlSW1hZ2VIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnNlZUFsbENvbW1lbnRzVmlldyA9IHRoaXMuc2VlQWxsQ29tbWVudHNWaWV3LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZWxvYWQgPSB0aGlzLnJlbG9hZC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZXNlbGVjdEltYWdlLCByZXNldENvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgZGVzZWxlY3RJbWFnZSgpO1xyXG4gICAgICAgIGNvbnN0IGdhbGxlcnlVcmwgPSBgLyR7dXNlcm5hbWV9L2dhbGxlcnlgO1xyXG4gICAgICAgIHJlc2V0Q29tbWVudHMoKTtcclxuICAgICAgICBwdXNoKGdhbGxlcnlVcmwpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlSW1hZ2VIYW5kbGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVsZXRlSW1hZ2UsIHNldFNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGlkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgZGVsZXRlSW1hZ2UoTnVtYmVyKGlkKSwgdXNlcm5hbWUpO1xyXG4gICAgICAgIHNldFNlbGVjdGVkSW1hZ2VJZCgtMSk7XHJcbiAgICB9XHJcbiAgICBkZWxldGVJbWFnZVZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghY2FuRWRpdClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwiZGFuZ2VyXCIsIG9uQ2xpY2s6IHRoaXMuZGVsZXRlSW1hZ2VIYW5kbGVyIH0sIFwiU2xldCBiaWxsZWRlXCIpO1xyXG4gICAgfVxyXG4gICAgcmVsb2FkKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpZH0vY29tbWVudHNgO1xyXG4gICAgICAgIHB1c2gocGF0aCk7XHJcbiAgICB9XHJcbiAgICBzZWVBbGxDb21tZW50c1ZpZXcoKSB7XHJcbiAgICAgICAgY29uc3Qgc2hvdyA9ICFCb29sZWFuKHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgICAgIGlmICghc2hvdylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgb25DbGljazogdGhpcy5yZWxvYWQgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcInJlZnJlc2hcIiB9KSxcclxuICAgICAgICAgICAgICAgIFwiIFNlIGFsbGUga29tbWVudGFyZXI/XCIpKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGZpbGVuYW1lLCBwcmV2aWV3VXJsLCBleHRlbnNpb24sIG9yaWdpbmFsVXJsLCB1cGxvYWRlZCwgaGFzSW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgc2hvdyA9IGhhc0ltYWdlKCk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGZpbGVuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICAgICAgY29uc3QgdXBsb2FkRGF0ZSA9IG1vbWVudCh1cGxvYWRlZCk7XHJcbiAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IFwiVXBsb2FkZWQgZC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwsIHsgc2hvdzogc2hvdywgb25IaWRlOiB0aGlzLmNsb3NlLCBic1NpemU6IFwibGFyZ2VcIiwgYW5pbWF0aW9uOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuSGVhZGVyLCB7IGNsb3NlQnV0dG9uOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLlRpdGxlLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiAtIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVN0cmluZykpKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogb3JpZ2luYWxVcmwsIHRhcmdldDogXCJfYmxhbmtcIiwgcmVsOiBcIm5vb3BlbmVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlLCB7IHNyYzogcHJldmlld1VybCwgcmVzcG9uc2l2ZTogdHJ1ZSwgY2xhc3NOYW1lOiBcImNlbnRlci1ibG9ja1wiIH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuRm9vdGVyLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWVBbGxDb21tZW50c1ZpZXcoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIHsgc3R5bGU6IHsgZmxvYXQ6IFwicmlnaHRcIiB9IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVJbWFnZVZpZXcoKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0aGlzLmNsb3NlIH0sIFwiTHVrXCIpKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IFNlbGVjdGVkSW1hZ2VSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKE1vZGFsSW1hZ2UpO1xyXG5jb25zdCBTZWxlY3RlZEltYWdlID0gd2l0aFJvdXRlcihTZWxlY3RlZEltYWdlUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RlZEltYWdlO1xyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgZmV0Y2hDb21tZW50cywgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvY29tbWVudHNcIjtcclxuaW1wb3J0IHsgaW5jcmVtZW50Q29tbWVudENvdW50LCBkZWNyZW1lbnRDb21tZW50Q291bnQgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9pbWFnZXNcIjtcclxuaW1wb3J0IHsgQ29tbWVudExpc3QgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudExpc3RcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSBcIi4uL3BhZ2luYXRpb24vUGFnaW5hdGlvblwiO1xyXG5pbXBvcnQgeyBDb21tZW50Rm9ybSB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50Rm9ybVwiO1xyXG5pbXBvcnQgeyBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybCwgZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09PSBpZCxcclxuICAgICAgICBpbWFnZUlkOiBzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCxcclxuICAgICAgICBza2lwOiBzdGF0ZS5jb21tZW50c0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5jb21tZW50c0luZm8udGFrZSxcclxuICAgICAgICBwYWdlOiBzdGF0ZS5jb21tZW50c0luZm8ucGFnZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS5jb21tZW50c0luZm8udG90YWxQYWdlcyxcclxuICAgICAgICBjb21tZW50czogc3RhdGUuY29tbWVudHNJbmZvLmNvbW1lbnRzLFxyXG4gICAgICAgIGdldE5hbWU6ICh1c2VySWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1t1c2VySWRdO1xyXG4gICAgICAgICAgICBjb25zdCB7IEZpcnN0TmFtZSwgTGFzdE5hbWUgfSA9IHVzZXI7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtGaXJzdE5hbWV9ICR7TGFzdE5hbWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG93bmVyOiBzdGF0ZS51c2Vyc0luZm8udXNlcnNbc3RhdGUuaW1hZ2VzSW5mby5vd25lcklkXVxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBvc3RIYW5kbGU6IChpbWFnZUlkLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBpbWFnZUlkLCB0ZXh0LCBudWxsLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmV0Y2hDb21tZW50czogKGltYWdlSWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VDb21tZW50c1BhZ2VVcmwoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlZGl0SGFuZGxlOiAoY29tbWVudElkLCBfLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2goZWRpdENvbW1lbnQodXJsLCBjb21tZW50SWQsIHRleHQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVIYW5kbGU6IChjb21tZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNEZWxldGVVcmwoY29tbWVudElkKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlQ29tbWVudCh1cmwsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXBseUhhbmRsZTogKGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluY3JlbWVudENvdW50OiAoaW1hZ2VJZCkgPT4gZGlzcGF0Y2goaW5jcmVtZW50Q29tbWVudENvdW50KGltYWdlSWQpKSxcclxuICAgICAgICBkZWNyZW1lbnRDb3VudDogKGltYWdlSWQpID0+IGRpc3BhdGNoKGRlY3JlbWVudENvbW1lbnRDb3VudChpbWFnZUlkKSksXHJcbiAgICAgICAgbG9hZENvbW1lbnRzOiAoaW1hZ2VJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybChpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBDb21tZW50c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQgPSB0aGlzLmRlbGV0ZUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmVkaXRDb21tZW50ID0gdGhpcy5lZGl0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlDb21tZW50ID0gdGhpcy5yZXBseUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnBvc3RDb21tZW50ID0gdGhpcy5wb3N0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7IGZldGNoQ29tbWVudHMsIGltYWdlSWQsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBwYWdlIH0gPSBuZXh0UHJvcHMubG9jYXRpb24ucXVlcnk7XHJcbiAgICAgICAgaWYgKCFOdW1iZXIocGFnZSkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSBwYWdlIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgb3duZXIsIGltYWdlSWQsIHBhZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBjb25zdCB1c2VybmFtZSA9IG93bmVyLlVzZXJuYW1lO1xyXG4gICAgICAgIGlmIChwYWdlID09PSB0bylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAvJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlSWR9L2NvbW1lbnRzP3BhZ2U9JHt0b31gO1xyXG4gICAgICAgIHB1c2godXJsKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVIYW5kbGUsIGxvYWRDb21tZW50cywgZGVjcmVtZW50Q291bnQsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRlY3JlbWVudENvdW50KGltYWdlSWQpO1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkZWxldGVIYW5kbGUoY29tbWVudElkLCBjYik7XHJcbiAgICB9XHJcbiAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIGltYWdlSWQsIHRleHQpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgc2tpcCwgdGFrZSwgZWRpdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICBlZGl0SGFuZGxlKGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG4gICAgcmVwbHlDb21tZW50KGltYWdlSWQsIHRleHQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGluY3JlbWVudENvdW50LCBza2lwLCB0YWtlLCByZXBseUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgaW5jcmVtZW50Q291bnQoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcGx5SGFuZGxlKGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYik7XHJcbiAgICB9XHJcbiAgICBwb3N0Q29tbWVudCh0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCBsb2FkQ29tbWVudHMsIGluY3JlbWVudENvdW50LCBza2lwLCB0YWtlLCBwb3N0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpbmNyZW1lbnRDb3VudChpbWFnZUlkKTtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcG9zdEhhbmRsZShpbWFnZUlkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCBjb21tZW50cywgZ2V0TmFtZSwgaW1hZ2VJZCwgcGFnZSwgdG90YWxQYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY29udHJvbHMgPSB7XHJcbiAgICAgICAgICAgIHNraXAsXHJcbiAgICAgICAgICAgIHRha2UsXHJcbiAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQ6IHRoaXMuZGVsZXRlQ29tbWVudCxcclxuICAgICAgICAgICAgZWRpdENvbW1lbnQ6IHRoaXMuZWRpdENvbW1lbnQsXHJcbiAgICAgICAgICAgIHJlcGx5Q29tbWVudDogdGhpcy5yZXBseUNvbW1lbnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRleHQtbGVmdFwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDEsIGxnOiAxMSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudExpc3QsIF9fYXNzaWduKHsgY29udGV4dElkOiBpbWFnZUlkLCBjb21tZW50czogY29tbWVudHMsIGdldE5hbWU6IGdldE5hbWUsIGNhbkVkaXQ6IGNhbkVkaXQgfSwgY29udHJvbHMpKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAxLCBsZzogMTAgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhZ2luYXRpb24sIHsgdG90YWxQYWdlczogdG90YWxQYWdlcywgcGFnZTogcGFnZSwgcGFnZUhhbmRsZTogdGhpcy5wYWdlSGFuZGxlIH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMSwgbGc6IDEwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50Rm9ybSwgeyBwb3N0SGFuZGxlOiB0aGlzLnBvc3RDb21tZW50IH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IENvbW1lbnRzUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShDb21tZW50c0NvbnRhaW5lcik7XHJcbmNvbnN0IEltYWdlQ29tbWVudHMgPSB3aXRoUm91dGVyKENvbW1lbnRzUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBJbWFnZUNvbW1lbnRzO1xyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudCB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgV2VsbCwgQnV0dG9uLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IGZldGNoQW5kRm9jdXNTaW5nbGVDb21tZW50LCBwb3N0Q29tbWVudCwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9jb21tZW50c1wiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsIH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgY29tbWVudHMsIGZvY3VzZWRDb21tZW50IH0gPSBzdGF0ZS5jb21tZW50c0luZm87XHJcbiAgICBjb25zdCB7IHVzZXJzIH0gPSBzdGF0ZS51c2Vyc0luZm87XHJcbiAgICBjb25zdCB7IG93bmVySWQsIHNlbGVjdGVkSW1hZ2VJZCB9ID0gc3RhdGUuaW1hZ2VzSW5mbztcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TmFtZTogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IHVzZXJzW2lkXTtcclxuICAgICAgICAgICAgcmV0dXJuIGAke2F1dGhvci5GaXJzdE5hbWV9ICR7YXV0aG9yLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb2N1c2VkSWQ6IGZvY3VzZWRDb21tZW50LFxyXG4gICAgICAgIGZvY3VzZWQ6IGNvbW1lbnRzWzBdLFxyXG4gICAgICAgIGltYWdlSWQ6IHNlbGVjdGVkSW1hZ2VJZCxcclxuICAgICAgICBpbWFnZU93bmVyOiB1c2Vyc1tvd25lcklkXS5Vc2VybmFtZSxcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09PSBpZCxcclxuICAgICAgICBza2lwOiBzdGF0ZS5jb21tZW50c0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5jb21tZW50c0luZm8udGFrZSxcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBlZGl0SGFuZGxlOiAoY29tbWVudElkLCBfLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2goZWRpdENvbW1lbnQodXJsLCBjb21tZW50SWQsIHRleHQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVIYW5kbGU6IChjb21tZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNEZWxldGVVcmwoY29tbWVudElkKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlQ29tbWVudCh1cmwsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXBseUhhbmRsZTogKGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvY3VzQ29tbWVudDogKGlkKSA9PiBkaXNwYXRjaChmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudChpZCkpXHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBTaW5nbGVDb21tZW50UmVkdXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5hbGxDb21tZW50cyA9IHRoaXMuYWxsQ29tbWVudHMuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQgPSB0aGlzLmRlbGV0ZUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmVkaXRDb21tZW50ID0gdGhpcy5lZGl0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlDb21tZW50ID0gdGhpcy5yZXBseUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGFsbENvbW1lbnRzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VJZCwgaW1hZ2VPd25lciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBgLyR7aW1hZ2VPd25lcn0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlSWR9L2NvbW1lbnRzYDtcclxuICAgICAgICBwdXNoKHBhdGgpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlQ29tbWVudChjb21tZW50SWQsIF8pIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBkZWxldGVIYW5kbGUoY29tbWVudElkLCB0aGlzLmFsbENvbW1lbnRzKTtcclxuICAgIH1cclxuICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgY29udGV4dElkLCB0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0SGFuZGxlLCBmb2N1c0NvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiBmb2N1c0NvbW1lbnQoY29tbWVudElkKTtcclxuICAgICAgICBlZGl0SGFuZGxlKGNvbW1lbnRJZCwgY29udGV4dElkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcbiAgICByZXBseUNvbW1lbnQoY29udGV4dElkLCB0ZXh0LCBwYXJlbnRJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmVwbHlIYW5kbGUoY29udGV4dElkLCB0ZXh0LCBwYXJlbnRJZCwgdGhpcy5hbGxDb21tZW50cyk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBmb2N1c2VkSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKGZvY3VzZWRJZCA8IDApXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHsgVGV4dCwgQXV0aG9ySUQsIENvbW1lbnRJRCwgUG9zdGVkT24sIEVkaXRlZCB9ID0gdGhpcy5wcm9wcy5mb2N1c2VkO1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgaW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7XHJcbiAgICAgICAgICAgIHNraXAsXHJcbiAgICAgICAgICAgIHRha2UsXHJcbiAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQ6IHRoaXMuZGVsZXRlQ29tbWVudCxcclxuICAgICAgICAgICAgZWRpdENvbW1lbnQ6IHRoaXMuZWRpdENvbW1lbnQsXHJcbiAgICAgICAgICAgIHJlcGx5Q29tbWVudDogdGhpcy5yZXBseUNvbW1lbnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnByb3BzLmdldE5hbWUoQXV0aG9ySUQpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRleHQtbGVmdFwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2VsbCwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudCwgX19hc3NpZ24oeyBjb250ZXh0SWQ6IGltYWdlSWQsIG5hbWU6IG5hbWUsIHRleHQ6IFRleHQsIGNvbW1lbnRJZDogQ29tbWVudElELCByZXBsaWVzOiBbXSwgY2FuRWRpdDogY2FuRWRpdCwgYXV0aG9ySWQ6IEF1dGhvcklELCBwb3N0ZWRPbjogUG9zdGVkT24sIGVkaXRlZDogRWRpdGVkIH0sIHByb3BzKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgb25DbGljazogdGhpcy5hbGxDb21tZW50cyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJyZWZyZXNoXCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiIFNlIGFsbGUga29tbWVudGFyZXI/XCIpKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IFNpbmdsZUNvbW1lbnRDb25uZWN0ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoU2luZ2xlQ29tbWVudFJlZHV4KTtcclxuY29uc3QgU2luZ2xlSW1hZ2VDb21tZW50ID0gd2l0aFJvdXRlcihTaW5nbGVDb21tZW50Q29ubmVjdCk7XHJcbmV4cG9ydCBkZWZhdWx0IFNpbmdsZUltYWdlQ29tbWVudDtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBCcmVhZGNydW1iIH0gZnJvbSBcIi4uL2JyZWFkY3J1bWJzL0JyZWFkY3J1bWJcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJvdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBcIk9tXCI7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLkl0ZW0sIHsgaHJlZjogXCIvXCIgfSwgXCJGb3JzaWRlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIuSXRlbSwgeyBhY3RpdmU6IHRydWUgfSwgXCJPbVwiKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGV0dGUgZXIgZW4gc2luZ2xlIHBhZ2UgYXBwbGljYXRpb24hXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVGVrbm9sb2dpZXIgYnJ1Z3Q6XCIpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiUmVhY3RcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiUmVkdXhcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiUmVhY3QtQm9vdHN0cmFwXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIlJlYWN0Um91dGVyXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIkFzcC5uZXQgQ29yZSBSQyAyXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIkFzcC5uZXQgV2ViIEFQSSAyXCIpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5jb25zdCB1c2VycyA9IChzdGF0ZSA9IHt9LCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDIyOlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGN1cnJlbnRVc2VySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyMDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdXNlcnNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGN1cnJlbnRVc2VySWQsXHJcbiAgICB1c2Vyc1xyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgdXNlcnNJbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuaW1wb3J0IHsgcHV0IH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBmaWx0ZXIsIG9taXQgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5jb25zdCBvd25lcklkID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMTA6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5jb25zdCBpbWFnZXMgPSAoc3RhdGUgPSB7fSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxMzpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwdXQoc3RhdGUsIGltYWdlLkltYWdlSUQsIGltYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgMTE6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgMTQ6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYWN0aW9uLnBheWxvYWQuSW1hZ2VJRDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBvbWl0KHN0YXRlLCBpZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAxODpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBhY3Rpb24ucGF5bG9hZC5JbWFnZUlEO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBzdGF0ZVtpZF07XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5Db21tZW50Q291bnQrKztcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHB1dChzdGF0ZSwgaWQsIGltYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIDE5OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGFjdGlvbi5wYXlsb2FkLkltYWdlSUQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZSA9IHN0YXRlW2lkXTtcclxuICAgICAgICAgICAgICAgIGltYWdlLkNvbW1lbnRDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcHV0KHN0YXRlLCBpZCwgaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5jb25zdCBzZWxlY3RlZEltYWdlSWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxMjpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHNlbGVjdGVkSW1hZ2VJZHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxNTpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWVyZ2UgPSBzdGF0ZS5jb25jYXQoYWN0aW9uLnBheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gWy4uLm5ldyBTZXQobWVyZ2UpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIDE2OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyKHN0YXRlLCAoaWQpID0+IGlkICE9PSBhY3Rpb24ucGF5bG9hZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIDE3OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxufTtcclxuY29uc3QgaW1hZ2VzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBvd25lcklkLFxyXG4gICAgaW1hZ2VzLFxyXG4gICAgc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgc2VsZWN0ZWRJbWFnZUlkc1xyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgaW1hZ2VzSW5mbztcclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmNvbnN0IGNvbW1lbnRzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgNDE6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCBbXTtcclxuICAgICAgICBjYXNlIDQyOlxyXG4gICAgICAgICAgICByZXR1cm4gWy4uLnN0YXRlLCBhY3Rpb24ucGF5bG9hZFswXV07XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBza2lwID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzNDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0YWtlID0gKHN0YXRlID0gMTAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAxMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHBhZ2UgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDM4OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDM5OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGZvY3VzZWRDb21tZW50ID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgNDM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAtMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGNvbW1lbnRzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjb21tZW50cyxcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXMsXHJcbiAgICBmb2N1c2VkQ29tbWVudFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgY29tbWVudHNJbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuaW1wb3J0IHsgdW5pb24gfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmNvbnN0IHNraXBUaHJlYWRzID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyODpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdGFrZVRocmVhZHMgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyOTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgcGFnZVRocmVhZHMgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDI3OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0b3RhbFBhZ2VzVGhyZWFkID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyNjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3Qgc2VsZWN0ZWRUaHJlYWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzMDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdGl0bGVzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMjQ6XHJcbiAgICAgICAgICAgIHJldHVybiB1bmlvbihhY3Rpb24ucGF5bG9hZCwgc3RhdGUsICh0MSwgdDIpID0+IHQxLklEID09PSB0Mi5JRCk7XHJcbiAgICAgICAgY2FzZSAyNTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgcG9zdENvbnRlbnQgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDMxOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0aXRsZXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHRpdGxlcyxcclxuICAgIHNraXA6IHNraXBUaHJlYWRzLFxyXG4gICAgdGFrZTogdGFrZVRocmVhZHMsXHJcbiAgICBwYWdlOiBwYWdlVGhyZWFkcyxcclxuICAgIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXNUaHJlYWQsXHJcbiAgICBzZWxlY3RlZFRocmVhZFxyXG59KTtcclxuY29uc3QgZm9ydW1JbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHRpdGxlc0luZm8sXHJcbiAgICBwb3N0Q29udGVudFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgZm9ydW1JbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuZXhwb3J0IGNvbnN0IHRpdGxlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgXCJcIjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBtZXNzYWdlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgXCJcIjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGVycm9ySW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB0aXRsZSxcclxuICAgIG1lc3NhZ2VcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IGVycm9ySW5mbztcclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmltcG9ydCBlcnJvckluZm8gZnJvbSBcIi4vZXJyb3JJbmZvXCI7XHJcbmV4cG9ydCBjb25zdCBoYXNFcnJvciA9IChzdGF0ZSA9IGZhbHNlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBtZXNzYWdlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgZG9uZSA9IChzdGF0ZSA9IHRydWUsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IHVzZWRTcGFjZWtCID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzMjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IHRvdGFsU3BhY2VrQiA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDMzOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3Qgc3BhY2VJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHVzZWRTcGFjZWtCLFxyXG4gICAgdG90YWxTcGFjZWtCXHJcbn0pO1xyXG5jb25zdCBzdGF0dXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGhhc0Vycm9yLFxyXG4gICAgZXJyb3JJbmZvLFxyXG4gICAgc3BhY2VJbmZvLFxyXG4gICAgbWVzc2FnZSxcclxuICAgIGRvbmVcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHN0YXR1c0luZm87XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5jb25zdCBza2lwID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMTA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBwYWdlID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDk6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgaXRlbXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgW107XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB3aGF0c05ld0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgc2tpcCxcclxuICAgIHRha2UsXHJcbiAgICBwYWdlLFxyXG4gICAgdG90YWxQYWdlcyxcclxuICAgIGl0ZW1zXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCB3aGF0c05ld0luZm87XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5pbXBvcnQgdXNlcnNJbmZvIGZyb20gXCIuL3VzZXJzSW5mb1wiO1xyXG5pbXBvcnQgaW1hZ2VzSW5mbyBmcm9tIFwiLi9pbWFnZXNJbmZvXCI7XHJcbmltcG9ydCBjb21tZW50c0luZm8gZnJvbSBcIi4vY29tbWVudHNJbmZvXCI7XHJcbmltcG9ydCBmb3J1bUluZm8gZnJvbSBcIi4vZm9ydW1JbmZvXCI7XHJcbmltcG9ydCBzdGF0dXNJbmZvIGZyb20gXCIuL3N0YXR1c0luZm9cIjtcclxuaW1wb3J0IHdoYXRzTmV3SW5mbyBmcm9tIFwiLi93aGF0c05ld0luZm9cIjtcclxuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdXNlcnNJbmZvLFxyXG4gICAgaW1hZ2VzSW5mbyxcclxuICAgIGNvbW1lbnRzSW5mbyxcclxuICAgIGZvcnVtSW5mbyxcclxuICAgIHN0YXR1c0luZm8sXHJcbiAgICB3aGF0c05ld0luZm9cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyO1xyXG4iLCJpbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlIH0gZnJvbSBcInJlZHV4XCI7XHJcbmltcG9ydCB0aHVuayBmcm9tIFwicmVkdXgtdGh1bmtcIjtcclxuaW1wb3J0IHJvb3RSZWR1Y2VyIGZyb20gXCIuLi9yZWR1Y2Vycy9yb290XCI7XHJcbmNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocm9vdFJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZSh0aHVuaykpO1xyXG5leHBvcnQgZGVmYXVsdCBzdG9yZTtcclxuIiwiaW1wb3J0IHN0b3JlIGZyb20gXCIuLi9zdG9yZS9zdG9yZVwiO1xyXG5pbXBvcnQgeyBmZXRjaExhdGVzdE5ld3MgfSBmcm9tIFwiLi4vYWN0aW9ucy93aGF0c25ld1wiO1xyXG5pbXBvcnQgeyBmZXRjaFRocmVhZHMsIGZldGNoUG9zdCB9IGZyb20gXCIuLi9hY3Rpb25zL2ZvcnVtXCI7XHJcbmltcG9ydCB7IGZldGNoQ3VycmVudFVzZXIsIGZldGNoVXNlcnMgfSBmcm9tIFwiLi4vYWN0aW9ucy91c2Vyc1wiO1xyXG5pbXBvcnQgeyBmZXRjaFVzZXJJbWFnZXMsIHNldFNlbGVjdGVkSW1nLCBzZXRJbWFnZU93bmVyIH0gZnJvbSBcIi4uL2FjdGlvbnMvaW1hZ2VzXCI7XHJcbmltcG9ydCB7IGZldGNoQ29tbWVudHMsIHNldFNraXBDb21tZW50cywgc2V0VGFrZUNvbW1lbnRzLCBmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudCB9IGZyb20gXCIuLi9hY3Rpb25zL2NvbW1lbnRzXCI7XHJcbmltcG9ydCB7IGdldEltYWdlQ29tbWVudHNQYWdlVXJsLCBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybCB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgcG9seWZpbGwgfSBmcm9tIFwiZXM2LXByb21pc2VcIjtcclxuaW1wb3J0IHsgcG9seWZpbGwgYXMgb2JqZWN0UG9seWZpbGwgfSBmcm9tIFwiZXM2LW9iamVjdC1hc3NpZ25cIjtcclxuZXhwb3J0IGNvbnN0IGluaXQgPSAoKSA9PiB7XHJcbiAgICBvYmplY3RQb2x5ZmlsbCgpO1xyXG4gICAgcG9seWZpbGwoKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQ3VycmVudFVzZXIoZ2xvYmFscy5jdXJyZW50VXNlcm5hbWUpKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVXNlcnMoKSk7XHJcbiAgICBtb21lbnQubG9jYWxlKFwiZGFcIik7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFdoYXRzTmV3ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZ2V0TGF0ZXN0ID0gKHNraXAsIHRha2UpID0+IHN0b3JlLmRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSk7XHJcbiAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHN0b3JlLmdldFN0YXRlKCkud2hhdHNOZXdJbmZvO1xyXG4gICAgZ2V0TGF0ZXN0KHNraXAsIHRha2UpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hGb3J1bSA9IChfKSA9PiB7XHJcbiAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZm9ydW1JbmZvLnRpdGxlc0luZm87XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFRocmVhZHMoc2tpcCwgdGFrZSkpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hTaW5nbGVQb3N0ID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoUG9zdChOdW1iZXIoaWQpKSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZWxlY3RJbWFnZSA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IGltYWdlSWQgPSBOdW1iZXIobmV4dFN0YXRlLnBhcmFtcy5pZCk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRTZWxlY3RlZEltZyhpbWFnZUlkKSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaEltYWdlcyA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gbmV4dFN0YXRlLnBhcmFtcy51c2VybmFtZTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldEltYWdlT3duZXIodXNlcm5hbWUpKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goc2V0U2tpcENvbW1lbnRzKHVuZGVmaW5lZCkpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goc2V0VGFrZUNvbW1lbnRzKHVuZGVmaW5lZCkpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgbG9hZENvbW1lbnRzID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIGNvbnN0IHBhZ2UgPSBOdW1iZXIobmV4dFN0YXRlLmxvY2F0aW9uLnF1ZXJ5LnBhZ2UpO1xyXG4gICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNQYWdlVXJsKE51bWJlcihpZCksIHNraXAsIHRha2UpO1xyXG4gICAgaWYgKCFwYWdlKSB7XHJcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHBhZ2UgLSAxO1xyXG4gICAgICAgIGNvbnN0IHNraXBJdGVtcyA9IChza2lwUGFnZXMgKiB0YWtlKTtcclxuICAgICAgICBzdG9yZS5kaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcEl0ZW1zLCB0YWtlKSk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaENvbW1lbnQgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBpZCA9IE51bWJlcihuZXh0U3RhdGUubG9jYXRpb24ucXVlcnkuaWQpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQoaWQpKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoUG9zdENvbW1lbnRzID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcbiAgICBjb25zdCB1cmwgPSBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybChOdW1iZXIoaWQpLCBza2lwLCB0YWtlKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgKiBhcyBSZWFjdERPTSBmcm9tIFwicmVhY3QtZG9tXCI7XHJcbmltcG9ydCBNYWluIGZyb20gXCIuL2NvbXBvbmVudHMvc2hlbGxzL01haW5cIjtcclxuaW1wb3J0IEhvbWUgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL0hvbWVcIjtcclxuaW1wb3J0IEZvcnVtIGZyb20gXCIuL2NvbXBvbmVudHMvc2hlbGxzL0ZvcnVtXCI7XHJcbmltcG9ydCBGb3J1bUxpc3QgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL0ZvcnVtTGlzdFwiO1xyXG5pbXBvcnQgRm9ydW1Qb3N0IGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bVBvc3RcIjtcclxuaW1wb3J0IEZvcnVtQ29tbWVudHMgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL0ZvcnVtQ29tbWVudHNcIjtcclxuaW1wb3J0IFVzZXJzIGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9Vc2Vyc1wiO1xyXG5pbXBvcnQgVXNlckltYWdlcyBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlckltYWdlc1wiO1xyXG5pbXBvcnQgU2VsZWN0ZWRJbWFnZSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvU2VsZWN0ZWRJbWFnZVwiO1xyXG5pbXBvcnQgSW1hZ2VDb21tZW50cyBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvSW1hZ2VDb21tZW50c1wiO1xyXG5pbXBvcnQgU2luZ2xlSW1hZ2VDb21tZW50IGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9TaW5nbGVJbWFnZUNvbW1lbnRcIjtcclxuaW1wb3J0IEFib3V0IGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9BYm91dFwiO1xyXG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vc3RvcmUvc3RvcmVcIjtcclxuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZSwgSW5kZXhSb3V0ZSwgYnJvd3Nlckhpc3RvcnkgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IGluaXQsIGZldGNoRm9ydW0sIHNlbGVjdEltYWdlLCBmZXRjaEltYWdlcywgbG9hZENvbW1lbnRzLCBmZXRjaENvbW1lbnQsIGZldGNoV2hhdHNOZXcsIGZldGNoU2luZ2xlUG9zdCwgZmV0Y2hQb3N0Q29tbWVudHMgfSBmcm9tIFwiLi91dGlsaXRpZXMvb25zdGFydHVwXCI7XHJcbmluaXQoKTtcclxuUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvdmlkZXIsIHsgc3RvcmU6IHN0b3JlIH0sXHJcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlciwgeyBoaXN0b3J5OiBicm93c2VySGlzdG9yeSB9LFxyXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCIvXCIsIGNvbXBvbmVudDogTWFpbiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEluZGV4Um91dGUsIHsgY29tcG9uZW50OiBIb21lLCBvbkVudGVyOiBmZXRjaFdoYXRzTmV3IH0pLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiZm9ydW1cIiwgY29tcG9uZW50OiBGb3J1bSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbmRleFJvdXRlLCB7IGNvbXBvbmVudDogRm9ydW1MaXN0LCBvbkVudGVyOiBmZXRjaEZvcnVtIH0pLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcInBvc3QvOmlkXCIsIGNvbXBvbmVudDogRm9ydW1Qb3N0LCBvbkVudGVyOiBmZXRjaFNpbmdsZVBvc3QgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiY29tbWVudHNcIiwgY29tcG9uZW50OiBGb3J1bUNvbW1lbnRzLCBvbkVudGVyOiBmZXRjaFBvc3RDb21tZW50cyB9KSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwidXNlcnNcIiwgY29tcG9uZW50OiBVc2VycyB9KSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcIjp1c2VybmFtZS9nYWxsZXJ5XCIsIGNvbXBvbmVudDogVXNlckltYWdlcywgb25FbnRlcjogZmV0Y2hJbWFnZXMgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJpbWFnZS86aWRcIiwgY29tcG9uZW50OiBTZWxlY3RlZEltYWdlLCBvbkVudGVyOiBzZWxlY3RJbWFnZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJjb21tZW50c1wiLCBjb21wb25lbnQ6IEltYWdlQ29tbWVudHMsIG9uRW50ZXI6IGxvYWRDb21tZW50cyB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiY29tbWVudFwiLCBjb21wb25lbnQ6IFNpbmdsZUltYWdlQ29tbWVudCwgb25FbnRlcjogZmV0Y2hDb21tZW50IH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJhYm91dFwiLCBjb21wb25lbnQ6IEFib3V0IH0pKSkpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIikpO1xyXG4iXSwibmFtZXMiOlsiUm93IiwiQ29sIiwiQWxlcnQiLCJjb25zdCIsImxldCIsIkxpbmsiLCJJbmRleExpbmsiLCJHcmlkIiwiTmF2YmFyIiwiTmF2IiwiTmF2RHJvcGRvd24iLCJNZW51SXRlbSIsImNvbm5lY3QiLCJub3JtYWxpemVJbWFnZSIsIm5vcm1hbGl6ZUNvbW1lbnQiLCJub3JtYWxpemUiLCJzdXBlciIsIkZvcm1Db250cm9sIiwiQnV0dG9uIiwiR2x5cGhpY29uIiwibWFwU3RhdGVUb1Byb3BzIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiUHJvZ3Jlc3NCYXIiLCJNZWRpYSIsIkltYWdlIiwiVG9vbHRpcCIsIk92ZXJsYXlUcmlnZ2VyIiwidGhpcyIsIk1vZGFsIiwiRm9ybUdyb3VwIiwiQ29udHJvbExhYmVsIiwiQnV0dG9uR3JvdXAiLCJCdXR0b25Ub29sYmFyIiwiQ29sbGFwc2UiLCJzZXRUb3RhbFBhZ2VzIiwic2V0UGFnZSIsInNldFNraXAiLCJzZXRUYWtlIiwiYXJndW1lbnRzIiwiZmluZCIsImNvbnRhaW5zIiwid2l0aFJvdXRlciIsIlBhZ2luYXRpb24iLCJQYWdpbmF0aW9uQnMiLCJKdW1ib3Ryb24iLCJQYW5lbCIsIl9fYXNzaWduIiwidmFsdWVzIiwiUGFnZUhlYWRlciIsIkltYWdlQnMiLCJyb3ciLCJXZWxsIiwiY29tYmluZVJlZHVjZXJzIiwib21pdCIsImlkIiwiaW1hZ2UiLCJyZXN1bHQiLCJmaWx0ZXIiLCJtZXNzYWdlIiwic2tpcCIsInRha2UiLCJwYWdlIiwidG90YWxQYWdlcyIsImNyZWF0ZVN0b3JlIiwiYXBwbHlNaWRkbGV3YXJlIiwib2JqZWN0UG9seWZpbGwiLCJwb2x5ZmlsbCIsIlByb3ZpZGVyIiwiUm91dGVyIiwiYnJvd3Nlckhpc3RvcnkiLCJSb3V0ZSIsIkluZGV4Um91dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU0sS0FBSyxHQUF3QjtJQUFDOzs7Ozs7OztJQUFBLGdCQUN2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