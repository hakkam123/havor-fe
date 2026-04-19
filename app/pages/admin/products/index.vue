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
          <button class="admin-secondary-btn">
            <Download class="h-4 w-4" />
            Export
          </button>
          <button @click="openModal()" class="admin-primary-btn">
            <Plus class="h-4 w-4" />
            Create Product
          </button>
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
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div class="relative min-w-0 xl:w-[320px]">
            <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="searchQuery" type="text" placeholder="Search products, categories, descriptions..." class="admin-input pl-11">
          </div>
          <button class="admin-secondary-btn py-2 text-xs">
            <Filter class="h-4 w-4" />
            All Categories
          </button>
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
            <tr v-for="item in filteredProducts" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
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
                  :href="item.external_link"
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
                  <button @click="openModal(item)" class="admin-icon-btn">
                    <Edit2 class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(item.id)" class="admin-icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
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
    </section>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-950/40" @click="closeModal"></div>

      <div class="admin-modal-card max-w-4xl" v-motion-slide-visible-bottom>
        <div class="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
          <div>
            <p class="admin-kicker">Catalog Form</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Product' : 'Create Product' }}</h2>
          </div>
          <button @click="closeModal" class="admin-icon-btn">
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
          <form @submit.prevent="saveProduct" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Name <span class="text-rose-500">*</span></label>
                  <input v-model="form.name" type="text" required class="admin-input" placeholder="Product name">
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Category <span class="text-rose-500">*</span></label>
                  <select v-model="form.categoryId" class="admin-select" required>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">External Link</label>
                  <input v-model="form.external_link" type="url" class="admin-input" placeholder="https://...">
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Image</label>
                <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
                  <div v-if="form.image_url" class="absolute inset-0">
                    <img :src="form.image_url" class="h-full w-full object-cover" >
                  </div>
                  <div v-else class="text-center">
                    <Upload class="mx-auto h-8 w-8 text-slate-400" />
                    <p class="mt-3 text-sm text-slate-500">Click or drag image here</p>
                  </div>
                  <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/*" @change="handleImageUpload">
                </div>
                <p v-if="form.imageFileName" class="mt-2 text-xs text-slate-500">{{ form.imageFileName }}</p>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Description <span class="text-rose-500">*</span></label>
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
          <button @click="saveProduct" class="admin-primary-btn">Save Product</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Download, Edit2, ExternalLink, Filter, Image as ImageIcon, Plus, Search, Trash2, Upload, X } from 'lucide-vue-next'
import Editor from '@tinymce/tinymce-vue'

const { products, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()
const { categories, fetchCategories } = useCategories()

const isModalOpen = ref(false)
const searchQuery = ref('')
const form = ref({})

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

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value

  const query = searchQuery.value.toLowerCase()
  return products.value.filter((item) =>
    [item.name, item.categoryName, stripHtml(item.description)]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Total Products', value: products.value.length, meta: 'Catalog entries in workspace' },
  { label: 'Linked Products', value: products.value.filter((item) => item.external_link).length, meta: 'Connected to external destination' },
  { label: 'With Images', value: products.value.filter((item) => item.image_url).length, meta: 'Ready for visual listing' },
  { label: 'Categories', value: categories.value.length, meta: 'Available category groups' }
])

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories()])
})

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
      external_link: '',
      image_url: null,
      imageFile: null,
      imageFileName: ''
    }

  isModalOpen.value = true
}

const closeModal = () => {
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
  if (form.value.id) {
    await updateProduct(form.value.id, form.value)
  } else {
    await createProduct(form.value)
  }

  closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Delete this product?')) {
    await deleteProduct(id)
  }
}
</script>
