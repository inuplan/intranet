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
    if ( state === void 0 ) state = 1;

    switch (action.type) {
        case SET_TOTAL_PAGES:
            return action.totalPages || 1;
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
        case ADD_LATEST:
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
        return  React.createElement( reactBootstrap.Row, null, 
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
        var ref = this.props;
        var username = ref.username;
        var firstName = ref.firstName;
        var lastName = ref.lastName;
        var email = ref.email;
        var emailLink = "mailto:" + email;
        var gallery = "/" + username + "/gallery";

        return  React.createElement( reactBootstrap.Col, { lg: 3 }, 
                    React.createElement( UserItem, { title: "Brugernavn" }, username), 
                    React.createElement( UserItem, { title: "Fornavn" }, firstName), 
                    React.createElement( UserItem, { title: "Efternavn" }, lastName), 
                    React.createElement( UserItem, { title: "Email" }, React.createElement( 'a', { href: emailLink }, email)), 
                    React.createElement( UserItem, { title: "Billeder" }, React.createElement( reactRouter.Link, { to: gallery }, "Billeder"))
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
        return  React.createElement( reactBootstrap.Row, null, 
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

    ImageUpload.prototype.render = function render () {
        var ref = this.props;
        var hasImages = ref.hasImages;
        var deleteSelectedImages = ref.deleteSelectedImages;
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( 'br', null ), 
                    React.createElement( reactBootstrap.Col, { lg: 4 }, 
                        React.createElement( 'form', {
                              onSubmit: this.handleSubmit, id: "form-upload", enctype: "multipart/form-data" }, 
                                React.createElement( 'div', { className: "form-group" }, 
                                    React.createElement( 'label', { htmlFor: "files" }, "Upload filer:"), 
                                    React.createElement( 'input', { type: "file", className: "form-control", id: "files", name: "files", multiple: true })
                                ), 
                                React.createElement( reactBootstrap.Button, { bsStyle: "primary", type: "submit" }, "Upload"), 
                                '\u00A0', 
                                React.createElement( reactBootstrap.Button, { bsStyle: "danger", disabled: !hasImages, onClick: deleteSelectedImages }, "Slet markeret billeder")
                        )
                    )
                )
    };

    return ImageUpload;
}(React.Component));

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
    return  React.createElement( 'div', null, 
                React.createElement( reactRouter.Link, { to: ("/" + username + "/gallery/image/" + (image.ImageID)) }, 
                    React.createElement( 'img', { src: image.PreviewUrl, className: "img-thumbnail" })
                ), 
                React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactRouter.Link, { to: ("/" + username + "/gallery/image/" + (image.ImageID)) }, 
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
        
        return  React.createElement( reactBootstrap.Row, null, 
                    React.createElement( reactBootstrap.Col, { lgOffset: 2, lg: 8 }, 
                        React.createElement( 'h1', null, React.createElement( 'span', { className: "text-capitalize" }, fullName, "'s"), " ", React.createElement( 'small', null, "billede galleri" ) ), 
                        React.createElement( 'hr', null ), 
                        React.createElement( ImageList, {
                            images: images, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: this.imageIsSelected, username: username }), 
                        this.uploadView()
                    ), 
                    this.props.children
                )
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
        hasImage: Boolean(getImage(state.imagesInfo.selectedImageId)),
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
        this.open = this.open.bind(this); 
        this.close = this.close.bind(this); 
    }

    if ( superclass ) ModalImage.__proto__ = superclass;
    ModalImage.prototype = Object.create( superclass && superclass.prototype );
    ModalImage.prototype.constructor = ModalImage;

    ModalImage.prototype.open = function open () {
        var ref = this.props;
        var hasImage = ref.hasImage;
        var setError = ref.setError;
        if(hasImage) return true;

        setError({
            title: 'Oops something went wrong',
            message: 'Could not find the image, maybe the URL is invalid or it has been deleted!'
        });
        return false;
    };

    ModalImage.prototype.close = function close () {
        var ref = this.props;
        var deselectImage = ref.deselectImage;
        var ref$1 = this.props.params;
        var username = ref$1.username;
        var ref$2 = this.props.router;
        var push = ref$2.push;

        deselectImage();
        var galleryUrl = '/' + username + '/gallery';
        push(galleryUrl);
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
            React.createElement( reactBootstrap.Button, { bsStyle: "danger", onClick: this.deleteImage }, "Slet billede")
            : null);
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

                return  React.createElement( reactBootstrap.Modal, { show: this.open(), onHide: this.close, bsSize: "large" }, 
                            React.createElement( reactBootstrap.Modal.Header, { closeButton: true }, 
                                React.createElement( reactBootstrap.Modal.Title, null, name, React.createElement( 'span', null, React.createElement( 'small', null, " - ", dateString ) ) )
                            ), 

                            React.createElement( reactBootstrap.Modal.Body, null, 
                                React.createElement( 'a', { href: originalUrl, target: "_blank", rel: "noopener" }, 
                                    React.createElement( reactBootstrap.Image, { src: previewUrl, responsive: true })
                                )
                            ), 

                            React.createElement( reactBootstrap.Modal.Footer, null, 
                                React.createElement( Comments, null ), 
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbnN0YW50cy90eXBlcy5qcyIsImFjdGlvbnMvZXJyb3IuanMiLCJ1dGlsaXRpZXMvdXRpbHMuanMiLCJyZWR1Y2Vycy91c2Vycy5qcyIsInJlZHVjZXJzL2ltYWdlcy5qcyIsInJlZHVjZXJzL2NvbW1lbnRzLmpzIiwicmVkdWNlcnMvZXJyb3IuanMiLCJyZWR1Y2Vycy9zdGF0dXMuanMiLCJyZWR1Y2Vycy93aGF0c25ldy5qcyIsInJlZHVjZXJzL3Jvb3QuanMiLCJzdG9yZXMvc3RvcmUuanMiLCJjb25zdGFudHMvY29uc3RhbnRzLmpzIiwiYWN0aW9ucy91c2Vycy5qcyIsImNvbXBvbmVudHMvd3JhcHBlcnMvTGlua3MuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRXJyb3IuanMiLCJjb21wb25lbnRzL01haW4uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJhY3Rpb25zL3doYXRzbmV3LmpzIiwiY29tcG9uZW50cy9XaGF0c05ldy9XaGF0c05ld0l0ZW1JbWFnZS5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3TGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9XaGF0c05ldy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Ib21lLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2Vycy5qcyIsImFjdGlvbnMvaW1hZ2VzLmpzIiwiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VVcGxvYWQuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzLmpzIiwiYWN0aW9ucy9jb21tZW50cy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudERlbGV0ZWQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRDb250cm9scy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudC5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudExpc3QuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL1BhZ2luYXRpb24uanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRGb3JtLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL0NvbW1lbnRzLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gSW1hZ2UgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX0lNRyA9ICdTRVRfU0VMRUNURURfSU1HJztcclxuZXhwb3J0IGNvbnN0IFVOU0VUX1NFTEVDVEVEX0lNRyA9ICdVTlNFVF9TRUxFQ1RFRF9JTUcnO1xyXG5leHBvcnQgY29uc3QgQUREX0lNQUdFID0gJ0FERF9JTUFHRSc7XHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfSU1BR0UgPSAnUkVNT1ZFX0lNQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9JTUFHRVNfT1dORVIgPSAnU0VUX0lNQUdFU19PV05FUic7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9VU0VSX0lNQUdFUyA9ICdSRUNJRVZFRF9VU0VSX0lNQUdFUyc7XHJcbmV4cG9ydCBjb25zdCBBRERfU0VMRUNURURfSU1BR0VfSUQgPSAnQUREX1NFTEVDVEVEX0lNQUdFX0lEJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCA9ICdSRU1PVkVfU0VMRUNURURfSU1BR0VfSUQnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTID0gJ0NMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyc7XHJcblxyXG4vLyBVc2VyIGFjdGlvbnNcclxuZXhwb3J0IGNvbnN0IFNFVF9DVVJSRU5UX1VTRVJfSUQgPSAnU0VUX0NVUlJFTlRfVVNFUl9JRCc7XHJcbmV4cG9ydCBjb25zdCBBRERfVVNFUiA9ICdBRERfVVNFUic7XHJcbmV4cG9ydCBjb25zdCBFUlJPUl9GRVRDSElOR19DVVJSRU5UX1VTRVIgPSAnRVJST1JfRkVUQ0hJTkdfQ1VSUkVOVF9VU0VSJztcclxuZXhwb3J0IGNvbnN0IFJFQ0lFVkVEX1VTRVJTID0gJ1JFQ0lFVkVEX1VTRVJTJztcclxuXHJcbi8vIENvbW1lbnQgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgUkVDSUVWRURfQ09NTUVOVFMgPSAnUkVDSUVWRURfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX0NVUlJFTlRfUEFHRSA9ICdTRVRfQ1VSUkVOVF9QQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UT1RBTF9QQUdFUyA9ICdTRVRfVE9UQUxfUEFHRVMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NLSVBfQ09NTUVOVFMgPSAnU0VUX1NLSVBfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RBS0VfQ09NTUVOVFMgPSAnU0VUX1RBS0VfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgSU5DUl9DT01NRU5UX0NPVU5UID0gJ0lOQ1JfQ09NTUVOVF9DT1VOVCc7XHJcbmV4cG9ydCBjb25zdCBERUNSX0NPTU1FTlRfQ09VTlQgPSAnREVDUl9DT01NRU5UX0NPVU5UJztcclxuZXhwb3J0IGNvbnN0IFNFVF9ERUZBVUxUX1NLSVAgPSAnU0VUX0RFRkFVTFRfU0tJUCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfREVGQVVMVF9UQUtFID0gJ1NFVF9ERUZBVUxUX1RBS0UnO1xyXG5leHBvcnQgY29uc3QgU0VUX0RFRkFVTFRfQ09NTUVOVFMgPSAnU0VUX0RFRkFVTFRfQ09NTUVOVFMnO1xyXG5cclxuLy8gV2hhdHNOZXdcclxuZXhwb3J0IGNvbnN0IEFERF9MQVRFU1QgPSAnQUREX0xBVEVTVCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0tJUF9XSEFUU19ORVcgPSAnU0VUX1NLSVBfV0hBVFNfTkVXJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UQUtFX1dIQVRTX05FVyA9ICdTRVRfVEFLRV9XSEFUU19ORVcnO1xyXG5leHBvcnQgY29uc3QgU0VUX1BBR0VfV0hBVFNfTkVXID0gJ1NFVF9QQUdFX1dIQVRTX05FVyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXID0gJ1NFVF9UT1RBTF9QQUdFU19XSEFUU19ORVcnO1xyXG5cclxuLy8gRXJyb3IgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX0VSUk9SX1RJVExFID0gJ1NFVF9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfRVJST1JfTUVTU0FHRSA9ICdTRVRfRVJST1JfTUVTU0FHRSdcclxuZXhwb3J0IGNvbnN0IFNFVF9IQVNfRVJST1IgPSAnU0VUX0hBU19FUlJPUic7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9USVRMRSA9ICdDTEVBUl9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9NRVNTQUdFID0gJ0NMRUFSX0VSUk9SX01FU1NBR0UnOyIsIu+7v2ltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfRVJST1JfVElUTEUsXHJcbiAgICAgICAgdGl0bGU6IHRpdGxlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckVycm9yVGl0bGUgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfVElUTEVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yTWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0VSUk9SX01FU1NBR0UsXHJcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvck1lc3NhZ2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfTUVTU0FHRVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9ICgpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChjbGVhckVycm9yVGl0bGUoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvck1lc3NhZ2UoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0SGFzRXJyb3IoZmFsc2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRIYXNFcnJvciA9IChoYXNFcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9IQVNfRVJST1IsXHJcbiAgICAgICAgaGFzRXJyb3I6IGhhc0Vycm9yXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKHRydWUpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXRFcnJvclRpdGxlKGVycm9yLnRpdGxlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JNZXNzYWdlKGVycm9yLm1lc3NhZ2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IodGl0bGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IHVuaXEsIGZsYXR0ZW4gfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXHJcbmltcG9ydCByZW1vdmVNZCBmcm9tICdyZW1vdmUtbWFya2Rvd24nXHJcblxyXG52YXIgY3VycnkgPSBmdW5jdGlvbihmLCBuYXJncywgYXJncykge1xyXG4gICAgbmFyZ3MgPSBpc0Zpbml0ZShuYXJncykgPyBuYXJncyA6IGYubGVuZ3RoO1xyXG4gICAgYXJncyA9IGFyZ3MgfHwgW107XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gMS4gYWNjdW11bGF0ZSBhcmd1bWVudHNcclxuICAgICAgICB2YXIgbmV3QXJncyA9IGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIGlmIChuZXdBcmdzLmxlbmd0aCA+PSBuYXJncykge1xyXG4gICAgICAgICAgICAvLyBhcHBseSBhY2N1bXVsYXRlZCBhcmd1bWVudHNcclxuICAgICAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgbmV3QXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIDIuIHJldHVybiBhbm90aGVyIGN1cnJpZWQgZnVuY3Rpb25cclxuICAgICAgICByZXR1cm4gY3VycnkoZiwgbmFyZ3MsIG5ld0FyZ3MpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGN1cnJ5O1xyXG5cclxuY29uc3QgY291bnRDb21tZW50ID0gKHRvcENvbW1lbnQpID0+IHtcclxuICAgIGxldCBjb3VudCA9IDE7XHJcbiAgICBsZXQgcmVtb3ZlZCA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcENvbW1lbnQuUmVwbGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdG9wQ29tbWVudC5SZXBsaWVzW2ldO1xyXG5cclxuICAgICAgICAvLyBFeGNsdWRlIGRlbGV0ZWQgY29tbWVudHNcclxuICAgICAgICBpZihjaGlsZC5EZWxldGVkKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZWQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvdW50ICs9IGNvdW50Q29tbWVudChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50LXJlbW92ZWQ7XHJcbn1cclxuXHJcbmNvbnN0IGNvdW50Q29tbWVudHMgPSAoY29tbWVudHMgPSBbXSkgPT4ge1xyXG4gICAgbGV0IHRvdGFsID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgdG9wQ29tbWVudCA9IGNvbW1lbnRzW2ldO1xyXG4gICAgICAgIHRvdGFsICs9IGNvdW50Q29tbWVudCh0b3BDb21tZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdG90YWw7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVJbWFnZSA9IChpbWcpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSW1hZ2VJRDogaW1nLkltYWdlSUQsXHJcbiAgICAgICAgRmlsZW5hbWU6IGltZy5GaWxlbmFtZSxcclxuICAgICAgICBFeHRlbnNpb246IGltZy5FeHRlbnNpb24sXHJcbiAgICAgICAgT3JpZ2luYWxVcmw6IGltZy5PcmlnaW5hbFVybCxcclxuICAgICAgICBQcmV2aWV3VXJsOiBpbWcuUHJldmlld1VybCxcclxuICAgICAgICBUaHVtYm5haWxVcmw6IGltZy5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgQ29tbWVudENvdW50OiBpbWcuQ29tbWVudENvdW50LFxyXG4gICAgICAgIFVwbG9hZGVkOiBuZXcgRGF0ZShpbWcuVXBsb2FkZWQpLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNvbW1lbnQgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgbGV0IHIgPSBjb21tZW50LlJlcGxpZXMgPyBjb21tZW50LlJlcGxpZXMgOiBbXTtcclxuICAgIGNvbnN0IHJlcGxpZXMgPSByLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgIGNvbnN0IGF1dGhvcklkID0gKGNvbW1lbnQuRGVsZXRlZCkgPyAtMSA6IGNvbW1lbnQuQXV0aG9yLklEO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBDb21tZW50SUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgICAgIERlbGV0ZWQ6IGNvbW1lbnQuRGVsZXRlZCxcclxuICAgICAgICBQb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbixcclxuICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgUmVwbGllczogcmVwbGllc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplTGF0ZXN0ID0gKGxhdGVzdCkgPT4ge1xyXG4gICAgbGV0IGl0ZW0gPSBudWxsO1xyXG4gICAgaWYobGF0ZXN0LlR5cGUgPT0gMSkge1xyXG4gICAgICAgIC8vIEltYWdlIC0gb21pdCBBdXRob3IgYW5kIENvbW1lbnRDb3VudFxyXG4gICAgICAgIGNvbnN0IGltYWdlID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgRXh0ZW5zaW9uOiBpbWFnZS5FeHRlbnNpb24sXHJcbiAgICAgICAgICAgIEZpbGVuYW1lOiBpbWFnZS5GaWxlbmFtZSxcclxuICAgICAgICAgICAgSW1hZ2VJRDogaW1hZ2UuSW1hZ2VJRCxcclxuICAgICAgICAgICAgT3JpZ2luYWxVcmw6IGltYWdlLk9yaWdpbmFsVXJsLFxyXG4gICAgICAgICAgICBQcmV2aWV3VXJsOiBpbWFnZS5QcmV2aWV3VXJsLFxyXG4gICAgICAgICAgICBUaHVtYm5haWxVcmw6IGltYWdlLlRodW1ibmFpbFVybCxcclxuICAgICAgICAgICAgVXBsb2FkZWQ6IGltYWdlLlVwbG9hZGVkXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxhdGVzdC5UeXBlID09IDIpIHtcclxuICAgICAgICAvLyBDb21tZW50IC0gb21pdCBBdXRob3IgYW5kIERlbGV0ZWQgYW5kIFJlcGxpZXNcclxuICAgICAgICBjb25zdCBjb21tZW50ID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgSUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogY29tbWVudC5JbWFnZUlELFxyXG4gICAgICAgICAgICBJbWFnZVVwbG9hZGVkQnk6IGNvbW1lbnQuSW1hZ2VVcGxvYWRlZEJ5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiBsYXRlc3QuSUQsXHJcbiAgICAgICAgVHlwZTogbGF0ZXN0LlR5cGUsXHJcbiAgICAgICAgSXRlbTogaXRlbSxcclxuICAgICAgICBPbjogbGF0ZXN0Lk9uLFxyXG4gICAgICAgIEF1dGhvcklEOiBsYXRlc3QuSXRlbS5BdXRob3IuSURcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHZpc2l0Q29tbWVudHMgPSAoY29tbWVudHMsIGZ1bmMpID0+IHtcclxuICAgIGNvbnN0IGdldFJlcGxpZXMgPSAoYykgPT4gYy5SZXBsaWVzID8gYy5SZXBsaWVzIDogW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjb21tZW50c1tpXSwgZ2V0UmVwbGllcywgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZXB0aEZpcnN0U2VhcmNoID0gKGN1cnJlbnQsIGdldENoaWxkcmVuLCBmdW5jKSA9PiB7XHJcbiAgICBmdW5jKGN1cnJlbnQpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBnZXRDaGlsZHJlbihjdXJyZW50KTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKGNoaWxkcmVuW2ldLCBnZXRDaGlsZHJlbiwgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmlvbihhcnIxLCBhcnIyLCBlcXVhbGl0eUZ1bmMpIHtcclxuICAgIHZhciB1bmlvbiA9IGFycjEuY29uY2F0KGFycjIpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5pb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gaSsxOyBqIDwgdW5pb24ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGVxdWFsaXR5RnVuYyh1bmlvbltpXSwgdW5pb25bal0pKSB7XHJcbiAgICAgICAgICAgICAgICB1bmlvbi5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICBqLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVuaW9uO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXNlckVxdWFsaXR5ID0gKHVzZXIxLCB1c2VyMikgPT4ge1xyXG4gICAgaWYoIXVzZXIyIHx8ICF1c2VyMSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHVzZXIxLklEID09IHVzZXIyLklEO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGZvcm1hdFRleHQgPSAodGV4dCkgPT4ge1xyXG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICB2YXIgcmF3TWFya3VwID0gbWFya2VkKHRleHQsIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICByZXR1cm4geyBfX2h0bWw6IHJhd01hcmt1cCB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0V29yZHMgPSAodGV4dCwgbnVtYmVyT2ZXb3JkcykgPT4ge1xyXG4gICAgaWYoIXRleHQpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgcGxhaW5UZXh0ID0gcmVtb3ZlTWQodGV4dCk7XHJcbiAgICByZXR1cm4gcGxhaW5UZXh0LnNwbGl0KC9cXHMrLykuc2xpY2UoMCwgbnVtYmVyT2ZXb3Jkcykuam9pbihcIiBcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB0aW1lVGV4dCA9IChwb3N0ZWRPbikgPT4ge1xyXG4gICAgY29uc3QgYWdvID0gbW9tZW50KHBvc3RlZE9uKS5mcm9tTm93KCk7XHJcbiAgICBjb25zdCBkaWZmID0gbW9tZW50KCkuZGlmZihwb3N0ZWRPbiwgJ2hvdXJzJywgdHJ1ZSk7XHJcbiAgICBpZiAoZGlmZiA+PSAxMi41KSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBtb21lbnQocG9zdGVkT24pO1xyXG4gICAgICAgIHJldHVybiBcImQuIFwiICsgZGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKSArIFwia2wuIFwiICsgZGF0ZS5mb3JtYXQoXCJIOm1tXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBcImZvciBcIiArIGFnbztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc3BvbnNlSGFuZGxlciA9IChkaXNwYXRjaCwgcmVzcG9uc2UpID0+IHtcclxuICAgIGlmIChyZXNwb25zZS5vaykgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgNDAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjQwMCBCYWQgUmVxdWVzdFwiLCBcIlRoZSByZXF1ZXN0IHdhcyBub3Qgd2VsbC1mb3JtZWRcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDQgTm90IEZvdW5kXCIsIFwiQ291bGQgbm90IGZpbmQgcmVzb3VyY2VcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwODpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDggUmVxdWVzdCBUaW1lb3V0XCIsIFwiVGhlIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgaW4gdGltZVwiKSkpO1xyXG4gICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI1MDAgU2VydmVyIEVycm9yXCIsIFwiU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgQVBJLXNlcnZlclwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihuZXcgSHR0cEVycm9yKFwiT29wc1wiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG9uUmVqZWN0ID0gKCkgPT4geyB9XHJcbiIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgdW5pb24sIHVzZXJFcXVhbGl0eSB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IHVzZXJzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfVVNFUjpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLnVzZXJdLCB1c2VyRXF1YWxpdHkpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi51c2VycztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRVc2VySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9DVVJSRU5UX1VTRVJfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB1c2Vyc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgY3VycmVudFVzZXJJZCxcclxuICAgIHVzZXJzXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCB1c2Vyc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IG93bmVySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9JTUFHRVNfT1dORVI6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbWFnZXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLmltYWdlXSwgKGltZzEsIGltZzIpID0+IGltZzEuSW1hZ2VJRCA9PSBpbWcyLkltYWdlSUQpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSX0lNQUdFUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pbWFnZXM7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmZpbHRlcihpbWcgPT4gaW1nLkltYWdlSUQgIT0gYWN0aW9uLmlkKTtcclxuICAgICAgICBjYXNlIFQuSU5DUl9DT01NRU5UX0NPVU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubWFwKGltZyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihpbWcuSW1hZ2VJRCA9PSBhY3Rpb24uaW1hZ2VJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZy5Db21tZW50Q291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVC5ERUNSX0NPTU1FTlRfQ09VTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYXAoaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGltZy5JbWFnZUlEID09IGFjdGlvbi5pbWFnZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nLkNvbW1lbnRDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGltZztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TRUxFQ1RFRF9JTUc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWRzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfU0VMRUNURURfSU1BR0VfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB1bmlvbihzdGF0ZSwgW2FjdGlvbi5pZF0sIChpZDEsIGlkMikgPT4gaWQxID09IGlkMik7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRDpcclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcihzdGF0ZSwgKGlkKSA9PiBpZCAhPSBhY3Rpb24uaWQpO1xyXG4gICAgICAgIGNhc2UgVC5DTEVBUl9TRUxFQ1RFRF9JTUFHRV9JRFM6XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGltYWdlc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgb3duZXJJZCxcclxuICAgIGltYWdlcyxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZCxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZHNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGltYWdlc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuY29uc3QgY29tbWVudHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlJFQ0lFVkVEX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmNvbW1lbnRzIHx8IFtdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0tJUF9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5za2lwIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB0YWtlID0gKHN0YXRlID0gMTAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVEFLRV9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfQ1VSUkVOVF9QQUdFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBhZ2UgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RPVEFMX1BBR0VTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRvdGFsUGFnZXMgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNvbW1lbnRzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjb21tZW50cyxcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbW1lbnRzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5leHBvcnQgY29uc3QgdGl0bGUgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0VSUk9SX1RJVExFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRpdGxlIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfRVJST1JfTUVTU0FHRTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5tZXNzYWdlIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBlcnJvckluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdGl0bGUsXHJcbiAgICBtZXNzYWdlXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXJyb3JJbmZvOyIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IGVycm9ySW5mbyBmcm9tICcuL2Vycm9yJ1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhc0Vycm9yID0gKHN0YXRlID0gZmFsc2UsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfSEFTX0VSUk9SOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhc0Vycm9yO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkb25lID0gKHN0YXRlID0gdHJ1ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzdGF0dXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGhhc0Vycm9yLFxyXG4gICAgZXJyb3JJbmZvLFxyXG4gICAgbWVzc2FnZSxcclxuICAgIGRvbmVcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0YXR1c0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuXHJcbmNvbnN0IHNraXAgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1NLSVBfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnNraXAgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UQUtFX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfUEFHRV9XSEFUU19ORVc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGFnZSB8fCAxO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRvdGFsUGFnZXMgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGl0ZW1zID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfTEFURVNUOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmxhdGVzdCB8fCBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHdoYXRzTmV3SW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBza2lwLFxyXG4gICAgdGFrZSxcclxuICAgIHBhZ2UsXHJcbiAgICB0b3RhbFBhZ2VzLFxyXG4gICAgaXRlbXNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdoYXRzTmV3SW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0IHVzZXJzSW5mbyBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgaW1hZ2VzSW5mbyBmcm9tICcuL2ltYWdlcydcclxuaW1wb3J0IGNvbW1lbnRzSW5mbyBmcm9tICcuL2NvbW1lbnRzJ1xyXG5pbXBvcnQgc3RhdHVzSW5mbyBmcm9tICcuL3N0YXR1cydcclxuaW1wb3J0IHdoYXRzTmV3SW5mbyBmcm9tICcuL3doYXRzbmV3J1xyXG5cclxuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdXNlcnNJbmZvLFxyXG4gICAgaW1hZ2VzSW5mbyxcclxuICAgIGNvbW1lbnRzSW5mbyxcclxuICAgIHN0YXR1c0luZm8sXHJcbiAgICB3aGF0c05ld0luZm9cclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyIiwi77u/aW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgdGh1bmsgZnJvbSAncmVkdXgtdGh1bmsnXHJcbmltcG9ydCByb290UmVkdWNlciBmcm9tICcuLi9yZWR1Y2Vycy9yb290J1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocm9vdFJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZSh0aHVuaykpIiwi77u/ZXhwb3J0IGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnXHJcbn0iLCLvu79pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5jb25zdCBnZXRVcmwgPSAodXNlcm5hbWUpID0+IGdsb2JhbHMudXJscy51c2VycyArICc/dXNlcm5hbWU9JyArIHVzZXJuYW1lO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRVc2VySWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfQ1VSUkVOVF9VU0VSX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXIodXNlcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9VU0VSLFxyXG4gICAgICAgIHVzZXI6IHVzZXJcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNpZXZlZFVzZXJzKHVzZXJzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfVVNFUlMsXHJcbiAgICAgICAgdXNlcnM6IHVzZXJzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRDdXJyZW50VXNlcklkKHVzZXIuSUQpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIodXNlcikpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFVzZXIodXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hVc2VycygpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGdsb2JhbHMudXJscy51c2Vycywgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlcnMgPT4gZGlzcGF0Y2gocmVjaWV2ZWRVc2Vycyh1c2VycykpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBMaW5rLCBJbmRleExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBOYXZMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQgaXNBY3RpdmUgPSB0aGlzLmNvbnRleHQucm91dGVyLmlzQWN0aXZlKHRoaXMucHJvcHMudG8sIHRydWUpLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBpc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG4gICAgICAgICAgICAgICAgPExpbmsgey4uLnRoaXMucHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuTmF2TGluay5jb250ZXh0VHlwZXMgPSB7XHJcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5vYmplY3RcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZGV4TmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICAgICAgICAgIDxJbmRleExpbmsgey4uLnRoaXMucHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9JbmRleExpbms+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5JbmRleE5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFJvdywgQ29sLCBBbGVydCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjbGVhckVycm9yLCB0aXRsZSwgbWVzc2FnZSAgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEFsZXJ0IGJzU3R5bGU9XCJkYW5nZXJcIiBvbkRpc21pc3M9e2NsZWFyRXJyb3J9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57bWVzc2FnZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQWxlcnQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBOYXZMaW5rLCBJbmRleE5hdkxpbmsgfSBmcm9tICcuL3dyYXBwZXJzL0xpbmtzJ1xyXG5pbXBvcnQgeyBFcnJvciB9IGZyb20gJy4vY29udGFpbmVycy9FcnJvcidcclxuaW1wb3J0IHsgY2xlYXJFcnJvciB9IGZyb20gJy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgR3JpZCwgTmF2YmFyLCBOYXYgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaGFzRXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uaGFzRXJyb3IsXHJcbiAgICAgICAgZXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uZXJyb3JJbmZvXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xlYXJFcnJvcjogKCkgPT4gZGlzcGF0Y2goY2xlYXJFcnJvcigpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTaGVsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBlcnJvclZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgY2xlYXJFcnJvciwgZXJyb3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgbWVzc2FnZSB9ID0gZXJyb3I7XHJcbiAgICAgICAgcmV0dXJuIChoYXNFcnJvciA/XHJcbiAgICAgICAgICAgIDxFcnJvclxyXG4gICAgICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17bWVzc2FnZX1cclxuICAgICAgICAgICAgICAgIGNsZWFyRXJyb3I9e2NsZWFyRXJyb3J9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPEdyaWQgZmx1aWQ9e3RydWV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci5CcmFuZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9cIiBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIj5JbnVwbGFuIEludHJhbmV0PC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXZiYXIuQnJhbmQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRvZ2dsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5IZWFkZXI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLkNvbGxhcHNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5kZXhOYXZMaW5rIHRvPVwiL1wiPkZvcnNpZGU8L0luZGV4TmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayB0bz1cIi91c2Vyc1wiPkJydWdlcmU8L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89XCIvYWJvdXRcIj5PbTwvTmF2TGluaz4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRleHQgcHVsbFJpZ2h0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhlaiwge2dsb2JhbHMuY3VycmVudFVzZXJuYW1lfSFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLlRleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLkNvbGxhcHNlPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L05hdmJhcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZXJyb3JWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9HcmlkPlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBNYWluID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoU2hlbGwpO1xyXG5leHBvcnQgZGVmYXVsdCBNYWluOyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYm91dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiT21cIjtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZXR0ZSBlciBlbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbiFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGVrbm9sb2dpZXIgYnJ1Z3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlYWN0PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5SZWR1eDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVhY3QtQm9vdHN0cmFwPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5SZWFjdFJvdXRlcjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+QXNwLm5ldCBDb3JlIFJDIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkFzcC5uZXQgV2ViIEFQSSAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0LCBub3JtYWxpemVMYXRlc3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZExhdGVzdChsYXRlc3QpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5BRERfTEFURVNULFxyXG4gICAgICAgIGxhdGVzdDogbGF0ZXN0XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRTS2lwKHNraXApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0tJUF9XSEFUU19ORVcsXHJcbiAgICAgICAgc2tpcDogc2tpcFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VGFrZSh0YWtlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RBS0VfV0hBVFNfTkVXLFxyXG4gICAgICAgIHRha2U6IHRha2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFBhZ2UocGFnZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9QQUdFX1dIQVRTX05FVyxcclxuICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUb3RhbFBhZ2VzKHRvdGFsUGFnZXMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMud2hhdHNuZXcgKyBcIj9za2lwPVwiICsgc2tpcCArIFwiJnRha2U9XCIgKyB0YWtlO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4ocGFnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IHBhZ2UuQ3VycmVudEl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdXRob3IgPSBpdGVtLkl0ZW0uQXV0aG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGF1dGhvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkVXNlcihhdXRob3IpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlc2V0IGluZm9cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFNLaXAoc2tpcCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZSh0YWtlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRQYWdlKHBhZ2UuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMocGFnZS5Ub3RhbFBhZ2VzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGl0ZW1zLmZpbHRlcihpdGVtID0+IEJvb2xlYW4oaXRlbS5JdGVtLkF1dGhvcikpLm1hcChub3JtYWxpemVMYXRlc3QpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkTGF0ZXN0KG5vcm1hbGl6ZWQpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3SXRlbUltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50UHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cIm1lZGlhLW9iamVjdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjPVwiL2ltYWdlcy9wZXJzb25faWNvbi5zdmdcIlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtaG9sZGVyLXJlbmRlcmVkPVwidHJ1ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiNjRweFwiLCBoZWlnaHQ6IFwiNjRweFwiIH19XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlJ1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCBnZXRXb3JkcywgdGltZVRleHQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IE1lZGlhIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3SXRlbUNvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY3JlYXRlU3VtbWFyeSgpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRleHQoXCJcXFwiXCIgKyBnZXRXb3Jkcyh0ZXh0LCA1KSArIFwiLi4uXCIgKyBcIlxcXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVsbG5hbWUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIGF1dGhvci5GaXJzdE5hbWUgKyAnICcgKyBhdXRob3IuTGFzdE5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgd2hlbigpIHtcclxuICAgICAgICBjb25zdCB7IG9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBcInNhZ2RlIFwiICsgdGltZVRleHQob24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIHVwbG9hZGVkQnkgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yID0gdGhpcy5mdWxsbmFtZSgpO1xyXG4gICAgICAgIGNvbnN0IHN1bW1hcnkgPSB0aGlzLmNyZWF0ZVN1bW1hcnkoKTtcclxuICAgICAgICBjb25zdCBsaW5rVG9JbWFnZSA9IHVwbG9hZGVkQnkuVXNlcm5hbWUgKyBcIi9nYWxsZXJ5L2ltYWdlL1wiICsgaW1hZ2VJZDtcclxuICAgICAgICByZXR1cm4gIDxNZWRpYS5MaXN0SXRlbT5cclxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFByb2ZpbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICA8TWVkaWEuQm9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cIm1lZGlhLWhlYWRpbmdcIj57YXV0aG9yfSA8c21hbGw+e3RoaXMud2hlbigpfTwvc21hbGw+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxlbT48c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17c3VtbWFyeX0+PC9zcGFuPjwvZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17bGlua1RvSW1hZ2V9PlNlIGtvbW1lbnRhcjwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICA8L01lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L01lZGlhLkxpc3RJdGVtPlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgV2hhdHNOZXdJdGVtSW1hZ2UgfSBmcm9tICcuL1doYXRzTmV3SXRlbUltYWdlJ1xyXG5pbXBvcnQgeyBXaGF0c05ld0l0ZW1Db21tZW50IH0gZnJvbSAnLi9XaGF0c05ld0l0ZW1Db21tZW50J1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0xpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0SXRlbXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBnZW5lcmF0ZUtleSA9IChpZCkgPT4gXCJ3aGF0c25ld19cIiArIGlkO1xyXG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGdldFVzZXIoaXRlbS5BdXRob3JJRCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1LZXkgPSBnZW5lcmF0ZUtleShpdGVtLklEKTtcclxuICAgICAgICAgICAgc3dpdGNoIChpdGVtLlR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxXaGF0c05ld0l0ZW1JbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtpdGVtLklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW09e2l0ZW0uSXRlbX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbj17aXRlbS5Pbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I9e2F1dGhvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW1LZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAgPFdoYXRzTmV3SXRlbUNvbW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17aXRlbS5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXtpdGVtLkl0ZW0uVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRlZEJ5PXtpdGVtLkl0ZW0uSW1hZ2VVcGxvYWRlZEJ5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e2l0ZW0uSXRlbS5JbWFnZUlEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uPXtpdGVtLk9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcj17YXV0aG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aXRlbUtleX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBpdGVtTm9kZXMgPSB0aGlzLmNvbnN0cnVjdEl0ZW1zKCk7XHJcbiAgICAgICAgcmV0dXJuICA8TWVkaWEuTGlzdD5cclxuICAgICAgICAgICAgICAgICAgICB7aXRlbU5vZGVzfVxyXG4gICAgICAgICAgICAgICAgPC9NZWRpYS5MaXN0PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBmZXRjaExhdGVzdE5ld3MgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3doYXRzbmV3J1xyXG5pbXBvcnQgeyBXaGF0c05ld0xpc3QgfSBmcm9tICcuLi9XaGF0c05ldy9XaGF0c05ld0xpc3QnXHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TGF0ZXN0OiAoc2tpcCwgdGFrZSkgPT4gZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXRlbXM6IHN0YXRlLndoYXRzTmV3SW5mby5pdGVtcyxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IGZpbmQoc3RhdGUudXNlcnNJbmZvLnVzZXJzLCAodXNlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdXNlci5JRCA9PSBpZDtcclxuICAgICAgICB9KSxcclxuICAgICAgICBza2lwOiBzdGF0ZS53aGF0c05ld0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS53aGF0c05ld0luZm8udGFrZVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBXaGF0c05ld0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGdldExhdGVzdCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBnZXRMYXRlc3Qoc2tpcCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5TaWRzdGUgbnl0PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8V2hhdHNOZXdMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpdGVtc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VXNlcj17Z2V0VXNlcn1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFdoYXRzTmV3ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoV2hhdHNOZXdDb250YWluZXIpXHJcbmV4cG9ydCBkZWZhdWx0IFdoYXRzTmV3OyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgV2hhdHNOZXcgZnJvbSAnLi9XaGF0c05ldydcclxuaW1wb3J0IHsgSnVtYm90cm9uLCBHcmlkLCBSb3csIENvbCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vycy5maWx0ZXIodSA9PiB1LlVzZXJuYW1lLnRvVXBwZXJDYXNlKCkgPT0gZ2xvYmFscy5jdXJyZW50VXNlcm5hbWUudG9VcHBlckNhc2UoKSlbMF07XHJcbiAgICBjb25zdCBuYW1lID0gdXNlciA/IHVzZXIuRmlyc3ROYW1lIDogJ1VzZXInO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBuYW1lXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEhvbWVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJGb3JzaWRlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SnVtYm90cm9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPlZlbGtvbW1lbiA8c21hbGw+e25hbWV9ITwvc21hbGw+PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImxlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWwgSW51cGxhbnMgaW50cmFuZXQgc2lkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9KdW1ib3Ryb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxXaGF0c05ldyAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEhvbWUgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoSG9tZVZpZXcpXHJcbmV4cG9ydCBkZWZhdWx0IEhvbWUiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGZpcnN0TmFtZSwgbGFzdE5hbWUsIGVtYWlsIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGVtYWlsTGluayA9IFwibWFpbHRvOlwiICsgZW1haWw7XHJcbiAgICAgICAgY29uc3QgZ2FsbGVyeSA9IFwiL1wiICsgdXNlcm5hbWUgKyBcIi9nYWxsZXJ5XCI7XHJcblxyXG4gICAgICAgIHJldHVybiAgPENvbCBsZz17M30+XHJcbiAgICAgICAgICAgICAgICAgICAgPFVzZXJJdGVtIHRpdGxlPVwiQnJ1Z2VybmF2blwiPnt1c2VybmFtZX08L1VzZXJJdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgIDxVc2VySXRlbSB0aXRsZT1cIkZvcm5hdm5cIj57Zmlyc3ROYW1lfTwvVXNlckl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFVzZXJJdGVtIHRpdGxlPVwiRWZ0ZXJuYXZuXCI+e2xhc3ROYW1lfTwvVXNlckl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFVzZXJJdGVtIHRpdGxlPVwiRW1haWxcIj48YSBocmVmPXtlbWFpbExpbmt9PntlbWFpbH08L2E+PC9Vc2VySXRlbT5cclxuICAgICAgICAgICAgICAgICAgICA8VXNlckl0ZW0gdGl0bGU9XCJCaWxsZWRlclwiPjxMaW5rIHRvPXtnYWxsZXJ5fT5CaWxsZWRlcjwvTGluaz48L1VzZXJJdGVtPlxyXG4gICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJIZWFkaW5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxDb2wgbGc9ezZ9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXNlckJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPENvbCBsZz17Nn0+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXNlckl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxVc2VySGVhZGluZz57dGl0bGV9PC9Vc2VySGVhZGluZz5cclxuICAgICAgICAgICAgICAgICAgICA8VXNlckJvZHk+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9Vc2VyQm9keT5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL1VzZXInXHJcbmltcG9ydCB7IFJvdyB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICB1c2VyTm9kZXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VycyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gdXNlcnMubWFwKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJJZCA9IGB1c2VySWRfJHt1c2VyLklEfWA7XHJcbiAgICAgICAgICAgIHJldHVybiAgPFVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlci5Vc2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ9e3VzZXIuSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lPXt1c2VyLkZpcnN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TmFtZT17dXNlci5MYXN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbD17dXNlci5FbWFpbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlVXJsPXt1c2VyLlByb2ZpbGVJbWFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlcz17dXNlci5Sb2xlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3VzZXJJZH1cclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy51c2VyTm9kZXMoKX1cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IGZldGNoVXNlcnMgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgeyBVc2VyTGlzdCB9IGZyb20gJy4uL3VzZXJzL1VzZXJMaXN0J1xyXG5pbXBvcnQgeyBSb3csIENvbCwgUGFnZUhlYWRlciB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmNvbnN0IG1hcFVzZXJzVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2Vyczogc3RhdGUudXNlcnNJbmZvLnVzZXJzXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0VXNlcnM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hVc2VycygpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBVc2Vyc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiQnJ1Z2VyZVwiO1xyXG4gICAgICAgIHRoaXMucHJvcHMuZ2V0VXNlcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VycyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8UGFnZUhlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEludXBsYW4ncyA8c21hbGw+YnJ1Z2VyZTwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUGFnZUhlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VyTGlzdCB1c2Vycz17dXNlcnN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFVzZXJzID0gY29ubmVjdChtYXBVc2Vyc1RvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlcnNDb250YWluZXIpXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJzIiwi77u/aW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgeyBub3JtYWxpemVJbWFnZSB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEltYWdlc093bmVyKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0lNQUdFU19PV05FUixcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNpZXZlZFVzZXJJbWFnZXMoaW1hZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfVVNFUl9JTUFHRVMsXHJcbiAgICAgICAgaW1hZ2VzOiBpbWFnZXNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZEltZyA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TRUxFQ1RFRF9JTUcsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkSW1hZ2UoaW1nKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX0lNQUdFLFxyXG4gICAgICAgIGltYWdlOiBpbWdcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVJbWFnZShpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFTU9WRV9JTUFHRSxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRTZWxlY3RlZEltYWdlSWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5BRERfU0VMRUNURURfSU1BR0VfSUQsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVNT1ZFX1NFTEVDVEVEX0lNQUdFX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5DTEVBUl9TRUxFQ1RFRF9JTUFHRV9JRFNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVJbWFnZShpZCwgdXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lICsgXCImaWQ9XCIgKyBpZDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBkaXNwYXRjaChyZW1vdmVJbWFnZShpZCkpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRJbWFnZSh1c2VybmFtZSwgZm9ybURhdGEpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSksIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICBjb25zdCBvblN1Y2Nlc3MgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gZGF0YS5tYXAobm9ybWFsaXplSW1hZ2UpLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVjaWV2ZWRVc2VySW1hZ2VzKG5vcm1hbGl6ZWQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzcywgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBpbWFnZUlkcyA9IFtdKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCBpZHMgPSBpbWFnZUlkcy5qb2luKCk7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlcyArIFwiP3VzZXJuYW1lPVwiICsgdXNlcm5hbWUgKyBcIiZpZHM9XCIgKyBpZHM7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkpLCBvblJlamVjdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0SW1hZ2VPd25lcih1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIC8vIExhenkgZXZhbHVhdGlvblxyXG4gICAgICAgIGNvbnN0IGZpbmRPd25lciA9ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbmQoZ2V0U3RhdGUoKS51c2Vyc0luZm8udXNlcnMsICh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXNlci5Vc2VybmFtZSA9PSB1c2VybmFtZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3duZXIgPSBmaW5kT3duZXIoKTtcclxuXHJcbiAgICAgICAgaWYob3duZXIpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3duZXJJZCA9IG93bmVyLklEO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lcklkKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBnbG9iYWxzLnVybHMudXNlcnMgKyAnP3VzZXJuYW1lPScgKyB1c2VybmFtZTtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbih1c2VyID0+IGRpc3BhdGNoKGFkZFVzZXIodXNlcikpLCBvblJlamVjdClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvd25lciA9IGZpbmRPd25lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEltYWdlc093bmVyKG93bmVyLklEKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHByb21pc2VHZXRJbWFnZSA9IChpZCwgZ2V0U3RhdGUpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGltYWdlcyA9IGdldFN0YXRlKCkuaW1hZ2VzSW5mby5pbWFnZXM7XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBmaW5kKGltYWdlcywgKGltZykgPT4gaW1nLkltYWdlSUQgPT0gaWQpO1xyXG5cclxuICAgICAgICBpZihpbWFnZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlamVjdChFcnJvcihcIkltYWdlIGRvZXMgbm90IGV4aXN0IGxvY2FsbHkhXCIpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoU2luZ2xlSW1hZ2UoaWQpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCIvZ2V0YnlpZD9pZD1cIiArIGlkO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKCFpbWcpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJbWFnZSA9IG5vcm1hbGl6ZUltYWdlKGltZyk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRJbWFnZShub3JtYWxpemVkSW1hZ2UpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IFJvdywgQ29sLCBCdXR0b24gfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFySW5wdXQoZmlsZUlucHV0KSB7XHJcbiAgICAgICAgaWYoZmlsZUlucHV0LnZhbHVlKXtcclxuICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7IC8vZm9yIElFMTEsIGxhdGVzdCBDaHJvbWUvRmlyZWZveC9PcGVyYS4uLlxyXG4gICAgICAgICAgICB9Y2F0Y2goZXJyKXsgfVxyXG4gICAgICAgICAgICBpZihmaWxlSW5wdXQudmFsdWUpeyAvL2ZvciBJRTUgfiBJRTEwXHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gZmlsZUlucHV0LnBhcmVudE5vZGUsIHJlZiA9IGZpbGVJbnB1dC5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoZmlsZUlucHV0KTtcclxuICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZpbGVJbnB1dCxyZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEZpbGVzKCkge1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICByZXR1cm4gKGZpbGVzID8gZmlsZXMuZmlsZXMgOiBbXSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU3VibWl0KGUpIHtcclxuICAgICAgICBjb25zdCB7IHVwbG9hZEltYWdlLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLmdldEZpbGVzKCk7XHJcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gZmlsZXNbaV07XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhKTtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJJbnB1dChmaWxlSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGhhc0ltYWdlcywgZGVsZXRlU2VsZWN0ZWRJbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZm9ybS11cGxvYWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmN0eXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZpbGVzXCI+VXBsb2FkIGZpbGVyOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiZmlsZXNcIiBuYW1lPVwiZmlsZXNcIiBtdWx0aXBsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cInByaW1hcnlcIiB0eXBlPVwic3VibWl0XCI+VXBsb2FkPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeydcXHUwMEEwJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGJzU3R5bGU9XCJkYW5nZXJcIiBkaXNhYmxlZD17IWhhc0ltYWdlc30gb25DbGljaz17ZGVsZXRlU2VsZWN0ZWRJbWFnZXN9PlNsZXQgbWFya2VyZXQgYmlsbGVkZXI8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3hIYW5kbGVyID0gdGhpcy5jaGVja2JveEhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja2JveEhhbmRsZXIoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYWRkID0gZS5jdXJyZW50VGFyZ2V0LmNoZWNrZWQ7XHJcbiAgICAgICAgaWYoYWRkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYWRkU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB7IHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21tZW50SWNvbihjb3VudCkge1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gY291bnQgPT0gMCA/IFwiY29sLWxnLTYgdGV4dC1tdXRlZFwiIDogXCJjb2wtbGctNiB0ZXh0LXByaW1hcnlcIjtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBzdHlsZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiAgPGRpdiB7Li4uIHByb3BzfT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNvbW1lbnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IHtjb3VudH0gICBcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrYm94VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIGltYWdlSXNTZWxlY3RlZCwgaW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IGltYWdlSXNTZWxlY3RlZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICByZXR1cm4gKGNhbkVkaXQgPyBcclxuICAgICAgICAgICAgPENvbCBsZz17Nn0gY2xhc3NOYW1lPVwicHVsbC1yaWdodCB0ZXh0LXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgU2xldCA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DbGljaz17dGhpcy5jaGVja2JveEhhbmRsZXJ9IGNoZWNrZWQ9e2NoZWNrZWR9IC8+IFxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG5yZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IGltYWdlLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgIGxldCBjb3VudCA9IGltYWdlLkNvbW1lbnRDb3VudDtcclxuICAgIHJldHVybiAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZS5JbWFnZUlEfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZS5QcmV2aWV3VXJsfSBjbGFzc05hbWU9XCJpbWctdGh1bWJuYWlsXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2AvJHt1c2VybmFtZX0vZ2FsbGVyeS9pbWFnZS8ke2ltYWdlLkltYWdlSUR9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmNvbW1lbnRJY29uKGNvdW50KX0gXHJcbiAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLmNoZWNrYm94VmlldygpfVxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBJbWFnZSB9IGZyb20gJy4vSW1hZ2UnXHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuY29uc3QgZWxlbWVudHNQZXJSb3cgPSA0O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2VMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFycmFuZ2VBcnJheShpbWFnZXMpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSBpbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHRpbWVzID0gTWF0aC5jZWlsKGxlbmd0aCAvIGVsZW1lbnRzUGVyUm93KTtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGxldCBzdGFydCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aW1lczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0ID0gaSAqIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZW5kID4gbGVuZ3RoO1xyXG4gICAgICAgICAgICBpZihsYXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBpbWFnZXMuc2xpY2Uoc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGltYWdlcy5zbGljZShzdGFydCwgZW5kKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW1hZ2VzVmlldyhpbWFnZXMpIHtcclxuICAgICAgICBpZihpbWFnZXMubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHsgYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzLCBjYW5FZGl0LCBpbWFnZUlzU2VsZWN0ZWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYXJyYW5nZUFycmF5KGltYWdlcyk7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHJlc3VsdC5tYXAoKHJvdywgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpbWdzID0gcm93Lm1hcCgoaW1nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIDxDb2wgbGc9ezN9IGtleT17aW1nLkltYWdlSUR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U9e2ltZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZD17YWRkU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZD17cmVtb3ZlU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSXNTZWxlY3RlZD17aW1hZ2VJc1NlbGVjdGVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0lkID0gXCJyb3dJZFwiICsgaTtcclxuICAgICAgICAgICAgcmV0dXJuICA8Um93IGtleT17cm93SWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7aW1nc31cclxuICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMuaW1hZ2VzVmlldyhpbWFnZXMpfVxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuLy88ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4vLyAgICAgICAgICAgIHt0aGlzLmltYWdlc1ZpZXcoaW1hZ2VzKX1cclxuLy8gICAgICAgIDwvZGl2PiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyB1cGxvYWRJbWFnZSwgYWRkU2VsZWN0ZWRJbWFnZUlkLCAgZGVsZXRlSW1hZ2VzLCByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvaW1hZ2VzJ1xyXG5pbXBvcnQgeyBFcnJvciB9IGZyb20gJy4vRXJyb3InXHJcbmltcG9ydCB7IEltYWdlVXBsb2FkIH0gZnJvbSAnLi4vaW1hZ2VzL0ltYWdlVXBsb2FkJ1xyXG5pbXBvcnQgSW1hZ2VMaXN0IGZyb20gJy4uL2ltYWdlcy9JbWFnZUxpc3QnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3Qgb3duZXJJZCAgPSBzdGF0ZS5pbWFnZXNJbmZvLm93bmVySWQ7XHJcbiAgICBjb25zdCBjdXJyZW50SWQgPSBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZDtcclxuICAgIGNvbnN0IGNhbkVkaXQgPSAob3duZXJJZCA+IDAgJiYgY3VycmVudElkID4gMCAmJiBvd25lcklkID09IGN1cnJlbnRJZCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbWFnZXM6IHN0YXRlLmltYWdlc0luZm8uaW1hZ2VzLFxyXG4gICAgICAgIGNhbkVkaXQ6IGNhbkVkaXQsXHJcbiAgICAgICAgc2VsZWN0ZWRJbWFnZUlkczogc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWRzLFxyXG4gICAgICAgIGdldEZ1bGxuYW1lOiAodXNlcm5hbWUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vycy5maWx0ZXIodSA9PiB1LlVzZXJuYW1lLnRvVXBwZXJDYXNlKCkgPT0gdXNlcm5hbWUudG9VcHBlckNhc2UoKSlbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IGZ1bGxuYW1lID0gKHVzZXIpID8gdXNlci5GaXJzdE5hbWUgKyBcIiBcIiArIHVzZXIuTGFzdE5hbWUgOiAnVXNlcic7XHJcbiAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwbG9hZEltYWdlOiAodXNlcm5hbWUsIGZvcm1EYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgLy8gSW1hZ2VzIHRvIGJlIGRlbGV0ZWQgYnkgc2VsZWN0aW9uOlxyXG4gICAgICAgICAgICBkaXNwYXRjaChhZGRTZWxlY3RlZEltYWdlSWQoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEltYWdlcyB0byBiZSBkZWxldGVkIGJ5IHNlbGVjdGlvbjpcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJbWFnZXM6ICh1c2VybmFtZSwgaWRzKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgaWRzKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGVhclNlbGVjdGVkSW1hZ2VJZHM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXNlckltYWdlc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmltYWdlSXNTZWxlY3RlZCA9IHRoaXMuaW1hZ2VJc1NlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVTZWxlY3RlZEltYWdlcyA9IHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0ZWQgPSB0aGlzLmNsZWFyU2VsZWN0ZWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHJvdXRlciwgcm91dGUgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gdXNlcm5hbWUgKyBcIidzIGJpbGxlZGVyXCI7XHJcbiAgICAgICAgcm91dGVyLnNldFJvdXRlTGVhdmVIb29rKHJvdXRlLCB0aGlzLmNsZWFyU2VsZWN0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyU2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjbGVhclNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY2xlYXJTZWxlY3RlZEltYWdlSWRzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaW1hZ2VJc1NlbGVjdGVkKGNoZWNrSWQpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVzID0gZmluZChzZWxlY3RlZEltYWdlSWRzLCAoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkID09IGNoZWNrSWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlcyA/IHRydWUgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVTZWxlY3RlZEltYWdlcygpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMsIGRlbGV0ZUltYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBkZWxldGVJbWFnZXModXNlcm5hbWUsIHNlbGVjdGVkSW1hZ2VJZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwbG9hZFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCB1cGxvYWRJbWFnZSwgc2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCBoYXNJbWFnZXMgPSBzZWxlY3RlZEltYWdlSWRzLmxlbmd0aCA+IDA7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGNhbkVkaXQgPyBcclxuICAgICAgICAgICAgPEltYWdlVXBsb2FkXHJcbiAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZT17dXBsb2FkSW1hZ2V9XHJcbiAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICBkZWxldGVTZWxlY3RlZEltYWdlcz17dGhpcy5kZWxldGVTZWxlY3RlZEltYWdlc31cclxuICAgICAgICAgICAgICAgIGhhc0ltYWdlcz17aGFzSW1hZ2VzfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IGltYWdlcywgZ2V0RnVsbG5hbWUsIGNhbkVkaXQsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGZ1bGxOYW1lID0gZ2V0RnVsbG5hbWUodXNlcm5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICA8Q29sIGxnT2Zmc2V0PXsyfSBsZz17OH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMT48c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWNhcGl0YWxpemVcIj57ZnVsbE5hbWV9J3M8L3NwYW4+IDxzbWFsbD5iaWxsZWRlIGdhbGxlcmk8L3NtYWxsPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SW1hZ2VMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZXM9e2ltYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ9e2FkZFNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZD17cmVtb3ZlU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VJc1NlbGVjdGVkPXt0aGlzLmltYWdlSXNTZWxlY3RlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMudXBsb2FkVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFVzZXJJbWFnZXNSZWR1eCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFVzZXJJbWFnZXNDb250YWluZXIpO1xyXG5jb25zdCBVc2VySW1hZ2VzID0gd2l0aFJvdXRlcihVc2VySW1hZ2VzUmVkdXgpO1xyXG5leHBvcnQgZGVmYXVsdCBVc2VySW1hZ2VzOyIsIu+7v2ltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyBub3JtYWxpemVDb21tZW50LCB2aXNpdENvbW1lbnRzLCByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSAnLi91c2VycydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcblxyXG5leHBvcnQgY29uc3Qgc2V0U2tpcENvbW1lbnRzID0gKHNraXApID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0tJUF9DT01NRU5UUyxcclxuICAgICAgICBza2lwOiBza2lwXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0RGVmYXVsdFNraXAgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0RFRkFVTFRfU0tJUFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0RGVmYXVsdFRha2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0RFRkFVTFRfVEFLRVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0VGFrZUNvbW1lbnRzID0gKHRha2UpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVEFLRV9DT01NRU5UUyxcclxuICAgICAgICB0YWtlOiB0YWtlXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3VycmVudFBhZ2UocGFnZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9DVVJSRU5UX1BBR0UsXHJcbiAgICAgICAgcGFnZTogcGFnZVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFRvdGFsUGFnZXModG90YWxQYWdlcykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UT1RBTF9QQUdFUyxcclxuICAgICAgICB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0RGVmYXVsdENvbW1lbnRzID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9ERUZBVUxUX0NPTU1FTlRTXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNlaXZlZENvbW1lbnRzKGNvbW1lbnRzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfQ09NTUVOVFMsXHJcbiAgICAgICAgY29tbWVudHM6IGNvbW1lbnRzXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuY29tbWVudHMgKyBcIj9pbWFnZUlkPVwiICsgaW1hZ2VJZCArIFwiJnNraXA9XCIgKyBza2lwICsgXCImdGFrZT1cIiArIHRha2U7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFVucHJvY2Vzc2VkIGNvbW1lbnRzXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYWdlQ29tbWVudHMgPSBkYXRhLkN1cnJlbnRJdGVtcztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgKHJlLXNldCkgaW5mb1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2tpcENvbW1lbnRzKHNraXApKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2VDb21tZW50cyh0YWtlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRDdXJyZW50UGFnZShkYXRhLkN1cnJlbnRQYWdlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFBhZ2VzKGRhdGEuVG90YWxQYWdlcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFZpc2l0IGV2ZXJ5IGNvbW1lbnQgYW5kIGFkZCB0aGUgdXNlclxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWRkQXV0aG9yID0gKGMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZighYy5EZWxldGVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRVc2VyKGMuQXV0aG9yKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2aXNpdENvbW1lbnRzKHBhZ2VDb21tZW50cywgYWRkQXV0aG9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBOb3JtYWxpemU6IGZpbHRlciBvdXQgdXNlclxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tbWVudHMgPSBwYWdlQ29tbWVudHMubWFwKG5vcm1hbGl6ZUNvbW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2gocmVjZWl2ZWRDb21tZW50cyhjb21tZW50cykpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBwb3N0Q29tbWVudCA9IChpbWFnZUlkLCB0ZXh0LCBwYXJlbnRDb21tZW50SWQpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBnZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuY29tbWVudHM7XHJcblxyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPUpTT04uc3RyaW5naWZ5KHsgXHJcbiAgICAgICAgICAgIFRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgIEltYWdlSUQ6IGltYWdlSWQsXHJcbiAgICAgICAgICAgIFBhcmVudElEOiBwYXJlbnRDb21tZW50SWRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgYm9keTogYm9keSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGluY3JlbWVudENvbW1lbnRDb3VudChpbWFnZUlkKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZWRpdENvbW1lbnQgPSAoY29tbWVudElkLCBpbWFnZUlkLCB0ZXh0KSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBnZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuY29tbWVudHMgKyBcIj9pbWFnZUlkPVwiICsgaW1hZ2VJZDtcclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IElEOiBjb21tZW50SWQsIFRleHQ6IHRleHR9KSxcclxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVDb21tZW50ID0gKGNvbW1lbnRJZCwgaW1hZ2VJZCkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmNvbW1lbnRzICsgXCI/Y29tbWVudElkPVwiICsgY29tbWVudElkO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZGVjcmVtZW50Q29tbWVudENvdW50KGltYWdlSWQpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaW5jcmVtZW50Q29tbWVudENvdW50ID0gKGltYWdlSWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5JTkNSX0NPTU1FTlRfQ09VTlQsXHJcbiAgICAgICAgaW1hZ2VJZDogaW1hZ2VJZFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVjcmVtZW50Q29tbWVudENvdW50ID0gKGltYWdlSWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5ERUNSX0NPTU1FTlRfQ09VTlQsXHJcbiAgICAgICAgaW1hZ2VJZDogaW1hZ2VJZFxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50RGVsZXRlZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBsaWVzLCBoYW5kbGVycywgY29uc3RydWN0Q29tbWVudHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVwbHlOb2RlcyA9IGNvbnN0cnVjdENvbW1lbnRzKHJlcGxpZXMsIGhhbmRsZXJzKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhIHB1bGwtbGVmdCB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtbGVmdFwiIHN0eWxlPXt7bWluV2lkdGg6IFwiNzRweFwifX0+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c21hbGw+c2xldHRldDwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAge3JlcGx5Tm9kZXN9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmNvbnN0IGlkcyA9IChjb21tZW50SWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVwbHlJZDogY29tbWVudElkICsgJ19yZXBseScsXHJcbiAgICAgICAgZWRpdElkOiBjb21tZW50SWQgKyAnX2VkaXQnLFxyXG4gICAgICAgIGRlbGV0ZUlkOiBjb21tZW50SWQgKyAnX2RlbGV0ZScsXHJcbiAgICAgICAgZWRpdENvbGxhcHNlOiBjb21tZW50SWQgKyAnX2VkaXRDb2xsYXBzZScsXHJcbiAgICAgICAgcmVwbHlDb2xsYXBzZTogY29tbWVudElkICsgJ19yZXBseUNvbGxhcHNlJ1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnRDb250cm9scyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICB0ZXh0OiBwcm9wcy50ZXh0LFxyXG4gICAgICAgICAgICByZXBseTogJydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVkaXQgPSB0aGlzLmVkaXQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnJlcGx5ID0gdGhpcy5yZXBseS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVwbHlDaGFuZ2UgPSB0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdCgpIHtcclxuICAgICAgICBjb25zdCB7IGVkaXRIYW5kbGUsIGNvbW1lbnRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0Q29sbGFwc2UgfSA9IGlkcyhjb21tZW50SWQpO1xyXG5cclxuICAgICAgICBlZGl0SGFuZGxlKGNvbW1lbnRJZCwgdGV4dCk7XHJcbiAgICAgICAgJChcIiNcIiArIGVkaXRDb2xsYXBzZSkuY29sbGFwc2UoJ2hpZGUnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXBseSgpIHtcclxuICAgICAgICBjb25zdCB7IHJlcGx5SGFuZGxlLCBjb21tZW50SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyByZXBseSB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBjb25zdCB7IHJlcGx5Q29sbGFwc2UgfSA9IGlkcyhjb21tZW50SWQpO1xyXG5cclxuICAgICAgICByZXBseUhhbmRsZShjb21tZW50SWQsIHJlcGx5KTtcclxuICAgICAgICAkKFwiI1wiICsgcmVwbHlDb2xsYXBzZSkuY29sbGFwc2UoJ2hpZGUnKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6ICcnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dUb29sdGlwKGl0ZW0pIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBidG4gPSBcIiNcIiArIGNvbW1lbnRJZCArIFwiX1wiICsgaXRlbTtcclxuICAgICAgICAkKGJ0bikudG9vbHRpcCgnc2hvdycpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVRleHRDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0ZXh0OiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVSZXBseUNoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5OiBlLnRhcmdldC52YWx1ZSB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQsIGNvbW1lbnRJZCwgY2FuRWRpdCwgZGVsZXRlSGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdENvbGxhcHNlLCByZXBseUNvbGxhcHNlLCByZXBseUlkLCBlZGl0SWQsIGRlbGV0ZUlkIH0gPSBpZHMoY29tbWVudElkKTtcclxuICAgICAgICBjb25zdCBlZGl0VGFyZ2V0ID0gXCIjXCIgKyBlZGl0Q29sbGFwc2U7XHJcbiAgICAgICAgY29uc3QgcmVwbHlUYXJnZXQgPSBcIiNcIiArIHJlcGx5Q29sbGFwc2U7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGNhbkVkaXQgP1xyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17e3BhZGRpbmdCb3R0b206ICc1cHgnLCBwYWRkaW5nTGVmdDogXCIxNXB4XCJ9fT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIG9uQ2xpY2s9e2RlbGV0ZUhhbmRsZS5iaW5kKG51bGwsIGNvbW1lbnRJZCl9IHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e3RoaXMuc2hvd1Rvb2x0aXAuYmluZCh0aGlzLCAnZGVsZXRlJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17ZGVsZXRlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTbGV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLWRhbmdlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2hcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+eydcXHUwMEEwJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtlZGl0VGFyZ2V0fSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ2VkaXQnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtlZGl0SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCLDhm5kcmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtc3VjY2Vzc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tcGVuY2lsXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPnsnXFx1MDBBMCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17cmVwbHlUYXJnZXR9IHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e3RoaXMuc2hvd1Rvb2x0aXAuYmluZCh0aGlzLCAncmVwbHknKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtyZXBseUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiU3ZhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsYWJlbCBsYWJlbC1wcmltYXJ5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lbnZlbG9wZVwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7cGFkZGluZ0JvdHRvbTogJzVweCd9fT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctMTAgY29sbGFwc2VcIiBpZD17ZWRpdENvbGxhcHNlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHZhbHVlPXt0aGlzLnN0YXRlLnRleHR9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRleHRDaGFuZ2V9IHJvd3M9XCI0XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHt0ZXh0OiB0ZXh0fSl9IGRhdGEtdGFyZ2V0PXtlZGl0VGFyZ2V0fSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1pbmZvXCIgb25DbGljaz17dGhpcy5lZGl0fT5HZW0gw6ZuZHJpbmdlcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMCBjb2xsYXBzZVwiIGlkPXtyZXBseUNvbGxhcHNlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHZhbHVlPXt0aGlzLnN0YXRlLnJlcGx5fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVSZXBseUNoYW5nZX0gcm93cz1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtyZXBseVRhcmdldH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4taW5mb1wiIG9uQ2xpY2s9e3RoaXMucmVwbHl9PlN2YXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj4gOiBcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4JywgcGFkZGluZ0xlZnQ6ICcxNXB4J319PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtyZXBseVRhcmdldH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ3JlcGx5Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17cmVwbHlJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlN2YXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtcHJpbWFyeVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tZW52ZWxvcGVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctMTAgY29sbGFwc2VcIiBpZD17cmVwbHlDb2xsYXBzZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS5yZXBseX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVwbHlDaGFuZ2V9IHJvd3M9XCI0XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17cmVwbHlUYXJnZXR9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiPkx1azwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWluZm9cIiBvbkNsaWNrPXt0aGlzLnJlcGx5fT5TdmFyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IENvbW1lbnRDb250cm9scyB9IGZyb20gJy4vQ29tbWVudENvbnRyb2xzJ1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gJy4vQ29tbWVudFByb2ZpbGUnXHJcbmltcG9ydCB7IGZvcm1hdFRleHQsIHRpbWVUZXh0IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudElkLCBwb3N0ZWRPbiwgYXV0aG9ySWQsIHRleHQsIHJlcGxpZXMsIGhhbmRsZXJzLCBjb25zdHJ1Y3RDb21tZW50cyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHJlcGx5SGFuZGxlLCBlZGl0SGFuZGxlLCBkZWxldGVIYW5kbGUsIGNhbkVkaXQsIGdldFVzZXIgfSA9IGhhbmRsZXJzO1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IGdldFVzZXIoYXV0aG9ySWQpO1xyXG4gICAgICAgIGNvbnN0IGZ1bGxuYW1lID0gYXV0aG9yLkZpcnN0TmFtZSArIFwiIFwiICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgICAgIGNvbnN0IGNhbkVkaXRWYWwgPSBjYW5FZGl0KGF1dGhvcklkKTtcclxuICAgICAgICBjb25zdCByZXBseU5vZGVzID0gY29uc3RydWN0Q29tbWVudHMocmVwbGllcywgaGFuZGxlcnMpO1xyXG4gICAgICAgIGNvbnN0IHR4dCA9IGZvcm1hdFRleHQodGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEgcHVsbC1sZWZ0IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50UHJvZmlsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwibWVkaWEtaGVhZGluZ1wiPjxzdHJvbmc+e2Z1bGxuYW1lfTwvc3Ryb25nPiA8UG9zdGVkT24gcG9zdGVkT249e3Bvc3RlZE9ufSAvPjwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt0eHR9Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRDb250cm9sc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdFZhbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRJZD17Y29tbWVudElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlSGFuZGxlPXtkZWxldGVIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0SGFuZGxlPXtlZGl0SGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbHlIYW5kbGU9e3JlcGx5SGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17dGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3JlcGx5Tm9kZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFBvc3RlZE9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFnbygpIHtcclxuICAgICAgICBjb25zdCB7IHBvc3RlZE9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB0aW1lVGV4dChwb3N0ZWRPbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoPHNtYWxsPnNhZ2RlIHt0aGlzLmFnbygpfTwvc21hbGw+KTtcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IENvbW1lbnREZWxldGVkIH0gZnJvbSAnLi9Db21tZW50RGVsZXRlZCdcclxuaW1wb3J0IHsgQ29tbWVudCB9IGZyb20gJy4vQ29tbWVudCdcclxuXHJcbmNvbnN0IGNvbXBhY3RIYW5kbGVycyA9IChyZXBseUhhbmRsZSwgZWRpdEhhbmRsZSwgZGVsZXRlSGFuZGxlLCBjYW5FZGl0LCBnZXRVc2VyKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlcGx5SGFuZGxlLFxyXG4gICAgICAgIGVkaXRIYW5kbGUsXHJcbiAgICAgICAgZGVsZXRlSGFuZGxlLFxyXG4gICAgICAgIGNhbkVkaXQsXHJcbiAgICAgICAgZ2V0VXNlclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudExpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0Q29tbWVudHMoY29tbWVudHMsIGhhbmRsZXJzKSB7XHJcbiAgICAgICAgaWYgKCFjb21tZW50cyB8fCBjb21tZW50cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICByZXR1cm4gY29tbWVudHMubWFwKChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IFwiY29tbWVudElkXCIgKyBjb21tZW50LkNvbW1lbnRJRDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb21tZW50LkRlbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYVwiIGtleT17a2V5fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbW1lbnREZWxldGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtrZXl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxpZXM9e2NvbW1lbnQuUmVwbGllc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVycz17aGFuZGxlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0Q29tbWVudHM9e2NvbnN0cnVjdENvbW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYVwiIGtleT17a2V5fT5cclxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17a2V5fSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0ZWRPbj17Y29tbWVudC5Qb3N0ZWRPbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3JJZD17Y29tbWVudC5BdXRob3JJRH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e2NvbW1lbnQuVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsaWVzPXtjb21tZW50LlJlcGxpZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudElkPXtjb21tZW50LkNvbW1lbnRJRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVycz17aGFuZGxlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0Q29tbWVudHM9e2NvbnN0cnVjdENvbW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudHMsIHJlcGx5SGFuZGxlLCBlZGl0SGFuZGxlLCBkZWxldGVIYW5kbGUsIGNhbkVkaXQsIGdldFVzZXIsIHVzZXJJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBoYW5kbGVycyA9IGNvbXBhY3RIYW5kbGVycyhyZXBseUhhbmRsZSwgZWRpdEhhbmRsZSwgZGVsZXRlSGFuZGxlLCBjYW5FZGl0LCBnZXRVc2VyKTtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMuY29uc3RydWN0Q29tbWVudHMoY29tbWVudHMsIGhhbmRsZXJzKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAge25vZGVzfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhZ2luYXRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcHJldlZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjdXJyZW50UGFnZSwgcHJldiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBoYXNQcmV2ID0gIShjdXJyZW50UGFnZSA9PT0gMSk7XHJcbiAgICAgICAgaWYgKGhhc1ByZXYpXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgb25DbGljaz17cHJldn0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JmxhcXVvOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT4pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJkaXNhYmxlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZsYXF1bzs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBjdXJyZW50UGFnZSwgbmV4dCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBoYXNOZXh0ID0gISh0b3RhbFBhZ2VzID09PSBjdXJyZW50UGFnZSkgJiYgISh0b3RhbFBhZ2VzID09PSAwKTtcclxuICAgICAgICBpZihoYXNOZXh0KVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGFyaWEtbGFiZWw9XCJOZXh0XCIgb25DbGljaz17bmV4dH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnJhcXVvOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT4pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJkaXNhYmxlZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZyYXF1bzs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG90YWxQYWdlcywgaW1hZ2VJZCwgY3VycmVudFBhZ2UsIGdldFBhZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbGV0IHBhZ2VzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gdG90YWxQYWdlczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IFwicGFnZV9pdGVtX1wiICsgKGltYWdlSWQgKyBpKTtcclxuICAgICAgICAgICAgaWYgKGkgPT09IGN1cnJlbnRQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKDxsaSBjbGFzc05hbWU9XCJhY3RpdmVcIiBrZXk9e2tleX0+PGEgaHJlZj1cIiNcIiBrZXk9e2tleSB9PntpfTwvYT48L2xpPik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKDxsaSBrZXk9e2tleSB9IG9uQ2xpY2s9e2dldFBhZ2UuYmluZChudWxsLCBpKX0+PGEgaHJlZj1cIiNcIiBrZXk9e2tleSB9PntpfTwvYT48L2xpPik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3cgPSAocGFnZXMubGVuZ3RoID4gMCk7XHJcblxyXG4gICAgICAgIHJldHVybihcclxuICAgICAgICAgICAgc2hvdyA/XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctOVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxuYXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwicGFnaW5hdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByZXZWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3BhZ2VzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLm5leHRWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbmF2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnRGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIFRleHQ6ICcnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3N0Q29tbWVudCA9IHRoaXMucG9zdENvbW1lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0Q29tbWVudChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHBvc3RIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcG9zdEhhbmRsZSh0aGlzLnN0YXRlLlRleHQpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUZXh0OiAnJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGV4dDogZS50YXJnZXQudmFsdWUgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMucG9zdENvbW1lbnR9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJyZW1hcmtcIj5Lb21tZW50YXI8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRleHRDaGFuZ2V9IHZhbHVlPXt0aGlzLnN0YXRlLlRleHR9IHBsYWNlaG9sZGVyPVwiU2tyaXYga29tbWVudGFyIGhlci4uLlwiIGlkPVwicmVtYXJrXCIgcm93cz1cIjRcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIj5TZW5kPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBmZXRjaENvbW1lbnRzLCBwb3N0Q29tbWVudCwgZWRpdENvbW1lbnQsIGRlbGV0ZUNvbW1lbnQgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2NvbW1lbnRzJ1xyXG5pbXBvcnQgeyBDb21tZW50TGlzdCB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRMaXN0J1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBQYWdpbmF0aW9uIH0gZnJvbSAnLi4vY29tbWVudHMvUGFnaW5hdGlvbidcclxuaW1wb3J0IHsgQ29tbWVudEZvcm0gfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50Rm9ybSdcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbWFnZUlkOiBzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCxcclxuICAgICAgICBza2lwOiBzdGF0ZS5jb21tZW50c0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS5jb21tZW50c0luZm8udGFrZSxcclxuICAgICAgICBwYWdlOiBzdGF0ZS5jb21tZW50c0luZm8ucGFnZSxcclxuICAgICAgICB0b3RhbFBhZ2VzOiBzdGF0ZS5jb21tZW50c0luZm8udG90YWxQYWdlcyxcclxuICAgICAgICBjb21tZW50czogc3RhdGUuY29tbWVudHNJbmZvLmNvbW1lbnRzLFxyXG4gICAgICAgIGdldFVzZXI6IChpZCkgPT4gZmluZChzdGF0ZS51c2Vyc0luZm8udXNlcnMsICh1KSA9PiB1LklEID09IGlkKSxcclxuICAgICAgICBjYW5FZGl0OiAodXNlcklkKSA9PiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZCA9PSB1c2VySWQsXHJcbiAgICAgICAgdXNlcklkOiBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZFxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzOiAoaW1hZ2VJZCwgc2tpcCwgdGFrZSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RSZXBseTogKGltYWdlSWQsIHJlcGx5SWQsIHRleHQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQoaW1hZ2VJZCwgdGV4dCwgcmVwbHlJZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdENvbW1lbnQ6IChpbWFnZUlkLCB0ZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHBvc3RDb21tZW50KGltYWdlSWQsIHRleHQsIG51bGwpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVkaXRDb21tZW50OiAoaW1hZ2VJZCwgY29tbWVudElkLCB0ZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGVkaXRDb21tZW50KGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlQ29tbWVudDogKGltYWdlSWQsIGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVDb21tZW50KGNvbW1lbnRJZCwgaW1hZ2VJZCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ29tbWVudHNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5uZXh0UGFnZSA9IHRoaXMubmV4dFBhZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmdldFBhZ2UgPSB0aGlzLmdldFBhZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUGFnZSA9IHRoaXMucHJldmlvdXNQYWdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dFBhZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGltYWdlSWQsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgc2tpcE5leHQgPSBza2lwICsgdGFrZTtcclxuICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcE5leHQsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhZ2UocGFnZSkge1xyXG4gICAgICAgIGNvbnN0IHsgbG9hZENvbW1lbnRzLCBpbWFnZUlkLCB0YWtlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHNraXBQYWdlcyA9IHBhZ2UgLSAxO1xyXG4gICAgICAgIGNvbnN0IHNraXBJdGVtcyA9IChza2lwUGFnZXMgKiB0YWtlKTtcclxuICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcEl0ZW1zLCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmV2aW91c1BhZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGltYWdlSWQsIHNraXAsIHRha2V9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBiYWNrU2tpcCA9IHNraXAgLSB0YWtlO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBiYWNrU2tpcCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGltYWdlSWQsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRzLCBwb3N0UmVwbHksIGVkaXRDb21tZW50LCBwb3N0Q29tbWVudCxcclxuICAgICAgICAgICAgICAgIGRlbGV0ZUNvbW1lbnQsIGNhbkVkaXQsIGdldFVzZXIsXHJcbiAgICAgICAgICAgICAgICB1c2VySWQsIGltYWdlSWQsIHBhZ2UsIHRvdGFsUGFnZXMgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudExpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzPXtjb21tZW50c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGx5SGFuZGxlPXtwb3N0UmVwbHkuYmluZChudWxsLCBpbWFnZUlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRIYW5kbGU9e2VkaXRDb21tZW50LmJpbmQobnVsbCwgaW1hZ2VJZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVIYW5kbGU9e2RlbGV0ZUNvbW1lbnQuYmluZChudWxsLCBpbWFnZUlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRVc2VyPXtnZXRVc2VyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8UGFnaW5hdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VJZD17aW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlPXtwYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlcz17dG90YWxQYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQ9e3RoaXMubmV4dFBhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2PXt0aGlzLnByZXZpb3VzUGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFBhZ2U9e3RoaXMuZ2V0UGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudEZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RIYW5kbGU9e3Bvc3RDb21tZW50LmJpbmQobnVsbCwgaW1hZ2VJZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IENvbW1lbnRzID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoQ29tbWVudHNDb250YWluZXIpOyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcclxuaW1wb3J0IHsgc2V0U2VsZWN0ZWRJbWcsIGZldGNoU2luZ2xlSW1hZ2UsIGRlbGV0ZUltYWdlIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9pbWFnZXMnXHJcbmltcG9ydCB7IHNldEVycm9yIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IHsgQ29tbWVudHMgfSBmcm9tICcuLi9jb250YWluZXJzL0NvbW1lbnRzJ1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBNb2RhbCwgSW1hZ2UsIEJ1dHRvbiwgQnV0dG9uVG9vbGJhciB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3Qgb3duZXJJZCAgPSBzdGF0ZS5pbWFnZXNJbmZvLm93bmVySWQ7XHJcbiAgICBjb25zdCBjdXJyZW50SWQgPSBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZDtcclxuICAgIGNvbnN0IGNhbkVkaXQgPSAob3duZXJJZCA+IDAgJiYgY3VycmVudElkID4gMCAmJiBvd25lcklkID09IGN1cnJlbnRJZCk7XHJcblxyXG4gICAgY29uc3QgZ2V0SW1hZ2UgPSAoaWQpID0+IHtcclxuICAgICAgICByZXR1cm4gZmluZChzdGF0ZS5pbWFnZXNJbmZvLmltYWdlcywgaW1hZ2UgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaW1hZ2UuSW1hZ2VJRCA9PSBpZDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaW1hZ2UgPSAoKSA9PiBnZXRJbWFnZShzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCk7XHJcbiAgICBjb25zdCBmaWxlbmFtZSA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuRmlsZW5hbWU7IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IHByZXZpZXdVcmwgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLlByZXZpZXdVcmw7IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IGV4dGVuc2lvbiA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuRXh0ZW5zaW9uOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCBvcmlnaW5hbFVybCA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuT3JpZ2luYWxVcmw7IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IHVwbG9hZGVkID0gKCkgPT4geyBpZihpbWFnZSgpKSByZXR1cm4gaW1hZ2UoKS5VcGxvYWRlZDsgcmV0dXJuIG5ldyBEYXRlKCk7IH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjYW5FZGl0OiBjYW5FZGl0LFxyXG4gICAgICAgIGhhc0ltYWdlOiBCb29sZWFuKGdldEltYWdlKHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkKSksXHJcbiAgICAgICAgZmlsZW5hbWU6IGZpbGVuYW1lKCksXHJcbiAgICAgICAgcHJldmlld1VybDogcHJldmlld1VybCgpLFxyXG4gICAgICAgIGV4dGVuc2lvbjogZXh0ZW5zaW9uKCksXHJcbiAgICAgICAgb3JpZ2luYWxVcmw6IG9yaWdpbmFsVXJsKCksXHJcbiAgICAgICAgdXBsb2FkZWQ6IHVwbG9hZGVkKClcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNldFNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXNlbGVjdEltYWdlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKHVuZGVmaW5lZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0RXJyb3I6IChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihlcnJvcikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmV0Y2hJbWFnZTogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoU2luZ2xlSW1hZ2UoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUltYWdlOiAoaWQsIHVzZXJuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUltYWdlKGlkLCB1c2VybmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTW9kYWxJbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUltYWdlID0gdGhpcy5kZWxldGVJbWFnZS5iaW5kKHRoaXMpOyBcclxuICAgICAgICB0aGlzLm9wZW4gPSB0aGlzLm9wZW4uYmluZCh0aGlzKTsgXHJcbiAgICAgICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTsgXHJcbiAgICB9XHJcblxyXG4gICAgb3BlbigpIHtcclxuICAgICAgICBjb25zdCB7IGhhc0ltYWdlLCBzZXRFcnJvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZihoYXNJbWFnZSkgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIHNldEVycm9yKHtcclxuICAgICAgICAgICAgdGl0bGU6ICdPb3BzIHNvbWV0aGluZyB3ZW50IHdyb25nJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0NvdWxkIG5vdCBmaW5kIHRoZSBpbWFnZSwgbWF5YmUgdGhlIFVSTCBpcyBpbnZhbGlkIG9yIGl0IGhhcyBiZWVuIGRlbGV0ZWQhJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlc2VsZWN0SW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuXHJcbiAgICAgICAgZGVzZWxlY3RJbWFnZSgpO1xyXG4gICAgICAgIGNvbnN0IGdhbGxlcnlVcmwgPSAnLycgKyB1c2VybmFtZSArICcvZ2FsbGVyeSc7XHJcbiAgICAgICAgcHVzaChnYWxsZXJ5VXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJbWFnZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgaWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuXHJcbiAgICAgICAgZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKTtcclxuICAgICAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUltYWdlVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgY2FuRWRpdCA/XHJcbiAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cImRhbmdlclwiIG9uQ2xpY2s9e3RoaXMuZGVsZXRlSW1hZ2V9PlNsZXQgYmlsbGVkZTwvQnV0dG9uPlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgICAgICAgICAgcmVuZGVyKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyBmaWxlbmFtZSwgcHJldmlld1VybCwgZXh0ZW5zaW9uLCBvcmlnaW5hbFVybCwgdXBsb2FkZWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gZmlsZW5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVwbG9hZERhdGUgPSBtb21lbnQodXBsb2FkZWQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IFwiVXBsb2FkZWQgZC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICA8TW9kYWwgc2hvdz17dGhpcy5vcGVuKCl9IG9uSGlkZT17dGhpcy5jbG9zZX0gYnNTaXplPVwibGFyZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbC5IZWFkZXIgY2xvc2VCdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsLlRpdGxlPntuYW1lfTxzcGFuPjxzbWFsbD4gLSB7ZGF0ZVN0cmluZ308L3NtYWxsPjwvc3Bhbj48L01vZGFsLlRpdGxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5IZWFkZXI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17b3JpZ2luYWxVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbWFnZSBzcmM9e3ByZXZpZXdVcmx9IHJlc3BvbnNpdmUvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTW9kYWwuQm9keT5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWwuRm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50cyAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Ub29sYmFyIHN0eWxlPXt7ZmxvYXQ6IFwicmlnaHRcIn19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5kZWxldGVJbWFnZVZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXt0aGlzLmNsb3NlfT5MdWs8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvblRvb2xiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5Gb290ZXI+XHJcbiAgICAgICAgICAgICAgICA8L01vZGFsPlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBTZWxlY3RlZEltYWdlUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShNb2RhbEltYWdlKTtcclxuY29uc3QgU2VsZWN0ZWRJbWFnZSA9IHdpdGhSb3V0ZXIoU2VsZWN0ZWRJbWFnZVJlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0ZWRJbWFnZTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IGNvbm5lY3QsIFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZXMvc3RvcmUnXHJcbmltcG9ydCB7IFJvdXRlciwgUm91dGUsIEluZGV4Um91dGUsIGJyb3dzZXJIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBmZXRjaEN1cnJlbnRVc2VyIH0gZnJvbSAnLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgTWFpbiBmcm9tICcuL2NvbXBvbmVudHMvTWFpbidcclxuaW1wb3J0IEFib3V0IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL0Fib3V0J1xyXG5pbXBvcnQgSG9tZSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9Ib21lJ1xyXG5pbXBvcnQgVXNlcnMgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlcnMnXHJcbmltcG9ydCBVc2VySW1hZ2VzIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJJbWFnZXMnXHJcbmltcG9ydCBTZWxlY3RlZEltYWdlIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UnXHJcbmltcG9ydCB7IGZldGNoVXNlckltYWdlcywgc2V0U2VsZWN0ZWRJbWcsIGZldGNoU2luZ2xlSW1hZ2UsIHNldEltYWdlT3duZXIgfSBmcm9tICcuL2FjdGlvbnMvaW1hZ2VzJ1xyXG5cclxuc3RvcmUuZGlzcGF0Y2goZmV0Y2hDdXJyZW50VXNlcihnbG9iYWxzLmN1cnJlbnRVc2VybmFtZSkpO1xyXG5tb21lbnQubG9jYWxlKCdkYScpO1xyXG5cclxuY29uc3Qgc2VsZWN0SW1hZ2UgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBpbWFnZUlkID0gbmV4dFN0YXRlLnBhcmFtcy5pZDtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKGltYWdlSWQpKTtcclxufVxyXG5cclxuY29uc3QgZmV0Y2hJbWFnZXMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IG5leHRTdGF0ZS5wYXJhbXMudXNlcm5hbWU7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRJbWFnZU93bmVyKHVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTtcclxufVxyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICAgICAgPFJvdXRlciBoaXN0b3J5PXticm93c2VySGlzdG9yeX0+XHJcbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGNvbXBvbmVudD17TWFpbn0+XHJcbiAgICAgICAgICAgICAgICA8SW5kZXhSb3V0ZSBjb21wb25lbnQ9e0hvbWV9IC8+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cInVzZXJzXCIgY29tcG9uZW50PXtVc2Vyc30gLz5cclxuICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiYWJvdXRcIiBjb21wb25lbnQ9e0Fib3V0fSAvPlxyXG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCI6dXNlcm5hbWUvZ2FsbGVyeVwiIGNvbXBvbmVudD17VXNlckltYWdlc30gb25FbnRlcj17ZmV0Y2hJbWFnZXN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiaW1hZ2UvOmlkXCIgY29tcG9uZW50PXtTZWxlY3RlZEltYWdlfSBvbkVudGVyPXtzZWxlY3RJbWFnZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgPC9Sb3V0ZXI+XHJcbiAgICA8L1Byb3ZpZGVyPixcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykpO1xyXG5cclxuLy88Um91dGUgcGF0aD1cImNvbW1lbnQvOmNpZFwiIGNvbXBvbmVudD17J1NpbmdsZSBDb21tZW50J30gb25FbnRlcj17J2ZldGNoU2luZ2xlQ29tbWVudENoYWluPyd9IC8+XHJcbi8vPFJvdXRlIHBhdGg9XCJjb21tZW50c1wiIGNvbXBvbmVudD17J0NvbW1lbnRzJ30gb25FbnRlcj17J2ZldGNoQ29tbWVudHMnfSAvPiJdLCJuYW1lcyI6WyJjb25zdCIsIlQuU0VUX0VSUk9SX1RJVExFIiwiVC5DTEVBUl9FUlJPUl9USVRMRSIsIlQuU0VUX0VSUk9SX01FU1NBR0UiLCJULkNMRUFSX0VSUk9SX01FU1NBR0UiLCJULlNFVF9IQVNfRVJST1IiLCJsZXQiLCJULkFERF9VU0VSIiwiVC5SRUNJRVZFRF9VU0VSUyIsIlQuU0VUX0NVUlJFTlRfVVNFUl9JRCIsImNvbWJpbmVSZWR1Y2VycyIsIlQuU0VUX0lNQUdFU19PV05FUiIsIlQuQUREX0lNQUdFIiwiVC5SRUNJRVZFRF9VU0VSX0lNQUdFUyIsIlQuUkVNT1ZFX0lNQUdFIiwiVC5JTkNSX0NPTU1FTlRfQ09VTlQiLCJULkRFQ1JfQ09NTUVOVF9DT1VOVCIsIlQuU0VUX1NFTEVDVEVEX0lNRyIsIlQuQUREX1NFTEVDVEVEX0lNQUdFX0lEIiwiVC5SRU1PVkVfU0VMRUNURURfSU1BR0VfSUQiLCJmaWx0ZXIiLCJULkNMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyIsIlQuUkVDSUVWRURfQ09NTUVOVFMiLCJULlNFVF9TS0lQX0NPTU1FTlRTIiwiVC5TRVRfVEFLRV9DT01NRU5UUyIsIlQuU0VUX0NVUlJFTlRfUEFHRSIsIlQuU0VUX1RPVEFMX1BBR0VTIiwibWVzc2FnZSIsInNraXAiLCJULlNFVF9TS0lQX1dIQVRTX05FVyIsInRha2UiLCJULlNFVF9UQUtFX1dIQVRTX05FVyIsInBhZ2UiLCJULlNFVF9QQUdFX1dIQVRTX05FVyIsInRvdGFsUGFnZXMiLCJULlNFVF9UT1RBTF9QQUdFU19XSEFUU19ORVciLCJULkFERF9MQVRFU1QiLCJjcmVhdGVTdG9yZSIsImFwcGx5TWlkZGxld2FyZSIsInN1cGVyIiwiTGluayIsIkluZGV4TGluayIsIkVycm9yIiwiUm93IiwiQ29sIiwiQWxlcnQiLCJHcmlkIiwiTmF2YmFyIiwiTmF2IiwiY29ubmVjdCIsIk1lZGlhIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwibWFwU3RhdGVUb1Byb3BzIiwiZmluZCIsIkp1bWJvdHJvbiIsIlBhZ2VIZWFkZXIiLCJCdXR0b24iLCJJbWFnZSIsInJvdyIsIndpdGhSb3V0ZXIiLCJzZXRUb3RhbFBhZ2VzIiwidGhpcyIsIk1vZGFsIiwiQnV0dG9uVG9vbGJhciIsIlByb3ZpZGVyIiwiUm91dGVyIiwiYnJvd3Nlckhpc3RvcnkiLCJSb3V0ZSIsIklu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