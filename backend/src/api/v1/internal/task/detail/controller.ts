import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskGet, taskUpdate, taskDelete } from '@/services/task';
import { zName, zNullableDescription, zDateString, zNullableString } from '@/utils/zodValidation';

const securable = 'TASK';

/**
 * @api {get} /api/v1/internal/task/:id Get Task
 * @apiName GetTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information for a specific task
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Number} idTask Task identifier
 * @apiSuccess {String} title Task title
 * @apiSuccess {String} description Task description
 * @apiSuccess {String} dueDate Task due date
 * @apiSuccess {Number} priority Priority level
 * @apiSuccess {Number} status Task status
 * @apiSuccess {Number} timeEstimate Time estimate in minutes
 * @apiSuccess {String} recurrenceConfig Recurrence configuration
 * @apiSuccess {String} dateCreated Creation timestamp
 * @apiSuccess {String} dateModified Modification timestamp
 *
 * @apiError {String} NotFoundError Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskGet({
      ...validated.credential,
      idTask: validated.params.id,
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

/**
 * @api {put} /api/v1/internal/task/:id Update Task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing task with new values
 *
 * @apiParam {Number} id Task identifier
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {String} dueDate Task due date (ISO date format)
 * @apiParam {Number} priority Priority level (0=Low, 1=Medium, 2=High)
 * @apiParam {Number} status Task status (0=Pending, 1=InProgress, 2=Completed, 3=Cancelled)
 * @apiParam {Number} [timeEstimate] Time estimate in minutes (5-1440)
 * @apiParam {String} [recurrenceConfig] JSON configuration for recurring tasks
 *
 * @apiSuccess {Number} idTask Task identifier
 * @apiSuccess {String} title Updated task title
 * @apiSuccess {String} dateModified Modification timestamp
 *
 * @apiError {String} NotFoundError Task not found
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const bodySchema = z.object({
    title: zName,
    description: zNullableDescription,
    dueDate: zDateString,
    priority: z.number().int().min(0).max(2),
    status: z.number().int().min(0).max(3),
    timeEstimate: z.number().int().min(5).max(1440).nullable().optional(),
    recurrenceConfig: zNullableString(),
  });

  const combinedSchema = paramsSchema.merge(bodySchema);

  const [validated, error] = await operation.update(req, combinedSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskUpdate({
      ...validated.credential,
      idTask: validated.params.id,
      title: validated.params.title,
      description: validated.params.description,
      dueDate: validated.params.dueDate,
      priority: validated.params.priority,
      status: validated.params.status,
      timeEstimate: validated.params.timeEstimate,
      recurrenceConfig: validated.params.recurrenceConfig,
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

/**
 * @api {delete} /api/v1/internal/task/:id Delete Task
 * @apiName DeleteTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Performs soft delete on a task
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Boolean} success Deletion success indicator
 *
 * @apiError {String} NotFoundError Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskDelete({
      ...validated.credential,
      idTask: validated.params.id,
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
