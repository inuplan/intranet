import { combineReducers } from 'redux'
import * as T from '../constants/types'

const comments = (state = [], action) => {
    switch (action.type) {
        case T.RECIEVED_COMMENTS:
            return action.comments;
        case T.SET_DEFAULT_COMMENTS:
            return [];
        default:
            return state;
    }
}

const skip = (state = 0, action) => {
    switch (action.type) {
        case T.SET_SKIP_COMMENTS:
            return action.skip;
        case T.SET_DEFAULT_SKIP:
            return 0;
        default:
            return state;
    }
}

const take = (state = 10, action) => {
    switch (action.type) {
        case T.SET_TAKE_COMMENTS:
            return action.take;
        case T.SET_DEFAULT_TAKE:
            return 10;
        default:
            return state;
    }
}

const page = (state = 1, action) => {
    switch (action.type) {
        case T.SET_CURRENT_PAGE:
            return action.page;
        default:
            return state;
    }
}

const totalPages = (state = 1, action) => {
    switch (action.type) {
        case T.SET_TOTAL_PAGES:
            return action.totalPages;
        default:
            return state;
    }
}

const commentsInfo = combineReducers({
    comments,
    skip,
    take,
    page,
    totalPages
})

export default commentsInfo;