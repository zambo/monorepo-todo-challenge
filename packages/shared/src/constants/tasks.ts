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
