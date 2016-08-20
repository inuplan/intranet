'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var ReactDOM = _interopDefault(require('react-dom'));
var reactRedux = require('react-redux');
var redux = require('redux');
var thunk = _interopDefault(require('redux-thunk'));
var underscore = require('underscore');
var marked = _interopDefault(require('marked'));
var removeMd = _interopDefault(require('remove-markdown'));
var reactRouter = require('react-router');
var fetch = _interopDefault(require('isomorphic-fetch'));
var reactBootstrap = require('react-bootstrap');

// Image actions
var SET_SELECTED_IMG = 'SET_SELECTED_IMG';
var ADD_IMAGE = 'ADD_IMAGE';
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
            Text: comment.Text,
            ImageID: comment.ImageID,
            ImageUploadedBy: comment.ImageUploadedBy
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
    if(!text) return "";
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
            return action.id || state;
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
            return action.id || state;
        default:
            return state;
    }
}

var images = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case ADD_IMAGE:
            return union(state, [action.image], function (img1, img2) { return img1.ImageID == img2.ImageID; });
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
            return action.id || state;
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
            return action.comments || state;
        default:
            return state;
    }
}

var skip = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_SKIP_COMMENTS:
            return action.skip || state;
        default:
            return state;
    }
}

var take = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case SET_TAKE_COMMENTS:
            return action.take || state;
        default:
            return state;
    }
}

var page = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_CURRENT_PAGE:
            return action.page || state;
        default:
            return state;
    }
}

var totalPages = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_TOTAL_PAGES:
            return action.totalPages || state;
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
            return action.title || state;
        default:
            return state;
    }
}

var message$1 = function (state, action) {
    if ( state === void 0 ) state = "";

    switch (action.type) {
        case SET_ERROR_MESSAGE:
            return action.message || state;
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
            return action.hasError || state;
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
            return action.skip || state;
        default:
            return state;
    }
}

var take$1 = function (state, action) {
    if ( state === void 0 ) state = 10;

    switch (action.type) {
        case SET_TAKE_WHATS_NEW:
            return action.take || state;
        default:
            return state;
    }
}

var page$1 = function (state, action) {
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_PAGE_WHATS_NEW:
            return action.page || state;
        default:
            return state;
    }
}

var totalPages$1 = function (state, action) {
    if ( state === void 0 ) state = 0;

    switch (action.type) {
        case SET_TOTAL_PAGES_WHATS_NEW:
            return action.totalPages || state;
        default:
            return state;
    }
}

var items = function (state, action) {
    if ( state === void 0 ) state = [];

    switch (action.type) {
        case ADD_LATEST:
            return action.latest || state;
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

var Error$1 = (function (superclass) {
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
            React.createElement( Error$1, {
                title: title, message: message, clearError: clearError })
            : null);
    };

    Shell.prototype.render = function render () {
        return  React.createElement( reactBootstrap.Grid, { fluid: true }, 
                    React.createElement( reactBootstrap.Navbar, null, 
                        React.createElement( reactBootstrap.Navbar.Header, null, 
                            React.createElement( reactBootstrap.Navbar.Brand, null, 
                                React.createElement( reactRouter.Link, { to: "/", className: "navbar-brand" }, "Inuplan Intranet")
                            ), 
                            React.createElement( reactBootstrap.Navbar.Toggle, null )
                        ), 

                        React.createElement( reactBootstrap.Navbar.Collapse, null, 
                            React.createElement( reactBootstrap.Nav, null, 
                                React.createElement( IndexNavLink, { to: "/" }, "Forside"), 
                                React.createElement( NavLink, { to: "/users" }, "Brugere"), 
                                React.createElement( NavLink, { to: "/about" }, "Om")                                
                            ), 
                            React.createElement( reactBootstrap.Navbar.Text, { pullRight: true }, "Hej, ", globals.currentUsername, "!")
                        )

                    ), 
                        this.errorView(), 
                        this.props.children
                )
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

    WhatsNewItemComment.prototype.createSummary = function createSummary () {
        var ref = this.props;
        var text = ref.text;
        return formatText("\"" + getWords(text, 5) + "..." + "\"");
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
        var author = this.fullname();
        var summary = this.createSummary();
        var linkToImage = uploadedBy.Username + "/gallery/image/" + imageId;
        return  React.createElement( 'div', null, 
                    React.createElement( CommentProfile, null ), 
                    React.createElement( 'div', { className: "media-body" }, 
                        React.createElement( 'h5', { className: "media-heading" }, author, " ", React.createElement( 'small', null, this.when() )), 
                            React.createElement( 'em', null, React.createElement( 'span', { dangerouslySetInnerHTML: summary }) ), 
                            React.createElement( reactRouter.Link, { to: linkToImage }, "Se billede, (hvor kommentaren er)")
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
        var generateKey = function (id) { return "whatsnew_" + id; };
        return items.map(function (item) {
            var author = getUser(item.AuthorID);
            var itemKey = generateKey(item.ID);
            switch (item.Type) {
                case 1:
                    return  React.createElement( WhatsNewItemImage, {
                                id: item.ID, item: item.Item, on: item.On, author: author, key: itemKey })
                case 2:
                    return  React.createElement( WhatsNewItemComment, {
                                id: item.ID, text: item.Item.Text, uploadedBy: item.Item.ImageUploadedBy, imageId: item.Item.ImageID, on: item.On, author: author, key: itemKey })
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
        getUser: function (id) { return underscore.find(state.usersInfo.users, function (user) {
            return user.ID == id;
        }); },
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
        image: img
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
            var normalized = data.map(normalizeImage).reverse();
            dispatch(recievedUserImages(normalized));
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
                if(!img) return;
                var normalizedImage = normalizeImage(img);
                dispatch(addImage(normalizedImage));
            });
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
            React.createElement( 'div', { className: "col-lg-6 pull-right text-right" }, 
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
    return  React.createElement( 'div', null, 
                React.createElement( reactRouter.Link, { to: ("/" + username + "/gallery/image/" + (image.ImageID)) }, 
                    React.createElement( 'img', { src: image.PreviewUrl, className: "img-thumbnail" })
                ), 
                React.createElement( 'div', { className: "row" }, 
                    React.createElement( reactRouter.Link, { to: ("/" + username + "/gallery/image/" + (image.ImageID)) }, 
                        this.commentIcon(count) 
                    ), 
                    this.checkboxView()
                )
            )
    };

    return Image;
}(React.Component));
                //<a onClick={this.selectImage} style={{cursor: "pointer", textDecoration: "none"}}>
                //</a>

        //return ( count == 0 ?
        //    <div className="col-lg-6 text-muted"> 
        //        <span className="glyphicon glyphicon-comment" aria-hidden="true"></span> {count}
        //    </div>
        //    :
        //    <div className="col-lg-6 text-primary" style={{ cursor: 'pointer' }}>
        //        <span className="glyphicon glyphicon-comment" aria-hidden="true"></span> {count}
        //    </div>
        //);

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
        var addSelectedImageId = ref.addSelectedImageId;
        var removeSelectedImageId = ref.removeSelectedImageId;
        var deleteSelectedImages = ref.deleteSelectedImages;
        var canEdit = ref.canEdit;
        var imageIsSelected = ref.imageIsSelected;
        var username = ref.username;
        var result = this.arrangeArray(images);
        var view = result.map(function (row, i) {
            var imgs = row.map(function (img) {
                return (
                    React.createElement( 'div', { className: "col-lg-3", key: img.ImageID }, 
                        React.createElement( Image, {
                            image: img, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: imageIsSelected, username: username })
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

var mapStateToProps$3 = function (state) {
    var ownerId  = state.imagesInfo.ownerId;
    var currentId = state.usersInfo.currentUserId;
    var canEdit = (ownerId > 0 && currentId > 0 && ownerId == currentId);

    return {
        images: state.imagesInfo.images,
        canEdit: canEdit,
        selectedImageIds: state.imagesInfo.selectedImageIds,
        getFullname: function (username) {
            var user = state.usersInfo.users.filter(function (u) { return u.Username.toUpperCase() == username.toUpperCase(); })[0];
            var fullname = (user) ? user.FirstName + " " + user.LastName : 'User';
            return fullname.toLocaleLowerCase();
        }
    }
}

var mapDispatchToProps$3 = function (dispatch) {
    return {
        uploadImage: function (username, formData) {
            dispatch(uploadImage(username, formData));
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
    };

    UserImagesContainer.prototype.uploadView = function uploadView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        var uploadImage = ref.uploadImage;
        var selectedImageIds = ref.selectedImageIds;
        var ref$1 = this.props.params;
        var username = ref$1.username;
        var hasImages = selectedImageIds.length > 0;

        return (
            canEdit ? 
            React.createElement( ImageUpload, {
                uploadImage: uploadImage, username: username, deleteSelectedImages: this.deleteSelectedImages, hasImages: hasImages })
            : null);
    };

    UserImagesContainer.prototype.render = function render () {
        var ref = this.props.params;
        var username = ref.username;
        var ref$1 = this.props;
        var images = ref$1.images;
        var getFullname = ref$1.getFullname;
        var canEdit = ref$1.canEdit;
        var addSelectedImageId = ref$1.addSelectedImageId;
        var removeSelectedImageId = ref$1.removeSelectedImageId;
        var fullName = getFullname(username);
        
        return (
            React.createElement( 'div', { className: "row" }, 
                React.createElement( 'div', { className: "col-lg-offset-2 col-lg-8" }, 
                    React.createElement( 'h1', null, React.createElement( 'span', { className: "text-capitalize" }, fullName, "'s"), " ", React.createElement( 'small', null, "billede galleri" ) ), 
                    React.createElement( 'hr', null ), 
                    React.createElement( ImageList, {
                        images: images, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: this.imageIsSelected, username: username }), 
                    this.uploadView()
                ), 
                this.props.children
            )
        );
    };

    return UserImagesContainer;
}(React.Component));

var UserImagesRedux = reactRedux.connect(mapStateToProps$3, mapDispatchToProps$3)(UserImagesContainer);
var UserImages = reactRouter.withRouter(UserImagesRedux);

var setSkipComments = function (skip) {
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

function setTotalPages$1(totalPages) {
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
        return timeText(postedOn);
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

var mapStateToProps$5 = function (state) {
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

var mapDispatchToProps$5 = function (dispatch) {
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

var Comments = reactRedux.connect(mapStateToProps$5, mapDispatchToProps$5)(CommentsContainer);

var mapStateToProps$4 = function (state) {
    var ownerId  = state.imagesInfo.ownerId;
    var currentId = state.usersInfo.currentUserId;
    var canEdit = (ownerId > 0 && currentId > 0 && ownerId == currentId);

    var getImage = function (id) {
        return underscore.find(state.imagesInfo.images, function (image) {
            return image.ImageID == id;
        });
    };

    var image = function () { return getImage(state.imagesInfo.selectedImageId); };
    var filename = function () { if(image()) return image().Filename; return ''; };
    var previewUrl = function () { if(image()) return image().PreviewUrl; return ''; };
    var extension = function () { if(image()) return image().Extension; return ''; };
    var originalUrl = function () { if(image()) return image().OriginalUrl; return ''; };
    var uploaded = function () { if(image()) return image().Uploaded; return new Date(); };

    return {
        canEdit: canEdit,
        filename: filename(),
        previewUrl: previewUrl(),
        extension: extension(),
        originalUrl: originalUrl(),
        uploaded: uploaded()
    }
}

var mapDispatchToProps$4 = function (dispatch) {
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
        }
    }
}

var ModalImage = (function (superclass) {
    function ModalImage(props) {
        superclass.call(this, props);
        this.deleteImage = this.deleteImage.bind(this); 
    }

    if ( superclass ) ModalImage.__proto__ = superclass;
    ModalImage.prototype = Object.create( superclass && superclass.prototype );
    ModalImage.prototype.constructor = ModalImage;

    ModalImage.prototype.componentDidMount = function componentDidMount () {
        var ref = this.props;
        var deselectImage = ref.deselectImage;
        var setError = ref.setError;
        var ref$1 = this.props.params;
        var username = ref$1.username;
        var ref$2 = this.props.router;
        var push = ref$2.push;

        var isLoaded = typeof $ !== "undefined";
        if(isLoaded) {
            var node = ReactDOM.findDOMNode(this);
            $(node).modal('show');
            $(node).on('hide.bs.modal', function (e) {
                deselectImage();
                var galleryUrl = '/' + username + '/gallery';
                push(galleryUrl);
            });
        }
        else {
            setError({
                title: 'Oops something went wrong',
                message: 'Could not find the image, maybe the URL is invalid or it has been deleted!'
            });
        }
    };

    ModalImage.prototype.deleteImage = function deleteImage$1 () {
        var ref = this.props;
        var deleteImage = ref.deleteImage;
        var ref$1 = this.props.params;
        var id = ref$1.id;
        var username = ref$1.username;

        deleteImage(id, username);
        $(ReactDOM.findDOMNode(this)).modal('hide');
    };

    ModalImage.prototype.deleteImageView = function deleteImageView () {
        var ref = this.props;
        var canEdit = ref.canEdit;
        return (
            canEdit ?
            React.createElement( 'button', {
                    type: "button", className: "btn btn-danger", onClick: this.deleteImage }, "Slet billede") : null);
    };

    ModalImage.prototype.render = function render () {
        var ref = this.props;
        var filename = ref.filename;
        var previewUrl = ref.previewUrl;
        var extension = ref.extension;
        var originalUrl = ref.originalUrl;
        var uploaded = ref.uploaded;
        var name = filename + "." + extension;
        var uploadDate = moment(uploaded);
        var dateString = "Uploaded d. " + uploadDate.format("D MMM YYYY ") + "kl. " + uploadDate.format("H:mm");

        return  React.createElement( 'div', { className: "modal fade" }, 
                    React.createElement( 'div', { className: "modal-dialog modal-lg" }, 
                        React.createElement( 'div', { className: "modal-content" }, 
                            React.createElement( 'div', { className: "modal-header" }, 
                              React.createElement( 'button', { type: "button", className: "close", 'data-dismiss': "modal", 'aria-label': "Close" }, React.createElement( 'span', { 'aria-hidden': "true" }, "×")), 
                              React.createElement( 'h4', { className: "modal-title text-center" }, name, React.createElement( 'span', null, React.createElement( 'small', null, " - ", dateString ) ))
                          
                            ), 
                            React.createElement( 'div', { className: "modal-body" }, 
                                React.createElement( 'a', { href: originalUrl, target: "_blank" }, 
                                    React.createElement( 'img', { className: "img-responsive center-block", src: previewUrl })
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
    };

    return ModalImage;
}(React.Component));

var SelectedImageRedux = reactRedux.connect(mapStateToProps$4, mapDispatchToProps$4)(ModalImage);
var SelectedImage = reactRouter.withRouter(SelectedImageRedux);

store.dispatch(fetchCurrentUser(globals.currentUsername));
moment.locale('da');

var selectImage = function (nextState) {
    var imageId = nextState.params.id;
    store.dispatch(setSelectedImg(imageId));
}

var fetchImages = function (nextState) {
    var username = nextState.params.username;
    store.dispatch(setImageOwner(username));
    store.dispatch(fetchUserImages(username));
}

ReactDOM.render(
    React.createElement( reactRedux.Provider, { store: store }, 
        React.createElement( reactRouter.Router, { history: reactRouter.browserHistory }, 
            React.createElement( reactRouter.Route, { path: "/", component: Main }, 
                React.createElement( reactRouter.IndexRoute, { component: Home }), 
                React.createElement( reactRouter.Route, { path: "users", component: Users }), 
                React.createElement( reactRouter.Route, { path: "about", component: About }), 
                React.createElement( reactRouter.Route, { path: ":username/gallery", component: UserImages, onEnter: fetchImages }, 
                    React.createElement( reactRouter.Route, { path: "image/:id", component: SelectedImage, onEnter: selectImage }
                    )
                )
            )
        )
    ),
    document.getElementById('content'));

//<Route path="comment/:cid" component={'Single Comment'} onEnter={'fetchSingleCommentChain?'} />
//<Route path="comments" component={'Comments'} onEnter={'fetchComments'} />
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbnN0YW50cy90eXBlcy5qcyIsImFjdGlvbnMvZXJyb3IuanMiLCJ1dGlsaXRpZXMvdXRpbHMuanMiLCJyZWR1Y2Vycy91c2Vycy5qcyIsInJlZHVjZXJzL2ltYWdlcy5qcyIsInJlZHVjZXJzL2NvbW1lbnRzLmpzIiwicmVkdWNlcnMvZXJyb3IuanMiLCJyZWR1Y2Vycy9zdGF0dXMuanMiLCJyZWR1Y2Vycy93aGF0c25ldy5qcyIsInJlZHVjZXJzL3Jvb3QuanMiLCJzdG9yZXMvc3RvcmUuanMiLCJjb25zdGFudHMvY29uc3RhbnRzLmpzIiwiYWN0aW9ucy91c2Vycy5qcyIsImNvbXBvbmVudHMvd3JhcHBlcnMvTGlua3MuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRXJyb3IuanMiLCJjb21wb25lbnRzL01haW4uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJhY3Rpb25zL3doYXRzbmV3LmpzIiwiY29tcG9uZW50cy9XaGF0c05ldy9XaGF0c05ld0l0ZW1JbWFnZS5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3TGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9XaGF0c05ldy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Ib21lLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2Vycy5qcyIsImFjdGlvbnMvaW1hZ2VzLmpzIiwiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VVcGxvYWQuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzLmpzIiwiYWN0aW9ucy9jb21tZW50cy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudERlbGV0ZWQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRDb250cm9scy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudC5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudExpc3QuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL1BhZ2luYXRpb24uanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRGb3JtLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL0NvbW1lbnRzLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gSW1hZ2UgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX0lNRyA9ICdTRVRfU0VMRUNURURfSU1HJztcclxuZXhwb3J0IGNvbnN0IFVOU0VUX1NFTEVDVEVEX0lNRyA9ICdVTlNFVF9TRUxFQ1RFRF9JTUcnO1xyXG5leHBvcnQgY29uc3QgQUREX0lNQUdFID0gJ0FERF9JTUFHRSc7XHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfSU1BR0UgPSAnUkVNT1ZFX0lNQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9JTUFHRVNfT1dORVIgPSAnU0VUX0lNQUdFU19PV05FUic7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9VU0VSX0lNQUdFUyA9ICdSRUNJRVZFRF9VU0VSX0lNQUdFUyc7XHJcbmV4cG9ydCBjb25zdCBBRERfU0VMRUNURURfSU1BR0VfSUQgPSAnQUREX1NFTEVDVEVEX0lNQUdFX0lEJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCA9ICdSRU1PVkVfU0VMRUNURURfSU1BR0VfSUQnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTID0gJ0NMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyc7XHJcblxyXG4vLyBVc2VyIGFjdGlvbnNcclxuZXhwb3J0IGNvbnN0IFNFVF9DVVJSRU5UX1VTRVJfSUQgPSAnU0VUX0NVUlJFTlRfVVNFUl9JRCc7XHJcbmV4cG9ydCBjb25zdCBBRERfVVNFUiA9ICdBRERfVVNFUic7XHJcbmV4cG9ydCBjb25zdCBFUlJPUl9GRVRDSElOR19DVVJSRU5UX1VTRVIgPSAnRVJST1JfRkVUQ0hJTkdfQ1VSUkVOVF9VU0VSJztcclxuZXhwb3J0IGNvbnN0IFJFQ0lFVkVEX1VTRVJTID0gJ1JFQ0lFVkVEX1VTRVJTJztcclxuXHJcbi8vIENvbW1lbnQgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgUkVDSUVWRURfQ09NTUVOVFMgPSAnUkVDSUVWRURfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX0NVUlJFTlRfUEFHRSA9ICdTRVRfQ1VSUkVOVF9QQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UT1RBTF9QQUdFUyA9ICdTRVRfVE9UQUxfUEFHRVMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NLSVBfQ09NTUVOVFMgPSAnU0VUX1NLSVBfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RBS0VfQ09NTUVOVFMgPSAnU0VUX1RBS0VfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgSU5DUl9DT01NRU5UX0NPVU5UID0gJ0lOQ1JfQ09NTUVOVF9DT1VOVCc7XHJcbmV4cG9ydCBjb25zdCBERUNSX0NPTU1FTlRfQ09VTlQgPSAnREVDUl9DT01NRU5UX0NPVU5UJztcclxuZXhwb3J0IGNvbnN0IFNFVF9ERUZBVUxUX1NLSVAgPSAnU0VUX0RFRkFVTFRfU0tJUCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfREVGQVVMVF9UQUtFID0gJ1NFVF9ERUZBVUxUX1RBS0UnO1xyXG5leHBvcnQgY29uc3QgU0VUX0RFRkFVTFRfQ09NTUVOVFMgPSAnU0VUX0RFRkFVTFRfQ09NTUVOVFMnO1xyXG5cclxuLy8gV2hhdHNOZXdcclxuZXhwb3J0IGNvbnN0IEFERF9MQVRFU1QgPSAnQUREX0xBVEVTVCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0tJUF9XSEFUU19ORVcgPSAnU0VUX1NLSVBfV0hBVFNfTkVXJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UQUtFX1dIQVRTX05FVyA9ICdTRVRfVEFLRV9XSEFUU19ORVcnO1xyXG5leHBvcnQgY29uc3QgU0VUX1BBR0VfV0hBVFNfTkVXID0gJ1NFVF9QQUdFX1dIQVRTX05FVyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXID0gJ1NFVF9UT1RBTF9QQUdFU19XSEFUU19ORVcnO1xyXG5cclxuLy8gRXJyb3IgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX0VSUk9SX1RJVExFID0gJ1NFVF9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfRVJST1JfTUVTU0FHRSA9ICdTRVRfRVJST1JfTUVTU0FHRSdcclxuZXhwb3J0IGNvbnN0IFNFVF9IQVNfRVJST1IgPSAnU0VUX0hBU19FUlJPUic7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9USVRMRSA9ICdDTEVBUl9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9NRVNTQUdFID0gJ0NMRUFSX0VSUk9SX01FU1NBR0UnOyIsIu+7v2ltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfRVJST1JfVElUTEUsXHJcbiAgICAgICAgdGl0bGU6IHRpdGxlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckVycm9yVGl0bGUgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfVElUTEVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yTWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0VSUk9SX01FU1NBR0UsXHJcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvck1lc3NhZ2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfTUVTU0FHRVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9ICgpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChjbGVhckVycm9yVGl0bGUoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvck1lc3NhZ2UoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0SGFzRXJyb3IoZmFsc2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRIYXNFcnJvciA9IChoYXNFcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9IQVNfRVJST1IsXHJcbiAgICAgICAgaGFzRXJyb3I6IGhhc0Vycm9yXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKHRydWUpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXRFcnJvclRpdGxlKGVycm9yLnRpdGxlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JNZXNzYWdlKGVycm9yLm1lc3NhZ2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IodGl0bGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IHVuaXEsIGZsYXR0ZW4gfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXHJcbmltcG9ydCByZW1vdmVNZCBmcm9tICdyZW1vdmUtbWFya2Rvd24nXHJcblxyXG52YXIgY3VycnkgPSBmdW5jdGlvbihmLCBuYXJncywgYXJncykge1xyXG4gICAgbmFyZ3MgPSBpc0Zpbml0ZShuYXJncykgPyBuYXJncyA6IGYubGVuZ3RoO1xyXG4gICAgYXJncyA9IGFyZ3MgfHwgW107XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gMS4gYWNjdW11bGF0ZSBhcmd1bWVudHNcclxuICAgICAgICB2YXIgbmV3QXJncyA9IGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIGlmIChuZXdBcmdzLmxlbmd0aCA+PSBuYXJncykge1xyXG4gICAgICAgICAgICAvLyBhcHBseSBhY2N1bXVsYXRlZCBhcmd1bWVudHNcclxuICAgICAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgbmV3QXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIDIuIHJldHVybiBhbm90aGVyIGN1cnJpZWQgZnVuY3Rpb25cclxuICAgICAgICByZXR1cm4gY3VycnkoZiwgbmFyZ3MsIG5ld0FyZ3MpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGN1cnJ5O1xyXG5cclxuY29uc3QgY291bnRDb21tZW50ID0gKHRvcENvbW1lbnQpID0+IHtcclxuICAgIGxldCBjb3VudCA9IDE7XHJcbiAgICBsZXQgcmVtb3ZlZCA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcENvbW1lbnQuUmVwbGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdG9wQ29tbWVudC5SZXBsaWVzW2ldO1xyXG5cclxuICAgICAgICAvLyBFeGNsdWRlIGRlbGV0ZWQgY29tbWVudHNcclxuICAgICAgICBpZihjaGlsZC5EZWxldGVkKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZWQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvdW50ICs9IGNvdW50Q29tbWVudChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50LXJlbW92ZWQ7XHJcbn1cclxuXHJcbmNvbnN0IGNvdW50Q29tbWVudHMgPSAoY29tbWVudHMgPSBbXSkgPT4ge1xyXG4gICAgbGV0IHRvdGFsID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgdG9wQ29tbWVudCA9IGNvbW1lbnRzW2ldO1xyXG4gICAgICAgIHRvdGFsICs9IGNvdW50Q29tbWVudCh0b3BDb21tZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdG90YWw7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVJbWFnZSA9IChpbWcpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSW1hZ2VJRDogaW1nLkltYWdlSUQsXHJcbiAgICAgICAgRmlsZW5hbWU6IGltZy5GaWxlbmFtZSxcclxuICAgICAgICBFeHRlbnNpb246IGltZy5FeHRlbnNpb24sXHJcbiAgICAgICAgT3JpZ2luYWxVcmw6IGltZy5PcmlnaW5hbFVybCxcclxuICAgICAgICBQcmV2aWV3VXJsOiBpbWcuUHJldmlld1VybCxcclxuICAgICAgICBUaHVtYm5haWxVcmw6IGltZy5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgQ29tbWVudENvdW50OiBpbWcuQ29tbWVudENvdW50LFxyXG4gICAgICAgIFVwbG9hZGVkOiBuZXcgRGF0ZShpbWcuVXBsb2FkZWQpLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNvbW1lbnQgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgbGV0IHIgPSBjb21tZW50LlJlcGxpZXMgPyBjb21tZW50LlJlcGxpZXMgOiBbXTtcclxuICAgIGNvbnN0IHJlcGxpZXMgPSByLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgIGNvbnN0IGF1dGhvcklkID0gKGNvbW1lbnQuRGVsZXRlZCkgPyAtMSA6IGNvbW1lbnQuQXV0aG9yLklEO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBDb21tZW50SUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgICAgIERlbGV0ZWQ6IGNvbW1lbnQuRGVsZXRlZCxcclxuICAgICAgICBQb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbixcclxuICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgUmVwbGllczogcmVwbGllc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplTGF0ZXN0ID0gKGxhdGVzdCkgPT4ge1xyXG4gICAgbGV0IGl0ZW0gPSBudWxsO1xyXG4gICAgaWYobGF0ZXN0LlR5cGUgPT0gMSkge1xyXG4gICAgICAgIC8vIEltYWdlIC0gb21pdCBBdXRob3IgYW5kIENvbW1lbnRDb3VudFxyXG4gICAgICAgIGNvbnN0IGltYWdlID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgRXh0ZW5zaW9uOiBpbWFnZS5FeHRlbnNpb24sXHJcbiAgICAgICAgICAgIEZpbGVuYW1lOiBpbWFnZS5GaWxlbmFtZSxcclxuICAgICAgICAgICAgSW1hZ2VJRDogaW1hZ2UuSW1hZ2VJRCxcclxuICAgICAgICAgICAgT3JpZ2luYWxVcmw6IGltYWdlLk9yaWdpbmFsVXJsLFxyXG4gICAgICAgICAgICBQcmV2aWV3VXJsOiBpbWFnZS5QcmV2aWV3VXJsLFxyXG4gICAgICAgICAgICBUaHVtYm5haWxVcmw6IGltYWdlLlRodW1ibmFpbFVybCxcclxuICAgICAgICAgICAgVXBsb2FkZWQ6IGltYWdlLlVwbG9hZGVkXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxhdGVzdC5UeXBlID09IDIpIHtcclxuICAgICAgICAvLyBDb21tZW50IC0gb21pdCBBdXRob3IgYW5kIERlbGV0ZWQgYW5kIFJlcGxpZXNcclxuICAgICAgICBjb25zdCBjb21tZW50ID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgSUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogY29tbWVudC5JbWFnZUlELFxyXG4gICAgICAgICAgICBJbWFnZVVwbG9hZGVkQnk6IGNvbW1lbnQuSW1hZ2VVcGxvYWRlZEJ5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiBsYXRlc3QuSUQsXHJcbiAgICAgICAgVHlwZTogbGF0ZXN0LlR5cGUsXHJcbiAgICAgICAgSXRlbTogaXRlbSxcclxuICAgICAgICBPbjogbGF0ZXN0Lk9uLFxyXG4gICAgICAgIEF1dGhvcklEOiBsYXRlc3QuSXRlbS5BdXRob3IuSURcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHZpc2l0Q29tbWVudHMgPSAoY29tbWVudHMsIGZ1bmMpID0+IHtcclxuICAgIGNvbnN0IGdldFJlcGxpZXMgPSAoYykgPT4gYy5SZXBsaWVzID8gYy5SZXBsaWVzIDogW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjb21tZW50c1tpXSwgZ2V0UmVwbGllcywgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZXB0aEZpcnN0U2VhcmNoID0gKGN1cnJlbnQsIGdldENoaWxkcmVuLCBmdW5jKSA9PiB7XHJcbiAgICBmdW5jKGN1cnJlbnQpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBnZXRDaGlsZHJlbihjdXJyZW50KTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKGNoaWxkcmVuW2ldLCBnZXRDaGlsZHJlbiwgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmlvbihhcnIxLCBhcnIyLCBlcXVhbGl0eUZ1bmMpIHtcclxuICAgIHZhciB1bmlvbiA9IGFycjEuY29uY2F0KGFycjIpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5pb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gaSsxOyBqIDwgdW5pb24ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGVxdWFsaXR5RnVuYyh1bmlvbltpXSwgdW5pb25bal0pKSB7XHJcbiAgICAgICAgICAgICAgICB1bmlvbi5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICBqLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVuaW9uO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXNlckVxdWFsaXR5ID0gKHVzZXIxLCB1c2VyMikgPT4ge1xyXG4gICAgaWYoIXVzZXIyIHx8ICF1c2VyMSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHVzZXIxLklEID09IHVzZXIyLklEO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGZvcm1hdFRleHQgPSAodGV4dCkgPT4ge1xyXG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICB2YXIgcmF3TWFya3VwID0gbWFya2VkKHRleHQsIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICByZXR1cm4geyBfX2h0bWw6IHJhd01hcmt1cCB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0V29yZHMgPSAodGV4dCwgbnVtYmVyT2ZXb3JkcykgPT4ge1xyXG4gICAgaWYoIXRleHQpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgcGxhaW5UZXh0ID0gcmVtb3ZlTWQodGV4dCk7XHJcbiAgICByZXR1cm4gcGxhaW5UZXh0LnNwbGl0KC9cXHMrLykuc2xpY2UoMCwgbnVtYmVyT2ZXb3Jkcykuam9pbihcIiBcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB0aW1lVGV4dCA9IChwb3N0ZWRPbikgPT4ge1xyXG4gICAgY29uc3QgYWdvID0gbW9tZW50KHBvc3RlZE9uKS5mcm9tTm93KCk7XHJcbiAgICBjb25zdCBkaWZmID0gbW9tZW50KCkuZGlmZihwb3N0ZWRPbiwgJ2hvdXJzJywgdHJ1ZSk7XHJcbiAgICBpZiAoZGlmZiA+PSAxMi41KSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBtb21lbnQocG9zdGVkT24pO1xyXG4gICAgICAgIHJldHVybiBcImQuIFwiICsgZGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKSArIFwia2wuIFwiICsgZGF0ZS5mb3JtYXQoXCJIOm1tXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBcImZvciBcIiArIGFnbztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc3BvbnNlSGFuZGxlciA9IChkaXNwYXRjaCwgcmVzcG9uc2UpID0+IHtcclxuICAgIGlmIChyZXNwb25zZS5vaykgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgNDAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjQwMCBCYWQgUmVxdWVzdFwiLCBcIlRoZSByZXF1ZXN0IHdhcyBub3Qgd2VsbC1mb3JtZWRcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDQgTm90IEZvdW5kXCIsIFwiQ291bGQgbm90IGZpbmQgcmVzb3VyY2VcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwODpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDggUmVxdWVzdCBUaW1lb3V0XCIsIFwiVGhlIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgaW4gdGltZVwiKSkpO1xyXG4gICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI1MDAgU2VydmVyIEVycm9yXCIsIFwiU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgQVBJLXNlcnZlclwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihuZXcgSHR0cEVycm9yKFwiT29wc1wiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG9uUmVqZWN0ID0gKCkgPT4geyB9XHJcbiIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgdW5pb24sIHVzZXJFcXVhbGl0eSB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IHVzZXJzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfVVNFUjpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLnVzZXJdLCB1c2VyRXF1YWxpdHkpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi51c2VycztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRVc2VySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9DVVJSRU5UX1VTRVJfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgc3RhdGU7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB1c2Vyc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgY3VycmVudFVzZXJJZCxcclxuICAgIHVzZXJzXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCB1c2Vyc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IG93bmVySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9JTUFHRVNfT1dORVI6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgc3RhdGU7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbWFnZXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLmltYWdlXSwgKGltZzEsIGltZzIpID0+IGltZzEuSW1hZ2VJRCA9PSBpbWcyLkltYWdlSUQpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSX0lNQUdFUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pbWFnZXM7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmZpbHRlcihpbWcgPT4gaW1nLkltYWdlSUQgIT0gYWN0aW9uLmlkKTtcclxuICAgICAgICBjYXNlIFQuSU5DUl9DT01NRU5UX0NPVU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubWFwKGltZyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihpbWcuSW1hZ2VJRCA9PSBhY3Rpb24uaW1hZ2VJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZy5Db21tZW50Q291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVC5ERUNSX0NPTU1FTlRfQ09VTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYXAoaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGltZy5JbWFnZUlEID09IGFjdGlvbi5pbWFnZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nLkNvbW1lbnRDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGltZztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TRUxFQ1RFRF9JTUc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgc3RhdGU7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWRzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfU0VMRUNURURfSU1BR0VfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB1bmlvbihzdGF0ZSwgW2FjdGlvbi5pZF0sIChpZDEsIGlkMikgPT4gaWQxID09IGlkMik7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRDpcclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcihzdGF0ZSwgKGlkKSA9PiBpZCAhPSBhY3Rpb24uaWQpO1xyXG4gICAgICAgIGNhc2UgVC5DTEVBUl9TRUxFQ1RFRF9JTUFHRV9JRFM6XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGltYWdlc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgb3duZXJJZCxcclxuICAgIGltYWdlcyxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZCxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZHNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGltYWdlc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuY29uc3QgY29tbWVudHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlJFQ0lFVkVEX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmNvbW1lbnRzIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0tJUF9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5za2lwIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdGFrZSA9IChzdGF0ZSA9IDEwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RBS0VfQ09NTUVOVFM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udGFrZSB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHBhZ2UgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0NVUlJFTlRfUEFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYWdlIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfUEFHRVM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udG90YWxQYWdlcyB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNvbW1lbnRzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjb21tZW50cyxcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbW1lbnRzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5leHBvcnQgY29uc3QgdGl0bGUgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0VSUk9SX1RJVExFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRpdGxlIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0VSUk9SX01FU1NBR0U6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ubWVzc2FnZSB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGVycm9ySW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB0aXRsZSxcclxuICAgIG1lc3NhZ2VcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBlcnJvckluZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgZXJyb3JJbmZvIGZyb20gJy4vZXJyb3InXHJcblxyXG5leHBvcnQgY29uc3QgaGFzRXJyb3IgPSAoc3RhdGUgPSBmYWxzZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9IQVNfRVJST1I6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaGFzRXJyb3IgfHwgc3RhdGU7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRvbmUgPSAoc3RhdGUgPSB0cnVlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHN0YXR1c0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgaGFzRXJyb3IsXHJcbiAgICBlcnJvckluZm8sXHJcbiAgICBtZXNzYWdlLFxyXG4gICAgZG9uZVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RhdHVzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5cclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0tJUF9XSEFUU19ORVc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uc2tpcCB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UQUtFX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfUEFHRV9XSEFUU19ORVc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGFnZSB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50b3RhbFBhZ2VzIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgaXRlbXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9MQVRFU1Q6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ubGF0ZXN0IHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgd2hhdHNOZXdJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXMsXHJcbiAgICBpdGVtc1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgd2hhdHNOZXdJbmZvO1xyXG5cclxuLyoqIFdoYXRzTmV3SW5mb1xyXG4gICAge1xyXG4gICAgICAgIHNraXA6IDAsXHJcbiAgICAgICAgdGFrZTogMTAsXHJcbiAgICAgICAgcGFnZTogMSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiAyLFxyXG4gICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIElkOiAxXHJcbiAgICAgICAgICAgICAgICBUeXBlOiBlbnVtLFxyXG4gICAgICAgICAgICAgICAgQXV0aG9ySWQ6IDEsXHJcbiAgICAgICAgICAgICAgICBJdGVtOiB7IH0sXHJcbiAgICAgICAgICAgICAgICBPbjogdGltZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSWQ6IDIsXHJcbiAgICAgICAgICAgICAgICBUeXBlOiBlbnVtLFxyXG4gICAgICAgICAgICAgICAgQXV0aG9ySWQ6IDEsXHJcbiAgICAgICAgICAgICAgICBJdGVtOiB7IH0sXHJcbiAgICAgICAgICAgICAgICBPbjogdGltZSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxuKiovIiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCB1c2Vyc0luZm8gZnJvbSAnLi91c2VycydcclxuaW1wb3J0IGltYWdlc0luZm8gZnJvbSAnLi9pbWFnZXMnXHJcbmltcG9ydCBjb21tZW50c0luZm8gZnJvbSAnLi9jb21tZW50cydcclxuaW1wb3J0IHN0YXR1c0luZm8gZnJvbSAnLi9zdGF0dXMnXHJcbmltcG9ydCB3aGF0c05ld0luZm8gZnJvbSAnLi93aGF0c25ldydcclxuXHJcbmNvbnN0IHJvb3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHVzZXJzSW5mbyxcclxuICAgIGltYWdlc0luZm8sXHJcbiAgICBjb21tZW50c0luZm8sXHJcbiAgICBzdGF0dXNJbmZvLFxyXG4gICAgd2hhdHNOZXdJbmZvXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCByb290UmVkdWNlciIsIu+7v2ltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0IHRodW5rIGZyb20gJ3JlZHV4LXRodW5rJ1xyXG5pbXBvcnQgcm9vdFJlZHVjZXIgZnJvbSAnLi4vcmVkdWNlcnMvcm9vdCdcclxuXHJcbmV4cG9ydCBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJvb3RSZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUodGh1bmspKSIsIu+7v2V4cG9ydCBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ1xyXG59Iiwi77u/aW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5cclxuY29uc3QgZ2V0VXJsID0gKHVzZXJuYW1lKSA9PiBnbG9iYWxzLnVybHMudXNlcnMgKyAnP3VzZXJuYW1lPScgKyB1c2VybmFtZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJyZW50VXNlcklkKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0NVUlJFTlRfVVNFUl9JRCxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRVc2VyKHVzZXIpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5BRERfVVNFUixcclxuICAgICAgICB1c2VyOiB1c2VyXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjaWV2ZWRVc2Vycyh1c2Vycykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFQ0lFVkVEX1VTRVJTLFxyXG4gICAgICAgIHVzZXJzOiB1c2Vyc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hDdXJyZW50VXNlcih1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IGdldFVybCh1c2VybmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0Q3VycmVudFVzZXJJZCh1c2VyLklEKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IGdldFVybCh1c2VybmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXIgPT4gZGlzcGF0Y2goYWRkVXNlcih1c2VyKSksIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoVXNlcnMoKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaChnbG9iYWxzLnVybHMudXNlcnMsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXJzID0+IGRpc3BhdGNoKHJlY2lldmVkVXNlcnModXNlcnMpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgTmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICAgICAgICAgIDxMaW5rIHsuLi50aGlzLnByb3BzfT5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuXHJcbk5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmRleE5hdkxpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IHRoaXMuY29udGV4dC5yb3V0ZXIuaXNBY3RpdmUodGhpcy5wcm9wcy50bywgdHJ1ZSksXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XHJcbiAgICAgICAgICAgICAgICA8SW5kZXhMaW5rIHsuLi50aGlzLnByb3BzfT5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvSW5kZXhMaW5rPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuSW5kZXhOYXZMaW5rLmNvbnRleHRUeXBlcyA9IHtcclxuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNsZWFyRXJyb3IsIHRpdGxlLCBtZXNzYWdlICB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTIgY29sLWxnLThcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIHJvbGU9XCJhbGVydFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtjbGVhckVycm9yfSB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPnt0aXRsZX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge21lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBOYXZMaW5rLCBJbmRleE5hdkxpbmsgfSBmcm9tICcuL3dyYXBwZXJzL0xpbmtzJ1xyXG5pbXBvcnQgeyBFcnJvciB9IGZyb20gJy4vY29udGFpbmVycy9FcnJvcidcclxuaW1wb3J0IHsgY2xlYXJFcnJvciB9IGZyb20gJy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgR3JpZCwgUm93LCBDb2wsIE5hdmJhciwgTmF2LCBOYXZJdGVtIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhhc0Vycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmhhc0Vycm9yLFxyXG4gICAgICAgIGVycm9yOiBzdGF0ZS5zdGF0dXNJbmZvLmVycm9ySW5mb1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNsZWFyRXJyb3I6ICgpID0+IGRpc3BhdGNoKGNsZWFyRXJyb3IoKSlcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU2hlbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgZXJyb3JWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgaGFzRXJyb3IsIGNsZWFyRXJyb3IsIGVycm9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUsIG1lc3NhZ2UgfSA9IGVycm9yO1xyXG4gICAgICAgIHJldHVybiAoaGFzRXJyb3IgP1xyXG4gICAgICAgICAgICA8RXJyb3JcclxuICAgICAgICAgICAgICAgIHRpdGxlPXt0aXRsZX1cclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U9e21lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICBjbGVhckVycm9yPXtjbGVhckVycm9yfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxHcmlkIGZsdWlkPXt0cnVlfT5cclxuICAgICAgICAgICAgICAgICAgICA8TmF2YmFyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLkhlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuQnJhbmQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCIvXCIgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCI+SW51cGxhbiBJbnRyYW5ldDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLkJyYW5kPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci5Ub2dnbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXZiYXIuSGVhZGVyPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci5Db2xsYXBzZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEluZGV4TmF2TGluayB0bz1cIi9cIj5Gb3JzaWRlPC9JbmRleE5hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89XCIvdXNlcnNcIj5CcnVnZXJlPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIHRvPVwiL2Fib3V0XCI+T208L05hdkxpbms+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci5UZXh0IHB1bGxSaWdodD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIZWosIHtnbG9iYWxzLmN1cnJlbnRVc2VybmFtZX0hXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5UZXh0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5Db2xsYXBzZT5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9OYXZiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmVycm9yVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvR3JpZD5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgTWFpbiA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFNoZWxsKTtcclxuZXhwb3J0IGRlZmF1bHQgTWFpbjsiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYm91dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiT21cIjtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0yIGNvbC1sZy04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERldHRlIGVyIGVuIHNpbmdsZSBwYWdlIGFwcGxpY2F0aW9uIVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgVGVrbm9sb2dpZXIgYnJ1Z3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlYWN0PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlZHV4PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlYWN0Um91dGVyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkFzcC5uZXQgQ29yZSBSQyAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkFzcC5uZXQgV2ViIEFQSSAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QsIG5vcm1hbGl6ZUxhdGVzdCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgYWRkVXNlciB9IGZyb20gJy4vdXNlcnMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkTGF0ZXN0KGxhdGVzdCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9MQVRFU1QsXHJcbiAgICAgICAgbGF0ZXN0OiBsYXRlc3RcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFNLaXAoc2tpcCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TS0lQX1dIQVRTX05FVyxcclxuICAgICAgICBza2lwOiBza2lwXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUYWtlKHRha2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVEFLRV9XSEFUU19ORVcsXHJcbiAgICAgICAgdGFrZTogdGFrZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0UGFnZShwYWdlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1BBR0VfV0hBVFNfTkVXLFxyXG4gICAgICAgIHBhZ2U6IHBhZ2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFRvdGFsUGFnZXModG90YWxQYWdlcykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UT1RBTF9QQUdFU19XSEFUU19ORVcsXHJcbiAgICAgICAgdG90YWxQYWdlczogdG90YWxQYWdlc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy53aGF0c25ldyArIFwiP3NraXA9XCIgKyBza2lwICsgXCImdGFrZT1cIiArIHRha2U7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihwYWdlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gcGFnZS5DdXJyZW50SXRlbXM7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGl0ZW0uSXRlbS5BdXRob3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYXV0aG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRVc2VyKGF1dGhvcikpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVzZXQgaW5mb1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0U0tpcChza2lwKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUYWtlKHRha2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFBhZ2UocGFnZS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxQYWdlcyhwYWdlLlRvdGFsUGFnZXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gaXRlbXMuZmlsdGVyKGl0ZW0gPT4gQm9vbGVhbihpdGVtLkl0ZW0uQXV0aG9yKSkubWFwKG5vcm1hbGl6ZUxhdGVzdCk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRMYXRlc3Qobm9ybWFsaXplZCkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdJdGVtSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnRQcm9maWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWxlZnRcIj5cclxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwibWVkaWEtb2JqZWN0XCJcclxuICAgICAgICAgICAgICAgICAgICBzcmM9XCIvaW1hZ2VzL3BlcnNvbl9pY29uLnN2Z1wiXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1ob2xkZXItcmVuZGVyZWQ9XCJ0cnVlXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogXCI2NHB4XCIsIGhlaWdodDogXCI2NHB4XCIgfX1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudFByb2ZpbGUnXHJcbmltcG9ydCB7IGZvcm1hdFRleHQsIGdldFdvcmRzLCB0aW1lVGV4dCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1Db21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNyZWF0ZVN1bW1hcnkoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBmb3JtYXRUZXh0KFwiXFxcIlwiICsgZ2V0V29yZHModGV4dCwgNSkgKyBcIi4uLlwiICsgXCJcXFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bGxuYW1lKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBhdXRob3IuRmlyc3ROYW1lICsgJyAnICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHdoZW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJzYWdkZSBcIiArIHRpbWVUZXh0KG9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCB1cGxvYWRlZEJ5IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IHRoaXMuZnVsbG5hbWUoKTtcclxuICAgICAgICBjb25zdCBzdW1tYXJ5ID0gdGhpcy5jcmVhdGVTdW1tYXJ5KCk7XHJcbiAgICAgICAgY29uc3QgbGlua1RvSW1hZ2UgPSB1cGxvYWRlZEJ5LlVzZXJuYW1lICsgXCIvZ2FsbGVyeS9pbWFnZS9cIiArIGltYWdlSWQ7XHJcbiAgICAgICAgcmV0dXJuICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50UHJvZmlsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwibWVkaWEtaGVhZGluZ1wiPnthdXRob3J9IDxzbWFsbD57dGhpcy53aGVuKCl9PC9zbWFsbD48L2g1PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGVtPjxzcGFuIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtzdW1tYXJ5fT48L3NwYW4+PC9lbT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtsaW5rVG9JbWFnZX0+U2UgYmlsbGVkZSwgKGh2b3Iga29tbWVudGFyZW4gZXIpPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBXaGF0c05ld0l0ZW1JbWFnZSB9IGZyb20gJy4vV2hhdHNOZXdJdGVtSW1hZ2UnXHJcbmltcG9ydCB7IFdoYXRzTmV3SXRlbUNvbW1lbnQgfSBmcm9tICcuL1doYXRzTmV3SXRlbUNvbW1lbnQnXHJcblxyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdEl0ZW1zKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgZ2VuZXJhdGVLZXkgPSAoaWQpID0+IFwid2hhdHNuZXdfXCIgKyBpZDtcclxuICAgICAgICByZXR1cm4gaXRlbXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRVc2VyKGl0ZW0uQXV0aG9ySUQpO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtS2V5ID0gZ2VuZXJhdGVLZXkoaXRlbS5JRCk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICA8V2hhdHNOZXdJdGVtSW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17aXRlbS5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtPXtpdGVtLkl0ZW19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb249e2l0ZW0uT259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9yPXthdXRob3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtS2V5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxXaGF0c05ld0l0ZW1Db21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2l0ZW0uSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17aXRlbS5JdGVtLlRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWRCeT17aXRlbS5JdGVtLkltYWdlVXBsb2FkZWRCeX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXtpdGVtLkl0ZW0uSW1hZ2VJRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbj17aXRlbS5Pbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I9e2F1dGhvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW1LZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbU5vZGVzID0gdGhpcy5jb25zdHJ1Y3RJdGVtcygpO1xyXG4gICAgICAgIHJldHVybiAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYSBwdWxsLWxlZnQgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW1Ob2Rlc31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBmZXRjaExhdGVzdE5ld3MgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3doYXRzbmV3J1xyXG5pbXBvcnQgeyBXaGF0c05ld0xpc3QgfSBmcm9tICcuLi9XaGF0c05ldy9XaGF0c05ld0xpc3QnXHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TGF0ZXN0OiAoc2tpcCwgdGFrZSkgPT4gZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXRlbXM6IHN0YXRlLndoYXRzTmV3SW5mby5pdGVtcyxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IGZpbmQoc3RhdGUudXNlcnNJbmZvLnVzZXJzLCAodXNlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdXNlci5JRCA9PSBpZDtcclxuICAgICAgICB9KSxcclxuICAgICAgICBza2lwOiBzdGF0ZS53aGF0c05ld0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS53aGF0c05ld0luZm8udGFrZVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBXaGF0c05ld0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGdldExhdGVzdCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBnZXRMYXRlc3Qoc2tpcCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5TaWRzdGUgbnl0PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8V2hhdHNOZXdMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpdGVtc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VXNlcj17Z2V0VXNlcn1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFdoYXRzTmV3ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoV2hhdHNOZXdDb250YWluZXIpXHJcbmV4cG9ydCBkZWZhdWx0IFdoYXRzTmV3OyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgV2hhdHNOZXcgZnJvbSAnLi9XaGF0c05ldydcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2VyOiBzdGF0ZS51c2Vyc0luZm8udXNlcnMuZmlsdGVyKHUgPT4gdS5Vc2VybmFtZS50b1VwcGVyQ2FzZSgpID09IGdsb2JhbHMuY3VycmVudFVzZXJuYW1lLnRvVXBwZXJDYXNlKCkpWzBdLFxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBIb21lVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiRm9yc2lkZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXIsIGxhdGVzdEl0ZW1zIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB1c2VyID8gdXNlci5GaXJzdE5hbWUgOiAnVXNlcic7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0yIGNvbC1sZy04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqdW1ib3Ryb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxPlZlbGtvbW1lbiA8c21hbGw+e25hbWV9ITwvc21hbGw+PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibGVhZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGlsIEludXBsYW5zIGludHJhbmV0IHNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxXaGF0c05ldyAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEhvbWUgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoSG9tZVZpZXcpXHJcbmV4cG9ydCBkZWZhdWx0IEhvbWUiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcblxyXG5leHBvcnQgY2xhc3MgVXNlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdmFyIGVtYWlsID0gXCJtYWlsdG86XCIgKyB0aGlzLnByb3BzLmVtYWlsO1xyXG4gICAgICAgIHZhciBnYWxsZXJ5ID0gXCIvXCIgKyB0aGlzLnByb3BzLnVzZXJuYW1lICsgXCIvZ2FsbGVyeVwiO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTMgcGFuZWwgcGFuZWwtZGVmYXVsdFwiIHN0eWxlPXt7IHBhZGRpbmdUb3A6IFwiOHB4XCIsIHBhZGRpbmdCb3R0b206IFwiOHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5CcnVnZXJuYXZuPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy51c2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+Rm9ybmF2bjwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZmlyc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5FZnRlcm5hdm48L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmxhc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5FbWFpbDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17ZW1haWx9Pnt0aGlzLnByb3BzLmVtYWlsfTwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+QmlsbGVkZXI8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtnYWxsZXJ5fT5CaWxsZWRlcjwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL1VzZXInXHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgdXNlck5vZGVzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VySWQgPSBgdXNlcklkXyR7dXNlci5JRH1gO1xyXG4gICAgICAgICAgICByZXR1cm4gKDxVc2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXIuVXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkPXt1c2VyLklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZT17dXNlci5GaXJzdE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU9e3VzZXIuTGFzdE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw9e3VzZXIuRW1haWx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZVVybD17dXNlci5Qcm9maWxlSW1hZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM9e3VzZXIuUm9sZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXt1c2VySWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAvPik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHVzZXJzID0gdGhpcy51c2VyTm9kZXMoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAge3VzZXJzfVxyXG4gICAgICAgICAgICA8L2Rpdj4pXHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgZmV0Y2hVc2VycyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvdXNlcnMnXHJcbmltcG9ydCB7IFVzZXJMaXN0IH0gZnJvbSAnLi4vdXNlcnMvVXNlckxpc3QnXHJcblxyXG5jb25zdCBtYXBVc2Vyc1RvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlcnM6IHN0YXRlLnVzZXJzSW5mby51c2Vyc1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFVzZXJzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoVXNlcnMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgVXNlcnNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBcIkJydWdlcmVcIjtcclxuICAgICAgICB0aGlzLnByb3BzLmdldFVzZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcnMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0yIGNvbC1sZy04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDE+SW51cGxhbidzIDxzbWFsbD5icnVnZXJlPC9zbWFsbD48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VyTGlzdCB1c2Vycz17dXNlcnN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVXNlcnMgPSBjb25uZWN0KG1hcFVzZXJzVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2Vyc0NvbnRhaW5lcilcclxuZXhwb3J0IGRlZmF1bHQgVXNlcnNcclxuIiwi77u/aW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgeyBub3JtYWxpemVJbWFnZSB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEltYWdlc093bmVyKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0lNQUdFU19PV05FUixcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNpZXZlZFVzZXJJbWFnZXMoaW1hZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfVVNFUl9JTUFHRVMsXHJcbiAgICAgICAgaW1hZ2VzOiBpbWFnZXNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZEltZyA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TRUxFQ1RFRF9JTUcsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkSW1hZ2UoaW1nKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX0lNQUdFLFxyXG4gICAgICAgIGltYWdlOiBpbWdcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVJbWFnZShpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFTU9WRV9JTUFHRSxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRTZWxlY3RlZEltYWdlSWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5BRERfU0VMRUNURURfSU1BR0VfSUQsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVNT1ZFX1NFTEVDVEVEX0lNQUdFX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5DTEVBUl9TRUxFQ1RFRF9JTUFHRV9JRFNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVJbWFnZShpZCwgdXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lICsgXCImaWQ9XCIgKyBpZDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBkaXNwYXRjaChyZW1vdmVJbWFnZShpZCkpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRJbWFnZSh1c2VybmFtZSwgZm9ybURhdGEpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSksIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICBjb25zdCBvblN1Y2Nlc3MgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gZGF0YS5tYXAobm9ybWFsaXplSW1hZ2UpLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVjaWV2ZWRVc2VySW1hZ2VzKG5vcm1hbGl6ZWQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzcywgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBpbWFnZUlkcyA9IFtdKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCBpZHMgPSBpbWFnZUlkcy5qb2luKCk7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlcyArIFwiP3VzZXJuYW1lPVwiICsgdXNlcm5hbWUgKyBcIiZpZHM9XCIgKyBpZHM7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkpLCBvblJlamVjdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0SW1hZ2VPd25lcih1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIC8vIExhenkgZXZhbHVhdGlvblxyXG4gICAgICAgIGNvbnN0IGZpbmRPd25lciA9ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbmQoZ2V0U3RhdGUoKS51c2Vyc0luZm8udXNlcnMsICh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXNlci5Vc2VybmFtZSA9PSB1c2VybmFtZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3duZXIgPSBmaW5kT3duZXIoKTtcclxuXHJcbiAgICAgICAgaWYob3duZXIpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3duZXJJZCA9IG93bmVyLklEO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lcklkKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBnbG9iYWxzLnVybHMudXNlcnMgKyAnP3VzZXJuYW1lPScgKyB1c2VybmFtZTtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbih1c2VyID0+IGRpc3BhdGNoKGFkZFVzZXIodXNlcikpLCBvblJlamVjdClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvd25lciA9IGZpbmRPd25lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEltYWdlc093bmVyKG93bmVyLklEKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHByb21pc2VHZXRJbWFnZSA9IChpZCwgZ2V0U3RhdGUpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGltYWdlcyA9IGdldFN0YXRlKCkuaW1hZ2VzSW5mby5pbWFnZXM7XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBmaW5kKGltYWdlcywgKGltZykgPT4gaW1nLkltYWdlSUQgPT0gaWQpO1xyXG5cclxuICAgICAgICBpZihpbWFnZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlamVjdChFcnJvcihcIkltYWdlIGRvZXMgbm90IGV4aXN0IGxvY2FsbHkhXCIpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoU2luZ2xlSW1hZ2UoaWQpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCIvZ2V0YnlpZD9pZD1cIiArIGlkO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKCFpbWcpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJbWFnZSA9IG5vcm1hbGl6ZUltYWdlKGltZyk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRJbWFnZShub3JtYWxpemVkSW1hZ2UpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFySW5wdXQoZmlsZUlucHV0KSB7XHJcbiAgICAgICAgaWYoZmlsZUlucHV0LnZhbHVlKXtcclxuICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7IC8vZm9yIElFMTEsIGxhdGVzdCBDaHJvbWUvRmlyZWZveC9PcGVyYS4uLlxyXG4gICAgICAgICAgICB9Y2F0Y2goZXJyKXsgfVxyXG4gICAgICAgICAgICBpZihmaWxlSW5wdXQudmFsdWUpeyAvL2ZvciBJRTUgfiBJRTEwXHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gZmlsZUlucHV0LnBhcmVudE5vZGUsIHJlZiA9IGZpbGVJbnB1dC5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoZmlsZUlucHV0KTtcclxuICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZpbGVJbnB1dCxyZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEZpbGVzKCkge1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICByZXR1cm4gKGZpbGVzID8gZmlsZXMuZmlsZXMgOiBbXSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU3VibWl0KGUpIHtcclxuICAgICAgICBjb25zdCB7IHVwbG9hZEltYWdlLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLmdldEZpbGVzKCk7XHJcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gZmlsZXNbaV07XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhKTtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJJbnB1dChmaWxlSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUJ0bigpIHtcclxuICAgICAgICBjb25zdCB7IGhhc0ltYWdlcywgZGVsZXRlU2VsZWN0ZWRJbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChoYXNJbWFnZXMgP1xyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXJcIiBvbkNsaWNrPXtkZWxldGVTZWxlY3RlZEltYWdlc30+U2xldCBtYXJrZXJldCBiaWxsZWRlcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgOiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlclwiIG9uQ2xpY2s9e2RlbGV0ZVNlbGVjdGVkSW1hZ2VzfSBkaXNhYmxlZD1cImRpc2FibGVkXCI+U2xldCBtYXJrZXJldCBiaWxsZWRlcjwvYnV0dG9uPik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Zm9ybVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cImZvcm0tdXBsb2FkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmN0eXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJmaWxlc1wiPlVwbG9hZCBmaWxlcjo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiZmlsZXNcIiBuYW1lPVwiZmlsZXNcIiBtdWx0aXBsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBpZD1cInVwbG9hZFwiPlVwbG9hZDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeydcXHUwMEEwJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmRlbGV0ZUJ0bigpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICAvLyBCaW5kICd0aGlzJyB0byBmdW5jdGlvbnNcclxuICAgICAgICB0aGlzLmNoZWNrYm94SGFuZGxlciA9IHRoaXMuY2hlY2tib3hIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tib3hIYW5kbGVyKGUpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGFkZCA9IGUuY3VycmVudFRhcmdldC5jaGVja2VkO1xyXG4gICAgICAgIGlmKGFkZCkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGFkZFNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgeyByZW1vdmVTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tbWVudEljb24oY291bnQpIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IGNvdW50ID09IDAgPyBcImNvbC1sZy02IHRleHQtbXV0ZWRcIiA6IFwiY29sLWxnLTYgdGV4dC1wcmltYXJ5XCI7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogc3R5bGVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gIDxkaXYgey4uLiBwcm9wc30+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1jb21tZW50XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiB7Y291bnR9ICAgXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxuXHJcbiAgICBjaGVja2JveFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCBpbWFnZUlzU2VsZWN0ZWQsIGltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGNoZWNrZWQgPSBpbWFnZUlzU2VsZWN0ZWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgcmV0dXJuIChjYW5FZGl0ID8gXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTYgcHVsbC1yaWdodCB0ZXh0LXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgU2xldCA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DbGljaz17dGhpcy5jaGVja2JveEhhbmRsZXJ9IGNoZWNrZWQ9e2NoZWNrZWR9IC8+IFxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG5yZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IGltYWdlLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgIGxldCBjb3VudCA9IGltYWdlLkNvbW1lbnRDb3VudDtcclxuICAgIHJldHVybiAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZS5JbWFnZUlEfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZS5QcmV2aWV3VXJsfSBjbGFzc05hbWU9XCJpbWctdGh1bWJuYWlsXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2AvJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlLkltYWdlSUR9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmNvbW1lbnRJY29uKGNvdW50KX0gXHJcbiAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLmNoZWNrYm94VmlldygpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcbiAgICAgICAgICAgICAgICAvLzxhIG9uQ2xpY2s9e3RoaXMuc2VsZWN0SW1hZ2V9IHN0eWxlPXt7Y3Vyc29yOiBcInBvaW50ZXJcIiwgdGV4dERlY29yYXRpb246IFwibm9uZVwifX0+XHJcbiAgICAgICAgICAgICAgICAvLzwvYT5cclxuXHJcbiAgICAgICAgLy9yZXR1cm4gKCBjb3VudCA9PSAwID9cclxuICAgICAgICAvLyAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02IHRleHQtbXV0ZWRcIj4gXHJcbiAgICAgICAgLy8gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tY29tbWVudFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4ge2NvdW50fVxyXG4gICAgICAgIC8vICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgIDpcclxuICAgICAgICAvLyAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02IHRleHQtcHJpbWFyeVwiIHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInIH19PlxyXG4gICAgICAgIC8vICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNvbW1lbnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IHtjb3VudH1cclxuICAgICAgICAvLyAgICA8L2Rpdj5cclxuICAgICAgICAvLyk7Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBJbWFnZSB9IGZyb20gJy4vSW1hZ2UnXHJcblxyXG5jb25zdCBlbGVtZW50c1BlclJvdyA9IDQ7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZUxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgYXJyYW5nZUFycmF5KGltYWdlcykge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGltYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgdGltZXMgPSBNYXRoLmNlaWwobGVuZ3RoIC8gZWxlbWVudHNQZXJSb3cpO1xyXG5cclxuICAgICAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRpbWVzOyBpKyspIHtcclxuICAgICAgICAgICAgc3RhcnQgPSBpICogZWxlbWVudHNQZXJSb3c7XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgZWxlbWVudHNQZXJSb3c7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBlbmQgPiBsZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxhc3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGltYWdlcy5zbGljZShzdGFydCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyb3cpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gaW1hZ2VzLnNsaWNlKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBpbWFnZXNWaWV3KGltYWdlcykge1xyXG4gICAgICAgIGlmKGltYWdlcy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCwgZGVsZXRlU2VsZWN0ZWRJbWFnZXMsIGNhbkVkaXQsIGltYWdlSXNTZWxlY3RlZCwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hcnJhbmdlQXJyYXkoaW1hZ2VzKTtcclxuICAgICAgICBjb25zdCB2aWV3ID0gcmVzdWx0Lm1hcCgocm93LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGltZ3MgPSByb3cubWFwKChpbWcpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctM1wiIGtleT17aW1nLkltYWdlSUR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlPXtpbWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkPXthZGRTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQ9e3JlbW92ZVNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSXNTZWxlY3RlZD17aW1hZ2VJc1NlbGVjdGVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByb3dJZCA9IFwicm93SWRcIiArIGk7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIGtleT17cm93SWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtpbWdzfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aWV3O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICB7dGhpcy5pbWFnZXNWaWV3KGltYWdlcyl9XHJcbiAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSwgYWRkU2VsZWN0ZWRJbWFnZUlkLCAgZGVsZXRlSW1hZ2VzLCByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvaW1hZ2VzJ1xyXG5pbXBvcnQgeyBFcnJvciB9IGZyb20gJy4vRXJyb3InXHJcbmltcG9ydCB7IEltYWdlVXBsb2FkIH0gZnJvbSAnLi4vaW1hZ2VzL0ltYWdlVXBsb2FkJ1xyXG5pbXBvcnQgSW1hZ2VMaXN0IGZyb20gJy4uL2ltYWdlcy9JbWFnZUxpc3QnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBvd25lcklkICA9IHN0YXRlLmltYWdlc0luZm8ub3duZXJJZDtcclxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkO1xyXG4gICAgY29uc3QgY2FuRWRpdCA9IChvd25lcklkID4gMCAmJiBjdXJyZW50SWQgPiAwICYmIG93bmVySWQgPT0gY3VycmVudElkKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGltYWdlczogc3RhdGUuaW1hZ2VzSW5mby5pbWFnZXMsXHJcbiAgICAgICAgY2FuRWRpdDogY2FuRWRpdCxcclxuICAgICAgICBzZWxlY3RlZEltYWdlSWRzOiBzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZHMsXHJcbiAgICAgICAgZ2V0RnVsbG5hbWU6ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gc3RhdGUudXNlcnNJbmZvLnVzZXJzLmZpbHRlcih1ID0+IHUuVXNlcm5hbWUudG9VcHBlckNhc2UoKSA9PSB1c2VybmFtZS50b1VwcGVyQ2FzZSgpKVswXTtcclxuICAgICAgICAgICAgY29uc3QgZnVsbG5hbWUgPSAodXNlcikgPyB1c2VyLkZpcnN0TmFtZSArIFwiIFwiICsgdXNlci5MYXN0TmFtZSA6ICdVc2VyJztcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBsb2FkSW1hZ2U6ICh1c2VybmFtZSwgZm9ybURhdGEpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2godXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBJbWFnZXMgdG8gYmUgZGVsZXRlZCBieSBzZWxlY3Rpb246XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGFkZFNlbGVjdGVkSW1hZ2VJZChpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgLy8gSW1hZ2VzIHRvIGJlIGRlbGV0ZWQgYnkgc2VsZWN0aW9uOlxyXG4gICAgICAgICAgICBkaXNwYXRjaChyZW1vdmVTZWxlY3RlZEltYWdlSWQoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUltYWdlczogKHVzZXJuYW1lLCBpZHMpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBpZHMpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsZWFyU2VsZWN0ZWRJbWFnZUlkczogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBVc2VySW1hZ2VzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VJc1NlbGVjdGVkID0gdGhpcy5pbWFnZUlzU2VsZWN0ZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzID0gdGhpcy5kZWxldGVTZWxlY3RlZEltYWdlcy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZCA9IHRoaXMuY2xlYXJTZWxlY3RlZC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgcm91dGVyLCByb3V0ZSB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB1c2VybmFtZSArIFwiJ3MgYmlsbGVkZXJcIjtcclxuICAgICAgICByb3V0ZXIuc2V0Um91dGVMZWF2ZUhvb2socm91dGUsIHRoaXMuY2xlYXJTZWxlY3RlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTZWxlY3RlZCgpIHtcclxuICAgICAgICBjb25zdCB7IGNsZWFyU2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpbWFnZUlzU2VsZWN0ZWQoY2hlY2tJZCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXMgPSBmaW5kKHNlbGVjdGVkSW1hZ2VJZHMsIChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaWQgPT0gY2hlY2tJZDtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzKCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0ZWRJbWFnZUlkcywgZGVsZXRlSW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgc2VsZWN0ZWRJbWFnZUlkcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBsb2FkVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIHVwbG9hZEltYWdlLCBzZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IGhhc0ltYWdlcyA9IHNlbGVjdGVkSW1hZ2VJZHMubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgY2FuRWRpdCA/IFxyXG4gICAgICAgICAgICA8SW1hZ2VVcGxvYWRcclxuICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlPXt1cGxvYWRJbWFnZX1cclxuICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgICAgICAgIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzPXt0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzfVxyXG4gICAgICAgICAgICAgICAgaGFzSW1hZ2VzPXtoYXNJbWFnZXN9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHMucGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VzLCBnZXRGdWxsbmFtZSwgY2FuRWRpdCwgYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgZnVsbE5hbWUgPSBnZXRGdWxsbmFtZSh1c2VybmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0yIGNvbC1sZy04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxPjxzcGFuIGNsYXNzTmFtZT1cInRleHQtY2FwaXRhbGl6ZVwiPntmdWxsTmFtZX0nczwvc3Bhbj4gPHNtYWxsPmJpbGxlZGUgZ2FsbGVyaTwvc21hbGw+PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8SW1hZ2VMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlcz17aW1hZ2VzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ9e2FkZFNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkPXtyZW1vdmVTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSXNTZWxlY3RlZD17dGhpcy5pbWFnZUlzU2VsZWN0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnVwbG9hZFZpZXcoKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFVzZXJJbWFnZXNSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFVzZXJJbWFnZXNDb250YWluZXIpO1xyXG5jb25zdCBVc2VySW1hZ2VzID0gd2l0aFJvdXRlcihVc2VySW1hZ2VzUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBVc2VySW1hZ2VzO1xyXG4iLCLvu79pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgbm9ybWFsaXplQ29tbWVudCwgdmlzaXRDb21tZW50cywgcmVzcG9uc2VIYW5kbGVyLCBvblJlamVjdCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgYWRkVXNlciB9IGZyb20gJy4vdXNlcnMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldFNraXBDb21tZW50cyA9IChza2lwKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1NLSVBfQ09NTUVOVFMsXHJcbiAgICAgICAgc2tpcDogc2tpcFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRTa2lwID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9ERUZBVUxUX1NLSVBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRUYWtlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9ERUZBVUxUX1RBS0VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFRha2VDb21tZW50cyA9ICh0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RBS0VfQ09NTUVOVFMsXHJcbiAgICAgICAgdGFrZTogdGFrZVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRQYWdlKHBhZ2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfQ1VSUkVOVF9QQUdFLFxyXG4gICAgICAgIHBhZ2U6IHBhZ2VcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUb3RhbFBhZ2VzKHRvdGFsUGFnZXMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVE9UQUxfUEFHRVMsXHJcbiAgICAgICAgdG90YWxQYWdlczogdG90YWxQYWdlc1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRDb21tZW50cyA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9DT01NRU5UU1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjZWl2ZWRDb21tZW50cyhjb21tZW50cykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFQ0lFVkVEX0NPTU1FTlRTLFxyXG4gICAgICAgIGNvbW1lbnRzOiBjb21tZW50c1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmNvbW1lbnRzICsgXCI/aW1hZ2VJZD1cIiArIGltYWdlSWQgKyBcIiZza2lwPVwiICsgc2tpcCArIFwiJnRha2U9XCIgKyB0YWtlO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBVbnByb2Nlc3NlZCBjb21tZW50c1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFnZUNvbW1lbnRzID0gZGF0YS5DdXJyZW50SXRlbXM7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2V0IChyZS1zZXQpIGluZm9cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFNraXBDb21tZW50cyhza2lwKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUYWtlQ29tbWVudHModGFrZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0Q3VycmVudFBhZ2UoZGF0YS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxQYWdlcyhkYXRhLlRvdGFsUGFnZXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBWaXNpdCBldmVyeSBjb21tZW50IGFuZCBhZGQgdGhlIHVzZXJcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZEF1dGhvciA9IChjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWMuRGVsZXRlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkVXNlcihjLkF1dGhvcikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmlzaXRDb21tZW50cyhwYWdlQ29tbWVudHMsIGFkZEF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTm9ybWFsaXplOiBmaWx0ZXIgb3V0IHVzZXJcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1lbnRzID0gcGFnZUNvbW1lbnRzLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVkQ29tbWVudHMoY29tbWVudHMpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcG9zdENvbW1lbnQgPSAoaW1hZ2VJZCwgdGV4dCwgcGFyZW50Q29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmNvbW1lbnRzO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBjb25zdCBib2R5ID1KU09OLnN0cmluZ2lmeSh7IFxyXG4gICAgICAgICAgICBUZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICBJbWFnZUlEOiBpbWFnZUlkLFxyXG4gICAgICAgICAgICBQYXJlbnRJRDogcGFyZW50Q29tbWVudElkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChpbmNyZW1lbnRDb21tZW50Q291bnQoaW1hZ2VJZCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGVkaXRDb21tZW50ID0gKGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmNvbW1lbnRzICsgXCI/aW1hZ2VJZD1cIiArIGltYWdlSWQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBJRDogY29tbWVudElkLCBUZXh0OiB0ZXh0fSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlQ29tbWVudCA9IChjb21tZW50SWQsIGltYWdlSWQpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IGdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cyArIFwiP2NvbW1lbnRJZD1cIiArIGNvbW1lbnRJZDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGRlY3JlbWVudENvbW1lbnRDb3VudChpbWFnZUlkKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluY3JlbWVudENvbW1lbnRDb3VudCA9IChpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuSU5DUl9DT01NRU5UX0NPVU5ULFxyXG4gICAgICAgIGltYWdlSWQ6IGltYWdlSWRcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlY3JlbWVudENvbW1lbnRDb3VudCA9IChpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuREVDUl9DT01NRU5UX0NPVU5ULFxyXG4gICAgICAgIGltYWdlSWQ6IGltYWdlSWRcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudERlbGV0ZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbGllcywgaGFuZGxlcnMsIGNvbnN0cnVjdENvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSBjb25zdHJ1Y3RDb21tZW50cyhyZXBsaWVzLCBoYW5kbGVycyk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYSBwdWxsLWxlZnQgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWxlZnRcIiBzdHlsZT17e21pbldpZHRoOiBcIjc0cHhcIn19PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnNsZXR0ZXQ8L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgIHtyZXBseU5vZGVzfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5jb25zdCBpZHMgPSAoY29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlcGx5SWQ6IGNvbW1lbnRJZCArICdfcmVwbHknLFxyXG4gICAgICAgIGVkaXRJZDogY29tbWVudElkICsgJ19lZGl0JyxcclxuICAgICAgICBkZWxldGVJZDogY29tbWVudElkICsgJ19kZWxldGUnLFxyXG4gICAgICAgIGVkaXRDb2xsYXBzZTogY29tbWVudElkICsgJ19lZGl0Q29sbGFwc2UnLFxyXG4gICAgICAgIHJlcGx5Q29sbGFwc2U6IGNvbW1lbnRJZCArICdfcmVwbHlDb2xsYXBzZSdcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Q29udHJvbHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGV4dDogcHJvcHMudGV4dCxcclxuICAgICAgICAgICAgcmVwbHk6ICcnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0ID0gdGhpcy5lZGl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZXBseSA9IHRoaXMucmVwbHkuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlID0gdGhpcy5oYW5kbGVSZXBseUNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGVkaXQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0SGFuZGxlLCBjb21tZW50SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdENvbGxhcHNlIH0gPSBpZHMoY29tbWVudElkKTtcclxuXHJcbiAgICAgICAgZWRpdEhhbmRsZShjb21tZW50SWQsIHRleHQpO1xyXG4gICAgICAgICQoXCIjXCIgKyBlZGl0Q29sbGFwc2UpLmNvbGxhcHNlKCdoaWRlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbHkoKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSwgY29tbWVudElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHkgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUNvbGxhcHNlIH0gPSBpZHMoY29tbWVudElkKTtcclxuXHJcbiAgICAgICAgcmVwbHlIYW5kbGUoY29tbWVudElkLCByZXBseSk7XHJcbiAgICAgICAgJChcIiNcIiArIHJlcGx5Q29sbGFwc2UpLmNvbGxhcHNlKCdoaWRlJyk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5OiAnJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93VG9vbHRpcChpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYnRuID0gXCIjXCIgKyBjb21tZW50SWQgKyBcIl9cIiArIGl0ZW07XHJcbiAgICAgICAgJChidG4pLnRvb2x0aXAoJ3Nob3cnKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlUmVwbHlDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXBseTogZS50YXJnZXQudmFsdWUgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBjb21tZW50SWQsIGNhbkVkaXQsIGRlbGV0ZUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGVkaXRDb2xsYXBzZSwgcmVwbHlDb2xsYXBzZSwgcmVwbHlJZCwgZWRpdElkLCBkZWxldGVJZCB9ID0gaWRzKGNvbW1lbnRJZCk7XHJcbiAgICAgICAgY29uc3QgZWRpdFRhcmdldCA9IFwiI1wiICsgZWRpdENvbGxhcHNlO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5VGFyZ2V0ID0gXCIjXCIgKyByZXBseUNvbGxhcHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBjYW5FZGl0ID9cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4JywgcGFkZGluZ0xlZnQ6IFwiMTVweFwifX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtkZWxldGVIYW5kbGUuYmluZChudWxsLCBjb21tZW50SWQpfSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ2RlbGV0ZScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2RlbGV0ZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiU2xldFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsYWJlbCBsYWJlbC1kYW5nZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXRyYXNoXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPnsnXFx1MDBBMCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17ZWRpdFRhcmdldH0gc3R5bGU9e3sgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdlZGl0Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17ZWRpdElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiw4ZuZHJlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBlbmNpbFwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj57J1xcdTAwQTAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ3JlcGx5Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17cmVwbHlJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlN2YXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtcHJpbWFyeVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tZW52ZWxvcGVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17e3BhZGRpbmdCb3R0b206ICc1cHgnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwIGNvbGxhcHNlXCIgaWQ9e2VkaXRDb2xsYXBzZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS50ZXh0fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVUZXh0Q2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7dGV4dDogdGV4dH0pfSBkYXRhLXRhcmdldD17ZWRpdFRhcmdldH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4taW5mb1wiIG9uQ2xpY2s9e3RoaXMuZWRpdH0+R2VtIMOmbmRyaW5nZXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctMTAgY29sbGFwc2VcIiBpZD17cmVwbHlDb2xsYXBzZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS5yZXBseX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVwbHlDaGFuZ2V9IHJvd3M9XCI0XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17cmVwbHlUYXJnZXR9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiPkx1azwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWluZm9cIiBvbkNsaWNrPXt0aGlzLnJlcGx5fT5TdmFyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+IDogXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7cGFkZGluZ0JvdHRvbTogJzVweCcsIHBhZGRpbmdMZWZ0OiAnMTVweCd9fT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17cmVwbHlUYXJnZXR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdyZXBseScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e3JlcGx5SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTdmFyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXByaW1hcnlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwIGNvbGxhcHNlXCIgaWQ9e3JlcGx5Q29sbGFwc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUucmVwbHl9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1pbmZvXCIgb25DbGljaz17dGhpcy5yZXBseX0+U3ZhcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50Q29udHJvbHMgfSBmcm9tICcuL0NvbW1lbnRDb250cm9scydcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tICcuL0NvbW1lbnRQcm9maWxlJ1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCB0aW1lVGV4dCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRJZCwgcG9zdGVkT24sIGF1dGhvcklkLCB0ZXh0LCByZXBsaWVzLCBoYW5kbGVycywgY29uc3RydWN0Q29tbWVudHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSwgZWRpdEhhbmRsZSwgZGVsZXRlSGFuZGxlLCBjYW5FZGl0LCBnZXRVc2VyIH0gPSBoYW5kbGVycztcclxuICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRVc2VyKGF1dGhvcklkKTtcclxuICAgICAgICBjb25zdCBmdWxsbmFtZSA9IGF1dGhvci5GaXJzdE5hbWUgKyBcIiBcIiArIGF1dGhvci5MYXN0TmFtZTtcclxuICAgICAgICBjb25zdCBjYW5FZGl0VmFsID0gY2FuRWRpdChhdXRob3JJZCk7XHJcbiAgICAgICAgY29uc3QgcmVwbHlOb2RlcyA9IGNvbnN0cnVjdENvbW1lbnRzKHJlcGxpZXMsIGhhbmRsZXJzKTtcclxuICAgICAgICBjb25zdCB0eHQgPSBmb3JtYXRUZXh0KHRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhIHB1bGwtbGVmdCB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFByb2ZpbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cIm1lZGlhLWhlYWRpbmdcIj48c3Ryb25nPntmdWxsbmFtZX08L3N0cm9uZz4gPFBvc3RlZE9uIHBvc3RlZE9uPXtwb3N0ZWRPbn0gLz48L2g1PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17dHh0fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50Q29udHJvbHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXRWYWx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50SWQ9e2NvbW1lbnRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUhhbmRsZT17ZGVsZXRlSGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdEhhbmRsZT17ZWRpdEhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGx5SGFuZGxlPXtyZXBseUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e3RleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtyZXBseU5vZGVzfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQb3N0ZWRPbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBhZ28oKSB7XHJcbiAgICAgICAgY29uc3QgeyBwb3N0ZWRPbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gdGltZVRleHQocG9zdGVkT24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKDxzbWFsbD5zYWdkZSB7dGhpcy5hZ28oKX08L3NtYWxsPik7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50RGVsZXRlZCB9IGZyb20gJy4vQ29tbWVudERlbGV0ZWQnXHJcbmltcG9ydCB7IENvbW1lbnQgfSBmcm9tICcuL0NvbW1lbnQnXHJcblxyXG5jb25zdCBjb21wYWN0SGFuZGxlcnMgPSAocmVwbHlIYW5kbGUsIGVkaXRIYW5kbGUsIGRlbGV0ZUhhbmRsZSwgY2FuRWRpdCwgZ2V0VXNlcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXBseUhhbmRsZSxcclxuICAgICAgICBlZGl0SGFuZGxlLFxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZSxcclxuICAgICAgICBjYW5FZGl0LFxyXG4gICAgICAgIGdldFVzZXJcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnRMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdENvbW1lbnRzKGNvbW1lbnRzLCBoYW5kbGVycykge1xyXG4gICAgICAgIGlmICghY29tbWVudHMgfHwgY29tbWVudHMubGVuZ3RoID09IDApIHJldHVybjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbW1lbnRzLm1hcCgoY29tbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBcImNvbW1lbnRJZFwiICsgY29tbWVudC5Db21tZW50SUQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tbWVudC5EZWxldGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWFcIiBrZXk9e2tleX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50RGVsZXRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17a2V5fSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsaWVzPXtjb21tZW50LlJlcGxpZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcnM9e2hhbmRsZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdENvbW1lbnRzPXtjb25zdHJ1Y3RDb21tZW50c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWFcIiBrZXk9e2tleX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2tleX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdGVkT249e2NvbW1lbnQuUG9zdGVkT259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9ySWQ9e2NvbW1lbnQuQXV0aG9ySUR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXtjb21tZW50LlRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGllcz17Y29tbWVudC5SZXBsaWVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRJZD17Y29tbWVudC5Db21tZW50SUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcnM9e2hhbmRsZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdENvbW1lbnRzPXtjb25zdHJ1Y3RDb21tZW50c31cclxuICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRzLCByZXBseUhhbmRsZSwgZWRpdEhhbmRsZSwgZGVsZXRlSGFuZGxlLCBjYW5FZGl0LCBnZXRVc2VyLCB1c2VySWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSBjb21wYWN0SGFuZGxlcnMocmVwbHlIYW5kbGUsIGVkaXRIYW5kbGUsIGRlbGV0ZUhhbmRsZSwgY2FuRWRpdCwgZ2V0VXNlcik7XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmNvbnN0cnVjdENvbW1lbnRzKGNvbW1lbnRzLCBoYW5kbGVycyk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtub2Rlc31cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBQYWdpbmF0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHByZXZWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY3VycmVudFBhZ2UsIHByZXYgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgaGFzUHJldiA9ICEoY3VycmVudFBhZ2UgPT09IDEpO1xyXG4gICAgICAgIGlmIChoYXNQcmV2KVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGFyaWEtbGFiZWw9XCJQcmV2aW91c1wiIG9uQ2xpY2s9e3ByZXZ9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZsYXF1bzs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZGlzYWJsZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mbGFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9saT4pO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHRWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG90YWxQYWdlcywgY3VycmVudFBhZ2UsIG5leHQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgaGFzTmV4dCA9ICEodG90YWxQYWdlcyA9PT0gY3VycmVudFBhZ2UpICYmICEodG90YWxQYWdlcyA9PT0gMCk7XHJcbiAgICAgICAgaWYoaGFzTmV4dClcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBhcmlhLWxhYmVsPVwiTmV4dFwiIG9uQ2xpY2s9e25leHR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZyYXF1bzs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZGlzYWJsZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mcmFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9saT4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRvdGFsUGFnZXMsIGltYWdlSWQsIGN1cnJlbnRQYWdlLCBnZXRQYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGxldCBwYWdlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IHRvdGFsUGFnZXM7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBcInBhZ2VfaXRlbV9cIiArIChpbWFnZUlkICsgaSk7XHJcbiAgICAgICAgICAgIGlmIChpID09PSBjdXJyZW50UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgcGFnZXMucHVzaCg8bGkgY2xhc3NOYW1lPVwiYWN0aXZlXCIga2V5PXtrZXl9PjxhIGhyZWY9XCIjXCIga2V5PXtrZXkgfT57aX08L2E+PC9saT4pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFnZXMucHVzaCg8bGkga2V5PXtrZXkgfSBvbkNsaWNrPXtnZXRQYWdlLmJpbmQobnVsbCwgaSl9PjxhIGhyZWY9XCIjXCIga2V5PXtrZXkgfT57aX08L2E+PC9saT4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzaG93ID0gKHBhZ2VzLmxlbmd0aCA+IDApO1xyXG5cclxuICAgICAgICByZXR1cm4oXHJcbiAgICAgICAgICAgIHNob3cgP1xyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bmF2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcmV2VmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtwYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5uZXh0VmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L25hdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgOiBudWxsKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Rm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBUZXh0OiAnJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucG9zdENvbW1lbnQgPSB0aGlzLnBvc3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdENvbW1lbnQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyBwb3N0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHBvc3RIYW5kbGUodGhpcy5zdGF0ZS5UZXh0KTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGV4dDogJycgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLnBvc3RDb21tZW50fT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicmVtYXJrXCI+S29tbWVudGFyPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVUZXh0Q2hhbmdlfSB2YWx1ZT17dGhpcy5zdGF0ZS5UZXh0fSBwbGFjZWhvbGRlcj1cIlNrcml2IGtvbW1lbnRhciBoZXIuLi5cIiBpZD1cInJlbWFya1wiIHJvd3M9XCI0XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+U2VuZDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgZmV0Y2hDb21tZW50cywgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9jb21tZW50cydcclxuaW1wb3J0IHsgQ29tbWVudExpc3QgfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50TGlzdCdcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gJy4uL2NvbW1lbnRzL1BhZ2luYXRpb24nXHJcbmltcG9ydCB7IENvbW1lbnRGb3JtIH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudEZvcm0nXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW1hZ2VJZDogc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWQsXHJcbiAgICAgICAgc2tpcDogc3RhdGUuY29tbWVudHNJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUuY29tbWVudHNJbmZvLnRha2UsXHJcbiAgICAgICAgcGFnZTogc3RhdGUuY29tbWVudHNJbmZvLnBhZ2UsXHJcbiAgICAgICAgdG90YWxQYWdlczogc3RhdGUuY29tbWVudHNJbmZvLnRvdGFsUGFnZXMsXHJcbiAgICAgICAgY29tbWVudHM6IHN0YXRlLmNvbW1lbnRzSW5mby5jb21tZW50cyxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IGZpbmQoc3RhdGUudXNlcnNJbmZvLnVzZXJzLCAodSkgPT4gdS5JRCA9PSBpZCksXHJcbiAgICAgICAgY2FuRWRpdDogKHVzZXJJZCkgPT4gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQgPT0gdXNlcklkLFxyXG4gICAgICAgIHVzZXJJZDogc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWRcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxvYWRDb21tZW50czogKGltYWdlSWQsIHNraXAsIHRha2UpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0UmVwbHk6IChpbWFnZUlkLCByZXBseUlkLCB0ZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KGltYWdlSWQsIHRleHQsIHJlcGx5SWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RDb21tZW50OiAoaW1hZ2VJZCwgdGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudChpbWFnZUlkLCB0ZXh0LCBudWxsKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlZGl0Q29tbWVudDogKGltYWdlSWQsIGNvbW1lbnRJZCwgdGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChlZGl0Q29tbWVudChjb21tZW50SWQsIGltYWdlSWQsIHRleHQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUNvbW1lbnQ6IChpbWFnZUlkLCBjb21tZW50SWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlQ29tbWVudChjb21tZW50SWQsIGltYWdlSWQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENvbW1lbnRzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMubmV4dFBhZ2UgPSB0aGlzLm5leHRQYWdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5nZXRQYWdlID0gdGhpcy5nZXRQYWdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91c1BhZ2UgPSB0aGlzLnByZXZpb3VzUGFnZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHRQYWdlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBpbWFnZUlkLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHNraXBOZXh0ID0gc2tpcCArIHRha2U7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXBOZXh0LCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYWdlKHBhZ2UpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBza2lwUGFnZXMgPSBwYWdlIC0gMTtcclxuICAgICAgICBjb25zdCBza2lwSXRlbXMgPSAoc2tpcFBhZ2VzICogdGFrZSk7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXBJdGVtcywgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJldmlvdXNQYWdlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBpbWFnZUlkLCBza2lwLCB0YWtlfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYmFja1NraXAgPSBza2lwIC0gdGFrZTtcclxuICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgYmFja1NraXAsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBpbWFnZUlkLCBza2lwLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50cywgcG9zdFJlcGx5LCBlZGl0Q29tbWVudCwgcG9zdENvbW1lbnQsXHJcbiAgICAgICAgICAgICAgICBkZWxldGVDb21tZW50LCBjYW5FZGl0LCBnZXRVc2VyLFxyXG4gICAgICAgICAgICAgICAgdXNlcklkLCBpbWFnZUlkLCBwYWdlLCB0b3RhbFBhZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctMTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50cz17Y29tbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBseUhhbmRsZT17cG9zdFJlcGx5LmJpbmQobnVsbCwgaW1hZ2VJZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0SGFuZGxlPXtlZGl0Q29tbWVudC5iaW5kKG51bGwsIGltYWdlSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlSGFuZGxlPXtkZWxldGVDb21tZW50LmJpbmQobnVsbCwgaW1hZ2VJZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VXNlcj17Z2V0VXNlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPFBhZ2luYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e2ltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGFnZT17cGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM9e3RvdGFsUGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0PXt0aGlzLm5leHRQYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldj17dGhpcy5wcmV2aW91c1BhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQYWdlPXt0aGlzLmdldFBhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctMTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRGb3JtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0SGFuZGxlPXtwb3N0Q29tbWVudC5iaW5kKG51bGwsIGltYWdlSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBDb21tZW50cyA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKENvbW1lbnRzQ29udGFpbmVyKTsiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IHNldFNlbGVjdGVkSW1nLCBmZXRjaFNpbmdsZUltYWdlLCBkZWxldGVJbWFnZSB9IGZyb20gJy4uLy4uL2FjdGlvbnMvaW1hZ2VzJ1xyXG5pbXBvcnQgeyBzZXRFcnJvciB9IGZyb20gJy4uLy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCB7IENvbW1lbnRzIH0gZnJvbSAnLi4vY29udGFpbmVycy9Db21tZW50cydcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3Qgb3duZXJJZCAgPSBzdGF0ZS5pbWFnZXNJbmZvLm93bmVySWQ7XHJcbiAgICBjb25zdCBjdXJyZW50SWQgPSBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZDtcclxuICAgIGNvbnN0IGNhbkVkaXQgPSAob3duZXJJZCA+IDAgJiYgY3VycmVudElkID4gMCAmJiBvd25lcklkID09IGN1cnJlbnRJZCk7XHJcblxyXG4gICAgY29uc3QgZ2V0SW1hZ2UgPSAoaWQpID0+IHtcclxuICAgICAgICByZXR1cm4gZmluZChzdGF0ZS5pbWFnZXNJbmZvLmltYWdlcywgaW1hZ2UgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaW1hZ2UuSW1hZ2VJRCA9PSBpZDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaW1hZ2UgPSAoKSA9PiBnZXRJbWFnZShzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCk7XHJcbiAgICBjb25zdCBmaWxlbmFtZSA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuRmlsZW5hbWU7IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IHByZXZpZXdVcmwgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLlByZXZpZXdVcmw7IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IGV4dGVuc2lvbiA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuRXh0ZW5zaW9uOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCBvcmlnaW5hbFVybCA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuT3JpZ2luYWxVcmw7IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IHVwbG9hZGVkID0gKCkgPT4geyBpZihpbWFnZSgpKSByZXR1cm4gaW1hZ2UoKS5VcGxvYWRlZDsgcmV0dXJuIG5ldyBEYXRlKCk7IH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjYW5FZGl0OiBjYW5FZGl0LFxyXG4gICAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZSgpLFxyXG4gICAgICAgIHByZXZpZXdVcmw6IHByZXZpZXdVcmwoKSxcclxuICAgICAgICBleHRlbnNpb246IGV4dGVuc2lvbigpLFxyXG4gICAgICAgIG9yaWdpbmFsVXJsOiBvcmlnaW5hbFVybCgpLFxyXG4gICAgICAgIHVwbG9hZGVkOiB1cGxvYWRlZCgpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXRTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTZWxlY3RlZEltZyhpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzZWxlY3RJbWFnZTogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRTZWxlY3RlZEltZyh1bmRlZmluZWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldEVycm9yOiAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IoZXJyb3IpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZldGNoSW1hZ2U6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFNpbmdsZUltYWdlKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJbWFnZTogKGlkLCB1c2VybmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVJbWFnZShpZCwgdXNlcm5hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1vZGFsSW1hZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVJbWFnZSA9IHRoaXMuZGVsZXRlSW1hZ2UuYmluZCh0aGlzKTsgXHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZXNlbGVjdEltYWdlLCBzZXRFcnJvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHB1c2ggfSA9IHRoaXMucHJvcHMucm91dGVyO1xyXG5cclxuICAgICAgICBjb25zdCBpc0xvYWRlZCA9IHR5cGVvZiAkICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgICAgIGlmKGlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKTtcclxuICAgICAgICAgICAgJChub2RlKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAkKG5vZGUpLm9uKCdoaWRlLmJzLm1vZGFsJywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlc2VsZWN0SW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdhbGxlcnlVcmwgPSAnLycgKyB1c2VybmFtZSArICcvZ2FsbGVyeSc7XHJcbiAgICAgICAgICAgICAgICBwdXNoKGdhbGxlcnlVcmwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNldEVycm9yKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnT29wcyBzb21ldGhpbmcgd2VudCB3cm9uZycsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnQ291bGQgbm90IGZpbmQgdGhlIGltYWdlLCBtYXliZSB0aGUgVVJMIGlzIGludmFsaWQgb3IgaXQgaGFzIGJlZW4gZGVsZXRlZCEnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJbWFnZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgaWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuXHJcbiAgICAgICAgZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKTtcclxuICAgICAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUltYWdlVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgY2FuRWRpdCA/XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5kZWxldGVJbWFnZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgU2xldCBiaWxsZWRlXHJcbiAgICAgICAgICAgIDwvYnV0dG9uPiA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGZpbGVuYW1lLCBwcmV2aWV3VXJsLCBleHRlbnNpb24sIG9yaWdpbmFsVXJsLCB1cGxvYWRlZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBuYW1lID0gZmlsZW5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgICAgICBjb25zdCB1cGxvYWREYXRlID0gbW9tZW50KHVwbG9hZGVkKTtcclxuICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gXCJVcGxvYWRlZCBkLiBcIiArIHVwbG9hZERhdGUuZm9ybWF0KFwiRCBNTU0gWVlZWSBcIikgKyBcImtsLiBcIiArIHVwbG9hZERhdGUuZm9ybWF0KFwiSDptbVwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsIGZhZGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZyBtb2RhbC1sZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGUgdGV4dC1jZW50ZXJcIj57bmFtZX08c3Bhbj48c21hbGw+IC0ge2RhdGVTdHJpbmd9PC9zbWFsbD48L3NwYW4+PC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17b3JpZ2luYWxVcmx9IHRhcmdldD1cIl9ibGFua1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImltZy1yZXNwb25zaXZlIGNlbnRlci1ibG9ja1wiIHNyYz17cHJldmlld1VybH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRzIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZGVsZXRlSW1hZ2VWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7J1xcdTAwQTAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFNlbGVjdGVkSW1hZ2VSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKE1vZGFsSW1hZ2UpO1xyXG5jb25zdCBTZWxlY3RlZEltYWdlID0gd2l0aFJvdXRlcihTZWxlY3RlZEltYWdlUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RlZEltYWdlOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcclxuaW1wb3J0IHsgY29ubmVjdCwgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3Jlcy9zdG9yZSdcclxuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZSwgSW5kZXhSb3V0ZSwgYnJvd3Nlckhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IGZldGNoQ3VycmVudFVzZXIgfSBmcm9tICcuL2FjdGlvbnMvdXNlcnMnXHJcbmltcG9ydCBNYWluIGZyb20gJy4vY29tcG9uZW50cy9NYWluJ1xyXG5pbXBvcnQgQWJvdXQgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQnXHJcbmltcG9ydCBIb21lIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL0hvbWUnXHJcbmltcG9ydCBVc2VycyBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9Vc2VycydcclxuaW1wb3J0IFVzZXJJbWFnZXMgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlckltYWdlcydcclxuaW1wb3J0IFNlbGVjdGVkSW1hZ2UgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvU2VsZWN0ZWRJbWFnZSdcclxuaW1wb3J0IHsgZmV0Y2hVc2VySW1hZ2VzLCBzZXRTZWxlY3RlZEltZywgZmV0Y2hTaW5nbGVJbWFnZSwgc2V0SW1hZ2VPd25lciB9IGZyb20gJy4vYWN0aW9ucy9pbWFnZXMnXHJcblxyXG5zdG9yZS5kaXNwYXRjaChmZXRjaEN1cnJlbnRVc2VyKGdsb2JhbHMuY3VycmVudFVzZXJuYW1lKSk7XHJcbm1vbWVudC5sb2NhbGUoJ2RhJyk7XHJcblxyXG5jb25zdCBzZWxlY3RJbWFnZSA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IGltYWdlSWQgPSBuZXh0U3RhdGUucGFyYW1zLmlkO1xyXG4gICAgc3RvcmUuZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaW1hZ2VJZCkpO1xyXG59XHJcblxyXG5jb25zdCBmZXRjaEltYWdlcyA9IChuZXh0U3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gbmV4dFN0YXRlLnBhcmFtcy51c2VybmFtZTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldEltYWdlT3duZXIodXNlcm5hbWUpKTtcclxuICAgIHN0b3JlLmRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpO1xyXG59XHJcblxyXG5SZWFjdERPTS5yZW5kZXIoXHJcbiAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cclxuICAgICAgICA8Um91dGVyIGhpc3Rvcnk9e2Jyb3dzZXJIaXN0b3J5fT5cclxuICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCIvXCIgY29tcG9uZW50PXtNYWlufT5cclxuICAgICAgICAgICAgICAgIDxJbmRleFJvdXRlIGNvbXBvbmVudD17SG9tZX0gLz5cclxuICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwidXNlcnNcIiBjb21wb25lbnQ9e1VzZXJzfSAvPlxyXG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCJhYm91dFwiIGNvbXBvbmVudD17QWJvdXR9IC8+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cIjp1c2VybmFtZS9nYWxsZXJ5XCIgY29tcG9uZW50PXtVc2VySW1hZ2VzfSBvbkVudGVyPXtmZXRjaEltYWdlc30+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCJpbWFnZS86aWRcIiBjb21wb25lbnQ9e1NlbGVjdGVkSW1hZ2V9IG9uRW50ZXI9e3NlbGVjdEltYWdlfT5cclxuICAgICAgICAgICAgICAgICAgICA8L1JvdXRlPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICA8L1JvdXRlcj5cclxuICAgIDwvUHJvdmlkZXI+LFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSk7XHJcblxyXG4vLzxSb3V0ZSBwYXRoPVwiY29tbWVudC86Y2lkXCIgY29tcG9uZW50PXsnU2luZ2xlIENvbW1lbnQnfSBvbkVudGVyPXsnZmV0Y2hTaW5nbGVDb21tZW50Q2hhaW4/J30gLz5cclxuLy88Um91dGUgcGF0aD1cImNvbW1lbnRzXCIgY29tcG9uZW50PXsnQ29tbWVudHMnfSBvbkVudGVyPXsnZmV0Y2hDb21tZW50cyd9IC8+Il0sIm5hbWVzIjpbImNvbnN0IiwiVC5TRVRfRVJST1JfVElUTEUiLCJULkNMRUFSX0VSUk9SX1RJVExFIiwiVC5TRVRfRVJST1JfTUVTU0FHRSIsIlQuQ0xFQVJfRVJST1JfTUVTU0FHRSIsIlQuU0VUX0hBU19FUlJPUiIsImxldCIsIlQuQUREX1VTRVIiLCJULlJFQ0lFVkVEX1VTRVJTIiwiVC5TRVRfQ1VSUkVOVF9VU0VSX0lEIiwiY29tYmluZVJlZHVjZXJzIiwiVC5TRVRfSU1BR0VTX09XTkVSIiwiVC5BRERfSU1BR0UiLCJULlJFQ0lFVkVEX1VTRVJfSU1BR0VTIiwiVC5SRU1PVkVfSU1BR0UiLCJULklOQ1JfQ09NTUVOVF9DT1VOVCIsIlQuREVDUl9DT01NRU5UX0NPVU5UIiwiVC5TRVRfU0VMRUNURURfSU1HIiwiVC5BRERfU0VMRUNURURfSU1BR0VfSUQiLCJULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCIsImZpbHRlciIsIlQuQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTIiwiVC5SRUNJRVZFRF9DT01NRU5UUyIsIlQuU0VUX1NLSVBfQ09NTUVOVFMiLCJULlNFVF9UQUtFX0NPTU1FTlRTIiwiVC5TRVRfQ1VSUkVOVF9QQUdFIiwiVC5TRVRfVE9UQUxfUEFHRVMiLCJtZXNzYWdlIiwic2tpcCIsIlQuU0VUX1NLSVBfV0hBVFNfTkVXIiwidGFrZSIsIlQuU0VUX1RBS0VfV0hBVFNfTkVXIiwicGFnZSIsIlQuU0VUX1BBR0VfV0hBVFNfTkVXIiwidG90YWxQYWdlcyIsIlQuU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVyIsIlQuQUREX0xBVEVTVCIsImNyZWF0ZVN0b3JlIiwiYXBwbHlNaWRkbGV3YXJlIiwic3VwZXIiLCJMaW5rIiwiSW5kZXhMaW5rIiwiRXJyb3IiLCJHcmlkIiwiTmF2YmFyIiwiTmF2IiwiY29ubmVjdCIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsIm1hcFN0YXRlVG9Qcm9wcyIsImZpbmQiLCJyb3ciLCJ3aXRoUm91dGVyIiwic2V0VG90YWxQYWdlcyIsInRoaXMiLCJQcm92aWRlciIsIlJvdXRlciIsImJyb3dzZXJIaXN0b3J5IiwiUm91dGUiLCJJbmRleFJvdXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLEFBQU9BLElBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFDbkQsQUFDQSxBQUFPQSxJQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDckMsQUFBT0EsSUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDO0FBQzND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