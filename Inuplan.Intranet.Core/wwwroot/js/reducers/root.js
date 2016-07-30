import { combineReducers } from 'redux'
import usersInfo from './users'
import imagesInfo from './images'
import commentsInfo from './comments'
import statusInfo from './status'
import whatsNewInfo from './whatsnew'

const rootReducer = combineReducers({
    usersInfo,
    imagesInfo,
    commentsInfo,
    statusInfo,
    whatsNewInfo
})

export default rootReducer