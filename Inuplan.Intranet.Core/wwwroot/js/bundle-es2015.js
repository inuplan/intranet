'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var ReactDOM = _interopDefault(require('react-dom'));
var reactRedux = require('react-redux');
var redux = require('redux');
var thunk = _interopDefault(require('redux-thunk'));
var underscore = require('underscore');
var marked = _interopDefault(require('marked'));
var reactRouter = require('react-router');
var fetch = _interopDefault(require('isomorphic-fetch'));

// Image actions
var SET_SELECTED_IMG = 'SET_SELECTED_IMG';
var UNSET_SELECTED_IMG = 'UNSET_SELECTED_IMG';
var REMOVE_IMAGE = 'REMOVE_IMAGE';
var SET_IMAGES_OWNER = 'SET_IMAGES_OWNER';
var RECIEVED_USER_IMAGES = 'RECIEVED_USER_IMAGES';
var ADD_SELECTED_IMAGE_ID = 'ADD_SELECTED_IMAGE_ID';
var REMOVE_SELECTED_IMAGE_ID = 'REMOVE_SELECTED_IMAGE_ID';
var CLEAR_SELECTED_IMAGE_IDS = 'CLEAR_SELECTED_IMAGE_IDS';

// User actions
var SET_CURRENT_USER_ID = 'SET_CURRENT_USER_ID';
var ADD_USER = 'ADD_USER';
var RECIEVED_USERS = 'RECIEVED_USERS';

// Comment actions
var RECIEVED_COMMENTS = 'RECIEVED_COMMENTS';
var SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
var SET_TOTAL_PAGES = 'SET_TOTAL_PAGES';
var SET_SKIP_COMMENTS = 'SET_SKIP_COMMENTS';
var SET_TAKE_COMMENTS = 'SET_TAKE_COMMENTS';
var INCR_COMMENT_COUNT = 'INCR_COMMENT_COUNT';
var DECR_COMMENT_COUNT = 'DECR_COMMENT_COUNT';
var SET_DEFAULT_SKIP = 'SET_DEFAULT_SKIP';
var SET_DEFAULT_TAKE = 'SET_DEFAULT_TAKE';
var SET_DEFAULT_COMMENTS = 'SET_DEFAULT_COMMENTS';

// WhatsNew
var ADD_LATEST = 'ADD_LATEST';
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
        Replies: replies
    }
}

var normalizeLatest = function (latest) {
    var item = null;
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
    }
    else if (latest.Type == 2) {
        // Comment - omit Author and Deleted and Replies
        var comment = latest.Item;
        item = {
            ID: comment.ID,
            PostedOn: comment.PostedOn,
            Text: comment.Text
        };
    }

    return {
        ID: latest.ID,
        Type: latest.Type,
        Item: item,
        On: latest.On,
        AuthorID: latest.Item.Author.ID
    }
}

var visitComments = function (comments, func) {
    var getReplies = function (c) { return c.Replies ? c.Replies : []; };
    for (var i = 0; i < comments.length; i++) {
        depthFirstSearch(comments[i], getReplies, func);
    }
}

var depthFirstSearch = function (current, getChildren, func) {
    func(current);
    var children = getChildren(current);
    for (var i = 0; i < children.length; i++) {
        depthFirstSearch(children[i], getChildren, func);
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

var userEquality = function (user1, user2) {
    if(!user2 || !user1) return false;
    return user1.ID == user2.ID;
}


var formatText = function (text) {
    if (!text) return;
    var rawMarkup = marked(text, { sanitize: true });
    return { __html: rawMarkup };
}

var getWords = function (text, numberOfWords) {
    return text.split(/\s+/).slice(0, numberOfWords).join(" ");
}

var responseHandler = function (dispatch, response) {
    if (response.ok) return response.json();
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

var users = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case ADD_USER:
            return union(state, [action.user], userEquality);
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
            return action.id
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
            return action.id;
        default:
            return state;
    }
}

var images = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case RECIEVED_USER_IMAGES:
            return action.images;
        case REMOVE_IMAGE:
            return state.filter(function (img) { return img.ImageID != action.id; });
        case INCR_COMMENT_COUNT:
            return state.map(function (img) {
                if(img.ImageID == action.imageId) {
                    img.CommentCount++;
                }
                return img;
            });
        case DECR_COMMENT_COUNT:
            return state.map(function (img) {
                if(img.ImageID == action.imageId) {
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
            return action.id;
        case UNSET_SELECTED_IMG:
            return -1;
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
            return action.comments;
        case SET_DEFAULT_COMMENTS:
            return [];
        default:
            return state;
    }
}

var skip = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_SKIP_COMMENTS:
            return action.skip;
        case SET_DEFAULT_SKIP:
            return 0;
        default:
            return state;
    }
}

var take = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case SET_TAKE_COMMENTS:
            return action.take;
        case SET_DEFAULT_TAKE:
            return 10;
        default:
            return state;
    }
}

var page = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_CURRENT_PAGE:
            return action.page;
        default:
            return state;
    }
}

var totalPages = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_TOTAL_PAGES:
            return action.totalPages;
        default:
            return state;
    }
}

var commentsInfo = redux.combineReducers({
    comments: comments,
    skip: skip,
    take: take,
    page: page,
    totalPages: totalPages
})

var title = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        case SET_ERROR_TITLE:
            return action.title;
        case CLEAR_ERROR_TITLE:
            return "";
        default:
            return state;
    }
}

var message$1 = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        case SET_ERROR_MESSAGE:
            return action.message;
        case CLEAR_ERROR_MESSAGE:
            return "";
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

var statusInfo = redux.combineReducers({
    hasError: hasError,
    errorInfo: errorInfo,
    message: message,
    done: done
})

var skip$1 = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_SKIP_WHATS_NEW:
            return action.skip;
        default:
            return state;
    }
}

var take$1 = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case SET_TAKE_WHATS_NEW:
            return action.take;
        default:
            return state;
    }
}

var page$1 = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_PAGE_WHATS_NEW:
            return action.page;
        default:
            return state;
    }
}

var totalPages$1 = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_TOTAL_PAGES_WHATS_NEW:
            return action.totalPages;
        default:
            return state;
    }
}

var items = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case ADD_LATEST:
            return action.latest;
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

var rootReducer = redux.combineReducers({
    usersInfo: usersInfo,
    imagesInfo: imagesInfo,
    commentsInfo: commentsInfo,
    statusInfo: statusInfo,
    whatsNewInfo: whatsNewInfo
})

var store = redux.createStore(rootReducer, redux.applyMiddleware(thunk))

var options = {
    mode: 'cors',
    credentials: 'include'
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
            .then(function (users) { return dispatch(recievedUsers(users)); }, onReject);
    }
}

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
                React.createElement( reactRouter.Link, this.props, 
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
                React.createElement( reactRouter.IndexLink, this.props, 
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
        return (
            React.createElement( 'div', { className: "row" }, 
                React.createElement( 'div', { className: "col-lg-offset-2 col-lg-8" }, 
                    React.createElement( 'div', { className: "alert alert-danger", role: "alert" }, 
                         React.createElement( 'button', { onClick: clearError, type: "button", className: "close", 'data-dismiss': "alert", 'aria-label': "Close" }, React.createElement( 'span', { 'aria-hidden': "true" }, "×")), 
                         React.createElement( 'strong', null, title ), 
                         React.createElement( 'p', null, 
                            message
                         )
                    )
                )
            )
        );
    };

    return Error;
}(React.Component));

var mapStateToProps = function (state) {
    return {
        hasError: state.statusInfo.hasError,
        error: state.statusInfo.errorInfo
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
        return (
            React.createElement( 'div', { className: "container-fluid" }, 
                React.createElement( 'div', { className: "navbar navbar-default navbar-static-top" }, 
                    React.createElement( 'div', { className: "container" }, 
                        React.createElement( 'div', { className: "navbar-header" }, 
                            React.createElement( 'button', { type: "button", className: "navbar-toggle", 'data-toggle': "collapse", 'data-target': ".navbar-collapse" }, 
                                React.createElement( 'span', { className: "sr-only" }, "Toggle navigation"), 
                                React.createElement( 'span', { className: "icon-bar" }), 
                                React.createElement( 'span', { className: "icon-bar" }), 
                                React.createElement( 'span', { className: "icon-bar" })
                            ), 
                            React.createElement( reactRouter.Link, { to: "/", className: "navbar-brand" }, "Inuplan Intranet")
                        ), 
                        React.createElement( 'div', { className: "navbar-collapse collapse" }, 
                            React.createElement( 'ul', { className: "nav navbar-nav" }, 
                                React.createElement( IndexNavLink, { to: "/" }, "Forside"), 
                                React.createElement( NavLink, { to: "/users" }, "Brugere"), 
                                React.createElement( NavLink, { to: "/about" }, "Om")
                            ), 
                            React.createElement( 'p', { className: "nav navbar-text navbar-right" }, "Hej, ", globals.currentUsername, "!")
                        )
                    )
                ), 
                this.errorView(), 
                this.props.children
            )
        );
    };

    return Shell;
}(React.Component));

var Main = reactRedux.connect(mapStateToProps, mapDispatchToProps)(Shell);

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
        return (
            React.createElement( 'div', { className: "row" }, 
                React.createElement( 'div', { className: "col-lg-offset-2 col-lg-8" }, 
                    React.createElement( 'p', null, "Dette er en single page application! ", React.createElement( 'br', null ), "Teknologier brugt:" ), 
                    React.createElement( 'ul', null, 
                        React.createElement( 'li', null, "React" ), 
                        React.createElement( 'li', null, "Redux" ), 
                        React.createElement( 'li', null, "ReactRouter" ), 
                        React.createElement( 'li', null, "Asp.net Core RC 2" ), 
                        React.createElement( 'li', null, "Asp.net Web API 2" )
                    )
                )
            )
        );
    };

    return About;
}(React.Component));

function addLatest(latest) {
    return {
        type: ADD_LATEST,
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
                        dispatch(addUser(author));
                });

                // Reset info
                dispatch(setSKip(skip));
                dispatch(setTake(take));
                dispatch(setPage(page.CurrentPage));
                dispatch(setTotalPages(page.TotalPages));

                var normalized = items.filter(function (item) { return Boolean(item.Item.Author); }).map(normalizeLatest);
                dispatch(addLatest(normalized));
            }, onReject);
    }
}

var WhatsNewItemImage = (function (superclass) {
    function WhatsNewItemImage () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) WhatsNewItemImage.__proto__ = superclass;
    WhatsNewItemImage.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewItemImage.prototype.constructor = WhatsNewItemImage;

    WhatsNewItemImage.prototype.render = function render () {
        return  React.createElement( 'div', null, 
                    React.createElement( 'div', { className: "media-left" }
                    ), 
                    React.createElement( 'div', { className: "media-body" }
                    )
                )
    };

    return WhatsNewItemImage;
}(React.Component));

var CommentProfile = (function (superclass) {
    function CommentProfile () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) CommentProfile.__proto__ = superclass;
    CommentProfile.prototype = Object.create( superclass && superclass.prototype );
    CommentProfile.prototype.constructor = CommentProfile;

    CommentProfile.prototype.render = function render () {
        return (
            React.createElement( 'div', { className: "media-left" }, 
                React.createElement( 'img', { className: "media-object", src: "/images/person_icon.svg", 'data-holder-rendered': "true", style: { width: "64px", height: "64px" } }), 
                this.props.children
            ));
    };

    return CommentProfile;
}(React.Component));

var WhatsNewItemComment = (function (superclass) {
    function WhatsNewItemComment () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) WhatsNewItemComment.__proto__ = superclass;
    WhatsNewItemComment.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewItemComment.prototype.constructor = WhatsNewItemComment;

    WhatsNewItemComment.prototype.render = function render () {
        var ref = this.props;
        var author = ref.author;
        var item = ref.item;
        var text = formatText("\"" + getWords(item.Text, 5) + "..." + "\"");
        var fullname = author.FirstName + ' ' + author.LastName;
        return  React.createElement( 'div', null, 
                    React.createElement( CommentProfile, null ), 
                    React.createElement( 'div', { className: "media-body" }, 
                        React.createElement( 'h5', { className: "media-heading" }, fullname, " ", React.createElement( 'small', null, "sagde" )), 
                        React.createElement( 'p', null, 
                            React.createElement( 'em', null, React.createElement( 'span', { dangerouslySetInnerHTML: text }) )
                        )
                    ), 
                    React.createElement( 'br', null )
                )
    };

    return WhatsNewItemComment;
}(React.Component));

var WhatsNewList = (function (superclass) {
    function WhatsNewList () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) WhatsNewList.__proto__ = superclass;
    WhatsNewList.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewList.prototype.constructor = WhatsNewList;

    WhatsNewList.prototype.constructItems = function constructItems () {
        var ref = this.props;
        var items = ref.items;
        var getUser = ref.getUser;
        return items.map(function (item) {
            var author = getUser(item.AuthorID);
            switch (item.Type) {
                case 1:
                    return  React.createElement( WhatsNewItemImage, {
                                id: item.ID, item: item.Item, on: item.On, author: author })
                case 2:
                    return  React.createElement( WhatsNewItemComment, {
                                id: item.ID, item: item.Item, on: item.On, author: author })
            }
        })
    };

    WhatsNewList.prototype.render = function render () {
        var itemNodes = this.constructItems();
        return  React.createElement( 'div', { className: "media pull-left text-left" }, 
                    itemNodes
                )
    };

    return WhatsNewList;
}(React.Component));

var mapDispatchToProps$1 = function (dispatch) {
    return {
        getLatest: function (skip, take) { return dispatch(fetchLatestNews(skip, take)); }
    }
}

var mapStateToProps$2 = function (state) {
    return {
        items: state.whatsNewInfo.items,
        getUser: function (id) { return state.usersInfo.users.filter(function (u) { return u.ID == id; })[0]; },
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take
    }
}

var WhatsNewContainer = (function (superclass) {
    function WhatsNewContainer () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) WhatsNewContainer.__proto__ = superclass;
    WhatsNewContainer.prototype = Object.create( superclass && superclass.prototype );
    WhatsNewContainer.prototype.constructor = WhatsNewContainer;

    WhatsNewContainer.prototype.componentDidMount = function componentDidMount () {
        var ref = this.props;
        var getLatest = ref.getLatest;
        var skip = ref.skip;
        var take = ref.take;
        getLatest(skip, take);
    };

    WhatsNewContainer.prototype.render = function render () {
        var ref = this.props;
        var items = ref.items;
        var getUser = ref.getUser;
        return  React.createElement( 'div', null, 
                    React.createElement( 'h3', null, "Sidste nyt" ), 
                    React.createElement( WhatsNewList, {
                        items: items, getUser: getUser })
                )
    };

    return WhatsNewContainer;
}(React.Component));

var WhatsNew = reactRedux.connect(mapStateToProps$2, mapDispatchToProps$1)(WhatsNewContainer)

var mapStateToProps$1 = function (state) {
    return {
        user: state.usersInfo.users.filter(function (u) { return u.Username.toUpperCase() == globals.currentUsername.toUpperCase(); })[0],
    }
}

var HomeView = (function (superclass) {
    function HomeView () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) HomeView.__proto__ = superclass;
    HomeView.prototype = Object.create( superclass && superclass.prototype );
    HomeView.prototype.constructor = HomeView;

    HomeView.prototype.componentDidMount = function componentDidMount () {
        document.title = "Forside";
    };

    HomeView.prototype.render = function render () {
        var ref = this.props;
        var user = ref.user;
        var latestItems = ref.latestItems;
        var name = user ? user.FirstName : 'User';
        return (
            React.createElement( 'div', { className: "row" }, 
                React.createElement( 'div', { className: "col-lg-offset-2 col-lg-8" }, 
                    React.createElement( 'div', { className: "jumbotron" }, 
                        React.createElement( 'h1', null, "Velkommen ", React.createElement( 'small', null, name, "!" ) ), 
                        React.createElement( 'p', { className: "lead" }, "Til Inuplans intranet side")
                    ), 
                    React.createElement( WhatsNew, null )
                )
            )
        );
    };

    return HomeView;
}(React.Component));

var Home = reactRedux.connect(mapStateToProps$1, null)(HomeView)

var User = (function (superclass) {
    function User () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) User.__proto__ = superclass;
    User.prototype = Object.create( superclass && superclass.prototype );
    User.prototype.constructor = User;

    User.prototype.render = function render () {
        var email = "mailto:" + this.props.email;
        var gallery = "/" + this.props.username + "/gallery";
        return (
            React.createElement( 'div', { className: "col-lg-3 panel panel-default", style: { paddingTop: "8px", paddingBottom: "8px" } }, 
                React.createElement( 'div', { className: "row" }, 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        React.createElement( 'strong', null, "Brugernavn" )
                    ), 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        this.props.username
                    )
                ), 
                React.createElement( 'div', { className: "row" }, 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        React.createElement( 'strong', null, "Fornavn" )
                    ), 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        this.props.firstName
                    )
                ), 
                React.createElement( 'div', { className: "row" }, 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        React.createElement( 'strong', null, "Efternavn" )
                    ), 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        this.props.lastName
                    )
                ), 
                React.createElement( 'div', { className: "row" }, 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        React.createElement( 'strong', null, "Email" )
                    ), 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        React.createElement( 'a', { href: email }, this.props.email)
                    )
                ), 
                React.createElement( 'div', { className: "row" }, 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        React.createElement( 'strong', null, "Billeder" )
                    ), 
                    React.createElement( 'div', { className: "col-lg-6" }, 
                        React.createElement( reactRouter.Link, { to: gallery }, "Billeder")
                    )
                )
            )
        );
    };

    return User;
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
            return (React.createElement( User, {
                          username: user.Username, userId: user.ID, firstName: user.FirstName, lastName: user.LastName, email: user.Email, profileUrl: user.ProfileImage, roles: user.Roles, key: userId }));
        });
    };

    UserList.prototype.render = function render () {
        var users = this.userNodes();
        return (
            React.createElement( 'div', { className: "row" }, 
                users
            ))
    };

    return UserList;
}(React.Component));

var mapUsersToProps = function (state) {
    return {
        users: state.usersInfo.users
    };
}

var mapDispatchToProps$2 = function (dispatch) {
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
        this.props.getUsers();
    };

    UsersContainer.prototype.render = function render () {
        var ref = this.props;
        var users = ref.users;
        return (
            React.createElement( 'div', { className: "row" }, 
                React.createElement( 'div', { className: "col-lg-offset-2 col-lg-8" }, 
                    React.createElement( 'div', { className: "page-header" }, 
                        React.createElement( 'h1', null, "Inuplan's ", React.createElement( 'small', null, "brugere" ) )
                    ), 
                    React.createElement( 'div', { className: "row" }, 
                        React.createElement( UserList, { users: users })
                    )
                )
            ));
    };

    return UsersContainer;
}(React.Component));

var Users = reactRedux.connect(mapUsersToProps, mapDispatchToProps$2)(UsersContainer)

var setSkipComments = function (skip) {
    return {
        type: SET_SKIP_COMMENTS,
        skip: skip
    };
}

var setDefaultSkip = function () {
    return {
        type: SET_DEFAULT_SKIP
    }
}

var setDefaultTake = function () {
    return {
        type: SET_DEFAULT_TAKE
    }
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

function setTotalPages$1(totalPages) {
    return {
        type: SET_TOTAL_PAGES,
        totalPages: totalPages
    };
}

var setDefaultComments = function () {
    return {
        type: SET_DEFAULT_COMMENTS
    }
}

function receivedComments(comments) {
    return {
        type: RECIEVED_COMMENTS,
        comments: comments
    };
}

function fetchComments(imageId, skip, take) {
    return function(dispatch) {
        var url = globals.urls.comments + "?imageId=" + imageId + "&skip=" + skip + "&take=" + take;
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
                dispatch(setTotalPages$1(data.TotalPages));

                // Visit every comment and add the user
                var addAuthor = function (c) {
                    if(!c.Deleted)
                        dispatch(addUser(c.Author));
                }
                visitComments(pageComments, addAuthor);

                // Normalize: filter out user
                var comments = pageComments.map(normalizeComment);
                dispatch(receivedComments(comments));
            }, onReject);
    }
}

var postComment = function (imageId, text, parentCommentId) {
    return function (dispatch, getState) {
        var ref = getState().commentsInfo;
        var skip = ref.skip;
        var take = ref.take;
        var url = globals.urls.comments;

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var body =JSON.stringify({ 
            Text: text,
            ImageID: imageId,
            ParentID: parentCommentId
        });

        var opt = Object.assign({}, options, {
            method: 'POST',
            body: body,
            headers: headers
        });

        return fetch(url, opt)
            .then(function () {
                dispatch(incrementCommentCount(imageId));
                dispatch(fetchComments(imageId, skip, take));
            }, onReject);
    }
}

var editComment = function (commentId, imageId, text) {
    return function(dispatch, getState) {
        var ref = getState().commentsInfo;
        var skip = ref.skip;
        var take = ref.take;
        var url = globals.urls.comments + "?imageId=" + imageId;

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var opt = Object.assign({}, options, {
            method: 'PUT',
            body: JSON.stringify({ ID: commentId, Text: text}),
            headers: headers
        });

        return fetch(url, opt)
            .then(function () {
                dispatch(fetchComments(imageId, skip, take));
            }, onReject);
    }
}

var deleteComment = function (commentId, imageId) {
    return function(dispatch, getState) {
        var ref = getState().commentsInfo;
        var skip = ref.skip;
        var take = ref.take;
        var url = globals.urls.comments + "?commentId=" + commentId;
        var opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        return fetch(url, opt)
            .then(function () {
                dispatch(fetchComments(imageId, skip, take));
                dispatch(decrementCommentCount(imageId));
            }, onReject);
    }
}

var incrementCommentCount = function (imageId) {
    return {
        type: INCR_COMMENT_COUNT,
        imageId: imageId
    }
}

var decrementCommentCount = function (imageId) {
    return {
        type: DECR_COMMENT_COUNT,
        imageId: imageId
    }
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

var removeModal = function () {
    return function (dispatch, getState) {
        var state = getState();
        dispatch(unsetSelectedImg());
        dispatch(setDefaultSkip());
        dispatch(setDefaultTake());
        dispatch(setDefaultComments());
        return Promise.resolve();
    }
}

var unsetSelectedImg = function () {
    return {
        type: UNSET_SELECTED_IMG
    };
}

function removeImage(id) {
    return {
        type: REMOVE_IMAGE,
        id: id
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

function requestDeleteImage(id, username) {
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

function uploadImage(username, formData) {
    return function(dispatch) {
        var url = globals.urls.images + "?username=" + username;
        var opt = Object.assign({}, options, {
            method: 'POST',
            body: formData
        });

        var handler = responseHandler.bind(this, dispatch);

        return fetch(url, opt)
            .then(handler)
            .then(function () { return dispatch(fetchUserImages(username)); }, onReject);
    }
}

function fetchUserImages(username) {
    return function(dispatch, getState) {
        var url = globals.urls.images + "?username=" + username;

        var handler = responseHandler.bind(this, dispatch);

        var onSuccess = function (data) {
            var normalized = data.map(normalizeImage);
            dispatch(recievedUserImages(normalized.reverse()));
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
        if (files.length == 0) return;
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append('file', file);
        }

        uploadImage(username, formData);
        var fileInput = document.getElementById("files");
        this.clearInput(fileInput);
    };

    ImageUpload.prototype.deleteBtn = function deleteBtn () {
        var ref = this.props;
        var hasImages = ref.hasImages;
        var deleteSelectedImages = ref.deleteSelectedImages;
        return (hasImages ?
                React.createElement( 'button', { type: "button", className: "btn btn-danger", onClick: deleteSelectedImages }, "Slet markeret billeder")
                : React.createElement( 'button', { type: "button", className: "btn btn-danger", onClick: deleteSelectedImages, disabled: "disabled" }, "Slet markeret billeder"));
    };

    ImageUpload.prototype.render = function render () {
        return (
            React.createElement( 'div', { className: "row" }, 
                React.createElement( 'br', null ), 
                React.createElement( 'div', { className: "col-lg-4" }, 
                    React.createElement( 'form', {
                          onSubmit: this.handleSubmit, id: "form-upload", enctype: "multipart/form-data" }, 
                            React.createElement( 'div', { className: "form-group" }, 
                                React.createElement( 'label', { htmlFor: "files" }, "Upload filer:"), 
                                React.createElement( 'input', { type: "file", className: "form-control", id: "files", name: "files", multiple: true })
                            ), 
                            React.createElement( 'button', { type: "submit", className: "btn btn-primary", id: "upload" }, "Upload"), 
                            '\u00A0', 
                            this.deleteBtn()
                    )
                )
            )
        );
    };

    return ImageUpload;
}(React.Component));

var Image = (function (superclass) {
    function Image(props) {
        superclass.call(this, props);

        // Bind 'this' to functions
        this.selectImage = this.selectImage.bind(this);
        this.checkboxHandler = this.checkboxHandler.bind(this);
    }

    if ( superclass ) Image.__proto__ = superclass;
    Image.prototype = Object.create( superclass && superclass.prototype );
    Image.prototype.constructor = Image;

    Image.prototype.selectImage = function selectImage () {
        var ref = this.props;
        var selectImage = ref.selectImage;
        var image = ref.image;
        selectImage(image.ImageID);
    };

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
        return ( count == 0 ?
            React.createElement( 'div', { className: "col-lg-6 text-muted", onClick: this.selectImage, style: { cursor: 'pointer' } },  
                React.createElement( 'span', { className: "glyphicon glyphicon-comment", 'aria-hidden': "true" }), " ", count
            )
            :
            React.createElement( 'div', { className: "col-lg-6 text-primary", onClick: this.selectImage, style: { cursor: 'pointer' } }, 
                React.createElement( 'span', { className: "glyphicon glyphicon-comment", 'aria-hidden': "true" }), " ", count
            )
        );
    };

    Image.prototype.checkboxView = function checkboxView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var imageIsSelected = ref.imageIsSelected;
        var image = ref.image;
        var checked = imageIsSelected(image.ImageID);
        return (canEdit ? 
            React.createElement( 'div', { className: "col-lg-6 pull-right text-right" }, 
                React.createElement( 'label', null, "Slet ", React.createElement( 'input', { type: "checkbox", onClick: this.checkboxHandler, checked: checked }) 
                )
            )
            : null);
    };

    Image.prototype.render = function render () {
        var ref = this.props;
        var image = ref.image;
        var count = image.CommentCount;
        return (
            React.createElement( 'div', null, 
                React.createElement( 'a', { onClick: this.selectImage, style: {cursor: "pointer", textDecoration: "none"} }, 
                    React.createElement( 'img', { src: image.PreviewUrl, className: "img-thumbnail" })
                ), 
                React.createElement( 'div', { className: "row" }, 
                    this.commentIcon(count),  
                    this.checkboxView()
                )
            )
        );
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
        if(images.length == 0) return null;
        var ref = this.props;
        var selectImage = ref.selectImage;
        var addSelectedImageId = ref.addSelectedImageId;
        var removeSelectedImageId = ref.removeSelectedImageId;
        var deleteSelectedImages = ref.deleteSelectedImages;
        var canEdit = ref.canEdit;
        var imageIsSelected = ref.imageIsSelected;
        var result = this.arrangeArray(images);
        var view = result.map(function (row, i) {
            var imgs = row.map(function (img) {
                return (
                    React.createElement( 'div', { className: "col-lg-3", key: img.ImageID }, 
                        React.createElement( Image, {
                            image: img, selectImage: selectImage, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: imageIsSelected })
                    )
                );
            });

            var rowId = "rowId" + i;
            return (
                React.createElement( 'div', { className: "row", key: rowId }, 
                    imgs
                )
            );
        });

        return view;
    };


    ImageList.prototype.render = function render () {
        var ref = this.props;
        var images = ref.images;
        return (
        React.createElement( 'div', { className: "row" }, 
            this.imagesView(images)
        ));
    };

    return ImageList;
}(React.Component));

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
        var handlers = ref.handlers;
        var constructComments = ref.constructComments;
        var replyNodes = constructComments(replies, handlers);
        return (
            React.createElement( 'div', { className: "media pull-left text-left" }, 
                React.createElement( 'div', { className: "media-left", style: {minWidth: "74px"} }), 
                React.createElement( 'div', { className: "media-body" }, 
                    React.createElement( 'small', null, "slettet" ), 
                    replyNodes
                )
            )
        );
    };

    return CommentDeleted;
}(React.Component));

var ids = function (commentId) {
    return {
        replyId: commentId + '_reply',
        editId: commentId + '_edit',
        deleteId: commentId + '_delete',
        editCollapse: commentId + '_editCollapse',
        replyCollapse: commentId + '_replyCollapse'
    };
}

var CommentControls = (function (superclass) {
    function CommentControls(props) {
        superclass.call(this, props);
        this.state = {
            text: props.text,
            reply: ''
        };

        this.edit = this.edit.bind(this);
        this.reply = this.reply.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleReplyChange = this.handleReplyChange.bind(this);
    }

    if ( superclass ) CommentControls.__proto__ = superclass;
    CommentControls.prototype = Object.create( superclass && superclass.prototype );
    CommentControls.prototype.constructor = CommentControls;

    CommentControls.prototype.edit = function edit () {
        var ref = this.props;
        var editHandle = ref.editHandle;
        var commentId = ref.commentId;
        var ref$1 = this.state;
        var text = ref$1.text;
        var ref$2 = ids(commentId);
        var editCollapse = ref$2.editCollapse;

        editHandle(commentId, text);
        $("#" + editCollapse).collapse('hide');
    };

    CommentControls.prototype.reply = function reply () {
        var ref = this.props;
        var replyHandle = ref.replyHandle;
        var commentId = ref.commentId;
        var ref$1 = this.state;
        var reply = ref$1.reply;
        var ref$2 = ids(commentId);
        var replyCollapse = ref$2.replyCollapse;

        replyHandle(commentId, reply);
        $("#" + replyCollapse).collapse('hide');
        this.setState({ reply: '' });
    };

    CommentControls.prototype.showTooltip = function showTooltip (item) {
        var ref = this.props;
        var commentId = ref.commentId;
        var btn = "#" + commentId + "_" + item;
        $(btn).tooltip('show');
    };

    CommentControls.prototype.handleTextChange = function handleTextChange (e) {
        this.setState({ text: e.target.value });
    };

    CommentControls.prototype.handleReplyChange = function handleReplyChange (e) {
        this.setState({ reply: e.target.value })
    };

    CommentControls.prototype.render = function render () {
        var this$1 = this;

        var ref = this.props;
        var text = ref.text;
        var commentId = ref.commentId;
        var canEdit = ref.canEdit;
        var deleteHandle = ref.deleteHandle;
        var ref$1 = ids(commentId);
        var editCollapse = ref$1.editCollapse;
        var replyCollapse = ref$1.replyCollapse;
        var replyId = ref$1.replyId;
        var editId = ref$1.editId;
        var deleteId = ref$1.deleteId;
        var editTarget = "#" + editCollapse;
        var replyTarget = "#" + replyCollapse;

        return (
            canEdit ?
            React.createElement( 'div', { className: "row" }, 
                React.createElement( 'div', { className: "row", style: {paddingBottom: '5px', paddingLeft: "15px"} }, 
                    React.createElement( 'div', { className: "col-lg-4" }, 
                        React.createElement( 'a', { onClick: deleteHandle.bind(null, commentId), style: { textDecoration: "none", cursor: "pointer" } }, 
                            React.createElement( 'span', {
                                  onMouseEnter: this.showTooltip.bind(this, 'delete'), id: deleteId, 'data-toggle': "tooltip", title: "Slet", className: "label label-danger" }, 
                                React.createElement( 'span', { className: "glyphicon glyphicon-trash" })
                            ), '\u00A0'
                        ),  
                        React.createElement( 'a', { 'data-toggle': "collapse", 'data-target': editTarget, style: { textDecoration: "none", cursor: "pointer" } }, 
                            React.createElement( 'span', {
                                  onMouseEnter: this.showTooltip.bind(this, 'edit'), id: editId, 'data-toggle': "tooltip", title: "Ændre", className: "label label-success" }, 
                                React.createElement( 'span', { className: "glyphicon glyphicon-pencil" })
                            ), '\u00A0'
                        ),  
                        React.createElement( 'a', { 'data-toggle': "collapse", 'data-target': replyTarget, style: { textDecoration: "none", cursor: "pointer" } }, 
                            React.createElement( 'span', {
                                  onMouseEnter: this.showTooltip.bind(this, 'reply'), id: replyId, 'data-toggle': "tooltip", title: "Svar", className: "label label-primary" }, 
                                React.createElement( 'span', { className: "glyphicon glyphicon-envelope" })
                            )
                        )
                    )
                ), 
                React.createElement( 'div', { className: "row", style: {paddingBottom: '5px'} }, 
                    React.createElement( 'div', { className: "col-lg-offset-1 col-lg-10 collapse", id: editCollapse }, 
                        React.createElement( 'textarea', { className: "form-control", value: this.state.text, onChange: this.handleTextChange, rows: "4" }), 
                        React.createElement( 'br', null ), 
                        React.createElement( 'button', { type: "button", 'data-toggle': "collapse", onClick: function () { return this$1.setState({text: text}); }, 'data-target': editTarget, className: "btn btn-default" }, "Luk"), 
                        React.createElement( 'button', { type: "button", className: "btn btn-info", onClick: this.edit }, "Gem ændringer")
                    )
                ), 
                React.createElement( 'div', { className: "row" }, 
                    React.createElement( 'div', { className: "col-lg-offset-1 col-lg-10 collapse", id: replyCollapse }, 
                        React.createElement( 'textarea', { className: "form-control", value: this.state.reply, onChange: this.handleReplyChange, rows: "4" }), 
                        React.createElement( 'br', null ), 
                        React.createElement( 'button', { type: "button", 'data-toggle': "collapse", 'data-target': replyTarget, className: "btn btn-default" }, "Luk"), 
                        React.createElement( 'button', { type: "button", className: "btn btn-info", onClick: this.reply }, "Svar")
                    )
                )
            ) : 
            React.createElement( 'div', { className: "row" }, 
                React.createElement( 'div', { className: "row", style: {paddingBottom: '5px', paddingLeft: '15px'} }, 
                    React.createElement( 'div', { className: "col-lg-4" }, 
                        React.createElement( 'a', { 'data-toggle': "collapse", 'data-target': replyTarget }, 
                            React.createElement( 'span', {
                                  onMouseEnter: this.showTooltip.bind(this, 'reply'), id: replyId, 'data-toggle': "tooltip", title: "Svar", className: "label label-primary" }, 
                                React.createElement( 'span', { className: "glyphicon glyphicon-envelope" })
                            )
                        )
                    )
                ), 
                React.createElement( 'div', { className: "row" }, 
                    React.createElement( 'div', { className: "col-lg-offset-1 col-lg-10 collapse", id: replyCollapse }, 
                        React.createElement( 'textarea', { className: "form-control", value: this.state.reply, onChange: this.handleReplyChange, rows: "4" }), 
                        React.createElement( 'br', null ), 
                        React.createElement( 'button', { type: "button", 'data-toggle': "collapse", 'data-target': replyTarget, className: "btn btn-default" }, "Luk"), 
                        React.createElement( 'button', { type: "button", className: "btn btn-info", onClick: this.reply }, "Svar")
                    )
                )
            )
        );
    };

    return CommentControls;
}(React.Component));

var Comment = (function (superclass) {
    function Comment () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) Comment.__proto__ = superclass;
    Comment.prototype = Object.create( superclass && superclass.prototype );
    Comment.prototype.constructor = Comment;

    Comment.prototype.render = function render () {
        var ref = this.props;
        var commentId = ref.commentId;
        var postedOn = ref.postedOn;
        var authorId = ref.authorId;
        var text = ref.text;
        var replies = ref.replies;
        var handlers = ref.handlers;
        var constructComments = ref.constructComments;
        var replyHandle = handlers.replyHandle;
        var editHandle = handlers.editHandle;
        var deleteHandle = handlers.deleteHandle;
        var canEdit = handlers.canEdit;
        var getUser = handlers.getUser;
        var author = getUser(authorId);
        var fullname = author.FirstName + " " + author.LastName;
        var canEditVal = canEdit(authorId);
        var replyNodes = constructComments(replies, handlers);
        var txt = formatText(text);

        return (
            React.createElement( 'div', { className: "media pull-left text-left" }, 
                    React.createElement( CommentProfile, null ), 
                    React.createElement( 'div', { className: "media-body" }, 
                        React.createElement( 'h5', { className: "media-heading" }, React.createElement( 'strong', null, fullname ), " ", React.createElement( PostedOn, { postedOn: postedOn })), 
                        React.createElement( 'span', { dangerouslySetInnerHTML: txt }), 
                        React.createElement( CommentControls, {
                                  canEdit: canEditVal, commentId: commentId, deleteHandle: deleteHandle, editHandle: editHandle, replyHandle: replyHandle, text: text }), 
                        replyNodes
                    )
            ));
    };

    return Comment;
}(React.Component));

var PostedOn = (function (superclass) {
    function PostedOn () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) PostedOn.__proto__ = superclass;
    PostedOn.prototype = Object.create( superclass && superclass.prototype );
    PostedOn.prototype.constructor = PostedOn;

    PostedOn.prototype.ago = function ago () {
        var ref = this.props;
        var postedOn = ref.postedOn;
        var ago = moment(postedOn).fromNow();
        var diff = moment().diff(postedOn, 'hours', true);
        if (diff >= 12.5) {
            var date = moment(postedOn);
            return "d. " + date.format("D MMM YYYY ") + "kl. " + date.format("H:mm");
        }

        return "for " + ago;
    };

    PostedOn.prototype.render = function render () {
        return (React.createElement( 'small', null, "sagde ", this.ago() ));
    };

    return PostedOn;
}(React.Component));

var compactHandlers = function (replyHandle, editHandle, deleteHandle, canEdit, getUser) {
    return {
        replyHandle: replyHandle,
        editHandle: editHandle,
        deleteHandle: deleteHandle,
        canEdit: canEdit,
        getUser: getUser
    }
}

var CommentList = (function (superclass) {
    function CommentList () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) CommentList.__proto__ = superclass;
    CommentList.prototype = Object.create( superclass && superclass.prototype );
    CommentList.prototype.constructor = CommentList;

    CommentList.prototype.constructComments = function constructComments (comments, handlers) {
        if (!comments || comments.length == 0) return;

        return comments.map(function (comment) {
            var key = "commentId" + comment.CommentID;

            if (comment.Deleted) {
                return (
                    React.createElement( 'div', { className: "media", key: key }, 
                        React.createElement( CommentDeleted, {
                             key: key, replies: comment.Replies, handlers: handlers, constructComments: constructComments })
                    ));
            }

            return (
                React.createElement( 'div', { className: "media", key: key }, 
                    React.createElement( Comment, {
                             key: key, postedOn: comment.PostedOn, authorId: comment.AuthorID, text: comment.Text, replies: comment.Replies, commentId: comment.CommentID, handlers: handlers, constructComments: constructComments })
                )
            );
        });
    };

    CommentList.prototype.render = function render () {
        var ref = this.props;
        var comments = ref.comments;
        var replyHandle = ref.replyHandle;
        var editHandle = ref.editHandle;
        var deleteHandle = ref.deleteHandle;
        var canEdit = ref.canEdit;
        var getUser = ref.getUser;
        var userId = ref.userId;
        var handlers = compactHandlers(replyHandle, editHandle, deleteHandle, canEdit, getUser);
        var nodes = this.constructComments(comments, handlers);
        return (
            React.createElement( 'div', null, 
                nodes
            )
        );
    };

    return CommentList;
}(React.Component));

var Pagination = (function (superclass) {
    function Pagination () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) Pagination.__proto__ = superclass;
    Pagination.prototype = Object.create( superclass && superclass.prototype );
    Pagination.prototype.constructor = Pagination;

    Pagination.prototype.prevView = function prevView () {
        var ref = this.props;
        var currentPage = ref.currentPage;
        var prev = ref.prev;
        var hasPrev = !(currentPage === 1);
        if (hasPrev)
            return (
                React.createElement( 'li', null, 
                  React.createElement( 'a', { href: "#", 'aria-label': "Previous", onClick: prev }, 
                    React.createElement( 'span', { 'aria-hidden': "true" }, "«")
                  )
                ));
        else
            return (
                React.createElement( 'li', { className: "disabled" }, 
                    React.createElement( 'span', { 'aria-hidden': "true" }, "«")
                ));
    };

    Pagination.prototype.nextView = function nextView () {
        var ref = this.props;
        var totalPages = ref.totalPages;
        var currentPage = ref.currentPage;
        var next = ref.next;
        var hasNext = !(totalPages === currentPage) && !(totalPages === 0);
        if(hasNext)
            return (
                React.createElement( 'li', null, 
                  React.createElement( 'a', { href: "#", 'aria-label': "Next", onClick: next }, 
                    React.createElement( 'span', { 'aria-hidden': "true" }, "»")
                  )
                ));
        else
            return (
                React.createElement( 'li', { className: "disabled" }, 
                    React.createElement( 'span', { 'aria-hidden': "true" }, "»")
                ));
    };

    Pagination.prototype.render = function render () {
        var ref = this.props;
        var totalPages = ref.totalPages;
        var imageId = ref.imageId;
        var currentPage = ref.currentPage;
        var getPage = ref.getPage;
        var pages = [];
        for (var i = 1; i <= totalPages; i++) {
            var key = "page_item_" + (imageId + i);
            if (i === currentPage) {
                pages.push(React.createElement( 'li', { className: "active", key: key }, React.createElement( 'a', { href: "#", key: key }, i)));
            } else {
                pages.push(React.createElement( 'li', { key: key, onClick: getPage.bind(null, i) }, React.createElement( 'a', { href: "#", key: key }, i)));
            }
        }

        var show = (pages.length > 0);

        return(
            show ?
            React.createElement( 'div', null, 
                React.createElement( 'div', { className: "col-lg-offset-1 col-lg-9" }, 
                    React.createElement( 'nav', null, 
                      React.createElement( 'ul', { className: "pagination" }, 
                          this.prevView(), 
                          pages, 
                          this.nextView()
                      )
                    )
                )
            )
            : null);
    };

    return Pagination;
}(React.Component));

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
        return (
            React.createElement( 'form', { onSubmit: this.postComment }, 
                React.createElement( 'label', { htmlFor: "remark" }, "Kommentar"), 
                React.createElement( 'textarea', { className: "form-control", onChange: this.handleTextChange, value: this.state.Text, placeholder: "Skriv kommentar her...", id: "remark", rows: "4" }), 
                React.createElement( 'br', null ), 
                React.createElement( 'button', { type: "submit", className: "btn btn-primary" }, "Send")
            )
        );
    };

    return CommentForm;
}(React.Component));

var mapStateToProps$4 = function (state) {
    return {
        imageId: state.imagesInfo.selectedImageId,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        page: state.commentsInfo.page,
        totalPages: state.commentsInfo.totalPages,
        comments: state.commentsInfo.comments,
        getUser: function (id) { return underscore.find(state.usersInfo.users, function (u) { return u.ID == id; }); },
        canEdit: function (userId) { return state.usersInfo.currentUserId == userId; },
        userId: state.usersInfo.currentUserId
    }
}

var mapDispatchToProps$4 = function (dispatch) {
    return {
        loadComments: function (imageId, skip, take) {
            dispatch(fetchComments(imageId, skip, take));
        },
        postReply: function (imageId, replyId, text) {
            dispatch(postComment(imageId, text, replyId));
        },
        postComment: function (imageId, text) {
            dispatch(postComment(imageId, text, null));
        },
        editComment: function (imageId, commentId, text) {
            dispatch(editComment(commentId, imageId, text));
        },
        deleteComment: function (imageId, commentId) {
            dispatch(deleteComment(commentId, imageId));
        }
    }
}

var CommentsContainer = (function (superclass) {
    function CommentsContainer(props) {
        superclass.call(this, props);
        this.nextPage = this.nextPage.bind(this);
        this.getPage = this.getPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
    }

    if ( superclass ) CommentsContainer.__proto__ = superclass;
    CommentsContainer.prototype = Object.create( superclass && superclass.prototype );
    CommentsContainer.prototype.constructor = CommentsContainer;

    CommentsContainer.prototype.nextPage = function nextPage () {
        var ref = this.props;
        var loadComments = ref.loadComments;
        var imageId = ref.imageId;
        var skip = ref.skip;
        var take = ref.take;
        var skipNext = skip + take;
        loadComments(imageId, skipNext, take);
    };

    CommentsContainer.prototype.getPage = function getPage (page) {
        var ref = this.props;
        var loadComments = ref.loadComments;
        var imageId = ref.imageId;
        var take = ref.take;
        var skipPages = page - 1;
        var skipItems = (skipPages * take);
        loadComments(imageId, skipItems, take);
    };

    CommentsContainer.prototype.previousPage = function previousPage () {
        var ref = this.props;
        var loadComments = ref.loadComments;
        var imageId = ref.imageId;
        var skip = ref.skip;
        var take = ref.take;
        var backSkip = skip - take;
        loadComments(imageId, backSkip, take);
    };

    CommentsContainer.prototype.componentDidMount = function componentDidMount () {
        var ref = this.props;
        var loadComments = ref.loadComments;
        var imageId = ref.imageId;
        var skip = ref.skip;
        var take = ref.take;
        loadComments(imageId, skip, take);
    };

    CommentsContainer.prototype.render = function render () {
        var ref = this.props;
        var comments = ref.comments;
        var postReply = ref.postReply;
        var editComment = ref.editComment;
        var postComment = ref.postComment;
        var deleteComment = ref.deleteComment;
        var canEdit = ref.canEdit;
        var getUser = ref.getUser;
        var userId = ref.userId;
        var imageId = ref.imageId;
        var page = ref.page;
        var totalPages = ref.totalPages;

        return (
            React.createElement( 'div', null, 
                React.createElement( 'div', { className: "row" }, 
                    React.createElement( 'div', { className: "col-lg-offset-1 col-lg-11" }, 
                        React.createElement( CommentList, {
                            comments: comments, replyHandle: postReply.bind(null, imageId), editHandle: editComment.bind(null, imageId), deleteHandle: deleteComment.bind(null, imageId), canEdit: canEdit, getUser: getUser })
                    )
                ), 
                React.createElement( 'div', { className: "row text-left" }, 
                    React.createElement( Pagination, {
                            imageId: imageId, currentPage: page, totalPages: totalPages, next: this.nextPage, prev: this.previousPage, getPage: this.getPage })
                ), 
                React.createElement( 'hr', null ), 
                React.createElement( 'div', { className: "row text-left" }, 
                    React.createElement( 'div', { className: "col-lg-offset-1 col-lg-10" }, 
                        React.createElement( CommentForm, {
                            postHandle: postComment.bind(null, imageId) })
                    )
                )
            )
        );
    };

    return CommentsContainer;
}(React.Component));

var Comments = reactRedux.connect(mapStateToProps$4, mapDispatchToProps$4)(CommentsContainer);

var Modal = (function (superclass) {
    function Modal(props) {
        superclass.call(this, props);
        this.deleteImage = this.deleteImage.bind(this); 
    }

    if ( superclass ) Modal.__proto__ = superclass;
    Modal.prototype = Object.create( superclass && superclass.prototype );
    Modal.prototype.constructor = Modal;

    Modal.prototype.componentDidMount = function componentDidMount () {
        var ref = this.props;
        var deselectImage = ref.deselectImage;
        $(ReactDOM.findDOMNode(this)).modal('show');
        $(ReactDOM.findDOMNode(this)).on('hide.bs.modal', function (e) {
            deselectImage();
        });
    };

    Modal.prototype.deleteImage = function deleteImage () {
        var ref = this.props;
        var deleteImage = ref.deleteImage;
        var image = ref.image;
        var username = ref.username;
        var id = image.ImageID;

        deleteImage(id, username);
        $(ReactDOM.findDOMNode(this)).modal('hide');
    };

    Modal.prototype.deleteImageView = function deleteImageView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        return (
            canEdit ?
            React.createElement( 'button', {
                    type: "button", className: "btn btn-danger", onClick: this.deleteImage }, "Slet billede") : null);
    };

    Modal.prototype.render = function render () {
        var ref = this.props;
        var image = ref.image;
        var ImageID = image.ImageID;
        var Filename = image.Filename;
        var PreviewUrl = image.PreviewUrl;
        var Extension = image.Extension;
        var OriginalUrl = image.OriginalUrl;
        var Uploaded = image.Uploaded;
        var name = Filename + "." + Extension;
        var uploadDate = moment(Uploaded);
        var dateString = "Uploaded d. " + uploadDate.format("D MMM YYYY ") + "kl. " + uploadDate.format("H:mm");

        return (
            React.createElement( 'div', { className: "modal fade" }, 
                React.createElement( 'div', { className: "modal-dialog modal-lg" }, 
                    React.createElement( 'div', { className: "modal-content" }, 
                        React.createElement( 'div', { className: "modal-header" }, 
                          React.createElement( 'button', { type: "button", className: "close", 'data-dismiss': "modal", 'aria-label': "Close" }, React.createElement( 'span', { 'aria-hidden': "true" }, "×")), 
                          React.createElement( 'h4', { className: "modal-title text-center" }, name, React.createElement( 'span', null, React.createElement( 'small', null, " - ", dateString ) ))
                          
                        ), 
                        React.createElement( 'div', { className: "modal-body" }, 
                            React.createElement( 'a', { href: OriginalUrl, target: "_blank" }, 
                                React.createElement( 'img', { className: "img-responsive center-block", src: PreviewUrl })
                            )
                        ), 
                        React.createElement( 'div', { className: "modal-footer" }, 
                            React.createElement( Comments, null ), 
                            React.createElement( 'hr', null ), 
                            this.deleteImageView(), 
                            React.createElement( 'button', { type: "button", className: "btn btn-default", 'data-dismiss': "modal" }, "Luk"), 
                            React.createElement( 'div', { className: "row" }, 
                                '\u00A0'
                            )
                        )
                    )
                )
            )
        );
    };

    return Modal;
}(React.Component));

var mapStateToProps$3 = function (state) {
    return {
        images: state.imagesInfo.images,
        canEdit: function (username) { return globals.currentUsername == username; },
        getUser: function (username) { return state.usersInfo.users.filter(function (u) { return u.Username.toUpperCase() == username.toUpperCase(); })[0]; },
        selectedImageId: state.imagesInfo.selectedImageId,
        selectedImageIds: state.imagesInfo.selectedImageIds
    }
}

var mapDispatchToProps$3 = function (dispatch) {
    return {
        loadImages: function (username) {
            dispatch(fetchUserImages(username));
        },
        deleteImage: function (id, username) {
            dispatch(requestDeleteImage(id, username));
        },
        uploadImage: function (username, formData) {
            dispatch(uploadImage(username, formData));
        },
        setSelectedImage: function (id) {
            dispatch(setSelectedImg(id));
        },
        deselectImage: function () {
            dispatch(removeModal());
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
        var loadImages = ref$1.loadImages;
        var router = ref$1.router;
        var route = ref$1.route;

        router.setRouteLeaveHook(route, this.clearSelected);
        loadImages(username);
        document.title = username + "'s billeder";
    };

    UserImagesContainer.prototype.clearSelected = function clearSelected () {
        var ref = this.props;
        var clearSelectedImageIds = ref.clearSelectedImageIds;
        clearSelectedImageIds();
        return true;
    };

    UserImagesContainer.prototype.getImage = function getImage (id) {
        var ref = this.props;
        var images = ref.images;
        var image = images.filter(function (img) { return img.ImageID == id; })[0];
        return image;
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
    };

    UserImagesContainer.prototype.uploadView = function uploadView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var uploadImage = ref.uploadImage;
        var selectedImageIds = ref.selectedImageIds;
        var ref$1 = this.props.params;
        var username = ref$1.username;
        var showUpload = canEdit(username);
        var hasImages = selectedImageIds.length > 0;

        return (
            showUpload ? 
            React.createElement( ImageUpload, {
                uploadImage: uploadImage, username: username, deleteSelectedImages: this.deleteSelectedImages, hasImages: hasImages })
            : null);
    };

    UserImagesContainer.prototype.modalView = function modalView () {
        var this$1 = this;

        var ref = this.props;
        var selectedImageId = ref.selectedImageId;
        var canEdit = ref.canEdit;
        var deselectImage = ref.deselectImage;
        var deleteImage = ref.deleteImage;
        var ref$1 = this.props.params;
        var username = ref$1.username;
        var selected = selectedImageId > 0;
        var image = function () { return this$1.getImage(selectedImageId); };
        return (selected ? 
            React.createElement( Modal, {
                image: image(), canEdit: canEdit(username), deselectImage: deselectImage, deleteImage: deleteImage, username: username })
            : null);
    };

    UserImagesContainer.prototype.render = function render () {
        var ref = this.props.params;
        var username = ref.username;
        var ref$1 = this.props;
        var images = ref$1.images;
        var getUser = ref$1.getUser;
        var setSelectedImage = ref$1.setSelectedImage;
        var canEdit = ref$1.canEdit;
        var addSelectedImageId = ref$1.addSelectedImageId;
        var removeSelectedImageId = ref$1.removeSelectedImageId;
        var user = getUser(username);
        var fullName = user ? user.FirstName + " " + user.LastName : 'User';
        
        return (
            React.createElement( 'div', { className: "row" }, 
                React.createElement( 'div', { className: "col-lg-offset-2 col-lg-8" }, 
                    React.createElement( 'h1', null, React.createElement( 'span', { className: "text-capitalize" }, fullName.toLowerCase(), "'s"), " ", React.createElement( 'small', null, "billede galleri" ) ), 
                    React.createElement( 'hr', null ), 
                    React.createElement( ImageList, {
                        images: images, selectImage: setSelectedImage, canEdit: canEdit(username), addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: this.imageIsSelected }), 
                    this.modalView(), 
                    this.uploadView()
                )
            )
        );
    };

    return UserImagesContainer;
}(React.Component));

var UserImagesRedux = reactRedux.connect(mapStateToProps$3, mapDispatchToProps$3)(UserImagesContainer);
var UserImages = reactRouter.withRouter(UserImagesRedux);

store.dispatch(fetchCurrentUser(globals.currentUsername));
moment.locale('da');

ReactDOM.render(
    React.createElement( reactRedux.Provider, { store: store }, 
        React.createElement( reactRouter.Router, { history: reactRouter.browserHistory }, 
            React.createElement( reactRouter.Route, { path: "/", component: Main }, 
                React.createElement( reactRouter.IndexRoute, { component: Home }), 
                React.createElement( reactRouter.Route, { path: "users", component: Users }), 
                React.createElement( reactRouter.Route, { path: "about", component: About }), 
                React.createElement( reactRouter.Route, { path: ":username/gallery", component: UserImages })
            )
        )
    ),
    document.getElementById('content'));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbnN0YW50cy90eXBlcy5qcyIsImFjdGlvbnMvZXJyb3IuanMiLCJ1dGlsaXRpZXMvdXRpbHMuanMiLCJyZWR1Y2Vycy91c2Vycy5qcyIsInJlZHVjZXJzL2ltYWdlcy5qcyIsInJlZHVjZXJzL2NvbW1lbnRzLmpzIiwicmVkdWNlcnMvZXJyb3IuanMiLCJyZWR1Y2Vycy9zdGF0dXMuanMiLCJyZWR1Y2Vycy93aGF0c25ldy5qcyIsInJlZHVjZXJzL3Jvb3QuanMiLCJzdG9yZXMvc3RvcmUuanMiLCJjb25zdGFudHMvY29uc3RhbnRzLmpzIiwiYWN0aW9ucy91c2Vycy5qcyIsImNvbXBvbmVudHMvd3JhcHBlcnMvTGlua3MuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRXJyb3IuanMiLCJjb21wb25lbnRzL01haW4uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJhY3Rpb25zL3doYXRzbmV3LmpzIiwiY29tcG9uZW50cy9XaGF0c05ldy9XaGF0c05ld0l0ZW1JbWFnZS5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3TGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9XaGF0c05ldy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Ib21lLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2Vycy5qcyIsImFjdGlvbnMvY29tbWVudHMuanMiLCJhY3Rpb25zL2ltYWdlcy5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlVXBsb2FkLmpzIiwiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2UuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZUxpc3QuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnREZWxldGVkLmpzIiwiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50Q29udHJvbHMuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRMaXN0LmpzIiwiY29tcG9uZW50cy9jb21tZW50cy9QYWdpbmF0aW9uLmpzIiwiY29tcG9uZW50cy9jb21tZW50cy9Db21tZW50Rm9ybS5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Db21tZW50cy5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL01vZGFsLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJJbWFnZXMuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gSW1hZ2UgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX0lNRyA9ICdTRVRfU0VMRUNURURfSU1HJztcclxuZXhwb3J0IGNvbnN0IFVOU0VUX1NFTEVDVEVEX0lNRyA9ICdVTlNFVF9TRUxFQ1RFRF9JTUcnO1xyXG5leHBvcnQgY29uc3QgUkVNT1ZFX0lNQUdFID0gJ1JFTU9WRV9JTUFHRSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfSU1BR0VTX09XTkVSID0gJ1NFVF9JTUFHRVNfT1dORVInO1xyXG5leHBvcnQgY29uc3QgUkVDSUVWRURfVVNFUl9JTUFHRVMgPSAnUkVDSUVWRURfVVNFUl9JTUFHRVMnO1xyXG5leHBvcnQgY29uc3QgQUREX1NFTEVDVEVEX0lNQUdFX0lEID0gJ0FERF9TRUxFQ1RFRF9JTUFHRV9JRCc7XHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfU0VMRUNURURfSU1BR0VfSUQgPSAnUkVNT1ZFX1NFTEVDVEVEX0lNQUdFX0lEJztcclxuZXhwb3J0IGNvbnN0IENMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyA9ICdDTEVBUl9TRUxFQ1RFRF9JTUFHRV9JRFMnO1xyXG5cclxuLy8gVXNlciBhY3Rpb25zXHJcbmV4cG9ydCBjb25zdCBTRVRfQ1VSUkVOVF9VU0VSX0lEID0gJ1NFVF9DVVJSRU5UX1VTRVJfSUQnO1xyXG5leHBvcnQgY29uc3QgQUREX1VTRVIgPSAnQUREX1VTRVInO1xyXG5leHBvcnQgY29uc3QgRVJST1JfRkVUQ0hJTkdfQ1VSUkVOVF9VU0VSID0gJ0VSUk9SX0ZFVENISU5HX0NVUlJFTlRfVVNFUic7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9VU0VSUyA9ICdSRUNJRVZFRF9VU0VSUyc7XHJcblxyXG4vLyBDb21tZW50IGFjdGlvbnNcclxuZXhwb3J0IGNvbnN0IFJFQ0lFVkVEX0NPTU1FTlRTID0gJ1JFQ0lFVkVEX0NPTU1FTlRTJztcclxuZXhwb3J0IGNvbnN0IFNFVF9DVVJSRU5UX1BBR0UgPSAnU0VUX0NVUlJFTlRfUEFHRSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfVE9UQUxfUEFHRVMgPSAnU0VUX1RPVEFMX1BBR0VTJztcclxuZXhwb3J0IGNvbnN0IFNFVF9TS0lQX0NPTU1FTlRTID0gJ1NFVF9TS0lQX0NPTU1FTlRTJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UQUtFX0NPTU1FTlRTID0gJ1NFVF9UQUtFX0NPTU1FTlRTJztcclxuZXhwb3J0IGNvbnN0IElOQ1JfQ09NTUVOVF9DT1VOVCA9ICdJTkNSX0NPTU1FTlRfQ09VTlQnO1xyXG5leHBvcnQgY29uc3QgREVDUl9DT01NRU5UX0NPVU5UID0gJ0RFQ1JfQ09NTUVOVF9DT1VOVCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfREVGQVVMVF9TS0lQID0gJ1NFVF9ERUZBVUxUX1NLSVAnO1xyXG5leHBvcnQgY29uc3QgU0VUX0RFRkFVTFRfVEFLRSA9ICdTRVRfREVGQVVMVF9UQUtFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9ERUZBVUxUX0NPTU1FTlRTID0gJ1NFVF9ERUZBVUxUX0NPTU1FTlRTJztcclxuXHJcbi8vIFdoYXRzTmV3XHJcbmV4cG9ydCBjb25zdCBBRERfTEFURVNUID0gJ0FERF9MQVRFU1QnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NLSVBfV0hBVFNfTkVXID0gJ1NFVF9TS0lQX1dIQVRTX05FVyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfVEFLRV9XSEFUU19ORVcgPSAnU0VUX1RBS0VfV0hBVFNfTkVXJztcclxuZXhwb3J0IGNvbnN0IFNFVF9QQUdFX1dIQVRTX05FVyA9ICdTRVRfUEFHRV9XSEFUU19ORVcnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVyA9ICdTRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXJztcclxuXHJcbi8vIEVycm9yIGFjdGlvbnNcclxuZXhwb3J0IGNvbnN0IFNFVF9FUlJPUl9USVRMRSA9ICdTRVRfRVJST1JfVElUTEUnO1xyXG5leHBvcnQgY29uc3QgU0VUX0VSUk9SX01FU1NBR0UgPSAnU0VUX0VSUk9SX01FU1NBR0UnXHJcbmV4cG9ydCBjb25zdCBTRVRfSEFTX0VSUk9SID0gJ1NFVF9IQVNfRVJST1InO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfRVJST1JfVElUTEUgPSAnQ0xFQVJfRVJST1JfVElUTEUnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfRVJST1JfTUVTU0FHRSA9ICdDTEVBUl9FUlJPUl9NRVNTQUdFJzsiLCLvu79pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvclRpdGxlID0gKHRpdGxlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0VSUk9SX1RJVExFLFxyXG4gICAgICAgIHRpdGxlOiB0aXRsZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvclRpdGxlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkNMRUFSX0VSUk9SX1RJVExFXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvck1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9FUlJPUl9NRVNTQUdFLFxyXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3JNZXNzYWdlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkNMRUFSX0VSUk9SX01FU1NBR0VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3IgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvclRpdGxlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKGNsZWFyRXJyb3JNZXNzYWdlKCkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKGZhbHNlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0SGFzRXJyb3IgPSAoaGFzRXJyb3IpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfSEFTX0VSUk9SLFxyXG4gICAgICAgIGhhc0Vycm9yOiBoYXNFcnJvclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0RXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChzZXRIYXNFcnJvcih0cnVlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JUaXRsZShlcnJvci50aXRsZSkpO1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEVycm9yTWVzc2FnZShlcnJvci5tZXNzYWdlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHRpdGxlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyB1bmlxLCBmbGF0dGVuIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCBtYXJrZWQgZnJvbSAnbWFya2VkJ1xyXG5cclxudmFyIGN1cnJ5ID0gZnVuY3Rpb24oZiwgbmFyZ3MsIGFyZ3MpIHtcclxuICAgIG5hcmdzID0gaXNGaW5pdGUobmFyZ3MpID8gbmFyZ3MgOiBmLmxlbmd0aDtcclxuICAgIGFyZ3MgPSBhcmdzIHx8IFtdO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIDEuIGFjY3VtdWxhdGUgYXJndW1lbnRzXHJcbiAgICAgICAgdmFyIG5ld0FyZ3MgPSBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgICBpZiAobmV3QXJncy5sZW5ndGggPj0gbmFyZ3MpIHtcclxuICAgICAgICAgICAgLy8gYXBwbHkgYWNjdW11bGF0ZWQgYXJndW1lbnRzXHJcbiAgICAgICAgICAgIHJldHVybiBmLmFwcGx5KHRoaXMsIG5ld0FyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAyLiByZXR1cm4gYW5vdGhlciBjdXJyaWVkIGZ1bmN0aW9uXHJcbiAgICAgICAgcmV0dXJuIGN1cnJ5KGYsIG5hcmdzLCBuZXdBcmdzKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjdXJyeTtcclxuXHJcbmNvbnN0IGNvdW50Q29tbWVudCA9ICh0b3BDb21tZW50KSA9PiB7XHJcbiAgICBsZXQgY291bnQgPSAxO1xyXG4gICAgbGV0IHJlbW92ZWQgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BDb21tZW50LlJlcGxpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IHRvcENvbW1lbnQuUmVwbGllc1tpXTtcclxuXHJcbiAgICAgICAgLy8gRXhjbHVkZSBkZWxldGVkIGNvbW1lbnRzXHJcbiAgICAgICAgaWYoY2hpbGQuRGVsZXRlZCkge1xyXG4gICAgICAgICAgICByZW1vdmVkKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb3VudCArPSBjb3VudENvbW1lbnQoY2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb3VudC1yZW1vdmVkO1xyXG59XHJcblxyXG5jb25zdCBjb3VudENvbW1lbnRzID0gKGNvbW1lbnRzID0gW10pID0+IHtcclxuICAgIGxldCB0b3RhbCA9IDA7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHRvcENvbW1lbnQgPSBjb21tZW50c1tpXTtcclxuICAgICAgICB0b3RhbCArPSBjb3VudENvbW1lbnQodG9wQ29tbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRvdGFsO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplSW1hZ2UgPSAoaW1nKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIEltYWdlSUQ6IGltZy5JbWFnZUlELFxyXG4gICAgICAgIEZpbGVuYW1lOiBpbWcuRmlsZW5hbWUsXHJcbiAgICAgICAgRXh0ZW5zaW9uOiBpbWcuRXh0ZW5zaW9uLFxyXG4gICAgICAgIE9yaWdpbmFsVXJsOiBpbWcuT3JpZ2luYWxVcmwsXHJcbiAgICAgICAgUHJldmlld1VybDogaW1nLlByZXZpZXdVcmwsXHJcbiAgICAgICAgVGh1bWJuYWlsVXJsOiBpbWcuVGh1bWJuYWlsVXJsLFxyXG4gICAgICAgIENvbW1lbnRDb3VudDogaW1nLkNvbW1lbnRDb3VudCxcclxuICAgICAgICBVcGxvYWRlZDogbmV3IERhdGUoaW1nLlVwbG9hZGVkKSxcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVDb21tZW50ID0gKGNvbW1lbnQpID0+IHtcclxuICAgIGxldCByID0gY29tbWVudC5SZXBsaWVzID8gY29tbWVudC5SZXBsaWVzIDogW107XHJcbiAgICBjb25zdCByZXBsaWVzID0gci5tYXAobm9ybWFsaXplQ29tbWVudCk7XHJcbiAgICBjb25zdCBhdXRob3JJZCA9IChjb21tZW50LkRlbGV0ZWQpID8gLTEgOiBjb21tZW50LkF1dGhvci5JRDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgQ29tbWVudElEOiBjb21tZW50LklELFxyXG4gICAgICAgIEF1dGhvcklEOiBhdXRob3JJZCxcclxuICAgICAgICBEZWxldGVkOiBjb21tZW50LkRlbGV0ZWQsXHJcbiAgICAgICAgUG9zdGVkT246IGNvbW1lbnQuUG9zdGVkT24sXHJcbiAgICAgICAgVGV4dDogY29tbWVudC5UZXh0LFxyXG4gICAgICAgIFJlcGxpZXM6IHJlcGxpZXNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUxhdGVzdCA9IChsYXRlc3QpID0+IHtcclxuICAgIGxldCBpdGVtID0gbnVsbDtcclxuICAgIGlmKGxhdGVzdC5UeXBlID09IDEpIHtcclxuICAgICAgICAvLyBJbWFnZSAtIG9taXQgQXV0aG9yIGFuZCBDb21tZW50Q291bnRcclxuICAgICAgICBjb25zdCBpbWFnZSA9IGxhdGVzdC5JdGVtO1xyXG4gICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIEV4dGVuc2lvbjogaW1hZ2UuRXh0ZW5zaW9uLFxyXG4gICAgICAgICAgICBGaWxlbmFtZTogaW1hZ2UuRmlsZW5hbWUsXHJcbiAgICAgICAgICAgIEltYWdlSUQ6IGltYWdlLkltYWdlSUQsXHJcbiAgICAgICAgICAgIE9yaWdpbmFsVXJsOiBpbWFnZS5PcmlnaW5hbFVybCxcclxuICAgICAgICAgICAgUHJldmlld1VybDogaW1hZ2UuUHJldmlld1VybCxcclxuICAgICAgICAgICAgVGh1bWJuYWlsVXJsOiBpbWFnZS5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgICAgIFVwbG9hZGVkOiBpbWFnZS5VcGxvYWRlZFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChsYXRlc3QuVHlwZSA9PSAyKSB7XHJcbiAgICAgICAgLy8gQ29tbWVudCAtIG9taXQgQXV0aG9yIGFuZCBEZWxldGVkIGFuZCBSZXBsaWVzXHJcbiAgICAgICAgY29uc3QgY29tbWVudCA9IGxhdGVzdC5JdGVtO1xyXG4gICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIElEOiBjb21tZW50LklELFxyXG4gICAgICAgICAgICBQb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbixcclxuICAgICAgICAgICAgVGV4dDogY29tbWVudC5UZXh0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiBsYXRlc3QuSUQsXHJcbiAgICAgICAgVHlwZTogbGF0ZXN0LlR5cGUsXHJcbiAgICAgICAgSXRlbTogaXRlbSxcclxuICAgICAgICBPbjogbGF0ZXN0Lk9uLFxyXG4gICAgICAgIEF1dGhvcklEOiBsYXRlc3QuSXRlbS5BdXRob3IuSURcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHZpc2l0Q29tbWVudHMgPSAoY29tbWVudHMsIGZ1bmMpID0+IHtcclxuICAgIGNvbnN0IGdldFJlcGxpZXMgPSAoYykgPT4gYy5SZXBsaWVzID8gYy5SZXBsaWVzIDogW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjb21tZW50c1tpXSwgZ2V0UmVwbGllcywgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZXB0aEZpcnN0U2VhcmNoID0gKGN1cnJlbnQsIGdldENoaWxkcmVuLCBmdW5jKSA9PiB7XHJcbiAgICBmdW5jKGN1cnJlbnQpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBnZXRDaGlsZHJlbihjdXJyZW50KTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKGNoaWxkcmVuW2ldLCBnZXRDaGlsZHJlbiwgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmlvbihhcnIxLCBhcnIyLCBlcXVhbGl0eUZ1bmMpIHtcclxuICAgIHZhciB1bmlvbiA9IGFycjEuY29uY2F0KGFycjIpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5pb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gaSsxOyBqIDwgdW5pb24ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGVxdWFsaXR5RnVuYyh1bmlvbltpXSwgdW5pb25bal0pKSB7XHJcbiAgICAgICAgICAgICAgICB1bmlvbi5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICBqLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVuaW9uO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXNlckVxdWFsaXR5ID0gKHVzZXIxLCB1c2VyMikgPT4ge1xyXG4gICAgaWYoIXVzZXIyIHx8ICF1c2VyMSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHVzZXIxLklEID09IHVzZXIyLklEO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGZvcm1hdFRleHQgPSAodGV4dCkgPT4ge1xyXG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICB2YXIgcmF3TWFya3VwID0gbWFya2VkKHRleHQsIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICByZXR1cm4geyBfX2h0bWw6IHJhd01hcmt1cCB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0V29yZHMgPSAodGV4dCwgbnVtYmVyT2ZXb3JkcykgPT4ge1xyXG4gICAgcmV0dXJuIHRleHQuc3BsaXQoL1xccysvKS5zbGljZSgwLCBudW1iZXJPZldvcmRzKS5qb2luKFwiIFwiKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc3BvbnNlSGFuZGxlciA9IChkaXNwYXRjaCwgcmVzcG9uc2UpID0+IHtcclxuICAgIGlmIChyZXNwb25zZS5vaykgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgNDAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjQwMCBCYWQgUmVxdWVzdFwiLCBcIlRoZSByZXF1ZXN0IHdhcyBub3Qgd2VsbC1mb3JtZWRcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDQgTm90IEZvdW5kXCIsIFwiQ291bGQgbm90IGZpbmQgcmVzb3VyY2VcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwODpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDggUmVxdWVzdCBUaW1lb3V0XCIsIFwiVGhlIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgaW4gdGltZVwiKSkpO1xyXG4gICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI1MDAgU2VydmVyIEVycm9yXCIsIFwiU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgQVBJLXNlcnZlclwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihuZXcgSHR0cEVycm9yKFwiT29wc1wiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG9uUmVqZWN0ID0gKCkgPT4geyB9XHJcbiIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgdW5pb24sIHVzZXJFcXVhbGl0eSB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IHVzZXJzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfVVNFUjpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLnVzZXJdLCB1c2VyRXF1YWxpdHkpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi51c2VycztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRVc2VySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9DVVJSRU5UX1VTRVJfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWRcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHVzZXJzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjdXJyZW50VXNlcklkLFxyXG4gICAgdXNlcnNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHVzZXJzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IHVuaW9uIH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5cclxuY29uc3Qgb3duZXJJZCA9IChzdGF0ZSA9IC0xLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0lNQUdFU19PV05FUjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGltYWdlcyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuUkVDSUVWRURfVVNFUl9JTUFHRVM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaW1hZ2VzO1xyXG4gICAgICAgIGNhc2UgVC5SRU1PVkVfSU1BR0U6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5maWx0ZXIoaW1nID0+IGltZy5JbWFnZUlEICE9IGFjdGlvbi5pZCk7XHJcbiAgICAgICAgY2FzZSBULklOQ1JfQ09NTUVOVF9DT1VOVDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLm1hcChpbWcgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoaW1nLkltYWdlSUQgPT0gYWN0aW9uLmltYWdlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWcuQ29tbWVudENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW1nO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFQuREVDUl9DT01NRU5UX0NPVU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubWFwKGltZyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihpbWcuSW1hZ2VJRCA9PSBhY3Rpb24uaW1hZ2VJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZy5Db21tZW50Q291bnQtLTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2VsZWN0ZWRJbWFnZUlkID0gKHN0YXRlID0gLTEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0VMRUNURURfSU1HOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmlkO1xyXG4gICAgICAgIGNhc2UgVC5VTlNFVF9TRUxFQ1RFRF9JTUc6XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNlbGVjdGVkSW1hZ2VJZHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9TRUxFQ1RFRF9JTUFHRV9JRDpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLmlkXSwgKGlkMSwgaWQyKSA9PiBpZDEgPT0gaWQyKTtcclxuICAgICAgICBjYXNlIFQuUkVNT1ZFX1NFTEVDVEVEX0lNQUdFX0lEOlxyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyKHN0YXRlLCAoaWQpID0+IGlkICE9IGFjdGlvbi5pZCk7XHJcbiAgICAgICAgY2FzZSBULkNMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUzpcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgaW1hZ2VzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBvd25lcklkLFxyXG4gICAgaW1hZ2VzLFxyXG4gICAgc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgc2VsZWN0ZWRJbWFnZUlkc1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW1hZ2VzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5jb25zdCBjb21tZW50cyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuUkVDSUVWRURfQ09NTUVOVFM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uY29tbWVudHM7XHJcbiAgICAgICAgY2FzZSBULlNFVF9ERUZBVUxUX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBza2lwID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TS0lQX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnNraXA7XHJcbiAgICAgICAgY2FzZSBULlNFVF9ERUZBVUxUX1NLSVA6XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdGFrZSA9IChzdGF0ZSA9IDEwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RBS0VfQ09NTUVOVFM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udGFrZTtcclxuICAgICAgICBjYXNlIFQuU0VUX0RFRkFVTFRfVEFLRTpcclxuICAgICAgICAgICAgcmV0dXJuIDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfQ1VSUkVOVF9QQUdFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBhZ2U7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB0b3RhbFBhZ2VzID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UT1RBTF9QQUdFUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50b3RhbFBhZ2VzO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgY29tbWVudHNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGNvbW1lbnRzLFxyXG4gICAgc2tpcCxcclxuICAgIHRha2UsXHJcbiAgICBwYWdlLFxyXG4gICAgdG90YWxQYWdlc1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29tbWVudHNJbmZvOyIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuXHJcbmV4cG9ydCBjb25zdCB0aXRsZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfRVJST1JfVElUTEU6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udGl0bGU7XHJcbiAgICAgICAgY2FzZSBULkNMRUFSX0VSUk9SX1RJVExFOlxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtZXNzYWdlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9FUlJPUl9NRVNTQUdFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLm1lc3NhZ2U7XHJcbiAgICAgICAgY2FzZSBULkNMRUFSX0VSUk9SX01FU1NBR0U6XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZXJyb3JJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHRpdGxlLFxyXG4gICAgbWVzc2FnZVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGVycm9ySW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCBlcnJvckluZm8gZnJvbSAnLi9lcnJvcidcclxuXHJcbmV4cG9ydCBjb25zdCBoYXNFcnJvciA9IChzdGF0ZSA9IGZhbHNlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0hBU19FUlJPUjpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5oYXNFcnJvcjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtZXNzYWdlID0gKHN0YXRlID0gXCJcIiwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZG9uZSA9IChzdGF0ZSA9IHRydWUsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc3RhdHVzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBoYXNFcnJvcixcclxuICAgIGVycm9ySW5mbyxcclxuICAgIG1lc3NhZ2UsXHJcbiAgICBkb25lXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBzdGF0dXNJbmZvOyIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuXHJcblxyXG5jb25zdCBza2lwID0gKHN0YXRlID0gMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TS0lQX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5za2lwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdGFrZSA9IChzdGF0ZSA9IDEwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RBS0VfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRha2U7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBwYWdlID0gKHN0YXRlID0gMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9QQUdFX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYWdlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRvdGFsUGFnZXM7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpdGVtcyA9IChzdGF0ZSA9IFtdLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuQUREX0xBVEVTVDpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5sYXRlc3Q7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB3aGF0c05ld0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgc2tpcCxcclxuICAgIHRha2UsXHJcbiAgICBwYWdlLFxyXG4gICAgdG90YWxQYWdlcyxcclxuICAgIGl0ZW1zXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCB3aGF0c05ld0luZm87XHJcblxyXG4vKiogV2hhdHNOZXdJbmZvXHJcbiAgICB7XHJcbiAgICAgICAgc2tpcDogMCxcclxuICAgICAgICB0YWtlOiAxMCxcclxuICAgICAgICBwYWdlOiAxLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IDIsXHJcbiAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSWQ6IDFcclxuICAgICAgICAgICAgICAgIFR5cGU6IGVudW0sXHJcbiAgICAgICAgICAgICAgICBBdXRob3JJZDogMSxcclxuICAgICAgICAgICAgICAgIEl0ZW06IHsgfSxcclxuICAgICAgICAgICAgICAgIE9uOiB0aW1lLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJZDogMixcclxuICAgICAgICAgICAgICAgIFR5cGU6IGVudW0sXHJcbiAgICAgICAgICAgICAgICBBdXRob3JJZDogMSxcclxuICAgICAgICAgICAgICAgIEl0ZW06IHsgfSxcclxuICAgICAgICAgICAgICAgIE9uOiB0aW1lLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG4qKi8iLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0IHVzZXJzSW5mbyBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgaW1hZ2VzSW5mbyBmcm9tICcuL2ltYWdlcydcclxuaW1wb3J0IGNvbW1lbnRzSW5mbyBmcm9tICcuL2NvbW1lbnRzJ1xyXG5pbXBvcnQgc3RhdHVzSW5mbyBmcm9tICcuL3N0YXR1cydcclxuaW1wb3J0IHdoYXRzTmV3SW5mbyBmcm9tICcuL3doYXRzbmV3J1xyXG5cclxuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdXNlcnNJbmZvLFxyXG4gICAgaW1hZ2VzSW5mbyxcclxuICAgIGNvbW1lbnRzSW5mbyxcclxuICAgIHN0YXR1c0luZm8sXHJcbiAgICB3aGF0c05ld0luZm9cclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyIiwi77u/aW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgdGh1bmsgZnJvbSAncmVkdXgtdGh1bmsnXHJcbmltcG9ydCByb290UmVkdWNlciBmcm9tICcuLi9yZWR1Y2Vycy9yb290J1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocm9vdFJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZSh0aHVuaykpIiwi77u/ZXhwb3J0IGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnXHJcbn0iLCLvu79pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5jb25zdCBnZXRVcmwgPSAodXNlcm5hbWUpID0+IGdsb2JhbHMudXJscy51c2VycyArICc/dXNlcm5hbWU9JyArIHVzZXJuYW1lO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRVc2VySWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfQ1VSUkVOVF9VU0VSX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXIodXNlcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9VU0VSLFxyXG4gICAgICAgIHVzZXI6IHVzZXJcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNpZXZlZFVzZXJzKHVzZXJzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfVVNFUlMsXHJcbiAgICAgICAgdXNlcnM6IHVzZXJzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRDdXJyZW50VXNlcklkKHVzZXIuSUQpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIodXNlcikpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFVzZXIodXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hVc2VycygpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGdsb2JhbHMudXJscy51c2Vycywgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlcnMgPT4gZGlzcGF0Y2gocmVjaWV2ZWRVc2Vycyh1c2VycykpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBMaW5rLCBJbmRleExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBOYXZMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQgaXNBY3RpdmUgPSB0aGlzLmNvbnRleHQucm91dGVyLmlzQWN0aXZlKHRoaXMucHJvcHMudG8sIHRydWUpLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBpc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG4gICAgICAgICAgICAgICAgPExpbmsgey4uLnRoaXMucHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuTmF2TGluay5jb250ZXh0VHlwZXMgPSB7XHJcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5vYmplY3RcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZGV4TmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICAgICAgICAgIDxJbmRleExpbmsgey4uLnRoaXMucHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9JbmRleExpbms+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5JbmRleE5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgRXJyb3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xlYXJFcnJvciwgdGl0bGUsIG1lc3NhZ2UgIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMiBjb2wtbGctOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIgcm9sZT1cImFsZXJ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2NsZWFyRXJyb3J9IHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bWVzc2FnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBMaW5rLCBJbmRleExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IE5hdkxpbmssIEluZGV4TmF2TGluayB9IGZyb20gJy4vd3JhcHBlcnMvTGlua3MnXHJcbmltcG9ydCB7IEVycm9yIH0gZnJvbSAnLi9jb250YWluZXJzL0Vycm9yJ1xyXG5pbXBvcnQgeyBjbGVhckVycm9yIH0gZnJvbSAnLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhhc0Vycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmhhc0Vycm9yLFxyXG4gICAgICAgIGVycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmVycm9ySW5mb1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNsZWFyRXJyb3I6ICgpID0+IGRpc3BhdGNoKGNsZWFyRXJyb3IoKSlcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU2hlbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgZXJyb3JWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgaGFzRXJyb3IsIGNsZWFyRXJyb3IsIGVycm9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUsIG1lc3NhZ2UgfSA9IGVycm9yO1xyXG4gICAgICAgIHJldHVybiAoaGFzRXJyb3IgP1xyXG4gICAgICAgICAgICA8RXJyb3JcclxuICAgICAgICAgICAgICAgIHRpdGxlPXt0aXRsZX1cclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U9e21lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICBjbGVhckVycm9yPXtjbGVhckVycm9yfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLXN0YXRpYy10b3BcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9cIiBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIj5JbnVwbGFuIEludHJhbmV0PC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItY29sbGFwc2UgY29sbGFwc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbmRleE5hdkxpbmsgdG89XCIvXCI+Rm9yc2lkZTwvSW5kZXhOYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPVwiL3VzZXJzXCI+QnJ1Z2VyZTwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayB0bz1cIi9hYm91dFwiPk9tPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm5hdiBuYXZiYXItdGV4dCBuYXZiYXItcmlnaHRcIj5IZWosIHtnbG9iYWxzLmN1cnJlbnRVc2VybmFtZX0hPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAge3RoaXMuZXJyb3JWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgTWFpbiA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFNoZWxsKTtcclxuZXhwb3J0IGRlZmF1bHQgTWFpbjsiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYm91dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiT21cIjtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0yIGNvbC1sZy04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERldHRlIGVyIGVuIHNpbmdsZSBwYWdlIGFwcGxpY2F0aW9uIVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgVGVrbm9sb2dpZXIgYnJ1Z3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlYWN0PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlZHV4PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlYWN0Um91dGVyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkFzcC5uZXQgQ29yZSBSQyAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkFzcC5uZXQgV2ViIEFQSSAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QsIG5vcm1hbGl6ZUxhdGVzdCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgYWRkVXNlciB9IGZyb20gJy4vdXNlcnMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkTGF0ZXN0KGxhdGVzdCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9MQVRFU1QsXHJcbiAgICAgICAgbGF0ZXN0OiBsYXRlc3RcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFNLaXAoc2tpcCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TS0lQX1dIQVRTX05FVyxcclxuICAgICAgICBza2lwOiBza2lwXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUYWtlKHRha2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVEFLRV9XSEFUU19ORVcsXHJcbiAgICAgICAgdGFrZTogdGFrZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0UGFnZShwYWdlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1BBR0VfV0hBVFNfTkVXLFxyXG4gICAgICAgIHBhZ2U6IHBhZ2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFRvdGFsUGFnZXModG90YWxQYWdlcykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UT1RBTF9QQUdFU19XSEFUU19ORVcsXHJcbiAgICAgICAgdG90YWxQYWdlczogdG90YWxQYWdlc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy53aGF0c25ldyArIFwiP3NraXA9XCIgKyBza2lwICsgXCImdGFrZT1cIiArIHRha2U7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihwYWdlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gcGFnZS5DdXJyZW50SXRlbXM7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGl0ZW0uSXRlbS5BdXRob3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYXV0aG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRVc2VyKGF1dGhvcikpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVzZXQgaW5mb1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0U0tpcChza2lwKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUYWtlKHRha2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFBhZ2UocGFnZS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxQYWdlcyhwYWdlLlRvdGFsUGFnZXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gaXRlbXMuZmlsdGVyKGl0ZW0gPT4gQm9vbGVhbihpdGVtLkl0ZW0uQXV0aG9yKSkubWFwKG5vcm1hbGl6ZUxhdGVzdCk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRMYXRlc3Qobm9ybWFsaXplZCkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdJdGVtSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnRQcm9maWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWxlZnRcIj5cclxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwibWVkaWEtb2JqZWN0XCJcclxuICAgICAgICAgICAgICAgICAgICBzcmM9XCIvaW1hZ2VzL3BlcnNvbl9pY29uLnN2Z1wiXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1ob2xkZXItcmVuZGVyZWQ9XCJ0cnVlXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogXCI2NHB4XCIsIGhlaWdodDogXCI2NHB4XCIgfX1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudFByb2ZpbGUnXHJcbmltcG9ydCB7IGZvcm1hdFRleHQsIGdldFdvcmRzIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3SXRlbUNvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yLCBpdGVtIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBmb3JtYXRUZXh0KFwiXFxcIlwiICsgZ2V0V29yZHMoaXRlbS5UZXh0LCA1KSArIFwiLi4uXCIgKyBcIlxcXCJcIik7XHJcbiAgICAgICAgY29uc3QgZnVsbG5hbWUgPSBhdXRob3IuRmlyc3ROYW1lICsgJyAnICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgICAgIHJldHVybiAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFByb2ZpbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cIm1lZGlhLWhlYWRpbmdcIj57ZnVsbG5hbWV9IDxzbWFsbD5zYWdkZTwvc21hbGw+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZW0+PHNwYW4gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3RleHR9Pjwvc3Bhbj48L2VtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFdoYXRzTmV3SXRlbUltYWdlIH0gZnJvbSAnLi9XaGF0c05ld0l0ZW1JbWFnZSdcclxuaW1wb3J0IHsgV2hhdHNOZXdJdGVtQ29tbWVudCB9IGZyb20gJy4vV2hhdHNOZXdJdGVtQ29tbWVudCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0xpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0SXRlbXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gaXRlbXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRVc2VyKGl0ZW0uQXV0aG9ySUQpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAgPFdoYXRzTmV3SXRlbUltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2l0ZW0uSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbT17aXRlbS5JdGVtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uPXtpdGVtLk9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcj17YXV0aG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxXaGF0c05ld0l0ZW1Db21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2l0ZW0uSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbT17aXRlbS5JdGVtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uPXtpdGVtLk9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcj17YXV0aG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGl0ZW1Ob2RlcyA9IHRoaXMuY29uc3RydWN0SXRlbXMoKTtcclxuICAgICAgICByZXR1cm4gIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEgcHVsbC1sZWZ0IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtpdGVtTm9kZXN9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBmZXRjaExhdGVzdE5ld3MgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3doYXRzbmV3J1xyXG5pbXBvcnQgeyBXaGF0c05ld0xpc3QgfSBmcm9tICcuLi9XaGF0c05ldy9XaGF0c05ld0xpc3QnXHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TGF0ZXN0OiAoc2tpcCwgdGFrZSkgPT4gZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXRlbXM6IHN0YXRlLndoYXRzTmV3SW5mby5pdGVtcyxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IHN0YXRlLnVzZXJzSW5mby51c2Vycy5maWx0ZXIodSA9PiB1LklEID09IGlkKVswXSxcclxuICAgICAgICBza2lwOiBzdGF0ZS53aGF0c05ld0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS53aGF0c05ld0luZm8udGFrZVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBXaGF0c05ld0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGdldExhdGVzdCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBnZXRMYXRlc3Qoc2tpcCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5TaWRzdGUgbnl0PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8V2hhdHNOZXdMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpdGVtc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VXNlcj17Z2V0VXNlcn1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFdoYXRzTmV3ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoV2hhdHNOZXdDb250YWluZXIpXHJcbmV4cG9ydCBkZWZhdWx0IFdoYXRzTmV3OyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgV2hhdHNOZXcgZnJvbSAnLi9XaGF0c05ldydcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2VyOiBzdGF0ZS51c2Vyc0luZm8udXNlcnMuZmlsdGVyKHUgPT4gdS5Vc2VybmFtZS50b1VwcGVyQ2FzZSgpID09IGdsb2JhbHMuY3VycmVudFVzZXJuYW1lLnRvVXBwZXJDYXNlKCkpWzBdLFxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBIb21lVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiRm9yc2lkZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXIsIGxhdGVzdEl0ZW1zIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB1c2VyID8gdXNlci5GaXJzdE5hbWUgOiAnVXNlcic7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0yIGNvbC1sZy04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqdW1ib3Ryb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxPlZlbGtvbW1lbiA8c21hbGw+e25hbWV9ITwvc21hbGw+PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibGVhZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGlsIEludXBsYW5zIGludHJhbmV0IHNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxXaGF0c05ldyAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEhvbWUgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoSG9tZVZpZXcpXHJcbmV4cG9ydCBkZWZhdWx0IEhvbWUiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcblxyXG5leHBvcnQgY2xhc3MgVXNlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdmFyIGVtYWlsID0gXCJtYWlsdG86XCIgKyB0aGlzLnByb3BzLmVtYWlsO1xyXG4gICAgICAgIHZhciBnYWxsZXJ5ID0gXCIvXCIgKyB0aGlzLnByb3BzLnVzZXJuYW1lICsgXCIvZ2FsbGVyeVwiO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTMgcGFuZWwgcGFuZWwtZGVmYXVsdFwiIHN0eWxlPXt7IHBhZGRpbmdUb3A6IFwiOHB4XCIsIHBhZGRpbmdCb3R0b206IFwiOHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5CcnVnZXJuYXZuPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy51c2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+Rm9ybmF2bjwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZmlyc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5FZnRlcm5hdm48L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmxhc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5FbWFpbDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17ZW1haWx9Pnt0aGlzLnByb3BzLmVtYWlsfTwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+QmlsbGVkZXI8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtnYWxsZXJ5fT5CaWxsZWRlcjwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL1VzZXInXHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgdXNlck5vZGVzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VySWQgPSBgdXNlcklkXyR7dXNlci5JRH1gO1xyXG4gICAgICAgICAgICByZXR1cm4gKDxVc2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXIuVXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkPXt1c2VyLklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZT17dXNlci5GaXJzdE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU9e3VzZXIuTGFzdE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw9e3VzZXIuRW1haWx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZVVybD17dXNlci5Qcm9maWxlSW1hZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM9e3VzZXIuUm9sZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXt1c2VySWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAvPik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHVzZXJzID0gdGhpcy51c2VyTm9kZXMoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAge3VzZXJzfVxyXG4gICAgICAgICAgICA8L2Rpdj4pXHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgZmV0Y2hVc2VycyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvdXNlcnMnXHJcbmltcG9ydCB7IFVzZXJMaXN0IH0gZnJvbSAnLi4vdXNlcnMvVXNlckxpc3QnXHJcblxyXG5jb25zdCBtYXBVc2Vyc1RvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlcnM6IHN0YXRlLnVzZXJzSW5mby51c2Vyc1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFVzZXJzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoVXNlcnMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgVXNlcnNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBcIkJydWdlcmVcIjtcclxuICAgICAgICB0aGlzLnByb3BzLmdldFVzZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0yIGNvbC1sZy04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDE+SW51cGxhbidzIDxzbWFsbD5icnVnZXJlPC9zbWFsbD48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VyTGlzdCB1c2Vycz17dXNlcnN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVXNlcnMgPSBjb25uZWN0KG1hcFVzZXJzVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2Vyc0NvbnRhaW5lcilcclxuZXhwb3J0IGRlZmF1bHQgVXNlcnNcclxuIiwi77u/aW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IG5vcm1hbGl6ZUNvbW1lbnQsIHZpc2l0Q29tbWVudHMsIHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi9lcnJvcidcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTa2lwQ29tbWVudHMgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TS0lQX0NPTU1FTlRTLFxyXG4gICAgICAgIHNraXA6IHNraXBcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0U2tpcCA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9TS0lQXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0VGFrZSA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9UQUtFXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRUYWtlQ29tbWVudHMgPSAodGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UQUtFX0NPTU1FTlRTLFxyXG4gICAgICAgIHRha2U6IHRha2VcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJyZW50UGFnZShwYWdlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0NVUlJFTlRfUEFHRSxcclxuICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VG90YWxQYWdlcyh0b3RhbFBhZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RPVEFMX1BBR0VTLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0Q29tbWVudHMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0RFRkFVTFRfQ09NTUVOVFNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VpdmVkQ29tbWVudHMoY29tbWVudHMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRUNJRVZFRF9DT01NRU5UUyxcclxuICAgICAgICBjb21tZW50czogY29tbWVudHNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cyArIFwiP2ltYWdlSWQ9XCIgKyBpbWFnZUlkICsgXCImc2tpcD1cIiArIHNraXAgKyBcIiZ0YWtlPVwiICsgdGFrZTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gVW5wcm9jZXNzZWQgY29tbWVudHNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VDb21tZW50cyA9IGRhdGEuQ3VycmVudEl0ZW1zO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCAocmUtc2V0KSBpbmZvXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwQ29tbWVudHMoc2tpcCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZUNvbW1lbnRzKHRha2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEN1cnJlbnRQYWdlKGRhdGEuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMoZGF0YS5Ub3RhbFBhZ2VzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVmlzaXQgZXZlcnkgY29tbWVudCBhbmQgYWRkIHRoZSB1c2VyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRBdXRob3IgPSAoYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFjLkRlbGV0ZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIoYy5BdXRob3IpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZpc2l0Q29tbWVudHMocGFnZUNvbW1lbnRzLCBhZGRBdXRob3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5vcm1hbGl6ZTogZmlsdGVyIG91dCB1c2VyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tZW50cyA9IHBhZ2VDb21tZW50cy5tYXAobm9ybWFsaXplQ29tbWVudCk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlZENvbW1lbnRzKGNvbW1lbnRzKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHBvc3RDb21tZW50ID0gKGltYWdlSWQsIHRleHQsIHBhcmVudENvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IGdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cztcclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgY29uc3QgYm9keSA9SlNPTi5zdHJpbmdpZnkoeyBcclxuICAgICAgICAgICAgVGV4dDogdGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogaW1hZ2VJZCxcclxuICAgICAgICAgICAgUGFyZW50SUQ6IHBhcmVudENvbW1lbnRJZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBib2R5LFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goaW5jcmVtZW50Q29tbWVudENvdW50KGltYWdlSWQpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBlZGl0Q29tbWVudCA9IChjb21tZW50SWQsIGltYWdlSWQsIHRleHQpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IGdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cyArIFwiP2ltYWdlSWQ9XCIgKyBpbWFnZUlkO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgSUQ6IGNvbW1lbnRJZCwgVGV4dDogdGV4dH0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUNvbW1lbnQgPSAoY29tbWVudElkLCBpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBnZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuY29tbWVudHMgKyBcIj9jb21tZW50SWQ9XCIgKyBjb21tZW50SWQ7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChkZWNyZW1lbnRDb21tZW50Q291bnQoaW1hZ2VJZCkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbmNyZW1lbnRDb21tZW50Q291bnQgPSAoaW1hZ2VJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULklOQ1JfQ09NTUVOVF9DT1VOVCxcclxuICAgICAgICBpbWFnZUlkOiBpbWFnZUlkXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWNyZW1lbnRDb21tZW50Q291bnQgPSAoaW1hZ2VJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkRFQ1JfQ09NTUVOVF9DT1VOVCxcclxuICAgICAgICBpbWFnZUlkOiBpbWFnZUlkXHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgeyBhZGRDb21tZW50cywgc2V0RGVmYXVsdFNraXAsIHNldERlZmF1bHRUYWtlLCBzZXREZWZhdWx0Q29tbWVudHN9IGZyb20gJy4vY29tbWVudHMnXHJcbmltcG9ydCB7IG5vcm1hbGl6ZUltYWdlLCBub3JtYWxpemVDb21tZW50IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi9lcnJvcidcclxuaW1wb3J0IHsgcmVzcG9uc2VIYW5kbGVyLCBvblJlamVjdCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRJbWFnZXNPd25lcihpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9JTUFHRVNfT1dORVIsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjaWV2ZWRVc2VySW1hZ2VzKGltYWdlcykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFQ0lFVkVEX1VTRVJfSU1BR0VTLFxyXG4gICAgICAgIGltYWdlczogaW1hZ2VzXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0U2VsZWN0ZWRJbWcgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0VMRUNURURfSU1HLFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbW92ZU1vZGFsID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKCk7XHJcbiAgICAgICAgZGlzcGF0Y2godW5zZXRTZWxlY3RlZEltZygpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXREZWZhdWx0U2tpcCgpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXREZWZhdWx0VGFrZSgpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXREZWZhdWx0Q29tbWVudHMoKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB1bnNldFNlbGVjdGVkSW1nID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlVOU0VUX1NFTEVDVEVEX0lNR1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUltYWdlKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVNT1ZFX0lNQUdFLFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFNlbGVjdGVkSW1hZ2VJZChpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9TRUxFQ1RFRF9JTUFHRV9JRCxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTZWxlY3RlZEltYWdlSWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRU1PVkVfU0VMRUNURURfSU1BR0VfSUQsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkNMRUFSX1NFTEVDVEVEX0lNQUdFX0lEU1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3REZWxldGVJbWFnZShpZCwgdXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lICsgXCImaWQ9XCIgKyBpZDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBkaXNwYXRjaChyZW1vdmVJbWFnZShpZCkpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRJbWFnZSh1c2VybmFtZSwgZm9ybURhdGEpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSksIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICBjb25zdCBvblN1Y2Nlc3MgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gZGF0YS5tYXAobm9ybWFsaXplSW1hZ2UpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChyZWNpZXZlZFVzZXJJbWFnZXMobm9ybWFsaXplZC5yZXZlcnNlKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzcywgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBpbWFnZUlkcyA9IFtdKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCBpZHMgPSBpbWFnZUlkcy5qb2luKCk7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlcyArIFwiP3VzZXJuYW1lPVwiICsgdXNlcm5hbWUgKyBcIiZpZHM9XCIgKyBpZHM7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkpLCBvblJlamVjdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZVVwbG9hZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJJbnB1dChmaWxlSW5wdXQpIHtcclxuICAgICAgICBpZihmaWxlSW5wdXQudmFsdWUpe1xyXG4gICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICBmaWxlSW5wdXQudmFsdWUgPSAnJzsgLy9mb3IgSUUxMSwgbGF0ZXN0IENocm9tZS9GaXJlZm94L09wZXJhLi4uXHJcbiAgICAgICAgICAgIH1jYXRjaChlcnIpeyB9XHJcbiAgICAgICAgICAgIGlmKGZpbGVJbnB1dC52YWx1ZSl7IC8vZm9yIElFNSB+IElFMTBcclxuICAgICAgICAgICAgICAgIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBmaWxlSW5wdXQucGFyZW50Tm9kZSwgcmVmID0gZmlsZUlucHV0Lm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChmaWxlSW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZmlsZUlucHV0LHJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmlsZXMoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIHJldHVybiAoZmlsZXMgPyBmaWxlcy5maWxlcyA6IFtdKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTdWJtaXQoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgdXBsb2FkSW1hZ2UsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCBmaWxlcyA9IHRoaXMuZ2V0RmlsZXMoKTtcclxuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBmaWxlc1tpXTtcclxuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGxvYWRJbWFnZSh1c2VybmFtZSwgZm9ybURhdGEpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgdGhpcy5jbGVhcklucHV0KGZpbGVJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQnRuKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaGFzSW1hZ2VzLCBkZWxldGVTZWxlY3RlZEltYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKGhhc0ltYWdlcyA/XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlclwiIG9uQ2xpY2s9e2RlbGV0ZVNlbGVjdGVkSW1hZ2VzfT5TbGV0IG1hcmtlcmV0IGJpbGxlZGVyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA6IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCIgb25DbGljaz17ZGVsZXRlU2VsZWN0ZWRJbWFnZXN9IGRpc2FibGVkPVwiZGlzYWJsZWRcIj5TbGV0IG1hcmtlcmV0IGJpbGxlZGVyPC9idXR0b24+KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxmb3JtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZm9ybS11cGxvYWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuY3R5cGU9XCJtdWx0aXBhcnQvZm9ybS1kYXRhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZpbGVzXCI+VXBsb2FkIGZpbGVyOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJmaWxlc1wiIG5hbWU9XCJmaWxlc1wiIG11bHRpcGxlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGlkPVwidXBsb2FkXCI+VXBsb2FkPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7J1xcdTAwQTAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZGVsZXRlQnRuKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIEJpbmQgJ3RoaXMnIHRvIGZ1bmN0aW9uc1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW1hZ2UgPSB0aGlzLnNlbGVjdEltYWdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEhhbmRsZXIgPSB0aGlzLmNoZWNrYm94SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdEltYWdlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0SW1hZ2UsIGltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHNlbGVjdEltYWdlKGltYWdlLkltYWdlSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrYm94SGFuZGxlcihlKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBhZGQgPSBlLmN1cnJlbnRUYXJnZXQuY2hlY2tlZDtcclxuICAgICAgICBpZihhZGQpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbW1lbnRJY29uKGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuICggY291bnQgPT0gMCA/XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTYgdGV4dC1tdXRlZFwiIG9uQ2xpY2s9e3RoaXMuc2VsZWN0SW1hZ2V9IHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInIH19PiBcclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tY29tbWVudFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4ge2NvdW50fVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgOlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02IHRleHQtcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMuc2VsZWN0SW1hZ2V9IHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInIH19PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1jb21tZW50XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiB7Y291bnR9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tib3hWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkLCBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjaGVja2VkID0gaW1hZ2VJc1NlbGVjdGVkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIHJldHVybiAoY2FuRWRpdCA/IFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02IHB1bGwtcmlnaHQgdGV4dC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIFNsZXQgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uQ2xpY2s9e3RoaXMuY2hlY2tib3hIYW5kbGVyfSBjaGVja2VkPXtjaGVja2VkfSAvPiBcclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGxldCBjb3VudCA9IGltYWdlLkNvbW1lbnRDb3VudDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5zZWxlY3RJbWFnZX0gc3R5bGU9e3tjdXJzb3I6IFwicG9pbnRlclwiLCB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCJ9fT5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2UuUHJldmlld1VybH0gY2xhc3NOYW1lPVwiaW1nLXRodW1ibmFpbFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLmNvbW1lbnRJY29uKGNvdW50KX0gXHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMuY2hlY2tib3hWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tICcuL0ltYWdlJ1xyXG5cclxuY29uc3QgZWxlbWVudHNQZXJSb3cgPSA0O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2VMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFycmFuZ2VBcnJheShpbWFnZXMpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSBpbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHRpbWVzID0gTWF0aC5jZWlsKGxlbmd0aCAvIGVsZW1lbnRzUGVyUm93KTtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGxldCBzdGFydCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aW1lczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0ID0gaSAqIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZW5kID4gbGVuZ3RoO1xyXG4gICAgICAgICAgICBpZihsYXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBpbWFnZXMuc2xpY2Uoc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGltYWdlcy5zbGljZShzdGFydCwgZW5kKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW1hZ2VzVmlldyhpbWFnZXMpIHtcclxuICAgICAgICBpZihpbWFnZXMubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0SW1hZ2UsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBkZWxldGVTZWxlY3RlZEltYWdlcywgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYXJyYW5nZUFycmF5KGltYWdlcyk7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHJlc3VsdC5tYXAoKHJvdywgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpbWdzID0gcm93Lm1hcCgoaW1nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTNcIiBrZXk9e2ltZy5JbWFnZUlEfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZT17aW1nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0SW1hZ2U9e3NlbGVjdEltYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZD17YWRkU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkPXtyZW1vdmVTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlzU2VsZWN0ZWQ9e2ltYWdlSXNTZWxlY3RlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgcm93SWQgPSBcInJvd0lkXCIgKyBpO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBrZXk9e3Jvd0lkfT5cclxuICAgICAgICAgICAgICAgICAgICB7aW1nc31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAge3RoaXMuaW1hZ2VzVmlldyhpbWFnZXMpfVxyXG4gICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudERlbGV0ZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbGllcywgaGFuZGxlcnMsIGNvbnN0cnVjdENvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSBjb25zdHJ1Y3RDb21tZW50cyhyZXBsaWVzLCBoYW5kbGVycyk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYSBwdWxsLWxlZnQgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWxlZnRcIiBzdHlsZT17e21pbldpZHRoOiBcIjc0cHhcIn19PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnNsZXR0ZXQ8L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgIHtyZXBseU5vZGVzfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5jb25zdCBpZHMgPSAoY29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlcGx5SWQ6IGNvbW1lbnRJZCArICdfcmVwbHknLFxyXG4gICAgICAgIGVkaXRJZDogY29tbWVudElkICsgJ19lZGl0JyxcclxuICAgICAgICBkZWxldGVJZDogY29tbWVudElkICsgJ19kZWxldGUnLFxyXG4gICAgICAgIGVkaXRDb2xsYXBzZTogY29tbWVudElkICsgJ19lZGl0Q29sbGFwc2UnLFxyXG4gICAgICAgIHJlcGx5Q29sbGFwc2U6IGNvbW1lbnRJZCArICdfcmVwbHlDb2xsYXBzZSdcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Q29udHJvbHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGV4dDogcHJvcHMudGV4dCxcclxuICAgICAgICAgICAgcmVwbHk6ICcnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0ID0gdGhpcy5lZGl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZXBseSA9IHRoaXMucmVwbHkuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlID0gdGhpcy5oYW5kbGVSZXBseUNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGVkaXQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0SGFuZGxlLCBjb21tZW50SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdENvbGxhcHNlIH0gPSBpZHMoY29tbWVudElkKTtcclxuXHJcbiAgICAgICAgZWRpdEhhbmRsZShjb21tZW50SWQsIHRleHQpO1xyXG4gICAgICAgICQoXCIjXCIgKyBlZGl0Q29sbGFwc2UpLmNvbGxhcHNlKCdoaWRlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbHkoKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSwgY29tbWVudElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHkgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUNvbGxhcHNlIH0gPSBpZHMoY29tbWVudElkKTtcclxuXHJcbiAgICAgICAgcmVwbHlIYW5kbGUoY29tbWVudElkLCByZXBseSk7XHJcbiAgICAgICAgJChcIiNcIiArIHJlcGx5Q29sbGFwc2UpLmNvbGxhcHNlKCdoaWRlJyk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5OiAnJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93VG9vbHRpcChpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYnRuID0gXCIjXCIgKyBjb21tZW50SWQgKyBcIl9cIiArIGl0ZW07XHJcbiAgICAgICAgJChidG4pLnRvb2x0aXAoJ3Nob3cnKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlUmVwbHlDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXBseTogZS50YXJnZXQudmFsdWUgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBjb21tZW50SWQsIGNhbkVkaXQsIGRlbGV0ZUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGVkaXRDb2xsYXBzZSwgcmVwbHlDb2xsYXBzZSwgcmVwbHlJZCwgZWRpdElkLCBkZWxldGVJZCB9ID0gaWRzKGNvbW1lbnRJZCk7XHJcbiAgICAgICAgY29uc3QgZWRpdFRhcmdldCA9IFwiI1wiICsgZWRpdENvbGxhcHNlO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5VGFyZ2V0ID0gXCIjXCIgKyByZXBseUNvbGxhcHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBjYW5FZGl0ID9cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4JywgcGFkZGluZ0xlZnQ6IFwiMTVweFwifX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtkZWxldGVIYW5kbGUuYmluZChudWxsLCBjb21tZW50SWQpfSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ2RlbGV0ZScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2RlbGV0ZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiU2xldFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsYWJlbCBsYWJlbC1kYW5nZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXRyYXNoXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPnsnXFx1MDBBMCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17ZWRpdFRhcmdldH0gc3R5bGU9e3sgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdlZGl0Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17ZWRpdElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiw4ZuZHJlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBlbmNpbFwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj57J1xcdTAwQTAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ3JlcGx5Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17cmVwbHlJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlN2YXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtcHJpbWFyeVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tZW52ZWxvcGVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17e3BhZGRpbmdCb3R0b206ICc1cHgnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwIGNvbGxhcHNlXCIgaWQ9e2VkaXRDb2xsYXBzZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS50ZXh0fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVUZXh0Q2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7dGV4dDogdGV4dH0pfSBkYXRhLXRhcmdldD17ZWRpdFRhcmdldH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4taW5mb1wiIG9uQ2xpY2s9e3RoaXMuZWRpdH0+R2VtIMOmbmRyaW5nZXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctMTAgY29sbGFwc2VcIiBpZD17cmVwbHlDb2xsYXBzZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS5yZXBseX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVwbHlDaGFuZ2V9IHJvd3M9XCI0XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17cmVwbHlUYXJnZXR9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiPkx1azwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWluZm9cIiBvbkNsaWNrPXt0aGlzLnJlcGx5fT5TdmFyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+IDogXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7cGFkZGluZ0JvdHRvbTogJzVweCcsIHBhZGRpbmdMZWZ0OiAnMTVweCd9fT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17cmVwbHlUYXJnZXR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdyZXBseScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e3JlcGx5SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTdmFyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXByaW1hcnlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwIGNvbGxhcHNlXCIgaWQ9e3JlcGx5Q29sbGFwc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUucmVwbHl9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1pbmZvXCIgb25DbGljaz17dGhpcy5yZXBseX0+U3ZhcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50Q29udHJvbHMgfSBmcm9tICcuL0NvbW1lbnRDb250cm9scydcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tICcuL0NvbW1lbnRQcm9maWxlJ1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudElkLCBwb3N0ZWRPbiwgYXV0aG9ySWQsIHRleHQsIHJlcGxpZXMsIGhhbmRsZXJzLCBjb25zdHJ1Y3RDb21tZW50cyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHJlcGx5SGFuZGxlLCBlZGl0SGFuZGxlLCBkZWxldGVIYW5kbGUsIGNhbkVkaXQsIGdldFVzZXIgfSA9IGhhbmRsZXJzO1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IGdldFVzZXIoYXV0aG9ySWQpO1xyXG4gICAgICAgIGNvbnN0IGZ1bGxuYW1lID0gYXV0aG9yLkZpcnN0TmFtZSArIFwiIFwiICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgICAgIGNvbnN0IGNhbkVkaXRWYWwgPSBjYW5FZGl0KGF1dGhvcklkKTtcclxuICAgICAgICBjb25zdCByZXBseU5vZGVzID0gY29uc3RydWN0Q29tbWVudHMocmVwbGllcywgaGFuZGxlcnMpO1xyXG4gICAgICAgIGNvbnN0IHR4dCA9IGZvcm1hdFRleHQodGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEgcHVsbC1sZWZ0IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50UHJvZmlsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwibWVkaWEtaGVhZGluZ1wiPjxzdHJvbmc+e2Z1bGxuYW1lfTwvc3Ryb25nPiA8UG9zdGVkT24gcG9zdGVkT249e3Bvc3RlZE9ufSAvPjwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt0eHR9Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRDb250cm9sc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdFZhbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRJZD17Y29tbWVudElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlSGFuZGxlPXtkZWxldGVIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0SGFuZGxlPXtlZGl0SGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbHlIYW5kbGU9e3JlcGx5SGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17dGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3JlcGx5Tm9kZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFBvc3RlZE9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFnbygpIHtcclxuICAgICAgICBjb25zdCB7IHBvc3RlZE9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGFnbyA9IG1vbWVudChwb3N0ZWRPbikuZnJvbU5vdygpO1xyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBtb21lbnQoKS5kaWZmKHBvc3RlZE9uLCAnaG91cnMnLCB0cnVlKTtcclxuICAgICAgICBpZiAoZGlmZiA+PSAxMi41KSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gbW9tZW50KHBvc3RlZE9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZC4gXCIgKyBkYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyBkYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gXCJmb3IgXCIgKyBhZ287XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoPHNtYWxsPnNhZ2RlIHt0aGlzLmFnbygpfTwvc21hbGw+KTtcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IENvbW1lbnREZWxldGVkIH0gZnJvbSAnLi9Db21tZW50RGVsZXRlZCdcclxuaW1wb3J0IHsgQ29tbWVudCB9IGZyb20gJy4vQ29tbWVudCdcclxuXHJcbmNvbnN0IGNvbXBhY3RIYW5kbGVycyA9IChyZXBseUhhbmRsZSwgZWRpdEhhbmRsZSwgZGVsZXRlSGFuZGxlLCBjYW5FZGl0LCBnZXRVc2VyKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlcGx5SGFuZGxlLFxyXG4gICAgICAgIGVkaXRIYW5kbGUsXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlLFxyXG4gICAgICAgIGNhbkVkaXQsXHJcbiAgICAgICAgZ2V0VXNlclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudExpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0Q29tbWVudHMoY29tbWVudHMsIGhhbmRsZXJzKSB7XHJcbiAgICAgICAgaWYgKCFjb21tZW50cyB8fCBjb21tZW50cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICByZXR1cm4gY29tbWVudHMubWFwKChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IFwiY29tbWVudElkXCIgKyBjb21tZW50LkNvbW1lbnRJRDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb21tZW50LkRlbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYVwiIGtleT17a2V5fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnREZWxldGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtrZXl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxpZXM9e2NvbW1lbnQuUmVwbGllc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVycz17aGFuZGxlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0Q29tbWVudHM9e2NvbnN0cnVjdENvbW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYVwiIGtleT17a2V5fT5cclxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17a2V5fSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0ZWRPbj17Y29tbWVudC5Qb3N0ZWRPbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3JJZD17Y29tbWVudC5BdXRob3JJRH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e2NvbW1lbnQuVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsaWVzPXtjb21tZW50LlJlcGxpZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudElkPXtjb21tZW50LkNvbW1lbnRJRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVycz17aGFuZGxlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0Q29tbWVudHM9e2NvbnN0cnVjdENvbW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudHMsIHJlcGx5SGFuZGxlLCBlZGl0SGFuZGxlLCBkZWxldGVIYW5kbGUsIGNhbkVkaXQsIGdldFVzZXIsIHVzZXJJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBoYW5kbGVycyA9IGNvbXBhY3RIYW5kbGVycyhyZXBseUhhbmRsZSwgZWRpdEhhbmRsZSwgZGVsZXRlSGFuZGxlLCBjYW5FZGl0LCBnZXRVc2VyKTtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMuY29uc3RydWN0Q29tbWVudHMoY29tbWVudHMsIGhhbmRsZXJzKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAge25vZGVzfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhZ2luYXRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcHJldlZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjdXJyZW50UGFnZSwgcHJldiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBoYXNQcmV2ID0gIShjdXJyZW50UGFnZSA9PT0gMSk7XHJcbiAgICAgICAgaWYgKGhhc1ByZXYpXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgb25DbGljaz17cHJldn0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JmxhcXVvOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT4pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJkaXNhYmxlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZsYXF1bzs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBjdXJyZW50UGFnZSwgbmV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBoYXNOZXh0ID0gISh0b3RhbFBhZ2VzID09PSBjdXJyZW50UGFnZSkgJiYgISh0b3RhbFBhZ2VzID09PSAwKTtcclxuICAgICAgICBpZihoYXNOZXh0KVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGFyaWEtbGFiZWw9XCJOZXh0XCIgb25DbGljaz17bmV4dH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnJhcXVvOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT4pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJkaXNhYmxlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZyYXF1bzs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG90YWxQYWdlcywgaW1hZ2VJZCwgY3VycmVudFBhZ2UsIGdldFBhZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbGV0IHBhZ2VzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gdG90YWxQYWdlczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IFwicGFnZV9pdGVtX1wiICsgKGltYWdlSWQgKyBpKTtcclxuICAgICAgICAgICAgaWYgKGkgPT09IGN1cnJlbnRQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKDxsaSBjbGFzc05hbWU9XCJhY3RpdmVcIiBrZXk9e2tleX0+PGEgaHJlZj1cIiNcIiBrZXk9e2tleSB9PntpfTwvYT48L2xpPik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKDxsaSBrZXk9e2tleSB9IG9uQ2xpY2s9e2dldFBhZ2UuYmluZChudWxsLCBpKX0+PGEgaHJlZj1cIiNcIiBrZXk9e2tleSB9PntpfTwvYT48L2xpPik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3cgPSAocGFnZXMubGVuZ3RoID4gMCk7XHJcblxyXG4gICAgICAgIHJldHVybihcclxuICAgICAgICAgICAgc2hvdyA/XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctOVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxuYXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwicGFnaW5hdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByZXZWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3BhZ2VzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLm5leHRWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbmF2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnRGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIFRleHQ6ICcnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3N0Q29tbWVudCA9IHRoaXMucG9zdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0Q29tbWVudChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHBvc3RIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcG9zdEhhbmRsZSh0aGlzLnN0YXRlLlRleHQpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUZXh0OiAnJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGV4dDogZS50YXJnZXQudmFsdWUgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMucG9zdENvbW1lbnR9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJyZW1hcmtcIj5Lb21tZW50YXI8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRleHRDaGFuZ2V9IHZhbHVlPXt0aGlzLnN0YXRlLlRleHR9IHBsYWNlaG9sZGVyPVwiU2tyaXYga29tbWVudGFyIGhlci4uLlwiIGlkPVwicmVtYXJrXCIgcm93cz1cIjRcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIj5TZW5kPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBmZXRjaENvbW1lbnRzLCBwb3N0Q29tbWVudCwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2NvbW1lbnRzJ1xyXG5pbXBvcnQgeyBDb21tZW50TGlzdCB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRMaXN0J1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSAnLi4vY29tbWVudHMvUGFnaW5hdGlvbidcclxuaW1wb3J0IHsgQ29tbWVudEZvcm0gfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50Rm9ybSdcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbWFnZUlkOiBzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCxcclxuICAgICAgICBza2lwOiBzdGF0ZS5jb21tZW50c0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5jb21tZW50c0luZm8udGFrZSxcclxuICAgICAgICBwYWdlOiBzdGF0ZS5jb21tZW50c0luZm8ucGFnZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS5jb21tZW50c0luZm8udG90YWxQYWdlcyxcclxuICAgICAgICBjb21tZW50czogc3RhdGUuY29tbWVudHNJbmZvLmNvbW1lbnRzLFxyXG4gICAgICAgIGdldFVzZXI6IChpZCkgPT4gZmluZChzdGF0ZS51c2Vyc0luZm8udXNlcnMsICh1KSA9PiB1LklEID09IGlkKSxcclxuICAgICAgICBjYW5FZGl0OiAodXNlcklkKSA9PiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZCA9PSB1c2VySWQsXHJcbiAgICAgICAgdXNlcklkOiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZFxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzOiAoaW1hZ2VJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RSZXBseTogKGltYWdlSWQsIHJlcGx5SWQsIHRleHQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQoaW1hZ2VJZCwgdGV4dCwgcmVwbHlJZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdENvbW1lbnQ6IChpbWFnZUlkLCB0ZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KGltYWdlSWQsIHRleHQsIG51bGwpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVkaXRDb21tZW50OiAoaW1hZ2VJZCwgY29tbWVudElkLCB0ZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGVkaXRDb21tZW50KGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlQ29tbWVudDogKGltYWdlSWQsIGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVDb21tZW50KGNvbW1lbnRJZCwgaW1hZ2VJZCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ29tbWVudHNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5uZXh0UGFnZSA9IHRoaXMubmV4dFBhZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmdldFBhZ2UgPSB0aGlzLmdldFBhZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUGFnZSA9IHRoaXMucHJldmlvdXNQYWdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dFBhZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGltYWdlSWQsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgc2tpcE5leHQgPSBza2lwICsgdGFrZTtcclxuICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcE5leHQsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhZ2UocGFnZSkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBpbWFnZUlkLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHBhZ2UgLSAxO1xyXG4gICAgICAgIGNvbnN0IHNraXBJdGVtcyA9IChza2lwUGFnZXMgKiB0YWtlKTtcclxuICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcEl0ZW1zLCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmV2aW91c1BhZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGltYWdlSWQsIHNraXAsIHRha2V9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBiYWNrU2tpcCA9IHNraXAgLSB0YWtlO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBiYWNrU2tpcCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGltYWdlSWQsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRzLCBwb3N0UmVwbHksIGVkaXRDb21tZW50LCBwb3N0Q29tbWVudCxcclxuICAgICAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQsIGNhbkVkaXQsIGdldFVzZXIsXHJcbiAgICAgICAgICAgICAgICB1c2VySWQsIGltYWdlSWQsIHBhZ2UsIHRvdGFsUGFnZXMgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudExpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzPXtjb21tZW50c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGx5SGFuZGxlPXtwb3N0UmVwbHkuYmluZChudWxsLCBpbWFnZUlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRIYW5kbGU9e2VkaXRDb21tZW50LmJpbmQobnVsbCwgaW1hZ2VJZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVIYW5kbGU9e2RlbGV0ZUNvbW1lbnQuYmluZChudWxsLCBpbWFnZUlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRVc2VyPXtnZXRVc2VyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8UGFnaW5hdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VJZD17aW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlPXtwYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlcz17dG90YWxQYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQ9e3RoaXMubmV4dFBhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2PXt0aGlzLnByZXZpb3VzUGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFBhZ2U9e3RoaXMuZ2V0UGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudEZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RIYW5kbGU9e3Bvc3RDb21tZW50LmJpbmQobnVsbCwgaW1hZ2VJZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IENvbW1lbnRzID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoQ29tbWVudHNDb250YWluZXIpOyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcclxuaW1wb3J0IHsgQ29tbWVudHMgfSBmcm9tICcuLi9jb250YWluZXJzL0NvbW1lbnRzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kYWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVJbWFnZSA9IHRoaXMuZGVsZXRlSW1hZ2UuYmluZCh0aGlzKTsgXHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZXNlbGVjdEltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkub24oJ2hpZGUuYnMubW9kYWwnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBkZXNlbGVjdEltYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSW1hZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVJbWFnZSwgaW1hZ2UsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGlkID0gaW1hZ2UuSW1hZ2VJRDtcclxuXHJcbiAgICAgICAgZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKTtcclxuICAgICAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUltYWdlVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgY2FuRWRpdCA/XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5kZWxldGVJbWFnZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgU2xldCBiaWxsZWRlXHJcbiAgICAgICAgICAgIDwvYnV0dG9uPiA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgSW1hZ2VJRCwgRmlsZW5hbWUsIFByZXZpZXdVcmwsIEV4dGVuc2lvbiwgT3JpZ2luYWxVcmwsIFVwbG9hZGVkIH0gPSBpbWFnZTtcclxuICAgICAgICBjb25zdCBuYW1lID0gRmlsZW5hbWUgKyBcIi5cIiArIEV4dGVuc2lvbjtcclxuICAgICAgICBjb25zdCB1cGxvYWREYXRlID0gbW9tZW50KFVwbG9hZGVkKTtcclxuICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gXCJVcGxvYWRlZCBkLiBcIiArIHVwbG9hZERhdGUuZm9ybWF0KFwiRCBNTU0gWVlZWSBcIikgKyBcImtsLiBcIiArIHVwbG9hZERhdGUuZm9ybWF0KFwiSDptbVwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZyBtb2RhbC1sZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJtb2RhbC10aXRsZSB0ZXh0LWNlbnRlclwiPntuYW1lfTxzcGFuPjxzbWFsbD4gLSB7ZGF0ZVN0cmluZ308L3NtYWxsPjwvc3Bhbj48L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtPcmlnaW5hbFVybH0gdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJpbWctcmVzcG9uc2l2ZSBjZW50ZXItYmxvY2tcIiBzcmM9e1ByZXZpZXdVcmx9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRzIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmRlbGV0ZUltYWdlVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeydcXHUwMEEwJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IGZldGNoVXNlckltYWdlcywgc2V0U2VsZWN0ZWRJbWcsIHJlbW92ZU1vZGFsLCByZXF1ZXN0RGVsZXRlSW1hZ2UsIHVwbG9hZEltYWdlLCBhZGRTZWxlY3RlZEltYWdlSWQsICBkZWxldGVJbWFnZXMsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCwgY2xlYXJTZWxlY3RlZEltYWdlSWRzIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9pbWFnZXMnXHJcbmltcG9ydCB7IEVycm9yIH0gZnJvbSAnLi9FcnJvcidcclxuaW1wb3J0IHsgSW1hZ2VVcGxvYWQgfSBmcm9tICcuLi9pbWFnZXMvSW1hZ2VVcGxvYWQnXHJcbmltcG9ydCBJbWFnZUxpc3QgZnJvbSAnLi4vaW1hZ2VzL0ltYWdlTGlzdCdcclxuaW1wb3J0IE1vZGFsIGZyb20gJy4uL2ltYWdlcy9Nb2RhbCdcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW1hZ2VzOiBzdGF0ZS5pbWFnZXNJbmZvLmltYWdlcyxcclxuICAgICAgICBjYW5FZGl0OiAodXNlcm5hbWUpID0+IGdsb2JhbHMuY3VycmVudFVzZXJuYW1lID09IHVzZXJuYW1lLFxyXG4gICAgICAgIGdldFVzZXI6ICh1c2VybmFtZSkgPT4gc3RhdGUudXNlcnNJbmZvLnVzZXJzLmZpbHRlcih1ID0+IHUuVXNlcm5hbWUudG9VcHBlckNhc2UoKSA9PSB1c2VybmFtZS50b1VwcGVyQ2FzZSgpKVswXSxcclxuICAgICAgICBzZWxlY3RlZEltYWdlSWQ6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgICAgIHNlbGVjdGVkSW1hZ2VJZHM6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkc1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9hZEltYWdlczogKHVzZXJuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2U6IChpZCwgdXNlcm5hbWUpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVxdWVzdERlbGV0ZUltYWdlKGlkLCB1c2VybmFtZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBsb2FkSW1hZ2U6ICh1c2VybmFtZSwgZm9ybURhdGEpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2godXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRTZWxlY3RlZEltYWdlOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc2VsZWN0SW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVtb3ZlTW9kYWwoKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChhZGRTZWxlY3RlZEltYWdlSWQoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlbW92ZVNlbGVjdGVkSW1hZ2VJZChpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2VzOiAodXNlcm5hbWUsIGlkcykgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVJbWFnZXModXNlcm5hbWUsIGlkcykpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYXJTZWxlY3RlZEltYWdlSWRzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJJbWFnZXNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZUlzU2VsZWN0ZWQgPSB0aGlzLmltYWdlSXNTZWxlY3RlZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMgPSB0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGVkID0gdGhpcy5jbGVhclNlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkSW1hZ2VzLCByb3V0ZXIsIHJvdXRlIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByb3V0ZXIuc2V0Um91dGVMZWF2ZUhvb2socm91dGUsIHRoaXMuY2xlYXJTZWxlY3RlZCk7XHJcbiAgICAgICAgbG9hZEltYWdlcyh1c2VybmFtZSk7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB1c2VybmFtZSArIFwiJ3MgYmlsbGVkZXJcIjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNlbGVjdGVkKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xlYXJTZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEltYWdlKGlkKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBpbWFnZXMuZmlsdGVyKGltZyA9PiBpbWcuSW1hZ2VJRCA9PSBpZClbMF07XHJcbiAgICAgICAgcmV0dXJuIGltYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIGltYWdlSXNTZWxlY3RlZChjaGVja0lkKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGZpbmQoc2VsZWN0ZWRJbWFnZUlkcywgKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZCA9PSBjaGVja0lkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlU2VsZWN0ZWRJbWFnZXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZEltYWdlSWRzLCBkZWxldGVJbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBzZWxlY3RlZEltYWdlSWRzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGxvYWRWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgdXBsb2FkSW1hZ2UsIHNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3Qgc2hvd1VwbG9hZCA9IGNhbkVkaXQodXNlcm5hbWUpO1xyXG4gICAgICAgIGNvbnN0IGhhc0ltYWdlcyA9IHNlbGVjdGVkSW1hZ2VJZHMubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgc2hvd1VwbG9hZCA/IFxyXG4gICAgICAgICAgICA8SW1hZ2VVcGxvYWRcclxuICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlPXt1cGxvYWRJbWFnZX1cclxuICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgICAgICAgIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzPXt0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzfVxyXG4gICAgICAgICAgICAgICAgaGFzSW1hZ2VzPXtoYXNJbWFnZXN9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kYWxWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0ZWRJbWFnZUlkLCBjYW5FZGl0LCBkZXNlbGVjdEltYWdlLCBkZWxldGVJbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGVjdGVkSW1hZ2VJZCA+IDA7XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSAoKSA9PiB0aGlzLmdldEltYWdlKHNlbGVjdGVkSW1hZ2VJZCk7XHJcbiAgICAgICAgcmV0dXJuIChzZWxlY3RlZCA/IFxyXG4gICAgICAgICAgICA8TW9kYWxcclxuICAgICAgICAgICAgICAgIGltYWdlPXtpbWFnZSgpfVxyXG4gICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdCh1c2VybmFtZSl9XHJcbiAgICAgICAgICAgICAgICBkZXNlbGVjdEltYWdlPXtkZXNlbGVjdEltYWdlfVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlSW1hZ2U9e2RlbGV0ZUltYWdlfVxyXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IGltYWdlcywgZ2V0VXNlciwgc2V0U2VsZWN0ZWRJbWFnZSwgY2FuRWRpdCwgYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IGdldFVzZXIodXNlcm5hbWUpO1xyXG4gICAgICAgIGxldCBmdWxsTmFtZSA9IHVzZXIgPyB1c2VyLkZpcnN0TmFtZSArIFwiIFwiICsgdXNlci5MYXN0TmFtZSA6ICdVc2VyJztcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTIgY29sLWxnLThcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDE+PHNwYW4gY2xhc3NOYW1lPVwidGV4dC1jYXBpdGFsaXplXCI+e2Z1bGxOYW1lLnRvTG93ZXJDYXNlKCl9J3M8L3NwYW4+IDxzbWFsbD5iaWxsZWRlIGdhbGxlcmk8L3NtYWxsPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPEltYWdlTGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZXM9e2ltYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0SW1hZ2U9e3NldFNlbGVjdGVkSW1hZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXQodXNlcm5hbWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ9e2FkZFNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkPXtyZW1vdmVTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSXNTZWxlY3RlZD17dGhpcy5pbWFnZUlzU2VsZWN0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5tb2RhbFZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy51cGxvYWRWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVXNlckltYWdlc1JlZHV4ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlckltYWdlc0NvbnRhaW5lcik7XHJcbmNvbnN0IFVzZXJJbWFnZXMgPSB3aXRoUm91dGVyKFVzZXJJbWFnZXNSZWR1eCk7XHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJJbWFnZXM7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xyXG5pbXBvcnQgeyBjb25uZWN0LCBQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4vc3RvcmVzL3N0b3JlJ1xyXG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlLCBJbmRleFJvdXRlLCBicm93c2VySGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgZmV0Y2hDdXJyZW50VXNlciB9IGZyb20gJy4vYWN0aW9ucy91c2VycydcclxuaW1wb3J0IE1haW4gZnJvbSAnLi9jb21wb25lbnRzL01haW4nXHJcbmltcG9ydCBBYm91dCBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9BYm91dCdcclxuaW1wb3J0IEhvbWUgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvSG9tZSdcclxuaW1wb3J0IFVzZXJzIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJzJ1xyXG5pbXBvcnQgVXNlckltYWdlcyBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzJ1xyXG5cclxuc3RvcmUuZGlzcGF0Y2goZmV0Y2hDdXJyZW50VXNlcihnbG9iYWxzLmN1cnJlbnRVc2VybmFtZSkpO1xyXG5tb21lbnQubG9jYWxlKCdkYScpO1xyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICAgICAgPFJvdXRlciBoaXN0b3J5PXticm93c2VySGlzdG9yeX0+XHJcbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGNvbXBvbmVudD17TWFpbn0+XHJcbiAgICAgICAgICAgICAgICA8SW5kZXhSb3V0ZSBjb21wb25lbnQ9e0hvbWV9IC8+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cInVzZXJzXCIgY29tcG9uZW50PXtVc2Vyc30gLz5cclxuICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiYWJvdXRcIiBjb21wb25lbnQ9e0Fib3V0fSAvPlxyXG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCI6dXNlcm5hbWUvZ2FsbGVyeVwiIGNvbXBvbmVudD17VXNlckltYWdlc30gLz5cclxuICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICA8L1JvdXRlcj5cclxuICAgIDwvUHJvdmlkZXI+LFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSk7XHJcbiJdLCJuYW1lcyI6WyJjb25zdCIsIlQuU0VUX0VSUk9SX1RJVExFIiwiVC5DTEVBUl9FUlJPUl9USVRMRSIsIlQuU0VUX0VSUk9SX01FU1NBR0UiLCJULkNMRUFSX0VSUk9SX01FU1NBR0UiLCJULlNFVF9IQVNfRVJST1IiLCJsZXQiLCJULkFERF9VU0VSIiwiVC5SRUNJRVZFRF9VU0VSUyIsIlQuU0VUX0NVUlJFTlRfVVNFUl9JRCIsImNvbWJpbmVSZWR1Y2VycyIsIlQuU0VUX0lNQUdFU19PV05FUiIsIlQuUkVDSUVWRURfVVNFUl9JTUFHRVMiLCJULlJFTU9WRV9JTUFHRSIsIlQuSU5DUl9DT01NRU5UX0NPVU5UIiwiVC5ERUNSX0NPTU1FTlRfQ09VTlQiLCJULlNFVF9TRUxFQ1RFRF9JTUciLCJULlVOU0VUX1NFTEVDVEVEX0lNRyIsIlQuQUREX1NFTEVDVEVEX0lNQUdFX0lEIiwiVC5SRU1PVkVfU0VMRUNURURfSU1BR0VfSUQiLCJmaWx0ZXIiLCJULkNMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyIsIlQuUkVDSUVWRURfQ09NTUVOVFMiLCJULlNFVF9ERUZBVUxUX0NPTU1FTlRTIiwiVC5TRVRfU0tJUF9DT01NRU5UUyIsIlQuU0VUX0RFRkFVTFRfU0tJUCIsIlQuU0VUX1RBS0VfQ09NTUVOVFMiLCJULlNFVF9ERUZBVUxUX1RBS0UiLCJULlNFVF9DVVJSRU5UX1BBR0UiLCJULlNFVF9UT1RBTF9QQUdFUyIsIm1lc3NhZ2UiLCJza2lwIiwiVC5TRVRfU0tJUF9XSEFUU19ORVciLCJ0YWtlIiwiVC5TRVRfVEFLRV9XSEFUU19ORVciLCJwYWdlIiwiVC5TRVRfUEFHRV9XSEFUU19ORVciLCJ0b3RhbFBhZ2VzIiwiVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXIiwiVC5BRERfTEFURVNUIiwiY3JlYXRlU3RvcmUiLCJhcHBseU1pZGRsZXdhcmUiLCJzdXBlciIsIkxpbmsiLCJJbmRleExpbmsiLCJjb25uZWN0IiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwibWFwU3RhdGVUb1Byb3BzIiwic2V0VG90YWxQYWdlcyIsInJvdyIsInRoaXMiLCJmaW5kIiwid2l0aFJvdXRlciIsIlByb3ZpZGVyIiwiUm91dGVyIiwiYnJvd3Nlckhpc3RvcnkiLCJSb3V0ZSIsIkluZGV4Um91dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLEFBQU9BLElBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFDbkQsQUFBT0EsSUFBTSxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQztBQUN2RCxBQUFPQSxJQUFNLFlBQVksR0FBRyxjQUFjLENBQUM7QUFDM0MsQUFBT0EsSUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQztBQUNuRCxBQUFPQSxJQUFNLG9CQUFvQixHQUFHLHNCQUFzQixDQUFDO0FBQzNELEFBQU9BLElBQU0scUJBQXFCLEdBQUcsdUJBQXVCLENBQUM7QUFDN0QsQUFBT0EsSUFBTSx3QkFBd0IsR0FBRywwQkFBMEIsQ0FBQztBQUNuRSxBQUFPQSxJQUFNLHdCQUF3QixHQUFHLDBCQUEwQixDQUFDOzs7QUFHbkUsQUFBT0EsSUFBTSxtQkFBbUIsR0FBRyxxQkFBcUIsQ0FBQztBQUN6RCxBQUFPQSxJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUM7QUFDbkMsQUFDQSxBQUFPQSxJQUFNLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQzs7O0FBRy9DLEFBQU9BLElBQU0saUJBQWlCLEdBQUcsbUJBQW1CLENBQUM7QUFDckQsQUFBT0EsSUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQztBQUNuRCxBQUFPQSxJQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztBQUNqRCxBQUFPQSxJQUFNLGlCQUFpQixHQUFHLG1CQUFtQixDQUFDO0FBQ3JELEFBQU9BLElBQU0saUJBQWlCLEdBQUcsbUJBQW1CLENBQUM7QUFDckQsQUFBT0EsSUFBTSxrQkFBa0IsR0FB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