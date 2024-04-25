/** */
export function isValidEvent(event: { status?: unknown; category?: unknown } | null): boolean {
  return !!(
    event &&
    typeof event === 'object' &&
    event.status &&
    typeof event.status === 'string' &&
    event.status.toLowerCase() !== 'archived' &&
    typeof event.category === 'string' &&
    event.category.toLowerCase() !== 'submission'
  );
}
