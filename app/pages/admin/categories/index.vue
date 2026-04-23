<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Taxonomy</p>
          <h1 class="admin-title">Shared Categories</h1>
          <p class="admin-copy">Maintain the shared category labels used by products and works. This admin form now matches the backend contract of `name` only.</p>
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
              <th>Slug</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCategories" :key="item.id">
              <td class="font-semibold text-slate-900">{{ item.name }}</td>
              <td><span class="admin-badge">{{ item.slug }}</span></td>
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
            <tr v-if="!filteredCategories.length">
              <td colspan="3" class="admin-empty-state">
                {{ error ? error : 'No categories found.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-950/40" @click="closeModal"></div>

      <div class="admin-modal-card max-w-2xl" v-motion-slide-visible-bottom>
        <div class="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
          <div>
            <p class="admin-kicker">Taxonomy Form</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Category' : 'Create Category' }}</h2>
          </div>
          <button @click="closeModal" class="admin-icon-btn">
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
          <form @submit.prevent="saveCategory" class="space-y-6">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Name <span class="text-rose-500">*</span></label>
              <input v-model="form.name" type="text" required class="admin-input" placeholder="Category name">
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Slug</label>
              <input :value="toSlug(form.name)" type="text" class="admin-input bg-slate-50 text-slate-500" readonly>
            </div>
            <p v-if="formError" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {{ formError }}
            </p>
          </form>
        </div>

        <div class="flex justify-end gap-3 border-t border-[var(--admin-border)] px-6 py-4">
          <button @click="closeModal" class="admin-secondary-btn">Cancel</button>
          <button @click="saveCategory" class="admin-primary-btn">Save Category</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Edit2, Plus, Search, Trash2, X } from 'lucide-vue-next'

const { categories, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories()

const isModalOpen = ref(false)
const searchQuery = ref('')
const formError = ref('')
const form = ref({ id: null, name: '' })

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
  { label: 'Unique Slugs', value: new Set(categories.value.map((item) => item.slug).filter(Boolean)).size, meta: 'Frontend-friendly route labels' },
  { label: 'Search Results', value: filteredCategories.value.length, meta: 'Current filtered category count' },
  { label: 'Empty Name', value: categories.value.filter((item) => !item.name).length, meta: 'Should remain zero' }
])

onMounted(() => {
  fetchCategories()
})

const openModal = (item = null) => {
  formError.value = ''
  form.value = item
    ? { id: item.id, name: item.name || '' }
    : { id: null, name: '' }

  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCategory = async () => {
  formError.value = ''

  if (!form.value.name?.trim()) {
    formError.value = 'Category name is required.'
    return
  }

  if (form.value.id) {
    await updateCategory(form.value.id, { name: form.value.name })
  } else {
    await createCategory({ name: form.value.name })
  }

  closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    await deleteCategory(id)
  }
}
</script>
