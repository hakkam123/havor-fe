export const toApiArray = <T>(value: unknown): T[] => {
  const items = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)
      ? (value as { data: unknown[] }).data
      : []

  return items.filter((item): item is T => Boolean(item) && typeof item === 'object')
}
