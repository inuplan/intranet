/// <reference path="../../../../node_modules/@types/isomorphic-fetch/index.d.ts" />
import { ActionType as T } from '../constants/actions'
import * as fetch from 'isomorphic-fetch';
import { options, responseHandler } from '../utilities/utils'
import { globals, General } from '../interfaces/General'
import { Data } from '../interfaces/Data'
import { normalizeThreadTitle } from '../utilities/normalize'
import { fetchResult } from '../constants/types'

type Pagination<T> = Data.Raw.Pagination<T>
type ThreadPostTitleDTO = Data.Raw.ThreadPostTitleDTO

export const addThreadTitle = (title: Data.ForumTitle): General.Action<Data.ForumTitle[]> => {
    return {
        type: T.ADD_THREAD_TITLE,
        payload: [title]
    }
}

export const setThreadTitles = (titles: Data.ForumTitle[]): General.Action<Data.ForumTitle[]> => {
    return {
        type: T.SET_THREAD_TITLES,
        payload: titles
    }
}

export const setTotalPages = (totalPages: number): General.Action<number> => {
    return {
        type: T.SET_TOTAL_PAGES_THREADS,
        payload: totalPages
    }
}

export const setPage = (page: number): General.Action<number> => {
    return {
        type: T.SET_PAGE_THREADS,
        payload: page
    }
}

export const setSkip = (skip: number): General.Action<number> => {
    return {
        type: T.SET_SKIP_THREADS,
        payload: skip
    }
}

export const setTake = (take: number): General.Action<number> => {
    return {
        type: T.SET_TAKE_THREADS,
        payload: take
    }
}

export const setSelectedThread = (id: number): General.Action<number> => {
    return {
        type: T.SET_SELECTEDTHREAD_ID,
        payload: id
    }
}

export const setPostContent = (content: string): General.Action<string> => {
    return {
        type: T.SET_POST_CONTENT,
        payload: content
    }
}

export const markPost = (postId: number, read: boolean, cb: () => void): fetchResult<any, void> => {
    return (dispatch) => {
        const url = `${globals.urls.forumpost}?postId=${postId}&read=${read}`;
        const opt = <RequestInit> Object.assign({}, options, {
            method: 'PUT'
        });
        const handler = responseHandler(dispatch)(_ => null);
        return fetch(url, opt)
            .then(handler)
            .then(cb);
    }
}

export const fetchThreads = (skip = 0, take = 10): fetchResult<any, void> => {
    return (dispatch) => {
        const forum = globals.urls.forumtitle;
        const url = `${forum}?skip=${skip}&take=${take}`;
        const handler = responseHandler<Pagination<ThreadPostTitleDTO>>(dispatch)(r => r.json())
        return fetch(url, options)
            .then(handler)
            .then(data => {
                // Unprocessed forum titles
                const pageForumTitles = data.CurrentItems;
                const forumTitles = pageForumTitles.map(normalizeThreadTitle);

                // Set info
                dispatch(setSkip(skip));
                dispatch(setTake(take));
                dispatch(setTotalPages(data.TotalPages));
                dispatch(setPage(data.CurrentPage));

                // Set threads
                dispatch(setThreadTitles(forumTitles));
            });
    }
}

export const fetchPost = (id: number, cb?: () => void): fetchResult<any, void> => {
    return (dispatch) => {
        const forum = globals.urls.forumpost;
        const url = `${forum}?id=${id}`;
        const handler = responseHandler<Data.Raw.ThreadPostContentDTO>(dispatch)(r => r.json())
        return fetch(url, options)
            .then(handler)
            .then(data => {
                const content = data.Text;
                const title = normalizeThreadTitle(data.Header);

                dispatch(setPostContent(content));
                dispatch(addThreadTitle(title));
            })
            .then(cb);
    }
}

export const updatePost = (id: number, post: Partial<Data.Raw.Models.ThreadPostContent>, cb: () => void): fetchResult<any, void> => {
    return (dispatch) => {
        const url = `${globals.urls.forumpost}?id=${id}`;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const handler = responseHandler(dispatch)(_ => null);

        const opt = <RequestInit>Object.assign({}, options, {
            method: 'PUT',
            body: JSON.stringify(post),
            headers: headers
        });

        return fetch(url, opt)
            .then(handler)
            .then(cb);
    }
}

export const deletePost = (id: number, cb: () => void): fetchResult<any, void> => {
    return (dispatch) => {
        const url = `${globals.urls.forumpost}?id=${id}`;
        const opt = <RequestInit>Object.assign({}, options, {
            method: 'DELETE'
        });

        const handler = responseHandler(dispatch)(_ => null);
        return fetch(url, opt)
            .then(handler)
            .then(cb);
    }
}

export const postThread = (post: Partial<Data.Raw.Models.ThreadPostContent>, cb: () => void): fetchResult<any, void> => {
    return (dispatch) => {
        const url = globals.urls.forumpost;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const opt = Object.assign({}, options, {
            method: 'POST',
            body: JSON.stringify(post),
            headers: headers
        });

        const handler = responseHandler(dispatch)(_ => null);

        return fetch(url, opt)
            .then(handler)
            .then(cb);
    }
}