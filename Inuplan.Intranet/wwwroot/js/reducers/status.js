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

export const usedSpacekB = (state = 0, action) => {
    switch(action.type) {
        case T.SET_USED_SPACE_KB:
            return action.usedSpace;
        default:
            return state;
    }
}

export const totalSpacekB = (state = -1, action) => {
    switch(action.type) {
        case T.SET_TOTAL_SPACE_KB:
            return action.totalSpace;
        default:
            return state;
    }
}

export const spaceInfo = combineReducers({
    usedSpacekB,
    totalSpacekB
});

const statusInfo = combineReducers({
    hasError,
    errorInfo,
    spaceInfo,
    message,
    done
})

export default statusInfo;
