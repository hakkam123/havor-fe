import { publicApiFetch } from './api'

export type ContactFormPayload = {
  name: string
  email: string
  subject: string
  message: string
}

export const submitContactMessage = (payload: ContactFormPayload) => {
  return publicApiFetch('/contact', {
    method: 'POST',
    body: payload
  })
}
