import { TASK_FILTER } from "../constants/tasks";

// Core domain types - the "what" of the application
export interface Task {
  readonly id: string;
  name: string;
  completed: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  description?: string;
}

export interface TaskFormData {
  name: string;
  description?: string;
}

export interface TaskEditData {
  name: string;
  description?: string;
}

/**
 * Progress tracking data for visualization
 */
export interface ProgressData {
  completed: number;
  total: number;
  percentage: number;
}

// Domain value types
export type TaskFilter =
  (typeof TASK_FILTER)[keyof typeof TASK_FILTER]["value"];
