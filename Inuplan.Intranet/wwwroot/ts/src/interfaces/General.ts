import { ActionType } from "../constants/Actions";
import { Action as ActionRedux } from "redux";

export declare namespace General {
    export interface KeyValue<V> {
        [index: number]: V;
    }

    export interface Action<T> extends ActionRedux {
        readonly type: ActionType;
        readonly payload: T;
    }

    export type FunctionGeneric<T, R> = (T: T) => R;
}