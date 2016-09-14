import { combineReducers } from 'redux'
import * as T from '../constants/types'

const users = (state = {}, action) => {
    switch (action.type) {
        case T.ADD_USER:
            let kv = Object.assign({}, state);
            kv[action.user.ID] = action.user;
            return kv;
        case T.RECIEVED_USERS:
            return action.users;
        default:
            return state;
    }
}

const currentUserId = (state = -1, action) => {
    switch (action.type) {
        case T.SET_CURRENT_USER_ID:
            return action.id || -1;
        default:
            return state;
    }
}

const usersInfo = combineReducers({
    currentUserId,
    users
})

export default usersInfo;