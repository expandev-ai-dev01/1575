/**
 * @summary
 * Performs soft delete on a category by setting the deleted flag.
 * Prevents deletion of default categories and handles task reassignment.
 *
 * @procedure spCategoryDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/category/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User deleting the category
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to delete
 *
 * @param {INT} idTargetCategory
 *   - Required: No
 *   - Description: Target category for task reassignment (null to remove associations)
 *
 * @returns {DeleteResult} Confirmation of deletion
 *
 * @testScenarios
 * - Successful category deletion with task reassignment
 * - Successful category deletion removing task associations
 * - Category not found error
 * - Default category deletion prevention
 * - Account isolation validation
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryDelete]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idCategory INTEGER,
  @idTargetCategory INTEGER = NULL
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
   * @validation Default category deletion prevention
   * @throw {cannotDeleteDefaultCategory}
   */
  IF EXISTS (
    SELECT 1
    FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[isDefault] = 1
  )
  BEGIN
    ;THROW 51000, 'cannotDeleteDefaultCategory', 1;
  END;

  /**
   * @validation Target category existence validation
   * @throw {targetCategoryNotFound}
   */
  IF @idTargetCategory IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idTargetCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[idUser] = @idUser
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'targetCategoryNotFound', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {db-task-category-reassignment} Reassign or remove task associations
       */
      IF @idTargetCategory IS NOT NULL
      BEGIN
        UPDATE [functional].[taskCategory]
        SET [idCategory] = @idTargetCategory
        WHERE [idAccount] = @idAccount
          AND [idCategory] = @idCategory;
      END
      ELSE
      BEGIN
        DELETE FROM [functional].[taskCategory]
        WHERE [idAccount] = @idAccount
          AND [idCategory] = @idCategory;
      END;

      /**
       * @rule {db-soft-delete} Soft delete category by setting deleted flag
       */
      UPDATE [functional].[category]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idCategory] = @idCategory
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser;

      /**
       * @rule {db-subcategory-deletion} Soft delete all subcategories
       */
      UPDATE [functional].[category]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idParent] = @idCategory
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser;

      /**
       * @output {DeleteResult, 1, 1}
       * @column {BIT} success - Deletion success indicator
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