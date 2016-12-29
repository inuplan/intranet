import { ActionType } from "../constants/actions";
import { General } from "../interfaces/General";
import { ErrorState, Root } from "../interfaces/State";
import { Dispatch } from "redux";

export const setHasError = (hasError: boolean): General.Action<boolean> => {
    return {
        type: ActionType.SET_HAS_ERROR,
        payload: hasError
    };
};

export const setErrorTitle = (title: string): General.Action<string> => {
    return {
        type: ActionType.SET_ERROR_TITLE,
        payload: title
    };
};

export const clearErrorTitle = () => {
    return {
        type: ActionType.CLEAR_ERROR_TITLE
    };
};

export const clearErrorMessage = () => {
    return {
        type: ActionType.CLEAR_ERROR_MESSAGE
    };
};

export const setErrorMessage = (message: string): General.Action<string> => {
    return {
        type: ActionType.SET_ERROR_MESSAGE,
        payload: message
    };
};

export const setError = (error: ErrorState) => {
    return (dispatch: Dispatch<Root>) => {
        dispatch(setHasError(true));
        dispatch(setErrorTitle(error.title));
        dispatch(setErrorMessage(error.message));
        return Promise.resolve();
    };
};

export const clearError = () => {
    return (dispatch: Dispatch<Root>) => {
        dispatch(clearErrorTitle());
        dispatch(clearErrorMessage());
        dispatch(setHasError(false));
        return Promise.resolve();
    };
};