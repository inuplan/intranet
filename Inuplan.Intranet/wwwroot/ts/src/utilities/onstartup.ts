import { store } from '../store/store'
import { fetchLatestNews } from '../actions/whatsnew'
import * as moment from 'moment'
import { fetchThreads, fetchPost } from '../actions/forum'
import { RouterState } from 'react-router'

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