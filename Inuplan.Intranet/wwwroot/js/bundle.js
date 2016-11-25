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
                                React.createElement( reactRouter.Link, { to: "/", className: "navbar-brand" }, "Inuplan Intranet")
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
                        React.createElement( 'p', { className: "lead" }, "Til Inuplans intranet side"), 

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
    store.dispatch(fetchCurrentUser(globals.currentUsername));
    store.dispatch(fetchUsers());
    moment.locale('da');

    connectToLatestWebSocketService();
}

var connectToLatestWebSocketService = function () {
    var supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;

    // Webserver does not support websockets
    if(false) {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvd3JhcHBlcnMvTGlua3MuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRXJyb3IuanMiLCJjb25zdGFudHMvdHlwZXMuanMiLCJhY3Rpb25zL2Vycm9yLmpzIiwiY29tcG9uZW50cy9zaGVsbHMvTWFpbi5qcyIsImNvbnN0YW50cy9jb25zdGFudHMuanMiLCJ1dGlsaXRpZXMvdXRpbHMuanMiLCJhY3Rpb25zL3VzZXJzLmpzIiwiYWN0aW9ucy93aGF0c25ldy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCJjb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3VG9vbHRpcC5qcyIsImNvbXBvbmVudHMvd2hhdHNuZXcvV2hhdHNOZXdJdGVtSW1hZ2UuanMiLCJjb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCJjb21wb25lbnRzL3doYXRzbmV3L1doYXRzTmV3Rm9ydW1Qb3N0LmpzIiwiY29tcG9uZW50cy93aGF0c25ldy9XaGF0c05ld0xpc3QuanMiLCJjb21wb25lbnRzL2ZvcnVtL0ZvcnVtRm9ybS5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudENvbnRyb2xzLmpzIiwiYWN0aW9ucy9mb3J1bS5qcyIsImFjdGlvbnMvY29tbWVudHMuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Qb3N0LmpzIiwiY29tcG9uZW50cy9wYWdpbmF0aW9uL1BhZ2luYXRpb24uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvV2hhdHNOZXcuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZVVwbG9hZC5qcyIsImFjdGlvbnMvaW1hZ2VzLmpzIiwiYWN0aW9ucy9zdGF0dXMuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlZFNwYWNlLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL0hvbWUuanMiLCJjb21wb25lbnRzL3NoZWxscy9Gb3J1bS5qcyIsImNvbXBvbmVudHMvZm9ydW0vRm9ydW1UaXRsZS5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Gb3J1bUxpc3QuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnREZWxldGVkLmpzIiwiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50LmpzIiwiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50TGlzdC5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudEZvcm0uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Db21tZW50cy5qcyIsImNvbXBvbmVudHMvdXNlcnMvVXNlci5qcyIsImNvbXBvbmVudHMvdXNlcnMvVXNlckxpc3QuanMiLCJjb21wb25lbnRzL2JyZWFkY3J1bWJzL0JyZWFkY3J1bWIuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlcnMuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvSW1hZ2VDb21tZW50cy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9TaW5nbGVJbWFnZUNvbW1lbnQuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJyZWR1Y2Vycy91c2Vycy5qcyIsInJlZHVjZXJzL2ltYWdlcy5qcyIsInJlZHVjZXJzL2NvbW1lbnRzLmpzIiwicmVkdWNlcnMvZXJyb3IuanMiLCJyZWR1Y2Vycy9zdGF0dXMuanMiLCJyZWR1Y2Vycy93aGF0c25ldy5qcyIsInJlZHVjZXJzL2ZvcnVtLmpzIiwicmVkdWNlcnMvcm9vdC5qcyIsInN0b3Jlcy9zdG9yZS5qcyIsInV0aWxpdGllcy9vbnN0YXJ0dXAuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/aW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgTmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPXt0aGlzLnByb3BzLnRvfT5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuXHJcbk5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmRleE5hdkxpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IHRoaXMuY29udGV4dC5yb3V0ZXIuaXNBY3RpdmUodGhpcy5wcm9wcy50bywgdHJ1ZSksXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XHJcbiAgICAgICAgICAgICAgICA8SW5kZXhMaW5rIHRvPXt0aGlzLnByb3BzLnRvfT5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvSW5kZXhMaW5rPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuSW5kZXhOYXZMaW5rLmNvbnRleHRUeXBlcyA9IHtcclxuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUm93LCBDb2wsIEFsZXJ0IH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNsZWFyRXJyb3IsIHRpdGxlLCBtZXNzYWdlICB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QWxlcnQgYnNTdHlsZT1cImRhbmdlclwiIG9uRGlzbWlzcz17Y2xlYXJFcnJvcn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPnt0aXRsZX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnttZXNzYWdlfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9BbGVydD5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59Iiwi77u/Ly8gSW1hZ2UgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX0lNRyA9ICdTRVRfU0VMRUNURURfSU1HJztcclxuZXhwb3J0IGNvbnN0IFVOU0VUX1NFTEVDVEVEX0lNRyA9ICdVTlNFVF9TRUxFQ1RFRF9JTUcnO1xyXG5leHBvcnQgY29uc3QgQUREX0lNQUdFID0gJ0FERF9JTUFHRSc7XHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfSU1BR0UgPSAnUkVNT1ZFX0lNQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9JTUFHRVNfT1dORVIgPSAnU0VUX0lNQUdFU19PV05FUic7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9VU0VSX0lNQUdFUyA9ICdSRUNJRVZFRF9VU0VSX0lNQUdFUyc7XHJcbmV4cG9ydCBjb25zdCBBRERfU0VMRUNURURfSU1BR0VfSUQgPSAnQUREX1NFTEVDVEVEX0lNQUdFX0lEJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCA9ICdSRU1PVkVfU0VMRUNURURfSU1BR0VfSUQnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTID0gJ0NMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyc7XHJcbmV4cG9ydCBjb25zdCBJTkNSX0lNR19DT01NRU5UX0NPVU5UID0gJ0lOQ1JfSU1HX0NPTU1FTlRfQ09VTlQnO1xyXG5leHBvcnQgY29uc3QgREVDUl9JTUdfQ09NTUVOVF9DT1VOVCA9ICdERUNSX0lNR19DT01NRU5UX0NPVU5UJztcclxuXHJcbi8vIFVzZXIgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX0NVUlJFTlRfVVNFUl9JRCA9ICdTRVRfQ1VSUkVOVF9VU0VSX0lEJztcclxuZXhwb3J0IGNvbnN0IEFERF9VU0VSID0gJ0FERF9VU0VSJztcclxuZXhwb3J0IGNvbnN0IEVSUk9SX0ZFVENISU5HX0NVUlJFTlRfVVNFUiA9ICdFUlJPUl9GRVRDSElOR19DVVJSRU5UX1VTRVInO1xyXG5leHBvcnQgY29uc3QgUkVDSUVWRURfVVNFUlMgPSAnUkVDSUVWRURfVVNFUlMnO1xyXG5cclxuLy8gQ29tbWVudCBhY3Rpb25zXHJcbmV4cG9ydCBjb25zdCBBRERfQ09NTUVOVCA9ICdBRERfQ09NTUVOVCc7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9DT01NRU5UUyA9ICdSRUNJRVZFRF9DT01NRU5UUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfQ1VSUkVOVF9QQUdFID0gJ1NFVF9DVVJSRU5UX1BBR0UnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RPVEFMX1BBR0VTID0gJ1NFVF9UT1RBTF9QQUdFUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0tJUF9DT01NRU5UUyA9ICdTRVRfU0tJUF9DT01NRU5UUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfVEFLRV9DT01NRU5UUyA9ICdTRVRfVEFLRV9DT01NRU5UUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfREVGQVVMVF9TS0lQID0gJ1NFVF9ERUZBVUxUX1NLSVAnO1xyXG5leHBvcnQgY29uc3QgU0VUX0RFRkFVTFRfVEFLRSA9ICdTRVRfREVGQVVMVF9UQUtFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9ERUZBVUxUX0NPTU1FTlRTID0gJ1NFVF9ERUZBVUxUX0NPTU1FTlRTJztcclxuZXhwb3J0IGNvbnN0IFNFVF9GT0NVU0VEX0NPTU1FTlQgPSAnU0VUX0ZPQ1VTRURfQ09NTUVOVCc7XHJcblxyXG4vLyBXaGF0c05ld1xyXG5leHBvcnQgY29uc3QgU0VUX0xBVEVTVCA9ICdTRVRfTEFURVNUJztcclxuZXhwb3J0IGNvbnN0IFNFVF9TS0lQX1dIQVRTX05FVyA9ICdTRVRfU0tJUF9XSEFUU19ORVcnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RBS0VfV0hBVFNfTkVXID0gJ1NFVF9UQUtFX1dIQVRTX05FVyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfUEFHRV9XSEFUU19ORVcgPSAnU0VUX1BBR0VfV0hBVFNfTkVXJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UT1RBTF9QQUdFU19XSEFUU19ORVcgPSAnU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVyc7XHJcblxyXG4vLyBFcnJvciBhY3Rpb25zXHJcbmV4cG9ydCBjb25zdCBTRVRfRVJST1JfVElUTEUgPSAnU0VUX0VSUk9SX1RJVExFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9FUlJPUl9NRVNTQUdFID0gJ1NFVF9FUlJPUl9NRVNTQUdFJ1xyXG5leHBvcnQgY29uc3QgU0VUX0hBU19FUlJPUiA9ICdTRVRfSEFTX0VSUk9SJztcclxuZXhwb3J0IGNvbnN0IENMRUFSX0VSUk9SX1RJVExFID0gJ0NMRUFSX0VSUk9SX1RJVExFJztcclxuZXhwb3J0IGNvbnN0IENMRUFSX0VSUk9SX01FU1NBR0UgPSAnQ0xFQVJfRVJST1JfTUVTU0FHRSc7XHJcblxyXG4vLyBGb3J1bVxyXG5leHBvcnQgY29uc3QgU0VUX1BPU1RfQ09NTUVOVFMgPSAnU0VUX1BPU1RfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RIUkVBRF9USVRMRVMgPSAnU0VUX1RIUkVBRF9USVRMRVMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RPVEFMX1BBR0VTX1RIUkVBRFMgPSAnU0VUX1RPVEFMX1BBR0VTX1RIUkVBRFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1BBR0VfVEhSRUFEUyA9ICdTRVRfUEFHRV9USFJFQURTJztcclxuZXhwb3J0IGNvbnN0IFNFVF9TS0lQX1RIUkVBRFMgPSAnU0VUX1NLSVBfVEhSRUFEJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UQUtFX1RIUkVBRFMgPSAnU0VUX1RBS0VfVEhSRUFEUyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0VMRUNURURUSFJFQURfSUQgPSAnU0VUX1NFTEVDVEVEVEhSRUFEX0lEJztcclxuZXhwb3J0IGNvbnN0IFNFVF9QT1NUX0NPTlRFTlQgPSAnU0VUX1BPU1RfQ09OVEVOVCc7XHJcbmV4cG9ydCBjb25zdCBBRERfVEhSRUFEX1RJVExFID0gJ0FERF9USFJFQURfVElUTEUnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX1BPU1RfSUQgPSAnU0VUX1NFTEVDVEVEX1BPU1RfSUQnO1xyXG5leHBvcnQgY29uc3QgVVBEQVRFX1RIUkVBRF9USVRMRSA9ICdVUERBVEVfVEhSRUFEX1RJVExFJztcclxuXHJcbi8vIFN0YXR1c0luZm9cclxuZXhwb3J0IGNvbnN0IFNFVF9VU0VEX1NQQUNFX0tCID0gJ1NFVF9VU0VEX1NQQUNFX0tCJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UT1RBTF9TUEFDRV9LQiA9ICdTRVRfVE9UQUxfU1BBQ0VfS0InO1xyXG4iLCLvu79pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvclRpdGxlID0gKHRpdGxlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0VSUk9SX1RJVExFLFxyXG4gICAgICAgIHRpdGxlOiB0aXRsZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvclRpdGxlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkNMRUFSX0VSUk9SX1RJVExFXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvck1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9FUlJPUl9NRVNTQUdFLFxyXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3JNZXNzYWdlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkNMRUFSX0VSUk9SX01FU1NBR0VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3IgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvclRpdGxlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKGNsZWFyRXJyb3JNZXNzYWdlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKGZhbHNlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0SGFzRXJyb3IgPSAoaGFzRXJyb3IpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfSEFTX0VSUk9SLFxyXG4gICAgICAgIGhhc0Vycm9yOiBoYXNFcnJvclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0RXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChzZXRIYXNFcnJvcih0cnVlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JUaXRsZShlcnJvci50aXRsZSkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEVycm9yTWVzc2FnZShlcnJvci5tZXNzYWdlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHRpdGxlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmssIEluZGV4TGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgTmF2TGluaywgSW5kZXhOYXZMaW5rIH0gZnJvbSAnLi4vd3JhcHBlcnMvTGlua3MnXHJcbmltcG9ydCB7IEVycm9yIH0gZnJvbSAnLi4vY29udGFpbmVycy9FcnJvcidcclxuaW1wb3J0IHsgY2xlYXJFcnJvciB9IGZyb20gJy4uLy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgR3JpZCwgTmF2YmFyLCBOYXYsIE5hdkRyb3Bkb3duLCBNZW51SXRlbSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuaW1wb3J0IHsgdmFsdWVzIH0gZnJvbSAndW5kZXJzY29yZSdcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgdXNlciA9IHZhbHVlcyhzdGF0ZS51c2Vyc0luZm8udXNlcnMpLmZpbHRlcih1ID0+IHUuVXNlcm5hbWUudG9VcHBlckNhc2UoKSA9PSBnbG9iYWxzLmN1cnJlbnRVc2VybmFtZS50b1VwcGVyQ2FzZSgpKVswXTtcclxuICAgIGNvbnN0IG5hbWUgPSB1c2VyID8gdXNlci5GaXJzdE5hbWUgOiAnVXNlcic7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhhc0Vycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmhhc0Vycm9yLFxyXG4gICAgICAgIGVycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmVycm9ySW5mbyxcclxuICAgICAgICBuYW1lOiBuYW1lXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xlYXJFcnJvcjogKCkgPT4gZGlzcGF0Y2goY2xlYXJFcnJvcigpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTaGVsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBlcnJvclZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgY2xlYXJFcnJvciwgZXJyb3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgbWVzc2FnZSB9ID0gZXJyb3I7XHJcbiAgICAgICAgcmV0dXJuIChoYXNFcnJvciA/XHJcbiAgICAgICAgICAgIDxFcnJvclxyXG4gICAgICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17bWVzc2FnZX1cclxuICAgICAgICAgICAgICAgIGNsZWFyRXJyb3I9e2NsZWFyRXJyb3J9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBlbXBsb3llZVVybCA9IGdsb2JhbHMudXJscy5lbXBsb3llZUhhbmRib29rO1xyXG4gICAgICAgIGNvbnN0IGM1U2VhcmNoVXJsID0gZ2xvYmFscy51cmxzLmM1U2VhcmNoO1xyXG4gICAgICAgIHJldHVybiAgPEdyaWQgZmx1aWQ9e3RydWV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZiYXIgZml4ZWRUb3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci5CcmFuZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9cIiBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIj5JbnVwbGFuIEludHJhbmV0PC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXZiYXIuQnJhbmQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRvZ2dsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5IZWFkZXI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLkNvbGxhcHNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5kZXhOYXZMaW5rIHRvPVwiL1wiPkZvcnNpZGU8L0luZGV4TmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayB0bz1cIi9mb3J1bVwiPkZvcnVtPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPVwiL3VzZXJzXCI+QnJ1Z2VyZTwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayB0bz1cIi9hYm91dFwiPk9tPC9OYXZMaW5rPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L05hdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRleHQgcHVsbFJpZ2h0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhlaiwge25hbWV9IVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXZiYXIuVGV4dD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2IHB1bGxSaWdodD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2RHJvcGRvd24gZXZlbnRLZXk9ezV9IHRpdGxlPVwiTGlua3NcIiBpZD1cImV4dGVybl9saW5rc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWVudUl0ZW0gaHJlZj17ZW1wbG95ZWVVcmx9IGV2ZW50S2V5PXs1LjF9Pk1lZGFyYmVqZGVyIGgmYXJpbmc7bmRib2c8L01lbnVJdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWVudUl0ZW0gaHJlZj17YzVTZWFyY2hVcmx9IGV2ZW50S2V5PXs1LjJ9PkM1IFMmb3NsYXNoO2duaW5nPC9NZW51SXRlbT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L05hdkRyb3Bkb3duPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5Db2xsYXBzZT5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9OYXZiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmVycm9yVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvR3JpZD5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgTWFpbiA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFNoZWxsKTtcclxuZXhwb3J0IGRlZmF1bHQgTWFpbjtcclxuIiwi77u/ZXhwb3J0IGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnXHJcbn0iLCLvu79pbXBvcnQgeyB1bmlxLCBmbGF0dGVuIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCBtYXJrZWQgZnJvbSAnbWFya2VkJ1xyXG5pbXBvcnQgcmVtb3ZlTWQgZnJvbSAncmVtb3ZlLW1hcmtkb3duJ1xyXG5cclxudmFyIGN1cnJ5ID0gZnVuY3Rpb24oZiwgbmFyZ3MsIGFyZ3MpIHtcclxuICAgIG5hcmdzID0gaXNGaW5pdGUobmFyZ3MpID8gbmFyZ3MgOiBmLmxlbmd0aDtcclxuICAgIGFyZ3MgPSBhcmdzIHx8IFtdO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIDEuIGFjY3VtdWxhdGUgYXJndW1lbnRzXHJcbiAgICAgICAgdmFyIG5ld0FyZ3MgPSBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgICBpZiAobmV3QXJncy5sZW5ndGggPj0gbmFyZ3MpIHtcclxuICAgICAgICAgICAgLy8gYXBwbHkgYWNjdW11bGF0ZWQgYXJndW1lbnRzXHJcbiAgICAgICAgICAgIHJldHVybiBmLmFwcGx5KHRoaXMsIG5ld0FyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAyLiByZXR1cm4gYW5vdGhlciBjdXJyaWVkIGZ1bmN0aW9uXHJcbiAgICAgICAgcmV0dXJuIGN1cnJ5KGYsIG5hcmdzLCBuZXdBcmdzKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjdXJyeTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRGdWxsTmFtZSA9ICh1c2VyLCBub25lID0gJycpID0+IHtcclxuICAgIGlmKCF1c2VyKSByZXR1cm4gbm9uZTtcclxuICAgIHJldHVybiBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWA7XHJcbn1cclxuXHJcbmNvbnN0IGNvdW50Q29tbWVudCA9ICh0b3BDb21tZW50KSA9PiB7XHJcbiAgICBsZXQgY291bnQgPSAxO1xyXG4gICAgbGV0IHJlbW92ZWQgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BDb21tZW50LlJlcGxpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IHRvcENvbW1lbnQuUmVwbGllc1tpXTtcclxuXHJcbiAgICAgICAgLy8gRXhjbHVkZSBkZWxldGVkIGNvbW1lbnRzXHJcbiAgICAgICAgaWYoY2hpbGQuRGVsZXRlZCkge1xyXG4gICAgICAgICAgICByZW1vdmVkKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb3VudCArPSBjb3VudENvbW1lbnQoY2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb3VudC1yZW1vdmVkO1xyXG59XHJcblxyXG5jb25zdCBjb3VudENvbW1lbnRzID0gKGNvbW1lbnRzID0gW10pID0+IHtcclxuICAgIGxldCB0b3RhbCA9IDA7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHRvcENvbW1lbnQgPSBjb21tZW50c1tpXTtcclxuICAgICAgICB0b3RhbCArPSBjb3VudENvbW1lbnQodG9wQ29tbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRvdGFsO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplSW1hZ2UgPSAoaW1nKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIEltYWdlSUQ6IGltZy5JbWFnZUlELFxyXG4gICAgICAgIEZpbGVuYW1lOiBpbWcuRmlsZW5hbWUsXHJcbiAgICAgICAgRXh0ZW5zaW9uOiBpbWcuRXh0ZW5zaW9uLFxyXG4gICAgICAgIE9yaWdpbmFsVXJsOiBpbWcuT3JpZ2luYWxVcmwsXHJcbiAgICAgICAgUHJldmlld1VybDogaW1nLlByZXZpZXdVcmwsXHJcbiAgICAgICAgVGh1bWJuYWlsVXJsOiBpbWcuVGh1bWJuYWlsVXJsLFxyXG4gICAgICAgIENvbW1lbnRDb3VudDogaW1nLkNvbW1lbnRDb3VudCxcclxuICAgICAgICBVcGxvYWRlZDogbmV3IERhdGUoaW1nLlVwbG9hZGVkKSxcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVDb21tZW50ID0gKGNvbW1lbnQpID0+IHtcclxuICAgIGxldCByID0gY29tbWVudC5SZXBsaWVzID8gY29tbWVudC5SZXBsaWVzIDogW107XHJcbiAgICBjb25zdCByZXBsaWVzID0gci5tYXAobm9ybWFsaXplQ29tbWVudCk7XHJcbiAgICBjb25zdCBhdXRob3JJZCA9IChjb21tZW50LkRlbGV0ZWQpID8gLTEgOiBjb21tZW50LkF1dGhvci5JRDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgQ29tbWVudElEOiBjb21tZW50LklELFxyXG4gICAgICAgIEF1dGhvcklEOiBhdXRob3JJZCxcclxuICAgICAgICBEZWxldGVkOiBjb21tZW50LkRlbGV0ZWQsXHJcbiAgICAgICAgUG9zdGVkT246IGNvbW1lbnQuUG9zdGVkT24sXHJcbiAgICAgICAgVGV4dDogY29tbWVudC5UZXh0LFxyXG4gICAgICAgIFJlcGxpZXM6IHJlcGxpZXMsXHJcbiAgICAgICAgRWRpdGVkOiBjb21tZW50LkVkaXRlZFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplTGF0ZXN0ID0gKGxhdGVzdCkgPT4ge1xyXG4gICAgbGV0IGl0ZW0gPSBudWxsO1xyXG4gICAgbGV0IGF1dGhvcklkID0gLTE7XHJcbiAgICBpZihsYXRlc3QuVHlwZSA9PSAxKSB7XHJcbiAgICAgICAgLy8gSW1hZ2UgLSBvbWl0IEF1dGhvciBhbmQgQ29tbWVudENvdW50XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBsYXRlc3QuSXRlbTtcclxuICAgICAgICBpdGVtID0ge1xyXG4gICAgICAgICAgICBFeHRlbnNpb246IGltYWdlLkV4dGVuc2lvbixcclxuICAgICAgICAgICAgRmlsZW5hbWU6IGltYWdlLkZpbGVuYW1lLFxyXG4gICAgICAgICAgICBJbWFnZUlEOiBpbWFnZS5JbWFnZUlELFxyXG4gICAgICAgICAgICBPcmlnaW5hbFVybDogaW1hZ2UuT3JpZ2luYWxVcmwsXHJcbiAgICAgICAgICAgIFByZXZpZXdVcmw6IGltYWdlLlByZXZpZXdVcmwsXHJcbiAgICAgICAgICAgIFRodW1ibmFpbFVybDogaW1hZ2UuVGh1bWJuYWlsVXJsLFxyXG4gICAgICAgICAgICBVcGxvYWRlZDogaW1hZ2UuVXBsb2FkZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGF1dGhvcklkID0gbGF0ZXN0Lkl0ZW0uQXV0aG9yLklEO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobGF0ZXN0LlR5cGUgPT0gMikge1xyXG4gICAgICAgIC8vIENvbW1lbnQgLSBvbWl0IEF1dGhvciBhbmQgRGVsZXRlZCBhbmQgUmVwbGllc1xyXG4gICAgICAgIGNvbnN0IGNvbW1lbnQgPSBsYXRlc3QuSXRlbTtcclxuICAgICAgICBpdGVtID0ge1xyXG4gICAgICAgICAgICBJRDogY29tbWVudC5JRCxcclxuICAgICAgICAgICAgVGV4dDogY29tbWVudC5UZXh0LFxyXG4gICAgICAgICAgICBJbWFnZUlEOiBjb21tZW50LkltYWdlSUQsXHJcbiAgICAgICAgICAgIEltYWdlVXBsb2FkZWRCeTogY29tbWVudC5JbWFnZVVwbG9hZGVkQnksXHJcbiAgICAgICAgICAgIEZpbGVuYW1lOiBjb21tZW50LkZpbGVuYW1lXHJcbiAgICAgICAgfTtcclxuICAgICAgICBhdXRob3JJZCA9IGxhdGVzdC5JdGVtLkF1dGhvci5JRDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxhdGVzdC5UeXBlID09IDQpIHtcclxuICAgICAgICBjb25zdCBwb3N0ID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgSUQ6IHBvc3QuVGhyZWFkSUQsXHJcbiAgICAgICAgICAgIFRpdGxlOiBwb3N0LkhlYWRlci5UaXRsZSxcclxuICAgICAgICAgICAgVGV4dDogcG9zdC5UZXh0LFxyXG4gICAgICAgICAgICBTdGlja3k6IHBvc3QuSGVhZGVyLlN0aWNreSxcclxuICAgICAgICAgICAgQ29tbWVudENvdW50OiBwb3N0LkhlYWRlci5Db21tZW50Q291bnRcclxuICAgICAgICB9XHJcbiAgICAgICAgYXV0aG9ySWQgPSBwb3N0LkhlYWRlci5BdXRob3IuSUQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBJRDogbGF0ZXN0LklELFxyXG4gICAgICAgIFR5cGU6IGxhdGVzdC5UeXBlLFxyXG4gICAgICAgIEl0ZW06IGl0ZW0sXHJcbiAgICAgICAgT246IGxhdGVzdC5PbixcclxuICAgICAgICBBdXRob3JJRDogYXV0aG9ySWQsXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVUaHJlYWRUaXRsZSA9ICh0aXRsZSkgPT4ge1xyXG4gICAgY29uc3Qgdmlld2VkQnkgPSB0aXRsZS5WaWV3ZWRCeS5tYXAodXNlciA9PiB1c2VyLklEKTtcclxuICAgIGNvbnN0IGxhdGVzdENvbW1lbnQgPSB0aXRsZS5MYXRlc3RDb21tZW50ID8gbm9ybWFsaXplQ29tbWVudCh0aXRsZS5MYXRlc3RDb21tZW50KSA6IG51bGw7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiB0aXRsZS5JRCxcclxuICAgICAgICBJc1B1Ymxpc2hlZDogdGl0bGUuSXNQdWJsaXNoZWQsXHJcbiAgICAgICAgU3RpY2t5OiB0aXRsZS5TdGlja3ksXHJcbiAgICAgICAgQ3JlYXRlZE9uOiB0aXRsZS5DcmVhdGVkT24sXHJcbiAgICAgICAgQXV0aG9ySUQ6IHRpdGxlLkF1dGhvci5JRCxcclxuICAgICAgICBEZWxldGVkOiB0aXRsZS5EZWxldGVkLFxyXG4gICAgICAgIElzTW9kaWZpZWQ6IHRpdGxlLklzTW9kaWZpZWQsXHJcbiAgICAgICAgVGl0bGU6IHRpdGxlLlRpdGxlLFxyXG4gICAgICAgIExhc3RNb2RpZmllZDogdGl0bGUuTGFzdE1vZGlmaWVkLFxyXG4gICAgICAgIExhdGVzdENvbW1lbnQ6IGxhdGVzdENvbW1lbnQsXHJcbiAgICAgICAgQ29tbWVudENvdW50OiB0aXRsZS5Db21tZW50Q291bnQsXHJcbiAgICAgICAgVmlld2VkQnk6IHZpZXdlZEJ5LFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdmlzaXRDb21tZW50cyA9IChjb21tZW50cywgZnVuYykgPT4ge1xyXG4gICAgY29uc3QgZ2V0UmVwbGllcyA9IChjKSA9PiBjLlJlcGxpZXMgPyBjLlJlcGxpZXMgOiBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKGNvbW1lbnRzW2ldLCBnZXRSZXBsaWVzLCBmdW5jKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlcHRoRmlyc3RTZWFyY2ggPSAoY3VycmVudCwgZ2V0Q2hpbGRyZW4sIGZ1bmMpID0+IHtcclxuICAgIGZ1bmMoY3VycmVudCk7XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IGdldENoaWxkcmVuKGN1cnJlbnQpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRlcHRoRmlyc3RTZWFyY2goY2hpbGRyZW5baV0sIGdldENoaWxkcmVuLCBmdW5jKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVuaW9uKGFycjEsIGFycjIsIGVxdWFsaXR5RnVuYykge1xyXG4gICAgdmFyIHVuaW9uID0gYXJyMS5jb25jYXQoYXJyMik7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bmlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAodmFyIGogPSBpKzE7IGogPCB1bmlvbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoZXF1YWxpdHlGdW5jKHVuaW9uW2ldLCB1bmlvbltqXSkpIHtcclxuICAgICAgICAgICAgICAgIHVuaW9uLnNwbGljZShqLCAxKTtcclxuICAgICAgICAgICAgICAgIGotLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdW5pb247XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybCA9IChpbWFnZUlkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4gYCR7Z2xvYmFscy51cmxzLmltYWdlY29tbWVudHN9P2ltYWdlSWQ9JHtpbWFnZUlkfSZza2lwPSR7c2tpcH0mdGFrZT0ke3Rha2V9YDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEltYWdlQ29tbWVudHNEZWxldGVVcmwgPSAoY29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4gYCR7Z2xvYmFscy51cmxzLmltYWdlY29tbWVudHN9P2NvbW1lbnRJZD0ke2NvbW1lbnRJZH1gO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwgPSAocG9zdElkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4gYCR7Z2xvYmFscy51cmxzLmZvcnVtY29tbWVudHN9P3Bvc3RJZD0ke3Bvc3RJZH0mc2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRGb3J1bUNvbW1lbnRzRGVsZXRlVXJsID0gKGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIGAke2dsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzfT9jb21tZW50SWQ9JHtjb21tZW50SWR9YDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGZvcm1hdFRleHQgPSAodGV4dCkgPT4ge1xyXG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICB2YXIgcmF3TWFya3VwID0gbWFya2VkKHRleHQsIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICByZXR1cm4geyBfX2h0bWw6IHJhd01hcmt1cCB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0V29yZHMgPSAodGV4dCwgbnVtYmVyT2ZXb3JkcykgPT4ge1xyXG4gICAgaWYoIXRleHQpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgcGxhaW5UZXh0ID0gcmVtb3ZlTWQodGV4dCk7XHJcbiAgICByZXR1cm4gcGxhaW5UZXh0LnNwbGl0KC9cXHMrLykuc2xpY2UoMCwgbnVtYmVyT2ZXb3Jkcykuam9pbihcIiBcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB0aW1lVGV4dCA9IChwb3N0ZWRPbikgPT4ge1xyXG4gICAgY29uc3QgYWdvID0gbW9tZW50KHBvc3RlZE9uKS5mcm9tTm93KCk7XHJcbiAgICBjb25zdCBkaWZmID0gbW9tZW50KCkuZGlmZihwb3N0ZWRPbiwgJ2hvdXJzJywgdHJ1ZSk7XHJcbiAgICBpZiAoZGlmZiA+PSAxMi41KSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBtb21lbnQocG9zdGVkT24pO1xyXG4gICAgICAgIHJldHVybiBcImQuIFwiICsgZGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKSArIFwia2wuIFwiICsgZGF0ZS5mb3JtYXQoXCJIOm1tXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBcImZvciBcIiArIGFnbztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc3BvbnNlSGFuZGxlciA9IChkaXNwYXRjaCwgcmVzcG9uc2UpID0+IHtcclxuICAgIGlmIChyZXNwb25zZS5vaykgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgNDAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjQwMCBCYWQgUmVxdWVzdFwiLCBcIlRoZSByZXF1ZXN0IHdhcyBub3Qgd2VsbC1mb3JtZWRcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDQgTm90IEZvdW5kXCIsIFwiQ291bGQgbm90IGZpbmQgcmVzb3VyY2VcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwODpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDggUmVxdWVzdCBUaW1lb3V0XCIsIFwiVGhlIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgaW4gdGltZVwiKSkpO1xyXG4gICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI1MDAgU2VydmVyIEVycm9yXCIsIFwiU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgQVBJLXNlcnZlclwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihuZXcgSHR0cEVycm9yKFwiT29wc1wiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG9uUmVqZWN0ID0gKCkgPT4geyB9XHJcblxyXG5leHBvcnQgY29uc3QgcHV0ID0gKG9iaiwga2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgbGV0IGt2ID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqKTtcclxuICAgIGt2W2tleV0gPSB2YWx1ZTtcclxuICAgIHJldHVybiBrdjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG9iak1hcCA9IChhcnIsIGtleSwgdmFsKSA9PiB7XHJcbiAgICBjb25zdCBvYmogPSBhcnIucmVkdWNlKChyZXMsIGl0ZW0pID0+IHtcclxuICAgICAgICBjb25zdCBrID0ga2V5KGl0ZW0pO1xyXG4gICAgICAgIGNvbnN0IHYgPSB2YWwoaXRlbSk7XHJcbiAgICAgICAgcmVzW2tdID0gdjtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSwge30pO1xyXG5cclxuICAgIHJldHVybiBvYmpcclxufVxyXG4iLCLvu79pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IG9iak1hcCwgcmVzcG9uc2VIYW5kbGVyLCBvblJlamVjdCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IGdldFVybCA9ICh1c2VybmFtZSkgPT4gZ2xvYmFscy51cmxzLnVzZXJzICsgJz91c2VybmFtZT0nICsgdXNlcm5hbWU7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3VycmVudFVzZXJJZChpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9DVVJSRU5UX1VTRVJfSUQsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkVXNlcih1c2VyKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX1VTRVIsXHJcbiAgICAgICAgdXNlcjogdXNlclxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY2lldmVkVXNlcnModXNlcnMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRUNJRVZFRF9VU0VSUyxcclxuICAgICAgICB1c2VyczogdXNlcnNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoQ3VycmVudFVzZXIodXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIHZhciB1cmwgPSBnZXRVcmwodXNlcm5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbih1c2VyID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEN1cnJlbnRVc2VySWQodXNlci5JRCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkVXNlcih1c2VyKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoVXNlcih1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIHZhciB1cmwgPSBnZXRVcmwodXNlcm5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbih1c2VyID0+IGRpc3BhdGNoKGFkZFVzZXIodXNlcikpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFVzZXJzKCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2goZ2xvYmFscy51cmxzLnVzZXJzLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbih1c2VycyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnZXRLZXkgPSAodXNlcikgPT4gdXNlci5JRDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdldFZhbHVlID0gKHVzZXIpID0+IHVzZXI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBvYmpNYXAodXNlcnMsIGdldEtleSwgZ2V0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2gocmVjaWV2ZWRVc2VycyhvYmopKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0LCBub3JtYWxpemVMYXRlc3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldExhdGVzdChsYXRlc3QpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfTEFURVNULFxyXG4gICAgICAgIGxhdGVzdDogbGF0ZXN0XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRTS2lwKHNraXApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0tJUF9XSEFUU19ORVcsXHJcbiAgICAgICAgc2tpcDogc2tpcFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VGFrZSh0YWtlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RBS0VfV0hBVFNfTkVXLFxyXG4gICAgICAgIHRha2U6IHRha2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFBhZ2UocGFnZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9QQUdFX1dIQVRTX05FVyxcclxuICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUb3RhbFBhZ2VzKHRvdGFsUGFnZXMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMud2hhdHNuZXcgKyBcIj9za2lwPVwiICsgc2tpcCArIFwiJnRha2U9XCIgKyB0YWtlO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4ocGFnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IHBhZ2UuQ3VycmVudEl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdXRob3IgPSBpdGVtLkl0ZW0uQXV0aG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGF1dGhvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkVXNlcihhdXRob3IpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlc2V0IGluZm9cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFNLaXAoc2tpcCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZSh0YWtlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRQYWdlKHBhZ2UuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMocGFnZS5Ub3RhbFBhZ2VzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGl0ZW1zLm1hcChub3JtYWxpemVMYXRlc3QpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0TGF0ZXN0KG5vcm1hbGl6ZWQpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgSW1hZ2UsIE1lZGlhIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnRQcm9maWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxNZWRpYS5MZWZ0IGNsYXNzTmFtZT1cImNvbW1lbnQtcHJvZmlsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM9XCIvaW1hZ2VzL3BlcnNvbl9pY29uLnN2Z1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjY0cHhcIiwgaGVpZ2h0OiBcIjY0cHhcIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtZWRpYS1vYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICA8L01lZGlhLkxlZnQ+XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBNZWRpYSwgR2x5cGhpY29uLCBPdmVybGF5VHJpZ2dlciwgVG9vbHRpcCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld1Rvb2x0aXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgdG9vbHRpcFZpZXcodGlwKSB7XHJcbiAgICAgICAgcmV0dXJuICA8VG9vbHRpcCBpZD1cInRvb2x0aXBcIj57dGlwfTwvVG9vbHRpcD5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b29sdGlwLCBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxPdmVybGF5VHJpZ2dlciBwbGFjZW1lbnQ9XCJsZWZ0XCIgb3ZlcmxheT17dGhpcy50b29sdGlwVmlldyh0b29sdGlwKX0+XHJcbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9PdmVybGF5VHJpZ2dlcj5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudFByb2ZpbGUnXHJcbmltcG9ydCB7IFdoYXRzTmV3VG9vbHRpcCB9IGZyb20gJy4vV2hhdHNOZXdUb29sdGlwJ1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuaW1wb3J0IHsgdGltZVRleHQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IEltYWdlLCBHbHlwaGljb24sIE92ZXJsYXlUcmlnZ2VyLCBUb29sdGlwIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3SXRlbUltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHdoZW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJ1cGxvYWRlZGUgXCIgKyB0aW1lVGV4dChvbik7XHJcbiAgICB9XHJcblxyXG4gICAgb3ZlcmxheSgpIHtcclxuICAgICAgICByZXR1cm4gPFRvb2x0aXAgaWQ9XCJ0b29sdGlwX2ltZ1wiPkJydWdlciBiaWxsZWRlPC9Ub29sdGlwPlxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIGNvbW1lbnRJZCwgYXV0aG9yLCBmaWxlbmFtZSwgZXh0ZW5zaW9uLCB0aHVtYm5haWwgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWUgPSBhdXRob3IuVXNlcm5hbWU7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IGAke2ZpbGVuYW1lfS4ke2V4dGVuc2lvbn1gO1xyXG4gICAgICAgIGNvbnN0IGxpbmsgPSBgJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlSWR9YFxyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHthdXRob3IuRmlyc3ROYW1lfSAke2F1dGhvci5MYXN0TmFtZX1gO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxXaGF0c05ld1Rvb2x0aXAgdG9vbHRpcD1cIlVwbG9hZGV0IGJpbGxlZGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8TWVkaWEuTGlzdEl0ZW0gY2xhc3NOYW1lPVwid2hhdHNuZXdJdGVtIGhvdmVyLXNoYWRvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFByb2ZpbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17bGlua30+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbWFnZSBzcmM9e3RodW1ibmFpbH0gdGh1bWJuYWlsIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb290ZXI+e25hbWV9IHt0aGlzLndoZW4oKX08YnIgLz48R2x5cGhpY29uIGdseXBoPVwicGljdHVyZVwiIC8+IHtmaWxlfTwvZm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L01lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5MaXN0SXRlbT5cclxuICAgICAgICAgICAgICAgIDwvV2hhdHNOZXdUb29sdGlwPlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50UHJvZmlsZSdcclxuaW1wb3J0IHsgV2hhdHNOZXdUb29sdGlwIH0gZnJvbSAnLi9XaGF0c05ld1Rvb2x0aXAnXHJcbmltcG9ydCB7IGZvcm1hdFRleHQsIGdldFdvcmRzLCB0aW1lVGV4dCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgTWVkaWEsIEdseXBoaWNvbiB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1Db21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNyZWF0ZVN1bW1hcnkoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBmb3JtYXRUZXh0KGdldFdvcmRzKHRleHQsIDUpICsgXCIuLi5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVsbG5hbWUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIGF1dGhvci5GaXJzdE5hbWUgKyAnICcgKyBhdXRob3IuTGFzdE5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgd2hlbigpIHtcclxuICAgICAgICBjb25zdCB7IG9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBcInNhZ2RlIFwiICsgdGltZVRleHQob24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIHVwbG9hZGVkQnksIGNvbW1lbnRJZCwgYXV0aG9yLCBmaWxlbmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB1c2VybmFtZSA9IHVwbG9hZGVkQnkuVXNlcm5hbWU7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMuZnVsbG5hbWUoKTtcclxuICAgICAgICBjb25zdCBzdW1tYXJ5ID0gdGhpcy5jcmVhdGVTdW1tYXJ5KCk7XHJcbiAgICAgICAgY29uc3QgbGluayA9IGAke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2VJZH0vY29tbWVudD9pZD0ke2NvbW1lbnRJZH1gXHJcbiAgICAgICAgcmV0dXJuICA8V2hhdHNOZXdUb29sdGlwIHRvb2x0aXA9XCJLb21tZW50YXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8TWVkaWEuTGlzdEl0ZW0gY2xhc3NOYW1lPVwid2hhdHNuZXdJdGVtIGhvdmVyLXNoYWRvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFByb2ZpbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17bGlua30+PGVtPjxwIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtzdW1tYXJ5fT48L3A+PC9lbT48L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvb3Rlcj57bmFtZX0ge3RoaXMud2hlbigpfTxiciAvPjxHbHlwaGljb24gZ2x5cGg9XCJjb21tZW50XCIgLz4ge2ZpbGVuYW1lfTwvZm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L01lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5MaXN0SXRlbT5cclxuICAgICAgICAgICAgICAgIDwvV2hhdHNOZXdUb29sdGlwPlxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgV2hhdHNOZXdUb29sdGlwIH0gZnJvbSAnLi9XaGF0c05ld1Rvb2x0aXAnXHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudFByb2ZpbGUnXHJcbmltcG9ydCB7IGZvcm1hdFRleHQsIGdldFdvcmRzLCB0aW1lVGV4dCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgTWVkaWEsIEdseXBoaWNvbiwgT3ZlcmxheVRyaWdnZXIsIFRvb2x0aXAgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdGb3J1bVBvc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zaG93TW9kYWwgPSB0aGlzLnNob3dNb2RhbC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bGxuYW1lKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBhdXRob3IuRmlyc3ROYW1lICsgJyAnICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHdoZW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJpbmRsw6ZnIFwiICsgdGltZVRleHQob24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN1bW1hcnkoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBnZXRXb3Jkcyh0ZXh0LCA1KTtcclxuICAgIH1cclxuXHJcbiAgICBvdmVybGF5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudENvdW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiA8VG9vbHRpcCBpZD1cInRvb2x0aXBfcG9zdFwiPkZvcnVtIGluZGwmYWVsaWc7ZywgYW50YWwga29tbWVudGFyZXI6IHtjb21tZW50Q291bnR9PC9Ub29sdGlwPlxyXG4gICAgfVxyXG5cclxuICAgIHNob3dNb2RhbChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHByZXZpZXcsIGluZGV4IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHByZXZpZXcoaW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlLCBwb3N0SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMuZnVsbG5hbWUoKTtcclxuICAgICAgICBjb25zdCBsaW5rID0gYGZvcnVtL3Bvc3QvJHtwb3N0SWR9L2NvbW1lbnRzYDtcclxuICAgICAgICAgcmV0dXJuIDxXaGF0c05ld1Rvb2x0aXAgdG9vbHRpcD1cIkZvcnVtIGluZGzDpmdcIj5cclxuICAgICAgICAgICAgICAgICAgICA8TWVkaWEuTGlzdEl0ZW0gY2xhc3NOYW1lPVwid2hhdHNuZXdJdGVtIGhvdmVyLXNoYWRvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFByb2ZpbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuc2hvd01vZGFsfT57dGhpcy5zdW1tYXJ5KCl9Li4uPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb290ZXI+e25hbWV9IHt0aGlzLndoZW4oKX08YnIgLz48R2x5cGhpY29uIGdseXBoPVwibGlzdC1hbHRcIiAvPiB7dGl0bGV9PC9mb290ZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Jsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTWVkaWEuQm9keT5cclxuICAgICAgICAgICAgICAgICAgICA8L01lZGlhLkxpc3RJdGVtPlxyXG4gICAgICAgICAgICAgICAgPC9XaGF0c05ld1Rvb2x0aXA+XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBXaGF0c05ld0l0ZW1JbWFnZSB9IGZyb20gJy4vV2hhdHNOZXdJdGVtSW1hZ2UnXHJcbmltcG9ydCB7IFdoYXRzTmV3SXRlbUNvbW1lbnQgfSBmcm9tICcuL1doYXRzTmV3SXRlbUNvbW1lbnQnXHJcbmltcG9ydCB7IFdoYXRzTmV3Rm9ydW1Qb3N0IH0gZnJvbSAnLi9XaGF0c05ld0ZvcnVtUG9zdCdcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucHJldmlld1Bvc3RIYW5kbGUgPSB0aGlzLnByZXZpZXdQb3N0SGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJldmlld1Bvc3RIYW5kbGUoaW5kZXgpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1zLCBwcmV2aWV3IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpbmRleF07XHJcbiAgICAgICAgcHJldmlldyhpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RJdGVtcygpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1zLCBnZXRVc2VyLCBwcmV2aWV3IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGdlbmVyYXRlS2V5ID0gKGlkKSA9PiBcIndoYXRzbmV3X1wiICsgaWQ7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zLm1hcCggKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1LZXkgPSBnZW5lcmF0ZUtleShpdGVtLklEKTtcclxuICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gZ2V0VXNlcihpdGVtLkF1dGhvcklEKTtcclxuICAgICAgICAgICAgc3dpdGNoIChpdGVtLlR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxXaGF0c05ld0l0ZW1JbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtpdGVtLklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uPXtpdGVtLk9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e2l0ZW0uSXRlbS5JbWFnZUlEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lPXtpdGVtLkl0ZW0uRmlsZW5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uPXtpdGVtLkl0ZW0uRXh0ZW5zaW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRodW1ibmFpbD17aXRlbS5JdGVtLlRodW1ibmFpbFVybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aWV3PXtpdGVtLkl0ZW0uUHJldmlld1VybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I9e2F1dGhvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW1LZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAgPFdoYXRzTmV3SXRlbUNvbW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17aXRlbS5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50SWQ9e2l0ZW0uSXRlbS5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXtpdGVtLkl0ZW0uVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRlZEJ5PXtpdGVtLkl0ZW0uSW1hZ2VVcGxvYWRlZEJ5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e2l0ZW0uSXRlbS5JbWFnZUlEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uPXtpdGVtLk9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcj17YXV0aG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lPXtpdGVtLkl0ZW0uRmlsZW5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtS2V5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxXaGF0c05ld0ZvcnVtUG9zdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uPXtpdGVtLk9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcj17YXV0aG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtpdGVtLkl0ZW0uVGl0bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17aXRlbS5JdGVtLlRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RpY2t5PXtpdGVtLkl0ZW0uU3RpY2t5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RJZD17aXRlbS5JdGVtLklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRDb3VudD17aXRlbS5JdGVtLkNvbW1lbnRDb3VudH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aWV3PXt0aGlzLnByZXZpZXdQb3N0SGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpbmRleH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW1LZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbU5vZGVzID0gdGhpcy5jb25zdHJ1Y3RJdGVtcygpO1xyXG4gICAgICAgIHJldHVybiAgPE1lZGlhLkxpc3Q+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW1Ob2Rlc31cclxuICAgICAgICAgICAgICAgIDwvTWVkaWEuTGlzdD5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IEZvcm1Hcm91cCwgQ29udHJvbExhYmVsLCBGb3JtQ29udHJvbCwgQnV0dG9uLCBSb3csIENvbCwgTW9kYWwsIEJ1dHRvbkdyb3VwLCBDaGVja2JveCwgR2x5cGhpY29uIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEZvcnVtRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBUaXRsZTogJycsXHJcbiAgICAgICAgICAgIFRleHQ6ICcnLFxyXG4gICAgICAgICAgICBTdGlja3k6IGZhbHNlLFxyXG4gICAgICAgICAgICBJc1B1Ymxpc2hlZDogdHJ1ZSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdCB9ID0gbmV4dFByb3BzO1xyXG4gICAgICAgIGlmKGVkaXQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICBUaXRsZTogZWRpdC5UaXRsZSxcclxuICAgICAgICAgICAgICAgIFRleHQ6IGVkaXQuVGV4dCxcclxuICAgICAgICAgICAgICAgIFN0aWNreTogZWRpdC5TdGlja3ksXHJcbiAgICAgICAgICAgICAgICBJc1B1Ymxpc2hlZDogZWRpdC5Jc1B1Ymxpc2hlZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVGl0bGVDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUaXRsZTogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFZhbGlkYXRpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5zdGF0ZS5UaXRsZS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGxlbmd0aCA+IDAgJiYgbGVuZ3RoIDwgMjAwKSByZXR1cm4gJ3N1Y2Nlc3MnO1xyXG4gICAgICAgIGlmIChsZW5ndGggPj0gMjAwICYmIGxlbmd0aCA8PSAyNTApIHJldHVybiAnd2FybmluZyc7XHJcbiAgICAgICAgaWYgKGxlbmd0aCA+IDI1MCkgcmV0dXJuICdlcnJvcic7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtVG9EVE8oc3RhdGUpIHtcclxuICAgICAgICAvLyBBIFRocmVhZFBvc3RDb250ZW50IGNsYXNzXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgSGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICBJc1B1Ymxpc2hlZDogc3RhdGUuSXNQdWJsaXNoZWQsXHJcbiAgICAgICAgICAgICAgICBTdGlja3k6IHN0YXRlLlN0aWNreSxcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBzdGF0ZS5UaXRsZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBUZXh0OiBzdGF0ZS5UZXh0XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVN1Ym1pdChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IHsgY2xvc2UsIG9uU3VibWl0IH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAvLyBEbyB3aGF0ZXZlciB3b3JrIGhlcmUuLi5cclxuICAgICAgICBjb25zdCBwb3N0ID0gdGhpcy50cmFuc2Zvcm1Ub0RUTyh0aGlzLnN0YXRlKTtcclxuICAgICAgICBvblN1Ym1pdChwb3N0KTtcclxuICAgICAgICBjbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVN0aWNreSgpIHtcclxuICAgICAgICBjb25zdCB7IFN0aWNreSB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgU3RpY2t5OiAhU3RpY2t5IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVB1Ymxpc2hlZCgpIHtcclxuICAgICAgICBjb25zdCB7IElzUHVibGlzaGVkIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBJc1B1Ymxpc2hlZDogIUlzUHVibGlzaGVkIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xvc2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBzaG93LCBlZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlYWRNb2RlID0gQm9vbGVhbighZWRpdCk7XHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSAgcmVhZE1vZGUgPyAnU2tyaXYgbnl0IGluZGzDpmcnIDogJ8OGbmRyZSBpbmRsw6ZnJztcclxuICAgICAgICBjb25zdCBidG5TdWJtaXQgPSByZWFkTW9kZSA/ICdTa3JpdiBpbmRsw6ZnJyA6ICdHZW0gw6ZuZHJpbmdlcic7XHJcbiAgICAgICAgcmV0dXJuICA8TW9kYWwgc2hvdz17c2hvd30gb25IaWRlPXt0aGlzLmNsb3NlSGFuZGxlLmJpbmQodGhpcyl9IGJzU2l6ZT1cImxnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbC5IZWFkZXIgY2xvc2VCdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWwuVGl0bGU+e3RpdGxlfTwvTW9kYWwuVGl0bGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTW9kYWwuSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWwuQm9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17MTJ9PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtR3JvdXAgY29udHJvbElkPVwiZm9ybVBvc3RUaXRsZVwiIHZhbGlkYXRpb25TdGF0ZT17dGhpcy5nZXRWYWxpZGF0aW9uKCl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb250cm9sTGFiZWw+T3ZlcnNrcmlmdDwvQ29udHJvbExhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtQ29udHJvbCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiT3ZlcnNrcmlmdCBww6UgaW5kbMOmZy4uLlwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRpdGxlQ2hhbmdlLmJpbmQodGhpcyl9IHZhbHVlPXt0aGlzLnN0YXRlLlRpdGxlfS8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwIGNvbnRyb2xJZD1cImZvcm1Qb3N0Q29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb250cm9sTGFiZWw+SW5kbCZhZWxpZztnPC9Db250cm9sTGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sIGNvbXBvbmVudENsYXNzPVwidGV4dGFyZWFcIiBwbGFjZWhvbGRlcj1cIlNrcml2IGJlc2tlZCBoZXIuLi5cIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyl9IHZhbHVlPXt0aGlzLnN0YXRlLlRleHR9IHJvd3M9XCI4XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvRm9ybUdyb3VwPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtR3JvdXAgY29udHJvbElkPVwiZm9ybVBvc3RTdGlja3lcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cInN1Y2Nlc3NcIiBic1NpemU9XCJzbWFsbFwiIGFjdGl2ZT17dGhpcy5zdGF0ZS5TdGlja3l9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3RpY2t5LmJpbmQodGhpcyl9PjxHbHlwaGljb24gZ2x5cGg9XCJwdXNocGluXCIgLz4gVmlndGlnPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvRm9ybUdyb3VwPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L01vZGFsLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbC5Gb290ZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGJzU3R5bGU9XCJkZWZhdWx0XCIgb25DbGljaz17dGhpcy5jbG9zZUhhbmRsZS5iaW5kKHRoaXMpfT5MdWs8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cInByaW1hcnlcIiB0eXBlPVwic3VibWl0XCIgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9PntidG5TdWJtaXR9PC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTW9kYWwuRm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvTW9kYWw+XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQnV0dG9uVG9vbGJhciwgQnV0dG9uR3JvdXAsIE92ZXJsYXlUcmlnZ2VyLCBCdXR0b24sIEdseXBoaWNvbiwgVG9vbHRpcCwgQ29sbGFwc2UsIEZvcm1Hcm91cCwgRm9ybUNvbnRyb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudENvbnRyb2xzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHRleHQ6IHByb3BzLnRleHQsXHJcbiAgICAgICAgICAgIHJlcGx5VGV4dDogJycsXHJcbiAgICAgICAgICAgIHJlcGx5OiBmYWxzZSxcclxuICAgICAgICAgICAgZWRpdDogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRvZ2dsZUVkaXQgPSB0aGlzLnRvZ2dsZUVkaXQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRvZ2dsZVJlcGx5ID0gdGhpcy50b2dnbGVSZXBseS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRIYW5kbGUgPSB0aGlzLmVkaXRIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlcGx5SGFuZGxlID0gdGhpcy5yZXBseUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSGFuZGxlID0gdGhpcy5kZWxldGVIYW5kbGUuYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVSZXBseUNoYW5nZSA9IHRoaXMuaGFuZGxlUmVwbHlDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlUmVwbHlDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXBseVRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlRWRpdCgpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6ICFlZGl0IH0pO1xyXG4gICAgICAgIGlmKCFlZGl0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVJlcGx5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHkgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5OiAhcmVwbHkgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVsZXRlQ29tbWVudCwgY29tbWVudElkLCBjb250ZXh0SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZGVsZXRlQ29tbWVudChjb21tZW50SWQsIGNvbnRleHRJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdEhhbmRsZSgpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRDb21tZW50LCBjb250ZXh0SWQsIGNvbW1lbnRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMuc3RhdGU7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0OiBmYWxzZSB9KTtcclxuICAgICAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIGNvbnRleHRJZCwgdGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbHlIYW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50SWQsIGNvbnRleHRJZCwgcmVwbHlDb21tZW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlUZXh0IH0gPSB0aGlzLnN0YXRlO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6IGZhbHNlLCByZXBseVRleHQ6ICcnIH0pO1xyXG4gICAgICAgIHJlcGx5Q29tbWVudChjb250ZXh0SWQsIHJlcGx5VGV4dCwgY29tbWVudElkKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50SWQsIGF1dGhvcklkLCBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdCwgdGV4dCwgcmVwbHksIHJlcGx5VGV4dCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBjb25zdCBtb3VudCA9IGNhbkVkaXQoYXV0aG9ySWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdyBzdHlsZT17e3BhZGRpbmdCb3R0b206ICc1cHgnLCBwYWRkaW5nTGVmdDogXCIxNXB4XCJ9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17NH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uVG9vbGJhcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXA+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uVG9vbHRpcCBic1N0eWxlPVwicHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMuZGVsZXRlSGFuZGxlfSBpY29uPVwidHJhc2hcIiB0b29sdGlwPVwic2xldFwiIG1vdW50PXttb3VudH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblRvb2x0aXAgYnNTdHlsZT1cInByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLnRvZ2dsZUVkaXR9IGljb249XCJwZW5jaWxcIiB0b29sdGlwPVwiw6ZuZHJlXCIgYWN0aXZlPXtlZGl0fSBtb3VudD17bW91bnR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Ub29sdGlwIGJzU3R5bGU9XCJwcmltYXJ5XCIgb25DbGljaz17dGhpcy50b2dnbGVSZXBseX0gaWNvbj1cImVudmVsb3BlXCIgdG9vbHRpcD1cInN2YXJcIiBhY3RpdmU9e3JlcGx5fSBtb3VudD17dHJ1ZX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uVG9vbGJhcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdyBzdHlsZT17e3BhZGRpbmdCb3R0b206ICc1cHgnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezF9IGxnPXsxMH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sbGFwc2VUZXh0QXJlYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c9e2VkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJlZGl0VGV4dENvbnRyb2xcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0ZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRleHRDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlPXt0aGlzLnRvZ2dsZUVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZT17dGhpcy5lZGl0SGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUZXh0PVwiR2VtIMOmbmRyaW5nZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdW50PXttb3VudH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezF9IGxnPXsxMH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sbGFwc2VUZXh0QXJlYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c9e3JlcGx5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwicmVwbHlUZXh0Q29udHJvbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlcGx5VGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVSZXBseUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGU9e3RoaXMudG9nZ2xlUmVwbHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZT17dGhpcy5yZXBseUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGV4dD1cIlN2YXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdW50PXt0cnVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ29sbGFwc2VUZXh0QXJlYSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBzaG93LCBpZCwgdmFsdWUsIG9uQ2hhbmdlLCB0b2dnbGUsIHNhdmUsIHNhdmVUZXh0LCBtb3VudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZighbW91bnQpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiAgPENvbGxhcHNlIGluPXtzaG93fT5cclxuICAgICAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwIGNvbnRyb2xJZD17aWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUNvbnRyb2wgY29tcG9uZW50Q2xhc3M9XCJ0ZXh0YXJlYVwiIHZhbHVlPXt2YWx1ZX0gb25DaGFuZ2U9e29uQ2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uVG9vbGJhcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gb25DbGljaz17dG9nZ2xlfT5MdWs8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdHlwZT1cInN1Ym1pdFwiIGJzU3R5bGU9XCJpbmZvXCIgb25DbGljaz17c2F2ZX0+e3NhdmVUZXh0fTwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvblRvb2xiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Gb3JtR3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQnV0dG9uVG9vbHRpcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b29sdGlwLCBvbkNsaWNrLCBpY29uLCBic1N0eWxlLCBhY3RpdmUsIG1vdW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGxldCBvdmVybGF5VGlwID0gPFRvb2x0aXAgaWQ9XCJ0b29sdGlwXCI+e3Rvb2x0aXB9PC9Ub29sdGlwPjtcclxuXHJcbiAgICAgICAgaWYoIW1vdW50KSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8T3ZlcmxheVRyaWdnZXIgcGxhY2VtZW50PVwidG9wXCIgb3ZlcmxheT17b3ZlcmxheVRpcH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBic1N0eWxlPXtic1N0eWxlfSBic1NpemU9XCJ4c21hbGxcIiBvbkNsaWNrPXtvbkNsaWNrfSBhY3RpdmU9e2FjdGl2ZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxHbHlwaGljb24gZ2x5cGg9e2ljb259IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L092ZXJsYXlUcmlnZ2VyPlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyBub3JtYWxpemVUaHJlYWRUaXRsZSwgcmVzcG9uc2VIYW5kbGVyLCBvblJlamVjdCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRQb3N0Q29tbWVudHMgPSAoY29tbWVudHMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfUE9TVF9DT01NRU5UUyxcclxuICAgICAgICBjb21tZW50czogY29tbWVudHNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZVRocmVhZFRpdGxlID0gKHRpdGxlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuVVBEQVRFX1RIUkVBRF9USVRMRSxcclxuICAgICAgICBpZDogdGl0bGUuSUQsXHJcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYWRkVGhyZWFkVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5BRERfVEhSRUFEX1RJVExFLFxyXG4gICAgICAgIHRpdGxlOiB0aXRsZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0VGhyZWFkVGl0bGVzID0gKHRpdGxlcykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9USFJFQURfVElUTEVTLFxyXG4gICAgICAgIHRpdGxlczogdGl0bGVzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRUb3RhbFBhZ2VzID0gKHRvdGFsUGFnZXMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVE9UQUxfUEFHRVNfVEhSRUFEUyxcclxuICAgICAgICB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRQYWdlID0gKHBhZ2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfUEFHRV9USFJFQURTLFxyXG4gICAgICAgIHBhZ2U6IHBhZ2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFNraXAgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TS0lQX1RIUkVBRFMsXHJcbiAgICAgICAgc2tpcDogc2tpcFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0VGFrZSA9ICh0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RBS0VfVEhSRUFEUyxcclxuICAgICAgICB0YWtlOiB0YWtlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZFRocmVhZCA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TRUxFQ1RFRFRIUkVBRF9JRCxcclxuICAgICAgICBpZDogaWRcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFBvc3RDb250ZW50ID0gKGNvbnRlbnQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfUE9TVF9DT05URU5ULFxyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5ld0ZvcnVtVGhyZWFkRnJvbVNlcnZlciA9ICh0aHJlYWQpID0+IHtcclxuICAgIGNvbnN0IHQgPSBub3JtYWxpemVUaHJlYWRUaXRsZSh0aHJlYWQuSGVhZGVyKTtcclxuICAgIGNvbnN0IGMgPSB0aHJlYWQuVGV4dDsgLy8gdW51c2VkIGZvciBub3dcclxuICAgIHJldHVybiBhZGRUaHJlYWRUaXRsZSh0KTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1hcmtQb3N0ID0gKHBvc3RJZCwgcmVhZCwgY2IpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5mb3J1bXBvc3R9P3Bvc3RJZD0ke3Bvc3RJZH0mcmVhZD0ke3JlYWR9YDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGNiLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaFRocmVhZHMgPSAoc2tpcCA9IDAsIHRha2UgPSAxMCkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgZm9ydW0gPSBnbG9iYWxzLnVybHMuZm9ydW10aXRsZTtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtmb3J1bX0/c2tpcD0ke3NraXB9JnRha2U9JHt0YWtlfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFVucHJvY2Vzc2VkIGZvcnVtIHRpdGxlc1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFnZUZvcnVtVGl0bGVzID0gZGF0YS5DdXJyZW50SXRlbXM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3J1bVRpdGxlcyA9IHBhZ2VGb3J1bVRpdGxlcy5tYXAobm9ybWFsaXplVGhyZWFkVGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCBpbmZvXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwKHNraXApKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2UodGFrZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxQYWdlcyhkYXRhLlRvdGFsUGFnZXMpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFBhZ2UoZGF0YS5DdXJyZW50UGFnZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCB0aHJlYWRzXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUaHJlYWRUaXRsZXMoZm9ydW1UaXRsZXMpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hQb3N0ID0gKGlkLCBjYikgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgZm9ydW0gPSBnbG9iYWxzLnVybHMuZm9ydW1wb3N0O1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2ZvcnVtfT9pZD0ke2lkfWA7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkYXRhLlRleHQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IG5vcm1hbGl6ZVRocmVhZFRpdGxlKGRhdGEuSGVhZGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh1cGRhdGVUaHJlYWRUaXRsZSh0aXRsZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0UG9zdENvbnRlbnQoY29udGVudCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRUaHJlYWQoZGF0YS5UaHJlYWRJRCkpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVQb3N0ID0gKGlkLCBwb3N0LCBjYikgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Z2xvYmFscy51cmxzLmZvcnVtcG9zdH0/aWQ9JHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocG9zdCksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYiwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlUG9zdCA9IChpZCwgY2IpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2dsb2JhbHMudXJscy5mb3J1bXBvc3R9P2lkPSR7aWR9YDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGNiLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHBvc3Q6IFRocmVhZFBvc3RDb250ZW50XHJcbmV4cG9ydCBjb25zdCBwb3N0VGhyZWFkID0gKGNiLCBwb3N0KSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuZm9ydW1wb3N0O1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3QpLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gY2IoKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyBub3JtYWxpemVDb21tZW50LCB2aXNpdENvbW1lbnRzLCByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSAnLi91c2VycydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldFNraXBDb21tZW50cyA9IChza2lwKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1NLSVBfQ09NTUVOVFMsXHJcbiAgICAgICAgc2tpcDogc2tpcFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRTa2lwID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9ERUZBVUxUX1NLSVBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRUYWtlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9ERUZBVUxUX1RBS0VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFRha2VDb21tZW50cyA9ICh0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RBS0VfQ09NTUVOVFMsXHJcbiAgICAgICAgdGFrZTogdGFrZVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRQYWdlKHBhZ2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfQ1VSUkVOVF9QQUdFLFxyXG4gICAgICAgIHBhZ2U6IHBhZ2VcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUb3RhbFBhZ2VzKHRvdGFsUGFnZXMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVE9UQUxfUEFHRVMsXHJcbiAgICAgICAgdG90YWxQYWdlczogdG90YWxQYWdlc1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRDb21tZW50cyA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9DT01NRU5UU1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjZWl2ZWRDb21tZW50cyhjb21tZW50cykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFQ0lFVkVEX0NPTU1FTlRTLFxyXG4gICAgICAgIGNvbW1lbnRzOiBjb21tZW50c1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZENvbW1lbnQoY29tbWVudCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9DT01NRU5ULFxyXG4gICAgICAgIGNvbW1lbnQ6IGNvbW1lbnRcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEZvY3VzZWRDb21tZW50KGNvbW1lbnRJZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9GT0NVU0VEX0NPTU1FTlQsXHJcbiAgICAgICAgaWQ6IGNvbW1lbnRJZFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmV3Q29tbWVudEZyb21TZXJ2ZXIoY29tbWVudCkge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplID0gbm9ybWFsaXplQ29tbWVudChjb21tZW50KTtcclxuICAgIHJldHVybiBhZGRDb21tZW50KG5vcm1hbGl6ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFVucHJvY2Vzc2VkIGNvbW1lbnRzXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYWdlQ29tbWVudHMgPSBkYXRhLkN1cnJlbnRJdGVtcztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgKHJlLXNldCkgaW5mb1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2tpcENvbW1lbnRzKHNraXApKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2VDb21tZW50cyh0YWtlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRDdXJyZW50UGFnZShkYXRhLkN1cnJlbnRQYWdlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFBhZ2VzKGRhdGEuVG90YWxQYWdlcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbGl6ZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tbWVudHMgPSBwYWdlQ29tbWVudHMubWFwKG5vcm1hbGl6ZUNvbW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2gocmVjZWl2ZWRDb21tZW50cyhjb21tZW50cykpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBwb3N0Q29tbWVudCA9ICh1cmwsIGNvbnRleHRJZCwgdGV4dCwgcGFyZW50Q29tbWVudElkLCBjYikgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPUpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgVGV4dDogdGV4dCxcclxuICAgICAgICAgICAgQ29udGV4dElEOiBjb250ZXh0SWQsXHJcbiAgICAgICAgICAgIFBhcmVudElEOiBwYXJlbnRDb21tZW50SWRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgYm9keTogYm9keSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGNiLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBlZGl0Q29tbWVudCA9ICh1cmwsIGNvbW1lbnRJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgSUQ6IGNvbW1lbnRJZCwgVGV4dDogdGV4dCB9KSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGNiLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVDb21tZW50ID0gKHVybCwgY2IpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihjYik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudCA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuaW1hZ2Vjb21tZW50c30vR2V0U2luZ2xlP2lkPSR7aWR9YDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihjID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBub3JtYWxpemVDb21tZW50KGMpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2gocmVjZWl2ZWRDb21tZW50cyhbY29tbWVudF0pKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEZvY3VzZWRDb21tZW50KGNvbW1lbnQuQ29tbWVudElEKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IEZvcnVtRm9ybSB9IGZyb20gJy4uL2ZvcnVtL0ZvcnVtRm9ybSdcclxuaW1wb3J0IHsgQnV0dG9uVG9vbHRpcCB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRDb250cm9scydcclxuaW1wb3J0IHsgbWFya1Bvc3QsIHVwZGF0ZVBvc3QsIGZldGNoUG9zdCwgZGVsZXRlUG9zdCB9IGZyb20gJy4uLy4uL2FjdGlvbnMvZm9ydW0nXHJcbmltcG9ydCB7IHBvc3RDb21tZW50IH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9jb21tZW50cydcclxuaW1wb3J0IHsgZmluZCwgY29udGFpbnMgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBnZXRGdWxsTmFtZSwgdGltZVRleHQsIGZvcm1hdFRleHQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IFJvdywgQ29sLCBHbHlwaGljb24sIEJ1dHRvblRvb2xiYXIsIEJ1dHRvbkdyb3VwIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8uc2VsZWN0ZWRUaHJlYWQ7XHJcbiAgICBjb25zdCB0aXRsZSA9IGZpbmQoc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8udGl0bGVzLCAodGl0bGUpID0+IHRpdGxlLklEID09IHNlbGVjdGVkKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkLFxyXG4gICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICB0ZXh0OiBzdGF0ZS5mb3J1bUluZm8ucG9zdENvbnRlbnQsXHJcbiAgICAgICAgZ2V0VXNlcjogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8udXNlcnNbaWRdLFxyXG4gICAgICAgIGNhbkVkaXQ6IChpZCkgPT4gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQgPT0gaWQsXHJcbiAgICAgICAgaGFzUmVhZDogdGl0bGUgPyBjb250YWlucyh0aXRsZS5WaWV3ZWRCeSwgc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQpIDogZmFsc2UsXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGRhdGU6IChpZCwgcG9zdCwgY2IpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2godXBkYXRlUG9zdChpZCwgcG9zdCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFBvc3Q6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFBvc3QoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZVBvc3Q6IChpZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlUG9zdChpZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlYWRQb3N0OiAocG9zdElkLCByZWFkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChtYXJrUG9zdChwb3N0SWQsIHJlYWQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRm9ydW1Qb3N0Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGVkaXQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy50b2dnbGVFZGl0ID0gdGhpcy50b2dnbGVFZGl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5vblN1Ym1pdCA9IHRoaXMub25TdWJtaXQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUhhbmRsZSA9IHRoaXMuZGVsZXRlSGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50b2dnbGVQb3N0UmVhZCA9IHRoaXMudG9nZ2xlUG9zdFJlYWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IGhhc1RpdGxlID0gQm9vbGVhbihuZXh0UHJvcHMudGl0bGUpO1xyXG4gICAgICAgIGlmKCFoYXNUaXRsZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICAgIFRpdGxlOiBuZXh0UHJvcHMudGl0bGUuVGl0bGUsXHJcbiAgICAgICAgICAgICAgICBUZXh0OiBuZXh0UHJvcHMudGV4dCxcclxuICAgICAgICAgICAgICAgIFN0aWNreTogbmV4dFByb3BzLnRpdGxlLlN0aWNreSxcclxuICAgICAgICAgICAgICAgIElzUHVibGlzaGVkOiBuZXh0UHJvcHMudGl0bGUuSXNQdWJsaXNoZWRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBuZXh0UHJvcHMudGl0bGUuVGl0bGU7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcm91dGVyLCBkZWxldGVQb3N0LCB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZm9ydW1saXN0cyA9IGAvZm9ydW1gO1xyXG4gICAgICAgICAgICByb3V0ZXIucHVzaChmb3J1bWxpc3RzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlbGV0ZVBvc3QodGl0bGUuSUQsIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVFZGl0KCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXQgPSB0aGlzLnN0YXRlLmVkaXQ7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVkaXQ6ICFlZGl0IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU3VibWl0KHBvc3QpIHtcclxuICAgICAgICBjb25zdCB7IHVwZGF0ZSwgZ2V0UG9zdCwgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGdldFBvc3QodGl0bGUuSUQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHVwZGF0ZSh0aXRsZS5JRCwgcG9zdCwgY2IpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVBvc3RSZWFkKHRvZ2dsZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZ2V0UG9zdCwgcmVhZFBvc3QsIHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBnZXRQb3N0KHRpdGxlLklEKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlYWRQb3N0KHRpdGxlLklELCB0b2dnbGUsIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZWRpdDogZmFsc2UgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgc2VsZWN0ZWQsIHRpdGxlLCB0ZXh0LCBnZXRVc2VyLCBoYXNSZWFkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmKHNlbGVjdGVkIDwgMCB8fCAhdGl0bGUpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBjb25zdCBlZGl0ID0gY2FuRWRpdCh0aXRsZS5BdXRob3JJRCk7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IGdldFVzZXIodGl0bGUuQXV0aG9ySUQpO1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IGdldEZ1bGxOYW1lKHVzZXIpO1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Rm9ydW1IZWFkZXIgbGc9ezEyfSBuYW1lPXthdXRob3J9IHRpdGxlPXt0aXRsZS5UaXRsZX0gY3JlYXRlZE9uPXt0aXRsZS5DcmVhdGVkT259IG1vZGlmaWVkT249e3RpdGxlLkxhc3RNb2RpZmllZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb3J1bUJ1dHRvbkdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93PXt0cnVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdGFibGU9e2VkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsUmVhZD17aGFzUmVhZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRGVsZXRlPXt0aGlzLmRlbGV0ZUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRWRpdD17dGhpcy50b2dnbGVFZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25SZWFkPXt0aGlzLnRvZ2dsZVBvc3RSZWFkLmJpbmQodGhpcywgdHJ1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblVucmVhZD17dGhpcy50b2dnbGVQb3N0UmVhZC5iaW5kKHRoaXMsIGZhbHNlKX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8L0ZvcnVtSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxGb3J1bUJvZHkgdGV4dD17dGV4dH0gbGc9ezEwfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgICAgIDwvRm9ydW1Cb2R5PlxyXG4gICAgICAgICAgICAgICAgICAgIDxGb3J1bUZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdz17dGhpcy5zdGF0ZS5lZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZT17dGhpcy5jbG9zZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0PXt0aGlzLnN0YXRlLm1vZGVsfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGb3J1bUJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgbGcsIGxnT2Zmc2V0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZFRleHQgPSBmb3JtYXRUZXh0KHRleHQpO1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXtsZ30gbGdPZmZzZXQ9e2xnT2Zmc2V0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9ydW0tY29udGVudFwiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtmb3JtYXR0ZWRUZXh0fS8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXsxMn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG5cclxuRm9ydW1Cb2R5LnByb3BUeXBlcyA9IHtcclxuICAgIHRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIGxnOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgbGdPZmZzZXQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZvcnVtSGVhZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGdldENyZWF0ZWRPblRleHQoY3JlYXRlZE9uLCBtb2RpZmllZE9uKSB7XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IG1vbWVudChjcmVhdGVkT24pO1xyXG4gICAgICAgIGNvbnN0IGRhdGVUZXh0ID0gZGF0ZS5mb3JtYXQoXCJELU1NLVlZXCIpO1xyXG4gICAgICAgIGNvbnN0IHRpbWVUZXh0ID0gZGF0ZS5mb3JtYXQoXCIgSDptbVwiKTtcclxuICAgICAgICBpZighbW9kaWZpZWRPbilcclxuICAgICAgICAgICAgcmV0dXJuIGBVZGdpdmV0ICR7ZGF0ZVRleHR9IGtsLiAke3RpbWVUZXh0fWA7XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkID0gbW9tZW50KG1vZGlmaWVkT24pO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkRGF0ZSA9IG1vZGlmaWVkLmZvcm1hdChcIkQtTU0tWVlcIik7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRUaW1lID0gbW9kaWZpZWQuZm9ybWF0KFwiSDptbVwiKTtcclxuICAgICAgICByZXR1cm4gYFVkZ2l2ZXQgJHtkYXRlVGV4dH0ga2wuICR7dGltZVRleHR9ICggcmV0dGV0ICR7bW9kaWZpZWREYXRlfSBrbC4gJHttb2RpZmllZFRpbWV9IClgO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlLCBuYW1lLCBjcmVhdGVkT24sIG1vZGlmaWVkT24sIGxnLCBsZ09mZnNldCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5nZXRDcmVhdGVkT25UZXh0KGNyZWF0ZWRPbiwgbW9kaWZpZWRPbik7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7IGxnOiBsZywgbGdPZmZzZXQ6IGxnT2Zmc2V0IH07XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgey4uLnByb3BzfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1jYXBpdGFsaXplXCI+e3RpdGxlfTwvc3Bhbj48YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD5Ta3JldmV0IGFmIHtuYW1lfTwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj48R2x5cGhpY29uIGdseXBoPVwidGltZVwiIC8+IHtjcmVhdGVkfTwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbkZvcnVtSGVhZGVyLnByb3BUeXBlcyA9IHtcclxuICAgIGNyZWF0ZWRPbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuICAgIG1vZGlmaWVkT246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXHJcbn1cclxuXHJcbi8vIHByb3BzOiB7IHNob3csIGVkaXRhYmxlLCBpbml0aWFsUmVhZCwgb25EZWxldGUsIG9uRWRpdCwgb25SZWFkLCBvblVucmVhZCB9XHJcbmV4cG9ydCBjbGFzcyBGb3J1bUJ1dHRvbkdyb3VwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgcmVhZDogcHJvcHMuaW5pdGlhbFJlYWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVhZEhhbmRsZSA9IHRoaXMucmVhZEhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudW5yZWFkSGFuZGxlID0gdGhpcy51bnJlYWRIYW5kbGUuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByZWFkSGFuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgb25SZWFkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmKHRoaXMuc3RhdGUucmVhZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVhZDogdHJ1ZSB9KTtcclxuICAgICAgICBvblJlYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICB1bnJlYWRIYW5kbGUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBvblVucmVhZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZighdGhpcy5zdGF0ZS5yZWFkKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWFkOiBmYWxzZSB9KTtcclxuICAgICAgICBvblVucmVhZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRhYmxlLCBzaG93LCBvbkRlbGV0ZSwgb25FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmKCFzaG93KSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgY29uc3QgeyByZWFkIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHJldHVybiAgPENvbCBsZz17MTJ9IGNsYXNzTmFtZT1cImZvcnVtLWVkaXRiYXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uVG9vbGJhcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblRvb2x0aXAgYnNTdHlsZT1cImRhbmdlclwiIG9uQ2xpY2s9e29uRGVsZXRlfSBpY29uPVwidHJhc2hcIiB0b29sdGlwPVwic2xldCBpbmRsw6ZnXCIgbW91bnQ9e2VkaXRhYmxlfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblRvb2x0aXAgYnNTdHlsZT1cInByaW1hcnlcIiBvbkNsaWNrPXtvbkVkaXR9IGljb249XCJwZW5jaWxcIiB0b29sdGlwPVwiw6ZuZHJlIGluZGzDpmdcIiBhY3RpdmU9e2ZhbHNlfSBtb3VudD17ZWRpdGFibGV9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uVG9vbHRpcCBic1N0eWxlPVwicHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMucmVhZEhhbmRsZX0gaWNvbj1cImV5ZS1vcGVuXCIgdG9vbHRpcD1cIm1hcmtlciBzb20gbMOmc3RcIiBhY3RpdmU9e3JlYWR9IG1vdW50PXt0cnVlfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblRvb2x0aXAgYnNTdHlsZT1cInByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLnVucmVhZEhhbmRsZX0gaWNvbj1cImV5ZS1jbG9zZVwiIHRvb2x0aXA9XCJtYXJrZXIgc29tIHVsw6ZzdFwiIGFjdGl2ZT17IXJlYWR9IG1vdW50PXt0cnVlfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uVG9vbGJhcj5cclxuICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgfVxyXG59XHJcblxyXG5Gb3J1bUJ1dHRvbkdyb3VwLnByb3BUeXBlcyA9IHtcclxuICAgIHNob3c6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICBlZGl0YWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICAgIGluaXRpYWxSZWFkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG4gICAgb25EZWxldGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBvbkVkaXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBvblJlYWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBvblVucmVhZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxyXG59XHJcblxyXG5jb25zdCBGb3J1bVBvc3RSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEZvcnVtUG9zdENvbnRhaW5lcik7XHJcbmNvbnN0IEZvcnVtUG9zdCA9IHdpdGhSb3V0ZXIoRm9ydW1Qb3N0UmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBGb3J1bVBvc3Q7XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiBhcyBQYWdpbmF0aW9uQnMgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBwYWdlLCBwYWdlSGFuZGxlLCBzaG93IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG1vcmUgPSB0b3RhbFBhZ2VzID4gMTtcclxuICAgICAgICBjb25zdCB4b3IgPSAoc2hvdyB8fCBtb3JlKSAmJiAhKHNob3cgJiYgbW9yZSk7XHJcbiAgICAgICAgaWYoISh4b3IgfHwgKHNob3cgJiYgbW9yZSkpKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8UGFnaW5hdGlvbkJzXHJcbiAgICAgICAgICAgICAgICAgICAgcHJldiBuZXh0IGVsbGlwc2lzIGJvdW5kYXJ5TGlua3NcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcz17dG90YWxQYWdlc31cclxuICAgICAgICAgICAgICAgICAgICBtYXhCdXR0b25zPXs1fVxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZVBhZ2U9e3BhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Q9e3BhZ2VIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgfVxyXG59ICAgICAgICAgICAgIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyB2YWx1ZXMsIHNvcnRCeSB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgZmV0Y2hMYXRlc3ROZXdzIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy93aGF0c25ldydcclxuaW1wb3J0IHsgV2hhdHNOZXdMaXN0IH0gZnJvbSAnLi4vd2hhdHNuZXcvV2hhdHNOZXdMaXN0J1xyXG5pbXBvcnQgeyBGb3J1bUhlYWRlciwgRm9ydW1Cb2R5IH0gZnJvbSAnLi9Gb3J1bVBvc3QnXHJcbmltcG9ydCB7IEJ1dHRvbiwgQnV0dG9uVG9vbGJhciwgTW9kYWwsIFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSAnLi4vcGFnaW5hdGlvbi9QYWdpbmF0aW9uJ1xyXG5pbXBvcnQgeyBMaW5rLCB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGl0ZW1zOiBzdGF0ZS53aGF0c05ld0luZm8uaXRlbXMsXHJcbiAgICAgICAgZ2V0VXNlcjogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8udXNlcnNbaWRdLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLndoYXRzTmV3SW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLndoYXRzTmV3SW5mby50YWtlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLndoYXRzTmV3SW5mby50b3RhbFBhZ2VzLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLndoYXRzTmV3SW5mby5wYWdlLFxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TGF0ZXN0OiAoc2tpcCwgdGFrZSkgPT4gZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKSxcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgV2hhdHNOZXdDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgbW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBwb3N0UHJldmlldzogbnVsbCxcclxuICAgICAgICAgICAgYXV0aG9yOiB7fSxcclxuICAgICAgICAgICAgb246IG51bGxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGFnZUhhbmRsZSA9IHRoaXMucGFnZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJldmlld1Bvc3QgPSB0aGlzLnByZXZpZXdQb3N0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZU1vZGFsID0gdGhpcy5jbG9zZU1vZGFsLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFZpZXcgPSB0aGlzLm1vZGFsVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubmF2aWdhdGVUbyA9IHRoaXMubmF2aWdhdGVUby5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhZ2VIYW5kbGUodG8pIHtcclxuICAgICAgICBjb25zdCB7IGdldExhdGVzdCwgcGFnZSwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZihwYWdlID09IHRvKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHRvIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgZ2V0TGF0ZXN0KHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJldmlld1Bvc3QoaXRlbSkge1xyXG4gICAgICAgIGNvbnN0IHsgZ2V0VXNlciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRVc2VyKGl0ZW0uQXV0aG9ySUQpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBtb2RhbDogdHJ1ZSxcclxuICAgICAgICAgICAgcG9zdFByZXZpZXc6IGl0ZW0uSXRlbSxcclxuICAgICAgICAgICAgYXV0aG9yOiBhdXRob3IsXHJcbiAgICAgICAgICAgIG9uOiBpdGVtLk9uXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmF2aWdhdGVUbyh1cmwpIHtcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG4gICAgICAgIHB1c2godXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZU1vZGFsKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBtb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBvc3RQcmV2aWV3OiBudWxsLFxyXG4gICAgICAgICAgICBhdXRob3I6IHt9LFxyXG4gICAgICAgICAgICBvbjogbnVsbFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZGFsVmlldygpIHtcclxuICAgICAgICBpZighQm9vbGVhbih0aGlzLnN0YXRlLnBvc3RQcmV2aWV3KSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyBUZXh0LCBUaXRsZSwgSUQgfSA9IHRoaXMuc3RhdGUucG9zdFByZXZpZXc7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yID0gdGhpcy5zdGF0ZS5hdXRob3I7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGAke2F1dGhvci5GaXJzdE5hbWV9ICR7YXV0aG9yLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgY29uc3QgbGluayA9IGBmb3J1bS9wb3N0LyR7SUR9L2NvbW1lbnRzYDtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8TW9kYWwgc2hvdz17dGhpcy5zdGF0ZS5tb2RhbH0gb25IaWRlPXt0aGlzLmNsb3NlTW9kYWx9IGJzU2l6ZT1cImxhcmdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1vZGFsLkhlYWRlciBjbG9zZUJ1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsLlRpdGxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcnVtSGVhZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGc9ezExfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxnT2Zmc2V0PXsxfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRPbj17dGhpcy5zdGF0ZS5vbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17VGl0bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT17bmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTW9kYWwuVGl0bGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5IZWFkZXI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxNb2RhbC5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Rm9ydW1Cb2R5IHRleHQ9e1RleHR9IGxnPXsxMX0gbGdPZmZzZXQ9ezF9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0ZvcnVtQm9keT5cclxuICAgICAgICAgICAgICAgICAgICA8L01vZGFsLkJvZHk+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxNb2RhbC5Gb290ZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Ub29sYmFyIHN0eWxlPXt7ZmxvYXQ6IFwicmlnaHRcIn19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBic1N0eWxlPVwicHJpbWFyeVwiIG9uQ2xpY2s9eygpID0+IHRoaXMubmF2aWdhdGVUbyhsaW5rKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZSBrb21tZW50YXJlciAoZm9ydW0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gb25DbGljaz17dGhpcy5jbG9zZU1vZGFsfT5MdWs8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Ub29sYmFyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvTW9kYWwuRm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgPC9Nb2RhbD5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciwgdG90YWxQYWdlcywgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5TaWRzdGUgaCZhZWxpZztuZGVsc2VyPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxXaGF0c05ld0xpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpdGVtc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFVzZXI9e2dldFVzZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aWV3PXt0aGlzLnByZXZpZXdQb3N0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8UGFnaW5hdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlcz17dG90YWxQYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U9e3BhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlSGFuZGxlPXt0aGlzLnBhZ2VIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLm1vZGFsVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFdoYXRzTmV3ID0gd2l0aFJvdXRlcihjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShXaGF0c05ld0NvbnRhaW5lcikpO1xyXG5leHBvcnQgZGVmYXVsdCBXaGF0c05ldztcclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQnV0dG9uIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcklucHV0KGZpbGVJbnB1dCkge1xyXG4gICAgICAgIGlmKGZpbGVJbnB1dC52YWx1ZSl7XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnOyAvL2ZvciBJRTExLCBsYXRlc3QgQ2hyb21lL0ZpcmVmb3gvT3BlcmEuLi5cclxuICAgICAgICAgICAgfWNhdGNoKGVycil7IH1cclxuICAgICAgICAgICAgaWYoZmlsZUlucHV0LnZhbHVlKXsgLy9mb3IgSUU1IH4gSUUxMFxyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IGZpbGVJbnB1dC5wYXJlbnROb2RlLCByZWYgPSBmaWxlSW5wdXQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGZpbGVJbnB1dCk7XHJcbiAgICAgICAgICAgICAgICBmb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShmaWxlSW5wdXQscmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWxlcygpIHtcclxuICAgICAgICBjb25zdCBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgcmV0dXJuIChmaWxlcyA/IGZpbGVzLmZpbGVzIDogW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVN1Ym1pdChlKSB7XHJcbiAgICAgICAgY29uc3QgeyB1cGxvYWRJbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5nZXRGaWxlcygpO1xyXG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xyXG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICB0aGlzLmNsZWFySW5wdXQoZmlsZUlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9IGlkPVwiZm9ybS11cGxvYWRcIiBlbmNUeXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZmlsZXNcIj5VcGxvYWQgZmlsZXI6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiZmlsZXNcIiBuYW1lPVwiZmlsZXNcIiBtdWx0aXBsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGJzU3R5bGU9XCJwcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiPlVwbG9hZDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSAnLi91c2VycydcclxuaW1wb3J0IHsgbm9ybWFsaXplSW1hZ2UgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyBvYmpNYXAsIHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEltYWdlc093bmVyKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0lNQUdFU19PV05FUixcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNpZXZlZFVzZXJJbWFnZXMoaW1hZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfVVNFUl9JTUFHRVMsXHJcbiAgICAgICAgaW1hZ2VzOiBpbWFnZXNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZEltZyA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TRUxFQ1RFRF9JTUcsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkSW1hZ2UoaW1nKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX0lNQUdFLFxyXG4gICAgICAgIGtleTogaW1nLkltYWdlSUQsXHJcbiAgICAgICAgdmFsOiBpbWdcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVJbWFnZShpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFTU9WRV9JTUFHRSxcclxuICAgICAgICBrZXk6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkU2VsZWN0ZWRJbWFnZUlkKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX1NFTEVDVEVEX0lNQUdFX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZChpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaW5jcmVtZW50Q29tbWVudENvdW50ID0gKGltYWdlSWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5JTkNSX0lNR19DT01NRU5UX0NPVU5ULFxyXG4gICAgICAgIGtleTogaW1hZ2VJZFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVjcmVtZW50Q29tbWVudENvdW50ID0gKGltYWdlSWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5ERUNSX0lNR19DT01NRU5UX0NPVU5ULFxyXG4gICAgICAgIGtleTogaW1hZ2VJZFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbmV3SW1hZ2VGcm9tU2VydmVyID0gKGltYWdlKSA9PiB7XHJcbiAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplSW1hZ2UoaW1hZ2UpO1xyXG4gICAgcmV0dXJuIGFkZEltYWdlKG5vcm1hbGl6ZWQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZSArIFwiJmlkPVwiICsgaWQ7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2gocmVtb3ZlSW1hZ2UoaWQpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhLCBvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4ob25TdWNjZXNzLCBvbkVycm9yKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICBjb25zdCBvblN1Y2Nlc3MgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gZGF0YS5tYXAobm9ybWFsaXplSW1hZ2UpLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gb2JqTWFwKG5vcm1hbGl6ZWQsIChpbWcpID0+IGltZy5JbWFnZUlELCAoaW1nKSA9PiBpbWcpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNpZXZlZFVzZXJJbWFnZXMob2JqKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihvblN1Y2Nlc3MsIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgaW1hZ2VJZHMgPSBbXSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgaWRzID0gaW1hZ2VJZHMuam9pbigpO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lICsgXCImaWRzPVwiICsgaWRzO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpKSwgb25SZWplY3QpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEltYWdlT3duZXIodXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICAvLyBMYXp5IGV2YWx1YXRpb25cclxuICAgICAgICBjb25zdCBmaW5kT3duZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaW5kKGdldFN0YXRlKCkudXNlcnNJbmZvLnVzZXJzLCAodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXIuVXNlcm5hbWUgPT0gdXNlcm5hbWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG93bmVyID0gZmluZE93bmVyKCk7XHJcblxyXG4gICAgICAgIGlmKG93bmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG93bmVySWQgPSBvd25lci5JRDtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0SW1hZ2VzT3duZXIob3duZXJJZCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gZ2xvYmFscy51cmxzLnVzZXJzICsgJz91c2VybmFtZT0nICsgdXNlcm5hbWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4odXNlciA9PiBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKSwgb25SZWplY3QpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIgPSBmaW5kT3duZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lci5JRCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hTaW5nbGVJbWFnZShpZCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIi9nZXRieWlkP2lkPVwiICsgaWQ7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihpbWcgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoIWltZykgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZEltYWdlID0gbm9ybWFsaXplSW1hZ2UoaW1nKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZEltYWdlKG5vcm1hbGl6ZWRJbWFnZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFVzZWRTcGFjZWtCKHVzZWRTcGFjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9VU0VEX1NQQUNFX0tCLFxyXG4gICAgICAgIHVzZWRTcGFjZTogdXNlZFNwYWNlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUb3RhbFNwYWNla0IodG90YWxTcGFjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UT1RBTF9TUEFDRV9LQixcclxuICAgICAgICB0b3RhbFNwYWNlOiB0b3RhbFNwYWNlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaFNwYWNlSW5mbyA9ICh1cmwpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VkU3BhY2UgPSBkYXRhLlVzZWRTcGFjZUtCO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG90YWxTcGFjZSA9IGRhdGEuU3BhY2VRdW90YUtCO1xyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFVzZWRTcGFjZWtCKHVzZWRTcGFjZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxTcGFjZWtCKHRvdGFsU3BhY2UpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBSb3csIENvbCwgUHJvZ3Jlc3NCYXIgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IGZldGNoU3BhY2VJbmZvIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9zdGF0dXMnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlZE1COiAoc3RhdGUuc3RhdHVzSW5mby5zcGFjZUluZm8udXNlZFNwYWNla0IgLyAxMDAwKSxcclxuICAgICAgICB0b3RhbE1COiAoc3RhdGUuc3RhdHVzSW5mby5zcGFjZUluZm8udG90YWxTcGFjZWtCIC8gMTAwMCksXHJcbiAgICAgICAgbG9hZGVkOiAoc3RhdGUuc3RhdHVzSW5mby5zcGFjZUluZm8udG90YWxTcGFjZWtCICE9IC0xKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0U3BhY2VJbmZvOiAodXJsKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoU3BhY2VJbmZvKHVybCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXNlZFNwYWNlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGdldFNwYWNlSW5mbyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtnbG9iYWxzLnVybHMuZGlhZ25vc3RpY3N9L2dldHNwYWNlaW5mb2A7XHJcbiAgICAgICAgZ2V0U3BhY2VJbmZvKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlZE1CLCB0b3RhbE1CIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsID0gTWF0aC5yb3VuZCh0b3RhbE1CKTtcclxuICAgICAgICBjb25zdCB1c2VkID0gTWF0aC5yb3VuZCh1c2VkTUIqMTAwKSAvIDEwMDtcclxuICAgICAgICBjb25zdCBmcmVlID0gTWF0aC5yb3VuZCgodG90YWwgLSB1c2VkKSoxMDApIC8gMTAwO1xyXG4gICAgICAgIGNvbnN0IHVzZWRQZXJjZW50ID0gKCh1c2VkL3RvdGFsKSogMTAwKTtcclxuICAgICAgICBjb25zdCBwZXJjZW50Um91bmQgPSBNYXRoLnJvdW5kKHVzZWRQZXJjZW50KjEwMCkgLyAxMDA7XHJcbiAgICAgICAgY29uc3Qgc2hvdyA9IEJvb2xlYW4odXNlZFBlcmNlbnQpICYmIEJvb2xlYW4odXNlZCkgJiYgQm9vbGVhbihmcmVlKSAmJiBCb29sZWFuKHRvdGFsKTtcclxuICAgICAgICBpZighc2hvdykgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8UHJvZ3Jlc3NCYXIgc3RyaXBlZD17dHJ1ZX0gYnNTdHlsZT1cInN1Y2Nlc3NcIiBub3c9e3VzZWRQZXJjZW50fSBrZXk9ezF9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQnJ1Z3Q6IHt1c2VkLnRvU3RyaW5nKCl9IE1CICh7cGVyY2VudFJvdW5kLnRvU3RyaW5nKCl9ICUpPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGcmkgcGxhZHM6IHtmcmVlLnRvU3RyaW5nKCl9IE1CPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb3RhbDoge3RvdGFsLnRvU3RyaW5nKCl9IE1CXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBVc2VkU3BhY2UgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2VkU3BhY2VWaWV3KTtcclxuZXhwb3J0IGRlZmF1bHQgVXNlZFNwYWNlO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8VXNlZFNwYWNlRG91Z2hudXRcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJjYW52YXNEb3VnaG51dFwiXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyZWU9e01hdGgucm91bmQoZnJlZSl9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWQ9e01hdGgucm91bmQodXNlZCl9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoPXs0NjB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD17MzAwfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcblxyXG4vL2NsYXNzIFVzZWRTcGFjZURvdWdobnV0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuLy8gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbi8vICAgICAgICBjb25zdCB7IGlkLCB1c2VkLCBmcmVlIH0gPSB0aGlzLnByb3BzO1xyXG4vLyAgICAgICAgY29uc3QgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4vLyAgICAgICAgY29uc3QgZGF0YU9wdGlvbnMgPSB7XHJcbi8vICAgICAgICAgICAgbGFiZWxzOiBbXCJCcnVndFwiLCBcIkZyaVwiXSxcclxuLy8gICAgICAgICAgICBkYXRhc2V0czogW1xyXG4vLyAgICAgICAgICAgICAgICB7XHJcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhOiBbdXNlZCwgZnJlZV0sXHJcbi8vICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcIiNGRjYzODRcIixcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcIiMzNkEyRUJcIlxyXG4vLyAgICAgICAgICAgICAgICAgICAgXSxcclxuLy8gICAgICAgICAgICAgICAgICAgIGhvdmVyQmFja2dyb3VuZENvbG9yOiBbXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCIjRkY2Mzg0XCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCIjMzZBMkVCXCJcclxuLy8gICAgICAgICAgICAgICAgICAgIF1cclxuLy8gICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgIF1cclxuLy8gICAgICAgIH07XHJcbi8vICAgICAgICBsZXQgY2hhcnQgPSBuZXcgQ2hhcnQoY3R4LCB7XHJcbi8vICAgICAgICAgICAgdHlwZTogJ2RvdWdobnV0JyxcclxuLy8gICAgICAgICAgICBkYXRhOiBkYXRhT3B0aW9uc1xyXG4vLyAgICAgICAgfSlcclxuLy8gICAgfVxyXG4vL1xyXG4vLyAgICByZW5kZXIoKSB7XHJcbi8vICAgICAgICBjb25zdCB7IGlkLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLnByb3BzO1xyXG4vLyAgICAgICAgcmV0dXJuICA8Y2FudmFzIGlkPXtpZH0gd2lkdGg9e3dpZHRofSBoZWlnaHQ9e2hlaWdodH0+XHJcbi8vICAgICAgICAgICAgICAgIDwvY2FudmFzPlxyXG4vLyAgICB9XHJcbi8vfVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IFdoYXRzTmV3IGZyb20gJy4vV2hhdHNOZXcnXHJcbmltcG9ydCB7IEltYWdlVXBsb2FkIH0gZnJvbSAnLi4vaW1hZ2VzL0ltYWdlVXBsb2FkJ1xyXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSB9IGZyb20gJy4uLy4uL2FjdGlvbnMvaW1hZ2VzJ1xyXG5pbXBvcnQgeyBmZXRjaExhdGVzdE5ld3MgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3doYXRzbmV3J1xyXG5pbXBvcnQgeyBKdW1ib3Ryb24sIEdyaWQsIFJvdywgQ29sLCBQYW5lbCwgQWxlcnQgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IHZhbHVlcyB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCBVc2VkU3BhY2UgZnJvbSAnLi9Vc2VkU3BhY2UnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHVzZXIgPSB2YWx1ZXMoc3RhdGUudXNlcnNJbmZvLnVzZXJzKS5maWx0ZXIodSA9PiB1LlVzZXJuYW1lLnRvVXBwZXJDYXNlKCkgPT0gZ2xvYmFscy5jdXJyZW50VXNlcm5hbWUudG9VcHBlckNhc2UoKSlbMF07XHJcbiAgICBjb25zdCBuYW1lID0gdXNlciA/IHVzZXIuRmlyc3ROYW1lIDogJ1VzZXInO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLndoYXRzTmV3SW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLndoYXRzTmV3SW5mby50YWtlXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGxvYWRJbWFnZTogKHNraXAsIHRha2UsIHVzZXJuYW1lLCBmb3JtRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvblN1Y2Nlc3MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChmZXRjaExhdGVzdE5ld3Moc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZGlzcGF0Y2godXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhLCBvblN1Y2Nlc3MsICgpID0+IHsgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgSG9tZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgcmVjb21tZW5kZWQ6IHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBsb2FkID0gdGhpcy51cGxvYWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlY29tbWVuZGVkVmlldyA9IHRoaXMucmVjb21tZW5kZWRWaWV3LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBcIkZvcnNpZGVcIjtcclxuICAgIH1cclxuXHJcbiAgICB1cGxvYWQodXNlcm5hbWUsIGZvcm1EYXRhKSB7XHJcbiAgICAgICAgY29uc3QgeyB1cGxvYWRJbWFnZSwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICB1cGxvYWRJbWFnZShza2lwLCB0YWtlLCB1c2VybmFtZSwgZm9ybURhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlY29tbWVuZGVkVmlldygpIHtcclxuICAgICAgICBpZighdGhpcy5zdGF0ZS5yZWNvbW1lbmRlZCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QWxlcnQgYnNTdHlsZT1cInN1Y2Nlc3NcIiBvbkRpc21pc3M9eygpID0+IHRoaXMuc2V0U3RhdGUoeyByZWNvbW1lbmRlZDogZmFsc2UgfSl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0PkFuYmVmYWxpbmdlcjwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlRlc3RldCBtZWQgR29vZ2xlIENocm9tZSBicm93c2VyLiBEZXJmb3IgZXIgZGV0IGFuYmVmYWxldCBhdCBicnVnZSBkZW5uZSB0aWwgYXQgZiZhcmluZzsgZGVuIGZ1bGRlIG9wbGV2ZWxzZS48YnIgLz48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9BbGVydD5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGdsb2JhbHMuY3VycmVudFVzZXJuYW1lO1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPEp1bWJvdHJvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxPjxzcGFuPlZlbGtvbW1lbiA8c21hbGw+e25hbWV9ITwvc21hbGw+PC9zcGFuPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImxlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRpbCBJbnVwbGFucyBpbnRyYW5ldCBzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXs0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGFuZWwgaGVhZGVyPXsnRHUga2FuIHVwbG9hZGUgYmlsbGVkZXIgdGlsIGRpdCBlZ2V0IGdhbGxlcmkgaGVyJ30gYnNTdHlsZT1cInByaW1hcnlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlVXBsb2FkIHVzZXJuYW1lPXt1c2VybmFtZX0gdXBsb2FkSW1hZ2U9e3RoaXMudXBsb2FkfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvUGFuZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9KdW1ib3Ryb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPEdyaWQgZmx1aWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXsyfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17NH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFdoYXRzTmV3IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezF9IGxnPXszfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZWNvbW1lbmRlZFZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+UGVyc29ubGlnIHVwbG9hZCBmb3JicnVnPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSGVydW5kZXIga2FuIGR1IHNlIGh2b3IgbWVnZXQgcGxhZHMgZHUgaGFyIGJydWd0IG9nIGh2b3IgbWVnZXQgZnJpIHBsYWRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlciBlciB0aWxiYWdlLiBHw6ZsZGVyIGt1biBiaWxsZWRlIGZpbGVyLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VXNlZFNwYWNlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9HcmlkPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEhvbWUgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShIb21lVmlldylcclxuZXhwb3J0IGRlZmF1bHQgSG9tZVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9ydW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsyfSBsZz17OH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMT5Gb3J1bSA8c21hbGw+aW5kbCZhZWxpZztnPC9zbWFsbD48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFJvdywgQ29sLCBHbHlwaGljb24sIE92ZXJsYXlUcmlnZ2VyLCBUb29sdGlwIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5pbXBvcnQgeyB0aW1lVGV4dCwgZm9ybWF0VGV4dCwgZ2V0V29yZHMgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcblxyXG5leHBvcnQgY2xhc3MgRm9ydW1UaXRsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBkYXRlVmlldyhkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZGF5TW9udGhZZWFyID0gbW9tZW50KGRhdGUpLmZvcm1hdChcIkQvTU0vWVlcIik7XHJcbiAgICAgICAgcmV0dXJuIGAke2RheU1vbnRoWWVhcn1gO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZGlmaWVkVmlldyhtb2RpZmllZE9uKSB7XHJcbiAgICAgICAgaWYoIW1vZGlmaWVkT24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkRGF0ZSA9IG1vbWVudChtb2RpZmllZE9uKS5mb3JtYXQoXCJEL01NL1lZLUg6bW1cIik7XHJcbiAgICAgICAgcmV0dXJuIGAke21vZGlmaWVkRGF0ZX1gO1xyXG4gICAgfVxyXG5cclxuICAgIHRvb2x0aXBWaWV3KCkge1xyXG4gICAgICAgIHJldHVybiAgPFRvb2x0aXAgaWQ9XCJ0b29sdGlwXCI+VmlndGlnPC9Ub29sdGlwPlxyXG4gICAgfVxyXG5cclxuICAgIHN0aWNreUljb24oc2hvdykge1xyXG4gICAgICAgIGlmKCFzaG93KSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gIDxwIGNsYXNzTmFtZT1cInN0aWNreVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxPdmVybGF5VHJpZ2dlciBwbGFjZW1lbnQ9XCJ0b3BcIiBvdmVybGF5PXt0aGlzLnRvb2x0aXBWaWV3KCl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8R2x5cGhpY29uIGdseXBoPVwicHVzaHBpblwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9PdmVybGF5VHJpZ2dlcj5cclxuICAgICAgICAgICAgICAgIDwvcD5cclxuICAgIH1cclxuXHJcbiAgICBkYXRlTW9kaWZpZWRWaWV3KHRpdGxlKSB7XHJcbiAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuZGF0ZVZpZXcodGl0bGUuQ3JlYXRlZE9uKTtcclxuICAgICAgICBjb25zdCB1cGRhdGVkID0gdGhpcy5tb2RpZmllZFZpZXcodGl0bGUuTGFzdE1vZGlmaWVkKTtcclxuICAgICAgICBpZighdXBkYXRlZCkgcmV0dXJuIDxzcGFuPntjcmVhdGVkfTwvc3Bhbj5cclxuXHJcbiAgICAgICAgY29uc3QgdXBkYXRlVGV4dCA9IGAke3VwZGF0ZWR9YDtcclxuICAgICAgICByZXR1cm4gIDxzcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIHtjcmVhdGVkfTxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICh7dXBkYXRlZH0pXHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU3VtbWFyeSgpIHtcclxuICAgICAgICBjb25zdCB7IHRpdGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGlmKCF0aXRsZS5MYXRlc3RDb21tZW50KSByZXR1cm4gJ0luZ2VuIGtvbW1lbnRhcmVyJztcclxuXHJcbiAgICAgICAgaWYodGl0bGUuTGF0ZXN0Q29tbWVudC5EZWxldGVkKSByZXR1cm4gJ0tvbW1lbnRhciBzbGV0dGV0JztcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdGl0bGUuTGF0ZXN0Q29tbWVudC5UZXh0O1xyXG4gICAgICAgIHJldHVybiBnZXRXb3Jkcyh0ZXh0LCA1KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgZ2V0QXV0aG9yLCBvbkNsaWNrIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBnZXRBdXRob3IodGl0bGUuQXV0aG9ySUQpO1xyXG4gICAgICAgIGNvbnN0IGxhdGVzdENvbW1lbnQgID0gdGhpcy5jcmVhdGVTdW1tYXJ5KCk7XHJcbiAgICAgICAgY29uc3QgY3NzID0gdGl0bGUuU3RpY2t5ID8gXCJ0aHJlYWQgdGhyZWFkLXBpbm5lZFwiIDogXCJ0aHJlYWRcIjtcclxuICAgICAgICBjb25zdCBwYXRoID0gYC9mb3J1bS9wb3N0LyR7dGl0bGUuSUR9L2NvbW1lbnRzYDtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8TGluayB0bz17cGF0aH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdyBjbGFzc05hbWU9e2Nzc30+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezF9IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+e3RoaXMuc3RpY2t5SWNvbih0aXRsZS5TdGlja3kpfTwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXs1fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoND48c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWNhcGl0YWxpemVcIj57dGl0bGUuVGl0bGV9PC9zcGFuPjwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+QWY6IHtuYW1lfTwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXsyfSBjbGFzc05hbWU9XCJ0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLmRhdGVNb2RpZmllZFZpZXcodGl0bGUpfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezJ9IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGl0bGUuVmlld2VkQnkubGVuZ3RofTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezJ9IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57bGF0ZXN0Q29tbWVudH08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUm93LCBDb2wsIEJ1dHRvbkdyb3VwLCBCdXR0b24gfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IEZvcnVtVGl0bGUgfSBmcm9tICcuLi9mb3J1bS9Gb3J1bVRpdGxlJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBmZXRjaFRocmVhZHMsIHBvc3RUaHJlYWQsIHNldFNlbGVjdGVkVGhyZWFkIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9mb3J1bSdcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gJy4uL3BhZ2luYXRpb24vUGFnaW5hdGlvbidcclxuaW1wb3J0IHsgRm9ydW1Gb3JtIH0gZnJvbSAnLi4vZm9ydW0vRm9ydW1Gb3JtJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRocmVhZHM6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRpdGxlcyxcclxuICAgICAgICBza2lwOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmZvcnVtSW5mby50aXRsZXNJbmZvLnRha2UsXHJcbiAgICAgICAgcGFnZTogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8ucGFnZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS5mb3J1bUluZm8udGl0bGVzSW5mby50b3RhbFBhZ2VzLFxyXG4gICAgICAgIGdldEF1dGhvcjogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnNbaWRdO1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7dXNlci5GaXJzdE5hbWV9ICR7dXNlci5MYXN0TmFtZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBmZXRjaFRocmVhZHM6IChza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoVGhyZWFkcyhza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0VGhyZWFkOiAoY2IsIHBvc3QpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdFRocmVhZChjYiwgcG9zdCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0U2VsZWN0ZWRUaHJlYWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTZWxlY3RlZFRocmVhZChpZCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRm9ydW1MaXN0Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG5ld1Bvc3Q6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wYWdlSGFuZGxlID0gdGhpcy5wYWdlSGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiSW51cGxhbiBGb3J1bVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHBhZ2VIYW5kbGUodG8pIHtcclxuICAgICAgICBjb25zdCB7IGZldGNoVGhyZWFkcywgcGFnZSwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgaWYocGFnZSA9PSB0bykgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNraXBJdGVtcyA9ICh0byAtIDEpICogdGFrZTtcclxuICAgICAgICBmZXRjaFRocmVhZHMoc2tpcEl0ZW1zLCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aHJlYWRWaWV3cygpIHtcclxuICAgICAgICBjb25zdCB7IHRocmVhZHMsIGdldEF1dGhvciwgc2V0U2VsZWN0ZWRUaHJlYWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHRocmVhZHMubWFwKHRocmVhZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gYHRocmVhZF8ke3RocmVhZC5JRH1gO1xyXG4gICAgICAgICAgICByZXR1cm4gPEZvcnVtVGl0bGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e3RocmVhZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QXV0aG9yPXtnZXRBdXRob3J9IC8+XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3VibWl0KHBvc3QpIHtcclxuICAgICAgICBjb25zdCB7IHBvc3RUaHJlYWQsIGZldGNoVGhyZWFkcywgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwb3N0VGhyZWFkKCgpID0+IGZldGNoVGhyZWFkcyhza2lwLCB0YWtlKSwgcG9zdCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5ld1Bvc3Q6IGZhbHNlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5ld1Bvc3Q6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG90YWxQYWdlcywgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGJzU3R5bGU9XCJwcmltYXJ5XCIgb25DbGljaz17dGhpcy5zaG93LmJpbmQodGhpcyl9PlRpbGYmb3NsYXNoO2ogbnl0IGluZGwmYWVsaWc7ZzwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17MTJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um93IGNsYXNzTmFtZT1cInRocmVhZC1oZWFkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXsxfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkluZm88L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17NX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5PdmVyc2tyaWZ0PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezJ9IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5EYXRvPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezJ9IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5MJmFlbGlnO3N0IGFmPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezJ9IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5TZW5lc3RlIGtvbW1lbnRhcjwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy50aHJlYWRWaWV3cygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8UGFnaW5hdGlvbiB0b3RhbFBhZ2VzPXt0b3RhbFBhZ2VzfSBwYWdlPXtwYWdlfSBwYWdlSGFuZGxlPXt0aGlzLnBhZ2VIYW5kbGV9IHNob3c9e3RydWV9Lz5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICA8Rm9ydW1Gb3JtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3c9e3RoaXMuc3RhdGUubmV3UG9zdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2U9e3RoaXMuY2xvc2UuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25TdWJtaXQ9e3RoaXMuc3VibWl0LmJpbmQodGhpcyl9IC8+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgRm9ydW1MaXN0ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoRm9ydW1MaXN0Q29udGFpbmVyKTtcclxuZXhwb3J0IGRlZmF1bHQgRm9ydW1MaXN0O1xyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IE1lZGlhLCBHbHlwaGljb24gIH0gZnJvbSBcInJlYWN0LWJvb3RzdHJhcFwiXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudERlbGV0ZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbGllcywgY29uc3RydWN0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSByZXBsaWVzLm1hcChyZXBseSA9PiBjb25zdHJ1Y3QocmVwbHkpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8TWVkaWE+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkxlZnQgc3R5bGU9e3sgbWluV2lkdGg6IFwiNzRweFwiIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQgY29tbWVudC1kZWxldGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8R2x5cGhpY29uIGdseXBoPVwicmVtb3ZlLXNpZ25cIiAvPiBLb21tZW50YXIgc2xldHRldFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtyZXBseU5vZGVzfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvTWVkaWEuQm9keT5cclxuICAgICAgICAgICAgICAgIDwvTWVkaWE+XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IENvbW1lbnRDb250cm9scyB9IGZyb20gJy4vQ29tbWVudENvbnRyb2xzJ1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gJy4vQ29tbWVudFByb2ZpbGUnXHJcbmltcG9ydCB7IGZvcm1hdFRleHQsIHRpbWVUZXh0IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFnbygpIHtcclxuICAgICAgICBjb25zdCB7IHBvc3RlZE9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB0aW1lVGV4dChwb3N0ZWRPbik7XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdGVkVmlldyhlZGl0ZWQpIHtcclxuICAgICAgICBpZighZWRpdGVkKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gIDxzcGFuPio8L3NwYW4+XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgY29udGV4dElkLCBuYW1lLCB0ZXh0LCBjb21tZW50SWQsIHJlcGxpZXMsIGNvbnN0cnVjdCwgYXV0aG9ySWQsIGVkaXRlZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfTtcclxuICAgICAgICBjb25zdCB0eHQgPSBmb3JtYXRUZXh0KHRleHQpO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSByZXBsaWVzLm1hcChyZXBseSA9PiBjb25zdHJ1Y3QocmVwbHkpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8TWVkaWE+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRQcm9maWxlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJtZWRpYS1oZWFkaW5nXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPntuYW1lfTwvc3Ryb25nPiA8c21hbGw+c2FnZGUge3RoaXMuYWdvKCl9e3RoaXMuZWRpdGVkVmlldyhlZGl0ZWQpfTwvc21hbGw+IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2g1PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17dHh0fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50Q29udHJvbHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRJZD17Y29udGV4dElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcklkPXthdXRob3JJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRJZD17Y29tbWVudElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17dGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtyZXBseU5vZGVzfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvTWVkaWEuQm9keT5cclxuICAgICAgICAgICAgICAgIDwvTWVkaWE+XHJcbiAgICB9XHJcbn1cclxuXHJcbkNvbW1lbnQucHJvcFR5cGVzID0ge1xyXG4gICAgY29udGV4dElkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICB0ZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICBjb21tZW50SWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHJlcGxpZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLFxyXG4gICAgY29uc3RydWN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuICAgIGF1dGhvcklkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgICBjYW5FZGl0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgZWRpdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxyXG5cclxuICAgIHNraXA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXHJcbiAgICB0YWtlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgZWRpdENvbW1lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBkZWxldGVDb21tZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLCBcclxuICAgIHJlcGx5Q29tbWVudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudERlbGV0ZWQgfSBmcm9tICcuL0NvbW1lbnREZWxldGVkJ1xyXG5pbXBvcnQgeyBDb21tZW50IH0gZnJvbSAnLi9Db21tZW50J1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudExpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RDb21tZW50ID0gdGhpcy5jb25zdHJ1Y3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcm9vdENvbW1lbnRzKGNvbW1lbnRzKSB7XHJcbiAgICAgICAgaWYgKCFjb21tZW50cykgcmV0dXJuO1xyXG5cclxuICAgICAgICByZXR1cm4gY29tbWVudHMubWFwKChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbnN0cnVjdENvbW1lbnQoY29tbWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiAgPE1lZGlhLkxpc3RJdGVtIGtleT17XCJyb290Q29tbWVudF9cIiArIGNvbW1lbnQuQ29tbWVudElEfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge25vZGV9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5MaXN0SXRlbT5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RDb21tZW50KGNvbW1lbnQpIHtcclxuICAgICAgICBjb25zdCBrZXkgPSBcImNvbW1lbnRJZFwiICsgY29tbWVudC5Db21tZW50SUQ7XHJcblxyXG4gICAgICAgIGlmIChjb21tZW50LkRlbGV0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybiAgPENvbW1lbnREZWxldGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17a2V5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3Q9e3RoaXMuY29uc3RydWN0Q29tbWVudH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGllcz17Y29tbWVudC5SZXBsaWVzfSAvPlxyXG5cclxuICAgICAgICBjb25zdCB7IGNvbnRleHRJZCwgZ2V0TmFtZSwgY2FuRWRpdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7IHNraXAsIHRha2UsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50LCByZXBseUNvbW1lbnQgfTtcclxuICAgICAgICBjb25zdCBuYW1lID0gZ2V0TmFtZShjb21tZW50LkF1dGhvcklEKTtcclxuICAgICAgICByZXR1cm4gIDxDb21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAga2V5PXtrZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dElkPXtjb250ZXh0SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT17bmFtZX1cclxuICAgICAgICAgICAgICAgICAgICBwb3N0ZWRPbj17Y29tbWVudC5Qb3N0ZWRPbn1cclxuICAgICAgICAgICAgICAgICAgICBhdXRob3JJZD17Y29tbWVudC5BdXRob3JJRH1cclxuICAgICAgICAgICAgICAgICAgICB0ZXh0PXtjb21tZW50LlRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0PXt0aGlzLmNvbnN0cnVjdENvbW1lbnR9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwbGllcz17Y29tbWVudC5SZXBsaWVzfVxyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRlZD17Y29tbWVudC5FZGl0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50SWQ9e2NvbW1lbnQuQ29tbWVudElEfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5yb290Q29tbWVudHMoY29tbWVudHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxNZWRpYS5MaXN0PlxyXG4gICAgICAgICAgICAgICAgICAgIHtub2Rlc31cclxuICAgICAgICAgICAgICAgIDwvTWVkaWEuTGlzdD5cclxuICAgIH1cclxufVxyXG5cclxuQ29tbWVudExpc3QucHJvcFR5cGVzID0ge1xyXG4gICAgY29tbWVudHM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLFxyXG4gICAgY29udGV4dElkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgZ2V0TmFtZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICBjYW5FZGl0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuICAgIHNraXA6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXHJcbiAgICB0YWtlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgZWRpdENvbW1lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBkZWxldGVDb21tZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLCBcclxuICAgIHJlcGx5Q29tbWVudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudEZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgVGV4dDogJydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnBvc3RDb21tZW50ID0gdGhpcy5wb3N0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RDb21tZW50KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgcG9zdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwb3N0SGFuZGxlKHRoaXMuc3RhdGUuVGV4dCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6ICcnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVRleHRDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUZXh0OiBlLnRhcmdldC52YWx1ZSB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxmb3JtIG9uU3VibWl0PXt0aGlzLnBvc3RDb21tZW50fT5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInJlbWFya1wiPktvbW1lbnRhcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRleHRDaGFuZ2V9IHZhbHVlPXt0aGlzLnN0YXRlLlRleHR9IHBsYWNlaG9sZGVyPVwiU2tyaXYga29tbWVudGFyIGhlci4uLlwiIGlkPVwicmVtYXJrXCIgcm93cz1cIjRcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiPlNlbmQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgIH1cclxufVxyXG5cclxuQ29tbWVudEZvcm0ucHJvcFR5cGVzID0ge1xyXG4gICAgcG9zdEhhbmRsZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxyXG59XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudExpc3QgfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50TGlzdCdcclxuaW1wb3J0IHsgQ29tbWVudEZvcm0gfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50Rm9ybSdcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gJy4uL3BhZ2luYXRpb24vUGFnaW5hdGlvbidcclxuaW1wb3J0IHsgZmV0Y2hDb21tZW50cywgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9jb21tZW50cydcclxuaW1wb3J0IHsgZ2V0Rm9ydW1Db21tZW50c0RlbGV0ZVVybCwgZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tbWVudHM6IHN0YXRlLmNvbW1lbnRzSW5mby5jb21tZW50cyxcclxuICAgICAgICBnZXROYW1lOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1tpZF07XHJcbiAgICAgICAgICAgIGlmKCF1c2VyKSByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHt1c2VyLkZpcnN0TmFtZX0gJHt1c2VyLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09IGlkLFxyXG4gICAgICAgIHBvc3RJZDogc3RhdGUuZm9ydW1JbmZvLnRpdGxlc0luZm8uc2VsZWN0ZWRUaHJlYWQsXHJcbiAgICAgICAgcGFnZTogc3RhdGUuY29tbWVudHNJbmZvLnBhZ2UsXHJcbiAgICAgICAgc2tpcDogc3RhdGUuY29tbWVudHNJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUuY29tbWVudHNJbmZvLnRha2UsXHJcbiAgICAgICAgdG90YWxQYWdlczogc3RhdGUuY29tbWVudHNJbmZvLnRvdGFsUGFnZXMsXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBlZGl0SGFuZGxlOiAoY29tbWVudElkLCBwb3N0SWQsIHRleHQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5mb3J1bWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChlZGl0Q29tbWVudCh1cmwsIGNvbW1lbnRJZCwgdGV4dCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZTogKGNvbW1lbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0Rm9ydW1Db21tZW50c0RlbGV0ZVVybChjb21tZW50SWQpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVDb21tZW50KHVybCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcGx5SGFuZGxlOiAocG9zdElkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgcG9zdElkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvYWRDb21tZW50czogKHBvc3RJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRGb3J1bUNvbW1lbnRzUGFnZVVybChwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdEhhbmRsZTogKHBvc3RJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmZvcnVtY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgcG9zdElkLCB0ZXh0LCBudWxsLCBjYikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRm9ydW1Db21tZW50c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQgPSB0aGlzLmRlbGV0ZUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmVkaXRDb21tZW50ID0gdGhpcy5lZGl0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlDb21tZW50ID0gdGhpcy5yZXBseUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnBvc3RDb21tZW50ID0gdGhpcy5wb3N0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucGFnZUhhbmRsZSA9IHRoaXMucGFnZUhhbmRsZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIHBvc3RJZCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHBhZ2UgfSA9IG5leHRQcm9wcy5sb2NhdGlvbi5xdWVyeTtcclxuICAgICAgICBpZighTnVtYmVyKHBhZ2UpKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2tpcFBhZ2VzID0gcGFnZSAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhwb3N0SWQsIHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFnZUhhbmRsZSh0bykge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdElkLCBwYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcbiAgICAgICAgaWYocGFnZSA9PSB0bykgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAvZm9ydW0vcG9zdC8ke3Bvc3RJZH0vY29tbWVudHM/cGFnZT0ke3RvfWA7XHJcbiAgICAgICAgcHVzaCh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBwb3N0SWQpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUhhbmRsZSwgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZShjb21tZW50SWQsIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIHBvc3RJZCwgdGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdEhhbmRsZSwgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkQ29tbWVudHMocG9zdElkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVkaXRIYW5kbGUoY29tbWVudElkLCBwb3N0SWQsIHRleHQsIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXBseUNvbW1lbnQocG9zdElkLCB0ZXh0LCBwYXJlbnRJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlIYW5kbGUsIGxvYWRDb21tZW50cywgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKHBvc3RJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXBseUhhbmRsZShwb3N0SWQsIHRleHQsIHBhcmVudElkLCBjYik7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdENvbW1lbnQodGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBwb3N0SWQsIHNraXAsIHRha2UsIHBvc3RIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhwb3N0SWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcG9zdEhhbmRsZShwb3N0SWQsIHRleHQsIGNiKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50cywgZ2V0TmFtZSwgY2FuRWRpdCwgdG90YWxQYWdlcywgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGlkIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbGV0IHByb3BzID0geyBza2lwLCB0YWtlIH07XHJcbiAgICAgICAgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9wcywge1xyXG4gICAgICAgICAgICBkZWxldGVDb21tZW50OiB0aGlzLmRlbGV0ZUNvbW1lbnQsXHJcbiAgICAgICAgICAgIGVkaXRDb21tZW50OiB0aGlzLmVkaXRDb21tZW50LFxyXG4gICAgICAgICAgICByZXBseUNvbW1lbnQ6IHRoaXMucmVwbHlDb21tZW50XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICA8Um93IGNsYXNzTmFtZT1cImZvcnVtLWNvbW1lbnRzLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiZm9ydW0tY29tbWVudHMtaGVhZGluZ1wiPktvbW1lbnRhcmVyPC9oND5cclxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudExpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudHM9e2NvbW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0SWQ9e051bWJlcihpZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE5hbWU9e2dldE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzXHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8UGFnaW5hdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2VzPXt0b3RhbFBhZ2VzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlPXtwYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlSGFuZGxlPXt0aGlzLnBhZ2VIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnPXsxMn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50Rm9ybSBwb3N0SGFuZGxlPXt0aGlzLnBvc3RDb21tZW50fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEZvcnVtQ29tbWVudHNDb250YWluZXJSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEZvcnVtQ29tbWVudHNDb250YWluZXIpO1xyXG5jb25zdCBGb3J1bUNvbW1lbnRzID0gd2l0aFJvdXRlcihGb3J1bUNvbW1lbnRzQ29udGFpbmVyUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBGb3J1bUNvbW1lbnRzO1xyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IFJvdywgQ29sLCBQYW5lbCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lLCBmaXJzdE5hbWUsIGxhc3ROYW1lLCBlbWFpbCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBlbWFpbExpbmsgPSBcIm1haWx0bzpcIiArIGVtYWlsO1xyXG4gICAgICAgIGNvbnN0IGdhbGxlcnkgPSBcIi9cIiArIHVzZXJuYW1lICsgXCIvZ2FsbGVyeVwiO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxDb2wgbGc9ezN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e2Ake2ZpcnN0TmFtZX0gJHtsYXN0TmFtZX1gfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFVzZXJJdGVtIHRpdGxlPVwiQnJ1Z2VybmF2blwiPnt1c2VybmFtZX08L1VzZXJJdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VXNlckl0ZW0gdGl0bGU9XCJFbWFpbFwiPjxhIGhyZWY9e2VtYWlsTGlua30+e2VtYWlsfTwvYT48L1VzZXJJdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VXNlckl0ZW0gdGl0bGU9XCJCaWxsZWRlclwiPjxMaW5rIHRvPXtnYWxsZXJ5fT5CaWxsZWRlcjwvTGluaz48L1VzZXJJdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUGFuZWw+XHJcbiAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXNlckhlYWRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPENvbCBsZz17Nn0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57dGhpcy5wcm9wcy5jaGlsZHJlbn08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBVc2VyQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8Q29sIGxnPXs2fT5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBVc2VySXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPFVzZXJIZWFkaW5nPnt0aXRsZX08L1VzZXJIZWFkaW5nPlxyXG4gICAgICAgICAgICAgICAgICAgIDxVc2VyQm9keT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L1VzZXJCb2R5PlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vVXNlcidcclxuaW1wb3J0IHsgUm93IH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHVzZXJOb2RlcygpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB1c2Vycy5tYXAoKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlcklkID0gYHVzZXJJZF8ke3VzZXIuSUR9YDtcclxuICAgICAgICAgICAgcmV0dXJuICA8VXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VyLlVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZD17dXNlci5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU9e3VzZXIuRmlyc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lPXt1c2VyLkxhc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsPXt1c2VyLkVtYWlsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGVVcmw9e3VzZXIuUHJvZmlsZUltYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVzPXt1c2VyLlJvbGVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17dXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnVzZXJOb2RlcygpfVxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcblxyXG5leHBvcnQgY2xhc3MgQnJlYWRjcnVtYiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8b2wgY2xhc3NOYW1lPVwiYnJlYWRjcnVtYlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9vbD5cclxuICAgIH1cclxufVxyXG5cclxuQnJlYWRjcnVtYi5JdGVtID0gY2xhc3MgSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBocmVmLCBhY3RpdmUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYoYWN0aXZlKSByZXR1cm4gICA8bGkgY2xhc3NOYW1lPVwiYWN0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG5cclxuICAgICAgICByZXR1cm4gIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17aHJlZn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcblxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IGZldGNoVXNlcnMgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgeyBVc2VyTGlzdCB9IGZyb20gJy4uL3VzZXJzL1VzZXJMaXN0J1xyXG5pbXBvcnQgeyBSb3csIENvbCwgUGFnZUhlYWRlciB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuaW1wb3J0IHsgQnJlYWRjcnVtYiB9IGZyb20gJy4uL2JyZWFkY3J1bWJzL0JyZWFkY3J1bWInXHJcbmltcG9ydCB7IHZhbHVlcyB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcblxyXG5jb25zdCBtYXBVc2Vyc1RvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlcnM6IHZhbHVlcyhzdGF0ZS51c2Vyc0luZm8udXNlcnMpXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0VXNlcnM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hVc2VycygpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBVc2Vyc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiQnJ1Z2VyZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsyfSBsZz17OH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnJlYWRjcnVtYj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnJlYWRjcnVtYi5JdGVtIGhyZWY9XCIvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZvcnNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JyZWFkY3J1bWIuSXRlbT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnJlYWRjcnVtYi5JdGVtIGFjdGl2ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQnJ1Z2VyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnJlYWRjcnVtYi5JdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CcmVhZGNydW1iPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsyfSBsZz17OH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQYWdlSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW51cGxhbidzIDxzbWFsbD5icnVnZXJlPC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9QYWdlSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVzZXJMaXN0IHVzZXJzPXt1c2Vyc30gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVXNlcnMgPSBjb25uZWN0KG1hcFVzZXJzVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2Vyc0NvbnRhaW5lcilcclxuZXhwb3J0IGRlZmF1bHQgVXNlcnMiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IFJvdywgQ29sLCBJbWFnZSBhcyBJbWFnZUJzIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3hIYW5kbGVyID0gdGhpcy5jaGVja2JveEhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja2JveEhhbmRsZXIoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYWRkID0gZS5jdXJyZW50VGFyZ2V0LmNoZWNrZWQ7XHJcbiAgICAgICAgaWYoYWRkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYWRkU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB7IHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21tZW50SWNvbihjb3VudCkge1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gY291bnQgPT0gMCA/IFwiY29sLWxnLTYgdGV4dC1tdXRlZFwiIDogXCJjb2wtbGctNiB0ZXh0LXByaW1hcnlcIjtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBzdHlsZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiAgPGRpdiB7Li4uIHByb3BzfT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNvbW1lbnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IHtjb3VudH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrYm94VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIGltYWdlSXNTZWxlY3RlZCwgaW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IGltYWdlSXNTZWxlY3RlZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICByZXR1cm4gKGNhbkVkaXQgP1xyXG4gICAgICAgICAgICA8Q29sIGxnPXs2fSBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0IHRleHQtcmlnaHRcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICBTbGV0IDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbkNsaWNrPXt0aGlzLmNoZWNrYm94SGFuZGxlcn0gY2hlY2tlZD17Y2hlY2tlZH0gLz5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxucmVuZGVyKCkge1xyXG4gICAgY29uc3QgeyBpbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBsZXQgY291bnQgPSBpbWFnZS5Db21tZW50Q291bnQ7XHJcbiAgICBjb25zdCB1cmwgPSBgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZS5JbWFnZUlEfS9jb21tZW50c2A7XHJcbiAgICByZXR1cm4gIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8TGluayB0bz17dXJsfT5cclxuICAgICAgICAgICAgICAgICAgICA8SW1hZ2VCcyBzcmM9e2ltYWdlLlByZXZpZXdVcmx9IHRodW1ibmFpbCAvPlxyXG4gICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17dXJsfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuY29tbWVudEljb24oY291bnQpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5jaGVja2JveFZpZXcoKX1cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IEltYWdlIH0gZnJvbSAnLi9JbWFnZSdcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBlbGVtZW50c1BlclJvdyA9IDQ7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZUxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgYXJyYW5nZUFycmF5KGltYWdlcykge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGltYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgdGltZXMgPSBNYXRoLmNlaWwobGVuZ3RoIC8gZWxlbWVudHNQZXJSb3cpO1xyXG5cclxuICAgICAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRpbWVzOyBpKyspIHtcclxuICAgICAgICAgICAgc3RhcnQgPSBpICogZWxlbWVudHNQZXJSb3c7XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgZWxlbWVudHNQZXJSb3c7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBlbmQgPiBsZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxhc3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGltYWdlcy5zbGljZShzdGFydCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyb3cpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gaW1hZ2VzLnNsaWNlKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBpbWFnZXNWaWV3KGltYWdlcykge1xyXG4gICAgICAgIGlmKGltYWdlcy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCwgZGVsZXRlU2VsZWN0ZWRJbWFnZXMsIGNhbkVkaXQsIGltYWdlSXNTZWxlY3RlZCwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hcnJhbmdlQXJyYXkoaW1hZ2VzKTtcclxuICAgICAgICBjb25zdCB2aWV3ID0gcmVzdWx0Lm1hcCgocm93LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGltZ3MgPSByb3cubWFwKChpbWcpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAgPENvbCBsZz17M30ga2V5PXtpbWcuSW1hZ2VJRH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZT17aW1nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkPXthZGRTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkPXtyZW1vdmVTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VJc1NlbGVjdGVkPXtpbWFnZUlzU2VsZWN0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgcm93SWQgPSBcInJvd0lkXCIgKyBpO1xyXG4gICAgICAgICAgICByZXR1cm4gIDxSb3cga2V5PXtyb3dJZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpbWdzfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5pbWFnZXNWaWV3KGltYWdlcyl9XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgdXBsb2FkSW1hZ2UsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgIGRlbGV0ZUltYWdlcywgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBjbGVhclNlbGVjdGVkSW1hZ2VJZHMsIGZldGNoVXNlckltYWdlcyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvaW1hZ2VzJ1xyXG5pbXBvcnQgeyBFcnJvciB9IGZyb20gJy4vRXJyb3InXHJcbmltcG9ydCB7IEltYWdlVXBsb2FkIH0gZnJvbSAnLi4vaW1hZ2VzL0ltYWdlVXBsb2FkJ1xyXG5pbXBvcnQgSW1hZ2VMaXN0IGZyb20gJy4uL2ltYWdlcy9JbWFnZUxpc3QnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBSb3csIENvbCwgQnV0dG9uIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5pbXBvcnQgeyBCcmVhZGNydW1iIH0gZnJvbSAnLi4vYnJlYWRjcnVtYnMvQnJlYWRjcnVtYidcclxuaW1wb3J0IHsgdmFsdWVzLCBzb3J0QnkgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgVXNlZFNwYWNlIGZyb20gJy4vVXNlZFNwYWNlJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IG93bmVySWQgfSA9IHN0YXRlLmltYWdlc0luZm87XHJcbiAgICBjb25zdCBjdXJyZW50SWQgPSBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZDtcclxuICAgIGNvbnN0IGNhbkVkaXQgPSAob3duZXJJZCA+IDAgJiYgY3VycmVudElkID4gMCAmJiBvd25lcklkID09IGN1cnJlbnRJZCk7XHJcbiAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzW293bmVySWRdO1xyXG4gICAgY29uc3QgZnVsbE5hbWUgPSB1c2VyID8gYCR7dXNlci5GaXJzdE5hbWV9ICR7dXNlci5MYXN0TmFtZX1gIDogJyc7XHJcbiAgICBjb25zdCBpbWFnZXMgPSBzb3J0QnkodmFsdWVzKHN0YXRlLmltYWdlc0luZm8uaW1hZ2VzKSwgKGltZykgPT4gLWltZy5JbWFnZUlEKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGltYWdlczogaW1hZ2VzLFxyXG4gICAgICAgIGNhbkVkaXQ6IGNhbkVkaXQsXHJcbiAgICAgICAgc2VsZWN0ZWRJbWFnZUlkczogc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWRzLFxyXG4gICAgICAgIGZ1bGxOYW1lOiBmdWxsTmFtZSxcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwbG9hZEltYWdlOiAodXNlcm5hbWUsIGZvcm1EYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSwgKCkgPT4geyBkaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTsgfSwgKCkgPT4geyB9KSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBJbWFnZXMgdG8gYmUgZGVsZXRlZCBieSBzZWxlY3Rpb246XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFkZFNlbGVjdGVkSW1hZ2VJZChpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgLy8gSW1hZ2VzIHRvIGJlIGRlbGV0ZWQgYnkgc2VsZWN0aW9uOlxyXG4gICAgICAgICAgICBkaXNwYXRjaChyZW1vdmVTZWxlY3RlZEltYWdlSWQoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUltYWdlczogKHVzZXJuYW1lLCBpZHMpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBpZHMpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsZWFyU2VsZWN0ZWRJbWFnZUlkczogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBVc2VySW1hZ2VzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VJc1NlbGVjdGVkID0gdGhpcy5pbWFnZUlzU2VsZWN0ZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzID0gdGhpcy5kZWxldGVTZWxlY3RlZEltYWdlcy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZCA9IHRoaXMuY2xlYXJTZWxlY3RlZC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgcm91dGVyLCByb3V0ZSB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB1c2VybmFtZSArIFwiJ3MgYmlsbGVkZXJcIjtcclxuICAgICAgICByb3V0ZXIuc2V0Um91dGVMZWF2ZUhvb2socm91dGUsIHRoaXMuY2xlYXJTZWxlY3RlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTZWxlY3RlZCgpIHtcclxuICAgICAgICBjb25zdCB7IGNsZWFyU2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpbWFnZUlzU2VsZWN0ZWQoY2hlY2tJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXMgPSBmaW5kKHNlbGVjdGVkSW1hZ2VJZHMsIChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaWQgPT0gY2hlY2tJZDtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0ZWRJbWFnZUlkcywgZGVsZXRlSW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgc2VsZWN0ZWRJbWFnZUlkcyk7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBsb2FkVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIHVwbG9hZEltYWdlLCBzZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IGhhc0ltYWdlcyA9IHNlbGVjdGVkSW1hZ2VJZHMubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgaWYoIWNhbkVkaXQpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZz17NH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxJbWFnZVVwbG9hZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkSW1hZ2U9e3VwbG9hZEltYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7J1xcdTAwQTAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cImRhbmdlclwiIGRpc2FibGVkPXshaGFzSW1hZ2VzfSBvbkNsaWNrPXt0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzfT5TbGV0IG1hcmtlcmV0IGJpbGxlZGVyPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvSW1hZ2VVcGxvYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxuXHJcbiAgICB1cGxvYWRMaW1pdFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCB1cGxvYWRJbWFnZSwgc2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZighY2FuRWRpdCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXsyfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VkU3BhY2UgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IGltYWdlcywgZnVsbE5hbWUsIGNhbkVkaXQsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJyZWFkY3J1bWI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJyZWFkY3J1bWIuSXRlbSBocmVmPVwiL1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGb3JzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CcmVhZGNydW1iLkl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJyZWFkY3J1bWIuSXRlbSBhY3RpdmU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt1c2VybmFtZX0ncyBiaWxsZWRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnJlYWRjcnVtYi5JdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CcmVhZGNydW1iPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsyfSBsZz17OH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDE+PHNwYW4gY2xhc3NOYW1lPVwidGV4dC1jYXBpdGFsaXplXCI+e2Z1bGxOYW1lfTwvc3Bhbj4ncyA8c21hbGw+YmlsbGVkZSBnYWxsZXJpPC9zbWFsbD48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW1hZ2VMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VzPXtpbWFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ9e2FkZFNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQ9e3JlbW92ZVNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlzU2VsZWN0ZWQ9e3RoaXMuaW1hZ2VJc1NlbGVjdGVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy51cGxvYWRWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnVwbG9hZExpbWl0VmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFVzZXJJbWFnZXNSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFVzZXJJbWFnZXNDb250YWluZXIpO1xyXG5jb25zdCBVc2VySW1hZ2VzID0gd2l0aFJvdXRlcihVc2VySW1hZ2VzUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBVc2VySW1hZ2VzO1xyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IHNldFNlbGVjdGVkSW1nLCBmZXRjaFNpbmdsZUltYWdlLCBkZWxldGVJbWFnZSB9IGZyb20gJy4uLy4uL2FjdGlvbnMvaW1hZ2VzJ1xyXG5pbXBvcnQgeyBzZXRTa2lwQ29tbWVudHMsIHNldFRha2VDb21tZW50cywgc2V0Rm9jdXNlZENvbW1lbnQsIHJlY2VpdmVkQ29tbWVudHMgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2NvbW1lbnRzJ1xyXG5pbXBvcnQgeyBzZXRFcnJvciB9IGZyb20gJy4uLy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IE1vZGFsLCBJbWFnZSwgQnV0dG9uLCBCdXR0b25Ub29sYmFyLCBHbHlwaGljb24sIEdyaWQsIFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBvd25lcklkICA9IHN0YXRlLmltYWdlc0luZm8ub3duZXJJZDtcclxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkO1xyXG4gICAgY29uc3QgY2FuRWRpdCA9IChvd25lcklkID4gMCAmJiBjdXJyZW50SWQgPiAwICYmIG93bmVySWQgPT0gY3VycmVudElkKTtcclxuXHJcbiAgICBjb25zdCBnZXRJbWFnZSA9IChpZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBmaW5kKHN0YXRlLmltYWdlc0luZm8uaW1hZ2VzLCBpbWFnZSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpbWFnZS5JbWFnZUlEID09IGlkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBpbWFnZSA9ICgpID0+IGdldEltYWdlKHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkKTtcclxuICAgIGNvbnN0IGZpbGVuYW1lID0gKCkgPT4geyBpZihpbWFnZSgpKSByZXR1cm4gaW1hZ2UoKS5GaWxlbmFtZTsgcmV0dXJuICcnOyB9O1xyXG4gICAgY29uc3QgcHJldmlld1VybCA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuUHJldmlld1VybDsgcmV0dXJuICcnOyB9O1xyXG4gICAgY29uc3QgZXh0ZW5zaW9uID0gKCkgPT4geyBpZihpbWFnZSgpKSByZXR1cm4gaW1hZ2UoKS5FeHRlbnNpb247IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IG9yaWdpbmFsVXJsID0gKCkgPT4geyBpZihpbWFnZSgpKSByZXR1cm4gaW1hZ2UoKS5PcmlnaW5hbFVybDsgcmV0dXJuICcnOyB9O1xyXG4gICAgY29uc3QgdXBsb2FkZWQgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLlVwbG9hZGVkOyByZXR1cm4gbmV3IERhdGUoKTsgfTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNhbkVkaXQ6IGNhbkVkaXQsXHJcbiAgICAgICAgaGFzSW1hZ2U6ICgpID0+IEJvb2xlYW4oZ2V0SW1hZ2Uoc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWQpKSxcclxuICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWUoKSxcclxuICAgICAgICBwcmV2aWV3VXJsOiBwcmV2aWV3VXJsKCksXHJcbiAgICAgICAgZXh0ZW5zaW9uOiBleHRlbnNpb24oKSxcclxuICAgICAgICBvcmlnaW5hbFVybDogb3JpZ2luYWxVcmwoKSxcclxuICAgICAgICB1cGxvYWRlZDogdXBsb2FkZWQoKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc2VsZWN0SW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcodW5kZWZpbmVkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRFcnJvcjogKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaEltYWdlOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hTaW5nbGVJbWFnZShpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2U6IChpZCwgdXNlcm5hbWUpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNldENvbW1lbnRzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNraXBDb21tZW50cygwKSk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2VDb21tZW50cygxMCkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRGb2N1c2VkQ29tbWVudCgtMSkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlZENvbW1lbnRzKFtdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNb2RhbEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSW1hZ2VIYW5kbGVyID0gdGhpcy5kZWxldGVJbWFnZUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc2VlQWxsQ29tbWVudHNWaWV3ID0gdGhpcy5zZWVBbGxDb21tZW50c1ZpZXcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlbG9hZCA9IHRoaXMucmVsb2FkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZXNlbGVjdEltYWdlLCByZXNldENvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgcHVzaCB9ID0gdGhpcy5wcm9wcy5yb3V0ZXI7XHJcblxyXG4gICAgICAgIGRlc2VsZWN0SW1hZ2UoKTtcclxuICAgICAgICBjb25zdCBnYWxsZXJ5VXJsID0gYC8ke3VzZXJuYW1lfS9nYWxsZXJ5YDtcclxuICAgICAgICByZXNldENvbW1lbnRzKCk7XHJcbiAgICAgICAgcHVzaChnYWxsZXJ5VXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJbWFnZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVJbWFnZSwgc2V0U2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgaWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuXHJcbiAgICAgICAgZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKTtcclxuICAgICAgICBzZXRTZWxlY3RlZEltYWdlSWQoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUltYWdlVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYoIWNhbkVkaXQpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiA8QnV0dG9uIGJzU3R5bGU9XCJkYW5nZXJcIiBvbkNsaWNrPXt0aGlzLmRlbGV0ZUltYWdlSGFuZGxlcn0+U2xldCBiaWxsZWRlPC9CdXR0b24+O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbG9hZCgpIHtcclxuICAgICAgICBjb25zdCB7IGlkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuXHJcbiAgICAgICAgY29uc3QgcGF0aCA9IGAvJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2lkfS9jb21tZW50c2A7XHJcbiAgICAgICAgcHVzaChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWVBbGxDb21tZW50c1ZpZXcoKSB7XHJcbiAgICAgICAgY29uc3Qgc2hvdyA9ICFCb29sZWFuKHRoaXMucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgICAgIGlmKCFzaG93KSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gb25DbGljaz17dGhpcy5yZWxvYWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8R2x5cGhpY29uIGdseXBoPVwicmVmcmVzaFwiLz4gU2UgYWxsZSBrb21tZW50YXJlcj9cclxuICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvcD5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBmaWxlbmFtZSwgcHJldmlld1VybCwgZXh0ZW5zaW9uLCBvcmlnaW5hbFVybCwgdXBsb2FkZWQsIGhhc0ltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHNob3cgPSBoYXNJbWFnZSgpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBmaWxlbmFtZSArIFwiLlwiICsgZXh0ZW5zaW9uO1xyXG4gICAgICAgIGNvbnN0IHVwbG9hZERhdGUgPSBtb21lbnQodXBsb2FkZWQpO1xyXG4gICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBcIlVwbG9hZGVkIGQuIFwiICsgdXBsb2FkRGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKSArIFwia2wuIFwiICsgdXBsb2FkRGF0ZS5mb3JtYXQoXCJIOm1tXCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxNb2RhbCBzaG93PXtzaG93fSBvbkhpZGU9e3RoaXMuY2xvc2V9IGJzU2l6ZT1cImxhcmdlXCIgYW5pbWF0aW9uPXt0cnVlfT5cclxuICAgICAgICAgICAgICAgICAgICA8TW9kYWwuSGVhZGVyIGNsb3NlQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWwuVGl0bGU+e25hbWV9PHNwYW4+PHNtYWxsPiAtIHtkYXRlU3RyaW5nfTwvc21hbGw+PC9zcGFuPjwvTW9kYWwuVGl0bGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5IZWFkZXI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxNb2RhbC5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtvcmlnaW5hbFVybH0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbWFnZSBzcmM9e3ByZXZpZXdVcmx9IHJlc3BvbnNpdmUgY2xhc3NOYW1lPVwiY2VudGVyLWJsb2NrXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5Cb2R5PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8TW9kYWwuRm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5zZWVBbGxDb21tZW50c1ZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uVG9vbGJhciBzdHlsZT17e2Zsb2F0OiBcInJpZ2h0XCJ9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmRlbGV0ZUltYWdlVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXt0aGlzLmNsb3NlfT5MdWs8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Ub29sYmFyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvTW9kYWwuRm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgPC9Nb2RhbD5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgU2VsZWN0ZWRJbWFnZVJlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoTW9kYWxJbWFnZSk7XHJcbmNvbnN0IFNlbGVjdGVkSW1hZ2UgPSB3aXRoUm91dGVyKFNlbGVjdGVkSW1hZ2VSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IFNlbGVjdGVkSW1hZ2U7XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgZmV0Y2hDb21tZW50cywgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9jb21tZW50cydcclxuaW1wb3J0IHsgaW5jcmVtZW50Q29tbWVudENvdW50LCBkZWNyZW1lbnRDb21tZW50Q291bnQgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2ltYWdlcydcclxuaW1wb3J0IHsgQ29tbWVudExpc3QgfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50TGlzdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSAnLi4vcGFnaW5hdGlvbi9QYWdpbmF0aW9uJ1xyXG5pbXBvcnQgeyBDb21tZW50Rm9ybSB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRGb3JtJ1xyXG5pbXBvcnQgeyBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybCwgZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2FuRWRpdDogKGlkKSA9PiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZCA9PSBpZCxcclxuICAgICAgICBpbWFnZUlkOiBzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCxcclxuICAgICAgICBza2lwOiBzdGF0ZS5jb21tZW50c0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5jb21tZW50c0luZm8udGFrZSxcclxuICAgICAgICBwYWdlOiBzdGF0ZS5jb21tZW50c0luZm8ucGFnZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS5jb21tZW50c0luZm8udG90YWxQYWdlcyxcclxuICAgICAgICBjb21tZW50czogc3RhdGUuY29tbWVudHNJbmZvLmNvbW1lbnRzLFxyXG4gICAgICAgIGdldE5hbWU6ICh1c2VySWQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vyc1t1c2VySWRdO1xyXG4gICAgICAgICAgICBjb25zdCB7IEZpcnN0TmFtZSwgTGFzdE5hbWUgfSA9IHVzZXI7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtGaXJzdE5hbWV9ICR7TGFzdE5hbWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG93bmVyOiBzdGF0ZS51c2Vyc0luZm8udXNlcnNbc3RhdGUuaW1hZ2VzSW5mby5vd25lcklkXVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcG9zdEhhbmRsZTogKGltYWdlSWQsIHRleHQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudCh1cmwsIGltYWdlSWQsIHRleHQsIG51bGwsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaENvbW1lbnRzOiAoaW1hZ2VJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybChpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVkaXRIYW5kbGU6IChjb21tZW50SWQsIGltYWdlSWQsIHRleHQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChlZGl0Q29tbWVudCh1cmwsIGNvbW1lbnRJZCwgdGV4dCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZTogKGNvbW1lbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybChjb21tZW50SWQpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVDb21tZW50KHVybCwgY2IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcGx5SGFuZGxlOiAoaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZWNvbW1lbnRzO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudCh1cmwsIGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5jcmVtZW50Q291bnQ6IChpbWFnZUlkKSA9PiBkaXNwYXRjaChpbmNyZW1lbnRDb21tZW50Q291bnQoaW1hZ2VJZCkpLFxyXG4gICAgICAgIGRlY3JlbWVudENvdW50OiAoaW1hZ2VJZCkgPT4gZGlzcGF0Y2goZGVjcmVtZW50Q29tbWVudENvdW50KGltYWdlSWQpKSxcclxuICAgICAgICBsb2FkQ29tbWVudHM6IChpbWFnZUlkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlQ29tbWVudHNQYWdlVXJsKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKHVybCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ29tbWVudHNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5wYWdlSGFuZGxlID0gdGhpcy5wYWdlSGFuZGxlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDb21tZW50ID0gdGhpcy5kZWxldGVDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5lZGl0Q29tbWVudCA9IHRoaXMuZWRpdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlcGx5Q29tbWVudCA9IHRoaXMucmVwbHlDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5wb3N0Q29tbWVudCA9IHRoaXMucG9zdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIGNvbnN0IHsgZmV0Y2hDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHBhZ2UgfSA9IG5leHRQcm9wcy5sb2NhdGlvbi5xdWVyeTtcclxuICAgICAgICBpZighTnVtYmVyKHBhZ2UpKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2tpcFBhZ2VzID0gcGFnZSAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcEl0ZW1zLCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICBwYWdlSGFuZGxlKHRvKSB7XHJcbiAgICAgICAgY29uc3QgeyBvd25lciwgaW1hZ2VJZCwgcGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gb3duZXIuVXNlcm5hbWU7XHJcbiAgICAgICAgaWYocGFnZSA9PSB0bykgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGAvJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlSWR9L2NvbW1lbnRzP3BhZ2U9JHt0b31gO1xyXG4gICAgICAgIHB1c2godXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVDb21tZW50KGNvbW1lbnRJZCwgaW1hZ2VJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVsZXRlSGFuZGxlLCBsb2FkQ29tbWVudHMsIGRlY3JlbWVudENvdW50LCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBkZWNyZW1lbnRDb3VudChpbWFnZUlkKTtcclxuICAgICAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlKGNvbW1lbnRJZCwgY2IpO1xyXG4gICAgfVxyXG5cclxuICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBza2lwLCB0YWtlLCBlZGl0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4gbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgICAgIGVkaXRIYW5kbGUoY29tbWVudElkLCBpbWFnZUlkLCB0ZXh0LCBjYik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbHlDb21tZW50KGltYWdlSWQsIHRleHQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGluY3JlbWVudENvdW50LCBza2lwLCB0YWtlLCByZXBseUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgaW5jcmVtZW50Q291bnQoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcGx5SGFuZGxlKGltYWdlSWQsIHRleHQsIHBhcmVudElkLCBjYik7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdENvbW1lbnQodGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VJZCwgbG9hZENvbW1lbnRzLCBpbmNyZW1lbnRDb3VudCwgc2tpcCwgdGFrZSwgcG9zdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgaW5jcmVtZW50Q291bnQoaW1hZ2VJZCk7XHJcbiAgICAgICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBvc3RIYW5kbGUoaW1hZ2VJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIGNvbW1lbnRzLCBnZXROYW1lLCBpbWFnZUlkLCBwYWdlLCB0b3RhbFBhZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgcHJvcHMgPSB7IHNraXAsIHRha2UgfTtcclxuICAgICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHByb3BzLCB7XHJcbiAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQ6IHRoaXMuZGVsZXRlQ29tbWVudCxcclxuICAgICAgICAgICAgZWRpdENvbW1lbnQ6IHRoaXMuZWRpdENvbW1lbnQsXHJcbiAgICAgICAgICAgIHJlcGx5Q29tbWVudDogdGhpcy5yZXBseUNvbW1lbnRcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsxfSBsZz17MTF9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dElkPXtpbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzPXtjb21tZW50c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXROYW1lPXtnZXROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezF9IGxnPXsxMH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGFnaW5hdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM9e3RvdGFsUGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZT17cGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlSGFuZGxlPXt0aGlzLnBhZ2VIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsxfSBsZz17MTB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRGb3JtIHBvc3RIYW5kbGU9e3RoaXMucG9zdENvbW1lbnR9Lz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgQ29tbWVudHNSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKENvbW1lbnRzQ29udGFpbmVyKTtcclxuY29uc3QgSW1hZ2VDb21tZW50cyA9IHdpdGhSb3V0ZXIoQ29tbWVudHNSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IEltYWdlQ29tbWVudHM7XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudCB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnQnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgV2VsbCwgQnV0dG9uLCBHbHlwaGljb24gfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBmZXRjaEFuZEZvY3VzU2luZ2xlQ29tbWVudCwgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9jb21tZW50cydcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgb2JqTWFwLCBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybCwgZ2V0SW1hZ2VDb21tZW50c0RlbGV0ZVVybCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBjb21tZW50cywgZm9jdXNlZENvbW1lbnQgfSA9IHN0YXRlLmNvbW1lbnRzSW5mbztcclxuICAgIGNvbnN0IHsgdXNlcnMgfSA9IHN0YXRlLnVzZXJzSW5mbztcclxuICAgIGNvbnN0IHsgb3duZXJJZCwgc2VsZWN0ZWRJbWFnZUlkIH0gPSBzdGF0ZS5pbWFnZXNJbmZvO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TmFtZTogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IHVzZXJzW2lkXTtcclxuICAgICAgICAgICAgcmV0dXJuIGAke2F1dGhvci5GaXJzdE5hbWV9ICR7YXV0aG9yLkxhc3ROYW1lfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb2N1c2VkSWQ6IGZvY3VzZWRDb21tZW50LFxyXG4gICAgICAgIGZvY3VzZWQ6IGNvbW1lbnRzWzBdLFxyXG4gICAgICAgIGltYWdlSWQ6IHNlbGVjdGVkSW1hZ2VJZCxcclxuICAgICAgICBpbWFnZU93bmVyOiB1c2Vyc1tvd25lcklkXS5Vc2VybmFtZSxcclxuICAgICAgICBjYW5FZGl0OiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09IGlkLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmNvbW1lbnRzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmNvbW1lbnRzSW5mby50YWtlLFxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZWRpdEhhbmRsZTogKGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGVkaXRDb21tZW50KHVybCwgY29tbWVudElkLCB0ZXh0LCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlOiAoY29tbWVudElkLCBjYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzRGVsZXRlVXJsKGNvbW1lbnRJZCk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUNvbW1lbnQodXJsLCBjYikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVwbHlIYW5kbGU6IChpbWFnZUlkLCB0ZXh0LCBwYXJlbnRJZCwgY2IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlY29tbWVudHM7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KHVybCwgaW1hZ2VJZCwgdGV4dCwgcGFyZW50SWQsIGNiKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb2N1c0NvbW1lbnQ6IChpZCkgPT4gZGlzcGF0Y2goZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQoaWQpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTaW5nbGVDb21tZW50UmVkdXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5hbGxDb21tZW50cyA9IHRoaXMuYWxsQ29tbWVudHMuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQgPSB0aGlzLmRlbGV0ZUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmVkaXRDb21tZW50ID0gdGhpcy5lZGl0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHlDb21tZW50ID0gdGhpcy5yZXBseUNvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBhbGxDb21tZW50cygpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIGltYWdlT3duZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuXHJcbiAgICAgICAgY29uc3QgcGF0aCA9IGAvJHtpbWFnZU93bmVyfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2VJZH0vY29tbWVudHNgO1xyXG4gICAgICAgIHB1c2gocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQ29tbWVudChjb21tZW50SWQsIGNvbnRleHRJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVsZXRlSGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBkZWxldGVIYW5kbGUoY29tbWVudElkLCB0aGlzLmFsbENvbW1lbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIGNvbnRleHRJZCwgdGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdEhhbmRsZSwgZm9jdXNDb21tZW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4gZm9jdXNDb21tZW50KGNvbW1lbnRJZCk7XHJcbiAgICAgICAgZWRpdEhhbmRsZShjb21tZW50SWQsIGNvbnRleHRJZCwgdGV4dCwgY2IpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGx5Q29tbWVudChjb250ZXh0SWQsIHRleHQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXBseUhhbmRsZShjb250ZXh0SWQsIHRleHQsIHBhcmVudElkLCB0aGlzLmFsbENvbW1lbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBmb2N1c2VkSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgaWYoZm9jdXNlZElkIDwgMCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgVGV4dCwgQXV0aG9ySUQsIENvbW1lbnRJRCwgUG9zdGVkT24sIEVkaXRlZCB9ID0gdGhpcy5wcm9wcy5mb2N1c2VkO1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgaW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbGV0IHByb3BzID0geyBza2lwLCB0YWtlIH07XHJcbiAgICAgICAgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9wcywge1xyXG4gICAgICAgICAgICBkZWxldGVDb21tZW50OiB0aGlzLmRlbGV0ZUNvbW1lbnQsXHJcbiAgICAgICAgICAgIGVkaXRDb21tZW50OiB0aGlzLmVkaXRDb21tZW50LFxyXG4gICAgICAgICAgICByZXBseUNvbW1lbnQ6IHRoaXMucmVwbHlDb21tZW50XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnByb3BzLmdldE5hbWUoQXV0aG9ySUQpO1xyXG5cclxuICAgICAgICByZXR1cm4gIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdlbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0SWQ9e2ltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPXtuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17VGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRJZD17Q29tbWVudElEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGllcz17W119XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9ySWQ9e0F1dGhvcklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdGVkT249e1Bvc3RlZE9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdGVkPXtFZGl0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvV2VsbD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXt0aGlzLmFsbENvbW1lbnRzfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8R2x5cGhpY29uIGdseXBoPVwicmVmcmVzaFwiLz4gU2UgYWxsZSBrb21tZW50YXJlcj9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgU2luZ2xlQ29tbWVudENvbm5lY3QgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShTaW5nbGVDb21tZW50UmVkdXgpO1xyXG5jb25zdCBTaW5nbGVJbWFnZUNvbW1lbnQgPSB3aXRoUm91dGVyKFNpbmdsZUNvbW1lbnRDb25uZWN0KTtcclxuZXhwb3J0IGRlZmF1bHQgU2luZ2xlSW1hZ2VDb21tZW50O1xyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5pbXBvcnQgeyBCcmVhZGNydW1iIH0gZnJvbSAnLi4vYnJlYWRjcnVtYnMvQnJlYWRjcnVtYidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFib3V0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJPbVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJyZWFkY3J1bWI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJyZWFkY3J1bWIuSXRlbSBocmVmPVwiL1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGb3JzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CcmVhZGNydW1iLkl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJyZWFkY3J1bWIuSXRlbSBhY3RpdmU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9tXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CcmVhZGNydW1iLkl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JyZWFkY3J1bWI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZXR0ZSBlciBlbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbiFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGVrbm9sb2dpZXIgYnJ1Z3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlYWN0PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5SZWR1eDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVhY3QtQm9vdHN0cmFwPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5SZWFjdFJvdXRlcjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+QXNwLm5ldCBDb3JlIFJDIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkFzcC5uZXQgV2ViIEFQSSAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBwdXQgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5jb25zdCB1c2VycyA9IChzdGF0ZSA9IHt9LCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuQUREX1VTRVI6XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJzID0gcHV0KHN0YXRlLCBhY3Rpb24udXNlci5JRCwgYWN0aW9uLnVzZXIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdXNlcnM7XHJcbiAgICAgICAgY2FzZSBULlJFQ0lFVkVEX1VTRVJTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnVzZXJzO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgY3VycmVudFVzZXJJZCA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0NVUlJFTlRfVVNFUl9JRDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pZCB8fCAtMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHVzZXJzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjdXJyZW50VXNlcklkLFxyXG4gICAgdXNlcnNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHVzZXJzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IGZpbHRlciwgb21pdCwgdmFsdWVzIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgcHV0LCB1bmlvbiB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IG93bmVySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9JTUFHRVNfT1dORVI6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbWFnZXMgPSAoc3RhdGUgPSB7fSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9JTUFHRTpcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gcHV0KHN0YXRlLCBhY3Rpb24ua2V5LCBhY3Rpb24udmFsKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICBjYXNlIFQuUkVDSUVWRURfVVNFUl9JTUFHRVM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaW1hZ2VzO1xyXG4gICAgICAgIGNhc2UgVC5SRU1PVkVfSU1BR0U6XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSBvbWl0KHN0YXRlLCBhY3Rpb24ua2V5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWQ7XHJcbiAgICAgICAgY2FzZSBULklOQ1JfSU1HX0NPTU1FTlRfQ09VTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXMoc3RhdGUpLm1hcChpbWcgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoaW1nLkltYWdlSUQgPT0gYWN0aW9uLmtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZy5Db21tZW50Q291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVC5ERUNSX0lNR19DT01NRU5UX0NPVU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzKHN0YXRlKS5tYXAoaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGltZy5JbWFnZUlEID09IGFjdGlvbi5rZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWcuQ29tbWVudENvdW50LS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW1nO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNlbGVjdGVkSW1hZ2VJZCA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1NFTEVDVEVEX0lNRzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pZCB8fCAtMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNlbGVjdGVkSW1hZ2VJZHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9TRUxFQ1RFRF9JTUFHRV9JRDpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLmlkXSwgKGlkMSwgaWQyKSA9PiBpZDEgPT0gaWQyKTtcclxuICAgICAgICBjYXNlIFQuUkVNT1ZFX1NFTEVDVEVEX0lNQUdFX0lEOlxyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyKHN0YXRlLCAoaWQpID0+IGlkICE9IGFjdGlvbi5pZCk7XHJcbiAgICAgICAgY2FzZSBULkNMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUzpcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgaW1hZ2VzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBvd25lcklkLFxyXG4gICAgaW1hZ2VzLFxyXG4gICAgc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgc2VsZWN0ZWRJbWFnZUlkc1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW1hZ2VzSW5mbztcclxuIiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCB7IHVuaW9uLCBwdXQgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuY29uc3QgY29tbWVudHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlJFQ0lFVkVEX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmNvbW1lbnRzIHx8IFtdO1xyXG4gICAgICAgIGNhc2UgVC5BRERfQ09NTUVOVDpcclxuICAgICAgICAgICAgcmV0dXJuIFsuLi5zdGF0ZSwgYWN0aW9uLmNvbW1lbnRdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0tJUF9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5za2lwIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB0YWtlID0gKHN0YXRlID0gMTAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVEFLRV9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfQ1VSUkVOVF9QQUdFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBhZ2UgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RPVEFMX1BBR0VTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRvdGFsUGFnZXMgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGZvY3VzZWRDb21tZW50ID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfRk9DVVNFRF9DT01NRU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmlkIHx8IC0xO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgY29tbWVudHNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGNvbW1lbnRzLFxyXG4gICAgc2tpcCxcclxuICAgIHRha2UsXHJcbiAgICBwYWdlLFxyXG4gICAgdG90YWxQYWdlcyxcclxuICAgIGZvY3VzZWRDb21tZW50XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb21tZW50c0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHRpdGxlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9FUlJPUl9USVRMRTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50aXRsZSB8fCBcIlwiO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0VSUk9SX01FU1NBR0U6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ubWVzc2FnZSB8fCBcIlwiO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZXJyb3JJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHRpdGxlLFxyXG4gICAgbWVzc2FnZVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGVycm9ySW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCBlcnJvckluZm8gZnJvbSAnLi9lcnJvcidcclxuXHJcbmV4cG9ydCBjb25zdCBoYXNFcnJvciA9IChzdGF0ZSA9IGZhbHNlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0hBU19FUlJPUjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5oYXNFcnJvcjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtZXNzYWdlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZG9uZSA9IChzdGF0ZSA9IHRydWUsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVzZWRTcGFjZWtCID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2goYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1VTRURfU1BBQ0VfS0I6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udXNlZFNwYWNlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHRvdGFsU3BhY2VrQiA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfU1BBQ0VfS0I6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udG90YWxTcGFjZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzcGFjZUluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdXNlZFNwYWNla0IsXHJcbiAgICB0b3RhbFNwYWNla0JcclxufSk7XHJcblxyXG5jb25zdCBzdGF0dXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGhhc0Vycm9yLFxyXG4gICAgZXJyb3JJbmZvLFxyXG4gICAgc3BhY2VJbmZvLFxyXG4gICAgbWVzc2FnZSxcclxuICAgIGRvbmVcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0YXR1c0luZm87XHJcbiIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuXHJcblxyXG5jb25zdCBza2lwID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TS0lQX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5za2lwIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB0YWtlID0gKHN0YXRlID0gMTAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVEFLRV9XSEFUU19ORVc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udGFrZSB8fCAxMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHBhZ2UgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1BBR0VfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBhZ2UgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50b3RhbFBhZ2VzIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpdGVtcyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0xBVEVTVDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5sYXRlc3QgfHwgW107XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB3aGF0c05ld0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgc2tpcCxcclxuICAgIHRha2UsXHJcbiAgICBwYWdlLFxyXG4gICAgdG90YWxQYWdlcyxcclxuICAgIGl0ZW1zXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCB3aGF0c05ld0luZm87XHJcbiIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcblxyXG5jb25zdCBwb3N0Q29tbWVudHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9QT1NUX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmNvbW1lbnRzIHx8IFtdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2tpcFRocmVhZHMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1NLSVBfVEhSRUFEUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5za2lwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdGFrZVRocmVhZHMgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UQUtFX1RIUkVBRFM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udGFrZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHBhZ2VUaHJlYWRzID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9QQUdFX1RIUkVBRFM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGFnZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRvdGFsUGFnZXNUaHJlYWQgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RPVEFMX1BBR0VTX1RIUkVBRFM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udG90YWxQYWdlcztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNlbGVjdGVkVGhyZWFkID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0VMRUNURURUSFJFQURfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB0aXRsZXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9USFJFQURfVElUTEU6XHJcbiAgICAgICAgICAgIHJldHVybiB1bmlvbihbYWN0aW9uLnRpdGxlXSwgc3RhdGUsICh0MSwgdDIpID0+IHQxLklEID09IHQyLklEKTtcclxuICAgICAgICBjYXNlIFQuU0VUX1RIUkVBRF9USVRMRVM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udGl0bGVzO1xyXG4gICAgICAgIGNhc2UgVC5VUERBVEVfVEhSRUFEX1RJVExFOlxyXG4gICAgICAgICAgICBjb25zdCByZW1vdmVkID0gZmlsdGVyKHN0YXRlLCAodGl0bGUpID0+IHRpdGxlLklEICE9IGFjdGlvbi5pZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBbLi4ucmVtb3ZlZCwgYWN0aW9uLnRpdGxlXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHBvc3RDb250ZW50ID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9QT1NUX0NPTlRFTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uY29udGVudDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRpdGxlc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdGl0bGVzLFxyXG4gICAgc2tpcDogc2tpcFRocmVhZHMsXHJcbiAgICB0YWtlOiB0YWtlVGhyZWFkcyxcclxuICAgIHBhZ2U6IHBhZ2VUaHJlYWRzLFxyXG4gICAgdG90YWxQYWdlczogdG90YWxQYWdlc1RocmVhZCxcclxuICAgIHNlbGVjdGVkVGhyZWFkXHJcbn0pXHJcblxyXG5jb25zdCBmb3J1bUluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdGl0bGVzSW5mbyxcclxuICAgIHBvc3RDb250ZW50XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmb3J1bUluZm87XHJcbiIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgdXNlcnNJbmZvIGZyb20gJy4vdXNlcnMnXHJcbmltcG9ydCBpbWFnZXNJbmZvIGZyb20gJy4vaW1hZ2VzJ1xyXG5pbXBvcnQgY29tbWVudHNJbmZvIGZyb20gJy4vY29tbWVudHMnXHJcbmltcG9ydCBzdGF0dXNJbmZvIGZyb20gJy4vc3RhdHVzJ1xyXG5pbXBvcnQgd2hhdHNOZXdJbmZvIGZyb20gJy4vd2hhdHNuZXcnXHJcbmltcG9ydCBmb3J1bUluZm8gZnJvbSAnLi9mb3J1bSdcclxuXHJcbmNvbnN0IHJvb3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHVzZXJzSW5mbyxcclxuICAgIGltYWdlc0luZm8sXHJcbiAgICBjb21tZW50c0luZm8sXHJcbiAgICBzdGF0dXNJbmZvLFxyXG4gICAgd2hhdHNOZXdJbmZvLFxyXG4gICAgZm9ydW1JbmZvXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCByb290UmVkdWNlciIsIu+7v2ltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0IHRodW5rIGZyb20gJ3JlZHV4LXRodW5rJ1xyXG5pbXBvcnQgcm9vdFJlZHVjZXIgZnJvbSAnLi4vcmVkdWNlcnMvcm9vdCdcclxuXHJcbmV4cG9ydCBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJvb3RSZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUodGh1bmspKSIsIu+7v2ltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vc3RvcmVzL3N0b3JlJ1xyXG5pbXBvcnQgeyBmZXRjaEN1cnJlbnRVc2VyLCBmZXRjaFVzZXJzIH0gZnJvbSAnLi4vYWN0aW9ucy91c2VycydcclxuaW1wb3J0IHsgbmV3SW1hZ2VGcm9tU2VydmVyLCBmZXRjaFVzZXJJbWFnZXMsIHNldFNlbGVjdGVkSW1nLCBzZXRJbWFnZU93bmVyIH0gZnJvbSAnLi4vYWN0aW9ucy9pbWFnZXMnXHJcbmltcG9ydCB7IG5ld0NvbW1lbnRGcm9tU2VydmVyLCBmZXRjaENvbW1lbnRzLCBzZXRTa2lwQ29tbWVudHMsIHNldFRha2VDb21tZW50cywgZmV0Y2hBbmRGb2N1c1NpbmdsZUNvbW1lbnQgfSBmcm9tICcuLi9hY3Rpb25zL2NvbW1lbnRzJ1xyXG5pbXBvcnQgeyBzZXRMYXRlc3QsIGZldGNoTGF0ZXN0TmV3cyB9IGZyb20gJy4uL2FjdGlvbnMvd2hhdHNuZXcnXHJcbmltcG9ydCB7IG5ld0ZvcnVtVGhyZWFkRnJvbVNlcnZlciwgZmV0Y2hUaHJlYWRzLCBmZXRjaFBvc3QgfSBmcm9tICcuLi9hY3Rpb25zL2ZvcnVtJ1xyXG5pbXBvcnQgeyBmZXRjaFNwYWNlSW5mbyB9IGZyb20gJy4uL2FjdGlvbnMvc3RhdHVzJ1xyXG5pbXBvcnQgeyBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybCwgZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5leHBvcnQgY29uc3QgaW5pdCA9ICgpID0+IHtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQ3VycmVudFVzZXIoZ2xvYmFscy5jdXJyZW50VXNlcm5hbWUpKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVXNlcnMoKSk7XHJcbiAgICBtb21lbnQubG9jYWxlKCdkYScpO1xyXG5cclxuICAgIGNvbm5lY3RUb0xhdGVzdFdlYlNvY2tldFNlcnZpY2UoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNvbm5lY3RUb0xhdGVzdFdlYlNvY2tldFNlcnZpY2UgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzdXBwb3J0c1dlYlNvY2tldHMgPSAnV2ViU29ja2V0JyBpbiB3aW5kb3cgfHwgJ01veldlYlNvY2tldCcgaW4gd2luZG93O1xyXG5cclxuICAgIC8vIFdlYnNlcnZlciBkb2VzIG5vdCBzdXBwb3J0IHdlYnNvY2tldHNcclxuICAgIGlmKGZhbHNlKSB7XHJcbiAgICAgICAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChnbG9iYWxzLnVybHMud2Vic29ja2V0LmxhdGVzdCk7XHJcbiAgICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcclxuICAgICAgICAgICAgc3dpdGNoKGRhdGEudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnTkVXX0lNQUdFX0NPTU1FTlQnOlxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKG5ld0NvbW1lbnRGcm9tU2VydmVyKGRhdGEuaXRlbSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnTkVXX0lNQUdFJzpcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChuZXdJbWFnZUZyb21TZXJ2ZXIoZGF0YS5pdGVtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hTcGFjZUluZm8oYCR7Z2xvYmFscy51cmxzLmRpYWdub3N0aWNzfS9nZXRzcGFjZWluZm9gKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdORVdfRk9SVU1fVEhSRUFEJzpcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChuZXdGb3J1bVRocmVhZEZyb21TZXJ2ZXIoZGF0YS5pdGVtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS53aGF0c05ld0luZm87XHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gZG8gbG9uZy1wb2xsIGV2ZXJ5IDEwIHNlY29uZHNcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS53aGF0c05ld0luZm87XHJcbiAgICAgICAgICAgIGNvbnN0IHNraXBQb3N0ID0gc3RvcmUuZ2V0U3RhdGUoKS5mb3J1bUluZm8udGl0bGVzSW5mby5za2lwO1xyXG4gICAgICAgICAgICBjb25zdCB0YWtlUG9zdCA9IHN0b3JlLmdldFN0YXRlKCkuZm9ydW1JbmZvLnRpdGxlc0luZm8udGFrZTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVXNlcnMoKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVGhyZWFkcyhza2lwUG9zdCwgdGFrZVBvc3QpKTtcclxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hTcGFjZUluZm8oYCR7Z2xvYmFscy51cmxzLmRpYWdub3N0aWNzfS9nZXRzcGFjZWluZm9gKSk7XHJcbiAgICAgICAgfSwgMTAwMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2VsZWN0SW1hZ2UgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBpbWFnZUlkID0gTnVtYmVyKG5leHRTdGF0ZS5wYXJhbXMuaWQpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaW1hZ2VJZCkpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hJbWFnZXMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IG5leHRTdGF0ZS5wYXJhbXMudXNlcm5hbWU7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRJbWFnZU93bmVyKHVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTtcclxuXHJcbiAgICAvLyByZXNldCBjb21tZW50IHN0YXRlXHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRTa2lwQ29tbWVudHModW5kZWZpbmVkKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRUYWtlQ29tbWVudHModW5kZWZpbmVkKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBsb2FkQ29tbWVudHMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIGNvbnN0IHBhZ2UgPSBOdW1iZXIobmV4dFN0YXRlLmxvY2F0aW9uLnF1ZXJ5LnBhZ2UpO1xyXG4gICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuXHJcbiAgICBjb25zdCB1cmwgPSBnZXRJbWFnZUNvbW1lbnRzUGFnZVVybChpZCwgc2tpcCwgdGFrZSk7XHJcbiAgICBpZighcGFnZSkge1xyXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQ29tbWVudHModXJsLCBza2lwLCB0YWtlKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSBwYWdlIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXBJdGVtcywgdGFrZSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hDb21tZW50ID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgaWQgPSBOdW1iZXIobmV4dFN0YXRlLmxvY2F0aW9uLnF1ZXJ5LmlkKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoQW5kRm9jdXNTaW5nbGVDb21tZW50KGlkKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaFdoYXRzTmV3ID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgZ2V0TGF0ZXN0ID0gKHNraXAsIHRha2UpID0+IHN0b3JlLmRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSk7XHJcbiAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IHN0b3JlLmdldFN0YXRlKCkud2hhdHNOZXdJbmZvO1xyXG4gICAgZ2V0TGF0ZXN0KHNraXAsIHRha2UpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZmV0Y2hGb3J1bSA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5mb3J1bUluZm8udGl0bGVzSW5mbztcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVGhyZWFkcyhza2lwLCB0YWtlKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaFNpbmdsZVBvc3QgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBuZXh0U3RhdGUucGFyYW1zO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hQb3N0KE51bWJlcihpZCkpKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGZldGNoUG9zdENvbW1lbnRzID0gKG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gbmV4dFN0YXRlLnBhcmFtcztcclxuICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcblxyXG4gICAgY29uc3QgdXJsID0gZ2V0Rm9ydW1Db21tZW50c1BhZ2VVcmwoaWQsIHNraXAsIHRha2UpO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goZmV0Y2hDb21tZW50cyh1cmwsIHNraXAsIHRha2UpKTtcclxufVxyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCBNYWluIGZyb20gJy4vY29tcG9uZW50cy9zaGVsbHMvTWFpbidcclxuaW1wb3J0IEhvbWUgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvSG9tZSdcclxuaW1wb3J0IEZvcnVtIGZyb20gJy4vY29tcG9uZW50cy9zaGVsbHMvRm9ydW0nXHJcbmltcG9ydCBGb3J1bUxpc3QgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1MaXN0J1xyXG5pbXBvcnQgRm9ydW1Qb3N0IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL0ZvcnVtUG9zdCdcclxuaW1wb3J0IEZvcnVtQ29tbWVudHMgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvRm9ydW1Db21tZW50cydcclxuaW1wb3J0IFVzZXJzIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJzJ1xyXG5pbXBvcnQgVXNlckltYWdlcyBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzJ1xyXG5pbXBvcnQgU2VsZWN0ZWRJbWFnZSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9TZWxlY3RlZEltYWdlJ1xyXG5pbXBvcnQgSW1hZ2VDb21tZW50cyBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9JbWFnZUNvbW1lbnRzJ1xyXG5pbXBvcnQgU2luZ2xlSW1hZ2VDb21tZW50IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1NpbmdsZUltYWdlQ29tbWVudCdcclxuaW1wb3J0IEFib3V0IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL0Fib3V0J1xyXG5pbXBvcnQgeyBpbml0LCBmZXRjaEZvcnVtLCBzZWxlY3RJbWFnZSwgZmV0Y2hJbWFnZXMsIGxvYWRDb21tZW50cywgZmV0Y2hDb21tZW50LCBmZXRjaFdoYXRzTmV3LCBmZXRjaFNpbmdsZVBvc3QsIGZldGNoUG9zdENvbW1lbnRzIH0gZnJvbSAnLi91dGlsaXRpZXMvb25zdGFydHVwJ1xyXG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlLCBJbmRleFJvdXRlLCBicm93c2VySGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgY29ubmVjdCwgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3Jlcy9zdG9yZSdcclxuXHJcbmluaXQoKTtcclxuXHJcblJlYWN0RE9NLnJlbmRlcihcclxuICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICAgIDxSb3V0ZXIgaGlzdG9yeT17YnJvd3Nlckhpc3Rvcnl9PlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9cIiBjb21wb25lbnQ9e01haW59PlxyXG4gICAgICAgICAgICAgICAgPEluZGV4Um91dGUgY29tcG9uZW50PXtIb21lfSBvbkVudGVyPXtmZXRjaFdoYXRzTmV3fSAvPlxyXG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCJmb3J1bVwiIGNvbXBvbmVudD17Rm9ydW19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbmRleFJvdXRlIGNvbXBvbmVudD17Rm9ydW1MaXN0fSBvbkVudGVyPXtmZXRjaEZvcnVtfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwicG9zdC86aWRcIiBjb21wb25lbnQ9e0ZvcnVtUG9zdH0gb25FbnRlcj17ZmV0Y2hTaW5nbGVQb3N0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCJjb21tZW50c1wiIGNvbXBvbmVudD17Rm9ydW1Db21tZW50c30gb25FbnRlcj17ZmV0Y2hQb3N0Q29tbWVudHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cInVzZXJzXCIgY29tcG9uZW50PXtVc2Vyc30gLz5cclxuICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiOnVzZXJuYW1lL2dhbGxlcnlcIiBjb21wb25lbnQ9e1VzZXJJbWFnZXN9IG9uRW50ZXI9e2ZldGNoSW1hZ2VzfT5cclxuICAgICAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cImltYWdlLzppZFwiIGNvbXBvbmVudD17U2VsZWN0ZWRJbWFnZX0gb25FbnRlcj17c2VsZWN0SW1hZ2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cImNvbW1lbnRzXCIgY29tcG9uZW50PXtJbWFnZUNvbW1lbnRzfSBvbkVudGVyPXtsb2FkQ29tbWVudHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiY29tbWVudFwiIGNvbXBvbmVudD17U2luZ2xlSW1hZ2VDb21tZW50fSBvbkVudGVyPXtmZXRjaENvbW1lbnR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cImFib3V0XCIgY29tcG9uZW50PXtBYm91dH0gLz5cclxuICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICA8L1JvdXRlcj5cclxuICAgIDwvUHJvdmlkZXI+LFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSk7XHJcbiJdLCJuYW1lcyI6WyJzdXBlciIsImxldCIsIkxpbmsiLCJJbmRleExpbmsiLCJSb3ciLCJDb2wiLCJBbGVydCIsImNvbnN0IiwiVC5TRVRfRVJST1JfVElUTEUiLCJULkNMRUFSX0VSUk9SX1RJVExFIiwiVC5TRVRfRVJST1JfTUVTU0FHRSIsIlQuQ0xFQVJfRVJST1JfTUVTU0FHRSIsIlQuU0VUX0hBU19FUlJPUiIsInZhbHVlcyIsIkdyaWQiLCJOYXZiYXIiLCJOYXYiLCJOYXZEcm9wZG93biIsIk1lbnVJdGVtIiwiY29ubmVjdCIsIlQuU0VUX0NVUlJFTlRfVVNFUl9JRCIsIlQuQUREX1VTRVIiLCJULlJFQ0lFVkVEX1VTRVJTIiwiVC5TRVRfTEFURVNUIiwiVC5TRVRfU0tJUF9XSEFUU19ORVciLCJULlNFVF9UQUtFX1dIQVRTX05FVyIsIlQuU0VUX1BBR0VfV0hBVFNfTkVXIiwiVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXIiwiTWVkaWEiLCJJbWFnZSIsIlRvb2x0aXAiLCJPdmVybGF5VHJpZ2dlciIsIkdseXBoaWNvbiIsIk1vZGFsIiwiRm9ybUdyb3VwIiwiQ29udHJvbExhYmVsIiwiRm9ybUNvbnRyb2wiLCJCdXR0b25Hcm91cCIsIkJ1dHRvbiIsIkJ1dHRvblRvb2xiYXIiLCJDb2xsYXBzZSIsIlQuVVBEQVRFX1RIUkVBRF9USVRMRSIsIlQuU0VUX1RIUkVBRF9USVRMRVMiLCJzZXRUb3RhbFBhZ2VzIiwiVC5TRVRfVE9UQUxfUEFHRVNfVEhSRUFEUyIsInNldFBhZ2UiLCJULlNFVF9QQUdFX1RIUkVBRFMiLCJULlNFVF9TS0lQX1RIUkVBRFMiLCJzZXRUYWtlIiwiVC5TRVRfVEFLRV9USFJFQURTIiwiVC5TRVRfU0VMRUNURURUSFJFQURfSUQiLCJULlNFVF9QT1NUX0NPTlRFTlQiLCJULlNFVF9TS0lQX0NPTU1FTlRTIiwiVC5TRVRfVEFLRV9DT01NRU5UUyIsIlQuU0VUX0NVUlJFTlRfUEFHRSIsIlQuU0VUX1RPVEFMX1BBR0VTIiwiVC5SRUNJRVZFRF9DT01NRU5UUyIsIlQuU0VUX0ZPQ1VTRURfQ09NTUVOVCIsInRoaXMiLCJtYXBTdGF0ZVRvUHJvcHMiLCJmaW5kIiwiY29udGFpbnMiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJ3aXRoUm91dGVyIiwiUGFnaW5hdGlvbiIsIlBhZ2luYXRpb25CcyIsIlQuU0VUX0lNQUdFU19PV05FUiIsIlQuUkVDSUVWRURfVVNFUl9JTUFHRVMiLCJULlNFVF9TRUxFQ1RFRF9JTUciLCJULkFERF9JTUFHRSIsIlQuUkVNT1ZFX0lNQUdFIiwiVC5BRERfU0VMRUNURURfSU1BR0VfSUQiLCJULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCIsIlQuQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTIiwiVC5JTkNSX0lNR19DT01NRU5UX0NPVU5UIiwiVC5ERUNSX0lNR19DT01NRU5UX0NPVU5UIiwiVC5TRVRfVVNFRF9TUEFDRV9LQiIsIlQuU0VUX1RPVEFMX1NQQUNFX0tCIiwiUHJvZ3Jlc3NCYXIiLCJKdW1ib3Ryb24iLCJQYW5lbCIsIlBhZ2VIZWFkZXIiLCJJbWFnZUJzIiwicm93Iiwic29ydEJ5IiwiV2VsbCIsImNvbWJpbmVSZWR1Y2VycyIsIm9taXQiLCJmaWx0ZXIiLCJULkFERF9DT01NRU5UIiwibWVzc2FnZSIsInNraXAiLCJ0YWtlIiwicGFnZSIsInRvdGFsUGFnZXMiLCJULkFERF9USFJFQURfVElUTEUiLCJjcmVhdGVTdG9yZSIsImFwcGx5TWlkZGxld2FyZSIsIlByb3ZpZGVyIiwiUm91dGVyIiwiYnJvd3Nlckhpc3RvcnkiLCJSb3V0ZSIsIkluZGV4Um91dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHTyxJQUFNLE9BQU8sR0FBd0I7SUFB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