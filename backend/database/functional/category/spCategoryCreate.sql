/**
 * @summary
 * Creates a new category with specified properties including name, description,
 * color, icon, and parent category. Validates business rules including name uniqueness,
 * hierarchy depth limits, and user category limits.
 *
 * @procedure spCategoryCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User creating the category
 *
 * @param {NVARCHAR(50)} name
 *   - Required: Yes
 *   - Description: Category name (2-50 characters)
 *
 * @param {NVARCHAR(200)} description
 *   - Required: No
 *   - Description: Category description (max 200 characters)
 *
 * @param {VARCHAR(7)} color
 *   - Required: No
 *   - Description: Hexadecimal color code (default: #4287f5)
 *
 * @param {NVARCHAR(50)} icon
 *   - Required: No
 *   - Description: Icon identifier
 *
 * @param {INT} idParent
 *   - Required: No
 *   - Description: Parent category identifier for subcategories
 *
 * @param {BIT} isFavorite
 *   - Required: No
 *   - Description: Favorite flag (default: 0)
 *
 * @returns {CategoryEntity} Created category with generated ID
 *
 * @testScenarios
 * - Valid category creation with required fields only
 * - Category creation with all optional fields
 * - Validation failure for duplicate name
 * - Validation failure for exceeding category limit
 * - Validation failure for exceeding hierarchy depth
 * - Validation failure for invalid parent category
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @name NVARCHAR(50),
  @description NVARCHAR(200) = '',
  @color VARCHAR(7) = '#4287f5',
  @icon NVARCHAR(50) = NULL,
  @idParent INTEGER = NULL,
  @isFavorite BIT = 0
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {nameRequired}
   */
  IF @name IS NULL OR LTRIM(RTRIM(@name)) = ''
  BEGIN
    ;THROW 51000, 'nameRequired', 1;
  END;

  /**
   * @validation Name length validation
   * @throw {nameTooShort}
   */
  IF LEN(LTRIM(RTRIM(@name))) < 2
  BEGIN
    ;THROW 51000, 'nameTooShort', 1;
  END;

  /**
   * @validation Name length validation
   * @throw {nameTooLong}
   */
  IF LEN(@name) > 50
  BEGIN
    ;THROW 51000, 'nameTooLong', 1;
  END;

  /**
   * @validation Description length validation
   * @throw {descriptionTooLong}
   */
  IF LEN(@description) > 200
  BEGIN
    ;THROW 51000, 'descriptionTooLong', 1;
  END;

  /**
   * @validation Color format validation
   * @throw {invalidColorFormat}
   */
  IF @color NOT LIKE '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'
  BEGIN
    ;THROW 51000, 'invalidColorFormat', 1;
  END;

  /**
   * @validation Parent category existence validation
   * @throw {parentCategoryNotFound}
   */
  IF @idParent IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idParent
      AND [cat].[idAccount] = @idAccount
      AND [cat].[idUser] = @idUser
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'parentCategoryNotFound', 1;
  END;

  /**
   * @validation Hierarchy depth validation
   * @throw {maxHierarchyDepthExceeded}
   */
  IF @idParent IS NOT NULL
  BEGIN
    DECLARE @currentDepth INTEGER = 0;
    DECLARE @checkParent INTEGER = @idParent;

    WHILE @checkParent IS NOT NULL AND @currentDepth < 3
    BEGIN
      SET @currentDepth = @currentDepth + 1;
      SELECT @checkParent = [idParent]
      FROM [functional].[category]
      WHERE [idCategory] = @checkParent
        AND [idAccount] = @idAccount;
    END;

    IF @currentDepth >= 3
    BEGIN
      ;THROW 51000, 'maxHierarchyDepthExceeded', 1;
    END;
  END;

  /**
   * @validation Duplicate name validation
   * @throw {categoryNameAlreadyExists}
   */
  IF EXISTS (
    SELECT 1
    FROM [functional].[category] [cat]
    WHERE [cat].[idAccount] = @idAccount
      AND [cat].[idUser] = @idUser
      AND [cat].[name] = @name
      AND (([cat].[idParent] IS NULL AND @idParent IS NULL) OR ([cat].[idParent] = @idParent))
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'categoryNameAlreadyExists', 1;
  END;

  /**
   * @validation Category limit validation
   * @throw {categoryLimitExceeded}
   */
  DECLARE @categoryCount INTEGER;
  SELECT @categoryCount = COUNT(*)
  FROM [functional].[category] [cat]
  WHERE [cat].[idAccount] = @idAccount
    AND [cat].[idUser] = @idUser
    AND [cat].[isDefault] = 0
    AND [cat].[deleted] = 0;

  IF @categoryCount >= 50
  BEGIN
    ;THROW 51000, 'categoryLimitExceeded', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      DECLARE @idCategory INTEGER;
      DECLARE @maxSortOrder INTEGER;

      /**
       * @rule {db-category-sort-order} Calculate next sort order
       */
      SELECT @maxSortOrder = ISNULL(MAX([sortOrder]), 0)
      FROM [functional].[category] [cat]
      WHERE [cat].[idAccount] = @idAccount
        AND [cat].[idUser] = @idUser
        AND [cat].[deleted] = 0;

      /**
       * @rule {db-category-creation} Insert new category
       */
      INSERT INTO [functional].[category] (
        [idAccount],
        [idUser],
        [name],
        [description],
        [color],
        [icon],
        [idParent],
        [isDefault],
        [sortOrder],
        [isFavorite],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @idUser,
        @name,
        @description,
        @color,
        @icon,
        @idParent,
        0,
        @maxSortOrder + 1,
        @isFavorite,
        GETUTCDATE(),
        GETUTCDATE(),
        0
      );

      SET @idCategory = SCOPE_IDENTITY();

      /**
       * @output {CategoryCreated, 1, n}
       * @column {INT} idCategory - Generated category identifier
       * @column {INT} idAccount - Account identifier
       * @column {INT} idUser - User identifier
       * @column {NVARCHAR} name - Category name
       * @column {NVARCHAR} description - Category description
       * @column {VARCHAR} color - Category color
       * @column {NVARCHAR} icon - Category icon
       * @column {INT} idParent - Parent category identifier
       * @column {BIT} isDefault - Default category flag
       * @column {INT} sortOrder - Sort order
       * @column {BIT} isFavorite - Favorite flag
       * @column {DATETIME2} dateCreated - Creation timestamp
       * @column {DATETIME2} dateModified - Modification timestamp
       */
      SELECT
        [cat].[idCategory],
        [cat].[idAccount],
        [cat].[idUser],
        [cat].[name],
        [cat].[description],
        [cat].[color],
        [cat].[icon],
        [cat].[idParent],
        [cat].[isDefault],
        [cat].[sortOrder],
        [cat].[isFavorite],
        [cat].[dateCreated],
        [cat].[dateModified]
      FROM [functional].[category] [cat]
      WHERE [cat].[idCategory] = @idCategory
        AND [cat].[idAccount] = @idAccount;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO