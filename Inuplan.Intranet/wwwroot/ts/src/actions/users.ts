import { ActionType } from '../constants/Actions'
import { Data } from '../interfaces/Data'
import { General } from '../interfaces/General'

export const addUser = (user: Data.User): General.Action<Data.User> => {
    return {
        type: ActionType.ADD_USER,
        payload: user
    };
}