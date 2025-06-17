import { describe, it, expect, beforeEach } from "vitest";

import { TASK_FILTERS } from "@repo/shared";

import { createTodoStore } from "./useTodoStore";

describe("TodoStore", () => {
  let store: ReturnType<typeof createTodoStore>;

  beforeEach(() => {
    // Create a fresh store for each test without persistence
    store = createTodoStore({
      enablePersistence: false,
      enableDevtools: false,
    });
  });

  describe("Task Management", () => {
    it("should add a new task", () => {
      const { addTask, getState } = store;

      addTask("Buy groceries");

      const state = getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].name).toBe("Buy groceries");
      expect(state.tasks[0].completed).toBe(false);
      expect(state.tasks[0].id).toBeDefined();
      expect(state.tasks[0].createdAt).toBeInstanceOf(Date);
      expect(state.tasks[0].updatedAt).toBeInstanceOf(Date);
    });

    it("should not add empty tasks", () => {
      const { addTask, getState } = store;

      addTask("");
      addTask("   ");

      const state = getState();
      expect(state.tasks).toHaveLength(0);
    });

    it("should toggle task completion", () => {
      const { addTask, toggleTask, getState } = store;

      addTask("Test task");
      const taskId = getState().tasks[0].id;

      toggleTask(taskId);

      const state = getState();
      expect(state.tasks[0].completed).toBe(true);
      expect(state.tasks[0].updatedAt).toBeInstanceOf(Date);
    });

    it("should update task name", () => {
      const { addTask, updateTask, getState } = store;

      addTask("Original name");
      const taskId = getState().tasks[0].id;

      updateTask(taskId, "Updated name");

      const state = getState();
      expect(state.tasks[0].name).toBe("Updated name");
      expect(state.tasks[0].updatedAt).toBeInstanceOf(Date);
    });

    it("should delete a task", () => {
      const { addTask, deleteTask, getState } = store;

      addTask("Task to delete");
      const taskId = getState().tasks[0].id;

      deleteTask(taskId);

      const state = getState();
      expect(state.tasks).toHaveLength(0);
    });

    it("should clear completed tasks", () => {
      const { addTask, toggleTask, clearCompleted, getState } = store;

      addTask("Task 1");
      addTask("Task 2");
      addTask("Task 3");

      const state = getState();
      toggleTask(state.tasks[0].id); // Complete first task
      toggleTask(state.tasks[2].id); // Complete third task

      clearCompleted();

      const finalState = getState();
      expect(finalState.tasks).toHaveLength(1);
      expect(finalState.tasks[0].name).toBe("Task 2");
    });
  });

  describe("Filtering", () => {
    beforeEach(() => {
      const { addTask, toggleTask, getState } = store;

      addTask("Active task 1");
      addTask("Active task 2");
      addTask("Completed task 1");

      const state = getState();
      toggleTask(state.tasks[2].id); // Complete the third task
    });

    it("should filter all tasks", () => {
      const { setFilter, getFilteredTasks } = store;

      setFilter(TASK_FILTERS.ALL);
      const filtered = getFilteredTasks();

      expect(filtered).toHaveLength(3);
    });

    it("should filter active tasks", () => {
      const { setFilter, getFilteredTasks } = store;

      setFilter(TASK_FILTERS.ACTIVE);
      const filtered = getFilteredTasks();

      expect(filtered).toHaveLength(2);
      expect(filtered.every((task) => !task.completed)).toBe(true);
    });

    it("should filter completed tasks", () => {
      const { setFilter, getFilteredTasks } = store;

      setFilter(TASK_FILTERS.COMPLETED);
      const filtered = getFilteredTasks();

      expect(filtered).toHaveLength(1);
      expect(filtered.every((task) => task.completed)).toBe(true);
    });
  });

  describe("Statistics", () => {
    it("should calculate task statistics correctly", () => {
      const { addTask, toggleTask, getTaskStats, getState } = store;

      addTask("Task 1");
      addTask("Task 2");
      addTask("Task 3");
      addTask("Task 4");

      const state = getState();
      toggleTask(state.tasks[0].id);
      toggleTask(state.tasks[1].id);

      const stats = getTaskStats();

      expect(stats.total).toBe(4);
      expect(stats.active).toBe(2);
      expect(stats.completed).toBe(2);
      expect(stats.completionRate).toBe(0.5);
    });

    it("should handle empty task list", () => {
      const { getTaskStats } = store;

      const stats = getTaskStats();

      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.completionRate).toBe(0);
    });
  });

  describe("Bulk Operations", () => {
    it("should toggle all tasks to completed", () => {
      const { addTask, toggleAllTasks, getState } = store;

      addTask("Task 1");
      addTask("Task 2");
      addTask("Task 3");

      toggleAllTasks(true);

      const state = getState();
      expect(state.tasks.every((task) => task.completed)).toBe(true);
    });

    it("should toggle all tasks to active", () => {
      const { addTask, toggleTask, toggleAllTasks, getState } = store;

      addTask("Task 1");
      addTask("Task 2");

      const state = getState();
      toggleTask(state.tasks[0].id);
      toggleTask(state.tasks[1].id);

      toggleAllTasks(false);

      const finalState = getState();
      expect(finalState.tasks.every((task) => !task.completed)).toBe(true);
    });

    it("should import tasks without duplicates", () => {
      const { addTask, importTasks, getState } = store;

      addTask("Existing task");
      const existingId = getState().tasks[0].id;

      const newTasks = [
        {
          id: existingId, // Duplicate
          name: "Duplicate task",
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "new-task-id",
          name: "New task",
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      importTasks(newTasks);

      const finalState = getState();
      expect(finalState.tasks).toHaveLength(2); // Original + 1 new (no duplicate)
      expect(finalState.tasks[1].name).toBe("New task");
    });

    it("should clear all tasks", () => {
      const { addTask, clearAllTasks, getState } = store;

      addTask("Task 1");
      addTask("Task 2");
      addTask("Task 3");

      clearAllTasks();

      const state = getState();
      expect(state.tasks).toHaveLength(0);
    });
  });
});
