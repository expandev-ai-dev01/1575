import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TaskListProps } from './types';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../types';

export const TaskList = (props: TaskListProps) => {
  const { tasks, isLoading = false, onTaskClick } = props;

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

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">Nenhuma tarefa encontrada</p>
      </div>
    );
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 2:
        return 'bg-red-100 text-red-800';
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 0:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 2:
        return 'bg-green-100 text-green-800';
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 3:
        return 'bg-gray-100 text-gray-800';
      case 0:
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.idTask}
          onClick={() => onTaskClick?.(task)}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {PRIORITY_LABELS[task.priority as 0 | 1 | 2]}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {STATUS_LABELS[task.status as 0 | 1 | 2 | 3]}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>
                Vencimento:{' '}
                {format(new Date(task.dueDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            {task.timeEstimate && (
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span>{task.timeEstimate} min</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
