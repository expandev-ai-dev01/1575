import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryListOptions, UseCategoryListReturn } from './types';

export const useCategoryList = (options: UseCategoryListOptions = {}): UseCategoryListReturn => {
  const { enabled = true } = options;

  const queryKey = ['categories'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => categoryService.list(),
    enabled,
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
