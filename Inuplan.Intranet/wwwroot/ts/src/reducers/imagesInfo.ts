import { combineReducers } from "redux";
import { Data } from "../interfaces/Data";
import { General } from "../interfaces/General";
import { ActionType } from "../constants/Actions";
import { put } from "../utilities/utils";
import { filter, omit } from "underscore";
import { ImagesState } from "../interfaces/State";

type ImageReducer = General.KeyValue<Data.Image>;
type Action<T> = General.Action<T>;

const ownerId = (state: number = -1, action: Action<number>): number => {
    switch (action.type) {
        case ActionType.SET_IMAGES_OWNER:
        {
            return action.payload || -1;
        }
        default:
        {
            return state;
        }
    }
};

const images = (state: ImageReducer = {}, action: Action<ImageReducer | Partial<Data.Image>>): ImageReducer => {
    switch (action.type) {
        case ActionType.ADD_IMAGE:
        {
            const image = (<Data.Image>action.payload);
            return put(state, image.ImageID, image);
        }
        case ActionType.RECIEVED_USER_IMAGES:
        {
            return (<ImageReducer>action.payload);
        }
        case ActionType.REMOVE_IMAGE:
        {
            const id = (<Data.Image>action.payload).ImageID;
            const removed: ImageReducer = omit(state, id.toString());
            return removed;
        }
        case ActionType.INCR_IMG_COMMENT_COUNT:
        {
            const id = (<Data.Image>action.payload).ImageID;
            const image = state[id];
            image.CommentCount++;

            const result = put(state, id, image);
            return result;
        }
        case ActionType.DECR_IMG_COMMENT_COUNT:
        {
            const id = (<Data.Image>action.payload).ImageID;
            const image = state[id];
            image.CommentCount--;

            const result = put(state, id, image);
            return result;
        }
        default:
        {
            return state;
        }
    }
};

const selectedImageId = (state: number = -1, action: Action<number>): number => {
    switch (action.type) {
        case ActionType.SET_SELECTED_IMG:
        {
            return action.payload || -1;
        }
        default:
        {
            return state;
        }
    }
};

const selectedImageIds = (state: number[] = [], action: Action<number[] | number>): number[] => {
    switch (action.type) {
        case ActionType.ADD_SELECTED_IMAGE_ID:
        {
            const merge = state.concat(action.payload);
            const result = [...new Set(merge)];
            return result;
        }
        case ActionType.REMOVE_SELECTED_IMAGE_ID:
        {
            return filter(state, (id) => id !== action.payload);
        }
        case ActionType.CLEAR_SELECTED_IMAGE_IDS:
        {
            return [];
        }
        default:
        {
            return state;
        }
    }
};

const imagesInfo = combineReducers<ImagesState>({
    ownerId,
    images,
    selectedImageId,
    selectedImageIds
});

export default imagesInfo;