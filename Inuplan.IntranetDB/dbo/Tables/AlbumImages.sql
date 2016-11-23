CREATE TABLE [dbo].[AlbumImages] (
    [AlbumID] INT NOT NULL,
    [ImageID] INT NOT NULL,
    CONSTRAINT [PK_AlbumImages] PRIMARY KEY CLUSTERED ([AlbumID] ASC, [ImageID] ASC),
    CONSTRAINT [FK_AlbumImages_Albums] FOREIGN KEY ([AlbumID]) REFERENCES [dbo].[Albums] ([ID]),
    CONSTRAINT [FK_AlbumImages_Images] FOREIGN KEY ([ImageID]) REFERENCES [dbo].[Images] ([ID]) ON DELETE CASCADE ON UPDATE CASCADE
);

