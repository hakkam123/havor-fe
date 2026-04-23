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

      <div class="admin-stat-grid mt-6">
        <article v-for="stat in stats" :key="stat.label" class="admin-stat-card">
          <p class="admin-stat-label">{{ stat.label }}</p>
          <div class="admin-stat-value">{{ stat.value }}</div>
          <p class="admin-stat-meta">{{ stat.meta }}</p>
        </article>
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
                  <button @click="openModal(item)" class="admin-icon-btn">
                    <Edit2 class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(item.id)" class="admin-icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredCareers.length">
              <td colspan="4" class="admin-empty-state">
                {{ error ? error : 'No career positions found.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-950/40" @click="closeModal" />

      <div class="admin-modal-card max-w-5xl" v-motion-slide-visible-bottom>
        <div class="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
          <div>
            <p class="admin-kicker">Hiring Form</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Position' : 'Create Position' }}</h2>
          </div>
          <button @click="closeModal" class="admin-icon-btn">
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
          <form @submit.prevent="saveForm" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Job Title <span class="text-rose-500">*</span></label>
                  <input v-model="form.job_title" type="text" required class="admin-input" placeholder="Frontend Developer">
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Slug Preview</label>
                  <input :value="toSlug(form.job_title)" type="text" class="admin-input bg-slate-50 text-slate-500" readonly>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Thumbnail <span class="text-rose-500">*</span></label>
                  <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
                    <div v-if="form.thumbnail" class="absolute inset-0">
                      <img :src="form.thumbnail" class="h-full w-full object-cover">
                    </div>
                    <div v-else class="text-center">
                      <Upload class="mx-auto h-8 w-8 text-slate-400" />
                      <p class="mt-3 text-sm text-slate-500">Click or drag thumbnail here</p>
                    </div>
                    <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/*" @change="handleThumbnailUpload">
                  </div>
                  <p v-if="form.thumbnailFileName" class="mt-2 text-xs text-slate-500">{{ form.thumbnailFileName }}</p>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Job Description <span class="text-rose-500">*</span></label>
                  <div class="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-white">
                    <Editor
                      api-key="88silew48dnac4zpntprubmilq8z9lqfe5by76mvrkvas4nt"
                      v-model="form.job_description"
                      :init="editorConfig"
                    />
                  </div>
                </div>
                <p v-if="formError" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {{ formError }}
                </p>
              </div>
            </div>
          </form>
        </div>

        <div class="flex justify-end gap-3 border-t border-[var(--admin-border)] px-6 py-4">
          <button @click="closeModal" class="admin-secondary-btn">Cancel</button>
          <button @click="saveForm" class="admin-primary-btn">Save Position</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Edit2, Plus, Search, Trash2, Upload, X } from 'lucide-vue-next'
import Editor from '@tinymce/tinymce-vue'

const { careers, error, fetchCareers, createCareer, updateCareer, deleteCareer } = useAdminCareers()

const isModalOpen = ref(false)
const searchQuery = ref('')
const formError = ref('')

const initialForm = () => ({
  id: null,
  job_title: '',
  job_description: '',
  thumbnail: '',
  thumbnailFile: null,
  thumbnailFileName: ''
})

const form = ref(initialForm())

const editorConfig = {
  height: 320,
  menubar: false,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
  content_style: 'body { font-family: Nunito Sans, sans-serif; font-size: 14px; color: #0f172a; }'
}

const filteredCareers = computed(() => {
  if (!searchQuery.value) return careers.value

  const query = searchQuery.value.toLowerCase()
  return careers.value.filter((item) =>
    [item.job_title, item.job_description]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Open Roles', value: careers.value.length, meta: 'Entries exposed on the public careers route' },
  { label: 'With Thumbnail', value: careers.value.filter((item) => item.thumbnail).length, meta: 'Ready for listing cards and detail pages' },
  { label: 'Search Results', value: filteredCareers.value.length, meta: 'Current filtered role count' },
  { label: 'Slugs', value: new Set(careers.value.map((item) => item.slug).filter(Boolean)).size, meta: 'Frontend route keys derived from titles' }
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
      thumbnailFile: null,
      thumbnailFileName: ''
    }
    : initialForm()

  isModalOpen.value = true
}

const closeModal = () => {
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

  if (!form.value.id && !form.value.thumbnailFile) {
    formError.value = 'A thumbnail image is required when creating a career entry.'
    return
  }

  if (form.value.id) {
    await updateCareer(form.value.id, form.value)
  } else {
    await createCareer(form.value)
  }

  closeModal()
}

const handleDelete = async (id) => {
  if (!id) return

  if (confirm('Delete this career position?')) {
    await deleteCareer(id)
  }
}

onMounted(() => {
  fetchCareers()
})
</script>
