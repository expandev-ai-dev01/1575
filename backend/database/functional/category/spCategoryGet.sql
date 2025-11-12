/**
 * @summary
 * Retrieves detailed information for a specific category including task count.
 *
 * @procedure spCategoryGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/category/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User requesting the category
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier
 *
 * @returns {CategoryDetail} Complete category information
 *
 * @testScenarios
 * - Retrieve existing category successfully
 * - Category not found error
 * - Account isolation validation
 * - User access validation
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryGet]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idCategory INTEGER
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
   * @validation Category existence and access validation
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
   * @output {CategoryDetail, 1, n}
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
   * @column {INT} taskCount - Number of tasks in category
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
    (
      SELECT COUNT(DISTINCT [tskCat].[idTask])
      FROM [functional].[taskCategory] [tskCat]
        JOIN [functional].[task] [tsk] ON ([tsk].[idAccount] = [tskCat].[idAccount] AND [tsk].[idTask] = [tskCat].[idTask])
      WHERE [tskCat].[idAccount] = [cat].[idAccount]
        AND [tskCat].[idCategory] = [cat].[idCategory]
        AND [tsk].[status] <> 2
        AND [tsk].[deleted] = 0
    ) AS [taskCount],
    [cat].[dateCreated],
    [cat].[dateModified]
  FROM [functional].[category] [cat]
  WHERE [cat].[idCategory] = @idCategory
    AND [cat].[idAccount] = @idAccount
    AND [cat].[idUser] = @idUser
    AND [cat].[deleted] = 0;
END;
GO