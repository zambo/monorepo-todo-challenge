import { TASK_FILTER } from "@repo/shared";
import type { TaskFilter } from "@repo/shared";

import { Button } from "../base/Button";

export interface FilterBarProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  onClearCompleted: () => void;
  hasCompletedTasks: boolean;
  className?: string;
}

export const FilterBar = ({
  currentFilter,
  onFilterChange,
  onClearCompleted,
  hasCompletedTasks,
  className = "",
}: FilterBarProps) => {
  const filterOptions = Object.values(TASK_FILTER);

  return (
    <div
      className={`
        flex flex-wrap items-center justify-between gap-2 p-3 bg-white border border-gray-200 rounded-md
        ${className}
      `}
    >
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option: { value: TaskFilter; label: string }) => (
          <Button
            key={option.value}
            variant={currentFilter === option.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(option.value)}
            aria-pressed={currentFilter === option.value}
            aria-label={`Show ${option.label} tasks`}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={onClearCompleted}
        disabled={!hasCompletedTasks}
        aria-label="Clear all completed tasks"
      >
        Clear completed
      </Button>
    </div>
  );
};
