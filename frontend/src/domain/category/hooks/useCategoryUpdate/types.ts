import type { UpdateCategoryDto, Category } from '../../types';

export interface UseCategoryUpdateOptions {
  onSuccess?: (category: Category) => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryUpdateReturn {
  update: (id: number, data: UpdateCategoryDto) => Promise<Category>;
  isUpdating: boolean;
  error: Error | null;
}
