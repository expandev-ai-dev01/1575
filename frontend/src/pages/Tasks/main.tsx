import { useState } from 'react';
import { useTaskList, useTaskCreate } from '@/domain/task/hooks';
import { TaskForm, TaskList } from '@/domain/task/components';
import type { CreateTaskDto, Task } from '@/domain/task/types';
import type { TasksPageProps } from './types';

export const TasksPage = (props: TasksPageProps) => {
  const [showForm, setShowForm] = useState(false);
  const { data: tasks, isLoading, refetch } = useTaskList();
  const { create, isCreating } = useTaskCreate({
    onSuccess: () => {
      setShowForm(false);
      refetch();
      alert('Tarefa criada com sucesso!');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar tarefa: ${error.message}`);
    },
  });

  const handleSubmit = async (data: CreateTaskDto) => {
    try {
      await create(data);
    } catch (error: unknown) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Nova Tarefa'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Criar Nova Tarefa</h2>
            <TaskForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isSubmitting={isCreating}
            />
          </div>
        )}
      </div>

      <TaskList tasks={tasks || []} isLoading={isLoading} onTaskClick={handleTaskClick} />
    </div>
  );
};

export default TasksPage;
