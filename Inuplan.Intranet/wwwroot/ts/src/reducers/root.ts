import { combineReducers } from 'redux'
import usersInfo from './usersInfo'
import imagesInfo from './imagesInfo'
import { Root } from '../interfaces/State'

const rootReducer = combineReducers<Root>({
    usersInfo,
    imagesInfo
})

export default rootReducer