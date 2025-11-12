import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { categoryGet, categoryUpdate, categoryDelete } from '@/services/category';
import { zName, zNullableDescription, zNullableString, zNullableFK } from '@/utils/zodValidation';

const securable = 'CATEGORY';

/**
 * @api {get} /api/v1/internal/category/:id Get Category
 * @apiName GetCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information for a specific category
 *
 * @apiParam {Number} id Category identifier
 *
 * @apiSuccess {Number} idCategory Category identifier
 * @apiSuccess {String} name Category name
 * @apiSuccess {String} description Category description
 * @apiSuccess {String} color Category color
 * @apiSuccess {String} icon Category icon
 * @apiSuccess {Number} taskCount Number of tasks in category
 *
 * @apiError {String} NotFoundError Category not found
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
    const data = await categoryGet({
      ...validated.credential,
      idCategory: validated.params.id,
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
 * @api {put} /api/v1/internal/category/:id Update Category
 * @apiName UpdateCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing category with new values
 *
 * @apiParam {Number} id Category identifier
 * @apiParam {String} name Category name (2-50 characters)
 * @apiParam {String} [description] Category description (max 200 characters)
 * @apiParam {String} color Hexadecimal color code
 * @apiParam {String} [icon] Icon identifier
 * @apiParam {Boolean} isFavorite Favorite flag
 *
 * @apiSuccess {Number} idCategory Category identifier
 * @apiSuccess {String} name Updated category name
 * @apiSuccess {String} dateModified Modification timestamp
 *
 * @apiError {String} NotFoundError Category not found
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
    name: zName.max(50),
    description: zNullableDescription,
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    icon: zNullableString(50),
    isFavorite: z.boolean(),
  });

  const combinedSchema = paramsSchema.merge(bodySchema);

  const [validated, error] = await operation.update(req, combinedSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await categoryUpdate({
      ...validated.credential,
      idCategory: validated.params.id,
      name: validated.params.name,
      description: validated.params.description,
      color: validated.params.color,
      icon: validated.params.icon,
      isFavorite: validated.params.isFavorite,
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
 * @api {delete} /api/v1/internal/category/:id Delete Category
 * @apiName DeleteCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Performs soft delete on a category
 *
 * @apiParam {Number} id Category identifier
 * @apiParam {Number} [idTargetCategory] Target category for task reassignment
 *
 * @apiSuccess {Boolean} success Deletion success indicator
 *
 * @apiError {String} NotFoundError Category not found
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
    idTargetCategory: z.coerce.number().int().positive().optional(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await categoryDelete({
      ...validated.credential,
      idCategory: validated.params.id,
      idTargetCategory: validated.params.idTargetCategory,
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
