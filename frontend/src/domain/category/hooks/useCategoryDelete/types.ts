import type { DeleteCategoryDto } from '../../types';

export interface UseCategoryDeleteOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryDeleteReturn {
  deleteCategory: (id: number, params?: DeleteCategoryDto) => Promise<void>;
  isDeleting: boolean;
  error: Error | null;
}
