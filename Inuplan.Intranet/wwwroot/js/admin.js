webpackJsonp([1],{

/***/ 17:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_error__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_marked__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_marked___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_marked__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_remove_markdown__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_remove_markdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_remove_markdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_status__ = __webpack_require__(44);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return objMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return put; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return options; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return responseHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return union; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return timeText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return formatText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return getWords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return getFullName; });
/* unused harmony export visitComments */
/* unused harmony export depthFirstSearch */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return normalizeComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return getForumCommentsDeleteUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getForumCommentsPageUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getImageCommentsPageUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return getImageCommentsDeleteUrl; });




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
    dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_status__["b" /* endLoading */])());
    if (response.ok)
        return onSuccess(response);
    else {
        switch (response.status) {
            case 400:
                dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__actions_error__["a" /* setError */])({ title: "400 Bad Request", message: "The request was not well-formed" }));
                break;
            case 404:
                dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__actions_error__["a" /* setError */])({ title: "404 Not Found", message: "Could not find resource" }));
                break;
            case 408:
                dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__actions_error__["a" /* setError */])({ title: "408 Request Timeout", message: "The server did not respond in time" }));
                break;
            case 500:
                dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__actions_error__["a" /* setError */])({ title: "500 Server Error", message: "Something went wrong with the API-server" }));
                break;
            default:
                dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__actions_error__["a" /* setError */])({ title: "Oops", message: "Something went wrong!" }));
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
    if (expire === void 0) { expire = 12.5; }
    var ago = moment(postedOn).fromNow();
    var diff = moment().diff(postedOn, "hours", true);
    if (diff >= expire) {
        var date = moment(postedOn);
        return "d. " + date.format("D MMM YYYY ") + " kl. " + date.format("H:mm");
    }
    return "for " + ago;
};
var formatText = function (text) {
    if (!text)
        return null;
    var rawMarkup = __WEBPACK_IMPORTED_MODULE_1_marked__(text, { sanitize: true });
    return { __html: rawMarkup };
};
var getWords = function (text, numberOfWords) {
    if (!text)
        return "";
    var plainText = __WEBPACK_IMPORTED_MODULE_2_remove_markdown___default()(text);
    return plainText.split(/\s+/).slice(0, numberOfWords).join(" ");
};
var getFullName = function (user, none) {
    if (none === void 0) { none = ""; }
    if (!user)
        return none;
    return user.FirstName + " " + user.LastName;
};
var visitComments = function (comments, func) {
    var getReplies = function (c) { return c.Replies ? c.Replies : []; };
    for (var i = 0; i < comments.length; i++) {
        depthFirstSearch(comments[i], getReplies, func);
    }
};
var depthFirstSearch = function (current, getChildren, func) {
    func(current);
    var children = getChildren(current);
    for (var i = 0; i < children.length; i++) {
        depthFirstSearch(children[i], getChildren, func);
    }
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
    return globals.urls.forumcomments + "?commentId=" + commentId;
};
var getForumCommentsPageUrl = function (postId, skip, take) {
    return globals.urls.forumcomments + "?postId=" + postId + "&skip=" + skip + "&take=" + take;
};
var getImageCommentsPageUrl = function (imageId, skip, take) {
    return globals.urls.imagecomments + "?imageId=" + imageId + "&skip=" + skip + "&take=" + take;
};
var getImageCommentsDeleteUrl = function (commentId) {
    return globals.urls.imagecomments + "?commentId=" + commentId;
};


/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_utils__ = __webpack_require__(17);


var users = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case 22:
            {
                var users_1 = action.payload;
                return users_1;
            }
        case 21: {
            var user = action.payload;
            var users_2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* put */])(state, user.ID, user);
            return users_2;
        }
        default:
            return state;
    }
};
var currentUserId = function (state, action) {
    if (state === void 0) { state = -1; }
    switch (action.type) {
        case 20:
            return action.payload;
        default:
            return state;
    }
};
var usersInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    currentUserId: currentUserId,
    users: users
});
/* harmony default export */ __webpack_exports__["a"] = usersInfo;


/***/ }),

/***/ 339:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardAdmin; });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var DashboardAdmin = (function (_super) {
    __extends(DashboardAdmin, _super);
    function DashboardAdmin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DashboardAdmin.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Navbar"], { fixedTop: true },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Navbar"].Header, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Navbar"].Brand, null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", className: "navbar-brand" }, "Inuplan Intranet Admin")),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Navbar"].Toggle, null)),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Navbar"].Collapse, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Navbar"].Text, { pullRight: true },
                        "Hej, ",
                        "{name}",
                        "!"))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "container-fluid" },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "row" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "col-sm-1 menu" }, "Menu"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "col-md-11 main" },
                        "Main",
                        this.props.children))));
    };
    return DashboardAdmin;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 342:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reducers_admin_root__ = __webpack_require__(746);



var store = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_2__reducers_admin_root__["a" /* default */], __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["applyMiddleware"])(__WEBPACK_IMPORTED_MODULE_1_redux_thunk___default.a));
/* harmony default export */ __webpack_exports__["a"] = store;


/***/ }),

/***/ 44:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_utils__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return startLoading; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return endLoading; });
/* unused harmony export setUsedSpacekB */
/* unused harmony export setTotalSpacekB */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fetchSpaceInfo; });


var startLoading = function () {
    return {
        type: 34
    };
};
var endLoading = function () {
    return {
        type: 35
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
        dispatch(startLoading());
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities_utils__["a" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_0__utilities_utils__["b" /* options */])
            .then(handler)
            .then(function (data) {
            var usedSpace = data.UsedSpaceKB;
            var totalSpace = data.SpaceQuotaKB;
            dispatch(setUsedSpacekB(usedSpace));
            dispatch(setTotalSpacekB(totalSpace));
        });
    };
};


/***/ }),

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_utils__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__status__ = __webpack_require__(44);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return addUser; });
/* unused harmony export setCurrentUserId */
/* unused harmony export recievedUsers */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fetchCurrentUser; });
/* unused harmony export fetchUser */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return fetchUsers; });



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
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__status__["a" /* startLoading */])());
        var url = globals.urls.users + "?username=" + username;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["a" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["b" /* options */])
            .then(handler)
            .then(function (user) {
            dispatch(addUser(user));
            dispatch(setCurrentUserId(user.ID));
        });
    };
};
var fetchUser = function (username) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__status__["a" /* startLoading */])());
        var url = globals.urls.users + "?username=" + username;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["a" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["b" /* options */])
            .then(handler)
            .then(function (user) { dispatch(addUser(user)); });
    };
};
var fetchUsers = function () {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__status__["a" /* startLoading */])());
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["a" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(globals.urls.users, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["b" /* options */])
            .then(handler)
            .then(function (users) {
            var getKey = function (user) { return user.ID; };
            var getValue = function (user) { return user; };
            var obj = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* objMap */])(users, getKey, getValue);
            dispatch(recievedUsers(obj));
        });
    };
};


/***/ }),

/***/ 746:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__usersInfo__ = __webpack_require__(198);


var rootReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    usersInfo: __WEBPACK_IMPORTED_MODULE_1__usersInfo__["a" /* default */]
});
/* harmony default export */ __webpack_exports__["a"] = rootReducer;


/***/ }),

/***/ 756:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__store_admin__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_shells_DashboardAdmin__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_users__ = __webpack_require__(59);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







var Admin = (function (_super) {
    __extends(Admin, _super);
    function Admin(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isAdmin: false
        };
        return _this;
    }
    Admin.prototype.componentDidMount = function () {
        var _this = this;
        var future = __WEBPACK_IMPORTED_MODULE_4__store_admin__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__actions_users__["a" /* fetchCurrentUser */])(globals.currentUsername));
        future.then(function () {
            var storeState = __WEBPACK_IMPORTED_MODULE_4__store_admin__["a" /* default */].getState();
            var user = storeState.usersInfo.users[storeState.usersInfo.currentUserId];
            var isAdmin = user ? user.IsAdmin : false;
            _this.setState({ isAdmin: isAdmin });
        });
    };
    Admin.prototype.render = function () {
        var isAdmin = this.state.isAdmin;
        if (!isAdmin)
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, "Access denied!");
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_redux__["Provider"], { store: __WEBPACK_IMPORTED_MODULE_4__store_admin__["a" /* default */] },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Router"], { history: __WEBPACK_IMPORTED_MODULE_2_react_router__["browserHistory"] },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "/admin", component: __WEBPACK_IMPORTED_MODULE_5__components_shells_DashboardAdmin__["a" /* DashboardAdmin */] })));
    };
    return Admin;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_dom__["render"])(__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](Admin, null), document.getElementById("content"));


/***/ }),

/***/ 94:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export setHasError */
/* unused harmony export setErrorTitle */
/* unused harmony export clearErrorTitle */
/* unused harmony export clearErrorMessage */
/* unused harmony export setErrorMessage */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return setError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return clearError; });
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


/***/ })

},[756]);
//# sourceMappingURL=admin.js.map