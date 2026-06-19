type QueryValue = string | number | string[] | null | undefined;

export function mergeQuery(
  current: URLSearchParams,
  updates: Record<string, QueryValue>,
): string {
  const next = new URLSearchParams(current.toString());

  for (const [key, value] of Object.entries(updates)) {
    const isEmpty =
      value == null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      next.delete(key);
    } else if (Array.isArray(value)) {
      next.set(key, value.join(","));
    } else {
      next.set(key, String(value));
    }
  }

  return next.toString();
}

export function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
