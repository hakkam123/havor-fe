<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="careersBanner.title || careersPage.hero.title"
      :subtitle="careersBanner.subtitle || careersPage.hero.subtitle"
      :image="careersHeroImage"
      hero-size="half"
      image-label="Team Culture"
      image-title="A collaborative environment for people who want to build meaningful digital work."
      side-label="Career Experience"
      side-title="Professional growth through serious projects, supportive teamwork, and structured delivery."
      side-copy="Explore opportunities to grow through structured digital delivery and meaningful client work."
      :highlights="[
        { label: 'Open Roles', value: String(careersPage.roles.length) },
        { label: 'Work Style', value: 'Collaborative' },
        { label: 'Growth', value: 'Continuous' }
      ]"
    />

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div class="grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
          <article class="relative isolate overflow-hidden rounded-lg px-6 py-7 text-white shadow-[0_24px_70px_rgba(18,56,122,0.18)] sm:px-8 sm:py-8">
            <img
              :src="careersHeroImage"
              alt="Havor team culture"
              class="absolute inset-0 h-full w-full object-cover"
            >
            <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,24,0.9)_0%,rgba(5,12,24,0.68)_100%)]"></div>
            <div class="relative">
              <p class="inline-flex rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-normal text-white/78">
                Why Work With Us
              </p>
              <h2 class="mt-5 text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-tight tracking-normal">
                Join a team where growth, meaningful work, and support move together.
              </h2>
              <p class="mt-4 text-[0.92rem] leading-7 text-white/80">
                Havor offers a professional environment that values steady development, thoughtful collaboration, and digital work that matters to real clients.
              </p>
            </div>
          </article>

          <div class="grid gap-x-7 gap-y-6 md:grid-cols-2">
            <article
              v-for="item in careersPage.whyWorkHere.items"
              :key="item.title"
              class="border-t border-[#dbe6f4] pt-5"
              v-motion-fade-up
            >
              <h3 class="brand-card-title">{{ item.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ item.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="open-roles" class="brand-section pt-0">
      <div class="marketing-container">
        <SectionHeading
          title="Current opportunities to build with PT Havor SMART Digital."
          description="Each role is presented as a polished corporate listing with clear team, type, location, and role summary."
        />

        <div v-if="careers.length" class="mt-8 grid gap-5 border-y border-[#dbe6f4] py-5 lg:grid-cols-[0.42fr_0.58fr]" v-motion-fade-up>
          <div>
            <label for="career-category" class="brand-meta">Role Category</label>
            <select
              id="career-category"
              v-model="selectedCategory"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
              <option v-for="option in categoryOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <div>
            <label for="career-search" class="brand-meta">Search Role</label>
            <input
              id="career-search"
              v-model="searchQuery"
              type="text"
              placeholder="Search role title, category, or description"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition placeholder:text-slate-400 focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
          </div>
        </div>

        <div v-if="careers.length && filteredCareers.length" class="mt-8 grid gap-4 lg:grid-cols-2">
          <article
            v-for="role in filteredCareers"
            :key="role.id"
            class="brand-panel p-5"
            v-motion-fade-up
          >
            <p class="brand-meta">{{ roleCategoryFor(role) }}</p>
            <h3 class="mt-3 text-[1.25rem] font-semibold tracking-normal text-[#0e2344]">{{ role.job_title }}</h3>
            <p class="mt-2 line-clamp-3 text-[0.86rem] leading-6 text-slate-600">{{ role.excerpt }}</p>
            <div class="mt-5 flex flex-wrap gap-3">
              <NuxtLink :to="`/careers/${role.slug}`" class="btn-outline">
                View Role
              </NuxtLink>
              <button type="button" class="btn-primary" @click="openCareerModal(role.job_title)">
                Apply Now
              </button>
            </div>
          </article>
        </div>
        <div v-else-if="careers.length" class="mt-8 brand-soft-panel p-8 text-center">
          <p class="text-[1rem] font-semibold text-[#0e2344]">No roles match your filter.</p>
          <p class="mt-2 text-[0.92rem] leading-6 text-slate-600">
            Try another role category or broaden your search keyword.
          </p>
          <button @click="selectedCategory = 'All categories'; searchQuery = ''" class="btn-outline mt-6 inline-flex">
            Clear All Filters
          </button>
        </div>
        <div v-else class="mt-8 brand-soft-panel p-10 text-center">
          <h3 class="text-xl font-semibold text-[#0e2344]">No open positions at the moment</h3>
          <p class="mt-4 text-slate-600">While we don't have active roles listed right now, we are always looking for great talent. Send us your CV for future opportunities.</p>
          <button type="button" class="btn-outline mt-8 inline-flex" @click="openCareerModal('General Career Inquiry')">Send your Resume</button>
        </div>
      </div>
    </section>

    <PublicImageCta
      :title="careersPage.cta.title"
      :copy="careersPage.cta.copy"
      :image="careersHeroImage"
      image-alt="Career inquiry"
      action-label="Connect With Us"
    >
      <template #actions>
        <button type="button" class="inline-flex w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-[0.84rem] font-semibold text-[#0e2344] transition hover:bg-[#edf4ff]" @click="openCareerModal('General Career Inquiry')">
          Apply Now
        </button>
      </template>
    </PublicImageCta>

    <Teleport to="body">
      <div
        v-if="isCareerModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-[#031027]/72 px-4 py-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-application-title"
        @click.self="closeCareerModal"
      >
        <form
          id="career-application-form"
          class="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-[#dbe6f4] bg-white p-5 text-[#0e2344] shadow-[0_28px_90px_rgba(3,11,24,0.34)] sm:p-6"
          novalidate
          @submit.prevent="handleCareerSubmit"
        >
          <div class="flex items-start justify-between gap-4 border-b border-[#dbe6f4] pb-4">
            <div>
              <p class="brand-meta">Career Application</p>
              <h2 id="career-application-title" class="mt-2 text-2xl font-semibold leading-tight text-[#0e2344]">
                Apply for {{ careerForm.position || 'a role' }}
              </h2>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Complete your application details and attach your resume in PDF format.
              </p>
            </div>
            <button
              type="button"
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dbe6f4] text-xl leading-none text-slate-500 transition hover:bg-[#edf4ff] hover:text-[#0e2344]"
              aria-label="Close application form"
              @click="closeCareerModal"
            >
              &times;
            </button>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-sm font-semibold" for="career-full-name">
              Full Name
              <input
                id="career-full-name"
                v-model="careerForm.fullName"
                class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                type="text"
                autocomplete="name"
                :aria-invalid="Boolean(careerFieldErrors.fullName)"
                @input="validateCareerField('fullName')"
              >
              <span v-if="careerFieldErrors.fullName" class="mt-1 block text-xs font-medium text-rose-600">
                {{ careerFieldErrors.fullName }}
              </span>
            </label>

            <label class="text-sm font-semibold" for="career-email">
              Email
              <input
                id="career-email"
                v-model="careerForm.email"
                class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                type="email"
                autocomplete="email"
                :aria-invalid="Boolean(careerFieldErrors.email)"
                @input="validateCareerField('email')"
                @blur="validateCareerField('email')"
              >
              <span v-if="careerFieldErrors.email" class="mt-1 block text-xs font-medium text-rose-600">
                {{ careerFieldErrors.email }}
              </span>
            </label>

            <label class="text-sm font-semibold" for="career-phone">
              Phone Number
              <input
                id="career-phone"
                v-model="careerForm.phone"
                class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                type="tel"
                autocomplete="tel"
                :aria-invalid="Boolean(careerFieldErrors.phone)"
                @input="validateCareerField('phone')"
                @blur="validateCareerField('phone')"
              >
              <span v-if="careerFieldErrors.phone" class="mt-1 block text-xs font-medium text-rose-600">
                {{ careerFieldErrors.phone }}
              </span>
            </label>

            <label class="text-sm font-semibold" for="career-address">
              Address
              <input
                id="career-address"
                v-model="careerForm.address"
                class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                type="text"
                autocomplete="street-address"
                :aria-invalid="Boolean(careerFieldErrors.address)"
                @input="validateCareerField('address')"
              >
              <span v-if="careerFieldErrors.address" class="mt-1 block text-xs font-medium text-rose-600">
                {{ careerFieldErrors.address }}
              </span>
            </label>

            <label class="text-sm font-semibold" for="career-position">
              Position Applied
              <select
                id="career-position"
                v-model="careerForm.position"
                class="mt-2 w-full rounded-lg border border-[#d6e5fb] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                :aria-invalid="Boolean(careerFieldErrors.position)"
                @change="validateCareerField('position')"
              >
                <option value="">Select a position</option>
                <option v-for="option in careerPositionOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <span v-if="careerFieldErrors.position" class="mt-1 block text-xs font-medium text-rose-600">
                {{ careerFieldErrors.position }}
              </span>
            </label>

            <label class="text-sm font-semibold" for="career-education">
              Latest Education
              <input
                id="career-education"
                v-model="careerForm.latestEducation"
                class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                type="text"
                placeholder="Example: Bachelor of Computer Science"
                :aria-invalid="Boolean(careerFieldErrors.latestEducation)"
                @input="validateCareerField('latestEducation')"
              >
              <span v-if="careerFieldErrors.latestEducation" class="mt-1 block text-xs font-medium text-rose-600">
                {{ careerFieldErrors.latestEducation }}
              </span>
            </label>
          </div>

          <label class="mt-3 block text-sm font-semibold" for="career-experience">
            Experience Summary
            <input
              id="career-experience"
              v-model="careerForm.experienceSummary"
              class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
              type="text"
              placeholder="Example: 2 years as a Frontend Developer"
              :aria-invalid="Boolean(careerFieldErrors.experienceSummary)"
              @input="validateCareerField('experienceSummary')"
            >
            <span v-if="careerFieldErrors.experienceSummary" class="mt-1 block text-xs font-medium text-rose-600">
              {{ careerFieldErrors.experienceSummary }}
            </span>
          </label>

          <label class="mt-3 block text-sm font-semibold" for="career-portfolio">
            LinkedIn / portfolio URL
            <input
              id="career-portfolio"
              v-model="careerForm.portfolioUrl"
              class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
              type="url"
              placeholder="https://"
              :aria-invalid="Boolean(careerFieldErrors.portfolioUrl)"
              @input="validateCareerField('portfolioUrl')"
              @blur="validateCareerField('portfolioUrl')"
            >
            <span v-if="careerFieldErrors.portfolioUrl" class="mt-1 block text-xs font-medium text-rose-600">
              {{ careerFieldErrors.portfolioUrl }}
            </span>
          </label>

          <label class="mt-3 block text-sm font-semibold" for="career-message">
            Short Message / Cover Letter
            <textarea
              id="career-message"
              v-model="careerForm.message"
              class="mt-2 min-h-28 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
              :aria-invalid="Boolean(careerFieldErrors.message)"
              @input="validateCareerField('message')"
            ></textarea>
            <span v-if="careerFieldErrors.message" class="mt-1 block text-xs font-medium text-rose-600">
              {{ careerFieldErrors.message }}
            </span>
          </label>

          <label class="mt-3 block text-sm font-semibold" for="career-cv">
            Upload Resume
            <input
              id="career-cv"
              ref="careerFileInput"
              class="mt-2 w-full rounded-lg border border-dashed border-[#b9d1fb] bg-[#f8fbff] px-3 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#1f5dcc] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
              type="file"
              accept="application/pdf,.pdf"
              :aria-invalid="Boolean(careerFieldErrors.resume)"
              @change="handleCareerFileChange"
            >
            <span class="mt-1 block text-xs font-medium text-slate-500">PDF only.</span>
            <span v-if="careerFieldErrors.resume" class="mt-1 block text-xs font-medium text-rose-600">
              {{ careerFieldErrors.resume }}
            </span>
          </label>

          <p
            v-if="careerMessage"
            class="mt-3 rounded-lg px-3 py-2 text-sm font-medium"
            :class="careerStatus === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
            role="status"
            aria-live="polite"
          >
            {{ careerMessage }}
          </p>

          <button
            type="submit"
            class="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="careerStatus === 'loading'"
          >
            {{ careerStatus === 'loading' ? 'Submitting...' : 'Submit Application' }}
          </button>
        </form>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="isCareerSuccessModalOpen"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-[#031027]/72 px-4 py-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-success-title"
        @click.self="closeCareerSuccessModal"
      >
        <div class="w-full max-w-md rounded-lg border border-[#dbe6f4] bg-white p-6 text-center text-[#0e2344] shadow-[0_28px_90px_rgba(3,11,24,0.34)]">
          <CheckCircle class="mx-auto h-14 w-14 text-emerald-600" aria-hidden="true" />
          <h2 id="career-success-title" class="mt-4 text-2xl font-semibold leading-tight">
            Your Application Has Been Submitted
          </h2>
          <p class="mt-3 text-sm leading-6 text-slate-600">
            Thank you. We have received your application. Please wait while our team reviews your submission. We will contact you by email if there is any further update.
          </p>
          <button
            type="button"
            class="btn-primary mt-5 w-full"
            @click="closeCareerSuccessModal"
          >
            Close
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { CheckCircle } from 'lucide-vue-next'
import { submitCareerApplication } from '~/services/careerService'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Careers | PT Havor SMART Digital',
  description: 'Explore career opportunities at PT Havor SMART Digital and join a collaborative team building meaningful digital solutions.',
  path: '/careers'
})

const { careersPage } = useCorporateContent()
const { careers, fetchCareers } = useCareers()
const { fetchBannerPage, useBannerPage } = useBanners()
const route = useRoute()
const careersBanner = useBannerPage('careers')
const careersHeroImage = computed(() => careersBanner.value.media_url || careersPage.hero.image)
const selectedCategory = ref('All categories')
const searchQuery = ref('')
const careerFileInput = ref(null)
const isCareerModalOpen = ref(false)
const isCareerSuccessModalOpen = ref(false)
const careerStatus = ref('idle')
const careerMessage = ref('')
const careerFieldErrors = ref({})
const careerForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  position: '',
  latestEducation: '',
  experienceSummary: '',
  portfolioUrl: '',
  message: '',
  resume: null
})
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const maxCvSize = 2 * 1024 * 1024

const normalizePortfolioUrl = (value) => {
  const trimmedValue = String(value || '').trim()
  if (!trimmedValue) return ''
  return /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`
}

const isValidPortfolioUrl = (value) => {
  const normalizedValue = normalizePortfolioUrl(value)
  if (!normalizedValue) return true

  try {
    const url = new URL(normalizedValue)
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.')
  } catch (_error) {
    return false
  }
}

const countPhoneDigits = (value) => String(value || '').replace(/\D/g, '').length

const setCareerFieldError = (field, message) => {
  careerFieldErrors.value = {
    ...careerFieldErrors.value,
    [field]: message
  }

  if (!message) {
    const { [field]: _removed, ...remainingErrors } = careerFieldErrors.value
    careerFieldErrors.value = remainingErrors
  }
}

const validateCareerField = (field) => {
  const phoneDigitCount = countPhoneDigits(careerForm.phone)
  let message = ''

  if (field === 'fullName' && !careerForm.fullName.trim()) {
    message = 'Full name is required.'
  }

  if (field === 'email') {
    if (!careerForm.email.trim()) {
      message = 'Email is required.'
    } else if (!emailPattern.test(careerForm.email.trim())) {
      message = 'Please enter a valid email address, for example name@gmail.com.'
    }
  }

  if (field === 'phone') {
    if (!careerForm.phone.trim()) {
      message = 'Phone number is required.'
    } else if (!/^[+\d\s()-]+$/.test(careerForm.phone.trim())) {
      message = 'Phone number may only contain numbers, spaces, +, -, or parentheses.'
    } else if (phoneDigitCount < 10) {
      message = 'Phone number must contain at least 10 digits.'
    } else if (phoneDigitCount > 15) {
      message = 'Phone number may contain up to 15 digits.'
    }
  }

  if (field === 'address' && !careerForm.address.trim()) {
    message = 'Address is required.'
  }

  if (field === 'position' && !careerForm.position.trim()) {
    message = 'Please select the position you are applying for.'
  }

  if (field === 'latestEducation' && !careerForm.latestEducation.trim()) {
    message = 'Latest education is required.'
  }

  if (field === 'experienceSummary' && !careerForm.experienceSummary.trim()) {
    message = 'Experience summary is required.'
  }

  if (field === 'portfolioUrl' && !isValidPortfolioUrl(careerForm.portfolioUrl)) {
    message = 'Please enter a valid URL, for example https://www.google.com.'
  }

  if (field === 'message' && !careerForm.message.trim()) {
    message = 'A short message or cover letter is required.'
  }

  if (field === 'resume') {
    if (!careerForm.resume) {
      message = 'Please upload your resume as a PDF.'
    } else if (careerForm.resume.type !== 'application/pdf' && !careerForm.resume.name.toLowerCase().endsWith('.pdf')) {
      message = 'Resume must be a PDF file.'
    } else if (careerForm.resume.size > maxCvSize) {
      message = 'Resume size must be no more than 2 MB.'
    }
  }

  setCareerFieldError(field, message)
  return !message
}

onMounted(() => {
  fetchCareers()
  fetchBannerPage('careers')

  const requestedPosition = String(route.query.position || '')
  if (requestedPosition) {
    openCareerModal(requestedPosition)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

const roleCategoryFor = (role) => {
  const text = `${role.job_title} ${role.job_description}`.toLowerCase()

  if (text.includes('qa') || text.includes('quality')) return 'Quality Assurance'
  if (text.includes('ui') || text.includes('ux') || text.includes('design')) return 'Design'
  if (text.includes('frontend') || text.includes('backend') || text.includes('full-stack') || text.includes('developer')) return 'Engineering'
  if (text.includes('intern')) return 'Internship'

  return 'Business & Operations'
}

const categoryOptions = computed(() => [
  'All categories',
  ...new Set(careers.value.map(roleCategoryFor))
])

const careerPositionOptions = computed(() => {
  const options = careers.value.map((role) => role.job_title).filter(Boolean)
  return [...new Set([...options, 'General Career Inquiry'])]
})

const filteredCareers = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return careers.value.filter((role) => {
    const roleCategory = roleCategoryFor(role)
    const matchesCategory = selectedCategory.value === 'All categories' || roleCategory === selectedCategory.value
    const matchesKeyword =
      !keyword ||
      role.job_title.toLowerCase().includes(keyword) ||
      role.job_description.toLowerCase().includes(keyword) ||
      roleCategory.toLowerCase().includes(keyword)

    return matchesCategory && matchesKeyword
  })
})

watch([isCareerModalOpen, isCareerSuccessModalOpen], ([isCareerOpen, isSuccessOpen]) => {
  if (!import.meta.client) return
  document.body.style.overflow = isCareerOpen || isSuccessOpen ? 'hidden' : ''
})

const openCareerModal = (position) => {
  careerForm.position = position
  careerStatus.value = 'idle'
  careerMessage.value = ''
  careerFieldErrors.value = {}
  isCareerModalOpen.value = true
}

const closeCareerModal = () => {
  if (careerStatus.value === 'loading') return
  isCareerModalOpen.value = false
}

const closeCareerSuccessModal = () => {
  isCareerSuccessModalOpen.value = false
}

const handleCareerFileChange = (event) => {
  const input = event.target
  careerForm.resume = input.files?.[0] || null
  validateCareerField('resume')
}

const validateCareerForm = () => {
  const fields = [
    'fullName',
    'email',
    'phone',
    'address',
    'position',
    'latestEducation',
    'experienceSummary',
    'portfolioUrl',
    'message',
    'resume'
  ]

  const validationResults = fields.map((field) => validateCareerField(field))
  const isValid = validationResults.every(Boolean)

  if (!isValid) {
    careerStatus.value = 'error'
    careerMessage.value = Object.values(careerFieldErrors.value)[0]
    return false
  }

  return true
}

const resetCareerForm = () => {
  const submittedPosition = careerForm.position

  careerForm.fullName = ''
  careerForm.email = ''
  careerForm.phone = ''
  careerForm.address = ''
  careerForm.position = submittedPosition
  careerForm.latestEducation = ''
  careerForm.experienceSummary = ''
  careerForm.portfolioUrl = ''
  careerForm.message = ''
  careerForm.resume = null

  if (careerFileInput.value) {
    careerFileInput.value.value = ''
  }
}

const handleCareerSubmit = async () => {
  if (!validateCareerForm()) return

  careerStatus.value = 'loading'
  careerMessage.value = ''

  try {
    await submitCareerApplication({
      fullName: careerForm.fullName.trim(),
      email: careerForm.email.trim(),
      phone: careerForm.phone.trim(),
      address: careerForm.address.trim(),
      position: careerForm.position.trim(),
      latestEducation: careerForm.latestEducation.trim(),
      experienceSummary: careerForm.experienceSummary.trim(),
      portfolioUrl: normalizePortfolioUrl(careerForm.portfolioUrl),
      message: careerForm.message.trim(),
      cv: careerForm.resume
    })

    resetCareerForm()
    careerFieldErrors.value = {}
    careerStatus.value = 'success'
    careerMessage.value = 'Your application has been submitted successfully. Please wait while our team reviews your submission. We will contact you by email.'
    isCareerModalOpen.value = false
    isCareerSuccessModalOpen.value = true
  } catch (error) {
    careerStatus.value = 'error'
    careerMessage.value = error instanceof Error
      ? error.message
      : 'We could not submit your application. Please try again in a moment.'
  }
}
</script>
