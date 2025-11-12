/**
 * @summary
 * Assigns one or more categories to a task. Supports multiple category associations.
 *
 * @procedure spTaskCategoryAssign
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task/:id/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User assigning the categories
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier
 *
 * @param {NVARCHAR(MAX)} categoryIds
 *   - Required: Yes
 *   - Description: Comma-separated list of category IDs
 *
 * @returns {AssignmentResult} Confirmation of assignment
 *
 * @testScenarios
 * - Successful single category assignment
 * - Successful multiple category assignment
 * - Task not found error
 * - Category not found error
 * - Duplicate assignment prevention
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCategoryAssign]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idTask INTEGER,
  @categoryIds NVARCHAR(MAX)
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
   * @throw {idTaskRequired}
   */
  IF @idTask IS NULL
  BEGIN
    ;THROW 51000, 'idTaskRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {categoryIdsRequired}
   */
  IF @categoryIds IS NULL OR LTRIM(RTRIM(@categoryIds)) = ''
  BEGIN
    ;THROW 51000, 'categoryIdsRequired', 1;
  END;

  /**
   * @validation Task existence validation
   * @throw {taskNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [functional].[task] [tsk]
    WHERE [tsk].[idTask] = @idTask
      AND [tsk].[idAccount] = @idAccount
      AND [tsk].[idUser] = @idUser
      AND [tsk].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'taskNotFound', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      DECLARE @categoryIdTable TABLE ([idCategory] INTEGER);

      /**
       * @rule {db-parse-category-ids} Parse comma-separated category IDs
       */
      INSERT INTO @categoryIdTable ([idCategory])
      SELECT CAST([value] AS INTEGER)
      FROM STRING_SPLIT(@categoryIds, ',');

      /**
       * @validation All categories must exist
       * @throw {invalidCategoryId}
       */
      IF EXISTS (
        SELECT 1
        FROM @categoryIdTable [cit]
        WHERE NOT EXISTS (
          SELECT 1
          FROM [functional].[category] [cat]
          WHERE [cat].[idCategory] = [cit].[idCategory]
            AND [cat].[idAccount] = @idAccount
            AND [cat].[idUser] = @idUser
            AND [cat].[deleted] = 0
        )
      )
      BEGIN
        ;THROW 51000, 'invalidCategoryId', 1;
      END;

      /**
       * @rule {db-task-category-assignment} Insert new category associations
       */
      INSERT INTO [functional].[taskCategory] (
        [idAccount],
        [idTask],
        [idCategory],
        [dateCreated]
      )
      SELECT
        @idAccount,
        @idTask,
        [cit].[idCategory],
        GETUTCDATE()
      FROM @categoryIdTable [cit]
      WHERE NOT EXISTS (
        SELECT 1
        FROM [functional].[taskCategory] [tskCat]
        WHERE [tskCat].[idAccount] = @idAccount
          AND [tskCat].[idTask] = @idTask
          AND [tskCat].[idCategory] = [cit].[idCategory]
      );

      /**
       * @output {AssignmentResult, 1, 1}
       * @column {BIT} success - Assignment success indicator
       * @column {INT} assignedCount - Number of categories assigned
       */
      SELECT
        1 AS [success],
        @@ROWCOUNT AS [assignedCount];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO