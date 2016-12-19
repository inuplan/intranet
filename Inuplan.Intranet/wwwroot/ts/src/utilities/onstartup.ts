import { store } from '../store/store'
import { fetchLatestNews } from '../actions/whatsnew'
import * as moment from 'moment'

export const init = () => {
    moment.locale('da');
}

export const fetchWhatsNew = () => {
    const getLatest = (skip: number, take: number): void => store.dispatch(fetchLatestNews(skip, take));
    const { skip, take } = store.getState().whatsNewInfo;
    getLatest(skip, take);
}