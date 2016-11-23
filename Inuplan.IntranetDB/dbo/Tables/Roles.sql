CREATE TABLE [dbo].[Roles] (
    [ID]   INT            IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR (250) NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED ([ID] ASC)
);

