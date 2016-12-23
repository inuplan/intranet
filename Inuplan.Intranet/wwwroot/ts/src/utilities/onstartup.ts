import { store } from '../store/store'
import { fetchLatestNews } from '../actions/whatsnew'
import * as moment from 'moment'
import { fetchThreads, fetchPost } from '../actions/forum'
import { RouterState } from 'react-router'
import { fetchUserImages, setSelectedImg, setImageOwner } from '../actions/images'
import { fetchComments, setSkipComments, setTakeComments, fetchAndFocusSingleComment } from '../actions/comments'
import { getImageCommentsPageUrl, getForumCommentsPageUrl } from '../utilities/utils'

export const init = () => {
    moment.locale('da');
}

export const fetchWhatsNew = () => {
    const getLatest = (skip: number, take: number): void => store.dispatch(fetchLatestNews(skip, take));
    const { skip, take } = store.getState().whatsNewInfo;
    getLatest(skip, take);
}

export const fetchForum = (_: RouterState) => {
    const { skip, take } = store.getState().forumInfo.titlesInfo;
    store.dispatch<any>(fetchThreads(skip, take));
}

export const fetchSinglePost = (nextState: RouterState) => {
    const { id } = nextState.params;
    store.dispatch<any>(fetchPost(Number(id)));
}

interface paramsId {
    params: { id: string }
}

interface paramsUsername {
    params: { username: string }
}

interface locationQueryPage {
    location: {
        query: {
            page: string
        }
    }
}

interface locationQueryId {
    location: {
        query: {
            id: string
        }
    }
}


export const selectImage = (nextState: RouterState & paramsId) => {
    const imageId = Number(nextState.params.id);
    store.dispatch(setSelectedImg(imageId));
}

export const fetchImages = (nextState: RouterState & paramsUsername) => {
    const username = nextState.params.username;
    store.dispatch(setImageOwner(username));
    store.dispatch(fetchUserImages(username));

    // reset comment state
    store.dispatch(setSkipComments(undefined));
    store.dispatch(setTakeComments(undefined));
}

export const loadComments = (nextState: RouterState & paramsId & locationQueryPage) => {
    const { id } = nextState.params;
    const page = Number(nextState.location.query.page);
    const { skip, take } = store.getState().commentsInfo;

    const url = getImageCommentsPageUrl(Number(id), skip, take);
    if(!page) {
        store.dispatch(fetchComments(url, skip, take));
    }
    else {
        const skipPages = page - 1;
        const skipItems = (skipPages * take);
        store.dispatch(fetchComments(url, skipItems, take));
    }
}

export const fetchComment = (nextState: RouterState & locationQueryId) => {
    const id = Number(nextState.location.query.id);
    store.dispatch(fetchAndFocusSingleComment(id));
}

export const fetchPostComments = (nextState: RouterState & paramsId) => {
    const { id } = nextState.params;
    const { skip, take } = store.getState().commentsInfo;

    const url = getForumCommentsPageUrl(Number(id), skip, take);
    store.dispatch(fetchComments(url, skip, take));
}