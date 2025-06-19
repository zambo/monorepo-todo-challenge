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
    <div className={`flex flex-col h-full ${className}`}>
      {/* Fixed Header - Filters Only */}
      <div className="flex-shrink-0 mb-4">
        <FilterBar
          currentFilter={currentFilter}
          onFilterChange={onFilterChange}
          onClearCompleted={onClearCompleted}
          hasCompletedTasks={hasCompletedTasks}
        />
      </div>

      {/* Scrollable Task List Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
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
                className="bg-white hover:bg-gray-50 transition-colors"
              />
            ))
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-gray-500 text-sm">
                {tasks.length === 0 ? emptyMessage : "No tasks found"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer - Task Count */}
      {tasks.length > 0 && (
        <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center text-sm text-gray-500">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} •{" "}
            {tasks.filter((t) => !t.completed).length} remaining
          </div>
        </div>
      )}
    </div>
  );
};
