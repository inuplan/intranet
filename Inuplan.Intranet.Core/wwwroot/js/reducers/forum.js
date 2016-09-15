import { combineReducers } from 'redux'
import { union } from '../utilities/utils'
import * as T from '../constants/types'

const postComments = (state = [], action) => {
    switch (action.type) {
        case T.SET_POST_COMMENTS:
            return action.comments || [];
        default:
            return state;
    }
}

const skipThreads = (state = 0, action) => {
    switch (action.type) {
        case T.SET_SKIP_THREADS:
            return action.skip;
        default:
            return state;
    }
}

const takeThreads = (state = 10, action) => {
    switch (action.type) {
        case T.SET_TAKE_THREADS:
            return action.take;
        default:
            return state;
    }
}

const pageThreads = (state = 1, action) => {
    switch (action.type) {
        case T.SET_PAGE_THREADS:
            return action.page;
        default:
            return state;
    }
}

const totalPagesThread = (state = 1, action) => {
    switch (action.type) {
        case T.SET_TOTAL_PAGES_THREADS:
            return action.totalPages;
        default:
            return state;
    }
}

const selectedThread = (state = -1, action) => {
    switch (action.type) {
        case T.SET_SELECTEDTHREAD_ID:
            return action.id;
        default:
            return state;
    }
}

const selectedPostId = (state = -1, action) => {
    switch (action.type) {
        case T.SET_SELECTED_POST_ID:
            return action.id;
        default:
            return state;
    }
}

//const postCommentsInfo = combineReducers({
//    postComments,
//    skip,
//    take,
//    page,
//    totalPages
//})

const titles = (state = [], action) => {
    switch (action.type) {
        case T.ADD_THREAD_TITLE:
            return union(state, [action.title], (t1, t2) => t1.ID == t2.ID);
        case T.SET_THREAD_TITLES:
            return action.titles;
        default:
            return state;
    }
}

const postContent = (state = "", action) => {
    switch (action.type) {
        case T.SET_POST_CONTENT:
            return action.content;
        default:
            return state;
    }
}

const titlesInfo = combineReducers({
    titles,
    skip: skipThreads,
    take: takeThreads,
    page: pageThreads,
    totalPages: totalPagesThread,
    selectedThread
})

const forumInfo = combineReducers({
    titlesInfo,
    postContent,
    selectedPostId
})

export default forumInfo;