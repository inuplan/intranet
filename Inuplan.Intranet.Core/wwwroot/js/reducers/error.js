import { combineReducers } from 'redux'
import * as T from '../constants/types'

export const title = (state = "", action) => {
    switch (action.type) {
        case T.SET_ERROR_TITLE:
            return action.title;
        case T.CLEAR_ERROR_TITLE:
            return "";
        default:
            return state;
    }
}

export const message = (state = "", action) => {
    switch (action.type) {
        case T.SET_ERROR_MESSAGE:
            return action.message;
        case T.CLEAR_ERROR_MESSAGE:
            return "";
        default:
            return state;
    }
}

const errorInfo = combineReducers({
    title,
    message
});

export default errorInfo;