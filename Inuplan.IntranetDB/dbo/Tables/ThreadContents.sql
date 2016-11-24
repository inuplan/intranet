CREATE TABLE [dbo].[ThreadContents] (
    [ID]   INT            NOT NULL,
    [Text] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_ThreadContents] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ThreadContents_ThreadTitles] FOREIGN KEY ([ID]) REFERENCES [dbo].[ThreadTitles] ([ID]) ON DELETE CASCADE
);

