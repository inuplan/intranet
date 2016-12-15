import { combineReducers } from 'redux';
import { ActionType } from '../constants/Actions';
import { put, objMap } from '../utilities/utils';
const users = (state = {}, action) => {
    switch (action.type) {
        case ActionType.ADD_USERS:
            // Keep old users (and overwrite with new if users overlaps)
            return action.payload.reduce((res, user) => put(res, user.ID, user), state);
        case ActionType.RECEIVED_USERS:
            // Discard old users and replace with current users
            return objMap(action.payload, (k) => k.ID, (v) => v);
        default:
            return state;
    }
};
const currentUserId = (state = -1, action) => {
    switch (action.type) {
        case ActionType.SET_CURRENT_USER_ID:
            return action.payload;
        default:
            return state;
    }
};
const usersInfo = combineReducers({
    currentUserId,
    users
});
export default usersInfo;
