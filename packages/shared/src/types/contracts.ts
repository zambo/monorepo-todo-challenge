import type { Task, TaskFilter } from "./task";

// Behavioral contracts - what any task management system should implement
export interface TaskActions {
  // Core CRUD operations
  addTask: (name: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, name: string) => void;
  deleteTask: (id: string) => void;

  // Bulk operations
  clearCompleted: () => void;
  setFilter: (filter: TaskFilter) => void;
}

// State contracts - what any task state should contain
export interface TaskManagerState {
  tasks: Task[];
  filter: TaskFilter;
}

// Combined contract - full task management interface
export interface TaskManager extends TaskManagerState, TaskActions {}
