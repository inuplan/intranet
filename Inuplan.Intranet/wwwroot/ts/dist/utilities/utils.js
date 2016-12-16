import { setError } from '../actions/error';
/// T: The element type, in the array
/// V: The value type, saved in the associative array
export const objMap = (arr, key, val) => {
    const obj = arr.reduce((res, item) => {
        const k = key(item);
        const v = val(item);
        res[k] = v;
        return res;
    }, {});
    return obj;
};
export const put = (obj, key, value) => {
    let kv = Object.assign({}, obj);
    kv[key] = value;
    return kv;
};
export const options = {
    mode: "cors",
    credentials: "include"
};
export const responseHandler = (dispatch) => (onSuccess) => (response) => {
    if (response.ok)
        return onSuccess(response);
    else {
        switch (response.status) {
            case 400:
                dispatch(setError({ title: "400 Bad Request", message: "The request was not well-formed" }));
                break;
            case 404:
                dispatch(setError({ title: "404 Not Found", message: "Could not find resource" }));
                break;
            case 408:
                dispatch(setError({ title: "408 Request Timeout", message: "The server did not respond in time" }));
                break;
            case 500:
                dispatch(setError({ title: "500 Server Error", message: "Something went wrong with the API-server" }));
                break;
            default:
                dispatch(setError({ title: "Oops", message: "Something went wrong!" }));
                break;
        }
        const message = `${response.status} - ${response.statusText}. URL: ${response.url}`;
        throw new Error(message);
    }
};
