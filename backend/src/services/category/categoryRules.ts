import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  CategoryEntity,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryListRequest,
  CategoryGetRequest,
  CategoryDeleteRequest,
  TaskCategoryAssignRequest,
  TaskCategoryRemoveRequest,
} from './categoryTypes';

/**
 * @summary
 * Creates a new category with all specified properties
 *
 * @function categoryCreate
 * @module category
 *
 * @param {CategoryCreateRequest} params - Category creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.name - Category name
 * @param {string} params.description - Category description
 * @param {string} params.color - Category color
 * @param {string} params.icon - Category icon
 * @param {number} params.idParent - Parent category identifier
 * @param {boolean} params.isFavorite - Favorite flag
 *
 * @returns {Promise<CategoryEntity>} Created category entity
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const category = await categoryCreate({
 *   idAccount: 1,
 *   idUser: 1,
 *   name: 'Work Projects',
 *   description: 'Work-related project tasks',
 *   color: '#FF5722',
 *   icon: 'briefcase'
 * });
 */
export async function categoryCreate(params: CategoryCreateRequest): Promise<CategoryEntity> {
  const result = await dbRequest(
    '[functional].[spCategoryCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      name: params.name,
      description: params.description || '',
      color: params.color || '#4287f5',
      icon: params.icon || null,
      idParent: params.idParent || null,
      isFavorite: params.isFavorite || false,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves a list of categories for a specific user
 *
 * @function categoryList
 * @module category
 *
 * @param {CategoryListRequest} params - Category list parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 *
 * @returns {Promise<CategoryEntity[]>} Array of category entities
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const categories = await categoryList({
 *   idAccount: 1,
 *   idUser: 1
 * });
 */
export async function categoryList(params: CategoryListRequest): Promise<CategoryEntity[]> {
  const result = await dbRequest(
    '[functional].[spCategoryList]',
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
 * Retrieves detailed information for a specific category
 *
 * @function categoryGet
 * @module category
 *
 * @param {CategoryGetRequest} params - Category retrieval parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idCategory - Category identifier
 *
 * @returns {Promise<CategoryEntity>} Category entity with complete information
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When category does not exist
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const category = await categoryGet({
 *   idAccount: 1,
 *   idUser: 1,
 *   idCategory: 5
 * });
 */
export async function categoryGet(params: CategoryGetRequest): Promise<CategoryEntity> {
  const result = await dbRequest(
    '[functional].[spCategoryGet]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idCategory: params.idCategory,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Updates an existing category with new values
 *
 * @function categoryUpdate
 * @module category
 *
 * @param {CategoryUpdateRequest} params - Category update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idCategory - Category identifier
 * @param {string} params.name - Updated category name
 * @param {string} params.description - Updated category description
 * @param {string} params.color - Updated category color
 * @param {string} params.icon - Updated category icon
 * @param {boolean} params.isFavorite - Updated favorite flag
 *
 * @returns {Promise<CategoryEntity>} Updated category entity
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When category does not exist
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const updatedCategory = await categoryUpdate({
 *   idAccount: 1,
 *   idUser: 1,
 *   idCategory: 5,
 *   name: 'Updated Category Name',
 *   description: 'Updated description',
 *   color: '#2196F3',
 *   isFavorite: true
 * });
 */
export async function categoryUpdate(params: CategoryUpdateRequest): Promise<CategoryEntity> {
  const result = await dbRequest(
    '[functional].[spCategoryUpdate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idCategory: params.idCategory,
      name: params.name,
      description: params.description || '',
      color: params.color,
      icon: params.icon || null,
      isFavorite: params.isFavorite,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Performs soft delete on a category
 *
 * @function categoryDelete
 * @module category
 *
 * @param {CategoryDeleteRequest} params - Category deletion parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idCategory - Category identifier
 * @param {number} params.idTargetCategory - Target category for task reassignment
 *
 * @returns {Promise<{ success: boolean }>} Deletion confirmation
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When category does not exist
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await categoryDelete({
 *   idAccount: 1,
 *   idUser: 1,
 *   idCategory: 5,
 *   idTargetCategory: 3
 * });
 */
export async function categoryDelete(params: CategoryDeleteRequest): Promise<{ success: boolean }> {
  const result = await dbRequest(
    '[functional].[spCategoryDelete]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idCategory: params.idCategory,
      idTargetCategory: params.idTargetCategory || null,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Assigns categories to a task
 *
 * @function taskCategoryAssign
 * @module category
 *
 * @param {TaskCategoryAssignRequest} params - Assignment parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idTask - Task identifier
 * @param {string} params.categoryIds - Comma-separated category IDs
 *
 * @returns {Promise<{ success: boolean; assignedCount: number }>} Assignment confirmation
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When task or categories do not exist
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await taskCategoryAssign({
 *   idAccount: 1,
 *   idUser: 1,
 *   idTask: 123,
 *   categoryIds: '1,2,3'
 * });
 */
export async function taskCategoryAssign(
  params: TaskCategoryAssignRequest
): Promise<{ success: boolean; assignedCount: number }> {
  const result = await dbRequest(
    '[functional].[spTaskCategoryAssign]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idTask: params.idTask,
      categoryIds: params.categoryIds,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Removes a category association from a task
 *
 * @function taskCategoryRemove
 * @module category
 *
 * @param {TaskCategoryRemoveRequest} params - Removal parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idTask - Task identifier
 * @param {number} params.idCategory - Category identifier
 *
 * @returns {Promise<{ success: boolean }>} Removal confirmation
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When association does not exist
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await taskCategoryRemove({
 *   idAccount: 1,
 *   idUser: 1,
 *   idTask: 123,
 *   idCategory: 5
 * });
 */
export async function taskCategoryRemove(
  params: TaskCategoryRemoveRequest
): Promise<{ success: boolean }> {
  const result = await dbRequest(
    '[functional].[spTaskCategoryRemove]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idTask: params.idTask,
      idCategory: params.idCategory,
    },
    ExpectedReturn.Single
  );

  return result;
}
