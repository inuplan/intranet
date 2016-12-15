import { globals, General } from '../interfaces/General'
import { responseHandler, options } from '../utilities/utils'
import { Dispatch } from 'redux'
import { Root } from '../interfaces/State'
import { Data } from '../interfaces/Data'
import * as fetch from 'isomorphic-fetch'
import { ActionType } from '../constants/Actions'

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
        const handler = responseHandler<Data.Raw.Pagination>(dispatch)(r => r.json());
        return fetch(url, options)
            .then(handler)
            .then(page => {
                const items = page.CurrentItems;
                items.forEach(item => {
                    const author = getAuthor(item.Type, item.Item);
                    if(author) {
                        // dispatch(addUser(author));
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

const normalize = (latest: Data.Raw.WhatsNewItem): Data.WhatsNew => {
    let item = null;
    let authorId = -1;
    if(latest.Type == Data.WhatsNewType.Image) {
        // Image - omit Author and CommentCount
        const image = <Data.Raw.ImageDTO>latest.Item;
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
        const comment = <Data.Raw.WhatsNewImageCommentDTO>latest.Item;
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
        const post = <Data.Raw.ThreadPostContentDTO>latest.Item;
        item = {
            ID: post.ThreadID,
            Title: post.Header.Title,
            Text: post.Text,
            Sticky: post.Header.Sticky,
            CommentCount: post.Header.CommentCount
        }
        authorId = post.Header.Author.ID;
    }

    return {
        ID: latest.ID,
        Type: latest.Type,
        Item: item,
        On: latest.On,
        AuthorID: authorId,
    }
}
