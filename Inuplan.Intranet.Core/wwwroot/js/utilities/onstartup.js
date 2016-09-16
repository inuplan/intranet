import { store } from '../stores/store'
import { fetchUserImages, setSelectedImg, setImageOwner } from '../actions/images'
import { fetchComments, setSkipComments, setTakeComments, fetchAndFocusSingleComment } from '../actions/comments'
import { fetchLatestNews } from '../actions/whatsnew'
import { fetchThreads, fetchPost } from '../actions/forum'

export const selectImage = (nextState) => {
    const imageId = Number(nextState.params.id);
    store.dispatch(setSelectedImg(imageId));
}

export const fetchImages = (nextState) => {
    const username = nextState.params.username;
    store.dispatch(setImageOwner(username));
    store.dispatch(fetchUserImages(username));

    // reset comment state
    store.dispatch(setSkipComments(undefined));
    store.dispatch(setTakeComments(undefined));
}

export const loadComments = (nextState) => {
    const { username, id } = nextState.params;
    const page = Number(nextState.location.query.page);
    const { skip, take } = store.getState().commentsInfo;

    if(!page) {
        store.dispatch(fetchComments(id, skip, take));
    }
    else {
        const skipPages = page - 1;
        const skipItems = (skipPages * take);
        store.dispatch(fetchComments(id, skipItems, take));
    }
}

export const fetchComment = (nextState) => {
    const id = Number(nextState.location.query.id);
    store.dispatch(fetchAndFocusSingleComment(id));
}

export const fetchWhatsNew = (nextState) => {
    const getLatest = (skip, take) => store.dispatch(fetchLatestNews(skip, take));
    const { skip, take } = store.getState().whatsNewInfo;
    getLatest(skip, take);
}

export const fetchForum = (nextState) => {
    const { skip, take } = store.getState().forumInfo.titlesInfo;
    store.dispatch(fetchThreads(skip, take));
}

export const fetchSinglePost = (nextState) => {
    const { id } = nextState.params;
    store.dispatch(fetchPost(id));
}