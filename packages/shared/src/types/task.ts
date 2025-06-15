import { TASK_FILTER } from "../constants/tasks";

// Core domain types - the "what" of the application
export interface Task {
  readonly id: string;
  name: string;
  completed: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  name: string;
}

// Domain value types
export type TaskFilter =
  (typeof TASK_FILTER)[keyof typeof TASK_FILTER]["value"];
