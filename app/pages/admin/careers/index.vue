<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Hiring</p>
          <h1 class="admin-title">Careers</h1>
          <p class="admin-copy">Manage open positions, publishing status, hiring details, and role requirements in one clean hiring board.</p>
        </div>

        <button @click="openModal()" class="admin-primary-btn">
          <Plus class="h-4 w-4" />
          Create Position
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
          <input v-model="searchQuery" type="text" placeholder="Search title, team, location..." class="admin-input pl-11">
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredCareers.length }} entries</div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Team</th>
              <th>Location</th>
              <th>Status</th>
              <th>Posted</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCareers" :key="item.id || item.slug">
              <td>
                <div>
                  <p class="font-semibold text-slate-900">{{ item.title }}</p>
                  <p class="text-xs text-slate-400">/{{ item.slug }}</p>
                </div>
              </td>
              <td>{{ item.team }}</td>
              <td>{{ item.location }}</td>
              <td>
                <span class="admin-status" :class="item.is_published ? 'admin-status-success' : 'admin-status-warning'">
                  {{ item.is_published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="text-slate-400">{{ formatDate(item.postedAt || item.createdAt) }}</td>
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
            <tr v-if="!filteredCareers.length">
              <td colspan="6" class="admin-empty-state">No career positions found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-950/40" @click="closeModal" />

      <div class="admin-modal-card max-w-5xl" v-motion-slide-visible-bottom>
        <div class="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
          <div>
            <p class="admin-kicker">Hiring Form</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Position' : 'Create Position' }}</h2>
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
                  <input v-model="form.title" @input="generateSlug" type="text" required class="admin-input" placeholder="Senior Frontend Engineer">
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Slug</label>
                  <input v-model="form.slug" type="text" class="admin-input bg-slate-50 text-slate-500" readonly>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Summary <span class="text-rose-500">*</span></label>
                  <textarea v-model="form.summary" rows="3" required class="admin-textarea" placeholder="Short listing summary"></textarea>
                </div>
              </div>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-600">Team</label>
                    <input v-model="form.team" type="text" class="admin-input" placeholder="Engineering">
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-600">Level</label>
                    <select v-model="form.level" class="admin-select">
                      <option>Junior</option>
                      <option>Mid</option>
                      <option>Senior</option>
                      <option>Lead</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-600">Location</label>
                    <input v-model="form.location" type="text" class="admin-input" placeholder="Jakarta / Hybrid">
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-600">Type</label>
                    <select v-model="form.type" class="admin-select">
                      <option>Full-Time</option>
                      <option>Contract</option>
                      <option>Part-Time</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-600">Posted Date</label>
                    <input v-model="form.postedAt" type="date" class="admin-input">
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-600">Publish Status</label>
                    <select v-model="form.is_published" class="admin-select">
                      <option :value="1">Published</option>
                      <option :value="0">Draft</option>
                    </select>
                  </div>
                </div>
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

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Responsibilities</label>
                <textarea
                  v-model="responsibilitiesText"
                  rows="6"
                  class="admin-textarea"
                  placeholder="One item per line"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Requirements</label>
                <textarea
                  v-model="requirementsText"
                  rows="6"
                  class="admin-textarea"
                  placeholder="One item per line"
                />
              </div>
            </div>
          </form>
        </div>

        <div class="flex justify-end gap-3 border-t border-[var(--admin-border)] px-6 py-4">
          <button @click="closeModal" class="admin-secondary-btn">Cancel</button>
          <button @click="saveForm" class="admin-primary-btn">Save Position</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Edit2, Plus, Search, Trash2, X } from 'lucide-vue-next'
import Editor from '@tinymce/tinymce-vue'

const { careers, fetchCareers, createCareer, updateCareer, deleteCareer } = useAdminCareers()

const isModalOpen = ref(false)
const searchQuery = ref('')
const responsibilitiesText = ref('')
const requirementsText = ref('')

const initialForm = () => ({
  id: null,
  title: '',
  slug: '',
  team: 'Engineering',
  level: 'Mid',
  location: 'Jakarta / Hybrid',
  type: 'Full-Time',
  summary: '',
  description: '',
  postedAt: new Date().toISOString().slice(0, 10),
  is_published: 1,
  responsibilities: [],
  requirements: []
})

const form = ref(initialForm())

const editorConfig = {
  height: 320,
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

const filteredCareers = computed(() => {
  if (!searchQuery.value) return careers.value

  const query = searchQuery.value.toLowerCase()
  return careers.value.filter((item) =>
    [item.title, item.slug, item.team, item.location, item.level, item.type]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Open Roles', value: careers.value.length, meta: 'Positions stored in workspace' },
  { label: 'Published', value: careers.value.filter((item) => item.is_published).length, meta: 'Live on careers page' },
  { label: 'Drafts', value: careers.value.filter((item) => !item.is_published).length, meta: 'Waiting for approval' },
  { label: 'Teams', value: new Set(careers.value.map((item) => item.team).filter(Boolean)).size, meta: 'Distinct hiring groups' }
])

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}

const generateSlug = () => {
  form.value.slug = form.value.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const toLines = (items = []) => items.join('\n')

const parseLines = (value = '') =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)

const openModal = (item = null) => {
  if (item) {
    form.value = {
      ...initialForm(),
      ...item,
      postedAt: item.postedAt ? String(item.postedAt).slice(0, 10) : new Date().toISOString().slice(0, 10)
    }
    responsibilitiesText.value = toLines(item.responsibilities || [])
    requirementsText.value = toLines(item.requirements || [])
  } else {
    form.value = initialForm()
    responsibilitiesText.value = ''
    requirementsText.value = ''
  }

  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveForm = async () => {
  form.value.responsibilities = parseLines(responsibilitiesText.value)
  form.value.requirements = parseLines(requirementsText.value)

  if (form.value.id) {
    await updateCareer(form.value.id, form.value)
  } else {
    await createCareer(form.value)
  }

  closeModal()
}

const handleDelete = async (id) => {
  if (!id) return

  if (confirm('Delete this career position?')) {
    await deleteCareer(id)
  }
}

onMounted(() => {
  fetchCareers()
})
</script>
