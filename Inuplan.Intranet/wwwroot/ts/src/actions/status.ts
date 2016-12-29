import { ActionType as T } from "../constants/actions";
import { responseHandler, options } from "../utilities/utils";
import * as fetch from "isomorphic-fetch";
import { General } from "../interfaces/General";
import { fetchResult } from "../constants/types";

export const setUsedSpacekB = (usedSpace: number): General.Action<number> => {
    return {
        type: T.SET_USED_SPACE_KB,
        payload: usedSpace
    };
};

export const setTotalSpacekB = (totalSpace: number): General.Action<number> => {
    return {
        type: T.SET_TOTAL_SPACE_KB,
        payload: totalSpace
    };
};

export const fetchSpaceInfo = (url: string): fetchResult<any, void> => {
    return (dispatch) => {
        const handler = responseHandler<{UsedSpaceKB: number, SpaceQuotaKB: number}>(dispatch)(r => r.json());
        return fetch(url, options)
            .then(handler)
            .then(data => {
                const usedSpace = data.UsedSpaceKB;
                const totalSpace = data.SpaceQuotaKB;

                dispatch(setUsedSpacekB(usedSpace));
                dispatch(setTotalSpacekB(totalSpace));
            });
    };
};