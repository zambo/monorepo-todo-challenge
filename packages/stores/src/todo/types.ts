import { Task, TaskFilter, TaskActions, TaskManagerState } from "@repo/shared";

// Store-specific state that extends the base shared types
export interface TodoStoreState extends TaskManagerState {
  // Core state
  tasks: Task[];
  filter: TaskFilter;

  // Simple computed cache (optional, for performance)
  _computedCache: {
    activeTasks: Task[] | null;
    completedTasks: Task[] | null;
    filteredTasks: Task[] | null;
    lastTasksUpdate: number;
    lastFilterUpdate: number;
  };
}

// Actions interface specific to the todo store
export interface TodoStoreActions extends TaskActions {
  // Bulk operations
  toggleAllTasks: (completed?: boolean) => void;
  importTasks: (tasks: Task[]) => void;
  exportTasks: () => Task[];

  // Utility actions
  clearAllTasks: () => void;
  reorderTasks: (fromIndex: number, toIndex: number) => void;

  // Computed getters
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getFilteredTasks: () => Task[];

  // Statistics
  getTaskStats: () => {
    total: number;
    active: number;
    completed: number;
    completionRate: number;
  };
}

// Combined store interface
export interface TodoStore extends TodoStoreState, TodoStoreActions {}

// Simplified store configuration options
export interface TodoStoreConfig {
  // Persistence settings
  persistKey?: string;
  enablePersistence?: boolean;

  // Debug settings
  enableDevtools?: boolean;
  storeName?: string;
}

// Store creation options
export interface CreateTodoStoreOptions extends TodoStoreConfig {
  initialTasks?: Task[];
  initialFilter?: TaskFilter;
}

// For testing and mocking
export interface TodoStoreMethods {
  getState: () => TodoStoreState;
  setState: (partial: Partial<TodoStoreState>) => void;
  destroy: () => void;
}
