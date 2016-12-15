import { globals } from '../interfaces/General';
import { responseHandler, options } from '../utilities/utils';
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
const normalize = (latest) => {
    let item = null;
    let authorId = -1;
    if (latest.Type == Data.WhatsNewType.Image) {
        // Image - omit Author and CommentCount
        const image = latest.Item;
        item = {
            Extension: image.Extension,
            Filename: image.Filename,
            ImageID: image.ImageID,
            OriginalUrl: image.OriginalUrl,
            PreviewUrl: image.PreviewUrl,
            ThumbnailUrl: image.ThumbnailUrl,
            Uploaded: image.Uploaded
        };
        authorId = image.Author.ID;
    }
    else if (latest.Type == Data.WhatsNewType.Comment) {
        // Comment - omit Author and Deleted and Replies
        const comment = latest.Item;
        item = {
            ID: comment.ID,
            Text: comment.Text,
            ImageID: comment.ImageID,
            ImageUploadedBy: comment.ImageUploadedBy,
            Filename: comment.Filename
        };
        authorId = comment.Author.ID;
    }
    else if (latest.Type == Data.WhatsNewType.ForumPost) {
        const post = latest.Item;
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
        AuthorID: authorId,
    };
};
