import { ActionType } from '../constants/Actions'
import { Action as ActionRedux } from 'redux'

export declare namespace General {
    export interface KeyValue<V> {
        [index: number] : V
    }

    export interface Action<T> extends ActionRedux {
        readonly type: ActionType
        readonly payload: T
    }

    export type FunctionGeneric<T,R> = (T:T) => R;
}

export declare var globals: IGlobals;

interface IGlobals {
    readonly urls: urls
    readonly currentUsername: string
}

interface urls {
    readonly users: string
    readonly images: string
    readonly imagecomments: string
    readonly whatsnew: string
    readonly forumtitle: string
    readonly forumpost: string
    readonly forumcomments: string
    readonly diagnostics: string
    readonly employeeHandbook: string
    readonly c5Search: string
    readonly websocket: {
        readonly latest: string
    }
}