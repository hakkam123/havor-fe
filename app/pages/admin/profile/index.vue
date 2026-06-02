<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Company Profile</p>
          <h1 class="admin-title">Profile Management</h1>
          <p class="admin-copy">Manage the public company identity, contact details, logo, and SEO copy used across the website.</p>
        </div>

        <button type="submit" form="profile-form" class="admin-primary-btn" :disabled="isSaving">
          {{ isSaving ? 'Saving...' : 'Save Profile' }}
        </button>
      </div>
    </section>

    <div v-if="isLoading" class="admin-panel p-6 text-sm text-slate-500">Loading company profile...</div>
    <div v-else class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <section class="admin-panel p-6">
        <div class="flex flex-col items-center text-center">
          <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[16px] bg-[var(--admin-accent)] text-2xl font-semibold text-white">
            <img v-if="logoPreview" :src="logoPreview" :alt="`${form.company_name || 'Company'} logo`" class="h-full w-full object-cover">
            <span v-else>{{ initials }}</span>
          </div>
          <h2 class="mt-4 text-xl font-semibold text-slate-900">{{ form.company_name || 'Havor Smarta Digital' }}</h2>
          <p class="mt-1 text-sm text-slate-500">{{ form.tagline || 'Your Digital IT Partner Solution' }}</p>

          <label class="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full border border-[var(--admin-border)] px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[var(--admin-surface-soft)]">
            Upload Logo
            <input class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" @change="handleLogoChange">
          </label>
          <p v-if="fieldErrors.logo_url" class="mt-2 text-sm text-rose-600">{{ fieldErrors.logo_url }}</p>
        </div>
      </section>

      <section class="admin-panel p-6">
        <form id="profile-form" class="space-y-8" @submit.prevent="saveProfile">
          <div>
            <p class="admin-kicker">Public Identity</p>
            <h2 class="mt-2 text-xl font-semibold text-slate-900">Company Details</h2>
          </div>

          <div v-if="formError" class="rounded-[12px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {{ formError }}
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600" for="company_name">Company Name <span class="text-rose-500">*</span></label>
              <input id="company_name" v-model="form.company_name" type="text" class="admin-input" :aria-invalid="Boolean(fieldErrors.company_name)">
              <p v-if="fieldErrors.company_name" class="mt-1 text-sm text-rose-600">{{ fieldErrors.company_name }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600" for="tagline">Tagline <span class="text-rose-500">*</span></label>
              <input id="tagline" v-model="form.tagline" type="text" class="admin-input">
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600" for="short_description">Short Description <span class="text-rose-500">*</span></label>
            <textarea id="short_description" v-model="form.short_description" rows="3" class="admin-textarea"></textarea>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600" for="long_description">Long Description <span class="text-rose-500">*</span></label>
            <textarea id="long_description" v-model="form.long_description" rows="6" class="admin-textarea"></textarea>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600" for="email">Email <span class="text-rose-500">*</span></label>
              <input id="email" v-model="form.email" type="email" class="admin-input" :aria-invalid="Boolean(fieldErrors.email)">
              <p v-if="fieldErrors.email" class="mt-1 text-sm text-rose-600">{{ fieldErrors.email }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600" for="phone">Phone <span class="text-rose-500">*</span></label>
              <input id="phone" v-model="form.phone" type="text" class="admin-input">
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600" for="address">Address <span class="text-rose-500">*</span></label>
            <textarea id="address" v-model="form.address" rows="3" class="admin-textarea"></textarea>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600" for="website">Website <span class="text-rose-500">*</span></label>
              <input id="website" v-model="form.website" type="url" class="admin-input" :aria-invalid="Boolean(fieldErrors.website)">
              <p v-if="fieldErrors.website" class="mt-1 text-sm text-rose-600">{{ fieldErrors.website }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600" for="linkedin_url">LinkedIn URL <span class="text-rose-500">*</span></label>
              <input id="linkedin_url" v-model="form.linkedin_url" type="url" class="admin-input" :aria-invalid="Boolean(fieldErrors.linkedin_url)">
              <p v-if="fieldErrors.linkedin_url" class="mt-1 text-sm text-rose-600">{{ fieldErrors.linkedin_url }}</p>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600" for="instagram_url">Instagram URL <span class="text-rose-500">*</span></label>
            <input id="instagram_url" v-model="form.instagram_url" type="url" class="admin-input" :aria-invalid="Boolean(fieldErrors.instagram_url)">
            <p v-if="fieldErrors.instagram_url" class="mt-1 text-sm text-rose-600">{{ fieldErrors.instagram_url }}</p>
          </div>

          <div class="rounded-[14px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-5">
            <p class="text-sm font-semibold text-slate-900">SEO Metadata</p>
            <div class="mt-5 grid gap-5">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600" for="seo_title">SEO Title <span class="text-rose-500">*</span></label>
                <input id="seo_title" v-model="form.seo_title" type="text" class="admin-input">
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600" for="seo_description">SEO Description <span class="text-rose-500">*</span></label>
                <textarea id="seo_description" v-model="form.seo_description" rows="3" class="admin-textarea"></textarea>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="admin-primary-btn" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <section v-if="!isLoading" class="grid gap-6 xl:grid-cols-2">
      <div class="admin-panel p-6">
        <p class="admin-kicker">Access Log</p>
        <h2 class="mt-2 text-xl font-semibold text-slate-900">Recent Admin Access</h2>
        <div class="mt-5 space-y-3">
          <article v-for="log in accessLogs" :key="log.label" class="rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-4">
            <p class="text-sm font-semibold text-slate-900">{{ log.label }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ log.meta }}</p>
          </article>
        </div>
      </div>

      <div class="admin-panel p-6">
        <p class="admin-kicker">Activity Log</p>
        <h2 class="mt-2 text-xl font-semibold text-slate-900">Profile Update Activity</h2>
        <div class="mt-5 space-y-3">
          <article v-for="log in activityLogs" :key="log.label" class="rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-4">
            <p class="text-sm font-semibold text-slate-900">{{ log.label }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ log.meta }}</p>
          </article>
        </div>
      </div>
    </section>

    <AdminSuccessModal
      v-model="showSuccess"
      title="Profile Saved"
      message="Company profile has been updated successfully."
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

definePageMeta({ layout: 'admin' })

const { fetchProfile, isLoading, updateProfile } = useProfile()

const form = reactive({
  company_name: '',
  tagline: '',
  short_description: '',
  long_description: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  linkedin_url: '',
  instagram_url: '',
  logo_url: '',
  logoFile: null as File | null,
  seo_title: '',
  seo_description: ''
})

const fieldErrors = ref<Record<string, string>>({})
const formError = ref('')
const isSaving = ref(false)
const showSuccess = ref(false)
const logoPreview = ref('')
const lastSavedAt = ref('')

const initials = computed(() => (form.company_name || 'HS').split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase())
const accessLogs = computed(() => [
  { label: 'Admin profile opened', meta: `Current session at ${new Date().toLocaleString()}` },
  { label: 'Authenticated area accessed', meta: 'Route: /admin/profile' }
])
const activityLogs = computed(() => [
  { label: lastSavedAt.value ? 'Profile updated' : 'Waiting for profile update', meta: lastSavedAt.value || 'No update recorded in this session.' },
  { label: 'Logo asset status', meta: logoPreview.value ? 'Logo preview is available.' : 'Logo has not been uploaded in this session.' }
])

const setForm = (profile: any) => {
  Object.assign(form, {
    company_name: profile?.company_name || '',
    tagline: profile?.tagline || '',
    short_description: profile?.short_description || '',
    long_description: profile?.long_description || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    website: profile?.website || '',
    address: profile?.address || '',
    linkedin_url: profile?.linkedin_url || '',
    instagram_url: profile?.instagram_url || '',
    logo_url: profile?.logo_url || '',
    logoFile: null,
    seo_title: profile?.seo_title || '',
    seo_description: profile?.seo_description || ''
  })
  logoPreview.value = profile?.logo_url || ''
}

const validateForm = () => {
  const errors: Record<string, string> = {}

  if (!form.company_name.trim()) errors.company_name = 'Company name is required.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!isValidHttpUrl(form.website)) errors.website = 'Website must be a valid http or https URL.'
  if (!isValidHttpUrl(form.linkedin_url)) errors.linkedin_url = 'LinkedIn URL must be a valid http or https URL.'
  if (!isValidHttpUrl(form.instagram_url)) errors.instagram_url = 'Instagram URL must be a valid http or https URL.'
  if (!isSupportedImageFile(form.logoFile)) errors.logo_url = 'Logo must be a JPG, PNG, or WEBP image.'

  fieldErrors.value = errors
  formError.value = Object.keys(errors).length ? 'Please fix the highlighted fields before saving.' : ''
  return Object.keys(errors).length === 0
}

const handleLogoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  form.logoFile = file

  if (file) {
    logoPreview.value = URL.createObjectURL(file)
  }
}

const saveProfile = async () => {
  if (!validateForm() || isSaving.value) return

  isSaving.value = true
  formError.value = ''
  try {
    const updated = await updateProfile(form)
    setForm(updated)
    lastSavedAt.value = new Date().toLocaleString()
    showSuccess.value = true
  } catch (error: any) {
    fieldErrors.value = getApiFieldErrors(error)
    formError.value = getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  const profile = await fetchProfile()
  if (profile) setForm(profile)
})
</script>
