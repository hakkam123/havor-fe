<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Editorial</p>
          <h1 class="admin-title">News & Blog</h1>
          <p class="admin-copy">Manage articles, announcements, publication status, and featured visuals from a unified editorial view.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button class="admin-secondary-btn">
            <Download class="h-4 w-4" />
            Export
          </button>
          <button @click="openModal()" class="admin-primary-btn">
            <Plus class="h-4 w-4" />
            Create News
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
            <input v-model="searchQuery" type="text" placeholder="Search title, slug, or category..." class="admin-input pl-11">
          </div>
          <button class="admin-secondary-btn py-2 text-xs">
            <Filter class="h-4 w-4" />
            All Status
          </button>
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredNews.length }} entries</div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title & Slug</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredNews" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
                    <img v-if="item.image_url" :src="item.image_url" class="h-full w-full object-cover" >
                    <ImageIcon v-else class="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ item.title }}</p>
                    <p class="text-xs text-slate-400">{{ item.slug }}</p>
                  </div>
                </div>
              </td>
              <td><span class="admin-badge">{{ item.category }}</span></td>
              <td>
                <span class="admin-status" :class="item.is_published ? 'admin-status-success' : 'admin-status-warning'">
                  {{ item.is_published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="text-slate-400">{{ formatDate(item.createdAt) }}</td>
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
            <tr v-if="!filteredNews.length">
              <td colspan="5" class="admin-empty-state">No news entries found.</td>
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
            <p class="admin-kicker">Editorial Form</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ form.id ? 'Edit News' : 'Create News' }}</h2>
          </div>
          <button @click="closeModal" class="admin-icon-btn">
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
          <form @submit.prevent="saveForm" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Title <span class="text-rose-500">*</span></label>
                  <input v-model="form.title" @input="generateSlug" type="text" required class="admin-input" placeholder="Enter article title">
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Slug</label>
                  <input v-model="form.slug" type="text" class="admin-input bg-slate-50 text-slate-500" readonly>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-600">Category</label>
                    <select v-model="form.category" class="admin-select">
                      <option value="Technology">Technology</option>
                      <option value="Company">Company Updates</option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-600">Publish Status</label>
                    <select v-model="form.is_published" class="admin-select">
                      <option :value="true">Published</option>
                      <option :value="false">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Featured Image</label>
                <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
                  <div v-if="form.image_url" class="absolute inset-0">
                    <img :src="form.image_url" class="h-full w-full object-cover" >
                    <div class="absolute inset-0 flex items-center justify-center bg-white/75 opacity-0 transition group-hover:opacity-100"></div>
                  </div>
                  <div v-else class="text-center">
                    <Upload class="mx-auto h-8 w-8 text-slate-400" />
                    <p class="mt-3 text-sm text-slate-500">Click or drag image here</p>
                  </div>
                  <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/*" @change="handleFileUpload">
                </div>
                <p v-if="form.imageFileName" class="mt-2 text-xs text-slate-500">{{ form.imageFileName }}</p>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Content <span class="text-rose-500">*</span></label>
              <div class="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-white">
                <Editor
                  api-key="88silew48dnac4zpntprubmilq8z9lqfe5by76mvrkvas4nt"
                  v-model="form.content"
                  :init="editorConfig"
                />
              </div>
            </div>
          </form>
        </div>

        <div class="flex justify-end gap-3 border-t border-[var(--admin-border)] px-6 py-4">
          <button @click="closeModal" class="admin-secondary-btn">Cancel</button>
          <button @click="saveForm" class="admin-primary-btn">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Download, Edit2, Filter, Image as ImageIcon, Plus, Search, Trash2, Upload, X } from 'lucide-vue-next'
import Editor from '@tinymce/tinymce-vue'

const { news: newsItems, fetchNews, createNews, updateNews, deleteNews } = useNews({ includeDrafts: true })

const isModalOpen = ref(false)
const searchQuery = ref('')
const form = ref({
  id: null,
  title: '',
  slug: '',
  category: 'Technology',
  is_published: true,
  image_url: null,
  imageFile: null,
  imageFileName: '',
  content: ''
})

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

const filteredNews = computed(() => {
  if (!searchQuery.value) return newsItems.value

  const query = searchQuery.value.toLowerCase()
  return newsItems.value.filter((item) =>
    [item.title, item.slug, item.category]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Total Articles', value: newsItems.value.length, meta: 'Editorial entries in workspace' },
  { label: 'Published', value: newsItems.value.filter((item) => item.is_published).length, meta: 'Live on the website' },
  { label: 'Drafts', value: newsItems.value.filter((item) => !item.is_published).length, meta: 'Waiting for approval' },
  { label: 'With Image', value: newsItems.value.filter((item) => item.image_url).length, meta: 'Ready for feature placement' }
])

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}

const openModal = (item = null) => {
  if (item) {
    form.value = {
      ...item,
      imageFile: null,
      imageFileName: ''
    }
  } else {
    form.value = {
      id: null,
      title: '',
      slug: '',
      category: 'Technology',
      is_published: true,
      image_url: null,
      imageFile: null,
      imageFileName: '',
      content: ''
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const generateSlug = () => {
  form.value.slug = form.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

const handleFileUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.imageFile = file
    form.value.imageFileName = file.name
    form.value.image_url = URL.createObjectURL(file)
  }
}

const saveForm = async () => {
  if (form.value.id) {
    await updateNews(form.value.id, form.value)
  } else {
    await createNews(form.value)
  }

  closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Delete this news item?')) {
    await deleteNews(id)
  }
}

onMounted(() => {
  fetchNews()
})
</script>
