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
                  <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
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
                  <button @click="openModal(item)" class="admin-icon-btn" :aria-label="`Edit ${item.name}`">
                    <Edit2 class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(item.id)" class="admin-icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600" :aria-label="`Delete ${item.name}`">
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

    <AdminModal
      v-model="isModalOpen"
      kicker="Capabilities Form"
      :title="form.id ? 'Edit Expertise' : 'Create Expertise'"
      max-width-class="max-w-4xl"
      :can-close="!isSaving"
    >
      <form @submit.prevent="saveExpertiseItem" class="space-y-6">
        <div v-if="formError" class="rounded-[12px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ formError }}
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Name <span class="text-rose-500">*</span></label>
              <input v-model="form.name" type="text" required class="admin-input" placeholder="Expertise name" :aria-invalid="Boolean(fieldErrors.name)">
              <p v-if="fieldErrors.name" class="mt-1 text-sm text-rose-600">{{ fieldErrors.name }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Slug</label>
              <input :value="toSlug(form.name)" type="text" class="admin-input bg-slate-50 text-slate-500" readonly>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600">Icon File</label>
            <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
              <div v-if="form.icon_url" class="absolute inset-0 flex items-center justify-center bg-white">
                <img :src="form.icon_url" class="h-16 w-16 object-contain" >
              </div>
              <div v-else class="text-center">
                <Upload class="mx-auto h-8 w-8 text-slate-400" />
                <p class="mt-3 text-sm text-slate-500">Click or drag icon here</p>
              </div>
              <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp" aria-label="Upload expertise icon" @change="handleIconUpload">
            </div>
            <p v-if="form.iconFileName" class="mt-2 text-xs text-slate-500">{{ form.iconFileName }}</p>
            <p v-if="fieldErrors.icon_url" class="mt-1 text-sm text-rose-600">{{ fieldErrors.icon_url }}</p>
          </div>
          <p v-if="fieldErrors.description" class="mt-1 text-sm text-rose-600">{{ fieldErrors.description }}</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Description <span class="text-rose-500">*</span></label>
          <div class="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-white">
            <Editor
              api-key="88silew48dnac4zpntprubmilq8z9lqfe5by76mvrkvas4nt"
              v-model="form.description"
              :init="editorConfig"
            />
          </div>
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" :disabled="isSaving" class="admin-secondary-btn">Cancel</button>
        <button @click="saveExpertiseItem" :disabled="isSaving" class="admin-primary-btn">
          {{ isSaving ? 'Saving...' : 'Save Expertise' }}
        </button>
      </template>
    </AdminModal>

    <AdminSuccessModal
      v-model="successState.open"
      :title="successState.title"
      :message="successState.message"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Cpu, Edit2, Plus, Search, ShieldCheck, Smartphone, Star, Trash2, Upload, Wifi } from 'lucide-vue-next'
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
const isSaving = ref(false)
const formError = ref('')
const fieldErrors = ref({})
const successState = ref({
  open: false,
  title: '',
  message: ''
})
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
  content_css: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
  content_style: 'body { font-family: Poppins, sans-serif; font-size: 14px; color: #0f172a; }'
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
  if (isSaving.value) return
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
  formError.value = ''
  fieldErrors.value = {}
  const errors = {}
  if (!form.value.name?.trim()) errors.name = 'Expertise name is required.'
  if (!stripHtml(form.value.description).trim()) errors.description = 'Description is required.'
  if (!isSupportedImageFile(form.value.iconFile)) errors.icon_url = 'Icon must be a JPG, PNG, or WEBP file.'
  if (Object.keys(errors).length) {
    fieldErrors.value = errors
    formError.value = 'Please fix the highlighted fields before saving.'
    return
  }

  isSaving.value = true

  try {
    const isEditing = Boolean(form.value.id)

    if (isEditing) {
      await updateExpertise(form.value.id, form.value)
    } else {
      await createExpertise(form.value)
    }

    isModalOpen.value = false
    successState.value = {
      open: true,
      title: isEditing ? 'Expertise updated' : 'Expertise created',
      message: isEditing
        ? 'The expertise item has been updated successfully.'
        : 'The new expertise item has been added successfully.'
    }
  } catch (error) {
    fieldErrors.value = getApiFieldErrors(error)
    formError.value = getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (id) => {
  if (confirm('Delete this expertise?')) {
    await deleteExpertise(id)
  }
}
</script>
