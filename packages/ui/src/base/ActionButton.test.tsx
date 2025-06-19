import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { ActionButton } from "./ActionButton";

describe("ActionButton", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("renders with correct icon and accessibility attributes", () => {
    render(
      <ActionButton
        onClick={mockOnClick}
        icon={<svg data-testid="test-icon" />}
        label="Test Action"
        variant="edit"
      />,
    );

    const button = screen.getByRole("button", { name: "Test Action" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Test Action");
    expect(button).toHaveAttribute("aria-label", "Test Action");
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("applies correct variant styling", () => {
    const { rerender } = render(
      <ActionButton
        onClick={mockOnClick}
        icon={<svg />}
        label="Edit"
        variant="edit"
      />,
    );

    let button = screen.getByRole("button");
    expect(button).toHaveClass("text-gray-400");

    rerender(
      <ActionButton
        onClick={mockOnClick}
        icon={<svg />}
        label="Delete"
        variant="delete"
      />,
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("text-gray-400");
  });

  it("applies correct size styling", () => {
    const { rerender } = render(
      <ActionButton
        onClick={mockOnClick}
        icon={<svg />}
        label="Test"
        size="sm"
      />,
    );

    let button = screen.getByRole("button");
    expect(button).toHaveClass("w-6", "h-6");

    rerender(
      <ActionButton
        onClick={mockOnClick}
        icon={<svg />}
        label="Test"
        size="md"
      />,
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("w-8", "h-8");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    render(
      <ActionButton onClick={mockOnClick} icon={<svg />} label="Test Action" />,
    );

    await user.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard interaction", async () => {
    const user = userEvent.setup();
    render(
      <ActionButton onClick={mockOnClick} icon={<svg />} label="Test Action" />,
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it("applies custom className", () => {
    render(
      <ActionButton
        onClick={mockOnClick}
        icon={<svg />}
        label="Test"
        className="custom-class"
      />,
    );

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("has proper focus management", async () => {
    const user = userEvent.setup();
    render(
      <ActionButton onClick={mockOnClick} icon={<svg />} label="Test Action" />,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("focus:outline-none", "focus:ring-2");

    await user.tab();
    expect(button).toHaveFocus();
  });

  it("includes animation classes for micro-interactions", () => {
    render(<ActionButton onClick={mockOnClick} icon={<svg />} label="Test" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "transition-all",
      "active:scale-90",
      "hover:scale-110",
    );
  });

  it("defaults to edit variant and sm size", () => {
    render(<ActionButton onClick={mockOnClick} icon={<svg />} label="Test" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-gray-400", "w-6", "h-6");
  });
});
