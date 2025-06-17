import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Generates a unique ID string using randomness and the current timestamp.
 * Uses `crypto.getRandomValues` if available, otherwise falls back to `Math.random`.
 * @deprecated using react utils `useId` now. Leaving this for "legacy. TODO: test and remove this fn"
 * @returns {string} A unique identifier string.
 */
export function generateId(): string {
  let randomPart: string;
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    // Use crypto for better randomness
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    randomPart = Array.from(array, (n) => n.toString(36)).join("");
  } else {
    // Fallback to Math.random
    randomPart =
      Math.random().toString(36).substring(2) +
      Math.random().toString(36).substring(2);
  }
  const timestampPart = Date.now().toString(36);
  return `${randomPart}${timestampPart}`;
}

/**
 * Combines class names with proper Tailwind CSS conflict resolution.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 * @param inputs - Class names, objects, or arrays
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
