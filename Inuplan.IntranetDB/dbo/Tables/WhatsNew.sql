CREATE TABLE [dbo].[WhatsNew] (
    [ID]       INT      IDENTITY (1, 1) NOT NULL,
    [TimeOn]   DATETIME NOT NULL,
    [Event]    TINYINT  NOT NULL,
    [TargetID] INT      NOT NULL,
    CONSTRAINT [PK_WhatsNew_1] PRIMARY KEY CLUSTERED ([Event] ASC, [TargetID] ASC)
);

