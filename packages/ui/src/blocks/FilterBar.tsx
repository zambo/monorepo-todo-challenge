import { TASK_FILTER } from "@repo/shared";
import type { TaskFilter } from "@repo/shared";
import { cn } from "@repo/utils";
import { CheckCircle2, Circle, List, Trash2 } from "lucide-react";

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

  const getFilterIcon = (filterValue: TaskFilter) => {
    switch (filterValue) {
      case TASK_FILTER.ALL.value:
        return <List className="w-3 h-3" />;
      case TASK_FILTER.ACTIVE.value:
        return <Circle className="w-3 h-3" />;
      case TASK_FILTER.COMPLETED.value:
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return <List className="w-3 h-3" />;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
        className,
      )}
    >
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
        {filterOptions.map((option: { value: TaskFilter; label: string }) => {
          const isActive = currentFilter === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              aria-pressed={isActive}
              aria-label={`Show ${option.label} tasks`}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                "border focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1",
                "active:scale-95 hover:scale-105",
                isActive
                  ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
              )}
            >
              {getFilterIcon(option.value)}
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Clear completed button */}
      {hasCompletedTasks && (
        <button
          onClick={onClearCompleted}
          aria-label="Clear all completed tasks"
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
            "border focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1",
            "active:scale-95 hover:scale-105",
            "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300",
          )}
        >
          <Trash2 className="w-3 h-3" />
          Clear completed
        </button>
      )}
    </div>
  );
};
