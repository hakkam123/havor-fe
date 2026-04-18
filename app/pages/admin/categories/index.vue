<template>
  <div class="space-y-6" v-motion-fade-up>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 mb-1">Shared Categories</h1>
        <p class="text-slate-500 text-sm">Manage reusable categories across content types.</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" />
        <span>Create Category</span>
      </button>
    </div>

    <div class="glass-panel overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
        <div class="relative max-w-sm w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Search categories..." class="input-field pl-10 h-10 w-full text-sm">
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium tracking-wider">Name</th>
              <th class="px-6 py-4 font-medium tracking-wider">Slug</th>
              <th class="px-6 py-4 font-medium tracking-wider">Description</th>
              <th class="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in filteredCategories" :key="item.id" class="hover:bg-slate-50 transition-colors duration-150">
              <td class="px-6 py-4 font-medium text-slate-900">{{ item.name }}</td>
              <td class="px-6 py-4 text-slate-500">{{ item.slug || '-' }}</td>
              <td class="px-6 py-4 text-slate-500 max-w-[420px] truncate">{{ stripHtml(item.description) || '-' }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openModal(item)" class="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors">
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button @click="handleDelete(item.id)" class="p-1.5 text-slate-500 hover:text-rose-600 bg-white border border-slate-200 hover:border-rose-200 rounded-lg transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredCategories.length">
              <td colspan="4" class="px-6 py-8 text-center text-slate-400">No categories found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
        <div>Showing {{ filteredCategories.length }} entries</div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-900/40" @click="closeModal"></div>

      <div class="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden" v-motion-slide-visible-bottom>
        <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 class="text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Category' : 'Create Category' }}</h2>
          <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form @submit.prevent="saveCategory" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">Name <span class="text-rose-500">*</span></label>
              <input v-model="form.name" type="text" required class="input-field" placeholder="Category name">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">Slug</label>
              <input :value="toSlug(form.name)" type="text" class="input-field bg-slate-50 text-slate-500" readonly>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-2">Description</label>
              <div class="border border-slate-200 rounded-lg overflow-hidden bg-white h-[300px]">
                <Editor
                  api-key="88silew48dnac4zpntprubmilq8z9lqfe5by76mvrkvas4nt"
                  v-model="form.description"
                  :init="editorConfig"
                />
              </div>
            </div>
          </form>
        </div>

        <div class="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium">Cancel</button>
          <button @click="saveCategory" class="btn-primary py-2 text-sm">Save Category</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-vue-next'
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
