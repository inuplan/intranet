CREATE TABLE [dbo].[ThreadComments] (
    [ThreadID]  INT NOT NULL,
    [CommentID] INT NOT NULL,
    CONSTRAINT [PK_ThreadComments] PRIMARY KEY CLUSTERED ([ThreadID] ASC, [CommentID] ASC),
    CONSTRAINT [FK_ThreadComments_Comments] FOREIGN KEY ([CommentID]) REFERENCES [dbo].[Comments] ([ID]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_ThreadComments_ThreadTitles] FOREIGN KEY ([ThreadID]) REFERENCES [dbo].[ThreadTitles] ([ID])
);

