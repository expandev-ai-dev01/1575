import { useState } from 'react';
import {
  useCategoryList,
  useCategoryCreate,
  useCategoryUpdate,
  useCategoryDelete,
} from '@/domain/category/hooks';
import { CategoryForm, CategoryList } from '@/domain/category/components';
import type { CreateCategoryDto, UpdateCategoryDto, Category } from '@/domain/category/types';
import type { CategoriesPageProps } from './types';

export const CategoriesPage = (props: CategoriesPageProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading, refetch } = useCategoryList();

  const { create, isCreating } = useCategoryCreate({
    onSuccess: () => {
      setShowForm(false);
      refetch();
      alert('Categoria criada com sucesso!');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar categoria: ${error.message}`);
    },
  });

  const { update, isUpdating } = useCategoryUpdate({
    onSuccess: () => {
      setEditingCategory(null);
      refetch();
      alert('Categoria atualizada com sucesso!');
    },
    onError: (error: Error) => {
      alert(`Erro ao atualizar categoria: ${error.message}`);
    },
  });

  const { deleteCategory, isDeleting } = useCategoryDelete({
    onSuccess: () => {
      setDeletingCategory(null);
      refetch();
      alert('Categoria excluída com sucesso!');
    },
    onError: (error: Error) => {
      alert(`Erro ao excluir categoria: ${error.message}`);
    },
  });

  const handleCreateSubmit = async (data: CreateCategoryDto) => {
    try {
      await create(data);
    } catch (error: unknown) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateSubmit = async (data: UpdateCategoryDto) => {
    if (!editingCategory) return;

    try {
      await update(editingCategory.idCategory, data);
    } catch (error: unknown) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (category: Category) => {
    if (category.isDefault) {
      alert('Categorias padrão não podem ser excluídas');
      return;
    }

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a categoria "${category.name}"?\n\nAs tarefas associadas ficarão sem categoria.`
    );

    if (!confirmed) return;

    try {
      await deleteCategory(category.idCategory);
    } catch (error: unknown) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCategoryClick = (category: Category) => {
    console.log('Category clicked:', category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingCategory(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Nova Categoria'}
          </button>
        </div>

        {(showForm || editingCategory) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Editar Categoria' : 'Criar Nova Categoria'}
            </h2>
            <CategoryForm
              onSubmit={editingCategory ? handleUpdateSubmit : handleCreateSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
              isSubmitting={isCreating || isUpdating}
              initialData={editingCategory || undefined}
              mode={editingCategory ? 'edit' : 'create'}
            />
          </div>
        )}
      </div>

      <CategoryList
        categories={categories || []}
        isLoading={isLoading}
        onCategoryClick={handleCategoryClick}
        onCategoryEdit={(category) => {
          setEditingCategory(category);
          setShowForm(false);
        }}
        onCategoryDelete={handleDelete}
      />
    </div>
  );
};

export default CategoriesPage;
