CREATE TABLE [dbo].[UserRoles] (
    [UserID] INT NOT NULL,
    [RoleID] INT NOT NULL,
    CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED ([UserID] ASC, [RoleID] ASC),
    CONSTRAINT [FK_UserRoles_Roles] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Roles] ([ID]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserRoles_Users] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([ID]) ON DELETE CASCADE
);

