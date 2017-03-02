import icons from "../constants/glyphicons";
import { Data } from "../interfaces/Data";

export declare namespace Components {
    export interface UsernameProp {
        username: string;
    }

    export interface ErrorState {
        message: string;
        title: string;
    }

    export interface HasErrorProp {
        hasError: boolean;
    }

    export interface MainShell extends HasErrorProp, UsernameProp {
        error: Error;
    }

    export interface Error extends ErrorState {
        clearError: Function;
    }

    export interface ButtonTooltipProps {
        tooltip: string;
        onClick: (e: React.MouseEvent<any>) => void;
        icon: icons;
        bsStyle: string;
        active?: boolean;
        mount: boolean;
    }

    export interface CommentControlsProps extends CommentHandlers {
        contextId: number;
        canEdit: (id: number) => boolean;
        authorId: number;
        commentId: number;
        text: string;
    }

    interface CommentHandlers {
        editComment: (commentId: number, contextId: number, text: string) => void;
        deleteComment: (commentId: number, contextId: number) => void;
        replyComment: (contextId: number, replyText: string, commentId: number) => void;
    }

    export interface CollapseTextAreaProps {
        show: boolean;
        id: string;
        value: string;
        toggle: (e?: React.MouseEvent<any>) => void;
        onSubmit: (markdown: string) => void;
        submitText: string;
        mount: boolean;
    }

    export interface CommentProps extends CommentControlsProps {
        name: string;
        replies: Data.Comment[];
        construct?: (reply: Data.Comment) => JSX.Element;
        edited: boolean;
        postedOn: Date;
    }

    export interface CommentDeleted {
        replies: Data.Comment[];
        construct: (reply: Data.Comment) => JSX.Element;
    }

    export interface CommentForm {
        postHandle: (text: string) => void;
    }

    export interface CommentList extends CommentHandlers {
        getName: (id: number) => string;
        comments: Data.Comment[];
        contextId: number;
        canEdit: (id: number) => boolean;
        skip: number;
        take: number;
    }

    export interface BreadcrumbItem {
        href?: string;
        active?: boolean;
    }

    interface ImageHandlers {
        addSelectedImageId: (id: number) => void;
        removeSelectedImageId: (id: number) => void;
        imageIsSelected: (checkId: number) => boolean;
        username: string;
        canEdit: boolean;
    }

    export interface Image extends ImageHandlers {
        image: Data.Image;
    }

    export interface ImageList extends ImageHandlers {
        images: Data.Image[];
    }

    export interface UserList {
        users: Data.User[];
    }

    export interface User {
        username: string;
        userId: number;
        firstName: string;
        lastName: string;
        email: string;
        profileUrl: string;
        roles: Data.Role[];
    }
}