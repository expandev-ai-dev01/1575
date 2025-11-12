import type { CategorySelectorProps } from './types';

export const CategorySelector = (props: CategorySelectorProps) => {
  const {
    categories,
    selectedCategories = [],
    onCategorySelect,
    onCategoryDeselect,
    isLoading = false,
    multiple = true,
  } = props;

  const handleCategoryClick = (categoryId: number) => {
    const isSelected = selectedCategories.includes(categoryId);

    if (isSelected) {
      onCategoryDeselect?.(categoryId);
    } else {
      if (!multiple) {
        selectedCategories.forEach((id) => onCategoryDeselect?.(id));
      }
      onCategorySelect?.(categoryId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma categoria disponível</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category.idCategory);

        return (
          <button
            key={category.idCategory}
            onClick={() => handleCategoryClick(category.idCategory)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              isSelected ? 'ring-2 ring-offset-2' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: category.color,
              color: '#ffffff',
            }}
          >
            {category.icon && <span className="mr-1">{category.icon}</span>}
            {category.name}
          </button>
        );
      })}
    </div>
  );
};
