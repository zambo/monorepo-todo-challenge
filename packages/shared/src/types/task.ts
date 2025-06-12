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

export interface TaskManagerState {
  tasks: Task[];
  filter: TaskFilter;
}

export type TaskFilter = "all" | "active" | "completed";

export interface TaskActions {
  addTask: (name: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, name: string) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: TaskFilter) => void;
}
