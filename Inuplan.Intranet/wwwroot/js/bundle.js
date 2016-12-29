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
    var name = user ? user.Username : "User";
    return {
        username: name,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29udGFpbmVycy9FcnJvci5qcyIsImFjdGlvbnMvZXJyb3IuanMiLCJjb21wb25lbnRzL3dyYXBwZXJzL0xpbmtzLmpzIiwiY29tcG9uZW50cy9zaGVsbHMvTWFpbi5qcyIsInV0aWxpdGllcy91dGlscy5qcyIsInV0aWxpdGllcy9ub3JtYWxpemUuanMiLCJhY3Rpb25zL3VzZXJzLmpzIiwiYWN0aW9ucy93aGF0c25ldy5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlVXBsb2FkLmpzIiwiYWN0aW9ucy9pbWFnZXMuanMiLCJhY3Rpb25zL3N0YXR1cy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VkU3BhY2UuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlLmpzIiwiY29tcG9uZW50cy93aGF0c25ldy9XaGF0c05ld1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3SXRlbUltYWdlLmpzIiwiY29tcG9uZW50cy93aGF0c25ldy9XaGF0c05ld0l0ZW1Db21tZW50LmpzIiwiY29tcG9uZW50cy93aGF0c25ldy9XaGF0c05ld0ZvcnVtUG9zdC5qcyIsImNvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdMaXN0LmpzIiwiY29tcG9uZW50cy9mb3J1bS9Gb3J1bUZvcm0uanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRDb250cm9scy5qcyIsImFjdGlvbnMvZm9ydW0uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Qb3N0LmpzIiwiY29tcG9uZW50cy9wYWdpbmF0aW9uL1BhZ2luYXRpb24uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvV2hhdHNOZXcuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvSG9tZS5qcyIsImNvbXBvbmVudHMvc2hlbGxzL0ZvcnVtLmpzIiwiY29tcG9uZW50cy9mb3J1bS9Gb3J1bVRpdGxlLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL0ZvcnVtTGlzdC5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudERlbGV0ZWQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRMaXN0LmpzIiwiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50Rm9ybS5qcyIsImFjdGlvbnMvY29tbWVudHMuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Db21tZW50cy5qcyIsImNvbXBvbmVudHMvdXNlcnMvVXNlci5qcyIsImNvbXBvbmVudHMvdXNlcnMvVXNlckxpc3QuanMiLCJjb21wb25lbnRzL2JyZWFkY3J1bWJzL0JyZWFkY3J1bWIuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlcnMuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvSW1hZ2VDb21tZW50cy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9TaW5nbGVJbWFnZUNvbW1lbnQuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJyZWR1Y2Vycy91c2Vyc0luZm8uanMiLCJyZWR1Y2Vycy9pbWFnZXNJbmZvLmpzIiwicmVkdWNlcnMvY29tbWVudHNJbmZvLmpzIiwicmVkdWNlcnMvZm9ydW1JbmZvLmpzIiwicmVkdWNlcnMvZXJyb3JJbmZvLmpzIiwicmVkdWNlcnMvc3RhdHVzSW5mby5qcyIsInJlZHVjZXJzL3doYXRzTmV3SW5mby5qcyIsInJlZHVjZXJzL3Jvb3QuanMiLCJzdG9yZS9zdG9yZS5qcyIsInV0aWxpdGllcy9vbnN0YXJ0dXAuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBBbGVydCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIEVycm9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNsZWFyRXJyb3IsIHRpdGxlLCBtZXNzYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEFsZXJ0LCB7IGJzU3R5bGU6IFwiZGFuZ2VyXCIsIG9uRGlzbWlzczogY2xlYXJFcnJvciB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgdGl0bGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIG1lc3NhZ2UpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjb25zdCBzZXRIYXNFcnJvciA9IChoYXNFcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAwLFxyXG4gICAgICAgIHBheWxvYWQ6IGhhc0Vycm9yXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RXJyb3JUaXRsZSA9ICh0aXRsZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxLFxyXG4gICAgICAgIHBheWxvYWQ6IHRpdGxlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvclRpdGxlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvck1lc3NhZ2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvck1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzLFxyXG4gICAgICAgIHBheWxvYWQ6IG1lc3NhZ2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKHRydWUpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXRFcnJvclRpdGxlKGVycm9yLnRpdGxlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JNZXNzYWdlKGVycm9yLm1lc3NhZ2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9ICgpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChjbGVhckVycm9yVGl0bGUoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvck1lc3NhZ2UoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0SGFzRXJyb3IoZmFsc2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJpbXBvcnQgeyBMaW5rLCBJbmRleExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5leHBvcnQgY2xhc3MgTmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSwgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogdGhpcy5wcm9wcy50byB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKSkpO1xyXG4gICAgfVxyXG59XHJcbk5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn07XHJcbmV4cG9ydCBjbGFzcyBJbmRleE5hdkxpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IHRoaXMuY29udGV4dC5yb3V0ZXIuaXNBY3RpdmUodGhpcy5wcm9wcy50bywgdHJ1ZSksIGNsYXNzTmFtZSA9IGlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEluZGV4TGluaywgeyB0bzogdGhpcy5wcm9wcy50byB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKSkpO1xyXG4gICAgfVxyXG59XHJcbkluZGV4TmF2TGluay5jb250ZXh0VHlwZXMgPSB7XHJcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5vYmplY3RcclxufTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgR3JpZCwgTmF2YmFyLCBOYXYsIE5hdkRyb3Bkb3duLCBNZW51SXRlbSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgRXJyb3IgfSBmcm9tIFwiLi4vY29udGFpbmVycy9FcnJvclwiO1xyXG5pbXBvcnQgeyBjbGVhckVycm9yIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvZXJyb3JcIjtcclxuaW1wb3J0IHsgTmF2TGluaywgSW5kZXhOYXZMaW5rIH0gZnJvbSBcIi4uL3dyYXBwZXJzL0xpbmtzXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZF07XHJcbiAgICBjb25zdCBuYW1lID0gdXNlciA/IHVzZXIuVXNlcm5hbWUgOiBcIlVzZXJcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlcm5hbWU6IG5hbWUsXHJcbiAgICAgICAgaGFzRXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uaGFzRXJyb3IsXHJcbiAgICAgICAgZXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uZXJyb3JJbmZvXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xlYXJFcnJvcjogKCkgPT4gZGlzcGF0Y2goY2xlYXJFcnJvcigpKVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgU2hlbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgZXJyb3JWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgaGFzRXJyb3IsIGNsZWFyRXJyb3IsIGVycm9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUsIG1lc3NhZ2UgfSA9IGVycm9yO1xyXG4gICAgICAgIGlmICghaGFzRXJyb3IpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEVycm9yLCB7IHRpdGxlOiB0aXRsZSwgbWVzc2FnZTogbWVzc2FnZSwgY2xlYXJFcnJvcjogY2xlYXJFcnJvciB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGVtcGxveWVlVXJsID0gZ2xvYmFscy51cmxzLmVtcGxveWVlSGFuZGJvb2s7XHJcbiAgICAgICAgY29uc3QgYzVTZWFyY2hVcmwgPSBnbG9iYWxzLnVybHMuYzVTZWFyY2g7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR3JpZCwgeyBmbHVpZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhciwgeyBmaXhlZFRvcDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZiYXIuSGVhZGVyLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLkJyYW5kLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IFwiaHR0cDovL2ludHJhbmV0c2lkZVwiLCBjbGFzc05hbWU6IFwibmF2YmFyLWJyYW5kXCIgfSwgXCJJbnVwbGFuIEludHJhbmV0XCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhci5Ub2dnbGUsIG51bGwpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLkNvbGxhcHNlLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEluZGV4TmF2TGluaywgeyB0bzogXCIvXCIgfSwgXCJGb3JzaWRlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkxpbmssIHsgdG86IFwiL2ZvcnVtXCIgfSwgXCJGb3J1bVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZMaW5rLCB7IHRvOiBcIi91c2Vyc1wiIH0sIFwiQnJ1Z2VyZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZMaW5rLCB7IHRvOiBcIi9hYm91dFwiIH0sIFwiT21cIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLlRleHQsIHsgcHVsbFJpZ2h0OiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiSGVqLCBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiIVwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdiwgeyBwdWxsUmlnaHQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZEcm9wZG93biwgeyBldmVudEtleTogNSwgdGl0bGU6IFwiTGlua3NcIiwgaWQ6IFwiZXh0ZXJuX2xpbmtzXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHsgaHJlZjogZW1wbG95ZWVVcmwsIGV2ZW50S2V5OiA1LjEgfSwgXCJNZWRhcmJlamRlciBoXFx1MDBFNW5kYm9nXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZW51SXRlbSwgeyBocmVmOiBjNVNlYXJjaFVybCwgZXZlbnRLZXk6IDUuMiB9LCBcIkM1IFNcXHUwMEY4Z25pbmdcIikpKSkpLFxyXG4gICAgICAgICAgICB0aGlzLmVycm9yVmlldygpLFxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBNYWluID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoU2hlbGwpO1xyXG5leHBvcnQgZGVmYXVsdCBNYWluO1xyXG4iLCJpbXBvcnQgeyBzZXRFcnJvciB9IGZyb20gXCIuLi9hY3Rpb25zL2Vycm9yXCI7XHJcbmltcG9ydCAqIGFzIG1hcmtlZCBmcm9tIFwibWFya2VkXCI7XHJcbmltcG9ydCByZW1vdmVNZCBmcm9tIFwicmVtb3ZlLW1hcmtkb3duXCI7XHJcbmV4cG9ydCBjb25zdCBvYmpNYXAgPSAoYXJyLCBrZXksIHZhbCkgPT4ge1xyXG4gICAgY29uc3Qgb2JqID0gYXJyLnJlZHVjZSgocmVzLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc3QgayA9IGtleShpdGVtKTtcclxuICAgICAgICBjb25zdCB2ID0gdmFsKGl0ZW0pO1xyXG4gICAgICAgIHJlc1trXSA9IHY7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH0sIHt9KTtcclxuICAgIHJldHVybiBvYmo7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBwdXQgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBsZXQga3YgPSBPYmplY3QuYXNzaWduKHt9LCBvYmopO1xyXG4gICAga3Zba2V5XSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIGt2O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgIG1vZGU6IFwiY29yc1wiLFxyXG4gICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiXHJcbn07XHJcbmV4cG9ydCBjb25zdCByZXNwb25zZUhhbmRsZXIgPSAoZGlzcGF0Y2gpID0+IChvblN1Y2Nlc3MpID0+IChyZXNwb25zZSkgPT4ge1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKVxyXG4gICAgICAgIHJldHVybiBvblN1Y2Nlc3MocmVzcG9uc2UpO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoIChyZXNwb25zZS5zdGF0dXMpIHtcclxuICAgICAgICAgICAgY2FzZSA0MDA6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcih7IHRpdGxlOiBcIjQwMCBCYWQgUmVxdWVzdFwiLCBtZXNzYWdlOiBcIlRoZSByZXF1ZXN0IHdhcyBub3Qgd2VsbC1mb3JtZWRcIiB9KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0MDQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcih7IHRpdGxlOiBcIjQwNCBOb3QgRm91bmRcIiwgbWVzc2FnZTogXCJDb3VsZCBub3QgZmluZCByZXNvdXJjZVwiIH0pKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwODpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKHsgdGl0bGU6IFwiNDA4IFJlcXVlc3QgVGltZW91dFwiLCBtZXNzYWdlOiBcIlRoZSBzZXJ2ZXIgZGlkIG5vdCByZXNwb25kIGluIHRpbWVcIiB9KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA1MDA6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcih7IHRpdGxlOiBcIjUwMCBTZXJ2ZXIgRXJyb3JcIiwgbWVzc2FnZTogXCJTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHRoZSBBUEktc2VydmVyXCIgfSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcih7IHRpdGxlOiBcIk9vcHNcIiwgbWVzc2FnZTogXCJTb21ldGhpbmcgd2VudCB3cm9uZyFcIiB9KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuZXhwb3J0IGNvbnN0IHVuaW9uID0gKGFycjEsIGFycjIsIGVxdWFsaXR5RnVuYykgPT4ge1xyXG4gICAgbGV0IHJlc3VsdCA9IGFycjEuY29uY2F0KGFycjIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCByZXN1bHQubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGVxdWFsaXR5RnVuYyhyZXN1bHRbaV0sIHJlc3VsdFtqXSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICBqLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5leHBvcnQgY29uc3QgdGltZVRleHQgPSAocG9zdGVkT24sIGV4cGlyZSA9IDEyLjUpID0+IHtcclxuICAgIGNvbnN0IGFnbyA9IG1vbWVudChwb3N0ZWRPbikuZnJvbU5vdygpO1xyXG4gICAgY29uc3QgZGlmZiA9IG1vbWVudCgpLmRpZmYocG9zdGVkT24sIFwiaG91cnNcIiwgdHJ1ZSk7XHJcbiAgICBpZiAoZGlmZiA+PSBleHBpcmUpIHtcclxuICAgICAgICBjb25zdCBkYXRlID0gbW9tZW50KHBvc3RlZE9uKTtcclxuICAgICAgICByZXR1cm4gYGQuICR7ZGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKX0ga2wuICR7ZGF0ZS5mb3JtYXQoXCJIOm1tXCIpfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gXCJmb3IgXCIgKyBhZ287XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmb3JtYXRUZXh0ID0gKHRleHQpID0+IHtcclxuICAgIGlmICghdGV4dClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHJhd01hcmt1cCA9IG1hcmtlZCh0ZXh0LCB7IHNhbml0aXplOiB0cnVlIH0pO1xyXG4gICAgcmV0dXJuIHsgX19odG1sOiByYXdNYXJrdXAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldFdvcmRzID0gKHRleHQsIG51bWJlck9mV29yZHMpID0+IHtcclxuICAgIGlmICghdGV4dClcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIGNvbnN0IHBsYWluVGV4dCA9IHJlbW92ZU1kKHRleHQpO1xyXG4gICAgcmV0dXJuIHBsYWluVGV4dC5zcGxpdCgvXFxzKy8pLnNsaWNlKDAsIG51bWJlck9mV29yZHMpLmpvaW4oXCIgXCIpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0RnVsbE5hbWUgPSAodXNlciwgbm9uZSA9IFwiXCIpID0+IHtcclxuICAgIGlmICghdXNlcilcclxuICAgICAgICByZXR1cm4gbm9uZTtcclxuICAgIHJldHVybiBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWA7XHJcbn07XHJcbmV4cG9ydCBjb25zdCB2aXNpdENvbW1lbnRzID0gKGNvbW1lbnRzLCBmdW5jKSA9PiB7XHJcbiAgICBjb25zdCBnZXRSZXBsaWVzID0gKGMpID0+IGMuUmVwbGllcyA/IGMuUmVwbGllcyA6IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21tZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRlcHRoRmlyc3RTZWFyY2goY29tbWVudHNbaV0sIGdldFJlcGxpZXMsIGZ1bmMpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgZGVwdGhGaXJzdFNlYXJjaCA9IChjdXJyZW50LCBnZXRDaGlsZHJlbiwgZnVuYykgPT4ge1xyXG4gICAgZnVuYyhjdXJyZW50KTtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gZ2V0Q2hpbGRyZW4oY3VycmVudCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjaGlsZHJlbltpXSwgZ2V0Q2hpbGRyZW4sIGZ1bmMpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplQ29tbWVudCA9IChjb21tZW50KSA9PiB7XHJcbiAgICBsZXQgciA9IGNvbW1lbnQuUmVwbGllcyA/IGNvbW1lbnQuUmVwbGllcyA6IFtdO1xyXG4gICAgY29uc3QgcmVwbGllcyA9IHIubWFwKG5vcm1hbGl6ZUNvbW1lbnQpO1xyXG4gICAgY29uc3QgYXV0aG9ySWQgPSAoY29tbWVudC5EZWxldGVkKSA/IC0xIDogY29tbWVudC5BdXRob3IuSUQ7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIENvbW1lbnRJRDogY29tbWVudC5JRCxcclxuICAgICAgICBBdXRob3JJRDogYXV0aG9ySWQsXHJcbiAgICAgICAgRGVsZXRlZDogY29tbWVudC5EZWxldGVkLFxyXG4gICAgICAgIFBvc3RlZE9uOiBjb21tZW50LlBvc3RlZE9uLFxyXG4gICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICBSZXBsaWVzOiByZXBsaWVzLFxyXG4gICAgICAgIEVkaXRlZDogY29tbWVudC5FZGl0ZWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBnZXRGb3J1bUNvbW1lbnRzRGVsZXRlVXJsID0gKGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIGAke2dsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzfT9jb21tZW50SWQ9JHtjb21tZW50SWR9YDtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldEZvcnVtQ29tbWVudHNQYWdlVXJsID0gKHBvc3RJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIGAke2dsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzfT9wb3N0SWQ9JHtwb3N0SWR9JnNraXA9JHtza2lwfSZ0YWtlPSR7dGFrZX1gO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0SW1hZ2VDb21tZW50c1BhZ2VVcmwgPSAoaW1hZ2VJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIGAke2dsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzfT9pbWFnZUlkPSR7aW1hZ2VJZH0mc2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsID0gKGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIGAke2dsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzfT9jb21tZW50SWQ9JHtjb21tZW50SWR9YDtcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUxhdGVzdCA9IChsYXRlc3QpID0+IHtcclxuICAgIGxldCBpdGVtID0gbnVsbDtcclxuICAgIGxldCBhdXRob3JJZCA9IC0xO1xyXG4gICAgaWYgKGxhdGVzdC5UeXBlID09PSAxKSB7XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBsYXRlc3QuSXRlbTtcclxuICAgICAgICBpdGVtID0ge1xyXG4gICAgICAgICAgICBFeHRlbnNpb246IGltYWdlLkV4dGVuc2lvbixcclxuICAgICAgICAgICAgRmlsZW5hbWU6IGltYWdlLkZpbGVuYW1lLFxyXG4gICAgICAgICAgICBJbWFnZUlEOiBpbWFnZS5JbWFnZUlELFxyXG4gICAgICAgICAgICBPcmlnaW5hbFVybDogaW1hZ2UuT3JpZ2luYWxVcmwsXHJcbiAgICAgICAgICAgIFByZXZpZXdVcmw6IGltYWdlLlByZXZpZXdVcmwsXHJcbiAgICAgICAgICAgIFRodW1ibmFpbFVybDogaW1hZ2UuVGh1bWJuYWlsVXJsLFxyXG4gICAgICAgICAgICBVcGxvYWRlZDogaW1hZ2UuVXBsb2FkZWQsXHJcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiBpbWFnZS5EZXNjcmlwdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYXV0aG9ySWQgPSBpbWFnZS5BdXRob3IuSUQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChsYXRlc3QuVHlwZSA9PT0gMikge1xyXG4gICAgICAgIGNvbnN0IGNvbW1lbnQgPSBsYXRlc3QuSXRlbTtcclxuICAgICAgICBpdGVtID0ge1xyXG4gICAgICAgICAgICBJRDogY29tbWVudC5JRCxcclxuICAgICAgICAgICAgVGV4dDogY29tbWVudC5UZXh0LFxyXG4gICAgICAgICAgICBJbWFnZUlEOiBjb21tZW50LkltYWdlSUQsXHJcbiAgICAgICAgICAgIEltYWdlVXBsb2FkZWRCeTogY29tbWVudC5JbWFnZVVwbG9hZGVkQnksXHJcbiAgICAgICAgICAgIEZpbGVuYW1lOiBjb21tZW50LkZpbGVuYW1lXHJcbiAgICAgICAgfTtcclxuICAgICAgICBhdXRob3JJZCA9IGNvbW1lbnQuQXV0aG9yLklEO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobGF0ZXN0LlR5cGUgPT09IDQpIHtcclxuICAgICAgICBjb25zdCBwb3N0ID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgSUQ6IHBvc3QuVGhyZWFkSUQsXHJcbiAgICAgICAgICAgIFRpdGxlOiBwb3N0LkhlYWRlci5UaXRsZSxcclxuICAgICAgICAgICAgVGV4dDogcG9zdC5UZXh0LFxyXG4gICAgICAgICAgICBTdGlja3k6IHBvc3QuSGVhZGVyLlN0aWNreSxcclxuICAgICAgICAgICAgQ29tbWVudENvdW50OiBwb3N0LkhlYWRlci5Db21tZW50Q291bnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGF1dGhvcklkID0gcG9zdC5IZWFkZXIuQXV0aG9yLklEO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBJRDogbGF0ZXN0LklELFxyXG4gICAgICAgIFR5cGU6IGxhdGVzdC5UeXBlLFxyXG4gICAgICAgIEl0ZW06IGl0ZW0sXHJcbiAgICAgICAgT246IGxhdGVzdC5PbixcclxuICAgICAgICBBdXRob3JJRDogYXV0aG9ySWQsXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplSW1hZ2UgPSAoaW1nKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIEltYWdlSUQ6IGltZy5JbWFnZUlELFxyXG4gICAgICAgIEZpbGVuYW1lOiBpbWcuRmlsZW5hbWUsXHJcbiAgICAgICAgRXh0ZW5zaW9uOiBpbWcuRXh0ZW5zaW9uLFxyXG4gICAgICAgIE9yaWdpbmFsVXJsOiBpbWcuT3JpZ2luYWxVcmwsXHJcbiAgICAgICAgUHJldmlld1VybDogaW1nLlByZXZpZXdVcmwsXHJcbiAgICAgICAgVGh1bWJuYWlsVXJsOiBpbWcuVGh1bWJuYWlsVXJsLFxyXG4gICAgICAgIENvbW1lbnRDb3VudDogaW1nLkNvbW1lbnRDb3VudCxcclxuICAgICAgICBVcGxvYWRlZDogbmV3IERhdGUoaW1nLlVwbG9hZGVkKSxcclxuICAgICAgICBEZXNjcmlwdGlvbjogaW1nLkRlc2NyaXB0aW9uXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplVGhyZWFkVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIGNvbnN0IHZpZXdlZEJ5ID0gdGl0bGUuVmlld2VkQnkubWFwKHVzZXIgPT4gdXNlci5JRCk7XHJcbiAgICBjb25zdCBsYXRlc3RDb21tZW50ID0gdGl0bGUuTGF0ZXN0Q29tbWVudCA/IG5vcm1hbGl6ZUNvbW1lbnQodGl0bGUuTGF0ZXN0Q29tbWVudCkgOiBudWxsO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBJRDogdGl0bGUuSUQsXHJcbiAgICAgICAgSXNQdWJsaXNoZWQ6IHRpdGxlLklzUHVibGlzaGVkLFxyXG4gICAgICAgIFN0aWNreTogdGl0bGUuU3RpY2t5LFxyXG4gICAgICAgIENyZWF0ZWRPbjogdGl0bGUuQ3JlYXRlZE9uLFxyXG4gICAgICAgIEF1dGhvcklEOiB0aXRsZS5BdXRob3IuSUQsXHJcbiAgICAgICAgRGVsZXRlZDogdGl0bGUuRGVsZXRlZCxcclxuICAgICAgICBJc01vZGlmaWVkOiB0aXRsZS5Jc01vZGlmaWVkLFxyXG4gICAgICAgIFRpdGxlOiB0aXRsZS5UaXRsZSxcclxuICAgICAgICBMYXN0TW9kaWZpZWQ6IHRpdGxlLkxhc3RNb2RpZmllZCxcclxuICAgICAgICBMYXRlc3RDb21tZW50OiBsYXRlc3RDb21tZW50LFxyXG4gICAgICAgIENvbW1lbnRDb3VudDogdGl0bGUuQ29tbWVudENvdW50LFxyXG4gICAgICAgIFZpZXdlZEJ5OiB2aWV3ZWRCeSxcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVDb21tZW50ID0gKGNvbW1lbnQpID0+IHtcclxuICAgIGxldCByID0gY29tbWVudC5SZXBsaWVzID8gY29tbWVudC5SZXBsaWVzIDogW107XHJcbiAgICBjb25zdCByZXBsaWVzID0gci5tYXAobm9ybWFsaXplQ29tbWVudCk7XHJcbiAgICBjb25zdCBhdXRob3JJZCA9IChjb21tZW50LkRlbGV0ZWQpID8gLTEgOiBjb21tZW50LkF1dGhvci5JRDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgQ29tbWVudElEOiBjb21tZW50LklELFxyXG4gICAgICAgIEF1dGhvcklEOiBhdXRob3JJZCxcclxuICAgICAgICBEZWxldGVkOiBjb21tZW50LkRlbGV0ZWQsXHJcbiAgICAgICAgUG9zdGVkT246IGNvbW1lbnQuUG9zdGVkT24sXHJcbiAgICAgICAgVGV4dDogY29tbWVudC5UZXh0LFxyXG4gICAgICAgIFJlcGxpZXM6IHJlcGxpZXMsXHJcbiAgICAgICAgRWRpdGVkOiBjb21tZW50LkVkaXRlZFxyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0ICogYXMgZmV0Y2ggZnJvbSBcImlzb21vcnBoaWMtZmV0Y2hcIjtcclxuaW1wb3J0IHsgb3B0aW9ucywgb2JqTWFwLCByZXNwb25zZUhhbmRsZXIgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmV4cG9ydCBjb25zdCBhZGRVc2VyID0gKHVzZXIpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjEsXHJcbiAgICAgICAgcGF5bG9hZDogdXNlclxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEN1cnJlbnRVc2VySWQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjAsXHJcbiAgICAgICAgcGF5bG9hZDogaWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCByZWNpZXZlZFVzZXJzID0gKHVzZXJzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDIyLFxyXG4gICAgICAgIHBheWxvYWQ6IHVzZXJzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hDdXJyZW50VXNlciA9ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHtnbG9iYWxzLnVybHMudXNlcnN9P3VzZXJuYW1lPSR7dXNlcm5hbWV9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbih1c2VyID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0Q3VycmVudFVzZXJJZCh1c2VyLklEKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIodXNlcikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoVXNlciA9ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHtnbG9iYWxzLnVybHMudXNlcnN9P3VzZXJuYW1lPSR7dXNlcm5hbWV9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbih1c2VyID0+IHsgZGlzcGF0Y2goYWRkVXNlcih1c2VyKSk7IH0pO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoVXNlcnMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGdsb2JhbHMudXJscy51c2Vycywgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlcnMgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBnZXRLZXkgPSAodXNlcikgPT4gdXNlci5JRDtcclxuICAgICAgICAgICAgY29uc3QgZ2V0VmFsdWUgPSAodXNlcikgPT4gdXNlcjtcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gb2JqTWFwKHVzZXJzLCBnZXRLZXksIGdldFZhbHVlKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVjaWV2ZWRVc2VycyhvYmopKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbiIsImltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb3B0aW9ucyB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgbm9ybWFsaXplTGF0ZXN0IGFzIG5vcm1hbGl6ZSB9IGZyb20gXCIuLi91dGlsaXRpZXMvbm9ybWFsaXplXCI7XHJcbmltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tIFwiLi4vYWN0aW9ucy91c2Vyc1wiO1xyXG5leHBvcnQgY29uc3Qgc2V0TGF0ZXN0ID0gKGxhdGVzdCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA1LFxyXG4gICAgICAgIHBheWxvYWQ6IGxhdGVzdFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFNraXAgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA2LFxyXG4gICAgICAgIHBheWxvYWQ6IHNraXBcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRUYWtlID0gKHRha2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNyxcclxuICAgICAgICBwYXlsb2FkOiB0YWtlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0UGFnZSA9IChwYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDgsXHJcbiAgICAgICAgcGF5bG9hZDogcGFnZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRvdGFsUGFnZXMgPSAodG90YWxQYWdlcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA5LFxyXG4gICAgICAgIHBheWxvYWQ6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaExhdGVzdE5ld3MgPSAoc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy53aGF0c25ld30/c2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4ocGFnZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gcGFnZS5DdXJyZW50SXRlbXM7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRBdXRob3IoaXRlbS5UeXBlLCBpdGVtLkl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGF1dGhvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIoYXV0aG9yKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwKHNraXApKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZSh0YWtlKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFBhZ2UocGFnZS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFBhZ2VzKHBhZ2UuVG90YWxQYWdlcykpO1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gaXRlbXMubWFwKG5vcm1hbGl6ZSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldExhdGVzdChub3JtYWxpemVkKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBnZXRBdXRob3IgPSAodHlwZSwgaXRlbSkgPT4ge1xyXG4gICAgbGV0IGF1dGhvciA9IG51bGw7XHJcbiAgICBpZiAodHlwZSA9PT0gNCkge1xyXG4gICAgICAgIGF1dGhvciA9IGl0ZW0uSGVhZGVyLkF1dGhvcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGF1dGhvciA9IGl0ZW0uQXV0aG9yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF1dGhvcjtcclxufTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEJ1dHRvbiwgR2x5cGhpY29uLCBGb3JtQ29udHJvbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGhhc0ZpbGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc2V0SGFzRmlsZSA9IHRoaXMuc2V0SGFzRmlsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRGVzY3JpcHRpb25DaGFuZ2UgPSB0aGlzLmhhbmRsZURlc2NyaXB0aW9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZEZpbGVzID0gdGhpcy5yZW1vdmVTZWxlY3RlZEZpbGVzLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy51cGxvYWRCdXR0b25WaWV3ID0gdGhpcy51cGxvYWRCdXR0b25WaWV3LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbGVhcklucHV0ID0gdGhpcy5jbGVhcklucHV0LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjbGVhcklucHV0KGZpbGVJbnB1dCkge1xyXG4gICAgICAgIGlmIChmaWxlSW5wdXQudmFsdWUpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikgeyB9XHJcbiAgICAgICAgICAgIGlmIChmaWxlSW5wdXQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksIHBhcmVudE5vZGUgPSBmaWxlSW5wdXQucGFyZW50Tm9kZSwgcmVmID0gZmlsZUlucHV0Lm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChmaWxlSW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZmlsZUlucHV0LCByZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBoYXNGaWxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldEZpbGVzKCkge1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICByZXR1cm4gKGZpbGVzID8gZmlsZXMuZmlsZXMgOiBbXSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVTdWJtaXQoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBsb2FkSW1hZ2UsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZmlsZUlucHV0LmZpbGVzO1xyXG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBmaWxlc1tpXTtcclxuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZmlsZVwiLCBmaWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXBsb2FkSW1hZ2UodXNlcm5hbWUsIHRoaXMuc3RhdGUuZGVzY3JpcHRpb24sIGZvcm1EYXRhKTtcclxuICAgICAgICB0aGlzLmNsZWFySW5wdXQoZmlsZUlucHV0KTtcclxuICAgIH1cclxuICAgIHNldEhhc0ZpbGUoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICBjb25zdCBmaWxlcyA9IGZpbGVJbnB1dC5maWxlcztcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBmaWxlcy5sZW5ndGggPiAwO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBoYXNGaWxlOiByZXN1bHQsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVEZXNjcmlwdGlvbkNoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlLnRhcmdldC52YWx1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlU2VsZWN0ZWRGaWxlcygpIHtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJJbnB1dChmaWxlSW5wdXQpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBoYXNGaWxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHNob3dEZXNjcmlwdGlvbigpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaGFzRmlsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUNvbnRyb2wsIHsgaWQ6IFwiZGVzY3JpcHRpb25cIiwgdHlwZTogXCJ0ZXh0XCIsIHZhbHVlOiB0aGlzLnN0YXRlLmRlc2NyaXB0aW9uLCBwbGFjZWhvbGRlcjogXCJCZXNrcml2IGJpbGxlZGV0Li4uXCIsIHJvd3M6IDUwLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVEZXNjcmlwdGlvbkNoYW5nZSB9KSxcclxuICAgICAgICAgICAgXCJcXHUwMEEwXCIsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwid2FybmluZ1wiLCBvbkNsaWNrOiB0aGlzLnJlbW92ZVNlbGVjdGVkRmlsZXMgfSwgXCIgRm9ydHJ5ZFwiKSk7XHJcbiAgICB9XHJcbiAgICB1cGxvYWRCdXR0b25WaWV3KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5oYXNGaWxlKVxyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIGRpc2FibGVkOiB0cnVlLCB0eXBlOiBcInN1Ym1pdFwiIH0sIFwiIFVwbG9hZFwiKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIHR5cGU6IFwic3VibWl0XCIgfSwgXCJVcGxvYWRcIik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIHsgb25TdWJtaXQ6IHRoaXMuaGFuZGxlU3VibWl0LCBpZDogXCJmb3JtLXVwbG9hZFwiLCBjbGFzc05hbWU6IFwiZm9ybS1pbmxpbmVcIiwgZW5jVHlwZTogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJmb3JtLWdyb3VwXCIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7IGh0bWxGb3I6IFwiZmlsZXNcIiwgY2xhc3NOYW1lOiBcImhpZGUtaW5wdXRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcImNhbWVyYVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIFZcXHUwMEU2bGcgZmlsZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwgeyB0eXBlOiBcImZpbGVcIiwgaWQ6IFwiZmlsZXNcIiwgbmFtZTogXCJmaWxlc1wiLCBvbkNoYW5nZTogdGhpcy5zZXRIYXNGaWxlLCBtdWx0aXBsZTogdHJ1ZSB9KSksXHJcbiAgICAgICAgICAgICAgICBcIlxcdTAwQTAgXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dEZXNjcmlwdGlvbigpLFxyXG4gICAgICAgICAgICAgICAgXCIgXFx1MDBBMFwiLFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGxvYWRCdXR0b25WaWV3KCkpLFxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBmZXRjaCBmcm9tIFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSBcIi4vdXNlcnNcIjtcclxuaW1wb3J0IHsgb2JqTWFwLCByZXNwb25zZUhhbmRsZXIsIG9wdGlvbnMgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IG5vcm1hbGl6ZUltYWdlIGFzIG5vcm1hbGl6ZSB9IGZyb20gXCIuLi91dGlsaXRpZXMvbm9ybWFsaXplXCI7XHJcbmV4cG9ydCBjb25zdCBzZXRJbWFnZXNPd25lciA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxMCxcclxuICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHJlY2lldmVkVXNlckltYWdlcyA9IChpbWFnZXMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTEsXHJcbiAgICAgICAgcGF5bG9hZDogaW1hZ2VzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0U2VsZWN0ZWRJbWcgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTIsXHJcbiAgICAgICAgcGF5bG9hZDogaWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBhZGRJbWFnZSA9IChpbWcpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTMsXHJcbiAgICAgICAgcGF5bG9hZDogaW1nXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgcmVtb3ZlSW1hZ2UgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTQsXHJcbiAgICAgICAgcGF5bG9hZDogeyBJbWFnZUlEOiBpZCB9XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgYWRkU2VsZWN0ZWRJbWFnZUlkID0gKGlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDE1LFxyXG4gICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkID0gKGlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDE2LFxyXG4gICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgY2xlYXJTZWxlY3RlZEltYWdlSWRzID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxNyxcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBpbmNyZW1lbnRDb21tZW50Q291bnQgPSAoaW1hZ2VJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxOCxcclxuICAgICAgICBwYXlsb2FkOiB7IEltYWdlSUQ6IGltYWdlSWQgfVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGRlY3JlbWVudENvbW1lbnRDb3VudCA9IChpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDE5LFxyXG4gICAgICAgIHBheWxvYWQ6IHsgSW1hZ2VJRDogaW1hZ2VJZCB9XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgbmV3SW1hZ2VGcm9tU2VydmVyID0gKGltYWdlKSA9PiB7XHJcbiAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKGltYWdlKTtcclxuICAgIHJldHVybiBhZGRJbWFnZShub3JtYWxpemVkKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUltYWdlID0gKGlkLCB1c2VybmFtZSkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5pbWFnZXN9P3VzZXJuYW1lPSR7dXNlcm5hbWV9JmlkPSR7aWR9YDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKChyKSA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHsgZGlzcGF0Y2gocmVtb3ZlSW1hZ2UoaWQpKTsgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IGNvbnNvbGUubG9nKHJlYXNvbikpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgdXBsb2FkSW1hZ2UgPSAodXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSwgb25TdWNjZXNzLCBvbkVycm9yKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlc30/dXNlcm5hbWU9JHt1c2VybmFtZX0mZGVzY3JpcHRpb249JHtkZXNjcmlwdGlvbn1gO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgYm9keTogZm9ybURhdGFcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4ob25TdWNjZXNzLCBvbkVycm9yKTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFVzZXJJbWFnZXMgPSAodXNlcm5hbWUpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuaW1hZ2VzfT91c2VybmFtZT0ke3VzZXJuYW1lfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGRhdGEubWFwKG5vcm1hbGl6ZSkucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBvYmogPSBvYmpNYXAobm9ybWFsaXplZCwgKGltZykgPT4gaW1nLkltYWdlSUQsIChpbWcpID0+IGltZyk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2lldmVkVXNlckltYWdlcyhvYmopKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBkZWxldGVJbWFnZXMgPSAodXNlcm5hbWUsIGltYWdlSWRzID0gW10pID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCBpZHMgPSBpbWFnZUlkcy5qb2luKFwiLFwiKTtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuaW1hZ2VzfT91c2VybmFtZT0ke3VzZXJuYW1lfSZpZHM9JHtpZHN9YDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKF8gPT4gbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7IGRpc3BhdGNoKGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpKTsgfSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4geyBkaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTsgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0SW1hZ2VPd25lciA9ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBjb25zdCBmaW5kT3duZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJzID0gZ2V0U3RhdGUoKS51c2Vyc0luZm8udXNlcnM7XHJcbiAgICAgICAgICAgIGxldCB1c2VyID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHVzZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB1c2VyID0gdXNlcnNba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh1c2VyLlVzZXJuYW1lID0gdXNlcm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdXNlcjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBvd25lciA9IGZpbmRPd25lcigpO1xyXG4gICAgICAgIGlmIChvd25lcikge1xyXG4gICAgICAgICAgICBjb25zdCBvd25lcklkID0gb3duZXIuSUQ7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEltYWdlc093bmVyKG93bmVySWQpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLnVzZXJzfT91c2VybmFtZT0ke3VzZXJuYW1lfWA7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKHVzZXIgPT4geyBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKTsgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG93bmVyID0gZmluZE93bmVyKCk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lci5JRCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hTaW5nbGVJbWFnZSA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5pbWFnZXN9L2dldGJ5aWQ/aWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XHJcbiAgICAgICAgICAgIGlmICghaW1nKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkSW1hZ2UgPSBub3JtYWxpemUoaW1nKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goYWRkSW1hZ2Uobm9ybWFsaXplZEltYWdlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJpbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9wdGlvbnMgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmV4cG9ydCBjb25zdCBzZXRVc2VkU3BhY2VrQiA9ICh1c2VkU3BhY2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzIsXHJcbiAgICAgICAgcGF5bG9hZDogdXNlZFNwYWNlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VG90YWxTcGFjZWtCID0gKHRvdGFsU3BhY2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzMsXHJcbiAgICAgICAgcGF5bG9hZDogdG90YWxTcGFjZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoU3BhY2VJbmZvID0gKHVybCkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VkU3BhY2UgPSBkYXRhLlVzZWRTcGFjZUtCO1xyXG4gICAgICAgICAgICBjb25zdCB0b3RhbFNwYWNlID0gZGF0YS5TcGFjZVF1b3RhS0I7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFVzZWRTcGFjZWtCKHVzZWRTcGFjZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFNwYWNla0IodG90YWxTcGFjZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIFByb2dyZXNzQmFyIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBmZXRjaFNwYWNlSW5mbyB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL3N0YXR1c1wiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlZE1COiAoc3RhdGUuc3RhdHVzSW5mby5zcGFjZUluZm8udXNlZFNwYWNla0IgLyAxMDAwKSxcclxuICAgICAgICB0b3RhbE1COiAoc3RhdGUuc3RhdHVzSW5mby5zcGFjZUluZm8udG90YWxTcGFjZWtCIC8gMTAwMCksXHJcbiAgICAgICAgbG9hZGVkOiAoc3RhdGUuc3RhdHVzSW5mby5zcGFjZUluZm8udG90YWxTcGFjZWtCICE9PSAtMSlcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRTcGFjZUluZm86ICh1cmwpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hTcGFjZUluZm8odXJsKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgVXNlZFNwYWNlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGdldFNwYWNlSW5mbyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZGlhZ25vc3RpY3N9L2dldHNwYWNlaW5mb2A7XHJcbiAgICAgICAgZ2V0U3BhY2VJbmZvKHVybCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VkTUIsIHRvdGFsTUIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSBNYXRoLnJvdW5kKHRvdGFsTUIpO1xyXG4gICAgICAgIGNvbnN0IHVzZWQgPSBNYXRoLnJvdW5kKHVzZWRNQiAqIDEwMCkgLyAxMDA7XHJcbiAgICAgICAgY29uc3QgZnJlZSA9IE1hdGgucm91bmQoKHRvdGFsIC0gdXNlZCkgKiAxMDApIC8gMTAwO1xyXG4gICAgICAgIGNvbnN0IHVzZWRQZXJjZW50ID0gKCh1c2VkIC8gdG90YWwpICogMTAwKTtcclxuICAgICAgICBjb25zdCBwZXJjZW50Um91bmQgPSBNYXRoLnJvdW5kKHVzZWRQZXJjZW50ICogMTAwKSAvIDEwMDtcclxuICAgICAgICBjb25zdCBzaG93ID0gQm9vbGVhbih1c2VkUGVyY2VudCkgJiYgQm9vbGVhbih1c2VkKSAmJiBCb29sZWFuKGZyZWUpICYmIEJvb2xlYW4odG90YWwpO1xyXG4gICAgICAgIGlmICghc2hvdylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvZ3Jlc3NCYXIsIHsgc3RyaXBlZDogdHJ1ZSwgYnNTdHlsZTogXCJzdWNjZXNzXCIsIG5vdzogdXNlZFBlcmNlbnQsIGtleTogMSB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJCcnVndDogXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlZC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIE1CIChcIixcclxuICAgICAgICAgICAgICAgICAgICBwZXJjZW50Um91bmQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBcIiAlKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICBcIkZyaSBwbGFkczogXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJlZS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIE1CXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVG90YWw6IFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgTUJcIikpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBVc2VkU3BhY2UgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2VkU3BhY2VWaWV3KTtcclxuZXhwb3J0IGRlZmF1bHQgVXNlZFNwYWNlO1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgSW1hZ2UsIE1lZGlhIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgQ29tbWVudFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxlZnQsIHsgY2xhc3NOYW1lOiBcImNvbW1lbnQtcHJvZmlsZVwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2UsIHsgc3JjOiBcIi9pbWFnZXMvcGVyc29uX2ljb24uc3ZnXCIsIHN0eWxlOiB7IHdpZHRoOiBcIjY0cHhcIiwgaGVpZ2h0OiBcIjY0cHhcIiB9LCBjbGFzc05hbWU6IFwibWVkaWEtb2JqZWN0XCIgfSksXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBPdmVybGF5VHJpZ2dlciwgVG9vbHRpcCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3VG9vbHRpcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICB0b29sdGlwVmlldyh0aXApIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IGlkOiBcInRvb2x0aXBcIiB9LCB0aXApO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG9vbHRpcCwgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3ZlcmxheVRyaWdnZXIsIHsgcGxhY2VtZW50OiBcImxlZnRcIiwgb3ZlcmxheTogdGhpcy50b29sdGlwVmlldyh0b29sdGlwKSB9LCBjaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlXCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3VG9vbHRpcCB9IGZyb20gXCIuL1doYXRzTmV3VG9vbHRpcFwiO1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgdGltZVRleHQgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IEltYWdlLCBHbHlwaGljb24sIFRvb2x0aXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1JbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICB3aGVuKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFwidXBsb2FkZWRlIFwiICsgdGltZVRleHQob24pO1xyXG4gICAgfVxyXG4gICAgb3ZlcmxheSgpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IGlkOiBcInRvb2x0aXBfaW1nXCIgfSwgXCJCcnVnZXIgYmlsbGVkZVwiKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIGF1dGhvciwgZmlsZW5hbWUsIGV4dGVuc2lvbiwgdGh1bWJuYWlsLCBkZXNjcmlwdGlvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGF1dGhvci5Vc2VybmFtZTtcclxuICAgICAgICBjb25zdCBmaWxlID0gYCR7ZmlsZW5hbWV9LiR7ZXh0ZW5zaW9ufWA7XHJcbiAgICAgICAgY29uc3QgbGluayA9IGAke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2VJZH1gO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHthdXRob3IuRmlyc3ROYW1lfSAke2F1dGhvci5MYXN0TmFtZX1gO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFdoYXRzTmV3VG9vbHRpcCwgeyB0b29sdGlwOiBcIlVwbG9hZGV0IGJpbGxlZGVcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3RJdGVtLCB7IGNsYXNzTmFtZTogXCJ3aGF0c25ld0l0ZW0gaG92ZXItc2hhZG93XCIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudFByb2ZpbGUsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5Cb2R5LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJibG9ja3F1b3RlXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcImltYWdlLXdoYXRzbmV3LWRlc2NyaXB0aW9udGV4dFwiIH0sIGRlc2NyaXB0aW9uKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IGxpbmsgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2UsIHsgc3JjOiB0aHVtYm5haWwsIHRodW1ibmFpbDogdHJ1ZSB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2hlbigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicGljdHVyZVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlKSkpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlXCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3VG9vbHRpcCB9IGZyb20gXCIuL1doYXRzTmV3VG9vbHRpcFwiO1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCBnZXRXb3JkcywgdGltZVRleHQgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IE1lZGlhLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1Db21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNyZWF0ZVN1bW1hcnkoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBmb3JtYXRUZXh0KGdldFdvcmRzKHRleHQsIDUpICsgXCIuLi5cIik7XHJcbiAgICB9XHJcbiAgICBmdWxsbmFtZSgpIHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gYXV0aG9yID8gYXV0aG9yLkZpcnN0TmFtZSArIFwiIFwiICsgYXV0aG9yLkxhc3ROYW1lIDogXCJVc2VyXCI7XHJcbiAgICB9XHJcbiAgICB3aGVuKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFwic2FnZGUgXCIgKyB0aW1lVGV4dChvbik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCB1cGxvYWRlZEJ5LCBjb21tZW50SWQsIGZpbGVuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gdXBsb2FkZWRCeS5Vc2VybmFtZTtcclxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5mdWxsbmFtZSgpO1xyXG4gICAgICAgIGNvbnN0IHN1bW1hcnkgPSB0aGlzLmNyZWF0ZVN1bW1hcnkoKTtcclxuICAgICAgICBjb25zdCBsaW5rID0gYCR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZUlkfS9jb21tZW50P2lkPSR7Y29tbWVudElkfWA7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdUb29sdGlwLCB7IHRvb2x0aXA6IFwiS29tbWVudGFyXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MaXN0SXRlbSwgeyBjbGFzc05hbWU6IFwid2hhdHNuZXdJdGVtIGhvdmVyLXNoYWRvd1wiIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRQcm9maWxlLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYmxvY2txdW90ZVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IGxpbmsgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJlbVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHN1bW1hcnkgfSkpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvb3RlclwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aGVuKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJjb21tZW50XCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lKSkpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3VG9vbHRpcCB9IGZyb20gXCIuL1doYXRzTmV3VG9vbHRpcFwiO1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50UHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBnZXRXb3JkcywgdGltZVRleHQgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IE1lZGlhLCBHbHlwaGljb24sIFRvb2x0aXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0ZvcnVtUG9zdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnNob3dNb2RhbCA9IHRoaXMuc2hvd01vZGFsLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBmdWxsbmFtZSgpIHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gYXV0aG9yLkZpcnN0TmFtZSArIFwiIFwiICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgfVxyXG4gICAgd2hlbigpIHtcclxuICAgICAgICBjb25zdCB7IG9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBcImluZGzDpmcgXCIgKyB0aW1lVGV4dChvbik7XHJcbiAgICB9XHJcbiAgICBzdW1tYXJ5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gZ2V0V29yZHModGV4dCwgNSk7XHJcbiAgICB9XHJcbiAgICBvdmVybGF5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudENvdW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFRvb2x0aXAsIHsgaWQ6IFwidG9vbHRpcF9wb3N0XCIgfSxcclxuICAgICAgICAgICAgXCJGb3J1bSBpbmRsXFx1MDBFNmcsIGFudGFsIGtvbW1lbnRhcmVyOiBcIixcclxuICAgICAgICAgICAgY29tbWVudENvdW50KTtcclxuICAgIH1cclxuICAgIHNob3dNb2RhbChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgeyBwcmV2aWV3LCBpbmRleCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwcmV2aWV3KGluZGV4KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmZ1bGxuYW1lKCk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdUb29sdGlwLCB7IHRvb2x0aXA6IFwiRm9ydW0gaW5kbMOmZ1wiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuTGlzdEl0ZW0sIHsgY2xhc3NOYW1lOiBcIndoYXRzbmV3SXRlbSBob3Zlci1zaGFkb3dcIiB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50UHJvZmlsZSwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJsb2NrcXVvdGVcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwgeyBocmVmOiBcIiNcIiwgb25DbGljazogdGhpcy5zaG93TW9kYWwgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3VtbWFyeSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIuLi5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2hlbigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwibGlzdC1hbHRcIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUpKSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgV2hhdHNOZXdJdGVtSW1hZ2UgfSBmcm9tIFwiLi9XaGF0c05ld0l0ZW1JbWFnZVwiO1xyXG5pbXBvcnQgeyBXaGF0c05ld0l0ZW1Db21tZW50IH0gZnJvbSBcIi4vV2hhdHNOZXdJdGVtQ29tbWVudFwiO1xyXG5pbXBvcnQgeyBXaGF0c05ld0ZvcnVtUG9zdCB9IGZyb20gXCIuL1doYXRzTmV3Rm9ydW1Qb3N0XCI7XHJcbmltcG9ydCB7IE1lZGlhIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucHJldmlld1Bvc3RIYW5kbGUgPSB0aGlzLnByZXZpZXdQb3N0SGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcmV2aWV3UG9zdEhhbmRsZShpbmRleCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIHByZXZpZXcgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2luZGV4XTtcclxuICAgICAgICBwcmV2aWV3KGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0SXRlbXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBnZW5lcmF0ZUtleSA9IChpZCkgPT4gXCJ3aGF0c25ld19cIiArIGlkO1xyXG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1LZXkgPSBnZW5lcmF0ZUtleShpdGVtLklEKTtcclxuICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gZ2V0VXNlcihpdGVtLkF1dGhvcklEKTtcclxuICAgICAgICAgICAgc3dpdGNoIChpdGVtLlR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlID0gaXRlbS5JdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChXaGF0c05ld0l0ZW1JbWFnZSwgeyBvbjogaXRlbS5PbiwgaW1hZ2VJZDogaW1hZ2UuSW1hZ2VJRCwgZmlsZW5hbWU6IGltYWdlLkZpbGVuYW1lLCBleHRlbnNpb246IGltYWdlLkV4dGVuc2lvbiwgdGh1bWJuYWlsOiBpbWFnZS5UaHVtYm5haWxVcmwsIGF1dGhvcjogYXV0aG9yLCBkZXNjcmlwdGlvbjogaW1hZ2UuRGVzY3JpcHRpb24sIGtleTogaXRlbUtleSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21tZW50ID0gaXRlbS5JdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChXaGF0c05ld0l0ZW1Db21tZW50LCB7IGNvbW1lbnRJZDogY29tbWVudC5JRCwgdGV4dDogY29tbWVudC5UZXh0LCB1cGxvYWRlZEJ5OiBjb21tZW50LkltYWdlVXBsb2FkZWRCeSwgaW1hZ2VJZDogY29tbWVudC5JbWFnZUlELCBmaWxlbmFtZTogY29tbWVudC5GaWxlbmFtZSwgb246IGl0ZW0uT24sIGF1dGhvcjogYXV0aG9yLCBrZXk6IGl0ZW1LZXkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zdCA9IGl0ZW0uSXRlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdGb3J1bVBvc3QsIHsgb246IGl0ZW0uT24sIGF1dGhvcjogYXV0aG9yLCB0aXRsZTogcG9zdC5UaXRsZSwgdGV4dDogcG9zdC5UZXh0LCBzdGlja3k6IHBvc3QuU3RpY2t5LCBjb21tZW50Q291bnQ6IHBvc3QuQ29tbWVudENvdW50LCBwcmV2aWV3OiB0aGlzLnByZXZpZXdQb3N0SGFuZGxlLCBpbmRleDogaW5kZXgsIGtleTogaXRlbUtleSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbU5vZGVzID0gdGhpcy5jb25zdHJ1Y3RJdGVtcygpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3QsIG51bGwsIGl0ZW1Ob2Rlcyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEZvcm1Hcm91cCwgQ29udHJvbExhYmVsLCBGb3JtQ29udHJvbCwgQnV0dG9uLCBSb3csIENvbCwgTW9kYWwsIEJ1dHRvbkdyb3VwLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBGb3J1bUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgVGl0bGU6IFwiXCIsXHJcbiAgICAgICAgICAgIFRleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgIFN0aWNreTogZmFsc2UsXHJcbiAgICAgICAgICAgIElzUHVibGlzaGVkOiB0cnVlLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXQgfSA9IG5leHRQcm9wcztcclxuICAgICAgICBpZiAoZWRpdCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBlZGl0LlRpdGxlLFxyXG4gICAgICAgICAgICAgICAgVGV4dDogZWRpdC5UZXh0LFxyXG4gICAgICAgICAgICAgICAgU3RpY2t5OiBlZGl0LlN0aWNreSxcclxuICAgICAgICAgICAgICAgIElzUHVibGlzaGVkOiBlZGl0LklzUHVibGlzaGVkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGhhbmRsZVRpdGxlQ2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGl0bGU6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0VmFsaWRhdGlvbigpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnN0YXRlLlRpdGxlLmxlbmd0aDtcclxuICAgICAgICBpZiAobGVuZ3RoID49IDAgJiYgbGVuZ3RoIDwgMjAwKVxyXG4gICAgICAgICAgICByZXR1cm4gXCJzdWNjZXNzXCI7XHJcbiAgICAgICAgaWYgKGxlbmd0aCA+PSAyMDAgJiYgbGVuZ3RoIDw9IDI1MClcclxuICAgICAgICAgICAgcmV0dXJuIFwid2FybmluZ1wiO1xyXG4gICAgICAgIHJldHVybiBcImVycm9yXCI7XHJcbiAgICB9XHJcbiAgICB0cmFuc2Zvcm1Ub0RUTyhzdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IHtcclxuICAgICAgICAgICAgSXNQdWJsaXNoZWQ6IHN0YXRlLklzUHVibGlzaGVkLFxyXG4gICAgICAgICAgICBTdGlja3k6IHN0YXRlLlN0aWNreSxcclxuICAgICAgICAgICAgVGl0bGU6IHN0YXRlLlRpdGxlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBIZWFkZXI6IGhlYWRlcixcclxuICAgICAgICAgICAgVGV4dDogc3RhdGUuVGV4dFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBoYW5kbGVTdWJtaXQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCB7IGNsb3NlLCBvblN1Ym1pdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBwb3N0ID0gdGhpcy50cmFuc2Zvcm1Ub0RUTyh0aGlzLnN0YXRlKTtcclxuICAgICAgICBvblN1Ym1pdChwb3N0KTtcclxuICAgICAgICBjbG9zZSgpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlU3RpY2t5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgU3RpY2t5IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBTdGlja3k6ICFTdGlja3kgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVQdWJsaXNoZWQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBJc1B1Ymxpc2hlZCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgSXNQdWJsaXNoZWQ6ICFJc1B1Ymxpc2hlZCB9KTtcclxuICAgIH1cclxuICAgIGNsb3NlSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xvc2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY2xvc2UoKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHNob3csIGVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVhZE1vZGUgPSBCb29sZWFuKCFlZGl0KTtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IHJlYWRNb2RlID8gXCJTa3JpdiBueXQgaW5kbMOmZ1wiIDogXCLDhm5kcmUgaW5kbMOmZ1wiO1xyXG4gICAgICAgIGNvbnN0IGJ0blN1Ym1pdCA9IHJlYWRNb2RlID8gXCJTa3JpdiBpbmRsw6ZnXCIgOiBcIkdlbSDDpm5kcmluZ2VyXCI7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwsIHsgc2hvdzogc2hvdywgb25IaWRlOiB0aGlzLmNsb3NlSGFuZGxlLmJpbmQodGhpcyksIGJzU2l6ZTogXCJsZ1wiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkhlYWRlciwgeyBjbG9zZUJ1dHRvbjogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuVGl0bGUsIG51bGwsIHRpdGxlKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxMiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgY29udHJvbElkOiBcImZvcm1Qb3N0VGl0bGVcIiwgdmFsaWRhdGlvblN0YXRlOiB0aGlzLmdldFZhbGlkYXRpb24oKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29udHJvbExhYmVsLCBudWxsLCBcIk92ZXJza3JpZnRcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiT3ZlcnNrcmlmdCBww6UgaW5kbMOmZy4uLlwiLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVUaXRsZUNoYW5nZS5iaW5kKHRoaXMpLCB2YWx1ZTogdGhpcy5zdGF0ZS5UaXRsZSB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBjb250cm9sSWQ6IFwiZm9ybVBvc3RDb250ZW50XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbnRyb2xMYWJlbCwgbnVsbCwgXCJJbmRsXFx1MDBFNmdcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyBjb21wb25lbnRDbGFzczogXCJ0ZXh0YXJlYVwiLCBwbGFjZWhvbGRlcjogXCJTa3JpdiBiZXNrZWQgaGVyLi4uXCIsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKSwgdmFsdWU6IHRoaXMuc3RhdGUuVGV4dCwgcm93czogOCB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBjb250cm9sSWQ6IFwiZm9ybVBvc3RTdGlja3lcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uR3JvdXAsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwic3VjY2Vzc1wiLCBic1NpemU6IFwic21hbGxcIiwgYWN0aXZlOiB0aGlzLnN0YXRlLlN0aWNreSwgb25DbGljazogdGhpcy5oYW5kbGVTdGlja3kuYmluZCh0aGlzKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicHVzaHBpblwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgVmlndGlnXCIpKSkpKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkZvb3RlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcImRlZmF1bHRcIiwgb25DbGljazogdGhpcy5jbG9zZUhhbmRsZS5iaW5kKHRoaXMpIH0sIFwiTHVrXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZVN1Ym1pdCB9LCBidG5TdWJtaXQpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQnV0dG9uVG9vbGJhciwgQnV0dG9uR3JvdXAsIE92ZXJsYXlUcmlnZ2VyLCBCdXR0b24sIEdseXBoaWNvbiwgVG9vbHRpcCwgQ29sbGFwc2UsIEZvcm1Hcm91cCwgRm9ybUNvbnRyb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBCdXR0b25Ub29sdGlwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRvb2x0aXAsIG9uQ2xpY2ssIGljb24sIGJzU3R5bGUsIGFjdGl2ZSwgbW91bnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbGV0IG92ZXJsYXlUaXAgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFRvb2x0aXAsIHsgaWQ6IFwidG9vbHRpcFwiIH0sIHRvb2x0aXApO1xyXG4gICAgICAgIGlmICghbW91bnQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE92ZXJsYXlUcmlnZ2VyLCB7IHBsYWNlbWVudDogXCJ0b3BcIiwgb3ZlcmxheTogb3ZlcmxheVRpcCB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBic1N0eWxlLCBic1NpemU6IFwieHNtYWxsXCIsIG9uQ2xpY2s6IG9uQ2xpY2ssIGFjdGl2ZTogYWN0aXZlIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogaWNvbiB9KSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Q29udHJvbHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGV4dDogcHJvcHMudGV4dCxcclxuICAgICAgICAgICAgcmVwbHlUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICByZXBseTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVkaXQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRvZ2dsZUVkaXQgPSB0aGlzLnRvZ2dsZUVkaXQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRvZ2dsZVJlcGx5ID0gdGhpcy50b2dnbGVSZXBseS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZWRpdEhhbmRsZSA9IHRoaXMuZWRpdEhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlIYW5kbGUgPSB0aGlzLnJlcGx5SGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVIYW5kbGUgPSB0aGlzLmRlbGV0ZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVwbHlDaGFuZ2UgPSB0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVSZXBseUNoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5VGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVFZGl0KCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogIWVkaXQgfSk7XHJcbiAgICAgICAgaWYgKCFlZGl0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdG9nZ2xlUmVwbHkoKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseSB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6ICFyZXBseSB9KTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUNvbW1lbnQsIGNvbW1lbnRJZCwgY29udGV4dElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBjb250ZXh0SWQpO1xyXG4gICAgfVxyXG4gICAgZWRpdEhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRDb21tZW50LCBjb250ZXh0SWQsIGNvbW1lbnRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IGZhbHNlIH0pO1xyXG4gICAgICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgY29udGV4dElkLCB0ZXh0KTtcclxuICAgIH1cclxuICAgIHJlcGx5SGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudElkLCBjb250ZXh0SWQsIHJlcGx5Q29tbWVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHJlcGx5VGV4dCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6IGZhbHNlLCByZXBseVRleHQ6IFwiXCIgfSk7XHJcbiAgICAgICAgcmVwbHlDb21tZW50KGNvbnRleHRJZCwgcmVwbHlUZXh0LCBjb21tZW50SWQpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9ySWQsIGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0LCB0ZXh0LCByZXBseSwgcmVwbHlUZXh0IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IG1vdW50ID0gY2FuRWRpdChhdXRob3JJZCk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBzdHlsZTogeyBwYWRkaW5nQm90dG9tOiBcIjVweFwiLCBwYWRkaW5nTGVmdDogXCIxNXB4XCIgfSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDQgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uR3JvdXAsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMuZGVsZXRlSGFuZGxlLCBpY29uOiBcInRyYXNoXCIsIHRvb2x0aXA6IFwic2xldFwiLCBtb3VudDogbW91bnQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMudG9nZ2xlRWRpdCwgaWNvbjogXCJwZW5jaWxcIiwgdG9vbHRpcDogXCLDpm5kcmVcIiwgYWN0aXZlOiBlZGl0LCBtb3VudDogbW91bnQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMudG9nZ2xlUmVwbHksIGljb246IFwiZW52ZWxvcGVcIiwgdG9vbHRpcDogXCJzdmFyXCIsIGFjdGl2ZTogcmVwbHksIG1vdW50OiB0cnVlIH0pKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsgc3R5bGU6IHsgcGFkZGluZ0JvdHRvbTogXCI1cHhcIiB9IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMSwgbGc6IDEwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2xsYXBzZVRleHRBcmVhLCB7IHNob3c6IGVkaXQsIGlkOiBcImVkaXRUZXh0Q29udHJvbFwiLCB2YWx1ZTogdGV4dCwgb25DaGFuZ2U6IHRoaXMuaGFuZGxlVGV4dENoYW5nZSwgdG9nZ2xlOiB0aGlzLnRvZ2dsZUVkaXQsIHNhdmU6IHRoaXMuZWRpdEhhbmRsZSwgc2F2ZVRleHQ6IFwiR2VtIMOmbmRyaW5nZXJcIiwgbW91bnQ6IG1vdW50IH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDEsIGxnOiAxMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sbGFwc2VUZXh0QXJlYSwgeyBzaG93OiByZXBseSwgaWQ6IFwicmVwbHlUZXh0Q29udHJvbFwiLCB2YWx1ZTogcmVwbHlUZXh0LCBvbkNoYW5nZTogdGhpcy5oYW5kbGVSZXBseUNoYW5nZSwgdG9nZ2xlOiB0aGlzLnRvZ2dsZVJlcGx5LCBzYXZlOiB0aGlzLnJlcGx5SGFuZGxlLCBzYXZlVGV4dDogXCJTdmFyXCIsIG1vdW50OiB0cnVlIH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIENvbGxhcHNlVGV4dEFyZWEgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2hvdywgaWQsIHZhbHVlLCBvbkNoYW5nZSwgdG9nZ2xlLCBzYXZlLCBzYXZlVGV4dCwgbW91bnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCFtb3VudClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sbGFwc2UsIHsgaW46IHNob3cgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgY29udHJvbElkOiBpZCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtQ29udHJvbCwgeyBjb21wb25lbnRDbGFzczogXCJ0ZXh0YXJlYVwiLCB2YWx1ZTogdmFsdWUsIG9uQ2hhbmdlOiBvbkNoYW5nZSwgcm93czogNCB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbGJhciwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0b2dnbGUgfSwgXCJMdWtcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgdHlwZTogXCJzdWJtaXRcIiwgYnNTdHlsZTogXCJpbmZvXCIsIG9uQ2xpY2s6IHNhdmUgfSwgc2F2ZVRleHQpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmltcG9ydCB7IG9wdGlvbnMsIHJlc3BvbnNlSGFuZGxlciB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgbm9ybWFsaXplVGhyZWFkVGl0bGUgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL25vcm1hbGl6ZVwiO1xyXG5leHBvcnQgY29uc3QgYWRkVGhyZWFkVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjQsXHJcbiAgICAgICAgcGF5bG9hZDogW3RpdGxlXVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRocmVhZFRpdGxlcyA9ICh0aXRsZXMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjUsXHJcbiAgICAgICAgcGF5bG9hZDogdGl0bGVzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VG90YWxQYWdlcyA9ICh0b3RhbFBhZ2VzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDI2LFxyXG4gICAgICAgIHBheWxvYWQ6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRQYWdlID0gKHBhZ2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjcsXHJcbiAgICAgICAgcGF5bG9hZDogcGFnZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFNraXAgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyOCxcclxuICAgICAgICBwYXlsb2FkOiBza2lwXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VGFrZSA9ICh0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDI5LFxyXG4gICAgICAgIHBheWxvYWQ6IHRha2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZFRocmVhZCA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzMCxcclxuICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFBvc3RDb250ZW50ID0gKGNvbnRlbnQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzEsXHJcbiAgICAgICAgcGF5bG9hZDogY29udGVudFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG1hcmtQb3N0ID0gKHBvc3RJZCwgcmVhZCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9wb3N0SWQ9JHtwb3N0SWR9JnJlYWQ9JHtyZWFkfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoVGhyZWFkcyA9IChza2lwID0gMCwgdGFrZSA9IDEwKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZm9ydW0gPSBnbG9iYWxzLnVybHMuZm9ydW10aXRsZTtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtmb3J1bX0/c2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VGb3J1bVRpdGxlcyA9IGRhdGEuQ3VycmVudEl0ZW1zO1xyXG4gICAgICAgICAgICBjb25zdCBmb3J1bVRpdGxlcyA9IHBhZ2VGb3J1bVRpdGxlcy5tYXAobm9ybWFsaXplVGhyZWFkVGl0bGUpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwKHNraXApKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZSh0YWtlKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMoZGF0YS5Ub3RhbFBhZ2VzKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFBhZ2UoZGF0YS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUaHJlYWRUaXRsZXMoZm9ydW1UaXRsZXMpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFBvc3QgPSAoaWQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZm9ydW0gPSBnbG9iYWxzLnVybHMuZm9ydW1wb3N0O1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2ZvcnVtfT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkYXRhLlRleHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gbm9ybWFsaXplVGhyZWFkVGl0bGUoZGF0YS5IZWFkZXIpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChhZGRUaHJlYWRUaXRsZSh0aXRsZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRQb3N0Q29udGVudChjb250ZW50KSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkVGhyZWFkKGRhdGEuVGhyZWFkSUQpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgdXBkYXRlUG9zdCA9IChpZCwgcG9zdCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKF8gPT4gbnVsbCk7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3QpLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVsZXRlUG9zdCA9IChpZCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHBvc3RUaHJlYWQgPSAocG9zdCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuZm9ydW1wb3N0O1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3QpLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkoXyA9PiBudWxsKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGNiKTtcclxuICAgIH07XHJcbn07XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBGb3J1bUZvcm0gfSBmcm9tIFwiLi4vZm9ydW0vRm9ydW1Gb3JtXCI7XHJcbmltcG9ydCB7IEJ1dHRvblRvb2x0aXAgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudENvbnRyb2xzXCI7XHJcbmltcG9ydCB7IG1hcmtQb3N0LCB1cGRhdGVQb3N0LCBmZXRjaFBvc3QsIGRlbGV0ZVBvc3QsIHNldFNlbGVjdGVkVGhyZWFkIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvZm9ydW1cIjtcclxuaW1wb3J0IHsgZmluZCwgY29udGFpbnMgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgeyBnZXRGdWxsTmFtZSwgZm9ybWF0VGV4dCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIEdseXBoaWNvbiwgQnV0dG9uVG9vbGJhciwgQnV0dG9uR3JvdXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnNlbGVjdGVkVGhyZWFkO1xyXG4gICAgY29uc3QgdGl0bGUgPSBmaW5kKHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRpdGxlcywgKHRpdGxlKSA9PiB0aXRsZS5JRCA9PT0gc2VsZWN0ZWQpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWQsXHJcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgIHRleHQ6IHN0YXRlLmZvcnVtSW5mby5wb3N0Q29udGVudCxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF0sXHJcbiAgICAgICAgY2FuRWRpdDogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZCA9PT0gaWQsXHJcbiAgICAgICAgaGFzUmVhZDogdGl0bGUgPyBjb250YWlucyh0aXRsZS5WaWV3ZWRCeSwgc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQpIDogZmFsc2UsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlOiAoaWQsIHBvc3QsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwZGF0ZVBvc3QoaWQsIHBvc3QsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRQb3N0OiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hQb3N0KGlkKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKHNldFNlbGVjdGVkVGhyZWFkKGlkKSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlUG9zdDogKGlkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVQb3N0KGlkLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVhZFBvc3Q6IChwb3N0SWQsIHJlYWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKG1hcmtQb3N0KHBvc3RJZCwgcmVhZCwgY2IpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBGb3J1bVBvc3RDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgZWRpdDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudG9nZ2xlRWRpdCA9IHRoaXMudG9nZ2xlRWRpdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25TdWJtaXQgPSB0aGlzLm9uU3VibWl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVIYW5kbGUgPSB0aGlzLmRlbGV0ZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlUG9zdFJlYWQgPSB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IGhhc1RpdGxlID0gQm9vbGVhbihuZXh0UHJvcHMudGl0bGUpO1xyXG4gICAgICAgIGlmICghaGFzVGl0bGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBuZXh0UHJvcHMudGl0bGUuVGl0bGUsXHJcbiAgICAgICAgICAgICAgICBUZXh0OiBuZXh0UHJvcHMudGV4dCxcclxuICAgICAgICAgICAgICAgIFN0aWNreTogbmV4dFByb3BzLnRpdGxlLlN0aWNreSxcclxuICAgICAgICAgICAgICAgIElzUHVibGlzaGVkOiBuZXh0UHJvcHMudGl0bGUuSXNQdWJsaXNoZWRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IG5leHRQcm9wcy50aXRsZS5UaXRsZTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IHJvdXRlciwgZGVsZXRlUG9zdCwgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcnVtbGlzdHMgPSBgL2ZvcnVtYDtcclxuICAgICAgICAgICAgcm91dGVyLnB1c2goZm9ydW1saXN0cyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkZWxldGVQb3N0KHRpdGxlLklELCBjYik7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVFZGl0KCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXQgPSB0aGlzLnN0YXRlLmVkaXQ7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6ICFlZGl0IH0pO1xyXG4gICAgfVxyXG4gICAgb25TdWJtaXQocG9zdCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBkYXRlLCBnZXRQb3N0LCB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgZ2V0UG9zdCh0aXRsZS5JRCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB1cGRhdGUodGl0bGUuSUQsIHBvc3QsIGNiKTtcclxuICAgIH1cclxuICAgIHRvZ2dsZVBvc3RSZWFkKHRvZ2dsZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZ2V0UG9zdCwgcmVhZFBvc3QsIHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBnZXRQb3N0KHRpdGxlLklEKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlYWRQb3N0KHRpdGxlLklELCB0b2dnbGUsIGNiKTtcclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBmYWxzZSB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIHNlbGVjdGVkLCB0aXRsZSwgdGV4dCwgZ2V0VXNlciwgaGFzUmVhZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAoc2VsZWN0ZWQgPCAwIHx8ICF0aXRsZSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgZWRpdCA9IGNhbkVkaXQodGl0bGUuQXV0aG9ySUQpO1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyKHRpdGxlLkF1dGhvcklEKTtcclxuICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRGdWxsTmFtZSh1c2VyKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1IZWFkZXIsIHsgbGc6IDEyLCBuYW1lOiBhdXRob3IsIHRpdGxlOiB0aXRsZS5UaXRsZSwgY3JlYXRlZE9uOiB0aXRsZS5DcmVhdGVkT24sIG1vZGlmaWVkT246IHRpdGxlLkxhc3RNb2RpZmllZCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUJ1dHRvbkdyb3VwLCB7IHNob3c6IHRydWUsIGVkaXRhYmxlOiBlZGl0LCBpbml0aWFsUmVhZDogaGFzUmVhZCwgb25EZWxldGU6IHRoaXMuZGVsZXRlSGFuZGxlLCBvbkVkaXQ6IHRoaXMudG9nZ2xlRWRpdCwgb25SZWFkOiB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcywgdHJ1ZSksIG9uVW5yZWFkOiB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcywgZmFsc2UpIH0pKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUJvZHksIHsgdGV4dDogdGV4dCwgbGc6IDEwIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUZvcm0sIHsgc2hvdzogdGhpcy5zdGF0ZS5lZGl0LCBjbG9zZTogdGhpcy5jbG9zZS5iaW5kKHRoaXMpLCBvblN1Ym1pdDogdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpLCBlZGl0OiB0aGlzLnN0YXRlLm1vZGVsIH0pKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRm9ydW1Cb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQsIGxnLCBsZ09mZnNldCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBmb3JtYXR0ZWRUZXh0ID0gZm9ybWF0VGV4dCh0ZXh0KTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiBsZywgbGdPZmZzZXQ6IGxnT2Zmc2V0IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJmb3J1bS1jb250ZW50XCIsIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiBmb3JtYXR0ZWRUZXh0IH0pLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEyIH0sIHRoaXMucHJvcHMuY2hpbGRyZW4pKSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBGb3J1bUhlYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBnZXRDcmVhdGVkT25UZXh0KGNyZWF0ZWRPbiwgbW9kaWZpZWRPbikge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBtb21lbnQoY3JlYXRlZE9uKTtcclxuICAgICAgICBjb25zdCBkYXRlVGV4dCA9IGRhdGUuZm9ybWF0KFwiRC1NTS1ZWVwiKTtcclxuICAgICAgICBjb25zdCB0aW1lVGV4dCA9IGRhdGUuZm9ybWF0KFwiIEg6bW1cIik7XHJcbiAgICAgICAgaWYgKCFtb2RpZmllZE9uKVxyXG4gICAgICAgICAgICByZXR1cm4gYFVkZ2l2ZXQgJHtkYXRlVGV4dH0ga2wuICR7dGltZVRleHR9YDtcclxuICAgICAgICBjb25zdCBtb2RpZmllZCA9IG1vbWVudChtb2RpZmllZE9uKTtcclxuICAgICAgICBjb25zdCBtb2RpZmllZERhdGUgPSBtb2RpZmllZC5mb3JtYXQoXCJELU1NLVlZXCIpO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkVGltZSA9IG1vZGlmaWVkLmZvcm1hdChcIkg6bW1cIik7XHJcbiAgICAgICAgcmV0dXJuIGBVZGdpdmV0ICR7ZGF0ZVRleHR9IGtsLiAke3RpbWVUZXh0fSAoIHJldHRldCAke21vZGlmaWVkRGF0ZX0ga2wuICR7bW9kaWZpZWRUaW1lfSApYDtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlLCBuYW1lLCBjcmVhdGVkT24sIG1vZGlmaWVkT24sIGxnLCBsZ09mZnNldCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5nZXRDcmVhdGVkT25UZXh0KGNyZWF0ZWRPbiwgbW9kaWZpZWRPbik7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7IGxnOiBsZywgbGdPZmZzZXQ6IGxnT2Zmc2V0IH07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgX19hc3NpZ24oe30sIHByb3BzKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtY2FwaXRhbGl6ZVwiIH0sIHRpdGxlKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU2tyZXZldCBhZiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtcHJpbWFyeVwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwidGltZVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWQpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsIHRoaXMucHJvcHMuY2hpbGRyZW4pKSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEZvcnVtQnV0dG9uR3JvdXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgcmVhZDogcHJvcHMuaW5pdGlhbFJlYWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVhZEhhbmRsZSA9IHRoaXMucmVhZEhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudW5yZWFkSGFuZGxlID0gdGhpcy51bnJlYWRIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHJlYWRIYW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBvblJlYWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucmVhZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWFkOiB0cnVlIH0pO1xyXG4gICAgICAgIG9uUmVhZCgpO1xyXG4gICAgfVxyXG4gICAgdW5yZWFkSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb25VbnJlYWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnJlYWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVhZDogZmFsc2UgfSk7XHJcbiAgICAgICAgb25VbnJlYWQoKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRhYmxlLCBzaG93LCBvbkRlbGV0ZSwgb25FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghc2hvdylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyByZWFkIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMTIsIGNsYXNzTmFtZTogXCJmb3J1bS1lZGl0YmFyXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sYmFyLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Hcm91cCwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJkYW5nZXJcIiwgb25DbGljazogb25EZWxldGUsIGljb246IFwidHJhc2hcIiwgdG9vbHRpcDogXCJzbGV0IGluZGzDpmdcIiwgbW91bnQ6IGVkaXRhYmxlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbHRpcCwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgb25DbGljazogb25FZGl0LCBpY29uOiBcInBlbmNpbFwiLCB0b29sdGlwOiBcIsOmbmRyZSBpbmRsw6ZnXCIsIGFjdGl2ZTogZmFsc2UsIG1vdW50OiBlZGl0YWJsZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMucmVhZEhhbmRsZSwgaWNvbjogXCJleWUtb3BlblwiLCB0b29sdGlwOiBcIm1hcmtlciBzb20gbMOmc3RcIiwgYWN0aXZlOiByZWFkLCBtb3VudDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMudW5yZWFkSGFuZGxlLCBpY29uOiBcImV5ZS1jbG9zZVwiLCB0b29sdGlwOiBcIm1hcmtlciBzb20gdWzDpnN0XCIsIGFjdGl2ZTogIXJlYWQsIG1vdW50OiB0cnVlIH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IEZvcnVtUG9zdFJlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRm9ydW1Qb3N0Q29udGFpbmVyKTtcclxuY29uc3QgRm9ydW1Qb3N0ID0gd2l0aFJvdXRlcihGb3J1bVBvc3RSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IEZvcnVtUG9zdDtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFBhZ2luYXRpb24gYXMgUGFnaW5hdGlvbkJzIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBwYWdlLCBwYWdlSGFuZGxlLCBzaG93IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG1vcmUgPSB0b3RhbFBhZ2VzID4gMTtcclxuICAgICAgICBjb25zdCB4b3IgPSAoc2hvdyB8fCBtb3JlKSAmJiAhKHNob3cgJiYgbW9yZSk7XHJcbiAgICAgICAgaWYgKCEoeG9yIHx8IChzaG93ICYmIG1vcmUpKSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbkJzLCB7IHByZXY6IHRydWUsIG5leHQ6IHRydWUsIGVsbGlwc2lzOiB0cnVlLCBib3VuZGFyeUxpbmtzOiB0cnVlLCBpdGVtczogdG90YWxQYWdlcywgbWF4QnV0dG9uczogNSwgYWN0aXZlUGFnZTogcGFnZSwgb25TZWxlY3Q6IHBhZ2VIYW5kbGUgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgZmV0Y2hMYXRlc3ROZXdzIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvd2hhdHNuZXdcIjtcclxuaW1wb3J0IHsgV2hhdHNOZXdMaXN0IH0gZnJvbSBcIi4uL3doYXRzbmV3L1doYXRzTmV3TGlzdFwiO1xyXG5pbXBvcnQgeyBGb3J1bUhlYWRlciwgRm9ydW1Cb2R5IH0gZnJvbSBcIi4vRm9ydW1Qb3N0XCI7XHJcbmltcG9ydCB7IEJ1dHRvbiwgQnV0dG9uVG9vbGJhciwgTW9kYWwsIFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSBcIi4uL3BhZ2luYXRpb24vUGFnaW5hdGlvblwiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXRlbXM6IHN0YXRlLndoYXRzTmV3SW5mby5pdGVtcyxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF0sXHJcbiAgICAgICAgc2tpcDogc3RhdGUud2hhdHNOZXdJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUud2hhdHNOZXdJbmZvLnRha2UsXHJcbiAgICAgICAgdG90YWxQYWdlczogc3RhdGUud2hhdHNOZXdJbmZvLnRvdGFsUGFnZXMsXHJcbiAgICAgICAgcGFnZTogc3RhdGUud2hhdHNOZXdJbmZvLnBhZ2UsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TGF0ZXN0OiAoc2tpcCwgdGFrZSkgPT4gZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKSxcclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFdoYXRzTmV3Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgcG9zdFByZXZpZXc6IG51bGwsXHJcbiAgICAgICAgICAgIGF1dGhvcjogbnVsbCxcclxuICAgICAgICAgICAgb246IG51bGxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucGFnZUhhbmRsZSA9IHRoaXMucGFnZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJldmlld1Bvc3QgPSB0aGlzLnByZXZpZXdQb3N0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZU1vZGFsID0gdGhpcy5jbG9zZU1vZGFsLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFZpZXcgPSB0aGlzLm1vZGFsVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubmF2aWdhdGVUbyA9IHRoaXMubmF2aWdhdGVUby5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgZ2V0TGF0ZXN0LCBwYWdlLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmIChwYWdlID09PSB0bylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHRvIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgZ2V0TGF0ZXN0KHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcbiAgICBwcmV2aWV3UG9zdChpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgeyBnZXRVc2VyIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IGdldFVzZXIoaXRlbS5BdXRob3JJRCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxyXG4gICAgICAgICAgICBwb3N0UHJldmlldzogaXRlbS5JdGVtLFxyXG4gICAgICAgICAgICBhdXRob3I6IGF1dGhvcixcclxuICAgICAgICAgICAgb246IGl0ZW0uT25cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG8odXJsKSB7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBwdXNoKHVybCk7XHJcbiAgICB9XHJcbiAgICBjbG9zZU1vZGFsKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBtb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBvc3RQcmV2aWV3OiBudWxsLFxyXG4gICAgICAgICAgICBhdXRob3I6IG51bGwsXHJcbiAgICAgICAgICAgIG9uOiBudWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBtb2RhbFZpZXcoKSB7XHJcbiAgICAgICAgaWYgKCFCb29sZWFuKHRoaXMuc3RhdGUucG9zdFByZXZpZXcpKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCB7IFRleHQsIFRpdGxlLCBJRCB9ID0gdGhpcy5zdGF0ZS5wb3N0UHJldmlldztcclxuICAgICAgICBjb25zdCBhdXRob3IgPSB0aGlzLnN0YXRlLmF1dGhvcjtcclxuICAgICAgICBjb25zdCBuYW1lID0gYCR7YXV0aG9yLkZpcnN0TmFtZX0gJHthdXRob3IuTGFzdE5hbWV9YDtcclxuICAgICAgICBjb25zdCBsaW5rID0gYGZvcnVtL3Bvc3QvJHtJRH0vY29tbWVudHNgO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLCB7IHNob3c6IHRoaXMuc3RhdGUubW9kYWwsIG9uSGlkZTogdGhpcy5jbG9zZU1vZGFsLCBic1NpemU6IFwibGFyZ2VcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkhlYWRlciwgeyBjbG9zZUJ1dHRvbjogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5UaXRsZSwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcnVtSGVhZGVyLCB7IGxnOiAxMSwgbGdPZmZzZXQ6IDEsIGNyZWF0ZWRPbjogdGhpcy5zdGF0ZS5vbiwgdGl0bGU6IFRpdGxlLCBuYW1lOiBuYW1lIH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1Cb2R5LCB7IHRleHQ6IFRleHQsIGxnOiAxMSwgbGdPZmZzZXQ6IDEgfSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkZvb3RlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbGJhciwgeyBzdHlsZTogeyBmbG9hdDogXCJyaWdodFwiIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgb25DbGljazogKCkgPT4gdGhpcy5uYXZpZ2F0ZVRvKGxpbmspIH0sIFwiU2Uga29tbWVudGFyZXIgKGZvcnVtKVwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0aGlzLmNsb3NlTW9kYWwgfSwgXCJMdWtcIikpKSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciwgdG90YWxQYWdlcywgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIG51bGwsIFwiU2lkc3RlIGhcXHUwMEU2bmRlbHNlclwiKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdMaXN0LCB7IGl0ZW1zOiBpdGVtcywgZ2V0VXNlcjogZ2V0VXNlciwgcHJldmlldzogdGhpcy5wcmV2aWV3UG9zdCB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbiwgeyB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzLCBwYWdlOiBwYWdlLCBwYWdlSGFuZGxlOiB0aGlzLnBhZ2VIYW5kbGUgfSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsVmlldygpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgV2hhdHNOZXcgPSB3aXRoUm91dGVyKGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFdoYXRzTmV3Q29udGFpbmVyKSk7XHJcbmV4cG9ydCBkZWZhdWx0IFdoYXRzTmV3O1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgSnVtYm90cm9uLCBHcmlkLCBSb3csIENvbCwgUGFuZWwsIEFsZXJ0IH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IGZldGNoTGF0ZXN0TmV3cyB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL3doYXRzbmV3XCI7XHJcbmltcG9ydCB7IEltYWdlVXBsb2FkIH0gZnJvbSBcIi4uL2ltYWdlcy9JbWFnZVVwbG9hZFwiO1xyXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2ltYWdlc1wiO1xyXG5pbXBvcnQgVXNlZFNwYWNlIGZyb20gXCIuL1VzZWRTcGFjZVwiO1xyXG5pbXBvcnQgV2hhdHNOZXcgZnJvbSBcIi4vV2hhdHNOZXdcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW3N0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkXTtcclxuICAgIGNvbnN0IG5hbWUgPSB1c2VyID8gdXNlci5Vc2VybmFtZSA6IFwiVXNlclwiO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2VybmFtZTogbmFtZSxcclxuICAgICAgICBza2lwOiBzdGF0ZS53aGF0c05ld0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS53aGF0c05ld0luZm8udGFrZVxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwbG9hZEltYWdlOiAoc2tpcCwgdGFrZSwgdXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvblN1Y2Nlc3MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChmZXRjaExhdGVzdE5ld3Moc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkaXNwYXRjaCh1cGxvYWRJbWFnZSh1c2VybmFtZSwgZGVzY3JpcHRpb24sIGZvcm1EYXRhLCBvblN1Y2Nlc3MsIChyKSA9PiB7IGNvbnNvbGUubG9nKHIpOyB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgSG9tZUNvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICByZWNvbW1lbmRlZDogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy51cGxvYWQgPSB0aGlzLnVwbG9hZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVjb21tZW5kZWRWaWV3ID0gdGhpcy5yZWNvbW1lbmRlZFZpZXcuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJGb3JzaWRlXCI7XHJcbiAgICB9XHJcbiAgICB1cGxvYWQodXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBsb2FkSW1hZ2UsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgdXBsb2FkSW1hZ2Uoc2tpcCwgdGFrZSwgdXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSk7XHJcbiAgICB9XHJcbiAgICByZWNvbW1lbmRlZFZpZXcoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnJlY29tbWVuZGVkKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBbGVydCwgeyBic1N0eWxlOiBcInN1Y2Nlc3NcIiwgb25EaXNtaXNzOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgcmVjb21tZW5kZWQ6IGZhbHNlIH0pIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIG51bGwsIFwiQW5iZWZhbGluZ2VyXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGVzdGV0IG1lZCBHb29nbGUgQ2hyb21lIGJyb3dzZXIuIERlcmZvciBlciBkZXQgYW5iZWZhbGV0IGF0IGJydWdlIGRlbm5lIHRpbCBhdCBmXFx1MDBFNSBkZW4gZnVsZGUgb3BsZXZlbHNlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpKSkpKSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWUgPSBnbG9iYWxzLmN1cnJlbnRVc2VybmFtZTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSnVtYm90cm9uLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJWZWxrb21tZW4gXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiFcIikpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImxlYWRcIiB9LCBcIlRpbCBJbnVwbGFucyBmb3J1bSBvZyBiaWxsZWQtYXJraXYgc2lkZVwiKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA0IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFuZWwsIHsgaGVhZGVyOiBcIkR1IGthbiB1cGxvYWRlIGJpbGxlZGVyIHRpbCBkaXQgZWdldCBnYWxsZXJpIGhlclwiLCBic1N0eWxlOiBcInByaW1hcnlcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbWFnZVVwbG9hZCwgeyB1c2VybmFtZTogdXNlcm5hbWUsIHVwbG9hZEltYWdlOiB0aGlzLnVwbG9hZCB9KSkpKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR3JpZCwgeyBmbHVpZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDQgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChXaGF0c05ldywgbnVsbCkpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAxLCBsZzogMyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY29tbWVuZGVkVmlldygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDNcIiwgbnVsbCwgXCJQZXJzb25saWcgdXBsb2FkIGZvcmJydWdcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCwgXCJIZXJ1bmRlciBrYW4gZHUgc2UgaHZvciBtZWdldCBwbGFkcyBkdSBoYXIgYnJ1Z3Qgb2cgaHZvciBtZWdldCBmcmkgcGxhZHNcIiArIFwiIFwiICsgXCJkZXIgZXIgdGlsYmFnZS4gR1xcdTAwRTZsZGVyIGt1biBiaWxsZWRlIGZpbGVyLlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVc2VkU3BhY2UsIG51bGwpKSkpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBIb21lID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSG9tZUNvbnRhaW5lcik7XHJcbmV4cG9ydCBkZWZhdWx0IEhvbWU7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9ydW0gZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJGb3J1bSBcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic21hbGxcIiwgbnVsbCwgXCJpbmRsXFx1MDBFNmdcIikpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbikpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgR2x5cGhpY29uLCBPdmVybGF5VHJpZ2dlciwgVG9vbHRpcCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgZ2V0V29yZHMgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmV4cG9ydCBjbGFzcyBGb3J1bVRpdGxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGRhdGVWaWV3KGRhdGUpIHtcclxuICAgICAgICBjb25zdCBkYXlNb250aFllYXIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KFwiRC9NTS9ZWVwiKTtcclxuICAgICAgICByZXR1cm4gYCR7ZGF5TW9udGhZZWFyfWA7XHJcbiAgICB9XHJcbiAgICBtb2RpZmllZFZpZXcobW9kaWZpZWRPbikge1xyXG4gICAgICAgIGlmICghbW9kaWZpZWRPbilcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWREYXRlID0gbW9tZW50KG1vZGlmaWVkT24pLmZvcm1hdChcIkQvTU0vWVktSDptbVwiKTtcclxuICAgICAgICByZXR1cm4gYCR7bW9kaWZpZWREYXRlfWA7XHJcbiAgICB9XHJcbiAgICB0b29sdGlwVmlldygpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IGlkOiBcInRvb2x0aXBcIiB9LCBcIlZpZ3RpZ1wiKTtcclxuICAgIH1cclxuICAgIHN0aWNreUljb24oc2hvdykge1xyXG4gICAgICAgIGlmICghc2hvdylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInN0aWNreVwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3ZlcmxheVRyaWdnZXIsIHsgcGxhY2VtZW50OiBcInRvcFwiLCBvdmVybGF5OiB0aGlzLnRvb2x0aXBWaWV3KCkgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcInB1c2hwaW5cIiB9KSkpO1xyXG4gICAgfVxyXG4gICAgZGF0ZU1vZGlmaWVkVmlldyh0aXRsZSkge1xyXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmRhdGVWaWV3KHRpdGxlLkNyZWF0ZWRPbik7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZCA9IHRoaXMubW9kaWZpZWRWaWV3KHRpdGxlLkxhc3RNb2RpZmllZCk7XHJcbiAgICAgICAgaWYgKCF1cGRhdGVkKVxyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgY3JlYXRlZCk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsXHJcbiAgICAgICAgICAgIGNyZWF0ZWQsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgXCIoXCIsXHJcbiAgICAgICAgICAgIHVwZGF0ZWQsXHJcbiAgICAgICAgICAgIFwiKVwiKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZVN1bW1hcnkoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAoIXRpdGxlLkxhdGVzdENvbW1lbnQpXHJcbiAgICAgICAgICAgIHJldHVybiBcIkluZ2VuIGtvbW1lbnRhcmVyXCI7XHJcbiAgICAgICAgaWYgKHRpdGxlLkxhdGVzdENvbW1lbnQuRGVsZXRlZClcclxuICAgICAgICAgICAgcmV0dXJuIFwiS29tbWVudGFyIHNsZXR0ZXRcIjtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdGl0bGUuTGF0ZXN0Q29tbWVudC5UZXh0O1xyXG4gICAgICAgIHJldHVybiBnZXRXb3Jkcyh0ZXh0LCA1KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlLCBnZXRBdXRob3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGdldEF1dGhvcih0aXRsZS5BdXRob3JJRCk7XHJcbiAgICAgICAgY29uc3QgbGF0ZXN0Q29tbWVudCA9IHRoaXMuY3JlYXRlU3VtbWFyeSgpO1xyXG4gICAgICAgIGNvbnN0IGNzcyA9IHRpdGxlLlN0aWNreSA/IFwidGhyZWFkIHRocmVhZC1waW5uZWRcIiA6IFwidGhyZWFkXCI7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IGAvZm9ydW0vcG9zdC8ke3RpdGxlLklEfS9jb21tZW50c2A7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogcGF0aCB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBjbGFzc05hbWU6IGNzcyB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEsIGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sIHRoaXMuc3RpY2t5SWNvbih0aXRsZS5TdGlja3kpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA1IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtY2FwaXRhbGl6ZVwiIH0sIHRpdGxlLlRpdGxlKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWY6IFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMiwgY2xhc3NOYW1lOiBcInRleHQtbGVmdFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCwgdGhpcy5kYXRlTW9kaWZpZWRWaWV3KHRpdGxlKSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIsIGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCwgdGl0bGUuVmlld2VkQnkubGVuZ3RoKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMiwgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBsYXRlc3RDb21tZW50KSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIEJ1dHRvbkdyb3VwLCBCdXR0b24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IEZvcnVtVGl0bGUgfSBmcm9tIFwiLi4vZm9ydW0vRm9ydW1UaXRsZVwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IGZldGNoVGhyZWFkcywgcG9zdFRocmVhZCB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2ZvcnVtXCI7XHJcbmltcG9ydCB7IFBhZ2luYXRpb24gfSBmcm9tIFwiLi4vcGFnaW5hdGlvbi9QYWdpbmF0aW9uXCI7XHJcbmltcG9ydCB7IEZvcnVtRm9ybSB9IGZyb20gXCIuLi9mb3J1bS9Gb3J1bUZvcm1cIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRocmVhZHM6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRpdGxlcyxcclxuICAgICAgICBza2lwOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRha2UsXHJcbiAgICAgICAgcGFnZTogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8ucGFnZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby50b3RhbFBhZ2VzLFxyXG4gICAgICAgIGdldEF1dGhvcjogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnNbaWRdO1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7dXNlci5GaXJzdE5hbWV9ICR7dXNlci5MYXN0TmFtZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZmV0Y2hUaHJlYWRzOiAoc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFRocmVhZHMoc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdFRocmVhZDogKGNiLCBwb3N0KSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RUaHJlYWQocG9zdCwgY2IpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBGb3J1bUxpc3RDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbmV3UG9zdDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucGFnZUhhbmRsZSA9IHRoaXMucGFnZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiSW51cGxhbiBGb3J1bVwiO1xyXG4gICAgfVxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgZmV0Y2hUaHJlYWRzLCBwYWdlLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmIChwYWdlID09PSB0bylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNraXBJdGVtcyA9ICh0byAtIDEpICogdGFrZTtcclxuICAgICAgICBmZXRjaFRocmVhZHMoc2tpcEl0ZW1zLCB0YWtlKTtcclxuICAgIH1cclxuICAgIHRocmVhZFZpZXdzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGhyZWFkcywgZ2V0QXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB0aHJlYWRzLm1hcCh0aHJlYWQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IGB0aHJlYWRfJHt0aHJlYWQuSUR9YDtcclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1UaXRsZSwgeyB0aXRsZTogdGhyZWFkLCBrZXk6IGlkLCBnZXRBdXRob3I6IGdldEF1dGhvciB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN1Ym1pdChwb3N0KSB7XHJcbiAgICAgICAgY29uc3QgeyBwb3N0VGhyZWFkLCBmZXRjaFRocmVhZHMsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcG9zdFRocmVhZCgoKSA9PiBmZXRjaFRocmVhZHMoc2tpcCwgdGFrZSksIHBvc3QpO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5ld1Bvc3Q6IGZhbHNlIH0pO1xyXG4gICAgfVxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmV3UG9zdDogdHJ1ZSB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRvdGFsUGFnZXMsIHBhZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbkdyb3VwLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IHRoaXMuc2hvdy5iaW5kKHRoaXMpIH0sIFwiVGlsZlxcdTAwRjhqIG55dCBpbmRsXFx1MDBFNmdcIikpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMTIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCB7IGNsYXNzTmFtZTogXCJ0aHJlYWQtaGVhZFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBcIkluZm9cIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA1IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJPdmVyc2tyaWZ0XCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMiwgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBcIkRhdG9cIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyLCBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiTFxcdTAwRTZzdCBhZlwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIsIGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJTZW5lc3RlIGtvbW1lbnRhclwiKSkpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy50aHJlYWRWaWV3cygpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQYWdpbmF0aW9uLCB7IHRvdGFsUGFnZXM6IHRvdGFsUGFnZXMsIHBhZ2U6IHBhZ2UsIHBhZ2VIYW5kbGU6IHRoaXMucGFnZUhhbmRsZSwgc2hvdzogdHJ1ZSB9KSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1Gb3JtLCB7IHNob3c6IHRoaXMuc3RhdGUubmV3UG9zdCwgY2xvc2U6IHRoaXMuY2xvc2UuYmluZCh0aGlzKSwgb25TdWJtaXQ6IHRoaXMuc3VibWl0LmJpbmQodGhpcykgfSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IEZvcnVtTGlzdCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEZvcnVtTGlzdENvbnRhaW5lcik7XHJcbmV4cG9ydCBkZWZhdWx0IEZvcnVtTGlzdDtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IE1lZGlhLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBDb21tZW50RGVsZXRlZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBsaWVzLCBjb25zdHJ1Y3QgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVwbHlOb2RlcyA9IHJlcGxpZXMubWFwKHJlcGx5ID0+IGNvbnN0cnVjdChyZXBseSkpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxlZnQsIHsgY2xhc3NOYW1lOiBcImNvbW1lbnQtZGVsZXRlZC1sZWZ0XCIgfSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtbXV0ZWQgY29tbWVudC1kZWxldGVkXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJyZW1vdmUtc2lnblwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiBLb21tZW50YXIgc2xldHRldFwiKSksXHJcbiAgICAgICAgICAgICAgICByZXBseU5vZGVzKSk7XHJcbiAgICB9XHJcbn1cclxuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufTtcclxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IENvbW1lbnRDb250cm9scyB9IGZyb20gXCIuL0NvbW1lbnRDb250cm9sc1wiO1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gXCIuL0NvbW1lbnRQcm9maWxlXCI7XHJcbmltcG9ydCB7IGZvcm1hdFRleHQsIHRpbWVUZXh0IH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgYWdvKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdGVkT24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHRpbWVUZXh0KHBvc3RlZE9uKTtcclxuICAgIH1cclxuICAgIGVkaXRlZFZpZXcoZWRpdGVkKSB7XHJcbiAgICAgICAgaWYgKCFlZGl0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBcIipcIik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCBjb250ZXh0SWQsIG5hbWUsIHRleHQsIGNvbW1lbnRJZCwgcmVwbGllcywgY29uc3RydWN0LCBhdXRob3JJZCwgZWRpdGVkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQsIHJlcGx5Q29tbWVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHsgc2tpcCwgdGFrZSwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQsIHJlcGx5Q29tbWVudCB9O1xyXG4gICAgICAgIGNvbnN0IHR4dCA9IGZvcm1hdFRleHQodGV4dCk7XHJcbiAgICAgICAgY29uc3QgcmVwbHlOb2RlcyA9IHJlcGxpZXMubWFwKHJlcGx5ID0+IGNvbnN0cnVjdChyZXBseSkpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRQcm9maWxlLCBudWxsKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5Cb2R5LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg1XCIsIHsgY2xhc3NOYW1lOiBcIm1lZGlhLWhlYWRpbmdcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgbmFtZSksXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2FnZGUgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWdvKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWRpdGVkVmlldyhlZGl0ZWQpKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB0eHQgfSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRDb250cm9scywgX19hc3NpZ24oeyBjb250ZXh0SWQ6IGNvbnRleHRJZCwgY2FuRWRpdDogY2FuRWRpdCwgYXV0aG9ySWQ6IGF1dGhvcklkLCBjb21tZW50SWQ6IGNvbW1lbnRJZCwgdGV4dDogdGV4dCB9LCBwcm9wcykpLFxyXG4gICAgICAgICAgICAgICAgcmVwbHlOb2RlcykpO1xyXG4gICAgfVxyXG59XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBDb21tZW50RGVsZXRlZCB9IGZyb20gXCIuL0NvbW1lbnREZWxldGVkXCI7XHJcbmltcG9ydCB7IENvbW1lbnQgfSBmcm9tIFwiLi9Db21tZW50XCI7XHJcbmltcG9ydCB7IE1lZGlhIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgQ29tbWVudExpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RDb21tZW50ID0gdGhpcy5jb25zdHJ1Y3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICByb290Q29tbWVudHMoY29tbWVudHMpIHtcclxuICAgICAgICBpZiAoIWNvbW1lbnRzKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gY29tbWVudHMubWFwKChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbnN0cnVjdENvbW1lbnQoY29tbWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3RJdGVtLCB7IGtleTogXCJyb290Q29tbWVudF9cIiArIGNvbW1lbnQuQ29tbWVudElEIH0sIG5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0Q29tbWVudChjb21tZW50KSB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0gXCJjb21tZW50SWRcIiArIGNvbW1lbnQuQ29tbWVudElEO1xyXG4gICAgICAgIGlmIChjb21tZW50LkRlbGV0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnREZWxldGVkLCB7IGtleToga2V5LCBjb25zdHJ1Y3Q6IHRoaXMuY29uc3RydWN0Q29tbWVudCwgcmVwbGllczogY29tbWVudC5SZXBsaWVzIH0pO1xyXG4gICAgICAgIGNvbnN0IHsgY29udGV4dElkLCBnZXROYW1lLCBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQsIHJlcGx5Q29tbWVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjb250cm9scyA9IHsgc2tpcCwgdGFrZSwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQsIHJlcGx5Q29tbWVudCB9O1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBnZXROYW1lKGNvbW1lbnQuQXV0aG9ySUQpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnQsIF9fYXNzaWduKHsga2V5OiBrZXksIGNvbnRleHRJZDogY29udGV4dElkLCBuYW1lOiBuYW1lLCBwb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbiwgYXV0aG9ySWQ6IGNvbW1lbnQuQXV0aG9ySUQsIHRleHQ6IGNvbW1lbnQuVGV4dCwgY29uc3RydWN0OiB0aGlzLmNvbnN0cnVjdENvbW1lbnQsIHJlcGxpZXM6IGNvbW1lbnQuUmVwbGllcywgZWRpdGVkOiBjb21tZW50LkVkaXRlZCwgY2FuRWRpdDogY2FuRWRpdCwgY29tbWVudElkOiBjb21tZW50LkNvbW1lbnRJRCB9LCBjb250cm9scykpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLnJvb3RDb21tZW50cyhjb21tZW50cyk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuTGlzdCwgbnVsbCwgbm9kZXMpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5leHBvcnQgY2xhc3MgQ29tbWVudEZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgVGV4dDogXCJcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wb3N0Q29tbWVudCA9IHRoaXMucG9zdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHBvc3RDb21tZW50KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgeyBwb3N0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHBvc3RIYW5kbGUodGhpcy5zdGF0ZS5UZXh0KTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGV4dDogXCJcIiB9KTtcclxuICAgIH1cclxuICAgIGhhbmRsZVRleHRDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUZXh0OiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwgeyBvblN1Ym1pdDogdGhpcy5wb3N0Q29tbWVudCB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgeyBodG1sRm9yOiBcInJlbWFya1wiIH0sIFwiS29tbWVudGFyXCIpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIiwgeyBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZVRleHRDaGFuZ2UsIHZhbHVlOiB0aGlzLnN0YXRlLlRleHQsIHBsYWNlaG9sZGVyOiBcIlNrcml2IGtvbW1lbnRhciBoZXIuLi5cIiwgaWQ6IFwicmVtYXJrXCIsIHJvd3M6IDQgfSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7IHR5cGU6IFwic3VibWl0XCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLXByaW1hcnlcIiB9LCBcIlNlbmRcIikpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmltcG9ydCB7IG9wdGlvbnMsIG5vcm1hbGl6ZUNvbW1lbnQsIHJlc3BvbnNlSGFuZGxlciB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuZXhwb3J0IGNvbnN0IHNldFNraXBDb21tZW50cyA9IChza2lwKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDM0LFxyXG4gICAgICAgIHBheWxvYWQ6IHNraXBcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0U2tpcCA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzVcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0VGFrZSA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzZcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRUYWtlQ29tbWVudHMgPSAodGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzNyxcclxuICAgICAgICBwYXlsb2FkOiB0YWtlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0Q3VycmVudFBhZ2UgPSAocGFnZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzOCxcclxuICAgICAgICBwYXlsb2FkOiBwYWdlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VG90YWxQYWdlcyA9ICh0b3RhbFBhZ2VzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDM5LFxyXG4gICAgICAgIHBheWxvYWQ6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0Q29tbWVudHMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDQwXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgcmVjZWl2ZWRDb21tZW50cyA9IChjb21tZW50cykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA0MSxcclxuICAgICAgICBwYXlsb2FkOiBjb21tZW50c1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGFkZENvbW1lbnQgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA0MixcclxuICAgICAgICBwYXlsb2FkOiBbY29tbWVudF1cclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRGb2N1c2VkQ29tbWVudCA9IChjb21tZW50SWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNDMsXHJcbiAgICAgICAgcGF5bG9hZDogY29tbWVudElkXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgbmV3Q29tbWVudEZyb21TZXJ2ZXIgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplID0gbm9ybWFsaXplQ29tbWVudChjb21tZW50KTtcclxuICAgIHJldHVybiBhZGRDb21tZW50KG5vcm1hbGl6ZSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaENvbW1lbnRzID0gKHVybCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYWdlQ29tbWVudHMgPSBkYXRhLkN1cnJlbnRJdGVtcztcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2tpcENvbW1lbnRzKHNraXApKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZUNvbW1lbnRzKHRha2UpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0Q3VycmVudFBhZ2UoZGF0YS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFBhZ2VzKGRhdGEuVG90YWxQYWdlcykpO1xyXG4gICAgICAgICAgICBjb25zdCBjb21tZW50cyA9IHBhZ2VDb21tZW50cy5tYXAobm9ybWFsaXplQ29tbWVudCk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVkQ29tbWVudHMoY29tbWVudHMpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBwb3N0Q29tbWVudCA9ICh1cmwsIGNvbnRleHRJZCwgdGV4dCwgcGFyZW50Q29tbWVudElkLCBjYikgPT4ge1xyXG4gICAgcmV0dXJuIChfKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIFRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgIENvbnRleHRJRDogY29udGV4dElkLFxyXG4gICAgICAgICAgICBQYXJlbnRJRDogcGFyZW50Q29tbWVudElkXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBib2R5OiBib2R5LFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZWRpdENvbW1lbnQgPSAodXJsLCBjb21tZW50SWQsIHRleHQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKF8pID0+IHtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgSUQ6IGNvbW1lbnRJZCwgVGV4dDogdGV4dCB9KSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUNvbW1lbnQgPSAodXJsLCBjYikgPT4ge1xyXG4gICAgcmV0dXJuIChfKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGNiKTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudCA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzfS9HZXRTaW5nbGU/aWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGMgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb21tZW50ID0gbm9ybWFsaXplQ29tbWVudChjKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVjZWl2ZWRDb21tZW50cyhbY29tbWVudF0pKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0Rm9jdXNlZENvbW1lbnQoY29tbWVudC5Db21tZW50SUQpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBDb21tZW50TGlzdCB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50TGlzdFwiO1xyXG5pbXBvcnQgeyBDb21tZW50Rm9ybSB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50Rm9ybVwiO1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSBcIi4uL3BhZ2luYXRpb24vUGFnaW5hdGlvblwiO1xyXG5pbXBvcnQgeyBmZXRjaENvbW1lbnRzLCBwb3N0Q29tbWVudCwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9jb21tZW50c1wiO1xyXG5pbXBvcnQgeyBnZXRGb3J1bUNvbW1lbnRzRGVsZXRlVXJsLCBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbW1lbnRzOiBzdGF0ZS5jb21tZW50c0luZm8uY29tbWVudHMsXHJcbiAgICAgICAgZ2V0TmFtZTogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnNbaWRdO1xyXG4gICAgICAgICAgICBpZiAoIXVzZXIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuIGAke3VzZXIuRmlyc3ROYW1lfSAke3VzZXIuTGFzdE5hbWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbkVkaXQ6IChpZCkgPT4gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQgPT09IGlkLFxyXG4gICAgICAgIHBvc3RJZDogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8uc2VsZWN0ZWRUaHJlYWQsXHJcbiAgICAgICAgcGFnZTogc3RhdGUuY29tbWVudHNJbmZvLnBhZ2UsXHJcbiAgICAgICAgc2tpcDogc3RhdGUuY29tbWVudHNJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUuY29tbWVudHNJbmZvLnRha2UsXHJcbiAgICAgICAgdG90YWxQYWdlczogc3RhdGUuY29tbWVudHNJbmZvLnRvdGFsUGFnZXMsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZWRpdEhhbmRsZTogKGNvbW1lbnRJZCwgXywgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGVkaXRDb21tZW50KHVybCwgY29tbWVudElkLCB0ZXh0LCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlOiAoY29tbWVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRGb3J1bUNvbW1lbnRzRGVsZXRlVXJsKGNvbW1lbnRJZCk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUNvbW1lbnQodXJsLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVwbHlIYW5kbGU6IChwb3N0SWQsIHRleHQsIHBhcmVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuZm9ydW1jb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBwb3N0SWQsIHRleHQsIHBhcmVudElkLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9hZENvbW1lbnRzOiAocG9zdElkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEZvcnVtQ29tbWVudHNQYWdlVXJsKHBvc3RJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0SGFuZGxlOiAocG9zdElkLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuZm9ydW1jb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBwb3N0SWQsIHRleHQsIG51bGwsIGNiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgRm9ydW1Db21tZW50c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQgPSB0aGlzLmRlbGV0ZUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmVkaXRDb21tZW50ID0gdGhpcy5lZGl0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlDb21tZW50ID0gdGhpcy5yZXBseUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnBvc3RDb21tZW50ID0gdGhpcy5wb3N0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucGFnZUhhbmRsZSA9IHRoaXMucGFnZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgcG9zdElkLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcGFnZSB9ID0gbmV4dFByb3BzLmxvY2F0aW9uLnF1ZXJ5O1xyXG4gICAgICAgIGlmICghTnVtYmVyKHBhZ2UpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2tpcFBhZ2VzID0gcGFnZSAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhwb3N0SWQsIHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcbiAgICBwYWdlSGFuZGxlKHRvKSB7XHJcbiAgICAgICAgY29uc3QgeyBwb3N0SWQsIHBhZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBpZiAocGFnZSA9PT0gdG8pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCB1cmwgPSBgL2ZvcnVtL3Bvc3QvJHtwb3N0SWR9L2NvbW1lbnRzP3BhZ2U9JHt0b31gO1xyXG4gICAgICAgIHB1c2godXJsKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBwb3N0SWQpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUhhbmRsZSwgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRlbGV0ZUhhbmRsZShjb21tZW50SWQsIGNiKTtcclxuICAgIH1cclxuICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgcG9zdElkLCB0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0SGFuZGxlLCBsb2FkQ29tbWVudHMsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZWRpdEhhbmRsZShjb21tZW50SWQsIHBvc3RJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG4gICAgcmVwbHlDb21tZW50KHBvc3RJZCwgdGV4dCwgcGFyZW50SWQpIHtcclxuICAgICAgICBjb25zdCB7IHJlcGx5SGFuZGxlLCBsb2FkQ29tbWVudHMsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVwbHlIYW5kbGUocG9zdElkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpO1xyXG4gICAgfVxyXG4gICAgcG9zdENvbW1lbnQodGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBwb3N0SWQsIHNraXAsIHRha2UsIHBvc3RIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcG9zdEhhbmRsZShwb3N0SWQsIHRleHQsIGNiKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRzLCBnZXROYW1lLCBjYW5FZGl0LCB0b3RhbFBhZ2VzLCBwYWdlLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xzID0ge1xyXG4gICAgICAgICAgICBza2lwLFxyXG4gICAgICAgICAgICB0YWtlLFxyXG4gICAgICAgICAgICBkZWxldGVDb21tZW50OiB0aGlzLmRlbGV0ZUNvbW1lbnQsXHJcbiAgICAgICAgICAgIGVkaXRDb21tZW50OiB0aGlzLmVkaXRDb21tZW50LFxyXG4gICAgICAgICAgICByZXBseUNvbW1lbnQ6IHRoaXMucmVwbHlDb21tZW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsgY2xhc3NOYW1lOiBcImZvcnVtLWNvbW1lbnRzLWxpc3RcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDRcIiwgeyBjbGFzc05hbWU6IFwiZm9ydW0tY29tbWVudHMtaGVhZGluZ1wiIH0sIFwiS29tbWVudGFyZXJcIiksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudExpc3QsIF9fYXNzaWduKHsgY29tbWVudHM6IGNvbW1lbnRzLCBjb250ZXh0SWQ6IE51bWJlcihpZCksIGdldE5hbWU6IGdldE5hbWUsIGNhbkVkaXQ6IGNhbkVkaXQgfSwgY29udHJvbHMpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQYWdpbmF0aW9uLCB7IHRvdGFsUGFnZXM6IHRvdGFsUGFnZXMsIHBhZ2U6IHBhZ2UsIHBhZ2VIYW5kbGU6IHRoaXMucGFnZUhhbmRsZSB9KSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMTIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50Rm9ybSwgeyBwb3N0SGFuZGxlOiB0aGlzLnBvc3RDb21tZW50IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSkpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBGb3J1bUNvbW1lbnRzQ29udGFpbmVyUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShGb3J1bUNvbW1lbnRzQ29udGFpbmVyKTtcclxuY29uc3QgRm9ydW1Db21tZW50cyA9IHdpdGhSb3V0ZXIoRm9ydW1Db21tZW50c0NvbnRhaW5lclJlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgRm9ydW1Db21tZW50cztcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBQYW5lbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGZpcnN0TmFtZSwgbGFzdE5hbWUsIGVtYWlsIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGVtYWlsTGluayA9IFwibWFpbHRvOlwiICsgZW1haWw7XHJcbiAgICAgICAgY29uc3QgZ2FsbGVyeSA9IFwiL1wiICsgdXNlcm5hbWUgKyBcIi9nYWxsZXJ5XCI7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAzIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFuZWwsIHsgaGVhZGVyOiBgJHtmaXJzdE5hbWV9ICR7bGFzdE5hbWV9YCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVc2VySXRlbSwgeyB0aXRsZTogXCJCcnVnZXJuYXZuXCIgfSwgdXNlcm5hbWUpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVc2VySXRlbSwgeyB0aXRsZTogXCJFbWFpbFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwgeyBocmVmOiBlbWFpbExpbmsgfSwgZW1haWwpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckl0ZW0sIHsgdGl0bGU6IFwiQmlsbGVkZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogZ2FsbGVyeSB9LCBcIkJpbGxlZGVyXCIpKSkpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIFVzZXJIZWFkaW5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDYgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCB0aGlzLnByb3BzLmNoaWxkcmVuKSk7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgVXNlckJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNiB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBVc2VySXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckhlYWRpbmcsIG51bGwsIHRpdGxlKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVc2VyQm9keSwgbnVsbCwgdGhpcy5wcm9wcy5jaGlsZHJlbikpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4vVXNlclwiO1xyXG5pbXBvcnQgeyBSb3cgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBVc2VyTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICB1c2VyTm9kZXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VycyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gdXNlcnMubWFwKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJJZCA9IGB1c2VySWRfJHt1c2VyLklEfWA7XHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXIsIHsgdXNlcm5hbWU6IHVzZXIuVXNlcm5hbWUsIHVzZXJJZDogdXNlci5JRCwgZmlyc3ROYW1lOiB1c2VyLkZpcnN0TmFtZSwgbGFzdE5hbWU6IHVzZXIuTGFzdE5hbWUsIGVtYWlsOiB1c2VyLkVtYWlsLCBwcm9maWxlVXJsOiB1c2VyLlByb2ZpbGVJbWFnZSwgcm9sZXM6IHVzZXIuUm9sZSwga2V5OiB1c2VySWQgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLCB0aGlzLnVzZXJOb2RlcygpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgTGluayB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuZXhwb3J0IGNsYXNzIEJyZWFkY3J1bWIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwib2xcIiwgeyBjbGFzc05hbWU6IFwiYnJlYWRjcnVtYlwiIH0sIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbihmdW5jdGlvbiAoQnJlYWRjcnVtYikge1xyXG4gICAgY2xhc3MgSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICAgICAgcmVuZGVyKCkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGhyZWYsIGFjdGl2ZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgaWYgKGFjdGl2ZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgeyBjbGFzc05hbWU6IFwiYWN0aXZlXCIgfSwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogaHJlZiB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgQnJlYWRjcnVtYi5JdGVtID0gSXRlbTtcclxufSkoQnJlYWRjcnVtYiB8fCAoQnJlYWRjcnVtYiA9IHt9KSk7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IGZldGNoVXNlcnMgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy91c2Vyc1wiO1xyXG5pbXBvcnQgeyBVc2VyTGlzdCB9IGZyb20gXCIuLi91c2Vycy9Vc2VyTGlzdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgUGFnZUhlYWRlciB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgQnJlYWRjcnVtYiB9IGZyb20gXCIuLi9icmVhZGNydW1icy9CcmVhZGNydW1iXCI7XHJcbmltcG9ydCB7IHZhbHVlcyB9IGZyb20gXCJ1bmRlcnNjb3JlXCI7XHJcbmNvbnN0IG1hcFVzZXJzVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2VyczogdmFsdWVzKHN0YXRlLnVzZXJzSW5mby51c2VycylcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRVc2VyczogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFVzZXJzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFVzZXJzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJCcnVnZXJlXCI7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VycyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIuSXRlbSwgeyBocmVmOiBcIi9cIiB9LCBcIkZvcnNpZGVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYi5JdGVtLCB7IGFjdGl2ZTogdHJ1ZSB9LCBcIkJydWdlcmVcIikpKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQYWdlSGVhZGVyLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiSW51cGxhbidzIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLCBcImJydWdlcmVcIikpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVc2VyTGlzdCwgeyB1c2VyczogdXNlcnMgfSkpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgVXNlcnMgPSBjb25uZWN0KG1hcFVzZXJzVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2Vyc0NvbnRhaW5lcik7XHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJzO1xyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgTGluayB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIEltYWdlIGFzIEltYWdlQnMgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBJbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmNoZWNrYm94SGFuZGxlciA9IHRoaXMuY2hlY2tib3hIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjaGVja2JveEhhbmRsZXIoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYWRkID0gZS5jdXJyZW50VGFyZ2V0LmNoZWNrZWQ7XHJcbiAgICAgICAgaWYgKGFkZCkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGFkZFNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgeyByZW1vdmVTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb21tZW50SWNvbihjb3VudCkge1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gY291bnQgPT09IDAgPyBcImNvbC1sZy02IHRleHQtbXV0ZWRcIiA6IFwiY29sLWxnLTYgdGV4dC1wcmltYXJ5XCI7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogc3R5bGVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIF9fYXNzaWduKHt9LCBwcm9wcyksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcImdseXBoaWNvbiBnbHlwaGljb24tY29tbWVudFwiLCBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwiIH0pLFxyXG4gICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgY291bnQpO1xyXG4gICAgfVxyXG4gICAgY2hlY2tib3hWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkLCBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjaGVja2VkID0gaW1hZ2VJc1NlbGVjdGVkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIHJldHVybiAoY2FuRWRpdCA/XHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA2LCBjbGFzc05hbWU6IFwicHVsbC1yaWdodCB0ZXh0LXJpZ2h0XCIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiU2xldCBcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwgeyB0eXBlOiBcImNoZWNrYm94XCIsIG9uQ2xpY2s6IHRoaXMuY2hlY2tib3hIYW5kbGVyLCBjaGVja2VkOiBjaGVja2VkIH0pKSlcclxuICAgICAgICAgICAgOiBudWxsKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjb3VudCA9IGltYWdlLkNvbW1lbnRDb3VudDtcclxuICAgICAgICBjb25zdCB1cmwgPSBgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZS5JbWFnZUlEfS9jb21tZW50c2A7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7IHRvOiB1cmwgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2VCcywgeyBzcmM6IGltYWdlLlByZXZpZXdVcmwsIHRodW1ibmFpbDogdHJ1ZSB9KSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7IHRvOiB1cmwgfSwgdGhpcy5jb21tZW50SWNvbihjb3VudCkpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja2JveFZpZXcoKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBJbWFnZSB9IGZyb20gXCIuL0ltYWdlXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5jb25zdCBlbGVtZW50c1BlclJvdyA9IDQ7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltYWdlTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBhcnJhbmdlQXJyYXkoaW1hZ2VzKSB7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gaW1hZ2VzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCB0aW1lcyA9IE1hdGguY2VpbChsZW5ndGggLyBlbGVtZW50c1BlclJvdyk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGxldCBzdGFydCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aW1lczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0ID0gaSAqIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZW5kID4gbGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAobGFzdCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gaW1hZ2VzLnNsaWNlKHN0YXJ0KTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBpbWFnZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBpbWFnZXNWaWV3KGltYWdlcykge1xyXG4gICAgICAgIGlmIChpbWFnZXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCB7IGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBjYW5FZGl0LCBpbWFnZUlzU2VsZWN0ZWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYXJyYW5nZUFycmF5KGltYWdlcyk7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHJlc3VsdC5tYXAoKHJvdywgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpbWdzID0gcm93Lm1hcCgoaW1nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDMsIGtleTogaW1nLkltYWdlSUQgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlLCB7IGltYWdlOiBpbWcsIGNhbkVkaXQ6IGNhbkVkaXQsIGFkZFNlbGVjdGVkSW1hZ2VJZDogYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQ6IHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCwgaW1hZ2VJc1NlbGVjdGVkOiBpbWFnZUlzU2VsZWN0ZWQsIHVzZXJuYW1lOiB1c2VybmFtZSB9KSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCByb3dJZCA9IFwicm93SWRcIiArIGk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBrZXk6IHJvd0lkIH0sIGltZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB2aWV3O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCwgdGhpcy5pbWFnZXNWaWV3KGltYWdlcykpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IHVwbG9hZEltYWdlLCBhZGRTZWxlY3RlZEltYWdlSWQsIGRlbGV0ZUltYWdlcywgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBjbGVhclNlbGVjdGVkSW1hZ2VJZHMsIGZldGNoVXNlckltYWdlcyB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2ltYWdlc1wiO1xyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZCB9IGZyb20gXCIuLi9pbWFnZXMvSW1hZ2VVcGxvYWRcIjtcclxuaW1wb3J0IEltYWdlTGlzdCBmcm9tIFwiLi4vaW1hZ2VzL0ltYWdlTGlzdFwiO1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSBcInVuZGVyc2NvcmVcIjtcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIEJ1dHRvbiB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgQnJlYWRjcnVtYiB9IGZyb20gXCIuLi9icmVhZGNydW1icy9CcmVhZGNydW1iXCI7XHJcbmltcG9ydCB7IHZhbHVlcyB9IGZyb20gXCJ1bmRlcnNjb3JlXCI7XHJcbmltcG9ydCBVc2VkU3BhY2UgZnJvbSBcIi4vVXNlZFNwYWNlXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBvd25lcklkIH0gPSBzdGF0ZS5pbWFnZXNJbmZvO1xyXG4gICAgY29uc3QgY3VycmVudElkID0gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQ7XHJcbiAgICBjb25zdCBjYW5FZGl0ID0gKG93bmVySWQgPiAwICYmIGN1cnJlbnRJZCA+IDAgJiYgb3duZXJJZCA9PT0gY3VycmVudElkKTtcclxuICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnNbb3duZXJJZF07XHJcbiAgICBjb25zdCBmdWxsTmFtZSA9IHVzZXIgPyBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWAgOiBcIlwiO1xyXG4gICAgY29uc3QgaW1hZ2VzID0gdmFsdWVzKHN0YXRlLmltYWdlc0luZm8uaW1hZ2VzKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW1hZ2VzOiBpbWFnZXMsXHJcbiAgICAgICAgY2FuRWRpdDogY2FuRWRpdCxcclxuICAgICAgICBzZWxlY3RlZEltYWdlSWRzOiBzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZHMsXHJcbiAgICAgICAgZnVsbE5hbWU6IGZ1bGxOYW1lLFxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwbG9hZEltYWdlOiAodXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaCh1cGxvYWRJbWFnZSh1c2VybmFtZSwgZGVzY3JpcHRpb24sIGZvcm1EYXRhLCAoKSA9PiB7IGRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpOyB9LCAoKSA9PiB7IH0pKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFkZFNlbGVjdGVkSW1hZ2VJZChpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJbWFnZXM6ICh1c2VybmFtZSwgaWRzKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgaWRzKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGVhclNlbGVjdGVkSW1hZ2VJZHM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFVzZXJJbWFnZXNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZUlzU2VsZWN0ZWQgPSB0aGlzLmltYWdlSXNTZWxlY3RlZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMgPSB0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGVkID0gdGhpcy5jbGVhclNlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHJvdXRlciwgcm91dGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB1c2VybmFtZSArIFwiJ3MgYmlsbGVkZXJcIjtcclxuICAgICAgICByb3V0ZXIuc2V0Um91dGVMZWF2ZUhvb2socm91dGUsIHRoaXMuY2xlYXJTZWxlY3RlZCk7XHJcbiAgICB9XHJcbiAgICBjbGVhclNlbGVjdGVkKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xlYXJTZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgaW1hZ2VJc1NlbGVjdGVkKGNoZWNrSWQpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVzID0gZmluZChzZWxlY3RlZEltYWdlSWRzLCAoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkID09PSBjaGVja0lkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcbiAgICBkZWxldGVTZWxlY3RlZEltYWdlcygpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMsIGRlbGV0ZUltYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBkZWxldGVJbWFnZXModXNlcm5hbWUsIHNlbGVjdGVkSW1hZ2VJZHMpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZCgpO1xyXG4gICAgfVxyXG4gICAgdXBsb2FkVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIHVwbG9hZEltYWdlLCBzZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IGhhc0ltYWdlcyA9IHNlbGVjdGVkSW1hZ2VJZHMubGVuZ3RoID4gMDtcclxuICAgICAgICBpZiAoIWNhbkVkaXQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDcgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2VVcGxvYWQsIHsgdXBsb2FkSW1hZ2U6IHVwbG9hZEltYWdlLCB1c2VybmFtZTogdXNlcm5hbWUgfSxcclxuICAgICAgICAgICAgICAgICAgICBcIlxcdTAwQTBcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcImRhbmdlclwiLCBkaXNhYmxlZDogIWhhc0ltYWdlcywgb25DbGljazogdGhpcy5kZWxldGVTZWxlY3RlZEltYWdlcyB9LCBcIlNsZXQgbWFya2VyZXQgYmlsbGVkZXJcIikpKSk7XHJcbiAgICB9XHJcbiAgICB1cGxvYWRMaW1pdFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghY2FuRWRpdClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlZFNwYWNlLCBudWxsKSkpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VzLCBmdWxsTmFtZSwgY2FuRWRpdCwgYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLkl0ZW0sIHsgaHJlZjogXCIvXCIgfSwgXCJGb3JzaWRlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIuSXRlbSwgeyBhY3RpdmU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIncyBiaWxsZWRlclwiKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwidGV4dC1jYXBpdGFsaXplXCIgfSwgZnVsbE5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIidzIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic21hbGxcIiwgbnVsbCwgXCJiaWxsZWRlIGdhbGxlcmlcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlTGlzdCwgeyBpbWFnZXM6IGltYWdlcywgY2FuRWRpdDogY2FuRWRpdCwgYWRkU2VsZWN0ZWRJbWFnZUlkOiBhZGRTZWxlY3RlZEltYWdlSWQsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZDogcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBpbWFnZUlzU2VsZWN0ZWQ6IHRoaXMuaW1hZ2VJc1NlbGVjdGVkLCB1c2VybmFtZTogdXNlcm5hbWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRWaWV3KCkpKSxcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRMaW1pdFZpZXcoKSxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgVXNlckltYWdlc1JlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlckltYWdlc0NvbnRhaW5lcik7XHJcbmNvbnN0IFVzZXJJbWFnZXMgPSB3aXRoUm91dGVyKFVzZXJJbWFnZXNSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJJbWFnZXM7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBzZXRTZWxlY3RlZEltZywgZmV0Y2hTaW5nbGVJbWFnZSwgZGVsZXRlSW1hZ2UgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9pbWFnZXNcIjtcclxuaW1wb3J0IHsgc2V0U2tpcENvbW1lbnRzLCBzZXRUYWtlQ29tbWVudHMsIHNldEZvY3VzZWRDb21tZW50LCByZWNlaXZlZENvbW1lbnRzIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvY29tbWVudHNcIjtcclxuaW1wb3J0IHsgc2V0RXJyb3IgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9lcnJvclwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IE1vZGFsLCBJbWFnZSwgQnV0dG9uLCBCdXR0b25Ub29sYmFyLCBHbHlwaGljb24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3Qgb3duZXJJZCA9IHN0YXRlLmltYWdlc0luZm8ub3duZXJJZDtcclxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkO1xyXG4gICAgY29uc3QgY2FuRWRpdCA9IChvd25lcklkID4gMCAmJiBjdXJyZW50SWQgPiAwICYmIG93bmVySWQgPT09IGN1cnJlbnRJZCk7XHJcbiAgICBjb25zdCBnZXRJbWFnZSA9IChpZCkgPT4gc3RhdGUuaW1hZ2VzSW5mby5pbWFnZXNbaWRdO1xyXG4gICAgY29uc3QgaW1hZ2UgPSAoKSA9PiBnZXRJbWFnZShzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCk7XHJcbiAgICBjb25zdCBmaWxlbmFtZSA9ICgpID0+IHsgaWYgKGltYWdlKCkpXHJcbiAgICAgICAgcmV0dXJuIGltYWdlKCkuRmlsZW5hbWU7IHJldHVybiBcIlwiOyB9O1xyXG4gICAgY29uc3QgcHJldmlld1VybCA9ICgpID0+IHsgaWYgKGltYWdlKCkpXHJcbiAgICAgICAgcmV0dXJuIGltYWdlKCkuUHJldmlld1VybDsgcmV0dXJuIFwiXCI7IH07XHJcbiAgICBjb25zdCBleHRlbnNpb24gPSAoKSA9PiB7IGlmIChpbWFnZSgpKVxyXG4gICAgICAgIHJldHVybiBpbWFnZSgpLkV4dGVuc2lvbjsgcmV0dXJuIFwiXCI7IH07XHJcbiAgICBjb25zdCBvcmlnaW5hbFVybCA9ICgpID0+IHsgaWYgKGltYWdlKCkpXHJcbiAgICAgICAgcmV0dXJuIGltYWdlKCkuT3JpZ2luYWxVcmw7IHJldHVybiBcIlwiOyB9O1xyXG4gICAgY29uc3QgdXBsb2FkZWQgPSAoKSA9PiB7IGlmIChpbWFnZSgpKVxyXG4gICAgICAgIHJldHVybiBpbWFnZSgpLlVwbG9hZGVkOyByZXR1cm4gbmV3IERhdGUoKTsgfTtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gKCkgPT4geyBpZiAoaW1hZ2UoKSlcclxuICAgICAgICByZXR1cm4gaW1hZ2UoKS5EZXNjcmlwdGlvbjsgcmV0dXJuIFwiXCI7IH07XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNhbkVkaXQ6IGNhbkVkaXQsXHJcbiAgICAgICAgaGFzSW1hZ2U6ICgpID0+IEJvb2xlYW4oZ2V0SW1hZ2Uoc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWQpKSxcclxuICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWUoKSxcclxuICAgICAgICBwcmV2aWV3VXJsOiBwcmV2aWV3VXJsKCksXHJcbiAgICAgICAgZXh0ZW5zaW9uOiBleHRlbnNpb24oKSxcclxuICAgICAgICBvcmlnaW5hbFVybDogb3JpZ2luYWxVcmwoKSxcclxuICAgICAgICB1cGxvYWRlZDogdXBsb2FkZWQoKSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24oKVxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNldFNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXNlbGVjdEltYWdlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKHVuZGVmaW5lZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0RXJyb3I6IChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihlcnJvcikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmV0Y2hJbWFnZTogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoU2luZ2xlSW1hZ2UoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUltYWdlOiAoaWQsIHVzZXJuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUltYWdlKGlkLCB1c2VybmFtZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzZXRDb21tZW50czogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwQ29tbWVudHMoMCkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUYWtlQ29tbWVudHMoMTApKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0Rm9jdXNlZENvbW1lbnQoLTEpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVjZWl2ZWRDb21tZW50cyhbXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIE1vZGFsSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVJbWFnZUhhbmRsZXIgPSB0aGlzLmRlbGV0ZUltYWdlSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5zZWVBbGxDb21tZW50c1ZpZXcgPSB0aGlzLnNlZUFsbENvbW1lbnRzVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVsb2FkID0gdGhpcy5yZWxvYWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVzZWxlY3RJbWFnZSwgcmVzZXRDb21tZW50cyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG4gICAgICAgIGRlc2VsZWN0SW1hZ2UoKTtcclxuICAgICAgICBjb25zdCBnYWxsZXJ5VXJsID0gYC8ke3VzZXJuYW1lfS9nYWxsZXJ5YDtcclxuICAgICAgICByZXNldENvbW1lbnRzKCk7XHJcbiAgICAgICAgcHVzaChnYWxsZXJ5VXJsKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUltYWdlSGFuZGxlcigpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUltYWdlLCBzZXRTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBpZCwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGRlbGV0ZUltYWdlKE51bWJlcihpZCksIHVzZXJuYW1lKTtcclxuICAgICAgICBzZXRTZWxlY3RlZEltYWdlSWQoLTEpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlSW1hZ2VWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAoIWNhbkVkaXQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcImRhbmdlclwiLCBvbkNsaWNrOiB0aGlzLmRlbGV0ZUltYWdlSGFuZGxlciB9LCBcIlNsZXQgYmlsbGVkZVwiKTtcclxuICAgIH1cclxuICAgIHJlbG9hZCgpIHtcclxuICAgICAgICBjb25zdCB7IGlkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBjb25zdCBwYXRoID0gYC8ke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aWR9L2NvbW1lbnRzYDtcclxuICAgICAgICBwdXNoKHBhdGgpO1xyXG4gICAgfVxyXG4gICAgc2VlQWxsQ29tbWVudHNWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHNob3cgPSAhQm9vbGVhbih0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgICAgICBpZiAoIXNob3cpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IG9uQ2xpY2s6IHRoaXMucmVsb2FkIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJyZWZyZXNoXCIgfSksXHJcbiAgICAgICAgICAgICAgICBcIiBTZSBhbGxlIGtvbW1lbnRhcmVyP1wiKSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBmaWxlbmFtZSwgcHJldmlld1VybCwgZXh0ZW5zaW9uLCBvcmlnaW5hbFVybCwgdXBsb2FkZWQsIGhhc0ltYWdlLCBkZXNjcmlwdGlvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBzaG93ID0gaGFzSW1hZ2UoKTtcclxuICAgICAgICBjb25zdCBuYW1lID0gZmlsZW5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgICAgICBjb25zdCB1cGxvYWREYXRlID0gbW9tZW50KHVwbG9hZGVkKTtcclxuICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gXCJVcGxvYWRlZCBkLiBcIiArIHVwbG9hZERhdGUuZm9ybWF0KFwiRCBNTU0gWVlZWSBcIikgKyBcImtsLiBcIiArIHVwbG9hZERhdGUuZm9ybWF0KFwiSDptbVwiKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbCwgeyBzaG93OiBzaG93LCBvbkhpZGU6IHRoaXMuY2xvc2UsIGJzU2l6ZTogXCJsYXJnZVwiLCBhbmltYXRpb246IHRydWUgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5IZWFkZXIsIHsgY2xvc2VCdXR0b246IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuVGl0bGUsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic21hbGxcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIC0gXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlU3RyaW5nKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5Cb2R5LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwgeyBocmVmOiBvcmlnaW5hbFVybCwgdGFyZ2V0OiBcIl9ibGFua1wiLCByZWw6IFwibm9vcGVuZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2UsIHsgc3JjOiBwcmV2aWV3VXJsLCByZXNwb25zaXZlOiB0cnVlLCBjbGFzc05hbWU6IFwiY2VudGVyLWJsb2NrXCIgfSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpbWFnZS1zZWxlY3RlZC1kZXNjcmlwdGlvbnRleHRcIiB9LCBkZXNjcmlwdGlvbikpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkZvb3RlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VlQWxsQ29tbWVudHNWaWV3KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sYmFyLCB7IHN0eWxlOiB7IGZsb2F0OiBcInJpZ2h0XCIgfSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlSW1hZ2VWaWV3KCksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgb25DbGljazogdGhpcy5jbG9zZSB9LCBcIkx1a1wiKSkpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBTZWxlY3RlZEltYWdlUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShNb2RhbEltYWdlKTtcclxuY29uc3QgU2VsZWN0ZWRJbWFnZSA9IHdpdGhSb3V0ZXIoU2VsZWN0ZWRJbWFnZVJlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0ZWRJbWFnZTtcclxuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufTtcclxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IGZldGNoQ29tbWVudHMsIHBvc3RDb21tZW50LCBlZGl0Q29tbWVudCwgZGVsZXRlQ29tbWVudCB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2NvbW1lbnRzXCI7XHJcbmltcG9ydCB7IGluY3JlbWVudENvbW1lbnRDb3VudCwgZGVjcmVtZW50Q29tbWVudENvdW50IH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvaW1hZ2VzXCI7XHJcbmltcG9ydCB7IENvbW1lbnRMaXN0IH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRMaXN0XCI7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gXCIuLi9wYWdpbmF0aW9uL1BhZ2luYXRpb25cIjtcclxuaW1wb3J0IHsgQ29tbWVudEZvcm0gfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudEZvcm1cIjtcclxuaW1wb3J0IHsgZ2V0SW1hZ2VDb21tZW50c1BhZ2VVcmwsIGdldEltYWdlQ29tbWVudHNEZWxldGVVcmwgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2FuRWRpdDogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZCA9PT0gaWQsXHJcbiAgICAgICAgaW1hZ2VJZDogc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWQsXHJcbiAgICAgICAgc2tpcDogc3RhdGUuY29tbWVudHNJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUuY29tbWVudHNJbmZvLnRha2UsXHJcbiAgICAgICAgcGFnZTogc3RhdGUuY29tbWVudHNJbmZvLnBhZ2UsXHJcbiAgICAgICAgdG90YWxQYWdlczogc3RhdGUuY29tbWVudHNJbmZvLnRvdGFsUGFnZXMsXHJcbiAgICAgICAgY29tbWVudHM6IHN0YXRlLmNvbW1lbnRzSW5mby5jb21tZW50cyxcclxuICAgICAgICBnZXROYW1lOiAodXNlcklkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnNbdXNlcklkXTtcclxuICAgICAgICAgICAgY29uc3QgeyBGaXJzdE5hbWUsIExhc3ROYW1lIH0gPSB1c2VyO1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7Rmlyc3ROYW1lfSAke0xhc3ROYW1lfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvd25lcjogc3RhdGUudXNlcnNJbmZvLnVzZXJzW3N0YXRlLmltYWdlc0luZm8ub3duZXJJZF1cclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwb3N0SGFuZGxlOiAoaW1hZ2VJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgaW1hZ2VJZCwgdGV4dCwgbnVsbCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoQ29tbWVudHM6IChpbWFnZUlkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNQYWdlVXJsKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZWRpdEhhbmRsZTogKGNvbW1lbnRJZCwgXywgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGVkaXRDb21tZW50KHVybCwgY29tbWVudElkLCB0ZXh0LCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlOiAoY29tbWVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsKGNvbW1lbnRJZCk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUNvbW1lbnQodXJsLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVwbHlIYW5kbGU6IChpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbmNyZW1lbnRDb3VudDogKGltYWdlSWQpID0+IGRpc3BhdGNoKGluY3JlbWVudENvbW1lbnRDb3VudChpbWFnZUlkKSksXHJcbiAgICAgICAgZGVjcmVtZW50Q291bnQ6IChpbWFnZUlkKSA9PiBkaXNwYXRjaChkZWNyZW1lbnRDb21tZW50Q291bnQoaW1hZ2VJZCkpLFxyXG4gICAgICAgIGxvYWRDb21tZW50czogKGltYWdlSWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VDb21tZW50c1BhZ2VVcmwoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgQ29tbWVudHNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5wYWdlSGFuZGxlID0gdGhpcy5wYWdlSGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDb21tZW50ID0gdGhpcy5kZWxldGVDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5lZGl0Q29tbWVudCA9IHRoaXMuZWRpdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlcGx5Q29tbWVudCA9IHRoaXMucmVwbHlDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5wb3N0Q29tbWVudCA9IHRoaXMucG9zdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgeyBmZXRjaENvbW1lbnRzLCBpbWFnZUlkLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcGFnZSB9ID0gbmV4dFByb3BzLmxvY2F0aW9uLnF1ZXJ5O1xyXG4gICAgICAgIGlmICghTnVtYmVyKHBhZ2UpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2tpcFBhZ2VzID0gcGFnZSAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcEl0ZW1zLCB0YWtlKTtcclxuICAgIH1cclxuICAgIHBhZ2VIYW5kbGUodG8pIHtcclxuICAgICAgICBjb25zdCB7IG93bmVyLCBpbWFnZUlkLCBwYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWUgPSBvd25lci5Vc2VybmFtZTtcclxuICAgICAgICBpZiAocGFnZSA9PT0gdG8pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCB1cmwgPSBgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZUlkfS9jb21tZW50cz9wYWdlPSR7dG99YDtcclxuICAgICAgICBwdXNoKHVybCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGVDb21tZW50KGNvbW1lbnRJZCwgaW1hZ2VJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVsZXRlSGFuZGxlLCBsb2FkQ29tbWVudHMsIGRlY3JlbWVudENvdW50LCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBkZWNyZW1lbnRDb3VudChpbWFnZUlkKTtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGVsZXRlSGFuZGxlKGNvbW1lbnRJZCwgY2IpO1xyXG4gICAgfVxyXG4gICAgZWRpdENvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkLCB0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIHNraXAsIHRha2UsIGVkaXRIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgZWRpdEhhbmRsZShjb21tZW50SWQsIGltYWdlSWQsIHRleHQsIGNiKTtcclxuICAgIH1cclxuICAgIHJlcGx5Q29tbWVudChpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBpbmNyZW1lbnRDb3VudCwgc2tpcCwgdGFrZSwgcmVwbHlIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGluY3JlbWVudENvdW50KGltYWdlSWQpO1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXBseUhhbmRsZShpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpO1xyXG4gICAgfVxyXG4gICAgcG9zdENvbW1lbnQodGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VJZCwgbG9hZENvbW1lbnRzLCBpbmNyZW1lbnRDb3VudCwgc2tpcCwgdGFrZSwgcG9zdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgaW5jcmVtZW50Q291bnQoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHBvc3RIYW5kbGUoaW1hZ2VJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgY29tbWVudHMsIGdldE5hbWUsIGltYWdlSWQsIHBhZ2UsIHRvdGFsUGFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xzID0ge1xyXG4gICAgICAgICAgICBza2lwLFxyXG4gICAgICAgICAgICB0YWtlLFxyXG4gICAgICAgICAgICBkZWxldGVDb21tZW50OiB0aGlzLmRlbGV0ZUNvbW1lbnQsXHJcbiAgICAgICAgICAgIGVkaXRDb21tZW50OiB0aGlzLmVkaXRDb21tZW50LFxyXG4gICAgICAgICAgICByZXBseUNvbW1lbnQ6IHRoaXMucmVwbHlDb21tZW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LWxlZnRcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAxLCBsZzogMTEgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRMaXN0LCBfX2Fzc2lnbih7IGNvbnRleHRJZDogaW1hZ2VJZCwgY29tbWVudHM6IGNvbW1lbnRzLCBnZXROYW1lOiBnZXROYW1lLCBjYW5FZGl0OiBjYW5FZGl0IH0sIGNvbnRyb2xzKSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMSwgbGc6IDEwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQYWdpbmF0aW9uLCB7IHRvdGFsUGFnZXM6IHRvdGFsUGFnZXMsIHBhZ2U6IHBhZ2UsIHBhZ2VIYW5kbGU6IHRoaXMucGFnZUhhbmRsZSB9KSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDEsIGxnOiAxMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudEZvcm0sIHsgcG9zdEhhbmRsZTogdGhpcy5wb3N0Q29tbWVudCB9KSkpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBDb21tZW50c1JlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoQ29tbWVudHNDb250YWluZXIpO1xyXG5jb25zdCBJbWFnZUNvbW1lbnRzID0gd2l0aFJvdXRlcihDb21tZW50c1JlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgSW1hZ2VDb21tZW50cztcclxuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufTtcclxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IENvbW1lbnQgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IFdlbGwsIEJ1dHRvbiwgR2x5cGhpY29uIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudCwgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvY29tbWVudHNcIjtcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuaW1wb3J0IHsgZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IGNvbW1lbnRzLCBmb2N1c2VkQ29tbWVudCB9ID0gc3RhdGUuY29tbWVudHNJbmZvO1xyXG4gICAgY29uc3QgeyB1c2VycyB9ID0gc3RhdGUudXNlcnNJbmZvO1xyXG4gICAgY29uc3QgeyBvd25lcklkLCBzZWxlY3RlZEltYWdlSWQgfSA9IHN0YXRlLmltYWdlc0luZm87XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldE5hbWU6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhdXRob3IgPSB1c2Vyc1tpZF07XHJcbiAgICAgICAgICAgIHJldHVybiBgJHthdXRob3IuRmlyc3ROYW1lfSAke2F1dGhvci5MYXN0TmFtZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9jdXNlZElkOiBmb2N1c2VkQ29tbWVudCxcclxuICAgICAgICBmb2N1c2VkOiBjb21tZW50c1swXSxcclxuICAgICAgICBpbWFnZUlkOiBzZWxlY3RlZEltYWdlSWQsXHJcbiAgICAgICAgaW1hZ2VPd25lcjogdXNlcnNbb3duZXJJZF0uVXNlcm5hbWUsXHJcbiAgICAgICAgY2FuRWRpdDogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZCA9PT0gaWQsXHJcbiAgICAgICAgc2tpcDogc3RhdGUuY29tbWVudHNJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUuY29tbWVudHNJbmZvLnRha2UsXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZWRpdEhhbmRsZTogKGNvbW1lbnRJZCwgXywgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGVkaXRDb21tZW50KHVybCwgY29tbWVudElkLCB0ZXh0LCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlOiAoY29tbWVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsKGNvbW1lbnRJZCk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUNvbW1lbnQodXJsLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVwbHlIYW5kbGU6IChpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb2N1c0NvbW1lbnQ6IChpZCkgPT4gZGlzcGF0Y2goZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQoaWQpKVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgU2luZ2xlQ29tbWVudFJlZHV4IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuYWxsQ29tbWVudHMgPSB0aGlzLmFsbENvbW1lbnRzLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDb21tZW50ID0gdGhpcy5kZWxldGVDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5lZGl0Q29tbWVudCA9IHRoaXMuZWRpdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlcGx5Q29tbWVudCA9IHRoaXMucmVwbHlDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBhbGxDb21tZW50cygpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIGltYWdlT3duZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBjb25zdCBwYXRoID0gYC8ke2ltYWdlT3duZXJ9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZUlkfS9jb21tZW50c2A7XHJcbiAgICAgICAgcHVzaChwYXRoKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBfKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZGVsZXRlSGFuZGxlKGNvbW1lbnRJZCwgdGhpcy5hbGxDb21tZW50cyk7XHJcbiAgICB9XHJcbiAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIGNvbnRleHRJZCwgdGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdEhhbmRsZSwgZm9jdXNDb21tZW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4gZm9jdXNDb21tZW50KGNvbW1lbnRJZCk7XHJcbiAgICAgICAgZWRpdEhhbmRsZShjb21tZW50SWQsIGNvbnRleHRJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG4gICAgcmVwbHlDb21tZW50KGNvbnRleHRJZCwgdGV4dCwgcGFyZW50SWQpIHtcclxuICAgICAgICBjb25zdCB7IHJlcGx5SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJlcGx5SGFuZGxlKGNvbnRleHRJZCwgdGV4dCwgcGFyZW50SWQsIHRoaXMuYWxsQ29tbWVudHMpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZm9jdXNlZElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmIChmb2N1c2VkSWQgPCAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCB7IFRleHQsIEF1dGhvcklELCBDb21tZW50SUQsIFBvc3RlZE9uLCBFZGl0ZWQgfSA9IHRoaXMucHJvcHMuZm9jdXNlZDtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIGltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0ge1xyXG4gICAgICAgICAgICBza2lwLFxyXG4gICAgICAgICAgICB0YWtlLFxyXG4gICAgICAgICAgICBkZWxldGVDb21tZW50OiB0aGlzLmRlbGV0ZUNvbW1lbnQsXHJcbiAgICAgICAgICAgIGVkaXRDb21tZW50OiB0aGlzLmVkaXRDb21tZW50LFxyXG4gICAgICAgICAgICByZXBseUNvbW1lbnQ6IHRoaXMucmVwbHlDb21tZW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5wcm9wcy5nZXROYW1lKEF1dGhvcklEKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LWxlZnRcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFdlbGwsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnQsIF9fYXNzaWduKHsgY29udGV4dElkOiBpbWFnZUlkLCBuYW1lOiBuYW1lLCB0ZXh0OiBUZXh0LCBjb21tZW50SWQ6IENvbW1lbnRJRCwgcmVwbGllczogW10sIGNhbkVkaXQ6IGNhbkVkaXQsIGF1dGhvcklkOiBBdXRob3JJRCwgcG9zdGVkT246IFBvc3RlZE9uLCBlZGl0ZWQ6IEVkaXRlZCB9LCBwcm9wcykpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IG9uQ2xpY2s6IHRoaXMuYWxsQ29tbWVudHMgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicmVmcmVzaFwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiBTZSBhbGxlIGtvbW1lbnRhcmVyP1wiKSkpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBTaW5nbGVDb21tZW50Q29ubmVjdCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFNpbmdsZUNvbW1lbnRSZWR1eCk7XHJcbmNvbnN0IFNpbmdsZUltYWdlQ29tbWVudCA9IHdpdGhSb3V0ZXIoU2luZ2xlQ29tbWVudENvbm5lY3QpO1xyXG5leHBvcnQgZGVmYXVsdCBTaW5nbGVJbWFnZUNvbW1lbnQ7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgQnJlYWRjcnVtYiB9IGZyb20gXCIuLi9icmVhZGNydW1icy9CcmVhZGNydW1iXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFib3V0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJPbVwiO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYi5JdGVtLCB7IGhyZWY6IFwiL1wiIH0sIFwiRm9yc2lkZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLkl0ZW0sIHsgYWN0aXZlOiB0cnVlIH0sIFwiT21cIikpKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcIkRldHRlIGVyIGVuIHNpbmdsZSBwYWdlIGFwcGxpY2F0aW9uIVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICBcIlRla25vbG9naWVyIGJydWd0OlwiKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIlJlYWN0XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIlJlZHV4XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIlJlYWN0LUJvb3RzdHJhcFwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXCJSZWFjdFJvdXRlclwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXCJBc3AubmV0IENvcmUgUkMgMlwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXCJBc3AubmV0IFdlYiBBUEkgMlwiKSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuY29uc3QgdXNlcnMgPSAoc3RhdGUgPSB7fSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyMjpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBjdXJyZW50VXNlcklkID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMjA6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHVzZXJzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjdXJyZW50VXNlcklkLFxyXG4gICAgdXNlcnNcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHVzZXJzSW5mbztcclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmltcG9ydCB7IHB1dCwgdW5pb24gfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IGZpbHRlciwgb21pdCB9IGZyb20gXCJ1bmRlcnNjb3JlXCI7XHJcbmNvbnN0IG93bmVySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxMDpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGltYWdlcyA9IChzdGF0ZSA9IHt9LCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDEzOlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZSA9IGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHB1dChzdGF0ZSwgaW1hZ2UuSW1hZ2VJRCwgaW1hZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAxMTpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAxNDpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBhY3Rpb24ucGF5bG9hZC5JbWFnZUlEO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IG9taXQoc3RhdGUsIGlkLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIDE4OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGFjdGlvbi5wYXlsb2FkLkltYWdlSUQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZSA9IHN0YXRlW2lkXTtcclxuICAgICAgICAgICAgICAgIGltYWdlLkNvbW1lbnRDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcHV0KHN0YXRlLCBpZCwgaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgMTk6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYWN0aW9uLnBheWxvYWQuSW1hZ2VJRDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlID0gc3RhdGVbaWRdO1xyXG4gICAgICAgICAgICAgICAgaW1hZ2UuQ29tbWVudENvdW50LS07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwdXQoc3RhdGUsIGlkLCBpbWFnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHNlbGVjdGVkSW1hZ2VJZCA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDEyOlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxufTtcclxuY29uc3Qgc2VsZWN0ZWRJbWFnZUlkcyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDE1OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbaWRdLCAoaWQxLCBpZDIpID0+IGlkMSA9PT0gaWQyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgMTY6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIoc3RhdGUsIChpZCkgPT4gaWQgIT09IGFjdGlvbi5wYXlsb2FkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgMTc6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5jb25zdCBpbWFnZXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIG93bmVySWQsXHJcbiAgICBpbWFnZXMsXHJcbiAgICBzZWxlY3RlZEltYWdlSWQsXHJcbiAgICBzZWxlY3RlZEltYWdlSWRzXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBpbWFnZXNJbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuY29uc3QgY29tbWVudHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA0MTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IFtdO1xyXG4gICAgICAgIGNhc2UgNDI6XHJcbiAgICAgICAgICAgIHJldHVybiBbLi4uc3RhdGUsIGFjdGlvbi5wYXlsb2FkWzBdXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHNraXAgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDM0OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzNzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzg6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAxO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzk6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgZm9jdXNlZENvbW1lbnQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA0MzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IC0xO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgY29tbWVudHNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGNvbW1lbnRzLFxyXG4gICAgc2tpcCxcclxuICAgIHRha2UsXHJcbiAgICBwYWdlLFxyXG4gICAgdG90YWxQYWdlcyxcclxuICAgIGZvY3VzZWRDb21tZW50XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBjb21tZW50c0luZm87XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuY29uc3Qgc2tpcFRocmVhZHMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDI4OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0YWtlVGhyZWFkcyA9IChzdGF0ZSA9IDEwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDI5OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBwYWdlVGhyZWFkcyA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMjc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRvdGFsUGFnZXNUaHJlYWQgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDI2OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBzZWxlY3RlZFRocmVhZCA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDMwOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0aXRsZXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyNDpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKGFjdGlvbi5wYXlsb2FkLCBzdGF0ZSwgKHQxLCB0MikgPT4gdDEuSUQgPT09IHQyLklEKTtcclxuICAgICAgICBjYXNlIDI1OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBwb3N0Q29udGVudCA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzE6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRpdGxlc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdGl0bGVzLFxyXG4gICAgc2tpcDogc2tpcFRocmVhZHMsXHJcbiAgICB0YWtlOiB0YWtlVGhyZWFkcyxcclxuICAgIHBhZ2U6IHBhZ2VUaHJlYWRzLFxyXG4gICAgdG90YWxQYWdlczogdG90YWxQYWdlc1RocmVhZCxcclxuICAgIHNlbGVjdGVkVGhyZWFkXHJcbn0pO1xyXG5jb25zdCBmb3J1bUluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdGl0bGVzSW5mbyxcclxuICAgIHBvc3RDb250ZW50XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBmb3J1bUluZm87XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5leHBvcnQgY29uc3QgdGl0bGUgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCBcIlwiO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCBcIlwiO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgZXJyb3JJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHRpdGxlLFxyXG4gICAgbWVzc2FnZVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgZXJyb3JJbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuaW1wb3J0IGVycm9ySW5mbyBmcm9tIFwiLi9lcnJvckluZm9cIjtcclxuZXhwb3J0IGNvbnN0IGhhc0Vycm9yID0gKHN0YXRlID0gZmFsc2UsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBkb25lID0gKHN0YXRlID0gdHJ1ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgdXNlZFNwYWNla0IgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDMyOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgdG90YWxTcGFjZWtCID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzcGFjZUluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdXNlZFNwYWNla0IsXHJcbiAgICB0b3RhbFNwYWNla0JcclxufSk7XHJcbmNvbnN0IHN0YXR1c0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgaGFzRXJyb3IsXHJcbiAgICBlcnJvckluZm8sXHJcbiAgICBzcGFjZUluZm8sXHJcbiAgICBtZXNzYWdlLFxyXG4gICAgZG9uZVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgc3RhdHVzSW5mbztcclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmNvbnN0IHNraXAgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdGFrZSA9IChzdGF0ZSA9IDEwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAxMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHBhZ2UgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDg6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAxO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgOTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBpdGVtcyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHdoYXRzTmV3SW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBza2lwLFxyXG4gICAgdGFrZSxcclxuICAgIHBhZ2UsXHJcbiAgICB0b3RhbFBhZ2VzLFxyXG4gICAgaXRlbXNcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHdoYXRzTmV3SW5mbztcclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmltcG9ydCB1c2Vyc0luZm8gZnJvbSBcIi4vdXNlcnNJbmZvXCI7XHJcbmltcG9ydCBpbWFnZXNJbmZvIGZyb20gXCIuL2ltYWdlc0luZm9cIjtcclxuaW1wb3J0IGNvbW1lbnRzSW5mbyBmcm9tIFwiLi9jb21tZW50c0luZm9cIjtcclxuaW1wb3J0IGZvcnVtSW5mbyBmcm9tIFwiLi9mb3J1bUluZm9cIjtcclxuaW1wb3J0IHN0YXR1c0luZm8gZnJvbSBcIi4vc3RhdHVzSW5mb1wiO1xyXG5pbXBvcnQgd2hhdHNOZXdJbmZvIGZyb20gXCIuL3doYXRzTmV3SW5mb1wiO1xyXG5jb25zdCByb290UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB1c2Vyc0luZm8sXHJcbiAgICBpbWFnZXNJbmZvLFxyXG4gICAgY29tbWVudHNJbmZvLFxyXG4gICAgZm9ydW1JbmZvLFxyXG4gICAgc3RhdHVzSW5mbyxcclxuICAgIHdoYXRzTmV3SW5mb1xyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgcm9vdFJlZHVjZXI7XHJcbiIsImltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tIFwicmVkdXhcIjtcclxuaW1wb3J0IHRodW5rIGZyb20gXCJyZWR1eC10aHVua1wiO1xyXG5pbXBvcnQgcm9vdFJlZHVjZXIgZnJvbSBcIi4uL3JlZHVjZXJzL3Jvb3RcIjtcclxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShyb290UmVkdWNlciwgYXBwbHlNaWRkbGV3YXJlKHRodW5rKSk7XHJcbmV4cG9ydCBkZWZhdWx0IHN0b3JlO1xyXG4iLCJpbXBvcnQgc3RvcmUgZnJvbSBcIi4uL3N0b3JlL3N0b3JlXCI7XHJcbmltcG9ydCB7IGZldGNoTGF0ZXN0TmV3cyB9IGZyb20gXCIuLi9hY3Rpb25zL3doYXRzbmV3XCI7XHJcbmltcG9ydCB7IGZldGNoVGhyZWFkcywgZmV0Y2hQb3N0IH0gZnJvbSBcIi4uL2FjdGlvbnMvZm9ydW1cIjtcclxuaW1wb3J0IHsgZmV0Y2hDdXJyZW50VXNlciwgZmV0Y2hVc2VycyB9IGZyb20gXCIuLi9hY3Rpb25zL3VzZXJzXCI7XHJcbmltcG9ydCB7IGZldGNoVXNlckltYWdlcywgc2V0U2VsZWN0ZWRJbWcsIHNldEltYWdlT3duZXIgfSBmcm9tIFwiLi4vYWN0aW9ucy9pbWFnZXNcIjtcclxuaW1wb3J0IHsgZmV0Y2hDb21tZW50cywgc2V0U2tpcENvbW1lbnRzLCBzZXRUYWtlQ29tbWVudHMsIGZldGNoQW5kRm9jdXNTaW5nbGVDb21tZW50IH0gZnJvbSBcIi4uL2FjdGlvbnMvY29tbWVudHNcIjtcclxuaW1wb3J0IHsgZ2V0SW1hZ2VDb21tZW50c1BhZ2VVcmwsIGdldEZvcnVtQ29tbWVudHNQYWdlVXJsIH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBwb2x5ZmlsbCB9IGZyb20gXCJlczYtcHJvbWlzZVwiO1xyXG5pbXBvcnQgeyBwb2x5ZmlsbCBhcyBvYmplY3RQb2x5ZmlsbCB9IGZyb20gXCJlczYtb2JqZWN0LWFzc2lnblwiO1xyXG5leHBvcnQgY29uc3QgaW5pdCA9ICgpID0+IHtcclxuICAgIG9iamVjdFBvbHlmaWxsKCk7XHJcbiAgICBwb2x5ZmlsbCgpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hDdXJyZW50VXNlcihnbG9iYWxzLmN1cnJlbnRVc2VybmFtZSkpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hVc2VycygpKTtcclxuICAgIG1vbWVudC5sb2NhbGUoXCJkYVwiKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoV2hhdHNOZXcgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBnZXRMYXRlc3QgPSAoc2tpcCwgdGFrZSkgPT4gc3RvcmUuZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKTtcclxuICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS53aGF0c05ld0luZm87XHJcbiAgICBnZXRMYXRlc3Qoc2tpcCwgdGFrZSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaEZvcnVtID0gKF8pID0+IHtcclxuICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5mb3J1bUluZm8udGl0bGVzSW5mbztcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVGhyZWFkcyhza2lwLCB0YWtlKSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFNpbmdsZVBvc3QgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBuZXh0U3RhdGUucGFyYW1zO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hQb3N0KE51bWJlcihpZCkpKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNlbGVjdEltYWdlID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgaW1hZ2VJZCA9IE51bWJlcihuZXh0U3RhdGUucGFyYW1zLmlkKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKGltYWdlSWQpKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoSW1hZ2VzID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBuZXh0U3RhdGUucGFyYW1zLnVzZXJuYW1lO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goc2V0SW1hZ2VPd25lcih1c2VybmFtZSkpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRTa2lwQ29tbWVudHModW5kZWZpbmVkKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRUYWtlQ29tbWVudHModW5kZWZpbmVkKSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBsb2FkQ29tbWVudHMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBuZXh0U3RhdGUucGFyYW1zO1xyXG4gICAgY29uc3QgcGFnZSA9IE51bWJlcihuZXh0U3RhdGUubG9jYXRpb24ucXVlcnkucGFnZSk7XHJcbiAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VDb21tZW50c1BhZ2VVcmwoTnVtYmVyKGlkKSwgc2tpcCwgdGFrZSk7XHJcbiAgICBpZiAoIXBhZ2UpIHtcclxuICAgICAgICBzdG9yZS5kaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgc2tpcFBhZ2VzID0gcGFnZSAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwSXRlbXMsIHRha2UpKTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoQ29tbWVudCA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IGlkID0gTnVtYmVyKG5leHRTdGF0ZS5sb2NhdGlvbi5xdWVyeS5pZCk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudChpZCkpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hQb3N0Q29tbWVudHMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBuZXh0U3RhdGUucGFyYW1zO1xyXG4gICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuICAgIGNvbnN0IHVybCA9IGdldEZvcnVtQ29tbWVudHNQYWdlVXJsKE51bWJlcihpZCksIHNraXAsIHRha2UpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxufTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCAqIGFzIFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcclxuaW1wb3J0IE1haW4gZnJvbSBcIi4vY29tcG9uZW50cy9zaGVsbHMvTWFpblwiO1xyXG5pbXBvcnQgSG9tZSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvSG9tZVwiO1xyXG5pbXBvcnQgRm9ydW0gZnJvbSBcIi4vY29tcG9uZW50cy9zaGVsbHMvRm9ydW1cIjtcclxuaW1wb3J0IEZvcnVtTGlzdCBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1MaXN0XCI7XHJcbmltcG9ydCBGb3J1bVBvc3QgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL0ZvcnVtUG9zdFwiO1xyXG5pbXBvcnQgRm9ydW1Db21tZW50cyBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Db21tZW50c1wiO1xyXG5pbXBvcnQgVXNlcnMgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJzXCI7XHJcbmltcG9ydCBVc2VySW1hZ2VzIGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzXCI7XHJcbmltcG9ydCBTZWxlY3RlZEltYWdlIGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9TZWxlY3RlZEltYWdlXCI7XHJcbmltcG9ydCBJbWFnZUNvbW1lbnRzIGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9JbWFnZUNvbW1lbnRzXCI7XHJcbmltcG9ydCBTaW5nbGVJbWFnZUNvbW1lbnQgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL1NpbmdsZUltYWdlQ29tbWVudFwiO1xyXG5pbXBvcnQgQWJvdXQgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL0Fib3V0XCI7XHJcbmltcG9ydCBzdG9yZSBmcm9tIFwiLi9zdG9yZS9zdG9yZVwiO1xyXG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlLCBJbmRleFJvdXRlLCBicm93c2VySGlzdG9yeSB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IHsgaW5pdCwgZmV0Y2hGb3J1bSwgc2VsZWN0SW1hZ2UsIGZldGNoSW1hZ2VzLCBsb2FkQ29tbWVudHMsIGZldGNoQ29tbWVudCwgZmV0Y2hXaGF0c05ldywgZmV0Y2hTaW5nbGVQb3N0LCBmZXRjaFBvc3RDb21tZW50cyB9IGZyb20gXCIuL3V0aWxpdGllcy9vbnN0YXJ0dXBcIjtcclxuaW5pdCgpO1xyXG5SZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChQcm92aWRlciwgeyBzdG9yZTogc3RvcmUgfSxcclxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGVyLCB7IGhpc3Rvcnk6IGJyb3dzZXJIaXN0b3J5IH0sXHJcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcIi9cIiwgY29tcG9uZW50OiBNYWluIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5kZXhSb3V0ZSwgeyBjb21wb25lbnQ6IEhvbWUsIG9uRW50ZXI6IGZldGNoV2hhdHNOZXcgfSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJmb3J1bVwiLCBjb21wb25lbnQ6IEZvcnVtIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEluZGV4Um91dGUsIHsgY29tcG9uZW50OiBGb3J1bUxpc3QsIG9uRW50ZXI6IGZldGNoRm9ydW0gfSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwicG9zdC86aWRcIiwgY29tcG9uZW50OiBGb3J1bVBvc3QsIG9uRW50ZXI6IGZldGNoU2luZ2xlUG9zdCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJjb21tZW50c1wiLCBjb21wb25lbnQ6IEZvcnVtQ29tbWVudHMsIG9uRW50ZXI6IGZldGNoUG9zdENvbW1lbnRzIH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJ1c2Vyc1wiLCBjb21wb25lbnQ6IFVzZXJzIH0pLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiOnVzZXJuYW1lL2dhbGxlcnlcIiwgY29tcG9uZW50OiBVc2VySW1hZ2VzLCBvbkVudGVyOiBmZXRjaEltYWdlcyB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcImltYWdlLzppZFwiLCBjb21wb25lbnQ6IFNlbGVjdGVkSW1hZ2UsIG9uRW50ZXI6IHNlbGVjdEltYWdlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcImNvbW1lbnRzXCIsIGNvbXBvbmVudDogSW1hZ2VDb21tZW50cywgb25FbnRlcjogbG9hZENvbW1lbnRzIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJjb21tZW50XCIsIGNvbXBvbmVudDogU2luZ2xlSW1hZ2VDb21tZW50LCBvbkVudGVyOiBmZXRjaENvbW1lbnQgfSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcImFib3V0XCIsIGNvbXBvbmVudDogQWJvdXQgfSkpKSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKSk7XHJcbiJdLCJuYW1lcyI6WyJSb3ciLCJDb2wiLCJBbGVydCIsImNvbnN0IiwibGV0IiwiTGluayIsIkluZGV4TGluayIsIkdyaWQiLCJOYXZiYXIiLCJOYXYiLCJOYXZEcm9wZG93biIsIk1lbnVJdGVtIiwiY29ubmVjdCIsIm5vcm1hbGl6ZUltYWdlIiwibm9ybWFsaXplQ29tbWVudCIsIm5vcm1hbGl6ZSIsInN1cGVyIiwiRm9ybUNvbnRyb2wiLCJCdXR0b24iLCJHbHlwaGljb24iLCJtYXBTdGF0ZVRvUHJvcHMiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJQcm9ncmVzc0JhciIsIk1lZGlhIiwiSW1hZ2UiLCJUb29sdGlwIiwiT3ZlcmxheVRyaWdnZXIiLCJ0aGlzIiwiTW9kYWwiLCJGb3JtR3JvdXAiLCJDb250cm9sTGFiZWwiLCJCdXR0b25Hcm91cCIsIkJ1dHRvblRvb2xiYXIiLCJDb2xsYXBzZSIsInNldFRvdGFsUGFnZXMiLCJzZXRQYWdlIiwic2V0U2tpcCIsInNldFRha2UiLCJhcmd1bWVudHMiLCJmaW5kIiwiY29udGFpbnMiLCJ3aXRoUm91dGVyIiwiUGFnaW5hdGlvbiIsIlBhZ2luYXRpb25CcyIsIkp1bWJvdHJvbiIsIlBhbmVsIiwiX19hc3NpZ24iLCJ2YWx1ZXMiLCJQYWdlSGVhZGVyIiwiSW1hZ2VCcyIsInJvdyIsIldlbGwiLCJjb21iaW5lUmVkdWNlcnMiLCJvbWl0IiwiaWQiLCJpbWFnZSIsInJlc3VsdCIsImZpbHRlciIsIm1lc3NhZ2UiLCJza2lwIiwidGFrZSIsInBhZ2UiLCJ0b3RhbFBhZ2VzIiwiY3JlYXRlU3RvcmUiLCJhcHBseU1pZGRsZXdhcmUiLCJvYmplY3RQb2x5ZmlsbCIsInBvbHlmaWxsIiwiUHJvdmlkZXIiLCJSb3V0ZXIiLCJicm93c2VySGlzdG9yeSIsIlJvdXRlIiwiSW5kZXhSb3V0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sSUFBTSxLQUFLLEdBQXdCO0lBQUM7Ozs7Ozs7O0lBQUEsZ0JBQ3ZDLE1BQU0sc0JBQUc7UUFDTCxPQUFvQyxHQUFHLElBQUksQ0FB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