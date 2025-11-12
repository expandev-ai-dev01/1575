/**
 * @summary
 * Removes category association from a task.
 *
 * @procedure spTaskCategoryRemove
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/task/:id/category/:idCategory
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User removing the category
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to remove
 *
 * @returns {RemovalResult} Confirmation of removal
 *
 * @testScenarios
 * - Successful category removal
 * - Task not found error
 * - Category not found error
 * - Association not found error
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCategoryRemove]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idTask INTEGER,
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
   * @throw {idTaskRequired}
   */
  IF @idTask IS NULL
  BEGIN
    ;THROW 51000, 'idTaskRequired', 1;
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

  /**
   * @validation Association existence validation
   * @throw {taskCategoryAssociationNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [functional].[taskCategory] [tskCat]
    WHERE [tskCat].[idAccount] = @idAccount
      AND [tskCat].[idTask] = @idTask
      AND [tskCat].[idCategory] = @idCategory
  )
  BEGIN
    ;THROW 51000, 'taskCategoryAssociationNotFound', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {db-task-category-removal} Remove category association
       */
      DELETE FROM [functional].[taskCategory]
      WHERE [idAccount] = @idAccount
        AND [idTask] = @idTask
        AND [idCategory] = @idCategory;

      /**
       * @output {RemovalResult, 1, 1}
       * @column {BIT} success - Removal success indicator
       */
      SELECT 1 AS [success];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO