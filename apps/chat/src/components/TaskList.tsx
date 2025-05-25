import { useEffect } from 'react';
import { CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';
import { useChat } from '../providers/ChatProvider';
import { formatRelativeTime, getPriorityColor, formatPriority } from '@repo/shared';
import type { TaskDTO } from '@repo/mcp-types';

// Type assertion for lucide icons to work with React 19
const CheckCircleIcon = CheckCircle as React.ComponentType<{ className?: string }>;
const CircleIcon = Circle as React.ComponentType<{ className?: string }>;
const ClockIcon = Clock as React.ComponentType<{ className?: string }>;
const AlertTriangleIcon = AlertTriangle as React.ComponentType<{ className?: string }>;

export const TaskList = () => {
  const { tasks, refreshTasks } = useChat();

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'MEDIUM':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <CircleIcon className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
        <p className="text-sm text-gray-600">{tasks.length} total tasks</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <CircleIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tasks yet</p>
            <p className="text-sm mt-1">Ask the AI to create some tasks for you!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: TaskDTO) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border transition-colors ${
                  task.completed
                    ? 'bg-gray-50 border-gray-200 opacity-75'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {task.completed ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <CircleIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p
                        className={`text-xs mt-1 ${
                          task.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(task.priority)}
                        <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {formatPriority(task.priority)}
                        </span>
                      </div>

                      {task.dueDate && (
                        <span className="text-xs text-gray-500">
                          Due {formatRelativeTime(task.dueDate)}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      Created {formatRelativeTime(task.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
