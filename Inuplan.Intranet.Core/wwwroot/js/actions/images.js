import fetch from 'isomorphic-fetch';
import * as T from '../constants/types'
import { options } from '../constants/constants'
import { addUser } from './users'
import { normalizeImage } from '../utilities/utils'
import { HttpError, setError } from './error'
import { objMap, responseHandler, onReject } from '../utilities/utils'
import { find } from 'underscore'

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

export function addImage(img) {
    return {
        type: T.ADD_IMAGE,
        key: img.ImageID,
        val: img
    };
}

export function removeImage(id) {
    return {
        type: T.REMOVE_IMAGE,
        key: id
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

export const incrementCommentCount = (imageId) => {
    return {
        type: T.INCR_IMG_COMMENT_COUNT,
        key: imageId
    }
}

export const decrementCommentCount = (imageId) => {
    return {
        type: T.DECR_IMG_COMMENT_COUNT,
        key: imageId
    }
}

export function deleteImage(id, username) {
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

export function uploadImage(username, formData, onSuccess, onError) {
    return function(dispatch) {
        const url = globals.urls.images + "?username=" + username;
        const opt = Object.assign({}, options, {
            method: 'POST',
            body: formData
        });

        const handler = responseHandler.bind(this, dispatch);

        return fetch(url, opt)
            .then(handler)
            .then(onSuccess, onError);
    }
}

export function fetchUserImages(username) {
    return function(dispatch, getState) {
        const url = globals.urls.images + "?username=" + username;

        const handler = responseHandler.bind(this, dispatch);

        const onSuccess = (data) => {
            const normalized = data.map(normalizeImage).reverse();
            const obj = objMap(normalized, (img) => img.ImageID, (img) => img);
            dispatch(recievedUserImages(obj));
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

export function setImageOwner(username) {
    return function(dispatch, getState) {
        // Lazy evaluation
        const findOwner = () => {
            return find(getState().usersInfo.users, (user) => {
                return user.Username == username;
            });
        }

        let owner = findOwner();

        if(owner) {
            const ownerId = owner.ID;
            dispatch(setImagesOwner(ownerId));
            return Promise.resolve();
        }
        else {
            var url = globals.urls.users + '?username=' + username;
            const handler = responseHandler.bind(this, dispatch);
            return fetch(url, options)
                .then(handler)
                .then(user => dispatch(addUser(user)), onReject)
                .then(() => {
                    owner = findOwner();
                    dispatch(setImagesOwner(owner.ID));
                });
        }
    }
}

export function fetchSingleImage(id) {
    return function(dispatch, getState) {
        const url = globals.urls.images + "/getbyid?id=" + id;
        const handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(img => {
                if(!img) return;
                const normalizedImage = normalizeImage(img);
                dispatch(addImage(normalizedImage));
            });
    }
}
