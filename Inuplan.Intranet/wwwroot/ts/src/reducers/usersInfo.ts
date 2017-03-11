import { combineReducers } from "redux";
import { Data } from "../interfaces/Data";
import { General } from "../interfaces/General";
import { ActionType } from "../constants/Actions";
import { UsersState } from "../interfaces/State";
import { put } from "../utilities/utils";

type UserReducer = General.KeyValue<Data.User>;
type Action<T> = General.Action<T>;

const users = (state: UserReducer = {}, action: Action<General.KeyValue<Data.User> | Data.User>): UserReducer => {
    switch (action.type) {
        case ActionType.RECEIVED_USERS:
        {
            // Discard old users and replace with current users
            const users = action.payload as General.KeyValue<Data.User>;
            return users;
        }
        case ActionType.ADD_USER: {
            const user = action.payload as Data.User;
            const users = put(state, user.ID, user);
            return users;
        }
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