import { ActionType } from '../constants/Actions';
export const setHasError = (hasError) => {
    return {
        type: ActionType.SET_HAS_ERROR,
        payload: hasError
    };
};
export const setErrorTitle = (title) => {
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
export const setErrorMessage = (message) => {
    return {
        type: ActionType.SET_ERROR_MESSAGE,
        payload: message
    };
};
export const setError = (error) => {
    return (dispatch) => {
        dispatch(setHasError(true));
        dispatch(setErrorTitle(error.title));
        dispatch(setErrorMessage(error.message));
        return Promise.resolve();
    };
};
export const clearError = () => {
    return (dispatch) => {
        dispatch(clearErrorTitle());
        dispatch(clearErrorMessage());
        dispatch(setHasError(false));
        return Promise.resolve();
    };
};
