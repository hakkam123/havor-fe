<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      title="Contact Havor"
      subtitle="Tell us what you want to build, improve, or clarify. Our team will review your message and respond by email."
      :image="contactImage"
      hero-size="half"
      image-label="Contact"
      image-title="A clearer first conversation for your next digital initiative."
      side-label="Start a Discussion"
      side-title="Share the context, goals, and timeline that matter most."
      :side-copy="`You can also contact us through ${company.email} or ${company.phone}.`"
    />

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <aside class="brand-panel p-6">
            <p class="brand-meta">Company Contact</p>
            <h2 class="mt-3 text-2xl font-semibold leading-tight text-[#0e2344]">PT Havor Smarta Digital</h2>
            <div class="mt-5 space-y-4 text-sm leading-6 text-slate-600">
              <p><span class="font-semibold text-[#0e2344]">Email:</span> {{ company.email }}</p>
              <p><span class="font-semibold text-[#0e2344]">Phone:</span> {{ company.phone }}</p>
              <p><span class="font-semibold text-[#0e2344]">Office:</span> {{ company.office }}</p>
            </div>
          </aside>

          <form
            id="contact-form"
            class="brand-panel p-5 sm:p-6"
            novalidate
            @submit.prevent="handleContactSubmit"
          >
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="text-sm font-semibold" for="contact-name">
                Name <span class="text-rose-600">*</span>
                <input
                  id="contact-name"
                  v-model="contactForm.name"
                  class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                  type="text"
                  autocomplete="name"
                  :aria-invalid="Boolean(contactFieldErrors.name)"
                >
                <span v-if="contactFieldErrors.name" class="mt-1 block text-xs font-medium text-rose-600">{{ contactFieldErrors.name }}</span>
              </label>

              <label class="text-sm font-semibold" for="contact-email">
                Email <span class="text-rose-600">*</span>
                <input
                  id="contact-email"
                  v-model="contactForm.email"
                  class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                  type="email"
                  autocomplete="email"
                  :aria-invalid="Boolean(contactFieldErrors.email)"
                >
                <span v-if="contactFieldErrors.email" class="mt-1 block text-xs font-medium text-rose-600">{{ contactFieldErrors.email }}</span>
              </label>
            </div>

            <label class="mt-3 block text-sm font-semibold" for="contact-subject">
              Subject <span class="text-rose-600">*</span>
              <input
                id="contact-subject"
                v-model="contactForm.subject"
                class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                type="text"
                autocomplete="off"
                :aria-invalid="Boolean(contactFieldErrors.subject)"
              >
              <span v-if="contactFieldErrors.subject" class="mt-1 block text-xs font-medium text-rose-600">{{ contactFieldErrors.subject }}</span>
            </label>

            <label class="mt-3 block text-sm font-semibold" for="contact-message">
              Message <span class="text-rose-600">*</span>
              <textarea
                id="contact-message"
                v-model="contactForm.message"
                class="mt-2 min-h-36 w-full resize-y rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                :aria-invalid="Boolean(contactFieldErrors.message)"
              ></textarea>
              <span v-if="contactFieldErrors.message" class="mt-1 block text-xs font-medium text-rose-600">{{ contactFieldErrors.message }}</span>
            </label>

            <p
              v-if="contactMessage"
              class="mt-3 rounded-lg px-3 py-2 text-sm font-medium"
              :class="contactStatus === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
              role="status"
              aria-live="polite"
            >
              {{ contactMessage }}
            </p>

            <div class="mt-5 flex justify-end">
              <button
                type="submit"
                class="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="contactStatus === 'loading'"
              >
                {{ contactStatus === 'loading' ? 'Sending...' : 'Send Message' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { submitContactMessage } from '~/services/contactService'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Contact | PT Havor SMART Digital',
  description: 'Contact PT Havor SMART Digital to discuss website development, mobile apps, system integration, digital products, or long-term support.',
  path: '/contact'
})

const { company, homePage } = useCorporateContent()
const contactImage = homePage.hero.slides[1].image
const contactStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const contactMessage = ref('')
const contactFieldErrors = ref<Record<string, string>>({})
const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateContactForm = () => {
  const errors: Record<string, string> = {}

  if (!contactForm.name.trim()) errors.name = 'Name is required.'
  if (!contactForm.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(contactForm.email.trim())) {
    errors.email = 'Please enter a valid email address, for example name@gmail.com.'
  }
  if (!contactForm.subject.trim()) errors.subject = 'Subject is required.'
  if (!contactForm.message.trim()) errors.message = 'Message is required.'

  contactFieldErrors.value = errors

  if (Object.keys(errors).length) {
    contactStatus.value = 'error'
    contactMessage.value = Object.values(errors)[0]
    return false
  }

  return true
}

const resetContactForm = () => {
  contactForm.name = ''
  contactForm.email = ''
  contactForm.subject = ''
  contactForm.message = ''
}

const handleContactSubmit = async () => {
  if (!validateContactForm()) return

  contactStatus.value = 'loading'
  contactMessage.value = ''

  try {
    await submitContactMessage({
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      subject: contactForm.subject.trim(),
      message: contactForm.message.trim()
    })

    resetContactForm()
    contactFieldErrors.value = {}
    contactStatus.value = 'success'
    contactMessage.value = 'Your message has been sent successfully. Please wait while our team reviews your submission. We will contact you by email.'
  } catch (error) {
    contactStatus.value = 'error'
    contactMessage.value = error instanceof Error
      ? error.message
      : 'We could not submit your message. Please try again in a moment.'
  }
}
</script>
