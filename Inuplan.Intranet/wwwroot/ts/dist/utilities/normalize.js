import { Data } from '../interfaces/Data';
export const normalizeLatest = (latest) => {
    let item = null;
    let authorId = -1;
    if (latest.Type == Data.WhatsNewType.Image) {
        // Image - omit Author and CommentCount
        const image = latest.Item;
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
        const comment = latest.Item;
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
        const post = latest.Item;
        item = {
            ID: post.ThreadID,
            Title: post.Header.Title,
            Text: post.Text,
            Sticky: post.Header.Sticky,
            CommentCount: post.Header.CommentCount
        };
        authorId = post.Header.Author.ID;
    }
    return {
        ID: latest.ID,
        Type: latest.Type,
        Item: item,
        On: latest.On,
        AuthorID: authorId,
    };
};
export const normalizeImage = (img) => {
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
};
