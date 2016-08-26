import { combineReducers } from 'redux'
import { union } from '../utilities/utils'
import * as T from '../constants/types'

const comments = (state = [], action) => {
    switch (action.type) {
        case T.RECIEVED_COMMENTS:
            return action.comments || [];
        case T.ADD_COMMENT:
            return union(state, [action.comment], (c1, c2) => c1.CommentID == c2.CommentID);
        default:
            return state;
    }
}

const skip = (state = 0, action) => {
    switch (action.type) {
        case T.SET_SKIP_COMMENTS:
            return action.skip || 0;
        default:
            return state;
    }
}

const take = (state = 10, action) => {
    switch (action.type) {
        case T.SET_TAKE_COMMENTS:
            return action.take || 10;
        default:
            return state;
    }
}

const page = (state = 1, action) => {
    switch (action.type) {
        case T.SET_CURRENT_PAGE:
            return action.page || 1;
        default:
            return state;
    }
}

const totalPages = (state = 0, action) => {
    switch (action.type) {
        case T.SET_TOTAL_PAGES:
            return action.totalPages || 0;
        default:
            return state;
    }
}

const focusedComment = (state = -1, action) => {
    switch (action.type) {
        case T.SET_FOCUSED_COMMENT:
            return action.id || -1;
        default:
            return state;
    }
}

const commentsInfo = combineReducers({
    comments,
    skip,
    take,
    page,
    totalPages,
    focusedComment
})

export default commentsInfo;