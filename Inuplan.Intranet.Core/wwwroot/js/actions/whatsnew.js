import fetch from 'isomorphic-fetch';
import _ from 'underscore'
import * as T from '../constants/types'
import { options } from '../constants/constants'
import { HttpError, setError } from './error'
import { responseHandler, onReject, normalizeLatest } from '../utilities/utils'
import { addUser } from './users'

export function addLatest(latest) {
    return {
        type: T.ADD_LATEST,
        latest: latest
    }
}

export function setSKip(skip) {
    return {
        type: T.SET_SKIP_WHATS_NEW,
        skip: skip
    }
}

export function setTake(take) {
    return {
        type: T.SET_TAKE_WHATS_NEW,
        take: take
    }
}

export function setPage(page) {
    return {
        type: T.SET_PAGE_WHATS_NEW,
        page: page
    }
}

export function setTotalPages(totalPages) {
    return {
        type: T.SET_TOTAL_PAGES_WHATS_NEW,
        totalPages: totalPages
    }
}

export function fetchLatestNews(skip, take) {
    return function(dispatch) {
        const url = globals.urls.whatsnew + "?skip=" + skip + "&take=" + take;
        const handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(page => {
                const items = page.CurrentItems;
                items.forEach(item => {
                    const author = item.Item.Author;
                    if(author)
                        dispatch(addUser(author));
                });

                // Reset info
                dispatch(setSKip(skip));
                dispatch(setTake(take));
                dispatch(setPage(page.CurrentPage));
                dispatch(setTotalPages(page.TotalPages));

                const normalized = items.map(normalizeLatest);
                dispatch(addLatest(normalized));
            }, onReject);
    }
}