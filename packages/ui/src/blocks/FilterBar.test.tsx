import { TASK_FILTER } from "@repo/shared";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  const mockOnFilterChange = vi.fn();
  const mockOnClearCompleted = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
    mockOnClearCompleted.mockClear();
  });

  it("renders all filter options as pills", () => {
    render(
      <FilterBar
        currentFilter={TASK_FILTER.ALL.value}
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        hasCompletedTasks={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: /show all tasks/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /show active tasks/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /show completed tasks/i }),
    ).toBeInTheDocument();
  });

  it("highlights active filter with correct styling", () => {
    render(
      <FilterBar
        currentFilter={TASK_FILTER.ACTIVE.value}
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        hasCompletedTasks={false}
      />,
    );

    const activeButton = screen.getByRole("button", {
      name: /show active tasks/i,
    });
    expect(activeButton).toHaveClass("bg-teal-500", "text-white");
    expect(activeButton).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onFilterChange when filter is clicked", async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        currentFilter={TASK_FILTER.ALL.value}
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        hasCompletedTasks={false}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /show active tasks/i }),
    );
    expect(mockOnFilterChange).toHaveBeenCalledWith(TASK_FILTER.ACTIVE.value);
  });

  it("shows clear completed button only when hasCompletedTasks is true", () => {
    const { rerender } = render(
      <FilterBar
        currentFilter={TASK_FILTER.ALL.value}
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        hasCompletedTasks={false}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /clear all completed tasks/i }),
    ).not.toBeInTheDocument();

    rerender(
      <FilterBar
        currentFilter={TASK_FILTER.ALL.value}
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        hasCompletedTasks={true}
      />,
    );

    expect(
      screen.getByRole("button", { name: /clear all completed tasks/i }),
    ).toBeInTheDocument();
  });

  it("calls onClearCompleted when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        currentFilter={TASK_FILTER.ALL.value}
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        hasCompletedTasks={true}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /clear all completed tasks/i }),
    );
    expect(mockOnClearCompleted).toHaveBeenCalled();
  });

  it("renders with icons for each filter option", () => {
    render(
      <FilterBar
        currentFilter={TASK_FILTER.ALL.value}
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        hasCompletedTasks={true}
      />,
    );

    // Check that icons are present (they're SVGs)
    const icons = document.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("has responsive layout classes", () => {
    const { container } = render(
      <FilterBar
        currentFilter={TASK_FILTER.ALL.value}
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        hasCompletedTasks={false}
      />,
    );

    const filterContainer = container.firstChild;
    expect(filterContainer).toHaveClass("flex", "flex-col", "sm:flex-row");
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        currentFilter={TASK_FILTER.ALL.value}
        onFilterChange={mockOnFilterChange}
        onClearCompleted={mockOnClearCompleted}
        hasCompletedTasks={false}
      />,
    );

    const allButton = screen.getByRole("button", { name: /show all tasks/i });
    await user.tab();
    expect(allButton).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(mockOnFilterChange).toHaveBeenCalledWith(TASK_FILTER.ALL.value);
  });
});
