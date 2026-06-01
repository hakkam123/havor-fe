import { publicApiFetch } from './api'

export type CareerApplicationPayload = {
  fullName: string
  email: string
  phone: string
  address: string
  position: string
  latestEducation: string
  experienceSummary: string
  portfolioUrl?: string
  message: string
  cv: File
}

export const submitCareerApplication = (payload: CareerApplicationPayload) => {
  const formData = new FormData()

  formData.append('fullName', payload.fullName)
  formData.append('email', payload.email)
  formData.append('phone', payload.phone)
  formData.append('address', payload.address)
  formData.append('position', payload.position)
  formData.append('latestEducation', payload.latestEducation)
  formData.append('experienceSummary', payload.experienceSummary)
  formData.append('portfolioUrl', payload.portfolioUrl || '')
  formData.append('message', payload.message)
  formData.append('cv', payload.cv)

  return publicApiFetch('/api/careers', {
    method: 'POST',
    body: formData
  })
}
