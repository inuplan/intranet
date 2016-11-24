CREATE TABLE [dbo].[Users] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [FirstName]   NVARCHAR (250) NULL,
    [LastName]    NVARCHAR (250) NULL,
    [Username]    NVARCHAR (50)  NULL,
    [Email]       NVARCHAR (50)  NULL,
    [DisplayName] NVARCHAR (50)  NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [UK_Users_Username] UNIQUE NONCLUSTERED ([Username] ASC)
);

