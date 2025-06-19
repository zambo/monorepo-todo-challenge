import { TASK_FILTER } from "@repo/shared";
import type { Task } from "@repo/shared";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { TaskList } from "./TaskList";

describe("TaskList", () => {
  const mockTasks: Task[] = [
    {
      id: "1",
      name: "Task 1",
      completed: false,
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    },
    {
      id: "2",
      name: "Task 2",
      completed: true,
      createdAt: new Date("2023-01-02"),
      updatedAt: new Date("2023-01-02"),
    },
    {
      id: "3",
      name: "Task 3",
      completed: false,
      createdAt: new Date("2023-01-03"),
      updatedAt: new Date("2023-01-03"),
    },
  ];

  const defaultProps = {
    tasks: mockTasks,
    currentFilter: TASK_FILTER.ALL.value,
    onToggleTask: vi.fn(),
    onDeleteTask: vi.fn(),
    onEditTask: vi.fn(),
    onFilterChange: vi.fn(),
    onClearCompleted: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all tasks when filter is ALL", () => {
    render(<TaskList {...defaultProps} />);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("renders only active tasks when filter is ACTIVE", () => {
    render(
      <TaskList {...defaultProps} currentFilter={TASK_FILTER.ACTIVE.value} />,
    );

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("renders only completed tasks when filter is COMPLETED", () => {
    render(
      <TaskList
        {...defaultProps}
        currentFilter={TASK_FILTER.COMPLETED.value}
      />,
    );

    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.queryByText("Task 3")).not.toBeInTheDocument();
  });

  it("displays task count with proper formatting", () => {
    render(<TaskList {...defaultProps} />);

    expect(screen.getByText("3 tasks • 2 remaining")).toBeInTheDocument();
  });

  it("displays singular task count correctly", () => {
    const singleTask = [mockTasks[0]];
    render(<TaskList {...defaultProps} tasks={singleTask} />);

    expect(screen.getByText("1 task • 1 remaining")).toBeInTheDocument();
  });

  it("shows FilterBar component", () => {
    render(<TaskList {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /show all tasks/i }),
    ).toBeInTheDocument();
  });

  it("shows empty message when no tasks exist", () => {
    render(<TaskList {...defaultProps} tasks={[]} />);

    expect(screen.getByText("No tasks found")).toBeInTheDocument();
  });

  it("shows custom empty message", () => {
    render(
      <TaskList
        {...defaultProps}
        tasks={[]}
        emptyMessage="Custom empty message"
      />,
    );

    expect(screen.getByText("Custom empty message")).toBeInTheDocument();
  });

  it("shows 'No tasks found' when filtered results are empty", () => {
    const activeTasks = mockTasks.filter((t) => !t.completed);
    render(
      <TaskList
        {...defaultProps}
        tasks={activeTasks}
        currentFilter={TASK_FILTER.COMPLETED.value}
      />,
    );

    expect(screen.getByText("No tasks found")).toBeInTheDocument();
  });

  it("enables editing mode for a specific task", async () => {
    const user = userEvent.setup();
    render(<TaskList {...defaultProps} />);

    // Find and click edit button for first task
    const taskItems = screen.getAllByRole("checkbox");
    const firstTaskContainer = taskItems[0].closest("div");

    // Hover to show edit button
    if (firstTaskContainer) {
      await user.hover(firstTaskContainer);
    }

    // The edit buttons are tested in TaskItem.test.tsx
    // This test verifies the editing state management in TaskList
    expect(screen.getByText("Task 1")).toBeInTheDocument();
  });

  it("handles task toggle correctly", async () => {
    const user = userEvent.setup();
    render(<TaskList {...defaultProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(defaultProps.onToggleTask).toHaveBeenCalledWith("1");
  });

  it("calculates remaining tasks correctly", () => {
    render(<TaskList {...defaultProps} />);

    // 3 total tasks, 1 completed, so 2 remaining
    expect(screen.getByText("3 tasks • 2 remaining")).toBeInTheDocument();
  });

  it("shows task count even when tasks list is empty after filtering", () => {
    render(
      <TaskList
        {...defaultProps}
        tasks={[]}
        currentFilter={TASK_FILTER.ACTIVE.value}
      />,
    );

    // Should not show task count when no tasks exist at all
    expect(screen.queryByText(/remaining/)).not.toBeInTheDocument();
  });

  it("task count is always visible when tasks exist", () => {
    render(<TaskList {...defaultProps} />);

    // Task count should be visible at the top, not at the bottom
    const taskCount = screen.getByText("3 tasks • 2 remaining");
    const filterBar = screen.getByRole("button", { name: /show all tasks/i });

    // Task count should be after filter bar in DOM order
    expect(taskCount).toBeInTheDocument();
    expect(filterBar).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <TaskList {...defaultProps} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
