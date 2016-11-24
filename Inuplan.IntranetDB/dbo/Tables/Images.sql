CREATE TABLE [dbo].[Images] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [Preview]     INT            NULL,
    [Thumbnail]   INT            NULL,
    [Original]    INT            NULL,
    [Owner]       INT            NULL,
    [Description] NVARCHAR (500) NULL,
    [Filename]    NVARCHAR (300) NULL,
    [Extension]   NVARCHAR (MAX) NULL,
    [MimeType]    NVARCHAR (MAX) NULL,
    [Uploaded]    DATETIME       NOT NULL,
    CONSTRAINT [PK_Images] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Images_FileInfo_Original] FOREIGN KEY ([Original]) REFERENCES [dbo].[FileInfo] ([ID]),
    CONSTRAINT [FK_Images_FileInfo_Preview] FOREIGN KEY ([Preview]) REFERENCES [dbo].[FileInfo] ([ID]),
    CONSTRAINT [FK_Images_FileInfo_Thumbnail] FOREIGN KEY ([Thumbnail]) REFERENCES [dbo].[FileInfo] ([ID]),
    CONSTRAINT [FK_Images_Users] FOREIGN KEY ([Owner]) REFERENCES [dbo].[Users] ([ID]) ON DELETE CASCADE
);

