<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Capabilities</p>
          <h1 class="admin-title">Expertises</h1>
          <p class="admin-copy">Maintain service capabilities, icon assets, and descriptive copy for the service catalog.</p>
        </div>

        <button @click="openModal()" class="admin-primary-btn">
          <Plus class="h-4 w-4" />
          Create Expertise
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
          <input v-model="searchQuery" type="text" placeholder="Search expertise, slug, description..." class="admin-input pl-11">
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredExpertises.length }} entries</div>
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
            <tr v-for="item in filteredExpertises" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
                    <component v-if="hasBuiltinIcon(item.icon_url)" :is="getIcon(item.icon_url)" class="h-5 w-5 text-slate-500" />
                    <img v-else-if="item.icon_url" :src="item.icon_url" :alt="item.name" class="h-5 w-5 object-contain" >
                    <Star v-else class="h-5 w-5 text-slate-400" />
                  </div>
                  <span class="font-semibold text-slate-900">{{ item.name }}</span>
                </div>
              </td>
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
            <tr v-if="!filteredExpertises.length">
              <td colspan="4" class="admin-empty-state">No expertises found.</td>
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
            <p class="admin-kicker">Capabilities Form</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Expertise' : 'Create Expertise' }}</h2>
          </div>
          <button @click="closeModal" class="admin-icon-btn">
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
          <form @submit.prevent="saveExpertiseItem" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Name <span class="text-rose-500">*</span></label>
                  <input v-model="form.name" type="text" required class="admin-input" placeholder="Expertise name">
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Slug</label>
                  <input :value="toSlug(form.name)" type="text" class="admin-input bg-slate-50 text-slate-500" readonly>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Icon File</label>
                <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
                  <div v-if="form.icon_url" class="absolute inset-0 flex items-center justify-center bg-white">
                    <img :src="form.icon_url" class="h-16 w-16 object-contain" >
                  </div>
                  <div v-else class="text-center">
                    <Upload class="mx-auto h-8 w-8 text-slate-400" />
                    <p class="mt-3 text-sm text-slate-500">Click or drag icon here</p>
                  </div>
                  <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/*,.svg" @change="handleIconUpload">
                </div>
                <p v-if="form.iconFileName" class="mt-2 text-xs text-slate-500">{{ form.iconFileName }}</p>
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
          <button @click="saveExpertiseItem" class="admin-primary-btn">Save Expertise</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Cpu, Edit2, Plus, Search, ShieldCheck, Smartphone, Star, Trash2, Upload, Wifi, X } from 'lucide-vue-next'
import Editor from '@tinymce/tinymce-vue'

const iconMap = {
  Cpu,
  Wifi,
  Smartphone,
  ShieldCheck
}

const getIcon = (name) => iconMap[name] || Star
const hasBuiltinIcon = (name) => Boolean(name && iconMap[name])

const { expertise: expertises, fetchExpertise, createExpertise, updateExpertise, deleteExpertise } = useExpertise()

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

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const filteredExpertises = computed(() => {
  if (!searchQuery.value) return expertises.value

  const query = searchQuery.value.toLowerCase()
  return expertises.value.filter((item) =>
    [item.name, item.slug, stripHtml(item.description)]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Total Expertise', value: expertises.value.length, meta: 'Capabilities in the service list' },
  { label: 'With Icon', value: expertises.value.filter((item) => item.icon_url).length, meta: 'Ready for visual display' },
  { label: 'Built-in Icons', value: expertises.value.filter((item) => hasBuiltinIcon(item.icon_url)).length, meta: 'Using existing icon set' },
  { label: 'Search Results', value: filteredExpertises.value.length, meta: 'Current filtered expertise count' }
])

onMounted(() => {
  fetchExpertise()
})

const openModal = (item = null) => {
  form.value = item
    ? {
      ...item,
      iconFile: null,
      iconFileName: ''
    }
    : {
      name: '',
      description: '',
      icon_url: '',
      iconFile: null,
      iconFileName: ''
    }

  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleIconUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.iconFile = file
    form.value.iconFileName = file.name
    form.value.icon_url = URL.createObjectURL(file)
  }
}

const saveExpertiseItem = async () => {
  if (form.value.id) {
    await updateExpertise(form.value.id, form.value)
  } else {
    await createExpertise(form.value)
  }

  closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Delete this expertise?')) {
    await deleteExpertise(id)
  }
}
</script>
