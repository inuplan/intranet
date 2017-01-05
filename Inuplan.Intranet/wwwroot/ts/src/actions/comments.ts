import { ActionType } from "../constants/actions";
import * as fetch from "isomorphic-fetch";
import { options, normalizeComment, responseHandler } from "../utilities/utils";
import { General } from "../interfaces/General";
import { Action as ReduxAction } from "redux";
import { Data } from "../interfaces/Data";
import { fetchResult } from "../constants/types";
import { Dispatch } from "react-redux";

type Action<T> = General.Action<T>;

export const setSkipComments = (skip: number): Action<number> => {
    return {
        type: ActionType.SET_SKIP_COMMENTS,
        payload: skip
    };
};

export const setDefaultSkip = (): ReduxAction => {
    return {
        type: ActionType.SET_DEFAULT_SKIP
    };
};

export const setDefaultTake = (): ReduxAction => {
    return {
        type: ActionType.SET_DEFAULT_TAKE
    };
};

export const setTakeComments = (take: number): Action<number> => {
    return {
        type: ActionType.SET_TAKE_COMMENTS,
        payload: take
    };
};

export const setCurrentPage = (page: number): Action<number> => {
    return {
        type: ActionType.SET_CURRENT_PAGE,
        payload: page
    };
};

export const setTotalPages = (totalPages: number): Action<number> => {
    return {
        type: ActionType.SET_TOTAL_PAGES,
        payload: totalPages
    };
};

export const setDefaultComments = (): ReduxAction => {
    return {
        type: ActionType.SET_DEFAULT_COMMENTS
    };
};

export const receivedComments = (comments: Data.Comment[]): Action<Data.Comment[]> => {
    return {
        type: ActionType.RECIEVED_COMMENTS,
        payload: comments
    };
};

export const addComment = (comment: Data.Comment): Action<Data.Comment[]> => {
    return {
        type: ActionType.ADD_COMMENT,
        payload: [comment]
    };
};

export const setFocusedComment = (commentId: number): Action<number> => {
    return {
        type: ActionType.SET_FOCUSED_COMMENT,
        payload: commentId
    };
};

export const newCommentFromServer = (comment: Data.Raw.Comment): Action<Data.Comment[]> => {
    const normalize = normalizeComment(comment);
    return addComment(normalize);
};

export const fetchComments = (url: string, skip: number, take: number): fetchResult<any, void> => {
    return (dispatch: Dispatch<any>) => {
        const handler = responseHandler<Data.Raw.Pagination<Data.Raw.Comment>>(dispatch)(r => r.json());
        return fetch(url, options)
            .then(handler)
            .then(data => {
                // Unprocessed comments
                const pageComments = data.CurrentItems;

                // Set (re-set) info
                dispatch(setSkipComments(skip));
                dispatch(setTakeComments(take));
                dispatch(setCurrentPage(data.CurrentPage));
                dispatch(setTotalPages(data.TotalPages));

                // normalize
                const comments = pageComments.map(normalizeComment);
                dispatch(receivedComments(comments));
            });
    };
};

export const postComment = (url: string, contextId: number, text: string, parentCommentId: number, cb: () => void) => {
    return (_: Dispatch<any>) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const body = JSON.stringify({
            Text: text,
            ContextID: contextId,
            ParentID: parentCommentId
        });

        const opt = <RequestInit>Object.assign({}, options, {
            method: "POST",
            body: body,
            headers: headers
        });

        return fetch(url, opt)
            .then(cb);
    };
};

export const editComment = (url: string, commentId: number, text: string, cb: () => void): fetchResult<any, void> => {
    return (_) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const opt = <RequestInit>Object.assign({}, options, {
            method: "PUT",
            body: JSON.stringify({ ID: commentId, Text: text }),
            headers: headers
        });

        return fetch(url, opt)
            .then(cb);
    };
};

export const deleteComment = (url: string, cb: () => void): fetchResult<any, void> => {
    return (_) => {
        const opt = Object.assign({}, options, {
            method: "DELETE"
        });

        return fetch(url, opt)
            .then(cb);
    };
};

export const fetchAndFocusSingleComment = (id: number): fetchResult<any, void> => {
    return (dispatch) => {
        const url = `${globals.urls.imagecomments}/GetSingle?id=${id}`;
        const handler = responseHandler<Data.Raw.Comment>(dispatch)(r => r.json());

        return fetch(url, options)
            .then(handler)
            .then(c => {
                const comment = normalizeComment(c);
                dispatch(receivedComments([comment]));
                dispatch(setFocusedComment(comment.CommentID));
            });
    };
};