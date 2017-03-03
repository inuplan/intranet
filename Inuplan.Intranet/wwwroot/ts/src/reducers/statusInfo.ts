import { combineReducers } from "redux";
import { ActionType as T } from "../constants/Actions";
import { StatusState, SpaceState } from "../interfaces/State";
import errorInfo from "./errorInfo";
import { reducer } from "../constants/types";
import { Stack } from "immutable";

export const hasError: reducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case T.SET_HAS_ERROR:
            return action.payload;
        default:
            return state;
    }
};

export const message: reducer<string> = (state = "", action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export const loadStack: reducer<Stack<boolean>> = (state = Stack<boolean>(), action) => {
    switch (action.type) {
        case T.START_LOADING: {
            const result = state.push(true);
            return result;
        }
        case T.END_LOADING: {
            const result = state.pop();
            return result;
        }
        default:
            return state;
    }
};

export const usedSpacekB: reducer<number> = (state = 0, action) => {
    switch (action.type) {
        case T.SET_USED_SPACE_KB:
            return action.payload;
        default:
            return state;
    }
};

export const totalSpacekB: reducer<number> = (state = -1, action) => {
    switch (action.type) {
        case T.SET_TOTAL_SPACE_KB:
            return action.payload;
        default:
            return state;
    }
};

export const spaceInfo = combineReducers<SpaceState>({
    usedSpacekB,
    totalSpacekB
});

const statusInfo = combineReducers<StatusState>({
    hasError,
    errorInfo,
    spaceInfo,
    message,
    loadStack
});

export default statusInfo;