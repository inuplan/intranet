import { combineReducers } from 'redux'
import usersInfo from './users'
import imagesInfo from './images'
import commentsInfo from './comments'
import statusInfo from './status'
import whatsNewInfo from './whatsnew'
import forumInfo from './forum'

const rootReducer = combineReducers({
    usersInfo,
    imagesInfo,
    commentsInfo,
    statusInfo,
    whatsNewInfo,
    forumInfo
})

export default rootReducer