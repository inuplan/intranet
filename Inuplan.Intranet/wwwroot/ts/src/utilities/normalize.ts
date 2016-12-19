import { Data } from '../interfaces/Data'

export const normalizeLatest = (latest: Data.Raw.WhatsNewItem): Data.WhatsNew => {
    let item = null;
    let authorId = -1;
    if(latest.Type == Data.WhatsNewType.Image) {
        // Image - omit Author and CommentCount
        const image = <Data.Raw.ImageDTO>latest.Item;
        item = {
            Extension: image.Extension,
            Filename: image.Filename,
            ImageID: image.ImageID,
            OriginalUrl: image.OriginalUrl,
            PreviewUrl: image.PreviewUrl,
            ThumbnailUrl: image.ThumbnailUrl,
            Uploaded: image.Uploaded
        };
        authorId = image.Author.ID;
    }
    else if (latest.Type == Data.WhatsNewType.Comment) {
        // Comment - omit Author and Deleted and Replies
        const comment = <Data.Raw.WhatsNewImageCommentDTO>latest.Item;
        item = {
            ID: comment.ID,
            Text: comment.Text,
            ImageID: comment.ImageID,
            ImageUploadedBy: comment.ImageUploadedBy,
            Filename: comment.Filename
        };
        authorId = comment.Author.ID;
    }
    else if (latest.Type == Data.WhatsNewType.ForumPost) {
        const post = <Data.Raw.ThreadPostContentDTO>latest.Item;
        item = {
            ID: post.ThreadID,
            Title: post.Header.Title,
            Text: post.Text,
            Sticky: post.Header.Sticky,
            CommentCount: post.Header.CommentCount
        }
        authorId = post.Header.Author.ID;
    }

    return {
        ID: latest.ID,
        Type: latest.Type,
        Item: item,
        On: latest.On,
        AuthorID: authorId,
    }
}

export const normalizeImage = (img: Data.Raw.ImageDTO): Data.Image => {
    return {
        ImageID: img.ImageID,
        Filename: img.Filename,
        Extension: img.Extension,
        OriginalUrl: img.OriginalUrl,
        PreviewUrl: img.PreviewUrl,
        ThumbnailUrl: img.ThumbnailUrl,
        CommentCount: img.CommentCount,
        Uploaded: new Date(img.Uploaded),
    };
}

export const normalizeThreadTitle = (title: Data.Raw.ThreadPostTitleDTO): Data.ForumTitle => {
    const viewedBy = title.ViewedBy.map(user => user.ID);
    const latestComment = title.LatestComment ? normalizeComment(title.LatestComment) : null;
    return {
        ID: title.ID,
        IsPublished: title.IsPublished,
        Sticky: title.Sticky,
        CreatedOn: title.CreatedOn,
        AuthorID: title.Author.ID,
        Deleted: title.Deleted,
        IsModified: title.IsModified,
        Title: title.Title,
        LastModified: title.LastModified,
        LatestComment: latestComment,
        CommentCount: title.CommentCount,
        ViewedBy: viewedBy,
    }
}

export const normalizeComment = (comment: Data.Raw.Comment): Data.Comment => {
    let r = comment.Replies ? comment.Replies : [];
    const replies = r.map(normalizeComment);
    const authorId = (comment.Deleted) ? -1 : comment.Author.ID;
    return {
        CommentID: comment.ID,
        AuthorID: authorId,
        Deleted: comment.Deleted,
        PostedOn: comment.PostedOn,
        Text: comment.Text,
        Replies: replies,
        Edited: comment.Edited
    }
}