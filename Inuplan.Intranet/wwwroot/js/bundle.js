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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9jb250YWluZXJzL0Vycm9yLmpzIiwiLi4vdHMvZGlzdC9hY3Rpb25zL2Vycm9yLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3dyYXBwZXJzL0xpbmtzLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3NoZWxscy9NYWluLmpzIiwiLi4vdHMvZGlzdC91dGlsaXRpZXMvdXRpbHMuanMiLCIuLi90cy9kaXN0L3V0aWxpdGllcy9ub3JtYWxpemUuanMiLCIuLi90cy9kaXN0L2FjdGlvbnMvdXNlcnMuanMiLCIuLi90cy9kaXN0L2FjdGlvbnMvd2hhdHNuZXcuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvaW1hZ2VzL0ltYWdlVXBsb2FkLmpzIiwiLi4vdHMvZGlzdC9hY3Rpb25zL2ltYWdlcy5qcyIsIi4uL3RzL2Rpc3QvYWN0aW9ucy9zdGF0dXMuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9Vc2VkU3BhY2UuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdUb29sdGlwLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3SXRlbUltYWdlLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdGb3J1bVBvc3QuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdMaXN0LmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2ZvcnVtL0ZvcnVtRm9ybS5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50Q29udHJvbHMuanMiLCIuLi90cy9kaXN0L2FjdGlvbnMvZm9ydW0uanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bVBvc3QuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvcGFnaW5hdGlvbi9QYWdpbmF0aW9uLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvV2hhdHNOZXcuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9Ib21lLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3NoZWxscy9Gb3J1bS5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9mb3J1bS9Gb3J1bVRpdGxlLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1MaXN0LmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnREZWxldGVkLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnQuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudExpc3QuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudEZvcm0uanMiLCIuLi90cy9kaXN0L2FjdGlvbnMvY29tbWVudHMuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bUNvbW1lbnRzLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL3VzZXJzL1VzZXIuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvdXNlcnMvVXNlckxpc3QuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvYnJlYWRjcnVtYnMvQnJlYWRjcnVtYi5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJzLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VMaXN0LmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlckltYWdlcy5qcyIsIi4uL3RzL2Rpc3QvY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCIuLi90cy9kaXN0L2NvbXBvbmVudHMvY29udGFpbmVycy9JbWFnZUNvbW1lbnRzLmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvU2luZ2xlSW1hZ2VDb21tZW50LmpzIiwiLi4vdHMvZGlzdC9jb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCIuLi90cy9kaXN0L3JlZHVjZXJzL3VzZXJzSW5mby5qcyIsIi4uL3RzL2Rpc3QvcmVkdWNlcnMvaW1hZ2VzSW5mby5qcyIsIi4uL3RzL2Rpc3QvcmVkdWNlcnMvY29tbWVudHNJbmZvLmpzIiwiLi4vdHMvZGlzdC9yZWR1Y2Vycy9mb3J1bUluZm8uanMiLCIuLi90cy9kaXN0L3JlZHVjZXJzL2Vycm9ySW5mby5qcyIsIi4uL3RzL2Rpc3QvcmVkdWNlcnMvc3RhdHVzSW5mby5qcyIsIi4uL3RzL2Rpc3QvcmVkdWNlcnMvd2hhdHNOZXdJbmZvLmpzIiwiLi4vdHMvZGlzdC9yZWR1Y2Vycy9yb290LmpzIiwiLi4vdHMvZGlzdC9zdG9yZS9zdG9yZS5qcyIsIi4uL3RzL2Rpc3QvdXRpbGl0aWVzL29uc3RhcnR1cC5qcyIsIi4uL3RzL2Rpc3QvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQWxlcnQgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBFcnJvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjbGVhckVycm9yLCB0aXRsZSwgbWVzc2FnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBbGVydCwgeyBic1N0eWxlOiBcImRhbmdlclwiLCBvbkRpc21pc3M6IGNsZWFyRXJyb3IgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIHRpdGxlKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBtZXNzYWdlKSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY29uc3Qgc2V0SGFzRXJyb3IgPSAoaGFzRXJyb3IpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMCxcclxuICAgICAgICBwYXlsb2FkOiBoYXNFcnJvclxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEVycm9yVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMSxcclxuICAgICAgICBwYXlsb2FkOiB0aXRsZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3JUaXRsZSA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMlxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3JNZXNzYWdlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA0XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RXJyb3JNZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMyxcclxuICAgICAgICBwYXlsb2FkOiBtZXNzYWdlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChzZXRIYXNFcnJvcih0cnVlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JUaXRsZShlcnJvci50aXRsZSkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEVycm9yTWVzc2FnZShlcnJvci5tZXNzYWdlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3IgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvclRpdGxlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKGNsZWFyRXJyb3JNZXNzYWdlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKGZhbHNlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuZXhwb3J0IGNsYXNzIE5hdkxpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IHRoaXMuY29udGV4dC5yb3V0ZXIuaXNBY3RpdmUodGhpcy5wcm9wcy50bywgdHJ1ZSksIGNsYXNzTmFtZSA9IGlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IHRoaXMucHJvcHMudG8gfSwgdGhpcy5wcm9wcy5jaGlsZHJlbikpKTtcclxuICAgIH1cclxufVxyXG5OYXZMaW5rLmNvbnRleHRUeXBlcyA9IHtcclxuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxyXG59O1xyXG5leHBvcnQgY2xhc3MgSW5kZXhOYXZMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQgaXNBY3RpdmUgPSB0aGlzLmNvbnRleHQucm91dGVyLmlzQWN0aXZlKHRoaXMucHJvcHMudG8sIHRydWUpLCBjbGFzc05hbWUgPSBpc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcIlwiO1xyXG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbmRleExpbmssIHsgdG86IHRoaXMucHJvcHMudG8gfSwgdGhpcy5wcm9wcy5jaGlsZHJlbikpKTtcclxuICAgIH1cclxufVxyXG5JbmRleE5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IEdyaWQsIE5hdmJhciwgTmF2LCBOYXZEcm9wZG93biwgTWVudUl0ZW0gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IEVycm9yIH0gZnJvbSBcIi4uL2NvbnRhaW5lcnMvRXJyb3JcIjtcclxuaW1wb3J0IHsgY2xlYXJFcnJvciB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2Vycm9yXCI7XHJcbmltcG9ydCB7IE5hdkxpbmssIEluZGV4TmF2TGluayB9IGZyb20gXCIuLi93cmFwcGVycy9MaW5rc1wiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnNbc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWRdO1xyXG4gICAgY29uc3QgbmFtZSA9IHVzZXIgPyB1c2VyLlVzZXJuYW1lIDogXCJVc2VyXCI7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVzZXJuYW1lOiBuYW1lLFxyXG4gICAgICAgIGhhc0Vycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmhhc0Vycm9yLFxyXG4gICAgICAgIGVycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmVycm9ySW5mb1xyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNsZWFyRXJyb3I6ICgpID0+IGRpc3BhdGNoKGNsZWFyRXJyb3IoKSlcclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFNoZWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGVycm9yVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGhhc0Vycm9yLCBjbGVhckVycm9yLCBlcnJvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHRpdGxlLCBtZXNzYWdlIH0gPSBlcnJvcjtcclxuICAgICAgICBpZiAoIWhhc0Vycm9yKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChFcnJvciwgeyB0aXRsZTogdGl0bGUsIG1lc3NhZ2U6IG1lc3NhZ2UsIGNsZWFyRXJyb3I6IGNsZWFyRXJyb3IgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBlbXBsb3llZVVybCA9IGdsb2JhbHMudXJscy5lbXBsb3llZUhhbmRib29rO1xyXG4gICAgICAgIGNvbnN0IGM1U2VhcmNoVXJsID0gZ2xvYmFscy51cmxzLmM1U2VhcmNoO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEdyaWQsIHsgZmx1aWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZiYXIsIHsgZml4ZWRUb3A6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2YmFyLkhlYWRlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhci5CcmFuZCwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwgeyBocmVmOiBcImh0dHA6Ly9pbnRyYW5ldHNpZGVcIiwgY2xhc3NOYW1lOiBcIm5hdmJhci1icmFuZFwiIH0sIFwiSW51cGxhbiBJbnRyYW5ldFwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZiYXIuVG9nZ2xlLCBudWxsKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhci5Db2xsYXBzZSwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbmRleE5hdkxpbmssIHsgdG86IFwiL1wiIH0sIFwiRm9yc2lkZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXZMaW5rLCB7IHRvOiBcIi9mb3J1bVwiIH0sIFwiRm9ydW1cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2TGluaywgeyB0bzogXCIvdXNlcnNcIiB9LCBcIkJydWdlcmVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2TGluaywgeyB0bzogXCIvYWJvdXRcIiB9LCBcIk9tXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdmJhci5UZXh0LCB7IHB1bGxSaWdodDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkhlaiwgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOYXYsIHsgcHVsbFJpZ2h0OiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTmF2RHJvcGRvd24sIHsgZXZlbnRLZXk6IDUsIHRpdGxlOiBcIkxpbmtzXCIsIGlkOiBcImV4dGVybl9saW5rc1wiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lbnVJdGVtLCB7IGhyZWY6IGVtcGxveWVlVXJsLCBldmVudEtleTogNS4xIH0sIFwiTWVkYXJiZWpkZXIgaFxcdTAwRTVuZGJvZ1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVudUl0ZW0sIHsgaHJlZjogYzVTZWFyY2hVcmwsIGV2ZW50S2V5OiA1LjIgfSwgXCJDNSBTXFx1MDBGOGduaW5nXCIpKSkpKSxcclxuICAgICAgICAgICAgdGhpcy5lcnJvclZpZXcoKSxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgTWFpbiA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFNoZWxsKTtcclxuZXhwb3J0IGRlZmF1bHQgTWFpbjtcclxuIiwiaW1wb3J0IHsgc2V0RXJyb3IgfSBmcm9tIFwiLi4vYWN0aW9ucy9lcnJvclwiO1xyXG5pbXBvcnQgKiBhcyBtYXJrZWQgZnJvbSBcIm1hcmtlZFwiO1xyXG5pbXBvcnQgcmVtb3ZlTWQgZnJvbSBcInJlbW92ZS1tYXJrZG93blwiO1xyXG5leHBvcnQgY29uc3Qgb2JqTWFwID0gKGFyciwga2V5LCB2YWwpID0+IHtcclxuICAgIGNvbnN0IG9iaiA9IGFyci5yZWR1Y2UoKHJlcywgaXRlbSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGsgPSBrZXkoaXRlbSk7XHJcbiAgICAgICAgY29uc3QgdiA9IHZhbChpdGVtKTtcclxuICAgICAgICByZXNba10gPSB2O1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9LCB7fSk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG59O1xyXG5leHBvcnQgY29uc3QgcHV0ID0gKG9iaiwga2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgbGV0IGt2ID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqKTtcclxuICAgIGt2W2tleV0gPSB2YWx1ZTtcclxuICAgIHJldHVybiBrdjtcclxufTtcclxuZXhwb3J0IGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICBtb2RlOiBcImNvcnNcIixcclxuICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIlxyXG59O1xyXG5leHBvcnQgY29uc3QgcmVzcG9uc2VIYW5kbGVyID0gKGRpc3BhdGNoKSA9PiAob25TdWNjZXNzKSA9PiAocmVzcG9uc2UpID0+IHtcclxuICAgIGlmIChyZXNwb25zZS5vaylcclxuICAgICAgICByZXR1cm4gb25TdWNjZXNzKHJlc3BvbnNlKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgNDAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IoeyB0aXRsZTogXCI0MDAgQmFkIFJlcXVlc3RcIiwgbWVzc2FnZTogXCJUaGUgcmVxdWVzdCB3YXMgbm90IHdlbGwtZm9ybWVkXCIgfSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDA0OlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IoeyB0aXRsZTogXCI0MDQgTm90IEZvdW5kXCIsIG1lc3NhZ2U6IFwiQ291bGQgbm90IGZpbmQgcmVzb3VyY2VcIiB9KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0MDg6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcih7IHRpdGxlOiBcIjQwOCBSZXF1ZXN0IFRpbWVvdXRcIiwgbWVzc2FnZTogXCJUaGUgc2VydmVyIGRpZCBub3QgcmVzcG9uZCBpbiB0aW1lXCIgfSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNTAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IoeyB0aXRsZTogXCI1MDAgU2VydmVyIEVycm9yXCIsIG1lc3NhZ2U6IFwiU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgQVBJLXNlcnZlclwiIH0pKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IoeyB0aXRsZTogXCJPb3BzXCIsIG1lc3NhZ2U6IFwiU29tZXRoaW5nIHdlbnQgd3JvbmchXCIgfSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmV4cG9ydCBjb25zdCB1bmlvbiA9IChhcnIxLCBhcnIyLCBlcXVhbGl0eUZ1bmMpID0+IHtcclxuICAgIGxldCByZXN1bHQgPSBhcnIxLmNvbmNhdChhcnIyKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgcmVzdWx0Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChlcXVhbGl0eUZ1bmMocmVzdWx0W2ldLCByZXN1bHRbal0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuc3BsaWNlKGosIDEpO1xyXG4gICAgICAgICAgICAgICAgai0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuZXhwb3J0IGNvbnN0IHRpbWVUZXh0ID0gKHBvc3RlZE9uLCBleHBpcmUgPSAxMi41KSA9PiB7XHJcbiAgICBjb25zdCBhZ28gPSBtb21lbnQocG9zdGVkT24pLmZyb21Ob3coKTtcclxuICAgIGNvbnN0IGRpZmYgPSBtb21lbnQoKS5kaWZmKHBvc3RlZE9uLCBcImhvdXJzXCIsIHRydWUpO1xyXG4gICAgaWYgKGRpZmYgPj0gZXhwaXJlKSB7XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IG1vbWVudChwb3N0ZWRPbik7XHJcbiAgICAgICAgcmV0dXJuIGBkLiAke2RhdGUuZm9ybWF0KFwiRCBNTU0gWVlZWSBcIil9IGtsLiAke2RhdGUuZm9ybWF0KFwiSDptbVwiKX1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFwiZm9yIFwiICsgYWdvO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZm9ybWF0VGV4dCA9ICh0ZXh0KSA9PiB7XHJcbiAgICBpZiAoIXRleHQpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCByYXdNYXJrdXAgPSBtYXJrZWQodGV4dCwgeyBzYW5pdGl6ZTogdHJ1ZSB9KTtcclxuICAgIHJldHVybiB7IF9faHRtbDogcmF3TWFya3VwIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBnZXRXb3JkcyA9ICh0ZXh0LCBudW1iZXJPZldvcmRzKSA9PiB7XHJcbiAgICBpZiAoIXRleHQpXHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBwbGFpblRleHQgPSByZW1vdmVNZCh0ZXh0KTtcclxuICAgIHJldHVybiBwbGFpblRleHQuc3BsaXQoL1xccysvKS5zbGljZSgwLCBudW1iZXJPZldvcmRzKS5qb2luKFwiIFwiKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldEZ1bGxOYW1lID0gKHVzZXIsIG5vbmUgPSBcIlwiKSA9PiB7XHJcbiAgICBpZiAoIXVzZXIpXHJcbiAgICAgICAgcmV0dXJuIG5vbmU7XHJcbiAgICByZXR1cm4gYCR7dXNlci5GaXJzdE5hbWV9ICR7dXNlci5MYXN0TmFtZX1gO1xyXG59O1xyXG5leHBvcnQgY29uc3QgdmlzaXRDb21tZW50cyA9IChjb21tZW50cywgZnVuYykgPT4ge1xyXG4gICAgY29uc3QgZ2V0UmVwbGllcyA9IChjKSA9PiBjLlJlcGxpZXMgPyBjLlJlcGxpZXMgOiBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29tbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKGNvbW1lbnRzW2ldLCBnZXRSZXBsaWVzLCBmdW5jKTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IGRlcHRoRmlyc3RTZWFyY2ggPSAoY3VycmVudCwgZ2V0Q2hpbGRyZW4sIGZ1bmMpID0+IHtcclxuICAgIGZ1bmMoY3VycmVudCk7XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IGdldENoaWxkcmVuKGN1cnJlbnQpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRlcHRoRmlyc3RTZWFyY2goY2hpbGRyZW5baV0sIGdldENoaWxkcmVuLCBmdW5jKTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNvbW1lbnQgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgbGV0IHIgPSBjb21tZW50LlJlcGxpZXMgPyBjb21tZW50LlJlcGxpZXMgOiBbXTtcclxuICAgIGNvbnN0IHJlcGxpZXMgPSByLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgIGNvbnN0IGF1dGhvcklkID0gKGNvbW1lbnQuRGVsZXRlZCkgPyAtMSA6IGNvbW1lbnQuQXV0aG9yLklEO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBDb21tZW50SUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgICAgIERlbGV0ZWQ6IGNvbW1lbnQuRGVsZXRlZCxcclxuICAgICAgICBQb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbixcclxuICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgUmVwbGllczogcmVwbGllcyxcclxuICAgICAgICBFZGl0ZWQ6IGNvbW1lbnQuRWRpdGVkXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0Rm9ydW1Db21tZW50c0RlbGV0ZVVybCA9IChjb21tZW50SWQpID0+IHtcclxuICAgIHJldHVybiBgJHtnbG9iYWxzLnVybHMuZm9ydW1jb21tZW50c30/Y29tbWVudElkPSR7Y29tbWVudElkfWA7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybCA9IChwb3N0SWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgIHJldHVybiBgJHtnbG9iYWxzLnVybHMuZm9ydW1jb21tZW50c30/cG9zdElkPSR7cG9zdElkfSZza2lwPSR7c2tpcH0mdGFrZT0ke3Rha2V9YDtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldEltYWdlQ29tbWVudHNQYWdlVXJsID0gKGltYWdlSWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgIHJldHVybiBgJHtnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50c30/aW1hZ2VJZD0ke2ltYWdlSWR9JnNraXA9JHtza2lwfSZ0YWtlPSR7dGFrZX1gO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybCA9IChjb21tZW50SWQpID0+IHtcclxuICAgIHJldHVybiBgJHtnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50c30/Y29tbWVudElkPSR7Y29tbWVudElkfWA7XHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBub3JtYWxpemVMYXRlc3QgPSAobGF0ZXN0KSA9PiB7XHJcbiAgICBsZXQgaXRlbSA9IG51bGw7XHJcbiAgICBsZXQgYXV0aG9ySWQgPSAtMTtcclxuICAgIGlmIChsYXRlc3QuVHlwZSA9PT0gMSkge1xyXG4gICAgICAgIGNvbnN0IGltYWdlID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgRXh0ZW5zaW9uOiBpbWFnZS5FeHRlbnNpb24sXHJcbiAgICAgICAgICAgIEZpbGVuYW1lOiBpbWFnZS5GaWxlbmFtZSxcclxuICAgICAgICAgICAgSW1hZ2VJRDogaW1hZ2UuSW1hZ2VJRCxcclxuICAgICAgICAgICAgT3JpZ2luYWxVcmw6IGltYWdlLk9yaWdpbmFsVXJsLFxyXG4gICAgICAgICAgICBQcmV2aWV3VXJsOiBpbWFnZS5QcmV2aWV3VXJsLFxyXG4gICAgICAgICAgICBUaHVtYm5haWxVcmw6IGltYWdlLlRodW1ibmFpbFVybCxcclxuICAgICAgICAgICAgVXBsb2FkZWQ6IGltYWdlLlVwbG9hZGVkLFxyXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogaW1hZ2UuRGVzY3JpcHRpb25cclxuICAgICAgICB9O1xyXG4gICAgICAgIGF1dGhvcklkID0gaW1hZ2UuQXV0aG9yLklEO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobGF0ZXN0LlR5cGUgPT09IDIpIHtcclxuICAgICAgICBjb25zdCBjb21tZW50ID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgSUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogY29tbWVudC5JbWFnZUlELFxyXG4gICAgICAgICAgICBJbWFnZVVwbG9hZGVkQnk6IGNvbW1lbnQuSW1hZ2VVcGxvYWRlZEJ5LFxyXG4gICAgICAgICAgICBGaWxlbmFtZTogY29tbWVudC5GaWxlbmFtZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYXV0aG9ySWQgPSBjb21tZW50LkF1dGhvci5JRDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxhdGVzdC5UeXBlID09PSA0KSB7XHJcbiAgICAgICAgY29uc3QgcG9zdCA9IGxhdGVzdC5JdGVtO1xyXG4gICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIElEOiBwb3N0LlRocmVhZElELFxyXG4gICAgICAgICAgICBUaXRsZTogcG9zdC5IZWFkZXIuVGl0bGUsXHJcbiAgICAgICAgICAgIFRleHQ6IHBvc3QuVGV4dCxcclxuICAgICAgICAgICAgU3RpY2t5OiBwb3N0LkhlYWRlci5TdGlja3ksXHJcbiAgICAgICAgICAgIENvbW1lbnRDb3VudDogcG9zdC5IZWFkZXIuQ29tbWVudENvdW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICBhdXRob3JJZCA9IHBvc3QuSGVhZGVyLkF1dGhvci5JRDtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSUQ6IGxhdGVzdC5JRCxcclxuICAgICAgICBUeXBlOiBsYXRlc3QuVHlwZSxcclxuICAgICAgICBJdGVtOiBpdGVtLFxyXG4gICAgICAgIE9uOiBsYXRlc3QuT24sXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUltYWdlID0gKGltZykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBJbWFnZUlEOiBpbWcuSW1hZ2VJRCxcclxuICAgICAgICBGaWxlbmFtZTogaW1nLkZpbGVuYW1lLFxyXG4gICAgICAgIEV4dGVuc2lvbjogaW1nLkV4dGVuc2lvbixcclxuICAgICAgICBPcmlnaW5hbFVybDogaW1nLk9yaWdpbmFsVXJsLFxyXG4gICAgICAgIFByZXZpZXdVcmw6IGltZy5QcmV2aWV3VXJsLFxyXG4gICAgICAgIFRodW1ibmFpbFVybDogaW1nLlRodW1ibmFpbFVybCxcclxuICAgICAgICBDb21tZW50Q291bnQ6IGltZy5Db21tZW50Q291bnQsXHJcbiAgICAgICAgVXBsb2FkZWQ6IG5ldyBEYXRlKGltZy5VcGxvYWRlZCksXHJcbiAgICAgICAgRGVzY3JpcHRpb246IGltZy5EZXNjcmlwdGlvblxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZVRocmVhZFRpdGxlID0gKHRpdGxlKSA9PiB7XHJcbiAgICBjb25zdCB2aWV3ZWRCeSA9IHRpdGxlLlZpZXdlZEJ5Lm1hcCh1c2VyID0+IHVzZXIuSUQpO1xyXG4gICAgY29uc3QgbGF0ZXN0Q29tbWVudCA9IHRpdGxlLkxhdGVzdENvbW1lbnQgPyBub3JtYWxpemVDb21tZW50KHRpdGxlLkxhdGVzdENvbW1lbnQpIDogbnVsbDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSUQ6IHRpdGxlLklELFxyXG4gICAgICAgIElzUHVibGlzaGVkOiB0aXRsZS5Jc1B1Ymxpc2hlZCxcclxuICAgICAgICBTdGlja3k6IHRpdGxlLlN0aWNreSxcclxuICAgICAgICBDcmVhdGVkT246IHRpdGxlLkNyZWF0ZWRPbixcclxuICAgICAgICBBdXRob3JJRDogdGl0bGUuQXV0aG9yLklELFxyXG4gICAgICAgIERlbGV0ZWQ6IHRpdGxlLkRlbGV0ZWQsXHJcbiAgICAgICAgSXNNb2RpZmllZDogdGl0bGUuSXNNb2RpZmllZCxcclxuICAgICAgICBUaXRsZTogdGl0bGUuVGl0bGUsXHJcbiAgICAgICAgTGFzdE1vZGlmaWVkOiB0aXRsZS5MYXN0TW9kaWZpZWQsXHJcbiAgICAgICAgTGF0ZXN0Q29tbWVudDogbGF0ZXN0Q29tbWVudCxcclxuICAgICAgICBDb21tZW50Q291bnQ6IHRpdGxlLkNvbW1lbnRDb3VudCxcclxuICAgICAgICBWaWV3ZWRCeTogdmlld2VkQnksXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplQ29tbWVudCA9IChjb21tZW50KSA9PiB7XHJcbiAgICBsZXQgciA9IGNvbW1lbnQuUmVwbGllcyA/IGNvbW1lbnQuUmVwbGllcyA6IFtdO1xyXG4gICAgY29uc3QgcmVwbGllcyA9IHIubWFwKG5vcm1hbGl6ZUNvbW1lbnQpO1xyXG4gICAgY29uc3QgYXV0aG9ySWQgPSAoY29tbWVudC5EZWxldGVkKSA/IC0xIDogY29tbWVudC5BdXRob3IuSUQ7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIENvbW1lbnRJRDogY29tbWVudC5JRCxcclxuICAgICAgICBBdXRob3JJRDogYXV0aG9ySWQsXHJcbiAgICAgICAgRGVsZXRlZDogY29tbWVudC5EZWxldGVkLFxyXG4gICAgICAgIFBvc3RlZE9uOiBjb21tZW50LlBvc3RlZE9uLFxyXG4gICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICBSZXBsaWVzOiByZXBsaWVzLFxyXG4gICAgICAgIEVkaXRlZDogY29tbWVudC5FZGl0ZWRcclxuICAgIH07XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIGZldGNoIGZyb20gXCJpc29tb3JwaGljLWZldGNoXCI7XHJcbmltcG9ydCB7IG9wdGlvbnMsIG9iak1hcCwgcmVzcG9uc2VIYW5kbGVyIH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5leHBvcnQgY29uc3QgYWRkVXNlciA9ICh1c2VyKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDIxLFxyXG4gICAgICAgIHBheWxvYWQ6IHVzZXJcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRDdXJyZW50VXNlcklkID0gKGlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDIwLFxyXG4gICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgcmVjaWV2ZWRVc2VycyA9ICh1c2VycykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyMixcclxuICAgICAgICBwYXlsb2FkOiB1c2Vyc1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoQ3VycmVudFVzZXIgPSAodXNlcm5hbWUpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBsZXQgdXJsID0gYCR7Z2xvYmFscy51cmxzLnVzZXJzfT91c2VybmFtZT0ke3VzZXJuYW1lfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEN1cnJlbnRVc2VySWQodXNlci5JRCkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFVzZXIgPSAodXNlcm5hbWUpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBsZXQgdXJsID0gYCR7Z2xvYmFscy51cmxzLnVzZXJzfT91c2VybmFtZT0ke3VzZXJuYW1lfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkociA9PiByLmpzb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7IGRpc3BhdGNoKGFkZFVzZXIodXNlcikpOyB9KTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFVzZXJzID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaChnbG9iYWxzLnVybHMudXNlcnMsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXJzID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZ2V0S2V5ID0gKHVzZXIpID0+IHVzZXIuSUQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGdldFZhbHVlID0gKHVzZXIpID0+IHVzZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG9iak1hcCh1c2VycywgZ2V0S2V5LCBnZXRWYWx1ZSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2lldmVkVXNlcnMob2JqKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJpbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9wdGlvbnMgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IG5vcm1hbGl6ZUxhdGVzdCBhcyBub3JtYWxpemUgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL25vcm1hbGl6ZVwiO1xyXG5pbXBvcnQgKiBhcyBmZXRjaCBmcm9tIFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSBcIi4uL2FjdGlvbnMvdXNlcnNcIjtcclxuZXhwb3J0IGNvbnN0IHNldExhdGVzdCA9IChsYXRlc3QpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNSxcclxuICAgICAgICBwYXlsb2FkOiBsYXRlc3RcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRTa2lwID0gKHNraXApID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNixcclxuICAgICAgICBwYXlsb2FkOiBza2lwXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VGFrZSA9ICh0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDcsXHJcbiAgICAgICAgcGF5bG9hZDogdGFrZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFBhZ2UgPSAocGFnZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA4LFxyXG4gICAgICAgIHBheWxvYWQ6IHBhZ2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRUb3RhbFBhZ2VzID0gKHRvdGFsUGFnZXMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogOSxcclxuICAgICAgICBwYXlsb2FkOiB0b3RhbFBhZ2VzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hMYXRlc3ROZXdzID0gKHNraXAsIHRha2UpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMud2hhdHNuZXd9P3NraXA9JHtza2lwfSZ0YWtlPSR7dGFrZX1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHBhZ2UgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IHBhZ2UuQ3VycmVudEl0ZW1zO1xyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gZ2V0QXV0aG9yKGl0ZW0uVHlwZSwgaXRlbS5JdGVtKTtcclxuICAgICAgICAgICAgICAgIGlmIChhdXRob3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRVc2VyKGF1dGhvcikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2tpcChza2lwKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2UodGFrZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRQYWdlKHBhZ2UuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxQYWdlcyhwYWdlLlRvdGFsUGFnZXMpKTtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGl0ZW1zLm1hcChub3JtYWxpemUpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRMYXRlc3Qobm9ybWFsaXplZCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuY29uc3QgZ2V0QXV0aG9yID0gKHR5cGUsIGl0ZW0pID0+IHtcclxuICAgIGxldCBhdXRob3IgPSBudWxsO1xyXG4gICAgaWYgKHR5cGUgPT09IDQpIHtcclxuICAgICAgICBhdXRob3IgPSBpdGVtLkhlYWRlci5BdXRob3I7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBhdXRob3IgPSBpdGVtLkF1dGhvcjtcclxuICAgIH1cclxuICAgIHJldHVybiBhdXRob3I7XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBCdXR0b24sIEdseXBoaWNvbiwgRm9ybUNvbnRyb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBJbWFnZVVwbG9hZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBoYXNGaWxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnNldEhhc0ZpbGUgPSB0aGlzLnNldEhhc0ZpbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURlc2NyaXB0aW9uQ2hhbmdlID0gdGhpcy5oYW5kbGVEZXNjcmlwdGlvbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWRGaWxlcyA9IHRoaXMucmVtb3ZlU2VsZWN0ZWRGaWxlcy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudXBsb2FkQnV0dG9uVmlldyA9IHRoaXMudXBsb2FkQnV0dG9uVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJJbnB1dCA9IHRoaXMuY2xlYXJJbnB1dC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY2xlYXJJbnB1dChmaWxlSW5wdXQpIHtcclxuICAgICAgICBpZiAoZmlsZUlucHV0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlSW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHsgfVxyXG4gICAgICAgICAgICBpZiAoZmlsZUlucHV0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpLCBwYXJlbnROb2RlID0gZmlsZUlucHV0LnBhcmVudE5vZGUsIHJlZiA9IGZpbGVJbnB1dC5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoZmlsZUlucHV0KTtcclxuICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZpbGVJbnB1dCwgcmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgaGFzRmlsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBnZXRGaWxlcygpIHtcclxuICAgICAgICBjb25zdCBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgcmV0dXJuIChmaWxlcyA/IGZpbGVzLmZpbGVzIDogW10pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlU3VibWl0KGUpIHtcclxuICAgICAgICBjb25zdCB7IHVwbG9hZEltYWdlLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICBjb25zdCBmaWxlcyA9IGZpbGVJbnB1dC5maWxlcztcclxuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gZmlsZXNbaV07XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVwbG9hZEltYWdlKHVzZXJuYW1lLCB0aGlzLnN0YXRlLmRlc2NyaXB0aW9uLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgdGhpcy5jbGVhcklucHV0KGZpbGVJbnB1dCk7XHJcbiAgICB9XHJcbiAgICBzZXRIYXNGaWxlKCkge1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSBmaWxlSW5wdXQuZmlsZXM7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZmlsZXMubGVuZ3RoID4gMDtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgaGFzRmlsZTogcmVzdWx0LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlRGVzY3JpcHRpb25DaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZS50YXJnZXQudmFsdWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlbW92ZVNlbGVjdGVkRmlsZXMoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICB0aGlzLmNsZWFySW5wdXQoZmlsZUlucHV0KTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgaGFzRmlsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzaG93RGVzY3JpcHRpb24oKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmhhc0ZpbGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Db250cm9sLCB7IGlkOiBcImRlc2NyaXB0aW9uXCIsIHR5cGU6IFwidGV4dFwiLCB2YWx1ZTogdGhpcy5zdGF0ZS5kZXNjcmlwdGlvbiwgcGxhY2Vob2xkZXI6IFwiQmVza3JpdiBiaWxsZWRldC4uLlwiLCByb3dzOiA1MCwgb25DaGFuZ2U6IHRoaXMuaGFuZGxlRGVzY3JpcHRpb25DaGFuZ2UgfSksXHJcbiAgICAgICAgICAgIFwiXFx1MDBBMFwiLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcIndhcm5pbmdcIiwgb25DbGljazogdGhpcy5yZW1vdmVTZWxlY3RlZEZpbGVzIH0sIFwiIEZvcnRyeWRcIikpO1xyXG4gICAgfVxyXG4gICAgdXBsb2FkQnV0dG9uVmlldygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaGFzRmlsZSlcclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCBkaXNhYmxlZDogdHJ1ZSwgdHlwZTogXCJzdWJtaXRcIiB9LCBcIiBVcGxvYWRcIik7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCB0eXBlOiBcInN1Ym1pdFwiIH0sIFwiVXBsb2FkXCIpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiLCB7IG9uU3VibWl0OiB0aGlzLmhhbmRsZVN1Ym1pdCwgaWQ6IFwiZm9ybS11cGxvYWRcIiwgY2xhc3NOYW1lOiBcImZvcm0taW5saW5lXCIsIGVuY1R5cGU6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiZm9ybS1ncm91cFwiIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgeyBodG1sRm9yOiBcImZpbGVzXCIsIGNsYXNzTmFtZTogXCJoaWRlLWlucHV0XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJjYW1lcmFcIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICBcIiBWXFx1MDBFNmxnIGZpbGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHsgdHlwZTogXCJmaWxlXCIsIGlkOiBcImZpbGVzXCIsIG5hbWU6IFwiZmlsZXNcIiwgb25DaGFuZ2U6IHRoaXMuc2V0SGFzRmlsZSwgbXVsdGlwbGU6IHRydWUgfSkpLFxyXG4gICAgICAgICAgICAgICAgXCJcXHUwMEEwIFwiLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RGVzY3JpcHRpb24oKSxcclxuICAgICAgICAgICAgICAgIFwiIFxcdTAwQTBcIixcclxuICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkQnV0dG9uVmlldygpKSxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgZmV0Y2ggZnJvbSBcImlzb21vcnBoaWMtZmV0Y2hcIjtcclxuaW1wb3J0IHsgYWRkVXNlciB9IGZyb20gXCIuL3VzZXJzXCI7XHJcbmltcG9ydCB7IG9iak1hcCwgcmVzcG9uc2VIYW5kbGVyLCBvcHRpb25zIH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBub3JtYWxpemVJbWFnZSBhcyBub3JtYWxpemUgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL25vcm1hbGl6ZVwiO1xyXG5leHBvcnQgY29uc3Qgc2V0SW1hZ2VzT3duZXIgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTAsXHJcbiAgICAgICAgcGF5bG9hZDogaWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCByZWNpZXZlZFVzZXJJbWFnZXMgPSAoaW1hZ2VzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDExLFxyXG4gICAgICAgIHBheWxvYWQ6IGltYWdlc1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFNlbGVjdGVkSW1nID0gKGlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDEyLFxyXG4gICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgYWRkSW1hZ2UgPSAoaW1nKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDEzLFxyXG4gICAgICAgIHBheWxvYWQ6IGltZ1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHJlbW92ZUltYWdlID0gKGlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDE0LFxyXG4gICAgICAgIHBheWxvYWQ6IHsgSW1hZ2VJRDogaWQgfVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGFkZFNlbGVjdGVkSW1hZ2VJZCA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxNSxcclxuICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxNixcclxuICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGNsZWFyU2VsZWN0ZWRJbWFnZUlkcyA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTcsXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgaW5jcmVtZW50Q29tbWVudENvdW50ID0gKGltYWdlSWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMTgsXHJcbiAgICAgICAgcGF5bG9hZDogeyBJbWFnZUlEOiBpbWFnZUlkIH1cclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBkZWNyZW1lbnRDb21tZW50Q291bnQgPSAoaW1hZ2VJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAxOSxcclxuICAgICAgICBwYXlsb2FkOiB7IEltYWdlSUQ6IGltYWdlSWQgfVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG5ld0ltYWdlRnJvbVNlcnZlciA9IChpbWFnZSkgPT4ge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZShpbWFnZSk7XHJcbiAgICByZXR1cm4gYWRkSW1hZ2Uobm9ybWFsaXplZCk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBkZWxldGVJbWFnZSA9IChpZCwgdXNlcm5hbWUpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuaW1hZ2VzfT91c2VybmFtZT0ke3VzZXJuYW1lfSZpZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKSgocikgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7IGRpc3BhdGNoKHJlbW92ZUltYWdlKGlkKSk7IH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgocmVhc29uKSA9PiBjb25zb2xlLmxvZyhyZWFzb24pKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHVwbG9hZEltYWdlID0gKHVzZXJuYW1lLCBkZXNjcmlwdGlvbiwgZm9ybURhdGEsIG9uU3VjY2Vzcywgb25FcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5pbWFnZXN9P3VzZXJuYW1lPSR7dXNlcm5hbWV9JmRlc2NyaXB0aW9uPSR7ZGVzY3JpcHRpb259YDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkoXyA9PiBudWxsKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzcywgb25FcnJvcik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hVc2VySW1hZ2VzID0gKHVzZXJuYW1lKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlc30/dXNlcm5hbWU9JHt1c2VybmFtZX1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBkYXRhLm1hcChub3JtYWxpemUpLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gb2JqTWFwKG5vcm1hbGl6ZWQsIChpbWcpID0+IGltZy5JbWFnZUlELCAoaW1nKSA9PiBpbWcpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNpZXZlZFVzZXJJbWFnZXMob2JqKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZGVsZXRlSW1hZ2VzID0gKHVzZXJuYW1lLCBpbWFnZUlkcyA9IFtdKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaWRzID0gaW1hZ2VJZHMuam9pbihcIixcIik7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlc30/dXNlcm5hbWU9JHt1c2VybmFtZX0maWRzPSR7aWRzfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4geyBkaXNwYXRjaChjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSk7IH0pXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHsgZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSk7IH0pO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEltYWdlT3duZXIgPSAodXNlcm5hbWUpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmluZE93bmVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VycyA9IGdldFN0YXRlKCkudXNlcnNJbmZvLnVzZXJzO1xyXG4gICAgICAgICAgICBsZXQgdXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiB1c2Vycykge1xyXG4gICAgICAgICAgICAgICAgdXNlciA9IHVzZXJzW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodXNlci5Vc2VybmFtZSA9IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHVzZXI7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgb3duZXIgPSBmaW5kT3duZXIoKTtcclxuICAgICAgICBpZiAob3duZXIpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3duZXJJZCA9IG93bmVyLklEO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lcklkKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy51c2Vyc30/dXNlcm5hbWU9JHt1c2VybmFtZX1gO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbih1c2VyID0+IHsgZGlzcGF0Y2goYWRkVXNlcih1c2VyKSk7IH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvd25lciA9IGZpbmRPd25lcigpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0SW1hZ2VzT3duZXIob3duZXIuSUQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoU2luZ2xlSW1hZ2UgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuaW1hZ2VzfS9nZXRieWlkP2lkPSR7aWR9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihpbWcgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWltZylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZEltYWdlID0gbm9ybWFsaXplKGltZyk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFkZEltYWdlKG5vcm1hbGl6ZWRJbWFnZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuIiwiaW1wb3J0IHsgcmVzcG9uc2VIYW5kbGVyLCBvcHRpb25zIH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgKiBhcyBmZXRjaCBmcm9tIFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5leHBvcnQgY29uc3Qgc2V0VXNlZFNwYWNla0IgPSAodXNlZFNwYWNlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDMyLFxyXG4gICAgICAgIHBheWxvYWQ6IHVzZWRTcGFjZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRvdGFsU3BhY2VrQiA9ICh0b3RhbFNwYWNlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDMzLFxyXG4gICAgICAgIHBheWxvYWQ6IHRvdGFsU3BhY2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFNwYWNlSW5mbyA9ICh1cmwpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlZFNwYWNlID0gZGF0YS5Vc2VkU3BhY2VLQjtcclxuICAgICAgICAgICAgY29uc3QgdG90YWxTcGFjZSA9IGRhdGEuU3BhY2VRdW90YUtCO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRVc2VkU3BhY2VrQih1c2VkU3BhY2UpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxTcGFjZWtCKHRvdGFsU3BhY2UpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBQcm9ncmVzc0JhciB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgZmV0Y2hTcGFjZUluZm8gfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9zdGF0dXNcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVzZWRNQjogKHN0YXRlLnN0YXR1c0luZm8uc3BhY2VJbmZvLnVzZWRTcGFjZWtCIC8gMTAwMCksXHJcbiAgICAgICAgdG90YWxNQjogKHN0YXRlLnN0YXR1c0luZm8uc3BhY2VJbmZvLnRvdGFsU3BhY2VrQiAvIDEwMDApLFxyXG4gICAgICAgIGxvYWRlZDogKHN0YXRlLnN0YXR1c0luZm8uc3BhY2VJbmZvLnRvdGFsU3BhY2VrQiAhPT0gLTEpXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0U3BhY2VJbmZvOiAodXJsKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoU3BhY2VJbmZvKHVybCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFVzZWRTcGFjZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBnZXRTcGFjZUluZm8gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmRpYWdub3N0aWNzfS9nZXRzcGFjZWluZm9gO1xyXG4gICAgICAgIGdldFNwYWNlSW5mbyh1cmwpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlZE1CLCB0b3RhbE1CIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsID0gTWF0aC5yb3VuZCh0b3RhbE1CKTtcclxuICAgICAgICBjb25zdCB1c2VkID0gTWF0aC5yb3VuZCh1c2VkTUIgKiAxMDApIC8gMTAwO1xyXG4gICAgICAgIGNvbnN0IGZyZWUgPSBNYXRoLnJvdW5kKCh0b3RhbCAtIHVzZWQpICogMTAwKSAvIDEwMDtcclxuICAgICAgICBjb25zdCB1c2VkUGVyY2VudCA9ICgodXNlZCAvIHRvdGFsKSAqIDEwMCk7XHJcbiAgICAgICAgY29uc3QgcGVyY2VudFJvdW5kID0gTWF0aC5yb3VuZCh1c2VkUGVyY2VudCAqIDEwMCkgLyAxMDA7XHJcbiAgICAgICAgY29uc3Qgc2hvdyA9IEJvb2xlYW4odXNlZFBlcmNlbnQpICYmIEJvb2xlYW4odXNlZCkgJiYgQm9vbGVhbihmcmVlKSAmJiBCb29sZWFuKHRvdGFsKTtcclxuICAgICAgICBpZiAoIXNob3cpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb2dyZXNzQmFyLCB7IHN0cmlwZWQ6IHRydWUsIGJzU3R5bGU6IFwic3VjY2Vzc1wiLCBub3c6IHVzZWRQZXJjZW50LCBrZXk6IDEgfSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQnJ1Z3Q6IFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZWQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBcIiBNQiAoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudFJvdW5kLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgJSlcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJGcmkgcGxhZHM6IFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyZWUudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBcIiBNQlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICBcIlRvdGFsOiBcIixcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIE1CXCIpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgVXNlZFNwYWNlID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlZFNwYWNlVmlldyk7XHJcbmV4cG9ydCBkZWZhdWx0IFVzZWRTcGFjZTtcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEltYWdlLCBNZWRpYSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIENvbW1lbnRQcm9maWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MZWZ0LCB7IGNsYXNzTmFtZTogXCJjb21tZW50LXByb2ZpbGVcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlLCB7IHNyYzogXCIvaW1hZ2VzL3BlcnNvbl9pY29uLnN2Z1wiLCBzdHlsZTogeyB3aWR0aDogXCI2NHB4XCIsIGhlaWdodDogXCI2NHB4XCIgfSwgY2xhc3NOYW1lOiBcIm1lZGlhLW9iamVjdFwiIH0pLFxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgT3ZlcmxheVRyaWdnZXIsIFRvb2x0aXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld1Rvb2x0aXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgdG9vbHRpcFZpZXcodGlwKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9vbHRpcCwgeyBpZDogXCJ0b29sdGlwXCIgfSwgdGlwKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRvb2x0aXAsIGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE92ZXJsYXlUcmlnZ2VyLCB7IHBsYWNlbWVudDogXCJsZWZ0XCIsIG92ZXJsYXk6IHRoaXMudG9vbHRpcFZpZXcodG9vbHRpcCkgfSwgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50UHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBXaGF0c05ld1Rvb2x0aXAgfSBmcm9tIFwiLi9XaGF0c05ld1Rvb2x0aXBcIjtcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IHRpbWVUZXh0IH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBJbWFnZSwgR2x5cGhpY29uLCBUb29sdGlwIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdJdGVtSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgd2hlbigpIHtcclxuICAgICAgICBjb25zdCB7IG9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBcInVwbG9hZGVkZSBcIiArIHRpbWVUZXh0KG9uKTtcclxuICAgIH1cclxuICAgIG92ZXJsYXkoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9vbHRpcCwgeyBpZDogXCJ0b29sdGlwX2ltZ1wiIH0sIFwiQnJ1Z2VyIGJpbGxlZGVcIik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCBhdXRob3IsIGZpbGVuYW1lLCBleHRlbnNpb24sIHRodW1ibmFpbCwgZGVzY3JpcHRpb24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWUgPSBhdXRob3IuVXNlcm5hbWU7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IGAke2ZpbGVuYW1lfS4ke2V4dGVuc2lvbn1gO1xyXG4gICAgICAgIGNvbnN0IGxpbmsgPSBgJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlSWR9YDtcclxuICAgICAgICBjb25zdCBuYW1lID0gYCR7YXV0aG9yLkZpcnN0TmFtZX0gJHthdXRob3IuTGFzdE5hbWV9YDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChXaGF0c05ld1Rvb2x0aXAsIHsgdG9vbHRpcDogXCJVcGxvYWRldCBiaWxsZWRlXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MaXN0SXRlbSwgeyBjbGFzc05hbWU6IFwid2hhdHNuZXdJdGVtIGhvdmVyLXNoYWRvd1wiIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRQcm9maWxlLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYmxvY2txdW90ZVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJpbWFnZS13aGF0c25ldy1kZXNjcmlwdGlvbnRleHRcIiB9LCBkZXNjcmlwdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7IHRvOiBsaW5rIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlLCB7IHNyYzogdGh1bWJuYWlsLCB0aHVtYm5haWw6IHRydWUgfSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndoZW4oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcInBpY3R1cmVcIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZSkpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50UHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBXaGF0c05ld1Rvb2x0aXAgfSBmcm9tIFwiLi9XaGF0c05ld1Rvb2x0aXBcIjtcclxuaW1wb3J0IHsgZm9ybWF0VGV4dCwgZ2V0V29yZHMsIHRpbWVUZXh0IH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBNZWRpYSwgR2x5cGhpY29uIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdJdGVtQ29tbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjcmVhdGVTdW1tYXJ5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gZm9ybWF0VGV4dChnZXRXb3Jkcyh0ZXh0LCA1KSArIFwiLi4uXCIpO1xyXG4gICAgfVxyXG4gICAgZnVsbG5hbWUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIGF1dGhvciA/IGF1dGhvci5GaXJzdE5hbWUgKyBcIiBcIiArIGF1dGhvci5MYXN0TmFtZSA6IFwiVXNlclwiO1xyXG4gICAgfVxyXG4gICAgd2hlbigpIHtcclxuICAgICAgICBjb25zdCB7IG9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBcInNhZ2RlIFwiICsgdGltZVRleHQob24pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VJZCwgdXBsb2FkZWRCeSwgY29tbWVudElkLCBmaWxlbmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB1c2VybmFtZSA9IHVwbG9hZGVkQnkuVXNlcm5hbWU7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMuZnVsbG5hbWUoKTtcclxuICAgICAgICBjb25zdCBzdW1tYXJ5ID0gdGhpcy5jcmVhdGVTdW1tYXJ5KCk7XHJcbiAgICAgICAgY29uc3QgbGluayA9IGAke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2VJZH0vY29tbWVudD9pZD0ke2NvbW1lbnRJZH1gO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFdoYXRzTmV3VG9vbHRpcCwgeyB0b29sdGlwOiBcIktvbW1lbnRhclwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuTGlzdEl0ZW0sIHsgY2xhc3NOYW1lOiBcIndoYXRzbmV3SXRlbSBob3Zlci1zaGFkb3dcIiB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50UHJvZmlsZSwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJsb2NrcXVvdGVcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7IHRvOiBsaW5rIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZW1cIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiBzdW1tYXJ5IH0pKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2hlbigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwiY29tbWVudFwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSkpKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBXaGF0c05ld1Rvb2x0aXAgfSBmcm9tIFwiLi9XaGF0c05ld1Rvb2x0aXBcIjtcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudFByb2ZpbGVcIjtcclxuaW1wb3J0IHsgZ2V0V29yZHMsIHRpbWVUZXh0IH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBNZWRpYSwgR2x5cGhpY29uLCBUb29sdGlwIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdGb3J1bVBvc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zaG93TW9kYWwgPSB0aGlzLnNob3dNb2RhbC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgZnVsbG5hbWUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIGF1dGhvci5GaXJzdE5hbWUgKyBcIiBcIiArIGF1dGhvci5MYXN0TmFtZTtcclxuICAgIH1cclxuICAgIHdoZW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJpbmRsw6ZnIFwiICsgdGltZVRleHQob24pO1xyXG4gICAgfVxyXG4gICAgc3VtbWFyeSgpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIGdldFdvcmRzKHRleHQsIDUpO1xyXG4gICAgfVxyXG4gICAgb3ZlcmxheSgpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRDb3VudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IGlkOiBcInRvb2x0aXBfcG9zdFwiIH0sXHJcbiAgICAgICAgICAgIFwiRm9ydW0gaW5kbFxcdTAwRTZnLCBhbnRhbCBrb21tZW50YXJlcjogXCIsXHJcbiAgICAgICAgICAgIGNvbW1lbnRDb3VudCk7XHJcbiAgICB9XHJcbiAgICBzaG93TW9kYWwoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IHsgcHJldmlldywgaW5kZXggfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcHJldmlldyhpbmRleCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5mdWxsbmFtZSgpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFdoYXRzTmV3VG9vbHRpcCwgeyB0b29sdGlwOiBcIkZvcnVtIGluZGzDpmdcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3RJdGVtLCB7IGNsYXNzTmFtZTogXCJ3aGF0c25ld0l0ZW0gaG92ZXItc2hhZG93XCIgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudFByb2ZpbGUsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5Cb2R5LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJibG9ja3F1b3RlXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogXCIjXCIsIG9uQ2xpY2s6IHRoaXMuc2hvd01vZGFsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN1bW1hcnkoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLi4uXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndoZW4oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcImxpc3QtYWx0XCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlKSkpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3SXRlbUltYWdlIH0gZnJvbSBcIi4vV2hhdHNOZXdJdGVtSW1hZ2VcIjtcclxuaW1wb3J0IHsgV2hhdHNOZXdJdGVtQ29tbWVudCB9IGZyb20gXCIuL1doYXRzTmV3SXRlbUNvbW1lbnRcIjtcclxuaW1wb3J0IHsgV2hhdHNOZXdGb3J1bVBvc3QgfSBmcm9tIFwiLi9XaGF0c05ld0ZvcnVtUG9zdFwiO1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3TGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnByZXZpZXdQb3N0SGFuZGxlID0gdGhpcy5wcmV2aWV3UG9zdEhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcHJldmlld1Bvc3RIYW5kbGUoaW5kZXgpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1zLCBwcmV2aWV3IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpbmRleF07XHJcbiAgICAgICAgcHJldmlldyhpdGVtKTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdEl0ZW1zKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgZ2VuZXJhdGVLZXkgPSAoaWQpID0+IFwid2hhdHNuZXdfXCIgKyBpZDtcclxuICAgICAgICByZXR1cm4gaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtS2V5ID0gZ2VuZXJhdGVLZXkoaXRlbS5JRCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGdldFVzZXIoaXRlbS5BdXRob3JJRCk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWFnZSA9IGl0ZW0uSXRlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdJdGVtSW1hZ2UsIHsgb246IGl0ZW0uT24sIGltYWdlSWQ6IGltYWdlLkltYWdlSUQsIGZpbGVuYW1lOiBpbWFnZS5GaWxlbmFtZSwgZXh0ZW5zaW9uOiBpbWFnZS5FeHRlbnNpb24sIHRodW1ibmFpbDogaW1hZ2UuVGh1bWJuYWlsVXJsLCBhdXRob3I6IGF1dGhvciwgZGVzY3JpcHRpb246IGltYWdlLkRlc2NyaXB0aW9uLCBrZXk6IGl0ZW1LZXkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IGl0ZW0uSXRlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXdJdGVtQ29tbWVudCwgeyBjb21tZW50SWQ6IGNvbW1lbnQuSUQsIHRleHQ6IGNvbW1lbnQuVGV4dCwgdXBsb2FkZWRCeTogY29tbWVudC5JbWFnZVVwbG9hZGVkQnksIGltYWdlSWQ6IGNvbW1lbnQuSW1hZ2VJRCwgZmlsZW5hbWU6IGNvbW1lbnQuRmlsZW5hbWUsIG9uOiBpdGVtLk9uLCBhdXRob3I6IGF1dGhvciwga2V5OiBpdGVtS2V5IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc3QgPSBpdGVtLkl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFdoYXRzTmV3Rm9ydW1Qb3N0LCB7IG9uOiBpdGVtLk9uLCBhdXRob3I6IGF1dGhvciwgdGl0bGU6IHBvc3QuVGl0bGUsIHRleHQ6IHBvc3QuVGV4dCwgc3RpY2t5OiBwb3N0LlN0aWNreSwgY29tbWVudENvdW50OiBwb3N0LkNvbW1lbnRDb3VudCwgcHJldmlldzogdGhpcy5wcmV2aWV3UG9zdEhhbmRsZSwgaW5kZXg6IGluZGV4LCBrZXk6IGl0ZW1LZXkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGl0ZW1Ob2RlcyA9IHRoaXMuY29uc3RydWN0SXRlbXMoKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MaXN0LCBudWxsLCBpdGVtTm9kZXMpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBGb3JtR3JvdXAsIENvbnRyb2xMYWJlbCwgRm9ybUNvbnRyb2wsIEJ1dHRvbiwgUm93LCBDb2wsIE1vZGFsLCBCdXR0b25Hcm91cCwgR2x5cGhpY29uIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgRm9ydW1Gb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIFRpdGxlOiBcIlwiLFxyXG4gICAgICAgICAgICBUZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICBTdGlja3k6IGZhbHNlLFxyXG4gICAgICAgICAgICBJc1B1Ymxpc2hlZDogdHJ1ZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0IH0gPSBuZXh0UHJvcHM7XHJcbiAgICAgICAgaWYgKGVkaXQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICBUaXRsZTogZWRpdC5UaXRsZSxcclxuICAgICAgICAgICAgICAgIFRleHQ6IGVkaXQuVGV4dCxcclxuICAgICAgICAgICAgICAgIFN0aWNreTogZWRpdC5TdGlja3ksXHJcbiAgICAgICAgICAgICAgICBJc1B1Ymxpc2hlZDogZWRpdC5Jc1B1Ymxpc2hlZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBoYW5kbGVUaXRsZUNoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRpdGxlOiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGhhbmRsZVRleHRDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUZXh0OiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGdldFZhbGlkYXRpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5zdGF0ZS5UaXRsZS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8IDIwMClcclxuICAgICAgICAgICAgcmV0dXJuIFwic3VjY2Vzc1wiO1xyXG4gICAgICAgIGlmIChsZW5ndGggPj0gMjAwICYmIGxlbmd0aCA8PSAyNTApXHJcbiAgICAgICAgICAgIHJldHVybiBcIndhcm5pbmdcIjtcclxuICAgICAgICByZXR1cm4gXCJlcnJvclwiO1xyXG4gICAgfVxyXG4gICAgdHJhbnNmb3JtVG9EVE8oc3RhdGUpIHtcclxuICAgICAgICBjb25zdCBoZWFkZXIgPSB7XHJcbiAgICAgICAgICAgIElzUHVibGlzaGVkOiBzdGF0ZS5Jc1B1Ymxpc2hlZCxcclxuICAgICAgICAgICAgU3RpY2t5OiBzdGF0ZS5TdGlja3ksXHJcbiAgICAgICAgICAgIFRpdGxlOiBzdGF0ZS5UaXRsZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgSGVhZGVyOiBoZWFkZXIsXHJcbiAgICAgICAgICAgIFRleHQ6IHN0YXRlLlRleHRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgaGFuZGxlU3VibWl0KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgeyBjbG9zZSwgb25TdWJtaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcG9zdCA9IHRoaXMudHJhbnNmb3JtVG9EVE8odGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgb25TdWJtaXQocG9zdCk7XHJcbiAgICAgICAgY2xvc2UoKTtcclxuICAgIH1cclxuICAgIGhhbmRsZVN0aWNreSgpIHtcclxuICAgICAgICBjb25zdCB7IFN0aWNreSB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgU3RpY2t5OiAhU3RpY2t5IH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlUHVibGlzaGVkKCkge1xyXG4gICAgICAgIGNvbnN0IHsgSXNQdWJsaXNoZWQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IElzUHVibGlzaGVkOiAhSXNQdWJsaXNoZWQgfSk7XHJcbiAgICB9XHJcbiAgICBjbG9zZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGNsb3NlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNsb3NlKCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBzaG93LCBlZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlYWRNb2RlID0gQm9vbGVhbighZWRpdCk7XHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSByZWFkTW9kZSA/IFwiU2tyaXYgbnl0IGluZGzDpmdcIiA6IFwiw4ZuZHJlIGluZGzDpmdcIjtcclxuICAgICAgICBjb25zdCBidG5TdWJtaXQgPSByZWFkTW9kZSA/IFwiU2tyaXYgaW5kbMOmZ1wiIDogXCJHZW0gw6ZuZHJpbmdlclwiO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLCB7IHNob3c6IHNob3csIG9uSGlkZTogdGhpcy5jbG9zZUhhbmRsZS5iaW5kKHRoaXMpLCBic1NpemU6IFwibGdcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5IZWFkZXIsIHsgY2xvc2VCdXR0b246IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLlRpdGxlLCBudWxsLCB0aXRsZSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5Cb2R5LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMTIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCB7IGNvbnRyb2xJZDogXCJmb3JtUG9zdFRpdGxlXCIsIHZhbGlkYXRpb25TdGF0ZTogdGhpcy5nZXRWYWxpZGF0aW9uKCkgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbnRyb2xMYWJlbCwgbnVsbCwgXCJPdmVyc2tyaWZ0XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUNvbnRyb2wsIHsgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIk92ZXJza3JpZnQgcMOlIGluZGzDpmcuLi5cIiwgb25DaGFuZ2U6IHRoaXMuaGFuZGxlVGl0bGVDaGFuZ2UuYmluZCh0aGlzKSwgdmFsdWU6IHRoaXMuc3RhdGUuVGl0bGUgfSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgY29udHJvbElkOiBcImZvcm1Qb3N0Q29udGVudFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb250cm9sTGFiZWwsIG51bGwsIFwiSW5kbFxcdTAwRTZnXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUNvbnRyb2wsIHsgY29tcG9uZW50Q2xhc3M6IFwidGV4dGFyZWFcIiwgcGxhY2Vob2xkZXI6IFwiU2tyaXYgYmVza2VkIGhlci4uLlwiLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyksIHZhbHVlOiB0aGlzLnN0YXRlLlRleHQsIHJvd3M6IDggfSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgY29udHJvbElkOiBcImZvcm1Qb3N0U3RpY2t5XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbkdyb3VwLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInN1Y2Nlc3NcIiwgYnNTaXplOiBcInNtYWxsXCIsIGFjdGl2ZTogdGhpcy5zdGF0ZS5TdGlja3ksIG9uQ2xpY2s6IHRoaXMuaGFuZGxlU3RpY2t5LmJpbmQodGhpcykgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcInB1c2hwaW5cIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFZpZ3RpZ1wiKSkpKSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5Gb290ZXIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogXCJkZWZhdWx0XCIsIG9uQ2xpY2s6IHRoaXMuY2xvc2VIYW5kbGUuYmluZCh0aGlzKSB9LCBcIkx1a1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBic1N0eWxlOiBcInByaW1hcnlcIiwgdHlwZTogXCJzdWJtaXRcIiwgb25DbGljazogdGhpcy5oYW5kbGVTdWJtaXQgfSwgYnRuU3VibWl0KSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIEJ1dHRvblRvb2xiYXIsIEJ1dHRvbkdyb3VwLCBPdmVybGF5VHJpZ2dlciwgQnV0dG9uLCBHbHlwaGljb24sIFRvb2x0aXAsIENvbGxhcHNlLCBGb3JtR3JvdXAsIEZvcm1Db250cm9sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgQnV0dG9uVG9vbHRpcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b29sdGlwLCBvbkNsaWNrLCBpY29uLCBic1N0eWxlLCBhY3RpdmUsIG1vdW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGxldCBvdmVybGF5VGlwID0gUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IGlkOiBcInRvb2x0aXBcIiB9LCB0b29sdGlwKTtcclxuICAgICAgICBpZiAoIW1vdW50KVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChPdmVybGF5VHJpZ2dlciwgeyBwbGFjZW1lbnQ6IFwidG9wXCIsIG92ZXJsYXk6IG92ZXJsYXlUaXAgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogYnNTdHlsZSwgYnNTaXplOiBcInhzbWFsbFwiLCBvbkNsaWNrOiBvbkNsaWNrLCBhY3RpdmU6IGFjdGl2ZSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IGljb24gfSkpKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgQ29tbWVudENvbnRyb2xzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHRleHQ6IHByb3BzLnRleHQsXHJcbiAgICAgICAgICAgIHJlcGx5VGV4dDogXCJcIixcclxuICAgICAgICAgICAgcmVwbHk6IGZhbHNlLFxyXG4gICAgICAgICAgICBlZGl0OiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy50b2dnbGVFZGl0ID0gdGhpcy50b2dnbGVFZGl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50b2dnbGVSZXBseSA9IHRoaXMudG9nZ2xlUmVwbHkuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmVkaXRIYW5kbGUgPSB0aGlzLmVkaXRIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlcGx5SGFuZGxlID0gdGhpcy5yZXBseUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSGFuZGxlID0gdGhpcy5kZWxldGVIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlID0gdGhpcy5oYW5kbGVSZXBseUNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlUmVwbHlDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXBseVRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgdG9nZ2xlRWRpdCgpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6ICFlZGl0IH0pO1xyXG4gICAgICAgIGlmICghZWRpdCkge1xyXG4gICAgICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRvZ2dsZVJlcGx5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHkgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5OiAhcmVwbHkgfSk7XHJcbiAgICB9XHJcbiAgICBkZWxldGVIYW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVDb21tZW50LCBjb21tZW50SWQsIGNvbnRleHRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBkZWxldGVDb21tZW50KGNvbW1lbnRJZCwgY29udGV4dElkKTtcclxuICAgIH1cclxuICAgIGVkaXRIYW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0Q29tbWVudCwgY29udGV4dElkLCBjb21tZW50SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBmYWxzZSB9KTtcclxuICAgICAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIGNvbnRleHRJZCwgdGV4dCk7XHJcbiAgICB9XHJcbiAgICByZXBseUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRJZCwgY29udGV4dElkLCByZXBseUNvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyByZXBseVRleHQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5OiBmYWxzZSwgcmVwbHlUZXh0OiBcIlwiIH0pO1xyXG4gICAgICAgIHJlcGx5Q29tbWVudChjb250ZXh0SWQsIHJlcGx5VGV4dCwgY29tbWVudElkKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcklkLCBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdCwgdGV4dCwgcmVwbHksIHJlcGx5VGV4dCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBjb25zdCBtb3VudCA9IGNhbkVkaXQoYXV0aG9ySWQpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsgc3R5bGU6IHsgcGFkZGluZ0JvdHRvbTogXCI1cHhcIiwgcGFkZGluZ0xlZnQ6IFwiMTVweFwiIH0gfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA0IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sYmFyLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbkdyb3VwLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sdGlwLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCBvbkNsaWNrOiB0aGlzLmRlbGV0ZUhhbmRsZSwgaWNvbjogXCJ0cmFzaFwiLCB0b29sdGlwOiBcInNsZXRcIiwgbW91bnQ6IG1vdW50IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sdGlwLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCBvbkNsaWNrOiB0aGlzLnRvZ2dsZUVkaXQsIGljb246IFwicGVuY2lsXCIsIHRvb2x0aXA6IFwiw6ZuZHJlXCIsIGFjdGl2ZTogZWRpdCwgbW91bnQ6IG1vdW50IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sdGlwLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCBvbkNsaWNrOiB0aGlzLnRvZ2dsZVJlcGx5LCBpY29uOiBcImVudmVsb3BlXCIsIHRvb2x0aXA6IFwic3ZhclwiLCBhY3RpdmU6IHJlcGx5LCBtb3VudDogdHJ1ZSB9KSkpKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCB7IHN0eWxlOiB7IHBhZGRpbmdCb3R0b206IFwiNXB4XCIgfSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDEsIGxnOiAxMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sbGFwc2VUZXh0QXJlYSwgeyBzaG93OiBlZGl0LCBpZDogXCJlZGl0VGV4dENvbnRyb2xcIiwgdmFsdWU6IHRleHQsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZVRleHRDaGFuZ2UsIHRvZ2dsZTogdGhpcy50b2dnbGVFZGl0LCBzYXZlOiB0aGlzLmVkaXRIYW5kbGUsIHNhdmVUZXh0OiBcIkdlbSDDpm5kcmluZ2VyXCIsIG1vdW50OiBtb3VudCB9KSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAxLCBsZzogMTAgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbGxhcHNlVGV4dEFyZWEsIHsgc2hvdzogcmVwbHksIGlkOiBcInJlcGx5VGV4dENvbnRyb2xcIiwgdmFsdWU6IHJlcGx5VGV4dCwgb25DaGFuZ2U6IHRoaXMuaGFuZGxlUmVwbHlDaGFuZ2UsIHRvZ2dsZTogdGhpcy50b2dnbGVSZXBseSwgc2F2ZTogdGhpcy5yZXBseUhhbmRsZSwgc2F2ZVRleHQ6IFwiU3ZhclwiLCBtb3VudDogdHJ1ZSB9KSkpKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBDb2xsYXBzZVRleHRBcmVhIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHNob3csIGlkLCB2YWx1ZSwgb25DaGFuZ2UsIHRvZ2dsZSwgc2F2ZSwgc2F2ZVRleHQsIG1vdW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghbW91bnQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbGxhcHNlLCB7IGluOiBzaG93IH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCB7IGNvbnRyb2xJZDogaWQgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUNvbnRyb2wsIHsgY29tcG9uZW50Q2xhc3M6IFwidGV4dGFyZWFcIiwgdmFsdWU6IHZhbHVlLCBvbkNoYW5nZTogb25DaGFuZ2UsIHJvd3M6IDQgfSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgb25DbGljazogdG9nZ2xlIH0sIFwiTHVrXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IHR5cGU6IFwic3VibWl0XCIsIGJzU3R5bGU6IFwiaW5mb1wiLCBvbkNsaWNrOiBzYXZlIH0sIHNhdmVUZXh0KSkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBmZXRjaCBmcm9tIFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5pbXBvcnQgeyBvcHRpb25zLCByZXNwb25zZUhhbmRsZXIgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IG5vcm1hbGl6ZVRocmVhZFRpdGxlIH0gZnJvbSBcIi4uL3V0aWxpdGllcy9ub3JtYWxpemVcIjtcclxuZXhwb3J0IGNvbnN0IGFkZFRocmVhZFRpdGxlID0gKHRpdGxlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDI0LFxyXG4gICAgICAgIHBheWxvYWQ6IFt0aXRsZV1cclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRUaHJlYWRUaXRsZXMgPSAodGl0bGVzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDI1LFxyXG4gICAgICAgIHBheWxvYWQ6IHRpdGxlc1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRvdGFsUGFnZXMgPSAodG90YWxQYWdlcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyNixcclxuICAgICAgICBwYXlsb2FkOiB0b3RhbFBhZ2VzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0UGFnZSA9IChwYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDI3LFxyXG4gICAgICAgIHBheWxvYWQ6IHBhZ2VcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRTa2lwID0gKHNraXApID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMjgsXHJcbiAgICAgICAgcGF5bG9hZDogc2tpcFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRha2UgPSAodGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAyOSxcclxuICAgICAgICBwYXlsb2FkOiB0YWtlXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0U2VsZWN0ZWRUaHJlYWQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzAsXHJcbiAgICAgICAgcGF5bG9hZDogaWRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRQb3N0Q29udGVudCA9IChjb250ZW50KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDMxLFxyXG4gICAgICAgIHBheWxvYWQ6IGNvbnRlbnRcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBtYXJrUG9zdCA9IChwb3N0SWQsIHJlYWQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmZvcnVtcG9zdH0/cG9zdElkPSR7cG9zdElkfSZyZWFkPSR7cmVhZH1gO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkoXyA9PiBudWxsKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGNiKTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFRocmVhZHMgPSAoc2tpcCA9IDAsIHRha2UgPSAxMCkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZvcnVtID0gZ2xvYmFscy51cmxzLmZvcnVtdGl0bGU7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Zm9ydW19P3NraXA9JHtza2lwfSZ0YWtlPSR7dGFrZX1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYWdlRm9ydW1UaXRsZXMgPSBkYXRhLkN1cnJlbnRJdGVtcztcclxuICAgICAgICAgICAgY29uc3QgZm9ydW1UaXRsZXMgPSBwYWdlRm9ydW1UaXRsZXMubWFwKG5vcm1hbGl6ZVRocmVhZFRpdGxlKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2tpcChza2lwKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2UodGFrZSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFBhZ2VzKGRhdGEuVG90YWxQYWdlcykpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRQYWdlKGRhdGEuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGhyZWFkVGl0bGVzKGZvcnVtVGl0bGVzKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hQb3N0ID0gKGlkLCBjYikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZvcnVtID0gZ2xvYmFscy51cmxzLmZvcnVtcG9zdDtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtmb3J1bX0/aWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKHIgPT4gci5qc29uKCkpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gZGF0YS5UZXh0O1xyXG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IG5vcm1hbGl6ZVRocmVhZFRpdGxlKGRhdGEuSGVhZGVyKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goYWRkVGhyZWFkVGl0bGUodGl0bGUpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0UG9zdENvbnRlbnQoY29udGVudCkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTZWxlY3RlZFRocmVhZChkYXRhLlRocmVhZElEKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHVwZGF0ZVBvc3QgPSAoaWQsIHBvc3QsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmZvcnVtcG9zdH0/aWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShfID0+IG51bGwpO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwb3N0KSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVBvc3QgPSAoaWQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmZvcnVtcG9zdH0/aWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlcihkaXNwYXRjaCkoXyA9PiBudWxsKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGNiKTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBwb3N0VGhyZWFkID0gKHBvc3QsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtcG9zdDtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwb3N0KSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIoZGlzcGF0Y2gpKF8gPT4gbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgRm9ydW1Gb3JtIH0gZnJvbSBcIi4uL2ZvcnVtL0ZvcnVtRm9ybVwiO1xyXG5pbXBvcnQgeyBCdXR0b25Ub29sdGlwIH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRDb250cm9sc1wiO1xyXG5pbXBvcnQgeyBtYXJrUG9zdCwgdXBkYXRlUG9zdCwgZmV0Y2hQb3N0LCBkZWxldGVQb3N0LCBzZXRTZWxlY3RlZFRocmVhZCB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2ZvcnVtXCI7XHJcbmltcG9ydCB7IGZpbmQsIGNvbnRhaW5zIH0gZnJvbSBcInVuZGVyc2NvcmVcIjtcclxuaW1wb3J0IHsgZ2V0RnVsbE5hbWUsIGZvcm1hdFRleHQgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBHbHlwaGljb24sIEJ1dHRvblRvb2xiYXIsIEJ1dHRvbkdyb3VwIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby5zZWxlY3RlZFRocmVhZDtcclxuICAgIGNvbnN0IHRpdGxlID0gZmluZChzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby50aXRsZXMsICh0aXRsZSkgPT4gdGl0bGUuSUQgPT09IHNlbGVjdGVkKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkLFxyXG4gICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICB0ZXh0OiBzdGF0ZS5mb3J1bUluZm8ucG9zdENvbnRlbnQsXHJcbiAgICAgICAgZ2V0VXNlcjogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8udXNlcnNbaWRdLFxyXG4gICAgICAgIGNhbkVkaXQ6IChpZCkgPT4gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQgPT09IGlkLFxyXG4gICAgICAgIGhhc1JlYWQ6IHRpdGxlID8gY29udGFpbnModGl0bGUuVmlld2VkQnksIHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkKSA6IGZhbHNlLFxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZTogKGlkLCBwb3N0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaCh1cGRhdGVQb3N0KGlkLCBwb3N0LCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0UG9zdDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoUG9zdChpZCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBkaXNwYXRjaChzZXRTZWxlY3RlZFRocmVhZChpZCkpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZVBvc3Q6IChpZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlUG9zdChpZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlYWRQb3N0OiAocG9zdElkLCByZWFkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChtYXJrUG9zdChwb3N0SWQsIHJlYWQsIGNiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgRm9ydW1Qb3N0Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGVkaXQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRvZ2dsZUVkaXQgPSB0aGlzLnRvZ2dsZUVkaXQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uU3VibWl0ID0gdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSGFuZGxlID0gdGhpcy5kZWxldGVIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRvZ2dsZVBvc3RSZWFkID0gdGhpcy50b2dnbGVQb3N0UmVhZC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBoYXNUaXRsZSA9IEJvb2xlYW4obmV4dFByb3BzLnRpdGxlKTtcclxuICAgICAgICBpZiAoIWhhc1RpdGxlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgICBUaXRsZTogbmV4dFByb3BzLnRpdGxlLlRpdGxlLFxyXG4gICAgICAgICAgICAgICAgVGV4dDogbmV4dFByb3BzLnRleHQsXHJcbiAgICAgICAgICAgICAgICBTdGlja3k6IG5leHRQcm9wcy50aXRsZS5TdGlja3ksXHJcbiAgICAgICAgICAgICAgICBJc1B1Ymxpc2hlZDogbmV4dFByb3BzLnRpdGxlLklzUHVibGlzaGVkXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBuZXh0UHJvcHMudGl0bGUuVGl0bGU7XHJcbiAgICB9XHJcbiAgICBkZWxldGVIYW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgeyByb3V0ZXIsIGRlbGV0ZVBvc3QsIHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmb3J1bWxpc3RzID0gYC9mb3J1bWA7XHJcbiAgICAgICAgICAgIHJvdXRlci5wdXNoKGZvcnVtbGlzdHMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGVsZXRlUG9zdCh0aXRsZS5JRCwgY2IpO1xyXG4gICAgfVxyXG4gICAgdG9nZ2xlRWRpdCgpIHtcclxuICAgICAgICBjb25zdCBlZGl0ID0gdGhpcy5zdGF0ZS5lZGl0O1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiAhZWRpdCB9KTtcclxuICAgIH1cclxuICAgIG9uU3VibWl0KHBvc3QpIHtcclxuICAgICAgICBjb25zdCB7IHVwZGF0ZSwgZ2V0UG9zdCwgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGdldFBvc3QodGl0bGUuSUQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdXBkYXRlKHRpdGxlLklELCBwb3N0LCBjYik7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVQb3N0UmVhZCh0b2dnbGUpIHtcclxuICAgICAgICBjb25zdCB7IGdldFBvc3QsIHJlYWRQb3N0LCB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgZ2V0UG9zdCh0aXRsZS5JRCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkUG9zdCh0aXRsZS5JRCwgdG9nZ2xlLCBjYik7XHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogZmFsc2UgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCBzZWxlY3RlZCwgdGl0bGUsIHRleHQsIGdldFVzZXIsIGhhc1JlYWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkIDwgMCB8fCAhdGl0bGUpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IGVkaXQgPSBjYW5FZGl0KHRpdGxlLkF1dGhvcklEKTtcclxuICAgICAgICBjb25zdCB1c2VyID0gZ2V0VXNlcih0aXRsZS5BdXRob3JJRCk7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yID0gZ2V0RnVsbE5hbWUodXNlcik7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcnVtSGVhZGVyLCB7IGxnOiAxMiwgbmFtZTogYXV0aG9yLCB0aXRsZTogdGl0bGUuVGl0bGUsIGNyZWF0ZWRPbjogdGl0bGUuQ3JlYXRlZE9uLCBtb2RpZmllZE9uOiB0aXRsZS5MYXN0TW9kaWZpZWQgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1CdXR0b25Hcm91cCwgeyBzaG93OiB0cnVlLCBlZGl0YWJsZTogZWRpdCwgaW5pdGlhbFJlYWQ6IGhhc1JlYWQsIG9uRGVsZXRlOiB0aGlzLmRlbGV0ZUhhbmRsZSwgb25FZGl0OiB0aGlzLnRvZ2dsZUVkaXQsIG9uUmVhZDogdGhpcy50b2dnbGVQb3N0UmVhZC5iaW5kKHRoaXMsIHRydWUpLCBvblVucmVhZDogdGhpcy50b2dnbGVQb3N0UmVhZC5iaW5kKHRoaXMsIGZhbHNlKSB9KSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1Cb2R5LCB7IHRleHQ6IHRleHQsIGxnOiAxMCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbiksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ydW1Gb3JtLCB7IHNob3c6IHRoaXMuc3RhdGUuZWRpdCwgY2xvc2U6IHRoaXMuY2xvc2UuYmluZCh0aGlzKSwgb25TdWJtaXQ6IHRoaXMub25TdWJtaXQuYmluZCh0aGlzKSwgZWRpdDogdGhpcy5zdGF0ZS5tb2RlbCB9KSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEZvcnVtQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBsZywgbGdPZmZzZXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgZm9ybWF0dGVkVGV4dCA9IGZvcm1hdFRleHQodGV4dCk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogbGcsIGxnT2Zmc2V0OiBsZ09mZnNldCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZm9ydW0tY29udGVudFwiLCBkYW5nZXJvdXNseVNldElubmVySFRNTDogZm9ybWF0dGVkVGV4dCB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxMiB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKSkpKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRm9ydW1IZWFkZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgZ2V0Q3JlYXRlZE9uVGV4dChjcmVhdGVkT24sIG1vZGlmaWVkT24pIHtcclxuICAgICAgICBjb25zdCBkYXRlID0gbW9tZW50KGNyZWF0ZWRPbik7XHJcbiAgICAgICAgY29uc3QgZGF0ZVRleHQgPSBkYXRlLmZvcm1hdChcIkQtTU0tWVlcIik7XHJcbiAgICAgICAgY29uc3QgdGltZVRleHQgPSBkYXRlLmZvcm1hdChcIiBIOm1tXCIpO1xyXG4gICAgICAgIGlmICghbW9kaWZpZWRPbilcclxuICAgICAgICAgICAgcmV0dXJuIGBVZGdpdmV0ICR7ZGF0ZVRleHR9IGtsLiAke3RpbWVUZXh0fWA7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWQgPSBtb21lbnQobW9kaWZpZWRPbik7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWREYXRlID0gbW9kaWZpZWQuZm9ybWF0KFwiRC1NTS1ZWVwiKTtcclxuICAgICAgICBjb25zdCBtb2RpZmllZFRpbWUgPSBtb2RpZmllZC5mb3JtYXQoXCJIOm1tXCIpO1xyXG4gICAgICAgIHJldHVybiBgVWRnaXZldCAke2RhdGVUZXh0fSBrbC4gJHt0aW1lVGV4dH0gKCByZXR0ZXQgJHttb2RpZmllZERhdGV9IGtsLiAke21vZGlmaWVkVGltZX0gKWA7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgbmFtZSwgY3JlYXRlZE9uLCBtb2RpZmllZE9uLCBsZywgbGdPZmZzZXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuZ2V0Q3JlYXRlZE9uVGV4dChjcmVhdGVkT24sIG1vZGlmaWVkT24pO1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0geyBsZzogbGcsIGxnT2Zmc2V0OiBsZ09mZnNldCB9O1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIF9fYXNzaWduKHt9LCBwcm9wcyksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDNcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LWNhcGl0YWxpemVcIiB9LCB0aXRsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlNrcmV2ZXQgYWYgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LXByaW1hcnlcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcInRpbWVcIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICBcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLCB0aGlzLnByb3BzLmNoaWxkcmVuKSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBGb3J1bUJ1dHRvbkdyb3VwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHJlYWQ6IHByb3BzLmluaXRpYWxSZWFkXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJlYWRIYW5kbGUgPSB0aGlzLnJlYWRIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnVucmVhZEhhbmRsZSA9IHRoaXMudW5yZWFkSGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICByZWFkSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb25SZWFkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnJlYWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVhZDogdHJ1ZSB9KTtcclxuICAgICAgICBvblJlYWQoKTtcclxuICAgIH1cclxuICAgIHVucmVhZEhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IG9uVW5yZWFkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5yZWFkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlYWQ6IGZhbHNlIH0pO1xyXG4gICAgICAgIG9uVW5yZWFkKCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0YWJsZSwgc2hvdywgb25EZWxldGUsIG9uRWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAoIXNob3cpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHsgcmVhZCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEyLCBjbGFzc05hbWU6IFwiZm9ydW0tZWRpdGJhclwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbGJhciwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uR3JvdXAsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sdGlwLCB7IGJzU3R5bGU6IFwiZGFuZ2VyXCIsIG9uQ2xpY2s6IG9uRGVsZXRlLCBpY29uOiBcInRyYXNoXCIsIHRvb2x0aXA6IFwic2xldCBpbmRsw6ZnXCIsIG1vdW50OiBlZGl0YWJsZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2x0aXAsIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6IG9uRWRpdCwgaWNvbjogXCJwZW5jaWxcIiwgdG9vbHRpcDogXCLDpm5kcmUgaW5kbMOmZ1wiLCBhY3RpdmU6IGZhbHNlLCBtb3VudDogZWRpdGFibGUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sdGlwLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCBvbkNsaWNrOiB0aGlzLnJlYWRIYW5kbGUsIGljb246IFwiZXllLW9wZW5cIiwgdG9vbHRpcDogXCJtYXJrZXIgc29tIGzDpnN0XCIsIGFjdGl2ZTogcmVhZCwgbW91bnQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Ub29sdGlwLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCBvbkNsaWNrOiB0aGlzLnVucmVhZEhhbmRsZSwgaWNvbjogXCJleWUtY2xvc2VcIiwgdG9vbHRpcDogXCJtYXJrZXIgc29tIHVsw6ZzdFwiLCBhY3RpdmU6ICFyZWFkLCBtb3VudDogdHJ1ZSB9KSkpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBGb3J1bVBvc3RSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEZvcnVtUG9zdENvbnRhaW5lcik7XHJcbmNvbnN0IEZvcnVtUG9zdCA9IHdpdGhSb3V0ZXIoRm9ydW1Qb3N0UmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBGb3J1bVBvc3Q7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIGFzIFBhZ2luYXRpb25CcyB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIFBhZ2luYXRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG90YWxQYWdlcywgcGFnZSwgcGFnZUhhbmRsZSwgc2hvdyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBtb3JlID0gdG90YWxQYWdlcyA+IDE7XHJcbiAgICAgICAgY29uc3QgeG9yID0gKHNob3cgfHwgbW9yZSkgJiYgIShzaG93ICYmIG1vcmUpO1xyXG4gICAgICAgIGlmICghKHhvciB8fCAoc2hvdyAmJiBtb3JlKSkpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFBhZ2luYXRpb25CcywgeyBwcmV2OiB0cnVlLCBuZXh0OiB0cnVlLCBlbGxpcHNpczogdHJ1ZSwgYm91bmRhcnlMaW5rczogdHJ1ZSwgaXRlbXM6IHRvdGFsUGFnZXMsIG1heEJ1dHRvbnM6IDUsIGFjdGl2ZVBhZ2U6IHBhZ2UsIG9uU2VsZWN0OiBwYWdlSGFuZGxlIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IGZldGNoTGF0ZXN0TmV3cyB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL3doYXRzbmV3XCI7XHJcbmltcG9ydCB7IFdoYXRzTmV3TGlzdCB9IGZyb20gXCIuLi93aGF0c25ldy9XaGF0c05ld0xpc3RcIjtcclxuaW1wb3J0IHsgRm9ydW1IZWFkZXIsIEZvcnVtQm9keSB9IGZyb20gXCIuL0ZvcnVtUG9zdFwiO1xyXG5pbXBvcnQgeyBCdXR0b24sIEJ1dHRvblRvb2xiYXIsIE1vZGFsLCBSb3csIENvbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gXCIuLi9wYWdpbmF0aW9uL1BhZ2luYXRpb25cIjtcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGl0ZW1zOiBzdGF0ZS53aGF0c05ld0luZm8uaXRlbXMsXHJcbiAgICAgICAgZ2V0VXNlcjogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8udXNlcnNbaWRdLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLndoYXRzTmV3SW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLndoYXRzTmV3SW5mby50YWtlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLndoYXRzTmV3SW5mby50b3RhbFBhZ2VzLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLndoYXRzTmV3SW5mby5wYWdlLFxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldExhdGVzdDogKHNraXAsIHRha2UpID0+IGRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSksXHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBXaGF0c05ld0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBtb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBvc3RQcmV2aWV3OiBudWxsLFxyXG4gICAgICAgICAgICBhdXRob3I6IG51bGwsXHJcbiAgICAgICAgICAgIG9uOiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnByZXZpZXdQb3N0ID0gdGhpcy5wcmV2aWV3UG9zdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VNb2RhbCA9IHRoaXMuY2xvc2VNb2RhbC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubW9kYWxWaWV3ID0gdGhpcy5tb2RhbFZpZXcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm5hdmlnYXRlVG8gPSB0aGlzLm5hdmlnYXRlVG8uYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHBhZ2VIYW5kbGUodG8pIHtcclxuICAgICAgICBjb25zdCB7IGdldExhdGVzdCwgcGFnZSwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAocGFnZSA9PT0gdG8pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSB0byAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIGdldExhdGVzdChza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG4gICAgcHJldmlld1Bvc3QoaXRlbSkge1xyXG4gICAgICAgIGNvbnN0IHsgZ2V0VXNlciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRVc2VyKGl0ZW0uQXV0aG9ySUQpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBtb2RhbDogdHJ1ZSxcclxuICAgICAgICAgICAgcG9zdFByZXZpZXc6IGl0ZW0uSXRlbSxcclxuICAgICAgICAgICAgYXV0aG9yOiBhdXRob3IsXHJcbiAgICAgICAgICAgIG9uOiBpdGVtLk9uXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvKHVybCkge1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgcHVzaCh1cmwpO1xyXG4gICAgfVxyXG4gICAgY2xvc2VNb2RhbCgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBwb3N0UHJldmlldzogbnVsbCxcclxuICAgICAgICAgICAgYXV0aG9yOiBudWxsLFxyXG4gICAgICAgICAgICBvbjogbnVsbFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbW9kYWxWaWV3KCkge1xyXG4gICAgICAgIGlmICghQm9vbGVhbih0aGlzLnN0YXRlLnBvc3RQcmV2aWV3KSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyBUZXh0LCBUaXRsZSwgSUQgfSA9IHRoaXMuc3RhdGUucG9zdFByZXZpZXc7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yID0gdGhpcy5zdGF0ZS5hdXRob3I7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGAke2F1dGhvci5GaXJzdE5hbWV9ICR7YXV0aG9yLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgY29uc3QgbGluayA9IGBmb3J1bS9wb3N0LyR7SUR9L2NvbW1lbnRzYDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbCwgeyBzaG93OiB0aGlzLnN0YXRlLm1vZGFsLCBvbkhpZGU6IHRoaXMuY2xvc2VNb2RhbCwgYnNTaXplOiBcImxhcmdlXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5IZWFkZXIsIHsgY2xvc2VCdXR0b246IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuVGl0bGUsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3J1bUhlYWRlciwgeyBsZzogMTEsIGxnT2Zmc2V0OiAxLCBjcmVhdGVkT246IHRoaXMuc3RhdGUub24sIHRpdGxlOiBUaXRsZSwgbmFtZTogbmFtZSB9KSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcnVtQm9keSwgeyB0ZXh0OiBUZXh0LCBsZzogMTEsIGxnT2Zmc2V0OiAxIH0pKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5Gb290ZXIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvblRvb2xiYXIsIHsgc3R5bGU6IHsgZmxvYXQ6IFwicmlnaHRcIiB9IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogXCJwcmltYXJ5XCIsIG9uQ2xpY2s6ICgpID0+IHRoaXMubmF2aWdhdGVUbyhsaW5rKSB9LCBcIlNlIGtvbW1lbnRhcmVyIChmb3J1bSlcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgb25DbGljazogdGhpcy5jbG9zZU1vZGFsIH0sIFwiTHVrXCIpKSkpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIsIHRvdGFsUGFnZXMsIHBhZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLCBcIlNpZHN0ZSBoXFx1MDBFNm5kZWxzZXJcIiksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFdoYXRzTmV3TGlzdCwgeyBpdGVtczogaXRlbXMsIGdldFVzZXI6IGdldFVzZXIsIHByZXZpZXc6IHRoaXMucHJldmlld1Bvc3QgfSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhZ2luYXRpb24sIHsgdG90YWxQYWdlczogdG90YWxQYWdlcywgcGFnZTogcGFnZSwgcGFnZUhhbmRsZTogdGhpcy5wYWdlSGFuZGxlIH0pLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbFZpZXcoKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IFdoYXRzTmV3ID0gd2l0aFJvdXRlcihjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShXaGF0c05ld0NvbnRhaW5lcikpO1xyXG5leHBvcnQgZGVmYXVsdCBXaGF0c05ldztcclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEp1bWJvdHJvbiwgR3JpZCwgUm93LCBDb2wsIFBhbmVsLCBBbGVydCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBmZXRjaExhdGVzdE5ld3MgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy93aGF0c25ld1wiO1xyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZCB9IGZyb20gXCIuLi9pbWFnZXMvSW1hZ2VVcGxvYWRcIjtcclxuaW1wb3J0IHsgdXBsb2FkSW1hZ2UgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9pbWFnZXNcIjtcclxuaW1wb3J0IFVzZWRTcGFjZSBmcm9tIFwiLi9Vc2VkU3BhY2VcIjtcclxuaW1wb3J0IFdoYXRzTmV3IGZyb20gXCIuL1doYXRzTmV3XCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZF07XHJcbiAgICBjb25zdCBuYW1lID0gdXNlciA/IHVzZXIuVXNlcm5hbWUgOiBcIlVzZXJcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlcm5hbWU6IG5hbWUsXHJcbiAgICAgICAgc2tpcDogc3RhdGUud2hhdHNOZXdJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUud2hhdHNOZXdJbmZvLnRha2VcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGxvYWRJbWFnZTogKHNraXAsIHRha2UsIHVzZXJuYW1lLCBkZXNjcmlwdGlvbiwgZm9ybURhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb25TdWNjZXNzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZGlzcGF0Y2godXBsb2FkSW1hZ2UodXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSwgb25TdWNjZXNzLCAocikgPT4geyBjb25zb2xlLmxvZyhyKTsgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIEhvbWVDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgcmVjb21tZW5kZWQ6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBsb2FkID0gdGhpcy51cGxvYWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlY29tbWVuZGVkVmlldyA9IHRoaXMucmVjb21tZW5kZWRWaWV3LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiRm9yc2lkZVwiO1xyXG4gICAgfVxyXG4gICAgdXBsb2FkKHVzZXJuYW1lLCBkZXNjcmlwdGlvbiwgZm9ybURhdGEpIHtcclxuICAgICAgICBjb25zdCB7IHVwbG9hZEltYWdlLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHVwbG9hZEltYWdlKHNraXAsIHRha2UsIHVzZXJuYW1lLCBkZXNjcmlwdGlvbiwgZm9ybURhdGEpO1xyXG4gICAgfVxyXG4gICAgcmVjb21tZW5kZWRWaWV3KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5yZWNvbW1lbmRlZClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWxlcnQsIHsgYnNTdHlsZTogXCJzdWNjZXNzXCIsIG9uRGlzbWlzczogKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IHJlY29tbWVuZGVkOiBmYWxzZSB9KSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNFwiLCBudWxsLCBcIkFuYmVmYWxpbmdlclwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRlc3RldCBtZWQgR29vZ2xlIENocm9tZSBicm93c2VyLiBEZXJmb3IgZXIgZGV0IGFuYmVmYWxldCBhdCBicnVnZSBkZW5uZSB0aWwgYXQgZlxcdTAwRTUgZGVuIGZ1bGRlIG9wbGV2ZWxzZS5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSkpKSkpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gZ2xvYmFscy5jdXJyZW50VXNlcm5hbWU7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEp1bWJvdHJvbiwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVmVsa29tbWVuIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic21hbGxcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIhXCIpKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJsZWFkXCIgfSwgXCJUaWwgSW51cGxhbnMgZm9ydW0gb2cgYmlsbGVkLWFya2l2IHNpZGVcIiksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhbmVsLCB7IGhlYWRlcjogXCJEdSBrYW4gdXBsb2FkZSBiaWxsZWRlciB0aWwgZGl0IGVnZXQgZ2FsbGVyaSBoZXJcIiwgYnNTdHlsZTogXCJwcmltYXJ5XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1hZ2VVcGxvYWQsIHsgdXNlcm5hbWU6IHVzZXJuYW1lLCB1cGxvYWRJbWFnZTogdGhpcy51cGxvYWQgfSkpKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdyaWQsIHsgZmx1aWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA0IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2hhdHNOZXcsIG51bGwpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMSwgbGc6IDMgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNvbW1lbmRlZFZpZXcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIG51bGwsIFwiUGVyc29ubGlnIHVwbG9hZCBmb3JicnVnXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIFwiSGVydW5kZXIga2FuIGR1IHNlIGh2b3IgbWVnZXQgcGxhZHMgZHUgaGFyIGJydWd0IG9nIGh2b3IgbWVnZXQgZnJpIHBsYWRzXCIgKyBcIiBcIiArIFwiZGVyIGVyIHRpbGJhZ2UuIEdcXHUwMEU2bGRlciBrdW4gYmlsbGVkZSBmaWxlci5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlZFNwYWNlLCBudWxsKSkpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgSG9tZSA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEhvbWVDb250YWluZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBIb21lO1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcnVtIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRm9ydW0gXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsIFwiaW5kbFxcdTAwRTZnXCIpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4pKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIEdseXBoaWNvbiwgT3ZlcmxheVRyaWdnZXIsIFRvb2x0aXAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IGdldFdvcmRzIH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5leHBvcnQgY2xhc3MgRm9ydW1UaXRsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBkYXRlVmlldyhkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZGF5TW9udGhZZWFyID0gbW9tZW50KGRhdGUpLmZvcm1hdChcIkQvTU0vWVlcIik7XHJcbiAgICAgICAgcmV0dXJuIGAke2RheU1vbnRoWWVhcn1gO1xyXG4gICAgfVxyXG4gICAgbW9kaWZpZWRWaWV3KG1vZGlmaWVkT24pIHtcclxuICAgICAgICBpZiAoIW1vZGlmaWVkT24pXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkRGF0ZSA9IG1vbWVudChtb2RpZmllZE9uKS5mb3JtYXQoXCJEL01NL1lZLUg6bW1cIik7XHJcbiAgICAgICAgcmV0dXJuIGAke21vZGlmaWVkRGF0ZX1gO1xyXG4gICAgfVxyXG4gICAgdG9vbHRpcFZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9vbHRpcCwgeyBpZDogXCJ0b29sdGlwXCIgfSwgXCJWaWd0aWdcIik7XHJcbiAgICB9XHJcbiAgICBzdGlja3lJY29uKHNob3cpIHtcclxuICAgICAgICBpZiAoIXNob3cpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJzdGlja3lcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE92ZXJsYXlUcmlnZ2VyLCB7IHBsYWNlbWVudDogXCJ0b3BcIiwgb3ZlcmxheTogdGhpcy50b29sdGlwVmlldygpIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdseXBoaWNvbiwgeyBnbHlwaDogXCJwdXNocGluXCIgfSkpKTtcclxuICAgIH1cclxuICAgIGRhdGVNb2RpZmllZFZpZXcodGl0bGUpIHtcclxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5kYXRlVmlldyh0aXRsZS5DcmVhdGVkT24pO1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWQgPSB0aGlzLm1vZGlmaWVkVmlldyh0aXRsZS5MYXN0TW9kaWZpZWQpO1xyXG4gICAgICAgIGlmICghdXBkYXRlZClcclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIGNyZWF0ZWQpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLFxyXG4gICAgICAgICAgICBjcmVhdGVkLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgIFwiKFwiLFxyXG4gICAgICAgICAgICB1cGRhdGVkLFxyXG4gICAgICAgICAgICBcIilcIik7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVTdW1tYXJ5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCF0aXRsZS5MYXRlc3RDb21tZW50KVxyXG4gICAgICAgICAgICByZXR1cm4gXCJJbmdlbiBrb21tZW50YXJlclwiO1xyXG4gICAgICAgIGlmICh0aXRsZS5MYXRlc3RDb21tZW50LkRlbGV0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBcIktvbW1lbnRhciBzbGV0dGV0XCI7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRpdGxlLkxhdGVzdENvbW1lbnQuVGV4dDtcclxuICAgICAgICByZXR1cm4gZ2V0V29yZHModGV4dCwgNSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgZ2V0QXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBnZXRBdXRob3IodGl0bGUuQXV0aG9ySUQpO1xyXG4gICAgICAgIGNvbnN0IGxhdGVzdENvbW1lbnQgPSB0aGlzLmNyZWF0ZVN1bW1hcnkoKTtcclxuICAgICAgICBjb25zdCBjc3MgPSB0aXRsZS5TdGlja3kgPyBcInRocmVhZCB0aHJlYWQtcGlubmVkXCIgOiBcInRocmVhZFwiO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBgL2ZvcnVtL3Bvc3QvJHt0aXRsZS5JRH0vY29tbWVudHNgO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IHBhdGggfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsgY2xhc3NOYW1lOiBjc3MgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxLCBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LCB0aGlzLnN0aWNreUljb24odGl0bGUuU3RpY2t5KSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LWNhcGl0YWxpemVcIiB9LCB0aXRsZS5UaXRsZSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFmOiBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIsIGNsYXNzTmFtZTogXCJ0ZXh0LWxlZnRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIHRoaXMuZGF0ZU1vZGlmaWVkVmlldyh0aXRsZSkpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyLCBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIHRpdGxlLlZpZXdlZEJ5Lmxlbmd0aCkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIsIGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCwgbGF0ZXN0Q29tbWVudCkpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBCdXR0b25Hcm91cCwgQnV0dG9uIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBGb3J1bVRpdGxlIH0gZnJvbSBcIi4uL2ZvcnVtL0ZvcnVtVGl0bGVcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBmZXRjaFRocmVhZHMsIHBvc3RUaHJlYWQgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9mb3J1bVwiO1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSBcIi4uL3BhZ2luYXRpb24vUGFnaW5hdGlvblwiO1xyXG5pbXBvcnQgeyBGb3J1bUZvcm0gfSBmcm9tIFwiLi4vZm9ydW0vRm9ydW1Gb3JtXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0aHJlYWRzOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby50aXRsZXMsXHJcbiAgICAgICAgc2tpcDogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby50YWtlLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnBhZ2UsXHJcbiAgICAgICAgdG90YWxQYWdlczogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8udG90YWxQYWdlcyxcclxuICAgICAgICBnZXRBdXRob3I6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW2lkXTtcclxuICAgICAgICAgICAgcmV0dXJuIGAke3VzZXIuRmlyc3ROYW1lfSAke3VzZXIuTGFzdE5hbWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZldGNoVGhyZWFkczogKHNraXAsIHRha2UpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hUaHJlYWRzKHNraXAsIHRha2UpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RUaHJlYWQ6IChjYiwgcG9zdCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0VGhyZWFkKHBvc3QsIGNiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuY2xhc3MgRm9ydW1MaXN0Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5ld1Bvc3Q6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBcIkludXBsYW4gRm9ydW1cIjtcclxuICAgIH1cclxuICAgIHBhZ2VIYW5kbGUodG8pIHtcclxuICAgICAgICBjb25zdCB7IGZldGNoVGhyZWFkcywgcGFnZSwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAocGFnZSA9PT0gdG8pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAodG8gLSAxKSAqIHRha2U7XHJcbiAgICAgICAgZmV0Y2hUaHJlYWRzKHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcbiAgICB0aHJlYWRWaWV3cygpIHtcclxuICAgICAgICBjb25zdCB7IHRocmVhZHMsIGdldEF1dGhvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gdGhyZWFkcy5tYXAodGhyZWFkID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSBgdGhyZWFkXyR7dGhyZWFkLklEfWA7XHJcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcnVtVGl0bGUsIHsgdGl0bGU6IHRocmVhZCwga2V5OiBpZCwgZ2V0QXV0aG9yOiBnZXRBdXRob3IgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdWJtaXQocG9zdCkge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdFRocmVhZCwgZmV0Y2hUaHJlYWRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHBvc3RUaHJlYWQoKCkgPT4gZmV0Y2hUaHJlYWRzKHNraXAsIHRha2UpLCBwb3N0KTtcclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBuZXdQb3N0OiBmYWxzZSB9KTtcclxuICAgIH1cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5ld1Bvc3Q6IHRydWUgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBwYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b25Hcm91cCwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGJzU3R5bGU6IFwicHJpbWFyeVwiLCBvbkNsaWNrOiB0aGlzLnNob3cuYmluZCh0aGlzKSB9LCBcIlRpbGZcXHUwMEY4aiBueXQgaW5kbFxcdTAwRTZnXCIpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEyIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBjbGFzc05hbWU6IFwidGhyZWFkLWhlYWRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAxIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJJbmZvXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiT3ZlcnNrcmlmdFwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDIsIGNsYXNzTmFtZTogXCJ0ZXh0LWNlbnRlclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJEYXRvXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMiwgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBcIkxcXHUwMEU2c3QgYWZcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAyLCBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiU2VuZXN0ZSBrb21tZW50YXJcIikpKSxcclxuICAgICAgICAgICAgICAgIHRoaXMudGhyZWFkVmlld3MoKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbiwgeyB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzLCBwYWdlOiBwYWdlLCBwYWdlSGFuZGxlOiB0aGlzLnBhZ2VIYW5kbGUsIHNob3c6IHRydWUgfSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcnVtRm9ybSwgeyBzaG93OiB0aGlzLnN0YXRlLm5ld1Bvc3QsIGNsb3NlOiB0aGlzLmNsb3NlLmJpbmQodGhpcyksIG9uU3VibWl0OiB0aGlzLnN1Ym1pdC5iaW5kKHRoaXMpIH0pKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBGb3J1bUxpc3QgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShGb3J1bUxpc3RDb250YWluZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBGb3J1bUxpc3Q7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBNZWRpYSwgR2x5cGhpY29uIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgQ29tbWVudERlbGV0ZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbGllcywgY29uc3RydWN0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSByZXBsaWVzLm1hcChyZXBseSA9PiBjb25zdHJ1Y3QocmVwbHkpKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYSwgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MZWZ0LCB7IGNsYXNzTmFtZTogXCJjb21tZW50LWRlbGV0ZWQtbGVmdFwiIH0pLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkJvZHksIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJ0ZXh0LW11dGVkIGNvbW1lbnQtZGVsZXRlZFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicmVtb3ZlLXNpZ25cIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIgS29tbWVudGFyIHNsZXR0ZXRcIikpLFxyXG4gICAgICAgICAgICAgICAgcmVwbHlOb2RlcykpO1xyXG4gICAgfVxyXG59XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBDb21tZW50Q29udHJvbHMgfSBmcm9tIFwiLi9Db21tZW50Q29udHJvbHNcIjtcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tIFwiLi9Db21tZW50UHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCB0aW1lVGV4dCB9IGZyb20gXCIuLi8uLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFnbygpIHtcclxuICAgICAgICBjb25zdCB7IHBvc3RlZE9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB0aW1lVGV4dChwb3N0ZWRPbik7XHJcbiAgICB9XHJcbiAgICBlZGl0ZWRWaWV3KGVkaXRlZCkge1xyXG4gICAgICAgIGlmICghZWRpdGVkKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgXCIqXCIpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgY29udGV4dElkLCBuYW1lLCB0ZXh0LCBjb21tZW50SWQsIHJlcGxpZXMsIGNvbnN0cnVjdCwgYXV0aG9ySWQsIGVkaXRlZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfTtcclxuICAgICAgICBjb25zdCB0eHQgPSBmb3JtYXRUZXh0KHRleHQpO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSByZXBsaWVzLm1hcChyZXBseSA9PiBjb25zdHJ1Y3QocmVwbHkpKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYSwgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50UHJvZmlsZSwgbnVsbCksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVkaWEuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNVwiLCB7IGNsYXNzTmFtZTogXCJtZWRpYS1oZWFkaW5nXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIG5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNhZ2RlIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFnbygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRlZFZpZXcoZWRpdGVkKSkpLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBkYW5nZXJvdXNseVNldElubmVySFRNTDogdHh0IH0pLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50Q29udHJvbHMsIF9fYXNzaWduKHsgY29udGV4dElkOiBjb250ZXh0SWQsIGNhbkVkaXQ6IGNhbkVkaXQsIGF1dGhvcklkOiBhdXRob3JJZCwgY29tbWVudElkOiBjb21tZW50SWQsIHRleHQ6IHRleHQgfSwgcHJvcHMpKSxcclxuICAgICAgICAgICAgICAgIHJlcGx5Tm9kZXMpKTtcclxuICAgIH1cclxufVxyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudERlbGV0ZWQgfSBmcm9tIFwiLi9Db21tZW50RGVsZXRlZFwiO1xyXG5pbXBvcnQgeyBDb21tZW50IH0gZnJvbSBcIi4vQ29tbWVudFwiO1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuZXhwb3J0IGNsYXNzIENvbW1lbnRMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuY29uc3RydWN0Q29tbWVudCA9IHRoaXMuY29uc3RydWN0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcm9vdENvbW1lbnRzKGNvbW1lbnRzKSB7XHJcbiAgICAgICAgaWYgKCFjb21tZW50cylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGNvbW1lbnRzLm1hcCgoY29tbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5jb25zdHJ1Y3RDb21tZW50KGNvbW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNZWRpYS5MaXN0SXRlbSwgeyBrZXk6IFwicm9vdENvbW1lbnRfXCIgKyBjb21tZW50LkNvbW1lbnRJRCB9LCBub2RlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdENvbW1lbnQoY29tbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IFwiY29tbWVudElkXCIgKyBjb21tZW50LkNvbW1lbnRJRDtcclxuICAgICAgICBpZiAoY29tbWVudC5EZWxldGVkKVxyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50RGVsZXRlZCwgeyBrZXk6IGtleSwgY29uc3RydWN0OiB0aGlzLmNvbnN0cnVjdENvbW1lbnQsIHJlcGxpZXM6IGNvbW1lbnQuUmVwbGllcyB9KTtcclxuICAgICAgICBjb25zdCB7IGNvbnRleHRJZCwgZ2V0TmFtZSwgY2FuRWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY29udHJvbHMgPSB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfTtcclxuICAgICAgICBjb25zdCBuYW1lID0gZ2V0TmFtZShjb21tZW50LkF1dGhvcklEKTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50LCBfX2Fzc2lnbih7IGtleToga2V5LCBjb250ZXh0SWQ6IGNvbnRleHRJZCwgbmFtZTogbmFtZSwgcG9zdGVkT246IGNvbW1lbnQuUG9zdGVkT24sIGF1dGhvcklkOiBjb21tZW50LkF1dGhvcklELCB0ZXh0OiBjb21tZW50LlRleHQsIGNvbnN0cnVjdDogdGhpcy5jb25zdHJ1Y3RDb21tZW50LCByZXBsaWVzOiBjb21tZW50LlJlcGxpZXMsIGVkaXRlZDogY29tbWVudC5FZGl0ZWQsIGNhbkVkaXQ6IGNhbkVkaXQsIGNvbW1lbnRJZDogY29tbWVudC5Db21tZW50SUQgfSwgY29udHJvbHMpKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5yb290Q29tbWVudHMoY29tbWVudHMpO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE1lZGlhLkxpc3QsIG51bGwsIG5vZGVzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuZXhwb3J0IGNsYXNzIENvbW1lbnRGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIFRleHQ6IFwiXCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucG9zdENvbW1lbnQgPSB0aGlzLnBvc3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwb3N0Q29tbWVudChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwb3N0SGFuZGxlKHRoaXMuc3RhdGUuVGV4dCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IFwiXCIgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIHsgb25TdWJtaXQ6IHRoaXMucG9zdENvbW1lbnQgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHsgaHRtbEZvcjogXCJyZW1hcmtcIiB9LCBcIktvbW1lbnRhclwiKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIsIHsgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLCB2YWx1ZTogdGhpcy5zdGF0ZS5UZXh0LCBwbGFjZWhvbGRlcjogXCJTa3JpdiBrb21tZW50YXIgaGVyLi4uXCIsIGlkOiBcInJlbWFya1wiLCByb3dzOiA0IH0pLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyB0eXBlOiBcInN1Ym1pdFwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCIgfSwgXCJTZW5kXCIpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBmZXRjaCBmcm9tIFwiaXNvbW9ycGhpYy1mZXRjaFwiO1xyXG5pbXBvcnQgeyBvcHRpb25zLCBub3JtYWxpemVDb21tZW50LCByZXNwb25zZUhhbmRsZXIgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmV4cG9ydCBjb25zdCBzZXRTa2lwQ29tbWVudHMgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzNCxcclxuICAgICAgICBwYXlsb2FkOiBza2lwXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RGVmYXVsdFNraXAgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDM1XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RGVmYXVsdFRha2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDM2XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0VGFrZUNvbW1lbnRzID0gKHRha2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzcsXHJcbiAgICAgICAgcGF5bG9hZDogdGFrZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldEN1cnJlbnRQYWdlID0gKHBhZ2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogMzgsXHJcbiAgICAgICAgcGF5bG9hZDogcGFnZVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHNldFRvdGFsUGFnZXMgPSAodG90YWxQYWdlcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAzOSxcclxuICAgICAgICBwYXlsb2FkOiB0b3RhbFBhZ2VzXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0RGVmYXVsdENvbW1lbnRzID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiA0MFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHJlY2VpdmVkQ29tbWVudHMgPSAoY29tbWVudHMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNDEsXHJcbiAgICAgICAgcGF5bG9hZDogY29tbWVudHNcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBhZGRDb21tZW50ID0gKGNvbW1lbnQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogNDIsXHJcbiAgICAgICAgcGF5bG9hZDogW2NvbW1lbnRdXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0Rm9jdXNlZENvbW1lbnQgPSAoY29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IDQzLFxyXG4gICAgICAgIHBheWxvYWQ6IGNvbW1lbnRJZFxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IG5ld0NvbW1lbnRGcm9tU2VydmVyID0gKGNvbW1lbnQpID0+IHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZSA9IG5vcm1hbGl6ZUNvbW1lbnQoY29tbWVudCk7XHJcbiAgICByZXR1cm4gYWRkQ29tbWVudChub3JtYWxpemUpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hDb21tZW50cyA9ICh1cmwsIHNraXAsIHRha2UpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFnZUNvbW1lbnRzID0gZGF0YS5DdXJyZW50SXRlbXM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNraXBDb21tZW50cyhza2lwKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2VDb21tZW50cyh0YWtlKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEN1cnJlbnRQYWdlKGRhdGEuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxQYWdlcyhkYXRhLlRvdGFsUGFnZXMpKTtcclxuICAgICAgICAgICAgY29uc3QgY29tbWVudHMgPSBwYWdlQ29tbWVudHMubWFwKG5vcm1hbGl6ZUNvbW1lbnQpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlZENvbW1lbnRzKGNvbW1lbnRzKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgcG9zdENvbW1lbnQgPSAodXJsLCBjb250ZXh0SWQsIHRleHQsIHBhcmVudENvbW1lbnRJZCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoXykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBUZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICBDb250ZXh0SUQ6IGNvbnRleHRJZCxcclxuICAgICAgICAgICAgUGFyZW50SUQ6IHBhcmVudENvbW1lbnRJZFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgYm9keTogYm9keSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGVkaXRDb21tZW50ID0gKHVybCwgY29tbWVudElkLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgcmV0dXJuIChfKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IElEOiBjb21tZW50SWQsIFRleHQ6IHRleHQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGNiKTtcclxuICAgIH07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBkZWxldGVDb21tZW50ID0gKHVybCwgY2IpID0+IHtcclxuICAgIHJldHVybiAoXykgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50c30vR2V0U2luZ2xlP2lkPSR7aWR9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyKGRpc3BhdGNoKShyID0+IHIuanNvbigpKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihjID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IG5vcm1hbGl6ZUNvbW1lbnQoYyk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVkQ29tbWVudHMoW2NvbW1lbnRdKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEZvY3VzZWRDb21tZW50KGNvbW1lbnQuQ29tbWVudElEKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudExpc3QgfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudExpc3RcIjtcclxuaW1wb3J0IHsgQ29tbWVudEZvcm0gfSBmcm9tIFwiLi4vY29tbWVudHMvQ29tbWVudEZvcm1cIjtcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gXCIuLi9wYWdpbmF0aW9uL1BhZ2luYXRpb25cIjtcclxuaW1wb3J0IHsgZmV0Y2hDb21tZW50cywgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvY29tbWVudHNcIjtcclxuaW1wb3J0IHsgZ2V0Rm9ydW1Db21tZW50c0RlbGV0ZVVybCwgZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb21tZW50czogc3RhdGUuY29tbWVudHNJbmZvLmNvbW1lbnRzLFxyXG4gICAgICAgIGdldE5hbWU6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW2lkXTtcclxuICAgICAgICAgICAgaWYgKCF1c2VyKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09PSBpZCxcclxuICAgICAgICBwb3N0SWQ6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnNlbGVjdGVkVGhyZWFkLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLmNvbW1lbnRzSW5mby5wYWdlLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmNvbW1lbnRzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmNvbW1lbnRzSW5mby50YWtlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLmNvbW1lbnRzSW5mby50b3RhbFBhZ2VzLFxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGVkaXRIYW5kbGU6IChjb21tZW50SWQsIF8sIHRleHQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChlZGl0Q29tbWVudCh1cmwsIGNvbW1lbnRJZCwgdGV4dCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZTogKGNvbW1lbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0Rm9ydW1Db21tZW50c0RlbGV0ZVVybChjb21tZW50SWQpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVDb21tZW50KHVybCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcGx5SGFuZGxlOiAocG9zdElkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgcG9zdElkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvYWRDb21tZW50czogKHBvc3RJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybChwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdEhhbmRsZTogKHBvc3RJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgcG9zdElkLCB0ZXh0LCBudWxsLCBjYikpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIEZvcnVtQ29tbWVudHNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDb21tZW50ID0gdGhpcy5kZWxldGVDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5lZGl0Q29tbWVudCA9IHRoaXMuZWRpdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlcGx5Q29tbWVudCA9IHRoaXMucmVwbHlDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5wb3N0Q29tbWVudCA9IHRoaXMucG9zdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIHBvc3RJZCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHBhZ2UgfSA9IG5leHRQcm9wcy5sb2NhdGlvbi5xdWVyeTtcclxuICAgICAgICBpZiAoIU51bWJlcihwYWdlKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHBhZ2UgLSAxO1xyXG4gICAgICAgIGNvbnN0IHNraXBJdGVtcyA9IChza2lwUGFnZXMgKiB0YWtlKTtcclxuICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdElkLCBwYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgaWYgKHBhZ2UgPT09IHRvKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdXJsID0gYC9mb3J1bS9wb3N0LyR7cG9zdElkfS9jb21tZW50cz9wYWdlPSR7dG99YDtcclxuICAgICAgICBwdXNoKHVybCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGVDb21tZW50KGNvbW1lbnRJZCwgcG9zdElkKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVIYW5kbGUsIGxvYWRDb21tZW50cywgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKHBvc3RJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkZWxldGVIYW5kbGUoY29tbWVudElkLCBjYik7XHJcbiAgICB9XHJcbiAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIHBvc3RJZCwgdGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdEhhbmRsZSwgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGVkaXRIYW5kbGUoY29tbWVudElkLCBwb3N0SWQsIHRleHQsIGNiKTtcclxuICAgIH1cclxuICAgIHJlcGx5Q29tbWVudChwb3N0SWQsIHRleHQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSwgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcGx5SGFuZGxlKHBvc3RJZCwgdGV4dCwgcGFyZW50SWQsIGNiKTtcclxuICAgIH1cclxuICAgIHBvc3RDb21tZW50KHRleHQpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgcG9zdElkLCBza2lwLCB0YWtlLCBwb3N0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHBvc3RIYW5kbGUocG9zdElkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50cywgZ2V0TmFtZSwgY2FuRWRpdCwgdG90YWxQYWdlcywgcGFnZSwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGlkIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCBjb250cm9scyA9IHtcclxuICAgICAgICAgICAgc2tpcCxcclxuICAgICAgICAgICAgdGFrZSxcclxuICAgICAgICAgICAgZGVsZXRlQ29tbWVudDogdGhpcy5kZWxldGVDb21tZW50LFxyXG4gICAgICAgICAgICBlZGl0Q29tbWVudDogdGhpcy5lZGl0Q29tbWVudCxcclxuICAgICAgICAgICAgcmVwbHlDb21tZW50OiB0aGlzLnJlcGx5Q29tbWVudFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCB7IGNsYXNzTmFtZTogXCJmb3J1bS1jb21tZW50cy1saXN0XCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIHsgY2xhc3NOYW1lOiBcImZvcnVtLWNvbW1lbnRzLWhlYWRpbmdcIiB9LCBcIktvbW1lbnRhcmVyXCIpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRMaXN0LCBfX2Fzc2lnbih7IGNvbW1lbnRzOiBjb21tZW50cywgY29udGV4dElkOiBOdW1iZXIoaWQpLCBnZXROYW1lOiBnZXROYW1lLCBjYW5FZGl0OiBjYW5FZGl0IH0sIGNvbnRyb2xzKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbiwgeyB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzLCBwYWdlOiBwYWdlLCBwYWdlSGFuZGxlOiB0aGlzLnBhZ2VIYW5kbGUgfSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDEyIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudEZvcm0sIHsgcG9zdEhhbmRsZTogdGhpcy5wb3N0Q29tbWVudCB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCkpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgRm9ydW1Db21tZW50c0NvbnRhaW5lclJlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRm9ydW1Db21tZW50c0NvbnRhaW5lcik7XHJcbmNvbnN0IEZvcnVtQ29tbWVudHMgPSB3aXRoUm91dGVyKEZvcnVtQ29tbWVudHNDb250YWluZXJSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IEZvcnVtQ29tbWVudHM7XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCwgUGFuZWwgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmV4cG9ydCBjbGFzcyBVc2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lLCBmaXJzdE5hbWUsIGxhc3ROYW1lLCBlbWFpbCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBlbWFpbExpbmsgPSBcIm1haWx0bzpcIiArIGVtYWlsO1xyXG4gICAgICAgIGNvbnN0IGdhbGxlcnkgPSBcIi9cIiArIHVzZXJuYW1lICsgXCIvZ2FsbGVyeVwiO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogMyB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBhbmVsLCB7IGhlYWRlcjogYCR7Zmlyc3ROYW1lfSAke2xhc3ROYW1lfWAgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckl0ZW0sIHsgdGl0bGU6IFwiQnJ1Z2VybmF2blwiIH0sIHVzZXJuYW1lKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckl0ZW0sIHsgdGl0bGU6IFwiRW1haWxcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogZW1haWxMaW5rIH0sIGVtYWlsKSksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXJJdGVtLCB7IHRpdGxlOiBcIkJpbGxlZGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IGdhbGxlcnkgfSwgXCJCaWxsZWRlclwiKSkpKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBVc2VySGVhZGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA2IH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgdGhpcy5wcm9wcy5jaGlsZHJlbikpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIFVzZXJCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGc6IDYgfSwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgVXNlckl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXJIZWFkaW5nLCBudWxsLCB0aXRsZSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckJvZHksIG51bGwsIHRoaXMucHJvcHMuY2hpbGRyZW4pKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuL1VzZXJcIjtcclxuaW1wb3J0IHsgUm93IH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgVXNlckxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgdXNlck5vZGVzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VySWQgPSBgdXNlcklkXyR7dXNlci5JRH1gO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChVc2VyLCB7IHVzZXJuYW1lOiB1c2VyLlVzZXJuYW1lLCB1c2VySWQ6IHVzZXIuSUQsIGZpcnN0TmFtZTogdXNlci5GaXJzdE5hbWUsIGxhc3ROYW1lOiB1c2VyLkxhc3ROYW1lLCBlbWFpbDogdXNlci5FbWFpbCwgcHJvZmlsZVVybDogdXNlci5Qcm9maWxlSW1hZ2UsIHJvbGVzOiB1c2VyLlJvbGUsIGtleTogdXNlcklkIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCwgdGhpcy51c2VyTm9kZXMoKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmV4cG9ydCBjbGFzcyBCcmVhZGNydW1iIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcIm9sXCIsIHsgY2xhc3NOYW1lOiBcImJyZWFkY3J1bWJcIiB9LCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcclxuICAgIH1cclxufVxyXG4oZnVuY3Rpb24gKEJyZWFkY3J1bWIpIHtcclxuICAgIGNsYXNzIEl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgICAgIHJlbmRlcigpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBocmVmLCBhY3RpdmUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIGlmIChhY3RpdmUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHsgY2xhc3NOYW1lOiBcImFjdGl2ZVwiIH0sIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgdG86IGhyZWYgfSwgdGhpcy5wcm9wcy5jaGlsZHJlbikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEJyZWFkY3J1bWIuSXRlbSA9IEl0ZW07XHJcbn0pKEJyZWFkY3J1bWIgfHwgKEJyZWFkY3J1bWIgPSB7fSkpO1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBmZXRjaFVzZXJzIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvdXNlcnNcIjtcclxuaW1wb3J0IHsgVXNlckxpc3QgfSBmcm9tIFwiLi4vdXNlcnMvVXNlckxpc3RcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wsIFBhZ2VIZWFkZXIgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IEJyZWFkY3J1bWIgfSBmcm9tIFwiLi4vYnJlYWRjcnVtYnMvQnJlYWRjcnVtYlwiO1xyXG5pbXBvcnQgeyB2YWx1ZXMgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5jb25zdCBtYXBVc2Vyc1RvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlcnM6IHZhbHVlcyhzdGF0ZS51c2Vyc0luZm8udXNlcnMpXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0VXNlcnM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hVc2VycygpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBVc2Vyc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiQnJ1Z2VyZVwiO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAyLCBsZzogOCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLkl0ZW0sIHsgaHJlZjogXCIvXCIgfSwgXCJGb3JzaWRlXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIuSXRlbSwgeyBhY3RpdmU6IHRydWUgfSwgXCJCcnVnZXJlXCIpKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnZUhlYWRlciwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcIkludXBsYW4ncyBcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic21hbGxcIiwgbnVsbCwgXCJicnVnZXJlXCIpKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckxpc3QsIHsgdXNlcnM6IHVzZXJzIH0pKSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IFVzZXJzID0gY29ubmVjdChtYXBVc2Vyc1RvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlcnNDb250YWluZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBVc2VycztcclxuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufTtcclxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBJbWFnZSBhcyBJbWFnZUJzIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5leHBvcnQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEhhbmRsZXIgPSB0aGlzLmNoZWNrYm94SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY2hlY2tib3hIYW5kbGVyKGUpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGFkZCA9IGUuY3VycmVudFRhcmdldC5jaGVja2VkO1xyXG4gICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29tbWVudEljb24oY291bnQpIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IGNvdW50ID09PSAwID8gXCJjb2wtbGctNiB0ZXh0LW11dGVkXCIgOiBcImNvbC1sZy02IHRleHQtcHJpbWFyeVwiO1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0ge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IHN0eWxlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBfX2Fzc2lnbih7fSwgcHJvcHMpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJnbHlwaGljb24gZ2x5cGhpY29uLWNvbW1lbnRcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIiB9KSxcclxuICAgICAgICAgICAgXCIgXCIsXHJcbiAgICAgICAgICAgIGNvdW50KTtcclxuICAgIH1cclxuICAgIGNoZWNrYm94VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIGltYWdlSXNTZWxlY3RlZCwgaW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IGltYWdlSXNTZWxlY3RlZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICByZXR1cm4gKGNhbkVkaXQgP1xyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZzogNiwgY2xhc3NOYW1lOiBcInB1bGwtcmlnaHQgdGV4dC1yaWdodFwiIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcIlNsZXQgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiLCBvbkNsaWNrOiB0aGlzLmNoZWNrYm94SGFuZGxlciwgY2hlY2tlZDogY2hlY2tlZCB9KSkpXHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY291bnQgPSBpbWFnZS5Db21tZW50Q291bnQ7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYC8ke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2UuSW1hZ2VJRH0vY29tbWVudHNgO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogdXJsIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlQnMsIHsgc3JjOiBpbWFnZS5QcmV2aWV3VXJsLCB0aHVtYm5haWw6IHRydWUgfSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyB0bzogdXJsIH0sIHRoaXMuY29tbWVudEljb24oY291bnQpKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tib3hWaWV3KCkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwiLi9JbWFnZVwiO1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuY29uc3QgZWxlbWVudHNQZXJSb3cgPSA0O1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZUxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgYXJyYW5nZUFycmF5KGltYWdlcykge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGltYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgdGltZXMgPSBNYXRoLmNlaWwobGVuZ3RoIC8gZWxlbWVudHNQZXJSb3cpO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICBsZXQgc3RhcnQgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGltZXM7IGkrKykge1xyXG4gICAgICAgICAgICBzdGFydCA9IGkgKiBlbGVtZW50c1BlclJvdztcclxuICAgICAgICAgICAgY29uc3QgZW5kID0gc3RhcnQgKyBlbGVtZW50c1BlclJvdztcclxuICAgICAgICAgICAgY29uc3QgbGFzdCA9IGVuZCA+IGxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGxhc3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGltYWdlcy5zbGljZShzdGFydCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gaW1hZ2VzLnNsaWNlKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgaW1hZ2VzVmlldyhpbWFnZXMpIHtcclxuICAgICAgICBpZiAoaW1hZ2VzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCwgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFycmFuZ2VBcnJheShpbWFnZXMpO1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSByZXN1bHQubWFwKChyb3csIGkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW1ncyA9IHJvdy5tYXAoKGltZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiAzLCBrZXk6IGltZy5JbWFnZUlEIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbWFnZSwgeyBpbWFnZTogaW1nLCBjYW5FZGl0OiBjYW5FZGl0LCBhZGRTZWxlY3RlZEltYWdlSWQ6IGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkOiByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGltYWdlSXNTZWxlY3RlZDogaW1hZ2VJc1NlbGVjdGVkLCB1c2VybmFtZTogdXNlcm5hbWUgfSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3Qgcm93SWQgPSBcInJvd0lkXCIgKyBpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsga2V5OiByb3dJZCB9LCBpbWdzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsIHRoaXMuaW1hZ2VzVmlldyhpbWFnZXMpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSwgYWRkU2VsZWN0ZWRJbWFnZUlkLCBkZWxldGVJbWFnZXMsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCwgY2xlYXJTZWxlY3RlZEltYWdlSWRzLCBmZXRjaFVzZXJJbWFnZXMgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9pbWFnZXNcIjtcclxuaW1wb3J0IHsgSW1hZ2VVcGxvYWQgfSBmcm9tIFwiLi4vaW1hZ2VzL0ltYWdlVXBsb2FkXCI7XHJcbmltcG9ydCBJbWFnZUxpc3QgZnJvbSBcIi4uL2ltYWdlcy9JbWFnZUxpc3RcIjtcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gXCJ1bmRlcnNjb3JlXCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IFJvdywgQ29sLCBCdXR0b24gfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IEJyZWFkY3J1bWIgfSBmcm9tIFwiLi4vYnJlYWRjcnVtYnMvQnJlYWRjcnVtYlwiO1xyXG5pbXBvcnQgeyB2YWx1ZXMgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgVXNlZFNwYWNlIGZyb20gXCIuL1VzZWRTcGFjZVwiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgb3duZXJJZCB9ID0gc3RhdGUuaW1hZ2VzSW5mbztcclxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkO1xyXG4gICAgY29uc3QgY2FuRWRpdCA9IChvd25lcklkID4gMCAmJiBjdXJyZW50SWQgPiAwICYmIG93bmVySWQgPT09IGN1cnJlbnRJZCk7XHJcbiAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW293bmVySWRdO1xyXG4gICAgY29uc3QgZnVsbE5hbWUgPSB1c2VyID8gYCR7dXNlci5GaXJzdE5hbWV9ICR7dXNlci5MYXN0TmFtZX1gIDogXCJcIjtcclxuICAgIGNvbnN0IGltYWdlcyA9IHZhbHVlcyhzdGF0ZS5pbWFnZXNJbmZvLmltYWdlcyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGltYWdlczogaW1hZ2VzLFxyXG4gICAgICAgIGNhbkVkaXQ6IGNhbkVkaXQsXHJcbiAgICAgICAgc2VsZWN0ZWRJbWFnZUlkczogc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWRzLFxyXG4gICAgICAgIGZ1bGxOYW1lOiBmdWxsTmFtZSxcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGxvYWRJbWFnZTogKHVzZXJuYW1lLCBkZXNjcmlwdGlvbiwgZm9ybURhdGEpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2godXBsb2FkSW1hZ2UodXNlcm5hbWUsIGRlc2NyaXB0aW9uLCBmb3JtRGF0YSwgKCkgPT4geyBkaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTsgfSwgKCkgPT4geyB9KSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChhZGRTZWxlY3RlZEltYWdlSWQoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlbW92ZVNlbGVjdGVkSW1hZ2VJZChpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2VzOiAodXNlcm5hbWUsIGlkcykgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVJbWFnZXModXNlcm5hbWUsIGlkcykpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYXJTZWxlY3RlZEltYWdlSWRzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBVc2VySW1hZ2VzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VJc1NlbGVjdGVkID0gdGhpcy5pbWFnZUlzU2VsZWN0ZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzID0gdGhpcy5kZWxldGVTZWxlY3RlZEltYWdlcy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZCA9IHRoaXMuY2xlYXJTZWxlY3RlZC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyByb3V0ZXIsIHJvdXRlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gdXNlcm5hbWUgKyBcIidzIGJpbGxlZGVyXCI7XHJcbiAgICAgICAgcm91dGVyLnNldFJvdXRlTGVhdmVIb29rKHJvdXRlLCB0aGlzLmNsZWFyU2VsZWN0ZWQpO1xyXG4gICAgfVxyXG4gICAgY2xlYXJTZWxlY3RlZCgpIHtcclxuICAgICAgICBjb25zdCB7IGNsZWFyU2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGltYWdlSXNTZWxlY3RlZChjaGVja0lkKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGZpbmQoc2VsZWN0ZWRJbWFnZUlkcywgKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZCA9PT0gY2hlY2tJZDtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlU2VsZWN0ZWRJbWFnZXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZEltYWdlSWRzLCBkZWxldGVJbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBzZWxlY3RlZEltYWdlSWRzKTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0ZWQoKTtcclxuICAgIH1cclxuICAgIHVwbG9hZFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCB1cGxvYWRJbWFnZSwgc2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCBoYXNJbWFnZXMgPSBzZWxlY3RlZEltYWdlSWRzLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgaWYgKCFjYW5FZGl0KVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnOiA3IH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlVXBsb2FkLCB7IHVwbG9hZEltYWdlOiB1cGxvYWRJbWFnZSwgdXNlcm5hbWU6IHVzZXJuYW1lIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJcXHUwMEEwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogXCJkYW5nZXJcIiwgZGlzYWJsZWQ6ICFoYXNJbWFnZXMsIG9uQ2xpY2s6IHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMgfSwgXCJTbGV0IG1hcmtlcmV0IGJpbGxlZGVyXCIpKSkpO1xyXG4gICAgfVxyXG4gICAgdXBsb2FkTGltaXRWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAoIWNhbkVkaXQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiAyIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVzZWRTcGFjZSwgbnVsbCkpKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IGltYWdlcywgZnVsbE5hbWUsIGNhbkVkaXQsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYi5JdGVtLCB7IGhyZWY6IFwiL1wiIH0sIFwiRm9yc2lkZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLkl0ZW0sIHsgYWN0aXZlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiJ3MgYmlsbGVkZXJcIikpKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtY2FwaXRhbGl6ZVwiIH0sIGZ1bGxOYW1lKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIncyBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsIFwiYmlsbGVkZSBnYWxsZXJpXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbWFnZUxpc3QsIHsgaW1hZ2VzOiBpbWFnZXMsIGNhbkVkaXQ6IGNhbkVkaXQsIGFkZFNlbGVjdGVkSW1hZ2VJZDogYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQ6IHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCwgaW1hZ2VJc1NlbGVjdGVkOiB0aGlzLmltYWdlSXNTZWxlY3RlZCwgdXNlcm5hbWU6IHVzZXJuYW1lIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkVmlldygpKSksXHJcbiAgICAgICAgICAgIHRoaXMudXBsb2FkTGltaXRWaWV3KCksXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IFVzZXJJbWFnZXNSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFVzZXJJbWFnZXNDb250YWluZXIpO1xyXG5jb25zdCBVc2VySW1hZ2VzID0gd2l0aFJvdXRlcihVc2VySW1hZ2VzUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBVc2VySW1hZ2VzO1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgc2V0U2VsZWN0ZWRJbWcsIGZldGNoU2luZ2xlSW1hZ2UsIGRlbGV0ZUltYWdlIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvaW1hZ2VzXCI7XHJcbmltcG9ydCB7IHNldFNraXBDb21tZW50cywgc2V0VGFrZUNvbW1lbnRzLCBzZXRGb2N1c2VkQ29tbWVudCwgcmVjZWl2ZWRDb21tZW50cyB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2NvbW1lbnRzXCI7XHJcbmltcG9ydCB7IHNldEVycm9yIH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvZXJyb3JcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xyXG5pbXBvcnQgeyBNb2RhbCwgSW1hZ2UsIEJ1dHRvbiwgQnV0dG9uVG9vbGJhciwgR2x5cGhpY29uIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiO1xyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IG93bmVySWQgPSBzdGF0ZS5pbWFnZXNJbmZvLm93bmVySWQ7XHJcbiAgICBjb25zdCBjdXJyZW50SWQgPSBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZDtcclxuICAgIGNvbnN0IGNhbkVkaXQgPSAob3duZXJJZCA+IDAgJiYgY3VycmVudElkID4gMCAmJiBvd25lcklkID09PSBjdXJyZW50SWQpO1xyXG4gICAgY29uc3QgZ2V0SW1hZ2UgPSAoaWQpID0+IHN0YXRlLmltYWdlc0luZm8uaW1hZ2VzW2lkXTtcclxuICAgIGNvbnN0IGltYWdlID0gKCkgPT4gZ2V0SW1hZ2Uoc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWQpO1xyXG4gICAgY29uc3QgZmlsZW5hbWUgPSAoKSA9PiB7IGlmIChpbWFnZSgpKVxyXG4gICAgICAgIHJldHVybiBpbWFnZSgpLkZpbGVuYW1lOyByZXR1cm4gXCJcIjsgfTtcclxuICAgIGNvbnN0IHByZXZpZXdVcmwgPSAoKSA9PiB7IGlmIChpbWFnZSgpKVxyXG4gICAgICAgIHJldHVybiBpbWFnZSgpLlByZXZpZXdVcmw7IHJldHVybiBcIlwiOyB9O1xyXG4gICAgY29uc3QgZXh0ZW5zaW9uID0gKCkgPT4geyBpZiAoaW1hZ2UoKSlcclxuICAgICAgICByZXR1cm4gaW1hZ2UoKS5FeHRlbnNpb247IHJldHVybiBcIlwiOyB9O1xyXG4gICAgY29uc3Qgb3JpZ2luYWxVcmwgPSAoKSA9PiB7IGlmIChpbWFnZSgpKVxyXG4gICAgICAgIHJldHVybiBpbWFnZSgpLk9yaWdpbmFsVXJsOyByZXR1cm4gXCJcIjsgfTtcclxuICAgIGNvbnN0IHVwbG9hZGVkID0gKCkgPT4geyBpZiAoaW1hZ2UoKSlcclxuICAgICAgICByZXR1cm4gaW1hZ2UoKS5VcGxvYWRlZDsgcmV0dXJuIG5ldyBEYXRlKCk7IH07XHJcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9ICgpID0+IHsgaWYgKGltYWdlKCkpXHJcbiAgICAgICAgcmV0dXJuIGltYWdlKCkuRGVzY3JpcHRpb247IHJldHVybiBcIlwiOyB9O1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjYW5FZGl0OiBjYW5FZGl0LFxyXG4gICAgICAgIGhhc0ltYWdlOiAoKSA9PiBCb29sZWFuKGdldEltYWdlKHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkKSksXHJcbiAgICAgICAgZmlsZW5hbWU6IGZpbGVuYW1lKCksXHJcbiAgICAgICAgcHJldmlld1VybDogcHJldmlld1VybCgpLFxyXG4gICAgICAgIGV4dGVuc2lvbjogZXh0ZW5zaW9uKCksXHJcbiAgICAgICAgb3JpZ2luYWxVcmw6IG9yaWdpbmFsVXJsKCksXHJcbiAgICAgICAgdXBsb2FkZWQ6IHVwbG9hZGVkKCksXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uKClcclxuICAgIH07XHJcbn07XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXRTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTZWxlY3RlZEltZyhpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzZWxlY3RJbWFnZTogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTZWxlY3RlZEltZyh1bmRlZmluZWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldEVycm9yOiAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IoZXJyb3IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoSW1hZ2U6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFNpbmdsZUltYWdlKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJbWFnZTogKGlkLCB1c2VybmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVJbWFnZShpZCwgdXNlcm5hbWUpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc2V0Q29tbWVudHM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2tpcENvbW1lbnRzKDApKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZUNvbW1lbnRzKDEwKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEZvY3VzZWRDb21tZW50KC0xKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVkQ29tbWVudHMoW10pKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5jbGFzcyBNb2RhbEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSW1hZ2VIYW5kbGVyID0gdGhpcy5kZWxldGVJbWFnZUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc2VlQWxsQ29tbWVudHNWaWV3ID0gdGhpcy5zZWVBbGxDb21tZW50c1ZpZXcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlbG9hZCA9IHRoaXMucmVsb2FkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlc2VsZWN0SW1hZ2UsIHJlc2V0Q29tbWVudHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBkZXNlbGVjdEltYWdlKCk7XHJcbiAgICAgICAgY29uc3QgZ2FsbGVyeVVybCA9IGAvJHt1c2VybmFtZX0vZ2FsbGVyeWA7XHJcbiAgICAgICAgcmVzZXRDb21tZW50cygpO1xyXG4gICAgICAgIHB1c2goZ2FsbGVyeVVybCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGVJbWFnZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVJbWFnZSwgc2V0U2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgaWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBkZWxldGVJbWFnZShOdW1iZXIoaWQpLCB1c2VybmFtZSk7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRJbWFnZUlkKC0xKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZUltYWdlVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYgKCFjYW5FZGl0KVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYnNTdHlsZTogXCJkYW5nZXJcIiwgb25DbGljazogdGhpcy5kZWxldGVJbWFnZUhhbmRsZXIgfSwgXCJTbGV0IGJpbGxlZGVcIik7XHJcbiAgICB9XHJcbiAgICByZWxvYWQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpZCwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IGAvJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2lkfS9jb21tZW50c2A7XHJcbiAgICAgICAgcHVzaChwYXRoKTtcclxuICAgIH1cclxuICAgIHNlZUFsbENvbW1lbnRzVmlldygpIHtcclxuICAgICAgICBjb25zdCBzaG93ID0gIUJvb2xlYW4odGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICAgICAgaWYgKCFzaG93KVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwidGV4dC1jZW50ZXJcIiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0aGlzLnJlbG9hZCB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHbHlwaGljb24sIHsgZ2x5cGg6IFwicmVmcmVzaFwiIH0pLFxyXG4gICAgICAgICAgICAgICAgXCIgU2UgYWxsZSBrb21tZW50YXJlcj9cIikpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZmlsZW5hbWUsIHByZXZpZXdVcmwsIGV4dGVuc2lvbiwgb3JpZ2luYWxVcmwsIHVwbG9hZGVkLCBoYXNJbWFnZSwgZGVzY3JpcHRpb24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgc2hvdyA9IGhhc0ltYWdlKCk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGZpbGVuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICAgICAgY29uc3QgdXBsb2FkRGF0ZSA9IG1vbWVudCh1cGxvYWRlZCk7XHJcbiAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IFwiVXBsb2FkZWQgZC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwsIHsgc2hvdzogc2hvdywgb25IaWRlOiB0aGlzLmNsb3NlLCBic1NpemU6IFwibGFyZ2VcIiwgYW5pbWF0aW9uOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuSGVhZGVyLCB7IGNsb3NlQnV0dG9uOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1vZGFsLlRpdGxlLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNtYWxsXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiAtIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVN0cmluZykpKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuQm9keSwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogb3JpZ2luYWxVcmwsIHRhcmdldDogXCJfYmxhbmtcIiwgcmVsOiBcIm5vb3BlbmVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEltYWdlLCB7IHNyYzogcHJldmlld1VybCwgcmVzcG9uc2l2ZTogdHJ1ZSwgY2xhc3NOYW1lOiBcImNlbnRlci1ibG9ja1wiIH0pKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaW1hZ2Utc2VsZWN0ZWQtZGVzY3JpcHRpb250ZXh0XCIgfSwgZGVzY3JpcHRpb24pKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbC5Gb290ZXIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlZUFsbENvbW1lbnRzVmlldygpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbixcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uVG9vbGJhciwgeyBzdHlsZTogeyBmbG9hdDogXCJyaWdodFwiIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUltYWdlVmlldygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IG9uQ2xpY2s6IHRoaXMuY2xvc2UgfSwgXCJMdWtcIikpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgU2VsZWN0ZWRJbWFnZVJlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoTW9kYWxJbWFnZSk7XHJcbmNvbnN0IFNlbGVjdGVkSW1hZ2UgPSB3aXRoUm91dGVyKFNlbGVjdGVkSW1hZ2VSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IFNlbGVjdGVkSW1hZ2U7XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBmZXRjaENvbW1lbnRzLCBwb3N0Q29tbWVudCwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQgfSBmcm9tIFwiLi4vLi4vYWN0aW9ucy9jb21tZW50c1wiO1xyXG5pbXBvcnQgeyBpbmNyZW1lbnRDb21tZW50Q291bnQsIGRlY3JlbWVudENvbW1lbnRDb3VudCB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2ltYWdlc1wiO1xyXG5pbXBvcnQgeyBDb21tZW50TGlzdCB9IGZyb20gXCIuLi9jb21tZW50cy9Db21tZW50TGlzdFwiO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IFBhZ2luYXRpb24gfSBmcm9tIFwiLi4vcGFnaW5hdGlvbi9QYWdpbmF0aW9uXCI7XHJcbmltcG9ydCB7IENvbW1lbnRGb3JtIH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRGb3JtXCI7XHJcbmltcG9ydCB7IGdldEltYWdlQ29tbWVudHNQYWdlVXJsLCBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsIH0gZnJvbSBcIi4uLy4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNhbkVkaXQ6IChpZCkgPT4gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQgPT09IGlkLFxyXG4gICAgICAgIGltYWdlSWQ6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmNvbW1lbnRzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmNvbW1lbnRzSW5mby50YWtlLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLmNvbW1lbnRzSW5mby5wYWdlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLmNvbW1lbnRzSW5mby50b3RhbFBhZ2VzLFxyXG4gICAgICAgIGNvbW1lbnRzOiBzdGF0ZS5jb21tZW50c0luZm8uY29tbWVudHMsXHJcbiAgICAgICAgZ2V0TmFtZTogKHVzZXJJZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW3VzZXJJZF07XHJcbiAgICAgICAgICAgIGNvbnN0IHsgRmlyc3ROYW1lLCBMYXN0TmFtZSB9ID0gdXNlcjtcclxuICAgICAgICAgICAgcmV0dXJuIGAke0ZpcnN0TmFtZX0gJHtMYXN0TmFtZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3duZXI6IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tzdGF0ZS5pbWFnZXNJbmZvLm93bmVySWRdXHJcbiAgICB9O1xyXG59O1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcG9zdEhhbmRsZTogKGltYWdlSWQsIHRleHQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudCh1cmwsIGltYWdlSWQsIHRleHQsIG51bGwsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaENvbW1lbnRzOiAoaW1hZ2VJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybChpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVkaXRIYW5kbGU6IChjb21tZW50SWQsIF8sIHRleHQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChlZGl0Q29tbWVudCh1cmwsIGNvbW1lbnRJZCwgdGV4dCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZTogKGNvbW1lbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybChjb21tZW50SWQpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVDb21tZW50KHVybCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcGx5SGFuZGxlOiAoaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudCh1cmwsIGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5jcmVtZW50Q291bnQ6IChpbWFnZUlkKSA9PiBkaXNwYXRjaChpbmNyZW1lbnRDb21tZW50Q291bnQoaW1hZ2VJZCkpLFxyXG4gICAgICAgIGRlY3JlbWVudENvdW50OiAoaW1hZ2VJZCkgPT4gZGlzcGF0Y2goZGVjcmVtZW50Q29tbWVudENvdW50KGltYWdlSWQpKSxcclxuICAgICAgICBsb2FkQ29tbWVudHM6IChpbWFnZUlkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNQYWdlVXJsKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmNsYXNzIENvbW1lbnRzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucGFnZUhhbmRsZSA9IHRoaXMucGFnZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29tbWVudCA9IHRoaXMuZGVsZXRlQ29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZWRpdENvbW1lbnQgPSB0aGlzLmVkaXRDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZXBseUNvbW1lbnQgPSB0aGlzLnJlcGx5Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucG9zdENvbW1lbnQgPSB0aGlzLnBvc3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHsgZmV0Y2hDb21tZW50cywgaW1hZ2VJZCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHBhZ2UgfSA9IG5leHRQcm9wcy5sb2NhdGlvbi5xdWVyeTtcclxuICAgICAgICBpZiAoIU51bWJlcihwYWdlKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHBhZ2UgLSAxO1xyXG4gICAgICAgIGNvbnN0IHNraXBJdGVtcyA9IChza2lwUGFnZXMgKiB0YWtlKTtcclxuICAgICAgICBmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcbiAgICBwYWdlSGFuZGxlKHRvKSB7XHJcbiAgICAgICAgY29uc3QgeyBvd25lciwgaW1hZ2VJZCwgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gb3duZXIuVXNlcm5hbWU7XHJcbiAgICAgICAgaWYgKHBhZ2UgPT09IHRvKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdXJsID0gYC8ke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2VJZH0vY29tbWVudHM/cGFnZT0ke3RvfWA7XHJcbiAgICAgICAgcHVzaCh1cmwpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlQ29tbWVudChjb21tZW50SWQsIGltYWdlSWQpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUhhbmRsZSwgbG9hZENvbW1lbnRzLCBkZWNyZW1lbnRDb3VudCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgZGVjcmVtZW50Q291bnQoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRlbGV0ZUhhbmRsZShjb21tZW50SWQsIGNiKTtcclxuICAgIH1cclxuICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlLCBlZGl0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4gbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIGVkaXRIYW5kbGUoY29tbWVudElkLCBpbWFnZUlkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcbiAgICByZXBseUNvbW1lbnQoaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW5jcmVtZW50Q291bnQsIHNraXAsIHRha2UsIHJlcGx5SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpbmNyZW1lbnRDb3VudChpbWFnZUlkKTtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVwbHlIYW5kbGUoaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQsIGNiKTtcclxuICAgIH1cclxuICAgIHBvc3RDb21tZW50KHRleHQpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIGxvYWRDb21tZW50cywgaW5jcmVtZW50Q291bnQsIHNraXAsIHRha2UsIHBvc3RIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGluY3JlbWVudENvdW50KGltYWdlSWQpO1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwb3N0SGFuZGxlKGltYWdlSWQsIHRleHQsIGNiKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIGNvbW1lbnRzLCBnZXROYW1lLCBpbWFnZUlkLCBwYWdlLCB0b3RhbFBhZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjb250cm9scyA9IHtcclxuICAgICAgICAgICAgc2tpcCxcclxuICAgICAgICAgICAgdGFrZSxcclxuICAgICAgICAgICAgZGVsZXRlQ29tbWVudDogdGhpcy5kZWxldGVDb21tZW50LFxyXG4gICAgICAgICAgICBlZGl0Q29tbWVudDogdGhpcy5lZGl0Q29tbWVudCxcclxuICAgICAgICAgICAgcmVwbHlDb21tZW50OiB0aGlzLnJlcGx5Q29tbWVudFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwidGV4dC1sZWZ0XCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMSwgbGc6IDExIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50TGlzdCwgX19hc3NpZ24oeyBjb250ZXh0SWQ6IGltYWdlSWQsIGNvbW1lbnRzOiBjb21tZW50cywgZ2V0TmFtZTogZ2V0TmFtZSwgY2FuRWRpdDogY2FuRWRpdCB9LCBjb250cm9scykpKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDEsIGxnOiAxMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFnaW5hdGlvbiwgeyB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzLCBwYWdlOiBwYWdlLCBwYWdlSGFuZGxlOiB0aGlzLnBhZ2VIYW5kbGUgfSkpKSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sLCB7IGxnT2Zmc2V0OiAxLCBsZzogMTAgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRGb3JtLCB7IHBvc3RIYW5kbGU6IHRoaXMucG9zdENvbW1lbnQgfSkpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgQ29tbWVudHNSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKENvbW1lbnRzQ29udGFpbmVyKTtcclxuY29uc3QgSW1hZ2VDb21tZW50cyA9IHdpdGhSb3V0ZXIoQ29tbWVudHNSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IEltYWdlQ29tbWVudHM7XHJcbiIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBDb21tZW50IH0gZnJvbSBcIi4uL2NvbW1lbnRzL0NvbW1lbnRcIjtcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBXZWxsLCBCdXR0b24sIEdseXBoaWNvbiB9IGZyb20gXCJyZWFjdC1ib290c3RyYXBcIjtcclxuaW1wb3J0IHsgZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQsIHBvc3RDb21tZW50LCBlZGl0Q29tbWVudCwgZGVsZXRlQ29tbWVudCB9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2NvbW1lbnRzXCI7XHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IGdldEltYWdlQ29tbWVudHNEZWxldGVVcmwgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBjb21tZW50cywgZm9jdXNlZENvbW1lbnQgfSA9IHN0YXRlLmNvbW1lbnRzSW5mbztcclxuICAgIGNvbnN0IHsgdXNlcnMgfSA9IHN0YXRlLnVzZXJzSW5mbztcclxuICAgIGNvbnN0IHsgb3duZXJJZCwgc2VsZWN0ZWRJbWFnZUlkIH0gPSBzdGF0ZS5pbWFnZXNJbmZvO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXROYW1lOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gdXNlcnNbaWRdO1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7YXV0aG9yLkZpcnN0TmFtZX0gJHthdXRob3IuTGFzdE5hbWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvY3VzZWRJZDogZm9jdXNlZENvbW1lbnQsXHJcbiAgICAgICAgZm9jdXNlZDogY29tbWVudHNbMF0sXHJcbiAgICAgICAgaW1hZ2VJZDogc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgICAgIGltYWdlT3duZXI6IHVzZXJzW293bmVySWRdLlVzZXJuYW1lLFxyXG4gICAgICAgIGNhbkVkaXQ6IChpZCkgPT4gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQgPT09IGlkLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmNvbW1lbnRzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmNvbW1lbnRzSW5mby50YWtlLFxyXG4gICAgfTtcclxufTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGVkaXRIYW5kbGU6IChjb21tZW50SWQsIF8sIHRleHQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChlZGl0Q29tbWVudCh1cmwsIGNvbW1lbnRJZCwgdGV4dCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZTogKGNvbW1lbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybChjb21tZW50SWQpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVDb21tZW50KHVybCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcGx5SGFuZGxlOiAoaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudCh1cmwsIGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9jdXNDb21tZW50OiAoaWQpID0+IGRpc3BhdGNoKGZldGNoQW5kRm9jdXNTaW5nbGVDb21tZW50KGlkKSlcclxuICAgIH07XHJcbn07XHJcbmNsYXNzIFNpbmdsZUNvbW1lbnRSZWR1eCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmFsbENvbW1lbnRzID0gdGhpcy5hbGxDb21tZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29tbWVudCA9IHRoaXMuZGVsZXRlQ29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZWRpdENvbW1lbnQgPSB0aGlzLmVkaXRDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZXBseUNvbW1lbnQgPSB0aGlzLnJlcGx5Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgYWxsQ29tbWVudHMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCBpbWFnZU93bmVyIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IGAvJHtpbWFnZU93bmVyfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2VJZH0vY29tbWVudHNgO1xyXG4gICAgICAgIHB1c2gocGF0aCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGVDb21tZW50KGNvbW1lbnRJZCwgXykge1xyXG4gICAgICAgIGNvbnN0IHsgZGVsZXRlSGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGRlbGV0ZUhhbmRsZShjb21tZW50SWQsIHRoaXMuYWxsQ29tbWVudHMpO1xyXG4gICAgfVxyXG4gICAgZWRpdENvbW1lbnQoY29tbWVudElkLCBjb250ZXh0SWQsIHRleHQpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRIYW5kbGUsIGZvY3VzQ29tbWVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IGZvY3VzQ29tbWVudChjb21tZW50SWQpO1xyXG4gICAgICAgIGVkaXRIYW5kbGUoY29tbWVudElkLCBjb250ZXh0SWQsIHRleHQsIGNiKTtcclxuICAgIH1cclxuICAgIHJlcGx5Q29tbWVudChjb250ZXh0SWQsIHRleHQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXBseUhhbmRsZShjb250ZXh0SWQsIHRleHQsIHBhcmVudElkLCB0aGlzLmFsbENvbW1lbnRzKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGZvY3VzZWRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZiAoZm9jdXNlZElkIDwgMClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyBUZXh0LCBBdXRob3JJRCwgQ29tbWVudElELCBQb3N0ZWRPbiwgRWRpdGVkIH0gPSB0aGlzLnByb3BzLmZvY3VzZWQ7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCBpbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcclxuICAgICAgICAgICAgc2tpcCxcclxuICAgICAgICAgICAgdGFrZSxcclxuICAgICAgICAgICAgZGVsZXRlQ29tbWVudDogdGhpcy5kZWxldGVDb21tZW50LFxyXG4gICAgICAgICAgICBlZGl0Q29tbWVudDogdGhpcy5lZGl0Q29tbWVudCxcclxuICAgICAgICAgICAgcmVwbHlDb21tZW50OiB0aGlzLnJlcGx5Q29tbWVudFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMucHJvcHMuZ2V0TmFtZShBdXRob3JJRCk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwidGV4dC1sZWZ0XCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChXZWxsLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50LCBfX2Fzc2lnbih7IGNvbnRleHRJZDogaW1hZ2VJZCwgbmFtZTogbmFtZSwgdGV4dDogVGV4dCwgY29tbWVudElkOiBDb21tZW50SUQsIHJlcGxpZXM6IFtdLCBjYW5FZGl0OiBjYW5FZGl0LCBhdXRob3JJZDogQXV0aG9ySUQsIHBvc3RlZE9uOiBQb3N0ZWRPbiwgZWRpdGVkOiBFZGl0ZWQgfSwgcHJvcHMpKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInRleHQtY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiB0aGlzLmFsbENvbW1lbnRzIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2x5cGhpY29uLCB7IGdseXBoOiBcInJlZnJlc2hcIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIgU2UgYWxsZSBrb21tZW50YXJlcj9cIikpKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgU2luZ2xlQ29tbWVudENvbm5lY3QgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShTaW5nbGVDb21tZW50UmVkdXgpO1xyXG5jb25zdCBTaW5nbGVJbWFnZUNvbW1lbnQgPSB3aXRoUm91dGVyKFNpbmdsZUNvbW1lbnRDb25uZWN0KTtcclxuZXhwb3J0IGRlZmF1bHQgU2luZ2xlSW1hZ2VDb21tZW50O1xyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IEJyZWFkY3J1bWIgfSBmcm9tIFwiLi4vYnJlYWRjcnVtYnMvQnJlYWRjcnVtYlwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYm91dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiT21cIjtcclxuICAgIH1cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb2wsIHsgbGdPZmZzZXQ6IDIsIGxnOiA4IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCcmVhZGNydW1iLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJyZWFkY3J1bWIuSXRlbSwgeyBocmVmOiBcIi9cIiB9LCBcIkZvcnNpZGVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnJlYWRjcnVtYi5JdGVtLCB7IGFjdGl2ZTogdHJ1ZSB9LCBcIk9tXCIpKSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbCwgeyBsZ09mZnNldDogMiwgbGc6IDggfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEZXR0ZSBlciBlbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbiFcIixcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJUZWtub2xvZ2llciBicnVndDpcIiksXHJcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXCJSZWFjdFwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXCJSZWR1eFwiKSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXCJSZWFjdC1Cb290c3RyYXBcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiUmVhY3RSb3V0ZXJcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiQXNwLm5ldCBDb3JlIFJDIDJcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiQXNwLm5ldCBXZWIgQVBJIDJcIikpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmNvbnN0IHVzZXJzID0gKHN0YXRlID0ge30sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMjI6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgY3VycmVudFVzZXJJZCA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDIwOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB1c2Vyc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgY3VycmVudFVzZXJJZCxcclxuICAgIHVzZXJzXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCB1c2Vyc0luZm87XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5pbXBvcnQgeyBwdXQsIHVuaW9uIH0gZnJvbSBcIi4uL3V0aWxpdGllcy91dGlsc1wiO1xyXG5pbXBvcnQgeyBmaWx0ZXIsIG9taXQgfSBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5jb25zdCBvd25lcklkID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMTA6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5jb25zdCBpbWFnZXMgPSAoc3RhdGUgPSB7fSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxMzpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwdXQoc3RhdGUsIGltYWdlLkltYWdlSUQsIGltYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgMTE6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgMTQ6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYWN0aW9uLnBheWxvYWQuSW1hZ2VJRDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBvbWl0KHN0YXRlLCBpZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAxODpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBhY3Rpb24ucGF5bG9hZC5JbWFnZUlEO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBzdGF0ZVtpZF07XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5Db21tZW50Q291bnQrKztcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHB1dChzdGF0ZSwgaWQsIGltYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIDE5OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGFjdGlvbi5wYXlsb2FkLkltYWdlSUQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZSA9IHN0YXRlW2lkXTtcclxuICAgICAgICAgICAgICAgIGltYWdlLkNvbW1lbnRDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcHV0KHN0YXRlLCBpZCwgaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5jb25zdCBzZWxlY3RlZEltYWdlSWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxMjpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHNlbGVjdGVkSW1hZ2VJZHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxNTpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmlvbihzdGF0ZSwgW2lkXSwgKGlkMSwgaWQyKSA9PiBpZDEgPT09IGlkMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIDE2OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyKHN0YXRlLCAoaWQpID0+IGlkICE9PSBhY3Rpb24ucGF5bG9hZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIDE3OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxufTtcclxuY29uc3QgaW1hZ2VzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBvd25lcklkLFxyXG4gICAgaW1hZ2VzLFxyXG4gICAgc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgc2VsZWN0ZWRJbWFnZUlkc1xyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgaW1hZ2VzSW5mbztcclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmNvbnN0IGNvbW1lbnRzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgNDE6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCBbXTtcclxuICAgICAgICBjYXNlIDQyOlxyXG4gICAgICAgICAgICByZXR1cm4gWy4uLnN0YXRlLCBhY3Rpb24ucGF5bG9hZFswXV07XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBza2lwID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzNDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0YWtlID0gKHN0YXRlID0gMTAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMzc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAxMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHBhZ2UgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDM4OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDM5OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGZvY3VzZWRDb21tZW50ID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgNDM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAtMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGNvbW1lbnRzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjb21tZW50cyxcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXMsXHJcbiAgICBmb2N1c2VkQ29tbWVudFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgY29tbWVudHNJbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuaW1wb3J0IHsgdW5pb24gfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3V0aWxzXCI7XHJcbmNvbnN0IHNraXBUaHJlYWRzID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyODpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdGFrZVRocmVhZHMgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyOTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgcGFnZVRocmVhZHMgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDI3OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0b3RhbFBhZ2VzVGhyZWFkID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAyNjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3Qgc2VsZWN0ZWRUaHJlYWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzMDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgdGl0bGVzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgMjQ6XHJcbiAgICAgICAgICAgIHJldHVybiB1bmlvbihhY3Rpb24ucGF5bG9hZCwgc3RhdGUsICh0MSwgdDIpID0+IHQxLklEID09PSB0Mi5JRCk7XHJcbiAgICAgICAgY2FzZSAyNTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgcG9zdENvbnRlbnQgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDMxOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB0aXRsZXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHRpdGxlcyxcclxuICAgIHNraXA6IHNraXBUaHJlYWRzLFxyXG4gICAgdGFrZTogdGFrZVRocmVhZHMsXHJcbiAgICBwYWdlOiBwYWdlVGhyZWFkcyxcclxuICAgIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXNUaHJlYWQsXHJcbiAgICBzZWxlY3RlZFRocmVhZFxyXG59KTtcclxuY29uc3QgZm9ydW1JbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHRpdGxlc0luZm8sXHJcbiAgICBwb3N0Q29udGVudFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgZm9ydW1JbmZvO1xyXG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcclxuZXhwb3J0IGNvbnN0IHRpdGxlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgXCJcIjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBtZXNzYWdlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgXCJcIjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGVycm9ySW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB0aXRsZSxcclxuICAgIG1lc3NhZ2VcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IGVycm9ySW5mbztcclxuIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSBcInJlZHV4XCI7XHJcbmltcG9ydCBlcnJvckluZm8gZnJvbSBcIi4vZXJyb3JJbmZvXCI7XHJcbmV4cG9ydCBjb25zdCBoYXNFcnJvciA9IChzdGF0ZSA9IGZhbHNlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBtZXNzYWdlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgZG9uZSA9IChzdGF0ZSA9IHRydWUsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IHVzZWRTcGFjZWtCID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAzMjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IHRvdGFsU3BhY2VrQiA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDMzOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgY29uc3Qgc3BhY2VJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHVzZWRTcGFjZWtCLFxyXG4gICAgdG90YWxTcGFjZWtCXHJcbn0pO1xyXG5jb25zdCBzdGF0dXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGhhc0Vycm9yLFxyXG4gICAgZXJyb3JJbmZvLFxyXG4gICAgc3BhY2VJbmZvLFxyXG4gICAgbWVzc2FnZSxcclxuICAgIGRvbmVcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHN0YXR1c0luZm87XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5jb25zdCBza2lwID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMTA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBwYWdlID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDk6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCB8fCAwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufTtcclxuY29uc3QgaXRlbXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgfHwgW107XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCB3aGF0c05ld0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgc2tpcCxcclxuICAgIHRha2UsXHJcbiAgICBwYWdlLFxyXG4gICAgdG90YWxQYWdlcyxcclxuICAgIGl0ZW1zXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCB3aGF0c05ld0luZm87XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5pbXBvcnQgdXNlcnNJbmZvIGZyb20gXCIuL3VzZXJzSW5mb1wiO1xyXG5pbXBvcnQgaW1hZ2VzSW5mbyBmcm9tIFwiLi9pbWFnZXNJbmZvXCI7XHJcbmltcG9ydCBjb21tZW50c0luZm8gZnJvbSBcIi4vY29tbWVudHNJbmZvXCI7XHJcbmltcG9ydCBmb3J1bUluZm8gZnJvbSBcIi4vZm9ydW1JbmZvXCI7XHJcbmltcG9ydCBzdGF0dXNJbmZvIGZyb20gXCIuL3N0YXR1c0luZm9cIjtcclxuaW1wb3J0IHdoYXRzTmV3SW5mbyBmcm9tIFwiLi93aGF0c05ld0luZm9cIjtcclxuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdXNlcnNJbmZvLFxyXG4gICAgaW1hZ2VzSW5mbyxcclxuICAgIGNvbW1lbnRzSW5mbyxcclxuICAgIGZvcnVtSW5mbyxcclxuICAgIHN0YXR1c0luZm8sXHJcbiAgICB3aGF0c05ld0luZm9cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyO1xyXG4iLCJpbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlIH0gZnJvbSBcInJlZHV4XCI7XHJcbmltcG9ydCB0aHVuayBmcm9tIFwicmVkdXgtdGh1bmtcIjtcclxuaW1wb3J0IHJvb3RSZWR1Y2VyIGZyb20gXCIuLi9yZWR1Y2Vycy9yb290XCI7XHJcbmNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocm9vdFJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZSh0aHVuaykpO1xyXG5leHBvcnQgZGVmYXVsdCBzdG9yZTtcclxuIiwiaW1wb3J0IHN0b3JlIGZyb20gXCIuLi9zdG9yZS9zdG9yZVwiO1xyXG5pbXBvcnQgeyBmZXRjaExhdGVzdE5ld3MgfSBmcm9tIFwiLi4vYWN0aW9ucy93aGF0c25ld1wiO1xyXG5pbXBvcnQgeyBmZXRjaFRocmVhZHMsIGZldGNoUG9zdCB9IGZyb20gXCIuLi9hY3Rpb25zL2ZvcnVtXCI7XHJcbmltcG9ydCB7IGZldGNoQ3VycmVudFVzZXIsIGZldGNoVXNlcnMgfSBmcm9tIFwiLi4vYWN0aW9ucy91c2Vyc1wiO1xyXG5pbXBvcnQgeyBmZXRjaFVzZXJJbWFnZXMsIHNldFNlbGVjdGVkSW1nLCBzZXRJbWFnZU93bmVyIH0gZnJvbSBcIi4uL2FjdGlvbnMvaW1hZ2VzXCI7XHJcbmltcG9ydCB7IGZldGNoQ29tbWVudHMsIHNldFNraXBDb21tZW50cywgc2V0VGFrZUNvbW1lbnRzLCBmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudCB9IGZyb20gXCIuLi9hY3Rpb25zL2NvbW1lbnRzXCI7XHJcbmltcG9ydCB7IGdldEltYWdlQ29tbWVudHNQYWdlVXJsLCBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybCB9IGZyb20gXCIuLi91dGlsaXRpZXMvdXRpbHNcIjtcclxuaW1wb3J0IHsgcG9seWZpbGwgfSBmcm9tIFwiZXM2LXByb21pc2VcIjtcclxuaW1wb3J0IHsgcG9seWZpbGwgYXMgb2JqZWN0UG9seWZpbGwgfSBmcm9tIFwiZXM2LW9iamVjdC1hc3NpZ25cIjtcclxuZXhwb3J0IGNvbnN0IGluaXQgPSAoKSA9PiB7XHJcbiAgICBvYmplY3RQb2x5ZmlsbCgpO1xyXG4gICAgcG9seWZpbGwoKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQ3VycmVudFVzZXIoZ2xvYmFscy5jdXJyZW50VXNlcm5hbWUpKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVXNlcnMoKSk7XHJcbiAgICBtb21lbnQubG9jYWxlKFwiZGFcIik7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaFdoYXRzTmV3ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZ2V0TGF0ZXN0ID0gKHNraXAsIHRha2UpID0+IHN0b3JlLmRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSk7XHJcbiAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHN0b3JlLmdldFN0YXRlKCkud2hhdHNOZXdJbmZvO1xyXG4gICAgZ2V0TGF0ZXN0KHNraXAsIHRha2UpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hGb3J1bSA9IChfKSA9PiB7XHJcbiAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZm9ydW1JbmZvLnRpdGxlc0luZm87XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFRocmVhZHMoc2tpcCwgdGFrZSkpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZmV0Y2hTaW5nbGVQb3N0ID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoUG9zdChOdW1iZXIoaWQpKSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZWxlY3RJbWFnZSA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IGltYWdlSWQgPSBOdW1iZXIobmV4dFN0YXRlLnBhcmFtcy5pZCk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRTZWxlY3RlZEltZyhpbWFnZUlkKSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaEltYWdlcyA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gbmV4dFN0YXRlLnBhcmFtcy51c2VybmFtZTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldEltYWdlT3duZXIodXNlcm5hbWUpKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goc2V0U2tpcENvbW1lbnRzKHVuZGVmaW5lZCkpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goc2V0VGFrZUNvbW1lbnRzKHVuZGVmaW5lZCkpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgbG9hZENvbW1lbnRzID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIGNvbnN0IHBhZ2UgPSBOdW1iZXIobmV4dFN0YXRlLmxvY2F0aW9uLnF1ZXJ5LnBhZ2UpO1xyXG4gICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNQYWdlVXJsKE51bWJlcihpZCksIHNraXAsIHRha2UpO1xyXG4gICAgaWYgKCFwYWdlKSB7XHJcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHBhZ2UgLSAxO1xyXG4gICAgICAgIGNvbnN0IHNraXBJdGVtcyA9IChza2lwUGFnZXMgKiB0YWtlKTtcclxuICAgICAgICBzdG9yZS5kaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcEl0ZW1zLCB0YWtlKSk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCBmZXRjaENvbW1lbnQgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBpZCA9IE51bWJlcihuZXh0U3RhdGUubG9jYXRpb24ucXVlcnkuaWQpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQoaWQpKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGZldGNoUG9zdENvbW1lbnRzID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcbiAgICBjb25zdCB1cmwgPSBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybChOdW1iZXIoaWQpLCBza2lwLCB0YWtlKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgKiBhcyBSZWFjdERPTSBmcm9tIFwicmVhY3QtZG9tXCI7XHJcbmltcG9ydCBNYWluIGZyb20gXCIuL2NvbXBvbmVudHMvc2hlbGxzL01haW5cIjtcclxuaW1wb3J0IEhvbWUgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL0hvbWVcIjtcclxuaW1wb3J0IEZvcnVtIGZyb20gXCIuL2NvbXBvbmVudHMvc2hlbGxzL0ZvcnVtXCI7XHJcbmltcG9ydCBGb3J1bUxpc3QgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL0ZvcnVtTGlzdFwiO1xyXG5pbXBvcnQgRm9ydW1Qb3N0IGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bVBvc3RcIjtcclxuaW1wb3J0IEZvcnVtQ29tbWVudHMgZnJvbSBcIi4vY29tcG9uZW50cy9jb250YWluZXJzL0ZvcnVtQ29tbWVudHNcIjtcclxuaW1wb3J0IFVzZXJzIGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9Vc2Vyc1wiO1xyXG5pbXBvcnQgVXNlckltYWdlcyBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlckltYWdlc1wiO1xyXG5pbXBvcnQgU2VsZWN0ZWRJbWFnZSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvU2VsZWN0ZWRJbWFnZVwiO1xyXG5pbXBvcnQgSW1hZ2VDb21tZW50cyBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvSW1hZ2VDb21tZW50c1wiO1xyXG5pbXBvcnQgU2luZ2xlSW1hZ2VDb21tZW50IGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9TaW5nbGVJbWFnZUNvbW1lbnRcIjtcclxuaW1wb3J0IEFib3V0IGZyb20gXCIuL2NvbXBvbmVudHMvY29udGFpbmVycy9BYm91dFwiO1xyXG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vc3RvcmUvc3RvcmVcIjtcclxuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZSwgSW5kZXhSb3V0ZSwgYnJvd3Nlckhpc3RvcnkgfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCB7IGluaXQsIGZldGNoRm9ydW0sIHNlbGVjdEltYWdlLCBmZXRjaEltYWdlcywgbG9hZENvbW1lbnRzLCBmZXRjaENvbW1lbnQsIGZldGNoV2hhdHNOZXcsIGZldGNoU2luZ2xlUG9zdCwgZmV0Y2hQb3N0Q29tbWVudHMgfSBmcm9tIFwiLi91dGlsaXRpZXMvb25zdGFydHVwXCI7XHJcbmluaXQoKTtcclxuUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvdmlkZXIsIHsgc3RvcmU6IHN0b3JlIH0sXHJcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlciwgeyBoaXN0b3J5OiBicm93c2VySGlzdG9yeSB9LFxyXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCIvXCIsIGNvbXBvbmVudDogTWFpbiB9LFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEluZGV4Um91dGUsIHsgY29tcG9uZW50OiBIb21lLCBvbkVudGVyOiBmZXRjaFdoYXRzTmV3IH0pLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiZm9ydW1cIiwgY29tcG9uZW50OiBGb3J1bSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbmRleFJvdXRlLCB7IGNvbXBvbmVudDogRm9ydW1MaXN0LCBvbkVudGVyOiBmZXRjaEZvcnVtIH0pLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcInBvc3QvOmlkXCIsIGNvbXBvbmVudDogRm9ydW1Qb3N0LCBvbkVudGVyOiBmZXRjaFNpbmdsZVBvc3QgfSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiY29tbWVudHNcIiwgY29tcG9uZW50OiBGb3J1bUNvbW1lbnRzLCBvbkVudGVyOiBmZXRjaFBvc3RDb21tZW50cyB9KSkpLFxyXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwidXNlcnNcIiwgY29tcG9uZW50OiBVc2VycyB9KSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZSwgeyBwYXRoOiBcIjp1c2VybmFtZS9nYWxsZXJ5XCIsIGNvbXBvbmVudDogVXNlckltYWdlcywgb25FbnRlcjogZmV0Y2hJbWFnZXMgfSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJpbWFnZS86aWRcIiwgY29tcG9uZW50OiBTZWxlY3RlZEltYWdlLCBvbkVudGVyOiBzZWxlY3RJbWFnZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJjb21tZW50c1wiLCBjb21wb25lbnQ6IEltYWdlQ29tbWVudHMsIG9uRW50ZXI6IGxvYWRDb21tZW50cyB9KSxcclxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7IHBhdGg6IFwiY29tbWVudFwiLCBjb21wb25lbnQ6IFNpbmdsZUltYWdlQ29tbWVudCwgb25FbnRlcjogZmV0Y2hDb21tZW50IH0pKSksXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHsgcGF0aDogXCJhYm91dFwiLCBjb21wb25lbnQ6IEFib3V0IH0pKSkpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIikpO1xyXG4iXSwibmFtZXMiOlsiUm93IiwiQ29sIiwiQWxlcnQiLCJjb25zdCIsImxldCIsIkxpbmsiLCJJbmRleExpbmsiLCJHcmlkIiwiTmF2YmFyIiwiTmF2IiwiTmF2RHJvcGRvd24iLCJNZW51SXRlbSIsImNvbm5lY3QiLCJub3JtYWxpemVJbWFnZSIsIm5vcm1hbGl6ZUNvbW1lbnQiLCJub3JtYWxpemUiLCJzdXBlciIsIkZvcm1Db250cm9sIiwiQnV0dG9uIiwiR2x5cGhpY29uIiwibWFwU3RhdGVUb1Byb3BzIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiUHJvZ3Jlc3NCYXIiLCJNZWRpYSIsIkltYWdlIiwiVG9vbHRpcCIsIk92ZXJsYXlUcmlnZ2VyIiwidGhpcyIsIk1vZGFsIiwiRm9ybUdyb3VwIiwiQ29udHJvbExhYmVsIiwiQnV0dG9uR3JvdXAiLCJCdXR0b25Ub29sYmFyIiwiQ29sbGFwc2UiLCJzZXRUb3RhbFBhZ2VzIiwic2V0UGFnZSIsInNldFNraXAiLCJzZXRUYWtlIiwiYXJndW1lbnRzIiwiZmluZCIsImNvbnRhaW5zIiwid2l0aFJvdXRlciIsIlBhZ2luYXRpb24iLCJQYWdpbmF0aW9uQnMiLCJKdW1ib3Ryb24iLCJQYW5lbCIsIl9fYXNzaWduIiwidmFsdWVzIiwiUGFnZUhlYWRlciIsIkltYWdlQnMiLCJyb3ciLCJXZWxsIiwiY29tYmluZVJlZHVjZXJzIiwib21pdCIsImlkIiwiaW1hZ2UiLCJyZXN1bHQiLCJmaWx0ZXIiLCJtZXNzYWdlIiwic2tpcCIsInRha2UiLCJwYWdlIiwidG90YWxQYWdlcyIsImNyZWF0ZVN0b3JlIiwiYXBwbHlNaWRkbGV3YXJlIiwib2JqZWN0UG9seWZpbGwiLCJwb2x5ZmlsbCIsIlByb3ZpZGVyIiwiUm91dGVyIiwiYnJvd3Nlckhpc3RvcnkiLCJSb3V0ZSIsIkluZGV4Um91dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU0sS0FBSyxHQUF3QjtJQUFDOzs7Ozs7OztJQUFBLGdCQUN2QyxNQUFNLHNCQUFHO1FBQ0wsT0FBb0MsR0FBRyxJQUFJLENBQUMsS0FBSztRQUF6QyxJQUFBLFVBQVU7UUFBRSxJQUFBLEtBQUs7UUFBRSxJQUFBLE9BQU8sZUFBNUI7UUFDTixPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUNBLGtCQUFHLEVBQUUsSUFBSTtZQUNoQyxLQUFLLENBQUMsYUFBYSxDQUFDQyxrQkFBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUMzQyxLQUFLLENBQUMsYUFBYSxDQUFDQyxvQkFBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFO29CQUNuRSxLQUFL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