import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TaskFormProps, TaskFormData } from './types';
import { TaskPriority } from '../../types';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres').optional(),
  dueDate: z.string().min(1, 'A data de vencimento é obrigatória'),
  priority: z.string().min(1, 'Selecione um nível de prioridade'),
  timeEstimate: z.string().optional(),
});

export const TaskForm = (props: TaskFormProps) => {
  const { onSubmit, onCancel, isSubmitting = false } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: String(TaskPriority.Medium),
      timeEstimate: '',
    },
  });

  const handleFormSubmit = (data: TaskFormData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(data.dueDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('A data de vencimento não pode ser anterior à data atual');
      return;
    }

    const submitData = {
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate,
      priority: parseInt(data.priority) as 0 | 1 | 2,
      timeEstimate: data.timeEstimate ? parseInt(data.timeEstimate) : null,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o título da tarefa"
          disabled={isSubmitting}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite a descrição da tarefa"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Data de Vencimento <span className="text-red-500">*</span>
        </label>
        <input
          {...register('dueDate')}
          type="date"
          id="dueDate"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Prioridade <span className="text-red-500">*</span>
        </label>
        <select
          {...register('priority')}
          id="priority"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="">Selecione a prioridade</option>
          <option value={TaskPriority.Low}>Baixa</option>
          <option value={TaskPriority.Medium}>Média</option>
          <option value={TaskPriority.High}>Alta</option>
        </select>
        {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
      </div>

      <div>
        <label htmlFor="timeEstimate" className="block text-sm font-medium text-gray-700 mb-1">
          Estimativa de Tempo (minutos)
        </label>
        <input
          {...register('timeEstimate')}
          type="number"
          id="timeEstimate"
          min="5"
          max="1440"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: 60"
          disabled={isSubmitting}
        />
        {errors.timeEstimate && (
          <p className="mt-1 text-sm text-red-600">{errors.timeEstimate.message}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">Entre 5 e 1440 minutos (24 horas)</p>
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
          {isSubmitting ? 'Salvando...' : 'Salvar Tarefa'}
        </button>
      </div>
    </form>
  );
};
