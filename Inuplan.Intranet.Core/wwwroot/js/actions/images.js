import fetch from 'isomorphic-fetch';
import * as T from '../constants/types'
import { options } from '../constants/constants'
import { addUser } from './users'
import { addComments, setDefaultSkip, setDefaultTake, setDefaultComments} from './comments'
import { normalizeImage, normalizeComment } from '../utilities/utils'
import { HttpError, setError } from './error'
import { responseHandler, onReject } from '../utilities/utils'

export function setImagesOwner(id) {
    return {
        type: T.SET_IMAGES_OWNER,
        id: id
    };
}

export function recievedUserImages(images) {
    return {
        type: T.RECIEVED_USER_IMAGES,
        images: images
    };
}

export const setSelectedImg = (id) => {
    return {
        type: T.SET_SELECTED_IMG,
        id: id
    };
}

export const removeModal = () => {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(unsetSelectedImg());
        dispatch(setDefaultSkip());
        dispatch(setDefaultTake());
        dispatch(setDefaultComments());
        return Promise.resolve();
    }
}

const unsetSelectedImg = () => {
    return {
        type: T.UNSET_SELECTED_IMG
    };
}

export function removeImage(id) {
    return {
        type: T.REMOVE_IMAGE,
        id: id
    };
}

export function addSelectedImageId(id) {
    return {
        type: T.ADD_SELECTED_IMAGE_ID,
        id: id
    };
}

export function removeSelectedImageId(id) {
    return {
        type: T.REMOVE_SELECTED_IMAGE_ID,
        id: id
    };
}

export function clearSelectedImageIds() {
    return {
        type: T.CLEAR_SELECTED_IMAGE_IDS
    };
}

export function requestDeleteImage(id, username) {
    return function(dispatch) {
        const url = globals.urls.images + "?username=" + username + "&id=" + id;
        const opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        const handler = responseHandler.bind(this, dispatch);

        return fetch(url, opt)
            .then(handler)
            .then(() => dispatch(removeImage(id)), onReject);
    }
}

export function uploadImage(username, formData) {
    return function(dispatch) {
        const url = globals.urls.images + "?username=" + username;
        const opt = Object.assign({}, options, {
            method: 'POST',
            body: formData
        });

        const handler = responseHandler.bind(this, dispatch);

        return fetch(url, opt)
            .then(handler)
            .then(() => dispatch(fetchUserImages(username)), onReject);
    }
}

export function fetchUserImages(username) {
    return function(dispatch, getState) {
        const url = globals.urls.images + "?username=" + username;

        const handler = responseHandler.bind(this, dispatch);

        const onSuccess = (data) => {
            const normalized = data.map(normalizeImage);
            dispatch(recievedUserImages(normalized.reverse()));
        }

        return fetch(url, options)
            .then(handler)
            .then(onSuccess, onReject);
    }
}

export function deleteImages(username, imageIds = []) {
    return function(dispatch) {
        const ids = imageIds.join();
        const url = globals.urls.images + "?username=" + username + "&ids=" + ids;
        const opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        const handler = responseHandler.bind(this, dispatch);

        return fetch(url, opt)
            .then(handler)
            .then(() => dispatch(clearSelectedImageIds()), onReject)
            .then(() => dispatch(fetchUserImages(username)));
    }
}
