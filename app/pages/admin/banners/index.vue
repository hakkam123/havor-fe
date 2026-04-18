<template>
  <div class="space-y-6" v-motion-fade-up>
    <div class="flex items-center justify-between glass-panel p-6">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 mb-1">Hero Banners</h1>
        <p class="text-slate-500 text-sm">Manage dynamic hero banners for pages.</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2">
        <Upload class="w-4 h-4" />
        <span>Upload New Banner</span>
      </button>
    </div>

    <!-- Media Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="banner in banners" :key="banner.id" class="glass-panel overflow-hidden relative group">
        <div class="absolute top-3 left-3 z-10 px-2 py-1 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">
          {{ banner.page_name }}
        </div>
        
        <div class="h-56 bg-slate-100 relative flex items-center justify-center overflow-hidden">
          <video v-if="banner.media_type === 'video'" :src="banner.media_url" class="w-full h-full object-cover" controls></video>
          <img v-else :src="banner.media_url || 'https://via.placeholder.com/600x300'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          
          <div class="absolute inset-x-0 bottom-0 p-4 bg-white/92 border-t border-slate-200">
            <h3 class="text-lg font-semibold text-slate-900">{{ banner.title }}</h3>
            <p class="text-sm text-slate-500">{{ banner.subtitle }}</p>
          </div>
        </div>
        
        <div class="p-4 border-t border-slate-200 flex justify-between items-center bg-white">
          <div class="text-xs text-slate-500 flex items-center gap-1">
            <BadgeInfo class="w-4 h-4" /> {{ banner.media_type.toUpperCase() }}
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 bg-white text-slate-500 hover:text-slate-700 rounded-lg border border-slate-200 transition-colors"><Edit2 class="w-4 h-4"/></button>
            <button @click="handleDelete(banner.id)" class="p-2 bg-white text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors"><Trash2 class="w-4 h-4"/></button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" v-motion-fade>
      <div class="absolute inset-0 bg-slate-900/40" @click="closeModal"></div>

      <div class="glass-panel w-full max-w-xl relative z-10 p-6" v-motion-slide-visible-bottom>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-slate-900">Create Banner</h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-700"><X class="w-5 h-5" /></button>
        </div>

        <form @submit.prevent="saveBanner" class="space-y-4">
          <div><label class="block text-sm text-slate-600 mb-1">Page Name</label><input v-model="form.page_name" type="text" class="input-field" placeholder="home"></div>
          <div><label class="block text-sm text-slate-600 mb-1">Title</label><input v-model="form.title" type="text" class="input-field"></div>
          <div><label class="block text-sm text-slate-600 mb-1">Subtitle</label><textarea v-model="form.subtitle" rows="3" class="input-field"></textarea></div>
          <div>
            <label class="block text-sm text-slate-600 mb-1">Media Type</label>
            <select v-model="form.media_type" class="input-field">
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-slate-600 mb-1">Upload File</label>
            <input type="file" accept="image/*,video/*" class="input-field py-2" @change="handleMediaUpload">
            <p v-if="form.mediaFileName" class="mt-2 text-xs text-slate-400">{{ form.mediaFileName }}</p>
          </div>
          <div>
            <label class="block text-sm text-slate-600 mb-1">Or Existing Media URL</label>
            <input v-model="form.media_url" type="text" class="input-field" placeholder="/uploads/banners/home-banner.jpg">
          </div>
          <button type="submit" class="w-full btn-primary py-2">Save Banner</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Upload, Edit2, Trash2, BadgeInfo, X } from 'lucide-vue-next'

const { banners, fetchBanners, createBanner, deleteBanner } = useBanners()
const isModalOpen = ref(false)
const form = ref({
  page_name: '',
  title: '',
  subtitle: '',
  media_type: 'image',
  media_url: '',
  mediaFile: null,
  mediaFileName: ''
})

onMounted(() => {
  fetchBanners()
})

const openModal = () => {
  form.value = {
    page_name: '',
    title: '',
    subtitle: '',
    media_type: 'image',
    media_url: '',
    mediaFile: null,
    mediaFileName: ''
  }

  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleMediaUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.mediaFile = file
    form.value.mediaFileName = file.name
  }
}

const saveBanner = async () => {
  await createBanner(form.value)
  closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Delete this banner?')) {
    await deleteBanner(id)
  }
}
</script>
