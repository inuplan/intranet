/// <reference path="./es6-promise.d.ts" />
/// <reference path="./es6-object-assign.d.ts" />
import store from "../store/store";
import { fetchLatestNews } from "../actions/whatsnew";
import { fetchThreads, fetchPost } from "../actions/forum";
import { RouterState } from "react-router";
import { fetchCurrentUser, fetchUsers } from "../actions/users";
import { fetchUserImages, setSelectedImg, setImageOwner } from "../actions/images";
import { fetchComments, setSkipComments, setTakeComments, fetchAndFocusSingleComment } from "../actions/comments";
import { getImageCommentsPageUrl, getForumCommentsPageUrl } from "../utilities/utils";
import { polyfill } from "es6-promise";
import { polyfill as objectPolyfill } from "es6-object-assign";

export const init = () => {
    objectPolyfill();
    polyfill();
    store.dispatch(fetchCurrentUser(globals.currentUsername));
    store.dispatch(fetchUsers());
    moment.locale("da");
};

export const fetchWhatsNew = () => {
    const getLatest = (skip: number, take: number): void => store.dispatch(fetchLatestNews(skip, take));
    const { skip, take } = store.getState().whatsNewInfo;
    getLatest(skip, take);
};

export const fetchForum = (_: RouterState) => {
    const { skip, take } = store.getState().forumInfo.titlesInfo;
    store.dispatch<any>(fetchThreads(skip, take));
};

export const fetchSinglePost = (nextState: RouterState) => {
    const { id } = nextState.params;
    store.dispatch<any>(fetchPost(Number(id)));
};

interface ParamsId {
    params: { id: string };
}

interface ParamsUsername {
    params: { username: string };
}

interface LocationQueryPage {
    location: {
        query: {
            page: string
        }
    };
}

interface LocationQueryId {
    location: {
        query: {
            id: string
        }
    };
}


export const selectImage = (nextState: RouterState & ParamsId) => {
    const imageId = Number(nextState.params.id);
    store.dispatch(setSelectedImg(imageId));
};

export const fetchImages = (nextState: RouterState & ParamsUsername) => {
    const username = nextState.params.username;
    store.dispatch(setImageOwner(username));
    store.dispatch(fetchUserImages(username));

    // reset comment state
    store.dispatch(setSkipComments(undefined));
    store.dispatch(setTakeComments(undefined));
};

export const loadComments = (nextState: RouterState & ParamsId & LocationQueryPage) => {
    const { id } = nextState.params;
    const page = Number(nextState.location.query.page);
    const { skip, take } = store.getState().commentsInfo;

    const url = getImageCommentsPageUrl(Number(id), skip, take);
    if (!page) {
        store.dispatch(fetchComments(url, skip, take));
    }
    else {
        const skipPages = page - 1;
        const skipItems = (skipPages * take);
        store.dispatch(fetchComments(url, skipItems, take));
    }
};

export const fetchComment = (nextState: RouterState & LocationQueryId) => {
    const id = Number(nextState.location.query.id);
    store.dispatch(fetchAndFocusSingleComment(id));
};

export const fetchPostComments = (nextState: RouterState & ParamsId) => {
    const { id } = nextState.params;
    const { skip, take } = store.getState().commentsInfo;

    const url = getForumCommentsPageUrl(Number(id), skip, take);
    store.dispatch(fetchComments(url, skip, take));
};