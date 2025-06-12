"use client";

import React, { useState } from "react";

import { Button } from "../base/Button";
import { Input } from "../base/Input";

export interface TaskInputProps {
  onAddTask: (taskName: string) => void;
  className?: string;
  placeholder?: string;
}

export const TaskInput = ({
  onAddTask,
  className = "",
  placeholder = "What needs to be done?",
}: TaskInputProps) => {
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      setError("Task name cannot be empty");
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

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-2 ${className}`}
    >
      <div className="flex-1">
        <Input
          value={taskName}
          onChange={handleChange}
          placeholder={placeholder}
          error={error ?? ""}
          aria-label="New task name"
          className="w-full"
        />
      </div>
      <Button type="submit" aria-label="Add new task">
        Add Task
      </Button>
    </form>
  );
};
