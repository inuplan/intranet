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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbImNvbnN0YW50cy90eXBlcy5qcyIsImFjdGlvbnMvZXJyb3IuanMiLCJ1dGlsaXRpZXMvdXRpbHMuanMiLCJyZWR1Y2Vycy91c2Vycy5qcyIsInJlZHVjZXJzL2ltYWdlcy5qcyIsInJlZHVjZXJzL2NvbW1lbnRzLmpzIiwicmVkdWNlcnMvZXJyb3IuanMiLCJyZWR1Y2Vycy9zdGF0dXMuanMiLCJyZWR1Y2Vycy93aGF0c25ldy5qcyIsInJlZHVjZXJzL3Jvb3QuanMiLCJzdG9yZXMvc3RvcmUuanMiLCJjb25zdGFudHMvY29uc3RhbnRzLmpzIiwiYWN0aW9ucy91c2Vycy5qcyIsImNvbXBvbmVudHMvd3JhcHBlcnMvTGlua3MuanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvRXJyb3IuanMiLCJjb21wb25lbnRzL01haW4uanMiLCJjb21wb25lbnRzL2NvbnRhaW5lcnMvQWJvdXQuanMiLCJhY3Rpb25zL3doYXRzbmV3LmpzIiwiY29tcG9uZW50cy9XaGF0c05ldy9XaGF0c05ld0l0ZW1JbWFnZS5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudFByb2ZpbGUuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3SXRlbUNvbW1lbnQuanMiLCJjb21wb25lbnRzL1doYXRzTmV3L1doYXRzTmV3TGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9XaGF0c05ldy5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Ib21lLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyLmpzIiwiY29tcG9uZW50cy91c2Vycy9Vc2VyTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2Vycy5qcyIsImFjdGlvbnMvaW1hZ2VzLmpzIiwiY29tcG9uZW50cy9pbWFnZXMvSW1hZ2VVcGxvYWQuanMiLCJjb21wb25lbnRzL2ltYWdlcy9JbWFnZS5qcyIsImNvbXBvbmVudHMvaW1hZ2VzL0ltYWdlTGlzdC5qcyIsImNvbXBvbmVudHMvY29udGFpbmVycy9Vc2VySW1hZ2VzLmpzIiwiYWN0aW9ucy9jb21tZW50cy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudERlbGV0ZWQuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRDb250cm9scy5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudC5qcyIsImNvbXBvbmVudHMvY29tbWVudHMvQ29tbWVudExpc3QuanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL1BhZ2luYXRpb24uanMiLCJjb21wb25lbnRzL2NvbW1lbnRzL0NvbW1lbnRGb3JtLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL0NvbW1lbnRzLmpzIiwiY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UuanMiLCJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gSW1hZ2UgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX0lNRyA9ICdTRVRfU0VMRUNURURfSU1HJztcclxuZXhwb3J0IGNvbnN0IFVOU0VUX1NFTEVDVEVEX0lNRyA9ICdVTlNFVF9TRUxFQ1RFRF9JTUcnO1xyXG5leHBvcnQgY29uc3QgQUREX0lNQUdFID0gJ0FERF9JTUFHRSc7XHJcbmV4cG9ydCBjb25zdCBSRU1PVkVfSU1BR0UgPSAnUkVNT1ZFX0lNQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9JTUFHRVNfT1dORVIgPSAnU0VUX0lNQUdFU19PV05FUic7XHJcbmV4cG9ydCBjb25zdCBSRUNJRVZFRF9VU0VSX0lNQUdFUyA9ICdSRUNJRVZFRF9VU0VSX0lNQUdFUyc7XHJcbmV4cG9ydCBjb25zdCBBRERfU0VMRUNURURfSU1BR0VfSUQgPSAnQUREX1NFTEVDVEVEX0lNQUdFX0lEJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCA9ICdSRU1PVkVfU0VMRUNURURfSU1BR0VfSUQnO1xyXG5leHBvcnQgY29uc3QgQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTID0gJ0NMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyc7XHJcblxyXG4vLyBVc2VyIGFjdGlvbnNcclxuZXhwb3J0IGNvbnN0IFNFVF9DVVJSRU5UX1VTRVJfSUQgPSAnU0VUX0NVUlJFTlRfVVNFUl9JRCc7XHJcbmV4cG9ydCBjb25zdCBBRERfVVNFUiA9ICdBRERfVVNFUic7XHJcbmV4cG9ydCBjb25zdCBFUlJPUl9GRVRDSElOR19DVVJSRU5UX1VTRVIgPSAnRVJST1JfRkVUQ0hJTkdfQ1VSUkVOVF9VU0VSJztcclxuZXhwb3J0IGNvbnN0IFJFQ0lFVkVEX1VTRVJTID0gJ1JFQ0lFVkVEX1VTRVJTJztcclxuXHJcbi8vIENvbW1lbnQgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgUkVDSUVWRURfQ09NTUVOVFMgPSAnUkVDSUVWRURfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX0NVUlJFTlRfUEFHRSA9ICdTRVRfQ1VSUkVOVF9QQUdFJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UT1RBTF9QQUdFUyA9ICdTRVRfVE9UQUxfUEFHRVMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NLSVBfQ09NTUVOVFMgPSAnU0VUX1NLSVBfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX1RBS0VfQ09NTUVOVFMgPSAnU0VUX1RBS0VfQ09NTUVOVFMnO1xyXG5leHBvcnQgY29uc3QgSU5DUl9DT01NRU5UX0NPVU5UID0gJ0lOQ1JfQ09NTUVOVF9DT1VOVCc7XHJcbmV4cG9ydCBjb25zdCBERUNSX0NPTU1FTlRfQ09VTlQgPSAnREVDUl9DT01NRU5UX0NPVU5UJztcclxuZXhwb3J0IGNvbnN0IFNFVF9ERUZBVUxUX1NLSVAgPSAnU0VUX0RFRkFVTFRfU0tJUCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfREVGQVVMVF9UQUtFID0gJ1NFVF9ERUZBVUxUX1RBS0UnO1xyXG5leHBvcnQgY29uc3QgU0VUX0RFRkFVTFRfQ09NTUVOVFMgPSAnU0VUX0RFRkFVTFRfQ09NTUVOVFMnO1xyXG5cclxuLy8gV2hhdHNOZXdcclxuZXhwb3J0IGNvbnN0IEFERF9MQVRFU1QgPSAnQUREX0xBVEVTVCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0tJUF9XSEFUU19ORVcgPSAnU0VUX1NLSVBfV0hBVFNfTkVXJztcclxuZXhwb3J0IGNvbnN0IFNFVF9UQUtFX1dIQVRTX05FVyA9ICdTRVRfVEFLRV9XSEFUU19ORVcnO1xyXG5leHBvcnQgY29uc3QgU0VUX1BBR0VfV0hBVFNfTkVXID0gJ1NFVF9QQUdFX1dIQVRTX05FVyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXID0gJ1NFVF9UT1RBTF9QQUdFU19XSEFUU19ORVcnO1xyXG5cclxuLy8gRXJyb3IgYWN0aW9uc1xyXG5leHBvcnQgY29uc3QgU0VUX0VSUk9SX1RJVExFID0gJ1NFVF9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfRVJST1JfTUVTU0FHRSA9ICdTRVRfRVJST1JfTUVTU0FHRSdcclxuZXhwb3J0IGNvbnN0IFNFVF9IQVNfRVJST1IgPSAnU0VUX0hBU19FUlJPUic7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9USVRMRSA9ICdDTEVBUl9FUlJPUl9USVRMRSc7XHJcbmV4cG9ydCBjb25zdCBDTEVBUl9FUlJPUl9NRVNTQUdFID0gJ0NMRUFSX0VSUk9SX01FU1NBR0UnOyIsIu+7v2ltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yVGl0bGUgPSAodGl0bGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfRVJST1JfVElUTEUsXHJcbiAgICAgICAgdGl0bGU6IHRpdGxlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjbGVhckVycm9yVGl0bGUgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfVElUTEVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldEVycm9yTWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0VSUk9SX01FU1NBR0UsXHJcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvck1lc3NhZ2UgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfRVJST1JfTUVTU0FHRVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9ICgpID0+IHtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChjbGVhckVycm9yVGl0bGUoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goY2xlYXJFcnJvck1lc3NhZ2UoKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0SGFzRXJyb3IoZmFsc2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRIYXNFcnJvciA9IChoYXNFcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9IQVNfRVJST1IsXHJcbiAgICAgICAgaGFzRXJyb3I6IGhhc0Vycm9yXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRFcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHNldEhhc0Vycm9yKHRydWUpKTtcclxuICAgICAgICBkaXNwYXRjaChzZXRFcnJvclRpdGxlKGVycm9yLnRpdGxlKSk7XHJcbiAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3JNZXNzYWdlKGVycm9yLm1lc3NhZ2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IodGl0bGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IHVuaXEsIGZsYXR0ZW4gfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi4vYWN0aW9ucy9lcnJvcidcclxuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXHJcbmltcG9ydCByZW1vdmVNZCBmcm9tICdyZW1vdmUtbWFya2Rvd24nXHJcblxyXG52YXIgY3VycnkgPSBmdW5jdGlvbihmLCBuYXJncywgYXJncykge1xyXG4gICAgbmFyZ3MgPSBpc0Zpbml0ZShuYXJncykgPyBuYXJncyA6IGYubGVuZ3RoO1xyXG4gICAgYXJncyA9IGFyZ3MgfHwgW107XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gMS4gYWNjdW11bGF0ZSBhcmd1bWVudHNcclxuICAgICAgICB2YXIgbmV3QXJncyA9IGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIGlmIChuZXdBcmdzLmxlbmd0aCA+PSBuYXJncykge1xyXG4gICAgICAgICAgICAvLyBhcHBseSBhY2N1bXVsYXRlZCBhcmd1bWVudHNcclxuICAgICAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgbmV3QXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIDIuIHJldHVybiBhbm90aGVyIGN1cnJpZWQgZnVuY3Rpb25cclxuICAgICAgICByZXR1cm4gY3VycnkoZiwgbmFyZ3MsIG5ld0FyZ3MpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGN1cnJ5O1xyXG5cclxuY29uc3QgY291bnRDb21tZW50ID0gKHRvcENvbW1lbnQpID0+IHtcclxuICAgIGxldCBjb3VudCA9IDE7XHJcbiAgICBsZXQgcmVtb3ZlZCA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcENvbW1lbnQuUmVwbGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdG9wQ29tbWVudC5SZXBsaWVzW2ldO1xyXG5cclxuICAgICAgICAvLyBFeGNsdWRlIGRlbGV0ZWQgY29tbWVudHNcclxuICAgICAgICBpZihjaGlsZC5EZWxldGVkKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZWQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvdW50ICs9IGNvdW50Q29tbWVudChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50LXJlbW92ZWQ7XHJcbn1cclxuXHJcbmNvbnN0IGNvdW50Q29tbWVudHMgPSAoY29tbWVudHMgPSBbXSkgPT4ge1xyXG4gICAgbGV0IHRvdGFsID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgdG9wQ29tbWVudCA9IGNvbW1lbnRzW2ldO1xyXG4gICAgICAgIHRvdGFsICs9IGNvdW50Q29tbWVudCh0b3BDb21tZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdG90YWw7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVJbWFnZSA9IChpbWcpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSW1hZ2VJRDogaW1nLkltYWdlSUQsXHJcbiAgICAgICAgRmlsZW5hbWU6IGltZy5GaWxlbmFtZSxcclxuICAgICAgICBFeHRlbnNpb246IGltZy5FeHRlbnNpb24sXHJcbiAgICAgICAgT3JpZ2luYWxVcmw6IGltZy5PcmlnaW5hbFVybCxcclxuICAgICAgICBQcmV2aWV3VXJsOiBpbWcuUHJldmlld1VybCxcclxuICAgICAgICBUaHVtYm5haWxVcmw6IGltZy5UaHVtYm5haWxVcmwsXHJcbiAgICAgICAgQ29tbWVudENvdW50OiBpbWcuQ29tbWVudENvdW50LFxyXG4gICAgICAgIFVwbG9hZGVkOiBuZXcgRGF0ZShpbWcuVXBsb2FkZWQpLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNvbW1lbnQgPSAoY29tbWVudCkgPT4ge1xyXG4gICAgbGV0IHIgPSBjb21tZW50LlJlcGxpZXMgPyBjb21tZW50LlJlcGxpZXMgOiBbXTtcclxuICAgIGNvbnN0IHJlcGxpZXMgPSByLm1hcChub3JtYWxpemVDb21tZW50KTtcclxuICAgIGNvbnN0IGF1dGhvcklkID0gKGNvbW1lbnQuRGVsZXRlZCkgPyAtMSA6IGNvbW1lbnQuQXV0aG9yLklEO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBDb21tZW50SUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgQXV0aG9ySUQ6IGF1dGhvcklkLFxyXG4gICAgICAgIERlbGV0ZWQ6IGNvbW1lbnQuRGVsZXRlZCxcclxuICAgICAgICBQb3N0ZWRPbjogY29tbWVudC5Qb3N0ZWRPbixcclxuICAgICAgICBUZXh0OiBjb21tZW50LlRleHQsXHJcbiAgICAgICAgUmVwbGllczogcmVwbGllc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplTGF0ZXN0ID0gKGxhdGVzdCkgPT4ge1xyXG4gICAgbGV0IGl0ZW0gPSBudWxsO1xyXG4gICAgaWYobGF0ZXN0LlR5cGUgPT0gMSkge1xyXG4gICAgICAgIC8vIEltYWdlIC0gb21pdCBBdXRob3IgYW5kIENvbW1lbnRDb3VudFxyXG4gICAgICAgIGNvbnN0IGltYWdlID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgRXh0ZW5zaW9uOiBpbWFnZS5FeHRlbnNpb24sXHJcbiAgICAgICAgICAgIEZpbGVuYW1lOiBpbWFnZS5GaWxlbmFtZSxcclxuICAgICAgICAgICAgSW1hZ2VJRDogaW1hZ2UuSW1hZ2VJRCxcclxuICAgICAgICAgICAgT3JpZ2luYWxVcmw6IGltYWdlLk9yaWdpbmFsVXJsLFxyXG4gICAgICAgICAgICBQcmV2aWV3VXJsOiBpbWFnZS5QcmV2aWV3VXJsLFxyXG4gICAgICAgICAgICBUaHVtYm5haWxVcmw6IGltYWdlLlRodW1ibmFpbFVybCxcclxuICAgICAgICAgICAgVXBsb2FkZWQ6IGltYWdlLlVwbG9hZGVkXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxhdGVzdC5UeXBlID09IDIpIHtcclxuICAgICAgICAvLyBDb21tZW50IC0gb21pdCBBdXRob3IgYW5kIERlbGV0ZWQgYW5kIFJlcGxpZXNcclxuICAgICAgICBjb25zdCBjb21tZW50ID0gbGF0ZXN0Lkl0ZW07XHJcbiAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgSUQ6IGNvbW1lbnQuSUQsXHJcbiAgICAgICAgICAgIFRleHQ6IGNvbW1lbnQuVGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogY29tbWVudC5JbWFnZUlELFxyXG4gICAgICAgICAgICBJbWFnZVVwbG9hZGVkQnk6IGNvbW1lbnQuSW1hZ2VVcGxvYWRlZEJ5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIElEOiBsYXRlc3QuSUQsXHJcbiAgICAgICAgVHlwZTogbGF0ZXN0LlR5cGUsXHJcbiAgICAgICAgSXRlbTogaXRlbSxcclxuICAgICAgICBPbjogbGF0ZXN0Lk9uLFxyXG4gICAgICAgIEF1dGhvcklEOiBsYXRlc3QuSXRlbS5BdXRob3IuSURcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHZpc2l0Q29tbWVudHMgPSAoY29tbWVudHMsIGZ1bmMpID0+IHtcclxuICAgIGNvbnN0IGdldFJlcGxpZXMgPSAoYykgPT4gYy5SZXBsaWVzID8gYy5SZXBsaWVzIDogW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGVwdGhGaXJzdFNlYXJjaChjb21tZW50c1tpXSwgZ2V0UmVwbGllcywgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZXB0aEZpcnN0U2VhcmNoID0gKGN1cnJlbnQsIGdldENoaWxkcmVuLCBmdW5jKSA9PiB7XHJcbiAgICBmdW5jKGN1cnJlbnQpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBnZXRDaGlsZHJlbihjdXJyZW50KTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKGNoaWxkcmVuW2ldLCBnZXRDaGlsZHJlbiwgZnVuYyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmlvbihhcnIxLCBhcnIyLCBlcXVhbGl0eUZ1bmMpIHtcclxuICAgIHZhciB1bmlvbiA9IGFycjEuY29uY2F0KGFycjIpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5pb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gaSsxOyBqIDwgdW5pb24ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGVxdWFsaXR5RnVuYyh1bmlvbltpXSwgdW5pb25bal0pKSB7XHJcbiAgICAgICAgICAgICAgICB1bmlvbi5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICBqLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVuaW9uO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXNlckVxdWFsaXR5ID0gKHVzZXIxLCB1c2VyMikgPT4ge1xyXG4gICAgaWYoIXVzZXIyIHx8ICF1c2VyMSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHVzZXIxLklEID09IHVzZXIyLklEO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGZvcm1hdFRleHQgPSAodGV4dCkgPT4ge1xyXG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICB2YXIgcmF3TWFya3VwID0gbWFya2VkKHRleHQsIHsgc2FuaXRpemU6IHRydWUgfSk7XHJcbiAgICByZXR1cm4geyBfX2h0bWw6IHJhd01hcmt1cCB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0V29yZHMgPSAodGV4dCwgbnVtYmVyT2ZXb3JkcykgPT4ge1xyXG4gICAgaWYoIXRleHQpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgcGxhaW5UZXh0ID0gcmVtb3ZlTWQodGV4dCk7XHJcbiAgICByZXR1cm4gcGxhaW5UZXh0LnNwbGl0KC9cXHMrLykuc2xpY2UoMCwgbnVtYmVyT2ZXb3Jkcykuam9pbihcIiBcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB0aW1lVGV4dCA9IChwb3N0ZWRPbikgPT4ge1xyXG4gICAgY29uc3QgYWdvID0gbW9tZW50KHBvc3RlZE9uKS5mcm9tTm93KCk7XHJcbiAgICBjb25zdCBkaWZmID0gbW9tZW50KCkuZGlmZihwb3N0ZWRPbiwgJ2hvdXJzJywgdHJ1ZSk7XHJcbiAgICBpZiAoZGlmZiA+PSAxMi41KSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBtb21lbnQocG9zdGVkT24pO1xyXG4gICAgICAgIHJldHVybiBcImQuIFwiICsgZGF0ZS5mb3JtYXQoXCJEIE1NTSBZWVlZIFwiKSArIFwia2wuIFwiICsgZGF0ZS5mb3JtYXQoXCJIOm1tXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBcImZvciBcIiArIGFnbztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc3BvbnNlSGFuZGxlciA9IChkaXNwYXRjaCwgcmVzcG9uc2UpID0+IHtcclxuICAgIGlmIChyZXNwb25zZS5vaykgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgNDAwOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0RXJyb3IobmV3IEh0dHBFcnJvcihcIjQwMCBCYWQgUmVxdWVzdFwiLCBcIlRoZSByZXF1ZXN0IHdhcyBub3Qgd2VsbC1mb3JtZWRcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDQgTm90IEZvdW5kXCIsIFwiQ291bGQgbm90IGZpbmQgcmVzb3VyY2VcIikpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwODpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI0MDggUmVxdWVzdCBUaW1lb3V0XCIsIFwiVGhlIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgaW4gdGltZVwiKSkpO1xyXG4gICAgICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKG5ldyBIdHRwRXJyb3IoXCI1MDAgU2VydmVyIEVycm9yXCIsIFwiU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgQVBJLXNlcnZlclwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRFcnJvcihuZXcgSHR0cEVycm9yKFwiT29wc1wiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG9uUmVqZWN0ID0gKCkgPT4geyB9XHJcbiIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IHsgdW5pb24sIHVzZXJFcXVhbGl0eSB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IHVzZXJzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfVVNFUjpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLnVzZXJdLCB1c2VyRXF1YWxpdHkpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi51c2VycztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGN1cnJlbnRVc2VySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9DVVJSRU5UX1VTRVJfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB1c2Vyc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgY3VycmVudFVzZXJJZCxcclxuICAgIHVzZXJzXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCB1c2Vyc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyB1bmlvbiB9IGZyb20gJy4uL3V0aWxpdGllcy91dGlscydcclxuXHJcbmNvbnN0IG93bmVySWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9JTUFHRVNfT1dORVI6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbWFnZXMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULkFERF9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKHN0YXRlLCBbYWN0aW9uLmltYWdlXSwgKGltZzEsIGltZzIpID0+IGltZzEuSW1hZ2VJRCA9PSBpbWcyLkltYWdlSUQpO1xyXG4gICAgICAgIGNhc2UgVC5SRUNJRVZFRF9VU0VSX0lNQUdFUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5pbWFnZXM7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmZpbHRlcihpbWcgPT4gaW1nLkltYWdlSUQgIT0gYWN0aW9uLmlkKTtcclxuICAgICAgICBjYXNlIFQuSU5DUl9DT01NRU5UX0NPVU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubWFwKGltZyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihpbWcuSW1hZ2VJRCA9PSBhY3Rpb24uaW1hZ2VJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZy5Db21tZW50Q291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWc7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVC5ERUNSX0NPTU1FTlRfQ09VTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYXAoaW1nID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGltZy5JbWFnZUlEID09IGFjdGlvbi5pbWFnZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nLkNvbW1lbnRDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGltZztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWQgPSAoc3RhdGUgPSAtMSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9TRUxFQ1RFRF9JTUc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaWQgfHwgLTE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZEltYWdlSWRzID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfU0VMRUNURURfSU1BR0VfSUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB1bmlvbihzdGF0ZSwgW2FjdGlvbi5pZF0sIChpZDEsIGlkMikgPT4gaWQxID09IGlkMik7XHJcbiAgICAgICAgY2FzZSBULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRDpcclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcihzdGF0ZSwgKGlkKSA9PiBpZCAhPSBhY3Rpb24uaWQpO1xyXG4gICAgICAgIGNhc2UgVC5DTEVBUl9TRUxFQ1RFRF9JTUFHRV9JRFM6XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGltYWdlc0luZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgb3duZXJJZCxcclxuICAgIGltYWdlcyxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZCxcclxuICAgIHNlbGVjdGVkSW1hZ2VJZHNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGltYWdlc0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuY29uc3QgY29tbWVudHMgPSAoc3RhdGUgPSBbXSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlJFQ0lFVkVEX0NPTU1FTlRTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmNvbW1lbnRzIHx8IFtdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2tpcCA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfU0tJUF9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5za2lwIHx8IDA7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB0YWtlID0gKHN0YXRlID0gMTAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVEFLRV9DT01NRU5UUzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfQ1VSUkVOVF9QQUdFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBhZ2UgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRvdGFsUGFnZXMgPSAoc3RhdGUgPSAxLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1RPVEFMX1BBR0VTOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRvdGFsUGFnZXMgfHwgMTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNvbW1lbnRzSW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjb21tZW50cyxcclxuICAgIHNraXAsXHJcbiAgICB0YWtlLFxyXG4gICAgcGFnZSxcclxuICAgIHRvdGFsUGFnZXNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbW1lbnRzSW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcblxyXG5leHBvcnQgY29uc3QgdGl0bGUgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX0VSUk9SX1RJVExFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRpdGxlIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZSA9IChzdGF0ZSA9IFwiXCIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfRVJST1JfTUVTU0FHRTpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5tZXNzYWdlIHx8IFwiXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBlcnJvckluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdGl0bGUsXHJcbiAgICBtZXNzYWdlXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXJyb3JJbmZvOyIsIu+7v2ltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgKiBhcyBUIGZyb20gJy4uL2NvbnN0YW50cy90eXBlcydcclxuaW1wb3J0IGVycm9ySW5mbyBmcm9tICcuL2Vycm9yJ1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhc0Vycm9yID0gKHN0YXRlID0gZmFsc2UsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfSEFTX0VSUk9SOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhc0Vycm9yO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAoc3RhdGUgPSBcIlwiLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkb25lID0gKHN0YXRlID0gdHJ1ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzdGF0dXNJbmZvID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGhhc0Vycm9yLFxyXG4gICAgZXJyb3JJbmZvLFxyXG4gICAgbWVzc2FnZSxcclxuICAgIGRvbmVcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0YXR1c0luZm87Iiwi77u/aW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5cclxuXHJcbmNvbnN0IHNraXAgPSAoc3RhdGUgPSAwLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFQuU0VUX1NLSVBfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnNraXAgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRha2UgPSAoc3RhdGUgPSAxMCwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBULlNFVF9UQUtFX1dIQVRTX05FVzpcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi50YWtlIHx8IDEwO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGFnZSA9IChzdGF0ZSA9IDEsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfUEFHRV9XSEFUU19ORVc6XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGFnZSB8fCAxO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdG90YWxQYWdlcyA9IChzdGF0ZSA9IDAsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5TRVRfVE9UQUxfUEFHRVNfV0hBVFNfTkVXOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnRvdGFsUGFnZXMgfHwgMDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGl0ZW1zID0gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVC5BRERfTEFURVNUOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmxhdGVzdCB8fCBbXTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHdoYXRzTmV3SW5mbyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBza2lwLFxyXG4gICAgdGFrZSxcclxuICAgIHBhZ2UsXHJcbiAgICB0b3RhbFBhZ2VzLFxyXG4gICAgaXRlbXNcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdoYXRzTmV3SW5mbzsiLCLvu79pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0IHVzZXJzSW5mbyBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgaW1hZ2VzSW5mbyBmcm9tICcuL2ltYWdlcydcclxuaW1wb3J0IGNvbW1lbnRzSW5mbyBmcm9tICcuL2NvbW1lbnRzJ1xyXG5pbXBvcnQgc3RhdHVzSW5mbyBmcm9tICcuL3N0YXR1cydcclxuaW1wb3J0IHdoYXRzTmV3SW5mbyBmcm9tICcuL3doYXRzbmV3J1xyXG5cclxuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgdXNlcnNJbmZvLFxyXG4gICAgaW1hZ2VzSW5mbyxcclxuICAgIGNvbW1lbnRzSW5mbyxcclxuICAgIHN0YXR1c0luZm8sXHJcbiAgICB3aGF0c05ld0luZm9cclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyIiwi77u/aW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgdGh1bmsgZnJvbSAncmVkdXgtdGh1bmsnXHJcbmltcG9ydCByb290UmVkdWNlciBmcm9tICcuLi9yZWR1Y2Vycy9yb290J1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocm9vdFJlZHVjZXIsIGFwcGx5TWlkZGxld2FyZSh0aHVuaykpIiwi77u/ZXhwb3J0IGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnXHJcbn0iLCLvu79pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCAqIGFzIFQgZnJvbSAnLi4vY29uc3RhbnRzL3R5cGVzJ1xyXG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cydcclxuaW1wb3J0IHsgSHR0cEVycm9yLCBzZXRFcnJvciB9IGZyb20gJy4vZXJyb3InXHJcbmltcG9ydCB7IHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5jb25zdCBnZXRVcmwgPSAodXNlcm5hbWUpID0+IGdsb2JhbHMudXJscy51c2VycyArICc/dXNlcm5hbWU9JyArIHVzZXJuYW1lO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRVc2VySWQoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfQ1VSUkVOVF9VU0VSX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXIodXNlcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9VU0VSLFxyXG4gICAgICAgIHVzZXI6IHVzZXJcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNpZXZlZFVzZXJzKHVzZXJzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuUkVDSUVWRURfVVNFUlMsXHJcbiAgICAgICAgdXNlcnM6IHVzZXJzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRDdXJyZW50VXNlcklkKHVzZXIuSUQpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIodXNlcikpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFVzZXIodXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICB2YXIgdXJsID0gZ2V0VXJsKHVzZXJuYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCwgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlciA9PiBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hVc2VycygpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGdsb2JhbHMudXJscy51c2Vycywgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4odXNlcnMgPT4gZGlzcGF0Y2gocmVjaWV2ZWRVc2Vycyh1c2VycykpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBMaW5rLCBJbmRleExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBOYXZMaW5rIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQgaXNBY3RpdmUgPSB0aGlzLmNvbnRleHQucm91dGVyLmlzQWN0aXZlKHRoaXMucHJvcHMudG8sIHRydWUpLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBpc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG4gICAgICAgICAgICAgICAgPExpbmsgey4uLnRoaXMucHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuTmF2TGluay5jb250ZXh0VHlwZXMgPSB7XHJcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5vYmplY3RcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZGV4TmF2TGluayBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5jb250ZXh0LnJvdXRlci5pc0FjdGl2ZSh0aGlzLnByb3BzLnRvLCB0cnVlKSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICAgICAgICAgIDxJbmRleExpbmsgey4uLnRoaXMucHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9JbmRleExpbms+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5JbmRleE5hdkxpbmsuY29udGV4dFR5cGVzID0ge1xyXG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFJvdywgQ29sLCBBbGVydCB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjbGVhckVycm9yLCB0aXRsZSwgbWVzc2FnZSAgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEFsZXJ0IGJzU3R5bGU9XCJkYW5nZXJcIiBvbkRpc21pc3M9e2NsZWFyRXJyb3J9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57bWVzc2FnZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQWxlcnQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluaywgSW5kZXhMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBOYXZMaW5rLCBJbmRleE5hdkxpbmsgfSBmcm9tICcuL3dyYXBwZXJzL0xpbmtzJ1xyXG5pbXBvcnQgeyBFcnJvciB9IGZyb20gJy4vY29udGFpbmVycy9FcnJvcidcclxuaW1wb3J0IHsgY2xlYXJFcnJvciB9IGZyb20gJy4uL2FjdGlvbnMvZXJyb3InXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgR3JpZCwgTmF2YmFyLCBOYXYgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaGFzRXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uaGFzRXJyb3IsXHJcbiAgICAgICAgZXJyb3I6IHN0YXRlLnN0YXR1c0luZm8uZXJyb3JJbmZvXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xlYXJFcnJvcjogKCkgPT4gZGlzcGF0Y2goY2xlYXJFcnJvcigpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTaGVsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBlcnJvclZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgY2xlYXJFcnJvciwgZXJyb3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgbWVzc2FnZSB9ID0gZXJyb3I7XHJcbiAgICAgICAgcmV0dXJuIChoYXNFcnJvciA/XHJcbiAgICAgICAgICAgIDxFcnJvclxyXG4gICAgICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17bWVzc2FnZX1cclxuICAgICAgICAgICAgICAgIGNsZWFyRXJyb3I9e2NsZWFyRXJyb3J9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAgPEdyaWQgZmx1aWQ9e3RydWV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxOYXZiYXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZiYXIuSGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci5CcmFuZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIi9cIiBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIj5JbnVwbGFuIEludHJhbmV0PC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXZiYXIuQnJhbmQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRvZ2dsZSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L05hdmJhci5IZWFkZXI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLkNvbGxhcHNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5kZXhOYXZMaW5rIHRvPVwiL1wiPkZvcnNpZGU8L0luZGV4TmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayB0bz1cIi91c2Vyc1wiPkJydWdlcmU8L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgdG89XCIvYWJvdXRcIj5PbTwvTmF2TGluaz4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2YmFyLlRleHQgcHVsbFJpZ2h0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhlaiwge2dsb2JhbHMuY3VycmVudFVzZXJuYW1lfSFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLlRleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTmF2YmFyLkNvbGxhcHNlPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8L05hdmJhcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZXJyb3JWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9HcmlkPlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBNYWluID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoU2hlbGwpO1xyXG5leHBvcnQgZGVmYXVsdCBNYWluOyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFib3V0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJPbVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTIgY29sLWxnLThcIj5cclxuICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRGV0dGUgZXIgZW4gc2luZ2xlIHBhZ2UgYXBwbGljYXRpb24hXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUZWtub2xvZ2llciBicnVndDpcclxuICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVhY3Q8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVkdXg8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+UmVhY3RSb3V0ZXI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+QXNwLm5ldCBDb3JlIFJDIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+QXNwLm5ldCBXZWIgQVBJIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi9lcnJvcidcclxuaW1wb3J0IHsgcmVzcG9uc2VIYW5kbGVyLCBvblJlamVjdCwgbm9ybWFsaXplTGF0ZXN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSAnLi91c2VycydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRMYXRlc3QobGF0ZXN0KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX0xBVEVTVCxcclxuICAgICAgICBsYXRlc3Q6IGxhdGVzdFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0U0tpcChza2lwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1NLSVBfV0hBVFNfTkVXLFxyXG4gICAgICAgIHNraXA6IHNraXBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFRha2UodGFrZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UQUtFX1dIQVRTX05FVyxcclxuICAgICAgICB0YWtlOiB0YWtlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRQYWdlKHBhZ2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfUEFHRV9XSEFUU19ORVcsXHJcbiAgICAgICAgcGFnZTogcGFnZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VG90YWxQYWdlcyh0b3RhbFBhZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RPVEFMX1BBR0VTX1dIQVRTX05FVyxcclxuICAgICAgICB0b3RhbFBhZ2VzOiB0b3RhbFBhZ2VzXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaExhdGVzdE5ld3Moc2tpcCwgdGFrZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLndoYXRzbmV3ICsgXCI/c2tpcD1cIiArIHNraXAgKyBcIiZ0YWtlPVwiICsgdGFrZTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKHBhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBwYWdlLkN1cnJlbnRJdGVtcztcclxuICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gaXRlbS5JdGVtLkF1dGhvcjtcclxuICAgICAgICAgICAgICAgICAgICBpZihhdXRob3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIoYXV0aG9yKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZXNldCBpbmZvXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRTS2lwKHNraXApKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRha2UodGFrZSkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0UGFnZShwYWdlLkN1cnJlbnRQYWdlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRUb3RhbFBhZ2VzKHBhZ2UuVG90YWxQYWdlcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBpdGVtcy5maWx0ZXIoaXRlbSA9PiBCb29sZWFuKGl0ZW0uSXRlbS5BdXRob3IpKS5tYXAobm9ybWFsaXplTGF0ZXN0KTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZExhdGVzdChub3JtYWxpemVkKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1JbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudFByb2ZpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJtZWRpYS1vYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cIi9pbWFnZXMvcGVyc29uX2ljb24uc3ZnXCJcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLWhvbGRlci1yZW5kZXJlZD1cInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjY0cHhcIiwgaGVpZ2h0OiBcIjY0cHhcIiB9fVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudFByb2ZpbGUgfSBmcm9tICcuLi9jb21tZW50cy9Db21tZW50UHJvZmlsZSdcclxuaW1wb3J0IHsgZm9ybWF0VGV4dCwgZ2V0V29yZHMsIHRpbWVUZXh0IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBNZWRpYSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCdcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGF0c05ld0l0ZW1Db21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNyZWF0ZVN1bW1hcnkoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBmb3JtYXRUZXh0KFwiXFxcIlwiICsgZ2V0V29yZHModGV4dCwgNSkgKyBcIi4uLlwiICsgXCJcXFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bGxuYW1lKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBhdXRob3IuRmlyc3ROYW1lICsgJyAnICsgYXV0aG9yLkxhc3ROYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHdoZW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBvbiB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJzYWdkZSBcIiArIHRpbWVUZXh0KG9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZUlkLCB1cGxvYWRlZEJ5IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGF1dGhvciA9IHRoaXMuZnVsbG5hbWUoKTtcclxuICAgICAgICBjb25zdCBzdW1tYXJ5ID0gdGhpcy5jcmVhdGVTdW1tYXJ5KCk7XHJcbiAgICAgICAgY29uc3QgbGlua1RvSW1hZ2UgPSB1cGxvYWRlZEJ5LlVzZXJuYW1lICsgXCIvZ2FsbGVyeS9pbWFnZS9cIiArIGltYWdlSWQ7XHJcbiAgICAgICAgcmV0dXJuICA8TWVkaWEuTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRQcm9maWxlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1lZGlhLkJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJtZWRpYS1oZWFkaW5nXCI+e2F1dGhvcn0gPHNtYWxsPnt0aGlzLndoZW4oKX08L3NtYWxsPjwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZW0+PHNwYW4gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3N1bW1hcnl9Pjwvc3Bhbj48L2VtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2xpbmtUb0ltYWdlfT5TZSBrb21tZW50YXI8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9NZWRpYS5Cb2R5PlxyXG4gICAgICAgICAgICAgICAgPC9NZWRpYS5MaXN0SXRlbT5cclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFdoYXRzTmV3SXRlbUltYWdlIH0gZnJvbSAnLi9XaGF0c05ld0l0ZW1JbWFnZSdcclxuaW1wb3J0IHsgV2hhdHNOZXdJdGVtQ29tbWVudCB9IGZyb20gJy4vV2hhdHNOZXdJdGVtQ29tbWVudCdcclxuaW1wb3J0IHsgTWVkaWEgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5leHBvcnQgY2xhc3MgV2hhdHNOZXdMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdEl0ZW1zKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbXMsIGdldFVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgZ2VuZXJhdGVLZXkgPSAoaWQpID0+IFwid2hhdHNuZXdfXCIgKyBpZDtcclxuICAgICAgICByZXR1cm4gaXRlbXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhdXRob3IgPSBnZXRVc2VyKGl0ZW0uQXV0aG9ySUQpO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtS2V5ID0gZ2VuZXJhdGVLZXkoaXRlbS5JRCk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICA8V2hhdHNOZXdJdGVtSW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17aXRlbS5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtPXtpdGVtLkl0ZW19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb249e2l0ZW0uT259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9yPXthdXRob3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtS2V5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIDxXaGF0c05ld0l0ZW1Db21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2l0ZW0uSUR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17aXRlbS5JdGVtLlRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWRCeT17aXRlbS5JdGVtLkltYWdlVXBsb2FkZWRCeX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXtpdGVtLkl0ZW0uSW1hZ2VJRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbj17aXRlbS5Pbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I9e2F1dGhvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW1LZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbU5vZGVzID0gdGhpcy5jb25zdHJ1Y3RJdGVtcygpO1xyXG4gICAgICAgIHJldHVybiAgPE1lZGlhLkxpc3Q+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW1Ob2Rlc31cclxuICAgICAgICAgICAgICAgIDwvTWVkaWEuTGlzdD5cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgZmluZCB9IGZyb20gJ3VuZGVyc2NvcmUnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgZmV0Y2hMYXRlc3ROZXdzIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy93aGF0c25ldydcclxuaW1wb3J0IHsgV2hhdHNOZXdMaXN0IH0gZnJvbSAnLi4vV2hhdHNOZXcvV2hhdHNOZXdMaXN0J1xyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldExhdGVzdDogKHNraXAsIHRha2UpID0+IGRpc3BhdGNoKGZldGNoTGF0ZXN0TmV3cyhza2lwLCB0YWtlKSlcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGl0ZW1zOiBzdGF0ZS53aGF0c05ld0luZm8uaXRlbXMsXHJcbiAgICAgICAgZ2V0VXNlcjogKGlkKSA9PiBmaW5kKHN0YXRlLnVzZXJzSW5mby51c2VycywgKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuSUQgPT0gaWQ7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgc2tpcDogc3RhdGUud2hhdHNOZXdJbmZvLnNraXAsXHJcbiAgICAgICAgdGFrZTogc3RhdGUud2hhdHNOZXdJbmZvLnRha2VcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgV2hhdHNOZXdDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBnZXRMYXRlc3QsIHNraXAsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZ2V0TGF0ZXN0KHNraXAsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1zLCBnZXRVc2VyIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8aDM+U2lkc3RlIG55dDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPFdoYXRzTmV3TGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcz17aXRlbXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFVzZXI9e2dldFVzZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBXaGF0c05ldyA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFdoYXRzTmV3Q29udGFpbmVyKVxyXG5leHBvcnQgZGVmYXVsdCBXaGF0c05ldzsiLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IFdoYXRzTmV3IGZyb20gJy4vV2hhdHNOZXcnXHJcbmltcG9ydCB7IEp1bWJvdHJvbiwgR3JpZCwgUm93LCBDb2wgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IHVzZXIgPSBzdGF0ZS51c2Vyc0luZm8udXNlcnMuZmlsdGVyKHUgPT4gdS5Vc2VybmFtZS50b1VwcGVyQ2FzZSgpID09IGdsb2JhbHMuY3VycmVudFVzZXJuYW1lLnRvVXBwZXJDYXNlKCkpWzBdO1xyXG4gICAgY29uc3QgbmFtZSA9IHVzZXIgPyB1c2VyLkZpcnN0TmFtZSA6ICdVc2VyJztcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBIb21lVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IFwiRm9yc2lkZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IG5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuICA8Um93PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgbGdPZmZzZXQ9ezJ9IGxnPXs4fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEp1bWJvdHJvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT5WZWxrb21tZW4gPHNtYWxsPntuYW1lfSE8L3NtYWxsPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJsZWFkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGlsIEludXBsYW5zIGludHJhbmV0IHNpZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvSnVtYm90cm9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8V2hhdHNOZXcgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDwvUm93PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBIb21lID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKEhvbWVWaWV3KVxyXG5leHBvcnQgZGVmYXVsdCBIb21lIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBlbWFpbCA9IFwibWFpbHRvOlwiICsgdGhpcy5wcm9wcy5lbWFpbDtcclxuICAgICAgICB2YXIgZ2FsbGVyeSA9IFwiL1wiICsgdGhpcy5wcm9wcy51c2VybmFtZSArIFwiL2dhbGxlcnlcIjtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0zIHBhbmVsIHBhbmVsLWRlZmF1bHRcIiBzdHlsZT17eyBwYWRkaW5nVG9wOiBcIjhweFwiLCBwYWRkaW5nQm90dG9tOiBcIjhweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+QnJ1Z2VybmF2bjwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMudXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkZvcm5hdm48L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmZpcnN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+RWZ0ZXJuYXZuPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5sYXN0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+RW1haWw8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2VtYWlsfT57dGhpcy5wcm9wcy5lbWFpbH08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPkJpbGxlZGVyPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17Z2FsbGVyeX0+QmlsbGVkZXI8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi9Vc2VyJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHVzZXJOb2RlcygpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB1c2Vycy5tYXAoKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlcklkID0gYHVzZXJJZF8ke3VzZXIuSUR9YDtcclxuICAgICAgICAgICAgcmV0dXJuICg8VXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VyLlVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZD17dXNlci5JRH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU9e3VzZXIuRmlyc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lPXt1c2VyLkxhc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsPXt1c2VyLkVtYWlsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGVVcmw9e3VzZXIuUHJvZmlsZUltYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVzPXt1c2VyLlJvbGVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17dXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgLz4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB1c2VycyA9IHRoaXMudXNlck5vZGVzKCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIHt1c2Vyc31cclxuICAgICAgICAgICAgPC9kaXY+KVxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IGZldGNoVXNlcnMgfSBmcm9tICcuLi8uLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgeyBVc2VyTGlzdCB9IGZyb20gJy4uL3VzZXJzL1VzZXJMaXN0J1xyXG5cclxuY29uc3QgbWFwVXNlcnNUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVzZXJzOiBzdGF0ZS51c2Vyc0luZm8udXNlcnNcclxuICAgIH07XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRVc2VyczogKCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChmZXRjaFVzZXJzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIFVzZXJzQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJCcnVnZXJlXCI7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5nZXRVc2VycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMiBjb2wtbGctOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZS1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxPkludXBsYW4ncyA8c21hbGw+YnJ1Z2VyZTwvc21hbGw+PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VXNlckxpc3QgdXNlcnM9e3VzZXJzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFVzZXJzID0gY29ubmVjdChtYXBVc2Vyc1RvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVXNlcnNDb250YWluZXIpXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJzXHJcbiIsIu+7v2ltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuaW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCB7IG9wdGlvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgeyBhZGRVc2VyIH0gZnJvbSAnLi91c2VycydcclxuaW1wb3J0IHsgbm9ybWFsaXplSW1hZ2UgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IEh0dHBFcnJvciwgc2V0RXJyb3IgfSBmcm9tICcuL2Vycm9yJ1xyXG5pbXBvcnQgeyByZXNwb25zZUhhbmRsZXIsIG9uUmVqZWN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3V0aWxzJ1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRJbWFnZXNPd25lcihpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9JTUFHRVNfT1dORVIsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjaWV2ZWRVc2VySW1hZ2VzKGltYWdlcykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFQ0lFVkVEX1VTRVJfSU1BR0VTLFxyXG4gICAgICAgIGltYWdlczogaW1hZ2VzXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0U2VsZWN0ZWRJbWcgPSAoaWQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfU0VMRUNURURfSU1HLFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEltYWdlKGltZykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkFERF9JTUFHRSxcclxuICAgICAgICBpbWFnZTogaW1nXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSW1hZ2UoaWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRU1PVkVfSU1BR0UsXHJcbiAgICAgICAgaWQ6IGlkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkU2VsZWN0ZWRJbWFnZUlkKGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQUREX1NFTEVDVEVEX0lNQUdFX0lELFxyXG4gICAgICAgIGlkOiBpZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZChpZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlJFTU9WRV9TRUxFQ1RFRF9JTUFHRV9JRCxcclxuICAgICAgICBpZDogaWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhclNlbGVjdGVkSW1hZ2VJZHMoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuQ0xFQVJfU0VMRUNURURfSU1BR0VfSURTXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZSArIFwiJmlkPVwiICsgaWQ7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlcilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZGlzcGF0Y2gocmVtb3ZlSW1hZ2UoaWQpKSwgb25SZWplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkSW1hZ2UodXNlcm5hbWUsIGZvcm1EYXRhKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpLCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuaW1hZ2VzICsgXCI/dXNlcm5hbWU9XCIgKyB1c2VybmFtZTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHJlc3BvbnNlSGFuZGxlci5iaW5kKHRoaXMsIGRpc3BhdGNoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25TdWNjZXNzID0gKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IGRhdGEubWFwKG5vcm1hbGl6ZUltYWdlKS5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2lldmVkVXNlckltYWdlcyhub3JtYWxpemVkKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAudGhlbihvblN1Y2Nlc3MsIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgaW1hZ2VJZHMgPSBbXSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRpc3BhdGNoKSB7XHJcbiAgICAgICAgY29uc3QgaWRzID0gaW1hZ2VJZHMuam9pbigpO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5pbWFnZXMgKyBcIj91c2VybmFtZT1cIiArIHVzZXJuYW1lICsgXCImaWRzPVwiICsgaWRzO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBvcHQpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKGNsZWFyU2VsZWN0ZWRJbWFnZUlkcygpKSwgb25SZWplY3QpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGRpc3BhdGNoKGZldGNoVXNlckltYWdlcyh1c2VybmFtZSkpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEltYWdlT3duZXIodXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICAvLyBMYXp5IGV2YWx1YXRpb25cclxuICAgICAgICBjb25zdCBmaW5kT3duZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaW5kKGdldFN0YXRlKCkudXNlcnNJbmZvLnVzZXJzLCAodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXIuVXNlcm5hbWUgPT0gdXNlcm5hbWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG93bmVyID0gZmluZE93bmVyKCk7XHJcblxyXG4gICAgICAgIGlmKG93bmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG93bmVySWQgPSBvd25lci5JRDtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0SW1hZ2VzT3duZXIob3duZXJJZCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gZ2xvYmFscy51cmxzLnVzZXJzICsgJz91c2VybmFtZT0nICsgdXNlcm5hbWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSByZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4odXNlciA9PiBkaXNwYXRjaChhZGRVc2VyKHVzZXIpKSwgb25SZWplY3QpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIgPSBmaW5kT3duZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRJbWFnZXNPd25lcihvd25lci5JRCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBwcm9taXNlR2V0SW1hZ2UgPSAoaWQsIGdldFN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBpbWFnZXMgPSBnZXRTdGF0ZSgpLmltYWdlc0luZm8uaW1hZ2VzO1xyXG4gICAgICAgIGNvbnN0IGltYWdlID0gZmluZChpbWFnZXMsIChpbWcpID0+IGltZy5JbWFnZUlEID09IGlkKTtcclxuXHJcbiAgICAgICAgaWYoaW1hZ2UpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZWplY3QoRXJyb3IoXCJJbWFnZSBkb2VzIG5vdCBleGlzdCBsb2NhbGx5IVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFNpbmdsZUltYWdlKGlkKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gZ2xvYmFscy51cmxzLmltYWdlcyArIFwiL2dldGJ5aWQ/aWQ9XCIgKyBpZDtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZighaW1nKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub3JtYWxpemVkSW1hZ2UgPSBub3JtYWxpemVJbWFnZShpbWcpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goYWRkSW1hZ2Uobm9ybWFsaXplZEltYWdlKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcklucHV0KGZpbGVJbnB1dCkge1xyXG4gICAgICAgIGlmKGZpbGVJbnB1dC52YWx1ZSl7XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnOyAvL2ZvciBJRTExLCBsYXRlc3QgQ2hyb21lL0ZpcmVmb3gvT3BlcmEuLi5cclxuICAgICAgICAgICAgfWNhdGNoKGVycil7IH1cclxuICAgICAgICAgICAgaWYoZmlsZUlucHV0LnZhbHVlKXsgLy9mb3IgSUU1IH4gSUUxMFxyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IGZpbGVJbnB1dC5wYXJlbnROb2RlLCByZWYgPSBmaWxlSW5wdXQubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGZpbGVJbnB1dCk7XHJcbiAgICAgICAgICAgICAgICBmb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShmaWxlSW5wdXQscmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWxlcygpIHtcclxuICAgICAgICBjb25zdCBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZXNcIik7XHJcbiAgICAgICAgcmV0dXJuIChmaWxlcyA/IGZpbGVzLmZpbGVzIDogW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVN1Ym1pdChlKSB7XHJcbiAgICAgICAgY29uc3QgeyB1cGxvYWRJbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5nZXRGaWxlcygpO1xyXG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xyXG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSk7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlc1wiKTtcclxuICAgICAgICB0aGlzLmNsZWFySW5wdXQoZmlsZUlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVCdG4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYXNJbWFnZXMsIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoaGFzSW1hZ2VzID9cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCIgb25DbGljaz17ZGVsZXRlU2VsZWN0ZWRJbWFnZXN9PlNsZXQgbWFya2VyZXQgYmlsbGVkZXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXJcIiBvbkNsaWNrPXtkZWxldGVTZWxlY3RlZEltYWdlc30gZGlzYWJsZWQ9XCJkaXNhYmxlZFwiPlNsZXQgbWFya2VyZXQgYmlsbGVkZXI8L2J1dHRvbj4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGJyIC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJmb3JtLXVwbG9hZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jdHlwZT1cIm11bHRpcGFydC9mb3JtLWRhdGFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZmlsZXNcIj5VcGxvYWQgZmlsZXI6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImZpbGVzXCIgbmFtZT1cImZpbGVzXCIgbXVsdGlwbGUgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgaWQ9XCJ1cGxvYWRcIj5VcGxvYWQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsnXFx1MDBBMCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5kZWxldGVCdG4oKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgLy8gQmluZCAndGhpcycgdG8gZnVuY3Rpb25zXHJcbiAgICAgICAgdGhpcy5jaGVja2JveEhhbmRsZXIgPSB0aGlzLmNoZWNrYm94SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrYm94SGFuZGxlcihlKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBhZGQgPSBlLmN1cnJlbnRUYXJnZXQuY2hlY2tlZDtcclxuICAgICAgICBpZihhZGQpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBhZGRTZWxlY3RlZEltYWdlSWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZChpbWFnZS5JbWFnZUlEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICByZW1vdmVTZWxlY3RlZEltYWdlSWQoaW1hZ2UuSW1hZ2VJRCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbW1lbnRJY29uKGNvdW50KSB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBjb3VudCA9PSAwID8gXCJjb2wtbGctNiB0ZXh0LW11dGVkXCIgOiBcImNvbC1sZy02IHRleHQtcHJpbWFyeVwiO1xyXG4gICAgICAgIGNvbnN0IHByb3BzID0ge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IHN0eWxlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuICA8ZGl2IHsuLi4gcHJvcHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tY29tbWVudFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4ge2NvdW50fSAgIFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tib3hWaWV3KCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2FuRWRpdCwgaW1hZ2VJc1NlbGVjdGVkLCBpbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBjaGVja2VkID0gaW1hZ2VJc1NlbGVjdGVkKGltYWdlLkltYWdlSUQpO1xyXG4gICAgICAgIHJldHVybiAoY2FuRWRpdCA/IFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy02IHB1bGwtcmlnaHQgdGV4dC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIFNsZXQgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uQ2xpY2s9e3RoaXMuY2hlY2tib3hIYW5kbGVyfSBjaGVja2VkPXtjaGVja2VkfSAvPiBcclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxucmVuZGVyKCkge1xyXG4gICAgY29uc3QgeyBpbWFnZSwgdXNlcm5hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBsZXQgY291bnQgPSBpbWFnZS5Db21tZW50Q291bnQ7XHJcbiAgICByZXR1cm4gIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8TGluayB0bz17YC8ke3VzZXJuYW1lfS9nYWxsZXJ5L2ltYWdlLyR7aW1hZ2UuSW1hZ2VJRH1gfT5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2UuUHJldmlld1VybH0gY2xhc3NOYW1lPVwiaW1nLXRodW1ibmFpbFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtgLyR7dXNlcm5hbWV9L2dhbGxlcnkvaW1hZ2UvJHtpbWFnZS5JbWFnZUlEfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5jb21tZW50SWNvbihjb3VudCl9IFxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5jaGVja2JveFZpZXcoKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxufVxyXG4gICAgICAgICAgICAgICAgLy88YSBvbkNsaWNrPXt0aGlzLnNlbGVjdEltYWdlfSBzdHlsZT17e2N1cnNvcjogXCJwb2ludGVyXCIsIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIn19PlxyXG4gICAgICAgICAgICAgICAgLy88L2E+XHJcblxyXG4gICAgICAgIC8vcmV0dXJuICggY291bnQgPT0gMCA/XHJcbiAgICAgICAgLy8gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNiB0ZXh0LW11dGVkXCI+IFxyXG4gICAgICAgIC8vICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNvbW1lbnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IHtjb3VudH1cclxuICAgICAgICAvLyAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICA6XHJcbiAgICAgICAgLy8gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNiB0ZXh0LXByaW1hcnlcIiBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJyB9fT5cclxuICAgICAgICAvLyAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1jb21tZW50XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiB7Y291bnR9XHJcbiAgICAgICAgLy8gICAgPC9kaXY+XHJcbiAgICAgICAgLy8pOyIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tICcuL0ltYWdlJ1xyXG5cclxuY29uc3QgZWxlbWVudHNQZXJSb3cgPSA0O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2VMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGFycmFuZ2VBcnJheShpbWFnZXMpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSBpbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHRpbWVzID0gTWF0aC5jZWlsKGxlbmd0aCAvIGVsZW1lbnRzUGVyUm93KTtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGxldCBzdGFydCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aW1lczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0ID0gaSAqIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIGVsZW1lbnRzUGVyUm93O1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZW5kID4gbGVuZ3RoO1xyXG4gICAgICAgICAgICBpZihsYXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBpbWFnZXMuc2xpY2Uoc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGltYWdlcy5zbGljZShzdGFydCwgZW5kKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW1hZ2VzVmlldyhpbWFnZXMpIHtcclxuICAgICAgICBpZihpbWFnZXMubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHsgYWRkU2VsZWN0ZWRJbWFnZUlkLCByZW1vdmVTZWxlY3RlZEltYWdlSWQsIGRlbGV0ZVNlbGVjdGVkSW1hZ2VzLCBjYW5FZGl0LCBpbWFnZUlzU2VsZWN0ZWQsIHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYXJyYW5nZUFycmF5KGltYWdlcyk7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHJlc3VsdC5tYXAoKHJvdywgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpbWdzID0gcm93Lm1hcCgoaW1nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTNcIiBrZXk9e2ltZy5JbWFnZUlEfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZT17aW1nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNlbGVjdGVkSW1hZ2VJZD17YWRkU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkPXtyZW1vdmVTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlzU2VsZWN0ZWQ9e2ltYWdlSXNTZWxlY3RlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgcm93SWQgPSBcInJvd0lkXCIgKyBpO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBrZXk9e3Jvd0lkfT5cclxuICAgICAgICAgICAgICAgICAgICB7aW1nc31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlldztcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW1hZ2VzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAge3RoaXMuaW1hZ2VzVmlldyhpbWFnZXMpfVxyXG4gICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgdXBsb2FkSW1hZ2UsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgIGRlbGV0ZUltYWdlcywgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkLCBjbGVhclNlbGVjdGVkSW1hZ2VJZHMgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2ltYWdlcydcclxuaW1wb3J0IHsgRXJyb3IgfSBmcm9tICcuL0Vycm9yJ1xyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZCB9IGZyb20gJy4uL2ltYWdlcy9JbWFnZVVwbG9hZCdcclxuaW1wb3J0IEltYWdlTGlzdCBmcm9tICcuLi9pbWFnZXMvSW1hZ2VMaXN0J1xyXG5pbXBvcnQgeyBmaW5kIH0gZnJvbSAndW5kZXJzY29yZSdcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlcidcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG4gICAgY29uc3Qgb3duZXJJZCAgPSBzdGF0ZS5pbWFnZXNJbmZvLm93bmVySWQ7XHJcbiAgICBjb25zdCBjdXJyZW50SWQgPSBzdGF0ZS51c2Vyc0luZm8uY3VycmVudFVzZXJJZDtcclxuICAgIGNvbnN0IGNhbkVkaXQgPSAob3duZXJJZCA+IDAgJiYgY3VycmVudElkID4gMCAmJiBvd25lcklkID09IGN1cnJlbnRJZCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbWFnZXM6IHN0YXRlLmltYWdlc0luZm8uaW1hZ2VzLFxyXG4gICAgICAgIGNhbkVkaXQ6IGNhbkVkaXQsXHJcbiAgICAgICAgc2VsZWN0ZWRJbWFnZUlkczogc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWRzLFxyXG4gICAgICAgIGdldEZ1bGxuYW1lOiAodXNlcm5hbWUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHN0YXRlLnVzZXJzSW5mby51c2Vycy5maWx0ZXIodSA9PiB1LlVzZXJuYW1lLnRvVXBwZXJDYXNlKCkgPT0gdXNlcm5hbWUudG9VcHBlckNhc2UoKSlbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IGZ1bGxuYW1lID0gKHVzZXIpID8gdXNlci5GaXJzdE5hbWUgKyBcIiBcIiArIHVzZXIuTGFzdE5hbWUgOiAnVXNlcic7XHJcbiAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwbG9hZEltYWdlOiAodXNlcm5hbWUsIGZvcm1EYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHVwbG9hZEltYWdlKHVzZXJuYW1lLCBmb3JtRGF0YSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgLy8gSW1hZ2VzIHRvIGJlIGRlbGV0ZWQgYnkgc2VsZWN0aW9uOlxyXG4gICAgICAgICAgICBkaXNwYXRjaChhZGRTZWxlY3RlZEltYWdlSWQoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZDogKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEltYWdlcyB0byBiZSBkZWxldGVkIGJ5IHNlbGVjdGlvbjpcclxuICAgICAgICAgICAgZGlzcGF0Y2gocmVtb3ZlU2VsZWN0ZWRJbWFnZUlkKGlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJbWFnZXM6ICh1c2VybmFtZSwgaWRzKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUltYWdlcyh1c2VybmFtZSwgaWRzKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGVhclNlbGVjdGVkSW1hZ2VJZHM6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goY2xlYXJTZWxlY3RlZEltYWdlSWRzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXNlckltYWdlc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmltYWdlSXNTZWxlY3RlZCA9IHRoaXMuaW1hZ2VJc1NlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVTZWxlY3RlZEltYWdlcyA9IHRoaXMuZGVsZXRlU2VsZWN0ZWRJbWFnZXMuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0ZWQgPSB0aGlzLmNsZWFyU2VsZWN0ZWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IHJvdXRlciwgcm91dGUgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gdXNlcm5hbWUgKyBcIidzIGJpbGxlZGVyXCI7XHJcbiAgICAgICAgcm91dGVyLnNldFJvdXRlTGVhdmVIb29rKHJvdXRlLCB0aGlzLmNsZWFyU2VsZWN0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyU2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjbGVhclNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY2xlYXJTZWxlY3RlZEltYWdlSWRzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaW1hZ2VJc1NlbGVjdGVkKGNoZWNrSWQpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgcmVzID0gZmluZChzZWxlY3RlZEltYWdlSWRzLCAoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkID09IGNoZWNrSWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlcyA/IHRydWUgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVTZWxlY3RlZEltYWdlcygpIHtcclxuICAgICAgICBjb25zdCB7IHNlbGVjdGVkSW1hZ2VJZHMsIGRlbGV0ZUltYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBkZWxldGVJbWFnZXModXNlcm5hbWUsIHNlbGVjdGVkSW1hZ2VJZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwbG9hZFZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0LCB1cGxvYWRJbWFnZSwgc2VsZWN0ZWRJbWFnZUlkcyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCBoYXNJbWFnZXMgPSBzZWxlY3RlZEltYWdlSWRzLmxlbmd0aCA+IDA7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGNhbkVkaXQgPyBcclxuICAgICAgICAgICAgPEltYWdlVXBsb2FkXHJcbiAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZT17dXBsb2FkSW1hZ2V9XHJcbiAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICBkZWxldGVTZWxlY3RlZEltYWdlcz17dGhpcy5kZWxldGVTZWxlY3RlZEltYWdlc31cclxuICAgICAgICAgICAgICAgIGhhc0ltYWdlcz17aGFzSW1hZ2VzfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA6IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSB0aGlzLnByb3BzLnBhcmFtcztcclxuICAgICAgICBjb25zdCB7IGltYWdlcywgZ2V0RnVsbG5hbWUsIGNhbkVkaXQsIGFkZFNlbGVjdGVkSW1hZ2VJZCwgcmVtb3ZlU2VsZWN0ZWRJbWFnZUlkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGZ1bGxOYW1lID0gZ2V0RnVsbG5hbWUodXNlcm5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy1vZmZzZXQtMiBjb2wtbGctOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMT48c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWNhcGl0YWxpemVcIj57ZnVsbE5hbWV9J3M8L3NwYW4+IDxzbWFsbD5iaWxsZWRlIGdhbGxlcmk8L3NtYWxsPjwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgPGhyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPEltYWdlTGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZXM9e2ltYWdlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkU2VsZWN0ZWRJbWFnZUlkPXthZGRTZWxlY3RlZEltYWdlSWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZVNlbGVjdGVkSW1hZ2VJZD17cmVtb3ZlU2VsZWN0ZWRJbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlzU2VsZWN0ZWQ9e3RoaXMuaW1hZ2VJc1NlbGVjdGVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy51cGxvYWRWaWV3KCl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBVc2VySW1hZ2VzUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShVc2VySW1hZ2VzQ29udGFpbmVyKTtcclxuY29uc3QgVXNlckltYWdlcyA9IHdpdGhSb3V0ZXIoVXNlckltYWdlc1JlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgVXNlckltYWdlcztcclxuIiwi77u/aW1wb3J0ICogYXMgVCBmcm9tICcuLi9jb25zdGFudHMvdHlwZXMnXHJcbmltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcclxuaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJy4uL2NvbnN0YW50cy9jb25zdGFudHMnXHJcbmltcG9ydCB7IG5vcm1hbGl6ZUNvbW1lbnQsIHZpc2l0Q29tbWVudHMsIHJlc3BvbnNlSGFuZGxlciwgb25SZWplY3QgfSBmcm9tICcuLi91dGlsaXRpZXMvdXRpbHMnXHJcbmltcG9ydCB7IGFkZFVzZXIgfSBmcm9tICcuL3VzZXJzJ1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIHNldEVycm9yIH0gZnJvbSAnLi9lcnJvcidcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRTa2lwQ29tbWVudHMgPSAoc2tpcCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9TS0lQX0NPTU1FTlRTLFxyXG4gICAgICAgIHNraXA6IHNraXBcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0U2tpcCA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9TS0lQXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0VGFrZSA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5TRVRfREVGQVVMVF9UQUtFXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRUYWtlQ29tbWVudHMgPSAodGFrZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULlNFVF9UQUtFX0NPTU1FTlRTLFxyXG4gICAgICAgIHRha2U6IHRha2VcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJyZW50UGFnZShwYWdlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0NVUlJFTlRfUEFHRSxcclxuICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0VG90YWxQYWdlcyh0b3RhbFBhZ2VzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX1RPVEFMX1BBR0VTLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXREZWZhdWx0Q29tbWVudHMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFQuU0VUX0RFRkFVTFRfQ09NTUVOVFNcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VpdmVkQ29tbWVudHMoY29tbWVudHMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogVC5SRUNJRVZFRF9DT01NRU5UUyxcclxuICAgICAgICBjb21tZW50czogY29tbWVudHNcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaENvbW1lbnRzKGltYWdlSWQsIHNraXAsIHRha2UpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cyArIFwiP2ltYWdlSWQ9XCIgKyBpbWFnZUlkICsgXCImc2tpcD1cIiArIHNraXAgKyBcIiZ0YWtlPVwiICsgdGFrZTtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gcmVzcG9uc2VIYW5kbGVyLmJpbmQodGhpcywgZGlzcGF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZXIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gVW5wcm9jZXNzZWQgY29tbWVudHNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VDb21tZW50cyA9IGRhdGEuQ3VycmVudEl0ZW1zO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCAocmUtc2V0KSBpbmZvXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChzZXRTa2lwQ29tbWVudHMoc2tpcCkpO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goc2V0VGFrZUNvbW1lbnRzKHRha2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldEN1cnJlbnRQYWdlKGRhdGEuQ3VycmVudFBhZ2UpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHNldFRvdGFsUGFnZXMoZGF0YS5Ub3RhbFBhZ2VzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVmlzaXQgZXZlcnkgY29tbWVudCBhbmQgYWRkIHRoZSB1c2VyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRBdXRob3IgPSAoYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFjLkRlbGV0ZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKGFkZFVzZXIoYy5BdXRob3IpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZpc2l0Q29tbWVudHMocGFnZUNvbW1lbnRzLCBhZGRBdXRob3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5vcm1hbGl6ZTogZmlsdGVyIG91dCB1c2VyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tZW50cyA9IHBhZ2VDb21tZW50cy5tYXAobm9ybWFsaXplQ29tbWVudCk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChyZWNlaXZlZENvbW1lbnRzKGNvbW1lbnRzKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHBvc3RDb21tZW50ID0gKGltYWdlSWQsIHRleHQsIHBhcmVudENvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IGdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cztcclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgY29uc3QgYm9keSA9SlNPTi5zdHJpbmdpZnkoeyBcclxuICAgICAgICAgICAgVGV4dDogdGV4dCxcclxuICAgICAgICAgICAgSW1hZ2VJRDogaW1hZ2VJZCxcclxuICAgICAgICAgICAgUGFyZW50SUQ6IHBhcmVudENvbW1lbnRJZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBib2R5LFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goaW5jcmVtZW50Q29tbWVudENvdW50KGltYWdlSWQpKTtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBlZGl0Q29tbWVudCA9IChjb21tZW50SWQsIGltYWdlSWQsIHRleHQpID0+IHtcclxuICAgIHJldHVybiBmdW5jdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcclxuICAgICAgICBjb25zdCB7IHNraXAsIHRha2UgfSA9IGdldFN0YXRlKCkuY29tbWVudHNJbmZvO1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGdsb2JhbHMudXJscy5jb21tZW50cyArIFwiP2ltYWdlSWQ9XCIgKyBpbWFnZUlkO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgSUQ6IGNvbW1lbnRJZCwgVGV4dDogdGV4dH0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgIH0sIG9uUmVqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUNvbW1lbnQgPSAoY29tbWVudElkLCBpbWFnZUlkKSA9PiB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgeyBza2lwLCB0YWtlIH0gPSBnZXRTdGF0ZSgpLmNvbW1lbnRzSW5mbztcclxuICAgICAgICBjb25zdCB1cmwgPSBnbG9iYWxzLnVybHMuY29tbWVudHMgKyBcIj9jb21tZW50SWQ9XCIgKyBjb21tZW50SWQ7XHJcbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwsIG9wdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hDb21tZW50cyhpbWFnZUlkLCBza2lwLCB0YWtlKSk7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChkZWNyZW1lbnRDb21tZW50Q291bnQoaW1hZ2VJZCkpO1xyXG4gICAgICAgICAgICB9LCBvblJlamVjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbmNyZW1lbnRDb21tZW50Q291bnQgPSAoaW1hZ2VJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULklOQ1JfQ09NTUVOVF9DT1VOVCxcclxuICAgICAgICBpbWFnZUlkOiBpbWFnZUlkXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWNyZW1lbnRDb21tZW50Q291bnQgPSAoaW1hZ2VJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBULkRFQ1JfQ09NTUVOVF9DT1VOVCxcclxuICAgICAgICBpbWFnZUlkOiBpbWFnZUlkXHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnREZWxldGVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHJlcGxpZXMsIGhhbmRsZXJzLCBjb25zdHJ1Y3RDb21tZW50cyB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCByZXBseU5vZGVzID0gY29uc3RydWN0Q29tbWVudHMocmVwbGllcywgaGFuZGxlcnMpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEgcHVsbC1sZWZ0IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1sZWZ0XCIgc3R5bGU9e3ttaW5XaWR0aDogXCI3NHB4XCJ9fT48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzbWFsbD5zbGV0dGV0PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICB7cmVwbHlOb2Rlc31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuY29uc3QgaWRzID0gKGNvbW1lbnRJZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXBseUlkOiBjb21tZW50SWQgKyAnX3JlcGx5JyxcclxuICAgICAgICBlZGl0SWQ6IGNvbW1lbnRJZCArICdfZWRpdCcsXHJcbiAgICAgICAgZGVsZXRlSWQ6IGNvbW1lbnRJZCArICdfZGVsZXRlJyxcclxuICAgICAgICBlZGl0Q29sbGFwc2U6IGNvbW1lbnRJZCArICdfZWRpdENvbGxhcHNlJyxcclxuICAgICAgICByZXBseUNvbGxhcHNlOiBjb21tZW50SWQgKyAnX3JlcGx5Q29sbGFwc2UnXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudENvbnRyb2xzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHRleHQ6IHByb3BzLnRleHQsXHJcbiAgICAgICAgICAgIHJlcGx5OiAnJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdCA9IHRoaXMuZWRpdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVwbHkgPSB0aGlzLnJlcGx5LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVSZXBseUNoYW5nZSA9IHRoaXMuaGFuZGxlUmVwbHlDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBlZGl0KCkge1xyXG4gICAgICAgIGNvbnN0IHsgZWRpdEhhbmRsZSwgY29tbWVudElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBjb25zdCB7IGVkaXRDb2xsYXBzZSB9ID0gaWRzKGNvbW1lbnRJZCk7XHJcblxyXG4gICAgICAgIGVkaXRIYW5kbGUoY29tbWVudElkLCB0ZXh0KTtcclxuICAgICAgICAkKFwiI1wiICsgZWRpdENvbGxhcHNlKS5jb2xsYXBzZSgnaGlkZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGx5KCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlIYW5kbGUsIGNvbW1lbnRJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHJlcGx5IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlDb2xsYXBzZSB9ID0gaWRzKGNvbW1lbnRJZCk7XHJcblxyXG4gICAgICAgIHJlcGx5SGFuZGxlKGNvbW1lbnRJZCwgcmVwbHkpO1xyXG4gICAgICAgICQoXCIjXCIgKyByZXBseUNvbGxhcHNlKS5jb2xsYXBzZSgnaGlkZScpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXBseTogJycgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1Rvb2x0aXAoaXRlbSkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudElkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGJ0biA9IFwiI1wiICsgY29tbWVudElkICsgXCJfXCIgKyBpdGVtO1xyXG4gICAgICAgICQoYnRuKS50b29sdGlwKCdzaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVJlcGx5Q2hhbmdlKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHk6IGUudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgY29tbWVudElkLCBjYW5FZGl0LCBkZWxldGVIYW5kbGUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyBlZGl0Q29sbGFwc2UsIHJlcGx5Q29sbGFwc2UsIHJlcGx5SWQsIGVkaXRJZCwgZGVsZXRlSWQgfSA9IGlkcyhjb21tZW50SWQpO1xyXG4gICAgICAgIGNvbnN0IGVkaXRUYXJnZXQgPSBcIiNcIiArIGVkaXRDb2xsYXBzZTtcclxuICAgICAgICBjb25zdCByZXBseVRhcmdldCA9IFwiI1wiICsgcmVwbHlDb2xsYXBzZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgY2FuRWRpdCA/XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7cGFkZGluZ0JvdHRvbTogJzVweCcsIHBhZGRpbmdMZWZ0OiBcIjE1cHhcIn19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgb25DbGljaz17ZGVsZXRlSGFuZGxlLmJpbmQobnVsbCwgY29tbWVudElkKX0gc3R5bGU9e3sgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdkZWxldGUnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtkZWxldGVJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlNsZXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGFiZWwgbGFiZWwtZGFuZ2VyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi10cmFzaFwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj57J1xcdTAwQTAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e2VkaXRUYXJnZXR9IHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e3RoaXMuc2hvd1Rvb2x0aXAuYmluZCh0aGlzLCAnZWRpdCcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2VkaXRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIsOGbmRyZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsYWJlbCBsYWJlbC1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wZW5jaWxcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+eydcXHUwMEEwJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtyZXBseVRhcmdldH0gc3R5bGU9e3sgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5zaG93VG9vbHRpcC5iaW5kKHRoaXMsICdyZXBseScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e3JlcGx5SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJTdmFyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsIGxhYmVsLXByaW1hcnlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3twYWRkaW5nQm90dG9tOiAnNXB4J319PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMCBjb2xsYXBzZVwiIGlkPXtlZGl0Q29sbGFwc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUudGV4dH0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlVGV4dENoYW5nZX0gcm93cz1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoe3RleHQ6IHRleHR9KX0gZGF0YS10YXJnZXQ9e2VkaXRUYXJnZXR9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiPkx1azwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWluZm9cIiBvbkNsaWNrPXt0aGlzLmVkaXR9PkdlbSDDpm5kcmluZ2VyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwIGNvbGxhcHNlXCIgaWQ9e3JlcGx5Q29sbGFwc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUucmVwbHl9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVJlcGx5Q2hhbmdlfSByb3dzPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIj5MdWs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1pbmZvXCIgb25DbGljaz17dGhpcy5yZXBseX0+U3ZhcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PiA6IFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17e3BhZGRpbmdCb3R0b206ICc1cHgnLCBwYWRkaW5nTGVmdDogJzE1cHgnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9e3JlcGx5VGFyZ2V0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e3RoaXMuc2hvd1Rvb2x0aXAuYmluZCh0aGlzLCAncmVwbHknKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtyZXBseUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiU3ZhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsYWJlbCBsYWJlbC1wcmltYXJ5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lbnZlbG9wZVwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy0xMCBjb2xsYXBzZVwiIGlkPXtyZXBseUNvbGxhcHNlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHZhbHVlPXt0aGlzLnN0YXRlLnJlcGx5fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVSZXBseUNoYW5nZX0gcm93cz1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PXtyZXBseVRhcmdldH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4taW5mb1wiIG9uQ2xpY2s9e3RoaXMucmVwbHl9PlN2YXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudENvbnRyb2xzIH0gZnJvbSAnLi9Db21tZW50Q29udHJvbHMnXHJcbmltcG9ydCB7IENvbW1lbnRQcm9maWxlIH0gZnJvbSAnLi9Db21tZW50UHJvZmlsZSdcclxuaW1wb3J0IHsgZm9ybWF0VGV4dCwgdGltZVRleHQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvdXRpbHMnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50SWQsIHBvc3RlZE9uLCBhdXRob3JJZCwgdGV4dCwgcmVwbGllcywgaGFuZGxlcnMsIGNvbnN0cnVjdENvbW1lbnRzIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcmVwbHlIYW5kbGUsIGVkaXRIYW5kbGUsIGRlbGV0ZUhhbmRsZSwgY2FuRWRpdCwgZ2V0VXNlciB9ID0gaGFuZGxlcnM7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yID0gZ2V0VXNlcihhdXRob3JJZCk7XHJcbiAgICAgICAgY29uc3QgZnVsbG5hbWUgPSBhdXRob3IuRmlyc3ROYW1lICsgXCIgXCIgKyBhdXRob3IuTGFzdE5hbWU7XHJcbiAgICAgICAgY29uc3QgY2FuRWRpdFZhbCA9IGNhbkVkaXQoYXV0aG9ySWQpO1xyXG4gICAgICAgIGNvbnN0IHJlcGx5Tm9kZXMgPSBjb25zdHJ1Y3RDb21tZW50cyhyZXBsaWVzLCBoYW5kbGVycyk7XHJcbiAgICAgICAgY29uc3QgdHh0ID0gZm9ybWF0VGV4dCh0ZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYSBwdWxsLWxlZnQgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPENvbW1lbnRQcm9maWxlIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJtZWRpYS1oZWFkaW5nXCI+PHN0cm9uZz57ZnVsbG5hbWV9PC9zdHJvbmc+IDxQb3N0ZWRPbiBwb3N0ZWRPbj17cG9zdGVkT259IC8+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3R4dH0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudENvbnRyb2xzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtjYW5FZGl0VmFsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudElkPXtjb21tZW50SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVIYW5kbGU9e2RlbGV0ZUhhbmRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRIYW5kbGU9e2VkaXRIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBseUhhbmRsZT17cmVwbHlIYW5kbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXt0ZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7cmVwbHlOb2Rlc31cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUG9zdGVkT24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgYWdvKCkge1xyXG4gICAgICAgIGNvbnN0IHsgcG9zdGVkT24gfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHRpbWVUZXh0KHBvc3RlZE9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICg8c21hbGw+c2FnZGUge3RoaXMuYWdvKCl9PC9zbWFsbD4pO1xyXG4gICAgfVxyXG59XHJcbiIsIu+7v2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQ29tbWVudERlbGV0ZWQgfSBmcm9tICcuL0NvbW1lbnREZWxldGVkJ1xyXG5pbXBvcnQgeyBDb21tZW50IH0gZnJvbSAnLi9Db21tZW50J1xyXG5cclxuY29uc3QgY29tcGFjdEhhbmRsZXJzID0gKHJlcGx5SGFuZGxlLCBlZGl0SGFuZGxlLCBkZWxldGVIYW5kbGUsIGNhbkVkaXQsIGdldFVzZXIpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVwbHlIYW5kbGUsXHJcbiAgICAgICAgZWRpdEhhbmRsZSxcclxuICAgICAgICBkZWxldGVIYW5kbGUsXHJcbiAgICAgICAgY2FuRWRpdCxcclxuICAgICAgICBnZXRVc2VyXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50TGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RDb21tZW50cyhjb21tZW50cywgaGFuZGxlcnMpIHtcclxuICAgICAgICBpZiAoIWNvbW1lbnRzIHx8IGNvbW1lbnRzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgIHJldHVybiBjb21tZW50cy5tYXAoKGNvbW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gXCJjb21tZW50SWRcIiArIGNvbW1lbnQuQ29tbWVudElEO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbW1lbnQuRGVsZXRlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhXCIga2V5PXtrZXl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29tbWVudERlbGV0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2tleX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGllcz17Y29tbWVudC5SZXBsaWVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzPXtoYW5kbGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RDb21tZW50cz17Y29uc3RydWN0Q29tbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhXCIga2V5PXtrZXl9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb21tZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtrZXl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RlZE9uPXtjb21tZW50LlBvc3RlZE9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcklkPXtjb21tZW50LkF1dGhvcklEfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17Y29tbWVudC5UZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxpZXM9e2NvbW1lbnQuUmVwbGllc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50SWQ9e2NvbW1lbnQuQ29tbWVudElEfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzPXtoYW5kbGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RDb21tZW50cz17Y29uc3RydWN0Q29tbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb21tZW50cywgcmVwbHlIYW5kbGUsIGVkaXRIYW5kbGUsIGRlbGV0ZUhhbmRsZSwgY2FuRWRpdCwgZ2V0VXNlciwgdXNlcklkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXJzID0gY29tcGFjdEhhbmRsZXJzKHJlcGx5SGFuZGxlLCBlZGl0SGFuZGxlLCBkZWxldGVIYW5kbGUsIGNhbkVkaXQsIGdldFVzZXIpO1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5jb25zdHJ1Y3RDb21tZW50cyhjb21tZW50cywgaGFuZGxlcnMpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICB7bm9kZXN9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBwcmV2VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IGN1cnJlbnRQYWdlLCBwcmV2IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGhhc1ByZXYgPSAhKGN1cnJlbnRQYWdlID09PSAxKTtcclxuICAgICAgICBpZiAoaGFzUHJldilcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiBvbkNsaWNrPXtwcmV2fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mbGFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImRpc2FibGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JmxhcXVvOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGk+KTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0VmlldygpIHtcclxuICAgICAgICBjb25zdCB7IHRvdGFsUGFnZXMsIGN1cnJlbnRQYWdlLCBuZXh0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGhhc05leHQgPSAhKHRvdGFsUGFnZXMgPT09IGN1cnJlbnRQYWdlKSAmJiAhKHRvdGFsUGFnZXMgPT09IDApO1xyXG4gICAgICAgIGlmKGhhc05leHQpXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgYXJpYS1sYWJlbD1cIk5leHRcIiBvbkNsaWNrPXtuZXh0fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mcmFxdW87PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2xpPik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImRpc2FibGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnJhcXVvOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGk+KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB0b3RhbFBhZ2VzLCBpbWFnZUlkLCBjdXJyZW50UGFnZSwgZ2V0UGFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsZXQgcGFnZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB0b3RhbFBhZ2VzOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gXCJwYWdlX2l0ZW1fXCIgKyAoaW1hZ2VJZCArIGkpO1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gY3VycmVudFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2goPGxpIGNsYXNzTmFtZT1cImFjdGl2ZVwiIGtleT17a2V5fT48YSBocmVmPVwiI1wiIGtleT17a2V5IH0+e2l9PC9hPjwvbGk+KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2goPGxpIGtleT17a2V5IH0gb25DbGljaz17Z2V0UGFnZS5iaW5kKG51bGwsIGkpfT48YSBocmVmPVwiI1wiIGtleT17a2V5IH0+e2l9PC9hPjwvbGk+KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdyA9IChwYWdlcy5sZW5ndGggPiAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuKFxyXG4gICAgICAgICAgICBzaG93ID9cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLW9mZnNldC0xIGNvbC1sZy05XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG5hdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJwYWdpbmF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJldlZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7cGFnZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMubmV4dFZpZXcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9uYXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDogbnVsbCk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbWVudEZvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgVGV4dDogJydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnBvc3RDb21tZW50ID0gdGhpcy5wb3N0Q29tbWVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RDb21tZW50KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgcG9zdEhhbmRsZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBwb3N0SGFuZGxlKHRoaXMuc3RhdGUuVGV4dCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFRleHQ6ICcnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVRleHRDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBUZXh0OiBlLnRhcmdldC52YWx1ZSB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5wb3N0Q29tbWVudH0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInJlbWFya1wiPktvbW1lbnRhcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVGV4dENoYW5nZX0gdmFsdWU9e3RoaXMuc3RhdGUuVGV4dH0gcGxhY2Vob2xkZXI9XCJTa3JpdiBrb21tZW50YXIgaGVyLi4uXCIgaWQ9XCJyZW1hcmtcIiByb3dzPVwiNFwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiPlNlbmQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IGZldGNoQ29tbWVudHMsIHBvc3RDb21tZW50LCBlZGl0Q29tbWVudCwgZGVsZXRlQ29tbWVudCB9IGZyb20gJy4uLy4uL2FjdGlvbnMvY29tbWVudHMnXHJcbmltcG9ydCB7IENvbW1lbnRMaXN0IH0gZnJvbSAnLi4vY29tbWVudHMvQ29tbWVudExpc3QnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IFBhZ2luYXRpb24gfSBmcm9tICcuLi9jb21tZW50cy9QYWdpbmF0aW9uJ1xyXG5pbXBvcnQgeyBDb21tZW50Rm9ybSB9IGZyb20gJy4uL2NvbW1lbnRzL0NvbW1lbnRGb3JtJ1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGltYWdlSWQ6IHN0YXRlLmltYWdlc0luZm8uc2VsZWN0ZWRJbWFnZUlkLFxyXG4gICAgICAgIHNraXA6IHN0YXRlLmNvbW1lbnRzSW5mby5za2lwLFxyXG4gICAgICAgIHRha2U6IHN0YXRlLmNvbW1lbnRzSW5mby50YWtlLFxyXG4gICAgICAgIHBhZ2U6IHN0YXRlLmNvbW1lbnRzSW5mby5wYWdlLFxyXG4gICAgICAgIHRvdGFsUGFnZXM6IHN0YXRlLmNvbW1lbnRzSW5mby50b3RhbFBhZ2VzLFxyXG4gICAgICAgIGNvbW1lbnRzOiBzdGF0ZS5jb21tZW50c0luZm8uY29tbWVudHMsXHJcbiAgICAgICAgZ2V0VXNlcjogKGlkKSA9PiBmaW5kKHN0YXRlLnVzZXJzSW5mby51c2VycywgKHUpID0+IHUuSUQgPT0gaWQpLFxyXG4gICAgICAgIGNhbkVkaXQ6ICh1c2VySWQpID0+IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkID09IHVzZXJJZCxcclxuICAgICAgICB1c2VySWQ6IHN0YXRlLnVzZXJzSW5mby5jdXJyZW50VXNlcklkXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2FkQ29tbWVudHM6IChpbWFnZUlkLCBza2lwLCB0YWtlKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGZldGNoQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdFJlcGx5OiAoaW1hZ2VJZCwgcmVwbHlJZCwgdGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChwb3N0Q29tbWVudChpbWFnZUlkLCB0ZXh0LCByZXBseUlkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0Q29tbWVudDogKGltYWdlSWQsIHRleHQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2gocG9zdENvbW1lbnQoaW1hZ2VJZCwgdGV4dCwgbnVsbCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZWRpdENvbW1lbnQ6IChpbWFnZUlkLCBjb21tZW50SWQsIHRleHQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZWRpdENvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkLCB0ZXh0KSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVDb21tZW50OiAoaW1hZ2VJZCwgY29tbWVudElkKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKGRlbGV0ZUNvbW1lbnQoY29tbWVudElkLCBpbWFnZUlkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDb21tZW50c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLm5leHRQYWdlID0gdGhpcy5uZXh0UGFnZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZ2V0UGFnZSA9IHRoaXMuZ2V0UGFnZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNQYWdlID0gdGhpcy5wcmV2aW91c1BhZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0UGFnZSgpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBza2lwTmV4dCA9IHNraXAgKyB0YWtlO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwTmV4dCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGFnZShwYWdlKSB7XHJcbiAgICAgICAgY29uc3QgeyBsb2FkQ29tbWVudHMsIGltYWdlSWQsIHRha2UgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qgc2tpcFBhZ2VzID0gcGFnZSAtIDE7XHJcbiAgICAgICAgY29uc3Qgc2tpcEl0ZW1zID0gKHNraXBQYWdlcyAqIHRha2UpO1xyXG4gICAgICAgIGxvYWRDb21tZW50cyhpbWFnZUlkLCBza2lwSXRlbXMsIHRha2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXZpb3VzUGFnZSgpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZX0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IGJhY2tTa2lwID0gc2tpcCAtIHRha2U7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKGltYWdlSWQsIGJhY2tTa2lwLCB0YWtlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBjb25zdCB7IGxvYWRDb21tZW50cywgaW1hZ2VJZCwgc2tpcCwgdGFrZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBsb2FkQ29tbWVudHMoaW1hZ2VJZCwgc2tpcCwgdGFrZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY29tbWVudHMsIHBvc3RSZXBseSwgZWRpdENvbW1lbnQsIHBvc3RDb21tZW50LFxyXG4gICAgICAgICAgICAgICAgZGVsZXRlQ29tbWVudCwgY2FuRWRpdCwgZ2V0VXNlcixcclxuICAgICAgICAgICAgICAgIHVzZXJJZCwgaW1hZ2VJZCwgcGFnZSwgdG90YWxQYWdlcyB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTExXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50TGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudHM9e2NvbW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbHlIYW5kbGU9e3Bvc3RSZXBseS5iaW5kKG51bGwsIGltYWdlSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdEhhbmRsZT17ZWRpdENvbW1lbnQuYmluZChudWxsLCBpbWFnZUlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUhhbmRsZT17ZGVsZXRlQ29tbWVudC5iaW5kKG51bGwsIGltYWdlSWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRWRpdD17Y2FuRWRpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFVzZXI9e2dldFVzZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IHRleHQtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxQYWdpbmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlkPXtpbWFnZUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhZ2U9e3BhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2VzPXt0b3RhbFBhZ2VzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dD17dGhpcy5uZXh0UGFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXY9e3RoaXMucHJldmlvdXNQYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UGFnZT17dGhpcy5nZXRQYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgdGV4dC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctb2Zmc2V0LTEgY29sLWxnLTEwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50Rm9ybVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdEhhbmRsZT17cG9zdENvbW1lbnQuYmluZChudWxsLCBpbWFnZUlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQ29tbWVudHMgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShDb21tZW50c0NvbnRhaW5lcik7Iiwi77u/aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xyXG5pbXBvcnQgeyBzZXRTZWxlY3RlZEltZywgZmV0Y2hTaW5nbGVJbWFnZSwgZGVsZXRlSW1hZ2UgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2ltYWdlcydcclxuaW1wb3J0IHsgc2V0RXJyb3IgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2Vycm9yJ1xyXG5pbXBvcnQgeyBDb21tZW50cyB9IGZyb20gJy4uL2NvbnRhaW5lcnMvQ29tbWVudHMnXHJcbmltcG9ydCB7IGZpbmQgfSBmcm9tICd1bmRlcnNjb3JlJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IHdpdGhSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXInXHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHtcclxuICAgIGNvbnN0IG93bmVySWQgID0gc3RhdGUuaW1hZ2VzSW5mby5vd25lcklkO1xyXG4gICAgY29uc3QgY3VycmVudElkID0gc3RhdGUudXNlcnNJbmZvLmN1cnJlbnRVc2VySWQ7XHJcbiAgICBjb25zdCBjYW5FZGl0ID0gKG93bmVySWQgPiAwICYmIGN1cnJlbnRJZCA+IDAgJiYgb3duZXJJZCA9PSBjdXJyZW50SWQpO1xyXG5cclxuICAgIGNvbnN0IGdldEltYWdlID0gKGlkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZpbmQoc3RhdGUuaW1hZ2VzSW5mby5pbWFnZXMsIGltYWdlID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGltYWdlLkltYWdlSUQgPT0gaWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGltYWdlID0gKCkgPT4gZ2V0SW1hZ2Uoc3RhdGUuaW1hZ2VzSW5mby5zZWxlY3RlZEltYWdlSWQpO1xyXG4gICAgY29uc3QgZmlsZW5hbWUgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLkZpbGVuYW1lOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCBwcmV2aWV3VXJsID0gKCkgPT4geyBpZihpbWFnZSgpKSByZXR1cm4gaW1hZ2UoKS5QcmV2aWV3VXJsOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCBleHRlbnNpb24gPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLkV4dGVuc2lvbjsgcmV0dXJuICcnOyB9O1xyXG4gICAgY29uc3Qgb3JpZ2luYWxVcmwgPSAoKSA9PiB7IGlmKGltYWdlKCkpIHJldHVybiBpbWFnZSgpLk9yaWdpbmFsVXJsOyByZXR1cm4gJyc7IH07XHJcbiAgICBjb25zdCB1cGxvYWRlZCA9ICgpID0+IHsgaWYoaW1hZ2UoKSkgcmV0dXJuIGltYWdlKCkuVXBsb2FkZWQ7IHJldHVybiBuZXcgRGF0ZSgpOyB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2FuRWRpdDogY2FuRWRpdCxcclxuICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWUoKSxcclxuICAgICAgICBwcmV2aWV3VXJsOiBwcmV2aWV3VXJsKCksXHJcbiAgICAgICAgZXh0ZW5zaW9uOiBleHRlbnNpb24oKSxcclxuICAgICAgICBvcmlnaW5hbFVybDogb3JpZ2luYWxVcmwoKSxcclxuICAgICAgICB1cGxvYWRlZDogdXBsb2FkZWQoKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRJbWFnZUlkOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcoaWQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc2VsZWN0SW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goc2V0U2VsZWN0ZWRJbWcodW5kZWZpbmVkKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRFcnJvcjogKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHNldEVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmZXRjaEltYWdlOiAoaWQpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hTaW5nbGVJbWFnZShpZCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSW1hZ2U6IChpZCwgdXNlcm5hbWUpID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goZGVsZXRlSW1hZ2UoaWQsIHVzZXJuYW1lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNb2RhbEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSW1hZ2UgPSB0aGlzLmRlbGV0ZUltYWdlLmJpbmQodGhpcyk7IFxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGNvbnN0IHsgZGVzZWxlY3RJbWFnZSwgc2V0RXJyb3IgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgeyBwdXNoIH0gPSB0aGlzLnByb3BzLnJvdXRlcjtcclxuXHJcbiAgICAgICAgY29uc3QgaXNMb2FkZWQgPSB0eXBlb2YgJCAhPT0gXCJ1bmRlZmluZWRcIjtcclxuICAgICAgICBpZihpc0xvYWRlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcyk7XHJcbiAgICAgICAgICAgICQobm9kZSkubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgJChub2RlKS5vbignaGlkZS5icy5tb2RhbCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXNlbGVjdEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnYWxsZXJ5VXJsID0gJy8nICsgdXNlcm5hbWUgKyAnL2dhbGxlcnknO1xyXG4gICAgICAgICAgICAgICAgcHVzaChnYWxsZXJ5VXJsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRFcnJvcih7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ09vcHMgc29tZXRoaW5nIHdlbnQgd3JvbmcnLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ0NvdWxkIG5vdCBmaW5kIHRoZSBpbWFnZSwgbWF5YmUgdGhlIFVSTCBpcyBpbnZhbGlkIG9yIGl0IGhhcyBiZWVuIGRlbGV0ZWQhJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSW1hZ2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBkZWxldGVJbWFnZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IGlkLCB1c2VybmFtZSB9ID0gdGhpcy5wcm9wcy5wYXJhbXM7XHJcblxyXG4gICAgICAgIGRlbGV0ZUltYWdlKGlkLCB1c2VybmFtZSk7XHJcbiAgICAgICAgJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkubW9kYWwoJ2hpZGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJbWFnZVZpZXcoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjYW5FZGl0IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGNhbkVkaXQgP1xyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuZGVsZXRlSW1hZ2V9PlxyXG4gICAgICAgICAgICAgICAgICAgIFNsZXQgYmlsbGVkZVxyXG4gICAgICAgICAgICA8L2J1dHRvbj4gOiBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBmaWxlbmFtZSwgcHJldmlld1VybCwgZXh0ZW5zaW9uLCBvcmlnaW5hbFVybCwgdXBsb2FkZWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGZpbGVuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICAgICAgY29uc3QgdXBsb2FkRGF0ZSA9IG1vbWVudCh1cGxvYWRlZCk7XHJcbiAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IFwiVXBsb2FkZWQgZC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkQgTU1NIFlZWVkgXCIpICsgXCJrbC4gXCIgKyB1cGxvYWREYXRlLmZvcm1hdChcIkg6bW1cIik7XHJcblxyXG4gICAgICAgIHJldHVybiAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2cgbW9kYWwtbGdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlIHRleHQtY2VudGVyXCI+e25hbWV9PHNwYW4+PHNtYWxsPiAtIHtkYXRlU3RyaW5nfTwvc21hbGw+PC9zcGFuPjwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e29yaWdpbmFsVXJsfSB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJpbWctcmVzcG9uc2l2ZSBjZW50ZXItYmxvY2tcIiBzcmM9e3ByZXZpZXdVcmx9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb21tZW50cyAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmRlbGV0ZUltYWdlVmlldygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+THVrPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeydcXHUwMEEwJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBTZWxlY3RlZEltYWdlUmVkdXggPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShNb2RhbEltYWdlKTtcclxuY29uc3QgU2VsZWN0ZWRJbWFnZSA9IHdpdGhSb3V0ZXIoU2VsZWN0ZWRJbWFnZVJlZHV4KTtcclxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0ZWRJbWFnZTsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IGNvbm5lY3QsIFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZXMvc3RvcmUnXHJcbmltcG9ydCB7IFJvdXRlciwgUm91dGUsIEluZGV4Um91dGUsIGJyb3dzZXJIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xyXG5pbXBvcnQgeyBmZXRjaEN1cnJlbnRVc2VyIH0gZnJvbSAnLi9hY3Rpb25zL3VzZXJzJ1xyXG5pbXBvcnQgTWFpbiBmcm9tICcuL2NvbXBvbmVudHMvTWFpbidcclxuaW1wb3J0IEFib3V0IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL0Fib3V0J1xyXG5pbXBvcnQgSG9tZSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVycy9Ib21lJ1xyXG5pbXBvcnQgVXNlcnMgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcnMvVXNlcnMnXHJcbmltcG9ydCBVc2VySW1hZ2VzIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1VzZXJJbWFnZXMnXHJcbmltcG9ydCBTZWxlY3RlZEltYWdlIGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXJzL1NlbGVjdGVkSW1hZ2UnXHJcbmltcG9ydCB7IGZldGNoVXNlckltYWdlcywgc2V0U2VsZWN0ZWRJbWcsIGZldGNoU2luZ2xlSW1hZ2UsIHNldEltYWdlT3duZXIgfSBmcm9tICcuL2FjdGlvbnMvaW1hZ2VzJ1xyXG5cclxuc3RvcmUuZGlzcGF0Y2goZmV0Y2hDdXJyZW50VXNlcihnbG9iYWxzLmN1cnJlbnRVc2VybmFtZSkpO1xyXG5tb21lbnQubG9jYWxlKCdkYScpO1xyXG5cclxuY29uc3Qgc2VsZWN0SW1hZ2UgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCBpbWFnZUlkID0gbmV4dFN0YXRlLnBhcmFtcy5pZDtcclxuICAgIHN0b3JlLmRpc3BhdGNoKHNldFNlbGVjdGVkSW1nKGltYWdlSWQpKTtcclxufVxyXG5cclxuY29uc3QgZmV0Y2hJbWFnZXMgPSAobmV4dFN0YXRlKSA9PiB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IG5leHRTdGF0ZS5wYXJhbXMudXNlcm5hbWU7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChzZXRJbWFnZU93bmVyKHVzZXJuYW1lKSk7XHJcbiAgICBzdG9yZS5kaXNwYXRjaChmZXRjaFVzZXJJbWFnZXModXNlcm5hbWUpKTtcclxufVxyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XHJcbiAgICAgICAgPFJvdXRlciBoaXN0b3J5PXticm93c2VySGlzdG9yeX0+XHJcbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGNvbXBvbmVudD17TWFpbn0+XHJcbiAgICAgICAgICAgICAgICA8SW5kZXhSb3V0ZSBjb21wb25lbnQ9e0hvbWV9IC8+XHJcbiAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cInVzZXJzXCIgY29tcG9uZW50PXtVc2Vyc30gLz5cclxuICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiYWJvdXRcIiBjb21wb25lbnQ9e0Fib3V0fSAvPlxyXG4gICAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCI6dXNlcm5hbWUvZ2FsbGVyeVwiIGNvbXBvbmVudD17VXNlckltYWdlc30gb25FbnRlcj17ZmV0Y2hJbWFnZXN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiaW1hZ2UvOmlkXCIgY29tcG9uZW50PXtTZWxlY3RlZEltYWdlfSBvbkVudGVyPXtzZWxlY3RJbWFnZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgICAgIDwvUm91dGU+XHJcbiAgICAgICAgPC9Sb3V0ZXI+XHJcbiAgICA8L1Byb3ZpZGVyPixcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykpO1xyXG5cclxuLy88Um91dGUgcGF0aD1cImNvbW1lbnQvOmNpZFwiIGNvbXBvbmVudD17J1NpbmdsZSBDb21tZW50J30gb25FbnRlcj17J2ZldGNoU2luZ2xlQ29tbWVudENoYWluPyd9IC8+XHJcbi8vPFJvdXRlIHBhdGg9XCJjb21tZW50c1wiIGNvbXBvbmVudD17J0NvbW1lbnRzJ30gb25FbnRlcj17J2ZldGNoQ29tbWVudHMnfSAvPiJdLCJuYW1lcyI6WyJjb25zdCIsIlQuU0VUX0VSUk9SX1RJVExFIiwiVC5DTEVBUl9FUlJPUl9USVRMRSIsIlQuU0VUX0VSUk9SX01FU1NBR0UiLCJULkNMRUFSX0VSUk9SX01FU1NBR0UiLCJULlNFVF9IQVNfRVJST1IiLCJsZXQiLCJULkFERF9VU0VSIiwiVC5SRUNJRVZFRF9VU0VSUyIsIlQuU0VUX0NVUlJFTlRfVVNFUl9JRCIsImNvbWJpbmVSZWR1Y2VycyIsIlQuU0VUX0lNQUdFU19PV05FUiIsIlQuQUREX0lNQUdFIiwiVC5SRUNJRVZFRF9VU0VSX0lNQUdFUyIsIlQuUkVNT1ZFX0lNQUdFIiwiVC5JTkNSX0NPTU1FTlRfQ09VTlQiLCJULkRFQ1JfQ09NTUVOVF9DT1VOVCIsIlQuU0VUX1NFTEVDVEVEX0lNRyIsIlQuQUREX1NFTEVDVEVEX0lNQUdFX0lEIiwiVC5SRU1PVkVfU0VMRUNURURfSU1BR0VfSUQiLCJmaWx0ZXIiLCJULkNMRUFSX1NFTEVDVEVEX0lNQUdFX0lEUyIsIlQuUkVDSUVWRURfQ09NTUVOVFMiLCJULlNFVF9TS0lQX0NPTU1FTlRTIiwiVC5TRVRfVEFLRV9DT01NRU5UUyIsIlQuU0VUX0NVUlJFTlRfUEFHRSIsIlQuU0VUX1RPVEFMX1BBR0VTIiwibWVzc2FnZSIsInNraXAiLCJULlNFVF9TS0lQX1dIQVRTX05FVyIsInRha2UiLCJULlNFVF9UQUtFX1dIQVRTX05FVyIsInBhZ2UiLCJULlNFVF9QQUdFX1dIQVRTX05FVyIsInRvdGFsUGFnZXMiLCJULlNFVF9UT1RBTF9QQUdFU19XSEFUU19ORVciLCJULkFERF9MQVRFU1QiLCJjcmVhdGVTdG9yZSIsImFwcGx5TWlkZGxld2FyZSIsInN1cGVyIiwiTGluayIsIkluZGV4TGluayIsIkVycm9yIiwiUm93IiwiQ29sIiwiQWxlcnQiLCJHcmlkIiwiTmF2YmFyIiwiTmF2IiwiY29ubmVjdCIsIk1lZGlhIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwibWFwU3RhdGVUb1Byb3BzIiwiZmluZCIsIkp1bWJvdHJvbiIsInJvdyIsIndpdGhSb3V0ZXIiLCJzZXRUb3RhbFBhZ2VzIiwidGhpcyIsIlByb3ZpZGVyIiwiUm91dGVyIiwiYnJvd3Nlckhpc3RvcnkiLCJSb3V0ZSIsIkluZGV4Um91dGUiXSwibWFwcGlu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