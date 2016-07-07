import { uniq, flatten } from 'underscore'
import { HttpError, setError } from '../actions/error'

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
        CommentCount: img.CommentCount
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
        Replies: replies
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

export const userEquality = (user1, user2) => {
    return user1.ID == user2.ID;
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