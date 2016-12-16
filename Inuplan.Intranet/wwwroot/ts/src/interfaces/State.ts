import { General } from './General'
import { Data } from './Data'

export interface Root {
    usersInfo: UsersState,
    imagesInfo: ImagesState,
    commentsInfo: CommentsState,
    statusInfo: StatusState,
    whatsNewInfo: WhatsNewState,
    forumInfo: ForumState
}

interface UsersState {
    currentUserId: number
    users: General.KeyValue<Data.User>
}

interface ImagesState {
    ownerId: number,
    images: General.KeyValue<Data.Image>,
    selectedImageId: number,
    selectedImageIds: number[]
}

interface CommentsState {
    comments: Data.Comment[],
    skip: number,
    take: number,
    page: number,
    totalPages: number,
    focusedComment: number
}

export interface ErrorState {
    title: string,
    message: string
}

interface SpaceState {
    usedSpacekB: number,
    totalSpacekB: number
}

interface StatusState {
    hasError: boolean,
    errorInfo: ErrorState,
    spaceInfo: SpaceState,
    message: string,
    done: boolean
}

interface WhatsNewState {
    skip: number,
    take: number,
    page: number,
    totalPages: number,
    items: Data.WhatsNew[]
}

interface ForumTitlesState {
    titles: Data.ForumTitle[]
    skip: number
    take: number
    page: number
    totalPages: number
    selectedThread: number
}

interface ForumState {
    titlesInfo: ForumTitlesState
    postContent: string
}