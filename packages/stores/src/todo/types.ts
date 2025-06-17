import {
  Task,
  TaskFilter,
  TaskActions,
  TaskManagerState,
  TaskEditData,
} from "@repo/shared";

// Store-specific state that extends the base shared types
export interface TodoStoreState extends TaskManagerState {
  // Core state
  tasks: Task[];
  filter: TaskFilter;
  isEditing: string | null;

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
  // Enhanced CRUD operations
  addTask: (name: string, description?: string) => void;
  editTask: (id: string, updates: TaskEditData) => void;
  startEditing: (id: string) => void;
  cancelEditing: () => void;

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

  // Progress tracking
  getProgress: () => {
    completed: number;
    total: number;
    percentage: number;
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
