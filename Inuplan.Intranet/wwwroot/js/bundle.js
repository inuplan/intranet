'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var ReactDOM = _interopDefault(require('react-dom'));
var reactRouter = require('react-router');
var reactBootstrap = require('react-bootstrap');
var reactRedux = require('react-redux');
var underscore = require('underscore');
var fetch = _interopDefault(require('isomorphic-fetch'));
var marked = _interopDefault(require('marked'));
var removeMd = _interopDefault(require('remove-markdown'));
var redux = require('redux');
var thunk = _interopDefault(require('redux-thunk'));
var es6Promise = require('es6-promise');
var es6ObjectAssign = require('es6-object-assign');

var NavLink = (function (superclass) {
    function NavLink(props, context) {
        superclass.call(this, props);
    }

    if ( superclass ) NavLink.__proto__ = superclass;
    NavLink.prototype = Object.create( superclass && superclass.prototype );
    NavLink.prototype.constructor = NavLink;

    NavLink.prototype.render = function render () {
        var isActive = this.context.router.isActive(this.props.to, true),
            className = isActive ? "active" : "";

        return (
            React.createElement( 'li', { className: className }, 
                React.createElement( reactRouter.Link, { to: this.props.to }, 
                    this.props.children
                )
            )
        )
    };

    return NavLink;
}(React.Component));

NavLink.contextTypes = {
    router: React.PropTypes.object
}

var IndexNavLink = (function (superclass) {
    function IndexNavLink(props, context) {
        superclass.call(this, props);
    }

    if ( superclass ) IndexNavLink.__proto__ = superclass;
    IndexNavLink.prototype = Object.create( superclass && superclass.prototype );
    IndexNavLink.prototype.constructor = IndexNavLink;

    IndexNavLink.prototype.render = function render () {
        var isActive = this.context.router.isActive(this.props.to, true),
            className = isActive ? "active" : "";

        return (
            React.createElement( 'li', { className: className }, 
                React.createElement( reactRouter.IndexLink, { to: this.props.to }, 
                    this.props.children
                )
            )
        )
    };

    return IndexNavLink;
}(React.Component));

IndexNavLink.contextTypes = {
    router: React.PropTypes.object
}

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
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                        React.createElement( reactBootstrap.Alert, { bsStyle: "danger", onDismiss: clearError }, 
                            React.createElement( 'strong', null, title ), 
                            React.createElement( 'p', null, message )
                        )
                    )
                )
    };

    return Error;
}(React.Component));

// Image actions
var SET_SELECTED_IMG = 'SET_SELECTED_IMG';
var ADD_IMAGE = 'ADD_IMAGE';
var REMOVE_IMAGE = 'REMOVE_IMAGE';
var SET_IMAGES_OWNER = 'SET_IMAGES_OWNER';
var RECIEVED_USER_IMAGES = 'RECIEVED_USER_IMAGES';
var ADD_SELECTED_IMAGE_ID = 'ADD_SELECTED_IMAGE_ID';
var REMOVE_SELECTED_IMAGE_ID = 'REMOVE_SELECTED_IMAGE_ID';
var CLEAR_SELECTED_IMAGE_IDS = 'CLEAR_SELECTED_IMAGE_IDS';
var INCR_IMG_COMMENT_COUNT = 'INCR_IMG_COMMENT_COUNT';
var DECR_IMG_COMMENT_COUNT = 'DECR_IMG_COMMENT_COUNT';

// User actions
var SET_CURRENT_USER_ID = 'SET_CURRENT_USER_ID';
var ADD_USER = 'ADD_USER';
var RECIEVED_USERS = 'RECIEVED_USERS';

// Comment actions
var ADD_COMMENT = 'ADD_COMMENT';
var RECIEVED_COMMENTS = 'RECIEVED_COMMENTS';
var SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
var SET_TOTAL_PAGES = 'SET_TOTAL_PAGES';
var SET_SKIP_COMMENTS = 'SET_SKIP_COMMENTS';
var SET_TAKE_COMMENTS = 'SET_TAKE_COMMENTS';
var SET_FOCUSED_COMMENT = 'SET_FOCUSED_COMMENT';

// WhatsNew
var SET_LATEST = 'SET_LATEST';
var SET_SKIP_WHATS_NEW = 'SET_SKIP_WHATS_NEW';
var SET_TAKE_WHATS_NEW = 'SET_TAKE_WHATS_NEW';
var SET_PAGE_WHATS_NEW = 'SET_PAGE_WHATS_NEW';
var SET_TOTAL_PAGES_WHATS_NEW = 'SET_TOTAL_PAGES_WHATS_NEW';

// Error actions
var SET_ERROR_TITLE = 'SET_ERROR_TITLE';
var SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE'
var SET_HAS_ERROR = 'SET_HAS_ERROR';
var CLEAR_ERROR_TITLE = 'CLEAR_ERROR_TITLE';
var CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';

var SET_THREAD_TITLES = 'SET_THREAD_TITLES';
var SET_TOTAL_PAGES_THREADS = 'SET_TOTAL_PAGES_THREADS';
var SET_PAGE_THREADS = 'SET_PAGE_THREADS';
var SET_SKIP_THREADS = 'SET_SKIP_THREAD';
var SET_TAKE_THREADS = 'SET_TAKE_THREADS';
var SET_SELECTEDTHREAD_ID = 'SET_SELECTEDTHREAD_ID';
var SET_POST_CONTENT = 'SET_POST_CONTENT';
var ADD_THREAD_TITLE = 'ADD_THREAD_TITLE';
var UPDATE_THREAD_TITLE = 'UPDATE_THREAD_TITLE';

// StatusInfo
var SET_USED_SPACE_KB = 'SET_USED_SPACE_KB';
var SET_TOTAL_SPACE_KB = 'SET_TOTAL_SPACE_KB';

var setErrorTitle = function (title) {
    return {
        type: SET_ERROR_TITLE,
        title: title
    }
}

var clearErrorTitle = function () {
    return {
        type: CLEAR_ERROR_TITLE
    }
}

var setErrorMessage = function (message) {
    return {
        type: SET_ERROR_MESSAGE,
        message: message
    }
}

var clearErrorMessage = function () {
    return {
        type: CLEAR_ERROR_MESSAGE
    }
}

var clearError = function () {
    return function (dispatch) {
        dispatch(clearErrorTitle());
        dispatch(clearErrorMessage());
        dispatch(setHasError(false));
        return Promise.resolve();
    }
}

var setHasError = function (hasError) {
    return {
        type: SET_HAS_ERROR,
        hasError: hasError
    }
}

var setError = function (error) {
    return function (dispatch) {
        dispatch(setHasError(true));
        dispatch(setErrorTitle(error.title));
        dispatch(setErrorMessage(error.message));
        return Promise.resolve();
    }
}

var HttpError = function HttpError(title, message) {
    this.title = title;
    this.message = message;
};

var mapStateToProps = function (state) {
    var user = underscore.values(state.usersInfo.users).filter(function (u) { return u.Username.toUpperCase() == globals.currentUsername.toUpperCase(); })[0];
    var name = user ? user.FirstName : 'User';
    return {
        hasError: state.statusInfo.hasError,
        error: state.statusInfo.errorInfo,
        name: name
    };
}

var mapDispatchToProps = function (dispatch) {
    return {
        clearError: function () { return dispatch(clearError()); }
    }
}

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
        return (hasError ?
            React.createElement( Error, {
                title: title, message: message, clearError: clearError })
            : null);
    };

    Shell.prototype.render = function render () {
        var ref = this.props;
        var name = ref.name;
        var employeeUrl = globals.urls.employeeHandbook;
        var c5SearchUrl = globals.urls.c5Search;
        return  React.createElement( reactBootstrap.Grid, { fluid: true }, 
                    React.createElement( reactBootstrap.Navbar, { fixedTop: true }, 
                        React.createElement( reactBootstrap.Navbar.Header, null, 
                            React.createElement( reactBootstrap.Navbar.Brand, null, 
                                React.createElement( 'a', { href: "http://intranetside", className: "navbar-brand" }, "Inuplan Intranet")
                            ), 
                            React.createElement( reactBootstrap.Navbar.Toggle, null )
                        ), 

                        React.createElement( reactBootstrap.Navbar.Collapse, null, 
                            React.createElement( reactBootstrap.Nav, null, 
                                React.createElement( IndexNavLink, { to: "/" }, "Forside"), 
                                React.createElement( NavLink, { to: "/forum" }, "Forum"), 
                                React.createElement( NavLink, { to: "/users" }, "Brugere"), 
                                React.createElement( NavLink, { to: "/about" }, "Om")                                
                            ), 

                            React.createElement( reactBootstrap.Navbar.Text, { pullRight: true }, "Hej, ", name, "!"), 

                            React.createElement( reactBootstrap.Nav, { pullRight: true }, 
                                React.createElement( reactBootstrap.NavDropdown, { eventKey: 5, title: "Links", id: "extern_links" }, 
                                    React.createElement( reactBootstrap.MenuItem, { href: employeeUrl, eventKey: 5.1 }, "Medarbejder håndbog"), 
                                    React.createElement( reactBootstrap.MenuItem, { href: c5SearchUrl, eventKey: 5.2 }, "C5 Søgning")
                                )
                            )

                        )

                    ), 
                        this.errorView(), 
                        this.props.children
                )
    };

    return Shell;
}(React.Component));

var Main = reactRedux.connect(mapStateToProps, mapDispatchToProps)(Shell);

var options = {
    mode: 'cors',
    credentials: 'include'
}

var getFullName = function (user, none) {
    if ( none === void 0 ) none = '';

    if(!user) { return none; }
    return ((user.FirstName) + " " + (user.LastName));
}

var normalizeImage = function (img) {
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
}

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
    }
}

var normalizeLatest = function (latest) {
    var item = null;
    var authorId = -1;
    if(latest.Type == 1) {
        // Image - omit Author and CommentCount
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
        authorId = latest.Item.Author.ID;
    }
    else if (latest.Type == 2) {
        // Comment - omit Author and Deleted and Replies
        var comment = latest.Item;
        item = {
            ID: comment.ID,
            Text: comment.Text,
            ImageID: comment.ImageID,
            ImageUploadedBy: comment.ImageUploadedBy,
            Filename: comment.Filename
        };
        authorId = latest.Item.Author.ID;
    }
    else if (latest.Type == 4) {
        var post = latest.Item;
        item = {
            ID: post.ThreadID,
            Title: post.Header.Title,
            Text: post.Text,
            Sticky: post.Header.Sticky,
            CommentCount: post.Header.CommentCount
        }
        authorId = post.Header.Author.ID;
    }

    return {
        ID: latest.ID,
        Type: latest.Type,
        Item: item,
        On: latest.On,
        AuthorID: authorId,
    }
}

var normalizeThreadTitle = function (title) {
    var viewedBy = title.ViewedBy.map(function (user) { return user.ID; });
    var latestComment = title.LatestComment ? normalizeComment(title.LatestComment) : null;
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
    }
}

function union(arr1, arr2, equalityFunc) {
    var union = arr1.concat(arr2);

    for (var i = 0; i < union.length; i++) {
        for (var j = i+1; j < union.length; j++) {
            if (equalityFunc(union[i], union[j])) {
                union.splice(j, 1);
                j--;
            }
        }
    }

    return union;
}

var getImageCommentsPageUrl = function (imageId, skip, take) {
    return ((globals.urls.imagecomments) + "?imageId=" + imageId + "&skip=" + skip + "&take=" + take);
}

var getImageCommentsDeleteUrl = function (commentId) {
    return ((globals.urls.imagecomments) + "?commentId=" + commentId);
}

var getForumCommentsPageUrl = function (postId, skip, take) {
    return ((globals.urls.forumcomments) + "?postId=" + postId + "&skip=" + skip + "&take=" + take);
}

var getForumCommentsDeleteUrl = function (commentId) {
    return ((globals.urls.forumcomments) + "?commentId=" + commentId);
}

var formatText = function (text) {
    if (!text) { return; }
    var rawMarkup = marked(text, { sanitize: true });
    return { __html: rawMarkup };
}

var getWords = function (text, numberOfWords) {
    if(!text) { return ""; }
    var plainText = removeMd(text);
    return plainText.split(/\s+/).slice(0, numberOfWords).join(" ");
}

var timeText = function (postedOn) {
    var ago = moment(postedOn).fromNow();
    var diff = moment().diff(postedOn, 'hours', true);
    if (diff >= 12.5) {
        var date = moment(postedOn);
        return "d. " + date.format("D MMM YYYY ") + "kl. " + date.format("H:mm");
    }

    return "for " + ago;
}

var responseHandler = function (dispatch, response) {
    if (response.ok) { return response.json(); }
    else {
        switch (response.status) {
            case 400:
                dispatch(setError(new HttpError("400 Bad Request", "The request was not well-formed")));
                break;
            case 404:
                dispatch(setError(new HttpError("404 Not Found", "Could not find resource")));
                break;
            case 408:
                dispatch(setError(new HttpError("408 Request Timeout", "The server did not respond in time")));
            case 500:
                dispatch(setError(new HttpError("500 Server Error", "Something went wrong with the API-server")));
                break;
            default:
                dispatch(setError(new HttpError("Oops", "Something went wrong!")));
                break;
        }

        return Promise.reject();
    }
}

var onReject = function () { }

var put = function (obj, key, value) {
    var kv = Object.assign({}, obj);
    kv[key] = value;
    return kv;
}

var objMap = function (arr, key, val) {
    var obj = arr.reduce(function (res, item) {
        var k = key(item);
        var v = val(item);
        res[k] = v;
        return res;
    }, {});

    return obj
}

var getUrl = function (username) { return globals.urls.users + '?username=' + username; };

function setCurrentUserId(id) {
    return {
        type: SET_CURRENT_USER_ID,
        id: id
    };
}

function addUser(user) {
    return {
        type: ADD_USER,
        user: user
    };
}

function recievedUsers(users) {
    return {
        type: RECIEVED_USERS,
        users: users
    }
}

function fetchCurrentUser(username) {
    return function(dispatch) {
        var url = getUrl(username);

        var handler = responseHandler.bind(this, dispatch);

        return fetch(url, options)
            .then(handler)
            .then(function (user) {
                dispatch(setCurrentUserId(user.ID));
                dispatch(addUser(user));
            }, onReject);
    }
}

function fetchUsers() {
    return function(dispatch) {
        var handler = responseHandler.bind(this, dispatch);
        return fetch(globals.urls.users, options)
            .then(handler)
            .then(function (users) {
                var getKey = function (user) { return user.ID; };
                var getValue = function (user) { return user; };
                var obj = objMap(users, getKey, getValue);
                dispatch(recievedUsers(obj));
            }, onReject);
    }
}

function setLatest(latest) {
    return {
        type: SET_LATEST,
        latest: latest
    }
}

function setSKip(skip) {
    return {
        type: SET_SKIP_WHATS_NEW,
        skip: skip
    }
}

function setTake(take) {
    return {
        type: SET_TAKE_WHATS_NEW,
        take: take
    }
}

function setPage(page) {
    return {
        type: SET_PAGE_WHATS_NEW,
        page: page
    }
}

function setTotalPages(totalPages) {
    return {
        type: SET_TOTAL_PAGES_WHATS_NEW,
        totalPages: totalPages
    }
}

function fetchLatestNews(skip, take) {
    return function(dispatch) {
        var url = globals.urls.whatsnew + "?skip=" + skip + "&take=" + take;
        var handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(function (page) {
                var items = page.CurrentItems;
                items.forEach(function (item) {
                    var author = item.Item.Author;
                    if(author)
                        { dispatch(addUser(author)); }
                });

                // Reset info
                dispatch(setSKip(skip));
                dispatch(setTake(take));
                dispatch(setPage(page.CurrentPage));
                dispatch(setTotalPages(page.TotalPages));

                var normalized = items.map(normalizeLatest);
                dispatch(setLatest(normalized));
            }, onReject);
    }
}

var CommentProfile = (function (superclass) {
    function CommentProfile () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) CommentProfile.__proto__ = superclass;
    CommentProfile.prototype = Object.create( superclass && superclass.prototype );
    CommentProfile.prototype.constructor = CommentProfile;

    CommentProfile.prototype.render = function render () {
        return  React.createElement( reactBootstrap.Media.Left, { className: "comment-profile" }, 
                    React.createElement( reactBootstrap.Image, {
                        src: "/images/person_icon.svg", style: { width: "64px", height: "64px" }, className: "media-object" }), 
                    this.props.children
                )
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
        return  React.createElement( reactBootstrap.Tooltip, { id: "tooltip" }, tip)
    };

    WhatsNewTooltip.prototype.render = function render () {
        var ref = this.props;
        var tooltip = ref.tooltip;
        var children = ref.children;
        return  React.createElement( reactBootstrap.OverlayTrigger, { placement: "left", overlay: this.tooltipView(tooltip) }, 
                    children
                )
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
        return React.createElement( reactBootstrap.Tooltip, { id: "tooltip_img" }, "Bruger billede")
    };

    WhatsNewItemImage.prototype.render = function render () {
        var ref = this.props;
        var imageId = ref.imageId;
        var commentId = ref.commentId;
        var author = ref.author;
        var filename = ref.filename;
        var extension = ref.extension;
        var thumbnail = ref.thumbnail;
        var username = author.Username;
        var file = filename + "." + extension;
        var link = username + "/gallery/image/" + imageId
        var name = (author.FirstName) + " " + (author.LastName);

        return  React.createElement( WhatsNewTooltip, { tooltip: "Uploadet billede" }, 
                    React.createElement( reactBootstrap.Media.ListItem, { className: "whatsnewItem hover-shadow" }, 
                        React.createElement( CommentProfile, null ), 
                        React.createElement( reactBootstrap.Media.Body, null, 
                            React.createElement( 'blockquote', null, 
                                React.createElement( reactRouter.Link, { to: link }, 
                                    React.createElement( reactBootstrap.Image, { src: thumbnail, thumbnail: true })
                                ), 
                                React.createElement( 'footer', null, name, " ", this.when(), React.createElement( 'br', null ), React.createElement( reactBootstrap.Glyphicon, { glyph: "picture" }), " ", file )
                            )
                        )
                    )
                )
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
        return author.FirstName + ' ' + author.LastName;
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
        var author = ref.author;
        var filename = ref.filename;
        var username = uploadedBy.Username;
        var name = this.fullname();
        var summary = this.createSummary();
        var link = username + "/gallery/image/" + imageId + "/comment?id=" + commentId
        return  React.createElement( WhatsNewTooltip, { tooltip: "Kommentar" }, 
                    React.createElement( reactBootstrap.Media.ListItem, { className: "whatsnewItem hover-shadow" }, 
                        React.createElement( CommentProfile, null ), 
                        React.createElement( reactBootstrap.Media.Body, null, 
                            React.createElement( 'blockquote', null, 
                                React.createElement( reactRouter.Link, { to: link }, React.createElement( 'em', null, React.createElement( 'p', { dangerouslySetInnerHTML: summary }) )), 
                                React.createElement( 'footer', null, name, " ", this.when(), React.createElement( 'br', null ), React.createElement( reactBootstrap.Glyphicon, { glyph: "comment" }), " ", filename )
                            )
                        )
                    )
                )
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
        return author.FirstName + ' ' + author.LastName;
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
        return React.createElement( reactBootstrap.Tooltip, { id: "tooltip_post" }, "Forum indlæg, antal kommentarer: ", commentCount)
    };

    WhatsNewForumPost.prototype.showModal = function showModal (e) {
        e.preventDefault();

        var ref = this.props;
        var preview = ref.preview;
        var index = ref.index;
        preview(index);
    };

    WhatsNewForumPost.prototype.render = function render () {
        var ref = this.props;
        var title = ref.title;
        var postId = ref.postId;
        var name = this.fullname();
        var link = "forum/post/" + postId + "/comments";
         return React.createElement( WhatsNewTooltip, { tooltip: "Forum indlæg" }, 
                    React.createElement( reactBootstrap.Media.ListItem, { className: "whatsnewItem hover-shadow" }, 
                        React.createElement( CommentProfile, null ), 
                        React.createElement( reactBootstrap.Media.Body, null, 
                            React.createElement( 'blockquote', null, 
                                React.createElement( 'a', { href: "#", onClick: this.showModal }, this.summary(), "..."), 
                                React.createElement( 'footer', null, name, " ", this.when(), React.createElement( 'br', null ), React.createElement( reactBootstrap.Glyphicon, { glyph: "list-alt" }), " ", title )
                            )
                        )
                    )
                )
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
        var preview = ref.preview;
        var generateKey = function (id) { return "whatsnew_" + id; };
        return items.map( function (item, index) {
            var itemKey = generateKey(item.ID);
            var author = getUser(item.AuthorID);
            switch (item.Type) {
                case 1:
                    return  React.createElement( WhatsNewItemImage, {
                                id: item.ID, on: item.On, imageId: item.Item.ImageID, filename: item.Item.Filename, extension: item.Item.Extension, thumbnail: item.Item.ThumbnailUrl, preview: item.Item.PreviewUrl, author: author, key: itemKey })
                case 2:
                    return  React.createElement( WhatsNewItemComment, {
                                id: item.ID, commentId: item.Item.ID, text: item.Item.Text, uploadedBy: item.Item.ImageUploadedBy, imageId: item.Item.ImageID, on: item.On, author: author, filename: item.Item.Filename, key: itemKey })
                case 4:
                    return  React.createElement( WhatsNewForumPost, {
                                on: item.On, author: author, title: item.Item.Title, text: item.Item.Text, sticky: item.Item.Sticky, postId: item.Item.ID, commentCount: item.Item.CommentCount, preview: this$1.previewPostHandle, index: index, key: itemKey })
            }
        })
    };

    WhatsNewList.prototype.render = function render () {
        var itemNodes = this.constructItems();
        return  React.createElement( reactBootstrap.Media.List, null, 
                    itemNodes
                )
    };

    return WhatsNewList;
}(React.Component));

var ForumForm = (function (superclass) {
    function ForumForm(props) {
        superclass.call(this, props);
        this.state = {
            Title: '',
            Text: '',
            Sticky: false,
            IsPublished: true,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    if ( superclass ) ForumForm.__proto__ = superclass;
    ForumForm.prototype = Object.create( superclass && superclass.prototype );
    ForumForm.prototype.constructor = ForumForm;

    ForumForm.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
        var edit = nextProps.edit;
        if(edit) {
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
        if (length > 0 && length < 200) { return 'success'; }
        if (length >= 200 && length <= 250) { return 'warning'; }
        if (length > 250) { return 'error'; }
    };

    ForumForm.prototype.transformToDTO = function transformToDTO (state) {
        // A ThreadPostContent class
        return {
            Header: {
                IsPublished: state.IsPublished,
                Sticky: state.Sticky,
                Title: state.Title
            },
            Text: state.Text
        }
    };

    ForumForm.prototype.handleSubmit = function handleSubmit (e) {
        e.preventDefault();
        var ref = this.props;
        var close = ref.close;
        var onSubmit = ref.onSubmit;

        // Do whatever work here...
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
        var title =  readMode ? 'Skriv nyt indlæg' : 'Ændre indlæg';
        var btnSubmit = readMode ? 'Skriv indlæg' : 'Gem ændringer';
        return  React.createElement( reactBootstrap.Modal, { show: show, onHide: this.closeHandle.bind(this), bsSize: "lg" }, 
                    React.createElement( 'form', null, 
                        React.createElement( reactBootstrap.Modal.Header, { closeButton: true }, 
                            React.createElement( reactBootstrap.Modal.Title, null, title )
                        ), 
                        React.createElement( reactBootstrap.Modal.Body, null, 
                            React.createElement( reactBootstrap.Row, null, 
                                React.createElement( reactBootstrap.Col, { lg: 12 }, 

                                        React.createElement( reactBootstrap.FormGroup, { controlId: "formPostTitle", validationState: this.getValidation() }, 
                                            React.createElement( reactBootstrap.ControlLabel, null, "Overskrift" ), 
                                            React.createElement( reactBootstrap.FormControl, { type: "text", placeholder: "Overskrift på indlæg...", onChange: this.handleTitleChange.bind(this), value: this.state.Title })
                                        ), 

                                        React.createElement( reactBootstrap.FormGroup, { controlId: "formPostContent" }, 
                                            React.createElement( reactBootstrap.ControlLabel, null, "Indlæg" ), 
                                            React.createElement( reactBootstrap.FormControl, { componentClass: "textarea", placeholder: "Skriv besked her...", onChange: this.handleTextChange.bind(this), value: this.state.Text, rows: "8" })
                                        ), 

                                        React.createElement( reactBootstrap.FormGroup, { controlId: "formPostSticky" }, 
                                            React.createElement( reactBootstrap.ButtonGroup, null, 
                                                React.createElement( reactBootstrap.Button, { bsStyle: "success", bsSize: "small", active: this.state.Sticky, onClick: this.handleSticky.bind(this) }, React.createElement( reactBootstrap.Glyphicon, { glyph: "pushpin" }), " Vigtig")
                                            )
                                        )

                                )
                            )
                        ), 
                        React.createElement( reactBootstrap.Modal.Footer, null, 
                            React.createElement( reactBootstrap.Button, { bsStyle: "default", onClick: this.closeHandle.bind(this) }, "Luk"), 
                            React.createElement( reactBootstrap.Button, { bsStyle: "primary", type: "submit", onClick: this.handleSubmit }, btnSubmit)
                        )
                    )
                )
    };

    return ForumForm;
}(React.Component));

var CommentControls = (function (superclass) {
    function CommentControls(props) {
        superclass.call(this, props);
        this.state = {
            text: props.text,
            replyText: '',
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
        this.setState({ replyText: e.target.value })
    };

    CommentControls.prototype.toggleEdit = function toggleEdit () {
        var ref = this.state;
        var edit = ref.edit;
        this.setState({ edit: !edit });
        if(!edit) {
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

        this.setState({ reply: false, replyText: '' });
        replyComment(contextId, replyText, commentId);
    };

    CommentControls.prototype.render = function render () {
        var ref = this.props;
        var commentId = ref.commentId;
        var authorId = ref.authorId;
        var canEdit = ref.canEdit;
        var ref$1 = this.state;
        var edit = ref$1.edit;
        var text = ref$1.text;
        var reply = ref$1.reply;
        var replyText = ref$1.replyText;
        var mount = canEdit(authorId);

        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Row, { style: {paddingBottom: '5px', paddingLeft: "15px"} }, 
                        React.createElement( reactBootstrap.Col, { lg: 4 }, 
                            React.createElement( reactBootstrap.ButtonToolbar, null, 
                                React.createElement( reactBootstrap.ButtonGroup, null, 

                                    React.createElement( ButtonTooltip, { bsStyle: "primary", onClick: this.deleteHandle, icon: "trash", tooltip: "slet", mount: mount }), 
                                    React.createElement( ButtonTooltip, { bsStyle: "primary", onClick: this.toggleEdit, icon: "pencil", tooltip: "ændre", active: edit, mount: mount }), 
                                    React.createElement( ButtonTooltip, { bsStyle: "primary", onClick: this.toggleReply, icon: "envelope", tooltip: "svar", active: reply, mount: true })

                                )
                            )
                        )
                    ), 
                    React.createElement( reactBootstrap.Row, { style: {paddingBottom: '5px'} }, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 1, lg: 10 }, 
                            React.createElement( CollapseTextArea, {
                                show: edit, id: "editTextControl", value: text, onChange: this.handleTextChange, toggle: this.toggleEdit, save: this.editHandle, saveText: "Gem ændringer", mount: mount })
                        )
                    ), 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 1, lg: 10 }, 
                            React.createElement( CollapseTextArea, {
                                show: reply, id: "replyTextControl", value: replyText, onChange: this.handleReplyChange, toggle: this.toggleReply, save: this.replyHandle, saveText: "Svar", mount: true })
                        )
                    )
                )
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
        if(!mount) { return null; }
        return  React.createElement( reactBootstrap.Collapse, { in: show }, 
                    React.createElement( reactBootstrap.FormGroup, { controlId: id }, 
                        React.createElement( reactBootstrap.FormControl, { componentClass: "textarea", value: value, onChange: onChange, rows: "4" }), 
                        React.createElement( 'br', null ), 
                        React.createElement( reactBootstrap.ButtonToolbar, null, 
                            React.createElement( reactBootstrap.Button, { onClick: toggle }, "Luk"), 
                            React.createElement( reactBootstrap.Button, { type: "submit", bsStyle: "info", onClick: save }, saveText)
                        )
                    )
                )
    };

    return CollapseTextArea;
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
        var overlayTip = React.createElement( reactBootstrap.Tooltip, { id: "tooltip" }, tooltip);

        if(!mount) { return null; }

        return  React.createElement( reactBootstrap.OverlayTrigger, { placement: "top", overlay: overlayTip }, 
                    React.createElement( reactBootstrap.Button, { bsStyle: bsStyle, bsSize: "xsmall", onClick: onClick, active: active }, 
                        React.createElement( reactBootstrap.Glyphicon, { glyph: icon })
                    )
                )
    };

    return ButtonTooltip;
}(React.Component));

var updateThreadTitle = function (title) {
    return {
        type: UPDATE_THREAD_TITLE,
        id: title.ID,
        title: title,
    }
}

var setThreadTitles = function (titles) {
    return {
        type: SET_THREAD_TITLES,
        titles: titles
    }
}

var setTotalPages$1 = function (totalPages) {
    return {
        type: SET_TOTAL_PAGES_THREADS,
        totalPages: totalPages
    }
}

var setPage$1 = function (page) {
    return {
        type: SET_PAGE_THREADS,
        page: page
    }
}

var setSkip = function (skip) {
    return {
        type: SET_SKIP_THREADS,
        skip: skip
    }
}

var setTake$1 = function (take) {
    return {
        type: SET_TAKE_THREADS,
        take: take
    }
}

var setSelectedThread = function (id) {
    return {
        type: SET_SELECTEDTHREAD_ID,
        id: id
    }
}

var setPostContent = function (content) {
    return {
        type: SET_POST_CONTENT,
        content: content
    }
}

var markPost = function (postId, read, cb) {
    return function(dispatch) {
        var url = (globals.urls.forumpost) + "?postId=" + postId + "&read=" + read;
        var opt = Object.assign({}, options, {
            method: 'PUT'
        });
        return fetch(url, opt)
            .then(cb, onReject);
    }
}

var fetchThreads = function (skip, take) {
    if ( skip === void 0 ) skip = 0;
    if ( take === void 0 ) take = 10;

    return function(dispatch) {
        var forum = globals.urls.forumtitle;
        var url = forum + "?skip=" + skip + "&take=" + take;
        var handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(function (data) {
                // Unprocessed forum titles
                var pageForumTitles = data.CurrentItems;
                var forumTitles = pageForumTitles.map(normalizeThreadTitle);

                // Set info
                dispatch(setSkip(skip));
                dispatch(setTake$1(take));
                dispatch(setTotalPages$1(data.TotalPages));
                dispatch(setPage$1(data.CurrentPage));

                // Set threads
                dispatch(setThreadTitles(forumTitles));
            }, onReject);
    }
}

var fetchPost = function (id, cb) {
    return function(dispatch) {
        var forum = globals.urls.forumpost;
        var url = forum + "?id=" + id;
        var handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(function (data) {
                var content = data.Text;
                var title = normalizeThreadTitle(data.Header);

                dispatch(updateThreadTitle(title));
                dispatch(setPostContent(content));
                dispatch(setSelectedThread(data.ThreadID));
            })
            .then(cb);
    }
}

var updatePost = function (id, post, cb) {
    return function(dispatch) {
        var url = (globals.urls.forumpost) + "?id=" + id;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var handler = responseHandler.bind(this, dispatch);

        var opt = Object.assign({}, options, {
            method: 'PUT',
            body: JSON.stringify(post),
            headers: headers
        });

        return fetch(url, opt)
            .then(cb, onReject);
    }
}

var deletePost = function (id, cb) {
    return function(dispatch) {
        var url = (globals.urls.forumpost) + "?id=" + id;
        var opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        var handler = responseHandler.bind(this, dispatch);
        return fetch(url, opt)
            .then(cb, onReject);
    }
}

// post: ThreadPostContent
var postThread = function (cb, post) {
    return function(dispatch) {
        var url = globals.urls.forumpost;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var opt = Object.assign({}, options, {
            method: 'POST',
            body: JSON.stringify(post),
            headers: headers
        });

        return fetch(url, opt)
            .then(function () { return cb(); }, onReject);
    }
}

var this$1 = undefined;
﻿var setSkipComments = function (skip) {
    return {
        type: SET_SKIP_COMMENTS,
        skip: skip
    };
}

var setTakeComments = function (take) {
    return {
        type: SET_TAKE_COMMENTS,
        take: take
    };
}

function setCurrentPage(page) {
    return {
        type: SET_CURRENT_PAGE,
        page: page
    };
}

function setTotalPages$2(totalPages) {
    return {
        type: SET_TOTAL_PAGES,
        totalPages: totalPages
    };
}

function receivedComments(comments) {
    return {
        type: RECIEVED_COMMENTS,
        comments: comments
    };
}

function setFocusedComment(commentId) {
    return {
        type: SET_FOCUSED_COMMENT,
        id: commentId
    }
}

function fetchComments(url, skip, take) {
    return function(dispatch) {
        var handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(function (data) {
                // Unprocessed comments
                var pageComments = data.CurrentItems;

                // Set (re-set) info
                dispatch(setSkipComments(skip));
                dispatch(setTakeComments(take));
                dispatch(setCurrentPage(data.CurrentPage));
                dispatch(setTotalPages$2(data.TotalPages));

                // normalize
                var comments = pageComments.map(normalizeComment);
                dispatch(receivedComments(comments));
            }, onReject);
    }
}

var postComment = function (url, contextId, text, parentCommentId, cb) {
    return function (dispatch) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var body =JSON.stringify({
            Text: text,
            ContextID: contextId,
            ParentID: parentCommentId
        });

        var opt = Object.assign({}, options, {
            method: 'POST',
            body: body,
            headers: headers
        });

        return fetch(url, opt)
            .then(cb, onReject);
    }
}

var editComment = function (url, commentId, text, cb) {
    return function(dispatch, getState) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var opt = Object.assign({}, options, {
            method: 'PUT',
            body: JSON.stringify({ ID: commentId, Text: text }),
            headers: headers
        });

        return fetch(url, opt)
            .then(cb, onReject);
    }
}

var deleteComment = function (url, cb) {
    return function(dispatch, getState) {
        var opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        return fetch(url, opt)
            .then(cb);
    }
}

var fetchAndFocusSingleComment = function (id) {
    return function (dispatch, getState) {
        var url = (globals.urls.imagecomments) + "/GetSingle?id=" + id;
        var handler = responseHandler.bind(this$1, dispatch);

        return fetch(url, options)
            .then(handler)
            .then(function (c) {
                var comment = normalizeComment(c);
                dispatch(receivedComments([comment]));
                dispatch(setFocusedComment(comment.CommentID));
            }, onReject);
    }
}

var mapStateToProps$3 = function (state) {
    var selected = state.forumInfo.titlesInfo.selectedThread;
    var title = underscore.find(state.forumInfo.titlesInfo.titles, function (title) { return title.ID == selected; });
    return {
        selected: selected,
        title: title,
        text: state.forumInfo.postContent,
        getUser: function (id) { return state.usersInfo.users[id]; },
        canEdit: function (id) { return state.usersInfo.currentUserId == id; },
        hasRead: title ? underscore.contains(title.ViewedBy, state.usersInfo.currentUserId) : false,
    }
}

var mapDispatchToProps$3 = function (dispatch) {
    return {
        update: function (id, post, cb) {
            dispatch(updatePost(id, post, cb));
        },
        getPost: function (id) {
            dispatch(fetchPost(id));
        },
        deletePost: function (id, cb) {
            dispatch(deletePost(id, cb));
        },
        readPost: function (postId, read, cb) {
            dispatch(markPost(postId, read, cb));
        },
    }
}

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
        if(!hasTitle) { return; }

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
        }

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
        }

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
        if(selected < 0 || !title) { return null; }

        var edit = canEdit(title.AuthorID);
        var user = getUser(title.AuthorID);
        var author = getFullName(user);
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( ForumHeader, { lg: 12, name: author, title: title.Title, createdOn: title.CreatedOn, modifiedOn: title.LastModified }, 
                        React.createElement( ForumButtonGroup, {
                            show: true, editable: edit, initialRead: hasRead, onDelete: this.deleteHandle, onEdit: this.toggleEdit, onRead: this.togglePostRead.bind(this, true), onUnread: this.togglePostRead.bind(this, false) })
                    ), 
                    React.createElement( ForumBody, { text: text, lg: 10 }, 
                        React.createElement( 'hr', null ), 
                        this.props.children
                    ), 
                    React.createElement( ForumForm, {
                        show: this.state.edit, close: this.close.bind(this), onSubmit: this.onSubmit.bind(this), edit: this.state.model })
                )
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
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, { lg: lg, lgOffset: lgOffset }, 
                        React.createElement( 'p', { className: "forum-content", dangerouslySetInnerHTML: formattedText }), 
                        React.createElement( reactBootstrap.Row, null, 
                            React.createElement( reactBootstrap.Col, { lg: 12 }, 
                                this.props.children
                            )
                        )
                    )
                )
    };

    return ForumBody;
}(React.Component));

ForumBody.propTypes = {
    text: React.PropTypes.string.isRequired,
    lg: React.PropTypes.number,
    lgOffset: React.PropTypes.number
}

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
        if(!modifiedOn)
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
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, props, 
                        React.createElement( 'h3', null, 
                            React.createElement( 'span', { className: "text-capitalize" }, title), React.createElement( 'br', null ), 
                            React.createElement( 'small', null, "Skrevet af ", name )
                        ), 
                        React.createElement( 'small', { className: "text-primary" }, React.createElement( reactBootstrap.Glyphicon, { glyph: "time" }), " ", created), 
                        React.createElement( reactBootstrap.Row, null, 
                            this.props.children
                        )
                    )
                )

    };

    return ForumHeader;
}(React.Component));

ForumHeader.propTypes = {
    createdOn: React.PropTypes.string,
    modifiedOn: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
}

// props: { show, editable, initialRead, onDelete, onEdit, onRead, onUnread }
var ForumButtonGroup = (function (superclass) {
    function ForumButtonGroup(props) {
        this.state = {
            read: props.initialRead
        }

        this.readHandle = this.readHandle.bind(this);
        this.unreadHandle = this.unreadHandle.bind(this);
    }

    if ( superclass ) ForumButtonGroup.__proto__ = superclass;
    ForumButtonGroup.prototype = Object.create( superclass && superclass.prototype );
    ForumButtonGroup.prototype.constructor = ForumButtonGroup;

    ForumButtonGroup.prototype.readHandle = function readHandle () {
        var ref = this.props;
        var onRead = ref.onRead;
        if(this.state.read) { return; }

        this.setState({ read: true });
        onRead();
    };

    ForumButtonGroup.prototype.unreadHandle = function unreadHandle () {
        var ref = this.props;
        var onUnread = ref.onUnread;
        if(!this.state.read) { return; }

        this.setState({ read: false });
        onUnread();
    };

    ForumButtonGroup.prototype.render = function render () {
        var ref = this.props;
        var editable = ref.editable;
        var show = ref.show;
        var onDelete = ref.onDelete;
        var onEdit = ref.onEdit;
        if(!show) { return null; }

        var ref$1 = this.state;
        var read = ref$1.read;
        return  React.createElement( reactBootstrap.Col, { lg: 12, className: "forum-editbar" }, 
                    React.createElement( reactBootstrap.ButtonToolbar, null, 
                        React.createElement( reactBootstrap.ButtonGroup, null, 
                            React.createElement( ButtonTooltip, { bsStyle: "danger", onClick: onDelete, icon: "trash", tooltip: "slet indlæg", mount: editable }), 
                            React.createElement( ButtonTooltip, { bsStyle: "primary", onClick: onEdit, icon: "pencil", tooltip: "ændre indlæg", active: false, mount: editable }), 
                            React.createElement( ButtonTooltip, { bsStyle: "primary", onClick: this.readHandle, icon: "eye-open", tooltip: "marker som læst", active: read, mount: true }), 
                            React.createElement( ButtonTooltip, { bsStyle: "primary", onClick: this.unreadHandle, icon: "eye-close", tooltip: "marker som ulæst", active: !read, mount: true })
                        )
                    )
                )
    };

    return ForumButtonGroup;
}(React.Component));

ForumButtonGroup.propTypes = {
    show: React.PropTypes.bool.isRequired,
    editable: React.PropTypes.bool.isRequired,
    initialRead: React.PropTypes.bool.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onRead: React.PropTypes.func.isRequired,
    onUnread: React.PropTypes.func.isRequired
}

var ForumPostRedux = reactRedux.connect(mapStateToProps$3, mapDispatchToProps$3)(ForumPostContainer);
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
        if(!(xor || (show && more))) { return null; }

        return  React.createElement( reactBootstrap.Pagination, {
                    prev: true, next: true, ellipsis: true, boundaryLinks: true, items: totalPages, maxButtons: 5, activePage: page, onSelect: pageHandle })
    };

    return Pagination;
}(React.Component));

var mapStateToProps$2 = function (state) {
    return {
        items: state.whatsNewInfo.items,
        getUser: function (id) { return state.usersInfo.users[id]; },
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take,
        totalPages: state.whatsNewInfo.totalPages,
        page: state.whatsNewInfo.page,
    }
}

var mapDispatchToProps$2 = function (dispatch) {
    return {
        getLatest: function (skip, take) { return dispatch(fetchLatestNews(skip, take)); },
    }
}

var WhatsNewContainer = (function (superclass) {
    function WhatsNewContainer(props) {
        superclass.call(this, props);
        this.state = {
            modal: false,
            postPreview: null,
            author: {},
            on: null
        }

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
        if(page == to) { return; }

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
            author: {},
            on: null
        });
    };

    WhatsNewContainer.prototype.modalView = function modalView () {
        var this$1 = this;

        if(!Boolean(this.state.postPreview)) { return null; }
        var ref = this.state.postPreview;
        var Text = ref.Text;
        var Title = ref.Title;
        var ID = ref.ID;
        var author = this.state.author;
        var name = (author.FirstName) + " " + (author.LastName);
        var link = "forum/post/" + ID + "/comments";

        return  React.createElement( reactBootstrap.Modal, { show: this.state.modal, onHide: this.closeModal, bsSize: "large" }, 
                    React.createElement( reactBootstrap.Modal.Header, { closeButton: true }, 
                        React.createElement( reactBootstrap.Modal.Title, null, 
                            React.createElement( ForumHeader, {
                                lg: 11, lgOffset: 1, createdOn: this.state.on, title: Title, name: name })
                        )
                    ), 

                    React.createElement( reactBootstrap.Modal.Body, null, 
                        React.createElement( ForumBody, { text: Text, lg: 11, lgOffset: 1 }
                        )
                    ), 

                    React.createElement( reactBootstrap.Modal.Footer, null, 
                        React.createElement( reactBootstrap.ButtonToolbar, { style: {float: "right"} }, 
                            React.createElement( reactBootstrap.Button, { bsStyle: "primary", onClick: function () { return this$1.navigateTo(link); } }, "Se kommentarer (forum)"), 
                            React.createElement( reactBootstrap.Button, { onClick: this.closeModal }, "Luk")
                        )
                    )
                )
    };

    WhatsNewContainer.prototype.render = function render () {
        var ref = this.props;
        var items = ref.items;
        var getUser = ref.getUser;
        var totalPages = ref.totalPages;
        var page = ref.page;

        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, null, 
                        React.createElement( 'h3', null, "Sidste hændelser" ), 
                        React.createElement( 'hr', null ), 
                        React.createElement( WhatsNewList, {
                            items: items, getUser: getUser, preview: this.previewPost }), 
                        React.createElement( Pagination$1, {
                            totalPages: totalPages, page: page, pageHandle: this.pageHandle }), 
                        this.modalView()
                    )
                )
    };

    return WhatsNewContainer;
}(React.Component));

var WhatsNew = reactRouter.withRouter(reactRedux.connect(mapStateToProps$2, mapDispatchToProps$2)(WhatsNewContainer));

var ImageUpload = (function (superclass) {
    function ImageUpload(props) {
        superclass.call(this, props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    if ( superclass ) ImageUpload.__proto__ = superclass;
    ImageUpload.prototype = Object.create( superclass && superclass.prototype );
    ImageUpload.prototype.constructor = ImageUpload;

    ImageUpload.prototype.clearInput = function clearInput (fileInput) {
        if(fileInput.value){
            try{
                fileInput.value = ''; //for IE11, latest Chrome/Firefox/Opera...
            }catch(err){ }
            if(fileInput.value){ //for IE5 ~ IE10
                var form = document.createElement('form'),
                    parentNode = fileInput.parentNode, ref = fileInput.nextSibling;
                form.appendChild(fileInput);
                form.reset();
                parentNode.insertBefore(fileInput,ref);
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
        var files = this.getFiles();
        if (files.length == 0) { return; }
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append('file', file);
        }

        uploadImage(username, formData);
        var fileInput = document.getElementById("files");
        this.clearInput(fileInput);
    };

    ImageUpload.prototype.render = function render () {
        return  React.createElement( 'form', { onSubmit: this.handleSubmit, id: "form-upload", encType: "multipart/form-data" }, 
                        React.createElement( 'div', { className: "form-group" }, 
                            React.createElement( 'label', { htmlFor: "files" }, "Upload filer:"), 
                            React.createElement( 'input', { type: "file", className: "form-control", id: "files", name: "files", multiple: true })
                        ), 
                    React.createElement( reactBootstrap.Button, { bsStyle: "primary", type: "submit" }, "Upload"), 
                    this.props.children
                )
    };

    return ImageUpload;
}(React.Component));

function setImagesOwner(id) {
    return {
        type: SET_IMAGES_OWNER,
        id: id
    };
}

function recievedUserImages(images) {
    return {
        type: RECIEVED_USER_IMAGES,
        images: images
    };
}

var setSelectedImg = function (id) {
    return {
        type: SET_SELECTED_IMG,
        id: id
    };
}

function addImage(img) {
    return {
        type: ADD_IMAGE,
        key: img.ImageID,
        val: img
    };
}

function removeImage(id) {
    return {
        type: REMOVE_IMAGE,
        key: id
    };
}

function addSelectedImageId(id) {
    return {
        type: ADD_SELECTED_IMAGE_ID,
        id: id
    };
}

function removeSelectedImageId(id) {
    return {
        type: REMOVE_SELECTED_IMAGE_ID,
        id: id
    };
}

function clearSelectedImageIds() {
    return {
        type: CLEAR_SELECTED_IMAGE_IDS
    };
}

var incrementCommentCount = function (imageId) {
    return {
        type: INCR_IMG_COMMENT_COUNT,
        key: imageId
    }
}

var decrementCommentCount = function (imageId) {
    return {
        type: DECR_IMG_COMMENT_COUNT,
        key: imageId
    }
}

function deleteImage(id, username) {
    return function(dispatch) {
        var url = globals.urls.images + "?username=" + username + "&id=" + id;
        var opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        var handler = responseHandler.bind(this, dispatch);

        return fetch(url, opt)
            .then(handler)
            .then(function () { return dispatch(removeImage(id)); }, onReject);
    }
}

function uploadImage(username, formData, onSuccess, onError) {
    return function(dispatch) {
        var url = globals.urls.images + "?username=" + username;
        var opt = Object.assign({}, options, {
            method: 'POST',
            body: formData
        });

        var handler = responseHandler.bind(this, dispatch);

        return fetch(url, opt)
            .then(handler)
            .then(onSuccess, onError);
    }
}

function fetchUserImages(username) {
    return function(dispatch, getState) {
        var url = globals.urls.images + "?username=" + username;

        var handler = responseHandler.bind(this, dispatch);

        var onSuccess = function (data) {
            var normalized = data.map(normalizeImage).reverse();
            var obj = objMap(normalized, function (img) { return img.ImageID; }, function (img) { return img; });
            dispatch(recievedUserImages(obj));
        }

        return fetch(url, options)
            .then(handler)
            .then(onSuccess, onReject);
    }
}

function deleteImages(username, imageIds) {
    if ( imageIds === void 0 ) imageIds = [];

    return function(dispatch) {
        var ids = imageIds.join();
        var url = globals.urls.images + "?username=" + username + "&ids=" + ids;
        var opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        var handler = responseHandler.bind(this, dispatch);

        return fetch(url, opt)
            .then(handler)
            .then(function () { return dispatch(clearSelectedImageIds()); }, onReject)
            .then(function () { return dispatch(fetchUserImages(username)); });
    }
}

function setImageOwner(username) {
    return function(dispatch, getState) {
        // Lazy evaluation
        var findOwner = function () {
            return underscore.find(getState().usersInfo.users, function (user) {
                return user.Username == username;
            });
        }

        var owner = findOwner();

        if(owner) {
            var ownerId = owner.ID;
            dispatch(setImagesOwner(ownerId));
            return Promise.resolve();
        }
        else {
            var url = globals.urls.users + '?username=' + username;
            var handler = responseHandler.bind(this, dispatch);
            return fetch(url, options)
                .then(handler)
                .then(function (user) { return dispatch(addUser(user)); }, onReject)
                .then(function () {
                    owner = findOwner();
                    dispatch(setImagesOwner(owner.ID));
                });
        }
    }
}

function fetchSingleImage(id) {
    return function(dispatch, getState) {
        var url = globals.urls.images + "/getbyid?id=" + id;
        var handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(function (img) {
                if(!img) { return; }
                var normalizedImage = normalizeImage(img);
                dispatch(addImage(normalizedImage));
            });
    }
}

function setUsedSpacekB(usedSpace) {
    return {
        type: SET_USED_SPACE_KB,
        usedSpace: usedSpace
    }
}

function setTotalSpacekB(totalSpace) {
    return {
        type: SET_TOTAL_SPACE_KB,
        totalSpace: totalSpace
    }
}

var fetchSpaceInfo = function (url) {
    return function(dispatch) {
        var handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(function (data) {
                var usedSpace = data.UsedSpaceKB;
                var totalSpace = data.SpaceQuotaKB;

                dispatch(setUsedSpacekB(usedSpace));
                dispatch(setTotalSpacekB(totalSpace));
            }, onReject);
    }
}

var mapStateToProps$4 = function (state) {
    return {
        usedMB: (state.statusInfo.spaceInfo.usedSpacekB / 1000),
        totalMB: (state.statusInfo.spaceInfo.totalSpacekB / 1000),
        loaded: (state.statusInfo.spaceInfo.totalSpacekB != -1)
    }
}

var mapDispatchToProps$4 = function (dispatch) {
    return {
        getSpaceInfo: function (url) {
            dispatch(fetchSpaceInfo(url));
        }
    }
}

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
        var used = Math.round(usedMB*100) / 100;
        var free = Math.round((total - used)*100) / 100;
        var usedPercent = ((used/total)* 100);
        var percentRound = Math.round(usedPercent*100) / 100;
        var show = Boolean(usedPercent) && Boolean(used) && Boolean(free) && Boolean(total);
        if(!show) { return null; }

        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, null, 
                        React.createElement( reactBootstrap.ProgressBar, { striped: true, bsStyle: "success", now: usedPercent, key: 1 }), 
                        React.createElement( 'p', null, "Brugt: ", used.toString(), " MB (", percentRound.toString(), " %)", React.createElement( 'br', null ), "Fri plads: ", free.toString(), " MB", React.createElement( 'br', null ), "Total: ", total.toString(), " MB" )
                    )
                )
    };

    return UsedSpaceView;
}(React.Component));

var UsedSpace = reactRedux.connect(mapStateToProps$4, mapDispatchToProps$4)(UsedSpaceView);

var mapStateToProps$1 = function (state) {
    var user = underscore.values(state.usersInfo.users).filter(function (u) { return u.Username.toUpperCase() == globals.currentUsername.toUpperCase(); })[0];
    var name = user ? user.FirstName : 'User';
    return {
        name: name,
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take
    }
}

var mapDispatchToProps$1 = function (dispatch) {
    return {
        uploadImage: function (skip, take, username, formData) {
            var onSuccess = function () {
                dispatch(fetchLatestNews(skip, take));
            };

            dispatch(uploadImage(username, formData, onSuccess, function () { }));
        }
    }
}

var HomeView = (function (superclass) {
    function HomeView(props) {
        superclass.call(this, props);
        this.state = {
            recommended: true
        }

        this.upload = this.upload.bind(this);
        this.recommendedView = this.recommendedView.bind(this);
    }

    if ( superclass ) HomeView.__proto__ = superclass;
    HomeView.prototype = Object.create( superclass && superclass.prototype );
    HomeView.prototype.constructor = HomeView;

    HomeView.prototype.componentDidMount = function componentDidMount () {
        document.title = "Forside";
    };

    HomeView.prototype.upload = function upload (username, formData) {
        var ref = this.props;
        var uploadImage = ref.uploadImage;
        var skip = ref.skip;
        var take = ref.take;
        uploadImage(skip, take, username, formData);
    };

    HomeView.prototype.recommendedView = function recommendedView () {
        var this$1 = this;

        if(!this.state.recommended) { return null; }

        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, null, 
                        React.createElement( reactBootstrap.Alert, { bsStyle: "success", onDismiss: function () { return this$1.setState({ recommended: false }); } }, 
                            React.createElement( 'h4', null, "Anbefalinger" ), 
                            React.createElement( 'ul', null, 
                                React.createElement( 'li', null, "Testet med Google Chrome browser. Derfor er det anbefalet at bruge denne til at få den fulde oplevelse.", React.createElement( 'br', null ) )
                            )
                        )
                    )
                )
    };

    HomeView.prototype.render = function render () {
        var username = globals.currentUsername;
        var ref = this.props;
        var name = ref.name;
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Jumbotron, null, 
                        React.createElement( 'h1', null, React.createElement( 'span', null, "Velkommen ", React.createElement( 'small', null, name, "!" ) ) ), 
                        React.createElement( 'p', { className: "lead" }, "Til Inuplans forum og billed-arkiv side"), 

                        React.createElement( reactBootstrap.Row, null, 
                            React.createElement( reactBootstrap.Col, { lg: 4 }, 
                                React.createElement( reactBootstrap.Panel, { header: 'Du kan uploade billeder til dit eget galleri her', bsStyle: "primary" }, 
                                    React.createElement( ImageUpload, { username: username, uploadImage: this.upload })
                                )
                            )
                        )
                    ), 
                    React.createElement( reactBootstrap.Grid, { fluid: true }, 
                        React.createElement( reactBootstrap.Row, null, 
                            React.createElement( reactBootstrap.Col, { lg: 2 }
                            ), 
                            React.createElement( reactBootstrap.Col, { lg: 4 }, 
                                React.createElement( WhatsNew, null )
                            ), 
                            React.createElement( reactBootstrap.Col, { lgOffset: 1, lg: 3 }, 
                                this.recommendedView(), 
                                React.createElement( 'h3', null, "Personlig upload forbrug" ), 
                                React.createElement( 'hr', null ), 
                                React.createElement( 'p', null, "Herunder kan du se hvor meget plads du har brugt og hvor meget fri plads der er tilbage. Gælder kun billede filer." ), 
                                React.createElement( UsedSpace, null )
                            )
                        )
                    )
                )
    };

    return HomeView;
}(React.Component));

var Home = reactRedux.connect(mapStateToProps$1, mapDispatchToProps$1)(HomeView)

var Forum = (function (superclass) {
    function Forum () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) Forum.__proto__ = superclass;
    Forum.prototype = Object.create( superclass && superclass.prototype );
    Forum.prototype.constructor = Forum;

    Forum.prototype.render = function render () {
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                        React.createElement( 'h1', null, "Forum ", React.createElement( 'small', null, "indlæg" ) ), 
                        React.createElement( 'hr', null ), 
                        this.props.children
                    )
                )
    };

    return Forum;
}(React.Component));

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
        if(!modifiedOn) { return null; }
        var modifiedDate = moment(modifiedOn).format("D/MM/YY-H:mm");
        return ("" + modifiedDate);
    };

    ForumTitle.prototype.tooltipView = function tooltipView () {
        return  React.createElement( reactBootstrap.Tooltip, { id: "tooltip" }, "Vigtig")
    };

    ForumTitle.prototype.stickyIcon = function stickyIcon (show) {
        if(!show) { return null; }
        return  React.createElement( 'p', { className: "sticky" }, 
                    React.createElement( reactBootstrap.OverlayTrigger, { placement: "top", overlay: this.tooltipView() }, 
                        React.createElement( reactBootstrap.Glyphicon, { glyph: "pushpin" })
                    )
                )
    };

    ForumTitle.prototype.dateModifiedView = function dateModifiedView (title) {
        var created = this.dateView(title.CreatedOn);
        var updated = this.modifiedView(title.LastModified);
        if(!updated) { return React.createElement( 'span', null, created ) }

        var updateText = "" + updated;
        return  React.createElement( 'span', null, 
                    created, React.createElement( 'br', null ), "(", updated, ")" )
    };

    ForumTitle.prototype.createSummary = function createSummary () {
        var ref = this.props;
        var title = ref.title;
        if(!title.LatestComment) { return 'Ingen kommentarer'; }

        if(title.LatestComment.Deleted) { return 'Kommentar slettet'; }
        var text = title.LatestComment.Text;
        return getWords(text, 5);
    };

    ForumTitle.prototype.render = function render () {
        var ref = this.props;
        var title = ref.title;
        var getAuthor = ref.getAuthor;
        var onClick = ref.onClick;
        var name = getAuthor(title.AuthorID);
        var latestComment  = this.createSummary();
        var css = title.Sticky ? "thread thread-pinned" : "thread";
        var path = "/forum/post/" + (title.ID) + "/comments";

        return  React.createElement( reactRouter.Link, { to: path }, 
                    React.createElement( reactBootstrap.Row, { className: css }, 
                        React.createElement( reactBootstrap.Col, { lg: 1, className: "text-center" }, this.stickyIcon(title.Sticky)), 
                        React.createElement( reactBootstrap.Col, { lg: 5 }, 
                            React.createElement( 'h4', null, React.createElement( 'span', { className: "text-capitalize" }, title.Title) ), 
                            React.createElement( 'small', null, "Af: ", name )
                        ), 
                        React.createElement( reactBootstrap.Col, { lg: 2, className: "text-left" }, 
                            React.createElement( 'p', null, this.dateModifiedView(title) )
                        ), 
                        React.createElement( reactBootstrap.Col, { lg: 2, className: "text-center" }, 
                            React.createElement( 'p', null, title.ViewedBy.length )
                        ), 
                        React.createElement( reactBootstrap.Col, { lg: 2, className: "text-center" }, 
                            React.createElement( 'p', null, latestComment )
                        )
                    )
                )
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
    }
}

var mapDispatchToProps$5 = function (dispatch) {
    return {
        fetchThreads: function (skip, take) {
            dispatch(fetchThreads(skip, take));
        },
        postThread: function (cb, post) {
            dispatch(postThread(cb, post));
        },
        setSelectedThread: function (id) {
            dispatch(setSelectedThread(id));
        }
    }
}

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

        if(page == to) { return; }
        var skipItems = (to - 1) * take;
        fetchThreads(skipItems, take);
    };

    ForumListContainer.prototype.threadViews = function threadViews () {
        var ref = this.props;
        var threads = ref.threads;
        var getAuthor = ref.getAuthor;
        var setSelectedThread = ref.setSelectedThread;
        return threads.map(function (thread) {
            var id = "thread_" + (thread.ID);
            return React.createElement( ForumTitle, {
                        title: thread, key: id, getAuthor: getAuthor })
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
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.ButtonGroup, null, 
                        React.createElement( reactBootstrap.Button, { bsStyle: "primary", onClick: this.show.bind(this) }, "Tilføj nyt indlæg")
                    ), 
                    React.createElement( reactBootstrap.Col, { lg: 12 }, 
                        React.createElement( reactBootstrap.Row, { className: "thread-head" }, 
                            React.createElement( reactBootstrap.Col, { lg: 1 }, 
                                React.createElement( 'strong', null, "Info" )
                            ), 
                            React.createElement( reactBootstrap.Col, { lg: 5 }, 
                                React.createElement( 'strong', null, "Overskrift" )
                            ), 
                            React.createElement( reactBootstrap.Col, { lg: 2, className: "text-center" }, 
                                React.createElement( 'strong', null, "Dato" )
                            ), 
                            React.createElement( reactBootstrap.Col, { lg: 2, className: "text-center" }, 
                                React.createElement( 'strong', null, "Læst af" )
                            ), 
                            React.createElement( reactBootstrap.Col, { lg: 2, className: "text-center" }, 
                                React.createElement( 'strong', null, "Seneste kommentar" )
                            )
                        ), 
                        this.threadViews(), 
                        React.createElement( Pagination$1, { totalPages: totalPages, page: page, pageHandle: this.pageHandle, show: true })
                    ), 
                    React.createElement( ForumForm, {
                        show: this.state.newPost, close: this.close.bind(this), onSubmit: this.submit.bind(this) })
                )
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

        return  React.createElement( reactBootstrap.Media, null, 
                    React.createElement( reactBootstrap.Media.Left, { style: { minWidth: "74px" } }), 
                    React.createElement( reactBootstrap.Media.Body, null, 
                        React.createElement( 'p', { className: "text-muted comment-deleted" }, 
                            React.createElement( 'span', null, 
                                React.createElement( reactBootstrap.Glyphicon, { glyph: "remove-sign" }), " Kommentar slettet" )
                        ), 
                        replyNodes
                    )
                )
    };

    return CommentDeleted;
}(React.Component));

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
        if(!edited) { return null; }
        return  React.createElement( 'span', null, "*" )
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

        return  React.createElement( reactBootstrap.Media, null, 
                    React.createElement( CommentProfile, null ), 
                    React.createElement( reactBootstrap.Media.Body, null, 
                        React.createElement( 'h5', { className: "media-heading" }, 
                            React.createElement( 'strong', null, name ), " ", React.createElement( 'small', null, "sagde ", this.ago(), this.editedView(edited) ) 
                        ), 
                        React.createElement( 'span', { dangerouslySetInnerHTML: txt }), 
                        React.createElement( CommentControls, {
                            contextId: contextId, canEdit: canEdit, authorId: authorId, commentId: commentId, text: text, props: true }), 
                        replyNodes
                    )
                )
    };

    return Comment;
}(React.Component));

Comment.propTypes = {
    contextId: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    commentId: React.PropTypes.number.isRequired,
    replies: React.PropTypes.arrayOf(React.PropTypes.object),
    construct: React.PropTypes.func,
    authorId: React.PropTypes.number.isRequired,
    canEdit: React.PropTypes.func.isRequired,
    edited: React.PropTypes.bool.isRequired,

    skip: React.PropTypes.number,
    take: React.PropTypes.number,
    editComment: React.PropTypes.func.isRequired,
    deleteComment: React.PropTypes.func.isRequired, 
    replyComment: React.PropTypes.func.isRequired,
}

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

        if (!comments) { return; }

        return comments.map(function (comment) {
            var node = this$1.constructComment(comment);
            return  React.createElement( reactBootstrap.Media.ListItem, { key: "rootComment_" + comment.CommentID }, 
                        node
                    )
        });
    };

    CommentList.prototype.constructComment = function constructComment (comment) {
        var key = "commentId" + comment.CommentID;

        if (comment.Deleted)
            { return  React.createElement( CommentDeleted, {
                        key: key, construct: this.constructComment, replies: comment.Replies }) }

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
        var props = { skip: skip, take: take, editComment: editComment, deleteComment: deleteComment, replyComment: replyComment };
        var name = getName(comment.AuthorID);
        return  React.createElement( Comment, {
                    key: key, contextId: contextId, name: name, postedOn: comment.PostedOn, authorId: comment.AuthorID, text: comment.Text, construct: this.constructComment, replies: comment.Replies, edited: comment.Edited, canEdit: canEdit, commentId: comment.CommentID, props: true })
    };

    CommentList.prototype.render = function render () {
        var ref = this.props;
        var comments = ref.comments;
        var nodes = this.rootComments(comments);

        return  React.createElement( reactBootstrap.Media.List, null, 
                    nodes
                )
    };

    return CommentList;
}(React.Component));

CommentList.propTypes = {
    comments: React.PropTypes.arrayOf(React.PropTypes.object),
    contextId: React.PropTypes.number,
    getName: React.PropTypes.func,
    canEdit: React.PropTypes.func,
    skip: React.PropTypes.number,
    take: React.PropTypes.number,
    editComment: React.PropTypes.func.isRequired,
    deleteComment: React.PropTypes.func.isRequired, 
    replyComment: React.PropTypes.func.isRequired,
}

var CommentForm = (function (superclass) {
    function CommentForm(props) {
        superclass.call(this, props);
        this.state = {
            Text: ''
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
        this.setState({ Text: '' });
    };

    CommentForm.prototype.handleTextChange = function handleTextChange (e) {
        this.setState({ Text: e.target.value })
    };

    CommentForm.prototype.render = function render () {
        return  React.createElement( 'form', { onSubmit: this.postComment }, 
                    React.createElement( 'label', { htmlFor: "remark" }, "Kommentar"), 
                    React.createElement( 'textarea', { className: "form-control", onChange: this.handleTextChange, value: this.state.Text, placeholder: "Skriv kommentar her...", id: "remark", rows: "4" }), 
                    React.createElement( 'br', null ), 
                    React.createElement( 'button', { type: "submit", className: "btn btn-primary" }, "Send")
                )
    };

    return CommentForm;
}(React.Component));

CommentForm.propTypes = {
    postHandle: React.PropTypes.func.isRequired
}

var mapStateToProps$6 = function (state) {
    return {
        comments: state.commentsInfo.comments,
        getName: function (id) {
            var user = state.usersInfo.users[id];
            if(!user) { return ''; }
            return ((user.FirstName) + " " + (user.LastName));
        },
        canEdit: function (id) { return state.usersInfo.currentUserId == id; },
        postId: state.forumInfo.titlesInfo.selectedThread,
        page: state.commentsInfo.page,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        totalPages: state.commentsInfo.totalPages,
    }
}

var mapDispatchToProps$6 = function (dispatch) {
    return {
        editHandle: function (commentId, postId, text, cb) {
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
    }
}

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
        var skip = ref.skip;
        var take = ref.take;
        var ref$1 = nextProps.location.query;
        var page = ref$1.page;
        if(!Number(page)) { return; }
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
        if(page == to) { return; }
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
        }

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
        }

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
        }

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
        }

        postHandle(postId, text, cb);
    };

    ForumCommentsContainer.prototype.render = function render () {
        var ref = this.props;
        var comments = ref.comments;
        var getName = ref.getName;
        var canEdit = ref.canEdit;
        var totalPages = ref.totalPages;
        var page = ref.page;
        var ref$1 = this.props.params;
        var id = ref$1.id;
        var ref$2 = this.props;
        var skip = ref$2.skip;
        var take = ref$2.take;
        var props = { skip: skip, take: take };
        props = Object.assign({}, props, {
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        });
        return  React.createElement( reactBootstrap.Row, { className: "forum-comments-list" }, 
                    React.createElement( 'h4', { className: "forum-comments-heading" }, "Kommentarer"), 
                    React.createElement( CommentList, {
                        comments: comments, contextId: Number(id), getName: getName, canEdit: canEdit, props: true }), 
                    React.createElement( Pagination$1, {
                        totalPages: totalPages, page: page, pageHandle: this.pageHandle }), 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lg: 12 }, 
                            React.createElement( 'hr', null ), 
                            React.createElement( CommentForm, { postHandle: this.postComment }), 
                            React.createElement( 'br', null )
                        )
                    )
                )
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

        return  React.createElement( reactBootstrap.Col, { lg: 3 }, 
                    React.createElement( reactBootstrap.Panel, { header: (firstName + " " + lastName) }, 
                        React.createElement( UserItem, { title: "Brugernavn" }, username), 
                        React.createElement( UserItem, { title: "Email" }, React.createElement( 'a', { href: emailLink }, email)), 
                        React.createElement( UserItem, { title: "Billeder" }, React.createElement( reactRouter.Link, { to: gallery }, "Billeder"))
                    )
                )
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
        return  React.createElement( reactBootstrap.Col, { lg: 6 }, 
                    React.createElement( 'strong', null, this.props.children )
                )
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
        return  React.createElement( reactBootstrap.Col, { lg: 6 }, 
                    this.props.children
                )
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
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( UserHeading, null, title ), 
                    React.createElement( UserBody, null, this.props.children )
                )
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
            return  React.createElement( User, {
                          username: user.Username, userId: user.ID, firstName: user.FirstName, lastName: user.LastName, email: user.Email, profileUrl: user.ProfileImage, roles: user.Roles, key: userId })
        });
    };

    UserList.prototype.render = function render () {
        return  React.createElement( reactBootstrap.Row, null, 
                    this.userNodes()
                )
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
        return  React.createElement( 'ol', { className: "breadcrumb" }, 
                    this.props.children
                )
    };

    return Breadcrumb;
}(React.Component));

Breadcrumb.Item = (function (superclass) {
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
        if(active) { return   React.createElement( 'li', { className: "active" }, 
                                this.props.children
                            ) }

        return  React.createElement( 'li', null, 
                    React.createElement( reactRouter.Link, { to: href }, 
                        this.props.children
                    )
                )

    };

    return Item;
}(React.Component))

var mapUsersToProps = function (state) {
    return {
        users: underscore.values(state.usersInfo.users)
    };
}

var mapDispatchToProps$7 = function (dispatch) {
    return {
        getUsers: function () {
            dispatch(fetchUsers());
        }
    };
}

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
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                            React.createElement( Breadcrumb, null, 
                                React.createElement( Breadcrumb.Item, { href: "/" }, "Forside"), 
                                React.createElement( Breadcrumb.Item, { active: true }, "Brugere")
                            )
                        )
                    ), 
                    React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                        React.createElement( reactBootstrap.PageHeader, null, "Inuplan's ", React.createElement( 'small', null, "brugere" )
                        ), 
                        React.createElement( reactBootstrap.Row, null, 
                            React.createElement( UserList, { users: users })
                        )
                    )
                )
    };

    return UsersContainer;
}(React.Component));

var Users = reactRedux.connect(mapUsersToProps, mapDispatchToProps$7)(UsersContainer)

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
        if(add) {
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
        var style = count == 0 ? "col-lg-6 text-muted" : "col-lg-6 text-primary";
        var props = {
            className: style
        };

        return  React.createElement( 'div', props, 
                    React.createElement( 'span', { className: "glyphicon glyphicon-comment", 'aria-hidden': "true" }), " ", count
                )
    };

    Image.prototype.checkboxView = function checkboxView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var imageIsSelected = ref.imageIsSelected;
        var image = ref.image;
        var checked = imageIsSelected(image.ImageID);
        return (canEdit ?
            React.createElement( reactBootstrap.Col, { lg: 6, className: "pull-right text-right" }, 
                React.createElement( 'label', null, "Slet ", React.createElement( 'input', { type: "checkbox", onClick: this.checkboxHandler, checked: checked })
                )
            )
            : null);
    };

Image.prototype.render = function render () {
    var ref = this.props;
    var image = ref.image;
    var username = ref.username;
    var count = image.CommentCount;
    var url = "/" + username + "/gallery/image/" + (image.ImageID) + "/comments";
    return  React.createElement( 'div', null, 
                React.createElement( reactRouter.Link, { to: url }, 
                    React.createElement( reactBootstrap.Image, { src: image.PreviewUrl, thumbnail: true })
                ), 
                React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactRouter.Link, { to: url }, 
                        this.commentIcon(count)
                    ), 
                    this.checkboxView()
                )
            )
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
            if(last) {
                var row = images.slice(start);
                result.push(row);
            } else {
                var row$1 = images.slice(start, end);
                result.push(row$1);
            }
        }

        return result;
    };

    ImageList.prototype.imagesView = function imagesView (images) {
        if(images.length == 0) { return null; }
        var ref = this.props;
        var addSelectedImageId = ref.addSelectedImageId;
        var removeSelectedImageId = ref.removeSelectedImageId;
        var deleteSelectedImages = ref.deleteSelectedImages;
        var canEdit = ref.canEdit;
        var imageIsSelected = ref.imageIsSelected;
        var username = ref.username;
        var result = this.arrangeArray(images);
        var view = result.map(function (row, i) {
            var imgs = row.map(function (img) {
                return  React.createElement( reactBootstrap.Col, { lg: 3, key: img.ImageID }, 
                            React.createElement( Image$1, {
                                image: img, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: imageIsSelected, username: username })
                        )
            });

            var rowId = "rowId" + i;
            return  React.createElement( reactBootstrap.Row, { key: rowId }, 
                        imgs
                    )
        });

        return view;
    };


    ImageList.prototype.render = function render () {
        var ref = this.props;
        var images = ref.images;
        return  React.createElement( reactBootstrap.Row, null, 
                    this.imagesView(images)
                )
    };

    return ImageList;
}(React.Component));

var mapStateToProps$7 = function (state) {
    var ref = state.imagesInfo;
    var ownerId = ref.ownerId;
    var currentId = state.usersInfo.currentUserId;
    var canEdit = (ownerId > 0 && currentId > 0 && ownerId == currentId);
    var user = state.usersInfo.users[ownerId];
    var fullName = user ? ((user.FirstName) + " " + (user.LastName)) : '';
    var images = underscore.sortBy(underscore.values(state.imagesInfo.images), function (img) { return -img.ImageID; });

    return {
        images: images,
        canEdit: canEdit,
        selectedImageIds: state.imagesInfo.selectedImageIds,
        fullName: fullName,
    }
}

var mapDispatchToProps$8 = function (dispatch) {
    return {
        uploadImage: function (username, formData) {
            dispatch(uploadImage(username, formData, function () { dispatch(fetchUserImages(username)); }, function () { }));
        },
        addSelectedImageId: function (id) {
            // Images to be deleted by selection:
            dispatch(addSelectedImageId(id));
        },
        removeSelectedImageId: function (id) {
            // Images to be deleted by selection:
            dispatch(removeSelectedImageId(id));
        },
        deleteImages: function (username, ids) {
            dispatch(deleteImages(username, ids));
        },
        clearSelectedImageIds: function () {
            dispatch(clearSelectedImageIds());
        }
    }
}

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
            return id == checkId;
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

        if(!canEdit) { return null; }

        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, { lg: 4 }, 
                        React.createElement( ImageUpload, {
                            uploadImage: uploadImage, username: username }, 
                                '\u00A0', 
                                React.createElement( reactBootstrap.Button, { bsStyle: "danger", disabled: !hasImages, onClick: this.deleteSelectedImages }, "Slet markeret billeder")
                        )
                    )
                )
    };

    UserImagesContainer.prototype.uploadLimitView = function uploadLimitView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var uploadImage = ref.uploadImage;
        var selectedImageIds = ref.selectedImageIds;
        if(!canEdit) { return null; }
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 2 }, 
                        React.createElement( 'br', null ), 
                        React.createElement( UsedSpace, null )
                    )
                )
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

        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                            React.createElement( Breadcrumb, null, 
                                React.createElement( Breadcrumb.Item, { href: "/" }, "Forside"), 
                                React.createElement( Breadcrumb.Item, { active: true }, 
                                    username, "'s billeder")
                            )
                        )
                    ), 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                            React.createElement( 'h1', null, React.createElement( 'span', { className: "text-capitalize" }, fullName), "'s ", React.createElement( 'small', null, "billede galleri" ) ), 
                            React.createElement( 'hr', null ), 
                            React.createElement( ImageList, {
                                images: images, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: this.imageIsSelected, username: username }), 
                            this.uploadView()
                        )
                    ), 
                    this.uploadLimitView(), 
                    this.props.children
                )
    };

    return UserImagesContainer;
}(React.Component));

var UserImagesRedux = reactRedux.connect(mapStateToProps$7, mapDispatchToProps$8)(UserImagesContainer);
var UserImages = reactRouter.withRouter(UserImagesRedux);

var mapStateToProps$8 = function (state) {
    var ownerId  = state.imagesInfo.ownerId;
    var currentId = state.usersInfo.currentUserId;
    var canEdit = (ownerId > 0 && currentId > 0 && ownerId == currentId);

    var getImage = function (id) {
        return underscore.find(state.imagesInfo.images, function (image) {
            return image.ImageID == id;
        });
    };

    var image = function () { return getImage(state.imagesInfo.selectedImageId); };
    var filename = function () { if(image()) { return image().Filename; } return ''; };
    var previewUrl = function () { if(image()) { return image().PreviewUrl; } return ''; };
    var extension = function () { if(image()) { return image().Extension; } return ''; };
    var originalUrl = function () { if(image()) { return image().OriginalUrl; } return ''; };
    var uploaded = function () { if(image()) { return image().Uploaded; } return new Date(); };

    return {
        canEdit: canEdit,
        hasImage: function () { return Boolean(getImage(state.imagesInfo.selectedImageId)); },
        filename: filename(),
        previewUrl: previewUrl(),
        extension: extension(),
        originalUrl: originalUrl(),
        uploaded: uploaded()
    }
}

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
    }
}

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

        deleteImage(id, username);
        setSelectedImageId(-1);
    };

    ModalImage.prototype.deleteImageView = function deleteImageView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        if(!canEdit) { return null; }
        return React.createElement( reactBootstrap.Button, { bsStyle: "danger", onClick: this.deleteImageHandler }, "Slet billede");
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
        if(!show) { return null; }

        return  React.createElement( 'p', { className: "text-center" }, 
                    React.createElement( reactBootstrap.Button, { onClick: this.reload }, 
                        React.createElement( reactBootstrap.Glyphicon, { glyph: "refresh" }), " Se alle kommentarer?")
                )
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

        return  React.createElement( reactBootstrap.Modal, { show: show, onHide: this.close, bsSize: "large", animation: true }, 
                    React.createElement( reactBootstrap.Modal.Header, { closeButton: true }, 
                        React.createElement( reactBootstrap.Modal.Title, null, name, React.createElement( 'span', null, React.createElement( 'small', null, " - ", dateString ) ) )
                    ), 

                    React.createElement( reactBootstrap.Modal.Body, null, 
                        React.createElement( 'a', { href: originalUrl, target: "_blank", rel: "noopener" }, 
                            React.createElement( reactBootstrap.Image, { src: previewUrl, responsive: true, className: "center-block" })
                        )
                    ), 

                    React.createElement( reactBootstrap.Modal.Footer, null, 
                        this.seeAllCommentsView(), 
                        this.props.children, 
                        React.createElement( 'hr', null ), 
                        React.createElement( reactBootstrap.ButtonToolbar, { style: {float: "right"} }, 
                            this.deleteImageView(), 
                            React.createElement( reactBootstrap.Button, { onClick: this.close }, "Luk")
                        )
                    )
                )
    };

    return ModalImage;
}(React.Component));

var SelectedImageRedux = reactRedux.connect(mapStateToProps$8, mapDispatchToProps$9)(ModalImage);
var SelectedImage = reactRouter.withRouter(SelectedImageRedux);

var mapStateToProps$9 = function (state) {
    return {
        canEdit: function (id) { return state.usersInfo.currentUserId == id; },
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
    }
}

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
        editHandle: function (commentId, imageId, text, cb) {
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
    }
}

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
        var skip = ref.skip;
        var take = ref.take;
        var ref$1 = nextProps.location.query;
        var page = ref$1.page;
        if(!Number(page)) { return; }
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
        if(page == to) { return; }
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
        }

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
        }

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
        }

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
        var props = { skip: skip, take: take };
        props = Object.assign({}, props, {
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        });


        return  React.createElement( 'div', { className: "text-left" }, 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 1, lg: 11 }, 
                            React.createElement( CommentList, {
                                contextId: imageId, comments: comments, getName: getName, canEdit: canEdit, props: true })
                        )
                    ), 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 1, lg: 10 }, 
                            React.createElement( Pagination$1, {
                                totalPages: totalPages, page: page, pageHandle: this.pageHandle })
                        )
                    ), 
                    React.createElement( 'hr', null ), 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 1, lg: 10 }, 
                            React.createElement( CommentForm, { postHandle: this.postComment })
                        )
                    )
                )
    };

    return CommentsContainer;
}(React.Component));

var CommentsRedux = reactRedux.connect(mapStateToProps$9, mapDispatchToProps$10)(CommentsContainer);
var ImageComments = reactRouter.withRouter(CommentsRedux);

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
        canEdit: function (id) { return state.usersInfo.currentUserId == id; },
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
    }
}

var mapDispatchToProps$11 = function (dispatch) {
    return {
        editHandle: function (commentId, imageId, text, cb) {
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
    }
}

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

    SingleCommentRedux.prototype.deleteComment = function deleteComment$1 (commentId, contextId) {
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
        if(focusedId < 0) { return null; }

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
        var props = { skip: skip, take: take };
        props = Object.assign({}, props, {
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        });

        var name = this.props.getName(AuthorID);

        return  React.createElement( 'div', { className: "text-left" }, 
                    React.createElement( reactBootstrap.Well, null, 
                        React.createElement( Comment, {
                            contextId: imageId, name: name, text: Text, commentId: CommentID, replies: [], canEdit: canEdit, authorId: AuthorID, postedOn: PostedOn, edited: Edited, props: true })
                    ), 
                    React.createElement( 'div', null, 
                        React.createElement( 'p', { className: "text-center" }, 
                            React.createElement( reactBootstrap.Button, { onClick: this.allComments }, 
                                React.createElement( reactBootstrap.Glyphicon, { glyph: "refresh" }), " Se alle kommentarer?")
                        )
                    )
                )
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
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                            React.createElement( Breadcrumb, null, 
                                React.createElement( Breadcrumb.Item, { href: "/" }, "Forside"), 
                                React.createElement( Breadcrumb.Item, { active: true }, "Om")
                            )
                        )
                    ), 
                    React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                        React.createElement( 'p', null, "Dette er en single page application! ", React.createElement( 'br', null ), "Teknologier brugt:" ), 
                        React.createElement( 'ul', null, 
                            React.createElement( 'li', null, "React" ), 
                            React.createElement( 'li', null, "Redux" ), 
                            React.createElement( 'li', null, "React-Bootstrap" ), 
                            React.createElement( 'li', null, "ReactRouter" ), 
                            React.createElement( 'li', null, "Asp.net Core RC 2" ), 
                            React.createElement( 'li', null, "Asp.net Web API 2" )
                        )
                    )
                )
    };

    return About;
}(React.Component));

var users = function (state, action) {
    if ( state === void 0 ) state = {};

    switch (action.type) {
        case ADD_USER:
            var users = put(state, action.user.ID, action.user);
            return users;
        case RECIEVED_USERS:
            return action.users;
        default:
            return state;
    }
}

var currentUserId = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case SET_CURRENT_USER_ID:
            return action.id || -1;
        default:
            return state;
    }
}

var usersInfo = redux.combineReducers({
    currentUserId: currentUserId,
    users: users
})

var ownerId = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case SET_IMAGES_OWNER:
            return action.id || -1;
        default:
            return state;
    }
}

var images = function (state, action) {
    if ( state === void 0 ) state = {};

    switch (action.type) {
        case ADD_IMAGE:
            var obj = put(state, action.key, action.val);
            return obj;
        case RECIEVED_USER_IMAGES:
            return action.images;
        case REMOVE_IMAGE:
            var removed = underscore.omit(state, action.key);
            return removed;
        case INCR_IMG_COMMENT_COUNT:
            return underscore.values(state).map(function (img) {
                if(img.ImageID == action.key) {
                    img.CommentCount++;
                }
                return img;
            });
        case DECR_IMG_COMMENT_COUNT:
            return underscore.values(state).map(function (img) {
                if(img.ImageID == action.key) {
                    img.CommentCount--;
                }
                return img;
            });
        default:
            return state;
    }
}

var selectedImageId = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case SET_SELECTED_IMG:
            return action.id || -1;
        default:
            return state;
    }
}

var selectedImageIds = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case ADD_SELECTED_IMAGE_ID:
            return union(state, [action.id], function (id1, id2) { return id1 == id2; });
        case REMOVE_SELECTED_IMAGE_ID:
            return underscore.filter(state, function (id) { return id != action.id; });
        case CLEAR_SELECTED_IMAGE_IDS:
            return [];
        default:
            return state;
    }
}

var imagesInfo = redux.combineReducers({
    ownerId: ownerId,
    images: images,
    selectedImageId: selectedImageId,
    selectedImageIds: selectedImageIds
})

var comments = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case RECIEVED_COMMENTS:
            return action.comments || [];
        case ADD_COMMENT:
            return state.concat( [action.comment]);
        default:
            return state;
    }
}

var skip = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_SKIP_COMMENTS:
            return action.skip || 0;
        default:
            return state;
    }
}

var take = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case SET_TAKE_COMMENTS:
            return action.take || 10;
        default:
            return state;
    }
}

var page = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_CURRENT_PAGE:
            return action.page || 1;
        default:
            return state;
    }
}

var totalPages = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_TOTAL_PAGES:
            return action.totalPages || 0;
        default:
            return state;
    }
}

var focusedComment = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case SET_FOCUSED_COMMENT:
            return action.id || -1;
        default:
            return state;
    }
}

var commentsInfo = redux.combineReducers({
    comments: comments,
    skip: skip,
    take: take,
    page: page,
    totalPages: totalPages,
    focusedComment: focusedComment
})

var title = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        case SET_ERROR_TITLE:
            return action.title || "";
        default:
            return state;
    }
}

var message$1 = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        case SET_ERROR_MESSAGE:
            return action.message || "";
        default:
            return state;
    }
}

var errorInfo = redux.combineReducers({
    title: title,
    message: message$1
});

var hasError = function (state, action) {
    if ( state === void 0 ) state = false;

    switch (action.type) {
        case SET_HAS_ERROR:
            return action.hasError;
        default:
            return state;
    }
}

var message = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        default:
            return state;
    }
}

var done = function (state, action) {
    if ( state === void 0 ) state = true;

    switch (action.type) {
        default:
            return state;
    }
}

var usedSpacekB = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch(action.type) {
        case SET_USED_SPACE_KB:
            return action.usedSpace;
        default:
            return state;
    }
}

var totalSpacekB = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch(action.type) {
        case SET_TOTAL_SPACE_KB:
            return action.totalSpace;
        default:
            return state;
    }
}

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
})

var skip$1 = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_SKIP_WHATS_NEW:
            return action.skip || 0;
        default:
            return state;
    }
}

var take$1 = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case SET_TAKE_WHATS_NEW:
            return action.take || 10;
        default:
            return state;
    }
}

var page$1 = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_PAGE_WHATS_NEW:
            return action.page || 1;
        default:
            return state;
    }
}

var totalPages$1 = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_TOTAL_PAGES_WHATS_NEW:
            return action.totalPages || 0;
        default:
            return state;
    }
}

var items = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case SET_LATEST:
            return action.latest || [];
        default:
            return state;
    }
}

var whatsNewInfo = redux.combineReducers({
    skip: skip$1,
    take: take$1,
    page: page$1,
    totalPages: totalPages$1,
    items: items
})

var skipThreads = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_SKIP_THREADS:
            return action.skip;
        default:
            return state;
    }
}

var takeThreads = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case SET_TAKE_THREADS:
            return action.take;
        default:
            return state;
    }
}

var pageThreads = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_PAGE_THREADS:
            return action.page;
        default:
            return state;
    }
}

var totalPagesThread = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_TOTAL_PAGES_THREADS:
            return action.totalPages;
        default:
            return state;
    }
}

var selectedThread = function (state, action) {
    if ( state === void 0 ) state = -1;

    switch (action.type) {
        case SET_SELECTEDTHREAD_ID:
            return action.id;
        default:
            return state;
    }
}

var titles = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case ADD_THREAD_TITLE:
            return union([action.title], state, function (t1, t2) { return t1.ID == t2.ID; });
        case SET_THREAD_TITLES:
            return action.titles;
        case UPDATE_THREAD_TITLE:
            var removed = underscore.filter(state, function (title) { return title.ID != action.id; });
            return removed.concat( [action.title]);
        default:
            return state;
    }
}

var postContent = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        case SET_POST_CONTENT:
            return action.content;
        default:
            return state;
    }
}

var titlesInfo = redux.combineReducers({
    titles: titles,
    skip: skipThreads,
    take: takeThreads,
    page: pageThreads,
    totalPages: totalPagesThread,
    selectedThread: selectedThread
})

var forumInfo = redux.combineReducers({
    titlesInfo: titlesInfo,
    postContent: postContent
})

var rootReducer = redux.combineReducers({
    usersInfo: usersInfo,
    imagesInfo: imagesInfo,
    commentsInfo: commentsInfo,
    statusInfo: statusInfo,
    whatsNewInfo: whatsNewInfo,
    forumInfo: forumInfo
})

var store = redux.createStore(rootReducer, redux.applyMiddleware(thunk))

var init = function () {
    es6ObjectAssign.polyfill();
    es6Promise.polyfill();
    store.dispatch(fetchCurrentUser(globals.currentUsername));
    store.dispatch(fetchUsers());
    moment.locale('da');

    connectToLatestWebSocketService();
}

var connectToLatestWebSocketService = function () {
    var supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;

    // Webserver does not support websockets
    if (false) {}
    else {
        // do long-poll every 10 seconds
        setInterval(function () {
            var ref = store.getState().whatsNewInfo;
            var skip = ref.skip;
            var take = ref.take;
            var skipPost = store.getState().forumInfo.titlesInfo.skip;
            var takePost = store.getState().forumInfo.titlesInfo.take;

            store.dispatch(fetchUsers());
            store.dispatch(fetchLatestNews(skip, take));
            store.dispatch(fetchThreads(skipPost, takePost));
            store.dispatch(fetchSpaceInfo(((globals.urls.diagnostics) + "/getspaceinfo")));
        }, 10000);
    }
}

var selectImage = function (nextState) {
    var imageId = Number(nextState.params.id);
    store.dispatch(setSelectedImg(imageId));
}

var fetchImages = function (nextState) {
    var username = nextState.params.username;
    store.dispatch(setImageOwner(username));
    store.dispatch(fetchUserImages(username));

    // reset comment state
    store.dispatch(setSkipComments(undefined));
    store.dispatch(setTakeComments(undefined));
}

var loadComments = function (nextState) {
    var ref = nextState.params;
    var username = ref.username;
    var id = ref.id;
    var page = Number(nextState.location.query.page);
    var ref$1 = store.getState().commentsInfo;
    var skip = ref$1.skip;
    var take = ref$1.take;

    var url = getImageCommentsPageUrl(id, skip, take);
    if(!page) {
        store.dispatch(fetchComments(url, skip, take));
    }
    else {
        var skipPages = page - 1;
        var skipItems = (skipPages * take);
        store.dispatch(fetchComments(url, skipItems, take));
    }
}

var fetchComment = function (nextState) {
    var id = Number(nextState.location.query.id);
    store.dispatch(fetchAndFocusSingleComment(id));
}

var fetchWhatsNew = function (nextState) {
    var getLatest = function (skip, take) { return store.dispatch(fetchLatestNews(skip, take)); };
    var ref = store.getState().whatsNewInfo;
    var skip = ref.skip;
    var take = ref.take;
    getLatest(skip, take);
}

var fetchForum = function (nextState) {
    var ref = store.getState().forumInfo.titlesInfo;
    var skip = ref.skip;
    var take = ref.take;
    store.dispatch(fetchThreads(skip, take));
}

var fetchSinglePost = function (nextState) {
    var ref = nextState.params;
    var id = ref.id;
    store.dispatch(fetchPost(Number(id)));
}

var fetchPostComments = function (nextState) {
    var ref = nextState.params;
    var id = ref.id;
    var ref$1 = store.getState().commentsInfo;
    var skip = ref$1.skip;
    var take = ref$1.take;

    var url = getForumCommentsPageUrl(id, skip, take);
    store.dispatch(fetchComments(url, skip, take));
}

init();

ReactDOM.render(
    React.createElement( reactRedux.Provider, { store: store }, 
        React.createElement( reactRouter.Router, { history: reactRouter.browserHistory }, 
            React.createElement( reactRouter.Route, { path: "/", component: Main }, 
                React.createElement( reactRouter.IndexRoute, { component: Home, onEnter: fetchWhatsNew }), 
                React.createElement( reactRouter.Route, { path: "forum", component: Forum }, 
                    React.createElement( reactRouter.IndexRoute, { component: ForumList, onEnter: fetchForum }), 
                    React.createElement( reactRouter.Route, { path: "post/:id", component: ForumPost, onEnter: fetchSinglePost }, 
                        React.createElement( reactRouter.Route, { path: "comments", component: ForumComments, onEnter: fetchPostComments })
                    )
                ), 
                React.createElement( reactRouter.Route, { path: "users", component: Users }), 
                React.createElement( reactRouter.Route, { path: ":username/gallery", component: UserImages, onEnter: fetchImages }, 
                    React.createElement( reactRouter.Route, { path: "image/:id", component: SelectedImage, onEnter: selectImage }, 
                        React.createElement( reactRouter.Route, { path: "comments", component: ImageComments, onEnter: loadComments }), 
                        React.createElement( reactRouter.Route, { path: "comment", component: SingleImageComment, onEnter: fetchComment })
                    )
                ), 
                React.createElement( reactRouter.Route, { path: "about", component: About })
            )
        )
    ),
    document.getElementById('content'));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvd3JhcHBlcnMvTGlua3MuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRXJyb3IuanMiLCJjb25zdGFudHMvdHlwZXMuanMiLCJhY3Rpb25zL2Vycm9yLmpzIiwiY29tcG9uZW50cy9zaGVsbHMvTWFpbi5qcyIsImNvbnN0YW50cy9jb25zdGFudHMuanMiLCJ1dGlsaXRpZXMvdXRpbHMuanMiLCJhY3Rpb25zL3VzZXJzLmpzIiwiYWN0aW9ucy93aGF0c25ldy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCJjb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3VG9vbHRpcC5qcyIsImNvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdJdGVtSW1hZ2UuanMiLCJjb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCJjb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3Rm9ydW1Qb3N0LmpzIiwiY29tcG9uZW50cy93aGF0c25ldy9XaGF0c05ld0xpc3QuanMiLCJjb21wb25lbnRzL2ZvcnVtL0ZvcnVtRm9ybS5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudENvbnRyb2xzLmpzIiwiYWN0aW9ucy9mb3J1bS5qcyIsImFjdGlvbnMvY29tbWVudHMuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Qb3N0LmpzIiwiY29tcG9uZW50cy9wYWdpbmF0aW9uL1BhZ2luYXRpb24uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvV2hhdHNOZXcuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZVVwbG9hZC5qcyIsImFjdGlvbnMvaW1hZ2VzLmpzIiwiYWN0aW9ucy9zdGF0dXMuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlZFNwYWNlLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL0hvbWUuanMiLCJjb21wb25lbnRzL3NoZWxscy9Gb3J1bS5qcyIsImNvbXBvbmVudHMvZm9ydW0vRm9ydW1UaXRsZS5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bUxpc3QuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnREZWxldGVkLmpzIiwiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50LmpzIiwiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50TGlzdC5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudEZvcm0uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Db21tZW50cy5qcyIsImNvbXBvbmVudHMvdXNlcnMvVXNlci5qcyIsImNvbXBvbmVudHMvdXNlcnMvVXNlckxpc3QuanMiLCJjb21wb25lbnRzL2JyZWFkY3J1bWJzL0JyZWFkY3J1bWIuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlcnMuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvSW1hZ2VDb21tZW50cy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9TaW5nbGVJbWFnZUNvbW1lbnQuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJyZWR1Y2Vycy91c2Vycy5qcyIsInJlZHVjZXJzL2ltYWdlcy5qcyIsInJlZHVjZXJzL2NvbW1lbnRzLmpzIiwicmVkdWNlcnMvZXJyb3IuanMiLCJyZWR1Y2Vycy9zdGF0dXMuanMiLCJyZWR1Y2Vycy93aGF0c25ldy5qcyIsInJlZHVjZXJzL2ZvcnVtLmpzIiwicmVkdWNlcnMvcm9vdC5qcyIsInN0b3Jlcy9zdG9yZS5qcyIsInV0aWxpdGllcy9vbnN0YXJ0dXAuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/aW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgTmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPXt0aGlzLnByb3BzLnRvfT5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuXHJcbk5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmRleE5hdkxpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IHRoaXMuY29udGV4dC5yb3V0ZXIuaXNBY3RpdmUodGhpcy5wcm9wcy50bywgdHJ1ZSksXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XHJcbiAgICAgICAgICAgICAgICA8SW5kZXhMaW5rIHRvPXt0aGlzLnByb3BzLnRvfT5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvSW5kZXhMaW5rPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuSW5kZXhOYXZMaW5rLmNvbnRleHRUeXBlcyA9IHtcclxuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUm93LCBDb2wsIEFsZXJ0IH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNsZWFyRXJyb3IsIHRpdGxlLCBtZXNzYWdlICB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QWxlcnQgYnNTdHlsZT1cImRhbmdlclwiIG9uRGlzbWlzcz17Y2xlYXJFcnJvcn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPnt0aXRsZX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnttZXNzYWdlfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9BbGVydD5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59Iiwi77u/Ly8gSW1hZ2UgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX0lNRyA9ICdTRVRfU0VMRUNURURfSU1HJztcclxuZXhwb3J0IGNvbnN0IFVOU0VUX1NFTEVDVEVEX0lNRyA9ICdVTlNFVF9TRUxFQ1RFRF9JTUcnO1xyXG5leHBvcnQgY29uc3QgQUREX0lNQUdFID0gJ0FERF9JTUFHRSc7XHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfSU1BR0UgPSAnUkVNT1ZFX0lNQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9JTUFHRVNfT1dORVIgPSAnU0VUX0lNQUdFU19PV05FUic7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9VU0VSX0lNQUdFUyA9ICdSRUNJRVZFRF9VU0VSX0lNQUdFUyc7XHJcbmV4cG9ydCBjb25zdCBBRERfU0VMRUNURURfSU1BR0VfSUQgPSAnQUREX1NFTEVDVEVEX0lNQUdFX0lEJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCA9ICdSRU1PVkVfU0VMRUNURURfSU1BR0VfSUQnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTID0gJ0NMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyc7XHJcbmV4cG9ydCBjb25zdCBJTkNSX0lNR19DT01NRU5UX0NPVU5UID0gJ0lOQ1JfSU1HX0NPTU1FTlRfQ09VTlQnO1xyXG5leHBvcnQgY29uc3QgREVDUl9JTUdfQ09NTUVOVF9DT1VOVCA9ICdERUNSX0lNR19DT01NRU5UX0NPVU5UJztcclxuXHJcbi8vIFVzZXIgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX0NVUlJFTlRfVVNFUl9JRCA9ICdTRVRfQ1VSUkVOVF9VU0VSX0lEJztcclxuZXhwb3J0IGNvbnN0IEFERF9VU0VSID0gJ0FERF9VU0VSJztcclxuZXhwb3J0IGNvbnN0IEVSUk9SX0ZFVENISU5HX0NVUlJFTlRfVVNFUiA9ICdFUlJPUl9GRVRDSElOR19DVVJSRU5UX1VTRVInO1xyXG5leHBvcnQgY29uc3QgUkVDSUVWRURfVVNFUlMgPSAnUkVDSUVWRURfVVNFUlMnO1xyXG5cclxuLy8gQ29tbWVudCBhY3Rpb25zXHJcbmV4cG9ydCBjb25zdCBBRERfQ09NTUVOVCA9ICdBRERfQ09NTUVOVCc7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9DT01NRU5UUyA9ICdSRUNJRVZFRF9DT01NRU5UUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfQ1VSUkVOVF9QQUdFID0gJ1NFVF9DVVJSRU5UX1BBR0UnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RPVEFMX1BBR0VTID0gJ1NFVF9UT1RBTF9QQUdFUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0tJUF9DT01NRU5UUyA9ICdTRVRfU0tJUF9DT01NRU5UUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfVEFLRV9DT01NRU5UUyA9ICdTRVRfVEFLRV9DT01NRU5UUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfREVGQVVMVF9TS0lQID0gJ1NFVF9ERUZBVUxUX1NLSVAnO1xyXG5leHBvcnQgY29uc3QgU0VUX0RFRkFVTFRfVEFLRSA9ICdTRVRfREVGQVVMVF9UQUtFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9ERUZBVUxUX0NPTU1FTlRTID0gJ1NFVF9ERUZBVUxUX0NPTU1FTlRTJztcclxuZXhwb3J0IGNvbnN0IFNFVF9GT0NVU0VEX0NPTU1FTlQgPSAnU0VUX0ZPQ1VTRURfQ09NTUVOVCc7XHJcblxyXG4vLyBXaGF0c05ld1xyXG5leHBvcnQgY29uc3QgU0VUX0xBVEVTVCA9ICdTRVRfTEFURVNUJztcclxuZXhwb3J0IGNvbnN0IFNFVF9TS0lQX1dIQVRTX05FVyA9ICdTRVRfU0tJUF9XSEFUU19ORVcnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RBS0VfV0hBVFNfTkVXID0gJ1NFVF9UQUtFX1dIQVRTX05FVyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfUEFHRV9XSEFUU19ORVcgPSAnU0VUX1BBR0VfV0hBVFNfTkVXJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UT1RBTF9QQUdFU19XSEFUU19ORVcgPSAnU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVyc7XHJcblxyXG4vLyBFcnJvciBhY3Rpb25zXHJcbmV4cG9ydCBjb25zdCBTRVRfRVJST1JfVElUTEUgPSAnU0VUX0VSUk9SX1RJVExFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9FUlJPUl9NRVNTQUdFID0gJ1NFVF9FUlJPUl9NRVNTQUdFJ1xyXG5leHBvcnQgY29uc3QgU0VUX0hBU19FUlJPUiA9ICdTRVRfSEFTX0VSUk9SJztcclxuZXhwb3J0IGNvbnN0IENMRUFSX0VSUk9SX1RJVExFID0gJ0NMRUFSX0VSUk9SX1RJVExFJztcclxuZXhwb3J0IGNvbnN0IENMRUFSX0VSUk9SX01FU1NBR0UgPSAnQ0xFQVJfRVJST1JfTUVTU0FHRSc7XHJcblxyXG4vLyBGb3J1bVxyXG5leHBvcnQgY29uc3QgU0VUX1BPU1RfQ09NTUVOVFMgPSAnU0VUX1BPU1RfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RIUkVBRF9USVRMRVMgPSAnU0VUX1RIUkVBRF9USVRMRVMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RPVEFMX1BBR0VTX1RIUkVBRFMgPSAnU0VUX1RPVEFMX1BBR0VTX1RIUkVBRFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1BBR0VfVEhSRUFEUyA9ICdTRVRfUEFHRV9USFJFQURTJztcclxuZXhwb3J0IGNvbnN0IFNFVF9TS0lQX1RIUkVBRFMgPSAnU0VUX1NLSVBfVEhSRUFEJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UQUtFX1RIUkVBRFMgPSAnU0VUX1RBS0VfVEhSRUFEUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0VMRUNURURUSFJFQURfSUQgPSAnU0VUX1NFTEVDVEVEVEhSRUFEX0lEJztcclxuZXhwb3J0IGNvbnN0IFNFVF9QT1NUX0NPTlRFTlQgPSAnU0VUX1BPU1RfQ09OVEVOVCc7XHJcbmV4cG9ydCBjb25zdCBBRERfVEhSRUFEX1RJVExFID0gJ0FERF9USFJFQURfVElUTEUnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX1BPU1RfSUQgPSAnU0VUX1NFTEVDVEVEX1BPU1RfSUQnO1xyXG5leHBvcnQgY29uc3QgVVBEQVRFX1RIUkVBRF9USVRMRSA9ICdVUERBVEVfVEhSRUFEX1RJVExFJztcclxuXHJcbi8vIFN0YXR1c0luZm9cclxuZXhwb3J0IGNvbnN0IFNFVF9VU0VEX1NQQUNFX0tCID0gJ1NFVF9VU0VEX1NQQUNFX0tCJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UT1RBTF9TUEFDRV9LQiA9ICdTRVRfVE9UQUxfU1BBQ0VfS0InO1xyXG4iLCLvu79pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvclRpdGxlID0gKHRpdGxlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0VSUk9SX1RJVExFLFxyXG4gICAgICAgIHRpdGxlOiB0aXRsZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvclRpdGxlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkNMRUFSX0VSUk9SX1RJVExFXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvck1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9FUlJPUl9NRVNTQUdFLFxyXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3JNZXNzYWdlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkNMRUFSX0VSUk9SX01FU1NBR0VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3IgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvclRpdGxlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKGNsZWFyRXJyb3JNZXNzYWdlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKGZhbHNlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0SGFzRXJyb3IgPSAoaGFzRXJyb3IpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfSEFTX0VSUk9SLFxyXG4gICAgICAgIGhhc0Vycm9yOiBoYXNFcnJvclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0RXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChzZXRIYXNFcnJvcih0cnVlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JUaXRsZShlcnJvci50aXRsZSkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEVycm9yTWVzc2FnZShlcnJvci5tZXNzYWdlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHRpdGxlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmssIEluZGV4TGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgTmF2TGluaywgSW5kZXhOYXZMaW5rIH0gZnJvbSAnLi4vd3JhcHBlcnMvTGlua3MnXHJcbmltcG9ydCB7IEVycm9yIH0gZnJvbSAnLi4vY29udGFpbmVycy9FcnJvcidcclxuaW1wb3J0IHsgY2xlYXJFcnJvciB9IGZyb20gJy4uLy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgR3JpZCwgTmF2YmFyLCBOYXYsIE5hdkRyb3Bkb3duLCBNZW51SXRlbSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuaW1wb3J0IHsgdmFsdWVzIH0gZnJvbSAndW5kZXJzY29yZSdcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgdXNlciA9IHZhbHVlcyhzdGF0ZS51c2Vyc0luZm8udXNlcnMpLmZpbHRlcih1ID0+IHUuVXNlcm5hbWUudG9VcHBlckNhc2UoKSA9PSBnbG9iYWxzLmN1cnJlbnRVc2VybmFtZS50b1VwcGVyQ2FzZSgpKVswXTtcclxuICAgIGNvbnN0IG5hbWUgPSB1c2VyID8gdXNlci5GaXJzdE5hbWUgOiAnVXNlcic7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhhc0Vycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmhhc0Vycm9yLFxyXG4gICAgICAgIGVycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmVycm9ySW5mbyxcclxuICAgICAgICBuYW1lOiBuYW1lXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xlYXJFcnJvcjogKCkgPT4gZGlzcGF0Y2goY2xlYXJFcnJvcigpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTaGVsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBlcnJvclZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgY2xlYXJFcnJvciwgZXJyb3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgbWVzc2FnZSB9ID0gZXJyb3I7XHJcbiAgICAgICAgcmV0dXJuIChoYXNFcnJvciA/XHJcbiAgICAgICAgICAgIDxFcnJvclxyXG4gICAgICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17bWVzc2FnZX1cclxuICAgICAgICAgICAgICAgIGNsZWFyRXJyb3I9e2NsZWFyRXJyb3J9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBlbXBsb3llZVVybCA9IGdsb2JhbHMudXJscy5lbXBsb3llZUhhbmRib29rO1xyXG4gICAgICAgIGNvbnN0IGM1U2VhcmNoVXJsID0gZ2xvYmFscy51cmxzLmM1U2VhcmNoO1xyXG4gICAgICAgIHJldHVybiAgPEdyaWQgZmx1aWQ9e3RydWV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZiYXIgZml4ZWRUb3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci5CcmFuZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL2ludHJhbmV0c2lkZVwiIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiPkludXBsYW4gSW50cmFuZXQ8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5CcmFuZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuVG9nZ2xlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLkhlYWRlcj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuQ29sbGFwc2U+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbmRleE5hdkxpbmsgdG89XCIvXCI+Rm9yc2lkZTwvSW5kZXhOYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPVwiL2ZvcnVtXCI+Rm9ydW08L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89XCIvdXNlcnNcIj5CcnVnZXJlPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPVwiL2Fib3V0XCI+T208L05hdkxpbms+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuVGV4dCBwdWxsUmlnaHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSGVqLCB7bmFtZX0hXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5UZXh0PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXYgcHVsbFJpZ2h0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZEcm9wZG93biBldmVudEtleT17NX0gdGl0bGU9XCJMaW5rc1wiIGlkPVwiZXh0ZXJuX2xpbmtzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbSBocmVmPXtlbXBsb3llZVVybH0gZXZlbnRLZXk9ezUuMX0+TWVkYXJiZWpkZXIgaCZhcmluZztuZGJvZzwvTWVudUl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbSBocmVmPXtjNVNlYXJjaFVybH0gZXZlbnRLZXk9ezUuMn0+QzUgUyZvc2xhc2g7Z25pbmc8L01lbnVJdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2RHJvcGRvd24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L05hdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLkNvbGxhcHNlPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L05hdmJhcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZXJyb3JWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9HcmlkPlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBNYWluID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoU2hlbGwpO1xyXG5leHBvcnQgZGVmYXVsdCBNYWluO1xyXG4iLCLvu79leHBvcnQgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSdcclxufSIsIu+7v2ltcG9ydCB7IHVuaXEsIGZsYXR0ZW4gfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXHJcbmltcG9ydCByZW1vdmVNZCBmcm9tICdyZW1vdmUtbWFya2Rvd24nXHJcblxyXG52YXIgY3VycnkgPSBmdW5jdGlvbihmLCBuYXJncywgYXJncykge1xyXG4gICAgbmFyZ3MgPSBpc0Zpbml0ZShuYXJncykgPyBuYXJncyA6IGYubGVuZ3RoO1xyXG4gICAgYXJncyA9IGFyZ3MgfHwgW107XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gMS4gYWNjdW11bGF0ZSBhcmd1bWVudHNcclxuICAgICAgICB2YXIgbmV3QXJncyA9IGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIGlmIChuZXdBcmdzLmxlbmd0aCA+PSBuYXJncykge1xyXG4gICAgICAgICAgICAvLyBhcHBseSBhY2N1bXVsYXRlZCBhcmd1bWVudHNcclxuICAgICAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgbmV3QXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIDIuIHJldHVybiBhbm90aGVyIGN1cnJpZWQgZnVuY3Rpb25cclxuICAgICAgICByZXR1cm4gY3VycnkoZiwgbmFyZ3MsIG5ld0FyZ3MpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGN1cnJ5O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEZ1bGxOYW1lID0gKHVzZXIsIG5vbmUgPSAnJykgPT4ge1xyXG4gICAgaWYoIXVzZXIpIHJldHVybiBub25lO1xyXG4gICAgcmV0dXJuIGAke3VzZXIuRmlyc3ROYW1lfSAke3VzZXIuTGFzdE5hbWV9YDtcclxufVxyXG5cclxuY29uc3QgY291bnRDb21tZW50ID0gKHRvcENvbW1lbnQpID0+IHtcclxuICAgIGxldCBjb3VudCA9IDE7XHJcbiAgICBsZXQgcmVtb3ZlZCA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcENvbW1lbnQuUmVwbGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdG9wQ29tbWVudC5SZXBsaWVzW2ldO1xyXG5cclxuICAgICAgICAvLyBFeGNsdWRlIGRlbGV0ZWQgY29tbWVudHNcclxuICAgICAgICBpZihjaGlsZC5EZWxldGVkKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZWQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvdW50ICs9IGNvdW50Q29tbWVudChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50LXJlbW92ZWQ7XHJcbn1cclxuXHJcbmNvbnN0IGNvdW50Q29tbWVudHMgPSAoY29tbWVudHMgPSBbXSkgPT4ge1xyXG4gICAgbGV0IHRvdGFsID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgdG9wQ29tbWVudCA9IGNvbW1lbnRzW2ldO1xyXG4gICAgICAgIHRvdGFsICs9IGNvdW50Q29tbWVudCh0b3BDb21tZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdG90YWw7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVJbWFnZSA9IChpbWcpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSW1hZ2VJRDogaW1nLkltYWdlSUQsXHJcbiAgICAgICAgRmlsZW5hbWU6IGltZy5GaWxlbmFtZSxcclxuICAgICAgICBFeHRlbnNpb246IGltZy5FeHRlbnNpb24sXHJcbiAgICAgICAgT3JpZ2luYWxVcmw6IGltZy5PcmlnaW5hbFVybCxcclxuICAgICAgICBQcmV2aWV3VXJsOiBpbWcuUHJldmlld1VybCxcclxuICAgICAgICBUaHVtYm5haWxVcmw6IGltZy5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgQ29tbWVudENvdW50OiBpbWcuQ29tbWVudENvdW50LFxyXG4gICAgICAgIFVwbG9hZGVkOiBuZXcgRGF0ZShpbWcuVXBsb2FkZWQpLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNvbW1lbnQgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgbGV0IHIgPSBjb21tZW50LlJlcGxpZXMgPyBjb21tZW50LlJlcGxpZXMgOiBbXTtcclxuICAgIGNvbnN0IHJlcGxpZXMgPSByLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgIGNvbnN0IGF1dGhvcklkID0gKGNvbW1lbnQuRGVsZXRlZCkgPyAtMSA6IGNvbW1lbnQuQXV0aG9yLklEO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBDb21tZW50SUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgICAgIERlbGV0ZWQ6IGNvbW1lbnQuRGVsZXRlZCxcclxuICAgICAgICBQb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbixcclxuICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgUmVwbGllczogcmVwbGllcyxcclxuICAgICAgICBFZGl0ZWQ6IGNvbW1lbnQuRWRpdGVkXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVMYXRlc3QgPSAobGF0ZXN0KSA9PiB7XHJcbiAgICBsZXQgaXRlbSA9IG51bGw7XHJcbiAgICBsZXQgYXV0aG9ySWQgPSAtMTtcclxuICAgIGlmKGxhdGVzdC5UeXBlID09IDEpIHtcclxuICAgICAgICAvLyBJbWFnZSAtIG9taXQgQXV0aG9yIGFuZCBDb21tZW50Q291bnRcclxuICAgICAgICBjb25zdCBpbWFnZSA9IGxhdGVzdC5JdGVtO1xyXG4gICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIEV4dGVuc2lvbjogaW1hZ2UuRXh0ZW5zaW9uLFxyXG4gICAgICAgICAgICBGaWxlbmFtZTogaW1hZ2UuRmlsZW5hbWUsXHJcbiAgICAgICAgICAgIEltYWdlSUQ6IGltYWdlLkltYWdlSUQsXHJcbiAgICAgICAgICAgIE9yaWdpbmFsVXJsOiBpbWFnZS5PcmlnaW5hbFVybCxcclxuICAgICAgICAgICAgUHJldmlld1VybDogaW1hZ2UuUHJldmlld1VybCxcclxuICAgICAgICAgICAgVGh1bWJuYWlsVXJsOiBpbWFnZS5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgICAgIFVwbG9hZGVkOiBpbWFnZS5VcGxvYWRlZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYXV0aG9ySWQgPSBsYXRlc3QuSXRlbS5BdXRob3IuSUQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChsYXRlc3QuVHlwZSA9PSAyKSB7XHJcbiAgICAgICAgLy8gQ29tbWVudCAtIG9taXQgQXV0aG9yIGFuZCBEZWxldGVkIGFuZCBSZXBsaWVzXHJcbiAgICAgICAgY29uc3QgY29tbWVudCA9IGxhdGVzdC5JdGVtO1xyXG4gICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIElEOiBjb21tZW50LklELFxyXG4gICAgICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgICAgIEltYWdlSUQ6IGNvbW1lbnQuSW1hZ2VJRCxcclxuICAgICAgICAgICAgSW1hZ2VVcGxvYWRlZEJ5OiBjb21tZW50LkltYWdlVXBsb2FkZWRCeSxcclxuICAgICAgICAgICAgRmlsZW5hbWU6IGNvbW1lbnQuRmlsZW5hbWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIGF1dGhvcklkID0gbGF0ZXN0Lkl0ZW0uQXV0aG9yLklEO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobGF0ZXN0LlR5cGUgPT0gNCkge1xyXG4gICAgICAgIGNvbnN0IHBvc3QgPSBsYXRlc3QuSXRlbTtcclxuICAgICAgICBpdGVtID0ge1xyXG4gICAgICAgICAgICBJRDogcG9zdC5UaHJlYWRJRCxcclxuICAgICAgICAgICAgVGl0bGU6IHBvc3QuSGVhZGVyLlRpdGxlLFxyXG4gICAgICAgICAgICBUZXh0OiBwb3N0LlRleHQsXHJcbiAgICAgICAgICAgIFN0aWNreTogcG9zdC5IZWFkZXIuU3RpY2t5LFxyXG4gICAgICAgICAgICBDb21tZW50Q291bnQ6IHBvc3QuSGVhZGVyLkNvbW1lbnRDb3VudFxyXG4gICAgICAgIH1cclxuICAgICAgICBhdXRob3JJZCA9IHBvc3QuSGVhZGVyLkF1dGhvci5JRDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiBsYXRlc3QuSUQsXHJcbiAgICAgICAgVHlwZTogbGF0ZXN0LlR5cGUsXHJcbiAgICAgICAgSXRlbTogaXRlbSxcclxuICAgICAgICBPbjogbGF0ZXN0Lk9uLFxyXG4gICAgICAgIEF1dGhvcklEOiBhdXRob3JJZCxcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZVRocmVhZFRpdGxlID0gKHRpdGxlKSA9PiB7XHJcbiAgICBjb25zdCB2aWV3ZWRCeSA9IHRpdGxlLlZpZXdlZEJ5Lm1hcCh1c2VyID0+IHVzZXIuSUQpO1xyXG4gICAgY29uc3QgbGF0ZXN0Q29tbWVudCA9IHRpdGxlLkxhdGVzdENvbW1lbnQgPyBub3JtYWxpemVDb21tZW50KHRpdGxlLkxhdGVzdENvbW1lbnQpIDogbnVsbDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSUQ6IHRpdGxlLklELFxyXG4gICAgICAgIElzUHVibGlzaGVkOiB0aXRsZS5Jc1B1Ymxpc2hlZCxcclxuICAgICAgICBTdGlja3k6IHRpdGxlLlN0aWNreSxcclxuICAgICAgICBDcmVhdGVkT246IHRpdGxlLkNyZWF0ZWRPbixcclxuICAgICAgICBBdXRob3JJRDogdGl0bGUuQXV0aG9yLklELFxyXG4gICAgICAgIERlbGV0ZWQ6IHRpdGxlLkRlbGV0ZWQsXHJcbiAgICAgICAgSXNNb2RpZmllZDogdGl0bGUuSXNNb2RpZmllZCxcclxuICAgICAgICBUaXRsZTogdGl0bGUuVGl0bGUsXHJcbiAgICAgICAgTGFzdE1vZGlmaWVkOiB0aXRsZS5MYXN0TW9kaWZpZWQsXHJcbiAgICAgICAgTGF0ZXN0Q29tbWVudDogbGF0ZXN0Q29tbWVudCxcclxuICAgICAgICBDb21tZW50Q291bnQ6IHRpdGxlLkNvbW1lbnRDb3VudCxcclxuICAgICAgICBWaWV3ZWRCeTogdmlld2VkQnksXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB2aXNpdENvbW1lbnRzID0gKGNvbW1lbnRzLCBmdW5jKSA9PiB7XHJcbiAgICBjb25zdCBnZXRSZXBsaWVzID0gKGMpID0+IGMuUmVwbGllcyA/IGMuUmVwbGllcyA6IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRlcHRoRmlyc3RTZWFyY2goY29tbWVudHNbaV0sIGdldFJlcGxpZXMsIGZ1bmMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVwdGhGaXJzdFNlYXJjaCA9IChjdXJyZW50LCBnZXRDaGlsZHJlbiwgZnVuYykgPT4ge1xyXG4gICAgZnVuYyhjdXJyZW50KTtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gZ2V0Q2hpbGRyZW4oY3VycmVudCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjaGlsZHJlbltpXSwgZ2V0Q2hpbGRyZW4sIGZ1bmMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdW5pb24oYXJyMSwgYXJyMiwgZXF1YWxpdHlGdW5jKSB7XHJcbiAgICB2YXIgdW5pb24gPSBhcnIxLmNvbmNhdChhcnIyKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVuaW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IGkrMTsgaiA8IHVuaW9uLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChlcXVhbGl0eUZ1bmModW5pb25baV0sIHVuaW9uW2pdKSkge1xyXG4gICAgICAgICAgICAgICAgdW5pb24uc3BsaWNlKGosIDEpO1xyXG4gICAgICAgICAgICAgICAgai0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB1bmlvbjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEltYWdlQ29tbWVudHNQYWdlVXJsID0gKGltYWdlSWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgIHJldHVybiBgJHtnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50c30/aW1hZ2VJZD0ke2ltYWdlSWR9JnNraXA9JHtza2lwfSZ0YWtlPSR7dGFrZX1gO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybCA9IChjb21tZW50SWQpID0+IHtcclxuICAgIHJldHVybiBgJHtnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50c30/Y29tbWVudElkPSR7Y29tbWVudElkfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybCA9IChwb3N0SWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgIHJldHVybiBgJHtnbG9iYWxzLnVybHMuZm9ydW1jb21tZW50c30/cG9zdElkPSR7cG9zdElkfSZza2lwPSR7c2tpcH0mdGFrZT0ke3Rha2V9YDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEZvcnVtQ29tbWVudHNEZWxldGVVcmwgPSAoY29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4gYCR7Z2xvYmFscy51cmxzLmZvcnVtY29tbWVudHN9P2NvbW1lbnRJZD0ke2NvbW1lbnRJZH1gO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZm9ybWF0VGV4dCA9ICh0ZXh0KSA9PiB7XHJcbiAgICBpZiAoIXRleHQpIHJldHVybjtcclxuICAgIHZhciByYXdNYXJrdXAgPSBtYXJrZWQodGV4dCwgeyBzYW5pdGl6ZTogdHJ1ZSB9KTtcclxuICAgIHJldHVybiB7IF9faHRtbDogcmF3TWFya3VwIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRXb3JkcyA9ICh0ZXh0LCBudW1iZXJPZldvcmRzKSA9PiB7XHJcbiAgICBpZighdGV4dCkgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBwbGFpblRleHQgPSByZW1vdmVNZCh0ZXh0KTtcclxuICAgIHJldHVybiBwbGFpblRleHQuc3BsaXQoL1xccysvKS5zbGljZSgwLCBudW1iZXJPZldvcmRzKS5qb2luKFwiIFwiKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHRpbWVUZXh0ID0gKHBvc3RlZE9uKSA9PiB7XHJcbiAgICBjb25zdCBhZ28gPSBtb21lbnQocG9zdGVkT24pLmZyb21Ob3coKTtcclxuICAgIGNvbnN0IGRpZmYgPSBtb21lbnQoKS5kaWZmKHBvc3RlZE9uLCAnaG91cnMnLCB0cnVlKTtcclxuICAgIGlmIChkaWZmID49IDEyLjUpIHtcclxuICAgICAgICB2YXIgZGF0ZSA9IG1vbWVudChwb3N0ZWRPbik7XHJcbiAgICAgICAgcmV0dXJuIFwiZC4gXCIgKyBkYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyBkYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFwiZm9yIFwiICsgYWdvO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVzcG9uc2VIYW5kbGVyID0gKGRpc3BhdGNoLCByZXNwb25zZSkgPT4ge1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoIChyZXNwb25zZS5zdGF0dXMpIHtcclxuICAgICAgICAgICAgY2FzZSA0MDA6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihuZXcgSHR0cEVycm9yKFwiNDAwIEJhZCBSZXF1ZXN0XCIsIFwiVGhlIHJlcXVlc3Qgd2FzIG5vdCB3ZWxsLWZvcm1lZFwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDA0OlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjQwNCBOb3QgRm91bmRcIiwgXCJDb3VsZCBub3QgZmluZCByZXNvdXJjZVwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDA4OlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjQwOCBSZXF1ZXN0IFRpbWVvdXRcIiwgXCJUaGUgc2VydmVyIGRpZCBub3QgcmVzcG9uZCBpbiB0aW1lXCIpKSk7XHJcbiAgICAgICAgICAgIGNhc2UgNTAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjUwMCBTZXJ2ZXIgRXJyb3JcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHRoZSBBUEktc2VydmVyXCIpKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCJPb3BzXCIsIFwiU29tZXRoaW5nIHdlbnQgd3JvbmchXCIpKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgb25SZWplY3QgPSAoKSA9PiB7IH1cclxuXHJcbmV4cG9ydCBjb25zdCBwdXQgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBsZXQga3YgPSBPYmplY3QuYXNzaWduKHt9LCBvYmopO1xyXG4gICAga3Zba2V5XSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIGt2O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgb2JqTWFwID0gKGFyciwga2V5LCB2YWwpID0+IHtcclxuICAgIGNvbnN0IG9iaiA9IGFyci5yZWR1Y2UoKHJlcywgaXRlbSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGsgPSBrZXkoaXRlbSk7XHJcbiAgICAgICAgY29uc3QgdiA9IHZhbChpdGVtKTtcclxuICAgICAgICByZXNba10gPSB2O1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9LCB7fSk7XHJcblxyXG4gICAgcmV0dXJuIG9ialxyXG59XHJcbiIsIu+7v2ltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJ1xyXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyBvYmpNYXAsIHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5jb25zdCBnZXRVcmwgPSAodXNlcm5hbWUpID0+IGdsb2JhbHMudXJscy51c2VycyArICc/dXNlcm5hbWU9JyArIHVzZXJuYW1lO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRVc2VySWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfQ1VSUkVOVF9VU0VSX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXIodXNlcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9VU0VSLFxyXG4gICAgICAgIHVzZXI6IHVzZXJcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNpZXZlZFVzZXJzKHVzZXJzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfVVNFUlMsXHJcbiAgICAgICAgdXNlcnM6IHVzZXJzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRDdXJyZW50VXNlcklkKHVzZXIuSUQpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIodXNlcikpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFVzZXIodXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hVc2VycygpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGdsb2JhbHMudXJscy51c2Vycywgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlcnMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0S2V5ID0gKHVzZXIpID0+IHVzZXIuSUQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnZXRWYWx1ZSA9ICh1c2VyKSA9PiB1c2VyO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gb2JqTWFwKHVzZXJzLCBnZXRLZXksIGdldFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHJlY2lldmVkVXNlcnMob2JqKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi9lcnJvcidcclxuaW1wb3J0IHsgcmVzcG9uc2VIYW5kbGVyLCBvblJlamVjdCwgbm9ybWFsaXplTGF0ZXN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSAnLi91c2VycydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRMYXRlc3QobGF0ZXN0KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0xBVEVTVCxcclxuICAgICAgICBsYXRlc3Q6IGxhdGVzdFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0U0tpcChza2lwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1NLSVBfV0hBVFNfTkVXLFxyXG4gICAgICAgIHNraXA6IHNraXBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFRha2UodGFrZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UQUtFX1dIQVRTX05FVyxcclxuICAgICAgICB0YWtlOiB0YWtlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRQYWdlKHBhZ2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfUEFHRV9XSEFUU19ORVcsXHJcbiAgICAgICAgcGFnZTogcGFnZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VG90YWxQYWdlcyh0b3RhbFBhZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVyxcclxuICAgICAgICB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaExhdGVzdE5ld3Moc2tpcCwgdGFrZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLndoYXRzbmV3ICsgXCI/c2tpcD1cIiArIHNraXAgKyBcIiZ0YWtlPVwiICsgdGFrZTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHBhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBwYWdlLkN1cnJlbnRJdGVtcztcclxuICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gaXRlbS5JdGVtLkF1dGhvcjtcclxuICAgICAgICAgICAgICAgICAgICBpZihhdXRob3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIoYXV0aG9yKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZXNldCBpbmZvXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRTS2lwKHNraXApKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2UodGFrZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0UGFnZShwYWdlLkN1cnJlbnRQYWdlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFBhZ2VzKHBhZ2UuVG90YWxQYWdlcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBpdGVtcy5tYXAobm9ybWFsaXplTGF0ZXN0KTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldExhdGVzdChub3JtYWxpemVkKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IEltYWdlLCBNZWRpYSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50UHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8TWVkaWEuTGVmdCBjbGFzc05hbWU9XCJjb21tZW50LXByb2ZpbGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8SW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjPVwiL2ltYWdlcy9wZXJzb25faWNvbi5zdmdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogXCI2NHB4XCIsIGhlaWdodDogXCI2NHB4XCIgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWVkaWEtb2JqZWN0XCJcclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9NZWRpYS5MZWZ0PlxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTWVkaWEsIEdseXBoaWNvbiwgT3ZlcmxheVRyaWdnZXIsIFRvb2x0aXAgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdUb29sdGlwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHRvb2x0aXBWaWV3KHRpcCkge1xyXG4gICAgICAgIHJldHVybiAgPFRvb2x0aXAgaWQ9XCJ0b29sdGlwXCI+e3RpcH08L1Rvb2x0aXA+XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG9vbHRpcCwgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8T3ZlcmxheVRyaWdnZXIgcGxhY2VtZW50PVwibGVmdFwiIG92ZXJsYXk9e3RoaXMudG9vbHRpcFZpZXcodG9vbHRpcCl9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvT3ZlcmxheVRyaWdnZXI+XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlJ1xyXG5pbXBvcnQgeyBXaGF0c05ld1Rvb2x0aXAgfSBmcm9tICcuL1doYXRzTmV3VG9vbHRpcCdcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IHRpbWVUZXh0IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBJbWFnZSwgR2x5cGhpY29uLCBPdmVybGF5VHJpZ2dlciwgVG9vbHRpcCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1JbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICB3aGVuKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFwidXBsb2FkZWRlIFwiICsgdGltZVRleHQob24pO1xyXG4gICAgfVxyXG5cclxuICAgIG92ZXJsYXkoKSB7XHJcbiAgICAgICAgcmV0dXJuIDxUb29sdGlwIGlkPVwidG9vbHRpcF9pbWdcIj5CcnVnZXIgYmlsbGVkZTwvVG9vbHRpcD5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCBjb21tZW50SWQsIGF1dGhvciwgZmlsZW5hbWUsIGV4dGVuc2lvbiwgdGh1bWJuYWlsIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gYXV0aG9yLlVzZXJuYW1lO1xyXG4gICAgICAgIGNvbnN0IGZpbGUgPSBgJHtmaWxlbmFtZX0uJHtleHRlbnNpb259YDtcclxuICAgICAgICBjb25zdCBsaW5rID0gYCR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZUlkfWBcclxuICAgICAgICBjb25zdCBuYW1lID0gYCR7YXV0aG9yLkZpcnN0TmFtZX0gJHthdXRob3IuTGFzdE5hbWV9YDtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8V2hhdHNOZXdUb29sdGlwIHRvb2x0aXA9XCJVcGxvYWRldCBiaWxsZWRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkxpc3RJdGVtIGNsYXNzTmFtZT1cIndoYXRzbmV3SXRlbSBob3Zlci1zaGFkb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRQcm9maWxlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxNZWRpYS5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2xpbmt9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW1hZ2Ugc3JjPXt0aHVtYm5haWx9IHRodW1ibmFpbCAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9vdGVyPntuYW1lfSB7dGhpcy53aGVuKCl9PGJyIC8+PEdseXBoaWNvbiBnbHlwaD1cInBpY3R1cmVcIiAvPiB7ZmlsZX08L2Zvb3Rlcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvTWVkaWEuTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgICAgICA8L1doYXRzTmV3VG9vbHRpcD5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudFByb2ZpbGUnXHJcbmltcG9ydCB7IFdoYXRzTmV3VG9vbHRpcCB9IGZyb20gJy4vV2hhdHNOZXdUb29sdGlwJ1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCBnZXRXb3JkcywgdGltZVRleHQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IE1lZGlhLCBHbHlwaGljb24gfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdJdGVtQ29tbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjcmVhdGVTdW1tYXJ5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gZm9ybWF0VGV4dChnZXRXb3Jkcyh0ZXh0LCA1KSArIFwiLi4uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bGxuYW1lKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBhdXRob3IuRmlyc3ROYW1lICsgJyAnICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHdoZW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJzYWdkZSBcIiArIHRpbWVUZXh0KG9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCB1cGxvYWRlZEJ5LCBjb21tZW50SWQsIGF1dGhvciwgZmlsZW5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWUgPSB1cGxvYWRlZEJ5LlVzZXJuYW1lO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmZ1bGxuYW1lKCk7XHJcbiAgICAgICAgY29uc3Qgc3VtbWFyeSA9IHRoaXMuY3JlYXRlU3VtbWFyeSgpO1xyXG4gICAgICAgIGNvbnN0IGxpbmsgPSBgJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlSWR9L2NvbW1lbnQ/aWQ9JHtjb21tZW50SWR9YFxyXG4gICAgICAgIHJldHVybiAgPFdoYXRzTmV3VG9vbHRpcCB0b29sdGlwPVwiS29tbWVudGFyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkxpc3RJdGVtIGNsYXNzTmFtZT1cIndoYXRzbmV3SXRlbSBob3Zlci1zaGFkb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRQcm9maWxlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxNZWRpYS5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2xpbmt9PjxlbT48cCBkYW5nZXJvdXNseVNldElubmVySFRNTD17c3VtbWFyeX0+PC9wPjwvZW0+PC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb290ZXI+e25hbWV9IHt0aGlzLndoZW4oKX08YnIgLz48R2x5cGhpY29uIGdseXBoPVwiY29tbWVudFwiIC8+IHtmaWxlbmFtZX08L2Zvb3Rlcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvTWVkaWEuTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgICAgICA8L1doYXRzTmV3VG9vbHRpcD5cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFdoYXRzTmV3VG9vbHRpcCB9IGZyb20gJy4vV2hhdHNOZXdUb29sdGlwJ1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlJ1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCBnZXRXb3JkcywgdGltZVRleHQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IE1lZGlhLCBHbHlwaGljb24sIE92ZXJsYXlUcmlnZ2VyLCBUb29sdGlwIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3Rm9ydW1Qb3N0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gdGhpcy5zaG93TW9kYWwuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdWxsbmFtZSgpIHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gYXV0aG9yLkZpcnN0TmFtZSArICcgJyArIGF1dGhvci5MYXN0TmFtZTtcclxuICAgIH1cclxuXHJcbiAgICB3aGVuKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFwiaW5kbMOmZyBcIiArIHRpbWVUZXh0KG9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzdW1tYXJ5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gZ2V0V29yZHModGV4dCwgNSk7XHJcbiAgICB9XHJcblxyXG4gICAgb3ZlcmxheSgpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRDb3VudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gPFRvb2x0aXAgaWQ9XCJ0b29sdGlwX3Bvc3RcIj5Gb3J1bSBpbmRsJmFlbGlnO2csIGFudGFsIGtvbW1lbnRhcmVyOiB7Y29tbWVudENvdW50fTwvVG9vbHRpcD5cclxuICAgIH1cclxuXHJcbiAgICBzaG93TW9kYWwoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyBwcmV2aWV3LCBpbmRleCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwcmV2aWV3KGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgcG9zdElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmZ1bGxuYW1lKCk7XHJcbiAgICAgICAgY29uc3QgbGluayA9IGBmb3J1bS9wb3N0LyR7cG9zdElkfS9jb21tZW50c2A7XHJcbiAgICAgICAgIHJldHVybiA8V2hhdHNOZXdUb29sdGlwIHRvb2x0aXA9XCJGb3J1bSBpbmRsw6ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkxpc3RJdGVtIGNsYXNzTmFtZT1cIndoYXRzbmV3SXRlbSBob3Zlci1zaGFkb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRQcm9maWxlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxNZWRpYS5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLnNob3dNb2RhbH0+e3RoaXMuc3VtbWFyeSgpfS4uLjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9vdGVyPntuYW1lfSB7dGhpcy53aGVuKCl9PGJyIC8+PEdseXBoaWNvbiBnbHlwaD1cImxpc3QtYWx0XCIgLz4ge3RpdGxlfTwvZm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L01lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5MaXN0SXRlbT5cclxuICAgICAgICAgICAgICAgIDwvV2hhdHNOZXdUb29sdGlwPlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgV2hhdHNOZXdJdGVtSW1hZ2UgfSBmcm9tICcuL1doYXRzTmV3SXRlbUltYWdlJ1xyXG5pbXBvcnQgeyBXaGF0c05ld0l0ZW1Db21tZW50IH0gZnJvbSAnLi9XaGF0c05ld0l0ZW1Db21tZW50J1xyXG5pbXBvcnQgeyBXaGF0c05ld0ZvcnVtUG9zdCB9IGZyb20gJy4vV2hhdHNOZXdGb3J1bVBvc3QnXHJcbmltcG9ydCB7IE1lZGlhIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3TGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnByZXZpZXdQb3N0SGFuZGxlID0gdGhpcy5wcmV2aWV3UG9zdEhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXZpZXdQb3N0SGFuZGxlKGluZGV4KSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgcHJldmlldyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaW5kZXhdO1xyXG4gICAgICAgIHByZXZpZXcoaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0SXRlbXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciwgcHJldmlldyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBnZW5lcmF0ZUtleSA9IChpZCkgPT4gXCJ3aGF0c25ld19cIiArIGlkO1xyXG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoIChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtS2V5ID0gZ2VuZXJhdGVLZXkoaXRlbS5JRCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGdldFVzZXIoaXRlbS5BdXRob3JJRCk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICA8V2hhdHNOZXdJdGVtSW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17aXRlbS5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbj17aXRlbS5Pbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXtpdGVtLkl0ZW0uSW1hZ2VJRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZT17aXRlbS5JdGVtLkZpbGVuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbj17aXRlbS5JdGVtLkV4dGVuc2lvbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw9e2l0ZW0uSXRlbS5UaHVtYm5haWxVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlldz17aXRlbS5JdGVtLlByZXZpZXdVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9yPXthdXRob3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtS2V5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxXaGF0c05ld0l0ZW1Db21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2l0ZW0uSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudElkPXtpdGVtLkl0ZW0uSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17aXRlbS5JdGVtLlRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWRCeT17aXRlbS5JdGVtLkltYWdlVXBsb2FkZWRCeX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXtpdGVtLkl0ZW0uSW1hZ2VJRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbj17aXRlbS5Pbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I9e2F1dGhvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZT17aXRlbS5JdGVtLkZpbGVuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aXRlbUtleX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICA8V2hhdHNOZXdGb3J1bVBvc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbj17aXRlbS5Pbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I9e2F1dGhvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17aXRlbS5JdGVtLlRpdGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e2l0ZW0uSXRlbS5UZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0aWNreT17aXRlbS5JdGVtLlN0aWNreX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0SWQ9e2l0ZW0uSXRlbS5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50Q291bnQ9e2l0ZW0uSXRlbS5Db21tZW50Q291bnR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlldz17dGhpcy5wcmV2aWV3UG9zdEhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aW5kZXh9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtS2V5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGl0ZW1Ob2RlcyA9IHRoaXMuY29uc3RydWN0SXRlbXMoKTtcclxuICAgICAgICByZXR1cm4gIDxNZWRpYS5MaXN0PlxyXG4gICAgICAgICAgICAgICAgICAgIHtpdGVtTm9kZXN9XHJcbiAgICAgICAgICAgICAgICA8L01lZGlhLkxpc3Q+XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBGb3JtR3JvdXAsIENvbnRyb2xMYWJlbCwgRm9ybUNvbnRyb2wsIEJ1dHRvbiwgUm93LCBDb2wsIE1vZGFsLCBCdXR0b25Hcm91cCwgQ2hlY2tib3gsIEdseXBoaWNvbiB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBGb3J1bUZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgVGl0bGU6ICcnLFxyXG4gICAgICAgICAgICBUZXh0OiAnJyxcclxuICAgICAgICAgICAgU3RpY2t5OiBmYWxzZSxcclxuICAgICAgICAgICAgSXNQdWJsaXNoZWQ6IHRydWUsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXQgfSA9IG5leHRQcm9wcztcclxuICAgICAgICBpZihlZGl0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgVGl0bGU6IGVkaXQuVGl0bGUsXHJcbiAgICAgICAgICAgICAgICBUZXh0OiBlZGl0LlRleHQsXHJcbiAgICAgICAgICAgICAgICBTdGlja3k6IGVkaXQuU3RpY2t5LFxyXG4gICAgICAgICAgICAgICAgSXNQdWJsaXNoZWQ6IGVkaXQuSXNQdWJsaXNoZWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVRpdGxlQ2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGl0bGU6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVRleHRDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUZXh0OiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRWYWxpZGF0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuc3RhdGUuVGl0bGUubGVuZ3RoO1xyXG4gICAgICAgIGlmIChsZW5ndGggPiAwICYmIGxlbmd0aCA8IDIwMCkgcmV0dXJuICdzdWNjZXNzJztcclxuICAgICAgICBpZiAobGVuZ3RoID49IDIwMCAmJiBsZW5ndGggPD0gMjUwKSByZXR1cm4gJ3dhcm5pbmcnO1xyXG4gICAgICAgIGlmIChsZW5ndGggPiAyNTApIHJldHVybiAnZXJyb3InO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVRvRFRPKHN0YXRlKSB7XHJcbiAgICAgICAgLy8gQSBUaHJlYWRQb3N0Q29udGVudCBjbGFzc1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIEhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgSXNQdWJsaXNoZWQ6IHN0YXRlLklzUHVibGlzaGVkLFxyXG4gICAgICAgICAgICAgICAgU3RpY2t5OiBzdGF0ZS5TdGlja3ksXHJcbiAgICAgICAgICAgICAgICBUaXRsZTogc3RhdGUuVGl0bGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgVGV4dDogc3RhdGUuVGV4dFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTdWJtaXQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCB7IGNsb3NlLCBvblN1Ym1pdCB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgLy8gRG8gd2hhdGV2ZXIgd29yayBoZXJlLi4uXHJcbiAgICAgICAgY29uc3QgcG9zdCA9IHRoaXMudHJhbnNmb3JtVG9EVE8odGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgb25TdWJtaXQocG9zdCk7XHJcbiAgICAgICAgY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTdGlja3koKSB7XHJcbiAgICAgICAgY29uc3QgeyBTdGlja3kgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFN0aWNreTogIVN0aWNreSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVQdWJsaXNoZWQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBJc1B1Ymxpc2hlZCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgSXNQdWJsaXNoZWQ6ICFJc1B1Ymxpc2hlZCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGNsb3NlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2hvdywgZWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZWFkTW9kZSA9IEJvb2xlYW4oIWVkaXQpO1xyXG4gICAgICAgIGNvbnN0IHRpdGxlID0gIHJlYWRNb2RlID8gJ1Nrcml2IG55dCBpbmRsw6ZnJyA6ICfDhm5kcmUgaW5kbMOmZyc7XHJcbiAgICAgICAgY29uc3QgYnRuU3VibWl0ID0gcmVhZE1vZGUgPyAnU2tyaXYgaW5kbMOmZycgOiAnR2VtIMOmbmRyaW5nZXInO1xyXG4gICAgICAgIHJldHVybiAgPE1vZGFsIHNob3c9e3Nob3d9IG9uSGlkZT17dGhpcy5jbG9zZUhhbmRsZS5iaW5kKHRoaXMpfSBic1NpemU9XCJsZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxmb3JtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWwuSGVhZGVyIGNsb3NlQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsLlRpdGxlPnt0aXRsZX08L01vZGFsLlRpdGxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L01vZGFsLkhlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezEyfT5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwIGNvbnRyb2xJZD1cImZvcm1Qb3N0VGl0bGVcIiB2YWxpZGF0aW9uU3RhdGU9e3RoaXMuZ2V0VmFsaWRhdGlvbigpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29udHJvbExhYmVsPk92ZXJza3JpZnQ8L0NvbnRyb2xMYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUNvbnRyb2wgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIk92ZXJza3JpZnQgcMOlIGluZGzDpmcuLi5cIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVUaXRsZUNoYW5nZS5iaW5kKHRoaXMpfSB2YWx1ZT17dGhpcy5zdGF0ZS5UaXRsZX0vPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Gb3JtR3JvdXA+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Hcm91cCBjb250cm9sSWQ9XCJmb3JtUG9zdENvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29udHJvbExhYmVsPkluZGwmYWVsaWc7ZzwvQ29udHJvbExhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtQ29udHJvbCBjb21wb25lbnRDbGFzcz1cInRleHRhcmVhXCIgcGxhY2Vob2xkZXI9XCJTa3JpdiBiZXNrZWQgaGVyLi4uXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpfSB2YWx1ZT17dGhpcy5zdGF0ZS5UZXh0fSByb3dzPVwiOFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwIGNvbnRyb2xJZD1cImZvcm1Qb3N0U3RpY2t5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGJzU3R5bGU9XCJzdWNjZXNzXCIgYnNTaXplPVwic21hbGxcIiBhY3RpdmU9e3RoaXMuc3RhdGUuU3RpY2t5fSBvbkNsaWNrPXt0aGlzLmhhbmRsZVN0aWNreS5iaW5kKHRoaXMpfT48R2x5cGhpY29uIGdseXBoPVwicHVzaHBpblwiIC8+IFZpZ3RpZzwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWwuRm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBic1N0eWxlPVwiZGVmYXVsdFwiIG9uQ2xpY2s9e3RoaXMuY2xvc2VIYW5kbGUuYmluZCh0aGlzKX0+THVrPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGJzU3R5bGU9XCJwcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fT57YnRuU3VibWl0fTwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L01vZGFsLkZvb3Rlcj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICA8L01vZGFsPlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUm93LCBDb2wsIEJ1dHRvblRvb2xiYXIsIEJ1dHRvbkdyb3VwLCBPdmVybGF5VHJpZ2dlciwgQnV0dG9uLCBHbHlwaGljb24sIFRvb2x0aXAsIENvbGxhcHNlLCBGb3JtR3JvdXAsIEZvcm1Db250cm9sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnRDb250cm9scyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICB0ZXh0OiBwcm9wcy50ZXh0LFxyXG4gICAgICAgICAgICByZXBseVRleHQ6ICcnLFxyXG4gICAgICAgICAgICByZXBseTogZmFsc2UsXHJcbiAgICAgICAgICAgIGVkaXQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy50b2dnbGVFZGl0ID0gdGhpcy50b2dnbGVFZGl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50b2dnbGVSZXBseSA9IHRoaXMudG9nZ2xlUmVwbHkuYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0SGFuZGxlID0gdGhpcy5lZGl0SGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZXBseUhhbmRsZSA9IHRoaXMucmVwbHlIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUhhbmRsZSA9IHRoaXMuZGVsZXRlSGFuZGxlLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVwbHlDaGFuZ2UgPSB0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVJlcGx5Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHlUZXh0OiBlLnRhcmdldC52YWx1ZSB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZUVkaXQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiAhZWRpdCB9KTtcclxuICAgICAgICBpZighZWRpdCkge1xyXG4gICAgICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVSZXBseSgpIHtcclxuICAgICAgICBjb25zdCB7IHJlcGx5IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXBseTogIXJlcGx5IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUNvbW1lbnQsIGNvbW1lbnRJZCwgY29udGV4dElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBjb250ZXh0SWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGVkaXRIYW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0Q29tbWVudCwgY29udGV4dElkLCBjb21tZW50SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnN0YXRlO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogZmFsc2UgfSk7XHJcbiAgICAgICAgZWRpdENvbW1lbnQoY29tbWVudElkLCBjb250ZXh0SWQsIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGx5SGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudElkLCBjb250ZXh0SWQsIHJlcGx5Q29tbWVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHJlcGx5VGV4dCB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5OiBmYWxzZSwgcmVwbHlUZXh0OiAnJyB9KTtcclxuICAgICAgICByZXBseUNvbW1lbnQoY29udGV4dElkLCByZXBseVRleHQsIGNvbW1lbnRJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudElkLCBhdXRob3JJZCwgY2FuRWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGVkaXQsIHRleHQsIHJlcGx5LCByZXBseVRleHQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgbW91bnQgPSBjYW5FZGl0KGF1dGhvcklkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3cgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4JywgcGFkZGluZ0xlZnQ6IFwiMTVweFwifX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblRvb2xiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblRvb2x0aXAgYnNTdHlsZT1cInByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLmRlbGV0ZUhhbmRsZX0gaWNvbj1cInRyYXNoXCIgdG9vbHRpcD1cInNsZXRcIiBtb3VudD17bW91bnR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Ub29sdGlwIGJzU3R5bGU9XCJwcmltYXJ5XCIgb25DbGljaz17dGhpcy50b2dnbGVFZGl0fSBpY29uPVwicGVuY2lsXCIgdG9vbHRpcD1cIsOmbmRyZVwiIGFjdGl2ZT17ZWRpdH0gbW91bnQ9e21vdW50fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uVG9vbHRpcCBic1N0eWxlPVwicHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMudG9nZ2xlUmVwbHl9IGljb249XCJlbnZlbG9wZVwiIHRvb2x0aXA9XCJzdmFyXCIgYWN0aXZlPXtyZXBseX0gbW91bnQ9e3RydWV9IC8+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvblRvb2xiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3cgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4J319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsxfSBsZz17MTB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbGxhcHNlVGV4dEFyZWFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93PXtlZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZWRpdFRleHRDb250cm9sXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVUZXh0Q2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZT17dGhpcy50b2dnbGVFZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmU9e3RoaXMuZWRpdEhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGV4dD1cIkdlbSDDpm5kcmluZ2VyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VudD17bW91bnR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsxfSBsZz17MTB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbGxhcHNlVGV4dEFyZWFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93PXtyZXBseX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cInJlcGx5VGV4dENvbnRyb2xcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZXBseVRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVwbHlDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlPXt0aGlzLnRvZ2dsZVJlcGx5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmU9e3RoaXMucmVwbHlIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRleHQ9XCJTdmFyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VudD17dHJ1ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENvbGxhcHNlVGV4dEFyZWEgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2hvdywgaWQsIHZhbHVlLCBvbkNoYW5nZSwgdG9nZ2xlLCBzYXZlLCBzYXZlVGV4dCwgbW91bnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYoIW1vdW50KSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gIDxDb2xsYXBzZSBpbj17c2hvd30+XHJcbiAgICAgICAgICAgICAgICAgICAgPEZvcm1Hcm91cCBjb250cm9sSWQ9e2lkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sIGNvbXBvbmVudENsYXNzPVwidGV4dGFyZWFcIiB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gcm93cz1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblRvb2xiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e3RvZ2dsZX0+THVrPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBic1N0eWxlPVwiaW5mb1wiIG9uQ2xpY2s9e3NhdmV9PntzYXZlVGV4dH08L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Ub29sYmFyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvRm9ybUdyb3VwPlxyXG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ1dHRvblRvb2x0aXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG9vbHRpcCwgb25DbGljaywgaWNvbiwgYnNTdHlsZSwgYWN0aXZlLCBtb3VudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgb3ZlcmxheVRpcCA9IDxUb29sdGlwIGlkPVwidG9vbHRpcFwiPnt0b29sdGlwfTwvVG9vbHRpcD47XHJcblxyXG4gICAgICAgIGlmKCFtb3VudCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiAgPE92ZXJsYXlUcmlnZ2VyIHBsYWNlbWVudD1cInRvcFwiIG92ZXJsYXk9e292ZXJsYXlUaXB9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT17YnNTdHlsZX0gYnNTaXplPVwieHNtYWxsXCIgb25DbGljaz17b25DbGlja30gYWN0aXZlPXthY3RpdmV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8R2x5cGhpY29uIGdseXBoPXtpY29ufSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9PdmVybGF5VHJpZ2dlcj5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgbm9ybWFsaXplVGhyZWFkVGl0bGUsIHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0UG9zdENvbW1lbnRzID0gKGNvbW1lbnRzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1BPU1RfQ09NTUVOVFMsXHJcbiAgICAgICAgY29tbWVudHM6IGNvbW1lbnRzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVUaHJlYWRUaXRsZSA9ICh0aXRsZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlVQREFURV9USFJFQURfVElUTEUsXHJcbiAgICAgICAgaWQ6IHRpdGxlLklELFxyXG4gICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFkZFRocmVhZFRpdGxlID0gKHRpdGxlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX1RIUkVBRF9USVRMRSxcclxuICAgICAgICB0aXRsZTogdGl0bGVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFRocmVhZFRpdGxlcyA9ICh0aXRsZXMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVEhSRUFEX1RJVExFUyxcclxuICAgICAgICB0aXRsZXM6IHRpdGxlc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0VG90YWxQYWdlcyA9ICh0b3RhbFBhZ2VzKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RPVEFMX1BBR0VTX1RIUkVBRFMsXHJcbiAgICAgICAgdG90YWxQYWdlczogdG90YWxQYWdlc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0UGFnZSA9IChwYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1BBR0VfVEhSRUFEUyxcclxuICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTa2lwID0gKHNraXApID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0tJUF9USFJFQURTLFxyXG4gICAgICAgIHNraXA6IHNraXBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFRha2UgPSAodGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UQUtFX1RIUkVBRFMsXHJcbiAgICAgICAgdGFrZTogdGFrZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0U2VsZWN0ZWRUaHJlYWQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0VMRUNURURUSFJFQURfSUQsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRQb3N0Q29udGVudCA9IChjb250ZW50KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1BPU1RfQ09OVEVOVCxcclxuICAgICAgICBjb250ZW50OiBjb250ZW50XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBuZXdGb3J1bVRocmVhZEZyb21TZXJ2ZXIgPSAodGhyZWFkKSA9PiB7XHJcbiAgICBjb25zdCB0ID0gbm9ybWFsaXplVGhyZWFkVGl0bGUodGhyZWFkLkhlYWRlcik7XHJcbiAgICBjb25zdCBjID0gdGhyZWFkLlRleHQ7IC8vIHVudXNlZCBmb3Igbm93XHJcbiAgICByZXR1cm4gYWRkVGhyZWFkVGl0bGUodCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtYXJrUG9zdCA9IChwb3N0SWQsIHJlYWQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9wb3N0SWQ9JHtwb3N0SWR9JnJlYWQ9JHtyZWFkfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYiwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hUaHJlYWRzID0gKHNraXAgPSAwLCB0YWtlID0gMTApID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGZvcnVtID0gZ2xvYmFscy51cmxzLmZvcnVtdGl0bGU7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Zm9ydW19P3NraXA9JHtza2lwfSZ0YWtlPSR7dGFrZX1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBVbnByb2Nlc3NlZCBmb3J1bSB0aXRsZXNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VGb3J1bVRpdGxlcyA9IGRhdGEuQ3VycmVudEl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZm9ydW1UaXRsZXMgPSBwYWdlRm9ydW1UaXRsZXMubWFwKG5vcm1hbGl6ZVRocmVhZFRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgaW5mb1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2tpcChza2lwKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUYWtlKHRha2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMoZGF0YS5Ub3RhbFBhZ2VzKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRQYWdlKGRhdGEuQ3VycmVudFBhZ2UpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhyZWFkc1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGhyZWFkVGl0bGVzKGZvcnVtVGl0bGVzKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGZldGNoUG9zdCA9IChpZCwgY2IpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGZvcnVtID0gZ2xvYmFscy51cmxzLmZvcnVtcG9zdDtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtmb3J1bX0/aWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gZGF0YS5UZXh0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBub3JtYWxpemVUaHJlYWRUaXRsZShkYXRhLkhlYWRlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2godXBkYXRlVGhyZWFkVGl0bGUodGl0bGUpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFBvc3RDb250ZW50KGNvbnRlbnQpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkVGhyZWFkKGRhdGEuVGhyZWFkSUQpKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlUG9zdCA9IChpZCwgcG9zdCwgY2IpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5mb3J1bXBvc3R9P2lkPSR7aWR9YDtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3QpLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oY2IsIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVBvc3QgPSAoaWQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZm9ydW1wb3N0fT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYiwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBwb3N0OiBUaHJlYWRQb3N0Q29udGVudFxyXG5leHBvcnQgY29uc3QgcG9zdFRocmVhZCA9IChjYiwgcG9zdCkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtcG9zdDtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwb3N0KSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGNiKCksIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgbm9ybWFsaXplQ29tbWVudCwgdmlzaXRDb21tZW50cywgcmVzcG9uc2VIYW5kbGVyLCBvblJlamVjdCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgYWRkVXNlciB9IGZyb20gJy4vdXNlcnMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTa2lwQ29tbWVudHMgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TS0lQX0NPTU1FTlRTLFxyXG4gICAgICAgIHNraXA6IHNraXBcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0U2tpcCA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9TS0lQXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0VGFrZSA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9UQUtFXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRUYWtlQ29tbWVudHMgPSAodGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UQUtFX0NPTU1FTlRTLFxyXG4gICAgICAgIHRha2U6IHRha2VcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJyZW50UGFnZShwYWdlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0NVUlJFTlRfUEFHRSxcclxuICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VG90YWxQYWdlcyh0b3RhbFBhZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RPVEFMX1BBR0VTLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0Q29tbWVudHMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0RFRkFVTFRfQ09NTUVOVFNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VpdmVkQ29tbWVudHMoY29tbWVudHMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRUNJRVZFRF9DT01NRU5UUyxcclxuICAgICAgICBjb21tZW50czogY29tbWVudHNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRDb21tZW50KGNvbW1lbnQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5BRERfQ09NTUVOVCxcclxuICAgICAgICBjb21tZW50OiBjb21tZW50XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRGb2N1c2VkQ29tbWVudChjb21tZW50SWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfRk9DVVNFRF9DT01NRU5ULFxyXG4gICAgICAgIGlkOiBjb21tZW50SWRcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5ld0NvbW1lbnRGcm9tU2VydmVyKGNvbW1lbnQpIHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZSA9IG5vcm1hbGl6ZUNvbW1lbnQoY29tbWVudCk7XHJcbiAgICByZXR1cm4gYWRkQ29tbWVudChub3JtYWxpemUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBVbnByb2Nlc3NlZCBjb21tZW50c1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFnZUNvbW1lbnRzID0gZGF0YS5DdXJyZW50SXRlbXM7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2V0IChyZS1zZXQpIGluZm9cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFNraXBDb21tZW50cyhza2lwKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUYWtlQ29tbWVudHModGFrZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0Q3VycmVudFBhZ2UoZGF0YS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxQYWdlcyhkYXRhLlRvdGFsUGFnZXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBub3JtYWxpemVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1lbnRzID0gcGFnZUNvbW1lbnRzLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVkQ29tbWVudHMoY29tbWVudHMpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcG9zdENvbW1lbnQgPSAodXJsLCBjb250ZXh0SWQsIHRleHQsIHBhcmVudENvbW1lbnRJZCwgY2IpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBjb25zdCBib2R5ID1KU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIFRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgIENvbnRleHRJRDogY29udGV4dElkLFxyXG4gICAgICAgICAgICBQYXJlbnRJRDogcGFyZW50Q29tbWVudElkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYiwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZWRpdENvbW1lbnQgPSAodXJsLCBjb21tZW50SWQsIHRleHQsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IElEOiBjb21tZW50SWQsIFRleHQ6IHRleHQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYiwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlQ29tbWVudCA9ICh1cmwsIGNiKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oY2IpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmltYWdlY29tbWVudHN9L0dldFNpbmdsZT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oYyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tZW50ID0gbm9ybWFsaXplQ29tbWVudChjKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVkQ29tbWVudHMoW2NvbW1lbnRdKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRGb2N1c2VkQ29tbWVudChjb21tZW50LkNvbW1lbnRJRCkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBGb3J1bUZvcm0gfSBmcm9tICcuLi9mb3J1bS9Gb3J1bUZvcm0nXHJcbmltcG9ydCB7IEJ1dHRvblRvb2x0aXAgfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50Q29udHJvbHMnXHJcbmltcG9ydCB7IG1hcmtQb3N0LCB1cGRhdGVQb3N0LCBmZXRjaFBvc3QsIGRlbGV0ZVBvc3QgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2ZvcnVtJ1xyXG5pbXBvcnQgeyBwb3N0Q29tbWVudCB9IGZyb20gJy4uLy4uL2FjdGlvbnMvY29tbWVudHMnXHJcbmltcG9ydCB7IGZpbmQsIGNvbnRhaW5zIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgZ2V0RnVsbE5hbWUsIHRpbWVUZXh0LCBmb3JtYXRUZXh0IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBSb3csIENvbCwgR2x5cGhpY29uLCBCdXR0b25Ub29sYmFyLCBCdXR0b25Hcm91cCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnNlbGVjdGVkVGhyZWFkO1xyXG4gICAgY29uc3QgdGl0bGUgPSBmaW5kKHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRpdGxlcywgKHRpdGxlKSA9PiB0aXRsZS5JRCA9PSBzZWxlY3RlZCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNlbGVjdGVkOiBzZWxlY3RlZCxcclxuICAgICAgICB0aXRsZTogdGl0bGUsXHJcbiAgICAgICAgdGV4dDogc3RhdGUuZm9ydW1JbmZvLnBvc3RDb250ZW50LFxyXG4gICAgICAgIGdldFVzZXI6IChpZCkgPT4gc3RhdGUudXNlcnNJbmZvLnVzZXJzW2lkXSxcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09IGlkLFxyXG4gICAgICAgIGhhc1JlYWQ6IHRpdGxlID8gY29udGFpbnModGl0bGUuVmlld2VkQnksIHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkKSA6IGZhbHNlLFxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlOiAoaWQsIHBvc3QsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwZGF0ZVBvc3QoaWQsIHBvc3QsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRQb3N0OiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hQb3N0KGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVQb3N0OiAoaWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZVBvc3QoaWQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWFkUG9zdDogKHBvc3RJZCwgcmVhZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gobWFya1Bvc3QocG9zdElkLCByZWFkLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEZvcnVtUG9zdENvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBlZGl0OiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudG9nZ2xlRWRpdCA9IHRoaXMudG9nZ2xlRWRpdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25TdWJtaXQgPSB0aGlzLm9uU3VibWl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVIYW5kbGUgPSB0aGlzLmRlbGV0ZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlUG9zdFJlYWQgPSB0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCBoYXNUaXRsZSA9IEJvb2xlYW4obmV4dFByb3BzLnRpdGxlKTtcclxuICAgICAgICBpZighaGFzVGl0bGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgICBUaXRsZTogbmV4dFByb3BzLnRpdGxlLlRpdGxlLFxyXG4gICAgICAgICAgICAgICAgVGV4dDogbmV4dFByb3BzLnRleHQsXHJcbiAgICAgICAgICAgICAgICBTdGlja3k6IG5leHRQcm9wcy50aXRsZS5TdGlja3ksXHJcbiAgICAgICAgICAgICAgICBJc1B1Ymxpc2hlZDogbmV4dFByb3BzLnRpdGxlLklzUHVibGlzaGVkXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gbmV4dFByb3BzLnRpdGxlLlRpdGxlO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IHJvdXRlciwgZGVsZXRlUG9zdCwgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcnVtbGlzdHMgPSBgL2ZvcnVtYDtcclxuICAgICAgICAgICAgcm91dGVyLnB1c2goZm9ydW1saXN0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWxldGVQb3N0KHRpdGxlLklELCBjYik7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlRWRpdCgpIHtcclxuICAgICAgICBjb25zdCBlZGl0ID0gdGhpcy5zdGF0ZS5lZGl0O1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiAhZWRpdCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvblN1Ym1pdChwb3N0KSB7XHJcbiAgICAgICAgY29uc3QgeyB1cGRhdGUsIGdldFBvc3QsIHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBnZXRQb3N0KHRpdGxlLklEKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB1cGRhdGUodGl0bGUuSUQsIHBvc3QsIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVQb3N0UmVhZCh0b2dnbGUpIHtcclxuICAgICAgICBjb25zdCB7IGdldFBvc3QsIHJlYWRQb3N0LCB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgZ2V0UG9zdCh0aXRsZS5JRCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWFkUG9zdCh0aXRsZS5JRCwgdG9nZ2xlLCBjYik7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6IGZhbHNlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIHNlbGVjdGVkLCB0aXRsZSwgdGV4dCwgZ2V0VXNlciwgaGFzUmVhZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZihzZWxlY3RlZCA8IDAgfHwgIXRpdGxlKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgY29uc3QgZWRpdCA9IGNhbkVkaXQodGl0bGUuQXV0aG9ySUQpO1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBnZXRVc2VyKHRpdGxlLkF1dGhvcklEKTtcclxuICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRGdWxsTmFtZSh1c2VyKTtcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPEZvcnVtSGVhZGVyIGxnPXsxMn0gbmFtZT17YXV0aG9yfSB0aXRsZT17dGl0bGUuVGl0bGV9IGNyZWF0ZWRPbj17dGl0bGUuQ3JlYXRlZE9ufSBtb2RpZmllZE9uPXt0aXRsZS5MYXN0TW9kaWZpZWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Rm9ydW1CdXR0b25Hcm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdz17dHJ1ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRhYmxlPXtlZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFJlYWQ9e2hhc1JlYWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRlbGV0ZT17dGhpcy5kZWxldGVIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkVkaXQ9e3RoaXMudG9nZ2xlRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uUmVhZD17dGhpcy50b2dnbGVQb3N0UmVhZC5iaW5kKHRoaXMsIHRydWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25VbnJlYWQ9e3RoaXMudG9nZ2xlUG9zdFJlYWQuYmluZCh0aGlzLCBmYWxzZSl9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Gb3J1bUhlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICA8Rm9ydW1Cb2R5IHRleHQ9e3RleHR9IGxnPXsxMH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgICAgICA8L0ZvcnVtQm9keT5cclxuICAgICAgICAgICAgICAgICAgICA8Rm9ydW1Gb3JtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3c9e3RoaXMuc3RhdGUuZWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2U9e3RoaXMuY2xvc2UuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25TdWJtaXQ9e3RoaXMub25TdWJtaXQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdD17dGhpcy5zdGF0ZS5tb2RlbH0gLz5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRm9ydW1Cb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQsIGxnLCBsZ09mZnNldCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBmb3JtYXR0ZWRUZXh0ID0gZm9ybWF0VGV4dCh0ZXh0KTtcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17bGd9IGxnT2Zmc2V0PXtsZ09mZnNldH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZvcnVtLWNvbnRlbnRcIiBkYW5nZXJvdXNseVNldElubmVySFRNTD17Zm9ybWF0dGVkVGV4dH0vPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17MTJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbkZvcnVtQm9keS5wcm9wVHlwZXMgPSB7XHJcbiAgICB0ZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBsZzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcclxuICAgIGxnT2Zmc2V0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGb3J1bUhlYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBnZXRDcmVhdGVkT25UZXh0KGNyZWF0ZWRPbiwgbW9kaWZpZWRPbikge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBtb21lbnQoY3JlYXRlZE9uKTtcclxuICAgICAgICBjb25zdCBkYXRlVGV4dCA9IGRhdGUuZm9ybWF0KFwiRC1NTS1ZWVwiKTtcclxuICAgICAgICBjb25zdCB0aW1lVGV4dCA9IGRhdGUuZm9ybWF0KFwiIEg6bW1cIik7XHJcbiAgICAgICAgaWYoIW1vZGlmaWVkT24pXHJcbiAgICAgICAgICAgIHJldHVybiBgVWRnaXZldCAke2RhdGVUZXh0fSBrbC4gJHt0aW1lVGV4dH1gO1xyXG5cclxuICAgICAgICBjb25zdCBtb2RpZmllZCA9IG1vbWVudChtb2RpZmllZE9uKTtcclxuICAgICAgICBjb25zdCBtb2RpZmllZERhdGUgPSBtb2RpZmllZC5mb3JtYXQoXCJELU1NLVlZXCIpO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkVGltZSA9IG1vZGlmaWVkLmZvcm1hdChcIkg6bW1cIik7XHJcbiAgICAgICAgcmV0dXJuIGBVZGdpdmV0ICR7ZGF0ZVRleHR9IGtsLiAke3RpbWVUZXh0fSAoIHJldHRldCAke21vZGlmaWVkRGF0ZX0ga2wuICR7bW9kaWZpZWRUaW1lfSApYDtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgbmFtZSwgY3JlYXRlZE9uLCBtb2RpZmllZE9uLCBsZywgbGdPZmZzZXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuZ2V0Q3JlYXRlZE9uVGV4dChjcmVhdGVkT24sIG1vZGlmaWVkT24pO1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0geyBsZzogbGcsIGxnT2Zmc2V0OiBsZ09mZnNldCB9O1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sIHsuLi5wcm9wc30+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtY2FwaXRhbGl6ZVwiPnt0aXRsZX08L3NwYW4+PGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+U2tyZXZldCBhZiB7bmFtZX08L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c21hbGwgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+PEdseXBoaWNvbiBnbHlwaD1cInRpbWVcIiAvPiB7Y3JlYXRlZH08L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5Gb3J1bUhlYWRlci5wcm9wVHlwZXMgPSB7XHJcbiAgICBjcmVhdGVkT246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICBtb2RpZmllZE9uOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgdGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxyXG59XHJcblxyXG4vLyBwcm9wczogeyBzaG93LCBlZGl0YWJsZSwgaW5pdGlhbFJlYWQsIG9uRGVsZXRlLCBvbkVkaXQsIG9uUmVhZCwgb25VbnJlYWQgfVxyXG5leHBvcnQgY2xhc3MgRm9ydW1CdXR0b25Hcm91cCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHJlYWQ6IHByb3BzLmluaXRpYWxSZWFkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlYWRIYW5kbGUgPSB0aGlzLnJlYWRIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnVucmVhZEhhbmRsZSA9IHRoaXMudW5yZWFkSGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZEhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IG9uUmVhZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZih0aGlzLnN0YXRlLnJlYWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlYWQ6IHRydWUgfSk7XHJcbiAgICAgICAgb25SZWFkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5yZWFkSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb25VbnJlYWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYoIXRoaXMuc3RhdGUucmVhZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVhZDogZmFsc2UgfSk7XHJcbiAgICAgICAgb25VbnJlYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0YWJsZSwgc2hvdywgb25EZWxldGUsIG9uRWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZighc2hvdykgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgcmVhZCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICByZXR1cm4gIDxDb2wgbGc9ezEyfSBjbGFzc05hbWU9XCJmb3J1bS1lZGl0YmFyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblRvb2xiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Ub29sdGlwIGJzU3R5bGU9XCJkYW5nZXJcIiBvbkNsaWNrPXtvbkRlbGV0ZX0gaWNvbj1cInRyYXNoXCIgdG9vbHRpcD1cInNsZXQgaW5kbMOmZ1wiIG1vdW50PXtlZGl0YWJsZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Ub29sdGlwIGJzU3R5bGU9XCJwcmltYXJ5XCIgb25DbGljaz17b25FZGl0fSBpY29uPVwicGVuY2lsXCIgdG9vbHRpcD1cIsOmbmRyZSBpbmRsw6ZnXCIgYWN0aXZlPXtmYWxzZX0gbW91bnQ9e2VkaXRhYmxlfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblRvb2x0aXAgYnNTdHlsZT1cInByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLnJlYWRIYW5kbGV9IGljb249XCJleWUtb3BlblwiIHRvb2x0aXA9XCJtYXJrZXIgc29tIGzDpnN0XCIgYWN0aXZlPXtyZWFkfSBtb3VudD17dHJ1ZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Ub29sdGlwIGJzU3R5bGU9XCJwcmltYXJ5XCIgb25DbGljaz17dGhpcy51bnJlYWRIYW5kbGV9IGljb249XCJleWUtY2xvc2VcIiB0b29sdGlwPVwibWFya2VyIHNvbSB1bMOmc3RcIiBhY3RpdmU9eyFyZWFkfSBtb3VudD17dHJ1ZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICA8L0J1dHRvblRvb2xiYXI+XHJcbiAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgIH1cclxufVxyXG5cclxuRm9ydW1CdXR0b25Hcm91cC5wcm9wVHlwZXMgPSB7XHJcbiAgICBzaG93OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgZWRpdGFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBpbml0aWFsUmVhZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIG9uRGVsZXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgb25FZGl0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgb25SZWFkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgb25VbnJlYWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcclxufVxyXG5cclxuY29uc3QgRm9ydW1Qb3N0UmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShGb3J1bVBvc3RDb250YWluZXIpO1xyXG5jb25zdCBGb3J1bVBvc3QgPSB3aXRoUm91dGVyKEZvcnVtUG9zdFJlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgRm9ydW1Qb3N0O1xyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFBhZ2luYXRpb24gYXMgUGFnaW5hdGlvbkJzIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhZ2luYXRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG90YWxQYWdlcywgcGFnZSwgcGFnZUhhbmRsZSwgc2hvdyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBtb3JlID0gdG90YWxQYWdlcyA+IDE7XHJcbiAgICAgICAgY29uc3QgeG9yID0gKHNob3cgfHwgbW9yZSkgJiYgIShzaG93ICYmIG1vcmUpO1xyXG4gICAgICAgIGlmKCEoeG9yIHx8IChzaG93ICYmIG1vcmUpKSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiAgPFBhZ2luYXRpb25Cc1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXYgbmV4dCBlbGxpcHNpcyBib3VuZGFyeUxpbmtzXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM9e3RvdGFsUGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4QnV0dG9ucz17NX1cclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVQYWdlPXtwYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXtwYWdlSGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgIH1cclxufSAgICAgICAgICAgICIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgdmFsdWVzLCBzb3J0QnkgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IGZldGNoTGF0ZXN0TmV3cyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvd2hhdHNuZXcnXHJcbmltcG9ydCB7IFdoYXRzTmV3TGlzdCB9IGZyb20gJy4uL3doYXRzbmV3L1doYXRzTmV3TGlzdCdcclxuaW1wb3J0IHsgRm9ydW1IZWFkZXIsIEZvcnVtQm9keSB9IGZyb20gJy4vRm9ydW1Qb3N0J1xyXG5pbXBvcnQgeyBCdXR0b24sIEJ1dHRvblRvb2xiYXIsIE1vZGFsLCBSb3csIENvbCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gJy4uL3BhZ2luYXRpb24vUGFnaW5hdGlvbidcclxuaW1wb3J0IHsgTGluaywgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpdGVtczogc3RhdGUud2hhdHNOZXdJbmZvLml0ZW1zLFxyXG4gICAgICAgIGdldFVzZXI6IChpZCkgPT4gc3RhdGUudXNlcnNJbmZvLnVzZXJzW2lkXSxcclxuICAgICAgICBza2lwOiBzdGF0ZS53aGF0c05ld0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS53aGF0c05ld0luZm8udGFrZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS53aGF0c05ld0luZm8udG90YWxQYWdlcyxcclxuICAgICAgICBwYWdlOiBzdGF0ZS53aGF0c05ld0luZm8ucGFnZSxcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldExhdGVzdDogKHNraXAsIHRha2UpID0+IGRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSksXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFdoYXRzTmV3Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgcG9zdFByZXZpZXc6IG51bGwsXHJcbiAgICAgICAgICAgIGF1dGhvcjoge30sXHJcbiAgICAgICAgICAgIG9uOiBudWxsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnByZXZpZXdQb3N0ID0gdGhpcy5wcmV2aWV3UG9zdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VNb2RhbCA9IHRoaXMuY2xvc2VNb2RhbC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubW9kYWxWaWV3ID0gdGhpcy5tb2RhbFZpZXcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm5hdmlnYXRlVG8gPSB0aGlzLm5hdmlnYXRlVG8uYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwYWdlSGFuZGxlKHRvKSB7XHJcbiAgICAgICAgY29uc3QgeyBnZXRMYXRlc3QsIHBhZ2UsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYocGFnZSA9PSB0bykgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSB0byAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIGdldExhdGVzdChza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXZpZXdQb3N0KGl0ZW0pIHtcclxuICAgICAgICBjb25zdCB7IGdldFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yID0gZ2V0VXNlcihpdGVtLkF1dGhvcklEKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW9kYWw6IHRydWUsXHJcbiAgICAgICAgICAgIHBvc3RQcmV2aWV3OiBpdGVtLkl0ZW0sXHJcbiAgICAgICAgICAgIGF1dGhvcjogYXV0aG9yLFxyXG4gICAgICAgICAgICBvbjogaXRlbS5PblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG8odXJsKSB7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBwdXNoKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VNb2RhbCgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBwb3N0UHJldmlldzogbnVsbCxcclxuICAgICAgICAgICAgYXV0aG9yOiB7fSxcclxuICAgICAgICAgICAgb246IG51bGxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb2RhbFZpZXcoKSB7XHJcbiAgICAgICAgaWYoIUJvb2xlYW4odGhpcy5zdGF0ZS5wb3N0UHJldmlldykpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHsgVGV4dCwgVGl0bGUsIElEIH0gPSB0aGlzLnN0YXRlLnBvc3RQcmV2aWV3O1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IHRoaXMuc3RhdGUuYXV0aG9yO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHthdXRob3IuRmlyc3ROYW1lfSAke2F1dGhvci5MYXN0TmFtZX1gO1xyXG4gICAgICAgIGNvbnN0IGxpbmsgPSBgZm9ydW0vcG9zdC8ke0lEfS9jb21tZW50c2A7XHJcblxyXG4gICAgICAgIHJldHVybiAgPE1vZGFsIHNob3c9e3RoaXMuc3RhdGUubW9kYWx9IG9uSGlkZT17dGhpcy5jbG9zZU1vZGFsfSBic1NpemU9XCJsYXJnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxNb2RhbC5IZWFkZXIgY2xvc2VCdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbC5UaXRsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3J1bUhlYWRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxnPXsxMX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZ09mZnNldD17MX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkT249e3RoaXMuc3RhdGUub259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e1RpdGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e25hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L01vZGFsLlRpdGxlPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvTW9kYWwuSGVhZGVyPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8TW9kYWwuQm9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcnVtQm9keSB0ZXh0PXtUZXh0fSBsZz17MTF9IGxnT2Zmc2V0PXsxfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Gb3J1bUJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5Cb2R5PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8TW9kYWwuRm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uVG9vbGJhciBzdHlsZT17e2Zsb2F0OiBcInJpZ2h0XCJ9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cInByaW1hcnlcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLm5hdmlnYXRlVG8obGluayl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2Uga29tbWVudGFyZXIgKGZvcnVtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e3RoaXMuY2xvc2VNb2RhbH0+THVrPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uVG9vbGJhcj5cclxuICAgICAgICAgICAgICAgICAgICA8L01vZGFsLkZvb3Rlcj5cclxuICAgICAgICAgICAgICAgIDwvTW9kYWw+XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIsIHRvdGFsUGFnZXMsIHBhZ2UgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+U2lkc3RlIGgmYWVsaWc7bmRlbHNlcjwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8V2hhdHNOZXdMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17aXRlbXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRVc2VyPXtnZXRVc2VyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlldz17dGhpcy5wcmV2aWV3UG9zdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFBhZ2luYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM9e3RvdGFsUGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlPXtwYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZUhhbmRsZT17dGhpcy5wYWdlSGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5tb2RhbFZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBXaGF0c05ldyA9IHdpdGhSb3V0ZXIoY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoV2hhdHNOZXdDb250YWluZXIpKTtcclxuZXhwb3J0IGRlZmF1bHQgV2hhdHNOZXc7XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcclxuaW1wb3J0IHsgUm93LCBDb2wsIEJ1dHRvbiB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZVVwbG9hZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJJbnB1dChmaWxlSW5wdXQpIHtcclxuICAgICAgICBpZihmaWxlSW5wdXQudmFsdWUpe1xyXG4gICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICBmaWxlSW5wdXQudmFsdWUgPSAnJzsgLy9mb3IgSUUxMSwgbGF0ZXN0IENocm9tZS9GaXJlZm94L09wZXJhLi4uXHJcbiAgICAgICAgICAgIH1jYXRjaChlcnIpeyB9XHJcbiAgICAgICAgICAgIGlmKGZpbGVJbnB1dC52YWx1ZSl7IC8vZm9yIElFNSB+IElFMTBcclxuICAgICAgICAgICAgICAgIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBmaWxlSW5wdXQucGFyZW50Tm9kZSwgcmVmID0gZmlsZUlucHV0Lm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChmaWxlSW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZmlsZUlucHV0LHJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmlsZXMoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIHJldHVybiAoZmlsZXMgPyBmaWxlcy5maWxlcyA6IFtdKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTdWJtaXQoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBsb2FkSW1hZ2UsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCBmaWxlcyA9IHRoaXMuZ2V0RmlsZXMoKTtcclxuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBmaWxlc1tpXTtcclxuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGxvYWRJbWFnZSh1c2VybmFtZSwgZm9ybURhdGEpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgdGhpcy5jbGVhcklucHV0KGZpbGVJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fSBpZD1cImZvcm0tdXBsb2FkXCIgZW5jVHlwZT1cIm11bHRpcGFydC9mb3JtLWRhdGFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZpbGVzXCI+VXBsb2FkIGZpbGVyOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImZpbGVzXCIgbmFtZT1cImZpbGVzXCIgbXVsdGlwbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBic1N0eWxlPVwicHJpbWFyeVwiIHR5cGU9XCJzdWJtaXRcIj5VcGxvYWQ8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgYWRkVXNlciB9IGZyb20gJy4vdXNlcnMnXHJcbmltcG9ydCB7IG5vcm1hbGl6ZUltYWdlIH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi9lcnJvcidcclxuaW1wb3J0IHsgb2JqTWFwLCByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRJbWFnZXNPd25lcihpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9JTUFHRVNfT1dORVIsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjaWV2ZWRVc2VySW1hZ2VzKGltYWdlcykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFQ0lFVkVEX1VTRVJfSU1BR0VTLFxyXG4gICAgICAgIGltYWdlczogaW1hZ2VzXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0U2VsZWN0ZWRJbWcgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0VMRUNURURfSU1HLFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEltYWdlKGltZykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9JTUFHRSxcclxuICAgICAgICBrZXk6IGltZy5JbWFnZUlELFxyXG4gICAgICAgIHZhbDogaW1nXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSW1hZ2UoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRU1PVkVfSU1BR0UsXHJcbiAgICAgICAga2V5OiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFNlbGVjdGVkSW1hZ2VJZChpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9TRUxFQ1RFRF9JTUFHRV9JRCxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTZWxlY3RlZEltYWdlSWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRU1PVkVfU0VMRUNURURfSU1BR0VfSUQsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkNMRUFSX1NFTEVDVEVEX0lNQUdFX0lEU1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluY3JlbWVudENvbW1lbnRDb3VudCA9IChpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuSU5DUl9JTUdfQ09NTUVOVF9DT1VOVCxcclxuICAgICAgICBrZXk6IGltYWdlSWRcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlY3JlbWVudENvbW1lbnRDb3VudCA9IChpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuREVDUl9JTUdfQ09NTUVOVF9DT1VOVCxcclxuICAgICAgICBrZXk6IGltYWdlSWRcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5ld0ltYWdlRnJvbVNlcnZlciA9IChpbWFnZSkgPT4ge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUltYWdlKGltYWdlKTtcclxuICAgIHJldHVybiBhZGRJbWFnZShub3JtYWxpemVkKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUltYWdlKGlkLCB1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlcyArIFwiP3VzZXJuYW1lPVwiICsgdXNlcm5hbWUgKyBcIiZpZD1cIiArIGlkO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKHJlbW92ZUltYWdlKGlkKSksIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSwgb25TdWNjZXNzLCBvbkVycm9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzcywgb25FcnJvcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25TdWNjZXNzID0gKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGRhdGEubWFwKG5vcm1hbGl6ZUltYWdlKS5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG9iak1hcChub3JtYWxpemVkLCAoaW1nKSA9PiBpbWcuSW1hZ2VJRCwgKGltZykgPT4gaW1nKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVjaWV2ZWRVc2VySW1hZ2VzKG9iaikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4ob25TdWNjZXNzLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVJbWFnZXModXNlcm5hbWUsIGltYWdlSWRzID0gW10pIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGlkcyA9IGltYWdlSWRzLmpvaW4oKTtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZSArIFwiJmlkcz1cIiArIGlkcztcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBkaXNwYXRjaChjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSksIG9uUmVqZWN0KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBkaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRJbWFnZU93bmVyKHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgLy8gTGF6eSBldmFsdWF0aW9uXHJcbiAgICAgICAgY29uc3QgZmluZE93bmVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZmluZChnZXRTdGF0ZSgpLnVzZXJzSW5mby51c2VycywgKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1c2VyLlVzZXJuYW1lID09IHVzZXJuYW1lO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvd25lciA9IGZpbmRPd25lcigpO1xyXG5cclxuICAgICAgICBpZihvd25lcikge1xyXG4gICAgICAgICAgICBjb25zdCBvd25lcklkID0gb3duZXIuSUQ7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEltYWdlc093bmVyKG93bmVySWQpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9IGdsb2JhbHMudXJscy51c2VycyArICc/dXNlcm5hbWU9JyArIHVzZXJuYW1lO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKHVzZXIgPT4gZGlzcGF0Y2goYWRkVXNlcih1c2VyKSksIG9uUmVqZWN0KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyID0gZmluZE93bmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0SW1hZ2VzT3duZXIob3duZXIuSUQpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoU2luZ2xlSW1hZ2UoaWQpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCIvZ2V0YnlpZD9pZD1cIiArIGlkO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKCFpbWcpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJbWFnZSA9IG5vcm1hbGl6ZUltYWdlKGltZyk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRJbWFnZShub3JtYWxpemVkSW1hZ2UpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi9lcnJvcidcclxuaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRVc2VkU3BhY2VrQih1c2VkU3BhY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVVNFRF9TUEFDRV9LQixcclxuICAgICAgICB1c2VkU3BhY2U6IHVzZWRTcGFjZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VG90YWxTcGFjZWtCKHRvdGFsU3BhY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVE9UQUxfU1BBQ0VfS0IsXHJcbiAgICAgICAgdG90YWxTcGFjZTogdG90YWxTcGFjZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hTcGFjZUluZm8gPSAodXJsKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlZFNwYWNlID0gZGF0YS5Vc2VkU3BhY2VLQjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsU3BhY2UgPSBkYXRhLlNwYWNlUXVvdGFLQjtcclxuXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRVc2VkU3BhY2VrQih1c2VkU3BhY2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsU3BhY2VrQih0b3RhbFNwYWNlKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgUm93LCBDb2wsIFByb2dyZXNzQmFyIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5pbXBvcnQgeyBmZXRjaFNwYWNlSW5mbyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvc3RhdHVzJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVzZWRNQjogKHN0YXRlLnN0YXR1c0luZm8uc3BhY2VJbmZvLnVzZWRTcGFjZWtCIC8gMTAwMCksXHJcbiAgICAgICAgdG90YWxNQjogKHN0YXRlLnN0YXR1c0luZm8uc3BhY2VJbmZvLnRvdGFsU3BhY2VrQiAvIDEwMDApLFxyXG4gICAgICAgIGxvYWRlZDogKHN0YXRlLnN0YXR1c0luZm8uc3BhY2VJbmZvLnRvdGFsU3BhY2VrQiAhPSAtMSlcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFNwYWNlSW5mbzogKHVybCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFNwYWNlSW5mbyh1cmwpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVzZWRTcGFjZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBnZXRTcGFjZUluZm8gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmRpYWdub3N0aWNzfS9nZXRzcGFjZWluZm9gO1xyXG4gICAgICAgIGdldFNwYWNlSW5mbyh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZWRNQiwgdG90YWxNQiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB0b3RhbCA9IE1hdGgucm91bmQodG90YWxNQik7XHJcbiAgICAgICAgY29uc3QgdXNlZCA9IE1hdGgucm91bmQodXNlZE1CKjEwMCkgLyAxMDA7XHJcbiAgICAgICAgY29uc3QgZnJlZSA9IE1hdGgucm91bmQoKHRvdGFsIC0gdXNlZCkqMTAwKSAvIDEwMDtcclxuICAgICAgICBjb25zdCB1c2VkUGVyY2VudCA9ICgodXNlZC90b3RhbCkqIDEwMCk7XHJcbiAgICAgICAgY29uc3QgcGVyY2VudFJvdW5kID0gTWF0aC5yb3VuZCh1c2VkUGVyY2VudCoxMDApIC8gMTAwO1xyXG4gICAgICAgIGNvbnN0IHNob3cgPSBCb29sZWFuKHVzZWRQZXJjZW50KSAmJiBCb29sZWFuKHVzZWQpICYmIEJvb2xlYW4oZnJlZSkgJiYgQm9vbGVhbih0b3RhbCk7XHJcbiAgICAgICAgaWYoIXNob3cpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFByb2dyZXNzQmFyIHN0cmlwZWQ9e3RydWV9IGJzU3R5bGU9XCJzdWNjZXNzXCIgbm93PXt1c2VkUGVyY2VudH0ga2V5PXsxfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJydWd0OiB7dXNlZC50b1N0cmluZygpfSBNQiAoe3BlcmNlbnRSb3VuZC50b1N0cmluZygpfSAlKTxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJpIHBsYWRzOiB7ZnJlZS50b1N0cmluZygpfSBNQjxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG90YWw6IHt0b3RhbC50b1N0cmluZygpfSBNQlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVXNlZFNwYWNlID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlZFNwYWNlVmlldyk7XHJcbmV4cG9ydCBkZWZhdWx0IFVzZWRTcGFjZTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgPFVzZWRTcGFjZURvdWdobnV0XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiY2FudmFzRG91Z2hudXRcIlxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmVlPXtNYXRoLnJvdW5kKGZyZWUpfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkPXtNYXRoLnJvdW5kKHVzZWQpfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD17NDYwfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9ezMwMH1cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG5cclxuLy9jbGFzcyBVc2VkU3BhY2VEb3VnaG51dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbi8vICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4vLyAgICAgICAgY29uc3QgeyBpZCwgdXNlZCwgZnJlZSB9ID0gdGhpcy5wcm9wcztcclxuLy8gICAgICAgIGNvbnN0IGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuLy8gICAgICAgIGNvbnN0IGRhdGFPcHRpb25zID0ge1xyXG4vLyAgICAgICAgICAgIGxhYmVsczogW1wiQnJ1Z3RcIiwgXCJGcmlcIl0sXHJcbi8vICAgICAgICAgICAgZGF0YXNldHM6IFtcclxuLy8gICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgZGF0YTogW3VzZWQsIGZyZWVdLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkY2Mzg0XCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCIjMzZBMkVCXCJcclxuLy8gICAgICAgICAgICAgICAgICAgIF0sXHJcbi8vICAgICAgICAgICAgICAgICAgICBob3ZlckJhY2tncm91bmRDb2xvcjogW1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiI0ZGNjM4NFwiLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiIzM2QTJFQlwiXHJcbi8vICAgICAgICAgICAgICAgICAgICBdXHJcbi8vICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICBdXHJcbi8vICAgICAgICB9O1xyXG4vLyAgICAgICAgbGV0IGNoYXJ0ID0gbmV3IENoYXJ0KGN0eCwge1xyXG4vLyAgICAgICAgICAgIHR5cGU6ICdkb3VnaG51dCcsXHJcbi8vICAgICAgICAgICAgZGF0YTogZGF0YU9wdGlvbnNcclxuLy8gICAgICAgIH0pXHJcbi8vICAgIH1cclxuLy9cclxuLy8gICAgcmVuZGVyKCkge1xyXG4vLyAgICAgICAgY29uc3QgeyBpZCwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5wcm9wcztcclxuLy8gICAgICAgIHJldHVybiAgPGNhbnZhcyBpZD17aWR9IHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9PlxyXG4vLyAgICAgICAgICAgICAgICA8L2NhbnZhcz5cclxuLy8gICAgfVxyXG4vL31cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCBXaGF0c05ldyBmcm9tICcuL1doYXRzTmV3J1xyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZCB9IGZyb20gJy4uL2ltYWdlcy9JbWFnZVVwbG9hZCdcclxuaW1wb3J0IHsgdXBsb2FkSW1hZ2UgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2ltYWdlcydcclxuaW1wb3J0IHsgZmV0Y2hMYXRlc3ROZXdzIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy93aGF0c25ldydcclxuaW1wb3J0IHsgSnVtYm90cm9uLCBHcmlkLCBSb3csIENvbCwgUGFuZWwsIEFsZXJ0IH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5pbXBvcnQgeyB2YWx1ZXMgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgVXNlZFNwYWNlIGZyb20gJy4vVXNlZFNwYWNlJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VyID0gdmFsdWVzKHN0YXRlLnVzZXJzSW5mby51c2VycykuZmlsdGVyKHUgPT4gdS5Vc2VybmFtZS50b1VwcGVyQ2FzZSgpID09IGdsb2JhbHMuY3VycmVudFVzZXJuYW1lLnRvVXBwZXJDYXNlKCkpWzBdO1xyXG4gICAgY29uc3QgbmFtZSA9IHVzZXIgPyB1c2VyLkZpcnN0TmFtZSA6ICdVc2VyJztcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICBza2lwOiBzdGF0ZS53aGF0c05ld0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS53aGF0c05ld0luZm8udGFrZVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBsb2FkSW1hZ2U6IChza2lwLCB0YWtlLCB1c2VybmFtZSwgZm9ybURhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb25TdWNjZXNzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSwgb25TdWNjZXNzLCAoKSA9PiB7IH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEhvbWVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHJlY29tbWVuZGVkOiB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwbG9hZCA9IHRoaXMudXBsb2FkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZWNvbW1lbmRlZFZpZXcgPSB0aGlzLnJlY29tbWVuZGVkVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJGb3JzaWRlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgdXBsb2FkKHVzZXJuYW1lLCBmb3JtRGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBsb2FkSW1hZ2UsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgdXBsb2FkSW1hZ2Uoc2tpcCwgdGFrZSwgdXNlcm5hbWUsIGZvcm1EYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICByZWNvbW1lbmRlZFZpZXcoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuc3RhdGUucmVjb21tZW5kZWQpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEFsZXJ0IGJzU3R5bGU9XCJzdWNjZXNzXCIgb25EaXNtaXNzPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgcmVjb21tZW5kZWQ6IGZhbHNlIH0pfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoND5BbmJlZmFsaW5nZXI8L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5UZXN0ZXQgbWVkIEdvb2dsZSBDaHJvbWUgYnJvd3Nlci4gRGVyZm9yIGVyIGRldCBhbmJlZmFsZXQgYXQgYnJ1Z2UgZGVubmUgdGlsIGF0IGYmYXJpbmc7IGRlbiBmdWxkZSBvcGxldmVsc2UuPGJyIC8+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQWxlcnQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWUgPSBnbG9iYWxzLmN1cnJlbnRVc2VybmFtZTtcclxuICAgICAgICBjb25zdCB7IG5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxKdW1ib3Ryb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMT48c3Bhbj5WZWxrb21tZW4gPHNtYWxsPntuYW1lfSE8L3NtYWxsPjwvc3Bhbj48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJsZWFkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWwgSW51cGxhbnMgZm9ydW0gb2cgYmlsbGVkLWFya2l2IHNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9eydEdSBrYW4gdXBsb2FkZSBiaWxsZWRlciB0aWwgZGl0IGVnZXQgZ2FsbGVyaSBoZXInfSBic1N0eWxlPVwicHJpbWFyeVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW1hZ2VVcGxvYWQgdXNlcm5hbWU9e3VzZXJuYW1lfSB1cGxvYWRJbWFnZT17dGhpcy51cGxvYWR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9QYW5lbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgICAgICA8L0p1bWJvdHJvbj5cclxuICAgICAgICAgICAgICAgICAgICA8R3JpZCBmbHVpZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXs0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8V2hhdHNOZXcgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17MX0gbGc9ezN9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlY29tbWVuZGVkVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5QZXJzb25saWcgdXBsb2FkIGZvcmJydWc8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIZXJ1bmRlciBrYW4gZHUgc2UgaHZvciBtZWdldCBwbGFkcyBkdSBoYXIgYnJ1Z3Qgb2cgaHZvciBtZWdldCBmcmkgcGxhZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVyIGVyIHRpbGJhZ2UuIEfDpmxkZXIga3VuIGJpbGxlZGUgZmlsZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VkU3BhY2UgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgICAgICA8L0dyaWQ+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSG9tZSA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEhvbWVWaWV3KVxyXG5leHBvcnQgZGVmYXVsdCBIb21lXHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3J1bSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxPkZvcnVtIDxzbWFsbD5pbmRsJmFlbGlnO2c8L3NtYWxsPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUm93LCBDb2wsIEdseXBoaWNvbiwgT3ZlcmxheVRyaWdnZXIsIFRvb2x0aXAgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IHRpbWVUZXh0LCBmb3JtYXRUZXh0LCBnZXRXb3JkcyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmV4cG9ydCBjbGFzcyBGb3J1bVRpdGxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGRhdGVWaWV3KGRhdGUpIHtcclxuICAgICAgICBjb25zdCBkYXlNb250aFllYXIgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KFwiRC9NTS9ZWVwiKTtcclxuICAgICAgICByZXR1cm4gYCR7ZGF5TW9udGhZZWFyfWA7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kaWZpZWRWaWV3KG1vZGlmaWVkT24pIHtcclxuICAgICAgICBpZighbW9kaWZpZWRPbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWREYXRlID0gbW9tZW50KG1vZGlmaWVkT24pLmZvcm1hdChcIkQvTU0vWVktSDptbVwiKTtcclxuICAgICAgICByZXR1cm4gYCR7bW9kaWZpZWREYXRlfWA7XHJcbiAgICB9XHJcblxyXG4gICAgdG9vbHRpcFZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8VG9vbHRpcCBpZD1cInRvb2x0aXBcIj5WaWd0aWc8L1Rvb2x0aXA+XHJcbiAgICB9XHJcblxyXG4gICAgc3RpY2t5SWNvbihzaG93KSB7XHJcbiAgICAgICAgaWYoIXNob3cpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiAgPHAgY2xhc3NOYW1lPVwic3RpY2t5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPE92ZXJsYXlUcmlnZ2VyIHBsYWNlbWVudD1cInRvcFwiIG92ZXJsYXk9e3RoaXMudG9vbHRpcFZpZXcoKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxHbHlwaGljb24gZ2x5cGg9XCJwdXNocGluXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L092ZXJsYXlUcmlnZ2VyPlxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgfVxyXG5cclxuICAgIGRhdGVNb2RpZmllZFZpZXcodGl0bGUpIHtcclxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5kYXRlVmlldyh0aXRsZS5DcmVhdGVkT24pO1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWQgPSB0aGlzLm1vZGlmaWVkVmlldyh0aXRsZS5MYXN0TW9kaWZpZWQpO1xyXG4gICAgICAgIGlmKCF1cGRhdGVkKSByZXR1cm4gPHNwYW4+e2NyZWF0ZWR9PC9zcGFuPlxyXG5cclxuICAgICAgICBjb25zdCB1cGRhdGVUZXh0ID0gYCR7dXBkYXRlZH1gO1xyXG4gICAgICAgIHJldHVybiAgPHNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAge2NyZWF0ZWR9PGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgKHt1cGRhdGVkfSlcclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTdW1tYXJ5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYoIXRpdGxlLkxhdGVzdENvbW1lbnQpIHJldHVybiAnSW5nZW4ga29tbWVudGFyZXInO1xyXG5cclxuICAgICAgICBpZih0aXRsZS5MYXRlc3RDb21tZW50LkRlbGV0ZWQpIHJldHVybiAnS29tbWVudGFyIHNsZXR0ZXQnO1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aXRsZS5MYXRlc3RDb21tZW50LlRleHQ7XHJcbiAgICAgICAgcmV0dXJuIGdldFdvcmRzKHRleHQsIDUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlLCBnZXRBdXRob3IsIG9uQ2xpY2sgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGdldEF1dGhvcih0aXRsZS5BdXRob3JJRCk7XHJcbiAgICAgICAgY29uc3QgbGF0ZXN0Q29tbWVudCAgPSB0aGlzLmNyZWF0ZVN1bW1hcnkoKTtcclxuICAgICAgICBjb25zdCBjc3MgPSB0aXRsZS5TdGlja3kgPyBcInRocmVhZCB0aHJlYWQtcGlubmVkXCIgOiBcInRocmVhZFwiO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBgL2ZvcnVtL3Bvc3QvJHt0aXRsZS5JRH0vY29tbWVudHNgO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxMaW5rIHRvPXtwYXRofT5cclxuICAgICAgICAgICAgICAgICAgICA8Um93IGNsYXNzTmFtZT17Y3NzfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17MX0gY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj57dGhpcy5zdGlja3lJY29uKHRpdGxlLlN0aWNreSl9PC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0PjxzcGFuIGNsYXNzTmFtZT1cInRleHQtY2FwaXRhbGl6ZVwiPnt0aXRsZS5UaXRsZX08L3NwYW4+PC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD5BZjoge25hbWV9PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezJ9IGNsYXNzTmFtZT1cInRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuZGF0ZU1vZGlmaWVkVmlldyh0aXRsZSl9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17Mn0gY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aXRsZS5WaWV3ZWRCeS5sZW5ndGh9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17Mn0gY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPntsYXRlc3RDb21tZW50fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQnV0dG9uR3JvdXAsIEJ1dHRvbiB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuaW1wb3J0IHsgRm9ydW1UaXRsZSB9IGZyb20gJy4uL2ZvcnVtL0ZvcnVtVGl0bGUnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IGZldGNoVGhyZWFkcywgcG9zdFRocmVhZCwgc2V0U2VsZWN0ZWRUaHJlYWQgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2ZvcnVtJ1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSAnLi4vcGFnaW5hdGlvbi9QYWdpbmF0aW9uJ1xyXG5pbXBvcnQgeyBGb3J1bUZvcm0gfSBmcm9tICcuLi9mb3J1bS9Gb3J1bUZvcm0nXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGhyZWFkczogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8udGl0bGVzLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8udGFrZSxcclxuICAgICAgICBwYWdlOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby5wYWdlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRvdGFsUGFnZXMsXHJcbiAgICAgICAgZ2V0QXV0aG9yOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF07XHJcbiAgICAgICAgICAgIHJldHVybiBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgfSxcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZldGNoVGhyZWFkczogKHNraXAsIHRha2UpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hUaHJlYWRzKHNraXAsIHRha2UpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RUaHJlYWQ6IChjYiwgcG9zdCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0VGhyZWFkKGNiLCBwb3N0KSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRTZWxlY3RlZFRocmVhZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkVGhyZWFkKGlkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBGb3J1bUxpc3RDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbmV3UG9zdDogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJJbnVwbGFuIEZvcnVtXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgZmV0Y2hUaHJlYWRzLCBwYWdlLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBpZihwYWdlID09IHRvKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHRvIC0gMSkgKiB0YWtlO1xyXG4gICAgICAgIGZldGNoVGhyZWFkcyhza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHRocmVhZFZpZXdzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGhyZWFkcywgZ2V0QXV0aG9yLCBzZXRTZWxlY3RlZFRocmVhZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gdGhyZWFkcy5tYXAodGhyZWFkID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSBgdGhyZWFkXyR7dGhyZWFkLklEfWA7XHJcbiAgICAgICAgICAgIHJldHVybiA8Rm9ydW1UaXRsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17dGhyZWFkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2lkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRBdXRob3I9e2dldEF1dGhvcn0gLz5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdWJtaXQocG9zdCkge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdFRocmVhZCwgZmV0Y2hUaHJlYWRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHBvc3RUaHJlYWQoKCkgPT4gZmV0Y2hUaHJlYWRzKHNraXAsIHRha2UpLCBwb3N0KTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmV3UG9zdDogZmFsc2UgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmV3UG9zdDogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBwYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cInByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLnNob3cuYmluZCh0aGlzKX0+VGlsZiZvc2xhc2g7aiBueXQgaW5kbCZhZWxpZztnPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXsxMn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSb3cgY2xhc3NOYW1lPVwidGhyZWFkLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezF9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+SW5mbzwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXs1fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPk92ZXJza3JpZnQ8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17Mn0gY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkRhdG88L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17Mn0gY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkwmYWVsaWc7c3QgYWY8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17Mn0gY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPlNlbmVzdGUga29tbWVudGFyPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnRocmVhZFZpZXdzKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQYWdpbmF0aW9uIHRvdGFsUGFnZXM9e3RvdGFsUGFnZXN9IHBhZ2U9e3BhZ2V9IHBhZ2VIYW5kbGU9e3RoaXMucGFnZUhhbmRsZX0gc2hvdz17dHJ1ZX0vPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDxGb3J1bUZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdz17dGhpcy5zdGF0ZS5uZXdQb3N0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZT17dGhpcy5jbG9zZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5zdWJtaXQuYmluZCh0aGlzKX0gLz5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBGb3J1bUxpc3QgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShGb3J1bUxpc3RDb250YWluZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBGb3J1bUxpc3Q7XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTWVkaWEsIEdseXBoaWNvbiAgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50RGVsZXRlZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBsaWVzLCBjb25zdHJ1Y3QgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVwbHlOb2RlcyA9IHJlcGxpZXMubWFwKHJlcGx5ID0+IGNvbnN0cnVjdChyZXBseSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxNZWRpYT5cclxuICAgICAgICAgICAgICAgICAgICA8TWVkaWEuTGVmdCBzdHlsZT17eyBtaW5XaWR0aDogXCI3NHB4XCIgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8TWVkaWEuQm9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZCBjb21tZW50LWRlbGV0ZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxHbHlwaGljb24gZ2x5cGg9XCJyZW1vdmUtc2lnblwiIC8+IEtvbW1lbnRhciBzbGV0dGV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3JlcGx5Tm9kZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgPC9NZWRpYT5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudENvbnRyb2xzIH0gZnJvbSAnLi9Db21tZW50Q29udHJvbHMnXHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSAnLi9Db21tZW50UHJvZmlsZSdcclxuaW1wb3J0IHsgZm9ybWF0VGV4dCwgdGltZVRleHQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IE1lZGlhIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgYWdvKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdGVkT24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHRpbWVUZXh0KHBvc3RlZE9uKTtcclxuICAgIH1cclxuXHJcbiAgICBlZGl0ZWRWaWV3KGVkaXRlZCkge1xyXG4gICAgICAgIGlmKCFlZGl0ZWQpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiAgPHNwYW4+Kjwvc3Bhbj5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCBjb250ZXh0SWQsIG5hbWUsIHRleHQsIGNvbW1lbnRJZCwgcmVwbGllcywgY29uc3RydWN0LCBhdXRob3JJZCwgZWRpdGVkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQsIHJlcGx5Q29tbWVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHsgc2tpcCwgdGFrZSwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQsIHJlcGx5Q29tbWVudCB9O1xyXG4gICAgICAgIGNvbnN0IHR4dCA9IGZvcm1hdFRleHQodGV4dCk7XHJcbiAgICAgICAgY29uc3QgcmVwbHlOb2RlcyA9IHJlcGxpZXMubWFwKHJlcGx5ID0+IGNvbnN0cnVjdChyZXBseSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxNZWRpYT5cclxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFByb2ZpbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICA8TWVkaWEuQm9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cIm1lZGlhLWhlYWRpbmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e25hbWV9PC9zdHJvbmc+IDxzbWFsbD5zYWdkZSB7dGhpcy5hZ28oKX17dGhpcy5lZGl0ZWRWaWV3KGVkaXRlZCl9PC9zbWFsbD4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt0eHR9Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRDb250cm9sc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dElkPXtjb250ZXh0SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9ySWQ9e2F1dGhvcklkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudElkPXtjb21tZW50SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXt0ZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3JlcGx5Tm9kZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgPC9NZWRpYT5cclxuICAgIH1cclxufVxyXG5cclxuQ29tbWVudC5wcm9wVHlwZXMgPSB7XHJcbiAgICBjb250ZXh0SWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIHRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIGNvbW1lbnRJZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgcmVwbGllczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCksXHJcbiAgICBjb25zdHJ1Y3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG4gICAgYXV0aG9ySWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIGNhbkVkaXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBlZGl0ZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgc2tpcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcclxuICAgIHRha2U6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXHJcbiAgICBlZGl0Q29tbWVudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIGRlbGV0ZUNvbW1lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsIFxyXG4gICAgcmVwbHlDb21tZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50RGVsZXRlZCB9IGZyb20gJy4vQ29tbWVudERlbGV0ZWQnXHJcbmltcG9ydCB7IENvbW1lbnQgfSBmcm9tICcuL0NvbW1lbnQnXHJcbmltcG9ydCB7IE1lZGlhIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50TGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdENvbW1lbnQgPSB0aGlzLmNvbnN0cnVjdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByb290Q29tbWVudHMoY29tbWVudHMpIHtcclxuICAgICAgICBpZiAoIWNvbW1lbnRzKSByZXR1cm47XHJcblxyXG4gICAgICAgIHJldHVybiBjb21tZW50cy5tYXAoKGNvbW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuY29uc3RydWN0Q29tbWVudChjb21tZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuICA8TWVkaWEuTGlzdEl0ZW0ga2V5PXtcInJvb3RDb21tZW50X1wiICsgY29tbWVudC5Db21tZW50SUR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7bm9kZX1cclxuICAgICAgICAgICAgICAgICAgICA8L01lZGlhLkxpc3RJdGVtPlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdENvbW1lbnQoY29tbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IFwiY29tbWVudElkXCIgKyBjb21tZW50LkNvbW1lbnRJRDtcclxuXHJcbiAgICAgICAgaWYgKGNvbW1lbnQuRGVsZXRlZClcclxuICAgICAgICAgICAgcmV0dXJuICA8Q29tbWVudERlbGV0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtrZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdD17dGhpcy5jb25zdHJ1Y3RDb21tZW50fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBsaWVzPXtjb21tZW50LlJlcGxpZXN9IC8+XHJcblxyXG4gICAgICAgIGNvbnN0IHsgY29udGV4dElkLCBnZXROYW1lLCBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQsIHJlcGx5Q29tbWVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHsgc2tpcCwgdGFrZSwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQsIHJlcGx5Q29tbWVudCB9O1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBnZXROYW1lKGNvbW1lbnQuQXV0aG9ySUQpO1xyXG4gICAgICAgIHJldHVybiAgPENvbW1lbnRcclxuICAgICAgICAgICAgICAgICAgICBrZXk9e2tleX1cclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0SWQ9e2NvbnRleHRJZH1cclxuICAgICAgICAgICAgICAgICAgICBuYW1lPXtuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIHBvc3RlZE9uPXtjb21tZW50LlBvc3RlZE9ufVxyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcklkPXtjb21tZW50LkF1dGhvcklEfVxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ9e2NvbW1lbnQuVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3Q9e3RoaXMuY29uc3RydWN0Q29tbWVudH1cclxuICAgICAgICAgICAgICAgICAgICByZXBsaWVzPXtjb21tZW50LlJlcGxpZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdGVkPXtjb21tZW50LkVkaXRlZH1cclxuICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnRJZD17Y29tbWVudC5Db21tZW50SUR9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLnJvb3RDb21tZW50cyhjb21tZW50cyk7XHJcblxyXG4gICAgICAgIHJldHVybiAgPE1lZGlhLkxpc3Q+XHJcbiAgICAgICAgICAgICAgICAgICAge25vZGVzfVxyXG4gICAgICAgICAgICAgICAgPC9NZWRpYS5MaXN0PlxyXG4gICAgfVxyXG59XHJcblxyXG5Db21tZW50TGlzdC5wcm9wVHlwZXMgPSB7XHJcbiAgICBjb21tZW50czogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCksXHJcbiAgICBjb250ZXh0SWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXHJcbiAgICBnZXROYW1lOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuICAgIGNhbkVkaXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG4gICAgc2tpcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcclxuICAgIHRha2U6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXHJcbiAgICBlZGl0Q29tbWVudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIGRlbGV0ZUNvbW1lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsIFxyXG4gICAgcmVwbHlDb21tZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Rm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBUZXh0OiAnJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucG9zdENvbW1lbnQgPSB0aGlzLnBvc3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdENvbW1lbnQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyBwb3N0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHBvc3RIYW5kbGUodGhpcy5zdGF0ZS5UZXh0KTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGV4dDogJycgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPGZvcm0gb25TdWJtaXQ9e3RoaXMucG9zdENvbW1lbnR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicmVtYXJrXCI+S29tbWVudGFyPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVGV4dENoYW5nZX0gdmFsdWU9e3RoaXMuc3RhdGUuVGV4dH0gcGxhY2Vob2xkZXI9XCJTa3JpdiBrb21tZW50YXIgaGVyLi4uXCIgaWQ9XCJyZW1hcmtcIiByb3dzPVwiNFwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+U2VuZDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgfVxyXG59XHJcblxyXG5Db21tZW50Rm9ybS5wcm9wVHlwZXMgPSB7XHJcbiAgICBwb3N0SGFuZGxlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXHJcbn1cclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50TGlzdCB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRMaXN0J1xyXG5pbXBvcnQgeyBDb21tZW50Rm9ybSB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRGb3JtJ1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSAnLi4vcGFnaW5hdGlvbi9QYWdpbmF0aW9uJ1xyXG5pbXBvcnQgeyBmZXRjaENvbW1lbnRzLCBwb3N0Q29tbWVudCwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2NvbW1lbnRzJ1xyXG5pbXBvcnQgeyBnZXRGb3J1bUNvbW1lbnRzRGVsZXRlVXJsLCBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb21tZW50czogc3RhdGUuY29tbWVudHNJbmZvLmNvbW1lbnRzLFxyXG4gICAgICAgIGdldE5hbWU6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW2lkXTtcclxuICAgICAgICAgICAgaWYoIXVzZXIpIHJldHVybiAnJztcclxuICAgICAgICAgICAgcmV0dXJuIGAke3VzZXIuRmlyc3ROYW1lfSAke3VzZXIuTGFzdE5hbWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbkVkaXQ6IChpZCkgPT4gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQgPT0gaWQsXHJcbiAgICAgICAgcG9zdElkOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby5zZWxlY3RlZFRocmVhZCxcclxuICAgICAgICBwYWdlOiBzdGF0ZS5jb21tZW50c0luZm8ucGFnZSxcclxuICAgICAgICBza2lwOiBzdGF0ZS5jb21tZW50c0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5jb21tZW50c0luZm8udGFrZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS5jb21tZW50c0luZm8udG90YWxQYWdlcyxcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGVkaXRIYW5kbGU6IChjb21tZW50SWQsIHBvc3RJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGVkaXRDb21tZW50KHVybCwgY29tbWVudElkLCB0ZXh0LCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlOiAoY29tbWVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRGb3J1bUNvbW1lbnRzRGVsZXRlVXJsKGNvbW1lbnRJZCk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUNvbW1lbnQodXJsLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVwbHlIYW5kbGU6IChwb3N0SWQsIHRleHQsIHBhcmVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuZm9ydW1jb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBwb3N0SWQsIHRleHQsIHBhcmVudElkLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9hZENvbW1lbnRzOiAocG9zdElkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEZvcnVtQ29tbWVudHNQYWdlVXJsKHBvc3RJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0SGFuZGxlOiAocG9zdElkLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuZm9ydW1jb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBwb3N0SWQsIHRleHQsIG51bGwsIGNiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBGb3J1bUNvbW1lbnRzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29tbWVudCA9IHRoaXMuZGVsZXRlQ29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZWRpdENvbW1lbnQgPSB0aGlzLmVkaXRDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZXBseUNvbW1lbnQgPSB0aGlzLnJlcGx5Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucG9zdENvbW1lbnQgPSB0aGlzLnBvc3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5wYWdlSGFuZGxlID0gdGhpcy5wYWdlSGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgcG9zdElkLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcGFnZSB9ID0gbmV4dFByb3BzLmxvY2F0aW9uLnF1ZXJ5O1xyXG4gICAgICAgIGlmKCFOdW1iZXIocGFnZSkpIHJldHVybjtcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSBwYWdlIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKHBvc3RJZCwgc2tpcEl0ZW1zLCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICBwYWdlSGFuZGxlKHRvKSB7XHJcbiAgICAgICAgY29uc3QgeyBwb3N0SWQsIHBhZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuICAgICAgICBpZihwYWdlID09IHRvKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdXJsID0gYC9mb3J1bS9wb3N0LyR7cG9zdElkfS9jb21tZW50cz9wYWdlPSR7dG99YDtcclxuICAgICAgICBwdXNoKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQ29tbWVudChjb21tZW50SWQsIHBvc3RJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVsZXRlSGFuZGxlLCBsb2FkQ29tbWVudHMsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlKGNvbW1lbnRJZCwgY2IpO1xyXG4gICAgfVxyXG5cclxuICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgcG9zdElkLCB0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0SGFuZGxlLCBsb2FkQ29tbWVudHMsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWRpdEhhbmRsZShjb21tZW50SWQsIHBvc3RJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGx5Q29tbWVudChwb3N0SWQsIHRleHQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSwgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcGx5SGFuZGxlKHBvc3RJZCwgdGV4dCwgcGFyZW50SWQsIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0Q29tbWVudCh0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIHBvc3RJZCwgc2tpcCwgdGFrZSwgcG9zdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKHBvc3RJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwb3N0SGFuZGxlKHBvc3RJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRzLCBnZXROYW1lLCBjYW5FZGl0LCB0b3RhbFBhZ2VzLCBwYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgcHJvcHMgPSB7IHNraXAsIHRha2UgfTtcclxuICAgICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHByb3BzLCB7XHJcbiAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQ6IHRoaXMuZGVsZXRlQ29tbWVudCxcclxuICAgICAgICAgICAgZWRpdENvbW1lbnQ6IHRoaXMuZWRpdENvbW1lbnQsXHJcbiAgICAgICAgICAgIHJlcGx5Q29tbWVudDogdGhpcy5yZXBseUNvbW1lbnRcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gIDxSb3cgY2xhc3NOYW1lPVwiZm9ydW0tY29tbWVudHMtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJmb3J1bS1jb21tZW50cy1oZWFkaW5nXCI+S29tbWVudGFyZXI8L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50TGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50cz17Y29tbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRJZD17TnVtYmVyKGlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TmFtZT17Z2V0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHNcclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxQYWdpbmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM9e3RvdGFsUGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U9e3BhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VIYW5kbGU9e3RoaXMucGFnZUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezEyfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRGb3JtIHBvc3RIYW5kbGU9e3RoaXMucG9zdENvbW1lbnR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgRm9ydW1Db21tZW50c0NvbnRhaW5lclJlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRm9ydW1Db21tZW50c0NvbnRhaW5lcik7XHJcbmNvbnN0IEZvcnVtQ29tbWVudHMgPSB3aXRoUm91dGVyKEZvcnVtQ29tbWVudHNDb250YWluZXJSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IEZvcnVtQ29tbWVudHM7XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgUm93LCBDb2wsIFBhbmVsIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGZpcnN0TmFtZSwgbGFzdE5hbWUsIGVtYWlsIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGVtYWlsTGluayA9IFwibWFpbHRvOlwiICsgZW1haWw7XHJcbiAgICAgICAgY29uc3QgZ2FsbGVyeSA9IFwiL1wiICsgdXNlcm5hbWUgKyBcIi9nYWxsZXJ5XCI7XHJcblxyXG4gICAgICAgIHJldHVybiAgPENvbCBsZz17M30+XHJcbiAgICAgICAgICAgICAgICAgICAgPFBhbmVsIGhlYWRlcj17YCR7Zmlyc3ROYW1lfSAke2xhc3ROYW1lfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VXNlckl0ZW0gdGl0bGU9XCJCcnVnZXJuYXZuXCI+e3VzZXJuYW1lfTwvVXNlckl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VySXRlbSB0aXRsZT1cIkVtYWlsXCI+PGEgaHJlZj17ZW1haWxMaW5rfT57ZW1haWx9PC9hPjwvVXNlckl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VySXRlbSB0aXRsZT1cIkJpbGxlZGVyXCI+PExpbmsgdG89e2dhbGxlcnl9PkJpbGxlZGVyPC9MaW5rPjwvVXNlckl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9QYW5lbD5cclxuICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBVc2VySGVhZGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8Q29sIGxnPXs2fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPnt0aGlzLnByb3BzLmNoaWxkcmVufTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxDb2wgbGc9ezZ9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8VXNlckhlYWRpbmc+e3RpdGxlfTwvVXNlckhlYWRpbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPFVzZXJCb2R5Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvVXNlckJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi9Vc2VyJ1xyXG5pbXBvcnQgeyBSb3cgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgdXNlck5vZGVzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VySWQgPSBgdXNlcklkXyR7dXNlci5JRH1gO1xyXG4gICAgICAgICAgICByZXR1cm4gIDxVc2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXIuVXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkPXt1c2VyLklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZT17dXNlci5GaXJzdE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU9e3VzZXIuTGFzdE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw9e3VzZXIuRW1haWx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZVVybD17dXNlci5Qcm9maWxlSW1hZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM9e3VzZXIuUm9sZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXt1c2VySWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMudXNlck5vZGVzKCl9XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmV4cG9ydCBjbGFzcyBCcmVhZGNydW1iIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxvbCBjbGFzc05hbWU9XCJicmVhZGNydW1iXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICA8L29sPlxyXG4gICAgfVxyXG59XHJcblxyXG5CcmVhZGNydW1iLkl0ZW0gPSBjbGFzcyBJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGhyZWYsIGFjdGl2ZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZihhY3RpdmUpIHJldHVybiAgIDxsaSBjbGFzc05hbWU9XCJhY3RpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgIHJldHVybiAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtocmVmfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuXHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgZmV0Y2hVc2VycyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvdXNlcnMnXHJcbmltcG9ydCB7IFVzZXJMaXN0IH0gZnJvbSAnLi4vdXNlcnMvVXNlckxpc3QnXHJcbmltcG9ydCB7IFJvdywgQ29sLCBQYWdlSGVhZGVyIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5pbXBvcnQgeyBCcmVhZGNydW1iIH0gZnJvbSAnLi4vYnJlYWRjcnVtYnMvQnJlYWRjcnVtYidcclxuaW1wb3J0IHsgdmFsdWVzIH0gZnJvbSAndW5kZXJzY29yZSdcclxuXHJcbmNvbnN0IG1hcFVzZXJzVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2VyczogdmFsdWVzKHN0YXRlLnVzZXJzSW5mby51c2VycylcclxuICAgIH07XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRVc2VyczogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFVzZXJzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJCcnVnZXJlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCcmVhZGNydW1iPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCcmVhZGNydW1iLkl0ZW0gaHJlZj1cIi9cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRm9yc2lkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnJlYWRjcnVtYi5JdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCcmVhZGNydW1iLkl0ZW0gYWN0aXZlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCcnVnZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CcmVhZGNydW1iLkl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JyZWFkY3J1bWI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFBhZ2VIZWFkZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnVwbGFuJ3MgPHNtYWxsPmJydWdlcmU8L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1BhZ2VIZWFkZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VXNlckxpc3QgdXNlcnM9e3VzZXJzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBVc2VycyA9IGNvbm5lY3QobWFwVXNlcnNUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFVzZXJzQ29udGFpbmVyKVxyXG5leHBvcnQgZGVmYXVsdCBVc2VycyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgUm93LCBDb2wsIEltYWdlIGFzIEltYWdlQnMgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEhhbmRsZXIgPSB0aGlzLmNoZWNrYm94SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrYm94SGFuZGxlcihlKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBhZGQgPSBlLmN1cnJlbnRUYXJnZXQuY2hlY2tlZDtcclxuICAgICAgICBpZihhZGQpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbW1lbnRJY29uKGNvdW50KSB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBjb3VudCA9PSAwID8gXCJjb2wtbGctNiB0ZXh0LW11dGVkXCIgOiBcImNvbC1sZy02IHRleHQtcHJpbWFyeVwiO1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0ge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IHN0eWxlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8ZGl2IHsuLi4gcHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tY29tbWVudFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4ge2NvdW50fVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tib3hWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkLCBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjaGVja2VkID0gaW1hZ2VJc1NlbGVjdGVkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIHJldHVybiAoY2FuRWRpdCA/XHJcbiAgICAgICAgICAgIDxDb2wgbGc9ezZ9IGNsYXNzTmFtZT1cInB1bGwtcmlnaHQgdGV4dC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIFNsZXQgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uQ2xpY2s9e3RoaXMuY2hlY2tib3hIYW5kbGVyfSBjaGVja2VkPXtjaGVja2VkfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG5yZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IGltYWdlLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgIGxldCBjb3VudCA9IGltYWdlLkNvbW1lbnRDb3VudDtcclxuICAgIGNvbnN0IHVybCA9IGAvJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlLkltYWdlSUR9L2NvbW1lbnRzYDtcclxuICAgIHJldHVybiAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPXt1cmx9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbWFnZUJzIHNyYz17aW1hZ2UuUHJldmlld1VybH0gdGh1bWJuYWlsIC8+XHJcbiAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXt1cmx9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5jb21tZW50SWNvbihjb3VudCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLmNoZWNrYm94VmlldygpfVxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tICcuL0ltYWdlJ1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmNvbnN0IGVsZW1lbnRzUGVyUm93ID0gNDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltYWdlTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBhcnJhbmdlQXJyYXkoaW1hZ2VzKSB7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gaW1hZ2VzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCB0aW1lcyA9IE1hdGguY2VpbChsZW5ndGggLyBlbGVtZW50c1BlclJvdyk7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICBsZXQgc3RhcnQgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkrKykge1xyXG4gICAgICAgICAgICBzdGFydCA9IGkgKiBlbGVtZW50c1BlclJvdztcclxuICAgICAgICAgICAgY29uc3QgZW5kID0gc3RhcnQgKyBlbGVtZW50c1BlclJvdztcclxuICAgICAgICAgICAgY29uc3QgbGFzdCA9IGVuZCA+IGxlbmd0aDtcclxuICAgICAgICAgICAgaWYobGFzdCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gaW1hZ2VzLnNsaWNlKHN0YXJ0KTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBpbWFnZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGltYWdlc1ZpZXcoaW1hZ2VzKSB7XHJcbiAgICAgICAgaWYoaW1hZ2VzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCB7IGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBkZWxldGVTZWxlY3RlZEltYWdlcywgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFycmFuZ2VBcnJheShpbWFnZXMpO1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSByZXN1bHQubWFwKChyb3csIGkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW1ncyA9IHJvdy5tYXAoKGltZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICA8Q29sIGxnPXszfSBrZXk9e2ltZy5JbWFnZUlEfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlPXtpbWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ9e2FkZFNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQ9e3JlbW92ZVNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlzU2VsZWN0ZWQ9e2ltYWdlSXNTZWxlY3RlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByb3dJZCA9IFwicm93SWRcIiArIGk7XHJcbiAgICAgICAgICAgIHJldHVybiAgPFJvdyBrZXk9e3Jvd0lkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2ltZ3N9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aWV3O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLmltYWdlc1ZpZXcoaW1hZ2VzKX1cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSwgYWRkU2VsZWN0ZWRJbWFnZUlkLCAgZGVsZXRlSW1hZ2VzLCByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcywgZmV0Y2hVc2VySW1hZ2VzIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9pbWFnZXMnXHJcbmltcG9ydCB7IEVycm9yIH0gZnJvbSAnLi9FcnJvcidcclxuaW1wb3J0IHsgSW1hZ2VVcGxvYWQgfSBmcm9tICcuLi9pbWFnZXMvSW1hZ2VVcGxvYWQnXHJcbmltcG9ydCBJbWFnZUxpc3QgZnJvbSAnLi4vaW1hZ2VzL0ltYWdlTGlzdCdcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IFJvdywgQ29sLCBCdXR0b24gfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IEJyZWFkY3J1bWIgfSBmcm9tICcuLi9icmVhZGNydW1icy9CcmVhZGNydW1iJ1xyXG5pbXBvcnQgeyB2YWx1ZXMsIHNvcnRCeSB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCBVc2VkU3BhY2UgZnJvbSAnLi9Vc2VkU3BhY2UnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgb3duZXJJZCB9ID0gc3RhdGUuaW1hZ2VzSW5mbztcclxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkO1xyXG4gICAgY29uc3QgY2FuRWRpdCA9IChvd25lcklkID4gMCAmJiBjdXJyZW50SWQgPiAwICYmIG93bmVySWQgPT0gY3VycmVudElkKTtcclxuICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnNbb3duZXJJZF07XHJcbiAgICBjb25zdCBmdWxsTmFtZSA9IHVzZXIgPyBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWAgOiAnJztcclxuICAgIGNvbnN0IGltYWdlcyA9IHNvcnRCeSh2YWx1ZXMoc3RhdGUuaW1hZ2VzSW5mby5pbWFnZXMpLCAoaW1nKSA9PiAtaW1nLkltYWdlSUQpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW1hZ2VzOiBpbWFnZXMsXHJcbiAgICAgICAgY2FuRWRpdDogY2FuRWRpdCxcclxuICAgICAgICBzZWxlY3RlZEltYWdlSWRzOiBzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZHMsXHJcbiAgICAgICAgZnVsbE5hbWU6IGZ1bGxOYW1lLFxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBsb2FkSW1hZ2U6ICh1c2VybmFtZSwgZm9ybURhdGEpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2godXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhLCAoKSA9PiB7IGRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpOyB9LCAoKSA9PiB7IH0pKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEltYWdlcyB0byBiZSBkZWxldGVkIGJ5IHNlbGVjdGlvbjpcclxuICAgICAgICAgICAgZGlzcGF0Y2goYWRkU2VsZWN0ZWRJbWFnZUlkKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBJbWFnZXMgdG8gYmUgZGVsZXRlZCBieSBzZWxlY3Rpb246XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlbW92ZVNlbGVjdGVkSW1hZ2VJZChpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2VzOiAodXNlcm5hbWUsIGlkcykgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVJbWFnZXModXNlcm5hbWUsIGlkcykpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYXJTZWxlY3RlZEltYWdlSWRzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJJbWFnZXNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZUlzU2VsZWN0ZWQgPSB0aGlzLmltYWdlSXNTZWxlY3RlZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMgPSB0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGVkID0gdGhpcy5jbGVhclNlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyByb3V0ZXIsIHJvdXRlIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IHVzZXJuYW1lICsgXCIncyBiaWxsZWRlclwiO1xyXG4gICAgICAgIHJvdXRlci5zZXRSb3V0ZUxlYXZlSG9vayhyb3V0ZSwgdGhpcy5jbGVhclNlbGVjdGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNlbGVjdGVkKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xlYXJTZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGltYWdlSXNTZWxlY3RlZChjaGVja0lkKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGZpbmQoc2VsZWN0ZWRJbWFnZUlkcywgKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZCA9PSBjaGVja0lkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlU2VsZWN0ZWRJbWFnZXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZEltYWdlSWRzLCBkZWxldGVJbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBzZWxlY3RlZEltYWdlSWRzKTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0ZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGxvYWRWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgdXBsb2FkSW1hZ2UsIHNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgaGFzSW1hZ2VzID0gc2VsZWN0ZWRJbWFnZUlkcy5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgICBpZighY2FuRWRpdCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXs0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlVXBsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZT17dXBsb2FkSW1hZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsnXFx1MDBBMCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBic1N0eWxlPVwiZGFuZ2VyXCIgZGlzYWJsZWQ9eyFoYXNJbWFnZXN9IG9uQ2xpY2s9e3RoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXN9PlNsZXQgbWFya2VyZXQgYmlsbGVkZXI8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9JbWFnZVVwbG9hZD5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG5cclxuICAgIHVwbG9hZExpbWl0VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIHVwbG9hZEltYWdlLCBzZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmKCFjYW5FZGl0KSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFVzZWRTcGFjZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VzLCBmdWxsTmFtZSwgY2FuRWRpdCwgYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsyfSBsZz17OH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnJlYWRjcnVtYj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnJlYWRjcnVtYi5JdGVtIGhyZWY9XCIvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZvcnNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JyZWFkY3J1bWIuSXRlbT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnJlYWRjcnVtYi5JdGVtIGFjdGl2ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3VzZXJuYW1lfSdzIGJpbGxlZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CcmVhZGNydW1iLkl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JyZWFkY3J1bWI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT48c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWNhcGl0YWxpemVcIj57ZnVsbE5hbWV9PC9zcGFuPidzIDxzbWFsbD5iaWxsZWRlIGdhbGxlcmk8L3NtYWxsPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbWFnZUxpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZXM9e2ltYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZD17YWRkU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZD17cmVtb3ZlU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSXNTZWxlY3RlZD17dGhpcy5pbWFnZUlzU2VsZWN0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnVwbG9hZFZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMudXBsb2FkTGltaXRWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVXNlckltYWdlc1JlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlckltYWdlc0NvbnRhaW5lcik7XHJcbmNvbnN0IFVzZXJJbWFnZXMgPSB3aXRoUm91dGVyKFVzZXJJbWFnZXNSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJJbWFnZXM7XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcclxuaW1wb3J0IHsgc2V0U2VsZWN0ZWRJbWcsIGZldGNoU2luZ2xlSW1hZ2UsIGRlbGV0ZUltYWdlIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9pbWFnZXMnXHJcbmltcG9ydCB7IHNldFNraXBDb21tZW50cywgc2V0VGFrZUNvbW1lbnRzLCBzZXRGb2N1c2VkQ29tbWVudCwgcmVjZWl2ZWRDb21tZW50cyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvY29tbWVudHMnXHJcbmltcG9ydCB7IHNldEVycm9yIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgTW9kYWwsIEltYWdlLCBCdXR0b24sIEJ1dHRvblRvb2xiYXIsIEdseXBoaWNvbiwgR3JpZCwgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IG93bmVySWQgID0gc3RhdGUuaW1hZ2VzSW5mby5vd25lcklkO1xyXG4gICAgY29uc3QgY3VycmVudElkID0gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQ7XHJcbiAgICBjb25zdCBjYW5FZGl0ID0gKG93bmVySWQgPiAwICYmIGN1cnJlbnRJZCA+IDAgJiYgb3duZXJJZCA9PSBjdXJyZW50SWQpO1xyXG5cclxuICAgIGNvbnN0IGdldEltYWdlID0gKGlkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZpbmQoc3RhdGUuaW1hZ2VzSW5mby5pbWFnZXMsIGltYWdlID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGltYWdlLkltYWdlSUQgPT0gaWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGltYWdlID0gKCkgPT4gZ2V0SW1hZ2Uoc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWQpO1xyXG4gICAgY29uc3QgZmlsZW5hbWUgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLkZpbGVuYW1lOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCBwcmV2aWV3VXJsID0gKCkgPT4geyBpZihpbWFnZSgpKSByZXR1cm4gaW1hZ2UoKS5QcmV2aWV3VXJsOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCBleHRlbnNpb24gPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLkV4dGVuc2lvbjsgcmV0dXJuICcnOyB9O1xyXG4gICAgY29uc3Qgb3JpZ2luYWxVcmwgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLk9yaWdpbmFsVXJsOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCB1cGxvYWRlZCA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuVXBsb2FkZWQ7IHJldHVybiBuZXcgRGF0ZSgpOyB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2FuRWRpdDogY2FuRWRpdCxcclxuICAgICAgICBoYXNJbWFnZTogKCkgPT4gQm9vbGVhbihnZXRJbWFnZShzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCkpLFxyXG4gICAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZSgpLFxyXG4gICAgICAgIHByZXZpZXdVcmw6IHByZXZpZXdVcmwoKSxcclxuICAgICAgICBleHRlbnNpb246IGV4dGVuc2lvbigpLFxyXG4gICAgICAgIG9yaWdpbmFsVXJsOiBvcmlnaW5hbFVybCgpLFxyXG4gICAgICAgIHVwbG9hZGVkOiB1cGxvYWRlZCgpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXRTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTZWxlY3RlZEltZyhpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzZWxlY3RJbWFnZTogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTZWxlY3RlZEltZyh1bmRlZmluZWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldEVycm9yOiAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IoZXJyb3IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoSW1hZ2U6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFNpbmdsZUltYWdlKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJbWFnZTogKGlkLCB1c2VybmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVJbWFnZShpZCwgdXNlcm5hbWUpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc2V0Q29tbWVudHM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2tpcENvbW1lbnRzKDApKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZUNvbW1lbnRzKDEwKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEZvY3VzZWRDb21tZW50KC0xKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVkQ29tbWVudHMoW10pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1vZGFsSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVJbWFnZUhhbmRsZXIgPSB0aGlzLmRlbGV0ZUltYWdlSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5zZWVBbGxDb21tZW50c1ZpZXcgPSB0aGlzLnNlZUFsbENvbW1lbnRzVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVsb2FkID0gdGhpcy5yZWxvYWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlc2VsZWN0SW1hZ2UsIHJlc2V0Q29tbWVudHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuXHJcbiAgICAgICAgZGVzZWxlY3RJbWFnZSgpO1xyXG4gICAgICAgIGNvbnN0IGdhbGxlcnlVcmwgPSBgLyR7dXNlcm5hbWV9L2dhbGxlcnlgO1xyXG4gICAgICAgIHJlc2V0Q29tbWVudHMoKTtcclxuICAgICAgICBwdXNoKGdhbGxlcnlVcmwpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUltYWdlSGFuZGxlcigpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUltYWdlLCBzZXRTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBpZCwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG5cclxuICAgICAgICBkZWxldGVJbWFnZShpZCwgdXNlcm5hbWUpO1xyXG4gICAgICAgIHNldFNlbGVjdGVkSW1hZ2VJZCgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSW1hZ2VWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZighY2FuRWRpdCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIDxCdXR0b24gYnNTdHlsZT1cImRhbmdlclwiIG9uQ2xpY2s9e3RoaXMuZGVsZXRlSW1hZ2VIYW5kbGVyfT5TbGV0IGJpbGxlZGU8L0J1dHRvbj47XHJcbiAgICB9XHJcblxyXG4gICAgcmVsb2FkKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG5cclxuICAgICAgICBjb25zdCBwYXRoID0gYC8ke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aWR9L2NvbW1lbnRzYDtcclxuICAgICAgICBwdXNoKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlZUFsbENvbW1lbnRzVmlldygpIHtcclxuICAgICAgICBjb25zdCBzaG93ID0gIUJvb2xlYW4odGhpcy5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICAgICAgaWYoIXNob3cpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxwIGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXt0aGlzLnJlbG9hZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxHbHlwaGljb24gZ2x5cGg9XCJyZWZyZXNoXCIvPiBTZSBhbGxlIGtvbW1lbnRhcmVyP1xyXG4gICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGZpbGVuYW1lLCBwcmV2aWV3VXJsLCBleHRlbnNpb24sIG9yaWdpbmFsVXJsLCB1cGxvYWRlZCwgaGFzSW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgc2hvdyA9IGhhc0ltYWdlKCk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGZpbGVuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICAgICAgY29uc3QgdXBsb2FkRGF0ZSA9IG1vbWVudCh1cGxvYWRlZCk7XHJcbiAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IFwiVXBsb2FkZWQgZC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcblxyXG4gICAgICAgIHJldHVybiAgPE1vZGFsIHNob3c9e3Nob3d9IG9uSGlkZT17dGhpcy5jbG9zZX0gYnNTaXplPVwibGFyZ2VcIiBhbmltYXRpb249e3RydWV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxNb2RhbC5IZWFkZXIgY2xvc2VCdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbC5UaXRsZT57bmFtZX08c3Bhbj48c21hbGw+IC0ge2RhdGVTdHJpbmd9PC9zbWFsbD48L3NwYW4+PC9Nb2RhbC5UaXRsZT5cclxuICAgICAgICAgICAgICAgICAgICA8L01vZGFsLkhlYWRlcj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPE1vZGFsLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e29yaWdpbmFsVXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlIHNyYz17cHJldmlld1VybH0gcmVzcG9uc2l2ZSBjbGFzc05hbWU9XCJjZW50ZXItYmxvY2tcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L01vZGFsLkJvZHk+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxNb2RhbC5Gb290ZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnNlZUFsbENvbW1lbnRzVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Ub29sYmFyIHN0eWxlPXt7ZmxvYXQ6IFwicmlnaHRcIn19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZGVsZXRlSW1hZ2VWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e3RoaXMuY2xvc2V9Pkx1azwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvblRvb2xiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5Gb290ZXI+XHJcbiAgICAgICAgICAgICAgICA8L01vZGFsPlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBTZWxlY3RlZEltYWdlUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShNb2RhbEltYWdlKTtcclxuY29uc3QgU2VsZWN0ZWRJbWFnZSA9IHdpdGhSb3V0ZXIoU2VsZWN0ZWRJbWFnZVJlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0ZWRJbWFnZTtcclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBmZXRjaENvbW1lbnRzLCBwb3N0Q29tbWVudCwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2NvbW1lbnRzJ1xyXG5pbXBvcnQgeyBpbmNyZW1lbnRDb21tZW50Q291bnQsIGRlY3JlbWVudENvbW1lbnRDb3VudCB9IGZyb20gJy4uLy4uL2FjdGlvbnMvaW1hZ2VzJ1xyXG5pbXBvcnQgeyBDb21tZW50TGlzdCB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRMaXN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IFBhZ2luYXRpb24gfSBmcm9tICcuLi9wYWdpbmF0aW9uL1BhZ2luYXRpb24nXHJcbmltcG9ydCB7IENvbW1lbnRGb3JtIH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudEZvcm0nXHJcbmltcG9ydCB7IGdldEltYWdlQ29tbWVudHNQYWdlVXJsLCBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09IGlkLFxyXG4gICAgICAgIGltYWdlSWQ6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmNvbW1lbnRzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmNvbW1lbnRzSW5mby50YWtlLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLmNvbW1lbnRzSW5mby5wYWdlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLmNvbW1lbnRzSW5mby50b3RhbFBhZ2VzLFxyXG4gICAgICAgIGNvbW1lbnRzOiBzdGF0ZS5jb21tZW50c0luZm8uY29tbWVudHMsXHJcbiAgICAgICAgZ2V0TmFtZTogKHVzZXJJZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW3VzZXJJZF07XHJcbiAgICAgICAgICAgIGNvbnN0IHsgRmlyc3ROYW1lLCBMYXN0TmFtZSB9ID0gdXNlcjtcclxuICAgICAgICAgICAgcmV0dXJuIGAke0ZpcnN0TmFtZX0gJHtMYXN0TmFtZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3duZXI6IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tzdGF0ZS5pbWFnZXNJbmZvLm93bmVySWRdXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwb3N0SGFuZGxlOiAoaW1hZ2VJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgaW1hZ2VJZCwgdGV4dCwgbnVsbCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoQ29tbWVudHM6IChpbWFnZUlkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNQYWdlVXJsKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZWRpdEhhbmRsZTogKGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGVkaXRDb21tZW50KHVybCwgY29tbWVudElkLCB0ZXh0LCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlOiAoY29tbWVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsKGNvbW1lbnRJZCk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUNvbW1lbnQodXJsLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVwbHlIYW5kbGU6IChpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbmNyZW1lbnRDb3VudDogKGltYWdlSWQpID0+IGRpc3BhdGNoKGluY3JlbWVudENvbW1lbnRDb3VudChpbWFnZUlkKSksXHJcbiAgICAgICAgZGVjcmVtZW50Q291bnQ6IChpbWFnZUlkKSA9PiBkaXNwYXRjaChkZWNyZW1lbnRDb21tZW50Q291bnQoaW1hZ2VJZCkpLFxyXG4gICAgICAgIGxvYWRDb21tZW50czogKGltYWdlSWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VDb21tZW50c1BhZ2VVcmwoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDb21tZW50c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnBhZ2VIYW5kbGUgPSB0aGlzLnBhZ2VIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQgPSB0aGlzLmRlbGV0ZUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmVkaXRDb21tZW50ID0gdGhpcy5lZGl0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlDb21tZW50ID0gdGhpcy5yZXBseUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnBvc3RDb21tZW50ID0gdGhpcy5wb3N0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgeyBmZXRjaENvbW1lbnRzLCBpbWFnZUlkLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcGFnZSB9ID0gbmV4dFByb3BzLmxvY2F0aW9uLnF1ZXJ5O1xyXG4gICAgICAgIGlmKCFOdW1iZXIocGFnZSkpIHJldHVybjtcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSBwYWdlIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhZ2VIYW5kbGUodG8pIHtcclxuICAgICAgICBjb25zdCB7IG93bmVyLCBpbWFnZUlkLCBwYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWUgPSBvd25lci5Vc2VybmFtZTtcclxuICAgICAgICBpZihwYWdlID09IHRvKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdXJsID0gYC8ke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2VJZH0vY29tbWVudHM/cGFnZT0ke3RvfWA7XHJcbiAgICAgICAgcHVzaCh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVIYW5kbGUsIGxvYWRDb21tZW50cywgZGVjcmVtZW50Q291bnQsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRlY3JlbWVudENvdW50KGltYWdlSWQpO1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWxldGVIYW5kbGUoY29tbWVudElkLCBjYik7XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdENvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkLCB0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIHNraXAsIHRha2UsIGVkaXRIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgZWRpdEhhbmRsZShjb21tZW50SWQsIGltYWdlSWQsIHRleHQsIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXBseUNvbW1lbnQoaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW5jcmVtZW50Q291bnQsIHNraXAsIHRha2UsIHJlcGx5SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpbmNyZW1lbnRDb3VudChpbWFnZUlkKTtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVwbHlIYW5kbGUoaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQsIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0Q29tbWVudCh0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCBsb2FkQ29tbWVudHMsIGluY3JlbWVudENvdW50LCBza2lwLCB0YWtlLCBwb3N0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpbmNyZW1lbnRDb3VudChpbWFnZUlkKTtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcG9zdEhhbmRsZShpbWFnZUlkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgY29tbWVudHMsIGdldE5hbWUsIGltYWdlSWQsIHBhZ2UsIHRvdGFsUGFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGxldCBwcm9wcyA9IHsgc2tpcCwgdGFrZSB9O1xyXG4gICAgICAgIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMsIHtcclxuICAgICAgICAgICAgZGVsZXRlQ29tbWVudDogdGhpcy5kZWxldGVDb21tZW50LFxyXG4gICAgICAgICAgICBlZGl0Q29tbWVudDogdGhpcy5lZGl0Q29tbWVudCxcclxuICAgICAgICAgICAgcmVwbHlDb21tZW50OiB0aGlzLnJlcGx5Q29tbWVudFxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezF9IGxnPXsxMX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudExpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0SWQ9e2ltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudHM9e2NvbW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldE5hbWU9e2dldE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17MX0gbGc9ezEwfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxQYWdpbmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlcz17dG90YWxQYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlPXtwYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VIYW5kbGU9e3RoaXMucGFnZUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezF9IGxnPXsxMH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudEZvcm0gcG9zdEhhbmRsZT17dGhpcy5wb3N0Q29tbWVudH0vPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBDb21tZW50c1JlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoQ29tbWVudHNDb250YWluZXIpO1xyXG5jb25zdCBJbWFnZUNvbW1lbnRzID0gd2l0aFJvdXRlcihDb21tZW50c1JlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgSW1hZ2VDb21tZW50cztcclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50IH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBXZWxsLCBCdXR0b24sIEdseXBoaWNvbiB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IGZldGNoQW5kRm9jdXNTaW5nbGVDb21tZW50LCBwb3N0Q29tbWVudCwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2NvbW1lbnRzJ1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBvYmpNYXAsIGdldEltYWdlQ29tbWVudHNQYWdlVXJsLCBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IGNvbW1lbnRzLCBmb2N1c2VkQ29tbWVudCB9ID0gc3RhdGUuY29tbWVudHNJbmZvO1xyXG4gICAgY29uc3QgeyB1c2VycyB9ID0gc3RhdGUudXNlcnNJbmZvO1xyXG4gICAgY29uc3QgeyBvd25lcklkLCBzZWxlY3RlZEltYWdlSWQgfSA9IHN0YXRlLmltYWdlc0luZm87XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXROYW1lOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gdXNlcnNbaWRdO1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7YXV0aG9yLkZpcnN0TmFtZX0gJHthdXRob3IuTGFzdE5hbWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvY3VzZWRJZDogZm9jdXNlZENvbW1lbnQsXHJcbiAgICAgICAgZm9jdXNlZDogY29tbWVudHNbMF0sXHJcbiAgICAgICAgaW1hZ2VJZDogc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgICAgIGltYWdlT3duZXI6IHVzZXJzW293bmVySWRdLlVzZXJuYW1lLFxyXG4gICAgICAgIGNhbkVkaXQ6IChpZCkgPT4gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQgPT0gaWQsXHJcbiAgICAgICAgc2tpcDogc3RhdGUuY29tbWVudHNJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUuY29tbWVudHNJbmZvLnRha2UsXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBlZGl0SGFuZGxlOiAoY29tbWVudElkLCBpbWFnZUlkLCB0ZXh0LCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2goZWRpdENvbW1lbnQodXJsLCBjb21tZW50SWQsIHRleHQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVIYW5kbGU6IChjb21tZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNEZWxldGVVcmwoY29tbWVudElkKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlQ29tbWVudCh1cmwsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXBseUhhbmRsZTogKGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50cztcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQodXJsLCBpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvY3VzQ29tbWVudDogKGlkKSA9PiBkaXNwYXRjaChmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudChpZCkpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFNpbmdsZUNvbW1lbnRSZWR1eCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmFsbENvbW1lbnRzID0gdGhpcy5hbGxDb21tZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29tbWVudCA9IHRoaXMuZGVsZXRlQ29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZWRpdENvbW1lbnQgPSB0aGlzLmVkaXRDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZXBseUNvbW1lbnQgPSB0aGlzLnJlcGx5Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFsbENvbW1lbnRzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VJZCwgaW1hZ2VPd25lciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG5cclxuICAgICAgICBjb25zdCBwYXRoID0gYC8ke2ltYWdlT3duZXJ9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZUlkfS9jb21tZW50c2A7XHJcbiAgICAgICAgcHVzaChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVDb21tZW50KGNvbW1lbnRJZCwgY29udGV4dElkKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZShjb21tZW50SWQsIHRoaXMuYWxsQ29tbWVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgY29udGV4dElkLCB0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0SGFuZGxlLCBmb2N1c0NvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiBmb2N1c0NvbW1lbnQoY29tbWVudElkKTtcclxuICAgICAgICBlZGl0SGFuZGxlKGNvbW1lbnRJZCwgY29udGV4dElkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbHlDb21tZW50KGNvbnRleHRJZCwgdGV4dCwgcGFyZW50SWQpIHtcclxuICAgICAgICBjb25zdCB7IHJlcGx5SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJlcGx5SGFuZGxlKGNvbnRleHRJZCwgdGV4dCwgcGFyZW50SWQsIHRoaXMuYWxsQ29tbWVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGZvY3VzZWRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZihmb2N1c2VkSWQgPCAwKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgY29uc3QgeyBUZXh0LCBBdXRob3JJRCwgQ29tbWVudElELCBQb3N0ZWRPbiwgRWRpdGVkIH0gPSB0aGlzLnByb3BzLmZvY3VzZWQ7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCBpbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgcHJvcHMgPSB7IHNraXAsIHRha2UgfTtcclxuICAgICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHByb3BzLCB7XHJcbiAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQ6IHRoaXMuZGVsZXRlQ29tbWVudCxcclxuICAgICAgICAgICAgZWRpdENvbW1lbnQ6IHRoaXMuZWRpdENvbW1lbnQsXHJcbiAgICAgICAgICAgIHJlcGx5Q29tbWVudDogdGhpcy5yZXBseUNvbW1lbnRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMucHJvcHMuZ2V0TmFtZShBdXRob3JJRCk7XHJcblxyXG4gICAgICAgIHJldHVybiAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8V2VsbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRJZD17aW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e25hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXtUZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudElkPXtDb21tZW50SUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsaWVzPXtbXX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3JJZD17QXV0aG9ySUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0ZWRPbj17UG9zdGVkT259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0ZWQ9e0VkaXRlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9XZWxsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e3RoaXMuYWxsQ29tbWVudHN9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxHbHlwaGljb24gZ2x5cGg9XCJyZWZyZXNoXCIvPiBTZSBhbGxlIGtvbW1lbnRhcmVyP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBTaW5nbGVDb21tZW50Q29ubmVjdCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFNpbmdsZUNvbW1lbnRSZWR1eCk7XHJcbmNvbnN0IFNpbmdsZUltYWdlQ29tbWVudCA9IHdpdGhSb3V0ZXIoU2luZ2xlQ29tbWVudENvbm5lY3QpO1xyXG5leHBvcnQgZGVmYXVsdCBTaW5nbGVJbWFnZUNvbW1lbnQ7XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IEJyZWFkY3J1bWIgfSBmcm9tICcuLi9icmVhZGNydW1icy9CcmVhZGNydW1iJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJvdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBcIk9tXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsyfSBsZz17OH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnJlYWRjcnVtYj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnJlYWRjcnVtYi5JdGVtIGhyZWY9XCIvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZvcnNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JyZWFkY3J1bWIuSXRlbT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnJlYWRjcnVtYi5JdGVtIGFjdGl2ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT21cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JyZWFkY3J1bWIuSXRlbT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnJlYWRjcnVtYj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERldHRlIGVyIGVuIHNpbmdsZSBwYWdlIGFwcGxpY2F0aW9uIVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUZWtub2xvZ2llciBicnVndDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVhY3Q8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlZHV4PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5SZWFjdC1Cb290c3RyYXA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlYWN0Um91dGVyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5Bc3AubmV0IENvcmUgUkMgMjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+QXNwLm5ldCBXZWIgQVBJIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IHB1dCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IHVzZXJzID0gKHN0YXRlID0ge30sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfVVNFUjpcclxuICAgICAgICAgICAgY29uc3QgdXNlcnMgPSBwdXQoc3RhdGUsIGFjdGlvbi51c2VyLklELCBhY3Rpb24udXNlcik7XHJcbiAgICAgICAgICAgIHJldHVybiB1c2VycztcclxuICAgICAgICBjYXNlIFQuUkVDSUVWRURfVVNFUlM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udXNlcnM7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjdXJyZW50VXNlcklkID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfQ1VSUkVOVF9VU0VSX0lEOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmlkIHx8IC0xO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdXNlcnNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGN1cnJlbnRVc2VySWQsXHJcbiAgICB1c2Vyc1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXNlcnNJbmZvOyIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgZmlsdGVyLCBvbWl0LCB2YWx1ZXMgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBwdXQsIHVuaW9uIH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5cclxuY29uc3Qgb3duZXJJZCA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0lNQUdFU19PV05FUjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pZCB8fCAtMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGltYWdlcyA9IChzdGF0ZSA9IHt9LCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuQUREX0lNQUdFOlxyXG4gICAgICAgICAgICBjb25zdCBvYmogPSBwdXQoc3RhdGUsIGFjdGlvbi5rZXksIGFjdGlvbi52YWwpO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSX0lNQUdFUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pbWFnZXM7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9JTUFHRTpcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IG9taXQoc3RhdGUsIGFjdGlvbi5rZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVtb3ZlZDtcclxuICAgICAgICBjYXNlIFQuSU5DUl9JTUdfQ09NTUVOVF9DT1VOVDpcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlcyhzdGF0ZSkubWFwKGltZyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihpbWcuSW1hZ2VJRCA9PSBhY3Rpb24ua2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nLkNvbW1lbnRDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGltZztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBULkRFQ1JfSU1HX0NPTU1FTlRfQ09VTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXMoc3RhdGUpLm1hcChpbWcgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoaW1nLkltYWdlSUQgPT0gYWN0aW9uLmtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZy5Db21tZW50Q291bnQtLTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2VsZWN0ZWRJbWFnZUlkID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0VMRUNURURfSU1HOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmlkIHx8IC0xO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2VsZWN0ZWRJbWFnZUlkcyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuQUREX1NFTEVDVEVEX0lNQUdFX0lEOlxyXG4gICAgICAgICAgICByZXR1cm4gdW5pb24oc3RhdGUsIFthY3Rpb24uaWRdLCAoaWQxLCBpZDIpID0+IGlkMSA9PSBpZDIpO1xyXG4gICAgICAgIGNhc2UgVC5SRU1PVkVfU0VMRUNURURfSU1BR0VfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXIoc3RhdGUsIChpZCkgPT4gaWQgIT0gYWN0aW9uLmlkKTtcclxuICAgICAgICBjYXNlIFQuQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTOlxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbWFnZXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIG93bmVySWQsXHJcbiAgICBpbWFnZXMsXHJcbiAgICBzZWxlY3RlZEltYWdlSWQsXHJcbiAgICBzZWxlY3RlZEltYWdlSWRzXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBpbWFnZXNJbmZvO1xyXG4iLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0IHsgdW5pb24sIHB1dCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5jb25zdCBjb21tZW50cyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuUkVDSUVWRURfQ09NTUVOVFM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uY29tbWVudHMgfHwgW107XHJcbiAgICAgICAgY2FzZSBULkFERF9DT01NRU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gWy4uLnN0YXRlLCBhY3Rpb24uY29tbWVudF07XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBza2lwID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TS0lQX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnNraXAgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UQUtFX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRha2UgfHwgMTA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBwYWdlID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9DVVJSRU5UX1BBR0U6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGFnZSB8fCAxO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfUEFHRVM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udG90YWxQYWdlcyB8fCAwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZm9jdXNlZENvbW1lbnQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9GT0NVU0VEX0NPTU1FTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjb21tZW50c0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgY29tbWVudHMsXHJcbiAgICBza2lwLFxyXG4gICAgdGFrZSxcclxuICAgIHBhZ2UsXHJcbiAgICB0b3RhbFBhZ2VzLFxyXG4gICAgZm9jdXNlZENvbW1lbnRcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbW1lbnRzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5leHBvcnQgY29uc3QgdGl0bGUgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0VSUk9SX1RJVExFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRpdGxlIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfRVJST1JfTUVTU0FHRTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5tZXNzYWdlIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBlcnJvckluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdGl0bGUsXHJcbiAgICBtZXNzYWdlXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXJyb3JJbmZvOyIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IGVycm9ySW5mbyBmcm9tICcuL2Vycm9yJ1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhc0Vycm9yID0gKHN0YXRlID0gZmFsc2UsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfSEFTX0VSUk9SOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhc0Vycm9yO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkb25lID0gKHN0YXRlID0gdHJ1ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXNlZFNwYWNla0IgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVVNFRF9TUEFDRV9LQjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi51c2VkU3BhY2U7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdG90YWxTcGFjZWtCID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UT1RBTF9TUEFDRV9LQjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50b3RhbFNwYWNlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNwYWNlSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB1c2VkU3BhY2VrQixcclxuICAgIHRvdGFsU3BhY2VrQlxyXG59KTtcclxuXHJcbmNvbnN0IHN0YXR1c0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgaGFzRXJyb3IsXHJcbiAgICBlcnJvckluZm8sXHJcbiAgICBzcGFjZUluZm8sXHJcbiAgICBtZXNzYWdlLFxyXG4gICAgZG9uZVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RhdHVzSW5mbztcclxuIiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuXHJcbmNvbnN0IHNraXAgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1NLSVBfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnNraXAgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UQUtFX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfUEFHRV9XSEFUU19ORVc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGFnZSB8fCAxO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRvdGFsUGFnZXMgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGl0ZW1zID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfTEFURVNUOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmxhdGVzdCB8fCBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHdoYXRzTmV3SW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBza2lwLFxyXG4gICAgdGFrZSxcclxuICAgIHBhZ2UsXHJcbiAgICB0b3RhbFBhZ2VzLFxyXG4gICAgaXRlbXNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdoYXRzTmV3SW5mbztcclxuIiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCB7IHVuaW9uIH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAndW5kZXJzY29yZSdcclxuXHJcbmNvbnN0IHBvc3RDb21tZW50cyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1BPU1RfQ09NTUVOVFM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uY29tbWVudHMgfHwgW107XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBza2lwVGhyZWFkcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0tJUF9USFJFQURTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnNraXA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB0YWtlVGhyZWFkcyA9IChzdGF0ZSA9IDEwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RBS0VfVEhSRUFEUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZVRocmVhZHMgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1BBR0VfVEhSRUFEUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYWdlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdG90YWxQYWdlc1RocmVhZCA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfUEFHRVNfVEhSRUFEUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50b3RhbFBhZ2VzO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2VsZWN0ZWRUaHJlYWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TRUxFQ1RFRFRIUkVBRF9JRDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRpdGxlcyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuQUREX1RIUkVBRF9USVRMRTpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKFthY3Rpb24udGl0bGVdLCBzdGF0ZSwgKHQxLCB0MikgPT4gdDEuSUQgPT0gdDIuSUQpO1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVEhSRUFEX1RJVExFUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50aXRsZXM7XHJcbiAgICAgICAgY2FzZSBULlVQREFURV9USFJFQURfVElUTEU6XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBmaWx0ZXIoc3RhdGUsICh0aXRsZSkgPT4gdGl0bGUuSUQgIT0gYWN0aW9uLmlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIFsuLi5yZW1vdmVkLCBhY3Rpb24udGl0bGVdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcG9zdENvbnRlbnQgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1BPU1RfQ09OVEVOVDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5jb250ZW50O1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdGl0bGVzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB0aXRsZXMsXHJcbiAgICBza2lwOiBza2lwVGhyZWFkcyxcclxuICAgIHRha2U6IHRha2VUaHJlYWRzLFxyXG4gICAgcGFnZTogcGFnZVRocmVhZHMsXHJcbiAgICB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzVGhyZWFkLFxyXG4gICAgc2VsZWN0ZWRUaHJlYWRcclxufSlcclxuXHJcbmNvbnN0IGZvcnVtSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB0aXRsZXNJbmZvLFxyXG4gICAgcG9zdENvbnRlbnRcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZvcnVtSW5mbztcclxuIiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCB1c2Vyc0luZm8gZnJvbSAnLi91c2VycydcclxuaW1wb3J0IGltYWdlc0luZm8gZnJvbSAnLi9pbWFnZXMnXHJcbmltcG9ydCBjb21tZW50c0luZm8gZnJvbSAnLi9jb21tZW50cydcclxuaW1wb3J0IHN0YXR1c0luZm8gZnJvbSAnLi9zdGF0dXMnXHJcbmltcG9ydCB3aGF0c05ld0luZm8gZnJvbSAnLi93aGF0c25ldydcclxuaW1wb3J0IGZvcnVtSW5mbyBmcm9tICcuL2ZvcnVtJ1xyXG5cclxuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdXNlcnNJbmZvLFxyXG4gICAgaW1hZ2VzSW5mbyxcclxuICAgIGNvbW1lbnRzSW5mbyxcclxuICAgIHN0YXR1c0luZm8sXHJcbiAgICB3aGF0c05ld0luZm8sXHJcbiAgICBmb3J1bUluZm9cclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyIiwi77u/aW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgdGh1bmsgZnJvbSAncmVkdXgtdGh1bmsnXHJcbmltcG9ydCByb290UmVkdWNlciBmcm9tICcuLi9yZWR1Y2Vycy9yb290J1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocm9vdFJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZSh0aHVuaykpIiwi77u/aW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi9zdG9yZXMvc3RvcmUnXHJcbmltcG9ydCB7IGZldGNoQ3VycmVudFVzZXIsIGZldGNoVXNlcnMgfSBmcm9tICcuLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgeyBuZXdJbWFnZUZyb21TZXJ2ZXIsIGZldGNoVXNlckltYWdlcywgc2V0U2VsZWN0ZWRJbWcsIHNldEltYWdlT3duZXIgfSBmcm9tICcuLi9hY3Rpb25zL2ltYWdlcydcclxuaW1wb3J0IHsgbmV3Q29tbWVudEZyb21TZXJ2ZXIsIGZldGNoQ29tbWVudHMsIHNldFNraXBDb21tZW50cywgc2V0VGFrZUNvbW1lbnRzLCBmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudCB9IGZyb20gJy4uL2FjdGlvbnMvY29tbWVudHMnXHJcbmltcG9ydCB7IHNldExhdGVzdCwgZmV0Y2hMYXRlc3ROZXdzIH0gZnJvbSAnLi4vYWN0aW9ucy93aGF0c25ldydcclxuaW1wb3J0IHsgbmV3Rm9ydW1UaHJlYWRGcm9tU2VydmVyLCBmZXRjaFRocmVhZHMsIGZldGNoUG9zdCB9IGZyb20gJy4uL2FjdGlvbnMvZm9ydW0nXHJcbmltcG9ydCB7IGZldGNoU3BhY2VJbmZvIH0gZnJvbSAnLi4vYWN0aW9ucy9zdGF0dXMnXHJcbmltcG9ydCB7IGdldEltYWdlQ29tbWVudHNQYWdlVXJsLCBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgcG9seWZpbGwgfSBmcm9tICdlczYtcHJvbWlzZSdcclxuaW1wb3J0IHsgcG9seWZpbGwgYXMgb2JqZWN0UG9seWZpbGwgfSBmcm9tICdlczYtb2JqZWN0LWFzc2lnbidcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgb2JqZWN0UG9seWZpbGwoKTtcclxuICAgIHBvbHlmaWxsKCk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaEN1cnJlbnRVc2VyKGdsb2JhbHMuY3VycmVudFVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFVzZXJzKCkpO1xyXG4gICAgbW9tZW50LmxvY2FsZSgnZGEnKTtcclxuXHJcbiAgICBjb25uZWN0VG9MYXRlc3RXZWJTb2NrZXRTZXJ2aWNlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjb25uZWN0VG9MYXRlc3RXZWJTb2NrZXRTZXJ2aWNlID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc3VwcG9ydHNXZWJTb2NrZXRzID0gJ1dlYlNvY2tldCcgaW4gd2luZG93IHx8ICdNb3pXZWJTb2NrZXQnIGluIHdpbmRvdztcclxuXHJcbiAgICAvLyBXZWJzZXJ2ZXIgZG9lcyBub3Qgc3VwcG9ydCB3ZWJzb2NrZXRzXHJcbiAgICBpZiAoZmFsc2UpIHtcclxuICAgICAgICBjb25zdCBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KGdsb2JhbHMudXJscy53ZWJzb2NrZXQubGF0ZXN0KTtcclxuICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnTkVXX0lNQUdFX0NPTU1FTlQnOlxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKG5ld0NvbW1lbnRGcm9tU2VydmVyKGRhdGEuaXRlbSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnTkVXX0lNQUdFJzpcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChuZXdJbWFnZUZyb21TZXJ2ZXIoZGF0YS5pdGVtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hTcGFjZUluZm8oYCR7Z2xvYmFscy51cmxzLmRpYWdub3N0aWNzfS9nZXRzcGFjZWluZm9gKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdORVdfRk9SVU1fVEhSRUFEJzpcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChuZXdGb3J1bVRocmVhZEZyb21TZXJ2ZXIoZGF0YS5pdGVtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS53aGF0c05ld0luZm87XHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gZG8gbG9uZy1wb2xsIGV2ZXJ5IDEwIHNlY29uZHNcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS53aGF0c05ld0luZm87XHJcbiAgICAgICAgICAgIGNvbnN0IHNraXBQb3N0ID0gc3RvcmUuZ2V0U3RhdGUoKS5mb3J1bUluZm8udGl0bGVzSW5mby5za2lwO1xyXG4gICAgICAgICAgICBjb25zdCB0YWtlUG9zdCA9IHN0b3JlLmdldFN0YXRlKCkuZm9ydW1JbmZvLnRpdGxlc0luZm8udGFrZTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVXNlcnMoKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVGhyZWFkcyhza2lwUG9zdCwgdGFrZVBvc3QpKTtcclxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hTcGFjZUluZm8oYCR7Z2xvYmFscy51cmxzLmRpYWdub3N0aWNzfS9nZXRzcGFjZWluZm9gKSk7XHJcbiAgICAgICAgfSwgMTAwMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2VsZWN0SW1hZ2UgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBpbWFnZUlkID0gTnVtYmVyKG5leHRTdGF0ZS5wYXJhbXMuaWQpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaW1hZ2VJZCkpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hJbWFnZXMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IG5leHRTdGF0ZS5wYXJhbXMudXNlcm5hbWU7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRJbWFnZU93bmVyKHVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTtcclxuXHJcbiAgICAvLyByZXNldCBjb21tZW50IHN0YXRlXHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRTa2lwQ29tbWVudHModW5kZWZpbmVkKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRUYWtlQ29tbWVudHModW5kZWZpbmVkKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBsb2FkQ29tbWVudHMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIGNvbnN0IHBhZ2UgPSBOdW1iZXIobmV4dFN0YXRlLmxvY2F0aW9uLnF1ZXJ5LnBhZ2UpO1xyXG4gICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuXHJcbiAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybChpZCwgc2tpcCwgdGFrZSk7XHJcbiAgICBpZighcGFnZSkge1xyXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSBwYWdlIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXBJdGVtcywgdGFrZSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hDb21tZW50ID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgaWQgPSBOdW1iZXIobmV4dFN0YXRlLmxvY2F0aW9uLnF1ZXJ5LmlkKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQW5kRm9jdXNTaW5nbGVDb21tZW50KGlkKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaFdoYXRzTmV3ID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgZ2V0TGF0ZXN0ID0gKHNraXAsIHRha2UpID0+IHN0b3JlLmRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSk7XHJcbiAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHN0b3JlLmdldFN0YXRlKCkud2hhdHNOZXdJbmZvO1xyXG4gICAgZ2V0TGF0ZXN0KHNraXAsIHRha2UpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hGb3J1bSA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5mb3J1bUluZm8udGl0bGVzSW5mbztcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVGhyZWFkcyhza2lwLCB0YWtlKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaFNpbmdsZVBvc3QgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBuZXh0U3RhdGUucGFyYW1zO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hQb3N0KE51bWJlcihpZCkpKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGZldGNoUG9zdENvbW1lbnRzID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcblxyXG4gICAgY29uc3QgdXJsID0gZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwoaWQsIHNraXAsIHRha2UpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCBNYWluIGZyb20gJy4vY29tcG9uZW50cy9zaGVsbHMvTWFpbidcclxuaW1wb3J0IEhvbWUgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvSG9tZSdcclxuaW1wb3J0IEZvcnVtIGZyb20gJy4vY29tcG9uZW50cy9zaGVsbHMvRm9ydW0nXHJcbmltcG9ydCBGb3J1bUxpc3QgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1MaXN0J1xyXG5pbXBvcnQgRm9ydW1Qb3N0IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL0ZvcnVtUG9zdCdcclxuaW1wb3J0IEZvcnVtQ29tbWVudHMgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Db21tZW50cydcclxuaW1wb3J0IFVzZXJzIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJzJ1xyXG5pbXBvcnQgVXNlckltYWdlcyBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzJ1xyXG5pbXBvcnQgU2VsZWN0ZWRJbWFnZSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9TZWxlY3RlZEltYWdlJ1xyXG5pbXBvcnQgSW1hZ2VDb21tZW50cyBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9JbWFnZUNvbW1lbnRzJ1xyXG5pbXBvcnQgU2luZ2xlSW1hZ2VDb21tZW50IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1NpbmdsZUltYWdlQ29tbWVudCdcclxuaW1wb3J0IEFib3V0IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL0Fib3V0J1xyXG5pbXBvcnQgeyBpbml0LCBmZXRjaEZvcnVtLCBzZWxlY3RJbWFnZSwgZmV0Y2hJbWFnZXMsIGxvYWRDb21tZW50cywgZmV0Y2hDb21tZW50LCBmZXRjaFdoYXRzTmV3LCBmZXRjaFNpbmdsZVBvc3QsIGZldGNoUG9zdENvbW1lbnRzIH0gZnJvbSAnLi91dGlsaXRpZXMvb25zdGFydHVwJ1xyXG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlLCBJbmRleFJvdXRlLCBicm93c2VySGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgY29ubmVjdCwgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3Jlcy9zdG9yZSdcclxuXHJcbmluaXQoKTtcclxuXHJcblJlYWN0RE9NLnJlbmRlcihcclxuICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICAgIDxSb3V0ZXIgaGlzdG9yeT17YnJvd3Nlckhpc3Rvcnl9PlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9cIiBjb21wb25lbnQ9e01haW59PlxyXG4gICAgICAgICAgICAgICAgPEluZGV4Um91dGUgY29tcG9uZW50PXtIb21lfSBvbkVudGVyPXtmZXRjaFdoYXRzTmV3fSAvPlxyXG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCJmb3J1bVwiIGNvbXBvbmVudD17Rm9ydW19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbmRleFJvdXRlIGNvbXBvbmVudD17Rm9ydW1MaXN0fSBvbkVudGVyPXtmZXRjaEZvcnVtfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwicG9zdC86aWRcIiBjb21wb25lbnQ9e0ZvcnVtUG9zdH0gb25FbnRlcj17ZmV0Y2hTaW5nbGVQb3N0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCJjb21tZW50c1wiIGNvbXBvbmVudD17Rm9ydW1Db21tZW50c30gb25FbnRlcj17ZmV0Y2hQb3N0Q29tbWVudHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cInVzZXJzXCIgY29tcG9uZW50PXtVc2Vyc30gLz5cclxuICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiOnVzZXJuYW1lL2dhbGxlcnlcIiBjb21wb25lbnQ9e1VzZXJJbWFnZXN9IG9uRW50ZXI9e2ZldGNoSW1hZ2VzfT5cclxuICAgICAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cImltYWdlLzppZFwiIGNvbXBvbmVudD17U2VsZWN0ZWRJbWFnZX0gb25FbnRlcj17c2VsZWN0SW1hZ2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cImNvbW1lbnRzXCIgY29tcG9uZW50PXtJbWFnZUNvbW1lbnRzfSBvbkVudGVyPXtsb2FkQ29tbWVudHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiY29tbWVudFwiIGNvbXBvbmVudD17U2luZ2xlSW1hZ2VDb21tZW50fSBvbkVudGVyPXtmZXRjaENvbW1lbnR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cImFib3V0XCIgY29tcG9uZW50PXtBYm91dH0gLz5cclxuICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICA8L1JvdXRlcj5cclxuICAgIDwvUHJvdmlkZXI+LFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSk7XHJcbiJdLCJuYW1lcyI6WyJzdXBlciIsImxldCIsIkxpbmsiLCJJbmRleExpbmsiLCJSb3ciLCJDb2wiLCJBbGVydCIsImNvbnN0IiwiVC5TRVRfRVJST1JfVElUTEUiLCJULkNMRUFSX0VSUk9SX1RJVExFIiwiVC5TRVRfRVJST1JfTUVTU0FHRSIsIlQuQ0xFQVJfRVJST1JfTUVTU0FHRSIsIlQuU0VUX0hBU19FUlJPUiIsInZhbHVlcyIsIkdyaWQiLCJOYXZiYXIiLCJOYXYiLCJOYXZEcm9wZG93biIsIk1lbnVJdGVtIiwiY29ubmVjdCIsIlQuU0VUX0NVUlJFTlRfVVNFUl9JRCIsIlQuQUREX1VTRVIiLCJULlJFQ0lFVkVEX1VTRVJTIiwiVC5TRVRfTEFURVNUIiwiVC5TRVRfU0tJUF9XSEFUU19ORVciLCJULlNFVF9UQUtFX1dIQVRTX05FVyIsIlQuU0VUX1BBR0VfV0hBVFNfTkVXIiwiVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXIiwiTWVkaWEiLCJJbWFnZSIsIlRvb2x0aXAiLCJPdmVybGF5VHJpZ2dlciIsIkdseXBoaWNvbiIsIk1vZGFsIiwiRm9ybUdyb3VwIiwiQ29udHJvbExhYmVsIiwiRm9ybUNvbnRyb2wiLCJCdXR0b25Hcm91cCIsIkJ1dHRvbiIsIkJ1dHRvblRvb2xiYXIiLCJDb2xsYXBzZSIsIlQuVVBEQVRFX1RIUkVBRF9USVRMRSIsIlQuU0VUX1RIUkVBRF9USVRMRVMiLCJzZXRUb3RhbFBhZ2VzIiwiVC5TRVRfVE9UQUxfUEFHRVNfVEhSRUFEUyIsInNldFBhZ2UiLCJULlNFVF9QQUdFX1RIUkVBRFMiLCJULlNFVF9TS0lQX1RIUkVBRFMiLCJzZXRUYWtlIiwiVC5TRVRfVEFLRV9USFJFQURTIiwiVC5TRVRfU0VMRUNURURUSFJFQURfSUQiLCJULlNFVF9QT1NUX0NPTlRFTlQiLCJULlNFVF9TS0lQX0NPTU1FTlRTIiwiVC5TRVRfVEFLRV9DT01NRU5UUyIsIlQuU0VUX0NVUlJFTlRfUEFHRSIsIlQuU0VUX1RPVEFMX1BBR0VTIiwiVC5SRUNJRVZFRF9DT01NRU5UUyIsIlQuU0VUX0ZPQ1VTRURfQ09NTUVOVCIsInRoaXMiLCJtYXBTdGF0ZVRvUHJvcHMiLCJmaW5kIiwiY29udGFpbnMiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJ3aXRoUm91dGVyIiwiUGFnaW5hdGlvbiIsIlBhZ2luYXRpb25CcyIsIlQuU0VUX0lNQUdFU19PV05FUiIsIlQuUkVDSUVWRURfVVNFUl9JTUFHRVMiLCJULlNFVF9TRUxFQ1RFRF9JTUciLCJULkFERF9JTUFHRSIsIlQuUkVNT1ZFX0lNQUdFIiwiVC5BRERfU0VMRUNURURfSU1BR0VfSUQiLCJULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCIsIlQuQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTIiwiVC5JTkNSX0lNR19DT01NRU5UX0NPVU5UIiwiVC5ERUNSX0lNR19DT01NRU5UX0NPVU5UIiwiVC5TRVRfVVNFRF9TUEFDRV9LQiIsIlQuU0VUX1RPVEFMX1NQQUNFX0tCIiwiUHJvZ3Jlc3NCYXIiLCJKdW1ib3Ryb24iLCJQYW5lbCIsIlBhZ2VIZWFkZXIiLCJJbWFnZUJzIiwicm93Iiwic29ydEJ5IiwiV2VsbCIsImNvbWJpbmVSZWR1Y2VycyIsIm9taXQiLCJmaWx0ZXIiLCJULkFERF9DT01NRU5UIiwibWVzc2FnZSIsInNraXAiLCJ0YWtlIiwicGFnZSIsInRvdGFsUGFnZXMiLCJULkFERF9USFJFQURfVElUTEUiLCJjcmVhdGVTdG9yZSIsImFwcGx5TWlkZGxld2FyZSIsIm9iamVjdFBvbHlmaWxsIiwicG9seWZpbGwiLCJQcm92aWRlciIsIlJvdXRlciIsImJyb3dzZXJIaXN0b3J5IiwiUm91dGUiLCJJbmRleFJvdXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHTyxJQUFNLE9BQU8sR0FBd0I7SUFBQyxnQkFDOUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCQSxVQUFLLEtBQUEsQ0FBQyxNQUFBLEtBQUssQ0FBQyxDQUFDO0tBQ2hCOzs7OzRDQUFBOztJQUVELGtCQUFBLE1BQU0sc0JBQUc7UUFDTEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztZQUM1RCxTQUFTLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxFQUFFLENBQUM7O1FBRXpDLE9BQU87WUFDSCxxQkFBQyxRQUFHLFNBQVMsRUFBQyxTQUFVLEVBQUM7Z0JBQ3JCLHFCQUFDQyxnQkFBSSxJQUFDLEVBQUUsRUFBQyxJQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQztvQkFDcEIsSUFBSyxDQUFDLEtBQUssQ0FBQyxRQUFRO2lCQUNqQjthQUNOO1NBQ1I7S0FDSixDQUFBOzs7RUFoQndCLEtBQUssQ0FBQyxTQWlCbEMsR0FBQTs7QUFFRCxPQUFPLENBQUMsWUFBWSxHQUFHO0lBQ25CLE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07Q0FDakM7O0FBRUQsQUFBTyxJQUFNLFlBQVksR0FBd0I7SUFBQyxxQkFDbkMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCRixVQUFLLEtBQUEsQ0FBQyxNQUFBLEtBQUssQ0FBQyxDQUFDO0tBQ2hCOzs7O3NEQUFBOztJQUVELHVCQUFBLE1BQU0sc0JBQUc7UUFDTEMsSUFB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