import { store } from '../store/store'
import { fetchLatestNews } from '../actions/whatsnew'

export const init = () => {
}

export const fetchWhatsNew = () => {
    const getLatest = (skip: number, take: number): void => store.dispatch(fetchLatestNews(skip, take));
    const { skip, take } = store.getState().whatsNewInfo;
    getLatest(skip, take);
}