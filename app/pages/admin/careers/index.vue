<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Hiring</p>
          <h1 class="admin-title">Careers</h1>
          <p class="admin-copy">Manage the public careers feed using the backend contract defined for job title, description, and thumbnail media.</p>
        </div>

        <button @click="openModal()" class="admin-primary-btn">
          <Plus class="h-4 w-4" />
          Create Position
        </button>
      </div>

    </section>

    <section class="admin-table-shell">
      <div class="admin-toolbar">
        <div class="relative min-w-0 xl:w-[320px]">
          <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Search title or description..." class="admin-input pl-11">
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredCareers.length }} entries</div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Category</th>
              <th>Description</th>
              <th>Thumbnail</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCareers" :key="item.id || item.slug">
              <td>
                <div>
                  <p class="font-semibold text-slate-900">{{ item.job_title }}</p>
                  <p class="text-xs text-slate-400">/{{ item.slug }}</p>
                </div>
              </td>
              <td>
                <span class="admin-badge">{{ item.categoryName || 'Unassigned' }}</span>
              </td>
              <td class="max-w-[420px] text-slate-500">
                <p class="line-clamp-2">{{ item.excerpt || '-' }}</p>
              </td>
              <td>
                <span class="admin-status" :class="item.thumbnail ? 'admin-status-success' : 'admin-status-warning'">
                  {{ item.thumbnail ? 'Ready' : 'Missing' }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button @click="openModal(item)" class="admin-icon-btn" :aria-label="`Edit ${item.job_title}`">
                    <Edit2 class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(item.id)" class="admin-icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600" :aria-label="`Delete ${item.job_title}`">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredCareers.length">
              <td colspan="5" class="admin-empty-state">
                {{ error ? error : 'No career positions found.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="admin-table-shell">
      <div class="admin-toolbar">
        <div>
          <p class="text-sm font-semibold text-slate-900">Incoming Applications</p>
          <p class="mt-1 text-xs text-[var(--admin-muted)]">Real submissions from the public Apply Now form.</p>
        </div>
        <button class="admin-secondary-btn" @click="fetchApplications">
          Refresh Applications
        </button>
      </div>

      <div v-if="isLoadingApplications && !applications.length" class="space-y-3 p-5">
        <div v-for="index in 4" :key="`career-application-loading-${index}`" class="animate-pulse rounded-[12px] border border-[var(--admin-border)] p-4">
          <div class="h-4 w-1/3 rounded bg-slate-100"></div>
          <div class="mt-3 h-4 w-full rounded bg-slate-100"></div>
        </div>
      </div>

      <div v-else class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Position</th>
              <th>Contact</th>
              <th>Status</th>
              <th class="text-right">Resume</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in applications" :key="application.id">
              <td>
                <div>
                  <p class="font-semibold text-slate-900">{{ application.fullName }}</p>
                  <p class="text-xs text-slate-400">{{ application.dateLabel || 'Latest' }}</p>
                </div>
              </td>
              <td>
                <p class="font-medium text-slate-700">{{ application.position || 'General Career Inquiry' }}</p>
                <p class="mt-1 max-w-[320px] truncate text-xs text-slate-400">{{ application.latestEducation || 'No education summary' }}</p>
              </td>
              <td>
                <p class="text-sm text-slate-600">{{ application.email }}</p>
                <p class="mt-1 text-xs text-slate-400">{{ application.phone }}</p>
              </td>
              <td>
                <span class="admin-status admin-status-success">{{ application.status }}</span>
              </td>
              <td class="text-right">
                <a
                  v-if="application.resumeUrl"
                  :href="application.resumeUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="admin-secondary-btn inline-flex"
                >
                  View Resume
                </a>
                <span v-else class="text-xs text-slate-400">{{ application.resumeStorageKey || 'No resume link' }}</span>
              </td>
            </tr>
            <tr v-if="!applications.length">
              <td colspan="5" class="admin-empty-state">
                {{ applicationsError || 'No applications yet.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <AdminModal
      v-model="isModalOpen"
      kicker="Hiring Form"
      :title="form.id ? 'Edit Position' : 'Create Position'"
      max-width-class="max-w-5xl"
      :can-close="!isSaving"
    >
      <form @submit.prevent="saveForm" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Job Title <span class="text-rose-500">*</span></label>
              <input v-model="form.job_title" type="text" required class="admin-input" placeholder="Frontend Developer">
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Slug Preview <span class="text-rose-500">*</span></label>
              <input :value="toSlug(form.job_title)" type="text" class="admin-input bg-slate-50 text-slate-500" readonly>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Category <span class="text-rose-500">*</span></label>
              <select v-model="form.categoryId" class="admin-select" required>
                <option value="" disabled>Select career category</option>
                <option v-for="cat in careerCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Thumbnail <span class="text-rose-500">*</span></label>
              <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
                <div v-if="form.thumbnail" class="absolute inset-0">
                  <img :src="form.thumbnail" class="h-full w-full object-cover">
                </div>
                <div v-else class="text-center">
                  <Upload class="mx-auto h-8 w-8 text-slate-400" />
                  <p class="mt-3 text-sm text-slate-500">Click or drag thumbnail here</p>
                </div>
                <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp" aria-label="Upload career thumbnail" @change="handleThumbnailUpload">
              </div>
              <p v-if="form.thumbnailFileName" class="mt-2 text-xs text-slate-500">{{ form.thumbnailFileName }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Job Description <span class="text-rose-500">*</span></label>
              <AdminRichTextEditor v-model="form.job_description" aria-label="Career job description" />
            </div>
            <p v-if="formError" class="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {{ formError }}
            </p>
          </div>
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" :disabled="isSaving" class="admin-secondary-btn">Cancel</button>
        <button @click="saveForm" :disabled="isSaving" class="admin-primary-btn">
          {{ isSaving ? 'Saving...' : 'Save Position' }}
        </button>
      </template>
    </AdminModal>

    <AdminSuccessModal
      v-model="successState.open"
      :title="successState.title"
      :message="successState.message"
    />

    <AdminConfirmModal
      v-model="deleteState.open"
      title="Delete Career"
      message="This career position will be removed from the public careers feed. This action cannot be undone."
      :detail="deleteState.name"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Edit2, Plus, Search, Trash2, Upload } from 'lucide-vue-next'

const { careers, error, fetchCareers, createCareer, updateCareer, deleteCareer } = useAdminCareers()
const { categories: careerCategories, fetchCategories } = useCategories({ type: 'Career' })
const {
  applications,
  error: applicationsError,
  isLoading: isLoadingApplications,
  fetchApplications
} = useCareerApplications()

const isModalOpen = ref(false)
const searchQuery = ref('')
const formError = ref('')
const isSaving = ref(false)
const isDeleting = ref(false)
const successState = ref({
  open: false,
  title: '',
  message: ''
})
const deleteState = ref({ open: false, id: null, name: '' })

const initialForm = () => ({
  id: null,
  job_title: '',
  job_description: '',
  categoryId: careerCategories.value[0]?.id || '',
  thumbnail: '',
  thumbnailFile: null,
  thumbnailFileName: ''
})

const form = ref(initialForm())

const filteredCareers = computed(() => {
  if (!searchQuery.value) return careers.value

  const query = searchQuery.value.toLowerCase()
  return careers.value.filter((item) =>
    [item.job_title, item.categoryName, item.job_description]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Open Roles', value: careers.value.length, meta: 'Entries exposed on the public careers route' },
  { label: 'With Thumbnail', value: careers.value.filter((item) => item.thumbnail).length, meta: 'Ready for listing cards and detail pages' },
  { label: 'Search Results', value: filteredCareers.value.length, meta: 'Current filtered role count' },
  { label: 'Applications', value: applications.value.length, meta: 'Real submissions from the apply form' }
])

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const stripHtml = (value = '') => value.replace(/<[^>]*>?/gm, '').trim()

const openModal = (item = null) => {
  formError.value = ''
  form.value = item
    ? {
      ...item,
      categoryId: item.categoryId || '',
      thumbnailFile: null,
      thumbnailFileName: ''
    }
    : initialForm()

  isModalOpen.value = true
}

watch(careerCategories, (items) => {
  if (!isModalOpen.value || form.value.id || form.value.categoryId) return
  form.value.categoryId = items[0]?.id || ''
})

const closeModal = () => {
  if (isSaving.value) return
  isModalOpen.value = false
}

const handleThumbnailUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.thumbnailFile = file
    form.value.thumbnailFileName = file.name
    form.value.thumbnail = URL.createObjectURL(file)
  }
}

const saveForm = async () => {
  formError.value = ''

  if (!form.value.job_title?.trim() || !stripHtml(form.value.job_description).trim()) {
    formError.value = 'Job title and description are required.'
    return
  }

  if (!form.value.categoryId) {
    formError.value = 'Category is required.'
    return
  }

  if (!form.value.id && !form.value.thumbnailFile) {
    formError.value = 'A thumbnail image is required when creating a career entry.'
    return
  }

  if (!isSupportedImageFile(form.value.thumbnailFile)) {
    formError.value = 'Thumbnail must be a JPG, PNG, or WEBP image.'
    return
  }

  isSaving.value = true

  try {
    const isEditing = Boolean(form.value.id)

    if (isEditing) {
      await updateCareer(form.value.id, form.value)
    } else {
      await createCareer(form.value)
    }

    isModalOpen.value = false
    successState.value = {
      open: true,
      title: isEditing ? 'Career updated' : 'Career created',
      message: isEditing
        ? 'The career position has been updated successfully.'
        : 'The new career position has been added successfully.'
    }
  } catch (error) {
    const fieldErrors = getApiFieldErrors(error)
    formError.value = fieldErrors.job_title || fieldErrors.job_description || fieldErrors.thumbnail || getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = (id) => {
  if (!id) return
  const career = careers.value.find((item) => item.id === id)
  deleteState.value = { open: true, id, name: career?.job_title || `Career ID ${id}` }
}

const confirmDelete = async () => {
  if (!deleteState.value.id || isDeleting.value) return

  isDeleting.value = true
  try {
    await deleteCareer(deleteState.value.id)
    deleteState.value = { open: false, id: null, name: '' }
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  Promise.all([fetchCareers(), fetchCategories()])
  fetchApplications()
})
</script>
