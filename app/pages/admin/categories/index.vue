<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Taxonomy</p>
          <h1 class="admin-title">Content Categories</h1>
          <p class="admin-copy">Maintain fixed category groups for news, careers, campaigns, and products.</p>
        </div>
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
        <div class="relative min-w-0 xl:w-[360px]">
          <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Search category or slug..." class="admin-input pl-11">
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredCategories.length }} entries</div>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-2">
      <article v-for="section in categorySections" :key="section.type" class="admin-table-shell">
        <div class="admin-toolbar">
          <div>
            <p class="text-sm font-semibold text-slate-900">{{ section.title }}</p>
            <p class="mt-1 text-xs text-[var(--admin-muted)]">{{ section.description }}</p>
          </div>
          <button type="button" class="admin-primary-btn" @click="openModal(null, section.type)">
            <Plus class="h-4 w-4" />
            {{ section.createLabel }}
          </button>
        </div>

        <div class="custom-scrollbar overflow-x-auto">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedCategoriesByType(section.type)" :key="item.id">
                <td class="font-semibold text-slate-900">{{ item.name }}</td>
                <td><span class="admin-badge">{{ item.slug }}</span></td>
                <td>
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openModal(item, section.type)" class="admin-icon-btn" :aria-label="`Edit ${item.name}`">
                      <Edit2 class="h-4 w-4" />
                    </button>
                    <button @click="handleDelete(item.id)" class="admin-icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600" :aria-label="`Delete ${item.name}`">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!categoriesByType(section.type).length">
                <td colspan="3" class="admin-empty-state">
                  {{ error ? error : `No ${section.type.toLowerCase()} categories found.` }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <AdminPagination
          :page="categoryPages[section.type]"
          :total="categoryTotalByType(section.type)"
          :page-size="categoryPageSizes[section.type]"
          :label="`${section.type.toLowerCase()} categories`"
          @update:page="setCategoryPage(section.type, $event)"
          @update:page-size="setCategoryPageSize(section.type, $event)"
        />
      </article>
    </section>

    <AdminModal
      v-model="isModalOpen"
      kicker="Taxonomy Form"
      :title="form.id ? 'Edit Category' : `Create ${form.type} Category`"
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
          <select v-model="form.type" class="admin-select" :disabled="!form.id">
            <option v-for="type in categoryTypes" :key="type" :value="type">{{ type }}</option>
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
import { computed, onMounted, ref, watch } from 'vue'
import { Edit2, Plus, Search, Trash2 } from 'lucide-vue-next'

const categoryTypes = ['News', 'Career', 'Campaign', 'Product']
const categorySections = [
  {
    type: 'News',
    title: 'Categories for News',
    description: 'Editorial labels used by media and news articles.',
    createLabel: 'Create'
  },
  {
    type: 'Career',
    title: 'Categories for Career',
    description: 'Role grouping labels for career-related surfaces.',
    createLabel: 'Create'
  },
  {
    type: 'Campaign',
    title: 'Categories for Campaign',
    description: 'Campaign labels used by public campaign content.',
    createLabel: 'Create'
  },
  {
    type: 'Product',
    title: 'Categories for Product',
    description: 'Catalog grouping labels for products and related work entries.',
    createLabel: 'Create'
  }
]

const { error, createCategory, updateCategory, deleteCategory } = useCategories({ immediate: false })
const categoryResources = Object.fromEntries(
  categoryTypes.map((type) => [type, useCategories({ type, immediate: false })])
)

const isModalOpen = ref(false)
const searchQuery = ref('')
const formError = ref('')
const isSaving = ref(false)
const isDeleting = ref(false)
const successState = ref({ open: false, title: '', message: '' })
const form = ref({ id: null, name: '', type: 'Product' })
const deleteState = ref({ open: false, id: null, name: '' })
const categoryPages = ref(Object.fromEntries(categoryTypes.map((type) => [type, 1])))
const categoryPageSizes = ref(Object.fromEntries(categoryTypes.map((type) => [type, 10])))

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const isValidCategoryType = (type) => categoryTypes.includes(type)

const filteredCategories = computed(() => categoryTypes.flatMap((type) => categoriesByType(type)))

const categoriesByType = (type) => categoryResources[type]?.categories.value || []
const paginatedCategoriesByType = (type) => categoriesByType(type)
const categoryTotalByType = (type) => categoryResources[type]?.paginationMeta.value.total || 0

const fetchCategoryPage = (type) => categoryResources[type]?.fetchCategories({
  page: categoryPages.value[type],
  limit: categoryPageSizes.value[type],
  search: searchQuery.value.trim()
})

const setCategoryPage = (type, page) => {
  categoryPages.value[type] = page
  fetchCategoryPage(type)
}

const setCategoryPageSize = (type, pageSize) => {
  categoryPageSizes.value[type] = pageSize
  categoryPages.value[type] = 1
  fetchCategoryPage(type)
}

const stats = computed(() => categorySections.map((section) => ({
  label: section.title,
  value: categoryTotalByType(section.type),
  meta: section.description
})))

onMounted(() => {
  categoryTypes.forEach(fetchCategoryPage)
})

watch(searchQuery, () => {
  categoryTypes.forEach((type) => {
    categoryPages.value[type] = 1
    fetchCategoryPage(type)
  })
})

const openModal = (item = null, type = 'Product') => {
  const selectedType = isValidCategoryType(item?.type) ? item.type : type
  formError.value = ''
  form.value = item
    ? { id: item.id, name: item.name || '', type: selectedType }
    : { id: null, name: '', type: isValidCategoryType(selectedType) ? selectedType : 'Product' }

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

  if (!isValidCategoryType(form.value.type)) {
    formError.value = 'Category type must be News, Career, Campaign, or Product.'
    return
  }

  isSaving.value = true

  try {
    const isEditing = Boolean(form.value.id)
    const payload = { name: form.value.name.trim(), type: form.value.type }

    if (isEditing) {
      await updateCategory(form.value.id, payload)
    } else {
      await createCategory(payload)
    }

    isModalOpen.value = false
    categoryTypes.forEach(fetchCategoryPage)
    successState.value = {
      open: true,
      title: isEditing ? 'Category updated' : 'Category created',
      message: isEditing
        ? 'The category changes have been saved successfully.'
        : `${form.value.type} category has been added successfully.`
    }
  } catch (error) {
    const fieldErrors = getApiFieldErrors(error)
    formError.value = fieldErrors.name || fieldErrors.type || getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = (id) => {
  const category = filteredCategories.value.find((item) => item.id === id)
  deleteState.value = { open: true, id, name: category?.name || `Category ID ${id}` }
}

const confirmDelete = async () => {
  if (!deleteState.value.id || isDeleting.value) return

  isDeleting.value = true
  try {
    await deleteCategory(deleteState.value.id)
    deleteState.value = { open: false, id: null, name: '' }
    categoryTypes.forEach(fetchCategoryPage)
  } catch (error) {
    formError.value = getApiErrorMessage(error)
  } finally {
    isDeleting.value = false
  }
}
</script>
