<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Catalog</p>
          <h1 class="admin-title">Products</h1>
          <p class="admin-copy">Manage the full product catalog, category mapping, pricing destinations, and media assets.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button @click="openModal()" class="admin-primary-btn">
            <Plus class="h-4 w-4" />
            Create Product
          </button>
        </div>
      </div>
    </section>

    <section class="admin-table-shell">
      <div class="admin-toolbar">
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div class="relative min-w-0 xl:w-[320px]">
            <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="searchQuery" type="text" placeholder="Search products, categories, descriptions..." class="admin-input pl-11">
          </div>
          <select v-model="selectedCategoryId" class="admin-select min-w-[200px] py-2 text-xs">
            <option value="all">All Categories</option>
            <option value="unassigned">Unassigned</option>
            <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">{{ cat.name }}</option>
          </select>
        </div>

        <div class="text-sm text-slate-500">Showing {{ filteredProducts.length }} entries</div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>External Link</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedProducts" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
                    <img v-if="item.image_url" :src="item.image_url" class="h-full w-full object-cover" >
                    <ImageIcon v-else class="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">Product ID {{ item.id }}</p>
                  </div>
                </div>
              </td>
              <td>
                <span class="admin-badge">{{ item.categoryName || 'Unassigned' }}</span>
              </td>
              <td class="max-w-[320px] truncate text-slate-500">{{ stripHtml(item.description) || '-' }}</td>
              <td>
                <a
                  v-if="item.external_link"
                  :href="normalizeProductExternalLink(item.external_link)"
                  target="_blank"
                  class="inline-flex items-center gap-2 font-medium text-slate-700 transition hover:text-slate-950"
                >
                  <ExternalLink class="h-4 w-4" />
                  Visit
                </a>
                <span v-else class="text-slate-400">-</span>
              </td>
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
            <tr v-if="!filteredProducts.length">
              <td colspan="5" class="admin-empty-state">No products found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminPagination
        v-model:page="currentPage"
        v-model:page-size="pageSize"
        :total="productPaginationTotal"
        label="products"
      />
    </section>

    <AdminModal
      v-model="isModalOpen"
      kicker="Catalog Form"
      :title="form.id ? 'Edit Product' : 'Create Product'"
      max-width-class="max-w-4xl"
      :can-close="!isSaving"
    >
      <form @submit.prevent="saveProduct" class="space-y-6">
        <div v-if="formError" class="rounded-[12px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ formError }}
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Name <span class="text-rose-500">*</span></label>
              <input v-model="form.name" type="text" required class="admin-input" placeholder="Product name" :aria-invalid="Boolean(fieldErrors.name)">
              <p v-if="fieldErrors.name" class="mt-1 text-sm text-rose-600">{{ fieldErrors.name }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Category <span class="text-rose-500">*</span></label>
              <select v-model="form.categoryId" class="admin-select" required>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
              <p v-if="fieldErrors.categoryId" class="mt-1 text-sm text-rose-600">{{ fieldErrors.categoryId }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">External Link <span class="text-rose-500">*</span></label>
              <input v-model="form.external_link" type="url" class="admin-input" placeholder="https://..." :aria-invalid="Boolean(fieldErrors.external_link)">
              <p v-if="fieldErrors.external_link" class="mt-1 text-sm text-rose-600">{{ fieldErrors.external_link }}</p>
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
              <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp" aria-label="Upload product image" @change="handleImageUpload">
            </div>
            <p v-if="form.imageFileName" class="mt-2 text-xs text-slate-500">{{ form.imageFileName }}</p>
            <p v-if="fieldErrors.image_url" class="mt-1 text-sm text-rose-600">{{ fieldErrors.image_url }}</p>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Description <span class="text-rose-500">*</span></label>
          <AdminRichTextEditor v-model="form.description" aria-label="Product description" />
          <p v-if="fieldErrors.description" class="mt-1 text-sm text-rose-600">{{ fieldErrors.description }}</p>
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" :disabled="isSaving" class="admin-secondary-btn">Cancel</button>
        <button @click="saveProduct" :disabled="isSaving" class="admin-primary-btn">
          {{ isSaving ? 'Saving...' : 'Save Product' }}
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
      title="Delete Product"
      message="This product will be removed from the catalog. This action cannot be undone."
      :detail="deleteState.name"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Edit2, ExternalLink, Image as ImageIcon, Plus, Search, Trash2, Upload } from 'lucide-vue-next'
import { useAdminPagination } from '~/composables/useAdminPagination'

const { products, paginationMeta, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts({ immediate: false })
const { categories, fetchCategories } = useCategories({ type: 'Product' })

const isModalOpen = ref(false)
const searchQuery = ref('')
const selectedCategoryId = ref('all')
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
const normalizeProductExternalLink = (value = '') => String(value || '').replace('havorsmartadigital.com', 'havorsmarta.netlify.app')

const filteredProducts = computed(() => {
  const selectedCategory = selectedCategoryId.value
  const source = products.value.filter((item) => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'unassigned') return !item.categoryId
    return String(item.categoryId) === selectedCategory
  })

  if (!searchQuery.value) return source

  const query = searchQuery.value.toLowerCase()
  return source.filter((item) =>
    [item.name, item.categoryName, stripHtml(item.description)]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const isProductServerPaginated = computed(() => paginationMeta.value.isServerPaginated)
const productPaginationTotal = computed(() => isProductServerPaginated.value ? paginationMeta.value.total : filteredProducts.value.length)
const { currentPage, pageSize, paginatedItems: paginatedProducts } = useAdminPagination(filteredProducts, 10, {
  totalItems: productPaginationTotal,
  serverSide: isProductServerPaginated
})

const fetchProductPage = () => fetchProducts({
  page: currentPage.value,
  limit: pageSize.value,
  search: searchQuery.value.trim(),
  categoryId: selectedCategoryId.value
})

const stats = computed(() => [
  { label: 'Total Products', value: paginationMeta.value.total, meta: 'Catalog entries in workspace' },
  { label: 'Linked Products', value: products.value.filter((item) => item.external_link).length, meta: 'Connected to external destination' },
  { label: 'With Images', value: products.value.filter((item) => item.image_url).length, meta: 'Ready for visual listing' },
  { label: 'Categories', value: categories.value.length, meta: 'Available category groups' }
])

onMounted(async () => {
  await fetchCategories()
})

watch([currentPage, pageSize, searchQuery, selectedCategoryId], ([, , search, category], [, oldPageSize, oldSearch, oldCategory] = []) => {
  if ((pageSize.value !== oldPageSize || search !== oldSearch || category !== oldCategory) && currentPage.value !== 1) {
    currentPage.value = 1
    return
  }

  fetchProductPage()
}, { immediate: true })

const openModal = (item = null) => {
  form.value = item
    ? {
      ...item,
      imageFile: null,
      imageFileName: ''
    }
    : {
      name: '',
      description: '',
      categoryId: categories.value[0]?.id || '',
      external_link: 'https://havorsmarta.netlify.app/products',
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

const saveProduct = async () => {
  fieldErrors.value = {}
  formError.value = ''
  const errors = {}
  if (!form.value.name?.trim()) errors.name = 'Product name is required.'
  if (!form.value.categoryId) errors.categoryId = 'Category is required.'
  if (!stripHtml(form.value.description).trim()) errors.description = 'Description is required.'
  if (!form.value.external_link?.trim()) errors.external_link = 'External link is required.'
  if (!isValidHttpUrl(form.value.external_link)) errors.external_link = 'External link must be a valid http or https URL.'
  if (!isSupportedImageFile(form.value.imageFile)) errors.image_url = 'Image must be a JPG, PNG, or WEBP file.'
  if (Object.keys(errors).length) {
    fieldErrors.value = errors
    formError.value = 'Please fix the highlighted fields before saving.'
    return
  }

  isSaving.value = true

  try {
    const isEditing = Boolean(form.value.id)
    form.value.external_link = normalizeProductExternalLink(form.value.external_link)

    if (isEditing) {
      await updateProduct(form.value.id, form.value)
    } else {
      await createProduct(form.value)
    }

    isModalOpen.value = false
    await fetchProductPage()
    successState.value = {
      open: true,
      title: isEditing ? 'Product updated' : 'Product created',
      message: isEditing
        ? 'The product entry has been updated successfully.'
        : 'The new product entry has been added successfully.'
    }
  } catch (error) {
    fieldErrors.value = getApiFieldErrors(error)
    formError.value = getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = (id) => {
  const product = products.value.find((item) => item.id === id)
  deleteState.value = { open: true, id, name: product?.name || `Product ID ${id}` }
}

const confirmDelete = async () => {
  if (!deleteState.value.id || isDeleting.value) return

  isDeleting.value = true
  try {
    await deleteProduct(deleteState.value.id)
    deleteState.value = { open: false, id: null, name: '' }
    await fetchProductPage()
  } finally {
    isDeleting.value = false
  }
}
</script>
