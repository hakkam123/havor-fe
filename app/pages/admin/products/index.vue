<template>
  <div class="space-y-6" v-motion-fade-up>
    <!-- Header Controls -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 mb-1">Products</h1>
        <p class="text-slate-500 text-sm">Manage product catalog and links.</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" />
        <span>Add Product</span>
      </button>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-4 glass-panel p-4">
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search products..." class="input-field pl-10 h-10 w-full text-sm">
        </div>
        
        <select class="input-field h-10 text-sm w-32 hidden sm:block">
          <option value="">All Categories</option>
          <option value="1">Hardware</option>
          <option value="2">Software</option>
        </select>
      </div>
      
      <div class="flex items-center gap-2 bg-slate-100 rounded-xl p-1 border border-slate-200">
        <button @click="viewMode = 'grid'" class="p-1.5 rounded-lg transition-colors" :class="viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'">
          <LayoutGrid class="w-4 h-4" />
        </button>
        <button @click="viewMode = 'list'" class="p-1.5 rounded-lg transition-colors" :class="viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'">
          <List class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Content Area: Grid View -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in products" :key="item.id" class="glass-panel overflow-hidden group hover:border-slate-300 transition-colors">
        <div class="h-48 bg-slate-100 relative overflow-hidden">
          <img v-if="item.image_url" :src="item.image_url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div v-else class="absolute inset-0 flex items-center justify-center text-slate-600">
            <ImageIcon class="w-12 h-12" />
          </div>
          <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openModal(item)" class="p-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"><Edit2 class="w-4 h-4"/></button>
            <button @click="handleDelete(item.id)" class="p-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:text-rose-600 hover:bg-slate-50 transition-colors"><Trash2 class="w-4 h-4"/></button>
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-lg text-slate-900 truncate">{{ item.name }}</h3>
            <span class="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 uppercase tracking-wide">{{ item.categoryName }}</span>
          </div>
          <p class="text-sm text-slate-500 line-clamp-2 mb-4">{{ item.description }}</p>
          <a v-if="item.external_link" :href="item.external_link" target="_blank" class="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1">
            <ExternalLink class="w-3 h-3" /> View External Link
          </a>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal (Simplified for brevity) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" v-motion-fade>
      <div class="absolute inset-0 bg-slate-900/40" @click="closeModal"></div>
      
      <div class="glass-panel w-full max-w-lg relative z-10 p-6" v-motion-slide-visible-bottom>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Product' : 'Add Product' }}</h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-700"><X class="w-5 h-5" /></button>
        </div>
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div><label class="block text-sm text-slate-600 mb-1">Name</label><input v-model="form.name" type="text" class="input-field"></div>
          <div><label class="block text-sm text-slate-600 mb-1">Description</label><textarea v-model="form.description" rows="3" class="input-field"></textarea></div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-slate-600 mb-1">Category</label>
              <select v-model="form.categoryId" class="input-field" required>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div><label class="block text-sm text-slate-600 mb-1">External Link</label><input v-model="form.external_link" type="url" class="input-field" placeholder="https://..."></div>
          </div>
          <div>
            <label class="block text-sm text-slate-600 mb-1">Image</label>
            <input type="file" accept="image/*" class="input-field py-2" @change="handleImageUpload">
            <p v-if="form.imageFileName" class="mt-2 text-xs text-slate-400">{{ form.imageFileName }}</p>
          </div>
          <button type="submit" class="w-full btn-primary py-2 mt-4">Save Product</button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Search, LayoutGrid, List, Edit2, Trash2, X, ExternalLink, Image as ImageIcon } from 'lucide-vue-next'

const viewMode = ref('grid')
const { products, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()
const { categories, fetchCategories } = useCategories()

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories()])
})

const isModalOpen = ref(false)
const form = ref({})

const openModal = (item = null) => {
  form.value = item ? {
    ...item,
    imageFile: null,
    imageFileName: ''
  } : {
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
const closeModal = () => isModalOpen.value = false

const handleImageUpload = async (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.imageFile = file
    form.value.imageFileName = file.name
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
  if(confirm('Delete this product?')) {
    await deleteProduct(id)
  }
}
</script>
