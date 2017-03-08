webpackJsonp([0],{

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__status__ = __webpack_require__(71);
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
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__status__["b" /* startLoading */])());
        var url = globals.urls.users + "?username=" + username;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (user) {
            dispatch(setCurrentUserId(user.ID));
            dispatch(addUser(user));
        });
    };
};
var fetchUser = function (username) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__status__["b" /* startLoading */])());
        var url = globals.urls.users + "?username=" + username;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (user) { dispatch(addUser(user)); });
    };
};
var fetchUsers = function () {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__status__["b" /* startLoading */])());
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(globals.urls.users, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (users) {
            var getKey = function (user) { return user.ID; };
            var getValue = function (user) { return user; };
            var obj = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["f" /* objMap */])(users, getKey, getValue);
            dispatch(recievedUsers(obj));
        });
    };
};


/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommentProfile; });
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


var CommentProfile = (function (_super) {
    __extends(CommentProfile, _super);
    function CommentProfile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommentProfile.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Media"].Left, { className: "comment-profile" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Image"], { src: "/images/person_icon.svg", style: { width: "64px", height: "64px" }, className: "media-object" }),
            this.props.children);
    };
    return CommentProfile;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Pagination; });
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


var Pagination = (function (_super) {
    __extends(Pagination, _super);
    function Pagination() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pagination.prototype.render = function () {
        var _a = this.props, totalPages = _a.totalPages, page = _a.page, pageHandle = _a.pageHandle, show = _a.show;
        var more = totalPages > 1;
        var xor = (show || more) && !(show && more);
        if (!(xor || (show && more)))
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Pagination"], { prev: true, next: true, ellipsis: true, boundaryLinks: true, items: totalPages, maxButtons: 5, activePage: page, onSelect: pageHandle });
    };
    return Pagination;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_draft_js__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_draft_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_draft_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ToolbarBlock__ = __webpack_require__(735);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_draft_js_import_markdown__ = __webpack_require__(410);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_draft_js_import_markdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_draft_js_import_markdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_draft_js_export_markdown__ = __webpack_require__(404);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_draft_js_export_markdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_draft_js_export_markdown__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextEditor; });
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





__webpack_require__(725);
var TextEditor = (function (_super) {
    __extends(TextEditor, _super);
    function TextEditor(props) {
        var _this = _super.call(this, props) || this;
        var editorState = Boolean(props.markdown) ? __WEBPACK_IMPORTED_MODULE_1_draft_js__["EditorState"].createWithContent(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_draft_js_import_markdown__["stateFromMarkdown"])(props.markdown)) : __WEBPACK_IMPORTED_MODULE_1_draft_js__["EditorState"].createEmpty();
        _this.state = {
            hasFocus: false,
            editorState: editorState
        };
        _this.onFocus = _this.onFocus.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.onChange = _this.onChange.bind(_this);
        _this.getText = _this.getText.bind(_this);
        _this.setText = _this.setText.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.onStyleClick = _this.onStyleClick.bind(_this);
        return _this;
    }
    TextEditor.prototype.getText = function () {
        var editorState = this.state.editorState;
        var markdown = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_draft_js_export_markdown__["stateToMarkdown"])(editorState.getCurrentContent());
        return markdown;
    };
    TextEditor.prototype.setText = function (markdown) {
        var editorState = Boolean(markdown) ? __WEBPACK_IMPORTED_MODULE_1_draft_js__["EditorState"].createWithContent(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_draft_js_import_markdown__["stateFromMarkdown"])(markdown)) : __WEBPACK_IMPORTED_MODULE_1_draft_js__["EditorState"].createEmpty();
        this.setState({ editorState: editorState });
    };
    TextEditor.prototype.onChange = function (editorState) {
        this.setState({ editorState: editorState });
    };
    TextEditor.prototype.onFocus = function (_) {
        this.setState({ hasFocus: true });
    };
    TextEditor.prototype.onBlur = function (_) {
        this.setState({ hasFocus: false });
    };
    TextEditor.prototype.onStyleClick = function (styleType, style) {
        var editorState = this.state.editorState;
        var changeState;
        switch (styleType) {
            case 0: {
                changeState = __WEBPACK_IMPORTED_MODULE_1_draft_js__["RichUtils"].toggleBlockType(editorState, style);
                break;
            }
            case 1: {
                changeState = __WEBPACK_IMPORTED_MODULE_1_draft_js__["RichUtils"].toggleInlineStyle(editorState, style);
                break;
            }
            default: {
                changeState = editorState;
                break;
            }
        }
        this.onChange(changeState);
    };
    TextEditor.prototype.handleFocus = function (_) {
        var hasFocus = this.state.hasFocus;
        if (!hasFocus) {
            var editor = this.refs.editor;
            editor.focus();
        }
    };
    TextEditor.prototype.render = function () {
        var placeholder = this.props.placeholder;
        var _a = this.state, hasFocus = _a.hasFocus, editorState = _a.editorState;
        var currentBlockType = __WEBPACK_IMPORTED_MODULE_1_draft_js__["RichUtils"].getCurrentBlockType(editorState);
        var currentInlineType = editorState.getCurrentInlineStyle();
        var css = hasFocus ? "richEditor-root textEditor-focus" : "richEditor-root";
        var styleMap = {
            "CODE": {
                padding: "2px 4px",
                fontSize: "90%",
                color: "#c7254e",
                backgroundColor: "#f9f2f4",
                borderRadius: "4px"
            }
        };
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: css },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__ToolbarBlock__["a" /* ToolbarBlock */], { onStyleClick: this.onStyleClick, currentBlockType: currentBlockType, currentInlineType: currentInlineType }),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { onClick: this.handleFocus, className: "textEditor-base" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_draft_js__["Editor"], { editorState: editorState, onChange: this.onChange, onFocus: this.onFocus, onBlur: this.onBlur, placeholder: placeholder, customStyleMap: styleMap, ref: "editor" }))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null));
    };
    return TextEditor;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 190:
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


/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utilities_normalize__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__status__ = __webpack_require__(71);
/* unused harmony export addThreadTitle */
/* unused harmony export setThreadTitles */
/* unused harmony export setTotalPages */
/* unused harmony export setPage */
/* unused harmony export setSkip */
/* unused harmony export setTake */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return setSelectedThread; });
/* unused harmony export setPostContent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return markPost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fetchThreads; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return fetchPost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return updatePost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return deletePost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return postThread; });




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
var setTotalPages = function (totalPages) {
    return {
        type: 26,
        payload: totalPages
    };
};
var setPage = function (page) {
    return {
        type: 27,
        payload: page
    };
};
var setSkip = function (skip) {
    return {
        type: 28,
        payload: skip
    };
};
var setTake = function (take) {
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
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__status__["b" /* startLoading */])());
        var url = globals.urls.forumpost + "?postId=" + postId + "&read=" + read;
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */], {
            method: "PUT"
        });
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (_) { return null; });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
            .then(handler)
            .then(cb);
    };
};
var fetchThreads = function (skip, take) {
    if (skip === void 0) { skip = 0; }
    if (take === void 0) { take = 10; }
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__status__["b" /* startLoading */])());
        var forum = globals.urls.forumtitle;
        var url = forum + "?skip=" + skip + "&take=" + take;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (data) {
            var pageForumTitles = data.CurrentItems;
            var forumTitles = pageForumTitles.map(__WEBPACK_IMPORTED_MODULE_2__utilities_normalize__["b" /* normalizeThreadTitle */]);
            dispatch(setSkip(skip));
            dispatch(setTake(take));
            dispatch(setTotalPages(data.TotalPages));
            dispatch(setPage(data.CurrentPage));
            dispatch(setThreadTitles(forumTitles));
        });
    };
};
var fetchPost = function (id, cb) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__status__["b" /* startLoading */])());
        var forum = globals.urls.forumpost;
        var url = forum + "?id=" + id;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (data) {
            var content = data.Text;
            var title = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utilities_normalize__["b" /* normalizeThreadTitle */])(data.Header);
            dispatch(addThreadTitle(title));
            dispatch(setPostContent(content));
            dispatch(setSelectedThread(data.ThreadID));
        })
            .then(cb);
    };
};
var updatePost = function (post, cb) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__status__["b" /* startLoading */])());
        var url = "" + globals.urls.forumpost;
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (_) { return null; });
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */], {
            method: "PUT",
            body: JSON.stringify(post),
            headers: headers
        });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
            .then(handler)
            .then(cb);
    };
};
var deletePost = function (id, cb) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__status__["b" /* startLoading */])());
        var url = globals.urls.forumpost + "?id=" + id;
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */], {
            method: "DELETE"
        });
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (_) { return null; });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
            .then(handler)
            .then(cb);
    };
};
var postThread = function (post, cb) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__status__["b" /* startLoading */])());
        var url = globals.urls.forumpost;
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */], {
            method: "POST",
            body: JSON.stringify(post),
            headers: headers
        });
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (_) { return null; });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
            .then(handler)
            .then(cb);
    };
};


/***/ }),

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_normalize__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_isomorphic_fetch__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_users__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__status__ = __webpack_require__(71);
/* unused harmony export setLatest */
/* unused harmony export setSkip */
/* unused harmony export setTake */
/* unused harmony export setPage */
/* unused harmony export setTotalPages */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fetchLatestNews; });





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
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__status__["b" /* startLoading */])());
        var url = globals.urls.whatsnew + "?skip=" + skip + "&take=" + take;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_2_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_0__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (page) {
            var items = page.CurrentItems;
            items.forEach(function (item) {
                var author = getAuthor(item.Type, item.Item);
                if (author) {
                    dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_users__["c" /* addUser */])(author));
                }
            });
            dispatch(setSkip(skip));
            dispatch(setTake(take));
            dispatch(setPage(page.CurrentPage));
            dispatch(setTotalPages(page.TotalPages));
            var normalized = items.map(__WEBPACK_IMPORTED_MODULE_1__utilities_normalize__["c" /* normalizeLatest */]);
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


/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router__ = __webpack_require__(22);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Breadcrumb; });
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


var Breadcrumb = (function (_super) {
    __extends(Breadcrumb, _super);
    function Breadcrumb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Breadcrumb.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("ol", { className: "breadcrumb" }, this.props.children);
    };
    return Breadcrumb;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));

(function (Breadcrumb) {
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Item.prototype.render = function () {
            var _a = this.props, href = _a.href, active = _a.active;
            if (active)
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("li", { className: "active" }, this.props.children);
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("li", null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Link"], { to: href }, this.props.children));
        };
        return Item;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
    Breadcrumb.Item = Item;
})(Breadcrumb || (Breadcrumb = {}));


/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WhatsNewTooltip; });
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


var WhatsNewTooltip = (function (_super) {
    __extends(WhatsNewTooltip, _super);
    function WhatsNewTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WhatsNewTooltip.prototype.tooltipView = function (tip) {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Tooltip"], { id: "tooltip" }, tip);
    };
    WhatsNewTooltip.prototype.render = function () {
        var _a = this.props, tooltip = _a.tooltip, children = _a.children;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["OverlayTrigger"], { placement: "left", overlay: this.tooltipView(tooltip) }, children);
    };
    return WhatsNewTooltip;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return normalizeLatest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizeThreadTitle; });
/* unused harmony export normalizeComment */
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
        AuthorID: authorId
    };
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
        Description: img.Description
    };
};
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
        ViewedBy: viewedBy
    };
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


/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__forum_ForumForm__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__comments_CommentControls__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_forum__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_router__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_react_redux__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ForumBody; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ForumHeader; });
/* unused harmony export ForumButtonGroup */
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};









var mapStateToProps = function (state) {
    var selected = state.forumInfo.titlesInfo.selectedThread;
    var title = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_underscore__["find"])(state.forumInfo.titlesInfo.titles, function (title) { return title.ID === selected; });
    return {
        selected: selected,
        title: title,
        text: state.forumInfo.postContent,
        getUser: function (id) { return state.usersInfo.users[id]; },
        canEdit: function (id) { return state.usersInfo.currentUserId === id; },
        hasRead: title ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_underscore__["contains"])(title.ViewedBy, state.usersInfo.currentUserId) : false
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        update: function (post, cb) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_forum__["c" /* updatePost */])(post, cb));
        },
        getPost: function (id) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_forum__["b" /* fetchPost */])(id))
                .then(function () { return dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_forum__["d" /* setSelectedThread */])(id)); });
        },
        deletePost: function (id, cb) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_forum__["e" /* deletePost */])(id, cb));
        },
        readPost: function (postId, read, cb) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_forum__["f" /* markPost */])(postId, read, cb));
        }
    };
};
var ForumPostContainer = (function (_super) {
    __extends(ForumPostContainer, _super);
    function ForumPostContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            edit: false
        };
        _this.toggleEdit = _this.toggleEdit.bind(_this);
        _this.onSubmit = _this.onSubmit.bind(_this);
        _this.deleteHandle = _this.deleteHandle.bind(_this);
        _this.togglePostRead = _this.togglePostRead.bind(_this);
        return _this;
    }
    ForumPostContainer.prototype.componentWillReceiveProps = function (nextProps) {
        var hasTitle = Boolean(nextProps.title);
        if (!hasTitle)
            return;
        var title = nextProps.title;
        this.setState({
            model: {
                ThreadID: title.ID,
                Title: title.Title,
                Text: nextProps.text,
                Sticky: title.Sticky,
                IsPublished: title.IsPublished
            }
        });
        document.title = nextProps.title.Title;
    };
    ForumPostContainer.prototype.deleteHandle = function () {
        var _a = this.props, router = _a.router, deletePost = _a.deletePost, title = _a.title;
        var cb = function () {
            var forumlists = "/forum";
            router.push(forumlists);
        };
        deletePost(title.ID, cb);
    };
    ForumPostContainer.prototype.toggleEdit = function () {
        var edit = this.state.edit;
        this.setState({ edit: !edit });
    };
    ForumPostContainer.prototype.onSubmit = function (post) {
        var _a = this.props, update = _a.update, getPost = _a.getPost, title = _a.title;
        var cb = function () {
            getPost(title.ID);
        };
        update(post, cb);
    };
    ForumPostContainer.prototype.togglePostRead = function (toggle) {
        var _a = this.props, getPost = _a.getPost, readPost = _a.readPost, title = _a.title;
        var cb = function () {
            getPost(title.ID);
        };
        readPost(title.ID, toggle, cb);
    };
    ForumPostContainer.prototype.close = function () {
        this.setState({ edit: false });
    };
    ForumPostContainer.prototype.render = function () {
        var _a = this.props, canEdit = _a.canEdit, selected = _a.selected, title = _a.title, text = _a.text, getUser = _a.getUser, hasRead = _a.hasRead;
        if (selected < 0 || !title)
            return null;
        var edit = canEdit(title.AuthorID);
        var user = getUser(title.AuthorID);
        var author = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utilities_utils__["k" /* getFullName */])(user);
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](ForumHeader, { lg: 12, name: author, title: title.Title, createdOn: title.CreatedOn, modifiedOn: title.LastModified },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](ForumButtonGroup, { show: true, editable: edit, initialRead: hasRead, onDelete: this.deleteHandle, onEdit: this.toggleEdit, onRead: this.togglePostRead.bind(this, true), onUnread: this.togglePostRead.bind(this, false) })),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](ForumBody, { text: text, lg: 10 },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("hr", null),
                this.props.children),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__forum_ForumForm__["a" /* ForumForm */], { show: this.state.edit, close: this.close.bind(this), onSubmit: this.onSubmit.bind(this), edit: this.state.model }));
    };
    return ForumPostContainer;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var ForumBody = (function (_super) {
    __extends(ForumBody, _super);
    function ForumBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForumBody.prototype.render = function () {
        var _a = this.props, text = _a.text, lg = _a.lg, lgOffset = _a.lgOffset;
        var formattedText = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utilities_utils__["i" /* formatText */])(text);
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Col"], { lg: lg, lgOffset: lgOffset },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", { className: "forum-content", dangerouslySetInnerHTML: formattedText }),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Row"], null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Col"], { lg: 12 }, this.props.children))));
    };
    return ForumBody;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));

var ForumHeader = (function (_super) {
    __extends(ForumHeader, _super);
    function ForumHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForumHeader.prototype.getCreatedOnText = function (createdOn, modifiedOn) {
        var date = moment(createdOn);
        var dateText = date.format("D-MM-YY");
        var timeText = date.format(" H:mm");
        if (!modifiedOn)
            return "Udgivet " + dateText + " kl. " + timeText;
        var modified = moment(modifiedOn);
        var modifiedDate = modified.format("D-MM-YY");
        var modifiedTime = modified.format("H:mm");
        return "Udgivet " + dateText + " kl. " + timeText + " ( rettet " + modifiedDate + " kl. " + modifiedTime + " )";
    };
    ForumHeader.prototype.render = function () {
        var _a = this.props, title = _a.title, name = _a.name, createdOn = _a.createdOn, modifiedOn = _a.modifiedOn, lg = _a.lg, lgOffset = _a.lgOffset;
        var created = this.getCreatedOnText(createdOn, modifiedOn);
        var props = { lg: lg, lgOffset: lgOffset };
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Col"], __assign({}, props),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h3", null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "text-capitalize" }, title),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("small", null,
                        "Skrevet af ",
                        name)),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("small", { className: "text-primary" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Glyphicon"], { glyph: "time" }),
                    " ",
                    created),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Row"], null, this.props.children)));
    };
    return ForumHeader;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));

var ForumButtonGroup = (function (_super) {
    __extends(ForumButtonGroup, _super);
    function ForumButtonGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            read: props.initialRead
        };
        _this.readHandle = _this.readHandle.bind(_this);
        _this.unreadHandle = _this.unreadHandle.bind(_this);
        return _this;
    }
    ForumButtonGroup.prototype.readHandle = function () {
        var onRead = this.props.onRead;
        if (this.state.read)
            return;
        this.setState({ read: true });
        onRead();
    };
    ForumButtonGroup.prototype.unreadHandle = function () {
        var onUnread = this.props.onUnread;
        if (!this.state.read)
            return;
        this.setState({ read: false });
        onUnread();
    };
    ForumButtonGroup.prototype.render = function () {
        var _a = this.props, editable = _a.editable, show = _a.show, onDelete = _a.onDelete, onEdit = _a.onEdit;
        if (!show)
            return null;
        var read = this.state.read;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Col"], { lg: 12, className: "forum-editbar" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["ButtonToolbar"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["ButtonGroup"], null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__comments_CommentControls__["b" /* ButtonTooltip */], { bsStyle: "danger", onClick: onDelete, icon: "trash", tooltip: "slet indlæg", mount: editable }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__comments_CommentControls__["b" /* ButtonTooltip */], { bsStyle: "primary", onClick: onEdit, icon: "pencil", tooltip: "ændre indlæg", active: false, mount: editable }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__comments_CommentControls__["b" /* ButtonTooltip */], { bsStyle: "primary", onClick: this.readHandle, icon: "eye-open", tooltip: "marker som læst", active: read, mount: true }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__comments_CommentControls__["b" /* ButtonTooltip */], { bsStyle: "primary", onClick: this.unreadHandle, icon: "eye-close", tooltip: "marker som ulæst", active: !read, mount: true }))));
    };
    return ForumButtonGroup;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));

var ForumPostRedux = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(ForumPostContainer);
var ForumPost = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7_react_router__["withRouter"])(ForumPostRedux);
/* harmony default export */ __webpack_exports__["a"] = ForumPost;


/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reducers_root__ = __webpack_require__(747);



var store = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_2__reducers_root__["a" /* default */], __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["applyMiddleware"])(__WEBPACK_IMPORTED_MODULE_1_redux_thunk___default.a));
/* harmony default export */ __webpack_exports__["a"] = store;


/***/ }),

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_error__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_marked__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_marked___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_marked__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_remove_markdown__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_remove_markdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_remove_markdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_status__ = __webpack_require__(71);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return objMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return put; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return options; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return responseHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return union; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return timeText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return formatText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return getWords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return getFullName; });
/* unused harmony export visitComments */
/* unused harmony export depthFirstSearch */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return normalizeComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return getForumCommentsDeleteUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getForumCommentsPageUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getImageCommentsPageUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return getImageCommentsDeleteUrl; });




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
    dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_status__["a" /* endLoading */])());
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

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CommentControls__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CommentProfile__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Comment; });
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};





var Comment = (function (_super) {
    __extends(Comment, _super);
    function Comment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Comment.prototype.ago = function () {
        var postedOn = this.props.postedOn;
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utilities_utils__["h" /* timeText */])(postedOn);
    };
    Comment.prototype.editedView = function (edited) {
        if (!edited)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null, "*");
    };
    Comment.prototype.render = function () {
        var _a = this.props, canEdit = _a.canEdit, contextId = _a.contextId, name = _a.name, text = _a.text, commentId = _a.commentId, replies = _a.replies, construct = _a.construct, authorId = _a.authorId, edited = _a.edited;
        var _b = this.props, editComment = _b.editComment, deleteComment = _b.deleteComment, replyComment = _b.replyComment;
        var props = { editComment: editComment, deleteComment: deleteComment, replyComment: replyComment };
        var txt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utilities_utils__["i" /* formatText */])(text);
        var replyNodes = replies.map(function (reply) { return construct(reply); });
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Media"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__CommentProfile__["a" /* CommentProfile */], null),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Media"].Body, null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h5", { className: "media-heading" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("strong", null, name),
                    " ",
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("small", null,
                        "sagde ",
                        this.ago(),
                        this.editedView(edited))),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { dangerouslySetInnerHTML: txt }),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__CommentControls__["a" /* CommentControls */], __assign({ contextId: contextId, canEdit: canEdit, authorId: authorId, commentId: commentId, text: text }, props)),
                replyNodes));
    };
    return Comment;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 324:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__texteditor_TextEditor__ = __webpack_require__(121);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ButtonTooltip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommentControls; });
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



var ButtonTooltip = (function (_super) {
    __extends(ButtonTooltip, _super);
    function ButtonTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonTooltip.prototype.render = function () {
        var _a = this.props, tooltip = _a.tooltip, onClick = _a.onClick, icon = _a.icon, bsStyle = _a.bsStyle, active = _a.active, mount = _a.mount;
        var overlayTip = __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Tooltip"], { id: "tooltip" }, tooltip);
        if (!mount)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["OverlayTrigger"], { placement: "top", overlay: overlayTip },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { bsStyle: bsStyle, bsSize: "xsmall", onClick: onClick, active: active },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Glyphicon"], { glyph: icon })));
    };
    return ButtonTooltip;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));

var CommentControls = (function (_super) {
    __extends(CommentControls, _super);
    function CommentControls(props) {
        var _this = _super.call(this, props) || this;
        var editId = "editTextControl_" + props.commentId + "_" + props.contextId;
        var replyId = "replyTextControl_" + props.commentId + "_" + props.contextId;
        _this.state = {
            reply: false,
            edit: false,
            editId: editId,
            replyId: replyId
        };
        _this.toggleEdit = _this.toggleEdit.bind(_this);
        _this.toggleReply = _this.toggleReply.bind(_this);
        _this.editHandle = _this.editHandle.bind(_this);
        _this.replyHandle = _this.replyHandle.bind(_this);
        _this.deleteHandle = _this.deleteHandle.bind(_this);
        return _this;
    }
    CommentControls.prototype.toggleEdit = function () {
        var text = this.props.text;
        var _a = this.state, edit = _a.edit, editId = _a.editId;
        this.setState({ edit: !edit });
        if (edit) {
            var editor = this.refs[editId];
            editor.setText(text);
        }
    };
    CommentControls.prototype.toggleReply = function () {
        var _a = this.state, reply = _a.reply, replyId = _a.replyId;
        this.setState({ reply: !reply });
        if (!reply) {
            var editor = this.refs[replyId];
            editor.setText("");
        }
    };
    CommentControls.prototype.deleteHandle = function () {
        var _a = this.props, deleteComment = _a.deleteComment, commentId = _a.commentId, contextId = _a.contextId;
        deleteComment(commentId, contextId);
    };
    CommentControls.prototype.editHandle = function (text) {
        var _a = this.props, editComment = _a.editComment, contextId = _a.contextId, commentId = _a.commentId;
        this.setState({ edit: false });
        editComment(commentId, contextId, text);
    };
    CommentControls.prototype.replyHandle = function (text) {
        var _a = this.props, commentId = _a.commentId, contextId = _a.contextId, replyComment = _a.replyComment;
        this.setState({ reply: false });
        replyComment(contextId, text, commentId);
    };
    CommentControls.prototype.render = function () {
        var _a = this.props, authorId = _a.authorId, canEdit = _a.canEdit, text = _a.text;
        var _b = this.state, edit = _b.edit, reply = _b.reply, editId = _b.editId, replyId = _b.replyId;
        var mount = canEdit(authorId);
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], { style: { paddingBottom: "5px", paddingLeft: "15px" } },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 4 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["ButtonToolbar"], null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["ButtonGroup"], null,
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](ButtonTooltip, { bsStyle: "primary", onClick: this.deleteHandle, icon: "trash", tooltip: "slet", mount: mount }),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](ButtonTooltip, { bsStyle: "primary", onClick: this.toggleEdit, icon: "pencil", tooltip: "ændre", active: edit, mount: mount }),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](ButtonTooltip, { bsStyle: "primary", onClick: this.toggleReply, icon: "envelope", tooltip: "svar", active: reply, mount: true }))))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], { style: { paddingBottom: "5px" } },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lgOffset: 1, lg: 10 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](CollapseTextArea, { show: edit, id: editId, value: text, toggle: this.toggleEdit, onSubmit: this.editHandle, submitText: "Gem ændringer", mount: mount, ref: editId }))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lgOffset: 1, lg: 10 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](CollapseTextArea, { show: reply, id: replyId, value: "", toggle: this.toggleReply, onSubmit: this.replyHandle, submitText: "Svar", mount: true, ref: replyId }))));
    };
    return CommentControls;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));

var CollapseTextArea = (function (_super) {
    __extends(CollapseTextArea, _super);
    function CollapseTextArea(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = _this.onClick.bind(_this);
        _this.setText = _this.setText.bind(_this);
        return _this;
    }
    CollapseTextArea.prototype.onClick = function () {
        var _a = this.props, onSubmit = _a.onSubmit, id = _a.id;
        var editor = this.refs[id];
        var text = editor.getText();
        onSubmit(text);
    };
    CollapseTextArea.prototype.setText = function (text) {
        var id = this.props.id;
        var editor = this.refs[id];
        editor.setText(text);
    };
    CollapseTextArea.prototype.render = function () {
        var _a = this.props, value = _a.value, show = _a.show, id = _a.id, toggle = _a.toggle, submitText = _a.submitText, mount = _a.mount;
        if (!mount)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Collapse"], { "in": show },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["FormGroup"], { controlId: id },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["ButtonToolbar"], null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__texteditor_TextEditor__["a" /* TextEditor */], { placeholder: "Skriv kommentar her...", markdown: value, ref: id }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { onClick: toggle }, "Luk"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { bsStyle: "info", onClick: this.onClick }, submitText))));
    };
    return CollapseTextArea;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));


/***/ }),

/***/ 325:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CommentDeleted__ = __webpack_require__(726);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Comment__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommentList; });
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};




var CommentList = (function (_super) {
    __extends(CommentList, _super);
    function CommentList(props) {
        var _this = _super.call(this, props) || this;
        _this.constructComment = _this.constructComment.bind(_this);
        return _this;
    }
    CommentList.prototype.rootComments = function (comments) {
        var _this = this;
        if (!comments)
            return null;
        return comments.map(function (comment) {
            var node = _this.constructComment(comment);
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Media"].ListItem, { key: "rootComment_" + comment.CommentID }, node);
        });
    };
    CommentList.prototype.constructComment = function (comment) {
        var key = "commentId" + comment.CommentID;
        if (comment.Deleted)
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__CommentDeleted__["a" /* CommentDeleted */], { key: key, construct: this.constructComment, replies: comment.Replies });
        var _a = this.props, contextId = _a.contextId, getName = _a.getName, canEdit = _a.canEdit;
        var _b = this.props, skip = _b.skip, take = _b.take, editComment = _b.editComment, deleteComment = _b.deleteComment, replyComment = _b.replyComment;
        var controls = { skip: skip, take: take, editComment: editComment, deleteComment: deleteComment, replyComment: replyComment };
        var name = getName(comment.AuthorID);
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__Comment__["a" /* Comment */], __assign({ key: key, contextId: contextId, name: name, postedOn: comment.PostedOn, authorId: comment.AuthorID, text: comment.Text, construct: this.constructComment, replies: comment.Replies, edited: comment.Edited, canEdit: canEdit, commentId: comment.CommentID }, controls));
    };
    CommentList.prototype.render = function () {
        var comments = this.props.comments;
        var nodes = this.rootComments(comments);
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Media"].List, null, nodes);
    };
    return CommentList;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 326:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_status__ = __webpack_require__(71);
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




var mapStateToProps = function (state) {
    return {
        usedMB: (state.statusInfo.spaceInfo.usedSpacekB / 1000),
        totalMB: (state.statusInfo.spaceInfo.totalSpacekB / 1000),
        loaded: (state.statusInfo.spaceInfo.totalSpacekB !== -1)
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        getSpaceInfo: function (url) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_status__["c" /* fetchSpaceInfo */])(url));
        }
    };
};
var UsedSpaceView = (function (_super) {
    __extends(UsedSpaceView, _super);
    function UsedSpaceView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UsedSpaceView.prototype.componentDidMount = function () {
        var getSpaceInfo = this.props.getSpaceInfo;
        var url = globals.urls.diagnostics + "/getspaceinfo";
        getSpaceInfo(url);
    };
    UsedSpaceView.prototype.render = function () {
        var _a = this.props, usedMB = _a.usedMB, totalMB = _a.totalMB;
        var total = Math.round(totalMB);
        var used = Math.round(usedMB * 100) / 100;
        var free = Math.round((total - used) * 100) / 100;
        var usedPercent = ((used / total) * 100);
        var percentRound = Math.round(usedPercent * 100) / 100;
        var show = Boolean(usedPercent) && Boolean(used) && Boolean(free) && Boolean(total);
        if (!show)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Col"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["ProgressBar"], { striped: true, bsStyle: "success", now: usedPercent, key: 1 }),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", null,
                    "Brugt: ",
                    used.toString(),
                    " MB (",
                    percentRound.toString(),
                    " %)",
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                    "Fri plads: ",
                    free.toString(),
                    " MB",
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                    "Total: ",
                    total.toString(),
                    " MB")));
    };
    return UsedSpaceView;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var UsedSpace = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(UsedSpaceView);
/* harmony default export */ __webpack_exports__["a"] = UsedSpace;


/***/ }),

/***/ 327:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__texteditor_TextEditor__ = __webpack_require__(121);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForumForm; });
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



var ForumForm = (function (_super) {
    __extends(ForumForm, _super);
    function ForumForm(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            ThreadID: -1,
            Title: "",
            Sticky: false,
            IsPublished: true
        };
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }
    ForumForm.prototype.componentWillReceiveProps = function (nextProps) {
        var edit = nextProps.edit;
        if (edit) {
            this.setState({
                ThreadID: edit.ThreadID,
                Title: edit.Title,
                Sticky: edit.Sticky,
                IsPublished: edit.IsPublished
            });
        }
    };
    ForumForm.prototype.handleTitleChange = function (e) {
        this.setState({ Title: e.target.value });
    };
    ForumForm.prototype.getValidation = function () {
        var length = this.state.Title.length;
        if (length >= 0 && length < 200)
            return "success";
        if (length >= 200 && length <= 250)
            return "warning";
        return "error";
    };
    ForumForm.prototype.transformToDTO = function (state) {
        var editor = this.refs.editor;
        var header = {
            IsPublished: state.IsPublished,
            Sticky: state.Sticky,
            Title: state.Title
        };
        var text = editor.getText();
        return {
            Header: header,
            Text: text,
            ThreadID: state.ThreadID
        };
    };
    ForumForm.prototype.handleSubmit = function (e) {
        e.preventDefault();
        var _a = this.props, close = _a.close, onSubmit = _a.onSubmit;
        var post = this.transformToDTO(this.state);
        onSubmit(post);
        close();
    };
    ForumForm.prototype.handleSticky = function () {
        var Sticky = this.state.Sticky;
        this.setState({ Sticky: !Sticky });
    };
    ForumForm.prototype.handlePublished = function () {
        var IsPublished = this.state.IsPublished;
        this.setState({ IsPublished: !IsPublished });
    };
    ForumForm.prototype.closeHandle = function () {
        var close = this.props.close;
        close();
    };
    ForumForm.prototype.render = function () {
        var _a = this.props, show = _a.show, edit = _a.edit;
        var text = Boolean(edit) ? edit.Text : "";
        var readMode = Boolean(!edit);
        var title = readMode ? "Skriv nyt indlæg" : "Ændre indlæg";
        var btnSubmit = readMode ? "Skriv indlæg" : "Gem ændringer";
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Modal"], { show: show, onHide: this.closeHandle.bind(this), bsSize: "lg" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("form", null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Modal"].Header, { closeButton: true },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Modal"].Title, null, title)),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Modal"].Body, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 12 },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["FormGroup"], { controlId: "formPostTitle", validationState: this.getValidation() },
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["ControlLabel"], null, "Overskrift"),
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["FormControl"], { type: "text", placeholder: "Overskrift på indlæg...", onChange: this.handleTitleChange.bind(this), value: this.state.Title })),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["FormGroup"], { controlId: "formPostContent" },
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["ControlLabel"], null, "Indl\u00E6g"),
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__texteditor_TextEditor__["a" /* TextEditor */], { markdown: text, placeholder: "Skriv besked her...", ref: "editor" })),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["FormGroup"], { controlId: "formPostSticky" },
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["ButtonGroup"], null,
                                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { bsStyle: "success", bsSize: "small", active: this.state.Sticky, onClick: this.handleSticky.bind(this) },
                                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Glyphicon"], { glyph: "pushpin" }),
                                        " Vigtig")))))),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Modal"].Footer, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { bsStyle: "default", onClick: this.closeHandle.bind(this) }, "Luk"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { bsStyle: "primary", type: "submit", onClick: this.handleSubmit }, btnSubmit))));
    };
    return ForumForm;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 328:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImageUpload; });
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


var ImageUpload = (function (_super) {
    __extends(ImageUpload, _super);
    function ImageUpload(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            hasFile: false,
            description: ""
        };
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.setHasFile = _this.setHasFile.bind(_this);
        _this.handleDescriptionChange = _this.handleDescriptionChange.bind(_this);
        _this.removeSelectedFiles = _this.removeSelectedFiles.bind(_this);
        _this.uploadButtonView = _this.uploadButtonView.bind(_this);
        _this.clearInput = _this.clearInput.bind(_this);
        return _this;
    }
    ImageUpload.prototype.clearInput = function (fileInput) {
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
    ImageUpload.prototype.getFiles = function () {
        var files = document.getElementById("files");
        return (files ? files.files : []);
    };
    ImageUpload.prototype.handleSubmit = function (e) {
        var _a = this.props, uploadImage = _a.uploadImage, username = _a.username;
        e.preventDefault();
        var fileInput = document.getElementById("files");
        var files = fileInput.files;
        if (files.length === 0)
            return;
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append("file", file);
        }
        uploadImage(username, this.state.description, formData);
        this.clearInput(fileInput);
    };
    ImageUpload.prototype.setHasFile = function (_) {
        var fileInput = document.getElementById("files");
        var files = fileInput.files;
        var result = files.length > 0;
        this.setState({
            hasFile: result
        });
    };
    ImageUpload.prototype.handleDescriptionChange = function (e) {
        this.setState({
            description: e.target.value
        });
    };
    ImageUpload.prototype.removeSelectedFiles = function () {
        var fileInput = document.getElementById("files");
        this.clearInput(fileInput);
        this.setState({
            hasFile: false,
            description: ""
        });
    };
    ImageUpload.prototype.showDescription = function () {
        if (!this.state.hasFile) {
            return null;
        }
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["FormControl"], { id: "description", type: "text", value: this.state.description, placeholder: "Beskriv billedet...", rows: 50, onChange: this.handleDescriptionChange }),
            "\u00A0",
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { bsStyle: "warning", onClick: this.removeSelectedFiles }, " Fortryd"));
    };
    ImageUpload.prototype.uploadButtonView = function () {
        if (!this.state.hasFile)
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { bsStyle: "primary", disabled: true, type: "submit" }, " Upload");
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { bsStyle: "primary", type: "submit" }, "Upload");
    };
    ImageUpload.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("form", { onSubmit: this.handleSubmit, id: "form-upload", className: "form-inline", encType: "multipart/form-data" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "form-group" },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("label", { htmlFor: "files", className: "hide-input", onClick: this.setHasFile },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Glyphicon"], { glyph: "camera" }),
                    " V\u00E6lg filer",
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("input", { type: "file", id: "files", name: "files", onChange: this.setHasFile, multiple: true })),
                "\u00A0 ",
                this.showDescription(),
                " \u00A0",
                this.uploadButtonView()),
            this.props.children);
    };
    return ImageUpload;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 329:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__breadcrumbs_Breadcrumb__ = __webpack_require__(193);
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



var About = (function (_super) {
    __extends(About, _super);
    function About() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    About.prototype.componentDidMount = function () {
        document.title = "Om";
    };
    About.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lgOffset: 2, lg: 8 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__breadcrumbs_Breadcrumb__["a" /* Breadcrumb */], null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__breadcrumbs_Breadcrumb__["a" /* Breadcrumb */].Item, { href: "/" }, "Forside"),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__breadcrumbs_Breadcrumb__["a" /* Breadcrumb */].Item, { active: true }, "Om")))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lgOffset: 2, lg: 8 },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", null,
                    "Dette er en single page application!",
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                    "Teknologier brugt:"),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("ul", null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("li", null, "React"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("li", null, "Redux"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("li", null, "React-Bootstrap"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("li", null, "ReactRouter"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("li", null, "Asp.net Core RC 2"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("li", null, "Asp.net Web API 2"))));
    };
    return About;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
/* harmony default export */ __webpack_exports__["a"] = About;


/***/ }),

/***/ 330:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__comments_CommentList__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__comments_CommentForm__ = __webpack_require__(727);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pagination_Pagination__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_comments__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react_router__ = __webpack_require__(22);
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};









var mapStateToProps = function (state) {
    return {
        comments: state.commentsInfo.comments,
        getName: function (id) {
            var user = state.usersInfo.users[id];
            if (!user)
                return "";
            return user.FirstName + " " + user.LastName;
        },
        canEdit: function (id) { return state.usersInfo.currentUserId === id; },
        postId: state.forumInfo.titlesInfo.selectedThread,
        page: state.commentsInfo.page,
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take,
        totalPages: state.commentsInfo.totalPages
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        editHandle: function (commentId, _, text, cb) {
            var url = globals.urls.forumcomments;
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_comments__["e" /* editComment */])(url, commentId, text, cb));
        },
        deleteHandle: function (commentId, cb) {
            var url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utilities_utils__["j" /* getForumCommentsDeleteUrl */])(commentId);
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_comments__["f" /* deleteComment */])(url, cb));
        },
        replyHandle: function (postId, text, parentId, cb) {
            var url = globals.urls.forumcomments;
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_comments__["g" /* postComment */])(url, postId, text, parentId, cb));
        },
        loadComments: function (postId, skip, take) {
            var url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utilities_utils__["b" /* getForumCommentsPageUrl */])(postId, skip, take);
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_comments__["c" /* fetchComments */])(url, skip, take));
        },
        postHandle: function (postId, text, cb) {
            var url = globals.urls.forumcomments;
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_comments__["g" /* postComment */])(url, postId, text, null, cb));
        }
    };
};
var ForumCommentsContainer = (function (_super) {
    __extends(ForumCommentsContainer, _super);
    function ForumCommentsContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.deleteComment = _this.deleteComment.bind(_this);
        _this.editComment = _this.editComment.bind(_this);
        _this.replyComment = _this.replyComment.bind(_this);
        _this.postComment = _this.postComment.bind(_this);
        _this.pageHandle = _this.pageHandle.bind(_this);
        return _this;
    }
    ForumCommentsContainer.prototype.componentWillReceiveProps = function (nextProps) {
        var _a = this.props, loadComments = _a.loadComments, postId = _a.postId, take = _a.take;
        var page = nextProps.location.query.page;
        if (!Number(page))
            return;
        var skipPages = page - 1;
        var skipItems = (skipPages * take);
        loadComments(postId, skipItems, take);
    };
    ForumCommentsContainer.prototype.pageHandle = function (to) {
        var _a = this.props, postId = _a.postId, page = _a.page;
        var push = this.props.router.push;
        if (page === to)
            return;
        var url = "/forum/post/" + postId + "/comments?page=" + to;
        push(url);
    };
    ForumCommentsContainer.prototype.deleteComment = function (commentId, postId) {
        var _a = this.props, deleteHandle = _a.deleteHandle, loadComments = _a.loadComments, skip = _a.skip, take = _a.take;
        var cb = function () {
            loadComments(postId, skip, take);
        };
        deleteHandle(commentId, cb);
    };
    ForumCommentsContainer.prototype.editComment = function (commentId, postId, text) {
        var _a = this.props, editHandle = _a.editHandle, loadComments = _a.loadComments, skip = _a.skip, take = _a.take;
        var cb = function () {
            loadComments(postId, skip, take);
        };
        editHandle(commentId, postId, text, cb);
    };
    ForumCommentsContainer.prototype.replyComment = function (postId, text, parentId) {
        var _a = this.props, replyHandle = _a.replyHandle, loadComments = _a.loadComments, skip = _a.skip, take = _a.take;
        var cb = function () {
            loadComments(postId, skip, take);
        };
        replyHandle(postId, text, parentId, cb);
    };
    ForumCommentsContainer.prototype.postComment = function (text) {
        var _a = this.props, loadComments = _a.loadComments, postId = _a.postId, skip = _a.skip, take = _a.take, postHandle = _a.postHandle;
        var cb = function () {
            loadComments(postId, skip, take);
        };
        postHandle(postId, text, cb);
    };
    ForumCommentsContainer.prototype.render = function () {
        var _a = this.props, comments = _a.comments, getName = _a.getName, canEdit = _a.canEdit, totalPages = _a.totalPages, page = _a.page, skip = _a.skip, take = _a.take;
        var id = this.props.params.id;
        var controls = {
            skip: skip,
            take: take,
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        };
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Row"], { className: "forum-comments-list" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h4", { className: "forum-comments-heading" }, "Kommentarer"),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__comments_CommentList__["a" /* CommentList */], __assign({ comments: comments, contextId: Number(id), getName: getName, canEdit: canEdit }, controls)),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__pagination_Pagination__["a" /* Pagination */], { totalPages: totalPages, page: page, pageHandle: this.pageHandle }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Col"], { lg: 12 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("hr", null),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__comments_CommentForm__["a" /* CommentForm */], { postHandle: this.postComment }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null))));
    };
    return ForumCommentsContainer;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var ForumCommentsContainerRedux = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(ForumCommentsContainer);
var ForumComments = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8_react_router__["withRouter"])(ForumCommentsContainerRedux);
/* harmony default export */ __webpack_exports__["a"] = ForumComments;


/***/ }),

/***/ 331:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__forum_ForumTitle__ = __webpack_require__(730);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_forum__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pagination_Pagination__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__forum_ForumForm__ = __webpack_require__(327);
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







var mapStateToProps = function (state) {
    return {
        threads: state.forumInfo.titlesInfo.titles,
        skip: state.forumInfo.titlesInfo.skip,
        take: state.forumInfo.titlesInfo.take,
        page: state.forumInfo.titlesInfo.page,
        totalPages: state.forumInfo.titlesInfo.totalPages,
        getAuthor: function (id) {
            var user = state.usersInfo.users[id];
            return user.FirstName + " " + user.LastName;
        }
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        fetchThreads: function (skip, take) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_forum__["a" /* fetchThreads */])(skip, take));
        },
        postThread: function (cb, post) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_forum__["g" /* postThread */])(post, cb));
        }
    };
};
var ForumListContainer = (function (_super) {
    __extends(ForumListContainer, _super);
    function ForumListContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            newPost: false
        };
        _this.pageHandle = _this.pageHandle.bind(_this);
        _this.close = _this.close.bind(_this);
        return _this;
    }
    ForumListContainer.prototype.componentDidMount = function () {
        document.title = "Inuplan Forum";
    };
    ForumListContainer.prototype.pageHandle = function (to) {
        var _a = this.props, fetchThreads = _a.fetchThreads, page = _a.page, take = _a.take;
        if (page === to)
            return;
        var skipItems = (to - 1) * take;
        fetchThreads(skipItems, take);
    };
    ForumListContainer.prototype.threadViews = function () {
        var _a = this.props, threads = _a.threads, getAuthor = _a.getAuthor;
        return threads.map(function (thread) {
            var id = "thread_" + thread.ID;
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__forum_ForumTitle__["a" /* ForumTitle */], { title: thread, key: id, getAuthor: getAuthor });
        });
    };
    ForumListContainer.prototype.submit = function (post) {
        var _a = this.props, postThread = _a.postThread, fetchThreads = _a.fetchThreads, skip = _a.skip, take = _a.take;
        postThread(function () { return fetchThreads(skip, take); }, post);
    };
    ForumListContainer.prototype.close = function () {
        this.setState({ newPost: false });
    };
    ForumListContainer.prototype.show = function () {
        this.setState({ newPost: true });
    };
    ForumListContainer.prototype.render = function () {
        var _a = this.props, totalPages = _a.totalPages, page = _a.page;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["ButtonGroup"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Button"], { bsStyle: "primary", onClick: this.show.bind(this) }, "Tilf\u00F8j nyt indl\u00E6g")),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 12 },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], { className: "thread-head" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 1 },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("strong", null, "Info")),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 5 },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("strong", null, "Overskrift")),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 2, className: "text-center" },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("strong", null, "Dato")),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 2, className: "text-center" },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("strong", null, "L\u00E6st af")),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 2, className: "text-center" },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("strong", null, "Seneste kommentar"))),
                this.threadViews(),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__pagination_Pagination__["a" /* Pagination */], { totalPages: totalPages, page: page, pageHandle: this.pageHandle, show: true })),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6__forum_ForumForm__["a" /* ForumForm */], { show: this.state.newPost, close: this.close.bind(this), onSubmit: this.submit.bind(this) }));
    };
    return ForumListContainer;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var ForumList = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(ForumListContainer);
/* harmony default export */ __webpack_exports__["a"] = ForumList;


/***/ }),

/***/ 332:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_whatsnew__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__images_ImageUpload__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_images__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__UsedSpace__ = __webpack_require__(326);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__WhatsNew__ = __webpack_require__(729);
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








var mapStateToProps = function (state) {
    var user = state.usersInfo.users[state.usersInfo.currentUserId];
    var name = user ? user.FirstName : "User";
    return {
        name: name,
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        uploadImage: function (username, description, formData, onSuccess) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__actions_images__["h" /* uploadImage */])(username, description, formData, onSuccess, function (r) { console.log(r); }));
        },
        fetchLatestNews: function (skip, take) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_whatsnew__["a" /* fetchLatestNews */])(skip, take));
        }
    };
};
var HomeContainer = (function (_super) {
    __extends(HomeContainer, _super);
    function HomeContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            recommended: true
        };
        _this.upload = _this.upload.bind(_this);
        _this.recommendedView = _this.recommendedView.bind(_this);
        return _this;
    }
    HomeContainer.prototype.componentDidMount = function () {
        document.title = "Forside";
    };
    HomeContainer.prototype.upload = function (username, description, formData) {
        var _a = this.props, uploadImage = _a.uploadImage, fetchLatestNews = _a.fetchLatestNews, skip = _a.skip, take = _a.take;
        var onSuccess = function () {
            fetchLatestNews(skip, take);
        };
        uploadImage(username, description, formData, onSuccess);
    };
    HomeContainer.prototype.recommendedView = function () {
        var _this = this;
        if (!this.state.recommended)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Alert"], { bsStyle: "success", onDismiss: function () { return _this.setState({ recommended: false }); } },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h4", null, "Anbefalinger"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("ul", null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("li", null,
                            "Testet med Google Chrome browser. Derfor er det anbefalet at bruge denne til at f\u00E5 den fulde oplevelse.",
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null))))));
    };
    HomeContainer.prototype.render = function () {
        var name = this.props.name;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Jumbotron"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h1", null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null,
                        "Velkommen ",
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("small", null,
                            name,
                            "!"))),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", { className: "lead" }, "Til Inuplans forum og billed-arkiv side"),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 4 },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Panel"], { header: "Du kan uploade billeder til dit eget galleri her", bsStyle: "primary" },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4__images_ImageUpload__["a" /* ImageUpload */], { username: globals.currentUsername, uploadImage: this.upload }))))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Grid"], { fluid: true },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 2 }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 4 },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7__WhatsNew__["a" /* default */], null)),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lgOffset: 1, lg: 3 },
                        this.recommendedView(),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h3", null, "Personlig upload forbrug"),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("hr", null),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", null, "Herunder kan du se hvor meget plads du har brugt og hvor meget fri plads der er tilbage. G\u00E6lder kun billede filer."),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6__UsedSpace__["a" /* default */], null)))));
    };
    return HomeContainer;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var Home = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(HomeContainer);
/* harmony default export */ __webpack_exports__["a"] = Home;


/***/ }),

/***/ 333:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_comments__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_images__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__comments_CommentList__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pagination_Pagination__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__texteditor_TextEditor__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react_router__ = __webpack_require__(22);
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};










var mapStateToProps = function (state) {
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
            var FirstName = user.FirstName, LastName = user.LastName;
            return FirstName + " " + LastName;
        },
        owner: state.usersInfo.users[state.imagesInfo.ownerId]
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        postHandle: function (imageId, text, cb) {
            var url = globals.urls.imagecomments;
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_comments__["g" /* postComment */])(url, imageId, text, null, cb));
        },
        fetchComments: function (imageId, skip, take) {
            var url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__utilities_utils__["a" /* getImageCommentsPageUrl */])(imageId, skip, take);
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_comments__["c" /* fetchComments */])(url, skip, take));
        },
        editHandle: function (commentId, _, text, cb) {
            var url = globals.urls.imagecomments;
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_comments__["e" /* editComment */])(url, commentId, text, cb));
        },
        deleteHandle: function (commentId, cb) {
            var url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__utilities_utils__["g" /* getImageCommentsDeleteUrl */])(commentId);
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_comments__["f" /* deleteComment */])(url, cb));
        },
        replyHandle: function (imageId, text, parentId, cb) {
            var url = globals.urls.imagecomments;
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_comments__["g" /* postComment */])(url, imageId, text, parentId, cb));
        },
        incrementCount: function (imageId) { return dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_images__["d" /* incrementCommentCount */])(imageId)); },
        decrementCount: function (imageId) { return dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_images__["e" /* decrementCommentCount */])(imageId)); },
        loadComments: function (imageId, skip, take) {
            var url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__utilities_utils__["a" /* getImageCommentsPageUrl */])(imageId, skip, take);
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_comments__["c" /* fetchComments */])(url, skip, take));
        }
    };
};
var CommentsContainer = (function (_super) {
    __extends(CommentsContainer, _super);
    function CommentsContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.pageHandle = _this.pageHandle.bind(_this);
        _this.deleteComment = _this.deleteComment.bind(_this);
        _this.editComment = _this.editComment.bind(_this);
        _this.replyComment = _this.replyComment.bind(_this);
        _this.postComment = _this.postComment.bind(_this);
        return _this;
    }
    CommentsContainer.prototype.componentDidMount = function () {
        var page = this.props.location.query.page;
        this.getComments(page);
    };
    CommentsContainer.prototype.getComments = function (page) {
        if (page === void 0) { page = 1; }
        var _a = this.props, fetchComments = _a.fetchComments, imageId = _a.imageId, take = _a.take;
        if (!Number(page))
            return;
        var skipPages = page - 1;
        var skipItems = (skipPages * take);
        fetchComments(imageId, skipItems, take);
    };
    CommentsContainer.prototype.pageHandle = function (to) {
        var _a = this.props, owner = _a.owner, imageId = _a.imageId, page = _a.page;
        var push = this.props.router.push;
        var username = owner.Username;
        if (page === to)
            return;
        var url = "/" + username + "/gallery/image/" + imageId + "/comments?page=" + to;
        push(url);
        this.getComments(to);
    };
    CommentsContainer.prototype.deleteComment = function (commentId, imageId) {
        var _a = this.props, deleteHandle = _a.deleteHandle, loadComments = _a.loadComments, decrementCount = _a.decrementCount, skip = _a.skip, take = _a.take;
        var cb = function () {
            decrementCount(imageId);
            loadComments(imageId, skip, take);
        };
        deleteHandle(commentId, cb);
    };
    CommentsContainer.prototype.editComment = function (commentId, imageId, text) {
        var _a = this.props, loadComments = _a.loadComments, skip = _a.skip, take = _a.take, editHandle = _a.editHandle;
        var cb = function () { return loadComments(imageId, skip, take); };
        editHandle(commentId, imageId, text, cb);
    };
    CommentsContainer.prototype.replyComment = function (imageId, text, parentId) {
        var _a = this.props, loadComments = _a.loadComments, incrementCount = _a.incrementCount, skip = _a.skip, take = _a.take, replyHandle = _a.replyHandle;
        var cb = function () {
            incrementCount(imageId);
            loadComments(imageId, skip, take);
        };
        replyHandle(imageId, text, parentId, cb);
    };
    CommentsContainer.prototype.postComment = function (e) {
        e.preventDefault();
        var _a = this.props, imageId = _a.imageId, loadComments = _a.loadComments, incrementCount = _a.incrementCount, skip = _a.skip, take = _a.take, postHandle = _a.postHandle;
        var editor = this.refs.editor;
        var cb = function () {
            incrementCount(imageId);
            loadComments(imageId, skip, take);
            editor.setText("");
        };
        var text = editor.getText();
        postHandle(imageId, text, cb);
    };
    CommentsContainer.prototype.render = function () {
        var _a = this.props, canEdit = _a.canEdit, comments = _a.comments, getName = _a.getName, imageId = _a.imageId, page = _a.page, totalPages = _a.totalPages;
        var _b = this.props, skip = _b.skip, take = _b.take;
        var controls = {
            skip: skip,
            take: take,
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        };
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "text-left" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8_react_bootstrap__["Col"], { lgOffset: 1, lg: 11 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__comments_CommentList__["a" /* CommentList */], __assign({ contextId: imageId, comments: comments, getName: getName, canEdit: canEdit }, controls)))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8_react_bootstrap__["Col"], { lgOffset: 1, lg: 10 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__pagination_Pagination__["a" /* Pagination */], { totalPages: totalPages, page: page, pageHandle: this.pageHandle }))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("hr", null),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8_react_bootstrap__["Col"], { lgOffset: 1, lg: 10 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6__texteditor_TextEditor__["a" /* TextEditor */], { markdown: "", placeholder: "Skriv kommentar her...", ref: "editor" }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("button", { onClick: this.postComment, className: "btn btn-primary" }, "Send"))));
    };
    return CommentsContainer;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var CommentsRedux = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(CommentsContainer);
var ImageComments = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9_react_router__["withRouter"])(CommentsRedux);
/* harmony default export */ __webpack_exports__["a"] = ImageComments;


/***/ }),

/***/ 334:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_images__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_comments__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_error__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_router__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_bootstrap__ = __webpack_require__(11);
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







var mapStateToProps = function (state) {
    var ownerId = state.imagesInfo.ownerId;
    var currentId = state.usersInfo.currentUserId;
    var canEdit = (ownerId > 0 && currentId > 0 && ownerId === currentId);
    var getImage = function (id) { return state.imagesInfo.images[id]; };
    var image = function () { return getImage(state.imagesInfo.selectedImageId); };
    var filename = function () { if (image())
        return image().Filename; return ""; };
    var previewUrl = function () { if (image())
        return image().PreviewUrl; return ""; };
    var extension = function () { if (image())
        return image().Extension; return ""; };
    var originalUrl = function () { if (image())
        return image().OriginalUrl; return ""; };
    var uploaded = function () { if (image())
        return image().Uploaded; return new Date(); };
    var description = function () { if (image())
        return image().Description; return ""; };
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
var mapDispatchToProps = function (dispatch) {
    return {
        setSelectedImageId: function (id) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_images__["a" /* setSelectedImg */])(id));
        },
        deselectImage: function () {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_images__["a" /* setSelectedImg */])(undefined));
        },
        setError: function (error) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_error__["a" /* setError */])(error));
        },
        fetchImage: function (id) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_images__["f" /* fetchSingleImage */])(id));
        },
        deleteImage: function (id, username) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_images__["g" /* deleteImage */])(id, username));
        },
        resetComments: function () {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_comments__["a" /* setSkipComments */])(0));
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_comments__["b" /* setTakeComments */])(10));
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_comments__["h" /* setFocusedComment */])(-1));
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_comments__["i" /* receivedComments */])([]));
        }
    };
};
var ModalImage = (function (_super) {
    __extends(ModalImage, _super);
    function ModalImage(props) {
        var _this = _super.call(this, props) || this;
        _this.deleteImageHandler = _this.deleteImageHandler.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.seeAllCommentsView = _this.seeAllCommentsView.bind(_this);
        _this.reload = _this.reload.bind(_this);
        return _this;
    }
    ModalImage.prototype.close = function () {
        var _a = this.props, deselectImage = _a.deselectImage, resetComments = _a.resetComments;
        var username = this.props.params.username;
        var push = this.props.router.push;
        deselectImage();
        var galleryUrl = "/" + username + "/gallery";
        resetComments();
        push(galleryUrl);
    };
    ModalImage.prototype.deleteImageHandler = function () {
        var _a = this.props, deleteImage = _a.deleteImage, setSelectedImageId = _a.setSelectedImageId;
        var _b = this.props.params, id = _b.id, username = _b.username;
        deleteImage(Number(id), username);
        setSelectedImageId(-1);
    };
    ModalImage.prototype.deleteImageView = function () {
        var canEdit = this.props.canEdit;
        if (!canEdit)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Button"], { bsStyle: "danger", onClick: this.deleteImageHandler }, "Slet billede");
    };
    ModalImage.prototype.reload = function () {
        var _a = this.props.params, id = _a.id, username = _a.username;
        var push = this.props.router.push;
        var path = "/" + username + "/gallery/image/" + id + "/comments";
        push(path);
    };
    ModalImage.prototype.seeAllCommentsView = function () {
        var show = !Boolean(this.props.children);
        if (!show)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", { className: "text-center" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Button"], { onClick: this.reload },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Glyphicon"], { glyph: "refresh" }),
                " Se alle kommentarer?"));
    };
    ModalImage.prototype.render = function () {
        var _a = this.props, filename = _a.filename, previewUrl = _a.previewUrl, extension = _a.extension, originalUrl = _a.originalUrl, uploaded = _a.uploaded, hasImage = _a.hasImage, description = _a.description;
        var show = hasImage();
        var name = filename + "." + extension;
        var uploadDate = moment(uploaded);
        var dateString = "Uploaded d. " + uploadDate.format("D MMM YYYY ") + "kl. " + uploadDate.format("H:mm");
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Modal"], { show: show, onHide: this.close, bsSize: "large", animation: true },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Modal"].Header, { closeButton: true },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Modal"].Title, null,
                    name,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("small", null,
                            " - ",
                            dateString)))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Modal"].Body, null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: originalUrl, target: "_blank", rel: "noopener" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Image"], { src: previewUrl, responsive: true, className: "center-block" })),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "image-selected-descriptiontext" }, description)),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Modal"].Footer, null,
                this.seeAllCommentsView(),
                this.props.children,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("hr", null),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["ButtonToolbar"], { style: { float: "right" } },
                    this.deleteImageView(),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6_react_bootstrap__["Button"], { onClick: this.close }, "Luk"))));
    };
    return ModalImage;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var SelectedImageRedux = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(ModalImage);
var SelectedImage = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_react_router__["withRouter"])(SelectedImageRedux);
/* harmony default export */ __webpack_exports__["a"] = SelectedImage;


/***/ }),

/***/ 335:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__comments_Comment__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_comments__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_router__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utilities_utils__ = __webpack_require__(21);
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};







var mapStateToProps = function (state) {
    var _a = state.commentsInfo, comments = _a.comments, focusedComment = _a.focusedComment;
    var users = state.usersInfo.users;
    var _b = state.imagesInfo, ownerId = _b.ownerId, selectedImageId = _b.selectedImageId;
    return {
        getName: function (id) {
            var author = users[id];
            return author.FirstName + " " + author.LastName;
        },
        focusedId: focusedComment,
        focused: comments[0],
        imageId: selectedImageId,
        imageOwner: users[ownerId].Username,
        canEdit: function (id) { return state.usersInfo.currentUserId === id; },
        skip: state.commentsInfo.skip,
        take: state.commentsInfo.take
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        editHandle: function (commentId, _, text, cb) {
            var url = globals.urls.imagecomments;
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_comments__["e" /* editComment */])(url, commentId, text, cb));
        },
        deleteHandle: function (commentId, cb) {
            var url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__utilities_utils__["g" /* getImageCommentsDeleteUrl */])(commentId);
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_comments__["f" /* deleteComment */])(url, cb));
        },
        replyHandle: function (imageId, text, parentId, cb) {
            var url = globals.urls.imagecomments;
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_comments__["g" /* postComment */])(url, imageId, text, parentId, cb));
        },
        focusComment: function (id) { return dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_comments__["d" /* fetchAndFocusSingleComment */])(id)); }
    };
};
var SingleCommentRedux = (function (_super) {
    __extends(SingleCommentRedux, _super);
    function SingleCommentRedux(props) {
        var _this = _super.call(this, props) || this;
        _this.allComments = _this.allComments.bind(_this);
        _this.deleteComment = _this.deleteComment.bind(_this);
        _this.editComment = _this.editComment.bind(_this);
        _this.replyComment = _this.replyComment.bind(_this);
        return _this;
    }
    SingleCommentRedux.prototype.allComments = function () {
        var _a = this.props, imageId = _a.imageId, imageOwner = _a.imageOwner;
        var push = this.props.router.push;
        var path = "/" + imageOwner + "/gallery/image/" + imageId + "/comments";
        push(path);
    };
    SingleCommentRedux.prototype.deleteComment = function (commentId, _) {
        var deleteHandle = this.props.deleteHandle;
        deleteHandle(commentId, this.allComments);
    };
    SingleCommentRedux.prototype.editComment = function (commentId, contextId, text) {
        var _a = this.props, editHandle = _a.editHandle, focusComment = _a.focusComment;
        var cb = function () { return focusComment(commentId); };
        editHandle(commentId, contextId, text, cb);
    };
    SingleCommentRedux.prototype.replyComment = function (contextId, text, parentId) {
        var replyHandle = this.props.replyHandle;
        replyHandle(contextId, text, parentId, this.allComments);
    };
    SingleCommentRedux.prototype.render = function () {
        var focusedId = this.props.focusedId;
        if (focusedId < 0)
            return null;
        var _a = this.props.focused, Text = _a.Text, AuthorID = _a.AuthorID, CommentID = _a.CommentID, PostedOn = _a.PostedOn, Edited = _a.Edited;
        var _b = this.props, canEdit = _b.canEdit, imageId = _b.imageId;
        var _c = this.props, skip = _c.skip, take = _c.take;
        var props = {
            skip: skip,
            take: take,
            deleteComment: this.deleteComment,
            editComment: this.editComment,
            replyComment: this.replyComment
        };
        var name = this.props.getName(AuthorID);
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "text-left" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Well"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__comments_Comment__["a" /* Comment */], __assign({ contextId: imageId, name: name, text: Text, commentId: CommentID, replies: [], canEdit: canEdit, authorId: AuthorID, postedOn: PostedOn, edited: Edited }, props))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", { className: "text-center" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Button"], { onClick: this.allComments },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Glyphicon"], { glyph: "refresh" }),
                        " Se alle kommentarer?"))));
    };
    return SingleCommentRedux;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var SingleCommentConnect = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(SingleCommentRedux);
var SingleImageComment = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_react_router__["withRouter"])(SingleCommentConnect);
/* harmony default export */ __webpack_exports__["a"] = SingleImageComment;


/***/ }),

/***/ 336:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_images__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__images_ImageUpload__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__images_ImageList__ = __webpack_require__(732);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_underscore__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_router__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__breadcrumbs_Breadcrumb__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__UsedSpace__ = __webpack_require__(326);
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











var mapStateToProps = function (state) {
    var ownerId = state.imagesInfo.ownerId;
    var currentId = state.usersInfo.currentUserId;
    var canEdit = (ownerId > 0 && currentId > 0 && ownerId === currentId);
    var user = state.usersInfo.users[ownerId];
    var fullName = user ? user.FirstName + " " + user.LastName : "";
    var images = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_underscore__["values"])(state.imagesInfo.images).reverse();
    return {
        images: images,
        canEdit: canEdit,
        selectedImageIds: state.imagesInfo.selectedImageIds,
        fullName: fullName
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        uploadImage: function (username, description, formData) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_images__["h" /* uploadImage */])(username, description, formData, function () { dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_images__["c" /* fetchUserImages */])(username)); }, function () { }));
        },
        addSelectedImageId: function (id) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_images__["i" /* addSelectedImageId */])(id));
        },
        removeSelectedImageId: function (id) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_images__["j" /* removeSelectedImageId */])(id));
        },
        deleteImages: function (username, ids) {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_images__["k" /* deleteImages */])(username, ids));
        },
        clearSelectedImageIds: function () {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_images__["l" /* clearSelectedImageIds */])());
        }
    };
};
var UserImagesContainer = (function (_super) {
    __extends(UserImagesContainer, _super);
    function UserImagesContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.imageIsSelected = _this.imageIsSelected.bind(_this);
        _this.deleteSelectedImages = _this.deleteSelectedImages.bind(_this);
        _this.clearSelected = _this.clearSelected.bind(_this);
        return _this;
    }
    UserImagesContainer.prototype.componentDidMount = function () {
        var username = this.props.params.username;
        var _a = this.props, router = _a.router, route = _a.route;
        document.title = username + "'s billeder";
        router.setRouteLeaveHook(route, this.clearSelected);
    };
    UserImagesContainer.prototype.clearSelected = function () {
        var clearSelectedImageIds = this.props.clearSelectedImageIds;
        clearSelectedImageIds();
        return true;
    };
    UserImagesContainer.prototype.imageIsSelected = function (checkId) {
        var selectedImageIds = this.props.selectedImageIds;
        var res = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_underscore__["find"])(selectedImageIds, function (id) {
            return id === checkId;
        });
        return res ? true : false;
    };
    UserImagesContainer.prototype.deleteSelectedImages = function () {
        var _a = this.props, selectedImageIds = _a.selectedImageIds, deleteImages = _a.deleteImages;
        var username = this.props.params.username;
        deleteImages(username, selectedImageIds);
        this.clearSelected();
    };
    UserImagesContainer.prototype.uploadView = function () {
        var _a = this.props, canEdit = _a.canEdit, uploadImage = _a.uploadImage, selectedImageIds = _a.selectedImageIds;
        var username = this.props.params.username;
        var hasImages = selectedImageIds.length > 0;
        if (!canEdit)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Col"], { lg: 7 },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__images_ImageUpload__["a" /* ImageUpload */], { uploadImage: uploadImage, username: username },
                    "\u00A0",
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Button"], { bsStyle: "danger", disabled: !hasImages, onClick: this.deleteSelectedImages }, "Slet markeret billeder"))));
    };
    UserImagesContainer.prototype.uploadLimitView = function () {
        var canEdit = this.props.canEdit;
        if (!canEdit)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Col"], { lgOffset: 2, lg: 2 },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_9__UsedSpace__["a" /* default */], null)));
    };
    UserImagesContainer.prototype.render = function () {
        var username = this.props.params.username;
        var _a = this.props, images = _a.images, fullName = _a.fullName, canEdit = _a.canEdit, addSelectedImageId = _a.addSelectedImageId, removeSelectedImageId = _a.removeSelectedImageId;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Col"], { lgOffset: 2, lg: 8 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8__breadcrumbs_Breadcrumb__["a" /* Breadcrumb */], null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8__breadcrumbs_Breadcrumb__["a" /* Breadcrumb */].Item, { href: "/" }, "Forside"),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8__breadcrumbs_Breadcrumb__["a" /* Breadcrumb */].Item, { active: true },
                            username,
                            "'s billeder")))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_react_bootstrap__["Col"], { lgOffset: 2, lg: 8 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h1", null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "text-capitalize" }, fullName),
                        "'s ",
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("small", null, "billede galleri")),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("hr", null),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4__images_ImageList__["a" /* default */], { images: images, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: this.imageIsSelected, username: username }),
                    this.uploadView())),
            this.uploadLimitView(),
            this.props.children);
    };
    return UserImagesContainer;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var UserImagesRedux = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(UserImagesContainer);
var UserImages = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_react_router__["withRouter"])(UserImagesRedux);
/* harmony default export */ __webpack_exports__["a"] = UserImages;


/***/ }),

/***/ 337:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_users__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__users_UserList__ = __webpack_require__(737);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__breadcrumbs_Breadcrumb__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_underscore__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_underscore__);
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







var mapUsersToProps = function (state) {
    return {
        users: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_underscore__["values"])(state.usersInfo.users)
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        getUsers: function () {
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_users__["b" /* fetchUsers */])());
        }
    };
};
var UsersContainer = (function (_super) {
    __extends(UsersContainer, _super);
    function UsersContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UsersContainer.prototype.componentDidMount = function () {
        document.title = "Brugere";
    };
    UsersContainer.prototype.render = function () {
        var users = this.props.users;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"], { lgOffset: 2, lg: 8 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__breadcrumbs_Breadcrumb__["a" /* Breadcrumb */], null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__breadcrumbs_Breadcrumb__["a" /* Breadcrumb */].Item, { href: "/" }, "Forside"),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__breadcrumbs_Breadcrumb__["a" /* Breadcrumb */].Item, { active: true }, "Brugere")))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"], { lgOffset: 2, lg: 8 },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["PageHeader"], null,
                    "Inuplan's ",
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("small", null, "brugere")),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Row"], null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__users_UserList__["a" /* UserList */], { users: users }))));
    };
    return UsersContainer;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var Users = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapUsersToProps, mapDispatchToProps)(UsersContainer);
/* harmony default export */ __webpack_exports__["a"] = Users;


/***/ }),

/***/ 338:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
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


var Forum = (function (_super) {
    __extends(Forum, _super);
    function Forum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Forum.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lgOffset: 2, lg: 8 },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h1", null,
                    "Forum ",
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("small", null, "indl\u00E6g")),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("hr", null),
                this.props.children));
    };
    return Forum;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]));
/* harmony default export */ __webpack_exports__["a"] = Forum;


/***/ }),

/***/ 339:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__containers_Error__ = __webpack_require__(728);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_error__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__wrappers_Links__ = __webpack_require__(742);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__loading_Spinner__ = __webpack_require__(733);
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







var mapStateToProps = function (state) {
    var user = state.usersInfo.users[state.usersInfo.currentUserId];
    var name = user ? user.FirstName : "User";
    return {
        name: name,
        hasError: state.statusInfo.hasError,
        error: state.statusInfo.errorInfo,
        loading: (state.statusInfo.loadStack.size > 0)
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        clearError: function () { return dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_error__["b" /* clearError */])()); }
    };
};
var Shell = (function (_super) {
    __extends(Shell, _super);
    function Shell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Shell.prototype.errorView = function () {
        var _a = this.props, hasError = _a.hasError, clearError = _a.clearError, error = _a.error;
        var title = error.title, message = error.message;
        if (!hasError)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__containers_Error__["a" /* Error */], { title: title, message: message, clearError: clearError });
    };
    Shell.prototype.render = function () {
        var _a = this.props, name = _a.name, loading = _a.loading;
        var employeeUrl = globals.urls.employeeHandbook;
        var c5SearchUrl = globals.urls.c5Search;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Grid"], { fluid: true },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6__loading_Spinner__["a" /* Spinner */], { show: loading }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Navbar"], { fixedTop: true },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Navbar"].Header, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Navbar"].Brand, null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: globals.urls.intranetside, className: "navbar-brand" }, "Inuplan Intranet")),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Navbar"].Toggle, null)),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Navbar"].Collapse, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Nav"], null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__wrappers_Links__["a" /* IndexNavLink */], { to: "/" }, "Forside"),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__wrappers_Links__["b" /* NavLink */], { to: "/forum" }, "Forum"),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__wrappers_Links__["b" /* NavLink */], { to: "/users" }, "Brugere"),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__wrappers_Links__["b" /* NavLink */], { to: "/about" }, "Om")),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Navbar"].Text, { pullRight: true },
                        "Hej, ",
                        name,
                        "!"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Nav"], { pullRight: true },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["NavDropdown"], { eventKey: 5, title: "Links", id: "extern_links" },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["MenuItem"], { href: employeeUrl, eventKey: 5.1 }, "Medarbejder h\u00E5ndbog"),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["MenuItem"], { href: c5SearchUrl, eventKey: 5.2 }, "C5 S\u00F8gning"))))),
            this.errorView(),
            this.props.children);
    };
    return Shell;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var Main = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(Shell);
/* harmony default export */ __webpack_exports__["a"] = Main;


/***/ }),

/***/ 340:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store_store__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_whatsnew__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_forum__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_users__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_images__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_comments__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_es6_promise__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_es6_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_es6_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_es6_object_assign__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_es6_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_es6_object_assign__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return fetchWhatsNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fetchForum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return fetchSinglePost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return selectImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return fetchImages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return loadComments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return fetchComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return fetchPostComments; });









var init = function () {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8_es6_object_assign__["polyfill"])();
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7_es6_promise__["polyfill"])();
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_users__["a" /* fetchCurrentUser */])(globals.currentUsername));
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions_users__["b" /* fetchUsers */])());
    moment.locale("da");
};
var fetchWhatsNew = function () {
    var getLatest = function (skip, take) { return __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__actions_whatsnew__["a" /* fetchLatestNews */])(skip, take)); };
    var _a = __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].getState().whatsNewInfo, skip = _a.skip, take = _a.take;
    getLatest(skip, take);
};
var fetchForum = function (_) {
    var _a = __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].getState().forumInfo.titlesInfo, skip = _a.skip, take = _a.take;
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_forum__["a" /* fetchThreads */])(skip, take));
};
var fetchSinglePost = function (nextState) {
    var id = nextState.params.id;
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_forum__["b" /* fetchPost */])(Number(id)));
};
var selectImage = function (nextState) {
    var imageId = Number(nextState.params.id);
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_images__["a" /* setSelectedImg */])(imageId));
};
var fetchImages = function (nextState) {
    var username = nextState.params.username;
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_images__["b" /* setImageOwner */])(username));
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_images__["c" /* fetchUserImages */])(username));
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__actions_comments__["a" /* setSkipComments */])(undefined));
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__actions_comments__["b" /* setTakeComments */])(undefined));
};
var loadComments = function (nextState) {
    var id = nextState.params.id;
    var page = Number(nextState.location.query.page);
    var _a = __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].getState().commentsInfo, skip = _a.skip, take = _a.take;
    var url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__utilities_utils__["a" /* getImageCommentsPageUrl */])(Number(id), skip, take);
    if (!page) {
        __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__actions_comments__["c" /* fetchComments */])(url, skip, take));
    }
    else {
        var skipPages = page - 1;
        var skipItems = (skipPages * take);
        __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__actions_comments__["c" /* fetchComments */])(url, skipItems, take));
    }
};
var fetchComment = function (nextState) {
    var id = Number(nextState.location.query.id);
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__actions_comments__["d" /* fetchAndFocusSingleComment */])(id));
};
var fetchPostComments = function (nextState) {
    var id = nextState.params.id;
    var _a = __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].getState().commentsInfo, skip = _a.skip, take = _a.take;
    var url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__utilities_utils__["b" /* getForumCommentsPageUrl */])(Number(id), skip, take);
    __WEBPACK_IMPORTED_MODULE_0__store_store__["a" /* default */].dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__actions_comments__["c" /* fetchComments */])(url, skip, take));
};


/***/ }),

/***/ 71:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return startLoading; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return endLoading; });
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
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_0__utilities_utils__["d" /* options */])
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

/***/ 726:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommentDeleted; });
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


var CommentDeleted = (function (_super) {
    __extends(CommentDeleted, _super);
    function CommentDeleted() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommentDeleted.prototype.render = function () {
        var _a = this.props, replies = _a.replies, construct = _a.construct;
        var replyNodes = replies.map(function (reply) { return construct(reply); });
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Media"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Media"].Left, { className: "comment-deleted-left" }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Media"].Body, null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", { className: "text-muted comment-deleted" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Glyphicon"], { glyph: "remove-sign" }),
                        " Kommentar slettet")),
                replyNodes));
    };
    return CommentDeleted;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 727:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__texteditor_TextEditor__ = __webpack_require__(121);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommentForm; });
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


var CommentForm = (function (_super) {
    __extends(CommentForm, _super);
    function CommentForm(props) {
        var _this = _super.call(this, props) || this;
        _this.postComment = _this.postComment.bind(_this);
        return _this;
    }
    CommentForm.prototype.postComment = function (e) {
        e.preventDefault();
        var postHandle = this.props.postHandle;
        var editor = this.refs.editor;
        var text = editor.getText();
        postHandle(text);
        editor.setText("");
    };
    CommentForm.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("form", { onSubmit: this.postComment },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("label", { htmlFor: "remark" }, "Kommentar"),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__texteditor_TextEditor__["a" /* TextEditor */], { placeholder: "Skriv tekst", markdown: "", ref: "editor" }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("button", { type: "submit", className: "btn btn-primary" }, "Send"));
    };
    return CommentForm;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 728:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Error; });
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


var Error = (function (_super) {
    __extends(Error, _super);
    function Error() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Error.prototype.render = function () {
        var _a = this.props, clearError = _a.clearError, title = _a.title, message = _a.message;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lgOffset: 2, lg: 8 },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Alert"], { bsStyle: "danger", onDismiss: clearError },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("strong", null, title),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", null, message))));
    };
    return Error;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 729:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_whatsnew__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__whatsnew_WhatsNewList__ = __webpack_require__(741);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ForumPost__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pagination_Pagination__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_router__ = __webpack_require__(22);
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








var mapStateToProps = function (state) {
    return {
        items: state.whatsNewInfo.items,
        getUser: function (id) { return state.usersInfo.users[id]; },
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take,
        totalPages: state.whatsNewInfo.totalPages,
        page: state.whatsNewInfo.page
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        getLatest: function (skip, take) { return dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__actions_whatsnew__["a" /* fetchLatestNews */])(skip, take)); }
    };
};
var WhatsNewContainer = (function (_super) {
    __extends(WhatsNewContainer, _super);
    function WhatsNewContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            modal: false,
            postPreview: null,
            author: null,
            on: null
        };
        _this.pageHandle = _this.pageHandle.bind(_this);
        _this.previewPost = _this.previewPost.bind(_this);
        _this.closeModal = _this.closeModal.bind(_this);
        _this.modalView = _this.modalView.bind(_this);
        _this.navigateTo = _this.navigateTo.bind(_this);
        return _this;
    }
    WhatsNewContainer.prototype.pageHandle = function (to) {
        var _a = this.props, getLatest = _a.getLatest, page = _a.page, take = _a.take;
        if (page === to)
            return;
        var skipPages = to - 1;
        var skipItems = (skipPages * take);
        getLatest(skipItems, take);
    };
    WhatsNewContainer.prototype.previewPost = function (item) {
        var getUser = this.props.getUser;
        var author = getUser(item.AuthorID);
        this.setState({
            modal: true,
            postPreview: item.Item,
            author: author,
            on: item.On
        });
    };
    WhatsNewContainer.prototype.navigateTo = function (url) {
        var push = this.props.router.push;
        push(url);
    };
    WhatsNewContainer.prototype.closeModal = function () {
        this.setState({
            modal: false,
            postPreview: null,
            author: null,
            on: null
        });
    };
    WhatsNewContainer.prototype.modalView = function () {
        var _this = this;
        if (!Boolean(this.state.postPreview))
            return null;
        var _a = this.state.postPreview, Text = _a.Text, Title = _a.Title, ID = _a.ID;
        var author = this.state.author;
        var name = author.FirstName + " " + author.LastName;
        var link = "forum/post/" + ID + "/comments";
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Modal"], { show: this.state.modal, onHide: this.closeModal, bsSize: "large" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Modal"].Header, { closeButton: true },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Modal"].Title, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4__ForumPost__["b" /* ForumHeader */], { lg: 11, lgOffset: 1, createdOn: this.state.on, title: Title, name: name }))),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Modal"].Body, null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4__ForumPost__["c" /* ForumBody */], { text: Text, lg: 11, lgOffset: 1 })),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Modal"].Footer, null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["ButtonToolbar"], { style: { float: "right" } },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Button"], { bsStyle: "primary", onClick: function () { return _this.navigateTo(link); } }, "Se kommentarer (forum)"),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Button"], { onClick: this.closeModal }, "Luk"))));
    };
    WhatsNewContainer.prototype.render = function () {
        var _a = this.props, items = _a.items, getUser = _a.getUser, totalPages = _a.totalPages, page = _a.page;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Col"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h3", null, "Sidste h\u00E6ndelser"),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("hr", null),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__whatsnew_WhatsNewList__["a" /* WhatsNewList */], { items: items, getUser: getUser, preview: this.previewPost }),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6__pagination_Pagination__["a" /* Pagination */], { totalPages: totalPages, page: page, pageHandle: this.pageHandle }),
                this.modalView()));
    };
    return WhatsNewContainer;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var WhatsNew = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7_react_router__["withRouter"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(WhatsNewContainer));
/* harmony default export */ __webpack_exports__["a"] = WhatsNew;


/***/ }),

/***/ 730:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_router__ = __webpack_require__(22);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForumTitle; });
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




var ForumTitle = (function (_super) {
    __extends(ForumTitle, _super);
    function ForumTitle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForumTitle.prototype.dateView = function (date) {
        var dayMonthYear = moment(date).format("D/MM/YY");
        return "" + dayMonthYear;
    };
    ForumTitle.prototype.modifiedView = function (modifiedOn) {
        if (!modifiedOn)
            return null;
        var modifiedDate = moment(modifiedOn).format("D/MM/YY-H:mm");
        return "" + modifiedDate;
    };
    ForumTitle.prototype.tooltipView = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Tooltip"], { id: "tooltip" }, "Vigtig");
    };
    ForumTitle.prototype.stickyIcon = function (show) {
        if (!show)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", { className: "sticky" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["OverlayTrigger"], { placement: "top", overlay: this.tooltipView() },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Glyphicon"], { glyph: "pushpin" })));
    };
    ForumTitle.prototype.dateModifiedView = function (title) {
        var created = this.dateView(title.CreatedOn);
        var updated = this.modifiedView(title.LastModified);
        if (!updated)
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null, created);
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null,
            created,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
            "(",
            updated,
            ")");
    };
    ForumTitle.prototype.createSummary = function () {
        var title = this.props.title;
        if (!title.LatestComment)
            return "Ingen kommentarer";
        if (title.LatestComment.Deleted)
            return "Kommentar slettet";
        var text = title.LatestComment.Text;
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utilities_utils__["l" /* getWords */])(text, 5);
    };
    ForumTitle.prototype.render = function () {
        var _a = this.props, title = _a.title, getAuthor = _a.getAuthor;
        var name = getAuthor(title.AuthorID);
        var latestComment = this.createSummary();
        var css = title.Sticky ? "thread thread-pinned" : "thread";
        var path = "/forum/post/" + title.ID + "/comments";
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_router__["Link"], { to: path },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Row"], { className: css },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 1, className: "text-center" }, this.stickyIcon(title.Sticky)),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 5 },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h4", null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "text-capitalize" }, title.Title)),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("small", null,
                        "Af: ",
                        name)),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 2, className: "text-left" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", null, this.dateModifiedView(title))),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 2, className: "text-center" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", null, title.ViewedBy.length)),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Col"], { lg: 2, className: "text-center" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", null, latestComment))));
    };
    return ForumTitle;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 731:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Image; });
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};



var Image = (function (_super) {
    __extends(Image, _super);
    function Image(props) {
        var _this = _super.call(this, props) || this;
        _this.checkboxHandler = _this.checkboxHandler.bind(_this);
        return _this;
    }
    Image.prototype.checkboxHandler = function (e) {
        var image = this.props.image;
        var add = e.currentTarget.checked;
        if (add) {
            var addSelectedImageId = this.props.addSelectedImageId;
            addSelectedImageId(image.ImageID);
        }
        else {
            var removeSelectedImageId = this.props.removeSelectedImageId;
            removeSelectedImageId(image.ImageID);
        }
    };
    Image.prototype.commentIcon = function (count) {
        var style = count === 0 ? "col-lg-6 text-muted" : "col-lg-6 text-primary";
        var props = {
            className: style
        };
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", __assign({}, props),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "glyphicon glyphicon-comment", "aria-hidden": "true" }),
            " ",
            count);
    };
    Image.prototype.checkboxView = function () {
        var _a = this.props, canEdit = _a.canEdit, imageIsSelected = _a.imageIsSelected, image = _a.image;
        var checked = imageIsSelected(image.ImageID);
        return (canEdit ?
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Col"], { lg: 6, className: "pull-right text-right" },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("label", null,
                    "Slet ",
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("input", { type: "checkbox", onClick: this.checkboxHandler, checked: checked })))
            : null);
    };
    Image.prototype.render = function () {
        var _a = this.props, image = _a.image, username = _a.username;
        var count = image.CommentCount;
        var url = "/" + username + "/gallery/image/" + image.ImageID + "/comments";
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Link"], { to: url },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Image"], { src: image.PreviewUrl, thumbnail: true })),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Row"], null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Link"], { to: url }, this.commentIcon(count)),
                this.checkboxView()));
    };
    return Image;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 732:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Image__ = __webpack_require__(731);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__ = __webpack_require__(11);
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



var elementsPerRow = 4;
var ImageList = (function (_super) {
    __extends(ImageList, _super);
    function ImageList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageList.prototype.arrangeArray = function (images) {
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
                var row = images.slice(start, end);
                result.push(row);
            }
        }
        return result;
    };
    ImageList.prototype.imagesView = function (images) {
        if (images.length === 0)
            return null;
        var _a = this.props, addSelectedImageId = _a.addSelectedImageId, removeSelectedImageId = _a.removeSelectedImageId, canEdit = _a.canEdit, imageIsSelected = _a.imageIsSelected, username = _a.username;
        var result = this.arrangeArray(images);
        var view = result.map(function (row, i) {
            var imgs = row.map(function (img) {
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Col"], { lg: 3, key: img.ImageID },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__Image__["a" /* Image */], { image: img, canEdit: canEdit, addSelectedImageId: addSelectedImageId, removeSelectedImageId: removeSelectedImageId, imageIsSelected: imageIsSelected, username: username }));
            });
            var rowId = "rowId" + i;
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Row"], { key: rowId }, imgs);
        });
        return view;
    };
    ImageList.prototype.render = function () {
        var images = this.props.images;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Row"], null, this.imagesView(images));
    };
    return ImageList;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
/* harmony default export */ __webpack_exports__["a"] = ImageList;


/***/ }),

/***/ 733:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Spinner; });
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

var Spinner = (function (_super) {
    __extends(Spinner, _super);
    function Spinner(props) {
        return _super.call(this, props) || this;
    }
    Spinner.prototype.render = function () {
        var show = this.props.show;
        if (!show)
            return null;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "dim" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "center" },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "loading cssload-loader" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "cssload-loader-inner" }))));
    };
    return Spinner;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 734:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StyleButton; });
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

var StyleButton = (function (_super) {
    __extends(StyleButton, _super);
    function StyleButton(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = _this.onClick.bind(_this);
        return _this;
    }
    StyleButton.prototype.onClick = function (e) {
        e.preventDefault();
        var _a = this.props, styleType = _a.styleType, style = _a.style, onClick = _a.onClick;
        onClick(styleType, style);
    };
    StyleButton.prototype.render = function () {
        var _a = this.props, label = _a.label, active = _a.active;
        var css = active ? "richEditor-styleButton richEditor-activeButton" : "richEditor-styleButton";
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: css, onClick: this.onClick }, label);
    };
    return StyleButton;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 735:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StyleButton__ = __webpack_require__(734);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToolbarBlock; });
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


var ToolbarBlock = (function (_super) {
    __extends(ToolbarBlock, _super);
    function ToolbarBlock(props) {
        var _this = _super.call(this, props) || this;
        _this.isActiveBlock = _this.isActiveBlock.bind(_this);
        return _this;
    }
    ToolbarBlock.prototype.isActiveBlock = function (style) {
        var currentBlockType = this.props.currentBlockType;
        var active = style === currentBlockType;
        return active;
    };
    ToolbarBlock.prototype.isActiveInline = function (style) {
        var currentInlineType = this.props.currentInlineType;
        var active = currentInlineType.contains(style);
        return active;
    };
    ToolbarBlock.prototype.render = function () {
        var onStyleClick = this.props.onStyleClick;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "richEditor-controls" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__StyleButton__["a" /* StyleButton */], { key: "H1", active: this.isActiveBlock("header-one"), label: "Overskrift 1", onClick: onStyleClick, style: "header-one", styleType: 0 }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__StyleButton__["a" /* StyleButton */], { key: "H2", active: this.isActiveBlock("header-two"), label: "Overskrift 2", onClick: onStyleClick, style: "header-two", styleType: 0 }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__StyleButton__["a" /* StyleButton */], { key: "H3", active: this.isActiveBlock("header-three"), label: "Overskrift 3", onClick: onStyleClick, style: "header-three", styleType: 0 }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__StyleButton__["a" /* StyleButton */], { key: "Normal", active: this.isActiveBlock("unstyled"), label: "Normal", onClick: onStyleClick, style: "unstyled", styleType: 0 }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__StyleButton__["a" /* StyleButton */], { key: "OL", active: this.isActiveBlock("ordered-list-item"), label: "Liste", onClick: onStyleClick, style: "ordered-list-item", styleType: 0 }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__StyleButton__["a" /* StyleButton */], { key: "UL", active: this.isActiveBlock("unordered-list-item"), label: "Punkter", onClick: onStyleClick, style: "unordered-list-item", styleType: 0 }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__StyleButton__["a" /* StyleButton */], { key: "BOLD", active: this.isActiveInline("BOLD"), label: "Fed", onClick: onStyleClick, style: "BOLD", styleType: 1 }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__StyleButton__["a" /* StyleButton */], { key: "ITALIC", active: this.isActiveInline("ITALIC"), label: "Kursiv", onClick: onStyleClick, style: "ITALIC", styleType: 1 }),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__StyleButton__["a" /* StyleButton */], { key: "CODE", active: this.isActiveInline("CODE"), label: "Marker", onClick: onStyleClick, style: "CODE", styleType: 1 }));
    };
    return ToolbarBlock;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 736:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
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



var User = (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    User.prototype.render = function () {
        var _a = this.props, username = _a.username, firstName = _a.firstName, lastName = _a.lastName, email = _a.email;
        var emailLink = "mailto:" + email;
        var gallery = "/" + username + "/gallery";
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Col"], { lg: 3 },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Panel"], { header: firstName + " " + lastName },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](UserItem, { title: "Brugernavn" }, username),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](UserItem, { title: "Email" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: emailLink }, email)),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](UserItem, { title: "Billeder" },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Link"], { to: gallery }, "Billeder"))));
    };
    return User;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));

var UserHeading = (function (_super) {
    __extends(UserHeading, _super);
    function UserHeading() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserHeading.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Col"], { lg: 6 },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("strong", null, this.props.children));
    };
    return UserHeading;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var UserBody = (function (_super) {
    __extends(UserBody, _super);
    function UserBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserBody.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Col"], { lg: 6 }, this.props.children);
    };
    return UserBody;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
var UserItem = (function (_super) {
    __extends(UserItem, _super);
    function UserItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserItem.prototype.render = function () {
        var title = this.props.title;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Row"], null,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](UserHeading, null, title),
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](UserBody, null, this.props.children));
    };
    return UserItem;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));


/***/ }),

/***/ 737:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__User__ = __webpack_require__(736);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserList; });
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



var UserList = (function (_super) {
    __extends(UserList, _super);
    function UserList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserList.prototype.userNodes = function () {
        var users = this.props.users;
        return users.map(function (user) {
            var userId = "userId_" + user.ID;
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__User__["a" /* User */], { username: user.Username, userId: user.ID, firstName: user.FirstName, lastName: user.LastName, email: user.Email, profileUrl: user.ProfileImage, roles: user.Role, key: userId });
        });
    };
    UserList.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Row"], null, this.userNodes());
    };
    return UserList;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 738:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__WhatsNewTooltip__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__comments_CommentProfile__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WhatsNewForumPost; });
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





var WhatsNewForumPost = (function (_super) {
    __extends(WhatsNewForumPost, _super);
    function WhatsNewForumPost(props) {
        var _this = _super.call(this, props) || this;
        _this.showModal = _this.showModal.bind(_this);
        return _this;
    }
    WhatsNewForumPost.prototype.fullname = function () {
        var author = this.props.author;
        return author.FirstName + " " + author.LastName;
    };
    WhatsNewForumPost.prototype.when = function () {
        var on = this.props.on;
        return "indlæg " + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utilities_utils__["h" /* timeText */])(on);
    };
    WhatsNewForumPost.prototype.summary = function () {
        var text = this.props.text;
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utilities_utils__["l" /* getWords */])(text, 5);
    };
    WhatsNewForumPost.prototype.overlay = function () {
        var commentCount = this.props.commentCount;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Tooltip"], { id: "tooltip_post" },
            "Forum indl\u00E6g, antal kommentarer: ",
            commentCount);
    };
    WhatsNewForumPost.prototype.showModal = function (event) {
        event.preventDefault();
        var _a = this.props, preview = _a.preview, index = _a.index;
        preview(index);
    };
    WhatsNewForumPost.prototype.render = function () {
        var title = this.props.title;
        var name = this.fullname();
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__WhatsNewTooltip__["a" /* WhatsNewTooltip */], { tooltip: "Forum indlæg" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Media"].ListItem, { className: "whatsnewItem hover-shadow" },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__comments_CommentProfile__["a" /* CommentProfile */], null),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Media"].Body, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("blockquote", null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", onClick: this.showModal },
                            this.summary(),
                            "..."),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("footer", null,
                            name,
                            " ",
                            this.when(),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Glyphicon"], { glyph: "list-alt" }),
                            " ",
                            title)))));
    };
    return WhatsNewForumPost;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 739:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__comments_CommentProfile__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__WhatsNewTooltip__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_router__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WhatsNewItemComment; });
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






var WhatsNewItemComment = (function (_super) {
    __extends(WhatsNewItemComment, _super);
    function WhatsNewItemComment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WhatsNewItemComment.prototype.createSummary = function () {
        var text = this.props.text;
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utilities_utils__["i" /* formatText */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utilities_utils__["l" /* getWords */])(text, 5) + "...");
    };
    WhatsNewItemComment.prototype.fullname = function () {
        var author = this.props.author;
        return author ? author.FirstName + " " + author.LastName : "User";
    };
    WhatsNewItemComment.prototype.when = function () {
        var on = this.props.on;
        return "sagde " + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utilities_utils__["h" /* timeText */])(on);
    };
    WhatsNewItemComment.prototype.render = function () {
        var _a = this.props, imageId = _a.imageId, uploadedBy = _a.uploadedBy, commentId = _a.commentId, filename = _a.filename;
        var username = uploadedBy.Username;
        var name = this.fullname();
        var summary = this.createSummary();
        var link = username + "/gallery/image/" + imageId + "/comment?id=" + commentId;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__WhatsNewTooltip__["a" /* WhatsNewTooltip */], { tooltip: "Kommentar" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Media"].ListItem, { className: "whatsnewItem hover-shadow" },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__comments_CommentProfile__["a" /* CommentProfile */], null),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Media"].Body, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("blockquote", null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_router__["Link"], { to: link },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("em", null,
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", { dangerouslySetInnerHTML: summary }))),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("footer", null,
                            name,
                            " ",
                            this.when(),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Glyphicon"], { glyph: "comment" }),
                            " ",
                            filename)))));
    };
    return WhatsNewItemComment;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 740:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__comments_CommentProfile__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__WhatsNewTooltip__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_router__ = __webpack_require__(22);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WhatsNewItemImage; });
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







var WhatsNewItemImage = (function (_super) {
    __extends(WhatsNewItemImage, _super);
    function WhatsNewItemImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WhatsNewItemImage.prototype.when = function () {
        var on = this.props.on;
        return "uploadede " + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__utilities_utils__["h" /* timeText */])(on);
    };
    WhatsNewItemImage.prototype.overlay = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Tooltip"], { id: "tooltip_img" }, "Bruger billede");
    };
    WhatsNewItemImage.prototype.render = function () {
        var _a = this.props, imageId = _a.imageId, author = _a.author, filename = _a.filename, extension = _a.extension, thumbnail = _a.thumbnail, description = _a.description;
        var username = author.Username;
        var file = filename + "." + extension;
        var link = username + "/gallery/image/" + imageId;
        var name = author.FirstName + " " + author.LastName;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__WhatsNewTooltip__["a" /* WhatsNewTooltip */], { tooltip: "Uploadet billede" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Media"].ListItem, { className: "whatsnewItem hover-shadow" },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__comments_CommentProfile__["a" /* CommentProfile */], null),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Media"].Body, null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("blockquote", null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "image-whatsnew-descriptiontext" }, description),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_router__["Link"], { to: link },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Image"], { src: thumbnail, thumbnail: true })),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("footer", null,
                            name,
                            " ",
                            this.when(),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("br", null),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Glyphicon"], { glyph: "picture" }),
                            " ",
                            file)))));
    };
    return WhatsNewItemImage;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 741:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__WhatsNewItemImage__ = __webpack_require__(740);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__WhatsNewItemComment__ = __webpack_require__(739);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__WhatsNewForumPost__ = __webpack_require__(738);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WhatsNewList; });
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





var WhatsNewList = (function (_super) {
    __extends(WhatsNewList, _super);
    function WhatsNewList(props) {
        var _this = _super.call(this, props) || this;
        _this.previewPostHandle = _this.previewPostHandle.bind(_this);
        return _this;
    }
    WhatsNewList.prototype.previewPostHandle = function (index) {
        var _a = this.props, items = _a.items, preview = _a.preview;
        var item = items[index];
        preview(item);
    };
    WhatsNewList.prototype.constructItems = function () {
        var _this = this;
        var _a = this.props, items = _a.items, getUser = _a.getUser;
        var generateKey = function (id) { return "whatsnew_" + id; };
        return items.map(function (item, index) {
            var itemKey = generateKey(item.ID);
            var author = getUser(item.AuthorID);
            switch (item.Type) {
                case 1:
                    {
                        var image = item.Item;
                        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__WhatsNewItemImage__["a" /* WhatsNewItemImage */], { on: item.On, imageId: image.ImageID, filename: image.Filename, extension: image.Extension, thumbnail: image.ThumbnailUrl, author: author, description: image.Description, key: itemKey });
                    }
                case 2:
                    {
                        var comment = item.Item;
                        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__WhatsNewItemComment__["a" /* WhatsNewItemComment */], { commentId: comment.ID, text: comment.Text, uploadedBy: comment.ImageUploadedBy, imageId: comment.ImageID, filename: comment.Filename, on: item.On, author: author, key: itemKey });
                    }
                case 4:
                    {
                        var post = item.Item;
                        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__WhatsNewForumPost__["a" /* WhatsNewForumPost */], { on: item.On, author: author, title: post.Title, text: post.Text, sticky: post.Sticky, commentCount: post.CommentCount, preview: _this.previewPostHandle, index: index, key: itemKey });
                    }
                default:
                    {
                        return null;
                    }
            }
        });
    };
    WhatsNewList.prototype.render = function () {
        var itemNodes = this.constructItems();
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Media"].List, null, itemNodes);
    };
    return WhatsNewList;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));



/***/ }),

/***/ 742:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_router__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return NavLink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IndexNavLink; });
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


var NavLink = (function (_super) {
    __extends(NavLink, _super);
    function NavLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavLink.prototype.render = function () {
        var isActive = this.context.router.isActive(this.props.to, true), className = isActive ? "active" : "";
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("li", { className: className },
            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_0_react_router__["Link"], { to: this.props.to }, this.props.children)));
    };
    return NavLink;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));

NavLink.contextTypes = {
    router: __WEBPACK_IMPORTED_MODULE_1_react__["PropTypes"].object
};
var IndexNavLink = (function (_super) {
    __extends(IndexNavLink, _super);
    function IndexNavLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndexNavLink.prototype.render = function () {
        var isActive = this.context.router.isActive(this.props.to, true), className = isActive ? "active" : "";
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("li", { className: className },
            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_0_react_router__["IndexLink"], { to: this.props.to }, this.props.children)));
    };
    return IndexNavLink;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));

IndexNavLink.contextTypes = {
    router: __WEBPACK_IMPORTED_MODULE_1_react__["PropTypes"].object
};


/***/ }),

/***/ 743:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(42);

var comments = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 43:
            return action.payload || [];
        case 44:
            return state.concat([action.payload[0]]);
        default:
            return state;
    }
};
var skip = function (state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case 36:
            return action.payload || 0;
        default:
            return state;
    }
};
var take = function (state, action) {
    if (state === void 0) { state = 10; }
    switch (action.type) {
        case 39:
            return action.payload || 10;
        default:
            return state;
    }
};
var page = function (state, action) {
    if (state === void 0) { state = 1; }
    switch (action.type) {
        case 40:
            return action.payload || 1;
        default:
            return state;
    }
};
var totalPages = function (state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case 41:
            return action.payload || 0;
        default:
            return state;
    }
};
var focusedComment = function (state, action) {
    if (state === void 0) { state = -1; }
    switch (action.type) {
        case 45:
            return action.payload || -1;
        default:
            return state;
    }
};
var commentsInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    comments: comments,
    skip: skip,
    take: take,
    page: page,
    totalPages: totalPages,
    focusedComment: focusedComment
});
/* harmony default export */ __webpack_exports__["a"] = commentsInfo;


/***/ }),

/***/ 744:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(42);
/* unused harmony export title */
/* unused harmony export message */

var title = function (state, action) {
    if (state === void 0) { state = ""; }
    switch (action.type) {
        case 1:
            return action.payload || "";
        default:
            return state;
    }
};
var message = function (state, action) {
    if (state === void 0) { state = ""; }
    switch (action.type) {
        case 3:
            return action.payload || "";
        default:
            return state;
    }
};
var errorInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    title: title,
    message: message
});
/* harmony default export */ __webpack_exports__["a"] = errorInfo;


/***/ }),

/***/ 745:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_utils__ = __webpack_require__(21);


var skipThreads = function (state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case 28:
            return action.payload;
        default:
            return state;
    }
};
var takeThreads = function (state, action) {
    if (state === void 0) { state = 10; }
    switch (action.type) {
        case 29:
            return action.payload;
        default:
            return state;
    }
};
var pageThreads = function (state, action) {
    if (state === void 0) { state = 1; }
    switch (action.type) {
        case 27:
            return action.payload;
        default:
            return state;
    }
};
var totalPagesThread = function (state, action) {
    if (state === void 0) { state = 1; }
    switch (action.type) {
        case 26:
            return action.payload;
        default:
            return state;
    }
};
var selectedThread = function (state, action) {
    if (state === void 0) { state = -1; }
    switch (action.type) {
        case 30:
            return action.payload;
        default:
            return state;
    }
};
var titles = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 24:
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["m" /* union */])(action.payload, state, function (t1, t2) { return t1.ID === t2.ID; });
        case 25:
            return action.payload;
        default:
            return state;
    }
};
var postContent = function (state, action) {
    if (state === void 0) { state = ""; }
    switch (action.type) {
        case 31:
            return action.payload;
        default:
            return state;
    }
};
var titlesInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    titles: titles,
    skip: skipThreads,
    take: takeThreads,
    page: pageThreads,
    totalPages: totalPagesThread,
    selectedThread: selectedThread
});
var forumInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    titlesInfo: titlesInfo,
    postContent: postContent
});
/* harmony default export */ __webpack_exports__["a"] = forumInfo;


/***/ }),

/***/ 746:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_underscore__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_underscore__);



var ownerId = function (state, action) {
    if (state === void 0) { state = -1; }
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
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case 13:
            {
                var image = action.payload;
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["n" /* put */])(state, image.ImageID, image);
            }
        case 11:
            {
                return action.payload;
            }
        case 14:
            {
                var id = action.payload.ImageID;
                var removed = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_underscore__["omit"])(state, id.toString());
                return removed;
            }
        case 18:
            {
                var id = action.payload.ImageID;
                var image = state[id];
                image.CommentCount++;
                var result = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["n" /* put */])(state, id, image);
                return result;
            }
        case 19:
            {
                var id = action.payload.ImageID;
                var image = state[id];
                image.CommentCount--;
                var result = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["n" /* put */])(state, id, image);
                return result;
            }
        default:
            {
                return state;
            }
    }
};
var selectedImageId = function (state, action) {
    if (state === void 0) { state = -1; }
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
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 15:
            {
                var id = action.payload;
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["m" /* union */])(state, [id], function (id1, id2) { return id1 === id2; });
            }
        case 16:
            {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_underscore__["filter"])(state, function (id) { return id !== action.payload; });
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
var imagesInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    ownerId: ownerId,
    images: images,
    selectedImageId: selectedImageId,
    selectedImageIds: selectedImageIds
});
/* harmony default export */ __webpack_exports__["a"] = imagesInfo;


/***/ }),

/***/ 747:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__usersInfo__ = __webpack_require__(749);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__imagesInfo__ = __webpack_require__(746);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__commentsInfo__ = __webpack_require__(743);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__forumInfo__ = __webpack_require__(745);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__statusInfo__ = __webpack_require__(748);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__whatsNewInfo__ = __webpack_require__(750);







var rootReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    usersInfo: __WEBPACK_IMPORTED_MODULE_1__usersInfo__["a" /* default */],
    imagesInfo: __WEBPACK_IMPORTED_MODULE_2__imagesInfo__["a" /* default */],
    commentsInfo: __WEBPACK_IMPORTED_MODULE_3__commentsInfo__["a" /* default */],
    forumInfo: __WEBPACK_IMPORTED_MODULE_4__forumInfo__["a" /* default */],
    statusInfo: __WEBPACK_IMPORTED_MODULE_5__statusInfo__["a" /* default */],
    whatsNewInfo: __WEBPACK_IMPORTED_MODULE_6__whatsNewInfo__["a" /* default */]
});
/* harmony default export */ __webpack_exports__["a"] = rootReducer;


/***/ }),

/***/ 748:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__errorInfo__ = __webpack_require__(744);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_immutable__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_immutable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_immutable__);
/* unused harmony export hasError */
/* unused harmony export message */
/* unused harmony export loadStack */
/* unused harmony export usedSpacekB */
/* unused harmony export totalSpacekB */
/* unused harmony export spaceInfo */



var hasError = function (state, action) {
    if (state === void 0) { state = false; }
    switch (action.type) {
        case 0:
            return action.payload;
        default:
            return state;
    }
};
var message = function (state, action) {
    if (state === void 0) { state = ""; }
    switch (action.type) {
        default:
            return state;
    }
};
var loadStack = function (state, action) {
    if (state === void 0) { state = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_immutable__["Stack"])(); }
    switch (action.type) {
        case 34: {
            var result = state.push(true);
            return result;
        }
        case 35: {
            var result = state.pop();
            return result;
        }
        default:
            return state;
    }
};
var usedSpacekB = function (state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case 32:
            return action.payload;
        default:
            return state;
    }
};
var totalSpacekB = function (state, action) {
    if (state === void 0) { state = -1; }
    switch (action.type) {
        case 33:
            return action.payload;
        default:
            return state;
    }
};
var spaceInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    usedSpacekB: usedSpacekB,
    totalSpacekB: totalSpacekB
});
var statusInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    hasError: hasError,
    errorInfo: __WEBPACK_IMPORTED_MODULE_1__errorInfo__["a" /* default */],
    spaceInfo: spaceInfo,
    message: message,
    loadStack: loadStack
});
/* harmony default export */ __webpack_exports__["a"] = statusInfo;


/***/ }),

/***/ 749:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(42);

var users = function (state, action) {
    if (state === void 0) { state = {}; }
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

/***/ 750:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(42);

var skip = function (state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case 6:
            return action.payload || 0;
        default:
            return state;
    }
};
var take = function (state, action) {
    if (state === void 0) { state = 10; }
    switch (action.type) {
        case 7:
            return action.payload || 10;
        default:
            return state;
    }
};
var page = function (state, action) {
    if (state === void 0) { state = 1; }
    switch (action.type) {
        case 8:
            return action.payload || 1;
        default:
            return state;
    }
};
var totalPages = function (state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case 9:
            return action.payload || 0;
        default:
            return state;
    }
};
var items = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 5:
            return action.payload || [];
        default:
            return state;
    }
};
var whatsNewInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
    skip: skip,
    take: take,
    page: page,
    totalPages: totalPages,
    items: items
});
/* harmony default export */ __webpack_exports__["a"] = whatsNewInfo;


/***/ }),

/***/ 753:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_shells_Main__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_containers_Home__ = __webpack_require__(332);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_shells_Forum__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_containers_ForumList__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_containers_ForumPost__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_containers_ForumComments__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_containers_Users__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_containers_UserImages__ = __webpack_require__(336);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_containers_SelectedImage__ = __webpack_require__(334);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_containers_ImageComments__ = __webpack_require__(333);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_containers_SingleImageComment__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_containers_About__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__store_store__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__ = __webpack_require__(340);
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


















__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__["a" /* init */])();
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_redux__["Provider"], { store: __WEBPACK_IMPORTED_MODULE_16__store_store__["a" /* default */] },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Router"], { history: __WEBPACK_IMPORTED_MODULE_2_react_router__["browserHistory"] },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "/", component: __WEBPACK_IMPORTED_MODULE_4__components_shells_Main__["a" /* default */] },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["IndexRoute"], { component: __WEBPACK_IMPORTED_MODULE_5__components_containers_Home__["a" /* default */], onEnter: __WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__["b" /* fetchWhatsNew */] }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "forum", component: __WEBPACK_IMPORTED_MODULE_6__components_shells_Forum__["a" /* default */] },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["IndexRoute"], { component: __WEBPACK_IMPORTED_MODULE_7__components_containers_ForumList__["a" /* default */], onEnter: __WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__["c" /* fetchForum */] }),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "post/:id", component: __WEBPACK_IMPORTED_MODULE_8__components_containers_ForumPost__["a" /* default */], onEnter: __WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__["d" /* fetchSinglePost */] },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "comments", component: __WEBPACK_IMPORTED_MODULE_9__components_containers_ForumComments__["a" /* default */], onEnter: __WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__["e" /* fetchPostComments */] }))),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "users", component: __WEBPACK_IMPORTED_MODULE_10__components_containers_Users__["a" /* default */] }),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: ":username/gallery", component: __WEBPACK_IMPORTED_MODULE_11__components_containers_UserImages__["a" /* default */], onEnter: __WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__["f" /* fetchImages */] },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "image/:id", component: __WEBPACK_IMPORTED_MODULE_12__components_containers_SelectedImage__["a" /* default */], onEnter: __WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__["g" /* selectImage */] },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "comments", component: __WEBPACK_IMPORTED_MODULE_13__components_containers_ImageComments__["a" /* default */], onEnter: __WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__["h" /* loadComments */] }),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "comment", component: __WEBPACK_IMPORTED_MODULE_14__components_containers_SingleImageComment__["a" /* default */], onEnter: __WEBPACK_IMPORTED_MODULE_17__utilities_onstartup__["i" /* fetchComment */] }))),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_router__["Route"], { path: "about", component: __WEBPACK_IMPORTED_MODULE_15__components_containers_About__["a" /* default */] }))));
    };
    return App;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]));
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_dom__["render"])(__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](App, null), document.getElementById("content"));


/***/ }),

/***/ 92:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_utils__ = __webpack_require__(21);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return setSkipComments; });
/* unused harmony export setDefaultSkip */
/* unused harmony export setDefaultTake */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return setTakeComments; });
/* unused harmony export setCurrentPage */
/* unused harmony export setTotalPages */
/* unused harmony export setDefaultComments */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return receivedComments; });
/* unused harmony export addComment */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return setFocusedComment; });
/* unused harmony export newCommentFromServer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fetchComments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return postComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return editComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return deleteComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return fetchAndFocusSingleComment; });


var setSkipComments = function (skip) {
    return {
        type: 36,
        payload: skip
    };
};
var setDefaultSkip = function () {
    return {
        type: 37
    };
};
var setDefaultTake = function () {
    return {
        type: 38
    };
};
var setTakeComments = function (take) {
    return {
        type: 39,
        payload: take
    };
};
var setCurrentPage = function (page) {
    return {
        type: 40,
        payload: page
    };
};
var setTotalPages = function (totalPages) {
    return {
        type: 41,
        payload: totalPages
    };
};
var setDefaultComments = function () {
    return {
        type: 42
    };
};
var receivedComments = function (comments) {
    return {
        type: 43,
        payload: comments
    };
};
var addComment = function (comment) {
    return {
        type: 44,
        payload: [comment]
    };
};
var setFocusedComment = function (commentId) {
    return {
        type: 45,
        payload: commentId
    };
};
var newCommentFromServer = function (comment) {
    var normalize = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["e" /* normalizeComment */])(comment);
    return addComment(normalize);
};
var fetchComments = function (url, skip, take) {
    return function (dispatch) {
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (data) {
            var pageComments = data.CurrentItems;
            dispatch(setSkipComments(skip));
            dispatch(setTakeComments(take));
            dispatch(setCurrentPage(data.CurrentPage));
            dispatch(setTotalPages(data.TotalPages));
            var comments = pageComments.map(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["e" /* normalizeComment */]);
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
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */], {
            method: "POST",
            body: body,
            headers: headers
        });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
            .then(cb);
    };
};
var editComment = function (url, commentId, text, cb) {
    return function (_) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */], {
            method: "PUT",
            body: JSON.stringify({ ID: commentId, Text: text }),
            headers: headers
        });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
            .then(cb);
    };
};
var deleteComment = function (url, cb) {
    return function (_) {
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */], {
            method: "DELETE"
        });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
            .then(cb);
    };
};
var fetchAndFocusSingleComment = function (id) {
    return function (dispatch) {
        var url = globals.urls.imagecomments + "/GetSingle?id=" + id;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_1__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (c) {
            var comment = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utilities_utils__["e" /* normalizeComment */])(c);
            dispatch(receivedComments([comment]));
            dispatch(setFocusedComment(comment.CommentID));
        });
    };
};


/***/ }),

/***/ 93:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__users__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utilities_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utilities_normalize__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_status__ = __webpack_require__(71);
/* unused harmony export setImagesOwner */
/* unused harmony export recievedUserImages */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return setSelectedImg; });
/* unused harmony export addImage */
/* unused harmony export removeImage */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return addSelectedImageId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return removeSelectedImageId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return clearSelectedImageIds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return incrementCommentCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return decrementCommentCount; });
/* unused harmony export newImageFromServer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return deleteImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return uploadImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fetchUserImages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return deleteImages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return setImageOwner; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return fetchSingleImage; });





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
        type: 17
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
var newImageFromServer = function (image) {
    var normalized = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utilities_normalize__["a" /* normalizeImage */])(image);
    return addImage(normalized);
};
var deleteImage = function (id, username) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_status__["b" /* startLoading */])());
        var url = globals.urls.images + "?username=" + username + "&id=" + id;
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_2__utilities_utils__["d" /* options */], {
            method: "DELETE"
        });
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        var result = __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
            .then(handler)
            .then(function () { dispatch(removeImage(id)); })["catch"](function (reason) { return console.log(reason); });
        return result;
    };
};
var uploadImage = function (username, description, formData, onSuccess, onError) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_status__["b" /* startLoading */])());
        var url = globals.urls.images + "?username=" + username + "&description=" + description;
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_2__utilities_utils__["d" /* options */], {
            method: "POST",
            body: formData
        });
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utilities_utils__["c" /* responseHandler */])(dispatch)(function (_) { return null; });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
            .then(handler)
            .then(onSuccess, onError);
    };
};
var fetchUserImages = function (username) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_status__["b" /* startLoading */])());
        var url = globals.urls.images + "?username=" + username;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_2__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (data) {
            var normalized = data.map(__WEBPACK_IMPORTED_MODULE_3__utilities_normalize__["a" /* normalizeImage */]);
            var obj = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utilities_utils__["f" /* objMap */])(normalized, function (img) { return img.ImageID; }, function (img) { return img; });
            dispatch(recievedUserImages(obj));
        });
    };
};
var deleteImages = function (username, imageIds) {
    if (imageIds === void 0) { imageIds = []; }
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_status__["b" /* startLoading */])());
        var ids = imageIds.join(",");
        var url = globals.urls.images + "?username=" + username + "&ids=" + ids;
        var opt = Object.assign({}, __WEBPACK_IMPORTED_MODULE_2__utilities_utils__["d" /* options */], {
            method: "DELETE"
        });
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utilities_utils__["c" /* responseHandler */])(dispatch)(function (_) { return null; });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, opt)
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
                if (user.Username === username) {
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
            dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_status__["b" /* startLoading */])());
            var url = globals.urls.users + "?username=" + username;
            var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
            return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_2__utilities_utils__["d" /* options */])
                .then(handler)
                .then(function (user) { dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__users__["c" /* addUser */])(user)); })
                .then(function () {
                owner = findOwner();
                dispatch(setImagesOwner(owner.ID));
            });
        }
    };
};
var fetchSingleImage = function (id) {
    return function (dispatch) {
        dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__actions_status__["b" /* startLoading */])());
        var url = globals.urls.images + "/getbyid?id=" + id;
        var handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utilities_utils__["c" /* responseHandler */])(dispatch)(function (r) { return r.json(); });
        return __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__(url, __WEBPACK_IMPORTED_MODULE_2__utilities_utils__["d" /* options */])
            .then(handler)
            .then(function (img) {
            if (!img)
                return;
            var normalizedImage = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utilities_normalize__["a" /* normalizeImage */])(img);
            dispatch(addImage(normalizedImage));
        });
    };
};


/***/ })

},[753]);
//# sourceMappingURL=app.js.map