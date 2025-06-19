import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders checkbox with correct attributes", () => {
    render(<Checkbox data-testid="test-checkbox" />);

    const checkbox = screen.getByTestId("test-checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("renders with label when provided", () => {
    render(<Checkbox label="Test Label" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toHaveAccessibleName("Test Label");
  });

  it("can be checked and unchecked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox onChange={handleChange} data-testid="toggle-checkbox" />);

    const checkbox = screen.getByTestId("toggle-checkbox");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it("reflects checked state correctly", () => {
    const { rerender } = render(<Checkbox checked={false} readOnly />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox checked={true} readOnly />);
    expect(checkbox).toBeChecked();
  });

  it("can be disabled", () => {
    render(<Checkbox disabled data-testid="disabled-checkbox" />);

    const checkbox = screen.getByTestId("disabled-checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("uses provided id", () => {
    render(<Checkbox id="custom-id" label="Custom Label" />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", "custom-id");

    const label = screen.getByText("Custom Label");
    expect(label).toHaveAttribute("for", "custom-id");
  });

  it("shows checkmark when checked", () => {
    render(<Checkbox checked={true} readOnly />);

    // The checkmark is rendered as an SVG
    const checkmark = document.querySelector("svg");
    expect(checkmark).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Checkbox className="custom-class" data-testid="custom-checkbox" />);

    // The custom class is applied to the visual checkbox div, not the sr-only input
    const checkbox = screen.getByTestId("custom-checkbox");
    const visualCheckbox = checkbox.nextElementSibling;
    expect(visualCheckbox).toHaveClass("custom-class");
  });

  it("handles keyboard interaction", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");
    checkbox.focus();

    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalled();
  });
});
