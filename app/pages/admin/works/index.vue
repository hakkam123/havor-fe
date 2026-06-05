<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Portfolio</p>
          <h1 class="admin-title">Works</h1>
          <p class="admin-copy">Track showcase projects, client details, and case-study readiness from one dashboard table.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button @click="openModal()" class="admin-primary-btn">
            <Plus class="h-4 w-4" />
            Create Work
          </button>
        </div>
      </div>
    </section>

    <section class="admin-table-shell">
      <div class="admin-toolbar">
        <div class="relative min-w-0 xl:w-[320px]">
          <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Search works, clients, categories..." class="admin-input pl-11">
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredWorks.length }} entries</div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Year</th>
              <th>Category</th>
              <th>Description</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedWorks" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
                    <img v-if="item.image_url" :src="item.image_url" class="h-full w-full object-cover" >
                    <ImageIcon v-else class="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ item.title }}</p>
                    <p class="text-xs text-slate-400">/{{ item.slug }}</p>
                  </div>
                </div>
              </td>
              <td>{{ item.client || '-' }}</td>
              <td>{{ item.year || '-' }}</td>
              <td><span class="admin-badge">{{ item.categoryName || 'Unassigned' }}</span></td>
              <td class="max-w-[320px] truncate text-slate-500">{{ stripHtml(item.description) || '-' }}</td>
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
            <tr v-if="!filteredWorks.length">
              <td colspan="6" class="admin-empty-state">No works found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminPagination
        v-model:page="currentPage"
        v-model:page-size="pageSize"
        :total="paginationMeta.total"
        label="works"
      />
    </section>

    <AdminModal
      v-model="isModalOpen"
      kicker="Portfolio Form"
      :title="form.id ? 'Edit Work' : 'Create Work'"
      max-width-class="max-w-4xl"
      :can-close="!isSaving"
    >
      <form @submit.prevent="saveWork" class="space-y-6">
        <div v-if="formError" class="rounded-[12px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ formError }}
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Title <span class="text-rose-500">*</span></label>
              <input v-model="form.title" type="text" required class="admin-input" placeholder="Project title" :aria-invalid="Boolean(fieldErrors.title)">
              <p v-if="fieldErrors.title" class="mt-1 text-sm text-rose-600">{{ fieldErrors.title }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Client <span class="text-rose-500">*</span></label>
                <select v-model="form.client" class="admin-select" :aria-invalid="Boolean(fieldErrors.client)">
                  <option value="">Select client</option>
                  <option v-for="client in clients" :key="client.id" :value="client.name">{{ client.name }}</option>
                </select>
                <p v-if="fieldErrors.client" class="mt-1 text-sm text-rose-600">{{ fieldErrors.client }}</p>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Year <span class="text-rose-500">*</span></label>
                <input v-model="form.year" type="number" class="admin-input" placeholder="2026" :aria-invalid="Boolean(fieldErrors.year)">
                <p v-if="fieldErrors.year" class="mt-1 text-sm text-rose-600">{{ fieldErrors.year }}</p>
              </div>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Category <span class="text-rose-500">*</span></label>
              <select v-model="form.categoryId" class="admin-select" required>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
              <p v-if="fieldErrors.categoryId" class="mt-1 text-sm text-rose-600">{{ fieldErrors.categoryId }}</p>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600">Image <span class="text-rose-500">*</span></label>
            <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
              <div v-if="form.image_url" class="absolute inset-0">
                <img :src="form.image_url" class="h-full w-full object-cover" >
              </div>
              <div v-else class="text-center">
                <Upload class="mx-auto h-8 w-8 text-slate-400" />
                <p class="mt-3 text-sm text-slate-500">Click or drag image here</p>
              </div>
              <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp" aria-label="Upload work image" @change="handleImageUpload">
            </div>
            <p v-if="form.imageFileName" class="mt-2 text-xs text-slate-500">{{ form.imageFileName }}</p>
            <p v-if="fieldErrors.image_url" class="mt-1 text-sm text-rose-600">{{ fieldErrors.image_url }}</p>
          </div>
          <p v-if="fieldErrors.description" class="mt-1 text-sm text-rose-600">{{ fieldErrors.description }}</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Description <span class="text-rose-500">*</span></label>
          <AdminRichTextEditor v-model="form.description" aria-label="Work description" />
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" :disabled="isSaving" class="admin-secondary-btn">Cancel</button>
        <button @click="saveWork" :disabled="isSaving" class="admin-primary-btn">
          {{ isSaving ? 'Saving...' : 'Save Work' }}
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
      title="Delete Work"
      message="This work item will be removed from the portfolio list. This action cannot be undone."
      :detail="deleteState.name"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Edit2, Image as ImageIcon, Plus, Search, Trash2, Upload } from 'lucide-vue-next'
import { useAdminPagination } from '~/composables/useAdminPagination'

const { works, paginationMeta, fetchWorks, createWork, updateWork, deleteWork } = useWorks({ immediate: false })
const { categories, fetchCategories } = useCategories({ type: 'Product' })
const { clients, fetchClients } = useClients()

const isModalOpen = ref(false)
const searchQuery = ref('')
const isSaving = ref(false)
const isDeleting = ref(false)
const formError = ref('')
const fieldErrors = ref({})
const successState = ref({
  open: false,
  title: '',
  message: ''
})
const form = ref({})
const deleteState = ref({ open: false, id: null, name: '' })

const stripHtml = (value) => (value || '').replace(/<[^>]*>?/gm, '').trim()

const filteredWorks = computed(() => {
  if (!searchQuery.value) return works.value

  const query = searchQuery.value.toLowerCase()
  return works.value.filter((item) =>
    [item.title, item.client, item.categoryName, stripHtml(item.description)]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const { currentPage, pageSize, paginatedItems: paginatedWorks } = useAdminPagination(filteredWorks)

const fetchWorkPage = () => fetchWorks({
  page: currentPage.value,
  limit: pageSize.value,
  search: searchQuery.value.trim()
})

const stats = computed(() => [
  { label: 'Total Works', value: paginationMeta.value.total, meta: 'Portfolio entries in workspace' },
  { label: 'With Client', value: works.value.filter((item) => item.client).length, meta: 'Entries linked to client details' },
  { label: 'With Image', value: works.value.filter((item) => item.image_url).length, meta: 'Ready for project showcase' },
  { label: 'Categories', value: categories.value.length, meta: 'Available grouping options' }
])

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchClients()])
})

watch([currentPage, pageSize, searchQuery], () => {
  fetchWorkPage()
}, { immediate: true })

const openModal = (item = null) => {
  form.value = item
    ? {
      ...item,
      imageFile: null,
      imageFileName: ''
    }
    : {
      title: '',
      description: '',
      client: '',
      year: new Date().getFullYear(),
      categoryId: categories.value[0]?.id || '',
      image_url: null,
      imageFile: null,
      imageFileName: ''
    }

  isModalOpen.value = true
}

const closeModal = () => {
  if (isSaving.value) return
  isModalOpen.value = false
}

const handleImageUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.imageFile = file
    form.value.imageFileName = file.name
    form.value.image_url = URL.createObjectURL(file)
  }
}

const saveWork = async () => {
  fieldErrors.value = {}
  formError.value = ''
  const errors = {}
  if (!form.value.title?.trim()) errors.title = 'Project title is required.'
  if (!form.value.client?.trim()) errors.client = 'Client is required.'
  if (!form.value.categoryId) errors.categoryId = 'Category is required.'
  if (!stripHtml(form.value.description).trim()) errors.description = 'Description is required.'
  if (!form.value.year) errors.year = 'Year is required.'
  if (form.value.year && (Number(form.value.year) < 1900 || Number(form.value.year) > 2100)) errors.year = 'Year must be between 1900 and 2100.'
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
      await updateWork(form.value.id, form.value)
    } else {
      await createWork(form.value)
    }

    isModalOpen.value = false
    await fetchWorkPage()
    successState.value = {
      open: true,
      title: isEditing ? 'Work updated' : 'Work created',
      message: isEditing
        ? 'The work entry has been updated successfully.'
        : 'The new work entry has been added successfully.'
    }
  } catch (error) {
    fieldErrors.value = getApiFieldErrors(error)
    formError.value = getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = (id) => {
  const work = works.value.find((item) => item.id === id)
  deleteState.value = { open: true, id, name: work?.title || `Work ID ${id}` }
}

const confirmDelete = async () => {
  if (!deleteState.value.id || isDeleting.value) return

  isDeleting.value = true
  try {
    await deleteWork(deleteState.value.id)
    deleteState.value = { open: false, id: null, name: '' }
    await fetchWorkPage()
  } finally {
    isDeleting.value = false
  }
}
</script>
