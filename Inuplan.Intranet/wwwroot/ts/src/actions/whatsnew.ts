import { globals, General } from '../interfaces/General'
import { responseHandler, options } from '../utilities/utils'
import { normalizeLatest as normalize } from '../utilities/normalize'
import { Dispatch } from 'redux'
import { Root } from '../interfaces/State'
import { Data } from '../interfaces/Data'
import * as fetch from 'isomorphic-fetch'
import { ActionType } from '../constants/actions'
import { addUser } from '../actions/users'

export const setLatest = (latest: Data.WhatsNew[]): General.Action<Data.WhatsNew[]> => {
    return {
        type: ActionType.SET_LATEST,
        payload: latest
    }
}

export const setSkip = (skip: number): General.Action<number> => {
    return {
        type: ActionType.SET_SKIP_WHATS_NEW,
        payload: skip
    }
}

export const setTake = (take: number): General.Action<number> => {
    return {
        type: ActionType.SET_TAKE_WHATS_NEW,
        payload: take
    }
}

export const setPage = (page: number): General.Action<number> => {
    return {
        type: ActionType.SET_PAGE_WHATS_NEW,
        payload: page
    }
}

export const setTotalPages = (totalPages: number): General.Action<number> => {
    return {
        type: ActionType.SET_TOTAL_PAGES_WHATS_NEW,
        payload: totalPages
    }
}

export const fetchLatestNews = (skip:number, take:number): any => {
    return function(dispatch: Dispatch<Root>) : Promise<void> {
        const url = `${globals.urls.whatsnew}?skip=${skip}&take=${take}`;
        const handler = responseHandler<Data.Raw.Pagination<Data.Raw.WhatsNewItem>>(dispatch)(r => r.json());
        return fetch(url, options)
            .then(handler)
            .then(page => {
                const items = page.CurrentItems;
                items.forEach(item => {
                    const author = getAuthor(item.Type, item.Item);
                    if(author) {
                        dispatch(addUser(author));
                    }
                });

                // Reset info
                dispatch(setSkip(skip));
                dispatch(setTake(take));
                dispatch(setPage(page.CurrentPage));
                dispatch(setTotalPages(page.TotalPages));

                const normalized = items.map(normalize);
                dispatch(setLatest(normalized));
           })
    }
}

const getAuthor = (type: Data.WhatsNewType, item: Data.Raw.ImageDTO | Data.Raw.WhatsNewImageCommentDTO | Data.Raw.ThreadPostContentDTO): Data.User => {
    let author: Data.User = null;
    if(type == Data.WhatsNewType.ForumPost) {
        author = (<Data.Raw.ThreadPostContentDTO>item).Header.Author;
    } else {
        author = (<Data.Raw.ImageDTO>item).Author;
    }
    return author;
}