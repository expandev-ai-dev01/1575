import type { CategoryListProps } from './types';

export const CategoryList = (props: CategoryListProps) => {
  const {
    categories,
    isLoading = false,
    onCategoryClick,
    onCategoryEdit,
    onCategoryDelete,
  } = props;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">Nenhuma categoria encontrada</p>
      </div>
    );
  }

  const favoriteCategories = categories.filter((cat) => cat.isFavorite);
  const regularCategories = categories.filter((cat) => !cat.isFavorite);

  const renderCategory = (category: any) => (
    <div
      key={category.idCategory}
      onClick={() => onCategoryClick?.(category)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: category.color }}
          >
            {category.icon || '📁'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {category.isFavorite && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⭐ Favorita
            </span>
          )}
          {category.isDefault && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Padrão
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="font-medium">{category.taskCount || 0}</span> tarefas
        </div>
        <div className="flex gap-2">
          {onCategoryEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCategoryEdit(category);
              }}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Editar
            </button>
          )}
          {onCategoryDelete && !category.isDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCategoryDelete(category);
              }}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {favoriteCategories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorias Favoritas</h2>
          <div className="space-y-4">{favoriteCategories.map(renderCategory)}</div>
        </div>
      )}

      {regularCategories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Todas as Categorias</h2>
          <div className="space-y-4">{regularCategories.map(renderCategory)}</div>
        </div>
      )}
    </div>
  );
};
