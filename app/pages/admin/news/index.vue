<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Editorial</p>
          <h1 class="admin-title">News & Blog</h1>
          <p class="admin-copy">Manage articles, announcements, publication status, and featured visuals from a unified editorial view.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button @click="openModal()" class="admin-primary-btn">
            <Plus class="h-4 w-4" />
            Create News
          </button>
        </div>
      </div>

    </section>

    <section class="admin-table-shell">
      <div class="admin-toolbar">
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div class="relative min-w-0 xl:w-[320px]">
            <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="searchQuery" type="text" placeholder="Search title, slug, or category..." class="admin-input pl-11">
          </div>
          <div class="relative min-w-[180px]">
            <select v-model="statusFilter" class="admin-select py-2 pl-9 text-xs" aria-label="Filter news status">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <Filter class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredNews.length }} entries</div>
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
            <tr v-for="item in paginatedNews" :key="item.id">
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
            <tr v-if="!filteredNews.length">
              <td colspan="5" class="admin-empty-state">No news entries found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminPagination
        v-model:page="currentPage"
        v-model:page-size="pageSize"
        :total="newsPaginationTotal"
        label="articles"
      />
    </section>

    <AdminModal
      v-model="isModalOpen"
      kicker="Editorial Form"
      :title="form.id ? 'Edit News' : 'Create News'"
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
              <input v-model="form.title" @input="generateSlug" type="text" required class="admin-input" placeholder="Enter article title" :aria-invalid="Boolean(fieldErrors.title)">
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
                <div class="absolute inset-0 flex items-center justify-center bg-white/75 opacity-0 transition group-hover:opacity-100"></div>
              </div>
              <div v-else class="text-center">
                <Upload class="mx-auto h-8 w-8 text-slate-400" />
                <p class="mt-3 text-sm text-slate-500">Click or drag image here</p>
              </div>
              <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp" aria-label="Upload news featured image" @change="handleFileUpload">
            </div>
            <p v-if="form.imageFileName" class="mt-2 text-xs text-slate-500">{{ form.imageFileName }}</p>
            <p v-if="fieldErrors.image_url" class="mt-1 text-sm text-rose-600">{{ fieldErrors.image_url }}</p>
          </div>
          <p v-if="fieldErrors.content" class="mt-1 text-sm text-rose-600">{{ fieldErrors.content }}</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Content <span class="text-rose-500">*</span></label>
          <AdminRichTextEditor v-model="form.content" aria-label="News content" />
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" :disabled="isSaving" class="admin-secondary-btn">Cancel</button>
        <button @click="saveForm" :disabled="isSaving" class="admin-primary-btn">
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
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
      title="Delete News"
      message="This article will be removed from the editorial list. This action cannot be undone."
      :detail="deleteState.name"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Edit2, Filter, Image as ImageIcon, Plus, Search, Trash2, Upload } from 'lucide-vue-next'
import { useAdminPagination } from '~/composables/useAdminPagination'

const { news: newsItems, paginationMeta, fetchNews, createNews, updateNews, deleteNews } = useNews({ includeDrafts: true, immediate: false })
const { categories: newsCategories, fetchCategories } = useCategories({ type: 'News' })

const isModalOpen = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const isSaving = ref(false)
const isDeleting = ref(false)
const formError = ref('')
const fieldErrors = ref({})
const successState = ref({
  open: false,
  title: '',
  message: ''
})
const deleteState = ref({ open: false, id: null, name: '' })
const form = ref({
  id: null,
  title: '',
  slug: '',
  category: 'Technology',
  is_published: true,
  image_url: null,
  imageFile: null,
  imageFileName: '',
  content: ''
})

const categoryOptions = computed(() => {
  const options = newsCategories.value.map((category) => category.name).filter(Boolean)
  return options.length ? options : ['Technology', 'Company Updates']
})

const filteredNews = computed(() => {
  const statusItems = newsItems.value.filter((item) => {
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

const isNewsServerPaginated = computed(() => paginationMeta.value.isServerPaginated)
const newsPaginationTotal = computed(() => isNewsServerPaginated.value ? paginationMeta.value.total : filteredNews.value.length)
const { currentPage, pageSize, paginatedItems: paginatedNews } = useAdminPagination(filteredNews, 10, {
  totalItems: newsPaginationTotal,
  serverSide: isNewsServerPaginated
})

const fetchNewsPage = () => fetchNews({
  page: currentPage.value,
  limit: pageSize.value,
  search: searchQuery.value.trim(),
  status: statusFilter.value
})

const stats = computed(() => [
  { label: 'Total Articles', value: paginationMeta.value.total, meta: 'Editorial entries in workspace' },
  { label: 'Published', value: newsItems.value.filter((item) => item.is_published).length, meta: 'Live on the website' },
  { label: 'Drafts', value: newsItems.value.filter((item) => !item.is_published).length, meta: 'Waiting for approval' },
  { label: 'With Image', value: newsItems.value.filter((item) => item.image_url).length, meta: 'Ready for feature placement' }
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
  if (item) {
    form.value = {
      ...item,
      imageFile: null,
      imageFileName: ''
    }
  } else {
    form.value = {
      id: null,
      title: '',
      slug: '',
      category: categoryOptions.value[0] || 'Technology',
      is_published: true,
      image_url: null,
      imageFile: null,
      imageFileName: '',
      content: ''
    }
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
  if (!form.value.title?.trim()) errors.title = 'Article title is required.'
  if (!stripHtml(form.value.content).trim()) errors.content = 'Article content is required.'
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
      await updateNews(form.value.id, form.value)
    } else {
      await createNews(form.value)
    }

    isModalOpen.value = false
    await fetchNewsPage()
    successState.value = {
      open: true,
      title: isEditing ? 'News updated' : 'News created',
      message: isEditing
        ? 'The news article has been updated successfully.'
        : 'The new news article has been added successfully.'
    }
  } catch (error) {
    fieldErrors.value = getApiFieldErrors(error)
    formError.value = getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (id) => {
  const news = newsItems.value.find((item) => item.id === id)
  deleteState.value = { open: true, id, name: news?.title || `News ID ${id}` }
}

const confirmDelete = async () => {
  if (!deleteState.value.id || isDeleting.value) return

  isDeleting.value = true
  try {
    await deleteNews(deleteState.value.id)
    deleteState.value = { open: false, id: null, name: '' }
    await fetchNewsPage()
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

watch([currentPage, pageSize, searchQuery, statusFilter], ([, , search, status], [, oldPageSize, oldSearch, oldStatus] = []) => {
  if ((pageSize.value !== oldPageSize || search !== oldSearch || status !== oldStatus) && currentPage.value !== 1) {
    currentPage.value = 1
    return
  }

  fetchNewsPage()
}, { immediate: true })
</script>
