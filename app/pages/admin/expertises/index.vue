<template>
  <div class="space-y-6" v-motion-fade-up>
    <div class="flex items-center justify-between glass-panel p-6">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 mb-1">Expertises</h1>
        <p class="text-slate-500 text-sm">Manage service items and core capabilities.</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" />
        <span>Add Expertise</span>
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="exp in expertises" :key="exp.id" class="glass-panel p-6 text-center group hover:border-slate-300 transition-colors">
        <div class="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-700 transition-all duration-300">
          <component v-if="hasBuiltinIcon(exp.icon_url)" :is="getIcon(exp.icon_url)" class="w-8 h-8" />
          <img v-else-if="exp.icon_url" :src="exp.icon_url" :alt="exp.name" class="w-8 h-8 object-contain" />
          <component v-else :is="Star" class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ exp.name }}</h3>
        <p class="text-sm text-slate-500 mb-4">{{ exp.description }}</p>
        
        <div class="flex justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <button @click="openModal(exp)" class="text-slate-400 hover:text-slate-700"><Edit2 class="w-4 h-4"/></button>
          <button @click="handleDelete(exp.id)" class="text-slate-400 hover:text-rose-600"><Trash2 class="w-4 h-4"/></button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" v-motion-fade>
      <div class="absolute inset-0 bg-slate-900/40" @click="closeModal"></div>

      <div class="glass-panel w-full max-w-xl relative z-10 p-6" v-motion-slide-visible-bottom>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-slate-900">{{ form.id ? 'Edit Expertise' : 'Add Expertise' }}</h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-700"><X class="w-5 h-5" /></button>
        </div>

        <form @submit.prevent="saveExpertiseItem" class="space-y-4">
          <div><label class="block text-sm text-slate-600 mb-1">Name</label><input v-model="form.name" type="text" required class="input-field"></div>
          <div><label class="block text-sm text-slate-600 mb-1">Description</label><textarea v-model="form.description" rows="4" class="input-field"></textarea></div>
          <div>
            <label class="block text-sm text-slate-600 mb-1">Icon File</label>
            <input type="file" accept="image/*,.svg" class="input-field py-2" @change="handleIconUpload">
            <p v-if="form.iconFileName" class="mt-2 text-xs text-slate-400">{{ form.iconFileName }}</p>
          </div>
          <button type="submit" class="w-full btn-primary py-2">Save Expertise</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Plus, Edit2, Trash2, Cpu, Wifi, Smartphone, ShieldCheck, Star, X } from 'lucide-vue-next'

const iconMap = {
  'Cpu': Cpu,
  'Wifi': Wifi,
  'Smartphone': Smartphone,
  'ShieldCheck': ShieldCheck
}

const getIcon = (name) => {
  return iconMap[name] || Star
}

const hasBuiltinIcon = (name) => Boolean(name && iconMap[name])
const { expertise: expertises, fetchExpertise, createExpertise, updateExpertise, deleteExpertise } = useExpertise()
const isModalOpen = ref(false)
const form = ref({})

onMounted(() => {
  fetchExpertise()
})

const openModal = (item = null) => {
  form.value = item ? {
    ...item,
    iconFile: null,
    iconFileName: ''
  } : {
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
