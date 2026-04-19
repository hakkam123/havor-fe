<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Media</p>
          <h1 class="admin-title">Hero Banners</h1>
          <p class="admin-copy">Organize banner visuals for each landing page with a cleaner media-first dashboard layout.</p>
        </div>

        <button @click="openModal()" class="admin-primary-btn">
          <Upload class="h-4 w-4" />
          Upload New Banner
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

    <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="banner in banners" :key="banner.id" class="admin-panel overflow-hidden">
        <div class="relative">
          <div class="absolute left-4 top-4 z-10">
            <span class="admin-badge">{{ banner.page_name }}</span>
          </div>

          <div class="flex h-60 items-center justify-center overflow-hidden bg-[var(--admin-surface-soft)]">
            <video v-if="banner.media_type === 'video'" :src="banner.media_url" class="h-full w-full object-cover" controls></video>
            <img v-else :src="banner.media_url || 'https://via.placeholder.com/600x300'" class="h-full w-full object-cover" >
          </div>
        </div>

        <div class="space-y-4 p-5">
          <div>
            <p class="text-lg font-semibold text-slate-900">{{ banner.title }}</p>
            <p class="mt-2 text-sm leading-6 text-slate-500">{{ banner.subtitle || 'No subtitle provided.' }}</p>
          </div>

          <div class="flex items-center justify-between gap-3 border-t border-[var(--admin-border)] pt-4">
            <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <BadgeInfo class="h-4 w-4" />
              {{ banner.media_type }}
            </div>
            <div class="flex items-center gap-2">
              <button @click="openModal(banner)" class="admin-icon-btn">
                <Edit2 class="h-4 w-4" />
              </button>
              <button @click="handleDelete(banner.id)" class="admin-icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-950/40" @click="closeModal"></div>

      <div class="admin-modal-card max-w-xl" v-motion-slide-visible-bottom>
        <div class="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
          <div>
            <p class="admin-kicker">Media Form</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Banner' : 'Create Banner' }}</h2>
          </div>
          <button @click="closeModal" class="admin-icon-btn">
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
          <form @submit.prevent="saveBanner" class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Page Name</label>
              <input v-model="form.page_name" type="text" class="admin-input" placeholder="home">
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Title</label>
              <input v-model="form.title" type="text" class="admin-input">
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Subtitle</label>
              <textarea v-model="form.subtitle" rows="3" class="admin-textarea"></textarea>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Media Type</label>
              <select v-model="form.media_type" class="admin-select">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Upload File</label>
              <input type="file" accept="image/*,video/*" class="admin-input py-2" @change="handleMediaUpload">
              <p v-if="form.mediaFileName" class="mt-2 text-xs text-slate-500">{{ form.mediaFileName }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Or Existing Media URL</label>
              <input v-model="form.media_url" type="text" class="admin-input" placeholder="/uploads/banners/home-banner.jpg">
            </div>
          </form>
        </div>

        <div class="flex justify-end gap-3 border-t border-[var(--admin-border)] px-6 py-4">
          <button @click="closeModal" class="admin-secondary-btn">Cancel</button>
          <button @click="saveBanner" class="admin-primary-btn">Save Banner</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { BadgeInfo, Edit2, Trash2, Upload, X } from 'lucide-vue-next'

const { banners, fetchBanners, createBanner, updateBanner, deleteBanner } = useBanners()
const isModalOpen = ref(false)
const form = ref({
  id: null,
  page_name: '',
  title: '',
  subtitle: '',
  media_type: 'image',
  media_url: '',
  mediaFile: null,
  mediaFileName: ''
})

const stats = computed(() => [
  { label: 'Total Banners', value: banners.value.length, meta: 'Media items in workspace' },
  { label: 'Image Banners', value: banners.value.filter((item) => item.media_type === 'image').length, meta: 'Static hero visuals' },
  { label: 'Video Banners', value: banners.value.filter((item) => item.media_type === 'video').length, meta: 'Motion hero visuals' },
  { label: 'Pages Covered', value: new Set(banners.value.map((item) => item.page_name).filter(Boolean)).size, meta: 'Distinct banner destinations' }
])

onMounted(() => {
  fetchBanners()
})

const openModal = (item = null) => {
  form.value = item
    ? {
      ...item,
      mediaFile: null,
      mediaFileName: ''
    }
    : {
      id: null,
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
  if (form.value.id) {
    await updateBanner(form.value.id, form.value)
  } else {
    await createBanner(form.value)
  }
  closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Delete this banner?')) {
    await deleteBanner(id)
  }
}
</script>
