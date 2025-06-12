import { expect, test } from "vitest";

import { cn, generateId } from "./index";

test("generateId should create unique IDs", () => {
  const id1 = generateId();
  const id2 = generateId();

  expect(id1).toBeDefined();
  expect(id2).toBeDefined();
  expect(id1).not.toBe(id2);
  expect(typeof id1).toBe("string");
  expect(id1.length).toBeGreaterThan(0);
});

test("cn should combine class names correctly", () => {
  expect(cn("foo", "bar")).toBe("foo bar");
  expect(cn("foo", null, "bar")).toBe("foo bar");
  expect(cn("foo", undefined, "bar")).toBe("foo bar");
  expect(cn("foo", false, "bar")).toBe("foo bar");
  expect(cn()).toBe("");
});
