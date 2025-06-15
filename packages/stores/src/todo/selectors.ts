import { useTodoStore } from "./useTodoStore";
import type { Task, TaskFilter } from "@repo/shared";

/**
 * Memoized selectors for optimal performance
 * These selectors prevent unnecessary re-renders by using shallow equality checks
 */

// Simple memoization utility for selectors
function createMemoizedSelector<TState, TResult>(
  selector: (state: TState) => TResult,
  equalityFn?: (a: TResult, b: TResult) => boolean,
) {
  let lastState: TState;
  let lastResult: TResult;

  return (state: TState): TResult => {
    if (state !== lastState) {
      const newResult = selector(state);

      if (!equalityFn || !equalityFn(lastResult, newResult)) {
        lastResult = newResult;
      }

      lastState = state;
    }

    return lastResult;
  };
}

// Shallow equality check for arrays
function shallowEqualArray<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

/**
 * Selector for filtered tasks with memoization
 * Only re-computes when tasks or filter actually change
 */
export const selectFilteredTasks = createMemoizedSelector(
  (state: ReturnType<typeof useTodoStore.getState>) => state.getFilteredTasks(),
  shallowEqualArray,
);

/**
 * Selector for active tasks with memoization
 */
export const selectActiveTasks = createMemoizedSelector(
  (state: ReturnType<typeof useTodoStore.getState>) => state.getActiveTasks(),
  shallowEqualArray,
);

/**
 * Selector for completed tasks with memoization
 */
export const selectCompletedTasks = createMemoizedSelector(
  (state: ReturnType<typeof useTodoStore.getState>) =>
    state.getCompletedTasks(),
  shallowEqualArray,
);

/**
 * Selector for task statistics with memoization
 */
export const selectTaskStats = createMemoizedSelector(
  (state: ReturnType<typeof useTodoStore.getState>) => state.getTaskStats(),
  (a, b) =>
    a.total === b.total && a.active === b.active && a.completed === b.completed,
);

/**
 * Selector for current filter
 */
export const selectCurrentFilter = (
  state: ReturnType<typeof useTodoStore.getState>,
) => state.filter;

/**
 * Selector for all tasks (raw)
 */
export const selectAllTasks = (
  state: ReturnType<typeof useTodoStore.getState>,
) => state.tasks;

/**
 * Selector for a specific task by ID
 */
export const selectTaskById = (id: string) =>
  createMemoizedSelector(
    (state: ReturnType<typeof useTodoStore.getState>) =>
      state.tasks.find((task) => task.id === id) || null,
  );

/**
 * Selector for tasks by completion status
 */
export const selectTasksByStatus = (completed: boolean) =>
  createMemoizedSelector(
    (state: ReturnType<typeof useTodoStore.getState>) =>
      state.tasks.filter((task) => task.completed === completed),
    shallowEqualArray,
  );

/**
 * Selector for tasks created within a date range
 */
export const selectTasksByDateRange = (startDate: Date, endDate: Date) =>
  createMemoizedSelector(
    (state: ReturnType<typeof useTodoStore.getState>) =>
      state.tasks.filter(
        (task) => task.createdAt >= startDate && task.createdAt <= endDate,
      ),
    shallowEqualArray,
  );

/**
 * Selector for tasks matching a search query
 */
export const selectTasksBySearch = (query: string) => {
  const normalizedQuery = query.toLowerCase().trim();

  return createMemoizedSelector(
    (state: ReturnType<typeof useTodoStore.getState>) =>
      normalizedQuery
        ? state.tasks.filter((task) =>
            task.name.toLowerCase().includes(normalizedQuery),
          )
        : state.tasks,
    shallowEqualArray,
  );
};

/**
 * Complex selector: filtered tasks with search
 */
export const selectFilteredTasksWithSearch = (searchQuery: string) => {
  const normalizedQuery = searchQuery.toLowerCase().trim();

  return createMemoizedSelector(
    (state: ReturnType<typeof useTodoStore.getState>) => {
      const filteredTasks = state.getFilteredTasks();

      if (!normalizedQuery) {
        return filteredTasks;
      }

      return filteredTasks.filter((task) =>
        task.name.toLowerCase().includes(normalizedQuery),
      );
    },
    shallowEqualArray,
  );
};

/**
 * Selector for task completion percentage
 */
export const selectCompletionPercentage = createMemoizedSelector(
  (state: ReturnType<typeof useTodoStore.getState>) => {
    const stats = state.getTaskStats();
    return Math.round(stats.completionRate * 100);
  },
);

/**
 * Selector for checking if all tasks are completed
 */
export const selectAllTasksCompleted = createMemoizedSelector(
  (state: ReturnType<typeof useTodoStore.getState>) => {
    return (
      state.tasks.length > 0 && state.tasks.every((task) => task.completed)
    );
  },
);

/**
 * Selector for checking if any tasks are completed
 */
export const selectHasCompletedTasks = createMemoizedSelector(
  (state: ReturnType<typeof useTodoStore.getState>) => {
    return state.tasks.some((task) => task.completed);
  },
);

/**
 * Selector for checking if filter has results
 */
export const selectFilterHasResults = createMemoizedSelector(
  (state: ReturnType<typeof useTodoStore.getState>) => {
    return state.getFilteredTasks().length > 0;
  },
);

/**
 * Selector factory for creating task list with pagination
 */
export const selectPaginatedTasks = (page: number, pageSize: number) =>
  createMemoizedSelector(
    (state: ReturnType<typeof useTodoStore.getState>) => {
      const filteredTasks = state.getFilteredTasks();
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;

      return {
        tasks: filteredTasks.slice(startIndex, endIndex),
        totalPages: Math.ceil(filteredTasks.length / pageSize),
        currentPage: page,
        totalTasks: filteredTasks.length,
        hasNextPage: endIndex < filteredTasks.length,
        hasPrevPage: page > 0,
      };
    },
    (a, b) =>
      shallowEqualArray(a.tasks, b.tasks) &&
      a.totalPages === b.totalPages &&
      a.currentPage === b.currentPage &&
      a.totalTasks === b.totalTasks,
  );

/**
 * Hooks that use the selectors for easy consumption
 */
export const useFilteredTasks = () => useTodoStore(selectFilteredTasks);
export const useActiveTasks = () => useTodoStore(selectActiveTasks);
export const useCompletedTasks = () => useTodoStore(selectCompletedTasks);
export const useTaskStats = () => useTodoStore(selectTaskStats);
export const useCurrentFilter = () => useTodoStore(selectCurrentFilter);
export const useAllTasks = () => useTodoStore(selectAllTasks);
export const useCompletionPercentage = () =>
  useTodoStore(selectCompletionPercentage);
export const useAllTasksCompleted = () => useTodoStore(selectAllTasksCompleted);
export const useHasCompletedTasks = () => useTodoStore(selectHasCompletedTasks);
export const useFilterHasResults = () => useTodoStore(selectFilterHasResults);

/**
 * Hook factories for parameterized selectors
 */
export const useTaskById = (id: string) => useTodoStore(selectTaskById(id));
export const useTasksByStatus = (completed: boolean) =>
  useTodoStore(selectTasksByStatus(completed));
export const useTasksBySearch = (query: string) =>
  useTodoStore(selectTasksBySearch(query));
export const useFilteredTasksWithSearch = (query: string) =>
  useTodoStore(selectFilteredTasksWithSearch(query));
export const usePaginatedTasks = (page: number, pageSize: number) =>
  useTodoStore(selectPaginatedTasks(page, pageSize));
