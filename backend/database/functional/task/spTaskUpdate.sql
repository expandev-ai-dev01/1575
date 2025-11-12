/**
 * @summary
 * Updates an existing task with new values for specified fields.
 * Validates all business rules and updates modification timestamp.
 *
 * @procedure spTaskUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User updating the task
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to update
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Updated task title
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Updated task description
 *
 * @param {DATE} dueDate
 *   - Required: Yes
 *   - Description: Updated due date
 *
 * @param {INT} priority
 *   - Required: Yes
 *   - Description: Updated priority level
 *
 * @param {INT} status
 *   - Required: Yes
 *   - Description: Updated task status
 *
 * @param {INT} timeEstimate
 *   - Required: No
 *   - Description: Updated time estimate
 *
 * @param {NVARCHAR(MAX)} recurrenceConfig
 *   - Required: No
 *   - Description: Updated recurrence configuration
 *
 * @returns {TaskEntity} Updated task details
 *
 * @testScenarios
 * - Successful task update
 * - Task not found error
 * - Validation failures for each field
 * - Account isolation validation
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskUpdate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idTask INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = '',
  @dueDate DATE,
  @priority INTEGER,
  @status INTEGER,
  @timeEstimate INTEGER = NULL,
  @recurrenceConfig NVARCHAR(MAX) = NULL
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
   * @validation Required parameter validation
   * @throw {titleRequired}
   */
  IF @title IS NULL OR LTRIM(RTRIM(@title)) = ''
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleTooShort}
   */
  IF LEN(LTRIM(RTRIM(@title))) < 3
  BEGIN
    ;THROW 51000, 'titleTooShort', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleTooLong}
   */
  IF LEN(@title) > 100
  BEGIN
    ;THROW 51000, 'titleTooLong', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {dueDateRequired}
   */
  IF @dueDate IS NULL
  BEGIN
    ;THROW 51000, 'dueDateRequired', 1;
  END;

  /**
   * @validation Due date validation
   * @throw {dueDateCannotBeInPast}
   */
  IF @dueDate < CAST(GETUTCDATE() AS DATE)
  BEGIN
    ;THROW 51000, 'dueDateCannotBeInPast', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {priorityRequired}
   */
  IF @priority IS NULL
  BEGIN
    ;THROW 51000, 'priorityRequired', 1;
  END;

  /**
   * @validation Priority value validation
   * @throw {invalidPriority}
   */
  IF @priority NOT BETWEEN 0 AND 2
  BEGIN
    ;THROW 51000, 'invalidPriority', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {statusRequired}
   */
  IF @status IS NULL
  BEGIN
    ;THROW 51000, 'statusRequired', 1;
  END;

  /**
   * @validation Status value validation
   * @throw {invalidStatus}
   */
  IF @status NOT BETWEEN 0 AND 3
  BEGIN
    ;THROW 51000, 'invalidStatus', 1;
  END;

  /**
   * @validation Time estimate range validation
   * @throw {invalidTimeEstimate}
   */
  IF @timeEstimate IS NOT NULL AND (@timeEstimate < 5 OR @timeEstimate > 1440)
  BEGIN
    ;THROW 51000, 'invalidTimeEstimate', 1;
  END;

  /**
   * @validation Description length validation
   * @throw {descriptionTooLong}
   */
  IF LEN(@description) > 1000
  BEGIN
    ;THROW 51000, 'descriptionTooLong', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {db-task-update} Update task with new values
       */
      UPDATE [functional].[task]
      SET
        [title] = @title,
        [description] = @description,
        [dueDate] = @dueDate,
        [priority] = @priority,
        [status] = @status,
        [timeEstimate] = @timeEstimate,
        [recurrenceConfig] = @recurrenceConfig,
        [dateModified] = GETUTCDATE()
      WHERE [idTask] = @idTask
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser;

      /**
       * @output {TaskUpdated, 1, n}
       * @column {INT} idTask - Task identifier
       * @column {INT} idAccount - Account identifier
       * @column {INT} idUser - User identifier
       * @column {NVARCHAR} title - Task title
       * @column {NVARCHAR} description - Task description
       * @column {DATE} dueDate - Task due date
       * @column {INT} priority - Priority level
       * @column {INT} status - Task status
       * @column {INT} timeEstimate - Time estimate in minutes
       * @column {NVARCHAR} recurrenceConfig - Recurrence configuration JSON
       * @column {DATETIME2} dateCreated - Creation timestamp
       * @column {DATETIME2} dateModified - Modification timestamp
       */
      SELECT
        [tsk].[idTask],
        [tsk].[idAccount],
        [tsk].[idUser],
        [tsk].[title],
        [tsk].[description],
        [tsk].[dueDate],
        [tsk].[priority],
        [tsk].[status],
        [tsk].[timeEstimate],
        [tsk].[recurrenceConfig],
        [tsk].[dateCreated],
        [tsk].[dateModified]
      FROM [functional].[task] [tsk]
      WHERE [tsk].[idTask] = @idTask
        AND [tsk].[idAccount] = @idAccount;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO