import {
  Task,
  TaskFilter,
  TASK_FILTERS,
  LOCAL_STORAGE_KEYS,
} from "@repo/shared";
import { generateId } from "@repo/utils";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { TodoStore, CreateTodoStoreOptions } from "./types";

/**
 * Simplified todo store with built-in Zustand persistence
 */
function createTodoStore(options: CreateTodoStoreOptions = {}) {
  const {
    initialTasks = [],
    initialFilter = TASK_FILTERS.ALL,
    persistKey = LOCAL_STORAGE_KEYS.TASKS,
    enablePersistence = true,
    enableDevtools = true,
    storeName = "TodoStore",
  } = options;

  // Core store implementation
  const storeImplementation = immer<TodoStore>((set, get) => ({
    // Initial state
    tasks: initialTasks,
    filter: initialFilter,
    _computedCache: {
      activeTasks: null,
      completedTasks: null,
      filteredTasks: null,
      lastTasksUpdate: 0,
      lastFilterUpdate: 0,
    },

    // Core CRUD operations
    addTask: (name: string) => {
      if (!name.trim()) return;

      set((state) => {
        const newTask: Task = {
          id: generateId(),
          name: name.trim(),
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        state.tasks.push(newTask);
      });
    },

    toggleTask: (id: string) => {
      set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          task.completed = !task.completed;
          task.updatedAt = new Date();
        }
      });
    },

    updateTask: (id: string, name: string) => {
      if (!name.trim()) return;

      set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          task.name = name.trim();
          task.updatedAt = new Date();
        }
      });
    },

    deleteTask: (id: string) => {
      set((state) => {
        const index = state.tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          state.tasks.splice(index, 1);
        }
      });
    },

    clearCompleted: () => {
      set((state) => {
        state.tasks = state.tasks.filter((t) => !t.completed);
      });
    },

    setFilter: (filter: TaskFilter) => {
      set((state) => {
        state.filter = filter;
      });
    },

    // Bulk operations
    toggleAllTasks: (completed?: boolean) => {
      set((state) => {
        const targetState = completed ?? state.tasks.some((t) => !t.completed);

        state.tasks.forEach((task) => {
          task.completed = targetState;
          task.updatedAt = new Date();
        });
      });
    },

    importTasks: (newTasks: Task[]) => {
      set((state) => {
        // Avoid duplicates by checking IDs
        const existingIds = new Set(state.tasks.map((t) => t.id));
        const uniqueNewTasks = newTasks.filter((t) => !existingIds.has(t.id));

        if (uniqueNewTasks.length > 0) {
          state.tasks.push(...uniqueNewTasks);
        }
      });
    },

    exportTasks: () => {
      return get().tasks;
    },

    clearAllTasks: () => {
      set((state) => {
        state.tasks = [];
      });
    },

    reorderTasks: (fromIndex: number, toIndex: number) => {
      set((state) => {
        // Proper bounds checking
        if (
          fromIndex === toIndex ||
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= state.tasks.length ||
          toIndex >= state.tasks.length
        ) {
          return;
        }

        // TypeScript-safe array reordering
        const newTasks = [...state.tasks];
        const [movedTask] = newTasks.splice(fromIndex, 1);

        // Only proceed if we successfully extracted a task
        if (movedTask) {
          newTasks.splice(toIndex, 0, movedTask);
          movedTask.updatedAt = new Date();
          state.tasks = newTasks;
        }
      });
    },

    // Simple getters (no caching to avoid issues)
    getActiveTasks: () => {
      const state = get();
      return state.tasks.filter((task) => !task.completed);
    },

    getCompletedTasks: () => {
      const state = get();
      return state.tasks.filter((task) => task.completed);
    },

    getFilteredTasks: () => {
      const state = get();

      switch (state.filter) {
        case TASK_FILTERS.ACTIVE:
          return state.tasks.filter((task) => !task.completed);
        case TASK_FILTERS.COMPLETED:
          return state.tasks.filter((task) => task.completed);
        default:
          return state.tasks;
      }
    },

    getTaskStats: () => {
      const { tasks } = get();
      const total = tasks.length;
      const completed = tasks.filter((t) => t.completed).length;
      const active = total - completed;
      const completionRate = total > 0 ? completed / total : 0;

      return { total, active, completed, completionRate };
    },
  }));

  // Simple Zustand middleware composition
  if (enablePersistence && enableDevtools) {
    return create<TodoStore>()(
      devtools(
        persist(storeImplementation, {
          name: persistKey,
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            tasks: state.tasks,
            filter: state.filter,
          }),
          onRehydrateStorage: () => (state) => {
            if (state) {
              // Convert date strings back to Date objects
              state.tasks = state.tasks.map((task) => ({
                ...task,
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt),
              }));
            }
          },
        }),
        { name: storeName },
      ),
    );
  } else if (enablePersistence) {
    return create<TodoStore>()(
      persist(storeImplementation, {
        name: persistKey,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          tasks: state.tasks,
          filter: state.filter,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.tasks = state.tasks.map((task) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt),
            }));
          }
        },
      }),
    );
  } else if (enableDevtools) {
    return create<TodoStore>()(
      devtools(storeImplementation, { name: storeName }),
    );
  } else {
    return create<TodoStore>()(storeImplementation);
  }
}

// Default store instance
export const useTodoStore = createTodoStore();

// Factory for custom configurations (useful for testing)
export { createTodoStore };

// Individual hooks for better performance and stability
export const useTasks = () => useTodoStore((state) => state.tasks);
export const useFilter = () => useTodoStore((state) => state.filter);
export const useAddTask = () => useTodoStore((state) => state.addTask);
export const useToggleTask = () => useTodoStore((state) => state.toggleTask);
export const useUpdateTask = () => useTodoStore((state) => state.updateTask);
export const useDeleteTask = () => useTodoStore((state) => state.deleteTask);
export const useClearCompleted = () =>
  useTodoStore((state) => state.clearCompleted);
export const useSetFilter = () => useTodoStore((state) => state.setFilter);
export const useToggleAllTasks = () =>
  useTodoStore((state) => state.toggleAllTasks);
export const useImportTasks = () => useTodoStore((state) => state.importTasks);
export const useExportTasks = () => useTodoStore((state) => state.exportTasks);
export const useClearAllTasks = () =>
  useTodoStore((state) => state.clearAllTasks);
export const useReorderTasks = () =>
  useTodoStore((state) => state.reorderTasks);

// Stable selectors for grouped hooks (if needed)
const actionsSelector = (state: TodoStore) => ({
  addTask: state.addTask,
  toggleTask: state.toggleTask,
  updateTask: state.updateTask,
  deleteTask: state.deleteTask,
  clearCompleted: state.clearCompleted,
  setFilter: state.setFilter,
  toggleAllTasks: state.toggleAllTasks,
  importTasks: state.importTasks,
  exportTasks: state.exportTasks,
  clearAllTasks: state.clearAllTasks,
  reorderTasks: state.reorderTasks,
});

const dataSelector = (state: TodoStore) => ({
  tasks: state.tasks,
  filter: state.filter,
  getActiveTasks: state.getActiveTasks,
  getCompletedTasks: state.getCompletedTasks,
  getFilteredTasks: state.getFilteredTasks,
  getTaskStats: state.getTaskStats,
});

// Alternative grouped hooks - removed shallow parameter to fix build errors
export const useTodoActions = () => {
  return useTodoStore(actionsSelector);
};

export const useTodoData = () => {
  return useTodoStore(dataSelector);
};
