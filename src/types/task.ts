export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'all' | 'pending' | 'completed';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  order: number;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TaskPriority;
  dueDate?: string;
  order?: number;
}

export interface TaskFilterState {
  status: TaskStatus;
  priority: 'all' | TaskPriority;
  search: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'order';
  sortOrder: 'asc' | 'desc';
}
