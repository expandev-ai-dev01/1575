import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  TaskEntity,
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskListRequest,
  TaskGetRequest,
  TaskDeleteRequest,
} from './taskTypes';

/**
 * @summary
 * Creates a new task with all specified properties
 *
 * @function taskCreate
 * @module task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.title - Task title
 * @param {string} params.description - Task description
 * @param {string} params.dueDate - Task due date
 * @param {number} params.priority - Priority level
 * @param {number} params.timeEstimate - Time estimate in minutes
 * @param {string} params.recurrenceConfig - Recurrence configuration JSON
 *
 * @returns {Promise<TaskEntity>} Created task entity
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const task = await taskCreate({
 *   idAccount: 1,
 *   idUser: 1,
 *   title: 'Complete project documentation',
 *   description: 'Write comprehensive documentation for the project',
 *   dueDate: '2024-12-31',
 *   priority: 2,
 *   timeEstimate: 120
 * });
 */
export async function taskCreate(params: TaskCreateRequest): Promise<TaskEntity> {
  const result = await dbRequest(
    '[functional].[spTaskCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      title: params.title,
      description: params.description || '',
      dueDate: params.dueDate,
      priority: params.priority,
      timeEstimate: params.timeEstimate || null,
      recurrenceConfig: params.recurrenceConfig || null,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves a list of tasks for a specific user
 *
 * @function taskList
 * @module task
 *
 * @param {TaskListRequest} params - Task list parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 *
 * @returns {Promise<TaskEntity[]>} Array of task entities
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const tasks = await taskList({
 *   idAccount: 1,
 *   idUser: 1
 * });
 */
export async function taskList(params: TaskListRequest): Promise<TaskEntity[]> {
  const result = await dbRequest(
    '[functional].[spTaskList]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
    },
    ExpectedReturn.Multi
  );

  return result;
}

/**
 * @summary
 * Retrieves detailed information for a specific task
 *
 * @function taskGet
 * @module task
 *
 * @param {TaskGetRequest} params - Task retrieval parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<TaskEntity>} Task entity with complete information
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When task does not exist
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const task = await taskGet({
 *   idAccount: 1,
 *   idUser: 1,
 *   idTask: 123
 * });
 */
export async function taskGet(params: TaskGetRequest): Promise<TaskEntity> {
  const result = await dbRequest(
    '[functional].[spTaskGet]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idTask: params.idTask,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Updates an existing task with new values
 *
 * @function taskUpdate
 * @module task
 *
 * @param {TaskUpdateRequest} params - Task update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idTask - Task identifier
 * @param {string} params.title - Updated task title
 * @param {string} params.description - Updated task description
 * @param {string} params.dueDate - Updated due date
 * @param {number} params.priority - Updated priority level
 * @param {number} params.status - Updated task status
 * @param {number} params.timeEstimate - Updated time estimate
 * @param {string} params.recurrenceConfig - Updated recurrence configuration
 *
 * @returns {Promise<TaskEntity>} Updated task entity
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When task does not exist
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const updatedTask = await taskUpdate({
 *   idAccount: 1,
 *   idUser: 1,
 *   idTask: 123,
 *   title: 'Updated task title',
 *   description: 'Updated description',
 *   dueDate: '2024-12-31',
 *   priority: 2,
 *   status: 1,
 *   timeEstimate: 180
 * });
 */
export async function taskUpdate(params: TaskUpdateRequest): Promise<TaskEntity> {
  const result = await dbRequest(
    '[functional].[spTaskUpdate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idTask: params.idTask,
      title: params.title,
      description: params.description || '',
      dueDate: params.dueDate,
      priority: params.priority,
      status: params.status,
      timeEstimate: params.timeEstimate || null,
      recurrenceConfig: params.recurrenceConfig || null,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Performs soft delete on a task
 *
 * @function taskDelete
 * @module task
 *
 * @param {TaskDeleteRequest} params - Task deletion parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<{ success: boolean }>} Deletion confirmation
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When task does not exist
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await taskDelete({
 *   idAccount: 1,
 *   idUser: 1,
 *   idTask: 123
 * });
 */
export async function taskDelete(params: TaskDeleteRequest): Promise<{ success: boolean }> {
  const result = await dbRequest(
    '[functional].[spTaskDelete]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idTask: params.idTask,
    },
    ExpectedReturn.Single
  );

  return result;
}
