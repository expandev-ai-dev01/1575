/**
 * @summary
 * Creates a new task with all specified properties including title, description,
 * due date, priority, status, time estimate, and recurrence configuration.
 * Validates all business rules and returns the created task details.
 *
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User creating the task
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title (3-100 characters)
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Task description (max 1000 characters)
 *
 * @param {DATE} dueDate
 *   - Required: Yes
 *   - Description: Task due date (cannot be in the past)
 *
 * @param {INT} priority
 *   - Required: Yes
 *   - Description: Priority level (0=Low, 1=Medium, 2=High)
 *
 * @param {INT} timeEstimate
 *   - Required: No
 *   - Description: Estimated time in minutes (5-1440)
 *
 * @param {NVARCHAR(MAX)} recurrenceConfig
 *   - Required: No
 *   - Description: JSON configuration for recurring tasks
 *
 * @returns {TaskEntity} Created task with generated ID
 *
 * @testScenarios
 * - Valid task creation with all required fields
 * - Task creation with optional fields
 * - Validation failure for title length
 * - Validation failure for past due date
 * - Validation failure for invalid priority
 * - Validation failure for time estimate out of range
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = '',
  @dueDate DATE,
  @priority INTEGER,
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
   * @validation Due date cannot be in the past
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

      DECLARE @idTask INTEGER;

      /**
       * @rule {db-task-creation} Insert new task with default status Pending
       */
      INSERT INTO [functional].[task] (
        [idAccount],
        [idUser],
        [title],
        [description],
        [dueDate],
        [priority],
        [status],
        [timeEstimate],
        [recurrenceConfig],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @idUser,
        @title,
        @description,
        @dueDate,
        @priority,
        0,
        @timeEstimate,
        @recurrenceConfig,
        GETUTCDATE(),
        GETUTCDATE(),
        0
      );

      SET @idTask = SCOPE_IDENTITY();

      /**
       * @output {TaskCreated, 1, n}
       * @column {INT} idTask - Generated task identifier
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