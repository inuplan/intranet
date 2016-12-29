import { combineReducers } from "redux";
import { Data } from "../interfaces/Data";
import { General } from "../interfaces/General";
import { ActionType } from "../constants/Actions";
import { put, objMap } from "../utilities/utils";
import { UsersState } from "../interfaces/State";

type UserReducer = General.KeyValue<Data.User>;
type Action<T> = General.Action<T>;

const users = (state: UserReducer = {}, action: Action<Data.User[]>): UserReducer => {
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

const currentUserId = (state: number = -1, action: Action<number>): number => {
    switch (action.type) {
        case ActionType.SET_CURRENT_USER_ID:
            return action.payload;
        default:
            return state;
    }
};

const usersInfo = combineReducers<UsersState>({
    currentUserId,
    users
});

export default usersInfo;