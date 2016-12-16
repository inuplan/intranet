import fetch from 'isomorphic-fetch';
import { ActionType } from '../constants/Actions'
//import { addUser } from './users'
import { objMap, responseHandler, options } from '../utilities/utils'
import { Dispatch } from 'redux'
import { Root } from '../interfaces/State'
import { globals, General } from '../interfaces/General'
import { Data } from '../interfaces/Data'
import { normalizeImage as normalize } from '../utilities/normalize'
import { Action as ReduxAction } from 'redux'

export const setImagesOwner = (id: number): General.Action<number> => {
    return {
        type: ActionType.SET_IMAGES_OWNER,
        payload: id
    };
}

export const recievedUserImages = (images: General.KeyValue<Data.Image>): General.Action<General.KeyValue<Data.Image>> => {
    return {
        type: ActionType.RECIEVED_USER_IMAGES,
        payload: images
    };
}

export const setSelectedImg = (id: number): General.Action<number> => {
    return {
        type: ActionType.SET_SELECTED_IMG,
        payload: id
    };
}

export const addImage = (img:Data.Image): General.Action<Data.Image> => {
    return {
        type: ActionType.ADD_IMAGE,
        payload: img
    };
}

export const removeImage = (id: number): General.Action<number> => {
    return {
        type: ActionType.REMOVE_IMAGE,
        payload: id
    };
}

export const addSelectedImageId = (id: number): General.Action<number> => {
    return {
        type: ActionType.ADD_SELECTED_IMAGE_ID,
        payload: id
    };
}

export const removeSelectedImageId = (id: number): General.Action<number> => {
    return {
        type: ActionType.REMOVE_SELECTED_IMAGE_ID,
        payload: id
    };
}

export const clearSelectedImageIds = (): ReduxAction => {
    return {
        type: ActionType.CLEAR_SELECTED_IMAGE_IDS,
    };
}

export const incrementCommentCount = (imageId: number): General.Action<number> => {
    return {
        type: ActionType.INCR_IMG_COMMENT_COUNT,
        payload: imageId
    }
}

export const decrementCommentCount = (imageId: number): General.Action<Readonly<number>> => {
    return {
        type: ActionType.DECR_IMG_COMMENT_COUNT,
        payload: imageId
    }
}

export const newImageFromServer = (image: Data.Raw.ImageDTO): General.Action<Data.Image> => {
    const normalized = normalize(image);
    return addImage(normalized);
}

export const deleteImage = (id: number, username: string) => {
    return (dispatch: Dispatch<Root>) => {
        const url = `${globals.urls.images}?username=${username}&id=${id}`;
        const opt = <RequestInit>Object.assign({}, options, {
            method: 'DELETE'
        });
        const handler = responseHandler(dispatch)((r) => r.json());
        const result = fetch(url, opt)
            .then(handler)
            .then(() => { dispatch(removeImage(id)); })
            .catch(reason => console.log(reason));

        return result;
    }
}

export const uploadImage = (username: string, formData: FormData, onSuccess: () => any, onError: (any) => any) => {
    return (dispatch) => {
        const url = globals.urls.images + "?username=" + username;
        const opt = Object.assign({}, options, {
            method: 'POST',
            body: formData
        });

        const handler: (IResponse) => void = responseHandler(dispatch)(r => null);

        return fetch(url, opt)
            .then(handler)
            .then(onSuccess, onError);
    }
}

export const fetchUserImages = (username: string) => {
    return (dispatch: Dispatch<Root>, getState: () => Root) => {
        const url = `${globals.urls.images}?username=${username}`;
        const handler: (IResponse) => Promise<Data.Raw.ImageDTO[]> = responseHandler(dispatch)(r => r.json())

        return fetch(url, options)
            .then(handler)
            .then(data => {
                const normalized = data.map(normalize).reverse();
                const obj = objMap<Data.Image, Data.Image>(normalized, (img) => img.ImageID, (img) => img);
                dispatch(recievedUserImages(obj));
            });
    }
}

export const deleteImages = (username: string, imageIds: number[] = []) => {
    return (dispatch: Dispatch<Root>) => {
        const ids = imageIds.join(",");
        const url = `${globals.urls.images}?username=${username}&ids=${ids}`;
        const opt = Object.assign({}, options, {
            method: 'DELETE'
        });

        const handler: (IResponse) => void = responseHandler(dispatch)(r => null)

        return fetch(url, opt)
            .then(handler)
            .then(() => { dispatch(clearSelectedImageIds()); })
            .then(() => { dispatch<any>(fetchUserImages(username)); });
    }
}

export const setImageOwner = (username: string) => {
    return (dispatch: Dispatch<Root>, getState: () => Root) => {
        // Lazy evaluation
        const findOwner = () => {
            const users = getState().usersInfo.users;
            let user: Data.User = null;
            for(var key in users) {
                user = users[key];
                if(user.Username = username) {
                    break;
                }
            }

            return user;
        }

        let owner = findOwner();

        if(owner) {
            const ownerId = owner.ID;
            dispatch(setImagesOwner(ownerId));
            return Promise.resolve();
        }
        else {
            const url = `${globals.urls.users}?username=${username}`;
            const handler: (IResponse) => Promise<Data.User> = responseHandler(dispatch)(r => r.json());
            return fetch(url, options)
                .then(handler)
                .then(user => { dispatch(addUser(user)); })
                .then(() => {
                    owner = findOwner();
                    dispatch(setImagesOwner(owner.ID));
                });
        }
    }
}

export const fetchSingleImage = (id: number) => {
    return (dispatch: Dispatch<Root>, getState: () => Root) => {
        const url = `${globals.urls.images}/getbyid?id=${id}`;
        const handler: (IResponse) => Promise<Data.Raw.ImageDTO> = responseHandler(dispatch)(r => r.json());
        return fetch(url, options)
            .then(handler)
            .then(img => {
                if(!img) return;
                const normalizedImage = normalize(img);
                dispatch(addImage(normalizedImage));
            });
    }
}
