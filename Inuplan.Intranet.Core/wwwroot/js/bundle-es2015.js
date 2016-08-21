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
        return  React.createElement( reactBootstrap.Media.ListItem, null, 
                    React.createElement( CommentProfile, null ), 
                    React.createElement( reactBootstrap.Media.Body, null, 
                        React.createElement( 'h5', { className: "media-heading" }, author, " ", React.createElement( 'small', null, this.when() )), 
                            React.createElement( 'em', null, React.createElement( 'span', { dangerouslySetInnerHTML: summary }) ), 
                            React.createElement( reactRouter.Link, { to: linkToImage }, "Se kommentar")
                    )
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
        return  React.createElement( reactBootstrap.Media.List, null, 
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
    var user = state.usersInfo.users.filter(function (u) { return u.Username.toUpperCase() == globals.currentUsername.toUpperCase(); })[0];
    var name = user ? user.FirstName : 'User';
    return {
        name: name
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
        var name = ref.name;
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                        React.createElement( reactBootstrap.Jumbotron, null, 
                            React.createElement( 'h1', null, "Velkommen ", React.createElement( 'small', null, name, "!" ) ), 
                            React.createElement( 'p', { className: "lead" }, "Til Inuplans intranet side") 
                        ), 
                        React.createElement( WhatsNew, null )
                    )
                )
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbnN0YW50cy90eXBlcy5qcyIsImFjdGlvbnMvZXJyb3IuanMiLCJ1dGlsaXRpZXMvdXRpbHMuanMiLCJyZWR1Y2Vycy91c2Vycy5qcyIsInJlZHVjZXJzL2ltYWdlcy5qcyIsInJlZHVjZXJzL2NvbW1lbnRzLmpzIiwicmVkdWNlcnMvZXJyb3IuanMiLCJyZWR1Y2Vycy9zdGF0dXMuanMiLCJyZWR1Y2Vycy93aGF0c25ldy5qcyIsInJlZHVjZXJzL3Jvb3QuanMiLCJzdG9yZXMvc3RvcmUuanMiLCJjb25zdGFudHMvY29uc3RhbnRzLmpzIiwiYWN0aW9ucy91c2Vycy5qcyIsImNvbXBvbmVudHMvd3JhcHBlcnMvTGlua3MuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRXJyb3IuanMiLCJjb21wb25lbnRzL01haW4uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJhY3Rpb25zL3doYXRzbmV3LmpzIiwiY29tcG9uZW50cy9XaGF0c05ldy9XaGF0c05ld0l0ZW1JbWFnZS5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3TGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9XaGF0c05ldy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Ib21lLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2Vycy5qcyIsImFjdGlvbnMvaW1hZ2VzLmpzIiwiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VVcGxvYWQuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzLmpzIiwiYWN0aW9ucy9jb21tZW50cy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudERlbGV0ZWQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRDb250cm9scy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudC5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudExpc3QuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL1BhZ2luYXRpb24uanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRGb3JtLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL0NvbW1lbnRzLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gSW1hZ2UgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX0lNRyA9ICdTRVRfU0VMRUNURURfSU1HJztcclxuZXhwb3J0IGNvbnN0IFVOU0VUX1NFTEVDVEVEX0lNRyA9ICdVTlNFVF9TRUxFQ1RFRF9JTUcnO1xyXG5leHBvcnQgY29uc3QgQUREX0lNQUdFID0gJ0FERF9JTUFHRSc7XHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfSU1BR0UgPSAnUkVNT1ZFX0lNQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9JTUFHRVNfT1dORVIgPSAnU0VUX0lNQUdFU19PV05FUic7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9VU0VSX0lNQUdFUyA9ICdSRUNJRVZFRF9VU0VSX0lNQUdFUyc7XHJcbmV4cG9ydCBjb25zdCBBRERfU0VMRUNURURfSU1BR0VfSUQgPSAnQUREX1NFTEVDVEVEX0lNQUdFX0lEJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCA9ICdSRU1PVkVfU0VMRUNURURfSU1BR0VfSUQnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTID0gJ0NMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyc7XHJcblxyXG4vLyBVc2VyIGFjdGlvbnNcclxuZXhwb3J0IGNvbnN0IFNFVF9DVVJSRU5UX1VTRVJfSUQgPSAnU0VUX0NVUlJFTlRfVVNFUl9JRCc7XHJcbmV4cG9ydCBjb25zdCBBRERfVVNFUiA9ICdBRERfVVNFUic7XHJcbmV4cG9ydCBjb25zdCBFUlJPUl9GRVRDSElOR19DVVJSRU5UX1VTRVIgPSAnRVJST1JfRkVUQ0hJTkdfQ1VSUkVOVF9VU0VSJztcclxuZXhwb3J0IGNvbnN0IFJFQ0lFVkVEX1VTRVJTID0gJ1JFQ0lFVkVEX1VTRVJTJztcclxuXHJcbi8vIENvbW1lbnQgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgUkVDSUVWRURfQ09NTUVOVFMgPSAnUkVDSUVWRURfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX0NVUlJFTlRfUEFHRSA9ICdTRVRfQ1VSUkVOVF9QQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UT1RBTF9QQUdFUyA9ICdTRVRfVE9UQUxfUEFHRVMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NLSVBfQ09NTUVOVFMgPSAnU0VUX1NLSVBfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RBS0VfQ09NTUVOVFMgPSAnU0VUX1RBS0VfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgSU5DUl9DT01NRU5UX0NPVU5UID0gJ0lOQ1JfQ09NTUVOVF9DT1VOVCc7XHJcbmV4cG9ydCBjb25zdCBERUNSX0NPTU1FTlRfQ09VTlQgPSAnREVDUl9DT01NRU5UX0NPVU5UJztcclxuZXhwb3J0IGNvbnN0IFNFVF9ERUZBVUxUX1NLSVAgPSAnU0VUX0RFRkFVTFRfU0tJUCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfREVGQVVMVF9UQUtFID0gJ1NFVF9ERUZBVUxUX1RBS0UnO1xyXG5leHBvcnQgY29uc3QgU0VUX0RFRkFVTFRfQ09NTUVOVFMgPSAnU0VUX0RFRkFVTFRfQ09NTUVOVFMnO1xyXG5cclxuLy8gV2hhdHNOZXdcclxuZXhwb3J0IGNvbnN0IEFERF9MQVRFU1QgPSAnQUREX0xBVEVTVCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0tJUF9XSEFUU19ORVcgPSAnU0VUX1NLSVBfV0hBVFNfTkVXJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UQUtFX1dIQVRTX05FVyA9ICdTRVRfVEFLRV9XSEFUU19ORVcnO1xyXG5leHBvcnQgY29uc3QgU0VUX1BBR0VfV0hBVFNfTkVXID0gJ1NFVF9QQUdFX1dIQVRTX05FVyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXID0gJ1NFVF9UT1RBTF9QQUdFU19XSEFUU19ORVcnO1xyXG5cclxuLy8gRXJyb3IgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX0VSUk9SX1RJVExFID0gJ1NFVF9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfRVJST1JfTUVTU0FHRSA9ICdTRVRfRVJST1JfTUVTU0FHRSdcclxuZXhwb3J0IGNvbnN0IFNFVF9IQVNfRVJST1IgPSAnU0VUX0hBU19FUlJPUic7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9USVRMRSA9ICdDTEVBUl9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9NRVNTQUdFID0gJ0NMRUFSX0VSUk9SX01FU1NBR0UnOyIsIu+7v2ltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfRVJST1JfVElUTEUsXHJcbiAgICAgICAgdGl0bGU6IHRpdGxlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckVycm9yVGl0bGUgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfVElUTEVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yTWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0VSUk9SX01FU1NBR0UsXHJcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvck1lc3NhZ2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfTUVTU0FHRVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9ICgpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChjbGVhckVycm9yVGl0bGUoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvck1lc3NhZ2UoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0SGFzRXJyb3IoZmFsc2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRIYXNFcnJvciA9IChoYXNFcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9IQVNfRVJST1IsXHJcbiAgICAgICAgaGFzRXJyb3I6IGhhc0Vycm9yXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKHRydWUpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXRFcnJvclRpdGxlKGVycm9yLnRpdGxlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JNZXNzYWdlKGVycm9yLm1lc3NhZ2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IodGl0bGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IHVuaXEsIGZsYXR0ZW4gfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXHJcbmltcG9ydCByZW1vdmVNZCBmcm9tICdyZW1vdmUtbWFya2Rvd24nXHJcblxyXG52YXIgY3VycnkgPSBmdW5jdGlvbihmLCBuYXJncywgYXJncykge1xyXG4gICAgbmFyZ3MgPSBpc0Zpbml0ZShuYXJncykgPyBuYXJncyA6IGYubGVuZ3RoO1xyXG4gICAgYXJncyA9IGFyZ3MgfHwgW107XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gMS4gYWNjdW11bGF0ZSBhcmd1bWVudHNcclxuICAgICAgICB2YXIgbmV3QXJncyA9IGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIGlmIChuZXdBcmdzLmxlbmd0aCA+PSBuYXJncykge1xyXG4gICAgICAgICAgICAvLyBhcHBseSBhY2N1bXVsYXRlZCBhcmd1bWVudHNcclxuICAgICAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgbmV3QXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIDIuIHJldHVybiBhbm90aGVyIGN1cnJpZWQgZnVuY3Rpb25cclxuICAgICAgICByZXR1cm4gY3VycnkoZiwgbmFyZ3MsIG5ld0FyZ3MpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGN1cnJ5O1xyXG5cclxuY29uc3QgY291bnRDb21tZW50ID0gKHRvcENvbW1lbnQpID0+IHtcclxuICAgIGxldCBjb3VudCA9IDE7XHJcbiAgICBsZXQgcmVtb3ZlZCA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcENvbW1lbnQuUmVwbGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdG9wQ29tbWVudC5SZXBsaWVzW2ldO1xyXG5cclxuICAgICAgICAvLyBFeGNsdWRlIGRlbGV0ZWQgY29tbWVudHNcclxuICAgICAgICBpZihjaGlsZC5EZWxldGVkKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZWQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvdW50ICs9IGNvdW50Q29tbWVudChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50LXJlbW92ZWQ7XHJcbn1cclxuXHJcbmNvbnN0IGNvdW50Q29tbWVudHMgPSAoY29tbWVudHMgPSBbXSkgPT4ge1xyXG4gICAgbGV0IHRvdGFsID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgdG9wQ29tbWVudCA9IGNvbW1lbnRzW2ldO1xyXG4gICAgICAgIHRvdGFsICs9IGNvdW50Q29tbWVudCh0b3BDb21tZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdG90YWw7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVJbWFnZSA9IChpbWcpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSW1hZ2VJRDogaW1nLkltYWdlSUQsXHJcbiAgICAgICAgRmlsZW5hbWU6IGltZy5GaWxlbmFtZSxcclxuICAgICAgICBFeHRlbnNpb246IGltZy5FeHRlbnNpb24sXHJcbiAgICAgICAgT3JpZ2luYWxVcmw6IGltZy5PcmlnaW5hbFVybCxcclxuICAgICAgICBQcmV2aWV3VXJsOiBpbWcuUHJldmlld1VybCxcclxuICAgICAgICBUaHVtYm5haWxVcmw6IGltZy5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgQ29tbWVudENvdW50OiBpbWcuQ29tbWVudENvdW50LFxyXG4gICAgICAgIFVwbG9hZGVkOiBuZXcgRGF0ZShpbWcuVXBsb2FkZWQpLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNvbW1lbnQgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgbGV0IHIgPSBjb21tZW50LlJlcGxpZXMgPyBjb21tZW50LlJlcGxpZXMgOiBbXTtcclxuICAgIGNvbnN0IHJlcGxpZXMgPSByLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgIGNvbnN0IGF1dGhvcklkID0gKGNvbW1lbnQuRGVsZXRlZCkgPyAtMSA6IGNvbW1lbnQuQXV0aG9yLklEO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBDb21tZW50SUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgICAgIERlbGV0ZWQ6IGNvbW1lbnQuRGVsZXRlZCxcclxuICAgICAgICBQb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbixcclxuICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgUmVwbGllczogcmVwbGllc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplTGF0ZXN0ID0gKGxhdGVzdCkgPT4ge1xyXG4gICAgbGV0IGl0ZW0gPSBudWxsO1xyXG4gICAgaWYobGF0ZXN0LlR5cGUgPT0gMSkge1xyXG4gICAgICAgIC8vIEltYWdlIC0gb21pdCBBdXRob3IgYW5kIENvbW1lbnRDb3VudFxyXG4gICAgICAgIGNvbnN0IGltYWdlID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgRXh0ZW5zaW9uOiBpbWFnZS5FeHRlbnNpb24sXHJcbiAgICAgICAgICAgIEZpbGVuYW1lOiBpbWFnZS5GaWxlbmFtZSxcclxuICAgICAgICAgICAgSW1hZ2VJRDogaW1hZ2UuSW1hZ2VJRCxcclxuICAgICAgICAgICAgT3JpZ2luYWxVcmw6IGltYWdlLk9yaWdpbmFsVXJsLFxyXG4gICAgICAgICAgICBQcmV2aWV3VXJsOiBpbWFnZS5QcmV2aWV3VXJsLFxyXG4gICAgICAgICAgICBUaHVtYm5haWxVcmw6IGltYWdlLlRodW1ibmFpbFVybCxcclxuICAgICAgICAgICAgVXBsb2FkZWQ6IGltYWdlLlVwbG9hZGVkXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxhdGVzdC5UeXBlID09IDIpIHtcclxuICAgICAgICAvLyBDb21tZW50IC0gb21pdCBBdXRob3IgYW5kIERlbGV0ZWQgYW5kIFJlcGxpZXNcclxuICAgICAgICBjb25zdCBjb21tZW50ID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgSUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogY29tbWVudC5JbWFnZUlELFxyXG4gICAgICAgICAgICBJbWFnZVVwbG9hZGVkQnk6IGNvbW1lbnQuSW1hZ2VVcGxvYWRlZEJ5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiBsYXRlc3QuSUQsXHJcbiAgICAgICAgVHlwZTogbGF0ZXN0LlR5cGUsXHJcbiAgICAgICAgSXRlbTogaXRlbSxcclxuICAgICAgICBPbjogbGF0ZXN0Lk9uLFxyXG4gICAgICAgIEF1dGhvcklEOiBsYXRlc3QuSXRlbS5BdXRob3IuSURcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHZpc2l0Q29tbWVudHMgPSAoY29tbWVudHMsIGZ1bmMpID0+IHtcclxuICAgIGNvbnN0IGdldFJlcGxpZXMgPSAoYykgPT4gYy5SZXBsaWVzID8gYy5SZXBsaWVzIDogW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjb21tZW50c1tpXSwgZ2V0UmVwbGllcywgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZXB0aEZpcnN0U2VhcmNoID0gKGN1cnJlbnQsIGdldENoaWxkcmVuLCBmdW5jKSA9PiB7XHJcbiAgICBmdW5jKGN1cnJlbnQpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBnZXRDaGlsZHJlbihjdXJyZW50KTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKGNoaWxkcmVuW2ldLCBnZXRDaGlsZHJlbiwgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmlvbihhcnIxLCBhcnIyLCBlcXVhbGl0eUZ1bmMpIHtcclxuICAgIHZhciB1bmlvbiA9IGFycjEuY29uY2F0KGFycjIpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5pb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gaSsxOyBqIDwgdW5pb24ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGVxdWFsaXR5RnVuYyh1bmlvbltpXSwgdW5pb25bal0pKSB7XHJcbiAgICAgICAgICAgICAgICB1bmlvbi5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICBqLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVuaW9uO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXNlckVxdWFsaXR5ID0gKHVzZXIxLCB1c2VyMikgPT4ge1xyXG4gICAgaWYoIXVzZXIyIHx8ICF1c2VyMSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHVzZXIxLklEID09IHVzZXIyLklEO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGZvcm1hdFRleHQgPSAodGV4dCkgPT4ge1xyXG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICB2YXIgcmF3TWFya3VwID0gbWFya2VkKHRleHQsIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICByZXR1cm4geyBfX2h0bWw6IHJhd01hcmt1cCB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0V29yZHMgPSAodGV4dCwgbnVtYmVyT2ZXb3JkcykgPT4ge1xyXG4gICAgaWYoIXRleHQpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgcGxhaW5UZXh0ID0gcmVtb3ZlTWQodGV4dCk7XHJcbiAgICByZXR1cm4gcGxhaW5UZXh0LnNwbGl0KC9cXHMrLykuc2xpY2UoMCwgbnVtYmVyT2ZXb3Jkcykuam9pbihcIiBcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB0aW1lVGV4dCA9IChwb3N0ZWRPbikgPT4ge1xyXG4gICAgY29uc3QgYWdvID0gbW9tZW50KHBvc3RlZE9uKS5mcm9tTm93KCk7XHJcbiAgICBjb25zdCBkaWZmID0gbW9tZW50KCkuZGlmZihwb3N0ZWRPbiwgJ2hvdXJzJywgdHJ1ZSk7XHJcbiAgICBpZiAoZGlmZiA+PSAxMi41KSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBtb21lbnQocG9zdGVkT24pO1xyXG4gICAgICAgIHJldHVybiBcImQuIFwiICsgZGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKSArIFwia2wuIFwiICsgZGF0ZS5mb3JtYXQoXCJIOm1tXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBcImZvciBcIiArIGFnbztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc3BvbnNlSGFuZGxlciA9IChkaXNwYXRjaCwgcmVzcG9uc2UpID0+IHtcclxuICAgIGlmIChyZXNwb25zZS5vaykgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgNDAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjQwMCBCYWQgUmVxdWVzdFwiLCBcIlRoZSByZXF1ZXN0IHdhcyBub3Qgd2VsbC1mb3JtZWRcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDQgTm90IEZvdW5kXCIsIFwiQ291bGQgbm90IGZpbmQgcmVzb3VyY2VcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwODpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDggUmVxdWVzdCBUaW1lb3V0XCIsIFwiVGhlIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgaW4gdGltZVwiKSkpO1xyXG4gICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI1MDAgU2VydmVyIEVycm9yXCIsIFwiU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgQVBJLXNlcnZlclwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihuZXcgSHR0cEVycm9yKFwiT29wc1wiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG9uUmVqZWN0ID0gKCkgPT4geyB9XHJcbiIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgdW5pb24sIHVzZXJFcXVhbGl0eSB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IHVzZXJzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfVVNFUjpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLnVzZXJdLCB1c2VyRXF1YWxpdHkpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi51c2VycztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRVc2VySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9DVVJSRU5UX1VTRVJfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgc3RhdGU7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB1c2Vyc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgY3VycmVudFVzZXJJZCxcclxuICAgIHVzZXJzXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCB1c2Vyc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IG93bmVySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9JTUFHRVNfT1dORVI6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgc3RhdGU7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbWFnZXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLmltYWdlXSwgKGltZzEsIGltZzIpID0+IGltZzEuSW1hZ2VJRCA9PSBpbWcyLkltYWdlSUQpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSX0lNQUdFUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pbWFnZXM7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmZpbHRlcihpbWcgPT4gaW1nLkltYWdlSUQgIT0gYWN0aW9uLmlkKTtcclxuICAgICAgICBjYXNlIFQuSU5DUl9DT01NRU5UX0NPVU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubWFwKGltZyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihpbWcuSW1hZ2VJRCA9PSBhY3Rpb24uaW1hZ2VJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZy5Db21tZW50Q291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVC5ERUNSX0NPTU1FTlRfQ09VTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYXAoaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGltZy5JbWFnZUlEID09IGFjdGlvbi5pbWFnZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nLkNvbW1lbnRDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGltZztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TRUxFQ1RFRF9JTUc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgc3RhdGU7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWRzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfU0VMRUNURURfSU1BR0VfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB1bmlvbihzdGF0ZSwgW2FjdGlvbi5pZF0sIChpZDEsIGlkMikgPT4gaWQxID09IGlkMik7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRDpcclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcihzdGF0ZSwgKGlkKSA9PiBpZCAhPSBhY3Rpb24uaWQpO1xyXG4gICAgICAgIGNhc2UgVC5DTEVBUl9TRUxFQ1RFRF9JTUFHRV9JRFM6XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGltYWdlc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgb3duZXJJZCxcclxuICAgIGltYWdlcyxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZCxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZHNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGltYWdlc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuY29uc3QgY29tbWVudHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlJFQ0lFVkVEX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmNvbW1lbnRzIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0tJUF9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5za2lwIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdGFrZSA9IChzdGF0ZSA9IDEwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RBS0VfQ09NTUVOVFM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udGFrZSB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHBhZ2UgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0NVUlJFTlRfUEFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5wYWdlIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfUEFHRVM6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udG90YWxQYWdlcyB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNvbW1lbnRzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjb21tZW50cyxcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbW1lbnRzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5leHBvcnQgY29uc3QgdGl0bGUgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0VSUk9SX1RJVExFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRpdGxlIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0VSUk9SX01FU1NBR0U6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ubWVzc2FnZSB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGVycm9ySW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICB0aXRsZSxcclxuICAgIG1lc3NhZ2VcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBlcnJvckluZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgZXJyb3JJbmZvIGZyb20gJy4vZXJyb3InXHJcblxyXG5leHBvcnQgY29uc3QgaGFzRXJyb3IgPSAoc3RhdGUgPSBmYWxzZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9IQVNfRVJST1I6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaGFzRXJyb3IgfHwgc3RhdGU7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRvbmUgPSAoc3RhdGUgPSB0cnVlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHN0YXR1c0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgaGFzRXJyb3IsXHJcbiAgICBlcnJvckluZm8sXHJcbiAgICBtZXNzYWdlLFxyXG4gICAgZG9uZVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RhdHVzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5cclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0tJUF9XSEFUU19ORVc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uc2tpcCB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UQUtFX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfUEFHRV9XSEFUU19ORVc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGFnZSB8fCBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50b3RhbFBhZ2VzIHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgaXRlbXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9MQVRFU1Q6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ubGF0ZXN0IHx8IHN0YXRlO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgd2hhdHNOZXdJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXMsXHJcbiAgICBpdGVtc1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgd2hhdHNOZXdJbmZvO1xyXG5cclxuLyoqIFdoYXRzTmV3SW5mb1xyXG4gICAge1xyXG4gICAgICAgIHNraXA6IDAsXHJcbiAgICAgICAgdGFrZTogMTAsXHJcbiAgICAgICAgcGFnZTogMSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiAyLFxyXG4gICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIElkOiAxXHJcbiAgICAgICAgICAgICAgICBUeXBlOiBlbnVtLFxyXG4gICAgICAgICAgICAgICAgQXV0aG9ySWQ6IDEsXHJcbiAgICAgICAgICAgICAgICBJdGVtOiB7IH0sXHJcbiAgICAgICAgICAgICAgICBPbjogdGltZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSWQ6IDIsXHJcbiAgICAgICAgICAgICAgICBUeXBlOiBlbnVtLFxyXG4gICAgICAgICAgICAgICAgQXV0aG9ySWQ6IDEsXHJcbiAgICAgICAgICAgICAgICBJdGVtOiB7IH0sXHJcbiAgICAgICAgICAgICAgICBPbjogdGltZSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxuKiovIiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCB1c2Vyc0luZm8gZnJvbSAnLi91c2VycydcclxuaW1wb3J0IGltYWdlc0luZm8gZnJvbSAnLi9pbWFnZXMnXHJcbmltcG9ydCBjb21tZW50c0luZm8gZnJvbSAnLi9jb21tZW50cydcclxuaW1wb3J0IHN0YXR1c0luZm8gZnJvbSAnLi9zdGF0dXMnXHJcbmltcG9ydCB3aGF0c05ld0luZm8gZnJvbSAnLi93aGF0c25ldydcclxuXHJcbmNvbnN0IHJvb3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHVzZXJzSW5mbyxcclxuICAgIGltYWdlc0luZm8sXHJcbiAgICBjb21tZW50c0luZm8sXHJcbiAgICBzdGF0dXNJbmZvLFxyXG4gICAgd2hhdHNOZXdJbmZvXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCByb290UmVkdWNlciIsIu+7v2ltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0IHRodW5rIGZyb20gJ3JlZHV4LXRodW5rJ1xyXG5pbXBvcnQgcm9vdFJlZHVjZXIgZnJvbSAnLi4vcmVkdWNlcnMvcm9vdCdcclxuXHJcbmV4cG9ydCBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJvb3RSZWR1Y2VyLCBhcHBseU1pZGRsZXdhcmUodGh1bmspKSIsIu+7v2V4cG9ydCBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ1xyXG59Iiwi77u/aW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5cclxuY29uc3QgZ2V0VXJsID0gKHVzZXJuYW1lKSA9PiBnbG9iYWxzLnVybHMudXNlcnMgKyAnP3VzZXJuYW1lPScgKyB1c2VybmFtZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJyZW50VXNlcklkKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0NVUlJFTlRfVVNFUl9JRCxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRVc2VyKHVzZXIpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5BRERfVVNFUixcclxuICAgICAgICB1c2VyOiB1c2VyXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjaWV2ZWRVc2Vycyh1c2Vycykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFQ0lFVkVEX1VTRVJTLFxyXG4gICAgICAgIHVzZXJzOiB1c2Vyc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hDdXJyZW50VXNlcih1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IGdldFVybCh1c2VybmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0Q3VycmVudFVzZXJJZCh1c2VyLklEKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IGdldFVybCh1c2VybmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXIgPT4gZGlzcGF0Y2goYWRkVXNlcih1c2VyKSksIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoVXNlcnMoKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaChnbG9iYWxzLnVybHMudXNlcnMsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXJzID0+IGRpc3BhdGNoKHJlY2lldmVkVXNlcnModXNlcnMpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgTmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICAgICAgICAgIDxMaW5rIHsuLi50aGlzLnByb3BzfT5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuXHJcbk5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmRleE5hdkxpbmsgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IHRoaXMuY29udGV4dC5yb3V0ZXIuaXNBY3RpdmUodGhpcy5wcm9wcy50bywgdHJ1ZSksXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XHJcbiAgICAgICAgICAgICAgICA8SW5kZXhMaW5rIHsuLi50aGlzLnByb3BzfT5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvSW5kZXhMaW5rPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuSW5kZXhOYXZMaW5rLmNvbnRleHRUeXBlcyA9IHtcclxuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIEVycm9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNsZWFyRXJyb3IsIHRpdGxlLCBtZXNzYWdlICB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTIgY29sLWxnLThcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIHJvbGU9XCJhbGVydFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtjbGVhckVycm9yfSB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPnt0aXRsZX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge21lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBOYXZMaW5rLCBJbmRleE5hdkxpbmsgfSBmcm9tICcuL3dyYXBwZXJzL0xpbmtzJ1xyXG5pbXBvcnQgeyBFcnJvciB9IGZyb20gJy4vY29udGFpbmVycy9FcnJvcidcclxuaW1wb3J0IHsgY2xlYXJFcnJvciB9IGZyb20gJy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgR3JpZCwgTmF2YmFyLCBOYXYgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaGFzRXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uaGFzRXJyb3IsXHJcbiAgICAgICAgZXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uZXJyb3JJbmZvXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xlYXJFcnJvcjogKCkgPT4gZGlzcGF0Y2goY2xlYXJFcnJvcigpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTaGVsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBlcnJvclZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgY2xlYXJFcnJvciwgZXJyb3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgbWVzc2FnZSB9ID0gZXJyb3I7XHJcbiAgICAgICAgcmV0dXJuIChoYXNFcnJvciA/XHJcbiAgICAgICAgICAgIDxFcnJvclxyXG4gICAgICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17bWVzc2FnZX1cclxuICAgICAgICAgICAgICAgIGNsZWFyRXJyb3I9e2NsZWFyRXJyb3J9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPEdyaWQgZmx1aWQ9e3RydWV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci5CcmFuZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9cIiBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIj5JbnVwbGFuIEludHJhbmV0PC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXZiYXIuQnJhbmQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRvZ2dsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5IZWFkZXI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLkNvbGxhcHNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5kZXhOYXZMaW5rIHRvPVwiL1wiPkZvcnNpZGU8L0luZGV4TmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayB0bz1cIi91c2Vyc1wiPkJydWdlcmU8L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89XCIvYWJvdXRcIj5PbTwvTmF2TGluaz4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRleHQgcHVsbFJpZ2h0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhlaiwge2dsb2JhbHMuY3VycmVudFVzZXJuYW1lfSFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLlRleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLkNvbGxhcHNlPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L05hdmJhcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZXJyb3JWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9HcmlkPlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBNYWluID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoU2hlbGwpO1xyXG5leHBvcnQgZGVmYXVsdCBNYWluOyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFib3V0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJPbVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTIgY29sLWxnLThcIj5cclxuICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRGV0dGUgZXIgZW4gc2luZ2xlIHBhZ2UgYXBwbGljYXRpb24hXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUZWtub2xvZ2llciBicnVndDpcclxuICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVhY3Q8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVkdXg8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVhY3RSb3V0ZXI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+QXNwLm5ldCBDb3JlIFJDIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+QXNwLm5ldCBXZWIgQVBJIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi9lcnJvcidcclxuaW1wb3J0IHsgcmVzcG9uc2VIYW5kbGVyLCBvblJlamVjdCwgbm9ybWFsaXplTGF0ZXN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSAnLi91c2VycydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRMYXRlc3QobGF0ZXN0KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX0xBVEVTVCxcclxuICAgICAgICBsYXRlc3Q6IGxhdGVzdFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0U0tpcChza2lwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1NLSVBfV0hBVFNfTkVXLFxyXG4gICAgICAgIHNraXA6IHNraXBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFRha2UodGFrZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UQUtFX1dIQVRTX05FVyxcclxuICAgICAgICB0YWtlOiB0YWtlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRQYWdlKHBhZ2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfUEFHRV9XSEFUU19ORVcsXHJcbiAgICAgICAgcGFnZTogcGFnZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VG90YWxQYWdlcyh0b3RhbFBhZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVyxcclxuICAgICAgICB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaExhdGVzdE5ld3Moc2tpcCwgdGFrZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLndoYXRzbmV3ICsgXCI/c2tpcD1cIiArIHNraXAgKyBcIiZ0YWtlPVwiICsgdGFrZTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHBhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBwYWdlLkN1cnJlbnRJdGVtcztcclxuICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gaXRlbS5JdGVtLkF1dGhvcjtcclxuICAgICAgICAgICAgICAgICAgICBpZihhdXRob3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIoYXV0aG9yKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZXNldCBpbmZvXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRTS2lwKHNraXApKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2UodGFrZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0UGFnZShwYWdlLkN1cnJlbnRQYWdlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFBhZ2VzKHBhZ2UuVG90YWxQYWdlcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBpdGVtcy5maWx0ZXIoaXRlbSA9PiBCb29sZWFuKGl0ZW0uSXRlbS5BdXRob3IpKS5tYXAobm9ybWFsaXplTGF0ZXN0KTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZExhdGVzdChub3JtYWxpemVkKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1JbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJtZWRpYS1vYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cIi9pbWFnZXMvcGVyc29uX2ljb24uc3ZnXCJcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLWhvbGRlci1yZW5kZXJlZD1cInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjY0cHhcIiwgaGVpZ2h0OiBcIjY0cHhcIiB9fVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50UHJvZmlsZSdcclxuaW1wb3J0IHsgZm9ybWF0VGV4dCwgZ2V0V29yZHMsIHRpbWVUZXh0IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1Db21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNyZWF0ZVN1bW1hcnkoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBmb3JtYXRUZXh0KFwiXFxcIlwiICsgZ2V0V29yZHModGV4dCwgNSkgKyBcIi4uLlwiICsgXCJcXFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bGxuYW1lKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBhdXRob3IuRmlyc3ROYW1lICsgJyAnICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHdoZW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJzYWdkZSBcIiArIHRpbWVUZXh0KG9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCB1cGxvYWRlZEJ5IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IHRoaXMuZnVsbG5hbWUoKTtcclxuICAgICAgICBjb25zdCBzdW1tYXJ5ID0gdGhpcy5jcmVhdGVTdW1tYXJ5KCk7XHJcbiAgICAgICAgY29uc3QgbGlua1RvSW1hZ2UgPSB1cGxvYWRlZEJ5LlVzZXJuYW1lICsgXCIvZ2FsbGVyeS9pbWFnZS9cIiArIGltYWdlSWQ7XHJcbiAgICAgICAgcmV0dXJuICA8TWVkaWEuTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRQcm9maWxlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJtZWRpYS1oZWFkaW5nXCI+e2F1dGhvcn0gPHNtYWxsPnt0aGlzLndoZW4oKX08L3NtYWxsPjwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZW0+PHNwYW4gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3N1bW1hcnl9Pjwvc3Bhbj48L2VtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2xpbmtUb0ltYWdlfT5TZSBrb21tZW50YXI8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgPC9NZWRpYS5MaXN0SXRlbT5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFdoYXRzTmV3SXRlbUltYWdlIH0gZnJvbSAnLi9XaGF0c05ld0l0ZW1JbWFnZSdcclxuaW1wb3J0IHsgV2hhdHNOZXdJdGVtQ29tbWVudCB9IGZyb20gJy4vV2hhdHNOZXdJdGVtQ29tbWVudCdcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdEl0ZW1zKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgZ2VuZXJhdGVLZXkgPSAoaWQpID0+IFwid2hhdHNuZXdfXCIgKyBpZDtcclxuICAgICAgICByZXR1cm4gaXRlbXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRVc2VyKGl0ZW0uQXV0aG9ySUQpO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtS2V5ID0gZ2VuZXJhdGVLZXkoaXRlbS5JRCk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICA8V2hhdHNOZXdJdGVtSW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17aXRlbS5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtPXtpdGVtLkl0ZW19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb249e2l0ZW0uT259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9yPXthdXRob3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtS2V5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxXaGF0c05ld0l0ZW1Db21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2l0ZW0uSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17aXRlbS5JdGVtLlRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWRCeT17aXRlbS5JdGVtLkltYWdlVXBsb2FkZWRCeX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXtpdGVtLkl0ZW0uSW1hZ2VJRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbj17aXRlbS5Pbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I9e2F1dGhvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW1LZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbU5vZGVzID0gdGhpcy5jb25zdHJ1Y3RJdGVtcygpO1xyXG4gICAgICAgIHJldHVybiAgPE1lZGlhLkxpc3Q+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW1Ob2Rlc31cclxuICAgICAgICAgICAgICAgIDwvTWVkaWEuTGlzdD5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgZmV0Y2hMYXRlc3ROZXdzIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy93aGF0c25ldydcclxuaW1wb3J0IHsgV2hhdHNOZXdMaXN0IH0gZnJvbSAnLi4vV2hhdHNOZXcvV2hhdHNOZXdMaXN0J1xyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldExhdGVzdDogKHNraXAsIHRha2UpID0+IGRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSlcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGl0ZW1zOiBzdGF0ZS53aGF0c05ld0luZm8uaXRlbXMsXHJcbiAgICAgICAgZ2V0VXNlcjogKGlkKSA9PiBmaW5kKHN0YXRlLnVzZXJzSW5mby51c2VycywgKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuSUQgPT0gaWQ7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgc2tpcDogc3RhdGUud2hhdHNOZXdJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUud2hhdHNOZXdJbmZvLnRha2VcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgV2hhdHNOZXdDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBnZXRMYXRlc3QsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZ2V0TGF0ZXN0KHNraXAsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1zLCBnZXRVc2VyIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8aDM+U2lkc3RlIG55dDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdoYXRzTmV3TGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17aXRlbXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFVzZXI9e2dldFVzZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBXaGF0c05ldyA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFdoYXRzTmV3Q29udGFpbmVyKVxyXG5leHBvcnQgZGVmYXVsdCBXaGF0c05ldzsiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IFdoYXRzTmV3IGZyb20gJy4vV2hhdHNOZXcnXHJcbmltcG9ydCB7IEp1bWJvdHJvbiwgR3JpZCwgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnMuZmlsdGVyKHUgPT4gdS5Vc2VybmFtZS50b1VwcGVyQ2FzZSgpID09IGdsb2JhbHMuY3VycmVudFVzZXJuYW1lLnRvVXBwZXJDYXNlKCkpWzBdO1xyXG4gICAgY29uc3QgbmFtZSA9IHVzZXIgPyB1c2VyLkZpcnN0TmFtZSA6ICdVc2VyJztcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBIb21lVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiRm9yc2lkZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IG5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEp1bWJvdHJvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT5WZWxrb21tZW4gPHNtYWxsPntuYW1lfSE8L3NtYWxsPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJsZWFkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGlsIEludXBsYW5zIGludHJhbmV0IHNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvSnVtYm90cm9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8V2hhdHNOZXcgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBIb21lID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKEhvbWVWaWV3KVxyXG5leHBvcnQgZGVmYXVsdCBIb21lIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBlbWFpbCA9IFwibWFpbHRvOlwiICsgdGhpcy5wcm9wcy5lbWFpbDtcclxuICAgICAgICB2YXIgZ2FsbGVyeSA9IFwiL1wiICsgdGhpcy5wcm9wcy51c2VybmFtZSArIFwiL2dhbGxlcnlcIjtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0zIHBhbmVsIHBhbmVsLWRlZmF1bHRcIiBzdHlsZT17eyBwYWRkaW5nVG9wOiBcIjhweFwiLCBwYWRkaW5nQm90dG9tOiBcIjhweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+QnJ1Z2VybmF2bjwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMudXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkZvcm5hdm48L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmZpcnN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+RWZ0ZXJuYXZuPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5sYXN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+RW1haWw8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2VtYWlsfT57dGhpcy5wcm9wcy5lbWFpbH08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkJpbGxlZGVyPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17Z2FsbGVyeX0+QmlsbGVkZXI8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi9Vc2VyJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHVzZXJOb2RlcygpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB1c2Vycy5tYXAoKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlcklkID0gYHVzZXJJZF8ke3VzZXIuSUR9YDtcclxuICAgICAgICAgICAgcmV0dXJuICg8VXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VyLlVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZD17dXNlci5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU9e3VzZXIuRmlyc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lPXt1c2VyLkxhc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsPXt1c2VyLkVtYWlsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGVVcmw9e3VzZXIuUHJvZmlsZUltYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVzPXt1c2VyLlJvbGVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17dXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgLz4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB1c2VycyA9IHRoaXMudXNlck5vZGVzKCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIHt1c2Vyc31cclxuICAgICAgICAgICAgPC9kaXY+KVxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IGZldGNoVXNlcnMgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgeyBVc2VyTGlzdCB9IGZyb20gJy4uL3VzZXJzL1VzZXJMaXN0J1xyXG5cclxuY29uc3QgbWFwVXNlcnNUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVzZXJzOiBzdGF0ZS51c2Vyc0luZm8udXNlcnNcclxuICAgIH07XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRVc2VyczogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFVzZXJzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJCcnVnZXJlXCI7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5nZXRVc2VycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMiBjb2wtbGctOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZS1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxPkludXBsYW4ncyA8c21hbGw+YnJ1Z2VyZTwvc21hbGw+PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VXNlckxpc3QgdXNlcnM9e3VzZXJzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFVzZXJzID0gY29ubmVjdChtYXBVc2Vyc1RvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlcnNDb250YWluZXIpXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJzXHJcbiIsIu+7v2ltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSAnLi91c2VycydcclxuaW1wb3J0IHsgbm9ybWFsaXplSW1hZ2UgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRJbWFnZXNPd25lcihpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9JTUFHRVNfT1dORVIsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjaWV2ZWRVc2VySW1hZ2VzKGltYWdlcykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFQ0lFVkVEX1VTRVJfSU1BR0VTLFxyXG4gICAgICAgIGltYWdlczogaW1hZ2VzXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0U2VsZWN0ZWRJbWcgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0VMRUNURURfSU1HLFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEltYWdlKGltZykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9JTUFHRSxcclxuICAgICAgICBpbWFnZTogaW1nXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSW1hZ2UoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRU1PVkVfSU1BR0UsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkU2VsZWN0ZWRJbWFnZUlkKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX1NFTEVDVEVEX0lNQUdFX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZChpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZSArIFwiJmlkPVwiICsgaWQ7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2gocmVtb3ZlSW1hZ2UoaWQpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25TdWNjZXNzID0gKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGRhdGEubWFwKG5vcm1hbGl6ZUltYWdlKS5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2lldmVkVXNlckltYWdlcyhub3JtYWxpemVkKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihvblN1Y2Nlc3MsIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgaW1hZ2VJZHMgPSBbXSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgaWRzID0gaW1hZ2VJZHMuam9pbigpO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lICsgXCImaWRzPVwiICsgaWRzO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpKSwgb25SZWplY3QpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEltYWdlT3duZXIodXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICAvLyBMYXp5IGV2YWx1YXRpb25cclxuICAgICAgICBjb25zdCBmaW5kT3duZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaW5kKGdldFN0YXRlKCkudXNlcnNJbmZvLnVzZXJzLCAodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXIuVXNlcm5hbWUgPT0gdXNlcm5hbWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG93bmVyID0gZmluZE93bmVyKCk7XHJcblxyXG4gICAgICAgIGlmKG93bmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG93bmVySWQgPSBvd25lci5JRDtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0SW1hZ2VzT3duZXIob3duZXJJZCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gZ2xvYmFscy51cmxzLnVzZXJzICsgJz91c2VybmFtZT0nICsgdXNlcm5hbWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4odXNlciA9PiBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKSwgb25SZWplY3QpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIgPSBmaW5kT3duZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lci5JRCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBwcm9taXNlR2V0SW1hZ2UgPSAoaWQsIGdldFN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBpbWFnZXMgPSBnZXRTdGF0ZSgpLmltYWdlc0luZm8uaW1hZ2VzO1xyXG4gICAgICAgIGNvbnN0IGltYWdlID0gZmluZChpbWFnZXMsIChpbWcpID0+IGltZy5JbWFnZUlEID09IGlkKTtcclxuXHJcbiAgICAgICAgaWYoaW1hZ2UpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZWplY3QoRXJyb3IoXCJJbWFnZSBkb2VzIG5vdCBleGlzdCBsb2NhbGx5IVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFNpbmdsZUltYWdlKGlkKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlcyArIFwiL2dldGJ5aWQ/aWQ9XCIgKyBpZDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZighaW1nKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub3JtYWxpemVkSW1hZ2UgPSBub3JtYWxpemVJbWFnZShpbWcpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkSW1hZ2Uobm9ybWFsaXplZEltYWdlKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcklucHV0KGZpbGVJbnB1dCkge1xyXG4gICAgICAgIGlmKGZpbGVJbnB1dC52YWx1ZSl7XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnOyAvL2ZvciBJRTExLCBsYXRlc3QgQ2hyb21lL0ZpcmVmb3gvT3BlcmEuLi5cclxuICAgICAgICAgICAgfWNhdGNoKGVycil7IH1cclxuICAgICAgICAgICAgaWYoZmlsZUlucHV0LnZhbHVlKXsgLy9mb3IgSUU1IH4gSUUxMFxyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IGZpbGVJbnB1dC5wYXJlbnROb2RlLCByZWYgPSBmaWxlSW5wdXQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGZpbGVJbnB1dCk7XHJcbiAgICAgICAgICAgICAgICBmb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShmaWxlSW5wdXQscmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWxlcygpIHtcclxuICAgICAgICBjb25zdCBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgcmV0dXJuIChmaWxlcyA/IGZpbGVzLmZpbGVzIDogW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVN1Ym1pdChlKSB7XHJcbiAgICAgICAgY29uc3QgeyB1cGxvYWRJbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5nZXRGaWxlcygpO1xyXG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xyXG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICB0aGlzLmNsZWFySW5wdXQoZmlsZUlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVCdG4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYXNJbWFnZXMsIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoaGFzSW1hZ2VzID9cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCIgb25DbGljaz17ZGVsZXRlU2VsZWN0ZWRJbWFnZXN9PlNsZXQgbWFya2VyZXQgYmlsbGVkZXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXJcIiBvbkNsaWNrPXtkZWxldGVTZWxlY3RlZEltYWdlc30gZGlzYWJsZWQ9XCJkaXNhYmxlZFwiPlNsZXQgbWFya2VyZXQgYmlsbGVkZXI8L2J1dHRvbj4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJmb3JtLXVwbG9hZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jdHlwZT1cIm11bHRpcGFydC9mb3JtLWRhdGFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZmlsZXNcIj5VcGxvYWQgZmlsZXI6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImZpbGVzXCIgbmFtZT1cImZpbGVzXCIgbXVsdGlwbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgaWQ9XCJ1cGxvYWRcIj5VcGxvYWQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsnXFx1MDBBMCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5kZWxldGVCdG4oKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgLy8gQmluZCAndGhpcycgdG8gZnVuY3Rpb25zXHJcbiAgICAgICAgdGhpcy5jaGVja2JveEhhbmRsZXIgPSB0aGlzLmNoZWNrYm94SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrYm94SGFuZGxlcihlKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBhZGQgPSBlLmN1cnJlbnRUYXJnZXQuY2hlY2tlZDtcclxuICAgICAgICBpZihhZGQpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbW1lbnRJY29uKGNvdW50KSB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBjb3VudCA9PSAwID8gXCJjb2wtbGctNiB0ZXh0LW11dGVkXCIgOiBcImNvbC1sZy02IHRleHQtcHJpbWFyeVwiO1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0ge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IHN0eWxlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8ZGl2IHsuLi4gcHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tY29tbWVudFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4ge2NvdW50fSAgIFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tib3hWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkLCBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjaGVja2VkID0gaW1hZ2VJc1NlbGVjdGVkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIHJldHVybiAoY2FuRWRpdCA/IFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02IHB1bGwtcmlnaHQgdGV4dC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIFNsZXQgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uQ2xpY2s9e3RoaXMuY2hlY2tib3hIYW5kbGVyfSBjaGVja2VkPXtjaGVja2VkfSAvPiBcclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxucmVuZGVyKCkge1xyXG4gICAgY29uc3QgeyBpbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBsZXQgY291bnQgPSBpbWFnZS5Db21tZW50Q291bnQ7XHJcbiAgICByZXR1cm4gIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8TGluayB0bz17YC8ke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2UuSW1hZ2VJRH1gfT5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2UuUHJldmlld1VybH0gY2xhc3NOYW1lPVwiaW1nLXRodW1ibmFpbFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZS5JbWFnZUlEfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5jb21tZW50SWNvbihjb3VudCl9IFxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5jaGVja2JveFZpZXcoKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufVxyXG4gICAgICAgICAgICAgICAgLy88YSBvbkNsaWNrPXt0aGlzLnNlbGVjdEltYWdlfSBzdHlsZT17e2N1cnNvcjogXCJwb2ludGVyXCIsIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIn19PlxyXG4gICAgICAgICAgICAgICAgLy88L2E+XHJcblxyXG4gICAgICAgIC8vcmV0dXJuICggY291bnQgPT0gMCA/XHJcbiAgICAgICAgLy8gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNiB0ZXh0LW11dGVkXCI+IFxyXG4gICAgICAgIC8vICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNvbW1lbnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IHtjb3VudH1cclxuICAgICAgICAvLyAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICA6XHJcbiAgICAgICAgLy8gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNiB0ZXh0LXByaW1hcnlcIiBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJyB9fT5cclxuICAgICAgICAvLyAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1jb21tZW50XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiB7Y291bnR9XHJcbiAgICAgICAgLy8gICAgPC9kaXY+XHJcbiAgICAgICAgLy8pOyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tICcuL0ltYWdlJ1xyXG5cclxuY29uc3QgZWxlbWVudHNQZXJSb3cgPSA0O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2VMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFycmFuZ2VBcnJheShpbWFnZXMpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSBpbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHRpbWVzID0gTWF0aC5jZWlsKGxlbmd0aCAvIGVsZW1lbnRzUGVyUm93KTtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGxldCBzdGFydCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aW1lczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0ID0gaSAqIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZW5kID4gbGVuZ3RoO1xyXG4gICAgICAgICAgICBpZihsYXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBpbWFnZXMuc2xpY2Uoc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGltYWdlcy5zbGljZShzdGFydCwgZW5kKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW1hZ2VzVmlldyhpbWFnZXMpIHtcclxuICAgICAgICBpZihpbWFnZXMubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHsgYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzLCBjYW5FZGl0LCBpbWFnZUlzU2VsZWN0ZWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYXJyYW5nZUFycmF5KGltYWdlcyk7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHJlc3VsdC5tYXAoKHJvdywgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpbWdzID0gcm93Lm1hcCgoaW1nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTNcIiBrZXk9e2ltZy5JbWFnZUlEfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZT17aW1nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZD17YWRkU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkPXtyZW1vdmVTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlzU2VsZWN0ZWQ9e2ltYWdlSXNTZWxlY3RlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgcm93SWQgPSBcInJvd0lkXCIgKyBpO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBrZXk9e3Jvd0lkfT5cclxuICAgICAgICAgICAgICAgICAgICB7aW1nc31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAge3RoaXMuaW1hZ2VzVmlldyhpbWFnZXMpfVxyXG4gICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgdXBsb2FkSW1hZ2UsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgIGRlbGV0ZUltYWdlcywgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBjbGVhclNlbGVjdGVkSW1hZ2VJZHMgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2ltYWdlcydcclxuaW1wb3J0IHsgRXJyb3IgfSBmcm9tICcuL0Vycm9yJ1xyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZCB9IGZyb20gJy4uL2ltYWdlcy9JbWFnZVVwbG9hZCdcclxuaW1wb3J0IEltYWdlTGlzdCBmcm9tICcuLi9pbWFnZXMvSW1hZ2VMaXN0J1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3Qgb3duZXJJZCAgPSBzdGF0ZS5pbWFnZXNJbmZvLm93bmVySWQ7XHJcbiAgICBjb25zdCBjdXJyZW50SWQgPSBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZDtcclxuICAgIGNvbnN0IGNhbkVkaXQgPSAob3duZXJJZCA+IDAgJiYgY3VycmVudElkID4gMCAmJiBvd25lcklkID09IGN1cnJlbnRJZCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbWFnZXM6IHN0YXRlLmltYWdlc0luZm8uaW1hZ2VzLFxyXG4gICAgICAgIGNhbkVkaXQ6IGNhbkVkaXQsXHJcbiAgICAgICAgc2VsZWN0ZWRJbWFnZUlkczogc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWRzLFxyXG4gICAgICAgIGdldEZ1bGxuYW1lOiAodXNlcm5hbWUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vycy5maWx0ZXIodSA9PiB1LlVzZXJuYW1lLnRvVXBwZXJDYXNlKCkgPT0gdXNlcm5hbWUudG9VcHBlckNhc2UoKSlbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IGZ1bGxuYW1lID0gKHVzZXIpID8gdXNlci5GaXJzdE5hbWUgKyBcIiBcIiArIHVzZXIuTGFzdE5hbWUgOiAnVXNlcic7XHJcbiAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwbG9hZEltYWdlOiAodXNlcm5hbWUsIGZvcm1EYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgLy8gSW1hZ2VzIHRvIGJlIGRlbGV0ZWQgYnkgc2VsZWN0aW9uOlxyXG4gICAgICAgICAgICBkaXNwYXRjaChhZGRTZWxlY3RlZEltYWdlSWQoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEltYWdlcyB0byBiZSBkZWxldGVkIGJ5IHNlbGVjdGlvbjpcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJbWFnZXM6ICh1c2VybmFtZSwgaWRzKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgaWRzKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGVhclNlbGVjdGVkSW1hZ2VJZHM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXNlckltYWdlc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmltYWdlSXNTZWxlY3RlZCA9IHRoaXMuaW1hZ2VJc1NlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVTZWxlY3RlZEltYWdlcyA9IHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0ZWQgPSB0aGlzLmNsZWFyU2VsZWN0ZWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHJvdXRlciwgcm91dGUgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gdXNlcm5hbWUgKyBcIidzIGJpbGxlZGVyXCI7XHJcbiAgICAgICAgcm91dGVyLnNldFJvdXRlTGVhdmVIb29rKHJvdXRlLCB0aGlzLmNsZWFyU2VsZWN0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyU2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjbGVhclNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY2xlYXJTZWxlY3RlZEltYWdlSWRzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaW1hZ2VJc1NlbGVjdGVkKGNoZWNrSWQpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVzID0gZmluZChzZWxlY3RlZEltYWdlSWRzLCAoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkID09IGNoZWNrSWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlcyA/IHRydWUgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVTZWxlY3RlZEltYWdlcygpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMsIGRlbGV0ZUltYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBkZWxldGVJbWFnZXModXNlcm5hbWUsIHNlbGVjdGVkSW1hZ2VJZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwbG9hZFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCB1cGxvYWRJbWFnZSwgc2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCBoYXNJbWFnZXMgPSBzZWxlY3RlZEltYWdlSWRzLmxlbmd0aCA+IDA7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGNhbkVkaXQgPyBcclxuICAgICAgICAgICAgPEltYWdlVXBsb2FkXHJcbiAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZT17dXBsb2FkSW1hZ2V9XHJcbiAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICBkZWxldGVTZWxlY3RlZEltYWdlcz17dGhpcy5kZWxldGVTZWxlY3RlZEltYWdlc31cclxuICAgICAgICAgICAgICAgIGhhc0ltYWdlcz17aGFzSW1hZ2VzfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IGltYWdlcywgZ2V0RnVsbG5hbWUsIGNhbkVkaXQsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGZ1bGxOYW1lID0gZ2V0RnVsbG5hbWUodXNlcm5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMiBjb2wtbGctOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMT48c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWNhcGl0YWxpemVcIj57ZnVsbE5hbWV9J3M8L3NwYW4+IDxzbWFsbD5iaWxsZWRlIGdhbGxlcmk8L3NtYWxsPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPEltYWdlTGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZXM9e2ltYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkPXthZGRTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZD17cmVtb3ZlU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlzU2VsZWN0ZWQ9e3RoaXMuaW1hZ2VJc1NlbGVjdGVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy51cGxvYWRWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBVc2VySW1hZ2VzUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2VySW1hZ2VzQ29udGFpbmVyKTtcclxuY29uc3QgVXNlckltYWdlcyA9IHdpdGhSb3V0ZXIoVXNlckltYWdlc1JlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgVXNlckltYWdlcztcclxuIiwi77u/aW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IG5vcm1hbGl6ZUNvbW1lbnQsIHZpc2l0Q29tbWVudHMsIHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi9lcnJvcidcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTa2lwQ29tbWVudHMgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TS0lQX0NPTU1FTlRTLFxyXG4gICAgICAgIHNraXA6IHNraXBcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0U2tpcCA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9TS0lQXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0VGFrZSA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9UQUtFXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRUYWtlQ29tbWVudHMgPSAodGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UQUtFX0NPTU1FTlRTLFxyXG4gICAgICAgIHRha2U6IHRha2VcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJyZW50UGFnZShwYWdlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0NVUlJFTlRfUEFHRSxcclxuICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VG90YWxQYWdlcyh0b3RhbFBhZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RPVEFMX1BBR0VTLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0Q29tbWVudHMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0RFRkFVTFRfQ09NTUVOVFNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VpdmVkQ29tbWVudHMoY29tbWVudHMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRUNJRVZFRF9DT01NRU5UUyxcclxuICAgICAgICBjb21tZW50czogY29tbWVudHNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cyArIFwiP2ltYWdlSWQ9XCIgKyBpbWFnZUlkICsgXCImc2tpcD1cIiArIHNraXAgKyBcIiZ0YWtlPVwiICsgdGFrZTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gVW5wcm9jZXNzZWQgY29tbWVudHNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VDb21tZW50cyA9IGRhdGEuQ3VycmVudEl0ZW1zO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCAocmUtc2V0KSBpbmZvXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwQ29tbWVudHMoc2tpcCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZUNvbW1lbnRzKHRha2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEN1cnJlbnRQYWdlKGRhdGEuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMoZGF0YS5Ub3RhbFBhZ2VzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVmlzaXQgZXZlcnkgY29tbWVudCBhbmQgYWRkIHRoZSB1c2VyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRBdXRob3IgPSAoYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFjLkRlbGV0ZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIoYy5BdXRob3IpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZpc2l0Q29tbWVudHMocGFnZUNvbW1lbnRzLCBhZGRBdXRob3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5vcm1hbGl6ZTogZmlsdGVyIG91dCB1c2VyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tZW50cyA9IHBhZ2VDb21tZW50cy5tYXAobm9ybWFsaXplQ29tbWVudCk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlZENvbW1lbnRzKGNvbW1lbnRzKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHBvc3RDb21tZW50ID0gKGltYWdlSWQsIHRleHQsIHBhcmVudENvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IGdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cztcclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgY29uc3QgYm9keSA9SlNPTi5zdHJpbmdpZnkoeyBcclxuICAgICAgICAgICAgVGV4dDogdGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogaW1hZ2VJZCxcclxuICAgICAgICAgICAgUGFyZW50SUQ6IHBhcmVudENvbW1lbnRJZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBib2R5LFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goaW5jcmVtZW50Q29tbWVudENvdW50KGltYWdlSWQpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBlZGl0Q29tbWVudCA9IChjb21tZW50SWQsIGltYWdlSWQsIHRleHQpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IGdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cyArIFwiP2ltYWdlSWQ9XCIgKyBpbWFnZUlkO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgSUQ6IGNvbW1lbnRJZCwgVGV4dDogdGV4dH0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUNvbW1lbnQgPSAoY29tbWVudElkLCBpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBnZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuY29tbWVudHMgKyBcIj9jb21tZW50SWQ9XCIgKyBjb21tZW50SWQ7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChkZWNyZW1lbnRDb21tZW50Q291bnQoaW1hZ2VJZCkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbmNyZW1lbnRDb21tZW50Q291bnQgPSAoaW1hZ2VJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULklOQ1JfQ09NTUVOVF9DT1VOVCxcclxuICAgICAgICBpbWFnZUlkOiBpbWFnZUlkXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWNyZW1lbnRDb21tZW50Q291bnQgPSAoaW1hZ2VJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkRFQ1JfQ09NTUVOVF9DT1VOVCxcclxuICAgICAgICBpbWFnZUlkOiBpbWFnZUlkXHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnREZWxldGVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHJlcGxpZXMsIGhhbmRsZXJzLCBjb25zdHJ1Y3RDb21tZW50cyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXBseU5vZGVzID0gY29uc3RydWN0Q29tbWVudHMocmVwbGllcywgaGFuZGxlcnMpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEgcHVsbC1sZWZ0IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1sZWZ0XCIgc3R5bGU9e3ttaW5XaWR0aDogXCI3NHB4XCJ9fT48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzbWFsbD5zbGV0dGV0PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICB7cmVwbHlOb2Rlc31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuY29uc3QgaWRzID0gKGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXBseUlkOiBjb21tZW50SWQgKyAnX3JlcGx5JyxcclxuICAgICAgICBlZGl0SWQ6IGNvbW1lbnRJZCArICdfZWRpdCcsXHJcbiAgICAgICAgZGVsZXRlSWQ6IGNvbW1lbnRJZCArICdfZGVsZXRlJyxcclxuICAgICAgICBlZGl0Q29sbGFwc2U6IGNvbW1lbnRJZCArICdfZWRpdENvbGxhcHNlJyxcclxuICAgICAgICByZXBseUNvbGxhcHNlOiBjb21tZW50SWQgKyAnX3JlcGx5Q29sbGFwc2UnXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudENvbnRyb2xzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHRleHQ6IHByb3BzLnRleHQsXHJcbiAgICAgICAgICAgIHJlcGx5OiAnJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdCA9IHRoaXMuZWRpdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHkgPSB0aGlzLnJlcGx5LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVSZXBseUNoYW5nZSA9IHRoaXMuaGFuZGxlUmVwbHlDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBlZGl0KCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdEhhbmRsZSwgY29tbWVudElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBjb25zdCB7IGVkaXRDb2xsYXBzZSB9ID0gaWRzKGNvbW1lbnRJZCk7XHJcblxyXG4gICAgICAgIGVkaXRIYW5kbGUoY29tbWVudElkLCB0ZXh0KTtcclxuICAgICAgICAkKFwiI1wiICsgZWRpdENvbGxhcHNlKS5jb2xsYXBzZSgnaGlkZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGx5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlIYW5kbGUsIGNvbW1lbnRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHJlcGx5IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlDb2xsYXBzZSB9ID0gaWRzKGNvbW1lbnRJZCk7XHJcblxyXG4gICAgICAgIHJlcGx5SGFuZGxlKGNvbW1lbnRJZCwgcmVwbHkpO1xyXG4gICAgICAgICQoXCIjXCIgKyByZXBseUNvbGxhcHNlKS5jb2xsYXBzZSgnaGlkZScpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXBseTogJycgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1Rvb2x0aXAoaXRlbSkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGJ0biA9IFwiI1wiICsgY29tbWVudElkICsgXCJfXCIgKyBpdGVtO1xyXG4gICAgICAgICQoYnRuKS50b29sdGlwKCdzaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVJlcGx5Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6IGUudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgY29tbWVudElkLCBjYW5FZGl0LCBkZWxldGVIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0Q29sbGFwc2UsIHJlcGx5Q29sbGFwc2UsIHJlcGx5SWQsIGVkaXRJZCwgZGVsZXRlSWQgfSA9IGlkcyhjb21tZW50SWQpO1xyXG4gICAgICAgIGNvbnN0IGVkaXRUYXJnZXQgPSBcIiNcIiArIGVkaXRDb2xsYXBzZTtcclxuICAgICAgICBjb25zdCByZXBseVRhcmdldCA9IFwiI1wiICsgcmVwbHlDb2xsYXBzZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgY2FuRWRpdCA/XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7cGFkZGluZ0JvdHRvbTogJzVweCcsIHBhZGRpbmdMZWZ0OiBcIjE1cHhcIn19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17ZGVsZXRlSGFuZGxlLmJpbmQobnVsbCwgY29tbWVudElkKX0gc3R5bGU9e3sgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdkZWxldGUnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtkZWxldGVJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlNsZXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtZGFuZ2VyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi10cmFzaFwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj57J1xcdTAwQTAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e2VkaXRUYXJnZXR9IHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e3RoaXMuc2hvd1Rvb2x0aXAuYmluZCh0aGlzLCAnZWRpdCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2VkaXRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIsOGbmRyZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsYWJlbCBsYWJlbC1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wZW5jaWxcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+eydcXHUwMEEwJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtyZXBseVRhcmdldH0gc3R5bGU9e3sgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdyZXBseScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e3JlcGx5SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTdmFyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXByaW1hcnlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4J319PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMCBjb2xsYXBzZVwiIGlkPXtlZGl0Q29sbGFwc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUudGV4dH0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlVGV4dENoYW5nZX0gcm93cz1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoe3RleHQ6IHRleHR9KX0gZGF0YS10YXJnZXQ9e2VkaXRUYXJnZXR9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiPkx1azwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWluZm9cIiBvbkNsaWNrPXt0aGlzLmVkaXR9PkdlbSDDpm5kcmluZ2VyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwIGNvbGxhcHNlXCIgaWQ9e3JlcGx5Q29sbGFwc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUucmVwbHl9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1pbmZvXCIgb25DbGljaz17dGhpcy5yZXBseX0+U3ZhcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PiA6IFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17e3BhZGRpbmdCb3R0b206ICc1cHgnLCBwYWRkaW5nTGVmdDogJzE1cHgnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e3RoaXMuc2hvd1Rvb2x0aXAuYmluZCh0aGlzLCAncmVwbHknKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtyZXBseUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiU3ZhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsYWJlbCBsYWJlbC1wcmltYXJ5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lbnZlbG9wZVwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMCBjb2xsYXBzZVwiIGlkPXtyZXBseUNvbGxhcHNlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHZhbHVlPXt0aGlzLnN0YXRlLnJlcGx5fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVSZXBseUNoYW5nZX0gcm93cz1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtyZXBseVRhcmdldH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4taW5mb1wiIG9uQ2xpY2s9e3RoaXMucmVwbHl9PlN2YXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudENvbnRyb2xzIH0gZnJvbSAnLi9Db21tZW50Q29udHJvbHMnXHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSAnLi9Db21tZW50UHJvZmlsZSdcclxuaW1wb3J0IHsgZm9ybWF0VGV4dCwgdGltZVRleHQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50SWQsIHBvc3RlZE9uLCBhdXRob3JJZCwgdGV4dCwgcmVwbGllcywgaGFuZGxlcnMsIGNvbnN0cnVjdENvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlIYW5kbGUsIGVkaXRIYW5kbGUsIGRlbGV0ZUhhbmRsZSwgY2FuRWRpdCwgZ2V0VXNlciB9ID0gaGFuZGxlcnM7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yID0gZ2V0VXNlcihhdXRob3JJZCk7XHJcbiAgICAgICAgY29uc3QgZnVsbG5hbWUgPSBhdXRob3IuRmlyc3ROYW1lICsgXCIgXCIgKyBhdXRob3IuTGFzdE5hbWU7XHJcbiAgICAgICAgY29uc3QgY2FuRWRpdFZhbCA9IGNhbkVkaXQoYXV0aG9ySWQpO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSBjb25zdHJ1Y3RDb21tZW50cyhyZXBsaWVzLCBoYW5kbGVycyk7XHJcbiAgICAgICAgY29uc3QgdHh0ID0gZm9ybWF0VGV4dCh0ZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYSBwdWxsLWxlZnQgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRQcm9maWxlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJtZWRpYS1oZWFkaW5nXCI+PHN0cm9uZz57ZnVsbG5hbWV9PC9zdHJvbmc+IDxQb3N0ZWRPbiBwb3N0ZWRPbj17cG9zdGVkT259IC8+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3R4dH0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudENvbnRyb2xzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0VmFsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudElkPXtjb21tZW50SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVIYW5kbGU9e2RlbGV0ZUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRIYW5kbGU9e2VkaXRIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBseUhhbmRsZT17cmVwbHlIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXt0ZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7cmVwbHlOb2Rlc31cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUG9zdGVkT24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgYWdvKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdGVkT24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHRpbWVUZXh0KHBvc3RlZE9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICg8c21hbGw+c2FnZGUge3RoaXMuYWdvKCl9PC9zbWFsbD4pO1xyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudERlbGV0ZWQgfSBmcm9tICcuL0NvbW1lbnREZWxldGVkJ1xyXG5pbXBvcnQgeyBDb21tZW50IH0gZnJvbSAnLi9Db21tZW50J1xyXG5cclxuY29uc3QgY29tcGFjdEhhbmRsZXJzID0gKHJlcGx5SGFuZGxlLCBlZGl0SGFuZGxlLCBkZWxldGVIYW5kbGUsIGNhbkVkaXQsIGdldFVzZXIpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVwbHlIYW5kbGUsXHJcbiAgICAgICAgZWRpdEhhbmRsZSxcclxuICAgICAgICBkZWxldGVIYW5kbGUsXHJcbiAgICAgICAgY2FuRWRpdCxcclxuICAgICAgICBnZXRVc2VyXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50TGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RDb21tZW50cyhjb21tZW50cywgaGFuZGxlcnMpIHtcclxuICAgICAgICBpZiAoIWNvbW1lbnRzIHx8IGNvbW1lbnRzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgIHJldHVybiBjb21tZW50cy5tYXAoKGNvbW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gXCJjb21tZW50SWRcIiArIGNvbW1lbnQuQ29tbWVudElEO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbW1lbnQuRGVsZXRlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhXCIga2V5PXtrZXl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudERlbGV0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2tleX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGllcz17Y29tbWVudC5SZXBsaWVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzPXtoYW5kbGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RDb21tZW50cz17Y29uc3RydWN0Q29tbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhXCIga2V5PXtrZXl9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtrZXl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RlZE9uPXtjb21tZW50LlBvc3RlZE9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcklkPXtjb21tZW50LkF1dGhvcklEfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17Y29tbWVudC5UZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxpZXM9e2NvbW1lbnQuUmVwbGllc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50SWQ9e2NvbW1lbnQuQ29tbWVudElEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzPXtoYW5kbGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RDb21tZW50cz17Y29uc3RydWN0Q29tbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50cywgcmVwbHlIYW5kbGUsIGVkaXRIYW5kbGUsIGRlbGV0ZUhhbmRsZSwgY2FuRWRpdCwgZ2V0VXNlciwgdXNlcklkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXJzID0gY29tcGFjdEhhbmRsZXJzKHJlcGx5SGFuZGxlLCBlZGl0SGFuZGxlLCBkZWxldGVIYW5kbGUsIGNhbkVkaXQsIGdldFVzZXIpO1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5jb25zdHJ1Y3RDb21tZW50cyhjb21tZW50cywgaGFuZGxlcnMpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICB7bm9kZXN9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBwcmV2VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGN1cnJlbnRQYWdlLCBwcmV2IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGhhc1ByZXYgPSAhKGN1cnJlbnRQYWdlID09PSAxKTtcclxuICAgICAgICBpZiAoaGFzUHJldilcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiBvbkNsaWNrPXtwcmV2fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mbGFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImRpc2FibGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JmxhcXVvOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGk+KTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IHRvdGFsUGFnZXMsIGN1cnJlbnRQYWdlLCBuZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGhhc05leHQgPSAhKHRvdGFsUGFnZXMgPT09IGN1cnJlbnRQYWdlKSAmJiAhKHRvdGFsUGFnZXMgPT09IDApO1xyXG4gICAgICAgIGlmKGhhc05leHQpXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgYXJpYS1sYWJlbD1cIk5leHRcIiBvbkNsaWNrPXtuZXh0fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mcmFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImRpc2FibGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnJhcXVvOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGk+KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBpbWFnZUlkLCBjdXJyZW50UGFnZSwgZ2V0UGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgcGFnZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB0b3RhbFBhZ2VzOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gXCJwYWdlX2l0ZW1fXCIgKyAoaW1hZ2VJZCArIGkpO1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gY3VycmVudFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2goPGxpIGNsYXNzTmFtZT1cImFjdGl2ZVwiIGtleT17a2V5fT48YSBocmVmPVwiI1wiIGtleT17a2V5IH0+e2l9PC9hPjwvbGk+KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2goPGxpIGtleT17a2V5IH0gb25DbGljaz17Z2V0UGFnZS5iaW5kKG51bGwsIGkpfT48YSBocmVmPVwiI1wiIGtleT17a2V5IH0+e2l9PC9hPjwvbGk+KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdyA9IChwYWdlcy5sZW5ndGggPiAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuKFxyXG4gICAgICAgICAgICBzaG93ID9cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy05XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG5hdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJwYWdpbmF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJldlZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7cGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMubmV4dFZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9uYXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudEZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgVGV4dDogJydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnBvc3RDb21tZW50ID0gdGhpcy5wb3N0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RDb21tZW50KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgcG9zdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwb3N0SGFuZGxlKHRoaXMuc3RhdGUuVGV4dCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6ICcnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVRleHRDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUZXh0OiBlLnRhcmdldC52YWx1ZSB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5wb3N0Q29tbWVudH0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInJlbWFya1wiPktvbW1lbnRhcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVGV4dENoYW5nZX0gdmFsdWU9e3RoaXMuc3RhdGUuVGV4dH0gcGxhY2Vob2xkZXI9XCJTa3JpdiBrb21tZW50YXIgaGVyLi4uXCIgaWQ9XCJyZW1hcmtcIiByb3dzPVwiNFwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiPlNlbmQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGZldGNoQ29tbWVudHMsIHBvc3RDb21tZW50LCBlZGl0Q29tbWVudCwgZGVsZXRlQ29tbWVudCB9IGZyb20gJy4uLy4uL2FjdGlvbnMvY29tbWVudHMnXHJcbmltcG9ydCB7IENvbW1lbnRMaXN0IH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudExpc3QnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IFBhZ2luYXRpb24gfSBmcm9tICcuLi9jb21tZW50cy9QYWdpbmF0aW9uJ1xyXG5pbXBvcnQgeyBDb21tZW50Rm9ybSB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRGb3JtJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGltYWdlSWQ6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmNvbW1lbnRzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmNvbW1lbnRzSW5mby50YWtlLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLmNvbW1lbnRzSW5mby5wYWdlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLmNvbW1lbnRzSW5mby50b3RhbFBhZ2VzLFxyXG4gICAgICAgIGNvbW1lbnRzOiBzdGF0ZS5jb21tZW50c0luZm8uY29tbWVudHMsXHJcbiAgICAgICAgZ2V0VXNlcjogKGlkKSA9PiBmaW5kKHN0YXRlLnVzZXJzSW5mby51c2VycywgKHUpID0+IHUuSUQgPT0gaWQpLFxyXG4gICAgICAgIGNhbkVkaXQ6ICh1c2VySWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09IHVzZXJJZCxcclxuICAgICAgICB1c2VySWQ6IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2FkQ29tbWVudHM6IChpbWFnZUlkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdFJlcGx5OiAoaW1hZ2VJZCwgcmVwbHlJZCwgdGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudChpbWFnZUlkLCB0ZXh0LCByZXBseUlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0Q29tbWVudDogKGltYWdlSWQsIHRleHQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQoaW1hZ2VJZCwgdGV4dCwgbnVsbCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZWRpdENvbW1lbnQ6IChpbWFnZUlkLCBjb21tZW50SWQsIHRleHQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZWRpdENvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkLCB0ZXh0KSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVDb21tZW50OiAoaW1hZ2VJZCwgY29tbWVudElkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDb21tZW50c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLm5leHRQYWdlID0gdGhpcy5uZXh0UGFnZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZ2V0UGFnZSA9IHRoaXMuZ2V0UGFnZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNQYWdlID0gdGhpcy5wcmV2aW91c1BhZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0UGFnZSgpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBza2lwTmV4dCA9IHNraXAgKyB0YWtlO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwTmV4dCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGFnZShwYWdlKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGltYWdlSWQsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgc2tpcFBhZ2VzID0gcGFnZSAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXZpb3VzUGFnZSgpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZX0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGJhY2tTa2lwID0gc2tpcCAtIHRha2U7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIGJhY2tTa2lwLCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudHMsIHBvc3RSZXBseSwgZWRpdENvbW1lbnQsIHBvc3RDb21tZW50LFxyXG4gICAgICAgICAgICAgICAgZGVsZXRlQ29tbWVudCwgY2FuRWRpdCwgZ2V0VXNlcixcclxuICAgICAgICAgICAgICAgIHVzZXJJZCwgaW1hZ2VJZCwgcGFnZSwgdG90YWxQYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTExXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50TGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudHM9e2NvbW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbHlIYW5kbGU9e3Bvc3RSZXBseS5iaW5kKG51bGwsIGltYWdlSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdEhhbmRsZT17ZWRpdENvbW1lbnQuYmluZChudWxsLCBpbWFnZUlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUhhbmRsZT17ZGVsZXRlQ29tbWVudC5iaW5kKG51bGwsIGltYWdlSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFVzZXI9e2dldFVzZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxQYWdpbmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXtpbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhZ2U9e3BhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2VzPXt0b3RhbFBhZ2VzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dD17dGhpcy5uZXh0UGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXY9e3RoaXMucHJldmlvdXNQYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UGFnZT17dGhpcy5nZXRQYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50Rm9ybVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdEhhbmRsZT17cG9zdENvbW1lbnQuYmluZChudWxsLCBpbWFnZUlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQ29tbWVudHMgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShDb21tZW50c0NvbnRhaW5lcik7Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xyXG5pbXBvcnQgeyBzZXRTZWxlY3RlZEltZywgZmV0Y2hTaW5nbGVJbWFnZSwgZGVsZXRlSW1hZ2UgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2ltYWdlcydcclxuaW1wb3J0IHsgc2V0RXJyb3IgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2Vycm9yJ1xyXG5pbXBvcnQgeyBDb21tZW50cyB9IGZyb20gJy4uL2NvbnRhaW5lcnMvQ29tbWVudHMnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IG93bmVySWQgID0gc3RhdGUuaW1hZ2VzSW5mby5vd25lcklkO1xyXG4gICAgY29uc3QgY3VycmVudElkID0gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQ7XHJcbiAgICBjb25zdCBjYW5FZGl0ID0gKG93bmVySWQgPiAwICYmIGN1cnJlbnRJZCA+IDAgJiYgb3duZXJJZCA9PSBjdXJyZW50SWQpO1xyXG5cclxuICAgIGNvbnN0IGdldEltYWdlID0gKGlkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZpbmQoc3RhdGUuaW1hZ2VzSW5mby5pbWFnZXMsIGltYWdlID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGltYWdlLkltYWdlSUQgPT0gaWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGltYWdlID0gKCkgPT4gZ2V0SW1hZ2Uoc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWQpO1xyXG4gICAgY29uc3QgZmlsZW5hbWUgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLkZpbGVuYW1lOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCBwcmV2aWV3VXJsID0gKCkgPT4geyBpZihpbWFnZSgpKSByZXR1cm4gaW1hZ2UoKS5QcmV2aWV3VXJsOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCBleHRlbnNpb24gPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLkV4dGVuc2lvbjsgcmV0dXJuICcnOyB9O1xyXG4gICAgY29uc3Qgb3JpZ2luYWxVcmwgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLk9yaWdpbmFsVXJsOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCB1cGxvYWRlZCA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuVXBsb2FkZWQ7IHJldHVybiBuZXcgRGF0ZSgpOyB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2FuRWRpdDogY2FuRWRpdCxcclxuICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWUoKSxcclxuICAgICAgICBwcmV2aWV3VXJsOiBwcmV2aWV3VXJsKCksXHJcbiAgICAgICAgZXh0ZW5zaW9uOiBleHRlbnNpb24oKSxcclxuICAgICAgICBvcmlnaW5hbFVybDogb3JpZ2luYWxVcmwoKSxcclxuICAgICAgICB1cGxvYWRlZDogdXBsb2FkZWQoKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc2VsZWN0SW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcodW5kZWZpbmVkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRFcnJvcjogKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaEltYWdlOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hTaW5nbGVJbWFnZShpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2U6IChpZCwgdXNlcm5hbWUpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNb2RhbEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSW1hZ2UgPSB0aGlzLmRlbGV0ZUltYWdlLmJpbmQodGhpcyk7IFxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVzZWxlY3RJbWFnZSwgc2V0RXJyb3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuXHJcbiAgICAgICAgY29uc3QgaXNMb2FkZWQgPSB0eXBlb2YgJCAhPT0gXCJ1bmRlZmluZWRcIjtcclxuICAgICAgICBpZihpc0xvYWRlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcyk7XHJcbiAgICAgICAgICAgICQobm9kZSkubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgJChub2RlKS5vbignaGlkZS5icy5tb2RhbCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXNlbGVjdEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnYWxsZXJ5VXJsID0gJy8nICsgdXNlcm5hbWUgKyAnL2dhbGxlcnknO1xyXG4gICAgICAgICAgICAgICAgcHVzaChnYWxsZXJ5VXJsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRFcnJvcih7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ09vcHMgc29tZXRoaW5nIHdlbnQgd3JvbmcnLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ0NvdWxkIG5vdCBmaW5kIHRoZSBpbWFnZSwgbWF5YmUgdGhlIFVSTCBpcyBpbnZhbGlkIG9yIGl0IGhhcyBiZWVuIGRlbGV0ZWQhJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSW1hZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVJbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGlkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcblxyXG4gICAgICAgIGRlbGV0ZUltYWdlKGlkLCB1c2VybmFtZSk7XHJcbiAgICAgICAgJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkubW9kYWwoJ2hpZGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJbWFnZVZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGNhbkVkaXQgP1xyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuZGVsZXRlSW1hZ2V9PlxyXG4gICAgICAgICAgICAgICAgICAgIFNsZXQgYmlsbGVkZVxyXG4gICAgICAgICAgICA8L2J1dHRvbj4gOiBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBmaWxlbmFtZSwgcHJldmlld1VybCwgZXh0ZW5zaW9uLCBvcmlnaW5hbFVybCwgdXBsb2FkZWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGZpbGVuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICAgICAgY29uc3QgdXBsb2FkRGF0ZSA9IG1vbWVudCh1cGxvYWRlZCk7XHJcbiAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IFwiVXBsb2FkZWQgZC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcblxyXG4gICAgICAgIHJldHVybiAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2cgbW9kYWwtbGdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlIHRleHQtY2VudGVyXCI+e25hbWV9PHNwYW4+PHNtYWxsPiAtIHtkYXRlU3RyaW5nfTwvc21hbGw+PC9zcGFuPjwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e29yaWdpbmFsVXJsfSB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJpbWctcmVzcG9uc2l2ZSBjZW50ZXItYmxvY2tcIiBzcmM9e3ByZXZpZXdVcmx9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50cyAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmRlbGV0ZUltYWdlVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeydcXHUwMEEwJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBTZWxlY3RlZEltYWdlUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShNb2RhbEltYWdlKTtcclxuY29uc3QgU2VsZWN0ZWRJbWFnZSA9IHdpdGhSb3V0ZXIoU2VsZWN0ZWRJbWFnZVJlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0ZWRJbWFnZTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IGNvbm5lY3QsIFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZXMvc3RvcmUnXHJcbmltcG9ydCB7IFJvdXRlciwgUm91dGUsIEluZGV4Um91dGUsIGJyb3dzZXJIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBmZXRjaEN1cnJlbnRVc2VyIH0gZnJvbSAnLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgTWFpbiBmcm9tICcuL2NvbXBvbmVudHMvTWFpbidcclxuaW1wb3J0IEFib3V0IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL0Fib3V0J1xyXG5pbXBvcnQgSG9tZSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9Ib21lJ1xyXG5pbXBvcnQgVXNlcnMgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlcnMnXHJcbmltcG9ydCBVc2VySW1hZ2VzIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJJbWFnZXMnXHJcbmltcG9ydCBTZWxlY3RlZEltYWdlIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UnXHJcbmltcG9ydCB7IGZldGNoVXNlckltYWdlcywgc2V0U2VsZWN0ZWRJbWcsIGZldGNoU2luZ2xlSW1hZ2UsIHNldEltYWdlT3duZXIgfSBmcm9tICcuL2FjdGlvbnMvaW1hZ2VzJ1xyXG5cclxuc3RvcmUuZGlzcGF0Y2goZmV0Y2hDdXJyZW50VXNlcihnbG9iYWxzLmN1cnJlbnRVc2VybmFtZSkpO1xyXG5tb21lbnQubG9jYWxlKCdkYScpO1xyXG5cclxuY29uc3Qgc2VsZWN0SW1hZ2UgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBpbWFnZUlkID0gbmV4dFN0YXRlLnBhcmFtcy5pZDtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKGltYWdlSWQpKTtcclxufVxyXG5cclxuY29uc3QgZmV0Y2hJbWFnZXMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IG5leHRTdGF0ZS5wYXJhbXMudXNlcm5hbWU7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRJbWFnZU93bmVyKHVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTtcclxufVxyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICAgICAgPFJvdXRlciBoaXN0b3J5PXticm93c2VySGlzdG9yeX0+XHJcbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGNvbXBvbmVudD17TWFpbn0+XHJcbiAgICAgICAgICAgICAgICA8SW5kZXhSb3V0ZSBjb21wb25lbnQ9e0hvbWV9IC8+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cInVzZXJzXCIgY29tcG9uZW50PXtVc2Vyc30gLz5cclxuICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiYWJvdXRcIiBjb21wb25lbnQ9e0Fib3V0fSAvPlxyXG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCI6dXNlcm5hbWUvZ2FsbGVyeVwiIGNvbXBvbmVudD17VXNlckltYWdlc30gb25FbnRlcj17ZmV0Y2hJbWFnZXN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiaW1hZ2UvOmlkXCIgY29tcG9uZW50PXtTZWxlY3RlZEltYWdlfSBvbkVudGVyPXtzZWxlY3RJbWFnZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgPC9Sb3V0ZXI+XHJcbiAgICA8L1Byb3ZpZGVyPixcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykpO1xyXG5cclxuLy88Um91dGUgcGF0aD1cImNvbW1lbnQvOmNpZFwiIGNvbXBvbmVudD17J1NpbmdsZSBDb21tZW50J30gb25FbnRlcj17J2ZldGNoU2luZ2xlQ29tbWVudENoYWluPyd9IC8+XHJcbi8vPFJvdXRlIHBhdGg9XCJjb21tZW50c1wiIGNvbXBvbmVudD17J0NvbW1lbnRzJ30gb25FbnRlcj17J2ZldGNoQ29tbWVudHMnfSAvPiJdLCJuYW1lcyI6WyJjb25zdCIsIlQuU0VUX0VSUk9SX1RJVExFIiwiVC5DTEVBUl9FUlJPUl9USVRMRSIsIlQuU0VUX0VSUk9SX01FU1NBR0UiLCJULkNMRUFSX0VSUk9SX01FU1NBR0UiLCJULlNFVF9IQVNfRVJST1IiLCJsZXQiLCJULkFERF9VU0VSIiwiVC5SRUNJRVZFRF9VU0VSUyIsIlQuU0VUX0NVUlJFTlRfVVNFUl9JRCIsImNvbWJpbmVSZWR1Y2VycyIsIlQuU0VUX0lNQUdFU19PV05FUiIsIlQuQUREX0lNQUdFIiwiVC5SRUNJRVZFRF9VU0VSX0lNQUdFUyIsIlQuUkVNT1ZFX0lNQUdFIiwiVC5JTkNSX0NPTU1FTlRfQ09VTlQiLCJULkRFQ1JfQ09NTUVOVF9DT1VOVCIsIlQuU0VUX1NFTEVDVEVEX0lNRyIsIlQuQUREX1NFTEVDVEVEX0lNQUdFX0lEIiwiVC5SRU1PVkVfU0VMRUNURURfSU1BR0VfSUQiLCJmaWx0ZXIiLCJULkNMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyIsIlQuUkVDSUVWRURfQ09NTUVOVFMiLCJULlNFVF9TS0lQX0NPTU1FTlRTIiwiVC5TRVRfVEFLRV9DT01NRU5UUyIsIlQuU0VUX0NVUlJFTlRfUEFHRSIsIlQuU0VUX1RPVEFMX1BBR0VTIiwibWVzc2FnZSIsInNraXAiLCJULlNFVF9TS0lQX1dIQVRTX05FVyIsInRha2UiLCJULlNFVF9UQUtFX1dIQVRTX05FVyIsInBhZ2UiLCJULlNFVF9QQUdFX1dIQVRTX05FVyIsInRvdGFsUGFnZXMiLCJULlNFVF9UT1RBTF9QQUdFU19XSEFUU19ORVciLCJULkFERF9MQVRFU1QiLCJjcmVhdGVTdG9yZSIsImFwcGx5TWlkZGxld2FyZSIsInN1cGVyIiwiTGluayIsIkluZGV4TGluayIsIkVycm9yIiwiR3JpZCIsIk5hdmJhciIsIk5hdiIsImNvbm5lY3QiLCJNZWRpYSIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsIm1hcFN0YXRlVG9Qcm9wcyIsImZpbmQiLCJSb3ciLCJDb2wiLCJKdW1ib3Ryb24iLCJyb3ciLCJ3aXRoUm91dGVyIiwic2V0VG90YWxQYWdlcyIsInRoaXMiLCJQcm92aWRlciIsIlJvdXRlciIsImJyb3dzZXJIaXN0b3J5IiwiUm91dGUiLCJJbmRleFJvdXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLEFBQU9BLElBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFDbkQsQUFDQSxBQUFPQSxJQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDckMsQUFBT0EsSUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDO0FBQzNDLEFBQU9BLElBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFDbkQsQUFBT0EsSUFBTSxvQkFBb0IsR0FBRyxzQkFBc0IsQ0FBQztBQUMzRCxBQUFPQSxJQUFNLHFCQUFxQixHQUFHLHVCQUF1QixDQUFDO0FBQzdELEFBQU9BLElBQU0sd0JBQXdCLEdBQUcsMEJBQTBCLENBQUM7QUFDbkUsQUFBT0EsSUFBTSx3QkFBd0IsR0FBRywwQkFBMEIsQ0FBQzs7O0FBR25FLEFBQU9BLElBQU0sbUJBQW1CLEdBQUcscUJBQXFCLENBQUM7QUFDekQsQUFBT0EsSUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ25DLEFBQ0EsQUFBT0EsSUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUM7OztBQUcvQyxBQUFPQSxJQUFNLGlCQUFpQixHQUFHLG1CQUFtQixDQUFDO0FBQ3JELEFBQU9BLElBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFDbkQsQUFBT0EsSUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFDakQsQUFBT0EsSUFBTSxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQztBQUNyRCxBQUFPQSxJQUFNLGlCQUFpQixHQUFHLG1CQUFtQixDQUFDO0FBQ3JELEFBQU9BLElBQU0sa0JBQWtCLEdBQUcsb0JBQW9CLENBQUM7QUFDdkQsQUFBT0EsSUFBTSxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQztBQUN2RCxBQUNBLEFBQ0E7QUFHQSxBQUFPQSxJQUFNLFVBQVUsR0FBRyxZQUFZLENBQUM7QUFDdkMsQUFBT0EsSUFBTSxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQztBQUN2RCxBQUFPQSxJQUFNLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDO0FBQ3ZELEFBQU9BLElBQU0sa0JBQWtCLEdBQUcsb0JBQW9CLENBQUM7QUFDdkQsQUFBT0EsSUFBTSx5QkFBeUIsR0FBRywyQkFBMkIsQ0FBQzs7O0FBR3JFLEFBQU9BLElBQU0sZUFBZSxHQUFHLGlCQUFpQixDQUFDO0FBQ2pELEFBQU9BLElBQU0saUJBQWlCLEdBQUcsbUJBQW1CO0FBQ3BELEFBQU9BLElBQU0sYUFBYSxHQUFHLGVBQWUsQ0FBQztBQUM3QyxBQUFPQSxJQUFNLGlCQUFpQixHQUFHLG1CQUFtQixDQUFDO0FBQ3JELEFBQU9BLElBQU0sbUJBQW1CLEdBQUcscUJBQXFCOztBQ3ZDakRBLElBQU0sYUFBYSxHQUFHLFVBQUMsS0FBSyxFQUFFO0lBQ2pDLE9BQU87UUFDSCxJQUFJLEVBQUVDLGVBQWlCO1FBQ3ZCLEtBQUssRUFBRSxLQUFLO0tBQ2Y7Q0FDSjs7QUFFRCxBQUFPRCxJQUFNLGVBQWUsR0FBRyxZQUFHO0lBQzlCLE9BQU87UUFDSCxJQUFJLEVBQUVFLGlCQUFtQjtLQUM1QjtDQUNKOztBQUVELEFBQU9GLElBQU0sZUFBZSxHQUFHLFVBQUMsT0FBTyxFQUFFO0lBQ3JDLE9BQU87UUFDSCxJQUFJLEVBQUVHLGlCQUFtQjtRQUN6QixPQUFPLEVBQUUsT0FBTztLQUNuQjtDQUNKOztBQUVELEFBQU9ILElBQU0saUJBQWlCLEdBQUcsWUFBRztJQUNoQyxPQUFPO1FBQ0gsSUFBSSxFQUFFSSxtQkFBcUI7S0FDOUI7Q0FDSjs7QUFFRCxBQUFPSixJQUFNLFVBQVUsR0FBRyxZQUFHO0lBQ3pCLE9BQU8sVUFBQyxRQUFRLEVBQUU7UUFDZCxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUM1QixRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3QixPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM1QjtDQUNKOztBQUVELEFBQU9BLElBQU0sV0FBVyxHQUFHLFVBQUMsUUFBUSxFQUFFO0lBQ2xDLE9BQU87UUFDSCxJQUFJLEVBQUVLLGFBQWU7UUFDckIsUUFBUSxFQUFFLFFBQVE7S0FDckI7Q0FDSjs7QUFFRCxBQUFPTCxJQUFNLFFBQVEsR0FBRyxVQUFDLEtBQUssRUFBRTtJQUM1QixPQUFPLFVBQUMsUUFBUSxFQUFFO1FBQ2QsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzVCLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN6QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM1QjtDQUNKOztBQUVELEFBQU8sSUFBTSxTQUFTLEdBQUMsa0JBQ1IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0lBQzVCLElBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLElBQVEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0NBQzFCOztBQ1BFQSxJQUFNLGNBQWMsR0FBRyxVQUFDLEdBQUcsRUFBRTtJQUNoQyxPQUFPO1FBQ0gsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO1FBQ3BCLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUTtRQUN0QixTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVM7UUFDeEIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXO1FBQzVCLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVTtRQUMxQixZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVk7UUFDOUIsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZO1FBQzlCLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0tBQ25DLENBQUM7Q0FDTDs7QUFFRCxBQUFPQSxJQUFNLGdCQUFnQixHQUFHLFVBQUMsT0FBTyxFQUFFO0lBQ3RDTSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQy9DTixJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDeENBLElBQU0sUUFBUSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQzVELE9BQU87UUFDSCxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUU7UUFDckIsUUFBUSxFQUFFLFFBQVE7UUFDbEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1FBQ3hCLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtRQUMxQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7UUFDbEIsT0FBTyxFQUFFLE9BQU87S0FDbkI7Q0FDSjs7QUFFRCxBQUFPQSxJQUFNLGVBQWUsR0FBRyxVQUFDLE1BQU0sRUFBRTtJQUNwQ00sSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7O1FBRWpCTixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksR0FBRztZQUNILFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztZQUMxQixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1lBQ2hDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUMzQixDQUFDO0tBQ0w7U0FDSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFOztRQUV2QkEsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUM1QixJQUFJLEdBQUc7WUFDSCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDZCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1lBQ3hCLGVBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtTQUMzQyxDQUFDO0tBQ0w7O0lBRUQsT0FBTztRQUNILEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNiLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtRQUNqQixJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNiLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0tBQ2xDO0NBQ0o7O0FBRUQsQUFBT0EsSUFBTSxhQUFhLEdBQUcsVUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFO0lBQzFDQSxJQUFNLFVBQVUsR0FBRyxVQUFDLENBQUMsRUFBRSxTQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUEsQ0FBQztJQUNyRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ25EO0NBQ0o7O0FBRUQsQUFBT0EsSUFBTSxnQkFBZ0IsR0FBRyxVQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFO0lBQ3pELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNkQSxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNwRDtDQUNKOztBQUVELEFBQU8sU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUU7SUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLENBQUMsRUFBRSxDQUFDO2FBQ1A7U0FDSjtLQUNKOztJQUVELE9BQU8sS0FBSyxDQUFDO0NBQ2hCOztBQUVELEFBQU9BLElBQU0sWUFBWSxHQUFHLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUN2QyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ2xDLE9BQU8sS0FBSyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDO0NBQy9COzs7QUFHRCxBQUFPQSxJQUFNLFVBQVUsR0FBRyxVQUFDLElBQUksRUFBRTtJQUM3QixJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU87SUFDbEIsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUM7Q0FDaEM7O0FBRUQsQUFBT0EsSUFBTSxRQUFRLEdBQUcsVUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO0lBQzFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7SUFDcEJBLElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDbkU7O0FBRUQsQUFBT0EsSUFBTSxRQUFRLEdBQUcsVUFBQyxRQUFRLEVBQUU7SUFDL0JBLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN2Q0EsSUFBTSxJQUFJLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEQsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ2QsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLE9BQU8sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDNUU7O0lBRUQsT0FBTyxNQUFNLEdBQUcsR0FBRyxDQUFDO0NBQ3ZCOztBQUVELEFBQU9BLElBQU0sZUFBZSxHQUFHLFVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRTtJQUNoRCxJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUUsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkM7UUFDRCxRQUFRLFFBQVEsQ0FBQyxNQUFNO1lBQ25CLEtBQUssR0FBRztnQkFDSixRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksU0FBUyxDQUFDLGlCQUFpQixFQUFFLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RixNQUFNO1lBQ1YsS0FBSyxHQUFHO2dCQUNKLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsZUFBZSxFQUFFLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RSxNQUFNO1lBQ1YsS0FBSyxHQUFHO2dCQUNKLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMscUJBQXFCLEVBQUUsb0NBQW9DLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkcsS0FBSyxHQUFHO2dCQUNKLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsa0JBQWtCLEVBQUUsMENBQTBDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xHLE1BQU07WUFDVjtnQkFDSSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkUsTUFBTTtTQUNiOztRQUVELE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzNCO0NBQ0o7O0FBRUQsQUFBT0EsSUFBTSxRQUFRLEdBQUcsWUFBRyxHQUFNOztBQy9MakNBLElBQU0sS0FBSyxHQUFHLFVBQUMsS0FBVSxFQUFFLE1BQU0sRUFBRTtpQ0FBZixHQUFHLEVBQUU7O0lBQ3JCLFFBQVEsTUFBTSxDQUFDLElBQUk7UUFDZixLQUFLTyxRQUFVO1lBQ1gsT0FBTyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3JELEtBQUtDLGNBQWdCO1lBQ2pCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QjtZQUNJLE9BQU8sS0FBSyxDQUFDO0tBQ3BCO0NBQ0o7O0FBRURSLElBQU0sYUFBYSxHQUFHLFVBQUMsS0FBVSxFQUFFLE1BQU0sRUFBRTtpQ0FBZixHQUFHLENBQUMsQ0FBQzs7SUFDN0IsUUFBUSxNQUFNLENBQUMsSUFBSTtRQUNmLEtBQUtTLG1CQUFxQjtZQUN0QixPQUFPLE1BQU0sQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDO1FBQzlCO1lBQ0ksT0FBTyxLQUFLLENBQUM7S0FDcEI7Q0FDSjs7QUFFRFQsSUFBTSxTQUFTLEdBQUdVLHFCQUFlLENBQUM7SUFDOUIsZUFBQSxhQUFhO0lBQ2IsT0FBQSxLQUFLO0NBQ1IsQ0FBQyxBQUVGOztBQ3hCQVYsSUFBTSxPQUFPLEdBQUcsVUFBQyxLQUFVLEVBQUUsTUFBTSxFQUFFO2lDQUFmLEdBQUcsQ0FBQyxDQUFDOztJQUN2QixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS1csZ0JBQWtCO1lBQ25CLE9BQU8sTUFBTSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUM7UUFDOUI7WUFDSSxPQUFPLEtBQUssQ0FBQztLQUNwQjtDQUNKOztBQUVEWCxJQUFNLE1BQU0sR0FBRyxVQUFDLEtBQVUsRUFBRSxNQUFNLEVBQUU7aUNBQWYsR0FBRyxFQUFFOztJQUN0QixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS1ksU0FBVztZQUNaLE9BQU8sS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUEsQ0FBQyxDQUFDO1FBQ3RGLEtBQUtDLG9CQUFzQjtZQUN2QixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDekIsS0FBS0MsWUFBYztZQUNmLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEdBQUcsRUFBQyxTQUFHLEdBQUcsQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLEVBQUUsR0FBQSxDQUFDLENBQUM7UUFDekQsS0FBS0Msa0JBQW9CO1lBQ3JCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsRUFBQztnQkFDakIsR0FBRyxHQUFHLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7b0JBQzlCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztpQkFDdEI7Z0JBQ0QsT0FBTyxHQUFHLENBQUM7YUFDZCxDQUFDLENBQUM7UUFDUCxLQUFLQyxrQkFBb0I7WUFDckIsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxFQUFDO2dCQUNqQixHQUFHLEdBQUcsQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtvQkFDOUIsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO2lCQUN0QjtnQkFDRCxPQUFPLEdBQUcsQ0FBQzthQUNkLENBQUMsQ0FBQztRQUNQO1lBQ0ksT0FBTyxLQUFLLENBQUM7S0FDcEI7Q0FDSjs7QUFFRGhCLElBQU0sZUFBZSxHQUFHLFVBQUMsS0FBVSxFQUFFLE1BQU0sRUFBRTtpQ0FBZixHQUFHLENBQUMsQ0FBQzs7SUFDL0IsUUFBUSxNQUFNLENBQUMsSUFBSTtRQUNmLEtBQUtpQixnQkFBa0I7WUFDbkIsT0FBTyxNQUFNLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQztRQUM5QjtZQUNJLE9BQU8sS0FBSyxDQUFDO0tBQ3BCO0NBQ0o7O0FBRURqQixJQUFNLGdCQUFnQixHQUFHLFVBQUMsS0FBVSxFQUFFLE1BQU0sRUFBRTtpQ0FBZixHQUFHLEVBQUU7O0lBQ2hDLFFBQVEsTUFBTSxDQUFDLElBQUk7UUFDZixLQUFLa0IscUJBQXVCO1lBQ3hCLE9BQU8sS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBRyxHQUFHLElBQUksR0FBRyxHQUFBLENBQUMsQ0FBQztRQUMvRCxLQUFLQyx3QkFBMEI7WUFDM0IsT0FBT0MsaUJBQU0sQ0FBQyxLQUFLLEVBQUUsVUFBQyxFQUFFLEVBQUUsU0FBRyxFQUFFLElBQUksTUFBTSxDQUFDLEVBQUUsR0FBQSxDQUFDLENBQUM7UUFDbEQsS0FBS0Msd0JBQTBCO1lBQzNCLE9BQU8sRUFBRSxDQUFDO1FBQ2Q7WUFDSSxPQUFPLEtBQUssQ0FBQztLQUNwQjtDQUNKOztBQUVEckIsSUFBTSxVQUFVLEdBQUdVLHFCQUFlLENBQUM7SUFDL0IsU0FBQSxPQUFPO0lBQ1AsUUFBQSxNQUFNO0lBQ04saUJBQUEsZUFBZTtJQUNmLGtCQUFBLGdCQUFnQjtDQUNuQixDQUFDLEFBRUY7O0FDbkVBVixJQUFNLFFBQVEsR0FBRyxVQUFDLEtBQVUsRUFBRSxNQUFNLEVBQUU7aUNBQWYsR0FBRyxFQUFFOztJQUN4QixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS3NCLGlCQUFtQjtZQUNwQixPQUFPLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDO1FBQ3BDO1lBQ0ksT0FBTyxLQUFLLENBQUM7S0FDcEI7Q0FDSjs7QUFFRHRCLElBQU0sSUFBSSxHQUFHLFVBQUMsS0FBUyxFQUFFLE1BQU0sRUFBRTtpQ0FBZCxHQUFHLENBQUM7O0lBQ25CLFFBQVEsTUFBTSxDQUFDLElBQUk7UUFDZixLQUFLdUIsaUJBQW1CO1lBQ3BCLE9BQU8sTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUM7UUFDaEM7WUFDSSxPQUFPLEtBQUssQ0FBQztLQUNwQjtDQUNKOztBQUVEdkIsSUFBTSxJQUFJLEdBQUcsVUFBQyxLQUFVLEVBQUUsTUFBTSxFQUFFO2lDQUFmLEdBQUcsRUFBRTs7SUFDcEIsUUFBUSxNQUFNLENBQUMsSUFBSTtRQUNmLEtBQUt3QixpQkFBbUI7WUFDcEIsT0FBTyxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQztRQUNoQztZQUNJLE9BQU8sS0FBSyxDQUFDO0tBQ3BCO0NBQ0o7O0FBRUR4QixJQUFNLElBQUksR0FBRyxVQUFDLEtBQVMsRUFBRSxNQUFNLEVBQUU7aUNBQWQsR0FBRyxDQUFDOztJQUNuQixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS3lCLGdCQUFrQjtZQUNuQixPQUFPLE1BQU0sQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDO1FBQ2hDO1lBQ0ksT0FBTyxLQUFLLENBQUM7S0FDcEI7Q0FDSjs7QUFFRHpCLElBQU0sVUFBVSxHQUFHLFVBQUMsS0FBUyxFQUFFLE1BQU0sRUFBRTtpQ0FBZCxHQUFHLENBQUM7O0lBQ3pCLFFBQVEsTUFBTSxDQUFDLElBQUk7UUFDZixLQUFLMEIsZUFBaUI7WUFDbEIsT0FBTyxNQUFNLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztRQUN0QztZQUNJLE9BQU8sS0FBSyxDQUFDO0tBQ3BCO0NBQ0o7O0FBRUQxQixJQUFNLFlBQVksR0FBR1UscUJBQWUsQ0FBQztJQUNqQyxVQUFBLFFBQVE7SUFDUixNQUFBLElBQUk7SUFDSixNQUFBLElBQUk7SUFDSixNQUFBLElBQUk7SUFDSixZQUFBLFVBQVU7Q0FDYixDQUFDLEFBRUY7O0FDckRPVixJQUFNLEtBQUssR0FBRyxVQUFDLEtBQVUsRUFBRSxNQUFNLEVBQUU7aUNBQWYsR0FBRyxFQUFFOztJQUM1QixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS0MsZUFBaUI7WUFDbEIsT0FBTyxNQUFNLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQztRQUNqQztZQUNJLE9BQU8sS0FBSyxDQUFDO0tBQ3BCO0NBQ0o7O0FBRUQsQUFBT0QsSUFBTTJCLFNBQU8sR0FBRyxVQUFDLEtBQVUsRUFBRSxNQUFNLEVBQUU7aUNBQWYsR0FBRyxFQUFFOztJQUM5QixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS3hCLGlCQUFtQjtZQUNwQixPQUFPLE1BQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO1FBQ25DO1lBQ0ksT0FBTyxLQUFLLENBQUM7S0FDcEI7Q0FDSjs7QUFFREgsSUFBTSxTQUFTLEdBQUdVLHFCQUFlLENBQUM7SUFDOUIsT0FBQSxLQUFLO0lBQ0wsU0FBQWlCLFNBQU87Q0FDVixDQUFDLENBQUMsQUFFSDs7QUN0Qk8zQixJQUFNLFFBQVEsR0FBRyxVQUFDLEtBQWEsRUFBRSxNQUFNLEVBQUU7aUNBQWxCLEdBQUcsS0FBSzs7SUFDbEMsUUFBUSxNQUFNLENBQUMsSUFBSTtRQUNmLEtBQUtLLGFBQWU7WUFDaEIsT0FBTyxNQUFNLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQztRQUNwQztZQUNJLE9BQU8sS0FBSyxDQUFDO0tBQ3BCO0NBQ0o7O0FBRUQsQUFBT0wsSUFBTSxPQUFPLEdBQUcsVUFBQyxLQUFVLEVBQUUsTUFBTSxFQUFFO2lDQUFmLEdBQUcsRUFBRTs7SUFDOUIsUUFBUSxNQUFNLENBQUMsSUFBSTtRQUNmO1lBQ0ksT0FBTyxLQUFLLENBQUM7S0FDcEI7Q0FDSjs7QUFFRCxBQUFPQSxJQUFNLElBQUksR0FBRyxVQUFDLEtBQVksRUFBRSxNQUFNLEVBQUU7aUNBQWpCLEdBQUcsSUFBSTs7SUFDN0IsUUFBUSxNQUFNLENBQUMsSUFBSTtRQUNmO1lBQ0ksT0FBTyxLQUFLLENBQUM7S0FDcEI7Q0FDSjs7QUFFREEsSUFBTSxVQUFVLEdBQUdVLHFCQUFlLENBQUM7SUFDL0IsVUFBQSxRQUFRO0lBQ1IsV0FBQSxTQUFTO0lBQ1QsU0FBQSxPQUFPO0lBQ1AsTUFBQSxJQUFJO0NBQ1AsQ0FBQyxBQUVGOztBQzlCQVYsSUFBTTRCLE1BQUksR0FBRyxVQUFDLEtBQVMsRUFBRSxNQUFNLEVBQUU7aUNBQWQsR0FBRyxDQUFDOztJQUNuQixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS0Msa0JBQW9CO1lBQ3JCLE9BQU8sTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUM7UUFDaEM7WUFDSSxPQUFPLEtBQUssQ0FBQztLQUNwQjtDQUNKOztBQUVEN0IsSUFBTThCLE1BQUksR0FBRyxVQUFDLEtBQVUsRUFBRSxNQUFNLEVBQUU7aUNBQWYsR0FBRyxFQUFFOztJQUNwQixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS0Msa0JBQW9CO1lBQ3JCLE9BQU8sTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUM7UUFDaEM7WUFDSSxPQUFPLEtBQUssQ0FBQztLQUNwQjtDQUNKOztBQUVEL0IsSUFBTWdDLE1BQUksR0FBRyxVQUFDLEtBQVMsRUFBRSxNQUFNLEVBQUU7aUNBQWQsR0FBRyxDQUFDOztJQUNuQixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS0Msa0JBQW9CO1lBQ3JCLE9BQU8sTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUM7UUFDaEM7WUFDSSxPQUFPLEtBQUssQ0FBQztLQUNwQjtDQUNKOztBQUVEakMsSUFBTWtDLFlBQVUsR0FBRyxVQUFDLEtBQVMsRUFBRSxNQUFNLEVBQUU7aUNBQWQsR0FBRyxDQUFDOztJQUN6QixRQUFRLE1BQU0sQ0FBQyxJQUFJO1FBQ2YsS0FBS0MseUJBQTJCO1lBQzVCLE9BQU8sTUFBTSxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUM7UUFDdEM7WUFDSSxPQUFPLEtBQUssQ0FBQztLQUNwQjtDQUNKOztBQUVEbkMsSUFBTSxLQUFLLEdBQUcsVUFBQyxLQUFVLEVBQUUsTUFBTSxFQUFFO2lDQUFmLEdBQUcsRUFBRTs7SUFDckIsUUFBUSxNQUFNLENBQUMsSUFBSTtRQUNmLEtBQUtvQyxVQUFZO1lBQ2IsT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztRQUNsQztZQUNJLE9BQU8sS0FBSyxDQUFDO0tBQ3BCO0NBQ0o7O0FBRURwQyxJQUFNLFlBQVksR0FBR1UscUJBQWUsQ0FBQztJQUNqQyxNQUFBa0IsTUFBSTtJQUNKLE1BQUFFLE1BQUk7SUFDSixNQUFBRSxNQUFJO0lBQ0osWUFBQUUsWUFBVTtJQUNWLE9BQUEsS0FBSztDQUNSLENBQUMsQUFFRjs7QUNsREFsQyxJQUFNLFdBQVcsR0FBR1UscUJBQWUsQ0FBQztJQUNoQyxXQUFBLFNBQVM7SUFDVCxZQUFBLFVBQVU7SUFDVixjQUFBLFlBQVk7SUFDWixZQUFBLFVBQVU7SUFDVixjQUFBLFlBQVk7Q0FDZixDQUFDLEFBRUY7O0FDWE9WLElBQU0sS0FBSyxHQUFHcUMsaUJBQVcsQ0FBQyxXQUFXLEVBQUVDLHFCQUFlLENBQUMsS0FBSyxDQUFDOztBQ0o1RHRDLElBQU0sT0FBTyxHQUFHO0lBQ3BCLElBQUksRUFBRSxNQUFNO0lBQ1osV0FBVyxFQUFFLFNBQVM7OztBQ0sxQkEsSUFBTSxNQUFNLEdBQUcsVUFBQyxRQUFRLEVBQUUsU0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZLEdBQUcsUUFBUSxHQUFBLENBQUM7O0FBRTFFLEFBQU8sU0FBUyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUU7SUFDakMsT0FBTztRQUNILElBQUksRUFBRVMsbUJBQXFCO1FBQzNCLEVBQUUsRUFBRSxFQUFFO0tBQ1QsQ0FBQztDQUNMOztBQUVELEFBQU8sU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFO0lBQzFCLE9BQU87UUFDSCxJQUFJLEVBQUVGLFFBQVU7UUFDaEIsSUFBSSxFQUFFLElBQUk7S0FDYixDQUFDO0NBQ0w7O0FBRUQsQUFBTyxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUU7SUFDakMsT0FBTztRQUNILElBQUksRUFBRUMsY0FBZ0I7UUFDdEIsS0FBSyxFQUFFLEtBQUs7S0FDZjtDQUNKOztBQUVELEFBQU8sU0FBUyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7SUFDdkMsT0FBTyxTQUFTLFFBQVEsRUFBRTtRQUN0QixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O1FBRTNCUixJQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzs7UUFFckQsT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQzthQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDO2FBQ2IsSUFBSSxDQUFDLFVBQUEsSUFBSSxFQUFDO2dCQUNQLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDcEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzNCLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDcEI7Q0FDSjs7QUFFRCxBQVlBLEFBQU8sU0FBUyxVQUFVLEdBQUc7SUFDekIsT0FBTyxTQUFTLFFBQVEsRUFBRTtRQUN0QkEsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckQsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO2FBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDYixJQUFJLENBQUMsVUFBQSxLQUFLLEVBQUMsU0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNoRTs7O0FDNURFLElBQU0sT0FBTyxHQUF3QjtJQUFDLGdCQUM5QixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDeEJ1QyxVQUFLLEtBQUEsQ0FBQyxNQUFBLEtBQUssQ0FBQyxDQUFDO0tBQ2hCOzs7OzRDQUFBOztJQUVELGtCQUFBLE1BQU0sc0JBQUc7UUFDTGpDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7WUFDNUQsU0FBUyxHQUFHLFFBQVEsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDOztRQUV6QyxPQUFPO1lBQ0gscUJBQUMsUUFBRyxTQUFTLEVBQUMsU0FBVSxFQUFDO2dCQUNyQixxQkFBQ2tDLGdCQUFJLEVBQUMsSUFBUSxDQUFDLEtBQUs7b0JBQ2hCLElBQUssQ0FBQyxLQUFLLENBQUMsUUFBUTtpQkFDakI7YUFDTjtTQUNSO0tBQ0osQ0FBQTs7O0VBaEJ3QixLQUFLLENBQUMsU0FpQmxDLEdBQUE7O0FBRUQsT0FBTyxDQUFDLFlBQVksR0FBRztJQUNuQixNQUFNLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0NBQ2pDOztBQUVELEFBQU8sSUFBTSxZQUFZLEdBQXdCO0lBQUMscUJBQ25DLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUN4QkQsVUFBSyxLQUFBLENBQUMsTUFBQSxLQUFLLENBQUMsQ0FBQztLQUNoQjs7OztzREFBQTs7SUFFRCx1QkFBQSxNQUFNLHNCQUFHO1FBQ0xqQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDO1lBQzVELFNBQVMsR0FBRyxRQUFRLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7UUFFekMsT0FBTztZQUNILHFCQUFDLFFBQUcsU0FBUyxFQUFDLFNBQVUsRUFBQztnQkFDckIscUJBQUNtQyxxQkFBUyxFQUFDLElBQVEsQ0FBQyxLQUFLO29CQUNyQixJQUFLLENBQUMsS0FBSyxDQUFDLFFBQVE7aUJBQ1o7YUFDWDtTQUNSO0tBQ0osQ0FBQTs7O0VBaEI2QixLQUFLLENBQUMsU0FpQnZDLEdBQUE7O0FBRUQsWUFBWSxDQUFDLFlBQVksR0FBRztJQUN4QixNQUFNLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNOzs7QUM1QzNCLElBQU1DLE9BQUssR0FBd0I7SUFBQzs7Ozs7Ozs7SUFBQSxnQkFDdkMsTUFBTSxzQkFBRztRQUNMLE9BQXFDLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBMUMsSUFBQSxVQUFVO1FBQUUsSUFBQSxLQUFLO1FBQUUsSUFBQSxPQUFPLGVBQTVCO1FBQ04sT0FBTztZQUNILHFCQUFDLFNBQUksU0FBUyxFQUFDLEtBQUssRUFBQTtnQkFDaEIscUJBQUMsU0FBSSxTQUFTLEVBQUMsMEJBQTBCLEVBQUE7b0JBQ3JDLHFCQUFDLFNBQUksU0FBUyxFQUFDLG9CQUFvQixFQUFDLElBQUksRUFBQyxPQUFPLEVBQUE7eUJBQzNDLHFCQUFDLFlBQU8sT0FBTyxFQUFDLFVBQVcsRUFBRSxJQUFJLEVBQUMsUUFBUSxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUMsY0FBWSxFQUFDLE9BQU8sRUFBQyxZQUFVLEVBQUMsT0FBTyxFQUFBLEVBQUMscUJBQUMsVUFBSyxhQUFXLEVBQUMsTUFBTSxFQUFBLEVBQUMsR0FBTyxDQUFPLENBQVM7eUJBQ3JKLHFCQUFDLGNBQU0sRUFBQyxLQUFNLEVBQVU7eUJBQ3hCLHFCQUFDLFNBQUM7NEJBQ0MsT0FBUTswQkFDUDtxQkFDSDtpQkFDSjthQUNKO1NBQ1QsQ0FBQztLQUNMLENBQUE7OztFQWhCc0IsS0FBSyxDQUFDOztBQ01qQzFDLElBQU0sZUFBZSxHQUFHLFVBQUMsS0FBSyxFQUFFO0lBQzVCLE9BQU87UUFDSCxRQUFRLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRO1FBQ25DLEtBQUssRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVM7S0FDcEMsQ0FBQztDQUNMOztBQUVEQSxJQUFNLGtCQUFrQixHQUFHLFVBQUMsUUFBUSxFQUFFO0lBQ2xDLE9BQU87UUFDSCxVQUFVLEVBQUUsWUFBRyxTQUFHLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFBO0tBQzNDO0NBQ0o7O0FBRUQsSUFBTSxLQUFLLEdBQXdCO0lBQUM7Ozs7Ozs7O0lBQUEsZ0JBQ2hDLFNBQVMseUJBQUc7UUFDUixPQUFxQyxHQUFHLElBQUksQ0FBQyxLQUFLO1FBQTFDLElBQUEsUUFBUTtRQUFFLElBQUEsVUFBVTtRQUFFLElBQUEsS0FBSyxhQUE3QjtRQUNOLElBQVEsS0FBSztRQUFFLElBQUEsT0FBTyxpQkFBaEI7UUFDTixPQUFPLENBQUMsUUFBUTtZQUNaLHFCQUFDMEMsT0FBSztnQkFDRixLQUFLLEVBQUMsS0FBTSxFQUNaLE9BQU8sRUFBQyxPQUFRLEVBQ2hCLFVBQVUsRUFBQyxVQUFXLEVBQUMsQ0FDekI7Y0FDQSxJQUFJLENBQUMsQ0FBQztLQUNmLENBQUE7O0lBRUQsZ0JBQUEsTUFBTSxzQkFBRztRQUNMLFFBQVEscUJBQUNDLG1CQUFJLElBQUMsS0FBSyxFQUFDLElBQUssRUFBQztvQkFDZCxxQkFBQ0MscUJBQU0sTUFBQTt3QkFDSCxxQkFBQ0EscUJBQU0sQ0FBQyxNQUFNLE1BQUE7NEJBQ1YscUJBQUNBLHFCQUFNLENBQUMsS0FBSyxNQUFBO2dDQUNULHFCQUFDSixnQkFBSSxJQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGNBQWMsRUFBQSxFQUFDLGtCQUFnQixDQUFPOzZCQUNsRDs0QkFDZixxQkFBQ0kscUJBQU0sQ0FBQyxNQUFNLE1BQUEsRUFBRzt5QkFDTDs7d0JBRWhCLHFCQUFDQSxxQkFBTSxDQUFDLFFBQVEsTUFBQTs0QkFDWixxQkFBQ0Msa0JBQUcsTUFBQTtnQ0FDQSxxQkFBQyxZQUFZLElBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQSxFQUFDLFNBQU8sQ0FBZTtnQ0FDM0MscUJBQUMsT0FBTyxJQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUEsRUFBQyxTQUFPLENBQVU7Z0NBQ3RDLHFCQUFDLE9BQU8sSUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFBLEVBQUMsSUFBRSxDQUFVOzZCQUMvQjs0QkFDTixxQkFBQ0QscUJBQU0sQ0FBQyxJQUFJLElBQUMsZUFBUyxFQUFBLEVBQUMsT0FDZCxFQUFBLE9BQVEsQ0FBQyxlQUFlLEVBQUMsR0FDbEMsQ0FBYzt5QkFDQTs7cUJBRWI7d0JBQ0wsSUFBSyxDQUFDLFNBQVMsRUFBRTt3QkFDakIsSUFBSyxDQUFDLEtBQUssQ0FBQyxRQUFRO2lCQUNyQjtLQUNsQixDQUFBOzs7RUF0Q2UsS0FBSyxDQUFDLFNBdUN6QixHQUFBOztBQUVENUMsSUFBTSxJQUFJLEdBQUc4QyxrQkFBTyxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEFBQ2pFOztBQzdEQSxJQUFxQixLQUFLLEdBQXdCO0lBQUM7Ozs7Ozs7O0lBQUEsZ0JBQy9DLGlCQUFpQixpQ0FBRztRQUNoQixRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztLQUN6QixDQUFBOztJQUVELGdCQUFBLE1BQU0sc0JBQUc7UUFDTCxPQUFPO1lBQ0gscUJBQUMsU0FBSSxTQUFTLEVBQUMsS0FBSyxFQUFBO2dCQUNoQixxQkFBQyxTQUFJLFNBQVMsRUFBQywwQkFBMEIsRUFBQTtvQkFDckMscUJBQUMsU0FBQyxFQUFDLHVDQUVDLEVBQUEscUJBQUMsVUFBRSxFQUFHLEVBQUEsb0JBRVYsRUFBSTtvQkFDSixxQkFBQyxVQUFFO3dCQUNDLHFCQUFDLFVBQUUsRUFBQyxPQUFLLEVBQUs7d0JBQ2QscUJBQUMsVUFBRSxFQUFDLE9BQUssRUFBSzt3QkFDZCxxQkFBQyxVQUFFLEVBQUMsYUFBVyxFQUFLO3dCQUNwQixxQkFBQyxVQUFFLEVBQUMsbUJBQWlCLEVBQUs7d0JBQzFCLHFCQUFDLFVBQUUsRUFBQyxtQkFBaUIsRUFBSztxQkFDekI7aUJBQ0g7YUFDSjtTQUNULENBQUM7S0FDTCxDQUFBOzs7RUF4QjhCLEtBQUssQ0FBQzs7QUNNbEMsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQzlCLE9BQU87UUFDSCxJQUFJLEVBQUVWLFVBQVk7UUFDbEIsTUFBTSxFQUFFLE1BQU07S0FDakI7Q0FDSjs7QUFFRCxBQUFPLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRTtJQUMxQixPQUFPO1FBQ0gsSUFBSSxFQUFFUCxrQkFBb0I7UUFDMUIsSUFBSSxFQUFFLElBQUk7S0FDYjtDQUNKOztBQUVELEFBQU8sU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFO0lBQzFCLE9BQU87UUFDSCxJQUFJLEVBQUVFLGtCQUFvQjtRQUMxQixJQUFJLEVBQUUsSUFBSTtLQUNiO0NBQ0o7O0FBRUQsQUFBTyxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUU7SUFDMUIsT0FBTztRQUNILElBQUksRUFBRUUsa0JBQW9CO1FBQzFCLElBQUksRUFBRSxJQUFJO0tBQ2I7Q0FDSjs7QUFFRCxBQUFPLFNBQVMsYUFBYSxDQUFDLFVBQVUsRUFBRTtJQUN0QyxPQUFPO1FBQ0gsSUFBSSxFQUFFRSx5QkFBMkI7UUFDakMsVUFBVSxFQUFFLFVBQVU7S0FDekI7Q0FDSjs7QUFFRCxBQUFPLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7SUFDeEMsT0FBTyxTQUFTLFFBQVEsRUFBRTtRQUN0Qm5DLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQztRQUN0RUEsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckQsT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQzthQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDO2FBQ2IsSUFBSSxDQUFDLFVBQUEsSUFBSSxFQUFDO2dCQUNQQSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUNoQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFDO29CQUNmQSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDaEMsR0FBRyxNQUFNO3dCQUNMLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztpQkFDakMsQ0FBQyxDQUFDOzs7Z0JBR0gsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7O2dCQUV6Q0EsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUksRUFBQyxTQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3hGLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUNuQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3BCOzs7QUNoRUUsSUFBTSxpQkFBaUIsR0FBd0I7SUFBQzs7Ozs7Ozs7SUFBQSw0QkFDbkQsTUFBTSxzQkFBRztRQUNMLFFBQVEscUJBQUMsV0FBRztvQkFDQSxxQkFBQyxTQUFJLFNBQVMsRUFBQyxZQUFZLEVBQUE7cUJBQ3JCO29CQUNOLHFCQUFDLFNBQUksU0FBUyxFQUFDLFlBQVksRUFBQTtxQkFDckI7aUJBQ0o7S0FDakIsQ0FBQTs7O0VBUmtDLEtBQUssQ0FBQzs7QUNBdEMsSUFBTSxjQUFjLEdBQXdCO0lBQUM7Ozs7Ozs7O0lBQUEseUJBQ2hELE1BQU0sc0JBQUc7UUFDTCxPQUFPO1lBQ0gscUJBQUMsU0FBSSxTQUFTLEVBQUMsWUFBWSxFQUFBO2dCQUN2QixxQkFBQyxTQUFJLFNBQVMsRUFBQyxjQUFjLEVBQ3pCLEdBQUcsRUFBQyx5QkFBeUIsRUFDN0Isc0JBQW9CLEVBQUMsTUFBTSxFQUMzQixLQUFLLEVBQUMsRUFBRyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBQyxDQUMzQztnQkFDRixJQUFLLENBQUMsS0FBSyxDQUFDLFFBQVE7YUFDbEIsQ0FBQyxDQUFDO0tBQ2YsQ0FBQTs7O0VBWCtCLEtBQUssQ0FBQyxTQVl6QyxHQUFBOztBQ1JNLElBQU0sbUJBQW1CLEdBQXdCO0lBQUM7Ozs7Ozs7O0lBQUEsOEJBQ3JELGFBQWEsNkJBQUc7UUFDWixPQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBbkIsSUFBQSxJQUFJLFlBQU47UUFDTixPQUFPLFVBQVUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDOUQsQ0FBQTs7SUFFRCw4QkFBQSxRQUFRLHdCQUFHO1FBQ1AsT0FBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSztRQUFyQixJQUFBLE1BQU0sY0FBUjtRQUNOLE9BQU8sTUFBTSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztLQUNuRCxDQUFBOztJQUVELDhCQUFBLElBQUksb0JBQUc7UUFDSCxPQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBakIsSUFBQSxFQUFFLFVBQUo7UUFDTixPQUFPLFFBQVEsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbEMsQ0FBQTs7SUFFRCw4QkFBQSxNQUFNLHNCQUFHO1FBQ0wsT0FBNkIsR0FBRyxJQUFJLENBQUMsS0FBSztRQUFsQyxJQUFBLE9BQU87UUFBRSxJQUFBLFVBQVUsa0JBQXJCO1FBQ05BLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMvQkEsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JDQSxJQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsUUFBUSxHQUFHLGlCQUFpQixHQUFHLE9BQU8sQ0FBQztRQUN0RSxRQUFRLHFCQUFDK0Msb0JBQUssQ0FBQyxRQUFRLE1BQUE7b0JBQ1gscUJBQUMsY0FBYyxNQUFBLEVBQUc7b0JBQ2xCLHFCQUFDQSxvQkFBSyxDQUFDLElBQUksTUFBQTt3QkFDUCxxQkFBQyxRQUFHLFNBQVMsRUFBQyxlQUFlLEVBQUEsRUFBQyxNQUFPLEVBQUMsR0FBQyxFQUFBLHFCQUFDLGFBQUssRUFBQyxJQUFLLENBQUMsSUFBSSxFQUFFLEVBQVMsQ0FBSzs0QkFDcEUscUJBQUMsVUFBRSxFQUFDLHFCQUFDLFVBQUssdUJBQXVCLEVBQUMsT0FBUSxFQUFDLENBQVEsRUFBSzs0QkFDeEQscUJBQUNQLGdCQUFJLElBQUMsRUFBRSxFQUFDLFdBQVksRUFBQyxFQUFDLGNBQVksQ0FBTztxQkFDckM7aUJBQ0E7S0FDNUIsQ0FBQTs7O0VBN0JvQyxLQUFLLENBQUMsU0E4QjlDLEdBQUE7O0FDL0JNLElBQU0sWUFBWSxHQUF3QjtJQUFDOzs7Ozs7OztJQUFBLHVCQUM5QyxjQUFjLDhCQUFHO1FBQ2IsT0FBd0IsR0FBRyxJQUFJLENBQUMsS0FBSztRQUE3QixJQUFBLEtBQUs7UUFBRSxJQUFBLE9BQU8sZUFBaEI7UUFDTnhDLElBQU0sV0FBVyxHQUFHLFVBQUMsRUFBRSxFQUFFLFNBQUcsV0FBVyxHQUFHLEVBQUUsR0FBQSxDQUFDO1FBQzdDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksRUFBQztZQUNsQkEsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0Q0EsSUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyQyxRQUFRLElBQUksQ0FBQyxJQUFJO2dCQUNiLEtBQUssQ0FBQztvQkFDRixRQUFRLHFCQUFDLGlCQUFpQjtnQ0FDZCxFQUFFLEVBQUMsSUFBSyxDQUFDLEVBQUUsRUFDWCxJQUFJLEVBQUMsSUFBSyxDQUFDLElBQUksRUFDZixFQUFFLEVBQUMsSUFBSyxDQUFDLEVBQUUsRUFDWCxNQUFNLEVBQUMsTUFBTyxFQUNkLEdBQUcsRUFBQyxPQUFRLEVBQUMsQ0FDZjtnQkFDZCxLQUFLLENBQUM7b0JBQ0YsUUFBUSxxQkFBQyxtQkFBbUI7Z0NBQ2hCLEVBQUUsRUFBQyxJQUFLLENBQUMsRUFBRSxFQUNYLElBQUksRUFBQyxJQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFDcEIsVUFBVSxFQUFDLElBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUNyQyxPQUFPLEVBQUMsSUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQzFCLEVBQUUsRUFBQyxJQUFLLENBQUMsRUFBRSxFQUNYLE1BQU0sRUFBQyxNQUFPLEVBQ2QsR0FBRyxFQUFDLE9BQVEsRUFBQyxDQUNmO2FBQ2pCO1NBQ0osQ0FBQztLQUNMLENBQUE7O0lBRUQsdUJBQUEsTUFBTSxzQkFBRztRQUNMQSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEMsUUFBUSxxQkFBQytDLG9CQUFLLENBQUMsSUFBSSxNQUFBO29CQUNQLFNBQVU7aUJBQ0Q7S0FDeEIsQ0FBQTs7O0VBbkM2QixLQUFLLENBQUM7O0FDQ3hDL0MsSUFBTWdELG9CQUFrQixHQUFHLFVBQUMsUUFBUSxFQUFFO0lBQ2xDLE9BQU87UUFDSCxTQUFTLEVBQUUsVUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBQTtLQUNuRTtDQUNKOztBQUVEaEQsSUFBTWlELGlCQUFlLEdBQUcsVUFBQyxLQUFLLEVBQUU7SUFDNUIsT0FBTztRQUNILEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUs7UUFDL0IsT0FBTyxFQUFFLFVBQUMsRUFBRSxFQUFFLFNBQUdDLGVBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFDLElBQUksRUFBRTtZQUNoRCxPQUFPLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3hCLENBQUMsR0FBQTtRQUNGLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUk7UUFDN0IsSUFBSSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSTtLQUNoQztDQUNKOztBQUVELElBQU0saUJBQWlCLEdBQXdCO0lBQUM7Ozs7Ozs7O0lBQUEsNEJBQzVDLGlCQUFpQixpQ0FBRztRQUNoQixPQUErQixHQUFHLElBQUksQ0FBQyxLQUFLO1FBQXBDLElBQUEsU0FBUztRQUFFLElBQUEsSUFBSTtRQUFFLElBQUEsSUFBSSxZQUF2QjtRQUNOLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDekIsQ0FBQTs7SUFFRCw0QkFBQSxNQUFNLHNCQUFHO1FBQ0wsT0FBd0IsR0FBRyxJQUFJLENBQUMsS0FBSztRQUE3QixJQUFBLEtBQUs7UUFBRSxJQUFBLE9BQU8sZUFBaEI7UUFDTixRQUFRLHFCQUFDLFdBQUc7b0JBQ0EscUJBQUMsVUFBRSxFQUFDLFlBQVUsRUFBSztvQkFDbkIscUJBQUMsWUFBWTt3QkFDVCxLQUFLLEVBQUMsS0FBTSxFQUNaLE9BQU8sRUFBQyxPQUFRLEVBQUMsQ0FDbkI7aUJBQ0E7S0FDakIsQ0FBQTs7O0VBZjJCLEtBQUssQ0FBQyxTQWdCckMsR0FBQTs7QUFFRGxELElBQU0sUUFBUSxHQUFHOEMsa0JBQU8sQ0FBQ0csaUJBQWUsRUFBRUQsb0JBQWtCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxBQUNoRjs7QUNyQ0FoRCxJQUFNaUQsaUJBQWUsR0FBRyxVQUFDLEtBQUssRUFBRTtJQUM1QmpELElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsRUFBQyxTQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsR0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckhBLElBQU0sSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztJQUM1QyxPQUFPO1FBQ0gsSUFBSSxFQUFFLElBQUk7S0FDYjtDQUNKOztBQUVELElBQU0sUUFBUSxHQUF3QjtJQUFDOzs7Ozs7OztJQUFBLG1CQUNuQyxpQkFBaUIsaUNBQUc7UUFDaEIsUUFBUSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7S0FDOUIsQ0FBQTs7SUFFRCxtQkFBQSxNQUFNLHNCQUFHO1FBQ0wsT0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLO1FBQW5CLElBQUEsSUFBSSxZQUFOO1FBQ04sUUFBUSxxQkFBQ21ELGtCQUFHLE1BQUE7b0JBQ0EscUJBQUNDLGtCQUFHLElBQUMsUUFBUSxFQUFDLENBQUUsRUFBRSxFQUFFLEVBQUMsQ0FBRSxFQUFDO3dCQUNwQixxQkFBQ0Msd0JBQVMsTUFBQTs0QkFDTixxQkFBQyxVQUFFLEVBQUMsWUFBVSxFQUFBLHFCQUFDLGFBQUssRUFBQyxJQUFLLEVBQUMsR0FBQyxFQUFRLEVBQUs7NEJBQ3pDLHFCQUFDLE9BQUUsU0FBUyxFQUFDLE1BQU0sRUFBQSxFQUFDLDRCQUVwQixDQUFJO3lCQUNJO3dCQUNaLHFCQUFDLFFBQVEsTUFBQSxFQUFHO3FCQUNWO2lCQUNKO0tBQ2pCLENBQUE7OztFQWxCa0IsS0FBSyxDQUFDLFNBbUI1QixHQUFBOztBQUVEckQsSUFBTSxJQUFJLEdBQUc4QyxrQkFBTyxDQUFDRyxpQkFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxBQUNyRDs7QUNoQ08sSUFBTSxJQUFJLEdBQXdCO0lBQUM7Ozs7Ozs7O0lBQUEsZUFDdEMsTUFBTSxzQkFBRztRQUNMLElBQUksS0FBSyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QyxJQUFJLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3JELE9BQU87WUFDSCxxQkFBQyxTQUFJLFNBQVMsRUFBQyw4QkFBOEIsRUFBQyxLQUFLLEVBQUMsRUFBRyxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsRUFBQztnQkFDN0YscUJBQUMsU0FBSSxTQUFTLEVBQUMsS0FBSyxFQUFBO29CQUNoQixxQkFBQyxTQUFJLFNBQVMsRUFBQyxVQUFVLEVBQUE7d0JBQ3JCLHFCQUFDLGNBQU0sRUFBQyxZQUFVLEVBQVM7cUJBQ3pCO29CQUNOLHFCQUFDLFNBQUksU0FBUyxFQUFDLFVBQVUsRUFBQTt3QkFDckIsSUFBSyxDQUFDLEtBQUssQ0FBQyxRQUFRO3FCQUNsQjtpQkFDSjtnQkFDTixxQkFBQyxTQUFJLFNBQVMsRUFBQyxLQUFLLEVBQUE7b0JBQ2hCLHFCQUFDLFNBQUksU0FBUyxFQUFDLFVBQVUsRUFBQTt3QkFDckIscUJBQUMsY0FBTSxFQUFDLFNBQU8sRUFBUztxQkFDdEI7b0JBQ04scUJBQUMsU0FBSSxTQUFTLEVBQUMsVUFBVSxFQUFBO3dCQUNyQixJQUFLLENBQUMsS0FBSyxDQUFDLFNBQVM7cUJBQ25CO2lCQUNKO2dCQUNOLHFCQUFDLFNBQUksU0FBUyxFQUFDLEtBQUssRUFBQTtvQkFDaEIscUJBQUMsU0FBSSxTQUFTLEVBQUMsVUFBVSxFQUFBO3dCQUNyQixxQkFBQyxjQUFNLEVBQUMsV0FBUyxFQUFTO3FCQUN4QjtvQkFDTixxQkFBQyxTQUFJLFNBQVMsRUFBQyxVQUFVLEVBQUE7d0JBQ3JCLElBQUssQ0FBQyxLQUFLLENBQUMsUUFBUTtxQkFDbEI7aUJBQ0o7Z0JBQ04scUJBQUMsU0FBSSxTQUFTLEVBQUMsS0FBSyxFQUFBO29CQUNoQixxQkFBQyxTQUFJLFNBQVMsRUFBQyxVQUFVLEVBQUE7d0JBQ3JCLHFCQUFDLGNBQU0sRUFBQyxPQUFLLEVBQVM7cUJBQ3BCO29CQUNOLHFCQUFDLFNBQUksU0FBUyxFQUFDLFVBQVUsRUFBQTt3QkFDckIscUJBQUMsT0FBRSxJQUFJLEVBQUMsS0FBTSxFQUFDLEVBQUMsSUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUs7cUJBQ3BDO2lCQUNKO2dCQUNOLHFCQUFDLFNBQUksU0FBUyxFQUFDLEtBQUssRUFBQTtvQkFDaEIscUJBQUMsU0FBSSxTQUFTLEVBQUMsVUFBVSxFQUFBO3dCQUNyQixxQkFBQyxjQUFNLEVBQUMsVUFBUSxFQUFTO3FCQUN2QjtvQkFDTixxQkFBQyxTQUFJLFNBQVMsRUFBQyxVQUFVLEVBQUE7d0JBQ3JCLHFCQUFDVCxnQkFBSSxJQUFDLEVBQUUsRUFBQyxPQUFRLEVBQUMsRUFBQyxVQUFRLENBQU87cUJBQ2hDO2lCQUNKO2FBQ0o7U0FDVCxDQUFDO0tBQ0wsQ0FBQTs7O0VBaERxQixLQUFLLENBQUM7O0FDQ3pCLElBQU0sUUFBUSxHQUF3QjtJQUFDOzs7Ozs7OztJQUFBLG1CQUMxQyxTQUFTLHlCQUFHO1FBQ1IsT0FBZSxHQUFHLElBQUksQ0FBQyxLQUFLO1FBQXBCLElBQUEsS0FBSyxhQUFQO1FBQ04sT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFO1lBQ3BCeEMsSUFBTSxNQUFNLEdBQUcsU0FBUSxJQUFFLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBRztZQUNuQyxPQUFPLENBQUMscUJBQUMsSUFBSTswQkFDQyxRQUFRLEVBQUMsSUFBSyxDQUFDLFFBQVEsRUFDdkIsTUFBTSxFQUFDLElBQUssQ0FBQyxFQUFFLEVBQ2YsU0FBUyxFQUFDLElBQUssQ0FBQyxTQUFTLEVBQ3pCLFFBQVEsRUFBQyxJQUFLLENBQUMsUUFBUSxFQUN2QixLQUFLLEVBQUMsSUFBSyxDQUFDLEtBQUssRUFDakIsVUFBVSxFQUFDLElBQUssQ0FBQyxZQUFZLEVBQzdCLEtBQUssRUFBQyxJQUFLLENBQUMsS0FBSyxFQUNqQixHQUFHLEVBQUMsTUFBTyxFQUFDLENBQ2QsQ0FBQyxDQUFDO1NBQ2pCLENBQUMsQ0FBQztLQUNOLENBQUE7O0lBRUQsbUJBQUEsTUFBTSxzQkFBRztRQUNMQSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDL0IsT0FBTztZQUNILHFCQUFDLFNBQUksU0FBUyxFQUFDLEtBQUssRUFBQTtnQkFDaEIsS0FBTTthQUNKLENBQUM7S0FDZCxDQUFBOzs7RUF4QnlCLEtBQUssQ0FBQzs7QUNDcENBLElBQU0sZUFBZSxHQUFHLFVBQUMsS0FBSyxFQUFFO0lBQzVCLE9BQU87UUFDSCxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLO0tBQy9CLENBQUM7Q0FDTDs7QUFFREEsSUFBTWdELG9CQUFrQixHQUFHLFVBQUMsUUFBUSxFQUFFO0lBQ2xDLE9BQU87UUFDSCxRQUFRLEVBQUUsWUFBRztZQUNULFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1NBQzFCO0tBQ0osQ0FBQztDQUNMOztBQUVELElBQU0sY0FBYyxHQUF3QjtJQUFDOzs7Ozs7OztJQUFBLHlCQUN6QyxpQkFBaUIsaUNBQUc7UUFDaEIsUUFBUSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN6QixDQUFBOztJQUVELHlCQUFBLE1BQU0sc0JBQUc7UUFDTCxPQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBcEIsSUFBQSxLQUFLLGFBQVA7UUFDTixPQUFPO1lBQ0gscUJBQUMsU0FBSSxTQUFTLEVBQUMsS0FBSyxFQUFBO2dCQUNoQixxQkFBQyxTQUFJLFNBQVMsRUFBQywwQkFBMEIsRUFBQTtvQkFDckMscUJBQUMsU0FBSSxTQUFTLEVBQUMsYUFBYSxFQUFBO3dCQUN4QixxQkFBQyxVQUFFLEVBQUMsWUFBVSxFQUFBLHFCQUFDLGFBQUssRUFBQyxTQUFPLEVBQVEsRUFBSztxQkFDdkM7b0JBQ04scUJBQUMsU0FBSSxTQUFTLEVBQUMsS0FBSyxFQUFBO3dCQUNoQixxQkFBQyxRQUFRLElBQUMsS0FBSyxFQUFDLEtBQU0sRUFBQyxDQUFHO3FCQUN4QjtpQkFDSjthQUNKLENBQUMsQ0FBQztLQUNmLENBQUE7OztFQW5Cd0IsS0FBSyxDQUFDLFNBb0JsQyxHQUFBOztBQUVEaEQsSUFBTSxLQUFLLEdBQUc4QyxrQkFBTyxDQUFDLGVBQWUsRUFBRUUsb0JBQWtCLENBQUMsQ0FBQyxjQUFjLENBQUMsQUFDMUU7O0FDakNPLFNBQVMsY0FBYyxDQUFDLEVBQUUsRUFBRTtJQUMvQixPQUFPO1FBQ0gsSUFBSSxFQUFFckMsZ0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSxFQUFFO0tBQ1QsQ0FBQztDQUNMOztBQUVELEFBQU8sU0FBUyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUU7SUFDdkMsT0FBTztRQUNILElBQUksRUFBRUUsb0JBQXNCO1FBQzVCLE1BQU0sRUFBRSxNQUFNO0tBQ2pCLENBQUM7Q0FDTDs7QUFFRCxBQUFPYixJQUFNLGNBQWMsR0FBRyxVQUFDLEVBQUUsRUFBRTtJQUMvQixPQUFPO1FBQ0gsSUFBSSxFQUFFaUIsZ0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSxFQUFFO0tBQ1QsQ0FBQztDQUNMOztBQUVELEFBQU8sU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFO0lBQzFCLE9BQU87UUFDSCxJQUFJLEVBQUVMLFNBQVc7UUFDakIsS0FBSyxFQUFFLEdBQUc7S0FDYixDQUFDO0NBQ0w7O0FBRUQsQUFBTyxTQUFTLFdBQVcsQ0FBQyxFQUFFLEVBQUU7SUFDNUIsT0FBTztRQUNILElBQUksRUFBRUUsWUFBYztRQUNwQixFQUFFLEVBQUUsRUFBRTtLQUNULENBQUM7Q0FDTDs7QUFFRCxBQUFPLFNBQVMsa0JBQWtCLENBQUMsRUFBRSxFQUFFO0lBQ25DLE9BQU87UUFDSCxJQUFJLEVBQUVJLHFCQUF1QjtRQUM3QixFQUFFLEVBQUUsRUFBRTtLQUNULENBQUM7Q0FDTDs7QUFFRCxBQUFPLFNBQVMscUJBQXFCLENBQUMsRUFBRSxFQUFFO0lBQ3RDLE9BQU87UUFDSCxJQUFJLEVBQUVDLHdCQUEwQjtRQUNoQyxFQUFFLEVBQUUsRUFBRTtLQUNULENBQUM7Q0FDTDs7QUFFRCxBQUFPLFNBQVMscUJBQXFCLEdBQUc7SUFDcEMsT0FBTztRQUNILElBQUksRUFBRUUsd0JBQTBCO0tBQ25DLENBQUM7Q0FDTDs7QUFFRCxBQUFPLFNBQVMsV0FBVyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUU7SUFDdEMsT0FBTyxTQUFTLFFBQVEsRUFBRTtRQUN0QnJCLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksR0FBRyxRQUFRLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUN4RUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO1lBQ25DLE1BQU0sRUFBRSxRQUFRO1NBQ25CLENBQUMsQ0FBQzs7UUFFSEEsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7O1FBRXJELE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7YUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUNiLElBQUksQ0FBQyxZQUFHLFNBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFBLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDeEQ7Q0FDSjs7QUFFRCxBQUFPLFNBQVMsV0FBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7SUFDNUMsT0FBTyxTQUFTLFFBQVEsRUFBRTtRQUN0QkEsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFHLFFBQVEsQ0FBQztRQUMxREEsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO1lBQ25DLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLFFBQVE7U0FDakIsQ0FBQyxDQUFDOztRQUVIQSxJQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzs7UUFFckQsT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzthQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDO2FBQ2IsSUFBSSxDQUFDLFlBQUcsU0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNsRTtDQUNKOztBQUVELEFBQU8sU0FBUyxlQUFlLENBQUMsUUFBUSxFQUFFO0lBQ3RDLE9BQU8sU0FBUyxRQUFRLEVBQUUsUUFBUSxFQUFFO1FBQ2hDQSxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsUUFBUSxDQUFDOztRQUUxREEsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7O1FBRXJEQSxJQUFNLFNBQVMsR0FBRyxVQUFDLElBQUksRUFBRTtZQUNyQkEsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN0RCxRQUFRLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUM1Qzs7UUFFRCxPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO2FBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDYixJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDO0NBQ0o7O0FBRUQsQUFBTyxTQUFTLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBYSxFQUFFO3VDQUFQLEdBQUcsRUFBRTs7SUFDaEQsT0FBTyxTQUFTLFFBQVEsRUFBRTtRQUN0QkEsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCQSxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsUUFBUSxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDMUVBLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtZQUNuQyxNQUFNLEVBQUUsUUFBUTtTQUNuQixDQUFDLENBQUM7O1FBRUhBLElBQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztRQUVyRCxPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO2FBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDYixJQUFJLENBQUMsWUFBRyxTQUFHLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQUEsRUFBRSxRQUFRLENBQUM7YUFDdkQsSUFBSSxDQUFDLFlBQUcsU0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUEsQ0FBQyxDQUFDO0tBQ3hEO0NBQ0o7O0FBRUQsQUFBTyxTQUFTLGFBQWEsQ0FBQyxRQUFRLEVBQUU7SUFDcEMsT0FBTyxTQUFTLFFBQVEsRUFBRSxRQUFRLEVBQUU7O1FBRWhDQSxJQUFNLFNBQVMsR0FBRyxZQUFHO1lBQ2pCLE9BQU9rRCxlQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFDLElBQUksRUFBRTtnQkFDM0MsT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQzthQUNwQyxDQUFDLENBQUM7U0FDTjs7UUFFRDVDLElBQUksS0FBSyxHQUFHLFNBQVMsRUFBRSxDQUFDOztRQUV4QixHQUFHLEtBQUssRUFBRTtZQUNOTixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3pCLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNsQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUM1QjthQUNJO1lBQ0QsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxHQUFHLFFBQVEsQ0FBQztZQUN2REEsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckQsT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztpQkFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQztpQkFDYixJQUFJLENBQUMsVUFBQSxJQUFJLEVBQUMsU0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUEsRUFBRSxRQUFRLENBQUM7aUJBQy9DLElBQUksQ0FBQyxZQUFHO29CQUNMLEtBQUssR0FBRyxTQUFTLEVBQUUsQ0FBQztvQkFDcEIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDdEMsQ0FBQyxDQUFDO1NBQ1Y7S0FDSjtDQUNKOztBQUVEQSxBQWNBLEFBQU8sU0FBUyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUU7SUFDakMsT0FBTyxTQUFTLFFBQVEsRUFBRSxRQUFRLEVBQUU7UUFDaENBLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDdERBLElBQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7YUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUNiLElBQUksQ0FBQyxVQUFBLEdBQUcsRUFBQztnQkFDTixHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU87Z0JBQ2hCQSxJQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQzthQUN2QyxDQUFDLENBQUM7S0FDVjs7O0FDckxFLElBQU0sV0FBVyxHQUF3QjtJQUFDLG9CQUNsQyxDQUFDLEtBQUssRUFBRTtRQUNmdUMsVUFBSyxLQUFBLENBQUMsTUFBQSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEQ7Ozs7b0RBQUE7O0lBRUQsc0JBQUEsVUFBVSx3QkFBQyxTQUFTLEVBQUU7UUFDbEIsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ2YsR0FBRztnQkFDQyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzthQUN4QixNQUFNLEdBQUcsQ0FBQyxHQUFHO1lBQ2QsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO2dCQUNmLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO29CQUNyQyxVQUFVLEdBQUcsU0FBUyxDQUFDLFVBQVUsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQztnQkFDbkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNiLFVBQVUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzFDO1NBQ0o7S0FDSixDQUFBOztJQUVELHNCQUFBLFFBQVEsd0JBQUc7UUFDUHZDLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDLENBQUE7O0lBRUQsc0JBQUEsWUFBWSwwQkFBQyxDQUFDLEVBQUU7UUFDWixPQUErQixHQUFHLElBQUksQ0FBQyxLQUFLO1FBQXBDLElBQUEsV0FBVztRQUFFLElBQUEsUUFBUSxnQkFBdkI7UUFDTixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDbkJBLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLE9BQU87UUFDOUJNLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkNOLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqQzs7UUFFRCxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hDQSxJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDOUIsQ0FBQTs7SUFFRCxzQkFBQSxTQUFTLHlCQUFHO1FBQ1IsT0FBeUMsR0FBRyxJQUFJLENBQUMsS0FBSztRQUE5QyxJQUFBLFNBQVM7UUFBRSxJQUFBLG9CQUFvQiw0QkFBakM7UUFDTixPQUFPLENBQUMsU0FBUztnQkFDVCxxQkFBQyxZQUFPLElBQUksRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLGdCQUFnQixFQUFDLE9BQU8sRUFBQyxvQkFBcUIsRUFBQyxFQUFDLHdCQUFzQixDQUFTO2tCQUM3RyxxQkFBQyxZQUFPLElBQUksRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLGdCQUFnQixFQUFDLE9BQU8sRUFBQyxvQkFBcUIsRUFBRSxRQUFRLEVBQUMsVUFBVSxFQUFBLEVBQUMsd0JBQXNCLENBQVMsQ0FBQyxDQUFDO0tBQ2xKLENBQUE7O0lBRUQsc0JBQUEsTUFBTSxzQkFBRztRQUNMLE9BQU87WUFDSCxxQkFBQyxTQUFJLFNBQVMsRUFBQyxLQUFLLEVBQUE7Z0JBQ2hCLHFCQUFDLFVBQUUsRUFBRztnQkFDTixxQkFBQyxTQUFJLFNBQVMsRUFBQyxVQUFVLEVBQUE7b0JBQ3JCLHFCQUFDOzBCQUNLLFFBQVEsRUFBQyxJQUFLLENBQUMsWUFBWSxFQUMzQixFQUFFLEVBQUMsYUFBYSxFQUNoQixPQUFPLEVBQUMscUJBQXFCLEVBQUE7NEJBQzNCLHFCQUFDLFNBQUksU0FBUyxFQUFDLFlBQVksRUFBQTtnQ0FDdkIscUJBQUMsV0FBTSxPQUFPLEVBQUMsT0FBTyxFQUFBLEVBQUMsZUFBYSxDQUFRO2dDQUM1QyxxQkFBQyxXQUFNLElBQUksRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLGNBQWMsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsY0FBUSxFQUFBLENBQUc7NkJBQzdFOzRCQUNOLHFCQUFDLFlBQU8sSUFBSSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQSxFQUFDLFFBQU0sQ0FBUzs0QkFDN0UsUUFBUzs0QkFDVCxJQUFLLENBQUMsU0FBUyxFQUFFO3FCQUNsQjtpQkFDTDthQUNKO1NBQ1QsQ0FBQztLQUNMLENBQUE7OztFQXJFNEIsS0FBSyxDQUFDOztBQ0FoQyxJQUFNLEtBQUssR0FBd0I7SUFBQyxjQUM1QixDQUFDLEtBQUssRUFBRTtRQUNmdUMsVUFBSyxLQUFBLENBQUMsTUFBQSxLQUFLLENBQUMsQ0FBQzs7O1FBR2IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxRDs7Ozt3Q0FBQTs7SUFFRCxnQkFBQSxlQUFlLDZCQUFDLENBQUMsRUFBRTtRQUNmLE9BQWUsR0FBRyxJQUFJLENBQUMsS0FBSztRQUFwQixJQUFBLEtBQUssYUFBUDtRQUNOdkMsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDcEMsR0FBRyxHQUFHLEVBQUU7WUFDSixTQUE0QixHQUFHLElBQUksQ0FBQyxLQUFLO1lBQWpDLElBQUEsa0JBQWtCLDRCQUFwQjtZQUNOLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNyQzthQUNJO1lBQ0QsU0FBK0IsR0FBRyxJQUFJLENBQUMsS0FBSztZQUFwQyxJQUFBLHFCQUFxQiwrQkFBdkI7WUFDTixxQkFBcUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDeEM7S0FDSixDQUFBOztJQUVELGdCQUFBLFdBQVcseUJBQUMsS0FBSyxFQUFFO1FBQ2ZBLElBQU0sS0FBSyxHQUFHLEtBQUssSUFBSSxDQUFDLEdBQUcscUJBQXFCLEdBQUcsdUJBQXVCLENBQUM7UUFDM0VBLElBQU0sS0FBSyxHQUFHO1lBQ1YsU0FBUyxFQUFFLEtBQUs7U0FDbkIsQ0FBQzs7UUFFRixRQUFRLHFCQUFDLE9BQUksS0FBVTtvQkFDWCxxQkFBQyxVQUFLLFNBQVMsRUFBQyw2QkFBNkIsRUFBQyxhQUFXLEVBQUMsTUFBTSxFQUFBLENBQVEsRUFBQSxHQUFDLEVBQUEsS0FBTTtpQkFDN0U7S0FDakIsQ0FBQTs7SUFFRCxnQkFBQSxZQUFZLDRCQUFHO1FBQ1gsT0FBeUMsR0FBRyxJQUFJLENBQUMsS0FBSztRQUE5QyxJQUFBLE9BQU87UUFBRSxJQUFBLGVBQWU7UUFBRSxJQUFBLEtBQUssYUFBakM7UUFDTkEsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxPQUFPLENBQUMsT0FBTztZQUNYLHFCQUFDLFNBQUksU0FBUyxFQUFDLGdDQUFnQyxFQUFBO2dCQUMzQyxxQkFBQyxhQUFLLEVBQUMsT0FDRSxFQUFBLHFCQUFDLFdBQU0sSUFBSSxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsSUFBSyxDQUFDLGVBQWUsRUFBRSxPQUFPLEVBQUMsT0FBUSxFQUFDLENBQUc7aUJBQzNFO2FBQ047Y0FDSixJQUFJLENBQUMsQ0FBQztLQUNmLENBQUE7O0FBRUwsZ0JBQUEsTUFBTSxzQkFBRztJQUNMLE9BQXlCLEdBQUcsSUFBSSxDQUFDLEtBQUs7SUFBOUIsSUFBQSxLQUFLO0lBQUUsSUFBQSxRQUFRLGdCQUFqQjtJQUNOTSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO0lBQy9CLFFBQVEscUJBQUMsV0FBRztnQkFDQSxxQkFBQ2tDLGdCQUFJLElBQUMsRUFBRSxFQUFDLENBQUMsR0FBRSxHQUFFLFFBQVEsb0JBQWdCLElBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQSxDQUFFLEVBQUM7b0JBQ3BELHFCQUFDLFNBQUksR0FBRyxFQUFDLEtBQU0sQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFDLGVBQWUsRUFBQSxDQUFHO2lCQUNyRDtnQkFDUCxxQkFBQyxTQUFJLFNBQVMsRUFBQyxLQUFLLEVBQUE7b0JBQ2hCLHFCQUFDQSxnQkFBSSxJQUFDLEVBQUUsRUFBQyxDQUFDLEdBQUUsR0FBRSxRQUFRLG9CQUFnQixJQUFFLEtBQUssQ0FBQyxPQUFPLENBQUEsQ0FBRSxFQUFDO3dCQUNwRCxJQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztxQkFDckI7b0JBQ1AsSUFBSyxDQUFDLFlBQVksRUFBRTtpQkFDbEI7YUFDSjtLQUNiLENBQUE7OztFQTFEc0IsS0FBSyxDQUFDLFNBMkRoQyxHQUFBOzs7Ozs7Ozs7Ozs7OztBQzNERHhDLElBQU0sY0FBYyxHQUFHLENBQUMsQ0FBQzs7QUFFekIsSUFBcUIsU0FBUyxHQUF3QjtJQUFDOzs7Ozs7OztJQUFBLG9CQUNuRCxZQUFZLDBCQUFDLE1BQU0sRUFBRTtRQUNqQkEsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM3QkEsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLENBQUM7O1FBRWpETSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEJBLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsS0FBSyxHQUFHLENBQUMsR0FBRyxjQUFjLENBQUM7WUFDM0JOLElBQU0sR0FBRyxHQUFHLEtBQUssR0FBRyxjQUFjLENBQUM7WUFDbkNBLElBQU0sSUFBSSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7WUFDMUIsR0FBRyxJQUFJLEVBQUU7Z0JBQ0xBLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEIsTUFBTTtnQkFDSEEsSUFBTXNELEtBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLElBQUksQ0FBQ0EsS0FBRyxDQUFDLENBQUM7YUFDcEI7U0FDSjs7UUFFRCxPQUFPLE1BQU0sQ0FBQztLQUNqQixDQUFBOztJQUVELG9CQUFBLFVBQVUsd0JBQUMsTUFBTSxFQUFFO1FBQ2YsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQztRQUNuQyxPQUE2RyxHQUFHLElBQUksQ0FBQyxLQUFLO1FBQWxILElBQUEsa0JBQWtCO1FBQUUsSUFBQSxxQkFBcUI7UUFBRSxJQUFBLG9CQUFvQjtRQUFFLElBQUEsT0FBTztRQUFFLElBQUEsZUFBZTtRQUFFLElBQUEsUUFBUSxnQkFBckc7UUFDTnRELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekNBLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFO1lBQzdCQSxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxFQUFFO2dCQUN2QixPQUFPO29CQUNILHFCQUFDLFNBQUksU0FBUyxFQUFDLFVBQVUsRUFBQyxHQUFHLEVBQUMsR0FBSSxDQUFDLE9BQU8sRUFBQzt3QkFDdkMscUJBQUMsS0FBSzs0QkFDRixLQUFLLEVBQUMsR0FBSSxFQUNWLE9BQU8sRUFBQyxPQUFRLEVBQ2hCLGtCQUFrQixFQUFDLGtCQUFtQixFQUN0QyxxQkFBcUIsRUFBQyxxQkFBc0IsRUFDNUMsZUFBZSxFQUFDLGVBQWdCLEVBQ2hDLFFBQVEsRUFBQyxRQUFTLEVBQUMsQ0FDckI7cUJBQ0E7aUJBQ1QsQ0FBQzthQUNMLENBQUMsQ0FBQzs7WUFFSEEsSUFBTSxLQUFLLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQztZQUMxQixPQUFPO2dCQUNILHFCQUFDLFNBQUksU0FBUyxFQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsS0FBTSxFQUFDO29CQUM1QixJQUFLO2lCQUNIO2FBQ1QsQ0FBQztTQUNMLENBQUMsQ0FBQzs7UUFFSCxPQUFPLElBQUksQ0FBQztLQUNmLENBQUE7OztJQUdELG9CQUFBLE1BQU0sc0JBQUc7UUFDTCxPQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLO1FBQXJCLElBQUEsTUFBTSxjQUFSO1FBQ04sT0FBTztRQUNQLHFCQUFDLFNBQUksU0FBUyxFQUFDLEtBQUssRUFBQTtZQUNoQixJQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztTQUN0QixDQUFDLENBQUM7S0FDWCxDQUFBOzs7RUE3RGtDLEtBQUssQ0FBQzs7QUNJN0NBLElBQU1pRCxpQkFBZSxHQUFHLFVBQUMsS0FBSyxFQUFFO0lBQzVCakQsSUFBTSxPQUFPLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7SUFDMUNBLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO0lBQ2hEQSxJQUFNLE9BQU8sR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksU0FBUyxHQUFHLENBQUMsSUFBSSxPQUFPLElBQUksU0FBUyxDQUFDLENBQUM7O0lBRXZFLE9BQU87UUFDSCxNQUFNLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNO1FBQy9CLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO1FBQ25ELFdBQVcsRUFBRSxVQUFDLFFBQVEsRUFBRTtZQUNwQkEsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxFQUFDLFNBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RHQSxJQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1lBQ3hFLE9BQU8sUUFBUSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDdkM7S0FDSjtDQUNKOztBQUVEQSxJQUFNZ0Qsb0JBQWtCLEdBQUcsVUFBQyxRQUFRLEVBQUU7SUFDbEMsT0FBTztRQUNILFdBQVcsRUFBRSxVQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7WUFDOUIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUM3QztRQUNELGtCQUFrQixFQUFFLFVBQUMsRUFBRSxFQUFFOztZQUVyQixRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNwQztRQUNELHFCQUFxQixFQUFFLFVBQUMsRUFBRSxFQUFFOztZQUV4QixRQUFRLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2QztRQUNELFlBQVksRUFBRSxVQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDMUIsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN6QztRQUNELHFCQUFxQixFQUFFLFlBQUc7WUFDdEIsUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztTQUNyQztLQUNKO0NBQ0o7O0FBRUQsSUFBTSxtQkFBbUIsR0FBd0I7SUFBQyw0QkFDbkMsQ0FBQyxLQUFLLEVBQUU7UUFDZlQsVUFBSyxLQUFBLENBQUMsTUFBQSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0RDs7OztvRUFBQTs7SUFFRCw4QkFBQSxpQkFBaUIsaUNBQUc7UUFDaEIsT0FBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07UUFBOUIsSUFBQSxRQUFRLGdCQUFWO1FBQ04sU0FBdUIsR0FBRyxJQUFJLENBQUMsS0FBSztRQUE1QixJQUFBLE1BQU07UUFBRSxJQUFBLEtBQUssZUFBZjs7UUFFTixRQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsR0FBRyxhQUFhLENBQUM7UUFDMUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDdkQsQ0FBQTs7SUFFRCw4QkFBQSxhQUFhLDZCQUFHO1FBQ1osT0FBK0IsR0FBRyxJQUFJLENBQUMsS0FBSztRQUFwQyxJQUFBLHFCQUFxQiw2QkFBdkI7UUFDTixxQkFBcUIsRUFBRSxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0tBQ2YsQ0FBQTs7SUFFRCw4QkFBQSxlQUFlLDZCQUFDLE9BQU8sRUFBRTtRQUNyQixPQUEwQixHQUFHLElBQUksQ0FBQyxLQUFLO1FBQS9CLElBQUEsZ0JBQWdCLHdCQUFsQjtRQUNOdkMsSUFBTSxHQUFHLEdBQUdrRCxlQUFJLENBQUMsZ0JBQWdCLEVBQUUsVUFBQyxFQUFFLEVBQUU7WUFDcEMsT0FBTyxFQUFFLElBQUksT0FBTyxDQUFDO1NBQ3hCLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7S0FDN0IsQ0FBQTs7SUFFRCw4QkFBQSxvQkFBb0Isb0NBQUc7UUFDbkIsT0FBd0MsR0FBRyxJQUFJLENBQUMsS0FBSztRQUE3QyxJQUFBLGdCQUFnQjtRQUFFLElBQUEsWUFBWSxvQkFBaEM7UUFDTixTQUFrQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtRQUE5QixJQUFBLFFBQVEsa0JBQVY7UUFDTixZQUFZLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7S0FDNUMsQ0FBQTs7SUFFRCw4QkFBQSxVQUFVLDBCQUFHO1FBQ1QsT0FBZ0QsR0FBRyxJQUFJLENBQUMsS0FBSztRQUFyRCxJQUFBLE9BQU87UUFBRSxJQUFBLFdBQVc7UUFBRSxJQUFBLGdCQUFnQix3QkFBeEM7UUFDTixTQUFrQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtRQUE5QixJQUFBLFFBQVEsa0JBQVY7UUFDTmxELElBQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O1FBRTlDLE9BQU87WUFDSCxPQUFPO1lBQ1AscUJBQUMsV0FBVztnQkFDUixXQUFXLEVBQUMsV0FBWSxFQUN4QixRQUFRLEVBQUMsUUFBUyxFQUNsQixvQkFBb0IsRUFBQyxJQUFLLENBQUMsb0JBQW9CLEVBQy9DLFNBQVMsRUFBQyxTQUFVLEVBQUMsQ0FDdkI7Y0FDQSxJQUFJLENBQUMsQ0FBQztLQUNmLENBQUE7O0lBRUQsOEJBQUEsTUFBTSxzQkFBRztRQUNMLE9BQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1FBQTlCLElBQUEsUUFBUSxnQkFBVjtRQUNOLFNBQWlGLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBdEYsSUFBQSxNQUFNO1FBQUUsSUFBQSxXQUFXO1FBQUUsSUFBQSxPQUFPO1FBQUUsSUFBQSxrQkFBa0I7UUFBRSxJQUFBLHFCQUFxQiwrQkFBekU7UUFDTkEsSUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztRQUV2QyxPQUFPO1lBQ0gscUJBQUMsU0FBSSxTQUFTLEVBQUMsS0FBSyxFQUFBO2dCQUNoQixxQkFBQyxTQUFJLFNBQVMsRUFBQywwQkFBMEIsRUFBQTtvQkFDckMscUJBQUMsVUFBRSxFQUFDLHFCQUFDLFVBQUssU0FBUyxFQUFDLGlCQUFpQixFQUFBLEVBQUMsUUFBUyxFQUFDLElBQUUsQ0FBTyxFQUFBLEdBQUMsRUFBQSxxQkFBQyxhQUFLLEVBQUMsaUJBQWUsRUFBUSxFQUFLO29CQUM3RixxQkFBQyxVQUFFLEVBQUc7b0JBQ04scUJBQUMsU0FBUzt3QkFDTixNQUFNLEVBQUMsTUFBTyxFQUNkLE9BQU8sRUFBQyxPQUFRLEVBQ2hCLGtCQUFrQixFQUFDLGtCQUFtQixFQUN0QyxxQkFBcUIsRUFBQyxxQkFBc0IsRUFDNUMsZUFBZSxFQUFDLElBQUssQ0FBQyxlQUFlLEVBQ3JDLFFBQVEsRUFBQyxRQUFTLEVBQUMsQ0FDckI7b0JBQ0YsSUFBSyxDQUFDLFVBQVUsRUFBRTtpQkFDaEI7Z0JBQ04sSUFBSyxDQUFDLEtBQUssQ0FBQyxRQUFRO2FBQ2xCO1NBQ1QsQ0FBQztLQUNMLENBQUE7OztFQTNFNkIsS0FBSyxDQUFDLFNBNEV2QyxHQUFBOztBQUVEQSxJQUFNLGVBQWUsR0FBRzhDLGtCQUFPLENBQUNHLGlCQUFlLEVBQUVELG9CQUFrQixDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUMxRmhELElBQU0sVUFBVSxHQUFHdUQsc0JBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxBQUMvQzs7QUN6SE92RCxJQUFNLGVBQWUsR0FBRyxVQUFDLElBQUksRUFBRTtJQUNsQyxPQUFPO1FBQ0gsSUFBSSxFQUFFdUIsaUJBQW1CO1FBQ3pCLElBQUksRUFBRSxJQUFJO0tBQ2IsQ0FBQztDQUNMOztBQUVELEFBTUEsQUFNQSxBQUFPdkIsSUFBTSxlQUFlLEdBQUcsVUFBQyxJQUFJLEVBQUU7SUFDbEMsT0FBTztRQUNILElBQUksRUFBRXdCLGlCQUFtQjtRQUN6QixJQUFJLEVBQUUsSUFBSTtLQUNiLENBQUM7Q0FDTDs7QUFFRCxBQUFPLFNBQVMsY0FBYyxDQUFDLElBQUksRUFBRTtJQUNqQyxPQUFPO1FBQ0gsSUFBSSxFQUFFQyxnQkFBa0I7UUFDeEIsSUFBSSxFQUFFLElBQUk7S0FDYixDQUFDO0NBQ0w7O0FBRUQsQUFBTyxTQUFTK0IsZUFBYSxDQUFDLFVBQVUsRUFBRTtJQUN0QyxPQUFPO1FBQ0gsSUFBSSxFQUFFOUIsZUFBaUI7UUFDdkIsVUFBVSxFQUFFLFVBQVU7S0FDekIsQ0FBQztDQUNMOztBQUVELEFBTUEsQUFBTyxTQUFTLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtJQUN2QyxPQUFPO1FBQ0gsSUFBSSxFQUFFSixpQkFBbUI7UUFDekIsUUFBUSxFQUFFLFFBQVE7S0FDckIsQ0FBQztDQUNMOztBQUVELEFBQU8sU0FBUyxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7SUFDL0MsT0FBTyxTQUFTLFFBQVEsRUFBRTtRQUN0QnRCLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsR0FBRyxPQUFPLEdBQUcsUUFBUSxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQzlGQSxJQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCxPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO2FBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDYixJQUFJLENBQUMsVUFBQSxJQUFJLEVBQUM7O2dCQUVQQSxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDOzs7Z0JBR3ZDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDaEMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxRQUFRLENBQUN3RCxlQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7OztnQkFHekN4RCxJQUFNLFNBQVMsR0FBRyxVQUFDLENBQUMsRUFBRTtvQkFDbEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPO3dCQUNULFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7aUJBQ25DO2dCQUNELGFBQWEsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7OztnQkFHdkNBLElBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDcEQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDeEMsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNwQjtDQUNKOztBQUVELEFBQU9BLElBQU0sV0FBVyxHQUFHLFVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUU7SUFDeEQsT0FBTyxVQUFVLFFBQVEsRUFBRSxRQUFRLEVBQUU7UUFDakMsT0FBb0IsR0FBRyxRQUFRLEVBQUUsQ0FBQyxZQUFZO1FBQXRDLElBQUEsSUFBSTtRQUFFLElBQUEsSUFBSSxZQUFaO1FBQ05BLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDOztRQUVsQ0EsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUM5QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25EQSxJQUFNLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3ZCLElBQUksRUFBRSxJQUFJO1lBQ1YsT0FBTyxFQUFFLE9BQU87WUFDaEIsUUFBUSxFQUFFLGVBQWU7U0FDNUIsQ0FBQyxDQUFDOztRQUVIQSxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUU7WUFDbkMsTUFBTSxFQUFFLE1BQU07WUFDZCxJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQzs7UUFFSCxPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO2FBQ2pCLElBQUksQ0FBQyxZQUFHO2dCQUNMLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNoRCxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3BCO0NBQ0o7O0FBRUQsQUFBT0EsSUFBTSxXQUFXLEdBQUcsVUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtJQUNsRCxPQUFPLFNBQVMsUUFBUSxFQUFFLFFBQVEsRUFBRTtRQUNoQyxPQUFvQixHQUFHLFFBQVEsRUFBRSxDQUFDLFlBQVk7UUFBdEMsSUFBQSxJQUFJO1FBQUUsSUFBQSxJQUFJLFlBQVo7UUFDTkEsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxHQUFHLE9BQU8sQ0FBQzs7UUFFMURBLElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDOUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNuREEsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO1lBQ25DLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRCxPQUFPLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUM7O1FBRUgsT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzthQUNqQixJQUFJLENBQUMsWUFBRztnQkFDTCxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNoRCxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3BCO0NBQ0o7O0FBRUQsQUFBT0EsSUFBTSxhQUFhLEdBQUcsVUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO0lBQzlDLE9BQU8sU0FBUyxRQUFRLEVBQUUsUUFBUSxFQUFFO1FBQ2hDLE9BQW9CLEdBQUcsUUFBUSxFQUFFLENBQUMsWUFBWTtRQUF0QyxJQUFBLElBQUk7UUFBRSxJQUFBLElBQUksWUFBWjtRQUNOQSxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLEdBQUcsU0FBUyxDQUFDO1FBQzlEQSxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUU7WUFDbkMsTUFBTSxFQUFFLFFBQVE7U0FDbkIsQ0FBQyxDQUFDOztRQUVILE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7YUFDakIsSUFBSSxDQUFDLFlBQUc7Z0JBQ0wsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQzVDLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDcEI7Q0FDSjs7QUFFRCxBQUFPQSxJQUFNLHFCQUFxQixHQUFHLFVBQUMsT0FBTyxFQUFFO0lBQzNDLE9BQU87UUFDSCxJQUFJLEVBQUVlLGtCQUFvQjtRQUMxQixPQUFPLEVBQUUsT0FBTztLQUNuQjtDQUNKOztBQUVELEFBQU9mLElBQU0scUJBQXFCLEdBQUcsVUFBQyxPQUFPLEVBQUU7SUFDM0MsT0FBTztRQUNILElBQUksRUFBRWdCLGtCQUFvQjtRQUMxQixPQUFPLEVBQUUsT0FBTztLQUNuQjtDQUNKOztBQ25LTSxJQUFNLGNBQWMsR0FBd0I7SUFBQzs7Ozs7Ozs7SUFBQSx5QkFDaEQsTUFBTSxzQkFBRztRQUNMLE9BQThDLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBbkQsSUFBQSxPQUFPO1FBQUUsSUFBQSxRQUFRO1FBQUUsSUFBQSxpQkFBaUIseUJBQXRDO1FBQ05oQixJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEQsT0FBTztZQUNILHFCQUFDLFNBQUksU0FBUyxFQUFDLDJCQUEyQixFQUFBO2dCQUN0QyxxQkFBQyxTQUFJLFNBQVMsRUFBQyxZQUFZLEVBQUMsS0FBSyxFQUFDLENBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFDLENBQU87Z0JBQzdELHFCQUFDLFNBQUksU0FBUyxFQUFDLFlBQVksRUFBQTtvQkFDdkIscUJBQUMsYUFBSyxFQUFDLFNBQU8sRUFBUTtvQkFDdEIsVUFBVztpQkFDVDthQUNKO1NBQ1QsQ0FBQztLQUNMLENBQUE7OztFQWIrQixLQUFLLENBQUM7O0FDQTFDQSxJQUFNLEdBQUcsR0FBRyxVQUFDLFNBQVMsRUFBRTtJQUNwQixPQUFPO1FBQ0gsT0FBTyxFQUFFLFNBQVMsR0FBRyxRQUFRO1FBQzdCLE1BQU0sRUFBRSxTQUFTLEdBQUcsT0FBTztRQUMzQixRQUFRLEVBQUUsU0FBUyxHQUFHLFNBQVM7UUFDL0IsWUFBWSxFQUFFLFNBQVMsR0FBRyxlQUFlO1FBQ3pDLGFBQWEsRUFBRSxTQUFTLEdBQUcsZ0JBQWdCO0tBQzlDLENBQUM7Q0FDTDs7QUFFRCxBQUFPLElBQU0sZUFBZSxHQUF3QjtJQUFDLHdCQUN0QyxDQUFDLEtBQUssRUFBRTtRQUNmdUMsVUFBSyxLQUFBLENBQUMsTUFBQSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsS0FBSyxFQUFFLEVBQUU7U0FDWixDQUFDOztRQUVGLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5RDs7Ozs0REFBQTs7SUFFRCwwQkFBQSxJQUFJLG9CQUFHO1FBQ0gsT0FBK0IsR0FBRyxJQUFJLENBQUMsS0FBSztRQUFwQyxJQUFBLFVBQVU7UUFBRSxJQUFBLFNBQVMsaUJBQXZCO1FBQ04sU0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLO1FBQW5CLElBQUEsSUFBSSxjQUFOO1FBQ04sU0FBc0IsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQS9CLElBQUEsWUFBWSxzQkFBZDs7UUFFTixVQUFVLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzFDLENBQUE7O0lBRUQsMEJBQUEsS0FBSyxxQkFBRztRQUNKLE9BQWdDLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBckMsSUFBQSxXQUFXO1FBQUUsSUFBQSxTQUFTLGlCQUF4QjtRQUNOLFNBQWUsR0FBRyxJQUFJLENBQUMsS0FBSztRQUFwQixJQUFBLEtBQUssZUFBUDtRQUNOLFNBQXVCLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUFoQyxJQUFBLGFBQWEsdUJBQWY7O1FBRU4sV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDaEMsQ0FBQTs7SUFFRCwwQkFBQSxXQUFXLHlCQUFDLElBQUksRUFBRTtRQUNkLE9BQW1CLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBeEIsSUFBQSxTQUFTLGlCQUFYO1FBQ052QyxJQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDekMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMxQixDQUFBOztJQUVELDBCQUFBLGdCQUFnQiw4QkFBQyxDQUFDLEVBQUU7UUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDM0MsQ0FBQTs7SUFFRCwwQkFBQSxpQkFBaUIsK0JBQUMsQ0FBQyxFQUFFO1FBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUMzQyxDQUFBOztJQUVELDBCQUFBLE1BQU0sc0JBQUc7OztRQUNMLE9BQWdELEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBckQsSUFBQSxJQUFJO1FBQUUsSUFBQSxTQUFTO1FBQUUsSUFBQSxPQUFPO1FBQUUsSUFBQSxZQUFZLG9CQUF4QztRQUNOLFNBQWdFLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUF6RSxJQUFBLFlBQVk7UUFBRSxJQUFBLGFBQWE7UUFBRSxJQUFBLE9BQU87UUFBRSxJQUFBLE1BQU07UUFBRSxJQUFBLFFBQVEsa0JBQXhEO1FBQ05BLElBQU0sVUFBVSxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUM7UUFDdENBLElBQU0sV0FBVyxHQUFHLEdBQUcsR0FBRyxhQUFhLENBQUM7O1FBRXhDLE9BQU87WUFDSCxPQUFPO1lBQ1AscUJBQUMsU0FBSSxTQUFTLEVBQUMsS0FBSyxFQUFBO2dCQUNoQixxQkFBQyxTQUFJLFNBQVMsRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLENBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLEVBQUM7b0JBQ3BFLHFCQUFDLFNBQUksU0FBUyxFQUFDLFVBQVUsRUFBQTt3QkFDckIscUJBQUMsT0FBRSxPQUFPLEVBQUMsWUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFDLEVBQUcsY0FBYyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUM7NEJBQ2pHLHFCQUFDO2tDQUNLLFlBQVksRUFBQyxJQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQ25ELEVBQUUsRUFBQyxRQUFTLEVBQ1osYUFBVyxFQUFDLFNBQVMsRUFDckIsS0FBSyxFQUFDLE1BQU0sRUFDWixTQUFTLEVBQUMsb0JBQW9CLEVBQUE7Z0NBQ2hDLHFCQUFDLFVBQUssU0FBUyxFQUFDLDJCQUEyQixFQUFBLENBQVE7NkJBQ2hELEVBQUEsUUFBUzt5QkFDaEI7d0JBQ0oscUJBQUMsT0FBRSxhQUFXLEVBQUMsVUFBVSxFQUFDLGFBQVcsRUFBQyxVQUFXLEVBQUUsS0FBSyxFQUFDLEVBQUcsY0FBYyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUM7NEJBQ3BHLHFCQUFDO2tDQUNLLFlBQVksRUFBQyxJQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQ2pELEVBQUUsRUFBQyxNQUFPLEVBQ1YsYUFBVyxFQUFDLFNBQVMsRUFDckIsS0FBSyxFQUFDLE9BQU8sRUFDYixTQUFTLEVBQUMscUJBQXFCLEVBQUE7Z0NBQ2pDLHFCQUFDLFVBQUssU0FBUyxFQUFDLDRCQUE0QixFQUFBLENBQVE7NkJBQ2pELEVBQUEsUUFBUzt5QkFDaEI7d0JBQ0oscUJBQUMsT0FBRSxhQUFXLEVBQUMsVUFBVSxFQUFDLGFBQVcsRUFBQyxXQUFZLEVBQUUsS0FBSyxFQUFDLEVBQUcsY0FBYyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUM7NEJBQ3JHLHFCQUFDO2tDQUNLLFlBQVksRUFBQyxJQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQ2xELEVBQUUsRUFBQyxPQUFRLEVBQ1gsYUFBVyxFQUFDLFNBQVMsRUFDckIsS0FBSyxFQUFDLE1BQU0sRUFDWixTQUFTLEVBQUMscUJBQXFCLEVBQUE7Z0NBQ2pDLHFCQUFDLFVBQUssU0FBUyxFQUFDLDhCQUE4QixFQUFBLENBQVE7NkJBQ25EO3lCQUNQO3FCQUNGO2lCQUNKO2dCQUNOLHFCQUFDLFNBQUksU0FBUyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsQ0FBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLEVBQUM7b0JBQy9DLHFCQUFDLFNBQUksU0FBUyxFQUFDLG9DQUFvQyxFQUFDLEVBQUUsRUFBQyxZQUFhLEVBQUM7d0JBQ2pFLHFCQUFDLGNBQVMsU0FBUyxFQUFDLGNBQWMsRUFBQyxLQUFLLEVBQUMsSUFBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLElBQUssQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUMsR0FBRyxFQUFBLENBQUc7d0JBQ3ZHLHFCQUFDLFVBQUUsRUFBRzt3QkFDTixxQkFBQyxZQUFPLElBQUksRUFBQyxRQUFRLEVBQUMsYUFBVyxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsWUFBSSxTQUFHeUQsTUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFBLEVBQUUsYUFBVyxFQUFDLFVBQVcsRUFBRSxTQUFTLEVBQUMsaUJBQWlCLEVBQUEsRUFBQyxLQUFHLENBQVM7d0JBQzFKLHFCQUFDLFlBQU8sSUFBSSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsY0FBYyxFQUFDLE9BQU8sRUFBQyxJQUFLLENBQUMsSUFBSSxFQUFDLEVBQUMsZUFBYSxDQUFTO3FCQUN2RjtpQkFDSjtnQkFDTixxQkFBQyxTQUFJLFNBQVMsRUFBQyxLQUFLLEVBQUE7b0JBQ2hCLHFCQUFDLFNBQUksU0FBUyxFQUFDLG9DQUFvQyxFQUFDLEVBQUUsRUFBQyxhQUFjLEVBQUM7d0JBQ2xFLHFCQUFDLGNBQVMsU0FBUyxFQUFDLGNBQWMsRUFBQyxLQUFLLEVBQUMsSUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLElBQUssQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUMsR0FBRyxFQUFBLENBQUc7d0JBQ3pHLHFCQUFDLFVBQUUsRUFBRzt3QkFDTixxQkFBQyxZQUFPLElBQUksRUFBQyxRQUFRLEVBQUMsYUFBVyxFQUFDLFVBQVUsRUFBQyxhQUFXLEVBQUMsV0FBWSxFQUFFLFNBQVMsRUFBQyxpQkFBaUIsRUFBQSxFQUFDLEtBQUcsQ0FBUzt3QkFDL0cscUJBQUMsWUFBTyxJQUFJLEVBQUMsUUFBUSxFQUFDLFNBQVMsRUFBQyxjQUFjLEVBQUMsT0FBTyxFQUFDLElBQUssQ0FBQyxLQUFLLEVBQUMsRUFBQyxNQUFJLENBQVM7cUJBQy9FO2lCQUNKO2FBQ0o7WUFDTixxQkFBQyxTQUFJLFNBQVMsRUFBQyxLQUFLLEVBQUE7Z0JBQ2hCLHFCQUFDLFNBQUksU0FBUyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsQ0FBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsRUFBQztvQkFDcEUscUJBQUMsU0FBSSxTQUFTLEVBQUMsVUFBVSxFQUFBO3dCQUNyQixxQkFBQyxPQUFFLGFBQVcsRUFBQyxVQUFVLEVBQUMsYUFBVyxFQUFDLFdBQVksRUFBQzs0QkFDL0MscUJBQUM7a0NBQ0ssWUFBWSxFQUFDLElBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFDbEQsRUFBRSxFQUFDLE9BQVEsRUFDWCxhQUFXLEVBQUMsU0FBUyxFQUNyQixLQUFLLEVBQUMsTUFBTSxFQUNaLFNBQVMsRUFBQyxxQkFBcUIsRUFBQTtnQ0FDakMscUJBQUMsVUFBSyxTQUFTLEVBQUMsOEJBQThCLEVBQUEsQ0FBUTs2QkFDbkQ7eUJBQ1A7cUJBQ0Y7aUJBQ0o7Z0JBQ04scUJBQUMsU0FBSSxTQUFTLEVBQUMsS0FBSyxFQUFBO29CQUNoQixxQkFBQyxTQUFJLFNBQVMsRUFBQyxvQ0FBb0MsRUFBQyxFQUFFLEVBQUMsYUFBYyxFQUFDO3dCQUNsRSxxQkFBQyxjQUFTLFNBQVMsRUFBQyxjQUFjLEVBQUMsS0FBSyxFQUFDLElBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxJQUFLLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFDLEdBQUcsRUFBQSxDQUFHO3dCQUN6RyxxQkFBQyxVQUFFLEVBQUc7d0JBQ04scUJBQUMsWUFBTyxJQUFJLEVBQUMsUUFBUSxFQUFDLGFBQVcsRUFBQyxVQUFVLEVBQUMsYUFBVyxFQUFDLFdBQVksRUFBRSxTQUFTLEVBQUMsaUJBQWlCLEVBQUEsRUFBQyxLQUFHLENBQVM7d0JBQy9HLHFCQUFDLFlBQU8sSUFBSSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsY0FBYyxFQUFDLE9BQU8sRUFBQyxJQUFLLENBQUMsS0FBSyxFQUFDLEVBQUMsTUFBSSxDQUFTO3FCQUMvRTtpQkFDSjthQUNKO1NBQ1QsQ0FBQztLQUNMLENBQUE7OztFQXBJZ0MsS0FBSyxDQUFDLFNBcUkxQyxHQUFBOztBQzVJTSxJQUFNLE9BQU8sR0FBd0I7SUFBQzs7Ozs7Ozs7SUFBQSxrQkFDekMsTUFBTSxzQkFBRztRQUNMLE9BQW1GLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBeEYsSUFBQSxTQUFTO1FBQUUsSUFBQSxRQUFRO1FBQUUsSUFBQSxRQUFRO1FBQUUsSUFBQSxJQUFJO1FBQUUsSUFBQSxPQUFPO1FBQUUsSUFBQSxRQUFRO1FBQUUsSUFBQSxpQkFBaUIseUJBQTNFO1FBQ04sSUFBUSxXQUFXO1FBQUUsSUFBQSxVQUFVO1FBQUUsSUFBQSxZQUFZO1FBQUUsSUFBQSxPQUFPO1FBQUUsSUFBQSxPQUFPLG9CQUF6RDtRQUNOekQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDQSxJQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzFEQSxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckNBLElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4REEsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztRQUU3QixPQUFPO1lBQ0gscUJBQUMsU0FBSSxTQUFTLEVBQUMsMkJBQTJCLEVBQUE7b0JBQ2xDLHFCQUFDLGNBQWMsTUFBQSxFQUFHO29CQUNsQixxQkFBQyxTQUFJLFNBQVMsRUFBQyxZQUFZLEVBQUE7d0JBQ3ZCLHFCQUFDLFFBQUcsU0FBUyxFQUFDLGVBQWUsRUFBQSxFQUFDLHFCQUFDLGNBQU0sRUFBQyxRQUFTLEVBQVUsRUFBQSxHQUFDLEVBQUEscUJBQUMsUUFBUSxJQUFDLFFBQVEsRUFBQyxRQUFTLEVBQUMsQ0FBRyxDQUFLO3dCQUMvRixxQkFBQyxVQUFLLHVCQUF1QixFQUFDLEdBQUksRUFBQyxDQUFRO3dCQUMzQyxxQkFBQyxlQUFlO2tDQUNOLE9BQU8sRUFBQyxVQUFXLEVBQ25CLFNBQVMsRUFBQyxTQUFVLEVBQ3BCLFlBQVksRUFBQyxZQUFhLEVBQzFCLFVBQVUsRUFBQyxVQUFXLEVBQ3RCLFdBQVcsRUFBQyxXQUFZLEVBQ3hCLElBQUksRUFBQyxJQUFLLEVBQUMsQ0FDbkI7d0JBQ0YsVUFBVztxQkFDVDthQUNSLENBQUMsQ0FBQztLQUNmLENBQUE7OztFQTNCd0IsS0FBSyxDQUFDLFNBNEJsQyxHQUFBOztBQUVELElBQU0sUUFBUSxHQUF3QjtJQUFDOzs7Ozs7OztJQUFBLG1CQUNuQyxHQUFHLG1CQUFHO1FBQ0YsT0FBa0IsR0FBRyxJQUFJLENBQUMsS0FBSztRQUF2QixJQUFBLFFBQVEsZ0JBQVY7UUFDTixPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM3QixDQUFBOztJQUVELG1CQUFBLE1BQU0sc0JBQUc7UUFDTCxPQUFPLENBQUMscUJBQUMsYUFBSyxFQUFDLFFBQU0sRUFBQSxJQUFLLENBQUMsR0FBRyxFQUFFLEVBQVMsQ0FBQyxDQUFDO0tBQzlDLENBQUE7OztFQVJrQixLQUFLLENBQUMsU0FTNUIsR0FBQTs7QUN4Q0RBLElBQU0sZUFBZSxHQUFHLFVBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtJQUM5RSxPQUFPO1FBQ0gsYUFBQSxXQUFXO1FBQ1gsWUFBQSxVQUFVO1FBQ1YsY0FBQSxZQUFZO1FBQ1osU0FBQSxPQUFPO1FBQ1AsU0FBQSxPQUFPO0tBQ1Y7Q0FDSjs7QUFFRCxBQUFPLElBQU0sV0FBVyxHQUF3QjtJQUFDOzs7Ozs7OztJQUFBLHNCQUM3QyxpQkFBaUIsK0JBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRTtRQUNsQyxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLE9BQU87O1FBRTlDLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU8sRUFBRTtZQUMxQkEsSUFBTSxHQUFHLEdBQUcsV0FBVyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7O1lBRTVDLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDakIsT0FBTztvQkFDSCxxQkFBQyxTQUFJLFNBQVMsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLEdBQUksRUFBQzt3QkFDNUIscUJBQUMsY0FBYzs2QkFDVixHQUFHLEVBQUMsR0FBSSxFQUNSLE9BQU8sRUFBQyxPQUFRLENBQUMsT0FBTyxFQUN4QixRQUFRLEVBQUMsUUFBUyxFQUNsQixpQkFBaUIsRUFBQyxpQkFBa0IsRUFBQyxDQUN2QztxQkFDRCxDQUFDLENBQUM7YUFDZjs7WUFFRCxPQUFPO2dCQUNILHFCQUFDLFNBQUksU0FBUyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsR0FBSSxFQUFDO29CQUM1QixxQkFBQyxPQUFPOzZCQUNDLEdBQUcsRUFBQyxHQUFJLEVBQ1IsUUFBUSxFQUFDLE9BQVEsQ0FBQyxRQUFRLEVBQzFCLFFBQVEsRUFBQyxPQUFRLENBQUMsUUFBUSxFQUMxQixJQUFJLEVBQUMsT0FBUSxDQUFDLElBQUksRUFDbEIsT0FBTyxFQUFDLE9BQVEsQ0FBQyxPQUFPLEVBQ3hCLFNBQVMsRUFBQyxPQUFRLENBQUMsU0FBUyxFQUM1QixRQUFRLEVBQUMsUUFBUyxFQUNsQixpQkFBaUIsRUFBQyxpQkFBa0IsRUFBQyxDQUMzQztpQkFDRDthQUNULENBQUM7U0FDTCxDQUFDLENBQUM7S0FDTixDQUFBOztJQUVELHNCQUFBLE1BQU0sc0JBQUc7UUFDTCxPQUFtRixHQUFHLElBQUksQ0FBQyxLQUFLO1FBQXhGLElBQUEsUUFBUTtRQUFFLElBQUEsV0FBVztRQUFFLElBQUEsVUFBVTtRQUFFLElBQUEsWUFBWTtRQUFFLElBQUEsT0FBTztRQUFFLElBQUEsT0FBTztRQUFFLElBQUEsTUFBTSxjQUEzRTtRQUNOQSxJQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFGQSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELE9BQU87WUFDSCxxQkFBQyxXQUFHO2dCQUNBLEtBQU07YUFDSjtTQUNULENBQUM7S0FDTCxDQUFBOzs7RUE3QzRCLEtBQUssQ0FBQzs7QUNaaEMsSUFBTSxVQUFVLEdBQXdCO0lBQUM7Ozs7Ozs7O0lBQUEscUJBQzVDLFFBQVEsd0JBQUc7UUFDUCxPQUEyQixHQUFHLElBQUksQ0FBQyxLQUFLO1FBQWhDLElBQUEsV0FBVztRQUFFLElBQUEsSUFBSSxZQUFuQjtRQUNOQSxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksT0FBTztZQUNQLE9BQU87Z0JBQ0gscUJBQUMsVUFBRTtrQkFDRCxxQkFBQyxPQUFFLElBQUksRUFBQyxHQUFHLEVBQUMsWUFBVSxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsSUFBSyxFQUFDO29CQUM5QyxxQkFBQyxVQUFLLGFBQVcsRUFBQyxNQUFNLEVBQUEsRUFBQyxHQUFPLENBQU87bUJBQ3JDO2lCQUNELENBQUMsQ0FBQzs7WUFFWCxPQUFPO2dCQUNILHFCQUFDLFFBQUcsU0FBUyxFQUFDLFVBQVUsRUFBQTtvQkFDcEIscUJBQUMsVUFBSyxhQUFXLEVBQUMsTUFBTSxFQUFBLEVBQUMsR0FBTyxDQUFPO2lCQUN0QyxDQUFDLENBQUM7S0FDbEIsQ0FBQTs7SUFFRCxxQkFBQSxRQUFRLHdCQUFHO1FBQ1AsT0FBdUMsR0FBRyxJQUFJLENBQUMsS0FBSztRQUE1QyxJQUFBLFVBQVU7UUFBRSxJQUFBLFdBQVc7UUFBRSxJQUFBLElBQUksWUFBL0I7UUFDTkEsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFVBQVUsS0FBSyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLEdBQUcsT0FBTztZQUNOLE9BQU87Z0JBQ0gscUJBQUMsVUFBRTtrQkFDRCxxQkFBQyxPQUFFLElBQUksRUFBQyxHQUFHLEVBQUMsWUFBVSxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsSUFBSyxFQUFDO29CQUMxQyxxQkFBQyxVQUFLLGFBQVcsRUFBQyxNQUFNLEVBQUEsRUFBQyxHQUFPLENBQU87bUJBQ3JDO2lCQUNELENBQUMsQ0FBQzs7WUFFWCxPQUFPO2dCQUNILHFCQUFDLFFBQUcsU0FBUyxFQUFDLFVBQVUsRUFBQTtvQkFDcEIscUJBQUMsVUFBSyxhQUFXLEVBQUMsTUFBTSxFQUFBLEVBQUMsR0FBTyxDQUFPO2lCQUN0QyxDQUFDLENBQUM7S0FDbEIsQ0FBQTs7SUFFRCxxQkFBQSxNQUFNLHNCQUFHO1FBQ0wsT0FBbUQsR0FBRyxJQUFJLENBQUMsS0FBSztRQUF4RCxJQUFBLFVBQVU7UUFBRSxJQUFBLE9BQU87UUFBRSxJQUFBLFdBQVc7UUFBRSxJQUFBLE9BQU8sZUFBM0M7UUFDTk0sSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQ04sSUFBTSxHQUFHLEdBQUcsWUFBWSxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxLQUFLLFdBQVcsRUFBRTtnQkFDbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxxQkFBQyxRQUFHLFNBQVMsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEdBQUksRUFBQyxFQUFDLHFCQUFDLE9BQUUsSUFBSSxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBSSxFQUFFLEVBQUMsQ0FBRSxDQUFLLENBQUssQ0FBQyxDQUFDO2FBQ3BGLE1BQU07Z0JBQ0gsS0FBSyxDQUFDLElBQUksQ0FBQyxxQkFBQyxRQUFHLEdBQUcsRUFBQyxHQUFJLEVBQUcsT0FBTyxFQUFDLE9BQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFDLEVBQUMscUJBQUMsT0FBRSxJQUFJLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFJLEVBQUUsRUFBQyxDQUFFLENBQUssQ0FBSyxDQUFDLENBQUM7YUFDbEc7U0FDSjs7UUFFREEsSUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOztRQUVoQyxNQUFNO1lBQ0YsSUFBSTtZQUNKLHFCQUFDLFdBQUc7Z0JBQ0EscUJBQUMsU0FBSSxTQUFTLEVBQUMsMEJBQTBCLEVBQUE7b0JBQ3JDLHFCQUFDLFdBQUc7c0JBQ0YscUJBQUMsUUFBRyxTQUFTLEVBQUMsWUFBWSxFQUFBOzBCQUN0QixJQUFLLENBQUMsUUFBUSxFQUFFOzBCQUNoQixLQUFNOzBCQUNOLElBQUssQ0FBQyxRQUFRLEVBQUU7dUJBQ2Y7cUJBQ0Q7aUJBQ0o7YUFDSjtjQUNKLElBQUksQ0FBQyxDQUFDO0tBQ2YsQ0FBQTs7O0VBL0QyQixLQUFLLENBQUM7O0FDQS9CLElBQU0sV0FBVyxHQUF3QjtJQUFDLG9CQUNsQyxDQUFDLEtBQUssRUFBRTtRQUNmdUMsVUFBSyxLQUFBLENBQUMsTUFBQSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxJQUFJLEVBQUUsRUFBRTtTQUNYLENBQUM7O1FBRUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM1RDs7OztvREFBQTs7SUFFRCxzQkFBQSxXQUFXLHlCQUFDLENBQUMsRUFBRTtRQUNYLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7UUFFbkIsT0FBb0IsR0FBRyxJQUFJLENBQUMsS0FBSztRQUF6QixJQUFBLFVBQVUsa0JBQVo7UUFDTixVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDL0IsQ0FBQTs7SUFFRCxzQkFBQSxnQkFBZ0IsOEJBQUMsQ0FBQyxFQUFFO1FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUMxQyxDQUFBOztJQUVELHNCQUFBLE1BQU0sc0JBQUc7UUFDTCxPQUFPO1lBQ0gscUJBQUMsVUFBSyxRQUFRLEVBQUMsSUFBSyxDQUFDLFdBQVcsRUFBQztnQkFDN0IscUJBQUMsV0FBTSxPQUFPLEVBQUMsUUFBUSxFQUFBLEVBQUMsV0FBUyxDQUFRO2dCQUN6QyxxQkFBQyxjQUFTLFNBQVMsRUFBQyxjQUFjLEVBQUMsUUFBUSxFQUFDLElBQUssQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUMsSUFBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFDLHdCQUF3QixFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQSxDQUFZO2dCQUNqSyxxQkFBQyxVQUFFLEVBQUc7Z0JBQ04scUJBQUMsWUFBTyxJQUFJLEVBQUMsUUFBUSxFQUFDLFNBQVMsRUFBQyxpQkFBaUIsRUFBQSxFQUFDLE1BQUksQ0FBUzthQUM1RDtTQUNWLENBQUM7S0FDTCxDQUFBOzs7RUFoQzRCLEtBQUssQ0FBQzs7QUNNdkN2QyxJQUFNaUQsaUJBQWUsR0FBRyxVQUFDLEtBQUssRUFBRTtJQUM1QixPQUFPO1FBQ0gsT0FBTyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsZUFBZTtRQUN6QyxJQUFJLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJO1FBQzdCLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUk7UUFDN0IsSUFBSSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSTtRQUM3QixVQUFVLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVO1FBQ3pDLFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVE7UUFDckMsT0FBTyxFQUFFLFVBQUMsRUFBRSxFQUFFLFNBQUdDLGVBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFDLENBQUMsRUFBRSxTQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFBLENBQUMsR0FBQTtRQUMvRCxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUUsU0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsSUFBSSxNQUFNLEdBQUE7UUFDNUQsTUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYTtLQUN4QztDQUNKOztBQUVEbEQsSUFBTWdELG9CQUFrQixHQUFHLFVBQUMsUUFBUSxFQUFFO0lBQ2xDLE9BQU87UUFDSCxZQUFZLEVBQUUsVUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtZQUNoQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNoRDtRQUNELFNBQVMsRUFBRSxVQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO1lBQ2hDLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsV0FBVyxFQUFFLFVBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtZQUN6QixRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUM5QztRQUNELFdBQVcsRUFBRSxVQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFO1lBQ3BDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsYUFBYSxFQUFFLFVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRTtZQUNoQyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQy9DO0tBQ0o7Q0FDSjs7QUFFRCxJQUFNLGlCQUFpQixHQUF3QjtJQUFDLDBCQUNqQyxDQUFDLEtBQUssRUFBRTtRQUNmVCxVQUFLLEtBQUEsQ0FBQyxNQUFBLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEQ7Ozs7Z0VBQUE7O0lBRUQsNEJBQUEsUUFBUSx3QkFBRztRQUNQLE9BQTJDLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBaEQsSUFBQSxZQUFZO1FBQUUsSUFBQSxPQUFPO1FBQUUsSUFBQSxJQUFJO1FBQUUsSUFBQSxJQUFJLFlBQW5DO1FBQ052QyxJQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzdCLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3pDLENBQUE7O0lBRUQsNEJBQUEsT0FBTyxxQkFBQyxJQUFJLEVBQUU7UUFDVixPQUFxQyxHQUFHLElBQUksQ0FBQyxLQUFLO1FBQTFDLElBQUEsWUFBWTtRQUFFLElBQUEsT0FBTztRQUFFLElBQUEsSUFBSSxZQUE3QjtRQUNOQSxJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQzNCQSxJQUFNLFNBQVMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNyQyxZQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMxQyxDQUFBOztJQUVELDRCQUFBLFlBQVksNEJBQUc7UUFDWCxPQUEwQyxHQUFHLElBQUksQ0FBQyxLQUFLO1FBQS9DLElBQUEsWUFBWTtRQUFFLElBQUEsT0FBTztRQUFFLElBQUEsSUFBSTtRQUFFLElBQUEsSUFBSSxZQUFuQztRQUNOQSxJQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzdCLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3pDLENBQUE7O0lBRUQsNEJBQUEsaUJBQWlCLGlDQUFHO1FBQ2hCLE9BQTJDLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBaEQsSUFBQSxZQUFZO1FBQUUsSUFBQSxPQUFPO1FBQUUsSUFBQSxJQUFJO1FBQUUsSUFBQSxJQUFJLFlBQW5DO1FBQ04sWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDckMsQ0FBQTs7SUFFRCw0QkFBQSxNQUFNLHNCQUFHO1FBQ0wsT0FFMkMsR0FBRyxJQUFJLENBQUMsS0FBSztRQUZoRCxJQUFBLFFBQVE7UUFBRSxJQUFBLFNBQVM7UUFBRSxJQUFBLFdBQVc7UUFBRSxJQUFBLFdBQVc7UUFDN0MsSUFBQSxhQUFhO1FBQUUsSUFBQSxPQUFPO1FBQUUsSUFBQSxPQUFPO1FBQy9CLElBQUEsTUFBTTtRQUFFLElBQUEsT0FBTztRQUFFLElBQUEsSUFBSTtRQUFFLElBQUEsVUFBVSxrQkFGbkM7O1FBSU4sT0FBTztZQUNILHFCQUFDLFdBQUc7Z0JBQ0EscUJBQUMsU0FBSSxTQUFTLEVBQUMsS0FBSyxFQUFBO29CQUNoQixxQkFBQyxTQUFJLFNBQVMsRUFBQywyQkFBMkIsRUFBQTt3QkFDdEMscUJBQUMsV0FBVzs0QkFDUixRQUFRLEVBQUMsUUFBUyxFQUNsQixXQUFXLEVBQUMsU0FBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQzFDLFVBQVUsRUFBQyxXQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFDM0MsWUFBWSxFQUFDLGFBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUMvQyxPQUFPLEVBQUMsT0FBUSxFQUNoQixPQUFPLEVBQUMsT0FBUSxFQUFDLENBQ25CO3FCQUNBO2lCQUNKO2dCQUNOLHFCQUFDLFNBQUksU0FBUyxFQUFDLGVBQWUsRUFBQTtvQkFDMUIscUJBQUMsVUFBVTs0QkFDSCxPQUFPLEVBQUMsT0FBUSxFQUNoQixXQUFXLEVBQUMsSUFBSyxFQUNqQixVQUFVLEVBQUMsVUFBVyxFQUN0QixJQUFJLEVBQUMsSUFBSyxDQUFDLFFBQVEsRUFDbkIsSUFBSSxFQUFDLElBQUssQ0FBQyxZQUFZLEVBQ3ZCLE9BQU8sRUFBQyxJQUFLLENBQUMsT0FBTyxFQUFDLENBQzVCO2lCQUNBO2dCQUNOLHFCQUFDLFVBQUUsRUFBRztnQkFDTixxQkFBQyxTQUFJLFNBQVMsRUFBQyxlQUFlLEVBQUE7b0JBQzFCLHFCQUFDLFNBQUksU0FBUyxFQUFDLDJCQUEyQixFQUFBO3dCQUN0QyxxQkFBQyxXQUFXOzRCQUNSLFVBQVUsRUFBQyxXQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBQyxDQUM5QztxQkFDQTtpQkFDSjthQUNKO1NBQ1QsQ0FBQztLQUNMLENBQUE7OztFQXZFMkIsS0FBSyxDQUFDLFNBd0VyQyxHQUFBOztBQUVELEFBQU9BLElBQU0sUUFBUSxHQUFHOEMsa0JBQU8sQ0FBQ0csaUJBQWUsRUFBRUQsb0JBQWtCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQzs7QUMzR3ZGaEQsSUFBTWlELGlCQUFlLEdBQUcsVUFBQyxLQUFLLEVBQUU7SUFDNUJqRCxJQUFNLE9BQU8sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztJQUMxQ0EsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7SUFDaERBLElBQU0sT0FBTyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLE9BQU8sSUFBSSxTQUFTLENBQUMsQ0FBQzs7SUFFdkVBLElBQU0sUUFBUSxHQUFHLFVBQUMsRUFBRSxFQUFFO1FBQ2xCLE9BQU9rRCxlQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsVUFBQSxLQUFLLEVBQUM7WUFDdkMsT0FBTyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztTQUM5QixDQUFDLENBQUM7S0FDTixDQUFDOztJQUVGbEQsSUFBTSxLQUFLLEdBQUcsWUFBRyxTQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFBLENBQUM7SUFDL0RBLElBQU0sUUFBUSxHQUFHLFlBQUcsRUFBSyxHQUFHLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQzNFQSxJQUFNLFVBQVUsR0FBRyxZQUFHLEVBQUssR0FBRyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUMvRUEsSUFBTSxTQUFTLEdBQUcsWUFBRyxFQUFLLEdBQUcsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDN0VBLElBQU0sV0FBVyxHQUFHLFlBQUcsRUFBSyxHQUFHLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2pGQSxJQUFNLFFBQVEsR0FBRyxZQUFHLEVBQUssR0FBRyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7O0lBRW5GLE9BQU87UUFDSCxPQUFPLEVBQUUsT0FBTztRQUNoQixRQUFRLEVBQUUsUUFBUSxFQUFFO1FBQ3BCLFVBQVUsRUFBRSxVQUFVLEVBQUU7UUFDeEIsU0FBUyxFQUFFLFNBQVMsRUFBRTtRQUN0QixXQUFXLEVBQUUsV0FBVyxFQUFFO1FBQzFCLFFBQVEsRUFBRSxRQUFRLEVBQUU7S0FDdkI7Q0FDSjs7QUFFREEsSUFBTWdELG9CQUFrQixHQUFHLFVBQUMsUUFBUSxFQUFFO0lBQ2xDLE9BQU87UUFDSCxrQkFBa0IsRUFBRSxVQUFDLEVBQUUsRUFBRTtZQUNyQixRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDaEM7UUFDRCxhQUFhLEVBQUUsWUFBRztZQUNkLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUN2QztRQUNELFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBRTtZQUNkLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELFVBQVUsRUFBRSxVQUFDLEVBQUUsRUFBRTtZQUNiLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsV0FBVyxFQUFFLFVBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRTtZQUN4QixRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0o7Q0FDSjs7QUFFRCxJQUFNLFVBQVUsR0FBd0I7SUFBQyxtQkFDMUIsQ0FBQyxLQUFLLEVBQUU7UUFDZlQsVUFBSyxLQUFBLENBQUMsTUFBQSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbEQ7Ozs7a0RBQUE7O0lBRUQscUJBQUEsaUJBQWlCLGlDQUFHO1FBQ2hCLE9BQWlDLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFBdEMsSUFBQSxhQUFhO1FBQUUsSUFBQSxRQUFRLGdCQUF6QjtRQUNOLFNBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1FBQTlCLElBQUEsUUFBUSxrQkFBVjtRQUNOLFNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07UUFBMUIsSUFBQSxJQUFJLGNBQU47O1FBRU52QyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxXQUFXLENBQUM7UUFDMUMsR0FBRyxRQUFRLEVBQUU7WUFDVEEsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLFVBQUMsQ0FBQyxFQUFFO2dCQUM1QixhQUFhLEVBQUUsQ0FBQztnQkFDaEJBLElBQU0sVUFBVSxHQUFHLEdBQUcsR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDO2dCQUMvQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDcEIsQ0FBQyxDQUFDO1NBQ047YUFDSTtZQUNELFFBQVEsQ0FBQztnQkFDTCxLQUFLLEVBQUUsMkJBQTJCO2dCQUNsQyxPQUFPLEVBQUUsNEVBQTRFO2FBQ3hGLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQTs7SUFFRCxxQkFBQSxXQUFXLDZCQUFHO1FBQ1YsT0FBcUIsR0FBRyxJQUFJLENBQUMsS0FBSztRQUExQixJQUFBLFdBQVcsbUJBQWI7UUFDTixTQUFzQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtRQUFsQyxJQUFBLEVBQUU7UUFBRSxJQUFBLFFBQVEsa0JBQWQ7O1FBRU4sV0FBVyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQyxDQUFBOztJQUVELHFCQUFBLGVBQWUsK0JBQUc7UUFDZCxPQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLO1FBQXRCLElBQUEsT0FBTyxlQUFUO1FBQ04sT0FBTztZQUNILE9BQU87WUFDUCxxQkFBQztvQkFDTyxJQUFJLEVBQUMsUUFBUSxFQUNiLFNBQVMsRUFBQyxnQkFBZ0IsRUFDMUIsT0FBTyxFQUFDLElBQUssQ0FBQyxXQUFXLEVBQUMsRUFBQyxjQUVuQyxDQUFTLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDekIsQ0FBQTs7SUFFRCxxQkFBQSxNQUFNLHNCQUFHO1FBQ0wsT0FBZ0UsR0FBRyxJQUFJLENBQUMsS0FBSztRQUFyRSxJQUFBLFFBQVE7UUFBRSxJQUFBLFVBQVU7UUFBRSxJQUFBLFNBQVM7UUFBRSxJQUFBLFdBQVc7UUFBRSxJQUFBLFFBQVEsZ0JBQXhEO1FBQ05BLElBQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDO1FBQ3hDQSxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcENBLElBQU0sVUFBVSxHQUFHLGNBQWMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztRQUUxRyxRQUFRLHFCQUFDLFNBQUksU0FBUyxFQUFDLFlBQVksRUFBQTtvQkFDdkIscUJBQUMsU0FBSSxTQUFTLEVBQUMsdUJBQXVCLEVBQUE7d0JBQ2xDLHFCQUFDLFNBQUksU0FBUyxFQUFDLGVBQWUsRUFBQTs0QkFDMUIscUJBQUMsU0FBSSxTQUFTLEVBQUMsY0FBYyxFQUFBOzhCQUMzQixxQkFBQyxZQUFPLElBQUksRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxjQUFZLEVBQUMsT0FBTyxFQUFDLFlBQVUsRUFBQyxPQUFPLEVBQUEsRUFBQyxxQkFBQyxVQUFLLGFBQVcsRUFBQyxNQUFNLEVBQUEsRUFBQyxHQUFPLENBQU8sQ0FBUzs4QkFDaEkscUJBQUMsUUFBRyxTQUFTLEVBQUMseUJBQXlCLEVBQUEsRUFBQyxJQUFLLEVBQUMscUJBQUMsWUFBSSxFQUFDLHFCQUFDLGFBQUssRUFBQyxLQUFHLEVBQUEsVUFBVyxFQUFTLEVBQU8sQ0FBSzs7NkJBRTFGOzRCQUNOLHFCQUFDLFNBQUksU0FBUyxFQUFDLFlBQVksRUFBQTtnQ0FDdkIscUJBQUMsT0FBRSxJQUFJLEVBQUMsV0FBWSxFQUFFLE1BQU0sRUFBQyxRQUFRLEVBQUE7b0NBQ2pDLHFCQUFDLFNBQUksU0FBUyxFQUFDLDZCQUE2QixFQUFDLEdBQUcsRUFBQyxVQUFXLEVBQUMsQ0FBRztpQ0FDaEU7NkJBQ0Y7NEJBQ04scUJBQUMsU0FBSSxTQUFTLEVBQUMsY0FBYyxFQUFBO2dDQUN6QixxQkFBQyxRQUFRLE1BQUEsRUFBRztnQ0FDWixxQkFBQyxVQUFFLEVBQUc7Z0NBQ04sSUFBSyxDQUFDLGVBQWUsRUFBRTtnQ0FDdkIscUJBQUMsWUFBTyxJQUFJLEVBQUMsUUFBUSxFQUFDLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxjQUFZLEVBQUMsT0FBTyxFQUFBLEVBQUMsS0FBRyxDQUFTO2dDQUNuRixxQkFBQyxTQUFJLFNBQVMsRUFBQyxLQUFLLEVBQUE7b0NBQ2hCLFFBQVM7aUNBQ1A7NkJBQ0o7eUJBQ0o7cUJBQ0o7aUJBQ0o7S0FDakIsQ0FBQTs7O0VBaEZvQixLQUFLLENBQUMsU0FpRjlCLEdBQUE7O0FBRURBLElBQU0sa0JBQWtCLEdBQUc4QyxrQkFBTyxDQUFDRyxpQkFBZSxFQUFFRCxvQkFBa0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BGaEQsSUFBTSxhQUFhLEdBQUd1RCxzQkFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQUFDckQ7O0FDaElBLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFcEJ2RCxJQUFNLFdBQVcsR0FBRyxVQUFDLFNBQVMsRUFBRTtJQUM1QkEsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDcEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztDQUMzQzs7QUFFREEsSUFBTSxXQUFXLEdBQUcsVUFBQyxTQUFTLEVBQUU7SUFDNUJBLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzNDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDeEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztDQUM3Qzs7QUFFRCxRQUFRLENBQUMsTUFBTTtJQUNYLHFCQUFDMEQsbUJBQVEsSUFBQyxLQUFLLEVBQUMsS0FBTSxFQUFDO1FBQ25CLHFCQUFDQyxrQkFBTSxJQUFDLE9BQU8sRUFBQ0MsMEJBQWUsRUFBQztZQUM1QixxQkFBQ0MsaUJBQUssSUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxJQUFLLEVBQUM7Z0JBQzVCLHFCQUFDQyxzQkFBVSxJQUFDLFNBQVMsRUFBQyxJQUFLLEVBQUMsQ0FBRztnQkFDL0IscUJBQUNELGlCQUFLLElBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsS0FBTSxFQUFDLENBQUc7Z0JBQ3hDLHFCQUFDQSxpQkFBSyxJQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsU0FBUyxFQUFDLEtBQU0sRUFBQyxDQUFHO2dCQUN4QyxxQkFBQ0EsaUJBQUssSUFBQyxJQUFJLEVBQUMsbUJBQW1CLEVBQUMsU0FBUyxFQUFDLFVBQVcsRUFBRSxPQUFPLEVBQUMsV0FBWSxFQUFDO29CQUN4RSxxQkFBQ0EsaUJBQUssSUFBQyxJQUFJLEVBQUMsV0FBVyxFQUFDLFNBQVMsRUFBQyxhQUFjLEVBQUUsT0FBTyxFQUFDLFdBQVksRUFBQztxQkFDL0Q7aUJBQ0o7YUFDSjtTQUNIO0tBQ0Y7SUFDWCxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7OzsifQ==