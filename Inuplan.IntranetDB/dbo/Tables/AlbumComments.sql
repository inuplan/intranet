CREATE TABLE [dbo].[AlbumComments] (
    [AlbumID]   INT NOT NULL,
    [CommentID] INT NOT NULL,
    CONSTRAINT [PK_AlbumComments] PRIMARY KEY CLUSTERED ([AlbumID] ASC, [CommentID] ASC),
    CONSTRAINT [FK_AlbumComments_Albums] FOREIGN KEY ([AlbumID]) REFERENCES [dbo].[Albums] ([ID]),
    CONSTRAINT [FK_AlbumComments_Comments] FOREIGN KEY ([CommentID]) REFERENCES [dbo].[Comments] ([ID]) ON DELETE CASCADE ON UPDATE CASCADE
);

