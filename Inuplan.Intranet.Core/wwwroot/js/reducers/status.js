import { combineReducers } from 'redux'
import * as T from '../constants/types'
import errorInfo from './error'

export const hasError = (state = false, action) => {
    switch (action.type) {
        case T.SET_HAS_ERROR:
            return action.hasError;
        default:
            return state;
    }
}

export const message = (state = "", action) => {
    switch (action.type) {
        default:
            return state;
    }
}

export const done = (state = true, action) => {
    switch (action.type) {
        default:
            return state;
    }
}

const statusInfo = combineReducers({
    hasError,
    errorInfo,
    message,
    done
})

export default statusInfo;