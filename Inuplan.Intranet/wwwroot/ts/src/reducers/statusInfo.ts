import { combineReducers } from "redux";
import { ActionType as T } from "../constants/Actions";
import { StatusState, SpaceState } from "../interfaces/State";
import errorInfo from "./errorInfo";
import { reducer } from "../constants/types";

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

export const done: reducer<boolean> = (state = true, action) => {
    switch (action.type) {
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
    done
});

export default statusInfo;