import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryUpdateOptions, UseCategoryUpdateReturn } from './types';

export const useCategoryUpdate = (
  options: UseCategoryUpdateOptions = {}
): UseCategoryUpdateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => categoryService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    update: (id, data) => mutation.mutateAsync({ id, data }),
    isUpdating: mutation.isPending,
    error: mutation.error as Error | null,
  };
};
