import { combineReducers } from 'redux'
import { union } from '../utilities/utils'
import { ActionType as T } from '../constants/actions'
import { Data } from '../interfaces/Data'
import { reducer } from '../constants/types'
import { ForumTitlesState, ForumState } from '../interfaces/State'

const skipThreads: reducer<number> = (state = 0, action) => {
    switch (action.type) {
        case T.SET_SKIP_THREADS:
            return action.payload;
        default:
            return state;
    }
}

const takeThreads: reducer<number> = (state = 10, action) => {
    switch (action.type) {
        case T.SET_TAKE_THREADS:
            return action.payload;
        default:
            return state;
    }
}

const pageThreads: reducer<number> = (state = 1, action) => {
    switch (action.type) {
        case T.SET_PAGE_THREADS:
            return action.payload;
        default:
            return state;
    }
}

const totalPagesThread: reducer<number> = (state = 1, action) => {
    switch (action.type) {
        case T.SET_TOTAL_PAGES_THREADS:
            return action.payload;
        default:
            return state;
    }
}

const selectedThread: reducer<number> = (state = -1, action) => {
    switch (action.type) {
        case T.SET_SELECTEDTHREAD_ID:
            return action.payload;
        default:
            return state;
    }
}

const titles: reducer<Partial<Data.ForumTitle>[]> = (state = [], action) => {
    switch (action.type) {
        case T.ADD_THREAD_TITLE:
            return union(action.payload, state, (t1, t2) => t1.ID == t2.ID);
        case T.SET_THREAD_TITLES:
            return action.payload;
        default:
            return state;
    }
}

const postContent: reducer<string> = (state = "", action) => {
    switch (action.type) {
        case T.SET_POST_CONTENT:
            return action.payload;
        default:
            return state;
    }
}

const titlesInfo = combineReducers<ForumTitlesState>({
    titles,
    skip: skipThreads,
    take: takeThreads,
    page: pageThreads,
    totalPages: totalPagesThread,
    selectedThread
})

const forumInfo = combineReducers<ForumState>({
    titlesInfo,
    postContent
})

export default forumInfo;