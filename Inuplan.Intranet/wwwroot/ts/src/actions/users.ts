import { ActionType } from "../constants/actions";
import { Data } from "../interfaces/Data";
import { General } from "../interfaces/General";
import * as fetch from "isomorphic-fetch";
import { options, objMap, responseHandler } from "../utilities/utils";
import { fetchResult } from "../constants/types";
import { Dispatch } from "redux";

type User = Data.User;
type Action<T> = (payload: T) => General.Action<T>;

export const addUser: Action<User> = (user) => {
    return {
        type: ActionType.ADD_USER,
        payload: user
    };
};

export const setCurrentUserId: Action<number> = (id) => {
    return {
        type: ActionType.SET_CURRENT_USER_ID,
        payload: id
    };
};

export const recievedUsers: Action<General.KeyValue<User>> = (users) => {
    return {
        type: ActionType.RECIEVED_USERS,
        payload: users
    };
};

export const fetchCurrentUser = (username: string): fetchResult<any, void>  => {
    return (dispatch: Dispatch<any>) => {
        let url = `${globals.urls.users}?username=${username}`;
        const handler = responseHandler<User>(dispatch)(r => r.json());

        return fetch(url, options)
            .then(handler)
            .then(user => {
                dispatch(setCurrentUserId(user.ID));
                dispatch(addUser(user));
            });
    };
};

export const fetchUser = (username: string): fetchResult<any, void> => {
    return (dispatch) => {
        let url = `${globals.urls.users}?username=${username}`;
        const handler = responseHandler<User>(dispatch)(r => r.json());

        return fetch(url, options)
            .then(handler)
            .then(user => { dispatch(addUser(user)); });
    };
};

export const fetchUsers = (): fetchResult<any, void> => {
    return (dispatch) => {
        const handler = responseHandler<User[]>(dispatch)(r => r.json());
        return fetch(globals.urls.users, options)
            .then(handler)
            .then(users => {
                const getKey = (user: User) => user.ID;
                const getValue = (user: User) => user;
                const obj = objMap(users, getKey, getValue);
                dispatch(recievedUsers(obj));
            });
    };
};