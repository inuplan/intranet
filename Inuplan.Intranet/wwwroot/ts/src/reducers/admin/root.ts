import { combineReducers } from "redux";
import usersInfo from "../usersInfo";
import { AdminState } from "../../interfaces/AdminState";

const rootReducer = combineReducers<AdminState>({
    usersInfo,
});

export default rootReducer;