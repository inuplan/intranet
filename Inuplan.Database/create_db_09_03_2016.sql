USE [IntranetDB]
GO
/****** Object:  Table [dbo].[AlbumImages]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AlbumImages](
	[AlbumID] [int] NOT NULL,
	[FileInfoID] [int] NOT NULL,
 CONSTRAINT [PK_AlbumImages] PRIMARY KEY CLUSTERED 
(
	[AlbumID] ASC,
	[FileInfoID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AlbumPosts]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AlbumPosts](
	[AlbumID] [int] NOT NULL,
	[PostID] [int] NOT NULL,
 CONSTRAINT [IX_AlbumPosts_PostID_Unique] UNIQUE NONCLUSTERED 
(
	[PostID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Albums]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Albums](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NULL,
	[Name] [nvarchar](500) NULL,
 CONSTRAINT [PK_Albums] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[FileData]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FileData](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Path] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Data] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[FileInfo]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FileInfo](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Filename] [nvarchar](200) NOT NULL,
	[Extension] [nvarchar](20) NOT NULL,
	[MimeType] [nvarchar](20) NULL,
	[OwnerID] [int] NULL,
 CONSTRAINT [PK_FileInfo] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_FileInfo] UNIQUE NONCLUSTERED 
(
	[OwnerID] ASC,
	[Filename] ASC,
	[Extension] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ImagePosts]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ImagePosts](
	[FileInfoID] [int] NOT NULL,
	[PostID] [int] NOT NULL,
 CONSTRAINT [PK_ImagePosts] PRIMARY KEY NONCLUSTERED 
(
	[FileInfoID] ASC,
	[PostID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_ImagePosts_Unique] UNIQUE NONCLUSTERED 
(
	[PostID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Images]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Images](
	[ID] [int] NOT NULL,
	[ThumbnailID] [int] NOT NULL,
	[MediumID] [int] NOT NULL,
	[OriginalID] [int] NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Posts]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Posts](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[PostedOn] [datetime] NOT NULL,
	[Comment] [nvarchar](500) NULL,
	[PostTypeID] [int] NOT NULL,
	[UserID] [int] NOT NULL,
 CONSTRAINT [PK_Posts] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ProfileImages]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProfileImages](
	[FileInfoID] [int] NOT NULL,
	[FileDataID] [int] NOT NULL,
 CONSTRAINT [IX_ProfileImages] UNIQUE NONCLUSTERED 
(
	[FileInfoID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_ProfileImages_1] UNIQUE NONCLUSTERED 
(
	[FileDataID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Profiles]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Profiles](
	[ID] [int] NOT NULL,
	[Biography] [nvarchar](500) NULL,
	[FileInfoID] [int] NULL,
 CONSTRAINT [IX_Profiles] UNIQUE CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_Profiles_Image] UNIQUE NONCLUSTERED 
(
	[FileInfoID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Users]    Script Date: 09-03-2016 16:22:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](300) NULL,
	[LastName] [nvarchar](300) NULL,
	[Email] [nvarchar](300) NULL,
	[Username] [nvarchar](100) NOT NULL,
	[RoleID] [int] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [dbo].[AlbumImages]  WITH CHECK ADD  CONSTRAINT [FK_AlbumImages_Albums] FOREIGN KEY([AlbumID])
REFERENCES [dbo].[Albums] ([ID])
GO
ALTER TABLE [dbo].[AlbumImages] CHECK CONSTRAINT [FK_AlbumImages_Albums]
GO
ALTER TABLE [dbo].[AlbumImages]  WITH CHECK ADD  CONSTRAINT [FK_AlbumImages_FileInfo] FOREIGN KEY([FileInfoID])
REFERENCES [dbo].[FileInfo] ([ID])
GO
ALTER TABLE [dbo].[AlbumImages] CHECK CONSTRAINT [FK_AlbumImages_FileInfo]
GO
ALTER TABLE [dbo].[AlbumPosts]  WITH CHECK ADD  CONSTRAINT [FK_AlbumPosts_Albums] FOREIGN KEY([AlbumID])
REFERENCES [dbo].[Albums] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AlbumPosts] CHECK CONSTRAINT [FK_AlbumPosts_Albums]
GO
ALTER TABLE [dbo].[AlbumPosts]  WITH CHECK ADD  CONSTRAINT [FK_AlbumPosts_Posts] FOREIGN KEY([PostID])
REFERENCES [dbo].[Posts] ([ID])
GO
ALTER TABLE [dbo].[AlbumPosts] CHECK CONSTRAINT [FK_AlbumPosts_Posts]
GO
ALTER TABLE [dbo].[Albums]  WITH CHECK ADD  CONSTRAINT [FK_Albums_Users] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[Albums] CHECK CONSTRAINT [FK_Albums_Users]
GO
ALTER TABLE [dbo].[FileInfo]  WITH CHECK ADD  CONSTRAINT [FK_FileInfo_Users] FOREIGN KEY([OwnerID])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[FileInfo] CHECK CONSTRAINT [FK_FileInfo_Users]
GO
ALTER TABLE [dbo].[ImagePosts]  WITH CHECK ADD  CONSTRAINT [FK_ImagePosts_FileInfo] FOREIGN KEY([FileInfoID])
REFERENCES [dbo].[FileInfo] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ImagePosts] CHECK CONSTRAINT [FK_ImagePosts_FileInfo]
GO
ALTER TABLE [dbo].[ImagePosts]  WITH CHECK ADD  CONSTRAINT [FK_ImagePosts_Posts] FOREIGN KEY([PostID])
REFERENCES [dbo].[Posts] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ImagePosts] CHECK CONSTRAINT [FK_ImagePosts_Posts]
GO
ALTER TABLE [dbo].[Images]  WITH CHECK ADD  CONSTRAINT [FK_Images_FileData_Medium] FOREIGN KEY([MediumID])
REFERENCES [dbo].[FileData] ([ID])
GO
ALTER TABLE [dbo].[Images] CHECK CONSTRAINT [FK_Images_FileData_Medium]
GO
ALTER TABLE [dbo].[Images]  WITH CHECK ADD  CONSTRAINT [FK_Images_FileData_Original] FOREIGN KEY([OriginalID])
REFERENCES [dbo].[FileData] ([ID])
GO
ALTER TABLE [dbo].[Images] CHECK CONSTRAINT [FK_Images_FileData_Original]
GO
ALTER TABLE [dbo].[Images]  WITH CHECK ADD  CONSTRAINT [FK_Images_FileData_Thumbnail] FOREIGN KEY([ThumbnailID])
REFERENCES [dbo].[FileData] ([ID])
GO
ALTER TABLE [dbo].[Images] CHECK CONSTRAINT [FK_Images_FileData_Thumbnail]
GO
ALTER TABLE [dbo].[Images]  WITH CHECK ADD  CONSTRAINT [FK_Images_FileInfo] FOREIGN KEY([ID])
REFERENCES [dbo].[FileInfo] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Images] CHECK CONSTRAINT [FK_Images_FileInfo]
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD  CONSTRAINT [FK_Posts_Users] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Posts] CHECK CONSTRAINT [FK_Posts_Users]
GO
ALTER TABLE [dbo].[ProfileImages]  WITH CHECK ADD  CONSTRAINT [FK_ProfileImages_FileData] FOREIGN KEY([FileDataID])
REFERENCES [dbo].[FileData] ([ID])
GO
ALTER TABLE [dbo].[ProfileImages] CHECK CONSTRAINT [FK_ProfileImages_FileData]
GO
ALTER TABLE [dbo].[ProfileImages]  WITH CHECK ADD  CONSTRAINT [FK_ProfileImages_FileInfo] FOREIGN KEY([FileInfoID])
REFERENCES [dbo].[FileInfo] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProfileImages] CHECK CONSTRAINT [FK_ProfileImages_FileInfo]
GO
ALTER TABLE [dbo].[Profiles]  WITH CHECK ADD  CONSTRAINT [FK_Profiles_FileInfo] FOREIGN KEY([FileInfoID])
REFERENCES [dbo].[FileInfo] ([ID])
GO
ALTER TABLE [dbo].[Profiles] CHECK CONSTRAINT [FK_Profiles_FileInfo]
GO
ALTER TABLE [dbo].[Profiles]  WITH CHECK ADD  CONSTRAINT [FK_Profiles_Users] FOREIGN KEY([ID])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[Profiles] CHECK CONSTRAINT [FK_Profiles_Users]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Image file' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Profiles', @level2type=N'COLUMN',@level2name=N'FileInfoID'
GO
