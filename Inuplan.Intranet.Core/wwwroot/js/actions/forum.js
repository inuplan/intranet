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

export const setThreadTitles = (titles) => {
    return {
        type: T.SET_THREAD_TITLES,
        titles: titles
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

                // Set threads
                dispatch(setThreadTitles(forumTitles));
            }, onReject);
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