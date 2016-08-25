import { combineReducers } from 'redux'
import * as T from '../constants/types'


const skip = (state = 0, action) => {
    switch (action.type) {
        case T.SET_SKIP_WHATS_NEW:
            return action.skip || 0;
        default:
            return state;
    }
}

const take = (state = 10, action) => {
    switch (action.type) {
        case T.SET_TAKE_WHATS_NEW:
            return action.take || 10;
        default:
            return state;
    }
}

const page = (state = 1, action) => {
    switch (action.type) {
        case T.SET_PAGE_WHATS_NEW:
            return action.page || 1;
        default:
            return state;
    }
}

const totalPages = (state = 0, action) => {
    switch (action.type) {
        case T.SET_TOTAL_PAGES_WHATS_NEW:
            return action.totalPages || 0;
        default:
            return state;
    }
}

const items = (state = [], action) => {
    switch (action.type) {
        case T.ADD_LATEST:
            return action.latest || [];
        default:
            return state;
    }
}

const whatsNewInfo = combineReducers({
    skip,
    take,
    page,
    totalPages,
    items
})

export default whatsNewInfo;