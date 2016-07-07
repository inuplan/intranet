import { combineReducers } from 'redux'
import usersInfo from './users'
import imagesInfo from './images'
import commentsInfo from './comments'
import statusInfo from './status'

const rootReducer = combineReducers({
    usersInfo,
    imagesInfo,
    commentsInfo,
    statusInfo
})

export default rootReducer