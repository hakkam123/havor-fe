<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Taxonomy</p>
          <h1 class="admin-title">Shared Categories</h1>
          <p class="admin-copy">Maintain reusable category labels used across products, works, and editorial content.</p>
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
          <input v-model="searchQuery" type="text" placeholder="Search category, slug, description..." class="admin-input pl-11">
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredCategories.length }} entries</div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCategories" :key="item.id">
              <td class="font-semibold text-slate-900">{{ item.name }}</td>
              <td><span class="admin-badge">{{ item.slug || toSlug(item.name) }}</span></td>
              <td class="max-w-[420px] truncate text-slate-500">{{ stripHtml(item.description) || '-' }}</td>
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
              <td colspan="4" class="admin-empty-state">No categories found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-950/40" @click="closeModal"></div>

      <div class="admin-modal-card max-w-4xl" v-motion-slide-visible-bottom>
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
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Description</label>
              <div class="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-white">
                <Editor
                  api-key="88silew48dnac4zpntprubmilq8z9lqfe5by76mvrkvas4nt"
                  v-model="form.description"
                  :init="editorConfig"
                />
              </div>
            </div>
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
import Editor from '@tinymce/tinymce-vue'

const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories()

const isModalOpen = ref(false)
const searchQuery = ref('')
const form = ref({ id: null, name: '', description: '' })

const editorConfig = {
  height: 300,
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

const stripHtml = (value) => (value || '').replace(/<[^>]*>?/gm, '').trim()

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
    [item.name, item.slug, stripHtml(item.description)]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Total Categories', value: categories.value.length, meta: 'Taxonomy labels in workspace' },
  { label: 'With Description', value: categories.value.filter((item) => stripHtml(item.description)).length, meta: 'Ready for internal context' },
  { label: 'Empty Description', value: categories.value.filter((item) => !stripHtml(item.description)).length, meta: 'Can be enriched further' },
  { label: 'Search Results', value: filteredCategories.value.length, meta: 'Current filtered category count' }
])

onMounted(() => {
  fetchCategories()
})

const openModal = (item = null) => {
  form.value = item
    ? { id: item.id, name: item.name || '', description: item.description || '' }
    : { id: null, name: '', description: '' }

  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCategory = async () => {
  if (form.value.id) {
    await updateCategory(form.value.id, { name: form.value.name, description: form.value.description })
  } else {
    await createCategory({ name: form.value.name, description: form.value.description })
  }

  closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    await deleteCategory(id)
  }
}
</script>
