import { Dispatch } from 'redux'

export type fetchResult<D, R> = (dispatch: Dispatch<D>) => Promise<R>