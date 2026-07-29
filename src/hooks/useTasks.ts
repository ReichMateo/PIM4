import { useEffect, useState, useMemo, useCallback } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilterState } from '../types/task';
import {
  subscribeToUserTasks,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
  updateTasksOrder,
} from '../services/taskService';
import { useAuth } from './useAuth';
import { getFriendlyErrorMessage } from '../utils/firebaseErrors';

const initialFilters: TaskFilterState = {
  status: 'all',
  priority: 'all',
  search: '',
  sortBy: 'order',
  sortOrder: 'asc',
};

export function useTasks() {
  const { userProfile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterState>(initialFilters);

  // Subscribe to Firestore changes
  useEffect(() => {
    if (!userProfile?.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserTasks(
      userProfile.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (err) => {
        console.error('Error in Firestore tasks subscription:', err);
        setError(getFriendlyErrorMessage(err));
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userProfile?.uid]);

  // Derived filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (filters.status === 'completed' && !task.completed) return false;
        if (filters.status === 'pending' && task.completed) return false;

        // Priority filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

        // Search query
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let result = 0;
        if (filters.sortBy === 'order') {
          result = a.order - b.order;
        } else if (filters.sortBy === 'createdAt') {
          result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (filters.sortBy === 'dueDate') {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          result = dateA - dateB;
        } else if (filters.sortBy === 'priority') {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          result = priorityWeight[b.priority] - priorityWeight[a.priority];
        }

        return filters.sortOrder === 'desc' ? -result : result;
      });
  }, [tasks, filters]);

  // Task Statistics Summary
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const highPriorityPending = tasks.filter((t) => !t.completed && t.priority === 'high').length;

    return {
      total,
      completed,
      pending,
      highPriorityPending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  // CRUD Actions
  const handleAddTask = useCallback(
    async (input: CreateTaskInput) => {
      if (!userProfile?.uid) throw new Error('Debes iniciar sesión para crear tareas.');
      const maxOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.order || 0)) : 0;
      await createTask(userProfile.uid, input, maxOrder);
    },
    [userProfile?.uid, tasks]
  );

  const handleEditTask = useCallback(async (taskId: string, input: UpdateTaskInput) => {
    await updateTask(taskId, input);
  }, []);

  const handleToggleComplete = useCallback(async (taskId: string, currentCompleted: boolean) => {
    await toggleTaskComplete(taskId, currentCompleted);
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    await deleteTask(taskId);
  }, []);

  const handleReorderTasks = useCallback(
    async (newOrderedTasks: Task[]) => {
      // Optimistically update local UI state for instant responsiveness
      setTasks((prev) => {
        const updatedMap = new Map(newOrderedTasks.map((t, idx) => [t.id, idx + 1]));
        return prev.map((t) => (updatedMap.has(t.id) ? { ...t, order: updatedMap.get(t.id)! } : t));
      });

      const orderPayload = newOrderedTasks.map((t, index) => ({
        id: t.id,
        order: index + 1,
      }));

      await updateTasksOrder(orderPayload);
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    tasks,
    filteredTasks,
    stats,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    addTask: handleAddTask,
    editTask: handleEditTask,
    toggleComplete: handleToggleComplete,
    deleteTask: handleDeleteTask,
    reorderTasks: handleReorderTasks,
  };
}
