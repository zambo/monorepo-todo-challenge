import { test, expect, describe } from "vitest";

import {
  TASK_FILTER,
  TASK_FILTERS,
  TASK_FILTER_LABELS,
  LOCAL_STORAGE_KEYS,
} from "./constants/tasks.ts";
import type { Task, TaskFilter, TaskFormData } from "./types/task.ts";

describe("Task Types", () => {
  test("Task interface has correct structure", () => {
    const mockTask: Task = {
      id: "test-id",
      name: "Test task",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(mockTask.id).toBe("test-id");
    expect(mockTask.name).toBe("Test task");
    expect(mockTask.completed).toBe(false);
    expect(mockTask.createdAt).toBeInstanceOf(Date);
    expect(mockTask.updatedAt).toBeInstanceOf(Date);
  });

  test("TaskFilter type accepts valid values", () => {
    const filters: TaskFilter[] = ["all", "active", "completed"];

    filters.forEach((filter) => {
      expect(["all", "active", "completed"]).toContain(filter);
    });
  });

  test("TaskFormData interface works correctly", () => {
    const formData: TaskFormData = {
      name: "New task",
    };

    expect(formData.name).toBe("New task");
  });
});

describe("Task Constants - Modern Enum Pattern", () => {
  test("TASK_FILTER contains value and label pairs", () => {
    expect(TASK_FILTER.ALL).toEqual({ value: "all", label: "All" });
    expect(TASK_FILTER.ACTIVE).toEqual({ value: "active", label: "Active" });
    expect(TASK_FILTER.COMPLETED).toEqual({
      value: "completed",
      label: "Completed",
    });
  });

  test("TASK_FILTERS provides convenient value access", () => {
    expect(TASK_FILTERS.ALL).toBe("all");
    expect(TASK_FILTERS.ACTIVE).toBe("active");
    expect(TASK_FILTERS.COMPLETED).toBe("completed");
  });

  test("TASK_FILTER_LABELS maps values to labels correctly", () => {
    expect(TASK_FILTER_LABELS[TASK_FILTERS.ALL]).toBe("All");
    expect(TASK_FILTER_LABELS[TASK_FILTERS.ACTIVE]).toBe("Active");
    expect(TASK_FILTER_LABELS[TASK_FILTERS.COMPLETED]).toBe("Completed");
  });

  test("LOCAL_STORAGE_KEYS are defined", () => {
    expect(LOCAL_STORAGE_KEYS.TASKS).toBe("tasks");
    expect(LOCAL_STORAGE_KEYS.FILTER).toBe("taskFilter");
  });

  test("single source of truth - adding new filter would be easy", () => {
    // This test demonstrates the pattern's extensibility
    const filterKeys = Object.keys(TASK_FILTER);
    const filterValues = Object.values(TASK_FILTER);

    expect(filterKeys).toEqual(["ALL", "ACTIVE", "COMPLETED"]);
    expect(filterValues).toEqual([
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "completed", label: "Completed" },
    ]);
  });

  test("derived objects stay in sync with source", () => {
    // Test that TASK_FILTERS and TASK_FILTER_LABELS are properly derived
    Object.entries(TASK_FILTER).forEach(([key, config]) => {
      const filterKey = key as keyof typeof TASK_FILTERS;
      expect(TASK_FILTERS[filterKey]).toBe(config.value);
      expect(TASK_FILTER_LABELS[config.value]).toBe(config.label);
    });
  });
});
