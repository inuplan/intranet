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

    export interface commentControlsProps extends commentHandlers {
        contextId: number
        canEdit: (id: number) => boolean
        authorId: number
        commentId: number
        text: string
        skip: number
        take: number
    }

    interface commentHandlers {
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
        construct?: (reply: Data.Comment) => JSX.Element
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

    export interface commentList extends commentHandlers {
        getName: (id: number) => string
        comments: Data.Comment[]
        contextId: number
        canEdit: (id: number) => boolean
        skip: number
        take: number
    }

    export interface breadcrumbItem {
        href?: string
        active?: boolean
    }

    interface imageHandlers {
        addSelectedImageId: (id: number) => void
        removeSelectedImageId: (id: number) => void
        imageIsSelected: (checkId: number) => boolean
        username: string
        canEdit: boolean
    }
    
    export interface image extends imageHandlers {
        image: Data.Image
    }

    export interface imageList extends imageHandlers {
        images: Data.Image[]
    }
    
    export interface userList {
        users: Data.User[]
    }

    export interface user {
        username: string
        userId: number
        firstName: string
        lastName: string
        email: string
        profileUrl: string
        roles: Data.Role[]
    }
}