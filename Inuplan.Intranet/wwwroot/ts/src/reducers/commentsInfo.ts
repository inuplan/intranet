import { combineReducers } from 'redux'
import { ActionType as T } from '../constants/actions'
import { Data } from '../interfaces/Data'
import { reducer } from '../constants/types'
import { CommentsState } from '../interfaces/State'

type Comment = Data.Comment

const comments: reducer<Comment[]> = (state = [], action) => {
    switch (action.type) {
        case T.RECIEVED_COMMENTS:
            return action.payload || [];
        case T.ADD_COMMENT:
            return [...state, action.payload[0]];
        default:
            return state;
    }
}

const skip: reducer<number> = (state = 0, action) => {
    switch (action.type) {
        case T.SET_SKIP_COMMENTS:
            return action.payload || 0;
        default:
            return state;
    }
}

const take: reducer<number> = (state = 10, action) => {
    switch (action.type) {
        case T.SET_TAKE_COMMENTS:
            return action.payload || 10;
        default:
            return state;
    }
}

const page: reducer<number> = (state = 1, action) => {
    switch (action.type) {
        case T.SET_CURRENT_PAGE:
            return action.payload || 1;
        default:
            return state;
    }
}

const totalPages: reducer<number> = (state = 0, action) => {
    switch (action.type) {
        case T.SET_TOTAL_PAGES:
            return action.payload || 0;
        default:
            return state;
    }
}

const focusedComment: reducer<number> = (state = -1, action) => {
    switch (action.type) {
        case T.SET_FOCUSED_COMMENT:
            return action.payload || -1;
        default:
            return state;
    }
}

const commentsInfo = combineReducers<CommentsState>({
    comments,
    skip,
    take,
    page,
    totalPages,
    focusedComment
})

export default commentsInfo;