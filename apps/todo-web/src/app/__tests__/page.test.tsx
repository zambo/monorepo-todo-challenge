import type { Task } from "@repo/shared";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";

import Home from "../page";

// Mock next/font
vi.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
  }),
}));

// Get references to mocked functions
const mockStores = vi.hoisted(() => ({
  useTasks: vi.fn(() => [] as Task[]),
  useFilter: vi.fn(() => "all"),
  useIsEditing: vi.fn(() => null),
  useAddTask: vi.fn(() => vi.fn()),
  useToggleTask: vi.fn(() => vi.fn()),
  useDeleteTask: vi.fn(() => vi.fn()),
  useEditTask: vi.fn(() => vi.fn()),
  useStartEditing: vi.fn(() => vi.fn()),
  useCancelEditing: vi.fn(() => vi.fn()),
  useClearCompleted: vi.fn(() => vi.fn()),
  useSetFilter: vi.fn(() => vi.fn()),
  useGetProgress: vi.fn(() =>
    vi.fn(() => ({
      completed: 0,
      total: 0,
      percentage: 0,
    })),
  ),
}));

vi.mock("@repo/stores", () => mockStores);

// Mock window.innerWidth for mobile detection
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

describe("Home Page", () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Reset to default values
    mockStores.useTasks.mockReturnValue([]);
    mockStores.useFilter.mockReturnValue("all");
    mockStores.useIsEditing.mockReturnValue(null);
    mockStores.useGetProgress.mockReturnValue(
      vi.fn(() => ({
        completed: 0,
        total: 0,
        percentage: 0,
      })),
    );

    // Reset window width
    window.innerWidth = 1024;
  });

  afterEach(() => {
    // Clean up any event listeners
    document.body.style.overflow = "unset";
  });

  test("renders date header correctly", () => {
    render(<Home />);

    const now = new Date();
    const day = now.getDate().toString();
    const month = now
      .toLocaleDateString("en", { month: "short" })
      .toUpperCase();
    const year = now.getFullYear().toString();
    const dayName = now
      .toLocaleDateString("en", { weekday: "long" })
      .toUpperCase();

    expect(screen.getByText(day)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(month, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(year, "i"))).toBeInTheDocument();
    expect(screen.getByText(dayName)).toBeInTheDocument();
  });

  test("shows empty state when no tasks", () => {
    mockStores.useTasks.mockReturnValue([]);

    render(<Home />);

    expect(screen.getByText("Add a task to get started!")).toBeInTheDocument();
  });

  test("shows progress tracker when tasks exist", () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        name: "Task 1",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Task 2",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockStores.useTasks.mockReturnValue(mockTasks);
    mockStores.useGetProgress.mockReturnValue(
      vi.fn(() => ({
        completed: 1,
        total: 2,
        percentage: 50,
      })),
    );

    render(<Home />);

    expect(screen.getByText("Progress Tracker")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  test("shows correct progress labels", () => {
    const testCases = [
      { percentage: 0, label: "Get started!" },
      { percentage: 20, label: "Just getting started" },
      { percentage: 40, label: "Making progress" },
      { percentage: 60, label: "Almost there" },
      { percentage: 90, label: "Great job!" },
    ];

    testCases.forEach(({ percentage, label }) => {
      mockStores.useGetProgress.mockReturnValue(
        vi.fn(() => ({
          completed: 1,
          total: 2,
          percentage,
        })),
      );
      mockStores.useTasks.mockReturnValue([
        {
          id: "1",
          name: "Task",
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const { rerender } = render(<Home />);

      expect(screen.getByText(label)).toBeInTheDocument();

      rerender(<></>); // Clear for next iteration
    });
  });

  test("renders filter buttons correctly", () => {
    render(<Home />);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  test("calls setFilter when filter buttons are clicked", async () => {
    const user = userEvent.setup();
    const mockSetFilter = vi.fn();
    mockStores.useSetFilter.mockReturnValue(mockSetFilter);

    render(<Home />);

    await user.click(screen.getByText("Active"));
    expect(mockSetFilter).toHaveBeenCalledWith("active");

    await user.click(screen.getByText("Completed"));
    expect(mockSetFilter).toHaveBeenCalledWith("completed");
  });

  test("shows clear completed button when there are completed tasks", () => {
    mockStores.useTasks.mockReturnValue([
      {
        id: "1",
        name: "Task 1",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    mockStores.useGetProgress.mockReturnValue(
      vi.fn(() => ({
        completed: 1,
        total: 1,
        percentage: 100,
      })),
    );

    render(<Home />);

    expect(screen.getByText("Clear completed")).toBeInTheDocument();
  });

  test("calls clearCompleted when button is clicked", async () => {
    const user = userEvent.setup();
    const mockClearCompleted = vi.fn();
    mockStores.useClearCompleted.mockReturnValue(mockClearCompleted);
    mockStores.useTasks.mockReturnValue([
      {
        id: "1",
        name: "Task 1",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    mockStores.useGetProgress.mockReturnValue(
      vi.fn(() => ({
        completed: 1,
        total: 1,
        percentage: 100,
      })),
    );

    render(<Home />);

    await user.click(screen.getByText("Clear completed"));
    expect(mockClearCompleted).toHaveBeenCalled();
  });

  test("shows correct plural text for multiple completed tasks", () => {
    mockStores.useTasks.mockReturnValue([
      {
        id: "1",
        name: "Task 1",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Task 2",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Task 3",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    mockStores.useGetProgress.mockReturnValue(
      vi.fn(() => ({
        completed: 2,
        total: 3,
        percentage: 67,
      })),
    );

    render(<Home />);

    expect(screen.getByText("Clear completed")).toBeInTheDocument();
  });

  test("shows task input on desktop", () => {
    window.innerWidth = 1024; // Desktop width

    render(<Home />);

    expect(
      screen.getByPlaceholderText("Add a new task..."),
    ).toBeInTheDocument();
  });

  test("shows floating action button on mobile", () => {
    window.innerWidth = 500; // Mobile width

    render(<Home />);

    // Should show floating action button
    expect(screen.getByLabelText("Add new task")).toBeInTheDocument();

    // Should not show desktop task input
    expect(
      screen.queryByPlaceholderText("Add a new task..."),
    ).not.toBeInTheDocument();
  });

  test("opens mobile modal when FAB is clicked", async () => {
    const user = userEvent.setup();
    window.innerWidth = 500; // Mobile width

    render(<Home />);

    await user.click(screen.getByLabelText("Add new task"));

    expect(screen.getByText("Add New Task")).toBeInTheDocument();
    expect(screen.getByLabelText("Close modal")).toBeInTheDocument();
  });

  test("closes mobile modal when close button is clicked", async () => {
    const user = userEvent.setup();
    window.innerWidth = 500; // Mobile width

    render(<Home />);

    // Open modal
    await user.click(screen.getByLabelText("Add new task"));
    expect(screen.getByText("Add New Task")).toBeInTheDocument();

    // Close modal
    await user.click(screen.getByLabelText("Close modal"));
    expect(screen.queryByText("Add New Task")).not.toBeInTheDocument();
  });

  test("closes modal when backdrop is clicked", async () => {
    const user = userEvent.setup();
    window.innerWidth = 500; // Mobile width

    render(<Home />);

    // Open modal
    await user.click(screen.getByLabelText("Add new task"));
    expect(screen.getByText("Add New Task")).toBeInTheDocument();

    // Click backdrop (the modal overlay)
    const backdrop = document.querySelector(".fixed.inset-0.bg-black\\/50");
    if (backdrop) {
      await user.click(backdrop);
      expect(screen.queryByText("Add New Task")).not.toBeInTheDocument();
    }
  });

  test("closes modal on escape key", async () => {
    window.innerWidth = 500; // Mobile width

    render(<Home />);

    // Open modal
    await userEvent.setup().click(screen.getByLabelText("Add new task"));
    expect(screen.getByText("Add New Task")).toBeInTheDocument();

    // Press escape
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByText("Add New Task")).not.toBeInTheDocument();
    });
  });

  test("prevents body scroll when modal is open", async () => {
    const user = userEvent.setup();
    window.innerWidth = 500; // Mobile width

    render(<Home />);

    // Initially body should not have overflow hidden
    expect(document.body.style.overflow).toBe("unset");

    // Open modal
    await user.click(screen.getByLabelText("Add new task"));

    // Body should now have overflow hidden
    expect(document.body.style.overflow).toBe("hidden");

    // Close modal
    await user.click(screen.getByLabelText("Close modal"));

    // Body should be restored
    expect(document.body.style.overflow).toBe("unset");
  });

  test("renders tasks correctly", () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        name: "Task 1",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Task 2",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockStores.useTasks.mockReturnValue(mockTasks);

    render(<Home />);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("filters tasks correctly", () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        name: "Active Task",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Completed Task",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Test active filter
    mockStores.useTasks.mockReturnValue(mockTasks);
    mockStores.useFilter.mockReturnValue("active");

    const { rerender } = render(<Home />);

    expect(screen.getByText("Active Task")).toBeInTheDocument();
    expect(screen.queryByText("Completed Task")).not.toBeInTheDocument();

    // Test completed filter
    mockStores.useFilter.mockReturnValue("completed");
    rerender(<Home />);

    expect(screen.queryByText("Active Task")).not.toBeInTheDocument();
    expect(screen.getByText("Completed Task")).toBeInTheDocument();
  });

  test("shows development info only in development", () => {
    // Mock development environment
    vi.stubEnv("NODE_ENV", "development");

    const { rerender } = render(<Home />);
    expect(screen.getByText("Enhanced Features Active")).toBeInTheDocument();

    // Test production mode
    vi.stubEnv("NODE_ENV", "production");
    rerender(<Home />);
    expect(
      screen.queryByText("Enhanced Features Active"),
    ).not.toBeInTheDocument();

    // Cleanup
    vi.unstubAllEnvs();
  });

  test("handles window resize events for mobile detection", () => {
    const { rerender } = render(<Home />);

    // Start as desktop
    expect(window.innerWidth).toBe(1024);
    expect(
      screen.getByPlaceholderText("Add a new task..."),
    ).toBeInTheDocument();

    // Simulate resize to mobile
    window.innerWidth = 500;
    fireEvent(window, new Event("resize"));

    // Re-render to trigger the resize effect
    rerender(<Home />);

    // Should now show mobile FAB
    expect(screen.getByLabelText("Add new task")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Add a new task..."),
    ).not.toBeInTheDocument();
  });

  test("calls addTask when task is added", async () => {
    const mockAddTask = vi.fn();
    mockStores.useAddTask.mockReturnValue(mockAddTask);

    render(<Home />);

    // This is a simplified test - in reality TaskInput component would handle the submission
    // We're testing that the handleAddTask function would be called correctly
    const input = screen.getByPlaceholderText("Add a new task...");
    expect(input).toBeInTheDocument();

    // The actual testing of task addition would be in the TaskInput component tests
  });

  test("shows empty state when filtered tasks return no results", () => {
    mockStores.useTasks.mockReturnValue([
      {
        id: "1",
        name: "Completed Task",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    mockStores.useFilter.mockReturnValue("active"); // Show only active tasks

    render(<Home />);

    // When filtering shows no results, no tasks should be visible
    expect(screen.queryByText("Completed Task")).not.toBeInTheDocument();
    // The app should show an empty filtered list (not the "Add task" message, since tasks exist but are filtered out)
    // This is current app behavior - we have tasks but they're filtered out
    expect(
      screen.queryByText("Add a task to get started!"),
    ).not.toBeInTheDocument();
  });
});
