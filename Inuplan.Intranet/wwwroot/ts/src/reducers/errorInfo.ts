import { combineReducers } from "redux";
import { ActionType as T } from "../constants/actions";
import { reducer } from "../constants/types";
import { ErrorState } from "../interfaces/State";

export const title: reducer<string> = (state = "", action) => {
    switch (action.type) {
        case T.SET_ERROR_TITLE:
            return action.payload || "";
        default:
            return state;
    }
};

export const message: reducer<string> = (state = "", action) => {
    switch (action.type) {
        case T.SET_ERROR_MESSAGE:
            return action.payload || "";
        default:
            return state;
    }
};

const errorInfo = combineReducers<ErrorState>({
    title,
    message
});

export default errorInfo;