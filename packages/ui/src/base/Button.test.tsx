import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
// Extends vitest matchers with custom matchers for testing DOM nodes
import "@testing-library/jest-dom";

import { Button } from "./Button";

describe("Button", () => {
  test("renders and handles click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Test</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
