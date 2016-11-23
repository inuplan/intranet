CREATE TABLE [dbo].[ThreadUserViews] (
    [ThreadID] INT NOT NULL,
    [UserID]   INT NOT NULL,
    CONSTRAINT [PK_ThreadUserViews] PRIMARY KEY CLUSTERED ([ThreadID] ASC, [UserID] ASC),
    CONSTRAINT [FK_ThreadUserViews_ThreadTitles] FOREIGN KEY ([ThreadID]) REFERENCES [dbo].[ThreadTitles] ([ID]) ON DELETE CASCADE,
    CONSTRAINT [FK_ThreadUserViews_Users] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([ID])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Thread read by user', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'ThreadUserViews', @level2type = N'CONSTRAINT', @level2name = N'FK_ThreadUserViews_ThreadTitles';

