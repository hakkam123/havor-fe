<template>
  <div class="space-y-6" v-motion-fade-up>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 mb-1">Portfolio Works</h1>
        <p class="text-slate-500 text-sm">Manage projects and client showcases.</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" />
        <span>Create Work</span>
      </button>
    </div>

    <div class="glass-panel overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
        <div class="relative max-w-sm w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Search works..." class="input-field pl-10 h-10 w-full text-sm">
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium tracking-wider">Title</th>
              <th class="px-6 py-4 font-medium tracking-wider">Client</th>
              <th class="px-6 py-4 font-medium tracking-wider">Year</th>
              <th class="px-6 py-4 font-medium tracking-wider">Category</th>
              <th class="px-6 py-4 font-medium tracking-wider">Description</th>
              <th class="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in filteredWorks" :key="item.id" class="hover:bg-slate-50 transition-colors duration-150">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                    <img v-if="item.image_url" :src="item.image_url" class="w-full h-full object-cover" />
                    <ImageIcon v-else class="w-5 h-5 m-auto mt-2 text-slate-400" />
                  </div>
                  <div>
                    <div class="font-medium text-slate-900">{{ item.title }}</div>
                    <div class="text-xs text-slate-500">/{{ item.slug }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">{{ item.client || '-' }}</td>
              <td class="px-6 py-4">{{ item.year || '-' }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">{{ item.categoryName || '-' }}</span>
              </td>
              <td class="px-6 py-4 text-slate-500 max-w-[320px] truncate">{{ stripHtml(item.description) || '-' }}</td>
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
            <tr v-if="!filteredWorks.length">
              <td colspan="6" class="px-6 py-8 text-center text-slate-400">No works found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
        <div>Showing {{ filteredWorks.length }} entries</div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-900/40" @click="closeModal"></div>

      <div class="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden" v-motion-slide-visible-bottom>
        <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 class="text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Work' : 'Create Work' }}</h2>
          <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form @submit.prevent="saveWork" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1">Title <span class="text-rose-500">*</span></label>
                  <input v-model="form.title" type="text" required class="input-field" placeholder="Project title">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-600 mb-1">Client</label>
                    <input v-model="form.client" type="text" class="input-field" placeholder="Client name">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600 mb-1">Year</label>
                    <input v-model="form.year" type="number" class="input-field" placeholder="2026">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1">Category <span class="text-rose-500">*</span></label>
                  <select v-model="form.categoryId" class="input-field py-2.5" required>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Image</label>
                <div class="border-2 border-dashed border-slate-300 rounded-xl p-4 h-[190px] flex flex-col items-center justify-center hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden group">
                  <div v-if="form.image_url" class="absolute inset-0">
                    <img :src="form.image_url" class="w-full h-full object-cover">
                  </div>
                  <div v-else class="text-center">
                    <Upload class="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-slate-600 transition-colors" />
                    <p class="text-sm text-slate-500 group-hover:text-slate-700">Click or drag image here</p>
                  </div>
                  <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" @change="handleImageUpload">
                </div>
                <p v-if="form.imageFileName" class="mt-2 text-xs text-slate-500">{{ form.imageFileName }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-2">Description <span class="text-rose-500">*</span></label>
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
          <button @click="saveWork" class="btn-primary py-2 text-sm">Save Work</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Plus, Search, Edit2, Trash2, X, Upload, Image as ImageIcon } from 'lucide-vue-next'
import Editor from '@tinymce/tinymce-vue'

const { works, fetchWorks, createWork, updateWork, deleteWork } = useWorks()
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

const filteredWorks = computed(() => {
  if (!searchQuery.value) return works.value

  const query = searchQuery.value.toLowerCase()
  return works.value.filter((item) =>
    [item.title, item.client, item.categoryName, stripHtml(item.description)]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

onMounted(async () => {
  await Promise.all([fetchWorks(), fetchCategories()])
})

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
  if (form.value.id) {
    await updateWork(form.value.id, form.value)
  } else {
    await createWork(form.value)
  }

  closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Delete this work item?')) {
    await deleteWork(id)
  }
}
</script>
