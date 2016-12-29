import { combineReducers } from "redux";
import usersInfo from "./usersInfo";
import imagesInfo from "./imagesInfo";
import commentsInfo from "./commentsInfo";
import forumInfo from "./forumInfo";
import statusInfo from "./statusInfo";
import whatsNewInfo from "./whatsNewInfo";
import { Root } from "../interfaces/State";

const rootReducer = combineReducers<Root>({
    usersInfo,
    imagesInfo,
    commentsInfo,
    forumInfo,
    statusInfo,
    whatsNewInfo
});

export default rootReducer;