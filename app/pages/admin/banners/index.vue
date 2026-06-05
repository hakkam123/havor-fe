<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Media</p>
          <h1 class="admin-title">Hero Banners</h1>
          <p class="admin-copy">Organize banner visuals for each landing page with a cleaner media-first dashboard layout.</p>
        </div>

        <button @click="openModal()" class="admin-primary-btn">
          <Upload class="h-4 w-4" />
          Upload New Banner
        </button>
      </div>

      <div class="admin-stat-grid mt-6">
        <article v-for="stat in stats" :key="stat.label" class="admin-stat-card">
          <p class="admin-stat-label">{{ stat.label }}</p>
          <div class="admin-stat-value">{{ stat.value }}</div>
          <p class="admin-stat-meta">{{ stat.meta }}</p>
        </article>
      </div>
    </section>

    <section class="space-y-4">
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="banner in paginatedBanners" :key="banner.id" class="admin-panel relative flex min-h-full flex-col overflow-hidden pb-20">
        <div class="relative">
          <div class="absolute left-4 top-4 z-10">
            <span class="admin-badge">{{ banner.page_name }}</span>
          </div>

          <div class="flex h-60 items-center justify-center overflow-hidden bg-[var(--admin-surface-soft)]">
            <video v-if="banner.media_type === 'video'" :src="banner.media_url" class="h-full w-full object-cover" controls></video>
            <img v-else :src="banner.media_url || 'https://via.placeholder.com/600x300'" class="h-full w-full object-cover" >
          </div>
        </div>

        <div class="flex flex-1 flex-col space-y-4 p-5">
          <div>
            <p class="text-lg font-semibold text-slate-900">{{ banner.title }}</p>
            <p class="mt-2 text-sm leading-6 text-slate-500">{{ banner.subtitle || 'No subtitle provided.' }}</p>
          </div>

          <div class="mt-auto flex items-center justify-between gap-3 border-t border-[var(--admin-border)] pt-4">
            <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <BadgeInfo class="h-4 w-4" />
              {{ banner.media_type }}
            </div>
          </div>
        </div>

        <button
          @click="openModal(banner)"
          class="admin-icon-btn absolute bottom-5 right-5 bg-white shadow-sm"
          :aria-label="`Edit ${banner.page_name} banner`"
        >
          <Edit2 class="h-4 w-4" />
        </button>
        </article>
      </div>

      <AdminPagination
        v-model:page="currentPage"
        :total="banners.length"
        :page-size="pageSize"
        label="banners"
      />
    </section>

    <AdminModal
      v-model="isModalOpen"
      kicker="Media Form"
      :title="form.id ? 'Edit Banner' : 'Create Banner'"
      max-width-class="max-w-xl"
      :can-close="!isSaving"
    >
      <form @submit.prevent="saveBanner" class="space-y-4">
        <div v-if="formError" class="rounded-[12px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ formError }}
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Page Name <span class="text-rose-500">*</span></label>
          <input v-model="form.page_name" type="text" class="admin-input" placeholder="home" :aria-invalid="Boolean(fieldErrors.page_name)">
          <p v-if="fieldErrors.page_name" class="mt-1 text-sm text-rose-600">{{ fieldErrors.page_name }}</p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Title <span class="text-rose-500">*</span></label>
          <input v-model="form.title" type="text" class="admin-input">
          <p v-if="fieldErrors.title" class="mt-1 text-sm text-rose-600">{{ fieldErrors.title }}</p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Subtitle <span class="text-rose-500">*</span></label>
          <textarea v-model="form.subtitle" rows="3" class="admin-textarea"></textarea>
          <p v-if="fieldErrors.subtitle" class="mt-1 text-sm text-rose-600">{{ fieldErrors.subtitle }}</p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Media Type <span class="text-rose-500">*</span></label>
          <select v-model="form.media_type" class="admin-select">
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Upload File <span class="text-rose-500">*</span></label>
          <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/x-msvideo" class="admin-input py-2" aria-label="Upload banner media" @change="handleMediaUpload">
          <p v-if="form.mediaFileName" class="mt-2 text-xs text-slate-500">{{ form.mediaFileName }}</p>
          <p v-if="fieldErrors.media_url" class="mt-1 text-sm text-rose-600">{{ fieldErrors.media_url }}</p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Or Existing Media URL <span class="text-rose-500">*</span></label>
          <input v-model="form.media_url" type="text" class="admin-input" placeholder="/uploads/banners/home-banner.jpg">
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" :disabled="isSaving" class="admin-secondary-btn">Cancel</button>
        <button @click="saveBanner" :disabled="isSaving" class="admin-primary-btn">
          {{ isSaving ? 'Saving...' : 'Save Banner' }}
        </button>
      </template>
    </AdminModal>

    <AdminSuccessModal
      v-model="successState.open"
      :title="successState.title"
      :message="successState.message"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { BadgeInfo, Edit2, Upload } from 'lucide-vue-next'

const { banners, fetchBanners, createBanner, updateBanner } = useBanners()
const isModalOpen = ref(false)
const isSaving = ref(false)
const formError = ref('')
const fieldErrors = ref({})
const successState = ref({
  open: false,
  title: '',
  message: ''
})
const form = ref({
  id: null,
  page_name: '',
  title: '',
  subtitle: '',
  media_type: 'image',
  media_url: '',
  mediaFile: null,
  mediaFileName: ''
})

const { currentPage, pageSize, paginatedItems: paginatedBanners } = useAdminPagination(banners, 9)

const stats = computed(() => [
  { label: 'Total Banners', value: banners.value.length, meta: 'Media items in workspace' },
  { label: 'Image Banners', value: banners.value.filter((item) => item.media_type === 'image').length, meta: 'Static hero visuals' },
  { label: 'Video Banners', value: banners.value.filter((item) => item.media_type === 'video').length, meta: 'Motion hero visuals' },
  { label: 'Pages Covered', value: new Set(banners.value.map((item) => item.page_name).filter(Boolean)).size, meta: 'Distinct banner destinations' }
])

onMounted(() => {
  fetchBanners()
})

const openModal = (item = null) => {
  form.value = item
    ? {
      ...item,
      mediaFile: null,
      mediaFileName: ''
    }
    : {
      id: null,
      page_name: '',
      title: '',
      subtitle: '',
      media_type: 'image',
      media_url: '',
      mediaFile: null,
      mediaFileName: ''
    }

  isModalOpen.value = true
}

const closeModal = () => {
  if (isSaving.value) return
  isModalOpen.value = false
}

const handleMediaUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.mediaFile = file
    form.value.mediaFileName = file.name
  }
}

const isSupportedMediaFile = (file) => {
  if (!file) return true
  return ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(file.type)
}

const withSaveTimeout = (promise) => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Saving took longer than 5 seconds. Please try again.')), 5000)
  })

  return Promise.race([promise, timeout])
}

const saveBanner = async () => {
  formError.value = ''
  fieldErrors.value = {}
  const errors = {}
  if (!form.value.page_name?.trim()) errors.page_name = 'Page name is required.'
  if (!form.value.title?.trim()) errors.title = 'Title is required.'
  if (!form.value.subtitle?.trim()) errors.subtitle = 'Subtitle is required.'
  if (!form.value.mediaFile && !form.value.media_url?.trim()) errors.media_url = 'Upload a media file or provide a media URL.'
  if (!isSupportedMediaFile(form.value.mediaFile)) errors.media_url = 'Media must be JPG, PNG, WEBP, MP4, MOV, or AVI.'
  if (form.value.media_url && !form.value.media_url.startsWith('/') && !isValidHttpUrl(form.value.media_url)) errors.media_url = 'Media URL must start with /uploads or use a valid http or https URL.'
  if (Object.keys(errors).length) {
    fieldErrors.value = errors
    formError.value = 'Please fix the highlighted fields before saving.'
    return
  }

  isSaving.value = true

  try {
    const isEditing = Boolean(form.value.id)

    if (isEditing) {
      await withSaveTimeout(updateBanner(form.value.id, form.value))
    } else {
      await withSaveTimeout(createBanner(form.value))
    }

    isModalOpen.value = false
    successState.value = {
      open: true,
      title: isEditing ? 'Banner updated' : 'Banner created',
      message: isEditing
        ? 'The banner has been updated successfully.'
        : 'The new banner has been added successfully.'
    }
  } catch (error) {
    fieldErrors.value = getApiFieldErrors(error)
    formError.value = getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

</script>
