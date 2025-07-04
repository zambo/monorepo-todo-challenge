import type { Task, TaskFilter, TaskEditData } from "./task";

// Behavioral contracts - what any task management system should implement
export interface TaskActions {
  // Core CRUD operations
  addTask: (name: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, name: string) => void;
  deleteTask: (id: string) => void;

  // Enhanced editing operations
  editTask: (id: string, updates: TaskEditData) => void;
  startEditing: (id: string) => void;
  cancelEditing: () => void;

  // Bulk operations
  clearCompleted: () => void;
  setFilter: (filter: TaskFilter) => void;
}

// State contracts - what any task state should contain
export interface TaskManagerState {
  tasks: Task[];
  filter: TaskFilter;
  isEditing: string | null;
}

// Combined contract - full task management interface
export interface TaskManager extends TaskManagerState, TaskActions {}
