import icons from '../constants/glyphicons'
import { Data } from '../interfaces/Data'

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

    export interface buttonTooltipProps {
        tooltip: string
        onClick: (e: React.MouseEvent<any>) => void
        icon: icons
        bsStyle: string
        active?: boolean
        mount: boolean
    }

    export interface commentControlsProps {
        contextId: number
        canEdit: (id: number) => boolean
        authorId: number
        commentId: number
        text: string
        skip: number
        take: number
        editComment: (commentId: number, contextId: number, text: string) => void
        deleteComment: (commentId: number, contextId: number) => void
        replyComment: (contextId: number, replyText: string, commentId: number) => void
    }

    export interface collapseTextAreaProps {
        show: boolean
        id: string
        value: string
        onChange: (e?: React.FormEvent<any>) => void
        toggle: (e?: React.MouseEvent<any>) => void
        save: (e?: React.MouseEvent<any>) => void
        saveText: string
        mount: boolean
    }

    export interface commentProps extends commentControlsProps {
        name: string
        replies: Data.Comment[]
        construct: (reply: Data.Comment) => JSX.Element
        edited: boolean
        postedOn: Date
    }

    export interface commentDeleted {
        replies: Data.Comment[]
        construct: (reply: Data.Comment) => JSX.Element
    }

    export interface commentForm {
        postHandle: (text: string) => void
    }

    export interface commentList extends commentProps {
        getName: (id: number) => string
        comments: Data.Comment[]
    }

    export interface breadcrumbItem {
        href?: string
        active?: boolean
    }
}