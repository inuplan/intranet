import { globals } from '../interfaces/General';
import { responseHandler, options } from '../utilities/utils';
import { normalizeLatest as normalize } from '../utilities/normalize';
import { Data } from '../interfaces/Data';
import * as fetch from 'isomorphic-fetch';
import { ActionType } from '../constants/Actions';
export const setLatest = (latest) => {
    return {
        type: ActionType.SET_LATEST,
        payload: latest
    };
};
export const setSkip = (skip) => {
    return {
        type: ActionType.SET_SKIP_WHATS_NEW,
        payload: skip
    };
};
export const setTake = (take) => {
    return {
        type: ActionType.SET_TAKE_WHATS_NEW,
        payload: take
    };
};
export const setPage = (page) => {
    return {
        type: ActionType.SET_PAGE_WHATS_NEW,
        payload: page
    };
};
export const setTotalPages = (totalPages) => {
    return {
        type: ActionType.SET_TOTAL_PAGES_WHATS_NEW,
        payload: totalPages
    };
};
export const fetchLatestNews = (skip, take) => {
    return function (dispatch) {
        const url = `${globals.urls.whatsnew}?skip=${skip}&take=${take}`;
        const handler = responseHandler(dispatch)(r => r.json());
        return fetch(url, options)
            .then(handler)
            .then(page => {
            const items = page.CurrentItems;
            items.forEach(item => {
                const author = getAuthor(item.Type, item.Item);
                if (author) {
                }
            });
            // Reset info
            dispatch(setSkip(skip));
            dispatch(setTake(take));
            dispatch(setPage(page.CurrentPage));
            dispatch(setTotalPages(page.TotalPages));
            const normalized = items.map(normalize);
            dispatch(setLatest(normalized));
        });
    };
};
const getAuthor = (type, item) => {
    let author = null;
    if (type == Data.WhatsNewType.ForumPost) {
        author = item.Header.Author;
    }
    else {
        author = item.Author;
    }
    return author;
};
