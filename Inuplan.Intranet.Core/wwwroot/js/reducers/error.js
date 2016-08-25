import { combineReducers } from 'redux'
import * as T from '../constants/types'

export const title = (state = "", action) => {
    switch (action.type) {
        case T.SET_ERROR_TITLE:
            return action.title || "";
        default:
            return state;
    }
}

export const message = (state = "", action) => {
    switch (action.type) {
        case T.SET_ERROR_MESSAGE:
            return action.message || "";
        default:
            return state;
    }
}

const errorInfo = combineReducers({
    title,
    message
});

export default errorInfo;