CREATE TABLE [dbo].[Comments] (
    [ID]       INT            IDENTITY (1, 1) NOT NULL,
    [PostedOn] DATETIME       NOT NULL,
    [Author]   INT            NULL,
    [Text]     NVARCHAR (MAX) NULL,
    [Reply]    INT            NULL,
    [Deleted]  BIT            CONSTRAINT [DF_Comments_Deleted] DEFAULT ((0)) NOT NULL,
    [Edited]   BIT            CONSTRAINT [DF_Comments_Edited] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Comments] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Comments_Comments] FOREIGN KEY ([Reply]) REFERENCES [dbo].[Comments] ([ID]),
    CONSTRAINT [FK_Comments_Users] FOREIGN KEY ([Author]) REFERENCES [dbo].[Users] ([ID]) ON DELETE CASCADE
);

