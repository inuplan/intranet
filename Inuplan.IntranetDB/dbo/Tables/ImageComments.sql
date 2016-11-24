CREATE TABLE [dbo].[ImageComments] (
    [ImageID]   INT NOT NULL,
    [CommentID] INT NOT NULL,
    CONSTRAINT [PK_ImageComments] PRIMARY KEY CLUSTERED ([ImageID] ASC, [CommentID] ASC),
    CONSTRAINT [FK_ImageComments_Comments] FOREIGN KEY ([CommentID]) REFERENCES [dbo].[Comments] ([ID]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_ImageComments_Images] FOREIGN KEY ([ImageID]) REFERENCES [dbo].[Images] ([ID])
);

