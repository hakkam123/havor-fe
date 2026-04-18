export const useUpload = () => {
  const isUploading = ref(false)

  const uploadFile = async (file: File): Promise<string> => {
    isUploading.value = true
    try {
      const { apiFetch } = useApi()
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await apiFetch<{ url: string }>('/upload/image', {
        method: 'POST',
        body: formData
      })
      
      return res.url
    } catch (e) {
      console.error('File upload failed', e)
      throw e
    } finally {
      isUploading.value = false
    }
  }

  return {
    isUploading,
    uploadFile
  }
}
