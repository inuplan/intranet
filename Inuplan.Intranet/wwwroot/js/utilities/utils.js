import { uniq, flatten } from 'underscore'
import { HttpError, setError } from '../actions/error'
import marked from 'marked'
import removeMd from 'remove-markdown'

var curry = function(f, nargs, args) {
    nargs = isFinite(nargs) ? nargs : f.length;
    args = args || [];
    return function() {
        // 1. accumulate arguments
        var newArgs = args.concat(Array.prototype.slice.call(arguments));
        if (newArgs.length >= nargs) {
            // apply accumulated arguments
            return f.apply(this, newArgs);
        }
        // 2. return another curried function
        return curry(f, nargs, newArgs);
    };
};

export default curry;

export const getFullName = (user, none = '') => {
    if(!user) return none;
    return `${user.FirstName} ${user.LastName}`;
}

const countComment = (topComment) => {
    let count = 1;
    let removed = 0;
    for (var i = 0; i < topComment.Replies.length; i++) {
        const child = topComment.Replies[i];

        // Exclude deleted comments
        if(child.Deleted) {
            removed++;
        }

        count += countComment(child);
    }

    return count-removed;
}

const countComments = (comments = []) => {
    let total = 0;

    for (var i = 0; i < comments.length; i++) {
        const topComment = comments[i];
        total += countComment(topComment);
    }

    return total;
}

export const normalizeImage = (img) => {
    return {
        ImageID: img.ImageID,
        Filename: img.Filename,
        Extension: img.Extension,
        OriginalUrl: img.OriginalUrl,
        PreviewUrl: img.PreviewUrl,
        ThumbnailUrl: img.ThumbnailUrl,
        CommentCount: img.CommentCount,
        Uploaded: new Date(img.Uploaded),
    };
}

export const normalizeComment = (comment) => {
    let r = comment.Replies ? comment.Replies : [];
    const replies = r.map(normalizeComment);
    const authorId = (comment.Deleted) ? -1 : comment.Author.ID;
    return {
        CommentID: comment.ID,
        AuthorID: authorId,
        Deleted: comment.Deleted,
        PostedOn: comment.PostedOn,
        Text: comment.Text,
        Replies: replies,
        Edited: comment.Edited
    }
}

export const normalizeLatest = (latest) => {
    let item = null;
    let authorId = -1;
    if(latest.Type == 1) {
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
        authorId = latest.Item.Author.ID;
    }
    else if (latest.Type == 2) {
        // Comment - omit Author and Deleted and Replies
        const comment = latest.Item;
        item = {
            ID: comment.ID,
            Text: comment.Text,
            ImageID: comment.ImageID,
            ImageUploadedBy: comment.ImageUploadedBy,
            Filename: comment.Filename
        };
        authorId = latest.Item.Author.ID;
    }
    else if (latest.Type == 4) {
        const post = latest.Item;
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

export const normalizeThreadTitle = (title) => {
    const viewedBy = title.ViewedBy.map(user => user.ID);
    const latestComment = title.LatestComment ? normalizeComment(title.LatestComment) : null;
    return {
        ID: title.ID,
        IsPublished: title.IsPublished,
        Sticky: title.Sticky,
        CreatedOn: title.CreatedOn,
        AuthorID: title.Author.ID,
        Deleted: title.Deleted,
        IsModified: title.IsModified,
        Title: title.Title,
        LastModified: title.LastModified,
        LatestComment: latestComment,
        CommentCount: title.CommentCount,
        ViewedBy: viewedBy,
    }
}

export const visitComments = (comments, func) => {
    const getReplies = (c) => c.Replies ? c.Replies : [];
    for (var i = 0; i < comments.length; i++) {
        depthFirstSearch(comments[i], getReplies, func);
    }
}

export const depthFirstSearch = (current, getChildren, func) => {
    func(current);
    const children = getChildren(current);
    for (var i = 0; i < children.length; i++) {
        depthFirstSearch(children[i], getChildren, func);
    }
}

export function union(arr1, arr2, equalityFunc) {
    var union = arr1.concat(arr2);

    for (var i = 0; i < union.length; i++) {
        for (var j = i+1; j < union.length; j++) {
            if (equalityFunc(union[i], union[j])) {
                union.splice(j, 1);
                j--;
            }
        }
    }

    return union;
}

export const getImageCommentsPageUrl = (imageId, skip, take) => {
    return `${globals.urls.imagecomments}?imageId=${imageId}&skip=${skip}&take=${take}`;
}

export const getImageCommentsDeleteUrl = (commentId) => {
    return `${globals.urls.imagecomments}?commentId=${commentId}`;
}

export const getForumCommentsPageUrl = (postId, skip, take) => {
    return `${globals.urls.forumcomments}?postId=${postId}&skip=${skip}&take=${take}`;
}

export const getForumCommentsDeleteUrl = (commentId) => {
    return `${globals.urls.forumcomments}?commentId=${commentId}`;
}

export const formatText = (text) => {
    if (!text) return;
    var rawMarkup = marked(text, { sanitize: true });
    return { __html: rawMarkup };
}

export const getWords = (text, numberOfWords) => {
    if(!text) return "";
    const plainText = removeMd(text);
    return plainText.split(/\s+/).slice(0, numberOfWords).join(" ");
}

export const timeText = (postedOn) => {
    const ago = moment(postedOn).fromNow();
    const diff = moment().diff(postedOn, 'hours', true);
    if (diff >= 12.5) {
        var date = moment(postedOn);
        return "d. " + date.format("D MMM YYYY ") + "kl. " + date.format("H:mm");
    }

    return "for " + ago;
}

export const responseHandler = (dispatch, response) => {
    if (response.ok) return response.json();
    else {
        switch (response.status) {
            case 400:
                dispatch(setError(new HttpError("400 Bad Request", "The request was not well-formed")));
                break;
            case 404:
                dispatch(setError(new HttpError("404 Not Found", "Could not find resource")));
                break;
            case 408:
                dispatch(setError(new HttpError("408 Request Timeout", "The server did not respond in time")));
            case 500:
                dispatch(setError(new HttpError("500 Server Error", "Something went wrong with the API-server")));
                break;
            default:
                dispatch(setError(new HttpError("Oops", "Something went wrong!")));
                break;
        }

        return Promise.reject();
    }
}

export const onReject = () => { }

export const put = (obj, key, value) => {
    let kv = Object.assign({}, obj);
    kv[key] = value;
    return kv;
}

export const objMap = (arr, key, val) => {
    const obj = arr.reduce((res, item) => {
        const k = key(item);
        const v = val(item);
        res[k] = v;
        return res;
    }, {});

    return obj
}
