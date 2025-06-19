import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { TaskInput } from "./TaskInput";

describe("TaskInput", () => {
  const mockOnAddTask = vi.fn();

  beforeEach(() => {
    mockOnAddTask.mockClear();
  });

  it("renders with default placeholder", () => {
    render(<TaskInput onAddTask={mockOnAddTask} />);

    expect(
      screen.getByPlaceholderText("Add a new task..."),
    ).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(
      <TaskInput onAddTask={mockOnAddTask} placeholder="Custom placeholder" />,
    );

    expect(
      screen.getByPlaceholderText("Custom placeholder"),
    ).toBeInTheDocument();
  });

  it("adds task on Enter key", async () => {
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "New task");
    await user.keyboard("{Enter}");

    expect(mockOnAddTask).toHaveBeenCalledWith("New task", undefined);
  });

  it("adds task with description when description is provided", async () => {
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "New task");

    // Toggle description field with Tab
    await user.keyboard("{Tab}");

    const descriptionInput = screen.getByPlaceholderText(
      "Add a description (optional)...",
    );
    await user.type(descriptionInput, "Task description");

    await user.keyboard("{Enter}");

    expect(mockOnAddTask).toHaveBeenCalledWith("New task", "Task description");
  });

  it("clears input after adding task", async () => {
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "New task");
    await user.keyboard("{Enter}");

    expect(input).toHaveValue("");
  });

  it("does not add empty task", async () => {
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);

    screen.getByPlaceholderText("Add a new task..."); // Verify input exists
    await user.keyboard("{Enter}");

    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it("trims whitespace from task name", async () => {
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "  Task with spaces  ");
    await user.keyboard("{Enter}");

    expect(mockOnAddTask).toHaveBeenCalledWith("Task with spaces", undefined);
  });

  it("shows description field when toggled", async () => {
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task");

    // Toggle description with Tab
    await user.keyboard("{Tab}");

    expect(
      screen.getByPlaceholderText("Add a description (optional)..."),
    ).toBeInTheDocument();
  });

  it("auto-focuses when autoFocus is true", () => {
    render(<TaskInput onAddTask={mockOnAddTask} autoFocus={true} />);

    expect(screen.getByPlaceholderText("Add a new task...")).toHaveFocus();
  });

  it("does not auto-focus when autoFocus is false", () => {
    render(<TaskInput onAddTask={mockOnAddTask} autoFocus={false} />);

    expect(screen.getByPlaceholderText("Add a new task...")).not.toHaveFocus();
  });

  it("applies custom className", () => {
    render(<TaskInput onAddTask={mockOnAddTask} className="custom-class" />);

    const form = screen
      .getByPlaceholderText("Add a new task...")
      .closest("form");
    expect(form).toHaveClass("custom-class");
  });
});
