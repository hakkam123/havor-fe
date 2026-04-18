const appendFormValue = (formData: FormData, key: string, value: any) => {
  if (value === undefined || value === null || value === '') return

  if (value instanceof Blob) {
    formData.append(key, value)
    return
  }

  formData.append(key, String(value))
}

export const toFormData = (payload: Record<string, any>) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    appendFormValue(formData, key, value)
  })

  return formData
}
