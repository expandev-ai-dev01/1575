import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskCategoryAssign, taskCategoryRemove } from '@/services/category';

const securable = 'TASK';

/**
 * @api {post} /api/v1/internal/task/:id/category Assign Categories to Task
 * @apiName AssignTaskCategories
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Assigns one or more categories to a task
 *
 * @apiParam {Number} id Task identifier
 * @apiParam {String} categoryIds Comma-separated list of category IDs
 *
 * @apiSuccess {Boolean} success Assignment success indicator
 * @apiSuccess {Number} assignedCount Number of categories assigned
 *
 * @apiError {String} NotFoundError Task or categories not found
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const bodySchema = z.object({
    categoryIds: z.string().min(1),
  });

  const combinedSchema = paramsSchema.merge(bodySchema);

  const [validated, error] = await operation.update(req, combinedSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskCategoryAssign({
      ...validated.credential,
      idTask: validated.params.id,
      categoryIds: validated.params.categoryIds,
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
 * @api {delete} /api/v1/internal/task/:id/category/:idCategory Remove Category from Task
 * @apiName RemoveTaskCategory
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Removes a category association from a task
 *
 * @apiParam {Number} id Task identifier
 * @apiParam {Number} idCategory Category identifier
 *
 * @apiSuccess {Boolean} success Removal success indicator
 *
 * @apiError {String} NotFoundError Task or category association not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
    idCategory: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskCategoryRemove({
      ...validated.credential,
      idTask: validated.params.id,
      idCategory: validated.params.idCategory,
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
