import { combineReducers } from 'redux'
import usersInfo from './usersInfo'
import { Root } from '../interfaces/State'

const rootReducer = combineReducers<Root>({
    usersInfo
})

export default rootReducer