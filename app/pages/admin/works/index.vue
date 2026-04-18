<template>
  <div class="space-y-6" v-motion-fade-up>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 mb-1">Portfolio Works</h1>
        <p class="text-slate-500 text-sm">Manage projects and client showcases.</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" />
        <span>Add Work</span>
      </button>
    </div>

    <div class="glass-panel overflow-hidden p-6">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="text-xs uppercase text-slate-400 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3">Project Title</th>
            <th class="px-4 py-3">Client</th>
            <th class="px-4 py-3">Year</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="item in works" :key="item.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 font-medium text-slate-900">{{ item.title }}</td>
            <td class="px-4 py-3">{{ item.client }}</td>
            <td class="px-4 py-3 text-slate-500">{{ item.year }}</td>
            <td class="px-4 py-3"><span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{{ item.categoryName }}</span></td>
            <td class="px-4 py-3 text-right">
              <button @click="openModal(item)" class="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"><Edit2 class="w-4 h-4"/></button>
              <button @click="handleDelete(item.id)" class="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 class="w-4 h-4"/></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" v-motion-fade>
      <div class="absolute inset-0 bg-slate-900/40" @click="closeModal"></div>

      <div class="glass-panel w-full max-w-2xl relative z-10 p-6" v-motion-slide-visible-bottom>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Work' : 'Add Work' }}</h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-700"><X class="w-5 h-5" /></button>
        </div>

        <form @submit.prevent="saveWork" class="space-y-4">
          <div><label class="block text-sm text-slate-600 mb-1">Title</label><input v-model="form.title" type="text" required class="input-field"></div>
          <div><label class="block text-sm text-slate-600 mb-1">Description</label><textarea v-model="form.description" rows="4" class="input-field"></textarea></div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label class="block text-sm text-slate-600 mb-1">Client</label><input v-model="form.client" type="text" class="input-field"></div>
            <div><label class="block text-sm text-slate-600 mb-1">Year</label><input v-model="form.year" type="number" class="input-field"></div>
            <div>
              <label class="block text-sm text-slate-600 mb-1">Category</label>
              <select v-model="form.categoryId" class="input-field">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm text-slate-600 mb-1">Image</label>
            <input type="file" accept="image/*" class="input-field py-2" @change="handleImageUpload">
            <p v-if="form.imageFileName" class="mt-2 text-xs text-slate-400">{{ form.imageFileName }}</p>
          </div>
          <button type="submit" class="w-full btn-primary py-2">Save Work</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Plus, Edit2, Trash2, X } from 'lucide-vue-next'

const { works, fetchWorks, createWork, updateWork, deleteWork } = useWorks()
const { categories, fetchCategories } = useCategories()
const isModalOpen = ref(false)
const form = ref({})

onMounted(async () => {
  await Promise.all([fetchWorks(), fetchCategories()])
})

const openModal = (item = null) => {
  form.value = item ? {
    ...item,
    imageFile: null,
    imageFileName: ''
  } : {
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
