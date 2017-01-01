import { combineReducers } from "redux";
import { Data } from "../interfaces/Data";
import { ActionType as T } from "../constants/Actions";
import { WhatsNewState } from "../interfaces/State";
import { reducer } from "../constants/types";

const skip: reducer<number> = (state = 0, action) => {
    switch (action.type) {
        case T.SET_SKIP_WHATS_NEW:
            return action.payload || 0;
        default:
            return state;
    }
};

const take: reducer<number> = (state = 10, action) => {
    switch (action.type) {
        case T.SET_TAKE_WHATS_NEW:
            return action.payload || 10;
        default:
            return state;
    }
};

const page: reducer<number> = (state = 1, action) => {
    switch (action.type) {
        case T.SET_PAGE_WHATS_NEW:
            return action.payload || 1;
        default:
            return state;
    }
};

const totalPages: reducer<number> = (state = 0, action) => {
    switch (action.type) {
        case T.SET_TOTAL_PAGES_WHATS_NEW:
            return action.payload || 0;
        default:
            return state;
    }
};

const items: reducer<Data.WhatsNew[]> = (state = [], action) => {
    switch (action.type) {
        case T.SET_LATEST:
            return action.payload || [];
        default:
            return state;
    }
};

const whatsNewInfo = combineReducers<WhatsNewState>({
    skip,
    take,
    page,
    totalPages,
    items
});

export default whatsNewInfo;