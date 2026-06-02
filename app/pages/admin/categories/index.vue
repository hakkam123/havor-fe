<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Taxonomy</p>
          <h1 class="admin-title">Content Categories</h1>
          <p class="admin-copy">Maintain category labels by scope so product and editorial content stay cleanly separated.</p>
        </div>

        <button @click="openModal()" class="admin-primary-btn">
          <Plus class="h-4 w-4" />
          Create Category
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
          <input v-model="searchQuery" type="text" placeholder="Search category or slug..." class="admin-input pl-11">
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredCategories.length }} entries</div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Slug</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCategories" :key="item.id">
              <td class="font-semibold text-slate-900">{{ item.name }}</td>
              <td><span class="admin-badge capitalize">{{ item.type }}</span></td>
              <td><span class="admin-badge">{{ item.slug }}</span></td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button @click="openModal(item)" class="admin-icon-btn" :aria-label="`Edit ${item.name}`">
                    <Edit2 class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(item.id)" class="admin-icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600" :aria-label="`Delete ${item.name}`">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredCategories.length">
              <td colspan="4" class="admin-empty-state">
                {{ error ? error : 'No categories found.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <AdminModal
      v-model="isModalOpen"
      kicker="Taxonomy Form"
      :title="form.id ? 'Edit Category' : 'Create Category'"
      max-width-class="max-w-2xl"
      :can-close="!isSaving"
    >
      <form @submit.prevent="saveCategory" class="space-y-6">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Name <span class="text-rose-500">*</span></label>
          <input v-model="form.name" type="text" required class="admin-input" placeholder="Category name">
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Type <span class="text-rose-500">*</span></label>
          <select v-model="form.type" class="admin-select">
            <option value="news">News</option>
            <option value="product">Product</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Slug <span class="text-rose-500">*</span></label>
          <input :value="toSlug(form.name)" type="text" class="admin-input bg-slate-50 text-slate-500" readonly>
        </div>
        <p v-if="formError" class="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {{ formError }}
        </p>
      </form>

      <template #footer>
        <button @click="closeModal" :disabled="isSaving" class="admin-secondary-btn">Cancel</button>
        <button @click="saveCategory" :disabled="isSaving" class="admin-primary-btn">
          {{ isSaving ? 'Saving...' : 'Save Category' }}
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
      title="Delete Category"
      message="This category will be removed if it is not used by products, news, or campaigns."
      :detail="deleteState.name"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Edit2, Plus, Search, Trash2 } from 'lucide-vue-next'

const { categories, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories()
const { products, fetchProducts } = useProducts()
const { news: newsItems, fetchNews } = useNews({ includeDrafts: true })
const { campaigns, fetchCampaigns } = useCampaigns({ includeDrafts: true })

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
const form = ref({ id: null, name: '', type: 'product' })
const deleteState = ref({ open: false, id: null, name: '' })

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value

  const query = searchQuery.value.toLowerCase()
  return categories.value.filter((item) =>
    [item.name, item.slug]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Total Categories', value: categories.value.length, meta: 'Shared labels returned from the API' },
  { label: 'News Categories', value: categories.value.filter((item) => item.type === 'news').length, meta: 'Editorial and campaign labels' },
  { label: 'Product Categories', value: categories.value.filter((item) => item.type === 'product').length, meta: 'Product catalog labels' },
  { label: 'Search Results', value: filteredCategories.value.length, meta: 'Current filtered category count' }
])

onMounted(() => {
  fetchCategories()
  fetchProducts()
  fetchNews()
  fetchCampaigns()
})

const openModal = (item = null) => {
  formError.value = ''
  form.value = item
    ? { id: item.id, name: item.name || '', type: item.type || 'product' }
    : { id: null, name: '', type: 'product' }

  isModalOpen.value = true
}

const closeModal = () => {
  if (isSaving.value) return
  isModalOpen.value = false
}

const saveCategory = async () => {
  formError.value = ''

  if (!form.value.name?.trim()) {
    formError.value = 'Category name is required.'
    return
  }

  isSaving.value = true

  try {
    const isEditing = Boolean(form.value.id)

    if (isEditing) {
      await updateCategory(form.value.id, { name: form.value.name, type: form.value.type })
    } else {
      await createCategory({ name: form.value.name, type: form.value.type })
    }

    isModalOpen.value = false
    successState.value = {
      open: true,
      title: isEditing ? 'Category updated' : 'Category created',
      message: isEditing
        ? 'The category changes have been saved successfully.'
        : 'The new category has been added successfully.'
    }
  } catch (error) {
    const fieldErrors = getApiFieldErrors(error)
    formError.value = fieldErrors.name || getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

const categoryUsageMessage = (id) => {
  const category = categories.value.find((item) => item.id === id)
  if (!category) return ''

  const usedByProduct = products.value.some((product) => String(product.categoryId) === String(id) || product.categoryName === category.name)
  const usedByNews = newsItems.value.some((news) => news.category === category.name)
  const usedByCampaign = campaigns.value.some((campaign) => campaign.category === category.name)

  if (!usedByProduct && !usedByNews && !usedByCampaign) return ''

  const usages = [
    usedByProduct ? 'products' : '',
    usedByNews ? 'news' : '',
    usedByCampaign ? 'campaigns' : ''
  ].filter(Boolean).join(' and ')

  return `This category is still used by ${usages}. Move or update those records before deleting it.`
}

const handleDelete = (id) => {
  const category = categories.value.find((item) => item.id === id)
  const usageMessage = categoryUsageMessage(id)

  if (usageMessage) {
    formError.value = usageMessage
    return
  }

  deleteState.value = { open: true, id, name: category?.name || `Category ID ${id}` }
}

const confirmDelete = async () => {
  if (!deleteState.value.id || isDeleting.value) return

  const usageMessage = categoryUsageMessage(deleteState.value.id)
  if (usageMessage) {
    formError.value = usageMessage
    deleteState.value.open = false
    return
  }

  isDeleting.value = true
  try {
    await deleteCategory(deleteState.value.id)
    deleteState.value = { open: false, id: null, name: '' }
  } catch (error) {
    formError.value = getApiErrorMessage(error)
  } finally {
    isDeleting.value = false
  }
}
</script>
