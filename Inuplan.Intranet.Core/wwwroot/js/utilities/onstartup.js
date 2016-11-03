import { store } from '../stores/store'
import { fetchCurrentUser, fetchUsers } from '../actions/users'
import { newImageFromServer, fetchUserImages, setSelectedImg, setImageOwner } from '../actions/images'
import { newCommentFromServer, fetchComments, setSkipComments, setTakeComments, fetchAndFocusSingleComment } from '../actions/comments'
import { setLatest, fetchLatestNews } from '../actions/whatsnew'
import { newForumThreadFromServer, fetchThreads, fetchPost } from '../actions/forum'
import { fetchSpaceInfo } from '../actions/status'
import { getImageCommentsPageUrl, getForumCommentsPageUrl } from '../utilities/utils'

export const init = () => {
    store.dispatch(fetchCurrentUser(globals.currentUsername));
    store.dispatch(fetchUsers());
    moment.locale('da');

    connectToLatestWebSocketService();
}

export const connectToLatestWebSocketService = () => {
    const supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;

    if(supportsWebSockets) {
        const socket = new WebSocket(globals.urls.websocket.latest);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch(data.type) {
                case 'NEW_IMAGE_COMMENT':
                    store.dispatch(newCommentFromServer(data.item));
                    break;
                case 'NEW_IMAGE':
                    store.dispatch(newImageFromServer(data.item));
                    store.dispatch(fetchSpaceInfo(`${globals.urls.diagnostics}/getspaceinfo`));
                    break;
                case 'NEW_FORUM_THREAD':
                    store.dispatch(newForumThreadFromServer(data.item));
                    break;
            }

            const { skip, take } = store.getState().whatsNewInfo;
            store.dispatch(fetchLatestNews(skip, take));
        }
    }
    else {
        // do long-poll every 10 seconds
        setInterval(() => {
            const { skip, take } = store.getState().whatsNewInfo;
            const skipPost = store.getState().forumInfo.titlesInfo.skip;
            const takePost = store.getState().forumInfo.titlesInfo.take;

            store.dispatch(fetchUsers());
            store.dispatch(fetchLatestNews(skip, take));
            store.dispatch(fetchThreads(skipPost, takePost));
            store.dispatch(fetchSpaceInfo(`${globals.urls.diagnostics}/getspaceinfo`));
        }, 10000);
    }
}

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

    const url = getImageCommentsPageUrl(id, skip, take);
    if(!page) {
        store.dispatch(fetchComments(url, skip, take));
    }
    else {
        const skipPages = page - 1;
        const skipItems = (skipPages * take);
        store.dispatch(fetchComments(url, skipItems, take));
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
    store.dispatch(fetchPost(Number(id)));
}

export const fetchPostComments = (nextState) => {
    const { id } = nextState.params;
    const { skip, take } = store.getState().commentsInfo;

    const url = getForumCommentsPageUrl(id, skip, take);
    store.dispatch(fetchComments(url, skip, take));
}
