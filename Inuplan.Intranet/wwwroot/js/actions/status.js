import * as T from '../constants/types'
import { options } from '../constants/constants'
import { responseHandler, onReject } from '../utilities/utils'
import { HttpError, setError } from './error'
import fetch from 'isomorphic-fetch';
import { find } from 'underscore'

export function setUsedSpacekB(usedSpace) {
    return {
        type: T.SET_USED_SPACE_KB,
        usedSpace: usedSpace
    }
}

export function setTotalSpacekB(totalSpace) {
    return {
        type: T.SET_TOTAL_SPACE_KB,
        totalSpace: totalSpace
    }
}

export const fetchSpaceInfo = (url) => {
    return function(dispatch) {
        const handler = responseHandler.bind(this, dispatch);
        return fetch(url, options)
            .then(handler)
            .then(data => {
                const usedSpace = data.UsedSpaceKB;
                const totalSpace = data.SpaceQuotaKB;

                dispatch(setUsedSpacekB(usedSpace));
                dispatch(setTotalSpacekB(totalSpace));
            }, onReject);
    }
}