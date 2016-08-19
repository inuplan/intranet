import { combineReducers } from 'redux'
import * as T from '../constants/types'
import { union, userEquality } from '../utilities/utils'

const users = (state = [], action) => {
    switch (action.type) {
        case T.ADD_USER:
            return union(state, [action.user], userEquality);
        case T.RECIEVED_USERS:
            return action.users;
        default:
            return state;
    }
}

const currentUserId = (state = -1, action) => {
    switch (action.type) {
        case T.SET_CURRENT_USER_ID:
            return action.id || state;
        default:
            return state;
    }
}

const usersInfo = combineReducers({
    currentUserId,
    users
})

export default usersInfo;