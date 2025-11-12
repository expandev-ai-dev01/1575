/**
 * @summary
 * Retrieves a list of categories for a specific user with hierarchical information.
 * Returns categories ordered by favorite status and custom sort order.
 *
 * @procedure spCategoryList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User requesting the category list
 *
 * @returns {CategoryList} List of categories with task counts
 *
 * @testScenarios
 * - Retrieve all categories for a user
 * - Empty result for user with no categories
 * - Account isolation validation
 * - Correct task count calculation
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryList]
  @idAccount INTEGER,
  @idUser INTEGER
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
   * @output {CategoryList, n, n}
   * @column {INT} idCategory - Category identifier
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
  WHERE [cat].[idAccount] = @idAccount
    AND [cat].[idUser] = @idUser
    AND [cat].[deleted] = 0
  ORDER BY
    [cat].[isFavorite] DESC,
    [cat].[sortOrder] ASC,
    [cat].[name] ASC;
END;
GO