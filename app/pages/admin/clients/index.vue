<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Trust Signals</p>
          <h1 class="admin-title">Clients</h1>
          <p class="admin-copy">Manage the public client list shown on the landing page, including descriptions and icon assets.</p>
        </div>

        <button @click="openModal()" class="admin-primary-btn">
          <Plus class="h-4 w-4" />
          Add Client
        </button>
      </div>

    </section>

    <section class="admin-table-shell">
      <div class="admin-toolbar">
        <div class="relative min-w-0 xl:w-[320px]">
          <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Search client name or description..." class="admin-input pl-11">
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>Showing {{ filteredClients.length }} entries</span>
        </div>
      </div>

      <div class="custom-scrollbar overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Description</th>
              <th>Icon Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedClients" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-2">
                    <img v-if="item.client_icon" :src="item.client_icon" :alt="item.name" class="max-h-full max-w-full object-contain">
                    <Building2 v-else class="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ item.name }}</p>
                  </div>
                </div>
              </td>
              <td class="max-w-[380px] text-slate-500">
                <p class="line-clamp-2">{{ item.description || '-' }}</p>
              </td>
              <td>
                <span class="admin-status" :class="item.client_icon ? 'admin-status-success' : 'admin-status-warning'">
                  {{ item.client_icon ? 'Ready' : 'Missing' }}
                </span>
              </td>
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
            <tr v-if="!filteredClients.length">
              <td colspan="4" class="admin-empty-state">
                {{ error ? error : 'No clients found.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminPagination
        v-model:page="currentPage"
        v-model:page-size="pageSize"
        :total="clientPaginationTotal"
        label="clients"
      />
    </section>

    <AdminModal
      v-model="isModalOpen"
      kicker="Client Form"
      :title="form.id ? 'Edit Client' : 'Add Client'"
      max-width-class="max-w-3xl"
      :can-close="!isSaving"
    >
      <form @submit.prevent="saveClient" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Client Name <span class="text-rose-500">*</span></label>
              <input v-model="form.name" type="text" required class="admin-input" placeholder="Client name">
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600">Description <span class="text-rose-500">*</span></label>
              <textarea v-model="form.description" rows="6" required class="admin-textarea" placeholder="Long-term technology partner"></textarea>
            </div>
            <p v-if="formError" class="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {{ formError }}
            </p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-600">Client Icon <span class="text-rose-500">*</span></label>
            <div class="relative flex h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] transition hover:border-slate-300 hover:bg-white">
              <div v-if="form.client_icon" class="absolute inset-0 flex items-center justify-center bg-white p-6">
                <img :src="form.client_icon" class="max-h-full max-w-full object-contain">
              </div>
              <div v-else class="text-center">
                <Upload class="mx-auto h-8 w-8 text-slate-400" />
                <p class="mt-3 text-sm text-slate-500">Click or drag icon here</p>
              </div>
              <input type="file" class="absolute inset-0 cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp" aria-label="Upload client icon" @change="handleClientUpload">
            </div>
            <p v-if="form.clientFileName" class="mt-2 text-xs text-slate-500">{{ form.clientFileName }}</p>
          </div>
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" :disabled="isSaving" class="admin-secondary-btn">Cancel</button>
        <button @click="saveClient" :disabled="isSaving" class="admin-primary-btn">
          {{ isSaving ? 'Saving...' : 'Save Client' }}
        </button>
      </template>
    </AdminModal>

    <AdminSuccessModal
      v-model="successState.open"
      :title="successState.title"
      :message="successState.message"
    />

    <AdminConfirmModal
      v-model="deleteState.open"
      title="Delete Client"
      message="This client will be removed from the public trust section. This action cannot be undone."
      :detail="deleteState.name"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Building2, Edit2, Plus, Search, Trash2, Upload } from 'lucide-vue-next'
import { useAdminPagination } from '~/composables/useAdminPagination'

const { clients, error, paginationMeta, fetchClients, createClient, updateClient, deleteClient } = useClients({ immediate: false })

const isModalOpen = ref(false)
const searchQuery = ref('')
const formError = ref('')
const isSaving = ref(false)
const isDeleting = ref(false)
const successState = ref({
  open: false,
  title: '',
  message: ''
})
const form = ref({})
const deleteState = ref({ open: false, id: null, name: '' })

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value

  const query = searchQuery.value.toLowerCase()
  return clients.value.filter((item) =>
    [item.name, item.description]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const isClientServerPaginated = computed(() => paginationMeta.value.isServerPaginated)
const clientPaginationTotal = computed(() => isClientServerPaginated.value ? paginationMeta.value.total : filteredClients.value.length)
const { currentPage, pageSize, paginatedItems: paginatedClients } = useAdminPagination(filteredClients, 10, {
  totalItems: clientPaginationTotal,
  serverSide: isClientServerPaginated
})

const fetchClientPage = () => fetchClients({
  page: currentPage.value,
  limit: pageSize.value,
  search: searchQuery.value.trim()
})

watch([currentPage, pageSize, searchQuery], ([, , search], [, oldPageSize, oldSearch] = []) => {
  if ((pageSize.value !== oldPageSize || search !== oldSearch) && currentPage.value !== 1) {
    currentPage.value = 1
    return
  }

  fetchClientPage()
}, { immediate: true })

const emptyForm = () => ({
  id: null,
  name: '',
  description: '',
  client_icon: '',
  clientFile: null,
  clientFileName: ''
})

const openModal = (item = null) => {
  formError.value = ''
  form.value = item
    ? {
      ...item,
      clientFile: null,
      clientFileName: ''
    }
    : emptyForm()

  isModalOpen.value = true
}

const closeModal = () => {
  if (isSaving.value) return
  isModalOpen.value = false
}

const handleClientUpload = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    form.value.clientFile = file
    form.value.clientFileName = file.name
    form.value.client_icon = URL.createObjectURL(file)
  }
}

const saveClient = async () => {
  formError.value = ''

  if (!form.value.name?.trim() || !form.value.description?.trim()) {
    formError.value = 'Client name and description are required.'
    return
  }

  if (!form.value.id && !form.value.clientFile) {
    formError.value = 'A client icon is required when creating a client.'
    return
  }

  if (!isSupportedImageFile(form.value.clientFile)) {
    formError.value = 'Client icon must be a JPG, PNG, or WEBP image.'
    return
  }

  isSaving.value = true

  try {
    const isEditing = Boolean(form.value.id)

    if (isEditing) {
      await updateClient(form.value.id, form.value)
    } else {
      await createClient(form.value)
    }

    isModalOpen.value = false
    await fetchClientPage()
    successState.value = {
      open: true,
      title: isEditing ? 'Client updated' : 'Client created',
      message: isEditing
        ? 'The client profile has been updated successfully.'
        : 'The new client profile has been added successfully.'
    }
  } catch (error) {
    const fieldErrors = getApiFieldErrors(error)
    formError.value = fieldErrors.name || fieldErrors.description || fieldErrors.client_icon || getApiErrorMessage(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = (id) => {
  const client = clients.value.find((item) => item.id === id)
  deleteState.value = { open: true, id, name: client?.name || `Client ID ${id}` }
}

const confirmDelete = async () => {
  if (!deleteState.value.id || isDeleting.value) return

  isDeleting.value = true
  try {
    await deleteClient(deleteState.value.id)
    deleteState.value = { open: false, id: null, name: '' }
    await fetchClientPage()
  } finally {
    isDeleting.value = false
  }
}
</script>
