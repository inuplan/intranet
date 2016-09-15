import * as T from '../constants/types'
import fetch from 'isomorphic-fetch';
import { options } from '../constants/constants'
import { normalizeComment, visitComments, responseHandler, onReject } from '../utilities/utils'
import { addUser } from './users'
import { HttpError, setError } from './error'
import { find } from 'underscore'

export const setSkipComments = (skip) => {
    return {
        type: T.SET_SKIP_COMMENTS,
        skip: skip
    };
}

export const setDefaultSkip = () => {
    return {
        type: T.SET_DEFAULT_SKIP
    }
}

export const setDefaultTake = () => {
    return {
        type: T.SET_DEFAULT_TAKE
    }
}

export const setTakeComments = (take) => {
    return {
        type: T.SET_TAKE_COMMENTS,
        take: take
    };
}

export function setCurrentPage(page) {
    return {
        type: T.SET_CURRENT_PAGE,
        page: page
    };
}

export function setTotalPages(totalPages) {
    return {
        type: T.SET_TOTAL_PAGES,
        totalPages: totalPages
    };
}

export const setDefaultComments = () => {
    return {
        type: T.SET_DEFAULT_COMMENTS
    }
}

export function receivedComments(comments) {
    return {
        type: T.RECIEVED_COMMENTS,
        comments: comments
    };
}

export function addComment(comment) {
    return {
        type: T.ADD_COMMENT,
        comment: comment
    }
}

export function setFocusedComment(commentId) {
    return {
        type: T.SET_FOCUSED_COMMENT,
        id: commentId
    }
}

export function fetchComments(imageId, skip, take) {
    return function(dispatch, getState) {
        const url = globals.urls.comments + "?imageId=" + imageId + "&skip=" + skip + "&take=" + take;
        const handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(data => {
                // Unprocessed comments
                const pageComments = data.CurrentItems;

                // Set (re-set) info
                //dispatch(receivedComments(undefined));
                dispatch(setSkipComments(skip));
                dispatch(setTakeComments(take));
                dispatch(setCurrentPage(data.CurrentPage));
                dispatch(setTotalPages(data.TotalPages));

                // normalize
                const comments = pageComments.map(normalizeComment);
                dispatch(receivedComments(comments));
            }, onReject);
    }
}

export const postComment = (imageId, text, parentCommentId) => {
    return function (dispatch, getState) {
        const { skip, take } = getState().commentsInfo;
        const url = globals.urls.comments;

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const body =JSON.stringify({ 
            Text: text,
            ContextID: imageId,
            ParentID: parentCommentId
        });

        const opt = Object.assign({}, options, {
            method: 'POST',
            body: body,
            headers: headers
        });

        return fetch(url, opt)
            .then(() => {
                dispatch(incrementCommentCount(imageId));
                dispatch(fetchComments(imageId, skip, take));
            }, onReject);
    }
}

export const editComment = (commentId, imageId, text) => {
    return function(dispatch, getState) {
        const { skip, take } = getState().commentsInfo;
        const url = globals.urls.comments + "?imageId=" + imageId;

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const opt = Object.assign({}, options, {
            method: 'PUT',
            body: JSON.stringify({ ID: commentId, Text: text}),
            headers: headers
        });

        return fetch(url, opt)
            .then(() => {
                dispatch(fetchComments(imageId, skip, take));
            }, onReject);
    }
}

export const deleteComment = (commentId, imageId) => {
    return function(dispatch, getState) {
        const { skip, take } = getState().commentsInfo;
        const url = globals.urls.comments + "?commentId=" + commentId;
        const opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        return fetch(url, opt)
            .then(() => {
                dispatch(fetchComments(imageId, skip, take));
                dispatch(decrementCommentCount(imageId));
            }, onReject);
    }
}

export const incrementCommentCount = (imageId) => {
    return {
        type: T.INCR_COMMENT_COUNT,
        key: imageId
    }
}

export const decrementCommentCount = (imageId) => {
    return {
        type: T.DECR_COMMENT_COUNT,
        key: imageId
    }
}

export const fetchAndFocusSingleComment = (id) => {
    return (dispatch, getState) => {
        const { comments } = globals.urls;
        const url = `${comments}/GetSingle?id=${id}`;
        const handler = responseHandler.bind(this, dispatch);

        return fetch(url, options)
            .then(handler)
            .then(c => {
                const comment = normalizeComment(c);
                dispatch(receivedComments([comment]));
                dispatch(setFocusedComment(comment.CommentID));
            }, onReject);
    }
}