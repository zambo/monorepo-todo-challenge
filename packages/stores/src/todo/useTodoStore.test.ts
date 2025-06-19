import { TASK_FILTERS } from "@repo/shared";
import { describe, it, expect, beforeEach } from "vitest";

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
      store.getState().addTask("Buy groceries");

      const state = store.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].name).toBe("Buy groceries");
      expect(state.tasks[0].completed).toBe(false);
      expect(state.tasks[0].id).toBeDefined();
      expect(state.tasks[0].createdAt).toBeInstanceOf(Date);
      expect(state.tasks[0].updatedAt).toBeInstanceOf(Date);
    });

    it("should not add empty tasks", () => {
      store.getState().addTask("");
      store.getState().addTask("   ");

      const state = store.getState();
      expect(state.tasks).toHaveLength(0);
    });

    it("should toggle task completion", () => {
      store.getState().addTask("Test task");
      const taskId = store.getState().tasks[0].id;

      store.getState().toggleTask(taskId);

      const state = store.getState();
      expect(state.tasks[0].completed).toBe(true);
      expect(state.tasks[0].updatedAt).toBeInstanceOf(Date);
    });

    it("should update task name", () => {
      store.getState().addTask("Original name");
      const taskId = store.getState().tasks[0].id;

      store.getState().updateTask(taskId, "Updated name");

      const state = store.getState();
      expect(state.tasks[0].name).toBe("Updated name");
      expect(state.tasks[0].updatedAt).toBeInstanceOf(Date);
    });

    it("should delete a task", () => {
      store.getState().addTask("Task to delete");
      const taskId = store.getState().tasks[0].id;

      store.getState().deleteTask(taskId);

      const state = store.getState();
      expect(state.tasks).toHaveLength(0);
    });

    it("should clear completed tasks", () => {
      store.getState().addTask("Task 1");
      store.getState().addTask("Task 2");
      store.getState().addTask("Task 3");

      const state = store.getState();
      store.getState().toggleTask(state.tasks[0].id); // Complete first task
      store.getState().toggleTask(state.tasks[2].id); // Complete third task

      store.getState().clearCompleted();

      const finalState = store.getState();
      expect(finalState.tasks).toHaveLength(1);
      expect(finalState.tasks[0].name).toBe("Task 2");
    });
  });

  describe("Filtering", () => {
    beforeEach(() => {
      store.getState().addTask("Active task 1");
      store.getState().addTask("Active task 2");
      store.getState().addTask("Completed task 1");

      const state = store.getState();
      store.getState().toggleTask(state.tasks[2].id); // Complete the third task
    });

    it("should filter all tasks", () => {
      store.getState().setFilter(TASK_FILTERS.ALL);
      const filtered = store.getState().getFilteredTasks();

      expect(filtered).toHaveLength(3);
    });

    it("should filter active tasks", () => {
      store.getState().setFilter(TASK_FILTERS.ACTIVE);
      const filtered = store.getState().getFilteredTasks();

      expect(filtered).toHaveLength(2);
      expect(filtered.every((task) => !task.completed)).toBe(true);
    });

    it("should filter completed tasks", () => {
      store.getState().setFilter(TASK_FILTERS.COMPLETED);
      const filtered = store.getState().getFilteredTasks();

      expect(filtered).toHaveLength(1);
      expect(filtered.every((task) => task.completed)).toBe(true);
    });
  });

  describe("Statistics", () => {
    it("should calculate task statistics correctly", () => {
      store.getState().addTask("Task 1");
      store.getState().addTask("Task 2");
      store.getState().addTask("Task 3");
      store.getState().addTask("Task 4");

      const state = store.getState();
      store.getState().toggleTask(state.tasks[0].id);
      store.getState().toggleTask(state.tasks[1].id);

      const stats = store.getState().getTaskStats();

      expect(stats.total).toBe(4);
      expect(stats.active).toBe(2);
      expect(stats.completed).toBe(2);
      expect(stats.completionRate).toBe(0.5);
    });

    it("should handle empty task list", () => {
      const stats = store.getState().getTaskStats();

      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.completionRate).toBe(0);
    });
  });

  describe("Bulk Operations", () => {
    it("should toggle all tasks to completed", () => {
      store.getState().addTask("Task 1");
      store.getState().addTask("Task 2");
      store.getState().addTask("Task 3");

      store.getState().toggleAllTasks(true);

      const state = store.getState();
      expect(state.tasks.every((task) => task.completed)).toBe(true);
    });

    it("should toggle all tasks to active", () => {
      store.getState().addTask("Task 1");
      store.getState().addTask("Task 2");

      const state = store.getState();
      store.getState().toggleTask(state.tasks[0].id);
      store.getState().toggleTask(state.tasks[1].id);

      store.getState().toggleAllTasks(false);

      const finalState = store.getState();
      expect(finalState.tasks.every((task) => !task.completed)).toBe(true);
    });

    it("should import tasks without duplicates", () => {
      store.getState().addTask("Existing task");
      const existingId = store.getState().tasks[0].id;

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

      store.getState().importTasks(newTasks);

      const finalState = store.getState();
      expect(finalState.tasks).toHaveLength(2); // Original + 1 new (no duplicate)
      expect(finalState.tasks[1].name).toBe("New task");
    });

    it("should clear all tasks", () => {
      store.getState().addTask("Task 1");
      store.getState().addTask("Task 2");
      store.getState().addTask("Task 3");

      store.getState().clearAllTasks();

      const state = store.getState();
      expect(state.tasks).toHaveLength(0);
    });
  });
});
