"use client";

import { TASK_FILTER, Task, TaskFilter, TaskEditData } from "@repo/shared";
import { useMemo, useState } from "react";

import { FilterBar } from "../blocks/FilterBar";
import { TaskItem } from "../blocks/TaskItem";

export interface TaskListProps {
  tasks: Task[];
  currentFilter: TaskFilter;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (id: string, updates: TaskEditData) => void;
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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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

  const handleStartEdit = (id: string) => {
    setEditingTaskId(id);
  };

  const handleSaveEdit = (id: string, updates: TaskEditData) => {
    if (onEditTask) {
      onEditTask(id, updates);
    }
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <FilterBar
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
        onClearCompleted={onClearCompleted}
        hasCompletedTasks={hasCompletedTasks}
        className="mb-4"
      />

      <div className="space-y-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isEditing={editingTaskId === task.id}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
            />
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-500 text-sm">{emptyMessage}</div>
          </div>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"} •{" "}
          {tasks.filter((t) => !t.completed).length} remaining
        </div>
      )}
    </div>
  );
};
