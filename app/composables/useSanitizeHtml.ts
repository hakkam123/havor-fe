export const sanitizeHtml = (value?: string | null) => {
  if (!value) return ''

  return String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\sjavascript:/gi, '')
}

export const stripHtml = (value?: string | null) => sanitizeHtml(value).replace(/<[^>]*>?/gm, '').trim()
