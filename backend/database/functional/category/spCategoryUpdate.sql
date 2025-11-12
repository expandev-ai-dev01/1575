/**
 * @summary
 * Updates an existing category with new values for specified fields.
 * Validates business rules and prevents modification of default categories.
 *
 * @procedure spCategoryUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/category/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User updating the category
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to update
 *
 * @param {NVARCHAR(50)} name
 *   - Required: Yes
 *   - Description: Updated category name
 *
 * @param {NVARCHAR(200)} description
 *   - Required: No
 *   - Description: Updated category description
 *
 * @param {VARCHAR(7)} color
 *   - Required: Yes
 *   - Description: Updated category color
 *
 * @param {NVARCHAR(50)} icon
 *   - Required: No
 *   - Description: Updated category icon
 *
 * @param {BIT} isFavorite
 *   - Required: Yes
 *   - Description: Updated favorite flag
 *
 * @returns {CategoryEntity} Updated category details
 *
 * @testScenarios
 * - Successful category update
 * - Category not found error
 * - Validation failures for each field
 * - Default category modification prevention
 * - Duplicate name validation
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryUpdate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idCategory INTEGER,
  @name NVARCHAR(50),
  @description NVARCHAR(200) = '',
  @color VARCHAR(7),
  @icon NVARCHAR(50) = NULL,
  @isFavorite BIT
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
   * @throw {idCategoryRequired}
   */
  IF @idCategory IS NULL
  BEGIN
    ;THROW 51000, 'idCategoryRequired', 1;
  END;

  /**
   * @validation Category existence validation
   * @throw {categoryNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[idUser] = @idUser
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'categoryNotFound', 1;
  END;

  /**
   * @validation Default category modification prevention
   * @throw {cannotModifyDefaultCategory}
   */
  IF EXISTS (
    SELECT 1
    FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[isDefault] = 1
  )
  BEGIN
    ;THROW 51000, 'cannotModifyDefaultCategory', 1;
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
   * @validation Duplicate name validation
   * @throw {categoryNameAlreadyExists}
   */
  DECLARE @idParent INTEGER;
  SELECT @idParent = [idParent]
  FROM [functional].[category]
  WHERE [idCategory] = @idCategory
    AND [idAccount] = @idAccount;

  IF EXISTS (
    SELECT 1
    FROM [functional].[category] [cat]
    WHERE [cat].[idAccount] = @idAccount
      AND [cat].[idUser] = @idUser
      AND [cat].[name] = @name
      AND [cat].[idCategory] <> @idCategory
      AND (([cat].[idParent] IS NULL AND @idParent IS NULL) OR ([cat].[idParent] = @idParent))
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'categoryNameAlreadyExists', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {db-category-update} Update category with new values
       */
      UPDATE [functional].[category]
      SET
        [name] = @name,
        [description] = @description,
        [color] = @color,
        [icon] = @icon,
        [isFavorite] = @isFavorite,
        [dateModified] = GETUTCDATE()
      WHERE [idCategory] = @idCategory
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser;

      /**
       * @output {CategoryUpdated, 1, n}
       * @column {INT} idCategory - Category identifier
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