"use client";

import { cn } from "@repo/utils";
import { Plus, FileText, X, RotateCcw } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export interface TaskInputProps {
  onAddTask: (taskName: string, description?: string) => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export const TaskInput = ({
  onAddTask,
  className = "",
  placeholder = "Add a new task...",
  autoFocus = true,
}: TaskInputProps) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when component mounts
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      setError("Task name is required");
      return;
    }

    onAddTask(taskName.trim(), description.trim() || undefined);
    setTaskName("");
    setDescription("");
    setShowDescription(false);
    setError(undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
    if (error && e.target.value.trim()) {
      setError(undefined);
    }
  };

  const handleEscapePress = () => {
    if (showDescription) {
      // If description is showing, first escape closes description
      setDescription("");
      setShowDescription(false);
      inputRef.current?.focus();
    } else if (taskName.trim() || description.trim()) {
      // If there's content, escape clears everything but stays in input
      setTaskName("");
      setDescription("");
      setShowDescription(false);
      setError(undefined);
      inputRef.current?.focus();
    } else {
      // If input is empty, allow escape to bubble up (close modal, etc.)
      return false;
    }
    return true; // Handled
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      const handled = handleEscapePress();
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    } else if (e.key === "Tab" && taskName.trim() && !showDescription) {
      e.preventDefault();
      setShowDescription(true);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      const handled = handleEscapePress();
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      {/* Main Input Wrapper */}
      <div
        className={cn(
          "relative rounded-lg border-2 transition-all duration-200 bg-white",
          isFocused
            ? "border-teal-500 ring-4 ring-teal-100"
            : "border-gray-200 hover:border-gray-300",
          error && "border-red-400 ring-4 ring-red-100",
        )}
      >
        <div className="p-3 sm:p-4">
          <input
            ref={inputRef}
            type="text"
            value={taskName}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              "w-full text-sm font-medium bg-transparent placeholder-gray-500",
              "text-gray-900 focus:outline-none ring-none focus:ring-0",
            )}
            aria-label="Add new task"
          />

          {/* Description Input */}
          {showDescription && (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              placeholder="Add a description (optional)..."
              className={cn(
                "w-full mt-2 text-xs bg-transparent placeholder-gray-400",
                "text-gray-700 focus:outline-none resize-none focus:ring-0",
              )}
              rows={2}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              {!showDescription && taskName.trim() && (
                <button
                  type="button"
                  onClick={() => setShowDescription(true)}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  Add description
                </button>
              )}
              {showDescription && (
                <button
                  type="button"
                  onClick={() => {
                    setDescription("");
                    setShowDescription(false);
                    inputRef.current?.focus();
                  }}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Remove description
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setTaskName("");
                  setDescription("");
                  setShowDescription(false);
                  setError(undefined);
                }}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition-all",
                  "text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:scale-95",
                )}
                disabled={!taskName.trim() && !description.trim()}
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
              <button
                type="submit"
                disabled={!taskName.trim()}
                className={cn(
                  "inline-flex items-center gap-1 px-4 py-1 text-xs font-medium rounded-full transition-all",
                  "bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-300",
                  "disabled:cursor-not-allowed active:scale-95",
                  !taskName.trim() ? "" : "hover:shadow-md",
                )}
              >
                <Plus className="w-3 h-3" />
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Focus Ring */}
        {isFocused && (
          <div className="absolute inset-0 rounded-lg pointer-events-none">
            <div className="absolute inset-0 rounded-lg bg-teal-500/5" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <div className="text-xs text-red-600 px-1">{error}</div>}

      {/* Helper Text */}
      {!error && (isFocused || taskName.trim()) && (
        <div className="text-xs text-gray-500 px-1">
          Press Enter to add • Tab for description •{" "}
          {showDescription
            ? "Escape to close description"
            : taskName.trim()
              ? "Escape to clear"
              : "Escape to close"}
        </div>
      )}
    </form>
  );
};
