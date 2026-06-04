<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Campaign</p>
          <h1 class="admin-title">Campaign Workspace</h1>
          <p class="admin-copy">Manage campaign highlights shown on the landing page and Media & News page.</p>
        </div>

        <button @click="openModal()" class="admin-primary-btn">
          <Plus class="h-4 w-4" />
          Create Campaign
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
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div class="relative min-w-0 xl:w-[320px]">
            <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="searchQuery" type="text" placeholder="Search campaign, slug, or category..." class="admin-input pl-11">
          </div>
          <div class="relative min-w-[180px]">
            <select v-model="statusFilter" class="admin-select py-2 pl-9 text-xs" aria-label="Filter campaign status">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <Filter class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredCampaigns.length }} entries</div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title & Slug</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCampaigns" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
                    <img v-if="item.image_url" :src="item.image_url" class="h-full w-full object-cover" >
                    <ImageIcon v-else class="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ item.title }}</p>
                    <p class="text-xs text-slate-400">{{ item.slug }}</p>
                  </div>
                </div>
              </td>
              <td><span class="admin-badge">{{ item.category }}</span></td>
              <td>
                <span class="admin-status" :class="item.is_published ? 'admin-status-success' : 'admin-status-warning'">
                  {{ item.is_published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="text-slate-400">{{ formatDate(item.createdAt) }}</td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button @click="openModal(item)" class="admin-icon-btn" :aria-label="`Edit ${item.title}`">
                    <Edit2 class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(item.id)" class="admin-icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600" :aria-label="`Delete ${item.title}`">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredCampaigns.length">
              <td colspan="5" class="admin-empty-state">{{ error || 'No campaign entries found.' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <AdminModal
      v-model="isModalOpen"
      kicker="Campaign Form"
      :title="form.id ? 'Edit Campaign' : 'Create Campaign'"
      max-width-class="max-w-4xl"
      :can-close="!isSaving"
    >
      <form @submit.prevent="saveForm" class="space-y-6">
        <div v-if="formError" class="rounded-[12px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ formError }}
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Title <span class="text-rose-500">*</span></label>
              <input v-model="form.title" @input="generateSlug" type="text" required class="admin-input" placeholder="Enter campaign title">
              <p v-if="fieldErrors.title" class="mt-1 text-sm text-rose-600">{{ fieldErrors.title }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Slug <span class="text-rose-500">*</span></label>
              <input v-model="form.slug" type="text" class="admin-input bg-slate-50 text-slate-500" readonly>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Category <span class="text-rose-500">*</span></label>
                <select v-model="form.category" class="admin-select">
                  <option v-for="category in categoryOptions" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Publish Status <span class="text-rose-500">*</span></label>
                <select v-model="form.is_published" class="admin-select">
                  <option :value="true">Published</option>
                  <option :value="false">Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600">Featured Image <span class="text-rose-500">*</span></label>
            <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
              <div v-if="form.image_url" class="absolute inset-0">
                <img :src="form.image_url" class="h-full w-full object-cover" >
              </div>
              <div v-else class="text-center">
                <Upload class="mx-auto h-8 w-8 text-slate-400" />
                <p class="mt-3 text-sm text-slate-500">Click or drag image here</p>
              </div>
              <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp" aria-label="Upload campaign featured image" @change="handleFileUpload">
            </div>
            <p v-if="form.imageFileName" class="mt-2 text-xs text-slate-500">{{ form.imageFileName }}</p>
            <p v-if="fieldErrors.image_url" class="mt-1 text-sm text-rose-600">{{ fieldErrors.image_url }}</p>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Content <span class="text-rose-500">*</span></label>
          <AdminRichTextEditor v-model="form.content" aria-label="Campaign content" />
          <p v-if="fieldErrors.content" class="mt-1 text-sm text-rose-600">{{ fieldErrors.content }}</p>
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" :disabled="isSaving" class="admin-secondary-btn">Cancel</button>
        <button @click="saveForm" :disabled="isSaving" class="admin-primary-btn">
          {{ isSaving ? 'Saving...' : 'Save Campaign' }}
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
      title="Delete Campaign"
      message="This campaign will be removed from the public campaign list. This action cannot be undone."
      :detail="deleteState.name"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Edit2, Filter, Image as ImageIcon, Plus, Search, Trash2, Upload } from 'lucide-vue-next'

const { campaigns, error, fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } = useCampaigns({ includeDrafts: true })
const { categories: campaignCategories, fetchCategories } = useCategories({ type: 'Campaign' })

const isModalOpen = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const isSaving = ref(false)
const isDeleting = ref(false)
const formError = ref('')
const fieldErrors = ref({})
const successState = ref({ open: false, title: '', message: '' })
const deleteState = ref({ open: false, id: null, name: '' })
const form = ref({
  id: null,
  title: '',
  slug: '',
  category: 'Digital Readiness',
  is_published: true,
  image_url: null,
  imageFile: null,
  imageFileName: '',
  content: ''
})

const categoryOptions = computed(() => {
  const options = campaignCategories.value.map((category) => category.name).filter(Boolean)
  return options.length ? options : ['Digital Readiness', 'Implementation Support', 'Long-Term Partnership']
})

const filteredCampaigns = computed(() => {
  const statusItems = campaigns.value.filter((item) => {
    if (statusFilter.value === 'published') return item.is_published
    if (statusFilter.value === 'draft') return !item.is_published
    return true
  })

  if (!searchQuery.value) return statusItems

  const query = searchQuery.value.toLowerCase()
  return statusItems.filter((item) =>
    [item.title, item.slug, item.category]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Total Campaigns', value: campaigns.value.length, meta: 'Campaign entries in workspace' },
  { label: 'Published', value: campaigns.value.filter((item) => item.is_published).length, meta: 'Visible on public pages' },
  { label: 'Drafts', value: campaigns.value.filter((item) => !item.is_published).length, meta: 'Waiting for approval' },
  { label: 'With Image', value: campaigns.value.filter((item) => item.image_url).length, meta: 'Ready for homepage highlight' }
])

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}

const stripHtml = (value = '') => String(value || '').replace(/<[^>]*>?/gm, '').trim()

const openModal = (item = null) => {
  formError.value = ''
  fieldErrors.value = {}

  form.value = item
    ? { ...item, imageFile: null, imageFileName: '' }
    : {
        id: null,
        title: '',
        slug: '',
        category: categoryOptions.value[0] || 'Digital Readiness',
        is_published: true,
        image_url: null,
        imageFile: null,
        imageFileName: '',
        content: ''
      }

  isModalOpen.value = true
}

const closeModal = () => {
  if (isSaving.value) return
  isModalOpen.value = false
}

const generateSlug = () => {
  form.value.slug = form.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

const handleFileUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.imageFile = file
    form.value.imageFileName = file.name
    form.value.image_url = URL.createObjectURL(file)
  }
}

const saveForm = async () => {
  fieldErrors.value = {}
  formError.value = ''

  const errors = {}
  if (!form.value.title?.trim()) errors.title = 'Campaign title is required.'
  if (!stripHtml(form.value.content).trim()) errors.content = 'Campaign content is required.'
  if (!isSupportedImageFile(form.value.imageFile)) errors.image_url = 'Image must be a JPG, PNG, or WEBP file.'

  if (Object.keys(errors).length) {
    fieldErrors.value = errors
    formError.value = 'Please fix the highlighted fields before saving.'
    return
  }

  isSaving.value = true

  try {
    const isEditing = Boolean(form.value.id)

    if (isEditing) {
      await updateCampaign(form.value.id, form.value)
    } else {
      await createCampaign(form.value)
    }

    isModalOpen.value = false
    successState.value = {
      open: true,
      title: isEditing ? 'Campaign updated' : 'Campaign created',
      message: isEditing
        ? 'The campaign has been updated successfully.'
        : 'The new campaign has been added successfully.'
    }
  } catch (error) {
    fieldErrors.value = getApiFieldErrors(error)
    formError.value = getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = (id) => {
  const campaign = campaigns.value.find((item) => item.id === id)
  deleteState.value = { open: true, id, name: campaign?.title || `Campaign ID ${id}` }
}

const confirmDelete = async () => {
  if (!deleteState.value.id || isDeleting.value) return

  isDeleting.value = true
  try {
    await deleteCampaign(deleteState.value.id)
    deleteState.value = { open: false, id: null, name: '' }
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchCampaigns()
  fetchCategories()
})
</script>
