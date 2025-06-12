"use client";

import { Task } from "@repo/shared/types/task";
import React from "react";

import { Button } from "../base/Button";
import { Checkbox } from "../base/Checkbox";

export interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, name: string) => void;
  className?: string;
}

export const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  className = "",
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(task.name);

  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (onEdit && editValue.trim()) {
      onEdit(task.id, editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      setEditValue(task.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between p-3 border-b border-gray-200
        ${task.completed ? "bg-gray-50" : ""}
        ${className}
      `}
    >
      <div className="flex items-center space-x-3 flex-1">
        <Checkbox
          checked={task.completed}
          onChange={handleToggle}
          aria-label={`Mark "${task.name}" as ${task.completed ? "incomplete" : "complete"}`}
        />

        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={handleKeyDown}
            className="flex-1 p-1 border rounded"
            autoFocus
          />
        ) : (
          <span
            className={`flex-1 ${task.completed ? "line-through text-gray-500" : ""}`}
          >
            {task.name}
          </span>
        )}
      </div>

      <div className="flex space-x-2">
        {!isEditing && onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEditClick}
            aria-label={`Edit task "${task.name}"`}
          >
            Edit
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          aria-label={`Delete task "${task.name}"`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
