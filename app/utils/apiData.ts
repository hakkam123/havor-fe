export const toApiArray = <T>(value: unknown): T[] => {
  const items = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)
      ? (value as { data: unknown[] }).data
      : []

  return items.filter((item): item is T => Boolean(item) && typeof item === 'object')
}

export type ApiPaginationMeta = {
  total: number
  page: number
  limit: number
  pageCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export const defaultPaginationMeta = (limit = 10): ApiPaginationMeta => ({
  total: 0,
  page: 1,
  limit,
  pageCount: 1,
  hasNextPage: false,
  hasPreviousPage: false
})

export const toApiPaginationMeta = (value: unknown, fallbackLimit = 10): ApiPaginationMeta => {
  const meta = value && typeof value === 'object' ? (value as { meta?: Partial<ApiPaginationMeta> }).meta : null

  if (!meta) return defaultPaginationMeta(fallbackLimit)

  return {
    total: Number(meta.total) || 0,
    page: Number(meta.page) || 1,
    limit: Number(meta.limit) || fallbackLimit,
    pageCount: Math.max(1, Number(meta.pageCount) || 1),
    hasNextPage: Boolean(meta.hasNextPage),
    hasPreviousPage: Boolean(meta.hasPreviousPage)
  }
}

export const toQueryString = (params: Record<string, unknown> = {}) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    query.set(key, String(value))
  })

  const value = query.toString()
  return value ? `?${value}` : ''
}
