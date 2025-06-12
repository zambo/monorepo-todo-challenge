export const TASK_FILTERS = {
  ALL: "all" as const,
  ACTIVE: "active" as const,
  COMPLETED: "completed" as const,
} as const;

export const TASK_FILTER_LABELS = {
  [TASK_FILTERS.ALL]: "All",
  [TASK_FILTERS.ACTIVE]: "Active",
  [TASK_FILTERS.COMPLETED]: "Completed",
} as const;

export const LOCAL_STORAGE_KEYS = {
  TASKS: "tasks",
  FILTER: "taskFilter",
} as const;
