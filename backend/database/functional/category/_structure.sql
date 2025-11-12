/**
 * @table category Task categorization system
 * @multitenancy true
 * @softDelete true
 * @alias cat
 */
CREATE TABLE [functional].[category] (
  [idCategory] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  [description] NVARCHAR(200) NOT NULL DEFAULT (''),
  [color] VARCHAR(7) NOT NULL DEFAULT ('#4287f5'),
  [icon] NVARCHAR(50) NULL,
  [idParent] INTEGER NULL,
  [isDefault] BIT NOT NULL DEFAULT (0),
  [sortOrder] INTEGER NOT NULL DEFAULT (0),
  [isFavorite] BIT NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskCategory Task-Category association
 * @multitenancy true
 * @softDelete false
 * @alias tskCat
 */
CREATE TABLE [functional].[taskCategory] (
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [idCategory] INTEGER NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @primaryKey pkCategory
 * @keyType Object
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [pkCategory] PRIMARY KEY CLUSTERED ([idCategory]);
GO

/**
 * @primaryKey pkTaskCategory
 * @keyType Relationship
 */
ALTER TABLE [functional].[taskCategory]
ADD CONSTRAINT [pkTaskCategory] PRIMARY KEY CLUSTERED ([idAccount], [idTask], [idCategory]);
GO

/**
 * @foreignKey fkCategory_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [fkCategory_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkCategory_Parent
 * @target functional.category
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [fkCategory_Parent] FOREIGN KEY ([idParent])
REFERENCES [functional].[category]([idCategory]);
GO

/**
 * @foreignKey fkTaskCategory_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[taskCategory]
ADD CONSTRAINT [fkTaskCategory_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTaskCategory_Task
 * @target functional.task
 */
ALTER TABLE [functional].[taskCategory]
ADD CONSTRAINT [fkTaskCategory_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkTaskCategory_Category
 * @target functional.category
 */
ALTER TABLE [functional].[taskCategory]
ADD CONSTRAINT [fkTaskCategory_Category] FOREIGN KEY ([idCategory])
REFERENCES [functional].[category]([idCategory]);
GO

/**
 * @check chkCategory_Name
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [chkCategory_Name] CHECK (LEN(LTRIM(RTRIM([name]))) >= 2);
GO

/**
 * @check chkCategory_Color
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [chkCategory_Color] CHECK ([color] LIKE '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]');
GO

/**
 * @index ixCategory_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account]
ON [functional].[category]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixCategory_Account_User
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account_User]
ON [functional].[category]([idAccount], [idUser])
INCLUDE ([name], [color], [isFavorite], [sortOrder])
WHERE [deleted] = 0;
GO

/**
 * @index ixCategory_Account_Parent
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account_Parent]
ON [functional].[category]([idAccount], [idParent])
INCLUDE ([name], [sortOrder])
WHERE [deleted] = 0;
GO

/**
 * @index uqCategory_Account_User_Name
 * @type Performance
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqCategory_Account_User_Name]
ON [functional].[category]([idAccount], [idUser], [name])
WHERE [deleted] = 0 AND [idParent] IS NULL;
GO

/**
 * @index uqCategory_Account_User_Name_Parent
 * @type Performance
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqCategory_Account_User_Name_Parent]
ON [functional].[category]([idAccount], [idUser], [name], [idParent])
WHERE [deleted] = 0 AND [idParent] IS NOT NULL;
GO

/**
 * @index ixTaskCategory_Account_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskCategory_Account_Task]
ON [functional].[taskCategory]([idAccount], [idTask]);
GO

/**
 * @index ixTaskCategory_Account_Category
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskCategory_Account_Category]
ON [functional].[taskCategory]([idAccount], [idCategory]);
GO