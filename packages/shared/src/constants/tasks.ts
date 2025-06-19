// Modern enum pattern - single source of truth
export const TASK_FILTER = {
  ALL: { value: "all", label: "All" },
  ACTIVE: { value: "active", label: "Active" },
  COMPLETED: { value: "completed", label: "Completed" },
} as const;

// If the app was going to be extended with more filters in the future,
// it would be easy to add them here without breaking existing code.
// export const TASK_FILTER = {
//   ALL: { value: "all", label: "All", icon: "list", color: "gray" },
//   ACTIVE: { value: "active", label: "Active", icon: "clock", color: "blue" },
//   COMPLETED: { value: "completed", label: "Completed", icon: "check", color: "green" },
//   OVERDUE: { value: "overdue", label: "Overdue", icon: "warning", color: "red" }, // ← One line to add!
// } as const;

// Derived utilities for backward compatibility and convenience
export const TASK_FILTERS = {
  ALL: TASK_FILTER.ALL.value,
  ACTIVE: TASK_FILTER.ACTIVE.value,
  COMPLETED: TASK_FILTER.COMPLETED.value,
} as const;

export const TASK_FILTER_LABELS = {
  [TASK_FILTER.ALL.value]: TASK_FILTER.ALL.label,
  [TASK_FILTER.ACTIVE.value]: TASK_FILTER.ACTIVE.label,
  [TASK_FILTER.COMPLETED.value]: TASK_FILTER.COMPLETED.label,
} as const;

export const LOCAL_STORAGE_KEYS = {
  TASKS: "tasks",
  FILTER: "taskFilter",
} as const;

// Progress related constants
export const PROGRESS_COLORS = {
  container: "bg-gray-100",
  bar: {
    empty: "bg-gray-300",
    low: "bg-orange-400",
    medium: "bg-yellow-400",
    good: "bg-teal-400",
    excellent: "bg-teal-500",
  },
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
  },
};

/**
 * Returns the appropriate color class for a progress percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage <= 0) return PROGRESS_COLORS.bar.empty;
  if (percentage <= 25) return PROGRESS_COLORS.bar.low;
  if (percentage <= 50) return PROGRESS_COLORS.bar.medium;
  if (percentage <= 75) return PROGRESS_COLORS.bar.good;
  return PROGRESS_COLORS.bar.excellent;
}

/**
 * Returns a motivational label based on progress percentage
 */
export function getProgressLabel(percentage: number): string {
  if (percentage <= 0) return "Get started!";
  if (percentage <= 25) return "Just getting started";
  if (percentage <= 50) return "Making progress";
  if (percentage <= 75) return "Almost there";
  return "Great job!";
}
