import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CategoryFormProps, CategoryFormData } from './types';

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'O nome não pode conter caracteres especiais exceto hífen e underscore'
    ),
  description: z.string().max(200, 'A descrição deve ter no máximo 200 caracteres').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida. Use formato hexadecimal (#RRGGBB)'),
  icon: z.string().optional(),
  isFavorite: z.boolean(),
});

export const CategoryForm = (props: CategoryFormProps) => {
  const { onSubmit, onCancel, isSubmitting = false, initialData, mode = 'create' } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      color: initialData?.color || '#4287f5',
      icon: initialData?.icon || '',
      isFavorite: initialData?.isFavorite || false,
    },
  });

  const handleFormSubmit = (data: CategoryFormData) => {
    const submitData = {
      name: data.name,
      description: data.description || null,
      color: data.color,
      icon: data.icon || null,
      isFavorite: data.isFavorite,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o nome da categoria"
          disabled={isSubmitting}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite a descrição da categoria"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
          Cor <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 items-center">
          <input
            {...register('color')}
            type="color"
            id="color"
            className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
            disabled={isSubmitting}
          />
          <input
            {...register('color')}
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#4287f5"
            disabled={isSubmitting}
          />
        </div>
        {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>}
      </div>

      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
          Ícone
        </label>
        <input
          {...register('icon')}
          type="text"
          id="icon"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: 📁"
          disabled={isSubmitting}
        />
        {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>}
      </div>

      <div className="flex items-center">
        <input
          {...register('isFavorite')}
          type="checkbox"
          id="isFavorite"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-700">
          Marcar como favorita
        </label>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Salvando...'
            : mode === 'create'
            ? 'Criar Categoria'
            : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
};
