CREATE TABLE [dbo].[ThreadTitles] (
    [ID]            INT            IDENTITY (1, 1) NOT NULL,
    [CreatedOn]     DATETIME       NULL,
    [Published]     BIT            CONSTRAINT [DF_ThreadTitles_Published] DEFAULT ((1)) NOT NULL,
    [Author]        INT            NULL,
    [Deleted]       BIT            NOT NULL,
    [Modified]      BIT            CONSTRAINT [DF_ThreadTitles_Modified] DEFAULT ((0)) NOT NULL,
    [Title]         NVARCHAR (250) NULL,
    [LastModified]  DATETIME       NULL,
    [Sticky]        BIT            CONSTRAINT [DF_ThreadTitles_Sticky] DEFAULT ((0)) NOT NULL,
    [LatestComment] INT            NULL,
    CONSTRAINT [PK_ThreadTitles] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ThreadTitles_Comments] FOREIGN KEY ([LatestComment]) REFERENCES [dbo].[Comments] ([ID]) ON DELETE SET NULL ON UPDATE SET NULL,
    CONSTRAINT [FK_ThreadTitles_Users] FOREIGN KEY ([Author]) REFERENCES [dbo].[Users] ([ID])
);

