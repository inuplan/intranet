import { Dispatch } from 'redux'
import { General } from '../interfaces/General'

export type fetchResult<D, R> = (dispatch: Dispatch<D>) => Promise<R>
export type myReducer<S, P> = (state: S, action: General.Action<P>) => S
export type reducer<S> = (state: S, action: General.Action<S>) => S