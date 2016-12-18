import { General as G } from '../interfaces/General'
import { Root } from '../interfaces/State'
import { setError } from '../actions/error'
import { Dispatch } from 'redux'

/// T: The element type, in the array
/// V: The value type, saved in the associative array
export const objMap = <T, V>(arr: T[], key: G.FunctionGeneric<T, number>, val: G.FunctionGeneric<T, V> ): G.KeyValue<V> => {
    const obj = arr.reduce((res: G.KeyValue<V>, item: T) => {
        const k = key(item);
        const v = val(item);
        res[k] = v;
        return res;
    }, {});

    return obj
}

export const put = <V>(obj: G.KeyValue<V>, key: number, value: V): G.KeyValue<V> => {
    let kv: G.KeyValue<V> = Object.assign({}, obj);
    kv[key] = value;
    return kv;
}

export const options: RequestInit = {
    mode: "cors",
    credentials: "include"
}

export const responseHandler =  <T>(dispatch:Dispatch<Root>) => (onSuccess: (r:IResponse) => Promise<T>) => (response: IResponse) => {
    if(response.ok) return onSuccess(response);
    else {
        switch(response.status) {
            case 400:
                dispatch(setError({ title: "400 Bad Request", message: "The request was not well-formed"}));
                break;
            case 404:
                dispatch(setError({ title: "404 Not Found", message: "Could not find resource"}));
                break;
            case 408:
                dispatch(setError({ title: "408 Request Timeout", message: "The server did not respond in time"}));
                break;
            case 500:
                dispatch(setError({ title: "500 Server Error", message: "Something went wrong with the API-server"}));
                break;
            default:
                dispatch(setError({ title: "Oops", message: "Something went wrong!"}));
                break;
        }
    }
}

export const union = <T>(arr1: T[], arr2:T[], equalityFunc: (v1:T, v2:T) => boolean): T[] => {
    var result = arr1.concat(arr2);
    // Better way: loop over 1 array and check
    // if corresponding item exist in the other array using equality function
    // If not exists: add item to array 2

    for (var i = 0; i < result.length; i++) {
        for (var j = i+1; j < result.length; j++) {
            if (equalityFunc(result[i], result[j])) {
                result.splice(j, 1);
                j--;
            }
        }
    }

    return result;
}