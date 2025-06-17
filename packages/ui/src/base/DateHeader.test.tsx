import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { DateHeader } from "./DateHeader";

describe("DateHeader", () => {
  test("renders current date by default", () => {
    render(<DateHeader />);

    const now = new Date();
    const day = now.getDate().toString();

    expect(screen.getByText(day)).toBeInTheDocument();
  });

  test("renders specific date when provided", () => {
    const testDate = new Date(2025, 5, 15); // June 15, 2025
    render(<DateHeader date={testDate} />);

    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("JUN 2025")).toBeInTheDocument();
    expect(screen.getByText("SUNDAY")).toBeInTheDocument();
  });

  test("hides day name when showDayName is false", () => {
    const testDate = new Date(2025, 5, 15); // June 15, 2025
    render(<DateHeader date={testDate} showDayName={false} />);

    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.queryByText("SUNDAY")).not.toBeInTheDocument();
  });

  test("renders compact variant correctly", () => {
    const testDate = new Date(2025, 5, 15); // June 15, 2025
    render(<DateHeader date={testDate} variant="compact" />);

    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("JUN 2025")).toBeInTheDocument();
    expect(screen.getByText("SUNDAY")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const { container } = render(<DateHeader className="custom-class" />);

    expect(container.firstChild?.firstChild).toHaveClass("custom-class");
  });
});
