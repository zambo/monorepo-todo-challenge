export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function cn(
  ...classes: (string | undefined | null | boolean)[]
): string {
  return classes.filter(Boolean).join(" ");
}
