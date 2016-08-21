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
                    React.createElement( reactBootstrap.Image, { src: image.PreviewUrl, thumbnail: true })
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

        return  React.createElement( 'div', { className: "text-left" }, 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 1, lg: 11 }, 
                            React.createElement( CommentList, {
                                comments: comments, replyHandle: postReply.bind(null, imageId), editHandle: editComment.bind(null, imageId), deleteHandle: deleteComment.bind(null, imageId), canEdit: canEdit, getUser: getUser })
                        )
                    ), 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( Pagination, {
                                imageId: imageId, currentPage: page, totalPages: totalPages, next: this.nextPage, prev: this.previousPage, getPage: this.getPage })
                    ), 
                    React.createElement( 'hr', null ), 
                    React.createElement( reactBootstrap.Row, null, 
                        React.createElement( reactBootstrap.Col, { lgOffset: 1, lg: 10 }, 
                            React.createElement( CommentForm, { postHandle: postComment.bind(null, imageId) })
                        )
                    )
                )

    };

    return CommentsContainer;
}(React.Component));

var Comments = reactRedux.connect(mapStateToProps$5, mapDispatchToProps$5)(CommentsContainer);
            //<div>
            //    <div className="row">
            //        <div className="col-lg-offset-1 col-lg-11">
            //        </div>
            //    </div>
            //    <div className="row text-left">
            //        <Pagination
            //                imageId={imageId}
            //                currentPage={page}
            //                totalPages={totalPages}
            //                next={this.nextPage}
            //                prev={this.previousPage}
            //                getPage={this.getPage}
            //        />
            //    </div>
            //    <hr />
            //    <div className="row text-left">
            //        <div className="col-lg-offset-1 col-lg-10">
            //            <CommentForm
            //                postHandle={postComment.bind(null, imageId)}
            //            />
            //        </div>
            //    </div>
            //</div>

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbnN0YW50cy90eXBlcy5qcyIsImFjdGlvbnMvZXJyb3IuanMiLCJ1dGlsaXRpZXMvdXRpbHMuanMiLCJyZWR1Y2Vycy91c2Vycy5qcyIsInJlZHVjZXJzL2ltYWdlcy5qcyIsInJlZHVjZXJzL2NvbW1lbnRzLmpzIiwicmVkdWNlcnMvZXJyb3IuanMiLCJyZWR1Y2Vycy9zdGF0dXMuanMiLCJyZWR1Y2Vycy93aGF0c25ldy5qcyIsInJlZHVjZXJzL3Jvb3QuanMiLCJzdG9yZXMvc3RvcmUuanMiLCJjb25zdGFudHMvY29uc3RhbnRzLmpzIiwiYWN0aW9ucy91c2Vycy5qcyIsImNvbXBvbmVudHMvd3JhcHBlcnMvTGlua3MuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRXJyb3IuanMiLCJjb21wb25lbnRzL01haW4uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJhY3Rpb25zL3doYXRzbmV3LmpzIiwiY29tcG9uZW50cy9XaGF0c05ldy9XaGF0c05ld0l0ZW1JbWFnZS5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3TGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9XaGF0c05ldy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Ib21lLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2Vycy5qcyIsImFjdGlvbnMvaW1hZ2VzLmpzIiwiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VVcGxvYWQuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzLmpzIiwiYWN0aW9ucy9jb21tZW50cy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudERlbGV0ZWQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRDb250cm9scy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudC5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudExpc3QuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL1BhZ2luYXRpb24uanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRGb3JtLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL0NvbW1lbnRzLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gSW1hZ2UgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX0lNRyA9ICdTRVRfU0VMRUNURURfSU1HJztcclxuZXhwb3J0IGNvbnN0IFVOU0VUX1NFTEVDVEVEX0lNRyA9ICdVTlNFVF9TRUxFQ1RFRF9JTUcnO1xyXG5leHBvcnQgY29uc3QgQUREX0lNQUdFID0gJ0FERF9JTUFHRSc7XHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfSU1BR0UgPSAnUkVNT1ZFX0lNQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9JTUFHRVNfT1dORVIgPSAnU0VUX0lNQUdFU19PV05FUic7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9VU0VSX0lNQUdFUyA9ICdSRUNJRVZFRF9VU0VSX0lNQUdFUyc7XHJcbmV4cG9ydCBjb25zdCBBRERfU0VMRUNURURfSU1BR0VfSUQgPSAnQUREX1NFTEVDVEVEX0lNQUdFX0lEJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCA9ICdSRU1PVkVfU0VMRUNURURfSU1BR0VfSUQnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTID0gJ0NMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyc7XHJcblxyXG4vLyBVc2VyIGFjdGlvbnNcclxuZXhwb3J0IGNvbnN0IFNFVF9DVVJSRU5UX1VTRVJfSUQgPSAnU0VUX0NVUlJFTlRfVVNFUl9JRCc7XHJcbmV4cG9ydCBjb25zdCBBRERfVVNFUiA9ICdBRERfVVNFUic7XHJcbmV4cG9ydCBjb25zdCBFUlJPUl9GRVRDSElOR19DVVJSRU5UX1VTRVIgPSAnRVJST1JfRkVUQ0hJTkdfQ1VSUkVOVF9VU0VSJztcclxuZXhwb3J0IGNvbnN0IFJFQ0lFVkVEX1VTRVJTID0gJ1JFQ0lFVkVEX1VTRVJTJztcclxuXHJcbi8vIENvbW1lbnQgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgUkVDSUVWRURfQ09NTUVOVFMgPSAnUkVDSUVWRURfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX0NVUlJFTlRfUEFHRSA9ICdTRVRfQ1VSUkVOVF9QQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UT1RBTF9QQUdFUyA9ICdTRVRfVE9UQUxfUEFHRVMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NLSVBfQ09NTUVOVFMgPSAnU0VUX1NLSVBfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RBS0VfQ09NTUVOVFMgPSAnU0VUX1RBS0VfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgSU5DUl9DT01NRU5UX0NPVU5UID0gJ0lOQ1JfQ09NTUVOVF9DT1VOVCc7XHJcbmV4cG9ydCBjb25zdCBERUNSX0NPTU1FTlRfQ09VTlQgPSAnREVDUl9DT01NRU5UX0NPVU5UJztcclxuZXhwb3J0IGNvbnN0IFNFVF9ERUZBVUxUX1NLSVAgPSAnU0VUX0RFRkFVTFRfU0tJUCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfREVGQVVMVF9UQUtFID0gJ1NFVF9ERUZBVUxUX1RBS0UnO1xyXG5leHBvcnQgY29uc3QgU0VUX0RFRkFVTFRfQ09NTUVOVFMgPSAnU0VUX0RFRkFVTFRfQ09NTUVOVFMnO1xyXG5cclxuLy8gV2hhdHNOZXdcclxuZXhwb3J0IGNvbnN0IEFERF9MQVRFU1QgPSAnQUREX0xBVEVTVCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0tJUF9XSEFUU19ORVcgPSAnU0VUX1NLSVBfV0hBVFNfTkVXJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UQUtFX1dIQVRTX05FVyA9ICdTRVRfVEFLRV9XSEFUU19ORVcnO1xyXG5leHBvcnQgY29uc3QgU0VUX1BBR0VfV0hBVFNfTkVXID0gJ1NFVF9QQUdFX1dIQVRTX05FVyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXID0gJ1NFVF9UT1RBTF9QQUdFU19XSEFUU19ORVcnO1xyXG5cclxuLy8gRXJyb3IgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX0VSUk9SX1RJVExFID0gJ1NFVF9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfRVJST1JfTUVTU0FHRSA9ICdTRVRfRVJST1JfTUVTU0FHRSdcclxuZXhwb3J0IGNvbnN0IFNFVF9IQVNfRVJST1IgPSAnU0VUX0hBU19FUlJPUic7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9USVRMRSA9ICdDTEVBUl9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9NRVNTQUdFID0gJ0NMRUFSX0VSUk9SX01FU1NBR0UnOyIsIu+7v2ltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfRVJST1JfVElUTEUsXHJcbiAgICAgICAgdGl0bGU6IHRpdGxlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckVycm9yVGl0bGUgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfVElUTEVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yTWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0VSUk9SX01FU1NBR0UsXHJcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvck1lc3NhZ2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfTUVTU0FHRVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9ICgpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChjbGVhckVycm9yVGl0bGUoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvck1lc3NhZ2UoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0SGFzRXJyb3IoZmFsc2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRIYXNFcnJvciA9IChoYXNFcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9IQVNfRVJST1IsXHJcbiAgICAgICAgaGFzRXJyb3I6IGhhc0Vycm9yXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKHRydWUpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXRFcnJvclRpdGxlKGVycm9yLnRpdGxlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JNZXNzYWdlKGVycm9yLm1lc3NhZ2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IodGl0bGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IHVuaXEsIGZsYXR0ZW4gfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXHJcbmltcG9ydCByZW1vdmVNZCBmcm9tICdyZW1vdmUtbWFya2Rvd24nXHJcblxyXG52YXIgY3VycnkgPSBmdW5jdGlvbihmLCBuYXJncywgYXJncykge1xyXG4gICAgbmFyZ3MgPSBpc0Zpbml0ZShuYXJncykgPyBuYXJncyA6IGYubGVuZ3RoO1xyXG4gICAgYXJncyA9IGFyZ3MgfHwgW107XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gMS4gYWNjdW11bGF0ZSBhcmd1bWVudHNcclxuICAgICAgICB2YXIgbmV3QXJncyA9IGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIGlmIChuZXdBcmdzLmxlbmd0aCA+PSBuYXJncykge1xyXG4gICAgICAgICAgICAvLyBhcHBseSBhY2N1bXVsYXRlZCBhcmd1bWVudHNcclxuICAgICAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgbmV3QXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIDIuIHJldHVybiBhbm90aGVyIGN1cnJpZWQgZnVuY3Rpb25cclxuICAgICAgICByZXR1cm4gY3VycnkoZiwgbmFyZ3MsIG5ld0FyZ3MpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGN1cnJ5O1xyXG5cclxuY29uc3QgY291bnRDb21tZW50ID0gKHRvcENvbW1lbnQpID0+IHtcclxuICAgIGxldCBjb3VudCA9IDE7XHJcbiAgICBsZXQgcmVtb3ZlZCA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcENvbW1lbnQuUmVwbGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdG9wQ29tbWVudC5SZXBsaWVzW2ldO1xyXG5cclxuICAgICAgICAvLyBFeGNsdWRlIGRlbGV0ZWQgY29tbWVudHNcclxuICAgICAgICBpZihjaGlsZC5EZWxldGVkKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZWQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvdW50ICs9IGNvdW50Q29tbWVudChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50LXJlbW92ZWQ7XHJcbn1cclxuXHJcbmNvbnN0IGNvdW50Q29tbWVudHMgPSAoY29tbWVudHMgPSBbXSkgPT4ge1xyXG4gICAgbGV0IHRvdGFsID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgdG9wQ29tbWVudCA9IGNvbW1lbnRzW2ldO1xyXG4gICAgICAgIHRvdGFsICs9IGNvdW50Q29tbWVudCh0b3BDb21tZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdG90YWw7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVJbWFnZSA9IChpbWcpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSW1hZ2VJRDogaW1nLkltYWdlSUQsXHJcbiAgICAgICAgRmlsZW5hbWU6IGltZy5GaWxlbmFtZSxcclxuICAgICAgICBFeHRlbnNpb246IGltZy5FeHRlbnNpb24sXHJcbiAgICAgICAgT3JpZ2luYWxVcmw6IGltZy5PcmlnaW5hbFVybCxcclxuICAgICAgICBQcmV2aWV3VXJsOiBpbWcuUHJldmlld1VybCxcclxuICAgICAgICBUaHVtYm5haWxVcmw6IGltZy5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgQ29tbWVudENvdW50OiBpbWcuQ29tbWVudENvdW50LFxyXG4gICAgICAgIFVwbG9hZGVkOiBuZXcgRGF0ZShpbWcuVXBsb2FkZWQpLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNvbW1lbnQgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgbGV0IHIgPSBjb21tZW50LlJlcGxpZXMgPyBjb21tZW50LlJlcGxpZXMgOiBbXTtcclxuICAgIGNvbnN0IHJlcGxpZXMgPSByLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgIGNvbnN0IGF1dGhvcklkID0gKGNvbW1lbnQuRGVsZXRlZCkgPyAtMSA6IGNvbW1lbnQuQXV0aG9yLklEO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBDb21tZW50SUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgICAgIERlbGV0ZWQ6IGNvbW1lbnQuRGVsZXRlZCxcclxuICAgICAgICBQb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbixcclxuICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgUmVwbGllczogcmVwbGllc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplTGF0ZXN0ID0gKGxhdGVzdCkgPT4ge1xyXG4gICAgbGV0IGl0ZW0gPSBudWxsO1xyXG4gICAgaWYobGF0ZXN0LlR5cGUgPT0gMSkge1xyXG4gICAgICAgIC8vIEltYWdlIC0gb21pdCBBdXRob3IgYW5kIENvbW1lbnRDb3VudFxyXG4gICAgICAgIGNvbnN0IGltYWdlID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgRXh0ZW5zaW9uOiBpbWFnZS5FeHRlbnNpb24sXHJcbiAgICAgICAgICAgIEZpbGVuYW1lOiBpbWFnZS5GaWxlbmFtZSxcclxuICAgICAgICAgICAgSW1hZ2VJRDogaW1hZ2UuSW1hZ2VJRCxcclxuICAgICAgICAgICAgT3JpZ2luYWxVcmw6IGltYWdlLk9yaWdpbmFsVXJsLFxyXG4gICAgICAgICAgICBQcmV2aWV3VXJsOiBpbWFnZS5QcmV2aWV3VXJsLFxyXG4gICAgICAgICAgICBUaHVtYm5haWxVcmw6IGltYWdlLlRodW1ibmFpbFVybCxcclxuICAgICAgICAgICAgVXBsb2FkZWQ6IGltYWdlLlVwbG9hZGVkXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxhdGVzdC5UeXBlID09IDIpIHtcclxuICAgICAgICAvLyBDb21tZW50IC0gb21pdCBBdXRob3IgYW5kIERlbGV0ZWQgYW5kIFJlcGxpZXNcclxuICAgICAgICBjb25zdCBjb21tZW50ID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgSUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogY29tbWVudC5JbWFnZUlELFxyXG4gICAgICAgICAgICBJbWFnZVVwbG9hZGVkQnk6IGNvbW1lbnQuSW1hZ2VVcGxvYWRlZEJ5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiBsYXRlc3QuSUQsXHJcbiAgICAgICAgVHlwZTogbGF0ZXN0LlR5cGUsXHJcbiAgICAgICAgSXRlbTogaXRlbSxcclxuICAgICAgICBPbjogbGF0ZXN0Lk9uLFxyXG4gICAgICAgIEF1dGhvcklEOiBsYXRlc3QuSXRlbS5BdXRob3IuSURcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHZpc2l0Q29tbWVudHMgPSAoY29tbWVudHMsIGZ1bmMpID0+IHtcclxuICAgIGNvbnN0IGdldFJlcGxpZXMgPSAoYykgPT4gYy5SZXBsaWVzID8gYy5SZXBsaWVzIDogW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjb21tZW50c1tpXSwgZ2V0UmVwbGllcywgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZXB0aEZpcnN0U2VhcmNoID0gKGN1cnJlbnQsIGdldENoaWxkcmVuLCBmdW5jKSA9PiB7XHJcbiAgICBmdW5jKGN1cnJlbnQpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBnZXRDaGlsZHJlbihjdXJyZW50KTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKGNoaWxkcmVuW2ldLCBnZXRDaGlsZHJlbiwgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmlvbihhcnIxLCBhcnIyLCBlcXVhbGl0eUZ1bmMpIHtcclxuICAgIHZhciB1bmlvbiA9IGFycjEuY29uY2F0KGFycjIpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5pb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gaSsxOyBqIDwgdW5pb24ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGVxdWFsaXR5RnVuYyh1bmlvbltpXSwgdW5pb25bal0pKSB7XHJcbiAgICAgICAgICAgICAgICB1bmlvbi5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICBqLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVuaW9uO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXNlckVxdWFsaXR5ID0gKHVzZXIxLCB1c2VyMikgPT4ge1xyXG4gICAgaWYoIXVzZXIyIHx8ICF1c2VyMSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHVzZXIxLklEID09IHVzZXIyLklEO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGZvcm1hdFRleHQgPSAodGV4dCkgPT4ge1xyXG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICB2YXIgcmF3TWFya3VwID0gbWFya2VkKHRleHQsIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICByZXR1cm4geyBfX2h0bWw6IHJhd01hcmt1cCB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0V29yZHMgPSAodGV4dCwgbnVtYmVyT2ZXb3JkcykgPT4ge1xyXG4gICAgaWYoIXRleHQpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgcGxhaW5UZXh0ID0gcmVtb3ZlTWQodGV4dCk7XHJcbiAgICByZXR1cm4gcGxhaW5UZXh0LnNwbGl0KC9cXHMrLykuc2xpY2UoMCwgbnVtYmVyT2ZXb3Jkcykuam9pbihcIiBcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB0aW1lVGV4dCA9IChwb3N0ZWRPbikgPT4ge1xyXG4gICAgY29uc3QgYWdvID0gbW9tZW50KHBvc3RlZE9uKS5mcm9tTm93KCk7XHJcbiAgICBjb25zdCBkaWZmID0gbW9tZW50KCkuZGlmZihwb3N0ZWRPbiwgJ2hvdXJzJywgdHJ1ZSk7XHJcbiAgICBpZiAoZGlmZiA+PSAxMi41KSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBtb21lbnQocG9zdGVkT24pO1xyXG4gICAgICAgIHJldHVybiBcImQuIFwiICsgZGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKSArIFwia2wuIFwiICsgZGF0ZS5mb3JtYXQoXCJIOm1tXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBcImZvciBcIiArIGFnbztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc3BvbnNlSGFuZGxlciA9IChkaXNwYXRjaCwgcmVzcG9uc2UpID0+IHtcclxuICAgIGlmIChyZXNwb25zZS5vaykgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgNDAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjQwMCBCYWQgUmVxdWVzdFwiLCBcIlRoZSByZXF1ZXN0IHdhcyBub3Qgd2VsbC1mb3JtZWRcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDQgTm90IEZvdW5kXCIsIFwiQ291bGQgbm90IGZpbmQgcmVzb3VyY2VcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwODpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDggUmVxdWVzdCBUaW1lb3V0XCIsIFwiVGhlIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgaW4gdGltZVwiKSkpO1xyXG4gICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI1MDAgU2VydmVyIEVycm9yXCIsIFwiU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgQVBJLXNlcnZlclwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihuZXcgSHR0cEVycm9yKFwiT29wc1wiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG9uUmVqZWN0ID0gKCkgPT4geyB9XHJcbiIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgdW5pb24sIHVzZXJFcXVhbGl0eSB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IHVzZXJzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfVVNFUjpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLnVzZXJdLCB1c2VyRXF1YWxpdHkpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi51c2VycztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRVc2VySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9DVVJSRU5UX1VTRVJfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB1c2Vyc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgY3VycmVudFVzZXJJZCxcclxuICAgIHVzZXJzXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCB1c2Vyc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IG93bmVySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9JTUFHRVNfT1dORVI6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbWFnZXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLmltYWdlXSwgKGltZzEsIGltZzIpID0+IGltZzEuSW1hZ2VJRCA9PSBpbWcyLkltYWdlSUQpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSX0lNQUdFUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pbWFnZXM7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmZpbHRlcihpbWcgPT4gaW1nLkltYWdlSUQgIT0gYWN0aW9uLmlkKTtcclxuICAgICAgICBjYXNlIFQuSU5DUl9DT01NRU5UX0NPVU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubWFwKGltZyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihpbWcuSW1hZ2VJRCA9PSBhY3Rpb24uaW1hZ2VJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZy5Db21tZW50Q291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVC5ERUNSX0NPTU1FTlRfQ09VTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYXAoaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGltZy5JbWFnZUlEID09IGFjdGlvbi5pbWFnZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nLkNvbW1lbnRDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGltZztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TRUxFQ1RFRF9JTUc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWRzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfU0VMRUNURURfSU1BR0VfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB1bmlvbihzdGF0ZSwgW2FjdGlvbi5pZF0sIChpZDEsIGlkMikgPT4gaWQxID09IGlkMik7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRDpcclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcihzdGF0ZSwgKGlkKSA9PiBpZCAhPSBhY3Rpb24uaWQpO1xyXG4gICAgICAgIGNhc2UgVC5DTEVBUl9TRUxFQ1RFRF9JTUFHRV9JRFM6XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGltYWdlc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgb3duZXJJZCxcclxuICAgIGltYWdlcyxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZCxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZHNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGltYWdlc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuY29uc3QgY29tbWVudHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlJFQ0lFVkVEX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmNvbW1lbnRzIHx8IFtdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0tJUF9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5za2lwIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB0YWtlID0gKHN0YXRlID0gMTAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVEFLRV9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfQ1VSUkVOVF9QQUdFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBhZ2UgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RPVEFMX1BBR0VTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRvdGFsUGFnZXMgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNvbW1lbnRzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjb21tZW50cyxcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbW1lbnRzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5leHBvcnQgY29uc3QgdGl0bGUgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0VSUk9SX1RJVExFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRpdGxlIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfRVJST1JfTUVTU0FHRTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5tZXNzYWdlIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBlcnJvckluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdGl0bGUsXHJcbiAgICBtZXNzYWdlXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXJyb3JJbmZvOyIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IGVycm9ySW5mbyBmcm9tICcuL2Vycm9yJ1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhc0Vycm9yID0gKHN0YXRlID0gZmFsc2UsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfSEFTX0VSUk9SOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhc0Vycm9yO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkb25lID0gKHN0YXRlID0gdHJ1ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzdGF0dXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGhhc0Vycm9yLFxyXG4gICAgZXJyb3JJbmZvLFxyXG4gICAgbWVzc2FnZSxcclxuICAgIGRvbmVcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0YXR1c0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuXHJcbmNvbnN0IHNraXAgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1NLSVBfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnNraXAgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UQUtFX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfUEFHRV9XSEFUU19ORVc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGFnZSB8fCAxO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRvdGFsUGFnZXMgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGl0ZW1zID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfTEFURVNUOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmxhdGVzdCB8fCBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHdoYXRzTmV3SW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBza2lwLFxyXG4gICAgdGFrZSxcclxuICAgIHBhZ2UsXHJcbiAgICB0b3RhbFBhZ2VzLFxyXG4gICAgaXRlbXNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdoYXRzTmV3SW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0IHVzZXJzSW5mbyBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgaW1hZ2VzSW5mbyBmcm9tICcuL2ltYWdlcydcclxuaW1wb3J0IGNvbW1lbnRzSW5mbyBmcm9tICcuL2NvbW1lbnRzJ1xyXG5pbXBvcnQgc3RhdHVzSW5mbyBmcm9tICcuL3N0YXR1cydcclxuaW1wb3J0IHdoYXRzTmV3SW5mbyBmcm9tICcuL3doYXRzbmV3J1xyXG5cclxuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdXNlcnNJbmZvLFxyXG4gICAgaW1hZ2VzSW5mbyxcclxuICAgIGNvbW1lbnRzSW5mbyxcclxuICAgIHN0YXR1c0luZm8sXHJcbiAgICB3aGF0c05ld0luZm9cclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyIiwi77u/aW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgdGh1bmsgZnJvbSAncmVkdXgtdGh1bmsnXHJcbmltcG9ydCByb290UmVkdWNlciBmcm9tICcuLi9yZWR1Y2Vycy9yb290J1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocm9vdFJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZSh0aHVuaykpIiwi77u/ZXhwb3J0IGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnXHJcbn0iLCLvu79pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5jb25zdCBnZXRVcmwgPSAodXNlcm5hbWUpID0+IGdsb2JhbHMudXJscy51c2VycyArICc/dXNlcm5hbWU9JyArIHVzZXJuYW1lO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRVc2VySWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfQ1VSUkVOVF9VU0VSX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXIodXNlcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9VU0VSLFxyXG4gICAgICAgIHVzZXI6IHVzZXJcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNpZXZlZFVzZXJzKHVzZXJzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfVVNFUlMsXHJcbiAgICAgICAgdXNlcnM6IHVzZXJzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRDdXJyZW50VXNlcklkKHVzZXIuSUQpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIodXNlcikpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFVzZXIodXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hVc2VycygpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGdsb2JhbHMudXJscy51c2Vycywgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlcnMgPT4gZGlzcGF0Y2gocmVjaWV2ZWRVc2Vycyh1c2VycykpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBMaW5rLCBJbmRleExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBOYXZMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQgaXNBY3RpdmUgPSB0aGlzLmNvbnRleHQucm91dGVyLmlzQWN0aXZlKHRoaXMucHJvcHMudG8sIHRydWUpLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBpc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG4gICAgICAgICAgICAgICAgPExpbmsgey4uLnRoaXMucHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuTmF2TGluay5jb250ZXh0VHlwZXMgPSB7XHJcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5vYmplY3RcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZGV4TmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICAgICAgICAgIDxJbmRleExpbmsgey4uLnRoaXMucHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9JbmRleExpbms+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5JbmRleE5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFJvdywgQ29sLCBBbGVydCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjbGVhckVycm9yLCB0aXRsZSwgbWVzc2FnZSAgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEFsZXJ0IGJzU3R5bGU9XCJkYW5nZXJcIiBvbkRpc21pc3M9e2NsZWFyRXJyb3J9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57bWVzc2FnZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQWxlcnQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBOYXZMaW5rLCBJbmRleE5hdkxpbmsgfSBmcm9tICcuL3dyYXBwZXJzL0xpbmtzJ1xyXG5pbXBvcnQgeyBFcnJvciB9IGZyb20gJy4vY29udGFpbmVycy9FcnJvcidcclxuaW1wb3J0IHsgY2xlYXJFcnJvciB9IGZyb20gJy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgR3JpZCwgTmF2YmFyLCBOYXYgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaGFzRXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uaGFzRXJyb3IsXHJcbiAgICAgICAgZXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uZXJyb3JJbmZvXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xlYXJFcnJvcjogKCkgPT4gZGlzcGF0Y2goY2xlYXJFcnJvcigpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTaGVsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBlcnJvclZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgY2xlYXJFcnJvciwgZXJyb3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgbWVzc2FnZSB9ID0gZXJyb3I7XHJcbiAgICAgICAgcmV0dXJuIChoYXNFcnJvciA/XHJcbiAgICAgICAgICAgIDxFcnJvclxyXG4gICAgICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17bWVzc2FnZX1cclxuICAgICAgICAgICAgICAgIGNsZWFyRXJyb3I9e2NsZWFyRXJyb3J9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPEdyaWQgZmx1aWQ9e3RydWV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci5CcmFuZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9cIiBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIj5JbnVwbGFuIEludHJhbmV0PC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXZiYXIuQnJhbmQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRvZ2dsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5IZWFkZXI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLkNvbGxhcHNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5kZXhOYXZMaW5rIHRvPVwiL1wiPkZvcnNpZGU8L0luZGV4TmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayB0bz1cIi91c2Vyc1wiPkJydWdlcmU8L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89XCIvYWJvdXRcIj5PbTwvTmF2TGluaz4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRleHQgcHVsbFJpZ2h0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhlaiwge2dsb2JhbHMuY3VycmVudFVzZXJuYW1lfSFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLlRleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLkNvbGxhcHNlPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L05hdmJhcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZXJyb3JWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9HcmlkPlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBNYWluID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoU2hlbGwpO1xyXG5leHBvcnQgZGVmYXVsdCBNYWluOyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYm91dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiT21cIjtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZXR0ZSBlciBlbiBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvbiFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGVrbm9sb2dpZXIgYnJ1Z3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlJlYWN0PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5SZWR1eDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVhY3QtQm9vdHN0cmFwPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5SZWFjdFJvdXRlcjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+QXNwLm5ldCBDb3JlIFJDIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkFzcC5uZXQgV2ViIEFQSSAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0LCBub3JtYWxpemVMYXRlc3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZExhdGVzdChsYXRlc3QpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5BRERfTEFURVNULFxyXG4gICAgICAgIGxhdGVzdDogbGF0ZXN0XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRTS2lwKHNraXApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0tJUF9XSEFUU19ORVcsXHJcbiAgICAgICAgc2tpcDogc2tpcFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VGFrZSh0YWtlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RBS0VfV0hBVFNfTkVXLFxyXG4gICAgICAgIHRha2U6IHRha2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFBhZ2UocGFnZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9QQUdFX1dIQVRTX05FVyxcclxuICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUb3RhbFBhZ2VzKHRvdGFsUGFnZXMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMud2hhdHNuZXcgKyBcIj9za2lwPVwiICsgc2tpcCArIFwiJnRha2U9XCIgKyB0YWtlO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4ocGFnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IHBhZ2UuQ3VycmVudEl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdXRob3IgPSBpdGVtLkl0ZW0uQXV0aG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGF1dGhvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkVXNlcihhdXRob3IpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlc2V0IGluZm9cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFNLaXAoc2tpcCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZSh0YWtlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRQYWdlKHBhZ2UuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMocGFnZS5Ub3RhbFBhZ2VzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGl0ZW1zLmZpbHRlcihpdGVtID0+IEJvb2xlYW4oaXRlbS5JdGVtLkF1dGhvcikpLm1hcChub3JtYWxpemVMYXRlc3QpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkTGF0ZXN0KG5vcm1hbGl6ZWQpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3SXRlbUltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50UHJvZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cIm1lZGlhLW9iamVjdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjPVwiL2ltYWdlcy9wZXJzb25faWNvbi5zdmdcIlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtaG9sZGVyLXJlbmRlcmVkPVwidHJ1ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiNjRweFwiLCBoZWlnaHQ6IFwiNjRweFwiIH19XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50UHJvZmlsZSB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRQcm9maWxlJ1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCBnZXRXb3JkcywgdGltZVRleHQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IE1lZGlhIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoYXRzTmV3SXRlbUNvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY3JlYXRlU3VtbWFyeSgpIHtcclxuICAgICAgICBjb25zdCB7IHRleHQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRleHQoXCJcXFwiXCIgKyBnZXRXb3Jkcyh0ZXh0LCA1KSArIFwiLi4uXCIgKyBcIlxcXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVsbG5hbWUoKSB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIGF1dGhvci5GaXJzdE5hbWUgKyAnICcgKyBhdXRob3IuTGFzdE5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgd2hlbigpIHtcclxuICAgICAgICBjb25zdCB7IG9uIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBcInNhZ2RlIFwiICsgdGltZVRleHQob24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGltYWdlSWQsIHVwbG9hZGVkQnkgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yID0gdGhpcy5mdWxsbmFtZSgpO1xyXG4gICAgICAgIGNvbnN0IHN1bW1hcnkgPSB0aGlzLmNyZWF0ZVN1bW1hcnkoKTtcclxuICAgICAgICBjb25zdCBsaW5rVG9JbWFnZSA9IHVwbG9hZGVkQnkuVXNlcm5hbWUgKyBcIi9nYWxsZXJ5L2ltYWdlL1wiICsgaW1hZ2VJZDtcclxuICAgICAgICByZXR1cm4gIDxNZWRpYS5MaXN0SXRlbT5cclxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFByb2ZpbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICA8TWVkaWEuQm9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cIm1lZGlhLWhlYWRpbmdcIj57YXV0aG9yfSA8c21hbGw+e3RoaXMud2hlbigpfTwvc21hbGw+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxlbT48c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17c3VtbWFyeX0+PC9zcGFuPjwvZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17bGlua1RvSW1hZ2V9PlNlIGtvbW1lbnRhcjwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICA8L01lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L01lZGlhLkxpc3RJdGVtPlxyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgV2hhdHNOZXdJdGVtSW1hZ2UgfSBmcm9tICcuL1doYXRzTmV3SXRlbUltYWdlJ1xyXG5pbXBvcnQgeyBXaGF0c05ld0l0ZW1Db21tZW50IH0gZnJvbSAnLi9XaGF0c05ld0l0ZW1Db21tZW50J1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0xpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0SXRlbXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtcywgZ2V0VXNlciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBnZW5lcmF0ZUtleSA9IChpZCkgPT4gXCJ3aGF0c25ld19cIiArIGlkO1xyXG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGdldFVzZXIoaXRlbS5BdXRob3JJRCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1LZXkgPSBnZW5lcmF0ZUtleShpdGVtLklEKTtcclxuICAgICAgICAgICAgc3dpdGNoIChpdGVtLlR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxXaGF0c05ld0l0ZW1JbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtpdGVtLklEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW09e2l0ZW0uSXRlbX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbj17aXRlbS5Pbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I9e2F1dGhvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW1LZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAgPFdoYXRzTmV3SXRlbUNvbW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17aXRlbS5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXtpdGVtLkl0ZW0uVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRlZEJ5PXtpdGVtLkl0ZW0uSW1hZ2VVcGxvYWRlZEJ5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSWQ9e2l0ZW0uSXRlbS5JbWFnZUlEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uPXtpdGVtLk9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcj17YXV0aG9yfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aXRlbUtleX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBpdGVtTm9kZXMgPSB0aGlzLmNvbnN0cnVjdEl0ZW1zKCk7XHJcbiAgICAgICAgcmV0dXJuICA8TWVkaWEuTGlzdD5cclxuICAgICAgICAgICAgICAgICAgICB7aXRlbU5vZGVzfVxyXG4gICAgICAgICAgICAgICAgPC9NZWRpYS5MaXN0PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBmZXRjaExhdGVzdE5ld3MgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3doYXRzbmV3J1xyXG5pbXBvcnQgeyBXaGF0c05ld0xpc3QgfSBmcm9tICcuLi9XaGF0c05ldy9XaGF0c05ld0xpc3QnXHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TGF0ZXN0OiAoc2tpcCwgdGFrZSkgPT4gZGlzcGF0Y2goZmV0Y2hMYXRlc3ROZXdzKHNraXAsIHRha2UpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXRlbXM6IHN0YXRlLndoYXRzTmV3SW5mby5pdGVtcyxcclxuICAgICAgICBnZXRVc2VyOiAoaWQpID0+IGZpbmQoc3RhdGUudXNlcnNJbmZvLnVzZXJzLCAodXNlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdXNlci5JRCA9PSBpZDtcclxuICAgICAgICB9KSxcclxuICAgICAgICBza2lwOiBzdGF0ZS53aGF0c05ld0luZm8uc2tpcCxcclxuICAgICAgICB0YWtlOiBzdGF0ZS53aGF0c05ld0luZm8udGFrZVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBXaGF0c05ld0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGdldExhdGVzdCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBnZXRMYXRlc3Qoc2tpcCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5TaWRzdGUgbnl0PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICA8V2hhdHNOZXdMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpdGVtc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VXNlcj17Z2V0VXNlcn1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFdoYXRzTmV3ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoV2hhdHNOZXdDb250YWluZXIpXHJcbmV4cG9ydCBkZWZhdWx0IFdoYXRzTmV3OyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgV2hhdHNOZXcgZnJvbSAnLi9XaGF0c05ldydcclxuaW1wb3J0IHsgSnVtYm90cm9uLCBHcmlkLCBSb3csIENvbCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vycy5maWx0ZXIodSA9PiB1LlVzZXJuYW1lLnRvVXBwZXJDYXNlKCkgPT0gZ2xvYmFscy5jdXJyZW50VXNlcm5hbWUudG9VcHBlckNhc2UoKSlbMF07XHJcbiAgICBjb25zdCBuYW1lID0gdXNlciA/IHVzZXIuRmlyc3ROYW1lIDogJ1VzZXInO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBuYW1lXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEhvbWVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJGb3JzaWRlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SnVtYm90cm9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPlZlbGtvbW1lbiA8c21hbGw+e25hbWV9ITwvc21hbGw+PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImxlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWwgSW51cGxhbnMgaW50cmFuZXQgc2lkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9KdW1ib3Ryb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxXaGF0c05ldyAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEhvbWUgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoSG9tZVZpZXcpXHJcbmV4cG9ydCBkZWZhdWx0IEhvbWUiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGZpcnN0TmFtZSwgbGFzdE5hbWUsIGVtYWlsIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGVtYWlsTGluayA9IFwibWFpbHRvOlwiICsgZW1haWw7XHJcbiAgICAgICAgY29uc3QgZ2FsbGVyeSA9IFwiL1wiICsgdXNlcm5hbWUgKyBcIi9nYWxsZXJ5XCI7XHJcblxyXG4gICAgICAgIHJldHVybiAgPENvbCBsZz17M30+XHJcbiAgICAgICAgICAgICAgICAgICAgPFVzZXJJdGVtIHRpdGxlPVwiQnJ1Z2VybmF2blwiPnt1c2VybmFtZX08L1VzZXJJdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgIDxVc2VySXRlbSB0aXRsZT1cIkZvcm5hdm5cIj57Zmlyc3ROYW1lfTwvVXNlckl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFVzZXJJdGVtIHRpdGxlPVwiRWZ0ZXJuYXZuXCI+e2xhc3ROYW1lfTwvVXNlckl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFVzZXJJdGVtIHRpdGxlPVwiRW1haWxcIj48YSBocmVmPXtlbWFpbExpbmt9PntlbWFpbH08L2E+PC9Vc2VySXRlbT5cclxuICAgICAgICAgICAgICAgICAgICA8VXNlckl0ZW0gdGl0bGU9XCJCaWxsZWRlclwiPjxMaW5rIHRvPXtnYWxsZXJ5fT5CaWxsZWRlcjwvTGluaz48L1VzZXJJdGVtPlxyXG4gICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJIZWFkaW5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gIDxDb2wgbGc9ezZ9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXNlckJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPENvbCBsZz17Nn0+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXNlckl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxVc2VySGVhZGluZz57dGl0bGV9PC9Vc2VySGVhZGluZz5cclxuICAgICAgICAgICAgICAgICAgICA8VXNlckJvZHk+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9Vc2VyQm9keT5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL1VzZXInXHJcbmltcG9ydCB7IFJvdyB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICB1c2VyTm9kZXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VycyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gdXNlcnMubWFwKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJJZCA9IGB1c2VySWRfJHt1c2VyLklEfWA7XHJcbiAgICAgICAgICAgIHJldHVybiAgPFVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlci5Vc2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ9e3VzZXIuSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lPXt1c2VyLkZpcnN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TmFtZT17dXNlci5MYXN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbD17dXNlci5FbWFpbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlVXJsPXt1c2VyLlByb2ZpbGVJbWFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlcz17dXNlci5Sb2xlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3VzZXJJZH1cclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy51c2VyTm9kZXMoKX1cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IGZldGNoVXNlcnMgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgeyBVc2VyTGlzdCB9IGZyb20gJy4uL3VzZXJzL1VzZXJMaXN0J1xyXG5pbXBvcnQgeyBSb3csIENvbCwgUGFnZUhlYWRlciB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmNvbnN0IG1hcFVzZXJzVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2Vyczogc3RhdGUudXNlcnNJbmZvLnVzZXJzXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0VXNlcnM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hVc2VycygpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBVc2Vyc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiQnJ1Z2VyZVwiO1xyXG4gICAgICAgIHRoaXMucHJvcHMuZ2V0VXNlcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VycyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8UGFnZUhlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEludXBsYW4ncyA8c21hbGw+YnJ1Z2VyZTwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUGFnZUhlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VyTGlzdCB1c2Vycz17dXNlcnN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFVzZXJzID0gY29ubmVjdChtYXBVc2Vyc1RvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlcnNDb250YWluZXIpXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJzIiwi77u/aW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgeyBub3JtYWxpemVJbWFnZSB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEltYWdlc093bmVyKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0lNQUdFU19PV05FUixcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNpZXZlZFVzZXJJbWFnZXMoaW1hZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfVVNFUl9JTUFHRVMsXHJcbiAgICAgICAgaW1hZ2VzOiBpbWFnZXNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTZWxlY3RlZEltZyA9IChpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TRUxFQ1RFRF9JTUcsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkSW1hZ2UoaW1nKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX0lNQUdFLFxyXG4gICAgICAgIGltYWdlOiBpbWdcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVJbWFnZShpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFTU9WRV9JTUFHRSxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRTZWxlY3RlZEltYWdlSWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5BRERfU0VMRUNURURfSU1BR0VfSUQsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVNT1ZFX1NFTEVDVEVEX0lNQUdFX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5DTEVBUl9TRUxFQ1RFRF9JTUFHRV9JRFNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVJbWFnZShpZCwgdXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lICsgXCImaWQ9XCIgKyBpZDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBkaXNwYXRjaChyZW1vdmVJbWFnZShpZCkpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRJbWFnZSh1c2VybmFtZSwgZm9ybURhdGEpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSksIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICBjb25zdCBvblN1Y2Nlc3MgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gZGF0YS5tYXAobm9ybWFsaXplSW1hZ2UpLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVjaWV2ZWRVc2VySW1hZ2VzKG5vcm1hbGl6ZWQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzcywgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBpbWFnZUlkcyA9IFtdKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCBpZHMgPSBpbWFnZUlkcy5qb2luKCk7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlcyArIFwiP3VzZXJuYW1lPVwiICsgdXNlcm5hbWUgKyBcIiZpZHM9XCIgKyBpZHM7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkpLCBvblJlamVjdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2goZmV0Y2hVc2VySW1hZ2VzKHVzZXJuYW1lKSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0SW1hZ2VPd25lcih1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIC8vIExhenkgZXZhbHVhdGlvblxyXG4gICAgICAgIGNvbnN0IGZpbmRPd25lciA9ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbmQoZ2V0U3RhdGUoKS51c2Vyc0luZm8udXNlcnMsICh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXNlci5Vc2VybmFtZSA9PSB1c2VybmFtZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3duZXIgPSBmaW5kT3duZXIoKTtcclxuXHJcbiAgICAgICAgaWYob3duZXIpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3duZXJJZCA9IG93bmVyLklEO1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lcklkKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBnbG9iYWxzLnVybHMudXNlcnMgKyAnP3VzZXJuYW1lPScgKyB1c2VybmFtZTtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbih1c2VyID0+IGRpc3BhdGNoKGFkZFVzZXIodXNlcikpLCBvblJlamVjdClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvd25lciA9IGZpbmRPd25lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEltYWdlc093bmVyKG93bmVyLklEKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHByb21pc2VHZXRJbWFnZSA9IChpZCwgZ2V0U3RhdGUpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGltYWdlcyA9IGdldFN0YXRlKCkuaW1hZ2VzSW5mby5pbWFnZXM7XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBmaW5kKGltYWdlcywgKGltZykgPT4gaW1nLkltYWdlSUQgPT0gaWQpO1xyXG5cclxuICAgICAgICBpZihpbWFnZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlamVjdChFcnJvcihcIkltYWdlIGRvZXMgbm90IGV4aXN0IGxvY2FsbHkhXCIpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoU2luZ2xlSW1hZ2UoaWQpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCIvZ2V0YnlpZD9pZD1cIiArIGlkO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKCFpbWcpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJbWFnZSA9IG5vcm1hbGl6ZUltYWdlKGltZyk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhZGRJbWFnZShub3JtYWxpemVkSW1hZ2UpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IFJvdywgQ29sLCBCdXR0b24gfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFySW5wdXQoZmlsZUlucHV0KSB7XHJcbiAgICAgICAgaWYoZmlsZUlucHV0LnZhbHVlKXtcclxuICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7IC8vZm9yIElFMTEsIGxhdGVzdCBDaHJvbWUvRmlyZWZveC9PcGVyYS4uLlxyXG4gICAgICAgICAgICB9Y2F0Y2goZXJyKXsgfVxyXG4gICAgICAgICAgICBpZihmaWxlSW5wdXQudmFsdWUpeyAvL2ZvciBJRTUgfiBJRTEwXHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gZmlsZUlucHV0LnBhcmVudE5vZGUsIHJlZiA9IGZpbGVJbnB1dC5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoZmlsZUlucHV0KTtcclxuICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZpbGVJbnB1dCxyZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEZpbGVzKCkge1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICByZXR1cm4gKGZpbGVzID8gZmlsZXMuZmlsZXMgOiBbXSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU3VibWl0KGUpIHtcclxuICAgICAgICBjb25zdCB7IHVwbG9hZEltYWdlLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLmdldEZpbGVzKCk7XHJcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gZmlsZXNbaV07XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhKTtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVzXCIpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJJbnB1dChmaWxlSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGhhc0ltYWdlcywgZGVsZXRlU2VsZWN0ZWRJbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGc9ezR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZm9ybS11cGxvYWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmN0eXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImZpbGVzXCI+VXBsb2FkIGZpbGVyOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiZmlsZXNcIiBuYW1lPVwiZmlsZXNcIiBtdWx0aXBsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cInByaW1hcnlcIiB0eXBlPVwic3VibWl0XCI+VXBsb2FkPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeydcXHUwMEEwJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGJzU3R5bGU9XCJkYW5nZXJcIiBkaXNhYmxlZD17IWhhc0ltYWdlc30gb25DbGljaz17ZGVsZXRlU2VsZWN0ZWRJbWFnZXN9PlNsZXQgbWFya2VyZXQgYmlsbGVkZXI8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCB7IFJvdywgQ29sLCBJbWFnZSBhcyBJbWFnZUJzIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3hIYW5kbGVyID0gdGhpcy5jaGVja2JveEhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja2JveEhhbmRsZXIoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYWRkID0gZS5jdXJyZW50VGFyZ2V0LmNoZWNrZWQ7XHJcbiAgICAgICAgaWYoYWRkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYWRkU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB7IHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21tZW50SWNvbihjb3VudCkge1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gY291bnQgPT0gMCA/IFwiY29sLWxnLTYgdGV4dC1tdXRlZFwiIDogXCJjb2wtbGctNiB0ZXh0LXByaW1hcnlcIjtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBzdHlsZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiAgPGRpdiB7Li4uIHByb3BzfT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNvbW1lbnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IHtjb3VudH0gICBcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrYm94VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQsIGltYWdlSXNTZWxlY3RlZCwgaW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IGltYWdlSXNTZWxlY3RlZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICByZXR1cm4gKGNhbkVkaXQgPyBcclxuICAgICAgICAgICAgPENvbCBsZz17Nn0gY2xhc3NOYW1lPVwicHVsbC1yaWdodCB0ZXh0LXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgU2xldCA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DbGljaz17dGhpcy5jaGVja2JveEhhbmRsZXJ9IGNoZWNrZWQ9e2NoZWNrZWR9IC8+IFxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG5yZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IGltYWdlLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgIGxldCBjb3VudCA9IGltYWdlLkNvbW1lbnRDb3VudDtcclxuICAgIHJldHVybiAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZS5JbWFnZUlEfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbWFnZUJzIHNyYz17aW1hZ2UuUHJldmlld1VybH0gdGh1bWJuYWlsIC8+XHJcbiAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZS5JbWFnZUlEfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5jb21tZW50SWNvbihjb3VudCl9IFxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5jaGVja2JveFZpZXcoKX1cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tICcuL0ltYWdlJ1xyXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmNvbnN0IGVsZW1lbnRzUGVyUm93ID0gNDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltYWdlTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBhcnJhbmdlQXJyYXkoaW1hZ2VzKSB7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gaW1hZ2VzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCB0aW1lcyA9IE1hdGguY2VpbChsZW5ndGggLyBlbGVtZW50c1BlclJvdyk7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICBsZXQgc3RhcnQgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkrKykge1xyXG4gICAgICAgICAgICBzdGFydCA9IGkgKiBlbGVtZW50c1BlclJvdztcclxuICAgICAgICAgICAgY29uc3QgZW5kID0gc3RhcnQgKyBlbGVtZW50c1BlclJvdztcclxuICAgICAgICAgICAgY29uc3QgbGFzdCA9IGVuZCA+IGxlbmd0aDtcclxuICAgICAgICAgICAgaWYobGFzdCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gaW1hZ2VzLnNsaWNlKHN0YXJ0KTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBpbWFnZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGltYWdlc1ZpZXcoaW1hZ2VzKSB7XHJcbiAgICAgICAgaWYoaW1hZ2VzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCB7IGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBkZWxldGVTZWxlY3RlZEltYWdlcywgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFycmFuZ2VBcnJheShpbWFnZXMpO1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSByZXN1bHQubWFwKChyb3csIGkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW1ncyA9IHJvdy5tYXAoKGltZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICA8Q29sIGxnPXszfSBrZXk9e2ltZy5JbWFnZUlEfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlPXtpbWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRTZWxlY3RlZEltYWdlSWQ9e2FkZFNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQ9e3JlbW92ZVNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlzU2VsZWN0ZWQ9e2ltYWdlSXNTZWxlY3RlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByb3dJZCA9IFwicm93SWRcIiArIGk7XHJcbiAgICAgICAgICAgIHJldHVybiAgPFJvdyBrZXk9e3Jvd0lkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2ltZ3N9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aWV3O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLmltYWdlc1ZpZXcoaW1hZ2VzKX1cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcbi8vPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuLy8gICAgICAgICAgICB7dGhpcy5pbWFnZXNWaWV3KGltYWdlcyl9XHJcbi8vICAgICAgICA8L2Rpdj4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgdXBsb2FkSW1hZ2UsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgIGRlbGV0ZUltYWdlcywgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBjbGVhclNlbGVjdGVkSW1hZ2VJZHMgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2ltYWdlcydcclxuaW1wb3J0IHsgRXJyb3IgfSBmcm9tICcuL0Vycm9yJ1xyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZCB9IGZyb20gJy4uL2ltYWdlcy9JbWFnZVVwbG9hZCdcclxuaW1wb3J0IEltYWdlTGlzdCBmcm9tICcuLi9pbWFnZXMvSW1hZ2VMaXN0J1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuaW1wb3J0IHsgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IG93bmVySWQgID0gc3RhdGUuaW1hZ2VzSW5mby5vd25lcklkO1xyXG4gICAgY29uc3QgY3VycmVudElkID0gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQ7XHJcbiAgICBjb25zdCBjYW5FZGl0ID0gKG93bmVySWQgPiAwICYmIGN1cnJlbnRJZCA+IDAgJiYgb3duZXJJZCA9PSBjdXJyZW50SWQpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW1hZ2VzOiBzdGF0ZS5pbWFnZXNJbmZvLmltYWdlcyxcclxuICAgICAgICBjYW5FZGl0OiBjYW5FZGl0LFxyXG4gICAgICAgIHNlbGVjdGVkSW1hZ2VJZHM6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkcyxcclxuICAgICAgICBnZXRGdWxsbmFtZTogKHVzZXJuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnMuZmlsdGVyKHUgPT4gdS5Vc2VybmFtZS50b1VwcGVyQ2FzZSgpID09IHVzZXJuYW1lLnRvVXBwZXJDYXNlKCkpWzBdO1xyXG4gICAgICAgICAgICBjb25zdCBmdWxsbmFtZSA9ICh1c2VyKSA/IHVzZXIuRmlyc3ROYW1lICsgXCIgXCIgKyB1c2VyLkxhc3ROYW1lIDogJ1VzZXInO1xyXG4gICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGxvYWRJbWFnZTogKHVzZXJuYW1lLCBmb3JtRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaCh1cGxvYWRJbWFnZSh1c2VybmFtZSwgZm9ybURhdGEpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEltYWdlcyB0byBiZSBkZWxldGVkIGJ5IHNlbGVjdGlvbjpcclxuICAgICAgICAgICAgZGlzcGF0Y2goYWRkU2VsZWN0ZWRJbWFnZUlkKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQ6IChpZCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBJbWFnZXMgdG8gYmUgZGVsZXRlZCBieSBzZWxlY3Rpb246XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlbW92ZVNlbGVjdGVkSW1hZ2VJZChpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2VzOiAodXNlcm5hbWUsIGlkcykgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChkZWxldGVJbWFnZXModXNlcm5hbWUsIGlkcykpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYXJTZWxlY3RlZEltYWdlSWRzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJJbWFnZXNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZUlzU2VsZWN0ZWQgPSB0aGlzLmltYWdlSXNTZWxlY3RlZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMgPSB0aGlzLmRlbGV0ZVNlbGVjdGVkSW1hZ2VzLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGVkID0gdGhpcy5jbGVhclNlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyByb3V0ZXIsIHJvdXRlIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IHVzZXJuYW1lICsgXCIncyBiaWxsZWRlclwiO1xyXG4gICAgICAgIHJvdXRlci5zZXRSb3V0ZUxlYXZlSG9vayhyb3V0ZSwgdGhpcy5jbGVhclNlbGVjdGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNlbGVjdGVkKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2xlYXJTZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGltYWdlSXNTZWxlY3RlZChjaGVja0lkKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZEltYWdlSWRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGZpbmQoc2VsZWN0ZWRJbWFnZUlkcywgKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZCA9PSBjaGVja0lkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlU2VsZWN0ZWRJbWFnZXMoKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZWxlY3RlZEltYWdlSWRzLCBkZWxldGVJbWFnZXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgZGVsZXRlSW1hZ2VzKHVzZXJuYW1lLCBzZWxlY3RlZEltYWdlSWRzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGxvYWRWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgdXBsb2FkSW1hZ2UsIHNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgaGFzSW1hZ2VzID0gc2VsZWN0ZWRJbWFnZUlkcy5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBjYW5FZGl0ID8gXHJcbiAgICAgICAgICAgIDxJbWFnZVVwbG9hZFxyXG4gICAgICAgICAgICAgICAgdXBsb2FkSW1hZ2U9e3VwbG9hZEltYWdlfVxyXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlU2VsZWN0ZWRJbWFnZXM9e3RoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXN9XHJcbiAgICAgICAgICAgICAgICBoYXNJbWFnZXM9e2hhc0ltYWdlc31cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgOiBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZXMsIGdldEZ1bGxuYW1lLCBjYW5FZGl0LCBhZGRTZWxlY3RlZEltYWdlSWQsIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBmdWxsTmFtZSA9IGdldEZ1bGxuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17Mn0gbGc9ezh9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDE+PHNwYW4gY2xhc3NOYW1lPVwidGV4dC1jYXBpdGFsaXplXCI+e2Z1bGxOYW1lfSdzPC9zcGFuPiA8c21hbGw+YmlsbGVkZSBnYWxsZXJpPC9zbWFsbD48L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlTGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VzPXtpbWFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkPXthZGRTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQ9e3JlbW92ZVNlbGVjdGVkSW1hZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSXNTZWxlY3RlZD17dGhpcy5pbWFnZUlzU2VsZWN0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnVwbG9hZFZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBVc2VySW1hZ2VzUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2VySW1hZ2VzQ29udGFpbmVyKTtcclxuY29uc3QgVXNlckltYWdlcyA9IHdpdGhSb3V0ZXIoVXNlckltYWdlc1JlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgVXNlckltYWdlczsiLCLvu79pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgbm9ybWFsaXplQ29tbWVudCwgdmlzaXRDb21tZW50cywgcmVzcG9uc2VIYW5kbGVyLCBvblJlamVjdCB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuaW1wb3J0IHsgYWRkVXNlciB9IGZyb20gJy4vdXNlcnMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldFNraXBDb21tZW50cyA9IChza2lwKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1NLSVBfQ09NTUVOVFMsXHJcbiAgICAgICAgc2tpcDogc2tpcFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRTa2lwID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9ERUZBVUxUX1NLSVBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRUYWtlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9ERUZBVUxUX1RBS0VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldFRha2VDb21tZW50cyA9ICh0YWtlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RBS0VfQ09NTUVOVFMsXHJcbiAgICAgICAgdGFrZTogdGFrZVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRQYWdlKHBhZ2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfQ1VSUkVOVF9QQUdFLFxyXG4gICAgICAgIHBhZ2U6IHBhZ2VcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRUb3RhbFBhZ2VzKHRvdGFsUGFnZXMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfVE9UQUxfUEFHRVMsXHJcbiAgICAgICAgdG90YWxQYWdlczogdG90YWxQYWdlc1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldERlZmF1bHRDb21tZW50cyA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9DT01NRU5UU1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjZWl2ZWRDb21tZW50cyhjb21tZW50cykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFQ0lFVkVEX0NPTU1FTlRTLFxyXG4gICAgICAgIGNvbW1lbnRzOiBjb21tZW50c1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmNvbW1lbnRzICsgXCI/aW1hZ2VJZD1cIiArIGltYWdlSWQgKyBcIiZza2lwPVwiICsgc2tpcCArIFwiJnRha2U9XCIgKyB0YWtlO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBVbnByb2Nlc3NlZCBjb21tZW50c1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFnZUNvbW1lbnRzID0gZGF0YS5DdXJyZW50SXRlbXM7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2V0IChyZS1zZXQpIGluZm9cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFNraXBDb21tZW50cyhza2lwKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUYWtlQ29tbWVudHModGFrZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0Q3VycmVudFBhZ2UoZGF0YS5DdXJyZW50UGFnZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VG90YWxQYWdlcyhkYXRhLlRvdGFsUGFnZXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBWaXNpdCBldmVyeSBjb21tZW50IGFuZCBhZGQgdGhlIHVzZXJcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZEF1dGhvciA9IChjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWMuRGVsZXRlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkVXNlcihjLkF1dGhvcikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmlzaXRDb21tZW50cyhwYWdlQ29tbWVudHMsIGFkZEF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTm9ybWFsaXplOiBmaWx0ZXIgb3V0IHVzZXJcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1lbnRzID0gcGFnZUNvbW1lbnRzLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVkQ29tbWVudHMoY29tbWVudHMpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcG9zdENvbW1lbnQgPSAoaW1hZ2VJZCwgdGV4dCwgcGFyZW50Q29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmNvbW1lbnRzO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBjb25zdCBib2R5ID1KU09OLnN0cmluZ2lmeSh7IFxyXG4gICAgICAgICAgICBUZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICBJbWFnZUlEOiBpbWFnZUlkLFxyXG4gICAgICAgICAgICBQYXJlbnRJRDogcGFyZW50Q29tbWVudElkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChpbmNyZW1lbnRDb21tZW50Q291bnQoaW1hZ2VJZCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGVkaXRDb21tZW50ID0gKGNvbW1lbnRJZCwgaW1hZ2VJZCwgdGV4dCkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHsgc2tpcCwgdGFrZSB9ID0gZ2V0U3RhdGUoKS5jb21tZW50c0luZm87XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmNvbW1lbnRzICsgXCI/aW1hZ2VJZD1cIiArIGltYWdlSWQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBJRDogY29tbWVudElkLCBUZXh0OiB0ZXh0fSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpKTtcclxuICAgICAgICAgICAgfSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlQ29tbWVudCA9IChjb21tZW50SWQsIGltYWdlSWQpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IGdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cyArIFwiP2NvbW1lbnRJZD1cIiArIGNvbW1lbnRJZDtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGRlY3JlbWVudENvbW1lbnRDb3VudChpbWFnZUlkKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluY3JlbWVudENvbW1lbnRDb3VudCA9IChpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuSU5DUl9DT01NRU5UX0NPVU5ULFxyXG4gICAgICAgIGltYWdlSWQ6IGltYWdlSWRcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlY3JlbWVudENvbW1lbnRDb3VudCA9IChpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuREVDUl9DT01NRU5UX0NPVU5ULFxyXG4gICAgICAgIGltYWdlSWQ6IGltYWdlSWRcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudERlbGV0ZWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbGllcywgaGFuZGxlcnMsIGNvbnN0cnVjdENvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSBjb25zdHJ1Y3RDb21tZW50cyhyZXBsaWVzLCBoYW5kbGVycyk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYSBwdWxsLWxlZnQgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWxlZnRcIiBzdHlsZT17e21pbldpZHRoOiBcIjc0cHhcIn19PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnNsZXR0ZXQ8L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgIHtyZXBseU5vZGVzfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5jb25zdCBpZHMgPSAoY29tbWVudElkKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlcGx5SWQ6IGNvbW1lbnRJZCArICdfcmVwbHknLFxyXG4gICAgICAgIGVkaXRJZDogY29tbWVudElkICsgJ19lZGl0JyxcclxuICAgICAgICBkZWxldGVJZDogY29tbWVudElkICsgJ19kZWxldGUnLFxyXG4gICAgICAgIGVkaXRDb2xsYXBzZTogY29tbWVudElkICsgJ19lZGl0Q29sbGFwc2UnLFxyXG4gICAgICAgIHJlcGx5Q29sbGFwc2U6IGNvbW1lbnRJZCArICdfcmVwbHlDb2xsYXBzZSdcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Q29udHJvbHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGV4dDogcHJvcHMudGV4dCxcclxuICAgICAgICAgICAgcmVwbHk6ICcnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0ID0gdGhpcy5lZGl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZXBseSA9IHRoaXMucmVwbHkuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZVRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlID0gdGhpcy5oYW5kbGVSZXBseUNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGVkaXQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0SGFuZGxlLCBjb21tZW50SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdENvbGxhcHNlIH0gPSBpZHMoY29tbWVudElkKTtcclxuXHJcbiAgICAgICAgZWRpdEhhbmRsZShjb21tZW50SWQsIHRleHQpO1xyXG4gICAgICAgICQoXCIjXCIgKyBlZGl0Q29sbGFwc2UpLmNvbGxhcHNlKCdoaWRlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbHkoKSB7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSwgY29tbWVudElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHkgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUNvbGxhcHNlIH0gPSBpZHMoY29tbWVudElkKTtcclxuXHJcbiAgICAgICAgcmVwbHlIYW5kbGUoY29tbWVudElkLCByZXBseSk7XHJcbiAgICAgICAgJChcIiNcIiArIHJlcGx5Q29sbGFwc2UpLmNvbGxhcHNlKCdoaWRlJyk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlcGx5OiAnJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93VG9vbHRpcChpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50SWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgYnRuID0gXCIjXCIgKyBjb21tZW50SWQgKyBcIl9cIiArIGl0ZW07XHJcbiAgICAgICAgJChidG4pLnRvb2x0aXAoJ3Nob3cnKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlUmVwbHlDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXBseTogZS50YXJnZXQudmFsdWUgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBjb21tZW50SWQsIGNhbkVkaXQsIGRlbGV0ZUhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGVkaXRDb2xsYXBzZSwgcmVwbHlDb2xsYXBzZSwgcmVwbHlJZCwgZWRpdElkLCBkZWxldGVJZCB9ID0gaWRzKGNvbW1lbnRJZCk7XHJcbiAgICAgICAgY29uc3QgZWRpdFRhcmdldCA9IFwiI1wiICsgZWRpdENvbGxhcHNlO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5VGFyZ2V0ID0gXCIjXCIgKyByZXBseUNvbGxhcHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBjYW5FZGl0ID9cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4JywgcGFkZGluZ0xlZnQ6IFwiMTVweFwifX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBvbkNsaWNrPXtkZWxldGVIYW5kbGUuYmluZChudWxsLCBjb21tZW50SWQpfSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ2RlbGV0ZScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2RlbGV0ZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiU2xldFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsYWJlbCBsYWJlbC1kYW5nZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXRyYXNoXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPnsnXFx1MDBBMCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17ZWRpdFRhcmdldH0gc3R5bGU9e3sgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdlZGl0Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17ZWRpdElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiw4ZuZHJlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBlbmNpbFwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj57J1xcdTAwQTAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLnNob3dUb29sdGlwLmJpbmQodGhpcywgJ3JlcGx5Jyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17cmVwbHlJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlN2YXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtcHJpbWFyeVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tZW52ZWxvcGVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17e3BhZGRpbmdCb3R0b206ICc1cHgnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwIGNvbGxhcHNlXCIgaWQ9e2VkaXRDb2xsYXBzZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS50ZXh0fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVUZXh0Q2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7dGV4dDogdGV4dH0pfSBkYXRhLXRhcmdldD17ZWRpdFRhcmdldH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4taW5mb1wiIG9uQ2xpY2s9e3RoaXMuZWRpdH0+R2VtIMOmbmRyaW5nZXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMSBjb2wtbGctMTAgY29sbGFwc2VcIiBpZD17cmVwbHlDb2xsYXBzZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS5yZXBseX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVwbHlDaGFuZ2V9IHJvd3M9XCI0XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17cmVwbHlUYXJnZXR9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiPkx1azwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWluZm9cIiBvbkNsaWNrPXt0aGlzLnJlcGx5fT5TdmFyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+IDogXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7cGFkZGluZ0JvdHRvbTogJzVweCcsIHBhZGRpbmdMZWZ0OiAnMTVweCd9fT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD17cmVwbHlUYXJnZXR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdyZXBseScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e3JlcGx5SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTdmFyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXByaW1hcnlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwIGNvbGxhcHNlXCIgaWQ9e3JlcGx5Q29sbGFwc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUucmVwbHl9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1pbmZvXCIgb25DbGljaz17dGhpcy5yZXBseX0+U3ZhcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50Q29udHJvbHMgfSBmcm9tICcuL0NvbW1lbnRDb250cm9scydcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tICcuL0NvbW1lbnRQcm9maWxlJ1xyXG5pbXBvcnQgeyBmb3JtYXRUZXh0LCB0aW1lVGV4dCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRJZCwgcG9zdGVkT24sIGF1dGhvcklkLCB0ZXh0LCByZXBsaWVzLCBoYW5kbGVycywgY29uc3RydWN0Q29tbWVudHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyByZXBseUhhbmRsZSwgZWRpdEhhbmRsZSwgZGVsZXRlSGFuZGxlLCBjYW5FZGl0LCBnZXRVc2VyIH0gPSBoYW5kbGVycztcclxuICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRVc2VyKGF1dGhvcklkKTtcclxuICAgICAgICBjb25zdCBmdWxsbmFtZSA9IGF1dGhvci5GaXJzdE5hbWUgKyBcIiBcIiArIGF1dGhvci5MYXN0TmFtZTtcclxuICAgICAgICBjb25zdCBjYW5FZGl0VmFsID0gY2FuRWRpdChhdXRob3JJZCk7XHJcbiAgICAgICAgY29uc3QgcmVwbHlOb2RlcyA9IGNvbnN0cnVjdENvbW1lbnRzKHJlcGxpZXMsIGhhbmRsZXJzKTtcclxuICAgICAgICBjb25zdCB0eHQgPSBmb3JtYXRUZXh0KHRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhIHB1bGwtbGVmdCB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Q29tbWVudFByb2ZpbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cIm1lZGlhLWhlYWRpbmdcIj48c3Ryb25nPntmdWxsbmFtZX08L3N0cm9uZz4gPFBvc3RlZE9uIHBvc3RlZE9uPXtwb3N0ZWRPbn0gLz48L2g1PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17dHh0fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50Q29udHJvbHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkVkaXQ9e2NhbkVkaXRWYWx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50SWQ9e2NvbW1lbnRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUhhbmRsZT17ZGVsZXRlSGFuZGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdEhhbmRsZT17ZWRpdEhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGx5SGFuZGxlPXtyZXBseUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e3RleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtyZXBseU5vZGVzfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQb3N0ZWRPbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBhZ28oKSB7XHJcbiAgICAgICAgY29uc3QgeyBwb3N0ZWRPbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gdGltZVRleHQocG9zdGVkT24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKDxzbWFsbD5zYWdkZSB7dGhpcy5hZ28oKX08L3NtYWxsPik7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBDb21tZW50RGVsZXRlZCB9IGZyb20gJy4vQ29tbWVudERlbGV0ZWQnXHJcbmltcG9ydCB7IENvbW1lbnQgfSBmcm9tICcuL0NvbW1lbnQnXHJcblxyXG5jb25zdCBjb21wYWN0SGFuZGxlcnMgPSAocmVwbHlIYW5kbGUsIGVkaXRIYW5kbGUsIGRlbGV0ZUhhbmRsZSwgY2FuRWRpdCwgZ2V0VXNlcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXBseUhhbmRsZSxcclxuICAgICAgICBlZGl0SGFuZGxlLFxyXG4gICAgICAgIGRlbGV0ZUhhbmRsZSxcclxuICAgICAgICBjYW5FZGl0LFxyXG4gICAgICAgIGdldFVzZXJcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnRMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdENvbW1lbnRzKGNvbW1lbnRzLCBoYW5kbGVycykge1xyXG4gICAgICAgIGlmICghY29tbWVudHMgfHwgY29tbWVudHMubGVuZ3RoID09IDApIHJldHVybjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbW1lbnRzLm1hcCgoY29tbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBcImNvbW1lbnRJZFwiICsgY29tbWVudC5Db21tZW50SUQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tbWVudC5EZWxldGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWFcIiBrZXk9e2tleX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50RGVsZXRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17a2V5fSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsaWVzPXtjb21tZW50LlJlcGxpZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcnM9e2hhbmRsZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdENvbW1lbnRzPXtjb25zdHJ1Y3RDb21tZW50c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWFcIiBrZXk9e2tleX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2tleX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdGVkT249e2NvbW1lbnQuUG9zdGVkT259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9ySWQ9e2NvbW1lbnQuQXV0aG9ySUR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXtjb21tZW50LlRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGllcz17Y29tbWVudC5SZXBsaWVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRJZD17Y29tbWVudC5Db21tZW50SUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcnM9e2hhbmRsZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdENvbW1lbnRzPXtjb25zdHJ1Y3RDb21tZW50c31cclxuICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbW1lbnRzLCByZXBseUhhbmRsZSwgZWRpdEhhbmRsZSwgZGVsZXRlSGFuZGxlLCBjYW5FZGl0LCBnZXRVc2VyLCB1c2VySWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSBjb21wYWN0SGFuZGxlcnMocmVwbHlIYW5kbGUsIGVkaXRIYW5kbGUsIGRlbGV0ZUhhbmRsZSwgY2FuRWRpdCwgZ2V0VXNlcik7XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmNvbnN0cnVjdENvbW1lbnRzKGNvbW1lbnRzLCBoYW5kbGVycyk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtub2Rlc31cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBQYWdpbmF0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHByZXZWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY3VycmVudFBhZ2UsIHByZXYgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgaGFzUHJldiA9ICEoY3VycmVudFBhZ2UgPT09IDEpO1xyXG4gICAgICAgIGlmIChoYXNQcmV2KVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGFyaWEtbGFiZWw9XCJQcmV2aW91c1wiIG9uQ2xpY2s9e3ByZXZ9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZsYXF1bzs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZGlzYWJsZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mbGFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9saT4pO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHRWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG90YWxQYWdlcywgY3VycmVudFBhZ2UsIG5leHQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgaGFzTmV4dCA9ICEodG90YWxQYWdlcyA9PT0gY3VycmVudFBhZ2UpICYmICEodG90YWxQYWdlcyA9PT0gMCk7XHJcbiAgICAgICAgaWYoaGFzTmV4dClcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBhcmlhLWxhYmVsPVwiTmV4dFwiIG9uQ2xpY2s9e25leHR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZyYXF1bzs8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZGlzYWJsZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mcmFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9saT4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRvdGFsUGFnZXMsIGltYWdlSWQsIGN1cnJlbnRQYWdlLCBnZXRQYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGxldCBwYWdlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IHRvdGFsUGFnZXM7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBcInBhZ2VfaXRlbV9cIiArIChpbWFnZUlkICsgaSk7XHJcbiAgICAgICAgICAgIGlmIChpID09PSBjdXJyZW50UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgcGFnZXMucHVzaCg8bGkgY2xhc3NOYW1lPVwiYWN0aXZlXCIga2V5PXtrZXl9PjxhIGhyZWY9XCIjXCIga2V5PXtrZXkgfT57aX08L2E+PC9saT4pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFnZXMucHVzaCg8bGkga2V5PXtrZXkgfSBvbkNsaWNrPXtnZXRQYWdlLmJpbmQobnVsbCwgaSl9PjxhIGhyZWY9XCIjXCIga2V5PXtrZXkgfT57aX08L2E+PC9saT4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzaG93ID0gKHBhZ2VzLmxlbmd0aCA+IDApO1xyXG5cclxuICAgICAgICByZXR1cm4oXHJcbiAgICAgICAgICAgIHNob3cgP1xyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bmF2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcmV2VmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtwYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5uZXh0VmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L25hdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgOiBudWxsKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50Rm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBUZXh0OiAnJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucG9zdENvbW1lbnQgPSB0aGlzLnBvc3RDb21tZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdENvbW1lbnQoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyBwb3N0SGFuZGxlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHBvc3RIYW5kbGUodGhpcy5zdGF0ZS5UZXh0KTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgVGV4dDogJycgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLnBvc3RDb21tZW50fT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicmVtYXJrXCI+S29tbWVudGFyPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVUZXh0Q2hhbmdlfSB2YWx1ZT17dGhpcy5zdGF0ZS5UZXh0fSBwbGFjZWhvbGRlcj1cIlNrcml2IGtvbW1lbnRhciBoZXIuLi5cIiBpZD1cInJlbWFya1wiIHJvd3M9XCI0XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+U2VuZDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgZmV0Y2hDb21tZW50cywgcG9zdENvbW1lbnQsIGVkaXRDb21tZW50LCBkZWxldGVDb21tZW50IH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9jb21tZW50cydcclxuaW1wb3J0IHsgQ29tbWVudExpc3QgfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50TGlzdCdcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gJy4uL2NvbW1lbnRzL1BhZ2luYXRpb24nXHJcbmltcG9ydCB7IENvbW1lbnRGb3JtIH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudEZvcm0nXHJcbmltcG9ydCB7IFJvdywgQ29sIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGltYWdlSWQ6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmNvbW1lbnRzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmNvbW1lbnRzSW5mby50YWtlLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLmNvbW1lbnRzSW5mby5wYWdlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLmNvbW1lbnRzSW5mby50b3RhbFBhZ2VzLFxyXG4gICAgICAgIGNvbW1lbnRzOiBzdGF0ZS5jb21tZW50c0luZm8uY29tbWVudHMsXHJcbiAgICAgICAgZ2V0VXNlcjogKGlkKSA9PiBmaW5kKHN0YXRlLnVzZXJzSW5mby51c2VycywgKHUpID0+IHUuSUQgPT0gaWQpLFxyXG4gICAgICAgIGNhbkVkaXQ6ICh1c2VySWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09IHVzZXJJZCxcclxuICAgICAgICB1c2VySWQ6IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2FkQ29tbWVudHM6IChpbWFnZUlkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdFJlcGx5OiAoaW1hZ2VJZCwgcmVwbHlJZCwgdGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudChpbWFnZUlkLCB0ZXh0LCByZXBseUlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0Q29tbWVudDogKGltYWdlSWQsIHRleHQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQoaW1hZ2VJZCwgdGV4dCwgbnVsbCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZWRpdENvbW1lbnQ6IChpbWFnZUlkLCBjb21tZW50SWQsIHRleHQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZWRpdENvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkLCB0ZXh0KSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVDb21tZW50OiAoaW1hZ2VJZCwgY29tbWVudElkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDb21tZW50c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLm5leHRQYWdlID0gdGhpcy5uZXh0UGFnZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZ2V0UGFnZSA9IHRoaXMuZ2V0UGFnZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNQYWdlID0gdGhpcy5wcmV2aW91c1BhZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0UGFnZSgpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBza2lwTmV4dCA9IHNraXAgKyB0YWtlO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwTmV4dCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGFnZShwYWdlKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGltYWdlSWQsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgc2tpcFBhZ2VzID0gcGFnZSAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXZpb3VzUGFnZSgpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZX0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGJhY2tTa2lwID0gc2tpcCAtIHRha2U7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIGJhY2tTa2lwLCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudHMsIHBvc3RSZXBseSwgZWRpdENvbW1lbnQsIHBvc3RDb21tZW50LFxyXG4gICAgICAgICAgICAgICAgZGVsZXRlQ29tbWVudCwgY2FuRWRpdCwgZ2V0VXNlcixcclxuICAgICAgICAgICAgICAgIHVzZXJJZCwgaW1hZ2VJZCwgcGFnZSwgdG90YWxQYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezF9IGxnPXsxMX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudExpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50cz17Y29tbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbHlIYW5kbGU9e3Bvc3RSZXBseS5iaW5kKG51bGwsIGltYWdlSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRIYW5kbGU9e2VkaXRDb21tZW50LmJpbmQobnVsbCwgaW1hZ2VJZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlSGFuZGxlPXtkZWxldGVDb21tZW50LmJpbmQobnVsbCwgaW1hZ2VJZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRVc2VyPXtnZXRVc2VyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFBhZ2luYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXtpbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlPXtwYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM9e3RvdGFsUGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dD17dGhpcy5uZXh0UGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2PXt0aGlzLnByZXZpb3VzUGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQYWdlPXt0aGlzLmdldFBhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBsZ09mZnNldD17MX0gbGc9ezEwfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50Rm9ybSBwb3N0SGFuZGxlPXtwb3N0Q29tbWVudC5iaW5kKG51bGwsIGltYWdlSWQpfS8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQ29tbWVudHMgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShDb21tZW50c0NvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIC8vPGRpdj5cclxuICAgICAgICAgICAgLy8gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgLy8gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMVwiPlxyXG4gICAgICAgICAgICAvLyAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIC8vICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAvLyAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgLy8gICAgICAgIDxQYWdpbmF0aW9uXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGltYWdlSWQ9e2ltYWdlSWR9XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlPXtwYWdlfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICB0b3RhbFBhZ2VzPXt0b3RhbFBhZ2VzfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBuZXh0PXt0aGlzLm5leHRQYWdlfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBwcmV2PXt0aGlzLnByZXZpb3VzUGFnZX1cclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgZ2V0UGFnZT17dGhpcy5nZXRQYWdlfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgLz5cclxuICAgICAgICAgICAgLy8gICAgPC9kaXY+XHJcbiAgICAgICAgICAgIC8vICAgIDxociAvPlxyXG4gICAgICAgICAgICAvLyAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgLy8gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMFwiPlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIDxDb21tZW50Rm9ybVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBwb3N0SGFuZGxlPXtwb3N0Q29tbWVudC5iaW5kKG51bGwsIGltYWdlSWQpfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIC8vICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgLy8gICAgPC9kaXY+XHJcbiAgICAgICAgICAgIC8vPC9kaXY+XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcclxuaW1wb3J0IHsgc2V0U2VsZWN0ZWRJbWcsIGZldGNoU2luZ2xlSW1hZ2UsIGRlbGV0ZUltYWdlIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9pbWFnZXMnXHJcbmltcG9ydCB7IHNldEVycm9yIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IHsgQ29tbWVudHMgfSBmcm9tICcuLi9jb250YWluZXJzL0NvbW1lbnRzJ1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBNb2RhbCwgSW1hZ2UsIEJ1dHRvbiwgQnV0dG9uVG9vbGJhciB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3Qgb3duZXJJZCAgPSBzdGF0ZS5pbWFnZXNJbmZvLm93bmVySWQ7XHJcbiAgICBjb25zdCBjdXJyZW50SWQgPSBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZDtcclxuICAgIGNvbnN0IGNhbkVkaXQgPSAob3duZXJJZCA+IDAgJiYgY3VycmVudElkID4gMCAmJiBvd25lcklkID09IGN1cnJlbnRJZCk7XHJcblxyXG4gICAgY29uc3QgZ2V0SW1hZ2UgPSAoaWQpID0+IHtcclxuICAgICAgICByZXR1cm4gZmluZChzdGF0ZS5pbWFnZXNJbmZvLmltYWdlcywgaW1hZ2UgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaW1hZ2UuSW1hZ2VJRCA9PSBpZDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaW1hZ2UgPSAoKSA9PiBnZXRJbWFnZShzdGF0ZS5pbWFnZXNJbmZvLnNlbGVjdGVkSW1hZ2VJZCk7XHJcbiAgICBjb25zdCBmaWxlbmFtZSA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuRmlsZW5hbWU7IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IHByZXZpZXdVcmwgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLlByZXZpZXdVcmw7IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IGV4dGVuc2lvbiA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuRXh0ZW5zaW9uOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCBvcmlnaW5hbFVybCA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuT3JpZ2luYWxVcmw7IHJldHVybiAnJzsgfTtcclxuICAgIGNvbnN0IHVwbG9hZGVkID0gKCkgPT4geyBpZihpbWFnZSgpKSByZXR1cm4gaW1hZ2UoKS5VcGxvYWRlZDsgcmV0dXJuIG5ldyBEYXRlKCk7IH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjYW5FZGl0OiBjYW5FZGl0LFxyXG4gICAgICAgIGhhc0ltYWdlOiBCb29sZWFuKGdldEltYWdlKHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkKSksXHJcbiAgICAgICAgZmlsZW5hbWU6IGZpbGVuYW1lKCksXHJcbiAgICAgICAgcHJldmlld1VybDogcHJldmlld1VybCgpLFxyXG4gICAgICAgIGV4dGVuc2lvbjogZXh0ZW5zaW9uKCksXHJcbiAgICAgICAgb3JpZ2luYWxVcmw6IG9yaWdpbmFsVXJsKCksXHJcbiAgICAgICAgdXBsb2FkZWQ6IHVwbG9hZGVkKClcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNldFNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXNlbGVjdEltYWdlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKHVuZGVmaW5lZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0RXJyb3I6IChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihlcnJvcikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmV0Y2hJbWFnZTogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoU2luZ2xlSW1hZ2UoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUltYWdlOiAoaWQsIHVzZXJuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUltYWdlKGlkLCB1c2VybmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTW9kYWxJbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUltYWdlID0gdGhpcy5kZWxldGVJbWFnZS5iaW5kKHRoaXMpOyBcclxuICAgICAgICB0aGlzLm9wZW4gPSB0aGlzLm9wZW4uYmluZCh0aGlzKTsgXHJcbiAgICAgICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTsgXHJcbiAgICB9XHJcblxyXG4gICAgb3BlbigpIHtcclxuICAgICAgICBjb25zdCB7IGhhc0ltYWdlLCBzZXRFcnJvciB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBpZihoYXNJbWFnZSkgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIHNldEVycm9yKHtcclxuICAgICAgICAgICAgdGl0bGU6ICdPb3BzIHNvbWV0aGluZyB3ZW50IHdyb25nJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0NvdWxkIG5vdCBmaW5kIHRoZSBpbWFnZSwgbWF5YmUgdGhlIFVSTCBpcyBpbnZhbGlkIG9yIGl0IGhhcyBiZWVuIGRlbGV0ZWQhJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlc2VsZWN0SW1hZ2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuXHJcbiAgICAgICAgZGVzZWxlY3RJbWFnZSgpO1xyXG4gICAgICAgIGNvbnN0IGdhbGxlcnlVcmwgPSAnLycgKyB1c2VybmFtZSArICcvZ2FsbGVyeSc7XHJcbiAgICAgICAgcHVzaChnYWxsZXJ5VXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJbWFnZSgpIHtcclxuICAgICAgICBjb25zdCB7IGRlbGV0ZUltYWdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgaWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuXHJcbiAgICAgICAgZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKTtcclxuICAgICAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUltYWdlVmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGNhbkVkaXQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgY2FuRWRpdCA/XHJcbiAgICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cImRhbmdlclwiIG9uQ2xpY2s9e3RoaXMuZGVsZXRlSW1hZ2V9PlNsZXQgYmlsbGVkZTwvQnV0dG9uPlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgICAgICAgICAgcmVuZGVyKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyBmaWxlbmFtZSwgcHJldmlld1VybCwgZXh0ZW5zaW9uLCBvcmlnaW5hbFVybCwgdXBsb2FkZWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gZmlsZW5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVwbG9hZERhdGUgPSBtb21lbnQodXBsb2FkZWQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IFwiVXBsb2FkZWQgZC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICA8TW9kYWwgc2hvdz17dGhpcy5vcGVuKCl9IG9uSGlkZT17dGhpcy5jbG9zZX0gYnNTaXplPVwibGFyZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbC5IZWFkZXIgY2xvc2VCdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsLlRpdGxlPntuYW1lfTxzcGFuPjxzbWFsbD4gLSB7ZGF0ZVN0cmluZ308L3NtYWxsPjwvc3Bhbj48L01vZGFsLlRpdGxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5IZWFkZXI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17b3JpZ2luYWxVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbWFnZSBzcmM9e3ByZXZpZXdVcmx9IHJlc3BvbnNpdmUvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTW9kYWwuQm9keT5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWwuRm9vdGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50cyAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Ub29sYmFyIHN0eWxlPXt7ZmxvYXQ6IFwicmlnaHRcIn19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5kZWxldGVJbWFnZVZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXt0aGlzLmNsb3NlfT5MdWs8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvblRvb2xiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Nb2RhbC5Gb290ZXI+XHJcbiAgICAgICAgICAgICAgICA8L01vZGFsPlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBTZWxlY3RlZEltYWdlUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShNb2RhbEltYWdlKTtcclxuY29uc3QgU2VsZWN0ZWRJbWFnZSA9IHdpdGhSb3V0ZXIoU2VsZWN0ZWRJbWFnZVJlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0ZWRJbWFnZTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IGNvbm5lY3QsIFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZXMvc3RvcmUnXHJcbmltcG9ydCB7IFJvdXRlciwgUm91dGUsIEluZGV4Um91dGUsIGJyb3dzZXJIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBmZXRjaEN1cnJlbnRVc2VyIH0gZnJvbSAnLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgTWFpbiBmcm9tICcuL2NvbXBvbmVudHMvTWFpbidcclxuaW1wb3J0IEFib3V0IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL0Fib3V0J1xyXG5pbXBvcnQgSG9tZSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9Ib21lJ1xyXG5pbXBvcnQgVXNlcnMgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlcnMnXHJcbmltcG9ydCBVc2VySW1hZ2VzIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJJbWFnZXMnXHJcbmltcG9ydCBTZWxlY3RlZEltYWdlIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UnXHJcbmltcG9ydCB7IGZldGNoVXNlckltYWdlcywgc2V0U2VsZWN0ZWRJbWcsIGZldGNoU2luZ2xlSW1hZ2UsIHNldEltYWdlT3duZXIgfSBmcm9tICcuL2FjdGlvbnMvaW1hZ2VzJ1xyXG5cclxuc3RvcmUuZGlzcGF0Y2goZmV0Y2hDdXJyZW50VXNlcihnbG9iYWxzLmN1cnJlbnRVc2VybmFtZSkpO1xyXG5tb21lbnQubG9jYWxlKCdkYScpO1xyXG5cclxuY29uc3Qgc2VsZWN0SW1hZ2UgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBpbWFnZUlkID0gbmV4dFN0YXRlLnBhcmFtcy5pZDtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKGltYWdlSWQpKTtcclxufVxyXG5cclxuY29uc3QgZmV0Y2hJbWFnZXMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IG5leHRTdGF0ZS5wYXJhbXMudXNlcm5hbWU7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRJbWFnZU93bmVyKHVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTtcclxufVxyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICAgICAgPFJvdXRlciBoaXN0b3J5PXticm93c2VySGlzdG9yeX0+XHJcbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGNvbXBvbmVudD17TWFpbn0+XHJcbiAgICAgICAgICAgICAgICA8SW5kZXhSb3V0ZSBjb21wb25lbnQ9e0hvbWV9IC8+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cInVzZXJzXCIgY29tcG9uZW50PXtVc2Vyc30gLz5cclxuICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiYWJvdXRcIiBjb21wb25lbnQ9e0Fib3V0fSAvPlxyXG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCI6dXNlcm5hbWUvZ2FsbGVyeVwiIGNvbXBvbmVudD17VXNlckltYWdlc30gb25FbnRlcj17ZmV0Y2hJbWFnZXN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiaW1hZ2UvOmlkXCIgY29tcG9uZW50PXtTZWxlY3RlZEltYWdlfSBvbkVudGVyPXtzZWxlY3RJbWFnZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgPC9Sb3V0ZXI+XHJcbiAgICA8L1Byb3ZpZGVyPixcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykpO1xyXG5cclxuLy88Um91dGUgcGF0aD1cImNvbW1lbnQvOmNpZFwiIGNvbXBvbmVudD17J1NpbmdsZSBDb21tZW50J30gb25FbnRlcj17J2ZldGNoU2luZ2xlQ29tbWVudENoYWluPyd9IC8+XHJcbi8vPFJvdXRlIHBhdGg9XCJjb21tZW50c1wiIGNvbXBvbmVudD17J0NvbW1lbnRzJ30gb25FbnRlcj17J2ZldGNoQ29tbWVudHMnfSAvPiJdLCJuYW1lcyI6WyJjb25zdCIsIlQuU0VUX0VSUk9SX1RJVExFIiwiVC5DTEVBUl9FUlJPUl9USVRMRSIsIlQuU0VUX0VSUk9SX01FU1NBR0UiLCJULkNMRUFSX0VSUk9SX01FU1NBR0UiLCJULlNFVF9IQVNfRVJST1IiLCJsZXQiLCJULkFERF9VU0VSIiwiVC5SRUNJRVZFRF9VU0VSUyIsIlQuU0VUX0NVUlJFTlRfVVNFUl9JRCIsImNvbWJpbmVSZWR1Y2VycyIsIlQuU0VUX0lNQUdFU19PV05FUiIsIlQuQUREX0lNQUdFIiwiVC5SRUNJRVZFRF9VU0VSX0lNQUdFUyIsIlQuUkVNT1ZFX0lNQUdFIiwiVC5JTkNSX0NPTU1FTlRfQ09VTlQiLCJULkRFQ1JfQ09NTUVOVF9DT1VOVCIsIlQuU0VUX1NFTEVDVEVEX0lNRyIsIlQuQUREX1NFTEVDVEVEX0lNQUdFX0lEIiwiVC5SRU1PVkVfU0VMRUNURURfSU1BR0VfSUQiLCJmaWx0ZXIiLCJULkNMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyIsIlQuUkVDSUVWRURfQ09NTUVOVFMiLCJULlNFVF9TS0lQX0NPTU1FTlRTIiwiVC5TRVRfVEFLRV9DT01NRU5UUyIsIlQuU0VUX0NVUlJFTlRfUEFHRSIsIlQuU0VUX1RPVEFMX1BBR0VTIiwibWVzc2FnZSIsInNraXAiLCJULlNFVF9TS0lQX1dIQVRTX05FVyIsInRha2UiLCJULlNFVF9UQUtFX1dIQVRTX05FVyIsInBhZ2UiLCJULlNFVF9QQUdFX1dIQVRTX05FVyIsInRvdGFsUGFnZXMiLCJULlNFVF9UT1RBTF9QQUdFU19XSEFUU19ORVciLCJULkFERF9MQVRFU1QiLCJjcmVhdGVTdG9yZSIsImFwcGx5TWlkZGxld2FyZSIsInN1cGVyIiwiTGluayIsIkluZGV4TGluayIsIkVycm9yIiwiUm93IiwiQ29sIiwiQWxlcnQiLCJHcmlkIiwiTmF2YmFyIiwiTmF2IiwiY29ubmVjdCIsIk1lZGlhIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwibWFwU3RhdGVUb1Byb3BzIiwiZmluZCIsIkp1bWJvdHJvbiIsIlBhZ2VIZWFkZXIiLCJCdXR0b24iLCJJbWFnZSIsIkltYWdlQnMiLCJyb3ciLCJ3aXRoUm91dGVyIiwic2V0VG90YWxQYWdlcyIsInRoaXMiLCJNb2RhbCIsIkJ1dHRvblRvb2xiYXIiLCJQcm92aWRlciIsIlJvdXRlciIsImJyb3dzZXJIaXN0b3J5IiwiUm91dGUiLCJJbmRleFJvdXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLEFBQU9BLElBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFDbkQsQUFDQSxBQUFPQSxJQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDckMsQUFBT0EsSUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDO0FBQzNDLEFBQU9BLElBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFDbkQsQUFBT0EsSUFBTSxvQkFBb0IsR0FBRyxzQkFBc0IsQ0FBQztBQUMzRCxBQUFPQSxJQUFNLHFCQUFxQixHQUFHLHVCQUF1QixDQUFDO0FBQzdELEFBQU9BLElBQU0sd0JBQXdCLEdBQUcsMEJBQTBCLENBQUM7QUFDbkUsQUFBT0EsSUFBTSx3QkFBd0IsR0FBRywwQkFBMEIsQ0FBQzs7O0FBR25FLEFBQU9BLElBQU0sbUJBQW1CLEdBQUcscUJBQXFCLENBQUM7QUFDekQsQUFBT0EsSUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ25DLEFBQ0EsQUFBT0EsSUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUM7OztBQUcvQyxBQUFPQSxJQUFNLGlCQUFpQixHQUFHLG1CQUFtQixDQUFDO0FBQ3JELEFBQU9BLElBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFDbkQsQUFBT0EsSUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFDakQsQUFBT0EsSUFBTSxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQztBQUNyRCxBQUFPQSxJQUFNLGlCQUFpQixHQUFHLG1CQUFtQixDQUFDO0FBQ3JELEFBQU9BLElBQU0sa0JBQWtCLEdBQUcsb0JBQW9C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