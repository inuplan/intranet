import { ActionType } from '../constants/Actions'
import { Action as ActionRedux } from 'redux'

export declare namespace General {
    export interface KeyValue<V> {
        [index: number] : V
    }

    export interface Action<T> extends ActionRedux {
        type: ActionType
        payload: T
    }

    export type FunctionGeneric<T,R> = (T:T) => R;
}

export declare var globals: IGlobals;

interface IGlobals {
    urls: urls
    currentUsername: string
}

interface urls {
    users: string
    images: string
    imagecomments: string
    whatsnew: string
    forumtitle: string
    forumpost: string
    forumcomments: string
    diagnostics: string
    employeeHandbook: string
    c5Search: string
    websocket: {
        latest: string
    }
}