import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryDeleteOptions, UseCategoryDeleteReturn } from './types';

export const useCategoryDelete = (
  options: UseCategoryDeleteOptions = {}
): UseCategoryDeleteReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, params }: { id: number; params?: any }) =>
      categoryService.delete(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    deleteCategory: (id, params) => mutation.mutateAsync({ id, params }),
    isDeleting: mutation.isPending,
    error: mutation.error as Error | null,
  };
};
