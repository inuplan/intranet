import * as T from '../constants/types'

export const setErrorTitle = (title) => {
    return {
        type: T.SET_ERROR_TITLE,
        title: title
    }
}

export const clearErrorTitle = () => {
    return {
        type: T.CLEAR_ERROR_TITLE
    }
}

export const setErrorMessage = (message) => {
    return {
        type: T.SET_ERROR_MESSAGE,
        message: message
    }
}

export const clearErrorMessage = () => {
    return {
        type: T.CLEAR_ERROR_MESSAGE
    }
}

export const clearError = () => {
    return (dispatch) => {
        dispatch(clearErrorTitle());
        dispatch(clearErrorMessage());
        dispatch(setHasError(false));
        return Promise.resolve();
    }
}

export const setHasError = (hasError) => {
    return {
        type: T.SET_HAS_ERROR,
        hasError: hasError
    }
}

export const setError = (error) => {
    return (dispatch) => {
        dispatch(setHasError(true));
        dispatch(setErrorTitle(error.title));
        dispatch(setErrorMessage(error.message));
        return Promise.resolve();
    }
}

export class HttpError {
    constructor(title, message) {
        this.title = title;
        this.message = message;
    }
}