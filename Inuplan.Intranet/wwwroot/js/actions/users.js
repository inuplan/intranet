import fetch from 'isomorphic-fetch';
import _ from 'underscore'
import * as T from '../constants/types'
import { options } from '../constants/constants'
import { HttpError, setError } from './error'
import { objMap, responseHandler, onReject } from '../utilities/utils'

const getUrl = (username) => globals.urls.users + '?username=' + username;

export function setCurrentUserId(id) {
    return {
        type: T.SET_CURRENT_USER_ID,
        id: id
    };
}

export function addUser(user) {
    return {
        type: T.ADD_USER,
        user: user
    };
}

export function recievedUsers(users) {
    return {
        type: T.RECIEVED_USERS,
        users: users
    }
}

export function fetchCurrentUser(username) {
    return function(dispatch) {
        var url = getUrl(username);

        const handler = responseHandler.bind(this, dispatch);

        return fetch(url, options)
            .then(handler)
            .then(user => {
                dispatch(setCurrentUserId(user.ID));
                dispatch(addUser(user));
            }, onReject);
    }
}

export function fetchUser(username) {
    return function(dispatch, getState) {
        var url = getUrl(username);

        const handler = responseHandler.bind(this, dispatch);

        return fetch(url, options)
            .then(handler)
            .then(user => dispatch(addUser(user)), onReject);
    }
}

export function fetchUsers() {
    return function(dispatch) {
        const handler = responseHandler.bind(this, dispatch);
        return fetch(globals.urls.users, options)
            .then(handler)
            .then(users => {
                const getKey = (user) => user.ID;
                const getValue = (user) => user;
                const obj = objMap(users, getKey, getValue);
                dispatch(recievedUsers(obj));
            }, onReject);
    }
}