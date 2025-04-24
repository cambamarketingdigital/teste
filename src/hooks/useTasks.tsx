import { create } from 'zustand';
import { Task, TaskHistory } from '../types/task';
import useNotifications from './useNotifications';

interface TaskStore {
  tasks: Task[];
  taskHistory: TaskHistory[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  completeTask: (taskId: string, userId: string) => void;
  getTasksByUser: (userId: string) => Task[];
  getTaskHistory: (taskId: string) => TaskHistory[];
}

const useTasks = create<TaskStore>((set, get) => ({
  tasks: [],
  taskHistory: [],

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newHistory: TaskHistory = {
      id: Math.random().toString(36).substr(2, 9),
      taskId: newTask.id,
      action: 'created',
      description: `Tarefa criada por ${task.assignedBy}`,
      performedBy: task.assignedBy,
      createdAt: new Date(),
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
      taskHistory: [...state.taskHistory, newHistory],
    }));
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      ),
    }));

    const newHistory: TaskHistory = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      action: 'updated',
      description: `Tarefa atualizada`,
      performedBy: updates.assignedBy || '',
      createdAt: new Date(),
    };

    set((state) => ({
      taskHistory: [...state.taskHistory, newHistory],
    }));
  },

  completeTask: (taskId, userId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'done',
              completedAt: new Date(),
              updatedAt: new Date(),
            }
          : t
      ),
    }));

    const newHistory: TaskHistory = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      action: 'completed',
      description: `Tarefa concluída por ${userId}`,
      performedBy: userId,
      createdAt: new Date(),
    };

    set((state) => ({
      taskHistory: [...state.taskHistory, newHistory],
    }));

    if (task.assignedBy !== userId) {
      const { addNotification } = useNotifications.getState();
      addNotification({
        title: 'Tarefa Concluída',
        message: `A tarefa "${task.title}" foi concluída`,
        type: 'default',
      });
    }
  },

  getTasksByUser: (userId) => {
    return get().tasks.filter((task) => task.assignedTo === userId);
  },

  getTaskHistory: (taskId) => {
    return get().taskHistory.filter((history) => history.taskId === taskId);
  },
}));

export default useTasks;