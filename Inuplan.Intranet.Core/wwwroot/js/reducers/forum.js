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
        case T.SET_SKIP_THREAD:
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
        case T.SET_THREAD_TITLES:
            return action.titles;
        default:
            return state;
    }
}

const postContent = (state = "", action) => {
    switch (action.type) {
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
    postContent
})

export default forumInfo;