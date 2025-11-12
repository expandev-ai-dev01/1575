/**
 * @schema functional
 * Business logic schema for task management system
 */
CREATE SCHEMA [functional];
GO

/**
 * @table task Task management core entity
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(1000) NOT NULL DEFAULT (''),
  [dueDate] DATE NOT NULL,
  [priority] INTEGER NOT NULL,
  [status] INTEGER NOT NULL DEFAULT (0),
  [timeEstimate] INTEGER NULL,
  [recurrenceConfig] NVARCHAR(MAX) NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskAttachment Task file attachments
 * @multitenancy true
 * @softDelete false
 * @alias tskAtt
 */
CREATE TABLE [functional].[taskAttachment] (
  [idTaskAttachment] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [fileName] NVARCHAR(255) NOT NULL,
  [fileSize] INTEGER NOT NULL,
  [fileType] VARCHAR(50) NOT NULL,
  [filePath] NVARCHAR(500) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @table taskTag Task categorization tags
 * @multitenancy true
 * @softDelete false
 * @alias tskTag
 */
CREATE TABLE [functional].[taskTag] (
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [tag] NVARCHAR(20) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @table subtask Task breakdown items
 * @multitenancy true
 * @softDelete false
 * @alias sub
 */
CREATE TABLE [functional].[subtask] (
  [idSubtask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [completed] BIT NOT NULL DEFAULT (0),
  [sortOrder] INTEGER NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @table taskTemplate Reusable task templates
 * @multitenancy true
 * @softDelete true
 * @alias tskTpl
 */
CREATE TABLE [functional].[taskTemplate] (
  [idTaskTemplate] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  [description] NVARCHAR(500) NOT NULL DEFAULT (''),
  [templateData] NVARCHAR(MAX) NOT NULL,
  [predefinedSubtasks] NVARCHAR(MAX) NULL,
  [shared] BIT NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskDraft Auto-saved task drafts
 * @multitenancy true
 * @softDelete false
 * @alias tskDrf
 */
CREATE TABLE [functional].[taskDraft] (
  [idTaskDraft] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [draftData] NVARCHAR(MAX) NOT NULL,
  [formType] VARCHAR(50) NOT NULL,
  [lastSaved] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @primaryKey pkTaskAttachment
 * @keyType Object
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [pkTaskAttachment] PRIMARY KEY CLUSTERED ([idTaskAttachment]);
GO

/**
 * @primaryKey pkTaskTag
 * @keyType Relationship
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [pkTaskTag] PRIMARY KEY CLUSTERED ([idAccount], [idTask], [tag]);
GO

/**
 * @primaryKey pkSubtask
 * @keyType Object
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [pkSubtask] PRIMARY KEY CLUSTERED ([idSubtask]);
GO

/**
 * @primaryKey pkTaskTemplate
 * @keyType Object
 */
ALTER TABLE [functional].[taskTemplate]
ADD CONSTRAINT [pkTaskTemplate] PRIMARY KEY CLUSTERED ([idTaskTemplate]);
GO

/**
 * @primaryKey pkTaskDraft
 * @keyType Object
 */
ALTER TABLE [functional].[taskDraft]
ADD CONSTRAINT [pkTaskDraft] PRIMARY KEY CLUSTERED ([idTaskDraft]);
GO

/**
 * @foreignKey fkTask_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTaskAttachment_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [fkTaskAttachment_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTaskAttachment_Task
 * @target functional.task
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [fkTaskAttachment_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkTaskTag_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [fkTaskTag_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTaskTag_Task
 * @target functional.task
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [fkTaskTag_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkSubtask_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [fkSubtask_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkSubtask_Task
 * @target functional.task
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [fkSubtask_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkTaskTemplate_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[taskTemplate]
ADD CONSTRAINT [fkTaskTemplate_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTaskDraft_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[taskDraft]
ADD CONSTRAINT [fkTaskDraft_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @check chkTask_Priority
 * @enum {0} Low
 * @enum {1} Medium
 * @enum {2} High
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_Status
 * @enum {0} Pending
 * @enum {1} InProgress
 * @enum {2} Completed
 * @enum {3} Cancelled
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Status] CHECK ([status] BETWEEN 0 AND 3);
GO

/**
 * @check chkTask_TimeEstimate
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_TimeEstimate] CHECK ([timeEstimate] IS NULL OR ([timeEstimate] >= 5 AND [timeEstimate] <= 1440));
GO

/**
 * @check chkTaskAttachment_FileSize
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [chkTaskAttachment_FileSize] CHECK ([fileSize] > 0 AND [fileSize] <= 10485760);
GO

/**
 * @index ixTask_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_User
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_User]
ON [functional].[task]([idAccount], [idUser])
INCLUDE ([title], [dueDate], [priority], [status])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_DueDate
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_DueDate]
ON [functional].[task]([idAccount], [dueDate])
INCLUDE ([title], [priority], [status])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Status
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Status]
ON [functional].[task]([idAccount], [status])
INCLUDE ([title], [dueDate], [priority])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskAttachment_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskAttachment_Account_Task]
ON [functional].[taskAttachment]([idAccount], [idTask]);
GO

/**
 * @index ixTaskTag_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskTag_Account_Task]
ON [functional].[taskTag]([idAccount], [idTask]);
GO

/**
 * @index ixSubtask_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSubtask_Account_Task]
ON [functional].[subtask]([idAccount], [idTask]);
GO

/**
 * @index ixTaskTemplate_Account_User
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Account_User]
ON [functional].[taskTemplate]([idAccount], [idUser])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_Account_Shared
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Account_Shared]
ON [functional].[taskTemplate]([idAccount], [shared])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskDraft_Account_User
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskDraft_Account_User]
ON [functional].[taskDraft]([idAccount], [idUser]);
GO

/**
 * @index uqTaskDraft_Account_User_FormType
 * @type Performance
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqTaskDraft_Account_User_FormType]
ON [functional].[taskDraft]([idAccount], [idUser], [formType]);
GO