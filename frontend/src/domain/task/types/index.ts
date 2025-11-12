export interface Task {
  idTask: number;
  title: string;
  description: string | null;
  dueDate: string;
  priority: 0 | 1 | 2;
  status: 0 | 1 | 2 | 3;
  timeEstimate: number | null;
  recurrenceConfig: string | null;
  dateCreated: string;
  dateModified?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  dueDate: string;
  priority: 0 | 1 | 2;
  timeEstimate?: number | null;
  recurrenceConfig?: string | null;
}

export interface UpdateTaskDto {
  title: string;
  description?: string | null;
  dueDate: string;
  priority: 0 | 1 | 2;
  status: 0 | 1 | 2 | 3;
  timeEstimate?: number | null;
  recurrenceConfig?: string | null;
}

export interface TaskListParams {
  status?: number;
  priority?: number;
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.Low]: 'Baixa',
  [TaskPriority.Medium]: 'Média',
  [TaskPriority.High]: 'Alta',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: 'Pendente',
  [TaskStatus.InProgress]: 'Em andamento',
  [TaskStatus.Completed]: 'Concluída',
  [TaskStatus.Cancelled]: 'Cancelada',
};
