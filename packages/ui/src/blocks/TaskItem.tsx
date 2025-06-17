"use client";

import type { Task, TaskEditData } from "@repo/shared";
import { cn } from "@repo/utils";
import React, { useState, useRef, useEffect } from "react";

import { ActionButton } from "../base/ActionButton";
import { Input, Checkbox } from "../base";
import { EditIcon, DeleteIcon, SaveIcon, CancelIcon } from "../base/icons";

export interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onSaveEdit: (id: string, data: TaskEditData) => void;
  onCancelEdit: () => void;
  className?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isEditing,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [editData, setEditData] = useState<TaskEditData>({
    name: task.name,
    description: task.description || "",
  });
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus name input when editing starts
  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing]);

  // Reset edit data when editing is cancelled or task changes
  useEffect(() => {
    if (!isEditing) {
      setEditData({
        name: task.name,
        description: task.description || "",
      });
    }
  }, [isEditing, task.name, task.description]);

  const handleSave = () => {
    if (editData.name.trim()) {
      const trimmedDescription = editData.description?.trim();
      const saveData: TaskEditData = {
        name: editData.name,
        ...(trimmedDescription && { description: trimmedDescription }),
      };
      onSaveEdit(task.id, saveData);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onCancelEdit();
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 py-3 px-4 transition-all duration-200",
        "hover:bg-gray-50",
        task.completed && "opacity-60",
        isEditing && "bg-teal-50 ring-2 ring-teal-200",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label="Toggle task completion"
        className="flex-shrink-0"
      />

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              ref={nameInputRef}
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full text-sm font-medium bg-white",
                "border border-gray-300 rounded-md px-3 py-2",
                "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200",
                "text-gray-900 placeholder-gray-500",
              )}
              placeholder="Task name"
            />
            {editData.description !== undefined && (
              <textarea
                value={editData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full text-xs bg-white",
                  "border border-gray-300 rounded-md px-3 py-2",
                  "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200",
                  "text-gray-700 placeholder-gray-500",
                  "resize-none",
                )}
                placeholder="Description (optional)"
                rows={2}
              />
            )}
          </div>
        ) : (
          <div>
            <span
              className={cn(
                "text-sm text-gray-900 transition-all duration-200",
                task.completed && "line-through text-gray-500",
              )}
            >
              {task.name}
            </span>
            {task.description && (
              <div
                className={cn(
                  "text-xs text-gray-600 mt-1",
                  task.completed && "line-through text-gray-400",
                )}
              >
                {task.description}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        className={cn(
          "flex items-center gap-1 transition-opacity duration-200",
          isEditing
            ? "opacity-100"
            : isHovered
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100",
        )}
      >
        {isEditing ? (
          <>
            <ActionButton
              onClick={handleSave}
              icon={<SaveIcon className="w-3 h-3" />}
              label="Save changes"
              variant="save"
              size="sm"
              className="w-7 h-7 p-1"
            />
            <ActionButton
              onClick={onCancelEdit}
              icon={<CancelIcon className="w-3 h-3" />}
              label="Cancel editing"
              variant="cancel"
              size="sm"
              className="w-7 h-7 p-1"
            />
          </>
        ) : (
          <>
            <ActionButton
              onClick={() => onStartEdit(task.id)}
              icon={<EditIcon className="w-3 h-3" />}
              label="Edit task"
              variant="edit"
              size="sm"
              className="w-7 h-7 p-1"
            />
            <ActionButton
              onClick={() => onDelete(task.id)}
              icon={<DeleteIcon className="w-3 h-3" />}
              label="Delete task"
              variant="delete"
              size="sm"
              className="w-7 h-7 p-1"
            />
          </>
        )}
      </div>
    </div>
  );
};
