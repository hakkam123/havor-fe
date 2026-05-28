type FieldErrors = Record<string, string>

export const getApiErrorMessage = (error: any, fallback = 'Request failed. Please try again.') => {
  return error?.data?.message || error?.response?._data?.message || error?.message || fallback
}

export const getApiFieldErrors = (error: any): FieldErrors => {
  const errors = error?.data?.errors || error?.response?._data?.errors
  if (!errors || Array.isArray(errors) || typeof errors !== 'object') return {}

  return Object.entries(errors).reduce<FieldErrors>((result, [field, message]) => {
    result[field] = Array.isArray(message) ? String(message[0] || '') : String(message || '')
    return result
  }, {})
}

export const isValidHttpUrl = (value?: string | null) => {
  if (!value) return true

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const isSupportedImageFile = (file?: File | null) => {
  if (!file) return true
  return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
}
