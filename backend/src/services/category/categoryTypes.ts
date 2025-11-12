/**
 * @interface CategoryEntity
 * @description Represents a category entity in the system
 *
 * @property {number} idCategory - Unique category identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User identifier who created the category
 * @property {string} name - Category name
 * @property {string} description - Category description
 * @property {string} color - Category color (hexadecimal)
 * @property {string | null} icon - Category icon identifier
 * @property {number | null} idParent - Parent category identifier
 * @property {boolean} isDefault - Default category flag
 * @property {number} sortOrder - Sort order
 * @property {boolean} isFavorite - Favorite flag
 * @property {number} taskCount - Number of tasks in category
 * @property {string} dateCreated - Creation timestamp
 * @property {string} dateModified - Last modification timestamp
 */
export interface CategoryEntity {
  idCategory: number;
  idAccount: number;
  idUser: number;
  name: string;
  description: string;
  color: string;
  icon: string | null;
  idParent: number | null;
  isDefault: boolean;
  sortOrder: number;
  isFavorite: boolean;
  taskCount?: number;
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface CategoryCreateRequest
 * @description Request parameters for creating a new category
 */
export interface CategoryCreateRequest {
  idAccount: number;
  idUser: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  idParent?: number;
  isFavorite?: boolean;
}

/**
 * @interface CategoryUpdateRequest
 * @description Request parameters for updating an existing category
 */
export interface CategoryUpdateRequest {
  idAccount: number;
  idUser: number;
  idCategory: number;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isFavorite: boolean;
}

/**
 * @interface CategoryListRequest
 * @description Request parameters for listing categories
 */
export interface CategoryListRequest {
  idAccount: number;
  idUser: number;
}

/**
 * @interface CategoryGetRequest
 * @description Request parameters for retrieving a specific category
 */
export interface CategoryGetRequest {
  idAccount: number;
  idUser: number;
  idCategory: number;
}

/**
 * @interface CategoryDeleteRequest
 * @description Request parameters for deleting a category
 */
export interface CategoryDeleteRequest {
  idAccount: number;
  idUser: number;
  idCategory: number;
  idTargetCategory?: number;
}

/**
 * @interface TaskCategoryAssignRequest
 * @description Request parameters for assigning categories to a task
 */
export interface TaskCategoryAssignRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
  categoryIds: string;
}

/**
 * @interface TaskCategoryRemoveRequest
 * @description Request parameters for removing a category from a task
 */
export interface TaskCategoryRemoveRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
  idCategory: number;
}
