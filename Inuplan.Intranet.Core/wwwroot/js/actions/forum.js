import * as T from '../constants/types'
import fetch from 'isomorphic-fetch';
import { options } from '../constants/constants'
import { normalizeThreadTitle, responseHandler, onReject } from '../utilities/utils'

export const setPostComments = (comments) => {
    return {
        type: T.SET_POST_COMMENTS,
        comments: comments
    }
}

export const updateThreadTitle = (title) => {
    return {
        type: T.UPDATE_THREAD_TITLE,
        id: title.ID,
        title: title,
    }
}

export const addThreadTitle = (title) => {
    return {
        type: T.ADD_THREAD_TITLE,
        title: title
    }
}

export const setThreadTitles = (titles) => {
    return {
        type: T.SET_THREAD_TITLES,
        titles: titles
    }
}

export const setTotalPages = (totalPages) => {
    return {
        type: T.SET_TOTAL_PAGES_THREADS,
        totalPages: totalPages
    }
}

export const setPage = (page) => {
    return {
        type: T.SET_PAGE_THREADS,
        page: page
    }
}

export const setSkip = (skip) => {
    return {
        type: T.SET_SKIP_THREADS,
        skip: skip
    }
}

export const setTake = (take) => {
    return {
        type: T.SET_TAKE_THREADS,
        take: take
    }
}

export const setSelectedThread = (id) => {
    return {
        type: T.SET_SELECTEDTHREAD_ID,
        id: id
    }
}

export const setPostContent = (content) => {
    return {
        type: T.SET_POST_CONTENT,
        content: content
    }
}

export const newForumThreadFromServer = (thread) => {
    const t = normalizeThreadTitle(thread.Header);
    const c = thread.Text; // unused for now
    return addThreadTitle(t);
}

export const markPost = (postId, read, cb) => {
    return function(dispatch) {
        const url = `${globals.urls.forumpost}?postId=${postId}&read=${read}`;
        const opt = Object.assign({}, options, {
            method: 'PUT'
        });
        return fetch(url, opt)
            .then(cb, onReject);
    }
}

export const fetchThreads = (skip = 0, take = 10) => {
    return function(dispatch) {
        const forum = globals.urls.forumtitle;
        const url = `${forum}?skip=${skip}&take=${take}`;
        const handler = responseHandler.bind(this, dispatch);
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
            }, onReject);
    }
}

export const fetchPost = (id) => {
    return function(dispatch) {
        const forum = globals.urls.forumpost;
        const url = `${forum}?id=${id}`;
        const handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(data => {
                const content = data.Text;
                const title = normalizeThreadTitle(data.Header);

                dispatch(updateThreadTitle(title));
                dispatch(setPostContent(content));
                dispatch(setSelectedThread(data.ThreadID));
            })
    }
}

export const updatePost = (id, post, cb) => {
    return function(dispatch) {
        const url = `${globals.urls.forumpost}?id=${id}`;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const handler = responseHandler.bind(this, dispatch);

        const opt = Object.assign({}, options, {
            method: 'PUT',
            body: JSON.stringify(post),
            headers: headers
        });

        return fetch(url, opt)
            .then(cb, onReject);
    }
}

export const deletePost = (id, cb) => {
    return function(dispatch) {
        const url = `${globals.urls.forumpost}?id=${id}`;
        const opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        const handler = responseHandler.bind(this, dispatch);
        return fetch(url, opt)
            .then(cb, onReject);
    }
}

// post: ThreadPostContent
export const postThread = (cb, post) => {
    return function(dispatch) {
        const url = globals.urls.forumpost;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const opt = Object.assign({}, options, {
            method: 'POST',
            body: JSON.stringify(post),
            headers: headers
        });

        return fetch(url, opt)
            .then(() => cb(), onReject);
    }
}
