import { General } from "./General";
import { Data } from "./Data";

export interface Root {
    usersInfo: UsersState;
    imagesInfo: ImagesState;
    commentsInfo: CommentsState;
    statusInfo: StatusState;
    whatsNewInfo: WhatsNewState;
    forumInfo: ForumState;
}

export interface UsersState {
    currentUserId: number;
    users: General.KeyValue<Data.User>;
}

export interface ImagesState {
    ownerId: number;
    images: General.KeyValue<Data.Image>;
    selectedImageId: number;
    selectedImageIds: number[];
}

export interface CommentsState {
    comments: Data.Comment[];
    skip: number;
    take: number;
    page: number;
    totalPages: number;
    focusedComment: number;
}

export interface ErrorState {
    title: string;
    message: string;
}

export interface SpaceState {
    usedSpacekB: number;
    totalSpacekB: number;
}

export interface StatusState {
    hasError: boolean;
    errorInfo: ErrorState;
    spaceInfo: SpaceState;
    message: string;
    done: boolean;
}

export interface WhatsNewState {
    skip: number;
    take: number;
    page: number;
    totalPages: number;
    items: Data.WhatsNew[];
}

export interface ForumTitlesState {
    titles: Data.ForumTitle[];
    skip: number;
    take: number;
    page: number;
    totalPages: number;
    selectedThread: number;
}

export interface ForumState {
    titlesInfo: ForumTitlesState;
    postContent: string;
}