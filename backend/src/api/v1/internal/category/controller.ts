import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { categoryCreate, categoryList } from '@/services/category';
import { zName, zNullableDescription, zNullableString, zNullableFK } from '@/utils/zodValidation';

const securable = 'CATEGORY';

/**
 * @api {post} /api/v1/internal/category Create Category
 * @apiName CreateCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new category with specified properties
 *
 * @apiParam {String} name Category name (2-50 characters)
 * @apiParam {String} [description] Category description (max 200 characters)
 * @apiParam {String} [color] Hexadecimal color code (default: #4287f5)
 * @apiParam {String} [icon] Icon identifier
 * @apiParam {Number} [idParent] Parent category identifier
 * @apiParam {Boolean} [isFavorite] Favorite flag (default: false)
 *
 * @apiSuccess {Number} idCategory Category identifier
 * @apiSuccess {String} name Category name
 * @apiSuccess {String} description Category description
 * @apiSuccess {String} color Category color
 * @apiSuccess {String} dateCreated Creation timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    name: zName.max(50),
    description: zNullableDescription,
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
    icon: zNullableString(50),
    idParent: zNullableFK,
    isFavorite: z.boolean().optional(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await categoryCreate({
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
 * @api {get} /api/v1/internal/category List Categories
 * @apiName ListCategories
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a list of categories for the authenticated user
 *
 * @apiSuccess {Array} categories Array of category objects
 * @apiSuccess {Number} categories.idCategory Category identifier
 * @apiSuccess {String} categories.name Category name
 * @apiSuccess {String} categories.color Category color
 * @apiSuccess {Number} categories.taskCount Number of tasks in category
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
    const data = await categoryList({
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
