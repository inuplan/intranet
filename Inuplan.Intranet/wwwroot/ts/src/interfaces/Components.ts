export declare namespace Components {
    export interface UsernameProp {
        username: string
    }

    export interface ErrorState {
        message: string
        title: string
    }

    export interface HasErrorProp {
        hasError: boolean
    }

    export interface MainShell extends HasErrorProp, UsernameProp {
        error: Error
    }

    export interface Error extends ErrorState {
        clearError: Function
    }
}