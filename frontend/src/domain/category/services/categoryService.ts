import { authenticatedClient } from '@/core/lib/api';
import type { Category, CreateCategoryDto, UpdateCategoryDto, DeleteCategoryDto } from '../types';

export const categoryService = {
  async list(): Promise<Category[]> {
    const response = await authenticatedClient.get('/category');
    return response.data.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await authenticatedClient.get(`/category/${id}`);
    return response.data.data;
  },

  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await authenticatedClient.post('/category', data);
    return response.data.data;
  },

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    const response = await authenticatedClient.put(`/category/${id}`, data);
    return response.data.data;
  },

  async delete(id: number, params?: DeleteCategoryDto): Promise<void> {
    await authenticatedClient.delete(`/category/${id}`, { params });
  },
};
