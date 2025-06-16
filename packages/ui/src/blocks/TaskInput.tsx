"use client";

import React, { useState, useRef, useEffect } from "react";

export interface TaskInputProps {
  onAddTask: (taskName: string) => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export const TaskInput = ({
  onAddTask,
  className = "",
  placeholder,
  autoFocus = true,
}: TaskInputProps) => {
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Use provided placeholder or fallback to translation
  const inputPlaceholder = placeholder;

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

    onAddTask(taskName);
    setTaskName("");
    setError(undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
    if (error && e.target.value.trim()) {
      setError(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTaskName("");
      setError(undefined);
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={taskName}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={inputPlaceholder}
          className={`
            w-full px-0 py-2 text-gray-800 placeholder-gray-400 bg-transparent 
            border-0 border-b-2 border-gray-200 focus:border-emerald-400 
            focus:outline-none transition-colors duration-200
            ${error ? "border-red-400" : ""}
          `}
          aria-label={"Add new task"}
        />
        {error && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-500">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!taskName.trim()}
          className="
            px-4 py-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 
            disabled:text-gray-400 transition-colors duration-200
          "
        >
          {"Add Task"}
        </button>
      </div>
    </form>
  );
};
