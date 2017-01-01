// C# type enums
export const enum WhatsNewType {
    Image = 1,
    Comment = 2,
    ForumPost = 4,
}

export declare namespace Data {
    // UserDTO
    export interface User {
        ID: number;
        DisplayName: string;
        Username: string;
        FirstName: string;
        LastName: string;
        Email: string;
        ProfileImage: string;
        IsAdmin: boolean;
        Role: Role[];
    }

    export interface Role {
        ID: number;
        Name: string;
    }

    // state: images type
    export interface Image {
        ImageID: number;
        Filename: string;
        Extension: string;
        OriginalUrl: string;
        PreviewUrl: string;
        ThumbnailUrl: string;
        CommentCount: number;
        Description: string;
        Uploaded: Date;
    }

    // state: comment type
    export interface Comment {
        CommentID: number;
        AuthorID: number;
        Deleted: boolean;
        PostedOn: Date;
        Text: string;
        Replies: Comment[];
        Edited: boolean;
    }

    // state: forumtitle type
    export interface ForumTitle {
        ID: number;
        IsPublished: boolean;
        Sticky: boolean;
        CreatedOn: Date;
        AuthorID: number;
        Deleted: boolean;
        IsModified: boolean;
        Title: string;
        LastModified: Date;
        LatestComment: Comment;
        CommentCount: number;
        ViewedBy: number[];
    }

    // state: whatsnew type
    export interface WhatsNew {
        ID: number;
        Type: WhatsNewType;
        Item: WhatsNewComment | WhatsNewImage | WhatsNewForumPost;
        On: Date;
        AuthorID: number;
    }

    interface WhatsNewImage {
        ImageID: number;
        Extension: string;
        Filename: string;
        OriginalUrl: string;
        PreviewUrl: string;
        ThumbnailUrl: string;
        Description: string;
        Uploaded: Date;
    }

    interface WhatsNewComment {
        ID: number;
        Text: string;
        ImageID: number;
        ImageUploadedBy: User;
        Filename: string;
    }

    interface WhatsNewForumPost {
        ID: number;
        Title: string;
        Text: string;
        Sticky: boolean;
        CommentCount: number;
    }

    export namespace Raw {
        export interface Pagination<T> {
            CurrentPage: number;
            CurrentItems: T[];
            TotalPages: number;
        }

        export interface WhatsNewItem {
            ID: number;
            On: Date;
            Type: WhatsNewType;
            Item: ImageDTO | WhatsNewImageCommentDTO | ThreadPostContentDTO;
        }

        export interface WhatsNewImageCommentDTO {
            ID: number;
            ImageID: number;
            Deleted: boolean;
            Author: User;
            Text: string;
            ImageUploadedBy: User;
            Filename: string;
        }

        export interface ImageDTO {
            Author: User;
            ImageID: number;
            Uploaded: Date;
            Filename: string;
            Extension: string;
            OriginalUrl: string;
            PreviewUrl: string;
            ThumbnailUrl: string;
            CommentCount: number;
            Description: string;
        }

        export interface ThreadPostContentDTO {
            Header: ThreadPostTitleDTO;
            ThreadID: number;
            Text: string;
        }

        export interface ThreadPostTitleDTO {
            ID: number;
            IsPublished: boolean;
            Sticky: boolean;
            CreatedOn: Date;
            Author: User;
            Deleted: boolean;
            IsModified: boolean;
            Title: string;
            LatestComment: Comment;
            LastModified: Date;
            CommentCount: number;
            ViewedBy: User[];
        }

        export interface Comment {
            ParentID: number;
            ID: number;
            ContextID: number;
            Deleted: boolean;
            PostedOn: Date;
            Author: User;
            Text: string;
            Edited: boolean;
            Replies?: Comment[];
        }

        namespace Models {
            export interface ThreadPostTitle {
                ThreadID: number;
                IsPublished: boolean;
                Sticky: boolean;
                CreatedOn: Date;
                Author: User;
                Deleted: boolean;
                IsModified: boolean;
                Title: string;
                LastModified: Date;
                LatestComment: number;
                ViewedBy: Data.User[];
            }

            export interface ThreadPostContent {
                Header: Partial<ThreadPostTitle>;
                ThreadID: number;
                Text: string;
            }
        }
    }
}
