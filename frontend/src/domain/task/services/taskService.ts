import { authenticatedClient } from '@/core/lib/api';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskListParams } from '../types';

export const taskService = {
  async list(params?: TaskListParams): Promise<Task[]> {
    const response = await authenticatedClient.get('/task', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await authenticatedClient.get(`/task/${id}`);
    return response.data.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await authenticatedClient.post('/task', data);
    return response.data.data;
  },

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const response = await authenticatedClient.put(`/task/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await authenticatedClient.delete(`/task/${id}`);
  },
};
