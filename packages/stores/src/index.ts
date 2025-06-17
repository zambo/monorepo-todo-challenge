// Public API for @repo/stores
// This file exports all the stores and utilities that should be available
// to consuming applications

// Todo domain store
export {
  useTodoStore,
  createTodoStore,
  useTodoActions,
  useTodoData,
  // Individual hooks for better performance
  useTasks,
  useFilter,
  useIsEditing,
  useAddTask,
  useToggleTask,
  useUpdateTask,
  useDeleteTask,
  useEditTask,
  useStartEditing,
  useCancelEditing,
  useClearCompleted,
  useSetFilter,
  useToggleAllTasks,
  useImportTasks,
  useExportTasks,
  useClearAllTasks,
  useReorderTasks,
  useGetProgress,
} from "./todo/useTodoStore";

export * from "./todo/selectors";
export type * from "./todo/types";

// UI state store (placeholder for now)
// export * from './ui/useUIStore'
// export type * from './ui/types'

// Note: Removed complex utilities that were causing build issues
// The store uses Zustand's built-in persistence which works perfectly
