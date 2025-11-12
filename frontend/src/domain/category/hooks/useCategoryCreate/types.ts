import type { CreateCategoryDto, Category } from '../../types';

export interface UseCategoryCreateOptions {
  onSuccess?: (category: Category) => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryCreateReturn {
  create: (data: CreateCategoryDto) => Promise<Category>;
  isCreating: boolean;
  error: Error | null;
}
