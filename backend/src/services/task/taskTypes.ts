/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {number} idTask - Unique task identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User identifier who created the task
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {string} dueDate - Task due date (ISO date string)
 * @property {number} priority - Priority level (0=Low, 1=Medium, 2=High)
 * @property {number} status - Task status (0=Pending, 1=InProgress, 2=Completed, 3=Cancelled)
 * @property {number | null} timeEstimate - Estimated time in minutes
 * @property {string | null} recurrenceConfig - JSON configuration for recurring tasks
 * @property {string} dateCreated - Creation timestamp
 * @property {string} dateModified - Last modification timestamp
 */
export interface TaskEntity {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description: string;
  dueDate: string;
  priority: number;
  status: number;
  timeEstimate: number | null;
  recurrenceConfig: string | null;
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for creating a new task
 */
export interface TaskCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: number;
  timeEstimate?: number;
  recurrenceConfig?: string;
}

/**
 * @interface TaskUpdateRequest
 * @description Request parameters for updating an existing task
 */
export interface TaskUpdateRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: number;
  status: number;
  timeEstimate?: number;
  recurrenceConfig?: string;
}

/**
 * @interface TaskListRequest
 * @description Request parameters for listing tasks
 */
export interface TaskListRequest {
  idAccount: number;
  idUser: number;
}

/**
 * @interface TaskGetRequest
 * @description Request parameters for retrieving a specific task
 */
export interface TaskGetRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
}

/**
 * @interface TaskDeleteRequest
 * @description Request parameters for deleting a task
 */
export interface TaskDeleteRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
}

/**
 * @enum TaskPriority
 * @description Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

/**
 * @enum TaskStatus
 * @description Task status values
 */
export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}
