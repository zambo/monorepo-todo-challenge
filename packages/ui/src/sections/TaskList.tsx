"use client";

import { TASK_FILTER, Task, TaskFilter } from "@repo/shared";
import { useMemo } from "react";

import { FilterBar } from "../blocks/FilterBar";
import { TaskItem } from "../blocks/TaskItem";

export interface TaskListProps {
  tasks: Task[];
  currentFilter: TaskFilter;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (id: string, name: string) => void;
  onFilterChange: (filter: TaskFilter) => void;
  onClearCompleted: () => void;
  className?: string;
  emptyMessage?: string;
}

export const TaskList = ({
  tasks,
  currentFilter,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onFilterChange,
  onClearCompleted,
  className = "",
  emptyMessage = "No tasks found",
}: TaskListProps) => {
  // Filter tasks based on current filter
  const filteredTasks = useMemo(() => {
    switch (currentFilter) {
      case TASK_FILTER.ACTIVE.value:
        return tasks.filter((task) => !task.completed);
      case TASK_FILTER.COMPLETED.value:
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }, [tasks, currentFilter]);

  // Check if there are completed tasks
  const hasCompletedTasks = useMemo(() => {
    return tasks.some((task) => task.completed);
  }, [tasks]);

  return (
    <div className={`flex flex-col ${className}`}>
      <FilterBar
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
        onClearCompleted={onClearCompleted}
        hasCompletedTasks={hasCompletedTasks}
        className="mb-4"
      />

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            // Conditionally add the onEdit prop only for active tasks
            // This is a deliberate choice to disable editing for completed tasks,
            const taskProps = {
              key: task.id,
              task,
              onToggle: onToggleTask,
              onDelete: onDeleteTask,
              ...(!task.completed && { onEdit: onEditTask }),
            };
            return <TaskItem {...taskProps} />;
          })
        ) : (
          <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-500">
        {tasks.length} {tasks.length === 1 ? "task" : "tasks"} •{" "}
        {tasks.filter((t) => !t.completed).length} remaining
      </div>
    </div>
  );
};
