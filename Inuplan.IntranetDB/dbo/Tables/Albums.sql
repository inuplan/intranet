CREATE TABLE [dbo].[Albums] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [Description] NVARCHAR (500) NULL,
    [Owner]       INT            NOT NULL,
    [Name]        NVARCHAR (250) NULL,
    CONSTRAINT [PK_Albums] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Albums_Users] FOREIGN KEY ([Owner]) REFERENCES [dbo].[Users] ([ID]) ON DELETE CASCADE ON UPDATE CASCADE
);

