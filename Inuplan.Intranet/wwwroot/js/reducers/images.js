import { combineReducers } from 'redux'
import * as T from '../constants/types'
import { filter, omit, values } from 'underscore'
import { put, union } from '../utilities/utils'

const ownerId = (state = -1, action) => {
    switch (action.type) {
        case T.SET_IMAGES_OWNER:
            return action.id || -1;
        default:
            return state;
    }
}

const images = (state = {}, action) => {
    switch (action.type) {
        case T.ADD_IMAGE:
            const obj = put(state, action.key, action.val);
            return obj;
        case T.RECIEVED_USER_IMAGES:
            return action.images;
        case T.REMOVE_IMAGE:
            const removed = omit(state, action.key);
            return removed;
        case T.INCR_IMG_COMMENT_COUNT:
            return values(state).map(img => {
                if(img.ImageID == action.key) {
                    img.CommentCount++;
                }
                return img;
            });
        case T.DECR_IMG_COMMENT_COUNT:
            return values(state).map(img => {
                if(img.ImageID == action.key) {
                    img.CommentCount--;
                }
                return img;
            });
        default:
            return state;
    }
}

const selectedImageId = (state = -1, action) => {
    switch (action.type) {
        case T.SET_SELECTED_IMG:
            return action.id || -1;
        default:
            return state;
    }
}

const selectedImageIds = (state = [], action) => {
    switch (action.type) {
        case T.ADD_SELECTED_IMAGE_ID:
            return union(state, [action.id], (id1, id2) => id1 == id2);
        case T.REMOVE_SELECTED_IMAGE_ID:
            return filter(state, (id) => id != action.id);
        case T.CLEAR_SELECTED_IMAGE_IDS:
            return [];
        default:
            return state;
    }
}

const imagesInfo = combineReducers({
    ownerId,
    images,
    selectedImageId,
    selectedImageIds
})

export default imagesInfo;
