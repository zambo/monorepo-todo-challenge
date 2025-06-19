import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// Mock next/font
vi.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
  }),
}));

import RootLayout, { metadata } from "../layout";

describe("RootLayout", () => {
  test("renders children correctly", () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="child-content">Test content</div>
      </RootLayout>,
    );

    const childContent = container.querySelector(
      '[data-testid="child-content"]',
    );
    expect(childContent).toBeInTheDocument();
    expect(childContent).toHaveTextContent("Test content");
  });
});

describe("Metadata", () => {
  test("has correct title", () => {
    expect(metadata.title).toBe("Todo App");
  });

  test("has correct description", () => {
    expect(metadata.description).toBe("Simple todo app within a monorepo");
  });
});
