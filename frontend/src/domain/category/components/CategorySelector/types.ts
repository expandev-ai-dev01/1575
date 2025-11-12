import type { Category } from '../../types';

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategories?: number[];
  onCategorySelect?: (categoryId: number) => void;
  onCategoryDeselect?: (categoryId: number) => void;
  isLoading?: boolean;
  multiple?: boolean;
}
