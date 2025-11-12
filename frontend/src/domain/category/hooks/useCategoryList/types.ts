import type { Category } from '../../types';

export interface UseCategoryListOptions {
  enabled?: boolean;
}

export interface UseCategoryListReturn {
  data: Category[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
