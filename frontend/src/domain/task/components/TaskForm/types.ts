import type { CreateTaskDto } from '../../types';

export interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  timeEstimate: string;
}
