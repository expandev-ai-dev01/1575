import type { UpdateCategoryDto, Category } from '../../types';

export interface CategoryFormProps {
  onSubmit: (data: UpdateCategoryDto) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Category;
  mode?: 'create' | 'edit';
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  isFavorite: boolean;
}
