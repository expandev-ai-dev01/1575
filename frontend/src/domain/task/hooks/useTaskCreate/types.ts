import type { CreateTaskDto, Task } from '../../types';

export interface UseTaskCreateOptions {
  onSuccess?: (task: Task) => void;
  onError?: (error: Error) => void;
}

export interface UseTaskCreateReturn {
  create: (data: CreateTaskDto) => Promise<Task>;
  isCreating: boolean;
  error: Error | null;
}
