CREATE TABLE [dbo].[FileInfo] (
    [ID]   INT            IDENTITY (1, 1) NOT NULL,
    [Path] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_FileInfo] PRIMARY KEY CLUSTERED ([ID] ASC)
);

