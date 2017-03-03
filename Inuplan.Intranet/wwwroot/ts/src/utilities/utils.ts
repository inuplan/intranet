import { General as G } from "../interfaces/General";
import { Root } from "../interfaces/State";
import { setError } from "../actions/error";
import { Dispatch } from "redux";
import * as marked from "marked";
import removeMd from "remove-markdown";
import { Data } from "../interfaces/Data";
import { endLoading } from "../actions/status";

/// T: The element type, in the array
/// V: The value type, saved in the associative array
export const objMap = <T, V>(arr: T[], key: G.FunctionGeneric<T, number>, val: G.FunctionGeneric<T, V> ): G.KeyValue<V> => {
    const obj = arr.reduce((res: G.KeyValue<V>, item: T) => {
        const k = key(item);
        const v = val(item);
        res[k] = v;
        return res;
    }, {});

    return obj;
};

export const put = <V>(obj: G.KeyValue<V>, key: number, value: V): G.KeyValue<V> => {
    let kv: G.KeyValue<V> = Object.assign({}, obj);
    kv[key] = value;
    return kv;
};

export const options: RequestInit = {
    mode: "cors",
    credentials: "include"
};

export const responseHandler =  <T>(dispatch: Dispatch<Root>) => (onSuccess: (r: Response) => Promise<T>) => (response: Response) => {
    dispatch(endLoading());
    if (response.ok) return onSuccess(response);
    else {
        switch (response.status) {
            case 400:
                dispatch<any>(setError({ title: "400 Bad Request", message: "The request was not well-formed"}));
                break;
            case 404:
                dispatch<any>(setError({ title: "404 Not Found", message: "Could not find resource"}));
                break;
            case 408:
                dispatch<any>(setError({ title: "408 Request Timeout", message: "The server did not respond in time"}));
                break;
            case 500:
                dispatch<any>(setError({ title: "500 Server Error", message: "Something went wrong with the API-server"}));
                break;
            default:
                dispatch<any>(setError({ title: "Oops", message: "Something went wrong!"}));
                break;
        }
    }

    return null;
};

export const union = <T>(arr1: T[], arr2: T[], equalityFunc: (v1: T, v2: T) => boolean): T[] => {
    let result = arr1.concat(arr2);
    // Better way: loop over 1 array and check
    // if corresponding item exist in the other array using equality function
    // If not exists: add item to array 2

    for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
            if (equalityFunc(result[i], result[j])) {
                result.splice(j, 1);
                j--;
            }
        }
    }

    return result;
};

export const timeText = (postedOn: Date, expire: number = 12.5) => {
    const ago = moment(postedOn).fromNow();
    const diff = moment().diff(postedOn, "hours", true);
    if (diff >= expire) {
        const date = moment(postedOn);
        return `d. ${date.format("D MMM YYYY ")} kl. ${date.format("H:mm")}`;
    }

    return "for " + ago;
};

export const formatText = (text: string) => {
    if (!text) return null;
    const rawMarkup = marked(text, { sanitize: true });
    return { __html: rawMarkup };
};

export const getWords = (text: string, numberOfWords: number) => {
    if (!text) return "";
    const plainText = removeMd(text);
    return plainText.split(/\s+/).slice(0, numberOfWords).join(" ");
};

export const getFullName = (user: Data.User, none = "") => {
    if (!user) return none;
    return `${user.FirstName} ${user.LastName}`;
};

export const visitComments = (comments: Data.Comment[], func: (current: Data.Comment) => void) => {
    const getReplies = (c: Data.Comment) => c.Replies ? c.Replies : [];
    for (let i = 0; i < comments.length; i++) {
        depthFirstSearch(comments[i], getReplies, func);
    }
};

export const depthFirstSearch = (current: Data.Comment, getChildren: (current: Data.Comment) => Data.Comment[], func: (current: Data.Comment) => void) => {
    func(current);
    const children = getChildren(current);
    for (let i = 0; i < children.length; i++) {
        depthFirstSearch(children[i], getChildren, func);
    }
};

export const normalizeComment = (comment: Data.Raw.Comment): Data.Comment => {
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
    };
};

export const getForumCommentsDeleteUrl = (commentId: number): string => {
    return `${globals.urls.forumcomments}?commentId=${commentId}`;
};

export const getForumCommentsPageUrl = (postId: number, skip: number, take: number) => {
    return `${globals.urls.forumcomments}?postId=${postId}&skip=${skip}&take=${take}`;
};

export const getImageCommentsPageUrl = (imageId: number, skip: number, take: number) => {
    return `${globals.urls.imagecomments}?imageId=${imageId}&skip=${skip}&take=${take}`;
};

export const getImageCommentsDeleteUrl = (commentId: number) => {
    return `${globals.urls.imagecomments}?commentId=${commentId}`;
};