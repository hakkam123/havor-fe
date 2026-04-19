<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Trust Signals</p>
          <h1 class="admin-title">Clients</h1>
          <p class="admin-copy">Add, edit, and remove the client logos shown in the landing page “Trusted by” section.</p>
        </div>

        <button @click="openModal()" class="admin-primary-btn">
          <Plus class="h-4 w-4" />
          Add Client
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
          <input v-model="searchQuery" type="text" placeholder="Search client name or URL..." class="admin-input pl-11">
        </div>
        <div class="text-sm text-slate-500">Showing {{ filteredClients.length }} entries</div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Website</th>
              <th>Logo Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredClients" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-2">
                    <img v-if="item.logo_url" :src="item.logo_url" :alt="item.name" class="max-h-full max-w-full object-contain">
                    <Building2 v-else class="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">Client ID {{ item.id }}</p>
                  </div>
                </div>
              </td>
              <td>
                <a
                  v-if="item.external_link"
                  :href="item.external_link"
                  target="_blank"
                  class="inline-flex items-center gap-2 font-medium text-slate-700 transition hover:text-slate-950"
                >
                  <ExternalLink class="h-4 w-4" />
                  Visit
                </a>
                <span v-else class="text-slate-400">-</span>
              </td>
              <td>
                <span class="admin-status" :class="item.logo_url ? 'admin-status-success' : 'admin-status-warning'">
                  {{ item.logo_url ? 'Ready' : 'No Logo' }}
                </span>
              </td>
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
            <tr v-if="!filteredClients.length">
              <td colspan="4" class="admin-empty-state">No clients found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" v-motion-fade>
      <div class="absolute inset-0 bg-slate-950/40" @click="closeModal"></div>

      <div class="admin-modal-card max-w-3xl" v-motion-slide-visible-bottom>
        <div class="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
          <div>
            <p class="admin-kicker">Client Form</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Client' : 'Add Client' }}</h2>
          </div>
          <button @click="closeModal" class="admin-icon-btn">
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
          <form @submit.prevent="saveClient" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Client Name <span class="text-rose-500">*</span></label>
                  <input v-model="form.name" type="text" required class="admin-input" placeholder="Client name">
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-600">Website URL</label>
                  <input v-model="form.external_link" type="url" class="admin-input" placeholder="https://example.com">
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-600">Client Logo</label>
                <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
                  <div v-if="form.logo_url" class="absolute inset-0 flex items-center justify-center bg-white p-6">
                    <img :src="form.logo_url" class="max-h-full max-w-full object-contain">
                  </div>
                  <div v-else class="text-center">
                    <Upload class="mx-auto h-8 w-8 text-slate-400" />
                    <p class="mt-3 text-sm text-slate-500">Click or drag logo here</p>
                  </div>
                  <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/*,.svg" @change="handleLogoUpload">
                </div>
                <p v-if="form.logoFileName" class="mt-2 text-xs text-slate-500">{{ form.logoFileName }}</p>
              </div>
            </div>
          </form>
        </div>

        <div class="flex justify-end gap-3 border-t border-[var(--admin-border)] px-6 py-4">
          <button @click="closeModal" class="admin-secondary-btn">Cancel</button>
          <button @click="saveClient" class="admin-primary-btn">Save Client</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Building2, Edit2, ExternalLink, Plus, Search, Trash2, Upload, X } from 'lucide-vue-next'

const { clients, fetchClients, createClient, updateClient, deleteClient } = useClients()

const isModalOpen = ref(false)
const searchQuery = ref('')
const form = ref({})

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value

  const query = searchQuery.value.toLowerCase()
  return clients.value.filter((item) =>
    [item.name, item.external_link]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const stats = computed(() => [
  { label: 'Total Clients', value: clients.value.length, meta: 'Shown in trusted-by listings' },
  { label: 'With Logo', value: clients.value.filter((item) => item.logo_url).length, meta: 'Ready for homepage display' },
  { label: 'With Website', value: clients.value.filter((item) => item.external_link).length, meta: 'Linked to client website' },
  { label: 'Search Results', value: filteredClients.value.length, meta: 'Current filtered client count' }
])

onMounted(() => {
  fetchClients()
})

const openModal = (item = null) => {
  form.value = item
    ? {
      ...item,
      logoFile: null,
      logoFileName: ''
    }
    : {
      name: '',
      external_link: '',
      logo_url: '',
      logoFile: null,
      logoFileName: ''
    }

  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleLogoUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.logoFile = file
    form.value.logoFileName = file.name
    form.value.logo_url = URL.createObjectURL(file)
  }
}

const saveClient = async () => {
  if (form.value.id) {
    await updateClient(form.value.id, form.value)
  } else {
    await createClient(form.value)
  }

  closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Delete this client?')) {
    await deleteClient(id)
  }
}
</script>
