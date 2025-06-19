import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders input with correct attributes", () => {
    render(<Input placeholder="Enter text" data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Enter text");
  });

  it("renders with label when provided", () => {
    render(<Input label="Test Label" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAccessibleName("Test Label");
  });

  it("shows error message when error prop is provided", () => {
    render(<Input error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies error styling when error is present", () => {
    render(
      <Input error="Error message" data-testid="error-input" wrapper={false} />,
    );

    const input = screen.getByTestId("error-input");
    expect(input).toHaveClass("border-red-500");
  });

  it("handles focus and blur events", async () => {
    const user = userEvent.setup();
    render(<Input data-testid="focus-input" />);

    const input = screen.getByTestId("focus-input");

    await user.click(input);
    expect(input).toHaveFocus();

    await user.tab();
    expect(input).not.toHaveFocus();
  });

  it("calls onChange when value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input onChange={handleChange} data-testid="change-input" />);

    const input = screen.getByTestId("change-input");
    await user.type(input, "test");

    expect(handleChange).toHaveBeenCalled();
  });

  it("can be controlled", () => {
    const { rerender } = render(<Input value="initial" readOnly />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("initial");

    rerender(<Input value="updated" readOnly />);
    expect(input).toHaveValue("updated");
  });

  it("uses provided id", () => {
    render(<Input id="custom-id" label="Custom Label" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "custom-id");

    const label = screen.getByText("Custom Label");
    expect(label).toHaveAttribute("for", "custom-id");
  });

  it("renders without wrapper when wrapper is false", () => {
    render(<Input wrapper={false} data-testid="no-wrapper" />);

    const input = screen.getByTestId("no-wrapper");
    expect(input).toHaveClass("border"); // Should have border when wrapper is false
  });
});
