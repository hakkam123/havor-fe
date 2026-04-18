<template>
  <div class="space-y-6" v-motion-fade-up>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 mb-1">Careers</h1>
        <p class="text-slate-500 text-sm">Manage open positions and publishing status.</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" />
        <span>Create Position</span>
      </button>
    </div>

    <div class="glass-panel overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
        <div class="relative max-w-sm w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search careers..."
            class="input-field pl-10 h-10 w-full text-sm"
          >
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium tracking-wider">Position</th>
              <th class="px-6 py-4 font-medium tracking-wider">Team</th>
              <th class="px-6 py-4 font-medium tracking-wider">Location</th>
              <th class="px-6 py-4 font-medium tracking-wider">Status</th>
              <th class="px-6 py-4 font-medium tracking-wider">Posted</th>
              <th class="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in filteredCareers" :key="item.id || item.slug" class="hover:bg-slate-50 transition-colors duration-150">
              <td class="px-6 py-4">
                <div>
                  <div class="font-medium text-slate-900">{{ item.title }}</div>
                  <div class="text-xs text-slate-500">/{{ item.slug }}</div>
                </div>
              </td>
              <td class="px-6 py-4">{{ item.team }}</td>
              <td class="px-6 py-4">{{ item.location }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full" :class="item.is_published ? 'bg-emerald-500' : 'bg-amber-500'" />
                  {{ item.is_published ? 'Published' : 'Draft' }}
                </div>
              </td>
              <td class="px-6 py-4 text-slate-400">{{ formatDate(item.postedAt || item.createdAt) }}</td>
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
            <tr v-if="!filteredCareers.length">
              <td colspan="6" class="px-6 py-8 text-center text-slate-400">No career positions found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
        <div>Showing {{ filteredCareers.length }} entries</div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-900/40" @click="closeModal" />

      <div class="glass-panel w-full max-w-5xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden" v-motion-slide-visible-bottom>
        <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 class="text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Position' : 'Create Position' }}</h2>
          <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form @submit.prevent="saveForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1">Title <span class="text-rose-500">*</span></label>
                  <input v-model="form.title" @input="generateSlug" type="text" required class="input-field" placeholder="Senior Frontend Engineer">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1">Slug</label>
                  <input v-model="form.slug" type="text" class="input-field bg-slate-50 text-slate-500" readonly>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1">Summary <span class="text-rose-500">*</span></label>
                  <textarea v-model="form.summary" rows="3" required class="input-field" placeholder="Short listing summary"></textarea>
                </div>
              </div>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-600 mb-1">Team</label>
                    <input v-model="form.team" type="text" class="input-field" placeholder="Engineering">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600 mb-1">Level</label>
                    <select v-model="form.level" class="input-field py-2.5">
                      <option>Junior</option>
                      <option>Mid</option>
                      <option>Senior</option>
                      <option>Lead</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-600 mb-1">Location</label>
                    <input v-model="form.location" type="text" class="input-field" placeholder="Jakarta / Hybrid">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600 mb-1">Type</label>
                    <select v-model="form.type" class="input-field py-2.5">
                      <option>Full-Time</option>
                      <option>Contract</option>
                      <option>Part-Time</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-600 mb-1">Posted Date</label>
                    <input v-model="form.postedAt" type="date" class="input-field">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600 mb-1">Publish Status</label>
                    <select v-model="form.is_published" class="input-field py-2.5">
                      <option :value="1">Published</option>
                      <option :value="0">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-2">Description <span class="text-rose-500">*</span></label>
              <div class="border border-slate-200 rounded-lg overflow-hidden bg-white h-[320px]">
                <Editor
                  api-key="88silew48dnac4zpntprubmilq8z9lqfe5by76mvrkvas4nt"
                  v-model="form.description"
                  :init="{
                    height: 320,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help',
                    content_style: 'body { font-family: Nunito Sans, sans-serif; font-size: 14px; color: #0f172a; }'
                  }"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Responsibilities</label>
                <textarea
                  v-model="responsibilitiesText"
                  rows="6"
                  class="input-field"
                  placeholder="One item per line"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Requirements</label>
                <textarea
                  v-model="requirementsText"
                  rows="6"
                  class="input-field"
                  placeholder="One item per line"
                />
              </div>
            </div>
          </form>
        </div>

        <div class="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium">Cancel</button>
          <button @click="saveForm" class="btn-primary py-2 text-sm">Save Position</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-vue-next'
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

const filteredCareers = computed(() => {
  if (!searchQuery.value) return careers.value

  const query = searchQuery.value.toLowerCase()
  return careers.value.filter((item) =>
    [item.title, item.slug, item.team, item.location, item.level, item.type]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

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
