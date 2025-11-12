export interface Category {
  idCategory: number;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  idParent: number | null;
  isDefault: boolean;
  order: number;
  isFavorite: boolean;
  dateCreated: string;
  dateModified?: string;
  taskCount?: number;
}

export interface CreateCategoryDto {
  name: string;
  description?: string | null;
  color: string;
  icon?: string | null;
  idParent?: number | null;
  isFavorite: boolean;
}

export interface UpdateCategoryDto {
  name: string;
  description?: string | null;
  color: string;
  icon?: string | null;
  isFavorite: boolean;
}

export interface DeleteCategoryDto {
  idTargetCategory?: number;
}
