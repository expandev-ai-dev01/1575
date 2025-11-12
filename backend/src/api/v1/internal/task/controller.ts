import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskCreate, taskList, taskGet, taskUpdate, taskDelete } from '@/services/task';
import { zName, zNullableDescription, zDateString, zNullableString } from '@/utils/zodValidation';

const securable = 'TASK';

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with specified properties
 *
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {String} dueDate Task due date (ISO date format)
 * @apiParam {Number} priority Priority level (0=Low, 1=Medium, 2=High)
 * @apiParam {Number} [timeEstimate] Time estimate in minutes (5-1440)
 * @apiParam {String} [recurrenceConfig] JSON configuration for recurring tasks
 *
 * @apiSuccess {Number} idTask Task identifier
 * @apiSuccess {String} title Task title
 * @apiSuccess {String} description Task description
 * @apiSuccess {String} dueDate Task due date
 * @apiSuccess {Number} priority Priority level
 * @apiSuccess {Number} status Task status
 * @apiSuccess {String} dateCreated Creation timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    title: zName,
    description: zNullableDescription,
    dueDate: zDateString,
    priority: z.number().int().min(0).max(2),
    timeEstimate: z.number().int().min(5).max(1440).nullable().optional(),
    recurrenceConfig: zNullableString(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskCreate({
      ...validated.credential,
      ...validated.params,
    });

    res.status(201).json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/task List Tasks
 * @apiName ListTasks
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a list of tasks for the authenticated user
 *
 * @apiSuccess {Array} tasks Array of task objects
 * @apiSuccess {Number} tasks.idTask Task identifier
 * @apiSuccess {String} tasks.title Task title
 * @apiSuccess {String} tasks.dueDate Task due date
 * @apiSuccess {Number} tasks.priority Priority level
 * @apiSuccess {Number} tasks.status Task status
 *
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({});

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskList({
      ...validated.credential,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
